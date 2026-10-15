/* ums.api (assets/js/api.js) — kiểm qua hành vi công khai: ums.api.call với fetch giả, chế độ demo, ums.util.ngaySinh */
'use strict';
var test = require('node:test'), assert = require('node:assert/strict');
var { tao, thuan } = require('./moi-truong');

function phienThat(w) {
    w.ums.state = { mode: 'api', chucNangId: 'CN1', roleId: 'R1' };
    w.ums.session = { ready: true, api: { TC: '/tc', NS: 'http://ns.local/api' }, apiUrlTemp: 'http://host', userId: 'U1', appId: 'R1', tokenJWT: 'JWT1' };
}
/* fetch giả: ghi lại (url, init) rồi trả theo `tra` */
function fetchGia(w, tra) {
    var ghi = [];
    w.fetch = function (url, init) {
        ghi.push({ url: url, init: init });
        if (tra instanceof Error || tra instanceof w.Error) return Promise.reject(tra);   // lỗi tạo từ cửa sổ jsdom là Error của realm khác
        var r = tra || {};
        return Promise.resolve({
            ok: r.ok !== false, status: r.status || 200,
            json: function () { return Promise.resolve(r.json); },
            text: function () { return Promise.resolve(r.text || ''); }
        });
    };
    return ghi;
}
function thamSo(body) { var o = {}; new (require('url').URLSearchParams)(body).forEach(function (v, k) { o[k] = v; }); return o; }

test('POST: thân form-urlencoded, tự chèn tham số hệ thống khi màn để trống, bỏ khoá undefined, khoảng trắng thành +', async function () {
    var w = tao(); phienThat(w);
    var ghi = fetchGia(w, { json: { Success: true, Data: [{ ID: 1 }], Pager: 1, Message: 'm' } });
    var r = await w.ums.api.call({ action: 'TC_HoaDon/LayDanhSach', strTuKhoa: 'a b', boQua: undefined, rong: '', strNguoiThucHien_Id: '', silent: true });
    assert.equal(ghi.length, 1);
    assert.equal(ghi[0].url, 'http://host/tc/TC_HoaDon/LayDanhSach');
    assert.equal(ghi[0].init.method, 'POST');
    assert.equal(ghi[0].init.headers['Authorization'], 'Bearer JWT1');
    assert.match(ghi[0].init.headers['Content-Type'], /x-www-form-urlencoded/);
    var b = ghi[0].init.body;
    assert.match(b, /strTuKhoa=a(\+|%20)b/, 'jQuery 3 mã hoá khoảng trắng %20 (jQuery 1/2 và bản tự viết: +) — máy chủ đọc như nhau');
    assert.doesNotMatch(b, /boQua=/, 'khoá undefined không gửi');
    assert.match(b, /(^|&)rong=(&|$)/, 'chuỗi rỗng vẫn gửi');
    var p = thamSo(b);
    assert.equal(p.strChucNang_Id, 'CN1'); assert.equal(p.strChucNangHeThong_Id, 'CN1');
    assert.equal(p.strNguoiThucHien_Id, 'U1', 'chuỗi rỗng cũng bị thay — như bản gốc if (!x)');
    assert.equal(p.strVaiTroDangNhap_Id, 'R1'); assert.equal(p.strNguoiThucVai_Id, '');
    assert.deepEqual(thuan(r.data), [{ ID: 1 }]); assert.equal(r.pager, 1); assert.equal(r.message, 'm'); assert.equal(r.raw.Success, true);
});

test('GET: tham số lên query string kèm _=, base URL tuyệt đối không ghép apiUrlTemp', async function () {
    var w = tao(); phienThat(w);
    var ghi = fetchGia(w, { json: { Success: true, Data: [] } });
    await w.ums.api.call({ action: 'NS_HoSo/LayDS', method: 'GET', strId: 'X', silent: true });
    assert.equal(ghi[0].init.method, 'GET');
    assert.match(ghi[0].url, /^http:\/\/ns\.local\/api\/NS_HoSo\/LayDS\?/);
    assert.match(ghi[0].url, /strId=X/); assert.match(ghi[0].url, /&_=\d+$/);
    assert.equal(ghi[0].init.body, undefined);
});

test('có func + iM: body bọc { A: AE(json, phần sau dấu /) }, luôn POST', async function () {
    var w = tao(); phienThat(w); w.ums.session.iM = 'kkk';
    var ghi = fetchGia(w, { json: { Success: true, Data: [] } });
    await w.ums.api.call({ action: 'TC_X_MH/ABC', func: 'PKG.Pr', method: 'GET', silent: true });
    assert.equal(ghi[0].init.method, 'POST');
    var p = thamSo(ghi[0].init.body);
    assert.deepEqual(thuan(Object.keys(p)), ['A'], 'chỉ một khoá A');
    assert.ok(p.A.length > 10);
    assert.equal(w.AD(p.A, 'ABC').indexOf('"func":"PKG.Pr"') > -1, true, 'giải lại bằng AD với cùng khoá ra JSON gốc');
});

