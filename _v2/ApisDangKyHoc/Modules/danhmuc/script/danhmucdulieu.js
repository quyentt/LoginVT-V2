/* =========================================================================
   Danh mục dữ liệu — bản của phân hệ Đăng ký học
   Bản gốc: ApisDangKyHoc/Modules/danhmuc/script/danhmucdulieu.js
   (CLAUDE.md mục 8 bẫy 10: 21 bản danhmucdulieu.js. Bản Đăng ký học GIỐNG HỆT
   bản ApisHocLaiThiLai và ApisTKGG — hai phân hệ đó dùng lại được tệp này
   nguyên văn, chỉ cần thẻ gốc #danhmucdulieu + <script src> trỏ về đây.)
   ---------------------------------------------------------------------------
   Vì sao KHÔNG dùng lại bản Tài chính (ApisTaiChinh/Modules/danhmuc/script/
   danhmucdulieu.js): bản gốc này là dòng cũ hơn, lệch bản Tài chính ở TÊN
   THAM SỐ — thứ Oracle đọc — chứ không chỉ ở ba tuỳ chọn hiển thị:
     · danh sách bảng gửi strPhanCap_Id (TC: strPhanCapDanhMuc_Id), không có
       strTieuChiSapXep, strTuKhoa rỗng;
     · danh sách dữ liệu gửi strChung_TenDanhMuc_Cha_Id (TC: strCha_Id +
       strQUANHECHA_Id), pageSize 100000, dTrangThai cố định 1;
     · lưu gửi strChung_TenDanhMuc_Cha_Id + strCHUNG_TENDANHMUC_Id
       (TC: strQuanHeCha_Id + strChung_TenDanhMuc_Id), không có ThongTin7/8;
     · xoá không gửi dTrangThai; ô "Dữ liệu cha" hiện TEN (TC: TEN - MA),
       nguồn là chính danh sách đang hiện (TC: một lời gọi riêng).
   So bản CMS (ApisCMS/…/danhmucdulieu.js) cũng lệch: CMS dùng action mã hoá
   pkg_chung_danhmuc.* và ô chọn ứng dụng. → chuyển riêng.

   Lời gọi (đều là action kiểu cũ, không func, không mã hoá):
       CMS_DanhMucTenBang/LayDanhSach     GET  cây bảng danh mục
           strNhomDanhMuc_Id = edu.system.appId = VaiTro_Id (CLAUDE.md mục 4)
           → ums.state.roleId
       CMS_DanhMucThuocTinh/LayDanhSach   GET  thuộc tính (cột) của bảng
       CMS_DanhMucDuLieu/LayDanhSach      GET  dữ liệu của bảng
       CMS_DanhMucDuLieu/LayChiTiet       GET  trước khi sửa
       CMS_DanhMucDuLieu/ThemMoi|CapNhat  POST
       CMS_DanhMucDuLieu/Xoa              POST strId = "id1,id2," (một lời gọi)

   Giữ nguyên hành vi bản gốc:
     · Ô từ khoá (cây và bảng) LỌC TẠI CHỖ khi gõ, không gửi lên máy chủ —
       danh sách luôn gửi strTuKhoa rỗng như gốc.
     · Không tự mở bảng đầu tiên (gốc chờ người dùng bấm cây).
     · Chỉ trường có trong thuộc tính của bảng mới đọc từ ô nhập; trường khác
       gửi "" (ThongTinX) hoặc 0 (HeSoX); HeSo trống gửi 0. Lưu luôn gửi
       dTrangThai = 1 (gốc tính iTrangThai từ ô dropTrangThai_DMDL không có
       trên màn rồi cũng không dùng).
     · Ô "Dữ liệu cha" lấy đúng danh sách dữ liệu của bảng đang mở, tên TEN.

   Lỗi bản gốc — đã sửa theo ý định:
     · Mở sửa chỉ đổ THONGTIN1–3 vào ô (getDetail_DMDL bỏ sót 4–6) → bảng có
       ThongTin4–6 thì bấm Lưu là xoá trắng ba trường đó. Bản mới đổ đủ.
     · genInputForm_DMDL dựng ô "Dữ liệu cha" từ me.dtDanhMucDuLieu của lần
       nạp TRƯỚC (getList_DMDL chạy bất đồng bộ) → mở bảng mới vẫn thấy dữ liệu
       cha của bảng cũ. Bản mới nạp theo bảng đang mở.

   Cố ý bỏ:
     · updateStatus_DMDL (CMS_DanhMucDuLieu/CapNhatTrangThai): mã chết, không
       nơi nào gọi, lại gọi me.loadDatasysDanhMucDuLieu không tồn tại.
     · Tô đỏ dòng khớp từ khoá (css("color","red") của gốc) — chỉ ẩn/hiện.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('danhmucdulieu');
    if (!root) return;

    var mst = ums.pat.master({
        el: root,
        title: 'Danh mục dữ liệu',
        side: { title: 'Danh sách danh mục', kieu: 'danhmuc', search: 'Nhập từ khóa tìm kiếm' },
        main: { title: false }
    });
    var elTree = mst.sideBody;
    var elData = mst.mainBody;
    var elSearch = mst.search;
    var elCount = mst.sideCount;

    var tables = [];
    var current = null;

    /* Trường bản gốc biết — đúng thứ tự switch của gốc (không có ThongTin7/8) */
    var KNOWN = {
        Ten:       { key: 'strTen', col: 'TEN', required: true },
        Ma:        { key: 'strMa', col: 'MA', required: true },
        HeSo1:     { key: 'dHeSo1', col: 'HESO1', num: true, cls: 'is-center' },
        HeSo2:     { key: 'dHeSo2', col: 'HESO2', num: true, cls: 'is-center' },
        HeSo3:     { key: 'dHeSo3', col: 'HESO3', num: true, cls: 'is-center' },
        ThongTin1: { key: 'strThongTin1', col: 'THONGTIN1' },
        ThongTin2: { key: 'strThongTin2', col: 'THONGTIN2' },
        ThongTin3: { key: 'strThongTin3', col: 'THONGTIN3' },
        ThongTin4: { key: 'strThongTin4', col: 'THONGTIN4' },
        ThongTin5: { key: 'strThongTin5', col: 'THONGTIN5' },
        ThongTin6: { key: 'strThongTin6', col: 'THONGTIN6' }
    };

    function e(v) { return v === undefined || v === null ? '' : v; }
    function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function panelMsg(h) { elData.innerHTML = '<div class="ums-panel">' + h + '</div>'; }

    /* ---------- Cây bảng danh mục (getList_DMTB + loadToTree_DMTB) ------- */
    function loadTables() {
        elTree.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'CMS_DanhMucTenBang/LayDanhSach',
            method: 'GET',
            strPhanCap_Id: '',
            strChung_TenDanhMuc_Cha_Id: '',
            strNhomDanhMuc_Id: ums.state.roleId || '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 100000,
            dTrangThai: 1
        }).then(function (r) {
            tables = rowsOf(r);
            elCount.textContent = String(r.pager || tables.length);
            drawTree();
            panelMsg(tables.length ? ui.empty('Chọn một danh mục ở cột trái', 'fa-hand-pointer')
                                   : ui.empty('Chưa có bảng danh mục nào'));
        }).catch(function (err) {
            elTree.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách bảng danh mục');
        });
    }

    /** Cây theo CHUNG_TENDANHMUC_CHA_ID, nhãn TENDANHMUC (gốc không ghép mã) */
    function drawTree() {
        var ids = {};
        tables.forEach(function (t) { ids[t.ID] = true; });
        function branch(parent) {
            var kids = tables.filter(function (t) {
                var p = t.CHUNG_TENDANHMUC_CHA_ID || '';
                return parent ? p === parent : (!p || !ids[p]);
            });
            if (!kids.length) return '';
            return '<ul>' + kids.map(function (t) {
                return '<li data-text="' + ui.esc(String(e(t.TENDANHMUC)).toLowerCase()) + '">' +
                    '<button type="button" class="ums-master__item' + (current && current.ID === t.ID ? ' is-active' : '') +
                    '" data-dmtb="' + ui.esc(t.ID) + '">' + ui.esc(t.TENDANHMUC) + '</button>' +
                    branch(t.ID) + '</li>';
            }).join('') + '</ul>';
        }
        elTree.innerHTML = branch('') || ui.empty('Không có dữ liệu');
        filterTree();
    }

    /* Gốc: keyup → ẩn các <li> không chứa từ khoá (so cả chữ của nhánh con) */
    function filterTree() {
        var v = (elSearch.value || '').trim().toLowerCase();
        Array.prototype.forEach.call(elTree.querySelectorAll('li'), function (li) {
            li.hidden = !!v && li.textContent.toLowerCase().indexOf(v) < 0;
        });
    }

    elSearch.addEventListener('input', filterTree);
    elTree.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-dmtb]');
        if (b) pick(b.getAttribute('data-dmtb'));
    });

    /* ---------- Chọn một bảng: thuộc tính rồi dữ liệu ------------------- */
    function pick(id) {
        current = tables.filter(function (t) { return t.ID === id; })[0] || null;
        Array.prototype.forEach.call(elTree.querySelectorAll('[data-dmtb]'), function (b) {
            b.classList.toggle('is-active', b.getAttribute('data-dmtb') === id);
        });
        if (!current) return;
        var token = pick.token = {};
        panelMsg(ui.empty('Đang tải…', 'fa-spinner fa-spin'));

        ums.api.call({
            action: 'CMS_DanhMucThuocTinh/LayDanhSach',
            method: 'GET',
            strTuKhoa: '',
            strCHUNG_TENDANHMUC_Id: id,
            pageIndex: 1,
            pageSize: 100,
            dTrangThai: 1
        }).then(function (r) {
            if (pick.token !== token) return;
            var attrs = rowsOf(r);
            if (!attrs.length) {
                panelMsg(ui.empty('Bảng chưa được khai báo tham số thuộc tính!', 'fa-circle-info'));
                return;
            }
            build(current, attrs);
        }).catch(function (err) {
            if (pick.token !== token) return;
            panelMsg(ui.fail(err.message));
            ums.api.handle(err, 'thuộc tính danh mục');
        });
    }

    function build(table, attrs) {
        var tableId = table.ID;
        var defs = [];
        attrs.forEach(function (a) {
            var k = KNOWN[a.TENTRUONGDULIEU];
            if (!k) return;
            defs.push({ label: e(a.MOTA) || e(a.TENTRUONGDULIEU), k: k });
        });

        /* getList_DMDL — cũng là nguồn ô "Dữ liệu cha" (genCombo_DMDL đọc
           me.dtDanhMucDuLieu = kết quả của chính lời gọi này) */
        function listCall() {
            return {
                action: 'CMS_DanhMucDuLieu/LayDanhSach',
                method: 'GET',
                strChung_TenDanhMuc_Cha_Id: '',
                strTuKhoa: '',
                strCHUNG_TENDANHMUC_Id: tableId,
                strTieuChiSapXep: '',
                pageIndex: 1,
                pageSize: 100000,
                dTrangThai: 1
            };
        }
        var CHA = { items: [], id: 'ID', name: 'TEN' };      // đổ ở onLoad, từ chính danh sách

        var tatCa = [];          // toàn bộ dòng vừa nạp — ô từ khoá lọc trên mảng này
        function tu() {
            var el = elData.querySelector('[data-scope="filter"][data-k="q"]');
            return el ? (el.value || '').trim().toLowerCase() : '';
        }
        function loc(rows) {
            var v = tu();
            if (!v) return rows;
            return rows.filter(function (r) {
                return defs.some(function (d) { return String(e(r[d.k.col])).toLowerCase().indexOf(v) >= 0; });
            });
        }

        var columns = defs.map(function (d) {
            return {
                title: d.label,
                cls: d.k.cls || '',
                render: d.k.num
                    ? function (r) { var x = r[d.k.col]; return ui.esc(x === null || x === undefined || x === '' ? 0 : x); }
                    : function (r) { return ui.esc(r[d.k.col]); }
            };
        });

        var fields = defs.map(function (d) {
            return { key: d.k.key, col: d.k.col, label: d.label, required: !!d.k.required, type: d.k.num ? 'number' : 'text' };
        });
        fields.push({ key: 'strMoTa', col: 'MOTA', label: 'Mô tả', span: true });
        fields.push({ key: 'strChung_TenDanhMuc_Cha_Id', col: 'QUANHECHA_ID', label: 'Dữ liệu cha', type: 'select',
                      source: CHA, placeholder: '-- Chọn dữ liệu cha--', span: true });

        elData.innerHTML = '';
        var crud = ums.crud({
            root: elData,
            embedded: true,
            title: 'Dữ liệu danh mục — ' + e(table.TENDANHMUC),
            formTitle: 'dữ liệu danh mục',
            icon: 'fa-circle-info',
            addText: 'Tạo mới',
            empty: 'Không tìm thấy dữ liệu!',

            filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],

            list: {
                call: function () { return listCall(); },
                rows: function (d) {
                    tatCa = Array.isArray(d) ? d : (d && d.rs) || [];
                    return loc(tatCa);
                }
            },

            columns: columns,

            detail: function (row) {
                return { action: 'CMS_DanhMucDuLieu/LayChiTiet', method: 'GET', strId: row.ID };
            },

            fields: fields,

            save: function (v, row) {
                var o = {
                    action: row ? 'CMS_DanhMucDuLieu/CapNhat' : 'CMS_DanhMucDuLieu/ThemMoi',
                    strMa: '', strTen: '',
                    strChung_TenDanhMuc_Cha_Id: v.strChung_TenDanhMuc_Cha_Id,
                    strCHUNG_TENDANHMUC_Id: tableId,
                    dHeSo1: 0, dHeSo2: 0, dHeSo3: 0,
                    strThongTin1: '', strThongTin2: '', strThongTin3: '',
                    strThongTin4: '', strThongTin5: '', strThongTin6: '',
                    strMoTa: v.strMoTa,
                    strId: row ? row.ID : '',
                    dTrangThai: 1,
                    strNguoiThucHien_Id: ''
                };
                defs.forEach(function (d) {
                    var val = v[d.k.key];
                    o[d.k.key] = d.k.num ? (val === '' || val === undefined ? 0 : val) : val;
                });
                return o;
            },

            remove: function (ids) {
                return {
                    action: 'CMS_DanhMucDuLieu/Xoa',
                    strId: ids.join(',') + ',',
                    strNguoiThucHien_Id: ''
                };
            },

            // genCombo_DMDL: ô "Dữ liệu cha" = toàn bộ dữ liệu vừa nạp (mỗi lần nạp lại
            // sau thêm / sửa / xoá cũng đổ lại, không gọi thêm máy chủ)
            onLoad: function () {
                ums.pat.fill(elData.querySelector('select[data-scope="form"][data-k="strChung_TenDanhMuc_Cha_Id"]'),
                    tatCa, { id: 'ID', name: 'TEN', head: '-- Chọn dữ liệu cha--' });
            }
        });

        /* Gõ tới đâu lọc tới đó (keyup của gốc) — không gọi lại máy chủ */
        elData.addEventListener('input', function (ev) {
            if (!ev.target.matches('[data-scope="filter"][data-k="q"]')) return;
            crud.rows = loc(tatCa);
            crud.total = crud.rows.length;
            crud.page = 1;
            crud.selected = {};
            crud.draw();
        });
    }

    loadTables();
})();
