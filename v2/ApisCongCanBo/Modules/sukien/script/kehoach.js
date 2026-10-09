/* =========================================================================
   Quản lý kế hoạch sự kiện
   Bản gốc: ApisCongCanBo/Modules/sukien/script/kehoach.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá):
       SV_SuKien/LayDSQLSV_SuKien_KeHoach      GET   strTuKhoa, strNguoiThucHien_Id
       SV_SuKien/Them_QLSV_SuKien_KeHoach      POST  (thêm) | Sua_QLSV_SuKien_KeHoach (sửa, strId có giá trị)
       SV_SuKien/Xoa_QLSV_SuKien_KeHoach       POST  strId — mỗi dòng đánh dấu một lời gọi
       SV_SuKien/LayDSSuKien_KeHoach_PhamVi    GET   phạm vi của kế hoạch
       SV_SuKien/Them_SuKien_KeHoach_PhamVi    POST  mỗi phạm vi mới một lời gọi, sau khi lưu kế hoạch
       SV_SuKien/Xoa_SuKien_KeHoach_PhamVi           strId
       SV_SuKien/LayDSSuKien_KeHoach_DangKy    GET   "Đã đăng ký tham gia" → Chi tiết
       SV_SuKien/LayDSSuKien_KeHoach_ThamGia   GET   "Kết quả tham gia" → Chi tiết
   Hộp chọn sinh viên: ums.pat.phamVi → ums.pat.pickSinhVienNganh
   (edu.extend.genModal_SinhVien, kèm "Thêm từng khóa / chương trình / lớp").

   Giữ như bản gốc:
     · Không ô nào bắt buộc — arrValid của bản gốc kiểm ô txtKeHoach_So
       không có trên màn nên không chặn gì.
     · Bảng không phân trang ở máy chủ (lời gọi không gửi pageIndex/pageSize).
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Cột "Người tạo" bản gốc đổ NGAYKETTHUC (chép nhầm dòng trên). Ở đây đổ
       NGUOITAO_TAIKHOAN — tên cột đoán theo sukien/theodoi, KIỂM TRÊN HOST.
     · Bỏ các hàm nạp ô chọn không nơi nào gọi (getList_HeDaoTao…, KeHoachMD,
       NamNhapHoc, KhoaQuanLy) và nút báo cáo gắn vào vùng không có trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var C = 'SV_SuKien/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    var pv = null;

    /* "Chi tiết" ở hai cột Đã đăng ký / Kết quả tham gia — hộp thoại một bảng */
    function chiTiet(kind, row) {
        var dk = kind === 'dk';
        var dlg = ui.dialog({
            title: dk ? 'Danh sách đã đăng ký tham gia' : 'Danh sách đã tham gia',
            icon: dk ? 'fa-user-pen' : 'fa-users', size: 'xl',
            body: '<div data-z="ct">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var call = dk
            ? { action: C + 'LayDSSuKien_KeHoach_DangKy', method: 'GET', strTuKhoa: '', strQLSV_SuKien_KeHoach_Id: row.ID,
                strQLSV_SuKien_HoatDong_Id: '', strQLSV_NguoiHoc_Id: '', strNguoiThucHien_Id: uid() }
            : { action: C + 'LayDSSuKien_KeHoach_ThamGia', method: 'GET', strTuKhoa: '', strQLSV_SuKien_KeHoach_Id: row.ID,
                strNguoiThucHien_Id: uid() };
        ums.api.call(call).then(function (r) {
            ui.table({
                el: dlg.body.querySelector('[data-z="ct"]'), rows: Array.isArray(r.data) ? r.data : [],
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Tên', render: function (s) { return esc((s.QLSV_NGUOIHOC_HODEM || '') + ' ' + (s.QLSV_NGUOIHOC_TEN || '')); } },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Ngành', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOAHOC_TEN' }
                ]
            });
        }).catch(function (err) {
            dlg.body.querySelector('[data-z="ct"]').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'tải danh sách');
        });
    }
    function nutChiTiet(kind) {
        return function (r) {
            return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-ct="' + kind + '" data-id="' + esc(r.ID) + '"><i class="fa-light fa-eye"></i>Chi tiết</button>';
        };
    }

    var root = document.getElementById('sk-kehoach');
    var crud = ums.crud({
        root: root,
        title: 'Quản lý kế hoạch',
        listTitle: 'Danh sách kế hoạch',
        formTitle: 'kế hoạch',
        icon: 'fa-list-timeline',
        formCols: 12,
        rowDelete: false, formDelete: false,
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            call: function (f) { return { action: C + 'LayDSQLSV_SuKien_KeHoach', method: 'GET', strTuKhoa: f.q || '', strNguoiThucHien_Id: uid() }; }
        },
        columns: [
            { title: 'Tên kế hoạch', prop: 'TENKEHOACH' },
            { title: 'Hiệu lực', cls: 'is-center is-nowrap', render: function (r) { return r.HIEULUC ? 'Có hiệu lực' : 'Hết hiệu lực'; } },
            { title: 'Từ ngày', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
            { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-center' },
            { title: 'Đã đăng ký tham gia', cls: 'is-center', render: nutChiTiet('dk') },
            { title: 'Kết quả tham gia', cls: 'is-center', render: nutChiTiet('tg') }
        ],
        fields: [
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', cols: 4 },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', cols: 4, required: true, value: '1',
              source: { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] } },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Từ ngày', type: 'date', cols: 2 },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Đến ngày', type: 'date', cols: 2 }
        ],
        onForm: function (row, c, extra) {
            // Bản gốc: khối phạm vi chiếm col-lg-4 dưới hàng ô nhập
            extra.innerHTML = '<div class="ums-grid ums-grid--3"><div data-z="pv"></div></div>';
            pv = ums.pat.phamVi(extra.querySelector('[data-z="pv"]'), {
                list: function (id) {
                    return { action: C + 'LayDSSuKien_KeHoach_PhamVi', method: 'GET', strTuKhoa: '', strQLSV_SuKien_KeHoach_Id: id, strNguoiThucHien_Id: uid() };
                },
                save: function (pvId, id) {
                    return { action: C + 'Them_SuKien_KeHoach_PhamVi', method: 'POST', strQLSV_SuKien_KeHoach_Id: id, strPhamViApDung_Id: pvId, strNguoiThucHien_Id: uid() };
                },
                remove: function (rowId) { return { action: C + 'Xoa_SuKien_KeHoach_PhamVi', strId: rowId, strNguoiThucHien_Id: uid() }; }
            });
            pv.load(row ? row.ID : '');
        },
        save: function (v, row) {
            return {
                action: C + (row ? 'Sua_QLSV_SuKien_KeHoach' : 'Them_QLSV_SuKien_KeHoach'),
                method: 'POST',
                strId: row ? row.ID : '',
                strTenKeHoach: v.strTenKeHoach,
                dHieuLuc: v.dHieuLuc,
                strNgayBatDau: v.strNgayBatDau,
                strNgayKetThuc: v.strNgayKetThuc,
                strNguoiThucHien_Id: uid()
            };
        },
        onSaved: function (c, result, isEdit) {
            var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
            if (pv) pv.save(id);
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: C + 'Xoa_QLSV_SuKien_KeHoach', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; });
        }
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-ct]');
        if (!b) return;
        var row = crud.rows.filter(function (r) { return r.ID === b.getAttribute('data-id'); })[0];
        if (row) chiTiet(b.getAttribute('data-ct'), row);
    });
})();
