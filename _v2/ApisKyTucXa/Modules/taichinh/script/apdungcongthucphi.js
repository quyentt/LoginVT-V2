/* =========================================================================
   Công thức tính phí (Ký túc xá → Tính toán) — lưới Khóa học × Thời gian
   Bản gốc: ApisKyTucXa/Modules/taichinh/html/apdungcongthucphi.html + script/apdungcongthucphi.js (863 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc (Nghiệp vụ áp dụng, Thời gian đào tạo) → khung "Danh sách" là lưới nhập: dòng = khóa học
   (danh mục KTX.KHOADAOTAO), cột = thời gian khai công thức, ô = xâu công thức; nút đầu khung "Xem từ khóa" (mở khung
   Từ khóa bên phải), "Cập nhật" (lưu mọi ô đã sửa), "Thêm mới" (biểu mẫu trong trang — gốc là hộp thoại #myModal).
   Lời gọi (kiểu cũ, không mã hoá — chép nguyên):
       KTX_CongThucTinhPhi/LayDSThoiGian_CongThucTinhPhi  GET v1.0  strDaoTao_ThoiGianDaoTao_Id, strHeDaoTao_Id '', strKhoaDaoTao_Id '',
                                                           strDonViTinh_Id '', strTaiChinh_CacKhoanThu_Id '', strNghiepVuApDung_Id, strNguoiThucHien_Id ''  → cột (ID, THOIGIAN)
       KTX_CongThucTinhPhi/LayDanhSach    GET   strTuKhoa '', strPhamViApDung_Id '', strPhanCapApDung_Id '', strNgayApDung '', strNghiepVuApDung_Id,
                                                strDaoTao_ThoiGianDaoTao_Id, strNguoiTao_Id '', 1/100000  → ô (PHAMVIAPDUNG_ID × DAOTAO_THOIGIANDAOTAO_ID → XAUCONGTHUC)
       KTX_CongThucTinhPhi/ThemMoi | CapNhat (khi có strId)   POST  strId, strNghiepVuApDung_Id, strDonViTinh_Id '', strPhamViApDung_Id, strPhanCapApDung_Id '',
                                                strNgayApDung, strDaoTao_ThoiGianDaoTao_Id, strXauCongThuc, strTaiChinh_CacKhoanThu_Id '', dKeThua, strGhiChu ''
       KTX_CongThucTinhPhi/Xoa            POST  strIds = một id
       KTX_TuKhoa/LayDanhSach             GET   strTuKhoa '', strNguoiTao_Id '', pageSize 100000, pageIndex 2 (giữ như gốc — xem Nghi ngờ)
       Danh mục KTX.KHOADAOTAO (dòng lưới + ô "Khóa học"), KTX.NVAP (nghiệp vụ); edu.system.getList_ThoiGianDaoTao → ums.ref.thoiGianDaoTao
   Tham số gốc đọc từ ô KHÔNG có trong HTML → gửi rỗng đúng như gốc đang gửi: strDonViTinh_Id (dropDonViTinh_ADCT / dropNew_DonViTinh),
   strTaiChinh_CacKhoanThu_Id (dropKhoanThu_ADCT / dropNew_LoaiKhoan), strHeDaoTao_Id / strKhoaDaoTao_Id (hai ô ẩn display:none, không bao giờ chọn),
   dKeThua khi lưu hàng loạt (dropNew_KeThua_All).
   Khác gốc (lỗi rõ ràng / luật _v2):
     · Lưới nạp ngay khi mở màn và nạp lại khi đổi ô lọc (gốc phải bấm "Tìm kiếm"; _v2 không có nút Tìm — gõ / chọn tự tìm).
     · Lưu một công thức: gốc không kiểm gì → ở đây bắt buộc Khóa học + Xâu công thức (công thức không có phạm vi là bản ghi rác).
     · "Cập nhật" hàng loạt: gốc báo tiến độ vào #myModalAlert không tồn tại → ums.ui.batch (hỏi một lần, chạy tuần tự có tiến độ).
     · Nút Xoá chỉ hiện khi SỬA (gốc hiện cả khi thêm mới → gọi Xoa với id rỗng).
   Cố ý bỏ (mã chết): ô "Nhập từ khóa tìm kiếm" (txtTuKhoa_Search — không được đọc), hai ô Hệ / Khóa đào tạo ẩn, btnCapNhatAll,
   getList_HeDaoTao / getList_KhoaDaoTao / getList_LoaiKhoan / getList_KieuHoc / genComBo_HocPhan (không ai gọi).
   Nghi ngờ, giữ nguyên: KTX_TuKhoa/LayDanhSach gửi pageIndex 2 với pageSize 100000 (bản Tài chính cũng vậy) — có thể luôn rỗng. KIỂM HOST.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.ktxTC, e = T.e, P = 'KTX_CongThucTinhPhi/';
    var root = document.getElementById('ktx-apdungcongthucphi');
    if (!root) return;

    var S = { cot: [], rows: [], list: [], thoiGian: [], nghiepVu: [], khoaHoc: [] };
    var mx = null;

    root.innerHTML =
        pat.page('Công thức tính phí', '') +
        pat.filterBar([
            { key: 'nv', label: 'Chọn nghiệp vụ áp dụng', type: 'select' },
            { key: 'tg', label: 'Chọn thời gian đào tạo', type: 'select' }
        ], { search: false }) +
        '<div class="ums-grid" data-z="split">' +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', zone: 'grid', count: 'count', body: ui.empty('Đang tải…', 'fa-spinner fa-spin'),
                tools: ui.btn('view', { text: 'Xem từ khóa', attr: { 'data-a': 'tukhoa' } }) +
                       ui.btn('save', { text: 'Cập nhật', mod: 'warn', attr: { 'data-a': 'update' } }) +
                       ui.btn('add', { attr: { 'data-a': 'add' } }) }) +
            '<div data-z="tukhoa" hidden>' + pat.panel({ title: 'Từ khóa', icon: 'fa-key', zone: 'tk', flush: true }) + '</div>' +
        '</div>';

    var el = {
        nv: root.querySelector('[data-f="nv"]'), tg: root.querySelector('[data-f="tg"]'),
        grid: root.querySelector('[data-z="grid"]'), count: root.querySelector('[data-z="count"]'),
        split: root.querySelector('[data-z="split"]'), tk: root.querySelector('[data-z="tukhoa"]'), tkBody: root.querySelector('[data-z="tk"]')
    };
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }
    function rows(call) { return ums.api.call(call).then(function (r) { return Array.isArray(r.data) ? r.data : []; }); }

    /* ---------- Danh mục ---------- */
    var sanSang = Promise.all([
        ums.api.dm('KTX.NVAP').then(function (r) { S.nghiepVu = r || []; pat.fill(el.nv, S.nghiepVu, { head: 'Chọn nghiệp vụ áp dụng' }); }).catch(fail('nghiệp vụ áp dụng')),
        ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { S.thoiGian = r || []; pat.fill(el.tg, S.thoiGian, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); }).catch(fail('thời gian đào tạo')),
        ums.api.dm('KTX.KHOADAOTAO').then(function (r) { S.khoaHoc = r || []; }).catch(fail('khóa học'))
    ]);
    rows({ action: 'KTX_TuKhoa/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageSize: 100000, pageIndex: 2 }).then(function (r) {
        ui.table({ el: el.tkBody, rows: r, tableCls: 'ums-table--lined ums-table--tight', empty: 'Không có từ khóa',
            columns: [{ title: 'Từ khóa', prop: 'TUKHOA', cls: 'is-nowrap' }, { title: 'Mô tả', prop: 'MOTA' }] });
    }).catch(fail('từ khóa'));

    /* ---------- Nạp lưới: thời gian (cột) → khóa học (dòng) → giá trị ô, như gốc ---------- */
    function load() {
        var f = { nv: el.nv.value, tg: el.tg.value };
        el.grid.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return sanSang.then(function () {
            return rows({ action: P + 'LayDSThoiGian_CongThucTinhPhi', method: 'GET', versionAPI: 'v1.0',
                strDaoTao_ThoiGianDaoTao_Id: f.tg, strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strDonViTinh_Id: '', strTaiChinh_CacKhoanThu_Id: '',
                strNghiepVuApDung_Id: f.nv, strNguoiThucHien_Id: '' });
        }).then(function (cot) {
            S.cot = cot; S.rows = S.khoaHoc;
            return rows({ action: P + 'LayDanhSach', method: 'GET', strTuKhoa: '', strPhamViApDung_Id: '', strPhanCapApDung_Id: '', strNgayApDung: '',
                strNghiepVuApDung_Id: f.nv, strDaoTao_ThoiGianDaoTao_Id: f.tg, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 });
        }).then(function (list) { S.list = list; draw(); })
        .catch(function (err) { el.grid.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nạp lưới công thức'); });
    }
    function draw() {
        mx = pat.matrix({
            el: el.grid, rows: S.rows, cols: S.cot, text: true,
            lead: [{ title: 'Khóa học', prop: 'TEN' }],
            rowKey: function (r) { return r.ID; },
            cells: S.list,
            cellKey: function (r) { return { r: r.PHAMVIAPDUNG_ID, c: r.DAOTAO_THOIGIANDAOTAO_ID }; },
            value: function (r) { return r.XAUCONGTHUC; },
            onEdit: function (rec) { if (rec) openForm(rec); },
            empty: S.cot.length ? 'Chưa khai báo khóa học (danh mục KTX.KHOADAOTAO)' : 'Chưa có thời gian khai công thức theo điều kiện lọc'
        });
        el.count.textContent = S.rows.length && S.cot.length ? '(' + S.rows.length + ' khóa học × ' + S.cot.length + ' thời gian)' : '';
    }
    if (window.jQuery) jQuery([el.nv, el.tg]).on('change', function () { load(); });

    /* ---------- "Cập nhật": lưu mọi ô đã sửa ---------- */
    function saveAll() {
        var dirty = mx ? mx.dirty() : [];
        if (!dirty.length) { ui.toast('Chưa có hệ số mới nào cần lưu', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ hệ số không?').then(function (yes) {
            if (!yes) return;
            var nv = el.nv.value;
            ui.batch(dirty.map(function (d) {
                var id = d.rec ? d.rec.ID : '';
                return { action: P + (id ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: id, strNghiepVuApDung_Id: nv, strDonViTinh_Id: '',
                    strPhamViApDung_Id: d.row.ID, strPhanCapApDung_Id: '', strNgayApDung: '', strDaoTao_ThoiGianDaoTao_Id: d.col.ID,
                    strXauCongThuc: d.value, strTaiChinh_CacKhoanThu_Id: '', dKeThua: '', strGhiChu: '' };
            }), { title: 'Đang lưu công thức', okText: 'Thực hiện thành công' }).then(load);
        });
    }

    /* ---------- Biểu mẫu thêm / sửa một công thức (trong trang) ---------- */
    /* data-scope="form" / data-type: cùng quy ước ô biểu mẫu của ums.crud (trang kiểm thu-crud điền ô bắt buộc theo dấu này) */
    function sel(k, ph) { return '<select class="ums-select" data-k="' + k + '" data-scope="form" data-type="select" data-ph="' + ui.esc(ph) + '"><option value="">' + ui.esc(ph) + '</option></select>'; }
    function openForm(rec) {
        var body = document.createElement('div');
        body.className = 'ums-grid ums-grid--2';
        body.innerHTML =
            ui.field('Khóa học', sel('ct', 'Chọn khóa học'), { required: true }) +
            ui.field('Thời gian', sel('tg', 'Chọn học kỳ')) +
            ui.field('Nghiệp vụ', sel('nv', 'Chọn nghiệp vụ áp dụng')) +
            ui.field('Kế thừa', '<select class="ums-select" data-k="kethua" data-scope="form" data-type="select"><option value="0">1. Áp dụng bình thường</option>' +
                '<option value="1">2. Áp dụng cho tất cả các chương trình còn lại của khóa học</option></select>') +
            ui.field('Ngày áp dụng', '<div class="ums-inputwrap"><input class="ums-input" data-k="ngay" data-scope="form" data-type="date" data-date autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>') +
            '<div style="grid-column:1 / -1">' + ui.field('Xâu công thức', '<textarea class="ums-textarea" data-k="xau" data-scope="form" data-type="textarea" rows="8"></textarea>', { required: true }) + '</div>';
        var k = function (key) { return body.querySelector('[data-k="' + key + '"]'); };
        function set(key, v) { var x = k(key); x.value = e(v); if (window.jQuery) jQuery(x).trigger('change.select2'); }
        var buttons = [];
        if (rec) buttons.push({ text: 'Xoá', kind: 'del', onClick: function (api) { remove(rec, api); return false; } });
        buttons.push({ text: 'Lưu', kind: 'save', onClick: function (api) { saveOne(rec, api); return false; } });
        var ft = pat.formTrang({ host: root, title: (rec ? 'Sửa' : 'Thêm') + ' công thức tính phí', icon: rec ? 'fa-pen-to-square' : 'fa-plus', body: body, buttons: buttons });
        pat.fill(k('ct'), S.khoaHoc, { head: 'Chọn khóa học' });
        pat.fill(k('tg'), S.thoiGian, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
        pat.fill(k('nv'), S.nghiepVu, { head: 'Chọn nghiệp vụ áp dụng' });
        if (rec) { set('ct', rec.PHAMVIAPDUNG_ID); set('tg', rec.DAOTAO_THOIGIANDAOTAO_ID); set('nv', rec.NGHIEPVUAPDUNG_ID); set('ngay', rec.NGAYAPDUNG); set('xau', rec.XAUCONGTHUC); }
        function saveOne(row, api) {
            if (!k('ct').value) { ui.toast('Vui lòng chọn khóa học', 'warn'); return; }
            if (!k('xau').value.trim()) { ui.toast('Vui lòng nhập xâu công thức', 'warn'); return; }
            var id = row ? row.ID : '';
            ums.api.call({ action: P + (id ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: id, strNghiepVuApDung_Id: k('nv').value, strDonViTinh_Id: '',
                strPhamViApDung_Id: k('ct').value, strPhanCapApDung_Id: '', strNgayApDung: k('ngay').value, strDaoTao_ThoiGianDaoTao_Id: k('tg').value,
                strXauCongThuc: k('xau').value.trim(), strTaiChinh_CacKhoanThu_Id: '', dKeThua: k('kethua').value, strGhiChu: '' })
            .then(function () { ui.toast(id ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok'); api.close(); load(); })
            .catch(fail('lưu công thức'));
        }
        return ft;
    }
    function remove(row, api) {
        ui.confirm('Xoá công thức này?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: P + 'Xoa', method: 'POST', strIds: row.ID })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); api.close(); load(); }).catch(fail('xoá công thức'));
        });
    }

    /* ---------- Nút đầu khung ---------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || b.closest('.ums-formtrang')) return;
        var a = b.getAttribute('data-a');
        if (a === 'update') saveAll();
        else if (a === 'add') openForm(null);
        else if (a === 'tukhoa') {
            var show = el.tk.hidden;
            el.tk.hidden = !show;
            el.split.classList.toggle('ums-grid--main-aside', show);
            if (show) ui.reveal(el.tk, { fade: true });
        }
    });

    load();
})();
