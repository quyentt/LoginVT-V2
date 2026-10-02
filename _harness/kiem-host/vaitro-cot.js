// Đọc tên cột + vài dòng của LayDSVaiTroNguoiDung trên host (CHỈ ĐỌC) — để chọn cột mã vai trò gửi Cổng Help.
const { connect, readTk, ensureEdge } = require('./cdp');
(async () => {
  const tk = readTk();
  const base = tk.url.replace(/index\.aspx.*$/, '');
  await ensureEdge(base + 'login.aspx');
  const b = await connect();
  await b.goto(base + 'index.aspx');
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && ums.cfg', 30000);
  const kq = await b.ev(`(function(){var ep=(ums.cfg.api.endpoints||{}).roles||{};
    return ums.api.call({action:ep.action,func:ep.func,strChucNang_Id:''}).then(function(r){var d=r.data||[];
      return JSON.stringify({func:ep.func,so:d.length,cot:d.length?Object.keys(d[0]):[],
        dong:d.slice(0,6).map(function(x){var o={};Object.keys(x).forEach(function(k){if(/^(ID|MA|TEN|VAITRO|UNGDUNG|CODE)/i.test(k)&&k!=='ID')o[k]=x[k];});return o;})});
    });})()`);
  b.log(kq);
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
