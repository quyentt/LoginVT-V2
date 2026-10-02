/* =========================================================================
   Đăng ký định hướng (Cổng sinh viên)
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/dinhhuong.html + script/dinhhuong.js
   ---------------------------------------------------------------------------
   Người học = ums.session.userId (vai trò thủ vai: vỏ đã chọn người học trước).
   Lời gọi (chép nguyên action / func / tham số):
       pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc → ô Chương trình (chọn sẵn mục đầu)
       pkg_kehoach_thongtin.LayDSDinhHuongCaNhan   → Data.{ rsDSChung (định hướng của CT), rsKetQuaCaNhan (của bạn) }
       pkg_kehoach_thongtin.Them_DaoTao_CT_DinhHuong_NH   định hướng được chọn (radio)
       pkg_kehoach_thongtin.Xoa_DaoTao_CT_DinhHuong_NH    "Hủy đăng ký" — mỗi dòng đánh dấu một lời gọi (strIds = một id, như gốc)
   Bố cục giữ nguyên: MỘT cột — ô Chương trình + "Xem định hướng", bảng định hướng
   của chương trình + Đăng ký, bảng định hướng của bạn + Hủy đăng ký.
   Khung chung: script/_dangkyds.js (ums.dkhDs) — dùng chung với nganh2.
   Giữ như gốc: mở màn CHỈ nạp ô Chương trình; danh sách nạp khi bấm "Xem định
   hướng" hoặc chọn chương trình. Ba tham số strSoQuyetDinh / strNgayQuyetDinh /
   strMoTa bản gốc đọc ô 'txtAAAA' không tồn tại → gửi rỗng (đúng giá trị gốc gửi).
   Bỏ: getList_DaDangKy (pkg_hososinhvien_vethang.LayDSQLSV_KeHoach_Ve_DangKy — mã
   chép từ màn vé tháng, không nơi nào gọi).
   ========================================================================= */
(function () {
    'use strict';
    var pat = ums.pat;
    var K = 'KHCT_ThongTin_MH/', P = 'pkg_kehoach_thongtin.';
    var root = document.getElementById('dkh-dinhhuong');
    var svId = (ums.session && ums.session.userId) || '';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var ds = ums.dkhDs(root, {
        title: 'Đăng ký định hướng',
        filters: [{ key: 'ct', label: 'Chọn chương trình' }],
        xem: { text: 'Xem định hướng', icon: 'fa-table' },
        radio: 'tblChuaDangKy1',
        mo: { title: 'Danh sách định hướng của chương trình', icon: 'fa-signs-post', empty: 'Chưa có định hướng',
            columns: [
                { title: 'Tên định hướng', prop: 'TEN' },
                { title: 'Thời gian mở đăng ký', cls: 'is-center', render: function (r) { return ums.ui.esc(e(r.NGAYBATDAU) + ' -> ' + e(r.NGAYKETTHUC)); } },
                { title: 'Chế độ đăng ký', prop: 'CHEDODANGKYDINHHUONG_TEN', cls: 'is-center' }
            ] },
        da: { title: 'Danh sách định hướng của bạn', icon: 'fa-clipboard-check', empty: 'Bạn chưa đăng ký định hướng',
            columns: [
                { title: 'Tên định hướng', prop: 'DAOTAO_CT_DINHHUONG_TEN' },
                { title: 'Ngày đăng ký', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }
            ] },
        tai: function (f) {
            return ums.api.call({ action: K + 'DSA4BRIFKC8pCTQuLyYCIA8pIC8P', func: P + 'LayDSDinhHuongCaNhan',
                strQLSV_NguoiHoc_Id: svId, strDaoTao_ChuongTrinh_Id: f('ct').value })
                .then(function (r) { var d = r.data || {}; return { mo: d.rsDSChung, da: d.rsKetQuaCaNhan }; });
        },
        chuaChon: 'Vui lòng chọn định hướng?',
        dangKy: function (r) {
            return { action: K + 'FSkkLB4FIC4VIC4eAhUeBSgvKQk0Li8mHg8J', func: P + 'Them_DaoTao_CT_DinhHuong_NH',
                strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strDaoTao_CT_DinhHuong_Id: r.ID,
                strQLSV_NguoiHoc_Id: svId, strSoQuyetDinh: '', strNgayQuyetDinh: '', strMoTa: '', strNguoiThucHien_Id: uid() };
        },
        dangKyOk: 'Thêm mới thành công!',
        huy: function (r) {
            return { action: K + 'GS4gHgUgLhUgLh4CFR4FKC8pCTQuLyYeDwkP', func: P + 'Xoa_DaoTao_CT_DinhHuong_NH',
                strIds: r.ID, strNguoiThucHien_Id: uid() };
        },
        huyOk: 'Xóa thành công!'
    });
    var fCt = ds.f('ct');

    if (window.jQuery) {
        jQuery(fCt).on('select2:select', function () { ds.tai(); });
        jQuery(fCt).on('select2:clear', function () { ds.xoa(); });
    }

    ums.api.call({ action: 'SV_ThongTin_MH/DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP', func: 'pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc',
        strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strQLSV_NguoiHoc_Id: svId, strNguoiThucHien_Id: uid() })
        .then(function (r) {
            var d = arr(r.data);
            pat.fill(fCt, d, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN' });
            ds.chonDau(fCt, d, 'DAOTAO_TOCHUCCHUONGTRINH_ID');
        }).catch(function (err) { ums.api.handle(err, 'chương trình'); });
})();
