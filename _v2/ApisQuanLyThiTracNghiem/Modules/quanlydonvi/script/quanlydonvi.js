/* =========================================================================
   Quản lý đơn vị (thi trắc nghiệm) — danh sách + biểu mẫu (ums.crud, một cột như gốc)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlydonvi/html/quanlydonvi.html + script/quanlydonvi.js
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, không func, không iM — chép nguyên):
     Danh sách  QLTTN_ThongTin/LayDS_ThonTinDonVi (sic) GET versionAPI v1.0, strTuKhoa, strStatus,
                PageNumber, ItemPerPage — phân trang máy chủ, tổng ở Pager. Cột CODE, NAME, STATUS.
     Thêm       QLTTN_ThongTin/Them_ThongTinDonVi POST strId '', strCode, strName, strStatus, strNguoiThucHien_Id
     Sửa        QLTTN_ThongTin/Sua_ThongTinDonVi  POST (như trên, strId = ID dòng)
     Xoá        QLTTN_ThongTin/Xoa_ThongTinDonVi  POST strId (từng id), strNguoiThucHien_Id
   Nút "Chi tiết" của gốc mở biểu mẫu sửa → nút Sửa trên dòng của ums.crud (cùng việc).
   ums.crud tự thêm pageIndex / pageSize vào lời gọi danh sách (thừa, máy chủ bỏ qua) — tham số
   phân trang thật vẫn là PageNumber / ItemPerPage như gốc.
   Lỗi gốc đã sửa:
     · Cột "Trạng thái" đọc nhầm aData.STUTUS (không có cột này) → mọi dòng luôn "Ẩn". Nay đọc STATUS
       (đúng cột biểu mẫu sửa đọc).
     · Xoá: gốc gửi từng lời gọi rồi 2 giây sau tự nạp lại, không chờ kết quả; nay chờ xong mới nạp lại.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qlttn-quanlydonvi');
    if (!root) return;
    var TT = [{ ID: '1', TEN: 'Hiện' }, { ID: '0', TEN: 'Ẩn' }];
    function e(v) { return v === null || v === undefined ? '' : String(v); }

    ums.crud({
        root: root,
        title: 'Quản lý đơn vị',
        listTitle: 'Danh sách đơn vị',
        formTitle: 'đơn vị',
        icon: 'fa-sitemap',
        addText: 'Tạo mới',
        removeText: 'Xóa',
        filters: [
            { key: 'tt', type: 'select', label: 'Chọn trạng thái', source: { items: TT } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f, p) {
                return { action: 'QLTTN_ThongTin/LayDS_ThonTinDonVi', method: 'GET', versionAPI: 'v1.0',
                    strTuKhoa: f.q || '', strStatus: f.tt || '', PageNumber: p.index, ItemPerPage: p.size };
            }
        },
        columns: [
            { title: 'Mã đơn vị', prop: 'CODE', cls: 'is-nowrap' },
            { title: 'Tên đơn vị', prop: 'NAME' },
            { title: 'Trạng thái', cls: 'is-center', render: function (r) {
                return e(r.STATUS) === '1' ? ums.ui.badge('Hiện', 'ok') : ums.ui.badge('Ẩn', 'mute');
            } }
        ],
        fields: [
            { key: 'strCode', col: 'CODE', label: 'Mã đơn vị', required: true },
            { key: 'strName', col: 'NAME', label: 'Tên đơn vị', required: true },
            { key: 'strStatus', col: 'STATUS', label: 'Trạng thái', type: 'select', required: true, placeholder: 'Chọn trạng thái', source: { items: TT } }
        ],
        save: function (v, row) {
            return { action: row ? 'QLTTN_ThongTin/Sua_ThongTinDonVi' : 'QLTTN_ThongTin/Them_ThongTinDonVi', method: 'POST', versionAPI: 'v1.0',
                strId: row ? row.ID : '', strCode: v.strCode, strName: v.strName, strStatus: v.strStatus,
                strNguoiThucHien_Id: ums.session.userId };
        },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'QLTTN_ThongTin/Xoa_ThongTinDonVi', method: 'POST', versionAPI: 'v1.0', strId: id, strNguoiThucHien_Id: ums.session.userId };
            });
        }
    });
})();
