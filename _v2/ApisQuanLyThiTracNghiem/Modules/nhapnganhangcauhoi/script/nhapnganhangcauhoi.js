/* =========================================================================
   Nhập ngân hàng câu hỏi (thi trắc nghiệm) — câu hỏi TẠM theo mức phê duyệt của người dùng
   Bản gốc: ApisQuanLyThiTracNghiem/modules/nhapnganhangcauhoi/html/nhapnganhangcauhoi.html + script/nhapnganhangcauhoi.js (2.155 dòng —
   chép lại phần *_Temp của quanlynganhangcauhoi.js). Tầng chung: ../../quanlynganhangcauhoi/script/_nhch.js + _nhch_cauhoi.js.
   ---------------------------------------------------------------------------
   Bố cục (bám gốc):
     1. Một cột: lọc Đơn vị · Tình trạng + bảng nhóm câu hỏi lớn (Mã, Tên, Trạng thái, Chi tiết) — KHÔNG thêm / sửa / xoá (gốc không có).
     2. "Chi tiết": gọi QLTTN_ThongTin/LayDS_MucPheDuyetByDonViUserId (strUserId, strDonViId = đơn vị đang lọc) → không có mức nào thì
        báo "Bạn chưa được phân quyền mức nhập câu hỏi" và KHÔNG mở (như gốc); có thì HAI CỘT: trái cây nhóm câu hỏi con, phải ô
        "Mức phê duyệt" (gốc đặt trong dải tab, nhãn "Chọn vai trò") + danh sách câu hỏi tạm có lọc Tình trạng / Loại / Mức độ / từ khoá.
     3. Nút: Loại câu hỏi (import) · Import dữ liệu · Tải mẫu file doc | Tạo mới · Preview · Đưa vào NH đề (chỉ khi mức phê duyệt có
        ORDERS = 1) · Không duyệt · Duyệt · Xóa. Biểu mẫu câu hỏi tạm / xem trước / kết quả import thay chỗ danh sách; Import là hộp thoại.
   Lời gọi riêng của màn (ngoài _nhch.js):
     QLTTN_ThongTin/LayDS_MucPheDuyetByDonViUserId (GET, không versionAPI) strUserId, strDonViId → ID, NAME, ORDERS
     NH/Duyet_QuestionTemp · KhongDuyet_QuestionTemp (POST) strId, strMucPheDuyetId, strNguoiThucHien_Id
     NH/LayDS_CauHoi_Temp với strQuestionTypeId, strLeVelId, strMucPheDuyetId = ô Mức phê duyệt (khác màn quản lý: mức admin)
     NH/ImportNganHangCauHoi_Temp_Doc · _LaTeX với MucPheDuyetId = ô Mức phê duyệt
   ---------------------------------------------------------------------------
   Lỗi gốc đã sửa / cố ý bỏ:
     · Nút "Import dữ liệu file LaTeX" gốc gọi NHẦM import_DMIP_Doc → nay gọi ImportNganHangCauHoi_Temp_LaTeX (đúng tên nút; action
       có sẵn ở màn quản lý). Đường GHI chưa từng chạy ở gốc — kiểm trên host.
     · html gốc có sẵn khung sửa nhóm câu hỏi (zoneEditGroupQuestionDetail) và Chuyển câu hỏi (zoneMove_CauHoi) nhưng JS không gắn
       gì → không chuyển (màn nhập không sửa nhóm / không chuyển câu hỏi).
     · Preview ở gốc gọi LayDS_PreviewCauHoi bằng GET (màn quản lý POST) — giữ GET.
     · "Thêm đáp án" gốc truyền lệch tham số (strDiemDapAn → strFixViTri) — xem _nhch_cauhoi.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nhch;
    var NH = N.NH, V = N.V, e = N.e, arr = N.arr, uid = N.uid;
    var root = document.getElementById('qlttn-nhapnhch');
    if (!root) return;
    function toast(m, t) { ui.toast(m, t || 'ok'); }
    function loi(err, noi) { ums.api.handle(err, noi); }

    root.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
    var zDs = root.querySelector('[data-z="ds"]'), zCt = root.querySelector('[data-z="ct"]');

    /* ---------- 1. Danh sách nhóm câu hỏi lớn (chỉ xem, có Chi tiết) ------ */
    var crud = ums.crud({
        root: zDs, title: 'Nhập ngân hàng câu hỏi', listTitle: 'Danh sách', icon: 'fa-upload',
        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: { call: { action: 'QLTTN_ThongTin/LayDS_DonViByUserId', method: 'GET', strUserId: uid() }, id: 'ID', name: 'NAME' } },
            { key: 'st', type: 'select', label: 'Tình trạng (Ẩn/Hiện)', source: { items: N.TT_NHOM } }
        ],
        list: {
            paged: true,
            call: function (f, p) {
                return { action: NH + 'LayDS_GroupQuestion', method: 'GET', versionAPI: V, strDepartorganId: f.dv || '', strStatus: f.st || '', strTuKhoa: '',
                    strNguoiDung_Id: uid(), PageNumber: p.index, ItemPerPage: p.size };
            }
        },
        columns: [
            { title: 'Mã', prop: 'GROUPQUESTIONCODE', cls: 'is-nowrap', width: '20%' },
            { title: 'Tên', prop: 'GROUPQUESTIONNAME' },
            { title: 'Trạng thái', cls: 'is-center', width: '10%', render: function (r) { return e(r.GROUPQUESTIONSTATUS) === '0' ? ui.badge('Ẩn', 'mute') : ui.badge('Hiện', 'ok'); } }
        ],
        rowActions: [{ icon: 'fa-eye', title: 'Chi tiết', onClick: function (row) { moChiTiet(row); } }]
    });
    ['dv', 'st'].forEach(function (k) {
        var s = zDs.querySelector('[data-scope="filter"][data-k="' + k + '"]');
        if (s && window.jQuery) jQuery(s).on('select2:select select2:clear', function () { crud.load(1); });
    });

    /* ---------- 2. Chi tiết: cây nhóm + mức phê duyệt + câu hỏi tạm ------- */
    var S = { group: null, nhomId: '', nhomRow: null, khung: null, ds: null, muc: [], selMuc: null, host: null, loaiImp: [] };
    function mucId() { return S.selMuc ? S.selMuc.value : ''; }
    function mucOrders1() {
        var r = S.muc.filter(function (x) { return e(x.ID) === mucId(); })[0];
        return !!r && e(r.ORDERS) === '1';
    }

    function moChiTiet(group) {
        N.g('QLTTN_ThongTin/LayDS_MucPheDuyetByDonViUserId', { versionAPI: false, strUserId: uid(), strDonViId: crud.filterValues().dv || '' }).then(function (r) {
            S.muc = arr(r.data);
            if (!S.muc.length) { toast('Bạn chưa được phân quyền mức nhập câu hỏi', 'warn'); return; }
            dung(group);
        }).catch(function (err) { loi(err, 'mức phê duyệt'); });
    }
    function dung(group) {
        S.group = group; S.nhomId = ''; S.nhomRow = null;
        zDs.hidden = true; zCt.hidden = false;
        S.khung = N.khungChiTiet({
            el: zCt, tieuDe: 'Nhập câu hỏi — ' + e(group.GROUPQUESTIONNAME),
            dong: function () { zCt.hidden = true; zDs.hidden = false; zCt.innerHTML = ''; },
            onChon: function (id, row) { S.nhomId = id; S.nhomRow = row || null; S.ds.tai(1); }
        });
        var main = S.khung.main;
        S.host = main;
        main.innerHTML = '<div data-z="ds"></div>';
        var hostDs = main.querySelector('[data-z="ds"]');
        S.ds = N.dsCauHoi({
            el: hostDs, temp: true, view: false, loc: true, orderInput: false, tieuDe: 'Danh sách câu hỏi tạm trong nhóm', icon: 'fa-file-import',
            tools: '<div class="ums-field nhch-muc"><select class="ums-select" data-k="muc" data-ph="Chọn vai trò" data-required><option value="">Chọn vai trò</option></select></div>',
            toolbar: {
                trai: '<select class="ums-select" data-k="loaiImp" data-ph="--Chọn loại câu hỏi--"><option value="">--Chọn loại câu hỏi--</option></select>' +
                    ui.btn('importer', { text: 'Import dữ liệu', attr: { 'data-k': 'imp' } }) +
                    ui.btn('excel', { text: 'Tải mẫu file doc', icon: 'fa-download', attr: { 'data-k': 'mau' } }),
                phai: ui.btn('add', { text: 'Tạo mới', attr: { 'data-k': 'them' } }) +
                    ui.btn('view', { text: 'Preview', attr: { 'data-k': 'xem' } }) +
                    ui.btn('confirm', { text: 'Đưa vào NH đề', icon: 'fa-database', attr: { 'data-k': 'dua', hidden: 'hidden' } }) +
                    ui.btn('confirm', { text: 'Không duyệt', icon: 'fa-circle-xmark', mod: 'warn', attr: { 'data-k': 'khongDuyet' } }) +
                    ui.btn('confirm', { text: 'Duyệt', attr: { 'data-k': 'duyet' } }) +
                    ui.xoaChon('input[data-ck]', { trong: '[data-z="bang"]', text: 'Xóa', attr: { 'data-k': 'xoa' } })
            },
            nhomId: function () { return S.nhomId; },
            thamSo: function () { return { strMucPheDuyetId: mucId() }; },
            onSua: function (r) { moForm(r); }
        });
        var r1 = S.ds.root;
        S.selMuc = r1.querySelector('[data-k="muc"]');
        pat.fill(S.selMuc, S.muc, { name: 'NAME', head: 'Chọn vai trò' });
        var selLoai = r1.querySelector('[data-k="loaiImp"]');
        N.loaiCauHoi().then(function (ds) { S.loaiImp = ds; pat.fill(selLoai, ds, { name: 'NAME', head: '--Chọn loại câu hỏi--' }); }).catch(function () {});
        ui.enhance(r1);
        var nutDua = r1.querySelector('[data-k="dua"]');
        function capNhatNutDua() { nutDua.hidden = !mucOrders1(); }
        if (window.jQuery) jQuery(S.selMuc).on('select2:select select2:clear', function () { capNhatNutDua(); S.ds.tai(1); });
        r1.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k]'); if (!b || b.closest('.ums-formtrang')) return;
            var k = b.getAttribute('data-k'), ids;
            if (k === 'them') {
                if (!mucId()) { toast('Chưa chọn mức phê duyệt', 'warn'); return; }
                if (!S.nhomId) { toast('Chưa chọn nhóm câu hỏi', 'warn'); return; }
                moForm(null);
            } else if (k === 'xem') {
                ids = S.ds.chon(); if (!ids.length) { toast('Vui lòng chọn đối tượng cần xem?', 'warn'); return; }
                N.xemTruoc({ host: hostDs, ids: ids, temp: true, post: false });
            } else if (k === 'dua') {
                ids = S.ds.chon(); if (!ids.length) { toast('Vui lòng chọn câu hỏi cần đưa vào NH đề?', 'warn'); return; }
                N.hangLoat({ ids: ids, action: NH + 'DuaCauHoiTmpVaoNH', title: 'Đưa vào NH đề', hoi: 'Bạn có chắc chắn đưa ' + ids.length + ' câu hỏi vào NH đề?', ok: 'Import dữ liệu thành công!', sau: function () { S.ds.tai(); } });
            } else if (k === 'duyet' || k === 'khongDuyet') {
                ids = S.ds.chon(); if (!ids.length) { toast('Vui lòng chọn câu hỏi cần duyệt?', 'warn'); return; }
                if (!mucId()) { toast('Chưa chọn mức phê duyệt', 'warn'); return; }
                N.hangLoat({ ids: ids, action: NH + (k === 'duyet' ? 'Duyet_QuestionTemp' : 'KhongDuyet_QuestionTemp'), title: k === 'duyet' ? 'Duyệt' : 'Không duyệt',
                    hoi: 'Bạn có chắc chắn ' + (k === 'duyet' ? 'duyệt' : 'không duyệt') + ' ' + ids.length + ' câu hỏi không?', them: function () { return { strMucPheDuyetId: mucId() }; },
                    ok: 'Thực hiện thành công!', sau: function () { S.ds.tai(); } });
            } else if (k === 'xoa') {
                ids = S.ds.chon(); if (!ids.length) { toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                N.hangLoat({ ids: ids, action: NH + 'Xoa_QuestionTemp', title: 'Xóa câu hỏi tạm', hoi: 'Bạn có chắc chắn xóa ' + ids.length + ' câu hỏi không?', ok: 'Xóa dữ liệu thành công!', sau: function () { S.ds.tai(); } });
            } else if (k === 'imp') {
                if (!S.nhomId) { toast('Bạn chưa chọn nhóm câu hỏi', 'warn'); return; }
                if (!mucId()) { toast('Chưa chọn mức phê duyệt', 'warn'); return; }
                if (!selLoai.value) { toast('Bạn chưa chọn loại câu hỏi', 'warn'); return; }
                N.hopImport({ latex: true, thamSo: function () { return { GroupQuestionDetailId: S.nhomId, strQuestionTypeId: selLoai.value, MucPheDuyetId: mucId() }; },
                    onDone: function (kq) { S.ds.tai(1); N.ketQuaImport(hostDs, kq); } });
            } else if (k === 'mau') {
                N.taiMau(S.loaiImp.filter(function (x) { return e(x.ID) === selLoai.value; })[0]);
            }
        });
        capNhatNutDua();
        N.nhomCon(e(group.ID)).then(function (kq) { S.khung.veCay(kq.rows, ''); }).catch(function (err) { loi(err, 'nhóm câu hỏi'); });
        S.ds.tai(1);
    }
    function moForm(row) {
        N.formCauHoi({ host: S.host.querySelector('[data-z="ds"]'), temp: true, view: false, nhomId: S.nhomId, row: row, previewPost: false,
            thamSo: function () { return { strMucPheDuyetId: mucId() }; },
            onSaved: function () { S.ds.tai(); }, onChanged: function () { S.ds.tai(); }, onClose: function () { S.ds.tai(); } });
    }
})();
