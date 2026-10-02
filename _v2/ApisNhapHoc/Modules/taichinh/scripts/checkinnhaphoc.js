/* =========================================================================
   Check-in nhập học (bản cũ)
   Bản gốc: ApisNhapHoc/Modules/taichinh/html/checkinnhaphoc.html + scripts/checkinnhaphoc.js (1.914 dòng)
   ---------------------------------------------------------------------------
   PHẦN NGƯỜI DÙNG THẤY ĐƯỢC ở bản gốc (và là phần được chuyển):
     · Cột trái: Kế hoạch nhập học (chọn sẵn mục đầu), Điều kiện Đã nhập / Chưa nhập / Toàn bộ, ô tìm, danh sách
       thí sinh (ảnh · họ tên · SBD · thẻ "đã nhập học"), phân trang máy chủ, thẻ thông tin khi rê chuột.
     · Nút Xuất báo cáo / Import theo mẫu phân quyền (getList_MauImport "zonebtnTT", có vùng _Import).
     · Khung "Hồ sơ" (hai cột thông tin + "Tổng đã thu") và nút "Tiếp nhận" → hộp "Thanh toán" (mã tiếp nhận,
       QR VietQR, mã vạch MSSV, số tiền, tình trạng) + nút In.
   Lời gọi (chép nguyên):
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP   PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc
         strNguoiThucHien_Id = người đăng nhập                         → ô Kế hoạch (ID / TENKEHOACH)
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP   PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS
         dDaNhapHoc (1 / 0 / -1), strTaiChinh_KeHoach_Id (trống → "xxx" như gốc), strNguoiThucHien_Id '',
         strTuKhoa, pageIndex, pageSize
     NH_QuayNhapHoc/ThucHienTiepNhanNhapHoc  GET
         type 'GET' (gốc gửi kèm trong dữ liệu), strChucNang_Id, strTC_KeHoachNhapHoc_Id, strQLSV_NguoiHoc_TTTS_Id,
         strNguoiThucHien_Id → Data.rsTiepNhan[0] (MATIEPNHAN, NGAYTAO_DD_MM_YYYY, TONGSOTENDANOP, TINHTRANGTHANHTOAN),
         Data.rsSinhVien[0] (HOVATEN, MASINHVIEN), Data.rs[0] (MADINHDANHTONG, SOTIENPHAINOP)
     Báo cáo: ums.report.mount — tham số strTaiChinh_KeHoach_Id, strQLSV_NguoiHoc_Id (khi đã chọn), strPhieuThu_Id.

   KHÔNG CHUYỂN — mã gốc chỉ đổ vào vùng ẨN, người dùng không bao giờ thấy:
     khối "Tài chính" nằm trong <div class="box" style="display:none"> (bảng các khoản, số phiếu đã thu / đã huỷ,
     sửa phiếu đã thu, chọn khoản xuất hoá đơn), vùng #zoneList_PhieuDaThu và #zoneThongTinHoaDon (display:none, không
     nút nào mở được vì các nút mở nằm trong khối ẩn), nút "Lưu" nổi (#zoneAction_Edit_PhieuDaThu bị showHide_Box
     ẩn ngay khi mở màn). Kéo theo KHÔNG gọi: LayDSCacKhoanNhapHoc, LayDSKhoanDaThuNhapHoc, LayTTQLSV_NguoiHoc_TTTS,
     NhapHoc_ThuTien, NhapHoc_SuaPhieuThu, TC_PhieuThu/HuyPhieuNhapHoc, TC_DaNop_HoaDon/ThemMoi, TC_HoaDon/*,
     danh mục QLTC.HTTHU, TAICHINH.NUTHDDT. Thu tiền / hoá đơn nhập học là màn "Thu tiền" (taichinhnew) riêng.

   Khác gốc:
     · Không tự chọn khi danh sách còn đúng một người (luật cột trái — gốc checkAuto_Select tự chọn).
     · "Tổng đã thu" chỉ hiện khi đã chọn người (gốc lấy SODATHUTIEN của DÒNG ĐẦU danh sách ngay khi nạp, chưa chọn ai).
     · Chưa chọn thí sinh / kế hoạch thì "Tiếp nhận" khoá (gốc bấm được, gửi id rỗng).
     · Tiếp nhận xong: điền "Mã tiếp nhận" / "Thời gian" (gốc có hai ô này nhưng không bao giờ đổ dữ liệu) và tải lại
       danh sách để thẻ "đã nhập học" cập nhật (giữ người đang chọn).
     · Đổi ô lọc / gõ tìm là tự tải (luật cột trái); người đang chọn không còn trong danh sách mới thì bỏ chọn.
   Giữ như gốc: QR VietQR cứng ngân hàng 970418, mẫu JIzXIaG, accountName "TRUONG DAI HOC CMC"; mã vạch lấy từ
     barcode.tec-it.com (ảnh ngoài).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('nh-checkinnhaphoc');
    if (!root) return;
    var A = 'SV_Core_NhapHoc_ThuTien_MH/', P = 'PKG_CORE_NhapHoc_ThuTien.';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }

    var st = { page: 1, size: 10, total: 0, rows: [], chon: null, tiepNhan: null };

    var m = pat.master({
        el: root, title: 'Check-in nhập học', actions: '<span data-z="report"></span>',
        side: {
            title: 'Danh sách thí sinh', icon: 'fa-user-graduate', search: 'Tìm theo tên, số báo danh...',
            /* khuôn .ums-master__adv (patterns.css): tiêu đề nhỏ + mỗi ô một dòng */
            filter:
                '<div class="ums-master__advtitle">Kế hoạch nhập học</div>' +
                '<div class="ums-field"><select class="ums-select" data-f="kh" data-required data-ph="Chọn kế hoạch nhập học">' +
                    '<option value="">Chọn kế hoạch nhập học</option></select></div>' +
                '<div class="ums-field"><label class="ums-field__label">Điều kiện</label>' +
                '<div class="ums-radios">' + [['1', 'Đã nhập'], ['0', 'Chưa nhập'], ['-1', 'Toàn bộ']].map(function (x, i) {
                    return '<label class="ums-check"><input type="radio" name="nhCiDk" data-f="dk" value="' + x[0] + '"' +
                        (i ? '' : ' checked') + '> ' + x[1] + '</label>';
                }).join('') + '</div></div>'
        },
        main: { title: false }
    });
    ui.enhance(root);
    var fKh = root.querySelector('[data-f="kh"]');
    function dk() { return (root.querySelector('[data-f="dk"]:checked') || {}).value || '1'; }

    /* ---------------- Khung Hồ sơ ---------------- */
    var TRAI = [
        ['Họ tên', function (r) { return (e(r.HODEM) + ' ' + e(r.TEN)).trim().toUpperCase(); }],
        ['Mã số SV', function (r) { return e(r.MASO); }],
        ['Ngày sinh', function (r) { return e(r.NGAYSINH_NGAY) + '/' + e(r.NGAYSINH_THANG) + '/' + e(r.NGAYSINH_NAM); }],
        ['Điện thoại', function (r) { return e(r.SODIENTHOAICANHAN); }],
        ['Quê quán', function (r) { return e(r.HOKHAU_PHUONGXAKHOIXOM) + ' - ' + e(r.HOKHAU_QUANHUYEN_TEN) + ' - ' + e(r.HOKHAU_TINHTHANH_TEN); }],
        ['Ngành nhập học', function (r) { return e(r.DAOTAO_NGANHNHAPHOC); }],
        ['Lớp', function (r) { return e(r.DAOTAO_LOPQUANLY_TEN); }],
        ['CMND/CCCD', function (r) { return e(r.CMTND_SO); }],
        ['Mã tiếp nhận', function () { return st.tiepNhan ? e(st.tiepNhan.MATIEPNHAN) : ''; }]
    ];
    var PHAI = [
        ['SBD', function (r) { return e(r.SOBAODANH); }],
        ['Tổng điểm', function (r) { return (Number(r.DIEMTS_TONGDIEM) || 0).toFixed(2); }],
        ['Đối tượng', function (r) { return e(r.DOITUONGDUTHI_TEN); }],
        ['% Miễn/Giảm', function (r) { return e(Number(r.PHANTRAMMIENGIAM) || 0); }],
        ['Khu vực', function (r) { return e(r.KHUVUC_TEN); }],
        ['Ngành trúng tuyển', function (r) { return e(r.NGANHHOC_TEN); }],
        ['Thời gian', function () { return st.tiepNhan ? e(st.tiepNhan.NGAYTAO_DD_MM_YYYY) : ''; }]
    ];
    function kv(ds, r) {
        return '<div>' + ds.map(function (d) {
            return '<div class="ums-kv"><span>' + esc(d[0]) + '</span><b>' + esc(d[1](r)) + '</b></div>';
        }).join('') + '</div>';
    }
    function veHoSo() {
        var r = st.chon;
        m.mainBody.innerHTML = '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-address-card"></i> Hồ sơ' +
            (r ? ' ' + ui.badge('Tổng đã thu: ' + (ui.money(r.SODATHUTIEN || 0) || '0'), 'info') : '') + '</div>' +
            '<div class="ums-panel__tools">' +
            ui.btn('save', { text: 'Tiếp nhận', mod: 'primary', icon: 'fa-paper-plane',
                attr: r && fKh.value ? { 'data-a': 'tiepnhan' } : { 'data-a': 'tiepnhan', disabled: 'disabled' } }) +
            '</div></div><div class="ums-panel__body">' +
            (r ? '<div class="ums-grid ums-grid--2">' + kv(TRAI, r) + kv(PHAI, r) + '</div>'
               : ui.empty('Chọn một thí sinh ở danh sách bên trái để xem hồ sơ và tiếp nhận.', 'fa-hand-pointer')) +
            '</div></div>';
    }
    veHoSo();

    /* ---------------- Danh sách thí sinh ---------------- */
    function veDs() {
        if (m.sideCount) m.sideCount.textContent = '(' + st.total + ')';
        m.sideBody.innerHTML = !st.rows.length ? ui.empty('Không tìm thấy thí sinh', 'fa-users') : st.rows.map(function (r) {
            return '<button type="button" class="ums-master__item ums-dsns__item' + (st.chon && st.chon.ID === r.ID ? ' is-active' : '') +
                '" data-id="' + esc(e(r.ID)) + '">' + pat.anhNguoi(r.ANH) +
                '<span class="ums-master__item__main"><b>' + esc((e(r.HODEM) + ' ' + e(r.TEN)).trim()) +
                '</b>' +
                '<span class="ums-master__item__sub">' + esc(e(r.SOBAODANH)) + '</span></span>' +
                (Number(r.DANHAPHOC) === 1 ? '<i class="fa-light fa-tag ums-master__tt" title="Đã nhập học"></i>' : '') + '</button>';
        }).join('');
        m.setPage({
            index: st.page, size: st.size, total: st.total, shown: st.rows.length,
            onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) tai(p); },
            onSize: function (v) { st.size = v; tai(1); }
        });
    }

    var token = 0;
    function tai(page, giu) {
        if (page) st.page = page;
        var t = ++token;
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: A + 'DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP', func: P + 'LayDSQLSV_NguoiHoc_TTTS',
            dDaNhapHoc: dk(), strTaiChinh_KeHoach_Id: fKh.value || 'xxx', strNguoiThucHien_Id: '',
            strTuKhoa: m.search ? (m.search.value || '').trim() : '',
            pageIndex: st.page, pageSize: st.size
        }).then(function (r) {
            if (t !== token) return;
            st.rows = arr(r.data);
            st.total = st.rows.length ? (Number(r.pager) || st.rows.length) : 0;
            if (st.chon) {
                var con = st.rows.filter(function (x) { return x.ID === st.chon.ID; })[0];
                if (con) st.chon = con;
                else if (!giu) { st.chon = null; st.tiepNhan = null; veHoSo(); }
                if (con) veHoSo();
            }
            veDs();
        }).catch(function (err) {
            if (t !== token) return;
            st.rows = []; st.total = 0;
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách thí sinh');
        });
    }

    m.side.addEventListener('click', function (ev) {
        var it = ev.target.closest('.ums-dsns__item');
        if (!it || !m.sideBody.contains(it)) return;
        var r = st.rows.filter(function (x) { return e(x.ID) === it.getAttribute('data-id'); })[0];
        if (!r) return;
        st.chon = r; st.tiepNhan = null;
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-dsns__item'), function (x) { x.classList.toggle('is-active', x === it); });
        veHoSo();
    });

    /* popover_NguoiHoc_TTTS (Core/systemextend.js:6418): MSSV (hoặc SBD) · Họ tên · Ngày sinh · Ngành học · Lớp học / Lớp dự kiến */
    ui.hoverCard(m.sideBody, '.ums-dsns__item', function (it) {
        var r = st.rows.filter(function (x) { return e(x.ID) === it.getAttribute('data-id'); })[0];
        if (!r) return null;
        var coMa = !!e(r.MASO), coLop = !!e(r.DAOTAO_LOPQUANLY_TEN);
        return '<div class="ums-hovercard__in"><div class="ums-hovercard__rows">' +
            '<div class="ums-hovercard__row"><i class="fa-light fa-id-card"></i><b>' + esc((coMa ? 'MSSV ' + e(r.MASO) : 'SBD ' + e(r.SOBAODANH))) + '</b></div>' +
            [['fa-user', 'Họ tên', (e(r.HODEM) + ' ' + e(r.TEN)).trim()],
             ['fa-cake-candles', 'Ngày sinh', e(r.NGAYSINH_NGAY) + '/' + e(r.NGAYSINH_THANG) + '/' + e(r.NGAYSINH_NAM)],
             ['fa-graduation-cap', 'Ngành học', e(r.NGANHHOC_TEN)],
             ['fa-users', coLop ? 'Lớp học' : 'Lớp dự kiến', coLop ? e(r.DAOTAO_LOPQUANLY_TEN) : e(r.MALOPDUKIEN)]].map(function (d) {
                return '<div class="ums-hovercard__row"><i class="fa-light ' + d[0] + '"></i><span>' + esc(d[1]) + ' :</span><b>' + esc(d[2]) + '</b></div>';
            }).join('') + '</div></div>';
    });

    /* Luật cột trái: Tải lại + Bộ lọc nâng cao; kế hoạch bắt buộc → khung lọc mở sẵn; đổi ô lọc / gõ tìm là tự tải */
    pat.cotTrai(m, { tai: function () { tai(1); }, moSan: true });

    /* ---------------- Báo cáo / Import ---------------- */
    ums.report.mount(root.querySelector('[data-z="report"]'), {
        collect: function (add) {
            add('strTaiChinh_KeHoach_Id', fKh.value);
            if (st.chon) add('strQLSV_NguoiHoc_Id', st.chon.ID);
            add('strPhieuThu_Id', '');      // gốc: me.strPhieuThu_Id — chỉ đặt từ khối Tài chính ẩn, luôn rỗng
        }
    });

    /* ---------------- Tiếp nhận ---------------- */
    function veVe(d) {
        var tn = arr(d.rsTiepNhan)[0] || {}, sv = arr(d.rsSinhVien)[0] || {}, rs = arr(d.rs)[0] || {};
        var qr = 'https://api.vietqr.io/image/970418-' + encodeURIComponent(e(rs.MADINHDANHTONG)) +
            '-JIzXIaG.jpg?accountName=TRUONG%20DAI%20HOC%20CMC&amount=' + encodeURIComponent(e(rs.SOTIENPHAINOP)) +
            '&addInfo=' + encodeURIComponent(e(sv.MASINHVIEN));
        var ma = 'https://barcode.tec-it.com/barcode.ashx?data=' + encodeURIComponent(e(sv.MASINHVIEN)) + '&code=Code39';
        /* Kiểu viết thẳng vào thẻ (như gốc) — phần này được mở sang cửa sổ in, không mang theo CSS của trang */
        return '<table style="border-collapse:collapse;width:100%;font-size:10px" border="1" cellpadding="6">' +
            '<tbody><tr><td style="text-align:center;width:100px;font-weight:bold;font-size:13px">' + esc(e(tn.MATIEPNHAN)) + '</td>' +
            '<td style="text-align:center;font-weight:bold;text-transform:uppercase" colspan="2">' + esc(e(sv.HOVATEN)) + '</td></tr>' +
            '<tr><td rowspan="2"><img src="' + esc(qr) + '" style="width:80px" alt=""></td>' +
            '<td style="text-align:center" colspan="2"><img alt="Barcode Generator TEC - IT" src="' + esc(ma) + '" style="height:40px"></td></tr>' +
            '<tr><td style="width:60px;text-align:center;font-size:15px">' + esc(ui.money(tn.TONGSOTENDANOP || 0) || '0') + '</td>' +
            '<td>' + esc(e(tn.TINHTRANGTHANHTOAN)) + '</td></tr></tbody></table>';
    }

    function tiepNhan() {
        if (!st.chon || !fKh.value) { ui.toast('Chọn kế hoạch và thí sinh cần tiếp nhận.', 'warn'); return; }
        var nguoi = st.chon;
        ums.api.call({ action: 'NH_QuayNhapHoc/ThucHienTiepNhanNhapHoc', method: 'GET', type: 'GET',
            strChucNang_Id: (ums.state && ums.state.chucNangId) || '',
            strTC_KeHoachNhapHoc_Id: fKh.value, strQLSV_NguoiHoc_TTTS_Id: nguoi.ID, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var d = r.data || {};
            var tn = arr(d.rsTiepNhan)[0];
            if (!tn) { ui.toast('Máy chủ không trả thông tin tiếp nhận.', 'warn'); return; }
            if (st.chon && st.chon.ID === nguoi.ID) { st.tiepNhan = tn; veHoSo(); }
            var ve = veVe(d);
            ui.dialog({
                title: 'Thanh toán', icon: 'fa-pen-to-square', size: 'lg',
                body: '<div class="ums-u-mb-4">Tiếp nhận thành công<br><span style="color:var(--ums-ok);font-size:40px;font-style:italic">' +
                    esc(e(tn.MATIEPNHAN) + ' : ' + e(tn.NGAYTAO_DD_MM_YYYY)) + '</span></div>' + ve,
                buttons: [{ kind: 'print', text: 'In', mod: 'primary', keepOpen: true,
                    onClick: function () { ui.print(ve, { title: 'Print' }); } }],
                onClose: function () { tai(null, true); }
            });
        }).catch(function (err) { ums.api.handle(err, 'tiếp nhận nhập học'); });
    }
    m.main.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="tiepnhan"]');
        if (b && !b.disabled) tiepNhan();
    });

    /* ---------------- Khởi tạo ---------------- */
    ums.api.call({ action: A + 'DSA4BRIKJAkuICIpDykgMQkuIgPP', func: P + 'LayDSKeHoachNhapHoc', strNguoiThucHien_Id: uid() })
        .then(function (r) {
            var ds = arr(r.data);
            pat.fill(fKh, ds, { name: 'TENKEHOACH', head: 'Chọn kế hoạch nhập học' });
            if (ds.length && !fKh.value) { fKh.value = ds[0].ID; if (window.jQuery) jQuery(fKh).trigger('change.select2'); }   // selectOne
        })
        .catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); })
        .then(function () { tai(1); });
})();
