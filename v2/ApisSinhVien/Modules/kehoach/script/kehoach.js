/* =========================================================================
   Kế hoạch — kế hoạch nhập / xác nhận hồ sơ người học (SV_KeHoach_*)
   Bản gốc: ApisSinhVien/Modules/kehoach/html/kehoach.html + script/kehoach.js (lớp KeHoachXuLy)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus):
       #zonebatdau    thanh lọc (từ khoá) + "Danh sách kế hoạch"      → ums.crud (danh sách)
       #zoneEdit      thêm / sửa kế hoạch + "Cán bộ phân công xét" + "Danh sách học sinh - sinh viên xét duyệt"
                                                                       → biểu mẫu ums.crud + vùng extra
       #zonePhanQuyen "Phân quyền nhập thông tin" (nút "Phân quyền" trên dòng) → vùng pq (ums.pat.rows)

   Lời gọi (kiểu cũ, chép nguyên):
     SV_KeHoach_NguoiHoc/LayDanhSach  GET  strTuKhoa · strPhanLoai_Id '' · strDaoTao_ThoiGianDaoTao_Id '' (gốc đọc hai ô
                                           đã chú thích bỏ khỏi html) · strNguoiDung_Id '' · strNguoiTao_Id '' · pageIndex · pageSize
         → ID · MOTA · TUNGAY · DENNGAY · KETQUACHINHTHUC
     SV_KeHoach_NguoiHoc/ThemMoi | CapNhat   strId · strChucNang_Id · strTen · strMoTa (= CHÍNH ô Tên, như gốc) ·
                                           strTuNgay · strDenNgay · dXacNhanThongTin 1 · strNguoiThucHien_Id
     SV_KeHoach_PhamVi/LayDanhSach    GET  strTuKhoa '' · strQLSV_KeHoach_NguoiHoc_Id · strNguoiTao_Id '' · pageIndex · pageSize
     SV_KeHoach_PhamVi/ThemMoi        (sau khi lưu kế hoạch, mỗi SV mới) strId '' · strChucNang_Id · strQLSV_KeHoach_NguoiHoc_Id ·
                                           strQLSV_NguoiHoc_Id · strDaoTao_ChuongTrinh_Id (= DAOTAO_TOCHUCCHUONGTRINH_ID) ·
                                           strNguoiThucHien_Id · strDaoTao_LopQuanLy_Id · strDaoTao_KhoaDaoTao_Id
     SV_KeHoach_PhamVi/Them_QLSV_KeHoach_PhamViKhoa | PhamViCT | PhamViLop  ("Thêm từng khóa / chương trình / lớp")
                                           strId '' · strChucNang_Id · strQLSV_KeHoach_NguoiHoc_Id · strDaoTao_KhoaDaoTao_Id |
                                           strDaoTao_ChuongTrinh_Id | strDaoTao_LopQuanLy_Id · strNguoiThucHien_Id
     SV_KeHoach_PhamVi/Xoa            strIds (mỗi dòng SV đã chọn một lời gọi)
     SV_KeHoach_PhanQuyen/LayDanhSach GET  strTuKhoa '' · strQLSV_KeHoach_NguoiHoc_Id · strTruongThongTin_Id '' · strNguoiTao_Id '' ·
                                           pageIndex 1 · pageSize 200000 → ID · TRUONGTHONGTIN_ID · MOTA · THUTU · DORONG · BATBUOC
     SV_KeHoach_PhanQuyen/ThemMoi | CapNhat  strId · strMoTa · strQLSV_KeHoach_NguoiHoc_Id · strTruongThongTin_Id · iThuTu ·
                                           dDoRong · dBatBuoc · strNguoiThucHien_Id (dòng chưa chọn trường thông tin thì bỏ qua)
     SV_KeHoach_PhanQuyen/Xoa         strIds
     Danh mục: QLSV.TRUONGTHONGTIN (tên ô = THONGTIN6 - TEN - MA như gốc).
   Hộp chọn sinh viên (edu.extend.genModal_SinhVien của Corei): ums.pat.pickSinhVien bản đầy đủ, nguồn như Corei —
     SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc; "Thêm từng khóa / chương trình / lớp" của hộp chung
     (bấm lại cùng loại thì THAY danh sách cũ — gốc gán đè me.arrKhoa…), hiện dòng "Áp dụng cho …" như gốc.

   Lỗi gốc — làm theo ý định / bỏ:
     · Nút "Xóa" của DANH SÁCH KẾ HOẠCH gọi SV_KeHoach_PhamVi/Xoa với ID KẾ HOẠCH (xoá phạm vi, không xoá kế hoạch;
       báo "Xóa thành công" dù không xoá gì). Không có lời gọi xoá kế hoạch nào trong gốc → BỎ nút này (không đoán
       action). Ghi sổ cần quyết.
     · Khối "Cán bộ phân công xét": gốc cho chọn cán bộ nhưng lời gọi lưu (save_ThanhVien) và nạp (getList_ThanhVien)
       đều bị chú thích bỏ → cán bộ chọn xong KHÔNG được lưu. Giữ khối, nút "Thêm cán bộ" đặt disabled.
     · Lưu kế hoạch mới xong gốc vẫn đứng ở biểu mẫu với ID rỗng → bấm Lưu lần hai là THÊM TRÙNG. Ở đây lưu xong về
       danh sách (ums.crud).
     · Phân quyền: lưu xong nạp lại (gốc giữ id tạm 30 ký tự → Lưu lần hai THÊM TRÙNG mọi dòng mới); kế hoạch chưa có
       dòng nào thì vẫn vẽ 2 dòng trống (gốc để nguyên bảng của kế hoạch mở trước).
   Cố ý bỏ (mã chết): arrValid (kiểm ô txtKeHoachXuLy_So không có trên màn), #myModal / btnDSDoiTuong / getList_QuanSoTheoLop
     (TN_KeHoach_PhamVi — không có nút mở), getList_PhanCong / getList_DoiTuong, các getList_HeDaoTao… / cbGenCombo_* đổ vào
     ô không có, KHCT_NamNhapHoc, TN.PHANLOAI (ô lọc phân loại đã chú thích bỏ khỏi html).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('sv-kehoach');
    if (!root) return;

    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }
    function hoTen(r) { return (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim(); }

    root.innerHTML = '<div data-z="ds"></div><div data-z="pq" hidden></div>';
    var zDs = root.querySelector('[data-z="ds"]'), zPq = root.querySelector('[data-z="pq"]');

    /* ---------- Trạng thái biểu mẫu ----------------------------------------- */
    var st = { id: '', page: 1, size: 10, total: 0, saved: [], moi: [], nhom: {}, extra: null };
    var NHAN = { khoa: 'Áp dụng cho khóa', ct: 'Áp dụng cho chương trình', lop: 'Áp dụng cho lớp' };

    var crud = ums.crud({
        root: zDs,
        title: 'Kế hoạch',
        formTitle: 'kế hoạch',
        listTitle: 'Danh sách kế hoạch',
        icon: 'fa-list-timeline',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'SV_KeHoach_NguoiHoc/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q, strPhanLoai_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strNguoiDung_Id: '', strNguoiTao_Id: '' };
            }
        },
        columns: [
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
            { title: 'Xác nhận thông tin', cls: 'is-center', render: function (r) {
                return r.KETQUACHINHTHUC
                    ? ui.badge('Cần cán bộ xác nhận thì mới cập nhật vào hồ sơ gốc', 'warn')
                    : ui.badge('Không cần xác nhận, cập nhật luôn vào hồ sơ gốc', 'info');
            } },
            { title: 'Phân quyền nhập', cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('edit', { text: 'Phân quyền', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': 'pq', 'data-id': r.ID } });
            } }
        ],
        formCols: 2,
        fields: [
            { type: 'legend', label: 'Thông tin kế hoạch' },
            { key: 'strTen', col: 'MOTA', label: 'Tên kế hoạch', span: true },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' }
        ],
        onForm: function (row, c, extra) {
            st.id = row ? row.ID : '';
            st.page = 1; st.total = 0; st.saved = []; st.moi = []; st.nhom = {};
            st.extra = extra;
            extra.innerHTML =
                pat.panel({ title: 'Cán bộ phân công xét', icon: 'fa-user-tie', flush: true, zone: 'cb',
                    tools: '<button type="button" class="ums-btn ums-btn--out-success" disabled title="Bản gốc không lưu cán bộ phân công (lời gọi lưu đã bị tắt)">' +
                        '<i class="fa-light fa-plus"></i><span>Thêm cán bộ</span></button>' }) +
                pat.panel({ title: 'Danh sách học sinh - sinh viên xét duyệt', icon: 'fa-users', count: 'svn', flush: true, zone: 'sv',
                    tools: ui.xoaChon('input[data-khsv]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'sv-xoa' } }) +
                        ui.btn('add', { text: 'Thêm thành viên', mod: 'out-success', attr: { 'data-a': 'sv-them' } }),
                    foot: '<div class="ums-u-fz13 ums-u-muted" data-z="nhom"></div>' });
            ui.table({ el: extra.querySelector('[data-z="cb"]'), rows: [], empty: 'Chưa có cán bộ phân công',
                columns: [{ title: 'Mã số' }, { title: 'Họ tên' }, { title: 'Xóa', cls: 'is-center', width: '64px' }] });
            veSV();
            if (st.id) taiSV(1);
        },
        save: function (v, row) {
            st.id = row ? row.ID : '';
            return {
                action: 'SV_KeHoach_NguoiHoc/' + (row ? 'CapNhat' : 'ThemMoi'),
                strId: row ? row.ID : '',
                strChucNang_Id: '',
                strTen: v.strTen,
                strMoTa: v.strTen,
                strTuNgay: v.strTuNgay,
                strDenNgay: v.strDenNgay,
                dXacNhanThongTin: 1,
                strNguoiThucHien_Id: ''
            };
        },
        onSaved: function (c, result) {
            var id = st.id || (result && result.raw && result.raw.Id) || '';
            luuPhamVi(id);
        }
    });

    /* ---------- Danh sách SV của kế hoạch (vùng extra) ------------------------ */
    function sv(k) { return st.extra ? st.extra.querySelector('[data-z="' + k + '"]') : null; }
    function taiSV(p) {
        if (p) st.page = p;
        var host = sv('sv'), id = st.id;
        if (!host) return;
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'SV_KeHoach_PhamVi/LayDanhSach', method: 'GET',
            strTuKhoa: '', strQLSV_KeHoach_NguoiHoc_Id: id, strNguoiTao_Id: '', pageIndex: st.page, pageSize: st.size
        }).then(function (r) {
            if (id !== st.id) return;
            st.saved = arr(r.data);
            st.total = Number(r.pager) || st.saved.length;
            veSV();
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên của kế hoạch'); });
    }
    function veSV() {
        var host = sv('sv');
        if (!host) return;
        var rows = st.saved.map(function (r) { return { r: r }; }).concat(st.moi.map(function (m) { return { m: m }; }));
        var n = sv('svn');
        if (n) n.textContent = '(' + (st.total + st.moi.length) + ')';
        function g(x, k) { return esc(e((x.r || x.m)[k])); }
        ui.table({
            el: host, rows: rows, empty: 'Chưa có sinh viên xét duyệt',
            page: st.id ? { index: st.page, size: st.size, total: st.total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) taiSV(p); },
                onSize: function (v) { st.size = v === 'all' ? ui.PAGE_ALL : Number(v); taiSV(1); } } : null,
            columns: [
                { title: 'Mã số', cls: 'is-nowrap', render: function (x) {
                    return g(x, 'QLSV_NGUOIHOC_MASO') + (x.m ? ' ' + ui.badge('chưa lưu', 'mute') : '');
                } },
                { title: 'Họ tên', render: function (x) { return esc(hoTen(x.r || x.m)); } },
                { title: 'Lớp', render: function (x) { return g(x, 'DAOTAO_LOPQUANLY_TEN'); } },
                { title: 'Chương trình', render: function (x) { return g(x, 'DAOTAO_CHUONGTRINH_TEN'); } },
                { title: 'Khóa', render: function (x) { return g(x, 'DAOTAO_KHOADAOTAO_TEN'); } },
                { title: 'Khoa', render: function (x) { return g(x, 'DAOTAO_KHOAQUANLY_TEN'); } },
                { title: 'Hệ', render: function (x) { return g(x, 'DAOTAO_HEDAOTAO_TEN'); } },
                { head: '<input type="checkbox" data-khsvall title="Chọn tất cả">', cls: 'is-center', width: '56px', render: function (x) {
                    return x.r ? '<input type="checkbox" data-khsv="' + esc(x.r.ID) + '">'
                        : '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="sv-bo" data-id="' + esc(x.m.QLSV_NGUOIHOC_ID) +
                          '" title="Bỏ dòng chưa lưu"><i class="fa-light fa-trash-can"></i></button>';
                } }
            ]
        });
        var nh = sv('nhom');
        if (nh) nh.innerHTML = Object.keys(st.nhom).filter(function (k) { return st.nhom[k].ids.length; }).map(function (k) {
            return '<div>' + esc(NHAN[k]) + ': <b>' + esc(st.nhom[k].names.join(', ')) + '</b></div>';
        }).join('');
    }
    function themSV() {
        function nhom(kind) {
            return function (ids, params, dlg) {
                var list = ids ? String(ids).split(',') : [];
                if (!list.length) return;
                var s = dlg.body.querySelector('[data-f="' + kind + '"]');
                var names = s ? Array.prototype.filter.call(s.options, function (o) { return o.selected && o.value; }).map(function (o) { return o.text; }) : [];
                st.nhom[kind] = { ids: list, names: names };
                dlg.close();
                ui.toast(NHAN[kind] + ': ' + names.join(', '), 'ok');
                veSV();
            };
        }
        pat.pickSinhVien({
            filters: true,
            status: function (el) { return pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3, what: 'trạng thái sinh viên' }); },
            call: function (p, page, size) {
                return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                    strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: '',
                    strDaoTao_HeDaoTao_Id: p.strHeDaoTao_Id, strDaoTao_KhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                    strDaoTao_ChuongTrinh_Id: p.strChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: p.strLopQuanLy_Id,
                    strStudyStatus_Ids: p.strTrangThaiNguoiHoc_Id, dIsPrimary: '', dBoQuaPhamVi: '', pageIndex: page, pageSize: size };
            },
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc(hoTen(r)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
            ],
            group: { khoa: nhom('khoa'), chuongTrinh: nhom('ct'), lop: nhom('lop') },
            onPick: function (rows) {
                var co = {}, bo = 0;
                st.saved.forEach(function (r) { co[r.QLSV_NGUOIHOC_ID] = 1; });
                st.moi.forEach(function (r) { co[r.QLSV_NGUOIHOC_ID] = 1; });
                rows.forEach(function (r) {
                    if (co[r.QLSV_NGUOIHOC_ID]) { bo++; return; }
                    co[r.QLSV_NGUOIHOC_ID] = 1;
                    st.moi.push(r);
                });
                if (bo) ui.toast('Đã tồn tại: ' + bo + ' sinh viên', 'warn');
                veSV();
            }
        });
    }
    function xoaSV() {
        var ids = qa(sv('sv'), 'input[data-khsv]:checked').map(function (x) { return x.getAttribute('data-khsv'); });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá sinh viên khỏi kế hoạch' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) { return { action: 'SV_KeHoach_PhamVi/Xoa', strIds: id, strNguoiThucHien_Id: '' }; }),
                { title: 'Đang xoá', okText: 'Xóa thành công!', show: true }).then(function () { taiSV(); });
        });
    }
    /** Sau khi lưu kế hoạch: SV mới + khoá / CT / lớp (save_SinhVien, save_Khoa, save_ChuongTrinh, save_Lop của gốc) */
    function luuPhamVi(id) {
        if (!id) return;
        var calls = st.moi.map(function (a) {
            return { action: 'SV_KeHoach_PhamVi/ThemMoi', strId: '', strChucNang_Id: '', strQLSV_KeHoach_NguoiHoc_Id: id,
                strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: a.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: '',
                strDaoTao_LopQuanLy_Id: a.DAOTAO_LOPQUANLY_ID, strDaoTao_KhoaDaoTao_Id: a.DAOTAO_KHOADAOTAO_ID };
        });
        var MAP = { khoa: ['Them_QLSV_KeHoach_PhamViKhoa', 'strDaoTao_KhoaDaoTao_Id'],
            ct: ['Them_QLSV_KeHoach_PhamViCT', 'strDaoTao_ChuongTrinh_Id'], lop: ['Them_QLSV_KeHoach_PhamViLop', 'strDaoTao_LopQuanLy_Id'] };
        ['khoa', 'ct', 'lop'].forEach(function (k) {
            ((st.nhom[k] || {}).ids || []).forEach(function (x) {
                var c = { action: 'SV_KeHoach_PhamVi/' + MAP[k][0], strId: '', strChucNang_Id: '', strQLSV_KeHoach_NguoiHoc_Id: id, strNguoiThucHien_Id: '' };
                c[MAP[k][1]] = x;
                calls.push(c);
            });
        });
        st.moi = []; st.nhom = {};
        if (calls.length) ui.batch(calls, { title: 'Đang thêm sinh viên vào kế hoạch', okText: 'Thêm sinh viên thành công!', show: true })
            .then(function () { crud.load(); });
    }

    zDs.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.hasAttribute && t.hasAttribute('data-khsvall')) qa(sv('sv'), 'input[data-khsv]').forEach(function (x) { x.checked = t.checked; });
    });

    /* ---------- Phân quyền nhập thông tin (#zonePhanQuyen) --------------------- */
    var pqId = '';
    function tenTT(r) { return (r.THONGTIN6 ? r.THONGTIN6 + ' - ' : '') + e(r.TEN) + ' - ' + e(r.MA); }
    var luoi = pat.rows(zPq, {
        title: 'Phân quyền nhập thông tin', icon: 'fa-user-lock',
        tools: ui.btn('close', { attr: { 'data-a': 'pq-dong' } }) + ui.btn('save', { attr: { 'data-a': 'pq-luu' } }),
        minRows: 2,
        columns: [
            { key: 'strTruongThongTin_Id', col: 'TRUONGTHONGTIN_ID', title: 'Trường thông tin', type: 'select', s2: true,
              placeholder: 'Chọn trường thông tin', source: { dm: 'QLSV.TRUONGTHONGTIN', name: tenTT } },
            { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' },
            { key: 'iThuTu', col: 'THUTU', title: 'Thứ tự', width: '90px' },
            { key: 'dDoRong', col: 'DORONG', title: 'Độ rộng', width: '90px' },
            { key: 'dBatBuoc', col: 'BATBUOC', title: 'Bắt buộc', width: '90px' }
        ],
        list: function (id) {
            return { action: 'SV_KeHoach_PhanQuyen/LayDanhSach', method: 'GET', strTuKhoa: '', strQLSV_KeHoach_NguoiHoc_Id: id,
                strTruongThongTin_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 200000 };
        },
        filled: function (v) { return !!v.strTruongThongTin_Id; },
        save: function (v, rec, id) {
            return { action: 'SV_KeHoach_PhanQuyen/' + (rec ? 'CapNhat' : 'ThemMoi'), strId: rec ? rec.ID : '', strMoTa: v.strMoTa,
                strQLSV_KeHoach_NguoiHoc_Id: id, strTruongThongTin_Id: v.strTruongThongTin_Id, iThuTu: v.iThuTu, dDoRong: v.dDoRong,
                dBatBuoc: v.dBatBuoc, strNguoiThucHien_Id: '' };
        },
        remove: function (rec) { return { action: 'SV_KeHoach_PhanQuyen/Xoa', strIds: rec.ID, strNguoiThucHien_Id: '' }; }
    });
    function moPQ(r) {
        pqId = r.ID;
        var t = zPq.querySelector('.ums-panel__title');
        if (t) t.innerHTML = '<i class="fa-light fa-user-lock"></i> Phân quyền nhập thông tin — ' + esc(e(r.MOTA));
        luoi.load(pqId);
        ui.swap(zDs, zPq);
    }
    function dongPQ() { ui.swap(zPq, zDs); crud.load(); }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        var id = b.getAttribute('data-id');
        switch (b.getAttribute('data-a')) {
            case 'pq':
                var r = crud.rows.filter(function (x) { return String(x.ID) === String(id); })[0];
                if (r) moPQ(r);
                break;
            case 'pq-dong': dongPQ(); break;
            case 'pq-luu':
                luoi.save(pqId).then(function () { ui.toast('Cập nhật thành công!', 'ok'); luoi.load(pqId); });
                break;
            case 'sv-them': themSV(); break;
            case 'sv-xoa': xoaSV(); break;
            case 'sv-bo':
                st.moi = st.moi.filter(function (m) { return String(m.QLSV_NGUOIHOC_ID) !== String(id); });
                veSV();
                break;
        }
    });
})();
