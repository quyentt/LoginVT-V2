/* Dữ liệu mẫu cho tieuchixeploai — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }

    var fx = {};
    fx[DM + 'DRL.DOITUONGAPDUNG'] = [dm('DT1', 'SVCQ', 'Sinh viên chính quy'), dm('DT2', 'SVLT', 'Sinh viên liên thông'),
        dm('DT3', 'HVCH', 'Học viên cao học')];
    fx[DM + 'QLSV.HINHTHUCKYLUAT'] = [dm('KL1', 'KT', 'Khiển trách'), dm('KL2', 'CC', 'Cảnh cáo'),
        dm('KL3', 'DC', 'Đình chỉ học tập có thời hạn')];
    fx[DM + 'DRL.XEPLOAI'] = [dm('XL1', 'XS', 'Xuất sắc'), dm('XL2', 'TOT', 'Tốt'), dm('XL3', 'KHA', 'Khá'),
        dm('XL4', 'TB', 'Trung bình'), dm('XL5', 'YEU', 'Yếu')];
    // Nguồn ô "Tiêu chí" (RL_TieuChiDanhGia/LayDanhSach)
    fx['RL_TieuChiDanhGia/LayDanhSach'] = [
        { ID: 'TC0', TEN: 'Tổng điểm rèn luyện', MUCDIEMQUYDINH: 100 },
        { ID: 'TC1', TEN: 'Ý thức học tập', MUCDIEMQUYDINH: 20 },
        { ID: 'TC2', TEN: 'Chấp hành nội quy, quy chế', MUCDIEMQUYDINH: 25 }
    ];
    ums.demo.add(fx);

    function xl(id, duoi, tren, kl, xlId, quyDoi, ghiChu) {
        var klTen = { KL1: 'Khiển trách', KL2: 'Cảnh cáo', KL3: 'Đình chỉ học tập có thời hạn' };
        var xlTen = { XL1: 'Xuất sắc', XL2: 'Tốt', XL3: 'Khá', XL4: 'Trung bình', XL5: 'Yếu' };
        return { ID: id, DIEMCANDUOI: duoi, DIEMCANTREN: tren, MUCKYLUATCAONHAT_ID: kl, MUCKYLUATCAONHAT_TEN: klTen[kl] || '',
            XEPLOAI_ID: xlId, XEPLOAI_TEN: xlTen[xlId], DIEMQUYDOI: quyDoi, DOITUONGAPDUNG_ID: 'DT1',
            DRL_TIEUCHIDANHGIA_ID: 'TC0', GHICHU: ghiChu || '' };
    }
    var ROWS = [
        xl('XLR1', 90, 100, '', 'XL1', 4),
        xl('XLR2', 80, 89, '', 'XL2', 3.5),
        xl('XLR3', 65, 79, 'KL1', 'XL3', 3, 'Bị khiển trách tối đa xếp loại Khá'),
        xl('XLR4', 50, 64, 'KL2', 'XL4', 2),
        xl('XLR5', 35, 49, 'KL3', 'XL5', 1)
    ];
    ums.demo.crudStore('RL_TieuChuanXepLoai', ROWS, {
        map: function (o) {
            return { DIEMCANDUOI: o.dDiemCanDuoi, DIEMCANTREN: o.dDiemCanTren, MUCKYLUATCAONHAT_ID: o.strMucKyLuatCaoNhat_Id,
                XEPLOAI_ID: o.strXepLoai_Id, DIEMQUYDOI: o.dDiemQuyDoi, DOITUONGAPDUNG_ID: o.strDoiTuongApDung_Id,
                DRL_TIEUCHIDANHGIA_ID: o.strDRL_TieuChiDanhGia_Id, GHICHU: o.strGhiChu };
        },
        list: function (rows, o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return rows.filter(function (r) {
                return (!o.strDoiTuongApDung_Id || r.DOITUONGAPDUNG_ID === o.strDoiTuongApDung_Id) &&
                    (!o.strDRL_TieuChiDanhGia_Id || r.DRL_TIEUCHIDANHGIA_ID === o.strDRL_TieuChiDanhGia_Id) &&
                    (!q || (r.XEPLOAI_TEN + ' ' + r.GHICHU).toLowerCase().indexOf(q) >= 0);
            });
        }
    });
})();
