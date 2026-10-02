/* Dữ liệu mẫu cho thongke/ketquakhaosat(admin) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, N = 'NS_ThongTinCanBo/';
    fx[N + 'LayDSKeHoachKhaoSatCaNhan'] = [{ ID: 'KH1', TEN: 'Khảo sát giảng dạy HK1 2026' }];
    fx[N + 'LayDSPhieuKhaoSatCaNhan'] = function (o) { return o.strKS_KeHoachKhaoSat_Id ? [{ ID: 'PH1', TEN: 'Phiếu đánh giá học phần' }] : []; };
    var DA = [['D1', 1, 'Hoàn toàn không đồng ý'], ['D2', 2, 'Không đồng ý'], ['D3', 3, 'Phân vân'], ['D4', 4, 'Đồng ý'], ['D5', 5, 'Hoàn toàn đồng ý']]
        .map(function (x) { return { ID: x[0], MADAPAN: x[0], TRONGSODIEM: x[1], TENDAPAN: x[2] }; });
    fx[N + 'LayDSKetQuaKhaoSatCaNhan'] = { rows: {
        rsThongTinChung: [{ KS_CSDL_HOCPHAN_TEN: 'Lập trình HĐT', KS_CSDL_HOCPHAN_MA: 'IT3100', KS_DOITUONGDUOCKHAOSAT_TEN: 'TS. Nguyễn Văn Hùng', TUNGAY: '01/12/2026', DENNGAY: '15/12/2026' }],
        rsDanhMucDapAn: DA,
        rsCauHoi_1DapAn: [{ ID: 'C1', TENCAUHOI: 'Giảng viên truyền đạt dễ hiểu', KS_KEHOACHKHAOSAT_ID: 'KH1', KS_PHIEUKHAOSAT_ID: 'PH1' },
                          { ID: 'C2', TENCAUHOI: 'Tài liệu học tập đầy đủ', KS_KEHOACHKHAOSAT_ID: 'KH1', KS_PHIEUKHAOSAT_ID: 'PH1' }],
        rsCauHoi_Mo: [{ ID: 'M1', TENCAUHOI: 'Góp ý khác' }], rsCauHoi_Mo_KetQua: [{ KS_CAUHOI_ID: 'M1', DAPAN: 'Nên có thêm bài tập' }, { KS_CAUHOI_ID: 'M1', DAPAN: 'Thầy dạy hay' }] } };
    fx[N + 'LayDSSoPhieuTheoCauHoi'] = function (o) { return [{ SOLUONG: { D1: 0, D2: 1, D3: 3, D4: 10, D5: 6 }[o.strMaDapAn] }]; };
    fx[N + 'LayDSPhanTramTheoCauHoi'] = function (o) { return [{ PHANTRAM: { D1: '0%', D2: '5%', D3: '15%', D4: '50%', D5: '30%' }[o.strMaDapAn] }]; };
    ums.demo.add(fx);
})();
