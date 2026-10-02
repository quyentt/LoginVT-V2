/* Dữ liệu mẫu cho thamsochungapdung — chỉ dùng ở chế độ dựng thử (kho nhớ: _apdung.demo.js). */
(function () {
    ums.demo.add({
        'D_ThamSoHocTapChung/LayDanhSach': [
            { ID: 'TSC1', DIEM_THAMSOHOCTAPCHUNG_TEN: 'Quy chế tín chỉ 2021' },
            { ID: 'TSC2', DIEM_THAMSOHOCTAPCHUNG_TEN: 'Quy chế niên chế' },
            { ID: 'TSC3', DIEM_THAMSOHOCTAPCHUNG_TEN: 'Quy chế đào tạo từ xa' }
        ]
    });
    function mau(pv) {
        if (pv.length > 12) return [{ DIEM_THAMSOHOCTAPCHUNG_ID: 'TSC1', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '01/09/2023', SOLANHOCTOIDA: '2', SOLANTHILAITOIDA: '1' }];
        return [
            { DIEM_THAMSOHOCTAPCHUNG_ID: 'TSC1', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', SOLANHOCTOIDA: '3', SOLANTHILAITOIDA: '2' },
            { DIEM_THAMSOHOCTAPCHUNG_ID: 'TSC2', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '02/09/2024', SOLANHOCTOIDA: '3', SOLANTHILAITOIDA: '1' }
        ];
    }
    mau.map = function (o) {
        return { DIEM_THAMSOHOCTAPCHUNG_ID: o.strDiem_ThamSoHocTapChung_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id,
            NGAYAPDUNG: o.strNgayApDung, SOLANHOCTOIDA: o.dSoLanHocToiDa, SOLANTHILAITOIDA: o.dSoLanThiLaiToiDa };
    };
    ums.qldADDemo('D_ThamSoHocTapChung_ApDung', mau);
})();
