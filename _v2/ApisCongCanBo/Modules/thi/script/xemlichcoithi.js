/* =========================================================================
   xemlichcoithi — Lịch phân công coi thi của cán bộ đang đăng nhập (CHỈ XEM): lịch mới / lịch cũ.
   Bản gốc: thi/script/xemlichcoithi.js (vỏ index / Core). Khuôn: nhapdiem/lichchamthi.
   Lời gọi: NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayDSKetQuaCoiThi (chỉ strNguoiThucHien_Id) → rsChuaThi / rsDaThi.
   Không chép: phút ca thi không đệm số 0 ("7:0 -> 9:30") → "07:00 -> 09:30"; nhãn "Phòng thi thi" → "Phòng thi".
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('thi-xemlichcoithi');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function hai(n) { n = e(n); return n === '' ? '' : (String(n).length < 2 ? '0' : '') + n; }
    root.innerHTML = pat.page('Lịch coi thi', '') +
        '<div class="ums-u-mb-4">' + pat.panel({ title: 'Lịch phân công coi thi mới', icon: 'fa-calendar-day', count: 'nMoi', flush: true, zone: 'moi' }) + '</div>' +
        pat.panel({ title: 'Xem lịch phân công coi thi cũ', icon: 'fa-calendar-day', count: 'nCu', flush: true, zone: 'cu' });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var COT = [{ title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' },
        { title: 'Ca thi', cls: 'is-nowrap', render: function (x) { return ui.esc(e(x.CATHI_TEN) + ' (' + hai(x.CATHI_GIOBATDAU) + ':' + hai(x.CATHI_PHUTBATDAU) + ' -> ' + hai(x.CATHI_GIOKETTHUC) + ':' + hai(x.CATHI_PHUTKETTHUC) + ')'); } },
        { title: 'Môn thi', render: function (x) { return ui.esc(e(x.DAOTAO_HOCPHAN_TEN) + ' (' + e(x.DAOTAO_HOCPHAN_MA) + ')'); } },
        { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN' }, { title: 'Phòng thi', prop: 'PHONGTHI_TEN', cls: 'is-center' },
        { title: 'Kỳ, đợt', prop: 'THOIGIAN', cls: 'is-center' }, { title: 'Ghi chú', prop: 'GHICHU' }];
    z('moi').innerHTML = z('cu').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4BRIKJDUQNCACLigVKSgP', func: 'pkg_congthongtincanbo.LayDSKetQuaCoiThi', strNguoiThucHien_Id: uid() }).then(function (r) {
        var d = r.data || {};
        [['moi', 'nMoi', d.rsChuaThi], ['cu', 'nCu', d.rsDaThi]].forEach(function (t) {
            var rows = Array.isArray(t[2]) ? t[2] : [];
            z(t[1]).textContent = '(' + rows.length + ')';
            ui.table({ el: z(t[0]), rows: rows, columns: COT, empty: 'Không có lịch coi thi' });
        });
    }).catch(function (err) { z('moi').innerHTML = z('cu').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch coi thi'); });
})();
