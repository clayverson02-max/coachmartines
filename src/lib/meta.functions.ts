import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { META_PIXEL_ID } from '@/config/quiz';

const events = ['PageView','quiz_view','quiz_start','quiz_rol','quiz_q1','quiz_q2','quiz_q3','quiz_q4','quiz_step_view','quiz_loading','quiz_result_view','ViewContent','checkout_click_completo','checkout_click_basico','InitiateCheckout'] as const;
async function signature(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');
}
function checkOrigin() {
  const request = getRequest();
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) throw new Error('Invalid origin');
  return request;
}
export const createTrackingSession = createServerFn({method:'POST'}).handler(async()=>{
  checkOrigin();
  const secret = process.env['META_TRACKING_SIGNING_SECRET'];
  if (!secret) throw new Error('Tracking unavailable');
  const value = `${crypto.randomUUID()}.${Date.now() + 86400000}`;
  return `${value}.${await signature(value, secret)}`;
});
export const sendMetaEvent = createServerFn({method:'POST'})
  .inputValidator((input:unknown)=>z.object({session:z.string().max(200),name:z.enum(events),id:z.string().uuid(),url:z.string().url().max(2000),rol:z.enum(['entrenador','jugador']).optional(),step:z.string().max(30).optional(),plan:z.enum(['completo','basico']).optional(),fbp:z.string().max(200).optional(),fbc:z.string().max(300).optional()}).parse(input))
  .handler(async({data})=>{
    const request = checkOrigin();
    const secret = process.env['META_TRACKING_SIGNING_SECRET'];
    const accessToken = process.env['META_ACCESS_TOKEN'];
    if (!secret || !accessToken) return {ok:false};
    const [uuid,expiry,sig] = data.session.split('.');
    if (!uuid || !expiry || !sig || Number(expiry)<Date.now() || sig !== await signature(`${uuid}.${expiry}`,secret)) return {ok:false};
    if(new URL(data.url).origin !== new URL(request.url).origin) return {ok:false};
    const externalId = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(uuid)))).map(x=>x.toString(16).padStart(2,'0')).join('');
    const response=await fetch(`https://graph.facebook.com/v23.0/${META_PIXEL_ID}/events`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({access_token:accessToken,data:[{event_name:data.name,event_time:Math.floor(Date.now()/1000),event_id:data.id,action_source:'website',event_source_url:data.url,user_data:{external_id:[externalId],client_user_agent:request.headers.get('user-agent') || undefined,client_ip_address:request.headers.get('cf-connecting-ip') || undefined,fbp:data.fbp,fbc:data.fbc},custom_data:{variante:'quiz',rol:data.rol,step:data.step,plan:data.plan,...(data.plan ? {currency:'USD',value:data.plan==='completo'?4.5:4,content_name:data.plan==='completo'?'Paquete Completo':'Paquete Básico',purchase_trigger:'checkout_click'}:{})}}]})});
    const result = await response.json() as {error?:{code?:number;error_subcode?:number}};
    return {ok:response.ok,...(!response.ok?{code:result.error?.code,subcode:result.error?.error_subcode}:{})};
  });