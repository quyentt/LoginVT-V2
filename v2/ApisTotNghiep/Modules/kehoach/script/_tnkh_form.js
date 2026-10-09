/* =========================================================================
   Kế hoạch xét tốt nghiệp — vùng "Thêm mới / Chỉnh sửa kế hoạch" (#zoneEdit của gốc)
   Bản gốc: ApisTotNghiep/Modules/kehoach/script/kehoach.js
       rewrite · viewEdit_KeHoachXuLy · save_KeHoachXuLy · getList_QuyTacSinhSoHieu / SoVaoSo
       getList_HocPhan · genTable_HocPhan · save_HocPhan · delete_HocPhan · getList_DMHocPhan (#myModalHocPhan)
       getList_ThanhVien · save_ThanhVien · delete_ThanhVien · genHTML_NhanSu
       getList_SinhVien · genTable_SinhVien · save_PhamVi · save_SinhVien · delete_SinhVien · addHTMLinto_SinhVien
       genModal_SinhVienDKH (+ getList_ThoiGianDaoTaoDKH / HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao / LopQuanLy)
       genModal_SinhVienKeHoach (+ getList_KeHoachMD · getList_SinhVienMDKeHoach)
   Khác hẳn bản Học bổng (khối Học phần, quy tắc sinh số, hai nguồn thêm sinh viên, procedure TN_*) nên KHÔNG dùng
   _kh_form.js của Học bổng — khung riêng ums.tnKh.taoForm.
   ---------------------------------------------------------------------------
   ums.tnKh.taoForm(zone, { onClose, onSaved, hocKyLoc(), phanLoaiLoc() }) → { moThem(), moSua(dòng) }

   Lời gọi (chép nguyên):
     TN_ThongTin_MH/FSkkLB4VDx4KJAkuICIp  pkg_totnghiep_thongtin.Them_TN_KeHoach   (strId '')
     TN_ThongTin_MH/EjQgHhUPHgokCS4gIikP  pkg_totnghiep_thongtin.Sua_TN_KeHoach    (strId = ID, thêm
         strTN_QuyTacSinhSoHieu_Ad_Id · strTN_QuyTacSinhSoVSo_Ad_Id)
         strTen · strMa · strNgayBatDau · strNgayKetThuc · dMoChoNguoiHocDangKy (ô Mô hình 1/0) · strMoTa ''
         · strDaoTao_ThoiGianDaoTao_Id · strQLSV_TrangThai_Id '' (gốc đọc ô ckbDSTrangThaiSV — không có trên màn)
         · dCoTinhLaiDiemTKHP = 1 khi đánh dấu, không gửi khi bỏ (undefined như gốc) · dKetQuaChinhThuc ''
         (gốc đọc dropKetQua — không có) · strPhanLoai_Id
     Quy tắc sinh số (chỉ hiện khi Sửa, như gốc):
       TN_VanBang_ChungChi_Chung_MH/… PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoHieu_Ad / LayDSTN_QuyTacSinh_SoVaoSo_Ad
     Học phần:
       TN_KeHoach_HocPhan/LayDSTN_KeHoach_HocPhan GET (type=GET) strTuKhoa '' · strTN_KeHoach_Id · pageIndex · pageSize
           Cột: DAOTAO_HOCPHAN_MA · DAOTAO_HOCPHAN_TEN
       TN_KeHoach_HocPhan/Them_TN_KeHoach_HocPhan POST (type=POST) strDaoTao_HocPhan_Id · strTN_KeHoach_Id — lưu CÙNG lúc
           Lưu kế hoạch cho các học phần mới chọn (như gốc: dòng .addHocPhan)
       TN_KeHoach_HocPhan/Xoa_TN_KeHoach_HocPhan POST (type=POST) strIds — mỗi dòng đã lưu một lời gọi
       Hộp "Danh sách học phần": KHCT_HocPhan/LayDanhSach GET (type=GET) strTuKhoa (ô tìm — gốc là ô lọc máy chủ của
           bảng) · strDaoTao_MonHoc_Id '' · strThuocBoMon_Id '' · strThuocTinhHocPhan_Id '' · pageIndex · pageSize; cột MA · TEN
     Cán bộ phân công xét (lưu CÙNG lúc Lưu kế hoạch, như gốc):
       TN_KeHoach_NhanSu/LayDanhSach GET  strTuKhoa '' (gốc đọc txtSearch_TuKhoa — không có) · strTN_KeHoach_Id
           · strDaoTao_ThoiGianDaoTao_Id = ô Học kỳ của THANH LỌC · strNhanSu_HoSoCanBo_Id '' · strNguoiTao_Id ''
           · pageIndex 1 · pageSize 100000. Cột NGUOIDUNG_TAIKHOAN · NGUOIDUNG_TENDAYDU; dòng nhớ NGUOIDUNG_ID.
       TN_KeHoach_NhanSu/ThemMoi (dòng mới, strId '') · TN_KeHoach_NhanSu/CapNhat (dòng đã lưu, strId = ID dòng)
           strTN_KeHoach_Id · strNguoiDung_Id — gốc gửi CapNhat lại MỌI dòng đã lưu mỗi lần Lưu; giữ.
       TN_KeHoach_NhanSu/Xoa  strChucNang_Id · strIds = ID dòng (dòng chưa lưu chỉ bỏ khỏi bảng)
     Danh sách học sinh - sinh viên xét duyệt:
       TN_KeHoach_PhamVi/LayDanhSach GET  strTuKhoa (ô tìm — gốc là ô lọc máy chủ của bảng) · strNguoiDung_Id ''
           · strTN_KeHoach_Id · strNguoiTao_Id '' · pageIndex · pageSize (phân trang máy chủ)
           Cột: ANH · QLSV_NGUOIHOC_MASO · QLSV_NGUOIHOC_HOTEN · DAOTAO_LOPQUANLY_TEN · DAOTAO_CHUONGTRINH_TEN · DAOTAO_KHOADAOTAO_TEN
       "Thêm thành viên" (edu.extend.genModal_SinhVien — lưu NGAY): TN_ThongTin/Them_TN_KeHoach_PhamVi_ToanBo POST (type=POST)
           strTN_KeHoach_Id · strQLSV_TrangThai_Id = trạng thái đánh dấu trong hộp · strPhamViApDung_Id = QLSV_NGUOIHOC_ID +
           DAOTAO_TOCHUCCHUONGTRINH_ID (ghép liền) khi chọn sinh viên; = ID hệ / khoá / chương trình / lớp khi "Thêm từng …".
           Hộp: ums.pat.pickSinhVien bản đầy đủ, nguồn như Corei — SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc;
           "Thêm từng hệ" màn chèn thêm (như Học bổng / XLHV). "Thêm Khoa quản lý - khóa học" (btnAdd_KhoaKhoa): hộp chung
           KHÔNG có ô Khoa quản lý → chưa làm được (nợ tầng chung, như Học bổng).
       "Thêm từ đăng ký học" / "Thêm từ kế hoạch tốt nghiệp khác" (addHTMLinto_SinhVien — dòng CHƯA LƯU, lưu khi bấm Lưu kế hoạch):
           TN_KeHoach_PhamVi/ThemMoi  strId '' · strTN_KeHoach_Id · strQLSV_NguoiHoc_Id · strDaoTao_ChuongTrinh_Id =
           DAOTAO_TOCHUCCHUONGTRINH_ID · strDaoTao_LopQuanLy_Id · strDaoTao_KhoaDaoTao_Id (đọc từ dòng của hộp)
           Hộp đăng ký học: DKH_Chung/LayThoiGianDangKyHoc → LayHeDaoTaoTheoDangKy (strDaoTao_ThoiGianDaoTao_Id) →
               LayKhoaHocTheoDangKy (+ strDaoTao_HeDaoTao_Id) → LayChuongTrinhTheoDangKy / LayLopQuanLyTheoDangKy (+ Khoá, CT),
               mọi tầng chọn nhiều, strTN_KeHoach_Id '' (gốc đọc dropAAAA); danh sách DKH_Chung/LayDanhSachHoSoTheoDangKy GET
               strTuKhoa · strTN_KeHoach_Id = kế hoạch đang sửa · strHeDaoTao_Id · strKhoaDaoTao_Id · strChuongTrinh_Id
               · strLopQuanLy_Id · pageIndex · pageSize (phân trang máy chủ). Cột tên TENHEDAOTAO / TENKHOA / TENCHUONGTRINH / TEN.
           Hộp kế hoạch khác: danh mục TN.PHANLOAI → TN_ThongTin/LayDSTN_KeHoach GET (strPhanLoai_Id, pageSize 100000)
               → TN_KeHoach_PhamVi/LayDanhSach GET (strTN_KeHoach_Id = kế hoạch chọn, pageSize 100000).
       TN_KeHoach_PhamVi/Xoa  strIds = ID dòng (dòng chưa lưu chỉ bỏ khỏi bảng)

   Cố ý bỏ (mã chết của gốc): save_Lop / save_ChuongTrinh / save_Khoa + arrLop/arrKhoa/arrChuongTrinh (nút gán mảng đã bị
   chú thích → mảng luôn rỗng); getList_DoiTuong (biến strTN_KeHoach_Id không khai báo); getList_NamNhapHoc / KhoaQuanLy
   / genList_TrangThaiSV (đổ vào ô không có trên màn); khối #ApDungChoKhoa… (luôn trống); arrValid (ô txtKeHoachXuLy_So
   không tồn tại → không kiểm gì).

   Lỗi gốc đã sửa (theo ý định):
     · Khối sinh viên ẨN khi đang thêm mới (gốc hiện nhưng "Thêm thành viên" gửi ID kế hoạch rỗng). Lưu xong kế hoạch mới
       thì nhớ ID máy chủ trả NGAY (gốc chờ setTimeout 2 giây → bấm Lưu lần nữa trong lúc đó là THÊM TRÙNG), đổi tiêu đề
       sang "Chỉnh sửa", hiện khối sinh viên và quy tắc sinh số.
     · Xoá học phần: dòng mới chọn (chưa lưu) chỉ bỏ khỏi bảng — gốc gửi luôn ID HỌC PHẦN làm strIds của Xoa_TN_KeHoach_HocPhan.
       Học phần / cán bộ đã có trong bảng thì báo "đã tồn tại" (gốc so ID học phần với ID dòng nên không bắt được dòng đã lưu).
     · Bảng học phần của biểu mẫu phân trang được (gốc gắn trang vào main_doc.KeHoach — không tồn tại → bấm trang lỗi JS).
     · Hộp đăng ký học: Enter ở ô từ khoá gọi hàm không tồn tại (getList_SinhVienMD) và từ khoá không được gửi
       (strTuKhoa đọc txtAAAA) → nay Enter / Tìm kiếm gửi từ khoá vào strTuKhoa.
       Hộp kế hoạch khác: Enter gọi hàm không tồn tại → ô từ khoá lọc ngay trên bảng (danh sách đã tải đủ).
     · Ô cha → con (luật 6): Học kỳ → Hệ → Khoá → Chương trình, Khoá → Lớp (hộp đăng ký học); Loại kế hoạch → Kế hoạch
       (hộp kế hoạch khác — gốc nạp sẵn mọi kế hoạch, nay khoá tới khi chọn Loại).
   Khác gốc: Tên kế hoạch bắt buộc, Đến ngày không trước Từ ngày (gốc không kiểm gì); "Lưu" trong hộp học phần đóng hộp
   (gốc để mở); lời gọi hàng loạt qua ums.ui.batch, xong nạp lại MỘT lần.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var K = ums.khxl, e = K.e;
    var T = ums.tnKh = ums.tnKh || {};
    T.K = K;
    T.e = e;
    T.uid = function () { return (ums.session && ums.session.userId) || ''; };
    T.iM = function () { return (ums.session && ums.session.iM) || ''; };
    T.esc1 = function (s) { return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"'); };

    /* TN_Chung/LayDSPhanLoaiTheoNguoiDung (POST, kèm iM như gốc) — ô "Chọn phân loại" */
    T.napPhanLoai = function (els) {
        return ums.api.call({ action: 'TN_Chung/LayDSPhanLoaiTheoNguoiDung', method: 'POST', type: 'POST', iM: T.iM(), strNguoiThucHien_Id: '' })
            .then(function (r) {
                var ds = K.ds(r);
                els.forEach(function (el) { pat.fill(el, ds, { name: 'TEN', head: 'Chọn phân loại' }); });
                return ds;
            }).catch(function (err) { ums.api.handle(err, 'phân loại'); });
    };
    /* TN_ThongTin/LayDSTN_KeHoach GET */
    T.dsKeHoach = function (p) {
        var c = { action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET' };
        Object.keys(p || {}).forEach(function (k) { c[k] = p[k]; });
        return ums.api.call(c);
    };
    T.hoTen = function (r) { return (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim(); };

    T.taoForm = function (zone, o) {
        o = o || {};
        var khId = '', hp = [], hpMoi = [], hpPage = 1, hpSize = 10, hpTotal = 0;
        var ns = [], tam = 0, svMoi = [], svRows = [], svPage = 1, svSize = 10, svTotal = 0;

        function inp(k, date) {
            return '<input class="ums-input" data-k="' + k + '" data-scope="form" autocomplete="off"' + (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + '>';
        }
        function sel(k, ph, opts) {
            return '<select class="ums-select" data-k="' + k + '" data-scope="form" data-ph="' + esc(ph) + '">' + (opts || '<option value="">' + esc(ph) + '</option>') + '</select>';
        }

        zone.innerHTML =
            pat.panel({
                title: 'Thêm mới - Kế hoạch', icon: 'fa-plus',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
                body: '<div class="ums-legend">Thông tin kế hoạch</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                        ui.field('Mã kế hoạch', inp('ma')) +
                        ui.field('Tên kế hoạch', inp('ten'), { required: true }) +
                        ui.field('Học kỳ', sel('tg', 'Chọn học kỳ')) +
                        ui.field('Phân loại xét', sel('pl', 'Chọn phân loại')) +
                        ui.field('Từ ngày', inp('tu', true)) +
                        ui.field('Đến ngày', inp('den', true)) +
                        ui.field('Mô hình', sel('hl', 'Mô hình', '<option value="1">Cho sinh viên đăng ký</option><option value="0">Không cho sinh viên đăng ký</option>')) +
                        ui.field('Tính lại điểm', '<label class="ums-check"><input type="checkbox" data-k="tkhp"> Cho phép tính lại điểm TKHP khi xét</label>') +
                        '<div data-qt hidden>' + ui.field('Quy tắc sinh số hiệu', sel('qtsh', '--Chọn quy tắc sinh số hiệu--')) + '</div>' +
                        '<div data-qt hidden>' + ui.field('Quy tắc sinh số vào sổ', sel('qtvs', '--Chọn quy tắc sinh số vào sổ--')) + '</div>' +
                    '</div>'
            }) +
            pat.panel({
                title: 'Học phần', icon: 'fa-book', count: 'hpn', flush: true, zone: 'hp',
                tools: ui.xoaChon('input[data-tnhp]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'hp-xoa' } }) +
                    ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'hp-them' } })
            }) +
            pat.panel({
                title: 'Cán bộ phân công xét', icon: 'fa-user-tie', count: 'nsn', flush: true, zone: 'ns',
                tools: ui.btn('add', { text: 'Thêm cán bộ', mod: 'out-success', attr: { 'data-a': 'ns-them' } })
            }) +
            '<div data-z="con" hidden>' +
                pat.panel({
                    title: 'Danh sách học sinh - sinh viên xét duyệt', icon: 'fa-users', count: 'svn',
                    tools: ui.xoaChon('input[data-tnsv]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'sv-xoa' } }) +
                        ui.btn('add', { text: 'Thêm từ kế hoạch tốt nghiệp khác', mod: 'out-danger', attr: { 'data-a': 'sv-kh' } }) +
                        ui.btn('add', { text: 'Thêm từ đăng ký học', mod: 'out-success', attr: { 'data-a': 'sv-dkh' } }) +
                        ui.btn('add', { text: 'Thêm thành viên', mod: 'out-primary', attr: { 'data-a': 'sv-them' } }),
                    body: '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="svq" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
                        '<div class="ums-u-mt-3 tnkh-bang" data-z="sv"></div>'
                }) +
            '</div>';

        function k(x) { return zone.querySelector('[data-k="' + x + '"]'); }
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        ui.enhance(zone);
        K.ganChon(zone);

        var dsHocKy = ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (ds) { pat.fill(k('tg'), ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' }); return ds; })
            .catch(function (err) { ums.api.handle(err, 'học kỳ'); });
        T.napPhanLoai([k('pl')]);
        [['qtsh', 'TN_VanBang_ChungChi_Chung_MH/DSA4BRIVDx4QNDgVICISKC8pHhIuCSgkNB4AJQPP', 'PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoHieu_Ad', '--Chọn quy tắc sinh số hiệu--'],
         ['qtvs', 'TN_VanBang_ChungChi_Chung_MH/DSA4BRIVDx4QNDgVICISKC8pHhIuFyAuEi4eACUP', 'PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoVaoSo_Ad', '--Chọn quy tắc sinh số vào sổ--']
        ].forEach(function (x) {
            ums.api.call({ action: x[1], func: x[2], method: 'POST', strNguoiThucHien_Id: '' })
                .then(function (r) { pat.fill(k(x[0]), K.ds(r), { name: 'TEN', head: x[3] }); })
                .catch(function (err) { ums.api.handle(err, 'quy tắc sinh số'); });
        });

        function datGiaTri(el, v) {
            el.value = v === undefined || v === null ? '' : String(v);
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
            if (el._flatpickr) { if (el.value) el._flatpickr.setDate(el.value, false, 'd/m/Y'); else el._flatpickr.clear(); }
        }
        function trangThai(sua) {
            zone.querySelector('.ums-panel__title').innerHTML = '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' +
                (sua ? 'Chỉnh sửa' : 'Thêm mới') + ' - Kế hoạch';
            z('con').hidden = !sua;
            K.qa(zone, '[data-qt]').forEach(function (x) { x.hidden = !sua; });
        }
        function nutXoaDong(a, id) {
            return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="' + a + '" data-id="' + esc(id) + '" title="Bỏ dòng chưa lưu"><i class="fa-light fa-trash-can"></i></button>';
        }

        /* ---------- Học phần ------------------------------------------------- */
        function veHP() {
            z('hpn').textContent = '(' + (hpTotal + hpMoi.length) + ')';
            var rows = hpMoi.concat(hp);
            ui.table({
                el: z('hp'), rows: rows, empty: 'Chưa có học phần',
                page: hpTotal > hpSize ? { index: hpPage, size: hpSize, total: hpTotal,
                    onChange: function (n) { if (n >= 1 && n <= Math.ceil(hpTotal / hpSize)) taiHP(n); },
                    onSize: function (v) { hpSize = v === 'all' ? ui.PAGE_ALL : Number(v); taiHP(1); } } : null,
                columns: [
                    { title: 'Mã học phần', cls: 'is-nowrap', render: function (r) {
                        return esc(e(r.DAOTAO_HOCPHAN_MA)) + (r._moi ? ' ' + ui.badge('Chưa lưu', 'warn') : '');
                    } },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { head: '<input type="checkbox" data-all="tnhp" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (r) {
                        return '<input type="checkbox" data-tnhp="' + esc(r.ID) + '">';
                    } }
                ]
            });
        }
        function taiHP(p) {
            if (p) hpPage = p;
            if (!khId) { hp = []; hpTotal = 0; veHP(); return; }
            K.dang(z('hp'));
            ums.api.call({ action: 'TN_KeHoach_HocPhan/LayDSTN_KeHoach_HocPhan', method: 'GET', type: 'GET',
                strTuKhoa: '', strTN_KeHoach_Id: khId, pageIndex: hpPage, pageSize: hpSize })
                .then(function (r) { hp = K.ds(r); hpTotal = Number(r.pager) || hp.length; veHP(); })
                .catch(function (err) { K.loi(z('hp'), err, 'học phần của kế hoạch'); });
        }
        function themHP() {
            var page = 1, size = 10, total = 0, rows = [], hen = null;
            var dlg = ui.dialog({
                title: 'Danh sách học phần', icon: 'fa-book', size: 'lg',
                body: '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
                    '<div class="ums-u-mt-3" data-z="t"></div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                    var ids = K.daChon(host, 'tnhpc');
                    if (!ids.length) { ui.toast('Vui lòng chọn học phần', 'warn'); return false; }
                    var them = 0, trung = 0;
                    ids.forEach(function (id) {
                        var r = K.tim(rows, id);
                        if (!r) return;
                        var co = hpMoi.concat(hp).some(function (x) { return String(x.DAOTAO_HOCPHAN_ID) === String(r.ID); });
                        if (co) { trung++; return; }
                        hpMoi.push({ ID: 'moi' + (++tam), _moi: true, DAOTAO_HOCPHAN_ID: r.ID, DAOTAO_HOCPHAN_MA: r.MA, DAOTAO_HOCPHAN_TEN: r.TEN });
                        them++;
                    });
                    veHP();
                    ui.toast('Đã thêm ' + them + ' học phần — bấm Lưu kế hoạch để ghi.' + (trung ? ' ' + trung + ' học phần đã tồn tại.' : ''), them ? 'ok' : 'warn');
                } }]
            });
            var host = dlg.body.querySelector('[data-z="t"]'), q = dlg.body.querySelector('[data-f="q"]');
            K.ganChon(dlg.body);
            function tai(p) {
                if (p) page = p;
                K.dang(host);
                ums.api.call({ action: 'KHCT_HocPhan/LayDanhSach', method: 'GET', type: 'GET',
                    strTuKhoa: (q.value || '').trim(), strDaoTao_MonHoc_Id: '', strThuocBoMon_Id: '', strThuocTinhHocPhan_Id: '',
                    strNguoiThucHien_Id: '', pageIndex: page, pageSize: size })
                    .then(function (r) {
                        rows = K.ds(r); total = Number(r.pager) || rows.length;
                        ui.table({ el: host, rows: rows, empty: 'Không có học phần',
                            page: { index: page, size: size, total: total,
                                onChange: function (n) { if (n >= 1 && n <= Math.ceil(total / size)) tai(n); },
                                onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); tai(1); } },
                            columns: [{ title: 'Mã học phần', prop: 'MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'TEN' }, K.cotChon('tnhpc')] });
                    }).catch(function (err) { K.loi(host, err, 'danh sách học phần'); });
            }
            q.addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { tai(1); }, 400); });
            q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(hen); tai(1); } });
            tai(1);
        }
        function xoaHP() {
            var ids = K.daChon(z('hp'), 'tnhp');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            var moi = ids.filter(function (id) { return K.tim(hpMoi, id); });
            var cu = ids.filter(function (id) { return !K.tim(hpMoi, id); });
            if (moi.length) hpMoi = hpMoi.filter(function (x) { return moi.indexOf(String(x.ID)) < 0; });
            if (!cu.length) { veHP(); return; }
            K.xoa(cu.map(function (id) {
                return { action: 'TN_KeHoach_HocPhan/Xoa_TN_KeHoach_HocPhan', method: 'POST', type: 'POST', strIds: id, strNguoiThucHien_Id: '' };
            }), function () { taiHP(); });
        }
        function luuHP(id) {
            var ds = hpMoi.slice();
            if (!ds.length) return Promise.resolve();
            return ui.batch(ds.map(function (r) {
                return { action: 'TN_KeHoach_HocPhan/Them_TN_KeHoach_HocPhan', method: 'POST', type: 'POST',
                    strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID, strTN_KeHoach_Id: id, strNguoiThucHien_Id: '' };
            }), { title: 'Đang lưu học phần', okText: 'Lưu học phần' }).then(function () { hpMoi = []; });
        }

        /* ---------- Cán bộ phân công xét ------------------------------------ */
        function veNS() {
            z('nsn').textContent = '(' + ns.length + ')';
            ui.table({
                el: z('ns'), rows: ns, stt: true, empty: 'Chưa phân công cán bộ',
                columns: [
                    { title: 'Mã số', cls: 'is-nowrap', render: function (r) {
                        return esc(e(r.NGUOIDUNG_TAIKHOAN)) + (r._moi ? ' ' + ui.badge('Chưa lưu', 'warn') : '');
                    } },
                    { title: 'Họ tên', prop: 'NGUOIDUNG_TENDAYDU' },
                    { title: 'Xóa', cls: 'is-center is-actions', width: '60px', render: function (r) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="ns-xoa" data-id="' + esc(r.ID) + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                    } }
                ]
            });
        }
        function taiNS() {
            if (!khId) { ns = []; veNS(); return Promise.resolve(); }
            K.dang(z('ns'));
            return ums.api.call({
                action: 'TN_KeHoach_NhanSu/LayDanhSach', method: 'GET',
                strTuKhoa: '', strTN_KeHoach_Id: khId,
                strDaoTao_ThoiGianDaoTao_Id: o.hocKyLoc ? o.hocKyLoc() : '',
                strNhanSu_HoSoCanBo_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) { ns = K.ds(r); veNS(); })
              .catch(function (err) { K.loi(z('ns'), err, 'cán bộ phân công'); });
        }
        function themNS() {
            pat.pickNhanSu({
                title: 'Tìm kiếm nhân sự',
                onPick: function (list) {
                    var trung = 0;
                    list.forEach(function (x) {
                        if (ns.some(function (r) { return String(r.NGUOIDUNG_ID) === String(x.ID); })) { trung++; return; }
                        ns.push({ ID: 'moi' + (++tam), _moi: true, NGUOIDUNG_ID: x.ID, NGUOIDUNG_TAIKHOAN: x.MASO, NGUOIDUNG_TENDAYDU: e(x.HOTEN) });
                    });
                    if (trung) ui.toast(trung + ' cán bộ đã tồn tại!', 'warn');
                    veNS();
                }
            });
        }
        function xoaNS(id) {
            var r = K.tim(ns, id);
            if (!r) return;
            if (r._moi) { ns = ns.filter(function (x) { return x !== r; }); veNS(); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá cán bộ phân công' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'TN_KeHoach_NhanSu/Xoa', strChucNang_Id: '', strIds: id, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Xóa thành công!', 'ok'); taiNS(); })
                    .catch(function (err) { ums.api.handle(err, 'xoá cán bộ phân công'); });
            });
        }
        function luuNS(id) {
            if (!ns.length) return Promise.resolve();
            return ui.batch(ns.map(function (r) {
                return { action: r._moi ? 'TN_KeHoach_NhanSu/ThemMoi' : 'TN_KeHoach_NhanSu/CapNhat',
                    strId: r._moi ? '' : r.ID, strChucNang_Id: '', strTN_KeHoach_Id: id, strNguoiDung_Id: r.NGUOIDUNG_ID, strNguoiThucHien_Id: '' };
            }), { title: 'Đang lưu cán bộ phân công', okText: 'Lưu cán bộ phân công' });
        }

        /* ---------- Danh sách học sinh - sinh viên xét duyệt ---------------- */
        function veSV() {
            z('svn').textContent = '(' + (svTotal + svMoi.length) + ')';
            ui.table({
                el: z('sv'), rows: svMoi.concat(svRows), empty: 'Chưa có sinh viên xét duyệt',
                page: { index: svPage, size: svSize, total: svTotal,
                    onChange: function (n) { if (n >= 1 && n <= Math.ceil(svTotal / svSize)) taiSV(n); },
                    onSize: function (v) { svSize = v === 'all' ? ui.PAGE_ALL : Number(v); taiSV(1); } },
                columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '72px', render: function (x) { return pat.anhNguoi(x.ANH); } },
                    { title: 'Mã số', cls: 'is-nowrap', render: function (x) {
                        return esc(e(x.QLSV_NGUOIHOC_MASO)) + (x._moi ? ' ' + ui.badge('Chưa lưu', 'warn') : '');
                    } },
                    { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { head: '<input type="checkbox" data-all="tnsv" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x) {
                        return x._moi ? nutXoaDong('sv-bo', x.ID) : '<input type="checkbox" data-tnsv="' + esc(x.ID) + '">';
                    } }
                ]
            });
        }
        function taiSV(p) {
            if (p) svPage = p;
            if (!khId) return;
            K.dang(z('sv'));
            ums.api.call({
                action: 'TN_KeHoach_PhamVi/LayDanhSach', method: 'GET',
                strTuKhoa: (zone.querySelector('[data-f="svq"]').value || '').trim(), strNguoiDung_Id: '',
                strTN_KeHoach_Id: khId, strNguoiTao_Id: '', pageIndex: svPage, pageSize: svSize
            }).then(function (r) {
                svRows = K.ds(r);
                svTotal = Number(r.pager) || svRows.length;
                veSV();
            }).catch(function (err) { K.loi(z('sv'), err, 'danh sách sinh viên xét duyệt'); });
        }
        function goiPhamVi(phamVi, trangThai) {
            return { action: 'TN_ThongTin/Them_TN_KeHoach_PhamVi_ToanBo', method: 'POST', type: 'POST',
                strChucNang_Id: '', strTN_KeHoach_Id: khId, strQLSV_TrangThai_Id: trangThai,
                strPhamViApDung_Id: phamVi, strNguoiThucHien_Id: '' };
        }
        function chayPhamVi(calls) {
            ui.batch(calls, { title: 'Đang thêm', okText: 'Thêm thành công!', show: true }).then(function () { taiSV(1); });
        }
        function themSV() {
            var tt = null;
            function st() { return tt ? tt.ids().join(',') : ''; }
            function nhom(ten) {
                return function (ids, params, dlg) {
                    var arr = ids ? String(ids).split(',') : [];
                    if (!arr.length) { ui.toast('Chưa chọn ' + ten + ' nào.', 'warn'); return; }
                    var s = st();
                    dlg.close();
                    chayPhamVi(arr.map(function (id) { return goiPhamVi(id, s); }));
                };
            }
            var dlg = pat.pickSinhVien({
                filters: true, okText: 'Chọn',
                status: function (el) { tt = pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3, what: 'trạng thái sinh viên' }); return tt; },
                call: function (p, page, size) {
                    return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                        strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: '',
                        strDaoTao_HeDaoTao_Id: p.strHeDaoTao_Id, strDaoTao_KhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                        strDaoTao_ChuongTrinh_Id: p.strChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: p.strLopQuanLy_Id,
                        strStudyStatus_Ids: p.strTrangThaiNguoiHoc_Id, dIsPrimary: '', dBoQuaPhamVi: '', pageIndex: page, pageSize: size };
                },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (r) { return esc(T.hoTen(r)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
                ],
                group: { khoa: nhom('khóa'), chuongTrinh: nhom('chương trình'), lop: nhom('lớp') },
                onPick: function (rows) {
                    var s = st();
                    chayPhamVi(rows.map(function (r) { return goiPhamVi(e(r.QLSV_NGUOIHOC_ID) + e(r.DAOTAO_TOCHUCCHUONGTRINH_ID), s); }));
                }
            });
            /* "Thêm từng hệ" (btnAdd_He) — hộp chung chưa có, chèn vào đầu hàng "Thêm nhiều" */
            var g = dlg.body.querySelector('[data-g]');
            if (g) {
                g.insertAdjacentHTML('beforebegin', '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-xg="he">' +
                    '<i class="fa-light fa-plus"></i><span>Thêm từng hệ</span></button>');
                dlg.body.addEventListener('click', function (ev) {
                    if (!ev.target.closest('[data-xg="he"]')) return;
                    nhom('hệ')(pat.val(dlg.body.querySelector('[data-f="he"]')), null, dlg);
                });
            }
        }
        /* addHTMLinto_SinhVien: thêm dòng CHƯA LƯU (lưu khi bấm Lưu kế hoạch) */
        function nhanSV(list) {
            var them = 0, trung = 0;
            list.forEach(function (r) {
                var khoa = e(r.QLSV_NGUOIHOC_ID) + '|' + e(r.DAOTAO_TOCHUCCHUONGTRINH_ID);
                var co = svMoi.some(function (x) { return x._khoa === khoa; }) ||
                    svRows.some(function (x) { return String(e(x.QLSV_NGUOIHOC_ID)) === String(e(r.QLSV_NGUOIHOC_ID)); });
                if (co) { trung++; return; }
                svMoi.push({ ID: 'moi' + (++tam), _moi: true, _khoa: khoa, ANH: r.QLSV_NGUOIHOC_ANH,
                    QLSV_NGUOIHOC_ID: r.QLSV_NGUOIHOC_ID, QLSV_NGUOIHOC_MASO: r.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HOTEN: T.hoTen(r),
                    DAOTAO_LOPQUANLY_ID: r.DAOTAO_LOPQUANLY_ID, DAOTAO_LOPQUANLY_TEN: r.DAOTAO_LOPQUANLY_TEN,
                    DAOTAO_TOCHUCCHUONGTRINH_ID: r.DAOTAO_TOCHUCCHUONGTRINH_ID, DAOTAO_CHUONGTRINH_TEN: r.DAOTAO_CHUONGTRINH_TEN,
                    DAOTAO_KHOADAOTAO_ID: r.DAOTAO_KHOADAOTAO_ID, DAOTAO_KHOADAOTAO_TEN: r.DAOTAO_KHOADAOTAO_TEN });
                them++;
            });
            veSV();
            if (them) ui.toast('Đã chọn ' + them + ' sinh viên — bấm Lưu kế hoạch để ghi.', 'ok');
            if (trung) ui.toast(trung + ' sinh viên đã tồn tại!', 'warn');
        }
        function luuSVMoi(id) {
            var ds = svMoi.slice();
            if (!ds.length) return Promise.resolve();
            return ui.batch(ds.map(function (a) {
                return { action: 'TN_KeHoach_PhamVi/ThemMoi', strId: '', strChucNang_Id: '', strTN_KeHoach_Id: id,
                    strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: a.DAOTAO_TOCHUCCHUONGTRINH_ID,
                    strNguoiThucHien_Id: '', strDaoTao_LopQuanLy_Id: a.DAOTAO_LOPQUANLY_ID, strDaoTao_KhoaDaoTao_Id: a.DAOTAO_KHOADAOTAO_ID };
            }), { title: 'Đang lưu sinh viên', okText: 'Thêm sinh viên thành công!' }).then(function () { svMoi = []; });
        }
        function xoaSV() {
            var ids = K.daChon(z('sv'), 'tnsv');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: 'TN_KeHoach_PhamVi/Xoa', strIds: id, strNguoiThucHien_Id: '' };
            }), function () { taiSV(); });
        }

        /* Bảng chọn sinh viên trong hai hộp (cột như cbGetListModal_SinhVien*) */
        function cotChonSV(khoaChon) {
            return [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc(T.hoTen(r)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: '#', cls: 'is-center is-nowrap', render: function (r) {
                    return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-chon1="' + esc(r.ID) + '"><i class="fa-light fa-plus"></i><span>Chọn</span></button>';
                } },
                K.cotChon(khoaChon)
            ];
        }
        function hopChon(cfg) {
            var dlg = ui.dialog({
                title: 'Tìm kiếm sinh viên', icon: 'fa-user-magnifying-glass', size: 'xl',
                body: '<div class="tnkh-hop">' +
                    '<div class="tnkh-hop__loc">' + cfg.loc + '</div>' +
                    '<div><div class="ums-row ums-row--between"><b class="ums-u-navy">Danh sách <span class="ums-u-faint ums-u-fz13" data-z="n"></span></b>' +
                        ui.btn('add', { text: 'Chọn', mod: 'primary', attr: { 'data-a': 'chon' } }) + '</div>' +
                    '<div class="ums-u-mt-2" data-z="t"></div></div></div>'
            });
            var B = dlg.body;
            K.ganChon(B);
            B.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-chon1], [data-a="chon"]');
                if (!b) return;
                var rows = cfg.rows();
                if (b.hasAttribute('data-chon1')) { var r = K.tim(rows, b.getAttribute('data-chon1')); if (r) nhanSV([r]); return; }
                var ids = K.daChon(B, 'tnchon');
                if (!ids.length) { ui.toast('Vui lòng chọn sinh viên', 'warn'); return; }
                nhanSV(ids.map(function (id) { return K.tim(rows, id); }).filter(Boolean));
            });
            ui.enhance(B);
            return dlg;
        }
        /* genModal_SinhVienDKH */
        function themTuDKH() {
            var rows = [], page = 1, size = 10, total = 0;
            function selM(f, ph) { return '<div class="ums-field"><select class="ums-select" multiple data-f="' + f + '" data-ph="' + esc(ph) + '"></select></div>'; }
            var dlg = hopChon({
                rows: function () { return rows; },
                loc: '<div class="ums-filter tnkh-hop__dsloc">' +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    selM('hk', 'Tất cả học kỳ') + selM('he', 'Tất cả hệ đào tạo') + selM('khoa', 'Tất cả khóa đào tạo') +
                    selM('ct', 'Tất cả chương trình đào tạo') + selM('lop', 'Tất cả lớp') +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div></div>'
            });
            var B = dlg.body, host = B.querySelector('[data-z="t"]');
            function f(x) { return B.querySelector('[data-f="' + x + '"]'); }
            function tang(el, action, params, ten) {
                var c = { action: 'DKH_Chung/' + action, method: 'GET', type: 'GET' };
                Object.keys(params).forEach(function (x) { c[x] = params[x]; });
                c.strTN_KeHoach_Id = '';            // gốc đọc dropAAAA
                c.strNguoiThucHien_Id = '';
                return ums.api.call(c)
                    .then(function (r) { pat.fill(el, K.ds(r), { name: ten }); })
                    .catch(function (err) { ums.api.handle(err, 'danh mục đăng ký học'); });
            }
            function rong(els) { els.forEach(function (el) { pat.fill(el, [], {}); }); }
            function napHe() {
                rong([f('he'), f('khoa'), f('ct'), f('lop')]);
                if (!pat.val(f('hk'))) return;
                tang(f('he'), 'LayHeDaoTaoTheoDangKy', { strDaoTao_ThoiGianDaoTao_Id: pat.val(f('hk')) }, 'TENHEDAOTAO');
            }
            function napKhoa() {
                rong([f('khoa'), f('ct'), f('lop')]);
                if (!pat.val(f('he'))) return;
                tang(f('khoa'), 'LayKhoaHocTheoDangKy', { strDaoTao_ThoiGianDaoTao_Id: pat.val(f('hk')), strDaoTao_HeDaoTao_Id: pat.val(f('he')) }, 'TENKHOA');
            }
            function napLop() {
                rong([f('lop')]);
                if (!pat.val(f('khoa'))) return;
                tang(f('lop'), 'LayLopQuanLyTheoDangKy', { strDaoTao_ThoiGianDaoTao_Id: pat.val(f('hk')), strDaoTao_HeDaoTao_Id: pat.val(f('he')),
                    strDaoTao_KhoaDaoTao_Id: pat.val(f('khoa')), strDaoTao_ChuongTrinh_Id: pat.val(f('ct')) }, 'TEN');
            }
            function napCT() {
                rong([f('ct')]);
                if (!pat.val(f('khoa'))) { rong([f('lop')]); return; }
                tang(f('ct'), 'LayChuongTrinhTheoDangKy', { strDaoTao_ThoiGianDaoTao_Id: pat.val(f('hk')), strDaoTao_HeDaoTao_Id: pat.val(f('he')),
                    strDaoTao_KhoaDaoTao_Id: pat.val(f('khoa')) }, 'TENCHUONGTRINH');
                napLop();
            }
            function tai(p) {
                if (p) page = p;
                K.dang(host);
                ums.api.call({ action: 'DKH_Chung/LayDanhSachHoSoTheoDangKy', method: 'GET', type: 'GET',
                    strTuKhoa: (f('q').value || '').trim(), strTN_KeHoach_Id: khId,
                    strHeDaoTao_Id: pat.val(f('he')), strKhoaDaoTao_Id: pat.val(f('khoa')), strChuongTrinh_Id: pat.val(f('ct')),
                    strLopQuanLy_Id: pat.val(f('lop')), strChucNang_Id: '', strNguoiThucHien_Id: '', pageIndex: page, pageSize: size })
                    .then(function (r) {
                        rows = K.ds(r); total = Number(r.pager) || rows.length;
                        B.querySelector('[data-z="n"]').textContent = '(' + total + ')';
                        ui.table({ el: host, rows: rows, empty: 'Không có sinh viên',
                            page: { index: page, size: size, total: total,
                                onChange: function (n) { if (n >= 1 && n <= Math.ceil(total / size)) tai(n); },
                                onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); tai(1); } },
                            columns: cotChonSV('tnchon') });
                    }).catch(function (err) { K.loi(host, err, 'sinh viên theo đăng ký học'); });
            }
            var EV = 'select2:select select2:unselect select2:clear';
            jQuery(f('hk')).on(EV, napHe);
            jQuery(f('he')).on(EV, napKhoa);
            jQuery(f('khoa')).on(EV, napCT);
            jQuery(f('ct')).on(EV, napLop);
            jQuery(f('lop')).on('select2:select', function () { tai(1); });
            pat.chain([f('hk'), f('he'), f('khoa'), f('ct')], { phatLai: false });
            pat.chain([f('khoa'), f('lop')], { phatLai: false });
            B.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="tim"]')) tai(1); });
            f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
            tang(f('hk'), 'LayThoiGianDangKyHoc', {}, 'DAOTAO_THOIGIANDAOTAO');
            host.innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-filter');
        }
        /* genModal_SinhVienKeHoach */
        function themTuKeHoach() {
            var rows = [];
            var dlg = hopChon({
                rows: function () { return rows; },
                loc: '<div class="ums-filter tnkh-hop__dsloc">' +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="loai" data-ph="Chọn loại kế hoạch"><option value=""></option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch"><option value=""></option></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div></div>'
            });
            var B = dlg.body, host = B.querySelector('[data-z="t"]');
            function f(x) { return B.querySelector('[data-f="' + x + '"]'); }
            var loc = K.locTaiCho(f('q'), host);
            function napKH() {
                pat.fill(f('kh'), [], { head: 'Chọn kế hoạch' });
                if (!f('loai').value) return;
                T.dsKeHoach({ strTuKhoa: '', strPhanLoai_Id: f('loai').value, strDaoTao_ThoiGianDaoTao_Id: '',
                    strNguoiDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
                    .then(function (r) { pat.fill(f('kh'), K.ds(r), { name: 'TEN', head: 'Chọn kế hoạch' }); })
                    .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
            }
            function tai() {
                if (!f('kh').value) { host.innerHTML = ui.empty('Chọn kế hoạch', 'fa-filter'); return; }
                K.dang(host);
                ums.api.call({ action: 'TN_KeHoach_PhamVi/LayDanhSach', method: 'GET',
                    strTuKhoa: '', strNguoiDung_Id: '', strTN_KeHoach_Id: f('kh').value, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
                    .then(function (r) {
                        rows = K.ds(r);
                        B.querySelector('[data-z="n"]').textContent = '(' + rows.length + ')';
                        ui.table({ el: host, rows: rows, empty: 'Không có sinh viên', columns: cotChonSV('tnchon') });
                        loc();
                    }).catch(function (err) { K.loi(host, err, 'sinh viên của kế hoạch'); });
            }
            jQuery(f('loai')).on('select2:select select2:clear', function () { napKH(); tai(); });
            jQuery(f('kh')).on('select2:select select2:clear', tai);
            pat.chain([f('loai'), f('kh')], { phatLai: false });
            B.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="tim"]')) tai(); });
            ums.api.dm('TN.PHANLOAI').then(function (ds) { pat.fill(f('loai'), ds, { name: 'TEN', head: 'Chọn loại kế hoạch' }); })
                .catch(function (err) { ums.api.handle(err, 'loại kế hoạch'); });
            tai();
        }

        /* ---------- Lưu kế hoạch -------------------------------------------- */
        function luu() {
            var ten = (k('ten').value || '').trim();
            if (!ten) { ui.toast('Vui lòng nhập Tên kế hoạch', 'warn'); k('ten').focus(); return; }
            if (k('tu').value && k('den').value) {
                var a = k('tu').value.split('/'), b = k('den').value.split('/');
                if (a.length === 3 && b.length === 3 && (b[2] + b[1] + b[0]) < (a[2] + a[1] + a[0])) {
                    ui.toast('Đến ngày không được trước Từ ngày', 'warn'); return;
                }
            }
            var c = {
                action: 'TN_ThongTin_MH/FSkkLB4VDx4KJAkuICIp', func: 'pkg_totnghiep_thongtin.Them_TN_KeHoach',
                strId: khId, strChucNang_Id: '',
                strTen: ten, strMa: k('ma').value,
                strNgayBatDau: k('tu').value, strNgayKetThuc: k('den').value,
                dMoChoNguoiHocDangKy: k('hl').value, strMoTa: '',
                strDaoTao_ThoiGianDaoTao_Id: k('tg').value,
                strQLSV_TrangThai_Id: '',
                dCoTinhLaiDiemTKHP: k('tkhp').checked ? 1 : undefined,
                dKetQuaChinhThuc: '',
                strPhanLoai_Id: k('pl').value,
                strNguoiThucHien_Id: ''
            };
            if (c.strId) {
                c.action = 'TN_ThongTin_MH/EjQgHhUPHgokCS4gIikP';
                c.func = 'pkg_totnghiep_thongtin.Sua_TN_KeHoach';
                c.strTN_QuyTacSinhSoHieu_Ad_Id = k('qtsh').value;
                c.strTN_QuyTacSinhSoVSo_Ad_Id = k('qtvs').value;
            }
            ums.api.call(c).then(function (r) {
                var moi = c.strId === '';
                ui.toast(moi ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
                var id = moi ? ((r.raw && r.raw.Id) || '') : c.strId;
                if (o.onSaved) o.onSaved();
                if (!id) return;
                khId = id;
                trangThai(true);
                luuSVMoi(id).then(function () { taiSV(moi ? 1 : svPage); });
                luuNS(id).then(function () { taiNS(); });
                luuHP(id).then(function () { taiHP(1); });
            }).catch(function (err) { ums.api.handle(err, 'lưu kế hoạch'); if (o.onSaved) o.onSaved(); });
        }

        /* ---------- Sự kiện ------------------------------------------------- */
        var henSV = null;
        zone.querySelector('[data-f="svq"]').addEventListener('input', function () { clearTimeout(henSV); henSV = setTimeout(function () { taiSV(1); }, 400); });
        zone.querySelector('[data-f="svq"]').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(henSV); taiSV(1); } });
        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'luu': luu(); break;
                case 'hp-them': themHP(); break;
                case 'hp-xoa': xoaHP(); break;
                case 'ns-them': themNS(); break;
                case 'ns-xoa': xoaNS(b.getAttribute('data-id')); break;
                case 'sv-them': themSV(); break;
                case 'sv-dkh': themTuDKH(); break;
                case 'sv-kh': themTuKeHoach(); break;
                case 'sv-xoa': xoaSV(); break;
                case 'sv-bo': svMoi = svMoi.filter(function (x) { return String(x.ID) !== b.getAttribute('data-id'); }); veSV(); break;
            }
        });

        function datLai() {
            hp = []; hpMoi = []; hpTotal = 0; hpPage = 1;
            ns = []; svMoi = []; svRows = []; svTotal = 0; svPage = 1;
            zone.querySelector('[data-f="svq"]').value = '';
            z('sv').innerHTML = '';
        }
        return {
            moThem: function () {
                khId = '';
                datLai();
                datGiaTri(k('ma'), ''); datGiaTri(k('ten'), '');
                datGiaTri(k('pl'), o.phanLoaiLoc ? o.phanLoaiLoc() : '');     // rewrite: lấy ô lọc
                Promise.resolve(dsHocKy).then(function () { datGiaTri(k('tg'), o.hocKyLoc ? o.hocKyLoc() : ''); });
                datGiaTri(k('tu'), ''); datGiaTri(k('den'), '');
                datGiaTri(k('hl'), '1');
                k('tkhp').checked = false;
                datGiaTri(k('qtsh'), ''); datGiaTri(k('qtvs'), '');
                veHP(); veNS();
                trangThai(false);
            },
            moSua: function (d) {
                khId = d.ID;
                datLai();
                datGiaTri(k('ma'), d.MA); datGiaTri(k('ten'), d.TEN);
                datGiaTri(k('pl'), d.PHANLOAI_ID);
                Promise.resolve(dsHocKy).then(function () { datGiaTri(k('tg'), d.DAOTAO_THOIGIANDAOTAO_ID); });
                datGiaTri(k('tu'), d.NGAYBATDAU); datGiaTri(k('den'), d.NGAYKETTHUC);
                datGiaTri(k('hl'), d.MOCHONGUOIHOCDANGKY);
                k('tkhp').checked = !!Number(d.COTINHLAIDIEMTKHP);
                datGiaTri(k('qtsh'), d.PHOI_TN_QUYTACSINHSOHIEU_AD_ID);
                datGiaTri(k('qtvs'), d.PHOI_TN_QUYTACSINHSOVSO_AD_ID);
                trangThai(true);
                taiSV(1); taiNS(); taiHP(1);
            }
        };
    };
})();
