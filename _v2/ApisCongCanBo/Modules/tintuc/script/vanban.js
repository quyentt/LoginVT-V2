/* =========================================================================
   Văn bản, quy định, biểu mẫu — danh sách văn bản (CHỈ XEM)
   Bản gốc: ApisCongCanBo/Modules/tintuc/script/vanban.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, GET):
       SV_ThongTin/LayDSTinTuc_VanBan  strNguoiThucHien_Id, strLoaiVanBan_Id '' (ô dropAAAA không có)
       TT_Files/LayDanhSach            strDuLieu_Id = id văn bản — MỖI DÒNG một lời gọi (như bản gốc),
                                       lấy tệp đầu tiên làm liên kết của "Số kí hiệu"
   Bỏ cột "Files" trống của bản gốc (tiêu đề có, không dòng nào đổ dữ liệu vào).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    var tep = {};                        // id văn bản → đường dẫn tệp đầu tiên

    var crud = ums.crud({
        root: document.getElementById('vanban'),
        title: 'Văn bản, quy định, biểu mẫu',
        listTitle: 'Văn bản, quy định, biểu mẫu',
        icon: 'fa-file-lines',
        list: {
            call: function () { return { action: 'SV_ThongTin/LayDSTinTuc_VanBan', method: 'GET', strNguoiThucHien_Id: uid(), strLoaiVanBan_Id: '' }; },
            rows: function (data) {
                var rows = Array.isArray(data) ? data : [];
                rows.forEach(function (r) {
                    if (tep[r.ID] !== undefined) return;
                    tep[r.ID] = '';
                    ums.api.call({ action: 'TT_Files/LayDanhSach', method: 'GET', strDuLieu_Id: r.ID, silent: true }).then(function (x) {
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
                return tep[r.ID] ? '<a class="ums-link" href="' + esc(tep[r.ID]) + '" target="_blank" rel="noopener">' + esc(r.SOHIEU || '') + '</a>' : esc(r.SOHIEU || '');
            } },
            { title: 'Ngày ban hành', prop: 'NGAYBANHANH', cls: 'is-center is-nowrap' }
        ]
    });
})();
