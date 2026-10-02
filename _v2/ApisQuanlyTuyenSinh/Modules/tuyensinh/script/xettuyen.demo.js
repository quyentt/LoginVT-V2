/* Dữ liệu mẫu cho Xét tuyển — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, t1, t2) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: t1 || '', THONGTIN2: t2 || '' }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    fx[DM + 'TUYENSINH.XACNHANTRUNGTUYEN'] = [dm('XNTT1', 'TT', 'Trúng tuyển', 'fa fa-check-circle', 'color: #198754'),
        dm('XNTT0', 'KTT', 'Không trúng tuyển', 'fa fa-times-circle', 'color: #dc3545'), dm('XNTT2', 'CHO', 'Chờ xét', 'fa fa-clock-o', 'color: #fd7e14')];
    fx[DM + 'TUYENSINH.XACNHANTHUTUCNHAPHOC'] = [dm('XNNH1', 'DTS', 'Đã tiếp sinh', 'fa fa-check-circle', 'color: #198754'),
        dm('XNNH0', 'CTS', 'Chưa tiếp sinh', 'fa fa-times-circle', 'color: #dc3545')];
    fx[DM + 'TUYENSINH.NGANHNGHE'] = [dm('NN1', 'KTPM', 'Kỹ thuật phần mềm'), dm('NN2', 'QTKD', 'Quản trị kinh doanh'), dm('NN3', 'CNOT', 'Công nghệ ô tô')];
    fx[DM + 'TUYENSINH.TRUONGHOC'] = [dm('TH1', 'THPT01', 'THPT Chu Văn An'), dm('TH2', 'THPT02', 'THPT Kim Liên')];
    fx[DM + 'TUYENSINH.HOCLUC'] = [dm('HL1', 'G', 'Giỏi'), dm('HL2', 'K', 'Khá'), dm('HL3', 'TB', 'Trung bình')];
    fx[DM + 'TUYENSINH.HANHKIEM'] = [dm('HK1', 'T', 'Tốt'), dm('HK2', 'K', 'Khá')];
    fx[DM + 'TUYENSINH.TINHTRANGHOSO'] = [dm('TT1', 'DU', 'Đã nộp đủ'), dm('TT2', 'THIEU', 'Còn thiếu')];
    fx[DM + 'TUYENSINH.LOAIHOSO'] = [dm('LHS1', 'HB', 'Học bạ THPT'), dm('LHS2', 'GKS', 'Giấy khai sinh'), dm('LHS3', 'ANH', 'Ảnh 3x4')];
    fx[DM + 'NS.GITI'] = [dm('GT1', '1', 'Nam'), dm('GT0', '0', 'Nữ')];
    fx[DM + 'NS.DATO'] = [dm('DT1', 'KINH', 'Kinh'), dm('DT3', 'MUONG', 'Mường')];
    fx[DM + 'NS.TOGI'] = [dm('TG0', 'KHONG', 'Không'), dm('TG1', 'PG', 'Phật giáo')];
    fx[DM + 'CHUN.DMTT'] = [
        { ID: 'T01', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: null }, { ID: 'T02', TEN: 'Tỉnh Nghệ An', QUANHECHA_ID: null },
        { ID: 'H0101', TEN: 'Quận Cầu Giấy', QUANHECHA_ID: 'T01' }, { ID: 'H0201', TEN: 'Thành phố Vinh', QUANHECHA_ID: 'T02' },
        { ID: 'X010101', TEN: 'Phường Dịch Vọng', QUANHECHA_ID: 'H0101' }, { ID: 'X020101', TEN: 'Phường Hưng Dũng', QUANHECHA_ID: 'H0201' }
    ];
    fx['TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach'] = [{ NAM: '2026' }, { NAM: '2025' }];
    fx['TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung'] = function (o) {
        return o.strNam ? [{ ID: 'KHTS' + o.strNam, TEN: 'Tuyển sinh cao đẳng ' + o.strNam }] : [];
    };
    fx['TS_DoiTacTuyenSinh/LayDanhSach'] = [{ ID: 'DTTS1', THONGTINHIENTHI: 'Trung tâm GDNN Cầu Giấy' }, { ID: 'DTTS2', THONGTINHIENTHI: 'Tư vấn trực tuyến' }];
    fx['TS_HeDaoTao/LayDanhSach'] = function (o) { return o.strTS_KeHoachTuyenSinh_Id ? [{ ID: 'HCD', TENHEDAOTAO: 'Cao đẳng chính quy', MAHEDAOTAO: 'CD' }] : []; };
    fx['TS_KhoaDaoTao/LayDanhSach'] = function (o) { return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'KCD26', TENKHOA: 'Khóa 2026', MAKHOA: 'K26' }] : []; };
    var hs = [
        { ID: 'XT01', MASO: 'TS260001', HODEM: 'Nguyễn Thu', TEN: 'Hằng', NGAYSINH: '14', THANGSINH: '02', NAMSINH: '2008',
          GIOITINH_ID: 'GT0', DANTOC_ID: 'DT1', TONGIAO_ID: 'TG0', CMT_SO: '001308011122', TTCN_DIENTHOAI: '0911222333',
          NGANHNGHE_ID: 'NN1', NGANHNGHE_TEN: 'Kỹ thuật phần mềm', DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026',
          TS_XACNHANDUYETTT_TEN: 'Trúng tuyển', TS_XACNHANTTNH_TEN: 'Đã tiếp sinh',
          NOISINH_TINHTHANH_ID: 'T01', NOISINH_QUANHUYEN_ID: 'H0101', NOISINH_PHUONGXA_ID: 'X010101', NOISINH_DIACHI: 'Số 1 Nguyễn Phong Sắc',
          THUONGTRU_TINHTHANH_ID: 'T01', THUONGTRU_QUANHUYEN_ID: 'H0101', THUONGTRU_PHUONGXA_ID: 'X010101', THUONGTRU_DIACHI: 'Ngõ 12',
          GIADINH_HOTENBO: 'Nguyễn Văn Hải', GIADINH_HOTENME: 'Lê Thị Mai', GIADINH_SODIENTHOAIBO: '0912000111',
          DOAN_NGAYVAO: '26/03/2023', TS_DOITACTUYENSINH_ID: 'DTTS1', XACNHANTINHTRANGNOPHOSO_ID: 'TT1', GHICHU: '' },
        { ID: 'XT02', MASO: 'TS260002', HODEM: 'Trần Quốc', TEN: 'Khánh', NGAYSINH: '03', THANGSINH: '09', NAMSINH: '2008',
          GIOITINH_ID: 'GT1', TTCN_DIENTHOAI: '0977333444', NGANHNGHE_ID: 'NN2', NGANHNGHE_TEN: 'Quản trị kinh doanh',
          DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', TS_XACNHANDUYETTT_TEN: 'Chờ xét', XACNHANTINHTRANGNOPHOSO_ID: 'TT2' },
        { ID: 'XT03', MASO: 'TS260003', HODEM: 'Phạm Thị', TEN: 'Lan', NGAYSINH: '22', THANGSINH: '12', NAMSINH: '2007',
          GIOITINH_ID: 'GT0', TTCN_DIENTHOAI: '0966555666', NGANHNGHE_ID: 'NN3', NGANHNGHE_TEN: 'Công nghệ ô tô',
          DAOTAO_HEDAOTAO_TEN: 'Cao đẳng chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2026', TS_XACNHANDUYETTT_TEN: 'Không trúng tuyển' }
    ];
    ums.demo.add(fx);
    function theoHS(rows, o) { return rows.filter(function (r) { return r.TS_HOSODUTUYEN_ID === o.strTS_HoSoDuTuyen_Id; }); }
    ums.demo.crudStore('TS_HoSoDuTuyen', hs, { list: function (rows, o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) { return !q || (r.HODEM + ' ' + r.TEN + ' ' + r.MASO).toLowerCase().indexOf(q) >= 0; });
    } });
    ums.demo.crudStore('TS_HoSoDuTuyen_Lop9', [{ ID: 'XL9A', TS_HOSODUTUYEN_ID: 'XT01', DIEMTBCN: '8.2', NAMTN: '2023', HOCLUC_ID: 'HL1', HANHKIEM_ID: 'HK1' }], { list: theoHS });
    ums.demo.crudStore('TS_HoSoDuTuyen_Lop10', [{ ID: 'XL10A', TS_HOSODUTUYEN_ID: 'XT01', MON1_TEN: 'Toán', MON1: '8', MON2_TEN: 'Văn', MON2: '7.5',
        MON3_TEN: 'Anh', MON3: '9', DIEMUUTIEN: '0.5', TONGDIEM: '25' }], { list: theoHS });
    ums.demo.crudStore('TS_HoSoDuTuyen_Lop12', [], { list: theoHS });
    ums.demo.crudStore('TS_HoSoDuTuyen_Truong', [{ ID: 'XTR1', TS_HOSODUTUYEN_ID: 'XT01', TRUONG_ID: 'TH1', TRUONG_KHAC: '', GHICHU: 'Ba Đình, Hà Nội' }], { list: theoHS });
    ums.demo.crudStore('TS_HoSo', [{ ID: 'XGT1', TS_HOSODUTUYEN_ID: 'XT01', LOAIHOSO_ID: 'LHS1', SOLUONGCANNOP: 1, SOLUONG: 1, MOTA: '' }], { list: theoHS });
    var LS = [{ SP: 'XT01', TINHTRANG_TEN: 'Trúng tuyển', NOIDUNG: 'Đủ điểm chuẩn ngành', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Văn Quản', NGAYTAO_DD_MM_YYYY: '20/09/2026' }];
    ums.demo.add({
        'TS_XacNhanDuyetTrungTuyen/LayDanhSach': function (o) { return LS.filter(function (x) { return x.SP === o.strsanpham_Id; }); },
        'TS_XacNhanDuyetTrungTuyen/ThemMoi': [],
        'TS_XacNhanThuTucNhapHoc/LayDanhSach': [],
        'TS_XacNhanThuTucNhapHoc/ThemMoi': [],
        'TS_XetTuyen/TaoDuLieuXetTuyenTuDong': [],
        'TS_XetTuyen/LayDSNganhXetTheoKeHoach': [{ ID: 'NN1', TEN: 'Kỹ thuật phần mềm' }, { ID: 'NN2', TEN: 'Quản trị kinh doanh' }],
        'TS_XetTuyen/XetTuyenTuDongTheoNganh': [],
        'TS_XetTuyen/XetTuyenTuDongTheoNganhChiTieu': [],
        'TS_XetTuyen/LayDSTS_KeHoachXet_ChiTieu': [
            { ID: 'KXC1', NGANHNGHE_MA: 'KTPM', NGANHNGHE_TEN: 'Kỹ thuật phần mềm', CHITIEU: 120, DIEMXET: 18.5 },
            { ID: 'KXC2', NGANHNGHE_MA: 'QTKD', NGANHNGHE_TEN: 'Quản trị kinh doanh', CHITIEU: 80, DIEMXET: 17 }],
        'TS_XetTuyen/Sua_TS_KeHoachXet_ChiTieu': []
    });
})();
