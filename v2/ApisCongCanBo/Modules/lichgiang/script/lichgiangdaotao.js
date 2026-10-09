/* =========================================================================
   Đào tạo xử lý đổi lịch
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/lichgiangdaotao.html + script/lichgiangdaotao.js
   Khung chung: _xulydoilich.js (ums.lg.xuLyDoiLich). Lời gọi (kiểu cũ, GET trừ khi ghi):
       KHCT_LichGiang_DoiLich/LayDSKhoaQuanLyChuyenMon         ô Khoa quản lý (theo Học kỳ)
       KHCT_LichGiang_DoiLich/LayDSHocPhanDuyetKhoaQuanLy      ô Học phần (Học kỳ, Khoa)
       KHCT_LichGiang_DoiLich/LayDSNguoiGuiDuyetKhoaQuanLy     ô Người gửi (Học kỳ, Khoa, Học phần)
       KHCT_LichGiang_DoiLich/LayDSLichGiang_Doi_PhamVi_XL     danh sách (phân trang ở máy chủ)
       KHCT_LichGiang_DoiLich/LayDSTKB_XacNhanDoiLich          lịch sử (strsanpham_Id — chữ s thường, như gốc)
       KHCT_LichGiang_DoiLich/Them_TKB_XacNhanDoiLich (POST)   phê duyệt; trạng thái = danh mục TKB.LICHGIANG.XACNHANDOILICH
       CMS_TienIch/ThucHienGuiEmailTheoCauTruc                 gửi email PDT_XACNHAN_THAYDOILICHGV sau mỗi lần duyệt thành công
   Nối tầng: Học kỳ → Khoa quản lý → Học phần → Người gửi (ums.pat.chain).
   Không chép: bản gốc đổi Học phần không nạp lại Người gửi dù Người gửi lọc theo
   Học phần — ở đây có nạp lại.
   ========================================================================= */
(function () {
    'use strict';
    var lg = ums.lg, C = lg.C;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function loc(v) {
        return { strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: v('khoa'), strDaoTao_ThoiGianDaoTao_Id: v('hk'), strNgayGuiYeuCau_TuNgay: v('tu'), strNgayGuiYeuCau_DenNgay: v('den'),
            strDaoTao_HocPhan_Id: v('hp'), strNguoiGuiYeuCau_Id: v('ng'), strTrangThaiDuyet_Id: v('tt'), strTrangThaiXuLy_Id: v('kq') };
    }
    lg.xuLyDoiLich(document.getElementById('lg-lichgiangdaotao'), {
        tieuDe: 'Đào tạo xử lý đổi lịch', tenBang: 'Danh sách đào tạo xử lý đổi lịch', coKhoa: true, nguoiGuiTheoHP: true,
        chuoi: function (f) { return [[f('hk'), f('khoa'), f('hp'), f('ng')]]; },
        dsHocPhan: function (v) {
            return lg.get('LayDSHocPhanDuyetKhoaQuanLy', { strDaoTao_ThoiGianDaoTao_Id: v('hk'), strDaoTao_KhoaQuanLy_Id: v('khoa') }).then(function (r) { return arr(r.data); });
        },
        nguoiGuiSan: function (v) { return v('hk') && v('khoa') && v('hp'); },
        dsNguoiGui: function (v) {
            return lg.get('LayDSNguoiGuiDuyetKhoaQuanLy', { strDaoTao_ThoiGianDaoTao_Id: v('hk'), strDaoTao_KhoaQuanLy_Id: v('khoa'), strDaoTao_HocPhan_Id: v('hp') })
                .then(function (r) { return arr(r.data); });
        },
        ds: function (v, t) { return lg.get('LayDSLichGiang_Doi_PhamVi_XL', Object.assign(loc(v), { pageIndex: t.index, pageSize: t.size })); },
        trangThai: function () { return ums.api.dm('TKB.LICHGIANG.XACNHANDOILICH'); },
        lichSu: function (id) { return lg.get('LayDSTKB_XacNhanDoiLich', { strTuKhoa: '', strsanpham_Id: id, strTinhTrang_Id: '', pageIndex: 1, pageSize: 100000 }); },
        luu: function (id, tt) {
            return ums.api.call({ action: C + 'Them_TKB_XacNhanDoiLich', method: 'POST', strSanPham_Id: id, strNguoiXacnhan_Id: uid(), strNoiDung: '', strTinhTrang_Id: tt });
        },
        sauLuu: function (id) {
            ums.api.call({ action: 'CMS_TienIch/ThucHienGuiEmailTheoCauTruc', method: 'GET', silent: true, strCauTrucGuiEmailId: 'PDT_XACNHAN_THAYDOILICHGV',
                strDuLieuId: id, strNguoiTao_Id: uid() }).catch(function () {});
        },
        nutXem: ['duyet'],
        baoCao: function (add, v) { var o = loc(v); Object.keys(o).forEach(function (k) { add(k, o[k]); }); add('strNguoiThucHien_Id', uid()); }
    });
})();
