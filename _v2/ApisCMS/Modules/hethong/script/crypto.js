/* =========================================================================
   Hệ thống mật mã
   Bản gốc: ApisCMS/Modules/hethong/html/crypto.html + script/crypto.js
   ---------------------------------------------------------------------------
   Hai cột như bản gốc (col-md-7 biểu mẫu | col-md-5 hình minh hoạ).
   Lời gọi — chép nguyên văn:
       SYS_Crypto_AES/Encrypt   GET   decrypt, secret   → Message = chuỗi đã mã hoá
       SYS_Crypto_AES/Decrypt   GET   encrypt, secret   → Message = chuỗi đã giải mã
   Việc mã hoá / giải mã do MÁY CHỦ làm; màn chỉ gửi chuỗi + mã bí mật và hiện
   Message trả về. Không đụng tới AE / AD / ASG của trình duyệt.

   Cố ý khác bản gốc:
     · Bản gốc ĐIỀN SẴN (và nút "Viết lại" điền lại) một chuỗi kết nối CSDL có
       tài khoản + mật khẩu ("Data Source=…;User ID=…;Password=…") và một mã bí
       mật mặc định vào ô nhập — tức in bí mật lên màn cho mọi người mở màn này.
       Bản mới để TRỐNG các ô đó; "Viết lại" xoá trắng. Không chép hai chuỗi đó
       vào mã. (ghi can-quyet)
     · Ô mã bí mật dùng type="password" kèm nút hiện/ẩn (gốc là ô chữ thường).
     · Ảnh minh hoạ Upload/images/mahoa.svg (nằm ngoài gói _v2) thay bằng biểu
       tượng khoá.
     · Kiểm tra rỗng: gốc chỉ kiểm chuỗi cần mã hoá / giải mã; giữ đúng vậy
       (mã bí mật rỗng vẫn gửi, để máy chủ báo lỗi như gốc).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('cms-crypto');
    if (!root) return;

    function khoaBiMat(k) {
        return '<div class="cmsht-sua">' +
            '<input class="ums-input" type="password" data-k="' + k + '" placeholder="Nhập mã bí mật" autocomplete="new-password">' +
            '<button type="button" class="ums-iconbtn" data-hien="' + k + '" title="Hiện / ẩn mã bí mật"><i class="fa-light fa-eye"></i></button></div>';
    }

    root.innerHTML =
        ums.pat.page('Hệ thống mật mã',
            ui.btn('search', { text: 'Mã hóa', mod: 'danger', icon: 'fa-lock', attr: { 'data-a': 'ma' } }) +
            ui.btn('search', { text: 'Giải hóa', mod: 'primary', icon: 'fa-lock-open', attr: { 'data-a': 'giai' } }) +
            ui.btn('reload', { text: 'Viết lại', icon: 'fa-eraser', attr: { 'data-a': 'viet' } })) +
        '<div class="cmsht-cols">' +
            '<div>' +
            ums.pat.panel({
                title: 'Nội dung mã hóa', icon: 'fa-lock',
                body: '<div class="ums-stack">' +
                    ui.field('Chuỗi mã hóa', '<div class="cmsht-sua"><input class="ums-input" data-k="decrypt" placeholder="Nhập chuỗi cần mã hóa" autocomplete="off">' +
                        '<button type="button" class="ums-iconbtn" data-a="xoaChuoi" title="Xoá chuỗi"><i class="fa-light fa-xmark"></i></button></div>', { required: true }) +
                    ui.field('Mã bí mật', khoaBiMat('secretEn')) +
                    ui.field('Kết quả', '<textarea class="ums-textarea cmsht-kq--ma" data-k="kqMa" rows="3" placeholder="Kết quả mã hóa" readonly></textarea>') +
                    '</div>'
            }) +
            ums.pat.panel({
                title: 'Nội dung giải mã', icon: 'fa-lock-open',
                body: '<div class="ums-stack">' +
                    ui.field('Chuỗi giải hóa', '<input class="ums-input" data-k="encrypt" placeholder="Nhập chuỗi giải mã" autocomplete="off">', { required: true }) +
                    ui.field('Mã bí mật', khoaBiMat('secretDe')) +
                    ui.field('Kết quả', '<textarea class="ums-textarea cmsht-kq--giai" data-k="kqGiai" rows="3" placeholder="Kết quả giải hóa" readonly></textarea>') +
                    '</div>'
            }) +
            '</div>' +
            ums.pat.panel({
                title: 'Mật mã', icon: 'fa-shield-keyhole',
                body: '<div class="cmsht-hinh"><i class="fa-light fa-shield-keyhole"></i>' +
                    '<span class="ums-u-fz13">Mã hóa / giải mã chuỗi bằng AES phía máy chủ (SYS_Crypto_AES).</span></div>'
            }) +
        '</div>';

    function o(k) { return root.querySelector('[data-k="' + k + '"]'); }

    function chay(action, params, kq, nhan) {
        o(kq).value = '';
        params.action = action;
        params.method = 'GET';
        return ums.api.call(params).then(function (r) {
            o(kq).value = r.message == null ? '' : r.message;
        }).catch(function (err) { ums.api.handle(err, nhan); });
    }

    root.addEventListener('click', function (e) {
        var hien = e.target.closest('[data-hien]');
        if (hien) {
            var inp = o(hien.getAttribute('data-hien'));
            inp.type = inp.type === 'password' ? 'text' : 'password';
            hien.querySelector('i').className = 'fa-light ' + (inp.type === 'password' ? 'fa-eye' : 'fa-eye-slash');
            return;
        }
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'xoaChuoi') { o('decrypt').value = ''; o('decrypt').focus(); return; }
        if (a === 'viet') {
            ['decrypt', 'kqMa', 'encrypt', 'kqGiai'].forEach(function (k) { o(k).value = ''; });
            return;
        }
        if (a === 'ma') {
            if (!o('decrypt').value) { ui.toast('Vui lòng nhập chuỗi cần mã hóa!', 'warn'); return; }
            chay('SYS_Crypto_AES/Encrypt', { decrypt: o('decrypt').value, secret: o('secretEn').value }, 'kqMa', 'SYS_Crypto_AES.Encrypt');
            return;
        }
        if (a === 'giai') {
            if (!o('encrypt').value) { ui.toast('Vui lòng nhập chuỗi cần giải mã!', 'warn'); return; }
            chay('SYS_Crypto_AES/Decrypt', { encrypt: o('encrypt').value, secret: o('secretDe').value }, 'kqGiai', 'SYS_Crypto_AES.Decrypt');
        }
    });
})();
