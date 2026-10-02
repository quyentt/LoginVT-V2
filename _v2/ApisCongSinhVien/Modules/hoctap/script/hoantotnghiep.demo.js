/* Dữ liệu mẫu cho hoantotnghiep (Đăng ký Xét - Hoãn xét tốt nghiệp) — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001 (Lăng Văn Huy - DCOT.16.2).
   Đường GHI (xác nhận theo kế hoạch, khai/xóa chứng chỉ, tự xét) đổi luôn dữ liệu trong bộ nhớ
   để bấm xong là thấy màn hình đổi theo. */
(function () {
    var fx = {};

    fx['pkg_dangkyhoc_chung.LayDSChuongTrinh'] = [
        /* Bản gốc selectOne → ô chọn lấy mục CUỐI làm mặc định; để chương trình chính ở cuối */
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh (ngành 2) - Khóa 16', TONGSOTINCHIQUYDINH: 62 },
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ kỹ thuật ô tô - Khóa 16', TONGSOTINCHIQUYDINH: 148 }
    ];

    /* Tình trạng đăng ký (danh mục) */
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TN.KEHOACH.DANGKY.TINHTRANG'] = [
        { ID: 'TT1', MA: 'DANGKYXET', TEN: 'Đăng ký xét tốt nghiệp', CHUNG_TENDANHMUC_TEN: 'Tình trạng đăng ký xét tốt nghiệp' },
        { ID: 'TT2', MA: 'HOANXET', TEN: 'Hoãn xét tốt nghiệp', CHUNG_TENDANHMUC_TEN: 'Tình trạng đăng ký xét tốt nghiệp' },
        { ID: 'TT3', MA: 'KHONGXET', TEN: 'Không xét đợt này', CHUNG_TENDANHMUC_TEN: 'Tình trạng đăng ký xét tốt nghiệp' }
    ];

    var KH = {
        CT01: [
            { ID: 'KH01', TEN: 'Đợt xét tốt nghiệp tháng 10/2026', PHANLOAI_TEN: 'Xét tốt nghiệp', TINHTRANGDANGKY: 'Đăng ký xét tốt nghiệp', PHANHOI: 'Đã tiếp nhận đăng ký, chờ kiểm tra chứng chỉ' },
            { ID: 'KH02', TEN: 'Đợt xét tốt nghiệp tháng 6/2026', PHANLOAI_TEN: 'Xét tốt nghiệp', TINHTRANGDANGKY: 'Hoãn xét tốt nghiệp', PHANHOI: 'Hoãn theo nguyện vọng người học' },
            { ID: 'KH03', TEN: 'Đợt xét tốt nghiệp tháng 2/2027', PHANLOAI_TEN: 'Xét tốt nghiệp', TINHTRANGDANGKY: '', PHANHOI: '' }
        ],
        CT02: [
            { ID: 'KH11', TEN: 'Đợt xét tốt nghiệp ngành 2 - tháng 12/2026', PHANLOAI_TEN: 'Xét tốt nghiệp ngành 2', TINHTRANGDANGKY: '', PHANHOI: '' }
        ]
    };
    function timKH(id) {
        var ra = null;
        Object.keys(KH).forEach(function (k) { KH[k].forEach(function (x) { if (x.ID === id) ra = x; }); });
        return ra;
    }
    fx['pkg_totnghiep_dangky.LayDSKeHoachCaNhan'] = function (o) { return KH[o.strDaoTao_ChuongTrinh_Id] || []; };

    var TT = { TT1: 'Đăng ký xét tốt nghiệp', TT2: 'Hoãn xét tốt nghiệp', TT3: 'Không xét đợt này' };
    fx['pkg_totnghiep_dangky.Them_TN_KeHoach_DangKy'] = function (o) {
        var k = timKH(o.strTN_KeHoach_Id);
        if (k) { k.TINHTRANGDANGKY = TT[o.strTinhTrang_Id] || ''; k.PHANHOI = 'Đã tiếp nhận đăng ký, chờ kiểm tra chứng chỉ'; }
        return [];
    };

    /* ----- Chứng chỉ đã khai ----- */
    fx['pkg_totnghiep_dangky.LayDSPhanLoaiChungChi'] = [
        { ID: 'PL1', TEN: 'Chuẩn đầu ra ngoại ngữ' },
        { ID: 'PL2', TEN: 'Chuẩn đầu ra tin học' },
        { ID: 'PL3', TEN: 'Giáo dục quốc phòng - an ninh' }
    ];
    fx['pkg_congthongtin_congnhandiem.LayDSLoaiCC_BangDiem'] = [
        { ID: 'CC1', TEN: 'Chứng chỉ tiếng Anh' },
        { ID: 'CC2', TEN: 'Chứng chỉ tin học' },
        { ID: 'CC3', TEN: 'Chứng chỉ GDQP-AN' }
    ];
    var PL2 = {
        CC1: [{ ID: 'LCN11', TEN: 'IELTS' }, { ID: 'LCN12', TEN: 'TOEIC' }, { ID: 'LCN13', TEN: 'VSTEP bậc 3' }],
        CC2: [{ ID: 'LCN21', TEN: 'IC3' }, { ID: 'LCN22', TEN: 'Ứng dụng CNTT cơ bản' }],
        CC3: [{ ID: 'LCN31', TEN: 'Chứng chỉ GDQP-AN' }]
    };
    fx['pkg_congthongtin_congnhandiem.LayDSLoaiCC_BDTheoPhanLoai'] = function (o) { return PL2[o.strLoaiCC_BD_Id] || []; };

    var COSO = {
        LCN11: [{ ID: 'CS1', TEN: 'British Council Việt Nam' }, { ID: 'CS2', TEN: 'IDP Education Việt Nam' }],
        LCN12: [{ ID: 'CS3', TEN: 'IIG Việt Nam' }],
        LCN13: [{ ID: 'CS4', TEN: 'Trường Đại học Hà Nội' }, { ID: 'CS5', TEN: 'Trường Đại học Ngoại ngữ - ĐHQGHN' }],
        LCN21: [{ ID: 'CS3', TEN: 'IIG Việt Nam' }],
        LCN22: [{ ID: 'CS6', TEN: 'Trung tâm Tin học - Ngoại ngữ nhà trường' }],
        LCN31: [{ ID: 'CS7', TEN: 'Trung tâm Giáo dục quốc phòng và an ninh' }]
    };
    fx['pkg_congthongtin_congnhandiem.LayDSCoSoDaoTaoTheoLoai'] = function (o) { return COSO[o.strLoaiCongNhan_Id] || []; };
    function tenCoSo(id) {
        var ra = '';
        Object.keys(COSO).forEach(function (k) { COSO[k].forEach(function (x) { if (x.ID === id) ra = x.TEN; }); });
        return ra;
    }
    function tenPhanLoai(id) {
        var ds = fx['pkg_totnghiep_dangky.LayDSPhanLoaiChungChi'], ra = '';
        ds.forEach(function (x) { if (x.ID === id) ra = x.TEN; });
        return ra;
    }

    var CC = {
        KH01: [
            { ID: 'MC01', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Chuẩn đầu ra ngoại ngữ', DIEM: '6.5', NGAYCAP: '12/05/2026', NGAYHETHAN: '12/05/2028',
              THONGTINHOCPHAN_CHUNGCHI_ID: 'CC1', LOAICONGNHAN_ID: 'LCN11', DIEM_COSODAOTAOCONGNHANDIEM_ID: 'CS1', DIEM_COSODAOTAOCNDIEM_TEN: 'British Council Việt Nam' },
            { ID: 'MC02', PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Chuẩn đầu ra tin học', DIEM: 'Đạt', NGAYCAP: '20/03/2026', NGAYHETHAN: '',
              THONGTINHOCPHAN_CHUNGCHI_ID: 'CC2', LOAICONGNHAN_ID: 'LCN22', DIEM_COSODAOTAOCONGNHANDIEM_ID: 'CS6', DIEM_COSODAOTAOCNDIEM_TEN: 'Trung tâm Tin học - Ngoại ngữ nhà trường' }
        ],
        KH02: [], KH03: [], KH11: []
    };
    var seq = 3;
    fx['pkg_totnghiep_dangky.LayDSTN_NguoiHoc_HocPhan_Cap'] = function (o) {
        return { rows: { rs: CC[o.strTN_KeHoach_Id] || [] } };
    };
    fx['pkg_totnghiep_dangky.Them_TN_NguoiHoc_HocPhan_Cap'] = function (o) {
        var ds = CC[o.strTN_KeHoach_Id] || (CC[o.strTN_KeHoach_Id] = []);
        var r = null;
        if (o.strId) { ds.forEach(function (x) { if (x.ID === o.strId) r = x; }); }
        if (!r) { r = { ID: 'MC' + (10 + (seq++)) }; ds.push(r); }
        r.PHANLOAI_ID = o.strPhanLoai_Id;
        r.PHANLOAI_TEN = tenPhanLoai(o.strPhanLoai_Id);
        r.DIEM = o.strDiem;
        r.NGAYCAP = o.strNgayCap;
        r.NGAYHETHAN = o.strNgayHetHan;
        r.THONGTINHOCPHAN_CHUNGCHI_ID = o.strThongTinHocPhan_ChungChi;
        r.LOAICONGNHAN_ID = o.strLoaiCongNhan_Id;
        r.DIEM_COSODAOTAOCONGNHANDIEM_ID = o.strDiem_CoSoCongNhan_Id;
        r.DIEM_COSODAOTAOCNDIEM_TEN = tenCoSo(o.strDiem_CoSoCongNhan_Id);
        return { rows: [], raw: { Id: r.ID } };
    };
    fx['pkg_totnghiep_dangky.Xoa_TN_NguoiHoc_HocPhan_Cap'] = function (o) {
        Object.keys(CC).forEach(function (k) {
            CC[k] = CC[k].filter(function (x) { return x.ID !== o.strId; });
        });
        return [];
    };

    /* Tệp minh chứng (khoá "CongNhan" + kế hoạch + người học) */
    var TEP = { CongNhanKH01SV0001: [{ ID: 'F1', FILEMINHCHUNG: 'SV/CongNhan/ielts-6.5.pdf', TENHIENTHI: 'Chứng chỉ IELTS 6.5.pdf' }] };
    fx['SV_Files/LayDanhSach'] = function (o) { return TEP[o.strDuLieu_Id] || []; };
    fx['SV_Files/ThemMoi'] = [];
    fx['SV_Files/Xoa'] = [];

    /* ----- Tự xét ----- */
    var XET = {
        KH01: {
            rs: [{ KETQUA: 'ĐỦ ĐIỀU KIỆN', DIEUKIEN: 'Tích lũy đủ số tín chỉ theo chương trình; không còn học phần nợ; đã có chứng chỉ chuẩn đầu ra ngoại ngữ và tin học; điểm rèn luyện từ trung bình trở lên.' }],
            rsTieuChi: [
                { TEN: 'Tích lũy đủ số tín chỉ (148/148)', KETQUA: 'Đạt' },
                { TEN: 'Không còn học phần nợ', KETQUA: 'Đạt' },
                { TEN: 'Chuẩn đầu ra ngoại ngữ', KETQUA: 'Đạt' },
                { TEN: 'Chuẩn đầu ra tin học', KETQUA: 'Đạt' },
                { TEN: 'Điểm rèn luyện', KETQUA: 'Khá' }
            ]
        },
        KH02: {
            rs: [{ KETQUA: 'CHƯA ĐỦ ĐIỀU KIỆN', DIEUKIEN: 'Còn thiếu 6 tín chỉ và chưa nộp chứng chỉ chuẩn đầu ra tin học.' }],
            rsTieuChi: [
                { TEN: 'Tích lũy đủ số tín chỉ (142/148)', KETQUA: 'Chưa đạt' },
                { TEN: 'Không còn học phần nợ', KETQUA: 'Đạt' },
                { TEN: 'Chuẩn đầu ra ngoại ngữ', KETQUA: 'Đạt' },
                { TEN: 'Chuẩn đầu ra tin học', KETQUA: 'Chưa đạt' }
            ]
        }
    };
    fx['pkg_totnghiep_dangky.LayKetQuaThongTinDieuKienXet'] = function (o) {
        return { rows: XET[o.strTN_KeHoach_Id] || { rs: [], rsTieuChi: [] } };
    };
    fx['pkg_totnghiep_tinhtoan.XetDieuKien_TN_CC_DA_CaNhan'] = function (o) {
        if (!XET[o.strTN_KeHoach_Id]) {
            XET[o.strTN_KeHoach_Id] = {
                rs: [{ KETQUA: 'CHƯA ĐỦ ĐIỀU KIỆN', DIEUKIEN: 'Kết quả tính tại thời điểm tự xét, chưa phải kết quả chính thức của nhà trường.' }],
                rsTieuChi: [
                    { TEN: 'Tích lũy đủ số tín chỉ', KETQUA: 'Chưa đạt' },
                    { TEN: 'Không còn học phần nợ', KETQUA: 'Đạt' },
                    { TEN: 'Chuẩn đầu ra ngoại ngữ', KETQUA: 'Chưa đạt' }
                ]
            };
        }
        return [];
    };

    ums.demo.add(fx);
})();
