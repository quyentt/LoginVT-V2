/* =========================================================================
   Kết quả khảo sát — khung chung của ketquakhaosat (cá nhân) và
   ketquakhaosatadmin (quản trị xem của một cán bộ) — ums.tk.ketQuaKhaoSat(root, { admin })
   Bản gốc: script/ketquakhaosat.js (MỘT tệp cho hai html; bản admin chỉ thêm ô Cán bộ).
   ---------------------------------------------------------------------------
   Bố cục bản gốc: hàng lọc (Cán bộ*) · Kế hoạch · Phiếu · Tìm kiếm · báo cáo →
   khối thông tin hai cột (trái: học phần / giáo viên / …; phải: "Mức độ đánh giá")
   → bảng "Danh sách" → "Kết quả khảo sát câu hỏi mở".
   Lời gọi (kiểu cũ, GET; strNguoiThucHien_Id = người đang xem — bản admin: CÁN BỘ ĐÃ CHỌN):
       NS_ThongTinCanBo/LayDSKeHoachKhaoSatCaNhan · LayDSPhieuKhaoSatCaNhan
       NS_ThongTinCanBo/LayDSKetQuaKhaoSatCaNhan → rsThongTinChung, rsDanhMucDapAn,
           rsCauHoi_1DapAn, rsCauHoi_Mo, rsCauHoi_Mo_KetQua
       NS_ThongTinCanBo/LayDSSoPhieuTheoCauHoi · LayDSPhanTramTheoCauHoi — MỖI Ô (câu × đáp án) một lời gọi, như gốc
       Admin: ums.ref.nhanSu (dLaCanBoNgoaiTruong −1) — ô Cán bộ
   "Điểm đánh giá" = Σ(số phiếu × trọng số) / Σ số phiếu, 2 chữ số (như gốc).
   Mẫu báo cáo: strHeDaoTao_Id / strNganh_Id / strNam_Id — ô gốc không tồn tại → rỗng (như gốc).
   Không chép (lỗi rõ của bản gốc):
     · Tiêu đề bảng lệch (STT / Nội dung / Điểm đánh giá thiếu rowspan).
     · Chú giải "Mức độ đánh giá" lặp mục giữa khi số mức chẵn; màu chú giải lệch màu tiêu đề.
     · Điểm ra NaN khi ô rỗng / tổng phiếu 0 → để trống; hộp tiến độ treo khi không có câu hỏi.
     · Đổi kế hoạch / cán bộ không xoá kết quả cũ.
   Giữ như bản gốc (chờ nghiệp vụ): Khoá sinh viên / Hình thức / Số lượng khảo sát
   đọc cột "AAA"/"AAAA" (chưa có tên thật) → luôn trống; nhãn đường dẫn "Khối lượng cá nhân".
   Nối tầng: (Cán bộ →) Kế hoạch → Phiếu (ums.pat.chain); tự chọn khi chỉ có một.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var tk = ums.tk = ums.tk || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var N = 'NS_ThongTinCanBo/', MAU = ['#f0ad4e', '#dc3545', '#1b3276', '#0d6efd', '#198754'];

    tk.ketQuaKhaoSat = function (root, o) {
        o = o || {};
        var nguoi = uid();
        function get(m, x) { return ums.api.call(Object.assign({ action: N + m, method: 'GET' }, x, { strNguoiThucHien_Id: nguoi })); }
        root.innerHTML =
            pat.page('Kết quả khảo sát', '<div data-z="bc"></div>') +
            pat.filterBar((o.admin ? [{ key: 'cb', label: 'Chọn cán bộ', type: 'select' }] : [])
                .concat([{ key: 'kh', label: 'Chọn kế hoạch', type: 'select' }, { key: 'phieu', label: 'Chọn phiếu', type: 'select' }])) +
            '<div class="kqks-tt ums-u-mb-4">' +
                '<div class="ums-panel"><div class="ums-panel__body kqks-tt__trai">' +
                    '<div><div><span>Học phần:</span> <b data-z="hp"></b></div><div><span>Giáo viên giảng dạy:</span> <b data-z="gv"></b></div><div><span>Khoá sinh viên khảo sát:</span> <b data-z="kdt"></b></div></div>' +
                    '<div><div><span>Hình thức khảo sát:</span> <b data-z="ht"></b></div><div><span>Thời gian thực hiện:</span> <b data-z="th"></b></div></div>' +
                    '<div><div class="kqks-tt__nhom">Kết quả khảo sát</div><div><span>Số lượng khảo sát:</span> <b data-z="sl"></b></div></div>' +
                '</div></div>' +
                '<div class="ums-panel"><div class="ums-panel__body"><div class="kqks-tt__nhom">Mức độ đánh giá</div><div class="kqks-mau" data-z="mau"></div></div></div>' +
            '</div>' +
            pat.panel({ title: 'Danh sách', icon: 'fa-square-poll-vertical', flush: true, zone: 'bang' }) +
            '<div class="ums-u-mt-4">' + pat.panel({ title: 'Kết quả khảo sát câu hỏi mở', icon: 'fa-comments', zone: 'mo' }) + '</div>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function trong() {
            ['hp', 'gv', 'kdt', 'ht', 'th', 'sl'].forEach(function (k) { z(k).textContent = ''; });
            z('mau').innerHTML = ''; z('mo').innerHTML = '';
            z('bang').innerHTML = ui.empty('Chọn kế hoạch và phiếu khảo sát', 'fa-hand-pointer');
        }
        trong();
        var chuoi = pat.chain(o.admin ? [f('cb'), f('kh'), f('phieu')] : [f('kh'), f('phieu')], { phatLai: false });
        function chon1(el, d) { if (d.length === 1) { el.value = d[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); return true; } return false; }

        function napKH() {
            trong();
            return get('LayDSKeHoachKhaoSatCaNhan', {}).then(function (r) {
                var d = arr(r.data); pat.fill(f('kh'), d, { name: 'TEN', head: 'Chọn kế hoạch' }); chuoi.sync();
                if (chon1(f('kh'), d)) return napPhieu();
            }).catch(function (err) { ums.api.handle(err, 'kế hoạch khảo sát'); });
        }
        function napPhieu() {
            trong();
            if (!f('kh').value) { pat.fill(f('phieu'), []); chuoi.sync(); return Promise.resolve(); }
            return get('LayDSPhieuKhaoSatCaNhan', { strKS_KeHoachKhaoSat_Id: f('kh').value }).then(function (r) {
                var d = arr(r.data); pat.fill(f('phieu'), d, { name: 'TEN', head: 'Chọn phiếu' }); chuoi.sync();
                if (chon1(f('phieu'), d)) tai();
            }).catch(function (err) { ums.api.handle(err, 'phiếu khảo sát'); });
        }

        var soHieu = 0;
        function tai() {
            if (!f('kh').value || !f('phieu').value) { ui.toast('Chọn kế hoạch và phiếu khảo sát', 'warn'); return; }
            var sh = ++soHieu;
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            get('LayDSKetQuaKhaoSatCaNhan', { strKS_KeHoachKhaoSat_Id: f('kh').value, strKS_PhieuKhaoSat_Id: f('phieu').value }).then(function (r) {
                if (sh !== soHieu) return;
                var d = r.data || {}, tt = (Array.isArray(d.rsThongTinChung) && d.rsThongTinChung[0]) || {};
                z('hp').textContent = e(tt.KS_CSDL_HOCPHAN_TEN) + (tt.KS_CSDL_HOCPHAN_MA ? ' - ' + e(tt.KS_CSDL_HOCPHAN_MA) : '');
                z('gv').textContent = e(tt.KS_DOITUONGDUOCKHAOSAT_TEN);
                z('kdt').textContent = e(tt.AAA); z('ht').textContent = e(tt.AAAA); z('sl').textContent = e(tt.AAA);
                z('th').textContent = tt.TUNGAY || tt.DENNGAY ? e(tt.TUNGAY) + ' - ' + e(tt.DENNGAY) : '';
                var da = Array.isArray(d.rsDanhMucDapAn) ? d.rsDanhMucDapAn : [], ch = Array.isArray(d.rsCauHoi_1DapAn) ? d.rsCauHoi_1DapAn : [];
                z('mau').innerHTML = da.map(function (x, i) { return '<span><i style="background:' + MAU[i % 5] + '">' + esc(e(x.TRONGSODIEM)) + '</i>' + esc(e(x.TENDAPAN)) + '</span>'; }).join('');
                function badge(x, i) { return '<span class="kqks-bd" style="background:' + MAU[i % 5] + '">' + esc(e(x.TRONGSODIEM)) + '</span>'; }
                ui.table({ el: z('bang'), rows: ch, empty: 'Phiếu chưa có câu hỏi', columns: [{ title: 'Nội dung đánh giá', prop: 'TENCAUHOI' }]
                    .concat(da.map(function (x, i) { return { head: badge(x, i), group: ['Số phiếu'], cls: 'is-center', render: function (q) { return '<span data-sp="' + esc(q.ID + '|' + x.ID) + '"></span>'; } }; }))
                    .concat(da.map(function (x, i) { return { head: badge(x, i), group: ['Tỉ lệ mức độ hài lòng'], cls: 'is-center', render: function (q) { return '<span data-tl="' + esc(q.ID + '|' + x.ID) + '"></span>'; } }; }))
                    .concat([{ title: 'Điểm đánh giá', cls: 'is-center', render: function (q) { return '<b data-diem="' + esc(q.ID) + '"></b>'; } }]) });
                var mo = Array.isArray(d.rsCauHoi_Mo) ? d.rsCauHoi_Mo : [], kq = Array.isArray(d.rsCauHoi_Mo_KetQua) ? d.rsCauHoi_Mo_KetQua : [];
                z('mo').innerHTML = mo.length ? mo.map(function (c, i) {
                    return '<div class="kqks-mo"><b>Câu ' + (i + 1) + ': ' + esc(e(c.TENCAUHOI)) + '</b>' +
                        kq.filter(function (x) { return x.KS_CAUHOI_ID == c.ID; }).map(function (x) { return '<p>' + esc(e(x.DAPAN)) + '</p>'; }).join('') + '</div>';
                }).join('') : ui.empty('Không có câu hỏi mở', 'fa-comment-slash');
                if (!ch.length || !da.length) return;
                var soPhieu = {}, viec = [];
                ch.forEach(function (q) {
                    da.forEach(function (x) {
                        var ts = { silent: true, strKS_KeHoachKhaoSat_Id: e(q.KS_KEHOACHKHAOSAT_ID), strKS_PhieuKhaoSat_Id: e(q.KS_PHIEUKHAOSAT_ID), strKS_CauHoi_Id: q.ID, strMaDapAn: e(x.MADAPAN) };
                        viec.push(get('LayDSSoPhieuTheoCauHoi', ts).then(function (y) {
                            var v = (arr(y.data)[0] || {}).SOLUONG, el = z('bang').querySelector('[data-sp="' + q.ID + '|' + x.ID + '"]');
                            if (el) el.textContent = e(v);
                            (soPhieu[q.ID] = soPhieu[q.ID] || []).push([parseFloat(v) || 0, parseFloat(x.TRONGSODIEM) || 0]);
                        }).catch(function () {}));
                        viec.push(get('LayDSPhanTramTheoCauHoi', ts).then(function (y) {
                            var el = z('bang').querySelector('[data-tl="' + q.ID + '|' + x.ID + '"]'); if (el) el.textContent = e((arr(y.data)[0] || {}).PHANTRAM);
                        }).catch(function () {}));
                    });
                });
                Promise.all(viec).then(function () {
                    if (sh !== soHieu) return;
                    ch.forEach(function (q) {
                        var s = 0, t = 0; (soPhieu[q.ID] || []).forEach(function (p) { s += p[0] * p[1]; t += p[0]; });
                        var el = z('bang').querySelector('[data-diem="' + q.ID + '"]'); if (el) el.textContent = t ? (Math.round(s / t * 100) / 100).toString() : '';
                    });
                });
            }).catch(function (err) { if (sh === soHieu) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả khảo sát'); } });
        }

        if (window.jQuery) {
            jQuery(f('kh')).on('select2:select select2:clear', napPhieu);
            jQuery(f('phieu')).on('select2:select', tai);
            jQuery(f('phieu')).on('select2:clear', trong);
        }
        if (o.admin) {
            ums.ref.nhanSu({ dLaCanBoNgoaiTruong: -1, pageIndex: 1, pageSize: 1000000 })
                .then(function (d) { pat.fill(f('cb'), d || [], { name: ums.ref.tenNhanSu, head: 'Chọn cán bộ' }); chuoi.sync(); })
                .catch(function (err) { ums.api.handle(err, 'cán bộ'); });
            if (window.jQuery) jQuery(f('cb')).on('select2:select select2:clear', function () { nguoi = f('cb').value || uid(); napKH(); });
            /* Bản gốc: chưa chọn cán bộ thì vẫn nạp kế hoạch của người đăng nhập;
               theo luật cha → con, ở đây chọn cán bộ trước. */
        } else napKH();

        ums.report.mount(z('bc'), { collect: function (add) { add('strHeDaoTao_Id', ''); add('strNganh_Id', ''); add('strNam_Id', ''); } });
        root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) tai(); });
    };
})();
