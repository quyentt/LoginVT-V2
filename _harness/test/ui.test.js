/* ums.ui.table (assets/js/ui.js) — markup bảng: Stt, render, rỗng, phân trang, nhóm tiêu đề, dời cột Thao tác / ô chọn xuống cuối, tổng */
'use strict';
var test = require('node:test'), assert = require('node:assert/strict');
var { tao } = require('./moi-truong');

function bang(w, cfg) {
    var el = w.document.createElement('div'); w.document.body.appendChild(el);
    w.ums.ui.table(Object.assign({ el: el }, cfg));
    return el;
}
function chu(tr) { return [].map.call(tr.querySelectorAll('th,td'), function (c) { return c.textContent.trim(); }); }

test('cột Stt, prop escape HTML, render(row, i), data-id trên dòng', function () {
    var w = tao();
    var el = bang(w, {
        columns: [{ title: 'Tên', prop: 'TEN' }, { title: 'Mã', render: function (r, i) { return '<b>' + r.MA + i + '</b>'; } }],
        rows: [{ ID: 'X1', TEN: '<i>a</i>', MA: 'm' }, { ID: 'X2', TEN: 'b', MA: 'n' }]
    });
    assert.deepEqual(chu(el.querySelector('thead tr')), ['Stt', 'Tên', 'Mã']);
    assert.ok([].every.call(el.querySelectorAll('thead th'), function (t) { return t.getAttribute('scope') === 'col'; }), 'mọi th có scope="col" (việc J 15/10)');
    var tr = el.querySelectorAll('tbody tr');
    assert.equal(tr.length, 2);
    assert.equal(tr[0].getAttribute('data-id'), 'X1');
    assert.deepEqual(chu(tr[0]), ['1', '<i>a</i>', 'm0'], 'prop được escape, render thì không');
    assert.ok(tr[0].querySelector('td:nth-child(3) b'));
    assert.deepEqual(chu(tr[1]), ['2', 'b', 'n1']);
});

test('stt: false bỏ cột Stt; rows rỗng → một ô colspan đủ cột chứa khung trống với chữ cfg.empty', function () {
    var w = tao();
    var el = bang(w, { columns: [{ title: 'A', prop: 'A' }, { title: 'B', prop: 'B' }], rows: [], stt: false, empty: 'Không có dòng nào' });
    assert.deepEqual(chu(el.querySelector('thead tr')), ['A', 'B']);
    var td = el.querySelector('tbody td');
    assert.equal(td.getAttribute('colspan'), '2');
    assert.match(td.textContent, /Không có dòng nào/);
    var el2 = bang(w, { columns: [{ title: 'A', prop: 'A' }], rows: [] });
    assert.equal(el2.querySelector('tbody td').getAttribute('colspan'), '2', 'có Stt thì colspan + 1');
});

test('phân trang: Stt tiếp theo trang (index, size)', function () {
    var w = tao();
    var el = bang(w, { columns: [{ title: 'A', prop: 'A' }], rows: [{ A: 1 }, { A: 2 }], page: { index: 3, size: 10, total: 22 } });
    assert.deepEqual([].map.call(el.querySelectorAll('tbody tr td:first-child'), function (c) { return c.textContent; }), ['21', '22']);
});

test('nhóm tiêu đề: cột liền nhau cùng group gộp colspan, cột không nhóm rowspan hết tầng', function () {
    var w = tao();
    var el = bang(w, {
        columns: [{ title: 'Tên', prop: 'T' }, { title: 'LT', prop: 'LT', group: ['Số tiết'] }, { title: 'TH', prop: 'TH', group: ['Số tiết'] }, { title: 'Ghi chú', prop: 'G' }],
        rows: [{ T: 'a', LT: 1, TH: 2, G: '' }]
    });
    var hang = el.querySelectorAll('thead tr');
    assert.equal(hang.length, 2);
    var h0 = hang[0].querySelectorAll('th');
    assert.equal(h0[0].getAttribute('rowspan'), '2', 'Stt kéo hết tầng');
    assert.equal(h0[1].textContent, 'Tên'); assert.equal(h0[1].getAttribute('rowspan'), '2');
    assert.equal(h0[2].textContent, 'Số tiết'); assert.equal(h0[2].getAttribute('colspan'), '2'); assert.equal(h0[2].getAttribute('scope'), 'colgroup');
    assert.equal(h0[3].textContent, 'Ghi chú'); assert.equal(h0[3].getAttribute('rowspan'), '2');
    assert.deepEqual(chu(hang[1]), ['LT', 'TH']);
});

