/* Dữ liệu mẫu cho thongke/phodiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'D_ThongKe/', fx = {};
    fx[D + 'LayDSNganhDaoTaoTheoCTDT'] = [{ ID: 'NG1', TEN: 'Công nghệ thông tin' }, { ID: 'NG2', TEN: 'Quản trị kinh doanh' }];
    fx[D + 'LayDSThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2025_2026_2' }, { ID: 'TG2', THOIGIAN: '2025_2026_1' }];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.THANGDIEM'] = [{ ID: 'TD10', MA: '10', TEN: 'Thang điểm 10' }, { ID: 'TD4', MA: '4', TEN: 'Thang điểm 4' }];
    fx[D + 'LayDSHocPhanTrongKy'] = function (o) {
        return o.strNganhHoc_Id ? [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng', HOCTRINH: 3 }, { ID: 'HP2', MA: 'IT3200', TEN: 'Cơ sở dữ liệu', HOCTRINH: 3 }] : [];
    };
    fx[D + 'LayDSKetQuaPhoDiem'] = function () {
        var tp = [{ DIEM_THANHPHANDIEM_ID: 'CC', DIEM_THANHPHANDIEM_TEN: 'Chuyên cần' }, { DIEM_THANHPHANDIEM_ID: 'GK', DIEM_THANHPHANDIEM_TEN: 'Giữa kỳ' }, { DIEM_THANHPHANDIEM_ID: 'CK', DIEM_THANHPHANDIEM_TEN: 'Cuối kỳ' }];
        var pd = [[0, 3.9], [4, 5.4], [5.5, 6.9], [7, 8.4], [8.5, 10]].map(function (x) { return { MUCCANDUOI: x[0], MUCCANTREN: x[1] }; });
        var kq = [];
        pd.forEach(function (p, i) { tp.forEach(function (t, j) { kq.push({ MUCCANDUOI: p.MUCCANDUOI, MUCCANTREN: p.MUCCANTREN, DIEM_THANHPHANDIEM_ID: t.DIEM_THANHPHANDIEM_ID, SOLUONG: [3, 12, 25, 30, 10][i] + j * 2 }); }); });
        return { rsThanhPhanDiem: tp, rsPhoDiem: pd, rsKeQuaTheoPhoDiem: kq };
    };
    fx[D + 'TinhPhoDiemHocPhan'] = [];
    ums.demo.add(fx);
})();
