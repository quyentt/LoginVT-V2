/* Dữ liệu mẫu cho phuckhao (Thi phách) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var TG = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    var TT = [{ ID: 'PKD1', MA: 'DADUYET', TEN: 'Đã duyệt', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #2e7d32' },
        { ID: 'PKD2', MA: 'KHONGDUYET', TEN: 'Không duyệt', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #c62828' },
        { ID: 'PKD3', MA: 'CHOBOSUNG', TEN: 'Chờ bổ sung', THONGTIN1: '', THONGTIN2: '' }];
    function sv(id, ma, ho, ten, khoaSV, khoaHP, hp, maHP, diem, nop, kq, tt) {
        var so = id.slice(-1);
        return { ID: id, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: ho, QLSV_NGUOIHOC_TEN: ten, QLSV_NGUOIHOC_EMAIL: ma.toLowerCase() + '@sv.truong.edu.vn',
            DAOTAO_KHOAQUANLYSV_TEN: khoaSV, DAOTAO_KHOAQUANLYHP_TEN: khoaHP, TUI: 'T0' + so, SOPHACH: '1' + so + '7', SOBAODANH: '0' + so + '2',
            CATHI_TEN: 'Ca 1', PHONGTHI_TEN: 'A2-301', DAOTAO_HOCPHAN_TEN: hp, DAOTAO_HOCPHAN_MA: maHP, HINHTHUCTHI_TEN: 'Tự luận', NGAYTHI: '12/01/2027',
            DIEM: diem, NGAYXACNHANHOANTHANHDIEMTHI: '20/01/2027', NGAYDANGKYPHUCKHAO: '22/01/2027', NGAYHETHANDANGKYPHUCKHAO: '27/01/2027',
            NGAYHETHANNOPPHIPHUCKHAO: '29/01/2027', PHIPHUCKHAO: 50000, TINHTRANGNOPPHI: nop, KETQUAPHUCKHAO: kq, TINHTRANG_TEN: tt };
    }
    var DS = [
        sv('PK01', 'BIT230101', 'Nguyễn Hoàng', 'An', 'Khoa Công nghệ thông tin', 'Khoa Công nghệ thông tin', 'Cấu trúc dữ liệu và giải thuật', 'IT2030', 4.5, 1, 5.5, 'Đã duyệt'),
        sv('PK02', 'BIT230145', 'Trần Thị Minh', 'Châu', 'Khoa Công nghệ thông tin', 'Khoa Khoa học cơ bản', 'Toán cao cấp 2', 'MA1020', 3.8, 1, '', 'Chờ bổ sung'),
        sv('PK03', 'BBA230212', 'Lê Quốc', 'Dũng', 'Khoa Quản trị kinh doanh', 'Khoa Quản trị kinh doanh', 'Nguyên lý kế toán', 'AC1010', 5, 0, '', ''),
        sv('PK04', 'BBA230260', 'Phạm Thu', 'Hà', 'Khoa Quản trị kinh doanh', 'Khoa Khoa học cơ bản', 'Xác suất thống kê', 'MA1030', 6.2, 1, 6.2, 'Không duyệt'),
        sv('PK05', 'BFL230033', 'Vũ Ngọc', 'Lan', 'Khoa Ngoại ngữ', '', 'Tiếng Anh 3', 'EN1030', 4, 0, '', '')
    ];
    var TH = [
        { ID: 'TH01', TEN: 'Đợt thi chính học kỳ 1', MA: 'DT_HK1_CHINH', NGAYBATDAU: '21/01/2027', NGAYKETTHUC: '27/01/2027', NGAYHETHANTHUPHI: '29/01/2027',
            NGAYTAO_DD_MM_YYYY: '15/01/2027', NGUOITAO_TAIKHOAN: 'khaothi01', PHAMVIAPDUNG_ID: 'DT1' },
        { ID: 'TH02', TEN: 'Đợt thi phụ học kỳ 1', MA: 'DT_HK1_PHU', NGAYBATDAU: '01/03/2027', NGAYKETTHUC: '07/03/2027', NGAYHETHANTHUPHI: '09/03/2027',
            NGAYTAO_DD_MM_YYYY: '20/02/2027', NGUOITAO_TAIKHOAN: 'khaothi01', PHAMVIAPDUNG_ID: 'DT2' }
    ];
    ums.demo.add({
        'TP_PhucKhao/LayThoiGianTheoDotThi': TG,
        'TP_PhucKhao/LayHocPhanPhucKhao': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'Cấu trúc dữ liệu và giải thuật' }, { ID: 'HP2', TEN: 'Toán cao cấp 2' }, { ID: 'HP3', TEN: 'Nguyên lý kế toán' }] : [];
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#THI.PHUCKHAO.TINHTRANG': TT,
        'pkg_thi_phach_phuckhao.LayDSThiPhucKhao': function (o) {
            return DS.filter(function (x) {
                if (String(o.strTinhTrangNopPhi) === '1' && x.TINHTRANGNOPPHI !== 1) return false;
                if (String(o.strTinhTrangNopPhi) === '0' && x.TINHTRANGNOPPHI === 1) return false;
                if (Number(o.dChuaCoTrangThaiDuyetNao) === 1 && x.TINHTRANG_TEN) return false;
                return true;
            });
        },
        'TP_PhucKhao/LayDSThi_PhucKhao_XacNhan': [
            { ID: 'LS1', TINHTRANG_TEN: 'Chờ bổ sung', NOIDUNG: 'Thiếu minh chứng nộp phí', NGUOIXACNHAN_TENDAYDU: 'Đỗ Thị Hạnh', NGAYTAO_DD_MM_YYYY: '23/01/2027' },
            { ID: 'LS2', TINHTRANG_TEN: 'Đã duyệt', NOIDUNG: '', NGUOIXACNHAN_TENDAYDU: 'Đỗ Thị Hạnh', NGAYTAO_DD_MM_YYYY: '25/01/2027' }],
        'TP_PhucKhao/Them_Thi_PhucKhao_XacNhan': [],
        'TP_Chung/LayThoiGian': TG,
        'TP_Chung/LayDotThi': [{ ID: 'DT1', TEN: 'Đợt thi chính học kỳ 1' }, { ID: 'DT2', TEN: 'Đợt thi phụ học kỳ 1' }, { ID: 'DT3', TEN: 'Đợt thi cải thiện điểm' }],
        'PKG_THI_PHACH_PHUCKHAO.LayDSThi_PhucKhao_TG_Ad': function () { return TH.slice(); },
        'PKG_THI_PHACH_PHUCKHAO.Them_Thi_PhucKhao_TG_Ad': function (o) {
            var r = TH.filter(function (x) { return x.ID === o.strId; })[0];
            if (!r) {
                r = { ID: 'TH0' + (TH.length + 1), TEN: 'Đợt thi ' + o.strPhamViApDung_Id, MA: o.strPhamViApDung_Id, NGAYTAO_DD_MM_YYYY: '28/09/2026',
                    NGUOITAO_TAIKHOAN: 'khaothi01', PHAMVIAPDUNG_ID: o.strPhamViApDung_Id };
                TH.push(r);
            }
            r.NGAYBATDAU = o.strNgayBatDau; r.NGAYKETTHUC = o.strNgayKetThuc; r.NGAYHETHANTHUPHI = o.strNgayHetHanThuPhi;
            return [];
        }
    });
})();
