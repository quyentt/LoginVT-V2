/* =========================================================================
   Lịch giảng — yêu cầu đổi lịch (ums.lg.doiLich)
   Bản gốc: lichgiang.js — #modalDoiLich, #modalXemLich, #modalPheDuyet, #tblDoiLich
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên) — controller KHCT_LichGiang_DoiLich:
       LayDSLichGiang_Doi_ThongTinCaNhan (GET)    danh sách của giảng viên (lichgiang)
       LayDSLichGiang_Doi_PhamVi (GET)            danh sách theo phạm vi (lichgiangadmin)
       LayTTLichGiang_Doi (GET)                   xem một yêu cầu
       KhoiTaoThongTinYeuCauDoiLich (GET)         bấm "Yêu cầu đổi lịch" trên một buổi
                                                  → { rsThongTinChung, rsGiangVien, rsDanhMucPhong, rsDanhMucGiangVien }
       KiemTraLichCanDoi (GET) / GuiYeuCauDoiLich (POST)   cùng bộ tham số
       Them_TKB_XacNhanDoiLich (POST)             phê duyệt (quản trị) — trạng thái: danh mục TKB.LICHGIANG.XACNHANDOILICH
       Xoa_LichGiang_Doi_ThongTin (POST)          xoá (giảng viên)
   Kéo gốc lần 12–13 (2/11, 7/11) — hộp "Yêu cầu đổi lịch" MỚI của gốc (doilich_modal.js + LichGiangNhieuPhong.bindDoiLich /
   initDoiLichRieng, dùng cho CẢ HAI màn lichgiang và lichgiangnhieuphonghoc) → thêm các lời gọi:
       NS_ThongTinCanBo/LayDSLichGiang (GET)      lịch dạy của TỪNG giảng viên của lớp trong tuần đang xem (strNhanSu_HoSoCanBo_Id = ID giảng viên)
       NS_ThongTinCanBo_MH · PKG_CONGTHONGTINCANBO.LayDSToaNha      ô "Tòa nhà" lọc phòng
       NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayDSPhongHoc    phòng của tòa đang lọc (strTKB_ToaNha_Id) + toàn bộ phòng (sức chứa / loại phòng)
       CC_GiangVien_TuGhiNhan/LayChiTiet (GET)    sĩ số lớp (TONGSOSV) → sức chứa tối thiểu mặc định khi lọc phòng
       SV_TKB_Chung_MH · TKB_CHUNG.LAYPHONGHOCTRONG   phòng trống ở ngày / tiết mới (màn không truyền cb.locPhong thì hộp tự hỏi)
       KiemTraLichCanDoi (GET)                    gọi thêm cho TỪNG Ô của lưới tuần (ô xanh = đổi được) — "sếp 03/11: 1 tuần để for thôi"
   Giữ như bản gốc: Thứ / giờ / phút "đổi sang" luôn gửi rỗng (màn chỉ đổi ngày, tiết, phòng, giảng viên).
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Kiểm tra lịch không hợp lệ: bản gốc cũ gọi edu.system.returnEmpty (không tồn tại) → lỗi JS. Ở đây hiện THONGTINLOI.
     · Gửi / xoá xong đóng hộp và nạp lại danh sách (bản gốc để hộp mở).
     · Hộp Phê duyệt: bản gốc đóng hộp trước khi hỏi lại (nút mang data-bs-dismiss).
   Pull 29/9 — khoiTao(buổi, sauKhiGui, o) nhận thêm o (màn Lịch giảng đường đổi lịch vào ô trống);
   không truyền o thì chạy y như trước:
       o.chuanBi(data, buổi) → { ngay, tbd, tkt, phong, dsPhong, tenPhong(p), goiY, canhBao: [chữ], kiem(v) → chữ lỗi | '' }
                               giá trị điền sẵn cho các ô "Đổi sang", danh mục phòng đã lọc, dòng cảnh báo,
                               hàm chặn trước khi Kiểm tra / Gửi (v = { ngay, tbd, tkt, phong })
       o.batBuoc: true         (từ kéo gốc lần 12–13 LUÔN bắt nhập đủ ngày, tiết, phòng mới — gốc mới kiemTraNhapDoiLich chung cho cả hai màn; cờ giữ để tương thích)
       o.thongBao              câu báo khi gửi xong · o.onDong()  gọi khi khung đóng hoặc không mở được
       o.host                  gốc màn → biểu mẫu mở TRONG TRANG thay chỗ lịch (ums.pat.formTrang, BO-CUC luật 1);
                               không truyền thì bật hộp thoại như trước (giữ tương thích)
   Kéo gốc 30/9–1/10 — o.chuanBi có thể trả thêm (không trả thì như trước):
       cb.locPhong(v) → Promise<{ ds?: [phòng], goiY: chữ, khung?: 'T4-6 ngày dd/mm/yyyy', loai?: 'lý thuyết (LT)' }>   v = { ngay, tbd, tkt }
                               gọi lúc mở và mỗi khi đổi ngày / tiết (chờ 400 ms cho gõ xong, kết quả lượt cũ bị bỏ):
                               có ds thì ô "Đổi sang" phòng chỉ còn các phòng đó (giữ phòng đang chọn nếu còn) — màn Lịch giảng đường hỏi máy chủ
                               phòng TRỐNG ở ngày / tiết mới. Không truyền cb.locPhong → hộp tự hỏi LAYPHONGHOCTRONG (gốc mới làm vậy ở cả lichgiang)
       cb.gioTiet(t, ketThuc) → { gio, phut } | null   giờ của tiết để ghi lên lưới và hỏi phòng trống; không truyền thì theo khung chuẩn 50 phút / tiết
   Kéo gốc lần 12–13 (2/11, 7/11) — bố cục MỚI (theo doilich_modal.js của gốc), áp cho mọi màn gọi khoiTao:
     · Hai cột (≥ 992px): trái = "Buổi học hiện tại" + LƯỚI TUẦN 15 tiết × 7 ngày chọn thời gian mới; phải = "Đổi sang" (ngày, tiết, lọc phòng
       theo Tòa nhà + Sức chứa từ (mặc định = sĩ số lớp, tick "Bỏ qua SC" thì không lọc), phòng, giảng viên dạy thay, nội dung, kết quả kiểm tra).
     · Lưới: ô ĐỎ = giảng viên của lớp (hoặc người dạy thay đã chọn) bận, ô XÁM = ngày đã qua / không đủ tiết liên tiếp / buổi vắt qua ca,
       ô CAM = buổi hiện tại; ô còn lại hỏi KiemTraLichCanDoi từng ô với phòng đang chọn (chưa chọn thì phòng cũ) → XANH ĐẬM = đổi được,
       VÀNG = vướng (rê chuột xem lý do, vẫn chọn được để đổi phòng khác). Tối đa 120 ô, 5 lời gọi cùng lúc, nhớ 5 phút theo ô + phòng + giảng viên,
       3 lỗi liên tiếp thì dừng (nút "Kiểm tra lại" chỉ gọi lại ô lỗi). Tuần trước / sau, ô ngày "tới tuần chứa ngày", "Tuần của buổi học".
       Rê chuột xem trước cả khối tiết; bấm ô → điền ngày + tiết (kết thúc = bắt đầu + số tiết của buổi − 1) → tự tìm phòng trống; gõ tay ngày /
       tiết → lưới tô lại (ngày tuần khác thì nhảy tuần). Chọn phòng xong tự kiểm tra trùng lịch (300 ms) và kiểm lại các ô theo phòng mới.
     · Mã quy tắc máy chủ trả trong Message (BanKhongDuocPhepXepVuotQuaCaSang / …Chieu) → câu tiếng Việt; mã lạ giữ nguyên để còn tra.
     · Phòng máy / thực hành: cột KIEUPHONG của máy chủ vẫn là LT với "A6-605 (PC)", "B4-203 (TH)" → nhận qua tên, coi là TH (lg.doiLich.loaiPhong).
     · Kiểm tra nhập: tiết trong T1–T15, kết thúc ≥ bắt đầu; kết quả kiểm tra / lỗi gửi hiện NGAY TRONG hộp (gốc mới cũng vậy — trước đây toast).
     · o.luoi: false   tắt cột lưới (chỉ còn biểu mẫu một cột) — không màn nào dùng, giữ làm lối thoát.
     · Lời gọi phụ (tòa nhà, phòng, sĩ số, lịch giảng viên) lỗi thì hộp vẫn chạy, chỉ thiếu nhãn / bộ lọc tương ứng (fail-open như gốc).
   Kéo gốc lần 12–13 — bỏ: CSS Bootstrap của modal, select2 dropdownParent, console.log; "Cố ý bỏ": me.objCachePhong / dtPhongHocOriginal
     (ở đây tra một danh sách phòng toàn trường đã nhớ 5 phút). CSS của hộp ở css/doilich.css, tệp này tự nạp.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var lg = ums.lg = ums.lg || {};
    var C = 'KHCT_LichGiang_DoiLich/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function oChu(label, v, attr) { return ui.field(label, '<input class="ums-input" ' + (attr || 'disabled') + ' value="' + esc(e(v)) + '" autocomplete="off">'); }
    function gocCua(r) {
        return { strNguoiThucHien_Id: uid(), strIdLichHoc: e(r.IDLICHHOC), strIdHocPhan: e(r.IDHOCPHAN), strIdPhongHoc: e(r.IDPHONGHOC), strIdLopHocPhan: e(r.IDLOPHOCPHAN),
            strNgayHoc: e(r.NGAYHOC), strThu: e(r.THUHOC), strTietBatDau: e(r.TIETBATDAU), strTietKetThuc: e(r.TIETKETTHUC), strGioBatDau: e(r.GIOBATDAU),
            strPhutBatDau: e(r.PHUTBATDAU), strGioKetThuc: e(r.GIOKETTHUC), strPhutKetThuc: e(r.PHUTKETTHUC) };
    }

    /* ---------- CSS của hộp: tự nạp một lần (css/doilich.css cạnh tệp này) ---------- */
    (function napCss() {
        if (document.querySelector('link[data-ums-css="lg-doilich"]')) return;
        var s = document.currentScript || Array.prototype.filter.call(document.scripts, function (x) { return /_lichgiang_doilich\.js/.test(x.src); }).pop();
        if (!s || !s.src) return;
        var u = new URL('../css/doilich.css', s.src);
        if (ums.ban) u.searchParams.set('v', String(ums.ban));
        var l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = u.href; l.setAttribute('data-ums-css', 'lg-doilich');
        document.head.appendChild(l);
    })();

    /* ---------- Tiện ích cho lưới tuần / lọc phòng (kéo gốc lần 12–13) ---------- */
    var HAN_NHO = 5 * 60 * 1000, nho = {}, dangGoi = {};
    /* Nhớ 5 phút + lời gọi trùng đang chờ dùng chung (goiMotLan + iCacheTTL của gốc); lỗi không nhớ */
    function goiNho(k, fn) {
        var c = nho[k];
        if (c && Date.now() - c.t < HAN_NHO) return Promise.resolve(c.d);
        if (dangGoi[k]) return dangGoi[k];
        dangGoi[k] = fn().then(function (d) { nho[k] = { t: Date.now(), d: d }; delete dangGoi[k]; return d; }, function (err) { delete dangGoi[k]; throw err; });
        return dangGoi[k];
    }
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function dmy(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function parse(s) { var p = String(s || '').split('/'), d = p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]) : null; return d && !isNaN(d.getTime()) ? d : null; }
    var THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    function thu(s) { var d = parse(s); return d ? THU[d.getDay()] : ''; }
    function thuHai(d) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
    /* getKhoangTiet của gốc: thiếu tiết thì ước theo giờ; null nếu không xác định được tiết bắt đầu */
    function khoangTiet(r) {
        var a = r.TIETBATDAU, b = r.TIETKETTHUC, g;
        if (!a && r.GIOBATDAU !== null && r.GIOBATDAU !== undefined && r.GIOBATDAU !== '') { g = +r.GIOBATDAU; a = g < 13 ? Math.max(1, Math.min(6, g - 6)) : g < 19 ? Math.max(7, Math.min(12, g - 6)) : Math.max(13, Math.min(15, g - 6)); }
        if (!b && r.GIOKETTHUC !== null && r.GIOKETTHUC !== undefined && r.GIOKETTHUC !== '') { g = +r.GIOKETTHUC; b = g <= 12 ? Math.max(1, Math.min(6, g - 6)) : g <= 18 ? Math.max(7, Math.min(12, g - 6)) : Math.max(13, Math.min(15, g - 6)); }
        var tu = parseInt(a, 10), den = parseInt(b, 10);
        if (isNaN(tu)) return null;
        if (isNaN(den) || den < tu) den = tu;
        return { tu: tu, den: den };
    }
    /* arrGioTiet của gốc: giờ bắt đầu chuẩn của từng tiết, mỗi tiết 50 phút */
    var GIO_TIET = [[6, 45], [7, 40], [8, 35], [9, 30], [10, 25], [11, 20], [13, 0], [13, 55], [14, 50], [15, 45], [16, 40], [17, 35], [18, 30], [19, 25], [20, 20]];
    function gioTietChuan(t, ketThuc) {
        if (!(t >= 1 && t <= 15)) return null;
        var g = GIO_TIET[t - 1], p = g[0] * 60 + g[1] + (ketThuc ? 50 : 0);
        return { gio: Math.floor(p / 60), phut: p % 60 };
    }
    /* getSucChua của gốc */
    var COT_SUC_CHUA = ['SUCCHUAHOC', 'SUCCHUA', 'SUC_CHUA', 'SUCCHUA_HOC', 'SOCHOHOC', 'SOCHO', 'SOCHONGOI', 'SOLUONGCHO', 'SOLUONG'];
    function sucChua(p) {
        for (var i = 0; i < COT_SUC_CHUA.length; i++) { var v = p[COT_SUC_CHUA[i]]; if (v !== undefined && v !== null && v !== '' && !isNaN(v)) return parseInt(v, 10); }
        var m = /\((\d+)\)\s*$/.exec(e(p.TEN));
        return m ? parseInt(m[1], 10) : null;
    }
    /* getLoaiPhongDoi của gốc: phòng máy "(PC)" / "(TH)" có KIEUPHONG = LT trong dữ liệu máy chủ → nhận qua tên, coi là TH */
    var MAU_PHONG_MAY = [/\(\s*PC\s*\)/i, /\(\s*TH\s*\)/i];
    function loaiPhong(p) {
        if (!p) return '';
        var t = e(p.TEN) + ' ' + e(p.TENPHONGHOC);
        if (MAU_PHONG_MAY.some(function (re) { return re.test(t); })) return 'TH';
        return String(e(p.KIEUPHONG)).toUpperCase();
    }
    function tenLoai(k) { return k === 'TH' ? 'thực hành (TH)' : k === 'LT' ? 'lý thuyết (LT)' : k; }
    function tenGV(g) { return e(g.HODEM) + ' ' + e(g.TEN) + ' - ' + e(g.MASO); }
    function tenGVNgan(g) { return (e(g.HODEM) + ' ' + e(g.TEN)).trim() || e(g.MASO) || 'Giảng viên'; }
    function layToaNha() {
        return goiNho('toa', function () {
            return ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4BRIVLiAPKSAP', func: 'PKG_CONGTHONGTINCANBO.LayDSToaNha', silent: true }).then(function (r) { return arr(r.data); });
        });
    }
    function layPhong(toa) {
        toa = toa || '';
        return goiNho('phong|' + toa, function () {
            return ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4BRIRKS4vJgkuIgPP', func: 'pkg_congthongtincanbo.LayDSPhongHoc', silent: true, strTKB_ToaNha_Id: toa }).then(function (r) { return arr(r.data); });
        });
    }
    /* Lịch dạy của một giảng viên trong khoảng ngày — cùng lời gọi màn Lịch giảng dùng cho người đăng nhập */
    function lichGV(id, bd, kt) {
        return goiNho('gv|' + id + '|' + bd + '|' + kt, function () {
            return ums.api.call({ action: 'NS_ThongTinCanBo/LayDSLichGiang', method: 'GET', silent: true, strNhanSu_HoSoCanBo_Id: id, strNgayBatDau: bd, strNgayKetThuc: kt, strNgayDangChon: bd })
                .then(function (r) { return arr(r.data); });
        });
    }
    /* Sĩ số lớp (TONGSOSV) — cùng lời gọi chi tiết điểm danh; null khi lỗi / không có */
    function siSoLop(r) {
        var id = e(r.IDLOPHOCPHAN);
        if (!id) return Promise.resolve(null);
        return goiNho('siso|' + id, function () {
            return ums.api.call({ action: 'CC_GiangVien_TuGhiNhan/LayChiTiet', method: 'GET', silent: true, strNgayGhiNhan: e(r.NGAYHOC), strGio: e(r.GIOBATDAU), strPhut: e(r.PHUTBATDAU), strGiay: '', strDaoTao_LopHocPhan_Id: id })
                .then(function (x) { var d = arr(x.data)[0], n = d ? parseInt(d.TONGSOSV, 10) : NaN; return isNaN(n) || n <= 0 ? null : n; });
        }).catch(function () { return null; });
    }
    /* Phòng trống một ngày + khung giờ (TKB_CHUNG.LAYPHONGHOCTRONG) — dùng khi màn không truyền cb.locPhong. strKieuPhong gửi rỗng (kéo gốc 6/10) */
    function phongTrong(ngay, bd, kt, boQua) {
        return ums.api.call({ action: 'SV_TKB_Chung_MH/DQAYEQkODwYJDgIVEw4PBgPP', func: 'TKB_CHUNG.LAYPHONGHOCTRONG', silent: true, strNgay: ngay,
            dGioBatDau: bd.gio, dPhutBatDau: bd.phut, dGioKetThuc: kt.gio, dPhutKetThuc: kt.phut, strKieuPhong: '',
            dSucChuaTu: null, dSucChuaDen: null, dIdToaNha: null, strIdLichBoQua: boQua || '' }).then(function (r) { return arr(r.data); });
    }
    function idTrong(r) { return String(e(r.ID) || e(r.IDPHONGHOC) || e(r.TKB_PHONGHOC_ID)); }
    /* Mã quy tắc máy chủ trả trong Message (Success = false) → câu tiếng Việt; mã lạ giữ nguyên để còn tra */
    var MA_LOI = {
        BanKhongDuocPhepXepVuotQuaCaSang: 'Buổi học vắt qua ca sáng — không được xếp vượt ca (chọn tiết bắt đầu sao cho cả buổi nằm trong 1 ca)',
        BanKhongDuocPhepXepVuotQuaCaChieu: 'Buổi học vắt qua ca chiều — không được xếp vượt ca (chọn tiết bắt đầu sao cho cả buổi nằm trong 1 ca)'
    };
    function dichMaLoi(s) { s = String(e(s)); return MA_LOI[s] || s; }
    function laMaQuyTac(s) { return /^[A-Za-z][A-Za-z0-9_]*$/.test(String(e(s))); }
    /* Ô ngày có flatpickr → đặt qua flatpickr (không bắn change), không thì gán thẳng */
    function datNgay(el, s) {
        if (!el) return;
        if (el._flatpickr) { if (s) el._flatpickr.setDate(s, false); else el._flatpickr.clear(false); }
        else el.value = s || '';
    }
    function ban(el, loai) { el.dispatchEvent(new Event(loai || 'change', { bubbles: true })); }

    var host = null, laAdmin = false, ds = [];
    function danhSach(h, admin) {
        host = h; laAdmin = admin;
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var call = admin
            ? { action: C + 'LayDSLichGiang_Doi_PhamVi', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }
            : { action: C + 'LayDSLichGiang_Doi_ThongTinCaNhan', method: 'GET', strNguoiThucHien_Id: uid() };
        ums.api.call(call).then(function (r) {
            ds = arr(r.data);
            host.innerHTML = ds.length ? '<div class="lg-dl">' + ds.map(function (x, i) {
                return '<button type="button" class="lg-dl__muc" data-dl="' + i + '"><b>Lớp: ' + esc(e(x.LOPHOCPHAN_TEN)) + '</b><span>Trạng thái: ' + esc(e(x.KETQUAXULY)) + '</span></button>';
            }).join('') + '</div>' : ui.empty('Chưa có yêu cầu đổi lịch', 'fa-calendar-pen');
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách đổi lịch'); });
    }
    document.addEventListener('click', function (ev) {
        var b = host && ev.target.closest('[data-dl]');
        if (!b || !host.contains(b)) return;
        xem(ds[Number(b.getAttribute('data-dl'))]);
    });
    function reload() { if (host) danhSach(host, laAdmin); }

    /* ---------- Xem một yêu cầu --------------------------------------- */
    /* o.nut = [{ text, kind, mod, disabled, onClick(item, dlg) }] — nút riêng của màn gọi
       (lichgiangdaotao / lichgiangkhoa); không truyền thì nút Phê duyệt / Xóa như lichgiang. */
    function xem(item, o) {
        o = o || {};
        ums.api.call({ action: C + 'LayTTLichGiang_Doi', method: 'GET', strNguoiThucHien_Id: uid(), strId: item.ID }).then(function (r) {
            var d = arr(r.data);
            if (!d.length) { ui.toast('Không có dữ liệu yêu cầu', 'warn'); return; }
            var x = d[0];
            var dlg = ui.dialog({
                title: 'Yêu cầu đổi lịch', icon: 'fa-calendar-pen', size: 'lg',
                body: '<div class="ums-grid ums-grid--2">' +
                    '<div style="grid-column:1 / -1">' + ui.field('Nội dung', '<textarea class="ums-input" rows="3" disabled>' + esc(e(x.NOIDUNG)) + '</textarea>') + '</div>' +
                    '<div style="grid-column:1 / -1">' + oChu('Tên lớp học phần', x.LOPHOCPHAN_TEN) + '</div>' +
                    oChu('Ngày học', x.NGAYHOC) + oChu('Đổi sang', x.NGAYHOC_THAYDOI) +
                    oChu('Tiết bắt đầu', x.TIETBATDAU) + oChu('Đổi sang', x.TIETBATDAU_THAYDOI) +
                    oChu('Tiết kết thúc', x.TIETKETTHUC) + oChu('Đổi sang', x.TIETKETTHUC_THAYDOI) +
                    oChu('Phòng học', x.PHONGHOC_TEN) + oChu('Đổi sang', x.PHONGHOC_THAYDOI_TEN) +
                    '</div><div class="ums-legend ums-legend--cach">Giảng viên</div>' +
                    '<div class="ums-grid ums-grid--2">' + d.map(function (g) { return oChu('Giảng viên', g.GIANGVIEN_HOVATEN) + oChu('Đổi sang', g.GIANGVIEN_THAYDOI_HOVATEN); }).join('') + '</div>',
                buttons: o.nut ? o.nut.map(function (b) {
                    return { text: b.text, kind: b.kind, mod: b.mod, onClick: function () { if (b.onClick && !b.disabled) b.onClick(item, dlg); return false; } };
                }) : [laAdmin
                    ? { text: 'Phê duyệt', kind: 'save', onClick: function () { pheDuyet(item, dlg); return false; } }
                    : { text: 'Xóa', kind: 'del', onClick: function () { xoa(item, dlg); return false; } }]
            });
            (o.nut || []).forEach(function (b, i) {
                var el = dlg.el.querySelector('[data-dlg="' + i + '"]');
                if (b.disabled && el) { el.disabled = true; el.title = b.title || 'Chưa có chức năng'; }
            });
        }).catch(function (err) { ums.api.handle(err, 'xem yêu cầu đổi lịch'); });
    }
    function pheDuyet(item, dlgXem) {
        var dlg = ui.dialog({ title: 'Phê duyệt', icon: 'fa-stamp', size: 'sm',
            body: ui.field('Trạng thái', '<select class="ums-select" data-pd="tt" data-ph="Chọn trạng thái"><option value=""></option></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                var tt = dlg.body.querySelector('[data-pd="tt"]').value;
                if (!tt) { ui.toast('Chọn trạng thái phê duyệt', 'warn'); return false; }
                ui.confirm('Bạn có chắc chắn phê duyệt không?', { title: 'Phê duyệt' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: C + 'Them_TKB_XacNhanDoiLich', method: 'POST', strSanPham_Id: item.ID, strNguoiXacnhan_Id: uid(), strNoiDung: '', strTinhTrang_Id: tt })
                        .then(function () { ui.toast('Phê duyệt thành công', 'ok'); dlg.close(); dlgXem.close(); reload(); });
                }).catch(function (err) { ums.api.handle(err, 'phê duyệt'); });
                return false;
            } }] });
        ui.enhance(dlg.body);
        ums.api.dm('TKB.LICHGIANG.XACNHANDOILICH').then(function (d) { pat.fill(dlg.body.querySelector('[data-pd="tt"]'), d, { name: 'TEN' }); }).catch(function () {});
    }
    function xoa(item, dlgXem) {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá yêu cầu đổi lịch' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: C + 'Xoa_LichGiang_Doi_ThongTin', method: 'POST', strIds: item.ID, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); dlgXem.close(); reload(); });
        }).catch(function (err) { ums.api.handle(err, 'xoá yêu cầu'); });
    }

    /* ---------- Tạo yêu cầu từ một buổi ------------------------------- */
    var MAX_KIEM_O = 120, SONG_SONG = 5, LOI_LIEN_TIEP = 3;      // iMaxKiemO, iMaxConcurrent, iLoiLienTiepToiDa của gốc
    function khoiTao(r, sauKhiGui, o) {
        o = o || {};
        var goc = gocCua(r), luoi = o.luoi !== false;
        ums.api.call(Object.assign({ action: C + 'KhoiTaoThongTinYeuCauDoiLich', method: 'GET' }, goc)).then(function (x) {
            var d = x.data || {}, tt = arr(d.rsThongTinChung)[0] || {}, dsGV = arr(d.rsGiangVien), phong = arr(d.rsDanhMucPhong), dmGV = arr(d.rsDanhMucGiangVien);
            var cb = o.chuanBi ? (o.chuanBi(d, r) || {}) : null;
            if (cb) {
                tt = Object.assign({}, tt, { NGAYHOC_THAYDOI: e(cb.ngay), TIETBATDAU_THAYDOI: e(cb.tbd), TIETKETTHUC_THAYDOI: e(cb.tkt), IDPHONGHOC_THAYDOI: e(cb.phong) });
                if (cb.dsPhong) phong = cb.dsPhong;
            }
            var gioTiet = cb && cb.gioTiet ? cb.gioTiet : gioTietChuan;
            var k0 = khoangTiet(r);                                   // tiết của buổi hiện tại
            var tokLuoi = 0, tokKiem = 0, tokKT = 0, tokPT = 0, formSan = false, tuan = '', ngayTuan = [], banGV = {}, gvKhongDoiChieu = [], soTiet = k0 ? Math.max(1, k0.den - k0.tu + 1) : 3;
            var dsPhongTrong = null, khungPhong = '', loaiPhongMoi = '', siSo = null, toaChon = '', phongToa = null, phongTatCa = [];

            var cuHtml = '<div class="lgdl__cu"><small>Buổi học hiện tại</small><b>' + esc(e(tt.LOPHOCPHAN_TEN) || (e(r.TENHOCPHAN) + (r.TENLOPHOCPHAN ? ' · Lớp: ' + e(r.TENLOPHOCPHAN) : ''))) + '</b>' +
                '<span>' + esc(thu(e(tt.NGAYHOC) || e(r.NGAYHOC)) + ' ' + (e(tt.NGAYHOC) || e(r.NGAYHOC)) + ' · Tiết ' + e(tt.TIETBATDAU || r.TIETBATDAU) + '-' + e(tt.TIETKETTHUC || r.TIETKETTHUC) + ' · Phòng ' + (e(tt.PHONGHOC_TEN) || e(r.TENPHONGHOC) || '?')) + '</span>' +
                (dsGV.length ? '<span>GV: ' + esc(dsGV.map(tenGVNgan).join(', ')) + '</span>' : '') + '</div>';
            var traiHtml = '<div class="lgdl__trai">' + cuHtml +
                '<div class="lgdl__luoidau"><b><i class="fa-light fa-table-cells"></i> Chọn thời gian mới</b><div class="lgdl__tuan">' +
                    '<button type="button" class="ums-iconbtn" data-dla="tuan-1" title="Tuần trước"><i class="fa-light fa-chevron-left"></i></button>' +
                    '<span data-dlz="tuan"></span>' +
                    '<button type="button" class="ums-iconbtn" data-dla="tuan1" title="Tuần sau"><i class="fa-light fa-chevron-right"></i></button>' +
                    '<div class="ums-inputwrap"><input class="ums-input" data-dlf="dentuan" data-date data-range="off" placeholder="Tới tuần của ngày…" title="Chọn một ngày để chuyển tới tuần chứa ngày đó" autocomplete="off"><i class="fa-light fa-calendar"></i></div>' +
                    ui.btn('search', { text: 'Tuần của buổi học', icon: 'fa-calendar-check', mod: 'out-primary', attr: { 'data-dla': 'tuancu', title: 'Quay về tuần của buổi học hiện tại' } }) +
                '</div></div>' +
                '<div class="lgdl__chuthich"><span><i class="is-doiduoc"></i>Đổi được — bấm để chọn</span><span><i class="is-vuong"></i>Vướng (sinh viên / phòng…) — rê chuột xem lý do</span>' +
                    '<span><i class="is-ban"></i>Giảng viên bận</span><span><i class="is-hientai"></i>Buổi học hiện tại</span><span><i class="is-chon"></i>Đã chọn</span></div>' +
                '<div class="lgdl__tiendo" data-dlz="tiendo"></div><div class="lgdl__canhbao" data-dlz="luoicanhbao" hidden></div>' +
                '<div class="lgdl__bang" data-dlz="bang"></div><div class="lgdl__ghichu" data-dlz="ghichu"></div></div>';
            var phaiHtml = '<div class="lgdl__phai"><div class="ums-legend">Đổi sang</div>' +
                '<div class="lgdl__3">' +
                    ui.field('Ngày học', '<div class="ums-inputwrap"><input class="ums-input" data-dlf="ngay" data-date placeholder="dd/mm/yyyy" value="' + esc(e(tt.NGAYHOC_THAYDOI)) + '" autocomplete="off"><i class="fa-light fa-calendar"></i></div>') +
                    ui.field('Tiết bắt đầu', '<input type="number" min="1" max="15" class="ums-input" data-dlf="tbd" value="' + esc(e(tt.TIETBATDAU_THAYDOI)) + '" autocomplete="off">') +
                    ui.field('Tiết kết thúc', '<input type="number" min="1" max="15" class="ums-input" data-dlf="tkt" value="' + esc(e(tt.TIETKETTHUC_THAYDOI)) + '" autocomplete="off">') +
                '</div><div class="lgdl__loc">' +
                    ui.field('Tòa nhà', '<select class="ums-select" data-dlf="toa" data-ph="Tất cả tòa nhà"><option value="">Tất cả tòa nhà</option></select>') +
                    ui.field('Sức chứa từ', '<input type="number" min="0" class="ums-input" data-dlf="sctu" placeholder="VD: 40" autocomplete="off">') +
                    '<label class="ums-check lgdl__boqua" title="Không lọc phòng theo sức chứa / sĩ số lớp"><input type="checkbox" data-dlf="boqua"><span>Bỏ qua SC</span></label>' +
                '</div>' +
                ui.field('Phòng học', '<select class="ums-select" data-dlf="phong" data-ph="Chọn phòng học"><option value=""></option></select>', { hint: (cb && cb.goiY) || ' ' }) +
                (dsGV.length ? '<div class="ums-grid ums-grid--2">' + dsGV.map(function (g, i) {
                    return oChu('Giảng viên', tenGV(g)) + ui.field('Đổi sang', '<select class="ums-select" data-gv="' + i + '" data-ph="Chọn giảng viên"><option value=""></option></select>');
                }).join('') + '</div>' : '') +
                ui.field('Nội dung xin đổi lịch', '<textarea class="ums-input" rows="2" data-dlf="nd" placeholder="VD: Bận công tác, trùng lịch họp...">' + esc(e(tt.NOIDUNG)) + '</textarea>') +
                '<div class="lgdl__ketqua" data-dlz="ketqua" hidden></div></div>';
            var dlg = (o.host ? pat.formTrang : ui.dialog)({
                host: o.host, cols: 1, title: 'Yêu cầu đổi lịch', icon: 'fa-calendar-pen', size: 'xl',
                onClose: function () { tokKiem++; tokLuoi++; if (o.onDong) o.onDong(); },
                body: (cb && cb.canhBao && cb.canhBao.length ? '<div class="lg-canhbao"><i class="fa-light fa-triangle-exclamation"></i><div>' + cb.canhBao.map(esc).join('<br>') + '</div></div>' : '') +
                    '<div class="lgdl' + (luoi ? '' : ' lgdl--mot') + '">' + (luoi ? traiHtml : '') + phaiHtml + '</div>',
                buttons: [
                    { text: 'Kiểm tra lịch trùng', kind: 'search', mod: 'out-primary', onClick: function () { gui(true); return false; } },
                    { text: 'Gửi yêu cầu', kind: 'save', onClick: function () { gui(false); return false; } }
                ]
            });
            var B = dlg.body;
            function q(k) { return B.querySelector('[data-dlf="' + k + '"]'); }
            function z(k) { return B.querySelector('[data-dlz="' + k + '"]'); }
            function oLuoi(ngay, t) { return B.querySelector('.lgdl__o[data-ngay="' + ngay + '"][data-tiet="' + t + '"]'); }
            var hint = q('phong').closest('.ums-field__control').querySelector('.ums-field__hint');
            function goiYPhong(s) { hint.textContent = s || ''; }
            function ketQua(loai, nd) {
                var el = z('ketqua');
                if (!loai) { el.hidden = true; return; }
                el.className = 'lgdl__ketqua' + (loai === 'ok' ? ' is-ok' : loai === 'loi' ? ' is-loi' : '');
                el.innerHTML = '<i class="fa-light ' + (loai === 'ok' ? 'fa-circle-check' : loai === 'loi' ? 'fa-circle-exclamation' : 'fa-spinner fa-spin') + '"></i><span></span>';
                el.querySelector('span').textContent = nd;
                el.hidden = false;
            }

            /* ---- Ô phòng: danh mục cùng loại (BE) → phòng trống ở ngày / tiết mới → lọc sức chứa + tòa nhà ---- */
            function tenPhongHien(p) {
                if (cb && cb.tenPhong) return cb.tenPhong(p);
                var x = phongTatCa.filter(function (y) { return String(y.ID) === String(p.ID); })[0], sc = x ? sucChua(x) : null, lo = x ? loaiPhong(x) : '';
                return (e(p.TENPHONGHOC) || e(p.MA) || e(p.TEN)) + (sc !== null ? ' · ' + sc + ' chỗ' : '') + (lo ? ' · ' + lo : '');
            }
            /* veLaiComboPhongDoi của gốc: sức chứa tối thiểu = số nhập tay, hoặc sĩ số lớp (trừ khi "Bỏ qua SC"); phòng chưa rõ sức chứa giữ lại khi lọc tự động */
            function veLaiCombo(chonMoi) {
                var dtGoc = dsPhongTrong || phong, nhap = parseInt(q('sctu').value, 10);
                var tuDong = isNaN(nhap) && !q('boqua').checked && siSo > 0, min = !isNaN(nhap) ? nhap : (tuDong ? siSo : NaN);
                var phongCu = String(e(r.IDPHONGHOC));
                var dt = isNaN(min) ? dtGoc : dtGoc.filter(function (p) {
                    var x = phongTatCa.filter(function (y) { return String(y.ID) === String(p.ID); })[0], sc = x ? sucChua(x) : null;
                    if (tuDong) return sc === null || sc >= min || String(p.ID) === phongCu;
                    return sc !== null && sc >= min;
                });
                if (phongToa) dt = dt.filter(function (p) { return phongToa[String(p.ID)]; });
                var chon = chonMoi !== undefined ? chonMoi : q('phong').value;
                pat.fill(q('phong'), dt, { name: tenPhongHien });
                q('phong').value = dt.some(function (p) { return String(p.ID) === String(chon); }) ? chon : '';
                if (window.jQuery) jQuery(q('phong')).trigger('change.select2');
                if (chon && !q('phong').value) { tokKT++; ketQua(''); }
                if (!dsPhongTrong) return;                  // chưa có kết quả phòng trống → giữ dòng gợi ý đang có
                var conTrong = !chon || dsPhongTrong.some(function (p) { return String(p.ID) === String(chon); });
                var toa = '';
                if (toaChon) {
                    var tenToa = (q('toa').options[q('toa').selectedIndex] || {}).text || '';
                    toa = phongToa ? ', ' + (/^tòa/i.test(tenToa) ? tenToa : 'tòa ' + tenToa) : ' (chưa lọc được theo tòa nhà)';
                }
                goiYPhong('— ' + dt.length + ' phòng ' + (loaiPhongMoi ? loaiPhongMoi + ' ' : '') + 'trống ' + khungPhong +
                    (isNaN(min) ? '' : ', sức chứa từ ' + min + (tuDong ? ' (= sĩ số lớp)' : '')) + toa + (conTrong ? '' : ' (phòng vừa chọn đã có lịch, chọn phòng khác)'));
            }
            function locTheoToa(id) {
                toaChon = id; phongToa = null;
                if (!id) { veLaiCombo(); return; }
                layPhong(id).then(function (dsP) {
                    if (toaChon !== id || !B.isConnected) return;
                    if (dsP.length) { phongToa = {}; dsP.forEach(function (p) { phongToa[String(p.ID)] = 1; }); }
                    veLaiCombo();
                }, function () { if (toaChon === id) veLaiCombo(); });
            }
            /* Lọc phòng trống mặc định khi màn không truyền cb.locPhong (gốc mới: lichgiang cũng qua capNhatPhongTrong_DoiLich) — chỉ phòng cùng loại phòng hiện tại */
            function locPhongMacDinh(v) {
                var tbd = parseInt(v.tbd, 10), tkt = parseInt(v.tkt, 10), bd = gioTiet(tbd, false), kt = gioTiet(tkt, true);
                var cu = phongTatCa.filter(function (y) { return String(y.ID) === String(r.IDPHONGHOC); })[0], loai = cu ? loaiPhong(cu) : '', ten = loai ? tenLoai(loai) : '';
                if (!parse(v.ngay) || !bd || !kt || tkt < tbd) return Promise.resolve({ goiY: loai ? 'Chỉ hiện phòng ' + ten + ', cùng loại phòng hiện tại' : '' });
                return phongTrong(v.ngay, bd, kt, String(e(r.IDLICHHOC))).then(function (rows) {
                    var m = {};
                    rows.forEach(function (x) { m[idTrong(x)] = 1; });
                    var dsP = phong.filter(function (p) {
                        if (!m[String(p.ID)]) return false;
                        var x = phongTatCa.filter(function (y) { return String(y.ID) === String(p.ID); })[0];
                        return !loai || !x || loaiPhong(x) === loai;
                    });
                    return { ds: dsP, loai: ten, khung: 'T' + tbd + '-' + tkt + ' ngày ' + v.ngay, goiY: dsP.length + ' phòng ' + (ten ? ten + ' ' : '') + 'trống T' + tbd + '-' + tkt + ' ngày ' + v.ngay };
                }, function (err) { return { goiY: 'Chưa lấy được phòng trống (' + ((err && err.message) || 'lỗi') + '), đang hiện tất cả phòng ' + ten }; });
            }
            var locPhongCb = cb && cb.locPhong ? cb.locPhong : locPhongMacDinh;
            var henLoc = null;
            function locPhong() {
                var sh = ++tokPT;
                dsPhongTrong = null;
                goiYPhong('Đang tìm phòng trống...');
                Promise.resolve(locPhongCb({ ngay: q('ngay').value.trim(), tbd: q('tbd').value.trim(), tkt: q('tkt').value.trim() })).then(function (kq) {
                    if (sh !== tokPT || !B.isConnected) return;         // đã đổi ngày / tiết khác, hoặc khung đã đóng
                    kq = kq || {};
                    if (kq.ds) { dsPhongTrong = kq.ds; khungPhong = kq.khung || ''; loaiPhongMoi = kq.loai || ''; veLaiCombo(); }
                    else { dsPhongTrong = null; veLaiCombo(); goiYPhong(kq.goiY || ''); }
                    ketQua('');
                });
            }
            function henLocPhong() { clearTimeout(henLoc); henLoc = setTimeout(locPhong, 400); }

            /* ---- Tham số gửi máy chủ — cùng bộ trường với bản gốc; ov ghi đè các trường *_ThayDoi (kiểm tra từng ô) ---- */
            function thamSo(ov) {
                ov = ov || {};
                return Object.assign({}, goc, {
                    strIdHinhThucXep: e(r.IDHINHTHUCXEP), strNoiDung: ov.nd !== undefined ? ov.nd : q('nd').value.trim(),
                    strIdPhongHoc_ThayDoi: ov.phong !== undefined ? ov.phong : q('phong').value,
                    strNgayHoc_ThayDoi: ov.ngay !== undefined ? ov.ngay : q('ngay').value.trim(),
                    strTietBatDau_ThayDoi: ov.tbd !== undefined ? ov.tbd : q('tbd').value.trim(),
                    strTietKetThuc_ThayDoi: ov.tkt !== undefined ? ov.tkt : q('tkt').value.trim(),
                    strThu_ThayDoi: '', strGioBatDau_ThayDoi: '', strPhutBatDau_ThayDoi: '', strGioKetThuc_ThayDoi: '', strPhutKetThuc_ThayDoi: '',
                    strGiangVien_Ids: dsGV.map(function (g) { return g.ID; }).join(','),
                    strGiangVien_ThayDoi_Ids: dsGV.map(function (g, i) { return B.querySelector('[data-gv="' + i + '"]').value; }).join(',')
                });
            }
            function kiemTraNhap() {
                var v = { ngay: q('ngay').value.trim(), tbd: q('tbd').value.trim(), tkt: q('tkt').value.trim(), phong: q('phong').value };
                if (!v.ngay || !v.tbd || !v.tkt) { ketQua('loi', 'Nhập đủ ngày học, tiết bắt đầu và tiết kết thúc mới.'); return null; }
                var tu = parseInt(v.tbd, 10), den = parseInt(v.tkt, 10);
                if (isNaN(tu) || isNaN(den) || tu < 1 || den > 15 || den < tu) { ketQua('loi', 'Tiết học phải nằm trong T1-T15 và tiết kết thúc không nhỏ hơn tiết bắt đầu (đang nhập T' + v.tbd + '-T' + v.tkt + ').'); return null; }
                if (!v.phong) { ketQua('loi', 'Chọn phòng học mới (danh sách chỉ gồm phòng còn trống ở ngày/tiết đã chọn).'); return null; }
                var loi = cb && cb.kiem ? cb.kiem(v) : '';
                if (loi) { ketQua('loi', loi); return null; }
                return v;
            }
            function gui(kiemTra) {
                if (!kiemTraNhap()) return;
                var p = thamSo();
                if (kiemTra) {
                    var tok = ++tokKT;
                    ketQua('dang', 'Đang kiểm tra trùng lịch...');
                    ums.api.call(Object.assign({ action: C + 'KiemTraLichCanDoi', method: 'GET' }, p)).then(function (x2) {
                        if (tok !== tokKT) return;
                        var k = arr(x2.data)[0];
                        if (!k) ketQua('loi', 'Không trả về dữ liệu');
                        else if (k.HOPLE && Number(k.HOPLE) !== 0) ketQua('ok', 'Dữ liệu kiểm tra hợp lệ — có thể gửi yêu cầu');
                        else ketQua('loi', e(k.THONGTINLOI) || 'Lịch cần đổi không hợp lệ');
                    }).catch(function (err) { if (tok !== tokKT) return; ketQua('loi', dichMaLoi(err.goc || err.message) || 'Không kiểm tra được'); if (err.status !== 200) ums.api.handle(err, 'kiểm tra lịch trùng'); });
                    return;
                }
                ums.api.call(Object.assign({ action: C + 'GuiYeuCauDoiLich', method: 'POST' }, p))
                    .then(function () { ui.toast(o.thongBao || 'Gửi yêu cầu thành công', 'ok'); dlg.close(); reload(); if (sauKhiGui) sauKhiGui(); })
                    .catch(function (err) { ketQua('loi', dichMaLoi(err.goc || err.message) || 'Gửi yêu cầu không thành công'); if (err.status !== 200) ums.api.handle(err, 'gửi yêu cầu đổi lịch'); });
            }

            /* ---- Lưới tuần chọn thời gian mới (kiểu phần mềm TKB) ---- */
            function dsGVLuoi() {       // giảng viên của lớp; đã chọn người dạy thay thì lấy người thay (bThayThe: không đối chiếu "lịch phải chứa buổi đang đổi")
                var out = [];
                dsGV.forEach(function (g, i) {
                    var moi = B.querySelector('[data-gv="' + i + '"]').value;
                    var objMoi = moi && String(moi) !== String(g.ID) ? dmGV.filter(function (x) { return String(x.ID) === String(moi); })[0] : null;
                    var g2 = objMoi ? Object.assign({}, objMoi, { bThayThe: true }) : g;
                    if (!out.some(function (x) { return String(x.ID) === String(g2.ID); })) out.push(g2);
                });
                return out;
            }
            function ghiBan(gv, dt) {
                var ten = tenGVNgan(gv);
                if (dt === null) { gvKhongDoiChieu.push(ten + ' (không tải được lịch)'); return; }
                var tuanCoBuoi = ngayTuan.some(function (n) { return n.vn === r.NGAYHOC; });
                if (tuanCoBuoi && !gv.bThayThe && !dt.some(function (x) { return x.NGAYHOC === r.NGAYHOC && (x.IDLICHHOC === r.IDLICHHOC || x.IDLOPHOCPHAN === r.IDLOPHOCPHAN); })) {
                    gvKhongDoiChieu.push(ten + ' (lịch không khớp buổi học hiện tại)');
                }
                dt.forEach(function (x) {
                    if (x.IDLICHHOC && r.IDLICHHOC && x.IDLICHHOC === r.IDLICHHOC) return;
                    var k = khoangTiet(x);
                    if (!k) return;
                    for (var t = k.tu; t <= k.den; t++) (banGV[x.NGAYHOC + '|' + t] = banGV[x.NGAYHOC + '|' + t] || []).push({ gv: ten, hp: e(x.TENHOCPHAN), tu: k.tu, den: k.den });
                });
            }
            function trangThaiO(n, t, homNay) {
                if (k0 && n.vn === r.NGAYHOC && t >= k0.tu && t <= k0.den) return { cls: 'hientai', text: t === k0.tu ? 'Buổi này' : '', tip: 'Buổi học hiện tại (T' + k0.tu + '-' + k0.den + ')' };
                if (n.d < homNay) return { cls: 'qua', text: '', tip: n.vn + ': ngày đã qua' };
                var b = banGV[n.vn + '|' + t];
                if (b) return { cls: 'ban', text: b.some(function (y) { return y.tu === t; }) ? (b[0].hp || 'Bận') : '', tip: b.map(function (y) { return y.gv + ' bận: ' + y.hp + ' (T' + y.tu + '-' + y.den + ')'; }).join('\n') };
                return { cls: 'trong', text: '', tip: thu(n.vn) + ' ' + n.vn + ' · tiết ' + t + ' — giảng viên rảnh, bấm để chọn' };
            }
            function veLuoi() {
                if (!luoi || !tuan) return;
                var tok = ++tokLuoi, dDau = parse(tuan);
                ngayTuan = [];
                for (var i = 0; i < 7; i++) { var dd = new Date(dDau.getFullYear(), dDau.getMonth(), dDau.getDate() + i); ngayTuan.push({ vn: dmy(dd), d: dd }); }
                z('tuan').textContent = 'Tuần ' + ngayTuan[0].vn.substr(0, 5) + ' - ' + ngayTuan[6].vn;
                datNgay(q('dentuan'), '');
                z('bang').innerHTML = '<div class="lgdl__tai"><i class="fa-light fa-spinner fa-spin"></i> Đang tải lịch giảng viên...</div>';
                banGV = {}; gvKhongDoiChieu = [];
                var gvs = dsGVLuoi();
                if (!gvs.length) { veBang(); return; }
                Promise.all(gvs.map(function (g) { return lichGV(g.ID, ngayTuan[0].vn, ngayTuan[6].vn).then(function (dt) { return { gv: g, dt: dt }; }, function () { return { gv: g, dt: null }; }); }))
                    .then(function (kq) { if (tok !== tokLuoi || !B.isConnected) return; kq.forEach(function (x) { ghiBan(x.gv, x.dt); }); veBang(); });
            }
            function veBang() {
                var homNay = new Date(); homNay = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate());
                var h = '<div class="lgdl__luoi"><div class="lgdl__dau"></div>' + ngayTuan.map(function (n) {
                    return '<div class="lgdl__dau' + (n.d.getTime() === homNay.getTime() ? ' is-homnay' : '') + '">' + thu(n.vn) + '<small>' + n.vn.substr(0, 5) + '</small></div>';
                }).join('');
                for (var t = 1; t <= 15; t++) {
                    var buoi = t <= 6 ? 'sang' : (t <= 12 ? 'chieu' : 'toi'), dau = (t === 7 || t === 13) ? ' is-daubuoi' : '', bd = gioTiet(t, false);
                    h += '<div class="lgdl__tiet is-' + buoi + dau + '">T' + t + (bd ? '<small>' + hai(bd.gio) + ':' + hai(bd.phut) + '</small>' : '') + '</div>';
                    h += ngayTuan.map(function (n) {
                        var st = trangThaiO(n, t, homNay);
                        return '<div class="lgdl__o is-' + st.cls + dau + '" data-ngay="' + n.vn + '" data-tiet="' + t + '" title="' + esc(st.tip) + '">' + esc(st.text) + '</div>';
                    }).join('');
                }
                z('bang').innerHTML = h + '</div>';
                var cbo = z('luoicanhbao'), canh = [];
                if (!dsGV.length) canh.push('Buổi học chưa có giảng viên nên lưới chỉ thể hiện ngày giờ, chưa xét lịch bận.');
                else if (gvKhongDoiChieu.length) canh.push('Chưa đối chiếu được lịch giảng viên: ' + gvKhongDoiChieu.join('; ') + ' — ô xanh chỉ mang tính tham khảo, hệ thống vẫn kiểm tra trùng lịch sau khi chọn phòng.');
                if (canh.length) { cbo.innerHTML = '<i class="fa-light fa-triangle-exclamation"></i><span></span>'; cbo.querySelector('span').textContent = canh.join(' '); cbo.hidden = false; }
                else { cbo.hidden = true; cbo.innerHTML = ''; }
                dongBoChon();
                var tok = ++tokKiem;
                tienDo('dang', 0, 0, '', 0, 0, '', 0, true);
                setTimeout(function () { kiemLuoi(tok); }, 500);      // lật tuần / đổi phòng liên tục không bắn lời gọi
            }
            function phongKiem() { return q('phong').value || String(e(r.IDPHONGHOC)); }
            function tenPhongCua(id) {
                var p = phong.filter(function (x) { return String(x.ID) === String(id); })[0];
                if (p) return e(p.TENPHONGHOC) || e(p.MA) || e(p.TEN);
                return String(e(r.IDPHONGHOC)) === String(id) ? e(r.TENPHONGHOC) : '';
            }
            /* Một ô = một lời gọi KiemTraLichCanDoi; nhớ 5 phút theo ô + phòng + giảng viên thay; lỗi không nhớ → "Kiểm tra lại" gọi lại được */
            function kiemMotO(ngay, tu, den, ph) {
                var p = Object.assign({ action: C + 'KiemTraLichCanDoi', method: 'GET', silent: true }, thamSo({ nd: '', phong: ph, ngay: ngay, tbd: tu, tkt: den }));
                return goiNho('K|' + p.strIdLichHoc + '|' + ngay + '|' + tu + '|' + den + '|' + ph + '|' + p.strGiangVien_ThayDoi_Ids, function () {
                    return ums.api.call(p).then(function (x) {
                        var dt = arr(x.data);
                        if (!dt.length) throw new Error('Máy chủ không trả dữ liệu kiểm tra (Data rỗng)');
                        return { ok: !!(dt[0].HOPLE && Number(dt[0].HOPLE) !== 0), ly: e(dt[0].THONGTINLOI) };
                    }, function (err) {
                        /* Success = false + Message là MÃ QUY TẮC một từ liền (BanKhongDuocPhepXepVuotQuaCaSang…) = "ô này không đổi được", là KẾT QUẢ, không phải lỗi */
                        var ma = e(err.goc || err.message);
                        if (err.status === 200 && laMaQuyTac(ma)) return { ok: false, ly: dichMaLoi(ma), ca: /^BanKhongDuocPhepXepVuotQuaCa/.test(ma) };
                        throw err;
                    });
                });
            }
            function tienDo(tt2, xong, tong, tenPhong, doiDuoc, loi, loiDau, vatCa, chuanBi) {
                var el = z('tiendo'), txt;
                el.className = 'lgdl__tiendo' + (tt2 === 'xong' ? ' is-xong' : tt2 === 'dung' ? ' is-dung' : '');
                var icon = tt2 === 'dang' ? 'fa-spinner fa-spin' : tt2 === 'xong' ? 'fa-circle-check' : 'fa-triangle-exclamation';
                var ph = tenPhong ? ' với phòng ' + tenPhong : '';
                if (chuanBi) txt = 'Đang chuẩn bị kiểm tra các ô trong tuần...';
                else if (tt2 === 'dang') txt = 'Đang kiểm tra ' + xong + '/' + tong + ' ô' + ph + '...';
                else if (tong === 0) txt = 'Tuần này không có ô nào để kiểm tra (giảng viên bận hoặc ngày đã qua).';
                else if (tt2 === 'dung') txt = 'Dừng kiểm tra sau ' + xong + '/' + tong + ' ô vì máy chủ lỗi liên tiếp' + (loiDau ? ' (máy chủ báo: ' + loiDau + ')' : '') + ' — ô xanh nhạt mới chỉ xét giảng viên.';
                else txt = 'Đã kiểm tra ' + tong + ' ô' + ph + ': ' + doiDuoc + ' ô đổi được' + (vatCa ? ', ' + vatCa + ' ô bị loại vì buổi vắt qua ca sáng/chiều' : '') + '.' +
                    (loi ? ' ' + loi + ' ô chưa kiểm tra được (xanh nhạt)' + (loiDau ? ' — máy chủ báo: ' + loiDau : '') + '.' : '');
                el.innerHTML = '<i class="fa-light ' + icon + '"></i><span></span>' + (tt2 !== 'dang' && loi ? ui.btn('reload', { text: 'Kiểm tra lại', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-dla': 'kiemlai' } }) : '');
                el.querySelector('span').textContent = txt;
            }
            /* Khối soTiet tiết liên tiếp từ tiết tu của ngày có đặt được không (không quá tiết 15, không ngày qua, không đè lịch bận) */
            function kiemKhoi(ngay, tu) {
                var den = tu + soTiet - 1;
                if (den > 15) return { ok: false, ly: 'Buổi học dài ' + soTiet + ' tiết, bắt đầu từ tiết ' + tu + ' sẽ vượt tiết 15 — chọn tiết bắt đầu sớm hơn.' };
                for (var t = tu; t <= den; t++) {
                    var c = oLuoi(ngay, t);
                    if (!c) continue;
                    if (c.classList.contains('is-qua')) return { ok: false, ly: 'Ngày ' + ngay + ' đã qua, không đổi sang được.' };
                    if (c.classList.contains('is-ban')) return { ok: false, ly: 'Không đủ ' + soTiet + ' tiết liên tiếp từ tiết ' + tu + ' — vướng tiết ' + t + ': ' + (c.title || 'giảng viên bận').replace(/\n/g, '; ') };
                }
                return { ok: true, den: den };
            }
            function kiemLuoi(tok) {
                if (tok !== tokKiem || !ngayTuan.length || !B.isConnected) return;
                var ph = phongKiem(), tenPhong = tenPhongCua(ph), can = [];
                ngayTuan.forEach(function (n) {
                    for (var t = 1; t <= 15; t++) {
                        var c = oLuoi(n.vn, t);
                        if (!c || !c.classList.contains('is-trong')) continue;        // chỉ ô giảng viên rảnh mới đáng hỏi máy chủ
                        var kq = kiemKhoi(n.vn, t);
                        if (!kq.ok) { c.classList.remove('is-trong'); c.classList.add('is-ngan'); c.title = kq.ly; continue; }
                        can.push({ ngay: n.vn, tu: t, den: t + soTiet - 1, c: c });
                    }
                });
                if (can.length > MAX_KIEM_O) can = can.slice(0, MAX_KIEM_O);
                var tong = can.length, tiep = 0, xong = 0, dangChay = 0, doiDuoc = 0, vatCa = 0, loi = 0, loiLienTiep = 0, dung = false, ketThuc = false, loiDau = '';
                if (!tong) { tienDo('xong', 0, 0, tenPhong, 0, 0); return; }
                can.forEach(function (x) { x.c.classList.add('is-kiem'); });
                tienDo('dang', 0, tong, tenPhong);
                function xongHet() {
                    if (ketThuc) return;
                    ketThuc = true;
                    can.slice(tiep).forEach(function (x) { x.c.classList.remove('is-kiem'); });
                    tienDo(dung ? 'dung' : 'xong', xong, tong, tenPhong, doiDuoc, loi, loiDau, vatCa);
                    dongBoChon();                                     // ô đang chọn có thể vừa thành "vướng" → cập nhật ghi chú
                }
                function chayTiep() {
                    if (tok !== tokKiem) return;
                    if (dung || tiep >= tong) { if (!dangChay) xongHet(); return; }
                    var x = can[tiep++];
                    dangChay++;
                    kiemMotO(x.ngay, x.tu, x.den, ph).then(function (kq) { return { kq: kq }; }, function (err) { return { loi: (err && err.message) || 'lỗi' }; }).then(function (kq2) {
                        dangChay--;
                        if (tok !== tokKiem) return;                  // đã đổi tuần / phòng / giảng viên hoặc đóng hộp
                        xong++;
                        x.c.classList.remove('is-kiem');
                        var moTa = thu(x.ngay) + ' ' + x.ngay + ' · tiết ' + x.tu + '-' + x.den;
                        if (!kq2.kq) {
                            loi++; if (!loiDau) loiDau = kq2.loi;
                            if (++loiLienTiep >= LOI_LIEN_TIEP) dung = true;
                        } else {
                            loiLienTiep = 0;
                            x.c.classList.remove('is-trong');
                            if (kq2.kq.ok) { doiDuoc++; x.c.classList.add('is-doiduoc'); x.c.title = moTa + ' — đổi được' + (tenPhong ? ' (phòng ' + tenPhong + ')' : '') + ', bấm để chọn'; }
                            else if (kq2.kq.ca) { vatCa++; x.c.classList.add('is-ngan'); x.c.setAttribute('data-ly', kq2.kq.ly); x.c.title = moTa + ' — ' + kq2.kq.ly; }
                            else { x.c.classList.add('is-vuong'); x.c.setAttribute('data-ly', kq2.kq.ly || 'Không đổi được'); x.c.title = moTa + ' — không đổi được: ' + (kq2.kq.ly || 'vướng lịch') + '\n(bấm để chọn nếu muốn đổi phòng khác)'; }
                        }
                        if (xong % 5 === 0 && !dung) tienDo('dang', xong, tong, tenPhong);
                        chayTiep();
                    });
                }
                for (var i = 0; i < Math.min(SONG_SONG, tong); i++) chayTiep();
            }
            function xoaXemTruoc() { Array.prototype.forEach.call(B.querySelectorAll('.lgdl__o.is-xemtruoc'), function (c) { c.classList.remove('is-xemtruoc', 'ok', 'loi'); }); }
            function xemTruoc(c) {
                xoaXemTruoc();
                var ngay = c.getAttribute('data-ngay'), tu = +c.getAttribute('data-tiet'), kq = kiemKhoi(ngay, tu);
                for (var t = tu; t <= Math.min(15, tu + soTiet - 1); t++) { var x = oLuoi(ngay, t); if (x) x.classList.add('is-xemtruoc', kq.ok ? 'ok' : 'loi'); }
            }
            function ghiChu(loai, nd) {
                var el = z('ghichu');
                el.className = 'lgdl__ghichu' + (loai ? ' is-' + loai : '');
                el.innerHTML = '<i class="fa-light ' + (loai === 'ok' ? 'fa-circle-check' : loai === 'loi' ? 'fa-circle-exclamation' : 'fa-hand-pointer') + '"></i> <span></span>';
                el.querySelector('span').textContent = nd;
            }
            function chonO(c) {
                var ngay = c.getAttribute('data-ngay'), tu = +c.getAttribute('data-tiet'), kq = kiemKhoi(ngay, tu);
                if (!kq.ok) { ghiChu('loi', kq.ly); return; }
                datNgay(q('ngay'), ngay); q('tbd').value = tu; q('tkt').value = kq.den;
                ban(q('ngay')); ban(q('tbd')); ban(q('tkt'));
                var ph = q('phong').closest('.ums-field');
                if (ph && ph.scrollIntoView) ph.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            function chuyenTuan(soNgay, dMoc) {
                var dDau;
                if (dMoc) dDau = thuHai(dMoc);
                else if (soNgay) { dDau = parse(tuan) || thuHai(new Date()); dDau.setDate(dDau.getDate() + soNgay); }
                else dDau = thuHai(parse(r.NGAYHOC) || new Date());
                tuan = dmy(dDau);
                veLuoi();
            }
            /* Tô các ô đang chọn theo ngày / tiết trong biểu mẫu (cả khi gõ tay); nhayTuan: ngày ngoài tuần đang hiện → chuyển sang tuần đó */
            function dongBoChon(nhayTuan) {
                if (!luoi || !ngayTuan.length) return;
                var ngay = q('ngay').value.trim(), d = parse(ngay);
                if (nhayTuan && d && (d < ngayTuan[0].d || d > ngayTuan[6].d)) { chuyenTuan(0, d); return; }
                Array.prototype.forEach.call(B.querySelectorAll('.lgdl__o.is-chon'), function (c) { c.classList.remove('is-chon'); });
                var tu = parseInt(q('tbd').value, 10), den = parseInt(q('tkt').value, 10);
                if (!d || isNaN(tu) || isNaN(den) || den < tu) { ghiChu('', 'Bấm vào ô xanh để chọn ngày và tiết mới — hệ thống tự lấy phòng trống phù hợp.'); return; }
                if (k0 && ngay === r.NGAYHOC && tu === k0.tu && den === k0.den) { ghiChu('', 'Đang giữ nguyên thời gian hiện tại (chỉ đổi phòng / giảng viên). Muốn đổi giờ, bấm vào ô xanh khác.'); return; }
                for (var t = tu; t <= den; t++) { var c = oLuoi(ngay, t); if (c) c.classList.add('is-chon'); }
                var kq = { ok: true };
                if (den > 15) kq = { ok: false, ly: 'Một ngày chỉ có tiết 1-15 — tiết kết thúc ' + den + ' không hợp lệ.' };
                else if (den - tu + 1 === soTiet) kq = kiemKhoi(ngay, tu);          // gõ độ dài khác số tiết của lớp thì không xét vướng lịch bận
                if (!kq.ok) { ghiChu('loi', kq.ly); return; }
                var dau = oLuoi(ngay, tu), moTa = 'Ô ' + thu(ngay) + ' ' + ngay + ' · tiết ' + tu + '-' + den;
                if (dau && dau.classList.contains('is-ngan') && dau.getAttribute('data-ly')) { ghiChu('loi', moTa + ' không đổi được: ' + dau.getAttribute('data-ly') + '.'); return; }
                if (dau && dau.classList.contains('is-vuong')) {
                    var tp = tenPhongCua(phongKiem());
                    ghiChu('loi', moTa + (tp ? ' chưa đổi được với phòng ' + tp : ' chưa đổi được') + ': ' + (dau.getAttribute('data-ly') || 'vướng lịch') + ' — chọn phòng khác (lưới sẽ kiểm tra lại) hoặc chọn ô khác.');
                    return;
                }
                var bd = gioTiet(tu, false), kt = gioTiet(den, true);
                ghiChu('ok', 'Đã chọn ' + thu(ngay) + ' ' + ngay + ' · tiết ' + tu + '-' + den + (bd && kt ? ' (' + hai(bd.gio) + ':' + hai(bd.phut) + ' - ' + hai(kt.gio) + ':' + hai(kt.phut) + ')' : '') + ' — chọn phòng ở bên cạnh.');
            }

            /* ---- Đổ dữ liệu + gắn sự kiện ---- */
            veLaiCombo(e(tt.IDPHONGHOC_THAYDOI));
            dsGV.forEach(function (g, i) { var s = B.querySelector('[data-gv="' + i + '"]'); pat.fill(s, dmGV, { name: tenGV }); s.value = g.ID; });
            ui.enhance(B);
            if (window.jQuery) jQuery(B).find('select').trigger('change.select2');    // biểu mẫu trong trang đã gắn select2 lúc dựng → vẽ lại giá trị vừa đặt
            var henKT = null, henLuoiPhong = null;
            ['ngay', 'tbd', 'tkt'].forEach(function (k) {
                q(k).addEventListener('input', henLocPhong);
                q(k).addEventListener('change', function () { tokKT++; ketQua(''); henLocPhong(); dongBoChon(true); });
            });
            q('phong').addEventListener('change', function () {
                tokKT++; ketQua('');
                if (!q('phong').value) return;
                clearTimeout(henKT); henKT = setTimeout(function () { if (B.isConnected && kiemTraNhap()) gui(true); }, 300);   // chọn phòng xong tự kiểm tra trùng lịch
                if (luoi && formSan) { clearTimeout(henLuoiPhong); henLuoiPhong = setTimeout(function () { if (B.isConnected && ngayTuan.length) veBang(); }, 300); }  // ô xanh tính theo phòng → kiểm lại
            });
            dsGV.forEach(function (g, i) { B.querySelector('[data-gv="' + i + '"]').addEventListener('change', function () { tokKT++; ketQua(''); veLuoi(); }); });
            q('sctu').addEventListener('input', function () { veLaiCombo(); });
            q('sctu').addEventListener('change', function () { veLaiCombo(); });
            q('boqua').addEventListener('change', function () { veLaiCombo(); });
            q('toa').addEventListener('change', function () { locTheoToa(q('toa').value || ''); });
            if (luoi) {
                q('dentuan').addEventListener('change', function () { var d2 = parse(q('dentuan').value.trim()); if (d2) chuyenTuan(0, d2); });
                B.addEventListener('click', function (ev) {
                    var a = ev.target.closest('[data-dla]');
                    if (a && B.contains(a)) {
                        var k = a.getAttribute('data-dla');
                        if (k === 'tuan-1') chuyenTuan(-7); else if (k === 'tuan1') chuyenTuan(7); else if (k === 'tuancu') chuyenTuan(0);
                        else if (k === 'kiemlai') veBang();          // ô lỗi gọi lại, ô có kết quả lấy từ bộ nhớ
                        return;
                    }
                    var c = ev.target.closest('.lgdl__o[data-ngay]');
                    if (c && B.contains(c)) chonO(c);
                });
                z('bang').addEventListener('mouseover', function (ev) { var c = ev.target.closest('.lgdl__o[data-ngay]'); if (c) xemTruoc(c); });
                z('bang').addEventListener('mouseleave', xoaXemTruoc);
            }
            layToaNha().then(function (dsT) { if (B.isConnected) pat.fill(q('toa'), dsT, { name: 'TENTOANHA', head: 'Tất cả tòa nhà' }); }).catch(function () {});
            layPhong('').then(function (dsP) { if (!B.isConnected) return; phongTatCa = dsP; veLaiCombo(); }).catch(function () {});
            siSoLop(r).then(function (n) { if (!B.isConnected) return; siSo = n; q('sctu').placeholder = n ? n + ' (sĩ số)' : 'VD: 40'; if (formSan) veLaiCombo(); });
            locPhong();
            formSan = true;
            tuan = dmy(thuHai(parse(q('ngay').value.trim()) || parse(r.NGAYHOC) || new Date()));
            veLuoi();
        }).catch(function (err) { ums.api.handle(err, 'khởi tạo yêu cầu đổi lịch'); if (o.onDong) o.onDong(); });
    }

    lg.doiLich = { danhSach: danhSach, khoiTao: khoiTao, reload: reload, xem: xem, goc: gocCua, loaiPhong: loaiPhong, sucChua: sucChua, khoangTiet: khoangTiet };
})();
