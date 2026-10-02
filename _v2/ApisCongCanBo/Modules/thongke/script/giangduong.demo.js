/* Dữ liệu mẫu cho thongke/giangduong — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'KHCT_Quyen_ThongTin/LayDSKhoaQuanLyPhanQuyen': [{ ID: 'KCNTT', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KKT', TEN: 'Khoa Kinh tế' }],
    'NS_HoSoV2/LayDanhSach': function (o) { return o.strDaoTao_CoCauToChuc_Id ? [{ ID: 'NS1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001' }, { ID: 'NS3', HOTEN: 'Lê Quang Minh', MASO: 'CB102' }] : []; },
    'TKGG_GiangDuongTrucTuyen/LayDSLichGiangTheoGiaiDoan': {
        rsTongHop: [{ GIANGVIEN_ID: 'NS1', DAOTAO_COCAUTOCHUC_TEN: 'Khoa CNTT', GIANGVIEN_MASO: 'CB001', GIANGVIEN_HOTEN: 'Nguyễn Văn Hùng', TONGSOTIET: 45 },
                    { GIANGVIEN_ID: 'NS3', DAOTAO_COCAUTOCHUC_TEN: 'Khoa CNTT', GIANGVIEN_MASO: 'CB102', GIANGVIEN_HOTEN: 'Lê Quang Minh', TONGSOTIET: 30 }],
        rs: [{ GIANGVIEN_ID: 'NS1', NGAYHOC: '07/09/2026', TIETBATDAU: 1, TIETKETTHUC: 3, SOTIET: 3, DAOTAO_LOPHOCPHAN_TEN: 'IT3100.01', GIANGDUONG_TEN: 'A2-301' },
             { GIANGVIEN_ID: 'NS1', NGAYHOC: '14/09/2026', TIETBATDAU: 1, TIETKETTHUC: 3, SOTIET: 3, DAOTAO_LOPHOCPHAN_TEN: 'IT3100.01', GIANGDUONG_TEN: 'A2-301' }]
    }
});
