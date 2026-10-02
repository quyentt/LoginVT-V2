/* Dữ liệu mẫu cho dgplnguoilaodong/phieudanhgiacanbo — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'CCB.VTSK'] = [{ ID: 'VT1', MA: 'CN', TEN: 'Chủ nhiệm' }, { ID: 'VT2', MA: 'TV', TEN: 'Thành viên' }];
    fx['NS_PLDG_NLD_KeHoach/LayDanhSach'] = [{ ID: 'KHDG1', TENKEHOACH: 'Đánh giá, phân loại năm học 2025–2026' }, { ID: 'KHDG2', TENKEHOACH: 'Đánh giá, phân loại năm học 2024–2025' }];
    var CT = { ID: 'CT1', SOGIOCHUAN: 280, SOGIOMIENGIAM: 30, SOGIODINHMUCGIANGDAYNCKH: 250, SOGIONCKHCHUAN: 150, SOGIODH: 310, SOGIOSDH: 45,
        DIEMVIETSACH: 20, DIEMDETAI: 35, DIEMBAIBAOTRONGNUOC: 15, DIEMBAIBAOQUOCTE: 40, DIEMTHANHTICHDOTXUAT: 0, DIEMVANBANGSANGCHE: 0,
        GIOCHUAN_DETAI: 60, GIOCHUAN_TAPCHIQUOCTE: 45, GIOCHUAN_TAPCHIQUOCGIA: 20, SOGIOCOITHI: 24, DIEMCOITHI: 5, DIEMCONGDOAN: 5, DIEMHOP: 4,
        DIEMCHUYENMON_TC1: 48, DIEMCHUYENMON_TC2: 10, DIEMCHUYENMON_TC3: 9, DIEMCHUYENMON_TC4: 5, DIEMCHUYENMON_TC5: 5, DIEMCHUYENMON_TC6: 4, DIEMCHUYENMON_TC7: 5,
        YK_SOGIOCHUAN: '', YK_DIEMDETAI: 'Đề nghị bổ sung minh chứng', TONGDIEM: 86, TENSANGKIENCAITIEN: 'Số hoá quy trình chấm thi', NGAYTHANGNAMSANGKIEN: '15/05/2026', SOQUYETDINHSANGKIEN: '321/QĐ-ĐHHN', VAITROSANGKIEN_ID: 'VT1' };
    ['NS_TDKT_GiangVien', 'NS_TDKT_CanBo'].forEach(function (c) {
        fx[c + '/LayChiTiet'] = function () { return [CT]; };
        fx[c + '/CapNhat'] = function (o) { Object.keys(o).forEach(function (k) { if (/^strYK_/.test(k)) CT['YK_' + k.slice(6).toUpperCase()] = o[k]; }); CT.TENSANGKIENCAITIEN = o.strTenSangKienCaiTien; return []; };
    });
    ums.demo.add(fx);
})();
