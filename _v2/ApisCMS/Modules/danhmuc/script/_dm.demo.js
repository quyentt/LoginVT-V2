/* Dữ liệu mẫu cho bảy màn khai báo danh mục của ApisCMS (script/_dm.js) — chỉ dùng ở chế độ dựng thử.
   Tên cột đúng như bản gốc đọc: bảng danh mục (MADANHMUC, TENDANHMUC, TENNHOMDANHMUC…), thuộc tính
   (TENTRUONGDULIEU, MOTA), dữ liệu (MA, TEN, HESO1–3, THONGTIN1–8, QUANHECHA_ID), cấu hình từ khoá
   (DINHDANH, DULIEU, MOTA), hàm import/export (dTrangThai 995 / 985). */
(function () {
    'use strict';

    function norm(s) {
        return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }
    function khop(q, list) { q = norm(q); return !q || list.some(function (x) { return norm(x).indexOf(q) >= 0; }); }
    function trang(rows, o) {
        var size = Number(o.pageSize) || 10, idx = Number(o.pageIndex) || 1;
        return { rows: rows.slice((idx - 1) * size, idx * size), pager: rows.length };
    }

    var UNGDUNG = [
        { ID: 'A1F0C2D94B7E4E1B9C3F0A11D2E3B401', TENUNGDUNG: 'Tài chính' },
        { ID: 'A1F0C2D94B7E4E1B9C3F0A11D2E3B402', TENUNGDUNG: 'Đào tạo' },
        { ID: 'A1F0C2D94B7E4E1B9C3F0A11D2E3B403', TENUNGDUNG: 'Nhân sự' },
        { ID: 'A1F0C2D94B7E4E1B9C3F0A11D2E3B404', TENUNGDUNG: 'Quản trị hệ thống' }
    ];
    var U = {}; UNGDUNG.forEach(function (u, i) { U['U' + (i + 1)] = u; });

    function bang(id, ma, ten, u, cha, tt) {
        return { ID: id, MADANHMUC: ma, TENDANHMUC: ten, NHOMDANHMUC_ID: U[u].ID, UNGDUNG_ID: U[u].ID,
            TENNHOMDANHMUC: U[u].TENUNGDUNG, CHUNG_TENDANHMUC_CHA_ID: cha || '', THUTU: tt, PHANCAPDANHMUC_ID: '1', MOTA: '' };
    }
    var BANG = [
        bang('B2042224DB1D4AA6BC11B65EED062301', 'TAICHINH.KEHOACH.MUAHANG.PHANLOAIHANGHOA', 'Phân loại hàng hoá', 'U1', '', 1),
        bang('B2042224DB1D4AA6BC11B65EED062302', 'TAICHINH.MAUIN', 'Mẫu in chứng từ', 'U1', '', 2),
        bang('B2042224DB1D4AA6BC11B65EED062303', 'TAICHINH.HINHTHUCTHU', 'Hình thức thu', 'U1', '', 3),
        bang('B2042224DB1D4AA6BC11B65EED062304', 'DAOTAO.LOAIHOCPHAN', 'Loại học phần', 'U2', '', 1),
        bang('B2042224DB1D4AA6BC11B65EED062305', 'DAOTAO.LOAIHOCPHAN.TUCHON', 'Nhóm học phần tự chọn', 'U2', 'B2042224DB1D4AA6BC11B65EED062304', 2),
        bang('B2042224DB1D4AA6BC11B65EED062306', 'DAOTAO.HINHTHUCTHI', 'Hình thức thi', 'U2', '', 3),
        bang('B2042224DB1D4AA6BC11B65EED062307', 'QLSV.TRANGTHAI', 'Trạng thái người học', 'U2', '', 4),
        bang('B2042224DB1D4AA6BC11B65EED062308', 'NHANSU.CHUCVU', 'Chức vụ', 'U3', '', 1),
        bang('B2042224DB1D4AA6BC11B65EED062309', 'NHANSU.HOCVI', 'Học vị', 'U3', '', 2),
        bang('B2042224DB1D4AA6BC11B65EED062310', 'NHANSU.HOCHAM', 'Học hàm', 'U3', '', 3),
        bang('B2042224DB1D4AA6BC11B65EED062311', 'NHANSU.DANTOC', 'Dân tộc', 'U3', '', 4),
        bang('B2042224DB1D4AA6BC11B65EED062312', 'CMS.NHOMVAITRO', 'Nhóm vai trò', 'U4', '', 1)
    ];
    var B = function (n) { return BANG[n - 1].ID; };

    var THUOCTINH = [];
    function tt(b, list) {
        list.forEach(function (x, i) {
            THUOCTINH.push({ ID: b.slice(0, 28) + 'T' + (i + 101), CHUNG_TENDANHMUC_ID: b, TENTRUONGDULIEU: x[0], MOTA: x[1] });
        });
    }
    tt(B(1), [['Ma', 'Mã loại'], ['Ten', 'Tên loại hàng hoá'], ['ThongTin1', 'Đơn vị tính'], ['HeSo1', 'Thuế GTGT (%)'], ['ThongTin7', 'Ghi chú nội bộ']]);
    tt(B(2), [['Ma', 'Mã mẫu'], ['Ten', 'Tên mẫu in'], ['ThongTin1', 'Đường dẫn tệp mẫu']]);
    tt(B(4), [['Ma', ''], ['Ten', '']]);
    tt(B(8), [['Ma', 'Mã chức vụ'], ['Ten', 'Tên chức vụ'], ['HeSo1', 'Hệ số phụ cấp']]);

    var DULIEU = [
        { ID: 'D1C0FFEE00000000000000000000A001', CHUNG_TENDANHMUC_ID: B(1), MA: 'VPP', TEN: 'Văn phòng phẩm', THONGTIN1: 'Hộp', HESO1: 10, THONGTIN7: '', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D1C0FFEE00000000000000000000A002', CHUNG_TENDANHMUC_ID: B(1), MA: 'TBTH', TEN: 'Thiết bị tin học', THONGTIN1: 'Chiếc', HESO1: 10, THONGTIN7: '', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D1C0FFEE00000000000000000000A003', CHUNG_TENDANHMUC_ID: B(1), MA: 'MAYTINH', TEN: 'Máy tính để bàn', THONGTIN1: 'Bộ', HESO1: 10, THONGTIN7: 'Theo gói thầu 2026', MOTA: '', QUANHECHA_ID: 'D1C0FFEE00000000000000000000A002', TRANGTHAI: 1 },
        { ID: 'D1C0FFEE00000000000000000000A004', CHUNG_TENDANHMUC_ID: B(1), MA: 'SACH', TEN: 'Sách, tài liệu', THONGTIN1: 'Cuốn', HESO1: '', THONGTIN7: '', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D1C0FFEE00000000000000000000A005', CHUNG_TENDANHMUC_ID: B(1), MA: 'HOACHAT', TEN: 'Hoá chất thí nghiệm', THONGTIN1: 'Lít', HESO1: 8, THONGTIN7: '', MOTA: 'Ngừng mua từ 2025', QUANHECHA_ID: '', TRANGTHAI: 0 },
        { ID: 'D1C0FFEE00000000000000000000A011', CHUNG_TENDANHMUC_ID: B(2), MA: 'PT01', TEN: 'Phiếu thu học phí', THONGTIN1: 'Upload/Files/PrintTemplate/PhieuThu.html', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D1C0FFEE00000000000000000000A012', CHUNG_TENDANHMUC_ID: B(2), MA: 'BL01', TEN: 'Biên lai thu tiền', THONGTIN1: 'Upload/Files/PrintTemplate/BienLai.html', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D1C0FFEE00000000000000000000A021', CHUNG_TENDANHMUC_ID: B(8), MA: 'HT', TEN: 'Hiệu trưởng', HESO1: 1, MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D1C0FFEE00000000000000000000A022', CHUNG_TENDANHMUC_ID: B(8), MA: 'PHT', TEN: 'Phó hiệu trưởng', HESO1: 0.8, MOTA: '', QUANHECHA_ID: 'D1C0FFEE00000000000000000000A021', TRANGTHAI: 1 },
        { ID: 'D1C0FFEE00000000000000000000A023', CHUNG_TENDANHMUC_ID: B(8), MA: 'TK', TEN: 'Trưởng khoa', HESO1: 0.6, MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 }
    ];

    /* Hàm import (995) / export (985) và tham số của chúng */
    var HAM = [
        { ID: 'F1A0000000000000000000000000I001', MADANHMUC: 'IMPORTWITHPROC_NHANSU_HOSO', TENDANHMUC: 'Hồ sơ cán bộ', NHOMDANHMUC_ID: U.U3.ID, TRANGTHAI: 995,
          MOTA: 'create or replace package pkg_nhansu_hoso is\n procedure Them_HoSo(ParamMaSo varchar2, ParamHoTen varchar2, ParamNgaySinh varchar2, ParamErr out varchar2)' },
        { ID: 'F1A0000000000000000000000000I002', MADANHMUC: 'IMPORTWITHPROC_QLSV_NGUOIHOC', TENDANHMUC: 'Danh sách người học', NHOMDANHMUC_ID: U.U2.ID, TRANGTHAI: 995, MOTA: '' },
        { ID: 'F1A0000000000000000000000000I003', MADANHMUC: 'IMPORTWITHPROC_TC_DANOP', TENDANHMUC: 'Khoản đã nộp', NHOMDANHMUC_ID: U.U1.ID, TRANGTHAI: 995, MOTA: '' },
        { ID: 'F1A0000000000000000000000000E001', MADANHMUC: 'EXPORT_NCKH_HNHT', TENDANHMUC: 'Hội nghị hội thảo theo cán bộ', NHOMDANHMUC_ID: U.U3.ID, TRANGTHAI: 985,
          MOTA: 'create or replace package pkg_nhansu_quatrinh is\n procedure LayThongTinChiTietNCKH_SP_HNHT(ParamId varchar2, rs out refcur, ParamErr out varchar2)' },
        { ID: 'F1A0000000000000000000000000E002', MADANHMUC: 'EXPORT_TC_CONGNO', TENDANHMUC: 'Công nợ người học theo học kỳ', NHOMDANHMUC_ID: U.U1.ID, TRANGTHAI: 985, MOTA: '' }
    ];
    function ts(ham, id, heso1, ten, ma, excel, md, key, h2, h3, goi, get) {
        return { ID: 'P0' + ham.slice(-4) + id, CHUNG_TENDANHMUC_ID: ham, HESO1: heso1, TEN: ten, MA: ma, THONGTIN1: excel,
            THONGTIN2: md, THONGTIN3: goi, THONGTIN4: key, HESO2: h2, HESO3: h3, THONGTIN5: get };
    }
    var I1 = HAM[0].ID, E1 = HAM[3].ID, G1 = 'pkg_nhansu_hoso.Them_HoSo', G2 = 'pkg_nhansu_quatrinh.LayThongTinChiTietNCKH_SP_HNHT';
    var THAMSO = [
        ts(I1, '0001', 0, 'Mã số cán bộ', 'ParamMaSo', 'MaSo', '', '1', 0, 0, G1, ''),
        ts(I1, '0002', 1, 'Họ và tên', 'ParamHoTen', 'HoTen', '', '10', 0, 0, G1, ''),
        ts(I1, '0003', 2, 'Ngày sinh', 'ParamNgaySinh', 'NgaySinh', '', '', 0, 0, G1, ''),
        ts(I1, '0004', 3, '', 'ParamErr', '', '', '', 0, 1, G1, ''),
        ts(E1, '0001', '', 'Mã sản phẩm', 'ParamId', 'Id', '', '', 0, 0, G2, ''),
        ts(E1, '0002', '', '', 'rs', '', '', '', 10, 1, G2, ''),
        ts(E1, '0003', '', '', 'ParamErr', '', '', '', 0, 1, G2, '')
    ];

    var CAUHINH = [
        ['SMTP_HOST', 'smtp.gmail.com', 'Máy chủ gửi thư'],
        ['SMTP_PORT', '587', 'Cổng gửi thư'],
        ['EMAIL_GUI', 'daotao@truong.edu.vn', 'Hộp thư gửi thông báo'],
        ['TEN_TRUONG', 'Trường Đại học Mẫu', 'Tên hiển thị trên phiếu in'],
        ['MA_SO_THUE', '0101234567', 'Mã số thuế đơn vị'],
        ['VNPAY_TMN_CODE', 'DHMAU001', 'Mã website VNPAY'],
        ['SO_NGAY_HAN_NOP', '15', 'Số ngày hạn nộp học phí'],
        ['LOGO_URL', 'Upload/Images/logo.png', 'Logo trên trang đăng nhập'],
        ['HOTLINE', '024 3869 0000', 'Số điện thoại hỗ trợ'],
        ['CHO_PHEP_DANG_KY', '1', 'Mở đăng ký học trực tuyến'],
        ['PHIEN_BAN', '2026.09', 'Phiên bản hệ thống'],
        ['GIO_KHOA_SO', '17:00', 'Giờ khoá sổ thu tiền trong ngày']
    ].map(function (x, i) {
        return { ID: 'C0FA11000000000000000000000000' + (i < 9 ? '0' : '') + (i + 1), DINHDANH: x[0], DULIEU: x[1], MOTA: x[2],
            CHUCNANG_ID: '', UNGDUNG_ID: U.U4.ID };
    });

    var CHUCNANG = [
        { ID: 'CN0000000000000000000000000000A1', TENCHUCNANG: 'Thu tiền', UD: U.U1.ID },
        { ID: 'CN0000000000000000000000000000A2', TENCHUCNANG: 'Xuất hoá đơn', UD: U.U1.ID },
        { ID: 'CN0000000000000000000000000000B1', TENCHUCNANG: 'Đăng ký học', UD: U.U2.ID },
        { ID: 'CN0000000000000000000000000000B2', TENCHUCNANG: 'Nhập điểm', UD: U.U2.ID },
        { ID: 'CN0000000000000000000000000000C1', TENCHUCNANG: 'Hồ sơ cán bộ', UD: U.U3.ID },
        { ID: 'CN0000000000000000000000000000D1', TENCHUCNANG: 'Quản lý người dùng', UD: U.U4.ID }
    ];

    ums.demo.add({
        'pkg_chung_quanlynguoidung.LayDanhSachUngDung': UNGDUNG,

        'pkg_chung_danhmuc.LayDanhSachDanhMuc': function (o) {
            var tt = Number(o.dTrangThai);
            var ds = (tt === 995 || tt === 985) ? HAM.filter(function (h) { return h.TRANGTHAI === tt; }) : BANG;
            ds = ds.filter(function (b) {
                return (!o.strNhomDanhMuc_Id || b.NHOMDANHMUC_ID === o.strNhomDanhMuc_Id) &&
                    khop(o.strTuKhoa, [b.MADANHMUC, b.TENDANHMUC]);
            });
            return trang(ds, o);
        },
        'pkg_chung_danhmuc.LayDanhSachThuocTinhDanhMuc': function (o) {
            return THUOCTINH.filter(function (t) { return t.CHUNG_TENDANHMUC_ID === o.strCHUNG_TENDANHMUC_Id; });
        },
        'pkg_chung_danhmuc.LayThongTinDanhMucTheoId': function (o) {
            return BANG.concat(THUOCTINH, HAM).filter(function (x) { return x.ID === o.strId; });
        },
        'pkg_chung_danhmuc.LayThongTinDuLieuDMTheoId': function (o) {
            return DULIEU.filter(function (x) { return x.ID === o.strId; });
        },
        // Tạo hàm: import đọc id mới ở Id, export ở Message
        'pkg_chung_danhmuc.ThemBangDanhMuc': { rows: [], message: 'F1A0000000000000000000000000E099', raw: { Id: 'F1A0000000000000000000000000I099' } },

        'CMS_DanhMucDuLieu/LayDanhSach': function (o) {
            var id = o.strCHUNG_TENDANHMUC_Id;
            var tt = Number(o.dTrangThai);
            if (tt === 995 || tt === 985) {
                var p = THAMSO.filter(function (x) { return x.CHUNG_TENDANHMUC_ID === id; });
                return p.length ? p : [];
            }
            return DULIEU.filter(function (d) {
                return d.CHUNG_TENDANHMUC_ID === id &&
                    (o.dTrangThai === '' || o.dTrangThai === undefined || String(d.TRANGTHAI) === String(o.dTrangThai)) &&
                    (!o.strCha_Id || d.QUANHECHA_ID === o.strCha_Id) &&
                    khop(o.strTuKhoa, [d.MA, d.TEN, d.THONGTIN1]);
            });
        },

        'CMS_CauHinh/LayDanhSach': function (o) {
            return trang(CAUHINH.filter(function (c) { return khop(o.strTuKhoa, [c.DINHDANH, c.DULIEU, c.MOTA]); }), o);
        },
        'CMS_ChucNang/LayDanhSach': function (o) {
            return CHUCNANG.filter(function (c) { return !o.strChung_UngDung_Id || c.UD === o.strChung_UngDung_Id; });
        },

        'CMS_DanhMucImport/LayDanhSachHam': function (o) {
            return HAM.filter(function (h) {
                return h.TRANGTHAI === 995 && (!o.strUngDung_Id || h.NHOMDANHMUC_ID === o.strUngDung_Id) &&
                    khop(o.strTuKhoa, [h.MADANHMUC, h.TENDANHMUC]);
            });
        },
        'SYS_Import/getDataFormFileImport': {
            rows: {
                Table1: [
                    { MaSo: 'CB0001', HoTen: 'Nguyễn Văn An', NgaySinh: '12/03/1985' },
                    { MaSo: 'CB0002', HoTen: 'Trần Thị Bình', NgaySinh: '05/11/1990' },
                    { MaSo: 'CB0003', HoTen: 'Lê Minh Châu', NgaySinh: '21/07/1988' }
                ],
                Table2: [{ GhiChu: 'Ngày sinh nhập dạng dd/MM/yyyy' }]
            },
            raw: { Id: 'DanhSach$HuongDan$' }
        }
    });
})();
