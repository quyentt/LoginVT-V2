/* =========================================================================
   tkgg/kehoach — phần dùng chung của hai màn "Lập kế hoạch" (kehoachchung) và "Kế hoạch chi tiết" (kehoachchitiet): ums.tkggKH.*
   Nạp SAU _tkgg.js (ums.tkgg), TRƯỚC script màn. Không sửa _tkgg.js (màn khác đang dùng).
   ---------------------------------------------------------------------------
   ums.tkggKH.goiKHCT(o)              lời gọi TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet GET — chép đúng bộ tham số hai màn gửi:
                                      strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strKLGD_TongHopKhoiLuong_Id, strCheDoApDung_Id '' (gốc dropAAAA),
                                      strPhanLoai_Id, strTuNgay '', strDenNgay '' (gốc txtAAAA), dHieuLuc -1, pageIndex, pageSize
   ums.tkggKH.goiNhanSuKHCT(id)       TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet_NS GET — strTuKhoa '', strNguoiDung_Id '' (gốc txtAAAA/dropAAAA),
                                      strKLGD_KeHoachChiTiet_Id, pageIndex 1, pageSize 100000 → NGUOIDUNG_MASO · NGUOIDUNG_HODEM · NGUOIDUNG_TEN · DONVI_TEN
   ums.tkggKH.hopDanhSach(o)          HỘP THOẠI chỉ xem một danh sách (việc phụ): { title, icon, size, call | call(q) (có ô tìm khi là hàm),
                                      columns, paged (phân trang máy chủ: call(q, page, size)) }
   ums.tkggKH.hopCanBo(title, call)   hộp "Danh sách" cán bộ: Mã số · Họ tên (HODEM + TEN) · Đơn vị (DONVI_TEN) — gốc genTable_CanBo
   ums.tkggKH.hopNhanSuKHCT(id, ten)  hộp nhân sự tham gia của một kế hoạch chi tiết (chỉ xem) — gốc genTable_CanBoChiTiet
   ums.tkggKH.cotChon(nhom) / daChon(host, nhom) / ganChon(host)   cột ô đánh dấu + "chọn tất cả" (chiều cha → con; chiều con → cha ui.js tự lo)
   ums.tkggKH.o(label, ctl, o)        một ô biểu mẫu trong lưới hai cột của pat.formTrang (o.full: cả dòng, o.required)
   ums.tkggKH.HIEULUC · HIENTHI       hai danh sách cố định của ô chọn (gốc <option> viết tay)
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var H = ums.tkggKH = ums.tkggKH || {};
    var e = T.e, arr = T.arr;
    function esc(s) { return ui.esc(e(s)); }
    H.e = e; H.arr = arr; H.esc = esc;
    H.P = 'TKGG_KeHoach/';
    H.KH = 'NS_KLGD_KeHoach_MH/';
    H.HIEULUC = [{ ID: '1', TEN: 'Có hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }];
    H.HIENTHI = [{ ID: '1', TEN: 'Hiển thị' }, { ID: '0', TEN: 'Không hiển thị' }];
    H.hoTen = function (hd, ten) { return (e(hd) + ' ' + e(ten)).trim(); };

    H.goiKHCT = function (o) {
        o = o || {};
        return { action: H.P + 'LayDSKLGD_KeHoachChiTiet', method: 'GET', strTuKhoa: e(o.strTuKhoa), strDaoTao_ThoiGianDaoTao_Id: e(o.strDaoTao_ThoiGianDaoTao_Id),
            strKLGD_TongHopKhoiLuong_Id: e(o.strKLGD_TongHopKhoiLuong_Id), strCheDoApDung_Id: '', strPhanLoai_Id: e(o.strPhanLoai_Id), strTuNgay: '', strDenNgay: '',
            dHieuLuc: -1, pageIndex: o.pageIndex || 1, pageSize: o.pageSize || 100000 };
    };
    H.goiNhanSuKHCT = function (id) {
        return { action: H.P + 'LayDSKLGD_KeHoachChiTiet_NS', method: 'GET', strTuKhoa: '', strNguoiDung_Id: '', strKLGD_KeHoachChiTiet_Id: e(id), pageIndex: 1, pageSize: 100000 };
    };

    /* ---------- Ô đánh dấu ---------- */
    H.cotChon = function (nhom) {
        return { head: '<input type="checkbox" data-chon-all="' + esc(nhom) + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" data-chon="' + esc(nhom) + '" value="' + esc(r.ID) + '">'; } };
    };
    H.daChon = function (host, nhom) {
        return Array.prototype.map.call(host.querySelectorAll('input[data-chon="' + nhom + '"]:checked'), function (c) { return c.value; });
    };
    H.ganChon = function (host) {
        if (host._tkggChon) return; host._tkggChon = true;
        host.addEventListener('change', function (ev) {
            var t = ev.target; if (!t || !t.hasAttribute || !t.hasAttribute('data-chon-all')) return;
            var tb = t.closest('table'); if (!tb) return;
            Array.prototype.forEach.call(tb.querySelectorAll('tbody input[data-chon="' + t.getAttribute('data-chon-all') + '"]'), function (c) { c.checked = t.checked; });
            if (ui.demXoaChon) ui.demXoaChon();
        });
    };

    /* ---------- Ô biểu mẫu ---------- */
    H.o = function (label, ctl, o) {
        o = o || {};
        return '<div' + (o.full ? ' style="grid-column:1 / -1"' : '') + '>' + ui.field(label, ctl, { required: o.required }) + '</div>';
    };
    H.sel = function (k, ph, attr) { return '<select class="ums-select" data-k="' + esc(k) + '" data-ph="' + esc(ph) + '"' + (attr || '') + '><option value="">' + esc(ph) + '</option></select>'; };
    H.inp = function (k, attr) { return '<input class="ums-input" data-k="' + esc(k) + '" autocomplete="off"' + (attr || '') + '>'; };
    H.ngay = function (k) { return '<div class="ums-inputwrap"><input class="ums-input" data-k="' + esc(k) + '" data-date autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>'; };
    H.ta = function (k, rows) { return '<textarea class="ums-textarea" data-k="' + esc(k) + '" rows="' + (rows || 4) + '"></textarea>'; };
    /** Đặt giá trị ô chọn rồi báo select2 vẽ lại (không bắn change thật) */
    H.dat = function (el, v) { if (!el) return; el.value = e(v); if (window.jQuery) jQuery(el).trigger('change.select2'); };

    /* ---------- Hộp xem danh sách ---------- */
    H.hopDanhSach = function (o) {
        var coTim = typeof o.call === 'function';
        var dlg = ui.dialog({
            title: o.title, icon: o.icon || 'fa-list-ul', size: o.size || 'lg',
            body: (coTim ? '<div class="ums-filter ums-u-mb-4"><div class="ums-field"><input class="ums-input" data-h="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' : '') +
                '<div class="ums-tablewrap" data-h="t"></div>'
        });
        var host = dlg.body.querySelector('[data-h="t"]'), q = dlg.body.querySelector('[data-h="q"]');
        var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, hen = 0;
        function tai(p) {
            if (p) page = p;
            host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            var c = coTim ? o.call((q.value || '').trim(), page, size) : o.call;
            ums.api.call(c).then(function (r) {
                var rows = arr(r.data);
                total = o.paged ? (Number(r.pager) || rows.length) : rows.length;
                ui.table({ el: host, rows: rows, stt: true, columns: o.columns, empty: o.empty || 'Không có dữ liệu',
                    page: o.paged ? { index: page, size: size, total: total,
                        onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tai(p); },
                        onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); tai(1); } } : undefined });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, o.title); });
        }
        if (q) {
            q.addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { tai(1); }, 400); });
            q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(hen); tai(1); } });
        }
        tai(1);
        return dlg;
    };
    H.COT_CANBO = [
        { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
        { title: 'Họ tên', render: function (r) { return esc(H.hoTen(r.HODEM, r.TEN)); } },
        { title: 'Đơn vị', prop: 'DONVI_TEN' }];
    H.hopCanBo = function (title, call) {
        return H.hopDanhSach({ title: title, icon: 'fa-users', size: 'md', call: call, columns: H.COT_CANBO, empty: 'Chưa có cán bộ nào' });
    };
    H.hopNhanSuKHCT = function (id, ten) {
        return H.hopDanhSach({ title: 'Nhân sự tham gia' + (ten ? ': ' + ten : ''), icon: 'fa-users', size: 'md', call: H.goiNhanSuKHCT(id), empty: 'Chưa có nhân sự nào', columns: [
            { title: 'Mã số', prop: 'NGUOIDUNG_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc(H.hoTen(r.NGUOIDUNG_HODEM, r.NGUOIDUNG_TEN)); } },
            { title: 'Đơn vị', prop: 'DONVI_TEN' }] });
    };
})();
