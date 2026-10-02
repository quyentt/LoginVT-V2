/* =========================================================================
   Sinh viên tự nhập — phân quyền trường thông tin SINH VIÊN tự nhập, theo lớp
   Bản gốc: ApisCMS/Modules/phanquyen/html/sinhvientunhap.html + script/sinhvientunhap.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp · Năm nhập học ·
   Khoa QL · Chức năng phân quyền / Quyền cần thiết lập · từ khoá · Tìm kiếm / khối
   "Chọn trạng thái sinh viên") → khung "Danh sách" có nút "Phân quyền" và bảng
   CÂY LỚP × TRƯỜNG THÔNG TIN (ums.pq.luoi, ums.pq.daoTao — script/_pq.js).
   Bản gốc chép từ canhantunhaphoso (git diff: thêm bộ lọc đào tạo).

   Lời gọi (CMS_PhanQuyenDuLieu kiểu cũ, không func; chép nguyên):
       nạp ô    edu.system.getList_HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao / LopQuanLy /
                KhoaQuanLy, KHCT_ThongTin/LayDSNamNhapHoc GET, danh mục QLSV.TRANGTHAI (ums.pq.daoTao)
                LayDSChucNangCanPhanQuyen GET  strChucNang_Id, strUngDung_Id (= vai trò)
                LayDSHanhDongTheo GET          strUngDung_Id, strPhanQuyenSVTN_ChucNang_Id (TÊN LẠ — xem dưới)
       cột      danh mục QLSV.TRUONGTHONGTIN (TEN)
       cây      LayDSCauTrucQuyenChoSVNhapHoSo GET strTuKhoa, strChucNang_Id, strPhanQuyen_ChucNang_Id,
                strKhoaQuanLy_Id, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id, strLopQuanLy_Id,
                strNamNhapHoc, strTrangThaiNguoiHoc_Id (ô chọn nhiều → "a,b" như getValCombo)
       từng lá  LayDSQuyenChoPhepSVNhapHoSo GET strChucNang_Id, strPhanQuyen_ChucNang_Id,
                strLopQuanLy_Id (= ID LÁ), strHanhDong_Id
       thêm     Them_PhanQuyen_DuLieu POST  strId '', dHieuLuc 1, strLoaiQuyen_Id, strNgayBatDau/KetThuc '',
                strHanhDong_Id, strUngDung_Id (vai trò), strToHopBoDuLieuQuyen = ID CỘT (trường thông tin),
                strNguoiDung_Id = ID LÁ (lớp), strMoTa '', strChucNang_Id
       xoá      Xoa_PhanQuyen_DuLieu1 POST  strIds = QUYEN_ID của ô
   Giữ như bản gốc (nghi ngờ): LayDSHanhDongTheo gửi tên 'strPhanQuyenSVTN_ChucNang_Id' (có vẻ do
   đổi tên lớp hàng loạt; màn anh em gửi strPhanQuyen_ChucNang_Id).
   Cố ý bỏ: genList_TrangThaiSV của gốc gán NHẦM danh sách trạng thái vào dtNguoiDung (bị đè
   ngay khi Tìm kiếm — không ảnh hưởng); các nhánh dropSearch_NguoiThu_IHD (ô không tồn tại).
   Khác gốc (lỗi rõ): bộ lọc của lời gọi từng lá và lúc Phân quyền lấy theo lúc bấm Tìm kiếm;
   chưa chọn chức năng / quyền thì chặn Phân quyền.
   Cha → con: Hệ → Khoá → CT → Lớp (KHOÁ — luật chung; gốc nạp sẵn "Tất cả …"),
   Chức năng phân quyền → Quyền cần thiết lập (khoá).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, pq = ums.pq;
    var root = document.getElementById('pq-sinhvientunhap');
    if (!root) return;

    var PQ = 'CMS_PhanQuyenDuLieu/';

    root.innerHTML = pat.page('Sinh viên tự nhập', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            pq.hang(pq.daoTaoHtml() + pq.sel('cn', 'Chọn chức năng phân quyền'), true) +
            pq.hang(pq.sel('quyen', 'Chọn quyền cần thiết lập') + pq.inp('q', 'Nhập từ khóa tìm kiếm') + pq.nutTim()) +
            pq.trangThaiHtml() }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-rectangle-history-circle-user', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Phân quyền', attr: { 'data-a': 'phanquyen' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    var dt = pq.daoTao(root);
    var dang = null;

    var L = pq.luoi(root.querySelector('[data-z="bang"]'), {
        tieuDe: 'Thông tin lớp được thiết lập quyền',
        tenCot: function (c) { return c.TEN; },
        dong: function (id) {
            return { action: PQ + 'LayDSQuyenChoPhepSVNhapHoSo', strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn,
                strNguoiThucHien_Id: pq.uid(), strLopQuanLy_Id: id, strHanhDong_Id: dang.quyen };
        }
    });
    L.xoaTrang('Chọn chức năng phân quyền, quyền cần thiết lập rồi bấm Tìm kiếm');

    pq.chucNang(f('cn'), { action: PQ + 'LayDSChucNangCanPhanQuyen', strChucNang_Id: pq.cn(), strUngDung_Id: pq.vt(), strNguoiThucHien_Id: pq.uid() });
    jQuery(f('cn')).on('select2:select', function () {
        pq.hanhDong(f('quyen'), v('cn') ? { action: PQ + 'LayDSHanhDongTheo', strUngDung_Id: pq.vt(),
            strPhanQuyenSVTN_ChucNang_Id: v('cn'), strNguoiThucHien_Id: pq.uid() } : null);
    });
    pat.chain([f('cn'), f('quyen')]);

    function tim() {
        dang = { cn: v('cn'), quyen: v('quyen'), tenQuyen: pq.chu(f('quyen')), q: (f('q').value || '').trim(), loc: dt.thamSo() };
        L.xoaTrang('Đang tải…', 'fa-spinner fa-spin');
        ums.api.dm('QLSV.TRUONGTHONGTIN').then(function (cot) {
            var l = dang.loc;
            return ums.api.call({ action: PQ + 'LayDSCauTrucQuyenChoSVNhapHoSo', method: 'GET', strTuKhoa: dang.q,
                strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn, strKhoaQuanLy_Id: l.strKhoaQuanLy_Id,
                strHeDaoTao_Id: l.strHeDaoTao_Id, strKhoaDaoTao_Id: l.strKhoaDaoTao_Id, strChuongTrinh_Id: l.strChuongTrinh_Id,
                strLopQuanLy_Id: l.strLopQuanLy_Id, strNamNhapHoc: l.strNamNhapHoc, strTrangThaiNguoiHoc_Id: l.strTrangThaiNguoiHoc_Id,
                strNguoiThucHien_Id: pq.uid() })
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
