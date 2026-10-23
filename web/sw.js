const CACHE='higienizapro-pwa-v11';
const CORE=['/','/manifest.webmanifest','/icon.svg'];
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.addAll(CORE)}catch(error){console.warn('Pré-cache indisponível; o app continuará usando a rede',error)}await self.skipWaiting()})()));
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('higienizapro-pwa-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 // Always ask the server for the latest HTML, worker, manifest and same-origin assets.
 // Cache is only a fallback when offline; never prefer a potentially stale cached file.
 event.respondWith((async()=>{
   try{
     const freshRequest=new Request(request,{cache:'no-store'});
     const response=await fetch(freshRequest,{cache:'no-store'});
     if(response&&response.ok&&response.type!=='opaque'){
       const cache=await caches.open(CACHE);
       await cache.put(request,response.clone()).catch(()=>{});
     }
     return response;
   }catch(error){
     const cached=await caches.match(request);
     if(cached)return cached;
     if(request.mode==='navigate')return (await caches.match('/'))||Response.error();
     return Response.error();
   }
 })());
});