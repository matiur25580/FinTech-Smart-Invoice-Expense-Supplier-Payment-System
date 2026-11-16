/// <reference types="vite/client" />
export type SessionUser={id:string;name:string;email:string;role:"admin"|"accountant"|"supplier"|"employee"};
export type AuthResult={user:SessionUser;accessToken:string};
const API_URL=(import.meta.env.VITE_API_URL as string|undefined)??"http://localhost:4000";
let access:string|null=null;
let refreshPromise:Promise<boolean>|null=null;
export function saveSession(s:AuthResult){access=s.accessToken;localStorage.removeItem("finflow.access");localStorage.removeItem("finflow.refresh");localStorage.setItem("finflow.user",JSON.stringify(s.user));}
export function clearSession(){access=null;["finflow.access","finflow.refresh","finflow.user"].forEach(k=>localStorage.removeItem(k));}
export function savedUser():SessionUser|null{try{return JSON.parse(localStorage.getItem("finflow.user")??"null") as SessionUser|null;}catch{return null;}}
async function renew():Promise<boolean>{if(refreshPromise)return refreshPromise;refreshPromise=(async()=>{try{const r=await fetch(API_URL+"/api/auth/refresh",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}});if(!r.ok)return false;const d=await r.json() as {accessToken:string};if(!d.accessToken)return false;access=d.accessToken;return true;}catch{return false;}finally{refreshPromise=null;}})();return refreshPromise;}
export async function logout(allDevices=false):Promise<void>{try{await fetch(API_URL+(allDevices?"/api/auth/logout-all":"/api/auth/logout"),{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}});}finally{clearSession();}}
export async function api<T>(path:string,method="GET",body?:unknown,retry=true):Promise<T>{const headers:Record<string,string>={"Content-Type":"application/json"};if(access)headers.Authorization="Bearer "+access;const r=await fetch(API_URL+path,{method,credentials:"include",headers,...(body===undefined?{}:{body:JSON.stringify(body)})});if(r.status===401&&retry){if(await renew())return api<T>(path,method,body,false);clearSession();}const d=await r.json().catch(()=>({})) as {message?:string};if(!r.ok)throw new Error(d.message??"Request failed ("+r.status+")");return d as T;}
export async function downloadInvoicePdf(path:string,filename:string):Promise<void>{const request=()=>fetch(API_URL+path,{credentials:"include",headers:access?{Authorization:"Bearer "+access}:{}});let r=await request();if(r.status===401&&await renew())r=await request();if(!r.ok){const d=await r.json().catch(()=>({})) as {message?:string};if(r.status===401)clearSession();throw new Error(d.message??"Could not download invoice PDF");}const blob=await r.blob(),url=URL.createObjectURL(blob),anchor=document.createElement("a");anchor.href=url;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);}
export const login=(email:string,password:string)=>api<AuthResult>("/api/auth/login","POST",{email,password});
export const register=(name:string,email:string,password:string)=>api<AuthResult>("/api/auth/register","POST",{name,email,password});
export const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n);
export const dateText=(v?:string)=>v?new Date(v).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—";
