/* Importação conservadora: nunca apaga nem sobrescreve dias existentes. */
function validateBackupDays(days) {
 if(!Array.isArray(days)||!days.length)throw new Error('Backup sem dias válidos.');
 const seen=new Set();
 for(const d of days){
  if(!d||typeof d.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||!Number.isFinite(Date.parse(d.date))||new Date(d.date).toISOString().slice(0,10)!==d.date||seen.has(d.date)||!Array.isArray(d.rows)||!d.rows.length||d.rows.some(r=>!r||typeof r!=='object'||Array.isArray(r)||typeof r.ds!=='string'))throw new Error('Data duplicada ou registros inválidos no backup.');
  seen.add(d.date);
 }
}
function stableData(value){return JSON.stringify(value,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().filter(k=>k!=='supervisor').map(k=>[k,v[k]])):v)}
function downloadSafetyCopy(name,data){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
async function safeImportDays(days,online){
 validateBackupDays(days);
 const account=cloudUser;
 const target=online?'Supabase online':'navegador local';
 const existing=await (online?cloudGetAll():localGetAll());
 const byDate=new Map(existing.map(d=>[d.date,d]));
 const added=days.filter(d=>!byDate.has(d.date));
 const conflicts=days.filter(d=>byDate.has(d.date)&&stableData(byDate.get(d.date).rows)!==stableData(d.rows));
 const same=days.length-added.length-conflicts.length;
 if(!confirm(target+': '+added.length+' dia(s) novo(s), '+same+' idêntico(s), '+conflicts.length+' conflito(s). Datas existentes serão preservadas. Salvar cópia de segurança e continuar?'))return 'Operação cancelada.';
 // Persistir uma cópia em IndexedDB antes da primeira gravação no destino.
 await new Promise((resolve,reject)=>{
  const req=indexedDB.open('prs-sync-safety',1);
  req.onupgradeneeded=()=>req.result.createObjectStore('snapshots',{autoIncrement:true});
  req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{const safety=req.result;const tx=safety.transaction('snapshots','readwrite');tx.objectStore('snapshots').add({at:new Date().toISOString(),target,existing,incoming:days});tx.oncomplete=()=>{safety.close();resolve()};tx.onerror=()=>{safety.close();reject(tx.error)};tx.onabort=()=>{safety.close();reject(tx.error||new Error('Backup de segurança cancelado.'))}};
 });
 downloadSafetyCopy('Performance_antes_sincronizacao.json',{version:1,exportedAt:new Date().toISOString(),days:existing});
 if(conflicts.length)downloadSafetyCopy('Performance_conflitos_preservados.json',{version:1,days:conflicts,remote:conflicts.map(d=>byDate.get(d.date))});
 let saved=0;
 for(const d of added){
  try{
   if(online&&(!cloudSelected||cloudUser!==account))throw new Error('A sessão mudou durante a sincronização. Entre novamente.');
   if(online){
    // INSERT sem upsert: uma inclusão concorrente causa erro, nunca sobrescrita.
    await cloudFetch('/rest/v1/performance_days',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({date:d.date,source_name:d.sourceName||'',imported_at:d.importedAt||new Date().toISOString(),rows:d.rows})});
    const check=await cloudGet(d.date);if(!check||stableData(check.rows)!==stableData(d.rows))throw new Error('Leitura de confirmação divergente.');
   }else{
    await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).add(d);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Inclusão cancelada.'))});
   }
   saved++;
  }catch(e){throw new Error(saved+' dia(s) confirmado(s); parada em '+d.date+'. '+e.message+' O histórico existente foi preservado; pode tentar novamente.');}
 }
 return saved+' dia(s) adicionado(s) ao '+target+'. '+same+' idêntico(s); '+conflicts.length+' conflito(s) preservado(s), sem sobrescrita.'+(online?' Verificado por leitura no Supabase.':' Faça login e use Enviar histórico local para nuvem para disponibilizar em outros computadores.');
}
