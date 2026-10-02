/* Dữ liệu mẫu chung cho hai màn nhập điểm Thi phách (khung _tp_nd.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'TP_Chung/', fx = {};
    fx[C + 'LayThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    fx[C + 'LayLoaiDiem'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi cuối kỳ' }, { ID: 'LD2', TEN: 'Điểm giữa kỳ' }] : []; };
    fx[C + 'LayHinhThucThi'] = function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }, { ID: 'HT2', TEN: 'Vấn đáp' }] : []; };
    fx[C + 'LayDotThi'] = function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DOT1', TEN: 'Đợt 1 HK1' }, { ID: 'DOT2', TEN: 'Đợt 2 HK1' }] : []; };
    fx[C + 'LayHocPhan'] = function (o) {
        if (!o.strDotThi_Id) return [];
        var d = [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', MA: 'IT3100', K: 'KCNTT' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3090', K: 'KCNTT' },
            { ID: 'HP3', TEN: 'Kinh tế vi mô', MA: 'EC1010', K: 'KKT' }];
        return o.strDaoTao_CoCauToChuc_Id ? d.filter(function (x) { return x.K === o.strDaoTao_CoCauToChuc_Id; }) : d;
    };
    fx['pkg_nhansu_hoso_v2.LayDanhSachToanBo'] = [{ ID: 'KCNTT', TEN: 'Khoa Công nghệ thông tin', MA: 'CNTT' }, { ID: 'KKT', TEN: 'Khoa Kinh tế', MA: 'KT' }];

    /* Xác nhận kiểu nút + lịch sử (nhớ trong phiên) */
    var HD = [{ ID: 'HDX1', TEN: 'Hoàn thành', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: green' },
        { ID: 'HDX2', TEN: 'Huỷ hoàn thành', THONGTIN1: 'fa fa-undo', THONGTIN2: 'color: #e8590c' }];
    var LS = [];
    fx['D_HanhDongXacNhan/LayDanhSach'] = HD;
    fx['D_XacNhan/LayDSDiem_XacNhan'] = function (o) { return LS.filter(function (x) { return x.id === o.strDuLieuXacNhan && x.loai === o.strLoaiXacNhan_Id; }); };
    fx['D_XacNhan/Them_Diem_XacNhan'] = function (o) {
        var h = HD.filter(function (x) { return x.ID === o.strHanhDong_Id; })[0] || {};
        LS.unshift({ id: o.strDuLieuXacNhan, loai: o.strLoaiXacNhan_Id, TEN: h.TEN, NGUOIXACNHAN_TENDAYDU: 'Nguyễn Thị Khảo Thí', NGAYTAO_DD_MM_YYYY: '28/09/2026' });
        if (ums.demo.tpNdXacNhan) ums.demo.tpNdXacNhan(o);
        return [];
    };

    /* Ngày nhận bài · cán bộ đã phân công */
    ums.demo.tpNdNgay = ums.demo.tpNdNgay || {};
    fx['pkg_thi_phancong.CapNhat_ThoiGianNhanBai'] = function (o) { ums.demo.tpNdNgay[o.strThi_GV_ChamThi_Id] = o.strNgayNhanBai; return []; };
    fx['pkg_thi_phancong.LayDSNhanSuPhanCongCoiThi'] = function (o) {
        return /1$/.test(String(o.strDuLieuPhanCongCoiThi_Id)) ? [{ ID: 'PC1', HODEM: 'Trần Văn', TEN: 'Hùng', MASO: 'CB0142' }, { ID: 'PC2', HODEM: 'Lê Thị', TEN: 'Mai', MASO: 'CB0217' }] : [];
    };
    ums.demo.add(fx);
})();
