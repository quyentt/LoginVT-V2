/* =========================================================================
   tkgg — tầng chung các màn THỐNG KÊ GIỜ GIẢNG (ApisTKGG/Modules/kehoach): ums.tkgg.*
   Bản gốc: ApisTKGG/Modules/kehoach/script/*.js — 11 màn trên menu host (6/10) chép nhau ba khối:
     1. Bộ lọc nối tầng "Thời gian tổng hợp → Kế hoạch tổng hợp → Kế hoạch chi tiết" (dongia, phamvicoithi, phamvichamthi,
        xacdinhphamvi, lophocphan, kehoachchitiet). Có HAI họ lời gọi cùng thủ tục — màn nào dùng họ nào thì giữ đúng họ đó:
          · 'plain' : TKGG_KeHoach/LayDSThoiGianTongHopKL · LayDSKLGD_TongHopKhoiLuong · LayDSKLGD_KeHoachChiTiet  (GET, không mã hoá)
          · 'ma'    : NS_KLGD_KeHoach_MH/<mã> + func PKG_KLGV_V2_KEHOACH.<cùng tên>  (POST, mã hoá — api.js tự thêm iM khi có func)
     2. Ô "Loại" theo phạm vi: NS_KLGD_XacNhan_MH/DSA4BRINLiAoGSAiDykgLx4JIC8pBS4vJgPP func pkg_klgv_v2_xacnhan.LayDSLoaiXacNhan_HanhDong
        (strLoaiXacNhan_Id = mã danh mục KLGD.PHANLOAIXACNHAN đã chọn) → ID / TEN.
     3. Khối XÁC NHẬN (lophocphan, xacdinhphamvi): hộp "Xác nhận" (Nội dung · Loại xác nhận KLGD.PHANLOAIXACNHAN · các nút hành động
        TKGG_XacNhan/LayHanhDongXacNhanNguoiDung) → mỗi dòng đã đánh dấu một lời gọi TKGG_XacNhan/Them_KLGD_PhanLoai_XacNhan;
        bảng "Lịch sử xác nhận" TKGG_XacNhan/LayDSKLGD_PhanLoai_XacNhan; ô tình trạng từng dòng TKGG_XacNhan/LayTTKLGD_PhanLoai_XacNhan.
   ---------------------------------------------------------------------------
   ums.tkgg.thoiGian(loai)                 nguồn ô Thời gian tổng hợp { call, name: 'THOIGIAN' }
   ums.tkgg.thoiGianDaoTao()               nguồn ô Thời gian (DAOTAO_THOIGIANDAOTAO) — edu.system.getList_ThoiGianDaoTao (hesoquymo, hesophamvi)
   ums.tkgg.keHoachTongHop(loai, tgId)     lời gọi danh sách kế hoạch tổng hợp (strTuKhoa '', dHieuLuc -1, pageSize 100000)
   ums.tkgg.keHoachChiTiet(loai, tgId, thId) lời gọi danh sách kế hoạch chi tiết (các ô gốc đọc dropAAAA/txtAAAA → '')
   ums.tkgg.boLocKeHoach(host, { loai, muc: 2|3, nhan, onDoi(k, v) })
        → { el(k), v(k), fill(k, rows), nap() }  — ba ô chọn nối tầng dựng trong host (.ums-grid), luật cha → con (pat.chain),
          đổi tầng trên thì nạp lại tầng dưới; k = 'tg' | 'th' | 'ct'
   ums.tkgg.loaiApDung(phamViId)           Promise<rows ID/TEN> cho ô "Loại"
   ums.tkgg.xacNhan(o)                     mở HỘP THOẠI xác nhận hàng loạt (việc phụ → ui.dialog):
        o = { ids: [DULIEUXACNHAN…], ten: chuỗi hiện ở tiêu đề, loaiMacDinh, onXong() }
   ums.tkgg.lichSuXacNhan(host, duLieuId)  vẽ bảng lịch sử xác nhận vào host
   ums.tkgg.ttXacNhan(duLieuId, loaiId)    Promise<HANHDONG_TEN | ''>
   ums.tkgg.xoaNhieu(ids, callOf, title)   ui.batch xoá từng id (gốc genHTML_Progress + N lời gọi)
   Khác bản gốc (chung): hỏi lại một lần, chạy một lần (gốc gắn chồng #btnYes); xoá / xác nhận hàng loạt có tiến độ và báo gộp.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var T = ums.tkgg = ums.tkgg || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    T.uid = uid; T.e = e; T.arr = arr;

    var MA = {
        thoiGian: { action: 'NS_KLGD_KeHoach_MH/DSA4BRIVKS4oBiggLxUuLyYJLjEKDQPP', func: 'PKG_KLGV_V2_KEHOACH.LayDSThoiGianTongHopKL' },
        tongHop: { action: 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHhUuLyYJLjEKKS4oDTQuLyYP', func: 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKhoiLuong' },
        chiTiet: { action: 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgokCS4gIikCKSgVKCQ1', func: 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_KeHoachChiTiet' }
    };
    var PLAIN = {
        thoiGian: { action: 'TKGG_KeHoach/LayDSThoiGianTongHopKL', method: 'GET' },
        tongHop: { action: 'TKGG_KeHoach/LayDSKLGD_TongHopKhoiLuong', method: 'GET' },
        chiTiet: { action: 'TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet', method: 'GET' }
    };
    function ho(loai) { return loai === 'ma' ? MA : PLAIN; }

    T.thoiGian = function (loai) { return { call: Object.assign({}, ho(loai).thoiGian), id: 'ID', name: 'THOIGIAN' }; };
    T.thoiGianDaoTao = function () {
        return { rows: function () { return ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }); }, id: 'ID', name: 'DAOTAO_THOIGIANDAOTAO' };
    };
    T.keHoachTongHop = function (loai, tgId) {
        return Object.assign({}, ho(loai).tongHop, { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: e(tgId), dHieuLuc: -1, pageIndex: 1, pageSize: 100000 });
    };
    T.keHoachChiTiet = function (loai, tgId, thId) {
        return Object.assign({}, ho(loai).chiTiet, { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: e(tgId), strKLGD_TongHopKhoiLuong_Id: e(thId),
            strCheDoApDung_Id: '', strPhanLoai_Id: '', strTuNgay: '', strDenNgay: '', dHieuLuc: '', pageIndex: 1, pageSize: 100000 });
    };

    /* ---------- Bộ lọc nối tầng Thời gian → KH tổng hợp → KH chi tiết ---------- */
    var NHAN = { tg: 'Chọn thời gian', th: 'Chọn kế hoạch tổng hợp', ct: 'Chọn kế hoạch chi tiết' };
    T.boLocKeHoach = function (host, o) {
        o = o || {};
        var muc = o.muc || 3, keys = ['tg', 'th', 'ct'].slice(0, muc), nhan = Object.assign({}, NHAN, o.nhan || {});
        host.innerHTML = keys.map(function (k) {
            return '<div class="ums-field"><select class="ums-select" data-tkgg="' + k + '" data-ph="' + esc(nhan[k]) + '"><option value="">' + esc(nhan[k]) + '</option></select></div>';
        }).join('');
        var el = {}; keys.forEach(function (k) { el[k] = host.querySelector('[data-tkgg="' + k + '"]'); ui.select2(el[k], { placeholder: nhan[k], allowClear: true }); });
        pat.chain(keys.map(function (k) { return el[k]; }));
        function v(k) { return el[k] ? e(el[k].value) : ''; }
        function fill(k, rows) { pat.fill(el[k], rows, { id: 'ID', name: k === 'tg' ? 'THOIGIAN' : 'TEN', head: nhan[k] }); }
        function napTH() { if (!el.th) return Promise.resolve(); fill('th', []); if (el.ct) fill('ct', []); if (!v('tg')) return Promise.resolve(); return ums.api.call(T.keHoachTongHop(o.loai, v('tg'))).then(function (r) { fill('th', arr(r.data)); }).catch(function (err) { ums.api.handle(err, 'kế hoạch tổng hợp'); }); }
        function napCT() { if (!el.ct) return Promise.resolve(); fill('ct', []); if (!v('th')) return Promise.resolve(); return ums.api.call(T.keHoachChiTiet(o.loai, v('tg'), v('th'))).then(function (r) { fill('ct', arr(r.data)); }).catch(function (err) { ums.api.handle(err, 'kế hoạch chi tiết'); }); }
        el.tg.addEventListener('change', function () { napTH().then(function () { if (o.onDoi) o.onDoi('tg', v('tg')); }); });
        if (el.th) el.th.addEventListener('change', function () { napCT().then(function () { if (o.onDoi) o.onDoi('th', v('th')); }); });
        if (el.ct) el.ct.addEventListener('change', function () { if (o.onDoi) o.onDoi('ct', v('ct')); });
        var sanSang = ums.api.call(T.thoiGian(o.loai).call).then(function (r) { fill('tg', arr(r.data)); }).catch(function (err) { ums.api.handle(err, 'thời gian tổng hợp'); });
        return { el: function (k) { return el[k]; }, v: v, fill: fill, nap: function () { return sanSang; }, sanSang: sanSang };
    };

    /* ---------- Ô "Loại" theo phạm vi ---------- */
    T.loaiApDung = function (phamViId) {
        if (!phamViId) return Promise.resolve([]);
        return ums.api.call({ action: 'NS_KLGD_XacNhan_MH/DSA4BRINLiAoGSAiDykgLx4JIC8pBS4vJgPP', func: 'pkg_klgv_v2_xacnhan.LayDSLoaiXacNhan_HanhDong', strLoaiXacNhan_Id: e(phamViId) })
            .then(function (r) { return arr(r.data); });
    };

    /* ---------- Xoá nhiều ---------- */
    T.xoaNhieu = function (ids, callOf, title) {
        return ui.batch(ids.map(function (id) { return callOf(id); }), { title: title || 'Đang xoá', okText: 'Xóa thành công!' });
    };

    /* ---------- Khối xác nhận ---------- */
    T.ttXacNhan = function (duLieuId, loaiId) {
        return ums.api.call({ action: 'TKGG_XacNhan/LayTTKLGD_PhanLoai_XacNhan', method: 'GET', silent: true, strLoaiXacNhan_Id: e(loaiId), strDuLieuXacNhan: e(duLieuId) })
            .then(function (r) { var d = arr(r.data); return d.length ? e(d[0].HANHDONG_TEN) : ''; }).catch(function () { return ''; });
    };
    T.lichSuXacNhan = function (host, duLieuId) {
        return ums.api.call({ action: 'TKGG_XacNhan/LayDSKLGD_PhanLoai_XacNhan', method: 'GET', strTuKhoa: '', strDuLieuXacNhan: e(duLieuId), strLoaiXacNhan_Id: '', strNguoiXacNhan_Id: '', strHanhDong_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                ui.table({ el: host, rows: arr(r.data), stt: true, empty: 'Chưa có xác nhận nào', columns: [
                    { title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
            }).catch(function (err) { ums.api.handle(err, 'lịch sử xác nhận'); });
    };
    /* Hộp xác nhận hàng loạt — gốc: modal_XacNhan (Nội dung · Loại xác nhận · dãy nút hành động to, bấm nút = gửi cho mọi dòng đã đánh dấu) */
    T.xacNhan = function (o) {
        o = o || {};
        var ids = (o.ids || []).filter(Boolean);
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return null; }
        var dlg = ui.dialog({
            title: 'Xác nhận' + (o.ten ? ': ' + o.ten : ''), icon: 'fa-check-to-slot', size: 'md',
            body: '<div class="ums-grid ums-grid--2">' +
                '<div style="grid-column:1 / -1">' + ui.field('Nội dung', '<input class="ums-input" data-xn="nd" autocomplete="off">') + '</div>' +
                '<div style="grid-column:1 / -1">' + ui.field('Loại xác nhận', '<select class="ums-select" data-xn="loai" data-ph="-- Chọn --"><option value=""></option></select>', { required: true }) + '</div>' +
                '<div style="grid-column:1 / -1"><div class="ums-legend">Chọn xác nhận</div><div class="tkgg-xn" data-xn="nut">' + ui.empty('Chọn loại xác nhận để hiện các hành động') + '</div></div>' +
                '<div style="grid-column:1 / -1" class="ums-u-fz13 ums-u-muted">Sẽ xác nhận cho <b>' + ids.length + '</b> dòng đã đánh dấu.</div></div>'
        });
        var q = function (k) { return dlg.body.querySelector('[data-xn="' + k + '"]'); };
        var loai = q('loai');
        ums.api.dm('KLGD.PHANLOAIXACNHAN').then(function (rows) {
            pat.fill(loai, rows, { head: '-- Chọn --' }); ui.select2(loai, { placeholder: '-- Chọn --' });
            if (o.loaiMacDinh) { loai.value = o.loaiMacDinh; if (window.jQuery) jQuery(loai).trigger('change'); }
        });
        function napNut() {
            var host = q('nut'); host.innerHTML = '';
            if (!loai.value) { host.innerHTML = ui.empty('Chọn loại xác nhận để hiện các hành động'); return; }
            ums.api.call({ action: 'TKGG_XacNhan/LayHanhDongXacNhanNguoiDung', method: 'GET', strLoaiXacNhan_Id: e(loai.value) }).then(function (r) {
                var ds = arr(r.data);
                if (!ds.length) { host.innerHTML = ui.empty('Bạn không có hành động xác nhận nào cho loại này'); return; }
                host.innerHTML = ds.map(function (d) {
                    var ic = e(d.THONGTIN1) ? ums.iconFA4(e(d.THONGTIN1)) : 'fa-light fa-paper-plane';
                    return '<button type="button" class="ums-btn ums-btn--out-primary tkgg-xn__nut" data-hd="' + esc(d.ID) + '" style="' + esc(d.THONGTIN2) + '"><i class="' + esc(ic) + '"></i> ' + esc(d.TEN) + '</button>';
                }).join(' ');
            }).catch(function (err) { ums.api.handle(err, 'hành động xác nhận'); });
        }
        loai.addEventListener('change', napNut);
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]'); if (!b) return;
            var hd = b.getAttribute('data-hd'), nd = q('nd').value.trim();
            dlg.close();
            ui.batch(ids.map(function (id) {
                return { action: 'TKGG_XacNhan/Them_KLGD_PhanLoai_XacNhan', method: 'POST', strLoaiXacNhan_Id: e(loai.value), strHanhDong_Id: hd, strNguoiXacNhan_Id: uid(), strThongTinXacNhan: nd, strDuLieuXacNhan: id };
            }), { title: 'Đang xác nhận ' + ids.length + ' dòng', okText: 'Xác nhận thành công' }).then(function (r) { if (o.onXong) o.onXong(r); });
        });
        return dlg;
    };
})();
