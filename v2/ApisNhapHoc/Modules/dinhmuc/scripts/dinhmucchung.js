/* =========================================================================
   Định mức chung
   Bản gốc: ApisNhapHoc/Modules/dinhmuc/html/dinhmucchung.html + scripts/dinhmucchung.js
   Khung chung: dinhmuc/scripts/_chung.js (ums.nhDm) — lời gọi, khác gốc chung ghi ở đó.
   ---------------------------------------------------------------------------
   Riêng màn này:
     · Lưu thêm dThuTu (= ô Thứ tự, như iThuTu) và dTuDongCanDoiSangPhaiNop (ô dropCanDoi_DMC:
       0 Không cân đối / 1 Cân đối sang đúng bằng khoản nộp / 2 Cân đối theo định mức thu).
     · Cột "Khoản riêng" — "Chi tiết": gốc là thẻ nổi khi rê chuột (loadToPopover_data) liệt kê
       định mức riêng của cùng kế hoạch + khoản thu:
         NH_DinhMuc_Rieng/LayDanhSach  GET  strTAICHINH_CacKhoanThu_Id = TAICHINH_CACKHOANTHU_ID dòng,
         strTAICHINH_KeHoach_Id = TAICHINH_KEHOACHNHAPHOC_ID dòng, strApDungMienGiam_Id "",
         strDAOTAO_ToChucCCCT_Id "", strDoiTuongDaoTao_Id "", strNguoiThucHien_Id "", strTuKhoa ""
       Bản mới: bấm mở HỘP THOẠI (luật chung: nút "Chi tiết" mở hộp thoại). Hộp lấy mọi dòng
       (pageSize 1000000 — gốc chỉ lấy trang đầu pageSize_default = 10 dòng mà không báo).
       Cột thứ hai gốc ghi nhầm tiêu đề "Loại khoản" trong khi đổ DOITUONGDAOTAO_TEN → "Đối tượng".
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('dinhmucchung');
    if (!root) return;
    var ums = window.ums, ui = ums.ui, D = ums.nhDm, N = ums.nhKH, e = N.e;
    var crud = null;

    crud = D.man(root, {
        title: 'Định mức chung',
        formTitle: 'định mức chung',
        icon: 'fa-sliders',
        cotTien: [
            { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN || 0); } },
            { title: 'Khoản riêng', cls: 'is-center', width: '120px', render: function (r, i) {
                return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-dmc-ct': i } });
            } }
        ],
        fields: [
            { key: 'dTuDongCanDoiSangPhaiNop', col: 'TUDONGCANDOISANGPHAINOP', label: 'Cân đối khoản phải nộp', type: 'select',
              placeholder: '-- Chọn cân đối khoản phải nộp --', source: { items: [
                  { ID: '0', TEN: 'Không cân đối' },
                  { ID: '1', TEN: 'Cân đối sang đúng bằng khoản nộp' },
                  { ID: '2', TEN: 'Cân đối theo định mức thu' }
              ] } }
        ],
        luu: function (v) {
            return {
                strMoTa: v.strMoTa,
                iThuTu: D.so(v.iThuTu),
                dThuTu: D.so(v.iThuTu),
                dThuocTinhTuyChon: v.dThuocTinhTuyChon,
                dTuDongCanDoiSangPhaiNop: v.dTuDongCanDoiSangPhaiNop
            };
        }
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-dmc-ct]');
        if (!b || !crud) return;
        var r = crud.rows[Number(b.getAttribute('data-dmc-ct'))];
        if (r) khoanRieng(r);
    });

    /** Hộp "Danh sách khoản riêng" (popover_DinhMucRieng_DMC gốc) */
    function khoanRieng(r) {
        var dlg = ui.dialog({
            title: 'Danh sách khoản riêng — ' + e(r.TAICHINH_CACKHOANTHU_TEN), icon: 'fa-circle-info', size: 'lg',
            body: '<div data-dmc="tbl">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var host = dlg.body.querySelector('[data-dmc="tbl"]');
        ums.api.call({
            action: 'NH_DinhMuc_Rieng/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            pageIndex: 1, pageSize: 1000000,
            strTAICHINH_CacKhoanThu_Id: r.TAICHINH_CACKHOANTHU_ID,
            strTAICHINH_KeHoach_Id: r.TAICHINH_KEHOACHNHAPHOC_ID,
            strApDungMienGiam_Id: '',
            strDAOTAO_ToChucCCCT_Id: '',
            strDoiTuongDaoTao_Id: '',
            strNguoiThucHien_Id: '',
            strTuKhoa: '',
            silent: true
        }).then(function (res) {
            ui.table({
                el: host, rows: N.ds(res), empty: 'Chưa có khoản riêng',
                columns: [
                    { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                    { title: 'Đối tượng', prop: 'DOITUONGDAOTAO_TEN' },
                    { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.SOTIEN || 0); } }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'khoản riêng'); });
    }
})();
