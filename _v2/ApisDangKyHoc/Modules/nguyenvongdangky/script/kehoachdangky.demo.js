/* Dữ liệu mẫu cho kehoachdangky (Kế hoạch nguyện vọng) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten, bang) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: bang }; }
    var KH = [
        { ID: 'KHNV01', MAKEHOACH: 'NV2025-1', TENKEHOACH: 'Nguyện vọng học lại, học cải thiện HK1 2025-2026', NGAYBATDAU: '01/08/2025',
          GIODANGKYTRONGNGAYDAU: 8, PHUTDANGKYTRONGNGAYDAU: 0, NGAYKETTHUC: '15/08/2025', GIOKETTHUCTRONGNGAYCUOI: 17, PHUTKETTHUCTRONGNGAYCUOI: 30,
          SOLUONGDUKIEN: 1200, SOLUONGDADANGKY: 846, TYLE: '70.5%', HIEULUC: 1, KIEUHOC_TEN: 'Học lại, Học cải thiện',
          SOTINCHITOIDA: 12, DAOTAO_THOIGIANDAOTAO_ID: 'TG20251', KIEUHOC_IDS: 'KDK_HL,KDK_ND', TRANGTHAI_ID: 'CD_SV',
          TRANGTHAISINHVIEN_IDS: 'TT1,TT2' },
        { ID: 'KHNV02', MAKEHOACH: 'NV2025-H', TENKEHOACH: 'Nguyện vọng học kỳ phụ hè 2025', NGAYBATDAU: '20/05/2025',
          GIODANGKYTRONGNGAYDAU: 7, PHUTDANGKYTRONGNGAYDAU: 30, NGAYKETTHUC: '05/06/2025', GIOKETTHUCTRONGNGAYCUOI: 23, PHUTKETTHUCTRONGNGAYCUOI: 59,
          SOLUONGDUKIEN: 600, SOLUONGDADANGKY: 612, TYLE: '102%', HIEULUC: 0, KIEUHOC_TEN: 'Học đi',
          SOTINCHITOIDA: 9, DAOTAO_THOIGIANDAOTAO_ID: 'TG2024H', KIEUHOC_IDS: 'KDK_HD', TRANGTHAI_ID: 'CD_CB',
          TRANGTHAISINHVIEN_IDS: 'TT1' },
        { ID: 'KHNV03', MAKEHOACH: 'NV2026-1', TENKEHOACH: 'Nguyện vọng mở lớp HK2 2025-2026', NGAYBATDAU: '10/12/2025',
          GIODANGKYTRONGNGAYDAU: 8, PHUTDANGKYTRONGNGAYDAU: 0, NGAYKETTHUC: '24/12/2025', GIOKETTHUCTRONGNGAYCUOI: 17, PHUTKETTHUCTRONGNGAYCUOI: 0,
          SOLUONGDUKIEN: 1500, SOLUONGDADANGKY: 0, TYLE: '0%', HIEULUC: 1, KIEUHOC_TEN: '',
          SOTINCHITOIDA: 25, DAOTAO_THOIGIANDAOTAO_ID: 'TG20252', KIEUHOC_IDS: null, TRANGTHAI_ID: 'CD_KHOA',
          TRANGTHAISINHVIEN_IDS: null }
    ];
    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'TG2024H', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè 2024-2025' },
            { ID: 'TG20251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026' },
            { ID: 'TG20252', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2025-2026' }
        ],
        'DKH_KeHoachDangKyNV/LayDanhSach': function (o) {
            var rows = KH.filter(function (r) {
                return (!o.strDaoTao_ThoiGianDaoTao_Id || r.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id) &&
                    (!o.strTuKhoa || (r.MAKEHOACH + ' ' + r.TENKEHOACH).toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0);
            });
            return { rows: rows, pager: rows.length };
        },
        'DKH_KeHoachDangKyNV/ThemMoi': { rows: [], raw: { Id: 'KHNVMOI' } },
        'DKH_KeHoachDangKyNV/CapNhat': [],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC': [
            dm('KDK_HD', 'HocDi', 'Dành cho học đi', 'Kiểu học'), dm('KDK_HL', 'HocLai', 'Dành cho học lại', 'Kiểu học'),
            dm('KDK_ND', 'HocNangDiem', 'Dành cho học nâng điểm', 'Kiểu học')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.CHEDO': [
            dm('CD_KHOA', '1', 'Khóa không cho đăng ký', 'Chế độ đăng ký'), dm('CD_CB', '2', 'Chỉ mở cho cán bộ đăng ký', 'Chế độ đăng ký'),
            dm('CD_SV', '3', 'Chỉ mở cho sinh viên đăng ký', 'Chế độ đăng ký')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.DIEMCHU': [
            dm('DC_A', 'A', 'A', 'Điểm chữ'), dm('DC_B', 'B', 'B', 'Điểm chữ'), dm('DC_C', 'C', 'C', 'Điểm chữ'),
            dm('DC_D', 'D', 'D', 'Điểm chữ'), dm('DC_F', 'F', 'F', 'Điểm chữ')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.NGUYENVONG.QUYMO': [
            dm('QM_20', 'QM20', 'Lớp từ 20 sinh viên', 'Quy mô lớp'), dm('QM_40', 'QM40', 'Lớp từ 40 sinh viên', 'Quy mô lớp'),
            dm('QM_80', 'QM80', 'Lớp từ 80 sinh viên', 'Quy mô lớp')
        ],
        'DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach': function (o) {
            return o.strKeHoachNguyenVong_Id ? [{ ID: 'KHOCLAI', TEN: 'Học lại' }, { ID: 'KHOCCT', TEN: 'Học cải thiện' }] : [];
        },
        'DKH_GioiHan_KieuHoc/LayDanhSach': function (o) {
            return o.strDangKy_KeHoachDangKy_Id === 'KHNV01'
                ? [{ ID: 'GHKH01', KIEUHOC_ID: 'KHOCLAI', DIEMQUYDOI_ID: 'DC_F' }, { ID: 'GHKH02', KIEUHOC_ID: 'KHOCCT', DIEMQUYDOI_ID: 'DC_D' }] : [];
        },
        'DKH_NguyenVong/LayDSDangKy_NV_PC_HocPhan': function (o) {
            return o.strDangKy_KeHoachDangKy_Id === 'KHNV01' ? [
                { ID: 'PVHP01', DAOTAO_HOCPHAN_MA: 'MA1011', DAOTAO_HOCPHAN_TEN: 'Giải tích 1' },
                { ID: 'PVHP02', DAOTAO_HOCPHAN_MA: 'PH1011', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương 1' },
                { ID: 'PVHP03', DAOTAO_HOCPHAN_MA: 'EN1002', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh cơ bản 2' }] : [];
        },
        'DKH_NguyenVong/LayDSQuyMoLopDangKy': function (o) {
            return o.strDangKy_NguyenVong_Id === 'KHNV01' ? [{ ID: 'QMKH01', QUYMOLOP_ID: 'QM_40' }] : [];
        }
    });
})();
