/* =========================================================================
   Cá nhân tự nhập hồ sơ — phân quyền trường thông tin cán bộ TỰ nhập
   Bản gốc: ApisCMS/Modules/phanquyen/html/canhantunhaphoso.html + script/canhantunhaphoso.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Bộ môn · Chức năng phân quyền ·
   Quyền cần thiết lập / từ khoá · Tìm kiếm) → khung "Danh sách" có nút "Phân quyền"
   và bảng CÂY CÁN BỘ × TRƯỜNG THÔNG TIN (khung ums.pq.luoi — script/_pq.js).

   Lời gọi (CMS_PhanQuyenDuLieu kiểu cũ, không func; chép nguyên):
       nạp ô    edu.system.getList_CoCauToChuc (ums.ref.coCauToChuc, iTrangThai 1) → Bộ môn
                LayDSChucNangCanPhanQuyen GET  strChucNang_Id, strUngDung_Id (= vai trò), strNguoiThucHien_Id
                LayDSHanhDongTheo GET          strUngDung_Id, strPhanQuyenCNTNHS_ChucNang_Id (TÊN LẠ — xem dưới)
       cột      danh mục NHANSU.TRUONGTHONGTIN (TEN)
       cây      LayDSCauTrucPhanQuyenCNNhapHS GET strTuKhoa, strDaoTao_CoCauToChuc_Id (bộ môn),
                                              strPhanQuyen_ChucNang_Id, strChucNang_Id
       từng lá  LayDSQuyenNhanSuTuNhapHoSo GET strChucNang_Id, strPhanQuyen_ChucNang_Id,
                                              strNguoiDung_Id (= ID LÁ), strHanhDong_Id
       thêm     Them_PhanQuyen_DuLieu POST  strId '', dHieuLuc 1, strLoaiQuyen_Id (chức năng PQ),
                strNgayBatDau/KetThuc '' (ô txtAAAA), strHanhDong_Id, strUngDung_Id (vai trò),
                strToHopBoDuLieuQuyen = ID CỘT (trường thông tin), strNguoiDung_Id = ID LÁ (cán bộ),
                strMoTa '', strChucNang_Id
       xoá      Xoa_PhanQuyen_DuLieu1 POST  strIds = QUYEN_ID của ô
   Giữ như bản gốc (nghi ngờ nhưng không chắc là lỗi):
     · LayDSHanhDongTheo gửi tên 'strPhanQuyenCNTNHS_ChucNang_Id' (có vẻ do đổi tên lớp
       hàng loạt; màn anh em gửi strPhanQuyen_ChucNang_Id) — giữ nguyên để danh sách quyền
       giống hệt hệ đang chạy.
     · Thêm: ID lá vào strNguoiDung_Id, ID cột vào strToHopBoDuLieuQuyen (gốc đặt tên biến
       ngược nhưng gửi đúng như vậy).
   Khác gốc (lỗi rõ):
     · Chức năng / quyền / bộ môn / từ khoá của lời gọi từng lá và lúc Phân quyền lấy theo
       lúc bấm Tìm kiếm (gốc đọc ô đang chọn lúc lưu → đổi ô Quyền mà không Tìm lại là ghi
       các ô đánh dấu của quyền cũ sang quyền MỚI).
     · Phân quyền khi chưa chọn chức năng / quyền (strLoaiQuyen_Id / strHanhDong_Id rỗng):
       chặn và nhắc. Gốc vẫn gửi.
   Cha → con: Chức năng phân quyền → Quyền cần thiết lập (khoá, ums.pat.chain).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, pq = ums.pq;
    var root = document.getElementById('pq-canhantunhaphoso');
    if (!root) return;

    var PQ = 'CMS_PhanQuyenDuLieu/';

    root.innerHTML = pat.page('Cá nhân tự nhập hồ sơ', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            pq.hang(pq.sel('bomon', 'Chọn cơ cấu tổ chức') + pq.sel('cn', 'Chọn chức năng phân quyền') + pq.sel('quyen', 'Chọn quyền cần thiết lập'), true) +
            pq.hang(pq.inp('q', 'Nhập từ khóa tìm kiếm') + pq.nutTim()) }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-rectangle-history-circle-user', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Phân quyền', attr: { 'data-a': 'phanquyen' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    var dang = null;   // bộ lọc của lượt đang hiện

    var L = pq.luoi(root.querySelector('[data-z="bang"]'), {
        tieuDe: 'Thông tin cán bộ được thiết lập quyền',
        tenCot: function (c) { return c.TEN; },
        dong: function (id) {
            return { action: PQ + 'LayDSQuyenNhanSuTuNhapHoSo', strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn,
                strNguoiDung_Id: id, strNguoiThucHien_Id: pq.uid(), strHanhDong_Id: dang.quyen };
        }
    });
    L.xoaTrang('Chọn chức năng phân quyền, quyền cần thiết lập rồi bấm Tìm kiếm');

    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
        .then(function (d) { pat.fill(f('bomon'), d, { name: 'TEN', head: 'Chọn cơ cấu tổ chức' }); })
        .catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });
    pq.chucNang(f('cn'), { action: PQ + 'LayDSChucNangCanPhanQuyen', strChucNang_Id: pq.cn(), strUngDung_Id: pq.vt(), strNguoiThucHien_Id: pq.uid() });

    jQuery(f('cn')).on('select2:select', function () {
        pq.hanhDong(f('quyen'), v('cn') ? { action: PQ + 'LayDSHanhDongTheo', strUngDung_Id: pq.vt(),
            strPhanQuyenCNTNHS_ChucNang_Id: v('cn'), strNguoiThucHien_Id: pq.uid() } : null);
    });
    pat.chain([f('cn'), f('quyen')]);

    function tim() {
        dang = { cn: v('cn'), quyen: v('quyen'), tenQuyen: pq.chu(f('quyen')), bomon: v('bomon'), q: (f('q').value || '').trim() };
        L.xoaTrang('Đang tải…', 'fa-spinner fa-spin');
        ums.api.dm('NHANSU.TRUONGTHONGTIN').then(function (cot) {
            return ums.api.call({ action: PQ + 'LayDSCauTrucPhanQuyenCNNhapHS', method: 'GET', strTuKhoa: dang.q,
                strDaoTao_CoCauToChuc_Id: dang.bomon, strPhanQuyen_ChucNang_Id: dang.cn, strChucNang_Id: pq.cn(), strNguoiThucHien_Id: pq.uid() })
                .then(function (r) { return L.ve(cot, r.data, dang.tenQuyen); });
        }).catch(function (err) { L.loi(err.message); ums.api.handle(err, 'cấu trúc phân quyền'); });
    }

    function phanQuyen() {
        if (!dang) return ui.toast('Bấm Tìm kiếm để nạp danh sách trước', 'warn');
        if (!dang.cn || !dang.quyen) return ui.toast('Chọn chức năng phân quyền và quyền cần thiết lập rồi Tìm kiếm lại', 'warn');
        pq.phanQuyen(L, {
            them: function (x) {
                return { action: PQ + 'Them_PhanQuyen_DuLieu', strId: '', dHieuLuc: 1, strLoaiQuyen_Id: dang.cn,
                    strNgayBatDau: '', strNgayKetThuc: '', strHanhDong_Id: dang.quyen, strUngDung_Id: pq.vt(),
                    strToHopBoDuLieuQuyen: x.cot, strNguoiDung_Id: x.dong, strMoTa: '', strNguoiThucHien_Id: pq.uid(), strChucNang_Id: pq.cn() };
            },
            xoa: function (x) { return { action: PQ + 'Xoa_PhanQuyen_DuLieu1', strIds: x.quyen, strNguoiThucHien_Id: pq.uid() }; },
            sauLuu: tim
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'phanquyen') phanQuyen();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
