/* ums.crud (assets/js/crud.js) — filterValues / formValues / fillForm / fieldDef, dựng thật trong jsdom với autoload: false */
'use strict';
var test = require('node:test'), assert = require('node:assert/strict');
var { tao, thuan } = require('./moi-truong');

function dung(w, cfg) {
    var root = w.document.createElement('div'); w.document.getElementById('screen').appendChild(root);
    var c = w.ums.crud(Object.assign({ root: root, embedded: true, autoload: false, title: 'T', columns: [{ title: 'Tên', prop: 'TEN' }], api: {} }, cfg));
    return { c: c, root: root };
}
function o(root, scope, k) { return root.querySelector('[data-scope="' + scope + '"][data-k="' + k + '"]'); }

test('filterValues: trim giá trị; ô chọn chưa nạp xong danh sách mà có value mặc định thì dùng mặc định', function () {
    var w = tao();
    var d = dung(w, {
        filters: [
            { key: 'strTuKhoa', label: 'Từ khoá' },
            { key: 'strHe', label: 'Hệ', type: 'select', value: 'H1', placeholder: 'Chọn hệ' },
            { key: 'strKhoa', label: 'Khoá', type: 'select', placeholder: 'Chọn khoá' }
        ]
    });
    var tk = o(d.root, 'filter', 'strTuKhoa'), he = o(d.root, 'filter', 'strHe'), khoa = o(d.root, 'filter', 'strKhoa');
    assert.ok(tk && he && khoa, 'ba ô lọc được dựng với data-scope="filter"');
    assert.equal(he.tagName, 'SELECT');
    tk.value = '  abc  ';
    assert.deepEqual(thuan(d.c.filterValues()), { strTuKhoa: 'abc', strHe: 'H1', strKhoa: '' });
    // danh sách nạp xong (nhiều hơn 1 option) → đọc đúng giá trị đang chọn, kể cả rỗng
    he.add(new w.Option('Hệ 1', 'H1')); he.add(new w.Option('Hệ 2', 'H2')); he.value = 'H2';
    assert.equal(d.c.filterValues().strHe, 'H2');
    he.value = '';
    assert.equal(d.c.filterValues().strHe, '', 'đã nạp xong mà người dùng bỏ chọn thì KHÔNG quay về mặc định');
});

test('formValues: trim; check → on/off (mặc định 1 / ""); static bỏ qua; khoá đúng tên tham số', function () {
    var w = tao();
    var d = dung(w, {
        save: function () {},
        fields: [
            { key: 'strTen', label: 'Tên', required: true },
            /* ô đánh dấu KHÔNG có kiểu 'check' đơn — luôn là nhóm 'checks' với items (fieldDef tìm cả trong items) */
            { type: 'checks', label: 'Tuỳ chọn', items: [{ key: 'bA', label: 'A', on: 'Y', off: 'N' }, { key: 'bB', label: 'B' }] },
            { key: 'ghi', label: 'Ghi', type: 'static' },
            { key: 'dSo', label: 'Số', type: 'number' },
            { key: 'strMoTa', label: 'Mô tả', type: 'textarea' }
        ]
    });
    var ten = o(d.root, 'form', 'strTen'), a = o(d.root, 'form', 'bA'), b = o(d.root, 'form', 'bB'), so = o(d.root, 'form', 'dSo'), mt = o(d.root, 'form', 'strMoTa');
    assert.ok(ten && a && b && so && mt);
    assert.equal(a.type, 'checkbox'); assert.equal(mt.tagName, 'TEXTAREA');
    ten.value = ' Nguyễn '; a.checked = true; b.checked = false; so.value = '12'; mt.value = 'x';
    var v = thuan(d.c.formValues());
    assert.deepEqual(v, { strTen: 'Nguyễn', bA: 'Y', bB: '', dSo: '12', strMoTa: 'x' });
    assert.equal('ghi' in v, false, 'ô static không gửi');
    a.checked = false; b.checked = true;
    v = thuan(d.c.formValues());
    assert.equal(v.bA, 'N'); assert.equal(v.bB, 1, 'hệ cũ: đánh dấu → 1');
});

test('fillForm(row) → formValues khứ hồi: col, get(row), value mặc định khi thêm mới', function () {
    var w = tao();
    var d = dung(w, {
        save: function () {},
        fields: [
            { key: 'strTen', label: 'Tên', col: 'TEN' },
            { key: 'strMa', label: 'Mã', get: function (r) { return (r.MA || '').toUpperCase(); } },
            { key: 'dThuTu', label: 'Thứ tự', type: 'number', col: 'THUTU', value: 1 },
            { type: 'checks', label: 'Trạng thái', items: [{ key: 'bHieuLuc', label: 'Hiệu lực', col: 'HIEULUC' }] }
        ]
    });
    d.c.fillForm({ TEN: 'Lớp A', MA: 'ab', THUTU: 7, HIEULUC: 1 });
    assert.deepEqual(thuan(d.c.formValues()), { strTen: 'Lớp A', strMa: 'AB', dThuTu: '7', bHieuLuc: 1 });
    d.c.fillForm(null);
    var v = thuan(d.c.formValues());
    assert.equal(v.strTen, ''); assert.equal(v.dThuTu, '1', 'thêm mới lấy value mặc định'); assert.equal(v.bHieuLuc, '');
});

test('fieldDef tìm cả trong nhóm items; không có thì null', function () {
    var w = tao();
    var d = dung(w, { save: function () {}, fields: [{ key: 'a', label: 'A' }, { type: 'row', items: [{ key: 'b', label: 'B', col: 'BB' }, { key: 'c', label: 'C' }] }] });
    assert.equal(d.c.fieldDef('a').label, 'A');
    assert.equal(d.c.fieldDef('b').col, 'BB');
    assert.equal(d.c.fieldDef('zzz'), null);
});

test('render: embedded không vẽ tiêu đề trang; có save thì có nút Thêm mới; thiếu root thì ném lỗi rõ', function () {
    var w = tao();
    var d1 = dung(w, { fields: [{ key: 'a', label: 'A' }] });
    assert.equal(d1.root.querySelector('.ums-page__title'), null);
    assert.equal(d1.root.querySelector('[data-c$=":add"]'), null, 'không có save → không có Thêm mới');
    var d2 = dung(w, { save: function () {}, fields: [{ key: 'a', label: 'A' }] });
    assert.ok(d2.root.querySelector('[data-c$=":add"]'));
    assert.throws(function () { w.ums.crud({ root: '#khong-co', columns: [] }); }, /không thấy root/);
});
