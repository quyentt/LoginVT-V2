/*----------------------------------------------
--Form tiến trình dùng chung: edu.process
--Mọi chức năng cần chạy hàng loạt (xếp loại theo lớp, tính điểm, đẩy dữ liệu...) chỉ việc "gửi vào" form này:
--  danh sách bản ghi đã nạp (Bước 1) + cách xử lý 1 bản ghi. Form lo toàn bộ phần còn lại:
--  hiện từng bản ghi (STT | Thông tin xử lý | Thời gian bắt đầu | Thời gian kết thúc | Kết quả | Ghi chú),
--  tiến độ thật, tổng hợp thành công/lỗi, Dừng / Chạy tiếp / Chạy lại bản ghi lỗi,
--  xuất Excel danh sách lỗi - thành công - tất cả (qua edu.exporter, cùng style mọi chức năng).
--
--Dùng:
--  edu.process.open({
--      title: "Thực hiện xếp loại rèn luyện",
--      subTitles: ["Năm học: 2025"],                     // điều kiện: hiện trên form và ghi vào file xuất
--      items: [{ ID: "...", TEN: "Lớp A" }, ...],        // Bước 1: danh sách bản ghi do chức năng nạp sẵn
--      unit: "lớp quản lý",                              // đơn vị gọi tên bản ghi (mặc định "bản ghi")
--      infoHeader: "Lớp quản lý",                        // tiêu đề cột "Thông tin xử lý"
--      info: function (it, i) { return it.TEN; },        // chữ hiển thị của 1 bản ghi (hoặc columns:[{header, field|render}] nếu nhiều cột)
--      request: function (it, i) {                       // gọi API cho 1 bản ghi: trả về tham số của edu.system.makeRequest
--          return { action: "RL_XuLy/...", data: { strDaoTao_LopQuanLy_Id: it.ID } };
--      },                                                //   Success=true là thành công, Message là ghi chú; lỗi mạng/HTTP tự thành "không thành công"
--      // hoặc run: function (it, i, done) {...}         // xử lý tùy ý: trả về Promise | {ok, message} | boolean, hoặc gọi done({ok, message})
--      fileName: "KetQuaXepLoai",                        // tên file xuất
--      notes: ["Chưa chọn năm học"],                     // lưu ý hiện ở khung Bước 1
--      okMessage: "Đã đưa vào hàng đợi",                 // (tùy chọn) ghi chú khi thành công mà máy chủ không trả Message; có thể là hàm (it, i)
--      concurrency: 1,                                   // số bản ghi chạy cùng lúc (mặc định 1, tối đa 10)
--      stopOnError: false, autoStart: false,
--      (bấm là hiện NGAY thẻ "Đã nhận lệnh" rồi mới chuẩn bị: nạp danh sách -> dựng bảng -> mở form)
--      onFinish: function (sum) {}, onClose: function (sum) {}   // sum = { total, ok, err, pending, elapsedMs }
--  });
--  edu.process.callApi(paramsCuaMakeRequest) -> Promise<{ ok, message, data }>   // dùng trong run: khi cần gọi nhiều API cho 1 bản ghi
----------------------------------------------*/
var processrunApi = (function (root) {
    var MAX_CONCURRENCY = 10;//khớp iGioiHanLuong của edu.system

    /*------------------------------------------
    --Discription: [1] Tiện ích
    -------------------------------------------*/
    function pad2(n) { return (n < 10 ? "0" : "") + n; }
    function fmtTime(d) { return d ? pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds()) : ""; }
    function fmtDateTime(d) {
        return d ? pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear() + " " + fmtTime(d) : "";
    }
    function fmtElapsed(ms) {
        var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
        return (h > 0 ? h + ":" + pad2(m) : pad2(m)) + ":" + pad2(s % 60);
    }
    function fmtInt(n) { return Number(n).toLocaleString("vi-VN"); }
    function esc(s) {
        return String(s)
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function toText(v) {
        if (v === null || v === undefined) return "";
        var s = String(v);
        return (s === "null" || s === "undefined") ? "" : s;
    }
    function warn(msg) {
        var edu = root.edu;
        if (edu && edu.system && typeof edu.system.alert === "function") edu.system.alert(msg, "w");
        else if (root.console) root.console.log(msg);
    }

    /*------------------------------------------
    --Discription: [2] Gọi API theo 1 kiểu duy nhất cho mọi chức năng:
    -- thành công/không thành công + nội dung thông báo luôn có, không để lỗi trôi mất
    -------------------------------------------*/
    function callApi(params) {
        return new Promise(function (resolve) {
            var edu = root.edu;
            if (!edu || !edu.system || typeof edu.system.makeRequest !== "function") {
                resolve({ ok: false, message: "Chưa sẵn sàng gọi máy chủ (thiếu edu.system.makeRequest)." });
                return;
            }
            var p = {}, k;
            for (k in params) p[k] = params[k];
            if (!p.type) p.type = "POST";
            if (p.contentType === undefined) p.contentType = true;
            if (!p.fakedb) p.fakedb = [];
            p.success = function (data) {
                var ok = !!(data && data.Success);
                var msg = (data && data.Message !== undefined && data.Message !== null) ? String(data.Message) : "";
                resolve({ ok: ok, message: ok ? msg : (msg || "Máy chủ không trả về nội dung thông báo."), data: data });
            };
            p.error = function (er) {
                var m = "Không kết nối được máy chủ.";
                if (er && er.statusText === "timeout") m = "Quá thời gian chờ phản hồi từ máy chủ.";
                else if (er && er.status) {
                    m = "Lỗi " + er.status + (er.statusText ? " - " + er.statusText : "");
                    if (er.responseJSON && er.responseJSON.Message) m += ": " + er.responseJSON.Message;
                }
                resolve({ ok: false, message: m });
            };
            try {
                edu.system.makeRequest(p, false, false, false, null);
                // makeRequest tự bật overlay "Đang tải dữ liệu" — ẩn đi, đã có form tiến trình
                if (root.$) root.$("#overlay").hide();
            } catch (ex) {
                resolve({ ok: false, message: "Không gửi được yêu cầu: " + (ex && ex.message ? ex.message : ex) });
            }
        });
    }

    // Mọi kiểu trả về của run/request quy về { ok, message }
    function normalize(r) {
        if (r === true) return { ok: true, message: "" };
        if (r === false) return { ok: false, message: "" };
        if (r && typeof r === "object") {
            var m = r.message !== undefined ? r.message : r.Message;
            return { ok: r.ok !== undefined ? !!r.ok : !!r.Success, message: toText(m) };
        }
        return { ok: true, message: "" };
    }

    // Xử lý 1 bản ghi -> Promise<{ ok, message }>; không bao giờ ném lỗi ra ngoài
    function execute(cfg, item, i) {
        return new Promise(function (resolve) {
            var settled = false;
            function fin(r) {
                if (settled) return;
                settled = true;
                r = normalize(r);
                // máy chủ không trả nội dung khi thành công: dùng ghi chú chức năng khai báo (VD "Đã đưa vào hàng đợi")
                if (r.ok && !r.message && cfg.okMessage) {
                    try { r.message = toText(typeof cfg.okMessage === "function" ? cfg.okMessage(item, i) : cfg.okMessage); } catch (ex) { }
                }
                resolve(r);
            }
            try {
                if (typeof cfg.request === "function") {
                    callApi(cfg.request(item, i)).then(fin);
                }
                else if (typeof cfg.run === "function") {
                    var r = cfg.run(item, i, fin);
                    if (r && typeof r.then === "function") r.then(fin, function (e) { fin({ ok: false, message: (e && e.message) || String(e) }); });
                    // run không khai báo tham số done mà trả về ngay thì coi như xong
                    else if (r !== undefined || cfg.run.length < 3) fin(r);
                }
                else fin({ ok: false, message: "Chức năng chưa khai báo request hoặc run." });
            } catch (ex) {
                fin({ ok: false, message: ex && ex.message ? ex.message : String(ex) });
            }
        });
    }

    /*------------------------------------------
    --Discription: [3] Giao diện — dùng chung bảng màu với hộp thoại xuất Excel
    -------------------------------------------*/
    var PR_CSS = '#modalEduProcess .modal-dialog{width:1160px !important;max-width:96% !important}'
        + '#modalEduProcess .modal-body{padding:18px 22px !important}'
        + '#modalEduProcess .pr-cond{margin-bottom:14px;padding:9px 16px;border-left:4px solid #223771;border-radius:6px;background:#f1f5fb}'
        + '#modalEduProcess .pr-cap{font-size:12px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:#64748b}'
        + '#modalEduProcess .pr-line{margin-top:3px;line-height:1.55;color:#0f172a}'
        + '#modalEduProcess .pr-bar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:12px}'
        + '#modalEduProcess .pr-btns .btn{min-width:112px;font-weight:700}'
        + '#modalEduProcess .pr-btns .btn + .btn{margin-left:10px}'
        + '#modalEduProcess .btn i{margin-right:7px}'
        + '#modalEduProcess .pr-stats{display:flex;flex-wrap:wrap;gap:8px}'
        + '#modalEduProcess .pr-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 13px;border-radius:16px;background:#eef2f7;font-size:13px;font-weight:600;color:#334155}'
        + '#modalEduProcess .pr-pill b{font-size:15px}'
        + '#modalEduProcess .pr-pill.ok{background:#ecfdf3;color:#067647}'
        + '#modalEduProcess .pr-pill.err{background:#fef3f2;color:#b42318}'
        + '#modalEduProcess .pr-pill.run{background:#eff4ff;color:#223771}'
        + '#modalEduProcess .pr-prog{position:relative;height:24px;margin:0 0 12px;overflow:hidden;border-radius:12px;background:#e2e8f0;box-shadow:none}'
        + '#modalEduProcess .pr-prog .progress-bar{height:100%;background-color:#93b4ff;box-shadow:none;transition:width .3s}'
        + '#modalEduProcess .pr-prog.s-ok .progress-bar{background-color:#6ee7a0}'
        + '#modalEduProcess .pr-prog.s-warn .progress-bar{background-color:#fcd34d}'
        + '#modalEduProcess .pr-prog.s-err .progress-bar{background-color:#fca5a5}'
        + '#modalEduProcess .pr-ptext{position:absolute;top:0;right:0;left:0;font-size:12px;font-weight:700;line-height:24px;text-align:center;color:#0f172a}'
        + '#modalEduProcess .pr-banner{margin:0 0 12px;padding:11px 16px;border:1px solid;border-radius:8px;font-weight:600;line-height:1.5}'
        + '#modalEduProcess .pr-banner.ok{border-color:#abefc6;background:#ecfdf3;color:#067647}'
        + '#modalEduProcess .pr-banner.warn{border-color:#fedf89;background:#fffaeb;color:#b54708}'
        + '#modalEduProcess .pr-banner.err{border-color:#fecdca;background:#fef3f2;color:#b42318}'
        + '#modalEduProcess .pr-banner.info{border-color:#c7d7fe;background:#eff4ff;color:#223771}'
        + '#modalEduProcess .pr-banner .pr-note{margin-top:4px;font-weight:500}'
        + '#modalEduProcess .pr-tabs{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:12px 0 8px}'
        + '#modalEduProcess .pr-tab{padding:4px 14px;border:1px solid #cbd5e1;border-radius:16px;background:#fff;font-size:13px;font-weight:600;color:#334155;cursor:pointer}'
        + '#modalEduProcess .pr-tab.on{border-color:#223771;background:#223771;color:#fff}'
        + '#modalEduProcess .pr-auto{display:flex;align-items:center;gap:6px;margin:0 0 0 auto;font-weight:500;color:#64748b;cursor:pointer}'
        + '#modalEduProcess .pr-auto input{margin:0}'
        + '#modalEduProcess .pr-box{position:relative;max-height:46vh;min-height:140px;overflow:auto;border:1px solid #cbd5e1;border-radius:6px;background:#fff}'
        + '#modalEduProcess .pr-in{min-width:900px}'
        + '#modalEduProcess .pr-head,#modalEduProcess .pr-r{display:grid;grid-template-columns:var(--cols)}'
        + '#modalEduProcess .pr-head{position:sticky;top:0;z-index:2;background:#1f3864;color:#fff;font-weight:700}'
        + '#modalEduProcess .pr-head>div{display:flex;align-items:center;justify-content:center;padding:9px 8px;border-right:1px solid #35508a;text-align:center}'
        + '#modalEduProcess .pr-vp{position:relative}'
        + '#modalEduProcess .pr-r{position:absolute;left:0;right:0;height:48px;border-bottom:1px solid #e2e8f0;contain:layout paint}'
        + '#modalEduProcess .pr-r>div{display:flex;align-items:center;min-width:0;padding:0 10px;border-right:1px solid #eef2f7;color:#0f172a}'
        + '#modalEduProcess .pr-r>div.c{justify-content:center;text-align:center}'
        + '#modalEduProcess .pr-r .tx{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;word-break:break-word;line-height:1.35}'
        + '#modalEduProcess .pr-r.pr-s-ok{background:#f6fef9}'
        + '#modalEduProcess .pr-r.pr-s-err{background:#fff5f5}'
        + '#modalEduProcess .pr-r.pr-s-run{background:#eff4ff}'
        + '#modalEduProcess .pr-empty{padding:24px;text-align:center;color:#94a3b8}'
        + '#modalEduProcess .pr-s-ok .pr-st{font-weight:700;color:#067647}'
        + '#modalEduProcess .pr-s-err .pr-st{font-weight:700;color:#b42318}'
        + '#modalEduProcess .pr-s-err .pr-nt{color:#b42318}'
        + '#modalEduProcess .pr-s-run .pr-st{font-weight:700;color:#223771}'
        + '#modalEduProcess .pr-s-pend .pr-st{color:#94a3b8}'
        + '#modalEduProcess .pr-st i{margin-right:5px}'
        + '#modalEduProcess .pr-msg{display:none;margin-top:8px;font-weight:600;color:#b42318}'
        + '#modalEduProcess .modal-footer{display:flex;align-items:center;justify-content:flex-end}'
        + '#modalEduProcess .pr-exp{display:flex;gap:10px;margin-right:auto}'
        + '#modalEduProcess .modal-footer .btn i{margin-right:7px}';

    function cls(s) { return s === "ok" ? "pr-s-ok" : s === "err" ? "pr-s-err" : s === "run" ? "pr-s-run" : "pr-s-pend"; }
    function statusHtml(s) {
        if (s === "ok") return '<i class="fa fa-check-circle"></i>Thành công';
        if (s === "err") return '<i class="fa fa-times-circle"></i>Không thành công';
        if (s === "run") return '<i class="fa fa-spinner fa-spin"></i>Đang chạy…';
        return "Chưa chạy";
    }

    /*------------------------------------------
    --Discription: [4] Thẻ "Đã nhận lệnh" + mở form tiến trình
    -- Bấm nút là hệ thống phản hồi NGAY (thẻ "Đã nhận lệnh... đang lên phương án") rồi mới làm phần nặng
    -- (nạp danh sách, dựng bảng, mở form) theo từng bước có hiển thị — không để màn hình đứng im.
    -------------------------------------------*/
    var ACK_CSS = '#eduAck{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.5);animation:eaFade .15s ease-out}'
        + '#eduAck.ea-leave{opacity:0;transition:opacity .22s}'
        + '#eduAck .ea-card{display:flex;align-items:flex-start;gap:18px;width:480px;max-width:92vw;padding:22px 26px;border-radius:14px;background:#fff;box-shadow:0 18px 50px rgba(15,23,42,.35)}'
        + '#eduAck .ea-ring{flex:0 0 46px;width:46px;height:46px;border:4px solid #dbe4ff;border-top-color:#223771;border-radius:50%;animation:eaSpin .85s linear infinite}'
        + '#eduAck .ea-body{flex:1 1 auto;min-width:0}'
        + '#eduAck .ea-head{font-size:19px;font-weight:700;color:#1f3864}'
        + '#eduAck .ea-title{margin-top:2px;font-weight:600;color:#0f172a;word-break:break-word}'
        + '#eduAck .ea-steps{margin-top:12px;line-height:1.95;color:#334155}'
        + '#eduAck .ea-step i{display:inline-block;width:22px}'
        + '#eduAck .ea-step.ea-done{color:#067647}'
        + '#eduAck .ea-step.ea-now{color:#223771;font-weight:600}'
        + '@keyframes eaSpin{to{transform:rotate(360deg)}}'
        + '@keyframes eaFade{from{opacity:0}to{opacity:1}}';
    var IP_CSS = '.eduip{margin:10px 0;clear:both}'
        + '.eduip .ip-card{border:1px solid #dbe4f3;border-radius:8px;background:#f8fbff;padding:14px 16px}'
        + '.eduip .ip-head{display:flex;align-items:center;gap:10px;font-weight:700;color:#1e40af;font-size:14px}'
        + '.eduip .ip-hint{margin-top:8px;font-size:12.5px;color:#64748b}'
        + '.eduip .ip-note{margin-top:6px;font-size:12.5px;color:#b45309}'
        + '.eduip .ip-bar{height:18px;margin-top:10px;border-radius:9px;background:#e8eefb;overflow:hidden}'
        + '.eduip .ip-bar>i{display:block;height:100%;width:100%;background:#2563eb}'
        + '.eduip .ip-bar.run>i{background-image:linear-gradient(45deg,rgba(255,255,255,.28) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.28) 50%,rgba(255,255,255,.28) 75%,transparent 75%);background-size:28px 28px;animation:ipMove 1s linear infinite}'
        + '.eduip .ip-bar.ok>i{background:#12b76a}.eduip .ip-bar.warn>i{background:#f79009}.eduip .ip-bar.err>i{background:#f04438}'
        + '@keyframes ipMove{to{background-position:28px 0}}'
        + '.eduip .ip-msg{margin-top:12px;padding:10px 14px;border-radius:6px;font-size:13.5px}'
        + '.eduip .ip-msg.ok{background:#ecfdf3;border:1px solid #a6f4c5;color:#067647}'
        + '.eduip .ip-msg.warn{background:#fffaeb;border:1px solid #fedf89;color:#93370d}'
        + '.eduip .ip-msg.err{background:#fef3f2;border:1px solid #fecdca;color:#b42318}'
        + '.eduip .ip-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}'
        + '.eduip .ip-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 13px;border-radius:16px;background:#eef2f7;font-size:13px;font-weight:600;color:#334155}'
        + '.eduip .ip-pill b{font-size:15px}.eduip .ip-pill.ok{background:#ecfdf3;color:#067647}.eduip .ip-pill.err{background:#fef3f2;color:#b42318}'
        + '.eduip .ip-bar2{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin:12px 0 8px}'
        + '.eduip .ip-tabs{display:flex;flex-wrap:wrap;gap:8px}'
        + '.eduip .ip-tab{padding:4px 14px;border:1px solid #cbd5e1;border-radius:16px;background:#fff;font-size:13px;font-weight:600;color:#334155;cursor:pointer}'
        + '.eduip .ip-tab.on{border-color:#223771;background:#223771;color:#fff}'
        + '.eduip .ip-btns .btn{font-weight:700;margin-left:8px}'
        + '.eduip .ip-box{max-height:44vh;overflow:auto;border:1px solid #cbd5e1;border-radius:6px;background:#fff}'
        + '.eduip .ip-tbl{width:100%;border-collapse:collapse;font-size:13px}'
        + '.eduip .ip-tbl th{position:sticky;top:0;z-index:1;background:#1f3864;color:#fff;padding:8px 10px;text-align:center;border-right:1px solid #35508a}'
        + '.eduip .ip-tbl td{padding:6px 10px;border-bottom:1px solid #e2e8f0;border-right:1px solid #eef2f7;vertical-align:top;word-break:break-word}'
        + '.eduip .ip-tbl tr.e td{background:#fff5f5}.eduip .ip-tbl tr.o td{background:#f6fef9}'
        + '.eduip .ip-tbl .c{text-align:center;white-space:nowrap}'
        + '.eduip .ip-more{text-align:center;padding:10px}'
        + '.eduip .ip-empty{padding:22px;text-align:center;color:#94a3b8}';
    // CSS nạp 1 lần duy nhất (ngay khi tải trang, lúc DOM còn nhỏ); dùng lại ở mọi lần mở form
    function ensureCss() {
        var d = root.document;
        if (!d || !d.head || d.getElementById("eduProcessCss")) return;
        var el = d.createElement("style");
        el.id = "eduProcessCss";
        el.textContent = PR_CSS + ACK_CSS + IP_CSS;
        d.head.appendChild(el);
    }
    var ACK_PACE = 170;//mỗi bước hiện tối thiểu chừng này ms để người dùng kịp đọc
    var PREPARING = false;

    // Chờ trình duyệt thật sự vẽ xong khung hình hiện tại rồi mới chạy fn (có dự phòng khi tab bị ẩn nên không có khung hình)
    function paintThen(fn) {
        var done = false;
        function run() { if (done) return; done = true; fn(); }
        if (root.requestAnimationFrame) root.requestAnimationFrame(function () { root.requestAnimationFrame(function () { setTimeout(run, 0); }); });
        setTimeout(run, 250);
    }
    // Thẻ "Đã nhận lệnh": next(textXongBuocTruoc, textBuocMoi) đánh dấu xong bước hiện tại và mở bước mới; close() ẩn thẻ
    function showAck(title) {
        ensureCss();
        var old = root.document.getElementById("eduAck");
        if (old) old.parentNode.removeChild(old);
        var el = root.document.createElement("div");
        el.id = "eduAck";
        el.innerHTML = '<div class="ea-card"><div class="ea-ring"></div><div class="ea-body"><div class="ea-head">Đã nhận lệnh</div>'
            + '<div class="ea-title"></div><div class="ea-steps"></div></div></div>';
        el.querySelector(".ea-title").textContent = title || "";
        root.document.body.appendChild(el);
        var steps = el.querySelector(".ea-steps"), cur = null;
        return {
            next: function (doneText, nowText) {
                if (cur && doneText) { cur.className = "ea-step ea-done"; cur.innerHTML = '<i class="fa fa-check-circle"></i>' + esc(doneText); }
                if (nowText) {
                    cur = root.document.createElement("div");
                    cur.className = "ea-step ea-now";
                    cur.innerHTML = '<i class="fa fa-spinner fa-spin"></i>' + esc(nowText);
                    steps.appendChild(cur);
                }
            },
            close: function () {
                if (!el.parentNode) return;
                el.className = "ea-leave";
                setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
            }
        };
    }

    // Bước A: nạp danh sách bản ghi + chữ hiển thị của từng bản ghi
    function prepare(cfg) {
        var items = cfg.items || [], i, c;
        var p = {
            items: items, unit: cfg.unit || "bản ghi", title: cfg.title || "Tiến trình", info: [], st: [],
            conc: Math.max(1, Math.min(MAX_CONCURRENCY, parseInt(cfg.concurrency, 10) || 1)),
            cols: cfg.columns || [{
                header: cfg.infoHeader || "Thông tin xử lý",
                render: cfg.info || function (it) { return (it && typeof it === "object") ? (it.TEN || it.name || it.ID || "") : it; }
            }]
        };
        for (i = 0; i < items.length; i++) {
            var vals = [];
            for (c = 0; c < p.cols.length; c++) {
                vals.push(toText(typeof p.cols[c].render === "function" ? p.cols[c].render(items[i], i) : (p.cols[c].field ? items[i][p.cols[c].field] : "")));
            }
            p.info.push(vals);
            p.st.push({ s: "pend", start: null, end: null, msg: "" });
        }
        return p;
    }

    function open(cfg) {
        var $ = root.$;
        cfg = cfg || {};
        if (!$ || !$.fn || !$.fn.modal) { warn("Thiếu jQuery/Bootstrap để mở form tiến trình."); return null; }
        var $prev = $("#modalEduProcess");
        if ($prev.length > 0 && $prev.data("eduProcessRunning")) { $prev.modal("show"); return $prev.data("eduProcessCtl") || null; }
        if (PREPARING) return null;//đang chuẩn bị một form: bỏ qua bấm đúp
        PREPARING = true;
        $prev.remove();

        var real = null, nItems = (cfg.items || []).length, tLast = Date.now();
        // controller trả về ngay; các lệnh chỉ có tác dụng khi form đã dựng xong
        var ctl = {
            start: function () { if (real) real.ctl.start(); },
            stop: function () { if (real) real.ctl.stop(); },
            retry: function () { if (real) real.ctl.retry(); },
            close: function () { if (real) real.ctl.close(); },
            summary: function () { return real ? real.ctl.summary() : { total: nItems, ok: 0, err: 0, pending: nItems, running: 0, elapsedMs: 0 }; }
        };
        var ack = showAck(cfg.title || "Tiến trình");
        ack.next("", "Đang lên phương án thực hiện…");
        function fail(ex) {
            PREPARING = false;
            ack.close();
            if (root.console) root.console.log("[edu.process] lỗi", ex);
            warn("Không mở được form tiến trình: " + (ex && ex.message ? ex.message : ex));
        }
        // mỗi bước chờ thẻ được vẽ xong và hiện tối thiểu ACK_PACE ms rồi mới làm phần việc của bước đó
        function stage(fn) {
            var wait = Math.max(0, ACK_PACE - (Date.now() - tLast));
            paintThen(function () {
                setTimeout(function () {
                    try { fn(); } catch (ex) { fail(ex); }
                }, wait);
            });
        }
        stage(function () {
            var prep = prepare(cfg);
            ack.next("Đã nạp " + fmtInt(prep.items.length) + " " + prep.unit, "Đang dựng bảng theo dõi…");
            tLast = Date.now();
            stage(function () {
                real = build(cfg, prep);
                ack.next("Đã dựng bảng theo dõi", "Sẵn sàng — đang mở màn hình điều khiển…");
                tLast = Date.now();
                stage(function () {
                    real.show(function () { ack.close(); PREPARING = false; });
                });
            });
        });
        return ctl;
    }

    // Bước B: dựng form (chưa hiện). Trả về { ctl, show(fnShown) }
    function build(cfg, prep) {
        var $ = root.$, i, c;
        var items = prep.items, unit = prep.unit, title = prep.title, conc = prep.conc, cols = prep.cols, info = prep.info, st = prep.st;
        var cnt = { ok: 0, err: 0, run: 0, pend: items.length };
        var running = false, stopping = false, closed = false, elapsedAcc = 0, segStart = 0;
        var timers = { clock: null, render: null, sum: null, msg: null, scroll: null };

        // ---- HTML ----
        var subs = [].concat(typeof cfg.subTitles === "function" ? cfg.subTitles() : (cfg.subTitles || []));
        ensureCss();
        var h = '<div class="modal" id="modalEduProcess" tabindex="-1" role="dialog">'
            + '<div class="modal-dialog"><div class="modal-content">'
            + '<div class="modal-header"><button type="button" class="close pr-close">&times;</button>'
            + '<h4 class="modal-title"><i class="fa fa-cogs"></i> ' + esc(title) + '</h4></div>'
            + '<div class="modal-body">';
        var lines = [];
        for (i = 0; i < subs.length; i++) if (toText(subs[i]) !== "") lines.push(subs[i]);
        if (lines.length > 0) {
            h += '<div class="pr-cond"><div class="pr-cap">Điều kiện áp dụng</div>';
            for (i = 0; i < lines.length; i++) h += '<div class="pr-line">' + esc(lines[i]).replace(/(^|; )([^:;]+?):/g, "$1<b>$2:</b>") + '</div>';
            h += '</div>';
        }
        h += '<div class="pr-bar"><div class="pr-btns">'
            + '<button type="button" class="btn btn-primary pr-run"><i class="fa fa-play"></i>RUN</button>'
            + '<button type="button" class="btn btn-danger pr-stop" style="display:none"><i class="fa fa-stop"></i>Dừng</button>'
            + '<button type="button" class="btn btn-warning pr-retry" style="display:none"><i class="fa fa-repeat"></i><span></span></button>'
            + '</div><div class="pr-stats">'
            + '<span class="pr-pill">Tổng <b class="n-total">0</b></span>'
            + '<span class="pr-pill run">Đang chạy <b class="n-run">0</b></span>'
            + '<span class="pr-pill ok"><i class="fa fa-check-circle"></i>Thành công <b class="n-ok">0</b></span>'
            + '<span class="pr-pill err"><i class="fa fa-times-circle"></i>Lỗi <b class="n-err">0</b></span>'
            + '<span class="pr-pill">Còn lại <b class="n-pend">0</b></span>'
            + '<span class="pr-pill"><i class="fa fa-clock-o"></i><b class="n-time">00:00</b></span>'
            + '</div></div>'
            + '<div class="progress pr-prog"><div class="progress-bar progress-bar-striped" style="width:0%"></div><div class="pr-ptext"></div></div>'
            + '<div class="pr-banner info"></div>'
            + '<div class="pr-tabs">'
            + '<span class="pr-tab on" data-f="">Tất cả (<span class="t-all">0</span>)</span>'
            + '<span class="pr-tab" data-f="ok">Thành công (<span class="t-ok">0</span>)</span>'
            + '<span class="pr-tab" data-f="err">Lỗi (<span class="t-err">0</span>)</span>'
            + '<span class="pr-tab" data-f="pend">Chưa chạy (<span class="t-pend">0</span>)</span>'
            + '<label class="pr-auto"><input type="checkbox" class="pr-autochk" checked> Tự cuộn theo dòng đang chạy</label></div>'
            + '<div class="pr-box"><div class="pr-in" style="--cols:64px repeat(' + cols.length + ',minmax(130px,1fr)) 104px 104px 150px minmax(200px,1.4fr)">'
            + '<div class="pr-head"><div>STT</div>';
        for (c = 0; c < cols.length; c++) h += '<div>' + esc(cols[c].header || "") + '</div>';
        h += '<div>Thời gian bắt đầu</div><div>Thời gian kết thúc</div><div>Kết quả</div><div>Ghi chú</div></div><div class="pr-vp"></div></div></div>'
            + '<div class="pr-msg"></div>'
            + '</div><div class="modal-footer"><div class="pr-exp">'
            + '<button type="button" class="btn btn-warning pr-x-err"><i class="fa fa-file-excel-o"></i>Xuất lỗi</button>'
            + '<button type="button" class="btn btn-success pr-x-ok"><i class="fa fa-file-excel-o"></i>Xuất thành công</button>'
            + '<button type="button" class="btn btn-default pr-x-all"><i class="fa fa-file-excel-o"></i>Xuất tất cả</button>'
            + '</div><button type="button" class="btn btn-default pr-close"><i class="fa fa-times-circle"></i>Đóng</button>'
            + '</div></div></div></div>';

        var $m = $(h).appendTo(document.body);
        var vp = $m.find(".pr-vp")[0], head = $m.find(".pr-head")[0], $box = $m.find(".pr-box"), $banner = $m.find(".pr-banner"), $prog = $m.find(".pr-prog");
        var $run = $m.find(".pr-run"), $stop = $m.find(".pr-stop"), $retry = $m.find(".pr-retry");

        // ---- Hiển thị: CHỈ dựng các dòng đang nhìn thấy (cuộn tới đâu dựng tới đó) ----
        // Bảng hàng nghìn dòng mà đổi 1 ô là trình duyệt tính lại bố cục cả bảng (đo thực tế ~45ms mỗi bản ghi, chạy 2.684 lớp mất thêm hàng phút).
        // Dựng cửa sổ vài chục dòng thì mỗi lần cập nhật chỉ động tới đúng 1 dòng, và form mở tức thì dù 2 nghìn hay 20 nghìn bản ghi.
        // Dòng có chiều cao cố định (chữ dài cắt 2 dòng, rê chuột xem đủ); file Excel xuất ra luôn đủ chữ.
        var ROW_H = 48, BUF = 6, curFilter = "", view = null, viewDirty = false, rowEl = {}, rafScroll = null;
        function viewLen() { return view ? view.length : items.length; }
        function rowHtml(k, pos) {
            var s = st[k], r = '<div class="pr-r ' + cls(s.s) + '" data-k="' + k + '" style="top:' + (pos * ROW_H) + 'px"><div class="c">' + (k + 1) + '</div>';
            for (var a = 0; a < info[k].length; a++) r += '<div title="' + esc(info[k][a]) + '"><span class="tx">' + esc(info[k][a]) + '</span></div>';
            return r + '<div class="c">' + fmtTime(s.start) + '</div><div class="c">' + fmtTime(s.end) + '</div>'
                + '<div class="c pr-st">' + statusHtml(s.s) + '</div><div class="pr-nt" title="' + esc(s.msg) + '"><span class="tx">' + esc(s.msg) + '</span></div></div>';
        }
        function renderWindow() {
            if (closed) return;
            var n = viewLen(), box = $box[0], hh = head.offsetHeight || 38, h = box.clientHeight || 420, i;
            var first = Math.max(0, Math.floor(box.scrollTop / ROW_H) - BUF), last = Math.min(n - 1, Math.ceil((box.scrollTop + h - hh) / ROW_H) + BUF), buf = "";
            for (i = first; i <= last; i++) buf += rowHtml(view ? view[i] : i, i);
            vp.innerHTML = n === 0 ? '<div class="pr-empty">Không có bản ghi nào</div>' : buf;
            rowEl = {};
            if (n > 0) for (i = 0; i < vp.children.length; i++) rowEl[vp.children[i].getAttribute("data-k")] = vp.children[i];
        }
        // Dựng lại danh sách đang xem theo tab lọc (Tất cả / Thành công / Lỗi / Chưa chạy)
        function rebuildView() {
            var k;
            if (!curFilter) view = null;
            else {
                view = [];
                for (k = 0; k < items.length; k++) if (st[k].s === curFilter) view.push(k);
            }
            viewDirty = false;
            vp.style.height = (viewLen() === 0 ? 70 : viewLen() * ROW_H) + "px";
            renderWindow();
        }
        function setRow(k) {
            // đang lọc theo trạng thái: dòng có thể đổi tab, dựng lại danh sách lọc theo nhịp cập nhật số liệu
            if (curFilter) { viewDirty = true; scheduleRefresh(); }
            var el = rowEl[k];
            if (!el) return;// dòng đang ngoài khung nhìn — lúc cuộn tới sẽ dựng theo đúng trạng thái hiện tại
            var s = st[k], c = el.children, n = cols.length;
            el.className = "pr-r " + cls(s.s);
            c[n + 1].textContent = fmtTime(s.start);
            c[n + 2].textContent = fmtTime(s.end);
            c[n + 3].innerHTML = statusHtml(s.s);
            c[n + 4].title = s.msg;
            c[n + 4].firstChild.textContent = s.msg;
        }
        $box.on("scroll", function () {
            if (rafScroll) return;
            rafScroll = (root.requestAnimationFrame || function (f) { return setTimeout(f, 16); })(function () { rafScroll = null; renderWindow(); });
        });
        function setState(k, to) {
            cnt[st[k].s]--;
            st[k].s = to;
            cnt[to]++;
        }
        function elapsed() { return elapsedAcc + (running ? Date.now() - segStart : 0); }
        function summary() {
            return { total: items.length, ok: cnt.ok, err: cnt.err, pending: cnt.pend, running: cnt.run, elapsedMs: elapsed() };
        }
        function refreshNow() {
            if (viewDirty) rebuildView();
            var total = items.length, done = cnt.ok + cnt.err, pct = total > 0 ? Math.floor(done * 100 / total) : 0;
            $m.find(".n-total, .t-all").text(fmtInt(total));
            $m.find(".n-run").text(fmtInt(cnt.run));
            $m.find(".n-ok, .t-ok").text(fmtInt(cnt.ok));
            $m.find(".n-err, .t-err").text(fmtInt(cnt.err));
            $m.find(".n-pend, .t-pend").text(fmtInt(cnt.pend));
            $m.find(".n-time").text(fmtElapsed(elapsed()));
            $prog.find(".progress-bar").css("width", pct + "%");
            $prog.find(".pr-ptext").text(fmtInt(done) + " / " + fmtInt(total) + " (" + pct + "%)");
            $prog.find(".progress-bar").toggleClass("active", running);
            // nút
            $run.prop("disabled", running || cnt.pend === 0)
                .html(running ? '<i class="fa fa-spinner fa-spin"></i>Đang chạy…' : (done > 0 && cnt.pend > 0 ? '<i class="fa fa-play"></i>Chạy tiếp' : '<i class="fa fa-play"></i>RUN'));
            $stop.toggle(running).prop("disabled", stopping).html(stopping ? '<i class="fa fa-spinner fa-spin"></i>Đang dừng…' : '<i class="fa fa-stop"></i>Dừng');
            $retry.toggle(!running && cnt.err > 0).find("span").text("Chạy lại " + fmtInt(cnt.err) + " bản ghi lỗi");
            $m.find(".pr-x-err").prop("disabled", cnt.err === 0);
            $m.find(".pr-x-ok").prop("disabled", cnt.ok === 0);
            $m.find(".pr-x-all").prop("disabled", done === 0);
        }
        // Cập nhật số liệu tối đa ~12 lần/giây để chạy nhanh hàng nghìn bản ghi không bị chậm vì vẽ lại
        function scheduleRefresh() {
            if (timers.sum || closed) return;
            timers.sum = setTimeout(function () { timers.sum = null; if (!closed) refreshNow(); }, 80);
        }
        function showBanner(type, html) { $banner.attr("class", "pr-banner " + type).html(html).show(); }
        function showMsg(text) {
            var $x = $m.find(".pr-msg").text(text).show();
            clearTimeout(timers.msg);
            timers.msg = setTimeout(function () { $x.hide(); }, 5000);
        }
        // Cuộn theo dòng đang chạy: gom lại, tối đa 1 lần / 250ms (chỉ khi đang xem tab "Tất cả")
        var scrollTo = -1;
        function doScroll() {
            timers.scroll = null;
            if (closed || scrollTo < 0 || curFilter || !$m.find(".pr-autochk").prop("checked")) return;
            var box = $box[0], hh = head.offsetHeight || 38, top = hh + scrollTo * ROW_H, bottom = top + ROW_H;
            if (top < box.scrollTop + hh || bottom > box.scrollTop + box.clientHeight) box.scrollTop = Math.max(0, top - box.clientHeight / 2);
        }
        function autoScroll(k) {
            scrollTo = k;
            if (!timers.scroll) timers.scroll = setTimeout(doScroll, 250);
        }

        // ---- Chạy ----
        function finishRun() {
            running = false;
            elapsedAcc += Date.now() - segStart;
            clearInterval(timers.clock);
            timers.clock = null;
            if (closed) return;
            $m.data("eduProcessRunning", false);
            var total = items.length, wasStopped = stopping;
            stopping = false;
            refreshNow();
            var t = " Tổng thời gian: " + fmtElapsed(elapsed()) + ".";
            $prog.removeClass("s-ok s-warn s-err");
            if (cnt.pend > 0) {
                $prog.addClass("s-warn");
                showBanner("warn", '<i class="fa fa-pause-circle"></i> ' + (wasStopped ? "Đã dừng" : "Chưa xong") + ': đã chạy ' + fmtInt(cnt.ok + cnt.err) + ' / ' + fmtInt(total)
                    + ' ' + esc(unit) + ' (' + fmtInt(cnt.ok) + ' thành công, ' + fmtInt(cnt.err) + ' lỗi). Bấm <b>Chạy tiếp</b> để chạy ' + fmtInt(cnt.pend) + ' ' + esc(unit) + ' còn lại.' + t);
            }
            else if (cnt.err === 0) {
                $prog.addClass("s-ok");
                showBanner("ok", '<i class="fa fa-check-circle"></i> Hoàn tất: tất cả ' + fmtInt(total) + ' ' + esc(unit) + ' đều thành công.' + t);
            }
            else if (cnt.ok === 0) {
                $prog.addClass("s-err");
                showBanner("err", '<i class="fa fa-times-circle"></i> Hoàn tất: cả ' + fmtInt(total) + ' ' + esc(unit) + ' đều không thành công. Xem cột Ghi chú hoặc bấm <b>Xuất lỗi</b>.' + t);
            }
            else {
                $prog.addClass("s-warn");
                showBanner("warn", '<i class="fa fa-exclamation-triangle"></i> Hoàn tất: ' + fmtInt(cnt.ok) + ' thành công, <b>' + fmtInt(cnt.err) + ' không thành công</b>. Bấm <b>Xuất lỗi</b> để xem chi tiết hoặc <b>Chạy lại</b> các ' + esc(unit) + ' lỗi.' + t);
            }
            if (typeof cfg.onFinish === "function") { try { cfg.onFinish(summary()); } catch (ex) { } }
        }

        function startRun() {
            if (running || cnt.pend === 0 || closed) return;
            var queue = [], next = 0, inflight = 0;
            for (var k = 0; k < items.length; k++) if (st[k].s === "pend") queue.push(k);
            running = true;
            stopping = false;
            segStart = Date.now();
            $m.data("eduProcessRunning", true);
            $banner.hide();
            $prog.removeClass("s-ok s-warn s-err");
            clearInterval(timers.clock);
            timers.clock = setInterval(function () { $m.find(".n-time").text(fmtElapsed(elapsed())); }, 1000);
            refreshNow();

            function launch(k) {
                inflight++;
                setState(k, "run");
                st[k].start = new Date();
                st[k].end = null;
                st[k].msg = "";
                setRow(k);
                autoScroll(k);
                scheduleRefresh();
                execute(cfg, items[k], k).then(function (r) {
                    inflight--;
                    if (closed) return;
                    st[k].end = new Date();
                    st[k].msg = r.message;
                    setState(k, r.ok ? "ok" : "err");
                    if (!r.ok && cfg.stopOnError) stopping = true;
                    setRow(k);
                    scheduleRefresh();
                    pump();
                });
            }
            function pump() {
                while (!stopping && !closed && inflight < conc && next < queue.length) launch(queue[next++]);
                if (inflight === 0 && (stopping || closed || next >= queue.length)) finishRun();
            }
            pump();
        }
        function stopRun() {
            if (!running || stopping) return;
            stopping = true;// các bản ghi đang chạy dở được chờ cho xong, không bắt đầu bản ghi mới
            refreshNow();
        }
        function retryErrors() {
            if (running) return;
            for (var k = 0; k < items.length; k++) {
                if (st[k].s !== "err") continue;
                setState(k, "pend");
                st[k].start = null; st[k].end = null; st[k].msg = "";
                setRow(k);
            }
            startRun();
        }

        // ---- Xuất Excel (cùng bộ xuất của mọi chức năng) ----
        function exportKind(kind) {
            var edu = root.edu;
            if (!edu || !edu.exporter) { showMsg("Chưa cập nhật chức năng xuất Excel (thiếu Corei/exportexcel.js và indexi.aspx)."); return; }
            var rows = [], k;
            for (k = 0; k < items.length; k++) {
                var s = st[k];
                if (kind === "all" ? s.s === "run" : s.s !== kind) continue;
                rows.push({
                    vals: info[k], startText: fmtDateTime(s.start), endText: fmtDateTime(s.end),
                    secs: (s.start && s.end) ? Math.round((s.end - s.start) / 100) / 10 : "",
                    result: s.s === "ok" ? "Thành công" : s.s === "err" ? "Không thành công" : "Chưa chạy", note: s.msg
                });
            }
            if (rows.length === 0) { showMsg(kind === "err" ? "Không có " + unit + " lỗi nào để xuất." : kind === "ok" ? "Chưa có " + unit + " thành công nào để xuất." : "Chưa có kết quả để xuất."); return; }
            var columns = [];
            cols.forEach(function (col, idx) { columns.push({ header: col.header || "Thông tin xử lý", render: function (row) { return row.vals[idx]; } }); });
            columns.push({ header: "Thời gian bắt đầu", field: "startText", align: "center" });
            columns.push({ header: "Thời gian kết thúc", field: "endText", align: "center" });
            columns.push({ header: "Thời lượng (giây)", field: "secs", type: "number", align: "center" });
            columns.push({ header: "Kết quả", field: "result", align: "center" });
            columns.push({ header: "Ghi chú", field: "note" });
            var label = kind === "err" ? "Lỗi" : kind === "ok" ? "Thành công" : "Tất cả";
            edu.exporter.exportData({
                fileName: (cfg.fileName || "KetQuaTienTrinh") + (kind === "err" ? "_Loi" : kind === "ok" ? "_ThanhCong" : "_TatCa"),
                name: label,
                title: kind === "err" ? "DANH SÁCH BẢN GHI KHÔNG THÀNH CÔNG" : kind === "ok" ? "DANH SÁCH BẢN GHI THÀNH CÔNG" : "KẾT QUẢ THỰC HIỆN TIẾN TRÌNH",
                subTitles: ["Tiến trình: " + title].concat(lines, [
                    "Tổng hợp: " + fmtInt(items.length) + " " + unit + "; " + fmtInt(cnt.ok) + " thành công; " + fmtInt(cnt.err) + " không thành công; " + fmtInt(cnt.pend) + " chưa chạy"]),
                columns: columns,
                data: rows
            });
        }

        // ---- Sự kiện ----
        function requestClose() {
            if (running && root.confirm && !root.confirm("Tiến trình đang chạy. Đóng cửa sổ sẽ DỪNG việc xử lý các " + unit + " còn lại.\nBạn có chắc chắn muốn đóng?")) return;
            if (running) stopping = true;
            $m.modal("hide");
        }
        $m.on("click", ".pr-run", startRun);
        $m.on("click", ".pr-stop", stopRun);
        $m.on("click", ".pr-retry", retryErrors);
        $m.on("click", ".pr-close", requestClose);
        $m.on("click", ".pr-x-err", function () { exportKind("err"); });
        $m.on("click", ".pr-x-ok", function () { exportKind("ok"); });
        $m.on("click", ".pr-x-all", function () { exportKind("all"); });
        $m.on("click", ".pr-tab", function () {
            $m.find(".pr-tab").removeClass("on");
            $(this).addClass("on");
            curFilter = $(this).attr("data-f") || "";
            $box[0].scrollTop = 0;
            rebuildView();
        });
        $m.on("hidden.bs.modal", function () {
            closed = true;
            clearInterval(timers.clock);
            clearTimeout(timers.render);
            clearTimeout(timers.sum);
            clearTimeout(timers.msg);
            clearTimeout(timers.scroll);
            var sum = summary();
            $m.remove();
            if ($(".modal.in").length > 0) $("body").addClass("modal-open");//modal bên dưới (nếu có) giữ khóa cuộn trang
            if (typeof cfg.onClose === "function") { try { cfg.onClose(sum); } catch (ex) { } }
        });
        $m.on("shown.bs.modal", function () { $run.trigger("focus"); });

        // ---- Bước 1: hiển thị danh sách đã nạp, chờ bấm RUN ----
        if (items.length === 0) {
            showBanner("warn", '<i class="fa fa-info-circle"></i> Không có ' + esc(unit) + ' nào để xử lý.');
        }
        else {
            var intro = '<i class="fa fa-info-circle"></i> <b>Bước 1:</b> đã nạp <b>' + fmtInt(items.length) + '</b> ' + esc(unit)
                + '. Kiểm tra danh sách bên dưới rồi bấm <b>RUN</b> để chạy lần lượt từng ' + esc(unit) + '.';
            var notes = cfg.notes || [];
            for (i = 0; i < notes.length; i++) if (toText(notes[i]) !== "") intro += '<div class="pr-note"><i class="fa fa-exclamation-triangle"></i> ' + esc(notes[i]) + '</div>';
            showBanner("info", intro);
        }
        refreshNow();
        rebuildView();

        var ctl = { start: startRun, stop: stopRun, retry: retryErrors, close: requestClose, summary: summary };
        $m.data("eduProcessCtl", ctl);
        return {
            ctl: ctl,
            show: function (fnShown) {
                $m.one("shown.bs.modal", function () {
                    if (typeof fnShown === "function") fnShown();
                    renderWindow();//form đã hiện: đã biết kích thước thật của khung cuộn
                    if (cfg.autoStart && items.length > 0) setTimeout(startRun, 300);
                });
                $m.modal({ backdrop: "static", keyboard: false });
            }
        };
    }

    /*------------------------------------------
    --Discription: [4] Panel kết quả IMPORT EXCEL dùng chung (đặt ngay trong modal import sẵn có, KHÔNG mở modal thứ hai).
    -- Import chung gửi 1 lần lên máy chủ và chỉ trả kết quả ở cuối nên KHÔNG có % thật: lúc chạy chỉ hiện thanh chạy liên tục
    -- + đồng hồ + số dòng; xong hiện tổng hợp thành công/lỗi, bảng từng dòng (lọc Tất cả/Thành công/Lỗi) và xuất Excel.
    --   var ip = edu.process.importPanel({ container: "#zoneImportPanel", title: "Import ...", fileName: "KetQuaImport",
    --       source: function () { return mảng dòng của sheet (để xuất dòng lỗi đúng dạng file import) }, onBack: function () {} });
    --   ip.start(soDong); ip.note("Đang thử lại lần 1/2"); ip.finish([{ KEY: "12: ...", VALUE: "lỗi" | "" }, ...]); ip.fail("thông báo"); ip.reset();
    -------------------------------------------*/
    function importPanel(cfg) {
        ensureCss();
        var $ = root.$, $c = $(cfg.container), timer = null, t0 = 0, total = 0, rows = [], view = [], shown = 0, cur = "", cnt = { ok: 0, err: 0 }, PAGE = 200;
        $c.addClass("eduip");
        function srcRows() { try { return (typeof cfg.source === "function" ? cfg.source() : null) || []; } catch (ex) { return []; } }
        function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
        function clock() {
            var n = Math.floor((new Date().getTime() - t0) / 1000), m = Math.floor(n / 60), sec = n % 60;
            return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
        }
        function reset() { stopTimer(); $c.hide().empty(); }
        function start(n) {
            stopTimer();
            total = n || 0; t0 = new Date().getTime();
            $c.html('<div class="ip-card"><div class="ip-head"><i class="fa fa-spinner fa-spin"></i><span class="ip-lbl"></span></div>'
                + '<div class="ip-bar run"><i></i></div>'
                + '<div class="ip-hint">Đã nhận file. Máy chủ xử lý toàn bộ file trong một lần nên chưa có % thật — vui lòng không đóng cửa sổ này.</div>'
                + '<div class="ip-note"></div></div>').show();
            var $l = $c.find(".ip-lbl");
            function tick() { $l.text("Đang import" + (total > 0 ? " " + fmtInt(total) + " dòng" : "") + " — đã chạy " + clock()); }
            tick();
            timer = setInterval(tick, 1000);
        }
        function note(txt) { $c.find(".ip-note").html(txt ? '<i class="fa fa-rotate-right"></i> ' + esc(txt) : ""); }
        function fail(msg) {
            stopTimer();
            $c.html('<div class="ip-msg err"><i class="fa fa-triangle-exclamation"></i> ' + esc(msg) + '</div>'
                + (typeof cfg.onBack === "function" ? '<div class="ip-btns" style="margin-top:10px"><a class="btn btn-default ip-back"><i class="fa fa-arrow-left"></i> Quay lại</a></div>' : "")).show();
            $c.off("click.ipb").on("click.ipb", ".ip-back", function () { cfg.onBack(); });
        }
        function rowHtml(r, i) {
            return '<tr class="' + (r.ok ? "o" : "e") + '"><td class="c">' + (i + 1) + '</td><td class="c">' + (r.line === "" ? "" : esc(r.line)) + '</td><td>' + esc(r.text)
                + '</td><td class="c"><b style="color:' + (r.ok ? "#067647" : "#b42318") + '">' + (r.ok ? "Thành công" : "Lỗi") + '</b></td><td>' + esc(r.msg) + '</td></tr>';
        }
        function build() {
            view = cur === "ok" ? rows.filter(function (r) { return r.ok; }) : cur === "err" ? rows.filter(function (r) { return !r.ok; }) : rows;
            shown = 0;
            $c.find(".ip-body").empty();
            more();
            $c.find(".ip-box")[0].scrollTop = 0;
        }
        function more() {
            var $b = $c.find(".ip-body"), end = Math.min(view.length, shown + PAGE), h = "", i;
            $c.find(".ip-more").remove();
            for (i = shown; i < end; i++) h += rowHtml(view[i], i);
            if (view.length === 0) h = '<tr><td colspan="5" class="ip-empty">Không có dòng nào</td></tr>';
            $b.append(h);
            shown = end;
            if (shown < view.length) $c.find(".ip-box").append('<div class="ip-more"><a class="btn btn-default ip-moreb">Hiển thị thêm ' + fmtInt(Math.min(PAGE, view.length - shown)) + ' dòng (còn ' + fmtInt(view.length - shown) + ')</a></div>');
        }
        function finish(data) {
            stopTimer();
            var secs = Math.max(0, Math.round((new Date().getTime() - t0) / 1000)), src = srcRows(), i, k, line, m;
            rows = []; cnt = { ok: 0, err: 0 };
            data = data || [];
            for (i = 0; i < data.length; i++) {
                k = toText(data[i].KEY); line = ""; m = /^\s*(\d+)\s*:\s*/.exec(k);
                if (m) { line = parseInt(m[1], 10); k = k.substring(m[0].length); }
                var ok = toText(data[i].VALUE) === "";
                if (ok) cnt.ok++; else cnt.err++;
                rows.push({ ok: ok, line: line, text: k, msg: toText(data[i].VALUE), src: (line !== "" && src[line - 1]) ? src[line - 1] : null });
            }
            var all = rows.length, kind = all === 0 ? "warn" : cnt.err === 0 ? "ok" : cnt.ok === 0 ? "err" : "warn";
            var msg = all === 0 ? "Máy chủ không trả về dòng kết quả nào (file không có dữ liệu hoặc sheet trống)."
                : cnt.err === 0 ? "Import hoàn tất: cả " + fmtInt(all) + " dòng đều thành công."
                : cnt.ok === 0 ? "Import không thành công: cả " + fmtInt(all) + " dòng đều lỗi. Bấm Xuất lỗi, sửa theo cột Lỗi rồi import lại."
                : "Import hoàn tất: " + fmtInt(cnt.ok) + " dòng thành công, " + fmtInt(cnt.err) + " dòng lỗi. Bấm Xuất lỗi, sửa theo cột Lỗi rồi import lại các dòng lỗi.";
            cur = cnt.err > 0 ? "err" : "";
            $c.html('<div class="ip-card"><div class="ip-head"><i class="fa fa-flag-checkered"></i><span>' + esc(cfg.title || "Kết quả import") + '</span></div>'
                + '<div class="ip-bar ' + kind + '"><i></i></div>'
                + '<div class="ip-pills"><span class="ip-pill">Tổng <b>' + fmtInt(all) + '</b> dòng</span><span class="ip-pill ok">Thành công <b>' + fmtInt(cnt.ok) + '</b></span>'
                + '<span class="ip-pill err">Lỗi <b>' + fmtInt(cnt.err) + '</b></span><span class="ip-pill">Thời gian <b>' + clockText(secs) + '</b></span></div>'
                + '<div class="ip-msg ' + kind + '"><i class="fa ' + (kind === "ok" ? "fa-circle-check" : "fa-triangle-exclamation") + '"></i> ' + esc(msg) + '</div></div>'
                + '<div class="ip-bar2"><div class="ip-tabs"><span class="ip-tab' + (cur === "" ? " on" : "") + '" data-f="">Tất cả (' + fmtInt(all) + ')</span>'
                + '<span class="ip-tab' + (cur === "ok" ? " on" : "") + '" data-f="ok">Thành công (' + fmtInt(cnt.ok) + ')</span>'
                + '<span class="ip-tab' + (cur === "err" ? " on" : "") + '" data-f="err">Lỗi (' + fmtInt(cnt.err) + ')</span></div>'
                + '<div class="ip-btns"><a class="btn btn-warning ip-x-err"><i class="fa fa-file-excel-o"></i> Xuất lỗi</a><a class="btn btn-success ip-x-ok"><i class="fa fa-file-excel-o"></i> Xuất thành công</a>'
                + '<a class="btn btn-default ip-x-all"><i class="fa fa-file-excel-o"></i> Xuất tất cả</a>'
                + (typeof cfg.onBack === "function" ? '<a class="btn btn-default ip-back"><i class="fa fa-arrow-left"></i> Quay lại</a>' : "") + '</div></div>'
                + '<div class="ip-box"><table class="ip-tbl"><thead><tr><th style="width:60px">STT</th><th style="width:70px">Dòng</th><th>Dữ liệu</th><th style="width:110px">Kết quả</th><th>Ghi chú / Lỗi</th></tr></thead><tbody class="ip-body"></tbody></table></div>').show();
            $c.off("click.ip")
                .on("click.ip", ".ip-tab", function () { $c.find(".ip-tab").removeClass("on"); $(this).addClass("on"); cur = $(this).attr("data-f") || ""; build(); })
                .on("click.ip", ".ip-moreb", more)
                .on("click.ip", ".ip-back", function () { if (typeof cfg.onBack === "function") cfg.onBack(); })
                .on("click.ip", ".ip-x-err", function () { exportKind("err", secs); })
                .on("click.ip", ".ip-x-ok", function () { exportKind("ok", secs); })
                .on("click.ip", ".ip-x-all", function () { exportKind("all", secs); });
            build();
            note("");
        }
        function clockText(n) { var m = Math.floor(n / 60), sec = n % 60; return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec; }
        function exportKind(kind, secs) {
            var edu = root.edu, list = rows.filter(function (r) { return kind === "all" ? true : kind === "ok" ? r.ok : !r.ok; });
            if (!edu || !edu.exporter) { warn("Chưa cập nhật bộ xuất Excel (thiếu Corei/exportexcel.js)."); return; }
            if (list.length === 0) { warn(kind === "err" ? "Không có dòng lỗi nào để xuất." : kind === "ok" ? "Chưa có dòng thành công nào để xuất." : "Chưa có kết quả để xuất."); return; }
            // Có dòng gốc của sheet thì xuất đúng các cột của file import (+ cột Kết quả/Ghi chú) để sửa rồi import lại
            var keys = [], seen = {}, haveSrc = list.every(function (r) { return !!r.src; });
            if (haveSrc) list.forEach(function (r) { for (var p in r.src) if (!seen[p] && p !== "Lỗi") { seen[p] = true; keys.push(p); } });
            var columns = [{ header: "Dòng", render: function (r) { return r.line; }, align: "center" }];
            if (haveSrc) keys.forEach(function (p) { columns.push({ header: p, render: function (r) { return r.src ? toText(r.src[p]) : ""; } }); });
            else columns.push({ header: "Dữ liệu", render: function (r) { return r.text; } });
            columns.push({ header: "Kết quả", render: function (r) { return r.ok ? "Thành công" : "Lỗi"; }, align: "center" });
            columns.push({ header: kind === "err" ? "Lỗi" : "Ghi chú", render: function (r) { return r.msg; } });
            edu.exporter.exportData({
                fileName: (cfg.fileName || "KetQuaImport") + (kind === "err" ? "_Loi" : kind === "ok" ? "_ThanhCong" : "_TatCa"),
                name: kind === "err" ? "Lỗi" : kind === "ok" ? "Thành công" : "Tất cả",
                title: kind === "err" ? "DANH SÁCH DÒNG IMPORT LỖI" : kind === "ok" ? "DANH SÁCH DÒNG IMPORT THÀNH CÔNG" : "KẾT QUẢ IMPORT",
                subTitles: [].concat(cfg.title ? [cfg.title] : [], cfg.subTitles || [],
                    ["Tổng hợp: " + fmtInt(rows.length) + " dòng; " + fmtInt(cnt.ok) + " thành công; " + fmtInt(cnt.err) + " lỗi; thời gian xử lý " + clockText(secs)]),
                columns: columns,
                data: list
            });
        }
        return { start: start, note: note, finish: finish, fail: fail, reset: reset, summary: function () { return { total: rows.length, ok: cnt.ok, err: cnt.err }; } };
    }


    ensureCss();

    /*------------------------------------------
    --Discription: [5] API công khai
    -------------------------------------------*/
    return {
        version: "1.6.0",
        open: open,
        callApi: callApi,
        // Các dòng đang tick ở bảng strTableId (ô tick có id = strPrefix + ID, mặc định "checkX"), tra đủ dữ liệu từ arrData theo ID.
        // Dùng querySelectorAll gốc nên nhanh cả khi bảng có hàng nghìn dòng (bộ chọn ":checkbox...:checked" của jQuery chậm ~120ms/2.684 dòng)
        selectedRows: function (strTableId, arrData, strPrefix) {
            var pre = strPrefix || "checkX", map = {}, arr = [], i;
            (arrData || []).forEach(function (r) { map[r.ID] = r; });
            var nodes = root.document.querySelectorAll('#' + strTableId + ' tbody input[type="checkbox"][id^="' + pre + '"]:checked');
            for (i = 0; i < nodes.length; i++) {
                var r = map[nodes[i].id.substring(pre.length)];
                if (r) arr.push(r);
            }
            return arr;
        },

        // Mở form tiến trình kèm các tiện ích dùng chung của mọi module. cfg như open, thêm:
        //   hideModal   modal đang mở cần đóng TRƯỚC (form không bao giờ mở chồng lên modal khác)
        //   reopenModal modal cần mở lại khi đóng form
        //   refresh     hàm nạp lại danh sách, chạy khi đóng form nếu có bản ghi thành công
        //   filters     [[{label, id}, ...], ...] các ô tìm kiếm trên màn hình -> dòng "Điều kiện áp dụng" (cần edu.exporter)
        run: function (cfg) {
            var $ = root.$, hide = cfg.hideModal, reopen = cfg.reopenModal, refresh = cfg.refresh, lines = [], i;
            var c = {};
            for (var k in cfg) c[k] = cfg[k];
            delete c.hideModal; delete c.reopenModal; delete c.refresh; delete c.filters;
            try {
                if (cfg.filters && root.edu && root.edu.exporter) {
                    for (i = 0; i < cfg.filters.length; i++) lines.push(root.edu.exporter.filterText(cfg.filters[i]));
                }
            } catch (ex) { }
            c.subTitles = [].concat(cfg.subTitles || [], lines);
            c.onClose = function (sum) {
                if (sum.ok > 0 && typeof refresh === "function") refresh();
                if (reopen) $(reopen).modal("show");
                if (typeof cfg.onClose === "function") cfg.onClose(sum);
            };
            var $m = hide ? $(hide) : $();
            // isShown của Bootstrap đúng cả khi modal còn đang chạy hiệu ứng mở (lúc đó :visible chưa đúng)
            var inst = $m.data("bs.modal");
            if ($m.length > 0 && (inst ? inst.isShown : $m.is(":visible"))) {
                $m.one("hidden.bs.modal", function () { open(c); });
                $m.modal("hide");
            }
            else open(c);
        },

        // Lệnh nghiệp vụ chạy 1 lần cho cả phạm vi đang chọn trên màn hình (đưa vào hàng đợi máy chủ, tổng hợp, tính toán, xóa bảng dữ liệu...):
        // form 1 bản ghi — Bước 1 hiện phạm vi áp dụng (thay cho hộp "Bạn có chắc chắn..."), chạy xong có kết quả, thời gian, xuất Excel như mọi chức năng.
        //   cfg: title, what (nội dung hiện ở dòng xử lý), request() -> tham số makeRequest, okMessage (mặc định "Đã thực hiện"),
        //        notes, filters, fileName, refresh (nạp lại danh sách khi đóng form nếu thành công),
        //        onSuccess(sum) chạy ngay khi lệnh thành công (VD bật thanh theo dõi hàng đợi), hideModal, reopenModal, subTitles ... như run
        runJob: function (cfg) {
            var c = {}, k;
            for (k in cfg) c[k] = cfg[k];
            var req = cfg.request, ok = cfg.onSuccess, fin = cfg.onFinish;
            delete c.what; delete c.onSuccess;
            c.unit = cfg.unit || "yêu cầu";
            c.infoHeader = cfg.infoHeader || "Nội dung xử lý";
            c.items = [{ ID: "", TEN: cfg.what || cfg.title }];
            c.info = function (it) { return it.TEN; };
            c.okMessage = cfg.okMessage || "Đã thực hiện";
            c.request = function () { return req(); };
            c.onFinish = function (sum) {
                if (sum.ok > 0 && typeof ok === "function") ok(sum);
                if (typeof fin === "function") fin(sum);
            };
            this.run(c);
        },

        // Mở modal chọn sinh viên chung (edu.extend.genModal_SinhVien); chọn xong đóng modal rồi mở form tiến trình, mỗi sinh viên 1 bản ghi.
        //   cfg: request(id, false, row) (row = dòng trong edu.extend.dtSinhVien), what (chữ cuối tiêu đề, VD "vào danh sách không tính phí"),
        //        title (thay hẳn tiêu đề mặc định "Thêm sinh viên ..."), refresh, fileName, subTitles, filters, notes, okMessage ... như run
        pickSinhVien: function (cfg) {
            var self = this;
            function v(x) { return x === null || x === undefined ? "" : x; }
            root.edu.extend.genModal_SinhVien(function (arrChecked_Id) {
                if (!arrChecked_Id || arrChecked_Id.length === 0) {
                    root.edu.system.alert("Vui lòng chọn đối tượng?");
                    return;
                }
                var map = {}, c = {}, k;
                (root.edu.extend.dtSinhVien || []).forEach(function (r) { map[r.ID] = r; });
                for (k in cfg) c[k] = cfg[k];
                delete c.pickerButton; delete c.what;
                c.hideModal = "#modal_sinhvien";
                c.title = cfg.title || ("Thêm sinh viên" + (cfg.what ? " " + cfg.what : ""));
                c.unit = "sinh viên";
                c.items = arrChecked_Id.map(function (id) { return { ID: id, row: map[id] || {} }; });
                c.columns = [
                    { header: "Mã số", render: function (it) { return it.row.QLSV_NGUOIHOC_MASO || it.ID; } },
                    { header: "Họ tên", render: function (it) { return v(it.row.QLSV_NGUOIHOC_HODEM) + " " + v(it.row.QLSV_NGUOIHOC_TEN); } },
                    { header: "Lớp quản lý", render: function (it) { return it.row.DAOTAO_LOPQUANLY_TEN; } }
                ];
                c.request = function (it) { return cfg.request(it.ID, false, it.row); };
                self.run(c);
            });
        },

        // Panel kết quả import Excel dùng chung (xem hàm importPanel): start / note / finish / fail / reset
        importPanel: importPanel,

        // Gắn bộ nút "thêm theo phạm vi" của modal chọn sinh viên chung (edu.extend.genModal_SinhVien, #modal_sinhvien) — 7 trang dùng
        // đúng bộ này: chọn sinh viên cụ thể (nút cfg.pickerButton) hoặc thêm theo hệ / khóa / khoa quản lý x khóa / chương trình / lớp.
        // Mỗi mục được chọn là 1 bản ghi của form tiến trình; modal chọn được đóng trước khi form mở. cfg:
        //   request(id, isPhamVi, row)  tham số makeRequest cho 1 mục (isPhamVi=false: sinh viên, row = dòng trong edu.extend.dtSinhVien)
        //   what          chữ cuối tiêu đề, VD "vào danh sách không xử lý" -> "Thêm sinh viên vào danh sách không xử lý"
        //   pickerButton  bộ chọn nút mở modal chọn sinh viên (bỏ trống nếu trang không có nút này)
        //   refresh, fileName, subTitles, filters, notes, okMessage ... như run
        bindPhamVi: function (cfg) {
            var $ = root.$, self = this;
            function v(x) { return x === null || x === undefined ? "" : x; }
            function base(strTitle, strUnit) {
                var c = {}, k;
                for (k in cfg) c[k] = cfg[k];
                delete c.pickerButton; delete c.what;
                c.hideModal = "#modal_sinhvien";
                c.title = strTitle + (cfg.what ? " " + cfg.what : "");
                c.unit = strUnit;
                return c;
            }
            // các mục đang chọn của 1 ô chọn nhiều (bỏ mục rỗng "-- Chọn --")
            function optItems(strSel) {
                var a = [];
                $(strSel + " option:selected").each(function () {
                    if ($(this).val()) a.push({ ID: $(this).val(), TEN: $(this).text().replace(/\s+/g, " ").trim() });
                });
                return a;
            }
            function runPhamVi(strTitle, arrItems) {
                if (arrItems.length === 0) {
                    root.edu.system.alert("Vui lòng chọn đối tượng?");
                    return;
                }
                var c = base(strTitle, "mục");
                c.items = arrItems; c.infoHeader = "Phạm vi"; c.info = function (it) { return it.TEN; };
                c.request = function (it) { return cfg.request(it.ID, true); };
                self.run(c);
            }
            if (cfg.pickerButton) {
                $(cfg.pickerButton).click(function () { self.pickSinhVien(cfg); });
            }
            var $modal = $("#modal_sinhvien");
            $modal.delegate("#btnAdd_KhoaKhoa", "click", function () {
                var arrKhoaQL = optItems("#dropSearchModal_KhoaQL_SV"), arrKhoa = optItems("#dropSearchModal_Khoa_SV"), arr = [];
                arrKhoaQL.forEach(function (e) {
                    arrKhoa.forEach(function (ele) { arr.push({ ID: ele.ID + e.ID, TEN: e.TEN + " - " + ele.TEN }); });
                });
                runPhamVi("Thêm phạm vi theo khoa quản lý và khóa đào tạo", arr);
            });
            $modal.delegate("#btnAdd_He", "click", function () { runPhamVi("Thêm phạm vi theo hệ đào tạo", optItems("#dropSearchModal_He_SV")); });
            $modal.delegate("#btnAdd_Khoa", "click", function () { runPhamVi("Thêm phạm vi theo khóa đào tạo", optItems("#dropSearchModal_Khoa_SV")); });
            $modal.delegate("#btnAdd_ChuongTrinh", "click", function () { runPhamVi("Thêm phạm vi theo chương trình đào tạo", optItems("#dropSearchModal_ChuongTrinh_SV")); });
            $modal.delegate("#btnAdd_Lop", "click", function () { runPhamVi("Thêm phạm vi theo lớp quản lý", optItems("#dropSearchModal_Lop_SV")); });
        },

        // Thẻ "Đã nhận lệnh" dùng riêng cho tác vụ khác (VD xuất Excel dữ liệu lớn):
        //   var a = edu.process.ack("Xuất Excel", "Đang chuẩn bị dữ liệu…"); ...; a.close();
        ack: function (strTitle, strFirstStep) {
            var a = showAck(strTitle);
            if (strFirstStep) a.next("", strFirstStep);
            return a;
        },
        paintThen: paintThen
    };
})(typeof window !== "undefined" ? window : globalThis);

// Cùng mẫu với util/systemroot: indexi.aspx khởi tạo bằng edu['process'] = new processrun();
function processrun() { };
processrun.prototype = processrunApi;
