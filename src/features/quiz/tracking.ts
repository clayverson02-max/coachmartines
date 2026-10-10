import { createTrackingSession, sendMetaEvent } from '@/lib/meta.functions';
import { META_PIXEL_ID } from '@/config/quiz';
type Pixel = ((...args:unknown[])=>void) & {queue:unknown[][];loaded:boolean;version:string;callMethod?:(...args:unknown[])=>void;push?:Pixel};
declare global { interface Window {fbq?:Pixel;_fbq?:Pixel;} }
let trackingSession: Promise<string> | undefined;
export function initTracking() {
  if (!window.fbq) {
    const pixel = ((...args:unknown[])=>{if(pixel.callMethod)pixel.callMethod(...args);else pixel.queue.push(args);}) as Pixel;
    pixel.queue=[];pixel.loaded=true;pixel.version='2.0';pixel.push=pixel;
    window.fbq=pixel;window._fbq=pixel;
    const script=document.createElement('script');script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(script);
    pixel('init',META_PIXEL_ID);
  }
  trackingSession ||= createTrackingSession();
  track('PageView');track('quiz_view');
}
export function track(name:string, extra:{rol?:'entrenador'|'jugador';step?:string;plan?:'completo'|'basico'}={}) {
  const key='ecm-event:'+name+(extra.step?':'+extra.step:'')+(extra.plan?':'+extra.plan:'');
  try {if(sessionStorage.getItem(key))return Promise.resolve();sessionStorage.setItem(key,'1');}catch{/* Tracking still works without storage. */}
  const id=crypto.randomUUID();
  const standard=['PageView','ViewContent','InitiateCheckout','Purchase'].includes(name);
  const params={variante:'quiz',...extra,...(extra.plan?{currency:'USD',value:extra.plan==='completo'?5:4.5,purchase_trigger:'checkout_click'}:{})};
  window.fbq?.(standard?'track':'trackCustom',name,params,{eventID:id});
  const cookie=(name:string)=>document.cookie.split('; ').find(x=>x.startsWith(name+'='))?.split('=').slice(1).join('=');
  return (trackingSession ||= createTrackingSession()).then(session=>sendMetaEvent({data:{session,name,id,url:window.location.href,...extra,...(cookie('_fbp')?{fbp:cookie('_fbp')} : {}),...(cookie('_fbc')?{fbc:cookie('_fbc')} : {})}})).then(()=>undefined).catch(()=>undefined);
}