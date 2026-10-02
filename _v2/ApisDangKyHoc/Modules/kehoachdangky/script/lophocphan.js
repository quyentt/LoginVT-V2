/* =========================================================================
   Lớp học phần (Đăng ký học › Kế hoạch đăng ký)
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/lophocphan.html (78 KB)
            + script/lophocphan.js (4.126 dòng) — chạy ở vỏ indexi.
   ---------------------------------------------------------------------------
   MỘT CỘT như gốc: thanh lọc → khung "Danh sách" (11 nút thao tác, ô tìm trong
   bảng, BA bảng dùng chung một chỗ: lớp học phần / đăng ký chi tiết / rút đăng
   ký — bấm nút "Xem …" nào thì hiện bảng đó). Ba khung thay chỗ cả trang (Dồn
   lớp, Dồn nhóm lớp, Thực hiện rút học phần) và bảy hộp thoại.
   Tệp tách theo phần (cùng thư mục):
       _lhp_loc.js   thanh lọc + nối tầng + tham số chung          (ums.lhp.boLoc)
       _lhp_tim.js   ô "Tìm cụm từ trong bảng" kiểu Ctrl+F          (ums.lhp.tim)
       _lhp_hop.js   7 hộp thoại + ô đánh dấu dùng chung           (ums.lhp.hop*)
       _lhp_don.js   khung Dồn lớp / Dồn nhóm lớp / Rút học phần   (ums.lhp.donLop, donNhom, rut)
       ../css/_lhp.css

   Danh sách (chép nguyên action / func / tham số):
     "Xem danh sách lớp học phần"
         DKH_BaoCao_MH/DSA4BRINLjEJLiIRKSAvESkgLxUzIC8m  pkg_dangkyhoc_baocao.LayDSLopHocPhanPhanTrang
         (+ strTKB_HinhThucHoc_Id)
     "Xem danh sách đăng ký chi tiết"
         DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP  pkg_dangkyhoc_thongtin2.LayDSDangKyHoc
         (+ strTKB_HinhThucHoc_Id, strHanhDong_XacNhan_Id, strKieuHoc_Id)
     "Xem kết quả đăng ký chi tiết(cán bộ đăng ký)"
         DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIFLgIgLwMu  PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo
         (+ strTKB_HinhThucHoc_Id, strKieuHoc_Id) — vẽ vào bảng Đăng ký chi tiết
     "Xem danh sách rút đăng ký"
         DKH_ThongTin2_MH/DSA4BRITNDUFIC8mCjgJLiIP  pkg_dangkyhoc_thongtin2.LayDSRutDangKyHoc (+ strKieuHoc_Id)
     Phân trang máy chủ (mặc định 10 dòng như gốc). Lọc ở MÁY TRẠM (tải trang 1 ×
     100000 dòng rồi lọc) khi chọn "Loại lớp" (mọi bảng) hoặc "Chỉ hiện đăng ký chưa
     nộp tiền" / "đã chuyển kế toán" (bảng đăng ký chi tiết) — đúng như gốc.

   Nút trên khung Danh sách:
     Tổng hợp công nợ   TC_NguoiHoc/TongHopDuNoSinhVien (tuần tự từng SV)     ← dòng Đăng ký chi tiết
     Cân bằng nợ        PKG_DANGKYHOC_THONGTIN2.Them_TT_XacNhan_TT_CT_TC       ← dòng Đăng ký chi tiết
     Hủy cân bằng nợ    PKG_DANGKYHOC_THONGTIN2.Xoa_TT_XacNhan_TT_CT_TC        ← dòng Đăng ký chi tiết
     Thuộc tính phục vụ tính khối lượng · Thiết lập chế độ tính phí · Hủy phí tín chỉ   (hộp, _lhp_hop.js)
     Thực hiện rút học phần (khung, _lhp_don.js)   ← dòng Đăng ký chi tiết, không có thì dòng Rút đăng ký
     Tạo danh sách nhập điểm   pkg_diem_phanquyen.TaoDuLieuNhapDiem
     Thiết lập lớp riêng       DKH_PhanCong_LopHP/ThietDatThuocTinhLopRieng (dLopRieng 1/0)
     Thiết đặt lớp không tín phí      PKG_DANGKYHOC_THONGTIN2.ThietDatKhongTinhPhi (dKhongTinhPhi 1/0)
     Thiết đặt lớp không tổ chức thi  PKG_DANGKYHOC_THONGTIN2.ThietDatKhongToChucThi (dKhongToChucThi 1/0)
   "Xuất báo cáo": ums.report.mount (= getList_MauImport "zonebtnBaoCao_LopHocPhan"),
     cùng các cặp addKeyValue của gốc — kể cả mọi dòng đang đánh dấu ở CẢ BA bảng
     (strDangKy_LopHocPhan_Id) và từng trạng thái SV đang đánh dấu. Gốc không có
     vùng Import → import: false.

   Lỗi gốc đã sửa (ghi chi tiết ở can-quyet):
     · "Thiết đặt lớp không tín phí": hai nút radio mang HAI tên khác nhau, mã đọc
       name="ThietLapLopRieng" → chọn "Lớp không tính phí" gửi dKhongTinhPhi rỗng.
       Nay gửi đúng giá trị đã chọn (1 = không tính phí, 0 = tính phí). Ba hộp thiết
       lập đều bắt buộc chọn một lựa chọn (gốc không chọn vẫn gửi rỗng).
     · Bảng "cán bộ đăng ký" dùng chung bảng chi tiết: gốc bấm sang trang / đổi Loại
       lớp / tìm trong bảng thì gọi danh sách ĐĂNG KÝ CHI TIẾT (mất kết quả cán bộ) →
       nay giữ đúng danh sách đang xem. Riêng hai ô "chưa nộp tiền / đã chuyển kế
       toán" vẫn nạp Đăng ký chi tiết như gốc (hai ô này chỉ áp cho danh sách đó).
     · Sau các thao tác trên bảng chi tiết (công nợ, cân bằng nợ, rút) gốc luôn nạp
       lại "đăng ký chi tiết" → nay nạp lại danh sách đang xem của bảng đó.
     · Gốc dùng CHUNG một số trang (edu.system.pageIndex_default) cho mọi bảng và cả
       hộp "không đăng ký" → nay mỗi bảng một số trang; bấm "Xem …" về trang 1.
     · Ô "Số đã đăng ký (từ/đến)" gõ chữ: gốc gửi NaN → nay coi như để trống (-1).
     · Lưu/xoá hàng loạt: gốc nạp lại danh sách sau MỖI lời gọi → nay một lần.
   Bỏ (mã chết): console.log, genList_TrangThaiSV bản thứ nhất (ghi vào
   #DSTrangThaiSV_LHD không tồn tại, bị bản sau đè), _rebuildLoaiLopOptions (rỗng),
   thanh cuộn ngang phụ ở đầu bảng (.scroll-top-mirror — bảng mới tự vuốt ngang),
   khối <style>/<script> nhúng trong html (CSS → css/_lhp.css; sửa select2 trong modal
   → ums.ui.dialog tự lo), nhãn #lblLopHocPhan_Tong (gốc không bao giờ ghi) → nay
   hiện tổng số dòng cạnh chữ "Danh sách".
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, L = ums.lhp;
    var root = document.getElementById('lophocphan');
    if (!root) return;
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return L.uid(); }
    function iM() { return (ums.session && ums.session.iM) || ''; }
    function tien(v) { return ui.money(v); }

    function nutCC(a, t, icon, mod) { return ui.btn('add', { text: t, icon: icon, mod: mod, attr: { 'data-a': a } }); }
    root.innerHTML =
        '<div data-v="ds">' +
            ums.pat.page('Lớp học phần', '') +
            '<div data-z="loc"></div>' +
            ums.pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'tong', flush: true, cls: 'lhp-ds',
                tools:
                    nutCC('tonghop', 'Tổng hợp công nợ', 'fa-coins', 'out-primary') +
                    nutCC('canbang', 'Cân bằng nợ', 'fa-scale-balanced', 'out-success') +
                    nutCC('huycanbang', 'Hủy cân bằng nợ', 'fa-ban', 'out-danger') +
                    nutCC('klgd', 'Thuộc tính phục vụ tính khối lượng', 'fa-scale-balanced', 'out-primary') +
                    nutCC('chedo', 'Thiết lập chế độ tính phí', 'fa-money-check-dollar', 'out-success') +
                    nutCC('thuchienrut', 'Thực hiện rút học phần', 'fa-arrow-right-from-bracket', 'out-info') +
                    nutCC('nhapdiem', 'Tạo danh sách nhập điểm', 'fa-pen-field', 'out-success') +
                    nutCC('loprieng', 'Thiết lập lớp riêng', 'fa-users-between-lines', 'out-primary') +
                    nutCC('khongphi', 'Thiết đặt lớp không tín phí', 'fa-users-gear', 'out-success') +
                    nutCC('khongthi', 'Thiết đặt lớp không tổ chức thi', 'fa-screen-users', 'out-primary') +
                    nutCC('huyphi', 'Hủy phí tín chỉ', 'fa-ban', 'out-danger'),
                body: '<div class="lhp-pad" data-z="tim"></div>' +
                    '<div data-bang="lhp"></div><div data-bang="ct" hidden></div><div data-bang="rut" hidden></div>' }) +
        '</div>' +
        '<div data-v="don" hidden></div><div data-v="nhom" hidden></div><div data-v="rut" hidden></div>';

    function v(k) { return root.querySelector('[data-v="' + k + '"]'); }
    function bang(k) { return root.querySelector('[data-bang="' + k + '"]'); }
    function bangCua(k) { return k === 'cb' ? 'ct' : k; }
    L.ganChon(root);

    var dang = 'lhp';                           // danh sách đang xem: lhp | ct | cb | rut
    var trang = { lhp: { index: 1, size: 10 }, ct: { index: 1, size: 10 }, cb: { index: 1, size: 10 }, rut: { index: 1, size: 10 } };
    var ds = { lhp: [], ct: [], rut: [] };      // dữ liệu đang vẽ của từng bảng (tra dòng theo ID)
    var luot = 0;

    var loc = L.boLoc(root.querySelector('[data-z="loc"]'), {
        onXem: function (a) {
            if (a === 'kdk') {
                var kh = loc.v('kh');
                if (!kh) { ui.toast('Vui lòng chọn kế hoạch đăng ký?', 'warn'); return; }
                return L.hopKhongDK(kh);
            }
            tim.xoa(true); tim.huyCache();
            trang[a].index = 1;
            nap(a);
        },
        onLoaiLop: function () { tim.xoa(true); tim.huyCache(); trang[dang].index = 1; nap(dang); },
        onLocCT: function () {
            if (bangCua(dang) !== 'ct') return;
            tim.xoa(true); tim.huyCache(); trang.ct.index = 1; nap('ct');
        }
    });

    var tim = L.tim(root.querySelector('[data-z="tim"]'), {
        dangXem: function () { return dang; },
        bang: function (k) { return bang(bangCua(k)); },
        taiHet: function (k) { return goi(k, { tuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (x) { return x.rows; }); },
        veLoc: function (k, rows) { ve(k, rows, rows.length, 'tim'); },
        veLai: function (k) { nap(k); }
    });

    /* ---------- Tham số + lời gọi danh sách --------------------------------- */
    function mayTram(k) {
        return !!loc.loaiLop() || (k === 'ct' && (loc.chuaNop() || loc.daChuyenKT()));
    }
    function thamSo(k, ov) {
        var p = loc.chung(), t = trang[k], may = mayTram(k);
        if (ov && ov.tuKhoa !== undefined) p.strTuKhoa = ov.tuKhoa;
        p.pageIndex = may ? 1 : (ov ? ov.pageIndex : t.index);
        p.pageSize = may ? 100000 : (ov ? ov.pageSize : t.size);
        var htt = loc.v('htt');
        if (k === 'lhp') {
            p.action = 'DKH_BaoCao_MH/DSA4BRINLjEJLiIRKSAvESkgLxUzIC8m';
            p.func = 'pkg_dangkyhoc_baocao.LayDSLopHocPhanPhanTrang';
            p.strTKB_HinhThucHoc_Id = htt;
        } else if (k === 'ct') {
            p.action = 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP';
            p.func = 'pkg_dangkyhoc_thongtin2.LayDSDangKyHoc';
            p.strTKB_HinhThucHoc_Id = htt;
            p.strHanhDong_XacNhan_Id = loc.v('hd');
            p.strKieuHoc_Id = loc.v('kieu');
        } else if (k === 'cb') {
            p.action = 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIFLgIgLwMu';
            p.func = 'PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo';
            p.strTKB_HinhThucHoc_Id = htt;
            p.strKieuHoc_Id = loc.v('kieu');
        } else {
            p.action = 'DKH_ThongTin2_MH/DSA4BRITNDUFIC8mCjgJLiIP';
            p.func = 'pkg_dangkyhoc_thongtin2.LayDSRutDangKyHoc';
            p.strKieuHoc_Id = loc.v('kieu');
        }
        p.iM = iM();
        return p;
    }
    /* Lớp riêng? — _isLopRiengRecord của gốc: bảng lớp HP xem HOCPHITINHRIENG
       (nếu có), không thì dò chữ "riêng/rieng" trong LOAILOP (bảng lớp) / LOPRIENG (bảng chi tiết, rút) */
    function laRieng(r, k) {
        if (k === 'lhp' && r.HOCPHITINHRIENG !== null && r.HOCPHITINHRIENG !== undefined) return !!r.HOCPHITINHRIENG;
        var s = String(e(k === 'lhp' ? r.LOAILOP : r.LOPRIENG)).toLowerCase();
        if (!s) return false;
        if (s.indexOf('rieng') >= 0 || s.indexOf('riêng') >= 0) return true;
        return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '').indexOf('rieng') >= 0 : false;
    }
    /* Gọi + lọc máy trạm (chưa nộp / đã chuyển KT / loại lớp) → { rows, total, may } */
    function goi(k, ov) {
        return ums.api.call(thamSo(k, ov)).then(function (r) {
            var rows = arr(r.data), total = r.pager || 0, may = mayTram(k);
            if (k === 'ct' && (loc.chuaNop() || loc.daChuyenKT())) {
                var cn = loc.chuaNop(), dk = loc.daChuyenKT();
                rows = rows.filter(function (x) {
                    if (cn) {
                        var t = x.SOTIENDANOP !== null && x.SOTIENDANOP !== undefined ? x.SOTIENDANOP : x.TONGSOTIENDANOP;
                        if ((parseFloat(t) || 0) !== 0) return false;
                    }
                    if (dk && (!x.DACHUYENKETOAN || parseInt(x.DACHUYENKETOAN, 10) === 0)) return false;
                    return true;
                });
            }
            var loai = loc.loaiLop();
            if (loai) rows = rows.filter(function (x) { var rg = laRieng(x, bangCua(k)); return loai === 'rieng' ? rg : !rg; });
            if (may) total = rows.length;
            return { rows: rows, total: total, may: may };
        });
    }

    function hien(k) {
        dang = k;
        ['lhp', 'ct', 'rut'].forEach(function (b) { bang(b).hidden = b !== bangCua(k); });
    }
    function nap(k) {
        hien(k);
        var sh = ++luot, z = bang(bangCua(k));
        z.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return goi(k).then(function (x) {
            if (sh !== luot) return;
            ve(k, x.rows, x.total, x.may ? 'may' : 'chu');
        }).catch(function (err) {
            if (sh !== luot) return;
            z.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách');
        });
    }

    /* ---------- Vẽ ba bảng --------------------------------------------------- */
    function nutO(a, id, text, kind, icon) {
        return ui.btn(kind || 'view', { text: text, icon: icon, mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': id } });
    }
    var COT = {
        lhp: function () {
            return [
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
                { title: 'Tên lớp', prop: 'TENLOP', cls: 'lhp-rong' },
                { title: 'Loại lớp', prop: 'LOAILOP', cls: 'is-center is-nowrap' },
                { title: 'Số tín chỉ', prop: 'SOTINCHI', cls: 'is-center' },
                { title: 'Phân bổ', prop: 'THONGTINPHANBO', cls: 'is-center' },
                { title: 'Mã GV', prop: 'MAGV', cls: 'is-center' },
                { title: 'Chức danh', prop: 'CHUCDANH', cls: 'is-center' },
                { title: 'Tên GV', prop: 'TENGV', cls: 'is-nowrap' },
                { title: 'Chương trình mở lớp', prop: 'CHUONGTRINHMOLOP', cls: 'lhp-vua' },
                { title: 'Phí phải nộp', cls: 'is-right is-nowrap', render: function (r) { return tien(r.PHIPHAINOP); } },
                { title: 'Phí đã nộp', cls: 'is-right is-nowrap', render: function (r) { return tien(r.PHIDANOP); } },
                { title: 'Thông tin lịch', cls: 'lhp-lich', prop: 'THOIGIANCHITIET' },
                { title: 'Hình thức học', render: function (r) { var m = e(r.HINHTHUCHOC_MA); return esc(m ? e(r.HINHTHUCHOC_TEN) + ' - ' + m : e(r.HINHTHUCHOC_TEN)); } },
                { title: 'Đã phân công', cls: 'is-center', render: function (r) { return nutO('phamvi', r.ID, 'Xem', 'view', 'fa-eye'); } },
                { title: 'Số sv đã đăng ký', cls: 'is-center', render: function (r) {
                    return r.SOSVDADANGKY ? nutO('dssv', r.ID, String(r.SOSVDADANGKY), 'view', 'fa-users') : '';
                } },
                { title: 'Số sv dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' },
                { title: 'Lớp riêng', cls: 'is-nowrap', render: function (r) { return r.HOCPHITINHRIENG ? 'Lớp riêng' : ''; } },
                { title: 'Tính phí', cls: 'is-nowrap', render: function (r) { return r.KHONGTINHPHI ? 'Không tính phí' : ''; } },
                { title: 'Tổ chức thi', cls: 'is-nowrap', render: function (r) { return r.KHONGTOCHUCTHI ? 'Không tổ chức thi' : ''; } },
                { title: 'Thuộc tính KLGD', prop: 'PHANLOAICACHTINH_TEN' },
                { title: 'Chế độ tính phí', prop: 'CHEDOTINHPHI_TEN' },
                { title: 'Dồn lớp', cls: 'is-center', render: function (r) { return nutO('donlop', r.ID, 'Dồn lớp', 'add', 'fa-people-arrows'); } },
                { title: 'Dồn nhóm lớp', cls: 'is-center', render: function (r) { return nutO('donnhom', r.ID, 'Dồn nhóm', 'add', 'fa-people-group'); } },
                L.cotChon('lhp')
            ];
        },
        ct: function () {
            var SV = ['Thông tin sinh viên'], DK = ['Thông tin đăng ký'];
            return cotSV(SV).concat([
                { group: DK, title: 'Loại lớp', prop: 'LOPRIENG', cls: 'is-nowrap' },
                { group: DK, title: 'Mã lớp học phần', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' },
                { group: DK, title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN', cls: 'lhp-rong' },
                { group: DK, title: 'Học phần', cls: 'lhp-rong', render: function (r) { return esc(L.tenMa(r.DAOTAO_HOCPHAN_TEN, r.DAOTAO_HOCPHAN_MA)); } },
                { group: DK, title: 'Hình thức học', prop: 'TENHINHTHUCHOC' },
                { group: DK, title: 'Số tín', prop: 'SOTINCHI', cls: 'is-center' },
                { group: DK, title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-nowrap' },
                { group: DK, title: 'Ngày đăng ký', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                { group: DK, title: 'TK đăng ký', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-center' },
                { group: DK, title: 'Chương trình đăng ký', cls: 'lhp-vua', render: function (r) { return esc(L.tenMa(r.DAOTAO_CHUONGTRINHDK_TEN, r.DAOTAO_CHUONGTRINHDK_MA)); } },
                { group: DK, title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return tien(r.SOTIEN); } },
                { group: DK, title: 'Số tiền 1', cls: 'is-right is-nowrap', render: function (r) { return tien(r.SOTIEN1); } },
                { group: DK, title: 'Số tiền 2', cls: 'is-right is-nowrap', render: function (r) { return tien(r.SOTIEN2); } },
                { group: DK, title: 'Đã nộp', cls: 'is-right is-nowrap', render: function (r) {
                    return tien(r.SOTIENDANOP !== null && r.SOTIENDANOP !== undefined ? r.SOTIENDANOP : r.TONGSOTIENDANOP);
                } },
                { group: DK, title: 'Tổng nợ', cls: 'is-right is-nowrap', render: function (r) { return tien(r.TONGNO); } },
                { group: DK, title: 'Tổng dư', cls: 'is-right is-nowrap', render: function (r) { return tien(r.TONGDU); } },
                { group: DK, title: 'Khoản phí', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'is-center is-nowrap' },
                { group: DK, title: 'Đã chuyển kế toán', cls: 'is-right is-nowrap', render: function (r) { return r.DACHUYENKETOAN ? 'Đã chuyển' : 'Chưa chuyển'; } },
                { group: DK, title: 'SV Xác nhận', prop: 'HANHDONG_XACNHAN_TEN', cls: 'is-center' },
                L.cotChon('ct')
            ]);
        },
        rut: function () {
            var R = ['Thông tin rút'], DK = ['Thông tin đăng ký'];
            return [
                { group: R, title: 'Người rút', prop: 'NGUOIRUT_TAIKHOAN', cls: 'is-center' },
                { group: R, title: 'Thời gian rút', prop: 'NGAYRUT_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                { group: R, title: 'Phần trăm phí', prop: 'PHANTRAMPHITINH', cls: 'is-center' }
            ].concat(cotSV(['Thông tin sinh viên'])).concat([
                { group: DK, title: 'Loại lớp', prop: 'LOPRIENG', cls: 'is-center is-nowrap' },
                { group: DK, title: 'Mã lớp học phần', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-center is-nowrap' },
                { group: DK, title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN', cls: 'lhp-rong' },
                { group: DK, title: 'Học phần', cls: 'lhp-rong', render: function (r) { return esc(L.tenMa(r.DAOTAO_HOCPHAN_TEN, r.DAOTAO_HOCPHAN_MA)); } },
                { group: DK, title: 'Số tín', prop: 'SOTINCHI', cls: 'is-center' },
                { group: DK, title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-center is-nowrap' },
                { group: DK, title: 'Ngày đăng ký', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                { group: DK, title: 'TK đăng ký', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-center' },
                { group: DK, title: 'Chương trình đăng ký', cls: 'lhp-vua', render: function (r) { return esc(L.tenMa(r.DAOTAO_CHUONGTRINHDK_TEN, r.DAOTAO_CHUONGTRINHDK_MA)); } },
                L.cotChon('rut')
            ]);
        }
    };
    function cotSV(G) {
        return [
            { group: G, title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { group: G, title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', cls: 'is-nowrap' },
            { group: G, title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
            { group: G, title: 'Chương trình', cls: 'lhp-vua', render: function (r) { return esc(L.tenMa(r.DAOTAO_TOCHUCCHUONGTRINH_TEN, r.DAOTAO_TOCHUCCHUONGTRINH_MA)); } },
            { group: G, title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
            { group: G, title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN', cls: 'lhp-vua' }
        ];
    }

    /* cach: 'chu' = phân trang máy chủ · 'may' = đã tải hết, phân trang máy trạm ·
             'tim' = kết quả ô "Tìm trong bảng" (hiện hết, không phân trang — như gốc) */
    function ve(k, rows, total, cach) {
        var b = bangCua(k), t = trang[k];
        ds[b] = rows;
        var dem = root.querySelector('[data-z="tong"]');
        if (dem) dem.textContent = '(' + total + ')';
        var hienRows = rows, page;
        if (cach === 'may') {
            var pages = Math.max(1, Math.ceil(rows.length / t.size));
            if (t.index > pages) t.index = pages;
            hienRows = rows.slice((t.index - 1) * t.size, t.index * t.size);
            page = { index: t.index, size: t.size, total: rows.length,
                onChange: function (p) { t.index = p; ve(k, rows, total, 'may'); },
                onSize: function (s) { t.size = s; t.index = 1; ve(k, rows, total, 'may'); } };
        } else if (cach === 'chu') {
            page = { index: t.index, size: t.size, total: total,
                onChange: function (p) { t.index = p; nap(k); },
                onSize: function (s) { t.size = s; t.index = 1; nap(k); } };
        }
        ui.table({ el: bang(b), rows: hienRows, columns: COT[b](), page: page, empty: 'Không có dữ liệu', tableCls: 'ums-table--lined lhp-bang lhp-bang--' + b });
        tim.lamMoi();
    }

    /* ---------- Dòng đang đánh dấu ----------------------------------------- */
    function chon(b) {
        return L.idChon(bang(b), b).map(function (id) {
            return ds[b].filter(function (r) { return String(r.ID) === String(id); })[0];
        }).filter(Boolean);
    }
    function canChon(b, msg) {
        var ids = L.idChon(bang(b), b);
        if (!ids.length) { ui.toast(msg, 'warn'); return null; }
        var rs = chon(b);
        if (!rs.length) { ui.toast('Không tìm thấy dữ liệu các dòng đã chọn?', 'warn'); return null; }
        return rs;
    }
    /* Bảng chi tiết đang xem danh sách nào (ct hay cb) — nạp lại đúng danh sách đó */
    function dsCT() { return dang === 'cb' ? 'cb' : 'ct'; }

    /* ---------- Báo cáo (getList_MauImport) --------------------------------- */
    ums.report.mount(loc.bc, { import: false, collect: function (add) {
        add('strDaoTao_ThoiGianDaoTao_Id', loc.v('tg'));
        add('strDaoTao_KhoaDaoTao_Id', loc.v('khoa'));
        add('strDaoTao_ChuongTrinh_Id', loc.v('ct'));
        add('strDaoTao_HocPhan_Id', loc.v('hp'));
        add('strDaoTao_HeDaoTao_Id', loc.v('he'));
        add('strDaoTao_KhoaQuanLy_Id', loc.v('kql'));
        add('strDangKy_KeHoachDangKy_Id', loc.v('kh'));
        add('strTKB_HinhThucHoc_Id', loc.v('htt'));
        add('strKieuHoc_Id', loc.v('kieu'));
        add('strTuKhoa', loc.tuKhoa());
        add('dChiLayCacLopChuaPhanCong', loc.chuaPhanCong());
        add('dSoDaDangTuSo', loc.soTu());
        add('dSoDaDangDenSo', loc.soDen());
        ['lhp', 'ct', 'rut'].forEach(function (b) {
            L.idChon(bang(b), b).forEach(function (id) { add('strDangKy_LopHocPhan_Id', id); });
        });
        loc.tt.ids().forEach(function (id) { add('strTrangThaiNguoiHoc_Id', id); });
    } });

    /* ---------- Ba khung thay chỗ danh sách --------------------------------- */
    function moKhung(k) { ui.swap(v('ds'), v(k)); }
    function veDS(k) { v(k).hidden = true; v(k).innerHTML = ''; ui.swap(v(k), v('ds')); }

    /* ---------- Thiết lập 1/0 cho lớp đã chọn ------------------------------- */
    function thietLap(cau, lua, mk, tieuDe) {
        var rs = canChon('lhp', 'Vui lòng chọn đối tượng?');
        if (!rs) return;
        L.hoiChon({ title: tieuDe, cau: cau, lua: lua }).then(function (gt) {
            if (gt === null) return;
            ui.batch(rs.map(function (r) { return mk(r.ID, gt); }), { title: tieuDe, okText: 'Thành công' })
                .then(function () { nap('lhp'); });
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        if (!v('ds').contains(b) || loc.bc.contains(b) || root.querySelector('[data-z="loc"]').contains(b)) return;
        var a = b.getAttribute('data-a'), id = b.getAttribute('data-id'), rs;
        var lop = id ? ds.lhp.filter(function (r) { return String(r.ID) === String(id); })[0] : null;

        if (a === 'phamvi') return L.hopPhamVi(id);
        if (a === 'dssv') return L.hopSinhVien(id);
        if (a === 'donlop' && lop) {
            moKhung('don');
            return L.donLop(v('don'), {
                lop: lop,
                lopCungHP: ds.lhp.filter(function (r) { return r.ID !== lop.ID && r.DAOTAO_HOCPHAN_ID === lop.DAOTAO_HOCPHAN_ID; }),
                dong: function () { veDS('don'); nap('lhp'); }
            });
        }
        if (a === 'donnhom' && lop) {
            moKhung('nhom');
            return L.donNhom(v('nhom'), { lop: lop, dong: function () { veDS('nhom'); nap('lhp'); } });
        }

        if (a === 'tonghop') {
            rs = canChon('ct', 'Vui lòng chọn ít nhất một bản ghi ở danh sách chi tiết?');
            if (!rs) return;
            rs = rs.filter(function (r) { return r.QLSV_NGUOIHOC_ID; });
            if (!rs.length) { ui.toast('Không tìm thấy dữ liệu các dòng đã chọn?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn tổng hợp công nợ cho ' + rs.length + ' bản ghi đã chọn?', { title: 'Tổng hợp công nợ' }).then(function (ok) {
                if (!ok) return;
                // Tuần tự từng sinh viên như gốc (runNext)
                ui.batch(rs.map(function (r) {
                    return { action: 'TC_NguoiHoc/TongHopDuNoSinhVien', strNguoiThucHien_Id: uid(), strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID };
                }), { title: 'Đang tổng hợp công nợ', okText: 'Tổng hợp công nợ thành công' }).then(function () { nap(dsCT()); });
            });
        } else if (a === 'canbang' || a === 'huycanbang') {
            rs = canChon('ct', 'Vui lòng chọn ít nhất một bản ghi ở danh sách chi tiết?');
            if (!rs) return;
            var huy = a === 'huycanbang';
            ui.confirm('Bạn có chắc chắn ' + (huy ? 'hủy cân bằng nợ' : 'cân bằng nợ') + ' cho ' + rs.length + ' bản ghi đã chọn?',
                huy ? { tone: 'bad', ok: 'Hủy cân bằng nợ' } : { title: 'Cân bằng nợ' }).then(function (ok) {
                if (!ok) return;
                ui.batch(rs.map(function (r) {
                    return {
                        action: huy ? 'DKH_ThongTin2_MH/GS4gHhUVHhkgIg8pIC8eFRUeAhUeFQIP' : 'DKH_ThongTin2_MH/FSkkLB4VFR4ZICIPKSAvHhUVHgIVHhUC',
                        func: huy ? 'PKG_DANGKYHOC_THONGTIN2.Xoa_TT_XacNhan_TT_CT_TC' : 'PKG_DANGKYHOC_THONGTIN2.Them_TT_XacNhan_TT_CT_TC',
                        iM: iM(), strDangKy_LopHocPhan_Id: r.DANGKY_LOPHOCPHAN_ID, strKieuHoc_Id: r.KIEUHOC_ID,
                        strTaiChinh_CacKhoanThu_Id: r.TAICHINH_CACKHOANTHU_ID, strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                        strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid(),
                        strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: ''
                    };
                }), { title: huy ? 'Đang hủy cân bằng nợ' : 'Đang cân bằng nợ', okText: huy ? 'Hủy cân bằng nợ thành công' : 'Cân bằng nợ thành công' })
                    .then(function () { nap(dsCT()); });
            });
        } else if (a === 'klgd') {
            rs = canChon('lhp', 'Vui lòng chọn lớp học phần?');
            if (rs) L.hopThuocTinh(rs, function () { nap('lhp'); });
        } else if (a === 'chedo') {
            rs = canChon('lhp', 'Vui lòng chọn lớp học phần?');
            if (rs) L.hopCheDo(rs, function () { nap('lhp'); });
        } else if (a === 'huyphi') {
            rs = canChon('lhp', 'Vui lòng chọn lớp học phần?');
            if (rs) L.hopHuyPhi(rs, function () { nap('lhp'); });
        } else if (a === 'thuchienrut') {
            /* Ưu tiên dòng đánh dấu ở bảng Đăng ký chi tiết, không có thì bảng Rút đăng ký */
            var nguon = L.idChon(bang('ct'), 'ct').length ? 'ct' : (L.idChon(bang('rut'), 'rut').length ? 'rut' : null);
            if (!nguon) { ui.toast("Vui lòng chọn bản ghi ở bảng 'Đăng ký chi tiết' hoặc 'Rút đăng ký'?", 'warn'); return; }
            rs = chon(nguon);
            if (!rs.length) { ui.toast('Không tìm thấy dữ liệu các dòng đã chọn?', 'warn'); return; }
            var dsNap = nguon === 'rut' ? 'rut' : dsCT();
            moKhung('rut');
            L.rut(v('rut'), { ds: rs, dong: function (daChay) {
                if (!v('rut').hidden) veDS('rut');
                if (daChay) nap(dsNap);
            } });
        } else if (a === 'nhapdiem') {
            rs = canChon('lhp', 'Vui lòng chọn đối tượng?');
            if (!rs) return;
            ui.batch(rs.map(function (r) {
                return { action: 'D_PhanQuyen_MH/FSAuBTQNKCQ0DykgMQUoJCwP', func: 'pkg_diem_phanquyen.TaoDuLieuNhapDiem',
                    iM: iM(), strDaoTao_LopHocPhan_Id: r.ID, strNguoiThucHien_Id: uid() };
            }), { title: 'Đang tạo danh sách nhập điểm', okText: 'Thực hiện thành công' });
        } else if (a === 'loprieng') {
            thietLap('Chọn thiết lập lớp riêng?', [{ v: '1', t: 'Là lớp riêng' }, { v: '0', t: 'Không phải lớp riêng' }], function (lid, gt) {
                return { action: 'DKH_PhanCong_LopHP/ThietDatThuocTinhLopRieng', type: 'POST',
                    strDaoTao_LopHocPhan_Id: lid, strNguoiThucHien_Id: uid(), dLopRieng: gt };
            }, 'Thiết lập lớp riêng');
        } else if (a === 'khongphi') {
            thietLap('Chọn Thiết đặt lớp không tín phí?', [{ v: '1', t: 'Lớp không tính phí' }, { v: '0', t: 'Lớp tính phí' }], function (lid, gt) {
                return { action: 'DKH_ThongTin2_MH/FSkoJDUFIDUKKS4vJhUoLykRKSgP', func: 'PKG_DANGKYHOC_THONGTIN2.ThietDatKhongTinhPhi',
                    iM: iM(), strDaoTao_LopHocPhan_Id: lid, strNguoiThucHien_Id: uid(), dKhongTinhPhi: gt };
            }, 'Thiết đặt lớp không tín phí');
        } else if (a === 'khongthi') {
            thietLap('Thiết đặt lớp không tổ chức thi?', [{ v: '1', t: 'Lớp không tổ chức thi' }, { v: '0', t: 'Lớp tổ chức thi' }], function (lid, gt) {
                return { action: 'DKH_ThongTin2_MH/FSkoJDUFIDUKKS4vJhUuAik0IhUpKAPP', func: 'PKG_DANGKYHOC_THONGTIN2.ThietDatKhongToChucThi',
                    iM: iM(), strDaoTao_LopHocPhan_Id: lid, strNguoiThucHien_Id: uid(), dKhongToChucThi: gt };
            }, 'Thiết đặt lớp không tổ chức thi');
        }
    });

    bang('lhp').innerHTML = ui.empty('Chọn điều kiện lọc rồi bấm "Xem danh sách lớp học phần"', 'fa-hand-pointer');
})();
