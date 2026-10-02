/* =========================================================================
   ums.session — khôi phục phiên đăng nhập từ vỏ ASPX
   =========================================================================
   Đây là bản viết lại sạch của hàm `AFG()` nằm trong
   `assets/pagination/jquery.simplePagination.min.js` của hệ hiện hành.

   Chuỗi khởi tạo thật của hệ thống:

       <script>AXYZCLRVN = () => "<%= lblXYZCLRVN %>"</script>   ← máy chủ bơm
       assets/js/crypto-js.js        → cung cấp AE() và AD()
       Config.js                     → cung cấp Init_API() (29 base URL)

   Blob do máy chủ bơm ra là JSON đã mã hoá bằng khoá "AzzS", giải ra được:
       rootPath · rootPathUpload · rootPathReport · rootPathAPI
       folderAvatar · folderDoc · clientIP
       userId · appId · langId · tokenJWT · raven · avatar

   Module này CHỈ giải mã và cất giữ. Không dựng menu, không gọi API —
   khác với AFG() bản gốc vốn làm cả ba việc trong một hàm.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});

    var S = {
        ready: false,
        error: null,

        userId: '',
        appId: '',          // chính là VaiTro_Id — xem CLAUDE.md mục 4
        langId: 'VI',
        tokenJWT: '',
        raven: '',
        clientIP: '',

        host: '',
        rootPath: '',
        rootPathUpload: '',
        rootPathReport: '',
        apiUrl: '',
        apiUrlTemp: '',
        logoutUrl: '',

        // Khoá mã hoá payload. Rỗng = gửi thẳng không mã hoá.
        iM: 'AzzSystem',

        // Bảng base URL theo tiền tố, lấy từ Init_API()
        api: {}
    };

    /* ---------- Địa chỉ gốc và trang đăng xuất --------------------------- */
    function resolveHost() {
        var origin = location.origin;
        if (origin.indexOf('localhost:') !== -1) {
            S.host = location.protocol + '//' + location.hostname;
        } else {
            S.host = origin;
        }
        /* Trang đăng xuất lấy NGAY CẠNH trang đang mở, không suy ra từ gốc ứng
           dụng: chạy ở _v2 thì về _v2/Logout.aspx (rồi sang _v2/login.aspx của bản
           mới), chạy ở gốc thì về Logout.aspx như cũ. */
        var dir = location.pathname.replace(/[^/]*$/, '');
        S.logoutUrl = origin + dir + 'Logout.aspx';
    }

    /* ---------- Giải mã blob phiên --------------------------------------- */
    function readBlob() {
        if (typeof AXYZCLRVN !== 'function') {
            throw new Error('Thiếu AXYZCLRVN() — trang phải được máy chủ render (.aspx), không mở trực tiếp tệp .html');
        }
        if (typeof AD !== 'function') {
            throw new Error('Thiếu AD() — chưa nạp assets/js/crypto-js.js');
        }

        var blob = AXYZCLRVN();
        if (!blob) {
            throw new Error('Blob phiên rỗng — nhiều khả năng chưa đăng nhập hoặc phiên đã hết hạn');
        }

        return JSON.parse(AD(blob, 'AzzS'));
    }

    /* ---------- Bảng base URL -------------------------------------------- */
    function readApiMap() {
        if (typeof Init_API !== 'function') {
            throw new Error('Thiếu Init_API() — chưa nạp Config.js');
        }
        return Init_API() || {};
    }

    /* ---------- Khởi tạo -------------------------------------------------- */
    S.init = function () {
        try {
            resolveHost();

            var a = readBlob();

            S.userId = a.userId || '';
            S.appId = a.appId || '';
            S.langId = a.langId || 'VI';
            S.tokenJWT = a.tokenJWT || '';
            S.raven = a.raven || '';
            S.clientIP = a.clientIP || '';

            S.rootPath = S.host + (a.rootPath || '');
            S.rootPathReport = a.rootPathReport || '';
            S.apiUrl = S.host + (a.rootPathAPI || '');
            S.apiUrlTemp = S.host;

            S.rootPathUpload = a.rootPathUpload || '';
            if (S.rootPathUpload && S.rootPathUpload.indexOf('http') === -1) {
                S.rootPathUpload = S.host + S.rootPathUpload;
            }

            // Cho phép tắt mã hoá payload khi cần soi request lúc gỡ lỗi
            try {
                if (localStorage.getItem('strIM') === 'false') S.iM = '';
            } catch (e) {}

            S.api = readApiMap();
            S.ready = true;

        } catch (err) {
            S.error = err.message;
            S.ready = false;
            console.error('[ums.session]', err.message);
        }
        return S;
    };

    /* ---------- Kết thúc phiên -------------------------------------------- */
    S.logout = function () {
        try { sessionStorage.clear(); } catch (e) {}
        try {
            ['strIM', 'strRootPath', 'pendingThuVaiSV', 'reload'].forEach(function (k) {
                localStorage.removeItem(k);
            });
        } catch (e) {}
        location.href = S.logoutUrl || 'Logout.aspx';
    };

    ums.session = S;

})(window);
