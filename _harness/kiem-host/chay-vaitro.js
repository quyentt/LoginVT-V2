// node chay-vaitro.js <roleId> [tuMục]
// Chạy qua MỌI màn của một vai trò: mở màn → chọn ô cha → con → bấm nút CHỈ ĐỌC → ghi kết quả.
// Không bấm Thêm/Lưu/Xoá/Cập nhật/Duyệt/Gửi/Import/Xuất.
const fs = require('fs');
const path = require('path');
const { connect, DIR } = require('./cdp');

// UU_TIEN="Đại học chính quy;K65" — mục nào có chữ này thì chọn trước (mặc định: Đại học chính quy)
const UU_TIEN = (process.env.UU_TIEN || 'Đại học chính quy').split(';').map(x => x.trim().toLowerCase()).filter(Boolean);
const XEP = `function(ds,chu){var u=${JSON.stringify(UU_TIEN)};var d=ds.filter(function(x){var t=chu(x).toLowerCase();return u.some(function(k){return t.indexOf(k)>=0})});return d.concat(ds.filter(function(x){return d.indexOf(x)<0}));}`;
const NUT_DOC = /^(Tìm kiếm|Tìm|Danh sách|Lọc|Tra cứu|Xem danh sách|Tải danh sách|Hiển thị)$/i;

