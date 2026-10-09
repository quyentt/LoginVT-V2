/* =========================================================================
   Tổng hợp khối lượng NCKH (cổng cán bộ) — bảng nhập trực tiếp, lưu từng dòng.
   Bản gốc: ApisCongCanBo/Modules/klgd/html/khoiluongnckh.html + script/khoiluongnckh.js
   ---------------------------------------------------------------------------
   Năm học: TKGG_KLGD/GetcboSchoolYear (NIENHOC) → Bộ môn: TKGG_QLKLGD/LayDS_PhanQuyenNguoiDungDonVi
     { strNamHoc, strNguoiDungId, strChucNang_Id, strNguoiThucHienId } (ID / NAME).
   Danh sách: TKGG_KLGD/GetDanhSachGiangVienNCKHPVSX { strNamHoc, strHocKy '', strBoMonId, strNguoiDung_Id }.
   Cập nhật (mỗi dòng, GET): TKGG_KLGD/CapNhatKhoiLuongNCKH { strStaffId: NHANVIENID, strNamHoc, strSoTietNCKH,
     strSoTietDuocCongThem, strNguoiDungId }.
   Báo cáo / import: mẫu phân quyền của chức năng (getList_MauImport) + strNamHoc.
   Khác bản gốc (ghi ở can-quyet.js):
     · strHocKy gốc đọc ô KHÔNG tồn tại → luôn rỗng; giữ gửi rỗng.
     · Năm học → Bộ môn khoá theo luật cha → con; Cập nhật bắt chọn năm học (gốc gửi được năm rỗng).
     · Một thông báo gộp (gốc bật N hộp "Thực hiện thành công", mỗi dòng một hộp).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd;
    var root = document.getElementById('klgd-khoiluongnckh');
    if (!root) return;
    root.innerHTML = pat.page('Tổng hợp khối lượng NCKH', '<span data-z="bc"></span>') +
        pat.filterBar([{ key: 'nam', type: 'select', label: 'Chọn năm học' }, { key: 'bm', type: 'select', label: 'Chọn bộ môn' }],
            { search: false, extra: '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Cập nhật', attr: { 'data-a': 'luu' } }) + '</div>' }) +
        pat.panel({ title: 'Tổng hợp khối lượng NCKH', icon: 'fa-flask', flush: true, count: 'dem', zone: 'bang' });
    ui.enhance(root);
    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return F(k).value; }

    var B = K.nhapBang({ el: root.querySelector('[data-z="bang"]'), empty: 'Không có giảng viên', cot: [
        { title: 'Bộ môn', prop: 'BOMON' },
        { title: 'Mã giảng viên', prop: 'MAGIANGVIEN', cls: 'is-nowrap' },
        { title: 'Giảng viên', prop: 'HOTEN' },
        { title: 'Số tiết NCKH', width: '160px', render: function (r, i) { return K.o('nckh', i, r.SOTIET, ' inputmode="decimal"'); } },
        { title: 'Số tiết được tính vào KLGD', width: '200px', render: function (r, i) { return K.o('them', i, r.SOTIETDUOCCONGTHEM, ' inputmode="decimal"'); } }] });

    function napBoMon() {
        if (!v('nam')) return;
        K.g('TKGG_QLKLGD/LayDS_PhanQuyenNguoiDungDonVi', { strNamHoc: v('nam'), strNguoiDungId: K.uid(), strChucNang_Id: K.chucNang(),
            strNguoiThucHienId: K.uid(), silent: true }).then(function (r) { pat.fill(F('bm'), K.arr(r.data), { id: 'ID', name: 'NAME', head: 'Chọn bộ môn' }); })
            .catch(function (err) { ums.api.handle(err, 'bộ môn'); });
    }
    function tai() {
        if (!v('nam')) { B.ve([], ui.empty('Chọn năm học để xem danh sách', 'fa-filter')); return; }
        B.dangTai();
        K.g('TKGG_KLGD/GetDanhSachGiangVienNCKHPVSX', { strNamHoc: v('nam'), strHocKy: '', strBoMonId: v('bm'), strNguoiDung_Id: K.uid() }).then(function (r) {
            var d = K.arr(r.data);
            B.ve(d);
            root.querySelector('[data-z="dem"]').textContent = '(' + d.length + ')';
        }).catch(function (err) { B.ve([], ui.fail(err.message)); ums.api.handle(err, 'khối lượng NCKH'); });
    }
    function luu() {
        if (!v('nam')) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
        var rows = B.rows();
        if (!rows.length) { ui.toast('Không có dòng nào để cập nhật', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn cập nhật?', { ok: 'Cập nhật' }).then(function (yes) {
            if (!yes) return;
            B.luu(rows.map(function (r, i) {
                return { action: 'TKGG_KLGD/CapNhatKhoiLuongNCKH', method: 'GET', strStaffId: K.e(r.NHANVIENID), strNamHoc: v('nam'),
                    strSoTietNCKH: B.gt(i, 'nckh'), strSoTietDuocCongThem: B.gt(i, 'them'), strNguoiDungId: K.uid() };
            }), 'Thực hiện thành công');
        });
    }

    ums.report.mount(root.querySelector('[data-z="bc"]'), { collect: function (add) { add('strNamHoc', v('nam')); } });
    root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="luu"]')) luu(); });
    if (window.jQuery) {
        jQuery(F('nam')).on('select2:select select2:clear', function () { napBoMon(); tai(); });
        jQuery(F('bm')).on('select2:select select2:clear', tai);
    }
    pat.chain([F('nam'), F('bm')], { phatLai: false });
    ums.crud.loadSource(K.nam(false)).then(function (d) {
        pat.fill(F('nam'), d, { id: 'NIENHOC', name: 'NIENHOC', head: 'Chọn năm học' });
        if (d.length) { F('nam').value = K.e(d[0].NIENHOC); jQuery(F('nam')).trigger('change.select2'); jQuery(F('nam')).trigger({ type: 'select2:select' }); }
        else tai();
    }).catch(function (err) { ums.api.handle(err, 'năm học'); tai(); });
})();
