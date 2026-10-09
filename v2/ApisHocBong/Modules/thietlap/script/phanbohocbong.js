/* =========================================================================
   Phân bổ học bổng — chỉ tiêu (số lượng / số tiền) của quỹ học bổng cho từng lớp
   Bản gốc: ApisHocBong/Modules/thietlap/html/phanbohocbong.html + script/phanbohocbong.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): ô Quỹ học bổng · Thời gian · từ khoá · Tìm kiếm → khung "Danh sách phân bổ (n)"
   (Xóa · Thực hiện phân bổ · Thêm mới) với bảng Phạm vi phân bổ · Số lượng · Số lượng phân bổ · ô đánh dấu
   → "Thêm mới - Phân bổ" THAY CHỖ danh sách: Số lượng phân bổ · Số tiền phân bổ · Cách lưu, rồi "Chọn phạm vi
   các lớp phân bổ" (Hệ · Khoá · Chương trình + bảng lớp có ô đánh dấu). Bản mới: ums.crud (nút Thêm mới /
   Thực hiện phân bổ ở đầu trang, "Xóa" nhiều dòng ở đầu khung danh sách).

   Lời gọi (chép nguyên):
       HB_ChiTieuPhanBo/LayDanhSach GET, phân trang máy chủ — strTuKhoa, strHB_QuyHocBong_Id,
            strDaoTao_ThoiGianDaoTao_Id, strPhamViApDung_Id / strPhanCapApDung_Id / strNguoiTao_Id ('' — gốc đọc dropAAAA)
       HB_ChiTieuPhanBo/ThemMoi POST — mỗi lớp đã chọn một lời gọi (Cách lưu "Từng bản ghi"), hoặc MỘT lời gọi
            với strPhamViApDung_Id = các ID lớp ghép "a,b" (Cách lưu "Gộp nhóm"): strId '', strChucNang_Id,
            strDaoTao_ThoiGianDaoTao_Id + strHB_QuyHocBong_Id (ô LỌC đầu trang), dChiTieuSoLuong, dChiTieuSoTien.
       HB_TinhToan/ThucHienPhanBoTuDong POST — strId '', strChucNang_Id, strDaoTao_ThoiGianDaoTao_Id,
            strHB_QuyHocBong_Id (ô lọc); hỏi lại "phân bổ dữ liệu tự động".
       HB_ChiTieuPhanBo/Xoa POST — mỗi dòng đánh dấu một lời gọi: strIds, strNguoiThucHien_Id.
       Quỹ: HB_QuyHocBong/LayDanhSach GET; Thời gian: edu.system.getList_ThoiGianDaoTao (pageSize 100000).
       Hệ → Khoá → CT → bảng lớp: ums.hbTh.dt (../../kehoach/script/_th.js) — edu.system.getList_* của gốc,
            Hệ nạp lại Khoá + lớp, Khoá nạp lại CT + lớp, CT nạp lại lớp.

   Lỗi bản gốc:
     · "Cách lưu": gốc kiểm `if (getValById("dropCachLuu"))` — giá trị "0" (Từng bản ghi) là CHUỖI khác rỗng
       nên luôn đúng → chọn gì cũng GỘP NHÓM. Bản mới làm theo ô đã chọn (ghi can-quyet).
   Khác gốc:
     · Luật cha → con: chưa chọn Hệ thì khoá Khoá, chưa chọn Khoá thì khoá CT; xoá Hệ thì bảng lớp về lời nhắc
       (gốc chỉ nạp bảng lớp khi chọn, xoá không nạp lại).
     · Lưu xong về danh sách và nạp lại (gốc ở lại biểu mẫu, nạp lại danh sách phía sau).
     · "Thực hiện phân bổ" xong nạp lại danh sách (gốc chỉ báo).
     · Bỏ ảnh minh hoạ cột phải của biểu mẫu (Upload/images/img-kehoach.png — ảnh trang trí, không có trong _v2).
   Cố ý bỏ (mã chết): nút .btnEdit trên bảng (không dòng nào vẽ nút này, viewEdit_PhanBoHocBong không tồn tại),
     arrValid (txtPhanBoHocBong_So không có trên màn, validInputForm đã chú thích), getList_NamNhapHoc /
     getList_KhoaQuanLy / cbGenCombo_LopQuanLy / genList_TrangThaiSV (không ai gọi), dropThoiGianDaoTao /
     dropQuyHocBong / dropPhanBoHocBong_ThoiGianDaoTao (ô không có).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.hbTh, esc = ui.esc;
    var root = document.getElementById('hb-phanbohocbong');
    if (!root) return;

    var crud = ums.crud({
        root: root,
        title: 'Phân bổ học bổng',
        formTitle: 'phân bổ',
        listTitle: 'Danh sách phân bổ',
        icon: 'fa-list-tree',
        filters: [
            { key: 'quy', type: 'select', label: 'Chọn quỹ học bổng',
                source: { call: { action: 'HB_QuyHocBong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 }, name: 'TEN' } },
            { key: 'tg', type: 'select', label: 'Tất cả học kỳ',
                source: { call: { action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P', func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao',
                    strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, name: 'DAOTAO_THOIGIANDAOTAO' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'HB_ChiTieuPhanBo/LayDanhSach', method: 'GET', strTuKhoa: f.q, strHB_QuyHocBong_Id: f.quy,
                    strDaoTao_ThoiGianDaoTao_Id: f.tg, strPhamViApDung_Id: '', strPhanCapApDung_Id: '', strNguoiTao_Id: '' };
            }
        },
        columns: [
            { title: 'Phạm vi phân bổ', prop: 'PHAMVIAPDUNG_TEN' },
            { title: 'Số lượng', prop: 'SOLUONGNGUOIHOC', cls: 'is-center' },
            { title: 'Số lượng phân bổ', prop: 'CHITIEUSOLUONG', cls: 'is-center' }
        ],
        toolbar: [
            { text: 'Thực hiện phân bổ', icon: 'fa-list-tree', mod: 'primary', onClick: phanBoTuDong },
            { text: 'Thêm mới', icon: 'fa-plus', mod: 'add', onClick: themMoi }
        ],
        canAdd: false,
        canEdit: false,
        formCols: 3,
        fields: [
            { key: 'dChiTieuSoLuong', label: 'Số lượng phân bổ', type: 'number', value: '0' },
            { key: 'dChiTieuSoTien', label: 'Số tiền phân bổ', type: 'number', value: '0' },
            { key: 'cachLuu', label: 'Cách lưu', type: 'select', required: true, value: '0',
                source: { items: [{ ID: '0', TEN: 'Từng bản ghi' }, { ID: '1', TEN: 'Gộp nhóm' }] } }
        ],
        onForm: function (row, c, extra) { veVungLop(extra); },
        save: luu,
        rowDelete: false,
        formDelete: false,
        removeText: 'Xóa',
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; },
        remove: function (ids) {
            return ids.map(function (id) { return { action: 'HB_ChiTieuPhanBo/Xoa', strIds: id, strNguoiThucHien_Id: '' }; });
        }
    });

    function themMoi(c) {
        var f = c.filterValues();
        if (!f.quy || !f.tg) { ui.toast('Bạn cần chọn thời gian và quỹ học bổng!', 'warn'); return; }
        c.showForm(null);
    }

    function phanBoTuDong(c) {
        var f = c.filterValues();
        ui.confirm('Bạn có chắc chắn phân bổ dữ liệu tự động không?').then(function (ok) {
            if (!ok) return;
            ums.api.call({ action: 'HB_TinhToan/ThucHienPhanBoTuDong', strId: '', strChucNang_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: f.tg, strHB_QuyHocBong_Id: f.quy, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Thực hiện thành công!', 'ok'); c.load(); })
                .catch(function (err) { ums.api.handle(err, 'HB_TinhToan/ThucHienPhanBoTuDong'); });
        });
    }

    /* ---- "Chọn phạm vi các lớp phân bổ" — vẽ lại mỗi lần mở biểu mẫu ---- */
    var vung = null;
    function veVungLop(extra) {
        vung = extra;
        extra.innerHTML = pat.panel({ title: 'Chọn phạm vi các lớp phân bổ', icon: 'fa-users-rectangle', body:
            '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-pb="he" data-ph="Chọn hệ đào tạo"><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-pb="khoa" data-ph="Chọn khóa đào tạo"><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-pb="ct" data-ph="Chọn chương trình đào tạo"><option value=""></option></select></div>' +
            '</div><div class="ums-u-mt-4" data-pb="lop"></div>' });
        ui.enhance(extra);
        function el(k) { return extra.querySelector('[data-pb="' + k + '"]'); }
        K.dt({ he: el('he'), khoa: el('khoa'), ct: el('ct') }, {
            nhan: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo' },
            lopBang: function (rows) {
                if (!rows) { el('lop').innerHTML = ui.empty('Chọn hệ đào tạo để hiện danh sách lớp'); return; }
                ui.table({ el: el('lop'), rows: rows, empty: 'Không có lớp', columns: [
                    { title: 'Mã lớp', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Tên lớp', prop: 'TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
                    { head: '<input type="checkbox" data-lopall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                        render: function (r) { return '<input type="checkbox" data-lop="' + esc(r.ID) + '">'; } }
                ] });
            }
        });
    }
    root.addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-lopall') || !vung) return;
        Array.prototype.forEach.call(vung.querySelectorAll('input[data-lop]'), function (c) { c.checked = ev.target.checked; });
    });

    function luu(v, row, c) {
        var ids = Array.prototype.map.call(vung ? vung.querySelectorAll('input[data-lop]:checked') : [], function (x) {
            return x.getAttribute('data-lop');
        });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return null; }
        if (v.cachLuu === '1') ids = [ids.join(',')];
        var f = c.filterValues();
        ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { ok: 'Lưu' }).then(function (ok) {
            if (!ok) return;
            ui.batch(ids.map(function (id) {
                return { action: 'HB_ChiTieuPhanBo/ThemMoi', strId: '', strChucNang_Id: '',
                    strDaoTao_ThoiGianDaoTao_Id: f.tg, strPhamViApDung_Id: id, strHB_QuyHocBong_Id: f.quy,
                    dChiTieuSoLuong: v.dChiTieuSoLuong, dChiTieuSoTien: v.dChiTieuSoTien, strNguoiThucHien_Id: '' };
            }), { title: 'Đang lưu', okText: 'Thêm mới thành công!', show: true }).then(function (r) {
                if (r.ok) { c.showList(); c.load(); }
            });
        });
        return null;        // lưu hàng loạt tự lo ở trên — ums.crud không gửi lời gọi nào
    }
})();
