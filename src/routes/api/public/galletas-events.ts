import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { GALLETAS_PIXEL_ID, checkoutEventData, permitsAdvertising } from '@/lib/galletas-tracking-policy';

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)))).map(x => x.toString(16).padStart(2, '0')).join('');
}
const input = z.object({ action: z.enum(['session', 'event']), optedOut: z.boolean(), country: z.string().length(2), session: z.string().max(200).optional(), name: z.enum(['PageView', 'Lead', 'InitiateCheckout']).optional(), plan: z.enum(['basic', 'complete']).optional(), id: z.string().uuid().optional(), occurredAt: z.number().int().optional() }).strict();
export const Route = createFileRoute('/api/public/galletas-events')({
  server: { handlers: { POST: async ({ request }) => {
    const origin = new URL(request.url).origin;
    if (request.headers.get('origin') !== origin) return Response.json({ ok: false }, { status: 403 });
    const data = input.safeParse(await request.json().catch(() => null));
    if (!data.success) return Response.json({ ok: false }, { status: 400 });
    const payload = data.data;
    const country = request.headers.get('cf-ipcountry') ?? (request as Request & { cf?: { country?: string } }).cf?.country;
    if (!permitsAdvertising(country, payload.optedOut) || country !== payload.country || request.headers.get('sec-gpc') === '1') return Response.json({ ok: false, blocked: true });
    const secret = process.env['META_TRACKING_SIGNING_SECRET'];
    if (!secret) return Response.json({ ok: false }, { status: 503 });
    if (payload.action === 'session') {
      const value = `${crypto.randomUUID()}.${Date.now() + 3600000}`;
      return Response.json({ session: `${value}.${await sign(value, secret)}` });
    }
    const { session, name, id, occurredAt } = payload;
    if (!session || !name || !id || !occurredAt) return Response.json({ ok: false }, { status: 400 });
    if (name === 'InitiateCheckout' && !payload.plan) return Response.json({ ok: false }, { status: 400 });
    const [uuid, expiry, signature] = session.split('.');
    if (!uuid || !expiry || !signature || !Number.isFinite(Number(expiry)) || Number(expiry) < Date.now() || signature !== await sign(`${uuid}.${expiry}`, secret) || Math.abs(Date.now()/1000 - occurredAt) > 300) return Response.json({ ok: false }, { status: 403 });
    const token = process.env['META_ACCESS_TOKEN'];
    if (!token) return Response.json({ ok: false }, { status: 503 });
    const response = await fetch(`https://graph.facebook.com/v26.0/${GALLETAS_PIXEL_ID}/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ partner_agent: 'lovable', data: [{ event_name: name, event_time: occurredAt, event_id: id, action_source: 'website', event_source_url: origin + '/', user_data: { client_user_agent: request.headers.get('user-agent'), client_ip_address: request.headers.get('cf-connecting-ip') }, ...(name === 'InitiateCheckout' && payload.plan ? { custom_data: checkoutEventData(payload.plan) } : {}) }] }),
    });
    const result = await response.json().catch(() => ({})) as { events_received?: number; error?: { code?: number } };
    return Response.json({ ok: response.ok && (result.events_received ?? 0) > 0, ...(response.ok ? { received: result.events_received } : { code: result.error?.code }) }, { status: response.ok ? 200 : 502 });
  } } },
});