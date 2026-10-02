// node _harness/chot-can-quyet.js — CHỐT sổ _v2/assets/js/can-quyet.js theo phương án tạm (người dùng giao 2026-09-24).
// · Câu "cần quyết" có `now`  → chốt = làm như `now`, xoá khỏi sổ.
// · Câu "cần quyết" không `now` → chốt theo quyết định QD bên dưới (không đổi mã), xoá; hoặc chuyển nhóm (CHUYEN).
// · Điểm "kiểm trên host"      → chấp nhận hành vi hiện tại, xoá khỏi sổ.
// · Mục `ben` (oracle/dev/nghiepvu) → GIỮ.
// Mọi mục xoá ghi vào _v2/CAN-QUYET-DA-CHOT.md (nối thêm, không ghi đè).
const fs = require('fs'), path = require('path');
const GOC = path.join(__dirname, '..');
const F = path.join(GOC, '_v2/assets/js/can-quyet.js');
global.window = global;
require(F);
const S = ums.canQuyet;
const NGAY = process.env.NGAY || new Date().toISOString().slice(0, 10);

// Quyết định cho câu không có `now` — khoá: đầu câu hỏi
const QD = [
  ['Đã bỏ phần "thêm cán bộ sử dụng"', 'Không làm lại (bản gốc lỗi JS, chưa từng chạy).'],
  ['Bản gốc chưa từng vẽ được bảng', 'Giữ bản dựng lại; màn KHÔNG có trên menu Tài chính của host (host dùng donviphimoi*).'],
  ['Nút Xoá đã bỏ (bản gốc gọi nhầm TN_KeHoach/Xoa)', 'Giữ không có nút Xoá; màn không có trên menu Tài chính của host.'],
  ['Danh sách đối tượng (khung chung _doituong)', 'Giữ kiểu bảng như hiện tại; màn không có trên menu Tài chính của host.'],
  ['Danh sách lớp của buổi học gửi strNguoiThucHien_Id', 'Giữ id CÁN BỘ (người đang dùng màn cán bộ).'],
  ['Cột "File" bản gốc tải tệp lên', 'Giữ đã bỏ (bản gốc không lưu, không hiện).'],
  ['"Lấy điểm lại theo Rubric" nay hỏi lại', 'Giữ hỏi lại (tránh ghi đè điểm do bấm nhầm).'],
  ['Số lượng hiện từ SOLUONG', 'Giữ đúng cột như bản gốc.'],
  ['Số bài đọc SOBAICHAM', 'Giữ đúng cột như bản gốc.'],
  ['Chú giải có Kịch bản 3', 'Giữ như bản gốc (chỉ tính kịch bản 1, 2).']
];
// Câu không tự chốt được → chuyển sang nhóm người xử lý
const CHUYEN = [['Cấu hình VTB chép cứng', 'dev']];

const giu = {}, chot = [];
Object.keys(S).sort().forEach(function (k) {
  S[k].forEach(function (x) {
    if (x.ben) { (giu[k] = giu[k] || []).push(x); return; }
    const cv = CHUYEN.find(c => x.q.indexOf(c[0]) === 0);
    if (cv) { (giu[k] = giu[k] || []).push({ q: x.q, now: x.now, ben: cv[1] }); return; }
    let qd;
    if (x.host) qd = 'Chấp nhận hành vi hiện tại (chưa kiểm trên host).';
    else if (x.now) qd = 'Làm như hiện tại: ' + x.now;
    else { const m = QD.find(d => x.q.indexOf(d[0]) === 0); if (!m) throw new Error('Thiếu quyết định cho: ' + k + ' — ' + x.q); qd = m[1]; }
    chot.push({ k: k, loai: x.host ? 'Kiểm trên host' : 'Cần quyết', q: x.q, qd: qd });
  });
});

// Ghi sổ mới: giữ nguyên phần đầu tệp (chú thích + khai báo), thay phần thân bằng các mục còn giữ
const cu = fs.readFileSync(F, 'utf8');
const dau = cu.slice(0, cu.indexOf('    var S = {};'));
const cuoi = cu.slice(cu.indexOf('    ums.canQuyet = S;'));
let than = '    var S = {};\n    function them(k, ds) { k = k.toLowerCase(); S[k] = (S[k] || []).concat(ds); }\n\n' +
  '    /* Sổ đã CHỐT (lần gần nhất ' + NGAY + ') theo phương án tạm — các câu cần quyết / kiểm trên host đã chuyển sang\n' +
  '       _v2/CAN-QUYET-DA-CHOT.md. Người dùng 2026-09-26: sổ CHỈ giữ việc liên quan DỮ LIỆU (ben) — câu cần quyết về cách màn chạy thì tự chốt. */\n';
Object.keys(giu).sort().forEach(function (k) {
  than += '    them(' + JSON.stringify(k) + ', [\n' + giu[k].map(function (x) {
    const o = {}; if (x.man) o.man = x.man; o.q = x.q; if (x.now) o.now = x.now; o.ben = x.ben;
    return '        ' + JSON.stringify(o);
  }).join(',\n') + '\n    ]);\n';
});
fs.writeFileSync(F, dau + than + '\n' + cuoi);

// Lưu trữ
const MD = path.join(GOC, '_v2/CAN-QUYET-DA-CHOT.md');
let md = fs.existsSync(MD) ? fs.readFileSync(MD, 'utf8') : '# Sổ cần quyết — đã chốt\n\nCác mục đã gỡ khỏi `assets/js/can-quyet.js` kèm quyết định. Muốn mở lại một mục thì chép câu hỏi về sổ.\n';
md += '\n## Chốt ngày ' + NGAY + ' — theo phương án tạm (người dùng giao)\n\n' + chot.length + ' mục.\n';
let truoc = '';
chot.forEach(function (c) {
  if (c.k !== truoc) { md += '\n### ' + c.k + '\n\n'; truoc = c.k; }
  md += '- **[' + c.loai + ']** ' + c.q + '\n  - → ' + c.qd + '\n';
});
fs.writeFileSync(MD, md);
const dem = {}; Object.values(giu).forEach(l => l.forEach(x => dem[x.ben] = (dem[x.ben] || 0) + 1));
console.log('Đã chốt', chot.length, 'mục (cần quyết', chot.filter(c => c.loai === 'Cần quyết').length, ', kiểm host', chot.filter(c => c.loai !== 'Cần quyết').length, ') · giữ', JSON.stringify(dem));
