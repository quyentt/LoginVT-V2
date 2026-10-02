// node thu-ctlop.js   — THỬ GHI "Công thức theo lớp học phần" (QLD congthucdiem/lophocphan), tổng thay đổi = 0
// Lưu ở màn này LUÔN thêm một dòng D_CongThucDiem_ApDung mới cho lớp (strId rỗng). Cách thử:
//   chọn MỘT lớp đang CÓ công thức → giữ nguyên xâu → Lưu (dòng mới giống hệt công thức hiện hành)
//   → dòng mới = chênh lệch D_CongThucDiem_ApDung/LayDanhSach theo ID lớp → Xoa đúng dòng đó → danh sách về như trước.
const { connect } = require('./cdp');
const ROLE = '4ADAFDB21C9642F28BCE91448B6F2AA4', CN = '80FAFDA90733457FB5D112F636B0889E';
const UU_TIEN = (process.env.UU_TIEN || 'Đại học chính quy').split(';').map(x => x.trim().toLowerCase()).filter(Boolean);
const XEP = `function(ds,chu){var u=${JSON.stringify(UU_TIEN)};var d=ds.filter(function(x){var t=chu(x).toLowerCase();return u.some(function(k){return t.indexOf(k)>=0})});return d.concat(ds.filter(function(x){return d.indexOf(x)<0}));}`;
const DS = id => `ums.api.call({action:'D_CongThucDiem_ApDung/LayDanhSach',method:'GET',strTuKhoa:'',strDiem_ThanhPhanDiem_Id:'',strDaoTao_ThoiGianDaoTao_Id:'',strDiem_CongThucDiem_Id:'',strPhanCapApDung_Id:'',strPhamViApDung_Id:${JSON.stringify(id)},strNguoiThucHien_Id:'',pageIndex:1,pageSize:10000000}).then(function(r){return (Array.isArray(r.data)?r.data:[]).map(function(x){return {ID:x.ID,XAU:x.XAUCONGTHUC||x.XAUCONGTHUCDIEM||x.TEN||''}})})`;
(async () => {
  const b = await connect();
  const log = s => b.log('   ' + s);
  await b.ev(`location.hash='#/r/${ROLE}'; location.reload()`).catch(() => {});
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && document.readyState==="complete"', 30000);
  await b.hook();
  await b.waitFor(`ums.state.menu && ums.state.roleId==='${ROLE}'`, 30000);
  await b.ev(`location.hash='#/r/${ROLE}/${CN}'`);
  await b.waitFor(`ums.state.chucNangId==='${CN}'`, 15000); await b.sleep(500); await b.idle(15000);
  const da = [];
  for (let v = 0; v < 12; v++) {
    const o = await b.ev(`(function(){var da=${JSON.stringify(da)};var s=Array.prototype.filter.call(document.querySelectorAll('main select'),function(s){
        if(s.closest('dialog,.ums-table,.ums-canquyet')||s.multiple||s.disabled)return false; if(!(s.offsetParent||(s.nextElementSibling&&s.nextElementSibling.offsetParent)))return false;
        if(s.id&&da.indexOf(s.id)>=0)return false; return !s.value&&Array.prototype.some.call(s.options,function(o){return o.value!==''});})[0];
      if(!s)return ''; if(!s.id)s.id='__c'+Math.random().toString(36).slice(2,7);
      var v=(${XEP})(Array.prototype.filter.call(s.options,function(x){return x.value!==''}),function(x){return x.text})[0];
      s.value=v.value; if(window.jQuery)jQuery(s).trigger('change'); else s.dispatchEvent(new Event('change',{bubbles:true})); return s.id;})()`);
    if (!o) break; da.push(o); await b.sleep(200); await b.idle(10000);
  }
  await b.ev(`(function(){var e=Array.prototype.find.call(document.querySelectorAll('main button'),function(x){return x.offsetParent&&!x.disabled&&!x.closest('dialog,.ums-table,.ums-canquyet')&&/^Tìm kiếm$/i.test(x.textContent.trim())});if(e)e.click();})()`);
  await b.sleep(300); await b.idle(15000);
  const lop = await b.ev(`(function(){var t=Array.prototype.find.call(document.querySelectorAll('main textarea[data-xau]'),function(x){return x.value.trim()});if(!t)return null;
    var tr=t.closest('tr');document.querySelectorAll('main .ums-table tbody input[type=checkbox]:checked').forEach(function(c){c.click()});
    var ck=tr.querySelector('input[type=checkbox]');if(!ck)return null;ck.click();if(ums.ui.demXoaChon)ums.ui.demXoaChon();
    return {id:t.getAttribute('data-xau'),xau:t.value,ten:tr.textContent.replace(/\\s+/g,' ').trim().slice(0,80),chon:document.querySelectorAll('main .ums-table tbody input[type=checkbox]:checked').length};})()`);
  if (!lop) { log('Không có lớp nào đang có công thức — bỏ'); b.close(); return; }
  log(`Lớp: ${lop.ten}\n      id ${lop.id}, xâu hiện hành "${lop.xau}", số ô đang chọn ${lop.chon}`);
  if (lop.chon !== 1) { log('!! Số ô chọn khác 1 — dừng'); b.close(); return; }
  const truoc = await b.ev(DS(lop.id));
  log(`Trước: ${truoc.length} dòng áp dụng của lớp`);
  await b.say('Lưu công thức (giữ nguyên xâu)');
  await b.takeLog();
  await b.ev(`document.querySelector('main [data-a="luu"]').click()`);
  if (await b.waitFor(`Array.prototype.some.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open})`, 5000)) {
    await b.ev(`(function(){var d=Array.prototype.filter.call(document.querySelectorAll('dialog.ums-dialog'),function(d){return d.open});d[d.length-1].querySelector('button[value="1"]').click();})()`);
  } else log('!! Không có hộp hỏi lại — toast: ' + await b.ev(`Array.prototype.map.call(document.querySelectorAll('.ums-toast'),function(t){return t.textContent.trim()}).join(' / ')`));
  await b.sleep(1000); await b.idle(20000);
  const g = (await b.takeLog()).filter(x => /ThemMoi/.test(x.action));
  log('Lưu: ' + (g.length ? g.map(x => x.action + (x.n === 'LOI' ? ' LỖI ' + x.loi.slice(0, 150) : ' OK')).join(' ; ') : 'không gửi lời gọi'));
  const sau = await b.ev(DS(lop.id));
  const moi = sau.filter(x => !truoc.some(y => y.ID === x.ID));
  log(`Sau: ${sau.length} dòng, mới ${moi.length}` + (moi[0] ? ` (xâu "${moi[0].XAU}")` : ''));
  if (moi.length === 1) {
    const x = await b.ev(`ums.api.call({action:'D_CongThucDiem_ApDung/Xoa',strIds:${JSON.stringify(moi[0].ID)},strNguoiThucHien_Id:''}).then(function(){return 'ok'},function(e){return 'LOI '+e.message})`);
    log('Xoá dòng mới: ' + x);
    const cuoi = await b.ev(DS(lop.id));
    const giong = cuoi.length === truoc.length && cuoi.every(c => truoc.some(t => t.ID === c.ID));
    log(giong ? `SẠCH — danh sách về đúng như trước (${cuoi.length} dòng)` : '!! Danh sách KHÁC lúc đầu: ' + JSON.stringify(cuoi).slice(0, 300));
  } else if (moi.length > 1) log('!! Nhiều dòng mới — KHÔNG xoá tự động: ' + moi.map(x => x.ID).join(','));
  await b.ev(`document.querySelectorAll('main .ums-table tbody input[type=checkbox]:checked').forEach(function(c){c.click()})`);
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
