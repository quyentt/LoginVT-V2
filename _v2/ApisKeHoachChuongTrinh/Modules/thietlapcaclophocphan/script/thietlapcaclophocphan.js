/* =========================================================================
   Thiết lập các lớp học phần — Kế hoạch chương trình › Thiết lập lớp học phần
   Bản gốc: ApisKeHoachChuongTrinh/Modules/thietlapcaclophocphan/html/thietlapcaclophocphan.html
            + script/thietlapcaclophocphan.js (lớp ThietLapCacLopHocPhan, vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, hai vùng thay chỗ nhau (toggle_overide "zonecontent"):
       #zone_TimKiem  thanh lọc (Thời gian đào tạo, Tìm kiếm) + "Danh sách chương trình"   → "ds"
       #zoneEdit      "Phân loại lớp cho chương trình: … - Khóa: … - Hệ: …" + hai ô chọn,
                      hai nút cập nhật, bảng lớp học phần có ô đánh dấu                   → "ct"
   Bấm một DÒNG chương trình là mở vùng lớp học phần (arrClassName btnEdit trên dòng của gốc).

   Lời gọi (chép nguyên, kiểu cũ không func):
       KHCT_ThoiGianDaoTao/LayDanhSach   GET  strTuKhoa '' · strDAOTAO_NAM_Id '' · strNguoiThucHien_Id '' · pageIndex 1
                                             · pageSize 1000000 → ô "Thời gian đào tạo" (DAOTAO_THOIGIANDAOTAO)
       KHCT_LichGiang/LayDSChuongTrinh   GET  strDaoTao_ThoiGianDaoTao_Id
           cột DAOTAO_HEDAOTAO_TEN · DAOTAO_KHOADAOTAO_TEN · CHUONGTRINH_TEN
       KHCT_LichGiang/LayDSLopHocPhan    GET  strChucNang_Id · strDaoTao_ChuongTrinh_Id = ID dòng chương trình
                                             · strDaoTao_HeDaoTao_Id '' · strDaoTao_HocPhan_Id '' · strDaoTao_ThoiGianDaoTao_Id
           cột TENLOPHOCPHAN_DAYDU · PHANLOAITINHKHOILUONG_TEN · PHANLOAIPHAMVI_TEN
       KHCT_LichGiang/Sua_ThongTinLopHocPhan  POST  strIdLopHocPhan · strChucNang_Id · strPhanLoaiLopTinhKL_Id (ô Phân loại lớp)
       KHCT_LichGiang/Sua_PhamViLopHocPhan    POST  strIdLopHocPhan · strChucNang_Id · strPhanLoaiPhamVi_Id (ô Phạm vi lớp)
           — mỗi lớp đã đánh dấu một lời gọi.
   Danh mục: KLGD.PHANLOAITINHKHOILUONG (Phân loại lớp) · KLGD_PHANLOAIPHAMVI (Phạm vi lớp) — tên mã chép nguyên
   (một mã dấu chấm, một mã gạch dưới như gốc).

   Cố ý bỏ (mã chết của gốc): CSS .lbTinhTrang / #txtTenSanPham / .btn-large (không phần tử nào dùng), các hàm
   genCombo_PhanLoaiLop / loadToCombo_PhanLoaiLop / collageInTable (đều bị chú thích), #btnSave_LichPhanGiang (chú thích),
   rsPhanLoai (gán vào dtPhanLoaiLop nhưng không nơi nào đọc), chỉnh chiều cao bảng theo cửa sổ (vỏ mới cuộn cả trang).
   Khác gốc:
       · Nút "Tìm kiếm": html gốc gắn lớp .btnSearch mà mã nghe #btnSearch → nút chưa từng chạy; nay nạp lại danh sách.
       · Hai nút cập nhật: gốc đặt MỘT cặp trên và MỘT cặp dưới bảng (bảng dài) — nay một cặp trên đầu khung (đầu khung dính
         đỉnh khi cuộn nên luôn thấy).
       · Cập nhật: ums.ui.batch (tiến độ, báo lỗi từng lớp) rồi nạp lại một lần — gốc bắn N lời gọi rồi setTimeout N×50ms
         báo "Cập nhật thành công" dù lời gọi chưa xong / lỗi.
       · Chưa chọn Phân loại / Phạm vi mà bấm cập nhật: hỏi lại rõ là sẽ XOÁ TRẮNG giá trị của các lớp đã chọn (gốc hỏi chung
         "Bạn có chắc chắn cập nhật dữ liệu không?" và gửi rỗng).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, K = ums.khxl, e = K.e;
    var root = document.getElementById('khct-thietlapcaclophocphan');
    if (!root) return;

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Thiết lập các lớp học phần') +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="tg" data-ph="Chọn thời gian đào tạo"><option value="">Chọn thời gian đào tạo</option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' }) +
            pat.panel({ title: 'Danh sách chương trình', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 't', cls: 'tlhp-ds' }) +
        '</div>' +
        '<div data-z="ct" hidden>' +
            pat.panel({
                title: 'Phân loại lớp cho chương trình', icon: 'fa-screen-users', count: 'lopn', flush: true, cls: 'tlhp-lop',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('save', { text: 'Cập nhật phân loại lớp', attr: { 'data-a': 'phanloai' } }) +
                    ui.btn('save', { text: 'Cập nhật phạm vi lớp', mod: 'primary', attr: { 'data-a': 'phamvi' } }),
                // hàng hai ô chọn ngay trên bảng (gốc: trong thân khung, trên bảng)
                body: '<div class="ums-filter tlhp-chon">' +
                        '<div class="ums-field"><select class="ums-select" data-k="pl" data-ph="Chọn phân loại lớp"><option value="">Chọn phân loại lớp</option></select></div>' +
                        '<div class="ums-field"><select class="ums-select" data-k="pv" data-ph="Chọn phạm vi lớp"><option value="">Chọn phạm vi lớp</option></select></div>' +
                    '</div><div data-z="lop"></div>'
            }) +
        '</div>';

    function q(s) { return root.querySelector(s); }
    var zDs = q('[data-z="ds"]'), zCt = q('[data-z="ct"]'), fTg = q('[data-f="tg"]');
    var lopPanel = q('.tlhp-lop');
    var kPL = q('[data-k="pl"]'), kPV = q('[data-k="pv"]');
    var ctRows = [], ct = null;
    ui.enhance(root);
    K.ganChon(zCt);

    /* ---------- Danh mục ---------------------------------------------------- */
    ums.api.call({ action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET',
        strTuKhoa: '', strDAOTAO_NAM_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (r) { pat.fill(fTg, K.ds(r), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); })
        .catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });
    ums.api.dm('KLGD.PHANLOAITINHKHOILUONG')
        .then(function (ds) { pat.fill(kPL, ds, { name: 'TEN', head: 'Chọn phân loại lớp' }); })
        .catch(function (err) { ums.api.handle(err, 'phân loại lớp'); });
    ums.api.dm('KLGD_PHANLOAIPHAMVI')
        .then(function (ds) { pat.fill(kPV, ds, { name: 'TEN', head: 'Chọn phạm vi lớp' }); })
        .catch(function (err) { ums.api.handle(err, 'phạm vi lớp'); });

    /* ---------- Danh sách chương trình -------------------------------------- */
    function veCT() {
        q('[data-z="n"]').textContent = '(' + ctRows.length + ')';
        ui.table({
            el: q('[data-z="t"]'), rows: ctRows,
            empty: fTg.value ? 'Không có chương trình' : 'Chọn thời gian đào tạo để xem danh sách chương trình',
            columns: [
                { title: 'Hệ đào tạo', width: '30%', render: function (r, i) {
                    return '<span data-ct="' + i + '">' + esc(e(r.DAOTAO_HEDAOTAO_TEN)) + '</span>';
                } },
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', width: '30%' },
                { title: 'Chương trình', prop: 'CHUONGTRINH_TEN' }
            ]
        });
    }
    function load() {
        var host = q('[data-z="t"]');
        K.dang(host);
        ums.api.call({ action: 'KHCT_LichGiang/LayDSChuongTrinh', method: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: fTg.value, strNguoiThucHien_Id: '' })
            .then(function (r) { ctRows = K.ds(r); veCT(); })
            .catch(function (err) { K.loi(host, err, 'danh sách chương trình'); });
    }

    /* ---------- Lớp học phần của chương trình ------------------------------- */
    function taiLop() {
        var host = q('[data-z="lop"]');
        K.dang(host);
        ums.api.call({ action: 'KHCT_LichGiang/LayDSLopHocPhan', method: 'GET',
            strChucNang_Id: '', strDaoTao_ChuongTrinh_Id: ct.ID, strDaoTao_HeDaoTao_Id: '', strDaoTao_HocPhan_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: fTg.value, strNguoiThucHien_Id: '' })
            .then(function (r) {
                var d = r.data, rows = Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []);
                q('[data-z="lopn"]').textContent = '(' + rows.length + ')';
                ui.table({
                    el: host, rows: rows, empty: 'Chương trình chưa có lớp học phần',
                    columns: [
                        { title: 'Tên lớp', prop: 'TENLOPHOCPHAN_DAYDU' },
                        { title: 'Phân loại', prop: 'PHANLOAITINHKHOILUONG_TEN' },
                        { title: 'Phạm vi', prop: 'PHANLOAIPHAMVI_TEN' },
                        K.cotChon('tlhp')
                    ]
                });
            })
            .catch(function (err) { K.loi(host, err, 'lớp học phần'); });
    }
    function moCT(r) {
        ct = r;
        lopPanel.querySelector('.ums-panel__title').innerHTML =
            '<i class="fa-light fa-screen-users"></i> Phân loại lớp cho chương trình: <b>' + esc(e(r.CHUONGTRINH_TEN)) +
            '</b> - Khóa: <b>' + esc(e(r.DAOTAO_KHOADAOTAO_TEN)) + '</b> - Hệ: <b>' + esc(e(r.DAOTAO_HEDAOTAO_TEN)) +
            '</b> <span class="ums-u-faint ums-u-fz13" data-z="lopn"></span>';
        ui.swap(zDs, zCt);
        taiLop();
    }
    function dong() { ui.swap(zCt, zDs); ct = null; load(); }

    function capNhat(loai) {
        var ids = K.daChon(q('[data-z="lop"]'), 'tlhp');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var pl = loai === 'phanloai', el = pl ? kPL : kPV, v = el.value;
        var ten = pl ? 'phân loại lớp' : 'phạm vi lớp';
        var hoi = v ? 'Bạn có chắc chắn cập nhật dữ liệu không? (' + ids.length + ' lớp)'
            : 'Chưa chọn ' + ten + ' — cập nhật sẽ XOÁ TRẮNG ' + ten + ' của ' + ids.length + ' lớp đã chọn. Tiếp tục?';
        ui.confirm(hoi, { title: pl ? 'Cập nhật phân loại lớp' : 'Cập nhật phạm vi lớp', tone: v ? '' : 'bad' }).then(function (yes) {
            if (!yes) return;
            return ui.batch(ids.map(function (id) {
                var o = { action: pl ? 'KHCT_LichGiang/Sua_ThongTinLopHocPhan' : 'KHCT_LichGiang/Sua_PhamViLopHocPhan', method: 'POST',
                    strIdLopHocPhan: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
                o[pl ? 'strPhanLoaiLopTinhKL_Id' : 'strPhanLoaiPhamVi_Id'] = v;
                return o;
            }), { title: 'Đang cập nhật ' + ten, okText: 'Cập nhật thành công', show: true }).then(taiLop);
        });
    }

    /* ---------- Sự kiện ----------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (b && root.contains(b)) {
            if (b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'search': load(); break;
                case 'dong': dong(); break;
                case 'phanloai': capNhat('phanloai'); break;
                case 'phamvi': capNhat('phamvi'); break;
            }
            return;
        }
        var tr = ev.target.closest('.tlhp-ds tbody tr');
        if (!tr || !zDs.contains(tr)) return;
        var m = tr.querySelector('[data-ct]');
        if (m) moCT(ctRows[Number(m.getAttribute('data-ct'))]);
    });
    if (window.jQuery) jQuery(fTg).on('select2:select select2:clear', load);

    veCT();
})();
