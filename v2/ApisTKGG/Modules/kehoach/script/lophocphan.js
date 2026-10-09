/* =========================================================================
   Xác định phạm vi dữ liệu lớp HP (Thống kê giờ giảng — kế hoạch)
   Bản gốc: ApisTKGG/Modules/kehoach/html/lophocphan.html (756 dòng) + script/lophocphan.js (3.102 dòng)
   Bố cục một cột như gốc: khung tìm kiếm → khung "Danh sách" (nút hàng loạt + bảng phân trang máy chủ). Khung "Thêm mới",
   "Duyệt buổi học", "Khối lượng cá nhân" THAY CHỖ màn (pat.formTrang — gốc: zone-bus toggle_overide); hộp thoại chỉ cho việc phụ:
   Xác nhận (ums.tkgg.xacNhan), Khóa dữ liệu / Không tính theo TKB (một ô chọn + hỏi lại), Áp đặt số lượng (một ô), Dữ liệu chi tiết (xem).
   Tách tệp: _lophocphan_them.js (khung Thêm + ô đánh dấu), _lophocphan_xem.js (Duyệt buổi học, Khối lượng cá nhân, Chi tiết, Áp đặt).
   ---------------------------------------------------------------------------
   Khung tìm kiếm (strNguoiThucHien_Id hệ tự chèn; ô gốc đọc dropAAAA / txtAAAA → ''):
     Thời gian → KH tổng hợp → KH chi tiết: ums.tkgg.boLocKeHoach(loai 'plain', muc 3) — TKGG_KeHoach/LayDSThoiGianTongHopKL ·
       LayDSKLGD_TongHopKhoiLuong · LayDSKLGD_KeHoachChiTiet (GET).
     Đợt học       TKGG_KeHoach/LayDSThoiGianTheoKHChiTiet (GET) — strKLGD_KeHoachChiTiet_Id → ID, THOIGIAN
     Đơn vị PT HP  TKGG_KeHoach/LayDSDonViPhuTrachHocPhan (GET) — strKLGD_KeHoachChiTiet_Id, strDotHoc_Id → ID, TEN
     Học phần      TKGG_KeHoach/LayDSHocPhan (GET) — strKLGD_KeHoachChiTiet_Id, strDaoTao_CoCauToChuc_Id (= Đơn vị PT HP), strDotHoc_Id → "TEN - MA"
     Đơn vị (GV)   edu.system.getList_CoCauToChuc → ums.ref.coCauToChuc({ iTrangThai: 1 }) → TEN
     Thành viên    NS_HoSoV2/LayDanhSach (GET) — strTuKhoa '', pageIndex 1, pageSize 100000, strDaoTao_CoCauToChuc_Id, strNguoiThucHien_Id '',
                   dLaCanBoNgoaiTruong -1 → "HOTEN - MASO"
     Xác định dữ liệu giảng: 0 theo TKB · 1 theo TKB và điểm danh (ô cố định, dùng cho Tạo dữ liệu giảng)
     Hình thức học NS_KLGD_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP · pkg_klgv_v2_chung.LayDSHinhThucHoc → "TENHINHTHUCHOC - MAHINHTHUCHOC"
     Quy mô lớp từ / đến (số; trống → -1 như gốc) · Tìm kiếm · nút báo cáo zonebtnBaoCao_LopHocPhan → ums.report.mount:
       strDaoTao_ThoiGianDaoTao_Id (gốc đọc ô Thời gian của khung Thêm → '' khi khung chưa mở), strKLGD_KeHoachChiTiet_Id, strKLGD_TongHopKhoiLuong_Id,
       strDotHoc_Id, strDonViQuanLyHocPhan_Id, strDaoTao_HocPhan_Id, strDonViQuanLyGiangVien_Id, strGiangVien_Id2 (= Thành viên),
       strGiangVien_Id (= GV vừa mở Khối lượng cá nhân), strDangKy_LopHocPhan_Id × mỗi dòng đánh dấu; strTrangThaiNguoiHoc_Id (ckbDSTrangThaiSV
       không có trên html → không gửi).
   Danh sách: NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNAPP · pkg_klgv_v2_kehoach.LayDSKLGD_DuLieu (POST mã hoá) — strTKB_HinhThucHoc_Id, strTuKhoa '',
     strDaoTao_HocPhan_Id, strKLGD_TongHopKhoiLuong_Id, strKLGD_KeHoachChiTiet_Id, strDotHoc_Id, strLoaiXacNhan_Id '', strHanhDongXacNhan_Id '',
     strDonViQuanLyHocPhan_Id, strDonViQuanLyGiangVien_Id, strGiangVien_Id, dQuyMoBatDau, dQuyMoKetThuc, pageIndex, pageSize (Pager = tổng).
     Cột: DAOTAO_HOCPHAN_MA · DAOTAO_HOCPHAN_TEN (bấm → hộp Áp đặt) · DAOTAO_LOPHOCPHAN_TEN · HINHTHUCHOC_MA · GIANGVIEN / GIANGVIEN_ID (nhiều GV
     cách dấu phẩy, mỗi GV một nút → Khối lượng cá nhân) · TTPHANBOTHEOCTDT · TONGSOTIETTKBMO · TONGSOTIETGIANG · TONGSOTIETGIANGXACNHAN · NAMHOC ·
     HOCKY · DOTHOC · NGAYBATDAU · NGAYKETTHUC · DAOTAO_KHOADAOTAO_TEN · DAOTAO_KHOAQUANLY_TEN · QUYMO · TONGSOGIOCHUAN · KHOADULIEU ('1' = Khóa) ·
     Duyệt buổi học (nút) · KHONGTINHTHEOTKB (> 0 = "Không tính theo TKB") · nhóm "Phân loại theo nhóm lớp" = mỗi mã danh mục
     KLGD.PHANLOAIXACNHAN một cột, từng ô TKGG_XacNhan/LayTTKLGD_PhanLoai_XacNhan (ums.tkgg.ttXacNhan, hàng đợi 6 luồng) · ô đánh dấu.
     Dòng tổng (gốc insertSumAfterTable): Phân bổ CTDT, Tổng tiết TKB, Tổng theo phân GV, Tổng xác nhận, Số lượng, Số giờ chuẩn.
     Dòng lệch (TONGSOTIETGIANG ≠ TONGSOTIETGIANGXACNHAN hoặc ≠ TONGSOTIETTKBMO) tô nền vàng như gốc.
   Thao tác hàng loạt trên dòng đánh dấu (hỏi lại MỘT lần → ui.batch, xong nạp lại danh sách):
     Xóa              TKGG_KeHoach/Xoa_KLGD_DuLieu_LopHocPhan (POST) — strIds = một ID (strChucNang_Id hệ tự chèn) — ui.xoaChon + T.xoaNhieu
     Khóa dữ liệu     TKGG_KeHoach/Them_KLGD_DuLieu_Khoa (POST) — strKLGD_DuLieu_Id, dKhoaDuLieu 0 (mở) / 1 (khóa)
     Tính khối lượng  NS_KLGD_TinhToan_MH/FSk0IgkoJC8VKC8pFS4gLwoNBgUeBTQNKCQ0 · PKG_KLGV_V2_TINHTOAN.ThucHienTinhToanKLGD_DuLieu — strKLGD_DuLieu_Id
     Không tính TKB   NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgU0DSgkNB4KKS4vJhUKAwPP · PKG_KLGV_V2_THONGTIN.Them_KLGD_DuLieu_KhongTKB (Thêm) |
                      NS_KLGD_ThongTin_MH/GS4gHgoNBgUeBTQNKCQ0HgopLi8mFQoD · …Xoa_KLGD_DuLieu_KhongTKB (Xóa) — strKLGD_DuLieu_Id, strKLGD_KeHoachChiTiet_Id (của dòng)
     Xác nhận         ums.tkgg.xacNhan({ ids: DULIEUXACNHAN của dòng đánh dấu }) — TKGG_XacNhan/Them_KLGD_PhanLoai_XacNhan
   Tạo dữ liệu giảng (KHÔNG theo dòng đánh dấu — gốc chạy cho MỌI dòng của bộ lọc): TKGG_KeHoach/LayDSKLGD_DuLieu (GET) — strTuKhoa '',
     strDaoTao_HocPhan_Id, strKLGD_KeHoachChiTiet_Id, pageIndex 1, pageSize 100000 → mỗi ID một lời gọi TKGG_TinhToan/ThucHienTaoDuLieuGiang (POST) —
     dCachXacDinhDuLieuGiang (ô Xác định dữ liệu giảng), strKLGD_DuLieu_Id.
   Thêm lớp cần tính → L.khungThem (xem _lophocphan_them.js). Duyệt buổi học / Khối lượng cá nhân / Chi tiết / Áp đặt → _lophocphan_xem.js.
   Xuất Excel (nút + Ctrl+G như gốc): thư viện assets/vendor/xlsx/xlsx.bundle.js nạp khi bấm; tiêu đề hai tầng, gộp ô, cột rộng theo nội dung,
     dòng lệch tô vàng, dữ liệu = các dòng đang hiện (cột phân loại lấy từ ô đã tải).
   Giữ như gốc: không có ô từ khoá (strTuKhoa luôn ''); Hệ số / Loại xác nhận không lọc (dropAAAA); phạm vi Tạo dữ liệu giảng là MỌI dòng của bộ lọc;
     đổi ô Học phần thì nạp lại danh sách; Duyệt buổi học lưu MỌI ô đang vẽ (kể cả ô không đổi).
   Khác gốc: nạp danh sách ngay khi mở màn (gốc chờ bấm Tìm kiếm); cha → con khoá / xoá trắng (KH chi tiết → Đợt học · Đơn vị PT HP · Học phần;
     Đơn vị → Thành viên — gốc nạp 100.000 hồ sơ ngay khi mở); Tạo dữ liệu giảng đòi chọn KH chi tiết và nói rõ phạm vi trước khi chạy
     (gốc hỏi "Bạn có chắc chắn thực hiện?" rồi chạy cho mọi kế hoạch khi ô trống); mọi thao tác hàng loạt hỏi lại một lần, có tiến độ,
     báo gộp (gốc gắn chồng #btnYes, N thông báo); Quy mô lớp từ / đến phải là số; Xác nhận hàng loạt xong nạp lại danh sách một lần.
   Cố ý bỏ: nút "Xác nhận tự động" (btnXacNhanTuDong — handler có trong JS, html KHÔNG có nút → PKG_KLGV_V2_TINHTOAN.ThucHienXacNhanTuDong không
     dựng; cần thì thêm một nút); dropLopCuoi / getList_DangKyHocKQ (không tồn tại); zoneprocessXXXX1 + getData_SoTiet (đã ghi chú);
     syncScrollBar (thanh cuộn ngang phụ — ums-tablewrap tự cuộn); khối <style> riêng; đoạn nạp XLSX từ CDN (dùng bản trong assets/vendor);
     đoạn vá select2 trong modal; ckbDSTrangThaiSV (không có trên html).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg, L = ums.tkggLHP;
    var root = document.getElementById('tkgg-lophocphan');
    if (!root) return;
    var e = T.e, arr = T.arr, esc = ui.esc;

    root.innerHTML = pat.page('Xác định phạm vi dữ liệu lớp HP', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter" data-z="loc"></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-table-list', count: 'n', flush: true, zone: 'bang',
            tools: ui.xoaChon('[data-z="bang"] input[data-ck]', { attr: { 'data-a': 'xoa' } }) +
                ui.btn('search', { text: 'Khóa dữ liệu', mod: 'danger', icon: 'fa-lock', attr: { 'data-a': 'khoa' } }) +
                ui.btn('search', { text: 'Thực hiện tạo dữ liệu chi tiết tính khối lượng', mod: 'out-info', icon: 'fa-database', attr: { 'data-a': 'taodl' } }) +
                ui.btn('search', { text: 'Tính khối lượng', mod: 'out-success', icon: 'fa-calculator', attr: { 'data-a': 'tinhkl' } }) +
                ui.btn('search', { text: 'Xác định không tính theo TKB', mod: 'warn', icon: 'fa-calendar-xmark', attr: { 'data-a': 'khongtkb' } }) +
                ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } }) +
                ui.btn('add', { text: 'Thêm lớp cần tính', attr: { 'data-a': 'them' } }) +
                ui.btn('excel', { attr: { 'data-a': 'excel', title: 'Xuất danh sách theo dữ liệu đang hiển thị (Ctrl+G)' } }) });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var loc = z('loc'), bang = z('bang');

    /* ---------- Khung tìm kiếm ---------- */
    var kh = T.boLocKeHoach(loc, { loai: 'plain', muc: 3, onDoi: function (k) { if (k === 'ct') { napDot(); napDV(); napHP(); } } });
    var NHAN = { dot: 'Chọn đợt học theo TKB', dv: 'Chọn đơn vị phục trách học phần', hp: 'Chọn học phần', dvtv: 'Chọn đơn vị', tv: 'Chọn thành viên', ht: 'Chọn hình thức học' };
    loc.insertAdjacentHTML('beforeend',
        ['dot', 'dv', 'hp', 'dvtv', 'tv'].map(function (k) {
            return '<div class="ums-field"><select class="ums-select" data-lhp="' + k + '" data-ph="' + esc(NHAN[k]) + '"><option value="">' + esc(NHAN[k]) + '</option></select></div>';
        }).join('') +
        '<div class="ums-field"><select class="ums-select" data-lhp="cach" data-no-s2><option value="0">Xác định dữ liệu theo TKB</option><option value="1">Xác định dữ liệu theo TKB và điểm danh</option></select></div>' +
        '<div class="ums-field"><select class="ums-select" data-lhp="ht" data-ph="' + esc(NHAN.ht) + '"><option value="">' + esc(NHAN.ht) + '</option></select></div>' +
        '<div class="ums-field"><input class="ums-input" type="number" min="0" data-lhp="qm1" placeholder="Quy mô lớp từ" title="Quy mô lớp từ" autocomplete="off"></div>' +
        '<div class="ums-field"><input class="ums-input" type="number" min="0" data-lhp="qm2" placeholder="Quy mô lớp đến" title="Quy mô lớp đến" autocomplete="off"></div>' +
        '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
        '<div class="ums-field ums-field--fit" data-z="bc"></div>');
    function f(k) { return loc.querySelector('[data-lhp="' + k + '"]'); }
    function v(k) { var el = f(k); return el ? e(el.value).trim() : ''; }
    var el = {}; ['dot', 'dv', 'hp', 'dvtv', 'tv', 'ht'].forEach(function (k) { el[k] = f(k); ui.select2(el[k], { placeholder: NHAN[k], allowClear: true }); });
    pat.chain([kh.el('ct'), el.dot], { phatLai: false });
    pat.chain([kh.el('ct'), el.dv], { phatLai: false });
    pat.chain([kh.el('ct'), el.hp], { phatLai: false });
    pat.chain([el.dvtv, el.tv]);

    function nap(k, call, name, head) {
        pat.fill(el[k], [], { head: head || NHAN[k] });
        return ums.api.call(call).then(function (r) { pat.fill(el[k], arr(r.data), { id: 'ID', name: name, head: head || NHAN[k] }); })
            .catch(function (err) { ums.api.handle(err, call.func || call.action); });
    }
    function napDot() { if (!kh.v('ct')) { pat.fill(el.dot, [], { head: NHAN.dot }); return; } nap('dot', { action: 'TKGG_KeHoach/LayDSThoiGianTheoKHChiTiet', method: 'GET', strKLGD_KeHoachChiTiet_Id: kh.v('ct') }, 'THOIGIAN'); }
    function napDV() { if (!kh.v('ct')) { pat.fill(el.dv, [], { head: NHAN.dv }); return; } nap('dv', { action: 'TKGG_KeHoach/LayDSDonViPhuTrachHocPhan', method: 'GET', strKLGD_KeHoachChiTiet_Id: kh.v('ct'), strDotHoc_Id: v('dot') }, 'TEN'); }
    function napHP() {
        if (!kh.v('ct')) { pat.fill(el.hp, [], { head: NHAN.hp }); return; }
        nap('hp', { action: 'TKGG_KeHoach/LayDSHocPhan', method: 'GET', strKLGD_KeHoachChiTiet_Id: kh.v('ct'), strDaoTao_CoCauToChuc_Id: v('dv'), strDotHoc_Id: v('dot') }, function (r) { return e(r.TEN) + ' - ' + e(r.MA); });
    }
    function napTV() {
        if (!v('dvtv')) { pat.fill(el.tv, [], { head: NHAN.tv }); return; }
        nap('tv', { action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 100000, strDaoTao_CoCauToChuc_Id: v('dvtv'), strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: -1 },
            function (r) { return e(r.HOTEN) + ' - ' + e(r.MASO); });
    }
    el.dot.addEventListener('change', function () { napDV(); napHP(); });
    el.dv.addEventListener('change', napHP);
    el.hp.addEventListener('change', function () { tai(1); });
    el.dvtv.addEventListener('change', napTV);
    ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(el.dvtv, arr(d), { id: 'ID', name: 'TEN', head: NHAN.dvtv }); }).catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });
    nap('ht', { action: 'NS_KLGD_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP', func: 'pkg_klgv_v2_chung.LayDSHinhThucHoc' }, function (r) { return e(r.TENHINHTHUCHOC) + ' - ' + e(r.MAHINHTHUCHOC); });

    var giangVienId = '';                                     // GV vừa mở Khối lượng cá nhân (gốc main_doc.LopHocPhan.strGiangVien_Id)
    function thuThap(add) {
        add('strDaoTao_ThoiGianDaoTao_Id', L.vMulti(root.querySelector('.ums-formtrang [data-lhp="tg"]')));
        add('strKLGD_KeHoachChiTiet_Id', kh.v('ct')); add('strKLGD_TongHopKhoiLuong_Id', kh.v('th'));
        add('strDotHoc_Id', v('dot')); add('strDonViQuanLyHocPhan_Id', v('dv')); add('strDaoTao_HocPhan_Id', v('hp'));
        add('strDonViQuanLyGiangVien_Id', v('dvtv')); add('strGiangVien_Id2', v('tv')); add('strGiangVien_Id', giangVienId);
        L.daChon(bang).forEach(function (id) { add('strDangKy_LopHocPhan_Id', id); });
    }
    ums.report.mount(z('bc'), { collect: thuThap, import: false });

    /* ---------- Danh sách ---------- */
    var trang = { index: 1, size: 10 }, luot = 0, ds = [], phanLoai = [];
    var pSanSang = ums.api.dm('KLGD.PHANLOAIXACNHAN').then(function (rows) { phanLoai = arr(rows); }).catch(function () { phanLoai = []; });
    L.ganChonTatCa(bang);

    function quyMo(k) { var s = v(k); return s === '' ? -1 : Number(s); }
    function tai(p) {
        if (p) trang.index = p;
        var qm1 = v('qm1'), qm2 = v('qm2');
        if ((qm1 && isNaN(Number(qm1))) || (qm2 && isNaN(Number(qm2)))) { ui.toast('Quy mô lớp từ / đến phải là số', 'warn'); return; }
        var sh = ++luot;
        z('n').textContent = '';
        bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        pSanSang.then(function () {
            return ums.api.call({ action: 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNAPP', func: 'pkg_klgv_v2_kehoach.LayDSKLGD_DuLieu',
                strTKB_HinhThucHoc_Id: v('ht'), strTuKhoa: '', strDaoTao_HocPhan_Id: v('hp'), strKLGD_TongHopKhoiLuong_Id: kh.v('th'), strKLGD_KeHoachChiTiet_Id: kh.v('ct'),
                strDotHoc_Id: v('dot'), strLoaiXacNhan_Id: '', strHanhDongXacNhan_Id: '', strDonViQuanLyHocPhan_Id: v('dv'), strDonViQuanLyGiangVien_Id: v('dvtv'),
                strGiangVien_Id: v('tv'), dQuyMoBatDau: quyMo('qm1'), dQuyMoKetThuc: quyMo('qm2'), pageIndex: trang.index, pageSize: trang.size });
        }).then(function (r) {
            if (sh !== luot) return;
            ds = arr(r.data);
            ve(sh, Number(r.pager) || 0);
        }).catch(function (err) { if (sh !== luot) return; bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp học phần'); });
    }
    function lech(x) { return e(x.TONGSOTIETGIANG) !== e(x.TONGSOTIETGIANGXACNHAN) || e(x.TONGSOTIETGIANG) !== e(x.TONGSOTIETTKBMO); }
    function ve(sh, tong) {
        var gPL = ['Phân loại theo nhóm lớp'];
        var cot = [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
            { title: 'Tên học phần', render: function (x) { return '<a href="#" class="ums-link" data-apdat="' + esc(e(x.ID)) + '" title="Cập nhật số lượng áp đặt">' + esc(e(x.DAOTAO_HOCPHAN_TEN)) + '</a>'; } },
            { title: 'Lớp học phần', prop: 'DAOTAO_LOPHOCPHAN_TEN' },
            { title: 'Hình thức học', prop: 'HINHTHUCHOC_MA', cls: 'is-center is-nowrap' },
            { title: 'Giảng viên', render: function (x) {
                if (!e(x.GIANGVIEN_ID)) return '';
                var ids = e(x.GIANGVIEN_ID).split(','), tens = e(x.GIANGVIEN).split(',');
                return ids.map(function (id, i) {
                    return '<a href="#" class="ums-link ums-u-nowrap" data-klcn="' + esc(e(x.ID)) + '" data-gv="' + esc(id.trim()) + '" title="Khối lượng cá nhân">' + esc(e(tens[i]).trim()) + '</a>';
                }).join('<br>');
            } },
            { title: 'Phân bổ theo CTDT', prop: 'TTPHANBOTHEOCTDT', cls: 'is-center is-nowrap', sum: true },
            { title: 'Tổng số tiết TKB', prop: 'TONGSOTIETTKBMO', cls: 'is-center', sum: true },
            { title: 'Tổng tiết theo phân GV', prop: 'TONGSOTIETGIANG', cls: 'is-center', sum: true },
            { title: 'Tổng tiết xác nhận', prop: 'TONGSOTIETGIANGXACNHAN', cls: 'is-center', sum: true },
            { title: 'Năm học', prop: 'NAMHOC', cls: 'is-center is-nowrap' },
            { title: 'Học kỳ', prop: 'HOCKY', cls: 'is-center' },
            { title: 'Đợt', prop: 'DOTHOC', cls: 'is-center' },
            { title: 'Buổi bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Buổi kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
            { title: 'Khoa quản lý chuyên môn', prop: 'DAOTAO_KHOAQUANLY_TEN' },
            { title: 'Số lượng', prop: 'QUYMO', cls: 'is-center', sum: true },
            { title: 'Số giờ chuẩn', prop: 'TONGSOGIOCHUAN', cls: 'is-center', sum: true },
            { title: 'Khóa dữ liệu', cls: 'is-center', render: function (x) { return e(x.KHOADULIEU) === '1' ? ui.badge('Khóa', 'bad') : ''; } },
            { title: 'Duyệt buổi học', cls: 'is-center is-nowrap', render: function (x) { return ui.btn('confirm', { text: 'Duyệt buổi học', cls: 'ums-btn--sm', mod: 'out-primary', attr: { 'data-duyet': e(x.ID) } }); } },
            { title: 'Không tính theo TKB', cls: 'is-center', render: function (x) { return parseFloat(x.KHONGTINHTHEOTKB) > 0 ? 'Không tính theo TKB' : ''; } }];
        phanLoai.forEach(function (pl) {
            cot.push({ title: e(pl.TEN), group: gPL, cls: 'is-center is-nowrap', render: function (x) { return '<span data-pl="' + esc(e(x.ID)) + '|' + esc(e(pl.ID)) + '"></span>'; } });
        });
        cot.push(L.cotChon());
        ui.table({ el: bang, rows: ds, columns: cot, stt: true, empty: 'Không có dữ liệu',
            page: { index: trang.index, size: trang.size, total: tong || ds.length, onChange: function (p) { tai(p); }, onSize: function (s) { trang.size = s; tai(1); } } });
        z('n').textContent = '(' + (tong || ds.length) + ')';
        /* Dòng lệch tiết tô vàng như gốc (tô từng ô — nền ô của bảng đè nền dòng) */
        ds.forEach(function (x) {
            if (!lech(x)) return;
            var tr = bang.querySelector('tbody tr[data-id="' + e(x.ID) + '"]');
            if (tr) Array.prototype.forEach.call(tr.children, function (td) { td.style.background = 'var(--ums-warn-bg)'; });
        });
        if (!ds.length || !phanLoai.length) return;
        var viec = [], k = 0, dang = 0;
        ds.forEach(function (x) {
            x._PhanLoai = {};
            phanLoai.forEach(function (pl) {
                viec.push(function () {
                    return T.ttXacNhan(x.DULIEUXACNHAN, pl.ID).then(function (t) {
                        if (sh !== luot) return;
                        x._PhanLoai[pl.ID] = t;
                        var o = bang.querySelector('[data-pl="' + e(x.ID) + '|' + e(pl.ID) + '"]');
                        if (o) o.textContent = t;
                    });
                });
            });
        });
        function chay() { if (sh !== luot || k >= viec.length) return; dang++; viec[k++]().then(function () { dang--; chay(); }); }
        for (var n = 0; n < 6; n++) chay();
    }

    /* ---------- Thao tác ---------- */
    function dongDaChon() {
        var ids = L.daChon(bang);
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return null; }
        return ids;
    }
    function dong(id) { return ds.find(function (x) { return e(x.ID) === id; }); }
    function ctTen() { var o = kh.el('ct'); return kh.v('ct') && o && o.selectedIndex > 0 ? o.options[o.selectedIndex].text : ''; }

    /* Khóa dữ liệu / Không tính theo TKB: một ô chọn + nói rõ số dòng (gốc modal_KhoaDuLieu / modal_KhongTKB) */
    function hopMotO(o) {
        var ids = dongDaChon(); if (!ids) return;
        var dlg = ui.dialog({ title: o.title, icon: o.icon, size: 'sm',
            body: ui.field(o.nhan, '<select class="ums-select" data-no-s2 data-ho="chon">' + o.muc.map(function (m) { return '<option value="' + m[0] + '">' + esc(m[1]) + '</option>'; }).join('') + '</select>') +
                '<div class="ums-u-fz13 ums-u-muted ums-u-mt-2">Sẽ áp dụng cho <b>' + ids.length + '</b> dòng đã đánh dấu.</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) {
                var gt = api.body.querySelector('[data-ho="chon"]').value;
                ui.batch(ids.map(function (id) { return o.call(id, gt); }), { title: o.title + ' — ' + ids.length + ' dòng', okText: 'Thành công', show: true }).then(function () { tai(trang.index); });
            } }] });
        return dlg;
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a], [data-apdat], [data-klcn], [data-duyet]');
        if (!b || !root.contains(b) || b.closest('.ums-formtrang') || b.closest('dialog')) return;
        if (b.hasAttribute('data-apdat')) { ev.preventDefault(); L.apDat(b.getAttribute('data-apdat'), function () { tai(trang.index); }); return; }
        if (b.hasAttribute('data-klcn')) {
            ev.preventDefault();
            var x = dong(b.getAttribute('data-klcn')); if (!x) return;
            giangVienId = b.getAttribute('data-gv');
            L.khoiLuongCaNhan({ host: root, row: x, gvId: giangVienId, gvTen: b.textContent.trim(), collect: thuThap });
            return;
        }
        if (b.hasAttribute('data-duyet')) { var r = dong(b.getAttribute('data-duyet')); if (r) L.duyetBuoiHoc({ host: root, row: r }); return; }
        var a = b.getAttribute('data-a'), ids;
        if (a === 'search') { tai(1); return; }
        if (a === 'them') { L.khungThem({ host: root, ctId: kh.v('ct'), ctTen: ctTen(), sauLuu: function () { tai(trang.index); } }); return; }
        if (a === 'excel') { xuatExcel(b); return; }
        if (a === 'xoa') {
            ids = dongDaChon(); if (!ids) return;
            ui.confirm('Bạn có chắc chắn xóa ' + ids.length + ' dòng đã đánh dấu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                T.xoaNhieu(ids, function (id) { return { action: 'TKGG_KeHoach/Xoa_KLGD_DuLieu_LopHocPhan', method: 'POST', strIds: id }; }, 'Đang xóa ' + ids.length + ' dòng').then(function () { tai(trang.index); });
            });
            return;
        }
        if (a === 'xacnhan') {
            ids = dongDaChon(); if (!ids) return;
            T.xacNhan({ ids: ids.map(function (id) { var x = dong(id); return x ? e(x.DULIEUXACNHAN) : ''; }), ten: ids.length + ' lớp học phần', onXong: function () { tai(trang.index); } });
            return;
        }
        if (a === 'khoa') {
            hopMotO({ title: 'Khóa dữ liệu', icon: 'fa-lock', nhan: 'Hành động', muc: [['0', 'Mở khóa dữ liệu'], ['1', 'Khóa dữ liệu']],
                call: function (id, gt) { return { action: 'TKGG_KeHoach/Them_KLGD_DuLieu_Khoa', method: 'POST', strKLGD_DuLieu_Id: id, dKhoaDuLieu: gt }; } });
            return;
        }
        if (a === 'khongtkb') {
            hopMotO({ title: 'Xác định không tính theo TKB', icon: 'fa-calendar-xmark', nhan: 'Hành động', muc: [['1', 'Thêm (Không tính theo TKB)'], ['0', 'Xóa (Tính theo TKB)']],
                call: function (id, gt) {
                    var x = dong(id), ct = x ? e(x.KLGD_KEHOACHCHITIET_ID) : '';
                    return gt === '1' ? { action: 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgU0DSgkNB4KKS4vJhUKAwPP', func: 'PKG_KLGV_V2_THONGTIN.Them_KLGD_DuLieu_KhongTKB', strKLGD_DuLieu_Id: id, strKLGD_KeHoachChiTiet_Id: ct }
                        : { action: 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeBTQNKCQ0HgopLi8mFQoD', func: 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_DuLieu_KhongTKB', strKLGD_DuLieu_Id: id, strKLGD_KeHoachChiTiet_Id: ct };
                } });
            return;
        }
        if (a === 'tinhkl') {
            ids = dongDaChon(); if (!ids) return;
            ui.confirm('Bạn có chắc chắn thực hiện tính khối lượng cho ' + ids.length + ' dữ liệu không? Thao tác này không hoàn lại được.', { ok: 'Tính khối lượng' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) { return { action: 'NS_KLGD_TinhToan_MH/FSk0IgkoJC8VKC8pFS4gLwoNBgUeBTQNKCQ0', func: 'PKG_KLGV_V2_TINHTOAN.ThucHienTinhToanKLGD_DuLieu', strKLGD_DuLieu_Id: id }; }),
                    { title: 'Đang tính khối lượng ' + ids.length + ' dòng', okText: 'Thành công', show: true }).then(function () { tai(trang.index); });
            });
            return;
        }
        if (a === 'taodl') {
            if (!kh.v('ct')) { ui.toast('Chọn kế hoạch chi tiết trước khi tạo dữ liệu giảng', 'warn'); return; }
            var cach = f('cach'), cachTen = cach.options[cach.selectedIndex].text, hpTen = v('hp') ? ' — học phần đang chọn' : ' — MỌI học phần';
            ui.confirm('Thực hiện tạo dữ liệu chi tiết tính khối lượng (' + cachTen + ') cho toàn bộ lớp học phần của kế hoạch "' + ctTen() + '"' + hpTen + '? Thao tác này không hoàn lại được.', { ok: 'Thực hiện' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'TKGG_KeHoach/LayDSKLGD_DuLieu', method: 'GET', strTuKhoa: '', strDaoTao_HocPhan_Id: v('hp'), strKLGD_KeHoachChiTiet_Id: kh.v('ct'), pageIndex: 1, pageSize: 100000 }).then(function (r) {
                    var rows = arr(r.data);
                    if (!rows.length) { ui.toast('Không có lớp học phần nào trong phạm vi đã chọn', 'warn'); return; }
                    return ui.batch(rows.map(function (x) { return { action: 'TKGG_TinhToan/ThucHienTaoDuLieuGiang', method: 'POST', dCachXacDinhDuLieuGiang: cach.value, strKLGD_DuLieu_Id: e(x.ID) }; }),
                        { title: 'Đang tạo dữ liệu giảng ' + rows.length + ' lớp học phần', okText: 'Thành công', show: true }).then(function () { tai(trang.index); });
                }).catch(function (err) { ums.api.handle(err, 'danh sách dữ liệu lớp học phần'); });
            });
        }
    });
    ['qm1', 'qm2'].forEach(function (k) { f(k).addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } }); });

    /* ---------- Xuất Excel (gốc exportExcel_LopHocPhan, Ctrl+G) ---------- */
    var pXLSX = null;
    function napXLSX() {
        if (window.XLSX && window.XLSX.utils) return Promise.resolve(window.XLSX);
        if (!pXLSX) pXLSX = new Promise(function (ok, loi) {
            var s = document.createElement('script');
            s.src = 'assets/vendor/xlsx/xlsx.bundle.js';
            s.onload = function () { ok(window.XLSX); };
            s.onerror = function () { pXLSX = null; loi(new Error('Không tải được thư viện Excel (assets/vendor/xlsx)')); };
            document.head.appendChild(s);
        });
        return pXLSX;
    }
    function xuatExcel(nut) {
        if (!ds.length) { ui.toast('Không có dữ liệu để xuất. Vui lòng tìm kiếm trước.', 'warn'); return; }
        if (nut && nut.disabled) return;
        var cu = nut ? nut.innerHTML : '';
        if (nut) { nut.disabled = true; nut.innerHTML = '<i class="fa-light fa-spinner fa-spin"></i>'; }
        napXLSX().then(function (XLSX) {
            var dau = ['STT', 'Mã học phần', 'Tên học phần', 'Lớp học phần', 'Hình thức học', 'Giảng viên', 'Phân bổ theo CTDT', 'Tổng số tiết TKB', 'Tổng tiết theo phân GV',
                'Tổng tiết xác nhận', 'Năm học', 'Học kỳ', 'Đợt', 'Buổi bắt đầu', 'Buổi kết thúc', 'Khóa', 'Khoa quản lý chuyên môn', 'Số lượng', 'Số giờ chuẩn', 'Khóa dữ liệu', 'Không tính theo TKB'];
            var nS = dau.length, nPL = phanLoai.length, nCot = nS + nPL;
            var h1 = dau.concat(phanLoai.map(function () { return ''; })), h2 = dau.map(function () { return ''; }).concat(phanLoai.map(function (p) { return e(p.TEN); }));
            if (nPL) h1[nS] = 'Phân loại theo nhóm lớp';
            var thieu = 0;
            var rows = ds.map(function (x, i) {
                var r = [i + 1, e(x.DAOTAO_HOCPHAN_MA), e(x.DAOTAO_HOCPHAN_TEN), e(x.DAOTAO_LOPHOCPHAN_TEN), e(x.HINHTHUCHOC_MA), e(x.GIANGVIEN), e(x.TTPHANBOTHEOCTDT), e(x.TONGSOTIETTKBMO),
                    e(x.TONGSOTIETGIANG), e(x.TONGSOTIETGIANGXACNHAN), e(x.NAMHOC), e(x.HOCKY), e(x.DOTHOC), e(x.NGAYBATDAU), e(x.NGAYKETTHUC), e(x.DAOTAO_KHOADAOTAO_TEN), e(x.DAOTAO_KHOAQUANLY_TEN),
                    e(x.QUYMO), e(x.TONGSOGIOCHUAN), e(x.KHOADULIEU) === '1' ? 'Khóa' : '', parseFloat(x.KHONGTINHTHEOTKB) > 0 ? 'Không tính theo TKB' : ''];
                phanLoai.forEach(function (p) { var pl = x._PhanLoai || {}; if (!(p.ID in pl)) thieu++; r.push(e(pl[p.ID])); });
                return r;
            });
            if (thieu > 0 && !window.confirm('Có ' + thieu + ' ô "Phân loại theo nhóm lớp" chưa tải xong. Vẫn tiếp tục xuất Excel?')) return;
            var ws = XLSX.utils.aoa_to_sheet([h1, h2].concat(rows));
            ws['!cols'] = h1.map(function (t, c) {
                var m = (h2[c] || t || '').length;
                rows.forEach(function (r) { m = Math.max(m, String(r[c] == null ? '' : r[c]).length); });
                return { wch: Math.min(m + 2, 40) };
            });
            var merges = [];
            for (var c = 0; c < nS; c++) merges.push({ s: { r: 0, c: c }, e: { r: 1, c: c } });
            if (nPL > 1) merges.push({ s: { r: 0, c: nS }, e: { r: 0, c: nCot - 1 } }); else if (nPL === 1) merges.push({ s: { r: 0, c: nS }, e: { r: 1, c: nS } });
            ws['!merges'] = merges;
            var vien = function (mau) { return { top: { style: 'thin', color: { rgb: mau } }, bottom: { style: 'thin', color: { rgb: mau } }, left: { style: 'thin', color: { rgb: mau } }, right: { style: 'thin', color: { rgb: mau } } }; };
            var kieuDau = { font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 }, fill: { patternType: 'solid', fgColor: { rgb: '1F4E78' } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: vien('999999') };
            for (var hr = 0; hr <= 1; hr++) for (var hc = 0; hc < nCot; hc++) { var ad = XLSX.utils.encode_cell({ r: hr, c: hc }); if (!ws[ad]) ws[ad] = { v: '', t: 's' }; ws[ad].s = kieuDau; }
            ws['!freeze'] = { xSplit: 0, ySplit: 2 }; ws['!views'] = [{ state: 'frozen', ySplit: 2 }]; ws['!rows'] = [{ hpt: 22 }, { hpt: 42 }];
            ds.forEach(function (x, i) {
                var canh = lech(x);
                for (var cc = 0; cc < nCot; cc++) {
                    var a2 = XLSX.utils.encode_cell({ r: i + 2, c: cc }); if (!ws[a2]) ws[a2] = { v: '', t: 's' };
                    var st = { border: vien('CCCCCC'), alignment: { vertical: 'center', wrapText: true } };
                    if (canh) st.fill = { patternType: 'solid', fgColor: { rgb: 'FFFF00' } };
                    ws[a2].s = st;
                }
            });
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Lớp học phần');
            var d = new Date(), p2 = function (n) { return n < 10 ? '0' + n : n; };
            XLSX.writeFile(wb, 'LopHocPhan_' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '_' + p2(d.getHours()) + p2(d.getMinutes()) + '.xlsx');
        }).catch(function (err) { ums.api.handle(err, 'xuất Excel'); })
          .then(function () { if (nut) { nut.disabled = false; nut.innerHTML = cu; } });
    }
    function phimTat(ev) {
        if (!document.contains(root)) { document.removeEventListener('keydown', phimTat); return; }
        if (/^(input|textarea|select)$/i.test((ev.target && ev.target.tagName) || '')) return;
        if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'g' || ev.key === 'G')) { ev.preventDefault(); xuatExcel(root.querySelector('[data-a="excel"]')); }
    }
    document.addEventListener('keydown', phimTat);

    tai(1);
})();
