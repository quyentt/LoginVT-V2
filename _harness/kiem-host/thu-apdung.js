// node thu-apdung.js <roleId> <cnId>:<controller> [...]
// THỬ GHI họ màn "… ÁP DỤNG" (ums.qldAD, Quản lý điểm) — người dùng cho phép 2026-09-25 ("thử ghi tất cả, xong phải xoá").
// Mỗi màn: chọn Hệ/Khoá → Tìm kiếm → bấm chương trình đầu tiên → tab đầu → "Thêm dòng" → điền dòng mới → Lưu.
// Bản ghi mới = chênh lệch ID giữa hai lần màn tự nạp <controller>/LayDanhSach (trước / sau khi lưu) — phải đúng MỘT.
// Xoá bằng nút Xóa của đúng dòng đó (dự phòng: <controller>/Xoa strIds như màn), kiểm lại bằng lần nạp sau.
// Kết quả: %TEMP%/ums-kiem-host/thu-apdung.json
const fs = require('fs');
const path = require('path');
const { connect, DIR } = require('./cdp');
const UU_TIEN = (process.env.UU_TIEN || 'Đại học chính quy').split(';').map(x => x.trim().toLowerCase()).filter(Boolean);
const XEP = `function(ds,chu){var u=${JSON.stringify(UU_TIEN)};var d=ds.filter(function(x){var t=chu(x).toLowerCase();return u.some(function(k){return t.indexOf(k)>=0})});return d.concat(ds.filter(function(x){return d.indexOf(x)<0}));}`;
const d0 = new Date();
/* KHUNG=ch — khung "Cấu hình hiển thị" (ums.qldCH): nút data-a, bảng .qldch-bang, dòng mang data-id, không có danh sách trái */
const CH = process.env.KHUNG === 'ch';
const SEL = CH ? { them: '[data-a="them"]', luu: '[data-a="luu"]', bang: '.qldch-bang', xoa: '[data-act="del"]' }
               : { them: '[data-qad="them"]', luu: '[data-qad="luu"]', bang: '.qad-bang', xoa: '[data-qad-xoa]' };
const DAU = 'ZKT' + String(d0.getHours()).padStart(2, '0') + String(d0.getMinutes()).padStart(2, '0');

