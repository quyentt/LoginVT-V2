/* Dữ liệu mẫu cho kehoachdangky/lophoc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [
        ['DS1', 'DSNĐ-IT3080-K67KTPM1', 'Danh sách nhập điểm K67-KTPM1', 'HP1', 'Lập trình Web', 38],
        ['DS2', 'DSNĐ-IT3090-K67KTPM1', 'Danh sách nhập điểm K67-KTPM1', 'HP2', 'Cơ sở dữ liệu', 40],
        ['DS3', 'DSNĐ-EC2010-K67QTKD2', 'Danh sách nhập điểm K67-QTKD2', 'HP3', 'Kinh tế vi mô', 52],
        ['DS4', 'DSNĐ-IT3080-HOCLAI', 'Danh sách học lại Lập trình Web', 'HP1', 'Lập trình Web', 7]
    ].map(function (x) { return { ID: x[0], MA: x[1], TEN: x[2], DAOTAO_HOCPHAN_ID: x[3], DAOTAO_HOCPHAN_TEN: x[4], SOLUONG: x[5] }; });
    var CHUA = [
        ['NH7', 'BIT220301', 'Đỗ Thị', 'Lan', 'K67-KTPM1', 'L1', 'Kỹ thuật phần mềm', 'CTKTPM', '', '', '', 'Chưa có điểm', 1, 0],
        ['NH8', 'BIT220315', 'Bùi Quang', 'Minh', 'K67-KTPM1', 'L1', 'Kỹ thuật phần mềm', 'CTKTPM', '4.5', '1.0', 'D', 'Đạt', 1, 1],
        ['NH9', 'BIT210877', 'Ngô Văn', 'Phúc', 'K66-KTPM2', 'L4', 'Kỹ thuật phần mềm', 'CTKTPM', '3.2', '0.0', 'F', 'Không đạt', 2, 2]
    ].map(function (x) {
        return { ID: x[0], MASO: x[1], HODEM: x[2], TEN: x[3], LOP: x[4], LOP_ID: x[5], NGANH: x[6], NGANH_ID: x[7],
            QLSV_NGUOIHOC_TRANGTHAI: 'Đang học', DIEM: x[8], DIEMQUYDOI: x[9], DIEMCHU: x[10], DANHGIA_TEN: x[11], LANHOC: x[12], LANTHI: x[13] };
    });
    var DA = [
        ['DN1', 'BIT220263', 'Nguyễn Văn', 'An', '8.5', '4.0', 'A', 'Đạt'],
        ['DN2', 'BIT220271', 'Trần Thị', 'Bình', '7.0', '3.0', 'B', 'Đạt'],
        ['DN3', 'BIT220288', 'Lê Hoàng', 'Cường', '', '', '', 'Chưa có điểm']
    ].map(function (x) {
        return { ID: x[0], MASONGUOIHOC: x[1], HODEMNGUOIHOC: x[2], TENNGUOIHOC: x[3], TINHTRANG_TEN: 'Đang học', LOPQUANLY_TEN: 'K67-KTPM1',
            CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DIEM: x[4], DIEMQUYDOI: x[5], DIEMCHU: x[6], DANHGIA_TEN: x[7], LANHOC: 1, LANTHI: x[4] ? 1 : 0 };
    });
    function trang(o, r) { var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1; return { rows: r.slice((p - 1) * s, p * s), pager: r.length }; }
    ums.demo.add({
        'D_LoaiDanhSach/LayLoaiDanhSach': [{ ID: 'LDS1', TEN: 'Danh sách nhập điểm' }, { ID: 'LDS2', TEN: 'Danh sách học lại' }],
        'D_ThoiGian/LayDanhSach': [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025-2026_2' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2026-2027_1' }],
        'D_HocPhan/LayDanhSach': [{ ID: 'HP1', TEN: 'Lập trình Web' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu' }, { ID: 'HP3', TEN: 'Kinh tế vi mô' }],
        'D_Hoc/LayDanhSach': function (o) { return trang(o, DS.filter(function (x) { return !o.strDaoTao_HocPhan_Id || x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; })); },
        'D_NguoiHoc/LayDanhSach': function (o) { return trang(o, CHUA); },
        'D_Hoc_NguoiHoc/LayDanhSach': DA,
        'D_NguoiHoc/ThemMoi': { rows: [], message: '' },
        'D_NguoiHoc/Xoa': { rows: [], message: '' },
        'D_HocPhanCungChuongTrinh/LayDanhSach': [
            { ID: 'HP1', MA: 'IT3080', TEN: 'Lập trình Web', HOCTRINH: 3 },
            { ID: 'HP2', MA: 'IT3090', TEN: 'Cơ sở dữ liệu', HOCTRINH: 3 },
            { ID: 'HP4', MA: 'IT4015', TEN: 'Trí tuệ nhân tạo', HOCTRINH: 2 }
        ],
        'D_Hoc/Tao_Diem_DanhSachHoc': { rows: [], message: '' },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': [
            { ID: 'L1', MA: 'K67-KTPM1', TEN: 'K67-KTPM1', SOLUONGTHUCTE: 45 },
            { ID: 'L2', MA: 'K67-QTKD2', TEN: 'K67-QTKD2', SOLUONGTHUCTE: 52 },
            { ID: 'L3', MA: 'K68-HTTT1', TEN: 'K68-HTTT1', SOLUONGTHUCTE: 40 }
        ]
    });
})();
