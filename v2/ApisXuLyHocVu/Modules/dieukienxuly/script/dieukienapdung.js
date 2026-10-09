/* =========================================================================
   Điều kiện xử lý áp dụng (theo khoá đào tạo × thời gian)
   Bản gốc: ApisXuLyHocVu/Modules/dieukienxuly/html/dieukienapdung.html
            + script/dieukienapdung.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     XLHV_DieuKienXuLy_AD/LayDanhSach  GET, phân trang máy chủ: strTuKhoa,
                                       strDaoTao_ThoiGianDaoTao_Id, strPhamViApDung_Id
                                       (= KHOÁ đào tạo), strLoaiXuLy_Id, strMucXuLy_Id = '',
                                       strNguoiTao_Id = '' (gốc đọc #dropAAAA)
     XLHV_DieuKienXuLy_AD/ThemMoi      POST (strId rỗng) · /CapNhat (strId = ID dòng)
         strXauDieuKien, strMucXuLy_Id, strLoaiXuLy_Id, strMoTa, dThuTu,
         strDaoTao_ThoiGianDaoTao_Id, strPhamViApDung_Id (khoá), strPhanCapApDung_Id = ''
         (gốc #dropAAAA), strXLHV_DieuKienXuLy_Id (danh mục xử lý)
     XLHV_DieuKienXuLy_AD/Xoa          POST, strIds = MỘT id mỗi lời gọi
     XLHV_DieuKienXuLy_AD/KeThua       POST: strPhanCapApDung_Id = '' (gốc #dropAzzzz),
                                       strPhamViApDung_Id = khoá, strDaoTao_ThoiGianDaoTao_Id
     XLHV_DieuKienXuLy_AD/Xoa_XLHV_DieuKienXuLy_AD_Tat
                                       POST: strLoaiXuLy_Id (ô lọc), strPhamViApDung_Id,
                                       strDaoTao_ThoiGianDaoTao_Id
     XLHV_DieuKienXuLy/LayDanhSach     GET — ô "Danh mục xử lý" (điều kiện khai báo chung)
     XLHV_ThongTinChung/LayDSTuKhoa    GET — bảng "Danh sách từ khóa" (_dieukien.js)
     edu.system.getList_HeDaoTao / KhoaDaoTao / ThoiGianDaoTao → ums.ref.* (tham số như gốc)
   Danh mục: XLHV.LOAIXULY, XLHV.MUCXULY.

   Bố cục giữ như gốc: thanh lọc + bảng một cột; biểu mẫu thay chỗ danh sách,
   hai cột (ô nhập | bảng từ khoá). "Kế thừa" / "Xóa toàn bộ" (gốc đặt cạnh
   nút Tìm kiếm) nằm ở đầu trang.

   Giữ như gốc:
     · Chọn "Danh mục xử lý" → chép Loại, Mức, Thứ tự, Mô tả, Xâu điều kiện của
       điều kiện chung vào biểu mẫu. Loại xử lý / Mức xử lý CHỈ XEM (gốc
       readonlyselect2) nhưng vẫn gửi đi khi lưu.
     · Thêm mới điền sẵn Hệ / Khoá / Thời gian từ thanh lọc (rewrite của gốc).
     · Kế thừa / Xóa toàn bộ bắt chọn khoá và thời gian (gốc: "năm học HOẶC
       thời gian" — ô năm học #dropSearch_NamHoc không có trên màn, nên thực tế
       bắt thời gian).
   Khác gốc:
     · Hệ → Khoá KHOÁ theo luật cha → con, ở cả thanh lọc lẫn biểu mẫu. Gốc nạp
       sẵn mọi khoá; chọn hệ ở BIỂU MẪU còn đổ lại cả ô khoá của THANH LỌC (dùng
       chung renderPlace) — nay tách riêng. Sửa một dòng: dòng không mang hệ,
       nên hệ suy từ khoá (cột DAOTAO_HEDAOTAO_ID của danh sách khoá); không suy
       được thì ô khoá hiện giá trị cũ nhưng bị khoá tới khi chọn hệ.
     · Kế thừa / Xóa toàn bộ xong nạp lại DANH SÁCH. Gốc chỉ nạp lại ô "Danh mục
       xử lý" (getList_DKXL) nên bảng vẫn hiện dữ liệu cũ; gốc còn gắn thêm một
       trình xử lý #btnYes mỗi lần bấm (bấm lần hai là gửi hai lần).
     · Ô "Danh mục xử lý" nạp tới 10000 dòng. Gốc gửi pageSize_default = 10 nên
       chỉ chọn được 10 điều kiện đầu.
     · Lưu xong quay về danh sách (gốc ở lại biểu mẫu mà không nhận id mới →
       Lưu lần hai THÊM TRÙNG). Bỏ vòng lặp #tblInput_DTSV_SinhVien (mã chết).
     · Ô bắt buộc (kiểm host 30/9 — máy chủ đòi Loại, Mức, Xâu điều kiện, Thời gian, Khoá; thiếu một ô là
       "Du lieu khong hop le"): Thời gian, Khóa đào tạo, Xâu điều kiện đánh dấu bắt buộc; Loại / Mức chỉ điền được
       qua "Danh mục xử lý" nên thiếu thì nhắc chọn danh mục. Một khoá × thời gian × mức chỉ có MỘT điều kiện —
       máy chủ trả "Du lieu da ton tai" → nói rõ (saveFail).
   Bỏ: các hàm nạp Chương trình / Lớp / Năm nhập học / Khoa quản lý / Trạng thái
   / Phạm vi của gốc — không có lối vào, ô tương ứng không có trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('xlhv-dieukienapdung');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat, D = ums.xlhvDk;
    var S = { khoaAll: [], dkxl: [] };

    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    /* Ô "Danh mục xử lý" — getList_DKXL của gốc */
    var DKXL = {
        call: {
            action: 'XLHV_DieuKienXuLy/LayDanhSach', method: 'GET',
            strTuKhoa: '', strLoaiXuLy_Id: '', strMucXuLy_Id: '', strNguoiTao_Id: '',
            pageIndex: 1, pageSize: 10000
        },
        id: 'ID', name: 'MUCXULY_TEN'
    };
    var THOIGIAN = {
        call: {   // edu.system.getList_ThoiGianDaoTao (strNam_Id '', pageSize 100000 như gốc)
            action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P',
            func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao',
            strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000
        },
        id: 'ID', name: 'DAOTAO_THOIGIANDAOTAO'
    };

    var crud = ums.crud({
        root: root,
        title: 'Điều kiện xử lý áp dụng',
        formTitle: 'điều kiện xử lý',
        icon: 'fa-rectangle-vertical-history',
        listTitle: 'Danh sách',

        filters: [
            { key: 'loai', type: 'select', label: 'Chọn loại xử lý', source: D.LOAIXULY },
            { key: 'he', type: 'select', label: '-- Chọn hệ đào tạo --' },
            { key: 'khoa', type: 'select', label: '-- Chọn khóa đào tạo --' },
            { key: 'tg', type: 'select', label: '--Chọn thời gian đào tạo--', source: THOIGIAN },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        toolbar: [
            { text: 'Kế thừa', icon: 'fa-object-ungroup', mod: 'out-success', onClick: function () { keThua(); } },
            { text: 'Xóa toàn bộ', icon: 'fa-trash-can', mod: 'out-danger', onClick: function () { xoaToanBo(); } }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'XLHV_DieuKienXuLy_AD/LayDanhSach',
                    method: 'GET',
                    strTuKhoa: f.q,
                    strDaoTao_ThoiGianDaoTao_Id: f.tg,
                    strPhamViApDung_Id: f.khoa,
                    strLoaiXuLy_Id: f.loai,
                    strMucXuLy_Id: '',
                    strNguoiTao_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mức xử lý', prop: 'MUCXULY_TEN', cls: 'is-nowrap' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Xâu điều kiện', prop: 'XAUDIEUKIEN' },
            { title: 'Khóa đào tạo', prop: 'PHAMVIAPDUNG_TEN', cls: 'is-nowrap' },
            { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO_KY', cls: 'is-nowrap' }
        ],

        formCols: 1,
        fields: [
            { type: 'legend', label: 'Thông tin điều kiện' },
            { key: 'strXLHV_DieuKienXuLy_Id', col: 'XLHV_DIEUKIENXULY_ID', label: 'Danh mục xử lý', type: 'select',
              source: DKXL, placeholder: 'Chọn danh mục điều kiện xử lý' },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select',
              source: THOIGIAN, placeholder: 'Chọn thời gian đào tạo', required: true },
            { key: 'xHe', label: 'Hệ đào tạo', type: 'select', placeholder: 'Chọn hệ đào tạo' },
            { key: 'strPhamViApDung_Id', col: 'PHAMVIAPDUNG_ID', label: 'Khóa đào tạo', type: 'select', placeholder: 'Chọn khóa đào tạo', required: true },
            { key: 'strLoaiXuLy_Id', col: 'LOAIXULY_ID', label: 'Loại xử lý', type: 'select', source: D.LOAIXULY },
            { key: 'strMucXuLy_Id', col: 'MUCXULY_ID', label: 'Mức xử lý', type: 'select', source: D.MUCXULY },
            { key: 'dThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' },
            { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', label: 'Xâu điều kiện', type: 'textarea', required: true }
        ],

        saveFail: function (err) { return D.cauLoi(err, 'Khóa đào tạo và thời gian này đã có điều kiện cho mức xử lý đã chọn — hãy sửa dòng đang có.'); },

        onForm: function (row, c, extra) {
            D.haiCot(c, extra);
            // Loại / Mức xử lý chỉ xem (readonlyselect2 của gốc) — vẫn gửi khi lưu
            [ff('strLoaiXuLy_Id'), ff('strMucXuLy_Id')].forEach(function (el) {
                el.disabled = true;
                jQuery(el).trigger('change.select2');
            });
            if (row) moSua(row); else moThem();
        },

        save: function (v, row) {
            // Loại / Mức xử lý là ô chỉ xem, chỉ có giá trị sau khi chọn "Danh mục xử lý"
            if (!v.strLoaiXuLy_Id || !v.strMucXuLy_Id) {
                ui.toast('Chọn "Danh mục xử lý" để lấy Loại xử lý và Mức xử lý', 'warn');
                return null;
            }
            return {
                action: row ? 'XLHV_DieuKienXuLy_AD/CapNhat' : 'XLHV_DieuKienXuLy_AD/ThemMoi',
                strId: row ? row.ID : '',
                strXauDieuKien: v.strXauDieuKien,
                strMucXuLy_Id: v.strMucXuLy_Id,
                strLoaiXuLy_Id: v.strLoaiXuLy_Id,
                strMoTa: v.strMoTa,
                dThuTu: v.dThuTu,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                strPhamViApDung_Id: v.strPhamViApDung_Id,
                strPhanCapApDung_Id: '',
                strXLHV_DieuKienXuLy_Id: v.strXLHV_DieuKienXuLy_Id
            };
        },

        rowDelete: false,
        formDelete: false,
        removeText: 'Xóa',
        remove: function (ids) {
            return ids.map(function (id) { return { action: 'XLHV_DieuKienXuLy_AD/Xoa', strIds: id }; });
        },
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; }
    });

    function fk(k) { return root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
    function ff(k) { return root.querySelector('[data-scope="form"][data-k="' + k + '"]'); }
    function chu(el) { var o = el && el.options[el.selectedIndex]; return o && o.value ? o.text.trim() : ''; }

    /* ---------- Hệ → Khoá (thanh lọc và biểu mẫu tách riêng) ---------------- */
    function napKhoa(he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
    }
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) {
            pat.fill(fk('he'), r, { name: 'TENHEDAOTAO', head: '-- Chọn hệ đào tạo --' });
            pat.fill(ff('xHe'), r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' });
        }).catch(fail('hệ đào tạo'));
    // Toàn bộ khoá (gốc nạp lúc init) — để suy hệ khi mở biểu mẫu sửa
    napKhoa('').then(function (r) { S.khoaAll = r; }).catch(fail('khóa đào tạo'));

    pat.chain([fk('he'), fk('khoa')]);
    /* Gắn SAU pat.chain: select2 bắn `change` (crud nạp danh sách) TRƯỚC khi chain
       xoá ô khoá, nên nạp lại lần nữa khi khoá cũ đã bị xoá. Xoá hệ → chain phát
       lại select2:select với hệ rỗng → cũng qua đây. */
    jQuery(fk('he')).on('select2:select', function () {
        var he = fk('he').value;
        crud.load(1);
        if (!he) { pat.fill(fk('khoa'), [], { head: '-- Chọn khóa đào tạo --' }); return; }
        napKhoa(he).then(function (r) {
            pat.fill(fk('khoa'), r, { name: 'TENKHOA', head: '-- Chọn khóa đào tạo --' });
        }).catch(fail('khóa đào tạo'));
    });

    function khoaForm(he, giuKhoa) {
        if (!he) { pat.fill(ff('strPhamViApDung_Id'), [], { head: 'Chọn khóa đào tạo' }); return Promise.resolve(); }
        return napKhoa(he).then(function (r) {
            pat.fill(ff('strPhamViApDung_Id'), r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' });
            if (giuKhoa !== undefined) { ff('strPhamViApDung_Id').value = giuKhoa; jQuery(ff('strPhamViApDung_Id')).trigger('change'); }
        }).catch(fail('khóa đào tạo'));
    }
    jQuery(ff('xHe')).on('select2:select', function () { khoaForm(ff('xHe').value); });
    pat.chain([ff('xHe'), ff('strPhamViApDung_Id')]);

    /* Thêm mới: điền Hệ / Khoá / Thời gian từ thanh lọc (rewrite của gốc) */
    function moThem() {
        var he = fk('he').value, khoa = fk('khoa').value;
        ff('xHe').value = he;
        jQuery(ff('xHe')).trigger('change');
        ff('strDaoTao_ThoiGianDaoTao_Id').value = fk('tg').value;
        jQuery(ff('strDaoTao_ThoiGianDaoTao_Id')).trigger('change.select2');
        khoaForm(he, khoa);
    }

    /* Sửa: dòng không mang hệ → suy từ khoá; không suy được thì hiện khoá cũ (bị khoá) */
    function moSua(row) {
        var khoa = row.PHAMVIAPDUNG_ID || '';
        var k = S.khoaAll.filter(function (x) { return x.ID === khoa; })[0];
        var he = k && k.DAOTAO_HEDAOTAO_ID || '';
        ff('xHe').value = he;
        if (ff('xHe').value !== he) ff('xHe').value = '';
        jQuery(ff('xHe')).trigger('change');
        if (ff('xHe').value) { khoaForm(he, khoa); return; }
        pat.fill(ff('strPhamViApDung_Id'), S.khoaAll, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' });
        ff('strPhamViApDung_Id').value = khoa;
        jQuery(ff('strPhamViApDung_Id')).trigger('change');
    }

    /* Chọn danh mục xử lý → chép thông tin điều kiện chung (viewEdit_DieuKienApDung_Edit) */
    crud.sourcesReady.then(function () { return ums.crud.loadSource(DKXL); }).then(function (r) { S.dkxl = r || []; });
    jQuery(ff('strXLHV_DieuKienXuLy_Id')).on('select2:select', function () {
        var id = ff('strXLHV_DieuKienXuLy_Id').value;
        var d = S.dkxl.filter(function (x) { return x.ID === id; })[0];
        if (!d) return;
        [['strLoaiXuLy_Id', 'LOAIXULY_ID'], ['strMucXuLy_Id', 'MUCXULY_ID'], ['dThuTu', 'THUTU'],
         ['strMoTa', 'MOTA'], ['strXauDieuKien', 'XAUDIEUKIEN']].forEach(function (p) {
            var el = ff(p[0]);
            el.value = d[p[1]] === undefined || d[p[1]] === null ? '' : d[p[1]];
            if (el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
        });
    });

    /* ---------- Kế thừa / Xóa toàn bộ ------------------------------------- */
    function kiemPhamVi() {
        if (!fk('khoa').value) { ui.toast('Bạn cần chọn khóa', 'warn'); return false; }
        if (!fk('tg').value) { ui.toast('Bạn cần chọn năm học hoặc thời gian đào tạo', 'warn'); return false; }
        return true;
    }
    function chay(call, okMsg) {
        return ums.api.call(call).then(function () {
            ui.toast(okMsg, 'ok');
            crud.load(1);
        }).catch(fail(call.action));
    }
    function keThua() {
        if (!kiemPhamVi()) return;
        ui.confirm('Bạn có muốn kế thừa từ khóa: ' + chu(fk('khoa')) + ' và học kỳ ' + chu(fk('tg')),
            { ok: 'Kế thừa', title: 'Kế thừa' }).then(function (yes) {
            if (!yes) return;
            chay({
                action: 'XLHV_DieuKienXuLy_AD/KeThua',
                strPhanCapApDung_Id: '',
                strPhamViApDung_Id: fk('khoa').value,
                strDaoTao_ThoiGianDaoTao_Id: fk('tg').value
            }, 'Kế thừa thành công');
        });
    }
    function xoaToanBo() {
        if (!kiemPhamVi()) return;
        ui.confirm('Bạn có muốn xóa toàn bộ tiêu chí của khóa: ' + chu(fk('khoa')) + ' và học kỳ ' + chu(fk('tg')),
            { tone: 'bad', ok: 'Xóa toàn bộ', title: 'Xóa toàn bộ' }).then(function (yes) {
            if (!yes) return;
            chay({
                action: 'XLHV_DieuKienXuLy_AD/Xoa_XLHV_DieuKienXuLy_AD_Tat',
                strLoaiXuLy_Id: fk('loai').value,
                strPhamViApDung_Id: fk('khoa').value,
                strDaoTao_ThoiGianDaoTao_Id: fk('tg').value
            }, 'Xóa dữ liệu thành công!');
        });
    }
})();
