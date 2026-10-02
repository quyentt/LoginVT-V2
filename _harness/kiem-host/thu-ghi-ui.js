// node thu-ghi-ui.js <roleId> <cnId> [cnId…]
// THỬ GHI TRÊN HOST cho màn TỰ DỰNG (không phải ums.crud). Người dùng cho phép 2026-09-25 với điều kiện
// không ảnh hưởng dữ liệu thật: chỉ tạo bản ghi mang dấu "ZKT<ggpp>", rồi sửa/xoá ĐÚNG bản ghi đó.
// Mỗi màn:
//   1. chọn ô lọc (mục đầu, ưu tiên Đại học chính quy) → Tìm kiếm
//   2. bấm "Thêm mới" (nút ums-btn--add ngoài bảng) → điền ô bắt buộc (+ một ô chữ) bằng dấu → Lưu
//   3. tìm lại: bảng nào có ĐÚNG MỘT dòng chứa dấu → dòng đó là bản ghi thử
//   4. Sửa (nếu dòng có nút Sửa): đổi dấu → dấuS → Lưu
//   5. Xoá: nút Xoá của dòng / ô đánh dấu + "Xoá đã chọn" / mở dòng rồi Xoá trong biểu mẫu → xác nhận
//   6. tìm lại lần cuối: không còn dòng mang dấu thì "sạch"
// Không bao giờ bấm Xoá khi số dòng mang dấu ≠ 1. Còn sót thì ghi lại (id + lời gọi thêm) để dọn tay.
// Kết quả: %TEMP%/ums-kiem-host/thu-ghi-ui.json
const fs = require('fs');
const path = require('path');
const { connect, DIR } = require('./cdp');
const UU_TIEN = (process.env.UU_TIEN || 'Đại học chính quy').split(';').map(x => x.trim().toLowerCase()).filter(Boolean);
const XEP = `function(ds,chu){var u=${JSON.stringify(UU_TIEN)};var d=ds.filter(function(x){var t=chu(x).toLowerCase();return u.some(function(k){return t.indexOf(k)>=0})});return d.concat(ds.filter(function(x){return d.indexOf(x)<0}));}`;
const d0 = new Date();
const DAU = process.env.DAU || ('ZKT' + String(d0.getHours()).padStart(2, '0') + String(d0.getMinutes()).padStart(2, '0'));
const GHI_RE = /Them|ThemMoi|Insert|Sua|CapNhat|Update|Luu|Xoa|Delete|Duyet|Gui|XacNhan/i;

