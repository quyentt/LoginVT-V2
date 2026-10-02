/* Dữ liệu mẫu cho nhapdiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    fx['D_LoaiDanhSach/LayLoaiDanhSach'] = [{ ID: 'LDS1', TEN: 'Lớp học phần' }, { ID: 'LDS2', TEN: 'Danh sách thi' }];
    fx['D_ThoiGian/LayDanhSach'] = function (o) { return o.strLoaiDanhSach_Id ? [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }] : []; };
    fx['D_HocPhan/LayDanhSach'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'IT3100 - Lập trình HĐT' }] : []; };
    fx['D_Hoc/LayDanhSach'] = function () {
        return { rows: [{ ID: 'BD1', LOAIDANHSACH_TEN: 'Lớp học phần', MA: 'IT3100.01', TEN: 'Lập trình HĐT - Nhóm 1', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT',
            SOLUONG: 3, TYLENHAPDIEM: 67, DAOTAO_THOIGIANDAOTAO: '2026_2027_1', DAOTAO_KHOADAOTAO_MA: 'K67' },
            { ID: 'BD2', LOAIDANHSACH_TEN: 'Lớp học phần', MA: 'IT3100.02', TEN: 'Lập trình HĐT - Nhóm 2', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT',
            SOLUONG: 0, TYLENHAPDIEM: 0, DAOTAO_THOIGIANDAOTAO: '2026_2027_1', DAOTAO_KHOADAOTAO_MA: 'K67' }], pager: 2 };
    };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.NHAPDIEM.SAPXEP'] = [];
    fx['D_CongThuc/LayChiTiet'] = function () {
        return { rows: { rsDSCotThongTinNguoiHoc: [{ MACOT: 'MASO', TENCOT: 'Mã số' }, { MACOT: 'HOTEN', TENCOT: 'Họ tên', CHUDAM: 'font-weight:bold' }, { MACOT: 'LOP', TENCOT: 'Lớp' }],
            rsDSCotThongTinDiem: [{ MACOT: 'QT', TENCOT: 'Điểm quá trình', MACOT_CHA: null }, { MACOT: 'CC', TENCOT: 'Chuyên cần', MACOT_CHA: 'QT', THANGDIEM: 10 },
                { MACOT: 'GK', TENCOT: 'Giữa kỳ', MACOT_CHA: 'QT', THANGDIEM: 10 }, { MACOT: 'CK', TENCOT: 'Cuối kỳ', MACOT_CHA: null, THANGDIEM: 10 },
                { MACOT: 'TK', TENCOT: 'Tổng kết', MACOT_CHA: null, THANGDIEM: 10 }, { MACOT: 'CHU', TENCOT: 'Điểm chữ', MACOT_CHA: null }] } };
    };
    var NH = [['SV1', 'SV2201', 'Trần Minh Anh'], ['SV2', 'SV2202', 'Lê Thu Hà'], ['SV3', 'SV2203', 'Phạm Quốc Bảo']].map(function (x, i) {
        return { ID: 'DSNH' + i, QLSV_NGUOIHOC_ID: x[0], MASO: x[1], HOTEN: x[2], LOP: 'KTPM01', HODEMNGUOIHOC: x[2].split(' ').slice(0, -1).join(' '), TENNGUOIHOC: x[2].split(' ').pop(),
            DAOTAO_HOCPHAN_ID: 'HP1', DIEM_DANHSACHHOC_ID: 'BD1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', CHUONGTRINH_ID: 'CT1', LANHOC: 1, LANTHI: 1 };
    });
    fx['D_Hoc_NguoiHoc/LayDanhSach'] = function (o) { return o.strDiem_DanhSachHoc_Id === 'BD1' ? NH : []; };
    var DIEM = { CC: [9, 8, ''], GK: [7.5, 6, ''], CK: [8, 5.5, ''], TK: [8.1, 6.1, ''], CHU: ['B+', 'C', ''] };
    fx['D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach'] = function (o) {
        return NH.map(function (n, i) { return { QLSV_NGUOIHOC_ID: n.QLSV_NGUOIHOC_ID, GIATRICOTDULIEU: DIEM[o.strKyHieuCotDuLieu][i], CHIXEM: /TK|CHU/.test(o.strKyHieuCotDuLieu) ? 1 : 0 }; });
    };
    fx['D_Hoc_NguoiHoc_Diem/Nhan_Diem_NguoiHoc_ThanhPhan'] = function (o) {
        var i = NH.map(function (n) { return n.QLSV_NGUOIHOC_ID; }).indexOf(o.strQLSV_NguoiHoc_Id);
        if (DIEM[o.strDiem_ThanhPhanDiem_Id] && i >= 0) DIEM[o.strDiem_ThanhPhanDiem_Id][i] = o.strDiem; return [];
    };
    fx['D_Hoc_NguoiHoc_Diem/Tinh_Diem_NguoiHoc_ThanhPhan'] = function (o) {
        var i = NH.map(function (n) { return n.QLSV_NGUOIHOC_ID; }).indexOf(o.strQLSV_NguoiHoc_Id);
        var cc = Number(DIEM.CC[i]) || 0, gk = Number(DIEM.GK[i]) || 0, ck = Number(DIEM.CK[i]) || 0;
        if (DIEM.CK[i] !== '') { DIEM.TK[i] = Math.round((cc * 0.1 + gk * 0.3 + ck * 0.6) * 10) / 10; DIEM.CHU[i] = DIEM.TK[i] >= 8.5 ? 'A' : DIEM.TK[i] >= 7 ? 'B' : DIEM.TK[i] >= 5.5 ? 'C' : 'D'; }
        return [];
    };
    fx['TP_XuLyTuKhoa/QuyDoiRubricTheoLopHocPhan'] = [];
    fx['D_HanhDongXacNhan/LayDanhSach'] = [{ ID: 'HDX1', TEN: 'Hoàn thành' }, { ID: 'HDX2', TEN: 'Huỷ hoàn thành' }];
    var LS = [];
    fx['D_XacNhan/LayDSDiem_XacNhan'] = function (o) { return LS.filter(function (x) { return x.id === o.strDuLieuXacNhan && x.loai === o.strLoaiXacNhan_Id; }); };
    fx['D_XacNhan/Them_Diem_XacNhan'] = function (o) { LS.unshift({ id: o.strDuLieuXacNhan, loai: o.strLoaiXacNhan_Id, TEN: o.strHanhDong_Id === 'HDX1' ? 'Hoàn thành' : 'Huỷ hoàn thành', NGUOIXACNHAN_TENDAYDU: 'Giảng viên', NGAYTAO_DD_MM_YYYY: '22/09/2026' }); return []; };
    fx['D_XuLyDiem/LayDSDauDiemThiTheoCongThuc'] = [{ ID: 'DD1', TEN: 'Cuối kỳ' }];
    fx['TP_Chung/LayTrangThaiTruocThi'] = [{ ID: 'TT1', TEN: 'Cấm thi' }, { ID: 'TT2', TEN: 'Vi phạm quy chế' }];
    fx['TP_XacNhanTruocThi/ThemMoi'] = [];
    fx['pkg_diem_thongke.ThongHocTapTheoLopHP'] = function () {
        var hp = [{ ID: 'T1', DAOTAO_KHOAQUANLY_ID: 'K1', DAOTAO_KHOAQUANLY_TEN: 'Khoa CNTT', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100' },
            { ID: 'T2', DAOTAO_KHOAQUANLY_ID: 'K1', DAOTAO_KHOAQUANLY_TEN: 'Khoa CNTT', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_MA: 'IT3200' },
            { ID: 'T3', DAOTAO_KHOAQUANLY_ID: 'K2', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô', DAOTAO_HOCPHAN_MA: 'EC1000' }];
        function dl(key, vals) { var r = []; hp.forEach(function (h, i) { vals.forEach(function (v, j) { for (var k = 0; k < (i + j) % 3 + 1; k++) { var o = { DAOTAO_HOCPHAN_ID: h.DAOTAO_HOCPHAN_ID, DAOTAO_KHOAQUANLY_ID: h.DAOTAO_KHOAQUANLY_ID }; o[key] = v; r.push(o); } }); }); return r; }
        return { rows: { rsThongTinHocPhan: hp,
            rsDanhMucDiemChu: [{ ID: 'A', TEN: 'A' }, { ID: 'B', TEN: 'B' }, { ID: 'C', TEN: 'C' }], rsDuLieuDiemChu: dl('DIEMQUYDOI_ID', ['A', 'B', 'C']),
            rsDanhMucDanhGia: [{ ID: 'DAT', TEN: 'Đạt' }, { ID: 'HL', TEN: 'Học lại' }], rsDuLieuDanhGia: dl('DANHGIA_ID', ['DAT', 'HL']),
            rsDanhMucDiemHe10: [{ ID: '8', TEN: '8' }, { ID: '9', TEN: '9' }], rsDuLieuDiemHe10: dl('DIEM', ['8', '9']),
            rsDanhMucDiemHe4: [{ ID: '3', TEN: '3.0' }, { ID: '4', TEN: '4.0' }], rsDuLieuDiemHe4: dl('DIEMQUYDOI', ['3', '4']) } };
    };
    ums.demo.add(fx);
})();
