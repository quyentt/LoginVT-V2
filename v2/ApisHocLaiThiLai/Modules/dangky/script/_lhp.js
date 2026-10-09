/* =========================================================================
   Lớp học phần (Học lại thi lại) — KHUNG DÙNG CHUNG cho hai màn
       ApisHocLaiThiLai/Modules/dangky/html/lophocphan.html      + script/lophocphan.js
       ApisHocLaiThiLai/Modules/lapdanhsach/html/lophocphan.html + script/lophocphan.js
   Hai bản gốc chép nhau từng dòng (cùng là bản rẽ nhánh của
   ApisTaiChinh/Modules/danhmucheso/scripts/lophocphan.js). Khác nhau ĐÚNG hai chỗ
   trong .js và màu nút trong .html → khai bằng `kieu`:

       ums.hltlLhp.man(root, { kieu: 'dangky' | 'lapdanhsach' })

                              dangky          lapdanhsach
       Danh sách lớp HP       GET             POST            (lời gọi ở dòng 757 gốc)
       Đăng ký chi tiết       type='GET'      type='POST'     (tham số `type` trong dữ liệu gửi đi,
                                                               dòng 837 gốc; HTTP vẫn GET cả hai)
       Nút "Xem danh sách lớp học phần"     trắng → out-primary    xanh lá (btn-success)
       Nút "Xem danh sách đăng ký chi tiết" trắng → out-primary    xanh dương (btn-primary)
       Nút "Tạo dữ liệu thi lại"            xanh dương             xanh lá (btn-success)
   ---------------------------------------------------------------------------
   MỘT CỘT như gốc: thanh lọc (4 ô mỗi hàng như col-sm-3) → khung "Danh sách" (nút
   Thiết lập lớp riêng · Tạo dữ liệu thi lại, HAI bảng dùng chung một chỗ) → khung
   "Dồn lớp" thay chỗ cả trang (#zoneEdit) · hai hộp thoại (#myModal, #myModalPhamVi).

   Lời gọi (chép nguyên action / tham số; `type` trong dữ liệu gửi đi giữ như gốc):
       DKH_Chung/LayThoiGianDangKyHoc               GET  Thời gian (chọn nhiều)
       pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao    = edu.system.getList_HeDaoTao (KHÔNG lọc quyền, như gốc)
       DKH_PhanCong_LopHP/LayDSKhoaToChuc           GET  Khoá (theo Hệ, Thời gian)
       DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc    GET  CT (theo Thời gian, Khoá, Hệ, Khoa QL)
       pkg_kehoach_thongtin.LayDSKhoaQuanLy         = edu.system.getList_KhoaQuanLy
       DKH_PhanCong_LopHP/LayDSHocPhan              GET  Học phần (theo Thời gian, Khoá, Hệ, CT, Khoa QL)
       DKH_ThongTin/LayDSDangKy_KeHoachDangKy       GET  Kế hoạch (theo Thời gian; strTuKhoa = txtAAAA → '')
       Danh mục KHDT.DIEM.KIEUHOC (Kiểu học), DIEM.DANHGIA (Đánh giá),
                QLSV.TRANGTHAI (khối "Chọn trạng thái sinh viên" — chỉ dùng cho báo cáo, như gốc)
       DKH_ThongTin2/LayDSDangKyHocKetQuaHocTap     "Xem danh sách lớp học phần" — phân trang máy chủ
       DKH_ThongTin2/LayDSDangKyHoc                 "Xem danh sách đăng ký chi tiết" — phân trang máy chủ
       DKH_PhanCong_LopHP/LayDanhSach               hộp "Chi tiết" phạm vi   (ums.lhp.hopPhamVi — dùng lại của Đăng ký học)
       DKH_PhanCong_LopHP/LayDSDangKyHoc            GET  hộp "Số sv đã đăng ký"
       DKH_PhanCong_LopHP/ThietDatThuocTinhLopRieng POST Thiết lập lớp riêng (dLopRieng 1/0, mỗi lớp một lời gọi)
       HLTL_ThongTin/LapDSNguoiHocHocLaiThiLai      POST Tạo dữ liệu thi lại (mỗi dòng chi tiết đã chọn một lời gọi)
       Dồn lớp: ums.lhp.donLop (ApisDangKyHoc/Modules/kehoachdangky/script/_lhp_don.js) — gọi
           DKH_PhanCong_LopHP/LayDSDangKyHoc, DKH_DangKy/ThucHienDonLopDangKyHoc,
           DKH_DangKy/ThucHienHuyDangKyHocHocPhan với ĐÚNG tham số của save_SinhVien /
           delete_LopHocPhan / getList_DangKyHoc(KQ) bản này → dùng lại, không chép bản thứ ba.
           Riêng nút "Chỉ xóa đúng lớp chọn…" của bản Đăng ký học KHÔNG có ở đây → gỡ khỏi khung.
   "Xuất báo cáo": ums.report.mount (= getList_MauImport "zonebtnBaoCao_LopHocPhan") với đúng
   các cặp addKeyValue của gốc; gốc không có vùng Import → import: false.

   Ô chọn CHA → CON (như bản Đăng ký học cùng họ):
     · Thời gian → Kế hoạch: một cha, danh sách chỉ nạp khi chọn Thời gian → KHOÁ Kế hoạch
       khi chưa chọn Thời gian; đổi/xoá Thời gian thì xoá trắng (ums.pat.chain).
     · Khoá, Chương trình, Học phần: nhãn "Tất cả …" / nhiều cha → lọc TUỲ CHỌN, KHÔNG khoá;
       đổi HOẶC XOÁ ô cha thì nạp lại ô con (gốc chỉ bắt select2:select).
     · Chọn Thời gian: gốc nạp lại Hệ (xoá trắng Hệ) nhưng không nạp lại Khoá / CT theo Hệ vừa
       bị xoá → ở đây nạp lại luôn Khoá, CT (hai lời gọi này vốn nhận Thời gian làm tham số).

   Khác bản gốc:
     · "Tạo dữ liệu thi lại": gốc lấy ô đánh dấu ở bảng ĐĂNG KÝ CHI TIẾT nhưng tra dòng trong
       dtLopHocPhan (dữ liệu bảng LỚP HỌC PHẦN) → không thấy dòng thì lỗi JS (aData undefined),
       không gửi gì, thanh tiến độ treo. Nay tra đúng dòng chi tiết đã đánh dấu (QLSV_NGUOIHOC_ID,
       DANGKY_LOPHOCPHAN_ID là cột của dòng chi tiết). Ba tham số đọc ô dropAAAA không tồn tại
       (strDanhGia_Id, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id) → gửi rỗng như gốc.
       Chạy xong nạp lại danh sách LỚP HỌC PHẦN (như gốc — màn chuyển về bảng lớp).
     · Thiết lập lớp riêng: gốc không chọn lựa chọn nào vẫn gửi (dLopRieng rỗng) → nay bắt chọn;
       gốc nạp lại danh sách sau MỖI lời gọi → nay một lần sau cả lô.
     · Mỗi bảng một số trang (gốc dùng chung edu.system.pageIndex_default); bấm "Xem …" về trang 1.
     · Ô "Số đã đăng ký (từ/đến)" gõ chữ: gốc gửi NaN → nay coi như để trống (-1).
     · Hộp phạm vi: gốc gửi pageIndex = trang đang xem của bảng ngoài, pageSize 10, không phân
       trang → nay trang 1, 1000000 dòng; bỏ cột ô đánh dấu (không nút nào dùng).
     · Bấm "Dồn lớp" gốc gọi lại getList_LopHocPhan(strId) (nạp lại bảng đang ẩn, kết quả không
       dùng) → bỏ. Lớp cuối = mọi lớp KHÁC trên trang đang xem (như gốc, không lọc cùng học phần).
     · Nhãn #lblLopHocPhan_Tong gốc không bao giờ ghi → nay hiện tổng số dòng cạnh "Danh sách".
   Bỏ (mã chết): #dropSearch_Lop / NguoiThu / NamNhapHoc (không có trong html), getList_LopQuanLy /
   getList_NamNhapHoc (không được gọi), resetCombobox, genList_TrangThaiSV bản thứ nhất (ghi vào
   #DSTrangThaiSV_LHD không tồn tại, bị bản sau đè), khối <style> đầu html.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, ref = ums.ref;
    var H = ums.hltlLhp = ums.hltlLhp || {};

    var KIEU = {
        dangky:      { dsMethod: 'GET',  ctType: 'GET',  nutLhp: 'out-primary', nutCt: 'out-primary', nutThiLai: 'primary' },
        lapdanhsach: { dsMethod: 'POST', ctType: 'POST', nutLhp: 'add',         nutCt: 'primary',     nutThiLai: 'save' }
    };

    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    function tenMa(ten, ma) { ten = e(ten); ma = e(ma); return ten + ' (' + ma + ')'; }
    function dang() { return ui.empty('Đang tải…', 'fa-spinner fa-spin'); }

    H.man = function (root, o) {
        if (!root) return;
        var L = ums.lhp;                        // cotChon / ganChon / idChon / hoiChon / hopPhamVi / donLop
        var K = KIEU[(o && o.kieu) || 'dangky'] || KIEU.dangky;

        function sel(k, ph, nhieu) {
            return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' +
                (nhieu ? ' multiple' : '') + '>' + (nhieu ? '' : '<option value=""></option>') + '</select></div>';
        }
        function inp(k, ph, so) {
            return '<div class="ums-field"><input class="ums-input" data-f="' + k + '"' + (so ? ' inputmode="numeric"' : '') +
                ' placeholder="' + esc(ph) + '" autocomplete="off"></div>';
        }
        function nutXem(a, t, mod) { return ui.btn('search', { text: t, mod: mod, attr: { 'data-a': a } }); }

        root.innerHTML =
            '<div data-v="ds">' +
                pat.page('Lớp học phần', '') +
                pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                    '<div class="ums-filter lhp-loc">' +
                        sel('tg', 'Chọn học kỳ', true) + sel('he', 'Tất cả hệ đào tạo', true) +
                        sel('khoa', 'Tất cả khóa đào tạo', true) + sel('kql', 'Tất cả khoa quản lý', true) +
                    '</div>' +
                    '<div class="ums-filter lhp-loc ums-u-mt-3">' +
                        sel('ct', 'Tất cả chương trình đào tạo', true) + sel('hp', 'Chọn học phần', true) +
                        sel('kh', 'Chọn kế hoạch') + sel('kieu', 'Chọn kiểu học') +
                    '</div>' +
                    '<div class="ums-filter lhp-loc ums-u-mt-3">' +
                        sel('dg', 'Chọn đánh giá') +
                        '<div class="ums-field hltl-lhp__chk"><label class="ums-check"><input type="checkbox" data-f="cpc"> <b>Chỉ hiện các lớp chưa phân công</b></label></div>' +
                        inp('tu', 'Số đã đăng ký(từ số)', true) + inp('den', 'Số đã đăng ký(đến số)', true) +
                    '</div>' +
                    '<div class="ums-filter lhp-loc ums-u-mt-3">' +
                        inp('q', 'Nhập từ khóa tìm kiếm') +
                        '<div class="ums-field lhp-loc__nut hltl-lhp__nut">' +
                            nutXem('lhp', 'Xem danh sách lớp học phần', K.nutLhp) +
                            nutXem('ct', 'Xem danh sách đăng ký chi tiết', K.nutCt) +
                            '<span data-z="bc"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div><div data-z="tt"></div>'
                }) +
                pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'tong', flush: true, cls: 'lhp-ds',
                    tools:
                        ui.btn('add', { text: 'Thiết lập lớp riêng', icon: 'fa-gear', mod: 'primary', attr: { 'data-a': 'loprieng' } }) +
                        ui.btn('add', { text: 'Tạo dữ liệu thi lại', icon: 'fa-pen-field', mod: K.nutThiLai, attr: { 'data-a': 'thilai' } }),
                    body: '<div data-bang="lhp"></div><div data-bang="ct" hidden></div>' }) +
            '</div>' +
            '<div data-v="don" hidden></div>';

        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? pat.val(f(k)) : ''; }
        function khung(k) { return root.querySelector('[data-v="' + k + '"]'); }
        function bang(k) { return root.querySelector('[data-bang="' + k + '"]'); }
        function so(k) { var n = parseInt(v(k), 10); return v(k) && !isNaN(n) ? n : -1; }
        ui.enhance(root);
        L.ganChon(root);

        /* ---------- Nguồn các ô lọc ---------------------------------------- */
        /* Đổ danh sách; hệ cũ đặt lại ô về trống khi danh sách không đúng MỘT mục (cbGenCombo_*) */
        function fill(k, rows, opt) {
            pat.fill(f(k), rows, opt);
            if (rows.length !== 1) {
                if (f(k).multiple) jQuery(f(k)).val([]); else f(k).value = '';
                jQuery(f(k)).trigger('change.select2').trigger('ums:refresh');
            }
        }
        function goi(p) { return ums.api.call(p).then(function (r) { return arr(r.data); }); }
        function napThoiGian() {
            return goi({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET', type: 'GET', strNguoiThucHien_Id: uid() })
                .then(function (d) { pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(loi('thời gian đào tạo'));
        }
        function napHe() {
            return ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (d) { fill('he', d, { name: 'TENHEDAOTAO' }); }).catch(loi('hệ đào tạo'));
        }
        function napKhoa() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', type: 'GET',
                strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
                .then(function (d) { fill('khoa', d, { name: 'TENKHOA' }); }).catch(loi('khóa đào tạo'));
        }
        function napCT() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', type: 'GET',
                strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql') })
                .then(function (d) { fill('ct', d, { name: 'TENCHUONGTRINH' }); }).catch(loi('chương trình đào tạo'));
        }
        function napKQL() {
            return ref.khoaQuanLy().then(function (d) { fill('kql', d, { name: 'TEN' }); }).catch(loi('khoa quản lý'));
        }
        function napHP() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET', type: 'GET',
                strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') })
                .then(function (d) {
                    pat.fill(f('hp'), d, { name: function (r) { return e(r.TEN) + ' - ' + e(r.MA); } });
                }).catch(loi('học phần'));
        }
        function napKH() {
            if (!v('tg')) { pat.fill(f('kh'), [], {}); return Promise.resolve(); }
            return goi({ action: 'DKH_ThongTin/LayDSDangKy_KeHoachDangKy', method: 'GET', type: 'GET',
                strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNguoiThucHien_Id: uid(),
                pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('kh'), d, { name: 'TENKEHOACH' }); }).catch(loi('kế hoạch đăng ký'));
        }
        function dm(k, ma) {
            ums.api.dm(ma).then(function (d) {
                var t = pat.dmTitle(d);
                if (t) f(k).setAttribute('data-ph', t);
                pat.fill(f(k), d, { head: t || f(k).getAttribute('data-ph') });
            }).catch(loi(ma));
        }

        /* Khởi tạo — đúng thứ tự init() bản gốc */
        napHe(); napKhoa(); napCT(); napKQL(); napThoiGian();
        var tt = pat.checks(root.querySelector('[data-z="tt"]'), ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 });
        dm('kieu', 'KHDT.DIEM.KIEUHOC');
        dm('dg', 'DIEM.DANHGIA');

        /* Nối tầng — nghe cả lúc bỏ chọn / xoá (bản gốc chỉ nghe select2:select) */
        function nghe(k, fn) { jQuery(f(k)).on('select2:select select2:unselect select2:clear', fn); }
        nghe('tg', function () { napHe(); napKhoa(); napCT(); napHP(); napKH(); });
        nghe('he', function () { napKhoa(); napCT(); napHP(); });
        nghe('khoa', function () { napCT(); napHP(); });
        nghe('ct', function () { napHP(); });
        nghe('kql', function () { napCT(); napHP(); });
        pat.chain([f('tg'), f('kh')], { phatLai: false });

        /* ---------- Hai danh sách -------------------------------------------- */
        var trang = { lhp: { index: 1, size: 10 }, ct: { index: 1, size: 10 } };
        var ds = { lhp: [], ct: [] };
        var luot = 0;

        function thamSo(k) {
            var t = trang[k];
            var p = {
                strTuKhoa: (f('q').value || '').trim(),
                strDaoTao_ThoiGianDaoTao_Id: v('tg'),
                strDaoTao_HocPhan_Id: v('hp'),
                strNguoiThucHien_Id: uid(),
                pageIndex: t.index,
                pageSize: t.size,
                strDangKy_KeHoachDangKy_Id: v('kh'),
                dChiLayCacLopChuaPhanCong: f('cpc').checked ? 1 : 0,
                strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_ChuongTrinh_Id: v('ct'),
                strDaoTao_HeDaoTao_Id: v('he'),
                strDaoTao_KhoaQuanLy_Id: v('kql'),
                dSoDaDangTuSo: so('tu'),
                dSoDaDangDenSo: so('den'),
                strKieuHoc_Id: v('kieu')
            };
            if (k === 'lhp') {
                p.action = 'DKH_ThongTin2/LayDSDangKyHocKetQuaHocTap';
                p.method = K.dsMethod;
                p.strDanhGia_Id = v('dg');
            } else {
                p.action = 'DKH_ThongTin2/LayDSDangKyHoc';
                p.method = 'GET';
                p.type = K.ctType;
            }
            return p;
        }
        function hien(k) {
            bang('lhp').hidden = k !== 'lhp';
            bang('ct').hidden = k !== 'ct';
        }
        function nap(k) {
            hien(k);
            var sh = ++luot, z = bang(k);
            z.innerHTML = dang();
            return ums.api.call(thamSo(k)).then(function (r) {
                if (sh !== luot) return;
                ve(k, arr(r.data), Number(r.pager) || 0);
            }).catch(function (err) {
                if (sh !== luot) return;
                z.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách');
            });
        }

        function nutO(a, id, text, icon) {
            return ui.btn('view', { text: text, icon: icon, mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': id } });
        }
        var COT = {
            lhp: function () {
                return [
                    { title: 'Mã lớp', prop: 'MALOP', cls: 'is-center is-nowrap' },
                    { title: 'Tên lớp', prop: 'TENLOP', cls: 'lhp-vua' },
                    { title: 'Thông tin lịch', prop: 'THOIGIANCHITIET', cls: 'lhp-lich' },
                    { title: 'Đã phân công', cls: 'is-center', render: function (r) { return nutO('phamvi', r.ID, 'Chi tiết', 'fa-eye'); } },
                    { title: 'Số sv đã đăng ký', cls: 'is-center', render: function (r) {
                        return r.SOSVDADANGKY ? nutO('dssv', r.ID, String(r.SOSVDADANGKY), 'fa-users') : '';
                    } },
                    { title: 'Số sv dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' },
                    { title: 'Lớp riêng', cls: 'is-center is-nowrap', render: function (r) { return r.HOCPHITINHRIENG ? 'Lớp riêng' : ''; } },
                    { title: 'Dồn lớp', cls: 'is-center', render: function (r) {
                        return ui.btn('add', { text: 'Dồn lớp', icon: 'fa-people-arrows', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': 'donlop', 'data-id': r.ID } });
                    } },
                    L.cotChon('lhp')
                ];
            },
            ct: function () {
                var SV = ['Thông tin sinh viên'], DK = ['Thông tin đăng ký'];
                return [
                    { group: SV, title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
                    { group: SV, title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', cls: 'is-nowrap' },
                    { group: SV, title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                    { group: SV, title: 'Chương trình', cls: 'lhp-vua', render: function (r) { return esc(tenMa(r.DAOTAO_TOCHUCCHUONGTRINH_TEN, r.DAOTAO_TOCHUCCHUONGTRINH_MA)); } },
                    { group: SV, title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
                    { group: SV, title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN', cls: 'lhp-vua' },
                    { group: DK, title: 'Loại lớp', prop: 'LOPRIENG', cls: 'is-nowrap' },
                    { group: DK, title: 'Mã lớp học phần', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' },
                    { group: DK, title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN', cls: 'lhp-vua' },
                    { group: DK, title: 'Học phần', cls: 'lhp-vua', render: function (r) { return esc(tenMa(r.DAOTAO_HOCPHAN_TEN, r.DAOTAO_HOCPHAN_MA)); } },
                    { group: DK, title: 'Số tín', prop: 'SOTINCHI', cls: 'is-center' },
                    { group: DK, title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-nowrap' },
                    { group: DK, title: 'Ngày đăng ký', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                    { group: DK, title: 'TK đăng ký', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-center' },
                    { group: DK, title: 'Chương trình đăng ký', cls: 'lhp-vua', render: function (r) { return esc(tenMa(r.DAOTAO_CHUONGTRINHDK_TEN, r.DAOTAO_CHUONGTRINHDK_MA)); } },
                    L.cotChon('ct')
                ];
            }
        };
        function ve(k, rows, total) {
            var t = trang[k];
            ds[k] = rows;
            var dem = root.querySelector('[data-z="tong"]');
            if (dem) dem.textContent = '(' + total + ')';
            ui.table({
                el: bang(k), rows: rows, columns: COT[k](), empty: 'Không có dữ liệu',
                tableCls: 'ums-table--lined',
                page: {
                    index: t.index, size: t.size, total: total,
                    onChange: function (p) { if (p < 1 || p > Math.ceil(total / t.size)) return; t.index = p; nap(k); },
                    onSize: function (s) { t.size = s; t.index = 1; nap(k); }
                }
            });
        }

        function chon(k) {
            return L.idChon(bang(k), k).map(function (id) {
                return ds[k].filter(function (r) { return String(r.ID) === String(id); })[0];
            }).filter(Boolean);
        }

        /* ---------- Báo cáo (getList_MauImport "zonebtnBaoCao_LopHocPhan") --- */
        ums.report.mount(root.querySelector('[data-z="bc"]'), { import: false, collect: function (add) {
            add('strDaoTao_ThoiGianDaoTao_Id', v('tg'));
            add('strDaoTao_KhoaDaoTao_Id', v('khoa'));
            add('strDaoTao_ChuongTrinh_Id', v('ct'));
            add('strDaoTao_HocPhan_Id', v('hp'));
            add('strDaoTao_HeDaoTao_Id', v('he'));
            add('strDaoTao_KhoaQuanLy_Id', v('kql'));
            add('strDangKy_KeHoachDangKy_Id', v('kh'));
            add('strKieuHoc_Id', v('kieu'));
            add('strTuKhoa', (f('q').value || '').trim());
            add('dChiLayCacLopChuaPhanCong', f('cpc').checked ? 1 : 0);
            add('dSoDaDangTuSo', so('tu'));
            add('dSoDaDangDenSo', so('den'));
            L.idChon(bang('lhp'), 'lhp').forEach(function (id) { add('strDangKy_LopHocPhan_Id', id); });
            tt.ids().forEach(function (id) { add('strTrangThaiNguoiHoc_Id', id); });
        } });

        /* ---------- Hộp "Số sv đã đăng ký" (#myModal / tblQuanSoLop) ---------- */
        function hopSinhVien(idLop) {
            var d = ui.dialog({ title: 'Danh sách sinh viên', icon: 'fa-users-between-lines', size: 'xl', body: '<div data-z="b">' + dang() + '</div>' });
            var z = d.body.querySelector('[data-z="b"]');
            ums.api.call({
                action: 'DKH_PhanCong_LopHP/LayDSDangKyHoc', method: 'GET', type: 'GET',
                strTuKhoa: '', strDaoTao_LopHocPhan_Id: idLop, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000
            }).then(function (r) {
                ui.table({ el: z, rows: arr(r.data), empty: 'Lớp chưa có sinh viên đăng ký', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
                    { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' },
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }
                ] });
            }).catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên của lớp'); });
        }

        /* ---------- Khung Dồn lớp thay chỗ danh sách --------------------------- */
        function moDonLop(lop) {
            ui.swap(khung('ds'), khung('don'));
            L.donLop(khung('don'), {
                lop: lop,
                lopCungHP: ds.lhp.filter(function (r) { return r.ID !== lop.ID; }),
                dong: function () {
                    khung('don').hidden = true; khung('don').innerHTML = '';
                    ui.swap(khung('don'), khung('ds'));
                    nap('lhp');                                 // toggle_form → getList_LopHocPhan
                }
            });
            /* Bản Đăng ký học có thêm "Chỉ xóa đúng lớp chọn…" — bản này không có → gỡ */
            var thua = khung('don').querySelector('[data-a="xoachon"]');
            if (thua) thua.parentNode.removeChild(thua);
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !root.contains(b) || b.disabled || !khung('ds').contains(b)) return;
            var a = b.getAttribute('data-a'), id = b.getAttribute('data-id'), rs;
            if (a === 'lhp' || a === 'ct') { trang[a].index = 1; return nap(a); }
            if (a === 'phamvi') return L.hopPhamVi(id);
            if (a === 'dssv') return hopSinhVien(id);
            if (a === 'donlop') {
                var lop = ds.lhp.filter(function (r) { return String(r.ID) === String(id); })[0];
                if (lop) moDonLop(lop);
                return;
            }
            if (a === 'loprieng') {
                rs = chon('lhp');
                if (!rs.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                L.hoiChon({ title: 'Thiết lập lớp riêng', cau: 'Chọn thiết lập lớp riêng?',
                    lua: [{ v: '1', t: 'Là lớp riêng' }, { v: '0', t: 'Không phải lớp riêng' }] }).then(function (gt) {
                    if (gt === null) return;
                    ui.batch(rs.map(function (r) {
                        return { action: 'DKH_PhanCong_LopHP/ThietDatThuocTinhLopRieng', type: 'POST',
                            strDaoTao_LopHocPhan_Id: r.ID, strNguoiThucHien_Id: uid(), dLopRieng: gt };
                    }), { title: 'Thiết lập lớp riêng', okText: 'Thành công' }).then(function () { nap('lhp'); });
                });
            } else if (a === 'thilai') {
                rs = chon('ct');                                  // ô đánh dấu của bảng chi tiết (như gốc)
                if (!rs.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { title: 'Tạo dữ liệu thi lại' }).then(function (ok) {
                    if (!ok) return;
                    ui.batch(rs.map(function (r) {
                        return {
                            action: 'HLTL_ThongTin/LapDSNguoiHocHocLaiThiLai', type: 'POST',
                            strChucNang_Id: '',                                     // api.js tự điền id chức năng đang mở
                            strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                            strDanhGia_Id: '',                                      // gốc đọc #dropAAAA (không tồn tại)
                            strDaoTao_ThoiGianDaoTao_Id: '',                        // gốc đọc #dropAAAA
                            strNguoiThucHien_Id: uid(),
                            strDiem_DanhSach_Id: r.DANGKY_LOPHOCPHAN_ID,
                            strDaoTao_HocPhan_Id: ''                                // gốc đọc #dropAAAA
                        };
                    }), { title: 'Đang tạo dữ liệu thi lại', okText: 'Thành công' }).then(function () {
                        nap('lhp');                                                 // như gốc: xong nạp lại danh sách lớp
                    });
                });
            }
        });

        bang('lhp').innerHTML = ui.empty('Chọn điều kiện lọc rồi bấm "Xem danh sách lớp học phần"', 'fa-hand-pointer');
    };
})();
