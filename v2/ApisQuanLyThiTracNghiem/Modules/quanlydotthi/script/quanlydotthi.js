/* =========================================================================
   Quản lý đợt thi (thi trắc nghiệm) — danh sách + biểu mẫu (ums.crud, một cột như gốc)
   + vùng "Tạo mới từ XLT" thay chỗ danh sách (gốc: zoneDongBoDotThi, cũng thay chỗ) → ums.pat.formTrang.
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlydotthi/html/quanlydotthi.html + script/quanlydotthi.js
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, không func, không iM — chép nguyên):
     Danh sách  QLTTN_ThongTin/LayDS_ThonTinDotThi (sic) GET versionAPI v1.0, strTuKhoa, strStatus, PageNumber,
                ItemPerPage — cột NAME, SCHOOLYEAR, SEMESTER, SODIEMLE, THANGDIEM, EXAMSCHEDULETYPE, STATUS.
     Thêm / Sửa QLTTN_ThongTin/Them_ThongTinDotThi | Sua_ThongTinDotThi POST strId, strName, strSemester,
                strSchoolyear, strExamscheduleType, strSoDiemLe, strThangDiem, strStatus, strNguoiThucHien_Id
     Xoá        QLTTN_ThongTin/Xoa_ThongTinDotThi POST strId (từng id), strNguoiThucHien_Id
     Tạo mới từ XLT (xử lý thi):
       Thời gian   TP_Chung/LayThoiGian GET strNguoiThucHien_Id → ID, THOIGIAN
       Đợt thi XLT QLTTN_QuanLyThi/LayDanhSach_DotThi GET strHinhThucThi_Id '', strDiem_ThanhPhanDiem_Id '',
                   strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id → ID, TEN
       Ghi (mỗi dòng đánh dấu) QLTTN_ThongTin/Import_ThongTinDotThi POST strId = ID đợt thi XLT, strName = TEN,
                   strSemester = CHỮ của thời gian đang chọn, strSchoolyear = 9 ký tự đầu của chữ đó,
                   strExamscheduleType '1', strSoDiemLe, strThangDiem (ô nhập trên dòng), strStatus '1'
   Bắt buộc như gốc: Tên đợt thi (biểu mẫu); dòng import phải có đủ Số điểm lẻ + Thang điểm.
   Nút "Chi tiết đợt thi" của gốc mở biểu mẫu sửa → nút Sửa trên dòng của ums.crud.
   Khác gốc / lỗi gốc đã sửa:
     · Import: gốc gửi từng lời gọi rồi 2 giây sau báo kết quả (báo sớm hơn khi máy chủ chậm) → nay chạy
       hàng loạt có tiến độ, báo đúng số thành công / lỗi, xong mới nạp lại danh sách.
     · Xoá: chờ xong mới nạp lại (gốc hẹn 2 giây).
     · Xoá chọn Thời gian → bảng đợt thi XLT về lời nhắc (gốc giữ bảng của thời gian cũ).
     · Chữ nút "Thêm phòng thi" giữ đúng gốc dù việc là nhập ĐỢT THI (chữ chép nhầm ở bản gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('qlttn-quanlydotthi');
    if (!root) return;
    var V = 'v1.0';
    var TT = [{ ID: '1', TEN: 'Hiện' }, { ID: '0', TEN: 'Ẩn' }];
    var LOAI = [{ ID: '1', TEN: 'Thi thật' }, { ID: '0', TEN: 'Thi thử' }];
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function uid() { return ums.session.userId; }

    var crud = ums.crud({
        root: root,
        title: 'Quản lý đợt thi',
        listTitle: 'Danh sách đợt thi',
        formTitle: 'đợt thi',
        icon: 'fa-calendar-days',
        addText: 'Tạo mới',
        removeText: 'Xóa',
        toolbar: [{ text: 'Tạo mới từ XLT', icon: 'fa-file-import', onClick: function () { moXLT(); } }],
        filters: [
            { key: 'tt', type: 'select', label: 'Chọn trạng thái', source: { items: TT } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f, p) {
                return { action: 'QLTTN_ThongTin/LayDS_ThonTinDotThi', method: 'GET', versionAPI: V,
                    strTuKhoa: f.q || '', strStatus: f.tt || '', PageNumber: p.index, ItemPerPage: p.size };
            }
        },
        columns: [
            { title: 'Tên đợt thi', prop: 'NAME' },
            { title: 'Năm học', prop: 'SCHOOLYEAR', cls: 'is-center is-nowrap' },
            { title: 'Học kỳ', prop: 'SEMESTER', cls: 'is-center' },
            { title: 'Số điểm lẻ', prop: 'SODIEMLE', cls: 'is-center' },
            { title: 'Thang điểm', prop: 'THANGDIEM', cls: 'is-center' },
            { title: 'Loại thi', cls: 'is-center', render: function (r) {
                return e(r.EXAMSCHEDULETYPE) === '1' ? ui.badge('Thi thật', 'info') : ui.badge('Thi thử', 'mute');
            } },
            { title: 'Trạng thái', cls: 'is-center', render: function (r) {
                return e(r.STATUS) === '1' ? ui.badge('Hiện', 'ok') : ui.badge('Ẩn', 'mute');
            } }
        ],
        fields: [
            { key: 'strName', col: 'NAME', label: 'Tên đợt thi', required: true },
            { key: 'strSchoolyear', col: 'SCHOOLYEAR', label: 'Năm học' },
            { key: 'strSemester', col: 'SEMESTER', label: 'Học kỳ' },
            { key: 'strSoDiemLe', col: 'SODIEMLE', label: 'Số điểm lẻ' },
            { key: 'strThangDiem', col: 'THANGDIEM', label: 'Thang điểm' },
            { key: 'strExamscheduleType', col: 'EXAMSCHEDULETYPE', label: 'Loại thi', type: 'select', placeholder: 'Chọn loại thi', source: { items: LOAI } },
            { key: 'strStatus', col: 'STATUS', label: 'Trạng thái', type: 'select', placeholder: 'Chọn trạng thái', source: { items: TT } }
        ],
        save: function (v, row) {
            return { action: row ? 'QLTTN_ThongTin/Sua_ThongTinDotThi' : 'QLTTN_ThongTin/Them_ThongTinDotThi', method: 'POST', versionAPI: V,
                strId: row ? row.ID : '', strName: v.strName, strSemester: v.strSemester, strSchoolyear: v.strSchoolyear,
                strExamscheduleType: v.strExamscheduleType, strSoDiemLe: v.strSoDiemLe, strThangDiem: v.strThangDiem,
                strStatus: v.strStatus, strNguoiThucHien_Id: uid() };
        },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'QLTTN_ThongTin/Xoa_ThongTinDotThi', method: 'POST', versionAPI: V, strId: id, strNguoiThucHien_Id: uid() };
            });
        }
    });

    /* =====================================================================
       Tạo mới từ XLT — vùng thay chỗ danh sách (gốc zoneDongBoDotThi)
       ===================================================================== */
    function moXLT() {
        var rows = [];
        var ft = pat.formTrang({
            host: root, title: 'Chi tiết đợt thi', icon: 'fa-file-import', cols: 1, flush: true,
            body: '<div class="ums-panel__body"><div class="ums-filter">' +
                    '<div class="ums-field"><label class="ums-field__label">Thời gian</label>' +
                    '<select class="ums-select" data-x="tg" data-ph="Chọn thời gian"><option value="">Chọn thời gian</option></select></div>' +
                '</div></div><div data-x="bang"></div>',
            buttons: [{ text: 'Thêm phòng thi', kind: 'add', keepOpen: true, onClick: function () { nhap(); return false; } }]
        });
        var b = ft.body, selTg = b.querySelector('[data-x="tg"]'), bang = b.querySelector('[data-x="bang"]');
        bang.innerHTML = ui.empty('Chọn thời gian để xem các đợt thi của xử lý thi', 'fa-hand-pointer');

        ums.api.call({ action: 'TP_Chung/LayThoiGian', method: 'GET', strNguoiThucHien_Id: uid() }).then(function (r) {
            pat.fill(selTg, Array.isArray(r.data) ? r.data : [], { name: 'THOIGIAN', head: 'Chọn thời gian' });
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });

        function ve() {
            ui.table({
                el: bang, rows: rows, empty: 'Không có đợt thi nào',
                columns: [
                    { title: 'Tên đợt thi', prop: 'TEN' },
                    { title: 'Số điểm lẻ', width: '160px', render: function (r, i) {
                        return '<input class="ums-input ums-input--sm" data-dl="' + i + '" autocomplete="off">';
                    } },
                    { title: 'Thang điểm', width: '160px', render: function (r, i) {
                        return '<input class="ums-input ums-input--sm" data-td="' + i + '" autocomplete="off">';
                    } },
                    { head: '<input type="checkbox" data-xck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-xck="' + i + '">'; } }
                ]
            });
        }
        function taiDot() {
            if (!selTg.value) { rows = []; bang.innerHTML = ui.empty('Chọn thời gian để xem các đợt thi của xử lý thi', 'fa-hand-pointer'); return; }
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: 'QLTTN_QuanLyThi/LayDanhSach_DotThi', method: 'GET', strHinhThucThi_Id: '', strDiem_ThanhPhanDiem_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: selTg.value, strNguoiThucHien_Id: uid() }).then(function (r) {
                rows = Array.isArray(r.data) ? r.data : [];
                ve();
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'đợt thi xử lý thi'); });
        }
        if (window.jQuery) jQuery(selTg).on('select2:select select2:clear', taiDot);
        else selTg.addEventListener('change', taiDot);

        b.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-xck') !== 'all') return;
            Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-xck]'), function (c) { c.checked = ev.target.checked; });
        });

        function nhap() {
            var chon = Array.prototype.filter.call(bang.querySelectorAll('tbody input[data-xck]:checked'), function () { return true; })
                .map(function (c) { return Number(c.getAttribute('data-xck')); });
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần import?', 'warn'); return; }
            function o(k, i) { var x = bang.querySelector('[data-' + k + '="' + i + '"]'); return x ? x.value.trim() : ''; }
            var thieu = chon.some(function (i) { return !o('dl', i) || !o('td', i); });
            if (thieu) { ui.toast('Bạn chưa nhập thông tin điểm lẻ/thang điểm', 'warn'); return; }
            var opt = selTg.options[selTg.selectedIndex];
            var chu = opt ? opt.text.trim() : '';
            var nam = chu.length > 9 ? chu.substring(0, 9) : chu;
            ui.confirm('Bạn có chắc chắn import dữ liệu không? (' + chon.length + ' đợt thi)', { title: 'Tạo mới từ XLT', ok: 'Import' }).then(function (yes) {
                if (!yes) return;
                var calls = chon.map(function (i) {
                    var r = rows[i];
                    return { action: 'QLTTN_ThongTin/Import_ThongTinDotThi', method: 'POST', versionAPI: V, strId: r.ID, strName: e(r.TEN),
                        strSemester: chu, strSchoolyear: nam, strExamscheduleType: '1', strSoDiemLe: o('dl', i), strThangDiem: o('td', i),
                        strStatus: '1', strNguoiThucHien_Id: uid() };
                });
                ui.batch(calls, { title: 'Đang import đợt thi', okText: 'Thực hiện thành công' }).then(function () { crud.load(1); });
            });
        }
    }
})();
