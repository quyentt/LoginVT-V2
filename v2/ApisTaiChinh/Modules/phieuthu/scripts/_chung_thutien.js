/* =========================================================================
   Thu tiền — lõi dùng chung cho hai màn  thutien  và  viewthutien
   ---------------------------------------------------------------------------
   Bản gốc: ApisTaiChinh/Modules/phieuthu/scripts/thutien.js      (6.914 dòng)
            ApisTaiChinh/Modules/phieuthu/scripts/viewthutien.js  (3.678 dòng)
   viewthutien là bản cũ hơn của thutien (cùng bố cục, cùng lời gọi, ít tính
   năng hơn). Hai màn dùng chung lõi này, khác nhau ở bảng BIEN_THE bên dưới.

   Tệp đi kèm (nạp theo thứ tự trong html):
       assets/js/phieu.js            ums.phieu.viewer — xem/in chứng từ đã lưu (tầng chung)
                                   (= edu.extend.getData_Phieu; tệp của người làm thutienkhac,
                                   ở đây chỉ NẠP, không sửa)
       _chung_thutien.js           tệp này: tìm sinh viên, các bảng khoản, viết phiếu, thu tiền
       _chung_thutien.chitiet.js   tab "Tình hình học phí": bảng chi tiết, sửa/xoá khoản,
                                   xem tất cả, tab "Tình hình tài chính thu hộ"

   ---------------------------------------------------------------------------
   LỜI GỌI (chép nguyên văn action/func/tham số)
     Tìm sinh viên
       SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P  PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All
       CM_DanhMucDuLieu/LayDanhSach  GET  QLSV.TRANGTHAI (trạng thái SV), TAICHINH.NUTHDDT (nút HĐĐT)
       ums.ref.heDaoTao / khoaDaoTao / chuongTrinh / lopQuanLy / thoiGianDaoTao (pageSize 1000000)
       TC_KhoanThu/LayDanhSach  GET  (danh sách khoản cho "thu trước", ô chọn khoản khi sửa)
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM  GET  NTT · QLTC.HTTHU · QLTC.LTT · TAICHINH.DVT
     Tình trạng tài chính
       thutien     TC_ThongTin/LayDSTinhTrangTaiChinh   GET
       viewthutien TC_ThongTinChung/LayDanhSach          GET
         → rsPhaiNopTongHopChung · rsPhaiNopRieng · rsDuThuaChung · rsDuThuaRieng ·
           rsKhoanPhaiNop_ThuHo · rsThongTin[0] · rsDotCongNo · rsTongHopNoTheoDot · rsTongHopDuTheoDot
     Viết phiếu / thu
       TC_ThongTinChung/DocSoThanhChu  GET  (đọc tổng tiền thành chữ theo loại tiền — thutien)
       TC_DaNop/ThemMoi         Xuất biên lai (save_HDBL) · Thu tiền (save_ThuTien) · Xuất hoá đơn (save_HD)
       TC_TaiChinh_Rut/ThemMoi  Rút tiền (save_HDBL với bThu = false)
       HDDT_HoaDon/ThemMoi      xuất hoá đơn điện tử sau TC_DaNop/ThemMoi (thutien)
       HDDT_HoaDon/ThemMoi_Nhap → TC_HoaDonNhap/ThemMoi → TC_HoaDonNhap_ChuaThu/ThemMoi (HĐĐT nháp)
       TC_SoBienLai/HuyBienLai  huỷ biên lai (thutien)
     Xem/in chứng từ: TC_PhieuThu/LayTTPhieuThu_Rut · TC_HoaDon/LayTTHoaDonThu_Rut (qua viewer)

   ---------------------------------------------------------------------------
   PHÉP TÍNH TIỀN — chép đúng từng bước của bản gốc (xem M bên dưới)
     · Ô số tiền/số lượng: edu.system.checkSoTienInput — gõ ký tự sai thì trả
       về giá trị gốc (số lượng: "0"), định dạng lại bằng dấu phẩy nghìn.
       viewthutien: bảng khoản thừa không cho nhập quá số gốc (bQuaSoTien).
     · Tổng tiền đã chọn = Σ (số lượng × số tiền) của dòng được chọn,
       làm tròn xuống 2 chữ số thập phân (edu.system.countFloat(t, 6, 7, 5)).
       Dòng tổng dưới bảng = Σ số tiền của MỌI dòng (insertSumAfterTable [6]).
     · Phiếu nháp: dòng có số tiền "== 0" bị bỏ; đơn giá = số tiền đã nhập,
       thành tiền = đơn giá × số lượng (tinhHeSoGiaTien); tổng = countFloat;
       tổng "0" thì không mở phiếu. Bằng chữ = to_vietnamese(tổng).
     · Gửi đi: strSoLuong_s / strDonGia_s / strTaiChinh_SoTien_s là
       parseFloat(bỏ dấu phẩy) từng dòng nối bằng ",", nội dung nối "#".

   ---------------------------------------------------------------------------
   CỐ Ý KHÁC BẢN GỐC / LỖI BẢN GỐC (chi tiết trong báo cáo)
     1. DocSoThanhChu gửi tổng THÀNH TIỀN. Bản gốc thutien đọc ô tfoot:eq(5)
        — sau khi thêm cột "Đơn vị" ô đó là tổng ĐƠN GIÁ, nên số tiền bằng
        chữ sai khi số lượng khác 1.
     2. Số lượng không phải số (vd ".") → chặn, không mở phiếu. Bản gốc gửi
        "NaN" vào strTaiChinh_SoTien_s.
     3. Xuất HĐĐT lỗi: bản gốc báo lỗi RỒI báo "Thực hiện thu tiền thành
        công". Ở đây báo: đã thu (TC_DaNop đã chạy) nhưng HĐĐT lỗi.
     4. viewthutien: strQLSV_NguoiHoc_Id lấy QLSV_NGUOIHOC_ID như thutien
        (bản gốc view gửi ID dòng của LayDSNguoiHoc_All — thutien đã sửa).
     5. viewthutien: bỏ nút "Thu tiền" (gọi save_ThuTien không tồn tại →
        lỗi JS) và các nút HĐĐT (không gắn sự kiện nào).
     6. Nút HĐĐT đổi base URL của tiền tố HDDT sang THONGTIN4 trong lúc gọi
        (bản gốc gán đè edu.system.objApi["HDDT"] vĩnh viễn) — ở đây trả lại
        sau khi xong.
     7. Báo cáo: bản gốc gắn getList_MauImport vào 2 chỗ (đầu trang và thẻ
        "Báo cáo"), cùng tham số — ở đây gắn một lần ở đầu trang.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var ns = ums.phieuthu || (ums.phieuthu = {});
    var TT = ns.thuTien || (ns.thuTien = {});

    /* =====================================================================
       M — tiện ích tiền, bản sao đúng từng dòng của edu.util / edu.system
       ===================================================================== */
    var M = TT.money = {};

    /* edu.util.checkValue */
    M.checkValue = function (v) {
        if (v === 0) return true;
        return !(v == '' || v == null || v == undefined || v == 'null');   // eslint-disable-line eqeqeq
    };
    /* edu.util.formatCurrency — ums.pat.money ở tầng chung (dấu phẩy nhóm
       nghìn ở phần nguyên). Bản gốc áp regex cả phần thập phân nên
       "1234.5678" ra "1,234.5,678"; số gửi lên không đổi vì M.strip bỏ phẩy. */
    M.fmt = function (v) { return ums.pat.money(M.checkValue(v) ? v : 0); };
    /* edu.util.floatValid */
    M.floatValid = function (v) { return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(v); };
    /* bỏ khoảng trắng và dấu phẩy — getSoTien() của save_* */
    M.strip = function (s) { return String(s == null ? '' : s).replace(/ /g, '').replace(/,/g, ''); };
    /* getSoTien(x, 0): parseFloat sau khi bỏ dấu phẩy. NaN vẫn là NaN (typeof NaN == 'number') */
    M.soTien = function (s) { return parseFloat(M.strip(s)); };
    /* edu.system.convertFloat */
    M.convertFloat = function (sum) {
        if (!M.checkValue(sum) || sum === 0) return '0';
        sum = String(sum).replace(/,/g, '');
        var ext = '';
        if (sum.indexOf('.') !== -1) { ext = sum.substring(sum.indexOf('.')); sum = sum.substr(0, sum.indexOf('.')); }
        return M.fmt(sum) + ext;
    };
    /* edu.system.countFloat trên một cột: `vals` là chữ trong ô (có dấu phẩy),
       `heSo` (tuỳ chọn) là chữ trong ô hệ số — bản gốc parseFloat hệ số KHÔNG
       bỏ dấu phẩy, và khi ô hệ số rỗng thì đặt giá trị = 1 (giữ nguyên). */
    M.tong = function (vals, heSo) {
        var sum = 0.0;
        vals.forEach(function (v, i) {
            var val = String(v == null ? '' : v);
            var h = 1;
            if (heSo) {
                var hs = String(heSo[i] == null ? '' : heSo[i]);
                if (hs === '') val = '1';
                h = parseFloat(hs);
            }
            val = M.strip(val);
            if (val === '') val = 0;
            var d = parseFloat(val);
            if (M.floatValid(d)) sum += h * d;
        });
        sum = Math.floor(sum * 100) / 100;
        return M.convertFloat(sum);
    };
    /* Đọc số thành chữ — tầng chung ums.ui.docSo (thư viện n2vi ở
       assets/vendor/n2vi): to_vietnamese(x) + "." rồi viết hoa chữ đầu */
    M.docChu = function (tongText) { return ui.docSo(tongText); };
    /* edu.system.checkSoTienInput(point, bQuaSoTien). `goc` = thuộc tính name
       của ô (số tiền gốc đã định dạng; số lượng không có → "0"). */
    M.chuanHoaO = function (el, goc, khongQua) {
        var fCheck = M.fmt(goc);
        var x = el.value;
        if (x[x.length - 1] === '.' || x[x.length - 1] === ',') return false;
        x = x.replace(/,/g, '');
        if (x !== '' && !M.floatValid(x)) { el.value = fCheck; return false; }
        if (khongQua) {
            if (parseFloat(x) > parseFloat(fCheck.replace(/,/g, ''))) { el.value = fCheck; return false; }
        }
        el.value = M.fmt(el.value.replace(/,/g, ''));
        return true;
    };
    /* edu.system.change_alias — dùng cho nội dung QR */
    M.boDau = function (s) {
        var str = String(s == null ? '' : s).toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
        str = str.replace(/ + /g, ' ');
        return str.trim();
    };
    /* edu.extend.removeNoiDungDai */
    M.noiDungNgan = function (s, soTien) {
        if (!M.checkValue(s)) return '';
        s = String(s);
        if (s.indexOf('VIETINBANK') >= 0 && s.indexOf('DTC') >= 0) {
            s = s.replace('VIETIN', '');
            s = s.substring(0, s.indexOf('$'));
            if (s.indexOf(soTien) >= 0) s = s.replace(soTien, '');
            return s + '...';
        }
        return s;
    };
    M.e = function (v) { return v == null ? '' : v; };
    M.homNay = function () {
        var d = new Date();
        function z(n) { return (n < 10 ? '0' : '') + n; }
        return z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + d.getFullYear();
    };

    /* Ô chọn danh mục — bản sao của edu.system.loadToCombo_data:
         · có `title` → dòng đầu value="" ; không có mà dòng đầu có
           CHUNG_TENDANHMUC_TEN → "Chọn <tên danh mục>" ; không thì không có
           dòng trống (trình duyệt chọn dòng đầu)
         · dòng có THONGTIN8 = "CHON" là mặc định
       Trả { html, def, rows } — def là giá trị sẽ được chọn. */
    M.combo = function (rows, map, title) {
        map = map || {};
        var id = map.id || 'ID', name = map.name || 'TEN';
        rows = rows || [];
        if (!rows.length) return { html: '<option value="">-- Không tìm thấy dữ liệu! --</option>', def: '', rows: rows };
        var h = '', head = false, def = '';
        if (title) { h += '<option value="">' + esc(title) + '</option>'; head = true; }
        else if (M.checkValue(rows[0].CHUNG_TENDANHMUC_TEN)) {
            h += '<option value="">' + esc('Chọn ' + String(rows[0].CHUNG_TENDANHMUC_TEN).toLowerCase()) + '</option>';
            head = true;
        }
        rows.forEach(function (r) {
            if (r.THONGTIN8 === 'CHON') def = r[id];
            h += '<option value="' + esc(r[id]) + '">' + esc(typeof name === 'function' ? name(r) : r[name]) + '</option>';
        });
        if (!def && !head) def = rows[0][id];
        return { html: h, def: def == null ? '' : String(def), rows: rows };
    };
    /* đặt giá trị cho select như $(x).val(v): không có option trùng thì bỏ chọn */
    M.setSelect = function (sel, v) {
        v = v == null ? '' : String(v);
        sel.value = v;
        if (sel.value !== v) sel.selectedIndex = -1;
    };

    /* =====================================================================
       BIẾN THỂ — mọi khác biệt giữa thutien và viewthutien
       ===================================================================== */
    TT.BIEN_THE = {
        thutien: {
            title: 'Thu tiền',
            ttAction: 'TC_ThongTin/LayDSTinhTrangTaiChinh',
            tuChonTab: true,         // có nợ chung → nhảy tab nợ chung và chọn hết
            qr: true,                // cột mã định danh + QR ở bảng nợ chung, nút "Tạo QR thanh toán"
            khongQuaThua: false,     // checkSoTienInput(this, false) ở bảng thừa
            kiemTraDu: true,         // chặn rút quá tổng dư (NOCO)
            ngayChungTu: true,       // ô "Ngày xuất chứng từ" + sửa "Ngày lập phiếu" trên phiếu nháp
            dvtTungDong: true,       // chọn đơn vị tính cho từng dòng phiếu nháp
            canDoi: true,            // cột "Cân đối" ở bảng thu trước
            docSoMayChu: true,       // DocSoThanhChu khi đổi loại tiền
            huyBienLai: true,
            nutThuTien: true,        // btnThuTien → save_ThuTien
            hddt: true,              // nút HĐĐT, xem trước HĐ
            xuatHD: 'truoc',         // nút "Xuất hoá đơn": chỉ ở thu trước (bThu)
            suaXoa: true,            // sửa/xoá khoản ở tab 1 và tab 8
            nguoiThuNTT: true,       // danh mục NTT đè tên người thu
            rutRieng: true,          // tab 8 có "Khoản đã rút"
            noiDungTruoc: true,      // dòng thu trước điền sẵn "Tên khoản(Học kỳ)"
            boChonXoaDong: false,    // bỏ chọn khoản thu trước KHÔNG xoá dòng (bản gốc đã comment)
            baoCao: true,
            xemTatCa: true,
            cotMien: true            // cột Chính sách / Phần trăm miễn
        },
        viewthutien: {
            title: 'Xem thu tiền',
            ttAction: 'TC_ThongTinChung/LayDanhSach',
            tuChonTab: false,
            qr: false,
            khongQuaThua: true,
            kiemTraDu: false,
            ngayChungTu: false,
            dvtTungDong: false,
            canDoi: false,
            docSoMayChu: false,
            huyBienLai: false,
            nutThuTien: false,
            hddt: false,
            xuatHD: 'view',          // bThu ở khoản nợ; luôn có ở thu trước (kể cả rút)
            suaXoa: false,
            nguoiThuNTT: false,
            rutRieng: false,
            noiDungTruoc: false,
            boChonXoaDong: true,
            baoCao: false,
            xemTatCa: false,
            cotMien: false,
            boQuaNeuTrung: true      // bấm lại sinh viên đang chọn thì không nạp lại
        }
    };

    /* Bảng khoản — id bảng bản gốc, loại phiếu */
    var BANG = {
        noChung:   { goc: 'tbldata_KhoanNoChung_HDBL',   rs: 'rsPhaiNopTongHopChung', thu: true },
        noRieng:   { goc: 'tbldata_KhoanNoRieng_HDBL',   rs: 'rsPhaiNopRieng',        thu: true },
        thuaChung: { goc: 'tbldata_KhoanThuaChung_HDBL', rs: 'rsDuThuaChung',         thu: false },
        thuaRieng: { goc: 'tbldata_KhoanThuaRieng_HDBL', rs: 'rsDuThuaRieng',         thu: false },
        truoc:     { goc: 'tbldata_NopTruoc_HDBL',       rs: null,                    thu: true },
        thuHo:     { goc: 'tbldata_ThuHo_HDBL',          rs: 'rsKhoanPhaiNop_ThuHo',  thu: true }
    };

    var TABS = [
        { key: 'tt',        text: 'Tình hình học phí',             icon: 'fa-circle-dollar-to-slot' },
        { key: 'noChung',   text: 'Khoản nợ chung',                icon: 'fa-hands-holding-dollar' },
        { key: 'noRieng',   text: 'Khoản nợ riêng',                icon: 'fa-hand-holding-dollar' },
        { key: 'thuaChung', text: 'Khoản thừa chung',              icon: 'fa-circle-dollar' },
        { key: 'thuaRieng', text: 'Khoản thừa riêng',              icon: 'fa-badge-dollar' },
        { key: 'truoc',     text: 'Thu trước - rút trước',         icon: 'fa-money-from-bracket' },
        { key: 'thuHo',     text: 'Thu hộ',                        icon: 'fa-sack-dollar' },
        { key: 'thuHoTT',   text: 'Tình hình tài chính thu hộ',    icon: 'fa-chart-mixed-up-circle-dollar' }
    ];

    /* Nhãn tổng ở đầu từng tab (zoneThongTinBoSungTab2..5 của bản gốc) */
    var TONG_TAB = {
        noChung:   { lbl: 'Tổng nợ chung các khoản', col: 'TONGNOCHUNG', ct: 'noChung' },
        noRieng:   { lbl: 'Tổng nợ riêng các khoản', col: 'TONGNORIENG', ct: 'noRieng' },
        thuaChung: { lbl: 'Tổng dư chung các khoản', col: 'TONGDUCHUNG', ct: 'duChung' },
        thuaRieng: { lbl: 'Tổng dư riêng các khoản', col: 'TONGDURIENG', ct: 'duRieng' }
    };

    var TRANG_THAI = {
        CHUYENTRUONGDI: ['bad', 'Chuyển trường đi'], NORMAL: ['info', 'Đang học'],
        CHUYENTRUONG: ['info', 'Chuyển trường đến'], KHONGXACDINH: ['warn', 'Không xác định'],
        GRADUATE: ['ok', 'Tốt nghiệp'], FORCEDROPOUT: ['bad', 'Buộc thôi học'],
        CANHBAO: ['warn', 'Cảnh báo'], RESERVE: ['info', 'Bảo lưu'], DROPOUT: ['warn', 'Thôi học'],
        XOATEN: ['bad', 'Xóa tên'], REPEATE: ['warn', 'Học lại'], DUNGHOC: ['warn', 'Đình chỉ']
    };

    /* Kiểu của màn: phieuthu/css/_chung_thutien.css (nạp bằng <link> trong html). */

    /* =====================================================================
       mount(root, key) — dựng một màn hình
       ===================================================================== */
    TT.mount = function (root, key) {
        if (!root) return;   /* người dùng đã sang màn khác trước khi tệp màn nạp xong — không còn chỗ để dựng (kiểm host 29/9) */
        var cfg = TT.BIEN_THE[key];
        var c = {
            key: key, cfg: cfg, root: root, M: M, BANG: BANG,
            svRows: [], svPager: 0, svPage: 1,
            hsId: '',            // strHSSV_Id — QLSV_NGUOIHOC_ID
            svRowId: '',         // ID dòng sinh viên đang chọn
            doiTuong: null,      // dt_DoiTuongThu
            ctId: '',            // strChuongTrinh_Id
            dTongDu: 0,          // NOCO
            thongTin: null,      // rsThongTin[0]
            bang: {},            // mô hình từng bảng khoản
            tab: 'tt',
            ngayXuat: '',        // me.strNgayXuatChungTu
            nutHDDT: [],
            khoanThu: [],        // TC_KhoanThu/LayDanhSach
            thoiGian: [],        // DAOTAO_THOIGIANDAOTAO
            ntt: '',             // tên người thu từ danh mục NTT
            tongDaChon: '0',     // lblTongTienDaChon
            phieuId: ''
        };
        Object.keys(BANG).forEach(function (k) { c.bang[k] = []; });

        /* ---------- Khung ------------------------------------------------ */

        /* Bố cục hai cột dùng chung — ums.pat.master (BO-CUC mục 4).
           Tiêu đề trang để NGOÀI khung master vì khi viết phiếu cả khung bị
           thay chỗ, còn tiêu đề + nút báo cáo thì giữ. */
        root.innerHTML =
            '<div class="ums-page__head">' +
            '  <h1 class="ums-page__title ums-u-mb-0">' + esc(cfg.title) + '</h1>' +
            '  <div class="ums-page__actions" data-r="bc"></div>' +
            '</div>' +
            '<div data-r="main"></div>' +
            '<div data-r="phieu" hidden></div>';

        var mst = ums.pat.master({
            el: root.querySelector('[data-r="main"]'),
            side: {
                title: 'Sinh viên', icon: 'fa-user-graduate', search: 'Nhập mã, tên sinh viên',
                filter:
                    '<div class="ums-master__adv" data-r="loc" hidden>' +
                    '  <div class="ums-field"><select class="ums-select" data-r="he"><option value="">Tất cả hệ đào tạo</option></select></div>' +
                    '  <div class="ums-field"><select class="ums-select" data-r="khoa"><option value="">Tất cả khóa đào tạo</option></select></div>' +
                    '  <div class="ums-field"><select class="ums-select" data-r="ct"><option value="">Tất cả chương trình đào tạo</option></select></div>' +
                    '  <div class="ums-field"><select class="ums-select" data-r="lop"><option value="">Tất cả lớp</option></select></div>' +
                    '  <div class="ums-master__advtitle">Trạng thái người học</div>' +
                    '  <label class="ums-check"><input type="checkbox" data-r="ttAll" checked> <b>Tất cả</b></label>' +
                    '  <div class="ums-master__tt" data-r="tt"></div>' +
                    '</div>'
            },
            main: { title: false }
        });

        // pat.master chưa có chỗ cho nút ở đầu khung bên trái / phân trang dưới
        // danh sách — xem đề nghị bổ sung tầng chung trong báo cáo.
        mst.side.querySelector('.ums-panel__tools').innerHTML =
            '<button type="button" class="ums-iconbtn" data-a="tim" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' +
            '<button type="button" class="ums-iconbtn" data-a="loc" title="Tìm kiếm nâng cao"><i class="fa-light fa-sliders"></i></button>';
        mst.sideBody.setAttribute('data-r', 'svList');
        /* Rê chuột lên một người học → thẻ thông tin như popover bản gốc */
        ui.hoverCard(mst.sideBody, '.ums-master__item[data-sv]', theHoSo);
        mst.sideBody.insertAdjacentHTML('afterend', '<div class="thutien-pager" data-r="svPager"></div>');

        mst.mainBody.innerHTML =
            '<div class="ums-panel" data-r="empty"><div class="ums-panel__body">' +
                   ui.empty('Tìm và chọn một sinh viên để xem tình hình học phí và thu tiền', 'fa-user-magnifying-glass') + '</div></div>' +
            '<div data-r="sv" hidden>' +
            /* Đầu khung (ảnh + tên + trạng thái + tổng nợ · Đóng) dựng bằng ums.pat.datDau khi chọn người học */
            '  <div class="ums-panel ums-u-mb-4" data-r="svPanel">' +
            '    <div class="ums-panel__body" data-r="svHead"></div></div>' +
            '  <div class="ums-panel">' +
            '    <nav class="ums-tabs" data-r="tabs">' + TABS.map(function (t) {
                     return '<a class="ums-tabs__item' + (t.key === 'tt' ? ' is-active' : '') + '" href="javascript:void(0)" data-tab="' + t.key + '">' +
                         '<i class="fa-light ' + t.icon + '"></i> ' + esc(t.text) + '</a>';
                 }).join('') + '</nav>' +
            '    <div class="ums-panel__body" data-r="tabBody"></div>' +
            '  </div>' +
            '</div>';

        mst.search.setAttribute('data-r', 'q');
        var el = c.el = {};
        root.querySelectorAll('[data-r]').forEach(function (n) { el[n.getAttribute('data-r')] = n; });

        /* các tab có vùng riêng, dựng một lần */
        TABS.forEach(function (t) {
            var d = document.createElement('div');
            d.setAttribute('data-pane', t.key);
            d.hidden = t.key !== 'tt';
            el.tabBody.appendChild(d);
            el['pane_' + t.key] = d;
        });

        c.chiTiet = TT.chiTiet ? TT.chiTiet(c) : null;

        /* ---------- Gọi API: tiện ích ------------------------------------- */
        function call(o) { return ums.api.call(o); }
        c.call = call;
        function dmRows(code) {
            // = edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc }) — strTieuChiSapXep và dTrangThai để trống như bản gốc
            return call({
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM', method: 'GET', silent: true,
                strMaBangDanhMuc: code, strTieuChiSapXep: ''
            }).then(function (r) { return r.data || []; });
        }
        c.dmRows = dmRows;

        /* =================================================================
           1. TÌM SINH VIÊN
           ================================================================= */
        function svFilter() {
            var ids = [];
            el.tt.querySelectorAll('input[type=checkbox]').forEach(function (x) { if (x.checked) ids.push(x.value); });
            return {
                q: el.q.value.trim(),
                he: el.he.value, khoa: el.khoa.value, ct: el.ct.value, lop: el.lop.value,
                tt: ids.toString()
            };
        }

        function loadSV(page) {
            c.svPage = page || 1;
            var f = svFilter();
            el.svList.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return call({
                action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P',
                func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All',
                strTuKhoa: f.q,
                strNguoiThucHien_Id: '',
                strVaiTroDangNhap_Id: '',
                strChucNangHeThong_Id: '',
                strHanhDong_Code: '',
                strDaoTao_HeDaoTao_Id: f.he,
                strDaoTao_KhoaDaoTao_Id: f.khoa,
                strDaoTao_ChuongTrinh_Id: f.ct,
                strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_LopQuanLy_Id: f.lop,
                strStudyStatus_Ids: f.tt,
                dIsPrimary: '',
                dBoQuaPhamVi: 0,
                pageIndex: c.svPage,
                pageSize: 10
            }).then(function (r) {
                c.svRows = r.data || [];
                c.svPager = r.pager || 0;
                drawSV();
                // Chỉ có đúng 1 kết quả → chọn luôn (bản gốc: data.Pager == 1)
                /* KHÔNG tự chọn khi còn một kết quả — gõ là tự tìm, có thể nhiều người trùng tên (người dùng 2026-09-26) */
            }).catch(function (err) {
                el.svList.innerHTML = '';
                ums.api.handle(err, 'tìm sinh viên');
            });
        }

        /* Ảnh người tròn chung (.ums-ava — như ums.pat.anhNguoi): có ảnh thì ảnh, không có / lỗi thì biểu tượng
           người (người dùng 2026-09-26: màn có sinh viên thì phải là ảnh, không phải chữ cái đầu). Đường dẫn ảnh
           giữ cách gốc: rootPathUpload + '/' + ANH. */
        function avatar(r) {
            return ums.pat.anhNguoi(M.checkValue(r.ANH) ? r.ANH : '');   // ums.files.url = rootPathUpload + '/' + ANH
        }

        function drawSV() {
            if (!c.svRows.length) {
                el.svList.innerHTML = ui.empty('Không tìm thấy sinh viên', 'fa-user-magnifying-glass');
                el.svPager.innerHTML = '';
                return;
            }
            // mục danh sách của ums.pat.master
            el.svList.innerHTML = c.svRows.map(function (r) {
                return '<button type="button" class="ums-master__item' + (r.ID === c.svRowId ? ' is-active' : '') +
                    '" data-sv="' + esc(r.ID) + '"><span class="thutien-sv__row">' + avatar(r) +
                    '<span class="ums-u-flex1 thutien-sv__txt">' +
                    '<span class="ums-cell__title">' + esc(M.checkValue(r.HODEM) ? r.HODEM : '') + ' ' + esc(M.checkValue(r.TEN) ? r.TEN : '') + '</span>' +
                    '<span class="ums-master__item__sub">' + esc(M.checkValue(r.MASO) ? r.MASO : '') +
                    ' · Lớp: ' + esc(M.checkValue(r.DAOTAO_LOPQUANLY_N1_TEN) ? r.DAOTAO_LOPQUANLY_N1_TEN : '') + '</span></span></span></button>';
            }).join('');
            el.svPager.innerHTML = Number(c.svPager) > 10 ? ui.pager({ index: c.svPage, size: 10, total: Number(c.svPager) }, c.svRows.length) : '';
            el.svPager.querySelectorAll('.ums-pager__btn[data-go]').forEach(function (b) {
                b.addEventListener('click', function () { loadSV(Number(b.getAttribute('data-go'))); });
            });
        }

        /* Thẻ thông tin hiện khi RÊ CHUỘT lên một người học — dựng lại popover
           của bản gốc (thutien.js:1500 popover_HSDoiTuong): ảnh bên trái, mười dòng
           thông tin bên phải, đúng thứ tự và đúng các trường đó. */
        var HC_ROWS = [
            ['fa-id-badge', 'Mã', function (r) { return r.MASO; }],
            ['fa-circle-user', 'Tên', function (r) {
                return [M.e(r.HODEM), M.e(r.TEN)].join(' ').trim();
            }],
            ['fa-cake-candles', 'Ngày sinh', function (r) {
                var x = [r.NGAYSINH_NGAY, r.NGAYSINH_THANG, r.NGAYSINH_NAM];
                return x.every(M.checkValue) ? x.join('/') : '';
            }],
            ['fa-screen-users', 'Lớp', function (r) { return r.DAOTAO_LOPQUANLY_N1_TEN; }],
            ['fa-book-open-cover', 'Ngành', function (r) { return r.NGANHHOC_N1_TEN; }],
            ['fa-chalkboard-user', 'Khóa', function (r) { return r.KHOAHOC_N1_MA || r.KHOAHOC_N1_TEN; }],
            ['fa-graduation-cap', 'Hệ', function (r) { return r.TENHEDAOTAO; }],
            ['fa-location-dot', 'Địa chỉ', function (r) { return r.TTLL_KHICANBAOTINCHOAI_ODAU; }],
            ['fa-phone', 'Số điện thoại', function (r) {
                return r.SODIENTHOAI_CANHAN || r.TTLL_DIENTHOAICANHAN;
            }],
            ['fa-id-card', 'CCCD', function (r) {
                return r.DINHDANH_CHINH_SO || r.CCCD || r.IDENTIFIER_NO;
            }]
        ];

        function theHoSo(muc) {
            var id = muc.getAttribute('data-sv');
            var r = c.svRows.filter(function (x) { return String(x.ID) === String(id); })[0];
            if (!r) return null;
            var anh = M.checkValue(r.ANH)
                ? '<img alt="" src="' + esc(((ums.session && ums.session.rootPathUpload) || '') + '/' + r.ANH) +
                  '" onerror="this.remove()">'
                : '<i class="fa-light fa-user"></i>';
            return '<div class="ums-hovercard__in">' +
                '<div class="ums-hovercard__ava">' + anh + '</div>' +
                '<div class="ums-hovercard__rows">' +
                HC_ROWS.map(function (d) {
                    var v = d[2](r);
                    return '<div class="ums-hovercard__row"><i class="fa-light ' + d[0] + '"></i>' +
                        '<span>' + esc(d[1]) + ' :</span><b>' + esc(M.checkValue(v) ? v : '') + '</b></div>';
                }).join('') +
                '</div></div>';
        }

        /* --- danh mục lọc: bản gốc nạp hệ + khoá lúc mở, CT + lớp khi đổi --- */
        function fillSel(sel, rows, name, title) {
            var cur = sel.value;
            sel.innerHTML = '<option value="">' + esc(title) + '</option>' + rows.map(function (r) {
                return '<option value="' + esc(r.ID) + '">' + esc(r[name]) + '</option>';
            }).join('');
            M.setSelect(sel, cur);
            if (sel.selectedIndex < 0) sel.value = '';
        }
        function loadHe() {
            return ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { fillSel(el.he, r, 'TENHEDAOTAO', 'Tất cả hệ đào tạo'); });
        }
        function loadKhoa() {
            return ums.ref.khoaDaoTao({ strHeDaoTao_Id: el.he.value, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { fillSel(el.khoa, r, 'TENKHOA', 'Tất cả khóa đào tạo'); });
        }
        function loadCT() {
            return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: el.khoa.value, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { fillSel(el.ct, r, 'TENCHUONGTRINH', 'Tất cả chương trình đào tạo'); });
        }
        function loadLop() {
            return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: el.he.value, strKhoaDaoTao_Id: el.khoa.value, strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: el.ct.value, strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { fillSel(el.lop, r, 'TEN', 'Tất cả lớp'); });
        }
        function refErr(err) { ums.api.handle(err, 'nạp danh mục đào tạo'); }
        el.he.addEventListener('change', function () { loadKhoa().then(loadCT).then(loadLop).catch(refErr); });
        el.khoa.addEventListener('change', function () { loadCT().then(loadLop).catch(refErr); });
        el.ct.addEventListener('change', function () { loadLop().catch(refErr); });
        // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
        ums.pat.chain([el.he, el.khoa, el.ct, el.lop], { phatLai: false });

        function loadTrangThai() {
            return call({ action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strMaBangDanhMuc: 'QLSV.TRANGTHAI' })
                .then(function (r) {
                    el.tt.innerHTML = (r.data || []).map(function (d) {
                        return '<label class="ums-check"><input type="checkbox" checked value="' + esc(d.ID) + '"> ' + esc(d.TEN) + '</label>';
                    }).join('');
                }).catch(function (err) { console.warn('[thutien] QLSV.TRANGTHAI', err); });
        }
        el.ttAll.addEventListener('change', function () {
            var on = el.ttAll.checked;
            el.tt.querySelectorAll('input[type=checkbox]').forEach(function (x) { x.checked = on; });
        });

        /* Cùng khuôn cột trái (BO-CUC luật 12, người dùng 2026-09-26): gõ là tự tìm sau 400ms (Enter tìm ngay),
           đổi ô chọn / trạng thái là tự tải — không còn nút Tìm kiếm. */
        var henTim = 0;
        function timSau(ms) { clearTimeout(henTim); henTim = setTimeout(function () { loadSV(1); }, ms); }
        el.q.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(henTim); loadSV(1); }
        });
        el.q.addEventListener('input', function () { timSau(400); });
        [el.he, el.khoa, el.ct, el.lop].forEach(function (x) { x.addEventListener('change', function () { timSau(300); }); });
        el.tt.addEventListener('change', function () { timSau(300); });
        el.ttAll.addEventListener('change', function () { timSau(300); });

        /* =================================================================
           2. CHỌN SINH VIÊN → thông tin + tình trạng tài chính
           ================================================================= */
        function pickSV(rowId) {
            if (cfg.boQuaNeuTrung && rowId === c.svRowId) return;
            var r = c.svRows.find(function (x) { return x.ID == rowId; });   // eslint-disable-line eqeqeq
            if (!r) return;
            resetSV();
            c.svRowId = r.ID;
            // thutien: me.strHSSV_Id = dt_HS.find(ID).QLSV_NGUOIHOC_ID
            c.hsId = M.e(r.QLSV_NGUOIHOC_ID);
            if (key === 'viewthutien' && !c.hsId) c.hsId = r.ID;   // bản gốc view dùng ID dòng
            c.doiTuong = r;
            c.svRow = r;
            c.ctId = M.e(r.DAOTAO_TOCHUCCHUONGTRINH_ID);
            el.svList.querySelectorAll('[data-sv]').forEach(function (li) {
                li.classList.toggle('is-active', li.getAttribute('data-sv') === String(r.ID));
            });
            ui.swap(el.empty, el.sv, { top: false });
            drawSVHead();
            setTab('tt');
            loadTT();
        }

        function resetSV() {
            c.hsId = '';
            c.thongTin = null;
            c.tongDaChon = '0';
            Object.keys(BANG).forEach(function (k) { c.bang[k] = []; });
            if (c.chiTiet) c.chiTiet.reset();
        }

        function closeSV() {
            el.svList.querySelectorAll('.is-active').forEach(function (li) { li.classList.remove('is-active'); });
            c.svRowId = '';
            resetSV();
            el.sv.hidden = true;
            el.empty.hidden = false;
        }

        function drawSVHead() {
            var r = c.svRow || {};
            var ce = function (v) { return M.checkValue(v) ? v : ''; };
            var hoTen = ce(r.HODEM) + ' ' + ce(r.TEN);
            var line = hoTen.toUpperCase();
            if (M.checkValue(r.MASO)) line += ' - ' + r.MASO;
            if (M.checkValue(r.TTLL_DIENTHOAICANHAN)) line += ' - ' + r.TTLL_DIENTHOAICANHAN;
            if (cfg === TT.BIEN_THE.thutien && M.checkValue(r.NIENKHOA_N1)) line += ' - (' + r.NIENKHOA_N1 + ')';

            var ma = M.e(r.QLSV_TRANGTHAINGUOIHOC_MA);
            var tt = TRANG_THAI[ma] || ['ok', 'Đang học'];
            var tenBE = ce(r.QLSV_TRANGTHAINGUOIHOC_TEN);
            var tenTT = (tenBE && String(tenBE).trim() !== '' && tenBE !== '-') ? tenBE : tt[1];
            var qd = [];
            if (M.checkValue(r.QLSV_QUYETDINH_N1_SOQD)) qd.push('Số QĐ: ' + r.QLSV_QUYETDINH_N1_SOQD);
            if (M.checkValue(r.QLSV_QUYETDINH_N1_NGAYQD)) qd.push('Ngày QĐ: ' + r.QLSV_QUYETDINH_N1_NGAYQD);
            if (M.checkValue(r.QLSV_QUYETDINH_N1_NGAYHIEULUC)) qd.push('Hiệu lực: ' + r.QLSV_QUYETDINH_N1_NGAYHIEULUC);
            if (M.checkValue(r.QLSV_QUYETDINH_N1_NOIDUNGQD)) qd.push(r.QLSV_QUYETDINH_N1_NOIDUNGQD);

            /* Mỗi thông tin một ô có biểu tượng, xếp thành lưới — bản gốc cũng
               gắn biểu tượng cho từng mục (thutien.html:1494-1501: fa-screen-users,
               fa-leanpub, fa-building-columns, fa-calendar-days). Ở đây dùng bản
               fa-light cho đồng bộ với cả hệ. */
            function info(lbl, v, icon) {
                return '<span class="thutien-info__it" title="' + esc(lbl + ': ' + (M.checkValue(v) ? v : '-')) + '">' +
                    '<i class="fa-light ' + (icon || 'fa-circle-info') + '"></i>' +
                    '<span class="thutien-info__lb">' + esc(lbl) + '</span>' +
                    '<b>' + esc(M.checkValue(v) ? v : '-') + '</b></span>';
            }
            var ngaySinh = [ce(r.NGAYSINH_NGAY), ce(r.NGAYSINH_THANG), ce(r.NGAYSINH_NAM)].join('/');

            /* Đầu khung CHUNG (ums.pat.dauDoiTuong, người dùng 2026-09-26): ảnh + tên + trạng thái + tổng nợ / dư
               ngay sau tên · Đóng ở tools — .ums-panel__head nên dính đỉnh khi cuộn. Ảnh giữ cách gốc:
               rootPathUpload + '/' + ANH. */
            ums.pat.datDau(el.svPanel, {
                anh: M.checkValue(r.ANH) ? r.ANH : '',
                ten: line,
                nhan: '<span title="' + esc(qd.join(' · ')) + '">' + ui.badge(tenTT, tt[0]) + '</span>',
                tools: ui.btn('close', { text: 'Đóng', attr: { 'data-a': 'dongSV' } })
            });
            /* Thân khung: tổng nợ / dư (phải) + lưới thông tin. "Tổng tiền đã chọn" KHÔNG còn ở đây — đã dời vào thanh
               công cụ của từng tab, cạnh nút Thu tiền / Rút tiền (người dùng 2026-09-26: phải thấy ngay chỗ đang tick chọn). */
            el.svHead.innerHTML =
                '<div class="thutien-head">' +
                '  <div class="thutien-info">' +
                       info('Lớp', r.DAOTAO_LOPQUANLY_N1_TEN, 'fa-screen-users') +
                       info('Ngành', r.NGANHHOC_N1_TEN, 'fa-book-open-cover') +
                       info('Khóa', r.KHOAHOC_N1_TEN, 'fa-building-columns') +
                       info('Niên khóa', r.NIENKHOA_N1, 'fa-calendar-days') +
                       info('Hệ', r.TENHEDAOTAO, 'fa-layer-group') +
                       info('Ngày sinh', ngaySinh === '//' ? '' : ngaySinh, 'fa-cake-candles') +
                       info('SĐT', r.SODIENTHOAI_CANHAN || r.TTLL_DIENTHOAICANHAN, 'fa-phone') +
                       info('CCCD', r.DINHDANH_CHINH_SO || r.CCCD || r.IDENTIFIER_NO, 'fa-id-card') +
                       info('Địa chỉ', r.TTLL_KHICANBAOTINCHOAI_ODAU, 'fa-location-dot') +
                '  </div>' +
                '</div>';
        }

        /* --- tình trạng tài chính -------------------------------------- */
        function loadTT() {
            var hs = c.hsId;
            return call({
                action: cfg.ttAction, method: 'GET', versionAPI: 'v1.0',
                strQLSV_NguoiHoc_Id: hs, strNguoiThucHien_Id: '', strNguonDuLieu_Id: ''
            }).then(function (r) {
                if (hs !== c.hsId) return;               // đã chọn sinh viên khác
                var d = r.data || {};
                ['noChung', 'noRieng', 'thuaChung', 'thuaRieng', 'thuHo'].forEach(function (k) {
                    c.bang[k] = (d[BANG[k].rs] || []).map(dongTuMayChu);
                });
                c.thongTin = (d.rsThongTin || [])[0] || {};
                if (d.rsThongTin && d.rsThongTin[0]) c.doiTuong = d.rsThongTin[0];   // me.dt_DoiTuongThu = rsThongTin[0]
                drawTongQuat();
                c.theoDot = { dot: d.rsDotCongNo || [], no: d.rsTongHopNoTheoDot || [], du: d.rsTongHopDuTheoDot || [] };
                ['noChung', 'noRieng', 'thuaChung', 'thuaRieng', 'thuHo', 'truoc'].forEach(drawBang);
                if (c.chiTiet) c.chiTiet.tongQuat();

                if (cfg.tuChonTab) {
                    if (c.bang.noChung.length) { setTab('noChung'); chonHet('noChung'); }
                    else if (c.bang.thuHo.length) { setTab('thuHo'); chonHet('thuHo'); }
                }
            }).catch(function (err) { ums.api.handle(err, 'tình trạng tài chính'); });
        }
        c.loadTT = loadTT;

        function dongTuMayChu(a) {
            return {
                id: a.ID,
                khoanId: a.TAICHINH_CACKHOANTHU_ID,
                tgId: a.DAOTAO_THOIGIANDAOTAO_ID,
                hk: a.DAOTAO_THOIGIANDAOTAO,
                dot: a.DAOTAO_THOIGIANDAOTAO_DOT,
                ten: a.TAICHINH_CACKHOANTHU_TEN,
                noiDung: M.e(a.NOIDUNG),
                noiDungGoc: M.e(a.NOIDUNG),                     // thuộc tính noidung của nút QR
                soLuong: '1',
                soTien: M.fmt(a.SOTIEN),
                goc: M.fmt(a.SOTIEN),                           // thuộc tính name của ô số tiền
                htct: String(a.HETHONGCHUNGTU_MA),              // title của ô chọn (undefined → "undefined" như bản gốc)
                maDD: M.e(a.MATHANHTOANDINHDANH),
                chon: false,
                canDoi: true
            };
        }

        function drawTongQuat() {
            var t = c.thongTin || {};
            var dNoCo = t.NOCO;
            c.dTongDu = dNoCo;
            /* viên chung "Tổng nợ / Tổng dư / Đã hoàn thành" trên tiêu đề (ums.pat.noCo) */
            ums.pat.datNoCo(el.svPanel, M.floatValid(dNoCo) ? Number(dNoCo) : '', 'Chưa xác định');
        }

        /* =================================================================
           3. BẢNG KHOẢN (nợ chung / nợ riêng / thừa / thu trước / thu hộ)
           ================================================================= */
        function tongDaChon(k) {
            var rows = c.bang[k].filter(function (x) { return x.chon; });
            // edu.system.countFloat(t, 6, 7, 5): số tiền × số lượng, chỉ dòng được chọn
            return M.tong(rows.map(function (x) { return x.soTien; }), rows.map(function (x) { return x.soLuong; }));
        }
        function tongCot(k) {
            // insertSumAfterTable(t, [6]): cộng số tiền của mọi dòng
            return M.tong(c.bang[k].map(function (x) { return x.soTien; }));
        }
        function capNhatTong(k) {
            c.tongDaChon = tongDaChon(k);
            var pane = el['pane_' + k];
            var dc = pane && pane.querySelector('[data-tt="chon"]');
            if (dc) dc.textContent = c.tongDaChon;
            var f = pane && pane.querySelector('[data-tong]');
            if (f) f.textContent = c.bang[k].length ? tongCot(k) : '';
        }
        c.capNhatTong = capNhatTong;

        function chonHet(k) {
            c.bang[k].forEach(function (x) { x.chon = true; });
            drawBang(k);
        }

        /* Thanh thao tác CHUNG của tab (ums.pat.thanhThu, người dùng 2026-09-26): trái = tổng của tab + "Chi tiết"
           (mở hộp thoại) · phải = [ô ngày chứng từ] + "Tổng tiền đã chọn" + nút Thu tiền / Rút tiền… */
        function toolbar(k) {
            var L = '', R = '';
            if (k === 'noChung' || k === 'noRieng') {
                if (cfg.ngayChungTu) L += ui.filterInput('Ngày xuất chứng từ', {}).replace('<input', '<input data-ngay="' + k + '"');
                R += ui.btn('save', { text: 'Thu tiền', mod: 'primary', attr: { 'data-viet': k } });
                if (k === 'noChung' && cfg.qr) R += ui.btn('add', { text: 'Tạo QR thanh toán', mod: 'ghost', attr: { 'data-a': 'taoQR' } });
            } else if (k === 'thuaChung' || k === 'thuaRieng') {
                R += ui.btn('save', { text: 'Rút tiền', mod: 'navy', attr: { 'data-viet': k } });
            } else if (k === 'truoc') {
                R += ui.btn('save', { text: 'Rút tiền', mod: 'navy', attr: { 'data-viet': 'truocRut' } });
                if (cfg.ngayChungTu) L += ui.filterInput('Ngày xuất chứng từ', {}).replace('<input', '<input data-ngay="truoc"');
                R += ui.btn('save', { text: 'Thu tiền', mod: 'primary', attr: { 'data-viet': 'truoc' } });
            } else if (k === 'thuHo') {
                R += ui.btn('save', { text: 'Thu hộ', mod: 'danger', attr: { 'data-viet': k } });
            }
            var T = TONG_TAB[k];
            return ums.pat.thanhThu({
                tongLbl: T ? T.lbl : '', tong: 0,
                chiTiet: T && c.chiTiet ? 'data-ct="' + T.ct + '"' : '',
                truocNut: L, daChon: !!R, nut: R
            });
        }

        function drawBang(k) {
            var pane = el['pane_' + k];
            if (!pane) return;
            // giữ khung (thanh công cụ, ô ngày) nếu đã dựng
            if (!pane.getAttribute('data-built')) {
                var extra = k === 'truoc' ? '<div data-r2="truocChon"></div>' : '';
                pane.innerHTML = extra + toolbar(k) + '<div data-bang="' + k + '"></div>';
                pane.setAttribute('data-built', '1');
                pane.querySelectorAll('[data-ngay]').forEach(function (inp) { ui.datepicker(inp); });
                if (k === 'truoc') drawTruocChon(pane.querySelector('[data-r2="truocChon"]'));
            }
            if (TONG_TAB[k]) {
                var t = c.thongTin || {};
                var v = t[TONG_TAB[k].col];
                var b = pane.querySelector('[data-tt="tong"]');
                // bản gốc: floatValid → formatCurrency, không thì 0 (riêng TONGDUCHUNG luôn formatCurrency)
                if (b) b.textContent = M.floatValid(v) || TONG_TAB[k].col === 'TONGDUCHUNG' ? M.fmt(v) : '0';
            }
            var host = pane.querySelector('[data-bang]');
            var rows = c.bang[k];
            var truoc = k === 'truoc';
            var qr = k === 'noChung' && cfg.qr;
            var cols = [
                { title: 'Học kỳ / Đợt', render: function (x) {
                    return ui.cell(x.hk, M.checkValue(x.dot) ? 'Đợt ' + x.dot : '');
                } },
                { title: truoc ? 'Khoản thu' : 'Khoản', render: function (x, i) {
                    // cột "Mã thanh toán định danh" + nút QR (.btnThanhToanQR) của bản gốc gộp vào đây
                    return '<div class="ums-cell__title">' + esc(x.ten) + '</div>' + (qr
                        ? '<button type="button" class="thutien-qr ums-u-fz12" data-qr="' + i + '" title="Mã QR thanh toán"><i class="fa-light fa-qrcode"></i> ' + esc(x.maDD) + '</button>'
                        : '');
                } },
                { title: 'Nội dung', render: function (x, i) {
                    return '<input class="thutien-in" data-f="noiDung" data-i="' + i + '" value="' + esc(x.noiDung) + '">';
                } },
                { title: 'Số lượng', width: '80px', cls: 'is-center', render: function (x, i) {
                    return '<input class="thutien-in is-num" data-f="soLuong" data-i="' + i + '" value="' + esc(x.soLuong) + '" inputmode="decimal">';
                } },
                { title: 'Số tiền', width: '150px', cls: 'is-right', render: function (x, i) {
                    return '<input class="thutien-in is-num" data-f="soTien" data-i="' + i + '" value="' + esc(x.soTien) + '" inputmode="decimal">';
                }, sum: function () { return '<span class="thutien-sum" data-tong>' + esc(tongCot(k)) + '</span>'; } },
                { head: '<input type="checkbox" data-all="' + k + '"' + (rows.length && rows.every(function (x) { return x.chon; }) ? ' checked' : '') + ' title="Chọn tất cả">',
                  cls: 'is-center', width: '48px', render: function (x, i) {
                    return '<input type="checkbox" data-chon="' + i + '"' + (x.chon ? ' checked' : '') + '>';
                } }
            ];
            if (truoc && cfg.canDoi) {
                cols.push({ title: 'Cân đối', cls: 'is-center', width: '70px', render: function (x, i) {
                    return '<input type="checkbox" data-candoi="' + i + '"' + (x.canDoi ? ' checked' : '') + '>';
                } });
            }
            ui.table({
                el: host, columns: cols, rows: rows, tableCls: 'ums-table--lined thutien-t',
                empty: truoc ? 'Chọn học kỳ và khoản thu nộp trước ở trên' : 'Không có khoản nào'
            });
            host.querySelectorAll('tbody tr').forEach(function (tr, i) { if (rows[i] && rows[i].chon) tr.classList.add('is-on'); });
            host.setAttribute('data-k', k);
            capNhatTong(k);
        }
        c.drawBang = drawBang;

        /* Sự kiện trong các bảng khoản — gắn MỘT lần trên phần thân tab */
        el.tabBody.addEventListener('input', function (ev) {
            var t = ev.target;
            var host = t.closest('[data-bang]');
            if (!host || !t.hasAttribute('data-f')) return;
            var k = host.getAttribute('data-k');
            var x = c.bang[k][Number(t.getAttribute('data-i'))];
            var f = t.getAttribute('data-f');
            if (!x) return;
            if (f === 'noiDung') { x.noiDung = t.value; return; }
            // edu.system.checkSoTienInput(this, bQuaSoTien)
            var khongQua = cfg.khongQuaThua && (k === 'thuaChung' || k === 'thuaRieng');
            var ok = M.chuanHoaO(t, f === 'soTien' ? x.goc : undefined, khongQua);
            x[f] = t.value;
            if (ok) capNhatTong(k);
        });
        el.tabBody.addEventListener('change', function (ev) {
            var t = ev.target;
            var host = t.closest('[data-bang]');
            if (!host) return;
            var k = host.getAttribute('data-k');
            if (t.hasAttribute('data-chon')) {
                var x = c.bang[k][Number(t.getAttribute('data-chon'))];
                x.chon = t.checked;
                t.closest('tr').classList.toggle('is-on', t.checked);
                capNhatTong(k);
            } else if (t.hasAttribute('data-all')) {
                // edu.util.checkedAll_BgRow
                c.bang[k].forEach(function (y) { y.chon = t.checked; });
                drawBang(k);
            } else if (t.hasAttribute('data-candoi')) {
                c.bang[k][Number(t.getAttribute('data-candoi'))].canDoi = t.checked;
            }
        });

        /* --- Thu trước: chọn học kỳ + tích khoản thu → thêm dòng --------- */
        /* Học kỳ nhớ ở localStorage.strHocKy_Id (chỉ thutien ghi, cả hai đọc — như bản gốc) */
        function fillTruocChon(box) {
            var luu = '';
            try { luu = localStorage.getItem('strHocKy_Id') || ''; } catch (e) { /* */ }
            if (key !== 'thutien') luu = '';   // viewthutien không đọc giá trị nhớ
            var sel = box.querySelector('[data-r2="hk"]');
            sel.innerHTML = '<option value="">--Chọn học kỳ thu--</option>' + c.thoiGian.map(function (r) {
                return '<option value="' + esc(r.ID) + '">' + esc(r.DAOTAO_THOIGIANDAOTAO) + '</option>';
            }).join('');
            if (luu) M.setSelect(sel, luu);
            if (sel.selectedIndex < 0) sel.value = '';
            box.querySelector('[data-r2="lktWrap"]').hidden = !sel.value;
            box.querySelector('[data-r2="lkt"]').innerHTML = c.khoanThu.map(function (r) {
                return '<label class="ums-check"><input type="checkbox" data-lkt="' + esc(r.ID) + '"> ' + esc(r.TEN) + '</label>';
            }).join('');
        }
        c.fillTruocChon = function () {
            var box = el.pane_truoc.querySelector('[data-r2="truocChon"]');
            if (box) fillTruocChon(box);
        };

        function drawTruocChon(box) {
            box.innerHTML =
                '<div class="thutien-bar"><div class="thutien-bar__l">' +
                '<div class="ums-field"><select class="ums-select" data-r2="hk"></select></div></div></div>' +
                '<div data-r2="lktWrap" class="ums-u-mb-4" hidden>' +
                '<div class="ums-u-fz13 ums-u-semi ums-u-blue ums-u-mb-2"><i class="fa-light fa-money-from-bracket"></i> Chọn khoản thu nộp trước</div>' +
                '<div class="thutien-lkt" data-r2="lkt"></div></div>';
            fillTruocChon(box);
            var sel = box.querySelector('[data-r2="hk"]');
            var wrap = box.querySelector('[data-r2="lktWrap"]');
            box.addEventListener('change', function (ev) {
                if (ev.target === sel) {
                    if (!sel.value) { wrap.hidden = true; return; }
                    try { if (key === 'thutien') localStorage.setItem('strHocKy_Id', sel.value); } catch (e) { /* */ }
                    wrap.hidden = false;
                    return;
                }
                var cb = ev.target.closest('[data-lkt]');
                if (!cb) return;
                var tg = sel.value;
                if (!M.checkValue(tg)) {
                    cb.checked = false;
                    ui.toast('Vui lòng chọn học kỳ trước khi thao tác!', 'warn');
                    return;
                }
                var tgTen = sel.options[sel.selectedIndex].text;
                var kt = c.khoanThu.find(function (r) { return String(r.ID) === cb.getAttribute('data-lkt'); }) || {};
                if (cb.checked) {
                    c.bang.truoc.push({
                        id: kt.ID, khoanId: kt.ID, tgId: tg, hk: tgTen, dot: '', ten: kt.TEN,
                        noiDung: cfg.noiDungTruoc ? kt.TEN + '(' + tgTen + ')' : '',
                        soLuong: '1', soTien: '0', goc: undefined, htct: 'null', maDD: '',
                        chon: true, canDoi: true
                    });
                } else if (cfg.boChonXoaDong) {
                    c.bang.truoc = c.bang.truoc.filter(function (x) { return String(x.khoanId) !== String(kt.ID); });
                }
                drawBang('truoc');
            });
        }

        /* =================================================================
           4. TAB
           ================================================================= */
        function setTab(k) {
            c.tab = k;
            el.tabs.querySelectorAll('.ums-tabs__item').forEach(function (a) {
                a.classList.toggle('is-active', a.getAttribute('data-tab') === k);
            });
            TABS.forEach(function (t) { el['pane_' + t.key].hidden = t.key !== k; });
            if (BANG[k]) capNhatTong(k);
            if (k === 'thuHoTT' && c.chiTiet) c.chiTiet.thuHo(el.pane_thuHoTT);
        }
        c.setTab = setTab;

        el.tabs.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-tab]');
            if (!a) return;
            setTab(a.getAttribute('data-tab'));
        });

        /* =================================================================
           5. VIẾT PHIẾU (genHTML_NoiDung_BienLai / _DongTruoc)
           ================================================================= */
        function vietPhieu(nut) {
            var k = nut === 'truocRut' ? 'truoc' : nut;
            var bThu = nut === 'truocRut' ? false : BANG[k].thu;
            var dongTruoc = k === 'truoc';
            var chon = c.bang[k].filter(function (x) { return x.chon; });
            if (!chon.length) { ui.toast('Vui lòng chọn khoản thu', 'warn'); return; }

            // Ngày xuất chứng từ: bản gốc chỉ cập nhật ở nợ chung, nợ riêng, thu trước (thu)
            if (cfg.ngayChungTu && (k === 'noChung' || k === 'noRieng' || nut === 'truoc')) {
                c.ngayXuat = c.ngayInput(k);
            }

            var mo = function () { moPhieu(k, bThu, dongTruoc); };
            if (cfg.kiemTraDu && (k === 'thuaChung' || k === 'thuaRieng')) {
                var chonTien = parseFloat(String(c.tongDaChon).replace(/,/g, ''));
                if (chonTien > parseFloat(c.dTongDu)) {
                    if (k === 'thuaChung') {
                        ui.confirm('Số tiền vượt mức cho phép: ' + M.fmt(c.dTongDu) + '. Bạn có muốn tiếp tục?', { ok: 'Tiếp tục' })
                            .then(function (yes) { if (yes) mo(); });
                    } else {
                        ui.toast('Số tiền vượt mức cho phép: ' + M.fmt(c.dTongDu), 'warn');
                    }
                    return;
                }
            }
            mo();
        }

        function macDinhNgay(s) { return s && String(s).indexOf('/') !== -1 ? s : M.homNay(); }
        c.ngayInput = function (k) {
            var inp = el['pane_' + k] && el['pane_' + k].querySelector('[data-ngay]');
            return inp ? inp.value.trim() : '';
        };

        function loaiChungTu(htct, bThu) {
            switch (htct) {
                case 'TAICHINH_HETHONGPHIEUTHU': return 'phiếu thu tiền';
                case 'TAICHINH_HOADON': return 'hóa đơn bán hàng';
                case 'TAICHINH_HETHONGBIENLAI': return 'CHỨNG TỪ ĐỂ IN';
                case 'TAICHINH_HETHONGPHIEUTHURUT': return 'biên lai rút tiền';
                default: return bThu ? 'CHỨNG TỪ ĐỂ IN' : 'biên lai rút tiền';
            }
        }

        function moPhieu(k, bThu, dongTruoc) {
            var chon = c.bang[k].filter(function (x) { return x.chon; });
            var htct = chon[0].htct;
            for (var i = 0; i < chon.length; i++) {
                if (chon[i].htct !== htct) {
                    ui.toast('Mã hệ thống chứng từ khác nhau. Vui lòng kiểm tra lại! ("' + htct + '" : "' + chon[i].htct + '")', 'warn');
                    return;
                }
            }
            /* dòng phiếu: bỏ dòng số tiền "== 0" (so sánh lỏng như bản gốc) */
            var dong = [];
            for (var j = 0; j < chon.length; j++) {
                var x = chon[j];
                if (x.soTien == 0) continue;   // eslint-disable-line eqeqeq
                if (!M.floatValid(M.strip(x.soLuong))) {
                    ui.toast('Số lượng của khoản "' + x.ten + '" không hợp lệ', 'warn');
                    return;
                }
                var dg = M.soTien(x.soTien), sl = M.soTien(x.soLuong);
                dong.push({
                    khoanId: x.khoanId, tgId: x.tgId, ten: x.ten, noiDung: x.noiDung,
                    soLuongText: x.soLuong, donGiaText: x.soTien,
                    thanhTienText: M.fmt(dg * sl),       // tinhHeSoGiaTien: formatCurrency(giá × hệ số)
                    canDoi: x.canDoi ? 1 : 0,
                    dvt: ''
                });
            }
            var tongTT = dong.length ? M.tong(dong.map(function (d) { return d.thanhTienText; })) : undefined;
            if (tongTT == 0 || tongTT == '0' || tongTT == undefined) {   // eslint-disable-line eqeqeq
                ui.toast('Tổng các khoản chọn phải lớn hơn 0', 'warn');
                return;
            }
            c.phieu = {
                k: k, bThu: bThu, dongTruoc: dongTruoc, dong: dong,
                loai: loaiChungTu(htct, bThu),
                tongSL: M.tong(dong.map(function (d) { return d.soLuongText; })),
                tongDG: M.tong(dong.map(function (d) { return d.donGiaText; })),
                tongTT: tongTT,
                bangChu: M.docChu(tongTT),
                // _showNgayLapPhieuEditor(mặc định): thu trước lấy ô ngày của tab thu trước,
                // các bảng khác lấy strNgayXuatChungTu (có thể là giá trị của lần trước — như bản gốc)
                ngayLap: cfg.ngayChungTu ? macDinhNgay(dongTruoc ? c.ngayInput('truoc') : c.ngayXuat) : '',
                htttRows: [], lttRows: [], dvtRows: [],
                httt: '', ltt: ''
            };
            TT.phieu.ve(c);
        }
        c.vietPhieu = vietPhieu;

        /* =================================================================
           6. SỰ KIỆN CHUNG
           ================================================================= */
        root.addEventListener('click', function (ev) {
            var t = ev.target;
            var sv = t.closest('[data-sv]');
            if (sv) { pickSV(sv.getAttribute('data-sv')); return; }
            var a = t.closest('[data-a]');
            if (a) {
                var act = a.getAttribute('data-a');
                if (act === 'tim') { loadSV(1); return; }
                if (act === 'loc') { el.loc.hidden = !el.loc.hidden; return; }
                if (act === 'dongSV') { closeSV(); return; }
                if (act === 'taoQR') { taoQR(); return; }
            }
            var v = t.closest('[data-viet]');
            if (v) { vietPhieu(v.getAttribute('data-viet')); return; }
            var q = t.closest('[data-qr]');
            if (q) { qrKhoan(Number(q.getAttribute('data-qr'))); return; }
            var ct = t.closest('[data-ct]');
            if (ct && c.chiTiet && el.sv.contains(ct)) {
                c.chiTiet.mo(ct.getAttribute('data-ct'));     // mở hộp thoại, KHÔNG chuyển tab (người dùng 2026-09-26)
            }
        });

        /* QR thanh toán một khoản nợ chung (.btnThanhToanQR) */
        function qrKhoan(i) {
            var x = c.bang.noChung[i];
            if (!x) return;
            var soTien = String(x.goc).replace(/,/g, '');          // thuộc tính sotien = formatCurrency(SOTIEN) gốc
            var nd = M.boDau(x.noiDungGoc);
            var src = 'https://api.vietqr.io/image/970418-' + encodeURIComponent(x.maDD) +
                '-JIzXIaG.jpg?accountName=LU%20A%20TUAN&amount=' + encodeURIComponent(soTien) + '&addInfo=' + encodeURIComponent(nd);
            ui.dialog({
                title: 'QR thanh toán — ' + x.ten, icon: 'fa-qrcode', size: 'sm',
                body: '<div class="ums-u-center"><img alt="QR" style="max-width:100%" src="' + esc(src) + '"></div>'
            });
        }

        /* Tạo QR thanh toán — cổng thông tin (btnAddnew_KhoanNoChung_TaoMaQRThanhToan) */
        function taoQR() {
            if (!c.doiTuong) return;
            var host = (ums.session && ums.session.host) || '';
            // gốc 5/10: có địa chỉ cổng sinh viên (Init_API().TSV) thì mở trang thanh toán ở đó
            try { var api = typeof Init_API === 'function' ? Init_API() : null; if (api && api.TSV) host = api.TSV; } catch (e) {}
            var url = host + '/congthongtin/pages/thanhtoan.aspx?strMa=' + encodeURIComponent(M.e(c.doiTuong.MASO));
            ui.dialog({
                title: 'Tạo QR thanh toán', icon: 'fa-qrcode', size: 'xl',
                body: '<iframe src="' + esc(url) + '" style="width:100%;height:75vh;border:0"></iframe>'
            });
        }

        /* =================================================================
           7. KHỞI ĐỘNG
           ================================================================= */
        if (cfg.baoCao && ums.report && ums.report.mount) {
            ums.report.mount(el.bc, {
                collect: function (add) {
                    var f = svFilter();
                    add('strChuongTrinh_Id', f.ct);
                    add('strKhoaDaoTao_Id', f.khoa);
                    add('strHeDaoTao_Id', f.he);
                    add('strLopHoc_Id', f.lop);
                    add('strTuKhoa', f.q);
                    add('strTrangThaiNguoiHoc_Id', f.tt);
                    add('strQLSV_NguoiHoc_Id', c.hsId);
                    add('strNguoiThucHien_Id', (ums.session && ums.session.userId) || '');
                    add('strChucNang_Id', (ums.state && ums.state.chucNangId) || '');
                }
            });
        }

        Promise.all([
            loadTrangThai(),
            loadHe().then(loadKhoa).catch(refErr),
            ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { c.thoiGian = r; }).catch(refErr),
            call({ action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0',
                   strTuKhoa: '', pageIndex: 1, pageSize: 10000, iTinhTrang: -1, strNhomCacKhoanThu_Id: '',
                   strNguoiTao_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: '' })
                .then(function (r) { c.khoanThu = r.data || []; }).catch(function (err) { ums.api.handle(err, 'danh sách khoản thu'); }),
            call({ action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strMaBangDanhMuc: 'TAICHINH.NUTHDDT' })
                .then(function (r) { c.nutHDDT = r.data || []; }).catch(function () { c.nutHDDT = []; }),
            cfg.nguoiThuNTT
                ? dmRows('NTT').then(function (d) { if (d.length && d[0].TEN) c.ntt = d[0].TEN; }).catch(function () { /* */ })
                : Promise.resolve()
        ]).then(function () {
            if (el.pane_truoc.getAttribute('data-built')) c.fillTruocChon();
            else drawBang('truoc');
        });

        loadSV(1).then(function () { el.q.focus(); });
        return c;
    };
})();
