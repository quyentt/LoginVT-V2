/* Dữ liệu mẫu cho hocphansotienmoi — chỉ dùng ở chế độ dựng thử.
   Hệ/khoá/chương trình/thời gian/kiểu học dùng chung nằm trong _chung_a.js;
   khoản thu (TC_KhoanThu/LayDanhSach) có sẵn trong assets/js/demo-data.js. */
ums.demo.add({
    'TC_HocPhan_SoTien/LayDSThoiGian_HocPhan_SoTien': [
        { ID: 'TG1', THOIGIAN: 'HK1 2025-2026' },
        { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' },
        { ID: 'TG4', THOIGIAN: 'HK1 2026-2027' }
    ],
    'KHCT_ThongTin/LayDSKS_HocPhan_CT_TC': [
        { ID: 'X1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'INT1001', DAOTAO_HOCPHAN_TEN: 'Nhập môn lập trình', DAOTAO_HOCPHAN_SOTC: 3 },
        { ID: 'X2', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'INT2203', DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật', DAOTAO_HOCPHAN_SOTC: 4 },
        { ID: 'X3', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_MA: 'INT2211', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_SOTC: 3 },
        { ID: 'X4', DAOTAO_HOCPHAN_ID: 'HP4', DAOTAO_HOCPHAN_MA: 'PES1001', DAOTAO_HOCPHAN_TEN: 'Giáo dục thể chất 1', DAOTAO_HOCPHAN_SOTC: 1 }
    ],
    'TC_HocPhan_SoTien/LayDanhSach': [
        { ID: 'ST1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: '1350000', KIEUHOC_ID: 'KHO1', TAICHINH_CACKHOANTHU_ID: 'KT1' },
        { ID: 'ST2', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: '1800000', KIEUHOC_ID: 'KHO1', TAICHINH_CACKHOANTHU_ID: 'KT1' },
        { ID: 'ST3', DAOTAO_HOCPHAN_ID: 'HP4', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', TONGSOTIEN: '450000', KIEUHOC_ID: 'KHO1', TAICHINH_CACKHOANTHU_ID: 'KT1' }
    ],
    'TC_ThuChi/LayDSThoiGian_DonViPhi_SoTien': [
        { ID: 'TG1', THOIGIAN: 'HK1 2025-2026' },
        { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' }
    ]
});
