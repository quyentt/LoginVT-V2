/* Dữ liệu mẫu cho khoiluongcanhan / khoaxemkhoiluongcanhan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    fx['KHCT_ThongTin/LayDSKhoaQuanLyPhanQuyen'] = [{ ID: 'K1', MA: 'CNTT', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'K2', MA: 'KT', TEN: 'Khoa Kinh tế' }];
    fx['NS_ThongTinCanBo/LayDSKeHoachKLGDChiTietCaNhan'] = function (o) {
        return { rs: [{ ID: 'BT1', TEN: 'Bảng tính KLGD 2026_2027_1' }],
            rsThongTin: [{ HODEM: o.strNguoiDung_Id === 'NS2' ? 'Trần Thị' : 'Nguyễn Văn', TEN: o.strNguoiDung_Id === 'NS2' ? 'Mai' : 'Hùng', MASO: 'CB00' + (o.strNguoiDung_Id === 'NS2' ? 2 : 1), DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Kỹ thuật phần mềm' }] };
    };
    var DL = [
        { ID: 'D1', LOAI: 'KLGD_DULIEU_LICHGIANG', KLGD_KEHOACHCHITIET_ID: 'BT1', DAOTAO_HOCPHAN_ID: 'HP1', DULIEUXACNHAN: 'LHP1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', THOIGIAN: '2026_2027_1',
          DONVI_PHUTRACH_HOCPHAN_TEN: 'Bộ môn KTPM', TENLOP: 'IT3100.01', TONGPHANBO: '3/2/1', PHANLOAI_TEN: 'Giảng dạy', QUYMO: 60, VAITRO_TEN: 'Giảng viên chính', SOLUONG: 45, SOGIOCHUAN: 52.5, TINHTRANGXACNHAN_TEN: 'Đã xác nhận', GHICHU: 'Lịch giảng' },
        { ID: 'D2', LOAI: 'KLGD_DULIEU_DOANKHOALUAN', KLGD_KEHOACHCHITIET_ID: 'BT1', DAOTAO_HOCPHAN_ID: 'HP9', DULIEUXACNHAN: '', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', THOIGIAN: '2026_2027_1',
          DONVI_PHUTRACH_HOCPHAN_TEN: 'Bộ môn KTPM', TENLOP: 'Đồ án tốt nghiệp', TONGPHANBO: '10', PHANLOAI_TEN: 'Hướng dẫn', QUYMO: 5, VAITRO_TEN: 'Hướng dẫn', SOLUONG: 5, SOGIOCHUAN: 75, TINHTRANGXACNHAN_TEN: 'Chờ xác nhận', GHICHU: 'Đồ án' }
    ];
    fx['TKGG_KeHoach/LayDSDuLieuKLCaNhan'] = function (o) { return o.strKLGD_KeHoachChitiet_Id ? DL : []; };
    fx['PKG_KLGV_V2_KEHOACH.LayDSDuLieuKLCaNhanTongHop'] = DL.concat([{ ID: 'D3', LOAI: 'KLGD_DULIEU_HOIDONG', TENLOP: 'Hội đồng chấm', QUYMO: 0, SOLUONG: 1, SOGIOCHUAN: 4, GHICHU: 'Hội đồng' }]);
    fx['TKGG_ThongTin/LayDSDuLieu_ChiTiet'] = function (o) {
        return { rs: [{ ID: 'C1', NGAY: '02/09/2026', TIETBATDAU: 1, TIETKETTHUC: 3, SOLUONG: 3, QUYMO: 60, DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_LOPHOCPHAN_TEN: 'IT3100.01', GIOCHUAN: 3.5, SOTINCHIHOCPHAN: 3 },
                     { ID: 'C2', NGAY: '04/09/2026', TIETBATDAU: 7, TIETKETTHUC: 9, SOLUONG: 3, QUYMO: 60, DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_LOPHOCPHAN_TEN: 'IT3100.01', GIOCHUAN: 3.5, SOTINCHIHOCPHAN: 3 }],
                 rsThanhPhanCongThuc: [{ ID: 'T1', TUKHOA: 'HESOLOP', TENTUKHOA: 'Hệ số lớp', XAUCONGTHUC: 'Số tiết × Hệ số lớp × Hệ số giờ' }, { ID: 'T2', TUKHOA: 'HESOGIO', TENTUKHOA: 'Hệ số giờ', XAUCONGTHUC: '' }] };
    };
    fx['TKGG_ThongTin/LayGiaTriTuKhoa'] = function (o) { return o.strTuKhoa === 'HESOLOP' ? [{ GIATRITUKHOA: 1.1 }] : o.strKLGD_DuLieu_Loai_Id === 'C2' ? [] : [{ GIATRITUKHOA: 1.05 }]; };
    /* Hộp "Duyệt buổi học" */
    fx['TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP'] = [{ ID: 'GV1', NGUOIDUNG_HODEM: 'Nguyễn Văn', NGUOIDUNG_TEN: 'Hùng', NGUOIDUNG_MASO: 'CB001' }];
    fx['TKGG_KeHoach/LayDSDuLieuLichGiangDuyet'] = [1, 2, 3].map(function (i) {
        return { ID: 'B' + i, MALOP: 'IT3100.01', TENLOP: 'Lập trình HĐT 01', NGAY: '0' + (i + 1) + '/09/2026', THU: i + 2, SOTIET: 3, TIETBATDAU: 1, TIETKETTHUC: 3, DAOTAO_LOPHOCPHAN_ID: 'LHP1', KLGD_KEHOACHCHITIET_ID: 'BT1' };
    });
    fx['TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG'] = function (o) { return [{ COLICH: '1', XACNHANDONGY_KHONGDONGY: o.strKLGD_DuLieu_LichGiang_Id === 'B3' ? '' : '1', TINHTRANGDIEMDANH: '1' }]; };
    ums.demo.add(fx);
})();
