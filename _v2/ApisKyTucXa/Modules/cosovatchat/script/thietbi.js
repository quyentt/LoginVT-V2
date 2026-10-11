/* =========================================================================
   Thiết bị trong phòng (Ký túc xá / Cơ sở vật chất)
   Bản gốc: ApisKyTucXa/Modules/cosovatchat/html/thietbi.html + script/thietbi.js (768 dòng)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá):
       KTX_ToaNha/LayDanhSach         GET   ô chọn toà nhà (ums.ktx.toaNha — bản gốc gọi me.getList_ToaNha KHÔNG có (), tức không chạy;
                                            ô chọn toà nhà ở gốc luôn rỗng → xem Khác gốc)
       KTX_Phong/LayDanhSach          GET   strTuKhoa "", strKTX_ToaNha_Id, còn lại "", pageIndex, pageSize 10 (danh sách trái, phân trang máy chủ)
                                            + một lần pageSize 100000 lấy MỌI phòng của toà đang lọc cho ô "Phòng áp dụng" (getList_Phong_All)
       KTX_TrangThietBi/LayDanhSach   GET   strTuKhoa "", strKTX_Phong_Id, strLoaiTrangThietBi_Id "", strTinhTrangSuDung_Id "", pageIndex 1, pageSize 10000
       KTX_TrangThietBi/ThemMoi       POST  strId "", strTen, strMa, strKTX_Phong_Id, strLoaiTrangThietBi_Id, strTinhTrangSuDung_Id, strMoTa, dSoLuong
                                            — MỖI phòng đánh dấu ở "Phòng áp dụng" một lời gọi (bản gốc bắn cùng lúc; ở đây ui.batch tuần tự)
       KTX_TrangThietBi/CapNhat       POST  strId + như trên (một lời gọi)
       KTX_TrangThietBi/Xoa           POST  strIds
       Danh mục: KTX.LTB0 (loại thiết bị), KTX.TTTB (tình trạng; mã KTX.TTTB.01 = nhãn xanh, khác = đỏ)
   Bố cục bản gốc: HAI cột — trái: ô từ khoá + ô chọn toà nhà, "Danh sách phòng" (dòng "Toà - Tên - Loại
   phòng - Tính chất" + nút mắt, phân trang); phải: "Danh sách thiết bị" (Stt | Mã | Tên | Số lượng |
   Tình trạng | Sửa | Xóa) + nút Thêm; thêm / sửa → khung biểu mẫu thay chỗ bảng (Tên, Mã, Số lượng, Loại,
   Tình trạng, Mô tả, Phòng áp dụng = dãy ô đánh dấu có "Tất cả").
   Ở đây: ums.pat.master + cotTrai; cột phải = ums.crud nhúng, "Phòng áp dụng" vẽ bằng ums.pat.checks
   vào vùng extra của biểu mẫu.

   Giữ như bản gốc: bắt buộc Tên, Mã, Số lượng (số nguyên), Loại thiết bị, Tình trạng.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Sửa: bản gốc gửi strKTX_Phong_Id = giá trị ô dropThietBi_Phong KHÔNG có trong HTML (rỗng) → sửa là
       mất phòng của thiết bị. Ở đây gửi KTX_PHONG_ID của dòng đang sửa; dãy "Phòng áp dụng" khi sửa chỉ
       hiện phòng đó (đánh dấu sẵn, không đổi được) như ý đồ gốc (point.prop('checked')).
     · Thêm mà chưa đánh dấu phòng nào: bản gốc lặng lẽ không lưu gì → ở đây đánh dấu sẵn phòng đang chọn,
       bỏ hết thì báo "Chưa chọn phòng áp dụng".
     · Ô chọn toà nhà bên trái: bản gốc không bao giờ đổ dữ liệu (gọi thiếu dấu ngoặc) → ở đây đổ.
     · Xoá: bản gốc gắn thêm trình xử lý #btnYes mỗi lần bấm → ui.confirm.
   Cố ý bỏ: khung "Thông tin chi tiết" #zone_detail_thietbi (nhãn lblThietBi_Icon / DuongDanHienThi /
     ChucNang cha… chép từ màn chức năng, JS không đổ gì, hai nút #btnEdit_ThietBi / #btnDelete_ThietBi
     không có xử lý); hàm reset (lblChucNang_*), dropThietBi_ToaNha_Phong, .btnAdd / .btnAction trong
     danh sách phòng (HTML không vẽ), #main-content-wrapper.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, K = ums.ktx, e = K.e;
    var root = document.getElementById('ktx-thietbi');
    if (!root) return;

    var SIZE = 10;                              // edu.system.pageSize_default
    var st = { page: 1, rows: [], total: 0, phong: null, tatCa: [], checks: null };

    var m = pat.master({
        el: root, title: 'Thiết bị trong phòng',
        side: {
            title: 'Danh sách phòng', icon: 'fa-door-open', search: 'Nhập từ khóa tìm kiếm',
            filter: '<div class="ums-field"><select class="ums-select" data-f="toa" data-ph="Chọn tòa nhà"><option value="">Chọn tòa nhà</option></select></div>'
        },
        main: { title: false }
    });
    var selToa = m.el.querySelector('[data-f="toa"]');
    K.toaNha().then(function (rs) { pat.fill(selToa, rs, { name: 'TEN' }); });
    if (window.jQuery) jQuery(selToa).on('change', function () { load(1); });
    pat.cotTrai(m, { tai: function () { load(1); }, tuTaiLoc: false });

    /* ---------- Cột trái: phòng ---------- */
    function load(p) {
        st.page = p || 1;
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var toa = selToa.value || '';
        /* getList_Phong_All: mọi phòng của toà đang lọc — nguồn cho "Phòng áp dụng" */
        K.phong({ strKTX_ToaNha_Id: toa, pageSize: 100000 }).then(function (kq) { st.tatCa = kq.rows; }).catch(function () { st.tatCa = []; });
        return K.phong({
            strTuKhoa: m.search ? (m.search.value || '').trim() : '', strKTX_ToaNha_Id: toa, pageIndex: st.page, pageSize: SIZE
        }).then(function (kq) {
            st.rows = kq.rows; st.total = kq.total;
            m.sideCount.textContent = String(st.total);
            veTrai();
            m.setPage({ index: st.page, size: SIZE, total: st.total, sizes: false, shown: st.rows.length, onChange: function (pg) {
                if (pg >= 1 && pg <= Math.max(1, Math.ceil(st.total / SIZE))) load(pg);
            } });
        }).catch(function (err) {
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách phòng');
        });
    }
    function veTrai() {
        if (!st.rows.length) { m.sideBody.innerHTML = ui.empty('Không có dữ liệu'); return; }
        m.sideBody.innerHTML = st.rows.map(function (r) {
            return '<button type="button" class="ums-master__item' + (st.phong && st.phong.ID === r.ID ? ' is-active' : '') +
                '" data-id="' + ui.esc(r.ID) + '">' +
                '<span class="ums-master__item__main">' + ui.esc(e(r.KTX_TOANHA_TEN)) + ' - ' + ui.esc(e(r.TEN)) + ' - ' + ui.esc(e(r.LOAIPHONG_TEN)) + ' - ' + ui.esc(e(r.TINHCHAT_TEN)) + '</span>' +
                '</button>';
        }).join('');
    }
    m.sideBody.addEventListener('click', function (ev) {
        var b = ev.target.closest('.ums-master__item');
        if (!b || !m.sideBody.contains(b)) return;
        var id = b.getAttribute('data-id');
        st.phong = st.rows.filter(function (r) { return r.ID === id; })[0] || null;
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item'), function (x) { x.classList.toggle('is-active', x === b); });
        if (!crud.z('form').hidden) crud.showList();
        crud.load(1);
    });

    /* ---------- Cột phải: thiết bị (ums.crud nhúng) ---------- */
    var P = 'KTX_TrangThietBi/';
    function thamSo(v, phongId, id) {
        return { action: P + (id ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: id || '',
            strTen: v.strTen, strMa: v.strMa, strKTX_Phong_Id: phongId,
            strLoaiTrangThietBi_Id: v.strLoaiTrangThietBi_Id, strTinhTrangSuDung_Id: v.strTinhTrangSuDung_Id,
            strMoTa: v.strMoTa, dSoLuong: v.dSoLuong };
    }
    var crud = ums.crud({
        root: m.mainBody, embedded: true, autoload: false, multi: false,
        title: 'Danh sách thiết bị', icon: 'fa-screwdriver-wrench', formTitle: 'thiết bị', addText: 'Thêm',
        empty: 'Chưa có thiết bị nào',
        list: { call: function () {
            if (!st.phong) return null;
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_Phong_Id: st.phong.ID,
                strLoaiTrangThietBi_Id: '', strTinhTrangSuDung_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 };
        } },
        columns: [
            { title: 'Mã thiết bị', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên thiết bị', prop: 'TEN' },
            { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-right' },
            { title: 'Tình trạng', cls: 'is-center', render: K.tinhTrangThietBi }
        ],
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên thiết bị', required: true, placeholder: 'Nhập tên thiết bị' },
            { key: 'strMa', col: 'MA', label: 'Mã', required: true, placeholder: 'Nhập mã thiết bị' },
            { key: 'dSoLuong', col: 'SOLUONG', label: 'Số lượng', type: 'number', required: true, placeholder: 'Nhập số lượng' },
            { key: 'strLoaiTrangThietBi_Id', col: 'LOAITRANGTHIETBI_ID', label: 'Loại thiết bị', type: 'select', required: true, source: { dm: 'KTX.LTB0' } },
            { key: 'strTinhTrangSuDung_Id', col: 'TINHTRANGSUDUNG_ID', label: 'Tình trạng', type: 'select', required: true, source: { dm: 'KTX.TTTB' } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true, placeholder: 'Nhập nội dung mô tả' }
        ],
        onForm: function (row, c, extra) {
            /* Phòng áp dụng: thêm → mọi phòng của toà đang lọc, đánh dấu sẵn phòng đang chọn; sửa → chỉ phòng của dòng */
            var ds = row ? [{ ID: row.KTX_PHONG_ID, TEN: e(row.KTX_PHONG_TEN) || (st.phong && st.phong.ID === row.KTX_PHONG_ID ? e(st.phong.TEN) : row.KTX_PHONG_ID) }]
                         : (st.tatCa.length ? st.tatCa : (st.phong ? [st.phong] : []));
            extra.innerHTML = '<div class="ums-field"><label class="ums-field__label">Phòng áp dụng</label><div data-z="phongAD"></div></div>';
            st.checks = pat.checks(extra.querySelector('[data-z="phongAD"]'), ds, {
                all: row ? false : 'Tất cả', checked: !!row, cols: 3, name: function (r) { return K.tenPhong(r); }, empty: 'Chưa có phòng nào'
            });
            if (!row && st.phong) st.checks.set([st.phong.ID]);
            if (row) Array.prototype.forEach.call(extra.querySelectorAll('input[type="checkbox"]'), function (x) { x.disabled = true; });
        },
        save: function (v, row, c) {
            if (row) return thamSo(v, row.KTX_PHONG_ID || (st.phong && st.phong.ID) || '', row.ID);
            var ids = st.checks ? st.checks.ids() : [];
            if (!ids.length) { ui.toast('Chưa chọn phòng áp dụng', 'warn'); return null; }
            if (ids.length === 1) return thamSo(v, ids[0], '');
            ui.batch(ids.map(function (id) { return thamSo(v, id, ''); }), { title: 'Đang lưu thiết bị cho ' + ids.length + ' phòng' })
                .then(function (r) { if (r.ok) { c.showList(); c.load(); } });
            return null;
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });
    function veTrong() {
        var t = crud.z('table');
        if (t && !st.phong) t.innerHTML = ui.empty('Chọn phòng ở danh sách bên trái để xem thiết bị', 'fa-hand-pointer');
    }
    veTrong();

    load(1);
})();
