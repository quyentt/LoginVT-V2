/* =========================================================================
   Văn bản, quy định, biểu mẫu — danh sách văn bản (CHỈ XEM, Cổng sinh viên)
   Bản gốc: ApisCongSinhVien/Modules/tintuc/html/vanban.html + script/vanban.js
   ---------------------------------------------------------------------------
   So với bản Cổng cán bộ (ApisCongCanBo/Modules/tintuc/script/vanban.js) chỉ
   khác đúng LỜI GỌI danh sách: Cổng sinh viên đi qua dịch vụ tin tức đã mã hoá
   (action + func + iM, POST), Cổng cán bộ gọi SV_ThongTin/LayDSTinTuc_VanBan
   bằng GET. Bảng, cột, phần lấy tệp giống hệt nhau.

   Lời gọi (chép nguyên action / func / tên tham số):
       pkg_tintuc.LayDSTinTuc_VanBan   strNguoiThucHien_Id (= người học đang thủ vai),
                                       strLoaiVanBan_Id '' (ô dropAAAA không có trên màn)
       TT_Files/LayDanhSach   GET  strDuLieu_Id = id văn bản — MỖI DÒNG một lời gọi
                                   (như bản gốc), lấy tệp ĐẦU TIÊN làm liên kết của
                                   cột "Số kí hiệu"
   Bố cục giữ nguyên: MỘT cột, một khung "Văn bản, quy định, biểu mẫu" chứa bảng.
   Cột chép từ `aoColumns` của bản gốc: STT, Tên văn bản (TENVANBAN), Số kí hiệu
   (SOHIEU — thẻ <a> tới tệp), Ngày ban hành (NGAYBANHANH); canh giữa cột 0/2/3
   đúng `colPos` của bản gốc.
   Bỏ cột "Files" của bản gốc — tiêu đề đã bị chú thích sẵn trong HTML gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    function esc(s) { return ui.esc(s); }
    var tep = {};                        // id văn bản → đường dẫn tệp đầu tiên

    var crud = ums.crud({
        root: document.getElementById('csv-vanban'),
        title: 'Văn bản, quy định, biểu mẫu',
        listTitle: 'Văn bản, quy định, biểu mẫu',
        icon: 'fa-file-lines',
        list: {
            call: function () {
                return {
                    action: 'TS_TinTuc_MH/DSA4BRIVKC8VNCIeFyAvAyAv',
                    func: 'pkg_tintuc.LayDSTinTuc_VanBan',
                    strLoaiVanBan_Id: ''
                };
            },
            rows: function (data) {
                var rows = Array.isArray(data) ? data : [];
                rows.forEach(function (r) {
                    if (tep[r.ID] !== undefined) return;
                    tep[r.ID] = '';
                    ums.api.call({ action: 'TT_Files/LayDanhSach', method: 'GET', strDuLieu_Id: r.ID, silent: true })
                        .then(function (x) {
                            var d = Array.isArray(x.data) ? x.data : [];
                            if (d.length && d[0].FILEMINHCHUNG) {
                                tep[r.ID] = (ums.session.rootPathUpload || '') + '/' + d[0].FILEMINHCHUNG;
                                crud.draw();
                            }
                        }).catch(function () { /* không có tệp thì để chữ thường */ });
                });
                return rows;
            }
        },
        columns: [
            { title: 'Tên văn bản', prop: 'TENVANBAN' },
            { title: 'Số kí hiệu', cls: 'is-center', render: function (r) {
                return tep[r.ID]
                    ? '<a class="ums-link" href="' + esc(tep[r.ID]) + '" target="_blank" rel="noopener">' + esc(r.SOHIEU || '') + '</a>'
                    : esc(r.SOHIEU || '');
            } },
            { title: 'Ngày ban hành', prop: 'NGAYBANHANH', cls: 'is-center is-nowrap' }
        ]
    });
})();
