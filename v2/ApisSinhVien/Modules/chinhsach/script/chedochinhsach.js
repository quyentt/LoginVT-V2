/* =========================================================================
   Chế độ chính sách — chế độ × đối tượng: đơn vị tính, hiệu lực, phần trăm hưởng
   Bản gốc: ApisSinhVien/Modules/chinhsach/html/chedochinhsach.html + script/chedochinhsach.js
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       SV_ChinhSach_DT/LayDanhSach GET   strTuKhoa, strCheDoChinhSach_Id, strDoiTuong_Id (''), strNguoiTao_Id (''),
                                         pageIndex / pageSize (phân trang máy chủ)
       SV_ChinhSach_DT/ThemMoi | CapNhat strId, strChucNang_Id, strCheDoChinhSach_Id, strDoiTuong_Id, dHieuLuc,
                                         strDonViTinh_Id, dPhanTramHuong, strGhiChu
       SV_ChinhSach_DT/Xoa               strIds (từng dòng một), strChucNang_Id
       danh mục QLTC.CDCS (chế độ), QLTC.DTMG (đối tượng), QLTC.DONVITINH (đơn vị tính)
   Khác bản gốc:
     · Biểu mẫu thay chỗ danh sách (gốc: hộp thoại) — quy ước chung. Thêm mới chọn sẵn chế độ đang lọc (như gốc).
     · Cột "Hiệu lực" hiện Có / Không (gốc in số 1 / 0).
   Bỏ (mã chết): getList_ThoiGianDaoTao / genCombo_ThoiGianDaoTao (KHCT_ThoiGianDaoTao — không nơi nào gọi,
   đổ vào dropSearch_ThoiGian / dropThoiGian không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('svcs-chedochinhsach');
    if (!root) return;

    var CHEDO = { dm: 'QLTC.CDCS' };
    var HIEULUC = { items: [{ ID: '1', TEN: 'Có' }, { ID: '0', TEN: 'Không' }] };

    ums.crud({
        root: root,
        title: 'Chế độ chính sách',
        formTitle: 'chế độ - chính sách',
        icon: 'fa-gift',
        formCols: 1,
        filters: [
            { key: 'cheDo', type: 'select', label: 'Chọn chế độ', source: CHEDO },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'SV_ChinhSach_DT/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q, strCheDoChinhSach_Id: f.cheDo, strDoiTuong_Id: '', strNguoiTao_Id: ''
                };
            }
        },
        columns: [
            { title: 'Chế độ', prop: 'CHEDOCHINHSACH_TEN' },
            { title: 'Đối tượng', prop: 'DOITUONG_TEN' },
            { title: 'Đơn vị tính', prop: 'DONVITINH_TEN', cls: 'is-center' },
            { title: 'Hiệu lực', prop: 'HIEULUC', cls: 'is-center', lookup: HIEULUC },
            { title: 'Phần trăm hưởng', prop: 'PHANTRAMHUONG', cls: 'is-center' },
            { title: 'Ghi chú', prop: 'GHICHU' }
        ],
        fields: [
            { key: 'strCheDoChinhSach_Id', col: 'CHEDOCHINHSACH_ID', label: 'Chế độ', type: 'select', source: CHEDO },
            { key: 'strDoiTuong_Id', col: 'DOITUONG_ID', label: 'Đối tượng', type: 'select', source: { dm: 'QLTC.DTMG' } },
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', source: { dm: 'QLTC.DONVITINH' } },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', source: HIEULUC, value: '1', required: true },
            { key: 'dPhanTramHuong', col: 'PHANTRAMHUONG', label: 'Phần trăm hưởng' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú' }
        ],
        /* resetPopup gốc: thêm mới thì chế độ = chế độ đang lọc */
        onForm: function (row, crud) {
            if (row) return;
            var el = crud.root.querySelector('[data-k="strCheDoChinhSach_Id"]');
            var v = crud.filterValues().cheDo || '';
            if (el && v) { el.value = v; if (window.jQuery) jQuery(el).trigger('change.select2'); }
        },
        save: function (v, row) {
            v.action = row ? 'SV_ChinhSach_DT/CapNhat' : 'SV_ChinhSach_DT/ThemMoi';
            v.strId = row ? row.ID : '';
            v.strChucNang_Id = (ums.state && ums.state.chucNangId) || '';
            return v;
        },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'SV_ChinhSach_DT/Xoa', strIds: id, strChucNang_Id: (ums.state && ums.state.chucNangId) || '' };
            });
        }
    });
})();
