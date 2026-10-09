/* =========================================================================
   Upcode
   Bản gốc: ApisCMS/Modules/danhmuc/html/upcode.html + script/upcode.js
   ---------------------------------------------------------------------------
   ⚠ TRIỂN KHAI MÃ LÊN MÁY CHỦ: gói .zip (bản Publish của Visual Studio) được tải
   lên <rootPathUpload>/Handler/deploycode.ashx rồi CMS_UpCode/UpCode giải nén đè
   lên mã giao diện đang chạy.

   Bố cục bản gốc (một cột): khung "Upcode" — "Chọn file zip để upcode:" + ô tải
   tệp ; khung "Hướng dẫn" — đoạn chữ + hai ảnh minh hoạ.

   Lời gọi (chép nguyên):
       POST <rootPathUpload>/Handler/deploycode.ashx  (multipart, tên trường = tên tệp,
            chỉ nhận .zip; trả chuỗi, chứa "Loi System" = lỗi) — ums.cmsCu.taiZip
       CMS_UpCode/UpCode  GET  strPath = phần trước "$", strFileName = phần sau "$"
            của chuỗi trả về (đã nhân đôi "\" như outThongTinDinhKem của gốc)
       → "Đã import dữ liệu: <Message>" | "Lỗi: <Message>"

   Khác gốc:
     · Chọn tệp xong HỎI LẠI trước khi tải lên (gốc tải + triển khai ngay khi chọn).
     · Gốc ghi kết quả vào #notify_import nhưng html upcode KHÔNG có vùng đó → người
       dùng không bao giờ thấy kết quả. Nay hiện ở khung kết quả + thông báo nổi.
     · Hai ảnh hướng dẫn nằm trên máy chủ ngoài (apis.com.vn) → để thành liên kết mở
       tab mới, không nhúng ảnh của máy chủ ngoài vào trang.
     · Bỏ danh sách tệp đã tải + nút gỡ tệp của ô tải gốc (gỡ khỏi danh sách không
       huỷ được việc đã triển khai, gốc cũng không gọi xoá tệp).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cu = ums.cmsCu;
    var root = document.getElementById('cms-upcode');
    if (!root) return;

    root.innerHTML =
        pat.page('Upcode', '') +
        pat.panel({ title: 'Upcode', icon: 'fa-upload', cls: 'ums-u-mb-4', body:
            ui.field('Chọn file zip để upcode', ui.file({ key: 'zip', accept: '.zip', pick: 'Chọn tệp .zip' }), { inline: true }) +
            '<div class="cu-notify" data-z="kq"></div>' }) +
        pat.panel({ title: 'Hướng dẫn', icon: 'fa-file-invoice', body:
            '<div class="cu-guide">' +
                '<p>Mở Visual studio chọn Public project cần up. Vào thư mục "D:\\Cloulds\\Dropbox" zip project đó. ' +
                'Quay lại trang này, upload file vừa nén.</p>' +
                '<p><b>Chú ý: Chỉ upload được giao diện module theo quyền user đang đăng nhập</b></p>' +
                '<div class="cu-guide__links">' +
                    '<a href="https://apis.com.vn/upload/extract/upcode1.png" target="_blank" rel="noopener noreferrer"><i class="fa-light fa-image"></i> Ảnh minh hoạ 1</a>' +
                    '<a href="https://apis.com.vn/upload/extract/upcode2.png" target="_blank" rel="noopener noreferrer"><i class="fa-light fa-image"></i> Ảnh minh hoạ 2</a>' +
                '</div>' +
            '</div>' });
    ui.enhance(root);

    var inp = root.querySelector('input[type="file"]');
    var kq = root.querySelector('[data-z="kq"]');

    function bao(msg, xau) { kq.classList.toggle('is-bad', !!xau); kq.textContent = msg; }

    inp.addEventListener('change', function () {
        var tep = inp.files && inp.files[0];
        if (!tep) return;
        cu.ghi('Tải gói "' + tep.name + '" lên máy chủ và TRIỂN KHAI ngay? Mã giao diện đang chạy của các module trong gói sẽ bị ghi đè; ' +
            'người đang dùng sẽ nhận bản mới ở lần tải trang kế tiếp.', { ok: 'Upcode' }).then(function (ok) {
            if (!ok) { inp.value = ''; inp.dispatchEvent(new Event('change')); return; }
            bao('Vui lòng chờ đợi…');
            cu.taiZip(tep).then(function (strPath) {
                var a = strPath.split('$');
                return ums.api.call({ action: 'CMS_UpCode/UpCode', method: 'GET', strPath: a[0], strFileName: a[1] });
            }).then(function (r) {
                bao('Đã import dữ liệu: ' + cu.e(r.message));
                ui.toast('Upcode xong: ' + tep.name, 'ok');
            }).catch(function (err) {
                bao('Lỗi: ' + err.message, true);
                ums.api.handle(err, 'upcode');
            }).then(function () {
                inp.value = '';
            });
        });
    });
})();
