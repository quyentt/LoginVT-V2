/* =========================================================================
   Danh mục tên tạp chí quốc tế / quốc gia (NCKH) — khung chung ums.nckhTapChi.man(root, cfg)
   Bản gốc: ApisNCKH/Modules/danhmuc/{html,script}/tentapchiquocte.* và tentapchiquocgia.* — hai tệp chép nhau từng dòng,
   chỉ khác controller (NCKH_DMTapChiQuocTe ↔ NCKH_DMTapChiQuocGia) và bản quốc tế gửi thêm strTenTapChiDang_Id.
   ---------------------------------------------------------------------------
   Bố cục gốc (HAI cột col-lg-3 | col-lg-9): trái ô "Chọn thời gian" + ô từ khoá, "Danh sách" (tổng; mỗi mục
   "TÊN (MÃ)" + thùng rác); phải "Thông tin" (Thêm mới) đổi chỗ cho biểu mẫu "Thêm mới - Danh mục tạp chí …".
   Bản mới: ums.crud hai cột (master).
   Lời gọi (chép nguyên):
     <ctl>/LayDanhSach  GET  strTuKhoa, strTenTapChiDang_Id '', strLoaiTapChi_Id '', strCoQuanXuatBan_Id '',
                             strNguoiThucHien_Id '' (gốc gửi rỗng), pageIndex, pageSize
     <ctl>/ThemMoi | CapNhat (có strId → CapNhat)  POST  strId, [strTenTapChiDang_Id '' — chỉ bản quốc tế], strThoiGianApDung,
                             dDiem, strLoaiTapChi_Id, strChiSo_ISSN, strDaiDiem, strCoQuanXuatBan_Id, strGhiChu,
                             strMaTapChiDang, strTenTapChiDang (strNguoiThucHien_Id, strChucNang_Id do api.js chèn)
     <ctl>/Xoa  POST  strIds
   Danh mục: NCKH.LTQG (loại tạp chí — cả hai bản gốc dùng chung), NCKH.CQXB (cơ quan xuất bản).
   Khác gốc (tự chốt):
     · Ô "Chọn thời gian" ở cột trái gốc không nơi nào nạp dữ liệu và không gửi đi → bỏ.
     · Thùng rác trên từng mục cột trái → nút "Xoá" trên đầu biểu mẫu (BO-CUC luật 12: mục danh sách không mang nút).
     · Gốc quốc tế gửi strTenTapChiDang_Id đọc từ ô "dropDMTCQT_DanhMucTenTCQG" KHÔNG có trên màn → luôn rỗng; giữ rỗng.
     · Bản quốc gia: khung "Chi tiết" (toggle_detail) và hàm update_DMTCQG không nơi nào gọi → bỏ; danh mục NCKH.DTQG
       nạp vào ô không tồn tại → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var esc = ums.ui.esc;
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    var T = ums.nckhTapChi = ums.nckhTapChi || {};
    var GUI = ['strThoiGianApDung', 'dDiem', 'strLoaiTapChi_Id', 'strChiSo_ISSN', 'strDaiDiem', 'strCoQuanXuatBan_Id', 'strGhiChu',
        'strMaTapChiDang', 'strTenTapChiDang'];

    T.man = function (root, cfg) {
        var CTL = cfg.ctl;
        var LOAI = { dm: 'NCKH.LTQG' }, CQXB = { dm: 'NCKH.CQXB' };
        return ums.crud({
            root: root,
            title: cfg.tieuDe,
            formTitle: cfg.formTitle,
            icon: 'fa-newspaper',
            master: {
                title: 'Danh sách', icon: 'fa-list-ul',
                empty: 'Hôm nay có thêm danh mục tạp chí mới nào không? Bấm Thêm mới ở đầu trang.',
                item: function (r) {
                    return '<b>' + esc(e(r.TENTAPCHIDANG)) + '</b>' + (e(r.MATAPCHIDANG) ? ' <span class="ums-u-faint">(' + esc(e(r.MATAPCHIDANG)) + ')</span>' : '');
                }
            },
            filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
            list: {
                paged: true,
                call: function (f) {
                    return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strTenTapChiDang_Id: '', strLoaiTapChi_Id: '',
                        strCoQuanXuatBan_Id: '', strNguoiThucHien_Id: '' };
                }
            },
            fields: [
                { key: 'strMaTapChiDang', col: 'MATAPCHIDANG', label: 'Mã tạp chí đăng' },
                { key: 'strTenTapChiDang', col: 'TENTAPCHIDANG', label: 'Tên tạp chí đăng' },
                { key: 'strLoaiTapChi_Id', col: 'LOAITAPCHI_ID', label: 'Loại tạp chí', type: 'select', source: LOAI, placeholder: 'Chọn loại tạp chí' },
                { key: 'strChiSo_ISSN', col: 'CHISO_ISSN', label: 'Chỉ số ISSN' },
                { key: 'strCoQuanXuatBan_Id', col: 'COQUANXUATBAN_ID', label: 'Cơ quan xuất bản', type: 'select', source: CQXB, placeholder: 'Chọn cơ quan xuất bản' },
                { key: 'strDaiDiem', col: 'DAIDIEM', label: 'Dải điểm' },
                { key: 'dDiem', col: 'DIEM', label: 'Điểm áp dụng' },
                { key: 'strThoiGianApDung', col: 'THOIGIANAPDUNG', label: 'Thời gian áp dụng', type: 'date' },
                { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', span: true }
            ],
            save: function (v, row) {
                var p = { action: CTL + (row ? '/CapNhat' : '/ThemMoi'), method: 'POST', strId: row ? row.ID : '' };
                if (cfg.guiTenId) p.strTenTapChiDang_Id = '';
                GUI.forEach(function (k) { p[k] = v[k]; });
                return p;
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: CTL + '/Xoa', method: 'POST', strIds: id }; });
            }
        });
    };
})();
