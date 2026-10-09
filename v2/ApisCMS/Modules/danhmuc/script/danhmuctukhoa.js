/* =========================================================================
   Danh mục từ khoá — cấu hình Định danh / Dữ liệu / Mô tả (CMS_CauHinh)
   Bản gốc: ApisCMS/Modules/danhmuc/html/danhmuctukhoa.html + script/danhmuctukhoa.js
   Một cột như gốc: thanh lọc + LƯỚI NHẬP (sửa thẳng trong ô, "Thêm dòng mới", Lưu
   gom các dòng đã đổi, Xoá các dòng đã đánh dấu). Không phải màn danh sách + biểu
   mẫu nên không dùng ums.crud; bảng qua ums.ui.table, xoá nhiều = ums.ui.xoaChon,
   lưu / xoá hàng loạt = ums.ui.batch.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn, kiểu cũ không func, không iM):
     CMS_CauHinh/LayDanhSach  GET  strTuKhoa, strNguoiTao_Id "" (gốc đọc #dropAAAA), phân trang máy chủ
     CMS_CauHinh/ThemMoi | CapNhat  strId, strChucNang_Id, strDinhDanh, strDuLieu, strMoTa, strUngDung_Id
         dòng MỚI: ứng dụng + chức năng lấy ở thanh lọc; dòng CŨ: CHUCNANG_ID / UNGDUNG_ID của dòng
     CMS_CauHinh/Xoa  strIds = MỘT id mỗi lời gọi, strChucNang_Id (hệ tự điền như edu.system.strChucNang_Id)
     Ứng dụng: pkg_chung_quanlynguoidung.LayDanhSachUngDung (ums.cmsDm.ungDung)
     Chức năng: CMS_ChucNang/LayDanhSach  GET  versionAPI v1.0, strChung_UngDung_Id, pageSize 1000, dTrangThai 1

   Giữ nguyên hành vi gốc:
     · Lưu bỏ qua dòng thiếu Định danh HOẶC Dữ liệu, và dòng cũ không đổi gì; hỏi "Bạn có chắc chắn
       lưu N dữ liệu không?" rồi mới gửi.
     · Danh sách trống thì vẽ sẵn 4 dòng trống, có dữ liệu thì thêm 1 dòng trống ở cuối.
     · Danh sách KHÔNG lọc theo ứng dụng / chức năng (gốc không gửi) — hai ô đó chỉ quyết định
       ứng dụng / chức năng gán cho dòng MỚI.
   Khác gốc:
     · Ứng dụng → Chức năng là cặp CHA → CON: chưa chọn ứng dụng thì khoá ô chức năng, xoá ứng dụng
       thì xoá chức năng (ums.pat.chain).
     · Không có dòng nào cần lưu thì báo, không hỏi "lưu 0 dữ liệu".
     · Xoá: gốc coi phản hồi có Message là LỖI (kể cả Success) — bản mới theo Success của máy chủ.
     · Bỏ: #btnDelete_DanhMucTuKhoa (xoá trong hộp thoại) — nút không có trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('danhmuctukhoa');
    if (!root) return;
    var D = ums.cmsDm, e = D.e;
    var SIZE = 10;                           // edu.system.pageSize_default

    root.innerHTML =
        ums.pat.page('Danh mục từ khoá', '') +
        ums.pat.filterBar([
            { key: 'ung', type: 'select', label: 'Chọn ứng dụng' },
            { key: 'cn', type: 'select', label: 'Chọn chức năng' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        ums.pat.panel({
            title: 'Danh sách', icon: 'fa-list-timeline', count: 'tong', flush: true,
            tools: ui.xoaChon('input[data-tk]', { goc: '.ums-panel', text: 'Xóa' }) +
                ui.btn('save', { attr: { 'data-a': 'luu' } }),
            body: '<div data-z="bang"></div>' +
                '<div class="ums-tablefoot dm-tk__foot">' +
                ui.btn('add', { text: 'Thêm dòng mới', mod: 'out-success', attr: { 'data-a': 'them' } }) + '</div>'
        });
    ui.enhance(root);

    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var zBang = root.querySelector('[data-z="bang"]');
    var zTong = root.querySelector('[data-z="tong"]');

    var st = { page: 1, total: 0, dong: [], seq: 0 };   // dong: [{ key, rec | null, v: { dd, dl, mt } }]

    /* ---------- Ô lọc ---------- */
    D.ungDung().then(function (rows) { ums.pat.fill(F('ung'), rows, { name: 'TENUNGDUNG' }); });
    function napChucNang() {
        var ung = F('ung').value;
        if (!ung) { ums.pat.fill(F('cn'), []); return; }
        ums.api.call({
            action: 'CMS_ChucNang/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strTuKhoa: '',
            strChung_UngDung_Id: ung,
            strCha_Id: '',
            pageIndex: 1,
            pageSize: 1000,
            strPhamViTruyCap_Id: '',
            dTrangThai: 1,
            silent: true
        }).then(function (r) {
            ums.pat.fill(F('cn'), D.rows(r), { name: 'TENCHUCNANG' });
        }).catch(function (err) { ums.api.handle(err, 'danh sách chức năng'); });
    }
    if (window.jQuery) jQuery(F('ung')).on('select2:select select2:clear', napChucNang);
    ums.pat.chain([F('ung'), F('cn')], { phatLai: false });

    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target === F('q')) { ev.preventDefault(); load(1); }
    });

    /* ---------- Lưới ---------- */
    function dongMoi() { return { key: 'n' + (++st.seq), rec: null, v: { dd: '', dl: '', mt: '' } }; }

    function load(p) {
        st.page = p || 1;
        zBang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_CauHinh/LayDanhSach',
            method: 'GET',
            strTuKhoa: F('q').value.trim(),
            strNguoiTao_Id: '',
            pageIndex: st.page,
            pageSize: SIZE
        }).then(function (r) {
            var rows = D.rows(r);
            st.total = Number(r.pager) || rows.length;
            zTong.textContent = '(' + st.total + ')';
            st.dong = rows.map(function (x) {
                return { key: x.ID, rec: x, v: { dd: e(x.DINHDANH), dl: e(x.DULIEU), mt: e(x.MOTA) } };
            });
            for (var i = 0; i < (rows.length ? 1 : 4); i++) st.dong.push(dongMoi());
            ve();
        }).catch(function (err) {
            zBang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh mục từ khoá');
        });
    }

    function oNhap(d, k, nhan) {
        return '<input class="ums-input ums-input--sm" data-o="' + k + '" data-row="' + ui.esc(d.key) +
            '" aria-label="' + nhan + '" autocomplete="off" value="' + ui.esc(d.v[k]) + '">';
    }

    function ve() {
        ui.table({
            el: zBang,
            rows: st.dong,
            empty: 'Không có dữ liệu',
            columns: [
                { title: 'Định danh', render: function (d) { return oNhap(d, 'dd', 'Định danh'); } },
                { title: 'Dữ liệu', render: function (d) { return oNhap(d, 'dl', 'Dữ liệu'); } },
                { title: 'Mô tả', render: function (d) { return oNhap(d, 'mt', 'Mô tả'); } },
                { head: '<input type="checkbox" data-a="all" title="Chọn tất cả">', cls: 'is-center', width: '96px',
                  render: function (d) {
                      return d.rec
                          ? '<input type="checkbox" data-tk="' + ui.esc(d.key) + '">'
                          : '<button type="button" class="ums-btn ums-btn--out-danger ums-btn--sm" data-xd="' + ui.esc(d.key) +
                            '" title="Xóa dòng"><i class="fa-light fa-trash-can"></i><span>Xóa</span></button>';
                  } }
            ],
            page: {
                index: st.page, size: SIZE, total: st.total, sizes: false,
                onChange: function (pg) { if (pg >= 1 && pg <= Math.ceil(st.total / SIZE)) load(pg); }
            }
        });
    }

    function tim(key) { return st.dong.filter(function (d) { return d.key === key; })[0]; }

    zBang.addEventListener('input', function (ev) {
        var t = ev.target, d = t.getAttribute('data-o') && tim(t.getAttribute('data-row'));
        if (d) d.v[t.getAttribute('data-o')] = t.value;
    });
    zBang.addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-a') !== 'all') return;
        Array.prototype.forEach.call(zBang.querySelectorAll('input[data-tk]'), function (x) { x.checked = ev.target.checked; });
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a], [data-xd], [data-xoachon]');
        if (!b || !root.contains(b)) return;
        if (b.hasAttribute('data-xd')) {
            var k = b.getAttribute('data-xd');
            st.dong = st.dong.filter(function (d) { return d.key !== k; });
            ve();
            return;
        }
        if (b.hasAttribute('data-xoachon')) { xoa(); return; }
        var a = b.getAttribute('data-a');
        if (a === 'search') load(1);
        else if (a === 'them') { st.dong.push(dongMoi()); ve(); }
        else if (a === 'luu') luu();
    });

    function luu() {
        var can = st.dong.filter(function (d) {
            var v = d.v;
            if (!v.dd.trim() || !v.dl.trim()) return false;
            if (d.rec && v.dd === e(d.rec.DINHDANH) && v.dl === e(d.rec.DULIEU) && v.mt === e(d.rec.MOTA)) return false;
            return true;
        });
        if (!can.length) { ui.toast('Không có dòng nào cần lưu (dòng phải có Định danh và Dữ liệu)', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu ' + can.length + ' dữ liệu không?', { ok: 'Lưu', title: 'Lưu dữ liệu' }).then(function (yes) {
            if (!yes) return;
            var ung = F('ung').value || '', cn = F('cn').value || '';
            var calls = can.map(function (d) {
                return {
                    action: d.rec ? 'CMS_CauHinh/CapNhat' : 'CMS_CauHinh/ThemMoi',
                    strId: d.rec ? d.rec.ID : '',
                    strChucNang_Id: d.rec ? e(d.rec.CHUCNANG_ID) : cn,
                    strDinhDanh: d.v.dd.trim(),
                    strDuLieu: d.v.dl.trim(),
                    strMoTa: d.v.mt.trim(),
                    strUngDung_Id: d.rec ? e(d.rec.UNGDUNG_ID) : ung,
                    strNguoiThucHien_Id: ''
                };
            });
            return ui.batch(calls, { title: 'Đang lưu', okText: 'Đã lưu', show: true }).then(function () { load(st.page); });
        });
    }

    function xoa() {
        var ids = Array.prototype.filter.call(zBang.querySelectorAll('input[data-tk]'), function (x) { return x.checked; })
            .map(function (x) { return x.getAttribute('data-tk'); });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            var calls = ids.map(function (id) {
                return { action: 'CMS_CauHinh/Xoa', strIds: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
            });
            return ui.batch(calls, { title: 'Đang xoá', okText: 'Đã xoá', show: true }).then(function () { load(st.page); });
        });
    }

    load(1);
})();
