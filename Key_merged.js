(function(){
  // ====== CẤU HÌNH - dùng API của BẠN (Key.js) ======
  const API_BASE = 'https://winter-water-2873phankhoaapi.phananhkhoa04072007.workers.dev';
  const BRAND_TITLE = 'KOVALUCKY';
  const TZ = 'Asia/Ho_Chi_Minh';
  const ALWAYS_PROMPT = false; // true = luôn hiện form mỗi lần tải trang
  const LS = { DEVICE:'kovalucky_device_id', KEY:'kovalucky_license_key' };

  let deviceId = localStorage.getItem(LS.DEVICE);
  if(!deviceId){
    deviceId = crypto.randomUUID ? crypto.randomUUID() : 'dev-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
    localStorage.setItem(LS.DEVICE, deviceId);
  }

  const fmt = (ts)=> ts==null ? 'lifetime' :
    new Intl.DateTimeFormat('vi-VN',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(ts);

  // ====== GỌI API CỦA BẠN ======
  async function verifyKey(key){
    try{
      const res = await fetch(API_BASE + '/api/verify', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ key, deviceId }) // Truyền thêm deviceId để backend biết thiết bị nào đang kiểm tra
      });
      return await res.json().catch(()=>({ok:false, error:'PARSE_ERROR'}));
    }catch(e){
      return { ok:false, error:'NETWORK_ERROR', detail: String(e && e.message || e) };
    }
  }

  async function activateKey(key, deviceId){
    try{
      const res = await fetch(API_BASE + '/api/activate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ license_key: key, deviceId })
      });
      return await res.json().catch(()=>({ok:false, error:'PARSE_ERROR'}));
    }catch(e){
      return { ok:false, error:'NETWORK_ERROR', detail: String(e && e.message || e) };
    }
  }

  function ting(){
    try{
      const AC = new (window.AudioContext||window.webkitAudioContext)();
      const o=AC.createOscillator(), g=AC.createGain(), t=AC.currentTime;
      o.type='sine'; o.frequency.value=1200;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.18,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.16);
      o.connect(g).connect(AC.destination); o.start(t); o.stop(t+0.17);
    }catch{}
  }

  // ====== GIAO DIỆN (lấy từ form chi cường) ======
  const css = `
  #vgGate{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(8,10,15,.72);backdrop-filter:blur(6px)}
  #vgGate .vg-panel{width:min(620px,92vw);border:1px solid #2a2d3f;border-radius:16px;overflow:hidden;color:#e8e7ff;
    font-family:Inter,system-ui,Arial;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.018));box-shadow:0 24px 60px rgba(0,0,0,.55)}
  #vgGate .vg-hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid #2a2d3f}
  #vgGate .vg-brand{font-weight:900;letter-spacing:.3px;white-space:nowrap}
  #vgGate .vg-hd-rt{display:flex;gap:8px}
  #vgGate .vg-btn{padding:9px 14px;border-radius:10px;border:1px solid #3a3f56;background:#191f2a;color:#e8e7ff;cursor:pointer}
  #vgGate .vg-btn:hover{filter:brightness(1.08)}
  #vgGate .vg-btn--pri{background:#1e293b;border-color:#405075}
  #vgGate .vg-btn--ghost{background:#141924}
  #vgGate .vg-bd{padding:16px}
  #vgGate .vg-label{font-size:12px;color:#aab4d6;margin:0 0 6px 0}
  #vgGate .vg-field{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center}
  #vgGate .vg-input{padding:11px 12px;border-radius:10px;border:1px solid #3a3f56;background:#0c1017;color:#e8e7ff;width:100%}
  #vgGate .vg-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
  #vgGate .vg-msg{margin-top:12px;padding:12px;border-radius:12px;border:1px solid #2a2d3f;background:#0b1118;font-size:13px;line-height:1.45}
  #vgGate .vg-msg.ok{border-color:#2f9e44;background:#0d1a12;color:#b9ffd1}
  #vgGate .vg-msg.warn{border-color:#b8860b;background:#1b1607;color:#ffe9b0}
  #vgGate .vg-msg.err{border-color:#b02a37;background:#1a0f12;color:#ffd1d6}
  #vgGate .vg-foot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;color:#9fb0d0;font-size:12px}
  #vgGate details{margin-top:10px;border:1px dashed #2a2d3f;border-radius:12px;overflow:hidden}
  #vgGate summary{padding:10px 12px;cursor:pointer;list-style:none;background:#0b0f15}
  #vgGate summary::-webkit-details-marker{display:none}
  #vgGate .vg-pre{margin:0;padding:12px 12px 14px;background:#0b0f15;color:#bcd;max-height:220px;overflow:auto}
  #vgGate .vg-icon{display:inline-flex;align-items:center;gap:6px;padding:9px 12px;border-radius:10px;border:1px solid #3a3f56;background:#151a24;cursor:pointer}
  #vgGate .vg-icon svg{width:16px;height:16px;display:block}
  @media (max-width:520px){
    #vgGate .vg-field{grid-template-columns:1fr}
    #vgGate .vg-hd{flex-wrap:wrap}
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function $(sel, root=document){ return root.querySelector(sel); }

  function build(){
    let wrap = $('#vgGate');
    if(wrap) return wrap;
    wrap = document.createElement('div');
    wrap.id = 'vgGate';
    wrap.innerHTML = `
      <div class="vg-panel">
        <div class="vg-hd">
          <div class="vg-brand">${BRAND_TITLE}</div>
          <div class="vg-hd-rt">
            <button class="vg-btn vg-btn--ghost" id="vgReset" title="Nhập lại">Nhập lại</button>
          </div>
        </div>

        <div class="vg-bd">
          <div>
            <div class="vg-label">License Key</div>
            <div class="vg-field">
              <input id="vgKey" class="vg-input" type="text" placeholder="KOVA-XXXX-XXXX-XXXX" autocomplete="one-time-code" inputmode="latin">
              <button class="vg-icon" id="vgPasteKey" title="Dán">
                <svg viewBox="0 0 24 24" fill="none"><path d="M8 4h8v4h4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4h4Z" stroke="currentColor" stroke-width="1.6"/><path d="M9 2h6v3a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V2Z" stroke="currentColor" stroke-width="1.6"/></svg>
                <span>Dán</span>
              </button>
              <button class="vg-icon" id="vgDelKey" title="Xóa">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke="currentColor" stroke-width="1.6"/><path d="M10 11v7M14 11v7" stroke="currentColor" stroke-width="1.6"/></svg>
                <span>Xóa</span>
              </button>
            </div>
          </div>

          <div style="margin-top:12px">
            <div class="vg-label">Device ID</div>
            <div class="vg-field">
              <input id="vgDev" class="vg-input" type="text" readonly>
              <button class="vg-icon" id="vgCopyDev" title="Sao chép">
                <svg viewBox="0 0 24 24" fill="none"><path d="M9 9h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.6"/><path d="M7 15H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.6"/></svg>
                <span>Sao chép</span>
              </button>
            </div>
          </div>

          <div class="vg-actions">
            <button class="vg-btn vg-btn--pri" id="vgCheck">Kiểm tra Key</button>
            <button class="vg-btn vg-btn--pri" id="vgActive">Kích hoạt</button>
          </div>

          <div class="vg-msg" id="vgMsg">Sẵn sàng.</div>
          <details id="vgDtl" hidden>
            <summary>Chi tiết kỹ thuật</summary>
            <pre class="vg-pre" id="vgRaw"></pre>
          </details>

          <div class="vg-foot">
            <span id="vgSta">Chưa kích hoạt</span>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    const lastKey = localStorage.getItem(LS.KEY)||'';
    if(lastKey) $('#vgKey').value = lastKey;
    $('#vgDev').value = deviceId;

    $('#vgPasteKey').onclick = pasteIntoKey;
    $('#vgDelKey').onclick   = deleteKeyLocal;
    $('#vgCopyDev').onclick  = ()=> copyToClipboard($('#vgDev').value.trim(), 'Đã sao chép Device ID.');
    $('#vgReset').onclick    = ()=> {
      localStorage.removeItem(LS.KEY);
      updateStatus(null);
      show();
      window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'none'}}));
    };
    $('#vgCheck').onclick    = onCheck;
    $('#vgActive').onclick   = onActivate;

    return wrap;
  }

  function setMsg(type, html, raw){
    const box = document.querySelector('#vgMsg'); box.className = 'vg-msg '+(type||''); box.innerHTML = html; ting();
    const dtl = document.querySelector('#vgDtl'); const pre = document.querySelector('#vgRaw');
    if(raw){ dtl.hidden=false; pre.textContent = typeof raw==='string'?raw:JSON.stringify(raw,null,2); }
    else { dtl.hidden=true; pre.textContent=''; }
  }
  
  function updateStatus(data){
    const el = document.querySelector('#vgSta'); if(!el) return;
    if(!data){ el.textContent = 'Chưa kích hoạt'; return; }
    // Đồng bộ với dữ liệu trả về mới từ backend
    const devInfo = (data.maxDevices!=null)
      ? ` | Thiết bị: ${data.usedDevices!=null ? data.usedDevices : '?'}/${data.maxDevices}`
      : '';
    el.textContent = `Hết hạn: ${fmt(data.expiresAt)}${devInfo}`;
  }
  
  function copyToClipboard(text, okText){ navigator.clipboard?.writeText(text).then(()=> setMsg('ok', okText) ); }

  async function pasteIntoKey(){
    const inp = document.querySelector('#vgKey');
    try{
      const txt = await navigator.clipboard.readText();
      inp.value = (txt||'').trim();
      setMsg('ok','Đã dán vào License Key.');
    }catch{
      const txt = prompt('Dán License Key tại đây:','')||'';
      inp.value = txt.trim();
      setMsg('ok','Đã dán vào License Key.');
    }
    inp.focus();
  }

  function deleteKeyLocal(){
    const inp = document.querySelector('#vgKey');
    inp.value = '';
    localStorage.removeItem(LS.KEY);
    updateStatus(null);
    setMsg('ok','Đã xóa License Key khỏi thiết bị này.');
  }

  // ====== Xử lý bấm nút ======
  async function onCheck(){
    const key = document.querySelector('#vgKey').value.trim();
    if(!key) return setMsg('warn','Vui lòng nhập License Key.');
    setMsg('', 'Đang kiểm tra...');
    const j = await verifyKey(key);
    if(j.ok){
      localStorage.setItem(LS.KEY,key);
      const d = j.data || j;
      updateStatus(d);
      setMsg('ok', `Key hợp lệ<br>Hết hạn: <b>${fmt(d.expiresAt)}</b>`, j);
      window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'valid', data:d}}));
    }else{
      const map={EXPIRED:'Key đã hết hạn.',REVOKED:'Key đã bị thu hồi.',NOT_FOUND:'Không tìm thấy Key.',NETWORK_ERROR:'Không kết nối được tới máy chủ (kiểm tra mạng/CORS).'};
      setMsg('err', map[(j.error||'').toUpperCase()]||('Lỗi '+(j.error||'không xác định')), j);
      window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'invalid', data:j}}));
    }
  }

  async function onActivate(){
    const key = document.querySelector('#vgKey').value.trim();
    if(!key) return setMsg('warn','Vui lòng nhập License Key.');
    setMsg('', 'Đang kích hoạt...');
    const j = await activateKey(key, deviceId);
    if(j.ok){
      localStorage.setItem(LS.KEY,key);
      const d = j.data || j;
      updateStatus(d);
      setMsg('ok', `Kích hoạt thành công<br>Hết hạn: <b>${fmt(d.expiresAt)}</b>`, j);
      setTimeout(()=>{ hide(); }, 1200);
      window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'activated', data:d}}));
    }else{
      const why=(j.error||'').toUpperCase();
      const map={
        BOUND_TO_ANOTHER_DEVICE:'Key đã gắn với thiết bị khác.',
        DEVICE_LIMIT:'Key đã đạt giới hạn thiết bị tối đa cho phép.',
        DEVICE_ID_REQUIRED:'Thiếu Device ID.',
        EXPIRED:'Key đã hết hạn.',
        REVOKED:'Key đã bị thu hồi.',
        NOT_FOUND:'Không tìm thấy Key.',
        NETWORK_ERROR:'Không kết nối được tới máy chủ (kiểm tra mạng/CORS).'
      };
      setMsg('err', map[why] || ('Lỗi '+(j.error||'không xác định')), j);
      window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'invalid', data:j}}));
    }
  }

  function show(){ build(); document.getElementById('vgGate').style.display='grid'; }
  function hide(){ const g=document.getElementById('vgGate'); g && (g.style.display='none'); }

  // ====== Tự kiểm tra khi tải trang ======
  async function guardOnLoad(){
    try{
      if(ALWAYS_PROMPT){ show(); return; }
      const savedKey = localStorage.getItem(LS.KEY);
      if(!savedKey){
        show();
        window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'none'}}));
        return;
      }
      
      // Sử dụng activateKey khi tải trang để tự kích hoạt lại nếu key bị Admin Reset 
      const a = await activateKey(savedKey, deviceId);
      if(!a.ok){
        show();
        window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'invalid', data:a}}));
        return;
      }
      const d = a.data || a;
      updateStatus(d);
      window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'valid', data:d}}));
    }catch(e){
      console.error('KovaluckyGate guardOnLoad error:', e);
      show();
      window.dispatchEvent(new CustomEvent('kovalucky-license-change',{detail:{state:'invalid'}}));
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', guardOnLoad);
  else guardOnLoad();

  window.KovaluckyGate = { show, hide, reset(){ localStorage.removeItem(LS.KEY); show(); } };
})();
