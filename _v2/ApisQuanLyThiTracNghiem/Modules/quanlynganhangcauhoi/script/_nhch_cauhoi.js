/* =========================================================================
   _nhch_cauhoi.js — biểu mẫu CÂU HỎI (thật / tạm) + khối ĐÁP ÁN và VẾ 2: ums.nhch.formCauHoi, ums.nhch.khoiDapAn
   Bản gốc: zoneCauHoiEdit / zoneChiTietCauHoiEdit_Temp (quanlynganhangcauhoi.html) — một biểu mẫu chép đôi (thật + _Temp),
   màn nhập chép lần ba. Ở đây MỘT mã, cờ `temp`.
   ---------------------------------------------------------------------------
   Lời gọi (NH = QLTTN_QuanLyNganHangCauHoi/, POST, versionAPI v1.0):
     NH/ThemMoi_Question · Sua_Question (tạm: ThemMoi_QuestionTemp · Sua_QuestionTemp)
        strId, strContent (HTML CKEditor), strStatus, strPlusMark, strMinusMark, strGroupQuestionDetailId, strQuestionTypeId, strLevelId,
        strDaoDapAn, strTile '', strOrderNumber, strTinhDiemTheoSoY, strThoiGian, [strMucPheDuyetId — tạm], strNguoiThucHien_Id → raw.Id
     NH/LayDS_AnswerByQuestionId · LayDS_AnswerTempByQuestionId (GET) strQuestionId
        → ID, ORDERS, FIXVITRI, CORRECT, CONTENT, CONTENT2, MARK, ANSWER_SENCONDID ("id1#id2")
     NH/LayDS_Answer_Sencond · LayDS_Answer_SencondTemp (GET) strQuestionId → ID, ORDERS, CONTENT
     NH/ThemMoi_Answer · Sua_Answer (tạm: …AnswerTemp)  strId, strContent, strCorrect, strQuestionId, strContent2, strAnswer_SencondId,
        strSymbol '', strOrders, strFixViTri, strMark, strNguoiThucHien_Id
     NH/ThemMoi_Answer_Sencond · Sua_Answer_Sencond (tạm: …_SencondTemp)  strId, strContent, strQuestionId, strSymbol '', strOrders
     NH/Xoa_Answer · Xoa_AnswerTemp · Xoa_Answer_Sencond · Xoa_Answer_SencondTemp  strId
     QLTTN_Files (âm thanh câu hỏi, thư mục QuestionAudio) — chỉ câu hỏi thật, như gốc.
   ---------------------------------------------------------------------------
   Cột bảng đáp án hiện theo LOẠI câu hỏi (gốc ẩn ô theo chỉ số cột trong getandGenList_Answer):
     BESTANSWER                              Thứ tự · Fix vị trí · Đáp án (chọn một) · Nội dung
     MULTICHOICE · TRUEFALSE · TRUEFALSEONE  Thứ tự · Fix vị trí · Đáp án (đánh dấu) · Nội dung
     FREETEXT                                Thứ tự · Nội dung · Điểm
     CROSSLINK                               Thứ tự · Fix vị trí · Nội dung · Vế 2       (+ khung "Thông tin vế 2")
     FILLTHEBLANK · KEOTHAXUONGDAPAN         Thứ tự · Fix vị trí · Nội dung · Nội dung điền (+ ô "Nội dung điền" khi thêm)
   Lỗi gốc đã sửa:
     · "Lưu đáp án" của TRUEFALSE / TRUEFALSEONE luôn gửi strCorrect = "0" dù bảng có ô đánh dấu đúng (gốc chỉ đọc ô của
       MULTICHOICE / BESTANSWER) → nay đọc ô đánh dấu của mọi loại đang hiện cột đó.
     · "Thêm đáp án" gốc truyền lệch tham số (strDiemDapAn rơi vào strFixViTri, strMark không gửi) → nay strFixViTri '0', strMark ''.
     · Mỗi dòng đáp án gốc tạo sẵn một CKEditor (ẩn) → bảng 10 đáp án = 10 trình soạn thảo; nay bấm "Sửa" ở dòng mới tạo.
     · Vế 2 cho từng dòng gốc gọi LayDS_Answer_Sencond N lần (mỗi dòng một lần) → nay một lần.
   Cột "Vế 2" là ô chọn NHIỀU trong bảng → gắn data-s2 (ô chọn nhiều không có dạng gốc gọn; không phải ô vài mục).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var N = ums.nhch;
    var NH = N.NH, V = N.V, e = N.e, arr = N.arr, uid = N.uid;
    function toast(m, t) { ui.toast(m, t || 'ok'); }
    function loi(err, noi) { ums.api.handle(err, noi); }

    /* ---------- Khối đáp án + vế 2 --------------------------------------- */
    /**
     * o = { el, temp, view, questionId(), typeCode(), onChanged() } → { tai(), huy() }
     */
    N.khoiDapAn = function (o) {
        var host = o.el, rows = [], ve2 = [], eds = {}, edThem = null;
        var T = o.temp ? 'Temp' : '';
        host.innerHTML =
            pat.panel({
                title: 'Thông tin đáp án', icon: 'fa-square-check', cls: 'nhch-dapan',
                tools: o.view ? '' : ui.btn('save', { text: 'Lưu đáp án', attr: { 'data-k': 'luu' } }) + ui.xoaChon('input[data-ck]', { trong: '[data-k="bang"]', text: 'Xóa', attr: { 'data-k': 'xoa' } }),
                flush: true,
                body: '<div data-k="bang"></div>' + (o.view ? '' :
                    '<div class="ums-panel__body nhch-them">' +
                    '<div class="nhch-them__hang">' +
                    '<input class="ums-input ums-input--so" data-k="stt" placeholder="STT" title="STT">' +
                    '<label class="ums-check" data-k="dungBox"><input type="checkbox" data-k="dung"> Đáp án đúng</label>' +
                    '<input class="ums-input" data-k="nd2" placeholder="Nội dung điền" title="Nội dung điền" hidden>' +
                    '</div>' +
                    '<textarea data-k="ed"></textarea>' +
                    '<div class="ums-row--end">' + ui.btn('add', { text: 'Thêm đáp án', attr: { 'data-k': 'them' } }) + '</div></div>')
            }) +
            '<div data-k="ve2" hidden>' + pat.panel({
                title: 'Thông tin vế 2', icon: 'fa-link', cls: 'nhch-ve2',
                tools: o.view ? '' : ui.btn('save', { text: 'Lưu vế 2', attr: { 'data-k': 'luu2' } }) + ui.xoaChon('input[data-ck2]', { trong: '[data-k="bang2"]', text: 'Xóa', attr: { 'data-k': 'xoa2' } }),
                flush: true,
                body: '<div data-k="bang2"></div>' + (o.view ? '' :
                    '<div class="ums-panel__body nhch-them"><div class="nhch-them__hang">' +
                    '<input class="ums-input ums-input--so" data-k="stt2" placeholder="STT" title="STT">' +
                    '<input class="ums-input nhch-them__dai" data-k="nd2b" placeholder="Nội dung vế 2" title="Nội dung vế 2">' +
                    ui.btn('add', { text: 'Thêm vế 2', attr: { 'data-k': 'them2' } }) + '</div></div>')
            }) + '</div>';
        var q = function (k) { return host.querySelector('[data-k="' + k + '"]'); };
        var bang = q('bang'), bang2 = q('bang2');
        N.ganChon(bang); N.ganChon(bang2);
        if (!o.view) ums.editor.tao(q('ed'), { cao: 160 }).then(function (ed) { edThem = ed; });

        function code() { return e(o.typeCode()); }
        function cotHien() {
            var c = code();
            if (c === 'BESTANSWER') return { tt: 1, fix: 1, rdo: 1, nd: 1 };
            if (c === 'MULTICHOICE' || c === 'TRUEFALSE' || c === 'TRUEFALSEONE') return { tt: 1, fix: 1, chk: 1, nd: 1 };
            if (c === 'FREETEXT') return { tt: 1, nd: 1, diem: 1 };
            if (c === 'CROSSLINK') return { tt: 1, fix: 1, nd: 1, ve2: 1 };
            if (c === 'FILLTHEBLANK' || c === 'KEOTHAXUONGDAPAN') return { tt: 1, fix: 1, nd: 1, nd2: 1 };
            return { tt: 1, fix: 1, chk: 1, rdo: 1, nd: 1, ve2: 1, nd2: 1, diem: 1 };
        }
        function huyEds() { Object.keys(eds).forEach(function (k) { eds[k].destroy(); }); eds = {}; }
        function ve() {
            huyEds();
            var h = cotHien(), qid = e(o.questionId()), v = o.view;
            var cols = [{ title: 'Thứ tự', cls: 'is-center', width: '70px', render: function (r) {
                return v ? ui.esc(e(r.ORDERS)) : '<input class="ums-input ums-input--so" data-o="tt" data-id="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(r.ORDERS)) + '">';
            } }];
            if (h.fix) cols.push({ title: 'Fix vị trí', cls: 'is-center', width: '70px', render: function (r) { return '<input type="checkbox" data-o="fix" data-id="' + ui.esc(e(r.ID)) + '"' + (e(r.FIXVITRI) === '1' ? ' checked' : '') + (v ? ' disabled' : '') + '>'; } });
            if (h.chk) cols.push({ title: 'Đáp án', cls: 'is-center', width: '70px', render: function (r) { return '<input type="checkbox" data-o="dung" data-id="' + ui.esc(e(r.ID)) + '"' + (e(r.CORRECT) === '1' ? ' checked' : '') + (v ? ' disabled' : '') + '>'; } });
            if (h.rdo) cols.push({ title: 'Đáp án', cls: 'is-center', width: '70px', render: function (r) { return '<input type="radio" name="nhch_rdo_' + ui.esc(qid) + '" data-o="dung" data-id="' + ui.esc(e(r.ID)) + '"' + (e(r.CORRECT) === '1' ? ' checked' : '') + (v ? ' disabled' : '') + '>'; } });
            cols.push({ title: 'Nội dung đáp án', cls: 'nhch-nd', render: function (r) {
                return '<div class="nhch-html" data-nd="' + ui.esc(e(r.ID)) + '">' + N.html(r.CONTENT) + '</div>' +
                    (v ? '' : '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-sua="' + ui.esc(e(r.ID)) + '" title="Sửa nội dung"><i class="fa-light fa-pen-to-square"></i></button>' +
                    '<div class="nhch-ed" data-ed="' + ui.esc(e(r.ID)) + '" hidden><textarea></textarea></div>');
            } });
            if (h.ve2) cols.push({ title: 'Vế 2', width: '220px', render: function (r) {
                var chon = e(r.ANSWER_SENCONDID).split('#');
                return '<select multiple data-s2 class="ums-select" data-o="ve2" data-id="' + ui.esc(e(r.ID)) + '"' + (v ? ' disabled' : '') + '>' +
                    ve2.map(function (x) { return '<option value="' + ui.esc(e(x.ID)) + '"' + (chon.indexOf(e(x.ID)) >= 0 ? ' selected' : '') + '>' + ui.esc(e(x.CONTENT)) + '</option>'; }).join('') + '</select>';
            } });
            if (h.nd2) cols.push({ title: 'Nội dung điền', width: '180px', render: function (r) { return v ? ui.esc(e(r.CONTENT2)) : '<input class="ums-input" data-o="nd2" data-id="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(r.CONTENT2)) + '">'; } });
            if (h.diem) cols.push({ title: 'Điểm', cls: 'is-center', width: '90px', render: function (r) { return v ? ui.esc(e(r.MARK)) : '<input class="ums-input ums-input--so" data-o="diem" data-id="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(r.MARK)) + '">'; } });
            if (!v) cols.push({ head: N.thead(), cls: 'is-center', width: '44px', render: function (r) { return '<input type="checkbox" data-ck="' + ui.esc(e(r.ID)) + '">'; } });
            ui.table({ el: bang, columns: cols, rows: rows, empty: 'Chưa có đáp án' });
            ui.enhance(bang);
            N.toan(bang);
            // ô thêm mới: Nội dung điền chỉ cho FILLTHEBLANK / KEOTHAXUONGDAPAN; "Đáp án đúng" cho loại có cột đáp án
            if (!v) {
                q('nd2').hidden = !h.nd2;
                q('dungBox').hidden = !(h.chk || h.rdo);
            }
            q('ve2').hidden = !h.ve2;
            if (h.ve2) ve2Bang();
        }
        function ve2Bang() {
            var v = o.view;
            ui.table({
                el: bang2, rows: ve2, empty: 'Chưa có vế 2',
                columns: [
                    { title: 'Thứ tự', cls: 'is-center', width: '70px', render: function (r) { return v ? ui.esc(e(r.ORDERS)) : '<input class="ums-input ums-input--so" data-o2="tt" data-id="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(r.ORDERS)) + '">'; } },
                    { title: 'Nội dung vế 2', render: function (r) { return v ? ui.esc(e(r.CONTENT)) : '<input class="ums-input" data-o2="nd" data-id="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(r.CONTENT)) + '">'; } }
                ].concat(v ? [] : [{ head: N.thead(), cls: 'is-center', width: '44px', render: function (r) { return '<input type="checkbox" data-ck2="' + ui.esc(e(r.ID)) + '">'; } }])
            });
        }
        function oDong(id, k) { return bang.querySelector('[data-o="' + k + '"][data-id="' + id + '"]'); }
        function giaTri(r) {
            var id = e(r.ID), h = cotHien();
            var c = { strId: id, strQuestionId: e(o.questionId()), strSymbol: '', strNguoiThucHien_Id: uid() };
            var tt = oDong(id, 'tt'); c.strOrders = tt ? tt.value : e(r.ORDERS);
            var fix = oDong(id, 'fix'); c.strFixViTri = h.fix ? (fix && fix.checked ? '1' : '0') : e(r.FIXVITRI);
            var dung = oDong(id, 'dung'); c.strCorrect = (h.chk || h.rdo) ? (dung && dung.checked ? '1' : '0') : '0';
            c.strContent = eds[id] ? eds[id].get() : e(r.CONTENT);
            var nd2 = oDong(id, 'nd2'); c.strContent2 = h.nd2 ? (nd2 ? nd2.value : '') : e(r.CONTENT2);
            var diem = oDong(id, 'diem'); c.strMark = h.diem ? (diem ? diem.value : '') : e(r.MARK);
            var v2 = oDong(id, 've2');
            c.strAnswer_SencondId = h.ve2 && v2 ? Array.prototype.map.call(v2.selectedOptions, function (op) { return op.value; }).join('#') : e(r.ANSWER_SENCONDID);
            return c;
        }
        function thayDoi() { if (o.onChanged) o.onChanged(); }

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k],[data-sua]');
            if (!b || !host.contains(b) || o.view) return;
            if (b.hasAttribute('data-sua')) {
                var id = b.getAttribute('data-sua'), box = bang.querySelector('[data-ed="' + id + '"]');
                if (!box) return;
                if (!eds[id]) {
                    var r = rows.filter(function (x) { return e(x.ID) === id; })[0];
                    box.hidden = false;
                    ums.editor.tao(box.querySelector('textarea'), { cao: 160 }).then(function (ed) { eds[id] = ed; ed.set(r ? r.CONTENT : ''); });
                } else box.hidden = !box.hidden;
                return;
            }
            var k = b.getAttribute('data-k');
            if (k === 'luu') luuTatCa();
            else if (k === 'xoa') xoaChon(N.chon(bang), 'Xoa_Answer' + T, api.tai);
            else if (k === 'them') them();
            else if (k === 'luu2') luuVe2();
            else if (k === 'xoa2') xoaChon(Array.prototype.filter.call(bang2.querySelectorAll('tbody input[data-ck2]'), function (c) { return c.checked; }).map(function (c) { return c.getAttribute('data-ck2'); }), 'Xoa_Answer_Sencond' + T, api.tai);
            else if (k === 'them2') themVe2();
        });

        function luuTatCa() {
            if (!rows.length) { toast('Chưa có đáp án để lưu', 'info'); return; }
            ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { title: 'Lưu đáp án' }).then(function (yes) {
                if (!yes) return;
                var calls = rows.map(function (r) { return Object.assign({ action: NH + 'Sua_Answer' + T, method: 'POST', versionAPI: V }, giaTri(r)); });
                return ui.batch(calls, { title: 'Đang lưu đáp án' }).then(function (kq) {
                    toast(kq.fail ? kq.fail + ' đáp án lỗi' : 'Thực hiện thành công', kq.fail ? 'warn' : 'ok');
                    api.tai(); thayDoi();
                });
            });
        }
        function them() {
            var qid = e(o.questionId());
            if (!qid) { toast('Chưa chọn câu hỏi', 'warn'); return; }
            var c = { strId: '', strContent: edThem ? edThem.get() : q('ed').value, strCorrect: q('dung').checked ? '1' : '0', strQuestionId: qid,
                strContent2: q('nd2').value, strAnswer_SencondId: '', strSymbol: '', strOrders: q('stt').value, strFixViTri: '0', strMark: '', strNguoiThucHien_Id: uid() };
            N.g(NH + 'ThemMoi_Answer' + T, c, true).then(function () {
                q('stt').value = ''; q('nd2').value = ''; q('dung').checked = false;
                if (edThem) edThem.set(''); else q('ed').value = '';
                toast('Thực hiện thành công');
                api.tai(); thayDoi();
            }).catch(function (err) { loi(err, 'thêm đáp án'); });
        }
        function xoaChon(ids, action, sau) {
            if (!ids.length) { toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            N.hangLoat({ ids: ids, action: NH + action, hoi: 'Bạn có chắc chắn xóa ' + ids.length + ' dòng không?', title: 'Xóa', ok: 'Xóa dữ liệu thành công!', sau: function () { sau(); thayDoi(); } });
        }
        function luuVe2() {
            if (!ve2.length) { toast('Chưa có vế 2 để lưu', 'info'); return; }
            ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { title: 'Lưu vế 2' }).then(function (yes) {
                if (!yes) return;
                var calls = ve2.map(function (r) {
                    var tt = bang2.querySelector('[data-o2="tt"][data-id="' + e(r.ID) + '"]'), nd = bang2.querySelector('[data-o2="nd"][data-id="' + e(r.ID) + '"]');
                    return { action: NH + 'Sua_Answer_Sencond' + T, method: 'POST', versionAPI: V, strId: e(r.ID), strContent: nd ? nd.value : e(r.CONTENT),
                        strQuestionId: e(o.questionId()), strSymbol: '', strOrders: tt ? tt.value : e(r.ORDERS), strNguoiThucHien_Id: uid() };
                });
                return ui.batch(calls, { title: 'Đang lưu vế 2' }).then(function (kq) {
                    toast(kq.fail ? kq.fail + ' dòng lỗi' : 'Thực hiện thành công', kq.fail ? 'warn' : 'ok');
                    api.tai(); thayDoi();
                });
            });
        }
        function themVe2() {
            var qid = e(o.questionId());
            if (!qid) { toast('Chưa chọn câu hỏi', 'warn'); return; }
            if (!q('nd2b').value.trim()) { toast('Nhập nội dung vế 2', 'warn'); return; }
            N.g(NH + 'ThemMoi_Answer_Sencond' + T, { strId: '', strContent: q('nd2b').value, strQuestionId: qid, strSymbol: '', strOrders: q('stt2').value, strNguoiThucHien_Id: uid() }, true)
                .then(function () { q('stt2').value = ''; q('nd2b').value = ''; toast('Thực hiện thành công'); api.tai(); thayDoi(); })
                .catch(function (err) { loi(err, 'thêm vế 2'); });
        }

        var api = {
            tai: function () {
                var qid = e(o.questionId());
                if (!qid) { rows = []; ve2 = []; ve(); return Promise.resolve(); }
                return Promise.all([
                    N.g(NH + 'LayDS_Answer' + (o.temp ? 'TempByQuestionId' : 'ByQuestionId'), { strQuestionId: qid }),
                    N.g(NH + 'LayDS_Answer_Sencond' + T, { strQuestionId: qid })
                ]).then(function (kq) { rows = arr(kq[0].data); ve2 = arr(kq[1].data); ve(); })
                  .catch(function (err) { bang.innerHTML = ui.fail(err.message); loi(err, 'đáp án'); });
            },
            huy: function () { huyEds(); if (edThem) edThem.destroy(); }
        };
        return api;
    };

    /* ---------- Biểu mẫu câu hỏi ------------------------------------------ */
    /**
     * o = { host, temp, view, nhomId, row (sửa) | null, thamSo() → tham số thêm khi lưu (strMucPheDuyetId), onSaved(id), onChanged(), onClose(),
     *       audio (khối tệp âm thanh — câu hỏi thật), previewPost (LayDS_PreviewCauHoi gọi POST — màn nhập gốc gọi GET) }
     * Lưu xong Ở LẠI biểu mẫu, khoá Loại câu hỏi, hiện khối đáp án (như gốc).
     */
    N.formCauHoi = function (o) {
        var T = o.temp ? 'Temp' : '';
        var qid = o.row ? e(o.row.ID) : '';
        var loai = [], typeCode = o.row ? e(o.row.QUESTIONTYPECODE) : '';
        var body = document.createElement('div');
        body.className = 'nhch-form';
        var dis = o.view ? ' disabled' : '';
        body.innerHTML =
            ui.field('Nội dung câu hỏi', '<textarea data-k="nd"' + dis + '></textarea>', { required: true }) +
            '<div class="ums-grid ums-grid--2 nhch-form__luoi">' +
            ui.field('STT', '<input class="ums-input ums-input--so" data-k="stt"' + dis + '>') +
            ui.field('Loại câu hỏi', '<select class="ums-select" data-k="loai" data-ph="--Chọn loại câu hỏi--"' + dis + '><option value="">--Chọn loại câu hỏi--</option></select>', { required: true }) +
            ui.field('Đảo đáp án', '<select class="ums-select" data-k="dao" data-ph="---Chọn đảo/không đảo đáp án---"' + dis + '><option value="">---Chọn đảo/không đảo đáp án---</option></select>', { required: true }) +
            ui.field('Mức độ', '<select class="ums-select" data-k="muc" data-ph="--Chọn mức độ--"' + dis + '><option value="">--Chọn mức độ--</option></select>', { required: true }) +
            ui.field('Điểm cộng', '<input class="ums-input ums-input--so" data-k="cong"' + dis + '>', { required: true }) +
            ui.field('Điểm trừ', '<input class="ums-input ums-input--so" data-k="tru"' + dis + '>') +
            ui.field('Thời gian (giây)', '<input class="ums-input ums-input--so" data-k="tg"' + dis + '>') +
            ui.field('Trạng thái', '<select class="ums-select" data-k="tt" data-ph="---Chọn trạng thái---"' + dis + '><option value="">---Chọn trạng thái---</option></select>', { required: true }) +
            '<div><label class="ums-check"><input type="checkbox" data-k="soy"' + dis + '> Tính điểm theo số ý</label></div>' +
            '</div>' +
            (o.audio ? '<div class="ums-legend ums-legend--cach">Tệp âm thanh</div><div data-k="audio"></div>' : '') +
            '<div data-k="dapan" class="nhch-form__dapan" hidden></div>';
        var q = function (k) { return body.querySelector('[data-k="' + k + '"]'); };
        var buttons = [];
        if (!o.view) {
            if (!o.temp) buttons.push({ text: 'Preview', kind: 'view', icon: 'fa-eye', keepOpen: true, onClick: function () { xemTruoc(); } });
            buttons.push({ text: 'Lưu câu hỏi', kind: 'save', keepOpen: true, onClick: function () { luu(); } });
        } else buttons.push({ text: 'Preview', kind: 'view', icon: 'fa-eye', keepOpen: true, onClick: function () { xemTruoc(); } });
        var f = pat.formTrang({
            host: o.host, title: (o.view ? 'Xem câu hỏi' : 'Câu hỏi') + (o.temp ? ' tạm' : ''), icon: 'fa-circle-question', cols: 1, body: body, buttons: buttons,
            onClose: function () { if (ed) ed.destroy(); if (da) da.huy(); if (o.onClose) o.onClose(); }
        });
        var ed = null, da = null, audio = null;
        pat.fill(q('dao'), N.DAO, { head: '---Chọn đảo/không đảo đáp án---' });
        pat.fill(q('tt'), N.TT_CAUHOI, { head: '---Chọn trạng thái---' });
        ums.editor.tao(q('nd'), { cao: 240 }).then(function (x) { ed = x; if (o.row) ed.set(o.row.CONTENT); });
        Promise.all([N.loaiCauHoi(), N.mucDo()]).then(function (kq) {
            loai = kq[0];
            pat.fill(q('loai'), loai, { name: 'NAME', head: '--Chọn loại câu hỏi--' });
            pat.fill(q('muc'), kq[1], { name: 'NAME', head: '--Chọn mức độ--' });
            if (o.row) {
                q('loai').value = e(o.row.QUESTIONTYPEID);
                q('muc').value = e(o.row.QUESTIONLEVELID);
                if (window.jQuery) jQuery(q('loai')).add(q('muc')).trigger('change.select2');
            }
            khoaLoai();
        }).catch(function (err) { loi(err, 'danh mục câu hỏi'); });
        if (o.row) {
            q('stt').value = e(o.row.ORDERNUMBER);
            q('cong').value = e(o.row.PLUSMARK);
            q('tru').value = e(o.row.MINUSMARK);
            q('tg').value = e(o.row.THOIGIAN);
            q('tt').value = e(o.row.STATUS);
            q('dao').value = e(o.row.DAODAPAN);
            q('soy').checked = e(o.row.TINHDIEMTHEOSOY) === '1';
            if (window.jQuery) jQuery(q('tt')).add(q('dao')).trigger('change.select2');
        }
        if (o.audio) { audio = N.khoiAudio({ el: q('audio'), folder: 'QuestionAudio', view: o.view }); audio.load(qid); }
        if (window.jQuery) jQuery(q('loai')).on('select2:select select2:clear', function () {
            var r = loai.filter(function (x) { return e(x.ID) === q('loai').value; })[0];
            typeCode = r ? e(r.CODE) : '';
            if (da) da.tai();
        });
        // Đang sửa: không đổi loại câu hỏi (gốc disabled ô chọn khi đã có id)
        function khoaLoai() { q('loai').disabled = !!qid || !!o.view; if (window.jQuery) jQuery(q('loai')).trigger('change.select2'); }
        function moDapAn() {
            if (!qid) return;
            q('dapan').hidden = false;
            if (!da) da = N.khoiDapAn({ el: q('dapan'), temp: o.temp, view: o.view, questionId: function () { return qid; }, typeCode: function () { return typeCode; },
                onChanged: function () { if (o.onChanged) o.onChanged(); } });
            da.tai();
        }
        if (qid) moDapAn();

        function luu() {
            var thieu = [];
            if (!q('loai').value) thieu.push('Loại câu hỏi');
            if (!q('dao').value) thieu.push('Đảo đáp án');
            if (!q('muc').value) thieu.push('Mức độ');
            if (!q('tt').value) thieu.push('Trạng thái');
            if (!q('cong').value.trim()) thieu.push('Điểm cộng');
            if (thieu.length) { toast('Chưa nhập: ' + thieu.join(', '), 'warn'); return; }
            var c = {
                strId: qid, strContent: ed ? ed.get() : q('nd').value, strStatus: q('tt').value, strPlusMark: q('cong').value, strMinusMark: q('tru').value,
                strGroupQuestionDetailId: o.nhomId, strQuestionTypeId: q('loai').value, strLevelId: q('muc').value, strDaoDapAn: q('dao').value, strTile: '',
                strOrderNumber: q('stt').value, strTinhDiemTheoSoY: q('soy').checked ? '1' : '0', strThoiGian: q('tg').value, strNguoiThucHien_Id: uid()
            };
            Object.assign(c, o.thamSo ? o.thamSo() : {});
            N.g(NH + (qid ? 'Sua_Question' + T : 'ThemMoi_Question' + T), c, true).then(function (r) {
                var moi = e(r.raw && (r.raw.Id || r.raw.ID)) || qid;
                qid = moi;
                var lr = loai.filter(function (x) { return e(x.ID) === q('loai').value; })[0];
                typeCode = lr ? e(lr.CODE) : typeCode;
                khoaLoai();
                toast('Thực hiện thành công');
                var p = audio ? audio.save(qid) : Promise.resolve();
                p.then(function () { moDapAn(); if (o.onSaved) o.onSaved(qid); });
            }).catch(function (err) { loi(err, 'lưu câu hỏi'); });
        }
        function xemTruoc() {
            if (!qid) { toast('Lưu câu hỏi trước khi xem trước', 'warn'); return; }
            N.xemTruoc({ host: f.body, ids: [qid], temp: o.temp, post: o.previewPost !== false, title: 'Preview câu hỏi' });
        }
        return f;
    };
})();
