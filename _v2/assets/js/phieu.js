/* =========================================================================
   Xem / in chứng từ đã lưu — dùng chung cho thutienkhac, pos_thutien
   (phieuthu) và ruttien (phieurut)
   ---------------------------------------------------------------------------
   Bản gốc: edu.extend.getData_Phieu (Core/systemextend.js:2815) và các hàm
   nó gọi: getData_PhieuThu / getData_HoaDon / genData_PhieuThu /
   genData_HoaDon / genChonLien / remove_PhoiIn.

   Lời gọi (chép nguyên văn):
       TC_PhieuThu/LayTTPhieuThu_Rut      GET  strPhieuThu_Rut_Id    (PHIEUTHU, BIENLAI, BIENLAIRUT)
       TC_HoaDon/LayTTHoaDonThu_Rut       GET  strHoaDonThu_Rut_Id   (HOADON)
       HDDT_HoaDon/GetFiles               GET  (hoá đơn điện tử — lấy đường dẫn tệp)
       TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT  POST (lưu lại đường dẫn tệp vừa lấy)

   Mẫu in: tệp HTML của từng trường ở <rootPath>/Upload/Files/PrintTemplate/
   <MAUIN_MASO>.html (MAUIN_MASO có dấu phẩy = nhiều mẫu, lấy mẫu đầu, cho
   chuyển mẫu). Mẫu mặc định theo loại:
       PHIEUTHU   DHTL_PHIEUTHU_NHAPHOC_2018
       BIENLAI    DHGTVT_PHIEUTHU_2018
       BIENLAIRUT DHCNTTTN_BIENLAIRUT_2018
       HOADON     HOADONDHLUAT

   Đổ dữ liệu vào mẫu — bản gốc có 21 hàm genKhoanThu_<MẪU> cho phiếu và 9
   hàm cho hoá đơn. Đã đối chiếu từng hàm (diff): 9 hàm phiếu giống hệt nhau
   trừ vài dòng, gộp thành fillPhieu() với tuỳ chọn ở bảng FILL_PHIEU. Hoá
   đơn chỉ chuyển HOADONDHLUAT (mẫu mặc định). Mẫu chưa chuyển thì làm đúng
   như nhánh `default:` của bản gốc: nạp lại MẪU MẶC ĐỊNH — kèm thông báo.

   Khác bản gốc, có chủ đích:
     · Mẫu in có <style> toàn cục (body, .bold, .text-center…). Bản gốc nạp
       thẳng vào trang nên kiểu của mẫu đè lên cả giao diện. Ở đây mẫu được
       dựng tách rời rồi hiện trong <iframe>, không rò kiểu ra ngoài.
     · Giá trị đổ vào mẫu đi qua textContent (bản gốc .html() — chèn HTML
       thô từ máy chủ).
     · Mã QR của HOADONDHLUAT: vẽ bằng qrcode.min.js (nếu trang có nạp)
       rồi đổi canvas thành ảnh để in được.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums;
    var ui = ums.ui;
    var esc = ui.esc;
    var P = ums.phieu = ums.phieu || {};

    var MAC_DINH = {
        PHIEUTHU: 'DHTL_PHIEUTHU_NHAPHOC_2018',
        BIENLAI: 'DHGTVT_PHIEUTHU_2018',
        BIENLAIRUT: 'DHCNTTTN_BIENLAIRUT_2018',
        HOADON: 'HOADONDHLUAT'
    };

    /* Mẫu phiếu đã chuyển → tuỳ chọn khác biệt so với genKhoanThu_DHCNTTTN_PHIEURUT_2018
         nhanTien   có hai dòng NOIDUNGNHANTIEN / HOVATENNHANTIEN
         quyenSo    cột đổ vào "Quyển số" (false = không đổ)
         hinhThuc   có dòng txtHinhThucThanhToan_BenB = HINHTHUCTHU_TEN          */
    var FILL_PHIEU = {
        DHCNTTTN_BIENLAIRUT_2018: { nhanTien: true },
        DHNONGLAM_TN_BIENLAI: { nhanTien: true },
        DHCNTTTN_BIENLAITHU_2018: {},
        DHGTVT_PHIEUTHU_2018: {},
        DHGTVT_PHIEURUT_2018: {},
        KTHUE_BIENLAI: {},
        DHTL_PHIEUTHU_NHAPHOC_2018: { quyenSo: 'MAUSO' },
        GIALAI_PHIEUTHU: { hinhThuc: true },
        LAMNGHIEPXUANMAI_BIENLAITHU: { hinhThuc: true, quyenSo: false }
    };
    var FILL_HOADON = { HOADONDHLUAT: true };

    /* ---------- Tiện ích số tiền, giống edu.util ------------------------- */
    function isNum(v) { return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(v); }
    function has(v) { return v !== null && v !== undefined && v !== ''; }
    function e(v) { return has(v) ? v : ''; }
    /* edu.util.formatCurrency — ums.pat.money ở tầng chung (nhóm nghìn bằng
       dấu phẩy trên phần nguyên); rỗng → "0" như bản gốc */
    function fmt(v) { return ums.pat.money(has(v) ? v : 0); }
    P.fmt = fmt;

    /* Tổng SOTIENDATHU như bản gốc: chỉ cộng giá trị kiểu số hợp lệ */
    function tong(rs) {
        var t = 0;
        rs.forEach(function (x) { if (isNum(x.SOTIENDATHU)) t += Number(x.SOTIENDATHU); });
        return t;
    }

    /* Đọc số thành chữ — tầng chung ums.ui.docSo (thư viện n2vi nạp sẵn ở
       assets/vendor/n2vi): to_vietnamese(n) + "." rồi viết hoa chữ đầu */
    function bangChu(n) { return ums.ui.docSo(n); }
    P.bangChu = bangChu;

    function rootUrl() {
        var r = (ums.session && ums.session.rootPath) || '';
        if (!r) r = location.origin;
        return r.replace(/\/+$/, '') + '/';
    }

    /* Link HĐĐT như bản gốc: objApi.HDDT bỏ 3 ký tự cuối ("api") */
    function hddtBase() {
        var S = ums.session || {};
        var l = (S.api && S.api.HDDT) || '';
        l = l.substring(0, l.length - 3);
        if (l.indexOf('http') === -1) l = (S.host || '') + l;
        return l;
    }
    P.hddtBase = hddtBase;

    /* ---------- Nạp mẫu ----------------------------------------------------- */
    var tplCache = {};
    function loadTpl(name) {
        if (!name) return Promise.resolve(null);
        if (tplCache[name]) return tplCache[name];
        var url = rootUrl() + 'Upload/Files/PrintTemplate/' + encodeURIComponent(name) + '.html?v=1.0.1.28';
        var p = fetch(url, { cache: 'no-store' })
            .then(function (r) { return r.ok ? r.text() : null; })
            .then(function (txt) {
                if (!txt) return null;
                var doc = new DOMParser().parseFromString(txt, 'text/html');
                var css = Array.prototype.map.call(doc.querySelectorAll('style'), function (s) { return s.textContent; }).join('\n');
                Array.prototype.forEach.call(doc.body.querySelectorAll('script,style'), function (s) { s.parentNode.removeChild(s); });
                var body = doc.body.innerHTML.trim();
                return body ? { name: name, css: css, body: body } : null;
            })
            .catch(function () { return null; });
        tplCache[name] = p.then(function (t) { if (!t) delete tplCache[name]; return t; });
        return tplCache[name];
    }

    /* ---------- Đổ dữ liệu -------------------------------------------------- */
    function setAll(box, cls, val) {
        Array.prototype.forEach.call(box.getElementsByClassName(cls), function (el) { el.textContent = val; });
    }
    function setIf(box, cls, val) { if (has(val)) setAll(box, cls, val); }

    /* Bảng các khoản chia 2/3/4 cột theo số khoản (loaddata của bản gốc) */
    function bangKhoan(rs) {
        var cols = rs.length <= 4 ? 2 : (rs.length <= 9 ? 3 : 4);
        var n = Math.ceil(rs.length / cols);
        var h = '<table class="pr-table pr-table-unbordered"><tbody>';
        for (var i = 0; i < n; i++) {
            h += '<tr>';
            for (var c = 0; c < cols; c++) {
                var x = rs[i + n * c];
                if (!x) continue;
                h += '<td class="no-padding" style="margin-top: 2px"><span>- ' + esc(x.NOIDUNG) + ' : ' +
                    fmt(x.SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
            }
            h += '</tr>';
        }
        return h + '</tbody></table>';
    }

    /* genKhoanThu_DHCNTTTN_PHIEURUT_2018 và các biến thể (Core/systemextend.js:3029) */
    function fillPhieu(box, rs, dt, id, opt) {
        var d = rs[0], p = dt[0];
        var t = tong(rs);
        setAll(box, 'txtTongTienBangChu_' + id, bangChu(t));
        setAll(box, 'txtTongTienChungTu_' + id, fmt(t).replace(/,/g, '.'));
        setIf(box, 'txtCoCauToChuc_BenA_' + id, d.DAOTAO_COCAUTOCHUC_TEN);
        setIf(box, 'txtQHNS_BenA_' + id, d.MA_QHNS);
        setIf(box, 'txtLoaiChungTu_' + id, d.TENPHIEU);
        setIf(box, 'txtMauSo_BenA_' + id, d.MAUSO);
        setIf(box, 'txtKyHieuChungTu_' + id, d.KYHIEU);
        setIf(box, 'txtMaSoThue_BenA_' + id, d.MASOTHUE);
        setIf(box, 'txtSoDienThoai_BenA_' + id, d.SODIENTHOAI);
        setIf(box, 'txtDiaChi_BenA_' + id, d.DIACHI);
        setIf(box, 'txtNguoiNhanTien_BenB_' + id, d.NGUOINHANTIEN);
        setIf(box, 'txtNguoiTraTien_BenA_' + id, d.NGUOITRATIEN);
        if (opt.nhanTien) setIf(box, 'lblNoiDungNhanTien_BenA_' + id, d.NOIDUNGNHANTIEN);
        setIf(box, 'lblSoTienThu_BenA_' + id, d.SOTIENNHANTIEN);
        if (opt.nhanTien) setIf(box, 'lblHoTenNhanTien_BenB_' + id, d.HOVATENNHANTIEN);
        if (opt.quyenSo !== false) setAll(box, 'iQuyenChungTuSo_' + id, e(d[opt.quyenSo || 'QUYENSO']));
        setAll(box, 'iChungTuSo_' + id, e(d.SOPHIEUTHU));
        setAll(box, 'iNgayXuatChungTu_' + id, e(d.NGAYIN_NGAY));
        setAll(box, 'iThangXuatChungTu_' + id, e(d.NGAYIN_THANG));
        setAll(box, 'iNamXuatChungTu_' + id, e(d.NGAYIN_NAM));
        setAll(box, 'txtHoTen_BenB_' + id, e(p.HODEM) + ' ' + e(p.TEN));
        setAll(box, 'txtMa_BenB_' + id, e(p.MASO));
        setAll(box, 'txtDiaChi_BenB_' + id, e(p.DAOTAO_LOPQUANLY_N1_TEN));
        setAll(box, 'txtNgaySinh_BenB_' + id, e(p.NGAYSINH));
        setAll(box, 'txtLop_BenB_' + id, e(p.DAOTAO_LOPQUANLY_N1_TEN));
        setAll(box, 'txtNganh_BenB_' + id, e(p.NGANHHOC_N1_TEN));
        setAll(box, 'txtKhoa_BenB_' + id, e(p.KHOAHOC_N1_TEN));
        if (opt.hinhThuc) setAll(box, 'txtHinhThucThanhToan_BenB_' + id, e(d.HINHTHUCTHU_TEN));
        setAll(box, 'txtNguoiThu_BenA_' + id, e(d.NGUOITAO_TENDAYDU));
        Array.prototype.forEach.call(box.getElementsByClassName('dataNoiDungThu_' + id), function (el) {
            el.innerHTML = bangKhoan(rs);
        });
    }

    /* genKhoanThu_HOADONDHLUAT (Core/systemextend.js:5296) */
    function fillHoaDonLuat(box, rs, dt, id) {
        var d = rs[0], p = dt[0];
        var t = tong(rs);
        setAll(box, 'txtTongTienBangChu_' + id, bangChu(t));
        setAll(box, 'txtTongTienChungTu_' + id, fmt(t));
        setIf(box, 'txtCoCauToChuc_BenA_' + id, d.DAOTAO_COCAUTOCHUC_TEN);
        setIf(box, 'txtQHNS_BenA_' + id, d.MA_QHNS);
        setIf(box, 'txtLoaiChungTu_' + id, d.TENPHIEU);
        setIf(box, 'txtMauSo_BenA_' + id, d.MAUSO);
        setIf(box, 'txtKyHieuChungTu_' + id, d.KYHIEU);
        setIf(box, 'txtMaSoThue_BenA_' + id, d.MASOTHUE);
        setIf(box, 'txtSoDienThoai_BenA_' + id, d.SODIENTHOAI);
        setIf(box, 'txtDiaChi_BenA_' + id, d.DIACHI);
        setAll(box, 'iChungTuSo_' + id, e(d.SOPHIEUTHU));
        setAll(box, 'iNgayXuatChungTu_' + id, e(d.NGAYIN_NGAY));
        setAll(box, 'iThangXuatChungTu_' + id, e(d.NGAYIN_THANG));
        setAll(box, 'iNamXuatChungTu_' + id, e(d.NGAYIN_NAM));
        setAll(box, 'txtHoTen_BenB_' + id, e(p.HODEM) + ' ' + e(p.TEN));
        setAll(box, 'txtTenDonVi_BenB_' + id, '');          // bản gốc đọc cột AAAAA — không tồn tại
        setAll(box, 'txtMa_BenB_' + id, e(p.MASO));
        setAll(box, 'txtLop_BenB_' + id, e(p.DAOTAO_LOPQUANLY_N1_TEN));
        setAll(box, 'txtNganh_BenB_' + id, e(p.NGANHHOC_N1_TEN));
        setAll(box, 'txtBac_BenB_' + id, e(p.BACDAOTAO_N1_TEN));
        setAll(box, 'txtKhoa_BenB_' + id, e(p.KHOAHOC_N1_TEN));
        setAll(box, 'txtDiaChi_BenB_' + id, e(p.NOIOHIENNAY));
        setAll(box, 'txtSoTaiKhoan_BenB_' + id, '');        // AAAAA
        setAll(box, 'txtHinhThucThanhToan_BenB_' + id, e(d.HINHTHUCTHU_TEN));
        setAll(box, 'txtMaSoThue_BenB_' + id, e(p.MASOTHUECANHAN));
        setAll(box, 'txtNguoiThu_BenA_' + id, e(d.NHOTHEM));

        if (has(p.QRCODE) && typeof global.QRCode === 'function') {
            ['A', 'B', 'C'].forEach(function (k) {
                var el = box.querySelector('[id="qrCode_' + k + '_' + id + '"]');
                if (!el) return;
                try {
                    var q = new global.QRCode(el, { width: 80, height: 80 });
                    q.makeCode(p.QRCODE);
                    // canvas không đi theo khi chép HTML sang iframe / cửa sổ in
                    Array.prototype.forEach.call(el.querySelectorAll('canvas'), function (cv) {
                        var img = document.createElement('img');
                        img.src = cv.toDataURL('image/png');
                        img.width = 80; img.height = 80;
                        cv.parentNode.replaceChild(img, cv);
                    });
                    Array.prototype.forEach.call(el.querySelectorAll('img'), function (im, i) { if (i > 0) im.parentNode.removeChild(im); });
                } catch (err) { /* thiếu QR không chặn việc in */ }
            });
        }

        function body(donGia) {
            return rs.map(function (x, i) {
                var nd = x.NOIDUNG_INHOADON;
                if (!has(nd)) {
                    nd = e(x.TAICHINH_CACKHOANTHU_TEN) + ' Học kỳ ' + e(x.HOCKY) + ' Năm kỳ ' + e(x.NAMHOC) +
                        (has(x.DOTHOC) ? ' đợt ' + x.DOTHOC : '');
                }
                return '<tr><td style="text-align:center">' + (i + 1) + '</td><td style="text-align:left">' + esc(nd) + '</td>' +
                    '<td style="text-align:center"></td><td style="text-align:center">' + esc(e(x.SOLUONG)) + '</td>' +
                    '<td style="text-align:right">' + (donGia ? fmt(x.DONGIA) : '') + '</td>' +
                    '<td style="text-align:right">' + fmt(x.SOTIENDATHU) + '</td></tr>';
            }).join('');
        }
        [['A', false], ['B', true]].forEach(function (k) {
            var tb = box.querySelector('[id="dataNoiDungThu_' + k[0] + '_' + id + '"]');
            if (!tb) return;
            var tbody = tb.querySelector('tbody');
            if (!tbody) { tbody = document.createElement('tbody'); tb.appendChild(tbody); }
            tbody.innerHTML = body(k[1]);
        });
    }

    /* Ảnh trong mẫu ghi đường dẫn tương đối tính từ gốc ứng dụng */
    function absImages(box) {
        var base = rootUrl();
        Array.prototype.forEach.call(box.querySelectorAll('img[src]'), function (im) {
            var s = im.getAttribute('src');
            if (/^(data:|https?:|\/\/)/i.test(s)) return;
            try { im.setAttribute('src', new URL(s, base).href); } catch (err) { /* để nguyên */ }
        });
    }

    /* =====================================================================
       BẢN RÚT GỌN — vẽ khi KHÔNG nạp được phôi in của trường
       ---------------------------------------------------------------------
       Phôi in thật nằm ngoài repo (<rootPath>/Upload/Files/PrintTemplate/),
       nên ở máy lập trình và ở chế độ dựng thử không bao giờ có. Trước đây
       mỗi nhóm màn tự vẽ một bản thay thế riêng — .tcp (phieuthu/tra cứu),
       .hd-phieu (hoadon), .ct-paper (chungtu) — ba kiểu khác nhau cho cùng
       một tờ chứng từ. Nay một bản, và nó đi qua đúng đường ống của phôi
       thật (cùng <iframe>, cùng nút In, cùng chọn liên) nên không cần
       nhánh xử lý riêng ở màn hình.

       Đọc đúng các cột mà phôi mặc định đọc: rs[] = NOIDUNG, SOTIENDATHU,
       SOPHIEUTHU, QUYENSO, MAUSO, KYHIEU, TENPHIEU, NGAYIN_*,
       NGUOITAO_TENDAYDU, DAOTAO_COCAUTOCHUC_TEN, MA_QHNS, MASOTHUE, DIACHI,
       SODIENTHOAI; dt[0] = HODEM, TEN, MASO, NGAYSINH,
       DAOTAO_LOPQUANLY_N1_TEN, NGANHHOC_N1_TEN, KHOAHOC_N1_TEN, MAUIN_MASO,
       TINHTRANG.
       ===================================================================== */
    var CSS_RUTGON =
        '.pg{max-width:760px;margin:0 auto;font-size:14px;color:#000;font-family:Arial,Helvetica,sans-serif}' +
        '.pg__top{display:flex;justify-content:space-between;gap:24px}' +
        '.pg__top>div{flex:1}.pg__r{text-align:center}' +
        '.pg__title{text-align:center;font-size:22px;font-weight:bold;margin:16px 0 4px}' +
        '.pg__sub{text-align:center;font-style:italic;margin-bottom:16px}' +
        '.pg table{width:100%;border-collapse:collapse}.pg td{padding:3px 4px;vertical-align:top}' +
        '.pg__k{width:190px}.pg__sum{font-weight:bold}' +
        '.pg__sign{display:flex;justify-content:space-around;margin-top:24px;text-align:center}' +
        '.pg__huy{color:#c00;border:2px solid #c00;display:inline-block;padding:2px 12px;font-weight:bold;transform:rotate(-8deg)}' +
        '.pg__note{font-size:12px;color:#888;margin-top:16px}' +
        '@media print{.pg__note{display:none}}';

    P.neutral = function (rs, dt, loai) {
        var a = rs[0] || {}, p = dt[0] || {};
        var t = tong(rs);
        function v(x) { return esc(e(x)); }
        var title = a.TENPHIEU || (loai === 'HOADON' ? 'HOÁ ĐƠN' : loai === 'BIENLAI' ? 'BIÊN LAI THU TIỀN' : 'PHIẾU THU');
        // Phôi phiếu thu mặc định ghi "Quyển số" = MAUSO, phôi biên lai ghi QUYENSO
        var quyen = loai === 'BIENLAI' ? a.QUYENSO : a.MAUSO;
        var html = '<div class="pg">' +
            '<div class="pg__top"><div><b>' + v(a.DAOTAO_COCAUTOCHUC_TEN) + '</b>' +
            (has(a.MA_QHNS) ? '<div>Mã QHNS: ' + v(a.MA_QHNS) + '</div>' : '') +
            (has(a.MASOTHUE) ? '<div>Mã số thuế: ' + v(a.MASOTHUE) + '</div>' : '') +
            (has(a.DIACHI) ? '<div>Địa chỉ: ' + v(a.DIACHI) + '</div>' : '') +
            (has(a.SODIENTHOAI) ? '<div>Điện thoại: ' + v(a.SODIENTHOAI) + '</div>' : '') + '</div>' +
            '<div class="pg__r">' + (has(a.MAUSO) ? '<div>Mẫu số: ' + v(a.MAUSO) + '</div>' : '') +
            (has(a.KYHIEU) ? '<div>Ký hiệu: ' + v(a.KYHIEU) + '</div>' : '') +
            '<div>Quyển số: ' + v(quyen) + '</div><div>Số: <b>' + v(a.SOPHIEUTHU || a.SOHOADON || a.SOCHUNGTU) + '</b></div>' +
            (String(p.TINHTRANG) === '-1' ? '<div style="margin-top:6px"><span class="pg__huy">Đã Hủy</span></div>' : '') +
            '</div></div>' +
            '<div class="pg__title">' + v(title) + '</div>' +
            '<div class="pg__sub">Ngày ' + v(a.NGAYIN_NGAY) + ' tháng ' + v(a.NGAYIN_THANG) + ' năm ' + v(a.NGAYIN_NAM) + '</div>' +
            '<table><tbody>' +
            '<tr><td class="pg__k">Họ và tên người nộp:</td><td><b>' + v(e(p.HODEM) + ' ' + e(p.TEN)) + '</b></td></tr>' +
            '<tr><td class="pg__k">Mã số:</td><td>' + v(p.MASO) + (has(p.NGAYSINH) ? ' — Ngày sinh: ' + v(p.NGAYSINH) : '') + '</td></tr>' +
            '<tr><td class="pg__k">Lớp:</td><td>' + v(p.DAOTAO_LOPQUANLY_N1_TEN) + '</td></tr>' +
            ((has(p.NGANHHOC_N1_TEN) || has(p.KHOAHOC_N1_TEN)) ? '<tr><td class="pg__k">Ngành / Khoá:</td><td>' +
                v(p.NGANHHOC_N1_TEN) + (has(p.KHOAHOC_N1_TEN) ? ' / ' + v(p.KHOAHOC_N1_TEN) : '') + '</td></tr>' : '') +
            '<tr><td class="pg__k">Nội dung thu:</td><td>' + rs.map(function (x) {
                return '- ' + v(has(x.NOIDUNG) ? x.NOIDUNG : x.TAICHINH_CACKHOANTHU_TEN) + ': ' + fmt(x.SOTIENDATHU) + 'đ';
            }).join('<br>') + '</td></tr>' +
            '<tr class="pg__sum"><td class="pg__k">Tổng số tiền:</td><td>' + fmt(t) + 'đ</td></tr>' +
            '<tr><td class="pg__k">Bằng chữ:</td><td><i>' + v(bangChu(t)) + '</i></td></tr>' +
            '</tbody></table>' +
            '<div class="pg__sign"><div><b>Người nộp tiền</b><br><i>(Ký, họ tên)</i></div>' +
            '<div><b>Người thu tiền</b><br><i>(Ký, họ tên)</i><br><br><br>' + v(a.NGUOITAO_TENDAYDU) + '</div></div>' +
            '<div class="pg__note">' + (has(p.MAUIN_MASO) ? 'Phôi in của trường: ' + v(p.MAUIN_MASO) + ' — ' : '') +
            'không nạp được phôi, đang hiện bản rút gọn.</div>' +
            '</div>';
        return { key: 'rutgon', css: CSS_RUTGON, html: html, lien: false };
    };

    /* =====================================================================
       Khung xem chứng từ
         var v = ums.phieu.viewer(hostEl, { tools: elCôngCụ })
         v.show({ id, loai })            thay nội dung (xem 1 chứng từ)
         v.add({ id, loai })             nối thêm, ngắt trang (in theo lô)
         v.clear() · v.print() · v.count()
       show/add trả Promise<dòng rs[0] | null> — tương đương callback bản gốc
       ===================================================================== */
    P.viewer = function (host, opts) {
        opts = opts || {};
        var parts = [];          // { key, css, html, lien }
        var cssAll = {};
        var frame = null;
        var tools = opts.tools || null;
        var lienSel = 'all';

        host.innerHTML = '';

        function render() {
            if (!parts.length) {
                host.innerHTML = ui.empty(opts.empty || 'Chưa có chứng từ', 'fa-file-invoice');
                frame = null;
                drawTools();
                return;
            }
            if (!frame || !host.contains(frame)) {
                host.innerHTML = '<iframe class="pk-frame" title="Chứng từ" style="width:100%;border:0;background:#fff;display:block;min-height:420px"></iframe>';
                frame = host.firstChild;
                frame.addEventListener('load', fit);
            }
            frame.srcdoc = docHtml(false);
            drawTools();
        }

        function fit() {
            try {
                var d = frame.contentDocument;
                frame.style.height = Math.max(420, d.documentElement.scrollHeight + 8) + 'px';
            } catch (err) { /* bỏ qua */ }
        }

        function bodyHtml() {
            return parts.map(function (p) { return p.html; }).join('');
        }

        function docHtml() {
            var css = Object.keys(cssAll).map(function (k) { return cssAll[k]; }).join('\n');
            return '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + css +
                '\nbody{margin:12px;background:#fff}</style></head><body>' + applyLien(bodyHtml()) + '</body></html>';
        }

        /* genChonLien: nhiều .pr-containt = nhiều liên, cho chọn 1 liên hoặc tất cả */
        function applyLien(html) {
            if (lienSel === 'all') return html;
            var box = document.createElement('div');
            box.innerHTML = html;
            var l = box.querySelectorAll('.pr-containt');
            Array.prototype.forEach.call(l, function (el, i) { if (String(i) !== lienSel) el.style.display = 'none'; });
            Array.prototype.forEach.call(box.querySelectorAll('p'), function (p) {
                if ((p.getAttribute('style') || '').replace(/\s/g, '') === 'page-break-before:always;') p.style.display = 'none';
            });
            return box.innerHTML;
        }

        function lienCount() {
            var box = document.createElement('div');
            box.innerHTML = bodyHtml();
            return box.querySelectorAll('.pr-containt').length;
        }

        function drawTools() {
            if (!tools) return;
            var n = parts.length ? lienCount() : 0;
            if (n <= 1) { tools.innerHTML = ''; tools.hidden = true; return; }
            tools.hidden = false;
            var h = '<span class="ums-u-fz13 ums-u-muted">Liên:</span>';
            for (var i = 0; i < n; i++) {
                h += '<button type="button" class="ums-chip' + (lienSel === String(i) ? ' is-active' : '') + '" data-lien="' + i + '">' + (i + 1) + '</button>';
            }
            h += '<button type="button" class="ums-chip' + (lienSel === 'all' ? ' is-active' : '') + '" data-lien="all">Tất cả</button>';
            tools.innerHTML = '<div class="ums-chips">' + h + '</div>';
        }

        if (tools) {
            tools.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-lien]');
                if (!b) return;
                lienSel = b.getAttribute('data-lien');
                render();
            });
        }

        function build(o) {
            var loai = o.loai;
            var isHD = loai === 'HOADON';
            var call = isHD
                ? { action: 'TC_HoaDon/LayTTHoaDonThu_Rut', method: 'GET', versionAPI: 'v1.0', strHoaDonThu_Rut_Id: o.id }
                : { action: 'TC_PhieuThu/LayTTPhieuThu_Rut', method: 'GET', versionAPI: 'v1.0', strPhieuThu_Rut_Id: o.id };
            return ums.api.call(call).then(function (r) {
                var d = r.data || {};
                var rs = d.rs || [], dt = d.rsThongTinDoiTuong || [];
                if (!rs.length || !dt.length) {
                    ui.toast('Không thể lấy thông tin đối tượng thu! Vui lòng liên hệ admin', 'warn');
                    return { row: null };
                }
                if (isHD && (has(rs[0].DUONGDANFILEHOADON) || String(rs[0].LAHOADONDIENTU) === '1')) {
                    // Chưa có đường dẫn tệp mà lấy cũng không được → bản gốc vẫn vẽ mẫu giấy
                    return hoaDonDienTu(rs[0]).then(function (part) {
                        if (part) return { row: rs[0], part: part };
                        return template(loai, rs, dt, o).then(function (p2) { return { row: p2 ? rs[0] : null, part: p2 }; });
                    });
                }
                return template(loai, rs, dt, o).then(function (part) { return { row: part ? rs[0] : null, part: part, rs: rs, dt: dt }; });
            });
        }

        /* Hoá đơn điện tử: hiện tệp của nhà cung cấp trong iframe, mở tab mới */
        function hoaDonDienTu(a) {
            var link = hddtBase();
            function part(path) {
                return {
                    key: 'hd' + a.CHUNGTU_ID,
                    css: '', lien: false,
                    html: '<iframe src="' + esc(link + path) + '" width="800px" height="600px"></iframe>'
                };
            }
            function getFiles() {
                return ums.api.call({
                    action: 'HDDT_HoaDon/GetFiles', method: 'GET',
                    transectionId: a.TRACSECTION_ID,
                    strDuongDanFile: a.DUONGDANFILEHOADON,
                    strDuongDanFileTongHop: a.DUONGDANFILETONGHOP,
                    strPhuongThuc_MA: a.PHATHANH_RESERVATIONCODE,
                    strSoHoaDon: a.SOHOADON
                }).then(function (r) {
                    var f = r.data || [];
                    ums.api.call({
                        action: 'TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT',
                        strId: a.CHUNGTU_ID,
                        strDuongDanFileHoaDon: f[0],
                        strDuongDanFileTongHop: f[1]
                    }).catch(function () { /* bản gốc bỏ qua lỗi */ });
                    return f[0] ? part(f[0]) : null;
                }).catch(function () { return null; });
            }
            if (has(a.DUONGDANFILEHOADON)) {
                var w = global.open(link + a.DUONGDANFILEHOADON, '_blank');
                if (!w) ui.toast('Hãy cho phép mở tab mới trên trình duyệt của bạn!', 'warn'); else w.focus();
                if (String(a.LAHOADONDIENTU) === '1') {
                    return getFiles().then(function (p) { return p || part(a.DUONGDANFILEHOADON); });
                }
                return Promise.resolve(part(a.DUONGDANFILEHOADON));
            }
            return getFiles();
        }

        function template(loai, rs, dt, o) {
            var mauChon = o.mau;
            var macDinh = MAC_DINH[loai] || MAC_DINH.BIENLAI;
            var ds = String(e(dt[0].MAUIN_MASO));
            var list = ds.indexOf(',') >= 0 ? ds.split(',') : [];
            var ten = mauChon || (list.length ? list[0] : ds);
            var isHD = loai === 'HOADON';
            var bang = isHD ? FILL_HOADON : FILL_PHIEU;
            var id = e(rs[0].CHUNGTU_ID);

            if (ten && !bang[ten]) {
                // Mẫu có tệp nhưng chưa chuyển hàm đổ dữ liệu — bản gốc (nhánh default) nạp mẫu mặc định
                ui.toast('Mẫu in "' + ten + '" chưa chuyển sang giao diện mới — đang dùng mẫu mặc định ' + macDinh + '.', 'info');
                ten = macDinh;
            }
            if (o.rutGon) return Promise.resolve(P.neutral(rs, dt, loai));
            return loadTpl(ten || macDinh).then(function (t) {
                if (!t && ten && ten !== macDinh) return loadTpl(macDinh);
                return t;
            }).then(function (t) {
                /* Không có tệp phôi (máy lập trình, chế độ dựng thử, hoặc
                   trường chưa nạp phôi) → bản rút gọn, KHÔNG bỏ trắng màn. */
                if (!t) return P.neutral(rs, dt, loai);
                var box = document.createElement('div');
                box.innerHTML = t.body.replace(/SOCHUNGTU_REPLACE/g, id);
                if (isHD) fillHoaDonLuat(box, rs, dt, id);
                else fillPhieu(box, rs, dt, id, FILL_PHIEU[t.name] || {});
                if (String(dt[0].TINHTRANG) === '-1') {
                    Array.prototype.forEach.call(box.getElementsByClassName('xnDaHuyChungTu_' + id), function (el) {
                        el.innerHTML = '<p class="lbDaHuyPhieu">Đã Hủy</p>';
                    });
                }
                if (o.after) o.after(box);          // vd genHTML_PhieuRut đổi tên phiếu
                absImages(box);
                return { key: t.name, css: t.css, html: box.innerHTML, list: list, mau: t.name };
            });
        }

        var api = {
            last: null,
            clear: function () { parts = []; cssAll = {}; lienSel = 'all'; render(); },
            count: function () { return parts.length; },
            /* Xem một chứng từ (thay nội dung cũ) */
            show: function (o) {
                api.last = o;
                host.innerHTML = ui.empty('Đang tải chứng từ…', 'fa-spinner fa-spin');
                frame = null;
                return build(o).then(function (res) {
                    parts = []; cssAll = {}; lienSel = 'all';
                    if (res.part) { parts.push(res.part); cssAll[res.part.key] = res.part.css; }
                    render();
                    if (opts.onMau) opts.onMau(res.part && res.part.list ? res.part.list : [], res.part ? res.part.mau : '');
                    return res.row;
                }).catch(function (err) {
                    render();
                    ums.api.handle(err, 'xem chứng từ');
                    return null;
                });
            },
            /* Chuyển sang mẫu khác trong danh sách MAUIN_MASO */
            doiMau: function (mau) {
                if (!api.last) return Promise.resolve(null);
                var o = {}; Object.keys(api.last).forEach(function (k) { o[k] = api.last[k]; });
                o.mau = mau;
                return api.show(o);
            },
            /* Nối thêm (in theo lô): mỗi chứng từ một trang */
            add: function (o) {
                return build(o).then(function (res) {
                    if (res.part) {
                        var p = res.part;
                        p.html = '<div>' + p.html + '</div><p style="page-break-before: always;"></p>';
                        parts.push(p);
                        cssAll[p.key] = p.css;
                        render();
                    }
                    return res.row;
                }).catch(function (err) {
                    ums.api.handle(err, 'nạp chứng từ');
                    return null;
                });
            },
            /* In: remove_PhoiIn (bỏ ảnh phôi *_PHOI.jpg) rồi in */
            print: function (title) {
                if (!parts.length) { ui.toast('Chưa có chứng từ để in', 'warn'); return false; }
                var css = Object.keys(cssAll).map(function (k) { return cssAll[k]; }).join('\n');
                var html = applyLien(bodyHtml()).replace(/_PHOI.jpg/g, '');
                return ui.print(html, { title: title || 'In chứng từ', css: css });
            },
            html: function () { return bodyHtml(); }
        };
        render();
        return api;
    };

})(window);
