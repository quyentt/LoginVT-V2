/* Dữ liệu mẫu cho apdungcongthucphi — chỉ dùng ở chế độ dựng thử.
   Hệ/khoá/chương trình/thời gian dùng chung nằm trong _chung_a.js. */
ums.demo.add({
    'TC_CongThucTinhPhi/LayDSThoiGian_CongThucTinhPhi': [
        { ID: 'TG1', THOIGIAN: 'HK1 2025-2026' },
        { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' },
        { ID: 'TG4', THOIGIAN: 'HK1 2026-2027' }
    ],
    'TC_CongThucTinhPhi/LayDanhSach': [
        { ID: 'CTP1', PHAMVIAPDUNG_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', XAUCONGTHUC: '[SOTINCHI]*[DONGIA]', NGHIEPVUAPDUNG_ID: 'NV1', NGAYAPDUNG: '01/08/2025' },
        { ID: 'CTP2', PHAMVIAPDUNG_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', XAUCONGTHUC: '[SOTINCHI]*[DONGIA]*[HESO]', NGHIEPVUAPDUNG_ID: 'NV1', NGAYAPDUNG: '01/01/2026' },
        { ID: 'CTP3', PHAMVIAPDUNG_ID: 'CT2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', XAUCONGTHUC: '[SOTINCHI]*450000', NGHIEPVUAPDUNG_ID: 'NV1', NGAYAPDUNG: '01/08/2025' },
        { ID: 'CTP4', PHAMVIAPDUNG_ID: 'CT3', DAOTAO_THOIGIANDAOTAO_ID: 'TG4', XAUCONGTHUC: '[MUCTRAN]', NGHIEPVUAPDUNG_ID: 'NV2', NGAYAPDUNG: '15/07/2026' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.NVAP': [
        { ID: 'NV1', MA: 'HPTC', TEN: 'Tính học phí tín chỉ' },
        { ID: 'NV2', MA: 'HPNC', TEN: 'Tính học phí niên chế' }
    ],
    'TC_TuKhoa/LayDanhSach': [
        { TUKHOA: '[SOTINCHI]', MOTA: 'Số tín chỉ học phần' },
        { TUKHOA: '[DONGIA]', MOTA: 'Đơn giá một tín chỉ' },
        { TUKHOA: '[HESO]', MOTA: 'Hệ số học phần' },
        { TUKHOA: '[MUCTRAN]', MOTA: 'Mức trần học phí theo quy định' }
    ]
});
