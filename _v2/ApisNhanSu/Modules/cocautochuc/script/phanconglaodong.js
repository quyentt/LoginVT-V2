/* =========================================================================
   Phân công lao động (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/phanconglaodong.html + script/phanconglaodong.js
   Phần chung với quanhelaodong: script/_phancong.js (ums.nsPhanCong) — lời gọi PKG_CORE_HOSONHANSU_04 ghi ở đó.
   ---------------------------------------------------------------------------
   Bố cục bản gốc (MỘT cột): hàng lọc (Loại quan hệ lao động · Đơn vị · Từ khoá · Tìm kiếm) + bảng nhân sự có
   quan hệ lao động (nút "Chọn"). Bấm Chọn → hộp #modalChonQuanHe (các QHLĐ của người, nút "Chọn phân nhiệm vụ")
   → hộp #modalNhiemVu (bảng phân công + Xóa / Thêm phân công) → hộp #modalAddNhiemVu (biểu mẫu).
   Bản mới: hộp chọn QHLĐ giữ là HỘP THOẠI (việc chọn — BO-CUC luật 1); bảng phân công và biểu mẫu phân công
   thay chỗ danh sách nhân sự ngay trong trang (nút Đóng quay lại).

   Lời gọi riêng của màn:
     NS_HoSoNhanSu4_MH · PKG_CORE_HOSONHANSU_04.Get_Person_Co_Employment   strKeyword (ô Từ khoá), dIs_Active 1
         → giữ dòng có quan hệ lao động còn hiệu lực; lọc ở máy khách theo ô Loại QHLĐ (EMPLOYMENT_TYPE_CODE, không
           có mã thì so tên) và ô Đơn vị (ORG_ID…, không có mã thì so tên) — như gốc.
     PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Unit (ô Đơn vị lọc + Đơn vị phân công) — ums.nsCoCau.donVi
     Danh mục CORE.QUANHELAODONG.LOAI (ô lọc), CORE.QUANHELAODONG.TRANGTHAI (tên trạng thái),
              CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE / ASSIGNMENT_STATUS_CODE (biểu mẫu phân công)
   Khác gốc (ghi báo cáo):
     · Ô "Loại phân công" gốc nạp HAI danh mục chồng nhau (CORE.QUANHELAODONG.LOAI rồi ASSIGNMENT_TYPE_CODE — cái nào
       về sau thắng). Nay chỉ ASSIGNMENT_TYPE_CODE (đúng tên ô, như quanhelaodong).
     · Cột ô đánh dấu ở bảng nhân sự gốc không có việc gì (không nút nào đọc) → bỏ.
     · Bảng nhân sự gốc vẽ hai lần (lần hai sau 300 ms để chờ danh mục tên trạng thái) → nay chờ danh mục rồi vẽ một lần.
     · Chọn QHLĐ xong gốc nạp sẵn danh sách vị trí theo đơn vị của QHLĐ nhưng "Thêm phân công" lại xoá trắng đơn vị →
       danh sách nạp sẵn vô dụng; nay vị trí nạp theo ô Đơn vị phân công.
   Ô cha → con: Đơn vị phân công → Vị trí (trong _phancong.js). Hai ô lọc đầu trang là lọc độc lập.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-phanconglaodong');
    if (!root || !ums.nsPhanCong) return;
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau, P = ums.nsPhanCong;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    root.innerHTML =
        pat.page('Phân công lao động') +
        '<div data-z="ds">' +
            pat.filterBar([
                { key: 'quanhe', type: 'select', label: 'Loại quan hệ lao động' },
                { key: 'donvi', type: 'select', label: 'Chọn đơn vị' },
                { key: 'q', type: 'text', label: 'Từ khóa tìm kiếm' }
            ]) +
            pat.panel({ title: 'Danh sách nhân sự', icon: 'fa-users', count: 'dem', flush: true, zone: 'bang' }) + '</div>' +
        '<div data-z="nv" hidden><div data-z="nvList"></div></div>' +
        '<div data-z="nvform" hidden><div data-z="nvFormHost"></div></div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function fl(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var S = { ds: [], dmd: null, dv: [], nguoi: null, emp: null };
    var vung = 'ds';
    function sang(k) {
        if (k === vung) return;
        ui.swap(z(vung), z(k));
        vung = k;
    }

    var nv = P.nhiemVu({
        listHost: z('nvList'), formHost: z('nvFormHost'), cotQHLD: true, tieuDe: 'Phân công nhiệm vụ',
        ctx: function () { return { person: S.nguoi, employmentId: S.emp ? S.emp.ID : '', orgMacDinh: '' }; },
        show: function (form) { sang(form ? 'nvform' : 'nv'); },
        dong: function () { sang('ds'); }
    });

    /* ---------- Bộ lọc ---------- */
    var san = Promise.all([P.dm(), C.donVi()]).then(function (x) {
        S.dmd = x[0]; S.dv = x[1];
        pat.fill(fl('quanhe'), S.dmd.loai, { head: 'Loại quan hệ lao động' });
        pat.fill(fl('donvi'), S.dv, { name: 'NAME', head: 'Chọn đơn vị' });
    });
    function tenOpt(el) { var o = el.options[el.selectedIndex]; return o && o.value ? o.textContent.trim() : ''; }

    function nap() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return Promise.all([san, P.nguoi('BiQ1HhEkMzIuLx4CLh4ELDEtLjgsJC81', 'Get_Person_Co_Employment', fl('q').value)]).then(function (x) {
            var loai = fl('quanhe').value, loaiTen = tenOpt(fl('quanhe')), dv = fl('donvi').value, dvTen = tenOpt(fl('donvi'));
            var rows = x[1].filter(function (r) {
                if (!P.coQuanHe(r)) return false;
                if (loai) {
                    var ma = r.EMPLOYMENT_TYPE_CODE || r.EMPLOYMENT_TYPE_Code || '';
                    if (ma) { if (ma != loai) return false; }
                    else { var tn = e(r.EMPLOYMENT_TYPE_CODE_NAME || r.EMPLOYMENT_TYPE_CODE_Name).trim(); if (loaiTen && tn && tn !== loaiTen) return false; }
                }
                if (dv) {
                    var org = r.ORG_ID || r.ORG_UNIT_ID || r.EMPLOYMENT_ORG_ID || r.EMPLOYER_ORG_ID || '';
                    if (org) { if (org != dv) return false; }
                    else { var on = e(r.ORG_NAME).trim(); if (dvTen && on && on !== dvTen) return false; }
                }
                return true;
            });
            // normalizeEmploymentRows của bản này còn bỏ dòng IS_ACTIVE = 0
            rows = P.chuanHoa(rows.filter(function (r) { return !(r.IS_ACTIVE === 0 || r.IS_ACTIVE === '0'); }),
                { loai: S.dmd.loai, trangThai: S.dmd.trangThai, donVi: S.dv, theoNgay: true });
            S.ds = rows;
            z('dem').textContent = '(' + rows.length + ')';
            ui.table({
                el: z('bang'), rows: rows, empty: 'Không có nhân sự nào',
                columns: P.cotNguoi([
                    { title: 'Quan hệ lao động', prop: 'EMPLOYMENT_TYPE_CODE_NAME' },
                    { title: 'Chọn', cls: 'is-center', render: function (r) {
                        return ui.btn('confirm', { text: 'Chọn', mod: 'out-primary', icon: 'fa-hand-pointer', cls: 'ums-btn--sm', attr: { 'data-chon': r.ID } });
                    } }
                ])
            });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'Get_Person_Co_Employment'); });
    }

    /* ---------- Hộp chọn quan hệ lao động (#modalChonQuanHe) ---------- */
    function chonQuanHe(nguoi) {
        S.nguoi = nguoi;
        nguoi.PERSON_ID = nguoi.PERSON_ID || nguoi.ID;
        var dlg = ui.dialog({
            title: 'Chọn quan hệ lao động - ' + e(nguoi.FULL_NAME) + ' - ' + e(nguoi.CURRENT_EMPLOYEE_CODE), icon: 'fa-user', size: 'lg',
            body: '<div data-q="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var host = dlg.body.querySelector('[data-q="bang"]');
        var ds = [];
        P.quanHe(nguoi, S.ds).then(function (rows) {
            ds = P.chuanHoa(rows.filter(function (r) { return !(r.IS_ACTIVE === 0 || r.IS_ACTIVE === '0'); }),
                { loai: S.dmd.loai, trangThai: S.dmd.trangThai, donVi: S.dv, theoNgay: true });
            ui.table({
                el: host, rows: ds, empty: 'Người này chưa có quan hệ lao động',
                columns: [
                    { title: 'Loại quan hệ lao động', prop: 'EMPLOYMENT_TYPE_CODE_NAME' },
                    { title: 'Đơn vị pháp lý', prop: 'LEGAL_ENTITY_NAME' },
                    { title: 'Trạng thái quan hệ lao động', prop: 'EMPLOYMENT_STATUS_CODE_NAME' },
                    { title: 'Từ ngày', prop: 'EFFECTIVE_FROM', cls: 'is-nowrap' },
                    { title: 'Đến ngày', prop: 'EFFECTIVE_TO', cls: 'is-nowrap' },
                    { title: 'Quan hệ chính', cls: 'is-center', render: function (r) { return r.IS_PRIMARY == 1 ? ui.badge('Quan hệ chính', 'info') : ''; } },
                    { title: 'Chọn phân nhiệm vụ', cls: 'is-center', render: function (r) {
                        return ui.btn('confirm', { text: 'Chọn phân nhiệm vụ', cls: 'ums-btn--sm', attr: { 'data-qh': r.ID } });
                    } }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'Get_Core_Employment'); });
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-qh]');
            if (!b) return;
            var qh = ds.filter(function (r) { return r.ID === b.getAttribute('data-qh'); })[0];
            if (!qh) return;
            S.emp = qh;
            nguoi.EMPLOYMENT_ID = qh.ID;
            nguoi.EMPLOYMENT_TYPE_CODE_NAME = qh.EMPLOYMENT_TYPE_CODE_NAME;
            dlg.close();
            var t = z('nvList').querySelector('.ums-panel__title');
            t.firstChild.nextSibling.textContent = ' ' + e(nguoi.FULL_NAME) + ' - ' + e(nguoi.CURRENT_EMPLOYEE_CODE) + ' - ' + e(qh.EMPLOYMENT_TYPE_CODE_NAME) + ' ';
            sang('nv');
            nv.nap();
        });
    }

    root.addEventListener('click', function (ev) {
        var c = ev.target.closest('[data-chon]');
        if (c && root.contains(c)) {
            var r = S.ds.filter(function (x) { return x.ID === c.getAttribute('data-chon'); })[0];
            if (!r) { ui.toast('Không tìm thấy thông tin nhân sự!', 'warn'); return; }
            chonQuanHe(r);
            return;
        }
        if (ev.target.closest('[data-a="search"]')) nap();
    });
    fl('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); nap(); } });
    ui.enhance(root);
    jQuery(fl('quanhe')).on('select2:select', nap);
    jQuery(fl('donvi')).on('select2:select', nap);
    nap();
})();
