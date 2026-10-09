/* =========================================================================
   _qlt_chung.js — tầng chung của màn "Quản lý thi" (Quản lý thi trắc nghiệm): ums.qlt.*
   Dùng cho quanlythi.js + các khung con _qlt_phong.js, _qlt_import.js, _qlt_chitiet.js.
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlythi/script/quanlythi.js (5.755 dòng) — các khối chép nhau giữa
   "tạo đề cho MỘT phòng" (zoneTaoDeThi) và "khởi tạo đề cho CÁC phòng đã đánh dấu" (zoneKhoiTaoDeChoCacPhongThi):
   nhóm câu hỏi → cấu trúc đề → bảng đề thi có sẵn (chọn một) / bảng cấu trúc đề; báo cáo SYS_Report với mã xác nhận.
   Xây trên ums.coiThi (ApisCongCanBo/Modules/coithi/script/_phongthi.js).
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, không func, không iM, GET trừ khi ghi POST; tham số chép nguyên):
     QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion  versionAPI, strDepartorganId, strStatus '1', strTuKhoa '', strNguoiDung_Id,
                                                     PageNumber 1, ItemPerPage 10000000 → ID, GROUPQUESTIONNAMECODE, GROUPQUESTIONNAME
     QLTTN_QuanLyBoDe/LayDS_ExamStruct               versionAPI, strDepartorganId, strGroupQuestionId, strStatus "1", strTuKhoa '',
                                                     strNguoiDung_Id, PageNumber 1, ItemPerPage 100000000 → ID, NAME
     QLTTN_QuanLyBoDe/LayDS_WritenExam               versionAPI, strExamStructId → ID, NAME, SODETAO
     QLTTN_QuanLyBoDe/LayDS_CauTrucDeThi             versionAPI, strExamStructId → GROUPQUESTIONDETAILNAME, TEN_CHONMOTTRONGCACNHOM,
                                                     SONHOMCON, LEVELQUESTIONNAME, SOCAUTRONGNGANHANGCAUHOI, NUMBERQUESTION
     QLTTN_QuanLyBoDe/LayDS_DeThiThuCong             versionAPI, strDepartorganId, strGroupQuestionId, strStatus '1', strTuKhoa '',
                                                     strNguoiDung_Id, PageNumber 1, ItemPerPage 100000000 → ID, NAME, SODETAO, EXAMSTRUCTID
     SYS_Report/ThemMoi (POST)                        strTuKhoa / strDuLieu = chuỗi nối phẩy các khoá / giá trị (kiểu riêng của màn):
                                                     BAOCAOLOCTHEODULIEU, ExamRoomInfo_Id, ExamstructPartId, strReportCode,
                                                     strNguoiDangNhap_Id, tokenJWT, strExamRoomInfoIds (nối ';'); strNguoiThucHien_Id
                                                     → Message = id → mở <edu.system.rootPathReport>?id=… (ums.coiThi.gocBaoCao)
   Khác gốc:
     · Hộp "Nhập mật mã xác nhận" (báo cáo điểm các phần thi — ảnh hưởng thí sinh đang làm bài): gốc hiện modal rồi `return`,
       bấm "Xác nhận" gọi lại report() → nay hỏi bằng ui.dialog, sai mã thì báo "Sai mã xác nhận" và giữ hộp.
     · Mọi lệnh tạo đề hỏi lại bằng ui.confirm (gốc gắn $("#btnYes").click chồng lên nhau mỗi lần hỏi → bấm lần sau chạy cả lệnh trước).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }
    var Q = ums.qlt = ums.qlt || {};
    var NH = 'QLTTN_QuanLyNganHangCauHoi/', BD = 'QLTTN_QuanLyBoDe/';
    Q.NH = NH; Q.BD = BD;

    /** Trạng thái dùng chung giữa danh sách và chi tiết (bản gốc: thuộc tính của QuanLyThi) */
    Q.tt = { roomId: '', partId: '', nhomDuLieu: '', phong: [] };

    /* ---------- Danh mục tạo đề ------------------------------------------ */
    Q.nhomCauHoi = function (dvId) {
        return g(NH + 'LayDS_GroupQuestion', { versionAPI: V, strDepartorganId: dvId, strStatus: '1', strTuKhoa: '', strNguoiDung_Id: P.uid(),
            PageNumber: 1, ItemPerPage: 10000000 }).then(function (r) { return arr(r.data); });
    };
    Q.cauTrucDe = function (dvId, nhomId) {
        return g(BD + 'LayDS_ExamStruct', { versionAPI: V, strDepartorganId: dvId, strGroupQuestionId: nhomId, strStatus: '1', strTuKhoa: '',
            strNguoiDung_Id: P.uid(), PageNumber: 1, ItemPerPage: 100000000 }).then(function (r) { return arr(r.data); });
    };
    Q.deThiCoSan = function (structId) {
        return g(BD + 'LayDS_WritenExam', { versionAPI: V, strExamStructId: structId }).then(function (r) { return arr(r.data); });
    };
    Q.cauTrucDeThi = function (structId) {
        return g(BD + 'LayDS_CauTrucDeThi', { versionAPI: V, strExamStructId: structId }).then(function (r) { return arr(r.data); });
    };
    Q.deThiThuCong = function (dvId, nhomId) {
        return g(BD + 'LayDS_DeThiThuCong', { versionAPI: V, strDepartorganId: dvId, strGroupQuestionId: nhomId, strStatus: '1', strTuKhoa: '',
            strNguoiDung_Id: P.uid(), PageNumber: 1, ItemPerPage: 100000000 }).then(function (r) { return arr(r.data); });
    };

    /* ---------- Bảng dùng chung ------------------------------------------ */
    /** Bảng đề thi (có sẵn / thủ công): Tên đề thi · Số đề tạo · chọn MỘT (radio data-de, tên nhóm `ten`) */
    Q.bangDe = function (el, rows, ten) {
        ui.table({ el: el, rows: rows, empty: 'Chưa có đề thi', columns: [
            { title: 'Tên đề thi', prop: 'NAME' },
            { title: 'Số đề tạo', prop: 'SODETAO', cls: 'is-center' },
            { title: 'Chọn', cls: 'is-center', width: '60px', render: function (r) {
                return '<input type="radio" name="' + esc(ten) + '" data-de="' + esc(r.ID) + '">';
            } }
        ] });
    };
    Q.deChon = function (el) {
        var r = el.querySelector('input[data-de]:checked');
        return r ? r.getAttribute('data-de') : '';
    };
    /** Bảng cấu trúc đề: Tên · Loại câu hỏi (chọn N trong nhóm) · Mức độ · Số câu trong NHCH · Số câu lấy ra */
    Q.bangCauTruc = function (el, rows) {
        ui.table({ el: el, rows: rows, empty: 'Chọn cấu trúc đề để xem', columns: [
            { title: 'Tên', prop: 'GROUPQUESTIONDETAILNAME' },
            { title: 'Loại câu hỏi', render: function (r) {
                if (e(r.TEN_CHONMOTTRONGCACNHOM) === '') return esc(e(r.GROUPQUESTIONDETAILNAME));
                return 'Chọn <b class="qlt-do">' + esc(e(r.SONHOMCON)) + '</b> trong nhóm:<br><span class="qlt-xanh">' + esc(e(r.TEN_CHONMOTTRONGCACNHOM)) + '</span>';
            } },
            { title: 'Mức độ', prop: 'LEVELQUESTIONNAME', cls: 'is-center' },
            { title: 'Số câu trong NHCH', prop: 'SOCAUTRONGNGANHANGCAUHOI', cls: 'is-center' },
            { title: 'Số câu lấy ra', prop: 'NUMBERQUESTION', cls: 'is-center' }
        ] });
    };

    /* ---------- Khung "Khởi tạo đề": hai tab ----------------------------- */
    /**
     * host: phần tử chứa; o = { dvId (đơn vị lấy nhóm câu hỏi / cấu trúc đề), tenNhom (cột tên nhóm — GROUPQUESTIONNAMECODE),
     *   coSan(structId, writenId) · ngauNhien(structId) · cungDe(structId) → Promise (lệnh của màn gọi, màn tự báo kết quả) }
     * Bản gốc: hai tab TẠO ĐỀ TỪ ĐỀ THI CÓ SẴN / TẠO ĐỀ THEO CẤU TRÚC ĐỀ, mỗi tab Nhóm câu hỏi → Cấu trúc đề (nối tầng) → bảng.
     */
    Q.khungTaoDe = function (host, o) {
        var tenNhom = o.tenNhom || 'GROUPQUESTIONNAMECODE';
        function pane(k) {
            return '<div class="qlt-pane" data-qpane="' + k + '"' + (k === 'cautruc' ? ' hidden' : '') + '>' +
                '<div class="ums-grid ums-grid--2">' +
                '<div class="ums-field"><select class="ums-select" data-q="nhom-' + k + '" data-ph="Chọn nhóm câu hỏi"><option value="">Chọn nhóm câu hỏi</option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-q="ct-' + k + '" data-ph="Chọn cấu trúc đề"><option value="">Chọn cấu trúc đề</option></select></div></div>' +
                '<div class="ums-u-mt-3" data-q="bang-' + k + '"></div>' +
                '<div class="ums-row ums-u-mt-3 qlt-nut">' + (k === 'cosan' ?
                    ui.btn('save', { text: 'Thực hiện khởi tạo', icon: 'fa-wand-magic-sparkles', mod: 'primary', attr: { 'data-q': 'chay-cosan' } }) :
                    ui.btn('save', { text: 'Khởi tạo đề thi ngẫu nhiên', icon: 'fa-shuffle', mod: 'primary', attr: { 'data-q': 'chay-ngaunhien' } }) +
                    ui.btn('save', { text: 'Khởi tạo cùng 1 đề(Thứ tự câu hỏi/đáp án ngẫu nhiên)', icon: 'fa-sliders', mod: 'primary', attr: { 'data-q': 'chay-cungde' } })) +
                '</div></div>';
        }
        host.innerHTML = ui.tabs([{ key: 'cosan', text: 'Tạo đề từ đề thi có sẵn', icon: 'fa-file-lines' },
            { key: 'cautruc', text: 'Tạo đề theo cấu trúc đề', icon: 'fa-sitemap' }], 'cosan', 'data-qtab') + pane('cosan') + pane('cautruc');
        ui.enhance(host);
        function q(k) { return host.querySelector('[data-q="' + k + '"]'); }

        ['cosan', 'cautruc'].forEach(function (k) {
            var nhom = q('nhom-' + k), ct = q('ct-' + k), bang = q('bang-' + k);
            if (k === 'cosan') Q.bangDe(bang, [], 'qlt-de-' + k); else Q.bangCauTruc(bang, []);
            Q.nhomCauHoi(o.dvId).then(function (ds) { pat.fill(nhom, ds, { name: tenNhom, head: 'Chọn nhóm câu hỏi' }); })
                .catch(function (err) { ums.api.handle(err, 'nhóm câu hỏi'); });
            if (!window.jQuery) return;
            jQuery(nhom).on('select2:select', function () {
                if (k === 'cosan') Q.bangDe(bang, [], 'qlt-de-' + k); else Q.bangCauTruc(bang, []);
                if (!nhom.value) return;
                Q.cauTrucDe(o.dvId, nhom.value).then(function (ds) { pat.fill(ct, ds, { name: 'NAME', head: 'Chọn cấu trúc đề' }); })
                    .catch(function (err) { ums.api.handle(err, 'cấu trúc đề'); });
            });
            jQuery(ct).on('select2:select select2:clear', function () {
                if (!ct.value) { if (k === 'cosan') Q.bangDe(bang, [], 'qlt-de-' + k); else Q.bangCauTruc(bang, []); return; }
                bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                (k === 'cosan' ? Q.deThiCoSan(ct.value).then(function (ds) { Q.bangDe(bang, ds, 'qlt-de-' + k); })
                    : Q.cauTrucDeThi(ct.value).then(function (ds) { Q.bangCauTruc(bang, ds); }))
                    .catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'đề thi'); });
            });
            pat.chain([nhom, ct]);
        });

        host.addEventListener('click', function (ev) {
            var tab = ev.target.closest('[data-qtab]');
            if (tab && host.contains(tab)) {
                var key = tab.getAttribute('data-qtab');
                ui.tabsActive(host, key, 'data-qtab');
                Array.prototype.forEach.call(host.querySelectorAll('[data-qpane]'), function (p) { p.hidden = p.getAttribute('data-qpane') !== key; });
                return;
            }
            var b = ev.target.closest('button[data-q^="chay-"]');
            if (!b || !host.contains(b)) return;
            var k = b.getAttribute('data-q').slice(5);
            if (k === 'cosan') {
                var de = Q.deChon(q('bang-cosan')), ctId = q('ct-cosan').value;
                if (!de) { ui.toast('Bạn chưa chọn đề để tạo?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn tạo đề?', { title: 'Khởi tạo đề', ok: 'Tạo đề' }).then(function (yes) { if (yes) o.coSan(ctId, de); });
                return;
            }
            var ct2 = q('ct-cautruc').value;
            if (!ct2) { ui.toast('Bạn chưa chọn cấu trúc đề để tạo?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn tạo đề?', { title: 'Khởi tạo đề', ok: 'Tạo đề' }).then(function (yes) {
                if (yes) (k === 'ngaunhien' ? o.ngauNhien : o.cungDe)(ct2);
            });
        });
    };

    /** Báo lỗi tạo đề như gốc: Data kèm lỗi là id phòng (nối phẩy) → thay bằng tên phòng trong câu báo */
    Q.loiTaoDe = function (err, rooms) {
        var msg = e(err.message), ten = [];
        var ids = typeof err.data === 'string' ? err.data.split(',') : (Array.isArray(err.data) ? err.data : []);
        ids.forEach(function (id) {
            var r = (rooms || []).filter(function (x) { return e(x.ID) === e(id).trim(); })[0];
            if (r) { ten.push(e(r.ROOMNAME)); msg = msg.replace(e(id).trim(), e(r.ROOMNAME)); }
        });
        if (err.expired) { ums.api.handle(err); return; }
        ui.toast('Lỗi khởi tạo phòng thi' + (ten.length ? ': ' + ten.join(', ') : '') + (msg ? ' — ' + msg : ''), 'bad', { timeout: 12000 });
    };

    /* ---------- Báo cáo (hàm report của bản gốc) ------------------------- */
    var CHU = 'ABCDEFGHIJKLMNOPQRSTUVWYabcdefghijklmnopqrstuvwxyz0123456789';
    function maNgauNhien(n) { var s = ''; for (var i = 0; i < n; i++) s += CHU.charAt(Math.floor(Math.random() * CHU.length)); return s; }
    /** Hộp "Nhập mật mã xác nhận" → Promise<boolean> */
    Q.hoiMaXacNhan = function () {
        return new Promise(function (resolve) {
            var ma = maNgauNhien(5), xong = false;
            var dlg = ui.dialog({ title: 'Nhập mật mã xác nhận', icon: 'fa-key', size: 'sm',
                body: '<p class="qlt-do"><b>Khi xuất báo cáo sẽ ảnh hưởng đến thí sinh đang làm bài</b></p>' +
                    '<div class="ums-kv"><span>Mã xác nhận</span><b class="qlt-ma">' + esc(ma) + '</b></div>' +
                    ui.field('Nhập lại mã', '<input class="ums-input" data-q="ma" placeholder="Mã xác nhận" autocomplete="off">', { required: true }),
                buttons: [{ text: 'Xác nhận', kind: 'confirm', keepOpen: true, onClick: function (api) {
                    var v = api.body.querySelector('[data-q="ma"]').value.trim();
                    if (v !== ma) { ui.toast('Sai mã xác nhận', 'warn'); return false; }
                    xong = true; resolve(true); api.close(); return false;
                } }],
                onClose: function () { if (!xong) resolve(false); } });
            setTimeout(function () { var i = dlg.body.querySelector('[data-q="ma"]'); if (i) i.focus(); }, 50);
        });
    };
    /**
     * Chạy báo cáo với bộ khoá của màn. o = { roomId, partId, roomIds (mảng id phòng đã đánh dấu) } — thiếu thì lấy Q.tt.
     * Mẫu BAOCAODIEM_NHIEUPHONG_CACPHANTHI hỏi mã xác nhận trước (như gốc).
     */
    Q.baoCao = function (code, o) {
        o = o || {};
        if (!code) { ui.toast('Bạn chưa chọn mẫu báo cáo', 'warn'); return Promise.resolve(null); }
        var truoc = code === 'BAOCAODIEM_NHIEUPHONG_CACPHANTHI' ? Q.hoiMaXacNhan() : Promise.resolve(true);
        return truoc.then(function (ok) {
            if (!ok) return null;
            var S = ums.session || {};
            var k = ['BAOCAOLOCTHEODULIEU', 'ExamRoomInfo_Id', 'ExamstructPartId', 'strReportCode', 'strNguoiDangNhap_Id', 'tokenJWT', 'strExamRoomInfoIds'];
            var v = [e(Q.tt.nhomDuLieu), e(o.roomId !== undefined ? o.roomId : Q.tt.roomId), e(o.partId !== undefined ? o.partId : Q.tt.partId), code, P.uid(),
                e(S.tokenJWT), (o.roomIds || []).join(';')];
            return g('SYS_Report/ThemMoi', { versionAPI: V, strTuKhoa: k.toString(), strDuLieu: v.toString(), strNguoiThucHien_Id: P.uid() }, true)
                .then(function (r) {
                    if (!r.message) { ui.toast('Chưa lấy được dữ liệu báo cáo!', 'warn'); return null; }
                    var url = P.gocBaoCao() + '?id=' + r.message;
                    if (ums.state && ums.state.mode === 'demo') ui.toast('Dựng thử — trên máy chủ thật sẽ mở: ' + url, 'info', { title: 'Mở báo cáo', timeout: 9000 });
                    else ums.report.navigate(url);
                    return url;
                }).catch(function (err) {
                    if (err.expired) ums.api.handle(err);
                    else ui.toast('Có lỗi xảy ra vui lòng thử lại! ' + (err.message || ''), 'bad');
                    return null;
                });
        });
    };

    /** Đổ khối "Thông tin đề thi" (data-z="de" của ums.coiThi.thongTin) */
    Q.doDe = function (host, de) {
        var z = host.querySelector('[data-z="de"]');
        if (z) z.innerHTML = P.veDe(de || {}, true);
    };

    /** Mục chọn của ô select2 / select thường (tên đang chọn) */
    Q.tenChon = function (sel) {
        var op = sel && sel.options ? sel.options[sel.selectedIndex] : null;
        return op && sel.value ? op.textContent : '';
    };
})();
