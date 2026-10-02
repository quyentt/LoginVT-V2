/* Dữ liệu mẫu cho nguyenvong (Đăng ký nguyện vọng) — chỉ dùng ở chế độ dựng thử. Người học mẫu: SV0001. */
(function () {
    var fx = {};
    fx['pkg_dangkyhoc_chung.LayDSChuongTrinh'] = [{
        QLSV_NGUOIHOC_ID: 'SV0001', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy',
        DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ kỹ thuật ô tô - Khóa 16'
    }, {
        QLSV_NGUOIHOC_ID: 'SV0001', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy',
        DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh (ngành 2) - Khóa 16'
    }];
    fx['pkg_dangky_nguyenvong.LayDSKeHoachDangKyNguyenVong'] = [
        { ID: 'KHNV1', TENKEHOACH: 'Lấy nguyện vọng học kỳ 1 năm học 2026-2027', SOTINCHITOIDA: 24 },
        { ID: 'KHNV2', TENKEHOACH: 'Lấy nguyện vọng học kỳ hè 2026', SOTINCHITOIDA: 10 }
    ];
    fx['pkg_dangky_nguyenvong.LayDSKieuDangKyTheoKeHoach'] = function (o) {
        if (!o.strKeHoachNguyenVong_Id) return [];
        return [{ ID: 'KH_MOI', TEN: 'Học mới' }, { ID: 'KH_LAI', TEN: 'Học lại' }, { ID: 'KH_CT', TEN: 'Học cải thiện điểm' }];
    };
    fx['pkg_dangky_nguyenvong.LayDSQuyMoLopDangKy'] = function (o) {
        if (!o.strDangKy_NguyenVong_Id) return [];
        return [{ ID: 'QM1', TEN: 'Lớp thường (tối đa 60 sinh viên)' }, { ID: 'QM2', TEN: 'Lớp nhỏ (tối đa 25 sinh viên)' }];
    };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.NGUYENVONG.MOHINH'] =
        [{ ID: 'MH1', TEN: 'Học trực tiếp' }, { ID: 'MH2', TEN: 'Học trực tuyến' }];

    function hp(id, ma, ten, tc, diem, dg, kk, tg, rb) {
        return { ID: id, DAOTAO_HOCPHAN_ID: 'HP_' + ma, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, HOCTRINHAPDUNGHOCTAP: tc,
            DIEM: diem, DANHGIA_ID: dg === 'Đạt' ? 'DG1' : 'DG2', DANHGIA_TEN: dg, THUOCKHOIKIENTHUC: kk, THOIGIAN: tg,
            THONGTINQUANHEHOCPHAN: rb || '', DAOTAO_THOIGIANDAOTAO_ID: 'TG261', DANGKY_KEHOACHLAYNGUYENVONG_ID: 'KHNV1' };
    }
    var POOL = [
        hp('N1', 'OTO3021', 'Hệ thống truyền lực ô tô', 3, '', '', 'Kiến thức ngành', 'Học kỳ 1 - năm thứ 3', 'Học trước: OTO2031'),
        hp('N2', 'OTO3035', 'Chẩn đoán kỹ thuật ô tô', 3, '', '', 'Kiến thức ngành', 'Học kỳ 1 - năm thứ 3', ''),
        hp('N3', 'OTO2031', 'Động cơ đốt trong', 3, 3.9, 'Không đạt', 'Kiến thức cơ sở ngành', 'Học kỳ 2 - năm thứ 2', ''),
        hp('N4', 'ENG1103', 'Tiếng Anh cơ sở 3', 3, '', '', 'Kiến thức đại cương', 'Học kỳ 1 - năm thứ 3', 'Học trước: ENG1102'),
        hp('N5', 'MAT1012', 'Giải tích 2', 2, 2.5, 'Không đạt', 'Kiến thức đại cương', 'Học kỳ 2 - năm thứ 1', '')
    ];
    var DA = {        // ID dòng đã đăng ký → quy mô / hình thức đã chọn
        N5: { QUYMOLOP_TEN: 'Lớp thường (tối đa 60 sinh viên)', MOHINHHOC_TEN: 'Học trực tiếp' }
    };
    function loc(da) {
        return POOL.filter(function (x) { return !!DA[x.ID] === da; }).map(function (x) {
            return Object.assign({}, x, da ? Object.assign({ NGAYTAO_DD_MM_YYYY: '20/09/2026', NGUOITAO_TAIKHOAN: '25001029' }, DA[x.ID]) : {});
        });
    }
    fx['pkg_dangky_nguyenvong.LayDSHocPhanChuaDangKy'] = function (o) { return o.strKeHoachNguyenVong_Id && o.strKieuHoc_Id ? loc(false) : []; };
    fx['pkg_dangky_nguyenvong.LayDSHocPhanDaDangKy'] = function (o) { return o.strKeHoachNguyenVong_Id ? loc(true) : []; };
    fx['pkg_dangky_nguyenvong.DangKyNguyenVong'] = function (o) {
        var r = POOL.filter(function (x) { return x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; })[0];
        if (r) DA[r.ID] = { QUYMOLOP_TEN: o.strQuyMoLop_Id === 'QM2' ? 'Lớp nhỏ (tối đa 25 sinh viên)' : (o.strQuyMoLop_Id ? 'Lớp thường (tối đa 60 sinh viên)' : ''),
            MOHINHHOC_TEN: o.strMoHinhHoc_Id === 'MH2' ? 'Học trực tuyến' : (o.strMoHinhHoc_Id ? 'Học trực tiếp' : '') };
        return [];
    };
    fx['pkg_dangky_nguyenvong.HuyDangKyNguyenVong'] = function (o) { delete DA[o.strIds]; return []; };

    var PHI = { OTO3021: 1350000, OTO3035: 1350000, OTO2031: 1350000, ENG1103: 1350000, MAT1012: 900000 };
    fx['pkg_taichinh_tinhtien.LayDSPhiTheoHocPhan'] = function (o) {
        var ma = String(o.strDaoTao_HocPhan_Id || '').replace('HP_', '');
        return [{ PHIPHAIDONG: PHI[ma] || 1200000, PHIDUOCMIEN: ma === 'MAT1012' ? 200000 : 0 }];
    };
    ums.demo.add(fx);
})();
