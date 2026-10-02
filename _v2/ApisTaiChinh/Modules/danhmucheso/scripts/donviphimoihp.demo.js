/* Dữ liệu mẫu cho donviphimoihp — chỉ dùng ở chế độ dựng thử.
   Thời gian/kiểu học dùng chung nằm trong _chung_a.js. */
(function () {
    var HP = [
        { ID: 'HP1', MA: 'INT1001', TEN: 'Nhập môn lập trình', BOMON: 'DV1' },
        { ID: 'HP2', MA: 'INT2204', TEN: 'Lập trình hướng đối tượng', BOMON: 'DV1' },
        { ID: 'HP3', MA: 'INT2210', TEN: 'Cấu trúc dữ liệu và giải thuật', BOMON: 'DV1' },
        { ID: 'HP4', MA: 'BSA2001', TEN: 'Nguyên lý kế toán', BOMON: 'DV2' },
        { ID: 'HP5', MA: 'FLF1107', TEN: 'Tiếng Anh B1', BOMON: 'DV3' }
    ];
    var TEN_DV = { DV1: 'Khoa Công nghệ thông tin', DV2: 'Khoa Kinh tế', DV3: 'Khoa Ngoại ngữ' };
    ums.demo.add({
        'pkg_taichinh_thuchi2.LayDSThoiGian_DonViPhi_HocPhan': [
            { ID: 'TG1', THOIGIAN: 'HK1 2025-2026' },
            { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' },
            { ID: 'TG3', THOIGIAN: 'Hè 2025-2026' }
        ],
        'pkg_taichinh_thuchi2.LayDSHocPhanKhaiDonViPhi': HP.map(function (h, i) {
            return { ID: h.ID, DAOTAO_HOCPHAN_MA: h.MA, DAOTAO_HOCPHAN_TEN: h.TEN, DAOTAO_HOCPHAN_HOCTRINH: [3, 3, 4, 3, 4][i], DAOTAO_COCAUTOCHUC_TEN: TEN_DV[h.BOMON] };
        }),
        'pkg_nhansu_hoso_v2.LayDanhSachToanBo': [
            { ID: 'DV1', TEN: 'Khoa Công nghệ thông tin', MA: 'CNTT' },
            { ID: 'DV2', TEN: 'Khoa Kinh tế', MA: 'KT' },
            { ID: 'DV3', TEN: 'Khoa Ngoại ngữ', MA: 'NN' }
        ],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan': function (o) {
            return HP.filter(function (h) { return !o.strThuocBoMon_Id || h.BOMON === o.strThuocBoMon_Id; });
        },
        'TC_DonViPhi_SoTien/LayDanhSach': [
            { ID: 'DH1', PHAMVIAPDUNG_ID: 'HP1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 1350000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/08/2025' },
            { ID: 'DH2', PHAMVIAPDUNG_ID: 'HP2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 1350000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/08/2025' },
            { ID: 'DH3', PHAMVIAPDUNG_ID: 'HP3', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', TONGSOTIEN: 1800000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '05/01/2026' },
            { ID: 'DH4', PHAMVIAPDUNG_ID: 'HP5', DAOTAO_THOIGIANDAOTAO_ID: 'TG3', TONGSOTIEN: 2100000, TAICHINH_CACKHOANTHU_ID: 'KT2', KIEUHOC_ID: 'KHO2', NGAYAPDUNG: '01/06/2026' }
        ]
    });
})();
