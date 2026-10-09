/* =========================================================================
   ApisNhanSu / baocao — phần dùng chung của hai báo cáo nhân lực (ums.nsBaoCao)
   Cả hai tệp gốc (chatluongnhanluc.js, tongquannhanluc.js) gọi cùng một lời gọi với cùng bộ 32 tham số:
       NS_HoSo/LayDanhSach  GET  (kiểu cũ, không func / iM)
   rồi TỰ ĐẾM trên máy khách. Ở đây giữ nguyên bộ tham số đó (tên khoá chép nguyên, giá trị mặc định chép nguyên):
       ums.nsBaoCao.goi({ pageSize, strChung_DonVi_Id, strLoaiCanBo_Id }) → Promise<dòng>
   ========================================================================= */
(function () {
    'use strict';
    var B = ums.nsBaoCao = ums.nsBaoCao || {};
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    B.goi = function (o) {
        o = o || {};
        return ums.api.call({
            action: 'NS_HoSo/LayDanhSach', method: 'GET',
            strTuKhoa: '', pageIndex: 1, pageSize: o.pageSize || 1000, iTrangThai: 1,
            strChung_DonVi_Id: e(o.strChung_DonVi_Id), strNhanSu_Id: '', strHocVi_Id: '', strChucDanh_Id: '',
            strLoaiCanBo_Id: e(o.strLoaiCanBo_Id), strGioiTinh_Id: '', strDanToc_Id: '', strTonGiao_Id: '',
            strTinhTrangHonNhan_Id: '', strChucVu_Id: '', strTrinhDoChuyenMonCN_Id: '',
            iDoTuoiBatDau: 0, iDoTuoiKetThuc: 1000, strLoaiDoiTuong_Id: '', iTimKiemLaDangVien: -1,
            strNoiSinh_TinhThanh_Id: '', strQueQuan_TinhThanh_Id: '', strGiaDinhThuocDienUuTien_Id: '',
            strCoQuanTiepNhanLamViec: '', strTrinhDoLyLuanChinhTri_Id: '', strTrinhDoQuanLyNhaNuoc_Id: '',
            strTrinhDoTinHoc_Id: '', strTrinhDoNgoaiNgu_Id: '', strDanhHieuDuocCaoNhat_Id: '', strNgachCongChuc_Id: '',
            strLoaiCoCauToChuc_Id: '', strThoiGian_Id: '', iTinhTrang: 1
        }).then(function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; });
    };
    /* Khối "Ghi chú" đầu trang của cả hai báo cáo gốc */
    B.ghiChu = function (dong) {
        return ums.pat.panel({ title: 'Ghi chú', icon: 'fa-circle-info', cls: 'ums-u-mb-4',
            body: '<ul class="nsbc-ghichu">' + dong.map(function (x) { return '<li>' + ums.ui.esc(x) + '</li>'; }).join('') + '</ul>' });
    };
})();
