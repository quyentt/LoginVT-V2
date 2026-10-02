/* =========================================================================
   Chuyên cần — phần dùng chung của các màn nhập / tổng hợp chuyên cần
   (nhapchuyencan, nhaptheolop, tonghop/tonghoptheongay — ba bản gốc chép
   nhau gần từng dòng: bảng SINH VIÊN × NGÀY, mỗi ô một ô đánh dấu + ô số).

   ums.cc.boLoc(host, { khoiTao, baoCao }) → { f(k), v(k), tt, thamSo() }
       Thanh lọc của nhapchuyencan / tonghoptheongay (html gốc giống hệt):
       Hệ → Khoá → Chương trình → Lớp (ums.ref.cascade — bản gốc gọi
       edu.system.getList_* KHÔNG lọc quyền), Năm nhập học (KHCT_ThongTin/
       LayDSNamNhapHoc GET), Khoa quản lý, Kiểu chuyên cần (QLSV.KIEUCHUYENCAN),
       Từ ngày, Đến ngày, từ khoá, nút Tìm kiếm; khối "Chọn trạng thái sinh
       viên" (QLSV.TRANGTHAI, đánh dấu sẵn hết như gốc).
       khoiTao: true → thêm hàng "Ngày khởi tạo" + nút "Khởi tạo ngày chuyên cần".
       thamSo() = bộ tham số lọc chung (tên chép nguyên bản gốc).

   ums.cc.luoi(host, cfg) → { ve(data, page), luu(), xoaTrang(msg) }
       Bảng SV × ngày. data = { rs: [sinh viên], rsNgay: [ngày ghi nhận] }.
       cfg = {
         lead: [cột ui.table đầu bảng],
         o(sv, ngay) → lời gọi lấy kết quả MỘT ô (bản gốc: một lời gọi cho mỗi
                       ô, N × M lời gọi — giữ nguyên, chạy hàng đợi 6 luồng),
         ghiId: true  → nhớ ID bản ghi của ô (nhaptheolop: dùng làm strId khi Sửa);
                        false → chỉ nhớ "đã có" (bản gốc đặt name = GIATRI),
         buoi: true   → ô Tổng hiện "số ô (số buổi)" như nhapchuyencan / nhaptheolop;
                        false → chỉ số ô (tonghoptheongay),
         them(sv, ngay, soLuong, idBanGhi) → lời gọi lưu MỘT ô,
         xoa(sv, ngay, idBanGhi) → lời gọi xoá MỘT ô,
         chuHoi: 'thêm' | 'lưu'  (chữ trong câu hỏi lại, đúng từng bản gốc),
         page: { size, onChange, onSize } (tuỳ chọn — tonghoptheongay phân trang máy chủ),
         sauLuu()  → nạp lại (bản gốc endSetData: báo xong rồi nạp lại sau 1 giây)
       }
       Luật lưu chép nguyên bản gốc (btnSaveChuyenCan):
         · ô đánh dấu, trước đó chưa có            → them
         · ô đánh dấu, đã có nhưng đổi số buổi     → them (kèm id nếu ghiId)
         · ô bỏ đánh dấu, trước đó đã có           → xoa
       Khác gốc (đổi cách dựng, không đổi dữ liệu gửi đi):
         · Ô Tổng / dòng Tổng tính lại mỗi khi đánh dấu (gốc chỉ tính một lần lúc nạp).
         · Đổi bộ lọc / nạp lại giữa chừng thì bỏ các lời gọi ô của lượt cũ.
         · Lưu qua ums.ui.batch (tiến độ + đếm lỗi) thay genHTML_Progress.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, ref = ums.ref;
    var cc = ums.cc = ums.cc || {};

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    cc.uid = uid;
    cc.e = e;
    cc.arr = arr;
    cc.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };

    /* =====================================================================
       Thanh lọc chung (nhapchuyencan, tonghoptheongay)
       ===================================================================== */
    cc.boLoc = function (host, o) {
        o = o || {};
        function sel(k, ph) {
            return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>';
        }
        function inp(k, ph, ngay) {
            return '<div class="ums-field"><input class="ums-input" data-f="' + k + '"' + (ngay ? ' data-date' : '') +
                ' placeholder="' + esc(ph) + '" autocomplete="off"></div>';
        }
        host.innerHTML = pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') +
                sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
                sel('nam', 'Tất cả năm nhập học') + sel('kql', 'Tất cả khoa quản lý') +
                sel('kieu', 'Chọn kiểu chuyên cần') +
            '</div>' +
            '<div class="ums-filter ums-u-mt-3">' +
                inp('tu', 'Từ ngày dd/mm/yyyy', true) + inp('den', 'Đến ngày dd/mm/yyyy', true) +
                inp('q', 'Nhập từ khóa tìm kiếm') +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                (o.baoCao ? '<div class="ums-field ums-field--fit" data-z="bc"></div>' : '') +
            '</div>' +
            (o.khoiTao ? '<div class="ums-filter ums-u-mt-3">' + inp('ngayKT', 'Ngày khởi tạo dd/mm/yyyy', true) +
                '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Khởi tạo ngày chuyên cần', icon: 'fa-calendar-plus', mod: 'out-warn', attr: { 'data-a': 'khoitao' } }) + '</div></div>' : '') +
            '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div><div data-z="tt"></div>'
        });
        ui.enhance(host);
        function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? pat.val(f(k)) : ''; }
        function loi(t) { return function (err) { ums.api.handle(err, t); }; }

        var cas = ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
            labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' } });
        ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO', head: 'Tất cả hệ đào tạo' }); }).catch(loi('hệ đào tạo'));
        ums.api.call({ action: 'KHCT_ThongTin/LayDSNamNhapHoc', method: 'GET', strNguoiThucHien_Id: '' })
            .then(function (r) { pat.fill(f('nam'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC', head: 'Tất cả năm nhập học' }); })
            .catch(loi('năm nhập học'));
        ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN', head: 'Tất cả khoa quản lý' }); }).catch(loi('khoa quản lý'));
        ums.api.dm('QLSV.KIEUCHUYENCAN').then(function (d) {
            pat.fill(f('kieu'), d, { head: pat.dmTitle(d) || 'Chọn kiểu chuyên cần' });
        }).catch(loi('kiểu chuyên cần'));
        var tt = pat.checks(host.querySelector('[data-z="tt"]'), ums.api.dm('QLSV.TRANGTHAI'), { cols: 4 });

        return {
            f: f, v: v, tt: tt, cascade: cas,
            z: function (k) { return host.querySelector('[data-z="' + k + '"]'); },
            thamSo: function () {
                return {
                    strTuKhoa: (f('q').value || '').trim(),
                    strKhoaQuanLy_Id: v('kql'),
                    strHeDaoTao_Id: v('he'),
                    strKhoaDaoTao_Id: v('khoa'),
                    strChuongTrinh_Id: v('ct'),
                    strLopQuanLy_Id: v('lop'),
                    strNamNhapHoc: v('nam'),
                    strTrangThaiNguoiHoc_Id: tt.val(),
                    strTuNgay: (f('tu').value || '').trim(),
                    strDenNgay: (f('den').value || '').trim(),
                    strKieuChuyenCan_Id: v('kieu')
                };
            }
        };
    };

    /* =====================================================================
       Lưới sinh viên × ngày
       ===================================================================== */
    cc.luoi = function (host, cfg) {
        var rs = [], ngay = [], cu = {}, luot = 0, tongDong = 0;

        function key(i, j) { return i + '|' + j; }
        function q(sel) { return host.querySelector(sel); }
        function qa(sel) { return Array.prototype.slice.call(host.querySelectorAll(sel)); }
        function so(v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; }

        function xoaTrang(msg, icon) {
            luot++;
            rs = []; ngay = []; cu = {};
            host.innerHTML = ui.empty(msg, icon || 'fa-hand-pointer');
        }

        function tinhTong() {
            var tongO = 0, tongBuoi = 0;
            rs.forEach(function (sv, i) {
                var n = 0, b = 0;
                ngay.forEach(function (d, j) {
                    var c = q('input[data-cc="' + key(i, j) + '"]');
                    if (c && c.checked) { n++; b += so(q('input[data-sl="' + key(i, j) + '"]').value); }
                });
                tongO += n; tongBuoi += b;
                var t = q('[data-tong="' + i + '"]');
                if (t) t.textContent = cfg.buoi ? n + ' (' + b + ')' : String(n);
            });
            ngay.forEach(function (d, j) {
                var n = 0, b = 0;
                rs.forEach(function (sv, i) {
                    var c = q('input[data-cc="' + key(i, j) + '"]');
                    if (c && c.checked) { n++; b += so(q('input[data-sl="' + key(i, j) + '"]').value); }
                });
                var t = q('[data-tn="' + j + '"]');
                if (t) t.textContent = cfg.buoi ? n + ' (' + b + ')' : String(n);
            });
            var tt = q('[data-tt]');
            if (tt) tt.textContent = cfg.buoi ? tongO + ' (' + tongBuoi + ')' : String(tongO);
        }

        function ve(data, page) {
            var sh = ++luot;
            data = data || {};
            rs = arr(data.rs); ngay = arr(data.rsNgay); cu = {};
            tongDong = page && page.total !== undefined ? page.total : rs.length;
            var cot = (cfg.lead || []).slice();
            ngay.forEach(function (d, j) {
                cot.push({
                    head: '<span class="cc-ngay">' + esc(d.NGAYGHINHAN) + '</span>' +
                        '<label class="cc-ngay__all" title="Chọn cả cột"><input type="checkbox" data-all="' + j + '"></label>',
                    cls: 'is-center is-nowrap',
                    render: function (r, i) {
                        return '<span class="cc-o"><input type="checkbox" data-cc="' + key(i, j) + '" title="' + esc(d.NGAYGHINHAN) + '">' +
                            '<input class="ums-input ums-input--sm cc-o__sl" data-sl="' + key(i, j) + '" inputmode="numeric" autocomplete="off"></span>';
                    },
                    sum: function () { return '<span data-tn="' + j + '"></span>'; }
                });
            });
            cot.push({ title: 'Tổng', cls: 'is-center is-nowrap', render: function (r, i) { return '<span data-tong="' + i + '"></span>'; },
                sum: function () { return '<b data-tt></b>'; } });
            ui.table({ el: host, rows: rs, columns: cot, empty: 'Không có dữ liệu',
                page: page ? { index: page.index, size: page.size, total: page.total, onChange: page.onChange, onSize: page.onSize } : undefined });
            tinhTong();

            /* Mỗi ô một lời gọi, như bản gốc — hàng đợi 6 luồng, lượt mới thì bỏ lượt cũ */
            var viec = [];
            rs.forEach(function (sv, i) {
                ngay.forEach(function (d, j) {
                    viec.push(function () {
                        return ums.api.call(Object.assign({ silent: true }, cfg.o(sv, d))).then(function (r) {
                            if (sh !== luot) return;
                            arr(r.data).forEach(function (x) {
                                if (Number(x.GIATRI) !== 1) return;
                                var c = q('input[data-cc="' + key(i, j) + '"]'), s = q('input[data-sl="' + key(i, j) + '"]');
                                if (c) c.checked = true;
                                if (s) s.value = e(x.SOLUONG);
                                cu[key(i, j)] = { id: cfg.ghiId ? e(x.ID) : '', sl: String(e(x.SOLUONG)) };
                            });
                        }).catch(function (err) { if (sh === luot) ums.api.handle(err, 'kết quả chuyên cần'); });
                    });
                });
            });
            var tong = viec.length, xong = 0, k = 0;
            var bao = host.querySelector('.cc-tiendo');
            if (!bao && tong) {
                host.insertAdjacentHTML('afterbegin', '<div class="cc-tiendo ums-u-fz13 ums-u-muted"></div>');
                bao = host.querySelector('.cc-tiendo');
            }
            function capNhat() { if (bao) bao.textContent = xong < tong ? 'Đang nạp kết quả ' + xong + '/' + tong + ' ô…' : ''; }
            capNhat();
            function chay() {
                if (sh !== luot || k >= viec.length) return Promise.resolve();
                var fn = viec[k++];
                return fn().then(function () { xong++; if (sh === luot) { capNhat(); tinhTong(); } }).then(chay);
            }
            for (var n = 0; n < 6; n++) chay();
        }

        /* Đánh dấu cả cột / sửa số → tính lại tổng */
        host.addEventListener('change', function (ev) {
            var t = ev.target, j = t.getAttribute('data-all');
            if (j !== null) qa('input[data-cc$="|' + j + '"]').forEach(function (c) { c.checked = t.checked; });
            tinhTong();
        });
        host.addEventListener('input', function (ev) { if (ev.target.hasAttribute('data-sl')) tinhTong(); });

        function luu() {
            var them = [], xoa = [];
            rs.forEach(function (sv, i) {
                ngay.forEach(function (d, j) {
                    var k = key(i, j), c = q('input[data-cc="' + k + '"]'), s = q('input[data-sl="' + k + '"]');
                    if (!c) return;
                    var truoc = cu[k];
                    if (c.checked) {
                        if (!truoc) them.push({ sv: sv, d: d, sl: s.value, id: '' });
                        else if (truoc.sl !== s.value) them.push({ sv: sv, d: d, sl: s.value, id: truoc.id });
                    } else if (truoc) {
                        xoa.push({ sv: sv, d: d, id: truoc.id });
                    }
                });
            });
            if (!them.length && !xoa.length) { ui.toast('Không có thay đổi lưu', 'info'); return Promise.resolve(); }
            return ui.confirm('Bạn có chắc chắn ' + (cfg.chuHoi || 'thêm') + ' ' + them.length + ' và hủy ' + xoa.length + '?', { title: 'Lưu chuyên cần', ok: 'Đồng ý' })
                .then(function (ok) {
                    if (!ok) return;
                    var calls = them.map(function (x) { return cfg.them(x.sv, x.d, x.sl, x.id); })
                        .concat(xoa.map(function (x) { return cfg.xoa(x.sv, x.d, x.id); }));
                    return ui.batch(calls, { title: 'Đang lưu chuyên cần', okText: 'Thực hiện thành công' }).then(function () {
                        if (cfg.sauLuu) cfg.sauLuu();
                    });
                });
        }

        return { ve: ve, luu: luu, xoaTrang: xoaTrang, rows: function () { return rs; }, tong: function () { return tongDong; } };
    };

    /* Cột đầu bảng của ba màn lưới — chép thứ tự bản gốc (genTable_*: HEDAOTAO_TEN … QLSV_NGUOIHOC_NGAYSINH).
       nhaptheolop gốc: thân có cột LOP mà tiêu đề thiếu "Lớp" → từ "Mã số" trở đi tiêu đề lệch một cột.
       Ở đây cả ba màn đều có cột Lớp. */
    cc.cotSV = function () {
        return [
            { title: 'Hệ đào tạo', prop: 'HEDAOTAO_TEN' },
            { title: 'Khóa học', prop: 'KHOADAOTAO_TEN' },
            { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Lớp', prop: 'LOP', cls: 'is-nowrap' },
            { title: 'Mã số', prop: 'MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', prop: 'HOTEN', cls: 'is-nowrap' },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' }
        ];
    };
})();
