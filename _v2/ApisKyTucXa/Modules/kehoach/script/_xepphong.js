/* =========================================================================
   Xếp phòng theo đăng ký — KHUNG CHUNG cho hai màn chép nhau 92% (ums.ktxXP)
   Bản gốc: ApisKyTucXa/Modules/kehoach/html/xepphongdangky.html + script/xepphongdangky.js (1.672 dòng)
            ApisKyTucXa/Modules/xacnhandangkyphong/html/xacnhandangkyphong.html + script/xacnhandangkyphong.js (1.662 dòng)
   ---------------------------------------------------------------------------
   ums.ktxXP.dung(root, { xacNhan: false | true, title, tieuDeTim, tieuDeNguoiO })
       xacNhan = false  → màn "Xếp phòng đăng ký": người ở ĐÃ xếp (KTX_DaXepPhong), nút Thêm người ở / Rời phòng, Import
       xacNhan = true   → màn "Xác nhận đăng ký phòng": người ĐĂNG KÝ chờ (KTX_DangKyPhong), nút Xác nhận (xoá đăng ký → xếp vào phòng);
                          không Thêm, không Import; thẻ toà / tầng / phòng không in số chỗ trống, không giới tính / bao phòng.

   Bố cục bản gốc: MỘT cột, ba vùng thay chỗ nhau (toggle_overide):
     (A) "Tìm phòng": ô Loại phòng · Tính chất · Loại đối tượng · từ khoá + Tìm kiếm (+ Import, chỉ xếp phòng) rồi khung
         "Vui lòng tìm phòng cần (xác nhận) đăng ký" = thẻ từng toà nhà (số phòng, còn trống, chỗ trống — bấm "Xem phòng")
         + thẻ tổng ("Xem tất cả phòng").
     (B) "Danh sách phòng (N)": từng tầng một hàng (Tầng f — Trống X chỗ · Y phòng), mỗi phòng một ô (toà - phòng, giới tính n/max,
         đơn giá/tháng; đỏ = đầy, cam = đã bao) — bấm ô phòng → (C). Đóng → (A).
     (C) HAI cột: trái = thẻ thông tin phòng (vòng tỉ lệ người đang ở + 12 dòng số liệu); phải = "Danh sách người ở / người đăng ký"
         (thẻ ảnh + Mã, Tên, Ngày sinh, Ngày vào, Ngày ra, Điện thoại; nút Rời phòng | Xác nhận · Sửa hồ sơ · Tạo hợp đồng) thay chỗ
         bởi: chọn người ở (modal_sinhvien gốc), Chỉnh sửa hồ sơ (biểu mẫu 3 nhóm), Tạo hợp đồng (4 nhóm). Đóng → (A).
   Ở đây: (A) pat.panel + ô lọc, thẻ toà = ui.tile trong lưới tiles; (B) ui.tile theo tầng (ums-legend); (C) pat.master (trái = .ums-kv,
   phải = bảng ums.ui.table sát mép); Sửa hồ sơ / Tạo hợp đồng = pat.formTrang thay chỗ khung phải (BO-CUC luật 1); chọn người ở = ui.dialog
   (việc phụ: chọn). Biểu mẫu hồ sơ dùng lại ums.ktxHoSo.fieldsNO / veTruong / saveNO (_hoso.js); toà / phòng dùng ums.ktx (_ktx.js).

   Lời gọi (kiểu cũ, không mã hoá, tham số chép nguyên văn):
       KTX_ToaNha/LayDanhSach         GET  strTuKhoa "", strLoaiToaNha_Id "", strViTriCauThang_Id "", strPhanLoaiDoiTuong_Id (ô lọc), strTangThu_Id "",
                                           strLoaiPhong_Id (ô lọc), strTinhChat_Id (ô lọc), strTinhTrang_Id "", strNguoiThucHien_Id "", pageIndex 1, pageSize 100000
                                           → ID, TEN, SOTANG, TONGSOPHONG, SOPHONGTRONG, TONGSOCHOTRONG
       KTX_Phong/LayDanhSach          GET  (ums.ktx.phong) theo toà: strKTX_ToaNha_Id; "Xem tất cả phòng": strTuKhoa, strPhanLoaiDoiTuong_Id, strLoaiPhong_Id,
                                           strTinhChat_Id, pageSize 1000000000 → TANGTHU_TEN, TINHCHAT_TEN, SONGUOIDANGOPHONG, SOSINHVIENTOIDA, BAOPHONG, DONGIAPHONGTUNGNGUOI
       KTX_Phong/LayChiTiet           GET  strId → KTX_TOANHA_TEN, TEN, TINHCHAT_TEN, TINHCHAT_MA, SONGUOIDANGOPHONG, SOSINHVIENTOIDA, CHISODIENCUOICUNG,
                                           NGAYCHISODIENCUOICUNG, CHISONUOCCUOICUNG, NGAYCHISONUOCCUOICUNG, LOAIPHONG_TEN, DIENTICHSUDUNG, TANGTHU_TEN, SOGIUONG,
                                           TINHTRANG_TEN, BAOPHONG, DONGIACAPHONG, DONGIATUNGNGUOI
       KTX_DaXepPhong/LayDanhSach     GET  [xếp phòng] strTuKhoa "", strKTX_DangKy_Id "", strKTX_Phong_Id, strKTX_DoiTuongOKyTucXa_Id "", strKTX_HopDong_Id "",
                                           strNguoiThucHien_Id "", dDaLapHopDong "-1", strTinhTrangHopDong_Id "", pageIndex 1, pageSize 10000
       KTX_DangKyPhong/LayDanhSach    GET  [xác nhận] strTuKhoa "", strKTX_KeHoachDangKy_Id "", strKTX_Phong_Id, strKTX_DoiTuongOKyTucXa_Id "", strNguoiThucHien_Id "",
                                           pageIndex 1, pageSize 10000 → ID, KTX_DOITUONGOKYTUCXA_ID/_HODEM/_TEN/_MASO/_DIENTHOAI, NGUOITHUCHIEN_ID/_TENDAYDU, KTX_HOPDONG_ID
       KTX_DaXepPhong/ThemMoi         POST (ums.ktxHoSo.xepPhong) strId "", strKTX_KeHoachDangKy_Id "", strKTX_Phong_Id, strKTX_DoiTuongOKyTucXa_Id, strNgayVao, strNgayRa,
                                           strKTX_DangKy_Id "", strKTX_HopDong_Id "", strMoTa "" (strChucNang_Id / strNguoiThucHien_Id hệ tự chèn)
       KTX_DaXepPhong/Xoa             POST [xếp phòng — Rời phòng] strIds        KTX_DangKyPhong/Xoa  POST [xác nhận] strIds (rồi KTX_DaXepPhong/ThemMoi, ngày vào = hôm nay)
       KTX_NguoiHocOKTX/LayDanhSach   GET  hộp chọn người ở (edu.extend.getList_NguoiO gốc, 19 tham số) → ID, MASO, HODEM, TEN, NGAYSINH/THANGSINH/NAMSINH,
                                           GIOITINH_TEN, GIOITINH_MA, TRANGTHAINGUOIHOC_TEN, ANH
       KTX_DoiTuongOKyTucXa/LayChiTiet GET strId · KTX_DoiTuongOKyTucXa/CapNhat POST (tham số như CapNhat_NO gốc — ảnh gửi khoá strAnh)
       TC_KhoanThu/LayDanhSach        GET  strTuKhoa "", strNhomCacKhoanThu_Id "", strNguoiThucHien_Id "", strcanboquanly_id "" → lọc NHOMCACKHOANTHU_MA "KTX" (chính sách)
                                           / "MienGiamKTX" (miễn giảm); MA "KTXMG.TIENPHONG" → strTaiChinh_CacKhoanThu_Id
       KTX_HopDong/ThemMoi            POST strId "", strSoHopDong, strNgayKyHopDong, strNgayKetThucHopDong, strTinhTrang_Id (= ID mục MA "1" của KTX.TTHD), strKTX_Phong_Id,
                                           strKTX_DoiTuongOKyTucXa_Id, strNgayVao, strNgayRa, dSoThang, dTongTienThue, dGiaThue_Thang, dSoChoThue, dBaoPhong,
                                           strTaiChinh_CacKhoanThu_Id, strHopDong_MG_PhanTrams, strHopDong_MG_KhoanThu_Ids, strHopDong_MG_HinhThuc_Ids,
                                           strHopDong_CS_SoLuongs, strHopDong_CS_KhoanThu_Ids, strHopDong_CS_HinhThuc_Ids (mảng nối bằng "#") → raw.Id
       KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi GET strKTX_DoiTuongOKyTucXa_Id, strKTX_Phong_Id, dSoThang → Data[0].TONGTIEN
       In: ums.report.run('HopDongSinhVien' | 'HopDongLuuHocSinh', { strHopDong_Id, strSoTienBangChu })
   Danh mục: KTX.LP00 (loại phòng), KTX.TCP0 (tính chất), KTX_PHANLOAIDOITUONG, KTX.TTHD, KTX.DVT0 (hình thức thu), NS.GITI; biểu mẫu hồ sơ: xem _hoso.js.

   Giữ như gốc: Ngày vào / Ngày ra của hộp chọn người ở nhớ ở localStorage (KTX_txtNgayVao / KTX_txtNgayRa); cảnh báo phòng đầy / giới tính
     không khớp (GIOITINH_MA người ≠ TINHCHAT_MA phòng) chỉ nhắc, không chặn; Xác nhận = KTX_DangKyPhong/Xoa rồi KTX_DaXepPhong/ThemMoi
     (thứ tự gốc); lưu hợp đồng xong giấu Lưu, hiện hai nút In; Ngày ký / Ngày kết thúc rời ô → chép sang Ngày vào / Ngày ra;
     Đóng ở (B) và (C) đều về (A).
   Khác gốc (lỗi rõ ràng, làm theo ý định — ghi lại):
     · [xác nhận] KTX_DangKyPhong/LayDanhSach gốc gửi strKTX_Phong_Id RỖNG → phòng nào cũng hiện mọi đăng ký; ở đây gửi phòng đang mở.
     · [xác nhận] thẻ người: gốc in "Mã" = NGUOITHUCHIEN_ID, "Tên" = NGUOITHUCHIEN_TENDAYDU (chép nhầm cột); ở đây Mã / Họ tên của người
       đăng ký (KTX_DOITUONGOKYTUCXA_*) + cột "Người thực hiện" = NGUOITHUCHIEN_TENDAYDU.
     · [xác nhận] "Số SV chờ xếp phòng: 130" là số CỨNG gắn nhầm biến → bỏ; thẻ tổng chỉ còn Tổng số tòa nhà / phòng (hai dòng gốc còn giữ).
     · Nút "Tính tiền": gốc gắn handler cho #btnXepPhongDangKy_TinhTien KHÔNG có (nút thật là #btnDangKy_TinhTien) → ở đây nút chạy
       KTX_TinhTienPhongTheoNguoi và đổ Tổng tiền thuê.
     · TC_KhoanThu/LayDanhSach gốc lấy pageSize_default (10 dòng đầu) rồi mới lọc nhóm → thiếu khoản thu; ở đây pageSize 100000.
     · Tầng: gốc so TANGTHU_TEN == f (số); ở đây lấy phần số của TANGTHU_TEN ("Tầng 2" / "2"), phòng không có tầng gom cuối "Chưa xếp tầng";
       "Trống Y phòng" đếm phòng còn chỗ (gốc đếm cả phòng đầy vì so >= 0).
     · loadHopDong của màn xác nhận đọc main_doc.ChuaCoHopDong (không có → lỗi) → ở đây cùng cách lấy KTX.TTHD như màn xếp phòng.
     · Thẻ người → bảng (cùng dữ liệu, cùng nút); ô Ngày vào bắt buộc kiểm trước khi gọi (gốc kiểm sau khi bấm Đồng ý).
   Cố ý bỏ: ô "Nhập mã phòng cần đổi" (txtSearch_KhoiTao_TuKhoa, JS không đọc); hover ô phòng đổi chữ "Đăng ký" (chỉ hiệu ứng); zoneBox_ThongTinDangKy,
     viewForm_DangKy, confirm_Register / confirm_Cancel, removeHTMLoff_tblSinhVien, btnSelectDT / edu.extend.save_DTDT (chọn từ đào tạo — tiện ích
     của systemextend, không thuộc màn), btnDelete / delete_SinhVien (không có hàm); dòng miễn giảm tĩnh txtMG_* / dropMG_HinhThucMienGiam (JS không lưu);
     ô Tình trạng hợp đồng (chú thích trong HTML); 27 id JS gọi mà HTML không có; jquery.knob (vòng tỉ lệ → ui.meter).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, K = ums.ktx, X = ums.ktxHoSo;
    var XP = ums.ktxXP = {};

    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function rows(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function so(v) { var n = Number(v); return isNaN(n) ? 0 : n; }
    function loi(viec) { return function (err) { ums.api.handle(err, viec); }; }
    function hoTen(r) { return (e(r.KTX_DOITUONGOKYTUCXA_HODEM) + ' ' + e(r.KTX_DOITUONGOKYTUCXA_TEN)).trim(); }
    function tang(r) { var m = e(r.TANGTHU_TEN).match(/\d+/); return m ? Number(m[0]) : 0; }
    function homNay() {
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
    }
    function nho(k, v) { try { if (v === undefined) return localStorage.getItem(k) || ''; localStorage.setItem(k, v); } catch (x) { } return ''; }
    function kv(label, k) { return '<div class="ums-kv"><span>' + esc(label) + '</span><b data-k="' + k + '"></b></div>'; }
    function sel(k, ph, opts) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '">' +
            (opts || '<option value="">' + esc(ph) + '</option>') + '</select></div>';
    }

    XP.dung = function (root, o) {
        o = o || {};
        var xacNhan = !!o.xacNhan, conTrong = !xacNhan;
        var st = { toa: [], phong: [], phongId: '', chiTiet: null, ds: [], full: true, tinhChatMa: '', ttHD: '',
            khoanThu: [], mienGiam: [], hinhThuc: [], khoanThuTienPhongId: '', ft: null, dlg: null };

        root.innerHTML = pat.page(o.title || (xacNhan ? 'Xác nhận đăng ký phòng' : 'Xếp phòng đăng ký')) +
            '<div data-z="A"></div><div data-z="B" hidden></div><div data-z="C" hidden></div>';
        var zA = root.querySelector('[data-z="A"]'), zB = root.querySelector('[data-z="B"]'), zC = root.querySelector('[data-z="C"]');
        function hien(z) {
            dongForm();
            [zA, zB, zC].forEach(function (x) { x.hidden = x !== z; });
            if (z === zA && window.ums && ums.scroll && ums.scroll.refresh) ums.scroll.refresh();
        }
        function dongForm() { if (st.ft && !st.ft.closed) st.ft.close(); st.ft = null; }

        /* ================= (A) Tìm phòng + thẻ toà nhà ================= */
        zA.innerHTML = pat.panel({ title: 'Tìm phòng', icon: 'fa-door-open', cls: 'ums-u-mb-4',
            body: '<div class="ums-filter">' +
                sel('loai', '--Chọn loại phòng--') + sel('tinhchat', '--Chọn tính chất--') + sel('loaidt', 'Chọn loại đối tượng') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                (xacNhan ? '' : '<div class="ums-field ums-field--fit" data-z="import"></div>') +
                '</div>' }) +
            pat.panel({ title: o.tieuDeTim || (xacNhan ? 'Vui lòng tìm phòng cần xác nhận đăng ký' : 'Vui lòng tìm phòng cần đăng ký'),
                icon: 'fa-building', zone: 'boxToa', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
        var F = {};
        ['loai', 'tinhchat', 'loaidt', 'q'].forEach(function (k) { F[k] = zA.querySelector('[data-f="' + k + '"]'); });
        ui.enhance(zA);
        ums.api.dm('KTX.LP00').then(function (rs) { pat.fill(F.loai, rs, { head: '--Chọn loại phòng--' }); }, loi('loại phòng'));
        ums.api.dm('KTX.TCP0').then(function (rs) { pat.fill(F.tinhchat, rs, { head: '--Chọn tính chất--' }); }, loi('tính chất phòng'));
        ums.api.dm('KTX_PHANLOAIDOITUONG').then(function (rs) { pat.fill(F.loaidt, rs, { head: pat.dmTitle(rs) || 'Chọn loại đối tượng' }); }, loi('loại đối tượng'));
        ums.api.dm('KTX.TTHD').then(function (rs) {
            var r = rs.filter(function (x) { return String(x.MA) === '1'; })[0];
            st.ttHD = r ? r.ID : '';
        }, function () { });
        if (!xacNhan && ums.report && ums.report.mount) ums.report.mount(zA.querySelector('[data-z="import"]'), { importText: 'Import' });

        var boxToa = zA.querySelector('[data-z="boxToa"]');
        function taiToa() {
            boxToa.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({ action: 'KTX_ToaNha/LayDanhSach', method: 'GET',
                strTuKhoa: '', strLoaiToaNha_Id: '', strViTriCauThang_Id: '', strPhanLoaiDoiTuong_Id: pat.val(F.loaidt), strTangThu_Id: '',
                strLoaiPhong_Id: pat.val(F.loai), strTinhChat_Id: pat.val(F.tinhchat), strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) { st.toa = rows(r).filter(function (t) { return e(t.ID) !== ''; }); veToa(); })
              .catch(function (err) { boxToa.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách tòa nhà'); });
        }
        function veToa() {
            var tongPhong = 0, tongTrong = 0, tongCho = 0;
            var h = st.toa.map(function (t) {
                tongPhong += so(t.TONGSOPHONG); tongTrong += so(t.SOPHONGTRONG); tongCho += so(t.TONGSOCHOTRONG);
                return '<div data-toa="' + esc(t.ID) + '">' + ui.tile({ icon: 'fa-light fa-building', tone: 'slate', name: e(t.TEN),
                    group: 'Số phòng: ' + so(t.TONGSOPHONG) + (conTrong ? ' · Còn trống: ' + so(t.SOPHONGTRONG) + ' phòng · ' + so(t.TONGSOCHOTRONG) + ' chỗ' : '') + ' — Xem phòng' }) + '</div>';
            }).join('');
            var tong = '<div data-toa="*">' + ui.tile({ icon: 'fa-light fa-city', tone: 'blue', name: 'Tổng số tòa nhà: ' + st.toa.length + ' · Tổng số phòng: ' + tongPhong,
                group: (conTrong ? 'Tổng số phòng còn trống: ' + tongTrong + ' · Tổng số chỗ trống: ' + tongCho + ' — ' : '') + 'Xem tất cả phòng' }) + '</div>';
            boxToa.innerHTML = '<div class="ums-grid ums-grid--tiles">' + tong + h + '</div>';
        }
        zA.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a="search"], [data-toa]');
            if (!b || !zA.contains(b)) return;
            ev.preventDefault();
            if (b.getAttribute('data-a') === 'search') { taiToa(); return; }
            var id = b.getAttribute('data-toa');
            if (id === '*') { timPhong(); return; }
            var t = st.toa.filter(function (x) { return e(x.ID) === id; })[0];
            if (t) moPhongToa(t);
        });
        F.q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); timPhong(); } });

        /* ================= (B) Danh sách phòng theo tầng ================= */
        zB.innerHTML = pat.panel({ title: 'Danh sách phòng', icon: 'fa-door-open', count: 'tongPhong', zone: 'dsPhong',
            tools: ui.btn('close', { attr: { 'data-a': 'dongPhong' } }), body: '' });
        var dsPhong = zB.querySelector('[data-z="dsPhong"]'), tongPhong = zB.querySelector('[data-z="tongPhong"]');
        function moPhongToa(t) {
            hien(zB); dsPhong.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            K.phong({ strKTX_ToaNha_Id: t.ID }).then(function (kq) { st.phong = kq.rows; vePhong(so(t.SOTANG), kq.rows, kq.total); })
                .catch(function (err) { dsPhong.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phòng'); });
        }
        function timPhong() {
            hien(zB); dsPhong.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            K.phong({ strTuKhoa: (F.q.value || '').trim(), strPhanLoaiDoiTuong_Id: pat.val(F.loaidt), strLoaiPhong_Id: pat.val(F.loai),
                strTinhChat_Id: pat.val(F.tinhchat), pageSize: 1000000000 }).then(function (kq) {
                st.phong = kq.rows;
                var max = 0; kq.rows.forEach(function (p) { max = Math.max(max, tang(p)); });
                vePhong(max, kq.rows, kq.rows.length);
            }).catch(function (err) { dsPhong.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tìm phòng'); });
        }
        function oPhong(p) {
            var dang = so(p.SONGUOIDANGOPHONG), max = so(p.SOSINHVIENTOIDA), day = dang >= max, bao = conTrong && String(p.BAOPHONG) === '1';
            var tc = e(p.TINHCHAT_TEN), icon = tc === 'Nam' ? 'fa-light fa-person' : (tc === 'Nữ' ? 'fa-light fa-person-dress' : 'fa-light fa-people-group');
            return '<div data-phong="' + esc(p.ID) + '">' + ui.tile({ icon: icon, tone: bao ? 'amber' : (day ? 'red' : 'green'),
                name: e(p.KTX_TOANHA_TEN) + ' - ' + e(p.TEN),
                group: (conTrong && (tc === 'Nam' || tc === 'Nữ') ? tc + ' ' : '') + dang + '/' + max + (bao ? '; Đã bao' : '') + ' · ' + ui.money(so(p.DONGIAPHONGTUNGNGUOI)) + '/Tháng' }) + '</div>';
        }
        function vePhong(soTang, ds, tong) {
            tongPhong.textContent = '(' + so(tong) + ')';
            if (!ds.length) { dsPhong.innerHTML = ui.empty('Không có phòng nào'); return; }
            var h = '', khac = ds.filter(function (p) { return tang(p) < 1; });
            for (var f = 1; f <= soTang; f++) {
                var ps = ds.filter(function (p) { return tang(p) === f; });
                var cho = 0, trong = 0;
                ps.forEach(function (p) { var c = so(p.SOSINHVIENTOIDA) - so(p.SONGUOIDANGOPHONG); if (c > 0) { cho += c; trong++; } });
                h += '<div class="ums-legend' + (h ? ' ums-legend--cach' : '') + '">Tầng ' + f + (conTrong ? ' — Trống ' + cho + ' chỗ · ' + trong + ' phòng' : '') + '</div>' +
                    (ps.length ? '<div class="ums-grid ums-grid--tiles">' + ps.map(oPhong).join('') + '</div>' : '<div class="ums-u-muted ums-u-fz13">Không có phòng</div>');
            }
            if (khac.length) h += '<div class="ums-legend' + (h ? ' ums-legend--cach' : '') + '">Chưa xếp tầng</div><div class="ums-grid ums-grid--tiles">' + khac.map(oPhong).join('') + '</div>';
            dsPhong.innerHTML = h;
        }
        zB.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a="dongPhong"], [data-phong]');
            if (!b || !zB.contains(b)) return;
            ev.preventDefault();
            if (b.getAttribute('data-a') === 'dongPhong') { hien(zA); return; }
            chonPhong(b.getAttribute('data-phong'));
        });

        /* ================= (C) Phòng đang chọn + người ở ================= */
        var m = pat.master({ el: zC, side: { title: 'Thông tin phòng', icon: 'fa-door-open', search: false }, main: { title: false } });
        var side = m.sideBody, mainWrap = m.mainBody;
        mainWrap.innerHTML = pat.panel({ title: o.tieuDeNguoiO || (xacNhan ? 'Danh sách người đăng ký' : 'Danh sách người ở'), icon: 'fa-address-card',
            flush: true, zone: 'dsNguoiO', count: 'soNguoiO',
            tools: ui.btn('close', { attr: { 'data-a': 'dongNguoiO' } }) + (xacNhan ? '' : ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'themNguoiO' } })) });
        var dsNguoiO = mainWrap.querySelector('[data-z="dsNguoiO"]'), soNguoiO = mainWrap.querySelector('[data-z="soNguoiO"]');

        function chonPhong(id) {
            if (!id) return;
            st.phongId = id;
            hien(zC);
            side.innerHTML = '<div class="ums-panel__dem">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>';
            dsNguoiO.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            taiChiTiet();
        }
        function taiChiTiet() {
            return ums.api.call({ action: 'KTX_Phong/LayChiTiet', method: 'GET', strId: st.phongId }).then(function (r) {
                var d = rows(r)[0];
                if (!d) { side.innerHTML = '<div class="ums-panel__dem">' + ui.empty('Không đọc được phòng') + '</div>'; return; }
                st.chiTiet = d; st.tinhChatMa = e(d.TINHCHAT_MA);
                var dang = so(d.SONGUOIDANGOPHONG), max = so(d.SOSINHVIENTOIDA);
                st.full = !(dang < max);
                side.innerHTML = '<div class="ums-panel__dem">' +
                    '<div class="ums-u-bold ums-u-navy">Phòng: ' + esc(e(d.KTX_TOANHA_TEN) + ' - ' + e(d.TEN)) + '</div>' +
                    '<div class="ums-u-muted ums-u-fz13 ums-u-mb-2">Tính chất: ' + esc(e(d.TINHCHAT_TEN)) + '</div>' +
                    ui.meter(dang, max, dang + '/' + max) +
                    '<div class="ums-u-mt-3">' +
                    kv('Tòa nhà', 'KTX_TOANHA_TEN') + kv('Số người đang ở', 'SONGUOI') +
                    kv('Số điện ' + e(d.NGAYCHISODIENCUOICUNG), 'CHISODIENCUOICUNG') + kv('Số nước ' + e(d.NGAYCHISONUOCCUOICUNG), 'CHISONUOCCUOICUNG') +
                    kv('Loại', 'LOAIPHONG_TEN') + kv('Diện tích sử dụng', 'DIENTICHSUDUNG') + kv('Tầng thứ', 'TANGTHU_TEN') + kv('Số giường', 'SOGIUONG') +
                    kv('Tình trạng', 'TINHTRANG_TEN') + kv('Bao phòng', 'BAOPHONG') + kv('Đơn giá cả phòng', 'DONGIACAPHONG') + kv('Đơn giá phòng từng người', 'DONGIATUNGNGUOI') +
                    '</div></div>';
                Array.prototype.forEach.call(side.querySelectorAll('[data-k]'), function (b) {
                    var k = b.getAttribute('data-k');
                    b.textContent = k === 'SONGUOI' ? dang + '/' + max : (/^DONGIA/.test(k) ? (e(d[k]) === '' ? '' : ui.money(d[k])) : (k === 'BAOPHONG' ? (String(d[k]) === '1' ? 'Có' : 'Không') : e(d[k])));
                });
                return taiDS();
            }).catch(function (err) { side.innerHTML = '<div class="ums-panel__dem">' + ui.fail(err.message) + '</div>'; ums.api.handle(err, 'chi tiết phòng'); });
        }
        function goiDS() {
            return xacNhan
                ? { action: 'KTX_DangKyPhong/LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_KeHoachDangKy_Id: '', strKTX_Phong_Id: st.phongId,
                    strKTX_DoiTuongOKyTucXa_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 }
                : { action: 'KTX_DaXepPhong/LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_DangKy_Id: '', strKTX_Phong_Id: st.phongId,
                    strKTX_DoiTuongOKyTucXa_Id: '', strKTX_HopDong_Id: '', strNguoiThucHien_Id: '', dDaLapHopDong: '-1', strTinhTrangHopDong_Id: '',
                    pageIndex: 1, pageSize: 10000 };
        }
        function taiDS() {
            return ums.api.call(goiDS()).then(function (r) { st.ds = rows(r); veDS(); })
                .catch(function (err) { dsNguoiO.innerHTML = ui.fail(err.message); ums.api.handle(err, xacNhan ? 'danh sách người đăng ký' : 'danh sách người ở'); });
        }
        function veDS() {
            soNguoiO.textContent = '(' + st.ds.length + ')';
            var cols = [
                { title: 'Ảnh', cls: 'is-center', width: '56px', render: function (r) { return pat.anhNguoi(r.ANH); } },
                { title: 'Mã', prop: 'KTX_DOITUONGOKYTUCXA_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc(hoTen(r)); } }
            ];
            if (xacNhan) cols.push({ title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TENDAYDU' });
            else cols.push({ title: 'Ngày sinh', prop: 'KTX_DOITUONGOKYTUCXA_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Ngày vào', prop: 'NGAYVAO', cls: 'is-center is-nowrap' }, { title: 'Ngày ra', prop: 'NGAYRA', cls: 'is-center is-nowrap' });
            cols.push({ title: 'Điện thoại', prop: 'KTX_DOITUONGOKYTUCXA_DIENTHOAI', cls: 'is-nowrap' });
            cols.push({ title: 'Thao tác', cls: 'is-actions is-nowrap', render: function (r) {
                var dt = e(r.KTX_DOITUONGOKYTUCXA_ID);
                return (xacNhan
                    ? ui.btn('confirm', { text: 'Xác nhận', cls: 'ums-btn--sm', attr: { 'data-a': 'xacnhan', 'data-id': e(r.ID), 'data-dt': dt } })
                    : ui.btn('del', { text: 'Rời phòng', cls: 'ums-btn--sm', attr: { 'data-a': 'roi', 'data-id': e(r.ID), 'data-ten': hoTen(r) } })) + ' ' +
                    ui.btn('edit', { text: 'Sửa hồ sơ', cls: 'ums-btn--sm', attr: { 'data-a': 'suahoso', 'data-dt': dt, 'data-ten': hoTen(r) } }) +
                    (e(r.KTX_HOPDONG_ID) ? '' : ' ' + ui.btn('add', { text: 'Tạo hợp đồng', cls: 'ums-btn--sm', mod: 'out-primary', attr: { 'data-a': 'hopdong', 'data-dt': dt } }));
            } });
            ui.table({ el: dsNguoiO, columns: cols, rows: st.ds, empty: xacNhan ? 'Phòng chưa có đăng ký nào chờ xác nhận' : 'Phòng chưa có người ở' });
        }
        zC.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zC.contains(b) || b.closest('.ums-formtrang')) return;
            var a = b.getAttribute('data-a'), dt = b.getAttribute('data-dt') || '';
            var r = st.ds.filter(function (x) { return e(x.KTX_DOITUONGOKYTUCXA_ID) === dt; })[0];
            if (a === 'dongNguoiO') hien(zA);
            else if (a === 'themNguoiO') moChonNguoiO();
            else if (a === 'roi') roiPhong(b.getAttribute('data-id'), b.getAttribute('data-ten'));
            else if (a === 'xacnhan') xacNhanDK(b.getAttribute('data-id'), dt);
            else if (a === 'suahoso') moSuaHoSo(dt, b.getAttribute('data-ten'));
            else if (a === 'hopdong' && r) moHopDong(r);
        });

        /* ---- Rời phòng (xếp phòng) / Xác nhận (xác nhận đăng ký) ---- */
        function roiPhong(id, ten) {
            ui.confirm('Bạn có chắc chắn muốn loại ' + ten + ' khỏi phòng không?', { tone: 'bad', ok: 'Rời phòng' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: 'KTX_DaXepPhong/Xoa', method: 'POST', strIds: id }).then(function (r) {
                    if (e(r.message)) { ui.toast(r.message, 'warn'); return; }
                    ui.toast('Hủy phòng thành công!', 'ok');
                    return taiChiTiet();
                });
            }).catch(loi('rời phòng'));
        }
        function xacNhanDK(id, dt) {
            ui.confirm('Bạn có chắc chắn muốn xếp vào phòng không?').then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: 'KTX_DangKyPhong/Xoa', method: 'POST', strIds: id }).then(function (r) {
                    if (e(r.message)) { ui.toast(r.message, 'warn'); return; }
                    ui.toast('Xếp phòng thành công!', 'ok');
                    return X.xepPhong(dt, st.phongId, homNay(), '').then(function (d) {
                        if (e(d.message)) ui.toast(d.message, 'warn'); else ui.toast('Đăng ký thành công!', 'ok');
                        return taiChiTiet();
                    });
                });
            }).catch(loi('xác nhận đăng ký phòng'));
        }

        /* ---- Hộp chọn người ở (xếp phòng) — edu.extend.genModal_NguoiO gốc ---- */
        function moChonNguoiO() {
            if (st.dlg && !st.dlg.closed) return;
            var pg = { index: 1, size: 10, total: 0 };
            var dlg = st.dlg = ui.dialog({ title: 'Chọn người ở — ' + esc(e(st.chiTiet && st.chiTiet.KTX_TOANHA_TEN) + ' - ' + e(st.chiTiet && st.chiTiet.TEN)),
                icon: 'fa-user-plus', size: 'xl',
                body: '<div class="ums-filter ums-u-mb-4">' +
                    '<div class="ums-field"><input class="ums-input" data-f="ngayvao" data-date data-range="xp:tu" placeholder="Ngày vào KTX (bắt buộc)" autocomplete="off" value="' + esc(nho('KTX_txtNgayVao')) + '"></div>' +
                    '<div class="ums-field"><input class="ums-input" data-f="ngayra" data-date data-range="xp:den" placeholder="Ngày ra KTX" autocomplete="off" value="' + esc(nho('KTX_txtNgayRa')) + '"></div>' +
                    sel('loaidt', 'Chọn loại đối tượng') + sel('gt', 'Chọn giới tính') +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '</div><div class="ums-u-muted ums-u-fz12 ums-u-mb-2">Chú ý: Ngày vào KTX là bắt buộc</div><div data-z="bang"></div>',
                onClose: function () { st.dlg = null; } });
            var b = dlg.body, bang = b.querySelector('[data-z="bang"]');
            function q(k) { return b.querySelector('[data-f="' + k + '"]'); }
            ums.api.dm('KTX_PHANLOAIDOITUONG').then(function (rs) { pat.fill(q('loaidt'), rs, { head: pat.dmTitle(rs) || 'Chọn loại đối tượng' }); }, function () { });
            ums.api.dm('NS.GITI').then(function (rs) { pat.fill(q('gt'), rs, { head: 'Chọn giới tính' }); }, function () { });
            ui.enhance(b);
            pg.onChange = function (p) { if (p >= 1 && p <= Math.max(1, Math.ceil(pg.total / pg.size))) tai(p); };
            pg.onSize = function (s) { pg.size = s; tai(1); };
            function tai(p) {
                pg.index = p || 1;
                bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                ums.api.call({ action: 'KTX_NguoiHocOKTX/LayDanhSach', method: 'GET',
                    strPhanLoaiDoiTuong_Id: pat.val(q('loaidt')), strTinhTrangHopDong_Id: '', dBiKyLuat: -1,
                    strNgayVao_TuNgay: '', strNgayVao_DenNgay: '', strNgayRa_TuNgay: '', strNgayRa_DenNgay: '', strKTX_ToaNha_Id: '',
                    strTuKhoa: (q('q').value || '').trim(), strKTX_Phong_Id: '', strLopQuanLy_Id: '', strGioiTinh_Id: pat.val(q('gt')),
                    strTrinhDoDaoTao_Id: '', strDienDaoTao_Id: '', strNganhDaoTao_Id: '', strKhoaDaoTao_Id: '', dDoiTuongConDangOKTX: -1,
                    strNguoiThucHien_Id: '', pageIndex: pg.index, pageSize: pg.size, strNgayKiemTra: ''
                }).then(function (r) {
                    var rs = rows(r); pg.total = Number(r.pager) || rs.length;
                    ui.table({ el: bang, rows: rs, page: pg, empty: 'Không tìm thấy người ở nào', columns: [
                        { title: 'Ảnh', cls: 'is-center', width: '56px', render: function (x) { return pat.anhNguoi(x.ANH); } },
                        { title: 'Họ tên', render: function (x) { return ui.cell((e(x.HODEM) + ' ' + e(x.TEN)).trim(), e(x.MASO)); } },
                        { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (x) { return esc(e(x.NGAYSINH) + '/' + e(x.THANGSINH) + '/' + e(x.NAMSINH)); } },
                        { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
                        { title: 'Tình trạng', prop: 'TRANGTHAINGUOIHOC_TEN' },
                        { title: 'Thao tác', cls: 'is-actions is-nowrap', render: function (x) {
                            return ui.btn('confirm', { text: 'Chọn', cls: 'ums-btn--sm', attr: { 'data-a': 'chon', 'data-id': e(x.ID), 'data-gt': e(x.GIOITINH_MA), 'data-ten': (e(x.HODEM) + ' ' + e(x.TEN)).trim() } });
                        } }
                    ] });
                }, function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách người ở'); });
            }
            var hen = 0;
            q('q').addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { tai(1); }, 400); });
            if (window.jQuery) jQuery([q('loaidt'), q('gt')]).on('change', function () { tai(1); });
            b.addEventListener('click', function (ev) {
                var x = ev.target.closest('[data-a="chon"]'); if (!x) return;
                var vao = (q('ngayvao').value || '').trim(), ra = (q('ngayra').value || '').trim();
                nho('KTX_txtNgayVao', vao); nho('KTX_txtNgayRa', ra);
                if (!vao) { ui.toast('Vui lòng nhập ngày vào!', 'warn'); q('ngayvao').focus(); return; }
                var canh = '';
                if (st.full) canh += 'Số người trong phòng đã đầy. ';
                if (st.tinhChatMa && st.tinhChatMa !== '-1' && x.getAttribute('data-gt') !== st.tinhChatMa) canh += 'Giới tính không phù hợp. ';
                var ten = x.getAttribute('data-ten'), id = x.getAttribute('data-id');
                ui.confirm((canh ? 'Cảnh báo: ' + canh : '') + 'Bạn có chắc chắn muốn thêm ' + ten + ' vào đăng ký phòng ' +
                    e(st.chiTiet && st.chiTiet.KTX_TOANHA_TEN) + ' - ' + e(st.chiTiet && st.chiTiet.TEN) + ' không?', { tone: canh ? 'bad' : undefined }).then(function (yes) {
                    if (!yes) return;
                    return X.xepPhong(id, st.phongId, vao, ra).then(function (d) {
                        if (e(d.message)) { ui.toast(d.message, 'warn'); return; }
                        ui.toast('Đăng ký thành công!', 'ok');
                        return taiChiTiet();
                    });
                }).catch(loi('xếp phòng'));
            });
            tai(1);
        }

        /* ---- Chỉnh sửa hồ sơ (biểu mẫu thay chỗ khung phải) ---- */
        function moSuaHoSo(dt, ten) {
            if (!dt) return;
            dongForm();
            var el = document.createElement('div'), fields = X.fieldsNO();
            var f = X.veTruong(el, fields);
            st.ft = pat.formTrang({ host: mainWrap, title: 'Chỉnh sửa hồ sơ: ' + e(ten), icon: 'fa-user-pen', cols: 1, body: el,
                buttons: [{ text: 'Cập nhật', kind: 'save', keepOpen: true, onClick: function () { capNhat(); return false; } }],
                onClose: function () { st.ft = null; } });
            Promise.all([f.ready, ums.api.call({ action: X.P + 'LayChiTiet', method: 'GET', strId: dt })]).then(function (kq) {
                var d = rows(kq[1])[0];
                if (!d) { ui.toast('Không đọc được hồ sơ', 'warn'); return; }
                fields.forEach(function (x) { if (x.key && x.col) f.set(x.key, d[x.col]); });
            }, loi('chi tiết hồ sơ'));
            function capNhat() {
                var thieu = X.thieu(f, fields);
                if (thieu) { ui.toast('Chưa nhập ' + thieu, 'warn'); return; }
                var c = X.saveNO(f.values(), { ID: dt });
                c.strAnh = c.strAnhCaNhan; delete c.strAnhCaNhan;          // CapNhat_NO gốc gửi khoá strAnh
                ums.api.call(c).then(function () { ui.toast('Cập nhật thành công!', 'ok'); taiDS(); }, loi('cập nhật hồ sơ'));
            }
        }

        /* ---- Tạo hợp đồng (biểu mẫu thay chỗ khung phải) ---- */
        var pKhoanThu = null;
        function napKhoanThu() {
            if (!pKhoanThu) pKhoanThu = Promise.all([
                ums.api.call({ action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', strNhomCacKhoanThu_Id: '', strNguoiThucHien_Id: '', strcanboquanly_id: '', pageIndex: 1, pageSize: 100000 }),
                ums.api.dm('KTX.DVT0')
            ]).then(function (kq) {
                st.khoanThu = []; st.mienGiam = []; st.khoanThuTienPhongId = '';
                rows(kq[0]).forEach(function (k) {
                    if (k.NHOMCACKHOANTHU_MA === 'KTX') st.khoanThu.push(k);
                    else if (k.NHOMCACKHOANTHU_MA === 'MienGiamKTX') { st.mienGiam.push(k); if (k.MA === 'KTXMG.TIENPHONG') st.khoanThuTienPhongId = k.ID; }
                });
                st.hinhThuc = kq[1] || [];
            }, function (err) { pKhoanThu = null; throw err; });
            return pKhoanThu;
        }
        function fld(label, ctl, x) { x = x || {}; return '<div>' + ui.field(label, ctl, { required: x.req }) + '</div>'; }
        function inp(k, x) {
            x = x || {};
            return '<input class="ums-input" data-k="' + k + '" autocomplete="off"' + (x.money ? ' data-money inputmode="numeric"' : '') +
                (x.value !== undefined ? ' value="' + esc(x.value) + '"' : '') + '>';
        }
        /* Cặp Ngày ký / Ngày kết thúc và Ngày vào / Ngày ra: data-range để tầng chung giữ đến ≥ từ (ui.khoangNgay) */
        function ngay(k, range) { return '<input class="ums-input" data-k="' + k + '" data-date' + (range ? ' data-range="' + range + '"' : '') + ' placeholder="dd/mm/yyyy" autocomplete="off">'; }
        function moHopDong(r) {
            dongForm();
            var dt = e(r.KTX_DOITUONGOKYTUCXA_ID), hopDongId = '';
            var body =
                '<div class="ums-legend">1) Thông tin hợp đồng</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    fld('Số hợp đồng', inp('strSoHopDong'), { req: true }) + '<div></div>' +
                    fld('Ngày ký', ngay('strNgayKyHopDong', 'hdky:tu')) + fld('Ngày kết thúc', ngay('strNgayKetThucHopDong', 'hdky:den')) +
                    fld('Số chỗ thuê', inp('dSoChoThue', { value: '1' })) +
                    fld('Bao phòng', '<select class="ums-select" data-k="dBaoPhong" data-ph="Bao phòng"><option value="0">Không</option><option value="1">Có</option></select>') +
                    fld('Số tháng', inp('dSoThang')) + fld('Số tiền/tháng', inp('dGiaThue_Thang', { money: true })) +
                    fld('Tổng tiền thuê', inp('dTongTienThue', { money: true })) +
                    '<div><div class="ums-field"><label class="ums-field__label">&nbsp;</label><div class="ums-field__control">' +
                        ui.btn('search', { text: 'Tính tiền', icon: 'fa-calculator', mod: 'out-primary', attr: { 'data-hd': 'tinhtien' } }) + '</div></div></div>' +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">2) Thông tin người đăng ký</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    '<div class="ums-kv"><span>Người đăng ký</span><b><span class="ums-u-blue">' + esc(hoTen(r)) + '</span> <i class="ums-u-faint">(' + esc(e(r.KTX_DOITUONGOKYTUCXA_MASO)) + ')</i></b></div>' +
                    '<div class="ums-kv"><span>Phòng đăng ký</span><b>' + esc(e(r.KTX_PHONG_MA)) + '</b></div>' +
                    fld('Ngày vào', ngay('strNgayVao', 'hdvao:tu')) + fld('Ngày ra', ngay('strNgayRa', 'hdvao:den')) +
                '</div>' +
                '<div class="ums-u-mt-4">' +
                    pat.panel({ title: '3) Chính sách ưu đãi', icon: 'fa-gift', flush: true, zone: 'cs', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') }) +
                    pat.panel({ title: '4) Nội dung miễn giảm', icon: 'fa-percent', flush: true, cls: 'ums-panel--cach', zone: 'mg', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') }) +
                '</div>';
            var ft = st.ft = pat.formTrang({ host: mainWrap, title: 'Tạo hợp đồng: ' + hoTen(r), icon: 'fa-file-contract', cols: 1, body: body,
                buttons: [
                    { text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); return false; } },
                    { text: '1. In hợp đồng sinh viên', kind: 'print', keepOpen: true, onClick: function () { inHD('HopDongSinhVien'); return false; } },
                    { text: '2. In hợp đồng lưu học sinh', kind: 'print', keepOpen: true, onClick: function () { inHD('HopDongLuuHocSinh'); return false; } }
                ],
                onClose: function () { st.ft = null; } });
            var b = ft.body, khung = b.closest('.ums-formtrang');
            function q(k) { return b.querySelector('[data-k="' + k + '"]'); }
            function val(k) { var el = q(k); return el ? (el.value || '').trim() : ''; }
            function dat(k, v) { var el = q(k); if (el) el.value = el.hasAttribute('data-money') ? (e(v) === '' ? '' : ui.money(v)) : e(v); }
            function cheDoIn(daLuu) {
                var nut = khung ? khung.querySelectorAll('.ums-panel__tools [data-ft]') : [];
                Array.prototype.forEach.call(nut, function (x) {
                    var i = x.getAttribute('data-ft');
                    if (i === '0') x.hidden = daLuu; else if (i === '1' || i === '2') x.hidden = !daLuu;
                });
            }
            cheDoIn(false);
            dat('strNgayVao', r.NGAYVAO); dat('strNgayRa', r.NGAYRA);
            ui.enhance(b);
            /* Lưới chính sách / miễn giảm: ô chọn trong bảng ít mục → ô chọn gốc (ui.table tự bỏ qua select2) */
            function luoi(host, ds, tienTo, nhan, chuLuu) {
                var opt = '<option value=""></option>' + st.hinhThuc.map(function (h) { return '<option value="' + esc(h.ID) + '">' + esc(e(h.TEN)) + '</option>'; }).join('');
                ui.table({ el: host, rows: ds, stt: true, empty: 'Không có khoản thu nào', columns: [
                    { title: 'Khoản thu', prop: 'TEN' },
                    { title: nhan, width: '220px', render: function (k) { return '<input class="ums-input" data-' + tienTo + '-so="' + esc(k.ID) + '" placeholder="' + esc(nhan) + '" autocomplete="off">'; } },
                    { title: 'Hình thức', width: '260px', render: function (k) { return '<select class="ums-select" data-' + tienTo + '-ht="' + esc(k.ID) + '">' + opt + '</select>'; } }
                ] });
            }
            napKhoanThu().then(function () {
                luoi(b.querySelector('[data-z="cs"]'), st.khoanThu, 'cs', 'Số lượng ưu đãi');
                luoi(b.querySelector('[data-z="mg"]'), st.mienGiam, 'mg', 'Phần trăm miễn giảm');
            }, function (err) {
                b.querySelector('[data-z="cs"]').innerHTML = ui.fail(err.message); b.querySelector('[data-z="mg"]').innerHTML = '';
                ums.api.handle(err, 'danh sách khoản thu');
            });
            b.addEventListener('input', function (ev) {
                var el = ev.target;
                if (!el.hasAttribute || !el.hasAttribute('data-money')) return;
                var s = pat.num(el.value).replace(/[^\d]/g, '');
                el.value = s ? ui.money(s) : '';
            });
            b.addEventListener('focusout', function (ev) {
                var k = ev.target.getAttribute && ev.target.getAttribute('data-k');
                if (k === 'strNgayKyHopDong') dat('strNgayVao', ev.target.value);          // blur gốc: chép sang Ngày vào
                if (k === 'strNgayKetThucHopDong') dat('strNgayRa', ev.target.value);
            });
            b.addEventListener('click', function (ev) {
                var x = ev.target.closest('[data-hd="tinhtien"]'); if (!x) return;
                ums.api.call({ action: 'KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi', method: 'GET',
                    strKTX_DoiTuongOKyTucXa_Id: dt, strKTX_Phong_Id: e(r.KTX_PHONG_ID), dSoThang: val('dSoThang') }).then(function (kq) {
                    var d = rows(kq)[0];
                    if (d) dat('dTongTienThue', d.TONGTIEN);
                }, loi('tính tiền phòng'));
            });
            function docLuoi(tienTo, ds) {
                var ids = [], so = [], ht = [];
                ds.forEach(function (k) {
                    var a = b.querySelector('[data-' + tienTo + '-so="' + k.ID + '"]'), c = b.querySelector('[data-' + tienTo + '-ht="' + k.ID + '"]');
                    ids.push(e(k.ID)); so.push(a ? a.value.trim() : ''); ht.push(c ? c.value : '');
                });
                return { ids: ids.join('#'), so: so.join('#'), ht: ht.join('#') };
            }
            function luu() {
                if (!val('strSoHopDong')) { ui.toast('Chưa nhập Số hợp đồng', 'warn'); q('strSoHopDong').focus(); return; }
                var cs = docLuoi('cs', st.khoanThu), mg = docLuoi('mg', st.mienGiam);
                ums.api.call({ action: 'KTX_HopDong/ThemMoi', method: 'POST', strId: '',
                    strSoHopDong: val('strSoHopDong'), strNgayKyHopDong: val('strNgayKyHopDong'), strNgayKetThucHopDong: val('strNgayKetThucHopDong'),
                    strTinhTrang_Id: st.ttHD, strKTX_Phong_Id: e(r.KTX_PHONG_ID), strKTX_DoiTuongOKyTucXa_Id: dt,
                    strNgayVao: val('strNgayVao'), strNgayRa: val('strNgayRa'), dSoThang: val('dSoThang'),
                    dTongTienThue: pat.num(val('dTongTienThue')), dGiaThue_Thang: pat.num(val('dGiaThue_Thang')),
                    dSoChoThue: val('dSoChoThue'), dBaoPhong: val('dBaoPhong') || '0',
                    strTaiChinh_CacKhoanThu_Id: st.khoanThuTienPhongId,
                    strHopDong_MG_PhanTrams: mg.so, strHopDong_MG_KhoanThu_Ids: mg.ids, strHopDong_MG_HinhThuc_Ids: mg.ht,
                    strHopDong_CS_SoLuongs: cs.so, strHopDong_CS_KhoanThu_Ids: cs.ids, strHopDong_CS_HinhThuc_Ids: cs.ht
                }).then(function (kq) {
                    ui.toast('Đăng ký thành công!', 'ok');
                    hopDongId = e(kq.raw && kq.raw.Id);
                    if (hopDongId) cheDoIn(true);
                    taiDS();
                }, loi('lưu hợp đồng'));
            }
            function inHD(code) {
                if (!hopDongId) { ui.toast('Lưu hợp đồng trước khi in', 'warn'); return; }
                var id = hopDongId, tien = pat.num(val('dTongTienThue'));
                ums.report.run(code, { collect: function (add) { add('strHopDong_Id', id); add('strSoTienBangChu', ui.docSo(tien)); } });
            }
        }

        taiToa();
        return { st: st, taiToa: taiToa, chonPhong: chonPhong };
    };
})();
