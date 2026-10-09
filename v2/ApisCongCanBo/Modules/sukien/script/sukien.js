/* =========================================================================
   Quản lý sự kiện - hoạt động
   Bản gốc: ApisCongCanBo/Modules/sukien/script/sukien.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá):
       SV_SuKien/LayDSQLSV_SuKien_KeHoach     GET   ô chọn kế hoạch (chọn sẵn mục đầu)
       SV_SuKien/LayDSQLSV_SuKien_HoatDong    GET   strQLSV_SuKien_KeHoach_Id
       SV_SuKien/Them_QLSV_SuKien_HoatDong    POST  | Sua_QLSV_SuKien_HoatDong khi có strId
       SV_SuKien/Xoa_QLSV_SuKien_HoatDong     POST  mỗi dòng đánh dấu một lời gọi
       Ba lưới con, lưu SAU khi có id sự kiện, mỗi dòng một lời gọi:
         Thời gian diễn ra   …_HoatDong_ThoiGian  (Them | Sua | Xoa | LayDS) — bỏ dòng không có Địa điểm
         Bố trí nhân sự      …_HoatDong_BoTri     (Them | Sua | Xoa | LayDS) — bỏ dòng chưa chọn Nhân sự
         Diễn giả            …_HoatDong_DienGia   (Them | Sua | Xoa | LayDS) — bỏ dòng không có Diễn giả
       Files tư liệu → SV_Files (saveFiles / viewFiles)
       Nhân sự: edu.system.getList_NhanSu = ums.ref.nhanSu (dLaCanBoNgoaiTruong 0)
       Danh mục: QLSV.SUKIEN.PHANLOAI, QLSV.SUKIEN.VAITRO

   Giữ như bản gốc:
     · LayDSSuKien_HoatDong_BoTri gửi id sự kiện dưới tên strQLSV_SuKien_KeHoach_Id.
     · Ảnh gửi thẳng đường dẫn đang có (strHinhAnhDaiDien) — bản gốc không gọi
       getImage nên ảnh vừa tải lên vẫn mang tên tạm "unsave_…". KIỂM TRÊN HOST.
     · Không ô nào bắt buộc (arrValid kiểm ô txtSuKien_So không có trên màn).
     · Nút "Xóa" ở đầu ba lưới con không có xử lý → giữ nút, đặt disabled; xoá
       từng dòng bằng nút Xóa trong dòng như bản gốc.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Cột "Mã sự kiện" bản gốc hiện chữ Có/Hết hiệu lực (mRender đè mDataProp MA)
       → hiện MA.
     · Ô "Nhập từ khóa" bản gốc không được gửi (strTuKhoa đọc txtAAAA) → gửi.
     · Sửa diễn giả: bản gốc gọi Sua_SuKien_HoatDong_DienGia mà KHÔNG gửi strId
       → gửi strId. KIỂM TRÊN HOST.
     · Ô "Ngày" trong lưới thời gian là ô chọn ngày (bản gốc ô chữ).
     · Bỏ khối phạm vi áp dụng trong .js gốc — màn không có bảng tblPhamVi.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var C = 'SV_SuKien/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    var dead = ui.btn('del', { text: 'Xóa', mod: 'out-danger', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } });
    var g = {}, tep = null;

    function luoi(host, o) {
        return ums.pat.rows(host, {
            title: o.title, icon: o.icon, tools: dead, addText: 'Thêm',
            columns: o.columns,
            list: function (id) { var x = { action: C + 'LayDS' + o.api, method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid() }; x[o.parentKey || 'strQLSV_SuKien_HoatDong_Id'] = id; return x; },
            filled: o.filled,
            save: function (v, rec, id) {
                var x = { action: C + (rec ? 'Sua_' : 'Them_') + o.api, method: 'POST', strId: rec ? rec.ID : '', strQLSV_SuKien_HoatDong_Id: id, strNguoiThucHien_Id: uid() };
                Object.keys(v).forEach(function (k) { x[k] = v[k]; });
                return x;
            },
            remove: function (rec) { return { action: C + 'Xoa_' + o.api, method: 'POST', strId: rec.ID, strNguoiThucHien_Id: uid() }; }
        });
    }

    function veCon(extra, row) {
        extra.innerHTML =
            '<div data-z="tg"></div><div class="ums-u-mt-4" data-z="ns"></div>' +
            '<div class="ums-grid ums-grid--12 ums-u-mt-4">' +
                '<div style="grid-column:span 4" data-z="dg"></div>' +
                '<div style="grid-column:span 6"><div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
                    '<i class="fa-light fa-folder-open"></i> Files tư liệu</div></div><div class="ums-panel__body" data-z="tep"></div></div></div>' +
            '</div>';
        function z(k) { return extra.querySelector('[data-z="' + k + '"]'); }
        g.tg = luoi(z('tg'), {
            title: 'Thời gian diễn ra', icon: 'fa-clock', api: 'SuKien_HoatDong_ThoiGian',
            filled: function (v) { return !!v.strDiaDiem; },
            columns: [
                { key: 'strDiaDiem', col: 'DIADIEM', title: 'Địa điểm' },
                { key: 'strTuNgay', col: 'TUNGAY', title: 'Ngày', type: 'date', width: '140px', group: 'Thời gian bắt đầu' },
                { key: 'dGioBatDau', col: 'GIOBATDAU', title: 'Giờ', width: '70px', group: 'Thời gian bắt đầu' },
                { key: 'dPhutBatDau', col: 'PHUTBATDAU', title: 'Phút', width: '70px', group: 'Thời gian bắt đầu' },
                { key: 'strDenNgay', col: 'DENNGAY', title: 'Ngày', type: 'date', width: '140px', group: 'Thời gian kết thúc' },
                { key: 'dGioKetThuc', col: 'GIOKETTHUC', title: 'Giờ', width: '70px', group: 'Thời gian kết thúc' },
                { key: 'dPhutKetThuc', col: 'PHUTKETTHUC', title: 'Phút', width: '70px', group: 'Thời gian kết thúc' }
            ]
        });
        g.ns = luoi(z('ns'), {
            title: 'Bố trí nhân sự nội bộ', icon: 'fa-users', api: 'SuKien_HoatDong_BoTri', parentKey: 'strQLSV_SuKien_KeHoach_Id',
            filled: function (v) { return !!v.strNhanSuThamGia_Id; },
            columns: [
                { key: 'strNhanSuThamGia_Id', col: 'NHANSUTHAMGIA_ID', title: 'Nhân sự', type: 'select', s2: true, placeholder: 'Chọn nhân sự',
                  source: { load: nhanSu, name: ums.ref.tenNhanSu } },
                { key: 'strVaiTro_Id', col: 'VAITRO_ID', title: 'Vai trò', type: 'select', width: '180px', placeholder: 'Chọn vai trò',
                  source: { dm: 'QLSV.SUKIEN.VAITRO' } },
                { key: 'strMoTa', col: 'MOTA', title: 'Mô tả', width: '250px' }
            ]
        });
        g.dg = luoi(z('dg'), {
            title: 'Diễn giả', icon: 'fa-microphone', api: 'SuKien_HoatDong_DienGia',
            filled: function (v) { return !!v.strDienGia; },
            columns: [
                { key: 'strDienGia', col: 'DIENGIA', title: 'Diễn giả' },
                { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' }
            ]
        });
        tep = ums.files.mount(z('tep'), { api: 'SV_Files' });
        var id = row ? row.ID : '';
        g.tg.load(id); g.ns.load(id); g.dg.load(id);
        tep.load(id);
    }
    var dsNhanSu = null;
    function nhanSu() { return dsNhanSu || (dsNhanSu = ums.ref.nhanSu({ dLaCanBoNgoaiTruong: 0 })); }

    var root = document.getElementById('sk-sukien');
    var crud = ums.crud({
        root: root,
        title: 'Quản lý sự kiện',
        listTitle: 'Danh sách sự kiện',
        formTitle: 'sự kiện',
        icon: 'fa-calendar-star',
        formCols: 12,
        autoload: false,
        rowDelete: false, formDelete: false,
        filters: [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch', first: true,
              source: { call: { action: C + 'LayDSQLSV_SuKien_KeHoach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid() }, name: 'TENKEHOACH' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            call: function (f) {
                return { action: C + 'LayDSQLSV_SuKien_HoatDong', method: 'GET', strTuKhoa: f.q || '', strQLSV_SuKien_KeHoach_Id: f.kh || '', strNguoiThucHien_Id: uid() };
            }
        },
        columns: [
            { title: 'Tên sự kiện - hoạt động', prop: 'TEN' },
            { title: 'Mã sự kiện - hoạt động', prop: 'MA' },
            { title: 'Hình đại diện', cls: 'is-center', render: function (r) {
                return r.HINHANHSUKIEN ? '<img src="' + esc(ums.files.url(r.HINHANHSUKIEN)) + '" alt="" style="max-height:100px">' : '';
            } },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
            { title: 'Trọng số', prop: 'TRONGSOTINHDIEM', cls: 'is-center' }
        ],
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên', cols: 4 },
            { key: 'strMa', col: 'MA', label: 'Mã', cols: 4 },
            { key: 'dTrongSoTinhDiem', col: 'TRONGSOTINHDIEM', label: 'Trọng số', cols: 4 },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', cols: 4, source: { dm: 'QLSV.SUKIEN.PHANLOAI' } },
            { key: 'strHinhAnhDaiDien', col: 'HINHANHSUKIEN', label: 'Hình minh họa', type: 'avatar', cols: 4, icon: 'fa-image' }
        ],
        onForm: function (row, c, extra) { veCon(extra, row); },
        save: function (v, row, c) {
            if (tep && tep.busy()) { ui.toast('Đang tải tệp lên, đợi xong rồi lưu', 'warn'); return null; }
            return {
                action: C + (row ? 'Sua_QLSV_SuKien_HoatDong' : 'Them_QLSV_SuKien_HoatDong'),
                method: 'POST',
                strId: row ? row.ID : '',
                strQLSV_SuKien_KeHoach_Id: c.filterValues().kh || '',
                strTen: v.strTen,
                strMa: v.strMa,
                strPhanLoai_Id: v.strPhanLoai_Id,
                dTrongSoTinhDiem: v.dTrongSoTinhDiem,
                strHinhAnhDaiDien: v.strHinhAnhDaiDien,
                strNguoiThucHien_Id: uid()
            };
        },
        onSaved: function (c, result, isEdit) {
            var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
            if (!id) return;
            g.tg.save(id).then(function () { return g.dg.save(id); }).then(function () { return g.ns.save(id); })
                .then(function () { return tep.save(id); });
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: C + 'Xoa_QLSV_SuKien_HoatDong', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; });
        }
    });

    // Bản gốc: chọn kế hoạch → nạp lại danh sách; mở màn thì kế hoạch đầu đã chọn sẵn
    crud.sourcesReady.then(function () { crud.load(); });
    var kh = root.querySelector('select[data-scope="filter"][data-k="kh"]');
    if (kh && window.jQuery) jQuery(kh).on('select2:select', function () { crud.load(); });
})();
