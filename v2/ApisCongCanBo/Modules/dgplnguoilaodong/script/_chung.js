/* =========================================================================
   Đánh giá người lao động — khung chung của hai phiếu
   (phieudanhgia = giảng viên, phieudanhgiacanbo = cán bộ)
   Bản gốc: ApisCongCanBo/Modules/dgplnguoilaodong/script/phieudanhgia*.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc: cột trái "Danh sách phiếu đánh giá" (col-lg-3), cột phải
   bảng tiêu chí + "Thông tin sáng kiến" + "Tổng điểm" + nút Lưu.

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_PLDG_NLD_KeHoach/LayDanhSach   GET  strTuKhoa '', strNguoiThucHien_Id '', pageIndex, pageSize
       <ctrl>/LayChiTiet                 GET  strNhanSu_HoSoCanBo_Id = userId, strNhanSu_TDKT_KeHoach_Id ''
       <ctrl>/CapNhat                    POST strNhanSu_HoSoCanBo_Id, strNhanSu_TDKT_KeHoach_Id = kế hoạch đang chọn, …
   Danh mục: CCB.VTSK (vai trò sáng kiến).

   BẢN GỐC CHƯA TỪNG CHẠY — jquery.knob.min.js là tệp RỖNG (0 byte) nên
   $(".knob").knob(…) ném lỗi ngay trong init:
     · phieudanhgia: lỗi xảy ra TRƯỚC khi nạp chi tiết và gắn mọi nút → màn
       trắng dữ liệu, Lưu không chạy.
     · phieudanhgiacanbo: các nút đã gắn nhưng chi tiết không nạp → bấm Lưu là
       ghi đè TOÀN BỘ ý kiến bằng chuỗi rỗng.
     · getList_PhieuDG (cột trái) không nơi nào gọi → danh sách luôn trống.
   Ở đây làm theo ý định: nạp danh sách + chi tiết, "Tổng điểm" hiện số (bỏ
   vòng tròn knob), "Đánh giá" ở cột trái chọn kế hoạch gửi kèm khi Lưu.
   Chi tiết vẫn gửi strNhanSu_TDKT_KeHoach_Id rỗng như bản gốc. THỬ TRÊN HOST.
   Các nút "Kê khai" (edu.system.initMain sang sanphamkhoahoc/…) → ums.app.openPath.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    /* cfg = {
         root, ctrl: 'NS_TDKT_GiangVien',
         rows: [{ ten, gio: COT | fn(d), donVi: 'Giờ chuẩn' | { keKhai: đường dẫn }, diem: COT | fn(d),
                  yk: { p: 'strYK_…', c: 'YK_…' } | 'khong-gui', thiDua: true }],
         tieuChi: [{ ten, keHoach, p: 'dDiemChuyenMon_TC1', c: 'DIEMCHUYENMON_TC1' }]   (tuỳ chọn, phiếu cán bộ)
         extraSave: { tên tham số: '' }        tham số bản gốc đọc từ ô không có trên màn → rỗng
       } */
    ums.dgpl = { phieu: function (cfg) {
        var m = pat.master({
            el: cfg.root, title: 'Phiếu đánh giá',
            side: { title: 'Danh sách phiếu đánh giá', icon: 'fa-clipboard-list', search: 'Nhập từ khóa tìm kiếm' },
            main: { title: 'Phiếu đánh giá', icon: 'fa-clipboard-list',
                    tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }) }
        });
        var keHoach = '', dsKH = [], ct = {};

        /* ---------- Khung phải: bảng tiêu chí + sáng kiến + tổng điểm ---- */
        function oYK(r, i) {
            if (!r.yk) return '';
            return '<input class="ums-input ums-input--sm" data-yk="' + i + '"' + (r.yk === 'khong-gui' ? ' title="Bản gốc không lưu ô này"' : '') + '>';
        }
        function donVi(r) {
            if (r.donVi && r.donVi.keKhai) {
                return '<button type="button" class="ums-btn ums-btn--primary ums-btn--sm" data-kekhai="' + esc(r.donVi.keKhai) + '">' +
                    '<i class="fa-light fa-pen-to-square"></i><span>Kê khai</span></button>';
            }
            return esc(r.donVi || '');
        }
        var body =
            '<div class="ums-tablewrap"><table class="ums-table ums-table--lined dg-bang"><thead><tr>' +
                '<th class="is-center" style="width:48px">STT</th><th class="dg-nd">Nội dung</th><th class="is-center" style="width:80px">Giá trị</th>' +
                '<th class="is-center" style="width:110px">Đơn vị</th><th class="is-center" style="width:80px">Điểm</th>' +
                '<th class="is-center" style="width:100px">Điểm thi đua</th><th style="width:200px">Ý kiến phản hồi</th>' +
            '</tr></thead><tbody>' +
            (cfg.tieuChi ? '<tr><td class="is-center">1</td><td colspan="6"><b>Điểm chuyên môn</b>' +
                '<table class="ums-table ums-table--lined ums-table--tight dg-tieuchi"><thead><tr><th class="is-center" style="width:48px">Stt</th>' +
                '<th>Nội dung</th><th class="is-center" style="width:92px">Kế hoạch</th><th class="is-center" style="width:110px">Thực tế</th></tr></thead><tbody>' +
                cfg.tieuChi.map(function (t, i) {
                    return '<tr><td class="is-center">' + (i + 1) + '</td><td>' + esc(t.ten) + '</td><td class="is-center">' + esc(t.keHoach) +
                        '</td><td><input class="ums-input ums-input--sm" data-tc="' + i + '"></td></tr>';
                }).join('') + '</tbody></table></td></tr>' : '') +
            cfg.rows.map(function (r, i) {
                return '<tr><td class="is-center">' + (i + 1 + (cfg.tieuChi ? 1 : 0)) + '</td><td><b>' + esc(r.ten) + '</b></td>' +
                    '<td class="is-center dg-so" data-gio="' + i + '"></td><td class="is-center">' + donVi(r) + '</td>' +
                    '<td class="is-center dg-so" data-diem="' + i + '"></td>' +
                    '<td><input class="ums-input ums-input--sm" readonly tabindex="-1"></td><td>' + oYK(r, i) + '</td></tr>';
            }).join('') +
            '</tbody></table></div>' +
            '<div class="ums-legend ums-legend--cach">Thông tin sáng kiến</div>' +
            '<div class="ums-grid ums-grid--12">' +
                '<div style="grid-column:span 8">' + ui.field('Tên sáng kiến', '<input class="ums-input" data-sk="ten" placeholder="Nhập tên sáng kiến" autocomplete="off">') + '</div>' +
                '<div style="grid-column:span 4">' + ui.field('Ngày công nhận', '<div class="ums-inputwrap"><input class="ums-input" data-sk="ngay" data-date placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>') + '</div>' +
                '<div style="grid-column:span 8">' + ui.field('Số quyết định công nhận', '<input class="ums-input" data-sk="soqd" autocomplete="off">') + '</div>' +
                '<div style="grid-column:span 4">' + ui.field('Vai trò', '<select class="ums-select" data-sk="vaitro" data-ph="--- Chọn vai trò --"><option value=""></option></select>') + '</div>' +
                '<div style="grid-column:span 8">' + ui.field('Điểm', '<input class="ums-input" readonly>') + '</div>' +
            '</div>' +
            '<div class="dg-tong"><div class="dg-tong__so" data-z="tong">0</div><div class="dg-tong__nhan">Tổng điểm</div></div>';
        // Bản gốc: Đóng → khung "Thông báo" (zone_notify_PhieuDG); Đánh giá → hiện lại phiếu
        m.mainBody.innerHTML = '<div data-z="phieu">' + body + '</div>' +
            '<div data-z="nhac" hidden>' + ui.empty('Chọn "Đánh giá" ở danh sách bên trái để mở phiếu', 'fa-hand-pointer') + '</div>';
        ui.enhance(m.mainBody);
        function sk(k) { return m.mainBody.querySelector('[data-sk="' + k + '"]'); }
        ums.api.dm('CCB.VTSK').then(function (ds) { pat.fill(sk('vaitro'), ds, { name: 'TEN' }); if (ct.VAITROSANGKIEN_ID) setVal(sk('vaitro'), ct.VAITROSANGKIEN_ID); })
            .catch(function (err) { ums.api.handle(err, 'danh mục vai trò'); });
        function setVal(el, v) {
            el.value = e(v);
            if (el._flatpickr) el._flatpickr.setDate(el.value || null, false, 'd/m/Y');
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        }
        function giaTri(spec, d) { return typeof spec === 'function' ? spec(d) : (spec ? e(d[spec]) : ''); }

        function ve(d) {
            ct = d || {};
            cfg.rows.forEach(function (r, i) {
                m.mainBody.querySelector('[data-gio="' + i + '"]').textContent = giaTri(r.gio, ct);
                m.mainBody.querySelector('[data-diem="' + i + '"]').textContent = giaTri(r.diem, ct);
                var y = m.mainBody.querySelector('[data-yk="' + i + '"]');
                if (y) y.value = r.yk && r.yk.c ? e(ct[r.yk.c]) : '';
            });
            (cfg.tieuChi || []).forEach(function (t, i) { m.mainBody.querySelector('[data-tc="' + i + '"]').value = e(ct[t.c]); });
            setVal(sk('ten'), ct.TENSANGKIENCAITIEN);
            setVal(sk('ngay'), ct.NGAYTHANGNAMSANGKIEN);
            setVal(sk('soqd'), ct.SOQUYETDINHSANGKIEN);
            setVal(sk('vaitro'), ct.VAITROSANGKIEN_ID);
            z('tong').textContent = e(ct.TONGDIEM) || '0';
        }
        function z(k) { return m.mainBody.querySelector('[data-z="' + k + '"]'); }
        function moPhieu(on) {
            z('phieu').hidden = !on; z('nhac').hidden = on;
            Array.prototype.forEach.call(m.main.querySelectorAll('[data-a="luu"], [data-a="dong"]'), function (b) { b.hidden = !on; });
        }

        function taiChiTiet() {
            return ums.api.call({ action: cfg.ctrl + '/LayChiTiet', method: 'GET', strNhanSu_HoSoCanBo_Id: uid(), strNhanSu_TDKT_KeHoach_Id: '' })
                .then(function (r) { var d = arr(r.data); if (d.length) ve(d[0]); })
                .catch(function (err) { ums.api.handle(err, 'tải phiếu đánh giá'); });
        }
        function luu() {
            var x = { action: cfg.ctrl + '/CapNhat', method: 'POST', strNhanSu_HoSoCanBo_Id: uid(), strNhanSu_TDKT_KeHoach_Id: keHoach };
            (cfg.tieuChi || []).forEach(function (t, i) { x[t.p] = m.mainBody.querySelector('[data-tc="' + i + '"]').value.trim(); });
            cfg.order.forEach(function (p) {
                if (Object.prototype.hasOwnProperty.call(cfg.extraSave || {}, p)) { x[p] = cfg.extraSave[p]; return; }
                var i = cfg.rows.findIndex(function (r) { return r.yk && r.yk.p === p; });
                x[p] = i >= 0 ? m.mainBody.querySelector('[data-yk="' + i + '"]').value.trim() : '';
            });
            x.strTenSangKienCaiTien = sk('ten').value.trim();
            x.strNgayThangNamSangKien = sk('ngay').value.trim();
            x.strSoQuyetDinhSangKien = sk('soqd').value.trim();
            x.strVaiTroSangKien_Id = sk('vaitro').value;
            ums.api.call(x).then(function () { ui.toast('Cập nhật thành công!', 'ok'); taiChiTiet(); })
                .catch(function (err) { ums.api.handle(err, 'lưu phiếu đánh giá'); });
        }

        /* ---------- Cột trái: kế hoạch đánh giá -------------------------- */
        function veDs() {
            var k = (m.search.value || '').trim().toLowerCase();
            var ds = dsKH.filter(function (r) { return !k || e(r.TENKEHOACH).toLowerCase().indexOf(k) >= 0; });
            m.sideCount.textContent = '(' + ds.length + ')';
            m.sideBody.innerHTML = ds.length ? ds.map(function (r) {
                return pat.masterItem({ id: r.ID, text: e(r.TENKEHOACH), active: r.ID === keHoach,
                    act: '<button type="button" class="ums-btn ums-btn--out-warn ums-btn--sm" data-danhgia="' + esc(r.ID) + '">Đánh giá</button>' });
            }).join('') : ui.empty('Không có phiếu đánh giá', 'fa-clipboard-list');
        }
        ums.api.call({ action: 'NS_PLDG_NLD_KeHoach/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 })
            .then(function (r) { dsKH = arr(r.data); if (dsKH.length === 1) keHoach = dsKH[0].ID; veDs(); })
            .catch(function (err) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải kế hoạch đánh giá'); });
        m.search.addEventListener('input', veDs);

        cfg.root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-danhgia], [data-kekhai], [data-a]');
            if (!b) return;
            if (b.hasAttribute('data-danhgia')) {
                keHoach = b.getAttribute('data-danhgia'); veDs();
                moPhieu(true); taiChiTiet();
            } else if (b.hasAttribute('data-kekhai')) {
                ums.app && ums.app.openPath ? ums.app.openPath(b.getAttribute('data-kekhai')) : null;
            } else if (b.getAttribute('data-a') === 'luu') luu();
            else if (b.getAttribute('data-a') === 'dong') moPhieu(false);
        });
        taiChiTiet();
    } };
})();
