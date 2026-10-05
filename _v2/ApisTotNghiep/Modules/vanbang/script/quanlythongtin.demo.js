/* Dữ liệu mẫu cho Quản lý thông tin văn bằng (Tốt nghiệp) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var SV = [
        ['VB01', 'SV1', 'SV20001', 'Nguyễn Văn', 'An', 'NGUYEN VAN', 'AN', '12', '03', '2002', 'Nam', 'Male', 'Kinh', 'Hà Nội', 'Kỹ thuật phần mềm', 'Software Engineering', 'XL1', 'QH-2026-001', '0012/VB', '215/QĐ-ĐHKT', '20/06/2026', '25/06/2026', '26/06/2026', 0, 'K67 Kỹ thuật phần mềm 1'],
        ['VB02', 'SV2', 'SV20014', 'Trần Thị', 'Bình', 'TRAN THI', 'BINH', '05', '07', '2002', 'Nữ', 'Female', 'Kinh', 'Nam Định', 'Kỹ thuật phần mềm', 'Software Engineering', 'XL2', 'QH-2026-002', '0013/VB', '215/QĐ-ĐHKT', '20/06/2026', '25/06/2026', '26/06/2026', 1250000, 'K67 Kỹ thuật phần mềm 1'],
        ['VB03', 'SV3', 'SV20027', 'Lê Hoàng', 'Cường', 'LE HOANG', 'CUONG', '21', '11', '2002', 'Nam', 'Male', 'Tày', 'Lạng Sơn', 'Quản trị kinh doanh', 'Business Administration', 'XL3', '', '', '', '', '', '', 0, 'K67 Quản trị kinh doanh 1'],
        ['VB04', 'SV4', 'SV20031', 'Phạm Thu', 'Dung', 'PHAM THU', 'DUNG', '02', '01', '2003', 'Nữ', 'Female', 'Kinh', 'Thái Bình', 'Quản trị kinh doanh', 'Business Administration', 'XL2', '', '', '', '', '', '', 0, 'K67 Quản trị kinh doanh 1'],
        ['VB05', 'SV5', 'SV20045', 'Hoàng Minh', 'Đức', 'HOANG MINH', 'DUC', '14', '09', '2002', 'Nam', 'Male', 'Mường', 'Hòa Bình', 'Hệ thống thông tin', 'Information Systems', 'XL1', 'QH-2026-005', '', '215/QĐ-ĐHKT', '20/06/2026', '', '', 3400000, 'K67 Hệ thống thông tin 1']
    ];
    var XL = { XL1: ['Giỏi', 'Very good'], XL2: ['Khá', 'Good'], XL3: ['Trung bình', 'Average'] };
    var ROWS = SV.map(function (x) {
        return { ID: x[0], QLSV_NGUOIHOC_ID: x[1], QLSV_NGUOIHOC_MASO: x[2], QLSV_NGUOIHOC_HODEM: x[3], QLSV_NGUOIHOC_TEN: x[4],
            QLSV_NGUOIHOC_HODEM_TA: x[5], QLSV_NGUOIHOC_TEN_TA: x[6], QLSV_NGUOIHOC_NGAYSINH: x[7], QLSV_NGUOIHOC_THANGSINH: x[8],
            QLSV_NGUOIHOC_NAMSINH: x[9], QLSV_NGUOIHOC_NGAYSINH_TA: x[7], QLSV_NGUOIHOC_THANGSINH_TA: x[8], QLSV_NGUOIHOC_NAMSINH_TA: x[9],
            NGAYSINHDAYDU: x[7] + '/' + x[8] + '/' + x[9], NGAYSINHDAYDU_TA: x[8] + '/' + x[7] + '/' + x[9],
            QLSV_NGUOIHOC_GIOITINH: x[10], QLSV_NGUOIHOC_GIOITINH_TA: x[11], QLSV_NGUOIHOC_DANTOC: x[12], QLSV_NGUOIHOC_DANTOC_TA: '',
            QLSV_NGUOIHOC_NOISINH: x[13], QLSV_NGUOIHOC_NOISINH_TA: '', QLSV_NGUOIHOC_NGANHNGHE: x[14], QLSV_NGUOIHOC_NGANHNGHE_TA: x[15],
            QLSV_NGUOIHOC_ONGBA: x[10] === 'Nam' ? 'Ông' : 'Bà', QLSV_NGUOIHOC_ONGBA_TA: x[10] === 'Nam' ? 'Mr.' : 'Ms.',
            XEPLOAI_ID: x[16], QLSV_NGUOIHOC_XEPLOAI_TA: XL[x[16]][1], PHANLOAI_ID: 'PL1',
            PHOI_NGUOIHOC_NHAPTRUCTIEP_ID: 'PHOI01', PHOI_NGUOIHOC_NHAP_BANSAO_ID: 'PHOI11', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM',
            SOHIEUBANG: x[17], SOVAOSOCAPBANG: x[18], SOQUYETDINH: x[19], NGAYQUYETDINH: x[20], NGAYKYBANG: x[21], NGAYVAOSOCAPBANG: x[22],
            NGAYCAPBANGOC: '', THONGTINHOIDONGTHICHUNGCHI: '', TONGNOPHI: x[23], DAOTAO_LOPQUANLY_TEN: x[24],
            DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DUONGDANANHCANHAN: '' };
    });
    var TT = [
        { ID: 'XN1', MA: 'DUYET', TEN: 'Duyệt', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #16a34a', CHUNG_TENDANHMUC_TEN: 'Xác nhận văn bằng' },
        { ID: 'XN2', MA: 'KHONGDUYET', TEN: 'Không duyệt', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc2626', CHUNG_TENDANHMUC_TEN: 'Xác nhận văn bằng' },
        { ID: 'XN3', MA: 'BOSUNG', TEN: 'Yêu cầu bổ sung', THONGTIN1: 'fa fa-exclamation-circle', THONGTIN2: 'color: #d97706', CHUNG_TENDANHMUC_TEN: 'Xác nhận văn bằng' }
    ];
    var fx = {};
    fx[D + 'TN.XACNHANVANBANG'] = TT;
    fx[D + 'TN.THONGTINVANBANG.SAPXEP'] = [
        { ID: 'SX1', MA: 'MASO', TEN: 'Theo mã số', CHUNG_TENDANHMUC_TEN: 'Tiêu chí sắp xếp' },
        { ID: 'SX2', MA: 'TEN', TEN: 'Theo tên (A → Z)', CHUNG_TENDANHMUC_TEN: 'Tiêu chí sắp xếp' },
        { ID: 'SX3', MA: 'LOP', TEN: 'Theo lớp', CHUNG_TENDANHMUC_TEN: 'Tiêu chí sắp xếp' }
    ];
    fx['TN_Chung/LayDSPhanLoaiTheoNguoiDung'] = [
        { ID: 'PL1', MA: 'TN', TEN: 'Xét tốt nghiệp' },
        { ID: 'PL2', MA: 'CC', TEN: 'Cấp chứng chỉ' }
    ];
    fx['TN_VanBang_ChungChi_Chung/LayDSXepLoaiTheoPhanLoai'] = function (o) {
        return o.strPhanLoai_Id ? Object.keys(XL).map(function (k) { return { ID: k, TEN: XL[k][0] }; }) : [];
    };
    fx['TN_KetQua_CongNhan_VB/LayDSQD_KetQua_CongNhan_VB'] = [{ ID: 'QD1', TEN: '215/QĐ-ĐHKT' }, { ID: 'QD2', TEN: '198/QĐ-ĐHKT' }];
    fx['TN_VanBang_ChungChi/LayDSTN_KetQua_CongNhan_VB'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var rs = ROWS.filter(function (r) {
            return (!q || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0) &&
                (!o.strSoQuyetDinh || r.SOQUYETDINH === o.strSoQuyetDinh);
        });
        var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
        return { rows: rs.slice((pi - 1) * sz, pi * sz), pager: rs.length };
    };
    fx['TN_KetQua_CongNhan_VB/CapNhat'] = function (o) {
        ROWS.forEach(function (r) {
            if (r.ID !== o.strId) return;
            r.SOQUYETDINH = o.strSoQuyetDinh; r.NGAYQUYETDINH = o.strNgayQuyetDinh; r.SOHIEUBANG = o.strSoHieuBang;
            r.SOVAOSOCAPBANG = o.strSoVaoSoCapBang; r.NGAYKYBANG = o.strNgayKyBang;
        });
        return [];
    };
    fx['TN_KetQua_CongNhan_VB/ThemMoi'] = { rows: [], message: '' };
    fx['TN_KetQua_CongNhan_VB/Xoa'] = [];
    var n = 20;
    fx['TN_KetQua_CongNhan_VB/SinhSoHieuVanBang'] = function (o) {
        ROWS.forEach(function (r) { if (r.ID === o.strTN_KetQua_CongNhan_VB_Id && !r.SOHIEUBANG) r.SOHIEUBANG = 'QH-2026-0' + (n++); });
        return [];
    };
    fx['TN_KetQua_CongNhan_VB/SinhSoVaoSo'] = function (o) {
        ROWS.forEach(function (r) { if (r.ID === o.strTN_KetQua_CongNhan_VB_Id && !r.SOVAOSOCAPBANG) r.SOVAOSOCAPBANG = '00' + (n++) + '/VB'; });
        return [];
    };
    fx['PKG_VANBANG_CHUNGCHI.SinhQuyetDinh'] = [];
    fx['TN_VanBang_XacNhanIn/ThemMoi'] = [];
    fx['TN_VanBang_XacNhanIn/LayDanhSach'] = [
        { TINHTRANG_TEN: 'Yêu cầu bổ sung', NOIDUNG: 'Bổ sung bản sao giấy khai sinh', NGUOIQuanLyThongTin_TENDAYDU: 'Lê Thu Hà', NGAYTAO_DD_MM_YYYY: '18/06/2026' },
        { TINHTRANG_TEN: 'Duyệt', NOIDUNG: 'Hồ sơ đầy đủ', NGUOIQuanLyThongTin_TENDAYDU: 'Lê Thu Hà', NGAYTAO_DD_MM_YYYY: '22/06/2026' }
    ];
    /* Thêm mới: tìm sinh viên → chương trình → thông tin in */
    fx['SV_HoSo/LayChiTiet'] = function (o) {
        var m = String(o.strId || '').toUpperCase();
        return m === 'SV20099' ? [{ ID: 'SV9', MASO: 'SV20099', HODEM: 'Vũ Thị', TEN: 'Hạnh' }]
            : ROWS.filter(function (r) { return r.QLSV_NGUOIHOC_MASO === m; }).map(function (r) {
                return { ID: r.QLSV_NGUOIHOC_ID, MASO: r.QLSV_NGUOIHOC_MASO, HODEM: r.QLSV_NGUOIHOC_HODEM, TEN: r.QLSV_NGUOIHOC_TEN };
            });
    };
    fx['DKH_Chung/LayDSChuongTrinh'] = [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm - Khóa 67' }];
    fx['TN_KetQua_CongNhan_VB/LayTTTN_KetQua_CongNhan_VB'] = function (o) {
        return ROWS.filter(function (r) { return r.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id; });
    };
    fx['TN_KetQua_CongNhan_VB/KeThuaTTTN_KetQua_CongNhan_VB'] = function (o) {
        if (o.strQLSV_NguoiHoc_Id !== 'SV9') return ROWS.filter(function (r) { return r.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id; });
        return [{ ID: '', QLSV_NGUOIHOC_ID: 'SV9', QLSV_NGUOIHOC_MASO: 'SV20099', QLSV_NGUOIHOC_HODEM: 'Vũ Thị', QLSV_NGUOIHOC_TEN: 'Hạnh',
            QLSV_NGUOIHOC_HODEM_TA: 'VU THI', QLSV_NGUOIHOC_TEN_TA: 'HANH', QLSV_NGUOIHOC_NGAYSINH: '08', QLSV_NGUOIHOC_THANGSINH: '04',
            QLSV_NGUOIHOC_NAMSINH: '2003', QLSV_NGUOIHOC_GIOITINH: 'Nữ', QLSV_NGUOIHOC_GIOITINH_TA: 'Female', QLSV_NGUOIHOC_DANTOC: 'Kinh',
            QLSV_NGUOIHOC_NOISINH: 'Hải Phòng', QLSV_NGUOIHOC_NGANHNGHE: 'Kỹ thuật phần mềm', QLSV_NGUOIHOC_NGANHNGHE_TA: 'Software Engineering',
            XEPLOAI_ID: 'XL2', QLSV_NGUOIHOC_XEPLOAI_TA: 'Good', PHANLOAI_ID: 'PL1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM',
            NGAYSINHDAYDU: '08/04/2003', NGAYSINHDAYDU_TA: '04/08/2003' }];
    };
    fx['TN_VanBang_BanSao/LayDanhSach'] = function (o) {
        return o.strQLSV_NguoiHoc_Id === 'SV1' ? [{ ID: 'BS01', THUTU: 1, DAIN: 1, SOVAOSOCAPBANSAO: 'BS-0012/01' }] : [];
    };
    fx['TN_VanBang_BanSao/ThemMoi'] = { rows: [], message: '' };
    fx['TN_VanBang_BanSao/CapNhat'] = [];
    fx['TN_VanBang_BanSao/Xoa'] = [];
    /* Gán số vào sổ trực tiếp (gốc 1/10) */
    fx['PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoVaoSo_Ad'] = [
        { ID: 'QT01', TEN: 'Số vào sổ bằng đại học chính quy' }, { ID: 'QT02', TEN: 'Số vào sổ bằng thạc sĩ' }
    ];
    fx['PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_LayDanhSach'] = [
        { ID: 'SVS0003', CHISO: 3, SOCHUNGTU: 'DHCQ-2026-0003', HETHONGCHUNGTU_MA: 'SVS-DHCQ', NGAYTHUCHIEN: '21/06/2026', NAMTHUCHIEN: '2026', IS_NHAP_THUCONG: 0, DA_SU_DUNG: 0 },
        { ID: 'SVS0002', CHISO: 2, SOCHUNGTU: 'DHCQ-2026-0002', HETHONGCHUNGTU_MA: 'SVS-DHCQ', NGAYTHUCHIEN: '20/06/2026', NAMTHUCHIEN: '2026', IS_NHAP_THUCONG: 0, DA_SU_DUNG: 1 },
        { ID: 'SVS0004', CHISO: 15, SOCHUNGTU: 'DHCQ-2026-0015', HETHONGCHUNGTU_MA: 'SVS-DHCQ', NGAYTHUCHIEN: '25/06/2026', NAMTHUCHIEN: '2026', IS_NHAP_THUCONG: 1, DA_SU_DUNG: 0 }
    ];
    fx['PKG_VANBANG_CHUNGCHI.GanSoVaoSoTrucTiep'] = [];
    ums.demo.add(fx);
})();
