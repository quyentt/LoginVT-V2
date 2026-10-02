/* =========================================================================
   Cơ sở áp dụng (lương cơ sở áp dụng cho từng cán bộ)
   Bản gốc: ApisNhanSu/Modules/luong/script/cosoapdung.js (html gốc nạp "CoSoApDung.js").
   Màn "Khoản không tính" (html/khoankhongtinh.html) gốc là BẢN SAO y hệt html này và nạp
   CHÍNH tệp .js này → bản mới cũng dùng chung tệp; tiêu đề lấy từ data-tieu-de của thẻ gốc.
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc (Đơn vị → Thành viên, từ khoá) + danh sách (ums.crud);
   "Sửa" = biểu mẫu một cán bộ (thay chỗ danh sách); "Thêm mới" = biểu mẫu nhiều cán bộ
   (Phân loại + bảng "Danh sách nhân sự kèm theo" chọn bằng ums.pat.pickNhanSu, mỗi dòng
   Ngày áp dụng / Mức áp dụng) — thay chỗ danh sách như gốc (zoneEdit).
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_NhanSu_LuongCoSo_ApDung/LayDanhSach  GET  strTuKhoa, strPhanLoaiApDung_Id '' (gốc dropAAAA),
                                                   strDaoTao_CoCauToChuc_Id, strNhansu_HoSoCanBo_Id (chữ s thường — chép nguyên),
                                                   strNguoiTao_Id '', pageIndex, pageSize
       L_NhanSu_LuongCoSo_ApDung/ThemMoi      POST mỗi nhân sự đã chọn: strId '', strNhanSu_HoSoCanBo_Id,
                                                   strPhanLoaiApDung_Id, strDaoTao_CoCauToChuc_Id '' (gốc dropAAAA),
                                                   strNgayApDung, dMucApDung, strNguoiThucHien_Id
       L_NhanSu_LuongCoSo_ApDung/CapNhat      POST sửa: strId, strNhanSu_HoSoCanBo_Id + strDaoTao_CoCauToChuc_Id của dòng,
                                                   strPhanLoaiApDung_Id, strNgayApDung, dMucApDung
       L_NhanSu_LuongCoSo_ApDung/Xoa          strIds (từng dòng đã đánh dấu), strChucNang_Id (tầng API tự điền)
       NS_HoSoV2/LayDanhSach                  GET  ô Thành viên theo đơn vị (dLaCanBoNgoaiTruong -1)
   Danh mục: NHANSU.LUONG.PHANLOAILUONGAPDUNG. "Xuất báo cáo" / Import: ums.report (cùng bộ khoá gốc;
   các ô gốc đọc mà không có trên màn gửi rỗng; strNhanSu_HoSoCanBo_Id đọc ô checkHS không tồn tại → không gửi).
   Khác gốc:
     · Đơn vị → Thành viên: khoá Thành viên khi chưa chọn đơn vị, chọn/xoá đơn vị thì xoá trắng
       (luật chung; gốc nạp sẵn toàn bộ thành viên).
     · Chọn nhân sự: ums.pat.pickNhanSu (gốc genModal_NhanSu tự dựng — cùng getList_NhanSu),
       mặc định "Cán bộ trong trường" như gốc.
     · Lưu thêm mới khi chưa chọn nhân sự nào thì báo (gốc im lặng).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('cosoapdung');
    if (!root) return;
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'L_NhanSu_LuongCoSo_ApDung';
    var PL = { dm: 'NHANSU.LUONG.PHANLOAILUONGAPDUNG' };
    var tieuDe = root.getAttribute('data-tieu-de') || 'Cơ sở áp dụng';

    root.innerHTML = '<div data-z="crud"></div><div data-z="themform" hidden></div>';
    var zCrud = root.querySelector('[data-z="crud"]'), zThem = root.querySelector('[data-z="themform"]');

    var crud = ums.crud({
        root: zCrud,
        title: tieuDe,
        listTitle: 'Danh sách',
        formTitle: 'lương cơ sở',
        icon: 'fa-building',
        canAdd: false,
        toolbar: [{ text: 'Thêm mới', icon: 'fa-plus', mod: 'add', onClick: function () { moThem(); } }],
        formCols: 1,
        rowDelete: false,
        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: { call: {
                action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
                dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' } } },
            { key: 'tv', type: 'select', label: 'Chọn thành viên' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strPhanLoaiApDung_Id: '', strDaoTao_CoCauToChuc_Id: f.dv,
                    strNhansu_HoSoCanBo_Id: f.tv, strNguoiTao_Id: '' };
            }
        },
        columns: [
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc(e(r.NHANSU_HOSOCANBO_HODEM) + ' ' + e(r.NHANSU_HOSOCANBO_TEN)); } },
            { title: 'Ngày sinh', prop: 'NHANSU_HOSOCANBO_NGAYSINH', cls: 'is-center' },
            { title: 'Mã số thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE' },
            { title: 'Phân loại', prop: 'PHANLOAIAPDUNG_TEN' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center' },
            { title: 'Mức áp dụng', cls: 'is-right', render: function (r) { return r.MUCAPDUNG === null || r.MUCAPDUNG === undefined || r.MUCAPDUNG === '' ? '' : ui.money(r.MUCAPDUNG); } }
        ],
        fields: [
            { key: '_nhom', type: 'legend', label: '1) Nhóm thông tin cơ bản' },
            { key: '_dv', type: 'static', col: 'DAOTAO_COCAUTOCHUC_TEN', label: 'Đơn vị' },
            { key: '_ma', type: 'static', col: 'NHANSU_HOSOCANBO_MASO', label: 'Mã số' },
            { key: '_ten', type: 'static', label: 'Họ tên', get: function (r) { return e(r.NHANSU_HOSOCANBO_HODEM) + ' ' + e(r.NHANSU_HOSOCANBO_TEN); } },
            { key: 'strPhanLoaiApDung_Id', col: 'PHANLOAIAPDUNG_ID', label: 'Phân loại', type: 'select', source: PL, placeholder: '-- Chọn loại khoản --' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
            { key: 'dMucApDung', col: 'MUCAPDUNG', label: 'Mức áp dụng' }
        ],
        save: function (v, row) {
            if (!row) return null;                   // thêm mới đi biểu mẫu nhiều nhân sự (dưới)
            return {
                action: C + '/CapNhat',
                strId: row.ID,
                strNhanSu_HoSoCanBo_Id: row.NHANSU_HOSOCANBO_ID,
                strPhanLoaiApDung_Id: v.strPhanLoaiApDung_Id,
                strDaoTao_CoCauToChuc_Id: row.DAOTAO_COCAUTOCHUC_ID,
                strNgayApDung: v.strNgayApDung,
                dMucApDung: v.dMucApDung,
                strNguoiThucHien_Id: uid()
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
    });

    /* ---- Đơn vị → Thành viên (ô lọc của crud) ----------------------------- */
    var fDv = zCrud.querySelector('[data-scope="filter"][data-k="dv"]'), fTv = zCrud.querySelector('[data-scope="filter"][data-k="tv"]');
    if (window.jQuery && fDv && fTv) {
        jQuery(fDv).on('select2:select select2:clear', function () {
            if (!fDv.value) { pat.fill(fTv, [], { head: 'Chọn thành viên' }); return; }
            ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 100000,
                strDaoTao_CoCauToChuc_Id: fDv.value, strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: -1 })
                .then(function (r) { pat.fill(fTv, Array.isArray(r.data) ? r.data : [], { head: 'Chọn thành viên', name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } }); })
                .catch(function (err) { ums.api.handle(err, 'danh sách thành viên'); });
        });
        pat.chain([fDv, fTv], { phatLai: false });
    }

    /* ---- "Xuất báo cáo" / Import — mẫu của chức năng ------------------------ */
    var rp = document.createElement('span');
    crud.z('actions').insertBefore(rp, crud.z('actions').firstChild);
    ums.report.mount(rp, {
        collect: function (add) {
            var f = crud.filterValues();
            add('strTuKhoa', '');                          // gốc đọc txtSearch_CoSoApDung_TuKhoa — không có trên màn
            add('strDaoTao_CoCauToChuc_Id', f.dv);
            add('strNgayPhatSinh_TuNgay', '');
            add('strNgayPhatSinh_DenNgay', '');
            add('strSearch_NhanSu_HoSoCanBo_Id', f.tv);
            add('strNam', '');
            add('dLaCanBoNgoaiTruong', '');
            add('strNamXuatChungTu', '');
        },
        onImported: function () { crud.load(); }
    });

    /* ---- Thêm mới: nhiều nhân sự một lần ------------------------------------ */
    var chon = [];                                   // [{ ID, ten, ma, ngay, muc }]
    zThem.innerHTML = pat.panel({
        title: 'Lương cơ sở', icon: 'fa-pen-to-square',
        tools: ui.btn('close', { attr: { 'data-a': 'dongThem' } }) + ui.btn('save', { attr: { 'data-a': 'luuThem' } }),
        body: '<div class="ums-grid ums-grid--3 ums-u-mb-4">' +
            ui.field('Phân loại', '<select class="ums-select" data-scope="form" data-k="strPhanLoaiApDung_Id" data-ph="-- Chọn loại khoản --"><option value=""></option></select>') +
            '</div>' +
            '<div class="ums-filter ums-u-mb-2"><div class="ums-field ums-u-flex1"><div class="ums-legend ums-u-mb-0">1) Danh sách nhân sự kèm theo</div></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Chọn nhân sự', icon: 'fa-user-plus', mod: 'out-success', attr: { 'data-a': 'chonNS' } }) + '</div></div>' +
            '<div data-z="nsBang"></div>'
    });
    ui.enhance(zThem);
    var elPL = zThem.querySelector('[data-k="strPhanLoaiApDung_Id"]');
    ums.api.dm(PL.dm).then(function (r) { pat.fill(elPL, r, { head: '-- Chọn loại khoản --' }); }).catch(function () {});

    function docO() {
        chon.forEach(function (x, i) {
            var n = zThem.querySelector('[data-nd="' + i + '"]'), m = zThem.querySelector('[data-nm="' + i + '"]');
            if (n) x.ngay = n.value.trim();
            if (m) x.muc = m.value.trim();
        });
    }
    function veNS() {
        ui.table({
            el: zThem.querySelector('[data-z="nsBang"]'), rows: chon, empty: 'Không tìm thấy dữ liệu!', tableCls: 'ums-table--lined ums-table--tight',
            columns: [
                { title: 'Họ tên', render: function (x) { return esc(x.ten) + ' - ' + esc(x.ma); } },
                { title: 'Ngày áp dụng', width: '180px', render: function (x, i) {
                    return '<input class="ums-input ums-input--sm" data-date data-nd="' + i + '" value="' + esc(x.ngay) + '" placeholder="dd/mm/yyyy" autocomplete="off">'; } },
                { title: 'Mức áp dụng', width: '180px', render: function (x, i) {
                    return '<input class="ums-input ums-input--sm" data-nm="' + i + '" value="' + esc(x.muc) + '" autocomplete="off">'; } },
                { title: 'Xóa', cls: 'is-actions', width: '56px', render: function (x, i) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-bo="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>'; } }
            ]
        });
        ui.enhance(zThem);
    }
    function moThem() {
        chon = [];
        elPL.value = ''; if (window.jQuery) jQuery(elPL).trigger('change.select2');
        veNS();
        crud.z('actions').hidden = true;
        ui.swap(crud.z('list'), zThem);
    }
    function dongThem() {
        crud.z('actions').hidden = false;
        ui.swap(zThem, crud.z('list'));
    }
    function luuThem() {
        docO();
        if (!chon.length) { ui.toast('Chưa chọn nhân sự nào', 'warn'); return; }
        var calls = chon.map(function (x) {
            return {
                action: C + '/ThemMoi',
                strId: '',
                strNhanSu_HoSoCanBo_Id: x.ID,
                strPhanLoaiApDung_Id: elPL.value,
                strDaoTao_CoCauToChuc_Id: '',
                strNgayApDung: x.ngay,
                dMucApDung: x.muc,
                strNguoiThucHien_Id: uid()
            };
        });
        ui.batch(calls, { title: 'Đang lưu lương cơ sở áp dụng', okText: 'Thêm mới thành công!', show: true }).then(function () {
            dongThem();
            crud.load();
        });
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a], [data-bo]');
        if (!b || !zThem.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'dongThem') dongThem();
        else if (a === 'luuThem') luuThem();
        else if (a === 'chonNS') {
            docO();
            pat.pickNhanSu({
                title: 'Tìm kiếm nhân sự', loaiCanBo: '0',
                onPick: function (rows) {
                    var co = {};
                    chon.forEach(function (x) { co[x.ID] = true; });
                    var trung = 0;
                    rows.forEach(function (r) {
                        if (co[r.ID]) { trung++; return; }
                        chon.push({ ID: r.ID, ten: e(r.HOTEN) || (e(r.HODEM) + ' ' + e(r.TEN)), ma: e(r.MASO), ngay: '', muc: '' });
                    });
                    if (trung) ui.toast(trung + ' nhân sự đã tồn tại!', 'warn');
                    veNS();
                }
            });
        } else if (b.hasAttribute('data-bo')) {
            docO();
            chon.splice(Number(b.getAttribute('data-bo')), 1);
            veNS();
        }
    });
})();
