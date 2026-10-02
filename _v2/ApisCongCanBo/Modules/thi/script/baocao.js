/* =========================================================================
   thi/baocao — Báo cáo thi: lọc đợt thi, đánh dấu rồi (a) chạy mẫu báo cáo, (b) "Xác nhận hoàn thành" từng đợt.
   Bản gốc: thi/script/baocao.js (vỏ index / Core; ~40% mã chép từ phancoithi, không chạy tới — bỏ).
   ---------------------------------------------------------------------------
   Lời gọi (mã hoá, POST, chép nguyên):
       Lọc ums.thi.loc — pkg_thi_phach_chung.LayThoiGian (CHỌN NHIỀU, không tự chọn) → LayLoaiDiem → LayHinhThucThi; Lần thi cố định -1/1/2
       Danh sách pkg_thi_phach_chung.LayDotThi (strHinhThucThi_Id, strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id, dLanThi "-1" khi trống)
       Xác nhận: PKG_THI_PHANCONG.LayDSPhanLoaiCoiThi_ChamThi → LayDSHanhDongCoiThi_ChamThi (strPhanLoai_Id) (tự chọn khi 1 mục);
         mỗi đợt đánh dấu PKG_THI_PHANCONG.Them_QLTHI_CoiThi_ChamThi (strSanPham_Id, strNguoiXacnhan_Id — n THƯỜNG, strPhanLoai_Id,
         strNoiDung, strTinhTrang_Id); lịch sử LayDSQLTHI_CoiThi_ChamThi (strsanpham_Id — viết thường như gốc, nối phẩy, pageSize 10)
       Báo cáo ums.report.mount — khoá đúng thứ tự gốc: strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strThi_DotThi_Id (null),
         strDaoTao_HocPhan_Id, strGVDuocBaoCao_Id, strGVThucHienBaoCao_Id (null — ô không có ở màn này), strThi_HinhThucThi_Id,
         strTKB_PhongThi_Id, strNgayThi (null), rồi MỖI đợt đánh dấu một strThi_DotThi_Id. Không nút Import (gốc không có vùng Import).
   Không chép (lỗi rõ của bản gốc):
     · Đổi ô lọc tải danh sách NGAY với giá trị con cũ → tải sau khi ô con nạp xong. Lời gọi LayHocPhan vẽ vào ô không tồn tại → bỏ.
     · Bỏ hết thời gian đã chọn thì lỗi JS, báo cáo im lặng không chạy.
     · Xác nhận xong không nạp lại lịch sử; không bắt chọn trạng thái (gửi null) → bắt chọn Trạng thái.
     · Liên kết trợ giúp href="" tải lại trang; tiêu đề ghi "Phân coi thi" → "Báo cáo thi".
   Chờ nghiệp vụ:
     · Ô từ khoá KHÔNG gửi vào danh sách (chỉ vào báo cáo) — giữ như gốc.
     · Mở màn tải mọi đợt thi khi chưa lọc (như gốc) — giữ.
     · Lịch sử chỉ 10 dòng đầu (pageSize mặc định) — giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, thi = ums.thi;
    var root = document.getElementById('thi-baocao');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var PC = 'XLHV_TP_PhanCong_MH/', PF = 'PKG_THI_PHANCONG.';
    function pc(ma, ten, o) { return ums.api.call(Object.assign({ action: PC + ma, func: PF + ten, strNguoiThucHien_Id: uid() }, o)); }

    root.innerHTML = pat.page('Báo cáo thi', '<span data-z="bc"></span>' + ui.btn('save', { text: 'Xác nhận', icon: 'fa-circle-check', attr: { 'data-a': 'xacnhan' } })) +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-f="tg" data-ph="Chọn thời gian" multiple></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="ld" data-ph="Chọn loại điểm"><option value=""></option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="ht" data-ph="Chọn hình thức thi"><option value=""></option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="lt" data-no-s2><option value="-1">Chọn lần thi</option><option value="1">1</option><option value="2">2</option></select></div>' +
            '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Danh sách', icon: 'fa-magnifying-glass', attr: { 'data-a': 'search' } }) + '</div></div>' }) +
        pat.panel({ title: 'Danh sách đợt thi', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var L = thi.loc({ f: f, tang: ['tg', 'ld', 'ht'], onDoi: function () { tai(); } });
    function v(k) { return L.v(k); }

    var ds = [];
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return thi.chung('LayDotThi', { strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), dLanThi: f('lt').value || '-1' })
            .then(function (r) {
                ds = arr(r.data);
                z('n').textContent = '(' + ds.length + ')';
                ui.table({ el: z('bang'), rows: ds, empty: 'Không có đợt thi', columns: [{ title: 'Đợt thi', prop: 'TEN' }, { title: 'Đợt', prop: 'DOTHOC', cls: 'is-center' },
                    { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' }, { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }] });
                var t = z('bang').querySelector('table'); if (t) t.id = 'tblBaoCao';
            }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đợt thi'); });
    }
    L.xong.then(tai);
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return ds[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    }
    function hoac(s) { return s === '' ? undefined : s; }   // edu.system.getValById: rỗng / không có ô → không có giá trị (null trong báo cáo)
    ums.report.mount(z('bc'), { reportText: 'Báo cáo', import: false, tables: function () { var t = document.getElementById('tblBaoCao'); return t ? [t] : []; }, collect: function (add) {
        add('strTuKhoa', hoac(f('q').value.trim())); add('strDaoTao_ThoiGianDaoTao_Id', v('tg')); add('strThi_DotThi_Id', undefined);
        add('strDaoTao_HocPhan_Id', undefined); add('strGVDuocBaoCao_Id', undefined); add('strGVThucHienBaoCao_Id', undefined);
        add('strThi_HinhThucThi_Id', hoac(v('ht'))); add('strTKB_PhongThi_Id', undefined); add('strNgayThi', undefined);
        daChon().forEach(function (x) { add('strThi_DotThi_Id', x.ID); });
    } });

    /* ---------- Xác nhận hoàn thành ------------------------------------ */
    function xacNhan() {
        var chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        var ids = chon.map(function (x) { return x.ID; });
        var dlg = ui.dialog({ title: 'Xác nhận hoàn thành', icon: 'fa-circle-check', size: 'lg',
            body: '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + ids.length + ' đợt thi đã chọn.</p><div class="ums-grid ums-grid--2">' +
                ui.field('Loại công nhận', '<select class="ums-select" data-x="pl" data-ph="Chọn phân loại"><option value=""></option></select>') +
                ui.field('Trạng thái', '<select class="ums-select" data-x="tt" data-ph="Chọn trạng thái"><option value=""></option></select>', { required: true }) + '</div>' +
                ui.field('Nội dung', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Lịch sử</div><div data-x="ls"></div>',
            buttons: [{ text: 'Xác nhận', kind: 'save', onClick: function () {
                if (!q('tt').value) { ui.toast('Chọn trạng thái', 'warn'); return false; }
                ui.batch(ids.map(function (id) {
                    var o = { action: PC + 'FSkkLB4QDRUJCB4CLigVKSgeAikgLBUpKAPP', func: PF + 'Them_QLTHI_CoiThi_ChamThi', strSanPham_Id: id, strNguoiXacnhan_Id: uid(),
                        strNoiDung: q('nd').value.trim(), strTinhTrang_Id: q('tt').value, strNguoiThucHien_Id: uid() };
                    if (q('pl').value) o.strPhanLoai_Id = q('pl').value;
                    return o;
                }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true }).then(lichSu);
                return false;
            } }] });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        var ch = pat.chain([q('pl'), q('tt')], { phatLai: false });
        function motMuc(el, d) { if (d.length === 1) { el.value = d[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); } }
        function napTT() {
            if (!q('pl').value) { pat.fill(q('tt'), []); ch.sync(); return; }
            pc('DSA4BRIJIC8pBS4vJgIuKBUpKB4CKSAsFSko', 'LayDSHanhDongCoiThi_ChamThi', { strPhanLoai_Id: q('pl').value })
                .then(function (r) { var d = arr(r.data); pat.fill(q('tt'), d, { head: 'Chọn trạng thái' }); motMuc(q('tt'), d); ch.sync(); }).catch(function (err) { ums.api.handle(err, 'trạng thái'); });
        }
        pc('DSA4BRIRKSAvDS4gKAIuKBUpKB4CKSAsFSko', 'LayDSPhanLoaiCoiThi_ChamThi', {})
            .then(function (r) { var d = arr(r.data); pat.fill(q('pl'), d, { head: 'Chọn phân loại' }); motMuc(q('pl'), d); ch.sync(); if (d.length === 1) napTT(); }).catch(function (err) { ums.api.handle(err, 'phân loại'); });
        if (window.jQuery) jQuery(q('pl')).on('select2:select select2:clear', napTT);
        function lichSu() {
            q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            pc('DSA4BRIQDRUJCB4CLigVKSgeAikgLBUpKAPP', 'LayDSQLTHI_CoiThi_ChamThi', { strsanpham_Id: ids.join(','), pageIndex: 1, pageSize: 10 }).then(function (r) {
                ui.table({ el: q('ls'), rows: arr(r.data), empty: 'Chưa có lịch sử', columns: [{ title: 'Trạng thái', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người thực hiện', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }] });
            }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
        }
        lichSu();
    }

    root.addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]'); if (!b) return;
        if (b.getAttribute('data-a') === 'search') tai(); else if (b.getAttribute('data-a') === 'xacnhan') xacNhan();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
})();
