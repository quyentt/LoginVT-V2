/* Dữ liệu mẫu cho khaosat/kehoach — chỉ dùng ở chế độ dựng thử. Hộp chọn SV / nhân sự dùng mẫu chung ở demo-data.js. */
(function () {
    var C = 'KS_ThongTin/', T = 'KS_TaoPhieu/', D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {}, seq = 100;
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var KH = [
        { ID: 'KSK1', TENKEHOACH: 'Lấy ý kiến người học về giảng viên HK1 2026–2027', NGAYBATDAU: '01/12/2026', NGAYKETTHUC: '31/12/2026', CHEDOKHAOSAT: 1, CHEDOKHAOSAT_TEN: 1,
          TONGSOPHIEUGUI: 1200, TONGSOPHIEUDATHUCHIEN: 870, KS_PHIEUKHAOSAT_MAU_ID: 'PH1', KS_PHIEUKHAOSAT_MAU_TEN: 'Phiếu lấy ý kiến người học về giảng viên',
          NAMHOC: '2026-2027', HOCKY: '1', DOTHOC: '1', NOIDUNGKEHOACH: 'Khảo sát cuối học kỳ' },
        { ID: 'KSK2', TENKEHOACH: 'Khảo sát mức độ hài lòng của cán bộ 2026', NGAYBATDAU: '01/10/2026', NGAYKETTHUC: '15/10/2026', CHEDOKHAOSAT: 0, CHEDOKHAOSAT_TEN: 0,
          TONGSOPHIEUGUI: 0, TONGSOPHIEUDATHUCHIEN: 0, KS_PHIEUKHAOSAT_MAU_ID: 'PH2', KS_PHIEUKHAOSAT_MAU_TEN: 'Khảo sát mức độ hài lòng của cán bộ', NAMHOC: '2026', HOCKY: '', DOTHOC: '', NOIDUNGKEHOACH: '' }
    ];
    fx[C + 'LayDSKS_KeHoachKhaoSat'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var r = KH.filter(function (k) { return !q || k.TENKEHOACH.toLowerCase().indexOf(q) >= 0; });
        return { rows: r, pager: r.length };
    };
    function luuKH(o) {
        var r = o.strId ? KH.filter(function (k) { return k.ID === o.strId; })[0] : null;
        if (!r) { r = { ID: 'KSK' + (seq++), TONGSOPHIEUGUI: 0, TONGSOPHIEUDATHUCHIEN: 0 }; KH.push(r); }
        r.TENKEHOACH = o.strTenKeHoach; r.NGAYBATDAU = o.strNgayBatDau; r.NGAYKETTHUC = o.strNgayKetThuc; r.CHEDOKHAOSAT = o.dCheDoKhaoSat; r.CHEDOKHAOSAT_TEN = o.dCheDoKhaoSat;
        r.NAMHOC = o.strNamHoc; r.HOCKY = o.strHocKy; r.DOTHOC = o.strDotHoc; r.KS_PHIEUKHAOSAT_MAU_ID = o.strKS_PhieuKhaoSat_Mau_Id; r.NOIDUNGKEHOACH = o.strNoiDungKeHoach;
        return { rows: [], raw: { Id: r.ID } };
    }
    fx[C + 'Them_KS_KeHoachKhaoSat'] = luuKH; fx[C + 'Sua_KS_KeHoachKhaoSat'] = luuKH;
    fx[C + 'Xoa_KS_KeHoachKhaoSat'] = function (o) { KH = KH.filter(function (k) { return k.ID !== o.strId; }); return []; };
    fx[T + 'ResetKetQuaTaoPhieu'] = [];
    fx[C + 'LayDSPhieu_Mau_NguoiDung'] = [{ ID: 'PH1', TENPHIEU: 'Phiếu lấy ý kiến người học về giảng viên' }, { ID: 'PH2', TENPHIEU: 'Khảo sát mức độ hài lòng của cán bộ' }];
    fx[D + 'KS.PHANLOAI.DOITUONGDUOCKHAOSAT'] = [dm('LD1', 'GV', 'Giảng viên'), dm('LD2', 'HP', 'Học phần'), dm('LD3', 'DV', 'Đơn vị')];

    /* Đối tượng được khảo sát / tham gia — theo kế hoạch */
    var DKS = [{ ID: 'DK1', KH: 'KSK1', KYHIEU: 'CB001', TEN: 'Nguyễn Văn Hùng', GHICHU: '', LOAIDOITUONGDUOCKS_TEN: 'Giảng viên' }];
    var DTG = [{ ID: 'DT1', KH: 'KSK1', MASO: 'BIT220101', TEN: 'Nguyễn Văn An', GHICHU: '', LOAIDOITUONGTHAMGIAKS_TEN: 'Sinh viên' },
               { ID: 'DT2', KH: 'KSK1', MASO: 'BIT220102', TEN: 'Trần Thị Bình', GHICHU: '', LOAIDOITUONGTHAMGIAKS_TEN: 'Sinh viên' }];
    function kho(ds, rows, maCol, maParam, loaiCol) {
        fx[C + 'LayDS' + ds] = function (o) { var r = rows.filter(function (x) { return x.KH === o.strKS_KeHoachKhaoSat_Id; }); return { rows: r, pager: r.length }; };
        fx[C + 'Them_' + ds] = function (o) { var x = { ID: 'X' + (seq++), KH: o.strKS_KeHoachKhaoSat_Id, TEN: o.strTen, GHICHU: o.strGhiChu }; x[maCol] = o[maParam]; x[loaiCol] = o.strKS_LoaiDoiTuong_Id ? 'Loại ' + o.strKS_LoaiDoiTuong_Id : ''; rows.push(x); return []; };
        fx[C + 'Xoa_' + ds] = function (o) { for (var i = rows.length - 1; i >= 0; i--) if (rows[i].ID === o.strId) rows.splice(i, 1); return []; };
    }
    kho('KS_DoiTuongDuocKhaoSat', DKS, 'KYHIEU', 'strKyHieu', 'LOAIDOITUONGDUOCKS_TEN');
    kho('KS_DoiTuongThamGiaKhaoSat', DTG, 'MASO', 'strMaSo', 'LOAIDOITUONGTHAMGIAKS_TEN');

    /* Phiếu của kế hoạch */
    var PK = [{ ID: 'PK1', KH: 'KSK1', TENPHIEU: 'Phiếu — TS. Nguyễn Văn Hùng', MAPHIEU: 'PK01', MOTA: '', TYLE: '72.5%', KS_KEHOACHKHAOSAT_ID: 'KSK1' }];
    fx[C + 'LayDSKS_PhieuKhaoSat'] = function (o) { return PK.filter(function (p) { return p.KH === o.strKS_KeHoachKhaoSat_Id; }); };
    fx[C + 'Xoa_KS_PhieuKhaoSat'] = function (o) { PK = PK.filter(function (p) { return p.ID !== o.strId; }); return []; };
    fx[T + 'KhoiTaoPhieuTheoPhieuMau'] = function (o) {
        var p = o.strId ? PK.filter(function (x) { return x.ID === o.strId; })[0] : null;
        if (!p) { p = { ID: 'PK' + (seq++), KH: o.strKS_KeHoachKhaoSat_Id, TYLE: '0%', KS_KEHOACHKHAOSAT_ID: o.strKS_KeHoachKhaoSat_Id }; PK.push(p); }
        p.TENPHIEU = o.strTenPhieu; p.MAPHIEU = o.strMaPhieu; p.MOTA = o.strMoTa;
        return { rows: [], raw: { Id: p.ID } };
    };
    fx[T + 'GenPhieuBanTuDong'] = [];
    fx[C + 'LayDSKS_PhieuKhaoSat_DuocKS'] = function (o) { return o.strKS_PhieuKhaoSat_Id === 'PK1' ? [{ KS_DOITUONGDUOCKHAOSAT_ID: 'DK1' }] : []; };
    fx[C + 'Them_KS_PhieuKhaoSat_DuocKS'] = [];
    var TG = [{ ID: 'TG1', P: 'PK1', KS_DOITUONGTHAMGIAKHAOSAT_ID: 'DT1', KS_DOITUONGTHAMGIAKHAOSAT_MASO: 'BIT220101', KS_DOITUONGTHAMGIAKHAOSAT_TEN: 'Nguyễn Văn An', MOTA: '' }];
    fx[C + 'LayDSKS_PhieuKhaoSatThamGiaKS'] = function (o) { return TG.filter(function (x) { return x.P === o.strKS_PhieuKhaoSat_Id; }); };
    fx[C + 'LayDS_DoiTuongThamGiaChuaDung'] = function (o) {
        return DTG.filter(function (d) { return d.KH === o.strKS_KeHoachKhaoSat_Id && !TG.some(function (t) { return t.P === o.strKS_PhieuKhaoSat_Id && t.KS_DOITUONGTHAMGIAKHAOSAT_ID === d.ID; }); })
            .map(function (d) { return { ID: d.ID, MASO: d.MASO, TEN: d.TEN, MOTA: '' }; });
    };
    fx[C + 'Them_KS_PhieuKhaoSat_ThamGiaKS'] = function (o) {
        var d = DTG.filter(function (x) { return x.ID === o.strKS_DoiTuongThamGiaKS_Id; })[0] || {};
        TG.push({ ID: 'TG' + (seq++), P: o.strKS_PhieuKhaoSat_Id, KS_DOITUONGTHAMGIAKHAOSAT_ID: d.ID, KS_DOITUONGTHAMGIAKHAOSAT_MASO: d.MASO, KS_DOITUONGTHAMGIAKHAOSAT_TEN: d.TEN, MOTA: '' });
        return [];
    };
    fx[C + 'Xoa_KS_PhieuKhaoSat_ThamGiaKS'] = function (o) { TG = TG.filter(function (x) { return x.ID !== o.strId; }); return []; };

    /* Phiếu tự động */
    fx[C + 'LayDSThoiGianDangKyHoc'] = [{ ID: 'TGD1', THOIGIAN: '2026_2027_1' }, { ID: 'TGD2', THOIGIAN: '2025_2026_2' }];
    fx[C + 'LayDSGiangVienTheoThoiGian'] = [{ ID: 'NS1', MASO: 'CB001', HODEM: 'Nguyễn Văn', TEN: 'Hùng', DONVI_TEN: 'Khoa CNTT' }, { ID: 'NS3', MASO: 'CB102', HODEM: 'Lê Quang', TEN: 'Minh', DONVI_TEN: 'Khoa CNTT' }];
    fx[C + 'LayDSHocPhanTheoThoiGian'] = [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng', HOCTRINH: 3, DONVI_TEN: 'Khoa CNTT' }];
    fx[C + 'LayDSLopHocPhanTheoThoiGian'] = [{ ID: 'LHP1', GIANGVIEN_TEN: 'Nguyễn Văn Hùng', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', TENLOP: 'IT3100.01', THOIGIAN: '2026_2027_1' },
                                             { ID: 'LHP2', GIANGVIEN_TEN: '', DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', TENLOP: 'IT3200.02', THOIGIAN: '2026_2027_1' }];
    fx[T + 'GenPhieuTuDongTrucTiepGV1'] = []; fx[T + 'GenPhieuTuDongTrucTiepGV2'] = [];
    fx['khaosat_taophieu.GenPhieuTuDongTrucTiepGV3'] = [];

    /* Kết quả */
    fx[C + 'LayDSKS_DoiTuongThamGiaChuaKS'] = { rows: [{ KS_DOITUONGTHAMGIAKHAOSAT_MA: 'BIT220102', KS_DOITUONGTHAMGIAKHAOSAT_HO: 'Trần Thị', KS_DOITUONGTHAMGIAKHAOSAT_TEN: 'Bình', KS_PHIEUKHAOSAT_TEN: 'Phiếu — TS. Nguyễn Văn Hùng' }], pager: 1 };
    fx[C + 'LayDSKS_KetQuaKhaoSat'] = {
        rows: { rs: [{ ID: 'KQ1', KS_DOITUONGTHAMGIAKHAOSAT_ID: 'DT1', KS_DOITUONGTHAMGIAKHAOSAT_MA: 'BIT220101', KS_DOITUONGTHAMGIAKHAOSAT_HO: 'Nguyễn Văn', KS_DOITUONGTHAMGIAKHAOSAT_TEN: 'An', GHICHU: '',
            KS_PHIEUKHAOSAT_ID: 'PK1', KS_PHIEUKHAOSAT_TEN: 'Phiếu — TS. Nguyễn Văn Hùng', KETQUA: 'Đã khảo sát', KS_DOITUONGDUOCKHAOSAT_ID: 'DK1', KS_DOITUONGDUOCKHAOSAT_MA: 'CB001',
            KS_DOITUONGDUOCKHAOSAT_TEN: 'Nguyễn Văn Hùng', KS_KEHOACHKHAOSAT_ID: 'KSK1' }],
          rsCauHoi: [{ KS_CAUHOI_ID: 'CH1', KS_CAUHOI_TEN: 'Giới thiệu đề cương' }, { KS_CAUHOI_ID: 'CH2', KS_CAUHOI_TEN: 'Tài liệu học tập' }] },
        pager: 1
    };
    fx[T + 'LayDSKetQuaTraLoiTheo'] = function (o) { return [{ KETQUA: o.strKS_CauHoi_Id === 'CH1' ? 'Hoàn toàn đồng ý' : 'Giáo trình' }]; };
    fx['KHAOSAT_BAOCAO.LayDSKS_KhoaKhaoSat'] = [{ ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' }, { ID: 'K68', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68' }];

    /* Hộp "Thêm SV từ đăng ký học" */
    fx['DKH_Chung/LayThoiGianDangKyHoc'] = [{ ID: 'TGD1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }];
    fx['DKH_PhanCong_LopHP/LayDSKhoaToChuc'] = [{ ID: 'K67', TENKHOA: 'Khóa 67' }];
    fx['DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc'] = [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }];
    fx['DKH_PhanCong_LopHP/LayDSHocPhan'] = [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng' }];
    fx['DKH_ThongTin/LayDSDangKy_KeHoachDangKy'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'KHDK1', TENKEHOACH: 'Đăng ký học HK1 2026–2027' }] : []; };
    fx['pkg_kehoach_thongtin.LayDSKhoaQuanLy'] = [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }];
    fx[D + 'KHDT.DIEM.KIEUHOC'] = [dm('KH1', 'HM', 'Học mới'), dm('KH2', 'HL', 'Học lại')];
    fx['pkg_dangkyhoc_thongtin2.LayDSDangKyHoc'] = function () {
        var r = [
            { ID: 'DKR1', QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
              DAOTAO_KHOAQUANLY_TEN: 'Khoa CNTT', LOPRIENG: '', DANGKY_LOPHOCPHAN_MA: 'IT3100.01', DANGKY_LOPHOCPHAN_TEN: 'LTHĐT 01', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', SOTINCHI: 3, KIEUHOC_TEN: 'Học mới', SOTIENDANOP: 0 },
            { ID: 'DKR2', QLSV_NGUOIHOC_ID: 'NH04', QLSV_NGUOIHOC_MASO: 'BIT230210', QLSV_NGUOIHOC_HODEM: 'Phạm Thu', QLSV_NGUOIHOC_TEN: 'Dung', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Hệ thống thông tin',
              DAOTAO_KHOAQUANLY_TEN: 'Khoa CNTT', LOPRIENG: 'x', DANGKY_LOPHOCPHAN_MA: 'IT3100.05', DANGKY_LOPHOCPHAN_TEN: 'LTHĐT 05', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', SOTINCHI: 3, KIEUHOC_TEN: 'Học lại', SOTIENDANOP: 1500000 }
        ];
        return { rows: r, pager: r.length };
    };
    ums.demo.add(fx);
})();
