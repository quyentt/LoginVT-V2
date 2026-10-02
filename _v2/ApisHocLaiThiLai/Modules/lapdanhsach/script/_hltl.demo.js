/* Dữ liệu mẫu chung của ba màn Học lại thi lại (lapdanhsach, dangky, chotdanhsach) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', AC = 'HLTL_ThongTinChung/';
    function dm(id, ma, ten, bang) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: bang }; }

    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = [
        { ID: 'HK1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026' },
        { ID: 'HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2025-2026' },
        { ID: 'HK3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè năm học 2025-2026' }
    ];
    fx['KHCT_KhoaQuanLy/LayDanhSach'] = [
        { ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' },
        { ID: 'KQL2', TEN: 'Khoa Kinh tế' },
        { ID: 'KQL3', TEN: 'Khoa Ngoại ngữ' }
    ];
    fx[D + 'DIEM.DANHGIA'] = [dm('DG1', 'F', 'Không đạt', 'Đánh giá'), dm('DG2', 'TL', 'Thi lại', 'Đánh giá'), dm('DG3', 'HL', 'Học lại', 'Đánh giá')];
    fx[D + 'QLHLTL.TINHTRANGDANGKY'] = [dm('TD1', 'DK', 'Đăng ký học lại', 'Tình trạng đăng ký'),
        dm('TD2', 'DKT', 'Đăng ký thi lại', 'Tình trạng đăng ký'), dm('TD3', 'HUY', 'Hủy đăng ký', 'Tình trạng đăng ký')];
    fx['CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI'] = [
        { ID: 'TT1', TEN: 'Đang học' }, { ID: 'TT2', TEN: 'Bảo lưu' }, { ID: 'TT3', TEN: 'Tạm ngừng học' },
        { ID: 'TT4', TEN: 'Đã tốt nghiệp' }, { ID: 'TT5', TEN: 'Thôi học' }
    ];

    var HP = [
        { ID: 'HP1', MA: 'INT1306', TEN: 'Cấu trúc dữ liệu và giải thuật', HOCTRINH: 3 },
        { ID: 'HP2', MA: 'MAT1041', TEN: 'Giải tích 1', HOCTRINH: 4 },
        { ID: 'HP3', MA: 'ECO1012', TEN: 'Kinh tế vi mô', HOCTRINH: 3 }
    ];
    fx[AC + 'LayDSHocPhanHocLaiThiLai'] = HP;

    var TTTC = ['Đã nộp đủ', 'Chưa nộp', 'Nộp một phần'];
    var KQXN = ['Đăng ký học lại', 'Đăng ký thi lại', '', 'Hủy đăng ký'];
    var SV = [
        ['SV01', 'HL21A001', 'Nguyễn Văn', 'An', '12/03/2003', 'K67-KTPM1', 0],
        ['SV02', 'HL21A014', 'Trần Thị', 'Bình', '25/07/2003', 'K67-KTPM1', 0],
        ['SV03', 'HL21A027', 'Lê Hoàng', 'Cường', '02/11/2003', 'K67-KTPM1', 0],
        ['SV04', 'HL21B005', 'Phạm Thu', 'Dung', '19/01/2003', 'K67-QTKD2', 1],
        ['SV05', 'HL21B018', 'Hoàng Minh', 'Đức', '08/09/2003', 'K67-QTKD2', 1],
        ['SV06', 'HL21B033', 'Vũ Ngọc', 'Hà', '30/05/2003', 'K67-QTKD2', 1],
        ['SV07', 'HL22A009', 'Đặng Quốc', 'Huy', '14/04/2004', 'K68-HTTT1', 0],
        ['SV08', 'HL22A021', 'Bùi Khánh', 'Linh', '21/12/2004', 'K68-HTTT1', 0],
        ['SV09', 'HL22A040', 'Đỗ Thành', 'Nam', '03/06/2004', 'K68-HTTT1', 0],
        ['SV10', 'HL22B011', 'Ngô Phương', 'Thảo', '17/08/2004', 'K68-QTKD1', 1],
        ['SV11', 'HL22B026', 'Dương Văn', 'Tùng', '09/10/2004', 'K68-QTKD1', 1],
        ['SV12', 'HL22B038', 'Lý Hải', 'Yến', '28/02/2004', 'K68-QTKD1', 1]
    ].map(function (x, i) {
        var kt = x[6] === 1;
        return { ID: x[0], MASO: x[1], HODEM: x[2], TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: x[4], LOP: x[5],
            HEDAOTAO: 'Đại học chính quy', KHOADAOTAO: x[5].slice(0, 3) === 'K67' ? 'Khóa 67' : 'Khóa 68',
            CHUONGTRINH: kt ? 'Quản trị kinh doanh' : 'Kỹ thuật phần mềm',
            KHOAQUANLY: kt ? 'Khoa Kinh tế' : 'Khoa Công nghệ thông tin',
            KETQUAXACNHAN_TEN: KQXN[i % 4], TINHTRANGTAICHINH: TTTC[i % 3] };
    });
    ums.demo.hltlSV = SV;

    fx[AC + 'LayDSNguoiHocHocLaiThiLai'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var all = SV.filter(function (s) { return !q || (s.MASO + ' ' + s.HODEM + ' ' + s.TEN).toLowerCase().indexOf(q) >= 0; });
        var hp = o.strDaoTao_HocPhan_Id ? HP.filter(function (h) { return h.ID === o.strDaoTao_HocPhan_Id; }) : HP;
        var sz = Number(o.pageSize) || 10, pg = Number(o.pageIndex) || 1;
        return { rows: { rs: all.slice((pg - 1) * sz, pg * sz), rsHocPhan: hp }, pager: all.length };
    };
    ums.demo.add(fx);
})();
