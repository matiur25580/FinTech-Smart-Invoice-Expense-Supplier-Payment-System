/// <reference types="vite/client" />
export type SessionUser={id:string;name:string;email:string;role:"admin"|"accountant"|"supplier"|"employee"};
export type AuthResult={user:SessionUser;accessToken:string;refreshToken:string};
const API_URL=(import.meta.env.VITE_API_URL as string|undefined)??"http://localhost:4000";
let access=localStorage.getItem("finflow.access"),refresh=localStorage.getItem("finflow.refresh");
export function saveSession(s:AuthResult){access=s.accessToken;refresh=s.refreshToken;localStorage.setItem("finflow.access",access);localStorage.setItem("finflow.refresh",refresh);localStorage.setItem("finflow.user",JSON.stringify(s.user));}
export function clearSession(){access=null;refresh=null;["finflow.access","finflow.refresh","finflow.user"].forEach(k=>localStorage.removeItem(k));}
export function savedUser():SessionUser|null{try{return JSON.parse(localStorage.getItem("finflow.user")??"null") as SessionUser|null;}catch{return null;}}
async function renew(){if(!refresh)return false;try{const r=await fetch(API_URL+"/api/auth/refresh",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:refresh})});if(!r.ok)return false;const d=await r.json() as {accessToken:string;refreshToken?:string};access=d.accessToken;localStorage.setItem("finflow.access",access);if(d.refreshToken){refresh=d.refreshToken;localStorage.setItem("finflow.refresh",refresh);}return true;}catch{return false;}}
export async function api<T>(path:string,method="GET",body?:unknown,retry=true):Promise<T>{const headers:Record<string,string>={"Content-Type":"application/json"};if(access)headers.Authorization="Bearer "+access;const r=await fetch(API_URL+path,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})});if(r.status===401&&retry&&await renew())return api<T>(path,method,body,false);const d=await r.json().catch(()=>({})) as {message?:string};if(!r.ok){if(r.status===401)clearSession();throw new Error(d.message??"Request failed ("+r.status+")");}return d as T;}
export const login=(email:string,password:string)=>api<AuthResult>("/api/auth/login","POST",{email,password});
export const register=(name:string,email:string,password:string)=>api<AuthResult>("/api/auth/register","POST",{name,email,password});
export const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n);
export const dateText=(v?:string)=>v?new Date(v).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—";
