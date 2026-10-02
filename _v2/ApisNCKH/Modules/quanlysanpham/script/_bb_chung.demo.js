/* Dữ liệu mẫu — bài báo / kỷ yếu / sách của ApisNCKH (quản lý + xác nhận + bản xem 2018). Chỉ dùng ở chế độ dựng thử.
   Danh sách sản phẩm, thành viên, tệp, đề tài: dùng chung dữ liệu mẫu của Cổng cán bộ (sanphamkhoahoc/_sanpham.demo.js). */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten, tt1, tt2) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: tt1 || ten, THONGTIN2: tt2 || '' }; }
    var XN = [dm('XN0', 'XNKKCHUAKHAI', 'Chưa kê khai', 'fa fa-circle-o'), dm('XN1', 'XNKKDONGY', 'Đồng ý', 'fa fa-check-circle', 'color:#198754'),
        dm('XN2', 'XNKKKHONGDONGY', 'Không đồng ý', 'fa fa-times-circle', 'color:#dc3545'), dm('XN3', 'XNKKBOSUNG', 'Yêu cầu bổ sung', 'fa fa-exclamation-circle', 'color:#d97706')];
    var fx = {};
    fx[DM + 'NCKH.XNKK'] = XN;
    fx[DM + 'NCKH.TCQT'] = [dm('TCQT0', 'ISI', 'ISI'), dm('TCQT1', 'SCOPUS', 'Scopus')];
    fx[DM + 'NCKH.TCQG'] = [dm('TCQG0', 'HDCD', 'Hội đồng chức danh'), dm('TCQG1', 'KHAC', 'Khác')];
    fx['NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung'] = XN;
    var LS = { TQ1: [{ ID: 'L1', TINHTRANG_TEN: 'Đồng ý', NOIDUNG: 'Đủ minh chứng', NGUOIXACNHAN_TENDAYDU: 'Trần Thị Mai', NGAYTAO_DD_MM_YYYY: '12/03/2026' }] };
    fx['NCKH_SP_XacNhanKeKhai/LayDanhSach'] = function (o) { return (LS[o.strSanPham_Id] || []).slice(); };
    fx['NCKH_SP_XacNhanKeKhai/ThemMoi'] = function (o) {
        var t = XN.filter(function (x) { return x.ID === o.strTinhTrang_Id; })[0] || {};
        (LS[o.strSanPham_Id] || (LS[o.strSanPham_Id] = [])).push({ ID: 'L' + Date.now(), TINHTRANG_TEN: t.TEN, NOIDUNG: o.strNoiDung,
            NGUOIXACNHAN_TENDAYDU: 'Người dùng thử', NGAYTAO_DD_MM_YYYY: '27/09/2026' });
        return [];
    };
    fx['NCKH_Files/GopFile'] = { rows: [], raw: { Data: 'NCKH/gop_tep_mau.zip' } };
    fx['NS_HoSoV2/LayDanhSach'] = function (o) {
        return o.strDaoTao_CoCauToChuc_Id ? [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001' }, { ID: 'CB2', HOTEN: 'Trần Thị Mai', MASO: 'CB002' }] : [];
    };
    var TVBB = [{ ID: 'TVB1', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', LOAICHUCDANH_MA: 'PGS', LOAIHOCVI_MA: 'TS', VAITRO_TEN: 'Tác giả chính', ANH: '' }];
    fx['NCKH_TapChiQuocTe_ThanhVien/LayDanhSach'] = TVBB;
    fx['NCKH_TapChiQuocGia_ThanhVien/LayDanhSach'] = TVBB;
    ums.demo.add(fx);
})();
