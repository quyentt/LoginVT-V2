/* =========================================================================
   Tạo đề thủ công (thi trắc nghiệm)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlybode/html/taodethucong.html + script/taodethucong.js (1.205 dòng)
   Tầng chung: _bode.js (ums.bode) + nạp chéo quanlynganhangcauhoi/_nhch.js (ums.nhch: cây nhóm, bảng câu hỏi, xem trước).
   ---------------------------------------------------------------------------
   Bố cục (bám gốc):
     1. Một cột: thanh lọc Đơn vị → Nhóm câu hỏi → Tình trạng + Tìm kiếm; bảng đề thi thủ công (Tên, Số đề, Nhóm, Trạng thái,
        Sửa, Chi tiết, ô chọn); Tạo mới / Xóa → ums.crud (biểu mẫu thay chỗ danh sách: Đơn vị, Nhóm câu hỏi, Tên, Số đề tạo, Tình trạng).
     2. "Đề thi" thay chỗ cả màn: đầu khung Đơn vị · Bộ đề · Nhóm câu hỏi; ô "Chọn đề thi" (đề thứ 1..Số đề tạo); hai tab
        · Nội dung đề thi — bảng câu hỏi của đề đang chọn (Order sửa trong ô, Nội dung, Đáp án, Số đ/a, Loại, Mức độ, Điểm, Đảo, Trạng thái,
          ô chọn); nút Preview (đề thi — HTML máy chủ dựng, In bài thi), Cập nhật (Order đã sửa), Xóa.
        · Chọn câu hỏi — HAI CỘT: cây nhóm câu hỏi con | bảng câu hỏi trong nhóm (lọc Tình trạng / Loại / Mức độ / từ khoá, SL đã thi,
          ô chọn); nút Preview (câu hỏi đã đánh dấu), "Thêm vào đề thi".
   Lời gọi (QLTTN_QuanLyBoDe/… viết tắt BD/, QLTTN_QuanLyNganHangCauHoi/… NH/; versionAPI 'v1.0'; GET trừ khi ghi POST):
     BD/LayDS_DeThiThuCong           strDepartorganId, strGroupQuestionId, strStatus, strTuKhoa '', strNguoiDung_Id, PageNumber, ItemPerPage
                                     → ID, NAME, SODETAO, GROUPQUESTIONNAME, GROUPQUESTIONID, STATUS, DEPARTORGANNAME, DEPARTORGANID
     BD/Them_DeThiThuCong · Sua_DeThiThuCong (POST)  strId, strName, strSoDeTao, strStatus, strDepartOrganId, strGroupQuestionId, strNguoiThucHien_Id
     BD/Xoa_DeThiThuCong (POST)      strId, strNguoiThucHien_Id
     BD/LayDS_CacDeThi               strSoDeTao → DeThiThu (số thứ tự đề: 1..n)
     BD/LayDS_CauHoiDeThiThuCong     strDeThiThu, strWritenExamId, strNguoiDung_Id, PageNumber, ItemPerPage
                                     → ID, ORDERS, CONTENT, SODAPAN, TENLOAICAUHOI, TENMUCDOCAUHOI, PLUSMARK, MINUSMARK, DAODAPAN, STATUS
     BD/Them_CauHoiDeThiThuCong (POST)   strWritenExamId, strDethithu, strQuestionId, strNguoithuchien_id
     BD/Sua_CauHoiDeThiThuCong (POST)    strId, strOrders, strNguoithuchien_id · BD/Xoa_CauHoiDeThiThuCong (POST) strId, strNguoiThucHien_Id
     BD/gen_DeThiThuCongThu          strWritenExamId, strDeThiThuCongThu → Data = HTML đề thi
     NH/LayDS_GroupQuestionDetail (ums.nhch.nhomCon) · NH/LayDS_CauHoi · NH/LayDS_DapAn_All · NH/LayDS_LoaiCauHoi · NH/LayDS_MucDoCauHoi
     NH/LayDS_PreviewCauHoi (POST, ums.nhch.xemTruoc)
   ---------------------------------------------------------------------------
   Lỗi gốc đã sửa / cố ý khác:
     · Nhóm câu hỏi ở thanh lọc: ô con KHOÁ tới khi chọn Đơn vị (luật cha → con; gốc nạp sẵn mọi nhóm, lọc theo ô Tình trạng — giữ phần lọc).
     · Sửa đề gốc gửi strDepartOrganId = ô lọc Đơn vị (trống nếu chưa lọc) → nay DEPARTORGANID của dòng, không có mới lấy ô lọc.
     · Mọi lệnh hàng loạt (thêm vào đề, xoá, cập nhật Order) chờ xong rồi nạp lại (gốc setTimeout 2 giây), chỉ gửi dòng có thay đổi
       (gốc "Cập nhật" gửi MỌI dòng), hỏi lại bằng ui.confirm (gốc gắn $("#btnYes").click chồng nhau).
     · Nút "Preview" câu hỏi và nút "Tìm kiếm" của tab Chọn câu hỏi gốc KHÔNG có xử lý → chạy theo ý định (xem trước câu hỏi đã đánh dấu bằng
       NH/LayDS_PreviewCauHoi như màn Ngân hàng câu hỏi; tìm theo bộ lọc) — đều là việc ĐỌC.
     · Giữ như gốc (nghi sai): cột Đáp án của tab "Nội dung đề thi" lấy NH/LayDS_DapAn_All với strGroupQuestionDetailId = GROUPQUESTIONID
       (id nhóm LỚN) — máy chủ trả rỗng thì cột trống; tab "Chọn câu hỏi" lấy theo nhóm con (đúng).
     · "Số đề tạo" là ô số (gốc ô chữ). closePhieu() sau khi in không tồn tại → bỏ. "Chi tiết" dùng biểu tượng xem (fa-eye) theo bảng chuẩn.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nhch, B = ums.bode;
    var BD = B.BD, e = B.e, arr = B.arr, uid = B.uid, toast = B.toast, loi = B.loi;
    var root = document.getElementById('qlttn-taodethucong');
    if (!root) return;

    root.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
    var zDs = root.querySelector('[data-z="ds"]'), zCt = root.querySelector('[data-z="ct"]');

    /* =====================================================================
       1. Danh sách đề thi thủ công — ums.crud (một cột như gốc)
       ===================================================================== */
    var crud = ums.crud({
        root: zDs,
        title: 'Tạo đề thủ công', listTitle: 'Danh sách', formTitle: 'đề thi thủ công', icon: 'fa-file-pen',
        addText: 'Tạo mới', removeText: 'Xóa',
        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: B.nguonDonVi() },
            { key: 'gq', type: 'select', label: 'Chọn nhóm câu hỏi', source: { items: [] } },
            { key: 'st', type: 'select', label: 'Tình trạng (Ẩn/Hiện)', source: { items: B.TRANGTHAI } }
        ],
        list: {
            paged: true,
            call: function (f, p) {
                return { action: BD + 'LayDS_DeThiThuCong', method: 'GET', versionAPI: B.V, strDepartorganId: f.dv || '', strGroupQuestionId: f.gq || '',
                    strStatus: f.st || '', strTuKhoa: '', strNguoiDung_Id: uid(), PageNumber: p.index, ItemPerPage: p.size };
            }
        },
        columns: [
            { title: 'Tên', prop: 'NAME' },
            { title: 'Số đề', prop: 'SODETAO', cls: 'is-center', width: '90px' },
            { title: 'Nhóm', prop: 'GROUPQUESTIONNAME', width: '30%' },
            { title: 'Trạng thái', cls: 'is-center', width: '10%', render: function (r) { return B.trangThai(r.STATUS); } }
        ],
        rowActions: [{ icon: 'fa-eye', title: 'Chi tiết', onClick: function (row) { moDeThi(row); } }],
        rowDelete: false, multi: true,
        fields: [
            { key: '_dv', type: 'static', label: 'Đơn vị', get: function (row) { return e(row.DEPARTORGANNAME); } },
            { key: 'strGroupQuestionId', col: 'GROUPQUESTIONID', type: 'select', label: 'Nhóm câu hỏi', required: true, placeholder: 'Chọn nhóm', source: { items: [] } },
            { key: 'strName', col: 'NAME', label: 'Tên', required: true, placeholder: 'Nhập tên đề thi' },
            { key: 'strSoDeTao', col: 'SODETAO', type: 'number', label: 'Số đề tạo', required: true, placeholder: 'Nhập số đề cần tạo' },
            { key: 'strStatus', col: 'STATUS', type: 'select', label: 'Tình trạng', required: true, placeholder: 'Tình trạng (Ẩn/Hiện)', source: { items: B.TRANGTHAI } }
        ],
        save: function (v, row) {
            return { action: BD + (row ? 'Sua_DeThiThuCong' : 'Them_DeThiThuCong'), method: 'POST', versionAPI: B.V, strId: row ? e(row.ID) : '',
                strName: v.strName, strSoDeTao: v.strSoDeTao, strStatus: v.strStatus,
                strDepartOrganId: row ? (e(row.DEPARTORGANID) || loc.dv()) : loc.dv(), strGroupQuestionId: v.strGroupQuestionId, strNguoiThucHien_Id: uid() };
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: BD + 'Xoa_DeThiThuCong', method: 'POST', versionAPI: B.V, strId: id, strNguoiThucHien_Id: uid() }; });
        },
        onForm: function (row) {
            // Đơn vị (chỉ hiện) = đơn vị đang lọc khi thêm (gốc lblDonVi = text của drpDonVi); ô Nhóm đổ theo đơn vị + ô Tình trạng lọc (gốc drpStatus)
            var dvEl = zDs.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="_dv"]');
            if (dvEl && !row) dvEl.textContent = loc.dvTen();
            B.oNhomForm(crud, 'strGroupQuestionId', row ? (e(row.DEPARTORGANID) || loc.dv()) : loc.dv(), loc.st(), 'GROUPQUESTIONNAME', row ? e(row.GROUPQUESTIONID) : '');
        }
    });
    var loc = B.loc(crud, { tenNhom: 'GROUPQUESTIONNAME' });    // gốc: nhóm lọc theo ô Tình trạng (không cố định '1' như Quản lý bộ đề)
    B.chanThem(crud, loc);

    function dongChiTiet() {
        zCt.hidden = true; zCt.innerHTML = ''; zDs.hidden = false;
        crud.load();
    }

    /* =====================================================================
       2. Đề thi của một đề thi thủ công — ô chọn đề + hai tab
       ===================================================================== */
    function moDeThi(row) {
        var S = { id: e(row.ID), gq: e(row.GROUPQUESTIONID), soDe: e(row.SODETAO), de: '', nhomId: '', rows: [], dapAn: {}, page: { index: 1, size: 10, total: 0 } };
        zDs.hidden = true; zCt.hidden = false;
        zCt.innerHTML = pat.panel({
            title: 'Đề thi', icon: 'fa-file-lines', tools: ui.btn('close', { attr: { 'data-k': 'dong' } }),
            body: B.kvDau(row) +
                '<div class="bode-chonde"><select class="ums-select" data-k="de" data-ph="Chọn đề thi"><option value="">Chọn đề thi</option></select></div>'
        }) +
            '<div class="bode-tabs">' + ui.tabs([{ key: 'nd', text: 'Nội dung đề thi', icon: 'fa-list-ol' }, { key: 'chon', text: 'Chọn câu hỏi', icon: 'fa-folder-tree' }], 'nd', 'data-tab') + '</div>' +
            '<div data-z="nd"></div><div data-z="chon" hidden></div>';
        var q = function (k) { return zCt.querySelector('[data-k="' + k + '"]'); };
        var p1 = zCt.querySelector('[data-z="nd"]'), p2 = zCt.querySelector('[data-z="chon"]');
        var selDe = q('de');
        zCt.querySelector('.bode-tabs').addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-tab]'); if (!a) return;
            var k = a.getAttribute('data-tab');
            ui.tabsActive(zCt, k, 'data-tab');
            p1.hidden = k !== 'nd'; p2.hidden = k !== 'chon';
        });

        /* Ô chọn đề thi: đề thứ 1..Số đề tạo (gốc LayDS_CacDeThi, cột DeThiThu vừa là id vừa là tên) */
        B.g(BD + 'LayDS_CacDeThi', { strSoDeTao: S.soDe }).then(function (r) {
            pat.fill(selDe, arr(r.data), { id: 'DeThiThu', name: 'DeThiThu', head: 'Chọn đề' });
        }).catch(function (err) { loi(err, 'danh sách đề'); });
        if (window.jQuery) jQuery(selDe).on('select2:select select2:clear', function () { S.de = selDe.value; S.page.index = 1; taiDe(); });

        /* ---------- Tab 1: Nội dung đề thi ---------- */
        p1.innerHTML = pat.panel({
            title: 'Danh sách câu hỏi của đề thi', icon: 'fa-list-ol', count: 'dem', flush: true,
            tools: ui.btn('view', { text: 'Preview', attr: { 'data-k': 'xemDe', title: 'Xem đề thi đang chọn' } }) +
                ui.btn('save', { text: 'Cập nhật', attr: { 'data-k': 'capNhat', title: 'Lưu Order đã sửa trong bảng' } }) +
                ui.xoaChon('input[data-ck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-k': 'xoaCH' } }),
            body: '<div data-k="bangDe"></div>'
        });
        var bangDe = q('bangDe');
        N.ganChon(bangDe);
        bangDe.innerHTML = ui.empty('Chọn đề thi ở ô phía trên', 'fa-file-lines');
        // Gốc: đáp án lấy một lần theo GROUPQUESTIONID của đề (xem đầu tệp — giữ)
        N.dapAnAll(S.gq).then(function (m) { S.dapAn = m; if (S.de) veDe(); }).catch(function () { S.dapAn = {}; });
        function veDapAn(r) {
            var ds = S.dapAn[e(r.ID)] || S.dapAn[e(r.QUESTIONID)] || [];
            return ds.map(function (a) { return '<div class="nhch-da">' + ui.esc(e(a.ORDERABC)) + N.html(a.CONTENT) + '</div>'; }).join('');
        }
        function veDe() {
            ui.table({
                el: bangDe, rows: S.rows, empty: 'Đề thi chưa có câu hỏi — sang tab "Chọn câu hỏi" để thêm',
                columns: [
                    { title: 'Order', cls: 'is-center', width: '80px', render: function (r) { return '<input class="ums-input bode-stt" data-stt="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(r.ORDERS)) + '">'; } },
                    { title: 'Nội dung câu hỏi', cls: 'nhch-nd', render: function (r) { return '<div class="nhch-html">' + N.html(r.CONTENT) + '</div>'; } },
                    { title: 'Đáp án', cls: 'nhch-nd', render: veDapAn },
                    { title: 'Số đ/a', prop: 'SODAPAN', cls: 'is-center' },
                    { title: 'Loại câu hỏi', prop: 'TENLOAICAUHOI', cls: 'is-center' },
                    { title: 'Mức độ', prop: 'TENMUCDOCAUHOI', cls: 'is-center' },
                    { title: 'Điểm(+/-)', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(e(r.PLUSMARK)) + '/' + ui.esc(e(r.MINUSMARK)); } },
                    { title: 'Đảo đ/a', cls: 'is-center', render: function (r) { return e(r.DAODAPAN) === '1' ? 'Có' : 'Không'; } },
                    { title: 'Trạng thái', cls: 'is-center', render: function (r) { return e(r.STATUS) === '1' ? ui.badge('Đang dùng', 'ok') : ui.badge('Không dùng', 'mute'); } },
                    { head: N.thead(), cls: 'is-center', width: '44px', render: function (r) { return '<input type="checkbox" data-ck="' + ui.esc(e(r.ID)) + '">'; } }
                ],
                page: { index: S.page.index, size: S.page.size, total: S.page.total, sizes: ui.PAGE_SIZES,
                    onChange: function (p) { S.page.index = p; taiDe(); }, onSize: function (s) { S.page.size = s; S.page.index = 1; taiDe(); } }
            });
            var dem = p1.querySelector('[data-z="dem"]');
            if (dem) dem.textContent = S.page.total ? '(' + S.page.total + ')' : '';
            N.toan(bangDe);
            if (ui.demXoaChon) ui.demXoaChon();
        }
        function taiDe() {
            if (!S.de) { S.rows = []; S.page.total = 0; bangDe.innerHTML = ui.empty('Chọn đề thi ở ô phía trên', 'fa-file-lines'); return Promise.resolve(); }
            return B.g(BD + 'LayDS_CauHoiDeThiThuCong', { strDeThiThu: S.de, strWritenExamId: S.id, strNguoiDung_Id: uid(), PageNumber: S.page.index, ItemPerPage: S.page.size })
                .then(function (r) { S.rows = arr(r.data); S.page.total = Number(r.pager) || S.rows.length; veDe(); })
                .catch(function (err) { bangDe.innerHTML = ui.fail(err.message); loi(err, 'câu hỏi của đề thi'); });
        }
        function canDe() { if (!S.de) { toast('Chưa chọn đề thi', 'warn'); return false; } return true; }

        /* ---------- Tab 2: Chọn câu hỏi (cây nhóm con | bảng câu hỏi trong nhóm) ---------- */
        var m2 = B.haiCot(p2, { tieuDeTrai: 'Thông tin', icon: 'fa-folder-tree' });
        var ds = N.dsCauHoi({
            el: m2.mainBody, tieuDe: 'Danh sách câu hỏi trong nhóm', icon: 'fa-database', loc: true, tinhTheoY: false, thaoTac: false, slDaThi: 'so',
            nhomId: function () { return S.nhomId; },
            toolbar: { phai: ui.btn('view', { text: 'Preview', attr: { 'data-k': 'xemCH', title: 'Xem trước các câu hỏi đã đánh dấu' } }) +
                ui.btn('add', { text: 'Thêm vào đề thi', attr: { 'data-k': 'themVaoDe' } }) }
        });
        ds.tai();
        N.nhomCon(S.gq).then(function (kq) {
            if (m2.sideCount) m2.sideCount.textContent = kq.rows.length ? '(' + kq.rows.length + ')' : '';
            N.cay(m2.sideBody, kq.rows, { chon: S.nhomId, onChon: function (id) { S.nhomId = id; ds.tai(1); } });
        }).catch(function (err) { loi(err, 'nhóm câu hỏi'); });

        /* ---------- Sự kiện ---------- */
        zCt.addEventListener('click', function (ev) {
            if (ev.target.closest('.ums-formtrang')) return;
            var b = ev.target.closest('[data-k]'); if (!b || b.tagName !== 'BUTTON') return;
            var k = b.getAttribute('data-k');
            if (k === 'dong') dongChiTiet();
            else if (k === 'xemDe') {
                if (!canDe()) return;
                B.xem(zCt, { title: 'Chi tiết đề thi', call: { action: BD + 'gen_DeThiThuCongThu', strWritenExamId: S.id, strDeThiThuCongThu: S.de } });
            } else if (k === 'capNhat') {
                if (!canDe()) return;
                B.capNhatDong({
                    rows: S.rows, title: 'Cập nhật đề thi', hoi: 'Bạn có chắc chắn cập nhật dữ liệu không?',
                    call: function (r) {
                        var i = bangDe.querySelector('input[data-stt="' + e(r.ID) + '"]');
                        if (!i || i.value === e(r.ORDERS)) return null;
                        return { action: BD + 'Sua_CauHoiDeThiThuCong', method: 'POST', versionAPI: B.V, strId: e(r.ID), strOrders: i.value, strNguoithuchien_id: uid() };
                    },
                    sau: taiDe
                });
            } else if (k === 'xoaCH') {
                B.xoaIds({ ids: N.chon(bangDe), action: BD + 'Xoa_CauHoiDeThiThuCong', sau: taiDe });
            } else if (k === 'themVaoDe') {
                if (!canDe()) return;
                var ids = ds.chon();
                if (!ids.length) { toast('Vui lòng chọn đối tượng cần thêm?', 'warn'); return; }
                ui.confirm('Thêm ' + ids.length + ' câu hỏi đã chọn vào đề thứ ' + S.de + '?', { title: 'Thêm vào đề thi' }).then(function (yes) {
                    if (!yes) return;
                    return ui.batch(ids.map(function (id) {
                        return { action: BD + 'Them_CauHoiDeThiThuCong', method: 'POST', versionAPI: B.V, strWritenExamId: S.id, strDethithu: S.de, strQuestionId: id, strNguoithuchien_id: uid() };
                    }), { title: 'Đang thêm vào đề thi' }).then(function (kq) {
                        toast(kq.fail ? kq.fail + ' câu lỗi: ' + (kq.errors[0] || '') : 'Thực hiện thành công', kq.fail ? 'warn' : 'ok');
                        taiDe();
                    });
                }).catch(function (err) { loi(err, 'thêm vào đề thi'); });
            } else if (k === 'xemCH') {
                var chon = ds.chon();
                if (!chon.length) { toast('Bạn chưa chọn câu hỏi', 'warn'); return; }
                N.xemTruoc({ host: zCt, ids: chon, post: true, title: 'Preview câu hỏi' });
            }
        });
    }
})();
