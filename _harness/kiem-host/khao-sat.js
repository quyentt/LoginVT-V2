// node khao-sat.js <roleId> <cnId> [cnId…]   — CHỈ ĐỌC
// Mở màn, chọn ô lọc (ưu tiên UU_TIEN), bấm Tìm kiếm, rồi in: nút đang hiện, số dòng / ô nhập trong từng bảng.
// Dùng để lên kế hoạch thử ghi cho màn tự dựng.
const { connect } = require('./cdp');
const UU_TIEN = (process.env.UU_TIEN || 'Đại học chính quy').split(';').map(x => x.trim().toLowerCase()).filter(Boolean);
const XEP = `function(ds,chu){var u=${JSON.stringify(UU_TIEN)};var d=ds.filter(function(x){var t=chu(x).toLowerCase();return u.some(function(k){return t.indexOf(k)>=0})});return d.concat(ds.filter(function(x){return d.indexOf(x)<0}));}`;
(async () => {
  const [role, ...cns] = process.argv.slice(2);
  const b = await connect();
  await b.ev(`location.hash='#/r/${role}'; location.reload()`).catch(() => {});
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && document.readyState==="complete"', 30000);
  await b.hook();
  await b.waitFor(`ums.state.menu && ums.state.roleId==='${role}'`, 30000);
  for (const cn of cns) {
    await b.ev(`location.hash='#/r/${role}/${cn}'`);
    await b.waitFor(`ums.state.chucNangId==='${cn}'`, 15000); await b.sleep(500); await b.idle(15000);
    const da = [];
    for (let v = 0; v < 12; v++) {
      const o = await b.ev(`(function(){var da=${JSON.stringify(da)};var s=Array.prototype.filter.call(document.querySelectorAll('main select'),function(s){
          if(s.closest('dialog,.ums-table,.ums-canquyet')||s.multiple||s.disabled)return false; if(!(s.offsetParent||(s.nextElementSibling&&s.nextElementSibling.offsetParent)))return false;
          if(s.id&&da.indexOf(s.id)>=0)return false; return !s.value&&Array.prototype.some.call(s.options,function(o){return o.value!==''});})[0];
        if(!s)return ''; if(!s.id)s.id='__k'+Math.random().toString(36).slice(2,7);
        var v=(${XEP})(Array.prototype.filter.call(s.options,function(x){return x.value!==''}),function(x){return x.text})[0];
        s.value=v.value; if(window.jQuery)jQuery(s).trigger('change'); else s.dispatchEvent(new Event('change',{bubbles:true})); return s.id;})()`);
      if (!o) break; da.push(o); await b.sleep(200); await b.idle(10000);
    }
    await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main button'),function(x){return x.offsetParent&&!x.disabled&&!x.closest('dialog,.ums-table')&&/^(Tìm kiếm|Tìm|Danh sách|Lọc|Tra cứu|Xem danh sách)$/i.test(x.textContent.trim())});if(e)e.click();})()`);
    await b.sleep(300); await b.idle(15000);
    const r = await b.ev(`(function(){
      var t=((document.querySelector('.ums-page__title,main h1,main h2')||{}).textContent||'').trim();
      var nut=Array.prototype.filter.call(document.querySelectorAll('main button'),function(x){return x.offsetParent&&!x.closest('.ums-table tbody')}).map(function(x){return (x.textContent.trim()||x.title||'?')+(x.disabled?'(khoá)':'')});
      var bang=Array.prototype.filter.call(document.querySelectorAll('main .ums-table'),function(x){return x.offsetParent}).map(function(tb){var rows=Array.prototype.filter.call(tb.querySelectorAll('tbody tr'),function(r){return !r.querySelector('.ums-empty')});
        var inp=tb.querySelectorAll('tbody input:not([type=checkbox]):not([type=hidden]), tbody select, tbody textarea').length;
        var ib=Array.prototype.map.call((rows[0]||document.createElement('tr')).querySelectorAll('button'),function(x){return x.getAttribute('data-act')||x.title||x.textContent.trim()}).join('/');
        var ck=tb.querySelectorAll('tbody input[type=checkbox]').length;
        return rows.length+' dòng, '+inp+' ô nhập, '+ck+' ô đánh dấu, nút dòng đầu ['+ib+']';});
      var loc=Array.prototype.filter.call(document.querySelectorAll('main select'),function(s){return !s.closest('.ums-table,dialog')&&(s.offsetParent||(s.nextElementSibling&&s.nextElementSibling.offsetParent))}).map(function(s){return s.options[s.selectedIndex]?s.options[s.selectedIndex].text.slice(0,25):''}).filter(Boolean);
      return {t:t,nut:nut,bang:bang,loc:loc};})()`);
    console.log(`\n## ${r.t} (${cn.slice(0, 8)})\n   lọc: ${r.loc.join(' › ')}\n   nút: ${[...new Set(r.nut)].join(' · ')}\n   bảng: ${r.bang.join(' || ') || '(không)'}`);
    b.takeErrors();
  }
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