(async () => {
  const [role, ...cns] = process.argv.slice(2);
  const b = await connect();
  const out = path.join(DIR, 'thu-ghi-ui.json');
  const kq = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : [];

  await b.say('Nạp lại trang, gắn bộ ghi lời gọi');
  await b.ev(`location.hash = '#/r/${role}'; location.reload()`).catch(() => {});
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && document.readyState==="complete"', 30000);
  await b.hook();
  await b.ev(`(function(){ if (ums.api.__ghi) return; var A = ums.api, c0 = A.call; window.__ghi = [];
    A.call = function (o) { var p = {}; Object.keys(o||{}).forEach(function(k){ if(!/^(action|func|iM|method|silent|timeout|str(ChucNang|NguoiThucHien|VaiTroDangNhap|ChucNangHeThong|NguoiThucVai)_Id)$/.test(k)) p[k]=o[k]; });
      return c0.apply(this, arguments).then(function (r) {
        __ghi.push({ action: o.action, func: o.func || '', ok: true, id: (r && r.raw && (r.raw.Id || r.raw.ID)) || '', msg: (r && r.message) || '', p: p }); return r; },
      function (e) { __ghi.push({ action: o.action, func: o.func || '', ok: false, msg: String(e && e.message || e), p: p }); throw e; }); };
    A.__ghi = 1; })()`);
  await b.waitFor(`ums.state.menu && ums.state.menu.length && ums.state.roleId === '${role}'`, 30000);

  const GHI = `(function(){var x=window.__ghi||[];window.__ghi=[];return x;})()`;
  const laGhi = x => GHI_RE.test((x.func || '').split('.').pop() + ' ' + (x.action || '').split('/').pop()) && !/LayDS|LayDanhSach|Get|Lay/i.test((x.func || '').split('.').pop());
  const moTa = x => (x.func || x.action) + (x.ok ? '' : ' — ' + x.msg.slice(0, 200)) + (x.id ? ' id=' + x.id : '');
  const TOAST = `Array.prototype.map.call(document.querySelectorAll('.ums-toast'),function(t){return t.textContent.trim()}).join(' / ')`;
  // Vùng chứa biểu mẫu đang mở: hộp thoại trên cùng, không thì khung có nút Lưu đang hiện
  const VUNG = `(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(x){return x.open});
      if(d.length)return d[d.length-1];
      var s=Array.prototype.filter.call(document.querySelectorAll('main .ums-btn--save'),function(x){return x.offsetParent&&!x.disabled&&/^Lưu$/.test(x.textContent.trim())});
      if(!s.length)return null; return s[0].closest('.ums-panel,section,form,.ums-card')||document.querySelector('main');})()`;
  const hopMo = `Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open}).length`;

  async function chonLoc() {
    const da = [];
    for (let v = 0; v < 12; v++) {
      const o = await b.ev(`(function(){var da=${JSON.stringify(da)};var s=Array.prototype.filter.call(document.querySelectorAll('main select'),function(s){
          if(s.closest('dialog,.ums-canquyet')||s.multiple||s.disabled)return false; if(!(s.offsetParent||(s.nextElementSibling&&s.nextElementSibling.offsetParent)))return false;
          if(s.closest('.ums-table'))return false; if(s.id&&da.indexOf(s.id)>=0)return false;
          return !s.value && Array.prototype.some.call(s.options,function(o){return o.value!==''});})[0];
        if(!s)return ''; if(!s.id)s.id='__u'+Math.random().toString(36).slice(2,7);
        var v=(${XEP})(Array.prototype.filter.call(s.options,function(x){return x.value!==''}),function(x){return x.text})[0];
        s.value=v.value; if(window.jQuery)jQuery(s).trigger('change'); else s.dispatchEvent(new Event('change',{bubbles:true})); return s.id;})()`);
      if (!o) break;
      da.push(o);
      await b.sleep(200); await b.idle(10000);
    }
  }
  async function timKiem() {
    const ok = await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main button'),function(x){return x.offsetParent&&!x.disabled&&!x.closest('dialog,.ums-table')&&/^(Tìm kiếm|Tìm|Danh sách|Lọc|Tra cứu|Tải lại|Xem danh sách)$/i.test(x.textContent.trim())});if(!e)return false;e.click();return true;})()`);
    await b.sleep(300); await b.idle(15000);
    return ok;
  }
  // Dòng mang dấu trong mọi bảng đang hiện
  const DONG = dau => `(function(){var r=[];document.querySelectorAll('main .ums-table tbody tr, dialog[open] .ums-table tbody tr').forEach(function(tr){if(!tr.offsetParent)return;
      var t=tr.textContent; var v=Array.prototype.some.call(tr.querySelectorAll('input,textarea'),function(i){return (i.value||'').indexOf(${JSON.stringify(dau)})>=0});
      if(t.indexOf(${JSON.stringify(dau)})>=0||v)r.push(tr);});window.__dong=r;return r.length;})()`;
  async function dong() {
    for (let n = 0; n < 3; n++) {
      const c = await b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(x){return x.open});if(!d.length)return 0;var x=d[d.length-1];
        var c=x.querySelector('[data-dlg="x"]')||Array.prototype.find.call(x.querySelectorAll('button'),function(b){return /^(Đóng|Huỷ|Hủy|Không)$/i.test(b.textContent.trim())});
        if(c)c.click();else x.close();return 1;})()`);
      if (!c) break; await b.sleep(300);
    }
    await b.ev(`(function(){var c=Array.prototype.find.call(document.querySelectorAll('main .ums-panel__tools button, main .ums-page__head button'),function(b){return b.offsetParent&&/^Đóng$/i.test(b.textContent.trim())});if(c)c.click();})()`);
    await b.sleep(300);
  }
  async function xacNhan() {
    if (!(await b.waitFor(hopMo + ' > 0', 4000))) return false;
    await b.sleep(400);
    return b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open});d=d[d.length-1];var k=d.querySelector('button[value="1"]');if(!k)return false;k.click();return true;})()`);
  }
  async function bamLuu(tag) {
    const ok = await b.ev(`(function(){var v=${VUNG};if(!v)return false;var s=Array.prototype.find.call(v.querySelectorAll('.ums-btn--save'),function(x){return x.offsetParent&&!x.disabled&&/^Lưu$/.test(x.textContent.trim())});
      if(!s)return false;s.style.outline='3px solid #e00';s.scrollIntoView({block:'center'});window.__luu=s;return true;})()`);
    if (!ok) return false;
    await b.say(tag + ' bấm Lưu'); await b.sleep(300);
    await b.ev(`__luu.style.outline='';__luu.click()`);
    await b.sleep(500); await b.idle(15000);
    if (await b.ev(hopMo)) { // có hộp hỏi lại "Lưu …?" — chỉ đồng ý khi hộp đó là hộp xác nhận (không phải biểu mẫu)
      const laHoi = await b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open});d=d[d.length-1];return !!d.querySelector('.ums-dialog__msg')&&!d.querySelector('input:not([type=hidden]),select,textarea');})()`);
      if (laHoi) { await xacNhan(); await b.sleep(400); await b.idle(15000); }
    }
    await b.sleep(400); await b.idle(10000);
    return true;
  }

  for (const cn of cns) {
    const r = { id: cn, luc: new Date().toISOString(), dau: DAU, buoc: [], conSot: false, ghi: [] };
    const note = s => { r.buoc.push(s); b.log('   ' + s); };
    let tag = '';
    try {
      await b.ev(`location.hash = '#/r/${role}/${cn}'`);
      await b.waitFor(`ums.state.chucNangId === '${cn}'`, 15000);
      await b.sleep(500); await b.idle(15000);
      r.ten = ((await b.ev(`(document.querySelector('.ums-page__title,main h1,main h2')||{}).textContent||''`)) || '').trim();
      tag = `[${r.ten}]`;
      await b.say(tag + ' chọn bộ lọc');
      await chonLoc(); await timKiem();
      /* TIM="…" — cột trái danh sách cán bộ: gõ tên, bấm ĐÚNG hồ sơ của tài khoản thử (data-id = userId). Không có thì bỏ màn. */
      if (process.env.TIM && await b.ev(`!!Array.prototype.find.call(document.querySelectorAll('main .ums-master__search input'),function(x){return x.offsetParent})`)) {
        const go = v => b.ev(`(function(){var i=Array.prototype.find.call(document.querySelectorAll('main .ums-master__search input'),function(x){return x.offsetParent});i.value=${JSON.stringify(v)};i.dispatchEvent(new Event('input',{bubbles:true}));})()`);
        await go(process.env.TIM); await b.sleep(900); await b.idle(15000);
        const tim = await b.ev(`(function(){var ds=Array.prototype.filter.call(document.querySelectorAll('main .ums-master__item'),function(x){return x.offsetParent&&x.getAttribute('data-id')===ums.session.userId});if(ds.length!==1)return 'KHONG:'+ds.length;ds[0].click();return 'ok';})()`);
        note('Chọn cán bộ thử: ' + tim);
        if (tim !== 'ok') {
          await go(''); await b.sleep(900); await b.idle(15000);
          if (await b.ev(`!!document.querySelector('main .ums-master__item .ums-ava')`)) { note('Cột trái là danh sách người, không có hồ sơ tài khoản thử — bỏ qua'); r.ketQua = 'KHONG_THU'; throw 'bo'; }
        }
        await b.sleep(500); await b.idle(15000);
      }
      if (await b.ev(DONG(DAU.slice(0, 3)))) note('Lưu ý: màn đã có dòng mang "ZKT" từ trước — kiểm tay');
      await b.ev(GHI);

      // ---- THÊM ----
      const coThem = await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main .ums-btn--add'),function(x){return x.offsetParent&&!x.disabled&&!x.closest('dialog,.ums-table')});if(!e)return '';window.__them=e;e.scrollIntoView({block:'center'});return e.textContent.trim();})()`);
      if (!coThem) { note('Không có nút Thêm (hoặc đang khoá) — bỏ qua'); r.ketQua = 'KHONG_THEM'; throw 'bo'; }
      await b.say(`${tag} bấm "${coThem}"`);
      await b.ev(`__them.click()`); await b.sleep(700); await b.idle(10000);
      if (!(await b.ev(`!!${VUNG}`))) { note('Bấm Thêm không mở biểu mẫu có nút Lưu — toast: ' + await b.ev(TOAST)); r.ketQua = 'KHONG_MO'; throw 'bo'; }
      const dien = await b.ev(`(function(){var v=${VUNG},dau=${JSON.stringify(DAU)},coChu=false,ds=[];
        function vis(e){return !!(e.offsetParent||(e.nextElementSibling&&e.nextElementSibling.offsetParent));}
        function nhan(el){var f=el.closest('.ums-field');return f&&f.querySelector('label')?f.querySelector('label').textContent.replace('*','').trim():(el.name||el.id);}
        function batBuoc(el){var f=el.closest('.ums-field');return el.required||el.hasAttribute('data-required')||!!(f&&f.querySelector('.ums-field__req'));}
        function dat(el){
          if(el.tagName==='SELECT'){var o=(${XEP})(Array.prototype.filter.call(el.options,function(x){return x.value&&x.value!=='SELECTALL'}),function(x){return x.text})[0];if(!o)return;
            if(el.multiple){Array.prototype.forEach.call(el.options,function(x){x.selected=x===o});}else el.value=o.value;
            if(window.jQuery)jQuery(el).trigger('change');else el.dispatchEvent(new Event('change',{bubbles:true}));ds.push(nhan(el)+'='+o.text.slice(0,30));return;}
          var t=(el.getAttribute('data-type')||el.type||'text').toLowerCase();
          if(t==='date'||el.classList.contains('flatpickr-input')||/ngay|date/i.test(el.getAttribute('data-k')||el.id||'')&&!/so|ten/i.test(el.getAttribute('data-k')||'')){var d=new Date();el.value=('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();if(el._flatpickr)el._flatpickr.setDate(el.value,true,'d/m/Y');}
          else if(t==='number'||el.inputMode==='numeric'||el.inputMode==='decimal'||/^[di][A-Z]/.test(el.getAttribute('data-k')||''))el.value='1'; else {el.value=dau;coChu=true;}
          el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));ds.push(nhan(el)+'='+el.value);}
        var els=Array.prototype.filter.call(v.querySelectorAll('input,select,textarea'),function(el){return vis(el)&&!el.disabled&&!el.readOnly&&!/^(hidden|checkbox|radio|file|button|submit)$/.test(el.type)&&!el.closest('.ums-table,.ums-searchbar')&&el.getAttribute('data-scope')!=='filter';});
        var full=${process.env.FULL ? 'true' : 'false'};els.forEach(function(el){if((batBuoc(el)||full)&&!(el.value||'').trim()&&el.getAttribute('data-k')!=='strMaSoThue')dat(el);});
        if(!coChu){var el=els.filter(function(el){return (el.tagName==='TEXTAREA'||el.type==='text')&&!el.value&&!el.classList.contains('flatpickr-input')&&!/ngay|date|so|ma$/i.test(el.getAttribute('data-k')||'');})[0];if(el)dat(el);}
        return {ds:ds,coChu:coChu};})()`);
      note('Điền: ' + dien.ds.join(' | '));
      if (!dien.coChu) { note('Không có ô chữ để gắn dấu — KHÔNG lưu (không nhận ra được bản ghi thử)'); await dong(); r.ketQua = 'KHONG_DAU'; throw 'bo'; }
      await b.shot(`ui_${cn.slice(0, 6)}_them`);
      if (!(await bamLuu(tag))) { note('Không thấy nút Lưu'); await dong(); r.ketQua = 'KHONG_LUU'; throw 'bo'; }
      let g = (await b.ev(GHI)).filter(laGhi); r.ghi.push(...g);
      if (!g.length) { note('!! Lưu không gửi lời gọi ghi — toast: ' + await b.ev(TOAST)); await dong(); r.ketQua = 'LUU_BI_CHAN'; throw 'bo'; }
      g.forEach(x => note(`${x.ok ? 'OK' : '!! LỖI'} thêm: ${moTa(x)}`));
      const them = g[0];
      r.idThem = (g.find(x => x.id) || {}).id || '';
      await dong(); await timKiem();

      // ---- TÌM LẠI ----
      let n = await b.ev(DONG(DAU));
      note(`Dòng mang dấu ${DAU}: ${n}`);
      if (n !== 1) {
        r.conSot = g.some(x => x.ok);
        note(r.conSot ? `!! Không xác định được đúng một dòng — KHÔNG sửa/xoá. Cần dọn tay: ${moTa(them)} ${JSON.stringify(them.p).slice(0, 300)}` : 'Thêm lỗi, không có bản ghi mới');
        r.ketQua = r.conSot ? 'CON_SOT' : 'THEM_LOI'; throw 'bo';
      }

      // ---- SỬA ----
      const coSua = await b.ev(`(function(){var tr=__dong[0];var e=tr.querySelector('[data-act="edit"],.ums-iconbtn--edit')||Array.prototype.find.call(tr.querySelectorAll('button'),function(x){return /^Sửa$/i.test((x.title||x.textContent).trim())});if(!e)return false;window.__sua=e;e.scrollIntoView({block:'center'});return true;})()`);
      if (coSua) {
        await b.say(tag + ' bấm Sửa bản ghi thử'); await b.ev(`__sua.click()`); await b.sleep(700); await b.idle(10000);
        const doi = await b.ev(`(function(){var v=${VUNG};if(!v)return 'khong-mo';var el=Array.prototype.find.call(v.querySelectorAll('input,textarea'),function(x){return x.value===${JSON.stringify(DAU)}&&!x.disabled&&!x.readOnly});
          if(!el)return '';el.value=${JSON.stringify(DAU + 'S')};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return el.getAttribute('data-k')||el.id||el.name||'?';})()`);
        if (doi === 'khong-mo') note('Bấm Sửa không mở biểu mẫu');
        else {
          note(doi ? `Sửa ô ${doi} → ${DAU}S` : 'Sửa: biểu mẫu không có ô mang dấu, lưu nguyên');
          if (await bamLuu(tag)) {
            g = (await b.ev(GHI)).filter(laGhi); r.ghi.push(...g);
            note(g.length ? g.map(x => `${x.ok ? 'OK' : '!! LỖI'} sửa: ${moTa(x)}`).join(' ; ') : '!! Lưu (sửa) không gửi lời gọi — toast: ' + await b.ev(TOAST));
          }
          await dong(); await timKiem();
          if (doi) note(`Sau sửa, dòng mang ${DAU}S: ${await b.ev(DONG(DAU + 'S'))}`);
        }
      } else note('Dòng không có nút Sửa — bỏ bước sửa');

      // ---- XOÁ ----
      await b.ev(GHI);
      n = await b.ev(DONG(DAU));
      if (n !== 1) { note(`!! Trước khi xoá thấy ${n} dòng mang dấu — KHÔNG xoá`); r.conSot = true; r.ketQua = 'CON_SOT'; throw 'bo'; }
      let cach = await b.ev(`(function(){var tr=__dong[0];
        var e=tr.querySelector('[data-act="del"],.ums-iconbtn--del')||Array.prototype.find.call(tr.querySelectorAll('button'),function(x){return /^X[oó][aá]$/i.test((x.title||x.textContent).trim())});
        if(e){window.__xoa=e;return 'nut';}
        var ck=tr.querySelector('input[type=checkbox]');
        if(ck){var ds=document.querySelectorAll('main .ums-table tbody input[type=checkbox]:checked');if(ds.length)return 'da-co-chon';
          var x=Array.prototype.find.call(document.querySelectorAll('main button'),function(b){return b.offsetParent&&/X[oó][aá] đã chọn|^X[oó][aá]$/i.test(b.textContent.trim())&&!b.closest('.ums-table,dialog')});
          if(x){ck.click();if(ums.ui.demXoaChon)ums.ui.demXoaChon();window.__xoa=x;return 'chon';}}
        var m=tr.querySelector('[data-act="view"],[data-act="edit"]');if(m){window.__mo=m;return 'mo';}
        return '';})()`);
      if (cach === 'chon') {
        const soChon = await b.ev(`document.querySelectorAll('main .ums-table tbody input[type=checkbox]:checked').length`);
        if (soChon !== 1) { note('!! Ô đánh dấu chọn ' + soChon + ' dòng — bỏ'); cach = ''; }
      }
      if (cach === 'mo') {
        await b.ev(`__mo.click()`); await b.sleep(700); await b.idle(10000);
        const coX = await b.ev(`(function(){var v=${VUNG}||document.querySelector('main');var x=Array.prototype.find.call(v.querySelectorAll('button'),function(b){return b.offsetParent&&!b.disabled&&/^X[oó][aá]$/i.test(b.textContent.trim())&&!b.closest('.ums-table')});if(!x)return false;window.__xoa=x;return true;})()`);
        cach = coX ? 'form' : '';
      }
      if (cach === 'da-co-chon') { note('!! Đang có dòng khác được đánh dấu — không xoá'); cach = ''; }
      if (cach) {
        await b.say(tag + ' bấm Xoá bản ghi thử'); await b.ev(`__xoa.scrollIntoView({block:'center'});__xoa.click()`);
        await b.sleep(400);
        if (await xacNhan()) { await b.sleep(500); await b.idle(15000); } else note('Không có hộp xác nhận xoá');
        g = (await b.ev(GHI)).filter(laGhi); r.ghi.push(...g);
        note(g.length ? g.map(x => `${x.ok ? 'OK' : '!! LỖI'} xoá: ${moTa(x)}`).join(' ; ') : '!! Xoá không gửi lời gọi — toast: ' + await b.ev(TOAST));
      } else note('!! Không tìm được đường xoá trên giao diện');
      await dong(); await timKiem();
      n = await b.ev(DONG(DAU));
      r.conSot = n > 0;
      r.ketQua = r.conSot ? 'CON_SOT' : 'SACH';
      note(r.conSot ? `!! BẢN GHI THỬ VẪN CÒN (${n} dòng mang ${DAU})` : 'Đã xoá — không còn dòng mang dấu');
    } catch (e) { if (e !== 'bo') { note('LỖI CHẠY: ' + (e.message || e)); r.ketQua = r.ketQua || 'LOI_CHAY'; if (r.ghi.some(x => x.ok && /Them|Insert/i.test(x.func + x.action))) r.conSot = true; } }
    r.loiJS = b.takeErrors();
    await dong().catch(() => {});
    await b.shot(`ui_${cn.slice(0, 6)}_xong`);
    b.log(`== ${r.ketQua}${r.conSot ? ' !! CÒN SÓT' : ''}  ${r.ten}`);
    const i = kq.findIndex(x => x.id === r.id); if (i >= 0) kq[i] = r; else kq.push(r);
    fs.writeFileSync(out, JSON.stringify(kq, null, 1));
  }
  await b.say('XONG thử ghi');
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
