/* =========================================================================
   Biến động — giá trị từ khoá lương (thành phần biến động) của từng cán bộ theo tháng
   Bản gốc: ApisNhanSu/Modules/luong/script/biendong.js
   Một cột như gốc: thanh lọc + khung "Danh sách" (lưới cán bộ × từ khoá, sửa trong ô rồi
   "Lưu"); "Thêm mới" = biểu mẫu một giá trị (thay chỗ danh sách — gốc là hộp thoại);
   "Kế thừa" = hộp thoại năm/tháng nguồn → đích (việc phụ, như gốc).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên; strNguoiTao_Id gốc đọc dropAAAA → ''):
     L_TuKhoa_GiaTri/LayDSNhanSu_L_TuKhoa   GET  strTuKhoa, strLoaiBangLuong_Id, strNhanSu_HoSoCanBo_Id,
                                                 strDaoTao_CoCauToChuc_Id, strNam, strThang, strNguoiTao_Id, 1/100000
                                                 → các cột từ khoá (TUKHOA, TENTUKHOA)
     L_TuKhoa_GiaTri/LayDanhSach            GET  cùng tham số → dòng (cán bộ + NGAYAPDUNG)
     L_TuKhoa_GiaTri/LayGiaTriNhanSu_L_TuKhoa GET versionAPI v1.0 — MỖI Ô một lời gọi: strTuKhoa,
                                                 strLoaiBangLuong_Id, strNhanSu_HoSoCanBo_Id, strNam, strThang, strNgayApDung
                                                 → TUKHOA_GIATRI, ID (bản ghi của ô)
     L_TuKhoa_GiaTri/ThemMoi | CapNhat      POST ô đổi có giá trị: strId (ID ô, rỗng = ThemMoi), strTuKhoa,
                                                 strLoaiBangLuong_Id, strNhanSu_HoSoCanBo_Id, strNam, strThang,
                                                 strMoTa '', strTuKhoa_GiaTri, strNgayApDung, strGhiChu '', strNguoiThucHien_Id
     L_TuKhoa_GiaTri/Xoa                    ô đổi thành rỗng: strIds (ID ô)
     L_TuKhoa_GiaTri/KeThua                 POST strLoaiBangLuong_Id, strNhanSu_HoSoCanBo_Id, strDaoTao_CoCauToChuc_Id,
                                                 strNam_Nguon, strThang_Nguon, strNam_Dich, strThang_Dich
     NS_HoSoV2/LayDanhSach                  GET  thành viên theo đơn vị (dLaCanBoNgoaiTruong -1) — ô lọc và ô Cán bộ
   "Thêm mới": ô Thành phần = LayDSNhanSu_L_TuKhoa với mọi tham số rỗng (gốc đọc các ô *1/*11 không
   có trên màn); lưu ThemMoi với Năm/Tháng/Ngày áp dụng/Giá trị của biểu mẫu.
   "Xuất báo cáo" / Import: ums.report — gốc gửi các khoá đọc ô KHÔNG có trên màn này (chép từ màn
   Tài chính) → giữ khoá, giá trị rỗng như gốc.
   Khác gốc:
     · Đơn vị → Thành viên (lọc) và Đơn vị → Cán bộ (Thêm mới): khoá con khi chưa chọn cha, chọn/xoá
       cha thì xoá trắng con (luật chung).
     · Lấy giá trị ô: tối đa 6 lời gọi cùng lúc (gốc bắn N×M lời gọi một lượt).
     · "Lưu" hỏi lại "lưu N và hủy M" như gốc, chạy tuần tự có tiến độ, xong nạp lại lưới.
     · Thêm mới lưu xong đóng biểu mẫu và nạp lại lưới (gốc ở lại hộp, không nạp lại).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, A = ums.luongA;
    var root = document.getElementById('biendong');
    if (!root) return;
    var e = A.e, arr = A.arr, uid = A.uid;
    function esc(s) { return ui.esc(s); }
    var C = 'L_TuKhoa_GiaTri';
    var tuKhoa = [], dong = [], daXem = false;

    root.innerHTML =
        '<div data-z="ds">' +
        pat.page('Biến động', '<span data-z="report"></span>') +
        pat.filterBar([
            { key: 'loai', label: 'Chọn bảng lương', type: 'select' },
            { key: 'dv', label: 'Chọn đơn vị', type: 'select' },
            { key: 'tv', label: 'Chọn thành viên', type: 'select' },
            { key: 'nam', label: 'Năm tìm kiếm' },
            { key: 'thang', label: 'Tháng tìm kiếm' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', flush: true, zone: 'bang', count: 'dem',
            tools: ui.btn('confirm', { text: 'Kế thừa', icon: 'fa-paper-plane', mod: 'out-warn', attr: { 'data-a': 'kethua' } }) +
                ui.btn('save', { attr: { 'data-a': 'luu' } }) + ui.btn('add', { attr: { 'data-a': 'them' } }),
            body: ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-hand-pointer') }) +
        '</div>' +
        '<div data-z="bdform" hidden>' +
        pat.panel({ title: 'Biến động', icon: 'fa-pen-to-square',
            tools: ui.btn('close', { attr: { 'data-a': 'dongForm' } }) + ui.btn('save', { attr: { 'data-a': 'luuForm' } }),
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Đơn vị', '<select class="ums-select" data-scope="form" data-k="donVi" data-ph="Chọn đơn vị"><option value=""></option></select>') +
                ui.field('Cán bộ', '<select class="ums-select" data-scope="form" data-k="strNhanSu_HoSoCanBo_Id" data-ph="Chọn thành viên"><option value=""></option></select>') +
                ui.field('Năm', '<input class="ums-input" data-scope="form" data-k="strNam" autocomplete="off">') +
                ui.field('Tháng', '<input class="ums-input" data-scope="form" data-k="strThang" autocomplete="off">') +
                ui.field('Ngày áp dụng', '<div class="ums-inputwrap"><input class="ums-input" data-scope="form" data-type="date" data-date data-k="strNgayApDung" placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>') +
                ui.field('Giá trị', '<input class="ums-input" data-scope="form" data-k="strTuKhoa_GiaTri" autocomplete="off">') +
                ui.field('Thành phần', '<select class="ums-select" data-scope="form" data-k="strTuKhoa" data-ph="Chọn thành phần"><option value=""></option></select>') +
                '</div>' }) +
        '</div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function k(n) { return root.querySelector('[data-k="' + n + '"]'); }
    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
    function loc() {
        return { loai: f('loai').value, dv: f('dv').value, tv: f('tv').value, nam: f('nam').value.trim(), thang: f('thang').value.trim(), q: f('q').value.trim() };
    }

    ums.api.dm('NHANSU.LOAIBANGLUONG').then(function (r) { pat.fill(f('loai'), r, { head: 'Chọn bảng lương' }); }).catch(function () {});
    A.coCau([f('dv'), k('donVi')], 'Chọn đơn vị');
    if (window.jQuery) {
        jQuery(f('dv')).on('select2:select select2:clear', function () {
            if (f('dv').value) A.thanhVien(f('tv'), f('dv').value, -1, 'Chọn thành viên'); else pat.fill(f('tv'), [], { head: 'Chọn thành viên' });
        });
        jQuery(k('donVi')).on('select2:select select2:clear', function () {
            if (k('donVi').value) A.thanhVien(k('strNhanSu_HoSoCanBo_Id'), k('donVi').value, -1, 'Chọn thành viên');
            else pat.fill(k('strNhanSu_HoSoCanBo_Id'), [], { head: 'Chọn thành viên' });
        });
        pat.chain([f('dv'), f('tv')], { phatLai: false });
        pat.chain([k('donVi'), k('strNhanSu_HoSoCanBo_Id')], { phatLai: false });
    }
    // Ô Thành phần của "Thêm mới" (getList_TuKhoa2 — mọi tham số đọc ô không có → rỗng)
    ums.api.call({ action: C + '/LayDSNhanSu_L_TuKhoa', method: 'GET', strTuKhoa: '', strLoaiBangLuong_Id: '', strNhanSu_HoSoCanBo_Id: '',
        strDaoTao_CoCauToChuc_Id: '', strNam: '', strThang: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) { pat.fill(k('strTuKhoa'), arr(r.data), { id: 'TUKHOA', name: 'TENTUKHOA', head: 'Chọn thành phần' }); })
        .catch(function (err) { ums.api.handle(err, 'danh sách thành phần'); });

    function thamSo(x) {
        return { method: 'GET', strTuKhoa: x.q, strLoaiBangLuong_Id: x.loai, strNhanSu_HoSoCanBo_Id: x.tv, strDaoTao_CoCauToChuc_Id: x.dv,
            strNam: x.nam, strThang: x.thang, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
    }
    function tim() {
        var x = loc();
        daXem = true;
        z('bang').innerHTML = A.dangTai();
        var c1 = thamSo(x); c1.action = C + '/LayDSNhanSu_L_TuKhoa';
        ums.api.call(c1).then(function (r) {
            tuKhoa = arr(r.data);
            var c2 = thamSo(x); c2.action = C + '/LayDanhSach';
            return ums.api.call(c2);
        }).then(function (r) {
            dong = arr(r.data);
            ve(x);
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'biến động'); });
    }
    function ve(x) {
        z('dem').textContent = '(' + dong.length + ')';
        var cols = [
            { title: 'Mã số', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
            { title: 'Họ tên', cls: 'is-center', render: function (r) { return esc(e(r.NHANSU_HOSOCANBO_HODEM) + ' ' + e(r.NHANSU_HOSOCANBO_TEN)); } },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center' }
        ].concat(tuKhoa.map(function (t) {
            return { title: e(t.TENTUKHOA), cls: 'is-center', width: '120px', render: function (r, i) {
                return '<input class="ums-input ums-input--sm lga-o" data-o="' + i + '" data-tk="' + esc(t.TUKHOA) + '" value="" title="" autocomplete="off" disabled>';
            } };
        }));
        ui.table({ el: z('bang'), columns: cols, rows: dong, empty: 'Không có dữ liệu', tableCls: 'ums-table--lined ums-table--tight' });
        // Giá trị từng ô — mỗi ô một lời gọi (như gốc), tối đa 6 luồng
        var viec = [];
        dong.forEach(function (r, i) {
            tuKhoa.forEach(function (t) {
                viec.push(function () {
                    return ums.api.call({ action: C + '/LayGiaTriNhanSu_L_TuKhoa', method: 'GET', versionAPI: 'v1.0', silent: true,
                        strTuKhoa: t.TUKHOA, strLoaiBangLuong_Id: x.loai, strNhanSu_HoSoCanBo_Id: r.NHANSU_HOSOCANBO_ID,
                        strNam: x.nam, strThang: x.thang, strNgayApDung: r.NGAYAPDUNG
                    }).then(function (kq) {
                        arr(kq.data).forEach(function (d) {
                            var o = z('bang').querySelector('[data-o="' + i + '"][data-tk="' + (window.CSS && CSS.escape ? CSS.escape(e(d.TUKHOA)) : e(d.TUKHOA)) + '"]');
                            if (!o) return;
                            o.value = e(d.TUKHOA_GIATRI);
                            o.setAttribute('title', e(d.TUKHOA_GIATRI));
                            o.setAttribute('data-id', e(d.ID));
                        });
                    });
                });
            });
        });
        A.hang(viec, 6).then(function () {
            Array.prototype.forEach.call(z('bang').querySelectorAll('[data-o]'), function (o) { o.disabled = false; });
        });
    }
    // ↑ ↓ Enter di chuyển giữa ô cùng cột (edu.system.move_ThroughInTable)
    z('bang').addEventListener('keydown', function (ev) {
        var t = ev.target;
        if (!t.hasAttribute || !t.hasAttribute('data-o')) return;
        var d = ev.key === 'Enter' || ev.key === 'ArrowDown' ? 1 : ev.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        ev.preventDefault();
        var n = z('bang').querySelector('[data-o="' + (Number(t.getAttribute('data-o')) + d) + '"][data-tk="' + t.getAttribute('data-tk') + '"]');
        if (n) { n.focus(); n.select(); }
    });

    function luu() {
        var x = loc(), them = [], xoa = [];
        Array.prototype.forEach.call(z('bang').querySelectorAll('[data-o]'), function (o) {
            if (o.value === (o.getAttribute('title') || '')) return;
            if (o.value) them.push(o); else if (o.getAttribute('data-id')) xoa.push(o.getAttribute('data-id'));
        });
        if (!them.length && !xoa.length) { ui.toast('Không có thay đổi lưu', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu ' + them.length + ' và hủy ' + xoa.length + '?', { ok: 'Lưu', title: 'Lưu biến động' }).then(function (ok) {
            if (!ok) return;
            var calls = xoa.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; })
                .concat(them.map(function (o) {
                    var r = dong[Number(o.getAttribute('data-o'))] || {};
                    var id = o.getAttribute('data-id') || '';
                    return {
                        action: id ? C + '/CapNhat' : C + '/ThemMoi',
                        strId: id,
                        strTuKhoa: o.getAttribute('data-tk'),
                        strLoaiBangLuong_Id: x.loai,
                        strNhanSu_HoSoCanBo_Id: r.NHANSU_HOSOCANBO_ID,
                        strNam: x.nam,
                        strThang: x.thang,
                        strMoTa: '',
                        strTuKhoa_GiaTri: o.value,
                        strNgayApDung: r.NGAYAPDUNG,
                        strGhiChu: '',
                        strNguoiThucHien_Id: uid()
                    };
                }));
            ui.batch(calls, { title: 'Đang lưu biến động' }).then(function () { tim(); });
        });
    }

    function keThua() {
        var x = loc();
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-grid ums-grid--2">' +
            ui.field('Năm nguồn', '<input class="ums-input" data-k2="nn" autocomplete="off">') +
            ui.field('Tháng nguồn', '<input class="ums-input" data-k2="tn" autocomplete="off">') +
            ui.field('Năm đích', '<input class="ums-input" data-k2="nd" autocomplete="off">') +
            ui.field('Tháng đích', '<input class="ums-input" data-k2="td" autocomplete="off">') + '</div>';
        body.querySelector('[data-k2="nn"]').value = x.nam;
        body.querySelector('[data-k2="tn"]').value = x.thang;
        function g(n) { return body.querySelector('[data-k2="' + n + '"]').value.trim(); }
        ui.dialog({
            title: 'Kế thừa', icon: 'fa-paper-plane', size: 'sm', body: body,
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (dlg) {
                ums.api.call({
                    action: C + '/KeThua',
                    strLoaiBangLuong_Id: x.loai, strNhanSu_HoSoCanBo_Id: x.tv, strDaoTao_CoCauToChuc_Id: x.dv,
                    strNam_Nguon: g('nn'), strThang_Nguon: g('tn'), strNam_Dich: g('nd'), strThang_Dich: g('td'),
                    strNguoiThucHien_Id: uid()
                }).then(function () { ui.toast('Thực hiện thành công', 'ok'); dlg.close(); })
                    .catch(function (err) { ums.api.handle(err, 'kế thừa biến động'); });
                return false;
            } }]
        });
    }

    function moForm() {
        ['donVi', 'strNhanSu_HoSoCanBo_Id', 'strNam', 'strThang', 'strNgayApDung', 'strTuKhoa_GiaTri', 'strTuKhoa'].forEach(function (n) {
            var el = k(n); el.value = '';
            if (el._flatpickr) el._flatpickr.clear();
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh');
        });
        ui.swap(z('ds'), z('bdform'));
    }
    function luuForm() {
        var x = loc();
        ums.api.call({
            action: C + '/ThemMoi',
            strId: '',
            strTuKhoa: k('strTuKhoa').value,
            strLoaiBangLuong_Id: x.loai,
            strNhanSu_HoSoCanBo_Id: k('strNhanSu_HoSoCanBo_Id').value,
            strNam: k('strNam').value.trim(),
            strThang: k('strThang').value.trim(),
            strMoTa: '',
            strTuKhoa_GiaTri: k('strTuKhoa_GiaTri').value.trim(),
            strNgayApDung: k('strNgayApDung').value.trim(),
            strGhiChu: '',
            strNguoiThucHien_Id: uid()
        }).then(function () {
            ui.toast('Thêm mới thành công!', 'ok');
            ui.swap(z('bdform'), z('ds'));
            if (daXem) tim();
        }).catch(function (err) { ums.api.handle(err, 'thêm biến động'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'luu') luu();
        else if (a === 'kethua') keThua();
        else if (a === 'them') moForm();
        else if (a === 'dongForm') ui.swap(z('bdform'), z('ds'));
        else if (a === 'luuForm') luuForm();
    });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target.matches && ev.target.matches('[data-f]')) { ev.preventDefault(); tim(); }
    });

    ums.report.mount(z('report'), {
        collect: function (add) {
            // Khoá chép nguyên từ gốc — các ô gốc đọc (txtSearch_DT, dropSearch_*) không có trên màn này → rỗng
            ['strTuKhoa', 'strKhoaQuanLy_Id', 'strHeDaoTao_Id', 'strKhoaDaoTao_Id', 'strChuongTrinh_Id', 'strLopQuanLy_Id',
             'strDaoTao_ThoiGianDaoTao_Id', 'strTaiChinh_CacKhoanThu_Id', 'strDoiTuong_Id', 'strCheDoChinhSach_Id'].forEach(function (x) { add(x, ''); });
        },
        onImported: function () { if (daXem) tim(); }
    });
})();
