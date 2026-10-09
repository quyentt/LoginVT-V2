/* =========================================================================
   klgd — Phân công giảng dạy (phanconggiangday / qlklgd_phanconggiangday): ums.klgd.phanCong(root, ql)
   Thanh lọc 8 ô (bộ lọc chung K.boLoc) + HAI CỘT như gốc (col-7 "Đã phân công" · col-5 "Chưa phân công"), hộp
   "Phân công bộ môn khác" và hộp "Toàn bộ phân giảng".
   ---------------------------------------------------------------------------
   Bản cũ TKGG_KLGD (học kỳ gửi "<năm>_<kỳ>"):
     Đã phân công GetDanhSachPhanCong { strBoMonId, strStaffId, strHocKy, strDotHoc, strHeDaoTaoId, strCoSoDaoTaoId, strAyId, strNguoiDung_Id }
       (khoá dòng PHANCONGTINCHIID) · Chưa phân công GetDanhSachLopHocPhan (như trên, bỏ strStaffId; khoá IDTHOIKHOABIEU)
     BM khác GetDanhSachPhanCongBMKhac { strBoMonId: bộ môn KHÁC, strStaffId: giảng viên khác, …, strBoMonGocId: bộ môn lọc }
     Toàn bộ GetDanhSachCacMonHocDaPCCuaBM { strBoMonId, strStaffId, … } · bộ môn khác GetToanBoBoMon { strNamHoc }
     Phân công PhanCongGiangDay { strStaffId, strNamHoc, strHocKy, strDotHoc, strThoiKhoaBieuId: id nối phẩy, strNguoiDung_Id }
     Xoá DeletePhanCongGiangDay { strNamHoc, strHocKy, strDotHoc, strPhanCongTinChiId: id nối phẩy, strNguoiDung_Id }
   Bản QL TKGG_QLKLGD (học kỳ = giá trị ô, đợt = id):
     Đã phân công GetDanhSachPhanCong { strBoMonId, strStaffId, strHocKy, strDotHocId, strHeDaoTaoId, strCoSoDaoTaoId, strKhoaHocId,
       strNguoiThucHienId } (khoá KHOILUONGTHOIKHOABIEUID) · Chưa phân công GetDanhSachChuaPhanCong (khoá IDLOPHOCPHAN)
     BM khác GetDanhSachPhanCongBMKhac { strBoMonId: bộ môn lọc, strBoMonKhacId, strStaffId: giảng viên khác, … }
     Toàn bộ GetDanhSachCacMonHocDaPCCuaBM { strBoMonId, strBoMonKhacId, strStaffId, … } · bộ môn khác GetNhomMonHoc { strNamHoc }
     Phân công PhanCongGiangDay { strStaffId, strNamHoc, strHocKy, strDotHocId, strLopHocPhanIds, strNguoiThucHienId }
     Xoá DeletePhanCongGiangDay { strKhoiLuongThoiKhoaBieuId, strNamHoc, strHocKy (HOCKYFULL), strDotHocId (DAOTAO_THOIGIANDAOTAO_ID),
       strLopHocPhanId, strStaffId — MỖI tham số là danh sách nối phẩy lấy từ dòng, cùng thứ tự; strNguoiThucHienId }
   Khác bản gốc (ghi ở can-quyet.js):
     · Ô "chọn tất cả" của bảng trong hộp BM khác gốc trùng id với bảng "chưa phân công" (tích nhầm bảng) → nay đúng bảng.
     · Xoá nạp lại MỘT lần sau khi xong (gốc nạp 6 lần, lần đầu trước khi xoá xong).
     · Bảng trong hộp BM khác chỉ nạp khi hộp mở (gốc nạp mỗi lần đổi ô lọc dù hộp đóng).
     · ql "Toàn bộ phân giảng": gốc lấy bộ môn khác / giảng viên từ ô của hộp BM khác (chép nhầm) → nay gửi rỗng.
     · Ô cha → con khoá theo luật; nạp bảng SAU khi đã nạp lại ô con (gốc nạp song song → bảng theo giá trị cũ).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;

    K.phanCong = function (root, ql) {
        var ctl = K.ctl(ql);
        var KHOA_DA = ql ? 'KHOILUONGTHOIKHOABIEUID' : 'PHANCONGTINCHIID', KHOA_CHUA = ql ? 'IDLOPHOCPHAN' : 'IDTHOIKHOABIEU';
        var L = K.boLoc(root, ['nam', 'hk', 'dot', 'he', 'khoa', 'csdt', 'bm', 'gv'], ql, function () { taiHai(); });
        root.innerHTML = pat.page('Phân công giảng dạy',
            ui.xoaChon('input[data-da]', { attr: { 'data-a': 'xoa' } }) +
            ui.btn('save', { text: 'Phân công BM khác', mod: 'out-primary', icon: 'fa-sitemap', attr: { 'data-a': 'bmkhac' } }) +
            ui.btn('save', { text: 'Toàn bộ phân giảng', mod: 'out-primary', icon: 'fa-chalkboard-user', attr: { 'data-a': 'toanbo' } }) +
            ui.btn('save', { text: 'Phân công', icon: 'fa-calendar-check', attr: { 'data-a': 'phancong' } })) +
            L.html({ searchText: 'Danh sách' }) +
            '<div class="kl-2cot">' +
            pat.panel({ title: 'Danh sách đã phân công', icon: 'fa-user-check', flush: true, count: 'demDa', zone: 'da' }) +
            pat.panel({ title: 'Danh sách chưa phân công', icon: 'fa-user-clock', flush: true, count: 'demChua', zone: 'chua' }) + '</div>';
        L.gan();
        var v = L.v;
        var da = [], chua = [];
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

        function lop(r) {
            if (!ql) return esc(e(r.TENLOP));
            return '<span class="kl-do">' + esc(e(r.TENKHOA) + '_' + e(r.MAHOCPHAN) + '_') + '</span>' + esc(e(r.TENLOP)) +
                (Number(r.LALOPTACH) > 1 ? '<span class="kl-do">_Lớp tách</span>' : '');
        }
        function ck(tag, i) { return '<input type="checkbox" data-' + tag + '="' + i + '">'; }
        function all(tag) { return { head: '<input type="checkbox" data-all="' + tag + '" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (r, i) { return ck(tag, i); } }; }
        function colsDa(tag, bmKhac) {
            var c = [{ title: 'Lớp học phần', render: lop },
                { title: 'Số TC', cls: 'is-center', render: function (r) { return esc(e(ql ? r.HOCTRINH : r.DVHT)); } },
                { title: 'Học kỳ', prop: 'HOCKY', cls: 'is-nowrap' }];
            if (!(bmKhac && !ql)) c.push({ title: 'Đợt', prop: 'DOTHOC', cls: 'is-center' });
            c.push({ title: 'Sỹ số', prop: 'SOSINHVIEN', cls: 'is-center' },
                { title: 'Số tiết', cls: 'is-center', render: function (r) { return esc(e(ql ? r.TONGTIETCTDT : r.TONGTIETPHANBO)); } },
                { title: 'Kiểu lớp', render: function (r) { return esc(e(ql ? r.TENHINHTHUCHOC : r.LOAILOPHOCPHAN)); } },
                { title: 'Giảng viên', render: function (r) { return esc(e(ql ? r.HOTENMASO : r.HOTEN)); } });
            if (!ql) c.push({ title: 'Mã Giảng viên', prop: 'MACONGCHUC', cls: 'is-nowrap' });
            if (bmKhac && ql) c.push({ title: 'Bộ môn', prop: 'TENBOMONPHANGIANG' });
            c.push(all(tag));
            return c;
        }
        function colsChua() {
            return [{ title: 'Lớp học phần', render: function (r) {
                return ql ? '<span class="kl-do">' + esc(e(r.TENKHOA) + '_' + e(r.MAHOCPHAN) + '_') + '</span>' + esc(e(r.TENLOP))
                    : esc(e(r.TENLOP)) + (Number(r.DATACH) > 0 ? ' <span class="kl-do">Đã tách</span>' : '');
            } },
            { title: 'Số TC', cls: 'is-center', render: function (r) { return esc(e(ql ? r.HOCTRINH : r.DVHT)); } },
            { title: 'Sỹ số', prop: 'SOSINHVIEN', cls: 'is-center' },
            { title: 'Số tiết', cls: 'is-center', render: function (r) { return esc(e(ql ? r.TONGTIETCTDT : r.TONGTIETPHANBO)); } },
            { title: 'Kiểu lớp', render: function (r) { return esc(e(ql ? r.TENHINHTHUCHOC : r.LOAILOPHOCPHAN)); } },
            all('ch')];
        }
        /** Tham số lọc chung của mọi danh sách */
        function loc(o) {
            var p = { strHocKy: L.hocKy(), strHeDaoTaoId: v('he'), strCoSoDaoTaoId: v('csdt') };
            if (ql) { p.strDotHocId = v('dot'); p.strKhoaHocId = v('khoa'); p.strNguoiThucHienId = K.uid(); }
            else { p.strDotHoc = v('dot'); p.strAyId = v('khoa'); p.strNguoiDung_Id = K.uid(); }
            return Object.assign(p, o);
        }
        function dangTai(el) { el.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>'; }
        function taiDa() {
            dangTai(z('da'));
            return K.g(ctl + 'GetDanhSachPhanCong', loc({ strBoMonId: v('bm'), strStaffId: v('gv') })).then(function (r) {
                da = K.arr(r.data); z('demDa').textContent = '(' + da.length + ')';
                ui.table({ el: z('da'), rows: da, columns: colsDa('da'), empty: 'Chưa có lớp đã phân công' });
            }).catch(function (err) { z('da').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đã phân công'); });
        }
        function taiChua() {
            dangTai(z('chua'));
            return K.g(ctl + (ql ? 'GetDanhSachChuaPhanCong' : 'GetDanhSachLopHocPhan'), loc({ strBoMonId: v('bm') })).then(function (r) {
                chua = K.arr(r.data); z('demChua').textContent = '(' + chua.length + ')';
                ui.table({ el: z('chua'), rows: chua, columns: colsChua(), empty: 'Không có lớp chưa phân công' });
            }).catch(function (err) { z('chua').innerHTML = ui.fail(err.message); ums.api.handle(err, 'chưa phân công'); });
        }
        function taiHai() {
            if (!v('nam')) {
                z('da').innerHTML = ui.empty('Chọn năm học', 'fa-filter'); z('chua').innerHTML = ui.empty('Chọn năm học', 'fa-filter');
                z('demDa').textContent = ''; z('demChua').textContent = ''; da = []; chua = [];
                return Promise.resolve();
            }
            return Promise.all([taiDa(), taiChua()]).then(function () { if (hopBM) hopBM.tai(); });
        }
        function chon(host, tag, rows) {
            return Array.prototype.slice.call(host.querySelectorAll('[data-' + tag + ']:checked')).map(function (x) { return rows[Number(x.getAttribute('data-' + tag))]; });
        }
        function ids(list, k) { return list.map(function (r) { return e(r[k]); }).join(','); }

        /* ---------- Phân công / Xoá ---------- */
        function phanCong(gvId, thieuGV) {
            var c = chon(z('chua'), 'ch', chua);
            if (!c.length) { ui.toast(thieuGV ? 'Bạn chưa chọn lớp cần phân công?' : 'Vui lòng chọn lớp cần phân công?', 'warn'); return; }
            if (!gvId) { ui.toast('Bạn chưa chọn giảng viên cần phân công ?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn phân công giảng dạy? (' + c.length + ' lớp)', { ok: 'Phân công' }).then(function (yes) {
                if (!yes) return;
                var p = { strStaffId: gvId, strNamHoc: v('nam'), strHocKy: L.hocKy() };
                if (ql) { p.strDotHocId = v('dot'); p.strLopHocPhanIds = ids(c, KHOA_CHUA); p.strNguoiThucHienId = K.uid(); }
                else { p.strDotHoc = v('dot'); p.strThoiKhoaBieuId = ids(c, KHOA_CHUA); p.strNguoiDung_Id = K.uid(); }
                K.g(ctl + 'PhanCongGiangDay', p).then(function () { ui.toast('Thực hiện thành công', 'ok'); taiHai(); })
                    .catch(function (err) { ums.api.handle(err, 'phân công'); });
            });
        }
        function xoa(host, tag, rows) {
            var c = chon(host, tag, rows);
            if (!c.length) { ui.toast('Vui lòng chọn lớp cần xóa phân công?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa phân công giảng dạy? (' + c.length + ' lớp)', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                var p = ql ? { strKhoiLuongThoiKhoaBieuId: ids(c, 'KHOILUONGTHOIKHOABIEUID'), strNamHoc: ids(c, 'NAMHOC'), strHocKy: ids(c, 'HOCKYFULL'),
                        strDotHocId: ids(c, 'DAOTAO_THOIGIANDAOTAO_ID'), strLopHocPhanId: ids(c, 'IDLOPHOCPHAN'), strStaffId: ids(c, 'STAFFID'), strNguoiThucHienId: K.uid() }
                    : { strNamHoc: v('nam'), strHocKy: L.hocKy(), strDotHoc: v('dot'), strPhanCongTinChiId: ids(c, KHOA_DA), strNguoiDung_Id: K.uid() };
                K.g(ctl + 'DeletePhanCongGiangDay', p).then(function () { ui.toast('Thực hiện thành công', 'ok'); taiHai(); })
                    .catch(function (err) { ums.api.handle(err, 'xoá phân công'); });
            });
        }

        /* ---------- Hộp "Thực hiện phân giảng" (bộ môn khác) ---------- */
        var hopBM = null;
        function moBMKhac() {
            if (!v('nam')) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
            if (!ql && !chon(z('chua'), 'ch', chua).length) { ui.toast('Vui lòng chọn lớp cần phân công?', 'warn'); return; }
            var ds = [];
            var dlg = ui.dialog({ title: 'Thực hiện phân giảng', icon: 'fa-sitemap', size: 'xl', onClose: function () { hopBM = null; }, body:
                '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-b="bm" data-ph="Chọn bộ môn"><option value="">Chọn bộ môn</option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-b="gv" data-ph="Chọn giảng viên"><option value="">Chọn giảng viên</option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Phân công', attr: { 'data-b': 'pc' } }) + '</div></div>' +
                '<div class="ums-legend ums-legend--cach">Danh sách lớp học phần</div><div data-b="bang"></div>',
                xoa: { chon: 'input[data-bk]', onClick: function () { xoa(f('bang'), 'bk', ds); } } });
            var B = dlg.body;
            function f(k) { return B.querySelector('[data-b="' + k + '"]'); }
            ui.enhance(B);
            K.g(ctl + (ql ? 'GetNhomMonHoc' : 'GetToanBoBoMon'), { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNamHoc: v('nam'), silent: true })
                .then(function (r) { pat.fill(f('bm'), K.arr(r.data), { id: 'ID', name: 'NAME', head: 'Chọn bộ môn' }); }).catch(function (err) { ums.api.handle(err, 'bộ môn'); });
            function napGV() {
                if (!f('bm').value) return Promise.resolve();
                return (ql ? K.g(ctl + 'GetDanhSachCanBoNienHoc', { strNhomMonHocId: f('bm').value, strChucNang_Id: K.chucNang(), strNguoiThucHienId: K.uid(), silent: true })
                    : K.g(ctl + 'GetListStaff', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNhomMonHocId: f('bm').value, silent: true }))
                    .then(function (r) { pat.fill(f('gv'), K.arr(r.data), ql ? { id: 'STAFFID', name: 'HOTENMASO', head: 'Chọn giảng viên' } : { id: 'NHANVIENID', name: 'HOTEN', head: 'Chọn giảng viên' }); })
                    .catch(function (err) { ums.api.handle(err, 'giảng viên'); });
            }
            function tai() {
                var host = f('bang');
                dangTai(host);
                var p = ql ? loc({ strBoMonId: v('bm'), strBoMonKhacId: f('bm').value, strStaffId: f('gv').value })
                    : loc({ strBoMonId: f('bm').value, strStaffId: f('gv').value, strBoMonGocId: v('bm') });
                return K.g(ctl + 'GetDanhSachPhanCongBMKhac', p).then(function (r) {
                    ds = K.arr(r.data);
                    ui.table({ el: host, rows: ds, columns: colsDa('bk', true), empty: 'Chưa có lớp phân cho bộ môn khác' });
                }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phân công bộ môn khác'); });
            }
            pat.chain([f('bm'), f('gv')], { phatLai: false });
            jQuery(f('bm')).on('select2:select select2:clear', function () { napGV().then(tai); });
            jQuery(f('gv')).on('select2:select select2:clear', tai);
            B.addEventListener('click', function (ev) {
                var a = ev.target.closest('[data-all="bk"]');
                if (a) { B.querySelectorAll('[data-bk]').forEach(function (x) { x.checked = a.checked; }); return; }
                if (ev.target.closest('[data-b="pc"]')) phanCong(f('gv').value, true);
            });
            hopBM = { tai: tai };
            tai();
        }

        /* ---------- Hộp "Danh sách phân công" (toàn bộ) ---------- */
        function toanBo() {
            if (!v('nam')) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
            if (!v('bm')) { ui.toast('Bạn chưa chọn bộ môn', 'warn'); return; }
            var dlg = ui.dialog({ title: 'Danh sách phân công', icon: 'fa-chalkboard-user', size: 'xl', body: '<div data-t="bang"></div>' });
            var host = dlg.body.querySelector('[data-t="bang"]');
            dangTai(host);
            var p = ql ? loc({ strBoMonId: v('bm'), strBoMonKhacId: '', strStaffId: '' }) : loc({ strBoMonId: v('bm'), strStaffId: v('gv') });
            K.g(ctl + 'GetDanhSachCacMonHocDaPCCuaBM', p).then(function (r) {
                ui.table({ el: host, rows: K.arr(r.data), empty: 'Không có dữ liệu', columns: [
                    { title: 'Hệ', render: function (x) { return esc(e(ql ? x.TENHEDAOTAO : x.MAHEDAOTAO)); } },
                    { title: 'Lớp học phần', render: lop },
                    { title: 'Số TC', cls: 'is-center', render: function (x) { return esc(e(ql ? x.HOCTRINH : x.DVHT)); } },
                    ql ? { title: 'Học kỳ, đợt', prop: 'HOCKYDOTHOCFULL' } : { title: 'Học kỳ', prop: 'HOCKY' }
                ].concat(ql ? [] : [{ title: 'Đợt học', prop: 'DOTHOC', cls: 'is-center' }]).concat([
                    { title: 'Sỹ số', prop: 'SOSINHVIEN', cls: 'is-center' },
                    { title: 'Số tiết', cls: 'is-center', render: function (x) { return esc(e(ql ? x.TONGTIETCTDT : x.TONGTIETPHANBO)); } },
                    { title: 'Kiểu lớp', render: function (x) { return esc(e(ql ? x.TENHINHTHUCHOC : x.LOAILOPHOCPHAN)); } },
                    { title: 'Giảng viên', render: function (x) {
                        var t = e(ql ? x.HOTENMASO : x.HOTEN);
                        return t ? esc(t) : (!ql && Number(x.DATACH) > 0 ? '<span class="kl-do">Đã tách</span>' : '');
                    } }
                ]).concat(ql ? [] : [{ title: 'Mã Giảng viên', prop: 'MACONGCHUC', cls: 'is-nowrap' }]).concat([
                    { title: 'Bộ môn', render: function (x) { return esc(e(ql ? x.TENBOMONPHANGIANG : x.BOMON)); } }]) });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'toàn bộ phân công'); });
        }

        root.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-all]');
            if (a && root.contains(a)) { var t = a.getAttribute('data-all'); root.querySelectorAll('[data-' + t + ']').forEach(function (x) { if (x !== a) x.checked = a.checked; }); return; }
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            var k = b.getAttribute('data-a');
            if (k === 'search') taiHai();
            else if (k === 'phancong') phanCong(v('gv'));
            else if (k === 'xoa') xoa(z('da'), 'da', da);
            else if (k === 'bmkhac') moBMKhac();
            else if (k === 'toanbo') toanBo();
        });
        taiHai();
    };
})();
