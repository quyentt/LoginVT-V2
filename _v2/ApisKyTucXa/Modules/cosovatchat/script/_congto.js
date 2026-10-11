/* =========================================================================
   Công tơ điện / Công tơ nước — MỘT bản dựng cho hai màn (ums.ktxCongTo)
   Bản gốc: ApisKyTucXa/Modules/cosovatchat/script/congtodien.js (470 dòng)
            ApisKyTucXa/Modules/cosovatchat/script/congtonuoc.js (470 dòng)
            — hai tệp chép nhau từng dòng, chỉ khác tên controller, biểu tượng và chữ.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá) — <C> = KTX_CongToDien | KTX_CongToNuoc:
       <C>/LayDanhSach   GET   strTuKhoa, strHangSanXuat_Id, pageIndex 1, pageSize 100000
       <C>/ThemMoi       POST  strId "", strTen, strMa, strNamSanXuat, strHangSanXuat_Id, strMoTa
       <C>/CapNhat       POST  strId + như trên
       <C>/Xoa           POST  strIds
       Danh mục hãng sản xuất: TS.HSX0 (constant.setting.CATOR.TS.HSX0)
   Bố cục bản gốc (ktx-ui.css, 2026-08): MỘT cột — đầu khung "Công tơ … · N công tơ" + nút Thêm,
   thân là LƯỚI THẺ, mỗi thẻ: biểu tượng, tên, mã, Năm sản xuất, Hãng sản xuất, mô tả, nút Xóa / Chỉnh sửa.
   Thêm / sửa: bản gốc bật modal → ở đây biểu mẫu trong trang (ums.pat.formTrang, luật 2026-09-30).

   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Sửa: bản gốc KHÔNG đổ ô "Tên công tơ" (viewEdit thiếu txtCongToDien_Ten) → bấm Lưu là tên
       bị ghi rỗng. Ở đây đổ đủ TEN.
     · Bắt buộc Tên + Mã: bản gốc khai arrvalid_DapAn (chữ thường) nhưng kiểm bằng arrValid_DapAn
       (chữ hoa) và id ô cũng viết thường → không kiểm gì. Làm theo ý định khai.
     · Xoá: bản gốc gắn thêm một trình xử lý #btnYes mỗi lần bấm (bấm lần ba xoá ba lần) → ui.confirm.
   Cố ý bỏ: genTable_CongToDien / genCombo_CongToDien (bảng và ô chọn không có trong HTML — mã chết);
     nút #btnAddNew, #notify_cn, #btnNotifyModal (không có trên màn).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, K = ums.ktx;

    var CAU = {
        dien: { root: 'ktx-congtodien', ctrl: 'KTX_CongToDien', ten: 'Công tơ điện', icon: 'fa-bolt', thuong: 'công tơ điện' },
        nuoc: { root: 'ktx-congtonuoc', ctrl: 'KTX_CongToNuoc', ten: 'Công tơ nước', icon: 'fa-droplet', thuong: 'công tơ nước' }
    };

    ums.ktxCongTo = function (loai) {
        var C = CAU[loai];
        var root = document.getElementById(C.root);
        if (!root) return null;
        var st = { rows: [] };
        var e = K.e;

        root.innerHTML =
            pat.page(C.ten, ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } }) + ui.btn('reload', { attr: { 'data-a': 'tai' } })) +
            '<div data-z="man">' + pat.panel({ title: 'Danh sách ' + C.thuong, icon: C.icon, count: 'tong', zone: 'ds' }) + '</div>';
        var zMan = root.querySelector('[data-z="man"]');
        var zDs = root.querySelector('[data-z="ds"]');
        var zTong = root.querySelector('[data-z="tong"]');

        function tai() {
            zDs.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({
                action: C.ctrl + '/LayDanhSach', method: 'GET',
                strTuKhoa: '', strNguoiThucHien_Id: '', strHangSanXuat_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                st.rows = K.rows(r);
                ve();
            }).catch(function (err) {
                zDs.innerHTML = ui.fail(err.message, 'data-a="tai"');
                ums.api.handle(err, 'danh sách ' + C.thuong);
            });
        }

        function ve() {
            zTong.textContent = st.rows.length + ' công tơ';
            pat.cards({
                el: zDs, items: st.rows, cls: 'ktx-ct',
                empty: 'Chưa có ' + C.thuong + ' nào', emptyIcon: C.icon,
                render: function (it) {
                    var ten = e(it.TEN), ma = e(it.MA);
                    var tieuDe = ten ? ui.esc(ten) : (ma ? ui.esc(ma) : '<span class="ums-u-faint">Chưa đặt tên</span>');
                    var h = '<div class="ktx-ct__head"><span class="ktx-ct__ico"><i class="fa-light ' + C.icon + '"></i></span>' +
                        '<div class="ktx-ct__name"><div class="ktx-ct__title">' + tieuDe + '</div>' +
                        (ten && ma && ma !== ten ? '<div class="ktx-ct__code">Mã: ' + ui.esc(ma) + '</div>' : '') + '</div></div>';
                    h += '<div class="ums-card__row"><span>Năm sản xuất</span><b>' + (e(it.NAMSANXUAT) !== '' ? ui.esc(it.NAMSANXUAT) : '—') + '</b></div>';
                    h += '<div class="ums-card__row"><span>Hãng sản xuất</span><b>' + (e(it.HANGSANXUAT) !== '' ? ui.esc(it.HANGSANXUAT) : '—') + '</b></div>';
                    if (e(it.MOTA) !== '') h += '<div class="ktx-ct__desc">' + ui.esc(it.MOTA) + '</div>';
                    return h;
                },
                actions: function (it) {
                    return ui.btn('del', { text: 'Xóa', cls: 'ums-btn--sm', attr: { 'data-a': 'xoa', 'data-id': it.ID } }) +
                        ui.btn('edit', { text: 'Chỉnh sửa', cls: 'ums-btn--sm', attr: { 'data-a': 'sua', 'data-id': it.ID } });
                }
            });
        }

        /* ---------- Biểu mẫu thêm / sửa (trong trang) ---------- */
        function moForm(row) {
            var f = pat.formTrang({
                host: zMan,
                title: (row ? 'Chỉnh sửa ' : 'Thêm mới ') + C.thuong,
                icon: row ? 'fa-pen-to-square' : 'fa-plus',
                body:
                    ui.field('Tên công tơ', '<input class="ums-input" data-f="ten" placeholder="Nhập tên công tơ" autocomplete="off">', { required: true }) +
                    ui.field('Mã công tơ', '<input class="ums-input" data-f="ma" placeholder="Nhập mã công tơ" autocomplete="off">', { required: true }) +
                    ui.field('Năm sản xuất', '<input class="ums-input" data-f="nam" placeholder="Ví dụ: 2024" autocomplete="off">') +
                    ui.field('Hãng sản xuất', '<select class="ums-select" data-f="hsx" data-ph="Chọn hãng sản xuất"><option value="">Chọn hãng sản xuất</option></select>') +
                    '<div style="grid-column:1 / -1">' + ui.field('Mô tả chi tiết', '<textarea class="ums-textarea" data-f="mota" rows="2" placeholder="Nhập nội dung mô tả"></textarea>') + '</div>',
                buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function (api) { luu(api, row); return false; } }]
            });
            function o(k) { return f.body.querySelector('[data-f="' + k + '"]'); }
            ums.api.dm('TS.HSX0').then(function (rs) {
                pat.fill(o('hsx'), rs, { name: 'TEN' });
                if (row) { o('hsx').value = e(row.HANGSANXUAT_ID); if (window.jQuery) jQuery(o('hsx')).trigger('change.select2'); }
            });
            if (row) {
                o('ten').value = e(row.TEN);
                o('ma').value = e(row.MA);
                o('nam').value = e(row.NAMSANXUAT);
                o('mota').value = e(row.MOTA);
            }
            o('ten').focus();

            function luu(api, row) {
                var v = { ten: o('ten').value.trim(), ma: o('ma').value.trim(), nam: o('nam').value.trim(), hsx: o('hsx').value || '', mota: o('mota').value.trim() };
                if (!v.ten) { ui.toast('Chưa nhập tên công tơ', 'warn'); o('ten').focus(); return; }
                if (!v.ma) { ui.toast('Chưa nhập mã công tơ', 'warn'); o('ma').focus(); return; }
                ums.api.call({
                    action: C.ctrl + (row ? '/CapNhat' : '/ThemMoi'), method: 'POST',
                    strId: row ? row.ID : '',
                    strTen: v.ten, strMa: v.ma, strNamSanXuat: v.nam, strHangSanXuat_Id: v.hsx, strMoTa: v.mota
                }).then(function () {
                    ui.toast(row ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                    api.close();
                    tai();
                }).catch(function (err) { ums.api.handle(err, (row ? 'cập nhật ' : 'thêm ') + C.thuong); });
            }
        }

        function xoa(row) {
            ui.confirm('Xoá ' + C.thuong + ' "' + (e(row.TEN) || e(row.MA)) + '"?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' })
                .then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: C.ctrl + '/Xoa', method: 'POST', strIds: row.ID }).then(function () {
                        ui.toast('Xóa thành công!', 'ok');
                        tai();
                    });
                }).catch(function (err) { ums.api.handle(err, 'xoá ' + C.thuong); });
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !root.contains(b)) return;
            var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
            var row = id ? st.rows.filter(function (r) { return r.ID === id; })[0] : null;
            if (a === 'tai') tai();
            else if (a === 'them') moForm(null);
            else if (a === 'sua' && row) moForm(row);
            else if (a === 'xoa' && row) xoa(row);
        });

        tai();
        return { tai: tai };
    };

    if (document.getElementById('ktx-congtodien')) ums.ktxCongTo('dien');
    if (document.getElementById('ktx-congtonuoc')) ums.ktxCongTo('nuoc');
})();