test('Success:false với ORA-20xxx: chỉ hiện câu người viết thủ tục đặt, giữ câu gốc ở err.goc', async function () {
    var w = tao(); phienThat(w);
    fetchGia(w, { json: { Success: false, Message: 'ORA-20001: Mã đã tồn tại\nORA-06512: at "PKG", line 3', Data: null } });
    await assert.rejects(w.ums.api.call({ action: 'TC_A/B', silent: true }), function (e) {
        assert.equal(e.message, 'Mã đã tồn tại'); assert.equal(e.kiemDuLieu, true); assert.match(e.goc, /ORA-06512/);
        assert.equal(e.status, 200); assert.equal(e.action, 'TC_A/B'); return true;
    });
});

test('Success:false không phải ORA-20xxx: giữ nguyên Message, không có kiemDuLieu', async function () {
    var w = tao(); phienThat(w);
    fetchGia(w, { json: { Success: false, Message: 'ORA-00942: table or view does not exist' } });
    await assert.rejects(w.ums.api.call({ action: 'TC_A/B', silent: true }), function (e) {
        assert.equal(e.message, 'ORA-00942: table or view does not exist'); assert.equal(e.kiemDuLieu, undefined); return true;
    });
});

test('mã HTTP lỗi + trang HTML của IIS: lấy vài chữ, bỏ thẻ, gộp khoảng trắng (hồi quy /s+/ → /\\s+/ 15/10)', async function () {
    var w = tao(); phienThat(w);
    fetchGia(w, { ok: false, status: 500, text: '<html><body><h1>Server   Error</h1>\n  <p>Request  timed out</p></body></html>' });
    await assert.rejects(w.ums.api.call({ action: 'TC_A/B', silent: true }), function (e) {
        assert.equal(e.message, 'Máy chủ trả mã 500 — Server Error Request timed out', 'chữ "s" phải còn nguyên');
        assert.equal(e.status, 500); return true;
    });
});

test('mã HTTP lỗi + thân JSON: lấy Message; câu dài cắt 140 ký tự', async function () {
    var w = tao(); phienThat(w);
    var dai = new Array(200).join('x');
    fetchGia(w, { ok: false, status: 400, text: JSON.stringify({ Message: dai }) });
    await assert.rejects(w.ums.api.call({ action: 'TC_A/B', silent: true }), function (e) {
        assert.equal(e.message, 'Máy chủ trả mã 400 — ' + dai.slice(0, 140) + '…'); return true;
    });
});

test('401 → err.expired', async function () {
    var w = tao(); phienThat(w);
    fetchGia(w, { ok: false, status: 401 });
    await assert.rejects(w.ums.api.call({ action: 'TC_A/B', silent: true }), function (e) { assert.equal(e.expired, true); assert.equal(e.status, 401); return true; });
});

test('fetch ném TypeError (dịch vụ không phản hồi) → err.mang + dichVu theo tiền tố', async function () {
    var w = tao(); phienThat(w);
    fetchGia(w, new w.TypeError('Failed to fetch'));   // TypeError CỦA cửa sổ — api.js kiểm instanceof trong realm của nó
    await assert.rejects(w.ums.api.call({ action: 'NS_Phong/LayDS', silent: true }), function (e) {
        assert.equal(e.mang, true); assert.equal(e.dichVu, 'NS'); assert.match(e.message, /Không kết nối được dịch vụ NS/); return true;
    });
});

test('thiếu action / tiền tố không có trong Init_API / phiên chưa sẵn sàng → reject rõ lý do, không gọi fetch', async function () {
    var w = tao(); phienThat(w);
    var ghi = fetchGia(w, { json: {} });
    await assert.rejects(w.ums.api.call({ silent: true }), /Thiếu action/);
    await assert.rejects(w.ums.api.call({ action: 'ZZ_A/B', silent: true }), /tiền tố "ZZ"/);
    w.ums.session.ready = false; w.ums.session.error = 'lỗi X';
    await assert.rejects(w.ums.api.call({ action: 'TC_A/B', silent: true }), /Phiên chưa sẵn sàng: lỗi X/);
    assert.equal(ghi.length, 0);
});

test('chỉ báo đang tải: lời gọi thường bật lớp ums-busy, silent thì không, xong thì tắt', async function () {
    var w = tao(); phienThat(w);
    fetchGia(w, { json: { Success: true, Data: [] } });
    var p = w.ums.api.call({ action: 'TC_A/B' });
    assert.equal(w.document.documentElement.classList.contains('ums-busy'), true);
    await p; await new Promise(function (r) { setTimeout(r, 0); });   // .finally() chạy sau khi resolve một nhịp
    assert.equal(w.document.documentElement.classList.contains('ums-busy'), false);
    var q = w.ums.api.call({ action: 'TC_A/B', silent: true });
    assert.equal(w.document.documentElement.classList.contains('ums-busy'), false);
    await q;
});

