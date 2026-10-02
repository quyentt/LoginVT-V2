/* Dữ liệu mẫu cho congthucdiemapdung — chỉ dùng ở chế độ dựng thử (kho nhớ: thamsochung/script/_apdung.demo.js). */
(function () {
    var CT = [
        { ID: 'CTD1', XAUCONGTHUC: '[CC]*0.1 + [GK]*0.3 + [THI]*0.6', DIEM_THANHPHANDIEM_TEN: 'Điểm tổng kết học phần', MOHINHXULY_TEN: 'Trung bình có trọng số' },
        { ID: 'CTD2', XAUCONGTHUC: '[GK]*0.4 + [THI]*0.6', DIEM_THANHPHANDIEM_TEN: 'Điểm tổng kết học phần', MOHINHXULY_TEN: 'Trung bình có trọng số' },
        { ID: 'CTD3', XAUCONGTHUC: 'MAX([THI1],[THI2])', DIEM_THANHPHANDIEM_TEN: 'Điểm thi', MOHINHXULY_TEN: 'Lấy cao nhất' }
    ];
    ums.demo.add({ 'D_CongThucDiem/LayDanhSach': CT });
    function tu(id) { return CT.filter(function (x) { return x.ID === id; })[0] || {}; }
    function dong(id, tg, th, sl) {
        var c = tu(id);
        return { DIEM_CONGTHUCDIEM_ID: id, DAOTAO_THOIGIANDAOTAO_ID: tg, DIEM_THANHPHANDIEM_TEN: c.DIEM_THANHPHANDIEM_TEN,
            MOHINHXULY_TEN: c.MOHINHXULY_TEN, TONGHOPKHIDUDIEMTHANHPHAN: th, SOTHANHPHANDIEMTOITHIEU: sl };
    }
    function mau(pv) {
        if (pv.length > 12) return [dong('CTD2', 'TG11', '0', '2')];
        return [dong('CTD1', 'TG01', '1', '3'), dong('CTD3', 'TG11', '1', '1')];
    }
    mau.map = function (o) {
        return dong(o.strDiem_CongThucDiem_Id, o.strDaoTao_ThoiGianDaoTao_Id, o.dTongHopKhiDuDiem, o.dSoThanhPhanToiThieu);
    };
    ums.qldADDemo('D_CongThucDiem_ApDung', mau);
})();
