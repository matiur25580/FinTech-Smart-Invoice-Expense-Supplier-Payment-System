import {createHash,randomBytes} from "node:crypto";
export const REFRESH_COOKIE="finflow.refresh";
export const REFRESH_TTL_SECONDS=7*24*60*60;
export const hashRefreshToken=(token:string)=>createHash("sha256").update(token).digest("hex");
export const generateRefreshToken=()=>randomBytes(48).toString("base64url");
export function refreshCookieHeader(token:string,production:boolean,ttlSeconds=REFRESH_TTL_SECONDS){const sameSite=production?"None":"Lax";return REFRESH_COOKIE+"="+encodeURIComponent(token)+"; Path=/api/auth; HttpOnly; SameSite="+sameSite+"; Max-Age="+ttlSeconds+(production?"; Secure":"");}
export function clearRefreshCookieHeader(production:boolean){const sameSite=production?"None":"Lax";return REFRESH_COOKIE+"=; Path=/api/auth; HttpOnly; SameSite="+sameSite+"; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"+(production?"; Secure":"");}
export function readRefreshCookieHeader(cookieHeader:string|undefined){const pair=(cookieHeader??"").split(";").map(x=>x.trim()).find(x=>x.startsWith(REFRESH_COOKIE+"="));if(!pair)return null;try{return decodeURIComponent(pair.slice(REFRESH_COOKIE.length+1));}catch{return null;}}
export function isTrustedOrigin(origin:string|undefined,clientUrl:string){try{return !!origin&&new URL(origin).origin===new URL(clientUrl).origin;}catch{return false;}}
