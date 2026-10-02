// node bancu.js "<tên vai trò>" "<tên chức năng>"
// Mở BẢN CŨ (index.aspx) trên host, bấm vai trò rồi bấm chức năng theo TÊN hiển thị. Chỉ đọc.
const { connect, readTk } = require('./cdp');
(async () => {
  const [tenVT, tenCN] = process.argv.slice(2);
  const goc = readTk().url.replace(/_v2\/.*$/, '');
  const b = await connect();
  await b.goto(goc + 'index.aspx');
  await b.sleep(2500);
  await b.say('Bản CŨ — trang chủ');

  // Tìm phần tử nhỏ nhất có đúng chữ, đánh dấu để bấm
  const danhDau = (chu, id, anCungDuoc) => b.ev(`(function(){
    var chu=${JSON.stringify(chu)}.toLowerCase().replace(/\\s+/g,' ').trim();
    var ds=Array.prototype.filter.call(document.querySelectorAll('a,li,div,span,button,p,h3,h4,h5'),function(e){
      return (${anCungDuoc ? 'true' : 'e.offsetParent'}) && e.children.length<=2 && e.textContent.toLowerCase().replace(/\\s+/g,' ').trim()===chu;});
    if(!ds.length)return false;
    var e=ds[ds.length-1]; var a=e.closest('a,[onclick],.ungdung,li')||e; a.id=a.id||${JSON.stringify(id)}; return '[id="'+a.id+'"]';})()`);

  if (tenVT) {
    const sel = await danhDau(tenVT, '__vt');
    if (!sel) { b.log('Không thấy vai trò "' + tenVT + '" trên trang'); b.log('Ảnh: ' + await b.shot('bancu-khong-thay-vt')); b.close(); return; }
    await b.click(sel, 'Bấm vai trò "' + tenVT + '"');
    await b.sleep(4000);
  }
  if (tenCN) {
    b.log('Ảnh sau khi chọn vai trò: ' + await b.shot('bancu-vaitro'));
    let sel = await danhDau(tenCN, '__cn', true);
    // Mục nằm trong nhóm menu đang thu gọn → mở nhóm cha trước cho người xem thấy
    await b.ev(`(function(){var e=document.querySelector('${sel}');if(!e||e.offsetParent)return;var p=e.closest('li.treeview,li.nav-item,li.has-sub,li')&&e.closest('ul')&&e.closest('ul').closest('li');if(p){var a=p.querySelector('a');if(a)a.click();}})()`).catch(() => {});
    await b.sleep(800);
    if (!sel) { b.log('Không thấy chức năng "' + tenCN + '"'); b.log('Ảnh: ' + await b.shot('bancu-khong-thay-cn')); b.close(); return; }
    await b.click(sel, 'Bấm chức năng "' + tenCN + '"');
    await b.sleep(6000);
  }
  b.log('URL: ' + await b.ev('location.href'));
  b.log('Ảnh: ' + await b.shot('bancu-' + (tenCN || tenVT || 'trangchu').slice(0, 20)));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
