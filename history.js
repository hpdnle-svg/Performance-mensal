/* Histórico de fotografias operacionais diárias, salvo localmente em IndexedDB. */
const HistoryStore = (() => {
  const validDate = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d)) && new Date(d).toISOString().slice(0,10) === d;
  const ready = new Promise((resolve,reject) => {
    const request=indexedDB.open('imile-performance-regional-sp',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('days',{keyPath:'date'});
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('Feche outras janelas do dashboard e tente novamente.'));
  });
  async function restore(days) {
    validate({version:1,days});
    const db=await ready;
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('days','readwrite');
      for(const [date,rows] of Object.entries(days))tx.objectStore('days').put({date,rows});
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error || new Error('Salvamento cancelado.'));
    });
  }
  function validate(data) {
    if(data?.version!==1 || !data.days || typeof data.days!=='object' || Array.isArray(data.days))throw new Error('Backup inválido.');
    for(const [date,rows] of Object.entries(data.days)) {
      if(!validDate(date)||!Array.isArray(rows)||!rows.length)throw new Error('Data ou registros inválidos.');
      for(const r of rows)if(!r || typeof r!=='object' || ['tracking','base','status','driver','dsp'].some(k=>typeof r[k]!=='string'))throw new Error('Registro inválido.');
    }
  }
  async function all() {
    const db=await ready;
    return new Promise((resolve,reject)=>{
      const req=db.transaction('days').objectStore('days').getAll();
      req.onsuccess=()=>resolve(Object.fromEntries(req.result.map(r=>[r.date,r.rows])));req.onerror=()=>reject(req.error);
    });
  }
  return {validDate,validate,all,restore,put:(date,rows)=>restore({[date]:rows})};
})();

