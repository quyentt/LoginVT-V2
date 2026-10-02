/* Dữ liệu mẫu cho dinuocngoai — chỉ dùng ở chế độ dựng thử. NS.QUDI, NS_Files có sẵn. */
(function () {
    ums.demo.crudStore('NS_QT_CongTacNuocNgoai', [
        { ID: 'DNN1', TUNAM: '10/06/2024', DENNAM: '20/06/2024', TENNUOC: 'Nhật Bản', MUCDICH: 'Dự hội thảo khoa học', TENTOCHUCSANGLAMVIEC: 'Đại học Tokyo', KETQUADATDUOC: 'Báo cáo tham luận' }
    ], { map: function (o) { return { TUNAM: o.strTuNam, DENNAM: o.strDenNam, TENNUOC: o.strTenNuoc, MUCDICH: o.strMucDich,
        TENTOCHUCSANGLAMVIEC: o.strTenToChucSangLamViec, KETQUADATDUOC: o.strKetQuaDatDuoc }; } });
    ums.demo.crudStore('NS_ThongTinQuyetDinh', [
        { ID: 'QDN1', NGUONDULIEU_ID: 'DNN1', LOAIQUYETDINH_ID: 'QD1', SOQUYETDINH: '512/QĐ-ĐHHN', NGAYQUYETDINH: '01/06/2024', NGAYHIEULUC: '10/06/2024', NGAYHETHIEULUC: '20/06/2024', THONGTINQUYETDINH: 'Cử đi công tác' }
    ], { list: function (rows, o) { return rows.filter(function (r) { return r.NGUONDULIEU_ID === o.strNguonDuLieu_Id; }); },
         map: function (o) { return { NGUONDULIEU_ID: o.strNguonDuLieu_Id, LOAIQUYETDINH_ID: o.strLoaiQuyetDinh_Id, SOQUYETDINH: o.strSoQuyetDinh,
            NGAYQUYETDINH: o.strNgayQuyetDinh, NGAYAPDUNG: o.strNgayApDung, NGAYHIEULUC: o.strNgayHieuLuc, NGAYHETHIEULUC: o.strNgayHetHieuLuc, THONGTINQUYETDINH: o.strThongTinQuyetDinh }; } });
})();
