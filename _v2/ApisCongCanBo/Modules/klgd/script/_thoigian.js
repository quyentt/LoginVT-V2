/* =========================================================================
   klgd — Thiết lập thời gian nhập (thietlapthoigian / qlklgd_thietlapthoigian): ums.klgd.thoiGian(root, ql)
   Một cột: thanh lọc + bảng nhập trực tiếp (Thời gian bắt đầu / kết thúc / Là tài khoản quản trị), lưu từng dòng.
   ---------------------------------------------------------------------------
   Bản cũ (TKGG_KLGD): Năm học (GetcboSchoolYear NIENHOC) · Học kỳ tĩnh 1/2 · Đợt (GetDotHoc strHocKy = <năm>_<kỳ>,
     cột DOT). Danh sách GetDSPQTheoThoiGian { strHocKy: <năm>_<kỳ>, strDotHoc, strNguoiDung_Id }.
     Lưu UpdatePhanQuyenTheoThoiGian (GET) { strNamHoc, strHocKy: <năm>_<kỳ>, strDotHoc, strUserId, strThoiGianBatDau,
     strThoiGianKetThuc, strLaUserQuanTri '1'/'0', strNguoiDung_Id }.
   Bản quản lý (TKGG_QLKLGD): Năm → Học kỳ → Đợt (GetThongTinNamKyDot NAMHOC / HOCKY / DOTHOC, đợt value ID text DOTHOC)
     · Hệ đào tạo CHỌN NHIỀU (ListDS_HeDaoTao, ID/NAME). Danh sách { strHocKy, strDotHoc: id đợt, strHeDaoTao_Ids, strNguoiThucHienId }.
     Lưu (POST) { strNamHoc, strHocKy, strDotHoc: CHỮ của đợt, strUserId, strThoiGianBatDau, strThoiGianKetThuc,
     strLaUserQuanTri, strDaoTao_ThoiGianDaoTao_Id: id đợt, strHeDaoTao_Ids, strNguoiThucHienId }.
   Khác bản gốc (ghi ở can-quyet.js):
     · Bản cũ: ô Hệ đào tạo + Khoá của gốc không gửi vào lời gọi nào (ô "chết") → không vẽ.
     · Năm → (Kỳ) → Đợt khoá theo luật cha → con; đổi năm/kỳ xoá đợt + bảng (gốc giữ đợt cũ, có thể lưu nhầm).
     · Lưu báo đúng dòng lỗi (gốc luôn "Cập nhật thành công").
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;

    K.thoiGian = function (root, ql) {
        var ctl = K.ctl(ql);
        root.innerHTML = pat.page('Thiết lập thời gian nhập') +
            pat.filterBar([
                { key: 'nam', type: 'select', label: 'Chọn năm học' },
                { key: 'hk', type: 'select', label: 'Chọn học kỳ' },
                { key: 'dot', type: 'select', label: 'Chọn đợt' }
            ].concat(ql ? [{ key: 'he', type: 'select', label: 'Chọn hệ đào tạo', multiple: true }] : []).concat([
                { key: 'tu', type: 'date', label: 'Từ ngày' }, { key: 'den', type: 'date', label: 'Đến ngày' }
            ]), { search: false, extra:
                '<div class="ums-field ums-field--fit">' + ui.btn('fill', { text: 'Điền thời gian', mod: 'out-primary', icon: 'fa-angles-down', attr: { 'data-a': 'dien' } }) + '</div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Lưu', attr: { 'data-a': 'luu' } }) + '</div>' }) +
            pat.panel({ title: 'Danh sách', icon: 'fa-user-clock', flush: true, count: 'dem', zone: 'bang' });
        ui.enhance(root);
        function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return F(k) ? F(k).value : ''; }
        function heIds() { return (window.jQuery ? jQuery(F('he')).val() || [] : []).filter(function (x) { return x && x !== 'SELECTALL'; }).join(','); }
        function hocKy() { return ql ? v('hk') : v('nam') + '_' + v('hk'); }

        var B = K.nhapBang({ el: root.querySelector('[data-z="bang"]'), empty: 'Không có tài khoản', cot: [
            { title: 'Mã tài khoản', prop: 'MATAIKHOAN', cls: 'is-nowrap' },
            { title: 'Tên tài khoản', prop: 'TENTAIKHOAN' },
            { title: 'Thời gian bắt đầu', width: '200px', render: function (r, i) { return K.o('bd', i, r.THOIGIANBATDAU); } },
            { title: 'Thời gian kết thúc', width: '200px', render: function (r, i) { return K.o('kt', i, r.THOIGIANKETTHUC); } },
            { title: 'Là tài khoản quản trị', cls: 'is-center', width: '120px', render: function (r, i) {
                return '<input type="checkbox" data-o="qt" data-i="' + i + '"' + (e(r.LAUSERQUANTRI) === '1' ? ' checked' : '') + '>';
            } }] });
        function nhac(t) { B.ve([], ui.empty(t || 'Chọn năm học, học kỳ và đợt để xem danh sách', 'fa-filter')); root.querySelector('[data-z="dem"]').textContent = ''; }

        /* ---------- Nguồn ---------- */
        function napNam() {
            ums.crud.loadSource(K.nam(ql)).then(function (d) { pat.fill(F('nam'), d, { id: ql ? 'NAMHOC' : 'NIENHOC', name: ql ? 'NAMHOC' : 'NIENHOC', head: 'Chọn năm học' }); })
                .catch(function (err) { ums.api.handle(err, 'năm học'); });
        }
        function napKy() {
            if (!ql) { pat.fill(F('hk'), [{ ID: '1', TEN: '1' }, { ID: '2', TEN: '2' }], { head: 'Chọn học kỳ' }); return; }
            if (!v('nam')) return;
            K.namKyDot('HOCKY', v('nam')).then(function (d) { pat.fill(F('hk'), d, { id: 'HOCKY', name: 'HOCKY', head: 'Chọn học kỳ' }); });
        }
        function napDot() {
            if (!v('nam') || !v('hk')) return;
            var p = ql ? K.namKyDot('DOTHOC', v('hk'))
                : K.g('TKGG_KLGD/GetDotHoc', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strHocKy: hocKy(), silent: true }).then(function (r) { return K.arr(r.data); });
            p.then(function (d) { pat.fill(F('dot'), d, ql ? { id: 'ID', name: 'DOTHOC', head: 'Chọn đợt' } : { id: 'DOT', name: 'DOT', head: 'Chọn đợt' }); })
                .catch(function (err) { ums.api.handle(err, 'đợt'); });
        }
        if (ql) K.g('TKGG_QLKLGD/ListDS_HeDaoTao', { strChucNang_Id: K.chucNang(), strNguoiThucHienId: K.uid(), silent: true })
            .then(function (r) { pat.fill(F('he'), K.arr(r.data), { id: 'ID', name: 'NAME' }); }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });

        /* ---------- Danh sách ---------- */
        function tai() {
            if (!v('dot')) { nhac(); return; }
            B.dangTai();
            var p = { method: 'GET', strHocKy: hocKy(), strDotHoc: v('dot') };
            if (ql) { p.strHeDaoTao_Ids = heIds(); p.strNguoiThucHienId = K.uid(); } else p.strNguoiDung_Id = K.uid();
            K.g(ctl + 'GetDSPQTheoThoiGian', p).then(function (r) {
                var d = K.arr(r.data);
                B.ve(d);
                root.querySelector('[data-z="dem"]').textContent = '(' + d.length + ')';
            }).catch(function (err) { B.ve([], ui.fail(err.message)); ums.api.handle(err, 'danh sách'); });
        }

        function luu() {
            if (!v('dot')) { ui.toast('Bạn chưa chọn đợt', 'warn'); return; }
            if (!v('hk')) { ui.toast('Bạn chưa chọn học kỳ', 'warn'); return; }
            if (ql && !heIds()) { ui.toast('Bạn chưa chọn hệ đào tạo', 'warn'); return; }
            var rows = B.rows();
            if (!rows.length) { ui.toast('Không có dòng nào để cập nhật', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn cập nhật ?', { ok: 'Cập nhật' }).then(function (yes) {
                if (!yes) return;
                var dotTen = F('dot').options[F('dot').selectedIndex] ? F('dot').options[F('dot').selectedIndex].text : '';
                B.luu(rows.map(function (r, i) {
                    var p = { action: ctl + 'UpdatePhanQuyenTheoThoiGian', method: ql ? 'POST' : 'GET', strNamHoc: v('nam'), strHocKy: hocKy(),
                        strDotHoc: ql ? dotTen : v('dot'), strUserId: e(r.USERID), strThoiGianBatDau: B.gt(i, 'bd'), strThoiGianKetThuc: B.gt(i, 'kt'),
                        strLaUserQuanTri: B.gt(i, 'qt') };
                    if (ql) { p.strDaoTao_ThoiGianDaoTao_Id = v('dot'); p.strHeDaoTao_Ids = heIds(); p.strNguoiThucHienId = K.uid(); }
                    else p.strNguoiDung_Id = K.uid();
                    return p;
                }));
            });
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            if (b.getAttribute('data-a') === 'dien') { B.dat('bd', v('tu')); B.dat('kt', v('den')); }
            else if (b.getAttribute('data-a') === 'luu') luu();
        });
        if (window.jQuery) {
            jQuery(F('nam')).on('select2:select select2:clear', function () { if (ql) napKy(); else napDot(); nhac(); });
            jQuery(F('hk')).on('select2:select select2:clear', function () {
                if (!ql) { F('dot').value = ''; jQuery(F('dot')).trigger('change.select2'); }   // bản cũ: kỳ không nằm trong chuỗi khoá
                napDot(); nhac();
            });
            jQuery(F('dot')).on('select2:select select2:clear', tai);
            if (ql) jQuery(F('he')).on('select2:select select2:unselect select2:clear', function () { if (v('dot')) tai(); });
        }
        // Bản cũ: Học kỳ là ô tĩnh chọn sẵn "1" → không đưa vào chuỗi (chuỗi xoá trắng tầng dưới khi đổi năm)
        pat.chain(ql ? [F('nam'), F('hk'), F('dot')] : [F('nam'), F('dot')], { phatLai: false });
        napNam(); napKy();
        if (!ql) F('hk').value = '1';
        if (window.jQuery) jQuery(F('hk')).trigger('change.select2');
        nhac();
    };
})();
