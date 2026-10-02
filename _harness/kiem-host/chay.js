// node chay.js <role> <cnId|-> "<thân hàm async chạy trong trang>"   — lái tay một màn trên host khi bộ thử tự động không với tới.
// Trong thân hàm có sẵn: $(sel) / $$(sel) trong <main> + hộp thoại đang mở, nut(chữ) bấm nút đang hiện theo chữ, cho(ms), yen() chờ hết lời gọi,
// s2(idSelect, chữ) chọn mục select2/select theo chữ (rỗng = mục đầu), nuts() liệt kê nút, os() liệt kê ô.  Trả về gì thì in ra đó + nhật ký lời gọi.
// cnId "-" = ở nguyên màn đang mở (chạy nhiều bước liên tiếp).
const { connect } = require('./cdp');
(async () => {
  const [role, cn, than] = process.argv.slice(2);
  const b = await connect();
  if (cn !== '-') {
    await b.ev(`location.hash='#/r/${role}'`); await b.sleep(800);
    await b.waitFor(`ums.state.menu && ums.state.menu.length && ums.state.roleId === '${role}'`, 30000);
    await b.ev(`location.hash='#/r/${role}/${cn}'`);
    await b.waitFor(`ums.state.chucNangId === '${cn}'`, 15000); await b.sleep(800);
  }
  await b.hook(); await b.idle(15000); await b.takeLog(); b.takeErrors();
  const kq = await b.ev(`(async function(){
    function hien(x){return !!(x.offsetParent||(x.nextElementSibling&&x.nextElementSibling.offsetParent));}
    function goc(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(x){return x.open});return d.length?d[d.length-1]:document.querySelector('main');}
    function $$(s){return Array.prototype.filter.call(goc().querySelectorAll(s),hien);}
    function $(s){return $$(s)[0];}
    function cho(ms){return new Promise(function(r){setTimeout(r,ms)});}
    async function yen(){for(var i=0;i<60;i++){await cho(250);if(!(window.__bay>0))break;}await cho(250);}
    function chu(x){return (x.textContent||"").split(String.fromCharCode(10)).join(" ").split(String.fromCharCode(9)).join(" ").split(String.fromCharCode(160)).join(" ").split(" ").filter(Boolean).join(" ");}
    function nut(t){var e=$$('button,a.ums-btn,[role=tab],.ums-tabs__item').filter(function(x){return !x.disabled&&!x.closest('.ums-canquyet')&&(chu(x)===t||x.title===t||x.getAttribute('aria-label')===t)})[0];if(!e)throw new Error('Không thấy nút: '+t);e.click();return true;}
    function nuts(){return $$('button,.ums-tabs__item').filter(function(x){return !x.closest('.ums-canquyet,.ums-pager,.select2')}).map(function(x){return (chu(x)||x.title||x.getAttribute('aria-label')||x.getAttribute('data-act')||'?').slice(0,28)+(x.disabled?'(khoá)':'')+(x.closest('.ums-table')?'@bảng':'')}).filter(function(v,i,a){return a.indexOf(v)===i});}
    function os(){return $$('select,input:not([type=hidden]),textarea').filter(function(x){return !x.closest('.ums-canquyet,.select2,.ums-pager')}).map(function(x,i){if(!x.id)x.id='__o'+i+Math.random().toString(36).slice(2,6);var f=x.closest('.ums-field');var l=f&&f.querySelector('label')?chu(f.querySelector('label')):(x.placeholder||x.getAttribute('data-k')||'');return x.id+'|'+x.tagName.toLowerCase()+(x.type&&x.tagName==='INPUT'?':'+x.type:'')+'|'+l.slice(0,30)+'|'+(x.tagName==='SELECT'?'n='+Array.prototype.filter.call(x.options,function(o){return o.value}).length+(x.value?' đã chọn':''):(x.value||'').slice(0,20))+(x.disabled?'|khoá':'')});}
    async function s2(id,t){var s=document.getElementById(id);var o=Array.prototype.filter.call(s.options,function(o){return o.value&&(!t||o.text.indexOf(t)>=0)})[0];
      if(window.jQuery&&jQuery(s).data('select2')){jQuery(s).select2('open');await cho(500);var li=Array.prototype.filter.call(document.querySelectorAll('.select2-container--open .select2-results__option'),function(x){var c=chu(x);return x.getAttribute('aria-disabled')!=='true'&&c&&!/^(Chọn|--|Tất cả|Không tìm thấy|Searching|Đang)/i.test(c)&&(!t||c.indexOf(t)>=0)})[0];
        if(!li){jQuery(s).select2('close');throw new Error('Ô '+id+' không có mục '+(t||'nào'));}
        ['mousedown','mouseup','click'].forEach(function(k){li.dispatchEvent(new MouseEvent(k,{bubbles:true}))});if(s.multiple)jQuery(s).select2('close');await yen();return chu(li);}
      if(!o)throw new Error('Ô '+id+' không có mục '+(t||'nào'));s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}));await yen();return o.text;}
    function go(id,v){var e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}
    function bao(){return Array.prototype.map.call(document.querySelectorAll('.ums-toast'),chu).join(' / ');}
    function bang(){return $$('.ums-table tbody').map(function(t){return Array.prototype.filter.call(t.rows,function(r){return !r.querySelector('.ums-empty')&&r.cells.length>1}).length});}
    try { var r = await (async function(){ ${than} })(); return JSON.stringify(r === undefined ? 'xong' : r); } catch (e) { return 'LỖI: ' + e.message; }
  })()`);
  console.log('KQ  ' + kq);
  const log = await b.takeLog();
  log.filter(x => !/LayDSChucNangNguoiDung/.test(x.func)).forEach(x => console.log('GỌI ' + (x.func ? x.func.split('.').pop() + ' [' + x.action.split('/')[0] + ']' : x.action) + ' n=' + x.n + (x.n === 'LOI' ? ' ' + String(x.loi).split('\n').slice(0, 2).join(' ').slice(0, 200) : '') + ' ' + JSON.stringify(x.p).slice(0, 220)));
  b.takeErrors().forEach(x => console.log('JS  ' + x.slice(0, 200)));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
