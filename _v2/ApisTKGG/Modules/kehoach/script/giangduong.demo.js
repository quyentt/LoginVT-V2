/* Dữ liệu mẫu cho giangduong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var GV = [
        { GIANGVIEN_ID: 'GV1', GIANGVIEN_MASO: 'CB0012', GIANGVIEN_HOTEN: 'Nguyễn Văn An', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', TONGSOTIET: 18 },
        { GIANGVIEN_ID: 'GV2', GIANGVIEN_MASO: 'CB0034', GIANGVIEN_HOTEN: 'Trần Thị Bình', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế', TONGSOTIET: 9 }
    ];
    var RS = [
        { GIANGVIEN_ID: 'GV1', NGAYHOC: '06/10/2025', TIETBATDAU: 1, TIETKETTHUC: 3, SOTIET: 3, DAOTAO_LOPHOCPHAN_TEN: 'Lập trình Web - 01', GIANGDUONG_TEN: 'A2.301' },
        { GIANGVIEN_ID: 'GV1', NGAYHOC: '08/10/2025', TIETBATDAU: 4, TIETKETTHUC: 6, SOTIET: 3, DAOTAO_LOPHOCPHAN_TEN: 'Lập trình Web - 01', GIANGDUONG_TEN: 'A2.301' },
        { GIANGVIEN_ID: 'GV2', NGAYHOC: '07/10/2025', TIETBATDAU: 7, TIETKETTHUC: 9, SOTIET: 3, DAOTAO_LOPHOCPHAN_TEN: 'Kinh tế vi mô - 02', GIANGDUONG_TEN: 'B1.105' }
    ];
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LGV0': [{ ID: 'LGV1', MA: 'CH', TEN: 'Cơ hữu' }, { ID: 'LGV2', MA: 'TG', TEN: 'Thỉnh giảng' }],
        'NS_HoSoV2/LayDanhSach': function (o) { return [{ ID: 'GV1', HOTEN: 'Nguyễn Văn An', MASO: 'CB0012' }, { ID: 'GV2', HOTEN: 'Trần Thị Bình', MASO: 'CB0034' }]; },
        'TKGG_GiangDuongTrucTuyen/LayDSLichGiangTheoGiaiDoan': function (o) {
            var gv = o.strGiangVien_Id ? GV.filter(function (g) { return g.GIANGVIEN_ID === o.strGiangVien_Id; }) : GV;
            return { rsTongHop: gv, rs: RS.filter(function (r) { return gv.some(function (g) { return g.GIANGVIEN_ID === r.GIANGVIEN_ID; }); }) };
        }
    });
})();
