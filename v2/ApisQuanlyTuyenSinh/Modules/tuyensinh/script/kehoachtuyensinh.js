/* =========================================================================
   Kế hoạch tuyển sinh (bản cũ — TS_KeHoachTuyenSinh)
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/kehoachtuyensinh.html
            + script/kehoachtuyensinh.js (4.079 dòng, vỏ indexi)
   Khung trong module: _khtsc.js (nguồn chung + bốn khối con của kế hoạch),
   _khtsc_dot.js (vùng Đợt phương thức: khoản phí, lớp dự kiến, ngành nghề, tổ hợp),
   _khtsc_cauhinh.js (vùng Mẫu hồ sơ, Cấu trúc hiển thị kết quả).
   (Màn anh em "Kế hoạch tuyển sinh (new)" dùng PKG_CORE_TS_* — KHÁC thực thể, không dùng chung ums.khts.)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên — strNguoiThucHien_Id / strChucNang_Id để trống cho ums.api tự điền):
     TS_KeHoachTuyenSinh/LayDanhSach (GET, phân trang máy chủ, strNguoiTao_Id = người đăng nhập)
     TS_KeHoachTuyenSinh/LayChiTiet (GET) · ThemMoi · CapNhat · Xoa (strIds)
     Khối con: TS_KeHoach_HeDaoTao/* · TS_KeHoach_NhanSu/* · TS_QuyDinhHoSo/* · TS_ToHopMon/* (xem _khtsc.js)
     Đợt: TS_Dot_DoiTuong/LayDanhSach (GET) và các lời gọi của _khtsc_dot.js
     Danh mục: TS.CHEDONHAPDULIEU, TUYENSINH.LOAIHOSO, TUYENSINH.TINHCHATHOSO, TUYENSINH.NGANHNGHE,
       TS.DOITUONGDUTUYEN, TS.DOTTUYENSINH, TS.HOSO.TRUONGTHONGTIN
   Bố cục: MỘT cột như gốc — thanh lọc + bảng kế hoạch; Thêm mới / Chi tiết: biểu mẫu thay chỗ danh sách
   (zone_input / zone_update); "Đợt", "Mẫu hồ sơ", "Cấu trúc hiển thị kết quả" thay chỗ biểu mẫu kế hoạch
   (toggle_overide như gốc), Đóng thì về biểu mẫu kế hoạch và nạp lại danh sách đợt. Các hộp CHỌN (ngành
   nghề, môn thi của tổ hợp, nhân sự) là hộp thoại như gốc; còn thêm / sửa bản ghi con (lớp dự kiến, trường thông
   tin, cấu trúc hiển thị) và màn con "Tổ hợp ngành nghề" là biểu mẫu NGAY TRONG TRANG thay chỗ vùng đang mở
   (ums.pat.formTrang — BO-CUC luật 1, từ 30/9).
   Tự chốt:
     · Thêm mới xong về danh sách (gốc hỏi "tiếp tục thêm không?" rồi ở lại biểu mẫu) — bấm Chi tiết để khai đợt,
       hệ khoá, nhân sự… (biểu mẫu thêm của gốc cũng chỉ có 5 ô).
     · Lưu kế hoạch đang sửa: CapNhat rồi lưu tiếp hệ khoá → nhân sự mới → hồ sơ → tổ hợp môn (đúng thứ tự gốc),
       xong về danh sách (gốc ở lại biểu mẫu).
     · Cột "Ngành nghề dự kiến mở" của bảng đợt gốc là một nút Sửa thứ hai (trùng cột Chi tiết) → giữ nút, cùng mở đợt.
     · Danh sách con lấy một trang lớn (gốc dùng pageSize mặc định — có thể thiếu dòng khi nhiều).
   Cố ý bỏ (mã chết của gốc): nút xoá trong bảng kế hoạch (không có trong bảng), zone_input_HoSo (không nút nào mở),
     LayDSNamTuyenSinhTheoKeHoach (đổ vào dropSearch_Nam không tồn tại), vá select2 trong modal Bootstrap.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, K = ums.khtsc;
    var root = document.getElementById('kehoachtuyensinh');
    if (!root || !K) return;

    root.innerHTML = '<div data-kz="crud"></div><div data-kz="phu" hidden></div>';
    function z(k) { return root.querySelector('[data-kz="' + k + '"]'); }

    var cur = null, con = null, dots = [];

    var crud = ums.crud({
        root: z('crud'),
        title: 'Kế hoạch tuyển sinh',
        listTitle: 'Danh sách kế hoạch tuyển sinh',
        formTitle: 'kế hoạch tuyển sinh',
        icon: 'fa-list-ul',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'TS_KeHoachTuyenSinh/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiTao_Id: ums.session.userId };
            }
        },
        columns: [
            { title: 'Tên kế hoạch', prop: 'TEN' },
            { title: 'Chế độ hoạt động', prop: 'CHEDONHAPDULIEU_TEN' },
            { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap', width: '120px' },
            { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap', width: '120px' }
        ],
        detail: function (row) { return { action: 'TS_KeHoachTuyenSinh/LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { type: 'legend', label: 'Thông tin kế hoạch tuyển sinh' },
            { key: 'strTen', col: 'TEN', label: 'Tên kế hoạch', required: true },
            { key: 'strCheDoNhapDuLieu_Id', col: 'CHEDONHAPDULIEU_ID', label: 'Chế độ hoạt động', type: 'select',
              source: { dm: 'TS.CHEDONHAPDULIEU' }, placeholder: 'Chọn chế độ hoạt động' },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày kết thúc', type: 'date' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        save: function (v, row) {
            return {
                action: row ? 'TS_KeHoachTuyenSinh/CapNhat' : 'TS_KeHoachTuyenSinh/ThemMoi', method: 'POST',
                strId: row ? row.ID : '', strTen: v.strTen, strMa: '', strMoTa: v.strMoTa,
                strNgayBatDau: v.strNgayBatDau, strNgayKetThuc: v.strNgayKetThuc, strCheDoNhapDuLieu_Id: v.strCheDoNhapDuLieu_Id
            };
        },
        /* Gốc chỉ xoá trong biểu mẫu Chi tiết (nút "Xóa" ở chân) */
        remove: function (ids) { return { action: 'TS_KeHoachTuyenSinh/Xoa', method: 'POST', strIds: ids[0] }; },
        rowDelete: false,
        multi: false,
        removeConfirm: function () { return 'Bạn có chắc chắn xóa kế hoạch tuyển sinh này không?'; },
        onForm: function (row, c, extra) {
            cur = row && row.ID ? { ID: row.ID, TEN: row.TEN } : null;
            con = null;
            extra.innerHTML = '';
            if (!cur) return;
            extra.innerHTML = '<div data-kx="dot"></div><div data-kx="con"></div>';
            veDot(extra.querySelector('[data-kx="dot"]'));
            con = K.congCu(extra.querySelector('[data-kx="con"]'), { khId: cur.ID });
        },
        onSaved: function (c, res, isEdit) {
            if (isEdit && con && cur) con.luu(cur.ID);
        }
    });

    /* ---- Các đợt, phương thức tuyển ------------------------------------- */
    var dotHost = null;
    function veDot(host) {
        dotHost = host;
        host.innerHTML = pat.panel({
            title: 'Các đợt, phương thức tuyển', icon: 'fa-calendar-days', flush: true,
            tools: ui.btn('edit', { text: 'Cấu trúc hiển thị kết quả', mod: 'out-primary', attr: { 'data-kd': 'cautruc' } }) +
                ui.btn('edit', { text: 'Mẫu hồ sơ', mod: 'out-primary', attr: { 'data-kd': 'mau' } }) +
                ui.btn('add', { text: 'Thêm mới', mod: 'out-success', attr: { 'data-kd': 'them' } }),
            body: '<div data-kd="tbl"></div>'
        });
        napDot();
    }
    function napDot() {
        if (!dotHost || !cur) return Promise.resolve();
        var el = dotHost.querySelector('[data-kd="tbl"]');
        el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return K.dsDot(cur.ID).then(function (ds) {
            dots = ds;
            ui.table({
                el: el, rows: dots, empty: 'Kế hoạch chưa có đợt, phương thức tuyển',
                columns: [
                    { title: 'Mã đợt', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Tên đợt', prop: 'TEN' },
                    { title: 'Mô tả điều kiện xét', prop: 'MOTADIEUKIENXET' },
                    { title: 'Phương thức', prop: 'DOITUONGDUTUYEN_TEN' },
                    { title: 'Đợt', prop: 'DOTTUYENSINH_TEN', cls: 'is-nowrap' },
                    { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
                    { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                    { title: 'Ngành nghề dự kiến mở', cls: 'is-center', width: '90px', render: function (r, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--view" data-kdo="' + i + '" title="Ngành nghề dự kiến mở"><i class="fa-light fa-eye"></i></button>';
                    } },
                    { title: 'Chi tiết', cls: 'is-center', width: '70px', render: function (r, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-kdo="' + i + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                    } }
                ]
            });
        }).catch(function (err) { dots = []; el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'đợt, phương thức tuyển'); });
    }

    /* Vùng phụ thay chỗ biểu mẫu kế hoạch; Đóng → về biểu mẫu + nạp lại đợt (btnClose_HoSo của gốc) */
    function moPhu(ve) {
        var phu = z('phu');
        /* Mỗi lần mở một khối MỚI — trình xử lý sự kiện gắn trên khối, không dồn lên vùng phụ */
        phu.innerHTML = '<div></div>';
        ve(phu.firstChild);
        ui.swap(crud.z('form'), phu);
    }
    function dongPhu() {
        var phu = z('phu');
        ui.swap(phu, crud.z('form'));
        phu.innerHTML = '';
        napDot();
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-kd], [data-kdo]');
        if (!b || !cur || !dotHost || !dotHost.contains(b)) return;
        if (b.hasAttribute('data-kdo')) {
            var d = dots[Number(b.getAttribute('data-kdo'))];
            if (d) moPhu(function (h) { K.dot(h, { kh: cur, dot: d, onDong: dongPhu }); });
            return;
        }
        var k = b.getAttribute('data-kd');
        if (k === 'them') moPhu(function (h) { K.dot(h, { kh: cur, dot: null, onDong: dongPhu }); });
        else if (k === 'mau') moPhu(function (h) { K.mau(h, { onDong: dongPhu }); });
        else if (k === 'cautruc') moPhu(function (h) { K.cauTruc(h, { kh: cur, onDong: dongPhu }); });
    });

    /* Rời biểu mẫu kế hoạch (Đóng / Lưu / Xoá) thì vùng phụ cũng đóng */
    crud.cfg.onList = function () { z('phu').hidden = true; z('phu').innerHTML = ''; cur = null; };

})();
