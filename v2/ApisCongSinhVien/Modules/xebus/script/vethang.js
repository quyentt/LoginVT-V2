/* =========================================================================
   Vé tháng (Cổng sinh viên — vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/xebus/html/vethang.html + script/vethang.js (vỏ index)
   ---------------------------------------------------------------------------
   Bố cục giữ nguyên bản gốc, MỘT cột: thanh lọc (ô "Chọn kế hoạch" + "Xem") →
   bảng "Danh sách lựa chọn" (chưa đăng ký) + nút "Đăng ký" → bảng "Kết quả đăng ký"
   (đã đăng ký) + nút "Hủy đăng ký".
   Khung hai bảng dùng chung: ums.pat.haiLuoi (assets/js/patterns.js)
   (ums.pat.haiLuoi) — cùng dạng với nguyenvong / thilai.

   Lời gọi (chép nguyên action / func / tên tham số của bản gốc):
     pkg_hososinhvien_vethang.LayDSKeHoachVeThang             → ô Kế hoạch (ID / TENKEHOACH)
     pkg_hososinhvien_vethang.LayDSKeHoach_DichVu_Phi_ChuaDK  → bảng CHƯA đăng ký
         (LOAIVE_ID, LOAIVE_TEN, SOTIEN, DSTHANG)
     pkg_hososinhvien_vethang.LayDSQLSV_KeHoach_Ve_DangKy     → bảng ĐÃ đăng ký
         (ID, LOAIVE_TEN, BIENSO, LOAIXE, SOTIEN, DSTHANG)
     pkg_hososinhvien_vethang.Them_QLSV_KeHoach_Ve_DangKy     → đăng ký từng dòng đã đánh dấu
     pkg_hososinhvien_vethang.Xoa_QLSV_KeHoach_Ve_DangKy      → hủy từng dòng đã đánh dấu (strId)
     danh mục QLSV.VE.LOAIXE (loadToCombo_DanhMucDuLieu)      → ô "Loại xe" trong từng dòng
     strNguoiThucHien_Id / strQLSV_NguoiHoc_Id = edu.system.userId ở gốc →
         strQLSV_NguoiHoc_Id gửi tường minh bằng ums.session.userId, strNguoiThucHien_Id để api.js tự điền.

   Giữ như gốc:
     · ô "Biển số" (chữ) và "Loại xe" (ô chọn) nằm NGAY TRONG dòng của bảng chưa
       đăng ký, giá trị đọc theo LOAIVE_ID lúc bấm "Đăng ký";
     · chưa đánh dấu dòng nào mà bấm Đăng ký / Hủy → "Vui lòng chọn đối tượng?";
     · hỏi lại "Bạn có chắc chắn đăng ký không?" / "Bạn có chắc chắn xóa dữ liệu không?";
     · strTuKhoa đọc ô 'txtAAAA' không tồn tại trong bản gốc → gửi chuỗi rỗng
       (đúng giá trị bản gốc đang gửi).

   Khác bản gốc (và vì sao):
     · Ô "Loại xe" trong bảng KHÔNG bọc select2 (bản gốc gọi $().select2() cho từng
       dòng) — luật chung 2026-09-22: ô chọn ít mục trong bảng dùng ô gốc.
     · Đăng ký / hủy nhiều dòng chạy TUẦN TỰ qua ums.ui.batch rồi nạp lại hai bảng
       MỘT lần; bản gốc bắn N lời gọi song song, mỗi lời gọi lại nạp lại cả hai
       bảng và bật một thông báo.
     · Nút "Hủy đăng ký" là nút xoá nhiều dòng chuẩn (ums.ui.xoaChon: tự đếm, khoá
       khi chưa đánh dấu dòng nào) và nằm ở đầu khung bảng tương ứng — như các màn
       cùng dạng đã chuyển (nguyenvong, thilai, nganh2).
     · Tổng tiền hiện qua ums.ui.money (bản gốc in số thô).
     · Bỏ getList_Thang (pkg_hososinhvien_vethang.LayDSKeHoach_DichVu_LoaiVe): bản
       gốc đã chuyển sang cột DSTHANG, lời gọi này chỉ còn trong mã chết — nó ghi
       vào ô '#lbl<id>' mà bản gốc đã chú thích bỏ, nên không còn nơi nhận.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, X = ums.xebus;
    var root = document.getElementById('csv-vethang');
    var SV = (ums.session && ums.session.userId) || '';
    var A = 'SV_VeThang_MH/', P = 'pkg_hososinhvien_vethang.';
    function e(v) { return X.e(v); }
    function arr(d) { return X.arr(d); }

    var dtLoaiXe = [];

    root.innerHTML =
        ums.pat.page('Đăng ký vé xe tháng', '') +
        X.thanhLoc({ label: 'Chọn kế hoạch' }) +
        '<div data-z="luoi"></div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function kh() { return f('kh').value; }

    /* Ô chọn loại xe của một dòng — ô gốc (không select2, luật ô chọn trong bảng) */
    function oLoaiXe(r) {
        var h = '<option value="">Chọn loại xe</option>';
        dtLoaiXe.forEach(function (x) {
            h += '<option value="' + ui.esc(e(x.ID)) + '">' + ui.esc(e(x.TEN)) + '</option>';
        });
        return '<select class="ums-select" data-lx="' + ui.esc(e(r.LOAIVE_ID)) + '">' + h + '</select>';
    }

    var COT_CHUA = [
        { title: 'Loại vé', prop: 'LOAIVE_TEN', cls: 'is-center' },
        {
            title: 'Biển số', cls: 'is-center', width: '200px',
            render: function (r) { return '<input class="ums-input" data-bs="' + ui.esc(e(r.LOAIVE_ID)) + '" autocomplete="off">'; }
        },
        { title: 'Loại xe', cls: 'is-center', width: '200px', render: oLoaiXe },
        { title: 'Tổng tiền', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN); } },
        { title: 'Danh sách tháng', prop: 'DSTHANG', cls: 'is-center' }
    ];
    var COT_DA = [
        { title: 'Loại vé', prop: 'LOAIVE_TEN', cls: 'is-center' },
        { title: 'Biển số', prop: 'BIENSO', cls: 'is-center', width: '200px' },
        { title: 'Loại xe', prop: 'LOAIXE', cls: 'is-center', width: '200px' },
        { title: 'Tổng tiền', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN); } },
        { title: 'Danh sách tháng', prop: 'DSTHANG', cls: 'is-center' }
    ];

    var hl = ums.pat.haiLuoi(z('luoi'), {
        chua: {
            title: 'Danh sách lựa chọn', icon: 'fa-list-check', columns: COT_CHUA,
            empty: 'Không có loại vé nào để đăng ký',
            nut: { text: 'Đăng ký', icon: 'fa-money-check-pen' },
            canChon: 'Vui lòng chọn đối tượng?', onDangKy: dangKy
        },
        da: {
            title: 'Kết quả đăng ký', icon: 'fa-clipboard-check', columns: COT_DA,
            empty: 'Chưa đăng ký vé tháng nào',
            nut: { text: 'Hủy đăng ký' },
            canChon: 'Vui lòng chọn đối tượng?', onHuy: huy
        }
    });

    /* ---------- Nạp hai bảng --------------------------------------------- */
    function taiChua() {
        hl.dang('chua');
        return ums.api.call({
            action: A + 'DSA4BRIKJAkuICIpHgUoIikXNB4RKSgeAik0IAUK', func: P + 'LayDSKeHoach_DichVu_Phi_ChuaDK',
            strTuKhoa: '', strQLSV_KeHoach_DichVu_Ve_Id: kh()
        }).then(function (r) { hl.ve('chua', arr(r.data)); })
            .catch(function (err) { hl.loi('chua', err.message); ums.api.handle(err, 'danh sách lựa chọn'); });
    }
    function taiDa() {
        hl.dang('da');
        return ums.api.call({
            action: A + 'DSA4BRIQDRIXHgokCS4gIikeFyQeBSAvJgo4', func: P + 'LayDSQLSV_KeHoach_Ve_DangKy',
            strQLSV_KeHoach_DichVu_Ve_Id: kh(), strQLSV_NguoiHoc_Id: SV
        }).then(function (r) { hl.ve('da', arr(r.data)); })
            .catch(function (err) { hl.loi('da', err.message); ums.api.handle(err, 'kết quả đăng ký'); });
    }
    function tai() {
        if (!kh()) { nhac(); return; }
        taiChua(); taiDa();
    }
    function nhac() {
        hl.nhac('chua', 'Chọn kế hoạch rồi bấm "Xem"');
        hl.nhac('da', 'Chọn kế hoạch rồi bấm "Xem"');
    }

    /* ---------- Đăng ký / hủy -------------------------------------------- */
    function oTrongDong(attr, id) {
        var s = hl.bang('chua').querySelector('[' + attr + '="' +
            (window.CSS && CSS.escape ? CSS.escape(String(id)) : id) + '"]');
        return s ? s.value : '';
    }
    function dangKy(ds) {
        ui.confirm('Bạn có chắc chắn đăng ký không?', { ok: 'Đăng ký', title: 'Đăng ký' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ds.map(function (r) {
                return {
                    action: A + 'FSkkLB4QDRIXHgokCS4gIikeFyQeBSAvJgo4', func: P + 'Them_QLSV_KeHoach_Ve_DangKy',
                    strQLSV_KeHoach_DichVu_Ve_Id: kh(), strLoaiVe_Id: e(r.LOAIVE_ID),
                    strBienSoXe: oTrongDong('data-bs', e(r.LOAIVE_ID)),
                    strLoaiXe_Id: oTrongDong('data-lx', e(r.LOAIVE_ID)),
                    strQLSV_NguoiHoc_Id: SV
                };
            }), { title: 'Đang đăng ký vé tháng', okText: 'Thêm mới thành công!' })
                .then(function () { taiChua(); taiDa(); });
        });
    }
    function huy(ds) {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy đăng ký', title: 'Hủy đăng ký' })
            .then(function (yes) {
                if (!yes) return;
                ui.batch(ds.map(function (r) {
                    return {
                        action: A + 'GS4gHhANEhceCiQJLiAiKR4XJB4FIC8mCjgP', func: P + 'Xoa_QLSV_KeHoach_Ve_DangKy',
                        strId: e(r.ID)
                    };
                }), { title: 'Đang hủy đăng ký', okText: 'Xóa thành công!' })
                    .then(function () { taiChua(); taiDa(); });
            });
    }

    /* ---------- Sự kiện --------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="xem"]');
        if (b && root.contains(b) && !b.disabled) tai();
    });

    /* ---------- Mở màn ---------------------------------------------------- */
    nhac();
    ums.api.dm('QLSV.VE.LOAIXE').then(function (d) { dtLoaiXe = arr(d); }, function () { dtLoaiXe = []; })
        .then(function () {
            return X.napKeHoach(f('kh'), {
                action: A + 'DSA4BRIKJAkuICIpFyQVKSAvJgPP', func: P + 'LayDSKeHoachVeThang'
            }, {
                chon: 'dau',              // selectFirst: true của bản gốc
                label: 'Chọn kế hoạch',
                onDoi: function (co) { if (co) tai(); else nhac(); }
            });
        });
})();