(async () => {
  const [role, ...ds] = process.argv.slice(2);
  const b = await connect();
  const out = path.join(DIR, 'thu-apdung.json');
  const kq = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : [];
  await b.ev(`location.hash='#/r/${role}'; location.reload()`).catch(() => {});
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && document.readyState==="complete"', 30000);
  await b.hook();
  await b.waitFor(`ums.state.menu && ums.state.roleId==='${role}'`, 30000);
  // Ghi đủ dữ liệu trả về của LayDanhSach + mọi lời gọi ghi
  await b.ev(`(function(){ if (ums.api.__ad) return; var A=ums.api, c0=A.call; window.__ad=[]; window.__g=[];
    A.call=function(o){ return c0.apply(this, arguments).then(function(r){
        if(/\\/LayDanhSach$/.test(o.action||'')) __ad.push({action:o.action, ids:(Array.isArray(r.data)?r.data:[]).map(function(x){return x.ID}), rows:Array.isArray(r.data)?r.data:[]});
        if(/\\/(ThemMoi|CapNhat|Xoa|KeThua)$/.test(o.action||'')) __g.push({action:o.action, ok:true, strId:o.strId||o.strIds||'', id:(r.raw&&(r.raw.Id||r.raw.ID))||''});
        return r; }, function(e){ if(/\\/(ThemMoi|CapNhat|Xoa|KeThua)$/.test(o.action||'')) __g.push({action:o.action, ok:false, msg:String(e.message).slice(0,200)}); throw e; }); };
    A.__ad=1; })()`);
  const LAST = ctl => `(function(){for(var i=__ad.length-1;i>=0;i--)if(__ad[i].action===${JSON.stringify(ctl + '/LayDanhSach')})return __ad[i];return null;})()`;
  const vung = `(function(){return Array.prototype.find.call(document.querySelectorAll('main ${SEL.them}'),function(x){return x.offsetParent})})()`;

  for (const item of ds) {
    const [cn, ctl] = item.split(':');
    const r = { id: cn, ctl, luc: new Date().toISOString(), dau: DAU, buoc: [], conSot: false };
    const note = s => { r.buoc.push(s); b.log('   ' + s); };
    try {
      await b.ev(`location.hash='#/r/${role}/${cn}'`);
      await b.waitFor(`ums.state.chucNangId==='${cn}'`, 15000); await b.sleep(500); await b.idle(15000);
      r.ten = ((await b.ev(`(document.querySelector('.ums-page__title,main h1')||{}).textContent||''`)) || '').trim();
      await b.say(`[${r.ten}] chọn Hệ/Khoá, tìm chương trình`);
      const da = [];
      for (let v = 0; v < 6; v++) {
        const o = await b.ev(`(function(){var da=${JSON.stringify(da)};var s=Array.prototype.filter.call(document.querySelectorAll('main select'),function(s){
            if(s.closest('dialog,.ums-table,.ums-canquyet')||s.multiple||s.disabled)return false; if(!(s.offsetParent||(s.nextElementSibling&&s.nextElementSibling.offsetParent)))return false;
            if(s.id&&da.indexOf(s.id)>=0)return false; return !s.value&&Array.prototype.some.call(s.options,function(o){return o.value!==''});})[0];
          if(!s)return ''; if(!s.id)s.id='__a'+Math.random().toString(36).slice(2,7);
          var v=(${XEP})(Array.prototype.filter.call(s.options,function(x){return x.value!==''}),function(x){return x.text})[0];
          s.value=v.value; if(window.jQuery)jQuery(s).trigger('change'); else s.dispatchEvent(new Event('change',{bubbles:true})); return s.id;})()`);
        if (!o) break; da.push(o); await b.sleep(200); await b.idle(10000);
      }
      await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main button'),function(x){return x.offsetParent&&!x.disabled&&!x.closest('dialog,.ums-table,.ums-canquyet')&&/^(Tìm kiếm|Tìm)$/i.test(x.textContent.trim())});if(e)e.click();})()`);
      await b.sleep(300); await b.idle(15000);
      const ct = CH ? 'không có danh sách trái' : await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main .ums-master__item'),function(x){return x.offsetParent});if(!e)return '';e.scrollIntoView({block:'center'});e.click();return e.textContent.trim().slice(0,70);})()`);
      if (!ct) { note('Danh sách trái rỗng — bỏ qua'); r.ketQua = 'KHONG_CO_CT'; throw 'bo'; }
      note('Chương trình: ' + ct);
      await b.sleep(500); await b.idle(15000);
      const truoc = await b.ev(LAST(ctl));
      if (!truoc) { note('!! Không thấy lời gọi ' + ctl + '/LayDanhSach sau khi bấm chương trình'); r.ketQua = 'KHONG_NAP'; throw 'bo'; }
      note(`Trước: ${truoc.ids.length} dòng áp dụng`);
      if (!(await b.ev(`!!${vung}`))) { note('Không có nút "Thêm dòng" đang hiện'); r.ketQua = 'KHONG_THEM'; throw 'bo'; }
      await b.say(`[${r.ten}] Thêm dòng`);
      await b.ev(`${vung}.click()`); await b.sleep(500);
      // Điền dòng CUỐI của bảng đang hiện (dòng mới)
      const dien = await b.ev(`(function(){var tb=Array.prototype.filter.call(document.querySelectorAll('main ${SEL.bang}'),function(x){return x.offsetParent})[0];if(!tb)return null;
        var tr=tb.querySelectorAll('tbody tr');tr=tr[tr.length-1];var ds=[],coChu=false;
        tr.querySelectorAll('select,input,textarea').forEach(function(el){if(el.disabled||el.type==='hidden'||el.type==='checkbox')return;
          if(el.tagName==='SELECT'){var o=(${XEP})(Array.prototype.filter.call(el.options,function(x){return x.value}),function(x){return x.text})[0];if(!o||el.value)return;el.value=o.value;if(window.jQuery)jQuery(el).trigger('change');else el.dispatchEvent(new Event('change',{bubbles:true}));ds.push(o.text.slice(0,20));return;}
          if(el.value)return; if(el.classList.contains('flatpickr-input')||/date/.test(el.getAttribute('data-type')||'')){var d=new Date();el.value=('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();if(el._flatpickr)el._flatpickr.setDate(el.value,true,'d/m/Y');}
          else if(el.type==='number'||el.inputMode==='numeric'||/^[di][A-Z]/.test(el.getAttribute('data-rk')||'')||${process.env.SO ? 'true' : 'false'})el.value='1'; else {el.value=${JSON.stringify(DAU)};coChu=true;}
          el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));ds.push(el.value);});
        return {ds:ds,coChu:coChu};})()`);
      if (!dien) { note('!! Không thấy bảng nhập'); r.ketQua = 'KHONG_BANG'; throw 'bo'; }
      note('Điền dòng mới: ' + dien.ds.join(' | '));
      await b.ev(`__g.length=0`);
      await b.say(`[${r.ten}] Lưu`);
      await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main ${SEL.luu}'),function(x){return x.offsetParent});e.click();})()`);
      await b.sleep(800); await b.idle(20000); await b.sleep(500); await b.idle(10000);
      const g = await b.ev(`__g.slice()`);
      const themLoi = g.filter(x => !x.ok), themOk = g.filter(x => x.ok && !x.strId);
      note(`Lưu gửi ${g.length} lời gọi (dòng mới ${themOk.length} OK, lỗi ${themLoi.length})` + (themLoi.length ? ' — ' + themLoi[0].msg : '') + (g.filter(x => x.ok && x.strId).length ? `, ${g.filter(x => x.ok && x.strId).length} dòng cũ gửi lại nguyên giá trị (như gốc)` : ''));
      const sau = await b.ev(LAST(ctl));
      const moi = sau.ids.filter(x => !truoc.ids.includes(x));
      note(`Sau: ${sau.ids.length} dòng, mới ${moi.length}`);
      if (!moi.length) { r.ketQua = themOk.length ? 'KHONG_THAY' : 'THEM_LOI'; if (themOk.length) { r.conSot = true; note('!! Thêm báo OK mà danh sách không có dòng mới — kiểm tay'); } throw 'bo'; }
      if (moi.length > 1) { r.conSot = true; r.ketQua = 'CON_SOT'; note('!! Có ' + moi.length + ' dòng mới — KHÔNG xoá tự động: ' + moi.join(',')); throw 'bo'; }
      r.moi = moi[0];
      const idx = sau.ids.indexOf(r.moi);
      const xoaDuoc = await b.ev(`(function(){var tb=Array.prototype.filter.call(document.querySelectorAll('main ${SEL.bang}'),function(x){return x.offsetParent})[0];var tr=tb.querySelector('tbody tr[data-id="${r.moi}"]')||tb.querySelectorAll('tbody tr')[${idx}];if(!tr)return 'khong-dong';var x=tr.querySelector('${SEL.xoa}');if(!x)return 'khong-nut';window.__x=x;return x.title;})()`);
      note('Nút xoá của dòng mới: ' + xoaDuoc);
      await b.ev(`__g.length=0`);
      if (xoaDuoc === 'Xóa' || (CH && xoaDuoc !== 'khong-dong' && xoaDuoc !== 'khong-nut')) {
        await b.say(`[${r.ten}] Xoá dòng thử`);
        await b.ev(`__x.click()`); await b.sleep(400);
        await b.waitFor(`Array.prototype.some.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open})`, 4000);
        await b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open});d[d.length-1].querySelector('button[value="1"]').click();})()`);
        await b.sleep(600); await b.idle(15000);
      }
      let gx = await b.ev(`__g.slice()`);
      note(gx.length ? gx.map(x => `${x.ok ? 'OK' : '!! LỖI'} xoá ${x.action}${x.msg ? ' — ' + x.msg : ''}`).join(' ; ') : 'Giao diện không gửi lời gọi xoá');
      let cuoi = await b.ev(LAST(ctl));
      if (cuoi.ids.includes(r.moi)) {
        await b.say(`[${r.ten}] còn dòng thử — xoá bằng lời gọi của màn`);
        const x = await b.ev(`ums.api.call({action:${JSON.stringify(ctl + '/Xoa')},strIds:${JSON.stringify(r.moi)},strNguoiThucHien_Id:''}).then(function(){return 'ok'},function(e){return 'LOI '+e.message})`);
        note('Xoá bằng lời gọi: ' + x);
        await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main .ums-master__item.is-active, main .ums-master__item'),function(x){return x.offsetParent});if(e)e.click();})()`);
        await b.sleep(500); await b.idle(15000);
        cuoi = await b.ev(LAST(ctl));
      }
      r.conSot = cuoi.ids.includes(r.moi);
      r.ketQua = r.conSot ? 'CON_SOT' : 'SACH';
      note(r.conSot ? '!! DÒNG THỬ VẪN CÒN ' + r.moi : `Đã xoá — còn ${cuoi.ids.length} dòng (bằng lúc đầu: ${cuoi.ids.length === truoc.ids.length})`);
    } catch (e) { if (e !== 'bo') { note('LỖI CHẠY: ' + (e.message || e)); r.ketQua = 'LOI_CHAY'; } }
    r.loiJS = b.takeErrors();
    await b.shot(`ad_${cn.slice(0, 6)}`);
    b.log(`== ${r.ketQua}${r.conSot ? ' !! CÒN SÓT' : ''}  ${r.ten}`);
    const i = kq.findIndex(x => x.id === r.id); if (i >= 0) kq[i] = r; else kq.push(r);
    fs.writeFileSync(out, JSON.stringify(kq, null, 1));
  }
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
