/* Dữ liệu mẫu cho các màn Đánh giá phân loại (dgplnguoilaodong + dgplluongtangthem) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    function like(rows, q, cols) {
        q = (q || '').toLowerCase();
        return !q ? rows : rows.filter(function (r) { return cols.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; }); });
    }
    function trang(rows, o) {
        var i = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((i - 1) * s, i * s), pager: rows.length };
    }

    var KH_NLD = [
        { ID: 'KHN1', TENKEHOACH: 'Đánh giá, phân loại viên chức và người lao động năm 2025', TUNGAY: '01/12/2025', DENNGAY: '31/12/2025', NAM: '2025', NOIDUNG: 'Đánh giá cuối năm theo Nghị định 90/2020/NĐ-CP' },
        { ID: 'KHN2', TENKEHOACH: 'Đánh giá, phân loại viên chức và người lao động năm 2026', TUNGAY: '01/12/2026', DENNGAY: '31/12/2026', NAM: '2026', NOIDUNG: 'Kế hoạch đánh giá năm 2026' },
        { ID: 'KHN3', TENKEHOACH: 'Đánh giá giữa năm 2026 — khối phòng ban', TUNGAY: '01/06/2026', DENNGAY: '30/06/2026', NAM: '2026', NOIDUNG: '' }
    ];
    var KH_LTT = [
        { ID: 'KHL1', TENKEHOACH: 'Xét lương tăng thêm quý I/2026', TUNGAY: '01/04/2026', DENNGAY: '15/04/2026', NOIDUNG: 'Theo quy chế chi tiêu nội bộ' },
        { ID: 'KHL2', TENKEHOACH: 'Xét lương tăng thêm quý II/2026', TUNGAY: '01/07/2026', DENNGAY: '15/07/2026', NOIDUNG: '' }
    ];
    function kh(rows) { return function (o) { return trang(like(rows, o.strTuKhoa, ['TENKEHOACH']), o); }; }

    var AX = [
        { ID: 'AX1', NHANSU_DGPL_NAM_KEHOACH_ID: 'KHN1', CHUCVU_ID: 'CV3', CHUCVU_TEN: 'Trưởng khoa', DOITUONGAPDUNG_ID: 'DT1', DOITUONGAPDUNG_TEN: 'Viên chức quản lý' },
        { ID: 'AX2', NHANSU_DGPL_NAM_KEHOACH_ID: 'KHN1', CHUCVU_ID: 'CV2', CHUCVU_TEN: 'Phó trưởng khoa', DOITUONGAPDUNG_ID: 'DT1', DOITUONGAPDUNG_TEN: 'Viên chức quản lý' },
        { ID: 'AX3', NHANSU_DGPL_NAM_KEHOACH_ID: 'KHN2', CHUCVU_ID: 'CV1', CHUCVU_TEN: 'Giảng viên', DOITUONGAPDUNG_ID: 'DT2', DOITUONGAPDUNG_TEN: 'Viên chức không giữ chức vụ quản lý' }
    ];
    function ax(o) {
        var k = o.strNhanSu_DGPL_Nam_KH_Id || o.strNhanSu_DGPL_LTT_KH_Id;
        return trang(AX.filter(function (r) {
            return (!k || r.NHANSU_DGPL_NAM_KEHOACH_ID === k) && (!o.strDoiTuongApDung_Id || r.DOITUONGAPDUNG_ID === o.strDoiTuongApDung_Id);
        }), o);
    }

    var LD = [
        { ID: 'NS1', HODEM: 'Nguyễn Văn', TEN: 'Hùng', MASO: 'CB001', ANH: '' },
        { ID: 'NS3', HODEM: 'Lê Quang', TEN: 'Minh', MASO: 'CB102', ANH: '' }
    ];
    var NV = {
        NS1: [{ ID: 'PC1', HODEM: 'Trần Thị', TEN: 'Mai', MASO: 'CB015', ANH: '' }, { ID: 'PC2', HODEM: 'Lê Quang', TEN: 'Minh', MASO: 'CB102', ANH: '' }],
        NS3: [{ ID: 'PC3', HODEM: 'Phạm Thu', TEN: 'Hà', MASO: 'CB210', ANH: '' }]
    };
    function nv(o) { return NV[o.strNhansu_Hosocanbo_LD_Id] || []; }

    var TC_NLD = [
        { ID: 'TCN1', TIEUCHI: 'Chính trị, tư tưởng', NHANSU_DGPL_NAM_KEHOACH_ID: 'KHN1', NHOMTIEUCHI_ID: 'NT1', LOAIDOITUONG_ID: 'DT1', THUTU: 1 },
        { ID: 'TCN2', TIEUCHI: 'Đạo đức, lối sống', NHANSU_DGPL_NAM_KEHOACH_ID: 'KHN1', NHOMTIEUCHI_ID: 'NT1', LOAIDOITUONG_ID: 'DT1', THUTU: 2 },
        { ID: 'TCN3', TIEUCHI: 'Kết quả thực hiện chức trách, nhiệm vụ được giao', NHANSU_DGPL_NAM_KEHOACH_ID: 'KHN1', NHOMTIEUCHI_ID: 'NT2', LOAIDOITUONG_ID: 'DT2', THUTU: 3 }
    ];
    var TC_LTT = [
        { ID: 'TCL1', TIEUCHI: 'Hoàn thành khối lượng giảng dạy', NHANSU_DGPL_LTT_KEHOACH_ID: 'KHL1', DIEMCHUAN: 40, THUTU: 1, LOAIDOITUONGAPDUNG_ID: 'LA1' },
        { ID: 'TCL2', TIEUCHI: 'Chấp hành nội quy lao động', NHANSU_DGPL_LTT_KEHOACH_ID: 'KHL1', DIEMCHUAN: 30, THUTU: 2, LOAIDOITUONGAPDUNG_ID: 'LA1' },
        { ID: 'TCL3', TIEUCHI: 'Hoàn thành nhiệm vụ chuyên môn phòng ban', NHANSU_DGPL_LTT_KEHOACH_ID: 'KHL2', DIEMCHUAN: 70, THUTU: 1, LOAIDOITUONGAPDUNG_ID: 'LA2' }
    ];
    var THUONG = [
        { ID: 'TT1', TIEUCHI: 'Có bài báo quốc tế trong kỳ', NHANSU_DGPL_LTT_KEHOACH_ID: 'KHL1', DIEMCHUAN: 10, THUTU: 1 },
        { ID: 'TT2', TIEUCHI: 'Được khen thưởng cấp Bộ', NHANSU_DGPL_LTT_KEHOACH_ID: 'KHL1', DIEMCHUAN: 5, THUTU: 2 }
    ];
    var TRU = [
        { ID: 'TR1', TIEUCHI: 'Đi muộn quá 3 lần/tháng', NHANSU_DGPL_LTT_TC_ID: 'TCL2', LOAIDOITUONGAPDUNG_ID: 'LA1', DIEMCHUAN: 5, THUTU: 1, PHUONGTHUCLAYTHONGTIN_ID: 'PT1' },
        { ID: 'TR2', TIEUCHI: 'Không hoàn thành giờ chuẩn', NHANSU_DGPL_LTT_TC_ID: 'TCL1', LOAIDOITUONGAPDUNG_ID: 'LA1', DIEMCHUAN: 10, THUTU: 2, PHUONGTHUCLAYTHONGTIN_ID: 'PT2' }
    ];
    var QD = [
        { ID: 'QD1', NHANSU_DGPL_LTT_KEHOACH_ID: 'KHL1', MUCDIEMCANDUOI: 90, MUCDIEMCANTREN: 100, XEPLOAI_ID: 'XL1', XEPLOAI_TEN: 'Loại A' },
        { ID: 'QD2', NHANSU_DGPL_LTT_KEHOACH_ID: 'KHL1', MUCDIEMCANDUOI: 70, MUCDIEMCANTREN: 89, XEPLOAI_ID: 'XL2', XEPLOAI_TEN: 'Loại B' },
        { ID: 'QD3', NHANSU_DGPL_LTT_KEHOACH_ID: 'KHL1', MUCDIEMCANDUOI: 0, MUCDIEMCANTREN: 69, XEPLOAI_ID: 'XL3', XEPLOAI_TEN: 'Loại C' }
    ];
    function loc(rows, o, cols, khKey) {
        return trang(like(rows, o.strTuKhoa, cols).filter(function (r) {
            return !khKey || !o[khKey.p] || r[khKey.c] === o[khKey.p];
        }), o);
    }
    var KHL = { p: 'strNhanSu_DGPL_LTT_KH_Id', c: 'NHANSU_DGPL_LTT_KEHOACH_ID' };

    ums.demo.add({
        'NS_PLDG_NLD_KeHoach/LayDanhSach': kh(KH_NLD),
        'NS_PLDG_LTT_KeHoach/LayDanhSach': kh(KH_LTT),
        'NS_PLDG_NLD_AnhXa/LayDanhSach': ax,
        'NS_PLDG_LTT_AnhXa/LayDanhSach': ax,
        'NS_PLDG_NLD_PhanCap/LayDanhSachLanhDao': LD,
        'NS_PLDG_LTT_PhanCap/LayDanhSachLanhDao': LD,
        'NS_PLDG_NLD_PhanCap/LayDanhSachNhanVien': nv,
        'NS_PLDG_LTT_PhanCap/LayDanhSachNhanVien': nv,
        'NS_PLDG_NLD_TieuChi/LayDanhSach': function (o) { return trang(like(TC_NLD, o.strTuKhoa, ['TIEUCHI']), o); },
        'NS_PLDG_LTT_TieuChi/LayDanhSach': function (o) {
            return trang(like(TC_LTT, o.strTuKhoa, ['TIEUCHI']).filter(function (r) {
                return (!o.strNhanSu_DGPL_LTT_KH_Id || r.NHANSU_DGPL_LTT_KEHOACH_ID === o.strNhanSu_DGPL_LTT_KH_Id) &&
                       (!o.strLoaiDoiTuongApDung_Id || r.LOAIDOITUONGAPDUNG_ID === o.strLoaiDoiTuongApDung_Id);
            }), o);
        },
        'NS_PLDG_LTT_TieuChiThuong/LayDanhSach': function (o) { return loc(THUONG, o, ['TIEUCHI'], KHL); },
        'NS_PLDG_LTT_TieuChiTru/LayDanhSach': function (o) {
            return trang(like(TRU, o.strTuKhoa, ['TIEUCHI']).filter(function (r) {
                return (!o.strNhanSu_DGPL_LTT_TC_Id || r.NHANSU_DGPL_LTT_TC_ID === o.strNhanSu_DGPL_LTT_TC_Id) &&
                       (!o.strPhuongThucLayThongTin_Id || r.PHUONGTHUCLAYTHONGTIN_ID === o.strPhuongThucLayThongTin_Id);
            }), o);
        },
        'NS_PLDG_LTT_QuyDinh/LayDanhSach': function (o) { return loc(QD, o, ['XEPLOAI_TEN'], KHL); },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LDVN': [dm('DT1', 'VCQL', 'Viên chức quản lý'), dm('DT2', 'VC', 'Viên chức không giữ chức vụ quản lý'), dm('DT3', 'NLD', 'Người lao động')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.NTCD': [dm('NT1', 'CT', 'Chính trị, đạo đức'), dm('NT2', 'CM', 'Chuyên môn, nghiệp vụ')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LDTL': [dm('LA1', 'GV', 'Giảng viên'), dm('LA2', 'CBNV', 'Cán bộ nhân viên')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.XLTL': [dm('XL1', 'A', 'Loại A'), dm('XL2', 'B', 'Loại B'), dm('XL3', 'C', 'Loại C')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.PTLT': [dm('PT1', 'CC', 'Từ dữ liệu chấm công'), dm('PT2', 'KLGD', 'Từ khối lượng giảng dạy'), dm('PT3', 'TAY', 'Nhập tay')]
    });
})();