(async () => {
  const [role, tu] = process.argv.slice(2);
  const b = await connect();
  await b.say('Nạp lại trang để gắn bộ ghi');
  await b.ev(`location.hash = '#/r/${role}'; location.reload()`).catch(() => {});
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && ums.state && document.readyState==="complete"', 30000);
  await b.hook();
  /* THUVAI="Họ tên / MSSV" — vai trò CHOPHEPTHUVAI: vỏ mở hộp "Nhập thông tin định danh"; gõ, Tìm, chọn đúng người. CHỈ ĐỌC. */
  if (process.env.THUVAI && !(await b.ev('!!(ums.state && ums.state.thuVaiId)'))) {
    const ten = process.env.THUVAI;
    if (await b.waitFor(`!!document.querySelector('[data-tv="q"]')`, 15000)) {
      await b.say('Thủ vai — gõ "' + ten + '"');
      await b.ev(`(function(){var i=document.querySelector('[data-tv="q"]');i.value=${JSON.stringify(ten)};document.querySelector('[data-tv="tim"]').click();})()`);
      await b.sleep(1500); await b.idle(15000);
      const kq = await b.ev(`(function(){if(ums.state.thuVaiId)return 'da-vao';var tr=Array.prototype.filter.call(document.querySelectorAll('[data-tv="bang"] tbody tr'),function(t){return t.textContent.toLowerCase().indexOf(${JSON.stringify(ten.toLowerCase())})>=0});
        if(tr.length===1){tr[0].click();return 'chon 1 dong: '+tr[0].textContent.replace(/\\s+/g,' ').trim();}
        return 'khong chon duoc: '+tr.length+' dong khop | '+((document.querySelector('[data-tv="kq"]')||{}).textContent||'').trim().slice(0,150);})()`);
      b.log('Thủ vai: ' + kq);
      await b.waitFor('!!(ums.state && ums.state.thuVaiId)', 15000);
    }
    const tv = await b.ev(`JSON.stringify({thuVaiId:ums.state.thuVaiId||'',userId:ums.session.userId,the:((document.querySelector('.ums-tv-the')||{}).textContent||'').replace(/\\s+/g,' ').trim()})`);
    b.log('Trạng thái thủ vai: ' + tv);
    if (!JSON.parse(tv).thuVaiId) { b.log('!! Không vào được vai — dừng'); process.exit(3); }
  }
  await b.waitFor(`ums.state.menu && ums.state.menu.length && ums.state.roleId === '${role}'`, 30000);
  const menu = (await b.ev(`ums.state.menu.map(function(x){return {id:x.id,ten:x.name,path:x.path||''}})`)).filter(x => x.path);
  b.log(`Vai trò ${role}: ${menu.length} màn có tệp`);
  const out = path.join(DIR, `ketqua-${role.slice(0, 6)}${process.env.SAU ? '-sau' : ''}.json`);
  const kq = fs.existsSync(out) && tu ? JSON.parse(fs.readFileSync(out, 'utf8')) : [];

  const dsO = `Array.prototype.map.call(document.querySelectorAll('#ums-content select, .ums-content select, main select'), function (s, i) {
      if (!s.id) s.id = '__s' + i;
      if (s.closest('.ums-dialog, .ums-modal, [role=dialog], .ums-canquyet')) return null;
      var vis = !!(s.offsetParent || (s.nextElementSibling && s.nextElementSibling.offsetParent));
      var opts = Array.prototype.filter.call(s.options, function (o) { return o.value !== ''; });
      var head = (Array.prototype.find.call(s.options, function (o) { return o.value === ''; }) || {}).text || '';
      var f = s.closest('.ums-field'); var lab = f && f.querySelector('label') ? f.querySelector('label').textContent : '';
      var s2 = window.jQuery && jQuery(s).data('select2'); var ajax = !!(s2 && s2.options && s2.options.get('ajax'));
      return { id: s.id, nhan: (lab || head || s.getAttribute('data-placeholder') || s.name || s.id).trim().replace(/\\s+/g,' '), mo: !s.disabled, thay: vis, n: ajax ? -1 : opts.length, chon: s.multiple ? (jQuery(s).val()||[]).length>0 : !!s.value, nhieu: s.multiple, s2: !!s2 };
    }).filter(function (x) { return x && x.thay; })`;

  async function chon(o, k) {
    await b.ev(`(function(){var s=document.getElementById('${o.id}');var t=s.nextElementSibling&&s.nextElementSibling.classList.contains('select2')?s.nextElementSibling:s;t.style.outline='3px solid #e00';t.scrollIntoView({block:'center'});})()`);
    await b.sleep(200);
    const kieu = await b.ev(`(function(){var s=document.getElementById('${o.id}');var t=s.nextElementSibling&&s.nextElementSibling.classList.contains('select2')?s.nextElementSibling:s;t.style.outline='';
      if(window.jQuery&&jQuery(s).data('select2')){jQuery(s).select2('open');return 's2';}
      var v=(${XEP})(Array.prototype.filter.call(s.options,function(x){return x.value!==''}),function(x){return x.text})[${k}];if(!v)return 'het';s.value=v.value;s.dispatchEvent(new Event('change',{bubbles:true}));return 'thuong';})()`);
    if (kieu === 's2') {
      await b.waitFor(`document.querySelectorAll('.select2-container--open .select2-results__option:not(.loading-results)').length>0`, 5000);
      const ok = await b.ev(`(function(){var ds=Array.prototype.filter.call(document.querySelectorAll('.select2-container--open .select2-results__option'),function(x){return x.getAttribute('aria-disabled')!=='true'&&!x.classList.contains('loading-results')&&x.textContent.trim()&&!/^(Chọn|Tất cả|Không tìm thấy|No results)/i.test(x.textContent.trim())});
        ds=(${XEP})(ds,function(x){return x.textContent.trim()}); var li=ds[${k}]; if(!li){ if(window.jQuery) jQuery('#${o.id}').select2('close'); return false; }
        ['mousedown','mouseup','click'].forEach(function(t){li.dispatchEvent(new MouseEvent(t,{bubbles:true}))});
        if(document.querySelector('.select2-container--open') && jQuery('#${o.id}').prop('multiple')) jQuery('#${o.id}').select2('close');
        return true;})()`);
      if (!ok) return false;
    } else if (kieu === 'het') return false;
    await b.sleep(150);
    await b.idle(10000);
    return true;
  }

  /* SAU=1 — lượt sâu, VẪN CHỈ ĐỌC: bấm từng tab, sang trang kế, mở "Thêm mới" và nút Xem/Sửa của dòng đầu
     rồi ĐÓNG (nút × / "Đóng" / Esc). Không bao giờ bấm Lưu/Xoá/Xác nhận/Duyệt/Gửi/Import. Trả danh sách bước. */
  async function dongHet() {
    for (let n = 0; n < 3; n++) {
      const con = await b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(x){return x.open||x.offsetParent});
        if(!d.length)return 0;var x=d[d.length-1];
        var c=x.querySelector('[data-dlg="x"]')||Array.prototype.find.call(x.querySelectorAll('button'),function(b){return /^(Đóng|Huỷ|Hủy|Không|Bỏ qua)$/i.test(b.textContent.trim())});
        if(c)c.click();else x.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return d.length;})()`);
      if (!con) break;
      await b.sleep(300);
    }
    // Khung biểu mẫu thay chỗ danh sách (crud): nút "Đóng" trong đầu khung
    await b.ev(`(function(){var c=Array.prototype.find.call(document.querySelectorAll('.ums-panel__tools button, .ums-page__head button'),function(b){return b.offsetParent&&/^Đóng$/i.test(b.textContent.trim())});if(c)c.click();})()`);
    await b.sleep(300);
  }
  async function buoc(ten, js) {
    await b.takeLog(); b.takeErrors();
    const co = await b.ev(js);
    if (!co) return null;
    await b.say(ten + (co === true ? '' : ' — ' + co));
    await b.sleep(250); await b.idle(10000);
    const dlg = await b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(x){return x.open});if(!d.length)return '';var x=d[d.length-1];
      var s=Array.prototype.filter.call(x.querySelectorAll('select'),function(s){return !s.disabled&&Array.prototype.filter.call(s.options,function(o){return o.value!==''}).length===0}).map(function(s){return (Array.prototype.find.call(s.options,function(o){return o.value===''})||{}).text||s.name||'?'});
      return ((x.querySelector('.ums-dialog__title')||{}).textContent||'').trim()+(s.length?' | ô rỗng: '+s.join(', '):'');})()`);
    const goi = (await b.takeLog()).filter(x => !/LayDSChucNangNguoiDung/.test(x.func));
    const kq = { buoc: ten + (co === true ? '' : ': ' + co), hop: dlg, loi: goi.filter(x => x.n === 'LOI').map(x => x.action + ' ' + x.loi.split('\n')[0]), rong: goi.filter(x => x.n === 0).map(x => x.action + (x.func ? ' ' + x.func.split('.').pop() : '') + (x.p.strMaBangDanhMuc ? ' DM=' + x.p.strMaBangDanhMuc : '')), loiJS: b.takeErrors() };
    await dongHet();
    return kq;
  }
  async function sau(i, m) {
    const ds = [];
    const tag = `[${i + 1}] ${m.ten}`;
    // 1. Tab (bỏ tab đang mở)
    const soTab = await b.ev(`document.querySelectorAll('main .ums-tabs__item:not(.is-active)').length`);
    for (let t = 0; t < Math.min(soTab, 6); t++) {
      ds.push(await buoc(tag + ' — tab', `(function(){var x=document.querySelectorAll('main .ums-tabs__item');var y=Array.prototype.filter.call(x,function(e){return e.offsetParent&&!e.classList.contains('is-active')})[${t}];if(!y)return false;y.click();return y.textContent.trim();})()`));
    }
    // 2. Trang kế của bảng
    ds.push(await buoc(tag + ' — trang kế', `(function(){var p=Array.prototype.find.call(document.querySelectorAll('.ums-pager__btn[data-go]'),function(e){return e.offsetParent&&!e.disabled&&!e.classList.contains('is-active')&&e.textContent.trim()==='2'});if(!p)return false;p.click();return 'trang 2';})()`));
    // 3. Nút Xem / Sửa của dòng đầu (data-act view|edit; nút Sửa của ums.crud mang lớp .ums-iconbtn--edit, không có data-act)
    for (const act of ['view', 'edit']) {
      ds.push(await buoc(tag + ' — ' + (act === 'view' ? 'Xem' : 'Sửa') + ' dòng đầu', `(function(){var e=Array.prototype.find.call(document.querySelectorAll('.ums-table tbody [data-act="${act}"]${act === 'edit' ? ', .ums-table tbody .ums-iconbtn--edit' : ''}'),function(x){return x.offsetParent&&!x.disabled});if(!e)return false;e.scrollIntoView({block:'center'});e.click();return true;})()`));
    }
    // 4. "Thêm mới" (mở biểu mẫu rồi đóng)
    ds.push(await buoc(tag + ' — Thêm mới', `(function(){var e=Array.prototype.find.call(document.querySelectorAll('main button'),function(x){return x.offsetParent&&!x.disabled&&!x.closest('dialog')&&/^(Thêm mới|Thêm|Tạo mới)$/i.test(x.textContent.trim())});if(!e)return false;e.click();return e.textContent.trim();})()`));
    return ds.filter(Boolean);
  }

  const batDau = tu ? menu.findIndex(x => x.id === tu) : 0;
  /* CHI="id1,id2" — chỉ chạy các màn này (kiểm lại màn vừa sửa mã); kết quả gộp vào tệp cũ */
  const CHI = (process.env.CHI || '').split(',').filter(Boolean);
  if (CHI.length && fs.existsSync(out)) kq.push(...JSON.parse(fs.readFileSync(out, 'utf8')));
  for (let i = Math.max(0, batDau); i < menu.length; i++) {
    if (CHI.length && !CHI.includes(menu[i].id)) continue;
    const m = menu[i];
    const t0 = Date.now();
    const r = { stt: i + 1, id: m.id, ten: m.ten, path: m.path, trangThai: '', o: [], goi: [], loiJS: [], bang: [], nutDaBam: [] };
    try {
      await b.takeLog(); b.takeErrors();
      await b.say(`[${i + 1}/${menu.length}] ${m.ten}`);
      await b.ev(`location.hash = '#/r/${role}/${m.id}'`);
      await b.waitFor(`ums.state.chucNangId === '${m.id}'`, 15000);
      await b.sleep(400);
      await b.idle(15000);
      const txt = await b.ev(`(document.querySelector('#ums-content,.ums-content,main')||document.body).innerText.slice(0,3000)`);
      if (/chưa (được )?chuyển đổi/i.test(txt) && !(await b.ev(`document.querySelectorAll('#ums-content select, .ums-content select, main select').length`))) {
        r.trangThai = 'CHUA_CHUYEN';
      } else if (/Không nạp được/i.test(txt)) {
        r.trangThai = 'LOI_NAP'; r.ghiChu = (txt.match(/Không nạp được[^\n]*/) || [''])[0];
      } else {
        // Chọn cha → con; gặp ô con rỗng thì thử mục kế tiếp của ô cha (tối đa 3 mục)
        const daChon = []; const thu = {};
        for (let vong = 0; vong < 14; vong++) {
          const os = await b.ev(dsO);
          const o = os.find(x => x.mo && (x.n > 0 || x.n === -1) && !x.chon && !daChon.includes(x.id));
          if (o) { await b.say(`[${i + 1}/${menu.length}] ${m.ten} — chọn "${o.nhan}"`); if (await chon(o, 0)) daChon.push(o.id); else daChon.push(o.id); continue; }
          // Không còn ô nào để chọn: có ô rỗng sau ô cha đã chọn không?
          const rong = os.find(x => x.n === 0 && !x.chon);
          const cha = daChon.length ? os.find(x => x.id === daChon[daChon.length - 1]) : null;
          if (rong && cha && (thu[cha.id] || 0) < 2 && (cha.n > (thu[cha.id] || 0) + 1 || cha.n === -1)) {
            thu[cha.id] = (thu[cha.id] || 0) + 1;
            await b.say(`[${i + 1}/${menu.length}] "${rong.nhan}" rỗng — thử mục ${thu[cha.id] + 1} của "${cha.nhan}"`);
            await chon(cha, thu[cha.id]);
            daChon.length = daChon.indexOf(cha.id) + 1;
            continue;
          }
          break;
        }
        // Cột trái (pat.master): chưa có mục nào đang chọn thì bấm mục đầu — nội dung bên phải chỉ hiện sau bước này
        const muc = await b.ev(`(function(){var ds=Array.prototype.filter.call(document.querySelectorAll('main .ums-master__item'),function(x){return x.offsetParent});
          if(!ds.length||ds.some(function(x){return x.classList.contains('is-active')}))return '';ds[0].scrollIntoView({block:'center'});ds[0].click();return ds[0].textContent.replace(/\s+/g,' ').trim().slice(0,50);})()`);
        if (muc) { await b.say(`[${i + 1}/${menu.length}] ${m.ten} — chọn mục trái "${muc}"`); r.mucTrai = muc; await b.sleep(400); await b.idle(15000); }
        // Bấm nút chỉ đọc (một nút, ngoài hộp thoại)
        const nut = await b.ev(`(function(){var bs=Array.prototype.filter.call(document.querySelectorAll('#ums-content button, .ums-content button, main button'),function(x){return x.offsetParent&&!x.disabled&&!x.closest('.ums-dialog,[role=dialog],.ums-table')&&${NUT_DOC}.test(x.textContent.trim())});
          if(!bs.length)return '';bs[0].id=bs[0].id||'__nut';return '#'+bs[0].id+'|'+bs[0].textContent.trim();})()`);
        if (nut) {
          const [sel, ten] = nut.split('|');
          await b.click(sel, `[${i + 1}/${menu.length}] bấm "${ten}"`);
          r.nutDaBam.push(ten);
          await b.idle(15000);
        }
        r.o = await b.ev(dsO);
        // Ghi lời gọi của màn chính TRƯỚC lượt sâu (các bước sâu tự lấy nhật ký riêng)
        r.goi = (await b.takeLog()).filter(x => !/LayDSChucNangNguoiDung/.test(x.func));
        r.loiJS = b.takeErrors();
        r.bang = await b.ev(`Array.prototype.map.call(document.querySelectorAll('#ums-content .ums-table tbody, .ums-content .ums-table tbody, main .ums-table tbody'),function(t){var rows=Array.prototype.filter.call(t.rows,function(x){return !x.querySelector('.ums-empty')&&x.cells.length>1});return rows.length})`);
        // Quét dấu bản ghi thử còn sót (ZKT + 4 số) trên màn — kể cả dữ liệu ghi LAN từ màn khác (vd quyết định sinh kèm kỷ luật)
        r.zkt = await b.ev(`(function(){var m=((document.querySelector('main')||document.body).innerText.match(/ZKT\d{4}S?/g)||[]);return m.filter(function(v,i){return m.indexOf(v)===i});})()`);
        if (r.zkt.length) b.log(`!! [${i + 1}] CÒN DẤU THỬ trên màn: ${r.zkt.join(', ')} — ${m.ten}`);
        await b.shot(`${role.slice(0, 4)}_${String(i + 1).padStart(2, '0')}`);
        if (process.env.SAU) r.sau = await sau(i, m);
        r.trangThai = 'DA_CHAY';
      }
      if (r.trangThai !== 'DA_CHAY') {
        r.goi = (await b.takeLog()).filter(x => !/LayDSChucNangNguoiDung/.test(x.func));
        r.loiJS = b.takeErrors();
        await b.shot(`${role.slice(0, 4)}_${String(i + 1).padStart(2, '0')}`);
      }
      await b.ev(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
    } catch (e) { r.trangThai = 'LOI_CHAY'; r.ghiChu = e.message; }
    r.giay = Math.round((Date.now() - t0) / 100) / 10;
    const rong = r.goi.filter(x => x.n === 0).length, loi = r.goi.filter(x => x.n === 'LOI').length;
    b.log(`[${i + 1}/${menu.length}] ${r.trangThai} ${r.giay}s  gọi ${r.goi.length} (rỗng ${rong}, lỗi ${loi}) JS lỗi ${r.loiJS.length}  bảng ${JSON.stringify(r.bang)}  — ${m.ten}`);
    const k = kq.findIndex(x => x.id === r.id); if (k >= 0) kq[k] = r; else kq.push(r);
    fs.writeFileSync(out, JSON.stringify(kq, null, 1));
  }
  await b.say('XONG vai trò — đang tổng hợp');
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
