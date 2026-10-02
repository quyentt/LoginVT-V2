// node thu-ghi.js <roleId> <cnId> [cnId…]
// THỬ GHI TRÊN HOST (người dùng cho phép 2026-09-24, điều kiện: xoá được bản ghi thử ngay sau đó).
// Chỉ dùng cho màn dựng bằng ums.crud. Mỗi màn:
//   1. chọn ô lọc (mục đầu, ưu tiên Đại học chính quy) → Tìm kiếm → chụp danh sách ID
//   2. Thêm mới: CHỈ điền ô bắt buộc (+ một ô chữ nếu chưa có ô chữ nào) bằng dấu "ZKT<ggpp>" → Lưu
//   3. xác định bản ghi mới (Id máy chủ trả, hoặc đúng MỘT id mới trong danh sách) — không chắc thì KHÔNG sửa/xoá
//   4. Sửa chính bản ghi đó (thêm "S" vào ô chữ đã điền) → Lưu
//   5. Xoá bản ghi đó bằng giao diện; còn thì xoá bằng lời gọi remove của màn; cuối cùng kiểm lại đã mất
// Không bao giờ sửa/xoá bản ghi không do chính lượt này tạo. Kết quả: %TEMP%/ums-kiem-host/thu-ghi.json
const fs = require('fs');
const path = require('path');
const { connect, DIR } = require('./cdp');
const UU_TIEN = (process.env.UU_TIEN || 'Đại học chính quy').split(';').map(x => x.trim().toLowerCase()).filter(Boolean);
const XEP = `function(ds,chu){var u=${JSON.stringify(UU_TIEN)};var d=ds.filter(function(x){var t=chu(x).toLowerCase();return u.some(function(k){return t.indexOf(k)>=0})});return d.concat(ds.filter(function(x){return d.indexOf(x)<0}));}`;
const d0 = new Date();
const DAU = 'ZKT' + String(d0.getHours()).padStart(2, '0') + String(d0.getMinutes()).padStart(2, '0');

