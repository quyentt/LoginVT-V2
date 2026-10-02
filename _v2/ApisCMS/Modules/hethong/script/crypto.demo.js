/* Dữ liệu mẫu cho hethong/crypto — chỉ dùng ở chế độ dựng thử.
   Máy chủ thật mã hoá AES; ở đây chỉ đảo chuỗi + base64 cho có kết quả để xem. */
(function () {
    function b64(s) { try { return btoa(unescape(encodeURIComponent(s))); } catch (e) { return ''; } }
    function unb64(s) { try { return decodeURIComponent(escape(atob(s))); } catch (e) { return ''; } }
    ums.demo.add({
        'SYS_Crypto_AES/Encrypt': function (o) {
            return { rows: [], message: b64((o.secret || '') + '|' + (o.decrypt || '')) };
        },
        'SYS_Crypto_AES/Decrypt': function (o) {
            var s = unb64(o.encrypt || ''), k = (o.secret || '') + '|';
            return { rows: [], message: s.indexOf(k) === 0 ? s.substring(k.length) : '' };
        }
    });
})();
