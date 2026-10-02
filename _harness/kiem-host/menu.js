// node menu.js <roleId>  — vào vai trò, in cây chức năng (id | tên | đường dẫn tệp)
const { connect } = require('./cdp');
(async () => {
  const role = process.argv[2];
  const b = await connect();
  // Tải lại trang ở đúng vai trò — tránh đọc nhầm menu cũ còn trong bộ nhớ
  await b.say('Vào vai trò ' + role);
  await b.ev(`location.hash = '#/r/${role}'; location.reload()`).catch(() => {});
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.state && document.readyState==="complete"', 30000);
  await b.hook();
  const ok = await b.waitFor('ums.state.menu && ums.state.menu.length > 0 && ums.state.roleId === ' + JSON.stringify(role), 30000);
  if (!ok) { b.log('KHÔNG nạp được menu — ảnh: ' + await b.shot('loi-menu-' + role.slice(0, 6))); process.exit(2); }
  await b.sleep(1500);
  const m = await b.ev(`ums.state.menu.map(function(x){return [x.id, x.parentId||x.parent||'', x.name, x.path||x.file||x.DUONGDANFILE||''].join(' | ')})`);
  m.forEach(x => b.log(x));
  b.log('Tổng: ' + m.length);
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
