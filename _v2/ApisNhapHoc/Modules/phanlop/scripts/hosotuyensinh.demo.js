/* Dữ liệu mẫu cho Hồ sơ tuyển sinh / chuyển lớp (nhập học) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
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
    fx['TS_KeHoach_NguoiDung/LayDanhSach'] = [{ ID: 'KHTS26', TEN: 'Tuyển sinh cao đẳng 2026' }, { ID: 'KHTS25', TEN: 'Tuyển sinh cao đẳng 2025' }];
    fx['TS_DoiTacTuyenSinh/LayDanhSach'] = [{ ID: 'DTTS1', THONGTINHIENTHI: 'Trung tâm GDNN Cầu Giấy' }, { ID: 'DTTS2', THONGTINHIENTHI: 'Tư vấn trực tuyến' }];
    fx['TS_HeDaoTao/LayDanhSach'] = function (o) { return o.strTS_KeHoachTuyenSinh_Id ? [{ ID: 'HCD', TENHEDAOTAO: 'Cao đẳng chính quy', MAHEDAOTAO: 'CD' }] : []; };
    fx['TS_KhoaDaoTao/LayDanhSach'] = function (o) { return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'KCD26', TENKHOA: 'Khóa 2026', MAKHOA: 'K26' }] : []; };
    fx['KHCT_LopQuanLy/LayDanhSach'] = function (o) {
        return o.strDaoTao_KhoaDaoTao_Id ? [{ ID: 'LCD1', TEN: 'CĐ26-KTPM1', SOLUONGTHUCTE: 32 }, { ID: 'LCD2', TEN: 'CĐ26-QTKD1', SOLUONGTHUCTE: 28 }] : [];
    };
    var hs = [
        { ID: 'HSDT01', MASO: 'TS260001', HODEM: 'Nguyễn Thu', TEN: 'Hằng', NGAYSINH: '14', THANGSINH: '02', NAMSINH: '2008',
          GIOITINH_ID: 'GT0', DANTOC_ID: 'DT1', TONGIAO_ID: 'TG0', CMT_SO: '001308011122', TTCN_DIENTHOAI: '0911222333',
          NGANHNGHE_ID: 'NN1', NGANHNGHE_TEN: 'Kỹ thuật phần mềm', NGANH_NGHE_TRUOC: '', DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy',
          DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', DAOTAO_LOPQUANLY_MA: 'CĐ26-KTPM1',
          NOISINH_TINHTHANH_ID: 'T01', NOISINH_QUANHUYEN_ID: 'H0101', NOISINH_PHUONGXA_ID: 'X010101', NOISINH_DIACHI: 'Số 1 Nguyễn Phong Sắc',
          QUEQUAN_TINHTHANH_ID: 'T02', QUEQUAN_QUANHUYEN_ID: 'H0201', QUEQUAN_PHUONGXA_ID: '', QUEQUAN_DIACHI: '',
          THUONGTRU_TINHTHANH_ID: 'T01', THUONGTRU_QUANHUYEN_ID: 'H0101', THUONGTRU_PHUONGXA_ID: 'X010101', THUONGTRU_DIACHI: 'Ngõ 12',
          GIADINH_HOTENBO: 'Nguyễn Văn Hải', GIADINH_HOTENME: 'Lê Thị Mai', GIADINH_SODIENTHOAIBO: '0912000111', GIADINH_SODIENTHOAIME: '0912000222',
          GIADINH_NGUOIBAOTIN: 'Nguyễn Văn Hải', GIADINH_DIACHIBAOTIN: 'Số 1 Nguyễn Phong Sắc, Cầu Giấy, Hà Nội',
          DOAN_NGAYVAO: '26/03/2023', DANG_NGAYVAO: '', TS_DOITACTUYENSINH_ID: 'DTTS1', TS_DOITACTUYENSINH_KHAC: '',
          XACNHANTINHTRANGNOPHOSO_ID: 'TT1', GHICHU: '', ANHCANHAN: '' },
        { ID: 'HSDT02', MASO: 'TS260002', HODEM: 'Trần Quốc', TEN: 'Khánh', NGAYSINH: '03', THANGSINH: '09', NAMSINH: '2008',
          GIOITINH_ID: 'GT1', DANTOC_ID: 'DT1', TONGIAO_ID: 'TG0', CMT_SO: '040208033344', TTCN_DIENTHOAI: '0977333444',
          NGANHNGHE_ID: 'NN2', NGANHNGHE_TEN: 'Quản trị kinh doanh', DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy',
          DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', DAOTAO_LOPQUANLY_MA: '', XACNHANTINHTRANGNOPHOSO_ID: 'TT2', GHICHU: 'Thiếu học bạ' },
        { ID: 'HSDT03', MASO: 'TS260003', HODEM: 'Phạm Thị', TEN: 'Lan', NGAYSINH: '22', THANGSINH: '12', NAMSINH: '2007',
          GIOITINH_ID: 'GT0', DANTOC_ID: 'DT3', TONGIAO_ID: 'TG1', CMT_SO: '017307055566', TTCN_DIENTHOAI: '0966555666',
          NGANHNGHE_ID: 'NN3', NGANHNGHE_TEN: 'Công nghệ ô tô', DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy',
          DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', DAOTAO_LOPQUANLY_MA: 'CĐ26-QTKD1', XACNHANTINHTRANGNOPHOSO_ID: 'TT1' }
    ];
    ums.demo.add(fx);
    function theoHS(rows, o) { return rows.filter(function (r) { return r.TS_HOSODUTUYEN_ID === o.strTS_HoSoDuTuyen_Id; }); }
    ums.demo.crudStore('TS_HoSoDuTuyen', hs, { list: function (rows, o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) { return !q || (r.HODEM + ' ' + r.TEN + ' ' + r.MASO).toLowerCase().indexOf(q) >= 0; });
    } });
    ums.demo.crudStore('TS_HoSoDuTuyen_Lop9', [{ ID: 'L9A', TS_HOSODUTUYEN_ID: 'HSDT01', DIEMTBCN: '8.2', NAMTN: '2023', HOCLUC_ID: 'HL1', HANHKIEM_ID: 'HK1' }],
        { list: theoHS });
    ums.demo.crudStore('TS_HoSoDuTuyen_Lop10', [{ ID: 'L10A', TS_HOSODUTUYEN_ID: 'HSDT01', MON1_TEN: 'Toán', MON1: '8', MON2_TEN: 'Văn', MON2: '7.5',
        MON3_TEN: 'Anh', MON3: '9', DIEMUUTIEN: '0.5', TONGDIEM: '25' }], { list: theoHS });
    ums.demo.crudStore('TS_HoSoDuTuyen_Lop12', [], { list: theoHS });
    ums.demo.crudStore('TS_HoSoDuTuyen_Truong', [{ ID: 'TR1', TS_HOSODUTUYEN_ID: 'HSDT01', TRUONG_ID: 'TH1', TRUONG_KHAC: '', GHICHU: 'Ba Đình, Hà Nội' }],
        { list: theoHS });
    ums.demo.crudStore('TS_HoSo', [
        { ID: 'GTO1', TS_HOSODUTUYEN_ID: 'HSDT01', LOAIHOSO_ID: 'LHS1', SOLUONGCANNOP: 1, SOLUONG: 1, MOTA: '' },
        { ID: 'GTO2', TS_HOSODUTUYEN_ID: 'HSDT01', LOAIHOSO_ID: 'LHS3', SOLUONGCANNOP: 4, SOLUONG: 2, MOTA: 'Nộp bổ sung sau' }
    ], { list: theoHS });
    ums.demo.add({
        'TS_HoSoDuTuyen/ChuyenLop': [],
        'TS_HoSoDuTuyen/LayDSLichSuChuyenLop': function (o) {
            return o.strTS_HoSoDuTuyen_Id === 'HSDT01' ? [{ MASO: 'TS260001', HODEM: 'Nguyễn Thu', TEN: 'Hằng', QLSV_NGUOIHOC_NGAYSINH: '14/02/2008',
                TRUOC_DAOTAO_LOPQUANLY_MA: 'CĐ26-QTKD1', SAU_DAOTAO_LOPQUANLY_MA: 'CĐ26-KTPM1', GHICHU_LS: 'Đổi ngành theo nguyện vọng 2',
                NGUOITHUCHIEN_TAIKHOAN: 'tuyensinh', NGAYTHUCHIEN_DD_MM_YYYY_HHMMSS: '20/09/2026 14:05:11' }] : [];
        }
    });
})();
