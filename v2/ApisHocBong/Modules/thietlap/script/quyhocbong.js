/* =========================================================================
   Quỹ học bổng
   Bản gốc: ApisHocBong/Modules/thietlap/html/quyhocbong.html + script/quyhocbong.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): ô từ khoá · Tìm kiếm → khung "Danh sách (n)" (Xóa · Thêm mới) với bảng
   Mã · Tên quỹ · Mô tả · Hiệu lực · Sửa · ô đánh dấu → hộp "Quỹ học bổng" (Mã · Tên quỹ · Mô tả · Hiệu lực).
   Bản mới: ums.crud — biểu mẫu THAY CHỖ danh sách (luật chung, không dùng hộp thoại cho biểu mẫu chính).

   Lời gọi (chép nguyên):
       HB_QuyHocBong/LayDanhSach GET — strTuKhoa, strNguoiTao_Id ('' — gốc đọc dropAAAA), phân trang máy chủ
       HB_QuyHocBong/ThemMoi | CapNhat POST — strId, strTen, strMa, strMoTa, dHieuLuc (1 | 0), strNguoiThucHien_Id
       HB_QuyHocBong/Xoa POST — mỗi dòng đã đánh dấu một lời gọi: strIds, strChucNang_Id, strNguoiThucHien_Id
   Khác gốc:
     · Lưu xong về danh sách (gốc để hộp mở, báo trong hộp rồi nạp lại danh sách phía sau).
     · Cột Hiệu lực: gốc so HIEULUC === 1 (số) — máy chủ trả "1" dạng chuỗi thì hiện nhầm "Hết hiệu lực";
       bản mới so theo giá trị số.
     · Không có nút xoá trên từng dòng và trong biểu mẫu (gốc chỉ có "Xóa" nhiều dòng).
   Cố ý bỏ (mã chết): getList_ThoiGianDaoTao / genCombo_ThoiGianDaoTao (bị chú thích trong init, ô không có).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('hb-quyhocbong');
    if (!root) return;

    ums.crud({
        root: root,
        title: 'Quỹ học bổng',
        formTitle: 'quỹ học bổng',
        icon: 'fa-list-timeline',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'HB_QuyHocBong/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiTao_Id: '' };
            }
        },
        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên quỹ', prop: 'TEN' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Hiệu lực', cls: 'is-center is-nowrap', render: function (r) {
                return Number(r.HIEULUC) === 1 ? ums.ui.badge('Còn hiệu lực', 'ok') : ums.ui.badge('Hết hiệu lực', 'mute');
            } }
        ],
        formCols: 2,
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã' },
            { key: 'strTen', col: 'TEN', label: 'Tên quỹ' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', required: true, value: '1',
                source: { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] } }
        ],
        save: function (v, row) {
            return {
                action: row ? 'HB_QuyHocBong/CapNhat' : 'HB_QuyHocBong/ThemMoi',
                strId: row ? row.ID : '',
                strTen: v.strTen, strMa: v.strMa, strMoTa: v.strMoTa, dHieuLuc: v.dHieuLuc,
                strNguoiThucHien_Id: ''
            };
        },
        rowDelete: false,
        formDelete: false,
        removeText: 'Xóa',
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'HB_QuyHocBong/Xoa', strIds: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
            });
        }
    });
})();
