/* Dữ liệu mẫu cho donviphimoi — chỉ dùng ở chế độ dựng thử.
   Hệ/khoá/chương trình/thời gian/kiểu học dùng chung nằm trong _chung_a.js. */
ums.demo.add({
    'TC_ThuChi/LayDSThoiGian_DonViPhi_SoTien': [
        { ID: 'TG1', THOIGIAN: 'HK1 2025-2026' },
        { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' },
        { ID: 'TG4', THOIGIAN: 'HK1 2026-2027' }
    ],
    'TC_DonViPhi_SoTien/LayDSTaiChinh_CT_DonViPhi': [
        { PHAMVIAPDUNG_ID: 'CT1', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_MA: '7480201' },
        { PHAMVIAPDUNG_ID: 'CT2', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm' },
        { PHAMVIAPDUNG_ID: 'CT3', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh(7340101)' },
        { PHAMVIAPDUNG_ID: 'CT4', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Ngoại ngữ', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Ngôn ngữ Anh' }
    ],
    'KHCT_ThongTin/LayDSNganhTheoKhoa': [
        { ID: 'CT2', MA: '7480103', TEN: 'Kỹ thuật phần mềm', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin' },
        { ID: 'CT4', MA: '7220201', TEN: 'Ngôn ngữ Anh', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Ngoại ngữ' },
        { ID: 'NG5', MA: '7340301', TEN: 'Kế toán', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế' },
        { ID: 'NG6', MA: '7340201', TEN: 'Tài chính - Ngân hàng', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế' }
    ],
    'TC_DonViPhi_SoTien/LayDanhSach': [
        { ID: 'DVP1', PHAMVIAPDUNG_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 450000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/08/2025' },
        { ID: 'DVP2', PHAMVIAPDUNG_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', TONGSOTIEN: 475000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/01/2026' },
        { ID: 'DVP3', PHAMVIAPDUNG_ID: 'CT2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 480000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/08/2025' },
        { ID: 'DVP4', PHAMVIAPDUNG_ID: 'CT3', DAOTAO_THOIGIANDAOTAO_ID: 'TG4', TONGSOTIEN: 390000, TAICHINH_CACKHOANTHU_ID: 'KT2', KIEUHOC_ID: 'KHO2', NGAYAPDUNG: '15/07/2026' }
    ]
});
