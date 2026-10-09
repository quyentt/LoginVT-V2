/* =========================================================================
   Nhập điểm chấm kiểm tra / nhập điểm phúc khảo — khung chung
   ums.nd.kiemTra(root, cfg). Bản gốc: nhapdiemchamkiemtra.js / nhapdiemphuckhao.js
   (bản phúc khảo chứa gần trọn bản chấm kiểm tra; khác nhau ở action, loại xác nhận và
   việc chia danh sách thành 3 bảng theo cột PHANLOAI).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên; GET trừ khi ghi):
       TP_PhucKhao/LayThoiGianTheoDotThi (tự chọn mục đầu) → học phần: cfg.hocPhan (TP_PhucKhao/LayHocPhanPhucKhao ở bản
         chấm kiểm tra; XLHV_TP_PhucKhao_MH · PKG_THI_PHACH_PHUCKHAO.LayHocPhanPhucKhaoDuyet ở bản phúc khảo)
       cfg.dsAction (strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id) → mỗi dòng: cfg.diemAction (strThi_DanhSachThi_TuiBai_Id,
         strQLSV_NguoiHoc_Id, strDaoTao_HocPhan_Id → DIEM) + nhãn tình trạng ums.nd.trangThai (tối đa 10 lời gọi cùng lúc)
       Lưu: POST cfg.luuAction mỗi dòng đã sửa — strUngDung_Id (vai trò), strDiem, strThi_DanhSachThi_TuiBai_Id,
         strQLSV_NguoiHoc_Id, strDaoTao_HocPhan_Id, strGhiChu ''
       Xác nhận: ums.nd.xacNhan(cfg.loai) cho các dòng đánh dấu CỦA BẢNG vừa bấm
   Không chép (lỗi rõ của bản gốc):
     · Nút "Xác nhận" trong hộp là nút submit của một <form> → tải lại trang.
     · Mở màn nạp danh sách và học phần HAI lần (chạy song song, bản không lọc có thể về sau đè bản có lọc);
       đổi thời gian thì nạp danh sách với học phần CŨ.
     · Vẽ bảng rồi mới đổ điểm từng dòng → gõ trước khi điểm về bị ghi đè. Ở đây nạp đủ rồi mới vẽ.
     · Xác nhận xong không cập nhật nhãn "Tình trạng xác nhận" → nạp lại.
     · Bản phúc khảo: "Đồng ý" lưu cho dòng đánh dấu của CẢ BA bảng dù hộp mở từ một bảng → chỉ bảng đó.
     · Bản phúc khảo: ba bảng cùng tiêu đề "Danh sách" → ghi rõ bảng nào.
   Chờ nghiệp vụ:
     · Bản chấm kiểm tra dùng hàm lọc của PHÚC KHẢO (TP_PhucKhao/LayThoiGianTheoDotThi, LayHocPhanPhucKhao) — giữ.
     · Bản phúc khảo hiện điểm dạng "7,5" (1 chữ số thập phân, dấu phẩy) và gửi đúng chữ người dùng gõ — giữ.
     · Nhãn tình trạng lấy data[0].TEN của lịch sử (giả định mới nhất đứng đầu) — giữ.
     · Bản chấm kiểm tra: cột phải (col-lg-5) của bản gốc để TRỐNG → bỏ, bảng chiếm cả chiều ngang.
   (+ 2026-09-25) Cờ cho bản Quản lý điểm (ApisQuanLyDiem/nhapdiem — mặc định giữ hành vi cổng cán bộ):
     cfg.tgTen      cột tên của ô Thời gian (mặc định 'THOIGIAN'; QLD chấm kiểm tra đọc 'DAOTAO_THOIGIANDAOTAO')
     cfg.chonDau    false = KHÔNG tự chọn thời gian đầu (QLD không có selectFirst)
     cfg.hpTen      hàm tên ô Học phần (QLD: TEN - MA)
     cfg.xnNut      true = hộp xác nhận KIỂU NÚT (ums.nd.xacNhanNut) như QLD
     cfg.baoCaoText chữ nút báo cáo (mặc định 'Báo cáo'; vỏ indexi là 'Xuất báo cáo')
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var nd = ums.nd = ums.nd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function dinhDang(v) {   // formatDiem của bản phúc khảo
        if (v === null || v === undefined || v === '') return '';
        var n = parseFloat(String(v).replace(',', '.'));
        return isNaN(n) ? '' : n.toFixed(1).replace('.', ',');
    }

    nd.kiemTra = function (root, cfg) {
        var HP = [{ title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } }];
        var SV = [{ title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' }];
        var fmt = cfg.dinhDang ? dinhDang : e;
        var BANG = cfg.chia ? [
            { k: 'chung', ten: 'Danh sách (chung)', loc: function (x) { return !x.PHANLOAI; }, cot: SV.concat(HP, [{ title: 'Lớp tín chỉ', prop: 'DAOTAO_LOPHOCPHAN_TEN' },
                { title: 'Điểm trước phúc tra', cls: 'is-center', render: function (x) { return esc(fmt(x.DIEM)); } }]), o: 'Kết quả phúc khảo' },
            { k: 'dst', ten: 'Danh sách theo danh sách thi', loc: function (x) { return x.PHANLOAI === 'DST'; }, cot: SV.concat(HP, [{ title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' },
                { title: 'Ca thi', prop: 'CATHI_TEN', cls: 'is-center' }, { title: 'Phòng thi', prop: 'PHONGTHI_TEN', cls: 'is-center' }, { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' },
                { title: 'Điểm thi công bố', cls: 'is-center', render: function (x) { return esc(fmt(x.DIEM)); } }]), o: 'Điểm thi chấm phúc khảo' },
            { k: 'tui', ten: 'Danh sách theo túi', loc: function (x) { return x.PHANLOAI === 'TUI'; }, cot: HP.concat([{ title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' },
                { title: 'Túi', prop: 'TUI', cls: 'is-center' }, { title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' },
                { title: 'Điểm thi công bố', cls: 'is-center', render: function (x) { return esc(fmt(x.DIEM)); } }]), o: 'Điểm thi chấm phúc khảo' }
        ] : [{ k: 'chung', ten: 'Danh sách', loc: function () { return true; }, cot: SV.concat(HP), o: 'Kết quả' }];

        root.innerHTML = pat.page(cfg.tieuDe, (cfg.baoCao ? '<span data-z="bc"></span>' : '') + ui.btn('save', { attr: { 'data-a': 'luu' } })) +
            pat.filterBar([{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'hp', type: 'select', label: 'Chọn học phần' }]) +
            BANG.map(function (b) {
                return '<div class="ums-u-mb-4" data-khoi="' + b.k + '">' + pat.panel({ title: b.ten, icon: 'fa-list-timeline', count: 'n_' + b.k, flush: true, zone: 'b_' + b.k,
                    tools: ui.btn('save', { text: 'Xác nhận', icon: 'fa-circle-check', mod: 'out-success', attr: { 'data-xn': b.k } }) }) + '</div>';
            }).join('');
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? f(k).value.trim() : ''; }
        var chain = pat.chain([f('tg'), f('hp')], { phatLai: false });
        var DS = [], DIEM = {}, TT = {}, soHieu = 0;
        BANG.forEach(function (b) { nd.phim(z('b_' + b.k)); });

        function napHP() {
            if (!v('tg')) { pat.fill(f('hp'), []); chain.sync(); return Promise.resolve(); }
            return ums.api.call(Object.assign({ strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNguoiThucHien_Id: uid() }, cfg.hocPhan))
                .then(function (r) { pat.fill(f('hp'), arr(r.data), { head: 'Chọn học phần', name: cfg.hpTen || 'TEN' }); chain.sync(); }).catch(function (err) { ums.api.handle(err, 'học phần'); });
        }
        function tai() {
            var sh = ++soHieu;
            BANG.forEach(function (b) { z('b_' + b.k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); });
            return ums.api.call({ action: cfg.dsAction, method: 'GET', strNguoiThucHien_Id: uid(), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp') }).then(function (r) {
                if (sh !== soHieu) return;
                DS = arr(r.data); DIEM = {}; TT = {};
                return nd.pool(DS, function (x) {
                    return Promise.all([
                        ums.api.call({ action: cfg.diemAction, method: 'GET', silent: true, strThi_DanhSachThi_TuiBai_Id: x.ID, strQLSV_NguoiHoc_Id: x.QLSV_NGUOIHOC_ID,
                            strDaoTao_HocPhan_Id: x.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid() }).then(function (r2) { var d = arr(r2.data); if (d.length) DIEM[x.ID] = d[d.length - 1].DIEM; }),
                        nd.trangThai(x.ID, cfg.loai).then(function (t) { TT[x.ID] = t; })
                    ]);
                }, 10).then(function () { if (sh === soHieu) ve(); });
            }).catch(function (err) { BANG.forEach(function (b) { z('b_' + b.k).innerHTML = ui.fail(err.message); }); ums.api.handle(err, 'danh sách'); });
        }
        function ve() {
            BANG.forEach(function (b) {
                var rows = DS.filter(b.loc);
                b.rows = rows;
                if (cfg.chia) root.querySelector('[data-khoi="' + b.k + '"]').hidden = !rows.length;
                z('n_' + b.k).textContent = '(' + rows.length + ')';
                ui.table({ el: z('b_' + b.k), rows: rows, empty: 'Không có dữ liệu', columns: b.cot.concat([
                    { title: b.o, cls: 'is-center', render: function (x, i) {
                        var g = esc(fmt(DIEM.hasOwnProperty(x.ID) ? DIEM[x.ID] : x.DIEMBANDAU));
                        return '<input class="ums-input ums-input--sm nd-o" id="txtDiem' + esc(x.ID) + '" data-r="' + i + '" data-c="0" data-goc="' + g + '" value="' + g + '" autocomplete="off">';
                    } },
                    { title: 'Tình trạng xác nhận', render: function (x) { return esc(TT[x.ID] || ''); } },
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }]) });
                var t = z('b_' + b.k).querySelector('table'); if (t) t.classList.add('nd-luoi');
            });
            if (cfg.chia && !DS.length) BANG.forEach(function (b, i) { root.querySelector('[data-khoi="' + b.k + '"]').hidden = i > 0; });
        }
        function dong(id) { return DS.filter(function (x) { return String(x.ID) === id; })[0]; }
        function luu() {
            var doi = []; BANG.forEach(function (b) { doi = doi.concat(nd.oDoi(z('b_' + b.k))); });
            if (!doi.length) { ui.toast('Không có thay đổi cần lưu', 'info'); return; }
            ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { title: 'Lưu điểm' }).then(function (yes) {
                if (!yes) return;
                ui.batch(doi.map(function (i) {
                    var x = dong(i.id.substring(7));
                    return { action: cfg.luuAction, method: 'POST', strChucNang_Id: cn(), strUngDung_Id: vt(), strDiem: i.value.trim(), strThi_DanhSachThi_TuiBai_Id: x.ID,
                        strQLSV_NguoiHoc_Id: x.QLSV_NGUOIHOC_ID, strDaoTao_HocPhan_Id: x.DAOTAO_HOCPHAN_ID, strGhiChu: '', strNguoiThucHien_Id: uid() };
                }), { title: 'Đang lưu', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(tai);
            });
        }
        function xacNhan(k) {
            var b = BANG.filter(function (x) { return x.k === k; })[0];
            var chon = Array.prototype.filter.call(z('b_' + k).querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                .map(function (c) { return b.rows[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
            if (cfg.xnNut) nd.xacNhanNut({ loai: cfg.loai, tieuDe: 'Xác nhận', lichSu: chon[0].ID, ids: chon.map(function (x) { return x.ID; }), onDone: tai });
            else nd.xacNhan({ loai: cfg.loai, tieuDe: 'Xác nhận', chuDe: b.ten, id: chon[0].ID, ids: chon.map(function (x) { return x.ID; }), onDone: tai });
        }
        if (cfg.baoCao) ums.report.mount(z('bc'), { reportText: cfg.baoCaoText || 'Báo cáo', collect: function (add) { add('strDaoTao_ThoiGianDaoTao_Id', v('tg')); add('strDaoTao_HocPhan_Id', v('hp')); } });

        ums.api.call({ action: 'TP_PhucKhao/LayThoiGianTheoDotThi', method: 'GET', strNguoiThucHien_Id: uid() }).then(function (r) {
            var d = arr(r.data);
            pat.fill(f('tg'), d, { name: cfg.tgTen || 'THOIGIAN', head: 'Chọn thời gian' });
            if (d.length && cfg.chonDau !== false) { f('tg').value = d[0].ID; if (window.jQuery) jQuery(f('tg')).trigger('change.select2'); }
            chain.sync();
            return napHP();
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); }).then(tai);
        if (window.jQuery) {
            jQuery(f('tg')).on('select2:select select2:clear', function () { napHP().then(tai); });
            jQuery(f('hp')).on('select2:select select2:clear', tai);
        }
        root.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(ev.target.closest('table').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xn]'); if (b) { xacNhan(b.getAttribute('data-xn')); return; }
            if (!(b = ev.target.closest('[data-a]'))) return;
            if (b.getAttribute('data-a') === 'search') tai(); else if (b.getAttribute('data-a') === 'luu') luu();
        });
    };
})();
