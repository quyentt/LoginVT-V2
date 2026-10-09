/* =========================================================================
   Cán bộ nhập hồ sơ cán bộ — phân quyền NGƯỜI DÙNG được nhập trường thông tin
   của từng cán bộ
   Bản gốc: ApisCMS/Modules/phanquyen/html/canbonhaphosocanbo.html + script/canbonhaphosocanbo.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Bộ môn · Trường thông tin · Chức năng
   phân quyền · Quyền cần thiết lập / từ khoá · Tìm kiếm) → khung "Danh sách" có nút
   "Phân quyền" và bảng CÂY CÁN BỘ × NGƯỜI DÙNG (ums.pq.luoi — script/_pq.js).
   Bản gốc chép từ canhantunhaphoso (git diff: 81 dòng thêm) — khác ở cột (người dùng
   thay trường thông tin), ô Trường thông tin và ba lời gọi dưới.

   Lời gọi (CMS_PhanQuyenDuLieu kiểu cũ, không func; chép nguyên):
       nạp ô    edu.system.getList_CoCauToChuc (ums.ref.coCauToChuc, iTrangThai 1) → Bộ môn
                danh mục NHANSU.TRUONGTHONGTIN → Trường thông tin
                LayDSChucNangCanPhanQuyen GET  strChucNang_Id, strUngDung_Id (= vai trò)
                LayDSHanhDongTheo GET          strUngDung_Id, strPhanQuyen_ChucNang_Id
       cột      LayDSNguoiDungTheoChucNang GET strChucNang_Id, strPhanQuyen_ChucNang_Id → "FULLNAME - NAME"
       cây      LayDSCauTrucPhanQuyenCBNhapHS GET strTuKhoa, strDaoTao_CoCauToChuc_Id, strPhanQuyen_ChucNang_Id, strChucNang_Id
       từng lá  LayDSQuyenNhanSuNhapHoSoCB GET strChucNang_Id, strPhanQuyen_ChucNang_Id,
                strNguoiDung_Id (= ID LÁ — cán bộ được nhập hồ sơ), strHanhDong_Id, strTruongThongTin_Id
       thêm     Them_PhanQuyen_DuLieu POST  strId '', dHieuLuc 1, strLoaiQuyen_Id, strNgayBatDau/KetThuc '',
                strHanhDong_Id, strUngDung_Id (vai trò), strToHopBoDuLieuQuyen = ID LÁ + ID TRƯỜNG
                THÔNG TIN (nối chuỗi như gốc), strNguoiDung_Id = ID CỘT (người dùng), strMoTa '', strChucNang_Id
       xoá      Xoa_PhanQuyen_DuLieu1 POST  strIds = QUYEN_ID của ô
   Giữ như bản gốc (nghi ngờ): không chọn Trường thông tin thì strToHopBoDuLieuQuyen chỉ còn
   ID lá — gốc vẫn gửi như vậy (ghi can-quyet).
   Khác gốc (lỗi rõ): bộ lọc của lời gọi từng lá và lúc Phân quyền lấy theo lúc bấm Tìm kiếm
   (gốc đọc ô đang chọn lúc lưu → đổi Quyền / Trường thông tin mà không Tìm lại là ghi sai
   quyền); chưa chọn chức năng / quyền thì chặn Phân quyền (gốc gửi rỗng).
   Cha → con: Chức năng phân quyền → Quyền cần thiết lập (khoá, ums.pat.chain).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, pq = ums.pq;
    var root = document.getElementById('pq-canbonhaphosocanbo');
    if (!root) return;

    var PQ = 'CMS_PhanQuyenDuLieu/';

    root.innerHTML = pat.page('Cán bộ nhập hồ sơ cán bộ', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            pq.hang(pq.sel('bomon', 'Chọn cơ cấu tổ chức') + pq.sel('tt', 'Chọn trường thông tin') +
                pq.sel('cn', 'Chọn chức năng phân quyền') + pq.sel('quyen', 'Chọn quyền cần thiết lập'), true) +
            pq.hang(pq.inp('q', 'Nhập từ khóa tìm kiếm') + pq.nutTim()) }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-rectangle-history-circle-user', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Phân quyền', attr: { 'data-a': 'phanquyen' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    var dang = null;

    var L = pq.luoi(root.querySelector('[data-z="bang"]'), {
        tieuDe: 'Thông tin cán bộ được thiết lập quyền',
        tenCot: pq.tenNguoi,
        dong: function (id) {
            return { action: PQ + 'LayDSQuyenNhanSuNhapHoSoCB', strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn,
                strNguoiDung_Id: id, strNguoiThucHien_Id: pq.uid(), strHanhDong_Id: dang.quyen, strTruongThongTin_Id: dang.tt };
        }
    });
    L.xoaTrang('Chọn chức năng phân quyền, quyền cần thiết lập rồi bấm Tìm kiếm');

    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
        .then(function (d) { pat.fill(f('bomon'), d, { name: 'TEN', head: 'Chọn cơ cấu tổ chức' }); })
        .catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });
    ums.api.dm('NHANSU.TRUONGTHONGTIN').then(function (d) { pat.fill(f('tt'), d, { head: 'Chọn trường thông tin' }); })
        .catch(function (err) { ums.api.handle(err, 'trường thông tin'); });
    pq.chucNang(f('cn'), { action: PQ + 'LayDSChucNangCanPhanQuyen', strChucNang_Id: pq.cn(), strUngDung_Id: pq.vt(), strNguoiThucHien_Id: pq.uid() });

    jQuery(f('cn')).on('select2:select', function () {
        pq.hanhDong(f('quyen'), v('cn') ? { action: PQ + 'LayDSHanhDongTheo', strUngDung_Id: pq.vt(),
            strPhanQuyen_ChucNang_Id: v('cn'), strNguoiThucHien_Id: pq.uid() } : null);
    });
    pat.chain([f('cn'), f('quyen')]);

    function tim() {
        dang = { cn: v('cn'), quyen: v('quyen'), tenQuyen: pq.chu(f('quyen')), tt: v('tt'), bomon: v('bomon'), q: (f('q').value || '').trim() };
        L.xoaTrang('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: PQ + 'LayDSNguoiDungTheoChucNang', method: 'GET', strChucNang_Id: pq.cn(),
            strPhanQuyen_ChucNang_Id: dang.cn, strNguoiThucHien_Id: pq.uid() }).then(function (rc) {
            return ums.api.call({ action: PQ + 'LayDSCauTrucPhanQuyenCBNhapHS', method: 'GET', strTuKhoa: dang.q,
                strDaoTao_CoCauToChuc_Id: dang.bomon, strPhanQuyen_ChucNang_Id: dang.cn, strChucNang_Id: pq.cn(), strNguoiThucHien_Id: pq.uid() })
                .then(function (r) { return L.ve(rc.data, r.data, dang.tenQuyen); });
        }).catch(function (err) { L.loi(err.message); ums.api.handle(err, 'cấu trúc phân quyền'); });
    }

    function phanQuyen() {
        if (!dang) return ui.toast('Bấm Tìm kiếm để nạp danh sách trước', 'warn');
        if (!dang.cn || !dang.quyen) return ui.toast('Chọn chức năng phân quyền và quyền cần thiết lập rồi Tìm kiếm lại', 'warn');
        pq.phanQuyen(L, {
            them: function (x) {
                return { action: PQ + 'Them_PhanQuyen_DuLieu', strId: '', dHieuLuc: 1, strLoaiQuyen_Id: dang.cn,
                    strNgayBatDau: '', strNgayKetThuc: '', strHanhDong_Id: dang.quyen, strUngDung_Id: pq.vt(),
                    strToHopBoDuLieuQuyen: x.dong + dang.tt, strNguoiDung_Id: x.cot, strMoTa: '',
                    strNguoiThucHien_Id: pq.uid(), strChucNang_Id: pq.cn() };
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
