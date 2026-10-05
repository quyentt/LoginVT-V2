/* =========================================================================
   Quản lý ngân hàng câu hỏi (thi trắc nghiệm) — MỘT mã cho HAI màn:
     · quanlynganhangcauhoi.html      data-kieu="quanly"  (quản lý đầy đủ)
     · viewquanlynganhangcauhoi.html  data-kieu="view"    (xem theo phân quyền — chỉ đọc)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlynganhangcauhoi/html/{quanlynganhangcauhoi,viewquanlynganhangcauhoi}.html
   + script/quanlynganhangcauhoi.js (5.822 dòng, hai html dùng chung; html "view" chỉ bỏ các nút ghi và thêm ô ẩn
   #filehtml = 'viewquanlynganhangcauhoi' để JS đổi lời gọi danh sách sang LayDS_PhanQuyenGroupQuestion).
   Tầng chung của module: _nhch.js (ums.nhch) + _nhch_cauhoi.js (biểu mẫu câu hỏi / đáp án).
   ---------------------------------------------------------------------------
   Bố cục (bám gốc):
     1. Một cột: thanh lọc Đơn vị · Tình trạng + bảng nhóm câu hỏi lớn (Mã, Tên, Trạng thái, Sửa, Chi tiết, ô chọn) → ums.crud.
     2. "Chi tiết" thay chỗ cả màn: HAI CỘT — trái cây nhóm câu hỏi con (gốc jstree, menu "Thao tác" Thêm mới / Sửa / Xóa → ba nút
        trên tiêu đề cột), phải hai tab "Danh sách câu hỏi" | "Nội dung câu hỏi nhóm".
     3. Tab 1: lọc Tình trạng / Loại / Mức độ / từ khoá; báo cáo (3 mẫu) + Tải file; "Cập nhật" STT – tính theo ý; ô "Tác vụ" + Thực hiện
        (Chuyển · Tạo mới · Xóa · Preview · Kiểm tra · Không dùng · Đang dùng · Import câu hỏi tạm) — giữ ô tác vụ như gốc.
        Biểu mẫu câu hỏi / câu hỏi tạm / xem trước / kết quả import thay chỗ danh sách trong trang (pat.formTrang); Chuyển câu hỏi
        (chọn nhóm đích), Import (chọn tệp), Lịch sử câu hỏi / đáp án là hộp thoại (việc phụ).
     4. "Đã dùng" (câu hỏi đã tạo đề): khung thay chỗ chi tiết — lọc Năm học → Học kỳ → Đợt thi → Học phần (nối tầng, khoá cha → con),
        Trạng thái / Tình trạng phòng, Từ ngày – Đến ngày, từ khoá, DS thí sinh, Phòng thi (đổ từ kết quả), "Tính lại điểm".
   Lời gọi thêm ngoài _nhch.js:
     QLTTN_ThongTin/LayDS_MucPheDuyetAdmin (GET, không versionAPI)   → Data = id mức phê duyệt (chuỗi) dùng cho câu hỏi tạm / import
     QLTTN_QuanLyThi/LayDS_NamHoc strStatus '1' → SCHOOLYEAR · LayDS_HocKyBySchoolYear strStatus, strSchoolYear → SEMESTER ·
     LayDS_DoThiByHocKy strStatus, strHocKy → ID, NAME · LayDS_HocPhan_TheoDotThi strDotThiId, strNamHoc, strHocKy → Data.Table ID, TEN, MA
     NH/LayDS_CauHoiDaTaoDe (GET) strDotThi_Id, strTrangThaiPhongThi, strStatus, strHocPhanId, strTuNgay, strDenNgay, strTuKhoa, strQuestionId,
        [strExamRoomInfoId khi đã chọn phòng], PageNumber, ItemPerPage → Data.Table (thí sinh), Table1 (đáp án TS theo STUDENTID), Table2 (phòng)
     TTN_ThiSinh/get_TinhLaiDiemThiSinh (GET) strExamRoomInfoId, strStudentExamRoomId, strThiSinhId, strUserId → Data = điểm
     NH/LayDS_LichSuCauHoi · LayDS_LichSuDapAn (GET) strQuestionId, strNguoiDung_Id, PageNumber, ItemPerPage (cột *_LS = giá trị lịch sử)
   ---------------------------------------------------------------------------
   Lỗi gốc đã sửa / cố ý bỏ:
     · Màn xem: lúc mở và khi bấm Tìm kiếm gốc gọi LayDS_GroupQuestion (không phân quyền), chỉ khi ĐỔI đơn vị mới gọi
       LayDS_PhanQuyenGroupQuestion → nay màn xem luôn gọi bản phân quyền. Màn xem gốc vẫn vẽ nút Sửa / tác vụ ghi nhưng không có
       nút Lưu → nay bỏ hẳn: chỉ xem nhóm, câu hỏi, đáp án, xem trước, kiểm tra, báo cáo, lịch sử, đã dùng.
     · Sửa nhóm câu hỏi lớn: gốc gửi strDepartOrganId = đơn vị đang LỌC (đổi bộ lọc rồi sửa là nhóm bị chuyển đơn vị) → nay gửi
       DEPARTORGANID của dòng; thêm mới vẫn lấy từ ô lọc (bắt chọn đơn vị như gốc).
     · Nút "Tính lại điểm" thứ hai (lưu điểm, fa-save) của khung "Đã dùng" gốc gọi save_DiemSuaCauHoi với biến không tồn tại
       (strStudentExamRoomPartId → ReferenceError) → chưa từng chạy; không rõ strId là id nào → giữ nút, disabled.
     · "Kiểm tra câu hỏi" gốc tô đỏ dòng bằng tr#<id> không tồn tại (bảng không gắn id dòng) → nay tô theo tr[data-id].
     · Nút "Import dữ liệu file LaTeX" gốc để display:none ở màn này → không hiện (màn nhập có).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nhch;
    var NH = N.NH, V = N.V, e = N.e, arr = N.arr, uid = N.uid;
    var root = document.getElementById('qlttn-nhch');
    if (!root) return;
    var view = root.getAttribute('data-kieu') === 'view';
    function toast(m, t) { ui.toast(m, t || 'ok'); }
    function loi(err, noi) { ums.api.handle(err, noi); }

    root.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
    var zDs = root.querySelector('[data-z="ds"]'), zCt = root.querySelector('[data-z="ct"]');
    var mucAdmin = '';
    N.g('QLTTN_ThongTin/LayDS_MucPheDuyetAdmin', { versionAPI: false }).then(function (r) { mucAdmin = typeof r.data === 'string' ? r.data : e(r.data && r.data.ID); }).catch(function () {});

    /* =====================================================================
       1. Danh sách nhóm câu hỏi lớn — ums.crud (một cột như gốc)
       ===================================================================== */
    var crud = ums.crud({
        root: zDs,
        title: view ? 'Xem ngân hàng câu hỏi' : 'Quản lý ngân hàng câu hỏi',
        listTitle: 'Danh sách', formTitle: 'nhóm câu hỏi', icon: 'fa-database',
        addText: 'Tạo mới', removeText: 'Xóa',
        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: { call: { action: 'QLTTN_ThongTin/LayDS_DonViByUserId', method: 'GET', strUserId: uid() }, id: 'ID', name: 'NAME' } },
            { key: 'st', type: 'select', label: 'Tình trạng (Ẩn/Hiện)', source: { items: N.TT_NHOM } }
        ],
        list: {
            paged: true,
            call: function (f, p) {
                return { action: NH + (view ? 'LayDS_PhanQuyenGroupQuestion' : 'LayDS_GroupQuestion'), method: 'GET', versionAPI: V,
                    strDepartorganId: f.dv || '', strStatus: f.st || '', strTuKhoa: '', strNguoiDung_Id: uid(), PageNumber: p.index, ItemPerPage: p.size };
            }
        },
        columns: [
            { title: 'Mã', prop: 'GROUPQUESTIONCODE', cls: 'is-nowrap', width: '20%' },
            { title: 'Tên', prop: 'GROUPQUESTIONNAME' },
            { title: 'Trạng thái', cls: 'is-center', width: '10%', render: function (r) { return e(r.GROUPQUESTIONSTATUS) === '0' ? ui.badge('Ẩn', 'mute') : ui.badge('Hiện', 'ok'); } }
        ],
        rowActions: [{ icon: 'fa-eye', title: 'Chi tiết', onClick: function (row) { moChiTiet(row); } }],
        canAdd: !view, canEdit: !view, rowDelete: false, multi: !view,
        fields: view ? null : [
            { key: '_dv', type: 'static', label: 'Đơn vị', get: function (row) { return row ? e(row.DEPARTORGANNAME) : tenDonVi(); } },
            { key: 'strStatus', col: 'GROUPQUESTIONSTATUS', label: 'Tình trạng', type: 'select', required: true, placeholder: 'Tình trạng (Ẩn/Hiện)', source: { items: N.TT_NHOM } },
            { key: 'strCode', col: 'GROUPQUESTIONCODE', label: 'Mã', required: true },
            { key: 'strName', col: 'GROUPQUESTIONNAME', label: 'Tên', required: true }
        ],
        save: view ? null : function (v, row) {
            return { action: NH + (row ? 'CapNhat_GroupQuestion' : 'ThemMoi_GroupQuestion'), method: 'POST', versionAPI: V,
                strId: row ? e(row.ID) : '', strCode: v.strCode, strName: v.strName,
                strDepartOrganId: row ? e(row.DEPARTORGANID) : (crud.filterValues().dv || ''), strStatus: v.strStatus, strNguoiThucHien_Id: uid() };
        },
        remove: view ? null : function (ids) {
            return ids.map(function (id) { return { action: NH + 'Xoa_GroupQuestion', method: 'POST', versionAPI: V, strId: id, strNguoiThucHien_Id: uid() }; });
        },
        // Thêm mới: ô Đơn vị (chỉ hiện) lấy tên đơn vị đang lọc (gốc lblDonVi = text của drpDonVi)
        onForm: function (row, c) {
            var el = zDs.querySelector('[data-scope="form"][data-k="_dv"]');
            if (el && !row) el.textContent = tenDonVi();
        }
    });
    function tenDonVi() {
        var s = zDs.querySelector('[data-scope="filter"][data-k="dv"]');
        return s && s.value && s.options[s.selectedIndex] ? s.options[s.selectedIndex].text : '';
    }
    // "Tạo mới" khi chưa chọn đơn vị: báo như gốc (bắt ở pha BẮT, trước trình xử lý của crud)
    if (!view) zDs.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-c="' + crud.uid + ':add"]');
        if (!b || crud.filterValues().dv) return;
        ev.stopImmediatePropagation();
        toast('Chưa chọn đơn vị', 'warn');
    }, true);
    // Đổi Đơn vị / Tình trạng là tải lại (gốc nghe select2:select)
    ['dv', 'st'].forEach(function (k) {
        var s = zDs.querySelector('[data-scope="filter"][data-k="' + k + '"]');
        if (s && window.jQuery) jQuery(s).on('select2:select select2:clear', function () { crud.load(1); });
    });

    /* =====================================================================
       2. Chi tiết nhóm: cây nhóm con (trái) + hai tab (phải)
       ===================================================================== */
    var S = { group: null, nhomId: '', nhomRow: null, khung: null, ds: null, tab: 'ch', hostTab1: null, hostTab2: null, edNhom: null, audioNhom: null, loaiImp: [] };

    function moChiTiet(group) {
        S.group = group; S.nhomId = ''; S.nhomRow = null;
        zDs.hidden = true; zCt.hidden = false;
        // "Thao tác" của gốc (Thêm mới / Sửa / Xóa nhóm) → ba nút biểu tượng trên tiêu đề cột trái (cột 320px không đủ chỗ cho nút chữ)
        var tools = view ? '' :
            '<button type="button" class="ums-iconbtn" data-k="nhomThem" title="Thêm mới nhóm câu hỏi"><i class="fa-light fa-plus"></i></button>' +
            '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-k="nhomSua" title="Sửa nhóm câu hỏi đang chọn"><i class="fa-light fa-pen-to-square"></i></button>' +
            '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-k="nhomXoa" title="Xóa nhóm câu hỏi đang chọn"><i class="fa-light fa-trash-can"></i></button>';
        S.khung = N.khungChiTiet({
            el: zCt, tieuDe: 'Danh sách câu hỏi — ' + e(group.GROUPQUESTIONNAME), tools: tools,
            dong: function () { zCt.hidden = true; zDs.hidden = false; zCt.innerHTML = ''; if (S.edNhom) { S.edNhom.destroy(); S.edNhom = null; } crud.load(); },
            onChon: function (id, row) { chonNhom(id, row); }
        });
        var main = S.khung.main;
        main.innerHTML = ui.tabs([{ key: 'ch', text: 'Danh sách câu hỏi', icon: 'fa-list-check' }, { key: 'nd', text: 'Nội dung câu hỏi nhóm', icon: 'fa-file-lines' }], 'ch', 'data-tab') +
            '<div data-z="tab1"></div><div data-z="tab2" hidden></div>';
        S.hostTab1 = main.querySelector('[data-z="tab1"]');
        S.hostTab2 = main.querySelector('[data-z="tab2"]');
        main.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-tab]');
            if (!a || !main.contains(a) || a.closest('.ums-formtrang')) return;
            S.tab = a.getAttribute('data-tab');
            ui.tabsActive(main, S.tab, 'data-tab');
            S.hostTab1.hidden = S.tab !== 'ch';
            S.hostTab2.hidden = S.tab !== 'nd';
        });
        dungTab1();
        dungTab2();
        if (!view) S.khung.m.side.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k]'); if (!b) return;
            var k = b.getAttribute('data-k');
            if (k === 'nhomThem') N.formNhom({ host: main, groupId: e(group.ID), row: null, onSaved: taiCay });
            else if (k === 'nhomSua') { if (!S.nhomId) { toast('Chưa chọn nhóm câu hỏi', 'warn'); return; } N.formNhom({ host: main, groupId: e(group.ID), row: S.nhomRow, onSaved: taiCay }); }
            else if (k === 'nhomXoa') {
                if (!S.nhomId) { toast('Chưa chọn nhóm câu hỏi', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa nhóm "' + e(S.nhomRow && S.nhomRow.NAME) + '"?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                    if (!yes) return;
                    return N.g(NH + 'Xoa_GroupQuestionDetail', { strId: S.nhomId, strNguoiThucHien_Id: uid() }, true).then(function () {
                        toast('Xóa dữ liệu thành công!'); S.nhomId = ''; S.nhomRow = null; taiCay(); S.ds.tai(1); napTab2();
                    });
                }).catch(function (err) { loi(err, 'xoá nhóm câu hỏi'); });
            }
        });
        taiCay();
        S.ds.tai(1);
    }
    function taiCay() {
        return N.nhomCon(e(S.group.ID)).then(function (kq) {
            S.khung.veCay(kq.rows, S.nhomId);
            if (S.nhomId) S.nhomRow = kq.rows.filter(function (r) { return e(r.ID) === S.nhomId; })[0] || null;
        }).catch(function (err) { loi(err, 'nhóm câu hỏi'); });
    }
    function chonNhom(id, row) {
        S.nhomId = id; S.nhomRow = row || null;
        S.ds.tai(1);
        napTab2();
    }

    /* ---------- Tab 1: danh sách câu hỏi trong nhóm ---------------------- */
    var BC = [{ ID: 'THONGKECHATLUONGCAUHOI', TEN: 'Thống kê chất lượng câu hỏi' }, { ID: 'THONGKETHISINHTRALOI', TEN: 'Thống kê thí sinh trả lời' }, { ID: 'THONGKETYLESUDUNGCAUHOI', TEN: 'Thống kê tỷ lệ sử dụng câu hỏi' }];
    var TACVU = view
        ? [{ ID: 'PREVIEWCAUHOI', TEN: 'Preview' }, { ID: 'KIEMTRACAUHOI', TEN: 'Kiểm tra câu hỏi' }]
        : [{ ID: 'CHUYENCAUHOI', TEN: 'Chuyển câu hỏi' }, { ID: 'TAOMOICAUHOI', TEN: 'Tạo mới câu hỏi' }, { ID: 'XOACAUHOI', TEN: 'Xóa câu hỏi' }, { ID: 'PREVIEWCAUHOI', TEN: 'Preview' },
            { ID: 'KIEMTRACAUHOI', TEN: 'Kiểm tra câu hỏi' }, { ID: 'CAPNHATKHONGDUNG', TEN: 'Cập nhật tình trạng thành không dùng' }, { ID: 'CAPNHATDANGGDUNG', TEN: 'Cập nhật tình trạng thành đang dùng' },
            { ID: 'IMPORTCAUHOITAM', TEN: 'Import câu hỏi tạm' }];
    function dungTab1() {
        S.ds = N.dsCauHoi({
            el: S.hostTab1, temp: false, view: view, loc: true, orderInput: true, slDaThi: true,
            tieuDe: 'Danh sách câu hỏi trong nhóm', icon: 'fa-list-check',
            toolbar: {
                trai: '<select class="ums-select" data-k="bc" data-ph="Chọn loại báo cáo"><option value="">Chọn loại báo cáo</option></select>' + ui.btn('report', { text: 'Tải file', attr: { 'data-k': 'taiFile' } }),
                phai: (view ? '' : ui.btn('save', { text: 'Cập nhật', attr: { 'data-k': 'capNhat', title: 'Cập nhật STT / tính điểm theo số ý' } })) +
                    '<select class="ums-select" data-k="tacvu" data-ph="Chọn tác vụ"><option value="">Chọn tác vụ</option></select>' +
                    ui.btn('search', { text: 'Thực hiện tác vụ', icon: 'fa-play', attr: { 'data-k': 'thucHien' } })
            },
            nhomId: function () { return S.nhomId; },
            onSua: function (r) { moFormCauHoi(r); },
            onDaDung: function (r) { moDaTaoDe(r); },
            onLsCauHoi: function (r) { hopLichSu('ch', r); },
            onLsDapAn: function (r) { hopLichSu('da', r); }
        });
        var r1 = S.ds.root;
        pat.fill(r1.querySelector('[data-k="bc"]'), BC, { head: 'Chọn loại báo cáo' });
        pat.fill(r1.querySelector('[data-k="tacvu"]'), TACVU, { head: 'Chọn tác vụ' });
        ui.enhance(r1);
        r1.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k]'); if (!b || b.closest('.ums-formtrang')) return;
            var k = b.getAttribute('data-k');
            if (k === 'taiFile') baoCao(r1.querySelector('[data-k="bc"]').value);
            else if (k === 'capNhat') S.ds.capNhatSTT();
            else if (k === 'thucHien') tacVu(r1.querySelector('[data-k="tacvu"]').value);
        });
    }
    function chonCauHoi(nhac) {
        var ids = S.ds.chon();
        if (!ids.length) toast(nhac, 'warn');
        return ids;
    }
    function tacVu(k) {
        if (!k) { toast('Bạn chưa chọn tác vụ cần thực hiện', 'warn'); return; }
        var ids;
        if (k === 'CHUYENCAUHOI') {
            ids = chonCauHoi('Vui lòng chọn đối tượng cần chuyển?'); if (!ids.length) return;
            N.hopChuyen({ rows: S.khung.rows(), soCau: ids.length, onChon: function (nhomDich, ten) {
                N.hangLoat({ ids: ids, action: NH + 'Chuyen_Question', title: 'Chuyển câu hỏi', hoi: 'Bạn có chắc chắn thực hiện chuyển ' + ids.length + ' câu hỏi tới ' + ten + '?',
                    them: function () { return { strGroupQuestionDetailId: nhomDich }; }, sau: function () { S.ds.tai(); } });
            } });
        } else if (k === 'TAOMOICAUHOI') {
            if (!S.nhomId) { toast('Chưa chọn nhóm câu hỏi', 'warn'); return; }
            moFormCauHoi(null);
        } else if (k === 'XOACAUHOI') {
            ids = chonCauHoi('Vui lòng chọn đối tượng cần xóa?'); if (!ids.length) return;
            N.hangLoat({ ids: ids, action: NH + 'Xoa_Question', title: 'Xóa câu hỏi', hoi: 'Bạn có chắc chắn xóa ' + ids.length + ' câu hỏi không?', ok: 'Xóa dữ liệu thành công!', sau: function () { S.ds.tai(); } });
        } else if (k === 'PREVIEWCAUHOI') {
            ids = chonCauHoi('Vui lòng chọn đối tượng cần xem?'); if (!ids.length) return;
            N.xemTruoc({ host: S.hostTab1, ids: ids, temp: false, post: true });
        } else if (k === 'KIEMTRACAUHOI') {
            ids = chonCauHoi('Vui lòng chọn đối tượng cần kiểm tra?'); if (!ids.length) return;
            N.xemTruoc({ host: S.hostTab1, ids: ids, temp: false, post: true, kiem: true, bang: S.ds.bang });
        } else if (k === 'CAPNHATKHONGDUNG' || k === 'CAPNHATDANGGDUNG') {
            ids = chonCauHoi('Vui lòng chọn đối tượng cần cập nhật?'); if (!ids.length) return;
            var tt = k === 'CAPNHATDANGGDUNG' ? '1' : '0';
            N.hangLoat({ ids: ids, action: NH + 'CapNhatTinhTrang_Question', title: 'Cập nhật tình trạng', hoi: 'Bạn có chắc chắn cập nhật ' + ids.length + ' câu hỏi thành "' + N.ttCauHoi(tt) + '" không?',
                them: function () { return { strStatus: tt }; }, ok: 'Cập nhật dữ liệu thành công!', sau: function () { S.ds.tai(); } });
        } else if (k === 'IMPORTCAUHOITAM') {
            if (!S.nhomId) { toast('Bạn chưa chọn nhóm câu hỏi', 'warn'); return; }
            moTam();
        }
    }
    function moFormCauHoi(row) {
        N.formCauHoi({ host: S.hostTab1, temp: false, view: view, nhomId: S.nhomId, row: row, audio: true,
            onSaved: function () { S.ds.tai(); }, onChanged: function () { S.ds.tai(); }, onClose: function () { S.ds.tai(); } });
    }
    /** Báo cáo: tham số chép nguyên khối addKeyValue của gốc (gộp cả tham số của khung "Đã dùng" đang mở, nếu có) */
    function baoCao(code) {
        if (!code) { toast('Chưa chọn loại báo cáo', 'warn'); return; }
        var dt = S.daTaoDe || {}, f = dt.f || {};
        function fv(k) { return f[k] ? f[k].value : ''; }
        N.baoCao([
            ['MAUTEMPLATEIMPORT.strMau_LoaiCauHoiId', S.loaiImpId || ''],
            ['QUANLYNHCH.GroupquestiondetailId', S.nhomId],
            ['QUANLYNHCH.strStatus', crud.filterValues().st || ''],
            ['strReportCode', code],
            ['strNguoiDangNhap_Id', uid()],
            ['QUANLYNHCH.strQuestionId', S.ds.chon().join('#')],
            ['QUANLYNHCH_CAUHOIDADUNG.strQuestionId', dt.qid || ''],
            ['QUANLYNHCH_CAUHOIDADUNG.strExamRoomInfoId', fv('phong')],
            ['QUANLYNHCH_CAUHOIDADUNG.strDotThi_Id', fv('dot')],
            ['QUANLYNHCH_CAUHOIDADUNG.strTrangThaiPhongThi', fv('ttPhong')],
            ['QUANLYNHCH_CAUHOIDADUNG.strStatus', fv('stPhong')],
            ['QUANLYNHCH_CAUHOIDADUNG.strHocPhanId', fv('hp')],
            ['QUANLYNHCH_CAUHOIDADUNG.strTuNgay', fv('tu')],
            ['QUANLYNHCH_CAUHOIDADUNG.strDenNgay', fv('den')],
            ['QUANLYNHCH_CAUHOIDADUNG.strTuKhoa', fv('q')]
        ]);
    }

    /* ---------- Câu hỏi tạm (import) — khung thay chỗ danh sách ---------- */
    function moTam() {
        var body = document.createElement('div');
        var dsTam;
        var fTam = pat.formTrang({
            host: S.hostTab1, title: 'Câu hỏi tạm', icon: 'fa-file-import', cols: 1, body: body,
            xoa: { chon: 'input[data-ck]', text: 'Xóa', onClick: function () {
                var ids = dsTam.chon(); if (!ids.length) return;
                N.hangLoat({ ids: ids, action: NH + 'Xoa_QuestionTemp', title: 'Xóa câu hỏi tạm', hoi: 'Bạn có chắc chắn xóa ' + ids.length + ' câu hỏi tạm?', ok: 'Xóa dữ liệu thành công!', sau: function () { dsTam.tai(); } });
            } },
            buttons: [
                { text: 'Preview', kind: 'view', icon: 'fa-eye', keepOpen: true, onClick: function () {
                    var ids = dsTam.chon(); if (!ids.length) { toast('Vui lòng chọn đối tượng cần xem?', 'warn'); return; }
                    N.xemTruoc({ host: fTam.body, ids: ids, temp: true, post: true });
                } },
                { text: 'Kiểm tra', kind: 'confirm', icon: 'fa-list-check', mod: 'out-primary', keepOpen: true, onClick: function () {
                    var ids = dsTam.chon(); if (!ids.length) { toast('Vui lòng chọn đối tượng cần kiểm tra?', 'warn'); return; }
                    N.xemTruoc({ host: fTam.body, ids: ids, temp: true, post: true, kiem: true, bang: dsTam.bang });
                } },
                { text: 'Cập nhật', kind: 'save', keepOpen: true, onClick: function () { dsTam.capNhatSTT(); } },
                { text: 'Đưa vào ngân hàng đề', kind: 'confirm', icon: 'fa-database', keepOpen: true, onClick: function () {
                    var ids = dsTam.chon(); if (!ids.length) { toast('Vui lòng chọn đối tượng cần thao tác?', 'warn'); return; }
                    N.hangLoat({ ids: ids, action: NH + 'DuaCauHoiTmpVaoNH', title: 'Đưa vào ngân hàng đề', hoi: 'Đưa ' + ids.length + ' câu hỏi tạm vào ngân hàng đề?', ok: 'Import dữ liệu thành công!',
                        sau: function () { dsTam.tai(); S.ds.tai(); } });
                } }
            ],
            onClose: function () { S.ds.tai(); }
        });
        dsTam = N.dsCauHoi({
            el: body, temp: true, view: false, loc: false, orderInput: true, tieuDe: 'Danh sách câu hỏi tạm', icon: 'fa-file-import',
            toolbar: { trai: '<select class="ums-select" data-k="loaiImp" data-ph="--Chọn loại câu hỏi--"><option value="">--Chọn loại câu hỏi--</option></select>' +
                ui.btn('importer', { text: 'Import dữ liệu', attr: { 'data-k': 'imp' } }) +
                ui.btn('excel', { text: 'Tải mẫu file doc', icon: 'fa-download', attr: { 'data-k': 'mau' } }) },
            nhomId: function () { return S.nhomId; },
            thamSo: function () { return { strMucPheDuyetId: mucAdmin }; },
            onSua: function (r) {
                N.formCauHoi({ host: fTam.body, temp: true, view: false, nhomId: S.nhomId, row: r, thamSo: function () { return { strMucPheDuyetId: mucAdmin }; },
                    onSaved: function () { dsTam.tai(); }, onChanged: function () { dsTam.tai(); }, onClose: function () { dsTam.tai(); } });
            }
        });
        var selLoai = body.querySelector('[data-k="loaiImp"]');
        N.loaiCauHoi().then(function (ds) { S.loaiImp = ds; pat.fill(selLoai, ds, { name: 'NAME', head: '--Chọn loại câu hỏi--' }); }).catch(function () {});
        if (window.jQuery) jQuery(selLoai).on('select2:select select2:clear', function () { S.loaiImpId = selLoai.value; dsTam.tai(1); });   // gốc: đổi loại là tải lại
        body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k]');
            if (!b || b.closest('.ums-formtrang') !== fTam.el) return;      // nút của biểu mẫu tầng trong (câu hỏi tạm) bỏ qua
            var k = b.getAttribute('data-k');
            if (k === 'imp') {
                if (!S.nhomId) { toast('Bạn chưa chọn nhóm câu hỏi', 'warn'); return; }
                if (!selLoai.value) { toast('Bạn chưa chọn loại câu hỏi', 'warn'); return; }
                N.hopImport({ latex: false, thamSo: function () { return { GroupQuestionDetailId: S.nhomId, strQuestionTypeId: selLoai.value, MucPheDuyetId: mucAdmin }; },
                    onDone: function (kq) { dsTam.tai(1); N.ketQuaImport(fTam.body, kq); } });
            } else if (k === 'mau') {
                N.taiMau(S.loaiImp.filter(function (x) { return e(x.ID) === selLoai.value; })[0]);
            }
        });
        dsTam.tai(1);
    }

    /* ---------- Tab 2: nội dung câu hỏi nhóm ----------------------------- */
    function dungTab2() {
        S.hostTab2.innerHTML = pat.panel({
            title: 'Nội dung câu hỏi nhóm', icon: 'fa-file-lines',
            tools: view ? '' : ui.btn('save', { text: 'Lưu', attr: { 'data-k': 'luuNd' } }),
            body: '<div data-k="nhac">' + ui.empty('Chọn một nhóm câu hỏi ở cột bên trái', 'fa-folder-tree') + '</div>' +
                '<div data-k="vung" hidden>' +
                (view ? '<div class="ums-legend">Nội dung câu hỏi nhóm</div><div class="nhch-html" data-k="ndXem"></div>' +
                    '<div class="ums-kv ums-u-mt-3"><span>Trạng thái</span><b data-k="ttXem"></b></div>'
                    : ui.field('Nội dung câu hỏi nhóm', '<textarea data-k="nd"></textarea>') +
                    '<div class="ums-grid ums-grid--2">' + ui.field('Trạng thái', '<select class="ums-select" data-k="tt" data-ph="---Chọn trạng thái---"><option value="">---Chọn trạng thái---</option></select>', { required: true }) + '</div>') +
                '<div class="ums-legend ums-legend--cach">Tệp âm thanh</div><div data-k="audio"></div></div>'
        });
        var h = S.hostTab2, q = function (k) { return h.querySelector('[data-k="' + k + '"]'); };
        if (!view) {
            pat.fill(q('tt'), N.TT_CAUHOI, { head: '---Chọn trạng thái---' });
            ums.editor.tao(q('nd'), { cao: 260 }).then(function (ed) { S.edNhom = ed; if (S.nhomRow) ed.set(S.nhomRow.CONTENT); });
        }
        S.audioNhom = N.khoiAudio({ el: q('audio'), folder: 'Audio', view: view });
        ui.enhance(h);
        h.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k="luuNd"]'); if (!b) return;
            if (!S.nhomId) { toast('Chưa chọn nhóm câu hỏi', 'warn'); return; }
            if (!q('tt').value) { toast('Chưa chọn trạng thái', 'warn'); return; }
            N.g(NH + 'Sua_ContentGroupQuestionDetail', { strId: S.nhomId, strStatus: q('tt').value, strContent: S.edNhom ? S.edNhom.get() : q('nd').value, strNguoiThucHien_Id: uid() }, true)
                .then(function () { return S.audioNhom.save(S.nhomId); })
                .then(function () { toast('Thực hiện thành công'); taiCay(); })
                .catch(function (err) { loi(err, 'lưu nội dung nhóm'); });
        });
    }
    function napTab2() {
        var h = S.hostTab2, q = function (k) { return h.querySelector('[data-k="' + k + '"]'); };
        var co = !!S.nhomId;
        q('nhac').hidden = co; q('vung').hidden = !co;
        var r = S.nhomRow || {};
        if (view) { q('ndXem').innerHTML = co ? (N.html(r.CONTENT) || '<span class="ums-u-faint">(trống)</span>') : ''; q('ttXem').textContent = co ? N.ttCauHoi(r.STATUS) : ''; N.toan(q('ndXem')); }
        else {
            if (S.edNhom) S.edNhom.set(co ? r.CONTENT : ''); else q('nd').value = co ? e(r.CONTENT) : '';
            q('tt').value = co ? e(r.STATUS) : '';
            if (window.jQuery) jQuery(q('tt')).trigger('change.select2');
        }
        S.audioNhom.load(co ? S.nhomId : '');
    }

    /* =====================================================================
       3. Câu hỏi đã tạo đề ("Đã dùng") — khung thay chỗ chi tiết
       ===================================================================== */
    function moDaTaoDe(row) {
        var qid = e(row.ID);
        var body = document.createElement('div');
        body.innerHTML =
            pat.filterBar([
                { key: 'nam', type: 'select', label: 'Năm học' }, { key: 'ky', type: 'select', label: 'Học kỳ' },
                { key: 'dot', type: 'select', label: 'Đợt thi' }, { key: 'hp', type: 'select', label: 'Học phần' },
                { key: 'ttPhong', type: 'select', label: 'Trạng thái phòng' }, { key: 'stPhong', type: 'select', label: 'Tình trạng phòng' },
                { key: 'tu', type: 'date', label: 'Từ ngày' }, { key: 'den', type: 'date', label: 'Đến ngày' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ], { searchText: 'DS thí sinh', extra: '<div class="ums-field"><select class="ums-select" data-f="phong" data-ph="Chọn phòng thi"><option value="">Chọn phòng thi</option></select></div>' }) +
            '<div class="nhch-toolbar"><div class="nhch-toolbar__nhom">' +
            '<select class="ums-select" data-k="bc2" data-ph="Chọn loại báo cáo"><option value="CAUHOIDATAODE">Báo cáo đã tạo đề</option></select>' +
            ui.btn('report', { text: 'Tải file', attr: { 'data-k': 'taiFile2' } }) + '</div>' +
            '<div class="nhch-toolbar__nhom nhch-toolbar__nhom--phai">' +
            ui.btn('search', { text: 'Tính lại điểm', icon: 'fa-calculator', mod: 'primary', attr: { 'data-k': 'tinhLai' } }) +
            ui.btn('save', { text: 'Lưu điểm', attr: { 'data-k': 'luuDiem', disabled: 'disabled', title: 'Bản gốc chưa từng chạy được (lỗi biến) — chờ xác định id cần gửi' } }) +
            '</div></div><div data-k="bang"></div>';
        var f = {};
        ['nam', 'ky', 'dot', 'hp', 'ttPhong', 'stPhong', 'tu', 'den', 'q', 'phong'].forEach(function (k) { f[k] = body.querySelector('[data-f="' + k + '"]'); });
        var bang = body.querySelector('[data-k="bang"]');
        var rows = [], daTS = [], page = { index: 1, size: 10, total: 0 };
        var dt = { qid: qid, f: f };
        var ft = pat.formTrang({
            host: root, title: 'Câu hỏi đã tạo đề', icon: 'fa-clipboard-list', cols: 1, body: body, buttons: [],
            onClose: function () { S.daTaoDe = null; }
        });
        S.daTaoDe = dt;
        pat.fill(f.ttPhong, [{ ID: '1', TEN: 'Đang mở' }, { ID: '0', TEN: 'Đang đóng' }], { head: 'Trạng thái phòng' });
        pat.fill(f.stPhong, N.TT_NHOM, { head: 'Tình trạng phòng' });
        N.ganChon(bang);
        // Năm học → Học kỳ → Đợt thi → Học phần (gốc nạp nối tiếp; ở đây khoá con khi chưa chọn cha)
        N.g('QLTTN_QuanLyThi/LayDS_NamHoc', { versionAPI: false, strStatus: '1' }).then(function (r) { pat.fill(f.nam, arr(r.data), { id: 'SCHOOLYEAR', name: 'SCHOOLYEAR', head: 'Năm học' }); }).catch(function () {});
        if (window.jQuery) {
            jQuery(f.nam).on('select2:select', function () {
                if (!f.nam.value) return;
                N.g('QLTTN_QuanLyThi/LayDS_HocKyBySchoolYear', { versionAPI: false, strStatus: '1', strSchoolYear: f.nam.value }).then(function (r) { pat.fill(f.ky, arr(r.data), { id: 'SEMESTER', name: 'SEMESTER', head: 'Học kỳ' }); }).catch(function () {});
            });
            jQuery(f.ky).on('select2:select', function () {
                if (!f.ky.value) return;
                N.g('QLTTN_QuanLyThi/LayDS_DoThiByHocKy', { versionAPI: false, strStatus: '1', strHocKy: f.ky.value }).then(function (r) { pat.fill(f.dot, arr(r.data), { name: 'NAME', head: 'Đợt thi' }); }).catch(function () {});
            });
            jQuery(f.dot).on('select2:select', function () {
                if (!f.dot.value) return;
                N.g('QLTTN_QuanLyThi/LayDS_HocPhan_TheoDotThi', { versionAPI: false, strDotThiId: f.dot.value, strNamHoc: f.nam.value, strHocKy: f.ky.value })
                    .then(function (r) { pat.fill(f.hp, arr(r.data && r.data.Table), { name: function (x) { return (e(x.MA) ? e(x.MA) + ' - ' : '') + e(x.TEN); }, head: 'Học phần' }); }).catch(function () {});
            });
            jQuery(f.phong).on('select2:select select2:clear', function () { tai(1); });
        }
        pat.chain([f.nam, f.ky, f.dot, f.hp], { phatLai: false });
        ui.enhance(body);
        function thamSo(coPhong) {
            var c = { strDotThi_Id: f.dot.value, strTrangThaiPhongThi: f.ttPhong.value, strStatus: f.stPhong.value, strHocPhanId: f.hp.value,
                strTuNgay: f.tu.value, strDenNgay: f.den.value, strTuKhoa: f.q.value, strQuestionId: qid, PageNumber: page.index, ItemPerPage: page.size };
            if (coPhong) c.strExamRoomInfoId = f.phong.value;
            return c;
        }
        function tai(p) {
            if (p) page.index = p;
            var coPhong = !!f.phong.value;
            N.g(NH + 'LayDS_CauHoiDaTaoDe', thamSo(coPhong)).then(function (r) {
                var d = r.data || {};
                rows = arr(d.Table); daTS = arr(d.Table1);
                page.total = Number(r.pager) || rows.length;
                if (!coPhong) pat.fill(f.phong, arr(d.Table2), { name: 'ROOMNAME', head: 'Chọn phòng thi' });   // gốc: lần tìm đầu đổ danh sách phòng
                ve();
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); loi(err, 'câu hỏi đã tạo đề'); });
        }
        function daLam(r) {
            return e(r.FINISHED) === '1' || e(r.TIMESTARTDOEXAM) !== '' || e(r.TIMEFINISHED) !== '' || e(r.FINISHED_PART) === '1' || e(r.TIMESTARTDOEXAM_PART) !== '' || e(r.TIMEFINISHED_PART) !== '';
        }
        function ve() {
            ui.table({
                el: bang, rows: rows, empty: 'Chưa có thí sinh nào dùng câu hỏi này',
                page: { index: page.index, size: page.size, total: page.total, sizes: ui.PAGE_SIZES, onChange: tai, onSize: function (s) { page.size = s; tai(1); } },
                columns: [
                    { title: 'Mã SV', prop: 'MASINHVIEN', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'HODEM' }, { title: 'Tên', prop: 'TEN' },
                    { title: 'Ngày thi', prop: 'EXAMDATE', cls: 'is-center is-nowrap' }, { title: 'Giờ thi', prop: 'GIOTHI', cls: 'is-center' }, { title: 'Phòng thi', prop: 'ROOMNAME' },
                    { title: 'Trạng thái', cls: 'is-center', render: function (r) { return daLam(r) ? ui.badge('Đã làm', 'bad') : ui.badge('Chưa làm', 'mute'); } },
                    { title: 'Đ/a TS', render: function (r) {
                        return daTS.filter(function (x) { return e(x.STUDENTID) === e(r.STUDENTID); }).map(function (x) { return '<div>' + ui.esc(e(x.ORDERS)) + '.' + N.html(x.CONTENT) + '</div>'; }).join('');
                    } },
                    { title: 'Điểm công nhận', prop: 'DiemCongNhan', cls: 'is-center' },
                    { title: 'Điểm tính', cls: 'is-center', width: '100px', render: function (r) { return '<input class="ums-input ums-input--so" data-diem="' + ui.esc(e(r.STUDENTEXAMROOMID)) + '" value="' + ui.esc(e(r.MARK)) + '">'; } },
                    { head: N.thead(), cls: 'is-center', width: '44px', render: function (r) { return '<input type="checkbox" data-ck="' + ui.esc(e(r.STUDENTQUESTIONID)) + '">'; } }
                ]
            });
            N.toan(bang);
        }
        body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k],[data-a="search"]'); if (!b) return;
            if (b.getAttribute('data-a') === 'search') { f.phong.value = ''; if (window.jQuery) jQuery(f.phong).trigger('change.select2'); tai(1); return; }
            var k = b.getAttribute('data-k');
            if (k === 'taiFile2') baoCao(body.querySelector('[data-k="bc2"]').value);
            else if (k === 'tinhLai') {
                var ids = N.chon(bang);
                if (!ids.length) { toast('Vui lòng chọn đối tượng cần tính lại?', 'warn'); return; }
                var chon = rows.filter(function (r) { return ids.indexOf(e(r.STUDENTQUESTIONID)) >= 0; });
                ui.batch(chon.map(function (r) {
                    return function () {
                        return N.g('TTN_ThiSinh/get_TinhLaiDiemThiSinh', { strExamRoomInfoId: e(r.EXAMROOMINFOID), strStudentExamRoomId: e(r.STUDENTEXAMROOMID), strThiSinhId: e(r.STUDENTID), strUserId: uid() })
                            .then(function (x) { var i = bang.querySelector('input[data-diem="' + e(r.STUDENTEXAMROOMID) + '"]'); if (i) i.value = e(x.data); });
                    };
                }), { title: 'Đang tính lại điểm' }).then(function (kq) { toast(kq.fail ? kq.fail + ' dòng lỗi' : 'Đã tính lại điểm', kq.fail ? 'warn' : 'ok'); });
            }
        });
        f.q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        bang.innerHTML = ui.empty('Chọn điều kiện rồi bấm "DS thí sinh"', 'fa-clipboard-list');
        return ft;
    }

    /* =====================================================================
       4. Lịch sử câu hỏi / đáp án — hộp thoại, bảng phân trang máy chủ
       ===================================================================== */
    function doi(cu, ls) { return e(cu) !== e(ls) ? '<span class="nhch-ls">' + ui.escBr(ls) + '</span>' : ui.escBr(cu); }
    function hopLichSu(loai, row) {
        var qid = e(row.ID), page = { index: 1, size: 10, total: 0 };
        var body = document.createElement('div');
        var dlg = ui.dialog({ title: loai === 'ch' ? 'Lịch sử câu hỏi' : 'Lịch sử đáp án', icon: 'fa-clock-rotate-left', size: 'xl', body: body });
        body.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        function tai(p) {
            if (p) page.index = p;
            N.g(NH + (loai === 'ch' ? 'LayDS_LichSuCauHoi' : 'LayDS_LichSuDapAn'), { strQuestionId: qid, strNguoiDung_Id: uid(), PageNumber: page.index, ItemPerPage: page.size }).then(function (r) {
                var rows = arr(r.data); page.total = Number(r.pager) || rows.length;
                var cols = loai === 'ch' ? [
                    { title: 'Order', cls: 'is-center', render: function (x) { return doi(x.ORDERS, x.ORDERS_LS); } },
                    { title: 'Nội dung câu hỏi', render: function (x) { return e(x.CONTENT) !== e(x.CONTENT_LS) ? '<span class="nhch-ls">' + N.html(x.CONTENT_LS) + '</span>' : N.html(x.CONTENT); } },
                    { title: 'Loại câu hỏi', render: function (x) { return doi(x.TENLOAICAUHOI, x.TENLOAICAUHOI_LS); } },
                    { title: 'Mức độ', render: function (x) { return doi(x.TENMUCDOCAUHOI, x.TENMUCDOCAUHOI_LS); } },
                    { title: 'Điểm(+/-)', cls: 'is-center', render: function (x) { return doi(x.DIEMCONGTRU, x.DIEMCONGTRU_LS); } },
                    { title: 'Đảo đ/a', cls: 'is-center', render: function (x) { return doi(e(x.DAODAPAN) === '1' ? 'Có' : 'Không', e(x.DAODAPAN_LS) === '1' ? 'Có' : 'Không'); } },
                    { title: 'Trạng thái', cls: 'is-center', render: function (x) { return doi(N.ttCauHoi(x.STATUS), N.ttCauHoi(x.STATUS_LS)); } },
                    { title: 'Ngày', prop: 'NGAYSUA', cls: 'is-center is-nowrap' }, { title: 'Tài khoản', prop: 'TAIKHOANSUA' }, { title: 'Hành động', prop: 'HANHDONG' }
                ] : [
                    { title: 'Order', cls: 'is-center', render: function (x) { return doi(x.ORDERS, x.ORDERS_LS); } },
                    { title: 'Fix vị trí', cls: 'is-center', render: function (x) { return doi(x.FIXVITRI, x.FIXVITRI_LS); } },
                    { title: 'Đáp án', cls: 'is-center', render: function (x) { return doi(x.CORRECT, x.CORRECT_LS); } },   // gốc in nhầm FIXVITRI_LS khi CORRECT đổi — sửa
                    { title: 'Nội đáp án', render: function (x) { return e(x.CONTENT) !== e(x.CONTENT_LS) ? '<span class="nhch-ls">' + N.html(x.CONTENT_LS) + '</span>' : N.html(x.CONTENT); } },
                    { title: 'Ngày', prop: 'NGAYSUA', cls: 'is-center is-nowrap' }, { title: 'Tài khoản', prop: 'TAIKHOANSUA' }, { title: 'Hành động', prop: 'HANHDONG' }
                ];
                ui.table({ el: body, rows: rows, columns: cols, empty: 'Chưa có lịch sử', page: { index: page.index, size: page.size, total: page.total, onChange: tai } });
                N.toan(body);
            }).catch(function (err) { body.innerHTML = ui.fail(err.message); loi(err, 'lịch sử'); });
        }
        tai(1);
        return dlg;
    }
})();