test('cột ô chọn + Thao tác khai ở ĐẦU bảng tự dời xuống cuối (Thao tác trước ô chọn), mang data-cot-goc; giuCho thì giữ', function () {
    var w = tao();
    var cols = [
        { head: '<input type="checkbox" data-chon="all">', render: function () { return '<input type="checkbox">'; } },
        { title: 'Thao tác', cls: 'is-actions', render: function () { return 'TT'; } },
        { title: 'Tên', prop: 'T' }
    ];
    var el = bang(w, { columns: cols, rows: [{ T: 'a' }] });
    var th = el.querySelectorAll('thead th');
    assert.equal(th[1].textContent, 'Tên');
    assert.equal(th[2].textContent, 'Thao tác'); assert.equal(th[2].getAttribute('data-cot-goc'), '2');
    assert.ok(th[3].querySelector('input[type=checkbox]')); assert.equal(th[3].getAttribute('data-cot-goc'), '1');
    var td = el.querySelectorAll('tbody td');
    assert.equal(td[1].textContent, 'a'); assert.equal(td[2].textContent, 'TT'); assert.ok(td[3].querySelector('input'));
    // oTheoGoc trả ô theo thứ tự màn khai
    var goc = w.ums.ui.oTheoGoc(el.querySelector('tbody tr'));
    assert.equal(goc[1].querySelector('input') !== null, true); assert.equal(goc[2].textContent, 'TT'); assert.equal(goc[3].textContent, 'a');
    var el2 = bang(w, { columns: [{ title: 'Thao tác', cls: 'is-actions', giuCho: true, render: function () { return 'TT'; } }, { title: 'Tên', prop: 'T' }], rows: [{ T: 'a' }] });
    assert.equal(el2.querySelectorAll('thead th')[1].textContent, 'Thao tác', 'giuCho: true giữ nguyên chỗ');
    var el3 = bang(w, { chonCuoi: false, columns: cols, rows: [{ T: 'a' }] });
    assert.equal(el3.querySelectorAll('thead th')[2].textContent, 'Thao tác', 'chonCuoi: false giữ nguyên');
});

test('sum: true cộng số trên các dòng đang hiện (bỏ dấu ngăn nghìn), sum là hàm thì tự tính, sumAll thay dòng đang hiện', function () {
    var w = tao();
    var el = bang(w, {
        columns: [{ title: 'Tên', prop: 'T' }, { title: 'Tiền', prop: 'TIEN', sum: true }, { title: 'Ghi', prop: 'G', sum: function (rows) { return 'n=' + rows.length; } }],
        rows: [{ T: 'a', TIEN: '1,500,000' }, { T: 'b', TIEN: 250000 }, { T: 'c', TIEN: null }]
    });
    var foot = el.querySelectorAll('tfoot td');
    assert.equal(foot[0].textContent, 'Tổng');
    assert.match(foot[2].textContent.replace(/[.,\s]/g, ''), /^1750000$/);
    assert.equal(foot[3].textContent, 'n=3');
    var el2 = bang(w, { columns: [{ title: 'Tiền', prop: 'TIEN', sum: true }], rows: [{ TIEN: 1 }], sumAll: [{ TIEN: 10 }, { TIEN: 20 }] });
    assert.match(el2.querySelector('tfoot td:last-child').textContent, /30/);
    var el3 = bang(w, { columns: [{ title: 'Tiền', prop: 'TIEN', sum: true }], rows: [] });
    assert.equal(el3.querySelector('tfoot'), null, 'không dòng thì không có tổng');
});

test('ui.iconBtn: nút chỉ biểu tượng có title + aria-label cùng chữ, icon aria-hidden (việc J 15/10)', function () {
    var w = tao();
    var el = w.document.createElement('div'); el.innerHTML = w.ums.ui.iconBtn('edit', 'X1') + w.ums.ui.iconBtn('khong-co');
    var b = el.querySelectorAll('button');
    assert.equal(b[0].getAttribute('aria-label'), 'Sửa'); assert.equal(b[0].getAttribute('title'), 'Sửa'); assert.equal(b[0].getAttribute('data-id'), 'X1');
    assert.equal(b[0].querySelector('i').getAttribute('aria-hidden'), 'true');
    assert.equal(b[1].getAttribute('aria-label'), 'Xem chi tiết', 'kind lạ rơi về view');
});
