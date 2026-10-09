/* =========================================================================
   ApisNCKH / baocao — khung chung của 9 màn BÁO CÁO sản phẩm khoa học (ums.nckhBc)
   ---------------------------------------------------------------------------
   Chín tệp gốc (tapchiquocte, tapchiquocgia, sach, detai, giaithuong, vanbangsangche, hoinghihoithao,
   huongdansinhvien, hoidongxetchucdanh) chép cùng MỘT khuôn:
     · cột trái col-sm-3: ô từ khoá + nút "Kéo xuống" mở khung điều kiện ẩn (box-sub-search), nút Tìm kiếm;
     · cột phải col-sm-9: khung "Danh sách …" + nút thả xuống "Xuất excel" + "Tải lại", bảng phân trang máy chủ
       (edu.system.loadToTable_data, pageIndex/pageSize mặc định), MỘT lời gọi <X>/LayDanhSach GET kiểu cũ (không func / iM).
   Bản mới giữ hai cột như gốc: cột trái = ô tìm + "Bộ lọc nâng cao" (đúng khung box-sub-search ẩn sẵn của gốc — BO-CUC luật 12:
   gõ là tự tìm, đổi ô là tự tải, không nút Tìm kiếm); cột phải = danh sách của ums.crud (embedded, chỉ đọc).

   ums.nckhBc.man(root, {
       tieuDe, dsTitle, icon,
       loc: [ { key, label, type: 'select' | 'radio',
                dm: 'NCKH.LVNC'              ← edu.system.loadToCombo_DanhMucDuLieu / loadToRadio_DanhMucDuLieu
                | nhanSu: true               ← edu.system.getList_NhanSu (pageSize 10000, mọi đơn vị)
                | cctc: true                 ← edu.system.getList_CoCauToChuc (iTrangThai 1)
                | call: {…}, name: 'COT'     ← lời gọi riêng (danh mục tạp chí)
                | khoa: 'lý do'              ← ô gốc có trên màn nhưng KHÔNG được gửi / không có nguồn → giữ, khoá }, … ],
       goi(f) → { action, …tham số chép nguyên } (không kèm pageIndex/pageSize — crud tự gắn),
       cot: [ cột ums.ui.table ],
       tenTep: 'bao-bao-quoc-te'   ← tên tệp Excel
   })

   "Xuất excel" (tự chốt 2026-09-27): gốc là nút thả xuống liệt kê mẫu báo cáo từ danh mục SYS.RP.<mã>, nhưng bấm mục nào cũng
   gọi me.report_<X> — hàm KHÔNG tồn tại ở bất cứ đâu (TypeError), giaithuong / huongdansinhvien còn không nạp danh sách mẫu.
   Tức chức năng CHƯA TỪNG chạy. Làm theo ý định của chữ trên nút: xuất Excel (ums.ui.xuatXls, ở máy khách) TOÀN BỘ danh sách
   theo điều kiện đang lọc — gọi lại đúng lời gọi danh sách với pageIndex 1, pageSize 1000000 — cột như bảng trên màn.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var B = ums.nckhBc = ums.nckhBc || {};

    function esc(s) { return ui.esc(s === undefined || s === null ? '' : s); }
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    B.e = e;

    /* Tên nhân sự trên ô chọn: gốc lấy HOTEN (tapchiquocte/quocgia lấy HODEM — chỉ hiện họ đệm, lỗi chép) */
    B.tenNhanSu = function (r) { return e(r.HOTEN) || (e(r.HODEM) + ' ' + e(r.TEN)).trim(); };

    function nguon(l) {
        if (l.dm) return ums.api.dm(l.dm);
        if (l.nhanSu) return ums.ref.nhanSu({ strTuKhoa: '', pageIndex: 1, pageSize: 10000, strCoCauToChuc_Id: '' });
        if (l.cctc) return ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 });
        if (l.call) {
            var c = Object.assign({ silent: true }, l.call);
            return ums.api.call(c).then(function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; });
        }
        return Promise.resolve([]);
    }

    function locHtml(l) {
        if (l.type === 'radio') {
            /* Nhóm radio (loadToRadio_DanhMucDuLieu) — thêm mục "Tất cả" chọn sẵn: gốc không có, chọn một lần là KHÔNG bỏ lọc được.
               Giá trị để ở data-v (value rỗng) để nút "Bộ lọc nâng cao" chỉ sáng khi thật sự đang lọc. */
            return '<div class="ums-field"><label class="ums-field__label">' + esc(l.label) + '</label>' +
                '<div class="ums-radios" data-nbc="' + esc(l.key) + '">' +
                '<label class="ums-check"><input type="radio" name="nbc-' + esc(l.key) + '" value="" data-v="" checked> Tất cả</label>' +
                '</div></div>';
        }
        return '<div class="ums-field"><select class="ums-select" data-nbc="' + esc(l.key) + '" data-ph="' + esc(l.label) + '"' +
            (l.khoa ? ' disabled title="' + esc(l.khoa) + '"' : '') + '>' +
            '<option value="">' + esc(l.label) + '</option></select></div>';
    }

    B.man = function (root, o) {
        if (!root) return null;
        var loc = o.loc || [];
        var m = pat.master({
            el: root, title: o.tieuDe,
            side: { title: 'Tìm kiếm', icon: 'fa-filter', search: 'Nhập từ khóa tìm kiếm', filter: loc.map(locHtml).join('') },
            main: { title: false }
        });
        /* Cột trái của gốc chỉ có điều kiện tìm (không có danh sách) → giấu vùng danh sách / phân trang trống */
        m.sideBody.hidden = true;
        m.sideFoot.hidden = true;

        var F = {};
        loc.forEach(function (l) { F[l.key] = root.querySelector('[data-nbc="' + l.key + '"]'); });

        function giaTri() {
            var v = { q: (m.search.value || '').trim() };
            loc.forEach(function (l) {
                var el = F[l.key];
                if (l.type === 'radio') {
                    var r = el && el.querySelector('input:checked');
                    v[l.key] = r ? e(r.getAttribute('data-v')) : '';
                } else v[l.key] = l.khoa ? '' : pat.val(el);
            });
            return v;
        }
        function goi() { return Object.assign({ method: 'GET' }, o.goi(giaTri())); }

        var crud = ums.crud({
            root: m.main, embedded: true, title: o.dsTitle, icon: o.icon || 'fa-list-ul',
            list: { paged: true, call: function () { return goi(); } },
            columns: o.cot,
            toolbar: [{ text: 'Xuất excel', icon: 'fa-file-excel', mod: 'out-info', onClick: function () { B.xuat(o, goi()); } }]
        });

        /* Nạp nguồn ô lọc (gốc nạp nối đuôi bằng setTimeout 50–150ms; ở đây song song) */
        loc.forEach(function (l) {
            if (l.khoa) return;
            nguon(l).then(function (rows) {
                var el = F[l.key];
                if (!el) return;
                if (l.type === 'radio') {
                    el.insertAdjacentHTML('beforeend', rows.map(function (r) {
                        return '<label class="ums-check"><input type="radio" name="nbc-' + esc(l.key) + '" value="" data-v="' + esc(r.ID) + '"> ' +
                            esc(r.TEN) + '</label>';
                    }).join(''));
                    return;
                }
                pat.fill(el, rows, { name: l.nhanSu ? B.tenNhanSu : (l.name || 'TEN'), head: l.label });
            }).catch(function (err) { ums.api.handle(err, l.label); });
        });

        /* Cột trái CHỈ có điều kiện tìm → mở sẵn bộ lọc (giấu sau nút thì khung trông trống — người dùng báo lỗi 2026-09-27) */
        pat.cotTrai(m, { tai: function () { crud.load(1); }, moSan: loc.length > 0 });
        m.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); crud.load(1); } });
        return { m: m, crud: crud, F: F, giaTri: giaTri };
    };

    /* Xuất excel TOÀN BỘ danh sách theo điều kiện đang lọc (xem đầu tệp) */
    B.xuat = function (o, call) {
        call.pageIndex = 1;
        call.pageSize = 1000000;
        ums.api.call(call).then(function (r) {
            var d = r.data, rows = Array.isArray(d) ? d : (d && d.rs) || [];
            if (!rows.length) { ui.toast('Không có dữ liệu để xuất', 'warn'); return; }
            var cot = [{ title: 'Stt', get: function (x, i) { return i + 1; } }].concat(o.cot.map(function (c) {
                return { title: c.title, get: c.xls || function (x) { return c.prop ? x[c.prop] : ''; } };
            }));
            ui.xuatXls(o.tenTep || 'bao-cao', { tieuDe: o.dsTitle, cot: cot, dong: rows });
        }).catch(function (err) { ums.api.handle(err, 'Xuất excel'); });
    };
})();
