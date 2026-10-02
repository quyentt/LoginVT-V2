/* Dữ liệu mẫu cho Tiêu chuẩn xếp loại áp dụng — chỉ dùng ở chế độ dựng thử. */
(function () {
    function xl(id, duoi, tren, kl, klTen, xlId, xlTen, quyDoi) {
        return {
            ID: id, DIEMCANDUOI: duoi, DIEMCANTREN: tren, MUCKYLUATCAONHAT_ID: kl, MUCKYLUATCAONHAT_TEN: klTen,
            XEPLOAI_ID: xlId, XEPLOAI_TEN: xlTen, DIEMQUYDOI: quyDoi, DOITUONGAPDUNG_ID: 'DT-SV',
            DRL_TIEUCHIDANHGIA_ID: 'TCG1', GHICHU: '', PHANCAPAPDUNG_ID: 'TCC-' + xlId,
            PHAMVIAPDUNG_ID: 'K67', DAOTAO_THOIGIANDAOTAO_NAM_ID: 'NH2025', DAOTAO_THOIGIANDAOTAO_KY_ID: 'HK1-2526'
        };
    }
    ums.demo.add({
        'RL_TieuChuanXepLoai_AD/LayDanhSach': [
            xl('X1', 90, 100, '', '', 'XS', 'Xuất sắc', 4),
            xl('X2', 80, 89, 'KL1', 'Khiển trách', 'TOT', 'Tốt', 3.5),
            xl('X3', 65, 79, 'KL2', 'Cảnh cáo', 'KHA', 'Khá', 3),
            xl('X4', 50, 64, 'KL2', 'Cảnh cáo', 'TB', 'Trung bình', 2),
            xl('X5', 35, 49, 'KL3', 'Đình chỉ học tập có thời hạn', 'YEU', 'Yếu', 1)
        ],
        'RL_TieuChuanXepLoai_AD/LayDSTieuChuanXepLoaiChuaDung': [
            { ID: 'TCC-KEM', DRL_TIEUCHIDANHGIA_TEN: 'Kém (dưới 35 điểm)', DIEMCANDUOI: 0, DIEMCANTREN: 34, XEPLOAI_ID: 'KEM',
              DOITUONGAPDUNG_ID: 'DT-SV', DIEMQUYDOI: 0, DRL_TIEUCHIDANHGIA_ID: 'TCG1', GHICHU: 'Theo quy chế', MUCKYLUATCAONHAT_ID: 'KL3',
              PHAMVIAPDUNG_ID: '', DAOTAO_THOIGIANDAOTAO_NAM_ID: '', DAOTAO_THOIGIANDAOTAO_KY_ID: '' }
        ],
        'RL_TieuChiDanhGia/LayDanhSach': [
            { ID: 'TCG1', TEN: 'Tổng điểm rèn luyện' }, { ID: 'TCG2', TEN: 'Điểm ý thức học tập' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.HINHTHUCKYLUAT': [
            { ID: 'KL1', MA: 'KT', TEN: 'Khiển trách' }, { ID: 'KL2', MA: 'CC', TEN: 'Cảnh cáo' },
            { ID: 'KL3', MA: 'DC', TEN: 'Đình chỉ học tập có thời hạn' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DRL.XEPLOAI': [
            { ID: 'XS', MA: 'XS', TEN: 'Xuất sắc' }, { ID: 'TOT', MA: 'T', TEN: 'Tốt' }, { ID: 'KHA', MA: 'K', TEN: 'Khá' },
            { ID: 'TB', MA: 'TB', TEN: 'Trung bình' }, { ID: 'YEU', MA: 'Y', TEN: 'Yếu' }, { ID: 'KEM', MA: 'KEM', TEN: 'Kém' }
        ]
    });
})();
