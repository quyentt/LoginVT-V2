/* =========================================================================
   Thu tiền khác (thu / rút tiền của ĐỐI TƯỢNG KHÁC — không phải sinh viên)
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/thutienkhac.html
            + scripts/thutienkhac.js (4.619 dòng, PhieuThuKhac)
   Dùng chung: scripts/_chung_khac.js (ums.phieuthuKhac); xem/in: ums.phieu (assets/js/phieu.js)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn từ bản gốc):
     Đối tượng
       SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0eBS4oFSAi
           PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All_DoiTac    danh sách đối tượng (phân trang 10)
       TC_ThongTin_MH/FSkkLB4FLigVNC4vJgopICIP  pkg_taichinh_thongtin.Them_DoiTuongKhac
       TC_ThongTin_MH/EjQgHgUuKBU0Li8mCikgIgPP  pkg_taichinh_thongtin.Sua_DoiTuongKhac
       TC_DoiTuongKhac/Xoa                               strIds
     Tình hình tài chính
       TC_ThongTinChung/LayDanhSach (GET)                các bảng nợ / thừa / thu hộ / theo đợt + tổng
       TC_ThongTinChung/LayDSKhoanPhaiNop, …Mien, …DaNop, …DaRut, …NoRieng,
         …NoChung, …DuRieng, …DuChung, LayDSPhieuDaThu, …PhieuDaRut, …PhieuHoaDon (GET)
       TC_KhoanPhaiNop/CapNhat · TC_KhoanDaNop/CapNhat   sửa khoản (hộp thoại)
       TC_NguoiHoc_QuanLy/LayDSHopDong · TC_NguoiHoc_QuanLy/LayDanhSach (GET)
       TC_DaNop_PhanBo/ThemMoi                           phân bổ khoản đã nộp
     Thu / rút
       TC_DaNop/ThemMoi            "Xuất biên lai" (thu), "Xuất hóa đơn" (nộp trước),
                                   "Thu tiền không sinh HĐBL", nút hoá đơn điện tử
       TC_TaiChinh_Rut/ThemMoi     "Xuất biên lai" (rút)
       HDDT_HoaDon/ThemMoi · HDDT_HoaDon/ThemMoi_Nhap
       TC_HoaDonNhap/ThemMoi · TC_HoaDonNhap_ChuaThu/ThemMoi
       TC_SoBienLai/HuyBienLai     huỷ chứng từ
       TC_ThongTinChung/DocSoThanhChu (GET)  đọc số thành chữ theo loại tiền
     Danh mục: CM_DanhMucDuLieu/LayDanhSach (QLSV.TRANGTHAI, TAICHINH.NUTHDDT),
       TC_KhoanThu/LayDanhSach, CMS_DanhMucThuocTinh/… (QLTC.HTTHU, QLTC.LTT,
       TAICHINH.DVT, QLTC.DHV, QLSV.TNH, TAICHINH.HOPDONG.PHANLOAI), ums.ref.*

   PHÉP TÍNH TIỀN (giữ nguyên bản gốc)
     · Ô số tiền nhập theo quy ước dấu phẩy nghìn; bỏ khoảng trắng + dấu phẩy
       rồi parseFloat (getSoTien).
     · "Tổng tiền đã chọn" = Σ(dòng đã chọn) số tiền × số lượng khi loại tính
       là DONGIARATIEN (mặc định), chỉ Σ số tiền khi TIENRADONGIA; làm tròn
       XUỐNG 2 chữ số thập phân (countFloat).
     · Phiếu viết: bỏ dòng có số tiền = 0; đơn giá = số tiền ô nhập; thành
       tiền = đơn giá × số lượng. Riêng NỘP TRƯỚC với TIENRADONGIA: thành
       tiền = số tiền nhập, đơn giá = floor(số tiền / số lượng × 100) / 100.
     · Tổng phiếu = Σ thành tiền làm tròn xuống 2 chữ số; = 0 thì không mở phiếu.
     · Gửi lên: strSoLuong_s, strDonGia_s, strTaiChinh_SoTien_s = từng giá
       trị đã parseFloat, nối bằng dấu phẩy; nội dung nối bằng "#".

   KHÁC BẢN GỐC — sửa lỗi rõ ràng (ghi cả trong báo cáo)
     1. save_HD (Xuất hóa đơn, tab Nộp trước) đọc SAI CỘT: bản gốc lấy ô chọn
        ĐVT làm số lượng (→ "NaN"), số lượng làm đơn giá, đơn giá làm số
        tiền. Ở đây đọc đúng cột như save_HDBL.
     2. Nút "Thu tiền không sinh HĐBL" hiện cả khi viết phiếu RÚT, bấm vào
        lại gọi TC_DaNop/ThemMoi (THU). Ở đây chỉ hiện với phiếu thu.
     3. Ô số tiền ở tab khoản thừa: bản gốc so với thuộc tính name (không
        có) nên mọi lần sửa đều bị đặt về 0. Ở đây: không được vượt số tiền
        gốc của dòng (đúng ý "rút không được rút quá").
     4. Tình hình theo đợt: bản gốc cộng arrDot_No[i] (chỉ số vòng ngoài) và
        ghi đè vùng hiển thị ở mỗi đợt → chỉ hiện đợt cuối, tổng sai. Ở đây
        hiện mọi đợt, tổng = Σ các dòng của đợt.
     5. Đọc số thành chữ theo loại tiền: bản gốc gửi tổng cột ĐƠN GIÁ; ở đây
        gửi tổng thành tiền.
     6. Số lượng rỗng / sai → bản gốc gửi "NaN"; ở đây chặn, báo lỗi.
     7. Lọc phân bổ theo phạm vi: bản gốc so chữ trên dòng với ID danh mục
        (không bao giờ khớp). Ở đây so với tên phạm vi đã chọn.
   Giữ nguyên dù đáng ngờ (ghi chú, không đổi hành vi)
     · save_HDBL gửi strDonViTinh_Ids rỗng (đọc ô #dropDonViTinhPTC_PT_Edit
       đã bị comment trong mẫu) — ĐVT chọn từng dòng chỉ đi theo "Thu tiền
       không sinh HĐBL" / HĐĐT.
     · Phân bổ gửi cho MỌI dòng, kể cả dòng chưa nhập số tiền (dSoTien rỗng).
     · strTenNguoiThu gửi rỗng (ô #strTenNguoiThu không có trên màn gốc).
   Cố ý bỏ
     · Nút Xoá khoản phải nộp / đã nộp trong hộp sửa: bản gốc ẩn cứng
       (display:none), không có đường bật.
     · Popover ảnh/thông tin sinh viên khi rê chuột — đọc cột sinh viên
       (ANH, HODEM, NGAYSINH_NGAY…) không có ở đối tượng khác.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc;
    var PK = ums.phieuthuKhac, m = PK.m;
    var root = document.getElementById('thutienkhac');
    if (!root) return;

    var S = {
        dtHS: [],            // danh sách đối tượng trang hiện tại
        page: 1, total: 0,
        hsId: '',            // strHSSV_Id
        dt: null,            // dt_DoiTuongThu
        tab: 'tinhhinh',
        khoanThu: [], thoiGian: [], nutHDDT: [],
        phieuId: '',         // strPhieuThu_Id
        editId: ''           // đang sửa đối tượng
    };

    function ls(k, v) {
        try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (err) { return null; }
        return null;
    }

    /* ---------------------------------------------------------------------
       Khung
       --------------------------------------------------------------------- */
    var TABS = [
        ['tinhhinh', 'Tình hình học phí'],
        ['nochung', 'Khoản nợ chung'],
        ['norieng', 'Khoản nợ riêng'],
        ['thuachung', 'Khoản thừa chung'],
        ['thuarieng', 'Khoản thừa riêng'],
        ['noptruoc', 'Nộp trước'],
        ['thuho', 'Thu hộ'],
        ['theodot', 'Tình hình tài chính theo đợt']
    ];

    /* Bố cục hai cột dùng chung — ums.pat.master (BO-CUC mục 4).
       Tiêu đề trang để ngoài khung master vì khi viết phiếu cả khung bị thay chỗ. */
    root.insertAdjacentHTML('beforeend',
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Thu tiền khác</h1>' +
        '<div class="ums-page__actions" data-z="actions">' +
        ui.btn('add', { text: 'Thêm đối tượng', attr: { 'data-act': 'them-dt' } }) + '</div></div>' +
        '<div data-z="layout"></div>' +
        '<div data-z="phieu" hidden></div>');

    var mst = ums.pat.master({
        el: root.querySelector('[data-z="layout"]'),
        side: {
            title: 'Đối tượng thu', icon: 'fa-users', search: 'Nhập từ khóa tìm kiếm',
            filter:
                '<div class="ttk-side__loc">' +
                '<div data-z="loc" hidden>' +
                '<div class="ums-stack ums-stack--tight">' +
                '<select class="ums-select" data-z="he"></select><select class="ums-select" data-z="khoa"></select>' +
                '<select class="ums-select" data-z="ct"></select><select class="ums-select" data-z="lop"></select></div>' +
                '<div class="ums-legend ums-legend--cach ums-u-mb-2">Trạng thái sinh viên</div><div data-z="trangthai"></div>' +
                '</div></div>'
        },
        main: { title: false }
    });
    /* Hai biểu tượng ở đầu khung — giống hệt màn "Thu tiền"
       (_chung_thutien.js:365): kính lúp tìm, thanh trượt mở khung lọc nâng cao.
       Trước đây "Lọc nâng cao" là nút chữ nằm dưới ô tìm — hai màn cùng một
       việc mà hai kiểu. */
    mst.side.querySelector('.ums-panel__tools').innerHTML =
        '<button type="button" class="ums-iconbtn" data-act="tim" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' +
        '<button type="button" class="ums-iconbtn" data-act="loc" title="Lọc nâng cao"><i class="fa-light fa-sliders"></i></button>';
    mst.sideBody.setAttribute('data-z', 'list');
    mst.sideBody.insertAdjacentHTML('afterend', '<div class="ttk-pager" data-z="listPager"></div>');
    mst.search.setAttribute('data-z', 'key');

    /* Quy ước 1 của BO-CUC: biểu mẫu đối tượng chỉ hiện khi bấm "Thêm đối tượng"
       hoặc nút sửa trên một dòng — mở màn thì hiện lời nhắc chọn đối tượng. */
    mst.mainBody.innerHTML =
        '<div class="ums-panel" data-z="trong"><div class="ums-panel__body">' +
        ui.empty('Tìm và chọn một đối tượng ở danh sách bên trái, hoặc bấm "Thêm đối tượng"', 'fa-user-magnifying-glass') +
        '</div></div>' +
        '<div data-z="form" hidden></div>' +
        '<div data-z="dt" hidden></div>';

    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }

    /* ---------------------------------------------------------------------
       Danh mục khởi tạo
       --------------------------------------------------------------------- */
    var cas = ums.ref.cascade({
        he: z('he'), khoa: z('khoa'), ct: z('ct'), lop: z('lop'),
        labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Lớp quản lý' }
    });
    ['he', 'khoa', 'ct', 'lop'].forEach(function (k) { ui.select2(z(k), { placeholder: z(k).options[0] ? z(k).options[0].text : '' }); });

    var trangThai = PK.checks(z('trangthai'), [], {});
    var trangThaiReady = PK.cmDM('QLSV.TRANGTHAI').then(function (rows) {
        trangThai = PK.checks(z('trangthai'), rows, { all: 'Tất cả', checked: true });
    }).catch(function (err) { ums.api.handle(err, 'trạng thái sinh viên'); });

    /* getList_NutHDDT — nút hoá đơn điện tử cấu hình trong danh mục TAICHINH.NUTHDDT */
    PK.cmDM('TAICHINH.NUTHDDT').then(function (rows) { S.nutHDDT = rows; }).catch(function () { S.nutHDDT = []; });

    var khoanThuReady = PK.khoanThu().then(function (rows) { S.khoanThu = rows; drawKhoanNopTruoc(); return rows; })
        .catch(function (err) { ums.api.handle(err, 'danh mục khoản thu'); return []; });

    var thoiGianReady = ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (rows) { S.thoiGian = rows; fillHocKy(); return rows; })
        .catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); return []; });

    /* ---------------------------------------------------------------------
       Danh sách đối tượng (getList_HSSV)
       --------------------------------------------------------------------- */
    function loadHS(page) {
        if (page) S.page = page;
        var v = cas.values();
        z('list').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0eBS4oFSAi',
            func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All_DoiTac',
            strTuKhoa: z('key').value.trim(),
            strNguoiThucHien_Id: '',
            strVaiTroDangNhap_Id: '',
            strChucNangHeThong_Id: '',
            strHanhDong_Code: '',
            strDaoTao_HeDaoTao_Id: v.he,
            strDaoTao_KhoaDaoTao_Id: v.khoa,
            strDaoTao_ChuongTrinh_Id: v.ct,
            strDaoTao_KhoaQuanLy_Id: '',
            strDaoTao_LopQuanLy_Id: v.lop,
            strStudyStatus_Ids: trangThai.ids().toString(),
            dIsPrimary: '',
            dBoQuaPhamVi: 0,
            pageIndex: S.page,
            pageSize: 10
        }).then(function (r) {
            var rows = PK.rowsOf(r);
            // Bản gốc tự điền tên/mã từ các cột khác nhau tuỳ nguồn
            rows.forEach(function (x) {
                x.TENDOITUONG = x.TENDOITUONG || x.FULL_NAME || x.QLSV_NGUOIHOC_TEN || x.TEN || '';
                x.MASODOITUONG = x.MASODOITUONG || x.MASO || x.MA_NGUOIHOC_CHINH || x.QLSV_NGUOIHOC_MASO || '';
            });
            S.dtHS = rows;
            S.total = Number(r.pager) || rows.length;
            drawHS();
            /* KHÔNG tự chọn khi còn một kết quả — gõ là tự tìm, có thể nhiều người trùng tên (người dùng 2026-09-26) */
        }).catch(function (err) {
            z('list').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách đối tượng');
        });
    }

    /* Mục danh sách của ums.pat.master. Nút sửa nằm TRONG mục nên mục dựng
       bằng <div> (nút lồng trong nút là HTML không hợp lệ). */
    function drawHS() {
        if (!S.dtHS.length) {
            z('list').innerHTML = ui.empty('Không tìm thấy đối tượng', 'fa-user-magnifying-glass');
            z('listPager').innerHTML = '';
            return;
        }
        z('list').innerHTML = S.dtHS.map(function (r) {
            /* Mục danh sách chỉ để CHỌN — nút Sửa nằm trên đầu khung bên phải (người dùng 2026-09-26: bỏ nút edit trong
               danh sách, đưa về tiêu đề). Ảnh người chung: có ảnh thì ảnh, không thì biểu tượng. */
            return '<button type="button" class="ums-master__item ums-dsns__item" data-id="' + esc(r.ID) + '">' +
                ums.pat.anhNguoi(r.ANH) +
                '<span class="ums-master__item__main"><b>' + esc(r.TENDOITUONG) + '</b>' +
                '<span class="ums-master__item__sub">' + esc(r.MASODOITUONG) + '</span></span></button>';
        }).join('');
        z('listPager').innerHTML = ui.pager({ index: S.page, size: 10, total: S.total }, S.dtHS.length);
        z('listPager').querySelectorAll('.ums-pager__btn[data-go]').forEach(function (b) {
            b.addEventListener('click', function () { loadHS(Number(b.getAttribute('data-go'))); });
        });
        markHS();
    }

    function markHS() {
        root.querySelectorAll('[data-z="list"] [data-id]').forEach(function (it) {
            it.classList.toggle('is-active', it.getAttribute('data-id') === String(S.hsId));
        });
    }

    /* Cột trái (BO-CUC luật 12, 2026-09-26): gõ là tự tìm sau 400ms, Enter tìm ngay; nút trên tiêu đề = Tải lại; đổi ô lọc nâng cao là tự tải */
    var henTim = 0;
    function timSau(ms) { clearTimeout(henTim); henTim = setTimeout(function () { loadHS(1); }, ms); }
    z('key').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(henTim); loadHS(1); } });
    z('key').addEventListener('input', function () { timSau(400); });
    z('loc').addEventListener('change', function () { timSau(300); });

    z('list').addEventListener('click', function (ev) {
        var it = ev.target.closest('.ums-master__item[data-id]');
        if (it) chonDoiTuong(it.getAttribute('data-id'));
    });

    /* ---------------------------------------------------------------------
       Biểu mẫu đối tượng (thêm / sửa / xoá)
       --------------------------------------------------------------------- */
    var FORM = [
        ['strTenDoiTuong', 'TENDOITUONG', 'Đối tượng mua hàng'],
        ['strMaDoiTuong', 'MASODOITUONG', 'Mã đối tượng'],
        ['strCoQuanCongTac', 'COQUANCONGTAC', 'Cơ quan công tác'],
        ['strDiaChiCoQuanCongTac', 'DIACHICOQUANCONGTAC', 'Địa chỉ cơ quan'],
        ['strMaSoThueCaNhan', 'MASOTHUECANHAN', 'Mã số thuế'],
        ['strMaSoThueCoQuan', 'MASOTHUECOQUAN', 'Mã số thuế cơ quan'],
        ['strSoDienThoai', 'SODIENTHOAI', 'Số điện thoại'],
        ['strDiaChiEmail', 'DIACHIEMAIL', 'Email'],
        ['strLaHocVien_DoiTuong_Id', 'LAHOCVIEN_DOITUONG_ID', 'Dạng học viên', 'select'],
        ['strLaHocVien_Lop_Id', 'LAHOCVIEN_LOP_ID', 'Là học viên lớp', 'multi'],
        ['strNganHang_SoTaiKhoan', 'NGANHANG_SOTAIKHOAN', 'Số tài khoản'],
        ['strNganHang_ThuocNganHang_Id', 'NGANHANG_THUOCNGANHANG_ID', 'Thuộc ngân hàng', 'select'],
        ['strNganHang_ThongTinChiNhanh', 'NGANHANG_THONGTINCHINHANH', 'Chi nhánh NH'],
        ['strDiaChiLienLac', 'DIACHILIENLAC', 'Địa chỉ'],
        ['strCCCD', 'CCCD', 'CCCD'],
        ['strMaQuanHeNganSach', 'MAQUANHENGANSACH', 'Mã QHNS']
    ];

    (function drawForm() {
        var h = '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-user-plus"></i> <span data-z="ftitle">Thêm mới đối tượng xuất hóa đơn</span></div>' +
            /* Đóng — đứng đầu cụm nút như mọi biểu mẫu khác. Thiếu nút này thì
               mở nhầm "Thêm đối tượng" là kẹt ở biểu mẫu, phải chọn đại một đối
               tượng bên trái mới thoát ra được. */
            '<div class="ums-panel__tools">' +
            ui.btn('close', { attr: { 'data-act': 'dong-form' } }) +
            '<button type="button" class="ums-btn ums-btn--danger" data-act="xoa-dt" hidden><i class="fa-light fa-trash-can"></i><span>Xóa</span></button>' +
            ui.btn('save', { attr: { 'data-act': 'luu-dt' } }) + '</div></div>' +
            '<div class="ums-panel__body"><div class="ums-grid ums-grid--2">';
        FORM.forEach(function (f) {
            var ctl;
            if (f[3] === 'select') ctl = '<select class="ums-select" data-k="' + f[0] + '"><option value=""></option></select>';
            else if (f[3] === 'multi') ctl = '<select class="ums-select" data-k="' + f[0] + '" multiple></select>';
            else ctl = '<input class="ums-input" data-k="' + f[0] + '" autocomplete="off">';
            h += '<div>' + ui.field(f[2], ctl) + '</div>';
        });
        h += '</div></div></div>';
        z('form').innerHTML = h;
    })();

    function fk(k) { return z('form').querySelector('[data-k="' + k + '"]'); }

    ums.api.dm('QLTC.DHV').then(function (rows) {
        fk('strLaHocVien_DoiTuong_Id').innerHTML = ui.options(rows, { title: 'Chọn dạng học viên' });
        ui.select2(fk('strLaHocVien_DoiTuong_Id'), { placeholder: 'Chọn dạng học viên', allowClear: true });
    }).catch(function (err) { ums.api.handle(err, 'dạng học viên'); });
    ums.api.dm('QLSV.TNH').then(function (rows) {
        fk('strNganHang_ThuocNganHang_Id').innerHTML = ui.options(rows, { title: 'Chọn ngân hàng' });
        ui.select2(fk('strNganHang_ThuocNganHang_Id'), { placeholder: 'Chọn ngân hàng', allowClear: true });
    }).catch(function (err) { ums.api.handle(err, 'ngân hàng'); });
    // Bản gốc đổ lớp học viên từ cùng danh sách lớp của bộ lọc (khi mở màn: tất cả lớp)
    ums.ref.lopQuanLy({ pageIndex: 1, pageSize: 1000000 }).then(function (rows) {
        fk('strLaHocVien_Lop_Id').innerHTML = ui.options(rows, { title: false });
        ui.select2(fk('strLaHocVien_Lop_Id'), { placeholder: 'Chọn lớp học viên' });
    }).catch(function (err) { ums.api.handle(err, 'lớp học viên'); });

    function setVal(el, v) {
        if (!el) return;
        if (el.multiple) {
            var arr = !v ? [] : String(v).split(',');
            Array.prototype.forEach.call(el.options, function (o) { o.selected = arr.indexOf(o.value) >= 0; });
        } else el.value = v === null || v === undefined ? '' : v;
        if (window.jQuery && el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
    }
    function getVal(el) {
        if (el.multiple) {
            return Array.prototype.filter.call(el.options, function (o) { return o.selected && o.value !== '' && o.value !== 'SELECTALL'; })
                .map(function (o) { return o.value; }).join(',');
        }
        return (el.value || '').trim();
    }

    /* Ba vùng bên phải chỉ một vùng hiện: lời nhắc, biểu mẫu đối tượng, khung thu */
    function hienVung(ten) {
        var ds = ['trong', 'form', 'dt'].map(z);
        var cur = ds.filter(function (x) { return !x.hidden; })[0];
        var next = z(ten);
        /* Đang mở biểu mẫu thì ẨN cụm nút đầu trang — đúng bố cục chung
           (ums.crud và ums.pat.master().formMode): lúc đó việc duy nhất là Lưu
           hay Đóng, để "Thêm đối tượng" nằm đó vừa thừa vừa thành hai nút thêm
           trên cùng một màn. (Không dùng được formMode vì đầu trang ở ngoài
           khung master của màn này.) */
        var act = root.querySelector('.ums-page__head .ums-page__actions');
        if (act) act.hidden = (ten === 'form');
        if (cur === next) return;
        if (cur) ui.swap(cur, next, { top: false });
        else next.hidden = false;
    }

    function moForm(row) {
        S.editId = row ? row.ID : '';
        z('ftitle').textContent = row ? 'Sửa đối tượng thu' : 'Thêm mới đối tượng xuất hóa đơn';
        z('form').querySelector('[data-act="xoa-dt"]').hidden = !row;
        FORM.forEach(function (f) { setVal(fk(f[0]), row ? row[f[1]] : ''); });
        hienVung('form');
    }

    function themDoiTuong() {
        S.hsId = '';
        S.dt = null;
        markHS();
        moForm(null);
    }

    function suaDoiTuong(id) {
        var row = S.dtHS.filter(function (r) { return String(r.ID) === String(id); })[0];
        if (!row) return;
        S.hsId = row.ID;
        markHS();
        moForm(row);
    }

    /* save_DoiTuongThu */
    function luuDoiTuong() {
        var call = {
            action: 'TC_ThongTin_MH/FSkkLB4FLigVNC4vJgopICIP',
            func: 'pkg_taichinh_thongtin.Them_DoiTuongKhac'
        };
        FORM.forEach(function (f) { call[f[0]] = getVal(fk(f[0])); });
        call.strId = S.editId;
        call.strNguoiThucHien_Id = '';
        if (S.editId !== '') {
            call.action = 'TC_ThongTin_MH/EjQgHgUuKBU0Li8mCikgIgPP';
            call.func = 'pkg_taichinh_thongtin.Sua_DoiTuongKhac';
        }
        ums.api.call(call).then(function () {
            ui.toast(S.editId ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
            loadHS();
        }).catch(function (err) { ums.api.handle(err, 'lưu đối tượng'); });
    }

    function xoaDoiTuong() {
        if (!S.editId) return;
        ui.confirm('Xóa đối tượng thu này?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_DoiTuongKhac/Xoa', versionAPI: 'v1.0', strIds: S.editId, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa đối tượng thu thành công', 'ok'); themDoiTuong(); loadHS(); })
                .catch(function (err) { ums.api.handle(err, 'xoá đối tượng'); });
        });
    }

    /* ---------------------------------------------------------------------
       Khung đối tượng: đầu + các tab
       --------------------------------------------------------------------- */
    function dauO(row) {
        return {
            anh: row.ANH || '',
            ten: String(row.TENDOITUONG || '').toUpperCase() + (row.MASODOITUONG ? ' - ' + row.MASODOITUONG : ''),
            tools: ui.btn('close', { attr: { 'data-act': 'dong-dt' } }) +
                ui.btn('edit', { text: 'Sửa', attr: { 'data-act': 'sua-dt' } })
        };
    }
    (function drawDT() {
        /* Đầu khung CHUNG (ums.pat.dauDoiTuong — người dùng 2026-09-26): ảnh + tên + tổng nợ / dư NGAY SAU tên ·
           Đóng (trái) rồi Sửa ở tools. Dựng lại khi chọn đối tượng (datDau). */
        var h = '<div class="ums-panel" data-z="dtpanel">' + ums.pat.dauDoiTuong(dauO({})) +
            '<nav class="ums-tabs" data-z="tabs">' + TABS.map(function (t) {
                return '<a class="ums-tabs__item' + (t[0] === 'tinhhinh' ? ' is-active' : '') + '" href="javascript:void(0)" data-tab="' + t[0] + '">' + esc(t[1]) + '</a>';
            }).join('') + '</nav>' +
            '<div class="ums-panel__body">';

        // Tab tình hình
        h += '<div data-pane="tinhhinh" data-z="tinhhinh"></div>';

        // Các tab bảng khoản
        [['nochung', 'Thu tiền', 'NoChung', 'Tổng nợ chung các khoản'],
         ['norieng', 'Thu tiền', 'NoRieng', 'Tổng nợ riêng các khoản'],
         ['thuachung', 'Rút tiền', 'DuChung', 'Tổng dư chung các khoản'],
         ['thuarieng', 'Rút tiền', 'DuRieng', 'Tổng dư riêng các khoản'],
         ['thuho', 'Thu hộ', null, null]].forEach(function (t) {
            var rut = t[1] === 'Rút tiền';
            /* Thanh thao tác CHUNG (ums.pat.thanhThu): tổng của tab + Chi tiết (hộp thoại) · đã chọn + nút */
            h += '<div data-pane="' + t[0] + '" hidden>' +
                ums.pat.thanhThu({
                    tongLbl: t[3] || '', tong: 0,
                    chiTiet: t[2] ? 'data-tile-go="' + t[2] + '"' : '',
                    daChon: t[0] !== 'thuho',
                    nut: '<button type="button" class="ums-btn ums-btn--' + (rut ? 'danger' : 'primary') + '" data-vietphieu="' + t[0] + '">' +
                        '<i class="fa-light ' + (rut ? 'fa-money-from-bracket' : 'fa-circle-dollar-to-slot') + '"></i><span>' + t[1] + '</span></button>'
                }) +
                '<div data-bang="' + t[0] + '"></div></div>';
        });

        // Nộp trước
        h += '<div data-pane="noptruoc" hidden>' +
            '<div class="ums-grid ums-grid--3">' +
            ui.field('Chọn học kỳ', '<select class="ums-select" data-z="hocky"></select>') +
            ui.field('Chọn loại tính', '<select class="ums-select" data-z="loaitinh">' +
                '<option value="DONGIARATIEN">Đơn giá x Số lượng = Thành Tiền</option>' +
                '<option value="TIENRADONGIA">Đơn giá = Thành Tiền/Số lượng</option></select>') +
            ui.field('Ngày xuất chứng từ', '<div class="ums-inputwrap"><input class="ums-input" data-z="ngayct" placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>') +
            '</div>' +
            '<div data-z="dskhoan" hidden><div class="ums-legend ums-legend--cach ums-u-mb-2">Chọn khoản thu nộp trước</div><div data-z="khoannt"></div></div>' +
            '<div class="ums-u-mt-4">' + ums.pat.thanhThu({
                nut: '<button type="button" class="ums-btn ums-btn--danger" data-vietphieu="noptruoc-rut"><i class="fa-light fa-money-from-bracket"></i><span>Rút tiền</span></button>' +
                    '<button type="button" class="ums-btn ums-btn--primary" data-vietphieu="noptruoc"><i class="fa-light fa-circle-dollar-to-slot"></i><span>Thu tiền</span></button>'
            }) + '</div>' +
            '<div data-bang="noptruoc"></div></div>';

        // Theo đợt
        h += '<div data-pane="theodot" hidden data-z="theodot"></div>';

        h += '</div></div>';
        z('dt').innerHTML = h;
    })();

    var tinhHinh = PK.tinhHinh(z('tinhhinh'), {
        id: function () { return S.hsId; },
        onPhieu: function (kind, id) {
            S.phieuId = id;
            if (kind === 'hoadon') xemPhieu(id, 'HOADON');
            else xemPhieu(id, 'BIENLAI');     // bản gốc: phiếu rút cũng xem bằng loại "BIENLAI"
        },
        onEdit: function (kind, row) { if (kind === 'phaiNop') suaPhaiNop(row); else suaDaNop(row); },
        report: function (el) {
            ums.report.mount(el, {
                collect: function (add) {
                    var v = cas.values();
                    add('strChuongTrinh_Id', v.ct);
                    add('strKhoaDaoTao_Id', v.khoa);
                    add('strHeDaoTao_Id', v.he);
                    add('strLopHoc_Id', v.lop);
                    add('strTuKhoa', z('key').value.trim());
                    add('strTrangThaiNguoiHoc_Id', trangThai.ids().toString());
                    add('strQLSV_NguoiHoc_Id', S.hsId);
                    add('strNguoiThucHien_Id', ums.session.userId);
                    add('strChucNang_Id', ums.state.chucNangId);
                }
            });
        }
    });

    function loaiTinh() { return z('loaitinh').value; }

    var BANG = {};
    function mkBang(k, o) {
        o.soLuong = true;
        o.heSo = function () { return loaiTinh() !== 'TIENRADONGIA'; };
        o.onChange = function () { if (S.tab === k) hienTongChon(); };
        BANG[k] = PK.bang(z('dt').querySelector('[data-bang="' + k + '"]'), o);
    }
    mkBang('nochung', {});
    mkBang('norieng', {});
    mkBang('thuachung', { max: true });
    mkBang('thuarieng', { max: true });
    mkBang('thuho', {});
    mkBang('noptruoc', {
        canDoi: true, empty: 'Chọn học kỳ rồi chọn khoản thu nộp trước',
        soTienTitle: function () { return loaiTinh() === 'TIENRADONGIA' ? 'Thành tiền' : 'Số tiền'; }
    });

    /* show_TongTien */
    function hienTongChon() {
        var b = BANG[S.tab];
        var pane = root.querySelector('[data-pane="' + S.tab + '"]');
        var o = pane && pane.querySelector('[data-tt="chon"]');
        if (o) o.textContent = b ? m.fmt(b.tongChon()) : '0';
    }
    function xoaTongChon() {
        root.querySelectorAll('[data-tt="chon"]').forEach(function (x) { x.textContent = '0'; });
    }

    function doiTab(k) {
        S.tab = k;
        z('tabs').querySelectorAll('[data-tab]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-tab') === k); });
        z('dt').querySelectorAll('[data-pane]').forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== k; });
        if (k === 'tinhhinh') tinhHinh.back();
        hienTongChon();
    }

    z('tabs').addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-tab]');
        if (a) doiTab(a.getAttribute('data-tab'));
    });

    /* ---------------------------------------------------------------------
       Chọn đối tượng → tình hình tài chính
       --------------------------------------------------------------------- */
    function chonDoiTuong(id) {
        var row = S.dtHS.filter(function (r) { return String(r.ID) === String(id); })[0];
        if (!row) return;
        S.hsId = row.ID;
        S.dt = row;
        markHS();
        resetDoiTuong();
        ums.pat.datDau(z('dtpanel'), dauO(row));
        hienVung('dt');
        doiTab('tinhhinh');
        loadTinhTrang();
    }

    function resetDoiTuong() {
        ['nochung', 'norieng', 'thuachung', 'thuarieng', 'thuho'].forEach(function (k) { BANG[k].clear(); });
        tinhHinh.reset();
        ums.pat.datNoCo(z('dtpanel'), '');
        xoaTongChon();
        z('theodot').innerHTML = '';
    }

    /* getList_TinhTrangTaiChinh */
    function loadTinhTrang() {
        var id = S.hsId;
        return ums.api.call({
            action: 'TC_ThongTinChung/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strQLSV_NguoiHoc_Id: id, strNguoiThucHien_Id: '', strNguonDuLieu_Id: ''
        }).then(function (r) {
            if (id !== S.hsId) return;
            var d = r.data || {};
            BANG.nochung.set((d.rsPhaiNopTongHopChung || []).map(PK.dong));
            BANG.norieng.set((d.rsPhaiNopRieng || []).map(PK.dong));
            BANG.thuachung.set((d.rsDuThuaChung || []).map(PK.dong));
            BANG.thuarieng.set((d.rsDuThuaRieng || []).map(PK.dong));
            BANG.thuho.set((d.rsKhoanPhaiNop_ThuHo || []).map(PK.dong));
            var info = (d.rsThongTin || [])[0] || {};
            tinhHinh.set(info);
            ums.pat.datNoCo(z('dtpanel'), PK.noCo(info));
            [['nochung', 'TONGNOCHUNG'], ['norieng', 'TONGNORIENG'], ['thuachung', 'TONGDUCHUNG'], ['thuarieng', 'TONGDURIENG']].forEach(function (x) {
                var el = z('dt').querySelector('[data-pane="' + x[0] + '"] [data-tt="tong"]');
                if (el) el.textContent = m.isNum(info[x[1]]) ? m.fmt(info[x[1]]) : '0';
            });
            // Có nợ chung → sang tab nợ chung, chọn tất cả; không thì thu hộ
            if ((d.rsPhaiNopTongHopChung || []).length) { doiTab('nochung'); BANG.nochung.selectAll(); }
            else if ((d.rsKhoanPhaiNop_ThuHo || []).length) { doiTab('thuho'); BANG.thuho.selectAll(); }
            veTheoDot(d.rsDotCongNo || [], d.rsTongHopNoTheoDot || [], d.rsTongHopDuTheoDot || []);
            hienTongChon();
        }).catch(function (err) { ums.api.handle(err, 'tình trạng tài chính'); });
    }

    /* genTable_TheoDot */
    function veTheoDot(dot, no, du) {
        if (!dot.length) { z('theodot').innerHTML = ui.empty('Không có đợt công nợ'); return; }
        var cols = [
            { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO_HOCKY', cls: 'is-center' },
            { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
            { title: 'Khoản nợ', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Nội dung', prop: 'NOIDUNG' },
            { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return esc(m.fmt(r.SOTIEN)); },
              sum: function (rows) {
                  var t = 0; rows.forEach(function (r) { var v = m.cell(m.fmt(r.SOTIEN)); if (v !== null) t += v; });
                  return '<b>' + esc(m.fmt(t)) + '</b>';
              } }
        ];
        z('theodot').innerHTML = dot.map(function (d, i) {
            return '<div class="ums-panel ttk-dot"><div class="ums-panel__head"><div class="ums-panel__title">Đợt ' + esc(d.TENDOT) + '</div></div>' +
                '<div class="ums-panel__body"><div class="ums-u-danger ums-u-semi ums-u-mb-2">Nợ theo đợt</div><div data-dot-no="' + i + '"></div>' +
                '<div class="ums-u-semi ums-u-mt-4 ums-u-mb-2" style="color:var(--ums-ok, #16a34a)">Dư theo đợt</div><div data-dot-du="' + i + '"></div></div></div>';
        }).join('');
        dot.forEach(function (d, i) {
            var a = no.filter(function (x) { return x.TAICHINH_DOTCONGNO_ID === d.ID; });
            var b = du.filter(function (x) { return x.TAICHINH_DOTCONGNO_ID === d.ID; });
            ui.table({ el: z('theodot').querySelector('[data-dot-no="' + i + '"]'), rows: a, columns: cols, empty: 'Không có' });
            ui.table({ el: z('theodot').querySelector('[data-dot-du="' + i + '"]'), rows: b, columns: cols, empty: 'Không có' });
        });
    }

    z('dt').addEventListener('click', function (ev) {
        var g = ev.target.closest('[data-tile-go]');
        if (g) { tinhHinh.detail(g.getAttribute('data-tile-go')); return; }   // hộp thoại, không chuyển tab
        var v = ev.target.closest('[data-vietphieu]');
        if (v) vietPhieu(v.getAttribute('data-vietphieu'));
    });

    /* ---------------------------------------------------------------------
       Nộp trước: học kỳ, loại tính, khoản
       --------------------------------------------------------------------- */
    function fillHocKy() {
        var el = z('hocky');
        el.innerHTML = ui.options(S.thoiGian, { name: 'DAOTAO_THOIGIANDAOTAO', title: 'Tất cả đợt' });
        var saved = ls('strHocKy_Id');
        if (saved) el.value = saved;
        ui.select2(el, { placeholder: 'Chọn học kỳ thu' });
        z('dskhoan').hidden = !el.value;
    }
    if (window.jQuery) jQuery(z('hocky')).on('change', onHocKy); else z('hocky').addEventListener('change', onHocKy);
    function onHocKy() {
        var id = z('hocky').value;
        if (id === '') z('dskhoan').hidden = true;
        else { ls('strHocKy_Id', id); z('dskhoan').hidden = false; }
    }

    (function () {
        var saved = ls('strLoaiTinh_Id');
        if (saved === 'DONGIARATIEN' || saved === 'TIENRADONGIA') z('loaitinh').value = saved;
        ui.select2(z('loaitinh'), { minimumResultsForSearch: Infinity });
        function onLT() {
            ls('strLoaiTinh_Id', z('loaitinh').value);
            nhanLoaiTinh();
            hienTongChon();
        }
        if (window.jQuery) jQuery(z('loaitinh')).on('change', onLT); else z('loaitinh').addEventListener('change', onLT);
    })();
    // lblLoaiTinh: tiêu đề cột số tiền của bảng nộp trước
    function nhanLoaiTinh() { BANG.noptruoc.redraw(); }
    ui.datepicker(z('ngayct'));

    var khoanNT = null;
    function drawKhoanNopTruoc() {
        khoanNT = PK.checks(z('khoannt'), S.khoanThu, {
            onChange: function (cb, khoan) {
                if (cb.getAttribute('data-ck') !== 'one') return;
                var hk = z('hocky');
                if (!hk.value) {
                    cb.checked = false;
                    ui.toast('Vui lòng chọn học kỳ trước khi thao tác!', 'warn');
                    return;
                }
                if (!cb.checked) return;   // bản gốc không gỡ dòng khi bỏ chọn
                var hkText = hk.options[hk.selectedIndex] ? hk.options[hk.selectedIndex].text : '';
                BANG.noptruoc.add({
                    src: {}, id: cb.value, name: hk.value, title: 'null',
                    hk: hkText, dot: '', khoan: (khoan && khoan.TEN) || '',
                    noiDung: '', soLuong: '1', soTien: '0', goc: '0', checked: true, canDoi: true
                });
            }
        });
    }

    /* ---------------------------------------------------------------------
       Viết phiếu (genHTML_NoiDung_BienLai / _DongTruoc)
       --------------------------------------------------------------------- */
    var P = { mode: '', nhap: null, viewer: null, thu: true, dongTruoc: false };

    function vietPhieu(k) {
        var nopTruoc = k === 'noptruoc' || k === 'noptruoc-rut';
        var bangK = nopTruoc ? 'noptruoc' : k;
        var b = BANG[bangK];
        var thu = !(k === 'thuachung' || k === 'thuarieng' || k === 'noptruoc-rut');
        // countCheckTable — "Thu hộ" và "Thu tiền" nộp trước bản gốc không kiểm ở bước này
        if (k !== 'thuho' && k !== 'noptruoc' && b.count() === 0) { ui.toast('Vui lòng chọn khoản thu', 'warn'); return; }

        var chon = b.checked();
        var ma = PK.cungHeThong(chon);
        if (ma === null) return;

        var lt = loaiTinh();
        var dong = [];
        for (var i = 0; i < chon.length; i++) {
            var r = chon[i];
            var st = m.cell(r.soTien);
            if (st === 0) continue;                 // if (dSoTien == 0) continue;
            if (st === null) { ui.toast('Số tiền không hợp lệ ở khoản "' + r.khoan + '"', 'warn'); return; }
            var sl = m.cell(r.soLuong);
            var slRong = String(r.soLuong).trim() === '';
            var dg = r.soTien, tt;
            if (nopTruoc && lt === 'TIENRADONGIA') {
                if (!slRong && (sl === null || sl === 0)) { ui.toast('Số lượng không hợp lệ ở khoản "' + r.khoan + '"', 'warn'); return; }
                if (slRong) { ui.toast('Số lượng không được để trống ở khoản "' + r.khoan + '"', 'warn'); return; }
                tt = st;                                                    // thành tiền = số tiền nhập
                dg = m.fmt(Math.floor((st / sl) * 100) / 100);              // đơn giá = floor(tiền/SL*100)/100
            } else {
                if (slRong || sl === null) { ui.toast('Số lượng không hợp lệ ở khoản "' + r.khoan + '"', 'warn'); return; }
                tt = st * sl;                                               // thành tiền = đơn giá × SL
            }
            dong.push({
                id: r.id, name: r.name, khoan: r.khoan, noiDung: r.noiDung,
                soLuong: r.soLuong, donGia: dg, thanhTien: tt,
                canDoi: nopTruoc ? (r.canDoi ? 1 : 0) : undefined
            });
        }
        if (!dong.length) { ui.toast('Tổng các khoản chọn phải lớn 0!', 'warn'); return; }
        var tong = 0;
        dong.forEach(function (d) { var v = m.cell(m.fmt(d.thanhTien)); if (v !== null) tong += v; });
        if (!m.floor2(tong)) { ui.toast('Tổng các khoản chọn phải lớn 0!', 'warn'); return; }

        var ngay = PK.homNay();
        if (nopTruoc) {
            var nct = z('ngayct').value.trim();
            if (nct) ngay = nct.split('/');
        }
        var dt = S.dt || {};
        moPhieu('nhap');
        P.thu = thu;
        P.dongTruoc = nopTruoc;
        P.tenPhieu = PK.loaiChungTu(ma, thu);
        P.nhap = PK.nhap(z('phieu').querySelector('[data-z="pbody"]'), {
            rut: !thu,
            tenPhieu: P.tenPhieu,
            info: {
                hoTen: dt.FULL_NAME !== undefined ? dt.FULL_NAME : dt.TENDOITUONG,
                ma: dt.MASO !== undefined ? dt.MASO : dt.MASODOITUONG,
                ngaySinh: dt.NGAYSINH, diaChi: dt.NOIOHIENNAY, maSoThue: dt.MASOTHUECANHAN,
                lop: dt.DAOTAO_LOPQUANLY_N1_TEN, nganh: dt.NGANHHOC_N1_TEN, khoa: dt.KHOAHOC_N1_TEN
            },
            ngay: ngay,
            dvt: true,
            chonHinhThuc: true,
            anSoLuong: true,
            dong: dong
        });
        veNutPhieu();
    }

    /* ---------------------------------------------------------------------
       Vùng phiếu: nháp (có nút lưu) hoặc xem chứng từ đã lưu (in / huỷ)
       --------------------------------------------------------------------- */
    function moPhieu(mode) {
        P.mode = mode;
        z('phieu').innerHTML = '<div class="ums-panel">' +
            '<div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-file-signature"></i> <span data-z="ptitle"></span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-pact': 'dong' } }) +
            '<span data-z="ptools"></span></div></div>' +
            '<div class="ums-panel__body ttk-phieu__lien" data-z="plien" hidden></div>' +
            '<div class="ums-panel__body" data-z="pbody"></div></div>';
        ui.swap(z('layout'), z('phieu'));
        z('actions').hidden = true;
    }

    function dongPhieu() {
        z('phieu').hidden = true;
        z('phieu').innerHTML = '';
        z('actions').hidden = false;
        ui.reveal(z('layout'));
        P.nhap = null; P.viewer = null; P.mode = '';
        // closePhieu: reset bảng nộp trước và bỏ chọn khoản
        BANG.noptruoc.clear();
        if (khoanNT) khoanNT.uncheckAll();
    }

    function nutHDDT() {
        return (S.nutHDDT || []).map(function (n, i) {
            var icon = n.THONGTIN1 && String(n.THONGTIN1).trim() ? ums.iconFA4(/^fa\s/.test(String(n.THONGTIN1).trim()) ? String(n.THONGTIN1).trim() : 'fa ' + String(n.THONGTIN1).trim()) : 'fa-light fa-file-invoice';
            return '<button type="button" class="ums-btn ums-btn--ghost" data-hddt="' + i + '" title="' + esc(n.TEN) + '">' +
                '<i class="' + esc(icon) + '"></i><span>' + esc(n.TEN) + '</span></button>';
        }).join('');
    }

    function veNutPhieu() {
        var t = z('ptools'), h = '';
        if (P.mode === 'nhap') {
            z('ptitle').textContent = 'Viết ' + (P.thu ? 'chứng từ thu' : 'chứng từ rút') + ' — ' + P.tenPhieu;
            if (P.thu) {
                h += nutHDDT();
                if (P.dongTruoc) h += '<button type="button" class="ums-btn ums-btn--danger" data-pact="xuathd"><i class="fa-light fa-file-invoice"></i><span>Xuất hóa đơn</span></button>';
                h += '<button type="button" class="ums-btn ums-btn--out-warn" data-pact="thutien" title="Thu tiền - không sinh hóa đơn biên lai"><i class="fa-light fa-money-bill"></i><span>Thu tiền không sinh HĐBL</span></button>';
            }
            h += ui.btn('save', { text: 'Xuất biên lai', attr: { 'data-pact': 'xuatbl' } });
        } else {
            z('ptitle').textContent = 'Chứng từ';
            h += '<button type="button" class="ums-btn ums-btn--danger" data-pact="huy"><i class="fa-light fa-trash-can"></i><span>Hủy chứng từ</span></button>' +
                ui.btn('print', { mod: 'primary', attr: { 'data-pact': 'in' } });
        }
        t.innerHTML = h;
    }

    function xemPhieu(id, loai) {
        if (P.mode !== 'xem') moPhieu('xem');
        P.mode = 'xem';
        veNutPhieu();
        P.viewer = ums.phieu.viewer(z('pbody'), { tools: z('plien') });
        return P.viewer.show({ id: id, loai: loai });
    }

    z('phieu').addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-pact],[data-hddt]');
        if (!b) return;
        if (b.hasAttribute('data-hddt')) return xuatHDDT(S.nutHDDT[Number(b.getAttribute('data-hddt'))]);
        switch (b.getAttribute('data-pact')) {
            case 'dong': dongPhieu(); break;
            case 'xuatbl':
                ui.confirm('Bạn có chắc chắn muốn lưu chứng từ không!').then(function (y) { if (y) luuHDBL(); });
                break;
            case 'xuathd':
                ui.confirm('Bạn có chắc chắn muốn xuất hóa đơn không!').then(function (y) { if (y) luuHD(); });
                break;
            case 'thutien':
                ui.confirm('Bạn có chắc chắn muốn thu tiền không!').then(function (y) { if (y) thuTien(); });
                break;
            case 'in':
                if (P.viewer) P.viewer.print('In chứng từ');
                doiTab('tinhhinh');
                dongPhieu();
                break;
            case 'huy':
                ui.confirm('Bạn có chắc chắn muốn hủy biên lai không!', { tone: 'bad', ok: 'Hủy chứng từ' }).then(function (y) { if (y) huyBL(); });
                break;
        }
    });

    /* Gom các chuỗi gửi lên từ phiếu nháp (vòng lặp của save_HDBL / save_ThuTien) */
    function gom() {
        var v = P.nhap.values();
        var o = { ids: [], tg: [], nd: [], sl: [], dg: [], st: [], dvt: [], dvtTen: [], ltt: [], canDoi: [], v: v };
        v.dong.forEach(function (d) {
            o.ids.push(d.id);
            o.tg.push(d.name);
            o.nd.push(d.noiDung);
            o.sl.push(m.parse(d.soLuong));
            o.dg.push(m.parse(d.donGia));
            o.st.push(m.parse(m.fmt(d.thanhTien)));
            o.dvt.push(d.dvtId);
            o.dvtTen.push(d.dvtTen);
            o.ltt.push(v.loaiTien.id);
            if (d.canDoi !== undefined) o.canDoi.push(d.canDoi);
        });
        return o;
    }

    /* save_HDBL — "Xuất biên lai" (thu: TC_DaNop/ThemMoi, rút: TC_TaiChinh_Rut/ThemMoi) */
    function luuHDBL() {
        var g = gom();
        if (!g.ids.length) { ui.toast('Tổng các khoản chọn phải lớn 0!', 'warn'); dongPhieu(); return; }
        var call;
        if (P.thu) {
            call = {
                action: 'TC_DaNop/ThemMoi', versionAPI: 'v1.0',
                strNguoiThucHien_Id: '',
                strTaiChinh_CacKhoanThu_Ids: g.ids.join(','),
                strTaiChinh_SoTien_s: g.st.join(','),
                strTaiChinh_NoiDung_s: g.nd.join('#'),
                strDonGia_s: g.dg.join(','),
                strSoLuong_s: g.sl.join(','),
                strDonViTinh_Ids: g.ids.map(function () { return ''; }).join(','),   // xem ghi chú đầu tệp
                strLoaiTienTe_Ids: g.ltt.join(','),
                strQLSV_NguoiHoc_Id: S.hsId,
                strDaoTao_ThoiGianDaoTao_Id: g.tg.join(','),
                strDaoTao_ToChucCT_Id: '',
                strHinhThucThu_Id: g.v.hinhThuc.id,
                strXuatHoaDonTrucTiep: '',
                strNguonDuLieu_Id: ''
            };
        } else {
            call = {
                action: 'TC_TaiChinh_Rut/ThemMoi', versionAPI: 'v1.0',
                strNguoiThucHien_Id: '',
                strTaiChinh_CacKhoanThu_Ids: g.ids.join(','),
                strTaiChinh_SoTien_s: g.st.join(','),
                strTaiChinh_NoiDung_s: g.nd.join('#'),
                strQLSV_NguoiHoc_Id: S.hsId,
                strDaoTao_ThoiGianDaoTao_Id: g.tg.join(','),
                strHinhThucThu_Id: g.v.hinhThuc.id,        // phiếu rút không có ô hình thức → rỗng như bản gốc
                strXuatHoaDonTrucTiep: '',
                strNguonDuLieu_Id: '',
                strCANBOTHUCHIENRUT_Id: ums.session.userId
            };
        }
        var thu = P.thu;
        ums.api.call(call).then(function (r) {
            var id = r.raw && r.raw.Id;
            S.phieuId = id;
            loadTinhTrang();
            xoaTongChon();
            ui.toast(thu ? 'Thực hiện thu tiền thành công' : 'Thực hiện rút tiền thành công', 'ok');
            xemPhieu(id, thu ? 'BIENLAI' : 'BIENLAIRUT');
        }).catch(function (err) { ums.api.handle(err, 'lưu chứng từ'); });
    }

    /* save_HD — "Xuất hóa đơn" ở tab nộp trước (strXuatHoaDonTrucTiep = 1) */
    function luuHD() {
        var g = gom();
        if (!g.ids.length) { ui.toast('Tổng các khoản chọn phải lớn 0!', 'warn'); dongPhieu(); return; }
        ums.api.call({
            action: 'TC_DaNop/ThemMoi', versionAPI: 'v1.0',
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Ids: g.ids.join(','),
            strTaiChinh_SoTien_s: g.st.join(','),
            strTaiChinh_NoiDung_s: g.nd.join('#'),
            strDonGia_s: g.dg.join(','),
            strSoLuong_s: g.sl.join(','),
            strDonViTinh_Ids: g.ids.map(function () { return ''; }).join(','),
            strLoaiTienTe_Ids: g.ltt.join(','),
            strCanDoiKhoanPhaiNop: g.canDoi.join(','),
            strQLSV_NguoiHoc_Id: S.hsId,
            strDaoTao_ThoiGianDaoTao_Id: g.tg.join(','),
            strDaoTao_ToChucCT_Id: '',
            strHinhThucThu_Id: g.v.hinhThuc.id,
            strXuatHoaDonTrucTiep: 1,
            strNguonDuLieu_Id: ''
        }).then(function (r) {
            var id = r.raw && r.raw.Id;
            S.phieuId = id;
            loadTinhTrang();
            xoaTongChon();
            BANG.noptruoc.clear();
            if (khoanNT) khoanNT.uncheckAll();
            ui.toast('Thực hiện thu tiền thành công', 'ok');
            xemPhieu(id, 'HOADON');
        }).catch(function (err) { ums.api.handle(err, 'xuất hoá đơn'); });
    }

    /* save_ThuTien — thu tiền không sinh HĐBL, và các nút hoá đơn điện tử */
    function thuTienPayload(phuongThucMa) {
        var g = gom();
        // bản gốc: dt_HS.find(ID === strHSSV_Id) — không thấy thì lỗi JS; ở đây dùng dòng đang chọn
        var a = S.dtHS.filter(function (x) { return x.ID === S.hsId; })[0] || S.dt || {};
        return {
            action: 'TC_DaNop/ThemMoi', versionAPI: 'v1.0',
            strLoaiDoiTuong: 'DOITUONGKHAC',
            strPhuongThuc_MA: phuongThucMa,
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Ids: g.ids.join(','),
            strTaiChinh_SoTien_s: g.st.join(','),
            strTaiChinh_NoiDung_s: g.nd.join('#'),
            strDonGia_s: g.dg.join(','),
            strSoLuong_s: g.sl.join(','),
            strDonViTinh_Ids: g.dvt.join(','),
            strDonViTinhTen_s: g.dvtTen.join(','),
            strLoaiTienTe_Ids: g.ltt.join(','),
            strLoaiTienTe: g.v.loaiTien.ten,
            strQLSV_NguoiHoc_Id: S.hsId,
            strDaoTao_ThoiGianDaoTao_Id: g.tg.join(','),
            strCanDoiKhoanPhaiNop: g.canDoi.join(','),
            strDaoTao_ToChucCT_Id: '',
            strHinhThucThu_Id: g.v.hinhThuc.id,
            strHinhThucThu_MA: g.v.hinhThuc.ma,
            strHinhThucThu_TEN: g.v.hinhThuc.ten,
            strXuatHoaDonTrucTiep: '',
            strNguonDuLieu_Id: '',
            dKhongSinhChungTu: 0,
            strPhieuThuTheoPhoiSan_Id: '',
            strTenNguoiThu: '',
            strNganHang_SoTaiKhoan: a.NGANHANG_SOTAIKHOAN,
            strNganHang_ThuocNganHang_Id: a.NGANHANG_THUOCNGANHANG_ID,
            strNganHang_ThuocNganHang_Ten: a.NGANHANG_THUOCNGANHANG_TEN,
            strNganHang_ThongTinChiNhanh: a.NGANHANG_THONGTINCHINHANH,
            strNgayXuatChungTu: z('ngayct').value.trim(),
            bSoLuong: !g.v.anSoLuong
        };
    }

    function xongThuTien() {
        loadTinhTrang();
        ui.toast('Thực hiện thu tiền thành công', 'ok');
        dongPhieu();
    }

    function thuTien() {
        ums.api.call(thuTienPayload(undefined)).then(xongThuTien)
            .catch(function (err) { ums.api.handle(err, 'thu tiền'); });
    }

    /* Nút HĐĐT: THONGTIN4 (nếu có) đổi base URL của tiền tố HDDT như bản gốc
       (edu.system.objApi["HDDT"] = THONGTIN4) */
    function xuatHDDT(n) {
        if (!n) return;
        if (n.THONGTIN4 && ums.session && ums.session.api) ums.session.api.HDDT = n.THONGTIN4;
        var ma = String(n.MA || '');
        if (ma.indexOf('HDDTNHAP') === 0) return hddtNhap(ma, n.THONGTIN2);
        ui.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!').then(function (y) {
            if (!y) return;
            var obj = thuTienPayload(ma);
            ums.api.call(obj).then(function (r) {
                obj.strTaiChinh_CacKhoanThu_Ids = r.message;          // Message = id các khoản vừa nộp
                obj.action = 'HDDT_HoaDon/ThemMoi';
                return ums.api.call(obj).then(function (d) {
                    var id = d.raw && d.raw.Id;
                    S.phieuId = id;
                    // bản gốc nạp hoá đơn (mở tệp HĐĐT / lấy đường dẫn) rồi đóng vùng phiếu ngay
                    ums.phieu.viewer(document.createElement('div')).show({ id: id, loai: 'HOADON' });
                    xongThuTien();
                }, function (err) {
                    ums.api.handle(err, 'xuất hoá đơn điện tử');
                    loadTinhTrang();
                    dongPhieu();
                });
            }).catch(function (err) { ums.api.handle(err, 'thu tiền'); });
        });
    }

    /* saveHDDT_Nhap → saveNhap → saveNhap_ChuaThu */
    function hddtNhap(ma, phuongThucNhap) {
        var obj = thuTienPayload(ma);
        obj.action = 'HDDT_HoaDon/ThemMoi_Nhap';
        ums.api.call(obj).then(function (d) {
            var path = d.data;
            var link = String(path || '');
            if (link.indexOf('http') === -1) {
                var b = (ums.session.api && ums.session.api.HDDT) || '';
                link = b.substring(0, b.length - 3) + path;
                if (link.indexOf('http') === -1) link = (ums.session.host || '') + link;
            }
            var w = window.open(link, '_blank');
            if (w) w.focus(); else ui.toast('Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!', 'warn');
            return ums.api.call({
                action: 'TC_HoaDonNhap/ThemMoi', versionAPI: 'v1.0',
                strId: '',
                strQLSV_NguoiHoc_Id: obj.strQLSV_NguoiHoc_Id,
                strDuongDanFileHoaDon: path,
                strMoTa: phuongThucNhap + '$DOITUONGKHAC',
                dDaXuatChinhThuc: 0,
                strNguoiThucHien_Id: ''
            }).then(function (r) {
                obj.strTaiChinh_HoaDonNhap_Id = r.raw && r.raw.Id;
                obj.action = 'TC_HoaDonNhap_ChuaThu/ThemMoi';
                ui.toast('Thêm bản nháp thành công', 'ok');
                return ums.api.call(obj);
            });
        }).catch(function (err) { ums.api.handle(err, 'hoá đơn nháp'); });
    }

    /* delete_BL */
    function huyBL() {
        ums.api.call({ action: 'TC_SoBienLai/HuyBienLai', versionAPI: 'v1.0', strBienLai_Id: S.phieuId, strNguoiThucHien_Id: '' })
            .then(function () {
                loadTinhTrang();
                dongPhieu();
                ui.toast('Xóa biên lai thành công!', 'ok');
            }).catch(function (err) { ums.api.handle(err, 'huỷ chứng từ'); });
    }

    /* ---------------------------------------------------------------------
       Sửa khoản phải nộp / đã nộp + phân bổ
       BO-CUC luật 1: biểu mẫu NGAY TRONG TRANG (thay chỗ cả màn), không bật hộp thoại. Nút Sửa nằm trong bảng của HỘP
       "chi tiết" (PK.tinhHinh — việc phụ, giữ hộp): đóng hộp → mở biểu mẫu → biểu mẫu đóng (Đóng / Lưu xong) thì mở lại
       đúng hộp đó, dữ liệu nạp lại từ máy chủ. KHÔNG đổi lời gọi / tham số nào.
       --------------------------------------------------------------------- */
    function moSua(o) {
        var k = tinhHinh.dangMo();
        tinhHinh.back();                                     // đóng hộp chi tiết
        o.host = root;
        o.cols = 1;                                          // thân đã tự bọc lưới
        o.onClose = function () { if (k) tinhHinh.detail(k); };   // mở lại hộp, nạp lại
        return ums.pat.formTrang(o);
    }
    function selKT(id) { return '<select class="ums-select" data-f="kt">' + ui.options(S.khoanThu, { title: 'Chọn khoản thu' }) + '</select>'; }
    function selTG() { return '<select class="ums-select" data-f="tg">' + ui.options(S.thoiGian, { name: 'DAOTAO_THOIGIANDAOTAO', title: 'Tất cả đợt' }) + '</select>'; }

    function suaPhaiNop(row) {
        var dlg = moSua({
            title: 'Sửa khoản phải nộp', icon: 'fa-sack-dollar',
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Khoản thu', selKT()) + ui.field('Thời gian', selTG()) +
                ui.field('Số tiền', '<input class="ums-input" data-f="st" inputmode="decimal">') + '<div></div>' +
                '<div style="grid-column:1/-1">' + ui.field('Nội dung', '<textarea class="ums-textarea" data-f="nd" rows="5"></textarea>') + '</div></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var st = d.body.querySelector('[data-f="st"]').value.trim();
                if (!m.isNum(st)) { ui.toast('Số tiền không hợp lệ', 'warn'); return false; }
                ums.api.call({
                    action: 'TC_KhoanPhaiNop/CapNhat',
                    strId: row.ID, strChucNang_Id: '',
                    dSoTien: st,
                    strNoiDung: d.body.querySelector('[data-f="nd"]').value.trim(),
                    strDaoTao_ThoiGianDaoTao_Id: d.body.querySelector('[data-f="tg"]').value,
                    strDaoTao_CacKhoanThu_Id: d.body.querySelector('[data-f="kt"]').value,
                    strNguoiThucHien_Id: ''
                }).then(function () { ui.toast('Cập nhật thành công!', 'ok'); d.close(); })     // đóng biểu mẫu = mở lại hộp chi tiết, nạp lại
                    .catch(function (err) { ums.api.handle(err, 'TC_KhoanPhaiNop/CapNhat'); });
                return false;
            } }]
        });
        var b = dlg.body;
        b.querySelector('[data-f="kt"]').value = row.TAICHINH_CACKHOANTHU_ID || '';
        b.querySelector('[data-f="tg"]').value = row.DAOTAO_THOIGIANDAOTAO_ID || '';
        b.querySelector('[data-f="st"]').value = row.SOTIEN === null || row.SOTIEN === undefined ? '' : row.SOTIEN;
        b.querySelector('[data-f="nd"]').value = row.NOIDUNG || '';
        ui.select2(b.querySelector('[data-f="kt"]'));
        ui.select2(b.querySelector('[data-f="tg"]'));
    }

    function suaDaNop(row) {
        var dlg = moSua({
            title: 'Sửa khoản đã nộp', icon: 'fa-circle-dollar',
            body: '<div class="ums-grid ums-grid--3">' +
                ui.field('Khoản thu', selKT()) + ui.field('Thời gian', selTG()) +
                ui.field('Hình thức thu', '<select class="ums-select" data-f="ht"><option value=""></option></select>') +
                ui.field('Số tiền', '<input class="ums-input" data-f="st" inputmode="decimal">') +
                ui.field('Ngày tạo', '<input class="ums-input" data-f="ngay" placeholder="dd/mm/yyyy">') + '<div></div>' +
                '<div style="grid-column:1/-1">' + ui.field('Nội dung', '<textarea class="ums-textarea" data-f="nd" rows="4"></textarea>') + '</div></div>' +
                '<div data-f="phanbo" hidden class="ums-u-mt-4"></div>',
            buttons: [
                { text: 'Phân bổ', kind: 'add', mod: 'ghost', onClick: function (d) { moPhanBo(d, row); return false; } },
                { text: 'Lưu', kind: 'save', onClick: function (d) {
                    var st = d.body.querySelector('[data-f="st"]').value.trim();
                    if (!m.isNum(st)) { ui.toast('Số tiền không hợp lệ', 'warn'); return false; }
                    ums.api.call({
                        action: 'TC_KhoanDaNop/CapNhat',
                        strId: row.ID, strChucNang_Id: '',
                        dSoTien: st,
                        strNgayTao: d.body.querySelector('[data-f="ngay"]').value.trim(),
                        dCoCapNhatChoChungTu: 1,
                        strNoiDung: d.body.querySelector('[data-f="nd"]').value.trim(),
                        strDaoTao_ThoiGianDaoTao_Id: d.body.querySelector('[data-f="tg"]').value,
                        strDaoTao_CacKhoanThu_Id: d.body.querySelector('[data-f="kt"]').value,
                        strHinhThucThu_Id: d.body.querySelector('[data-f="ht"]').value,
                        strNguoiThucHien_Id: ''
                    }).then(function () { ui.toast('Cập nhật thành công!', 'ok'); d.close(); })     // đóng biểu mẫu = mở lại hộp chi tiết, nạp lại
                        .catch(function (err) { ums.api.handle(err, 'TC_KhoanDaNop/CapNhat'); });
                    return false;
                } }
            ]
        });
        var b = dlg.body;
        b.querySelector('[data-f="kt"]').value = row.TAICHINH_CACKHOANTHU_ID || '';
        b.querySelector('[data-f="tg"]').value = row.DAOTAO_THOIGIANDAOTAO_ID || '';
        b.querySelector('[data-f="st"]').value = row.SOTIEN === null || row.SOTIEN === undefined ? '' : row.SOTIEN;
        b.querySelector('[data-f="ngay"]').value = row.NGAYTAO_DD_MM_YYYY || '';
        b.querySelector('[data-f="nd"]').value = row.NOIDUNG || '';
        ui.datepicker(b.querySelector('[data-f="ngay"]'));
        ums.api.dm('QLTC.HTTHU').then(function (rows) {
            var s = b.querySelector('[data-f="ht"]');
            s.innerHTML = ui.options(rows, { title: 'Chọn hình thức thu' });
            s.value = row.HINHTHUCTHU_ID || '';
            ui.select2(s);
        }).catch(function (err) { ums.api.handle(err, 'hình thức thu'); });
        ui.select2(b.querySelector('[data-f="kt"]'));
        ui.select2(b.querySelector('[data-f="tg"]'));
    }

    /* btnPhanBo → getList_HopDong → getList_LoaiPhanBo → save_LoaiPhanBo */
    function moPhanBo(dlg, daNop) {
        var host = dlg.body.querySelector('[data-f="phanbo"]');
        if (!host.hidden) return;
        host.hidden = false;
        var dsPB = [];
        host.innerHTML = '<div class="ums-legend">Phân bổ cho người học theo hợp đồng</div>' +
            '<div class="ums-grid ums-grid--3">' +
            ui.field('Hợp đồng', '<select class="ums-select" data-p="hd"><option value="">Chọn hợp đồng</option></select>') +
            ui.field('Phạm vi', '<select class="ums-select" data-p="pv"><option value=""></option></select>') +
            ui.field('Áp số tiền', '<div class="ums-row"><input class="ums-input ums-u-flex1" data-p="st" placeholder="Nhập số tiền">' +
                '<button type="button" class="ums-btn ums-btn--out-warn" data-p="ap"><i class="fa-light fa-check"></i><span>Áp</span></button></div>') +
            '</div><div data-p="bang" class="ums-u-mt-2"></div>' +
            '<div class="ums-row ums-row--end ums-u-mt-4"><button type="button" class="ums-btn ums-btn--save" data-p="luu"><i class="fa-light fa-floppy-disk"></i><span>Lưu phân bổ</span></button></div>';
        var hd = host.querySelector('[data-p="hd"]'), pv = host.querySelector('[data-p="pv"]');

        function loadHD() {
            ums.api.call({ action: 'TC_NguoiHoc_QuanLy/LayDSHopDong', method: 'GET', type: 'GET', strQLSV_NguoiHoc_DoiTac_Id: S.hsId })
                .then(function (r) {
                    var keep = hd.value;
                    hd.innerHTML = ui.options(PK.rowsOf(r), { name: 'SOHOPDONG', title: 'Chọn hợp đồng' });
                    hd.value = keep;
                }).catch(function (err) { ums.api.handle(err, 'hợp đồng'); });
        }
        loadHD();
        ums.api.dm('TAICHINH.HOPDONG.PHANLOAI').then(function (rows) {
            pv.innerHTML = ui.options(rows, { title: 'Tất cả phạm vi' });
        }).catch(function () { /* không bắt buộc */ });

        function draw() {
            var ten = pv.value && pv.options[pv.selectedIndex] ? pv.options[pv.selectedIndex].text.toLowerCase() : '';
            ui.table({
                el: host.querySelector('[data-p="bang"]'), rows: dsPB, empty: 'Chọn hợp đồng để hiện danh sách',
                columns: [
                    { title: 'Mã người học', prop: 'QLSV_NGUOIHOC_MASO' },
                    { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN' },
                    { title: 'Phạm vi', prop: 'PHANLOAI_TEN' },
                    { title: 'Đã phân bổ', prop: 'TONGTIENDAPHANBO', cls: 'is-right' },
                    { title: 'Số tiền', width: '170px', render: function (r) {
                        return '<input class="ums-input ums-input--sm" data-pb="' + esc(r.QLSV_NGUOIHOC_ID) + '" value="' + esc(r._st || '') + '">';
                    } }
                ]
            });
            // Lọc theo phạm vi: ẩn dòng không chứa tên phạm vi đã chọn
            host.querySelectorAll('[data-p="bang"] tbody tr').forEach(function (tr) {
                tr.hidden = !!ten && tr.textContent.toLowerCase().indexOf(ten) < 0;
            });
        }
        draw();

        function loadDS() {
            ums.api.call({
                action: 'TC_NguoiHoc_QuanLy/LayDanhSach', method: 'GET', type: 'GET',
                strTuKhoa: '', strQLSV_NguoiHoc_DoiTac_Id: S.hsId, dHieuLuc: 1,
                strTaiChinh_NguoiHoc_HD_Id: hd.value, strNguoiTao_Id: '',
                pageIndex: 1, pageSize: 100000
            }).then(function (r) { dsPB = PK.rowsOf(r); draw(); })
                .catch(function (err) { ums.api.handle(err, 'danh sách phân bổ'); });
        }
        hd.addEventListener('change', loadDS);
        pv.addEventListener('change', draw);
        host.addEventListener('input', function (ev) {
            var id = ev.target.getAttribute('data-pb');
            if (!id) return;
            dsPB.forEach(function (r) { if (String(r.QLSV_NGUOIHOC_ID) === id) r._st = ev.target.value; });
        });
        host.querySelector('[data-p="ap"]').addEventListener('click', function () {
            var v = host.querySelector('[data-p="st"]').value;
            host.querySelectorAll('[data-p="bang"] tbody tr').forEach(function (tr) {
                if (tr.hidden) return;
                var inp = tr.querySelector('[data-pb]');
                if (!inp) return;
                inp.value = v;
                dsPB.forEach(function (r) { if (String(r.QLSV_NGUOIHOC_ID) === inp.getAttribute('data-pb')) r._st = v; });
            });
        });
        host.querySelector('[data-p="luu"]').addEventListener('click', function () {
            if (!dsPB.length) { ui.toast('Chưa có người học để phân bổ', 'warn'); return; }
            ui.batch(dsPB.map(function (r) {
                return {
                    action: 'TC_DaNop_PhanBo/ThemMoi', type: 'POST',
                    strQLSV_NguoiHoc_DoiTac_Id: S.hsId,
                    strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                    strTaiChinh_DaNop_Id: daNop.ID,
                    dSoTien: (r._st || '').trim(),
                    strNguoiThucHien_Id: ''
                };
            }), { title: 'Đang lưu phân bổ', okText: 'Đã lưu phân bổ' }).then(function () { loadHD(); loadDS(); });
        });
    }

    /* ---------------------------------------------------------------------
       Sự kiện chung
       --------------------------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-act]');
        if (!a || !root.contains(a)) return;
        switch (a.getAttribute('data-act')) {
            case 'tim': loadHS(1); break;
            case 'loc': z('loc').hidden = !z('loc').hidden; break;
            case 'them-dt': themDoiTuong(); break;
            /* Đầu khung đối tượng: Sửa đối tượng đang chọn (trước đây là nút bút trên từng dòng danh sách) · Đóng = bỏ chọn */
            case 'sua-dt': if (S.hsId) suaDoiTuong(S.hsId); break;
            case 'dong-dt': S.hsId = ''; markHS(); resetDoiTuong(); hienVung('trong'); break;
            /* Đóng biểu mẫu: còn đang chọn đối tượng thì về khung thu của đối
               tượng đó, chưa chọn ai thì về lời nhắc ban đầu. */
            case 'dong-form': hienVung(S.hsId ? 'dt' : 'trong'); break;
            case 'luu-dt': luuDoiTuong(); break;
            case 'xoa-dt': xoaDoiTuong(); break;
        }
    });

    /* Bản gốc gọi getList_HSSV ngay khi mở, lúc danh sách trạng thái chưa về
       (strStudyStatus_Ids rỗng). Ở đây đợi danh sách trạng thái (mặc định chọn
       tất cả) để lần tải đầu khớp với bộ lọc đang hiện. */
    Promise.all([cas.ready, trangThaiReady]).then(function () { loadHS(1); });
})();
