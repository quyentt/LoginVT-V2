/* Dữ liệu mẫu cho thamsodanhgiaketquaapdung — chỉ dùng ở chế độ dựng thử (kho nhớ: thamsochung/script/_apdung.demo.js). */
(function () {
    ums.demo.add({
        'D_ThamSoDanhGiaKetQua/LayDanhSach': [
            { ID: 'DG1', DANHGIA_TEN: 'Đạt' }, { ID: 'DG2', DANHGIA_TEN: 'Không đạt' },
            { ID: 'DG3', DANHGIA_TEN: 'Học lại' }, { ID: 'DG4', DANHGIA_TEN: 'Thi lại' }
        ]
    });
    function mau(pv) {
        if (pv.length > 12) return [{ DIEM_THAMSODANHGIAKETQUA_ID: 'DG4', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '01/09/2024', XAUDIEUKIEN: 'DIEMTHI < 4', MOTA: 'Thi lại khi điểm thi dưới 4' }];
        return [
            { DIEM_THAMSODANHGIAKETQUA_ID: 'DG1', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', XAUDIEUKIEN: 'DIEMTK >= 4', MOTA: 'Đạt học phần' },
            { DIEM_THAMSODANHGIAKETQUA_ID: 'DG2', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', XAUDIEUKIEN: 'DIEMTK < 4', MOTA: '' }
        ];
    }
    mau.map = function (o) {
        return { DIEM_THAMSODANHGIAKETQUA_ID: o.strDiem_ThamSoDanhGiaKQ_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id,
            NGAYAPDUNG: o.strNgayApDung, XAUDIEUKIEN: o.strXauDieuKien, MOTA: o.strMoTa };
    };
    ums.qldADDemo('D_ThamSoDanhGiaKetQua_ApDung', mau);
})();
