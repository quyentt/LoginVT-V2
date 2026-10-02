/* Dữ liệu mẫu cho diemdacbietapdung — chỉ dùng ở chế độ dựng thử (kho nhớ: thamsochung/script/_apdung.demo.js). */
(function () {
    ums.demo.add({
        'D_DiemDacBiet/LayDanhSach': [
            { ID: 'DB1', TEN: 'Vắng thi (V)' }, { ID: 'DB2', TEN: 'Cấm thi (CT)' },
            { ID: 'DB3', TEN: 'Miễn học (M)' }, { ID: 'DB4', TEN: 'Chưa đủ điểm (I)' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.LOAIDIEMDACBIET': [
            { ID: 'LD1', MA: 'THI', TEN: 'Điểm thi' }, { ID: 'LD2', MA: 'QT', TEN: 'Điểm quá trình' },
            { ID: 'LD3', MA: 'TK', TEN: 'Điểm tổng kết' }
        ]
    });
    function mau(pv) {
        if (pv.length > 12) return [{ DIEM_DIEMDACBIET_ID: 'DB1', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '01/09/2024', GIATRIXULY: '0', LOAIDIEM_ID: 'LD1' }];
        return [
            { DIEM_DIEMDACBIET_ID: 'DB1', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', GIATRIXULY: '0', LOAIDIEM_ID: 'LD1' },
            { DIEM_DIEMDACBIET_ID: 'DB2', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', GIATRIXULY: '0', LOAIDIEM_ID: 'LD3' },
            { DIEM_DIEMDACBIET_ID: 'DB3', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '02/09/2024', GIATRIXULY: '', LOAIDIEM_ID: 'LD3' }
        ];
    }
    mau.map = function (o) {
        return { DIEM_DIEMDACBIET_ID: o.strDiem_DiemDacBiet_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id,
            NGAYAPDUNG: o.strNgayApDung, GIATRIXULY: o.dGiaTriXuLy, LOAIDIEM_ID: o.strLoaiDiem_Id };
    };
    ums.qldADDemo('D_DiemDacBiet_ApDung', mau);
})();
