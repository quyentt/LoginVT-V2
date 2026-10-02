/* Dữ liệu mẫu cho Duyệt hồ sơ (tuyển sinh) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, t1, t2) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: t1 || '', THONGTIN2: t2 || '' }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    var DUYET = [dm('XD1', 'DAT', 'Đạt', 'fa fa-check-circle', 'color:#00a65a'), dm('XD2', 'BOSUNG', 'Cần bổ sung', 'fa fa-exclamation-circle', 'color:#f39c12'),
        dm('XD3', 'KHONGDAT', 'Không đạt', 'fa fa-times-circle', 'color:#dd4b39')];
    fx[DM + 'TUYENSINH.XACNHANDUYETHOSO'] = DUYET;
    fx[DM + 'TUYENSINH.NGANHNGHE'] = [dm('NN1', 'KTPM', 'Kỹ thuật phần mềm'), dm('NN2', 'QTKD', 'Quản trị kinh doanh'), dm('NN3', 'CNOT', 'Công nghệ ô tô')];
    fx[DM + 'TUYENSINH.TRUONGHOC'] = [dm('TH1', 'THPT01', 'THPT Chu Văn An'), dm('TH2', 'THPT02', 'THPT Kim Liên'), dm('TH3', 'THPT03', 'THPT Phan Đình Phùng')];
    fx[DM + 'TUYENSINH.HOCLUC'] = [dm('HL1', 'G', 'Giỏi'), dm('HL2', 'K', 'Khá'), dm('HL3', 'TB', 'Trung bình')];
    fx[DM + 'TUYENSINH.HANHKIEM'] = [dm('HK1', 'T', 'Tốt'), dm('HK2', 'K', 'Khá')];
    fx[DM + 'TUYENSINH.TINHTRANGHOSO'] = [dm('TT1', 'DU', 'Đã nộp đủ'), dm('TT2', 'THIEU', 'Còn thiếu')];
    fx[DM + 'TUYENSINH.LOAIHOSO'] = [dm('LHS1', 'HB', 'Học bạ THPT'), dm('LHS2', 'GKS', 'Giấy khai sinh'), dm('LHS3', 'ANH', 'Ảnh 3x4')];
    fx[DM + 'NS.GITI'] = [dm('GT1', '1', 'Nam'), dm('GT0', '0', 'Nữ')];
    fx[DM + 'NS.DATO'] = [dm('DT1', 'KINH', 'Kinh'), dm('DT2', 'TAY', 'Tày'), dm('DT3', 'MUONG', 'Mường')];
    fx[DM + 'NS.TOGI'] = [dm('TG0', 'KHONG', 'Không'), dm('TG1', 'PG', 'Phật giáo'), dm('TG2', 'CG', 'Công giáo')];
    fx[DM + 'CHUN.DMTT'] = [
        { ID: 'T01', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: null }, { ID: 'T02', TEN: 'Tỉnh Nghệ An', QUANHECHA_ID: null },
        { ID: 'H0101', TEN: 'Quận Cầu Giấy', QUANHECHA_ID: 'T01' }, { ID: 'H0102', TEN: 'Quận Đống Đa', QUANHECHA_ID: 'T01' },
        { ID: 'H0201', TEN: 'Thành phố Vinh', QUANHECHA_ID: 'T02' },
        { ID: 'X010101', TEN: 'Phường Dịch Vọng', QUANHECHA_ID: 'H0101' }, { ID: 'X010201', TEN: 'Phường Láng Hạ', QUANHECHA_ID: 'H0102' },
        { ID: 'X020101', TEN: 'Phường Hưng Dũng', QUANHECHA_ID: 'H0201' }
    ];
    fx['TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach'] = [{ NAM: '2026' }, { NAM: '2025' }];
    fx['TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung'] = function (o) {
        var ds = [{ ID: 'KHTS26', TEN: 'Tuyển sinh cao đẳng 2026', NAM: '2026' }, { ID: 'KHTS26B', TEN: 'Tuyển sinh trung cấp 2026', NAM: '2026' },
            { ID: 'KHTS25', TEN: 'Tuyển sinh cao đẳng 2025', NAM: '2025' }];
        return ds.filter(function (r) { return !o.strNam || r.NAM === String(o.strNam); });
    };
    fx['TS_DoiTacTuyenSinh/LayDanhSach'] = [
        { ID: 'DTTS1', HODEM: 'Trung tâm GDNN -', TEN: 'GDTX Cầu Giấy' }, { ID: 'DTTS2', HODEM: 'Nguyễn Văn', TEN: 'Toàn' },
        { ID: 'DTTS3', HODEM: 'Trần Thị', TEN: 'Hoa' }];
    fx['TS_HeDaoTao/LayDanhSach'] = function (o) { return o.strTS_KeHoachTuyenSinh_Id ? [{ ID: 'HCD', TENHEDAOTAO: 'Cao đẳng chính quy', MAHEDAOTAO: 'CD' }, { ID: 'HTC', TENHEDAOTAO: 'Trung cấp', MAHEDAOTAO: 'TC' }] : []; };
    fx['TS_KhoaDaoTao/LayDanhSach'] = function (o) { return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'KCD26', TENKHOA: 'Khóa 2026', MAKHOA: 'K26' }] : []; };

    var TEN_DUYET = {}; DUYET.forEach(function (d) { TEN_DUYET[d.ID] = d.TEN; });
    var hs = [
        { ID: 'HSDT01', MASO: 'TS260001', HODEM: 'Nguyễn Thu', TEN: 'Hằng', NGAYSINH: '14', THANGSINH: '02', NAMSINH: '2008',
          GIOITINH_ID: 'GT0', DANTOC_ID: 'DT1', TONGIAO_ID: 'TG0', CMT_SO: '001308011122', TTCN_DIENTHOAI: '0911222333',
          NGANHNGHE_ID: 'NN1', DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026',
          TS_KEHOACHTUYENSINH_ID: 'KHTS26', TS_XACNHANDUYETHOSO_ID: 'XD1', TS_XACNHANDUYETHOSO_TEN: 'Đạt',
          NOISINH_TINHTHANH_ID: 'T01', NOISINH_QUANHUYEN_ID: 'H0101', NOISINH_PHUONGXA_ID: 'X010101', NOISINH_DIACHI: 'Số 1 Nguyễn Phong Sắc',
          QUEQUAN_TINHTHANH_ID: 'T02', QUEQUAN_QUANHUYEN_ID: 'H0201', QUEQUAN_PHUONGXA_ID: '', QUEQUAN_DIACHI: '',
          THUONGTRU_TINHTHANH_ID: 'T01', THUONGTRU_QUANHUYEN_ID: 'H0101', THUONGTRU_PHUONGXA_ID: 'X010101', THUONGTRU_DIACHI: 'Ngõ 12',
          GIADINH_HOTENBO: 'Nguyễn Văn Hải', GIADINH_HOTENME: 'Lê Thị Mai', GIADINH_SODIENTHOAIBO: '0912000111', GIADINH_SODIENTHOAIME: '0912000222',
          GIADINH_NGUOIBAOTIN: 'Nguyễn Văn Hải', GIADINH_DIACHIBAOTIN: 'Số 1 Nguyễn Phong Sắc, Cầu Giấy, Hà Nội',
          DOAN_NGAYVAO: '26/03/2023', DANG_NGAYVAO: '', TS_DOITACTUYENSINH_ID: 'DTTS1', TS_DOITACTUYENSINH_KHAC: '',
          XACNHANTINHTRANGNOPHOSO_ID: 'TT1', GHICHU: '', ANHCANHAN: '' },
        { ID: 'HSDT02', MASO: 'TS260002', HODEM: 'Trần Quốc', TEN: 'Khánh', NGAYSINH: '03', THANGSINH: '09', NAMSINH: '2008',
          GIOITINH_ID: 'GT1', DANTOC_ID: 'DT1', TONGIAO_ID: 'TG0', CMT_SO: '040208033344', TTCN_DIENTHOAI: '0977333444',
          NGANHNGHE_ID: 'NN2', DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', TS_KEHOACHTUYENSINH_ID: 'KHTS26',
          TS_XACNHANDUYETHOSO_ID: 'XD2', TS_XACNHANDUYETHOSO_TEN: 'Cần bổ sung', TS_DOITACTUYENSINH_ID: 'DTTS2',
          THUONGTRU_TINHTHANH_ID: 'T02', THUONGTRU_QUANHUYEN_ID: 'H0201', XACNHANTINHTRANGNOPHOSO_ID: 'TT2', GHICHU: 'Thiếu học bạ' },
        { ID: 'HSDT03', MASO: 'TS260003', HODEM: 'Phạm Thị', TEN: 'Lan', NGAYSINH: '22', THANGSINH: '12', NAMSINH: '2007',
          GIOITINH_ID: 'GT0', DANTOC_ID: 'DT3', TONGIAO_ID: 'TG1', CMT_SO: '017307055566', TTCN_DIENTHOAI: '0966555666',
          NGANHNGHE_ID: 'NN3', DAOTAO_HEDAOTAO_TEN: 'Trung cấp', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', TS_KEHOACHTUYENSINH_ID: 'KHTS26B',
          TS_XACNHANDUYETHOSO_ID: '', TS_XACNHANDUYETHOSO_TEN: '', XACNHANTINHTRANGNOPHOSO_ID: 'TT1' },
        { ID: 'HSDT04', MASO: 'TS250017', HODEM: 'Lê Minh', TEN: 'Đức', NGAYSINH: '05', THANGSINH: '06', NAMSINH: '2007',
          GIOITINH_ID: 'GT1', DANTOC_ID: 'DT2', TONGIAO_ID: 'TG0', CMT_SO: '019207044455', TTCN_DIENTHOAI: '0934111999',
          NGANHNGHE_ID: 'NN1', DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2025', TS_KEHOACHTUYENSINH_ID: 'KHTS25',
          TS_XACNHANDUYETHOSO_ID: 'XD3', TS_XACNHANDUYETHOSO_TEN: 'Không đạt', XACNHANTINHTRANGNOPHOSO_ID: 'TT2' }
    ];
    fx['TS_HoSoDuTuyen/LayDanhSach'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return hs.filter(function (r) {
            return (!q || (r.HODEM + ' ' + r.TEN + ' ' + r.MASO).toLowerCase().indexOf(q) >= 0) &&
                (!o.strTS_KeHoachTuyenSinh_Id || r.TS_KEHOACHTUYENSINH_ID === o.strTS_KeHoachTuyenSinh_Id) &&
                (!o.strTS_XacNhanDuyetHoSo_Id || r.TS_XACNHANDUYETHOSO_ID === o.strTS_XacNhanDuyetHoSo_Id) &&
                (!o.strNganhNghe_Id || r.NGANHNGHE_ID === o.strNganhNghe_Id) &&
                (!o.strTS_DoiTacTuyenSinh_Id || r.TS_DOITACTUYENSINH_ID === o.strTS_DoiTacTuyenSinh_Id) &&
                (!o.strThuongTru_TinhThanh_Id || r.THUONGTRU_TINHTHANH_ID === o.strThuongTru_TinhThanh_Id);
        });
    };
    function theoHS(rows) { return function (o) { return rows.filter(function (r) { return r.TS_HOSODUTUYEN_ID === o.strTS_HoSoDuTuyen_Id; }); }; }
    fx['TS_HoSoDuTuyen_Lop9/LayDanhSach'] = theoHS([{ ID: 'L9A', TS_HOSODUTUYEN_ID: 'HSDT01', DIEMTBCN: '8.2', NAMTN: '2023', HOCLUC_ID: 'HL1', HANHKIEM_ID: 'HK1' }]);
    fx['TS_HoSoDuTuyen_Lop10/LayDanhSach'] = theoHS([{ ID: 'L10A', TS_HOSODUTUYEN_ID: 'HSDT01', MON1_TEN: 'Toán', MON1: '8', MON2_TEN: 'Văn', MON2: '7.5',
        MON3_TEN: 'Anh', MON3: '9', DIEMUUTIEN: '0.5', TONGDIEM: '25' }]);
    fx['TS_HoSoDuTuyen_Lop12/LayDanhSach'] = theoHS([{ ID: 'L12A', TS_HOSODUTUYEN_ID: 'HSDT01', DIEMTBCN: '7.9', NAMTN: '2026', HOCLUC_ID: 'HL2', HANHKIEM_ID: 'HK1' }]);
    fx['TS_HoSoDuTuyen_Truong/LayDanhSach'] = theoHS([{ ID: 'TR1', TS_HOSODUTUYEN_ID: 'HSDT01', TRUONG_ID: 'TH1', TRUONG_KHAC: '', GHICHU: 'Ba Đình, Hà Nội' }]);
    fx['TS_HoSo/LayDanhSach'] = theoHS([
        { ID: 'GTO1', TS_HOSODUTUYEN_ID: 'HSDT01', LOAIHOSO_ID: 'LHS1', SOLUONGCANNOP: 1, SOLUONG: 1, MOTA: '' },
        { ID: 'GTO2', TS_HOSODUTUYEN_ID: 'HSDT01', LOAIHOSO_ID: 'LHS3', SOLUONGCANNOP: 4, SOLUONG: 2, MOTA: 'Nộp bổ sung sau' }]);

    var lichSu = [
        { ID: 'LS1', SANPHAM_ID: 'HSDT01', TINHTRANG_TEN: 'Cần bổ sung', NOIDUNG: 'Thiếu ảnh 3x4', NGUOIXACNHAN_TENDAYDU: 'Phạm Văn Nam', NGAYTAO_DD_MM_YYYY: '15/09/2026' },
        { ID: 'LS2', SANPHAM_ID: 'HSDT01', TINHTRANG_TEN: 'Đạt', NOIDUNG: 'Đã bổ sung đủ', NGUOIXACNHAN_TENDAYDU: 'Phạm Văn Nam', NGAYTAO_DD_MM_YYYY: '20/09/2026' }
    ];
    fx['TS_XacNhanDuyetHoSo/LayDanhSach'] = function (o) { return lichSu.filter(function (r) { return r.SANPHAM_ID === o.strsanpham_Id; }); };
    fx['TS_XacNhanDuyetHoSo/ThemMoi'] = function (o) {
        lichSu.push({ ID: 'LS' + (lichSu.length + 1), SANPHAM_ID: o.strSanPham_Id, TINHTRANG_TEN: TEN_DUYET[o.strTinhTrang_Id] || '',
            NOIDUNG: o.strNoiDung, NGUOIXACNHAN_TENDAYDU: 'Người dùng thử', NGAYTAO_DD_MM_YYYY: '27/09/2026' });
        hs.forEach(function (r) { if (r.ID === o.strSanPham_Id) { r.TS_XACNHANDUYETHOSO_ID = o.strTinhTrang_Id; r.TS_XACNHANDUYETHOSO_TEN = TEN_DUYET[o.strTinhTrang_Id] || ''; } });
        return [];
    };
    fx['TS_Files/LayDanhSach'] = [];
    ums.demo.add(fx);
})();
