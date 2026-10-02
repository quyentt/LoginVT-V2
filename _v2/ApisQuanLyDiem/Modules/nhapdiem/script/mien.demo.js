/* Dữ liệu mẫu cho mien (Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var SV = [['SV1', 'B22DCCN001', 'Nguyễn Văn', 'An', 'HP1', 'Triết học Mác - Lênin', 'PHI1001'], ['SV2', 'B22DCCN002', 'Trần Thị', 'Bình', 'HP1', 'Triết học Mác - Lênin', 'PHI1001'],
        ['SV2', 'B22DCCN002', 'Trần Thị', 'Bình', 'HP2', 'Tiếng Anh 1', 'ENG1001'], ['SV3', 'B22DCCN003', 'Lê Hoàng', 'Cường', 'HP2', 'Tiếng Anh 1', 'ENG1001']];
    var KQ = { 'SV1_HP1': { DANHGIA_TEN: 'Miễn', THOIGIAN: '2026_2027_1', GHICHU: 'Đã học tại trường cũ', NGAYTAO_DD_MM_YYYY_HHMMSS: '20/09/2026 09:15:00', NGUOITAO_TAIKHOAN: 'quanlydiem' } };
    ums.demo.add({
        'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh': [{ ID: 'LQD1', TEN: 'Công nhận miễn học phần' }, { ID: 'LQD2', TEN: 'Chuyển điểm' }],
        'SV_QuyetDinh/LayDanhSach': function (o) { return o.strLoaiQuyetDinh_Id ? [{ ID: 'QD1', SOQUYETDINH: '1520/QĐ-ĐHCN' }, { ID: 'QD2', SOQUYETDINH: '1633/QĐ-ĐHCN' }] : []; },
        'SV_QuyetDinh_HocPhan/LayDSHocPhanTheoQuyetDinh': function (o) { return o.strQLSV_QuyetDinh_Id ? [{ ID: 'HP1', TEN: 'Triết học Mác - Lênin', MA: 'PHI1001' }, { ID: 'HP2', TEN: 'Tiếng Anh 1', MA: 'ENG1001' }] : []; },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.DANHGIA': [{ ID: 'DG1', TEN: 'Miễn' }, { ID: 'DG2', TEN: 'Công nhận' }],
        'D_Mien/LayDSNguoiHocTheoQuyetDinh': function () {
            var rs = SV.map(function (x, i) { return { ID: 'M' + i, QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
                DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_MA: '7480201', DAOTAO_HOCPHAN_ID: x[4], DAOTAO_HOCPHAN_TEN: x[5],
                DAOTAO_HOCPHAN_MA: x[6], QLSV_QUYETDINH_ID: 'QD1' }; });
            var kq = Object.keys(KQ).map(function (k) { var p = k.split('_'), o = Object.assign({ QLSV_NGUOIHOC_ID: p[0], DAOTAO_HOCPHAN_ID: p[1] }, KQ[k]); return o; });
            return { rows: { rs: rs, rsKetQua: kq }, pager: rs.length };
        },
        'D_Mien/Them_Diem_NH_CongNhan_Mien': function (o) {
            KQ[o.strQLSV_NguoiHoc_Id + '_' + o.strDaoTao_HocPhan_Id] = { DANHGIA_TEN: o.strDanhGia_Id === 'DG2' ? 'Công nhận' : 'Miễn', THOIGIAN: '2026_2027_1', GHICHU: o.strGhiChu,
                NGAYTAO_DD_MM_YYYY_HHMMSS: '25/09/2026 10:00:00', NGUOITAO_TAIKHOAN: 'quanlydiem' }; return [];
        },
        'D_Mien/Xoa_Diem_NH_CongNhan_Mien': function (o) { delete KQ[o.strQLSV_NguoiHoc_Id + '_' + o.strDaoTao_HocPhan_Id]; return []; }
    });
})();
