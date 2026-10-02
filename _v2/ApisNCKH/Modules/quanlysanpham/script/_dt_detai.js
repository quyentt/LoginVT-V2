/* =========================================================================
   NCKH — ĐỀ TÀI / DỰ ÁN: khung dùng chung của hai màn (ums.nckhDt)
     · quanlysanpham/detai   (bản QUẢN TRỊ — hai cột, thêm/sửa/xoá đề tài của mọi cán bộ)
     · xacnhankekhai/detai   (bản XÁC NHẬN — một cột, xem kê khai + xác nhận sản phẩm)
   Bản gốc: ApisNCKH/Modules/quanlysanpham/{html/detai.html, script/detai.js} (2.502 dòng)
            ApisNCKH/Modules/xacnhankekhai/{html/detai.html, script/detai.js} (2.667 dòng)
   Hai bản gốc chép từ ApisCongCanBo/Modules/sanphamkhoahoc/script/detai.js (~60% trùng). DÙNG LẠI bản CCB đã
   chuyển: khung ums.nckh (_sanpham.js — N.thanhVien, N.kinhPhi, N.item, N.g) và 5 khối con của CCB detai.js
   (sản phẩm khoa học + đào tạo, sản phẩm ứng dụng, đơn vị hợp tác, tiến độ, quyết định phê duyệt - nghiệm thu)
   mượn qua _dt_muon.js (ums.nckhDt.cfgCCB) — KHÔNG sửa tệp CCB.
   ---------------------------------------------------------------------------
   ums.nckhDt.man(root, { xacNhan: true|false })
   ums.nckhDt.ganDonVi(crud, 'donVi', 'thanhVien')   ô lọc Đơn vị thành viên → Thành viên đăng ký (quanlyduan dùng lại)
   ums.nckhDt.thamSoDs(f, xacNhan)                   tham số NCKH_DeTai/LayDanhSach của hai bản

   Lời gọi (chép nguyên, GET/POST như gốc):
     NCKH_DeTai/LayDanhSach GET  iTinhTrang -1 · iTrangThai -1 · strCanBoNhapDeTai_Id '' · strThanhVien_Id '' · strTuKhoaText
         · dTuKhoaNumber -1 · strNCKH_DeCuong_Id '' · strCapQuanLy_Id · strLinhVucNghienCuu_Id · strNguonKinhPhi_Id ''
         · strThietKeNghienCuu_Id '' · strNCKH_ThanhVien_Id (ô Thành viên) · strDonVi_Id_CuaThanhVien_Id (ô Đơn vị)
         · strDaoTao_CoCauToChuc_Id ('' | ô Đơn vị ở bản xác nhận) · strLoaiChucDanh_Id '' · strLoaiHocVi_Id '' · strTinhTrang_Id ''
         · strTinhTrangXacNhan_Id ('' | ô Tình trạng) · strNhanSu_TDKT_KeHoach_Id (ô Năm đánh giá) · strPhanLoaiDeTai_Id · trang máy chủ
     pkg_nhansu_hoso_v2.LayDanhSachToanBo (ums.ref.coCauToChuc — edu.system.getList_CoCauToChuc) → ô Đơn vị
     NS_HoSoV2/LayDanhSach GET strTuKhoa '' · pageIndex 1 · pageSize 1000000 · strDaoTao_CoCauToChuc_Id · strNguoiThucHien_Id ''
         · dLaCanBoNgoaiTruong 0 → ô Thành viên (HOTEN - MASO)
     NCKH_TinhDiem_KeHoach/LayDanhSach GET (MOTA) → ô Năm đánh giá (bản xác nhận chọn sẵn mục đầu như gốc)
     Bản QUẢN TRỊ:
       NCKH_DeTai/ThemMoi | CapNhat POST (tham số như gốc — xem luuDeTai) · NCKH_DeTai/Xoa POST strId
       NCKH_DanhMucDeTai/LayDanhSach GET strTuKhoa · strPhanLoaiDeTai_Id · strNguoiThucHien_Id · trang (hộp "Tìm đề tài")
       Khối con (lưu SAU đề tài, như gốc): NCKH_DeTai_SanPham · NCKH_SP_QuanLyDeTaiSinhVien/ThemMoi · NCKH_SP_DeTai ·
       NCKH_SP_NguonKinhPhi (strId '' khi thêm) · NCKH_DeTai_DoiTac · NCKH_DeTai_TienDo · NCKH_DeTai_KetQua · NCKH_ThanhVien
       (vai trò NCKH.VTDT) · NCKH_Files (tệp minh chứng của đề tài + tệp từng quyết định)
     Bản XÁC NHẬN:
       NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung GET strChucNang_Id · strNguoiThucHien_Id → các nút xác nhận
         (bỏ MA = XNKKCHUAKHAI như gốc; THONGTIN1 biểu tượng FA4 qua ums.iconFA4, THONGTIN2 kiểu CSS)
       NCKH_SP_XacNhanKeKhai/ThemMoi POST strId '' · strSanPham_Id · strNoiDung · strTinhTrang_Id · strNguoiXacnhan_Id
         (edu.extend.save_XacNhanSanPham) · NCKH_SP_XacNhanKeKhai/LayDanhSach GET strTuKhoa '' · strSanPham_Id
         · strTinhTrang_Id '' · strNguoiThucHien_Id '' · 1/100000 (getList_XacNhanSanPham — "Lịch sử xác nhận")
       NCKH_DeTai_KetQua/LayDanhSach GET (tệp của từng quyết định ở cột "File đính kèm", getList_DeTai_KetQua_File)
       NCKH_Files/GopFile POST arrTuKhoa (đường dẫn) · arrDuLieu (tên; ảnh để trống như gốc) · strNguoiThucHien_Id → mở tệp gộp
       Báo cáo: ums.report.mount (edu.system.getList_MauImport "zonebtnBaoCao_DeTai"), tham số addKeyValue chép nguyên.

   Khác bản gốc / TỰ CHỐT (ghi báo cáo):
     · Quản trị: mục ở cột trái không còn thùng rác (luật 12) → nút Xoá trong biểu mẫu. "Nhập tiếp" (gốc: nút mang lớp
       btnReWrite nhưng mã chỉ gắn #btnReWrite → nút CHẾT) nay = lưu rồi xoá trắng để nhập tiếp, đúng ý định của mã gốc.
     · Quản trị: bắt buộc Tên đề tài tiếng việt + Mã đề tài (gốc có arrValid, dấu (*) nhưng không chặn lưu).
     · Quản trị: sửa đề tài gốc đọc cột TENDETAI (cột của DANH MỤC đề tài) → ô Tên trống khi sửa; nay đọc TENDETAITIENGVIET,
       không có thì TENDETAI (dòng chọn từ danh mục).
     · Quản trị, hộp "Tìm đề tài": gốc gửi strPhanLoaiDeTai_Id = ô TỪ KHOÁ → nay gửi ô "Phân loại đề tài" của hộp.
     · Quản trị, chọn từ danh mục: gốc tự thêm người đăng nhập vào thành viên (getDetail_HS) — màn QUẢN TRỊ nhập thay người
       khác nên KHÔNG tự thêm (thêm mới gốc cũng không).
     · Quản trị: dKinhPhi_n / strNguonKinhPhi_Id / strThoiGianBaoCaoTienDo_Id gốc đọc ô nhập DÒNG MỚI của bảng kinh phí /
       tiến độ (giá trị gõ dở), strDonViTinh_Id / strTinhTrang_Id đọc ô không tồn tại → gửi rỗng (như bản CCB đã chốt).
     · Quản trị: lưới Quyết định mượn nguyên khối CCB — mở sẵn 2 dòng trống (gốc 4), tiêu đề "Quyết định phê duyệt - nghiệm thu".
     · Xác nhận: khung kê khai CHỈ XEM (gốc vẽ ô nhập nhưng không có nút Lưu) → "nhãn : giá trị" + bảng chỉ xem.
     · Xác nhận: ô "Tình trạng" gốc không bao giờ được nạp (luôn rỗng) → nạp các mục xác nhận theo người dùng (cùng danh mục).
       Ba ô Loại / Lĩnh vực / Cấp quản lý gốc bị ẩn lúc mở màn mà không có nút mở lại → nay hiện.
     · Ô Thành viên lọc theo Đơn vị; đổi Đơn vị thì xoá chọn Thành viên. Bản XÁC NHẬN: Thành viên KHOÁ tới khi chọn Đơn vị
       (pat.chain — thống nhất các màn xác nhận NCKH). Bản quản trị: lọc "Tất cả …" tuỳ chọn, không khoá.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nckh;
    var D = ums.nckhDt = ums.nckhDt || {};
    var e = N.e, arr = N.arr, uid = N.uid, esc = ui.esc;
    function loi(noi) { return function (err) { ums.api.handle(err, noi); }; }
    function ten(r) { return e(r.TENDETAITIENGVIET || r.TENDETAI); }
    var DANG_TAI = ui.empty('Đang tải…', 'fa-spinner fa-spin');

    /* ---------- Nguồn / ô lọc dùng chung ---------------------------------- */
    D.srcNam = { call: { action: 'NCKH_TinhDiem_KeHoach/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(),
        pageIndex: 1, pageSize: 1000000 }, name: 'MOTA' };

    /* o.khoa: true → Thành viên KHOÁ tới khi chọn Đơn vị (pat.chain — bản xác nhận, thống nhất nhóm NCKH 27/9) */
    D.ganDonVi = function (crud, kDv, kTv, o) {
        o = o || {};
        function fl(k) { return crud.root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
        var dv = fl(kDv), tv = fl(kTv);
        if (!dv || !tv) return;
        ums.ref.coCauToChuc({}).then(function (d) { pat.fill(dv, d, { head: dv.getAttribute('data-ph') }); }).catch(loi('đơn vị'));
        var lan = 0;
        function napTV() {
            var so = ++lan;
            if (o.khoa && !dv.value) { pat.fill(tv, [], { head: tv.getAttribute('data-ph') }); return Promise.resolve(); }
            return N.g('NS_HoSoV2/LayDanhSach', { strTuKhoa: '', pageIndex: 1, pageSize: 1000000, strDaoTao_CoCauToChuc_Id: dv.value,
                strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0 }).then(function (r) {
                if (so !== lan) return;
                pat.fill(tv, arr(r.data), { head: tv.getAttribute('data-ph'), name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } });
            }).catch(loi('thành viên'));
        }
        napTV();
        /* Gắn thẳng lên ô (chạy TRƯỚC trình nghe ủy quyền của crud ở root) → danh sách nạp lại với Thành viên đã xoá */
        if (window.jQuery) jQuery(dv).on('change', function () { tv.value = ''; jQuery(tv).trigger('change.select2'); napTV(); });
        if (o.khoa) pat.chain([dv, tv], { phatLai: false });
    };

    D.thamSoDs = function (f, xn) {
        return { iTinhTrang: -1, iTrangThai: -1, strCanBoNhapDeTai_Id: '', strThanhVien_Id: '', strTuKhoaText: e(f.q), dTuKhoaNumber: -1,
            strNCKH_DeCuong_Id: '', strCapQuanLy_Id: e(f.capQL), strLinhVucNghienCuu_Id: e(f.linhVuc), strNguonKinhPhi_Id: '',
            strThietKeNghienCuu_Id: '', strNCKH_ThanhVien_Id: e(f.thanhVien), strDonVi_Id_CuaThanhVien_Id: e(f.donVi),
            strDaoTao_CoCauToChuc_Id: xn ? e(f.donVi) : '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strTinhTrang_Id: '',
            strTinhTrangXacNhan_Id: xn ? e(f.tt) : '', strNhanSu_TDKT_KeHoach_Id: e(f.nam), strPhanLoaiDeTai_Id: e(f.loai) };
    };
    function locChung(xn) {
        var l = [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'donVi', type: 'select', label: 'Tất cả đơn vị thành viên' },
            { key: 'thanhVien', type: 'select', label: 'Tất cả thành viên đăng ký' }];
        if (xn) l.push({ key: 'tt', type: 'select', label: 'Tất cả tình trạng' });
        l.push({ key: 'nam', type: 'select', label: 'Tất cả năm đánh giá', source: D.srcNam, first: !!xn },
            { key: 'loai', type: 'select', label: 'Chọn loại đề tài', source: { dm: 'NCKH.PLDT' } },
            { key: 'linhVuc', type: 'select', label: 'Chọn lĩnh vực nghiên cứu', source: { dm: 'NCKH.LVNC' } },
            { key: 'capQL', type: 'select', label: 'Chọn cấp quản lý', source: { dm: 'NCKH.CAQL' } });
        if (xn) l.push(l.shift());               // bản xác nhận: thanh lọc ngang, từ khoá đứng cuối như gốc
        return l;
    }

    /* =====================================================================
       Bản QUẢN TRỊ (hai cột)
       ===================================================================== */
    function khoiCCB(dau) {
        var c = D.cfgCCB;
        return c && (c.khoi || []).filter(function (k) { return k && typeof k.html === 'string' && k.html.indexOf(dau) >= 0; })[0];
    }
    /* Khối "Nội dung minh chứng" (ô chữ + tệp đính kèm của đề tài) — gốc đặt giữa Tiến độ và Quyết định */
    function khoiMinhChung() {
        var inp = null, fl = null;
        return {
            html: pat.panel({ title: 'Nội dung minh chứng', icon: 'fa-file-circle-check', cls: 'ums-u-mt-4', body:
                ui.field('Nội dung', '<input class="ums-input" data-dt="mc" placeholder="Nội dung minh chứng" autocomplete="off">') +
                ui.field('File đính kèm', '<div data-dt="tep"></div>') }),
            gan: function (host) { inp = host.querySelector('[data-dt="mc"]'); fl = ums.files.mount(host.querySelector('[data-dt="tep"]'), { api: 'NCKH_Files' }); },
            nap: function (row) { inp.value = e(row.THONGTINMINHCHUNG); return fl.load(row.ID); },
            chep: function (row) { inp.value = e(row.THONGTINMINHCHUNG); return Promise.resolve(fl.load(row.ID)).then(function () { fl.chep(); }); },
            moi: function () { inp.value = ''; fl.clear(); },
            luu: function (id) { return fl.save(id); },
            ban: function () { return !!(fl && fl.busy()); },
            gt: function () { return { strThongTinMinhChung: inp ? inp.value.trim() : '' }; }
        };
    }

    /* Hộp "Tìm đề tài" — danh mục đề tài (NCKH_DanhMucDeTai), chọn thì chép vào biểu mẫu thêm mới */
    function hopDanhMuc(onChon) {
        var page = 1, size = 10, rows = [];
        var dlg = ui.dialog({ title: 'Tìm kiếm đề tài', icon: 'fa-magnifying-glass', size: 'xl', body:
            '<div class="ums-filter">' +
            '<div class="ums-field"><input class="ums-input" data-tm="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field"><select class="ums-select" data-tm="pl" data-ph="Chọn phân loại đề tài"><option value="">Chọn phân loại đề tài</option></select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-tm-a': 'tim' } }) + '</div></div>' +
            '<div class="ums-u-mt-4" data-tm="bang"></div>' });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-tm="' + k + '"]'); }
        ui.enhance(B);
        ums.api.dm('NCKH.PLDT').then(function (d) { pat.fill(f('pl'), d, { head: 'Chọn phân loại đề tài' }); }).catch(function () {});
        function tai(p) {
            if (p) page = p;
            f('bang').innerHTML = DANG_TAI;
            N.g('NCKH_DanhMucDeTai/LayDanhSach', { strTuKhoa: f('q').value.trim(), strPhanLoaiDeTai_Id: f('pl').value, strNguoiThucHien_Id: uid(),
                pageIndex: page, pageSize: size }).then(function (r) {
                rows = arr(r.data);
                ui.table({ el: f('bang'), rows: rows, stt: true, empty: 'Không tìm thấy dữ liệu', columns: [
                    { title: 'Tên đề tài', prop: 'TENDETAI' }, { title: 'Tên đề tài tiếng anh', prop: 'TENDETAITIENGANH' },
                    { title: '', cls: 'is-center is-nowrap', render: function (x, i) {
                        return '<button type="button" class="ums-btn ums-btn--sm ums-btn--primary" data-tm-chon="' + i + '"><span>Chọn đề tài</span></button>';
                    } }],
                    page: { index: page, size: size, total: Number(r.pager) || rows.length, onChange: tai, onSize: function (n) { size = n; tai(1); } } });
            }).catch(function (err) { f('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh mục đề tài'); });
        }
        B.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-tm-a]')) { tai(1); return; }
            var c = ev.target.closest('[data-tm-chon]');
            if (c) { var r = rows[Number(c.getAttribute('data-tm-chon'))]; if (r) { dlg.close(); onChon(r); } }
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        setTimeout(function () { f('q').focus(); }, 300);
        tai(1);
    }

    function quanTri(root) {
        var mc = khoiMinhChung();
        var khoi = [khoiCCB('data-sp="kh"'), khoiCCB('data-nk="spud"'), N.kinhPhi({ khoaThem: 'strId' }), khoiCCB('data-nk="dvht"'),
            khoiCCB('data-nk="tddt"'), mc, khoiCCB('data-nk="kq"'), khoiCCB('Chú ý: Phải nhập'),
            N.thanhVien({ vaiTro: 'NCKH.VTDT', tieuDeTrong: 'Thành viên tham gia', tuThem: false })].filter(Boolean);
        var chon = null;
        function f(key, col, label, o) { return Object.assign({ key: key, col: col, label: label, cols: 6 }, o || {}); }
        function giaTriKhoi() {
            var x = { nam: '' };                  // gốc (bản quản trị) không gửi strNCKH_TinhDiem_KeHoach_Id khi lưu thành viên
            khoi.forEach(function (k) { if (k.gt) Object.assign(x, k.gt()); });
            return x;
        }
        var crud = ums.crud({
            root: root, title: 'Đề tài/dự án', formTitle: 'đề tài', icon: 'fa-microscope', autoload: false,
            master: { title: 'Đề tài/dự án', icon: 'fa-list-ul', item: function (r) { return '<div class="nk-ten">' + esc(ten(r)) + '</div>'; },
                empty: 'Hôm nay bạn có sản phẩm mới không? Bấm Thêm mới ở đầu trang.' },
            filters: locChung(false),
            list: { paged: true, call: function (fv) { return Object.assign({ action: 'NCKH_DeTai/LayDanhSach', method: 'GET' }, D.thamSoDs(fv, false)); } },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin đề tài' },
                f('strTenDeTaiTiengViet', '', 'Tên đề tài tiếng việt', { required: true, cols: 12, placeholder: 'Nhập tên đề tài', get: ten }),
                f('strTenDeTaiTiengAnh', 'TENDETAITIENGANH', 'Tên đề tài tiếng anh', { placeholder: 'Nhập tên đề tài' }),
                f('strMaDeTai', 'MADETAI', 'Mã đề tài', { required: true, placeholder: 'Nhập mã đề tài' }),
                f('strDonViToChucCoDeTai', 'DONVITOCHUCCODETAI', 'Tổ chức có đề tài', { placeholder: 'Nhập tổ chức phát hành đề tài' }),
                f('strLinhVucNghienCuu_Id', 'LINHVUCNGHIENCUU_ID', 'Lĩnh vực', { type: 'select', placeholder: 'Chọn lĩnh vực', source: { dm: 'NCKH.LVNC' } }),
                f('dSoTacGia_n', 'SOTACGIA_N', 'Tổng số tác giả', { type: 'number' }),
                f('strPhanLoaiDeTai_Id', 'PHANLOAIDETAI_ID', 'Loại đề tài', { type: 'select', placeholder: 'Chọn loại đề tài', source: { dm: 'NCKH.PLDT' } }),
                f('strCapQuanLy_Id', 'CAPQUANLY_ID', 'Cấp quản lý', { type: 'select', placeholder: 'Chọn cấp quản lý', source: { dm: 'NCKH.CAQL' } }),
                { type: 'gap', cols: 6 },
                f('strThoiGianBatDau', 'THOIGIANBATDAU', 'Thời gian từ', { placeholder: 'mm/yyyy' }),
                f('strThoiGianKetThuc', 'THOIGIANKETTHUC', 'Đến', { placeholder: 'mm/yyyy' }),
                f('strSanPhamKhac', 'SANPHAMKHAC', 'Sản phẩm khác', { type: 'textarea', cols: 12, placeholder: 'Nhập sản phẩm khác nếu có' }),
                f('strMucTieu', 'MUCTIEU', 'Mục tiêu', { type: 'textarea', cols: 12, placeholder: 'Nhập mục tiêu nếu có' })
            ],
            saveAgain: 'Nhập tiếp',
            save: function (v, row) {
                if (mc.ban()) { ui.toast('Đang tải tệp lên, đợi xong rồi lưu', 'warn'); return null; }
                var x = giaTriKhoi();
                return { action: 'NCKH_DeTai/' + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                    strPhanLoaiDeTai_Id: v.strPhanLoaiDeTai_Id, strSanPhamKhac: v.strSanPhamKhac, strMucTieu: v.strMucTieu, strDiaDiemThucHienDeTai: '',
                    strDonViToChucCoDeTai: v.strDonViToChucCoDeTai, strNCKH_DeCuong_Id: '', strMaDeTai: v.strMaDeTai,
                    strTenDeTaiTiengViet: v.strTenDeTaiTiengViet, strTenDeTaiTiengAnh: v.strTenDeTaiTiengAnh, strCapQuanLy_Id: v.strCapQuanLy_Id,
                    strQuyetDinhPheDuyetSo: '', strNgayPheDuyet: '', strThietKeNghienCuu_Id: '', strLinhVucNghienCuu_Id: v.strLinhVucNghienCuu_Id,
                    dKinhPhi_n: '', strNguonKinhPhi_Id: '', strDonViTinh_Id: '', strThoiGianBatDau: v.strThoiGianBatDau, dSoThangThucHien_n: '',
                    strThoiGianKetThuc: v.strThoiGianKetThuc, strThoiGianBaoCaoTienDo_Id: '', strCanBoNhapDeTai_Id: uid(), strDeTaiTuVanSo: '',
                    strNguoiKyDeTaiTuVan: '', strNgayKyDeTaiTuVan: '', strThongTinMinhChung: x.strThongTinMinhChung, strTinhTrang_Id: '',
                    strFileMinhChung: '', dSoTacGia_n: v.dSoTacGia_n, iTinhTrang: 1, strNhaTaiTro: '', strDoiTac_Id: '', strQuocTich_Id: '',
                    strThanhVien_Id: '', strVaiTro_Id: '', iTrangThai: 1, strTrangThai_ThanhVien: '', strThuTu_ThanhVien: '', strTyLeThamGia: '' };
            },
            remove: function (ids) { return ids.map(function (id) { return { action: 'NCKH_DeTai/Xoa', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; }); },
            multi: false,
            onForm: function (row, c, extra) {
                if (!extra) return;
                extra.innerHTML = khoi.map(function (k) { return '<div data-nk-khoi>' + k.html + '</div>'; }).join('');
                var hosts = extra.querySelectorAll('[data-nk-khoi]');
                khoi.forEach(function (k, i) { if (k.gan) k.gan(hosts[i], c); });
                var nguon = chon; chon = null;
                if (row) khoi.forEach(function (k) { if (k.nap) k.nap(row); });
                else if (nguon) {
                    c.fillForm(nguon);
                    khoi.forEach(function (k) { if (k.chep) k.chep(nguon); });
                    ui.toast('Đã chép thông tin "' + ten(nguon) + '" — bấm Lưu để thêm đề tài', 'info', { timeout: 7000 });
                } else khoi.forEach(function (k) { if (k.moi) k.moi(); });
                themNutTim(c);
            },
            /* Lưu các khối con NGAY (đọc giá trị trước khi "Nhập tiếp" xoá trắng biểu mẫu) */
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
                if (!id) return;
                var x = giaTriKhoi();
                khoi.forEach(function (k) { if (k.luu) k.luu(id, isEdit, x); });
            }
        });
        function themNutTim(c) {
            var o = root.querySelector('[data-scope="form"][data-k="strTenDeTaiTiengViet"]');
            var wrap = o && o.closest('.ums-field');
            if (!wrap || wrap.querySelector('[data-dt-tim]')) return;
            wrap.insertAdjacentHTML('beforeend', '<div class="nk-tim">' + ui.btn('search', { text: 'Tìm đề tài', mod: 'out-primary', attr: { 'data-dt-tim': '1' } }) + '</div>');
            wrap.querySelector('[data-dt-tim]').addEventListener('click', function () {
                hopDanhMuc(function (r) { chon = r; c.showForm(null); });
            });
        }
        D.ganDonVi(crud, 'donVi', 'thanhVien', { khoa: true });
        crud.sourcesReady.then(function () { crud.load(1); });
        return crud;
    }

    /* =====================================================================
       Bản XÁC NHẬN (một cột: thanh lọc + bảng; khung kê khai CHỈ XEM thay chỗ bảng)
       ===================================================================== */
    function kv(nhan, gt) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(gt) + '</b></div>'; }
    function lg(chu, x) { return '<div class="ums-legend">' + esc(chu) + '</div><div data-x="' + x + '"></div>'; }
    function laAnh(p) { return /\.(jpe?g|png|gif|bmp)$/i.test(String(p || '')); }
    /* ngày/tháng/năm gốc ghép bằng "/" — trống cả ba thì để trống (gốc hiện "//") */
    function ngay(d, m, y) { return (e(d) || e(m) || e(y)) ? '<i>' + esc(e(d) + '/' + e(m) + '/' + e(y)) + '</i>' : ''; }
    function bieuTuong(x) { return ums.iconFA4 ? ums.iconFA4(e(x.THONGTIN1) || 'fa fa-check') : 'fa-light fa-circle-check'; }

    function xacNhan(root) {
        root.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
        var zDs = root.querySelector('[data-z="ds"]'), zCt = root.querySelector('[data-z="ct"]');
        var dsXN = [], tep = {}, dang = null;
        var xnP = N.g('NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung', { strChucNang_Id: N.chucNang(), strNguoiThucHien_Id: uid() })
            .then(function (r) { dsXN = arr(r.data); }, loi('danh mục xác nhận'));
        function nutXN() { return dsXN.filter(function (x) { return e(x.MA) !== 'XNKKCHUAKHAI'; }); }

        var crud = ums.crud({
            root: zDs, title: 'Đề tài/dự án', listTitle: 'Đề tài/dự án', icon: 'fa-microscope', autoload: false,
            toolbar: [{ text: 'Tải file', icon: 'fa-cloud-arrow-down', mod: 'out-info', onClick: function () { taiFile(); } }],
            filters: locChung(true),
            list: { paged: true, call: function (fv) { return Object.assign({ action: 'NCKH_DeTai/LayDanhSach', method: 'GET' }, D.thamSoDs(fv, true)); } },
            columns: [
                { title: 'Tên đề tài', render: function (r) { return '<button type="button" class="ums-link dt-ten" data-dt-mo="' + esc(r.ID) + '">' + esc(ten(r)) + '</button>'; } },
                { title: 'Loại đề tài', prop: 'PHANLOAIDETAI_TEN', cls: 'is-center' },
                { title: 'Tổng số tác giả', prop: 'SOTACGIA_N', cls: 'is-center', width: '90px' },
                { title: 'Năm nghiệm thu', cls: 'is-center is-nowrap', render: function (r) { return ngay(r.NGAYNGHIEMTHU, r.THANGNGHIEMTHU, r.NAMNGHIEMTHU); } },
                { title: 'Năm công nhận', cls: 'is-center is-nowrap', render: function (r) { return ngay(r.NGAYCONGNHAN, r.THANGCONGNHAN, r.NAMCONGNHAN); } },
                { title: 'Vai trò người khai', prop: 'VAITRO_TEN', cls: 'is-center' },
                { title: 'File đính kèm', render: function (r) { return '<div class="dt-tep" data-dt-tep="' + esc(r.ID) + '"></div>'; } },
                { title: 'Xác nhận', cls: 'is-center is-nowrap', render: function (r) {
                    return nutXN().map(function (x) {
                        return '<button type="button" class="ums-iconbtn" data-dt-xn="' + esc(x.ID) + '" data-id="' + esc(r.ID) + '" title="' + esc(e(x.TEN)) + '">' +
                            '<i class="' + esc(bieuTuong(x)) + '"' + (x.THONGTIN2 ? ' style="' + esc(x.THONGTIN2) + '"' : '') + '></i></button>';
                    }).join('');
                } },
                { title: 'Xác nhận cuối cùng', cls: 'is-center', render: function (r) {
                    if (!e(r.KETQUAXACNHAN_TEN)) return '';
                    return '<span class="dt-xncc" title="' + esc(e(r.KETQUAXACNHAN_TEN)) + '"><i class="' + esc(bieuTuong({ THONGTIN1: r.KETQUAXACNHAN_THONGTIN1 })) + '"' +
                        (r.KETQUAXACNHAN_THONGTIN2 ? ' style="' + esc(r.KETQUAXACNHAN_THONGTIN2) + '"' : '') + '></i> ' + esc(e(r.KETQUAXACNHAN_TEN)) + '</span>';
                } },
                { title: 'Nội dung xác nhận', prop: 'KETQUAXACNHAN_NOIDUNG' }
            ],
            onLoad: function (rows) { tep = {}; rows.forEach(napTep); }
        });
        var bang = crud.z('table');

        /* Báo cáo theo mẫu phân quyền (getList_MauImport "zonebtnBaoCao_DeTai") — đứng trước "Tải file" */
        var acts = crud.z('actions');
        if (acts) {
            acts.insertAdjacentHTML('afterbegin', '<span data-dt="bc"></span>');
            ums.report.mount(acts.querySelector('[data-dt="bc"]'), { import: false, collect: function (add) {
                var fv = crud.filterValues();
                add('iTinhTrang', -1); add('iTrangThai', -1); add('strCanBoNhapDeTai_Id', ''); add('strThanhVien_Id', e(fv.thanhVien));
                add('strTuKhoaText', e(fv.q)); add('dTuKhoaNumber', -1); add('strNCKH_DeCuong_Id', ''); add('strCapQuanLy_Id', e(fv.capQL));
                add('strLinhVucNghienCuu_Id', e(fv.linhVuc)); add('strNguonKinhPhi_Id', ''); add('strThietKeNghienCuu_Id', '');
                add('strNCKH_ThanhVien_Id', e(fv.thanhVien)); add('strDonVi_Id_CuaThanhVien_Id', e(fv.donVi)); add('strDaoTao_CoCauToChuc_Id', e(fv.donVi));
                add('strLoaiChucDanh_Id', ''); add('strLoaiHocVi_Id', ''); add('strTinhTrang_Id', ''); add('strPhanLoaiDeTai_Id', e(fv.loai));
                add('strTinhTrangXacNhan_Id', e(fv.tt)); add('strNhanSu_TDKT_KeHoach_Id', e(fv.nam));
            } });
        }

        /* Ô Tình trạng: các mục xác nhận theo người dùng */
        var oTT = crud.root.querySelector('[data-scope="filter"][data-k="tt"]');
        xnP.then(function () { if (oTT) pat.fill(oTT, dsXN, { head: 'Tất cả tình trạng' }); });
        D.ganDonVi(crud, 'donVi', 'thanhVien', { khoa: true });
        Promise.all([crud.sourcesReady, xnP]).then(function () { crud.load(1); });

        /* ---------- Cột "File đính kèm": tệp của đề tài + tệp của từng quyết định (như gốc) ---------- */
        function veTep(id) {
            var h = bang.querySelector('[data-dt-tep="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
            if (!h) return;
            h.innerHTML = (tep[id] || []).map(function (x) {
                return '<a class="ums-link" href="' + esc(ums.files.url(x.path)) + '" target="_blank" rel="noopener" title="' + esc(x.ten) + '">' +
                    '<i class="fa-light fa-paperclip"></i> ' + esc(x.ten) + '</a>';
            }).join('<br>');
        }
        function themTep(id, data) {
            var l = tep[id] || (tep[id] = []);
            arr(data).forEach(function (x) {
                if (!x.FILEMINHCHUNG) return;
                l.push({ path: e(x.FILEMINHCHUNG), ten: e(x.TENHIENTHI) || String(x.FILEMINHCHUNG).split('/').pop() });
            });
            veTep(id);
        }
        function napTep(r) {
            var id = e(r.ID);
            tep[id] = [];
            N.g('NCKH_Files/LayDanhSach', { strDuLieu_Id: id, silent: true }).then(function (x) { themTep(id, x.data); }).catch(function () {});
            N.g('NCKH_DeTai_KetQua/LayDanhSach', { strTuKhoa: '', strNCKH_QuanLyDeTai_Id: id, iTinhTrang: -1, strTinhTrang_Id: '', strNguoiThucHien_Id: '',
                pageIndex: 1, pageSize: 10000000, silent: true }).then(function (x) {
                arr(x.data).forEach(function (kq) {
                    N.g('NCKH_Files/LayDanhSach', { strDuLieu_Id: kq.ID, silent: true }).then(function (y) { themTep(id, y.data); }).catch(function () {});
                });
            }).catch(loi('quyết định nghiệm thu'));
        }
        function taiFile() {
            var url = [], tenTep = [];
            crud.rows.forEach(function (r) {
                (tep[e(r.ID)] || []).forEach(function (x) {
                    if (url.indexOf(x.path) >= 0) return;
                    url.push(x.path); tenTep.push(laAnh(x.path) ? '' : x.ten);
                });
            });
            if (!url.length) { ui.toast('Không có tệp nào để tải', 'warn'); return; }
            N.g('NCKH_Files/GopFile', { arrTuKhoa: url, arrDuLieu: tenTep, strNguoiThucHien_Id: uid() }, true).then(function (r) {
                var d = r.data;
                if (d && typeof d === 'string') window.open(ums.files.url(d));
            }).catch(loi('gộp tệp'));
        }

        /* ---------- Xác nhận nhanh trên dòng (btnxacnhan_small) ---------- */
        function luuXN(spId, ttId, noiDung) {
            return N.g('NCKH_SP_XacNhanKeKhai/ThemMoi', { strId: '', strSanPham_Id: spId, strNoiDung: noiDung, strTinhTrang_Id: ttId,
                strNguoiXacnhan_Id: uid() }, true).then(function () { ui.toast('Xác nhận thành công', 'ok'); },
                function (err) { ui.toast('Xác nhận thất bại: ' + err.message, 'warn'); });
        }
        bang.addEventListener('click', function (ev) {
            var mo = ev.target.closest('[data-dt-mo]');
            if (mo) { var r0 = hang(mo.getAttribute('data-dt-mo')); if (r0) moChiTiet(r0); return; }
            var b = ev.target.closest('[data-dt-xn]');
            if (!b) return;
            var r = hang(b.getAttribute('data-id')), x = dsXN.filter(function (d) { return e(d.ID) === b.getAttribute('data-dt-xn'); })[0];
            if (!r || !x) return;
            var dlg = ui.dialog({ title: 'Xác nhận sản phẩm', icon: 'fa-circle-check', size: 'md',
                body: '<p>Xác nhận <b>' + esc(e(x.TEN)) + '</b> cho sản phẩm <b>' + esc(ten(r)) + '</b>!</p>' +
                    ui.field('Mô tả xác nhận', '<input class="ums-input" data-x="mt" placeholder="Mô tả xác nhận" autocomplete="off">'),
                buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function (d) {
                    var mt = d.body.querySelector('[data-x="mt"]').value.trim();
                    luuXN(r.ID, x.ID, mt).then(function () { crud.load(); });
                } }] });
            setTimeout(function () { var i = dlg.body.querySelector('[data-x="mt"]'); if (i) i.focus(); }, 200);
        });
        function hang(id) { return crud.rows.filter(function (r) { return e(r.ID) === e(id); })[0]; }

        /* ---------- Khung kê khai (chỉ xem) ---------- */
        var tra = null;
        function traTen() {
            if (tra) return tra;
            function map(ma) { return ums.api.dm(ma).then(function (d) { var m = {}; arr(d).forEach(function (x) { m[e(x.ID)] = e(x.TEN); }); return m; }, function () { return {}; }); }
            tra = Promise.all([map('NCKH.LVNC'), map('NCKH.PLDT'), map('NCKH.CAQL'), map('NCKH.VTDT')]).then(function (a) {
                return { lv: a[0], pl: a[1], cq: a[2], vt: a[3] };
            });
            return tra;
        }
        zCt.innerHTML =
            '<div class="ums-panel"><div class="ums-panel__head">' +
                '<div class="ums-panel__title"><i class="fa-light fa-pen-to-square"></i> Kê khai đề tài</div>' +
                '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-x': 'dong' } }) +
                    ui.btn('confirm', { text: 'Xác nhận sản phẩm', attr: { 'data-x': 'xacnhan' } }) + '</div></div>' +
            '<div class="ums-panel__body">' +
                '<div class="ums-legend">Thông tin đề tài</div><div data-x="tt"></div>' +
                lg('Sản phẩm khoa học', 'spkh') + lg('Sản phẩm đào tạo', 'spdt') + lg('Sản phẩm ứng dụng', 'spud') +
                lg('Nguồn kinh phí', 'kp') + lg('Đơn vị hợp tác', 'dvht') + lg('Tiến độ đề tài', 'td') +
                '<div class="ums-legend">Nội dung minh chứng</div><div data-x="mc"></div>' +
                    '<div class="ums-field"><label class="ums-field__label">File đính kèm</label><div data-x="tep"></div></div>' +
                lg('Quyết định nghiệm thu', 'kq') + lg('Thành viên tham gia', 'tv') +
            '</div></div>';
        function X(k) { return zCt.querySelector('[data-x="' + k + '"]'); }
        var tepDT = ums.files.mount(X('tep'), { api: 'NCKH_Files', readonly: true });
        X('dong').addEventListener('click', function () { dang = null; ui.swap(zCt, zDs); });
        X('xacnhan').addEventListener('click', function () { if (dang) hopXacNhan(dang); });

        function bangCon(k, p, cot, empty, sau) {
            X(k).innerHTML = DANG_TAI;
            var r0 = dang;
            return N.g(p.action, p).then(function (r) {
                if (dang !== r0) return;
                var rows = arr(r.data);
                if (p.loc) rows = rows.filter(p.loc);
                ui.table({ el: X(k), rows: rows, stt: true, empty: empty || 'Không có dữ liệu', columns: cot });
                if (sau) sau(rows);
            }).catch(function (err) { X(k).innerHTML = ui.fail(err.message); });
        }
        function moChiTiet(r) {
            dang = r;
            ['tt', 'mc'].forEach(function (k) { X(k).innerHTML = DANG_TAI; });
            tepDT.load(r.ID);
            ui.swap(zDs, zCt);
            traTen().then(function (T) {
                if (dang !== r) return;
                X('tt').innerHTML = '<div class="ums-grid ums-grid--2">' +
                    '<div style="grid-column:1 / -1">' + kv('Tên đề tài tiếng việt', ten(r)) + '</div>' +
                    kv('Tên đề tài tiếng anh', e(r.TENDETAITIENGANH)) + kv('Mã đề tài', e(r.MADETAI)) +
                    kv('Tổ chức có đề tài', e(r.DONVITOCHUCCODETAI)) + kv('Lĩnh vực', T.lv[e(r.LINHVUCNGHIENCUU_ID)] || e(r.LINHVUCNGHIENCUU_TEN)) +
                    kv('Tổng số tác giả', e(r.SOTACGIA_N)) + kv('Loại đề tài', T.pl[e(r.PHANLOAIDETAI_ID)] || e(r.PHANLOAIDETAI_TEN)) +
                    kv('Cấp quản lý', T.cq[e(r.CAPQUANLY_ID)] || e(r.CAPQUANLY_TEN)) + '<div></div>' +
                    kv('Thời gian từ', e(r.THOIGIANBATDAU)) + kv('Đến', e(r.THOIGIANKETTHUC)) +
                    '<div style="grid-column:1 / -1">' + kv('Sản phẩm khác', e(r.SANPHAMKHAC)) + kv('Mục tiêu', e(r.MUCTIEU)) + '</div></div>';
                X('mc').innerHTML = kv('Nội dung', e(r.THONGTINMINHCHUNG));
                var sp = { action: 'NCKH_DeTai_SanPham/LayDanhSach', method: 'GET', strLoaiSanPham: '', strThanhVien_Id: '', strNCKH_QuanLyDeTai_Id: r.ID };
                bangCon('spkh', Object.assign({ loc: function (x) { return e(x.LOAI) !== 'NCKH_SP_QUANLYDETAISINHVIEN'; } }, sp),
                    [{ title: 'Tên', prop: 'TENSANPHAM' }], 'Chưa có sản phẩm');
                bangCon('spdt', Object.assign({ loc: function (x) { return e(x.LOAI) === 'NCKH_SP_QUANLYDETAISINHVIEN'; } }, sp),
                    [{ title: 'Tên', prop: 'TENSANPHAM' }], 'Chưa có sản phẩm');
                bangCon('spud', { action: 'NCKH_SP_DeTai/LayDanhSach', method: 'GET', strTuKhoa: '', strNCKH_QuanLyDeTai_Id: r.ID, strLoaiSanPham_Id: '',
                    pageIndex: 1, pageSize: 10000 }, [{ title: 'Loại', prop: 'LOAISANPHAM_TEN' }, { title: 'Tên', prop: 'TENSANPHAM' }, { title: 'Mô tả', prop: 'MOTA' }]);
                bangCon('kp', { action: 'NCKH_SP_NguonKinhPhi/LayDanhSach', method: 'GET', strSanPham_Id: r.ID, pageIndex: 1, pageSize: 10000 },
                    [{ title: 'Tên nguồn', prop: 'NGUONKINHPHI_TEN' }, { title: 'Số tiền', cls: 'is-right', render: function (x) { return ui.money(x.SOTIEN); } },
                        { title: 'Đơn vị', prop: 'DONVITINH_TEN' }]);
                bangCon('dvht', { action: 'NCKH_DeTai_DoiTac/LayDanhSach', method: 'GET', strTuKhoa: '', strNCKH_QuanLyDeTai_Id: r.ID, strQuocTich_Id: '',
                    strDoiTac: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 }, [{ title: 'Đơn vị', prop: 'DOITAC' }, { title: 'Quốc gia', prop: 'QUOCTICH_TEN' }]);
                bangCon('td', { action: 'NCKH_DeTai_TienDo/LayDanhSach', method: 'GET', strTuKhoa: '', strNCKH_QuanLyDeTai_Id: r.ID, strNguoiThucHien_Id: '',
                    pageIndex: 1, pageSize: 10000 }, [{ title: 'Thời gian', prop: 'THOIGIAN' },
                        { title: 'Tiền thanh toán', cls: 'is-right', render: function (x) { return ui.money(x.SOTIENTHANHTOAN); } },
                        { title: 'Tiền còn lại', cls: 'is-right', render: function (x) { return ui.money(x.SOTIENCONLAI); } }]);
                bangCon('kq', { action: 'NCKH_DeTai_KetQua/LayDanhSach', method: 'GET', strTuKhoa: '', strNCKH_QuanLyDeTai_Id: r.ID, iTinhTrang: -1,
                    strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000000 }, [
                    { title: 'Số quyết định', prop: 'SOQUYETDINH', cls: 'is-center', width: '150px' }, { title: 'Ngày', prop: 'NGAY', cls: 'is-center', width: '60px' },
                    { title: 'Tháng', prop: 'THANG', cls: 'is-center', width: '70px' }, { title: 'Năm', prop: 'NAM', cls: 'is-center', width: '80px' },
                    { title: 'Tình trạng', prop: 'TINHTRANG_TEN', cls: 'is-center', width: '150px' }, { title: 'Mô tả', prop: 'MOTA' },
                    { title: 'File đính kèm', render: function (x) { return '<div data-kqtep="' + esc(x.ID) + '"></div>'; } }], 'Chưa có quyết định',
                    function (rows) {
                        rows.forEach(function (x) {
                            var h = X('kq').querySelector('[data-kqtep="' + (window.CSS && CSS.escape ? CSS.escape(e(x.ID)) : x.ID) + '"]');
                            if (h) ums.files.mount(h, { api: 'NCKH_Files', readonly: true }).load(x.ID);
                        });
                    });
                bangCon('tv', { action: 'NCKH_ThanhVien/LayDanhSach', method: 'GET', strSanPham_Id: r.ID, pageIndex: 1, pageSize: 100 }, [
                    { title: 'Hình ảnh', cls: 'is-center', width: '80px', render: function (x) { return pat.anhNguoi(e(x.ANH)); } },
                    { title: 'Họ tên', render: function (x) { return esc(e(x.HOTEN) + (e(x.MACANBO) ? ' - ' + e(x.MACANBO) : '')); } },
                    { title: 'Vai trò', render: function (x) { return esc(T.vt[e(x.VAITRO_ID)] || e(x.VAITRO_TEN)); } }], 'Chưa có thành viên');
            });
        }

        /* ---------- Hộp "Xác nhận sản phẩm" (modal_XacNhan) ---------- */
        function hopXacNhan(r) {
            var dlg = ui.dialog({ title: 'Xác nhận sản phẩm: ' + ten(r), icon: 'fa-circle-check', size: 'lg', body:
                ui.field('Nội dung xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="cc-xn" data-x="nut"></div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls"></div>' });
            function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
            var ds = nutXN();
            q('nut').innerHTML = ds.length ? ds.map(function (x) {
                return '<button type="button" class="cc-xn__nut" data-hd="' + esc(e(x.ID)) + '"><i class="' + esc(bieuTuong(x)) + '"' +
                    (x.THONGTIN2 ? ' style="' + esc(x.THONGTIN2) + '"' : '') + '></i><span>' + esc(e(x.TEN)) + '</span></button>';
            }).join('') : ui.empty('Chưa có quyền xác nhận nào cho chức năng này');
            q('ls').innerHTML = DANG_TAI;
            N.g('NCKH_SP_XacNhanKeKhai/LayDanhSach', { strTuKhoa: '', strSanPham_Id: r.ID, strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (x) {
                    ui.table({ el: q('ls'), rows: arr(x.data), stt: true, empty: 'Chưa có lịch sử xác nhận', columns: [
                        { title: 'Xác nhận', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                        { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                        { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '100px' }] });
                }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
            dlg.body.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-hd]');
                if (!b) return;
                var nd = q('nd').value.trim();
                dlg.close();
                luuXN(r.ID, b.getAttribute('data-hd'), nd).then(function () { dang = null; ui.swap(zCt, zDs); crud.load(); });
            });
        }
        return crud;
    }

    /* =====================================================================
       Vào màn
       ===================================================================== */
    D.man = function (root, o) {
        if (D.traLai) D.traLai();
        if (!root) return null;
        o = o || {};
        if (o.xacNhan) return xacNhan(root);
        if (!D.cfgCCB) {
            root.innerHTML = ui.fail('Không nạp được khối dùng chung của bản Cổng cán bộ (ApisCongCanBo/Modules/sanphamkhoahoc/script/detai.js).');
            return null;
        }
        return quanTri(root);
    };
})();
