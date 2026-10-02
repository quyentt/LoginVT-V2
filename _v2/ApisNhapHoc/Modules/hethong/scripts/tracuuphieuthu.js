/* =========================================================================
   Tra cứu phiếu thu (Nhập học)
   Bản gốc: ApisNhapHoc/Modules/hethong/html/tracuuphieuthu.html + scripts/tracuuphieuthu.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP  PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc
         strNguoiThucHien_Id = người đăng nhập            → ô "Chọn kế hoạch" (CHỌN NHIỀU, ID / TENKEHOACH)
     NH_KeHoachNhanSu/LayDanhSach  GET  (mỗi kế hoạch đã chọn MỘT lời gọi, gộp kết quả)
         pageIndex 1, pageSize 10000, strNguoiDung_Id '', strTAICHINH_KeHoach_Id, strNguoiThucHien_Id '', strTuKhoa ''
                                                            → ô "Chọn nhân sự" (NGUOIDUNG_ID / NGUOIDUNG_TAIKHOAN)
     NH_ThongKe/LayDSPhieuThuTheoKeHoach  GET
         strTaiChinh_KeHoach_Ids (id nối dấu phẩy), dLoaiPhieu (-1 toàn bộ · 1 phiếu thu · 0 phiếu huỷ · 2 phiếu đã sửa),
         strNguoiThucHien_Id = ô nhân sự, strTuKhoa, pageIndex 1, pageSize 10000
         Thẻ: SOPHIEUTHU, NGUOITAO_TAIKHOAN, NGAYTAO_DD_MM_YYYY; màu theo TINHTRANG (1 thường · -1 huỷ · 2 sửa).
         Tổng: TONGSODATHU / TONGSOHUY / TONGSOSUA của dòng đầu.
     Lưu ý (như gốc): ô nhân sự để trống → tầng gọi API điền strNguoiThucHien_Id = người đăng nhập
     (makeRequest gốc cũng thay chuỗi rỗng) — tức "chưa chọn nhân sự" = phiếu do chính mình thu.

   Giữ như gốc: chọn kế hoạch chỉ nạp lại ô nhân sự (không tự tải danh sách phiếu); đổi "Loại phiếu" /
   Enter ở ô từ khoá / "Tìm kiếm" thì tải danh sách. Thẻ phiếu chỉ để xem (gốc không có xem / in / huỷ).
   Khác gốc:
     · Bỏ chọn kế hoạch cũng nạp lại ô nhân sự (gốc chỉ nghe select2:select — bỏ chọn thì danh sách nhân sự cũ đứng im).
     · Nhân sự trùng qua nhiều kế hoạch chỉ hiện một lần (gốc gộp thẳng → một người hiện nhiều dòng).
     · Không có phiếu nào: hiện "Không tìm thấy dữ liệu", tổng = 0 (gốc vẽ một thẻ rỗng "Số: #").
     · Nút "Tải lại" gốc không gắn xử lý → bản mới tải lại danh sách.
     · Bỏ ảnh minh hoạ "bien-lai.png" (trang trí).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('nh-tracuuphieuthu');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }

    var LOAI = [['-1', 'Toàn bộ'], ['1', 'Phiếu thu'], ['0', 'Phiếu hủy'], ['2', 'Phiếu đã sửa']];
    var W = { labelWidth: '150px', inline: true };

    root.innerHTML = pat.page('Tra cứu phiếu thu') +
        '<div class="ums-grid ums-grid--2 ums-cols ums-u-mb-4">' +
        pat.panel({ title: false, body: '<div class="ums-stack">' +
            ui.field('Chọn kế hoạch', '<select class="ums-select" data-f="kh" multiple data-ph="Chọn kế hoạch nhập học"></select>', W) +
            ui.field('Chọn nhân sự', '<select class="ums-select" data-f="ns" data-ph="Chọn nhân sự"><option value="">Chọn nhân sự</option></select>', W) +
            ui.field('Loại phiếu', '<div class="ums-row" style="min-height:var(--ums-control-h)">' + LOAI.map(function (x, i) {
                return '<label class="ums-check"><input type="radio" name="nhTcptLoai" data-f="loai" value="' + x[0] + '"' +
                    (i ? '' : ' checked') + '> ' + x[1] + '</label>';
            }).join('') + '</div>', W) +
            ui.field('Nhập từ khoá', '<input class="ums-input" data-f="q" autocomplete="off" placeholder="Nhập từ khóa tìm kiếm: số phiếu, mã người thu...">', W) +
            '<div class="ums-row ums-row--end">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Tổng số phiếu', icon: 'fa-chart-simple', body: '<div class="ums-stack" data-z="tong"></div>' }) +
        '</div>' +
        pat.panel({ title: 'Danh sách số phiếu thu', icon: 'fa-file-invoice', count: 'count', flush: true, zone: 'cards',
            tools: ui.btn('reload', { attr: { 'data-a': 'tailai' } }) });
    ui.enhance(root);

    function q(s) { return root.querySelector(s); }
    var fKh = q('[data-f="kh"]'), fNs = q('[data-f="ns"]'), fQ = q('[data-f="q"]');
    function khIds() {
        var v = window.jQuery ? (jQuery(fKh).val() || []) : [];
        return v.filter(Boolean).join(',');
    }

    function veTong(r0) {
        var dathu = Number(r0.TONGSODATHU) || 0, huy = Number(r0.TONGSOHUY) || 0, sua = Number(r0.TONGSOSUA) || 0;
        function dong(icon, nhan, n, tone) {
            var p = dathu ? Math.min(100, Math.round(n * 100 / dathu)) : 0;
            return '<div><div class="ums-row ums-row--between ums-u-fz13">' +
                '<span class="ums-u-semi" style="color:var(--ums-' + tone + ')"><i class="fa-light ' + icon + '"></i> ' + esc(nhan) + '</span>' +
                '<b>' + esc(e(n)) + '</b></div>' +
                '<div class="ums-meter__track ums-u-mt-2"><div class="ums-meter__fill" style="width:' + p + '%;background:var(--ums-' + tone + ')"></div></div></div>';
        }
        /* màu như gốc: tổng phiếu thu xanh (color-active), đã huỷ xanh lá (color-green), đã sửa đỏ (color-red) */
        q('[data-z="tong"]').innerHTML =
            dong('fa-file-invoice-dollar', 'Tổng số phiếu thu', dathu, 'blue') +
            dong('fa-receipt', 'Tổng số phiếu thu đã hủy', huy, 'ok') +
            dong('fa-file-pen', 'Tổng số phiếu thu đã sửa', sua, 'bad');
    }
    veTong({});

    function tone(t) { t = Number(t); return t === 1 ? 'info' : t === -1 ? 'bad' : t === 2 ? 'warn' : ''; }

    var token = 0;
    function taiPhieu() {
        var t = ++token, host = q('[data-z="cards"]');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'NH_ThongKe/LayDSPhieuThuTheoKeHoach', method: 'GET', versionAPI: 'v1.0',
            strTaiChinh_KeHoach_Ids: khIds(),
            dLoaiPhieu: (q('[data-f="loai"]:checked') || {}).value || '-1',
            strNguoiThucHien_Id: fNs.value,
            strTuKhoa: (fQ.value || '').trim(),
            pageIndex: 1, pageSize: 10000
        }).then(function (r) {
            if (t !== token) return;
            var rows = arr(r.data);
            q('[data-z="count"]').textContent = '(' + rows.length + ')';
            veTong(rows[0] || {});
            pat.cards({ el: host, items: rows, empty: 'Không tìm thấy dữ liệu',
                tone: function (x) { return tone(x.TINHTRANG); },
                render: function (x) {
                    return '<span class="ums-card__row"><span>Số</span><b class="ums-card__no">#' + esc(e(x.SOPHIEUTHU)) + '</b></span>' +
                        pat.cardRow('Người thu', e(x.NGUOITAO_TAIKHOAN)) + pat.cardRow('Ngày thu', e(x.NGAYTAO_DD_MM_YYYY));
                } });
        }).catch(function (err) {
            if (t !== token) return;
            host.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách phiếu thu');
        });
    }

    function taiNhanSu() {
        var ids = khIds();
        var ds = ids ? ids.split(',') : [''];
        return Promise.all(ds.map(function (id) {
            return ums.api.call({ action: 'NH_KeHoachNhanSu/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                pageIndex: 1, pageSize: 10000, strNguoiDung_Id: '', strTAICHINH_KeHoach_Id: id,
                strNguoiThucHien_Id: '', strTuKhoa: '' }).then(function (r) { return arr(r.data); });
        })).then(function (ks) {
            var gap = {}, rows = [];
            ks.forEach(function (k) { k.forEach(function (x) { if (!gap[x.NGUOIDUNG_ID]) { gap[x.NGUOIDUNG_ID] = 1; rows.push(x); } }); });
            pat.fill(fNs, rows, { id: 'NGUOIDUNG_ID', name: 'NGUOIDUNG_TAIKHOAN', head: 'Chọn nhân sự' });
        }).catch(function (err) { ums.api.handle(err, 'nhân sự kế hoạch'); });
    }

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="tim"], [data-a="tailai"]')) taiPhieu();
    });
    root.addEventListener('change', function (ev) { if (ev.target.matches('[data-f="loai"]')) taiPhieu(); });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); taiPhieu(); } });
    if (window.jQuery) jQuery(fKh).on('select2:select select2:unselect select2:clear', function () { taiNhanSu(); });

    ums.api.call({ action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
        func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc', strNguoiThucHien_Id: uid() })
        .then(function (r) { pat.fill(fKh, arr(r.data), { name: 'TENKEHOACH' }); })
        .catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); })
        .then(function () { taiPhieu(); taiNhanSu(); });
})();
