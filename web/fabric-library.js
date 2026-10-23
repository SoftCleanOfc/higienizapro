/* HigienizaPro · DINOv2: análise visual local multi-escala. */
(function(){
'use strict';
if(window.__higienizaFabricLibraryLoaded)return;window.__higienizaFabricLibraryLoaded=true;
const F=[
['linho','Linho natural','Tecidos planos','natural linen upholstery fabric visible irregular flax yarns plain weave','Trama irregular de fibras de linho; a aparência não confirma a composição.'],
['linho-misto','Linho misto / efeito linho','Tecidos planos','linen look upholstery fabric blend irregular natural looking woven yarns','Pode ser poliéster, algodão, viscose ou mistura com aparência de linho.'],
['algodao','Algodão','Fibras naturais e misturas','cotton upholstery fabric matte plain woven natural textile','A fibra precisa ser confirmada pela etiqueta; pode absorver líquidos.'],
['sarja','Sarja','Tecidos planos','twill weave upholstery textile diagonal rib lines close up','Trama diagonal que pode usar fibras diferentes.'],
['lona','Lona / canvas','Tecidos planos','heavy canvas upholstery fabric sturdy plain weave thick yarns','Tecido encorpado; composição e acabamento variam.'],
['oxford','Oxford','Tecidos planos','oxford basket weave upholstery textile close up','Trama com efeito de cestaria; o nome não define a fibra.'],
['microfibra','Microfibra','Superfícies macias','microfiber polyester sofa upholstery fine dense smooth matte surface','Superfície fina e densa, frequentemente confundida com suede.'],
['microfibra-escovada','Microfibra escovada','Superfícies macias','brushed microfiber upholstery fabric soft short nap texture','Acabamento escovado; a tonalidade pode mudar ao passar a mão.'],
['suede','Suede sintético','Superfícies macias','synthetic suede upholstery fabric matte short directional nap close up','Pelo curto e aveludado; não confirma resistência à água.'],
['alcantara','Microfibra tipo Alcantara','Superfícies macias','premium microsuede microfiber upholstery fabric fine uniform matte nap','Aparência visual não confirma marca nem composição.'],
['veludo','Veludo','Tecidos de pelo','velvet upholstery fabric dense short pile directional sheen close up','Pelo denso com brilho que muda de direção.'],
['veludo-cotele','Veludo cotelê','Tecidos de pelo','corduroy upholstery fabric parallel raised ribs velvet pile close up','Nervuras paralelas; escovação pode marcar o pelo.'],
['veludo-molhado','Veludo efeito molhado','Tecidos de pelo','crushed wet look velvet upholstery fabric irregular shiny directional pile','Reflexos variáveis não indicam que o tecido possa ser molhado.'],
['chenille','Chenille','Tecidos felpudos','chenille upholstery fabric fuzzy bulky yarns soft textured surface close up','Fios felpudos; atrito excessivo pode alterar a superfície.'],
['chenille-fino','Chenille fino','Tecidos felpudos','fine chenille upholstery textile short fuzzy yarn textured woven surface','Observar formação de bolinhas e delicadeza dos fios.'],
['boucle','Bouclé','Tecidos felpudos','boucle upholstery fabric looped curly knotted yarn texture close up','Laços e nós aparentes; escovas podem puxar fios.'],
['boucle-grosso','Bouclé grosso','Tecidos felpudos','chunky boucle upholstery fabric large looped yarns thick nubby texture','Laçadas grandes e salientes.'],
['jacquard','Jacquard','Tecidos trabalhados','jacquard woven upholstery textile intricate woven pattern raised yarns','Desenho formado pela tecelagem, não uma fibra específica.'],
['tapeçaria','Tapeçaria','Tecidos trabalhados','heavy tapestry upholstery fabric multicolor woven decorative motif','Tecido decorativo encorpado; avaliar fibras e tingimento.'],
['damasco','Damasco','Tecidos trabalhados','damask upholstery fabric woven tonal ornamental pattern sheen','Padrão ornamental frequentemente com contraste de brilho.'],
['brocado','Brocado','Tecidos trabalhados','brocade upholstery textile raised ornate woven pattern','Tecido decorativo com relevo e possíveis fios delicados.'],
['matelasse','Matelassê','Tecidos trabalhados','matelasse quilted textured upholstery textile raised padded pattern','Efeito acolchoado, não uma composição específica.'],
['pique','Piquê','Tecidos trabalhados','pique upholstery fabric small raised geometric waffle texture close up','Relevo geométrico; pode ser tecido plano ou malha.'],
['waffle','Waffle / colmeia','Tecidos trabalhados','waffle weave upholstery textile small square recessed grid texture','Relevo com cavidades que podem reter partículas.'],
['canelado','Tecido canelado','Tecidos trabalhados','ribbed upholstery textile parallel raised channels close up','Nervuras elevadas; não necessariamente veludo cotelê.'],
['malha','Malha / tricot','Malhas e elásticos','knitted upholstery fabric visible interlocking loops stretch textile','Laçadas que podem esticar ou deformar.'],
['malha-poliester','Malha de poliéster','Malhas e elásticos','polyester knitted upholstery fabric synthetic interlooped yarn texture','Confirmar composição e recomendações de lavagem.'],
['suede-elastano','Suede elástico','Malhas e elásticos','stretch suede upholstery fabric smooth short nap elastic textile','Pode conter elastano; calor e químicos podem afetar elasticidade.'],
['poliester','Poliéster plano','Sintéticos e mistos','plain woven polyester upholstery fabric uniform synthetic yarn texture','Fibra sintética comum; acabamentos variam.'],
['poli-algodao','Poliéster com algodão','Sintéticos e mistos','poly cotton blend upholstery fabric plain woven textile','Comportamento depende da proporção e do acabamento.'],
['viscose','Viscose / rayon','Sintéticos e mistos','viscose rayon upholstery textile smooth woven soft lustrous yarn texture','Pode ser sensível à umidade e fricção.'],
['acrilico','Acrílico','Sintéticos e mistos','acrylic upholstery fabric woven synthetic yarns soft textured surface','Fibra sintética; confirmar ficha técnica.'],
['polipropileno','Polipropileno / olefina','Sintéticos e mistos','polypropylene olefin upholstery fabric synthetic woven yarn texture','Usado em alguns estofados; confirmar construção e acabamento.'],
['nylon','Náilon / poliamida','Sintéticos e mistos','nylon polyamide upholstery textile woven synthetic fiber close up','A aparência visual não confirma a composição.'],
['crepe','Crepe','Tecidos planos','crepe upholstery fabric slightly pebbled irregular crinkled woven texture','Superfície granulada ou enrugada; nome pode descrever acabamento.'],
['flocado','Tecido flocado','Superfícies macias','flocked upholstery fabric tiny short fibers bonded onto textile surface','Fibras aplicadas à superfície podem sofrer com atrito e químicos.'],
['feltro','Feltro','Não tecidos e especiais','felt upholstery material dense matted nonwoven fibers no visible weave','Fibras compactadas sem trama evidente.'],
['nao-tecido','Tecido não tecido','Não tecidos e especiais','nonwoven textile material randomly bonded fibers close up','Estrutura sem trama tradicional; categoria ampla.'],
['mesh','Tela / mesh','Não tecidos e especiais','mesh upholstery fabric open net grid textile structure close up','Estrutura aberta; avaliar substrato e revestimento.'],
['spacer3d','Malha spacer 3D','Não tecidos e especiais','three dimensional spacer mesh textile layered knitted open structure','Estrutura ventilada tridimensional.'],
['impermeabilizado','Tecido com repelência','Acabamentos especiais','water repellent treated upholstery fabric woven textile surface','Repelência é acabamento, não fibra; não prova impermeabilidade.'],
['resinado','Tecido resinado','Acabamentos especiais','resin coated upholstery textile smooth coated fabric surface close up','Revestimento pode reagir a solventes, calor e fricção.'],
['laminado','Tecido laminado','Acabamentos especiais','laminated upholstery fabric bonded backing textile surface','Possui camadas unidas; umidade pode afetar a laminação.'],
['estampado','Tecido estampado','Estampados','printed sofa upholstery fabric colorful surface print on textile weave','Estampa não identifica a fibra; verificar solidez da cor.'],
['listrado','Tecido listrado','Estampados','striped upholstery fabric woven textile alternating colored stripes close up','Listras podem ser tecidas ou impressas.'],
['seda','Seda natural','Fibras naturais e misturas','silk upholstery textile fine smooth lustrous delicate woven fibers','Fibra delicada que requer cuidados específicos.'],
['seda-mista','Mistura com seda','Fibras naturais e misturas','silk blend upholstery fabric fine lustrous woven textile','Composição não pode ser confirmada por foto.'],
['juta','Juta / fibra vegetal','Fibras naturais e misturas','jute upholstery textile coarse natural plant fiber woven burlap texture','Fibra vegetal grossa; atenção à umidade e atrito.'],
['rami','Rami','Fibras naturais e misturas','ramie natural bast fiber upholstery fabric crisp woven irregular yarns','Fibra vegetal menos comum; confirmar etiqueta.'],
['couro','Couro natural liso','Couros e sintéticos','smooth natural leather sofa upholstery fine irregular grain close up','Couro natural requer produtos indicados para couro.'],
['couro-granulado','Couro granulado','Couros e sintéticos','natural leather upholstery pronounced pebble grain texture close up','Grão pode ser natural ou estampado.'],
['nubuck','Nobuck / nubuck','Couros e sintéticos','nubuck leather upholstery fine velvety sanded grain texture close up','Couro lixado aveludado; não tratar como tecido comum.'],
['camurca','Camurça natural','Couros e sintéticos','natural suede leather upholstery surface short nap matte texture','Acabamento aveludado de couro, exige cuidado próprio.'],
['corino','Corino / couro sintético','Couros e sintéticos','artificial leatherette upholstery vinyl surface embossed leather grain','Revestimento sintético; solventes podem danificar a superfície.'],
['courvin','Courvin / vinil','Couros e sintéticos','vinyl upholstery material smooth embossed grain synthetic leather','Confirmar acabamento e recomendações do fabricante.'],
['pu','Couro sintético PU','Couros e sintéticos','polyurethane PU synthetic leather upholstery fine artificial grain surface','Poliuretano; produtos inadequados podem danificar a camada.'],
['pvc','Couro sintético PVC','Couros e sintéticos','PVC faux leather upholstery shiny synthetic grain surface','Evitar solventes não autorizados pelo fabricante.'],
['reconstituido','Couro reconstituído','Couros e sintéticos','bonded reconstituted leather upholstery uniform artificial grain surface','Pode degradar com produtos inadequados.'],
['outdoor','Tecido outdoor','Acabamentos especiais','outdoor performance upholstery fabric solution dyed acrylic water resistant woven textile','Categoria de desempenho, não uma fibra única.'],
['trama-aberta','Trama aberta','Tecidos planos','open weave decorative upholstery textile visible gaps between yarns','Líquidos podem atravessar a trama e alcançar a espuma.'],
['reciclado','Tecido de fibras recicladas','Sintéticos e mistos','recycled mixed fiber upholstery fabric multicolored flecked woven yarn texture','A aparência não comprova conteúdo reciclado.'],
['tecnico','Tecido técnico de alta resistência','Não tecidos e especiais','technical high abrasion resistance upholstery textile dense engineered woven fabric','Categoria de uso; verificar ficha técnica.'],
['la','Lã','Fibras naturais e misturas','wool upholstery fabric woven wool yarns matte textured surface','Fibra animal; confirmar composição e instruções de limpeza.'],
['mohair','Mohair','Fibras naturais e misturas','mohair upholstery fabric lustrous long pile wool textile close up','Pelo com brilho; pode ser confundido com veludo ou chenille.'],
['velour','Velour / veludo baixo','Tecidos de pelo','velour upholstery fabric short dense soft pile matte sheen','Pelo curto; a nomenclatura comercial varia por fabricante.'],
['cetim','Cetim / satin','Tecidos planos','satin upholstery textile smooth glossy face woven fabric','Face lisa e brilhante; pode escorregar e marcar com fricção.'],
['tafeta','Tafetá','Tecidos planos','taffeta upholstery textile crisp fine plain weave slight sheen','Tecido firme e fino; pode apresentar ruído e marcas de pressão.'],
['canhamo','Cânhamo','Fibras naturais e misturas','hemp upholstery fabric coarse natural bast fiber woven texture','Fibra vegetal; confirmar composição e acabamento.'],
['algodao-cru','Algodão cru','Fibras naturais e misturas','undyed natural cotton upholstery fabric beige visible cotton fibers plain weave','A cor natural não comprova ausência de corantes ou tratamentos.'],
['gorgurao','Gorgurão','Tecidos planos','grosgrain upholstery ribbon like fabric pronounced fine transverse ribs','Nervuras transversais; pode ser decorativo ou parte de painel.'],
['pelucia','Pelúcia sintética','Tecidos de pelo','synthetic plush upholstery fabric long soft dense pile fibers close up','Pelo longo retém sujeira e pode deformar com calor ou fricção.'],
['pele-sintetica','Pelo sintético / faux fur','Tecidos de pelo','faux fur upholstery textile long synthetic hair pile close up','Pelo comprido; evitar procedimentos que embaracem ou soltem fibras.'],
['carneiro-sintetico','Sherpa / pele de carneiro sintética','Tecidos de pelo','sherpa faux shearling upholstery fabric curly fleece pile texture','Superfície encaracolada e volumosa; não inferir composição só pela aparência.'],
['acrilico-outdoor','Acrílico tingido para área externa','Acabamentos especiais','solution dyed acrylic outdoor upholstery fabric woven yarn texture','Categoria de uso outdoor; verificar etiqueta e tratamento aplicado.'],
['gorgurao-canelado','Tecido de nervuras largas','Tecidos trabalhados','wide ribbed upholstery textile raised parallel ridges woven texture','Nervuras largas podem lembrar veludo cotelê, mas a construção pode diferir.'],
['sarja-pesada','Sarja pesada','Tecidos planos','heavy twill upholstery fabric thick diagonal weave yarns','Trama diagonal encorpada; composição e tingimento precisam de confirmação.'],
['chenille-jacquard','Jacquard chenille','Tecidos trabalhados','chenille jacquard upholstery fabric decorative woven pattern fuzzy yarn texture','Combina desenho tecido e fios felpudos; atrito pode alterar o pelo.'],
['algodao-poli-textura','Mistura texturizada algodão/poliéster','Sintéticos e mistos','textured cotton polyester blend upholstery fabric woven mixed yarn texture','A aparência não informa a proporção das fibras.'],
['sarja-estampada','Sarja estampada','Estampados','printed twill upholstery fabric diagonal weave colored printed pattern','Pode combinar trama diagonal e estampa; avaliar solidez da cor.'],
['poliester-mesclado','Poliéster mesclado','Sintéticos e mistos','heathered polyester upholstery fabric mixed color yarn woven texture','Fios mesclados não comprovam origem reciclada ou composição exata.'],
['revestido-pu-textil','Tecido têxtil revestido com PU','Acabamentos especiais','PU coated textile upholstery fabric smooth polymer coating over woven backing','A camada superficial pode descascar com produto ou atrito inadequado.'],
['revestido-acrilico','Tecido com revestimento acrílico','Acabamentos especiais','acrylic coated upholstery textile fabric coated surface visible woven backing','Revestimento é acabamento; seguir ficha técnica do fabricante.'],
['outro','Outro / inconclusivo','Outros','unidentified sofa upholstery textile fabric texture not matching common categories','Não force uma identificação; confira etiqueta ou ficha técnica.']
].map(a=>({id:a[0],name:a[1],family:a[2],prompt:a[3],desc:a[4]}));
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let dinoModelPromise=null,file=null,url=null,matches=[],lastDinoVector=null;

function status(t){const legacy=$('fl-status');if(legacy)legacy.textContent=t;const m=String(t||'').toLowerCase();const failed=/erro|falh|não foi|não foi possível/.test(m);const finished=/concluíd|finalizad/.test(m);const ready=/pronto|aguardando/.test(m)&&!failed;const runtime=document.getElementById('dinoRuntimeStatus');if(runtime)runtime.textContent=failed?'Não foi possível concluir a análise':finished?'Análise concluída':ready?'Scanner pronto para iniciar':/baix|carreg|prepar|modelo/.test(m)?'Preparando scanner óptico':'Analisando a trama do tecido';const stage=document.getElementById('dinoStatusText');if(stage)stage.textContent=failed?'ANÁLISE INTERROMPIDA':finished?'ANÁLISE CONCLUÍDA':ready?'PRONTO PARA ESCANEAR':/baix|carreg|prepar|modelo/.test(m)?'PREPARANDO SCANNER ÓPTICO':'ANALISANDO A TRAMA DO TECIDO'}function progress(n){const v=Math.max(0,Math.min(100,Number(n)||0));const legacy=$('fl-progress');if(legacy)legacy.style.width=v+'%';const bar=document.getElementById('dino-progress');if(bar)bar.style.width=v+'%';const label=document.getElementById('dino-progress-label');if(label)label.textContent=Math.round(v)+'%'}
const DINO_KEY='higienizapro_dinov2_reference_vectors_v2';
function loadReferenceVectors(){try{const x=JSON.parse(localStorage.getItem(DINO_KEY)||'[]');return Array.isArray(x)?x.filter(r=>r&&typeof r.label==='string'&&Array.isArray(r.vector)&&r.vector.length).map(r=>({...r,vector:compactDinoVector(r.vector)})):[]}catch(e){return []}}
function referenceSummary(){const refs=loadReferenceVectors(),counts={};refs.forEach(r=>counts[r.label]=(counts[r.label]||0)+1);const labels=Object.keys(counts).length;return refs.length+' exemplo(s) rotulado(s) em '+labels+' categoria(s). '+(labels?Object.entries(counts).map(([id,n])=>{const f=F.find(x=>x.id===id);return (f?f.name:id)+': '+n}).join(' · '):'Adicione fotos com rótulos confirmados para começar.')}
function addReferenceVector(item){const refs=loadReferenceVectors();refs.push(item);localStorage.setItem(DINO_KEY,JSON.stringify(refs.slice(-120)))}
async function getDinoModel(){if(dinoModelPromise)return dinoModelPromise;dinoModelPromise=(async()=>{status('Preparando scanner óptico…');progress(4);const mod=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2');const opts={dtype:'q8',progress_callback:p=>{if(p&&typeof p.progress==='number')progress(10+p.progress*.65)}};let pipe;if(navigator.gpu){try{pipe=await mod.pipeline('image-feature-extraction','Xenova/dinov2-small',{...opts,device:'webgpu'})}catch(e){console.warn('WebGPU indisponível no DINOv2; usando execução padrão',e);pipe=await mod.pipeline('image-feature-extraction','Xenova/dinov2-small',opts)}}else pipe=await mod.pipeline('image-feature-extraction','Xenova/dinov2-small',opts);progress(75);return pipe})().catch(e=>{dinoModelPromise=null;throw e});return dinoModelPromise}
function unitVector(v){let n=Math.sqrt(v.reduce((a,x)=>a+x*x,0));if(!n)throw new Error('O DINOv2 gerou um vetor vazio.');return v.map(x=>x/n)}
function compactDinoVector(v){if(v.length===64)return unitVector(v);if(v.length===384){const compact=[];for(let g=0;g<64;g++){let sum=0;for(let k=0;k<6;k++)sum+=Number(v[g*6+k]||0);compact.push(sum/6)}return unitVector(compact)}throw new Error('Formato de referência DINOv2 incompatível. Recarregue a biblioteca inicial.')}
async function dinoEmbedding(input){const pipe=await getDinoModel();let src=input;if(input instanceof File){src=URL.createObjectURL(input)}const out=await pipe(src);if(input instanceof File)URL.revokeObjectURL(src);const dims=out?.dims||[],data=out?.data;if(!data||!dims.length)throw new Error('O DINOv2 não retornou características de imagem válidas.');const width=dims[dims.length-1],tokens=dims.length>=3?dims[dims.length-2]:1;let vec=new Array(width).fill(0);if(tokens>1){const start=width;for(let t=1;t<tokens;t++)for(let j=0;j<width;j++)vec[j]+=Number(data[t*width+j]||0);for(let j=0;j<width;j++)vec[j]/=(tokens-1)}else{for(let j=0;j<width;j++)vec[j]=Number(data[j]||0)}return compactDinoVector(vec)}
async function classifyDinoPhoto(input){
 const refs=loadReferenceVectors();if(!refs.length)throw new Error('A biblioteca DINOv2 ainda está vazia. Carregue a base inicial e/ou adicione referências rotuladas.');
 const bmp=await createImageBitmap(input);const canvases=[];
 const make=(sx,sy,sw,sh,size=448)=>{const c=document.createElement('canvas');c.width=size;c.height=size;const x=c.getContext('2d');x.drawImage(bmp,sx,sy,sw,sh,0,0,size,size);return c};
 const max=Math.max(bmp.width,bmp.height),scale=Math.min(1,896/max),whole=document.createElement('canvas');whole.width=Math.max(1,Math.round(bmp.width*scale));whole.height=Math.max(1,Math.round(bmp.height*scale));whole.getContext('2d').drawImage(bmp,0,0,whole.width,whole.height);canvases.push({canvas:whole,weight:.45});
 const side=Math.min(bmp.width,bmp.height)*.72;canvases.push({canvas:make((bmp.width-side)/2,(bmp.height-side)/2,side,side),weight:.35});
 const qW=bmp.width*.48,qH=bmp.height*.48;[[0,0],[bmp.width-qW,0],[0,bmp.height-qH],[bmp.width-qW,bmp.height-qH]].forEach(([x,y])=>canvases.push({canvas:make(x,y,qW,qH,336),weight:.05}));
 bmp.close?.();const vectors=[];for(let i=0;i<canvases.length;i++){const item=canvases[i];status(i<2?'Analisando a superfície do estofado…':'Examinando detalhes da trama…');progress(75+((i+1)/canvases.length)*22);const blob=await new Promise((resolve,reject)=>item.canvas.toBlob(b=>b?resolve(b):reject(new Error('Falha ao preparar recorte')),'image/jpeg',.9));const v=await dinoEmbedding(new File([blob],'dino-view.jpg',{type:'image/jpeg'}));vectors.push({v,weight:item.weight})}
 const combined=new Array(64).fill(0);vectors.forEach(({v,weight})=>v.forEach((x,i)=>combined[i]+=x*weight));const vector=unitVector(combined);
 const scored=refs.map(r=>{let best=-1;for(const view of vectors){if(r.vector.length!==view.v.length)continue;let sim=0;for(let i=0;i<view.v.length;i++)sim+=r.vector[i]*view.v[i];best=Math.max(best,sim)}return best<0?null:{id:r.label,score:best}}).filter(Boolean);
 if(!scored.length)throw new Error('As referências não correspondem ao modelo DINOv2 atual. Recarregue a biblioteca.');
 const grouped=new Map();scored.forEach(x=>{if(!grouped.has(x.id))grouped.set(x.id,[]);grouped.get(x.id).push(x.score)});
 const ranked=[...grouped.entries()].map(([id,scores])=>{scores.sort((a,b)=>b-a);const top=scores.slice(0,Math.min(3,scores.length));return{id,score:top.reduce((a,b)=>a+b,0)/top.length,samples:scores.length}}).sort((a,b)=>b.score-a.score);
 return {matches:ranked.slice(0,2),vector,viewsAnalyzed:vectors.length}
}
async function seedReferenceLibrary(){const btn=$('fl-seed-references');btn.disabled=true;try{$('fl-reference-status').textContent='Carregando as referências iniciais…';status('Lendo a biblioteca DINOv2 preparada a partir de 25 imagens têxteis rotuladas.');const response=await fetch('./dinov2-seed.json',{cache:'no-store'});if(!response.ok)throw new Error('Não foi possível baixar a biblioteca inicial ('+response.status+').');const data=await response.json();if(!Array.isArray(data.references)||!data.references.length)throw new Error('O arquivo de referências está vazio.');const existing=loadReferenceVectors(),seen=new Set(existing.filter(r=>r.kind==='public-seed-textile-sample').map(r=>r.name));let added=0;for(const r of data.references){if(seen.has(r.name))continue;addReferenceVector({...r,createdAt:new Date().toISOString(),kind:'public-seed-textile-sample'});seen.add(r.name);added++}$('fl-reference-status').textContent='Biblioteca inicial carregada: '+added+' nova(s) referência(s). '+referenceSummary();status('Biblioteca DINOv2 carregada com referências rotuladas. Não alteramos os pesos originais do modelo.')}catch(e){console.error(e);$('fl-reference-status').textContent='Não foi possível carregar a biblioteca: '+(e?.message||'erro');status('Falha ao carregar as referências iniciais. Confira a conexão e tente novamente.')}finally{btn.disabled=false}}async function addReferenceFromUpload(){const input=$('fl-reference-photo'),file=input.files&&input.files[0];if(!file){$('fl-reference-status').textContent='Escolha uma foto de referência primeiro.';return}if(!file.type.startsWith('image/')||file.size>15*1024*1024){$('fl-reference-status').textContent='Escolha uma imagem válida de até 15 MB.';return}const b=$('fl-add-reference');b.disabled=true;try{const label=$('fl-reference-label').value;if(!label)throw new Error('Selecione o nome confirmado do tecido.');status('Extraindo características visuais da foto de referência…');const vector=await dinoEmbedding(file);addReferenceVector({label,vector,name:file.name||'referência',createdAt:new Date().toISOString()});$('fl-reference-status').textContent=referenceSummary();input.value='';status('Exemplo rotulado adicionado ao DINOv2 neste aparelho. Os pesos originais do modelo não foram alterados.')}catch(e){console.error(e);$('fl-reference-status').textContent=e?.message||'Não foi possível adicionar o exemplo.'}finally{b.disabled=false}}
function scannerConfidence(score,gap){if(score<.38)return 'não identificada';if(gap<.018)return 'inconclusiva';if(score>=.52&&gap>=.045)return 'correspondência visual mais distinta';return 'correspondência visual limitada'}
function connectScannerToLocalLibrary(){
 const btn=document.getElementById('prepareAnalysis');if(!btn||btn.dataset.localFabricHandler==='ready')return;
 btn.dataset.localFabricHandler='ready';
 btn.onclick=async()=>{
  const photo=window.scanPhoto||(typeof scanPhoto!=='undefined'?scanPhoto:null);
  if(!photo){if(typeof toast==='function')toast('Escolha uma foto para consultar o tecido.');return}
  const result=document.getElementById('scanResult'),empty=document.getElementById('scanEmpty'),summary=document.getElementById('scanSummary'),details=document.getElementById('scanAiDetails'),products=document.getElementById('scanProducts'),next=document.getElementById('scanNextStep');
  const card=document.getElementById('dinoResultCard'),name=document.getElementById('dinoResultName'),copy=document.getElementById('dinoResultCopy'),confidenceEl=document.getElementById('dinoResultConfidence');
  document.body.classList.add('dino-scanning');document.body.classList.remove('dino-result-ready');
  if(card)card.classList.remove('show');if(result)result.classList.remove('show');if(empty)empty.style.display='none';if(summary)summary.textContent='';if(details)details.hidden=true;if(products)products.innerHTML='';if(next)next.textContent='';
  btn.disabled=true;progress(2);status('Preparando scanner óptico…');
  try{
   const response=await fetch('./dinov2-seed.json',{cache:'no-store'});if(!response.ok)throw new Error('Não foi possível preparar a biblioteca visual.');
   const seed=await response.json();if(!Array.isArray(seed.references)||!seed.references.length)throw new Error('A biblioteca visual está vazia.');
   let refs=loadReferenceVectors();const seen=new Set(refs.filter(r=>r.kind==='public-seed-textile-sample').map(r=>r.name));
   for(const r of seed.references){if(!seen.has(r.name))addReferenceVector({...r,createdAt:new Date().toISOString(),kind:'public-seed-textile-sample'});seen.add(r.name)}
   refs=loadReferenceVectors();
   const dinoResult=await classifyDinoPhoto(photo),a=dinoResult.matches,top=a[0]||{id:'',score:0},second=a[1]||{score:0},gap=top.score-second.score,confidence=scannerConfidence(top.score,gap);
   const identified=confidence==='correspondência visual mais distinta';
   const fabric=identified?(F.find(f=>f.id===top.id)||{name:top.id,desc:'Correspondência visual na biblioteca inicial.'}).name:'Tecido não identificado';
   const detailsText=identified
    ?'A superfície apresenta uma correspondência visual limitada com '+fabric+'. Isso não confirma a composição da fibra; consulte a etiqueta ou a ficha técnica do fabricante.'
    :'A imagem não apresentou uma correspondência visual suficientemente distinta para identificar o tecido com segurança. A base atual é limitada e não cobre todas as malhas, microfibras, suede, veludos e tecidos sintéticos usados em estofados.';
   if(name)name.textContent=fabric;
   if(copy)copy.textContent=detailsText;
   if(confidenceEl)confidenceEl.textContent=identified?confidence.toUpperCase():'RESULTADO INCONCLUSIVO';
   if(card)card.classList.add('show');
   if(summary)summary.textContent=fabric+'. '+detailsText;
   if(details){details.innerHTML='<div class="ai-report-panel"><h4>Resultado do scanner</h4><p><b>'+esc(fabric)+'</b></p><p>'+esc(detailsText)+'</p><p>Foram comparados '+dinoResult.viewsAnalyzed+' enquadramentos da imagem. A semelhança visual não confirma a composição da fibra.</p></div>';details.hidden=false}
   if(products)products.innerHTML='';
   if(next)next.textContent=identified?'Confirme a etiqueta ou a ficha técnica antes de escolher um processo de limpeza.':'Tente uma foto mais próxima da trama, com iluminação uniforme e sem filtros. Confirme pela etiqueta ou ficha técnica antes de escolher o processo.';
   if(typeof scanAnalysis!=='undefined')scanAnalysis={source:'dinov2-multiscale-local',fabric_guess:fabric,fabric_confidence:identified?confidence:'inconclusiva',summary:detailsText,matches:identified?[{name:fabric}]:[],recommended_products:[],steps:['Confirme a etiqueta ou ficha técnica.','Faça teste em área discreta antes de aplicar qualquer produto.']};
   progress(100);status('Análise concluída');document.body.classList.remove('dino-scanning');document.body.classList.add('dino-result-ready');
   if(typeof toast==='function'&&identified)toast('Análise visual concluída.');
  }catch(e){
   console.error('Análise local de tecido falhou',e);progress(0);status('Falha na análise DINOv2: '+(e&&e.message?e.message:'erro desconhecido'));
   if(name)name.textContent='Não foi possível analisar';if(copy)copy.textContent='O scanner não conseguiu concluir a leitura. Verifique a conexão e tente novamente.';if(confidenceEl)confidenceEl.textContent='TENTE NOVAMENTE';if(card)card.classList.add('show');
   if(summary)summary.textContent='Não foi possível concluir a análise local.';if(next)next.textContent=(e&&e.message?e.message:'Erro no modelo visual.')+' Tente novamente.';if(typeof toast==='function')toast('Não foi possível concluir a análise.');
   document.body.classList.remove('dino-scanning');document.body.classList.add('dino-result-ready');
  }finally{btn.disabled=false}
 };
}
function start(){connectScannerToLocalLibrary()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();