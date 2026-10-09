/* =========================================================================
   Văn bản — quản lý văn bản, quy định, biểu mẫu (phân hệ Tin tức)
   Bản gốc: ApisTinTuc/Modules/kehoach/html/vanban.html + script/vanban.js
   ---------------------------------------------------------------------------
   Một cột như bản gốc: thanh tìm (Loại văn bản · từ khoá) + bảng + biểu mẫu
   thêm / sửa trong trang (ums.crud).

   Lời gọi (kiểu cũ, không mã hoá):
       Danh mục TINTUC.VANBAN.LOAI            ô "Loại văn bản" (lọc + biểu mẫu)
       TT_VanBan/LayDSTinTuc_VanBan     GET   strTuKhoa, strLoaiVanBan_Id, strNguoiThucHien_Id
                                              Pager = tổng số dòng (lblBanTin_Tong)
       TT_VanBan/Them_TinTuc_VanBan     POST  | Sua_TinTuc_VanBan khi có strId
                                              strLoaiVanVan_Id (tên tham số gốc viết sai chính tả — GIỮ),
                                              strTenVanBan, strSoHieu, strNgayBanHanh, iThuTu, dHieuLuc
       TT_VanBan/Xoa_TinTuc_VanBan      POST  strId — mỗi dòng đánh dấu một lời gọi
       TT_Files/LayDanhSach | ThemMoi | Xoa    tệp đính kèm (viewFiles / saveFiles gốc) — trong bảng
                                              MỖI DÒNG một lời gọi LayDanhSach như bản gốc

   Giữ như gốc:
     · Sửa đọc dữ liệu từ dòng đang có, không gọi LayChiTiet.
     · Cột "Hiệu lực" chỉ hiện chữ "Hết hiệu lực" khi HIEULUC = 0, còn lại để trống.
     · Thêm xong vẫn gắn tệp vào data.Id máy chủ trả (crud tự lo).

   Khác gốc (lỗi rõ ràng, làm theo ý định):
     · Ô từ khoá gốc KHÔNG được gửi (đọc ô txtAAAA không tồn tại) → gửi strTuKhoa.
     · Bản gốc gửi strLoaiVanVan_Id đọc từ ô dropAAAA không tồn tại (luôn rỗng) trong
       khi thanh lọc lại lọc theo loại → thêm ô "Loại văn bản" vào biểu mẫu; cột đọc
       ra khi sửa đoán là LOAIVANBAN_ID. KIỂM TRÊN HOST.
     · Hiệu lực mặc định khi thêm = 1 (gốc gọi nhầm viewFiles để đặt).
   Cố ý bỏ: ảnh trang trí img-news-1.png cạnh biểu mẫu.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('tt-vanban');
    if (!root) return;
    function esc(s) { return ui.esc(s == null ? '' : String(s)); }
    var tep = {};                        // id văn bản → [{FILEMINHCHUNG, TENHIENTHI}]

    var crud = ums.crud({
        root: root,
        title: 'Văn bản',
        listTitle: 'Danh sách',
        formTitle: 'văn bản',
        icon: 'fa-file-lines',
        filters: [
            { key: 'loai', type: 'select', label: 'Loại văn bản', source: { dm: 'TINTUC.VANBAN.LOAI' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            call: function (f) {
                return { action: 'TT_VanBan/LayDSTinTuc_VanBan', method: 'GET', strTuKhoa: f.q || '', strLoaiVanBan_Id: f.loai || '' };
            },
            rows: function (data) {
                var rows = Array.isArray(data) ? data : [];
                rows.forEach(function (r) {
                    if (tep[r.ID] !== undefined) return;
                    tep[r.ID] = [];
                    ums.api.call({ action: 'TT_Files/LayDanhSach', method: 'GET', strDuLieu_Id: r.ID, silent: true }).then(function (x) {
                        var d = Array.isArray(x.data) ? x.data : [];
                        if (d.length) { tep[r.ID] = d; crud.draw(); }
                    }).catch(function () { /* không có tệp */ });
                });
                return rows;
            }
        },
        columns: [
            { title: 'Tên văn bản', prop: 'TENVANBAN' },
            { title: 'Số kí hiệu', prop: 'SOHIEU' },
            { title: 'Ngày ban hành', prop: 'NGAYBANHANH', cls: 'is-center is-nowrap' },
            { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center' },
            { title: 'File đính kèm', cls: 'is-center', render: function (r) {
                return (tep[r.ID] || []).map(function (f) {
                    var ten = f.TENHIENTHI || String(f.FILEMINHCHUNG || '').split('/').pop();
                    return '<a class="ums-link" href="' + esc((ums.session.rootPathUpload || '') + '/' + f.FILEMINHCHUNG) + '" target="_blank" rel="noopener">' + esc(ten) + '</a>';
                }).join('<br>');
            } },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return String(r.HIEULUC) === '0' ? 'Hết hiệu lực' : ''; } }
        ],
        fields: [
            { key: 'strTenVanBan', col: 'TENVANBAN', label: 'Tên văn bản', required: true, span: true },
            { key: 'strSoHieu', col: 'SOHIEU', label: 'Số ký hiệu' },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' },
            { key: 'strNgayBanHanh', col: 'NGAYBANHANH', label: 'Ngày ban hành', type: 'date' },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', value: '1',
              source: { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] } },
            { key: 'strLoaiVanVan_Id', label: 'Loại văn bản', type: 'select', source: { dm: 'TINTUC.VANBAN.LOAI' },
              get: function (r) { return r.LOAIVANBAN_ID || r.LOAIVANVAN_ID || r.LOAI_ID || ''; } },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'TT_Files' }
        ],
        save: function (v, row) {
            return {
                action: 'TT_VanBan/' + (row ? 'Sua_TinTuc_VanBan' : 'Them_TinTuc_VanBan'),
                method: 'POST',
                strId: row ? row.ID : '',
                strLoaiVanVan_Id: v.strLoaiVanVan_Id || '',
                strTenVanBan: v.strTenVanBan,
                strSoHieu: v.strSoHieu,
                strNgayBanHanh: v.strNgayBanHanh,
                iThuTu: v.iThuTu,
                dHieuLuc: v.dHieuLuc
            };
        },
        onSaved: function () { tep = {}; },
        remove: function (ids) {
            return ids.map(function (id) { return { action: 'TT_VanBan/Xoa_TinTuc_VanBan', method: 'POST', strId: id }; });
        }
    });
})();
