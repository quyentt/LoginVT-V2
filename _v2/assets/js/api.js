/* =========================================================================
   ums.api — tầng gọi API
   =========================================================================
   Bản viết lại của `edu.system.makeRequest` (Core/systemroot.js:577), giữ
   NGUYÊN giao thức để nói chuyện được với các microservice đang chạy:

     · action dạng  <PREFIX>_<Controller>/<method đã mã hoá>
       PREFIX tra trong Init_API() ra base URL của microservice
     · func là tên procedure PL/SQL, gửi trong payload
     · khi có iM: body bọc thành { A: AE(json, <phần sau dấu / của action>) }
       và kết quả trả về ở dạng { Data: { B: <chuỗi mã hoá> } }, giải bằng AD
     · xác thực bằng header Authorization: Bearer <tokenJWT>
     · tự chèn strChucNang_Id, strNguoiThucHien_Id, strVaiTroDangNhap_Id,
       strChucNangHeThong_Id, strNguoiThucVai_Id — chỉ khi màn hình để trống
       (bản gốc kiểm tra `if (!x)`, nên chuỗi rỗng cũng bị thay)
     · thân request là form-urlencoded, đúng như $.ajax({ data: {...} }) của
       bản gốc — KHÔNG phải JSON
     · chỉ mã hoá khi lời gọi có `func` (kiểu procedure). Action kiểu cũ như
       `TC_HoaDon/LayDanhSach` đi thẳng, không bọc { A: … } — bản gốc cũng
       chỉ mã hoá khi màn hình tự truyền iM, và toàn bộ lời gọi có func
       trong ApisTaiChinh đều truyền iM.

   Khác bản gốc ở ba điểm, đều có chủ đích:
     1. Trả Promise thay vì callback lồng nhau
     2. Không có hàng đợi tự chế (bản gốc chặn khi quá 10 request đồng thời)
     3. Lỗi ném ra ngoài để màn hình tự quyết, không tự bật alert

   Chế độ dữ liệu dựng thử (ums.state.mode = 'demo'): không gọi mạng, tra
   `ums.demo.fixtures` theo `func`, rồi theo `action`, rồi theo
   `action#strMaBangDanhMuc`. Không có thì trả mảng rỗng.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var api = {};

    var inflight = 0;

    /* ---------- Ghép URL đầy đủ ------------------------------------------ */
    function buildUrl(action) {
        var S = ums.session;
        var prefix = action.substring(0, action.indexOf('_'));
        var base = S.api[prefix];

        if (base === undefined) {
            throw new Error('Không tìm thấy base URL cho tiền tố "' + prefix +
                '" trong Init_API(). Kiểm tra Config.js.');
        }

        // Base có thể là URL tuyệt đối, hoặc đường dẫn tương đối ghép với host
        return (base.indexOf('http') === 0 ? base : S.apiUrlTemp + base) + '/' + action;
    }

    /* ---------- Chỉ báo đang tải ----------------------------------------- */
    function busy(on) {
        inflight += on ? 1 : -1;
        if (inflight < 0) inflight = 0;
        document.documentElement.classList.toggle('ums-busy', inflight > 0);
    }

    /**
     * ums.api.call({ action, func, ...tham số })
     *
     * Trả Promise:
     *   resolve → { data, pager, raw }
     *   reject  → Error kèm .status, .action, .payload
     *
     * Tuỳ chọn thêm (không gửi lên máy chủ):
     *   method   'POST' | 'GET'   mặc định POST
     *   silent   true = không hiện chỉ báo đang tải
     *   timeout  mili giây, mặc định 120000
     */
    api.call = function (opts) {
        var S = ums.session;

        if (ums.state && ums.state.mode === 'demo') return fromFixture(opts);
        if (opts && opts.json !== undefined) return api.json(opts.action, opts.json, opts);

        return new Promise(function (resolve, reject) {
            if (!S || !S.ready) {
                return reject(fail('Phiên chưa sẵn sàng: ' + ((S && S.error) || 'chưa gọi session.init()'), 0, opts));
            }
            if (!opts || !opts.action) {
                return reject(fail('Thiếu action', 0, opts));
            }

            /* --- Gom payload --- */
            var data = {};
            Object.keys(opts).forEach(function (k) {
                if (['method', 'silent', 'timeout'].indexOf(k) < 0) data[k] = opts[k];
            });

            // Tham số hệ thống — giống bản gốc: màn hình để trống thì hệ điền
            var cnId = ums.state ? (ums.state.chucNangId || '') : '';
            var roleId = (ums.state && ums.state.roleId) || S.appId;
            if (!data.strChucNang_Id) data.strChucNang_Id = cnId;
            if (!data.strNguoiThucHien_Id) data.strNguoiThucHien_Id = S.userId;
            if (!data.strVaiTroDangNhap_Id) data.strVaiTroDangNhap_Id = roleId;
            if (!data.strChucNangHeThong_Id) data.strChucNangHeThong_Id = cnId;
            data.strNguoiThucVai_Id = (ums.state && ums.state.thuVaiId) || '';
            if (data.func && data.iM === undefined && S.iM) data.iM = S.iM;

            /* Khoá mang giá trị undefined nghĩa là KHÔNG GỬI, chứ không phải gửi
               chuỗi rỗng. Hệ cũ khi không cần một tham số thì bỏ hẳn khoá ra
               khỏi object; jQuery.param lại biến undefined thành "khoa=" —
               tham số kiểu số nhận chuỗi rỗng là máy chủ trả 400. Muốn gửi
               rỗng thật thì truyền ''. */
            Object.keys(data).forEach(function (k) { if (data[k] === undefined) delete data[k]; });

            var url;
            try { url = buildUrl(data.action); }
            catch (e) { return reject(fail(e.message, 0, opts)); }

            /* --- Mã hoá payload khi có iM --- */
            var body = data;
            var method = opts.method || 'POST';

            if (data.iM) {
                if (typeof AE !== 'function') {
                    return reject(fail('Thiếu AE() — chưa nạp crypto-js.js', 0, opts));
                }
                method = 'POST';
                var key = data.action.substring(data.action.indexOf('/') + 1);
                body = { A: AE(JSON.stringify(data), key) };
            }

            /* --- Gửi --- */
            if (!opts.silent) busy(true);

            var ctrl = new AbortController();
            var timer = setTimeout(function () { ctrl.abort(); }, opts.timeout || 120000);

            var headers = {};
            if (S.tokenJWT) headers['Authorization'] = 'Bearer ' + S.tokenJWT;

            var init = { method: method, headers: headers, signal: ctrl.signal, cache: 'no-store' };
            if (method === 'POST') {
                headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                init.body = toQuery(body);
            } else {
                // `_` chống cache, giống cache:false của $.ajax
                url += (url.indexOf('?') < 0 ? '?' : '&') + toQuery(body) + '&_=' + Date.now();
            }

            fetch(url, init)
                .then(function (res) {
                    if (res.status === 401) {
                        var e = fail('Phiên đăng nhập đã hết hạn hoặc tài khoản đăng nhập ở nơi khác.', 401, opts);
                        e.expired = true;
                        throw e;
                    }
                    /* Máy chủ từ chối thì thường có KÈM LÝ DO trong thân trả
                       về (Message của API, hoặc trang lỗi của IIS). Trước đây
                       vứt hết, chỉ còn mỗi con số — nhìn ảnh chụp trên máy chủ
                       không đoán được gì. Đọc lấy vài chữ đầu để hiện kèm. */
                    if (!res.ok) {
                        return res.text().then(function (txt) {
                            throw fail('Máy chủ trả mã ' + res.status + lyDo(txt), res.status, opts);
                        }, function () {
                            throw fail('Máy chủ trả mã ' + res.status, res.status, opts);
                        });
                    }
                    return res.json();
                })
                .then(function (json) {
                    // Giải mã phần dữ liệu nếu máy chủ trả dạng { Data: { B: … } }
                    if (json && json.Data && json.Data.B && data.iM && typeof AD === 'function') {
                        try { json.Data = JSON.parse(AD(json.Data.B, data.iM)); }
                        catch (e) { /* để nguyên nếu không giải được */ }
                    }

                    if (json && json.Success === false) {
                        // err.data = Data máy chủ kèm theo lỗi (vd id bản ghi trùng lịch — phanlichgiang)
                        var loi = fail(json.Message || 'Máy chủ báo lỗi', 200, opts);
                        loi.data = json.Data;
                        throw loi;
                    }

                    resolve({
                        data: json ? json.Data : null,
                        pager: json ? json.Pager : 0,
                        message: json ? json.Message : '',   // vài thủ tục trả ID mới ở đây
                        raw: json
                    });
                })
                .catch(function (err) {
                    if (err.name === 'AbortError') err = fail('Quá thời gian chờ', 0, opts);
                    /* fetch không tới được máy chủ (tắt / sai địa chỉ trong Config.js / bị chặn CORS) →
                       trình duyệt chỉ báo "Failed to fetch" (TypeError). Nói rõ dịch vụ nào không kết nối được. */
                    else if (err instanceof TypeError && !err.action) {
                        var dv = String(opts.action || '').split('_')[0];
                        err = fail('Không kết nối được dịch vụ ' + dv + ' (máy chủ dịch vụ không phản hồi hoặc bị chặn)', 0, opts);
                        err.mang = true;
                        err.dichVu = dv;
                    }
                    if (!err.action) err = fail(err.message || String(err), err.status || 0, opts);
                    baoLoi(err);
                    reject(err);
                })
                .finally(function () {
                    clearTimeout(timer);
                    if (!opts.silent) busy(false);
                });
        });
    };

    /**
     * Gửi THÂN JSON nguyên văn — dùng cho các API nhận JSON của bản gốc
     * (`contentType2: 'application/json', data: JSON.stringify(obj)`), vd
     * SYS_Report/ThemMoi, SYS_Report/AllTable_Element, SYS_Import/SImport.
     * Bản gốc gán tham số hệ thống lên một CHUỖI nên không có tác dụng — ở
     * đây cũng không chèn gì, không mã hoá. Trả { data, pager, message, raw }.
     *     ums.api.json('SYS_Report/ThemMoi', { arrTuKhoa: [...], … })
     */
    api.json = function (action, body, opts) {
        var S = ums.session;
        opts = opts || {};
        if (ums.state && ums.state.mode === 'demo') {
            return fromFixture({ action: action, json: body });
        }
        return new Promise(function (resolve, reject) {
            if (!S || !S.ready) return reject(fail('Phiên chưa sẵn sàng', 0, { action: action }));
            var url;
            try { url = buildUrl(action); } catch (e) { return reject(fail(e.message, 0, { action: action })); }
            var headers = { 'Content-Type': 'application/json' };
            if (S.tokenJWT) headers['Authorization'] = 'Bearer ' + S.tokenJWT;
            if (!opts.silent) busy(true);
            fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body), cache: 'no-store' })
                .then(function (res) {
                    if (res.status === 401) { var e = fail('Phiên đăng nhập đã hết hạn.', 401, { action: action }); e.expired = true; throw e; }
                    if (!res.ok) throw fail('Máy chủ trả mã ' + res.status, res.status, { action: action });
                    return res.json();
                })
                .then(function (json) {
                    if (json && json.Success === false) throw fail(json.Message || 'Máy chủ báo lỗi', 200, { action: action });
                    resolve({ data: json ? json.Data : null, pager: json ? json.Pager : 0, message: json ? json.Message : '', raw: json });
                })
                .catch(function (err) {
                    if (!err.action) err = fail(err.message || String(err), err.status || 0, { action: action });
                    baoLoi(err);
                    reject(err);
                })
                .finally(function () { if (!opts.silent) busy(false); });
        });
    };

    /** Gọi nhiều lời gọi song song, trả mảng kết quả theo đúng thứ tự */
    api.all = function (list) {
        return Promise.all(list.map(function (o) { return api.call(o); }));
    };

    /**
     * Danh mục dùng chung — thay edu.system.loadToCombo_DanhMucDuLieu
     * (Core/systemroot.js:5193). Trả Promise<mảng { ID, TEN, MA, … }>.
     *     ums.api.dm('TAICHINH.MAUIN').then(rows => …)
     * Kết quả được nhớ trong phiên — danh mục ít khi đổi giữa hai lần mở.
     */
    var dmCache = {};
    api.dm = function (code, sortBy) {
        var key = code + '|' + (sortBy || '');
        if (!dmCache[key]) {
            dmCache[key] = api.call({
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
                method: 'GET',
                silent: true,
                strMaBangDanhMuc: code,
                strTieuChiSapXep: sortBy || '',
                dTrangThai: 1
            }).then(function (r) { return r.data || []; },
                function (e) { delete dmCache[key]; throw e; });
        }
        return dmCache[key];
    };

    /* ---------- Tiện ích ------------------------------------------------- */
    /* Rút vài chữ có nghĩa từ thân trả về khi máy chủ báo lỗi: ưu tiên
       Message/ExceptionMessage của API, không có thì bóc thẻ HTML của trang
       lỗi IIS rồi cắt ngắn. */
    function lyDo(txt) {
        if (!txt) return '';
        var m = '';
        try {
            var j = JSON.parse(txt);
            m = j.Message || j.message || j.ExceptionMessage || j.error_description || j.error || '';
        } catch (e) {
            m = String(txt).replace(/<[^>]*>/g, ' ').replace(/s+/g, ' ').trim();
        }
        m = String(m).trim();
        if (!m) return '';
        if (m.length > 140) m = m.slice(0, 140) + '…';
        return ' — ' + m;
    }

    /* Móc báo lời gọi hỏng cho vỏ (api.onLoi). Phần tự ghi lỗi máy chủ lên khung "Ghi chú chuyển đổi" đã BỎ 2026-09-30 (lỗi đã kiểm thì viết thẳng
       vào can-quyet.js) — hiện không ai gắn onLoi; giữ móc cho việc theo dõi sau này. Không bao giờ ném lỗi. */
    function baoLoi(err) { try { if (api.onLoi) api.onLoi(err); } catch (x) { /* ghi sổ hỏng thì thôi, không chặn màn */ } }

    /* Câu KIỂM DỮ LIỆU của thủ tục (RAISE_APPLICATION_ERROR, dải ORA-20000 … ORA-20999) không phải lỗi hệ thống: chỉ hiện đúng câu
       người viết thủ tục đặt, bỏ tiền tố "ORA-20001:" và đuôi vết gọi "ORA-06512: at …" (người dùng 2026-09-30). Câu gốc giữ ở err.goc. */
    function cauKiem(msg) {
        var m = /ORA-20\d{3}:\s*([\s\S]*?)(?=\s*ORA-\d{5}|$)/.exec(String(msg || ''));
        return m && m[1].trim() ? m[1].trim() : '';
    }

    function fail(msg, status, opts) {
        var goc = msg, gon = cauKiem(msg);
        if (gon) msg = gon;
        var e = new Error(msg);
        if (gon) { e.goc = goc; e.kiemDuLieu = true; }
        e.status = status || 0;
        e.action = opts ? opts.action : '';
        e.func = opts ? opts.func : '';
        e.payload = opts || null;
        return e;
    }

    /* Mã hoá giống hệt $.param của jQuery: null/undefined thành chuỗi rỗng,
       khoảng trắng thành "+". Dữ liệu gửi đi đều phẳng nên không cần xử lý
       mảng lồng. */
    function toQuery(o) {
        if (global.jQuery && jQuery.param) return jQuery.param(o);
        return Object.keys(o).map(function (k) {
            var v = o[k] === null || o[k] === undefined ? '' : o[k];
            return encodeURIComponent(k) + '=' + encodeURIComponent(v);
        }).join('&').replace(/%20/g, '+');
    }

    /* ---------- Chế độ dữ liệu dựng thử ---------------------------------- */
    function fromFixture(opts) {
        var fx = (ums.demo && ums.demo.fixtures) || {};
        var keys = [opts.func, opts.action + '#' + (opts.strMaBangDanhMuc || ''), opts.action];
        var hit;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] && fx.hasOwnProperty(keys[i])) { hit = fx[keys[i]]; break; }
        }
        if (typeof hit === 'function') hit = hit(opts);
        if (hit === undefined) {
            console.info('[ums.api demo] chưa có dữ liệu mẫu cho', opts.func || opts.action);
            hit = [];
        }
        // Dữ liệu mẫu có thể là mảng, hoặc { rows, pager, message } khi cần mô phỏng kỹ hơn
        var rows = Array.isArray(hit) ? hit : (hit && hit.rows !== undefined ? hit.rows : hit);
        var pager = hit && hit.pager !== undefined ? hit.pager : (Array.isArray(rows) ? rows.length : 0);
        return new Promise(function (resolve) {
            setTimeout(function () {
                // { rows, raw: { Id: … } } — trường thêm ngoài Data mà máy chủ thật trả
                var raw = { Success: true, Data: rows, Pager: pager, Message: (hit && hit.message) || '' };
                if (hit && hit.raw) Object.keys(hit.raw).forEach(function (k) { raw[k] = hit.raw[k]; });
                resolve({ data: rows, pager: pager, message: raw.Message, raw: raw });
            }, 120);
        });
    }

    /**
     * Xử lý lỗi chung cho màn hình: hết phiên thì đăng xuất, còn lại thì
     * hiện thông báo và ghi log.
     */
    /* Thông báo lỗi phải TỰ KHAI nó gãy ở đâu: chỉ "Máy chủ trả mã 400" thì
       nhìn ảnh chụp trên máy chủ không biết màn nào, lời gọi nào. Thêm việc
       đang làm (`where` do màn truyền) vào tiêu đề, và tên controller / tên
       procedure vào phần chữ. Chi tiết đầy đủ vẫn nằm ở console. */
    /* Một dịch vụ chết thì MỌI lời gọi tới nó cùng gãy (màn mở ra nạp 5–7 ô chọn → 5–7 thông báo
       giống nhau che kín góc màn). Lỗi KẾT NỐI (err.mang) chỉ hiện MỘT thông báo cho mỗi dịch vụ
       trong 20 giây; các lỗi sau chỉ ghi console. Lỗi khác (máy chủ trả lỗi) vẫn hiện từng cái. */
    var daBaoMang = {};
    api.handle = function (err, where) {
        console.error('[ums.api]' + (where ? ' ' + where : ''), err.action || '', err.func || '', err);

        if (err.expired) {
            alert(err.message);
            return ums.session.logout();
        }
        if (ums.ui && ums.ui.toast) {
            if (err.mang) {
                var bayGio = Date.now();
                if (daBaoMang[err.dichVu] && bayGio - daBaoMang[err.dichVu] < 20000) return null;
                daBaoMang[err.dichVu] = bayGio;
                ums.ui.toast(err.message + '. Các ô / danh sách lấy từ dịch vụ này sẽ để trống.', 'bad',
                    { title: 'Mất kết nối dịch vụ ' + err.dichVu });
                return null;
            }
            var nguon = err.func || String(err.action || '').split('/')[0];
            // `where` là việc đang làm ("nạp đơn vị") hoặc chỉ tên dữ liệu ("đơn vị") → "Lỗi: …" đọc được cả hai
            ums.ui.toast(err.message + (nguon ? ' · ' + nguon : ''), 'bad',
                where ? { title: 'Lỗi: ' + where } : undefined);
        }
        return null;
    };

    ums.api = api;

    /* =====================================================================
       Tiện ích dùng chung cho mọi màn — ums.util
       ---------------------------------------------------------------------
       xorB64 = edu.system.atob (Core/systemroot.js:9409): XOR từng ký tự với
       khoá rồi base64. Mọi lời GHI kiểu { strVal: xorB64(JSON, "chaolong") }
       (Đăng ký học, tra cứu phiếu thu…) cần hàm này; khoá bỏ trống thì lấy
       "<năm><tháng>" như bản gốc. unXor chỉ dùng cho dữ liệu mẫu trên máy —
       máy chủ tự giải. uuid = edu.util.uuid (Core/util.js:1676), 32 ký tự hex.
       ===================================================================== */
    var util = ums.util = ums.util || {};
    util.xorB64 = function (chuoi, khoa) {
        if (!khoa) { var t = new Date(Date.now()); khoa = '' + t.getFullYear() + (t.getMonth() + 1); }
        var key = Array.from(khoa), out = [];
        for (var i = 0; i < chuoi.length; i++) out.push(String.fromCharCode(chuoi.charCodeAt(i) ^ key[i % key.length].charCodeAt(0)));
        return window.btoa(out.join(''));
    };
    util.unXor = function (b64, khoa) {
        var s = window.atob(b64), key = Array.from(khoa), out = [];
        for (var i = 0; i < s.length; i++) out.push(String.fromCharCode(s.charCodeAt(i) ^ key[i % key.length].charCodeAt(0)));
        return out.join('');
    };
    /* NGÀY SINH ba ô Ngày / Tháng / Năm (+ mức độ chính xác) — KIỂM TRƯỚC KHI GỬI (người dùng 2026-09-30; bản gốc ghép thẳng
       "ngày/tháng/năm", ô trống thành "//" và máy chủ trả ORA-20001).
         ums.util.ngaySinh(ngay, thang, nam, maMuc) → { loi, chuoi, ngay, thang, nam }
           maMuc  'EXACT' | 'MONTH_ONLY' | 'YEAR_ONLY' | 'UNKNOWN' | '' (không rõ mức: suy theo ô nào có giá trị)
           loi    '' nếu hợp lệ, không thì câu báo cho người nhập
           chuoi  'dd/mm/yyyy' khi đủ ngày-tháng-năm; các trường hợp khác là '' (KHÔNG gửi "//2000")
           ngay / thang / nam  số đã chuẩn hoá; phần không thuộc mức độ đang chọn trả '' (ô đang ẩn không gửi giá trị cũ)
       Không nhập gì cả là hợp lệ (ngày sinh không bắt buộc). */
    util.ngaySinh = function (ngay, thang, nam, maMuc) {
        function so(v) { v = String(v === null || v === undefined ? '' : v).trim(); return v; }
        var d = so(ngay), m = so(thang), y = so(nam), muc = String(maMuc || '').trim().toUpperCase();
        var can = { EXACT: [1, 1, 1], MONTH_ONLY: [0, 1, 1], YEAR_ONLY: [0, 0, 1], UNKNOWN: [0, 0, 0] }[muc];
        if (!can) can = [d ? 1 : 0, (d || m) ? 1 : 0, (d || m || y) ? 1 : 0];      // không rõ mức: có ngày thì phải đủ tháng + năm…
        if (!can[0]) d = ''; if (!can[1]) m = ''; if (!can[2]) y = '';
        var kq = { loi: '', chuoi: '', ngay: '', thang: '', nam: '' };
        if (!d && !m && !y) return kq;
        var ten = ['Ngày sinh', 'Tháng sinh', 'Năm sinh'], gt = [d, m, y], thieu = [];
        can.forEach(function (c, i) { if (c && !gt[i]) thieu.push(ten[i]); });
        if (thieu.length) { kq.loi = 'Chưa nhập ' + thieu.join(', ') + ' (nhập đủ hoặc để trống cả ngày sinh)'; return kq; }
        for (var i = 0; i < 3; i++) if (gt[i] && !/^\d{1,4}$/.test(gt[i])) { kq.loi = ten[i] + ' phải là số'; return kq; }
        var D = d ? parseInt(d, 10) : 0, M = m ? parseInt(m, 10) : 0, Y = y ? parseInt(y, 10) : 0, nay = new Date().getFullYear();
        if (y && (y.length !== 4 || Y < 1900 || Y > nay)) { kq.loi = 'Năm sinh phải gồm 4 chữ số, từ 1900 đến ' + nay; return kq; }
        if (m && (M < 1 || M > 12)) { kq.loi = 'Tháng sinh phải từ 1 đến 12'; return kq; }
        if (d) {
            var soNgay = new Date(Y, M, 0).getDate();
            if (D < 1) { kq.loi = 'Ngày sinh phải từ 1 đến ' + soNgay; return kq; }
            if (D > soNgay) { kq.loi = 'Ngày sinh không có thật: tháng ' + M + '/' + Y + ' chỉ có ' + soNgay + ' ngày'; return kq; }
            if (new Date(Y, M - 1, D) > new Date()) { kq.loi = 'Ngày sinh không được sau hôm nay'; return kq; }
        }
        kq.ngay = d ? D : ''; kq.thang = m ? M : ''; kq.nam = y ? Y : '';
        if (d) kq.chuoi = (D < 10 ? '0' : '') + D + '/' + (M < 10 ? '0' : '') + M + '/' + Y;
        return kq;
    };

    util.uuid = function () {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

})(window);
