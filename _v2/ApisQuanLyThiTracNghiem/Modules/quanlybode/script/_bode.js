/* =========================================================================
   _bode.js — tầng chung của module "Bộ đề" (Quản lý thi trắc nghiệm): ums.bode.*
   Dùng cho quanlybode (Quản lý bộ đề) và taodethucong (Tạo đề thủ công).
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlybode/script/quanlybode.js (2.329 dòng) + taodethucong.js (1.205 dòng) —
   hai tệp chép nhau các khối: nạp đơn vị theo người dùng, nạp nhóm câu hỏi theo đơn vị, bảng danh sách có lọc
   Đơn vị · Nhóm · Tình trạng, cây nhóm câu hỏi (jstree), khung xem đề (HTML máy chủ dựng + MathJax) và nút "In bài thi",
   báo cáo SYS_Report/ThemMoi theo cặp khoá / giá trị.
   NẠP CHÉO ums.nhch (quanlynganhangcauhoi/script/_nhch.js) cho: cây nhóm (N.cay), ô đánh dấu + chọn tất cả (N.ganChon,
   N.chon, N.thead), bảng câu hỏi (N.dsCauHoi), xem trước câu hỏi (N.xemTruoc), nhóm con (N.nhomCon), hiện HTML (N.html).
   ---------------------------------------------------------------------------
   Lời gọi ở đây (đều action kiểu cũ, không mã hoá; GET trừ khi ghi POST):
     QLTTN_ThongTin/LayDS_DonViByUserId (không versionAPI)   strUserId → ID, NAME
     QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion           versionAPI, strDepartorganId, strStatus, strTuKhoa '', strNguoiDung_Id,
                                                              PageNumber 1, ItemPerPage 10000000 → ID, GROUPQUESTIONNAME, GROUPQUESTIONNAMECODE
     SYS_Report/ThemMoi (POST)                                strTuKhoa, strDuLieu (chuỗi nối dấu phẩy), strNguoiThucHien_Id → Message = id báo cáo
   Khung:
     B.loc(crud, { stNhom, tenNhom })  nối Đơn vị → Nhóm câu hỏi trên thanh lọc của ums.crud (ô con KHOÁ khi chưa chọn đơn vị
                                       — luật cha → con, khác gốc: gốc taodethucong nạp sẵn mọi nhóm); trả { dv(), dvTen(), st() }
     B.chanThem(crud, loc)             nút "Tạo mới" của crud: chưa chọn đơn vị thì báo "Chưa chọn đơn vị" (như gốc)
     B.oNhomForm(crud, key, dv, st, ten, chon)  đổ nhóm câu hỏi vào ô chọn của biểu mẫu crud rồi chọn giá trị
     B.kvDau(row)                      ba dòng Đơn vị · Bộ đề · Nhóm câu hỏi ở đầu khung chi tiết (gốc lblDonVi / lblBoDe / lblGroupQuestion)
     B.xem(host, o)                    khung xem đề thay chỗ (pat.formTrang, có "In bài thi") — HTML máy chủ trả + dàn công thức
     B.baoCao(cap, o)                  SYS_Report/ThemMoi rồi mở đường dẫn báo cáo (o.tabMoi: mở tab mới — gốc InDeThiTracNghiemMau02)
     B.capNhatDong(o)                  gom các dòng đã đổi trong lưới, hỏi lại, chạy ui.batch, nạp lại
   Nợ tầng chung: cột ô đánh dấu + chọn tất cả cho ui.table (nhiều bản tự viết); khung "hai cột trong một tab" (pat.master
   không tiêu đề trang) dùng ở cả ba tab của Cấu trúc đề và Chọn câu hỏi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nhch;
    var B = ums.bode = ums.bode || {};
    var V = 'v1.0';

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    B.e = e;
    B.arr = arr;
    B.uid = uid;
    B.V = V;
    B.BD = 'QLTTN_QuanLyBoDe/';
    B.NH = 'QLTTN_QuanLyNganHangCauHoi/';
    B.toast = function (m, t) { ui.toast(m, t || 'ok'); };
    B.loi = function (err, noi) { ums.api.handle(err, noi); };

    /** Gọi action kiểu cũ; o chép nguyên tham số bản gốc, versionAPI 'v1.0' thêm trừ khi o.versionAPI === false */
    B.g = function (action, o, post) {
        var c = Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {});
        if (c.versionAPI === false) delete c.versionAPI; else if (c.versionAPI === undefined) c.versionAPI = V;
        return ums.api.call(c);
    };

    /** Dàn công thức toán (assets/js/editor.js — chưa có thì bỏ qua) */
    B.toan = function (el) { if (el && ums.editor && ums.editor.toan) ums.editor.toan(el); };
    B.html = function (s) { return ums.editor && ums.editor.html ? ums.editor.html(s) : ui.esc(s); };

    B.trangThai = function (v) { return e(v) === '0' ? ui.badge('Ẩn', 'mute') : ui.badge('Hiện', 'ok'); };
    B.TRANGTHAI = [{ ID: '0', TEN: 'Ẩn' }, { ID: '1', TEN: 'Hiện' }];

    /* ---------- Danh mục ------------------------------------------------- */
    B.nguonDonVi = function () {
        return { call: { action: 'QLTTN_ThongTin/LayDS_DonViByUserId', method: 'GET', strUserId: uid() }, id: 'ID', name: 'NAME' };
    };
    B.nhomCauHoi = function (dv, st) {
        return B.g(B.NH + 'LayDS_GroupQuestion', {
            strDepartorganId: dv, strStatus: e(st), strTuKhoa: '', strNguoiDung_Id: uid(), PageNumber: 1, ItemPerPage: 10000000
        }).then(function (r) { return arr(r.data); });
    };
    /** Tên nhóm trên ô lọc của Quản lý bộ đề (gốc GROUPQUESTIONNAMECODE), thiếu cột thì GROUPQUESTIONNAME */
    B.tenNhomMa = function (r) { return e(r.GROUPQUESTIONNAMECODE) || e(r.GROUPQUESTIONNAME); };

    /* ---------- Thanh lọc Đơn vị → Nhóm câu hỏi của ums.crud -------------- */
    B.loc = function (crud, o) {
        o = o || {};
        function f(k) { return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="filter"][data-k="' + k + '"]'); }
        var dv = f('dv'), gq = f('gq'), st = f('st');
        function napNhom() {
            if (!dv.value) { pat.fill(gq, [], { head: 'Chọn nhóm câu hỏi' }); return; }
            /* Gốc quanlybode lấy nhóm Hiện ('1'); taodethucong lấy theo ô Tình trạng */
            B.nhomCauHoi(dv.value, o.stNhom !== undefined ? o.stNhom : st.value).then(function (rows) {
                pat.fill(gq, rows, { name: o.tenNhom || 'GROUPQUESTIONNAME', head: 'Chọn nhóm câu hỏi' });
            }).catch(function (err) { B.loi(err, 'nhóm câu hỏi'); });
        }
        if (window.jQuery) jQuery(dv).on('select2:select select2:clear', napNhom);
        pat.chain([dv, gq], { phatLai: false });
        return {
            dv: function () { return dv.value; },
            dvTen: function () { var op = dv.options[dv.selectedIndex]; return dv.value && op ? op.text : ''; },
            st: function () { return st.value; }
        };
    };

    /* Nút "Tạo mới" của crud: bắt ở pha BẮT (trước trình xử lý của crud gắn ở pha nổi bọt trên cùng root) */
    B.chanThem = function (crud, loc) {
        crud.root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-c="' + crud.uid + ':add"]');
            if (!b || loc.dv()) return;
            ev.stopImmediatePropagation();
            B.toast('Chưa chọn đơn vị', 'warn');
        }, true);
    };

    /** Đổ danh sách nhóm câu hỏi vào ô Nhóm của biểu mẫu crud rồi chọn giá trị (gốc gen_drp…GroupQuestion default_val) */
    B.oNhomForm = function (crud, key, dv, st, ten, chon) {
        var el = crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + key + '"]');
        if (!el) return Promise.resolve();
        pat.fill(el, [], { head: 'Chọn nhóm' });
        return B.nhomCauHoi(dv, st).then(function (rows) {
            pat.fill(el, rows, { name: ten || 'GROUPQUESTIONNAME', head: 'Chọn nhóm' });
            el.value = chon || '';
            if (window.jQuery) jQuery(el).trigger('change.select2');
        }).catch(function (err) { B.loi(err, 'nhóm câu hỏi'); });
    };

    /* ---------- Đầu khung chi tiết --------------------------------------- */
    B.kv = function (nhan, gt, dam) {
        return '<div class="ums-kv' + (dam ? ' ums-kv--dam' : '') + '"><span>' + ui.esc(nhan) + '</span><b>' + ui.esc(e(gt)) + '</b></div>';
    };
    /** Đơn vị · Bộ đề · Nhóm câu hỏi (cột gốc DEPARTORGANNAME, NAME, GROUPQUESTIONNAME) */
    B.kvDau = function (row) {
        return '<div class="bode-kv">' + B.kv('Đơn vị', row.DEPARTORGANNAME) + B.kv('Bộ đề', row.NAME, true) + B.kv('Nhóm câu hỏi', row.GROUPQUESTIONNAME) + '</div>';
    };

    /* ---------- Khung xem đề + In bài thi --------------------------------- */
    /**
     * o = { title, call (tham số ums.api.call — Data là HTML máy chủ dựng) }
     * Gốc: zoneChiTietDeThi / zoneInDeThiTuLuanHTMLMau01 — thay chỗ vùng đề thi, nút In bài thi + Đóng,
     * nội dung HTML rồi MathJax.Hub.Queue(['Typeset', …]). In: edu.util.printHTML (ui.print).
     * Gốc gọi thêm closePhieu() sau khi in — hàm dọn các vùng của màn PHIẾU THU (không có ở màn này) → bỏ.
     */
    B.xem = function (host, o) {
        var vung = document.createElement('div');
        vung.className = 'bode-xem';
        vung.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var f = pat.formTrang({
            host: host, title: o.title || 'Chi tiết đề thi', icon: 'fa-file-lines', cols: 1, body: vung,
            buttons: [{ text: 'In bài thi', kind: 'print', keepOpen: true, onClick: function () { ui.print(vung, { title: o.title || 'In bài thi' }); } }]
        });
        B.g(o.call.action, o.call).then(function (r) {
            vung.innerHTML = typeof r.data === 'string' ? B.html(r.data) : '';
            if (!vung.innerHTML) vung.innerHTML = ui.empty('Không có nội dung');
            B.toan(vung);
        }).catch(function (err) {
            vung.innerHTML = ui.fail(err.message);
            B.loi(err, o.title);
        });
        return f;
    };

    /* ---------- Báo cáo kiểu riêng (strTuKhoa / strDuLieu nối dấu phẩy) ---- */
    /** cap = [[khoá, giá trị]…]; o.tabMoi: mở tab mới (gốc chỉ với InDeThiTracNghiemMau02), không thì location.href */
    B.baoCao = function (cap, o) {
        o = o || {};
        var keys = [], vals = [];
        cap.forEach(function (p) { keys.push(p[0]); vals.push(e(p[1])); });
        return ums.api.call({ action: 'SYS_Report/ThemMoi', method: 'POST', versionAPI: V, strTuKhoa: keys.join(','), strDuLieu: vals.join(','), strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var id = e(r.message);
                if (!id) { B.toast('Chưa lấy được dữ liệu báo cáo!', 'warn'); return; }
                var goc = (ums.session && ums.session.rootPathReport) || '';
                if (!goc) { B.toast('Thiếu đường dẫn báo cáo (rootPathReport)', 'warn'); return; }
                var url = goc + '?id=' + id;
                if (o.tabMoi) {
                    var win = window.open(url, '_blank');
                    if (win) win.focus(); else B.toast('Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!', 'warn');
                } else location.href = url;
            }).catch(function (err) { B.loi(err, 'báo cáo'); });
    };

    /* ---------- Lưới: cập nhật các dòng đã đổi ----------------------------- */
    /**
     * o = { rows, call(r) → tham số lời gọi | null (dòng không đổi), hoi, title, sau() }
     * Gốc bắn lời gọi cho MỌI dòng (getAllArrCheckBoxIds) rồi setTimeout 2 giây nạp lại; ở đây chỉ gửi dòng có thay đổi,
     * chờ xong rồi nạp lại.
     */
    B.capNhatDong = function (o) {
        var calls = [];
        o.rows.forEach(function (r) { var c = o.call(r); if (c) calls.push(c); });
        if (!calls.length) { B.toast('Không có dòng nào thay đổi', 'info'); return Promise.resolve(false); }
        return ui.confirm(o.hoi || ('Bạn có chắc chắn cập nhật ' + calls.length + ' dòng không?'), { title: o.title || 'Cập nhật' }).then(function (yes) {
            if (!yes) return false;
            return ui.batch(calls, { title: o.title || 'Đang cập nhật' }).then(function (kq) {
                B.toast(kq.fail ? kq.fail + ' dòng lỗi: ' + (kq.errors[0] && kq.errors[0].message || '') : 'Thực hiện thành công', kq.fail ? 'warn' : 'ok');
                if (o.sau) o.sau(kq);
                return true;
            });
        });
    };

    /** Xoá các id đã chọn: hỏi → chạy từng id → nạp lại (gốc: for … Xoa(id) rồi setTimeout 2 giây) */
    B.xoaIds = function (o) {
        if (!o.ids.length) { B.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return Promise.resolve(false); }
        return ui.confirm(o.hoi || 'Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return false;
            return ui.batch(o.ids.map(function (id) {
                return Object.assign({ action: o.action, method: 'POST', versionAPI: V, strId: id, strNguoiThucHien_Id: uid() }, o.them || {});
            }), { title: 'Đang xóa' }).then(function (kq) {
                B.toast(kq.fail ? kq.fail + ' dòng lỗi: ' + (kq.errors[0] && kq.errors[0].message || '') : 'Xóa dữ liệu thành công!', kq.fail ? 'warn' : 'ok');
                if (o.sau) o.sau(kq);
                return true;
            });
        });
    };

    /** Vùng hai cột bên trong một tab (không tiêu đề trang): cây danh mục trái + nội dung phải */
    B.haiCot = function (el, o) {
        var m = pat.master({ el: el, side: { title: o.tieuDeTrai, icon: o.icon || 'fa-folder-tree', kieu: 'danhmuc', search: false, tools: o.tools || '' },
            main: { title: false } });
        el.classList.add('bode-haicot');
        return m;
    };
})();
