/* =========================================================================
   Quản lý thiết bị (Ký túc xá / Cơ sở vật chất) — mọi thiết bị của KTX, lọc theo phòng, chuyển phòng
   Bản gốc: ApisKyTucXa/Modules/cosovatchat/html/quanlythietbi.html + script/quanlythietbi.js (633 dòng)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá):
       KTX_ToaNha/LayDanhSach                    GET   ô lọc toà nhà (ums.ktx.toaNha)
       KTX_Phong/LayDanhSach                     GET   strKTX_ToaNha_Id = toà đang lọc, pageSize 100000 — ô lọc phòng,
                                                       ô "Phòng chuyển đến", dãy "Phòng áp dụng" (ums.ktx.phong)
       KTX_TrangThietBi/LayDanhSach              GET   strTuKhoa, strKTX_Phong_Id, strLoaiTrangThietBi_Id "", strTinhTrangSuDung_Id "",
                                                       pageIndex, pageSize 10 (phân trang máy chủ)
       KTX_TrangThietBi/LayDSChuyenTrangThietBi  GET   strTuKhoa "", strKTX_Phong_Id "", strKTX_TrangThietBi_Id, pageIndex 1, pageSize 1000
                                                       — MỖI dòng một lời gọi (cột "Lịch sử" = tên các phòng đã qua, như gốc)
       KTX_TrangThietBi/ThemMoi                  POST  strId "", strTen, strMa, strKTX_Phong_Id, strLoaiTrangThietBi_Id, strTinhTrangSuDung_Id, strMoTa, dSoLuong
                                                       — MỖI phòng đánh dấu ở "Phòng áp dụng" một lời gọi (ui.batch)
       KTX_TrangThietBi/CapNhat                  POST  strId + như trên
       KTX_TrangThietBi/Xoa                      POST  strIds (mỗi dòng một lời gọi như gốc)
       KTX_TrangThietBi/ChuyenTrangThietBi       POST  strKTX_Phong_Id, strKTX_TrangThietBi_Id, strMoTa — mỗi dòng đánh dấu một lời gọi
       Danh mục: KTX.LTB0 (loại thiết bị), KTX.TTTB (tình trạng; mã KTX.TTTB.01 = nhãn xanh, khác = đỏ)
   Bố cục bản gốc: MỘT cột — khung "Tìm kiếm" (ô toà nhà, ô phòng, ô từ khoá, nút Tìm); khung "Danh sách thiết bị"
   (Stt | Phòng | Mã | Tên | Số lượng | Tình trạng | Lịch sử | Sửa | ô đánh dấu) với ba nút Chuyển phòng / Tạo mới / Xóa;
   thêm / sửa → khung biểu mẫu thay chỗ danh sách (Tên, Mã, Số lượng, Loại, Tình trạng, Mô tả, Phòng áp dụng = dãy ô
   đánh dấu có "Tất cả"); "Chuyển phòng" = hộp thoại (Phòng chuyển đến, Mô tả) cho các dòng đã đánh dấu.
   Ở đây: ums.crud một cột (lọc + bảng + biểu mẫu), "Phòng áp dụng" = ums.pat.checks vào vùng extra, "Chuyển phòng" = nút
   toolbar + ui.dialog (hộp thoại cho thao tác hàng loạt trên dòng đã đánh dấu — đúng luật 30/9).

   Giữ như bản gốc: cột Phòng đọc KTX_PHONG_MA; lịch sử chuyển = tên phòng nối ", "; Thêm cho N phòng = N lời gọi.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Ô từ khoá #txtSearch_TuKhoa có trong HTML nhưng JS không đọc (strTuKhoa luôn "") → ở đây gửi strTuKhoa = ô từ khoá.
     · Bắt buộc Tên, Mã, Số lượng (số nguyên), Loại thiết bị, Tình trạng — gốc chỉ bắt Loại; thống nhất với màn
       "Thiết bị trong phòng" (cùng procedure, cùng bản ghi).
     · Sửa: gốc lặp CapNhat với CÙNG strId cho mỗi phòng đánh dấu (vô nghĩa, dòng chỉ có một phòng) → ở đây sửa là một
       lời gọi, gửi KTX_PHONG_ID của dòng; dãy "Phòng áp dụng" khi sửa chỉ hiện phòng đó (đánh dấu sẵn, không đổi —
       đổi phòng thì dùng Chuyển phòng).
     · Thêm mà chưa đánh dấu phòng nào: gốc lặng lẽ không lưu → ở đây đánh dấu sẵn phòng đang lọc (nếu có), bỏ hết thì báo.
     · Ô lọc phòng khoá tới khi chọn toà nhà (luật cha → con 2026-09-21); "Phòng áp dụng" và "Phòng chuyển đến" lấy phòng
       của toà đang lọc, chưa lọc toà thì mọi phòng (như gốc).
     · Xoá / Chuyển phòng: gốc gắn thêm trình xử lý #btnYes mỗi lần bấm, nạp lại bằng setTimeout → ui.confirm + ui.batch.
   Cố ý bỏ: txtAAAA / dropAAAA (id không có, gửi rỗng), #main-content-wrapper, #btnNotifyModal, #notify, khối
     Select2-trong-modal và <style> cuối tệp (vỏ cũ).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, K = ums.ktx, e = K.e;
    var root = document.getElementById('ktx-quanlythietbi');
    if (!root) return;

    var P = 'KTX_TrangThietBi/';
    var st = { checks: null };

    function toaLoc() { var s = root.querySelector('[data-cf][data-k="toa"]'); return s ? (s.value || '') : ''; }
    /* Mọi phòng của toà đang lọc (gốc: getList_Phong pageSize 100000 theo dropSearch_ToaNha) */
    function phongCuaToa() {
        return K.phong({ strKTX_ToaNha_Id: toaLoc(), pageSize: 100000 }).then(function (kq) { return kq.rows; })
            .catch(function (err) { ums.api.handle(err, 'danh sách phòng'); return []; });
    }
    function thamSo(v, phongId, id) {
        return { action: P + (id ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: id || '',
            strTen: v.strTen, strMa: v.strMa, strKTX_Phong_Id: phongId,
            strLoaiTrangThietBi_Id: v.strLoaiTrangThietBi_Id, strTinhTrangSuDung_Id: v.strTinhTrangSuDung_Id,
            strMoTa: v.strMoTa, dSoLuong: v.dSoLuong };
    }

    var crud = ums.crud({
        root: root, title: 'Quản lý thiết bị', icon: 'fa-screwdriver-wrench', listTitle: 'Danh sách thiết bị',
        formTitle: 'thiết bị', addText: 'Tạo mới', empty: 'Chưa có thiết bị nào',
        toolbar: [{ text: 'Chuyển phòng', icon: 'fa-arrow-right-arrow-left', onClick: chuyenPhong }],
        filters: [
            { key: 'toa', type: 'select', label: 'Chọn tòa nhà' },
            { key: 'phong', type: 'select', label: 'Chọn phòng' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: { paged: true, call: function (f) {
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strKTX_Phong_Id: f.phong || '',
                strLoaiTrangThietBi_Id: '', strTinhTrangSuDung_Id: '', strNguoiThucHien_Id: '' };
        } },
        columns: [
            { title: 'Phòng', prop: 'KTX_PHONG_MA', cls: 'is-nowrap' },
            { title: 'Mã thiết bị', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên thiết bị', prop: 'TEN' },
            { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-right' },
            { title: 'Tình trạng', cls: 'is-center', render: K.tinhTrangThietBi },
            { title: 'Lịch sử', render: function (r) { return '<span class="ums-u-faint" data-ls="' + ui.esc(r.ID) + '">…</span>'; } }
        ],
        onLoad: lichSu,
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên thiết bị', required: true, placeholder: 'Nhập tên thiết bị' },
            { key: 'strMa', col: 'MA', label: 'Mã', required: true, placeholder: 'Nhập mã thiết bị' },
            { key: 'dSoLuong', col: 'SOLUONG', label: 'Số lượng', type: 'number', required: true, placeholder: 'Nhập số lượng' },
            { key: 'strLoaiTrangThietBi_Id', col: 'LOAITRANGTHIETBI_ID', label: 'Loại thiết bị', type: 'select', required: true, source: { dm: 'KTX.LTB0' } },
            { key: 'strTinhTrangSuDung_Id', col: 'TINHTRANGSUDUNG_ID', label: 'Tình trạng', type: 'select', required: true, source: { dm: 'KTX.TTTB' } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true, placeholder: 'Nhập nội dung mô tả' }
        ],
        onForm: function (row, c, extra) {
            extra.innerHTML = '<div class="ums-field"><label class="ums-field__label">Phòng áp dụng</label><div data-z="phongAD"></div></div>';
            var host = extra.querySelector('[data-z="phongAD"]');
            if (row) {
                /* Sửa: chỉ phòng của dòng, đánh dấu sẵn, không đổi (xem Khác gốc) */
                st.checks = pat.checks(host, [{ ID: row.KTX_PHONG_ID, TEN: e(row.KTX_PHONG_TEN) || e(row.KTX_PHONG_MA) || row.KTX_PHONG_ID }],
                    { all: false, checked: true, cols: 3 });
                Array.prototype.forEach.call(host.querySelectorAll('input[type="checkbox"]'), function (x) { x.disabled = true; });
                return;
            }
            /* Thêm: mọi phòng của toà đang lọc, đánh dấu sẵn phòng đang lọc (nếu có) */
            var phongLoc = (root.querySelector('[data-cf][data-k="phong"]') || {}).value || '';
            st.checks = null;
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            phongCuaToa().then(function (rs) {
                if (!host.isConnected) return;
                st.checks = pat.checks(host, rs, { all: 'Tất cả', cols: 3, name: function (r) { return K.tenPhong(r); }, empty: 'Chưa có phòng nào' });
                if (phongLoc) st.checks.set([phongLoc]);
            });
        },
        save: function (v, row, c) {
            if (row) return thamSo(v, row.KTX_PHONG_ID || '', row.ID);
            if (!st.checks) { ui.toast('Đang tải danh sách phòng, thử lại sau', 'warn'); return null; }
            var ids = st.checks.ids();
            if (!ids.length) { ui.toast('Chưa chọn phòng áp dụng', 'warn'); return null; }
            if (ids.length === 1) return thamSo(v, ids[0], '');
            ui.batch(ids.map(function (id) { return thamSo(v, id, ''); }), { title: 'Đang lưu thiết bị cho ' + ids.length + ' phòng' })
                .then(function (r) { if (r.ok) { c.showList(); c.load(); } });
            return null;
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });

    /* Ô lọc Toà nhà → Phòng (một bản dùng chung của module) */
    K.noiToaNhaPhong(root.querySelector('[data-cf][data-k="toa"]'), root.querySelector('[data-cf][data-k="phong"]'));

    /* Cột "Lịch sử": tên các phòng thiết bị đã qua — mỗi dòng một lời gọi như gốc (genList_QLTB) */
    function lichSu(rows, c) {
        rows.forEach(function (r) {
            ums.api.call({ action: P + 'LayDSChuyenTrangThietBi', method: 'GET', silent: true, strTuKhoa: '', strKTX_Phong_Id: '',
                strKTX_TrangThietBi_Id: r.ID, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000
            }).then(function (res) {
                var el = c.root.querySelector('[data-ls="' + r.ID + '"]');
                if (!el) return;
                var ten = K.rows(res).map(function (x) { return e(x.KTX_PHONG_TEN); }).filter(Boolean);
                el.textContent = ten.join(', ');
                el.classList.toggle('ums-u-faint', !ten.length);
            }).catch(function () {
                var el = c.root.querySelector('[data-ls="' + r.ID + '"]');
                if (el) el.textContent = '';
            });
        });
    }

    /* Chuyển phòng các dòng đã đánh dấu — hộp thoại (gốc #myModalChuyenPhong) */
    function chuyenPhong(c) {
        var chon = c.pickedRows();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần chuyển?', 'warn'); return; }
        var dlg = ui.dialog({
            title: 'Chuyển phòng', icon: 'fa-arrow-right-arrow-left', size: 'md',
            body: '<div class="ums-u-faint ums-u-fz13 ums-u-mb-3">' + chon.length + ' thiết bị: ' +
                    ui.esc(chon.map(function (r) { return e(r.TEN) || e(r.MA); }).join(', ')) + '</div>' +
                ui.field('Phòng chuyển đến', '<select class="ums-select" data-k="phong" data-s2 data-ph="--Chọn phòng chuyển đến--">' +
                    '<option value="">--Chọn phòng chuyển đến--</option></select>') +
                ui.field('Mô tả', '<input class="ums-input" data-k="mota" autocomplete="off">'),
            buttons: [{ text: 'Chuyển phòng', kind: 'confirm', icon: 'fa-arrow-right-arrow-left', keepOpen: true, onClick: function (api) {
                var phong = api.body.querySelector('[data-k="phong"]').value || '';
                if (!phong) { ui.toast('Vui lòng chọn phòng cần chuyển?!', 'warn'); return false; }
                var moTa = (api.body.querySelector('[data-k="mota"]').value || '').trim();
                api.close();
                ui.batch(chon.map(function (r) {
                    return { action: P + 'ChuyenTrangThietBi', method: 'POST', strKTX_Phong_Id: phong, strKTX_TrangThietBi_Id: r.ID, strMoTa: moTa };
                }), { title: 'Đang chuyển ' + chon.length + ' thiết bị' }).then(function (r) {
                    if (r.ok) ui.toast('Chuyển phòng thành công!', 'ok');
                    c.load();
                });
                return false;
            } }]
        });
        var sel = dlg.body.querySelector('[data-k="phong"]');
        phongCuaToa().then(function (rs) {
            pat.fill(sel, rs, { name: function (r) { return K.tenPhong(r); } });
            ui.enhance(dlg.body);
        });
    }
})();
