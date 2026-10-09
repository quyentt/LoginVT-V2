/* =========================================================================
   thanhtoanonline — Thanh toán học phí (Cổng sinh viên - thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/thanhtoanonline/html/thanhtoanonline.html
            + script/thanhtoanonline.js  (+ script/qrcode.min.js — xem cuối)
   Màn CÁN BỘ cùng luồng đã chuyển:
            _v2/ApisCongCanBo/Modules/thongtinsinhvien/script/thanhtoanonline.js
            (bản đó cán bộ TRA theo mã SV; bản này là bên NGƯỜI HỌC, đầy đủ hơn
            ~1.340 dòng: có Nộp trước và hộp "Danh sách" chi tiết khoản).
   ---------------------------------------------------------------------------
   Bố cục giữ đúng bản gốc: MỘT hàng HAI cột —
     · trái  (col-md-3) "Thông tin cá nhân": Họ tên / Mã Sinh viên / Ngày sinh /
       Lớp / Ngành / Khóa, dưới cùng là ô chọn ngân hàng + "Thực hiện thanh toán";
     · phải  (col-md-9) "Thông tin thanh toán" + tổng tiền đã chọn (chữ đỏ, bên
       phải tiêu đề) + bảng khoản phải nộp + dải nút "Hủy nộp trước" / "Nộp trước".
   Người học = ums.session.userId (vỏ thủ vai đã đặt, thay edu.system.userId).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn action / func / tên tham số):
     CM_DanhMucDuLieu/LayDanhSach   GET v1.0  VNPAY.NGANHANG → ô ngân hàng
                                              (MA / THONGTIN1 tên / THONGTIN2 = serviceId,
                                              sắp theo HESO1)
     TC_ThanhToan_MH/DSA4FSkuLyYVKC8VICgCKSgvKQPP   pkg_thanhtoan.LayThongTinTaiChinh  (POST)
                                              strMaSinhVien = userId, strMaNganHang theo ô
                                              ngân hàng (xem maNganHang) → Data.{ rs, rsSinhVien, rsChiTiet }
     TC_ThanhToan_NopTruoc_MH/DSA4BRIKKS4gLw8uMRUzNC4i  PKG_THANHTOAN_NOPTRUOC.LayDSKhoanNopTruoc
     TC_ThanhToan_NopTruoc_MH/FSkkLB4VICgCKSgvKR4RKSAoDy4xHg8uMRUzNC4i
                                              PKG_THANHTOAN_NOPTRUOC.Them_TaiChinh_PhaiNop_NopTruoc
     TC_ThanhToan_NopTruoc_MH/GS4gHg8uMRUzNC4iHgUuLwkgLyYeAikoFSgkNQPP
                                              PKG_THANHTOAN_NOPTRUOC.Xoa_NopTruoc_DonHang_ChiTiet
     TC_ThanhToan_NopTruoc_MH/DSA4AikoFSgkNQ8uKAU0LyYVKSAvKRUuIC8P
                                              PKG_THANHTOAN_NOPTRUOC.LayChiTietNoiDungThanhToan
     Thanh toán:
       ngân hàng thuộc "#BIDV#SHB#VTB#VIB#VTB2#VCB"
            → TC_TCThanhToan/XacNhanThanhToanDonHang (chuỗi "<id>#<số tiền>", nối phẩy)
            → CTT_<NH>Payment/VanTinQRCode (strVal riêng từng ngân hàng)
            → hiện mã QR; sau 30 giây hỏi TC_TCThanhToan/KiemTraGachNoTheoDonHang
              mỗi 10 giây tới khi gạch nợ xong
       ngân hàng khác → hỏi lại → CTT_ThongTinKetNoi/KetNoiVNPAY (GET) rồi chuyển trang
   ---------------------------------------------------------------------------
   Giữ NGUYÊN như bản gốc (cần nghiệp vụ / kiểm trên host):
     · Khối strVal của VTB chép cứng providerId "DHLAMNGHIEP", merchantId
       "0500465853", terminalId "TDHLAMNGHIEP" và MỘT chữ ký cố định — trông như
       cấu hình của trường khác. Không tự sửa, cần đối tác xác nhận.
     · VTB: transactionDate lấy NĂM + 1 trong khi transTime lấy năm hiện tại
       (bản gốc: `(year + 1).toString() + month…`). Giữ nguyên, hỏi lại.
     · Mọi dòng khoản thu mở màn đã ĐÁNH DẤU SẴN; dòng BATBUOC = 1 thì khoá ô
       đánh dấu và ẩn hẳn ô "chọn tất cả" ở đầu bảng.
     · Ô số tiền chỉ mở khi DUOCSUASOTIENCHITIET = 1.
     · "Nộp trước": số tiền gửi lên ĐÚNG chuỗi đang hiện trong ô, tức có dấu phẩy
       ngăn nghìn ("1,500,000") — bản gốc định dạng ô rồi gửi thẳng.
     · "Hủy nộp trước" xoá MỌI dòng đang đánh dấu của bảng (không chỉ dòng nộp
       trước) — đúng như bản gốc.
     · Hộp chi tiết: mở hộp là dòng cha bị đánh dấu và KHOÁ luôn (gốc không mở lại).
     · Tiêu đề hộp chi tiết bản gốc là "Danh sách <span id=lblXacNhanChiTiet>"
       mà không chỗ nào điền span đó → giữ đúng chữ "Danh sách".
     · Nút "Thanh Toán đơn chi tiết" chưa chọn dòng nào thì báo "Vui lòng chọn
       đối tượng cần xóa?" — chữ của bản gốc, giữ nguyên.
   Khác bản gốc (có chủ ý, đều báo lại):
     · VIB báo lỗi: bản gốc đọc `obj.status.STATUSCODE` (khuôn của VTB) trong khi
       nhánh thành công đọc `obj.Result.STATUSCODE` → lỗi JS, không hiện gì.
       Ở đây đọc `obj.Result.STATUSCODE` cho cả hai nhánh.
     · Ô "chọn tất cả" của hộp chi tiết (class chkSelectSystemAll) ở bản gốc
       KHÔNG có trình xử lý nào → nay chọn/bỏ chọn cả bảng (ý định rõ ràng).
     · serviceId của QR lấy từ cột THONGTIN2 của dòng ngân hàng đang chọn — bản
       gốc đọc thuộc tính `name` của <option>, mà loadToCombo_data đặt đúng
       THONGTIN2 vào đó. Cùng một giá trị.
     · Ô số tiền dồn phải cả khi đang mở (bản gốc chỉ dồn phải ô đã khoá).
   Bỏ:
     · `<div class="aps-gap-10 btn-show">` chứa nút "Thêm khoản Nộp trước":
       `display: none !important` và không mã nào hiện nó — trùng nút "Nộp trước".
     · `qrcode.min.js` (thư viện sinh QR ở máy khách) được nạp trong html gốc
       nhưng KHÔNG dòng nào gọi tới (`new QRCode` không xuất hiện): mã QR do máy
       chủ trả về dạng ảnh base64. Không nạp lại; _v2 vẫn có sẵn một bản ở
       `_v2/ApisTaiChinh/Modules/phieuthu/scripts/qrcode.min.js` nếu sau này cần.
     · `iBase64` (khai rồi không dùng), `fakedb`, các khối chú thích chết.
   Ô chọn CHA → CON: màn này không có cặp nào (chỉ một ô ngân hàng độc lập và
   một ô "Khoản" trong biểu mẫu Nộp trước).
   ---------------------------------------------------------------------------
   Kéo gốc 30/9 (kho gốc fed68f6e..cffda56e):
     · Mở màn KHÔNG còn nạp danh mục VNPAY.CAUHINHTHANHTOAN (gốc chú thích bỏ
       getList_CauHinhThanhToan) — bảng nạp theo ô ngân hàng: nạp ngân hàng →
       chọn sẵn ngân hàng đầu (sau khi sắp theo HESO1) → nạp bảng.
     · Đổi ô Ngân hàng (có giá trị) thì nạp lại bảng. strMaNganHang không còn
       viết cứng "VNPAY": VCB → VCB_ONLINE, BIDV → BIDV_ONLINE, SHB → SHB,
       VTB → VTB_ONLINE, VIB → VIB_ONLINE, còn lại (kể cả VTB2) → VNPAY.
     · LayThongTinTaiChinh đổi GET → POST.
     · Ô ngân hàng bỏ dòng "Chọn ngân hàng" (gốc title: false) — luôn có một
       ngân hàng được chọn khi danh mục có dữ liệu.
     · html gốc chỉ đổi bố cục hộp chi tiết (rộng hơn, bảng cuộn ngang) và bỏ
       bản vá select2 trong modal — không có ô / nút mới.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('csv-ttol');

    var MH = 'TC_ThanhToan_MH/', NT = 'TC_ThanhToan_NopTruoc_MH/';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function hai(n) { return (n < 10 ? '0' : '') + n; }

    /* edu.util.getValById + getSoTien của bản gốc: bỏ dấu cách, dấu phẩy rồi parseFloat */
    function soTien(v) {
        var n = parseFloat(String(e(v)).replace(/ /g, '').replace(/,/g, ''));
        return isNaN(n) ? 0 : n;
    }
    /* edu.system.change_alias (Core/systemroot.js:7834) — chép nguyên, kể cả việc
       biến dấu gạch dưới thành dấu cách */
    function khongDau(s) {
        var str = String(e(s)).toLowerCase();
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
    }

    /* ---------- Khung màn hình ------------------------------------------- */
    /* Chỉ HỌ TÊN in đậm (đó là thứ cần nhận ra ngay); các dòng còn lại chữ thường
       để mắt không bị nhiễu — lớp ttol-kv đặt ở css/thanhtoanonline.css. */
    function kv(nhan, z, dam) {
        return '<div class="ums-kv ttol-kv' + (dam ? ' ttol-kv--dam' : '') + '"><span>' + esc(nhan) + '</span><b data-z="' + z + '"></b></div>';
    }

    root.innerHTML =
        pat.page('Thanh toán học phí', '') +
        '<div class="ttol-cols">' +
        pat.panel({
            title: 'Thông tin cá nhân', icon: 'fa-user',
            body: kv('Họ tên', 'hoTen', true) + kv('Mã Sinh viên', 'maSV') + kv('Ngày sinh', 'ngaySinh') +
                kv('Lớp', 'lop') + kv('Ngành', 'nganh') + kv('Khóa', 'khoa') +
                '<div class="ttol-pay">' +
                '<div class="ums-field"><select class="ums-select" data-f="nh"></select></div>' +
                ui.btn('save', { text: 'Thực hiện thanh toán', mod: 'primary', icon: 'fa-paper-plane', attr: { 'data-a': 'tt' } }) +
                '</div>'
        }) +
        pat.panel({
            title: 'Thông tin thanh toán', icon: 'fa-credit-card', flush: true,
            tools: '<span class="ttol-tong" data-z="daChon"></span>',
            body: '<div data-z="bang"></div>' +
                '<div class="ums-tablefoot ttol-nt" data-z="nt" hidden>' +
                ui.xoaChon('input[data-chon]', {
                    text: 'Hủy nộp trước', trong: '[data-z="bang"]', attr: { 'data-a': 'xoant' }
                }) +
                ui.btn('add', { text: 'Nộp trước', attr: { 'data-a': 'themnt' } }) +
                '</div>'
        }) +
        '</div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var st = {
        rows: [],           // Data.rsChiTiet
        vanTin: null,       // Data (rs / rsSinhVien / rsChiTiet)
        maSV: '',
        maDonHang: '',      // rs[0].MADONHANG_GUI_NGANHANG
        ngayTao: '',        // rs[0].NGAYTAODONHANG
        dsNH: [],
        khoanNT: [],
        maGD: '',
        ctId: '',           // dòng cha đang mở hộp chi tiết
        ctRows: []
    };

    /* ---------- Nạp danh mục --------------------------------------------- */
    function dmCu(ma) {
        return ums.api.call({
            action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strMaBangDanhMuc: ma, silent: true
        }).then(function (r) { return arr(r.data); });
    }

    function taiNganHang() {
        return dmCu('VNPAY.NGANHANG').then(function (ds) {
            /* Kéo gốc 30/9: sắp theo HESO1 khi dòng đầu có cột này */
            if (ds.length && ds[0].HESO1) {
                ds.sort(function (a, b) { return Number(a.HESO1) - Number(b.HESO1); });
            }
            st.dsNH = ds;
            pat.fill(f('nh'), ds, { id: 'MA', name: 'THONGTIN1', head: '' });
            /* gốc title: false — không có dòng trống "Chọn ngân hàng" */
            var trong = f('nh').querySelector('option[value=""]');
            if (trong && ds.length) trong.remove();
            /* Bản gốc: $("#drpNganHang").val(data[0].MA).trigger("change") → nạp bảng */
            if (ds.length) {
                f('nh').value = e(ds[0].MA);
                if (window.jQuery) jQuery(f('nh')).trigger('change.select2');
                taiBang();
            } else {
                veSV(null); veBang();
            }
        }).catch(function (err) { ums.api.handle(err, 'danh sách ngân hàng'); });
    }

    /* Mã ngân hàng gửi LayThongTinTaiChinh — chép switch của bản gốc (Kéo gốc 30/9) */
    function maNganHang(nh) {
        switch (nh) {
            case 'VCB': return 'VCB_ONLINE';
            case 'BIDV': return 'BIDV_ONLINE';
            case 'SHB': return 'SHB';
            case 'VTB': return 'VTB_ONLINE';
            case 'VIB': return 'VIB_ONLINE';
            default: return 'VNPAY';
        }
    }

    /* ---------- Thông tin tài chính + bảng khoản -------------------------- */
    function veSV(sv) {
        sv = sv || {};
        z('hoTen').textContent = e(sv.HOVATEN);
        z('maSV').textContent = e(sv.MASINHVIEN);
        z('ngaySinh').textContent = e(sv.NGAYSINH);
        z('lop').textContent = e(sv.LOP);
        z('nganh').textContent = e(sv.NGANH);
        z('khoa').textContent = e(sv.KHOADAOTAO);
    }

    function taiBang() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: MH + 'DSA4FSkuLyYVKC8VICgCKSgvKQPP',
            func: 'pkg_thanhtoan.LayThongTinTaiChinh',
            method: 'POST',
            strMaSinhVien: uid(),
            strMaNganHang: maNganHang(f('nh').value)
        }).then(function (r) {
            var d = r.data || {};
            st.vanTin = d;
            st.rows = arr(d.rsChiTiet);
            var sv = arr(d.rsSinhVien)[0] || {};
            var rs = arr(d.rs)[0] || {};
            veSV(sv);
            st.maSV = e(sv.MASINHVIEN);
            st.maDonHang = e(rs.MADONHANG_GUI_NGANHANG);
            st.ngayTao = e(rs.NGAYTAODONHANG);
            veBang();
        }).catch(function (err) {
            st.vanTin = null; st.rows = []; st.maSV = '';
            veSV(null); veBang();
            ui.toast(err.message, 'warn');
        });
    }

    function veBang() {
        var coBatBuoc = st.rows.some(function (r) { return Number(r.BATBUOC) === 1; });
        ui.table({
            el: z('bang'), rows: st.rows, empty: 'Không có khoản cần thanh toán',
            columns: [
                { title: 'Nội dung', cls: 'is-center', render: function (r) { return esc(e(r.NOIDUNG)); } },
                {
                    title: 'Số tiền', cls: 'is-center', width: '190px',
                    sum: function (rows) {
                        return '<b>' + esc(pat.money(rows.reduce(function (s, r) { return s + soTien(r.SOTIEN); }, 0))) + '</b>';
                    },
                    render: function (r, i) {
                        /* DUOCSUASOTIENCHITIET = 1 mới cho sửa — như bản gốc */
                        return '<input type="text" class="ums-input ums-input--sm ttol-sotien" data-st="' + i + '"' +
                            ' data-goc="' + esc(pat.money(r.SOTIEN)) + '" value="' + esc(pat.money(r.SOTIEN)) + '"' +
                            (Number(r.DUOCSUASOTIENCHITIET) === 1 ? '' : ' disabled') + '>';
                    }
                },
                /* colPos.center của bản gốc KHÔNG có cột Ghi chú → để dồn trái */
                { title: 'Ghi chú', render: function (r) { return esc(e(r.GHICHU)); } },
                {
                    title: 'Chi tiết', cls: 'is-center is-actions', width: '90px',
                    render: function (r) { return ui.iconBtn('edit', r.ID); }
                },
                {
                    /* Ô "chọn tất cả" bị ẩn hẳn khi có khoản bắt buộc — như bản gốc */
                    head: coBatBuoc ? '' : '<input type="checkbox" data-chon="all" title="Chọn tất cả">',
                    cls: 'is-center', width: '56px',
                    render: function (r, i) {
                        var bb = Number(r.BATBUOC) === 1;
                        return '<input type="checkbox" data-chon="' + i + '" checked' + (bb ? ' disabled' : '') + '>';
                    }
                }
            ]
        });
        tong();
    }

    /* Tổng cuối bảng: bản gốc cộng MỌI dòng theo ô số tiền ĐANG HIỆN
       (insertSumAfterTable), không phụ thuộc ô đánh dấu. */
    function tongHien() {
        return st.rows.reduce(function (s, r, i) {
            var el = o(i);
            return s + (el ? soTien(el.value) : soTien(r.SOTIEN));
        }, 0);
    }
    function o(i) { return z('bang').querySelector('[data-st="' + i + '"]'); }
    function oChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-chon]'), function (c) {
            return c.getAttribute('data-chon') !== 'all';
        });
    }
    function daChon() {
        return oChon().filter(function (c) { return c.checked; })
            .map(function (c) { return Number(c.getAttribute('data-chon')); });
    }
    function giaTri(i) { var el = o(i); return el ? soTien(el.value) : 0; }

    /* Tổng tiền đã chọn (#lbSoTienDaChon) + dòng tổng cuối bảng */
    function tong() {
        var sum = daChon().reduce(function (s, i) { return s + giaTri(i); }, 0);
        z('daChon').innerHTML = st.rows.length
            ? 'Tổng tiền đã chọn: <b>' + esc(pat.money(sum)) + '</b>' : '';
        var cell = z('bang').querySelector('tfoot .ums-table__sum td:nth-child(3)');
        if (cell) cell.innerHTML = '<b>' + esc(pat.money(tongHien())) + '</b>';
    }

    z('bang').addEventListener('change', function (ev) {
        var t = ev.target;
        if (!t.hasAttribute || !t.hasAttribute('data-chon')) return;
        if (t.getAttribute('data-chon') === 'all') {
            oChon().forEach(function (c) { if (!c.disabled) c.checked = t.checked; });
        }
        tong();
    });
    /* edu.system.checkSoTienInput: sai định dạng thì trả về số tiền gốc, đúng thì
       định dạng lại dấu phẩy; bản gốc còn cắt phần thập phân. */
    z('bang').addEventListener('input', function (ev) {
        var t = ev.target;
        if (!t.hasAttribute || !t.hasAttribute('data-st')) return;
        var x = t.value;
        if (x.slice(-1) !== '.' && x.slice(-1) !== ',') {
            var raw = x.replace(/,/g, '');
            if (raw !== '' && !/^\d*\.?\d*$/.test(raw)) t.value = t.getAttribute('data-goc');
            else {
                var v = pat.money(raw);
                var d = v.indexOf('.');
                t.value = d === -1 ? v : v.substring(0, d);
            }
        }
        tong();
    });

    /* ---------- Thanh toán ------------------------------------------------ */
    function thanhToan() {
        var nh = f('nh').value;
        if (!nh) { ui.toast('Vui lòng chọn ngân hàng để thanh toán', 'warn'); return; }
        var chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn khoản cần thanh toán', 'warn'); return; }

        if ('#BIDV#SHB#VTB#VIB#VTB2#VCB'.indexOf(nh) !== -1) { xacNhanDonHang(chon); return; }

        ui.confirm('Bạn có chắc chắn thanh toán?', { title: 'Thanh toán' }).then(function (yes) {
            if (!yes) return;
            var ids = chon.map(function (i) { return e(st.rows[i].ID); });
            /* NoiDungs = <mã SV>_<ngân hàng>_<id1|id2…>  (bản gốc nối "^" rồi cắt ký tự cuối) */
            var noiDungs = st.maSV + '_' + nh + '_' + ids.join('|');
            ums.api.call({
                action: 'CTT_ThongTinKetNoi/KetNoiVNPAY', method: 'GET', versionAPI: 'v1.0',
                DonHangChiTietIds: ids.join('|'),
                SoTiens: chon.map(giaTri).join('|'),
                NoiDungs: noiDungs,
                vnp_TmnCode: nh,
                MaDonHang_Gui_NganHang: st.maDonHang,
                CreatedDate: st.ngayTao
            }).then(function (r) {
                if (r.data) window.location.replace(r.data);
            }).catch(function (err) { ums.api.handle(err, 'CTT_ThongTinKetNoi/KetNoiVNPAY'); });
        });
    }

    /* save_ThanhToanDonHang: mỗi khoản một chuỗi "<id>#<số tiền>", nối bằng dấu phẩy
       (bản gốc `arr.toString("_")` — toString bỏ qua tham số nên vẫn là dấu phẩy) */
    function xacNhanDonHang(chon) {
        var tongTien = 0;
        var ds = chon.map(function (i) {
            var t = giaTri(i);
            tongTien += t;
            return e(st.rows[i].ID) + '#' + t;
        });
        ums.api.call({
            action: 'TC_TCThanhToan/XacNhanThanhToanDonHang', method: 'POST',
            strThanhToan_DonHang_CT_Id: ds.join(','),
            strNguoiThucHien_Id: uid()
        }).then(function (r) {
            st.maGD = r.data;
            layQR(r.data, tongTien);
        }).catch(function (err) { ums.api.handle(err, 'TC_TCThanhToan/XacNhanThanhToanDonHang'); });
    }

    /* ---------- Mã QR ----------------------------------------------------- */
    function layQR(code, dSoTien) {
        var rs = arr(st.vanTin && st.vanTin.rs)[0] || {};
        var maSV = e(rs.MASINHVIEN), hoTen = e(rs.HOVATEN), tkAo = e(rs.TKAO);
        var chon = daChon();
        var nh = f('nh').value;
        var dong = st.dsNH.filter(function (x) { return x.MA === nh; })[0] || {};
        var serviceId = e(dong.THONGTIN2);
        var ten = nh.indexOf('_') !== -1 ? nh.split('_')[0] : nh;

        /* Bản gốc: nội dung lấy ở rs[0].NOIDUNG, không có thì lấy của khoản đầu tiên */
        var noiDung = e(rs.NOIDUNG);
        if (!noiDung) {
            var d0 = arr(st.vanTin && st.vanTin.rsChiTiet).filter(function (x) {
                return chon.length && String(x.ID) === String(st.rows[chon[0]].ID);
            })[0];
            noiDung = d0 ? e(d0.NOIDUNG) : '';
        }
        noiDung = khongDau(noiDung);

        var dt = new Date(Date.now());            // edu.util.getServerTime() = Date.now()
        var y = dt.getFullYear(), mo = hai(dt.getMonth() + 1), dd = hai(dt.getDate());
        var h = hai(dt.getHours()), mi = hai(dt.getMinutes()), s = hai(dt.getSeconds());
        var noiDung2 = maSV + ' ' + khongDau(hoTen);
        var val;

        switch (ten) {
            case 'BIDV':
                val = {
                    serviceId: serviceId, code: code, name: maSV + ' ' + hoTen,
                    amount: dSoTien.toString(), description: noiDung.replace(/_/g, ' ')
                };
                break;
            case 'VTB':
                val = {
                    requestId: ums.util.uuid(),
                    providerId: 'DHLAMNGHIEP',
                    merchantId: '0500465853',
                    clientDt: y + '-' + mo + '-' + dd + 'T' + h + ':' + mi + ':' + s + '.632Z',
                    channel: 'internal', version: '0.0.1', language: 'en', clientIP: '',
                    signature: 'JcJg4S7qF8G3B9OlJQoZsGx8dtyPDmsYKNub6hCZFh51tnnRG+1Up/R0mtmGWoOxsqGTdIWSdGwiqxrOvsRPH62Elz9JAYDT1RHphlemrmxcy+4YWihPYOEGIhn8kfCq+LiMKatort3xPDT6G4DTsVmnY29MyIkA/vgDe8br39v7kN6n7URuMWJzsEiO4xjmPk8ZUmobkTJrkxPgLAX+K9MTZ9xCg2iQNj3QInG/fzEo/3J+VhlN4uGl3wdgaaUontRc40GfqGFtyuS+gPsH84kyeMF8L3FRKyQ1WnqyhLsuM4hY2dd1H3g7kWghzXOPhrkYLUxQEB0gS0m8Sh3FNA==',
                    data: {
                        merchantName: 'DHLAMNGHIEP', terminalId: 'TDHLAMNGHIEP', productId: '',
                        orderId: code, amount: '' + dSoTien, payMethod: 'QR',
                        /* NĂM + 1 — đúng như bản gốc, xem chú thích đầu tệp */
                        transactionDate: '' + (y + 1).toString() + mo + dd + h + mi + s,
                        currencyCode: 'VND', remark: noiDung,
                        transTime: '' + y.toString() + mo + dd + h + mi + s,
                        imageSize: '200'
                    }
                };
                break;
            case 'VTB2':
                val = {
                    requestId: ums.util.uuid(), providerId: '', merchantId: '',
                    clientDt: y + '-' + mo + '-' + dd + 'T' + h + ':' + mi + ':' + s + '.632Z',
                    channel: 'internal', version: '0.0.1', language: 'en', clientIP: '',
                    signature: 'JcJg4S7qF8G3B9OlJQoZsGx8dtyPDmsYKNub6hCZFh51tnnRG+1Up/R0mtmGWoOxsqGTdIWSdGwiqxrOvsRPH62Elz9JAYDT1RHphlemrmxcy+4YWihPYOEGIhn8kfCq+LiMKatort3xPDT6G4DTsVmnY29MyIkA/vgDe8br39v7kN6n7URuMWJzsEiO4xjmPk8ZUmobkTJrkxPgLAX+K9MTZ9xCg2iQNj3QInG/fzEo/3J+VhlN4uGl3wdgaaUontRc40GfqGFtyuS+gPsH84kyeMF8L3FRKyQ1WnqyhLsuM4hY2dd1H3g7kWghzXOPhrkYLUxQEB0gS0m8Sh3FNA==',
                    data: {
                        accountNumber: serviceId + code,
                        amount: '' + dSoTien,
                        storeLabel: code, referenceLabel: code, customerLabel: code, msgId: code,
                        purposeOfTrans: noiDung2.substring(0, 70),
                        terminalLabel: '1'
                    }
                };
                break;
            default:
                val = {
                    strMaSinhVien: maSV, strHoVaTen: hoTen, strMaDonHang: code,
                    strNoiDung: noiDung, strNoiDung2: noiDung2, strTaiKhoanAo: tkAo,
                    strSoTien: dSoTien.toString()
                };
        }

        ums.api.call({
            action: 'CTT_' + ten + 'Payment/VanTinQRCode', method: 'POST',
            strKey: '', strVal: JSON.stringify(val), strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var qr = docQR(ten, r.data);
            if (qr === null) return;                 // đã báo lỗi của ngân hàng
            if (!qr) { ui.toast('Không lấy được mã QR', 'warn'); return; }
            var dlg = ui.dialog({
                title: 'Quét mã để thanh toán', icon: 'fa-qrcode', size: 'sm',
                body: '<div class="ttol-qr">' +
                    '<p>' + esc(code + ' - ' + pat.money(dSoTien)) + '</p>' +
                    '<p>' + esc(maSV + ' - ' + hoTen) + '</p>' +
                    '<img alt="Mã QR" src="data:image/png;base64, ' + esc(qr) + '">' +
                    '</div>'
            });
            setTimeout(function () { hoiGachNo(code, dlg); }, 30000);
        }).catch(function (err) { ums.api.handle(err, 'CTT_' + ten + 'Payment/VanTinQRCode'); });
    }

    /* Mỗi ngân hàng một khuôn phản hồi — chép đúng cách bản gốc đọc.
       null = đã báo lỗi, không hiện hộp QR. */
    function docQR(ten, data) {
        function bao(ma, mota) { ui.toast('Lỗi :' + e(ma) + ' : ' + e(mota), 'bad'); }
        try {
            var obj;
            switch (ten) {
                case 'BIDV':
                    obj = JSON.parse(data);
                    if (obj.errorCode) {
                        if (obj.errorCode === '000') return obj.vietQRImage;
                        bao(obj.errorCode, obj.errorDesc); return null;
                    }
                    if (obj.msg.header.errorCode === '000') return obj.msg.body.vietQRImage;
                    bao(obj.msg.header.errorCode, obj.msg.header.errorDesc); return null;
                case 'VTB':
                    obj = JSON.parse(data);
                    if (obj.status.statusCode === '00') return obj.data.qrData;
                    bao(obj.status.statusCode, obj.status.statusDesc); return null;
                case 'VTB2':
                    return data;
                case 'VIB':
                    obj = JSON.parse(data);
                    if (obj.Result.STATUSCODE === '000000') return obj.Result.DATA.qrImage;
                    bao(obj.Result.STATUSCODE, ''); return null;   // gốc đọc obj.status.STATUSCODE → lỗi JS
                default:
                    return data;
            }
        } catch (ex) {
            ui.toast('Không đọc được phản hồi của ngân hàng: ' + ex.message, 'bad');
            return null;
        }
    }

    function hoiGachNo(code, dlg) {
        /* Bản gốc dừng khi màn hình đã đóng hoặc đã sang giao dịch khác */
        if (!document.body.contains(root) || code !== st.maGD) return;
        ums.api.call({
            action: 'TC_TCThanhToan/KiemTraGachNoTheoDonHang', method: 'GET',
            strMaDonHangTongHop: code, strNguoiThucHien_Id: uid(), silent: true
        }).then(function (r) {
            if (arr(r.data).length) {
                st.maGD = '';
                if (dlg && !dlg.closed) {
                    dlg.body.innerHTML = '<div class="ttol-qr"><span class="ttol-ok">Thanh toán thành công</span></div>';
                } else {
                    ui.toast('Thanh toán thành công', 'ok');
                }
                taiBang();
            } else {
                setTimeout(function () { hoiGachNo(code, dlg); }, 10000);
            }
        }).catch(function (err) { ums.api.handle(err, 'kiểm tra gạch nợ'); });
    }

    /* ---------- Khoản nộp trước ------------------------------------------- */
    function taiKhoanNopTruoc() {
        return ums.api.call({
            action: NT + 'DSA4BRIKKS4gLw8uMRUzNC4i',
            func: 'PKG_THANHTOAN_NOPTRUOC.LayDSKhoanNopTruoc',
            strNguoiThucHien_Id: uid(), silent: true
        }).then(function (r) {
            st.khoanNT = arr(r.data);
            if (st.khoanNT.length) z('nt').hidden = false;
        }).catch(function (err) { console.log(err.message); });
    }

    /* Biểu mẫu thêm MỘT khoản nộp trước — ngay trong trang, thay chỗ màn (ums.pat.formTrang, BO-CUC luật 1; gốc là modal,
       trước 2026-09-30 bản mới cũng bật hộp thoại). Ô ngắn hai ô một hàng, ô Nội dung chiếm cả hàng. */
    function hopNopTruoc() {
        var dlg = pat.formTrang({
            host: root, title: 'Thêm khoản Nộp trước', icon: 'fa-plus',
            body: ui.field('Khoản', '<select class="ums-select" data-d="khoan"></select>') +
                ui.field('Số tiền', '<input type="text" class="ums-input" data-d="sotien">') +
                '<div style="grid-column:1 / -1">' + ui.field('Nội dung', '<textarea class="ums-textarea" data-d="noidung" rows="3"></textarea>') + '</div>',
            buttons: [{
                text: 'Lưu', kind: 'save',
                onClick: function (d) { luuNopTruoc(d); return false; }
            }]
        });
        var sel = dlg.body.querySelector('[data-d="khoan"]');
        /* selectFirst: true của bản gốc — chọn sẵn khoản đầu tiên */
        pat.fill(sel, st.khoanNT, { id: 'ID', name: 'TEN', head: 'Chọn khoản' });
        if (st.khoanNT.length) {
            sel.value = e(st.khoanNT[0].ID);
            if (window.jQuery) jQuery(sel).trigger('change.select2');
        }
        /* Bản gốc: keyup trên .inputsotien của hộp → edu.util.formatCurrencyV2 */
        var ost = dlg.body.querySelector('[data-d="sotien"]');
        ost.addEventListener('input', function () {
            ost.value = String(ost.value).replace(/\D/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        });
        ui.enhance(dlg.body);
    }

    function luuNopTruoc(dlg) {
        var sv = arr(st.vanTin && st.vanTin.rsSinhVien)[0] || {};
        ums.api.call({
            action: NT + 'FSkkLB4VICgCKSgvKR4RKSAoDy4xHg8uMRUzNC4i',
            func: 'PKG_THANHTOAN_NOPTRUOC.Them_TaiChinh_PhaiNop_NopTruoc',
            strQLSV_NguoiHoc_Id: e(sv.ID),
            strDaoTao_ChuongTrinh_Id: e(sv.DAOTAO_TOCHUCCHUONGTRINH_ID),
            /* Bản gốc gửi ĐÚNG chuỗi trong ô, tức có dấu phẩy ngăn nghìn */
            dSoTien: dlg.body.querySelector('[data-d="sotien"]').value,
            strNoiDung: dlg.body.querySelector('[data-d="noidung"]').value,
            strTaiChinh_CacKhoanThu_Id: dlg.body.querySelector('[data-d="khoan"]').value,
            strNguoiThucHien_Id: uid()
        }).then(function () {
            dlg.close();
            taiBang();
        }).catch(function (err) { ui.toast(err.message, 'warn'); });
    }

    function xoaNopTruoc() {
        var chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ui.batch(chon.map(function (i) {
                return {
                    action: NT + 'GS4gHg8uMRUzNC4iHgUuLwkgLyYeAikoFSgkNQPP',
                    func: 'PKG_THANHTOAN_NOPTRUOC.Xoa_NopTruoc_DonHang_ChiTiet',
                    strDonHang_ChiTiet_Id: e(st.rows[i].ID),
                    strNguoiThucHien_Id: uid()
                };
            }), { title: 'Đang hủy nộp trước' }).then(function () { taiBang(); });
        });
    }

    /* ---------- Hộp "Danh sách" (xác nhận chi tiết) ------------------------ */
    function moChiTiet(id) {
        st.ctId = id;
        st.ctRows = [];
        /* Bản gốc: mở hộp là dòng cha bị đánh dấu và khoá luôn */
        var i = -1;
        st.rows.forEach(function (r, k) { if (String(r.ID) === String(id)) i = k; });
        var ck = i >= 0 ? z('bang').querySelector('input[data-chon="' + i + '"]') : null;
        if (ck) { ck.checked = true; ck.disabled = true; }
        tong();

        var dlg = ui.dialog({
            title: 'Danh sách', icon: 'fa-list-ul', size: 'xl',
            body: '<div class="ttol-ct">' +
                '<div class="ttol-ct__head"><b>Số tiền đã chọn</b>' +
                '<span class="ttol-tong" data-z="ctTong"></span></div>' +
                '<div data-z="ctBang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div></div>',
            buttons: [{
                text: 'Thanh Toán đơn chi tiết', kind: 'save', mod: 'primary', icon: 'fa-list-check',
                onClick: function (d) { return luuChiTiet(d); }
            }]
        });

        var bang = dlg.body.querySelector('[data-z="ctBang"]');
        var oTong = dlg.body.querySelector('[data-z="ctTong"]');

        function ctChon() {
            return Array.prototype.filter.call(bang.querySelectorAll('input[data-ck]'), function (c) {
                return c.checked;
            }).map(function (c) { return Number(c.getAttribute('data-ck')); });
        }
        function ctTong() {
            var sum = ctChon().reduce(function (s, k) { return s + soTien(st.ctRows[k].SOTIEN); }, 0);
            oTong.innerHTML = 'Tổng tiền đã chọn: <b>' + esc(pat.money(sum)) + '</b>';
            return sum;
        }
        dlg.ctChon = ctChon;
        dlg.ctTong = ctTong;

        ums.api.call({
            action: NT + 'DSA4AikoFSgkNQ8uKAU0LyYVKSAvKRUuIC8P',
            func: 'PKG_THANHTOAN_NOPTRUOC.LayChiTietNoiDungThanhToan',
            strTT_DonHang_ChiTiet_Id: id,
            strNguoiThucHien_Id: uid()
        }).then(function (r) {
            st.ctRows = arr(r.data);
            ui.table({
                el: bang, rows: st.ctRows, empty: 'Không có dữ liệu',
                columns: [
                    {
                        title: 'Học phần', cls: 'is-center',
                        render: function (r) { return esc(e(r.DAOTAO_HOCPHAN_TEN) + ' - ' + e(r.DAOTAO_HOCPHAN_MA)); }
                    },
                    { title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-center' },
                    { title: 'Lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN', cls: 'is-center' },
                    { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'is-center' },
                    {
                        title: 'Số tiền', cls: 'is-center',
                        render: function (r) { return esc(pat.money(r.SOTIEN)); }
                    },
                    { title: 'Số tín', prop: 'SOTINCHI', cls: 'is-center' },
                    { title: 'Học kỳ, đợt', prop: 'THOIGIAN', cls: 'is-center' },
                    {
                        /* Bản gốc có ô "chọn tất cả" nhưng KHÔNG gắn xử lý — nay chạy thật */
                        head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">',
                        cls: 'is-center', width: '56px',
                        render: function (r, i2) { return '<input type="checkbox" data-ck="' + i2 + '" checked>'; }
                    }
                ]
            });
            ctTong();
        }).catch(function (err) {
            bang.innerHTML = ui.fail(err.message);
            ui.toast(' : ' + err.message, 'ok');
        });

        bang.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.hasAttribute || !t.hasAttribute('data-ck')) return;
            if (t.getAttribute('data-ck') === 'all') {
                Array.prototype.forEach.call(bang.querySelectorAll('input[data-ck]'), function (c) {
                    if (c !== t) c.checked = t.checked;
                });
            }
            ctTong();
        });
    }

    /* save_ThanhToanChiTiet: "<id dòng cha>#<tổng tiền>#<id1,id2…>" */
    function luuChiTiet(dlg) {
        var chon = dlg.ctChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return false; }
        var tongTien = dlg.ctTong();
        var ids = chon.map(function (k) { return e(st.ctRows[k].ID); });

        /* Bản gốc cập nhật ngay ô số tiền của dòng cha rồi tính lại tổng */
        var i = -1;
        st.rows.forEach(function (r, k) { if (String(r.ID) === String(st.ctId)) i = k; });
        var el = i >= 0 ? o(i) : null;
        if (el) el.value = pat.money(tongTien);
        tong();

        ums.api.call({
            action: 'TC_TCThanhToan/XacNhanThanhToanDonHang', method: 'POST',
            strThanhToan_DonHang_CT_Id: st.ctId + '#' + tongTien + '#' + ids.join(','),
            strNguoiThucHien_Id: uid()
        }).then(function (r) {
            st.maGD = r.data;
            layQR(r.data, tongTien);
        }).catch(function (err) { ums.api.handle(err, 'TC_TCThanhToan/XacNhanThanhToanDonHang'); });
    }

    /* ---------- Sự kiện chung --------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a],[data-act]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'tt') thanhToan();
        else if (a === 'themnt') hopNopTruoc();
        else if (a === 'xoant') xoaNopTruoc();
        else if (b.getAttribute('data-act') === 'edit') moChiTiet(b.getAttribute('data-id'));
    });

    /* Kéo gốc 30/9: đổi ngân hàng (có giá trị) thì nạp lại bảng */
    f('nh').addEventListener('change', function () {
        if (!f('nh').value) return;
        taiBang();
    });

    /* ---------- Mở màn (page_load của bản gốc) ---------------------------- */
    taiNganHang();
    taiKhoanNopTruoc();
})();
