/* Dữ liệu mẫu cho lophocphan (Xác định phạm vi dữ liệu lớp HP) — chỉ dùng ở chế độ dựng thử. Khoá = tên func khi có func;
   bộ lọc Thời gian / KH tổng hợp / KH chi tiết đã có ở _tkgg.demo.js (ums.demo.tkgg). */
(function () {
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var seq = 10;
    var LHP = [
        { ID: 'DL1', KLGD_KEHOACHCHITIET_ID: 'CT1', DAOTAO_HOCPHAN_ID: 'HP1', DULIEUXACNHAN: 'LHP1', DAOTAO_LOPHOCPHAN_ID: 'LHP1', DAOTAO_HOCPHAN_MA: 'MAT101', DAOTAO_HOCPHAN_TEN: 'Toán cao cấp A1',
            DAOTAO_LOPHOCPHAN_TEN: 'MAT101.01', HINHTHUCHOC_MA: 'LT', GIANGVIEN_ID: 'NS1,NS2', GIANGVIEN: 'Nguyễn Văn Hùng,Trần Thị Mai', TTPHANBOTHEOCTDT: '3 (2/1)',
            TONGSOTIETTKBMO: 45, TONGSOTIETGIANG: 45, TONGSOTIETGIANGXACNHAN: 45, NAMHOC: '2025-2026', HOCKY: '1', DOTHOC: 'Đợt 1', NGAYBATDAU: '08/09/2025', NGAYKETTHUC: '20/12/2025',
            DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', QUYMO: 62, SOLUONGAPDAT: '', TONGSOGIOCHUAN: 52.5, KHOADULIEU: '0', KHONGTINHTHEOTKB: 0 },
        { ID: 'DL2', KLGD_KEHOACHCHITIET_ID: 'CT1', DAOTAO_HOCPHAN_ID: 'HP2', DULIEUXACNHAN: 'LHP2', DAOTAO_LOPHOCPHAN_ID: 'LHP2', DAOTAO_HOCPHAN_MA: 'PHY101', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương',
            DAOTAO_LOPHOCPHAN_TEN: 'PHY101.02', HINHTHUCHOC_MA: 'LT', GIANGVIEN_ID: 'NS3', GIANGVIEN: 'Lê Quang Minh', TTPHANBOTHEOCTDT: '3 (3/0)',
            TONGSOTIETTKBMO: 45, TONGSOTIETGIANG: 42, TONGSOTIETGIANGXACNHAN: 30, NAMHOC: '2025-2026', HOCKY: '1', DOTHOC: 'Đợt 1', NGAYBATDAU: '08/09/2025', NGAYKETTHUC: '20/12/2025',
            DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', QUYMO: 48, SOLUONGAPDAT: 50, TONGSOGIOCHUAN: 44, KHOADULIEU: '1', KHONGTINHTHEOTKB: 1 },
        { ID: 'DL3', KLGD_KEHOACHCHITIET_ID: 'CT1', DAOTAO_HOCPHAN_ID: 'HP1', DULIEUXACNHAN: 'LHP3', DAOTAO_LOPHOCPHAN_ID: 'LHP3', DAOTAO_HOCPHAN_MA: 'MAT101', DAOTAO_HOCPHAN_TEN: 'Toán cao cấp A1',
            DAOTAO_LOPHOCPHAN_TEN: 'MAT101.02', HINHTHUCHOC_MA: 'TH', GIANGVIEN_ID: 'NS2', GIANGVIEN: 'Trần Thị Mai', TTPHANBOTHEOCTDT: '3 (2/1)',
            TONGSOTIETTKBMO: 30, TONGSOTIETGIANG: 30, TONGSOTIETGIANGXACNHAN: 30, NAMHOC: '2025-2026', HOCKY: '1', DOTHOC: 'Đợt 2', NGAYBATDAU: '05/01/2026', NGAYKETTHUC: '28/02/2026',
            DAOTAO_KHOADAOTAO_TEN: 'Khóa 68', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', QUYMO: 35, SOLUONGAPDAT: '', TONGSOGIOCHUAN: 30, KHOADULIEU: '0', KHONGTINHTHEOTKB: 0 }
    ];
    function ds(o) {
        var rows = LHP.filter(function (r) { return (!o.strKLGD_KeHoachChiTiet_Id || r.KLGD_KEHOACHCHITIET_ID === o.strKLGD_KeHoachChiTiet_Id) && (!o.strDaoTao_HocPhan_Id || r.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id); });
        var i = Number(o.pageIndex) || 1, n = Number(o.pageSize) || 10;
        return { rows: rows.slice((i - 1) * n, i * n), pager: rows.length };
    }
    var BUOI = [
        { ID: 'LG1', KLGD_KEHOACHCHITIET_ID: 'CT1', DAOTAO_LOPHOCPHAN_ID: 'LHP1', MALOP: 'MAT101.01', TENLOP: 'Toán cao cấp A1 - 01', NGAY: '08/09/2025', THU: 'Thứ 2', SOTIET: 3, TIETBATDAU: 1, TIETKETTHUC: 3 },
        { ID: 'LG2', KLGD_KEHOACHCHITIET_ID: 'CT1', DAOTAO_LOPHOCPHAN_ID: 'LHP1', MALOP: 'MAT101.01', TENLOP: 'Toán cao cấp A1 - 01', NGAY: '10/09/2025', THU: 'Thứ 4', SOTIET: 2, TIETBATDAU: 4, TIETKETTHUC: 5 },
        { ID: 'LG3', KLGD_KEHOACHCHITIET_ID: 'CT1', DAOTAO_LOPHOCPHAN_ID: 'LHP1', MALOP: 'MAT101.01', TENLOP: 'Toán cao cấp A1 - 01', NGAY: '15/09/2025', THU: 'Thứ 2', SOTIET: 3, TIETBATDAU: 1, TIETKETTHUC: 3 }
    ];
    var KLCN = [
        { ID: 'KL1', KLGD_KEHOACHCHITIET_ID: 'CT1', LOAI: 'KLGD_DULIEU_LICHGIANG', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', THOIGIAN: 'HK1 2025-2026', DONVI_PHUTRACH_HOCPHAN_TEN: 'Khoa CNTT', TENLOP: 'MAT101.01 - Toán cao cấp A1',
            TONGPHANBO: '3/2/1', PHANLOAI_TEN: 'Giảng dạy', QUYMO: 62, VAITRO_TEN: 'Giảng viên', SOLUONG: 45, SOGIOCHUAN: 52.5, TINHTRANGXACNHAN_TEN: 'Đã duyệt', GHICHU: 'Lịch giảng MAT101.01' },
        { ID: 'KL2', KLGD_KEHOACHCHITIET_ID: 'CT1', LOAI: 'KLGD_DULIEU_HOIDONG', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', THOIGIAN: 'HK1 2025-2026', DONVI_PHUTRACH_HOCPHAN_TEN: 'Khoa CNTT', TENLOP: 'Hội đồng bảo vệ KLTN',
            TONGPHANBO: '', PHANLOAI_TEN: 'Hội đồng', QUYMO: 5, VAITRO_TEN: 'Thư ký', SOLUONG: 1, SOGIOCHUAN: 4, TINHTRANGXACNHAN_TEN: '', GHICHU: '' }
    ];
    ums.demo.add({
        'pkg_klgv_v2_kehoach.LayDSKLGD_DuLieu': ds,
        'TKGG_KeHoach/LayDSKLGD_DuLieu': function (o) { return ds(Object.assign({}, o, { pageSize: 100000 })).rows; },
        'TKGG_KeHoach/LayDSThoiGianTheoKHChiTiet': function (o) { return o.strKLGD_KeHoachChiTiet_Id ? [{ ID: 'DOT1', THOIGIAN: 'Đợt 1 (08/09 - 20/12/2025)' }, { ID: 'DOT2', THOIGIAN: 'Đợt 2 (05/01 - 28/02/2026)' }] : []; },
        'TKGG_KeHoach/LayDSDonViPhuTrachHocPhan': function (o) { return o.strKLGD_KeHoachChiTiet_Id ? [dm('KQL1', 'CNTT', 'Khoa Công nghệ thông tin'), dm('KQL2', 'KT', 'Khoa Kinh tế')] : []; },
        'TKGG_KeHoach/LayDSHocPhan': function (o) { return o.strKLGD_KeHoachChiTiet_Id ? [dm('HP1', 'MAT101', 'Toán cao cấp A1'), dm('HP2', 'PHY101', 'Vật lý đại cương')] : []; },
        'NS_HoSoV2/LayDanhSach': function (o) {
            var rows = [{ ID: 'NS1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001', DVID: 'KQL1' }, { ID: 'NS2', HOTEN: 'Trần Thị Mai', MASO: 'CB015', DVID: 'KQL2' }, { ID: 'NS3', HOTEN: 'Lê Quang Minh', MASO: 'CB102', DVID: 'KQL1' }];
            return rows.filter(function (r) { return !o.strDaoTao_CoCauToChuc_Id || r.DVID === o.strDaoTao_CoCauToChuc_Id; });
        },
        'pkg_klgv_v2_chung.LayDSHinhThucHoc': [{ ID: 'HT1', TENHINHTHUCHOC: 'Lý thuyết', MAHINHTHUCHOC: 'LT' }, { ID: 'HT2', TENHINHTHUCHOC: 'Thực hành', MAHINHTHUCHOC: 'TH' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.PHANLOAIXACNHAN': [dm('PL1', 'KHOA', 'Khoa duyệt'), dm('PL2', 'PDT', 'Phòng ĐT duyệt')],
        /* Khung Thêm mới — Đăng ký học */
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'TGD1', DAOTAO_THOIGIANDAOTAO: '2025-2026_1' }, { ID: 'TGD2', DAOTAO_THOIGIANDAOTAO: '2025-2026_2' }],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': [{ ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }],
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }],
        'DKH_PhanCong_LopHP/LayDSHocPhan': [dm('HP1', 'MAT101', 'Toán cao cấp A1'), dm('HP2', 'PHY101', 'Vật lý đại cương'), dm('HP3', 'ENG101', 'Tiếng Anh 1')],
        'DKH_ThongTin/LayDSLopHocPhan': function (o) {
            var rows = [{ ID: 'LHP4', MALOP: 'ENG101.01', TENLOP: 'Tiếng Anh 1 - 01' }, { ID: 'LHP5', MALOP: 'ENG101.02', TENLOP: 'Tiếng Anh 1 - 02' }, { ID: 'LHP6', MALOP: 'PHY101.03', TENLOP: 'Vật lý đại cương - 03' }];
            return { rows: rows, pager: rows.length };
        },
        'TKGG_KeHoach/Them_KLGD_DuLieu_LopHocPhan': function (o) {
            var id = 'DL' + (seq++);
            LHP.push({ ID: id, KLGD_KEHOACHCHITIET_ID: o.strKLGD_KeHoachChiTiet_Id, DAOTAO_HOCPHAN_ID: 'HP3', DULIEUXACNHAN: o.strDaoTao_LopHocPhan_Id, DAOTAO_LOPHOCPHAN_ID: o.strDaoTao_LopHocPhan_Id,
                DAOTAO_HOCPHAN_MA: 'ENG101', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 1', DAOTAO_LOPHOCPHAN_TEN: o.strDaoTao_LopHocPhan_Id, HINHTHUCHOC_MA: 'LT', GIANGVIEN_ID: '', GIANGVIEN: '', TTPHANBOTHEOCTDT: '',
                TONGSOTIETTKBMO: 0, TONGSOTIETGIANG: 0, TONGSOTIETGIANGXACNHAN: 0, NAMHOC: '2025-2026', HOCKY: '1', DOTHOC: '', NGAYBATDAU: '', NGAYKETTHUC: '', DAOTAO_KHOADAOTAO_TEN: '', DAOTAO_KHOAQUANLY_TEN: '',
                QUYMO: 0, SOLUONGAPDAT: '', TONGSOGIOCHUAN: 0, KHOADULIEU: '0', KHONGTINHTHEOTKB: 0 });
            return { rows: [], raw: { Id: id } };
        },
        'TKGG_KeHoach/Xoa_KLGD_DuLieu_LopHocPhan': function (o) {
            var ids = String(o.strIds || '').split(',');
            for (var i = LHP.length - 1; i >= 0; i--) if (ids.indexOf(LHP[i].ID) >= 0) LHP.splice(i, 1);
            return [];
        },
        'TKGG_TinhToan/ThucHienTaoDuLieuGiang': function () { return []; },
        'PKG_KLGV_V2_TINHTOAN.ThucHienTinhToanKLGD_DuLieu': function () { return []; },
        'TKGG_KeHoach/Them_KLGD_DuLieu_Khoa': function (o) { LHP.forEach(function (r) { if (r.ID === o.strKLGD_DuLieu_Id) r.KHOADULIEU = String(o.dKhoaDuLieu); }); return []; },
        'PKG_KLGV_V2_THONGTIN.Them_KLGD_DuLieu_KhongTKB': function (o) { LHP.forEach(function (r) { if (r.ID === o.strKLGD_DuLieu_Id) r.KHONGTINHTHEOTKB = 1; }); return []; },
        'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_DuLieu_KhongTKB': function (o) { LHP.forEach(function (r) { if (r.ID === o.strKLGD_DuLieu_Id) r.KHONGTINHTHEOTKB = 0; }); return []; },
        /* Áp đặt số lượng */
        'PKG_KLGV_V2_KEHOACH.LayTTKLGD_DuLieu': function (o) {
            return LHP.filter(function (r) { return r.ID === o.strId; }).map(function (r) { return { ID: r.ID, DULIEUXACNHAN_MA: r.DAOTAO_LOPHOCPHAN_TEN, DULIEUXACNHAN_TEN: r.DAOTAO_HOCPHAN_TEN + ' - ' + r.DAOTAO_LOPHOCPHAN_TEN, QUYMO: r.QUYMO, SOLUONGAPDAT: r.SOLUONGAPDAT }; });
        },
        'PKG_KLGV_V2_KEHOACH.Sua_KLGD_DuLieu_SoLuong': function (o) { LHP.forEach(function (r) { if (r.ID === o.strId) { r.SOLUONGAPDAT = o.dSoLuongApDat; r.QUYMO = Number(o.dSoLuongApDat); } }); return []; },
        /* Duyệt buổi học */
        'TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP': function (o) {
            return o.strDaoTao_LopHocPhan_Id === 'LHP1' ? [{ ID: 'NS1', NGUOIDUNG_HODEM: 'Nguyễn Văn', NGUOIDUNG_TEN: 'Hùng', NGUOIDUNG_MASO: 'CB001' }, { ID: 'NS2', NGUOIDUNG_HODEM: 'Trần Thị', NGUOIDUNG_TEN: 'Mai', NGUOIDUNG_MASO: 'CB015' }]
                : [{ ID: 'NS3', NGUOIDUNG_HODEM: 'Lê Quang', NGUOIDUNG_TEN: 'Minh', NGUOIDUNG_MASO: 'CB102' }];
        },
        'TKGG_KeHoach/LayDSDuLieuLichGiangDuyet': function (o) { return BUOI.map(function (b) { return Object.assign({}, b, { DAOTAO_LOPHOCPHAN_ID: o.strDaoTao_LopHocPhan_Id }); }); },
        'TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG': function (o) {
            if (o.strNguoiDung_Id === 'NS2' && o.strKLGD_DuLieu_LichGiang_Id === 'LG2') return [{ COLICH: '0', XACNHANDONGY_KHONGDONGY: '', TINHTRANGDIEMDANH: '' }];
            return [{ COLICH: '1', XACNHANDONGY_KHONGDONGY: o.strKLGD_DuLieu_LichGiang_Id === 'LG3' ? '0' : '1', TINHTRANGDIEMDANH: o.strKLGD_DuLieu_LichGiang_Id === 'LG1' ? '1' : '0' }];
        },
        'TKGG_XacNhan/Them_KLGD_QuanLy_XacNhan': function () { return []; },
        /* Khối lượng cá nhân + chi tiết */
        'TKGG_KeHoach/LayDSDuLieuKLCaNhan': function (o) { return o.strNguoiThucHien_Id ? KLCN : []; },
        'TKGG_ThongTin/LayDSDuLieu_ChiTiet': function (o) {
            if (o.strLoai === 'KLGD_DULIEU_HOIDONG') return { rs: [{ ID: 'CTD3', GIOCHUAN: 4 }], rsThanhPhanCongThuc: [] };
            return { rs: [
                { ID: 'CTD1', NGAY: '08/09/2025', TIETBATDAU: 1, TIETKETTHUC: 3, SOLUONG: 3, QUYMO: 62, DAOTAO_HOCPHAN_TEN: 'Toán cao cấp A1', DAOTAO_HOCPHAN_MA: 'MAT101', DAOTAO_LOPHOCPHAN_TEN: 'MAT101.01', GIOCHUAN: 3.5 },
                { ID: 'CTD2', NGAY: '10/09/2025', TIETBATDAU: 4, TIETKETTHUC: 5, SOLUONG: 2, QUYMO: 62, DAOTAO_HOCPHAN_TEN: 'Toán cao cấp A1', DAOTAO_HOCPHAN_MA: 'MAT101', DAOTAO_LOPHOCPHAN_TEN: 'MAT101.02', GIOCHUAN: 2.3 }],
                rsThanhPhanCongThuc: [{ ID: 'TK1', TUKHOA: 'HS_QUYMO', TENTUKHOA: 'Hệ số quy mô', XAUCONGTHUC: 'SOTIET * HS_QUYMO * HS_HINHTHUC' }, { ID: 'TK2', TUKHOA: 'HS_HINHTHUC', TENTUKHOA: 'Hệ số hình thức', XAUCONGTHUC: 'SOTIET * HS_QUYMO * HS_HINHTHUC' }] };
        },
        'TKGG_ThongTin/LayGiaTriTuKhoa': function (o) { return [{ GIATRITUKHOA: o.strTuKhoa === 'HS_QUYMO' ? '1.2' : '1.0' }]; }
    });
})();
