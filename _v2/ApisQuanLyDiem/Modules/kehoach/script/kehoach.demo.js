/* Dữ liệu mẫu cho kehoach (Kế hoạch công nhận điểm — Quản lý điểm) — chỉ dùng ở chế độ dựng thử.
   Mã sinh viên / người dùng là mã bịa, không lấy từ dữ liệu thật. */
(function () {
    function boDau(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function like(rows, q, cols) {
        q = boDau(q).trim();
        if (!q) return rows.slice();
        return rows.filter(function (r) { return cols.some(function (c) { return boDau(r[c]).indexOf(q) >= 0; }); });
    }
    function trang(rows, o) {
        var p = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    }
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }

    var KH = [
        { ID: 'KHCN01', MAKEHOACH: 'CND-HK1-2526', TENKEHOACH: 'Công nhận điểm học kỳ 1 năm học 2025-2026', TUNGAY: '01/09/2025', DENNGAY: '30/09/2025',
          HANINDON: '15/09/2025', HIEULUC: 1, MOHINHDANGKY_ID: 'MH1' },
        { ID: 'KHCN02', MAKEHOACH: 'CND-CC-2526', TENKEHOACH: 'Công nhận chứng chỉ ngoại ngữ đợt 1/2026', TUNGAY: '05/01/2026', DENNGAY: '31/01/2026',
          HANINDON: '20/01/2026', HIEULUC: 1, MOHINHDANGKY_ID: 'MH2' },
        { ID: 'KHCN03', MAKEHOACH: 'CND-HK2-2425', TENKEHOACH: 'Công nhận điểm học kỳ 2 năm học 2024-2025', TUNGAY: '10/02/2025', DENNGAY: '10/03/2025',
          HANINDON: '25/02/2025', HIEULUC: 0, MOHINHDANGKY_ID: 'MH1' }
    ];
    var SV = [
        ['NH01', 'SV24001', 'Nguyễn Văn', 'An', 'K24-CNTT1', 'Công nghệ thông tin', 'CT01', 'Khóa 2024'],
        ['NH02', 'SV24017', 'Trần Thị', 'Bình', 'K24-CNTT1', 'Công nghệ thông tin', 'CT01', 'Khóa 2024'],
        ['NH03', 'SV23045', 'Lê Hoàng', 'Cường', 'K23-QTKD2', 'Quản trị kinh doanh', 'CT02', 'Khóa 2023'],
        ['NH04', 'SV23058', 'Phạm Minh', 'Đức', 'K23-QTKD2', 'Quản trị kinh doanh', 'CT02', 'Khóa 2023']
    ].map(function (x) {
        return { QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_HOTEN: x[2] + ' ' + x[3], QLSV_NGUOIHOC_NGAYSINH: '12/05/2004', DAOTAO_LOPQUANLY_TEN: x[4],
            DAOTAO_CHUONGTRINH_TEN: x[5], DAOTAO_CHUONGTRINH_ID: x[6], DAOTAO_TOCHUCCHUONGTRINH_ID: x[6],
            DAOTAO_TOCHUCCHUONGTRINH_TEN: x[5], DAOTAO_TOCHUCCHUONGTRINH_MA: x[6], DAOTAO_KHOADAOTAO_TEN: x[7],
            QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' };
    });
    function copy(s, them) { var r = {}; Object.keys(s).forEach(function (k) { r[k] = s[k]; }); Object.keys(them).forEach(function (k) { r[k] = them[k]; }); return r; }
    var HP = [['HP01', 'TA101', 'Tiếng Anh 1'], ['HP02', 'TA102', 'Tiếng Anh 2'], ['HP03', 'TH101', 'Tin học đại cương'], ['HP04', 'KT201', 'Kinh tế vi mô']];

    var KQ = SV.map(function (s, i) {
        var hp = HP[i];
        return copy(s, { ID: 'KQ0' + i, DIEM_KEHOACHCONGNHANDIEM_ID: 'KHCN01', DAOTAO_HOCPHAN_ID: hp[0], DAOTAO_HOCPHAN_MA: hp[1], DAOTAO_HOCPHAN_TEN: hp[2],
            LOAICONGNHAN_TEN: i < 2 ? 'Chứng chỉ IELTS' : 'Bảng điểm', DIEM: ['8.5', '7.0', '9.0', '6.5'][i],
            THONGTINHOCPHAN_CHUNGCHI: i < 2 ? 'IELTS Academic 6.5' : 'Học phần tương đương tại ĐH Kinh tế', SOTINCHI: i < 2 ? '' : 3,
            HEDAOTAO: i < 2 ? '' : 'Đại học chính quy', NGAYCAP: '15/06/2025', NGAYHETHAN: i < 2 ? '15/06/2027' : '',
            DIEM_COSODAOTAOCNDIEM_TEN: i < 2 ? 'British Council' : 'Trường ĐH Kinh tế Quốc dân',
            TINHTRANG_TEN: i === 0 ? 'Khoa đã duyệt' : '', TINHTRANGDAOTAO_TEN: '', DULIEUXACNHAN: 'DL' + i });
    });
    var HS = SV.map(function (s, i) {
        return copy(s, { ID: 'HS0' + i, MACONGNHAN: 'CN2025-00' + (i + 1), NGAYTAO_DD_MM_YYYY_HHMMSS: '0' + (i + 2) + '/09/2025 08:3' + i + ':00',
            HOSO_DANOP: i % 2 ? 0 : 1, PHANLOAICC_ID: 'PL1', PHANLOAICC_TEN: 'Chứng chỉ ngoại ngữ', DIEM_THONGTIN_CC_CAPDO_ID: 'CD1' });
    });
    var QDNH = SV.slice(0, 3).map(function (s, i) {
        var hp = HP[i];
        return copy(s, { ID: 'QDNH0' + i, DAOTAO_HOCPHAN_ID: hp[0], DAOTAO_HOCPHAN_MA: hp[1], DAOTAO_HOCPHAN_TEN: hp[2],
            DAOTAO_KHOAQUANLY_HP_TEN: 'Khoa Ngoại ngữ', DAOTAO_KHOAQUANLY_HP_CHA_TEN: 'Trường Đại học', THOIGIAN: 'Học kỳ 1 - 2025-2026',
            SOTINCHITINHPHI: 3, DIEM: '8.0', DIEMDACHUYEN: i === 0 ? '8.0' : '', PHIPHAINOP: i === 0 ? 1050000 : '',
            QLSV_QUYETDINH_ID: i < 2 ? 'QD01' : 'QD02', NGHIEPVUAPDUNG_ID: 'NV1', DAOTAO_THOIGIANDAOTAO_ID: 'TG251', KIEUHOC_ID: 'KH1', TAICHINH_CACKHOANTHU_ID: 'KT1' });
    });
    var ND = [
        { ID: 'ND01', TAIKHOAN: 'hoang.lm', TENDAYDU: 'Hoàng Lê Minh', GIOITINH_TEN: 'Nam', HINHDAIDIEN: '' },
        { ID: 'ND02', TAIKHOAN: 'thu.nt', TENDAYDU: 'Nguyễn Thị Thu', GIOITINH_TEN: 'Nữ', HINHDAIDIEN: '' }
    ];

    var CN = 'pkg_congthongtin_congnhandiem.', CND = 'pkg_congthongtin_cnd_thongtin.';
    var fx = {};
    fx[CN + 'LayDSDiem_KeHoachCongNhanDiem'] = function (o) {
        return like(KH, o.strTuKhoa, ['MAKEHOACH', 'TENKEHOACH']).filter(function (x) { return o.dHieuLuc === '' || String(x.HIEULUC) === String(o.dHieuLuc); });
    };
    fx['PKG_CONGTHONGTIN_CONGNHANDIEM.Them_Diem_KeHoachCongNhanDiem'] = { rows: [], raw: { Id: 'KHCN_MOI' } };
    fx['PKG_CONGTHONGTIN_CONGNHANDIEM.Sua_Diem_KeHoachCongNhanDiem'] = [];
    fx['SV_CongNhanDiem/Xoa_Diem_KeHoachCongNhanDiem'] = [];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.CONGNHANDIEM.MOHINH'] = [dm('MH1', 'BANGDIEM', 'Công nhận từ bảng điểm'), dm('MH2', 'CHUNGCHI', 'Công nhận từ chứng chỉ')];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.CQD'] = [dm('CQD1', 'TRUONG', 'Cấp trường'), dm('CQD2', 'KHOA', 'Cấp khoa')];
    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = [
        { ID: 'TG251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026' }, { ID: 'TG252', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2025-2026' }];

    fx['SV_CongNhanDiem/LayDSKeHoachCongNhan_PhamVi'] = function (o) {
        return o.strDiem_KeHoachCongNhan_Id === 'KHCN01' ? [
            { ID: 'PV01', PHAMVIAPDUNG_ID: 'K24', PHAMVIAPDUNG_TEN: 'Khóa 2024' },
            { ID: 'PV02', PHAMVIAPDUNG_ID: 'NH03', PHAMVIAPDUNG_TEN: 'Lê Hoàng Cường' }] : [];
    };
    fx['SV_CongNhanDiem/Them_KeHoachCongNhan_PhamVi'] = [];
    fx['SV_CongNhanDiem/Xoa_KeHoachCongNhan_PhamVi'] = [];
    fx['PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc'] = function (o) {
        return trang(like(SV.map(function (s) { return copy(s, { ID: 'R' + s.QLSV_NGUOIHOC_ID }); }), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
    };

    fx[CND + 'LayDSDiem_KeHoach_NhanSu'] = function (o) {
        return o.strDiem_KeHoach_NhanSu_Id === 'KHCN01' ? [
            { ID: 'PC01', NGUOIDUNG_TAIKHOAN: 'hoang.lm', NGUOIDUNG_TENDAYDU: 'Hoàng Lê Minh', DONVI: 'Phòng Đào tạo', NGAYBATDAU: '01/09/2025', NGAYKETTHUC: '30/09/2025' },
            { ID: 'PC02', NGUOIDUNG_TAIKHOAN: 'thu.nt', NGUOIDUNG_TENDAYDU: 'Nguyễn Thị Thu', DONVI: 'Khoa Ngoại ngữ', NGAYBATDAU: '01/09/2025', NGAYKETTHUC: '20/09/2025' }] : [];
    };
    fx[CND + 'Them_Diem_KeHoach_NhanSu'] = [];
    fx[CND + 'Xoa_Diem_KeHoach_NhanSu'] = [];
    fx['pkg_chung_quanlynguoidung.LayDanhSachNguoiDung'] = function (o) { return trang(like(ND, o.strTuKhoa, ['TAIKHOAN', 'TENDAYDU']), o); };

    fx['PKG_CONGTHONGTIN_CONGNHANDIEM.LayDSKH_NguoiHoc_HP_Cap_PT'] = function (o) { return trang(o.strDiem_KeHoachCongNhan_Id === 'KHCN01' ? KQ : [], o); };
    fx['SV_Files/LayDanhSach'] = function (o) {
        return /NH01$|NH03$/.test(o.strDuLieu_Id || '') ? [{ ID: 'F' + o.strDuLieu_Id, FILEMINHCHUNG: 'SV_Files/minhchung_' + o.strDuLieu_Id.slice(-4) + '.pdf', TENHIENTHI: 'Minh chứng.pdf' }] : [];
    };
    fx['CMS_Files/GopFile'] = { rows: 'Temp/gop_minh_chung.zip' };
    fx['SV_CongNhanDiem/LayDSLoaiCC_BangDiem'] = [dm('LCC1', 'CC', 'Chứng chỉ'), dm('LCC2', 'BD', 'Bảng điểm')];
    fx['SV_CongNhanDiem/LayDSLoaiCC_BDTheoPhanLoai'] = function (o) {
        return o.strLoaiCC_BD_Id === 'LCC1' ? [dm('LCN1', 'IELTS', 'Chứng chỉ IELTS'), dm('LCN2', 'TOEIC', 'Chứng chỉ TOEIC')] : [dm('LCN3', 'BD', 'Bảng điểm')];
    };
    fx['SV_CongNhanDiem/LayDSCoSoDaoTaoTheoLoai'] = function (o) {
        return o.strLoaiCongNhan_Id === 'LCN3' ? [dm('CS3', 'NEU', 'Trường ĐH Kinh tế Quốc dân')] : [dm('CS1', 'BC', 'British Council'), dm('CS2', 'IDP', 'IDP Education')];
    };
    fx['SV_CongNhanDiem/LayTTDiem_NguoiHoc_HocPhan_Cap'] = function (o) {
        return o.strQLSV_NguoiHoc_Id === 'NH01' ? [{ ID: 'CT01', LOAICC_BANGDIEM_ID: 'LCC1', LOAICONGNHAN_ID: 'LCN1', DIEM_COSODAOTAOCONGNHANDIEM_ID: 'CS1',
            DIEM: '8.5', NGAYCAP: '15/06/2025', NGAYHETHAN: '15/06/2027', GHICHU: '', HEDAOTAO: '', SOTINCHI: '', THONGTINHOCPHAN_CHUNGCHI: 'IELTS Academic 6.5' }] : [];
    };
    fx['SV_CongNhanDiem/Them_Diem_NguoiHoc_HocPhan_Cap'] = [];
    fx['D_CoSoCongNhanDiem/Xoa_Diem_NguoiHoc_HocPhan_Cap'] = [];
    fx['SV_CND_ThongTin/LayDSLoaiCongNhan'] = [dm('LXN1', 'KHOA', 'Khoa xác nhận'), dm('LXN2', 'DAOTAO', 'Đào tạo xác nhận')];
    fx['SV_CND_ThongTin/LayDSHanhDongTheoXacNhan'] = function (o) {
        return o.strLoaiXacNhan_Id ? [{ ID: 'HD1', TEN: 'Đồng ý', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #16a34a' },
            { ID: 'HD2', TEN: 'Không đồng ý', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc2626' }] : [];
    };
    fx[CND + 'Them_Diem_DK_CongNhan_XacNhan'] = [];

    fx['SV_CND_ThongTin/LayDSDiem_NH_CongNhan_So_Diem'] = function (o) { return trang(o.strDiem_KeHoachCongNhan_Id === 'KHCN01' ? like(HS, o.strTuKhoa, ['MACONGNHAN', 'QLSV_NGUOIHOC_MASO']) : [], o); };
    fx['SV_CND_ThongTin/LayDSDiem_NH_CongNhan_So_CC'] = function (o) { return trang(like(HS.slice(0, 2), o.strTuKhoa, ['MACONGNHAN', 'QLSV_NGUOIHOC_MASO']), o); };
    fx['SV_CND_ThongTin/LayDSChiTetCongNhanTheoDiem'] = { rows: {
        rs: [{ DAOTAO_HOCPHAN_MA: 'KT201', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô', DIEMCONGNHAN: '8.0', DIEM_COSODAOTAO_TEN: 'Trường ĐH Kinh tế Quốc dân', THONGTINHOCPHAN: 'Kinh tế học vi mô 1 (3 TC)' }],
        rsFiles: [{ TENCOSODAOTAO: 'Trường ĐH Kinh tế Quốc dân', DUONGDAN: 'SV_Files/bangdiem.pdf', TENHIENTHI: 'Bảng điểm.pdf' }] } };
    fx['SV_CND_ThongTin/LayDSChiTetCongNhanTheoCC'] = { rows: {
        rs: [{ DAOTAO_HOCPHAN_MA: 'TA101', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 1', DIEMCONGNHAN: '8.5', DIEM_THONGTIN_CC_CAPDO_TEN: 'IELTS 6.5', DIEM_COSODAOTAO_TEN: 'British Council', NGAYCAP: '15/06/2025' }],
        rsFiles: [{ PHANLOAICC_TEN: 'Chứng chỉ ngoại ngữ', DIEM_THONGTIN_CHUNGCHI_TEN: 'IELTS', CAPDO_TEN: '6.5', DUONGDAN: 'SV_Files/ielts.pdf', TENHIENTHI: 'IELTS.pdf' }] } };
    fx['SV_CND_ThongTin/XacNhanNopHoSo'] = [];

    fx['pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh'] = function (o) {
        return o.strNguonDuLieu_Id === 'KHCN01' ? [{ ID: 'QD01', SOQUYETDINH: '1234/QĐ-ĐHCN' }, { ID: 'QD02', SOQUYETDINH: '1302/QĐ-ĐHCN' }] : [];
    };
    fx['pkg_hosohocvien_quyetdinh.LayDSLoaiQuyetDinh'] = [dm('LQD1', 'CND', 'Quyết định công nhận điểm')];
    fx['pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh'] = [];
    fx[CN + 'LayDSKH_NguoiHoc_HP_Cap_QD'] = function (o) {
        if (o.strDiem_KeHoachCongNhan_Id !== 'KHCN01') return [];
        return QDNH.filter(function (x) { return !o.strQLSV_QuyetDinh_Id || x.QLSV_QUYETDINH_ID === o.strQLSV_QuyetDinh_Id; });
    };
    fx[CN + 'LayDSKH_NguoiHoc_HP_Cap_ChuaQD'] = function (o) {
        return o.strDiem_KeHoachCongNhan_Id === 'KHCN01' ? [copy(SV[3], { ID: 'CQD01', DAOTAO_HOCPHAN_MA: 'KT201', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô' })] : [];
    };
    fx[CND + 'Them_QD_Diem_NH_Diem_CN'] = [];
    fx['pkg_diem_phanquyen.PhanQuyen_TaoDSTheoQuyetDinhv2'] = [];
    fx['pkg_diem_phanquyen.ChuyenDiemCongNhan_TheoQD'] = [];
    fx['pkg_taichinh_tinhphi.TinhPhiNguoiHoc'] = [];
    fx['pkg_taichinh_tinhphi.XoaKetQuaDaTinhPhi'] = [];

    ums.demo.add(fx);
})();
