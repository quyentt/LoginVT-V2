// Lấy MỘT token mẫu từ help-sso.aspx (đọc HTML bằng fetch, KHÔNG gửi sang Help), kiểm chữ ký với help-jwks.aspx,
// và đếm email thiếu / trùng trong danh sách người dùng (chỉ in SỐ ĐẾM). CHỈ ĐỌC.
const fs = require('fs'), crypto = require('crypto');
const { connect, readTk, ensureEdge } = require('./cdp');
const b64u = s => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
(async () => {
  const tk = readTk(); const base = tk.url.replace(/index\.aspx.*$/, '');
  await ensureEdge(base + 'login.aspx'); const b = await connect();
  await b.goto(base + 'index.aspx'); await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && ums.cfg', 30000);
  const r = JSON.parse(await b.ev(`Promise.all([
    fetch('help-sso.aspx',{credentials:'include',cache:'no-store'}).then(function(x){return x.text()}),
    fetch('help-jwks.aspx',{cache:'no-store'}).then(function(x){return x.text()})
  ]).then(function(a){var m=/name="token" value="([^"]+)"/.exec(a[0]);var f=/<form[^>]*action="([^"]+)"/.exec(a[0]);
    return JSON.stringify({token:m?m[1]:'',action:f?f[1]:'',loi:m?'':a[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,300),jwks:a[1]})})`));
  if (!r.token) { b.log('KHÔNG lấy được token: ' + r.loi); b.close(); return; }
  const [h, p, s] = r.token.split('.');
  const header = JSON.parse(b64u(h).toString('utf8')), payload = JSON.parse(b64u(p).toString('utf8'));
  const jwk = JSON.parse(r.jwks).keys.find(k => k.kid === header.kid);
  const ok = jwk ? crypto.verify('RSA-SHA256', Buffer.from(h + '.' + p), crypto.createPublicKey({ key: jwk, format: 'jwk' }), b64u(s)) : false;
  b.log('Form gửi tới: ' + r.action);
  b.log('Header: ' + JSON.stringify(header));
  b.log('Chữ ký khớp JWKS (kid ' + header.kid + '): ' + ok);
  b.log('aud=' + payload.aud + ' | iss=' + payload.iss + ' | sub=' + payload.sub + ' | có email=' + !!payload.email + ' | name=' + payload.name +
        ' | exp-iat=' + (payload.exp - payload.iat) + 's | số vai trò=' + ((payload.realm_access || {}).roles || []).length);
  const exp = new Date(payload.exp * 1000).toISOString();
  fs.mkdirSync('../gui-help', { recursive: true });
  fs.writeFileSync('../gui-help/token-mau.txt', [
    'Token mẫu SSO app → Cổng Help (RS256). Phát lúc ' + new Date(payload.iat * 1000).toISOString() + ', HẾT HẠN ' + exp + ' (sống ' + (payload.exp - payload.iat) + ' giây).',
    'Token đã hết hạn khi tới tay người đọc — dùng để kiểm claim và chữ ký (tắt kiểm exp khi thử), không đăng nhập được.',
    'JWKS: ' + base + 'help-jwks.aspx   |   kid: ' + header.kid, '', r.token, '',
    '--- header ---', JSON.stringify(header, null, 2), '--- payload ---', JSON.stringify(payload, null, 2), ''].join('\n'), 'utf8');
  b.log('Đã ghi _harness/gui-help/token-mau.txt');

  const dem = await b.ev(`(function(){var tong=0,thieu=0,m={};
    function lat(t){return ums.api.call({action:'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP',func:'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',versionAPI:'v1.0',strTuKhoa:'',pageIndex:t,pageSize:1000,dTrangThai:1,strChung_DonVi_Id:'',strVaiTro_Id:'',strPhanLoaiDoiTuong:'',silent:true,timeout:180000})
      .then(function(r){var d=r.data||[];d.forEach(function(x){tong++;var e=String(x.EMAIL||'').trim().toLowerCase();if(!e)thieu++;else m[e]=(m[e]||0)+1;});
        return (d.length===1000&&t<60)?lat(t+1):t;});}
    return lat(1).then(function(trang){var k=Object.keys(m),tr=k.filter(function(e){return m[e]>1});
      return JSON.stringify({trang:trang,tongNguoiDung:tong,thieuEmail:thieu,emailKhacNhau:k.length,emailBiTrung:tr.length,nguoiDinhTrung:tr.reduce(function(s,e){return s+m[e]},0),nhomTrungLonNhat:tr.reduce(function(s,e){return Math.max(s,m[e])},0)});});})()`);
  b.log('Email trong danh sách người dùng (đang hoạt động): ' + dem);
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
