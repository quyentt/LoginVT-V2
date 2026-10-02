/* =========================================================================
   Lớp học (danh sách LỚP QUẢN LÝ — thêm / sửa / xoá / phân nhóm lớp)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/lophoc/html/lophoc.html + script/lophoc.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): thanh tìm kiếm Hệ · Khóa · Chương trình · Bộ môn · Loại lớp · Nhóm lớp ·
   Ngành 1/2 · Cơ sở đào tạo · từ khoá · Tìm kiếm → khung "Danh sách lớp quản lý (n)" với Xóa · Phân
   nhóm lớp · Thêm mới: Mã lớp · Tên lớp · Số lượng · Loại lớp · Nhóm lớp · Khóa đào tạo · Chương
   trình · Khoa quản lý · Lớp mở ngành 1/2 · Cơ sở đào tạo · Sửa · ô đánh dấu (phân trang máy chủ).
   Thêm mới / Sửa → biểu mẫu thay chỗ danh sách (3 nhóm: Thông tin lớp quản lý · Thông tin đào tạo ·
   Chi tiết) + Đóng · Lưu và Nhập tiếp · Lưu. "Phân nhóm lớp" → hộp chọn Nhóm lớp.

   Lời gọi (chép nguyên):
       KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04 [pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy]
            POST danh sách: strTuKhoa, strDaoTao_CoSoDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strDaoTao_Nganh_Id
            (= ô Bộ môn), strDaoTao_KhoaQuanLy_Id (= ô Bộ môn), strDaoTao_LoaiLop_Id, strDaoTao_ToChucCT_Id,
            dLopMoNganh2, strNhomlop_Id, strNguoiThucHien_Id '', trang
       KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eDS4xEDQgLw04 [pkg_kehoach_thongtin.Them_DaoTao_LopQuanLy]   thêm
       KHCT_ThongTin_MH/EjQgHgUgLhUgLh4NLjEQNCAvDTgP [pkg_kehoach_thongtin.Sua_DaoTao_LopQuanLy]    sửa
       KHCT_LopQuanLy/LayChiTiet               GET  chi tiết khi Sửa (strId)
       KHCT_LopQuanLy/Xoa                      POST xoá các dòng đánh dấu — MỘT lời gọi, strIds nối dấu phẩy
       KHCT_LopQuanLy/Sua_DaoTao_LopQuanLy_Nhom POST phân nhóm — mỗi dòng đánh dấu một lời gọi
                                               (strDaoTao_LopQuanLy_Id, strNhomLop_Id, strChucNang_Id)
       KHCT_HeDaoTao/LayDanhSach               GET  ô Hệ
       KHCT_KhoaDaoTao/LayDanhSach             GET  ô Khóa (theo Hệ của thanh lọc — cả ô Khóa trong biểu mẫu)
       KHCT_ToChucChuongTrinh/LayDanhSach      GET  ô Chương trình: thanh lọc theo Khóa + Hệ (nhãn TEN - MACHUONGTRINH);
                                                    biểu mẫu theo Khóa của biểu mẫu (nhãn TEN - DAOTAO_N_CN_MA)
       edu.system.getList_CoCauToChuc          ô Bộ môn + Khoa quản lý (bản Corei — NS_HoSo_V2_MH … LayDanhSachToanBo)
       KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP [pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao]  ô Cơ sở
       danh mục KHCT.LOAILOP (Loại lớp), KHCT.NHOMLOP (Nhóm lớp)

   Khác bản gốc:
     · Lỗi gốc đã sửa: danh sách khai `strDaoTao_CoSoDaoTao_Id` HAI lần, lần sau đọc ô dropAAAA không tồn
       tại → ô lọc "Cơ sở đào tạo" chưa bao giờ có tác dụng. Bản mới gửi giá trị ô Cơ sở.
     · Lỗi gốc đã sửa: nút Xóa gắn HAI trình xử lý (một cái không hỏi lại, một cái đọc sai tiền tố id
       "check" → gửi thêm "One<ID>"). Bản mới: hỏi lại một lần, gửi đúng ID.
     · Hệ → Khóa → Chương trình (thanh lọc) và Khóa → Chương trình (biểu mẫu): chưa chọn cha thì KHOÁ
       con, đổi / xoá cha thì xoá trắng con (luật chung, ums.pat.chain). Gốc nạp sẵn toàn bộ Khóa.
     · Thêm mới điền sẵn từ thanh lọc như rewrite() gốc: Loại lớp, Khóa, Chương trình, Khoa quản lý
       (= ô Bộ môn), Nhóm lớp; Ngành 1. "Lưu và Nhập tiếp" cũng điền lại như vậy.
     · Phân nhóm lớp: kiểm có dòng đánh dấu TRƯỚC khi mở hộp (gốc mở hộp rồi mới báo).
     · Ô "Lớp mở ngành 1/2" (lọc + biểu mẫu) không xoá trắng được — gốc luôn gửi 0/1.
   Cố ý bỏ: ảnh trang trí img-class.svg cột phải của biểu mẫu (không có dữ liệu); .btnDelete trên dòng
   và .btnExtend (không có trên html); arrValid_LopHoc (kiểm ô dropChucDanh không có trên màn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('khct-lophoc');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function rows(call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; });
    }
    function fail(noi) { return function (err) { ums.api.handle(err, noi); }; }

    /* ---------- Nguồn dùng chung (lọc + biểu mẫu, tải một lần) ---------- */
    var srcHe = { call: { action: 'KHCT_HeDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HinhThucDaoTao_Id: '',
        strDaoTao_BacDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }, name: 'TENHEDAOTAO' };
    /* edu.system.getList_CoCauToChuc (Corei) — { strCCTC_Loai_Id '', strCCTC_Cha_Id '', iTrangThai 1 } */
    var srcCCTC = { call: { action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' }, name: 'TEN' };
    var srcCoSo = { call: { action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP', func: 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
        strTuKhoa: '', strNguoiThucHien_Id: ums.session.userId, pageIndex: 1, pageSize: 100000 }, name: 'TEN' };
    var srcNganh2 = { items: [{ ID: '0', TEN: 'Ngành 1' }, { ID: '1', TEN: 'Ngành 2' }] };

    function napKhoa(he) {
        return rows({ action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HeDaoTao_Id: e(he),
            strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 });
    }
    function napCT(khoa, he) {
        return rows({ action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: e(khoa),
            strDaoTao_HeDaoTao_Id: e(he), strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 });
    }

    var curId = '';
    var crud = ums.crud({
        root: root,
        title: 'Lớp học',
        formTitle: 'lớp quản lý',
        listTitle: 'Danh sách lớp quản lý',
        icon: 'fa-screen-users',
        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo', source: srcHe },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo' },
            { key: 'bm', type: 'select', label: 'Chọn bộ môn', source: srcCCTC },
            { key: 'loai', type: 'select', label: 'Chọn loại lớp', source: { dm: 'KHCT.LOAILOP' } },
            { key: 'nhom', type: 'select', label: 'Chọn nhóm lớp', source: { dm: 'KHCT.NHOMLOP' } },
            { key: 'ng2', type: 'select', label: 'Lớp mở ngành 1/2', source: srcNganh2, value: '0' },
            { key: 'coso', type: 'select', label: 'Chọn cơ sở đào tạo', source: srcCoSo },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
                    func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
                    strTuKhoa: f.q,
                    strDaoTao_CoSoDaoTao_Id: f.coso,
                    strDaoTao_KhoaDaoTao_Id: f.khoa,
                    strDaoTao_Nganh_Id: f.bm,
                    strDaoTao_KhoaQuanLy_Id: f.bm,
                    strDaoTao_LoaiLop_Id: f.loai,
                    strDaoTao_ToChucCT_Id: f.ct,
                    dLopMoNganh2: f.ng2 || '0',
                    strNhomlop_Id: f.nhom,
                    strNguoiThucHien_Id: ''
                };
            }
        },
        columns: [
            { title: 'Mã lớp', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên lớp', prop: 'TEN' },
            { title: 'Số lượng', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(e(r.SOLUONGTHUCTE) + '/' + e(r.SOLUONGKEHOACH)); } },
            { title: 'Loại lớp', prop: 'LOAILOP_TEN', cls: 'is-center' },
            { title: 'Nhóm lớp', prop: 'NHOMLOP_TEN' },
            { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
            { title: 'Lớp mở ngành 1/2', cls: 'is-center', render: function (r) { return String(r.LOPMONGANH2) === '1' ? 'Ngành 2' : ''; } },
            { title: 'Cơ sở đào tạo', prop: 'DAOTAO_COSODAOTAO_TEN', cls: 'is-center' }
        ],
        toolbar: [{ text: 'Phân nhóm lớp', icon: 'fa-screen-users', mod: 'primary', onClick: function (c) { phanNhom(c); } }],
        fields: [
            { type: 'legend', label: 'Thông tin lớp quản lý' },
            { key: 'strMa', col: 'MA', label: 'Mã lớp' },
            { key: 'strTen', col: 'TEN', label: 'Tên lớp' },
            { key: 'strLoaiLop_Id', col: 'LOAILOP_ID', label: 'Loại lớp', type: 'select', placeholder: 'Chọn loại lớp', source: { dm: 'KHCT.LOAILOP' } },
            { key: 'strNhomLop_Id', col: 'NHOMLOP_ID', label: 'Nhóm lớp', type: 'select', placeholder: 'Chọn nhóm lớp', source: { dm: 'KHCT.NHOMLOP' } },
            { type: 'legend', label: 'Thông tin đào tạo' },
            { key: 'strDaoTao_KhoaDaoTao_Id', col: 'DAOTAO_KHOADAOTAO_ID', label: 'Khóa đào tạo', type: 'select', placeholder: 'Chọn khóa đào tạo' },
            { key: 'strDaoTao_ToChucCT_Id', col: 'DAOTAO_TOCHUCCHUONGTRINH_ID', label: 'Chương trình', type: 'select', placeholder: 'Chọn chương trình' },
            { key: 'strDaoTao_KhoaQuanLy_Id', col: 'DAOTAO_KHOAQUANLY_ID', label: 'Khoa quản lý', type: 'select', placeholder: 'Chọn khoa quản lý', source: srcCCTC },
            { key: 'dLopMoNganh2', col: 'LOPMONGANH2', label: 'Lớp mở ngành 1/2', type: 'select', required: true, value: '0', source: srcNganh2 },
            { key: 'strDaoTao_CoSoDaoTao_Id', col: 'DAOTAO_COSODAOTAO_ID', label: 'Cơ sở đào tạo', type: 'select', placeholder: 'Chọn cơ sở đào tạo', source: srcCoSo },
            { type: 'legend', label: 'Chi tiết' },
            { key: 'dSoLuongKeHoach', col: 'SOLUONGKEHOACH', label: 'Số lượng kế hoạch', type: 'number' },
            { key: 'strThoiGianBatDau', col: 'THOIGIANBATDAU', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strThoiGianKetThuc', col: 'THOIGIANKETTHUC', label: 'Ngày kết thúc', type: 'date' }
        ],
        saveAgain: 'Lưu và Nhập tiếp',
        detail: function (row) {
            curId = row.ID;
            return { action: 'KHCT_LopQuanLy/LayChiTiet', method: 'GET', strId: row.ID };
        },
        save: function (v, row) {
            var o = {
                strId: row ? (row.ID || curId) : '',
                strTen: v.strTen,
                strMa: v.strMa,
                strDaoTao_KhoaDaoTao_Id: v.strDaoTao_KhoaDaoTao_Id,
                strDaoTao_CoSoDaoTao_Id: v.strDaoTao_CoSoDaoTao_Id,
                strDaoTao_ToChucCT_Id: v.strDaoTao_ToChucCT_Id,
                strThoiGianBatDau: v.strThoiGianBatDau,
                strNhomLop_Id: v.strNhomLop_Id,
                strThoiGianKetThuc: v.strThoiGianKetThuc,
                strLoaiLop_Id: v.strLoaiLop_Id,
                strDaoTao_KhoaQuanLy_Id: v.strDaoTao_KhoaQuanLy_Id,
                dSoLuongKeHoach: v.dSoLuongKeHoach,
                dLopMoNganh2: v.dLopMoNganh2,
                strNguoiThucHien_Id: ums.session.userId
            };
            o.action = row ? 'KHCT_ThongTin_MH/EjQgHgUgLhUgLh4NLjEQNCAvDTgP' : 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eDS4xEDQgLw04';
            o.func = row ? 'pkg_kehoach_thongtin.Sua_DaoTao_LopQuanLy' : 'pkg_kehoach_thongtin.Them_DaoTao_LopQuanLy';
            return o;
        },
        rowDelete: false,
        formDelete: false,
        removeText: 'Xóa',
        remove: function (ids) {
            return { action: 'KHCT_LopQuanLy/Xoa', strIds: ids.join(','), strNguoiThucHien_Id: ums.session.userId };
        },
        onForm: function (row) { moForm(row); }
    });

    function fEl(k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="filter"][data-k="' + k + '"]'); }
    function oEl(k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]'); }
    function datGT(el, v) { if (!el) return; el.value = e(v); if (window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh'); }

    /* ---------- Thanh lọc: Hệ → Khóa → Chương trình ---------- */
    var L = { he: fEl('he'), khoa: fEl('khoa'), ct: fEl('ct') };
    function locKhoa() {
        if (!L.he.value) { pat.fill(L.khoa, []); return Promise.resolve(); }
        return napKhoa(L.he.value).then(function (r) { pat.fill(L.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }, fail('nạp khóa đào tạo'));
    }
    function locCT() {
        if (!L.khoa.value) { pat.fill(L.ct, []); return Promise.resolve(); }
        return napCT(L.khoa.value, L.he.value).then(function (r) {
            pat.fill(L.ct, r, { head: 'Chọn chương trình đào tạo', name: function (x) { return e(x.TENCHUONGTRINH) + ' - ' + e(x.MACHUONGTRINH); } });
        }, fail('nạp chương trình'));
    }
    jQuery(L.he).on('select2:select select2:clear', function () { locKhoa().then(locCT); });
    jQuery(L.khoa).on('select2:select select2:clear', locCT);
    pat.chain([L.he, L.khoa, L.ct], { phatLai: false });
    /* Lớp mở ngành 1/2: luôn 0/1 như gốc (ô gốc không có mục trống) */
    ui.select2(fEl('ng2'), { placeholder: 'Lớp mở ngành 1/2', allowClear: false });

    /* ---------- Biểu mẫu: Khóa → Chương trình ---------- */
    var B = { khoa: oEl('strDaoTao_KhoaDaoTao_Id'), ct: oEl('strDaoTao_ToChucCT_Id') };
    function bmCT() {
        if (!B.khoa.value) { pat.fill(B.ct, []); return Promise.resolve(); }
        return napCT(B.khoa.value, '').then(function (r) {
            pat.fill(B.ct, r, { head: 'Chọn chương trình', name: function (x) { return e(x.TENCHUONGTRINH) + ' - ' + e(x.DAOTAO_N_CN_MA); } });
        }, fail('nạp chương trình'));
    }
    jQuery(B.khoa).on('select2:select select2:clear', bmCT);
    var chainB = pat.chain([B.khoa, B.ct], { phatLai: false });

    var moSeq = 0;
    function moForm(row) {
        var my = ++moSeq;
        var f = crud.filterValues();
        if (!row) {
            // rewrite() gốc: điền sẵn từ thanh lọc
            datGT(oEl('strLoaiLop_Id'), f.loai);
            datGT(oEl('strDaoTao_KhoaQuanLy_Id'), f.bm);
            datGT(oEl('strNhomLop_Id'), f.nhom);
            datGT(oEl('dLopMoNganh2'), '0');
        }
        var khoa = row ? row.DAOTAO_KHOADAOTAO_ID : f.khoa;
        var ct = row ? row.DAOTAO_TOCHUCCHUONGTRINH_ID : f.ct;
        // Ô Khóa của biểu mẫu = danh sách khóa theo Hệ của thanh lọc (genCombo_KhoaDaoTao gốc đổ cả hai ô)
        napKhoa(f.he).then(function (r) {
            if (my !== moSeq) return;
            pat.fill(B.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' });
            datGT(B.khoa, khoa);
            return bmCT().then(function () { if (my === moSeq) datGT(B.ct, ct); chainB.sync(); });
        }, fail('nạp khóa đào tạo'));
    }

    /* ---------- Phân nhóm lớp ---------- */
    function phanNhom(c) {
        var ds = c.pickedRows();
        if (!ds.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var dlg = ui.dialog({
            title: 'Phân nhóm lớp', icon: 'fa-screen-users', size: 'sm',
            body: ui.field('Nhóm lớp', '<select class="ums-select" data-pn="nhom" data-ph="Chọn nhóm lớp"><option value=""></option></select>'),
            buttons: [{ text: 'Phân nhóm lớp', mod: 'primary', icon: 'fa-screen-users', onClick: function (d) {
                var nhom = d.body.querySelector('[data-pn="nhom"]').value;
                ui.confirm('Bạn có muốn phân nhóm lớp cho ' + ds.length + ' lớp không?', { ok: 'Phân nhóm lớp', title: 'Phân nhóm lớp' }).then(function (yes) {
                    if (!yes) return;
                    d.close();
                    ui.batch(ds.map(function (r) {
                        return { action: 'KHCT_LopQuanLy/Sua_DaoTao_LopQuanLy_Nhom', strDaoTao_LopQuanLy_Id: r.ID, strNhomLop_Id: nhom,
                            strNguoiThucHien_Id: ums.session.userId, strChucNang_Id: ums.state.chucNangId };
                    }), { title: 'Đang phân nhóm lớp', okText: 'Phân nhóm thành công' }).then(function () { c.load(); });
                });
                return false;
            } }]
        });
        var sel = dlg.body.querySelector('[data-pn="nhom"]');
        ui.enhance(dlg.body);
        ums.api.dm('KHCT.NHOMLOP').then(function (r) { pat.fill(sel, r, { head: pat.dmTitle(r) || 'Chọn nhóm lớp' }); }, fail('nạp nhóm lớp'));
    }
})();
