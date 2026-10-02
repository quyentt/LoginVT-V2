/* =========================================================================
   dangky — Đăng ký học (Cổng sinh viên, vai trò thủ vai: userId của phiên = ID người học)
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/dangky.html + script/dangky.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   Bố cục GIỮ như gốc — HAI CỘT (col-md-3 | col-md-9):
     trái : khối người học (ảnh, họ tên, mã số) + Số dư tài khoản · Số phát sinh thêm trong đợt ·
            Tổng lớp đã đăng ký · Số tín chỉ đã đăng ký / tối đa / tối thiểu;
            "Bộ lọc tìm kiếm": Giảng viên, Thứ học, Phương án đăng ký, Lọc trùng, Tìm kiếm, Báo cáo
     phải : Chương trình đào tạo → Kế hoạch (+ thời gian đăng ký) → Học phần (ô tìm) → Lớp học phần (thẻ)
   Lời gọi (chép nguyên action / func / tham số / cột):
     TS_DKH_CHUNG1_MH  PKG_DANGKYHOC_CHUNG1.LayDSChuongTrinh              (DAOTAO_TOCHUCCHUONGTRINH_ID/_TEN, QLSV_NGUOIHOC_*)
     NS_DKH_CHUNG2_MH  pkg_dangkyhoc_chung2.LayDSKeHoachDangKyHoc        (MAKEHOACH, TENKEHOACH, NGAYBATDAU, GIO…/PHUT…, SOTINCHI…)
     XLHV_DKH_CHUNG3_MH pkg_dangkyhoc_chung3.LayDSHocPhanDangToChuc      (DAOTAO_HOCPHAN_ID/_MA/_TEN, DADANGKY)
     TN_DKH_CHUNG4_MH  pkg_dangkyhoc_chung4.LayDSLopHocPhanDangToChuc    → { rs, rsNhomKiemSoat }
     DKH_Chung_MH      pkg_dangkyhoc_chung.LayDSLopHocPhanDangToChuc     (nhóm lớp) → { rs, rsThuocTinhLopHocPhan }
     XLHV_DKH_CHUNG6_MH PKG_DANGKYHOC_CHUNG6.LayKetQuaDangKyLopHocPhan / LayGiangVienTheoHocPhan / LayThuHocTheoHocPhan
     TC_ThongTin_MH    pkg_taichinh_thongtin.LayDSTinhTrangTaiChinhDKH   (Id = số dư; rsConPhaiNopTrongDotDK, rsConPhaiNopHienTai, rsConDuHienTai)
     TS_DKH_CHUNG7_MH  PKG_DANGKYHOC_CHUNG7.LayDSLopHocPhanDangToChuc (đổi lịch) / LayLichTuanTheoLopHocPhan / LayDSLopHocPhanTheoNhomKS
     GHI — { strVal: edu.system.atob(JSON, "chaolong") } như gốc (ums.dky.xorB64), JSON bên trong có action:
       DKH_DangKyMH/DangKyHocTrucTiep · ThucHienHuyDangKyHoc · ThucHienDoiLichDangKyHoc
     Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_DangKyHoc") — gốc không có vùng _Import → import: false.
   Khác bản gốc (cách làm, không đổi bố cục):
     · Khung chi tiết "rê chuột" của Số dư / Số phát sinh (money-class-detail) → bấm mở HỘP (bảng phát sinh
       rộng 10 cột, không vừa thẻ rê chuột). Gốc cũng chỉ nạp tài chính khi BẤM — giữ vậy.
       "Tổng lớp đã đăng ký": bấm mở hộp KẾT QUẢ ĐĂNG KÝ HỌC như gốc; danh sách rê chuột giữ bằng ums.ui.hoverCard.
     · Bỏ trễ 500 ms (setTimeout) trước mỗi lần nạp; ô chọn thứ/giảng viên là ô đánh dấu như gốc.
     · Sau Hủy / Đổi lịch thành công: nạp lại hộp kết quả đang mở (gốc để nguyên danh sách cũ — bấm Hủy lần nữa là lỗi);
       hộp đổi lịch đóng lại (gốc xoá trắng nội dung nhưng để hộp mở).
     · Nút × (btn-close-1) trên mỗi thẻ lớp: gốc không có xử lý, chỉ trang trí → bỏ.
     · Tiền trên thẻ lớp định dạng dấu phẩy (gốc chỗ định dạng chỗ không).
   Bỏ (mã chết của gốc): runAA / iSoGiayCho (đếm giây chờ đã comment), toggle_detail, zone-bus, masonry,
     hai hộp "Điểm danh" / "Điểm quá trình" (gốc có hộp + trình xử lý nhưng KHÔNG nơi nào vẽ nút mở — xem
     tracuu, nơi hai hộp đó thật sự dùng).
   Giữ như gốc, cần kiểm (ghi báo cáo):
     · Đổi lịch lớp thuộc NHÓM (MANHOMLOP): Cu_Ids / Moi_Ids đẩy ID lớp đang đổi cho MỌI lớp cùng nhóm
       (nhánh else dùng objDoiLichHoc thay vì e) — chuỗi gửi đi giữ y gốc.
     · Đăng ký thành công chỉ khi máy chủ trả Id (Success mà không có Id thì im lặng, như gốc).
     · Hộp "Chọn thêm": không kiểm đã chọn đủ nhóm lớp chưa (như gốc).
   Kéo gốc 30/9:
     · Đăng ký / Hủy / Đổi lịch thành công → nạp lại Kết quả đăng ký (số lớp, số tín chỉ) + Tình trạng tài chính
       (gốc trước đó chú thích bỏ) và nháy dòng "đã đăng ký" ở cột trái (highlightDaDangKy — nền vàng nhấp nháy 3 lần,
       lớp .is-nhay trong _dangky.css; không nháy khi người dùng chọn giảm chuyển động).
     · Nhãn dòng đó đổi theo gốc: "Tổng lớp đã đăng ký:" → "Xem và xóa, đổi lớp:".
     · "Thời gian đăng ký học phần": ngày yyyymmdd → dd/mm/yyyy; giờ:phút thêm số 0; lấy GIODANGKYTRONGNGAYDAU…,
       không có thì NGAYBATDAU_GIO / _PHUT, NGAYKETTHUC_GIO / _PHUT; trống cả giờ lẫn phút → 00:00 / 23:59.
     · Tên thuộc tính lớp không dấu → có dấu (fixThuocTinhTen → tenTT(): thuc hanh → Thực hành, ly thuyet, thao luan,
       bai tap, thuc tap, thi nghiem, do an). Gốc áp ở ô nhóm, thẻ lớp nhóm, thẻ đổi lịch; bản mới áp thêm thẻ rê chuột
       "đã đăng ký" (cùng dữ liệu, v2 tự vẽ).
     · Nút xem chi tiết ở vùng nhóm lớp (#zoneThuocTinh, #zoneTHTL): bản mới vốn đã có (data-xem trong hộp Chọn thêm).
     · Đổi lịch: gốc bỏ strNguoiThucVai_Id khỏi JSON ghi → bỏ theo (vỏ tự chèn ở lời gọi ngoài).
     · Cuộn tới vùng lớp học phần: block 'nearest' như gốc (trước 'start').
     · Bỏ qua (CSS vỏ cũ): tương phản chữ trên nền xanh, nút không xuống dòng, hộp chọn thêm 95vw.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, D = ums.dky;
    var root = document.getElementById('dkh-dangky');
    var e = D.e, arr = D.arr, uid = D.uid, esc = function (s) { return ui.esc(e(s)); };
    var sv = uid();                               // me.strSinhVien_Id = edu.system.userId

    var st = { ct: [], ctId: '', kh: [], khId: '', hp: [], hpChon: '', daDK: [], lhp: { rs: [], rsNhomKiemSoat: [] }, kq: [], taiChinh: null };

    var A = {
        ct:   { action: 'TS_DKH_CHUNG1_MH/DSA4BRICKTQuLyYVMygvKQPP', func: 'PKG_DANGKYHOC_CHUNG1.LayDSChuongTrinh' },
        kh:   { action: 'NS_DKH_CHUNG2_MH/DSA4BRIKJAkuICIpBSAvJgo4CS4i', func: 'pkg_dangkyhoc_chung2.LayDSKeHoachDangKyHoc' },
        hp:   { action: 'XLHV_DKH_CHUNG3_MH/DSA4BRIJLiIRKSAvBSAvJhUuAik0IgPP', func: 'pkg_dangkyhoc_chung3.LayDSHocPhanDangToChuc' },
        lhp:  { action: 'TN_DKH_CHUNG4_MH/DSA4BRINLjEJLiIRKSAvBSAvJhUuAik0IgPP', func: 'pkg_dangkyhoc_chung4.LayDSLopHocPhanDangToChuc' },
        nhom: { action: 'DKH_Chung_MH/DSA4BRINLjEJLiIRKSAvBSAvJhUuAik0IgPP', func: 'pkg_dangkyhoc_chung.LayDSLopHocPhanDangToChuc' },
        kq:   { action: 'XLHV_DKH_CHUNG6_MH/DSA4CiQ1EDQgBSAvJgo4DS4xCS4iESkgLwPP', func: 'PKG_DANGKYHOC_CHUNG6.LayKetQuaDangKyLopHocPhan' },
        gv:   { action: 'XLHV_DKH_CHUNG6_MH/DSA4BiggLyYXKCQvFSkkLgkuIhEpIC8P', func: 'PKG_DANGKYHOC_CHUNG6.LayGiangVienTheoHocPhan' },
        thu:  { action: 'XLHV_DKH_CHUNG6_MH/DSA4FSk0CS4iFSkkLgkuIhEpIC8P', func: 'PKG_DANGKYHOC_CHUNG6.LayThuHocTheoHocPhan' },
        tc:   { action: 'TC_ThongTin_MH/DSA4BRIVKC8pFTMgLyYVICgCKSgvKQUKCQPP', func: 'pkg_taichinh_thongtin.LayDSTinhTrangTaiChinhDKH' },
        doi:  { action: 'TS_DKH_CHUNG7_MH/DSA4BRINLjEJLiIRKSAvBSAvJhUuAik0IgPP', func: 'PKG_DANGKYHOC_CHUNG7.LayDSLopHocPhanDangToChuc' },
        lich: { action: 'TS_DKH_CHUNG7_MH/DSA4DSgiKRU0IC8VKSQuDS4xCS4iESkgLwPP', func: 'PKG_DANGKYHOC_CHUNG7.LayLichTuanTheoLopHocPhan' },
        pa:   { action: 'TS_DKH_CHUNG7_MH/DSA4BRINLjEJLiIRKSAvFSkkLg8pLiwKEgPP', func: 'PKG_DANGKYHOC_CHUNG7.LayDSLopHocPhanTheoNhomKS' }
    };
    function goi(a, o) { return ums.api.call(Object.assign({}, A[a], o)); }
    /* Lời GHI của DKH_DangKyMH: JSON bên trong mã hoá XOR "chaolong" gửi trong strVal (như gốc) */
    function ghi(inner) { return ums.api.call({ action: inner.action, strVal: D.xorB64(JSON.stringify(inner), 'chaolong') }); }

    /* ---------- Khung ---------------------------------------------------- */
    /* fixThuocTinhTen của gốc (kéo gốc 30/9): tên thuộc tính lớp không dấu → có dấu */
    var TT_TEN = { 'thuc hanh': 'Thực hành', 'ly thuyet': 'Lý thuyết', 'thao luan': 'Thảo luận', 'bai tap': 'Bài tập',
        'thuc tap': 'Thực tập', 'thi nghiem': 'Thí nghiệm', 'do an': 'Đồ án' };
    function tenTT(s) { s = e(s); return TT_TEN[String(s).toLowerCase().trim()] || s; }
    function muc(icon, chu, z, cls) {
        return '<i class="fa-light ' + icon + '"></i><span>' + esc(chu) + '</span><b class="' + (cls || '') + '" data-z="' + z + '"></b>';
    }
    var trai =
        pat.panel({ title: false, body:
            '<div class="dky-sv"><div class="dky-sv__anh" data-z="anh"><i class="fa-light fa-user"></i></div>' +
            '<div class="dky-sv__ten"><b data-z="ten"></b><span>Mã số: <span data-z="ma"></span></span></div></div>' +
            '<ul class="dky-tt">' +
            '<li><button type="button" class="dky-tt__nut" data-a="taichinh" data-loai="du">' + muc('fa-sack-dollar', 'Số dư tài khoản hiện tại:', 'soDu', 'dky-xanh') + '</button></li>' +
            '<li><button type="button" class="dky-tt__nut" data-a="taichinh" data-loai="ps">' + muc('fa-money-check-pen', 'Số phát sinh thêm trong đợt:', 'phatSinh', 'dky-cam') + '</button></li>' +
            '<li><button type="button" class="dky-tt__nut" data-a="ketqua">' + muc('fa-chalkboard-user', 'Xem và xóa, đổi lớp:', 'soLop') + '</button></li>' +
            '<li>' + muc('fa-file-signature', 'Số tín chỉ đã đăng ký:', 'tcDaDK') + '</li>' +
            '<li>' + muc('fa-file-arrow-up', 'Số tín chỉ tối đa:', 'tcMax') + '</li>' +
            '<li>' + muc('fa-file-arrow-down', 'Số tín chỉ tối thiểu:', 'tcMin') + '</li>' +
            '</ul>' }) +
        pat.panel({ title: 'Bộ lọc tìm kiếm', icon: 'fa-filter', body:
            '<div class="dky-loc"><h5 class="dky-loc__tieu">Giảng viên</h5><div class="ums-checklist" data-z="gv"></div></div>' +
            '<div class="dky-loc"><h5 class="dky-loc__tieu">Thứ học</h5><div class="ums-checklist" data-z="thu"></div></div>' +
            '<div class="dky-loc"><h5 class="dky-loc__tieu">Phương án đăng ký</h5><div class="dky-pa" data-z="pa"></div></div>' +
            '<div class="dky-loc"><label class="ums-check"><input type="checkbox" data-f="locTrung"><span>Lọc trùng</span></label></div>' +
            '<div class="dky-loc dky-loc__nut">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '<span data-z="report"></span></div>' });
    var phai =
        pat.panel({ title: 'Chương trình đào tạo', icon: 'fa-graduation-cap', zone: 'ct' }) +
        pat.panel({ title: 'Kế hoạch', icon: 'fa-calendar-check', body: '<div data-z="kh"></div><div class="dky-thoigian" data-z="tg"></div>' }) +
        pat.panel({ title: 'Học phần', icon: 'fa-book', body:
            '<div class="ums-searchbar ums-searchbar--sm"><span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
            '<input class="ums-searchbar__input" data-f="timHP" type="text" autocomplete="off" placeholder="Tìm kiếm học phần"></div>' +
            '<div class="dky-hp" data-z="hp"></div>' }) +
        pat.panel({ title: 'Lớp học phần', icon: 'fa-chalkboard-user', zone: 'lhp', flush: true, count: 'nLhp' });
    root.innerHTML = pat.page('Đăng ký học', '') +
        '<div class="ums-master dky"><aside class="ums-master__side">' + trai + '</aside><div class="ums-master__main">' + phai + '</div></div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function dat(k, v) { z(k).textContent = e(v); }
    function dangTai(el) { el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
    function danhDau(host) {          // edu.extend.getCheckedCheckBoxByClassName → chuỗi id, ngăn phẩy
        return Array.prototype.slice.call(host.querySelectorAll('input:checked')).map(function (x) { return x.value; }).join(',');
    }

    /* ---------- Chương trình đào tạo (genList_ChuongTrinh) --------------- */
    function napCT() {
        dangTai(z('ct'));
        goi('ct', { strQLSV_NguoiHoc_Id: sv, strNguoiThucHien_Id: uid() }).then(function (r) {
            st.ct = arr(r.data);
            st.ctId = st.ct.length ? e(st.ct[0].DAOTAO_TOCHUCCHUONGTRINH_ID) : '';
            veCT();
            var d = st.ct[0];
            if (d) {
                dat('ten', e(d.QLSV_NGUOIHOC_HODEM) + ' ' + e(d.QLSV_NGUOIHOC_TEN));
                dat('ma', d.QLSV_NGUOIHOC_MASO);
                if (d.QLSV_NGUOIHOC_ANH && ums.state.mode !== 'demo' && ums.files) {
                    var img = new Image();
                    img.alt = '';
                    img.onload = function () { z('anh').innerHTML = ''; z('anh').appendChild(img); };
                    img.src = ums.files.url(d.QLSV_NGUOIHOC_ANH);
                }
            }
            napKH();
        }).catch(function (err) { z('ct').innerHTML = ui.fail(err.message); ums.api.handle(err, 'chương trình đào tạo'); });
    }
    function veCT() {
        z('ct').innerHTML = st.ct.length ? ui.chips(st.ct.map(function (c) { return { key: e(c.DAOTAO_TOCHUCCHUONGTRINH_ID), label: e(c.DAOTAO_TOCHUCCHUONGTRINH_TEN) }; }), st.ctId)
            : ui.empty('Không có chương trình đào tạo');
    }

    /* ---------- Kế hoạch (genList_KeHoach + showThoiGianDangKy) ---------- */
    function napKH() {
        dangTai(z('kh'));
        goi('kh', { strDaoTao_ChuongTrinh_Id: st.ctId, strQLSV_NguoiHoc_Id: sv, strNguoiThucHien_Id: uid() }).then(function (r) {
            st.kh = arr(r.data);
            st.khId = st.kh.length ? e(st.kh[0].ID) : '';
            veKH();
            z('tg').innerHTML = '';
            if (st.kh.length) thoiGian(st.kh[0]);
            napHP();
            napTom();
        }).catch(function (err) { z('kh').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kế hoạch đăng ký'); });
    }
    function veKH() {
        z('kh').innerHTML = st.kh.length ? ui.chips(st.kh.map(function (k) { return { key: e(k.ID), label: e(k.MAKEHOACH) + ' - ' + e(k.TENKEHOACH) }; }), st.khId)
            : ui.empty('Không có kế hoạch đăng ký');
    }
    /* showThoiGianDangKy (kéo gốc 30/9): yyyymmdd → dd/mm/yyyy, giờ:phút thêm số 0, mặc định 00:00 – 23:59 */
    function ngayTG(s) { s = String(e(s)); return /^\d{8}$/.test(s) ? s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4) : s; }
    function so2(v) { v = String(e(v)); return v === '' ? '' : (v.length < 2 ? '0' + v : v); }
    function gioPhut(gio, phut, macDinh) {
        var g = so2(gio), p = so2(phut);
        return g === '' && p === '' ? macDinh : (g || '00') + ':' + (p || '00');
    }
    function lay(a, b) { return a !== null && a !== undefined && a !== '' ? a : b; }
    function thoiGian(d) {
        var h = '<b>Thời gian đăng ký học phần:</b> ' + esc(
            ngayTG(d.NGAYBATDAU) + ' ' + gioPhut(lay(d.GIODANGKYTRONGNGAYDAU, d.NGAYBATDAU_GIO), lay(d.PHUTDANGKYTRONGNGAYDAU, d.NGAYBATDAU_PHUT), '00:00') +
            ' - ' +
            ngayTG(d.NGAYKETTHUC) + ' ' + gioPhut(lay(d.GIOKETTHUCTRONGNGAYCUOI, d.NGAYKETTHUC_GIO), lay(d.PHUTKETTHUCTRONGNGAYCUOI, d.NGAYKETTHUC_PHUT), '23:59'));
        if (d.THONGTINTHOIGIANRUTHP) h += '<br><b>Thời gian chỉ rút học phần:</b> ' + esc(d.THONGTINTHOIGIANRUTHP);
        z('tg').innerHTML = h;
        dat('tcDaDK', d.SOTINCHIDADANGKY);
        dat('tcMax', d.SOTINCHITOIDACHUONGTRINH);
        dat('tcMin', d.SOTINCHITOITHIEUCHUONGTRINH);
    }

    /* ---------- Học phần (genList_HocPhan) ------------------------------- */
    /* Học phần đang chọn = mục đang sáng; gốc đọc lại từ DOM (getIdByZone) nên
       mục cũ không còn trong danh sách mới thì coi như chưa chọn. */
    function hpId() { return st.hp.some(function (h) { return e(h.DAOTAO_HOCPHAN_ID) === st.hpChon; }) ? st.hpChon : ''; }
    function napHP() {
        /* Không có kế hoạch đăng ký nào: gốc vẫn gọi LayDSHocPhanDangToChuc với kế hoạch rỗng → máy chủ trả
           "Phai chon ke hoach dang ky hoc" hiện thành lỗi trước mặt SV (kiểm trên host 2026-09-26) → báo trống, không gọi. */
        if (!st.khId) {
            st.hp = []; st.daDK = []; st.hpChon = '';
            z('hp').innerHTML = ui.empty('Chưa có kế hoạch đăng ký — chưa có học phần để đăng ký');
            z('thu').innerHTML = ''; z('gv').innerHTML = '';
            napLHP();
            return;
        }
        dangTai(z('hp'));
        goi('hp', { strDangKy_KeHoachDangKy_Id: st.khId, strDaoTao_ChuongTrinh_Id: st.ctId, strQLSV_NguoiHoc_Id: sv, strNguoiThucHien_Id: uid() }).then(function (r) {
            st.hp = arr(r.data);
            st.daDK = st.hp.filter(function (h) { return h.DADANGKY > 0; }).map(function (h) { return e(h.DAOTAO_HOCPHAN_ID); });
            // Chọn sẵn: học phần đang chọn trước đó, không có thì học phần đầu tiên CHƯA đăng ký (như gốc)
            if (!st.hpChon) {
                var dau = st.hp.filter(function (h) { return h.DADANGKY === 0 || h.DADANGKY === '0'; })[0];
                st.hpChon = dau ? e(dau.DAOTAO_HOCPHAN_ID) : '';
            }
            veHP();
            z('thu').innerHTML = ''; z('gv').innerHTML = '';
            napLHP();
            napThu();
            napGV();
        }).catch(function (err) { z('hp').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần'); });
    }
    function veHP() {
        z('hp').innerHTML = st.hp.length ? st.hp.map(function (h, i) {
            return '<button type="button" class="dky-hp__muc' + (e(h.DAOTAO_HOCPHAN_ID) === st.hpChon ? ' is-active' : '') +
                (h.DADANGKY > 0 ? ' is-dk' : '') + '" data-hp="' + i + '">' +
                '<i class="fa-light fa-angle-right"></i><span>' + esc(e(h.DAOTAO_HOCPHAN_MA) + ' - ' + e(h.DAOTAO_HOCPHAN_TEN)) + '</span>' +
                (h.DADANGKY > 0 ? '<i class="fa-solid fa-circle-check dky-xong" title="Đã đăng ký"></i>' : '') + '</button>';
        }).join('') : ui.empty('Không có học phần đang tổ chức');
        locHP();
    }
    /* Ô "Tìm kiếm học phần": lọc ở máy trạm, bỏ dấu (edu.system.change_alias) */
    function boDau(s) { return String(e(s)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function locHP() {
        var q = boDau(f('timHP').value);
        Array.prototype.forEach.call(z('hp').querySelectorAll('[data-hp]'), function (b) { b.hidden = boDau(b.textContent).indexOf(q) < 0; });
    }

    /* ---------- Lớp học phần + Phương án (genList_LopHocPhan / genList_PhuongAn) */
    function napLHP(cuon) {
        var hp = hpId();
        if (!hp) { st.lhp.rs = []; veLHP(); return; }
        dangTai(z('lhp'));
        goi('lhp', {
            strThuHoc: danhDau(z('thu')),
            strNhanSu_HoSoNhanSu_v2_Id: danhDau(z('gv')),
            dChiLayCacLopKhongTrung: f('locTrung').checked ? 1 : 0,
            strThuocTinhLop_Id: '', strMaNhomLop: '', dLaLopHocPhanChinh: 1,
            strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: st.ctId, strDangKy_KeHoachDangKy_Id: st.khId,
            strDaoTao_HocPhan_Id: hp, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var d = r.data || {};
            st.lhp = { rs: arr(d.rs), rsNhomKiemSoat: arr(d.rsNhomKiemSoat) };
            veLHP();
            vePA();
            if (cuon && st.lhp.rs.length) z('lhp').closest('.ums-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }).catch(function (err) { z('lhp').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lớp học phần'); });
    }
    function veLHP() {
        var rs = st.lhp.rs;
        z('nLhp').textContent = rs.length ? '(' + rs.length + ')' : '';
        pat.cards({
            el: z('lhp'), items: rs, empty: hpId() ? 'Không có lớp học phần' : 'Chọn học phần để xem lớp học phần',
            render: function (r) {
                return D.the(r, { dong: ['Lý thuyết', 'Thứ: ' + e(r.THUHOC), 'Tổng số: ' + e(r.SOLUONGDUKIENHOC), 'Đã đăng ký: ' + e(r.SOTHUCTEDANGKYHOC)], gia: r.PHISAUKHITRUMIEN });
            },
            actions: function (r, i) {
                var daDK = st.daDK.indexOf(e(r.DAOTAO_HOCPHAN_ID)) >= 0;
                var soLop = Number(r.SOLOPTHUOCCUNGNHOM) - 1;
                if (daDK) soLop++;
                // Học phần đã đăng ký: gốc đổi lớp nút thành btnDangKyHocPhan1 / btnChonHocPhan1 (không có xử lý) → khoá
                return D.nut('out-primary', 'Xem chi tiết', { 'data-ct': i }) +
                    (Number(r.SOLOPTHUOCCUNGNHOM) === 1
                        ? D.nut('save', daDK ? 'Đã đăng ký HP' : 'Đăng ký', { 'data-dk': i }, daDK)
                        : D.nut('warn', (daDK ? 'Đủ ' : 'Chọn thêm ') + soLop + ' lớp', { 'data-chon': i }, daDK));
            }
        });
    }
    function vePA() {
        z('pa').innerHTML = st.lhp.rsNhomKiemSoat.map(function (p, i) {
            return '<button type="button" class="dky-pa__muc" data-pa="' + i + '"><span>' + esc(p.TENNHOM) + '</span><i class="fa-light fa-arrow-right"></i></button>';
        }).join('');
    }

    /* ---------- Thứ học / Giảng viên (genList_ThuHoc / genList_GiangVien) ---- */
    function thamSoLoc() {
        return { strDangKy_KeHoachDangKy_Id: st.khId, strDaoTao_HocPhan_Id: hpId(), strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: st.ctId, strNguoiThucHien_Id: uid() };
    }
    function oDanhDau(id, chu) {
        return '<label class="ums-check"><input type="checkbox" value="' + esc(id) + '"><span>' + esc(chu) + '</span></label>';
    }
    function napThu() {
        goi('thu', thamSoLoc()).then(function (r) {
            z('thu').innerHTML = arr(r.data).map(function (x) { return oDanhDau(x.THUHOC, x.THUHOC); }).join('');
        }).catch(function (err) { ums.api.handle(err, 'thứ học'); });
    }
    function napGV() {
        goi('gv', thamSoLoc()).then(function (r) {
            z('gv').innerHTML = arr(r.data).map(function (x) { return oDanhDau(x.ID, e(x.MASO) + ' - ' + e(x.HODEM) + ' ' + e(x.TEN)); }).join('');
        }).catch(function (err) { ums.api.handle(err, 'giảng viên'); });
    }

    /* ---------- Đăng ký (save_KeHoachDangKy) ----------------------------- */
    function hoiDangKy(lop) {
        return ui.confirm('Bạn có chắc chắn muốn đăng ký lớp học phần: ' + e(lop.TENLOP), { title: 'Xác nhận đăng ký', ok: 'Đồng ý', cancel: 'Quay lại' });
    }
    function dangKy(ids) {
        st.hpChon = hpId();                        // giữ học phần đang chọn khi nạp lại
        var aJson = st.lhp.rs.filter(function (r) { return e(r.ID) === ids[0]; })[0];
        if (!aJson) { ui.toast('Lớp học phần không đúng học phần. Hãy chọn lại học phần!', 'warn'); return; }
        var inner = {
            action: 'DKH_DangKyMH/DangKyHocTrucTiep',
            strThuocTinhLop_Id: '', strMaNhomLop: '', dLaLopHocPhanChinh: 1,
            strQLSV_NguoiHoc_Id: sv,
            strDaoTao_ChuongTrinh_Id: aJson.DAOTAO_CHUONGTRINH_ID,
            strDangKy_KeHoachDangKy_Id: aJson.DANGKY_KEHOACHDANGKY_ID,
            strDaoTao_HocPhan_Id: aJson.DAOTAO_HOCPHAN_ID,
            strNguoiThucHien_Id: uid(),
            strDangKy_LopHocPhan_Ids: ids.join(',')
        };
        ghi(inner).then(function (r) {
            if (r.raw && r.raw.Id) {
                ui.toast('Đăng ký thành công!', 'ok');
                napHP();
                sauGhi();
            }
        }).catch(function (err) { ums.api.handle(err, 'đăng ký lớp học phần'); });
    }

    /* ---------- Hộp "Chọn thêm … lớp" (loadMonTheoNhom + genList_NhomLopHocPhan) */
    function chonNhom(lop) {
        var nhom = { tt: [], rs: [], chon: {}, loc: '' };
        var dlg = ui.dialog({
            title: lop.TENLOP, icon: 'fa-chalkboard-user', size: 'xl',
            body: '<div class="dky-chon"><h5 class="dky-chon__tieu">ĐỂ HOÀN THÀNH QUÁ TRÌNH ĐĂNG KÝ HỌC HỌC PHẦN BẠN CẦN CHỌN ĐỦ CÁC NHÓM LỚP SAU</h5>' +
                '<div class="dky-chon__o" data-x="o"></div></div>' +
                '<h5 class="dky-chon__tieu">DANH SÁCH CÁC LỚP HỌC PHẦN THẢO LUẬN / THỰC HÀNH</h5><div class="dky" data-x="ds">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Đăng ký', kind: 'save', onClick: function () {
                // Lớp chính + các lớp đã chọn vào ô nhóm (cùng MANHOMLOP với lớp chính) — btnDangKyLopHocPhanDaChon khi bDKDon
                var ids = [e(lop.ID)];
                nhom.tt.forEach(function (t) {
                    var x = nhom.chon[e(t.THUOCTINHLOP_ID)];
                    if (x && e(x.MANHOMLOP) === e(lop.MANHOMLOP)) ids.push(e(x.ID));
                });
                hoiDangKy(lop).then(function (ok) { if (ok) dangKy(ids); });
            } }]
        });
        var oHost = dlg.body.querySelector('[data-x="o"]'), dsHost = dlg.body.querySelector('[data-x="ds"]');
        function the(r, acts) {
            return D.theHtml(D.the(r, { dong: [tenTT(r.THUOCTINHLOP_TEN || 'Lý thuyết'), 'Thứ: ' + e(r.THUHOC), 'Tổng số: ' + e(r.SOLUONGDUKIENHOC), 'Đã đăng ký: ' + e(r.SOTHUCTEDANGKYHOC)],
                gia: r.PHISAUKHITRUMIEN }), acts);
        }
        function veO() {
            oHost.innerHTML = '<div class="dky-o' + (nhom.loc === '' ? ' is-active' : '') + '" data-o="">' +
                the(lop, D.nut('out-primary', 'Xem chi tiết', { 'data-xem': 'chinh' })) + '</div>' +
                nhom.tt.map(function (t) {
                    var id = e(t.THUOCTINHLOP_ID), x = nhom.chon[id];
                    return '<div class="dky-o' + (nhom.loc === id ? ' is-active' : '') + '" data-o="' + esc(id) + '">' +
                        (x ? the(x, D.nut('out-primary', 'Xem', { 'data-xem': nhom.rs.indexOf(x) })) : '<div class="dky-o__trong">Chọn lớp ' + esc(tenTT(t.THUOCTINHLOP_TEN)) + '</div>') + '</div>';
                }).join('');
        }
        function veDS() {
            pat.cards({
                el: dsHost, items: nhom.rs, empty: 'Không có lớp thảo luận / thực hành',
                attrs: function (r) { return { 'data-tt': e(r.THUOCTINHLOP_ID) }; },
                render: function (r) {
                    return D.the(r, { dong: [tenTT(r.THUOCTINHLOP_TEN), 'Thứ: ' + e(r.THUHOC), 'Tổng số: ' + e(r.SOLUONGDUKIENHOC), 'Đã đăng ký: ' + e(r.SOTHUCTEDANGKYHOC)], gia: r.PHISAUKHITRUMIEN });
                },
                actions: function (r, i) {
                    return D.nut('out-primary', 'Xem', { 'data-xem': i }) + D.nut('warn', 'Chọn lớp ' + tenTT(r.THUOCTINHLOP_TEN), { 'data-chonlop': i });
                }
            });
            locDS();
        }
        /* Bấm ô nhóm → chỉ hiện lớp của nhóm đó; bấm ô lớp chính → hiện tất cả (slideUp/slideDown của gốc) */
        function locDS() {
            Array.prototype.forEach.call(dsHost.querySelectorAll('[data-tt]'), function (c) { c.hidden = !!nhom.loc && c.getAttribute('data-tt') !== nhom.loc; });
        }
        veO();
        goi('nhom', {
            strThuocTinhLop_Id: '', strMaNhomLop: lop.MANHOMLOP, dLaLopHocPhanChinh: -1,
            strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: st.ctId, strDangKy_KeHoachDangKy_Id: st.khId,
            strDaoTao_HocPhan_Id: lop.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var d = r.data || {};
            nhom.tt = arr(d.rsThuocTinhLopHocPhan).filter(function (t) { return t.LOPHOCPHANCHINH !== 1 && e(t.MANHOMLOP) === e(lop.MANHOMLOP); });
            nhom.rs = arr(d.rs).filter(function (x) { return x.LOPHOCPHANCHINH !== 1; });
            // Tự chọn: lớp đầu tiên của mỗi nhóm còn chỗ (SOTHUCTEDANGKYHOC < SOLUONGDUKIENHOC)
            nhom.tt.forEach(function (t) {
                var x = nhom.rs.filter(function (y) { return e(y.THUOCTINHLOP_ID) === e(t.THUOCTINHLOP_ID) && Number(y.SOTHUCTEDANGKYHOC) < Number(y.SOLUONGDUKIENHOC); })[0];
                if (x) nhom.chon[e(t.THUOCTINHLOP_ID)] = x;
            });
            veO();
            veDS();
        }).catch(function (err) { dsHost.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nhóm lớp học phần'); });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xem]');
            if (b) {
                var k = b.getAttribute('data-xem'), x = k === 'chinh' ? lop : nhom.rs[Number(k)];
                if (x) xemLich(x.ID, x.TENLOP);
                return;
            }
            b = ev.target.closest('[data-chonlop]');
            if (b) {
                var y = nhom.rs[Number(b.getAttribute('data-chonlop'))];
                nhom.chon[e(y.THUOCTINHLOP_ID)] = y;
                veO();
                return;
            }
            b = ev.target.closest('[data-o]');
            if (b) { nhom.loc = b.getAttribute('data-o'); veO(); locDS(); }
        });
    }

    /* ---------- Hộp chi tiết lịch / phương án ----------------------------- */
    function xemLich(lopId, ten) {
        D.lich({ action: A.lich.action, func: A.lich.func, gioPhut: true, them: { strKhoaKiemTraDuLieu: D.uuid() } }, lopId, ten);
    }
    function xemPA(p) {
        var dlg = ui.dialog({ title: p.TENNHOM, icon: 'fa-list-check', size: 'lg', body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-x="bang"]');
        goi('pa', { strTKB_NhomKiemSoat_Id: p.ID, strNguoiThucHien_ID: uid() }).then(function (r) {
            ui.table({ el: h, rows: arr(r.data), empty: 'Không có lớp', columns: [
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' },
                { title: 'Số dự kiến', prop: 'SODUKIEN', cls: 'is-center' }, { title: 'Số đã đăng ký', prop: 'SODADANGKY', cls: 'is-center' }
            ] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phương án đăng ký'); });
    }

    /* ---------- Tài chính (getList_TinhTrangTaiChinh) ---------------------
       Nạp MỘT lần cho mỗi kế hoạch: hai con số ở cột trái, thẻ rê chuột và hộp
       chi tiết đều dùng chung kết quả này. Bản gốc chỉ gọi khi BẤM nên rê chuột
       vào hai dòng tiền không hiện gì — xem can-quyet.js. */
    function napTC() {
        if (st.tcNap) return st.tcNap;
        st.tcNap = goi('tc', { strDangKy_KeHoachDangKy_Id: st.khId, strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: st.ctId, strNguoiThucHien_Id: uid() }).then(function (r) {
            var d = r.data || {};
            st.taiChinh = { no: arr(d.rsConPhaiNopHienTai), du: arr(d.rsConDuHienTai), ps: arr(d.rsConPhaiNopTrongDotDK) };
            dat('soDu', D.tien(r.raw && r.raw.Id));
            dat('phatSinh', D.tien(st.taiChinh.ps.reduce(function (s, x) { return s + (Number(x.SOTIEN) || 0); }, 0)));
            return st.taiChinh;
        }).catch(function (err) { st.tcNap = null; ums.api.handle(err, 'tình trạng tài chính'); return null; });
        return st.tcNap;
    }
    function taiChinh(loai) {
        napTC().then(function (tc) {
            if (!tc) return;
            if (loai === 'du') {
                var dlg = ui.dialog({ title: 'Số dư tài khoản hiện tại', icon: 'fa-sack-dollar', size: 'lg',
                    body: '<h4 class="dky-h">Khoản còn nợ</h4><div data-x="no"></div><h4 class="dky-h">Khoản còn dư</h4><div data-x="du"></div>' });
                var cot = [{ title: 'Số tiền', cls: 'is-right is-nowrap', render: function (x) { return esc(D.tien(x.SOTIEN)); } },
                           { title: 'Nội dung', prop: 'NOIDUNG' }, { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO' }];
                ui.table({ el: dlg.body.querySelector('[data-x="no"]'), rows: st.taiChinh.no, columns: cot, stt: false, empty: 'Không có khoản còn nợ' });
                ui.table({ el: dlg.body.querySelector('[data-x="du"]'), rows: st.taiChinh.du, columns: cot, stt: false, empty: 'Không có khoản còn dư' });
            } else {
                var dlg2 = ui.dialog({ title: 'Số phát sinh thêm trong đợt', icon: 'fa-money-check-pen', size: 'xl', body: '<div data-x="ps"></div>' });
                ui.table({ el: dlg2.body.querySelector('[data-x="ps"]'), rows: st.taiChinh.ps, stt: false, empty: 'Không có khoản phát sinh', columns: [
                    { title: 'Lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                    { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
                    { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                    { title: 'Số tín chỉ', prop: 'SOTINCHI', cls: 'is-center' },
                    { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                    { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (x) { return esc(D.tien(x.SOTIEN)); } },
                    { title: 'Phần trăm miễn', prop: 'PHAMTRAMMIEN', cls: 'is-center' },
                    { title: 'Số tiền miễn', cls: 'is-right is-nowrap', render: function (x) { return esc(D.tien(x.SOTIENDUOCMIEN)); } },
                    { title: 'Số tiền phải nộp', cls: 'is-right is-nowrap', render: function (x) { return esc(D.tien(x.SOTIENPHAINOP)); } },
                    { title: 'Kế toán', cls: 'is-nowrap', render: function (x) { return x.DACHUYENKETOAN ? 'Đã chuyển' : ''; } }
                ] });
            }
        });
    }

    /* Nạp sẵn cho kế hoạch đang chọn: danh sách đã đăng ký (số lớp + thẻ rê chuột)
       và tình trạng tài chính (hai con số + thẻ rê chuột). */
    function napTom() {
        st.tcNap = null;
        napKQ().catch(function () { return null; });
        napTC();
    }

    /* Sau Đăng ký / Hủy / Đổi lịch (kéo gốc 30/9): nạp lại kết quả đăng ký + tài chính, nháy dòng "đã đăng ký" */
    function sauGhi() {
        st.tcNap = null;
        napTC();
        if (hopKQ && !hopKQ.closed) veKQ(); else napKQ().catch(function () { return null; });
        nhayDaDK();
    }
    function nhayDaDK() {          // highlightDaDangKy
        var n = root.querySelector('[data-a="ketqua"]');
        if (!n) return;
        n.classList.remove('is-nhay');
        void n.offsetWidth;         // bắt trình duyệt chạy lại hiệu ứng
        n.classList.add('is-nhay');
    }

    /* ---------- Kết quả đăng ký: hộp KẾT QUẢ ĐĂNG KÝ HỌC ------------------- */
    function napKQ() {
        return goi('kq', { strDaoTao_ChuongTrinh_Id: st.ctId, strDangKy_KeHoachDangKy_Id: st.khId, strQLSV_NguoiHoc_Id: sv, strNguoiThucHien_Id: uid() }).then(function (r) {
            st.kq = arr(r.data);
            st.kqNap = true;
            dat('soLop', st.kq.length);
            if (st.kq.length) dat('tcDaDK', st.kq[0].SOTINCHIDADANGKY);
            return st.kq;
        });
    }
    var hopKQ = null;
    function moKQ() {
        if (hopKQ && !hopKQ.closed) return;
        hopKQ = ui.dialog({ title: 'KẾT QUẢ ĐĂNG KÝ HỌC', icon: 'fa-clipboard-check', size: 'xl', body: '<div class="dky" data-x="kq">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = hopKQ.body.querySelector('[data-x="kq"]');
        hopKQ.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-ctkq]');
            if (b) { var x = st.kq[Number(b.getAttribute('data-ctkq'))]; xemLich(x.DANGKY_LOPHOCPHAN_ID, x.DANGKY_LOPHOCPHAN_TEN); return; }
            b = ev.target.closest('[data-doi]');
            if (b) { doiLich(st.kq[Number(b.getAttribute('data-doi'))]); return; }
            b = ev.target.closest('[data-huy]');
            if (b) hoiHuy(st.kq[Number(b.getAttribute('data-huy'))]);
        });
        veKQ();
    }
    function veKQ() {
        if (!hopKQ || hopKQ.closed) return;
        var h = hopKQ.body.querySelector('[data-x="kq"]');
        napKQ().then(function (ds) {
            D.ketQua(h, ds, {
                tenAttr: function (r, i) { return { 'data-ctkq': i }; },
                actions: function (r, i) { return D.nut('out-primary', 'Đổi lịch', { 'data-doi': i }) + D.nut('danger', 'Hủy', { 'data-huy': i }); }
            });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả đăng ký'); });
    }

    /* ---------- Hủy (delete_KeHoachDangKy) --------------------------------- */
    function hoiHuy(temp) {
        ui.confirm('Bạn có chắc chắn muốn hủy đăng ký lớp học phần: ' + e(temp.DANGKY_LOPHOCPHAN_TEN), { title: 'Xác nhận hủy', tone: 'bad', ok: 'Đồng ý', cancel: 'Quay lại' })
            .then(function (ok) { if (ok) huy(temp); });
    }
    function huy(temp) {
        // Lớp thuộc nhóm (MANHOMLOP): hủy cả nhóm
        var ids = temp.MANHOMLOP
            ? st.kq.filter(function (x) { return x.MANHOMLOP === temp.MANHOMLOP; }).map(function (x) { return e(x.DANGKY_LOPHOCPHAN_ID); }).join(',')
            : e(temp.DANGKY_LOPHOCPHAN_ID);
        ghi({
            action: 'DKH_DangKyMH/ThucHienHuyDangKyHoc',
            strQLSV_NguoiHoc_Id: sv,
            strDaoTao_ChuongTrinh_Id: temp.DAOTAO_TOCHUCCHUONGTRINH_ID,
            strDangKy_KeHoachDangKy_Id: temp.DANGKY_KEHOACHDANGKY_ID,
            strDaoTao_HocPhan_Id: temp.DAOTAO_HOCPHAN_ID,
            strNguoiThucHien_Id: uid(),
            strDangKy_LopHocPhan_Ids: ids
        }).then(function () {
            ui.toast('Hủy thành công!', 'ok');
            napHP();
            sauGhi();
        }).catch(function (err) { ums.api.handle(err, 'hủy đăng ký'); });
    }

    /* ---------- Đổi lịch (getList_DoiLich / save_DoiLich) ------------------- */
    function doiLich(temp) {
        goi('doi', {
            strThuocTinhLop_Id: temp.THUOCTINHLOP_ID, strMaNhomLop: temp.MANHOMLOP,
            dLaLopHocPhanChinh: temp.LOPHOCPHANCHINH === null ? -1 : temp.LOPHOCPHANCHINH,
            strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: temp.DAOTAO_TOCHUCCHUONGTRINH_ID,
            strDangKy_KeHoachDangKy_Id: temp.DANGKY_KEHOACHDANGKY_ID, strDaoTao_HocPhan_Id: temp.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var ds = arr((r.data || {}).rs).filter(function (x) {
                if (e(x.ID) === e(temp.DANGKY_LOPHOCPHAN_ID)) return false;
                return !(x.SOLOPTHUOCCUNGNHOM > 1 && x.LOPHOCPHANCHINH == 1);
            });
            if (!ds.length) { ui.toast('Không có lớp để đổi', 'warn'); return; }
            var dlg = ui.dialog({ title: 'Danh sách học phần', icon: 'fa-chalkboard-user', size: 'xl', body: '<div class="dky" data-x="ds"></div>' });
            pat.cards({
                el: dlg.body.querySelector('[data-x="ds"]'), items: ds,
                render: function (x) {
                    return D.the(x, { dong: [tenTT(x.THUOCTINHLOP_TEN), 'Tổng số: ' + e(x.SOLUONGDUKIENHOC), 'Đã đăng ký: ' + e(x.SOTHUCTEDANGKYHOC),
                        e(x.NGAYBATDAU) + ' - ' + e(x.NGAYKETTHUC), 'Thứ: ' + e(x.THUHOC), e(x.GIANGVIEN)], gia: x.PHISAUKHITRUMIEN });
                },
                actions: function (x, i) { return D.nut('out-primary', 'Xem chi tiết', { 'data-xem': i }) + D.nut('warn', 'Đổi lớp ' + tenTT(x.THUOCTINHLOP_TEN), { 'data-doilop': i }); }
            });
            dlg.body.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-xem]');
                if (b) { var x = ds[Number(b.getAttribute('data-xem'))]; xemLich(x.ID, x.TENLOP); return; }
                b = ev.target.closest('[data-doilop]');
                if (!b) return;
                var moi = ds[Number(b.getAttribute('data-doilop'))];
                ui.confirm('Bạn có chắc chắn muốn đổi lớp học phần: ' + e(temp.DANGKY_LOPHOCPHAN_TEN) + ' sang lớp học phần ' + e(moi.TENLOP) + '?', { title: 'Xác nhận' })
                    .then(function (ok) { if (ok) luuDoiLich(temp, e(moi.ID), dlg); });
            });
        }).catch(function (err) { ums.api.handle(err, 'danh sách lớp đổi lịch'); });
    }
    function luuDoiLich(obj, strId, dlg) {
        var cu = '', moi = '';
        if (obj.MANHOMLOP === null || obj.MANHOMLOP === undefined) {
            cu = e(obj.DANGKY_LOPHOCPHAN_ID);
            moi = strId;
        } else {
            // GIỮ Y GỐC (dangky.js:1119): lớp khác trong nhóm cũng đẩy ID lớp đang đổi, không phải ID của chính nó
            var aCu = [], aMoi = [];
            st.kq.filter(function (x) { return x.MANHOMLOP === obj.MANHOMLOP; }).forEach(function (x) {
                if (x.DANGKY_LOPHOCPHAN_ID === obj.DANGKY_LOPHOCPHAN_ID) { aCu.push(obj.DANGKY_LOPHOCPHAN_ID); aMoi.push(strId); }
                else { aCu.push(obj.DANGKY_LOPHOCPHAN_ID); aMoi.push(obj.DANGKY_LOPHOCPHAN_ID); }
            });
            cu = aCu.join(','); moi = aMoi.join(',');
        }
        ghi({
            action: 'DKH_DangKyMH/ThucHienDoiLichDangKyHoc',
            strQLSV_NguoiHoc_Id: sv,
            strDaoTao_ChuongTrinh_Id: obj.DAOTAO_TOCHUCCHUONGTRINH_ID,
            strDangKy_KeHoachDangKy_Id: obj.DANGKY_KEHOACHDANGKY_ID,
            strDaoTao_HocPhan_Id: obj.DAOTAO_HOCPHAN_ID,
            strNguoiThucHien_Id: uid(),
            strDangKy_LopHocPhan_Cu_Ids: cu,
            strDangKy_LopHocPhan_Moi_Ids: moi
        }).then(function () {
            ui.toast('Đổi lịch thành công!', 'ok');
            dlg.close();
            sauGhi();
        }).catch(function (err) { ums.api.handle(err, 'đổi lịch'); });
    }

    /* ---------- Sự kiện --------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var t = ev.target, b;
        if ((b = t.closest('[data-z="ct"] [data-chip]'))) {
            st.ctId = b.getAttribute('data-chip'); veCT(); napKH(); return;
        }
        if ((b = t.closest('[data-z="kh"] [data-chip]'))) {
            st.khId = b.getAttribute('data-chip'); veKH();
            var k = st.kh.filter(function (x) { return e(x.ID) === st.khId; })[0];
            napHP();
            if (k) thoiGian(k);
            napTom();
            return;
        }
        if ((b = t.closest('[data-hp]'))) {
            st.hpChon = e(st.hp[Number(b.getAttribute('data-hp'))].DAOTAO_HOCPHAN_ID);
            Array.prototype.forEach.call(z('hp').querySelectorAll('[data-hp]'), function (x) { x.classList.toggle('is-active', x === b); });
            z('thu').innerHTML = ''; z('gv').innerHTML = '';
            napLHP(true); napThu(); napGV();
            return;
        }
        if ((b = t.closest('[data-ct]'))) { var l = st.lhp.rs[Number(b.getAttribute('data-ct'))]; xemLich(l.ID, l.TENLOP); return; }
        if ((b = t.closest('[data-dk]'))) {
            var lop = st.lhp.rs[Number(b.getAttribute('data-dk'))];
            hoiDangKy(lop).then(function (ok) { if (ok) dangKy([e(lop.ID)]); });
            return;
        }
        if ((b = t.closest('[data-chon]'))) { chonNhom(st.lhp.rs[Number(b.getAttribute('data-chon'))]); return; }
        if ((b = t.closest('[data-pa]'))) { xemPA(st.lhp.rsNhomKiemSoat[Number(b.getAttribute('data-pa'))]); return; }
        if ((b = t.closest('[data-a="taichinh"]'))) { taiChinh(b.getAttribute('data-loai')); return; }
        if (t.closest('[data-a="ketqua"]')) { moKQ(); return; }
        if (t.closest('[data-a="search"]')) napLHP();
    });
    f('timHP').addEventListener('input', locHP);

    /* ---------- Thẻ rê chuột của ba dòng số liệu ---------------------------
       Bản gốc có ba khung rê chuột (money-class-detail / zoneDaDangKy). Ở đây
       mỗi dòng một thẻ, xếp lại cho đọc được trong thẻ hẹp:
         · Số dư: hai mục "Khoản còn nợ" / "Khoản còn dư", mỗi dòng nội dung + tiền;
         · Số phát sinh: mỗi lớp một dòng (tên lớp · khoản thu · số tín chỉ) + tiền
           phải nộp — bảng 10 cột của bản gốc không đọc được trong thẻ nổi, bấm
           vào dòng vẫn mở hộp có đủ 10 cột;
         · Tổng lớp đã đăng ký: danh sách lớp + học phí + thứ/tiết, như gốc. */
    var HC_MAX = 8;                 // thẻ nổi không cuộn được (pointer-events:none) → cắt bớt
    function hcCon(ds) { return ds.length > HC_MAX ? '<div class="dky-hc__chan">… còn ' + (ds.length - HC_MAX) + ' mục — bấm để xem đầy đủ</div>' : ''; }
    function hcTien(ds, trong) {
        if (!ds.length) return '<div class="ums-u-faint">' + esc(trong) + '</div>';
        return '<ul class="dky-dadk">' + ds.slice(0, HC_MAX).map(function (x) {
            return '<li><p><span>' + esc(e(x.NOIDUNG) || e(x.TAICHINH_CACKHOANTHU_TEN)) + '</span>' +
                '<span class="dky-cam">' + esc(D.tien(x.SOTIEN)) + ' đ</span></p>' +
                (x.DAOTAO_THOIGIANDAOTAO ? '<p><span>' + esc(x.DAOTAO_THOIGIANDAOTAO) + '</span></p>' : '') + '</li>';
        }).join('') + '</ul>' + hcCon(ds);
    }
    function theRe(loai) {
        if (loai === 'ketqua') {
            if (!st.kq.length) return '<div class="ums-u-faint">Chưa đăng ký lớp nào.</div>';
            return '<div class="dky-hc__td">Lớp đã đăng ký (' + st.kq.length + ')</div>' +
                '<ul class="dky-dadk">' + st.kq.slice(0, HC_MAX).map(function (x) {
                    return '<li><p><span>' + esc(x.DANGKY_LOPHOCPHAN_TEN) + '</span><span class="dky-cam">' + esc(D.tien(x.PHISAUKHITRUMIEN)) + ' đ</span></p>' +
                        '<p><span>' + esc(tenTT(x.THUOCTINHLOP_TEN)) + '</span><span>T' + esc(x.THUHOC_TIETHOC) + '</span></p></li>';
                }).join('') + '</ul>' + hcCon(st.kq);
        }
        var tc = st.taiChinh || { no: [], du: [], ps: [] };
        if (loai === 'du') {
            return '<div class="dky-hc__td">Khoản còn nợ</div>' + hcTien(tc.no, 'Không có khoản còn nợ') +
                '<div class="dky-hc__td">Khoản còn dư</div>' + hcTien(tc.du, 'Không có khoản còn dư');
        }
        if (!tc.ps.length) return '<div class="ums-u-faint">Không có khoản phát sinh trong đợt.</div>';
        return '<div class="dky-hc__td">Phát sinh trong đợt (' + tc.ps.length + ')</div>' +
            '<ul class="dky-dadk">' + tc.ps.slice(0, HC_MAX).map(function (x) {
                return '<li><p><span>' + esc(x.DANGKY_LOPHOCPHAN_TEN) + '</span><span class="dky-cam">' + esc(D.tien(x.SOTIENPHAINOP)) + ' đ</span></p>' +
                    '<p><span>' + esc(e(x.TAICHINH_CACKHOANTHU_TEN)) + (x.SOTINCHI ? ' · ' + esc(x.SOTINCHI) + ' TC' : '') + '</span>' +
                    (Number(x.SOTIENDUOCMIEN) ? '<span>miễn ' + esc(D.tien(x.SOTIENDUOCMIEN)) + ' đ</span>' : '') + '</p></li>';
            }).join('') + '</ul>' +
            (tc.ps.length > HC_MAX ? hcCon(tc.ps) : '<div class="dky-hc__chan">Bấm để xem bảng đầy đủ</div>');
    }
    ui.hoverCard(root.querySelector('.dky-tt'), '.dky-tt__nut', function (nut) {
        var a = nut.getAttribute('data-a');
        var loai = a === 'ketqua' ? 'ketqua' : nut.getAttribute('data-loai');
        // Chưa có dữ liệu (chưa chọn kế hoạch, hoặc lời gọi đang chạy) thì báo đang tải
        if (loai === 'ketqua' ? !st.kqNap : !st.taiChinh) {
            (loai === 'ketqua' ? napKQ() : napTC()).then(function () {
                var c = document.querySelector('.ums-hovercard [data-hc="' + loai + '"]');
                if (c) c.innerHTML = theRe(loai);
            });
            return '<div data-hc="' + loai + '"><div class="ums-u-faint"><i class="fa-light fa-spinner fa-spin"></i> Đang tải…</div></div>';
        }
        return '<div data-hc="' + loai + '">' + theRe(loai) + '</div>';
    });

    ums.report.mount(z('report'), { import: false, reportText: 'Báo cáo', collect: function (add) {
        add('strThuHoc', danhDau(z('thu')));
        add('strNhanSu_HoSoNhanSu_v2_Id', danhDau(z('gv')));
        add('dChiLayCacLopKhongTrung', f('locTrung').checked ? 1 : 0);
        add('strThuocTinhLop_Id', '');
        add('strMaNhomLop', '');
        add('dLaLopHocPhanChinh', 1);
        add('strQLSV_NguoiHoc_Id', sv);
        add('strDaoTao_ChuongTrinh_Id', st.ctId);
        add('strDangKy_KeHoachDangKy_Id', st.khId);
        add('strDaoTao_HocPhan_Id', hpId());
        add('strNguoiThucHien_Id', uid());
    } });

    z('phatSinh').textContent = '-';          // bản gốc để sẵn dấu "-" khi chưa nạp tài chính
    napCT();
})();
