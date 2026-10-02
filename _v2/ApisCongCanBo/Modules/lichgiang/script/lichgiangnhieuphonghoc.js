/* =========================================================================
   Lịch giảng đường — nhiều phòng học × 7 ngày × 3 buổi × module 3 tiết
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/lichgiangnhieuphonghoc.html + script/lichgiangnhieuphonghoc.js
   Khung lưới / lịch tháng / chi tiết / xuất Excel: _nhieu.js (ums.lg.nhieu).
   Hộp "Yêu cầu đổi lịch": _lichgiang_doilich.js (ums.lg.doiLich.khoiTao) — dùng chung với Thời khóa biểu cá nhân.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       NS_ThongTinCanBo_MH · PKG_CONGTHONGTINCANBO.LayDSToaNha          ô Tòa nhà
       NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayDSPhongHoc         ô Phòng học (strTKB_ToaNha_Id khi đã chọn tòa nhà)
                                                                         + danh sách dòng mỗi lượt nạp
       NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayLichPhongHoc       lịch tuần — MỖI PHÒNG một lời gọi
       NS_ThongTinCanBo/LayDSLichGiang (GET)                             lịch dạy của NGƯỜI ĐĂNG NHẬP trong tuần (đổi lịch)
       KHCT_LichGiang_DoiLich/KhoiTaoThongTinYeuCauDoiLich (GET) · KiemTraLichCanDoi (GET) · GuiYeuCauDoiLich (POST)
   Buổi: ưu tiên TIETBATDAU (1-6 / 7-12 / 13-15), không có tiết thì theo giờ
   (< 13 sáng, < 19 chiều) — như gốc. Hiệu suất bỏ Chủ nhật khỏi cả tử và mẫu.

   Pull 29/9 (bản gốc viết lại gần hết, 017d9453 → 5018e138) — đã chuyển:
     · Bố cục gọn: một khối lọc một hàng, nút trên tiêu đề khối, bỏ 3 dòng giới thiệu; lịch tháng thành hộp thả
       dưới nút "Tuần (…)" trên thanh tuần; lật tháng KHÔNG tự đổi tuần (trước: tự chọn ngày 1 rồi nạp lại).
     · Ô lọc mới "Sức chứa (chỗ)" Từ – Đến; nhãn "N chỗ" ở ô tên phòng; tên phòng bỏ "(N)" ở cuối.
       Sức chứa: dò cột SUCCHUAHOC, SUCCHUA, SUC_CHUA, SUCCHUA_HOC, SOCHOHOC, SOCHO, SOCHONGOI, SOLUONGCHO,
       SOLUONG; không có thì lấy số trong ngoặc cuối TEN ("A1-101(154)") — y như gốc (gốc cũng chưa rõ tên cột).
     · Lưới chia MODULE 3 tiết (T1-3, T4-6 | T7-9, T10-12 | T13-15): module không có lịch hiện "Trống";
       lịch chạm nhiều module thì gộp ô. Module bị chiếm dù một tiết vẫn tính bận.
     · Đổi lịch ngay trên màn: (1) bấm ô "Trống" → hộp chọn buổi dạy của mình trong tuần → hộp Yêu cầu đổi lịch
       điền sẵn ngày / tiết / phòng của ô; (2) bấm thẻ lịch của chính mình → hộp chi tiết có nút "Yêu cầu đổi lịch".
       Chỉ đổi sang phòng CÙNG LOẠI (LT ↔ TH bị chặn) — luật của bản gốc.
     · Mỗi lượt 10 phòng (trước 30), tối đa 5 lời gọi lịch cùng lúc, nhớ lịch 5 phút theo phòng + tuần,
       lời gọi trùng đang chờ thì dùng chung; dòng "Cuộn xuống…" bấm được; hiện tiến độ (x/y phòng).
     · Xuất Excel / CSV: mỗi phòng 5 dòng theo module, Excel gộp ô + tô xanh ô có lịch (mẫu bận tô vàng),
       thêm dòng ghi chú; hộp xuất ghi số phòng của từng phạm vi và tuần đang xem.
     · Câu báo: "Vui lòng chọn tòa nhà, phòng học hoặc sức chứa", "Không có phòng học phù hợp bộ lọc".
   Pull 29/9 — bỏ qua: toàn bộ CSS / lớp Bootstrap / màu nút của hệ cũ (≈1.100 dòng <style>), thẻ lựa chọn
     trong hộp xuất (chỉ là cách vẽ các ô chọn — bản mới giữ ô chọn), lớp phủ "Đang xuất…" và hộp "Xuất file
     thành công" tự vẽ (bản mới: ui.batch + thông báo nổi), đo lại chiều cao tiêu đề dính, console.log.
   Khác bản gốc mới (ghi lại):
     · Kết quả "Kiểm tra lịch trùng" và lỗi gửi hiện bằng thông báo nổi (gốc hiện trong hộp) — theo hộp đổi
       lịch dùng chung của Thời khóa biểu cá nhân.
     · Ngày "Đổi sang" nhập dd/mm/yyyy (gốc dùng ô ngày của trình duyệt rồi tự đổi sang dd/MM/yyyy khi gửi).
     · Tên phòng, học phần… đều qua esc (gốc nối thẳng vào HTML).

   Kéo gốc 30/9 + 1/10 (fed68f6e..c6886b05) — lọc "Phòng trống", chuyển theo bản gốc MỚI NHẤT:
     · Ô lọc "Phòng trống (từ ngày - đến ngày, thứ, tiết)": Từ / Đến ngày, Thứ (giá trị Date.getDay()), khung tiết (T1-3 …
       T13-15, Sáng T1-6, Chiều T7-12). Lời gọi mới SV_TKB_Chung_MH · TKB_CHUNG.LAYPHONGHOCTRONG (strNgay, giờ / phút bắt đầu –
       kết thúc của khung tiết, strKieuPhong = loại phòng đang lọc, dSucChuaTu/Den, dIdToaNha = null, strIdLichBoQua) — MỘT ngày
       mỗi lời gọi, nhớ 5 phút, tối đa 5 cùng lúc, tối đa 31 ngày (dài hơn thì cắt + báo), khoảng > 1 năm thì chỉ xét một năm.
       Giờ của tiết: lấy từ lịch phòng đã tải, không có thì theo khung chuẩn (arrGioTiet của gốc, tiết 50 phút).
     · Một ngày trong tuần đang xem: lưới chỉ vẽ ngày đó (hiệu suất vẫn tính cả tuần), ô Trống đúng khung tiết viền xanh,
       dòng tóm tắt "N phòng trống … — đang chỉ hiện ngày này" + nút "Xem cả tuần" / "Bỏ lọc".
       Nhiều ngày (hoặc một ngày ngoài tuần đang xem): bảng phòng × ngày (Trống / Có lịch, cột đếm "x/y ngày"), dòng tóm tắt
       "N phòng trống đủ cả k ngày" + nút "Hiện cả phòng trống một phần (m)" (xếp phòng trống nhiều ngày lên trước).
       Bấm ô Trống của bảng → đổi lịch vào phòng + ngày + tiết đó (như ô Trống trên lưới tuần).
     · Chỉ nhập Đến ngày → coi là một ngày; Đến < Từ → kéo về bằng Từ; lọc một ngày ngoài tuần đang xem → nhảy sang tuần đó;
       đổi tuần → dời Từ / Đến ngày theo số ngày chuyển (giữ thứ); chọn Thứ mà không nhập ngày → thứ đó của tuần đang xem.
       Máy chủ lỗi → hiện tất cả phòng + báo "Chưa lọc được phòng trống — máy chủ báo: …".
     · Hộp đổi lịch: đổi ngày / tiết (chờ 400 ms) → hỏi phòng trống (bỏ qua chính buổi đang đổi, cùng loại phòng) → ô phòng
       chỉ còn phòng trống, dòng gợi ý "N phòng … trống T… ngày …"; bắt chọn phòng mới trước khi Kiểm tra / Gửi.
   Kéo gốc — bỏ qua: gỡ khoá cuộn của select2 4.0.3 (lỗi riêng vỏ cũ), ô một ngày dropLoc_NgayTrong (gốc đã thay), CSS, console.log.

   Giữ như bản gốc (chờ nghiệp vụ):
     · Buổi chia 7-12 / 13-15 và bỏ Chủ nhật — màn "nhiều giảng viên" lại chia
       7-10 / 11-15 và tính cả Chủ nhật. Hai màn đang lệch nhau, cần hỏi bên nào đúng.
     · Tòa nhà → Phòng học KHÔNG khoá: để trống Tòa nhà = "Tất cả tòa nhà" là
       một lựa chọn có nghĩa. Đổi tòa nhà vẫn nạp lại và xoá trắng ô Phòng.
     · Mở màn tự nạp TẤT CẢ phòng (10 phòng một lượt) dù nút "Xem lịch phòng"
       bắt chọn tòa nhà, phòng hoặc sức chứa.
     · Đổi phòng ở ô chọn nhiều chưa nạp — bấm "Xem lịch phòng" mới áp.
     · Xuất "Tất cả phòng học" = các phòng của tòa nhà đang lọc lần nạp gần nhất.
     · Ô "Trống" ai cũng bấm được (kể cả người không có giờ dạy — hộp báo "không có buổi dạy nào trong tuần").
     · Buổi dạy của mình khớp với thẻ trên lưới theo IDLICHHOC; thiếu thì theo IDLOPHOCPHAN + TIETBATDAU cùng ngày.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, lg = ums.lg;
    var root = document.getElementById('lg-lichgiangnhieuphonghoc');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function tenPhong(p) { return e(p.TEN) || e(p.TENPHONGHOC) || e(p.MA) || 'Phòng ' + e(p.ID); }
    function parse(s) { var p = String(s || '').split('/'); return p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]) : null; }
    function thu(s) { var d = parse(s); return d ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()] : ''; }

    /* Sức chứa — getSucChua của gốc */
    var COT_SUC_CHUA = ['SUCCHUAHOC', 'SUCCHUA', 'SUC_CHUA', 'SUCCHUA_HOC', 'SOCHOHOC', 'SOCHO', 'SOCHONGOI', 'SOLUONGCHO', 'SOLUONG'];
    function sucChua(p) {
        for (var i = 0; i < COT_SUC_CHUA.length; i++) {
            var v = p[COT_SUC_CHUA[i]];
            if (v !== undefined && v !== null && v !== '' && !isNaN(v)) return parseInt(v, 10);
        }
        var m = /\((\d+)\)\s*$/.exec(e(p.TEN));
        return m ? parseInt(m[1], 10) : null;
    }
    /* Tên gọn: bỏ "(N)" sức chứa ở cuối (đã hiện ở nhãn riêng) */
    function tenGon(p) { var t = String(tenPhong(p)); return sucChua(p) !== null ? t.replace(/\s*\(\d+\)\s*$/, '') : t; }
    function tenLoai(k) { return k === 'TH' ? 'thực hành (TH)' : k === 'LT' ? 'lý thuyết (LT)' : k; }

    var CHE_DO = [
        { v: 'days', ten: 'Tính theo ngày sử dụng (mặc định)', nhan: 'Theo ngày' },
        { v: 'periods', ten: 'Tính theo tiết học', nhan: 'Theo tiết', tu: 1, den: 15 },
        { v: 'morning', ten: 'Tính theo buổi sáng (T1-6)', nhan: 'Buổi sáng', tu: 1, den: 6 },
        { v: 'afternoon', ten: 'Tính theo buổi chiều (T7-12)', nhan: 'Buổi chiều', tu: 7, den: 12 },
        { v: 'evening', ten: 'Tính theo buổi tối (T13-15)', nhan: 'Buổi tối', tu: 13, den: 15 },
        { v: 'morning-afternoon', ten: 'Tính theo sáng + chiều (T1-12)', nhan: 'Sáng + Chiều', tu: 1, den: 12 },
        { v: 'afternoon-evening', ten: 'Tính theo chiều + tối (T7-15)', nhan: 'Chiều + Tối', tu: 7, den: 15 },
        { v: 'all-sessions', ten: 'Tính theo cả 3 buổi (T1-15)', nhan: 'Cả 3 buổi', tu: 1, den: 15 }
    ];
    /* arrModule của gốc — ca: 0 sáng, 1 chiều, 2 tối */
    var MODULE = [
        { tu: 1, den: 3, ca: 0, tenBuoi: 'Sáng' }, { tu: 4, den: 6, ca: 0, tenBuoi: 'Sáng' },
        { tu: 7, den: 9, ca: 1, tenBuoi: 'Chiều' }, { tu: 10, den: 12, ca: 1, tenBuoi: 'Chiều' },
        { tu: 13, den: 15, ca: 2, tenBuoi: 'Tối' }
    ];
    function opt(ds) { return ds.map(function (a) { return '<option value="' + esc(a[0]) + '">' + esc(a[1]) + '</option>'; }).join(''); }

    /* getTietRange của gốc: thiếu tiết thì ước theo giờ (tiết ≈ giờ − 6, kẹp trong buổi) */
    function tietCua(r) {
        var a = r.TIETBATDAU, b = r.TIETKETTHUC, g;
        if (!a && r.GIOBATDAU !== null && r.GIOBATDAU !== undefined && r.GIOBATDAU !== '') {
            g = +r.GIOBATDAU; a = g < 13 ? Math.max(1, Math.min(6, g - 6)) : g < 19 ? Math.max(7, Math.min(12, g - 6)) : Math.max(13, Math.min(15, g - 6));
        }
        if (!b && r.GIOKETTHUC !== null && r.GIOKETTHUC !== undefined && r.GIOKETTHUC !== '') {
            g = +r.GIOKETTHUC; b = g <= 12 ? Math.max(1, Math.min(6, g - 6)) : g <= 18 ? Math.max(7, Math.min(12, g - 6)) : Math.max(13, Math.min(15, g - 6));
        }
        return { batDau: a, ketThuc: b };
    }
    /* getKhoangTiet của gốc: null nếu không xác định được tiết bắt đầu */
    function khoangTiet(r) {
        var t = tietCua(r), tu = parseInt(t.batDau, 10), den = parseInt(t.ketThuc, 10);
        if (isNaN(tu)) return null;
        if (isNaN(den) || den < tu) den = tu;
        return { tu: tu, den: den };
    }
    function caCua(r) {
        var t = +r.TIETBATDAU;
        if (t) { if (t >= 1 && t <= 6) return 0; if (t >= 7 && t <= 12) return 1; if (t >= 13 && t <= 15) return 2; }
        if (r.GIOBATDAU !== null && r.GIOBATDAU !== undefined && r.GIOBATDAU !== '') { var g = +r.GIOBATDAU; return g < 13 ? 0 : g < 19 ? 1 : 2; }
        return -1;
    }
    function tietChu(r) { var t = tietCua(r); return t.batDau || t.ketThuc ? 'T' + e(t.batDau) + '-' + e(t.ketThuc) : ''; }
    function gio(r) { return lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU'); }
    function gioDen(r) { return lg.gioPhut(r, 'GIOKETTHUC', 'PHUTKETTHUC'); }

    /* ---------- Nguồn dữ liệu ------------------------------------------- */
    var goc = [], boNho = {}, nhoLich = {}, dangTai = {}, cuaToi = {};
    var HAN_NHO = 5 * 60 * 1000;          // iCacheTTL của gốc
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function layPhong(toaNha) {
        var k = toaNha || '';
        if (boNho[k]) return Promise.resolve(boNho[k]);
        return ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4BRIRKS4vJgkuIgPP', func: 'pkg_congthongtincanbo.LayDSPhongHoc', strNguoiThucHien_Id: uid(), strTKB_ToaNha_Id: k })
            .then(function (r) { return (boNho[k] = arr(r.data)); });
    }
    /* locPhongHoc của gốc: phòng đã chọn, loại phòng, sức chứa Từ – Đến (phòng không rõ sức chứa thì bị loại khi có lọc) */
    function dsDong() {
        var sh = ++luotLoc;
        return layPhong(f('toanha').value).then(function (ds) {
            goc = ds;
            var chon = pat.val(f('phong')), loai = f('loai').value;
            var ids = chon ? chon.split(',') : [];
            var tu = parseInt(f('sctu').value, 10), den = parseInt(f('scden').value, 10);
            return ds.filter(function (p) {
                if (ids.length && ids.indexOf(String(p.ID)) < 0) return false;
                if (loai !== 'all' && String(e(p.KIEUPHONG)).toUpperCase() !== loai) return false;
                if (!isNaN(tu) || !isNaN(den)) {
                    var sc = sucChua(p);
                    if (sc === null) return false;
                    if (!isNaN(tu) && sc < tu) return false;
                    if (!isNaN(den) && sc > den) return false;
                }
                return true;
            });
        }).then(function (ds) { return locPhongTrong(ds, sh); }).then(function (ds) {
            if (sh === luotLoc) {
                capNhatThanh(ds.length);
                if (locLoi && ds.length) ui.toast(locLoi, 'warn');       // gốc: edu.system.alert(strLoiLocTrong)
            }
            return ds;
        });
    }
    /* Nhớ 5 phút theo phòng + khoảng ngày; lời gọi trùng đang chờ thì dùng chung (goiMotLan của gốc) */
    function layLich(p, bd, kt) {
        var k = p.ID + '|' + bd + '|' + kt, c = nhoLich[k];
        if (c && Date.now() - c.t < HAN_NHO) return Promise.resolve(c.d);
        if (dangTai[k]) return dangTai[k];
        dangTai[k] = ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4DSgiKREpLi8mCS4i', func: 'pkg_congthongtincanbo.LayLichPhongHoc', silent: true,
            strIdPhongHoc: p.ID, strNgayBatDau: bd, strNgayKetThuc: kt }).then(function (r) {
            var d = arr(r.data);
            nhoLich[k] = { t: Date.now(), d: d };
            delete dangTai[k];
            return d;
        }, function (err) { delete dangTai[k]; throw err; });
        return dangTai[k];
    }
    /* ---------- Lọc "Phòng trống" (kéo gốc 30/9 – 1/10) -----------------
       locPhongTrong / getDS_PhongTrong / getGioTiet / capNhatThanhLocTrong / genTable_KhoangNgay của gốc.
       TKB_CHUNG.LAYPHONGHOCTRONG nhận MỘT ngày mỗi lời gọi → mỗi ngày một lời gọi (nhớ 5 phút, tối đa 5 cùng lúc),
       tối đa 31 ngày. Một ngày: giữ phòng trống ngày đó. Nhiều ngày: giữ phòng trống ĐỦ mọi ngày (bật "một phần" →
       cả phòng trống ≥ 1 ngày, phòng trống nhiều ngày xếp trước). Không nhập Từ ngày (và không chọn Thứ) → không lọc.
       Máy chủ lỗi → giữ nguyên danh sách phòng + báo. */
    var TRONG = { action: 'SV_TKB_Chung_MH/DQAYEQkODwYJDgIVEw4PBgPP', func: 'TKB_CHUNG.LAYPHONGHOCTRONG' };
    var MAX_NGAY = 31, SONG_SONG = 5;                   // iMaxNgayLoc, iMaxConcurrent của gốc
    var loc = null, locLoi = '', locMotPhan = false, xemCaTuan = false, giuNgay = false, soPhongLoc = 0, luotLoc = 0;
    var nhoTrong = {}, dangTrong = {};
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function dmy(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function ngayHopLe(s) { var d = parse(s); return d && !isNaN(d.getTime()) ? d : null; }
    function cacNgay(tu, den) {
        var a = ngayHopLe(tu), b = ngayHopLe(den), ds = [];
        if (!a || !b) return ds;
        for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) ds.push(dmy(d));
        return ds;
    }
    /* Ô ngày có flatpickr → đặt qua flatpickr (không bắn change), không thì gán thẳng */
    function datNgay(el, s) {
        if (el._flatpickr) { if (s) el._flatpickr.setDate(s, false); else el._flatpickr.clear(false); }
        else el.value = s || '';
    }
    function idTrong(r) { return String(e(r.ID) || e(r.IDPHONGHOC) || e(r.TKB_PHONGHOC_ID)); }
    /* arrGioTiet của gốc: giờ bắt đầu chuẩn của từng tiết (mỗi tiết 50 phút) */
    var GIO_TIET = [[6, 45], [7, 40], [8, 35], [9, 30], [10, 25], [11, 20], [13, 0], [13, 55], [14, 50], [15, 45], [16, 40], [17, 35], [18, 30], [19, 25], [20, 20]];
    /* getGioTiet của gốc: ưu tiên giờ của lịch thật đã tải (lịch phòng đã nhớ), không có thì theo khung chuẩn */
    function gioTiet(t, ketThuc) {
        if (!(t >= 1 && t <= 15)) return null;
        var src = null;
        Object.keys(nhoLich).some(function (k) {
            src = nhoLich[k].d.filter(function (x) {
                return ketThuc ? parseInt(x.TIETKETTHUC, 10) === t && x.GIOKETTHUC !== null && x.GIOKETTHUC !== undefined && x.GIOKETTHUC !== ''
                    : parseInt(x.TIETBATDAU, 10) === t && x.GIOBATDAU !== null && x.GIOBATDAU !== undefined && x.GIOBATDAU !== '';
            })[0] || null;
            return !!src;
        });
        if (src) return ketThuc ? { gio: parseInt(src.GIOKETTHUC, 10), phut: parseInt(src.PHUTKETTHUC, 10) || 0 } : { gio: parseInt(src.GIOBATDAU, 10), phut: parseInt(src.PHUTBATDAU, 10) || 0 };
        var g = GIO_TIET[t - 1], p = g[0] * 60 + g[1] + (ketThuc ? 50 : 0);
        return { gio: Math.floor(p / 60), phut: p % 60 };
    }
    /* Phòng trống một ngày + khung tiết. boQua = IDLICHHOC bỏ qua — có truyền (hộp đổi lịch) thì không nhớ kết quả */
    function goiTrong(ngay, tu, den, loai, boQua) {
        var bd = gioTiet(tu, false), kt = gioTiet(den, true), nho = boQua === undefined;
        var k = ngay + '|' + tu + '|' + den + '|' + loai, c = nho && nhoTrong[k];
        if (c && Date.now() - c.t < HAN_NHO) return Promise.resolve(c.d);
        if (nho && dangTrong[k]) return dangTrong[k];
        var p = ums.api.call({ action: TRONG.action, func: TRONG.func, silent: true, strNgay: ngay,
            dGioBatDau: bd.gio, dPhutBatDau: bd.phut, dGioKetThuc: kt.gio, dPhutKetThuc: kt.phut, strKieuPhong: loai || '',
            dSucChuaTu: null, dSucChuaDen: null, dIdToaNha: null,       // sức chứa + tòa nhà đã lọc ở máy khách; số rỗng gửi null như gốc
            strIdLichBoQua: boQua || '' }).then(function (r) {
            var d = arr(r.data);
            if (nho) { nhoTrong[k] = { t: Date.now(), d: d }; delete dangTrong[k]; }
            return d;
        }, function (err) { if (nho) delete dangTrong[k]; throw err; });
        if (nho) dangTrong[k] = p;
        return p;
    }
    function tienDo(x, n) { return '<i class="fa-light fa-spinner fa-spin"></i><span>Đang tìm phòng trống ' + x + '/' + n + ' ngày…</span>'; }
    function locPhongTrong(ds, sh) {
        if (sh !== luotLoc) return ds;
        loc = null; locLoi = '';
        var tuan = N.tuan, tu = f('tungay').value.trim(), den = f('denngay').value.trim() || tu, thuChon = f('thu').value;
        /* Chọn thứ mà không nhập ngày → thứ đó của tuần đang xem */
        if (!tu && thuChon !== '' && tuan) { tu = tuan.batdau; den = tuan.ketthuc; }
        var dTu = ngayHopLe(tu), dDen = ngayHopLe(den);
        if (!dTu || !dDen) return ds;
        /* Khoảng quá dài (gõ nhầm năm…) → chỉ xét một năm kể từ Từ ngày */
        if ((dDen - dTu) / 864e5 > 366) den = dmy(new Date(dTu.getFullYear(), dTu.getMonth(), dTu.getDate() + 366));
        var ngay = cacNgay(tu, den);
        if (!ngay.length) ngay = [tu];
        var tenThu = thuChon !== '' ? f('thu').options[f('thu').selectedIndex].text : '';
        if (thuChon !== '') {
            ngay = ngay.filter(function (s) { return String(parse(s).getDay()) === thuChon; });
            if (!ngay.length) { locLoi = 'Khoảng ngày đã chọn không có ' + tenThu + ' nào — chưa lọc phòng trống.'; return ds; }
        }
        if (ngay.length > MAX_NGAY) {
            ngay = ngay.slice(0, MAX_NGAY);
            locLoi = 'Khoảng ngày lọc phòng trống tối đa ' + MAX_NGAY + ' ngày — đang tính tới ' + ngay[ngay.length - 1] + '.';
            if (f('tungay').value.trim()) datNgay(f('denngay'), ngay[ngay.length - 1]);
        }
        var tiet = (f('tiet').value || '1-3').split('-'), TU = parseInt(tiet[0], 10), DEN = parseInt(tiet[1], 10);
        var loai = f('loai').value !== 'all' ? f('loai').value : '';
        var o = { NGAY: ngay[0], ngay: ngay, tenThu: tenThu, TU: TU, DEN: DEN, trong: {}, soNgay: {}, du: 0, motPhan: 0 };
        /* Nhiều ngày, hoặc một ngày nằm ngoài tuần đang xem (lưới tuần không có ngày đó) → vẽ bảng phòng × ngày */
        var d0 = parse(ngay[0]);
        o.bang = ngay.length > 1 || !tuan || d0 < parse(tuan.batdau) || d0 > parse(tuan.ketthuc);
        var xong = 0, loi = '';
        if (ngay.length > 1) N.thanh(tienDo(0, ngay.length));
        return lg.chayNhom(ngay, SONG_SONG, function (s) {
            return goiTrong(s, TU, DEN, loai).then(function (rows) {
                var m = o.trong[s] = {};
                rows.forEach(function (r) { m[idTrong(r)] = 1; });
            }, function (err) {
                o.trong[s] = {};
                if (!loi) loi = (err && err.message) || 'lỗi';
            }).then(function () {
                xong++;
                if (ngay.length > 1 && sh === luotLoc) N.thanh(tienDo(xong, ngay.length));
            });
        }).then(function () {
            if (sh !== luotLoc) return ds;
            if (loi) { locLoi = 'Chưa lọc được phòng trống — máy chủ báo: ' + loi + '. Đang hiện tất cả phòng.'; return ds; }
            var co = [];
            ds.forEach(function (p, i) {
                var id = String(p.ID), so = 0;
                ngay.forEach(function (s) { if (o.trong[s][id]) so++; });
                o.soNgay[id] = so;
                if (so === ngay.length) o.du++; else if (so > 0) o.motPhan++;
                if (so === ngay.length || (so > 0 && locMotPhan)) co.push({ p: p, i: i, so: so });
            });
            /* Phòng trống nhiều ngày hơn lên trước; cùng số ngày giữ thứ tự danh mục */
            if (locMotPhan && ngay.length > 1) co.sort(function (a, b) { return (b.so - a.so) || (a.i - b.i); });
            loc = o;
            return co.map(function (x) { return x.p; });
        });
    }
    /* Dòng tóm tắt phía trên lưới khi đang lọc phòng trống */
    function capNhatThanh(n) {
        soPhongLoc = n;
        var o = loc;
        if (!o) { xemCaTuan = false; N.thanh(''); return; }
        var bd = gioTiet(o.TU, false), kt = gioTiet(o.DEN, true);
        var gio = bd && kt ? ' (' + hai(bd.gio) + ':' + hai(bd.phut) + ' - ' + hai(kt.gio) + ':' + hai(kt.phut) + ')' : '';
        var h, nut, k = o.ngay.length, cuoi = o.ngay[k - 1];
        if (o.bang) {
            h = '<b>' + o.du + ' phòng trống đủ cả ' + k + ' ngày</b>' + (locMotPhan ? ' + ' + (n - o.du) + ' phòng trống một phần' : '') +
                ' — ' + (o.tenThu ? 'các ' + esc(o.tenThu) + ' ' : '') + 'từ ' + thu(o.NGAY) + ' ' + o.NGAY + ' đến ' + thu(cuoi) + ' ' + cuoi + ', tiết ' + o.TU + '-' + o.DEN + gio;
            nut = ui.btn('search', { text: locMotPhan ? 'Chỉ phòng trống đủ ' + k + ' ngày' : 'Hiện cả phòng trống một phần (' + o.motPhan + ')',
                icon: locMotPhan ? 'fa-check-double' : 'fa-list', mod: 'out-primary', attr: { 'data-a': 'loc-motphan' } });
        } else {
            h = '<b>' + n + ' phòng trống</b> ' + thu(o.NGAY) + ' ' + o.NGAY + ', tiết ' + o.TU + '-' + o.DEN + gio + (xemCaTuan ? '' : ' — đang chỉ hiện ngày này');
            nut = ui.btn('search', { text: xemCaTuan ? 'Chỉ xem ngày này' : 'Xem cả tuần', icon: xemCaTuan ? 'fa-calendar-day' : 'fa-calendar-week',
                mod: 'out-primary', attr: { 'data-a': 'loc-catuan' } });
        }
        N.thanh('<i class="fa-light fa-door-open"></i><span>' + h + '</span><span class="lgn-thanhloc__nut">' + nut +
            ui.btn('search', { text: 'Bỏ lọc', icon: 'fa-filter-circle-xmark', mod: 'out-primary', attr: { 'data-a': 'loc-bo' } }) + '</span>');
    }
    /* genTable_KhoangNgay của gốc: mỗi phòng một dòng, mỗi ngày một cột (Trống / Có lịch ở khung tiết đang lọc).
       Ô Trống mang data-trong → khung _nhieu gọi oTrong (đổi lịch vào phòng + ngày + tiết đó) như ô Trống trên lưới tuần. */
    function veBang(ds) {
        var o = loc;
        if (!o || !o.bang) return null;
        var k = o.ngay.length;
        var h = '<div class="lgn-kn" style="--lgn-so-ngay:' + k + '"><div class="lgn-kn__dau is-goc">Phòng</div>' +
            '<div class="lgn-kn__dau">Trống<small>tiết ' + o.TU + '-' + o.DEN + '</small></div>' +
            o.ngay.map(function (s) { return '<div class="lgn-kn__dau' + (thu(s) === 'CN' ? ' is-cn' : '') + '">' + thu(s) + '<small>' + s.substr(0, 5) + '</small></div>'; }).join('');
        ds.forEach(function (p) {
            var id = String(p.ID), sc = sucChua(p), mo = [], so = o.soNgay[id] || 0;
            if (sc !== null) mo.push(sc + ' chỗ');
            if (p.KIEUPHONG) mo.push(p.KIEUPHONG);
            h += '<div class="lgn-kn__phong">' + esc(tenGon(p)) + (mo.length ? '<small>' + esc(mo.join(' · ')) + '</small>' : '') + '</div>' +
                '<div class="lgn-kn__dem' + (so === k ? ' is-du' : '') + '">' + so + '/' + k + ' ngày</div>';
            o.ngay.forEach(function (s) {
                h += o.trong[s][id]
                    ? '<button type="button" class="lgn-kn__o is-trong" data-trong="' + esc(id) + '|' + s + '|' + o.TU + '|' + o.DEN + '" title="Bấm để đổi lịch vào phòng này, ' + thu(s) + ' ' + s + ' tiết ' + o.TU + '-' + o.DEN + '">Trống</button>'
                    : '<div class="lgn-kn__o is-ban" title="Đã có lịch trong khung tiết ' + o.TU + '-' + o.DEN + '">Có lịch</div>';
            });
        });
        return h + '</div>';
    }
    function rongLoc() {
        var o = loc;
        if (o && o.ngay.length > 1) return 'Không có phòng nào trống ' + (locMotPhan ? 'ngày nào' : 'đủ cả ' + o.ngay.length + ' ngày') + ' từ ' + o.NGAY + ' đến ' + o.ngay[o.ngay.length - 1] + ', tiết ' + o.TU + '-' + o.DEN + ' phù hợp bộ lọc';
        if (o) return 'Không có phòng trống ' + thu(o.NGAY) + ' ' + o.NGAY + ' tiết ' + o.TU + '-' + o.DEN + ' phù hợp bộ lọc';
        return 'Không có phòng học phù hợp bộ lọc';
    }

    /* Lịch dạy của người đăng nhập trong tuần — nhớ theo tuần, chỉ gọi khi bấm ô Trống / mở chi tiết */
    function lichCuaToi(bd, kt) {
        var k = bd + '|' + kt;
        if (cuaToi[k]) return cuaToi[k];
        cuaToi[k] = ums.api.call({ action: 'NS_ThongTinCanBo/LayDSLichGiang', method: 'GET', silent: true, strNhanSu_HoSoCanBo_Id: uid(),
            strNgayBatDau: bd, strNgayKetThuc: kt, strNgayDangChon: bd }).then(function (r) { return arr(r.data); });
        cuaToi[k].catch(function () { delete cuaToi[k]; });      // lỗi thì lần sau gọi lại (như gốc)
        return cuaToi[k];
    }
    /* timLichCuaToi của gốc */
    function timCuaToi(r, ds) {
        return (ds || []).filter(function (x) {
            if (x.NGAYHOC !== r.NGAYHOC) return false;
            if (x.IDLICHHOC && r.IDLICHHOC) return x.IDLICHHOC === r.IDLICHHOC;
            return x.IDLOPHOCPHAN === r.IDLOPHOCPHAN && String(x.TIETBATDAU) === String(r.TIETBATDAU);
        })[0] || null;
    }
    /* Loại phòng (LT/TH) theo ID — tra các danh sách phòng đã nhớ; '' nếu không rõ */
    function kieuPhong(id) {
        var p = (boNho[''] || []).concat(goc || []).filter(function (x) { return String(x.ID) === String(id); })[0];
        return p ? String(e(p.KIEUPHONG)).toUpperCase() : '';
    }
    function napOPhong(toaNha) {
        return layPhong(toaNha).then(function (ds) {
            ds = ds.slice().sort(function (a, b) { return String(tenPhong(a)).localeCompare(String(tenPhong(b)), 'vi'); });
            pat.fill(f('phong'), ds.map(function (p) { return { ID: p.ID, TEN: tenPhong(p) }; }));
        });
    }

    /* ---------- Đổi lịch ------------------------------------------------ */
    var oDangChon = null;
    function boChon() { if (oDangChon) oDangChon.classList.remove('is-chon'); oDangChon = null; }
    /* viewForm_DoiLich của gốc: giá trị điền sẵn + danh mục phòng cùng loại + cảnh báo. dich = ô trống (null nếu mở từ thẻ lịch) */
    function chuanBi(dich) {
        return function (d, lop) {
            var tt = arr(d.rsThongTinChung)[0] || {}, dm = arr(d.rsDanhMucPhong), canhBao = [];
            var ngay = e(tt.NGAYHOC_THAYDOI) || e(lop.NGAYHOC);
            var tu = parseInt(tt.TIETBATDAU_THAYDOI || lop.TIETBATDAU, 10), den = parseInt(tt.TIETKETTHUC_THAYDOI || lop.TIETKETTHUC, 10);
            var phong = e(tt.IDPHONGHOC_THAYDOI) || e(lop.IDPHONGHOC);
            var loaiCu = kieuPhong(lop.IDPHONGHOC), loai = loaiCu, hopLe = dm;
            if (loaiCu) {
                hopLe = dm.filter(function (p) { return kieuPhong(p.ID) === loaiCu; });
                if (!hopLe.length) {
                    hopLe = dm; loai = '';
                    canhBao.push('Chưa xác định được loại phòng trong danh mục — hãy chọn phòng cùng loại ' + tenLoai(loaiCu) + '.');
                }
            }
            if (dich) {
                var k = khoangTiet(lop) || { tu: tu, den: den };
                var cungGio = lop.NGAYHOC === dich.NGAYHOC && k.tu >= dich.TU && k.den <= dich.DEN;
                var coPhong = hopLe.some(function (p) { return String(p.ID) === String(dich.IDPHONGHOC); });
                ngay = dich.NGAYHOC;
                tu = cungGio ? k.tu : dich.TU;
                den = tu + (k.den - k.tu);
                if (coPhong) phong = dich.IDPHONGHOC;
                else if (loai && dich.KIEUPHONG && dich.KIEUPHONG !== loai) canhBao.push('Lớp đang học phòng ' + tenLoai(loai) + ', không đổi sang phòng ' + dich.TENPHONG + ' (' + dich.KIEUPHONG + ') được — hãy chọn phòng cùng loại.');
                else canhBao.push('Phòng ' + dich.TENPHONG + ' không có trong danh mục phòng được đổi — hãy chọn phòng khác.');
                if (den > dich.DEN) canhBao.push('Buổi học dài ' + (k.den - k.tu + 1) + ' tiết, vượt ô trống T' + dich.TU + '-' + dich.DEN + ' — nên bấm "Kiểm tra lịch trùng" trước khi gửi.');
            }
            var nho = boNho[''] || [];
            return {
                ngay: ngay, tbd: isNaN(tu) ? '' : tu, tkt: isNaN(den) ? '' : den, phong: phong, dsPhong: hopLe, canhBao: canhBao,
                goiY: loai ? 'Chỉ hiện phòng ' + tenLoai(loai) + ', cùng loại phòng hiện tại' : '',
                /* Tên phòng của danh mục + sức chứa / loại phòng tra từ danh sách phòng đã nhớ (trùng ID) */
                tenPhong: function (p) {
                    var r = nho.filter(function (x) { return String(x.ID) === String(p.ID); })[0], sc = r ? sucChua(r) : null;
                    return (e(p.TENPHONGHOC) || e(p.MA)) + (sc !== null ? ' · ' + sc + ' chỗ' : '') + (r && r.KIEUPHONG ? ' · ' + r.KIEUPHONG : '');
                },
                /* capNhatPhongTrong_DoiLich của gốc (kéo 30/9): đổi ngày / tiết → hỏi máy chủ phòng trống ở ngày / giờ mới (bỏ qua
                   chính buổi đang đổi) → ô phòng chỉ còn phòng trống cùng loại. Thiếu ngày / tiết hoặc máy chủ lỗi → giữ danh sách đang có. */
                locPhong: function (v) {
                    var tbd = parseInt(v.tbd, 10), tkt = parseInt(v.tkt, 10), ten = loai ? tenLoai(loai) : '';
                    if (!ngayHopLe(v.ngay) || !gioTiet(tbd, false) || !gioTiet(tkt, true)) return { goiY: loai ? 'Chỉ hiện phòng ' + ten + ', cùng loại phòng hiện tại' : '' };
                    return goiTrong(v.ngay, tbd, tkt, loai, String(e(lop.IDLICHHOC))).then(function (rows) {
                        var m = {};
                        rows.forEach(function (r) { m[idTrong(r)] = 1; });
                        var ds = hopLe.filter(function (p) { return m[String(p.ID)]; });
                        return { ds: ds, goiY: ds.length + ' phòng ' + (ten ? ten + ' ' : '') + 'trống T' + tbd + '-' + tkt + ' ngày ' + v.ngay };
                    }, function (err) {
                        return { goiY: 'Chưa lấy được phòng trống (' + ((err && err.message) || 'lỗi') + '), đang hiện tất cả phòng ' + ten };
                    });
                },
                /* Chốt chặn: không cho đổi sang phòng khác loại (TH ↔ LT) */
                kiem: function (v) {
                    var moi = kieuPhong(v.phong);
                    return loai && moi && moi !== loai ? 'Lớp đang học phòng ' + tenLoai(loai) + ' — không đổi sang phòng ' + tenLoai(moi) + ' được.' : '';
                }
            };
        };
    }
    function moDoiLich(lop, dich) {
        if (!lop) { boChon(); return; }
        lg.doiLich.khoiTao(lop, null, { host: root, chuanBi: chuanBi(dich), batBuoc: true, onDong: boChon,
            thongBao: 'Gửi yêu cầu đổi lịch thành công. Lịch sẽ thay đổi sau khi yêu cầu được duyệt.' });
    }
    /* chonOTrong + genHtml_DSLopCuaToi của gốc */
    function chonOTrong(info, el) {
        var p = info.dong || {}, tuan = N.tuan;
        var dich = { IDPHONGHOC: p.ID, TENPHONG: tenGon(p), SUCCHUA: sucChua(p), KIEUPHONG: String(e(p.KIEUPHONG)).toUpperCase(), NGAYHOC: info.ngay, TU: info.tu, DEN: info.den };
        boChon(); oDangChon = el; el.classList.add('is-chon');
        var sangDoi = false, ds = [];
        var dlg = ui.dialog({
            title: 'Đổi lịch vào phòng trống', icon: 'fa-right-left', size: 'md',
            onClose: function () { if (!sangDoi) boChon(); },
            body: '<div class="lgn-dich"><i class="fa-light fa-door-open"></i><div><b>Phòng ' + esc(dich.TENPHONG) + (dich.SUCCHUA !== null ? ' · ' + dich.SUCCHUA + ' chỗ' : '') + (dich.KIEUPHONG ? ' · ' + esc(dich.KIEUPHONG) : '') + '</b>' +
                '<span>' + thu(dich.NGAYHOC) + ' ' + esc(dich.NGAYHOC) + ' · Tiết ' + dich.TU + '-' + dich.DEN + ' đang trống</span></div></div>' +
                '<div class="ums-legend">Chọn buổi dạy của bạn cần chuyển vào đây</div><div class="lgn-dslop" data-z="dslop">' + ui.empty('Đang tải lịch dạy của bạn...', 'fa-spinner fa-spin') + '</div>'
        });
        var host = dlg.body.querySelector('[data-z="dslop"]');
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-lop]');
            if (!b || b.disabled) return;
            var lop = ds[Number(b.getAttribute('data-lop'))];
            sangDoi = true; dlg.close();
            moDoiLich(lop, dich);
        });
        lichCuaToi(tuan.batdau, tuan.ketthuc).catch(function () { return []; }).then(function (lich) {
            if (dlg.closed) return;
            if (!lich.length) { host.innerHTML = ui.empty('Bạn không có buổi dạy nào trong tuần này (' + tuan.batdau + ' - ' + tuan.ketthuc + ').', 'fa-calendar-xmark'); return; }
            /* Buổi cùng ngày + nằm gọn trong ô trống (chỉ đổi phòng) xếp lên đầu; buổi khác loại phòng khoá, xếp cuối */
            var xep = lich.map(function (x) {
                var k = khoangTiet(x) || { tu: 0, den: 0 }, ng = parse(x.NGAYHOC), loai = kieuPhong(x.IDPHONGHOC);
                return { x: x, k: k, loai: loai, sai: !!(loai && dich.KIEUPHONG && loai !== dich.KIEUPHONG),
                    cung: x.NGAYHOC === dich.NGAYHOC && k.tu >= dich.TU && k.den <= dich.DEN, ng: ng ? ng.getTime() : 0 };
            });
            xep.sort(function (a, b) { return (a.sai - b.sai) || (b.cung - a.cung) || (a.ng - b.ng) || (a.k.tu - b.k.tu); });
            ds = xep.map(function (a) { return a.x; });
            host.innerHTML = xep.map(function (a, i) {
                var x = a.x, soTiet = a.k.den - a.k.tu + 1, nhan = '';
                if (a.sai) nhan = ui.badge('Lớp học phòng ' + tenLoai(a.loai) + ' — không đổi sang phòng ' + dich.KIEUPHONG, 'bad');
                else if (a.cung) nhan = ui.badge('Cùng giờ — chỉ đổi phòng', 'ok');
                else if (soTiet > dich.DEN - dich.TU + 1) nhan = ui.badge(soTiet + ' tiết — dài hơn ô trống', 'warn');
                return '<button type="button" class="lgn-lop' + (a.sai ? ' is-khoa' : '') + '" data-lop="' + i + '"' + (a.sai ? ' disabled' : '') + '>' +
                    '<span class="lgn-lop__ngay"><b>' + thu(x.NGAYHOC) + '</b>' + esc(String(e(x.NGAYHOC)).substr(0, 5)) + '</span>' +
                    '<span class="lgn-lop__nd"><b>' + esc(e(x.TENHOCPHAN)) + '</b><span>Tiết ' + a.k.tu + '-' + a.k.den + ' · ' + esc(gio(x)) + ' · Phòng ' + esc(e(x.TENPHONGHOC) || '?') +
                        (x.TENLOPHOCPHAN ? ' · ' + esc(x.TENLOPHOCPHAN) : '') + '</span>' + nhan + '</span>' +
                    '<span class="lgn-lop__chon">' + (a.sai ? '<i class="fa-light fa-lock"></i>' : 'Chọn <i class="fa-light fa-chevron-right"></i>') + '</span></button>';
            }).join('');
        });
    }

    var N = lg.nhieu(root, {
        tieuDe: 'Lịch giảng đường', tieuDeLoc: 'Lịch giảng đường', gon: true,
        gioiThieu: [],
        loc: '<div class="lgn-loc5">' +
            ui.field('Tòa nhà', '<select class="ums-select" data-f="toanha" data-ph="Chọn tòa nhà..."><option value="">Tất cả tòa nhà</option></select>') +
            ui.field('Phòng học', '<select class="ums-select" data-f="phong" multiple data-ph="Chọn nhiều phòng học..."></select>') +
            ui.field('Loại phòng', '<select class="ums-select" data-f="loai" data-no-s2>' + opt([['all', 'Tất cả loại phòng'], ['LT', 'Phòng lý thuyết (LT)'], ['TH', 'Phòng thực hành (TH)']]) + '</select>') +
            ui.field('Sức chứa (chỗ)', '<div class="lgn-succhua"><input type="number" min="0" class="ums-input" data-f="sctu" placeholder="Từ" autocomplete="off"><span>-</span>' +
                '<input type="number" min="0" class="ums-input" data-f="scden" placeholder="Đến" autocomplete="off"></div>') +
            /* Kéo gốc 1/10: "Phòng trống" Từ ngày – Đến ngày + Thứ + Tiết (thay ô một ngày dropLoc_NgayTrong của lần kéo 30/9) */
            '<div class="lgn-loc5__rong">' + ui.field('Phòng trống (từ ngày - đến ngày, thứ, tiết)', '<div class="lgn-loctrong">' +
                '<input class="ums-input" data-f="tungay" data-date placeholder="Từ ngày" title="Từ ngày (bỏ trống = không lọc)" autocomplete="off"><span>-</span>' +
                '<input class="ums-input" data-f="denngay" data-date placeholder="Đến ngày" title="Đến ngày (bỏ trống = chỉ 1 ngày)" autocomplete="off">' +
                /* Thứ: giá trị = Date.getDay() như gốc. Không nhập ngày mà chọn thứ → thứ đó của tuần đang xem */
                '<select class="ums-select" data-f="thu" data-no-s2 title="Chỉ xét thứ này trong khoảng ngày">' +
                    opt([['', 'Mọi thứ'], ['1', 'Thứ 2'], ['2', 'Thứ 3'], ['3', 'Thứ 4'], ['4', 'Thứ 5'], ['5', 'Thứ 6'], ['6', 'Thứ 7'], ['0', 'CN']]) + '</select>' +
                '<select class="ums-select" data-f="tiet" data-no-s2 title="Khung tiết">' +
                    opt([['1-3', 'T1-3'], ['4-6', 'T4-6'], ['7-9', 'T7-9'], ['10-12', 'T10-12'], ['13-15', 'T13-15'], ['1-6', 'Sáng (T1-6)'], ['7-12', 'Chiều (T7-12)']]) + '</select>' +
                '</div>') + '</div>' +
            ui.field('Cách tính hiệu suất', '<select class="ums-select" data-f="hieusuat" data-no-s2>' + opt(CHE_DO.map(function (c) { return [c.v, c.ten]; })) + '</select>') + '</div>',
        nut: ui.btn('search', { text: 'Xem lịch phòng', attr: { 'data-a': 'xem' }, icon: 'fa-eye' }) +
            ui.btn('search', { text: 'Xem tất cả lịch phòng', icon: 'fa-table-list', mod: 'out-primary', attr: { 'data-a': 'tatca' } }),
        chuGiai: '<span><i class="lgn-chugiai__o is-trong"></i>Trống 3 tiết (bấm để đổi lịch vào)</span><span><i class="lgn-chugiai__o is-ban"></i>Có lịch</span>',
        tenLuoi: 'Lịch tuần theo phòng học', cotDong: 'Phòng', cotHieuSuat: 'Hiệu suất<br>sử dụng', donVi: 'phòng', rong: rongLoc,
        /* Lọc phòng trống: dòng tóm tắt, lưới chỉ vẽ ngày đang lọc (trừ khi "Xem cả tuần"), viền xanh ô Trống đúng khung tiết,
           khoảng nhiều ngày → bảng phòng × ngày thay lưới; đổi tuần thì dời Từ / Đến ngày theo đúng số ngày chuyển (giữ thứ) */
        thanh: true,
        ngayHien: function () { return loc && !loc.bang && !xemCaTuan ? [loc.NGAY] : null; },
        oLoc: function (s, m) { return !!(loc && !loc.bang && s === loc.NGAY && m.tu <= loc.DEN && m.den >= loc.TU); },
        veThay: veBang,
        onTuan: function (moi, cu) {
            if (!cu || giuNgay) return;
            var lech = Math.round((parse(moi.batdau) - parse(cu.batdau)) / 864e5);
            if (!lech) return;
            ['tungay', 'denngay'].forEach(function (k) {
                var d = ngayHopLe(f(k).value.trim());
                if (!d) return;
                d.setDate(d.getDate() + lech);
                datNgay(f(k), dmy(d));
            });
        },
        trang: 10, songSong: 5, tienDo: true, bamThem: true,
        ca: [
            { ten: 'SÁNG', xuat: 'Sáng', tiet: 'T1-6', mau: '#FFF9E6', nen: '#FFFEF5' },
            { ten: 'CHIỀU', xuat: 'Chiều', tiet: 'T7-12', mau: '#E6F3FF', nen: '#F5F9FF' },
            { ten: 'TỐI', xuat: 'Tối', tiet: 'T13-15', mau: '#F0E6FF', nen: '#F9F5FF' }
        ],
        module: MODULE, khoangTiet: khoangTiet, oTrong: chonOTrong,
        caCua: caCua, tietCua: tietCua, cheDo: CHE_DO, boCN: true,
        dsDong: dsDong, dsGoc: function () { return goc; }, layLich: layLich, khoa: function (p) { return p.ID; },
        veDong: function (p) {
            var k = e(p.KIEUPHONG), sc = sucChua(p);
            return '<b>' + esc(tenGon(p)) + '</b>' +
                (sc !== null ? '<span class="ums-badge ums-badge--warn" title="Sức chứa"><i class="fa-light fa-users"></i> ' + sc + ' chỗ</span>' : '') +
                (k ? '<span class="ums-badge ums-badge--' + (String(k).toUpperCase() === 'TH' ? 'warn' : 'info') + '">' + esc(k) + '</span>' : '') +
                '<i>' + esc(e(p.MOTAKIEUPHONG) || (String(k).toUpperCase() === 'TH' ? 'Phòng thực hành' : '')) + '</i>';
        },
        dong3: function (r) { return esc(lg.sach(r.THONGTINGIANGVIEN)); },
        /* Thẻ trong ô hẹp bị cắt dòng → rê chuột hiện đủ: học phần, giờ / tiết, giảng viên */
        goiY: function (r) {
            var gv = lg.sach(r.THONGTINGIANGVIEN);
            return e(r.TENHOCPHAN) + '\n' + gio(r) + ' - ' + gioDen(r) + (r.TIETBATDAU ? ' (Tiết ' + e(r.TIETBATDAU) + '-' + e(r.TIETKETTHUC) + ')' : '') + (gv ? '\n' + gv : '');
        },
        chiTiet: function (r) {
            var t = tietCua(r);
            return { phong: e(r.TENPHONGHOC), ngay: e(r.NGAYHOC), gio: gio(r) + ' - ' + gioDen(r),
                tiet: 'Tiết ' + (t.batDau || '?') + ' - ' + (t.ketThuc || '?'), gv: lg.sach(r.THONGTINGIANGVIEN) };
        },
        /* Buổi này là của giảng viên đang đăng nhập → hiện nút "Yêu cầu đổi lịch" */
        nutChiTiet: {
            text: 'Yêu cầu đổi lịch', icon: 'fa-calendar-pen', kind: 'edit',
            hien: function (r) { return lichCuaToi(N.tuan.batdau, N.tuan.ketthuc).then(function (ds) { return timCuaToi(r, ds); }); },
            onClick: function (lop) { moDoiLich(lop, null); }
        },
        xuat: {
            tieuDe: 'Xuất Excel lịch phòng học', tieuDeTep: 'LỊCH GIẢNG NHIỀU PHÒNG HỌC', nhanLoc: 'Phòng học', cotDong: 'Phòng học', dem: true, songSong: 5,
            nhanPhamVi: ['Tất cả phòng', 'Theo bộ lọc đang xem', 'Chọn 1 phòng'], nhanChon: 'Chọn phòng', nhanChonTrong: 'Phòng', banBan: true,
            nhanDang: [['xls', 'Excel (.xls) — gộp ô, tô màu theo module 3 tiết'], ['csv', 'CSV (.csv) — dữ liệu thô, mở được bằng mọi phần mềm']],
            nhanMau: [['full', 'Đầy đủ thông tin — giờ, học phần, lớp, giảng viên'], ['busy', 'Đánh dấu phòng bận — ô vàng = bận, ô trắng = trống']],
            thongTin: 'Mỗi phòng xuất 5 dòng theo module 3 tiết (T1-3, T4-6, T7-9, T10-12, T13-15). Lịch dài hơn 3 tiết được gộp ô, ô trắng là phòng trống.',
            ghiChu: function (ban) {
                return ban ? 'Ghi chú: mỗi dòng là 1 module 3 tiết. Ô <span style="background:#FFEB3B">&nbsp;&nbsp;&nbsp;&nbsp;</span> = phòng đã có lịch sử dụng, ô trắng = phòng trống'
                    : 'Ghi chú: mỗi dòng là 1 module 3 tiết. Ô xanh = có lịch (lịch dài hơn 3 tiết được gộp ô), ô trắng = phòng trống';
            },
            ghiChuCsv: function (ban) { return 'Ghi chú: mỗi dòng là 1 module 3 tiết; ô trống = phòng trống module đó' + (ban ? '; ô "BẬN" = đã có lịch' : ''); },
            tenChon: tenPhong, tenDong: function (p) { return esc(tenPhong(p)); }, csvDau: ['Phòng học'], csvDong: function (p) { return [tenPhong(p)]; },
            excelO: function (r) {
                var t = tietChu(r);
                return esc(gio(r) + '-' + gioDen(r) + (t ? ' (' + t + ')' : '')) + '<br>' + esc(e(r.TENHOCPHAN)) +
                    '<br>Lớp: ' + esc(e(r.TENLOPHOCPHAN)) + '<br>GV: ' + esc(lg.sach(r.THONGTINGIANGVIEN));
            },
            csvO: function (r) {
                var t = tietChu(r);
                return gio(r) + '-' + gioDen(r) + (t ? ' (' + t + ')' : '') + ' ' + e(r.TENHOCPHAN) +
                    ' - Lớp: ' + e(r.TENLOPHOCPHAN) + ' - GV: ' + lg.sach(r.THONGTINGIANGVIEN);
            }
        }
    });

    ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4BRIVLiAPKSAP', func: 'PKG_CONGTHONGTINCANBO.LayDSToaNha', strNguoiThucHien_Id: uid() })
        .then(function (r) { pat.fill(f('toanha'), arr(r.data), { name: 'TENTOANHA', head: 'Tất cả tòa nhà' }); }).catch(function (err) { ums.api.handle(err, 'tòa nhà'); });
    napOPhong('').catch(function (err) { ums.api.handle(err, 'phòng học'); });

    function doiToaNha() { napOPhong(f('toanha').value).then(function () { if (N.tuan) N.tai(); }).catch(function (err) { ums.api.handle(err, 'phòng học'); }); }
    if (window.jQuery) jQuery(f('toanha')).on('change', doiToaNha); else f('toanha').addEventListener('change', doiToaNha);
    f('loai').addEventListener('change', function () { if (N.tuan) N.tai(); });
    f('sctu').addEventListener('change', function () { if (N.tuan) N.tai(); });
    f('scden').addEventListener('change', function () { if (N.tuan) N.tai(); });
    /* Lọc phòng trống. Ngày: chỉ nhập "Đến ngày" → coi là một ngày đó; Đến < Từ → kéo Đến về bằng Từ;
       lọc đúng một ngày nằm ngoài tuần đang xem → nhảy sang tuần chứa ngày đó (tự nạp lại, không dời ngày lọc) */
    function doiNgayLoc() {
        var tu = f('tungay').value.trim(), den = f('denngay').value.trim();
        if (!tu && den) { tu = den; datNgay(f('tungay'), tu); }
        if (tu && den && ngayHopLe(tu) && ngayHopLe(den) && parse(den) < parse(tu)) { den = tu; datNgay(f('denngay'), den); }
        if (!N.tuan) return;
        var dTu = ngayHopLe(tu);
        if (dTu && (!den || den === tu) && (dTu < parse(N.tuan.batdau) || dTu > parse(N.tuan.ketthuc))) {
            giuNgay = true;
            N.chon(tu);                 // onTuan chạy đồng bộ trong lúc này → giuNgay chặn việc dời ngày lọc
            giuNgay = false;
            return;
        }
        N.tai();
    }
    f('tungay').addEventListener('change', doiNgayLoc);
    f('denngay').addEventListener('change', doiNgayLoc);
    f('thu').addEventListener('change', function () { if (N.tuan) N.tai(); });
    f('tiet').addEventListener('change', function () {
        if (!f('tungay').value.trim() && !f('thu').value) return;     // chưa lọc ngày / thứ thì đổi tiết không cần tải lại
        if (N.tuan) N.tai();
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'xem') {
            if (!f('toanha').value && !pat.val(f('phong')) && !f('sctu').value && !f('scden').value) { ui.toast('Vui lòng chọn tòa nhà, phòng học hoặc sức chứa', 'warn'); return; }
            N.tai();
        } else if (a === 'tatca') {
            f('toanha').value = ''; f('sctu').value = ''; f('scden').value = '';
            if (window.jQuery) { jQuery(f('toanha')).trigger('change.select2'); jQuery(f('phong')).val(null).trigger('change.select2').trigger('ums:refresh'); }
            napOPhong('').then(function () { N.tai(); });
        } else if (a === 'loc-catuan') {         // đổi qua lại một ngày / cả tuần — vẽ lại từ dữ liệu đang có
            xemCaTuan = !xemCaTuan; capNhatThanh(soPhongLoc); N.veLai();
        } else if (a === 'loc-motphan') {        // chỉ phòng trống đủ mọi ngày ↔ cả phòng trống một phần (kết quả đã nhớ)
            locMotPhan = !locMotPhan; N.tai();
        } else if (a === 'loc-bo') {
            datNgay(f('tungay'), ''); datNgay(f('denngay'), ''); f('thu').value = '';
            N.tai();
        }
    });
})();
