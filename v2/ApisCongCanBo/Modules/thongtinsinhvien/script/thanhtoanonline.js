/* =========================================================================
   Thanh toán học phí online (cán bộ tra theo mã sinh viên)
   Bản gốc: ApisCongCanBo/Modules/thongtinsinhvien/script/thanhtoanonline.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên — kể cả versionAPI):
       CM_DanhMucDuLieu/LayDanhSach        GET  versionAPI v1.0, strMaBangDanhMuc VNPAY.CAUHINHTHANHTOAN
                                                 → MA KHONGCHOPHEPSUASOTIEN, THONGTIN1 "0" = cho sửa số tiền
       CM_DanhMucDuLieu/LayDanhSach        GET  … VNPAY.NGANHANG → ô ngân hàng (MA / THONGTIN1, THONGTIN2 = serviceId)
       SV_HoSo/LayDanhSach                 GET  strTuKhoa = ô mã SV, pageSize 100000000 — đúng 1 kết quả mới lấy ID
       TC_TCThanhToan/LayThongTinTaiChinh  GET  strMaSinhVien = ID hồ sơ, strMaNganHang VNPAY
                                                 → Data.{ rs, rsSinhVien, rsChiTiet }
       Thanh toán:
         ngân hàng BIDV / SHB / VTB / VIB  → TC_TCThanhToan/XacNhanThanhToanDonHang (id các khoản, nối phẩy)
                                           → CTT_<NH>Payment/VanTinQRCode (strVal theo từng ngân hàng)
                                           → hiện mã QR, sau 10 giây hỏi TC_TCThanhToan/KiemTraGachNoTheoDonHang
                                             mỗi 3 giây tới khi gạch nợ xong (đóng hộp QR thì thôi hỏi)
         ngân hàng khác                    → CTT_ThongTinKetNoi/KetNoiVNPAY (GET) rồi chuyển trang sang data.Data

   Giữ như bản gốc (KIỂM TRÊN HOST trước khi giao):
     · Khối strVal của VTB chép cứng providerId "DHLAMNGHIEP", merchantId
       "0500465853", terminalId "TDHLAMNGHIEP" và một chữ ký cố định — trông như
       cấu hình của đơn vị khác. Không tự sửa; cần nghiệp vụ / đối tác xác nhận.
     · Mở màn là nạp ngay thông tin tài chính với mã SV RỖNG (như bản gốc).
     · Khoản BATBUOC = 1 đánh dấu sẵn và khoá; khi có khoản bắt buộc thì ẩn ô "chọn tất cả".
   Khác bản gốc:
     · Tra mã SV không ra ai: bản gốc đọc dtResult[0].MASO → lỗi JS, đứng màn.
       Ở đây báo "Không tìm thấy sinh viên".
     · clientDt của VTB lấy giờ máy người dùng (bản gốc edu.util.getServerTime —
       lời gọi đồng bộ lên máy chủ).
     · VIB báo lỗi: bản gốc đọc obj.status.statusCode (khuôn của VTB) → lỗi JS,
       không hiện gì. Ở đây đọc obj.Result.statusCode.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('ttol');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function soTien(s) { var n = parseFloat(String(e(s)).replace(/ /g, '').replace(/,/g, '')); return isNaN(n) ? 0 : n; }
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function khongDau(s) {      // edu.system.change_alias
        return String(e(s)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
            .replace(/[!@%^*()+=<>?\/,.:;'"&#\[\]~$`{}|\\-]/g, ' ').replace(/ + /g, ' ').trim();
    }
    function uuid() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    function kv(nhan, z) { return '<div><div class="ums-kv"><span>' + esc(nhan) + '</span><b data-z="' + z + '"></b></div></div>'; }

    root.innerHTML =
        pat.page('Thanh toán học phí', '') +
        pat.filterBar([{ key: 'ma', label: 'Nhập từ khóa tìm kiếm' }], { searchText: 'Xem' }) +
        pat.panel({
            title: 'Thông tin cá nhân', icon: 'fa-user',
            body: '<div class="ums-grid ums-grid--3">' + kv('Họ tên', 'hoTen') + kv('Mã Sinh viên', 'maSV') + kv('Ngày sinh', 'ngaySinh') +
                kv('Lớp', 'lop') + kv('Ngành', 'nganh') + kv('Khóa', 'khoa') + '</div>'
        }) +
        '<div class="ums-u-mt-4">' + pat.panel({
            title: 'Thông tin thanh toán', icon: 'fa-credit-card', flush: true,
            tools: '<span class="tt-daChon" data-z="daChon"></span>' +
                '<select class="ums-select" data-f="nh" data-ph="Chọn ngân hàng" style="min-width:240px"><option value=""></option></select>' +
                ui.btn('save', { text: 'Thực hiện thanh toán', mod: 'primary', icon: 'fa-paper-plane', attr: { 'data-a': 'tt' } }),
            zone: 'bang'
        }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var st = { choSua: '1', svId: '', maSV: '', rows: [], vanTin: null, maGD: '', dsNH: [] };

    /* ---------- Nạp ---------------------------------------------------- */
    function dmCu(ma) {
        return ums.api.call({ action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strMaBangDanhMuc: ma, silent: true })
            .then(function (r) { return arr(r.data); });
    }
    function taiCauHinh() {
        return dmCu('VNPAY.CAUHINHTHANHTOAN').then(function (ds) {
            st.choSua = '1';
            var c = ds.filter(function (x) { return x.MA === 'KHONGCHOPHEPSUASOTIEN'; })[0];
            if (c) st.choSua = e(c.THONGTIN1);
            return taiTaiChinh();
        }).catch(function (err) { ums.api.handle(err, 'cấu hình thanh toán'); });
    }
    function taiNganHang() {
        return dmCu('VNPAY.NGANHANG').then(function (ds) {
            st.dsNH = ds;
            pat.fill(f('nh'), ds, { id: 'MA', name: 'THONGTIN1' });
            if (ds.length === 1) { f('nh').value = ds[0].MA; if (window.jQuery) jQuery(f('nh')).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'danh sách ngân hàng'); });
    }
    function veSV(sv) {
        sv = sv || {};
        z('hoTen').textContent = e(sv.HOVATEN); z('maSV').textContent = e(sv.MASINHVIEN); z('ngaySinh').textContent = e(sv.NGAYSINH);
        z('lop').textContent = e(sv.LOP); z('nganh').textContent = e(sv.NGANH); z('khoa').textContent = e(sv.KHOADAOTAO);
    }
    function taiTaiChinh() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'TC_TCThanhToan/LayThongTinTaiChinh', method: 'GET', strMaSinhVien: st.svId, strMaNganHang: 'VNPAY', silent: true }).then(function (r) {
            var d = r.data || {};
            st.vanTin = d;
            st.rows = arr(d.rsChiTiet);
            var sv = arr(d.rsSinhVien)[0] || {};
            veSV(sv);
            st.maSV = e(sv.MASINHVIEN);
            veBang();
        }).catch(function (err) {
            st.vanTin = null; st.rows = []; st.maSV = ''; veSV(null); veBang();
            ui.toast('TC_TCThanhToan/LayThongTinTaiChinh : ' + err.message, 'warn');
        });
    }

    /* ---------- Bảng khoản thanh toán ---------------------------------- */
    function veBang() {
        var coBatBuoc = st.rows.some(function (r) { return Number(r.BATBUOC) === 1; });
        ui.table({
            el: z('bang'), rows: st.rows, empty: 'Không có khoản cần thanh toán',
            columns: [
                { title: 'Nội dung', prop: 'NOIDUNG', cls: 'is-center' },
                { title: 'Số tiền', cls: 'is-center', width: '190px', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm is-num" data-st="' + i + '" value="' + esc(pat.money(r.SOTIEN)) + '"' +
                        (st.choSua === '0' ? '' : ' disabled') + ' style="width:150px">';
                } },
                { title: 'Ghi chú', prop: 'GHICHU' },
                { head: coBatBuoc ? '' : '<input type="checkbox" data-chon="all" title="Chọn tất cả">', cls: 'is-center', width: '56px',
                  render: function (r, i) {
                      var bb = Number(r.BATBUOC) === 1;
                      return '<input type="checkbox" data-chon="' + i + '"' + (bb ? ' checked disabled' : '') + '>';
                  } }
            ]
        });
        tong();
    }
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-chon]:checked'), function (c) { return c.getAttribute('data-chon') !== 'all'; })
            .map(function (c) { return Number(c.getAttribute('data-chon')); });
    }
    function giaTri(i) { var el = z('bang').querySelector('[data-st="' + i + '"]'); return el ? soTien(el.value) : 0; }
    function tong() {
        var sum = daChon().reduce(function (s, i) { return s + giaTri(i); }, 0);
        z('daChon').innerHTML = st.rows.length ? 'Tổng tiền đã chọn: <b>' + esc(pat.money(sum)) + '</b>' : '';
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-chon]'), function (c) {
            var tr = c.closest('tr'); if (tr && c.getAttribute('data-chon') !== 'all') tr.classList.toggle('is-selected', c.checked);
        });
    }
    z('bang').addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.getAttribute('data-chon') === 'all') {
            Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-chon]:not([disabled])'), function (c) { if (c !== t) c.checked = t.checked; });
        }
        tong();
    });
    z('bang').addEventListener('input', function (ev) { if (ev.target.hasAttribute('data-st')) tong(); });
    z('bang').addEventListener('focusout', function (ev) {
        var t = ev.target;
        if (t.hasAttribute && t.hasAttribute('data-st') && t.value.trim()) t.value = pat.money(soTien(t.value));
    });

    /* ---------- Thanh toán --------------------------------------------- */
    function thanhToan() {
        var nh = f('nh').value;
        if (!nh) { ui.toast('Vui lòng chọn ngân hàng để thanh toán', 'warn'); return; }
        var chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn khoản cần thanh toán', 'warn'); return; }
        var ids = chon.map(function (i) { return st.rows[i].ID; });
        if ('#BIDV#SHB#VTB#VIB'.indexOf(nh) !== -1) { xacNhanDonHang(ids, chon); return; }
        ui.confirm('Bạn có chắc chắn thanh toán?', { title: 'Thanh toán' }).then(function (yes) {
            if (!yes) return;
            var noiDung = st.maSV + '_' + nh + '_' + ids.join('|');
            ums.api.call({ action: 'CTT_ThongTinKetNoi/KetNoiVNPAY', method: 'GET', versionAPI: 'v1.0',
                DonHangChiTietIds: ids.join('|'), SoTiens: chon.map(giaTri).join('|'), NoiDungs: noiDung, vnp_TmnCode: nh,
                MaDonHang_Gui_NganHang: e((arr(st.vanTin && st.vanTin.rs)[0] || {}).MADONHANG_GUI_NGANHANG),
                CreatedDate: e((arr(st.vanTin && st.vanTin.rs)[0] || {}).NGAYTAODONHANG) }).then(function (r) {
                if (r.data) window.location.replace(r.data);
            }).catch(function (err) { ums.api.handle(err, 'CTT_ThongTinKetNoi/KetNoiVNPAY'); });
        });
    }
    function xacNhanDonHang(ids, chon) {
        ums.api.call({ action: 'TC_TCThanhToan/XacNhanThanhToanDonHang', method: 'POST', strThanhToan_DonHang_CT_Id: ids.join(','), strNguoiThucHien_Id: uid() })
            .then(function (r) { st.maGD = r.data; layQR(r.data, chon); })
            .catch(function (err) { ums.api.handle(err, 'TC_TCThanhToan/XacNhanThanhToanDonHang'); });
    }
    function layQR(code, chon) {
        var rs = arr(st.vanTin && st.vanTin.rs)[0] || {};
        var maSV = e(rs.MASINHVIEN), hoTen = e(rs.HOVATEN), tkAo = e(rs.TKAO);
        var soTienQR = chon.reduce(function (s, i) { return s + soTien(st.rows[i].SOTIEN); }, 0);   // bản gốc cộng SOTIEN gốc, không lấy ô đã sửa
        var nh = f('nh').value;
        var dong = st.dsNH.filter(function (x) { return x.MA === nh; })[0] || {};
        var noiDung = khongDau(st.rows[chon[0]].NOIDUNG);
        var d = new Date(), y = d.getFullYear(), mo = hai(d.getMonth() + 1), dd = hai(d.getDate()), h = hai(d.getHours()), mi = hai(d.getMinutes()), s = hai(d.getSeconds());
        var val;
        switch (nh) {
            case 'BIDV': val = { serviceId: e(dong.THONGTIN2), code: code, name: maSV + ' ' + hoTen, amount: soTienQR.toString(), description: noiDung.replace(/_/g, ' ') }; break;
            case 'VTB': val = {
                requestId: uuid(), providerId: 'DHLAMNGHIEP', merchantId: '0500465853',
                clientDt: y + '-' + mo + '-' + dd + 'T' + h + ':' + mi + ':' + s + '.632Z',
                channel: 'internal', version: '0.0.1', language: 'en', clientIP: '',
                signature: 'JcJg4S7qF8G3B9OlJQoZsGx8dtyPDmsYKNub6hCZFh51tnnRG+1Up/R0mtmGWoOxsqGTdIWSdGwiqxrOvsRPH62Elz9JAYDT1RHphlemrmxcy+4YWihPYOEGIhn8kfCq+LiMKatort3xPDT6G4DTsVmnY29MyIkA/vgDe8br39v7kN6n7URuMWJzsEiO4xjmPk8ZUmobkTJrkxPgLAX+K9MTZ9xCg2iQNj3QInG/fzEo/3J+VhlN4uGl3wdgaaUontRc40GfqGFtyuS+gPsH84kyeMF8L3FRKyQ1WnqyhLsuM4hY2dd1H3g7kWghzXOPhrkYLUxQEB0gS0m8Sh3FNA==',
                data: { merchantName: 'DHLAMNGHIEP', terminalId: 'TDHLAMNGHIEP', productId: '', orderId: code, amount: soTienQR, payMethod: 'QR',
                    transactionDate: '' + y + mo + dd + h + mi + s, currencyCode: 'VND', remark: noiDung, transTime: '' + y + mo + dd + h + mi + s, imageSize: '200' }
            }; break;
            default: val = { strMaSinhVien: maSV, strHoVaTen: hoTen, strMaDonHang: code, strNoiDung: noiDung, strTaiKhoanAo: tkAo, strSoTien: soTienQR.toString() };
        }
        ums.api.call({ action: 'CTT_' + nh + 'Payment/VanTinQRCode', method: 'POST', strKey: '', strVal: JSON.stringify(val), strNguoiThucHien_Id: uid() }).then(function (r) {
            taiTaiChinh();
            var qr = docQR(nh, r.data);
            if (qr === null) return;
            if (!qr) { ui.toast('Không lấy được mã QR', 'warn'); return; }
            var dlg = ui.dialog({
                title: 'Quét mã để thanh toán', icon: 'fa-qrcode', size: 'sm',
                body: '<div class="tt-qr"><p>' + esc(code) + ' - ' + esc(pat.money(soTienQR)) + '</p><p>' + esc(maSV + ' - ' + hoTen) + '</p>' +
                    '<img alt="Mã QR" src="data:image/png;base64, ' + esc(qr) + '"><div data-z="kq" class="ums-u-muted ums-u-fz13">Đang chờ thanh toán…</div></div>'
            });
            setTimeout(function () { hoiGachNo(code, dlg); }, 10000);
        }).catch(function (err) { ums.api.handle(err, 'CTT_' + nh + 'Payment/VanTinQRCode'); });
    }
    /* Mỗi ngân hàng một khuôn phản hồi — chép nguyên cách bản gốc đọc. null = đã báo lỗi */
    function docQR(nh, data) {
        try {
            var o;
            switch (nh) {
                case 'BIDV':
                    o = JSON.parse(data);
                    if (o.errorCode) { if (o.errorCode === '000') return o.vietQRImage; bao(o.errorCode, o.errorDesc); return null; }
                    if (o.msg.header.errorCode === '000') return o.msg.body.vietQRImage;
                    bao(o.msg.header.errorCode, o.msg.header.errorDesc); return null;
                case 'VTB':
                    o = JSON.parse(data);
                    if (o.status.statusCode === '00') return o.data.qrData;
                    bao(o.status.statusCode, o.status.statusDesc); return null;
                case 'VIB':
                    o = JSON.parse(data);
                    if (o.Result.statusCode === '000000') return o.Result.DATA.qrImage;
                    bao(o.Result.statusCode, o.Result.message || ''); return null;
                default: return data;
            }
        } catch (ex) { ui.toast('Không đọc được phản hồi của ngân hàng: ' + ex.message, 'bad'); return null; }
    }
    function bao(ma, mota) { ui.toast('Lỗi :' + e(ma) + ' : ' + e(mota), 'bad'); }
    function hoiGachNo(code, dlg) {
        if (code !== st.maGD || dlg.closed || !document.body.contains(root)) return;
        ums.api.call({ action: 'TC_TCThanhToan/KiemTraGachNoTheoDonHang', method: 'GET', strMaDonHangTongHop: code, strNguoiThucHien_Id: uid(), silent: true }).then(function (r) {
            if (arr(r.data).length) {
                var kq = dlg.body.querySelector('[data-z="kq"]');
                if (kq) kq.innerHTML = '<b class="tt-ok">Thanh toán thành công</b>';
                st.maGD = '';
                taiTaiChinh();
            } else setTimeout(function () { hoiGachNo(code, dlg); }, 3000);
        }).catch(function (err) { ums.api.handle(err, 'kiểm tra gạch nợ'); });
    }

    /* ---------- Tra sinh viên ------------------------------------------ */
    function traSV() {
        var ma = f('ma').value.trim();
        if (!ma) { ui.toast('Bạn chưa nhập mã sinh viên', 'warn'); return; }
        ums.api.call({ action: 'SV_HoSo/LayDanhSach', method: 'GET', strTuKhoa: ma, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 }).then(function (r) {
            var ds = arr(r.data);
            if (!ds.length) { ui.toast('Không tìm thấy sinh viên', 'warn'); return; }
            st.svId = ds.length === 1 ? ds[0].ID : '';
            st.maSV = e(ds[0].MASO);
            taiCauHinh(); taiNganHang();
        }).catch(function (err) { ums.api.handle(err, 'tra sinh viên'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'search') traSV();
        else if (b.getAttribute('data-a') === 'tt') thanhToan();
    });
    f('ma').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); traSV(); } });

    taiCauHinh();
    taiNganHang();
})();
