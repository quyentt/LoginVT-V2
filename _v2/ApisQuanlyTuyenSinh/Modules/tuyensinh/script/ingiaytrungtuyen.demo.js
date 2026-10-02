/* Dữ liệu mẫu cho In giấy trúng tuyển — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    fx[DM + 'TUYENSINH.XACNHANTRUNGTUYEN'] = [dm('XNTT1', 'TT', 'Trúng tuyển'), dm('XNTT0', 'KTT', 'Không trúng tuyển')];
    fx[DM + 'TUYENSINH.NGANHNGHE'] = [dm('NN1', 'KTPM', 'Kỹ thuật phần mềm'), dm('NN2', 'QTKD', 'Quản trị kinh doanh')];
    fx[DM + 'TUYENSINH.TRUONGHOC'] = [dm('TH1', 'THPT01', 'THPT Chu Văn An'), dm('TH2', 'THPT02', 'THPT Kim Liên')];
    fx[DM + 'TUYENSINH.HOCLUC'] = [dm('HL1', 'G', 'Giỏi'), dm('HL2', 'K', 'Khá')];
    fx[DM + 'TUYENSINH.HANHKIEM'] = [dm('HK1', 'T', 'Tốt'), dm('HK2', 'K', 'Khá')];
    fx[DM + 'TUYENSINH.TINHTRANGHOSO'] = [dm('TT1', 'DU', 'Đã nộp đủ'), dm('TT2', 'THIEU', 'Còn thiếu')];
    fx[DM + 'TUYENSINH.LOAIHOSO'] = [dm('LHS1', 'HB', 'Học bạ THPT'), dm('LHS3', 'ANH', 'Ảnh 3x4')];
    fx[DM + 'NS.GITI'] = [dm('GT1', '1', 'Nam'), dm('GT0', '0', 'Nữ')];
    fx[DM + 'NS.DATO'] = [dm('DT1', 'KINH', 'Kinh')];
    fx[DM + 'NS.TOGI'] = [dm('TG0', 'KHONG', 'Không')];
    fx[DM + 'CHUN.DMTT'] = [
        { ID: 'T01', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: null },
        { ID: 'H0101', TEN: 'Quận Cầu Giấy', QUANHECHA_ID: 'T01' },
        { ID: 'X010101', TEN: 'Phường Dịch Vọng', QUANHECHA_ID: 'H0101' }
    ];
    fx['TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach'] = [{ NAM: '2026' }, { NAM: '2025' }];
    fx['TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung'] = function (o) {
        return o.strNam ? [{ ID: 'KHTS' + o.strNam, TEN: 'Tuyển sinh cao đẳng ' + o.strNam }] : [];
    };
    fx['TS_DoiTacTuyenSinh/LayDanhSach'] = [{ ID: 'DTTS1', THONGTINHIENTHI: 'Trung tâm GDNN Cầu Giấy' }];
    fx['TS_HeDaoTao/LayDanhSach'] = function (o) { return o.strTS_KeHoachTuyenSinh_Id ? [{ ID: 'HCD', TENHEDAOTAO: 'Cao đẳng chính quy', MAHEDAOTAO: 'CD' }] : []; };
    fx['TS_KhoaDaoTao/LayDanhSach'] = function (o) { return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'KCD26', TENKHOA: 'Khóa 2026', MAKHOA: 'K26' }] : []; };
    var hs = [
        { ID: 'IGTT01', MASO: 'TS260001', HODEM: 'Nguyễn Thu', TEN: 'Hằng', NGAYSINH: '14', THANGSINH: '02', NAMSINH: '2008',
          GIOITINH_ID: 'GT0', DANTOC_ID: 'DT1', TONGIAO_ID: 'TG0', CMT_SO: '001308011122', TTCN_DIENTHOAI: '0911222333',
          NGANHNGHE_ID: 'NN1', NGANHNGHE_TEN: 'Kỹ thuật phần mềm', DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy',
          DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', SOLANIN: 1,
          NOISINH_TINHTHANH_ID: 'T01', NOISINH_QUANHUYEN_ID: 'H0101', NOISINH_PHUONGXA_ID: 'X010101', NOISINH_DIACHI: 'Số 1 Nguyễn Phong Sắc',
          THUONGTRU_TINHTHANH_ID: 'T01', THUONGTRU_QUANHUYEN_ID: 'H0101', THUONGTRU_DIACHI: 'Ngõ 12',
          GIADINH_HOTENBO: 'Nguyễn Văn Hải', GIADINH_HOTENME: 'Lê Thị Mai', GIADINH_SODIENTHOAIBO: '0912000111',
          DOAN_NGAYVAO: '26/03/2023', TS_DOITACTUYENSINH_ID: 'DTTS1', XACNHANTINHTRANGNOPHOSO_ID: 'TT1', GHICHU: '' },
        { ID: 'IGTT02', MASO: 'TS260002', HODEM: 'Trần Minh', TEN: 'Quân', NGAYSINH: '03', THANGSINH: '11', NAMSINH: '2008',
          GIOITINH_ID: 'GT1', TTCN_DIENTHOAI: '0988777666', NGANHNGHE_ID: 'NN2', NGANHNGHE_TEN: 'Quản trị kinh doanh',
          DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', SOLANIN: 0 }
    ];
    fx['TS_HoSoDuTuyen/LayDanhSach'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return hs.filter(function (r) { return !q || (r.HODEM + ' ' + r.TEN + ' ' + r.MASO).toLowerCase().indexOf(q) >= 0; });
    };
    fx['TS_HoSoDuTuyen/LayChiTiet'] = function (o) { return hs.filter(function (r) { return r.ID === o.strId; }); };
    function theoHS(ds) { return function (o) { return ds.filter(function (r) { return r.TS_HOSODUTUYEN_ID === o.strTS_HoSoDuTuyen_Id; }); }; }
    fx['TS_HoSoDuTuyen_Lop9/LayDanhSach'] = theoHS([{ ID: 'L9A', TS_HOSODUTUYEN_ID: 'IGTT01', DIEMTBCN: '8.2', NAMTN: '2023', HOCLUC_ID: 'HL1', HANHKIEM_ID: 'HK1' }]);
    fx['TS_HoSoDuTuyen_Lop10/LayDanhSach'] = theoHS([{ ID: 'L10A', TS_HOSODUTUYEN_ID: 'IGTT01', MON1_TEN: 'Toán', MON1: '8', MON2_TEN: 'Văn', MON2: '7.5',
        MON3_TEN: 'Anh', MON3: '9', DIEMUUTIEN: '0.5', TONGDIEM: '25' }]);
    fx['TS_HoSoDuTuyen_Lop12/LayDanhSach'] = theoHS([]);
    fx['TS_HoSoDuTuyen_Truong/LayDanhSach'] = theoHS([{ ID: 'TR1', TS_HOSODUTUYEN_ID: 'IGTT01', TRUONG_ID: 'TH1', TRUONG_KHAC: '', GHICHU: 'Ba Đình, Hà Nội' }]);
    fx['TS_HoSo/LayDanhSach'] = theoHS([
        { ID: 'GTO1', TS_HOSODUTUYEN_ID: 'IGTT01', LOAIHOSO_ID: 'LHS1', SOLUONGCANNOP: 1, SOLUONG: 1, MOTA: '' },
        { ID: 'GTO2', TS_HOSODUTUYEN_ID: 'IGTT01', LOAIHOSO_ID: 'LHS3', SOLUONGCANNOP: 4, SOLUONG: 2, MOTA: 'Nộp bổ sung sau' }
    ]);
    fx['TS_Files/LayDanhSach'] = [];
    ums.demo.add(fx);
})();
