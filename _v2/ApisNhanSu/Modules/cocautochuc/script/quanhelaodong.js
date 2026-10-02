/* =========================================================================
   Quan hệ lao động (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/quanhelaodong.html + script/quanhelaodong.js
   Phần chung với phanconglaodong: script/_phancong.js (ums.nsPhanCong) — người, QHLĐ, khối phân công nhiệm vụ.
   ---------------------------------------------------------------------------
   Bố cục bản gốc: dải BA tab — "Chưa có quan hệ lao động" · "Có quan hệ lao động còn hiệu lực" · "Nhân sự đã
   nghỉ việc"; mỗi tab: ô từ khoá + Tìm kiếm + bảng nhân sự (nút Sửa). Bấm Sửa → hộp #modalQuanHe: trái bảng
   QHLĐ của người (Xóa · Thêm QHLD, bấm dòng để chọn), phải "Phân công nhiệm vụ" của QHLĐ đang chọn — cột phải CHỈ
   hiện khi mở từ tab "Có quan hệ lao động" (gốc đổi col-lg-6 ↔ col-lg-12). Hộp #modalAddQuanHe / #modalAddNhiemVu
   là biểu mẫu.
   Bản mới: khung "Quan hệ lao động của …" THAY CHỖ dải tab (giữ đúng hai cột / một cột như gốc); hai biểu mẫu
   thay chỗ khung đó (BO-CUC luật 1). Nút Đóng quay lại khung trước.

   Lời gọi riêng (NS_HoSoNhanSu4_MH · PKG_CORE_HOSONHANSU_04 — chép nguyên):
     Get_Person_Chua_Co_Employment | Get_Person_Co_Employment | Get_Person_Da_Nghi_Viec   strKeyword (ô từ khoá của
         tab), dIs_Active 1 — tab 2 chỉ giữ dòng có QHLĐ còn hiệu lực (như gốc)
     Ins_Core_Employment | Upd_Core_Employment (có strId)
         strId, strChucNang_Id, strVaiTro_Id, strPerson_Id, strEmployment_Type_Code, strEmployment_Status_Code,
         strWorking_Time_Mode_Code, strStaff_Code, strStaff_Code_Status_Code, strStaff_Code_Issued_At,
         strOrg_Id (ô "Đơn vị biên chế / đơn vị gốc"), strManaging_Org_Id (ô "Đơn vị đang làm việc / đơn vị sử dụng
         lao động thực tế"), strLegal_Entity_Id, dIs_Primary, strEffective_From, strEffective_To,
         strSource_Event_Id = strDecision_Id = ô Quyết định, strNote, dIs_Active 1, strCreated_By (thêm) |
         strUpdated_By (sửa), strEmployment_No, strStart_Reason_Code, strEnd_Reason_Code, strContract_Type_Code,
         strWork_Arrangement_Code, strNguoiThucHien_Id
     Del_Core_Employment   strId (mỗi dòng một lời gọi), strChucNang_Id, strVaiTro_Id
     Get_Core_Employment / Get_Core_Employment_By_Id (xem _phancong.js)
     Danh mục: CORE.QUANHELAODONG.LOAI / .TRANGTHAI, CORE_EMPLOYMENT.CONTRACT_TYPE_CODE / STAFF_CODE_STATUS_CODE /
               WORKING_TIME_MODE_CODE / WORK_ARRANGEMENT_CODE; đơn vị: LayDSCore_Org_Unit (ba ô đơn vị + pháp nhân)
   Giữ như gốc:
     · Máy chủ không trả MANAGING_ORG_ID → gốc cất "đơn vị đang làm việc" vào localStorage
       (QHLD_MANAGING_ORG_<id QHLĐ>) lúc lưu và đọc lại lúc sửa. Giữ nguyên (chỉ trình duyệt đã lưu mới thấy).
     · Ô "Quyết định" gốc không nạp danh sách nào → ô trống, gửi rỗng.
   Khác gốc (ghi báo cáo):
     · Cột ô đánh dấu ở ba bảng nhân sự không có việc gì → bỏ. Bảng vẽ hai lần (chờ 300 ms) → chờ danh mục rồi vẽ.
     · Ô "Quan hệ chính" gốc không có mục trống nên "Thêm QHLD" xoá trắng thành mục đầu → thêm mục trống.
   Ô cha → con: Đơn vị phân công → Vị trí (khối phân công). Biểu mẫu QHLĐ không có cặp cha → con.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-quanhelaodong');
    if (!root || !ums.nsPhanCong) return;
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau, P = ums.nsPhanCong;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var TABS = [
        { key: 'chua', text: 'Chưa có quan hệ lao động', icon: 'fa-user-plus', ma: 'BiQ1HhEkMzIuLx4CKTQgHgIuHgQsMS0uOCwkLzUP', ham: 'Get_Person_Chua_Co_Employment' },
        { key: 'co', text: 'Có quan hệ lao động còn hiệu lực', icon: 'fa-user-check', ma: 'BiQ1HhEkMzIuLx4CLh4ELDEtLjgsJC81', ham: 'Get_Person_Co_Employment' },
        { key: 'nghi', text: 'Nhân sự đã nghỉ việc', icon: 'fa-users-slash', ma: 'BiQ1HhEkMzIuLx4FIB4PJikoHhcoJCIP', ham: 'Get_Person_Da_Nghi_Viec' }
    ];
    function sel(k, ph) { return '<select class="ums-select" data-scope="form" data-k="' + k + '" data-ph="' + ui.esc(ph) + '"><option value="">' + ui.esc(ph) + '</option></select>'; }
    function inp(k, ph) { return '<input class="ums-input" data-scope="form" data-k="' + k + '" autocomplete="off" placeholder="' + ui.esc(ph || '') + '">'; }
    function ngay(k) { return '<div class="ums-inputwrap"><input class="ums-input" data-scope="form" data-type="date" data-k="' + k + '" autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>'; }
    function o(label, ctl, op) { return '<div' + (op && op.rong ? ' class="nscc-span"' : '') + '>' + ui.field(label, ctl, op) + '</div>'; }

    root.innerHTML = pat.page('Quan hệ lao động') +
        '<div data-z="tab">' + ui.tabs(TABS, 'chua', 'data-qtab') +
            TABS.map(function (t, i) {
                return '<div class="ums-u-mt-4" data-qpane="' + t.key + '"' + (i ? ' hidden' : '') + '>' +
                    pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-qq="' + t.key +
                        '" autocomplete="off" placeholder="Từ khóa tìm kiếm"></div><div class="ums-field ums-field--fit">' +
                        ui.btn('search', { attr: { 'data-qtim': t.key } }) + '</div></div>' }) +
                    pat.panel({ title: 'Danh sách nhân sự', icon: 'fa-users', count: 'dem_' + t.key, flush: true, zone: 'bang_' + t.key }) + '</div>';
            }).join('') + '</div>' +
        '<div data-z="ct" hidden><div class="ums-grid ums-grid--2 nsqh-cols" data-z="cols">' +
            '<div data-z="colQH">' + pat.panel({ title: 'Quan hệ lao động', icon: 'fa-file-contract', count: 'qhDem', flush: true, zone: 'qhBang',
                tools: ui.btn('close', { attr: { 'data-a': 'dongct' } }) +
                    ui.xoaChon('input[data-qhck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoaqh' } }) +
                    ui.btn('add', { text: 'Thêm QHLD', attr: { 'data-a': 'themqh' } }) }) + '</div>' +
            '<div data-z="colNV"></div>' +
        '</div></div>' +
        '<div data-z="qhform" hidden>' + pat.panel({ title: 'Quan hệ lao động', icon: 'fa-pen-to-square', zone: 'qhBody',
            tools: ui.btn('close', { attr: { 'data-a': 'dongqh' } }) + ui.btn('save', { attr: { 'data-a': 'luuqh' } }),
            body: '<div class="ums-grid ums-grid--2">' +
                o('Loại quan hệ lao động', sel('loai', 'Chọn loại quan hệ lao động')) +
                o('Trạng thái quan hệ lao động', sel('trangthai', 'Chọn trạng thái')) +
                o('Đơn vị biên chế / đơn vị gốc', sel('dvsudung', 'Chọn đơn vị')) +
                o('Đơn vị đang làm việc / đơn vị sử dụng lao động thực tế', sel('dvquanly', 'Chọn đơn vị')) +
                o('Mã pháp nhân chịu trách nhiệm pháp lý', sel('phapnhan', 'Chọn đơn vị')) +
                o('Loại hợp đồng', sel('hopdong', 'Chọn loại hợp đồng')) +
                o('Trạng thái nguồn của mã số', sel('nguonmaso', 'Chọn trạng thái nguồn')) +
                o('Mã số', inp('maso', 'Nhập mã số')) +
                o('Ngày cấp mã nhân sự', ngay('ngaycap')) +
                o('Số quan hệ lao động', inp('soqh', 'Nhập số quan hệ lao động')) +
                o('Lý do bắt đầu', inp('lydobd', 'Nhập lý do bắt đầu')) +
                o('Lý do kết thúc', inp('lydokt', 'Nhập lý do kết thúc')) +
                o('Chế độ thời gian làm việc', sel('chedo', 'Chọn chế độ thời gian')) +
                o('Hình thức bố trí làm việc', sel('botri', 'Chọn hình thức bố trí')) +
                o('Quan hệ chính', '<select class="ums-select" data-scope="form" data-k="chinh" data-ph="Chọn"><option value="">Chọn</option>' +
                    '<option value="1">Quan hệ chính</option><option value="0">Không phải quan hệ chính</option></select>') +
                o('Quyết định', sel('quyetdinh', 'Chọn quyết định')) +
                o('Ngày bắt đầu', ngay('tu')) + o('Ngày kết thúc', ngay('den')) +
                o('Ghi chú', '<textarea class="ums-textarea" data-scope="form" data-k="ghichu" placeholder="Nhập ghi chú"></textarea>', { rong: true }) +
                '</div>' }) + '</div>' +
        '<div data-z="nvform" hidden></div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var qb = z('qhBody');
    function f(k) { return qb.querySelector('[data-k="' + k + '"]'); }
    var S = { tab: 'chua', ds: {}, dmd: null, dv: [], nguoi: null, qh: [], emp: null, suaQH: '', coPC: false };
    var vung = 'tab';
    function sang(k) {
        if (k === vung) return;
        ui.swap(z(vung), z(k));
        vung = k;
    }

    var nv = P.nhiemVu({
        listHost: z('colNV'), formHost: z('nvform'), tieuDe: 'Phân công nhiệm vụ',
        nhac: 'Chọn 1 quan hệ lao động bên trái', canQHLD: 'Vui lòng chọn 1 quan hệ lao động bên trái trước!',
        ctx: function () { return { person: S.nguoi, employmentId: S.emp ? S.emp.ID : '', orgMacDinh: S.emp ? (S.emp.EMPLOYER_ORG_ID || S.emp.ORG_ID || S.emp.ORG_UNIT_ID || '') : '' }; },
        show: function (form) { sang(form ? 'nvform' : 'ct'); }
    });

    /* ---------- Danh mục + đơn vị ---------- */
    var DM = [['hopdong', 'CORE_EMPLOYMENT.CONTRACT_TYPE_CODE'], ['nguonmaso', 'CORE_EMPLOYMENT.STAFF_CODE_STATUS_CODE'],
        ['chedo', 'CORE_EMPLOYMENT.WORKING_TIME_MODE_CODE'], ['botri', 'CORE_EMPLOYMENT.WORK_ARRANGEMENT_CODE']];
    DM.forEach(function (x) {
        ums.api.dm(x[1]).then(function (r) { pat.fill(f(x[0]), r, { head: f(x[0]).getAttribute('data-ph') }); }).catch(function (err) { ums.api.handle(err, x[1]); });
    });
    var san = Promise.all([P.dm(), C.donVi()]).then(function (x) {
        S.dmd = x[0]; S.dv = x[1];
        pat.fill(f('loai'), S.dmd.loai, { head: 'Chọn loại quan hệ lao động' });
        pat.fill(f('trangthai'), S.dmd.trangThai, { head: 'Chọn trạng thái' });
        ['dvsudung', 'dvquanly', 'phapnhan'].forEach(function (k) { pat.fill(f(k), S.dv, { name: 'NAME', head: 'Chọn đơn vị' }); });
    });

    /* ---------- Ba tab danh sách người ---------- */
    function tabCfg(k) { return TABS.filter(function (t) { return t.key === k; })[0]; }
    function napTab(k) {
        var t = tabCfg(k), bang = z('bang_' + k);
        var q = root.querySelector('[data-qq="' + k + '"]').value;
        bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return Promise.all([san, P.nguoi(t.ma, t.ham, q)]).then(function (x) {
            var rows = x[1];
            if (k === 'co') rows = rows.filter(P.coQuanHe);
            rows = P.chuanHoa(rows, { loai: S.dmd.loai, trangThai: S.dmd.trangThai, donVi: S.dv, theoNgay: true, nguoi: true });
            S.ds[k] = rows;
            z('dem_' + k).textContent = '(' + rows.length + ')';
            ui.table({
                el: bang, rows: rows, empty: 'Không có nhân sự nào',
                columns: P.cotNguoi([{ title: 'Sửa', cls: 'is-center is-actions', render: function (r) { return ui.iconBtn('edit', r.ID); } }])
            });
        }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, t.ham); });
    }

    /* ---------- Khung quan hệ lao động của một người ---------- */
    function moNguoi(k, r) {
        S.nguoi = r;
        S.emp = null;
        S.coPC = k === 'co';
        z('colQH').querySelector('.ums-panel__title').firstChild.nextSibling.textContent =
            ' Quan hệ lao động - ' + e(r.FULL_NAME) + ' - ' + e(r.CURRENT_EMPLOYEE_CODE) + ' ';
        z('cols').classList.toggle('ums-grid--2', S.coPC);
        z('colNV').hidden = !S.coPC;
        nv.xoaTrang('Chọn 1 quan hệ lao động bên trái');
        nvTieuDe('');
        sang('ct');
        napQH();
    }
    function nvTieuDe(ten) {
        var t = z('colNV').querySelector('.ums-panel__title');
        if (t) t.firstChild.nextSibling.textContent = ' Phân công nhiệm vụ - ' + (ten || '(Chọn 1 quan hệ lao động bên trái)') + ' ';
    }
    function napQH() {
        var r = S.nguoi;
        z('qhBang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return Promise.all([san, P.quanHe(r, S.ds[S.tab])]).then(function (x) {
            if (S.nguoi !== r) return;
            S.qh = P.chuanHoa(x[1], { loai: S.dmd.loai, trangThai: S.dmd.trangThai, donVi: S.dv });
            z('qhDem').textContent = '(' + S.qh.length + ')';
            ui.table({
                el: z('qhBang'), rows: S.qh, empty: 'Chưa có quan hệ lao động', rowCls: function (q) { return S.emp && S.emp.ID === q.ID ? 'is-active' : ''; },
                columns: [
                    { title: 'Loại QHLD', prop: 'EMPLOYMENT_TYPE_CODE_NAME' },
                    { title: 'Đơn vị pháp lý', prop: 'LEGAL_ENTITY_NAME' },
                    { title: 'Trạng thái', prop: 'EMPLOYMENT_STATUS_CODE_NAME' },
                    { title: 'Từ ngày', prop: 'EFFECTIVE_FROM', cls: 'is-nowrap' },
                    { title: 'Đến ngày', prop: 'EFFECTIVE_TO', cls: 'is-nowrap' },
                    { title: 'Chính', cls: 'is-center', render: function (q) { return q.IS_PRIMARY == 1 ? ui.badge('Quan hệ chính', 'info') : ''; } },
                    { title: 'Sửa', cls: 'is-center is-actions', render: function (q) { return ui.iconBtn('edit', q.ID); } },
                    { head: '<input type="checkbox" data-qhall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (q) { return '<input type="checkbox" data-qhck="' + ui.esc(q.ID) + '">'; } }
                ]
            });
        }).catch(function (err) { z('qhBang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'Get_Core_Employment'); });
    }
    /* selectQHLDRow: bấm một dòng QHLĐ → chọn làm QHLĐ của khối phân công */
    function chonQH(tr) {
        var q = S.qh.filter(function (x) { return x.ID === tr.getAttribute('data-id'); })[0];
        if (!q) return;
        S.emp = q;
        Array.prototype.forEach.call(z('qhBang').querySelectorAll('tbody tr'), function (x) { x.classList.toggle('is-active', x === tr); });
        if (S.coPC) { nvTieuDe(e(q.EMPLOYMENT_TYPE_CODE_NAME) || '(đã chọn)'); nv.nap(); }
    }

    /* ---------- Biểu mẫu quan hệ lao động ---------- */
    function dat(k, v) {
        var el = f(k); el.value = e(v);
        if (el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
        if (el._flatpickr) el._flatpickr.setDate(v || null, false, 'd/m/Y');
    }
    var KHOA = ['loai', 'trangthai', 'dvsudung', 'dvquanly', 'phapnhan', 'hopdong', 'nguonmaso', 'maso', 'ngaycap', 'lydobd', 'lydokt',
        'chedo', 'botri', 'soqh', 'chinh', 'tu', 'den', 'quyetdinh', 'ghichu'];
    function moFormQH(d) {
        S.suaQH = d ? d.ID : '';
        KHOA.forEach(function (k) { dat(k, ''); });
        if (d) {
            dat('loai', d.EMPLOYMENT_TYPE_CODE); dat('trangthai', d.EMPLOYMENT_STATUS_CODE);
            dat('dvsudung', d.EMPLOYER_ORG_ID || d.ORG_ID || d.ORG_UNIT_ID);
            var ql = d.MANAGING_ORG_ID || d.MANAGER_ORG_ID || d.MANAGING_ORG_UNIT_ID || '';
            try { var c = localStorage.getItem('QHLD_MANAGING_ORG_' + d.ID); if (c) ql = c; } catch (x) { /* bộ nhớ khoá */ }
            if (ql) dat('dvquanly', ql);
            dat('phapnhan', d.LEGAL_ENTITY_ID); dat('hopdong', d.CONTRACT_TYPE_CODE); dat('nguonmaso', d.STAFF_CODE_STATUS_CODE);
            dat('maso', d.STAFF_CODE); dat('ngaycap', d.STAFF_CODE_ISSUED_AT || d.STAFF_CODE_ISSUED_DATE);
            dat('lydobd', d.START_REASON_CODE || d.START_REASON); dat('lydokt', d.END_REASON_CODE || d.END_REASON);
            dat('chedo', d.WORKING_TIME_MODE_CODE); dat('botri', d.WORK_ARRANGEMENT_CODE);
            dat('soqh', d.EMPLOYMENT_NO || d.EMPLOYMENT_NUMBER); dat('chinh', d.IS_PRIMARY);
            dat('tu', d.EFFECTIVE_FROM); dat('den', d.EFFECTIVE_TO); dat('quyetdinh', d.DECISION_ID || d.SOURCE_EVENT_ID); dat('ghichu', d.NOTE);
        }
        z('qhform').querySelector('.ums-panel__title').innerHTML = '<i class="fa-light ' + (d ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' +
            (d ? 'Sửa' : 'Thêm') + ' quan hệ lao động — ' + ui.esc(e(S.nguoi && S.nguoi.FULL_NAME));
        sang('qhform');
    }
    function suaQH(id) {
        san.then(function () { return P.chiTietQuanHe(id); }).then(function (d) {
            if (!d) { ui.toast('Không tìm thấy thông tin chi tiết!', 'warn'); return; }
            moFormQH(d);
        }).catch(function (err) { ums.api.handle(err, 'Get_Core_Employment_By_Id'); });
    }
    function luuQH() {
        var sua = S.suaQH, L = function (k) { return e(f(k).value).trim(); };
        var uid = (ums.session && ums.session.userId) || '';
        var t = {
            strId: sua, strPerson_Id: S.nguoi.ID, strEmployment_Type_Code: L('loai'), strEmployment_Status_Code: L('trangthai'),
            strWorking_Time_Mode_Code: L('chedo'), strStaff_Code: L('maso'), strStaff_Code_Status_Code: L('nguonmaso'),
            strStaff_Code_Issued_At: L('ngaycap'), strOrg_Id: L('dvsudung'), strManaging_Org_Id: L('dvquanly'),
            strLegal_Entity_Id: L('phapnhan'), dIs_Primary: L('chinh'), strEffective_From: L('tu'), strEffective_To: L('den'),
            strSource_Event_Id: L('quyetdinh'), strNote: L('ghichu'), dIs_Active: 1,
            strDecision_Id: L('quyetdinh'), strEmployment_No: L('soqh'), strStart_Reason_Code: L('lydobd'),
            strEnd_Reason_Code: L('lydokt'), strContract_Type_Code: L('hopdong'), strWork_Arrangement_Code: L('botri')
        };
        if (sua) t.strUpdated_By = uid; else t.strCreated_By = uid;
        var c = P.goi(sua ? 'FDElHgIuMyQeBCwxLS44LCQvNQPP' : 'CC8yHgIuMyQeBCwxLS44LCQvNQPP', sua ? 'Upd_Core_Employment' : 'Ins_Core_Employment', t);
        ums.api.call(c).then(function (r) {
            var id = sua;
            if (!id) {
                var d = r.data;
                if (typeof d === 'string' || typeof d === 'number') id = String(d);
                else if (d && (d.ID || d.Id)) id = d.ID || d.Id;
                else if (d && d[0] && (d[0].ID || d[0].Id)) id = d[0].ID || d[0].Id;
            }
            if (id && L('dvquanly')) { try { localStorage.setItem('QHLD_MANAGING_ORG_' + id, L('dvquanly')); } catch (x) { /* bỏ qua */ } }
            ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            sang('ct');
            napQH();
        }).catch(function (err) { ums.api.handle(err, c.func); });
    }
    function xoaQH() {
        var ids = Array.prototype.map.call(z('qhBang').querySelectorAll('input[data-qhck]:checked'), function (x) { return x.getAttribute('data-qhck'); });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) { return P.goi('BSQtHgIuMyQeBCwxLS44LCQvNQPP', 'Del_Core_Employment', { strId: id }); }),
                { title: 'Đang xóa', okText: 'Xóa dữ liệu thành công!' }).then(function () {
                if (S.emp && ids.indexOf(S.emp.ID) >= 0) { S.emp = null; nv.xoaTrang('Chọn 1 quan hệ lao động bên trái'); nvTieuDe(''); }
                napQH();
            });
        });
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute('data-qhall')) Array.prototype.forEach.call(z('qhBang').querySelectorAll('input[data-qhck]'), function (x) { x.checked = ev.target.checked; });
    });
    root.addEventListener('keydown', function (ev) {
        var q = ev.target.closest && ev.target.closest('[data-qq]');
        if (q && ev.key === 'Enter') { ev.preventDefault(); napTab(q.getAttribute('data-qq')); }
    });
    root.addEventListener('click', function (ev) {
        var tab = ev.target.closest('[data-qtab]');
        if (tab && root.contains(tab)) {
            var k = tab.getAttribute('data-qtab');
            S.tab = k;
            ui.tabsActive(root, k, 'data-qtab');
            TABS.forEach(function (t) { root.querySelector('[data-qpane="' + t.key + '"]').hidden = t.key !== k; });
            napTab(k);          // gốc: bấm tab là nạp lại
            return;
        }
        var tim = ev.target.closest('[data-qtim]');
        if (tim) { napTab(tim.getAttribute('data-qtim')); return; }
        var ed = ev.target.closest('[data-act="edit"]');
        if (ed && root.contains(ed)) {
            var pane = ed.closest('[data-qpane]');
            if (pane) {
                var r = (S.ds[pane.getAttribute('data-qpane')] || []).filter(function (x) { return x.ID === ed.getAttribute('data-id'); })[0];
                if (r) moNguoi(pane.getAttribute('data-qpane'), r);
            } else if (z('qhBang').contains(ed)) suaQH(ed.getAttribute('data-id'));
            return;
        }
        var tr = ev.target.closest('tr[data-id]');
        if (tr && z('qhBang').contains(tr) && !ev.target.closest('input, button')) { chonQH(tr); return; }
        var b = ev.target.closest('button[data-a]');
        if (!b || !root.contains(b)) return;
        switch (b.getAttribute('data-a')) {
            case 'dongct': sang('tab'); break;
            case 'themqh': moFormQH(null); break;
            case 'xoaqh': xoaQH(); break;
            case 'luuqh': luuQH(); break;
            case 'dongqh': sang('ct'); break;
        }
    });

    ui.enhance(root);
    Array.prototype.forEach.call(qb.querySelectorAll('[data-type="date"]'), function (x) { ui.datepicker(x); });
    napTab('chua');
})();
