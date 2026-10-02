// Bước 1: đăng nhập _v2 trên host, liệt kê vai trò. Không bấm nút ghi nào.
const { connect, readTk, ensureEdge } = require('./cdp');
(async () => {
  const tk = readTk();
  const base = tk.url.replace(/index\.aspx.*$/, '');
  await ensureEdge(base + 'login.aspx');
  const b = await connect();
  // Vào thẳng index.aspx: còn phiên thì ở lại trang chủ, hết phiên thì host tự chuyển về login.aspx
  await b.goto(base + 'index.aspx');
  await b.sleep(1000);
  if (await b.ev(`!!document.querySelector('[name=username],#username')`)) {
    await b.say('Mở trang đăng nhập');
    await b.ev(`(function(){var u=document.querySelector('[name=username],#username'),p=document.querySelector('[name=password],#password');
      u.value=${JSON.stringify(tk.user)};p.value=${JSON.stringify(tk.pass)};
      u.dispatchEvent(new Event('input',{bubbles:true}));p.dispatchEvent(new Event('input',{bubbles:true}));})()`);
    await b.say('Điền tài khoản (không ghi mật khẩu ra nhật ký)');
    await b.click('[name=cms_authenticate_do_login],#cms_authenticate_do_login', 'Bấm Đăng nhập');
  } else await b.say('Phiên đăng nhập còn — bỏ qua bước đăng nhập');
  await b.waitFor('/index\\.aspx/i.test(location.href) && document.readyState==="complete"', 30000);
  await b.sleep(3000);
  const loi = await b.ev(`(document.getElementById('lblNotify')||{}).textContent||''`).catch(() => '');
  b.log('URL sau đăng nhập: ' + await b.ev('location.href') + (loi ? '  | thông báo: ' + loi : ''));
  await b.waitFor('window.ums && ums.state && ums.state.roles && ums.state.roles.length > 0', 30000);
  await b.hook();
  await b.say('Đã vào trang chủ — đọc danh sách vai trò');
  const roles = await b.ev(`(ums.state.roles||[]).map(function(r){return r.id+' | '+r.name})`);
  b.log('Số vai trò: ' + (roles || []).length);
  (roles || []).forEach(r => b.log('  ' + r));
  b.log('Ảnh: ' + await b.shot('trang-chu'));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