(async () => {
  const [role, ...cns] = process.argv.slice(2);
  const b = await connect();
  const out = path.join(DIR, 'thu-ghi.json');
  const kq = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : [];

  await b.say('Nạp lại trang, gắn bộ ghi lời gọi + sổ khung crud');
  await b.ev(`location.hash = '#/r/${role}'; location.reload()`).catch(() => {});
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && ums.crud && document.readyState==="complete"', 30000);
  await b.hook();
  // Bộ ghi riêng: lưu cả Id máy chủ trả và thông báo lỗi đầy đủ
  await b.ev(`(function(){ if (ums.crud.__so) return; var g = ums.crud; window.__crud = [];
    ums.crud = function (c) { var x = g(c); __crud.push(x); return x; }; ums.crud.__so = 1;
    var A = ums.api, c0 = A.call; window.__ghi = [];
    A.call = function (o) { return c0.apply(this, arguments).then(function (r) {
        __ghi.push({ action: o.action, func: o.func || '', ok: true, id: (r && r.raw && (r.raw.Id || r.raw.ID)) || '', msg: (r && r.message) || '' }); return r; },
      function (e) { __ghi.push({ action: o.action, func: o.func || '', ok: false, msg: String(e && e.message || e) }); throw e; }); };
  })()`);
  await b.waitFor(`ums.state.menu && ums.state.menu.length && ums.state.roleId === '${role}'`, 30000);

  const dsO = `Array.prototype.map.call(document.querySelectorAll('main select'), function (s, i) {
      if (!s.id) s.id = '__s' + i;
      if (s.closest('dialog') || s.getAttribute('data-scope') !== 'filter') return null;
      var vis = !!(s.offsetParent || (s.nextElementSibling && s.nextElementSibling.offsetParent));
      var opts = Array.prototype.filter.call(s.options, function (o) { return o.value !== ''; });
      return { id: s.id, mo: !s.disabled, thay: vis, n: opts.length, chon: !!s.value, nhieu: s.multiple };
    }).filter(function (x) { return x && x.thay; })`;
  async function chonLoc() {
    const da = [];
    for (let v = 0; v < 10; v++) {
      const o = (await b.ev(dsO)).find(x => x.mo && x.n > 0 && !x.chon && !x.nhieu && !da.includes(x.id));
      if (!o) break;
      da.push(o.id);
      await b.ev(`(function(){var s=document.getElementById('${o.id}');var v=(${XEP})(Array.prototype.filter.call(s.options,function(x){return x.value!==''}),function(x){return x.text})[0];
        s.value=v.value; if(window.jQuery) jQuery(s).trigger('change'); else s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
      await b.sleep(200); await b.idle(10000);
    }
  }
  const BO_LOC = I => `(function(){var c=${I};c.root.querySelectorAll('select[data-scope="filter"]').forEach(function(s){if(s.value||(s.multiple&&s.selectedOptions.length)){if(window.jQuery)jQuery(s).val(s.multiple?[]:'').trigger('change.select2');else s.value='';}});
    var e=c.root.querySelector('input[data-scope="filter"]:not([type=hidden]):not([type=checkbox]), .ums-searchbar__input');if(e)e.value=${JSON.stringify(DAU)};})()`;
  const GHI = `(function(){var x=window.__ghi||[];window.__ghi=[];return x;})()`;
  // Khung crud chính đang hiện (có nút Thêm mới)
  const INST = `(function(){for(var i=__crud.length-1;i>=0;i--){var c=__crud[i];if(c.root&&c.root.offsetParent&&c.root.querySelector('[data-c="'+c.uid+':add"]'))return i;}return -1;})()`;
  const hopMo = `Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open}).length`;
  async function bamXacNhan() {
    if (!(await b.waitFor(hopMo + ' > 0', 5000))) return false;
    await b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open});d=d[d.length-1];var k=d.querySelector('button[value="1"]');k.style.outline='3px solid #e00';})()`);
    await b.sleep(600);
    await b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open});d[d.length-1].querySelector('button[value="1"]').click();})()`);
    return true;
  }

  // Đối chứng bằng <controller>/LayChiTiet (nếu có): 'co' | 'khong' | 'loi …'
  const CHITIET = (act, id) => `(async function(){var c=${JSON.stringify(act)}.split('/')[0];try{var r=await ums.api.call({action:c+'/LayChiTiet',method:'GET',strId:${JSON.stringify(id)},silent:true});var d=r.data;var n=Array.isArray(d)?d.length:(d?1:0);return n?'co':'khong';}catch(e){return 'loi '+String(e.message).slice(0,60);}})()`;

  for (const cn of cns) {
    delete process.env.BAM_TAM;
    const r = { id: cn, luc: new Date().toISOString(), dau: DAU, buoc: [], moi: '', conSot: false };
    const note = s => { r.buoc.push(s); b.log('   ' + s); };
    try {
      await b.ev(`window.__crud.length = 0`);
      await b.ev(`location.hash = '#/r/${role}/${cn}'`);
      await b.waitFor(`ums.state.chucNangId === '${cn}'`, 15000);
      await b.sleep(500); await b.idle(15000);
      r.ten = await b.ev(`(document.querySelector('.ums-page__title,main h1,main h2')||{}).textContent||''`);
      r.ten = (r.ten || '').trim();
      await b.say(`[${r.ten}] chọn bộ lọc`);
      await chonLoc();
      /* BAM=".ums-master__item" — màn hai cột: bấm mục đầu tiên bên trái cho khung crud bên phải mở nút Thêm */
      /* TIM="Văn Hiệp" — cột trái danh sách cán bộ: gõ tên tài khoản thử vào ô tìm, bấm ĐÚNG mục khớp. Không khớp thì bỏ màn
         (không ghi vào hồ sơ người khác). */
      if (process.env.TIM && await b.ev(`!!Array.prototype.find.call(document.querySelectorAll('main .ums-master__search input'),function(x){return x.offsetParent})`)) {
        await b.ev(`(function(){var i=Array.prototype.find.call(document.querySelectorAll('main .ums-master__search input'),function(x){return x.offsetParent});i.value=${JSON.stringify(process.env.TIM)};i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',bubbles:true}));i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));})()`);
        await b.sleep(900); await b.idle(15000);
        const tim = await b.ev(`(function(){var ds=Array.prototype.filter.call(document.querySelectorAll('main .ums-master__item'),function(x){return x.offsetParent&&x.getAttribute('data-id')===ums.session.userId});if(ds.length!==1)return 'KHONG:'+ds.length;ds[0].scrollIntoView({block:'center'});ds[0].click();return ds[0].textContent.replace(/\s+/g,' ').trim().slice(0,60);})()`);
        note('Chọn cán bộ thử: ' + tim);
        if (/^KHONG/.test(tim)) {
          // Không thấy hồ sơ của tài khoản thử: trả ô tìm về trống. Cột trái là danh sách NGƯỜI (có ảnh tròn) thì bỏ màn — không ghi vào hồ sơ người khác.
          await b.ev(`(function(){var i=Array.prototype.find.call(document.querySelectorAll('main .ums-master__search input'),function(x){return x.offsetParent});i.value='';i.dispatchEvent(new Event('input',{bubbles:true}));})()`);
          await b.sleep(900); await b.idle(15000);
          if (await b.ev(`!!document.querySelector('main .ums-master__item .ums-ava')`)) { note('Cột trái là danh sách người, không có hồ sơ tài khoản thử — bỏ qua'); throw 'bo'; }
        } else process.env.BAM_TAM = '1';
        await b.sleep(500); await b.idle(15000);
      }
      if (process.env.BAM && !process.env.BAM_TAM) {
        const bam = await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main ${process.env.BAM}'),function(x){return x.offsetParent});if(!e)return '';e.scrollIntoView({block:'center'});e.click();return e.textContent.replace(/\\s+/g,' ').trim().slice(0,60);})()`);
        note('Bấm mục trái: ' + (bam || '(không có)'));
        await b.sleep(500); await b.idle(15000);
      }
      let k = await b.ev(INST);
      if (k < 0) { note('Không có khung crud có nút Thêm mới — bỏ qua'); throw 'bo'; }
      const I = `__crud[${k}]`;
      if (!(await b.ev(`typeof ${I}.cfg.remove === 'function'`))) { note('Màn không khai remove (không có đường xoá) — KHÔNG thử ghi'); r.khongXoa = true; throw 'bo'; }
      await b.ev(`${I}.load(1)`).catch(() => {}); await b.sleep(300); await b.idle(15000);
      const truoc = await b.ev(`${I}.rows.map(function(x){return x.ID})`);
      note(`Danh sách trước: ${truoc.length} dòng (tổng ${await b.ev(I + '.total')})`);
      await b.ev(GHI);

      // ---- THÊM ----
      await b.click(`[data-c="${await b.ev(I + '.uid')}:add"]`, `[${r.ten}] bấm Thêm mới`);
      await b.sleep(600); await b.idle(10000);
      const dien = await b.ev(`(function(){var c=${I},dau=${JSON.stringify(DAU)},coChu=false,ds=[];
        function vis(e){return !!(e.offsetParent||(e.nextElementSibling&&e.nextElementSibling.offsetParent));}
        function dat(el,f){var t=el.getAttribute('data-type');
          if(el.tagName==='SELECT'){var o=(${XEP})(Array.prototype.filter.call(el.options,function(x){return x.value&&x.value!=='SELECTALL'}),function(x){return x.text})[0];if(!o)return;el.value=o.value;if(window.jQuery)jQuery(el).trigger('change');ds.push((f.label||f.key)+'='+o.text.slice(0,30));return;}
          var k=el.getAttribute('data-k')||'';
          if(t==='date'||/^strNgay|Ngay[A-Z]|_Ngay/.test(k)&&!/So|Ten|Id$/.test(k)){var d=new Date();el.value=('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();}
          else if(t==='number'||/^[di][A-Z]/.test(k))el.value='1'; else {el.value=dau;coChu=true;el.setAttribute('data-kt','1');}
          el.dispatchEvent(new Event('input',{bubbles:true}));ds.push((f.label||f.key)+'='+el.value);}
        /* FULL=1: điền MỌI ô trống đang hiện (không chỉ ô bắt buộc) — máy chủ thường đòi nhiều hơn cờ required */
        var full=${process.env.FULL ? 'true' : 'false'};
        c.formEls().forEach(function(el){var f=c.fieldDef(el.getAttribute('data-k'))||{};if((f.required||full&&vis(el))&&!el.disabled&&!el.readOnly&&!(el.value||'').trim()&&el.getAttribute('data-type')!=='check'&&el.type!=='file'&&el.type!=='hidden'&&el.getAttribute('data-k')!=='strMaSoThue')dat(el,f);});
        /* strMaSoThue ở Giảm trừ gia cảnh ghi thẳng vào HỒ SƠ cán bộ (xoá bản ghi không hoàn lại) — 2026-09-25 */
        if(!coChu){var el=c.formEls().filter(function(el){var t=el.getAttribute('data-type')||'text';return (t==='text'||t==='textarea')&&vis(el)&&!el.disabled&&!el.value&&el.getAttribute('data-k')!=='strMaSoThue';})[0];if(el)dat(el,c.fieldDef(el.getAttribute('data-k'))||{});}
        return ds;})()`);
      note('Điền: ' + dien.join(' | '));
      await b.shot(`ghi_${cn.slice(0, 6)}_them`);
      await b.click(`[data-c="${await b.ev(I + '.uid')}:save"]`, `[${r.ten}] bấm Lưu (thêm)`);
      await b.sleep(500); await b.idle(15000); await b.sleep(500); await b.idle(10000);
      let g = await b.ev(GHI);
      const them = g.find(x => /Them|ThemMoi|Insert/i.test(x.func + x.action)) || g.find(x => !/LayDS|LayDanhSach|LayChiTiet|LayThongTin|\/Lay|\.Lay|DSA4/i.test(x.func + ' ' + x.action));  // action mã hoá không func (vd CMS_DanhMuc_MH/FSkk…)
      if (!them) { note('!! Lưu không gửi lời gọi thêm (có thể bị kiểm tra ô chặn) — toast: ' + await b.ev(`Array.prototype.map.call(document.querySelectorAll('.ums-toast'),function(t){return t.textContent.trim()}).join(' / ')`)); throw 'bo'; }
      note(`${them.ok ? 'OK' : '!! LỖI'} thêm: ${them.func || them.action} ${them.msg ? '— ' + them.msg.slice(0, 200) : ''}${them.id ? ' id=' + them.id : ''}`);

      // ---- XÁC ĐỊNH BẢN GHI MỚI ----
      await b.ev(`if(${I}.z('form')&&!${I}.z('form').hidden)${I}.showList()`).catch(() => {});
      // Danh sách phân trang máy chủ: tìm theo dấu nếu có ô từ khoá
      await b.ev(`(function(){var e=${I}.root.querySelector('input[data-scope="filter"]:not([type=hidden]):not([type=checkbox]), .ums-searchbar__input');if(e){e.value=${JSON.stringify(DAU)};}})()`);
      await b.ev(`${I}.load(1)`).catch(() => {}); await b.sleep(300); await b.idle(15000);
      let sau = await b.ev(`${I}.rows.map(function(x){return x.ID})`);
      // Bản ghi thử có thể nằm ngoài ô lọc đang chọn (vd khoản thu không có nhóm): bỏ trống ô chọn lọc, tìm theo dấu
      if (!(them.id && sau.includes(them.id)) && await b.ev(`!!${I}.root.querySelector('input[data-scope="filter"]:not([type=hidden]):not([type=checkbox]), .ums-searchbar__input')`)) {
        note('Không thấy với bộ lọc đang chọn — bỏ trống ô chọn lọc, tìm theo dấu ' + DAU);
        await b.ev(BO_LOC(I)); await b.sleep(300); await b.idle(15000);
        await b.ev(`${I}.load(1)`).catch(() => {}); await b.sleep(300); await b.idle(15000);
        sau = await b.ev(`${I}.rows.map(function(x){return x.ID})`);
      }
      // Từ khoá máy chủ nhiều màn không tìm trong ô đã gắn dấu (vd Ghi chú) → thử lần nữa với ô từ khoá TRỐNG
      if (!(them.id && sau.includes(them.id))) {
        await b.ev(`(function(){${I}.root.querySelectorAll('input[data-scope="filter"]:not([type=hidden]):not([type=checkbox]), .ums-searchbar__input').forEach(function(e){if(e.value===${JSON.stringify(DAU)})e.value='';});})()`);
        await b.ev(`${I}.load(1)`).catch(() => {}); await b.sleep(300); await b.idle(15000);
        sau = await b.ev(`${I}.rows.map(function(x){return x.ID})`);
        if (them.id && sau.includes(them.id)) note('Thấy bản ghi mới khi để trống ô từ khoá (từ khoá máy chủ không tìm trong ô gắn dấu)');
      }
      const moi = sau.filter(x => !truoc.includes(x));
      const coDau = await b.ev(`${I}.rows.filter(function(x){return JSON.stringify(x).indexOf(${JSON.stringify(DAU)})>=0}).map(function(x){return x.ID})`);
      let id = (them.id && sau.includes(them.id)) ? them.id : (coDau.length === 1 ? coDau[0] : (moi.length === 1 ? moi[0] : ''));
      note(`Sau khi thêm: ${sau.length} dòng, id mới ${moi.length}, dòng mang dấu ${coDau.length}${them.id ? ', máy chủ trả id ' + them.id : ''}`);
      if (!id && them.id) { id = them.id; note('Không thấy trong danh sách — dùng id máy chủ trả'); }
      if (!id) { note(them.ok ? '!! KHÔNG xác định chắc bản ghi mới → KHÔNG sửa/xoá, kiểm tay theo dấu ' + DAU : 'Thêm lỗi, không có bản ghi mới'); r.conSot = them.ok; throw 'bo'; }
      r.moi = id;
      r.ctlThem = them.action;
      r.ctTruoc = await b.ev(CHITIET(them.action, id));
      note('LayChiTiet ngay sau khi thêm: ' + r.ctTruoc);

      // ---- SỬA ----
      let idx = await b.ev(`${I}.rows.findIndex(function(x){return x.ID===${JSON.stringify(id)}})`);
      if (idx >= 0) {
        const uid = await b.ev(I + '.uid');
        const nut = `#screen [data-c="${uid}:edit"][data-i="${idx}"]`;
        if (await b.ev(`!!document.querySelector(${JSON.stringify(nut)})`)) {
          await b.click(nut, `[${r.ten}] bấm Sửa bản ghi vừa tạo`);
          await b.sleep(600); await b.idle(10000);
          const doi = await b.ev(`(function(){var c=${I};var el=c.formEls().filter(function(el){var t=el.getAttribute('data-type')||'text';return (t==='text'||t==='textarea')&&!el.disabled&&el.value===${JSON.stringify(DAU)};})[0];
            if(!el)return '';el.value=${JSON.stringify(DAU + 'S')};el.dispatchEvent(new Event('input',{bubbles:true}));return el.getAttribute('data-k');})()`);
          note(doi ? `Sửa ô ${doi} → ${DAU}S` : 'Sửa: không có ô chữ mang dấu, lưu nguyên');
          await b.ev(GHI);
          await b.click(`[data-c="${uid}:save"]`, `[${r.ten}] bấm Lưu (sửa)`);
          await b.sleep(500); await b.idle(15000); await b.sleep(400); await b.idle(10000);
          g = await b.ev(GHI);
          const sua = g.find(x => /Sua|CapNhat|Update|Them/i.test(x.func + x.action) && !/LayDS|LayDanhSach/i.test(x.func + x.action)) || g.find(x => !/LayDS|LayDanhSach|LayChiTiet|LayThongTin|\/Lay|\.Lay|DSA4/i.test(x.func + ' ' + x.action));
          note(sua ? `${sua.ok ? 'OK' : '!! LỖI'} sửa: ${sua.func || sua.action} ${sua.msg ? '— ' + sua.msg.slice(0, 200) : ''}` : '!! Lưu (sửa) không gửi lời gọi');
          if (sua && sua.ok && /Them/i.test(sua.func + sua.action) && !/Sua|CapNhat/i.test(sua.func + sua.action)) note('   (màn dùng chung Them_… cho sửa, phân biệt bằng strId — như gốc)');
          await b.ev(`if(${I}.z('form')&&!${I}.z('form').hidden)${I}.showList()`).catch(() => {});
          await b.ev(`${I}.load(1)`).catch(() => {}); await b.sleep(300); await b.idle(15000);
          if (doi) note('Sau sửa, dòng mang ' + DAU + 'S: ' + await b.ev(`${I}.rows.some(function(x){return x.ID===${JSON.stringify(id)}&&JSON.stringify(x).indexOf(${JSON.stringify(DAU + 'S')})>=0})`));
        } else note('Không thấy nút Sửa của dòng (có thể nằm trang khác) — bỏ bước sửa');
      } else note('Bản ghi không nằm trong trang đang xem — bỏ bước sửa');

      // ---- XOÁ ----
      await b.ev(GHI);
      idx = await b.ev(`${I}.rows.findIndex(function(x){return x.ID===${JSON.stringify(id)}})`);
      const uid = await b.ev(I + '.uid');
      let daBam = false;
      if (idx >= 0) {
        if (await b.ev(`!!document.querySelector('#screen [data-c="${uid}:pick"][data-i="${idx}"]')`)) {
          await b.click(`#screen [data-c="${uid}:pick"][data-i="${idx}"]`, `[${r.ten}] đánh dấu bản ghi vừa tạo`);
          const chon = await b.ev(`${I}.pickedRows().map(function(x){return x.ID})`);
          if (chon.length === 1 && chon[0] === id) { await b.click(`#screen [data-c="${uid}:delsel"]`, `[${r.ten}] bấm Xoá đã chọn`); daBam = true; }
          else { note('!! Ô đánh dấu chọn sai dòng — bỏ'); await b.ev(`${I}.selected={};${I}.syncSelection()`); }
        } else if (await b.ev(`!!document.querySelector('#screen [data-c="${uid}:del"][data-i="${idx}"]')`)) {
          await b.click(`#screen [data-c="${uid}:del"][data-i="${idx}"]`, `[${r.ten}] bấm Xoá của dòng`); daBam = true;
        } else if (await b.ev(`!!document.querySelector('#screen [data-c="${uid}:edit"][data-i="${idx}"]')`)) {
          await b.click(`#screen [data-c="${uid}:edit"][data-i="${idx}"]`, `[${r.ten}] mở bản ghi để Xoá`);
          await b.sleep(600); await b.idle(10000);
          if (await b.ev(`!!(function(){var e=document.querySelector('#screen [data-c="${uid}:delone"]');return e&&e.offsetParent&&!e.disabled})()`)) { await b.click(`#screen [data-c="${uid}:delone"]`, `[${r.ten}] bấm Xoá trong biểu mẫu`); daBam = true; }
        }
      }
      if (daBam) {
        if (await bamXacNhan()) { await b.say(`[${r.ten}] xác nhận Xoá`); await b.sleep(500); await b.idle(15000); }
        else note('!! Không thấy hộp xác nhận xoá');
      } else note('Giao diện không có nút xoá tới được dòng này');
      g = await b.ev(GHI);
      const xoa = g.find(x => /Xoa|Delete/i.test(x.func + x.action));
      if (xoa) note(`${xoa.ok ? 'OK' : '!! LỖI'} xoá (giao diện): ${xoa.func || xoa.action} ${xoa.msg ? '— ' + xoa.msg.slice(0, 200) : ''}`);
      await b.ev(`if(${I}.z('form')&&!${I}.z('form').hidden)${I}.showList()`).catch(() => {});
      await b.ev(`${I}.load(1)`).catch(() => {}); await b.sleep(300); await b.idle(15000);
      let con = await b.ev(`${I}.rows.some(function(x){return x.ID===${JSON.stringify(id)}})`);
      if (con || !xoa || !xoa.ok) {
        // Lưới an toàn: gọi đúng lời gọi xoá của màn với id bản ghi thử
        await b.say(`[${r.ten}] còn bản ghi thử — xoá bằng lời gọi của màn`);
        const kqx = await b.ev(`(function(){var c=${I};var row=c.rows.filter(function(x){return x.ID===${JSON.stringify(id)}})[0]||{ID:${JSON.stringify(id)}};
          var ds=c.cfg.remove([row.ID],[row]);if(!ds)return 'màn không có remove';if(!Array.isArray(ds))ds=[ds];
          return ds.reduce(function(p,o){return p.then(function(a){return ums.api.call(o).then(function(){return a+'ok ';},function(e){return a+'LOI '+e.message+' ';});});},Promise.resolve(''));})()`);
        note('Xoá bằng lời gọi: ' + kqx);
        await b.ev(`${I}.load(1)`).catch(() => {}); await b.sleep(300); await b.idle(15000);
        con = await b.ev(`${I}.rows.some(function(x){return x.ID===${JSON.stringify(id)}})`);
      }
      // Kiểm lần cuối rộng nhất có thể: bỏ trống ô chọn lọc + tìm theo dấu (nếu màn có ô từ khoá)
      if (!con && await b.ev(`!!${I}.root.querySelector('input[data-scope="filter"]:not([type=hidden]):not([type=checkbox]), .ums-searchbar__input')`)) {
        await b.ev(BO_LOC(I)); await b.sleep(300); await b.idle(15000);
        await b.ev(`${I}.load(1)`).catch(() => {}); await b.sleep(300); await b.idle(15000);
        const soDau = await b.ev(`${I}.rows.filter(function(x){return x.ID===${JSON.stringify(id)}||JSON.stringify(x).indexOf(${JSON.stringify(DAU)})>=0}).length`);
        note(`Kiểm cuối (bộ lọc trống, từ khoá ${DAU}): ${soDau} dòng`);
        if (soDau) con = true;
      }
      r.ctSau = await b.ev(CHITIET(them.action, id));
      note('LayChiTiet sau khi xoá: ' + r.ctSau + (r.ctTruoc === 'co' ? '' : ' (không làm đối chứng được vì lúc thêm không thấy)'));
      if (r.ctTruoc === 'co' && r.ctSau === 'co') con = true;
      r.conSot = con;
      note(con ? '!! BẢN GHI THỬ VẪN CÒN: ' + id : 'Đã xoá — không còn trong danh sách');
    } catch (e) { if (e !== 'bo') note('LỖI CHẠY: ' + (e.message || e)); }
    r.loiJS = b.takeErrors();
    await b.ev(`if(window.__crud){__crud.forEach(function(c){try{c.root.querySelectorAll('input[data-scope="filter"]:not([type=hidden]):not([type=checkbox]), .ums-searchbar__input').forEach(function(e){if(e.value===${JSON.stringify(DAU)})e.value='';});}catch(x){}})}`).catch(() => {});
    await b.shot(`ghi_${cn.slice(0, 6)}_xong`);
    b.log(`== ${r.conSot ? '!! CÒN SÓT' : 'sạch'}  ${r.ten}`);
    const i = kq.findIndex(x => x.id === r.id); if (i >= 0) kq[i] = r; else kq.push(r);
    fs.writeFileSync(out, JSON.stringify(kq, null, 1));
  }
  await b.say('XONG thử ghi');
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
