/* =========================================================================
   Phân quyền (phân lịch giảng) — phân quyền NGƯỜI DÙNG theo lớp học phần, cho từng chức năng / quyền
   Bản gốc: ApisKeHoachChuongTrinh/Modules/phanlichgiang/html/phanquyen.html + script/phanquyen.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Thời gian · Hệ · Bộ môn · Học phần (chọn nhiều) /
   Chức năng phân quyền · Quyền cần thiết lập · từ khoá · Tìm kiếm) → khung "Danh sách" có nút
   "Phân quyền" và bảng CÂY × NGƯỜI DÙNG — gốc chép đúng khung của CMS phanquyen → dùng lại
   ums.pq.luoi (ApisCMS/Modules/phanquyen/script/_pq.js).

   Lời gọi (kiểu cũ, không func; chép nguyên):
       nạp ô    KHCT_ThoiGianDaoTao/LayDanhSach GET strTuKhoa '', strDAOTAO_NAM_Id '', pageIndex 1, pageSize 1000000
                KHCT_LichGiang/LayDSHeDaoTao GET strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HeDaoTao_Id
                KHCT_LichGiang/LayDSHocPhan GET strDaoTao_CoCauToChuc_Id, strDaoTao_HeDaoTao_Id, dToanBo 1,
                    strDaoTao_ThoiGianDaoTao_Id, strChucNang_Id → "MA - TEN"
                ums.ref.coCauToChuc (iTrangThai 1) → Bộ môn
                KHCT_PhanQuyen_HanhDong/LayDSChucNangCanPhanQuyen GET strChucNang_Id, strUngDung_Id ''
                KHCT_PhanQuyen_HanhDong/LayDSHanhDongTheo GET strUngDung_Id (appId = vai trò), strPhanQuyen_ChucNang_Id
       cột      KHCT_PhanQuyen_HanhDong/LayDSNguoiDungTheoChucNang GET strChucNang_Id, strPhanQuyen_ChucNang_Id
       cây      KHCT_PhanQuyen_ThongTin/LayDanhSach GET strTuKhoa, dToanBo 1, strDaoTao_CoCauToChuc_Id,
                strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HeDaoTao_Id, strDaoTao_HocPhan_Id (chọn nhiều, nối phẩy),
                strPhanQuyen_ChucNang_Id, strChucNang_Id
       từng lá  KHCT_PhanQuyen_ThongTin/LayDSQuyenTheoNguoiDung GET strChucNang_Id, strDaoTao_CoCauToChuc_Id,
                strPhanQuyen_ChucNang_Id, strLopHocPhan_Id (= ID LÁ), strHanhDong_Id
       thêm     KHCT_PhanQuyen_DuLieu/ThemMoi POST strId '', dHieuLuc 1, strLoaiQuyen_Id (chức năng phân quyền),
                strNgayBatDau / strNgayKetThuc '' (ô txtAAAA không tồn tại), strHanhDong_Id, strUngDung_Id (vai trò),
                strToHopBoDuLieuQuyen = ID LÁ, strNguoiDung_Id = ID CỘT, strMoTa ''
       xoá      KHCT_PhanQuyen_DuLieu/Xoa POST strIds = QUYEN_ID của ô
   Khác gốc (lỗi rõ):
     · Bộ lọc của lời gọi từng lá và lúc Phân quyền lấy theo lúc bấm Tìm kiếm.
     · Chưa chọn chức năng / quyền cần thiết lập thì chặn Tìm kiếm (gốc vẫn gọi với id rỗng) và Phân quyền.
     · Hỏi lại một lần (gốc gắn thêm trình xử lý #btnYes mỗi lần bấm → bấm lần hai gửi đôi) — khung ums.pq.
   Cha → con: Thời gian → Hệ, Thời gian → Học phần (khoá; Hệ / Bộ môn là lọc thêm như gốc),
   Chức năng phân quyền → Quyền cần thiết lập (khoá).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, pq = ums.pq;
    var root = document.getElementById('khct-phanquyen');
    if (!root) return;
    var L = 'KHCT_LichGiang/', PQ = 'KHCT_PhanQuyen_HanhDong/';
    var dsND = [], dang = null;

    root.innerHTML = pat.page('Phân quyền', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            pq.hang(pq.sel('tg', 'Chọn thời gian đào tạo') + pq.sel('he', 'Chọn hệ đào tạo') + pq.sel('bm', 'Chọn bộ môn') +
                pq.sel('hp', 'Chọn học phần', true), true) +
            pq.hang(pq.sel('cn', 'Chọn chức năng phân quyền') + pq.sel('quyen', 'Chọn quyền cần thiết lập') +
                pq.inp('q', 'Nhập từ khóa tìm kiếm') + pq.nutTim()) }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-calendar-users', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Phân quyền', icon: 'fa-user-shield', attr: { 'data-a': 'phanquyen' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    function get(a, o) { return ums.api.call(pq.gop({ action: a, method: 'GET', silent: true, strNguoiThucHien_Id: pq.uid() }, o)); }

    var Lu = pq.luoi(root.querySelector('[data-z="bang"]'), {
        tieuDe: 'Thông tin lớp học phần được thiết lập quyền',
        tenCot: pq.tenNguoi,
        dong: function (id) {
            return { action: 'KHCT_PhanQuyen_ThongTin/LayDSQuyenTheoNguoiDung', strChucNang_Id: pq.cn(), strDaoTao_CoCauToChuc_Id: dang.bm,
                strPhanQuyen_ChucNang_Id: dang.cn, strNguoiThucHien_Id: pq.uid(), strLopHocPhan_Id: id, strHanhDong_Id: dang.quyen };
        }
    });
    Lu.xoaTrang('Chọn chức năng phân quyền, quyền cần thiết lập rồi bấm Tìm kiếm');

    /* ---------- Nạp ô ---------------------------------------------------- */
    ums.api.call({ action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', silent: true, strTuKhoa: '', strDAOTAO_NAM_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (r) { pat.fill(f('tg'), pq.arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); }).catch(loi('thời gian đào tạo'));
    ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(f('bm'), d, { name: 'TEN', head: 'Chọn cơ cấu tổ chức' }); }).catch(loi('cơ cấu tổ chức'));
    pq.chucNang(f('cn'), { action: PQ + 'LayDSChucNangCanPhanQuyen', strChucNang_Id: pq.cn(), strUngDung_Id: '', strNguoiThucHien_Id: pq.uid() });

    function napHe() {
        if (!v('tg')) { pat.fill(f('he'), [], { head: 'Chọn hệ đào tạo' }); return Promise.resolve(); }
        return get(L + 'LayDSHeDaoTao', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HeDaoTao_Id: v('he') })
            .then(function (r) { pat.fill(f('he'), pq.arr(r.data), { name: 'TEN', head: 'Chọn hệ đào tạo' }); }).catch(loi('hệ đào tạo'));
    }
    function napHP() {
        if (!v('tg')) { pat.fill(f('hp'), []); return Promise.resolve(); }
        return get(L + 'LayDSHocPhan', { strDaoTao_CoCauToChuc_Id: v('bm'), strDaoTao_HeDaoTao_Id: v('he'), dToanBo: 1,
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strChucNang_Id: pq.cn() })
            .then(function (r) { pat.fill(f('hp'), pq.arr(r.data), { name: function (x) { return pq.e(x.MA) + ' - ' + pq.e(x.TEN); } }); })
            .catch(loi('học phần'));
    }
    /* Luật cha → con — gắn TRƯỚC trình xử lý nạp để tầng dưới đã được xoá trắng */
    pat.chain([f('tg'), f('he')], { phatLai: false });
    pat.chain([f('tg'), f('hp')], { phatLai: false });
    pat.chain([f('cn'), f('quyen')], { phatLai: false });
    jQuery(f('tg')).on('select2:select select2:clear', function () { napHe(); napHP(); });
    jQuery([f('he'), f('bm')]).on('select2:select select2:clear', function () { napHP(); });
    jQuery(f('cn')).on('select2:select select2:clear', function () {
        pq.hanhDong(f('quyen'), v('cn') ? { action: PQ + 'LayDSHanhDongTheo', strUngDung_Id: pq.vt(), strPhanQuyen_ChucNang_Id: v('cn'), strNguoiThucHien_Id: pq.uid() } : null);
    });

    /* ---------- Tìm kiếm: cột người dùng → cây lớp học phần → quyền từng lá ---------- */
    function tim() {
        if (!v('cn') || !v('quyen')) return ui.toast('Chọn chức năng phân quyền và quyền cần thiết lập', 'warn');
        dang = { tg: v('tg'), he: v('he'), bm: v('bm'), hp: v('hp'), cn: v('cn'), quyen: v('quyen'), q: (f('q').value || '').trim(), tenQuyen: pq.chu(f('quyen')) };
        Lu.xoaTrang('Đang tải…', 'fa-spinner fa-spin');
        get(PQ + 'LayDSNguoiDungTheoChucNang', { strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn, silent: false }).then(function (rc) {
            dsND = pq.arr(rc.data);
            return get('KHCT_PhanQuyen_ThongTin/LayDanhSach', { strTuKhoa: dang.q, dToanBo: 1, strDaoTao_CoCauToChuc_Id: dang.bm,
                strDaoTao_ThoiGianDaoTao_Id: dang.tg, strDaoTao_HeDaoTao_Id: dang.he, strDaoTao_HocPhan_Id: dang.hp,
                strPhanQuyen_ChucNang_Id: dang.cn, strChucNang_Id: pq.cn(), silent: false })
                .then(function (r) { return Lu.ve(dsND, r.data, dang.tenQuyen); });
        }).catch(function (err) { Lu.loi(err.message); ums.api.handle(err, 'cấu trúc phân quyền'); });
    }

    function phanQuyen() {
        if (!dang) return ui.toast('Bấm Tìm kiếm để nạp danh sách trước', 'warn');
        pq.phanQuyen(Lu, {
            them: function (x) {
                return { action: 'KHCT_PhanQuyen_DuLieu/ThemMoi', method: 'POST', strId: '', dHieuLuc: 1, strLoaiQuyen_Id: dang.cn,
                    strNgayBatDau: '', strNgayKetThuc: '', strHanhDong_Id: dang.quyen, strUngDung_Id: pq.vt(),
                    strToHopBoDuLieuQuyen: x.dong, strNguoiDung_Id: x.cot, strMoTa: '', strNguoiThucHien_Id: pq.uid() };
            },
            xoa: function (x) { return { action: 'KHCT_PhanQuyen_DuLieu/Xoa', method: 'POST', strIds: x.quyen, strNguoiThucHien_Id: pq.uid() }; },
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
