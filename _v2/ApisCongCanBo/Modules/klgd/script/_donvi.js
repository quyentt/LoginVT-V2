/* =========================================================================
   klgd — Đơn vị giảng viên (donvigiangvien / qlklgd_donvigiangvien): ums.klgd.donVi(root, ql)
   Hai cột như gốc (col-3 "Đơn vị" · col-9 "Danh sách giảng viên"), ô Năm học ở đầu cột trái; hộp "Thêm giảng viên"
   lấy giảng viên từ API ngoài (Get_GiangVien_API, tên cột camelCase).
   ---------------------------------------------------------------------------
   Bản cũ TKGG_KLGD: Đơn vị GetBoMonDuocPhanCong { strChucNang_Id, strNguoiThucHien_Id, strNamHoc } · Giảng viên GetListStaff
     { strNhomMonHocId, strChucNang_Id, strNguoiThucHien_Id } (khoá ID, mã MA) · Học hàm/học vị Get_HocHamHocVi (Data.Table /
     Data.Table1, ID/NAME) — CHỈ XEM · Xoá DeleteKLGD_DoiTuong { strIds "id1,id2,", strNguoiDung_Id }.
   Bản QL TKGG_QLKLGD: Đơn vị LayDS_PhanQuyenNguoiDungDonVi { strNguoiDungId, strNamHoc, strNguoiThucHienId } · Giảng viên
     GetDanhSachCanBoNienHoc { strNhomMonHocId, strChucNang_Id, strNguoiThucHienId } (khoá DOITUONGID, mã SOHIEUCT, cột
     "Đã chốt số liệu" CHOTDULIEU) · Học hàm NS.LOCD / Học vị NS.DMHV · Xoá { strIds, strNguoiThucHienId } ·
     Cập nhật CapNhatHocHamHocVi (POST) { strID: DOITUONGID, strHocHamId, strHocViId, strNguoiDung_Id } cho dòng ĐÃ ĐỔI ·
     Chốt / Bỏ chốt ChotMoChotDuLieu { strIds "id1,id2,", strTrangThai 1 | 0, strNguoiThucHienId }.
   Thêm (cả hai, POST): Them_KLGDDoiTuongAPI { strID: id, strMaDonVi: maDonVi, strMaCanBo: code, strHoDem: ho, strTen: ten,
     strAPI_Id: id, strNhomMonHocId, strNguoiDung_Id }.
   Khác bản gốc (ghi ở can-quyet.js):
     · Bản cũ: ô Học hàm/Học vị gốc đổi được nhưng không có nút lưu → khoá (chỉ xem); bỏ chữ TENHINHTHUCGIANGDAY
       gốc in thừa trên hai ô (chép nhầm từ màn khác).
     · Đổi năm học xoá đơn vị đang chọn + bảng giảng viên (gốc giữ → "Thêm mới" được vào đơn vị của năm cũ).
     · Danh sách rỗng thì xoá bảng (gốc giữ dữ liệu cũ). Chờ lời gọi xong rồi nạp lại (gốc chờ cứng 2–5 giây).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;

    K.donVi = function (root, ql) {
        var ctl = K.ctl(ql), khoa = ql ? 'DOITUONGID' : 'ID';
        var nutQL = ql ? ui.btn('save', { text: 'Cập nhật', attr: { 'data-a': 'capnhat' } }) +
            ui.btn('save', { text: 'Chốt dữ liệu', mod: 'out-primary', icon: 'fa-lock', attr: { 'data-a': 'chot' } }) +
            ui.btn('del', { text: 'Bỏ chốt dữ liệu', mod: 'out-danger', icon: 'fa-lock-open', attr: { 'data-a': 'bochot' } }) : '';
        var mst = pat.master({
            el: root, title: 'Đơn vị giảng viên',
            actions: ui.btn('add', { attr: { 'data-a': 'them' } }) + ui.xoaChon('input[data-ck]', { attr: { 'data-a': 'xoa' } }) + nutQL,
            side: { title: 'Đơn vị', icon: 'fa-building', search: false,
                filter: '<div class="ums-field"><select class="ums-select" data-f="nam" data-ph="Chọn năm học"><option value="">Chọn năm học</option></select></div>' },
            main: { title: 'Danh sách giảng viên', icon: 'fa-chalkboard-user', count: true }
        });
        ui.enhance(root);
        var fNam = root.querySelector('[data-f="nam"]');
        var donVi = [], dvId = '', gv = [], hh = [], hv = [];

        /* ---------- Nguồn học hàm / học vị ---------- */
        (ql ? Promise.all([ums.api.dm('NS.LOCD'), ums.api.dm('NS.DMHV')])
            : K.g('TKGG_KLGD/Get_HocHamHocVi', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), silent: true })
                .then(function (r) { var d = r.data || {}; return [d.Table || [], d.Table1 || []]; }))
            .then(function (x) { hh = x[0] || []; hv = x[1] || []; if (gv.length) veGV(); })
            .catch(function (err) { ums.api.handle(err, 'học hàm / học vị'); });

        function oChon(k, list, v, i) {
            var ten = ql ? 'TEN' : 'NAME';
            return '<select class="ums-select ums-input--sm" data-hh="' + k + '" data-i="' + i + '"' + (ql ? '' : ' disabled') + '><option value="">Chọn</option>' +
                list.map(function (x) { return '<option value="' + esc(e(x.ID)) + '"' + (e(x.ID) === e(v) ? ' selected' : '') + '>' + esc(e(x[ten])) + '</option>'; }).join('') + '</select>';
        }

        /* ---------- Cột trái: đơn vị ---------- */
        function veDV() {
            mst.sideCount.textContent = '(' + donVi.length + ')';
            mst.sideBody.innerHTML = donVi.length ? donVi.map(function (r) { return pat.masterItem({ id: r.ID, text: e(r.NAME), active: e(r.ID) === dvId }); }).join('')
                : ui.empty(fNam.value ? 'Không có đơn vị' : 'Chọn năm học', 'fa-inbox');
        }
        function taiDV() {
            dvId = ''; gv = []; veGV();
            if (!fNam.value) { donVi = []; veDV(); return; }
            mst.sideBody.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            (ql ? K.g(ctl + 'LayDS_PhanQuyenNguoiDungDonVi', { strNguoiDungId: K.uid(), strNamHoc: fNam.value, strNguoiThucHienId: K.uid() })
                : K.g(ctl + 'GetBoMonDuocPhanCong', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNamHoc: fNam.value }))
                .then(function (r) { donVi = K.arr(r.data); veDV(); })
                .catch(function (err) { mst.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'đơn vị'); });
        }

        /* ---------- Cột phải: giảng viên ---------- */
        function veGV() {
            if (!dvId) { mst.mainBody.innerHTML = ui.empty('Chọn một đơn vị ở cột trái', 'fa-hand-pointer'); mst.mainCount.textContent = ''; return; }
            mst.mainCount.textContent = '(' + gv.length + ')';
            var cot = [
                { title: 'Mã giảng viên', cls: 'is-nowrap', render: function (r) { return esc(e(ql ? r.SOHIEUCT : r.MA)); } },
                { title: 'Họ đệm', prop: 'HODEM' }, { title: 'Tên', prop: 'TEN' },
                { title: 'Học hàm', width: '170px', render: function (r, i) { return oChon('hh', hh, r.HOCHAMID, i); } },
                { title: 'Học vị', width: '170px', render: function (r, i) { return oChon('hv', hv, r.HOCVIID, i); } }];
            if (ql) cot.push({ title: 'Đã chốt số liệu', cls: 'is-center is-nowrap', render: function (r) { return e(r.CHOTDULIEU) === '1' ? '<span class="ums-badge ums-badge--ok">Đã chốt</span>' : ''; } });
            cot.push({ head: '<input type="checkbox" data-a="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } });
            ui.table({ el: mst.mainBody, rows: gv, columns: cot, empty: 'Đơn vị chưa có giảng viên' });
        }
        function taiGV() {
            if (!dvId) { gv = []; veGV(); return; }
            mst.mainBody.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            (ql ? K.g(ctl + 'GetDanhSachCanBoNienHoc', { strNhomMonHocId: dvId, strChucNang_Id: K.chucNang(), strNguoiThucHienId: K.uid() })
                : K.g(ctl + 'GetListStaff', { strNhomMonHocId: dvId, strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid() }))
                .then(function (r) { gv = K.arr(r.data); veGV(); })
                .catch(function (err) { mst.mainBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'giảng viên'); });
        }
        function daChon() {
            return Array.prototype.slice.call(mst.mainBody.querySelectorAll('[data-ck]:checked')).map(function (x) { return gv[Number(x.getAttribute('data-ck'))]; });
        }
        function ids(list) { return list.map(function (r) { return e(r[khoa]); }).join(',') + ','; }

        /* ---------- Thao tác ---------- */
        function xoa() {
            var c = daChon();
            if (!c.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                var p = { strIds: ids(c) };
                p[ql ? 'strNguoiThucHienId' : 'strNguoiDung_Id'] = K.uid();
                K.g(ctl + 'DeleteKLGD_DoiTuong', p).then(function () { ui.toast('Thực hiện thành công', 'ok'); taiGV(); })
                    .catch(function (err) { ums.api.handle(err, 'xoá giảng viên'); });
            });
        }
        function capNhat() {
            var doi = [];
            gv.forEach(function (r, i) {
                var a = mst.mainBody.querySelector('[data-hh="hh"][data-i="' + i + '"]'), b = mst.mainBody.querySelector('[data-hh="hv"][data-i="' + i + '"]');
                if (!a || !b) return;
                if (a.value !== e(r.HOCHAMID) || b.value !== e(r.HOCVIID)) doi.push({ r: r, hh: a.value, hv: b.value });
            });
            if (!doi.length) { ui.toast('Không có dòng nào thay đổi học hàm / học vị', 'info'); return; }
            ui.confirm('Bạn có chắc chắn cập nhật dữ liệu? (' + doi.length + ' giảng viên)', { ok: 'Cập nhật' }).then(function (yes) {
                if (!yes) return;
                ui.batch(doi.map(function (x) {
                    return { action: ctl + 'CapNhatHocHamHocVi', method: 'POST', strID: e(x.r.DOITUONGID), strHocHamId: x.hh, strHocViId: x.hv, strNguoiDung_Id: K.uid() };
                }), { title: 'Đang cập nhật', okText: 'Cập nhật thành công', show: true }).then(taiGV);
            });
        }
        function chot(tt) {
            var c = daChon();
            if (!c.length) { ui.toast('Vui lòng chọn đối tượng cần thao tác?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn thao tác dữ liệu?', { ok: tt ? 'Chốt' : 'Bỏ chốt' }).then(function (yes) {
                if (!yes) return;
                K.g(ctl + 'ChotMoChotDuLieu', { strIds: ids(c), strTrangThai: tt, strNguoiThucHienId: K.uid() })
                    .then(function () { ui.toast('Thực hiện thành công', 'ok'); taiGV(); }).catch(function (err) { ums.api.handle(err, 'chốt dữ liệu'); });
            });
        }
        function them() {
            if (!fNam.value) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
            if (!dvId) { ui.toast('Bạn chưa chọn đơn vị', 'warn'); return; }
            var ds = [];
            var dlg = ui.dialog({ title: 'Thêm giảng viên', icon: 'fa-user-plus', size: 'xl', body:
                '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-t="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Tìm kiếm', attr: { 'data-t': 'tim' } }) + '</div></div>' +
                '<div class="ums-u-mt-4" data-t="bang"></div>',
                buttons: [{ text: 'Thêm', kind: 'save', onClick: function () { luuThem(); return false; } }] });
            var B = dlg.body;
            function ve() {
                ui.table({ el: B.querySelector('[data-t="bang"]'), rows: ds, empty: 'Không tìm thấy giảng viên', columns: [
                    { title: 'Mã đơn vị', prop: 'maDonVi' }, { title: 'Mã cán bộ', prop: 'code' }, { title: 'Họ đệm', prop: 'ho' }, { title: 'Tên', prop: 'ten' },
                    { title: 'Tên trạng thái', prop: 'tenTrangThai' },
                    { head: '<input type="checkbox" data-t="all">', cls: 'is-center', width: '44px', render: function (r, i) { return '<input type="checkbox" data-tk="' + i + '">'; } }] });
            }
            function tim() {
                B.querySelector('[data-t="bang"]').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
                var p = { strTuKhoa: B.querySelector('[data-t="q"]').value.trim(), strChucNang_Id: K.chucNang(), strNamHoc: fNam.value };
                p[ql ? 'strNguoiThucHienId' : 'strNguoiThucHien_Id'] = K.uid();
                K.g(ctl + 'Get_GiangVien_API', p).then(function (r) { ds = K.arr(r.data); ve(); })
                    .catch(function (err) { B.querySelector('[data-t="bang"]').innerHTML = ui.fail(err.message); ums.api.handle(err, 'giảng viên'); });
            }
            function luuThem() {
                var c = Array.prototype.slice.call(B.querySelectorAll('[data-tk]:checked')).map(function (x) { return ds[Number(x.getAttribute('data-tk'))]; });
                if (!c.length) { ui.toast('Vui lòng chọn đối tượng cần thêm?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn thêm dữ liệu?', { ok: 'Thêm' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(c.map(function (r) {
                        return { action: ctl + 'Them_KLGDDoiTuongAPI', method: 'POST', strID: e(r.id), strMaDonVi: e(r.maDonVi), strMaCanBo: e(r.code),
                            strHoDem: e(r.ho), strTen: e(r.ten), strAPI_Id: e(r.id), strNhomMonHocId: dvId, strNguoiDung_Id: K.uid() };
                    }), { title: 'Đang thêm', okText: 'Thực hiện thành công', show: true }).then(function () { dlg.close(); taiGV(); });
                });
            }
            B.addEventListener('click', function (ev) {
                if (ev.target.closest('[data-t="tim"]')) tim();
                var a = ev.target.closest('[data-t="all"]');
                if (a) B.querySelectorAll('[data-tk]').forEach(function (x) { x.checked = a.checked; });
            });
            B.querySelector('[data-t="q"]').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
            ve();
        }

        root.addEventListener('click', function (ev) {
            var it = ev.target.closest('.ums-master__item[data-id]');
            if (it && mst.sideBody.contains(it)) { dvId = it.getAttribute('data-id'); veDV(); taiGV(); return; }
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            var a = b.getAttribute('data-a');
            if (a === 'them') them();
            else if (a === 'xoa') xoa();
            else if (a === 'capnhat') capNhat();
            else if (a === 'chot') chot(1);
            else if (a === 'bochot') chot(0);
            else if (a === 'all') mst.mainBody.querySelectorAll('[data-ck]').forEach(function (x) { x.checked = b.checked; });
        });
        if (window.jQuery) jQuery(fNam).on('select2:select select2:clear', taiDV);
        ums.crud.loadSource(K.nam(ql)).then(function (d) {
            var k = ql ? 'NAMHOC' : 'NIENHOC';
            pat.fill(fNam, d, { id: k, name: k, head: 'Chọn năm học' });
            if (d.length) { fNam.value = e(d[0][k]); if (window.jQuery) jQuery(fNam).trigger('change.select2'); }
            taiDV();
        }).catch(function (err) { ums.api.handle(err, 'năm học'); taiDV(); });
    };
})();
