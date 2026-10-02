/* =========================================================================
   Khoa duyệt đổi lịch
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/lichgiangkhoa.html + script/lichgiangkhoa.js
   Khung chung: _xulydoilich.js (ums.lg.xuLyDoiLich). Lời gọi (kiểu cũ, GET trừ khi ghi):
       KHCT_LichGiang_DoiLich/LayDSHocPhanMucKhoaQuanLy        ô Học phần (theo Học kỳ)
       KHCT_LichGiang_DoiLich/LayDSNguoiGuiKhoaQuanLy          ô Người gửi (theo Học kỳ — không theo Học phần, như gốc)
       KHCT_LichGiang_DoiLich/LayDSLichGiang_Doi_PhamVi_PC     danh sách (phân trang ở máy chủ)
       KHCT_LichGiang_DoiLich/LayDSTinhTrangCapDo              trạng thái trong hai hộp phê duyệt
       KHCT_LichGiang_DoiLich/LayDSLichGiang_CapDoThongQua     lịch sử
       KHCT_LichGiang_DoiLich/Them_LichGiang_CapDoThongQua (POST)   phê duyệt
   Khoá sản phẩm = ID yêu cầu + ID chức năng (ghép liền, như gốc) — mỗi cấp duyệt
   một bản ghi riêng. Không gửi email (như gốc).
   Nối tầng: Học kỳ → Học phần; Học kỳ → Người gửi (ums.pat.chain).
   Giữ như bản gốc: nút "Xóa" trong hộp xem yêu cầu hiện nhưng không có xử lý → khoá lại.
   Không có vùng báo cáo (html gốc không có). Ô "Khoa quản lý" bị chú thích ở html gốc → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var lg = ums.lg, C = lg.C;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    lg.xuLyDoiLich(document.getElementById('lg-lichgiangkhoa'), {
        tieuDe: 'Khoa duyệt đổi lịch', tenBang: 'Danh sách', coKhoa: false, nguoiGuiTheoHP: false,
        chuoi: function (f) { return [[f('hk'), f('hp')], [f('hk'), f('ng')]]; },
        dsHocPhan: function (v) { return lg.get('LayDSHocPhanMucKhoaQuanLy', { strDaoTao_ThoiGianDaoTao_Id: v('hk') }).then(function (r) { return arr(r.data); }); },
        nguoiGuiSan: function (v) { return v('hk'); },
        dsNguoiGui: function (v) { return lg.get('LayDSNguoiGuiKhoaQuanLy', { strDaoTao_ThoiGianDaoTao_Id: v('hk') }).then(function (r) { return arr(r.data); }); },
        ds: function (v, t) {
            return lg.get('LayDSLichGiang_Doi_PhamVi_PC', { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('hk'), strNgayGuiYeuCau_TuNgay: v('tu'), strNgayGuiYeuCau_DenNgay: v('den'),
                strDaoTao_HocPhan_Id: v('hp'), strNguoiGuiYeuCau_Id: v('ng'), strTrangThaiDuyet_Id: v('tt'), strTrangThaiXuLy_Id: v('kq'), strChucNang_Id: cn(),
                pageIndex: t.index, pageSize: t.size });
        },
        trangThai: function () { return lg.get('LayDSTinhTrangCapDo', { strChucNang_Id: cn() }).then(function (r) { return arr(r.data); }); },
        lichSu: function (id) { return lg.get('LayDSLichGiang_CapDoThongQua', { strsanpham_Id: id + cn(), strTuKhoa: '', strTinhTrang_Id: '', pageIndex: 1, pageSize: 100000 }); },
        luu: function (id, tt) {
            return ums.api.call({ action: C + 'Them_LichGiang_CapDoThongQua', method: 'POST', strSanPham_Id: id + cn(), strNguoiXacnhan_Id: uid(), strNoiDung: '', strTinhTrang_Id: tt });
        },
        nutXem: ['xoa', 'duyet']
    });
})();
