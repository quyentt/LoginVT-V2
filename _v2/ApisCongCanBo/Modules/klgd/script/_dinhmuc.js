/* =========================================================================
   klgd — Định mức / miễn giảm / đơn giá giảng viên (dinhmucmiengiam / qlklgd_dinhmucmiengiam): ums.klgd.dinhMucMG(root, ql)
   Một cột: Năm học → Bộ môn + "Tổng hợp" · bảng giảng viên · "Chi tiết" mở màn con "Thông tin quá trình" (trong trang) với ba khối
   (Chi tiết định mức / miễn giảm / đơn giá — mỗi khối một bảng + dòng thêm mới + Xóa). Bản QL: sửa ngay trong bảng
   (ô chọn + ngày, nút "Cập nhật" từng khối), khối "Nhập định mức giảng dạy", Import (3 loại + tệp mẫu), báo cáo.
   ---------------------------------------------------------------------------
   Danh sách: GetThongTinDinhMucMienGiam { strNamHoc, NhomMonHocID, strNguoiDung_Id | strNguoiThucHienId }
   Tổng hợp: TongHopDinhMuc { strNamHoc, strNhomMonHocID, strNguoiDung_Id | strNguoiThucHienId }
   Ba khối (theo giảng viên = STAFFID):
     định mức  GetDinhMucGV / UpdateDinhMuc { strDinhmucID } / DeleteDinhMucNhanvien { strDinhMucIds }        · nguồn GetListDinhMuc (ID/NAME)
     miễn giảm GetMienGiamGV / UpdateMienGiam { strMienGiamID } / DeleteMienGiamNhanvien { strMienGiamIds }  · nguồn GetListMienGiam
     đơn giá   GetQuaTrinhDonGia / UpdateDonGiaGiangVien { strDonGiaId } / DeleteDonGiaGiangVien { strDonGiaIds } · nguồn GetDonGia (ID/DONGIAGIANGVIEN)
     Danh sách khối { strNamHoc, strStaffId, người }; Update { strId ('' = thêm), strStaffID, strNamHoc, <id>, strStartDate, strEndDate,
     strCachNhapDMMG '2', strNguoiDungId | strNguoiThucHienId }; Xoá { <ids> "id1,id2,", người } — bản QL xoá miễn giảm vẫn gửi
     strNguoiDungId (như gốc). GetDonGia bản cũ gửi năm dưới tên `Nienhoc` (như gốc).
   QL: Update_NhapDinhMuc { strStaffID, strNamHoc, strDinhMucGDNhap, strDinhMucNCKHNhap, strNguoiThucHienId } — điền sẵn khi
     DINHMUCGIANGDAY_NHAP = "1". Import_DinhMuc / Import_MienGiam / Import_DonGiaGiangVien { strNamHoc, strNguoiThucHien_Id, strPath }.
     Tệp mẫu: báo cáo TEMPLATE_IMPORTDM_MG_DONGIA.
   Khác bản gốc (ghi ở can-quyet.js):
     · Bản cũ: nút "Chi tiết" gốc tra dòng theo cột ID trong khi nút mang STAFFID → lỗi JS, ba bảng không nạp, không thêm được
       (bản QL đã sửa theo STAFFID) → nay tra theo STAFFID.
     · Báo đúng kết quả (gốc báo "Cập nhật thành công" trước khi lời gọi xong; thông điệp thành công bị coi là lỗi).
     · Bản QL nạp danh mục MỘT lần cho mọi dòng (gốc mỗi dòng một lời gọi → ô chưa nạp kịp bị coi là "đã đổi" và gửi rỗng).
     · Năm học → Bộ môn khoá theo luật cha → con, đổi năm xoá bảng. Dòng thêm mới xoá trắng sau khi thêm.
     · Nút thêm đơn giá gốc báo "Bạn chưa chọn miễn giảm" → "Bạn chưa chọn đơn giá". Bỏ ký tự rác "c" (html gốc dòng 170).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;

    K.dinhMucMG = function (root, ql) {
        var ctl = K.ctl(ql), nd = ql ? 'strNguoiThucHienId' : 'strNguoiDung_Id', ndGhi = ql ? 'strNguoiThucHienId' : 'strNguoiDungId';
        var nutQL = ql ? '<span data-z="bc"></span>' + ui.btn('save', { text: 'Import', mod: 'out-primary', icon: 'fa-file-excel', attr: { 'data-a': 'import' } }) : '';
        root.innerHTML = pat.page('Định mức, miễn giảm giảng viên', nutQL) +
            pat.filterBar([{ key: 'nam', type: 'select', label: 'Chọn năm học' }, { key: 'bm', type: 'select', label: 'Chọn bộ môn' }],
                { search: false, extra: '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Tổng hợp', icon: 'fa-calculator', attr: { 'data-a': 'tonghop' } }) + '</div>' }) +
            pat.panel({ title: 'Thông tin', icon: 'fa-users', flush: true, count: 'dem', zone: 'bang' });
        ui.enhance(root);
        function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return F(k).value; }
        var bang = root.querySelector('[data-z="bang"]'), ds = [];
        function nguoi(o, key) { o[key || nd] = K.uid(); return o; }

        /* ---------- Bảng giảng viên ---------- */
        function ve() {
            var cot = [];
            if (ql) cot.push({ title: 'Mã số', prop: 'MA', cls: 'is-nowrap' });
            cot.push({ title: 'Họ tên', prop: 'HOTEN' }, { title: 'Học hàm, học vị', prop: 'HOCHAMHOCVI' },
                { title: 'Định mức GD', cls: 'is-center', render: function (r) { return esc(e(ql ? r.DINHMUCGIANGDAY : r.DMGD_THUCTE)); } },
                { title: 'Định mức NCKH', cls: 'is-center', render: function (r) { return esc(e(ql ? r.DINHMUCNGHIENCUUKHOAHOC : r.DMNCKH_THUCTE)); } },
                { title: 'Thông tin định mức', prop: 'DINHMUC' }, { title: 'Thông tin miễn giảm', prop: 'MIENGIAM' },
                { title: 'Đơn giá', cls: 'is-right', render: function (r) { return esc(pat.money(r.DONGIA_THUCTE)); } }, { title: 'Thông tin đơn giá', prop: 'DONGIA' },
                { title: 'Chi tiết', cls: 'is-center', width: '70px', render: function (r, i) { return '<button type="button" class="ums-iconbtn" data-ct="' + i + '" title="Chi tiết"><i class="fa-light fa-eye"></i></button>'; } });
            ui.table({ el: bang, rows: ds, columns: cot, empty: 'Không có giảng viên' });
            root.querySelector('[data-z="dem"]').textContent = '(' + ds.length + ')';
        }
        function tai() {
            if (!v('nam') || !v('bm')) { ds = []; bang.innerHTML = ui.empty('Chọn năm học và bộ môn', 'fa-filter'); root.querySelector('[data-z="dem"]').textContent = ''; return Promise.resolve(); }
            bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            return K.g(ctl + 'GetThongTinDinhMucMienGiam', nguoi({ strNamHoc: v('nam'), NhomMonHocID: v('bm') }))
                .then(function (r) { ds = K.arr(r.data); ve(); })
                .catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'định mức'); });
        }

        /* ---------- Nguồn ba danh mục (nạp lại khi đổi năm) ---------- */
        var nguon = {};
        function napNguon() {
            var nam = v('nam');
            function g(action, o) { return K.g(ctl + action, Object.assign({ silent: true }, o)).then(function (r) { return K.arr(r.data); }).catch(function () { return []; }); }
            var p = { strChucNang_Id: K.chucNang(), strNamHoc: nam };
            if (ql) p.strNguoiThucHienId = K.uid(); else p.strNguoiThucHien_Id = K.uid();
            nguon.dm = g('GetListDinhMuc', p);
            nguon.mg = g('GetListMienGiam', p);
            nguon.dg = g('GetDonGia', ql ? { strNamHoc: nam, strNguoiThucHienId: K.uid() } : { Nienhoc: nam, strNguoiDung_Id: K.uid() });
        }
        var KHOI = [
            { k: 'dm', tieuDe: 'Chi tiết định mức', ds: 'GetDinhMucGV', them: 'UpdateDinhMuc', idKey: 'strDinhmucID', xoa: 'DeleteDinhMucNhanvien', xoaKey: 'strDinhMucIds',
                chon: 'định mức', col: 'DINHMUCID', ten: 'NAME',
                cot: [{ title: 'Mã định mức', prop: 'MADM' }, { title: 'Tên định mức', prop: 'TENDM', sel: true }, { title: 'Định mức GD', prop: 'DMGD', cls: 'is-center' },
                    { title: 'Định mức NCKH', prop: 'DMNCKH', cls: 'is-center' }] },
            { k: 'mg', tieuDe: 'Chi tiết miễn giảm', ds: 'GetMienGiamGV', them: 'UpdateMienGiam', idKey: 'strMienGiamID', xoa: 'DeleteMienGiamNhanvien', xoaKey: 'strMienGiamIds',
                xoaNguoi: 'strNguoiDungId', chon: 'miễn giảm', col: 'MIENGIAMID', ten: 'NAME',
                cot: [{ title: 'Mã MG', prop: 'MAMG' }, { title: 'Tên miễn giảm', prop: 'TENMG', sel: true }, { title: 'Miễn giảm GD', prop: 'MGGD', cls: 'is-center' },
                    { title: 'Miễn giảm NCKH', prop: 'MGNCKH', cls: 'is-center' }] },
            { k: 'dg', tieuDe: 'Chi tiết đơn giá', ds: 'GetQuaTrinhDonGia', them: 'UpdateDonGiaGiangVien', idKey: 'strDonGiaId', xoa: 'DeleteDonGiaGiangVien', xoaKey: 'strDonGiaIds',
                chon: 'đơn giá', col: 'TBL_KLGD_DONGIAGIANGDAYID', ten: 'DONGIAGIANGVIEN',
                cot: [{ title: 'Loại đơn giá', prop: 'LOAIGIANGVIEN', sel: true }, { title: 'Số tiền', prop: 'DONGIA', cls: 'is-right', tien: true }] }];

        /* ---------- "Thông tin quá trình" — màn con trong trang, thay chỗ danh sách (pat.formTrang, BO-CUC luật 1) ---------- */
        function chiTiet(gv) {
            var staff = e(gv.STAFFID);
            var body = '<div class="ums-grid ums-grid--2 ums-u-mb-4"><div class="ums-kv"><span>Giảng viên</span><b class="kl-do">' + esc((e(gv.HOCHAMHOCVI) + ' ' + e(gv.HOTEN)).trim()) +
                '</b></div><div class="ums-kv"><span>Bộ môn</span><b class="kl-do">' + esc(e(gv.TENBM)) + '</b></div></div>';
            KHOI.forEach(function (kh, n) {
                body += '<div class="ums-row ums-row--between ums-u-mt-4"><div class="ums-legend ums-u-mb-0">' + esc(kh.tieuDe) + '</div><div class="ums-row">' +
                    (ql ? ui.btn('save', { text: 'Cập nhật', attr: { 'data-k': 'luu', 'data-kh': kh.k } }) + ' ' : '') +
                    ui.xoaChon('input[data-ck]', { trong: '[data-b="' + kh.k + '"]', attr: { 'data-k': 'xoa', 'data-kh': kh.k } }) + '</div></div><div class="ums-u-mt-2" data-b="' + kh.k + '"></div>' +
                    '<div class="ums-filter ums-u-mt-2" data-them="' + kh.k + '">' +
                    '<div class="ums-field"><select class="ums-select" data-t="chon" data-ph="Chọn ' + kh.chon + '"><option value="">Chọn ' + esc(kh.chon) + '</option></select></div>' +
                    '<div class="ums-field"><div class="ums-inputwrap"><input class="ums-input" data-t="tu" data-date placeholder="Từ ngày" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>' +
                    '<div class="ums-field"><div class="ums-inputwrap"><input class="ums-input" data-t="den" data-date placeholder="Đến ngày" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-k': 'them', 'data-kh': kh.k } }) + '</div></div>';
                if (ql && n === 0) body += '<div class="ums-legend ums-legend--cach">Nhập định mức giảng dạy</div><div class="ums-filter">' +
                    '<div class="ums-field"><input class="ums-input" data-t="nhapgd" placeholder="Nhập định mức GD" autocomplete="off"></div>' +
                    '<div class="ums-field"><input class="ums-input" data-t="nhapnc" placeholder="Nhập định mức NCKH" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Cập nhật', attr: { 'data-k': 'nhapdm' } }) + '</div></div>';
            });
            var dlg = pat.formTrang({ host: root, title: 'Thông tin quá trình', icon: 'fa-clock-rotate-left', cols: 1, body: body });
            var B = dlg.body, dsK = {}, dm = {};
            if (ql && e(gv.DINHMUCGIANGDAY_NHAP) === '1') { B.querySelector('[data-t="nhapgd"]').value = e(gv.DINHMUCGIANGDAY); B.querySelector('[data-t="nhapnc"]').value = e(gv.DINHMUCNGHIENCUUKHOAHOC); }
            function khoi(k) { return KHOI.filter(function (x) { return x.k === k; })[0]; }
            function oNgay(k, i, val) { return '<div class="ums-inputwrap"><input class="ums-input ums-input--sm" data-r="' + k + '" data-i="' + i + '" data-date placeholder="dd/mm/yyyy" value="' + esc(e(val)) + '" autocomplete="off"><i class="fa-light fa-calendar"></i></div>'; }
            function veKhoi(kh) {
                var host = B.querySelector('[data-b="' + kh.k + '"]'), rows = dsK[kh.k] || [];
                var cot = kh.cot.map(function (c) {
                    if (ql && c.sel) return { title: c.title, width: '220px', render: function (r, i) {
                        return '<select class="ums-select ums-input--sm" data-r="sel" data-i="' + i + '"><option value="">Chọn ' + esc(kh.chon) + '</option>' +
                            (dm[kh.k] || []).map(function (x) { return '<option value="' + esc(e(x.ID)) + '"' + (e(x.ID) === e(r[kh.col]) ? ' selected' : '') + '>' + esc(e(x[kh.ten])) + '</option>'; }).join('') + '</select>';
                    } };
                    return { title: c.title, cls: c.cls, render: function (r) { return esc(c.tien ? pat.money(r[c.prop]) : e(r[c.prop])); } };
                });
                cot.push({ title: 'Thời gian từ', width: ql ? '150px' : '', render: function (r, i) { return ql ? oNgay('tu', i, r.NGAYTHANGBATDAU) : esc(e(r.NGAYTHANGBATDAU)); } },
                    { title: 'Thời gian đến', width: ql ? '150px' : '', render: function (r, i) { return ql ? oNgay('den', i, r.NGAYTHANGKETTHUC) : esc(e(r.NGAYTHANGKETTHUC)); } },
                    { head: '<input type="checkbox" data-all="' + kh.k + '">', cls: 'is-center', width: '44px', render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } });
                ui.table({ el: host, rows: rows, columns: cot, empty: 'Chưa có dữ liệu' });
                ui.enhance(host);
            }
            function taiKhoi(kh) {
                var host = B.querySelector('[data-b="' + kh.k + '"]');
                host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
                return Promise.all([K.g(ctl + kh.ds, nguoi({ strNamHoc: v('nam'), strStaffId: staff })), nguon[kh.k]]).then(function (x) {
                    dsK[kh.k] = K.arr(x[0].data); dm[kh.k] = x[1] || [];
                    var sel = B.querySelector('[data-them="' + kh.k + '"] [data-t="chon"]');
                    if (sel.options.length <= 1) pat.fill(sel, dm[kh.k], { id: 'ID', name: kh.ten, head: 'Chọn ' + kh.chon });
                    veKhoi(kh);
                }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, kh.tieuDe); });
            }
            function goiUpdate(kh, id, chon, tu, den) {
                var p = { action: ctl + kh.them, method: 'GET', strId: id, strStaffID: staff, strNamHoc: v('nam'), strStartDate: tu, strEndDate: den, strCachNhapDMMG: '2' };
                p[kh.idKey] = chon; p[ndGhi] = K.uid();
                return p;
            }
            function xong(kh) { return function () { taiKhoi(kh); tai(); }; }
            B.addEventListener('click', function (ev) {
                var a = ev.target.closest('[data-all]');
                if (a) { B.querySelector('[data-b="' + a.getAttribute('data-all') + '"]').querySelectorAll('[data-ck]').forEach(function (x) { x.checked = a.checked; }); return; }
                var b = ev.target.closest('[data-k]');
                if (!b) return;
                var kh = khoi(b.getAttribute('data-kh')), act = b.getAttribute('data-k');
                if (act === 'nhapdm') {
                    ui.confirm('Bạn có chắc chắn cập nhật dữ liệu?', { ok: 'Cập nhật' }).then(function (yes) {
                        if (!yes) return;
                        K.g(ctl + 'Update_NhapDinhMuc', { strStaffID: staff, strNamHoc: v('nam'), strDinhMucGDNhap: B.querySelector('[data-t="nhapgd"]').value.trim(),
                            strDinhMucNCKHNhap: B.querySelector('[data-t="nhapnc"]').value.trim(), strNguoiThucHienId: K.uid() })
                            .then(function () { ui.toast('Cập nhật thành công', 'ok'); xong(KHOI[0])(); }).catch(function (err) { ums.api.handle(err, 'nhập định mức'); });
                    });
                    return;
                }
                var host = B.querySelector('[data-b="' + kh.k + '"]'), rows = dsK[kh.k] || [];
                if (act === 'them') {
                    var z = B.querySelector('[data-them="' + kh.k + '"]');
                    var chon = z.querySelector('[data-t="chon"]').value, tu = z.querySelector('[data-t="tu"]').value.trim(), den = z.querySelector('[data-t="den"]').value.trim();
                    if (!chon) { ui.toast('Bạn chưa chọn ' + kh.chon, 'warn'); return; }
                    if (!tu) { ui.toast('Bạn chưa nhập từ ngày', 'warn'); return; }
                    if (!den) { ui.toast('Bạn chưa nhập đến ngày', 'warn'); return; }
                    ums.api.call(goiUpdate(kh, '', chon, tu, den)).then(function () {
                        ui.toast('Thực hiện thành công', 'ok');
                        z.querySelectorAll('[data-t]').forEach(function (x) { x.value = ''; if (window.jQuery) jQuery(x).trigger('change.select2'); });
                        xong(kh)();
                    }).catch(function (err) { ums.api.handle(err, 'thêm ' + kh.chon); });
                } else if (act === 'xoa') {
                    var c = Array.prototype.slice.call(host.querySelectorAll('[data-ck]:checked')).map(function (x) { return rows[Number(x.getAttribute('data-ck'))]; });
                    if (!c.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                    ui.confirm('Bạn có chắc chắn xóa?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                        if (!yes) return;
                        var p = {}; p[kh.xoaKey] = c.map(function (r) { return e(r.ID); }).join(',') + ','; p[ql && kh.xoaNguoi ? kh.xoaNguoi : ndGhi] = K.uid();
                        K.g(ctl + kh.xoa, p).then(function () { ui.toast('Thực hiện thành công', 'ok'); xong(kh)(); }).catch(function (err) { ums.api.handle(err, 'xoá ' + kh.chon); });
                    });
                } else if (act === 'luu') {
                    var doi = [];
                    rows.forEach(function (r, i) {
                        var s = host.querySelector('[data-r="sel"][data-i="' + i + '"]'), t = host.querySelector('[data-r="tu"][data-i="' + i + '"]'), d = host.querySelector('[data-r="den"][data-i="' + i + '"]');
                        if (!s || !t || !d) return;
                        if (s.value !== e(r[kh.col]) || t.value.trim() !== e(r.NGAYTHANGBATDAU) || d.value.trim() !== e(r.NGAYTHANGKETTHUC))
                            doi.push(goiUpdate(kh, e(r.ID), s.value, t.value.trim(), d.value.trim()));
                    });
                    if (!doi.length) { ui.toast('Không có dòng nào thay đổi', 'info'); return; }
                    ui.confirm('Bạn có chắc chắn cập nhật dữ liệu? (' + doi.length + ' dòng)', { ok: 'Cập nhật' }).then(function (yes) {
                        if (!yes) return;
                        ui.batch(doi, { title: 'Đang cập nhật', okText: 'Cập nhật thành công', show: true }).then(xong(kh));
                    });
                }
            });
            KHOI.forEach(taiKhoi);
        }

        /* ---------- Import (bản QL) ---------- */
        function moImport() {
            if (!v('nam')) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
            K.hopImport({ mau: 'TEMPLATE_IMPORTDM_MG_DONGIA', onDone: tai,
                params: function () { return { strNamHoc: v('nam'), strNguoiThucHien_Id: K.uid() }; },
                nut: [{ text: 'Import MG', action: ctl + 'Import_MienGiam' }, { text: 'Import Định mức', action: ctl + 'Import_DinhMuc' },
                    { text: 'Import Đơn giá', action: ctl + 'Import_DonGiaGiangVien' }] });
        }

        if (ql) ums.report.mount(root.querySelector('[data-z="bc"]'), { collect: function (add) {
            add('strNamHoc', v('nam')); add('strNhomMonHocId', v('bm')); add('Id', v('bm')); add('strNguoiThucHienId', K.uid()); add('strChucNang_Id', K.chucNang());
        } });
        root.addEventListener('click', function (ev) {
            var c = ev.target.closest('[data-ct]');
            if (c) { chiTiet(ds[Number(c.getAttribute('data-ct'))]); return; }
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            var a = b.getAttribute('data-a');
            if (a === 'tonghop') {
                if (!v('nam') || !v('bm')) { ui.toast('Bạn chưa chọn năm học / bộ môn', 'warn'); return; }
                K.g(ctl + 'TongHopDinhMuc', nguoi({ strNamHoc: v('nam'), strNhomMonHocID: v('bm') })).then(function () { ui.toast('Thực hiện thành công', 'ok'); tai(); })
                    .catch(function (err) { ums.api.handle(err, 'tổng hợp định mức'); });
            } else if (a === 'import') moImport();
        });
        function napBoMon() {
            if (!v('nam')) return;
            (ql ? K.g(ctl + 'LayDS_PhanQuyenNguoiDungDonVi', { strNguoiDungId: K.uid(), strNamHoc: v('nam'), strChucNang_Id: K.chucNang(), strNguoiThucHienId: K.uid(), silent: true })
                : K.g(ctl + 'GetBoMonDuocPhanCong', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNamHoc: v('nam'), silent: true }))
                .then(function (r) { pat.fill(F('bm'), K.arr(r.data), { id: 'ID', name: 'NAME', head: 'Chọn bộ môn' }); }).catch(function (err) { ums.api.handle(err, 'bộ môn'); });
        }
        pat.chain([F('nam'), F('bm')], { phatLai: false });
        jQuery(F('nam')).on('select2:select select2:clear', function () { napBoMon(); napNguon(); tai(); });
        jQuery(F('bm')).on('select2:select select2:clear', tai);
        ums.crud.loadSource(K.nam(ql)).then(function (d) {
            var k = ql ? 'NAMHOC' : 'NIENHOC';
            pat.fill(F('nam'), d, { id: k, name: k, head: 'Chọn năm học' });
            if (d.length) { F('nam').value = e(d[0][k]); jQuery(F('nam')).trigger('change.select2'); jQuery(F('nam')).trigger({ type: 'select2:select' }); }
            else tai();
        }).catch(function (err) { ums.api.handle(err, 'năm học'); tai(); });
    };
})();
