/* Dữ liệu mẫu cho Phân lớp (nhập học) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var ds = [
        { ID: 'TTTS01', HODEM: 'Nguyễn Văn', TEN: 'An', SOBAODANH: 'HN260101', MASO: '', ANH: '', DANHAPHOC: 0, SODANHAPHOC: 212,
          NGAYSINH_NGAY: '12', NGAYSINH_THANG: '03', NGAYSINH_NAM: '2008', SODIENTHOAICANHAN: '0912345678',
          HOKHAU_PHUONGXAKHOIXOM: 'Dịch Vọng', HOKHAU_QUANHUYEN_TEN: 'Cầu Giấy', HOKHAU_TINHTHANH_TEN: 'Hà Nội',
          DAOTAO_NGANHNHAPHOC: 'Kỹ thuật phần mềm', DIEMTS_TONGDIEM: 25.5, DOITUONGDUTHI_TEN: 'Không ưu tiên', PHANTRAMMIENGIAM: 0,
          NGANHHOC_TEN: 'Kỹ thuật phần mềm', KHUVUC_TEN: 'KV3', CMTND_SO: '001208012345', MALOPDUKIEN: 'K68KTPM1',
          DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', DAOTAO_LOPQUANLY_TEN: '', DAOTAO_LOPQUANLY_MA: '' },
        { ID: 'TTTS02', HODEM: 'Trần Thị', TEN: 'Bình', SOBAODANH: 'HN260102', MASO: '2601002', ANH: '', DANHAPHOC: 1, SODANHAPHOC: 212,
          NGAYSINH_NGAY: '05', NGAYSINH_THANG: '11', NGAYSINH_NAM: '2008', SODIENTHOAICANHAN: '0987654321',
          HOKHAU_PHUONGXAKHOIXOM: 'Láng Hạ', HOKHAU_QUANHUYEN_TEN: 'Đống Đa', HOKHAU_TINHTHANH_TEN: 'Hà Nội',
          DAOTAO_NGANHNHAPHOC: 'Quản trị kinh doanh', DIEMTS_TONGDIEM: 24.25, DOITUONGDUTHI_TEN: 'Ưu tiên 1', PHANTRAMMIENGIAM: 50,
          NGANHHOC_TEN: 'Quản trị kinh doanh', KHUVUC_TEN: 'KV2', CMTND_SO: '001308099887', MALOPDUKIEN: '',
          DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTQTKD', DAOTAO_LOPQUANLY_TEN: 'K68-QTKD1', DAOTAO_LOPQUANLY_MA: 'K68QTKD1' },
        { ID: 'TTTS03', HODEM: 'Lê Hoàng', TEN: 'Cường', SOBAODANH: 'HN260103', MASO: '', ANH: '', DANHAPHOC: 0, SODANHAPHOC: 212,
          NGAYSINH_NGAY: '21', NGAYSINH_THANG: '07', NGAYSINH_NAM: '2008', SODIENTHOAICANHAN: '0977111222',
          HOKHAU_PHUONGXAKHOIXOM: 'Hưng Dũng', HOKHAU_QUANHUYEN_TEN: 'TP Vinh', HOKHAU_TINHTHANH_TEN: 'Nghệ An',
          DAOTAO_NGANHNHAPHOC: 'Kỹ thuật phần mềm', DIEMTS_TONGDIEM: 23, DOITUONGDUTHI_TEN: 'Không ưu tiên', PHANTRAMMIENGIAM: 0,
          NGANHHOC_TEN: 'Kỹ thuật phần mềm', KHUVUC_TEN: 'KV2-NT', CMTND_SO: '040208055661', MALOPDUKIEN: '',
          DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', DAOTAO_LOPQUANLY_TEN: '', DAOTAO_LOPQUANLY_MA: '' },
        { ID: 'TTTS04', HODEM: 'Phạm Minh', TEN: 'Dũng', SOBAODANH: 'HN260104', MASO: '', ANH: '', DANHAPHOC: 0, SODANHAPHOC: 212,
          NGAYSINH_NGAY: '30', NGAYSINH_THANG: '01', NGAYSINH_NAM: '2008', SODIENTHOAICANHAN: '0903222333',
          HOKHAU_PHUONGXAKHOIXOM: 'Lê Lợi', HOKHAU_QUANHUYEN_TEN: 'Ngô Quyền', HOKHAU_TINHTHANH_TEN: 'Hải Phòng',
          DAOTAO_NGANHNHAPHOC: 'Quản trị kinh doanh', DIEMTS_TONGDIEM: 22.75, DOITUONGDUTHI_TEN: 'Không ưu tiên', PHANTRAMMIENGIAM: 0,
          NGANHHOC_TEN: 'Quản trị kinh doanh', KHUVUC_TEN: 'KV3', CMTND_SO: '031208044455', MALOPDUKIEN: '',
          DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTQTKD', DAOTAO_LOPQUANLY_TEN: '', DAOTAO_LOPQUANLY_MA: '' }
    ];
    var rut = [
        { ID: 'RUT1', QLSV_NGUOIHOC_MASO: '2601019', QLSV_NGUOIHOC_HODEM: 'Đỗ Thu', QLSV_NGUOIHOC_TEN: 'Hà', DAOTAO_LOPQUANLY_MA: 'K68KTPM2',
          DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', NGAYTAO_DD_MM_YYYY_HHMMSS: '18/09/2026 09:12:40', NGUOITHUCHIEN_TAIKHOAN: 'phongdaotao' }
    ];
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS': function (o) {
            if (o.strTaiChinh_KeHoach_Id === 'xxx') return [];
            var q = String(o.strTuKhoa || '').toLowerCase();
            return ds.filter(function (r) {
                if (String(o.dDaNhapHoc) === '0' && String(r.DANHAPHOC) === '1') return false;
                if (String(o.dDaNhapHoc) === '1' && String(r.DANHAPHOC) !== '1') return false;
                return !q || (r.HODEM + ' ' + r.TEN + ' ' + r.SOBAODANH).toLowerCase().indexOf(q) >= 0;
            });
        },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': function (o) {
            return [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }];
        },
        'pkg_hosohocvien.LayDanhSachHoSo': function (o) {
            return [
                { ID: 'SV1', QLSV_NGUOIHOC_MASO: '2601002', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình' },
                { ID: 'SV2', QLSV_NGUOIHOC_MASO: '2601007', QLSV_NGUOIHOC_HODEM: 'Vũ Đức', QLSV_NGUOIHOC_TEN: 'Giang' }
            ];
        },
        'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_PhanLop_ThuCong': [],
        'NH_NguoiHoc_ThongTinTuyenSinh/Xoa': [],
        'NH_NguoiHoc_ThongTinTuyenSinh/LayChiTiet': function (o) { return ds.filter(function (r) { return r.ID === o.strId; }); },
        'NH_RutHoSo/LayDSNhapHoc_RutHoSo_TT': function () { return rut; },
        'NH_RutHoSo/Them_NhapHoc_RutHoSo_TT': []
    });
})();
