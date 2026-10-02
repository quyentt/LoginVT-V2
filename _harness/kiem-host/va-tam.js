// node va-tam.js <idGốcMàn> <tệp .js trên máy> [tệp …]   — chạy thử MÃ VỪA SỬA trên host TRƯỚC khi up.
// Thay phần tử gốc của màn đang mở bằng một bản trống (bỏ mọi trình xử lý cũ) rồi chạy lần lượt các tệp .js trên máy
// trong trang host → màn dựng lại bằng mã mới, gọi máy chủ thật. Tải lại trang là về mã đang có trên host.
// Tệp chung có chốt "if (ums.x) return" thì thêm XOA="ums.xlhvDk,ums.abc" để gỡ chốt trước khi chạy.
// Đây chỉ là kiểm sớm: sổ lỗi mã vẫn ghi "đã sửa — chờ up", up xong phải kiểm lại bằng tệp thật trên host.
const fs = require('fs');
const path = require('path');
const { connect } = require('./cdp');
(async () => {
  const [goc, ...tep] = process.argv.slice(2);
  if (!goc || !tep.length) { console.error('Thiếu <idGốcMàn> <tệp…>'); process.exit(1); }
  const b = await connect();
  const xoa = (process.env.XOA || '').split(',').filter(Boolean);
  const co = await b.ev(`(function(){var r=document.getElementById(${JSON.stringify(goc)});if(!r)return false;
    Array.prototype.forEach.call(document.querySelectorAll('dialog'),function(d){if(d.open)d.close();});
    var n=r.cloneNode(false);r.parentNode.replaceChild(n,r);
    ${xoa.map(x => `try{delete ${x}}catch(e){}`).join(';')}
    return true;})()`);
  if (!co) { console.error('Màn đang mở không có phần tử #' + goc); process.exit(2); }
  for (const t of tep) {
    const ma = fs.readFileSync(path.resolve(t), 'utf8');
    await b.ev(ma + '\n//# sourceURL=va-tam/' + path.basename(t));
    console.log('đã chạy ' + path.basename(t));
  }
  await b.hook(); await b.idle(15000);
  b.takeErrors().forEach(x => console.log('JS  ' + x.slice(0, 200)));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