test('chế độ demo: tra fixture theo func → action#strMaBangDanhMuc → action; hàm thì gọi với tham số; thiếu thì [] + console.info', async function () {
    var w = tao(); w.ums.state = { mode: 'demo' };
    w.ums.demo.add({
        'PKG.LayDS': [{ ID: 'F' }],
        'CMS_DM/Lay#TAICHINH.MAUIN': [{ ID: 'DM' }],
        'CMS_DM/Lay': [{ ID: 'A' }],
        'TC_Ham/Goi': function (o) { return [{ ID: 'H-' + o.strId }]; },
        'TC_Phuc/Tap': { rows: [{ ID: 'P' }], pager: 99, message: 'NEWID', raw: { Id: 'X1' } }
    });
    assert.deepEqual(thuan((await w.ums.api.call({ action: 'CMS_DM/Lay', func: 'PKG.LayDS', strMaBangDanhMuc: 'TAICHINH.MAUIN' })).data), [{ ID: 'F' }], 'func trước');
    assert.deepEqual(thuan((await w.ums.api.call({ action: 'CMS_DM/Lay', strMaBangDanhMuc: 'TAICHINH.MAUIN' })).data), [{ ID: 'DM' }], 'action#danh mục trước action');
    assert.deepEqual(thuan((await w.ums.api.call({ action: 'CMS_DM/Lay' })).data), [{ ID: 'A' }]);
    assert.deepEqual(thuan((await w.ums.api.call({ action: 'TC_Ham/Goi', strId: 7 })).data), [{ ID: 'H-7' }]);
    var r = await w.ums.api.call({ action: 'TC_Phuc/Tap' });
    assert.deepEqual(thuan(r.data), [{ ID: 'P' }]); assert.equal(r.pager, 99); assert.equal(r.message, 'NEWID'); assert.equal(r.raw.Id, 'X1'); assert.equal(r.raw.Success, true);
    var t = await w.ums.api.call({ action: 'TC_Khong/Co' });
    assert.deepEqual(thuan(t.data), []); assert.equal(t.pager, 0);
    assert.ok(w.__log.info.some(function (m) { return /chưa có dữ liệu mẫu/.test(m); }));
});

test('ums.util.ngaySinh — đủ ba ô, từng mức độ, câu lỗi, không nhập gì là hợp lệ', function () {
    var w = tao(); var f = function () { return thuan(w.ums.util.ngaySinh.apply(null, arguments)); }; var nay = new Date().getFullYear();
    assert.deepEqual(f('', '', '', ''), { loi: '', chuoi: '', ngay: '', thang: '', nam: '' });
    assert.deepEqual(f('5', '3', '2001', 'EXACT'), { loi: '', chuoi: '05/03/2001', ngay: 5, thang: 3, nam: 2001 });
    assert.deepEqual(f(' 05 ', '12', '1999', ''), { loi: '', chuoi: '05/12/1999', ngay: 5, thang: 12, nam: 1999 }, 'không rõ mức: suy theo ô có giá trị');
    assert.deepEqual(f('5', '3', '2001', 'MONTH_ONLY'), { loi: '', chuoi: '', ngay: '', thang: 3, nam: 2001 }, 'ô ngoài mức đang chọn bỏ đi, không gửi chuỗi //');
    assert.deepEqual(f('5', '3', '2001', 'YEAR_ONLY'), { loi: '', chuoi: '', ngay: '', thang: '', nam: 2001 });
    assert.deepEqual(f('5', '3', '2001', 'UNKNOWN'), { loi: '', chuoi: '', ngay: '', thang: '', nam: '' });
    assert.match(f('5', '', '2001', 'EXACT').loi, /Chưa nhập Tháng sinh/);
    assert.match(f('5', '', '', '').loi, /Chưa nhập Tháng sinh, Năm sinh/);
    assert.match(f('a', '3', '2001', '').loi, /Ngày sinh phải là số/);
    assert.match(f('', '', '99', '').loi, /4 chữ số, từ 1900 đến/);
    assert.match(f('', '', String(nay + 1), '').loi, /đến \d{4}/);
    assert.match(f('', '13', '2001', '').loi, /Tháng sinh phải từ 1 đến 12/);
    assert.match(f('31', '2', '2001', '').loi, /chỉ có 28 ngày/);
    assert.equal(f('29', '2', '2000', '').loi, '', 'năm nhuận');
    assert.match(f('0', '2', '2001', '').loi, /từ 1 đến 28/);
    assert.match(f('31', '12', String(nay), '').loi, /không được sau hôm nay/);
});
