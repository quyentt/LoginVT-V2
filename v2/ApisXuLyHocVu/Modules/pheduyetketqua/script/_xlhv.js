/* =========================================================================
   Xử lý học vụ — khung chung của "Phê duyệt kết quả" và "Ra quyết định": ums.xlhv.man
   Bản gốc: ApisXuLyHocVu/Modules/pheduyetketqua/script/pheduyetketqua.js và
   raquyetdinh/script/raquyetdinh.js — hai tệp chép nhau gần từng dòng (và chép
   thuchienxulyhocvu / tracuuketqua): cùng thanh lọc, cùng XLHV_KetQuaXuLy/LayDanhSach,
   cùng bảng có cột "Thông số xử lý" điền từng ô, cùng hộp "Thay đổi mức cảnh cáo".
   Phần chung của CẢ BỐN màn đã có ở ums.xlhvKQ (../../thuchienxulyhocvu/script/_ketqua.js —
   boLoc, ketQua, hopDoiMuc) → DÙNG LẠI, tệp này chỉ thêm phần riêng của hai màn có thao tác
   hàng loạt: cột ô đánh dấu, nút trên khung "Danh sách", liên kết "Kết quả điều chỉnh".
   Nạp từ html (sau _ketqua.js):
       pheduyetketqua  ../script/_xlhv.js
       raquyetdinh     ../../pheduyetketqua/script/_xlhv.js
   ---------------------------------------------------------------------------
   ums.xlhv.man(root, cfg) → { loc, ds, chon(), tai(), z(k) }
       cfg = { tieuDe,
               tools   HTML nút thêm SAU "Đóng" trên đầu khung "Danh sách" (Đóng ngoài cùng trái),
               tren    HTML đặt TRÊN bảng trong khung "Danh sách" (hàng chọn quyết định của raquyetdinh),
               baoCao  cặp đầu của khối addKeyValue (pheduyetketqua: { strTuKhoa: '' }),
               onNut(a, nút)  bấm nút mang data-a khác search / dong }
       Thanh lọc (html gốc hai màn giống nhau, ba hàng): Hệ · Khoá · CT · Lớp / Năm nhập học ·
           Khoa QL · Học kỳ · Kế hoạch xử lý · Loại xử lý / Mức xử lý · từ khoá · Tìm kiếm ·
           Xuất báo cáo · Import (getList_MauImport — cả hai màn có vùng _Import) / trạng thái SV.
       Bảng: cột như genTable_* gốc; cột ô đánh dấu (checkX + chọn tất cả) đặt ĐẦU bảng — gốc đặt
           cuối, sau nhóm "Thông số xử lý" do ums.xlhvKQ.ketQua thêm vào cuối nên không chen được.
       chon() = các DÒNG đã đánh dấu ở trang đang xem (edu.util.getArrCheckedIds(tbl, "checkX")).
       "Kết quả điều chỉnh" (span .btnChangeMucXuLy gốc) → ums.xlhvKQ.hopDoiMuc, lưu xong nạp lại.
   Khác bản gốc (chung): Lưu đổi mức — gốc đặt `if (strId) action = 'RL_TieuChiDanhGia/CapNhat'`
       (controller của phân hệ RÈN LUYỆN; strId luôn có nên KHÔNG BAO GIỜ gọi XLHV_KetQuaXuLy/CapNhat)
       → hopDoiMuc gọi XLHV_KetQuaXuLy/CapNhat. Còn lại xem đầu _ketqua.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.xlhvKQ, esc = ui.esc;
    var X = ums.xlhv = ums.xlhv || {};

    /* Cột của genTable_PheDuyetKetQua / genTable_RaQuyetDinh (sau Stt) */
    function cot() {
        var g = ['Thông tin học viên'];
        return [
            { head: '<input type="checkbox" data-xl="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (r) { return '<input type="checkbox" data-xl="one" value="' + esc(r.ID) + '">'; } },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN', group: g },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', group: g, cls: 'is-nowrap' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: g },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', group: g, cls: 'is-nowrap' },
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: g, cls: 'is-nowrap' },
            { title: 'Họ tên', group: g, cls: 'is-nowrap', render: function (r) { return esc(K.hoTen(r)); } },
            { title: 'Kết quả xử lý tự động', prop: 'MUCXULY_TEN', cls: 'is-center' },
            /* Mức sau điều chỉnh nằm ở MUCXULY_THAYDOI_TEN; MUCXULY_TEN luôn là mức tự động (kiểm host 30/9). Gốc hiện
               MUCXULY_TEN ở cả hai cột → đổi mức xong cột này không đổi. Chưa điều chỉnh thì hiện mức tự động làm liên kết. */
            { title: 'Kết quả điều chỉnh', cls: 'is-center', render: function (r) {
                return '<button type="button" class="ums-link" data-doimuc="' + esc(r.ID) + '" title="Thay đổi mức cảnh cáo">' + esc(K.mucDieuChinh(r)) + '</button>'; } },
            /* gốc đặt tên cột "Ngày điều chỉnh" nhưng đổ MUCXULY_THAYDOI_LYDO (lý do) — dữ liệu không có cột ngày → đặt tên đúng nội dung */
            { title: 'Lý do điều chỉnh', prop: 'MUCXULY_THAYDOI_LYDO' },
            { title: 'Người điều chỉnh', prop: 'MUCXULY_THAYDOI_CANBO' },
            { title: 'Điều kiện xử lý', prop: 'XLHV_KEHOACHXULY_TEN' }
        ];
    }

    X.man = function (root, cfg) {
        root.innerHTML = pat.page(cfg.tieuDe, '') +
            '<div data-z="loc"></div>' +
            '<div data-z="kq" hidden>' +
                pat.panel({ title: 'Danh sách', icon: 'fa-rectangle-list', count: 'n', flush: true,
                    tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + (cfg.tools || ''),
                    body: (cfg.tren || '') + '<div data-z="bang"></div>' }) +
            '</div>';
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        ui.enhance(z('kq'));

        var loc = K.boLoc(z('loc'), { hang: [['he', 'khoa', 'ct', 'lop'], ['nam', 'kql', 'hk', 'kh', 'loai'], ['muc', 'q', 'nut']] });
        ums.report.mount(loc.z('bc'), { collect: function (add) { loc.baoCao(add, cfg.baoCao); } });

        var ds = K.ketQua(root, { thamSo: loc.thamSo, cot: cot });

        /* Ô "chọn tất cả" ở tiêu đề → mọi ô của trang đang xem (chiều con → cha: ui.js lo) */
        root.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[data-xl="all"]')) return;
            Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-xl="one"]'), function (c) { c.checked = t.checked; });
        });

        function dong(id) { return K.arr(ds.data().rsThongTinNguoiHoc).filter(function (r) { return String(r.ID) === String(id); })[0]; }
        function chon() {
            var ids = Array.prototype.map.call(z('bang').querySelectorAll('input[data-xl="one"]:checked'), function (c) { return c.value; });
            return K.arr(ds.data().rsThongTinNguoiHoc).filter(function (r) { return ids.indexOf(String(r.ID)) >= 0; });
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a], [data-doimuc]');
            if (!b || !root.contains(b)) return;
            if (b.hasAttribute('data-doimuc')) {
                var r = dong(b.getAttribute('data-doimuc'));
                if (r) K.hopDoiMuc(r, { host: root, mucXuLy: loc.mucXuLy, onSaved: function () { ds.tai(); } });     // biểu mẫu trong trang (BO-CUC luật 1)
                return;
            }
            var a = b.getAttribute('data-a');
            if (a === 'search') ds.tim();
            else if (a !== 'dong' && cfg.onNut) cfg.onNut(a, b);      // "dong" do ums.xlhvKQ.ketQua lo
        });
        loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); ds.tim(); } });

        return { loc: loc, ds: ds, chon: chon, tai: function () { ds.tai(); }, z: z };
    };
})();
