/* =========================================================================
   Đăng ký - quản lý sự kiện (Cổng sinh viên — vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/sukien/html/sukien.html + script/sukien.js (vỏ index).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc, MỘT cột: ô chọn "Chọn kế hoạch" + nút "Xem" →
   bảng "Danh sách sự kiện" (chưa đăng ký) + nút "Đăng ký" →
   bảng "Sự kiện đã đăng ký" + nút "Hủy đăng ký" →
   bảng "Sự kiện đã tham gia" (chỉ xem, có cột Điểm).
   Hai bảng đầu dùng khung chung `ums.pat.haiLuoi` (assets/js/patterns.js) —
   đúng dạng "CHƯA đăng ký / ĐÃ đăng ký" của Cổng sinh viên.

   Lời gọi (chép nguyên action / func / tên tham số):
     SV_SuKien_MH · pkg_hososinhvien_sukien.
        LayDSKeHoachSuKien                      → ô Kế hoạch (ID / TENKEHOACH, selectFirst)
        LayDSSuKien_HoatDong                    (strQLSV_SuKien_KeHoach_Id) → bảng "Danh sách sự kiện"
        LayDSSuKien_KeHoach_ThamGia_SV          (strTuKhoa, strQLSV_SuKien_KeHoach_Id, strQLSV_NguoiHoc_Id)
        LayDSSuKien_HoatDong_ThoiGian           mỗi dòng một lời gọi → cột Thời gian
        LayDSSuKien_HoatDong_DienGia            mỗi dòng một lời gọi → cột Diễn giả
        Them_SuKien_KeHoach_DangKy              (strQLSV_SuKien_KeHoach_Id, strQLSV_SuKien_HoatDong_Id, strQLSV_NguoiHoc_Id)
        Xoa_SuKien_KeHoach_DangKy               (strId — xem "Lỗi bản gốc" bên dưới)
     SV_VeThang_MH · pkg_hososinhvien_vethang.LayDSQLSV_KeHoach_Ve_DangKy
        (strQLSV_KeHoach_DichVu_Ve_Id, strQLSV_NguoiHoc_Id) → bảng "Sự kiện đã đăng ký"
     SV_Files (viewFiles) → cột Tư liệu, chỉ xem.
     strNguoiThucHien_Id = edu.system.userId ở gốc → để api.js tự điền (cùng giá trị).

   LỖI BẢN GỐC — ghi lại, KHÔNG tự sửa phần gửi lên máy chủ:
     · "Sự kiện đã đăng ký" gọi dịch vụ VÉ THÁNG (pkg_hososinhvien_vethang.
       LayDSQLSV_KeHoach_Ve_DangKy, tham số strQLSV_KeHoach_DichVu_Ve_Id) — chép
       nhầm từ màn vé xe buýt (thuộc tính thừa strXeBus_Id còn nguyên ở đầu tệp
       gốc). Không có mã action đã mã hoá của lời gọi đúng nên GIỮ NGUYÊN lời gọi
       gốc; cần bên nghiệp vụ cho đúng action/func của "sự kiện đã đăng ký".
     · Xoa_SuKien_KeHoach_DangKy ở gốc KHÔNG gửi id nào (hàm nhận strId rồi bỏ
       quên) → xoá chưa bao giờ chạy. Ở đây gửi 'strId' = ID dòng đã đăng ký
       (theo đúng ý định của hàm) — KIỂM TRÊN HOST tên tham số.
     · LayDSSuKien_KeHoach_ThamGia_SV gửi biến toàn cục strQLSV_NguoiHoc_Id không
       tồn tại → ReferenceError, bảng "đã tham gia" chưa bao giờ hiện. Ở đây gửi
       id người học (đúng ý định).
     · Cột "Điểm" của bảng "đã tham gia" chỉ vẽ một ô trống, không lời gọi nào đổ
       dữ liệu vào → giữ trống, chờ nghiệp vụ cho biết cột nào.
     · strTuKhoa đọc ô txtAAAA không tồn tại → gửi chuỗi rỗng (đúng giá trị thật
       bản gốc đang gửi).

   Khác bản gốc:
     · Chọn sẵn kế hoạch đầu (selectFirst của gốc) thì NẠP LUÔN ba bảng, không bắt
       bấm "Xem" mới thấy dữ liệu; xoá trắng kế hoạch thì ba bảng về lời nhắc.
     · Đăng ký / Hủy nhiều dòng chạy qua ums.ui.batch (tuần tự, có tiến độ) rồi nạp
       lại MỘT lần — gốc bắn N lời gọi song song, mỗi lời gọi nạp lại cả bảng.
     · "Hủy đăng ký" là nút xoá nhiều dòng chuẩn (tự đếm, khoá khi chưa chọn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('csv-sukien');
    var SV = (ums.session && ums.session.userId) || '';
    var SK = 'SV_SuKien_MH/';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    root.innerHTML = pat.page('Đăng ký - quản lý sự kiện', '') +
        pat.filterBar([{ key: 'kh', type: 'select', label: 'Chọn kế hoạch' }], { searchText: 'Xem' }) +
        '<div data-z="luoi"></div>' +
        '<div class="ums-u-mt-4">' +
        pat.panel({ title: 'Sự kiện đã tham gia', icon: 'fa-user-check', count: 'n_tg', flush: true, zone: 'tg' }) +
        '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value : ''; }

    /* ---------- Cột chung của ba bảng ------------------------------------ */
    function anh(r) {
        return r.HINHANHSUKIEN ? '<img src="' + esc(ums.files.url(r.HINHANHSUKIEN)) + '" alt="" style="max-height:100px">' : '';
    }
    function cot(coDiem) {
        var c = [
            { title: 'Tên sự kiện', prop: 'TEN' },
            { title: 'Thời gian', cls: 'is-center', render: function (r) { return '<span data-tg="' + esc(e(r.ID)) + '"></span>'; } },
            { title: 'Diễn giả', cls: 'is-center', render: function (r) { return '<span data-dg="' + esc(e(r.ID)) + '"></span>'; } },
            { title: 'Tư liệu', cls: 'is-center', render: function (r) { return '<div data-tl="' + esc(e(r.ID)) + '"></div>'; } },
            { title: 'Hình ảnh', cls: 'is-center', render: anh }
        ];
        // Cột "Điểm" của bảng "đã tham gia": bản gốc để trống (không có nguồn dữ liệu)
        if (coDiem) c.push({ title: 'Điểm', cls: 'is-center', render: function () { return ''; } });
        return c;
    }

    /* Thời gian / Diễn giả / Tư liệu — mỗi dòng một lời gọi, như bản gốc */
    function napPhu(host, rows) {
        rows.forEach(function (r) {
            var p = { strTuKhoa: '', strQLSV_SuKien_HoatDong_Id: r.ID, silent: true };
            ums.api.call(Object.assign({ action: SK + 'DSA4BRISNAooJC8eCS4gNQUuLyYeFSkuKAYoIC8P',
                func: 'pkg_hososinhvien_sukien.LayDSSuKien_HoatDong_ThoiGian' }, p)).then(function (x) {
                var el = host.querySelector('[data-tg="' + e(r.ID) + '"]');
                if (el) el.innerHTML = arr(x.data).map(function (t) {
                    return esc(e(t.DIADIEM) + '(' + e(t.TUNGAY) + ' ' + e(t.GIOBATDAU) + 'h' + e(t.PHUTBATDAU) + ' - ' +
                        e(t.DENNGAY) + ' ' + e(t.GIOKETTHUC) + 'h' + e(t.PHUTKETTHUC) + ')');
                }).join('<br>');
            }).catch(function () {});
            ums.api.call(Object.assign({ action: SK + 'DSA4BRISNAooJC8eCS4gNQUuLyYeBSgkLwYoIAPP',
                func: 'pkg_hososinhvien_sukien.LayDSSuKien_HoatDong_DienGia' }, p)).then(function (x) {
                var el = host.querySelector('[data-dg="' + e(r.ID) + '"]');
                if (el) el.innerHTML = arr(x.data).map(function (d) {
                    return '<b>' + esc(e(d.DIENGIA)) + '</b> (' + esc(e(d.MOTA)) + ')';
                }).join('<br>');
            }).catch(function () {});
            var tl = host.querySelector('[data-tl="' + e(r.ID) + '"]');
            if (tl) ums.files.mount(tl, { api: 'SV_Files', readonly: true }).load(r.ID);
        });
    }

    /* ---------- Hai bảng chưa / đã đăng ký -------------------------------- */
    var hl = ums.pat.haiLuoi(z('luoi'), {
        chua: { title: 'Danh sách sự kiện', icon: 'fa-list-timeline', columns: cot(false),
            empty: 'Kế hoạch chưa có sự kiện', nut: { text: 'Đăng ký', icon: 'fa-money-check-pen' },
            canChon: 'Vui lòng chọn đối tượng?', onDangKy: dangKy },
        da: { title: 'Sự kiện đã đăng ký', icon: 'fa-clipboard-check', columns: cot(false),
            empty: 'Chưa đăng ký sự kiện nào', nut: { text: 'Hủy đăng ký' },
            canChon: 'Vui lòng chọn đối tượng?', onHuy: huy }
    });

    function veHaiBang(k, rows) { hl.ve(k, rows); napPhu(hl.bang(k), rows); }
    function nhac() {
        hl.nhac('chua', 'Chọn kế hoạch rồi bấm "Xem"');
        hl.nhac('da', 'Chọn kế hoạch rồi bấm "Xem"');
        z('tg').innerHTML = ui.empty('Chọn kế hoạch rồi bấm "Xem"', 'fa-hand-pointer');
        dem(null);
    }
    function dem(n) { var c = z('n_tg'); if (c) c.textContent = n === null ? '' : '(' + n + ')'; }

    /* ---------- Ba lời gọi danh sách ------------------------------------- */
    function taiChuaDangKy() {
        hl.dang('chua');
        return ums.api.call({ action: SK + 'DSA4BRISNAooJC8eCS4gNQUuLyYP', func: 'pkg_hososinhvien_sukien.LayDSSuKien_HoatDong',
            strQLSV_SuKien_KeHoach_Id: v('kh') })
            .then(function (r) { veHaiBang('chua', arr(r.data)); })
            .catch(function (err) { hl.loi('chua', err.message); ums.api.handle(err, 'danh sách sự kiện'); });
    }
    function taiDaDangKy() {
        hl.dang('da');
        // Lời gọi của VÉ THÁNG — bản gốc chép nhầm, giữ nguyên (xem chú thích đầu tệp)
        return ums.api.call({ action: 'SV_VeThang_MH/DSA4BRIQDRIXHgokCS4gIikeFyQeBSAvJgo4',
            func: 'pkg_hososinhvien_vethang.LayDSQLSV_KeHoach_Ve_DangKy',
            strQLSV_KeHoach_DichVu_Ve_Id: v('kh'), strQLSV_NguoiHoc_Id: SV })
            .then(function (r) { veHaiBang('da', arr(r.data)); })
            .catch(function (err) { hl.loi('da', err.message); ums.api.handle(err, 'sự kiện đã đăng ký'); });
    }
    function taiDaThamGia() {
        z('tg').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: SK + 'DSA4BRISNAooJC8eCiQJLiAiKR4VKSAsBiggHhIX',
            func: 'pkg_hososinhvien_sukien.LayDSSuKien_KeHoach_ThamGia_SV',
            strTuKhoa: '', strQLSV_SuKien_KeHoach_Id: v('kh'), strQLSV_NguoiHoc_Id: SV })
            .then(function (r) {
                var rows = arr(r.data);
                ui.table({ el: z('tg'), rows: rows, columns: cot(true), empty: 'Chưa tham gia sự kiện nào' });
                dem(rows.length);
                napPhu(z('tg'), rows);
            })
            .catch(function (err) { z('tg').innerHTML = ui.fail(err.message); dem(null); ums.api.handle(err, 'sự kiện đã tham gia'); });
    }
    function taiTatCa() { taiChuaDangKy(); taiDaDangKy(); taiDaThamGia(); }

    /* ---------- Đăng ký / Hủy đăng ký ------------------------------------ */
    function dangKy(ds) {
        ui.confirm('Bạn có chắc chắn đăng ký không?', { ok: 'Đăng ký' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ds.map(function (a) {
                return { action: SK + 'FSkkLB4SNAooJC8eCiQJLiAiKR4FIC8mCjgP', func: 'pkg_hososinhvien_sukien.Them_SuKien_KeHoach_DangKy',
                    strQLSV_SuKien_KeHoach_Id: v('kh'), strQLSV_SuKien_HoatDong_Id: a.ID, strQLSV_NguoiHoc_Id: SV };
            }), { title: 'Đang đăng ký sự kiện', okText: 'Thêm mới thành công!', show: true })
                .then(function () { taiChuaDangKy(); taiDaDangKy(); });
        });
    }
    function huy(ds) {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy đăng ký' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ds.map(function (a) {
                // Bản gốc KHÔNG gửi id nào — ở đây gửi strId theo đúng ý định của hàm
                return { action: SK + 'GS4gHhI0CigkLx4KJAkuICIpHgUgLyYKOAPP', func: 'pkg_hososinhvien_sukien.Xoa_SuKien_KeHoach_DangKy',
                    strId: a.ID };
            }), { title: 'Đang hủy đăng ký', okText: 'Xóa thành công!', show: true })
                .then(function () { taiChuaDangKy(); taiDaDangKy(); });
        });
    }

    /* ---------- Sự kiện màn hình ----------------------------------------- */
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) {
            if (!v('kh')) { ui.toast('Vui lòng chọn kế hoạch', 'warn'); return; }
            taiTatCa();
        }
    });
    if (window.jQuery) {
        jQuery(f('kh')).on('select2:select', taiTatCa);
        jQuery(f('kh')).on('select2:clear', nhac);
    }

    nhac();
    ums.api.call({ action: SK + 'DSA4BRIKJAkuICIpEjQKKCQv', func: 'pkg_hososinhvien_sukien.LayDSKeHoachSuKien' })
        .then(function (r) {
            var ds = arr(r.data);
            pat.fill(f('kh'), ds, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' });
            if (!ds.length) return;
            f('kh').value = ds[0].ID;                                  // selectFirst của bản gốc
            if (window.jQuery) jQuery(f('kh')).trigger('change.select2');
            taiTatCa();
        })
        .catch(function (err) { ums.api.handle(err, 'kế hoạch sự kiện'); });
})();
