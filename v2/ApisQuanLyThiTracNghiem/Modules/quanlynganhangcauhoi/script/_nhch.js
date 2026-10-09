/* =========================================================================
   _nhch.js — tầng chung "Ngân hàng câu hỏi" (Quản lý thi trắc nghiệm): ums.nhch.*
   Dùng cho quanlynganhangcauhoi (quản lý / xem — hai html một mã) và nhapnganhangcauhoi (nhập câu hỏi tạm,
   nạp chéo tệp này). Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlynganhangcauhoi/script/quanlynganhangcauhoi.js
   (5.822 dòng) + nhapnganhangcauhoi/script/nhapnganhangcauhoi.js (2.155 dòng) — tệp sau chép lại ~70% tệp trước
   (các hàm *_Temp). Lời gọi đều action kiểu cũ (không func, không iM), GET trừ chỗ ghi POST, tham số chép nguyên.
   ---------------------------------------------------------------------------
   Lời gọi (QLTTN_QuanLyNganHangCauHoi/… viết tắt NH/…; versionAPI 'v1.0' trừ khi ghi "không"):
     QLTTN_ThongTin/LayDS_DonViByUserId (không)      strUserId                                → ID, NAME
     NH/LayDS_GroupQuestion · LayDS_PhanQuyenGroupQuestion   strDepartorganId, strStatus, strTuKhoa '', strNguoiDung_Id,
                                                     PageNumber, ItemPerPage → GROUPQUESTIONCODE/NAME/STATUS, DEPARTORGANID/NAME
     NH/ThemMoi_GroupQuestion · CapNhat_GroupQuestion (POST)  strId, strCode, strName, strDepartOrganId, strStatus, strNguoiThucHien_Id
     NH/Xoa_GroupQuestion (POST)                      strId
     NH/LayDS_GroupQuestionDetail · LayDS_TreeGroupQuestionDetail   strTuKhoa '', strGroupQuestionId, strNguoiDung_Id,
                                                     PageNumber 1, ItemPerPage 1000000 → ID, PARENTID, NAME, CODE, TAPHOPCACCAUHOI, STATUS, CONTENT
     NH/ThemMoi_GroupQuestionDetail · CapNhat_GroupQuestionDetail (POST)  strId, strCode, strName, strParentId, strGroupQuestionId,
                                                     strTapHopCacCauHoi, strNguoiThucHien_Id
     NH/Xoa_GroupQuestionDetail (POST) strId · NH/Sua_ContentGroupQuestionDetail (POST) strId, strStatus, strContent
     QLTTN_Files/LayDanhSach strDuLieu_Id → ID, TENHIENTHI, DUONGDAN · QLTTN_Files/Xoa (POST) strIds
     NH/LayDS_LoaiCauHoi strQuestionTypeId '' · NH/LayDS_MucDoCauHoi strLevelQuestionId ''   → ID, NAME, CODE
     NH/LayDS_CauHoi · LayDS_CauHoi_Temp              strTuKhoa, strGroupQuestionDetailId, strStatus, strQuestionTypeId, strLeVelId,
                                                     [strMucPheDuyetId — tạm], strNguoiDung_Id, PageNumber, ItemPerPage
     NH/LayDS_DapAn_All · LayDS_DapAn_All_Temp        strGroupQuestionDetailId → QUESTIONID, ORDERS, ORDERABC, CONTENT
     NH/Update_Question_STT · Update_Question_Temp_STT (POST)  strId, strOrderNumber, strTinhDiemTheoSoY
     NH/Xoa_Question · Xoa_QuestionTemp · CapNhatTinhTrang_Question (strStatus) · Chuyen_Question (strGroupQuestionDetailId) ·
        DuaCauHoiTmpVaoNH · Duyet_QuestionTemp · KhongDuyet_QuestionTemp (strMucPheDuyetId)   (POST, strId từng dòng)
     NH/LayDS_PreviewCauHoi (POST ở quản lý, GET ở nhập — giữ)  strId "id1,id2", strZone → Data { rsQuestion, rsAnswer, rsAnswerSecond }
     NH/ImportNganHangCauHoi_Temp_Doc · _LaTeX (GET)  GroupQuestionDetailId, strQuestionTypeId, MucPheDuyetId, NguoiThucHien_Id,
                                                     strPath → Data { Table1 lỗi, Table2 thành công }, Message
     SYS_Report/ThemMoi (POST)                        strTuKhoa, strDuLieu (chuỗi nối dấu phẩy — kiểu riêng của màn này), strNguoiThucHien_Id
   Biểu mẫu câu hỏi + đáp án: _nhch_cauhoi.js (ums.nhch.formCauHoi, khoiDapAn).
   ---------------------------------------------------------------------------
   Khác gốc (cố ý):
     · Mọi lệnh hàng loạt (xoá, đổi tình trạng, chuyển, đưa vào NH đề, duyệt) chờ xong rồi mới nạp lại — gốc bắn N lời gọi rồi
       setTimeout 2 giây nạp lại, nhanh / chậm là lệch; và gốc gắn $("#btnYes").click chồng lên nhau mỗi lần hỏi (bấm lần hai
       chạy cả lệnh lần trước) — bản mới hỏi bằng ui.confirm.
     · Cây nhóm câu hỏi vẽ bằng ums.pat.master kiểu danh mục (thay jstree); "Thao tác" (Thêm mới / Sửa / Xóa nhóm) là ba nút
       trên tiêu đề cột trái thay cho menu thả xuống.
     · Nội dung câu hỏi / đáp án là HTML soạn bằng CKEditor → hiện qua ums.editor.html (bỏ script / on*), công thức toán dàn
       bằng ums.editor.toan (MathJax của ứng dụng cha).
   Module quanlybode (ums.bode) NẠP CHÉO tệp này: N.cay (tuỳ chọn `ten` / `ma` cho cây phần thi TITLE), N.dsCauHoi (tuỳ chọn
   `tinhTheoY: false`, `thaoTac: false`, `slDaThi: 'so'` cho bảng chọn câu hỏi của Tạo đề thủ công), N.xemTruoc, N.ganChon / N.chon.
   Nợ tầng chung: cây cha → con là bản thứ năm → ums.pat.cay; cột ô đánh dấu + chọn tất cả / chọn cả cột cho ui.table.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var N = ums.nhch = ums.nhch || {};
    var V = 'v1.0';
    var NH = 'QLTTN_QuanLyNganHangCauHoi/';

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function toast(m, t) { ui.toast(m, t || 'ok'); }
    function loi(err, noi) { ums.api.handle(err, noi); }

    N.e = e; N.arr = arr; N.uid = uid; N.V = V; N.NH = NH;

    /** Gọi action kiểu cũ; o chép nguyên tham số bản gốc, versionAPI thêm trừ khi o.versionAPI === false */
    N.g = function (action, o, post) {
        var c = Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {});
        if (c.versionAPI === false) delete c.versionAPI; else if (c.versionAPI === undefined) c.versionAPI = V;
        return ums.api.call(c);
    };
    /** HTML máy chủ (CKEditor) → hiện an toàn */
    N.html = function (s) { return ums.editor && ums.editor.html ? ums.editor.html(s) : ui.esc(s); };
    N.toan = function (el) { if (el && ums.editor && ums.editor.toan) ums.editor.toan(el); };

    N.TT_NHOM = [{ ID: '0', TEN: 'Ẩn' }, { ID: '1', TEN: 'Hiện' }];
    N.TT_CAUHOI = [{ ID: '1', TEN: 'Đang dùng' }, { ID: '0', TEN: 'Không dùng' }];
    N.DAO = [{ ID: '1', TEN: 'Đảo đáp án' }, { ID: '0', TEN: 'Không đảo đáp án' }];
    N.ttNhom = function (v) { return e(v) === '0' ? 'Ẩn' : 'Hiện'; };
    N.ttCauHoi = function (v) { return e(v) === '1' ? 'Đang dùng' : 'Không dùng'; };

    /* ---------- Danh mục ------------------------------------------------- */
    N.donVi = function () { return N.g('QLTTN_ThongTin/LayDS_DonViByUserId', { versionAPI: false, strUserId: uid() }).then(function (r) { return arr(r.data); }); };
    N.loaiCauHoi = function () { return N.g(NH + 'LayDS_LoaiCauHoi', { strQuestionTypeId: '' }).then(function (r) { return arr(r.data); }); };
    N.mucDo = function () { return N.g(NH + 'LayDS_MucDoCauHoi', { strLevelQuestionId: '' }).then(function (r) { return arr(r.data); }); };
    /** Nhóm câu hỏi con của một nhóm lớn (cây) — cả hai lời gọi gốc cùng tham số */
    N.nhomCon = function (groupId, tree) {
        return N.g(NH + (tree ? 'LayDS_TreeGroupQuestionDetail' : 'LayDS_GroupQuestionDetail'),
            { strTuKhoa: '', strGroupQuestionId: groupId, strNguoiDung_Id: uid(), PageNumber: 1, ItemPerPage: 1000000 })
            .then(function (r) { return { rows: arr(r.data), tong: r.pager }; });
    };
    N.dapAnAll = function (nhomId, temp) {
        return N.g(NH + (temp ? 'LayDS_DapAn_All_Temp' : 'LayDS_DapAn_All'), { strGroupQuestionDetailId: nhomId })
            .then(function (r) { var m = {}; arr(r.data).forEach(function (a) { (m[e(a.QUESTIONID)] || (m[e(a.QUESTIONID)] = [])).push(a); }); return m; });
    };

    /* ---------- Ô đánh dấu trong bảng ------------------------------------ */
    /** Ô ở <thead> mang data-all → đánh dấu cả cột data-ck; data-cot="x" → cả cột data-cot="x" ở thân */
    N.ganChon = function (host) {
        if (host._nhchChon) return;
        host._nhchChon = true;
        host.addEventListener('click', function (ev) {
            var t = ev.target;
            if (!t || t.type !== 'checkbox' || !t.closest('thead')) return;
            var tb = t.closest('table'); if (!tb) return;
            var sel = t.hasAttribute('data-all') ? 'input[data-ck]' : (t.getAttribute('data-cot') ? 'input[data-cot="' + t.getAttribute('data-cot') + '"]' : '');
            if (!sel) return;
            Array.prototype.forEach.call(tb.tBodies, function (b) {
                b.querySelectorAll(sel).forEach(function (c) { if (!c.disabled) c.checked = t.checked; });
            });
            if (ui.demXoaChon) ui.demXoaChon();
        });
    };
    /** Id các dòng đã đánh dấu (ô data-ck trong thân bảng) */
    N.chon = function (host) {
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[data-ck]'), function (c) { return c.checked; })
            .map(function (c) { return c.getAttribute('data-ck'); });
    };
    N.thead = function (them) { return '<input type="checkbox" data-all title="Chọn tất cả">'; };

    /* ---------- Cây nhóm câu hỏi (thay jstree) ---------------------------- */
    /** o = { chon, onChon(id, row), ten: cột tên (mặc định NAME), ma: cột mã (mặc định CODE; false = không) } — vẽ cây cha → con kiểu DANH MỤC vào host (trong .ums-master--danhmuc) */
    N.cay = function (host, rows, o) {
        o = o || {};
        var kTen = o.ten || 'NAME', kMa = o.ma === false ? '' : (o.ma || 'CODE');
        var ids = {}, con = {}, da = {}, map = {};
        rows.forEach(function (r) { ids[e(r.ID)] = true; map[e(r.ID)] = r; });
        rows.forEach(function (r) {
            var p = e(r.PARENTID);
            if (!p || !ids[p] || p === e(r.ID)) p = '';
            (con[p] || (con[p] = [])).push(r);
        });
        function nhanh(pid) {
            var kids = (con[pid] || []).filter(function (r) { return !da[e(r.ID)]; });
            if (!kids.length) return '';
            return '<ul>' + kids.map(function (r) {
                var id = e(r.ID); da[id] = true;
                var ten = e(r[kTen]), ma = kMa ? e(r[kMa]) : '';
                return '<li><button type="button" class="ums-master__item' + (id === o.chon ? ' is-active' : '') +
                    '" data-cay="' + ui.esc(id) + '" title="' + ui.esc(ma ? ma + ' — ' + ten : ten) + '">' + ui.esc(ten) + '</button>' + nhanh(id) + '</li>';
            }).join('') + '</ul>';
        }
        host.innerHTML = nhanh('') || ui.empty(o.empty || 'Chưa có nhóm câu hỏi', 'fa-folder-tree');
        if (!host._nhchCay) {
            host._nhchCay = true;
            host.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-cay]');
                if (!b || !host.contains(b)) return;
                host.querySelectorAll('.ums-master__item.is-active').forEach(function (x) { x.classList.remove('is-active'); });
                b.classList.add('is-active');
                var id = b.getAttribute('data-cay');
                if (host._nhchOnChon) host._nhchOnChon(id, host._nhchMap[id]);
            });
        }
        host._nhchOnChon = o.onChon;
        host._nhchMap = map;
    };

    /* ---------- Khung chi tiết hai cột (cây trái, nội dung phải) ---------- */
    /**
     * o = { el, tieuDe, dong(): đóng khung, tools: HTML nút trên tiêu đề cột trái, onChon(id, row) }
     * → { m, main, veCay(rows, chon), rows(), dong() }
     */
    N.khungChiTiet = function (o) {
        o.el.classList.add('nhch-khung');
        var m = pat.master({
            el: o.el, title: o.tieuDe,
            actions: ui.btn('close', { attr: { 'data-k': 'dong' } }),
            side: { title: 'Thông tin', icon: 'fa-folder-tree', kieu: 'danhmuc', search: false, tools: o.tools || '' },
            main: { title: false }
        });
        var rows = [];
        var api = {
            m: m, main: m.mainBody,
            rows: function () { return rows; },
            veCay: function (ds, chon) {
                rows = ds;
                if (m.sideCount) m.sideCount.textContent = ds.length ? '(' + ds.length + ')' : '';
                N.cay(m.sideBody, ds, { chon: chon, onChon: o.onChon });
            },
            dong: o.dong
        };
        var d = m.el.querySelector('[data-k="dong"]');
        if (d) d.addEventListener('click', function () { if (o.dong) o.dong(); });
        return api;
    };

    /* ---------- Biểu mẫu nhóm câu hỏi con (trong trang) ------------------ */
    /** o = { host, groupId, row (sửa) | null (thêm), onSaved() } */
    N.formNhom = function (o) {
        var body = document.createElement('div');
        body.className = 'ums-grid ums-grid--2';
        body.innerHTML =
            ui.field('Mã nhóm', '<input class="ums-input" data-k="ma" autocomplete="off">', { required: true }) +
            ui.field('Nhóm cha', '<select class="ums-select" data-k="cha" data-ph="-- Chọn nhóm cha --"><option value="">-- Chọn nhóm cha --</option></select>') +
            '<div style="grid-column:1 / -1">' + ui.field('Mô tả', '<textarea class="ums-input" rows="2" data-k="ten"></textarea>', { required: true }) + '</div>' +
            '<div style="grid-column:1 / -1"><label class="ums-check"><input type="checkbox" data-k="tap"> Là câu hỏi dạng tập các câu hỏi con</label></div>';
        var q = function (k) { return body.querySelector('[data-k="' + k + '"]'); };
        var f = pat.formTrang({
            host: o.host, title: 'Nhóm câu hỏi', icon: 'fa-folder-tree', body: body,
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); } }]
        });
        if (o.row) {
            q('ma').value = e(o.row.CODE);
            q('ten').value = e(o.row.NAME);
            q('tap').checked = e(o.row.TAPHOPCACCAUHOI) === '1';
        }
        N.nhomCon(o.groupId, true).then(function (kq) {
            var ds = kq.rows.filter(function (r) { return !o.row || e(r.ID) !== e(o.row.ID); });
            pat.fill(q('cha'), ds, { id: 'ID', name: function (r) { return e(r.CODE) ? e(r.CODE) + ' - ' + e(r.NAME) : e(r.NAME); }, head: '-- Chọn nhóm cha --' });
            if (o.row) { q('cha').value = e(o.row.PARENTID); if (window.jQuery) jQuery(q('cha')).trigger('change.select2'); }
        }).catch(function (err) { loi(err, 'nhóm câu hỏi cha'); });
        function luu() {
            var ma = q('ma').value.trim(), ten = q('ten').value.trim();
            if (!ma || !ten) { toast('Nhập Mã nhóm và Mô tả', 'warn'); return; }
            var c = {
                strId: o.row ? e(o.row.ID) : '', strCode: ma, strName: ten, strParentId: q('cha').value,
                strGroupQuestionId: o.groupId, strTapHopCacCauHoi: q('tap').checked ? '1' : '0', strNguoiThucHien_Id: uid()
            };
            N.g(NH + (o.row ? 'CapNhat_GroupQuestionDetail' : 'ThemMoi_GroupQuestionDetail'), c, true).then(function () {
                toast('Thực hiện thành công');
                f.close();
                if (o.onSaved) o.onSaved();
            }).catch(function (err) { loi(err, 'lưu nhóm câu hỏi'); });
        }
        return f;
    };

    /* ---------- Hộp chọn nhóm đích (Chuyển câu hỏi) ----------------------- */
    /** o = { rows (cây), soCau, onChon(id, ten) } — hộp thoại vì chỉ là việc CHỌN */
    N.hopChuyen = function (o) {
        var chonId = '', chonTen = '';
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-master--danhmuc nhch-cay"><div class="ums-master__list" data-k="cay"></div></div>' +
            '<div class="ums-u-faint ums-u-fz13 ums-u-mt-3">Tổng số câu thực hiện chuyển: <b>' + o.soCau + '</b></div>';
        N.cay(body.querySelector('[data-k="cay"]'), o.rows, { onChon: function (id, r) { chonId = id; chonTen = e(r && r.NAME).toUpperCase(); } });
        ui.dialog({
            title: 'Chuyển câu hỏi', icon: 'fa-folder-tree', size: 'md', body: body,
            buttons: [{ text: 'Thực hiện chuyển', kind: 'confirm', icon: 'fa-arrow-right-arrow-left', onClick: function () {
                if (!chonId) { toast('Chưa chọn nhóm câu hỏi đích', 'warn'); return false; }
                o.onChon(chonId, chonTen);
            } }]
        });
    };

    /* ---------- Chạy một lệnh cho từng id, hỏi trước, báo gộp ------------- */
    /** o = { ids, hoi, action, them(id) → tham số thêm, ok, sau() } */
    N.hangLoat = function (o) {
        return ui.confirm(o.hoi || 'Bạn có chắc chắn thực hiện không?', { title: o.title || 'Xác nhận' }).then(function (yes) {
            if (!yes) return false;
            var calls = o.ids.map(function (id) {
                return Object.assign({ action: o.action, method: 'POST', versionAPI: V, strId: id, strNguoiThucHien_Id: uid() }, o.them ? o.them(id) : {});
            });
            return ui.batch(calls, { title: o.title || 'Đang thực hiện' }).then(function (r) {
                if (r.fail) toast((r.ok ? r.ok + ' dòng xong, ' : '') + r.fail + ' dòng lỗi: ' + (r.errors[0] && r.errors[0].message || ''), 'warn');
                else toast(o.ok || 'Thực hiện thành công');
                if (o.sau) o.sau(r);
                return true;
            });
        });
    };

    /* ---------- Bảng câu hỏi (thật / tạm) --------------------------------- */
    /**
     * o = { el, temp, view, orderInput, loc (thanh lọc), toolbar: { trai, phai } HTML, tieuDe, icon, tools (đầu khung),
     *       nhomId(), thamSo() → tham số thêm (strMucPheDuyetId…), onSua(row), onDaDung(row), onLsCauHoi(row), onLsDapAn(row),
     *       slDaThi (cột SL đã thi: true = số + ba nút Đã dùng / Lịch sử; 'so' = chỉ số — màn Tạo đề thủ công),
     *       tinhTheoY (mặc định true — cột "Tính theo ý"), thaoTac (mặc định true — cột Thao tác), xacNhanNut }
     * → { el, root, bang, rows(), dapAn(), tai(page), taiLai(), chon(), f (ô lọc), page }
     */
    N.dsCauHoi = function (o) {
        var host = o.el;
        var rows = [], dapAn = {}, page = { index: 1, size: 10, total: 0 };
        var locHtml = o.loc ? pat.filterBar([
            { key: 'tt', type: 'select', label: 'Tình trạng' },
            { key: 'loai', type: 'select', label: '--Chọn loại câu hỏi--' },
            { key: 'muc', type: 'select', label: '--Chọn mức độ--' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) : '';
        var tb = o.toolbar ? '<div class="nhch-toolbar"><div class="nhch-toolbar__nhom">' + (o.toolbar.trai || '') + '</div>' +
            '<div class="nhch-toolbar__nhom nhch-toolbar__nhom--phai">' + (o.toolbar.phai || '') + '</div></div>' : '';
        host.innerHTML = pat.panel({
            title: o.tieuDe, icon: o.icon || 'fa-database', count: 'dem', tools: o.tools || '', flush: true,
            body: (locHtml || tb ? '<div class="nhch-dau">' + locHtml + tb + '</div>' : '') + '<div data-z="bang"></div>'
        });
        var root = host.firstElementChild;
        var bang = root.querySelector('[data-z="bang"]');
        var dem = root.querySelector('[data-z="dem"]');
        var f = {};
        ['tt', 'loai', 'muc', 'q'].forEach(function (k) { f[k] = root.querySelector('[data-f="' + k + '"]'); });
        if (o.loc) {
            pat.fill(f.tt, N.TT_CAUHOI, { head: 'Tình trạng' });
            N.loaiCauHoi().then(function (ds) { pat.fill(f.loai, ds, { name: 'NAME', head: '--Chọn loại câu hỏi--' }); }).catch(function () {});
            N.mucDo().then(function (ds) { pat.fill(f.muc, ds, { name: 'NAME', head: '--Chọn mức độ--' }); }).catch(function () {});
            root.querySelector('[data-a="search"]').addEventListener('click', function () { api.tai(1); });
            f.q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); api.tai(1); } });
            if (window.jQuery) jQuery(f.tt).on('select2:select select2:clear', function () { api.tai(1); });   // gốc: đổi Tình trạng là tải lại
        }
        N.ganChon(bang);
        ui.enhance(root);

        function v(k) { return f[k] ? f[k].value : ''; }
        function veDapAn(r) {
            var ds = dapAn[e(r.ID)] || [];
            return ds.map(function (a) {
                return '<div class="nhch-da' + (e(a.ORDERS) === '' ? ' nhch-da--loi' : '') + '">' + ui.esc(e(a.ORDERABC)) + N.html(a.CONTENT) + '</div>';
            }).join('');
        }
        function cot() {
            var c = [];
            c.push({ title: 'Order', cls: 'is-center', width: '72px', render: function (r) {
                return o.orderInput && !o.view ? '<input class="ums-input ums-input--so nhch-stt" data-stt="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(r.ORDERNUMBER)) + '">' : ui.esc(e(r.ORDERNUMBER));
            } });
            c.push({ title: 'Nội dung câu hỏi', cls: 'nhch-nd', render: function (r) { return '<div class="nhch-html">' + N.html(r.CONTENT) + '</div>'; } });
            c.push({ title: 'Đáp án', cls: 'nhch-nd', render: veDapAn });
            c.push({ title: o.temp ? 'Số đáp án' : 'Số đ/a', prop: 'SODAPAN', cls: 'is-center' });
            c.push({ title: 'Loại câu hỏi', prop: 'TENLOAICAUHOI', cls: 'is-center' });
            c.push({ title: 'Mức độ', prop: 'TENMUCDOCAUHOI', cls: 'is-center' });
            c.push({ title: 'Điểm(+/-)', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(e(r.PLUSMARK)) + '/' + ui.esc(e(r.MINUSMARK)); } });
            c.push({ title: 'Đảo đ/a', cls: 'is-center', render: function (r) { return e(r.DAODAPAN) === '1' ? 'Có' : 'Không'; } });
            if (!o.temp) c.push({ title: 'Trạng thái', cls: 'is-center', render: function (r) { return e(r.STATUS) === '1' ? ui.badge('Đang dùng', 'ok') : ui.badge('Không dùng', 'mute'); } });
            if (o.tinhTheoY !== false) c.push({ head: 'Tính theo ý' + (o.orderInput && !o.view ? ' <input type="checkbox" data-cot="soy" title="Đánh dấu cả cột">' : ''), cls: 'is-center', giuCho: true, render: function (r) {
                return '<input type="checkbox" data-cot="soy" data-soy="' + ui.esc(e(r.ID)) + '"' + (e(r.TINHDIEMTHEOSOY) === '1' ? ' checked' : '') + ((o.orderInput && !o.view) ? '' : ' disabled') + '>';
            } });
            if (o.slDaThi) c.push({ title: 'SL đã thi', cls: 'is-center is-nowrap', render: function (r) {
                var sl = (Number(r.SOLUOTDATHI_CHUALUU) || 0) + (Number(r.SOLUOTDATHI_DALUU) || 0);
                if (o.slDaThi === 'so') return '<b class="nhch-sl">' + sl + '</b>';
                return '<b class="nhch-sl">' + sl + '</b><br>' +
                    '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm nhch-nutnho" data-act="dadung" data-id="' + ui.esc(e(r.ID)) + '"><i class="fa-light fa-eye"></i><span>Đã dùng</span></button><br>' +
                    '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm nhch-nutnho" data-act="lsch" data-id="' + ui.esc(e(r.ID)) + '"><i class="fa-light fa-clock-rotate-left"></i><span>Lịch sử câu hỏi</span></button><br>' +
                    '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm nhch-nutnho" data-act="lsda" data-id="' + ui.esc(e(r.ID)) + '"><i class="fa-light fa-clock-rotate-left"></i><span>Lịch sử đáp án</span></button>';
            } });
            if (o.thaoTac !== false) c.push({ title: 'Thao tác', cls: 'is-actions is-center', render: function (r) { return ui.iconBtn(o.view ? 'view' : 'edit', e(r.ID)); } });
            c.push({ head: N.thead(), cls: 'is-center', width: '44px', render: function (r) { return '<input type="checkbox" data-ck="' + ui.esc(e(r.ID)) + '">'; } });
            return c;
        }
        function ve() {
            ui.table({
                el: bang, columns: cot(), rows: rows, empty: 'Không có câu hỏi',
                page: { index: page.index, size: page.size, total: page.total, sizes: ui.PAGE_SIZES,
                    onChange: function (p) { api.tai(p); }, onSize: function (s) { page.size = s; api.tai(1); } }
            });
            bang.querySelectorAll('tbody tr').forEach(function (tr, i) { if (rows[i]) tr.setAttribute('data-id', e(rows[i].ID)); });
            if (dem) dem.textContent = page.total ? '(' + page.total + ')' : '';
            N.toan(bang);
        }
        bang.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-act]');
            if (!b || !bang.contains(b)) return;
            var id = b.getAttribute('data-id'), r = rows.filter(function (x) { return e(x.ID) === id; })[0];
            if (!r) return;
            var k = b.getAttribute('data-act');
            if (k === 'edit' || k === 'view') { if (o.onSua) o.onSua(r); }
            else if (k === 'dadung') { if (o.onDaDung) o.onDaDung(r); }
            else if (k === 'lsch') { if (o.onLsCauHoi) o.onLsCauHoi(r); }
            else if (k === 'lsda') { if (o.onLsDapAn) o.onLsDapAn(r); }
        });

        var api = {
            el: host, root: root, bang: bang, f: f, page: page,
            rows: function () { return rows; },
            dapAn: function () { return dapAn; },
            chon: function () { return N.chon(bang); },
            v: v,
            tai: function (p) {
                var nhom = o.nhomId();
                if (p) page.index = p;
                if (!nhom) { rows = []; dapAn = {}; page.total = 0; bang.innerHTML = ui.empty('Chọn một nhóm câu hỏi ở cột bên trái', 'fa-folder-tree'); if (dem) dem.textContent = ''; return Promise.resolve(); }
                var c = { strTuKhoa: v('q'), strGroupQuestionDetailId: nhom, strStatus: v('tt'), strQuestionTypeId: v('loai'), strLeVelId: v('muc'),
                    strNguoiDung_Id: uid(), PageNumber: page.index, ItemPerPage: page.size };
                if (!o.loc) { delete c.strQuestionTypeId; delete c.strLeVelId; }       // gốc (tạm ở màn quản lý) không gửi hai ô này
                Object.assign(c, o.thamSo ? o.thamSo() : {});
                return Promise.all([N.dapAnAll(nhom, o.temp), N.g(NH + (o.temp ? 'LayDS_CauHoi_Temp' : 'LayDS_CauHoi'), c)]).then(function (kq) {
                    dapAn = kq[0];
                    rows = arr(kq[1].data);
                    page.total = Number(kq[1].pager) || rows.length;
                    ve();
                }).catch(function (err) { bang.innerHTML = ui.fail(err.message); loi(err, 'danh sách câu hỏi'); });
            },
            taiLai: function () { return api.tai(); },
            /** Cập nhật STT / tính điểm theo số ý — chỉ dòng có thay đổi, như gốc */
            capNhatSTT: function () {
                var calls = [];
                rows.forEach(function (r) {
                    var i = bang.querySelector('input[data-stt="' + e(r.ID) + '"]'), c = bang.querySelector('input[data-soy="' + e(r.ID) + '"]');
                    if (!i || !c) return;
                    var stt = i.value, soy = c.checked ? '1' : '0';
                    if (stt !== e(r.ORDERNUMBER) || soy !== e(r.TINHDIEMTHEOSOY)) {
                        calls.push({ action: NH + (o.temp ? 'Update_Question_Temp_STT' : 'Update_Question_STT'), method: 'POST', versionAPI: V,
                            strId: e(r.ID), strOrderNumber: stt, strTinhDiemTheoSoY: soy, strNguoiThucHien_Id: uid() });
                    }
                });
                if (!calls.length) { toast('Không có dòng nào thay đổi', 'info'); return Promise.resolve(); }
                return ui.confirm('Bạn có chắc chắn cập nhật ' + calls.length + ' câu hỏi không?', { title: 'Cập nhật' }).then(function (yes) {
                    if (!yes) return;
                    return ui.batch(calls, { title: 'Đang cập nhật' }).then(function (r) {
                        toast(r.fail ? r.fail + ' dòng lỗi' : 'Thực hiện thành công', r.fail ? 'warn' : 'ok');
                        api.tai();
                    });
                });
            }
        };
        return api;
    };

    /* ---------- Xem trước / kiểm tra câu hỏi ------------------------------ */
    N.layXemTruoc = function (ids, temp, post) {
        return N.g(NH + 'LayDS_PreviewCauHoi', { strId: ids.join(','), strZone: temp ? 'zonePreviewTableQuestion_Temp' : 'zonePreviewTableQuestion' }, post !== false)
            .then(function (r) { var d = r.data || {}; return { q: arr(d.rsQuestion), a: arr(d.rsAnswer), a2: arr(d.rsAnswerSecond) }; });
    };
    /** HTML xem trước (chép bố cục genTable_PreviewCauHoi: số câu, hướng dẫn, nội dung, câu trả lời theo loại) */
    N.veXemTruoc = function (d, kiem) {
        var h = '', loiDong = {};
        d.q.forEach(function (q, i) {
            var qid = e(q.QUESTIONID), code = e(q.QUESTIONTYPECODE);
            var tl = d.a.filter(function (a) { return e(a.QUESTIONID) === qid; });
            h += '<div class="nhch-xt" data-q="' + ui.esc(qid) + '">' +
                '<div class="nhch-xt__so">Câu ' + (i < 9 ? '0' : '') + (i + 1) + ':</div>' +
                (e(q.GUIDE) ? '<div class="nhch-xt__hd">' + N.html(q.GUIDE) + '</div>' : '') +
                '<div class="nhch-xt__nd">' + N.html(q.CONTENT) + '</div>' +
                '<div class="nhch-xt__tl">Câu trả lời:</div>';
            var soDung = 0, keoThaOk = true;
            if (kiem && !tl.length) loiDong[qid] = true;
            tl.forEach(function (a) {
                var dung = e(a.CORRECT) === '1';
                if (dung) soDung++;
                var nhan = ui.esc(e(a.ORDERABC)) + N.html(a.CONTENT);
                if (code === 'BESTANSWER' || code === 'TRUEFALSEONE') {
                    h += '<label class="nhch-xt__da"><input type="radio" disabled' + (dung ? ' checked' : '') + '> ' + nhan + '</label>';
                } else if (code === 'MULTICHOICE') {
                    h += '<label class="nhch-xt__da"><input type="checkbox" disabled' + (dung ? ' checked' : '') + '> ' + nhan + '</label>';
                } else if (code === 'CROSSLINK') {
                    var v2 = d.a2.filter(function (x) { return e(x.QUESTIONID) === qid; });
                    h += '<div class="nhch-xt__da">' + nhan + ' <select class="ums-select nhch-xt__sel" disabled><option>--Chọn--</option>' +
                        v2.map(function (x) { return '<option' + (e(a.STUDENTANSWER_SENCOND_ID) && e(x.ANSWER_SENCONDID) === e(a.STUDENTANSWER_SENCOND_ID) ? ' selected' : '') + '>' + ui.esc(e(x.CONTENT)) + '</option>'; }).join('') +
                        '</select></div>';
                } else if (code === 'TRUEFALSE') {
                    var c = e(a.CORRECT);
                    h += '<div class="nhch-xt__da">' + ui.esc(e(a.ORDERABC)) + ' <select class="ums-select nhch-xt__sel" disabled>' +
                        '<option' + (c !== '1' && c !== '0' ? ' selected' : '') + '>Chọn</option><option' + (c === '1' ? ' selected' : '') + '>Đúng</option><option' + (c === '0' ? ' selected' : '') + '>Sai</option></select> ' + N.html(a.CONTENT) + '</div>';
                } else if (code === 'FILLTHEBLANK') {
                    h += '<div class="nhch-xt__da">' + nhan + ' <input class="ums-input nhch-xt__inp" disabled value="' + ui.esc(e(a.STUDENTANSWERCONTENT2)) + '"></div>';
                } else if (code === 'KEOTHAXUONGDAPAN') {
                    h += '<div class="nhch-xt__da">' + nhan + ' <input class="ums-input nhch-xt__inp" disabled value="' + ui.esc(e(a.CONTENT2)) + '"></div>';
                    if (kiem) {
                        /* Kiểm tra kéo thả: mọi từ trong CONTENT2 ($…$) phải có trong các .draggable-word của nội dung câu hỏi (như gốc) */
                        var tu = e(a.CONTENT2).split('$').map(function (x) { return x.trim(); }).filter(Boolean);
                        var tam = document.createElement('div'); tam.innerHTML = N.html(q.CONTENT);
                        var keo = Array.prototype.map.call(tam.querySelectorAll('.draggable-word'), function (x) { return x.textContent.replace(/\s+/g, ' ').trim(); });
                        if (!tu.every(function (w) { return keo.indexOf(w) >= 0; })) keoThaOk = false;
                    }
                } else {
                    h += '<div class="nhch-xt__da">' + nhan + '</div>';
                }
            });
            if (kiem) {
                if (soDung === 0 && code !== 'KEOTHAXUONGDAPAN' && code !== 'FILLTHEBLANK') loiDong[qid] = true;
                if (!keoThaOk && (code === 'KEOTHAXUONGDAPAN' || code === 'FILLTHEBLANK')) loiDong[qid] = true;
            }
            h += '</div>';
        });
        return { html: h || ui.empty('Không có câu hỏi nào'), loi: loiDong };
    };
    /**
     * Khung xem trước / kiểm tra thay chỗ danh sách (như gốc) — o = { host, ids, temp, post, kiem, bang (bảng để tô dòng lỗi), title }
     */
    N.xemTruoc = function (o) {
        var vung = document.createElement('div');
        vung.className = 'nhch-xemtruoc';
        vung.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var f = pat.formTrang({
            host: o.host, title: o.title || (o.kiem ? 'Kiểm tra câu hỏi' : 'Preview câu hỏi'), icon: 'fa-eye', cols: 1, body: vung,
            buttons: [{ text: 'In', kind: 'print', keepOpen: true, onClick: function () { ui.print(vung, { title: 'Câu hỏi' }); } }]
        });
        N.layXemTruoc(o.ids, o.temp, o.post).then(function (d) {
            var kq = N.veXemTruoc(d, o.kiem);
            vung.innerHTML = kq.html;
            N.toan(vung);
            if (o.kiem) {
                if (o.bang) o.bang.querySelectorAll('tr[data-id]').forEach(function (tr) { tr.classList.toggle('nhch-loi', !!kq.loi[tr.getAttribute('data-id')]); });
                vung.querySelectorAll('.nhch-xt').forEach(function (x) { x.classList.toggle('nhch-xt--loi', !!kq.loi[x.getAttribute('data-q')]); });
                var n = Object.keys(kq.loi).length;
                toast(n ? 'Đã kiểm tra xong: ' + n + ' câu hỏi thiếu đáp án / chưa có đáp án đúng (tô đỏ)' : 'Đã kiểm tra xong: không phát hiện lỗi', n ? 'warn' : 'ok');
            }
        }).catch(function (err) { vung.innerHTML = ui.fail(err.message); loi(err, 'xem trước câu hỏi'); });
        return f;
    };

    /* ---------- Nhập câu hỏi tạm từ tệp ----------------------------------- */
    /**
     * o = { latex (hiện nút LaTeX), thamSo() → { GroupQuestionDetailId, strQuestionTypeId, MucPheDuyetId }, onDone(kq) }
     * Hộp thoại (nhập từ tệp = việc phụ); hỏi lại trước khi nhập; kq = { ok: Table2, loi: Table1, message }
     */
    N.hopImport = function (o) {
        var body = document.createElement('div');
        body.innerHTML = ui.field('Chọn file Import', ui.file({ key: 'tep', accept: o.latex ? '.doc,.docx,.tex' : '.doc,.docx' })) +
            '<div class="ums-u-faint ums-u-fz13" data-k="bao"></div>';
        var bao = body.querySelector('[data-k="bao"]');
        function chay(dlg, latex) {
            var inp = body.querySelector('input[type="file"]');
            var tep = inp && inp.files && inp.files[0];
            if (!tep) { toast('Bạn chưa chọn file nào!', 'warn'); return false; }
            ui.confirm('Nhập câu hỏi tạm từ tệp "' + tep.name + '"' + (latex ? ' (LaTeX)' : '') + '?', { title: 'Import dữ liệu' }).then(function (yes) {
                if (!yes) return;
                bao.textContent = 'Đang tải tệp lên…';
                return ums.upload(tep, latex ? { ext: ['tex', 'doc', 'docx'] } : undefined).then(function (duong) {
                    bao.textContent = 'Đang nhập…';
                    var c = Object.assign({ NguoiThucHien_Id: uid(), strPath: duong }, o.thamSo());
                    return N.g(NH + (latex ? 'ImportNganHangCauHoi_Temp_LaTeX' : 'ImportNganHangCauHoi_Temp_Doc'), c);
                }).then(function (r) {
                    var d = r.data || {};
                    dlg.close();
                    toast('Đã import dữ liệu: ' + e(r.message));
                    if (o.onDone) o.onDone({ ok: arr(d.Table2), loi: arr(d.Table1), message: e(r.message) });
                }).catch(function (err) { bao.textContent = 'Lỗi: ' + (err.message || ''); loi(err, 'import câu hỏi'); });
            });
            return false;
        }
        var buttons = [{ text: 'Import dữ liệu file doc', kind: 'importer', keepOpen: true, onClick: function (dlg) { return chay(dlg, false); } }];
        if (o.latex) buttons.push({ text: 'Import dữ liệu file LaTeX', kind: 'importer', keepOpen: true, onClick: function (dlg) { return chay(dlg, true); } });
        return ui.dialog({ title: 'Import dữ liệu', icon: 'fa-cloud-arrow-up', size: 'md', body: body, buttons: buttons });
    };
    /** Kết quả import: hai tab (thành công / lỗi), bảng cột theo khoá dòng đầu (như gốc genTable_Import_View) */
    N.ketQuaImport = function (host, kq) {
        var body = document.createElement('div');
        var tabs = [{ key: 'ok', text: '1) Kết quả import thành công (' + kq.ok.length + ')', icon: 'fa-circle-check' },
            { key: 'loi', text: '2) Kết quả import lỗi (' + kq.loi.length + ')', icon: 'fa-triangle-exclamation' }];
        body.innerHTML = ui.tabs(tabs, 'ok', 'data-tab') + '<div data-k="ok"></div><div data-k="loi" hidden></div>';
        function bang(el, ds) {
            if (!ds.length) { el.innerHTML = ui.empty('Không có dòng nào'); return; }
            var keys = Object.keys(ds[0]);
            ui.table({ el: el, rows: ds, columns: keys.map(function (k) { return { title: k, render: function (r) { return ui.escBr(r[k]); } }; }) });
        }
        bang(body.querySelector('[data-k="ok"]'), kq.ok);
        bang(body.querySelector('[data-k="loi"]'), kq.loi);
        body.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-tab]'); if (!a) return;
            var k = a.getAttribute('data-tab');
            ui.tabsActive(body, k, 'data-tab');
            body.querySelector('[data-k="ok"]').hidden = k !== 'ok';
            body.querySelector('[data-k="loi"]').hidden = k !== 'loi';
        });
        return pat.formTrang({ host: host, title: 'Import câu hỏi tạm', icon: 'fa-cloud-arrow-up', cols: 1, flush: false, body: body, buttons: [] });
    };
    /** Tải mẫu tệp doc theo loại câu hỏi: ApisQuanLyThiTracNghiem/Modules/Template/Template<CODE>.docx (thư mục gốc chữ thường "modules") */
    N.taiMau = function (loai) {
        if (!loai || !e(loai.CODE)) { toast('Chưa chọn loại câu hỏi cần xuất mẫu', 'warn'); return; }
        window.open(new URL('../ApisQuanLyThiTracNghiem/modules/Template/Template' + e(loai.CODE) + '.docx', location.href).href, '_blank');
    };

    /* ---------- Báo cáo kiểu riêng của màn (strTuKhoa / strDuLieu nối dấu phẩy) ---------- */
    N.baoCao = function (cap) {
        var keys = [], vals = [];
        cap.forEach(function (p) { keys.push(p[0]); vals.push(e(p[1])); });
        return ums.api.call({ action: 'SYS_Report/ThemMoi', method: 'POST', strTuKhoa: keys.join(','), strDuLieu: vals.join(','), strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var id = e(r.message);
                if (!id) { toast('Chưa lấy được dữ liệu báo cáo!', 'warn'); return; }
                var goc = (ums.session && ums.session.rootPathReport) || '';
                if (!goc) { toast('Thiếu đường dẫn báo cáo (rootPathReport)', 'warn'); return; }
                location.href = goc + '?id=' + id;
            }).catch(function (err) { loi(err, 'báo cáo'); });
    };

    /* ---------- Tệp âm thanh đính kèm (QLTTN_Files) ---------------------- */
    /**
     * Khối tệp âm thanh của nhóm / câu hỏi: tải lên bằng ums.files.mount (API QLTTN_Files, thư mục con theo gốc) + bảng
     * <audio controls> có nút Xóa (gốc: tblAudioFiles / tblQuestionAudioFiles, QLTTN_Files/Xoa strIds).
     * o = { el, folder: 'Audio' | 'QuestionAudio', view } → { load(id), save(id), clear() }
     */
    N.khoiAudio = function (o) {
        o.el.innerHTML = '<div data-k="tep"></div><div data-k="bang" class="ums-u-mt-3"></div>';
        var tep = ums.files.mount(o.el.querySelector('[data-k="tep"]'), { api: 'QLTTN_Files', folder: o.folder, readonly: !!o.view });
        var bang = o.el.querySelector('[data-k="bang"]');
        var idHienTai = '';
        function ve(rows) {
            ui.table({
                el: bang, rows: rows, empty: 'Chưa có tệp âm thanh',
                columns: [
                    { title: 'File', render: function (r) { return '<audio controls preload="none" title="' + ui.esc(e(r.TENHIENTHI)) + '" src="' + ui.esc(ums.files.url(e(r.DUONGDAN || r.FILEMINHCHUNG))) + '"></audio>'; } },
                    { title: 'Tên file', prop: 'TENHIENTHI' },
                    { title: 'Thao tác', cls: 'is-actions is-center', render: function (r) { return o.view ? '' : ui.iconBtn('del', e(r.ID)); } }
                ]
            });
        }
        bang.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-act="del"]'); if (!b) return;
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                return N.g('QLTTN_Files/Xoa', { strIds: b.getAttribute('data-id'), strNguoiThucHien_Id: uid() }, true).then(function () { toast('Xóa dữ liệu thành công!'); api.load(idHienTai); });
            }).catch(function (err) { loi(err, 'xoá tệp'); });
        });
        var api = {
            load: function (id) {
                idHienTai = e(id);
                tep.load(idHienTai);
                if (!idHienTai) { ve([]); return Promise.resolve(); }
                return N.g('QLTTN_Files/LayDanhSach', { strDuLieu_Id: idHienTai }).then(function (r) { ve(arr(r.data)); }).catch(function (err) { bang.innerHTML = ui.fail(err.message); });
            },
            save: function (id) { return tep.save(id).then(function () { return api.load(id); }); },
            clear: function () { idHienTai = ''; tep.clear(); ve([]); }
        };
        ve([]);
        return api;
    };
})();
