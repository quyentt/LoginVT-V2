/* ums.pat.chain (assets/js/patterns.js) — luật cha → con (người dùng 2026-09-21): chưa chọn cha thì KHOÁ con; chọn / xoá cha thì xoá trắng con.
   Ô chọn thường (không select2) → nhánh `change`; ô select2 → nhánh select2:select / clear. */
'use strict';
var test = require('node:test'), assert = require('node:assert/strict');
var { tao, thuan } = require('./moi-truong');

function selects(w, n, nhieu) {
    var list = [];
    for (var i = 0; i < n; i++) {
        var s = w.document.createElement('select');
        if (nhieu) s.multiple = true;   // đặt TRƯỚC khi thêm option: select đơn tự chọn option đầu, đổi sang multiple sau thì giữ luôn lựa chọn đó
        s.innerHTML = '<option value="">Chọn</option><option value="A">A</option><option value="B">B</option>';
        w.document.body.appendChild(s); list.push(s);
    }
    return list;
}
function doi(w, el, v) { el.value = v; w.jQuery(el).trigger('change'); }

test('ô thường: tầng dưới khoá tới khi tầng trên chọn; chọn / xoá tầng trên xoá trắng mọi tầng dưới', function () {
    var w = tao();
    var L = selects(w, 3), he = L[0], khoa = L[1], lop = L[2];
    w.ums.pat.chain(L);
    assert.equal(he.disabled, false); assert.equal(khoa.disabled, true); assert.equal(lop.disabled, true);
    doi(w, he, 'A');
    assert.equal(khoa.disabled, false); assert.equal(lop.disabled, true, 'cháu vẫn khoá vì con chưa chọn');
    doi(w, khoa, 'B');
    assert.equal(lop.disabled, false);
    doi(w, lop, 'A');
    doi(w, he, 'B');
    assert.equal(khoa.value, ''); assert.equal(lop.value, '', 'đổi cha → con, cháu xoá trắng');
    assert.equal(khoa.disabled, false); assert.equal(lop.disabled, true);
    doi(w, he, '');
    assert.equal(khoa.disabled, true); assert.equal(lop.disabled, true);
});

test('ô chọn nhiều: có giá trị khi mảng khác rỗng; xoá cha thì val([])', function () {
    var w = tao();
    var L = selects(w, 2, true);
    w.ums.pat.chain(L);
    assert.equal(L[1].disabled, true);
    w.jQuery(L[0]).val(['A', 'B']).trigger('change');
    assert.equal(L[1].disabled, false);
    w.jQuery(L[1]).val(['A']).trigger('change');
    w.jQuery(L[0]).val([]).trigger('change');
    assert.deepEqual(thuan(w.jQuery(L[1]).val()), []); assert.equal(L[1].disabled, true);
});

test('select2: select2:select xoá con; select2:clear phát lại select2:select để màn nạp lại tầng con (phatLai mặc định), tắt bằng phatLai: false', function () {
    var w = tao();
    var L = selects(w, 2);
    w.jQuery(L[0]).select2(); w.jQuery(L[1]).select2();
    var phat = 0;
    w.jQuery(L[0]).on('select2:select', function () { phat++; });
    w.ums.pat.chain(L);
    assert.equal(L[1].disabled, true);
    w.jQuery(L[0]).val('A').trigger('change.select2');
    w.jQuery(L[0]).trigger({ type: 'select2:select', params: { data: { id: 'A' } } });
    assert.equal(L[1].disabled, false);
    w.jQuery(L[1]).val('B').trigger('change.select2');
    w.jQuery(L[0]).val('').trigger('change.select2');
    phat = 0;
    w.jQuery(L[0]).trigger({ type: 'select2:clear' });
    assert.equal(L[1].value, ''); assert.equal(L[1].disabled, true);
    assert.equal(phat, 1, 'phát lại đúng một select2:select');

    var M = selects(w, 2);
    w.jQuery(M[0]).select2(); w.jQuery(M[1]).select2();
    var phat2 = 0; w.jQuery(M[0]).on('select2:select', function () { phat2++; });
    w.ums.pat.chain(M, { phatLai: false });
    w.jQuery(M[0]).trigger({ type: 'select2:clear' });
    assert.equal(phat2, 0);
});

test('bỏ qua phần tử không phải DOM; không có jQuery thì trả về đối tượng có sync() vô hại', function () {
    var w = tao();
    var L = selects(w, 2);
    assert.doesNotThrow(function () { w.ums.pat.chain([null, L[0], undefined, L[1]]); });
    assert.equal(L[1].disabled, true);
    var jq = w.jQuery; w.jQuery = undefined;
    var r = w.ums.pat.chain(L);
    assert.equal(typeof r.sync, 'function'); r.sync();
    w.jQuery = jq;
});
