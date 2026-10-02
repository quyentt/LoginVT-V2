/* =========================================================================
   ums.miengiam.mienSinhVien — khuôn chung của hai màn
       miengiammotphan   Miễn giảm một phần   (TC_MienMotPhan, có kiểu học, % mặc định 50)
       miengiamtoanphan  Miễn giảm toàn phần  (TC_MienToanBo, có lý do, % cố định 100)
   Hai tệp gốc giống nhau, khác action và vài trường — đưa vào cfg.

   Dựng bằng ums.crud (danh sách + lọc + biểu mẫu). Phần chọn sinh viên
   gắn vào vùng phụ của biểu mẫu (onForm → extraEl): nút "Tìm kiếm sinh
   viên" mở hộp chọn, bảng các sinh viên đã chọn có nút Huỷ.

   cfg = { root, title, api, keyword (bool), fields: [...] (trường riêng),
           saveExtra(v) → tham số riêng, searchAll (bool: tìm trong hộp gửi
           rỗng như bản toàn phần) }
   ========================================================================= */
(function () {
    'use strict';

    var M = ums.miengiam, ui = ums.ui, esc = ui.esc, e = M.e;

    M.mienSinhVien = function (cfg) {
        var picked = [];          // [{ ID, HODEM, TEN, MASONGUOIHOC }]
        var extraEl = null;
        var thoiGian = { call: {
            action: 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao', method: 'GET', versionAPI: 'v1.0',
            strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
        }, name: 'DAOTAO_THOIGIANDAOTAO' };

        var filters = [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khoá đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo' },
            { key: 'lop', type: 'select', label: 'Chọn lớp quản lý' }
        ];
        if (cfg.keyword) filters.push({ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' });

        var columns = [
            { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
            { title: 'Chương trình đào tạo', prop: 'CHUONGTRINH' },
            { title: 'Quốc tịch', prop: 'QUOCTICH_TEN' },
            { title: 'Mức miễn giảm', prop: 'PHANTRAMMIENGIAM', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' },
            { title: 'Ngày hết hạn', prop: 'NGAYHETHAN', cls: 'is-center is-nowrap' }
        ].concat(cfg.columns || []);

        var fields = [{ key: 'strPhamViApDung_Id', label: 'Chương trình', type: 'select', required: true, span: true }]
            .concat(cfg.fields)
            .concat([
                { key: 'strNgayApDung', label: 'Ngày áp dụng', type: 'select', source: thoiGian },
                { key: 'strNgayHetHan', label: 'Ngày hết hạn', type: 'select', source: thoiGian }
            ]);

        var crud = ums.crud({
            root: cfg.root,
            title: cfg.title,
            formTitle: cfg.formTitle,
            addText: 'Tạo mới',
            icon: 'fa-address-book',
            filters: filters,
            list: {
                paged: true,
                call: function (f) {
                    return {
                        action: cfg.api + '/LayDanhSach',
                        method: 'GET',
                        versionAPI: 'v1.0',
                        strPhamViApDung_Id: '',
                        strPhanCapApDung_Id: '',
                        strNgayApDung: '',
                        strHeDaoTao_Id: f.he,
                        strKhoaDaoTao_Id: f.khoa,
                        strChuongTrinh_Id: f.ct,
                        strLopQuanLy_Id: f.lop,
                        strQLSV_NguoiHoc_Id: '',
                        strNguoiThucHien_Id: '',
                        strTuKhoa: cfg.keyword ? f.q : ''
                    };
                }
            },
            columns: columns,
            canEdit: false,
            rowDelete: false,
            fields: fields,
            onForm: function (row, c, extra) {
                extraEl = extra;
                picked = [];
                // Ô chương trình của biểu mẫu = danh sách chương trình đang lọc (bản gốc đổ chung)
                M.fill(formEl('strPhamViApDung_Id'), ctRows, {
                    head: 'Chọn chương trình đào tạo', name: 'TENCHUONGTRINH',
                    value: cfg.syncCT && filt('ct') ? filt('ct') : undefined
                });
                if (cfg.onForm) cfg.onForm(formEl);
                drawPicked();
            },
            save: function (v) {
                if (!picked.length) {
                    ui.toast('Vui lòng chọn sinh viên!', 'warn');
                    return null;
                }
                var call = {
                    action: cfg.api + '/ThemMoi',
                    versionAPI: 'v1.0',
                    strPhamViApDung_Id: v.strPhamViApDung_Id,
                    strPhanCapApDung_Id: '',
                    strNgayApDung: v.strNgayApDung,
                    strNgayHetHan: v.strNgayHetHan,
                    strQLSV_NguoiHoc_Id: picked.map(function (s) { return s.ID; }).toString(),
                    dPhanTramMienGiam: String(v.dPhanTramMienGiam || '').replace(/%/g, '')
                };
                var x = cfg.saveExtra(v);
                Object.keys(x).forEach(function (k) { call[k] = x[k]; });
                call.strNguoiThucHien_Id = '';
                call.strId = '';
                return call;
            },
            // Bản gốc xoá nhiều dòng trong MỘT lời gọi, id nối dấu phẩy, dư dấu phẩy cuối
            remove: function (ids) {
                return { action: cfg.api + '/Xoa', versionAPI: 'v1.0', strIds: ids.join(',') + ',', strNguoiThucHien_Id: '' };
            }
        });

        var root = cfg.root;
        function filterEl(k) { return root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
        function filt(k) { var x = filterEl(k); return x ? x.value : ''; }
        function formEl(k) { return root.querySelector('[data-scope="form"][data-k="' + k + '"]'); }

        /* Hệ → Khoá → Chương trình → Lớp: gắn nối tầng vào đúng các ô lọc
           ums.crud vừa dựng. Danh sách chương trình lấy thêm một lần để đổ
           vào ô chương trình của biểu mẫu. */
        var ctRows = [];
        function loadCT() {
            return ums.ref.chuongTrinh({ strDaoTao_HeDaoTao_Id: filt('he'), strKhoaDaoTao_Id: filt('khoa'), pageIndex: 1, pageSize: 10000 })
                .then(function (r) {
                    ctRows = r;
                    M.fill(formEl('strPhamViApDung_Id'), r, { head: 'Chọn chương trình đào tạo', name: 'TENCHUONGTRINH' });
                }).catch(function (err) { ums.api.handle(err, 'chương trình'); });
        }
        ums.ref.cascade({
            he: filterEl('he'), khoa: filterEl('khoa'), ct: filterEl('ct'), lop: filterEl('lop'),
            labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khoá đào tạo', ct: 'Chọn chương trình đào tạo', lop: 'Chọn lớp quản lý' },
            onChange: function (v, level) {
                if (level === 'he' || level === 'khoa') loadCT();
                // Bản toàn phần: chọn chương trình ở ô lọc thì đặt sẵn cho biểu mẫu
                if (level === 'ct' && cfg.syncCT) jQuery(formEl('strPhamViApDung_Id')).val(v.ct).trigger('change.select2');
            }
        }).ready.then(loadCT);

        /* ---------- Danh sách sinh viên đã chọn ------------------------------ */
        function drawPicked() {
            if (!extraEl) return;
            extraEl.innerHTML =
                '<div class="ums-panel"><div class="ums-panel__head">' +
                    '<div class="ums-panel__title"><i class="fa-light fa-users"></i> Danh sách sinh viên ' +
                        '<span class="ums-u-faint ums-u-fz13">(' + picked.length + ')</span></div>' +
                    '<div class="ums-panel__tools"><button type="button" class="ums-btn ums-btn--out-primary" data-mg="find">' +
                        '<i class="fa-light fa-user-magnifying-glass"></i><span>Tìm kiếm sinh viên</span></button></div></div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-mg="tbl"></div></div>';
            ui.table({
                el: extraEl.querySelector('[data-mg="tbl"]'), rows: picked,
                empty: 'Vui lòng chọn dữ liệu!',
                columns: [
                    { title: 'Họ tên', render: function (s) { return esc(e(s.HODEM) + ' ' + e(s.TEN)); } },
                    { title: 'Mã sinh viên', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                    { title: '', cls: 'is-center', width: '90px', render: function (s, i) {
                        return '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-mg-rm="' + i + '"><span>Hủy</span></button>';
                    } }
                ]
            });
        }

        function svParams() {
            // Bản gốc truyền strNganh_Id (hàm hệ cũ không đọc) → chương trình gửi rỗng
            return { strHeDaoTao_Id: '', strKhoaDaoTao_Id: filt('khoa'), strChuongTrinh_Id: '', strLopQuanLy_Id: filt('lop') };
        }

        root.addEventListener('click', function (ev) {
            if (!extraEl || !extraEl.contains(ev.target)) return;
            if (ev.target.closest('[data-mg="find"]')) {
                M.pickSinhVien({
                    params: svParams,
                    searchParams: cfg.searchAll ? function () { return {}; } : svParams,
                    isPicked: function (id) { return picked.some(function (s) { return s.ID === id; }); },
                    onPick: function (s) {
                        if (picked.some(function (x) { return x.ID === s.ID; })) { ui.toast('Dữ liệu đã tồn tại!', 'warn'); return false; }
                        picked.push(s);
                        drawPicked();
                    }
                });
                return;
            }
            var rm = ev.target.closest('[data-mg-rm]');
            if (rm) {
                picked.splice(Number(rm.getAttribute('data-mg-rm')), 1);
                drawPicked();
            }
        });

        return crud;
    };
})();
