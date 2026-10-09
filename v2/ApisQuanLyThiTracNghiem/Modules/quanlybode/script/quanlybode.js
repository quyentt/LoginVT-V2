/* =========================================================================
   Quản lý bộ đề (thi trắc nghiệm)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlybode/html/quanlybode.html + script/quanlybode.js (2.329 dòng)
   Tầng chung: _bode.js (ums.bode) + nạp chéo quanlynganhangcauhoi/_nhch.js (ums.nhch).
   ---------------------------------------------------------------------------
   Bố cục (bám gốc):
     1. Một cột: thanh lọc Đơn vị → Nhóm câu hỏi → Tình trạng + Tìm kiếm; bảng bộ đề (Tên, Nhóm câu hỏi, Trạng thái, Sửa,
        Đề thi, Cấu trúc đề, ô chọn); Tạo mới / Xóa → ums.crud (biểu mẫu thay chỗ danh sách: Đơn vị, Nhóm câu hỏi, Tên,
        Tổng thời gian, Cách tính điểm, Tình trạng).
     2. "Cấu trúc đề" thay chỗ cả màn: đầu khung Đơn vị · Bộ đề · Nhóm câu hỏi; ba tab
        · Bố cục đề thi — HAI CỘT: cây phần thi (gốc jstree) | khung "Phần thi đang chọn" (Cập nhật / Xóa) + khung "Thêm mới
          phần thi" (thêm làm phần CON của phần đang chọn, như gốc strParentId = phần đang chọn);
        · Ma trận câu hỏi — HAI CỘT: cây nhóm câu hỏi NHCH | Loại câu hỏi, Mức độ (kèm số câu trong ngoặc như gốc), Số câu trong
          NHCH, Số câu lấy ra, Phần thi, Số nhóm; nút "Chọn một trong các nhóm chi tiết", "Thêm vào đề", "Cập nhật", Xóa; bảng
          chi tiết cấu trúc (Stt CT và Số câu lấy ra sửa trong ô, dòng tổng Số câu lấy ra);
        · Cấu trúc đề — từng phần thi: tên, hướng dẫn, bảng nhóm / loại / mức độ / số câu.
     3. "Đề thi" thay chỗ cả màn: đầu khung Đơn vị · Bộ đề · Nhóm; khung "Thêm đề thi" (Tên đề thi, Số đề tạo ra — sinh đề nên hỏi
        lại); chọn báo cáo + Tải file; "Cập nhật đề thi" (tên sửa trong ô); Xóa; bảng đề thi (Tên đề thi, Số đề tạo, Chi tiết đề thi).
        Chi tiết đề thi / 4 mẫu in HTML thay chỗ khung (pat.formTrang, nút "In bài thi").
   Lời gọi (QLTTN_QuanLyBoDe/… viết tắt BD/, QLTTN_QuanLyNganHangCauHoi/… NH/; versionAPI 'v1.0'; GET trừ khi ghi POST):
     BD/LayDS_ExamStruct             strDepartorganId, strGroupQuestionId, strStatus, strTuKhoa '', strNguoiDung_Id, PageNumber, ItemPerPage
                                     → ID, NAME, MAVATENNHOM, STATUS, GROUPQUESTIONID, GROUPQUESTIONNAME, DEPARTORGANID, DEPARTORGANNAME,
                                       TINHDIEMTHEOSOCAUTRALOIDUNG, TONGTHOIGIAN
     BD/ThemMoi_ExamStruct · Sua_ExamStruct (POST)   strId, strName, strStatus, strTinhDiemTheoHeSoCauTLDung, strGroupQuestionId, strTongThoiGian,
                                     strNguoiThucHien_Id · BD/Xoa_ExamStruct (POST) strId
     NH/LayDS_ExamStructPart         strTuKhoa '', strExamStructId, strNguoiDung_Id, PageNumber 1, ItemPerPage 1000000
                                     → ID, PARENTID, TITLE, GUIDE, TOTALTIME, KIEULAMBAITHI, ORDERS
     BD/LayDS_drpExamStructPart      cùng tham số → ID, TITLE (ô chọn Phần thi)
     BD/Them_ExamStructPart (POST)   strId '', strParentId, strTitle, strGuide, strOrders, strTotalTime, strKieuLamBaiThi, strExamStructId
     BD/Sua_ExamStructPart (POST)    strId, strTitle, strGuide, strOrders, strTotalTime, strKieuLamBaiThi, strExamStructId · BD/Xoa_ExamStructPart (POST) strId
     NH/LayDS_GroupQuestionDetail    (ums.nhch.nhomCon) → ID, PARENTID, NAME, CODE, TAPHOPCACCAUHOI
     BD/LayDS_CauHoiTuNganHang       strGroupQuestionDetailId, strStatus '1', strQuestionTypeId, strLeVelId, strNguoiDung_Id
                                     → QUESTIONTYPEID, QUESTIONLEVELID (đếm số câu)
     BD/LayDS_CauTrucDeThi           strExamStructPartId ('' = mọi phần), strExamStructId → ID, ORDERS, EXAMPARTTILEPARENT, GROUPQUESTIONDETAILNAME,
                                     TEN_CHONMOTTRONGCACNHOM, SONHOMCON, QUESTIONTYPENAME, LEVELQUESTIONNAME, SOCAUTRONGNGANHANGCAUHOI, NUMBERQUESTION,
                                     LEVELQUESTIONID, QUESTIONTYPEID, GROUPQUESTIONDETAILID, EXAMSTRUCTPARTID
     BD/Them_ExamStructDetail (POST) strId '', strGroupQuestionDetailId, strDepartOrganId, strNumberQuestion, strLevelQuestionId, strQuestionTypeId,
                                     strExamstructId, strExamStructPartId, strNguoiThucHien_Id
     BD/Sua_ExamStructDetail (POST)  … + strSoNhomCon, strOrders · BD/Xoa_ExamStructDetail (POST) strId
     BD/Them_ExamStructTheoNhomCT (POST)  strId '', strDepartOrganId, strLayGroupQuestionDetailId_CT, strExamstructId, strExamStructPartId, strSoNhomCon
     BD/LayDS_WritenExam             strExamStructId → ID, NAME, SODETAO
     BD/Them_WritenExam (POST)       strId '', strName, strSoDeTao, strExamStructId · BD/Sua_WritenExam (POST) strId, strName · BD/Xoa_WritenExam (POST) strId
     BD/gen_ChiTietDeThiViet · gen_InDeThiTuLuanHTMLMau01 · gen_InDapAnDeThiVietHTMLMau01 · gen_InDeThiTracNghiemMau01 · gen_InDapAnDeThiTracNghiemMau01
                                     strWritenExamId → Data = HTML
     SYS_Report/ThemMoi (POST)       khoá: MAUTEMPLATEIMPORT.strMau_LoaiCauHoiId (gốc đọc ô #drpLoaiCauHoi_Imp không tồn tại → ''),
                                     QUANLYBODE.strWritenExamIds (nối ';'), strReportCode, strNguoiDangNhap_Id
   ---------------------------------------------------------------------------
   Lỗi gốc đã sửa / cố ý khác:
     · strDepartOrganId của Them/Sua_ExamStructDetail gốc lấy me.strDepartOrganId — chỉ được gán khi đã bấm "Sửa" bộ đề trước đó
       (vào thẳng "Cấu trúc đề" là gửi undefined); Them_ExamStructTheoNhomCT đọc me.strDepartorganId (sai chữ hoa, không bao giờ có)
       → nay gửi DEPARTORGANID của dòng bộ đề.
     · Nhóm câu hỏi ở thanh lọc: ô con KHOÁ tới khi chọn Đơn vị (luật cha → con); gốc lọc nhóm "Hiện" ('1') — giữ.
     · Mọi lệnh hàng loạt (xoá, cập nhật nhiều dòng) chờ xong rồi nạp lại (gốc setTimeout 2 giây) và chỉ gửi dòng có thay đổi
       (gốc "Cập nhật" gửi MỌI dòng trong bảng). Gốc gắn $("#btnYes").click chồng nhau mỗi lần hỏi → bản mới hỏi bằng ui.confirm.
     · Gốc nút Xóa / Cập nhật của bảng cấu trúc nạp lại sau 2 giây dù người dùng bấm "Không" → nay chỉ nạp lại khi đã chạy.
     · Cách tính điểm là hai ô radio → ô chọn hai mục của biểu mẫu crud (giá trị '1' / '0' như gốc).
     · Hàm closePhieu() gốc gọi sau khi in (dọn vùng của màn Phiếu thu, không có ở đây) → bỏ. getList_MauImport gốc không gọi → bỏ.
     · Ô "Tổng thời gian", "Số câu lấy ra", "Số nhóm", "Số đề tạo ra", "Số thứ tự", "Thời gian làm bài" là ô số (gốc ô chữ).
   Giữ như gốc (nghi sai, không đổi): strSoNhomCon của Sua_ExamStructDetail gửi cùng giá trị với strNumberQuestion (ô "Số câu lấy ra").
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nhch, B = ums.bode;
    var BD = B.BD, NH = B.NH, e = B.e, arr = B.arr, uid = B.uid, toast = B.toast, loi = B.loi;
    var root = document.getElementById('qlttn-bode');
    if (!root) return;

    root.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
    var zDs = root.querySelector('[data-z="ds"]'), zCt = root.querySelector('[data-z="ct"]');

    var TINHDIEM = [{ ID: '1', TEN: 'Theo số câu trả lời đúng' }, { ID: '0', TEN: 'Theo số ý trả lời đúng' }];
    var KIEU_LAM_BAI = [{ ID: 'THIONLINE', TEN: 'Thi online' }, { ID: 'THITULUAN', TEN: 'Thi tự luận (Attach files)' }, { ID: 'THITULUANVANBAN', TEN: 'Thi tự luận (Nhập văn bản)' },
        { ID: 'THINGOAINGU', TEN: 'Thi ngoại ngữ' }, { ID: 'HIENTHITOANBOCAUHOI', TEN: 'Hiển thị toàn bộ câu hỏi' }];
    /* Khung thêm mới của gốc chỉ có ba kiểu */
    var KIEU_LAM_BAI_MOI = [{ ID: 'THIONLINE', TEN: 'Thi online' }, { ID: 'THITULUAN', TEN: 'Thi tự luận' }, { ID: 'THINGOAINGU', TEN: 'Thi ngoại ngữ' }];
    var BAO_CAO = [
        { ID: 'InDeThiVietHTML', TEN: 'In đề thi' }, { ID: 'InDeThiTuLuanHTMLMau01', TEN: 'In đề thi tự luận (Mẫu 01)' },
        { ID: 'InDapAnDeThiVietHTMLMau01', TEN: 'In đáp án tự luận (Mẫu 01)' }, { ID: 'InDeThiTracNghiemMau01', TEN: 'In đề thi trắc nghiệm (Mẫu 01)' },
        { ID: 'InDapAnDeThiTracNghiemMau01', TEN: 'In đáp án đề thi trắc nghiệm (Mẫu 01)' }, { ID: 'InBaoCaobangPhanTichDoPhanBiet', TEN: 'Bảng phân biệt' },
        { ID: 'InBaoCaoPhanTichCauHoiTheoDeThi', TEN: 'In báo cáo phân tích câu hỏi' }, { ID: 'PhanTichDoKhoBoDe', TEN: 'Phân tích độ khó bộ đề' },
        { ID: 'InBaoCaoChiTietPhanTichCauHoiTheoDeThi', TEN: 'In báo cáo chi tiết phân tích câu hỏi' }, { ID: 'InDeThiTracNghiem_Doc_Mau01', TEN: 'In đề thi trắc nghiệm (File doc)' },
        { ID: 'InDeThiTracNghiem_Doc_Mau02', TEN: 'In đề thi trắc nghiệm Tiếng Anh (File doc)' }, { ID: 'InDeThiTracNghiemMau02', TEN: 'In đề thi trắc nghiệm (Mẫu 02)' }
    ];
    /* Bốn mẫu in dựng HTML tại chỗ (gốc gen_In… → zoneInDeThiTuLuanHTMLMau01) */
    var IN_HTML = { InDeThiTuLuanHTMLMau01: 'gen_InDeThiTuLuanHTMLMau01', InDapAnDeThiVietHTMLMau01: 'gen_InDapAnDeThiVietHTMLMau01',
        InDeThiTracNghiemMau01: 'gen_InDeThiTracNghiemMau01', InDapAnDeThiTracNghiemMau01: 'gen_InDapAnDeThiTracNghiemMau01' };

    function sel(rows, k, ph) {
        return '<select class="ums-select" data-k="' + k + '" data-ph="' + ui.esc(ph) + '"><option value="">' + ui.esc(ph) + '</option>' +
            rows.map(function (r) { return '<option value="' + ui.esc(r.ID) + '">' + ui.esc(r.TEN) + '</option>'; }).join('') + '</select>';
    }
    function inp(k, so) { return '<input class="ums-input' + (so ? ' ums-input--so' : '') + '" data-k="' + k + '" autocomplete="off"' + (so ? ' inputmode="numeric"' : '') + '>'; }
    function s2(el) { if (window.jQuery) jQuery(el).trigger('change.select2'); }

    /* =====================================================================
       1. Danh sách bộ đề — ums.crud (một cột như gốc)
       ===================================================================== */
    var crud = ums.crud({
        root: zDs,
        title: 'Quản lý bộ đề', listTitle: 'Danh sách', formTitle: 'bộ đề', icon: 'fa-files',
        addText: 'Tạo mới', removeText: 'Xóa',
        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: B.nguonDonVi() },
            { key: 'gq', type: 'select', label: 'Chọn nhóm câu hỏi', source: { items: [] } },
            { key: 'st', type: 'select', label: 'Tình trạng (Ẩn/Hiện)', source: { items: B.TRANGTHAI } }
        ],
        list: {
            paged: true,
            call: function (f, p) {
                return { action: BD + 'LayDS_ExamStruct', method: 'GET', versionAPI: B.V, strDepartorganId: f.dv || '', strGroupQuestionId: f.gq || '',
                    strStatus: f.st || '', strTuKhoa: '', strNguoiDung_Id: uid(), PageNumber: p.index, ItemPerPage: p.size };
            }
        },
        columns: [
            { title: 'Tên', prop: 'NAME' },
            { title: 'Nhóm câu hỏi', prop: 'MAVATENNHOM', width: '30%' },
            { title: 'Trạng thái', cls: 'is-center', width: '10%', render: function (r) { return B.trangThai(r.STATUS); } }
        ],
        rowActions: [
            { icon: 'fa-file-lines', title: 'Đề thi', onClick: function (row) { moDeThi(row); } },
            { icon: 'fa-sitemap', title: 'Cấu trúc đề', onClick: function (row) { moCauTruc(row); } }
        ],
        rowDelete: false, multi: true,
        fields: [
            { key: '_dv', type: 'static', label: 'Đơn vị', get: function (row) { return e(row.DEPARTORGANNAME); } },
            { key: 'strGroupQuestionId', col: 'GROUPQUESTIONID', type: 'select', label: 'Nhóm câu hỏi', required: true, placeholder: 'Chọn nhóm', source: { items: [] } },
            { key: 'strName', col: 'NAME', label: 'Tên', required: true },
            { key: 'strTongThoiGian', col: 'TONGTHOIGIAN', type: 'number', label: 'Tổng thời gian (chỉ nhập khi có nhiều phần)' },
            { key: 'strTinhDiemTheoHeSoCauTLDung', type: 'select', label: 'Cách tính điểm', required: true, value: '1', source: { items: TINHDIEM },
                get: function (row) { return e(row.TINHDIEMTHEOSOCAUTRALOIDUNG) === '1' ? '1' : '0'; } },
            { key: 'strStatus', col: 'STATUS', type: 'select', label: 'Tình trạng', required: true, placeholder: 'Tình trạng (Ẩn/Hiện)', source: { items: B.TRANGTHAI } }
        ],
        save: function (v, row) {
            return { action: BD + (row ? 'Sua_ExamStruct' : 'ThemMoi_ExamStruct'), method: 'POST', versionAPI: B.V, strId: row ? e(row.ID) : '',
                strName: v.strName, strStatus: v.strStatus, strTinhDiemTheoHeSoCauTLDung: v.strTinhDiemTheoHeSoCauTLDung,
                strGroupQuestionId: v.strGroupQuestionId, strTongThoiGian: v.strTongThoiGian, strNguoiThucHien_Id: uid() };
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: BD + 'Xoa_ExamStruct', method: 'POST', versionAPI: B.V, strId: id, strNguoiThucHien_Id: uid() }; });
        },
        onForm: function (row) {
            // Thêm mới: Đơn vị (chỉ hiện) = đơn vị đang lọc (gốc lblDonVi = text của drpDonVi); ô Nhóm đổ theo đơn vị + ô Tình trạng lọc (gốc)
            var dvEl = zDs.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="_dv"]');
            if (dvEl && !row) dvEl.textContent = loc.dvTen();
            B.oNhomForm(crud, 'strGroupQuestionId', row ? (e(row.DEPARTORGANID) || loc.dv()) : loc.dv(), loc.st(), 'GROUPQUESTIONNAME', row ? e(row.GROUPQUESTIONID) : '');
        }
    });
    var loc = B.loc(crud, { stNhom: '1', tenNhom: B.tenNhomMa });
    B.chanThem(crud, loc);

    function dongChiTiet() {
        zCt.hidden = true; zCt.innerHTML = ''; zDs.hidden = false;
        crud.load();
    }
    function khungChiTiet(tieuDe, icon, row, them) {
        zDs.hidden = true; zCt.hidden = false;
        zCt.innerHTML = pat.panel({ title: tieuDe, icon: icon, tools: ui.btn('close', { attr: { 'data-k': 'dong' } }), body: B.kvDau(row) }) + (them || '');
        zCt.querySelector('[data-k="dong"]').addEventListener('click', dongChiTiet);
    }

    /* =====================================================================
       2. Cấu trúc đề thi — ba tab
       ===================================================================== */
    function moCauTruc(row) {
        var S = { id: e(row.ID), dv: e(row.DEPARTORGANID), gq: e(row.GROUPQUESTIONID), partId: '', parts: [], all: [], chiTiet: [],
            nhomId: '', nhomRow: null, tapHop: '0', chTuNH: [], loai: [], muc: [] };
        khungChiTiet('Cấu trúc đề thi', 'fa-sitemap', row,
            '<div class="bode-tabs">' + ui.tabs([{ key: 'bocuc', text: 'Bố cục đề thi', icon: 'fa-list-tree' }, { key: 'matran', text: 'Ma trận câu hỏi', icon: 'fa-table-cells' },
                { key: 'xem', text: 'Cấu trúc đề', icon: 'fa-file-lines' }], 'bocuc', 'data-tab') + '</div>' +
            '<div data-z="bocuc"></div><div data-z="matran" hidden></div><div data-z="xem" hidden></div>');
        var p1 = zCt.querySelector('[data-z="bocuc"]'), p2 = zCt.querySelector('[data-z="matran"]'), p3 = zCt.querySelector('[data-z="xem"]');
        zCt.querySelector('.bode-tabs').addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-tab]'); if (!a) return;
            var k = a.getAttribute('data-tab');
            ui.tabsActive(zCt, k, 'data-tab');
            p1.hidden = k !== 'bocuc'; p2.hidden = k !== 'matran'; p3.hidden = k !== 'xem';
        });

        /* ---------- Tab 1: Bố cục đề thi (cây phần thi | sửa + thêm) ---------- */
        var m1 = B.haiCot(p1, { tieuDeTrai: 'Thông tin các phần thi', icon: 'fa-list-tree' });
        m1.mainBody.innerHTML =
            pat.panel({ title: 'Phần thi đang chọn', icon: 'fa-pen-to-square', cls: 'bode-phan',
                body: '<div class="ums-grid ums-grid--2" data-k="fSua">' +
                    ui.field('Tên', inp('title'), { required: true }) + ui.field('Nội dung hướng dẫn', inp('guide'), { required: true }) +
                    ui.field('Thời gian làm bài', inp('time', true), { required: true }) + ui.field('Kiểu làm bài thi', sel(KIEU_LAM_BAI, 'kieu', 'Chọn kiểu làm bài thi'), { required: true }) +
                    ui.field('Số thứ tự', inp('orders', true)) + '</div>',
                foot: ui.btn('del', { text: 'Xóa', attr: { 'data-k': 'xoaPhan' } }) + ui.btn('save', { text: 'Cập nhật', attr: { 'data-k': 'suaPhan' } }) }) +
            pat.panel({ title: 'Thêm mới phần thi', icon: 'fa-plus', cls: 'bode-phan',
                body: '<div class="ums-u-faint ums-u-fz13 ums-u-mb-3" data-k="chaMoi"></div><div class="ums-grid ums-grid--2" data-k="fMoi">' +
                    ui.field('Tên', inp('title'), { required: true }) + ui.field('Nội dung hướng dẫn', inp('guide'), { required: true }) +
                    ui.field('Kiểu làm bài thi', sel(KIEU_LAM_BAI_MOI, 'kieu', 'Chọn kiểu làm bài thi'), { required: true }) + ui.field('Thời gian làm bài', inp('time', true), { required: true }) +
                    ui.field('Số thứ tự', inp('orders', true)) + '</div>',
                foot: ui.btn('add', { text: 'Thêm mới', attr: { 'data-k': 'themPhan' } }) });
        var fSua = m1.mainBody.querySelector('[data-k="fSua"]'), fMoi = m1.mainBody.querySelector('[data-k="fMoi"]'), chaMoi = m1.mainBody.querySelector('[data-k="chaMoi"]');
        function o(f, k) { return f.querySelector('[data-k="' + k + '"]'); }
        ui.enhance(m1.mainBody);
        function datPhan(r) {
            o(fSua, 'title').value = e(r.TITLE); o(fSua, 'guide').value = e(r.GUIDE); o(fSua, 'time').value = e(r.TOTALTIME);
            o(fSua, 'orders').value = e(r.ORDERS); o(fSua, 'kieu').value = e(r.KIEULAMBAITHI); s2(o(fSua, 'kieu'));
            chaMoi.textContent = 'Phần mới sẽ là phần con của: ' + e(r.TITLE);
        }
        function xoaFormSua() {
            ['title', 'guide', 'time', 'orders', 'kieu'].forEach(function (k) { o(fSua, k).value = ''; });
            s2(o(fSua, 'kieu'));
            chaMoi.textContent = 'Chưa chọn phần thi: phần mới sẽ là phần gốc';
        }
        xoaFormSua();
        function taiPhan() {
            return B.g(NH + 'LayDS_ExamStructPart', { strTuKhoa: '', strExamStructId: S.id, strNguoiDung_Id: uid(), PageNumber: 1, ItemPerPage: 1000000 }).then(function (r) {
                S.parts = arr(r.data);
                if (m1.sideCount) m1.sideCount.textContent = S.parts.length ? '(' + S.parts.length + ')' : '';
                N.cay(m1.sideBody, S.parts, { chon: S.partId, ten: 'TITLE', ma: false, empty: 'Chưa có phần thi', onChon: function (id, p) { S.partId = id; datPhan(p || {}); } });
                var dang = S.parts.filter(function (p) { return e(p.ID) === S.partId; })[0];
                if (S.partId && !dang) { S.partId = ''; xoaFormSua(); }
                veXem();
            }).catch(function (err) { loi(err, 'phần thi'); });
        }
        function kiemPhan(f) {
            if (!o(f, 'title').value.trim() || !o(f, 'guide').value.trim() || !o(f, 'kieu').value || !o(f, 'time').value.trim()) {
                toast('Nhập đủ Tên, Nội dung hướng dẫn, Kiểu làm bài thi, Thời gian làm bài', 'warn'); return false;
            }
            return true;
        }
        function sauPhan() { taiPhan(); taiDrpPhan(); }
        m1.mainBody.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k]'); if (!b) return;
            var k = b.getAttribute('data-k');
            if (k === 'suaPhan') {
                if (!S.partId) { toast('Chưa chọn phần thi ở cột bên trái', 'warn'); return; }
                if (!kiemPhan(fSua)) return;
                B.g(BD + 'Sua_ExamStructPart', { strId: S.partId, strTitle: o(fSua, 'title').value, strGuide: o(fSua, 'guide').value, strOrders: o(fSua, 'orders').value,
                    strTotalTime: o(fSua, 'time').value, strKieuLamBaiThi: o(fSua, 'kieu').value, strExamStructId: S.id, strNguoiThucHien_Id: uid() }, true)
                    .then(function () { toast('Thực hiện thành công'); sauPhan(); }).catch(function (err) { loi(err, 'cập nhật phần thi'); });
            } else if (k === 'themPhan') {
                if (!kiemPhan(fMoi)) return;
                B.g(BD + 'Them_ExamStructPart', { strId: '', strParentId: S.partId, strTitle: o(fMoi, 'title').value, strGuide: o(fMoi, 'guide').value, strOrders: o(fMoi, 'orders').value,
                    strTotalTime: o(fMoi, 'time').value, strKieuLamBaiThi: o(fMoi, 'kieu').value, strExamStructId: S.id, strNguoiThucHien_Id: uid() }, true)
                    .then(function () {
                        toast('Thực hiện thành công');
                        ['title', 'guide', 'time', 'orders', 'kieu'].forEach(function (x) { o(fMoi, x).value = ''; }); s2(o(fMoi, 'kieu'));
                        sauPhan();
                    }).catch(function (err) { loi(err, 'thêm phần thi'); });
            } else if (k === 'xoaPhan') {
                if (!S.partId) { toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                    if (!yes) return;
                    return B.g(BD + 'Xoa_ExamStructPart', { strId: S.partId, strNguoiThucHien_Id: uid() }, true).then(function () {
                        toast('Thực hiện thành công'); S.partId = ''; xoaFormSua(); sauPhan();
                    });
                }).catch(function (err) { loi(err, 'xoá phần thi'); });
            }
        });

        /* ---------- Tab 2: Ma trận câu hỏi (cây nhóm NHCH | khai số câu + bảng) ---------- */
        var m2 = B.haiCot(p2, { tieuDeTrai: 'Thông tin', icon: 'fa-folder-tree' });
        m2.mainBody.innerHTML = pat.panel({
            title: 'Danh sách nhóm câu hỏi', icon: 'fa-list-check', count: 'dem', flush: true,
            tools: ui.xoaChon('input[data-ck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-k': 'xoaCT' } }),
            body: '<div class="bode-dau">' +
                '<div class="bode-nhom"><b data-k="tenNhom">Chọn một nhóm câu hỏi ở cột bên trái</b><span class="ums-badge ums-badge--info" data-k="tapHop" hidden>LÀ TẬP HỢP CÁC CÂU HỎI</span></div>' +
                '<div class="ums-grid ums-grid--2">' +
                ui.field('Loại câu hỏi', '<select class="ums-select" data-k="loai" data-ph="--Chọn loại câu hỏi--"><option value="">--Chọn loại câu hỏi--</option></select>') +
                ui.field('Mức độ', '<select class="ums-select" data-k="muc" data-ph="--Chọn mức độ--"><option value="">--Chọn mức độ--</option></select>') +
                ui.field('Số câu trong NHCH', '<div class="ums-input" style="display:flex;align-items:center" data-k="soCau"></div>') +
                ui.field('Số câu lấy ra', inp('layRa', true)) +
                ui.field('Phần thi', '<select class="ums-select" data-k="phan" data-ph="Chọn phần thi"><option value="">Chọn phần thi</option></select>', { required: true }) +
                ui.field('Số nhóm', '<input class="ums-input ums-input--so" data-k="soNhom" placeholder="Số nhóm" title="Nhập số nhóm" autocomplete="off" inputmode="numeric">') +
                '</div>' +
                '<div class="bode-nut">' +
                ui.btn('add', { text: 'Chọn một trong các nhóm chi tiết', mod: 'out-primary', attr: { 'data-k': 'themNhomCT', title: 'Hệ thống sẽ chọn 1 trong các phần chi tiết của nhóm câu trong cấu trúc cây đang chọn' } }) +
                ui.btn('add', { text: 'Thêm vào đề', attr: { 'data-k': 'themVaoDe' } }) +
                ui.btn('save', { text: 'Cập nhật', attr: { 'data-k': 'capNhatCT', title: 'Cập nhật Stt cấu trúc / Số câu lấy ra đã sửa trong bảng' } }) +
                '</div></div><div data-k="bang"></div>'
        });
        var h2 = m2.mainBody, q2 = function (k) { return h2.querySelector('[data-k="' + k + '"]'); };
        var bang2 = q2('bang');
        N.ganChon(bang2);
        ui.enhance(h2);
        bang2.innerHTML = ui.empty('Chưa có dòng nào trong cấu trúc đề', 'fa-table-cells');
        Promise.all([N.loaiCauHoi(), N.mucDo()]).then(function (kq) { S.loai = kq[0]; S.muc = kq[1]; veLoaiMuc(); }).catch(function (err) { loi(err, 'loại / mức độ câu hỏi'); });
        /** Loại / Mức độ kèm số câu trong ngoặc (gốc gen_drp…ByGroupQuestionDetail đếm trên dtCauHoiTuNganHang) */
        function veLoaiMuc() {
            var loaiV = q2('loai').value;
            pat.fill(q2('loai'), S.loai.map(function (l) {
                var n = S.chTuNH.filter(function (c) { return e(c.QUESTIONTYPEID) === e(l.ID); }).length;
                return { ID: l.ID, TEN: e(l.NAME) + ' ( ' + n + ' )' };
            }), { head: '--Chọn loại câu hỏi--' });
            var theoLoai = loaiV ? S.chTuNH.filter(function (c) { return e(c.QUESTIONTYPEID) === loaiV; }) : S.chTuNH;
            pat.fill(q2('muc'), S.muc.map(function (m) {
                var n = theoLoai.filter(function (c) { return e(c.QUESTIONLEVELID) === e(m.ID); }).length;
                return { ID: m.ID, TEN: e(m.NAME) + ' ( ' + n + ' )' };
            }), { head: '--Chọn mức độ--' });
        }
        function soCau() {
            if (!S.nhomId) { q2('soCau').textContent = ''; return; }
            B.g(BD + 'LayDS_CauHoiTuNganHang', { strGroupQuestionDetailId: S.nhomId, strStatus: '1', strQuestionTypeId: q2('loai').value, strLeVelId: q2('muc').value, strNguoiDung_Id: uid() })
                .then(function (r) { q2('soCau').textContent = String(arr(r.data).length); }).catch(function (err) { loi(err, 'số câu hỏi'); });
        }
        function taiCay() {
            return N.nhomCon(S.gq).then(function (kq) {
                if (m2.sideCount) m2.sideCount.textContent = kq.rows.length ? '(' + kq.rows.length + ')' : '';
                N.cay(m2.sideBody, kq.rows, { chon: S.nhomId, onChon: function (id, r) {
                    S.nhomId = id; S.nhomRow = r || null;
                    S.tapHop = e(r && r.TAPHOPCACCAUHOI) === '1' ? '1' : '0';
                    q2('tenNhom').textContent = e(r && r.NAME);
                    q2('tapHop').hidden = S.tapHop !== '1';
                    soCau();
                    B.g(BD + 'LayDS_CauHoiTuNganHang', { strGroupQuestionDetailId: S.nhomId, strStatus: '1', strQuestionTypeId: '', strLeVelId: '', strNguoiDung_Id: uid() })
                        .then(function (x) { S.chTuNH = arr(x.data); veLoaiMuc(); }).catch(function (err) { loi(err, 'câu hỏi từ ngân hàng'); });
                } });
            }).catch(function (err) { loi(err, 'nhóm câu hỏi'); });
        }
        function taiDrpPhan() {
            return B.g(BD + 'LayDS_drpExamStructPart', { strTuKhoa: '', strExamStructId: S.id, strNguoiDung_Id: uid(), PageNumber: 1, ItemPerPage: 1000000 })
                .then(function (r) { pat.fill(q2('phan'), arr(r.data), { name: 'TITLE', head: 'Chọn phần thi' }); }).catch(function (err) { loi(err, 'phần thi'); });
        }
        function taiChiTiet() {
            return B.g(BD + 'LayDS_CauTrucDeThi', { strExamStructPartId: q2('phan').value, strExamStructId: S.id }).then(function (r) {
                S.chiTiet = arr(r.data);
                veChiTiet();
            }).catch(function (err) { bang2.innerHTML = ui.fail(err.message); loi(err, 'cấu trúc đề thi'); });
        }
        function taiTatCa() {
            return B.g(BD + 'LayDS_CauTrucDeThi', { strExamStructPartId: '', strExamStructId: S.id }).then(function (r) { S.all = arr(r.data); veXem(); })
                .catch(function (err) { loi(err, 'cấu trúc đề thi'); });
        }
        function sauChiTiet() { taiChiTiet(); taiTatCa(); }
        function laNhomCT(r) { return e(r.TEN_CHONMOTTRONGCACNHOM) !== ''; }
        function veChiTiet() {
            ui.table({
                el: bang2, rows: S.chiTiet, empty: 'Chưa có dòng nào trong cấu trúc đề',
                columns: [
                    { title: 'Stt CT', cls: 'is-center', width: '80px', render: function (r) { return '<input class="ums-input bode-stt" data-stt="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(r.ORDERS)) + '">'; } },
                    { title: 'Phần', prop: 'EXAMPARTTILEPARENT' },
                    { title: 'Tên nhóm NHCH', render: function (r) {
                        if (!laNhomCT(r)) return ui.esc(e(r.GROUPQUESTIONDETAILNAME));
                        return 'Chọn <b class="ums-u-bad">' + ui.esc(e(r.SONHOMCON)) + '</b> trong nhóm:<br><span class="ums-u-info">' + ui.esc(e(r.TEN_CHONMOTTRONGCACNHOM)) + '</span>';
                    } },
                    { title: 'Loại câu hỏi', prop: 'QUESTIONTYPENAME', cls: 'is-center' },
                    { title: 'Mức độ', prop: 'LEVELQUESTIONNAME', cls: 'is-center' },
                    { title: 'Số câu trong NHCH', prop: 'SOCAUTRONGNGANHANGCAUHOI', cls: 'is-center' },
                    { title: 'Số câu lấy ra', cls: 'is-center', width: '110px', sum: function (rows) {
                        var t = 0; rows.forEach(function (r) { t += Number(laNhomCT(r) ? r.SONHOMCON : r.NUMBERQUESTION) || 0; }); return '<b>' + t + '</b>';
                    }, render: function (r) {
                        return '<input class="ums-input bode-socau" data-socau="' + ui.esc(e(r.ID)) + '" value="' + ui.esc(e(laNhomCT(r) ? r.SONHOMCON : r.NUMBERQUESTION)) + '">';
                    } },
                    { head: N.thead(), cls: 'is-center', width: '44px', render: function (r) { return '<input type="checkbox" data-ck="' + ui.esc(e(r.ID)) + '">'; } }
                ]
            });
            var dem = h2.querySelector('[data-z="dem"]');
            if (dem) dem.textContent = S.chiTiet.length ? '(' + S.chiTiet.length + ')' : '';
            if (ui.demXoaChon) ui.demXoaChon();
        }
        if (window.jQuery) {
            jQuery(q2('phan')).on('select2:select select2:clear', function () { taiChiTiet(); });
            jQuery(q2('loai')).on('select2:select select2:clear', function () { veLoaiMuc(); soCau(); });   // gốc: đổi loại là vẽ lại mức độ (đếm theo loại) + đếm số câu
            jQuery(q2('muc')).on('select2:select select2:clear', function () { soCau(); });
        }
        h2.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-k]'); if (!b) return;
            var k = b.getAttribute('data-k');
            if (k === 'themVaoDe') {
                if (!q2('phan').value) { toast('Chưa chọn phần thi', 'warn'); return; }
                if (!S.nhomId) { toast('Chưa chọn nhóm NHCH', 'warn'); return; }
                if (S.tapHop === '1') toast('Hệ thống sẽ thêm tất cả các câu hỏi thuộc nhóm khi tạo đề', 'info');
                else if (!q2('loai').value || !q2('muc').value || !q2('layRa').value.trim()) { toast('Chọn Loại câu hỏi, Mức độ và nhập Số câu lấy ra', 'warn'); return; }
                B.g(BD + 'Them_ExamStructDetail', { strId: '', strGroupQuestionDetailId: S.nhomId, strDepartOrganId: S.dv, strNumberQuestion: q2('layRa').value,
                    strLevelQuestionId: q2('muc').value, strQuestionTypeId: q2('loai').value, strExamstructId: S.id, strExamStructPartId: q2('phan').value, strNguoiThucHien_Id: uid() }, true)
                    .then(function () { toast('Thực hiện thành công'); sauChiTiet(); }).catch(function (err) { loi(err, 'thêm vào đề'); });
            } else if (k === 'themNhomCT') {
                if (!q2('phan').value) { toast('Chưa chọn phần thi', 'warn'); return; }
                if (!q2('soNhom').value.trim()) { toast('Chưa nhập số nhóm', 'warn'); return; }
                if (!S.nhomId) { toast('Chưa chọn nhóm NHCH', 'warn'); return; }
                B.g(BD + 'Them_ExamStructTheoNhomCT', { strId: '', strDepartOrganId: S.dv, strLayGroupQuestionDetailId_CT: S.nhomId, strExamstructId: S.id,
                    strExamStructPartId: q2('phan').value, strSoNhomCon: q2('soNhom').value, strNguoiThucHien_Id: uid() }, true)
                    .then(function () { toast('Thực hiện thành công'); sauChiTiet(); }).catch(function (err) { loi(err, 'chọn nhóm chi tiết'); });
            } else if (k === 'capNhatCT') {
                B.capNhatDong({
                    rows: S.chiTiet, title: 'Cập nhật cấu trúc đề', hoi: 'Bạn có chắc chắn cập nhật dữ liệu không?',
                    call: function (r) {
                        var i1 = bang2.querySelector('input[data-stt="' + e(r.ID) + '"]'), i2 = bang2.querySelector('input[data-socau="' + e(r.ID) + '"]');
                        if (!i1 || !i2) return null;
                        var stt = i1.value, so = i2.value, soGoc = e(laNhomCT(r) ? r.SONHOMCON : r.NUMBERQUESTION);
                        if (stt === e(r.ORDERS) && so === soGoc) return null;
                        return { action: BD + 'Sua_ExamStructDetail', method: 'POST', versionAPI: B.V, strId: e(r.ID), strGroupQuestionDetailId: e(r.GROUPQUESTIONDETAILID), strDepartOrganId: S.dv,
                            strNumberQuestion: so, strLevelQuestionId: e(r.LEVELQUESTIONID), strQuestionTypeId: e(r.QUESTIONTYPEID), strSoNhomCon: so, strOrders: stt,
                            strExamstructId: S.id, strExamStructPartId: e(r.EXAMSTRUCTPARTID), strNguoiThucHien_Id: uid() };
                    },
                    sau: sauChiTiet
                });
            } else if (k === 'xoaCT') {
                B.xoaIds({ ids: N.chon(bang2), action: BD + 'Xoa_ExamStructDetail', sau: sauChiTiet });
            }
        });

        /* ---------- Tab 3: Cấu trúc đề (chỉ xem) ---------- */
        function veXem() {
            if (!S.parts.length) { p3.innerHTML = ui.empty('Chưa có phần thi nào', 'fa-file-lines'); return; }
            p3.innerHTML = pat.panel({ title: 'Cấu trúc đề', icon: 'fa-file-lines', body: S.parts.map(function (p, i) {
                return '<div class="bode-view__phan"><div class="bode-view__ten">' + ui.esc(e(p.TITLE)) + '</div><div class="bode-view__hd">' + ui.esc(e(p.GUIDE)) + '</div><div data-phan="' + i + '"></div></div>';
            }).join('') });
            S.parts.forEach(function (p, i) {
                ui.table({
                    el: p3.querySelector('[data-phan="' + i + '"]'), empty: 'Chưa có nhóm câu hỏi trong phần này',
                    rows: S.all.filter(function (d) { return e(d.EXAMSTRUCTPARTID) === e(p.ID); }),
                    columns: [
                        { title: 'Tên', prop: 'GROUPQUESTIONDETAILNAME' }, { title: 'Loại câu hỏi', prop: 'QUESTIONTYPENAME' }, { title: 'Mức độ', prop: 'LEVELQUESTIONNAME' },
                        { title: 'Số câu trong NHCH', prop: 'SOCAUTRONGNGANHANGCAUHOI', cls: 'is-center' }, { title: 'Số câu lấy ra', prop: 'NUMBERQUESTION', cls: 'is-center' }
                    ]
                });
            });
        }

        taiPhan(); taiDrpPhan(); taiCay(); taiChiTiet(); taiTatCa();
    }

    /* =====================================================================
       3. Đề thi của bộ đề
       ===================================================================== */
    function moDeThi(row) {
        var S = { id: e(row.ID), rows: [] };
        khungChiTiet('Đề thi', 'fa-file-lines', row,
            pat.panel({ title: 'Thêm đề thi', icon: 'fa-plus',
                body: '<div class="ums-grid ums-grid--2">' + ui.field('Tên đề thi', inp('ten'), { required: true }) + ui.field('Số đề tạo ra', inp('soDe', true), { required: true }) + '</div>',
                foot: ui.btn('add', { text: 'Thêm đề thi', attr: { 'data-k': 'themDe' } }) }) +
            pat.panel({ title: 'Danh sách đề thi', icon: 'fa-list', count: 'dem', flush: true,
                body: '<div class="bode-dau"><div class="nhch-toolbar"><div class="nhch-toolbar__nhom">' +
                    '<select class="ums-select" data-k="bc" data-ph="Chọn loại báo cáo"><option value="">Chọn loại báo cáo</option></select>' +
                    ui.btn('report', { text: 'Tải file', attr: { 'data-k': 'taiFile' } }) + '</div>' +
                    '<div class="nhch-toolbar__nhom nhch-toolbar__nhom--phai">' +
                    ui.btn('save', { text: 'Cập nhật đề thi', attr: { 'data-k': 'capNhatDe', title: 'Lưu tên đề thi đã sửa trong bảng' } }) +
                    ui.xoaChon('input[data-ck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-k': 'xoaDe' } }) +
                    '</div></div></div><div data-k="bang"></div>' }));
        var q = function (k) { return zCt.querySelector('[data-k="' + k + '"]'); };
        var bang = q('bang');
        pat.fill(q('bc'), BAO_CAO, { head: 'Chọn loại báo cáo' });
        N.ganChon(bang);
        ui.enhance(zCt);
        function tai() {
            return B.g(BD + 'LayDS_WritenExam', { strExamStructId: S.id }).then(function (r) {
                S.rows = arr(r.data);
                ui.table({
                    el: bang, rows: S.rows, empty: 'Chưa có đề thi nào',
                    columns: [
                        { title: 'Tên đề thi', render: function (x) { return '<input class="ums-input bode-ten" data-ten="' + ui.esc(e(x.ID)) + '" value="' + ui.esc(e(x.NAME)) + '">'; } },
                        { title: 'Số đề tạo', prop: 'SODETAO', cls: 'is-center', width: '110px' },
                        { title: 'Xem', cls: 'is-center is-nowrap', render: function (x) { return ui.btn('view', { text: 'Chi tiết đề thi', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-xem': e(x.ID) } }); } },
                        { head: N.thead(), cls: 'is-center', width: '44px', render: function (x) { return '<input type="checkbox" data-ck="' + ui.esc(e(x.ID)) + '">'; } }
                    ]
                });
                var dem = zCt.querySelector('[data-z="dem"]');
                if (dem) dem.textContent = S.rows.length ? '(' + S.rows.length + ')' : '';
                if (ui.demXoaChon) ui.demXoaChon();
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); loi(err, 'đề thi'); });
        }
        function tenBC(code) { var r = BAO_CAO.filter(function (x) { return x.ID === code; })[0]; return r ? r.TEN : 'Báo cáo'; }
        function baoCao(code) {
            if (!code) { toast('Chưa chọn loại báo cáo', 'warn'); return; }
            var ids = N.chon(bang);
            if (!ids.length) { toast('Bạn chưa chọn đề thi', 'warn'); return; }
            if (IN_HTML[code]) {
                if (ids.length > 1) { toast('Bạn chọn quá 1 đề thi', 'warn'); return; }
                B.xem(zCt, { title: tenBC(code), call: { action: BD + IN_HTML[code], strWritenExamId: ids[0] } });
                return;
            }
            if ((code === 'InDeThiTracNghiem_Doc_Mau01' || code === 'InDeThiTracNghiem_Doc_Mau02') && ids.length > 1) { toast('Bạn chọn quá 1 đề thi', 'warn'); return; }
            B.baoCao([
                ['MAUTEMPLATEIMPORT.strMau_LoaiCauHoiId', ''],
                ['QUANLYBODE.strWritenExamIds', ids.join(';')],
                ['strReportCode', code],
                ['strNguoiDangNhap_Id', uid()]
            ], { tabMoi: code === 'InDeThiTracNghiemMau02' });
        }
        zCt.addEventListener('click', function (ev) {
            if (ev.target.closest('.ums-formtrang')) return;
            var x = ev.target.closest('[data-xem]');
            if (x) { B.xem(zCt, { title: 'Chi tiết đề thi', call: { action: BD + 'gen_ChiTietDeThiViet', strWritenExamId: x.getAttribute('data-xem') } }); return; }
            var b = ev.target.closest('[data-k]'); if (!b) return;
            var k = b.getAttribute('data-k');
            if (k === 'themDe') {
                var ten = q('ten').value.trim(), so = q('soDe').value.trim();
                if (!ten || !so) { toast('Nhập Tên đề thi và Số đề tạo ra', 'warn'); return; }
                ui.confirm('Tạo ' + so + ' đề thi "' + ten + '" từ bộ đề này?', { title: 'Thêm đề thi' }).then(function (yes) {
                    if (!yes) return;
                    return B.g(BD + 'Them_WritenExam', { strId: '', strName: ten, strSoDeTao: so, strExamStructId: S.id, strNguoiThucHien_Id: uid() }, true).then(function () {
                        toast('Thực hiện thành công'); q('ten').value = ''; q('soDe').value = ''; tai();
                    });
                }).catch(function (err) { loi(err, 'thêm đề thi'); });
            } else if (k === 'capNhatDe') {
                B.capNhatDong({
                    rows: S.rows, title: 'Cập nhật đề thi', hoi: 'Bạn có chắc chắn cập nhật dữ liệu không?',
                    call: function (r) {
                        var i = bang.querySelector('input[data-ten="' + e(r.ID) + '"]');
                        if (!i || i.value === e(r.NAME)) return null;
                        return { action: BD + 'Sua_WritenExam', method: 'POST', versionAPI: B.V, strId: e(r.ID), strName: i.value, strNguoiThucHien_Id: uid() };
                    },
                    sau: tai
                });
            } else if (k === 'xoaDe') {
                B.xoaIds({ ids: N.chon(bang), action: BD + 'Xoa_WritenExam', sau: tai });
            } else if (k === 'taiFile') baoCao(q('bc').value);
        });
        tai();
    }
})();
