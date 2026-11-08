/* ums.nhomVaiTro (assets/js/nhom-vaitro.js) — thẻ trong MOTA, gộp danh mục "nhomvaitro", xếp vai trò vào nhóm, sắp trong nhóm */
'use strict';
var test = require('node:test'), assert = require('node:assert/strict');
var { tao } = require('./moi-truong');

test('tagOf / sttOf / withTags: đọc và ghi thẻ ở cuối MOTA, không phân biệt hoa thường, thay thẻ cũ', function () {
    var w = tao(), N = w.ums.nhomVaiTro;
    assert.equal(N.tagOf('Toàn quyền [NHOM:QuanTri] [stt:3]'), 'quantri');
    assert.equal(N.tagOf('không thẻ'), '');
    assert.equal(N.sttOf('x [stt:12]'), '12');
    assert.equal(N.sttOf('x [stt:0]'), '');
    assert.equal(N.withTags('Mô tả cũ [nhom:cong] [stt:1]', 'khaothi', '2'), 'Mô tả cũ [nhom:khaothi] [stt:2]');
    assert.equal(N.withTags('Mô tả cũ [nhom:cong]', '', ''), 'Mô tả cũ');
    assert.equal(N.withTags('', 'mobile', ''), '[nhom:mobile]');
});

test('gop: tên danh mục ghi đè, nhóm mới xếp trước "Khác" với màu riêng, thứ tự theo HESO1 / [stt:N], mã sai bị bỏ', function () {
    var w = tao(), N = w.ums.nhomVaiTro;
    var ds = N.gop([
        { MA: 'daotao', TEN: 'Đào tạo & CT', HESO1: 2 },
        { MA: 'thuvien', TEN: 'Thư viện', HESO1: 1 },
        { MA: 'Nhóm lạ', TEN: 'sai' },
        { MA: 'bosung', TEN: 'Bổ sung', MOTA: '[stt:3]' }
    ]);
    var keys = ds.map(function (g) { return g.key; });
    assert.equal(keys.slice(0, 3).join(','), 'thuvien,daotao,bosung');                  // có số đứng trước, theo số (mảng của realm jsdom → so chuỗi)
    assert.equal(keys[keys.length - 1], 'khac');                                           // "Khác" luôn cuối
    assert.equal(keys.indexOf('nhomla'), -1);
    assert.equal(N.nhom('daotao').name, 'Đào tạo & CT');
    assert.equal(N.nhom('thuvien').tone, 'thuvien');
    assert.equal(N.nhom('thuvien').color, N.MAU_MOI[0]);
    assert.equal(ds.length, 9 + 2);
    assert.ok(/\.ums-tile--thuvien\{/.test(w.document.getElementById('ums-nhom-vaitro-mau').textContent));
});

test('phanLoai: thẻ > roleGroupMap > roleRules > khac; biểu tượng luôn theo luật khớp tên; thẻ mã lạ bị bỏ', function () {
    var w = tao(), N = w.ums.nhomVaiTro;
    N.gop([]);
    assert.equal(N.phanLoai({ TENVAITRO: 'Quản lý điểm', MOTA: 'ghi chú [nhom:cong]' }).group, 'cong');       // thẻ thắng bảng tên
    var a = N.phanLoai({ TENVAITRO: 'QUẢN LÝ ĐIỂM' });                                                              // bảng tên: không phân biệt hoa thường / dấu
    assert.equal(a.group, 'khaothi'); assert.equal(a.icon, 'fa-light fa-pen-to-square'); assert.equal(a.matched, true);
    assert.equal(N.phanLoai({ TENVAITRO: 'Cổng giảng viên' }).group, 'cong');                                     // chỉ có ở roleRules
    var k = N.phanLoai({ TENVAITRO: 'Vai trò không ai biết' });
    assert.equal(k.group, 'khac'); assert.equal(k.icon, 'fa-light fa-cube'); assert.equal(k.matched, false);
    var la = N.phanLoai({ TENVAITRO: 'Sinh viên', MOTA: '[nhom:khongco] [stt:4]' });
    assert.equal(la.group, 'tuyensinh'); assert.equal(la.stt, '4');
});

test('soSanh: có stt trước theo số, chưa có giữ thứ tự máy chủ; tenNgan bỏ "Quản lý "', function () {
    var w = tao(), N = w.ums.nhomVaiTro;
    var rows = [{ stt: '', idx: 0 }, { stt: '2', idx: 1 }, { stt: '', idx: 2 }, { stt: '1', idx: 3 }];
    assert.deepEqual(rows.slice().sort(N.soSanh).map(function (r) { return r.idx; }), [3, 1, 0, 2]);
    assert.equal(N.tenNgan('Quản lý khảo thí'), 'Khảo thí');
    assert.equal(N.tenNgan('Nhân sự'), 'Nhân sự');
});

test('san: chế độ demo đọc danh mục nhomvaitro từ fixture rồi gộp; gọi lần hai trả cùng Promise', async function () {
    var w = tao();
    w.ums.state = { mode: 'demo' };
    var N = w.ums.nhomVaiTro, p1 = N.san();
    assert.equal(N.san(), p1);
    var ds = await p1;
    assert.equal(ds[0].key, 'daotao');                       // HESO1 1 trong fixture
    assert.equal(N.nhom('daotao').name, 'Đào tạo & chương trình');
    assert.ok(N.nhom('thuvien'));
});
