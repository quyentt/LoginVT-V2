/* Dữ liệu mẫu cho congnhandiem + congnhandiemv3 — chỉ dùng ở chế độ dựng thử.
   Giữ đúng tên cột máy chủ trả; các đường GHI (đăng ký / huỷ / nhập học phần / lưu chứng chỉ)
   đổi luôn dữ liệu trong bộ nhớ để màn hình phản ánh thay đổi. Người học mẫu: SV0001. */
(function () {
    'use strict';
    var P = 'pkg_congthongtin_congnhandiem.', T = 'PKG_CONGTHONGTIN_CND_THONGTIN.';
    var fx = {};

    /* ---------- Danh mục chung ---------- */
    fx[P + 'LayDSKeHoachCongNhan'] = [
        { ID: 'KHCN1', TEN: 'Công nhận điểm đợt 1 - năm học 2026-2027' },
        { ID: 'KHCN2', TEN: 'Công nhận điểm đợt 2 - năm học 2026-2027' }
    ];
    fx['pkg_dangkyhoc_chung.LayDSChuongTrinh'] = [
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin - K16' },
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh - K16' }
    ];
    fx['pkg_diem_thongtin.LayDSDiem_CoSoCongNhanDiem'] = [
        { ID: 'CS1', TEN: 'Trường Đại học Ngoại ngữ - ĐHQG Hà Nội' },
        { ID: 'CS2', TEN: 'Trường Đại học Bách khoa Hà Nội' },
        { ID: 'CS3', TEN: 'IIG Việt Nam' }
    ];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.CHUNGCHI.PHANLOAI'] = [
        { ID: 'PL1', MA: 'NN', TEN: 'Chứng chỉ ngoại ngữ', CHUNG_TENDANHMUC_TEN: 'Loại chứng chỉ' },
        { ID: 'PL2', MA: 'TH', TEN: 'Chứng chỉ tin học', CHUNG_TENDANHMUC_TEN: 'Loại chứng chỉ' }
    ];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUN.DMTT'] = [
        { ID: 'T1', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: null },
        { ID: 'T2', TEN: 'Tỉnh Bắc Ninh', QUANHECHA_ID: null },
        { ID: 'H1', TEN: 'Quận Cầu Giấy', QUANHECHA_ID: 'T1' },
        { ID: 'H2', TEN: 'Quận Đống Đa', QUANHECHA_ID: 'T1' },
        { ID: 'H3', TEN: 'Thành phố Bắc Ninh', QUANHECHA_ID: 'T2' },
        { ID: 'X1', TEN: 'Phường Dịch Vọng', QUANHECHA_ID: 'H1' },
        { ID: 'X2', TEN: 'Phường Nghĩa Tân', QUANHECHA_ID: 'H1' },
        { ID: 'X3', TEN: 'Phường Láng Hạ', QUANHECHA_ID: 'H2' },
        { ID: 'X4', TEN: 'Phường Võ Cường', QUANHECHA_ID: 'H3' }
    ];
    fx[P + 'LayDSDiem_ThongTin_ChungChi'] = function (o) {
        return o.strPhanLoaiCC_Id === 'PL2'
            ? [{ ID: 'CC3', TENCHUNGCHI: 'Ứng dụng CNTT cơ bản' }]
            : [{ ID: 'CC1', TENCHUNGCHI: 'VSTEP' }, { ID: 'CC2', TENCHUNGCHI: 'IELTS' }];
    };
    fx[P + 'LaYDSDiem_TT_CC_CapDo'] = function (o) {
        if (!o.strDiem_ThongTin_ChungChi_Id) return [];
        return o.strDiem_ThongTin_ChungChi_Id === 'CC2'
            ? [{ ID: 'CD3', TENCAPDO: 'IELTS 5.5' }, { ID: 'CD4', TENCAPDO: 'IELTS 6.5' }]
            : [{ ID: 'CD1', TENCAPDO: 'Bậc 3 (B1)' }, { ID: 'CD2', TENCAPDO: 'Bậc 4 (B2)' }];
    };

    /* ---------- Danh sách học phần của kế hoạch (LayDSChuongTrinhHoc) ---------- */
    var HP = [
        { ID: 'CN1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'EN1010', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 1',
          HOCTRINHAPDUNGHOCTAP: 3, KETQUA: '', KETQUAMOI: '', TINHTRANGCONGNHAN: 0, TINHTRANGCONGNHAN_TEN: '' },
        { ID: 'CN2', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'EN1020', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 2',
          HOCTRINHAPDUNGHOCTAP: 3, KETQUA: '', KETQUAMOI: '8.0', TINHTRANGCONGNHAN: 1, TINHTRANGCONGNHAN_TEN: 'Đã đăng ký - chờ duyệt' },
        { ID: 'CN3', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_MA: 'IT1010', DAOTAO_HOCPHAN_TEN: 'Tin học đại cương',
          HOCTRINHAPDUNGHOCTAP: 2, KETQUA: '7.5', KETQUAMOI: '', TINHTRANGCONGNHAN: 0, TINHTRANGCONGNHAN_TEN: '' },
        { ID: 'CN4', DAOTAO_HOCPHAN_ID: 'HP4', DAOTAO_HOCPHAN_MA: 'PH1010', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương',
          HOCTRINHAPDUNGHOCTAP: 4, KETQUA: '', KETQUAMOI: '', TINHTRANGCONGNHAN: 0, TINHTRANGCONGNHAN_TEN: '' }
    ];
    function timHP(id) { return HP.filter(function (x) { return x.DAOTAO_HOCPHAN_ID === id; })[0]; }
    fx[P + 'LayDSChuongTrinhHoc'] = function (o) { return o.strDiem_KeHoachCongNhan_Id ? HP : []; };

    /* ---------- Từ bảng điểm: các dòng học phần tự nhập ---------- */
    var DONG = {               // học phần → [{ ID, TENHOCPHAN, SOTINCHI, DIEM, DIEMCONGNHAN }]
        HP2: [{ ID: 'D1', TENHOCPHAN: 'English for Academic Purposes', SOTINCHI: 4, DIEM: 8.0, DIEMCONGNHAN: 8.0 }]
    };
    var COSO = { HP2: 'CS2' };  // học phần → cơ sở đào tạo đã học
    fx[P + 'LayDSDiem_NguoiHoc_Diem_CN_HP'] = function (o) { return DONG[o.strDaoTao_HocPhan_Id] || []; };
    fx[P + 'LayTTCongNhanTuBangDiem'] = function (o) {
        var c = COSO[o.strDaoTao_HocPhan_Id];
        return c ? [{ DIEM_COSODAOTAOCONGNHANDIEM_ID: c }] : [];
    };
    fx[P + 'Them_Diem_NguoiHoc_Diem_CN_HP'] = function (o) {
        var l = DONG[o.strDaoTao_HocPhan_Id] || (DONG[o.strDaoTao_HocPhan_Id] = []);
        var id = 'D' + Date.now() + l.length;
        l.push({ ID: id, TENHOCPHAN: o.strTenHocPhan, SOTINCHI: o.dSoTinChi, DIEM: o.dDiem, DIEMCONGNHAN: o.dDiem });
        return { rows: [], raw: { Id: id } };
    };
    fx[P + 'Xoa_Diem_NguoiHoc_Diem_CN_HP'] = function (o) {
        Object.keys(DONG).forEach(function (k) { DONG[k] = DONG[k].filter(function (x) { return x.ID !== o.strId; }); });
        return [];
    };

    /* ---------- Đăng ký / huỷ công nhận (dùng chung cho cả hai bản) ---------- */
    var DAXAC = {};            // học phần đã xác nhận công nhận từ chứng chỉ
    fx[P + 'Them_Diem_NguoiHoc_Diem_CN'] = function (o) {
        var h = timHP(o.strDaoTao_HocPhan_Id);
        if (h) {
            h.TINHTRANGCONGNHAN = 1;
            h.TINHTRANGCONGNHAN_TEN = 'Đã đăng ký - chờ duyệt';
            h.KETQUAMOI = h.KETQUAMOI || '8.0';
        }
        if (o.strLoai === 'CC') DAXAC[o.strDaoTao_HocPhan_Id] = 1;
        if (o.strNoiCap_Id) COSO[o.strDaoTao_HocPhan_Id] = o.strNoiCap_Id;
        return { rows: [], raw: { Id: 'CN' + Date.now() } };
    };
    fx[P + 'Xoa_Diem_NguoiHoc_Diem_CN'] = function (o) {
        var h = timHP(o.strDaoTao_HocPhan_Id);
        if (h) { h.TINHTRANGCONGNHAN = 0; h.TINHTRANGCONGNHAN_TEN = ''; h.KETQUAMOI = ''; }
        delete DAXAC[o.strDaoTao_HocPhan_Id];
        return [];
    };
    fx[P + 'Them_Diem_NguoiHoc_Diem_CN_CC'] = [];   // bản cũ: lưu từng đầu điểm

    /* ---------- Chứng chỉ: đầu điểm, thông tin, học phần quy đổi ---------- */
    var DAUDIEM = {
        CD1: [{ ID: 'DD1', DIEM_THANHPHANDIEM_ID: 'TP1', DIEM_THANHPHANDIEM_TEN: 'Nghe', THANGDIEM_TEN: 'Thang 10' },
              { ID: 'DD2', DIEM_THANHPHANDIEM_ID: 'TP2', DIEM_THANHPHANDIEM_TEN: 'Nói', THANGDIEM_TEN: 'Thang 10' },
              { ID: 'DD3', DIEM_THANHPHANDIEM_ID: 'TP3', DIEM_THANHPHANDIEM_TEN: 'Đọc', THANGDIEM_TEN: 'Thang 10' },
              { ID: 'DD4', DIEM_THANHPHANDIEM_ID: 'TP4', DIEM_THANHPHANDIEM_TEN: 'Viết', THANGDIEM_TEN: 'Thang 10' }],
        CD2: [{ ID: 'DD5', DIEM_THANHPHANDIEM_ID: 'TP1', DIEM_THANHPHANDIEM_TEN: 'Nghe', THANGDIEM_TEN: 'Thang 10' },
              { ID: 'DD6', DIEM_THANHPHANDIEM_ID: 'TP2', DIEM_THANHPHANDIEM_TEN: 'Nói', THANGDIEM_TEN: 'Thang 10' }]
    };
    var GIATRI = { TP1: { DIEM: 7.5, GHICHU: 'Đã đối chiếu bản gốc' } };   // thành phần điểm → giá trị đã nhập
    fx[P + 'LayDSDauDiem_CC_CapDo_QuyDoi'] = function (o) { return DAUDIEM[o.strDiem_ThongTin_CC_CapDo_Id] || []; };
    fx[P + 'LayDSDiem_CC_CapDo_QuyDoi_DK'] = function (o) { return DAUDIEM[o.strDiem_ThongTin_CC_CapDo_Id] || []; };
    fx[P + 'LayGiaTriNguoiHoc_Diem_CC'] = function (o) {
        var g = GIATRI[o.strDiem_ThanhPhanDiem_Id];
        return g ? [g] : [];
    };
    var TTCC = { CD1: { DIEM_COSODAOTAOCONGNHANDIEM_ID: 'CS1', NGAYCAP: '15/06/2026', NGAYHETHAN: '15/06/2028' } };
    fx[P + 'LayTTDiem_NguoiHoc_Diem_CC'] = function (o) {
        var t = TTCC[o.strDiem_TT_CC_CapDo_Id];
        return t ? [t] : [];
    };
    fx[P + 'Them_Diem_NguoiHoc_Diem_CC'] = function (o) {
        TTCC[o.strDiem_TT_CC_CapDo_Id] = { DIEM_COSODAOTAOCONGNHANDIEM_ID: o.strNoiCap_Id, NGAYCAP: o.strNgayCap, NGAYHETHAN: o.strNgayHetHan };
        return { rows: [], raw: { Id: 'CC' + Date.now() } };
    };
    fx[P + 'Them_Diem_NH_Diem_CC_DuLieu'] = function (o) {
        GIATRI[o.strDiem_ThanhPhanDiem_Id] = { DIEM: o.dDiem, GHICHU: (GIATRI[o.strDiem_ThanhPhanDiem_Id] || {}).GHICHU || '' };
        return [];
    };
    var QUYDOI = [
        { DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'EN1010', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 1', DAOTAO_HOCPHAN_SOTIN: 3, DIEMCONGNHAN: 8.5 },
        { DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'EN1020', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 2', DAOTAO_HOCPHAN_SOTIN: 3, DIEMCONGNHAN: 8.0 },
        { DAOTAO_HOCPHAN_ID: 'HP5', DAOTAO_HOCPHAN_MA: 'EN2010', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh chuyên ngành', DAOTAO_HOCPHAN_SOTIN: 2, DIEMCONGNHAN: 7.5 }
    ];
    fx[P + 'LayDSHocPhanDuocQuyDoiTheoCC'] = function (o) {
        if (!o.strDiem_TT_CC_CapDo_Id) return [];
        return QUYDOI.filter(function (x) { return !DAXAC[x.DAOTAO_HOCPHAN_ID]; });
    };
    fx[P + 'LayDSHocPhanDaXacNhanTheoCC'] = function (o) {
        if (!o.strDiem_TT_CC_CapDo_Id) return [];
        return QUYDOI.filter(function (x) { return DAXAC[x.DAOTAO_HOCPHAN_ID]; });
    };

    /* ---------- Xem kết quả công nhận điểm ---------- */
    fx[P + 'LayDSKetQuaCongNhanTuBangDiem'] = function () {
        return { rows: {
            rsBangDiem: HP.filter(function (x) { return x.TINHTRANGCONGNHAN && DONG[x.DAOTAO_HOCPHAN_ID]; }).map(function (x) {
                return { DAOTAO_HOCPHAN_ID: x.DAOTAO_HOCPHAN_ID, DAOTAO_HOCPHAN_MA: x.DAOTAO_HOCPHAN_MA, DAOTAO_HOCPHAN_TEN: x.DAOTAO_HOCPHAN_TEN,
                    DAOTAO_HOCPHAN_SOTIN: x.HOCTRINHAPDUNGHOCTAP, DIEMCONGNHAN: (DONG[x.DAOTAO_HOCPHAN_ID][0] || {}).DIEM,
                    THONGTINCONGNHAN: 'Bảng điểm - Trường Đại học Bách khoa Hà Nội', PHICONGNHAN: 150000,
                    KHOAXACNHAN: 'Đã xác nhận', DAOTAOXACNHAN: 'Chờ xác nhận' };
            }),
            rsCC: QUYDOI.filter(function (x) { return DAXAC[x.DAOTAO_HOCPHAN_ID]; }).map(function (x) {
                return { DAOTAO_HOCPHAN_ID: x.DAOTAO_HOCPHAN_ID, DIEM_THONGTIN_CC_CAPDO_ID: 'CD1', DAOTAO_HOCPHAN_MA: x.DAOTAO_HOCPHAN_MA,
                    DAOTAO_HOCPHAN_TEN: x.DAOTAO_HOCPHAN_TEN, DAOTAO_HOCPHAN_SOTIN: x.DAOTAO_HOCPHAN_SOTIN, DIEMCONGNHAN: x.DIEMCONGNHAN,
                    THONGTINCONGNHAN: 'VSTEP Bậc 3 (B1) - 15/06/2026', PHICONGNHAN: 100000, KHOAXACNHAN: 'Đã xác nhận', DAOTAOXACNHAN: 'Đã xác nhận' };
            })
        } };
    };

    /* ---------- Thông tin phải nhập (LayDSTTCCMoRong) ---------- */
    var TT = [
        { ID: 'TT1', TEN: 'Số hiệu chứng chỉ', KIEUDULIEU: 'TEXT', BATBUOC: 1, DUOCSUA: 1, TRUONGTHONGTIN_GIATRI: '', NHOM: 'N1' },
        { ID: 'TT2', TEN: 'Điểm tổng', KIEUDULIEU: 'NUMBER', BATBUOC: 0, DUOCSUA: 1, TRUONGTHONGTIN_GIATRI: '', NHOM: 'N1' },
        { ID: 'TT3', TEN: 'Ngày thi', KIEUDULIEU: 'DATE', BATBUOC: 0, DUOCSUA: 1, TRUONGTHONGTIN_GIATRI: '10/06/2026', NHOM: 'N1' },
        { ID: 'TT4', TEN: 'Đơn vị tổ chức thi', KIEUDULIEU: 'LIST', MABANGDANHMUC: 'DIEM.CHUNGCHI.PHANLOAI', BATBUOC: 0, DUOCSUA: 1, TRUONGTHONGTIN_GIATRI: '', NHOM: 'N1' },
        { ID: 'TT5', TEN: 'Tỉnh/Thành phố dự thi', KIEUDULIEU: 'TINH', BATBUOC: 0, DUOCSUA: 1, TRUONGTHONGTIN_GIATRI: 'T1', NHOM: 'N2' },
        { ID: 'TT6', TEN: 'Quận/Huyện dự thi', KIEUDULIEU: 'HUYEN', BATBUOC: 0, DUOCSUA: 1, TRUONGTHONGTIN_GIATRI: 'H1', NHOM: 'N2' },
        { ID: 'TT7', TEN: 'Phường/Xã dự thi', KIEUDULIEU: 'XA', BATBUOC: 0, DUOCSUA: 1, TRUONGTHONGTIN_GIATRI: '', NHOM: 'N2' },
        { ID: 'TT8', TEN: 'Bản chụp chứng chỉ', KIEUDULIEU: 'FILE', BATBUOC: 0, DUOCSUA: 1, TRUONGTHONGTIN_GIATRI: '', NHOM: 'N3' }
    ];
    fx[T + 'LayDSTTCCMoRong'] = function (o) { return o.strDiem_ThongTin_ChungChi_Id ? TT : []; };
    fx[T + 'Them_Diem_CC_TT_MoRong_DuLieu'] = function (o) {
        TT.forEach(function (x) { if (x.ID === o.strTruongThongTin_Id) x.TRUONGTHONGTIN_GIATRI = o.strTruongThongTin_GiaTri; });
        return [];
    };

    /* ---------- Tệp minh chứng (SV_Files) ---------- */
    var FILES = { };
    FILES['ChungChiKHCN1SV0001CD1'] = [{ ID: 'F1', FILEMINHCHUNG: 'Upload/File/chung-chi-vstep.pdf', TENHIENTHI: 'chung-chi-vstep.pdf' }];
    fx['SV_Files/LayDanhSach'] = function (o) { return FILES[o.strDuLieu_Id] || []; };
    fx['SV_Files/ThemMoi'] = function (o) {
        var l = FILES[o.strDuLieu_Id] || (FILES[o.strDuLieu_Id] = []);
        l.push({ ID: 'F' + Date.now() + l.length, FILEMINHCHUNG: o.strFileMinhChung, TENHIENTHI: o.strTenHienThi });
        return [];
    };
    fx['SV_Files/Xoa'] = function (o) {
        Object.keys(FILES).forEach(function (k) { FILES[k] = FILES[k].filter(function (x) { return x.ID !== o.strIds; }); });
        return [];
    };

    ums.demo.add(fx);
})();
