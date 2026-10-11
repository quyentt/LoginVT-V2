/* =========================================================================
   Khung "Quy trình 2" dùng chung: Tính phí / Chuyển dữ liệu kế toán (ums.ktxTC.hangDoi)
   ---------------------------------------------------------------------------
   Hai màn gốc (tinhphi.js 404 dòng, chuyendulieuketoan.js 1.012 dòng) cùng một bố cục: hai cột trên (trái = ô Năm / Tháng /
   Nghiệp vụ áp dụng + nút Báo cáo / Xem danh sách / <chạy> + các hàng đợi chưa xong; phải = "Lịch sử: …" 4 cột), dưới là
   khung "1) Danh sách …" (bảng kết quả, cột Số tiền có dòng tổng — insertSumAfterTable gốc) với nút Tải lại.

   ums.ktxTC.hangDoi({
       root, title, quyTrinh, lichSu, danhSach, loai (strLoaiNhiemVu của hàng đợi),
       chay: { text, icon, confirm, action, fail },     — nút chạy: hỏi → GET action (strNam, strThang, strNghiepVuApDung_Id) → nạp lại hàng đợi
       list: function (f) → lời gọi bảng kết quả (f = { nam, thang, nv }),
       baoCao: function (add, f)                         — collect cho ums.report.mount (addKeyValue của gốc)
   })
   Hàng đợi: edu.system.createHangDoi → ums.queue.mount (history: false, lịch sử tự vẽ đúng 4 cột gốc như ApisCMS/hangdoi/chuyendulieu).
   Khác gốc: bảng kết quả nạp ngay khi mở màn (gốc chờ bấm "Xem danh sách" — vẫn giữ nút).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.ktxTC, e = T.e;

    T.hangDoi = function (o) {
        var root = o.root;
        root.innerHTML =
            pat.page(o.title, '') +
            '<div class="ums-grid ums-grid--2">' +
                pat.panel({ title: o.quyTrinh, icon: 'fa-gears', body:
                    '<div class="ums-grid ums-grid--2">' +
                        ui.field('Năm', '<input class="ums-input" data-k="nam" inputmode="numeric" autocomplete="off">') +
                        ui.field('Tháng', '<input class="ums-input" data-k="thang" inputmode="numeric" autocomplete="off">') +
                        '<div style="grid-column:1 / -1">' + ui.field('Nghiệp vụ áp dụng', '<select class="ums-select" data-k="nv" data-ph="Chọn nghiệp vụ áp dụng"><option value="">-- Chọn nghiệp vụ --</option></select>') + '</div>' +
                    '</div>' +
                    '<div class="ums-row ums-row--end ums-u-mt-3"><span data-z="baocao"></span>' +
                        ui.btn('view', { text: 'Xem danh sách', attr: { 'data-a': 'xem' } }) +
                        ui.btn('confirm', { text: o.chay.text, icon: o.chay.icon, mod: 'primary', attr: { 'data-a': 'chay' } }) +
                    '</div>' +
                    '<div class="ums-u-mt-4" data-z="hangdoi"></div>' }) +
                pat.panel({ title: o.lichSu, icon: 'fa-clock-rotate-left', zone: 'lichsu', flush: true }) +
            '</div>' +
            pat.panel({ cls: 'ums-u-mt-5', title: o.danhSach, icon: 'fa-list', count: 'tong', zone: 'ketqua', flush: true,
                tools: ui.btn('reload', { attr: { 'data-a': 'tailai' } }) });

        var el = {
            nam: root.querySelector('[data-k="nam"]'), thang: root.querySelector('[data-k="thang"]'), nv: root.querySelector('[data-k="nv"]'),
            lichSu: root.querySelector('[data-z="lichsu"]'), ketQua: root.querySelector('[data-z="ketqua"]'), tong: root.querySelector('[data-z="tong"]')
        };
        el.nam.value = T.namNay();
        el.thang.value = T.thangNay();
        ums.api.dm('KTX.NVAP').then(function (r) { pat.fill(el.nv, r || [], { head: '-- Chọn nghiệp vụ --' }); }).catch(function (err) { ums.api.handle(err, 'nghiệp vụ áp dụng'); });
        function f() { return { nam: el.nam.value.trim(), thang: el.thang.value.trim(), nv: el.nv.value }; }

        /* ---------- Hàng đợi + lịch sử ---------- */
        function veLichSu(rows) {
            ui.table({ el: el.lichSu, rows: rows || [], empty: 'Không có dữ liệu tìm thấy!', columns: [
                { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TENDAYDU' },
                { title: 'Ngày thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                { title: 'Tổng thực hiện', prop: 'TONGDULIEUCANTHUCHIEN', cls: 'is-center' },
                { title: 'Tổng hoàn thành', prop: 'TONGDULIEUDAHOANTHANH', cls: 'is-center' }
            ] });
        }
        var q = ums.queue.mount(root.querySelector('[data-z="hangdoi"]'), { strLoaiNhiemVu: o.loai, history: false, onDone: function () { napLai(); taiKetQua(); } });
        function napLai() { return q.reload().then(veLichSu); }

        function chay() {
            ui.confirm(o.chay.confirm, { ok: o.chay.text }).then(function (yes) {
                if (!yes) return;
                var v = f();
                return ums.api.call({ action: o.chay.action, method: 'GET', strNam: v.nam, strThang: v.thang, strNghiepVuApDung_Id: v.nv }).then(function () {
                    ui.toast('Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!', 'ok');
                    return napLai();
                });
            }).catch(function (err) { ums.api.handle(err, o.chay.fail); });
        }

        /* ---------- Bảng kết quả ---------- */
        function taiKetQua() {
            el.ketQua.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(o.list(f())).then(function (r) {
                var rows = Array.isArray(r.data) ? r.data : [];
                el.tong.textContent = rows.length ? '(' + (r.pager || rows.length) + ')' : '';
                ui.table({ el: el.ketQua, rows: rows, empty: 'Không có dữ liệu tìm thấy!', columns: [
                    { title: 'Mã số', prop: 'KTX_DOITUONGOKYTUCXA_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return ui.esc((e(r.KTX_DOITUONGOKYTUCXA_HODEM) + ' ' + e(r.KTX_DOITUONGOKYTUCXA_TEN)).trim()); } },
                    { title: 'Ngày sinh', prop: 'KTX_DOITUONGOKYTUCXA_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Lớp', prop: 'KTX_DOITUONGOKYTUCXA_LOP' },
                    { title: 'Ngành', prop: 'KTX_DOITUONGOKYTUCXA_NGANH' },
                    { title: 'Khóa học', prop: 'KTX_DOITUONGOKYTUCXA_KHOAHOC' },
                    { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                    { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(e(r.DAOTAO_THOIGIANDAOTAO_NAM) + ',' + e(r.DAOTAO_THOIGIANDAOTAO_THANG)); } },
                    { title: 'Số tiền', prop: 'SOTIEN', cls: 'is-right is-nowrap', sum: true, render: function (r) { return ui.money(r.SOTIEN); } },
                    { title: 'Ngày tạo', prop: 'NGAYTAO', cls: 'is-center is-nowrap' }
                ] });
            }).catch(function (err) { el.ketQua.innerHTML = ui.fail(err.message); ums.api.handle(err, o.danhSach); });
        }

        ums.report.mount(root.querySelector('[data-z="baocao"]'), { collect: function (add) { o.baoCao(add, f()); } });

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            var a = b.getAttribute('data-a');
            if (a === 'chay') chay();
            else if (a === 'xem' || a === 'tailai') taiKetQua();
        });

        el.lichSu.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        napLai();
        taiKetQua();
        return { taiKetQua: taiKetQua, napLai: napLai };
    };
})();
