// Kiểm SSO sang Cổng Help trên host — CHỈ ĐỌC, không gửi token sang Help.
//   node sso-xem.js        → mở help-jwks.aspx rồi help-sso.aspx?xem=1 (chế độ xem thử), in nội dung
// Cần phiên đăng nhập (tự đăng nhập bằng tk.md như dangnhap.js).
const { connect, readTk, ensureEdge } = require('./cdp');
(async () => {
  const tk = readTk();
  const base = tk.url.replace(/index\.aspx.*$/, '');
  // GOC=1 → kiểm bản ở THƯ MỤC GỐC ứng dụng (<ứng dụng>/help-sso.aspx) thay vì bản trong _v2
  const sso = process.env.GOC ? base.replace(/_v2\/$/i, '') : base;
  await ensureEdge(base + 'login.aspx');
  const b = await connect();
  await b.goto(base + 'index.aspx');
  await b.sleep(1000);
  if (await b.ev(`!!document.querySelector('[name=username],#username')`)) {
    await b.ev(`(function(){var u=document.querySelector('[name=username],#username'),p=document.querySelector('[name=password],#password');
      u.value=${JSON.stringify(tk.user)};p.value=${JSON.stringify(tk.pass)};
      u.dispatchEvent(new Event('input',{bubbles:true}));p.dispatchEvent(new Event('input',{bubbles:true}));})()`);
    await b.click('[name=cms_authenticate_do_login],#cms_authenticate_do_login', 'Bấm Đăng nhập');
    await b.waitFor('/index\\.aspx/i.test(location.href) && document.readyState==="complete"', 30000);
    await b.sleep(2000);
  }
  b.log('Phiên: ' + await b.ev('location.href'));

  await b.goto(sso + 'help-jwks.aspx');
  await b.sleep(800);
  b.log('--- help-jwks.aspx ---');
  b.log((await b.ev('document.body.innerText')).slice(0, 600));

  await b.goto(sso + 'help-sso.aspx?xem=1');
  await b.sleep(1500);
  b.log('--- help-sso.aspx?xem=1 (' + await b.ev('location.href') + ') ---');
  b.log(await b.ev('document.body.innerText'));
  b.log('Ảnh: ' + await b.shot('sso-xem'));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
