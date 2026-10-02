/* =========================================================================
   ums.hoadon — phần dùng chung của module Hoá đơn (ApisTaiChinh/Modules/hoadon)
   ---------------------------------------------------------------------------
   Nạp trước tệp chính của từng màn.

   Gồm:
     · Số tiền — đúng cách bản gốc đọc/ghi ô tiền:
         H.fmt(v)   = ums.pat.money (tầng chung) — nhóm 3 số bằng DẤU PHẨY
         H.num(s)   = getSoTien của xuathoadon.js: bỏ khoảng trắng + dấu phẩy rồi parseFloat
         H.sum(list)= edu.system.countFloat (Core/systemroot.js:8219): cộng, làm tròn xuống 2 số lẻ
         H.docSo(n) = ums.ui.docSo — đọc số thành chữ ở tầng chung
       Ô nhập tiền PHẢI giữ định dạng dấu phẩy (H.fmt) vì H.num chỉ bỏ dấu phẩy —
       dùng ums.ui.money (dấu chấm) cho ô nhập là sai số tiền gửi lên.
     · Địa chỉ dịch vụ hoá đơn điện tử:
         H.hddtFile(path) — bản gốc: objApi["HDDT"] bỏ 3 ký tự cuối ("api"),
         thiếu http thì ghép strhost. Ở đây: ums.session.api.HDDT / ums.session.host.
     · Danh mục dùng lại ở nhiều màn (lời gọi chép nguyên văn bản gốc):
         CM_DanhMucDuLieu/LayDanhSach  (QLSV.TRANGTHAI, TAICHINH.NUTHDDT)  GET v1.0
         CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM — kiểu
           edu.system.getList_DanhMucDulieu: KHÔNG có khoá dTrangThai (gửi kèm
           rỗng là máy chủ trả 400), khác ums.api.dm (gửi 1) → hàm riêng H.dmAll
         TC_KhoanThu/LayDanhSach       GET v1.0 pageSize 10000
         TC_NguoiDungDaThuTien/LayDanhSach GET v1.0
     · Xem chứng từ — thay edu.extend.getData_Phieu (Core/systemextend.js:2815):
         HOADON  → TC_HoaDon/LayTTHoaDonThu_Rut   (strHoaDonThu_Rut_Id)
         BIENLAI → TC_PhieuThu/LayTTPhieuThu_Rut  (strPhieuThu_Rut_Id)
         Hoá đơn có DUONGDANFILEHOADON → nhúng tệp của dịch vụ HĐĐT + mở tab mới.
         LAHOADONDIENTU = 1 → HDDT_HoaDon/GetFiles rồi
           TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT (lưu đường dẫn tệp), y như bản gốc.
         Hoá đơn tự in → BẢN XEM CHUNG dựng từ đúng các cột bản gốc đọc
           (MAUSO, KYHIEU, SOPHIEUTHU, NGAYIN_*, NOIDUNG, SOTIENDATHU, HODEM, TEN…).
           KHÔNG phải phôi in riêng của từng trường (Upload/Files/PrintTemplate/
           <MAUIN_MASO>.html + 1.300 dòng genKhoanThu_* trong systemextend.js) —
           phần đó cần tầng chung, xem báo cáo.
     · H.huy(id)      TC_HoaDon/HuyHoaDon            POST strHoaDon_Id
       H.daIn(id)     TC_HoaDon/Them_TinhTrangInHoaDon POST strSoHoaDon_Id, strId ''
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var H = ums.hoadon = ums.hoadon || {};

    /* ---------- Số tiền ------------------------------------------------ */
    function hasVal(v) { return !(v === null || v === undefined || v === ''); }

    /* = ums.pat.money ở tầng chung (nhóm nghìn bằng dấu phẩy) */
    H.fmt = function (v) { return ums.pat.money(hasVal(v) ? v : 0); };

    H.num = function (s) {
        return parseFloat(String(s === null || s === undefined ? '' : s).replace(/ /g, '').replace(/,/g, ''));
    };

    var FLOAT = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;   // edu.util.floatValid
    H.floatValid = function (v) { return FLOAT.test(v); };

    /** countFloat: cộng các chuỗi tiền, bỏ ô không hợp lệ, làm tròn xuống 2 số lẻ */
    H.sum = function (list) {
        var s = 0;
        list.forEach(function (v) {
            var t = String(v === null || v === undefined ? '' : v).replace(/ /g, '').replace(/,/g, '');
            if (t === '') t = '0';
            var d = parseFloat(t);
            if (FLOAT.test(d)) s += d;
        });
        return Math.floor(s * 100) / 100;
    };

    /** convertFloat: số → chuỗi có dấu phẩy, giữ phần lẻ */
    H.fmtSum = function (n) {
        if (!n) return '0';
        var s = String(n), ext = '';
        if (s.indexOf('.') >= 0) { ext = s.substring(s.indexOf('.')); s = s.substring(0, s.indexOf('.')); }
        return H.fmt(s) + ext;
    };

    /* Đọc số thành chữ: tầng chung ums.ui.docSo (thư viện n2vi nạp sẵn ở
       assets/vendor/n2vi) — cùng phép biến đổi bản gốc dùng */
    H.docSo = function (n) { return ui.docSo(n); };

    /** edu.extend.removeNoiDungDai (Core/systemextend.js:6243) */
    H.catNoiDung = function (nd, soTien) {
        if (!hasVal(nd)) return '';
        nd = String(nd);
        if (nd.indexOf('VIETINBANK') >= 0 && nd.indexOf('DTC') >= 0) {
            nd = nd.replace('VIETIN', '');
            nd = nd.substring(0, nd.indexOf('$'));
            if (nd.indexOf(soTien) >= 0) nd = nd.replace(soTien, '');
            return nd + '...';
        }
        return nd;
    };

    /* ---------- Dịch vụ hoá đơn điện tử --------------------------------- */
    H.hddtBase = function () { return (ums.session && ums.session.api && ums.session.api.HDDT) || ''; };

    /** objApi["HDDT"] bỏ "api" cuối, thiếu http thì ghép host — rồi nối đường dẫn tệp */
    H.hddtFile = function (path) {
        var link = H.hddtBase();
        link = link.substring(0, link.length - 3);
        if (link.indexOf('http') === -1) link = ((ums.session && ums.session.host) || '') + link;
        return link + (path || '');
    };

    /** Liên kết bản nháp trả về từ HDDT_HoaDon/ThemMoi_Nhap */
    H.hddtNhapLink = function (data) {
        var link = String(data || '');
        if (link.indexOf('http') === -1) {
            link = H.hddtBase();
            link = link.substring(0, link.length - 3) + data;
            if (link.indexOf('http') === -1) link = ((ums.session && ums.session.host) || '') + link;
        }
        return link;
    };

    H.openTab = function (url) {
        var w = window.open(url, '_blank');
        if (w) w.focus();
        else ui.toast('Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!', 'warn');
        return w;
    };

    /* ---------- Danh mục -------------------------------------------------- */
    function rows(r) {
        var d = r && r.data;
        return Array.isArray(d) ? d : (d && d.rs) || [];
    }
    H.rows = rows;

    H.dmCu = function (ma) {            // CM_DanhMucDuLieu/LayDanhSach
        return ums.api.call({
            action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true,
            versionAPI: 'v1.0', strMaBangDanhMuc: ma
        }).then(rows);
    };

    H.dmAll = function (ma) {           // edu.system.getList_DanhMucDulieu({strMaBangDanhMuc})
        return ums.api.call({
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM', method: 'GET', silent: true,
            strMaBangDanhMuc: ma, strTieuChiSapXep: ''
        }).then(rows);
    };

    H.trangThaiSV = function () { return H.dmCu('QLSV.TRANGTHAI'); };
    H.nutHDDT = function () { return H.dmCu('TAICHINH.NUTHDDT'); };

    H.khoanThu = function () {
        return ums.api.call({
            action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0',
            strTuKhoa: '', pageIndex: 1, pageSize: 10000,
            strNhomCacKhoanThu_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
        }).then(rows);
    };

    H.nguoiThu = function () {
        return ums.api.call({
            action: 'TC_NguoiDungDaThuTien/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0'
        }).then(rows);
    };

    /* ---------- Ô chọn / ô đánh dấu -------------------------------------- */
    H.fillSelect = function (el, list, id, name, head) {
        if (!el) return;
        var multi = el.multiple;
        var h = (head && !multi) ? '<option value="">' + esc(head) + '</option>' : '';
        (list || []).forEach(function (r) {
            h += '<option value="' + esc(r[id]) + '">' + esc(typeof name === 'function' ? name(r) : r[name]) + '</option>';
        });
        el.innerHTML = h;
        if (window.jQuery) jQuery(el).trigger('change.select2');
    };

    /** Giá trị ô chọn: nhiều lựa chọn thì nối bằng dấu phẩy (edu.util.getValCombo) */
    H.val = function (el) {
        if (!el) return '';
        if (el.multiple) {
            return Array.prototype.filter.call(el.options, function (o) { return o.selected && o.value !== ''; })
                .map(function (o) { return o.value; }).join(',');
        }
        return (el.value || '').trim();
    };

    /** Nhóm ô đánh dấu có ô "Tất cả" (thay genList_TrangThaiSV / genList_DMLKT).
        Bản dựng nằm ở tầng chung — ums.pat.checks; ở đây chỉ giữ tên gọi cũ
        cho ba màn đang dùng. Trả về tay cầm { ids(), picked(), val(), … }
        chứ KHÔNG trả chuỗi HTML như trước, nên nơi gọi không tự gán innerHTML. */
    H.checks = function (host, list, opts) {
        opts = opts || {};
        return ums.pat.checks(host, list, {
            all: opts.all === false ? false : "Tất cả",
            checked: !!opts.checked,
            cols: opts.cols || 3,
            empty: opts.empty || "Không có dữ liệu",
            onChange: opts.onChange
        });
    };

    /* ---------- Huỷ / đánh dấu đã in ------------------------------------- */
    H.huy = function (id) {
        return ums.api.call({ action: 'TC_HoaDon/HuyHoaDon', versionAPI: 'v1.0', strHoaDon_Id: id, strNguoiThucHien_Id: '' });
    };

    H.daIn = function (id) {
        return ums.api.call({
            action: 'TC_HoaDon/Them_TinhTrangInHoaDon', versionAPI: 'v1.0', silent: true,
            strId: '', strNguoiThucHien_Id: '', strSoHoaDon_Id: id
        }).catch(function () { /* bản gốc bỏ qua lỗi */ });
    };

    /* ---------- Lấy tệp hoá đơn điện tử ---------------------------------- */
    /** HDDT_HoaDon/GetFiles + TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT (systemextend.js:6068) */
    H.getFiles = function (a, luuTheoId) {        // luuTheoId: bản tra cứu lưu theo ID, bản xem theo CHUNGTU_ID
        return ums.api.call({
            action: 'HDDT_HoaDon/GetFiles', method: 'GET', silent: true,
            transectionId: a.TRACSECTION_ID,
            strDuongDanFile: a.DUONGDANFILEHOADON,
            strDuongDanFileTongHop: a.DUONGDANFILETONGHOP,
            strPhuongThuc_MA: a.PHATHANH_RESERVATIONCODE,
            strSoHoaDon: a.SOHOADON
        }).then(function (r) {
            var d = r.data || [];
            H.luuDuongDan(luuTheoId ? a.ID : a.CHUNGTU_ID, d[0], d[1]);
            return d;
        });
    };

    H.luuDuongDan = function (id, file, tongHop) {
        return ums.api.call({
            action: 'TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT', silent: true,
            strId: id, strChucNang_Id: '', strDuongDanFileHoaDon: file,
            strDuongDanFileTongHop: tongHop, strNguoiThucHien_Id: ''
        }).catch(function () { /* bản gốc bỏ qua lỗi */ });
    };

    /* ---------- Xem chứng từ --------------------------------------------- */
    /* Phiếu xem trung tính: kiểu ở hoadon/css/_phieu.css — trang nạp bằng <link>,
       cửa sổ in nạp qua cssHref. */


    /**
     * Xem một chứng từ trong phần tử `host`.
     *   loai: 'HOADON' | 'BIENLAI'
     * Trả Promise<{ rs, dt, hddt }> (hddt = true khi đang nhúng tệp hoá đơn điện tử).
     */
    /* =====================================================================
       Xem / in chứng từ — MỘT máy dựng phôi cho cả hệ: ums.phieu.viewer
       ---------------------------------------------------------------------
       Trước đây module này tự gọi LayTTHoaDonThu_Rut / LayTTPhieuThu_Rut, tự
       xử lý hoá đơn điện tử rồi vẽ một tờ trung tính riêng (H.renderPhieu,
       .hd-phieu) — bản thứ ba trong dự án làm đúng việc đó. Nay dùng tầng
       chung: có phôi in của trường thì đổ vào phôi thật, không nạp được thì
       tầng chung tự vẽ bản rút gọn. Hoá đơn điện tử (mở tab, HDDT_HoaDon/
       GetFiles, lưu lại đường dẫn) cũng do tầng chung lo, y như trước.

       H.viewer(host, opts)  lấy (hoặc tạo) khung xem gắn với `host`
       H.xem(host, id, loai) xem MỘT chứng từ  → Promise<dòng rs[0] | null>
       H.print(host, title)  in đúng khung xem của host
       ===================================================================== */
    H.viewer = function (host, opts) {
        if (!host.__phieu) host.__phieu = ums.phieu.viewer(host, opts || {});
        return host.__phieu;
    };

    H.xem = function (host, id, loai) {
        return H.viewer(host).show({ id: id, loai: loai === 'BIENLAI' ? 'BIENLAI' : 'HOADON' });
    };

    /* In: vùng nào có khung xem của tầng chung thì in đúng khung đó (phôi
       nằm trong <iframe> nên in cả vùng chứa sẽ ra trang trắng). */
    H.print = function (el, title) {
        if (el && el.__phieu) return el.__phieu.print(title || 'In chứng từ');
        return ui.print(el, { title: title || 'In chứng từ' });
    };

    /* Kiểu của module: hoadon/css/_chung.css (nạp bằng <link> trong html).
       Phôi in không còn kiểu riêng ở đây — nó nằm trong <iframe> của
       ums.phieu.viewer, mang theo kiểu của chính phôi. */

})();
