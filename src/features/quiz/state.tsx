import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type Role='entrenador'|'jugador';
export type QuizState={step:number;rol:Role;answers:number[][]};
const initial:QuizState={step:0,rol:'entrenador',answers:[[],[],[],[]]};
const Context=createContext<{state:QuizState;update:(state:QuizState)=>void;ready:boolean}|null>(null);
export function QuizProvider({children}:{children:ReactNode}) {
  const [state,setState]=useState(initial);const [ready,setReady]=useState(false);
  useEffect(()=>{
    try {const raw=sessionStorage.getItem('ecm-quiz');if(raw){const saved=JSON.parse(raw);if(Number.isInteger(saved.step)&&saved.step>=0&&saved.step<=10&&['entrenador','jugador'].includes(saved.rol)&&Array.isArray(saved.answers)&&saved.answers.length===4&&saved.answers.every((a:unknown)=>Array.isArray(a)&&a.every(x=>Number.isInteger(x)&&x>=0&&x<5)))setState(saved);}
      if(!sessionStorage.getItem('ecm-attribution'))sessionStorage.setItem('ecm-attribution',window.location.search);
    }catch{/* Storage may be unavailable. */}setReady(true);
  },[]);
  function update(next:QuizState){setState(next);try{sessionStorage.setItem('ecm-quiz',JSON.stringify(next));}catch{/* No storage */}}
  return <Context.Provider value={{state,update,ready}}>{children}</Context.Provider>;
}
export function useQuiz(){const value=useContext(Context);if(!value)throw new Error('Missing QuizProvider');return value;}
export function checkoutUrl(base:string,search:string){const url=new URL(base);const incoming=new URLSearchParams(search);for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','src','sck']){const val=incoming.get(key);if(val)url.searchParams.set(key,val);}return url.toString();}