/* =========================================================================
   Danh sách giảm trừ gia cảnh — người phụ thuộc của từng cán bộ (bản quản trị)
   Bản gốc: ApisNhanSu/Modules/luong/script/danhsachgiamtrugiacanh.js
   Hai cột như gốc: trái = "Danh sách cán bộ" (ums.luongA.dsCanBo — getList_NhanSu),
   phải = danh sách giảm trừ của cán bộ đang chọn (ums.crud nhúng, biểu mẫu thay chỗ bảng).
   Cổng cán bộ có bản cá nhân (ApisCongCanBo/.../quatrinhcongtac/danhsachgiamtrugiacanh) —
   cùng lời gọi, cùng cột; bản này thêm cột trái và nút "Kế thừa sang năm khác".
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_GiamTruGiaCanh/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id = cán bộ đang chọn, strNguoiTao_Id '',
                                          strTuKhoa '', pageIndex, pageSize
       L_GiamTruGiaCanh/LayChiTiet   GET  strId
       L_GiamTruGiaCanh/ThemMoi | CapNhat (tham số dưới), Xoa (strIds)
       L_GiamTruGiaCanh/KeThua       POST strNamNguon, strNamDich (hộp "Kế thừa sang năm khác")
   Danh mục: CHUN.CHLU (quốc tịch, quốc gia), NS.QHGD (quan hệ), CHUN.DMTT đổ TOÀN BỘ vào
   cả ba ô Tỉnh / Huyện / Xã (như gốc — không lọc cha–con). Tệp đính kèm NS_Files.
   Khác gốc:
     · Bỏ dải tab một tab "Danh sách giảm trừ gia cảnh" (luật chung).
     · Danh sách phân trang đầy đủ (gốc nạp trang đầu, không thanh phân trang).
     · Tìm cán bộ: Enter và nút Tìm kiếm (như gốc); Khoa và Bộ môn KHÔNG nối tầng — gốc
       đổ mọi đơn vị con vào ô Bộ môn, gửi Khoa nếu có, không thì Bộ môn.
     · Ô "Chọn tình trạng làm việc" trong khung tìm kiếm gốc không nạp dữ liệu và không
       gửi đi → bỏ.
   Bỏ: QLCB.NHMA → dropNhomMau (ô không có trên màn), ThietLapQuaTrinhCuoiCung (gốc không gọi).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, A = ums.luongA;
    var root = document.getElementById('danhsachgiamtrugiacanh');
    if (!root) return;
    function esc(s) { return ui.esc(s); }
    var e = A.e;
    var C = 'L_GiamTruGiaCanh';
    var CHLU = { dm: 'CHUN.CHLU' }, DMTT = { dm: 'CHUN.DMTT' };
    var GKS = 'Thông tin trên giấy khai sinh của người phụ thuộc (Nếu người phụ thuộc không có MST, CMND và Hộ chiếu)';
    var NOI = [GKS, 'Nơi đăng ký'];
    var TG = ['Thời gian tính giảm trừ'];
    var canBo = null;

    var ds = A.dsCanBo({
        root: root,
        tieuDe: 'Danh sách giảm trừ gia cảnh',
        actions: ui.btn('confirm', { text: 'Kế thừa sang năm khác', icon: 'fa-paper-plane', mod: 'out-warn', attr: { 'data-a': 'kethua' } }),
        nhac: 'Chọn một cán bộ ở danh sách bên trái để xem danh sách giảm trừ gia cảnh',
        onPick: function (r) { canBo = r; dung(); }
    });

    function dung() {
        ds.m.mainBody.innerHTML = '';
        ums.crud({
            root: ds.m.mainBody,
            embedded: true,
            title: 'Danh sách giảm trừ gia cảnh — ' + e(canBo.HOTEN || (e(canBo.HODEM) + ' ' + e(canBo.TEN))) + ' - Mã cán bộ: ' + e(canBo.MASO),
            formTitle: 'người phụ thuộc',
            icon: 'fa-people-roof',
            formCols: 12,
            saveAgain: 'Lưu và nhập tiếp',
            pageSize: 10,
            multi: false,
            list: {
                paged: true,
                call: function () {
                    return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: canBo.ID, strNguoiTao_Id: '', strTuKhoa: '' };
                }
            },
            detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },
            columns: [
                { title: 'Họ tên người nộp thuế', cls: 'is-nowrap', render: function (r) { return esc(e(r.NHANSU_HOSOCANBO_HODEM) + ' ' + e(r.NHANSU_HOSOCANBO_TEN)); } },
                { title: 'MST của người nộp thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE' },
                { title: 'Họ tên người phụ thuộc', prop: 'HOTEN', cls: 'is-nowrap' },
                { title: 'Ngày sinh người phụ thuộc', cls: 'is-center is-nowrap', render: function (r) { return esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH)); } },
                { title: 'MST của người phụ thuộc', prop: 'MASOTHUENGUOIPHUTHUOC' },
                { title: 'Mã quốc tịch của người phụ thuộc', prop: 'QUOCTICH_MA', cls: 'is-center' },
                { title: 'Quốc tịch của người phụ thuộc', prop: 'QUOCTICH_TEN', cls: 'is-nowrap' },
                { title: 'CMND/Hộ chiếu của người phụ thuộc', render: function (r) { return esc(e(r.CMTND) + '/' + e(r.THECANCUOC) + '/' + e(r.HOCHIEU)); } },
                { title: 'Mã quan hệ với người nộp thuế', prop: 'QUANHE_MA', cls: 'is-center' },
                { title: 'Quan hệ với người nộp thuế', prop: 'QUANHE_TEN' },
                { title: 'Số', prop: 'GIAYKHAISINH_SO', group: [GKS] },
                { title: 'Quyển số', prop: 'GIAYKHAISINH_QUYEN', group: [GKS] },
                { title: 'Mã quốc gia', prop: 'GIAYKHAISINH_QUOCGIA_MA', group: NOI },
                { title: 'Quốc gia', prop: 'GIAYKHAISINH_QUOCGIA_TEN', group: NOI },
                { title: 'Mã Tỉnh/Thành phố', prop: 'GIAYKHAISINH_TINHTHANH_MA', group: NOI },
                { title: 'Tỉnh/Thành phố', prop: 'GIAYKHAISINH_TINHTHANH_TEN', group: NOI },
                { title: 'Mã Quận/Huyện', prop: 'GIAYKHAISINH_QUANHUYEN_MA', group: NOI },
                { title: 'Quận/Huyện', prop: 'GIAYKHAISINH_QUANHUYEN_TEN', group: NOI },
                { title: 'Mã Phường/Xã', prop: 'GIAYKHAISINH_PHUONGXA_MA', group: NOI },
                { title: 'Phường/Xã', prop: 'GIAYKHAISINH_PHUONGXA_TEN', group: NOI },
                { title: 'Từ tháng', cls: 'is-center is-nowrap', group: TG, render: function (r) { return esc(e(r.TUTHANG) + '/' + e(r.TUNAM)); } },
                { title: 'Đến tháng', cls: 'is-center is-nowrap', group: TG, render: function (r) { return esc(e(r.DENTHANG) + '/' + e(r.DENNAM)); } }
            ],
            fields: [
                { key: '_mst', type: 'legend', label: 'Mã số thuế của nhân sự' },
                { key: 'strMaSoThue', col: 'NHANSU_HOSOCANBO_MASOTHUE', label: 'Mã số thuế', span: true },
                { key: '_npt', type: 'legend', label: 'Thông tin người phụ thuộc' },
                { key: 'strHoTen', col: 'HOTEN', label: 'Họ tên', span: true },
                { key: 'strNgaySinh', col: 'NGAYSINH', label: 'Ngày sinh', cols: 4 },
                { key: 'strThangSinh', col: 'THANGSINH', label: 'Tháng sinh', cols: 4 },
                { key: 'strNamSinh', col: 'NAMSINH', label: 'Năm sinh', cols: 4 },
                { key: 'strCMTND', col: 'CMTND', label: 'CMND', cols: 4 },
                { key: 'strTheCanCuoc', col: 'THECANCUOC', label: 'Thẻ căn cước', cols: 4 },
                { key: 'strHoChieu', col: 'HOCHIEU', label: 'Hộ chiếu', cols: 4 },
                { key: 'strQuocTich_Id', col: 'QUOCTICH_ID', label: 'Quốc tịch', type: 'select', source: CHLU, cols: 4 },
                { key: 'strQuanHeVoiNguoiNopThue_Id', col: 'QUANHEVOINGUOINOPTHUE_ID', label: 'Quan hệ với người nộp thuế', type: 'select',
                  source: { dm: 'NS.QHGD' }, cols: 4 },
                { key: 'strMaSoThueNguoiPhuThuoc', col: 'MASOTHUENGUOIPHUTHUOC', label: 'Mã số thuế người phụ thuộc', cols: 4 },
                { key: '_gks', type: 'legend', label: GKS },
                { key: 'strGiayKhaiSinh_So', col: 'GIAYKHAISINH_SO', label: 'Giấy khai sinh số', cols: 4 },
                { key: 'strGiayKhaiSinh_Quyen', col: 'GIAYKHAISINH_QUYEN', label: 'Giấy khai sinh quyển', cols: 4 },
                { key: 'strGiayKhaiSinh_QuocGia_Id', col: 'GIAYKHAISINH_QUOCGIA_ID', label: 'Quốc gia', type: 'select', source: CHLU, cols: 4 },
                { key: 'strGiayKhaiSinh_TinhThanh_Id', col: 'GIAYKHAISINH_TINHTHANH_ID', label: 'Nơi sinh: Tỉnh/ Thành phố', type: 'select', source: DMTT, placeholder: 'Chọn tỉnh thành', cols: 4 },
                { key: 'strGiayKhaiSinh_QuanHuyen_Id', col: 'GIAYKHAISINH_QUANHUYEN_ID', label: 'Quận/ Huyện', type: 'select', source: DMTT, placeholder: 'Chọn Quận/Huyện', cols: 4 },
                { key: 'strGiayKhaiSinh_PhuongXa_Id', col: 'GIAYKHAISINH_PHUONGXA_ID', label: 'Phường/ Xã', type: 'select', source: DMTT, placeholder: 'Chọn phường/xã', cols: 4 },
                { key: '_tg', type: 'legend', label: 'Thời gian tính giảm trừ' },
                { key: 'strTuThang', col: 'TUTHANG', label: 'Từ tháng', cols: 3 },
                { key: 'strTuNam', col: 'TUNAM', label: 'Năm', cols: 3 },
                { key: 'strDenThang', col: 'DENTHANG', label: 'Đến tháng', cols: 3 },
                { key: 'strDenNam', col: 'DENNAM', label: 'Năm', cols: 3 },
                { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' }
            ],
            save: function (v, row) {
                var x = { action: C + (row ? '/CapNhat' : '/ThemMoi'), strId: row ? row.ID : '' };
                ['strMaSoThue', 'strHoTen', 'strNgaySinh', 'strThangSinh', 'strNamSinh', 'strQuocTich_Id', 'strCMTND', 'strHoChieu',
                 'strTheCanCuoc', 'strMaSoThueNguoiPhuThuoc', 'strQuanHeVoiNguoiNopThue_Id', 'strGiayKhaiSinh_So', 'strGiayKhaiSinh_Quyen',
                 'strGiayKhaiSinh_QuocGia_Id', 'strGiayKhaiSinh_TinhThanh_Id', 'strGiayKhaiSinh_QuanHuyen_Id', 'strGiayKhaiSinh_PhuongXa_Id',
                 'strTuThang', 'strTuNam', 'strDenThang', 'strDenNam'].forEach(function (k) { x[k] = v[k]; });
                x.strNhanSu_HoSoCanBo_Id = canBo.ID;
                x.strNguoiThucHien_Id = A.uid();
                return x;
            },
            remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: A.uid() }; }); }
        });
    }

    /* "Kế thừa sang năm khác" — gốc hỏi Năm nguồn / Năm đích trong hộp xác nhận, bắt nhập đủ */
    function keThua() {
        var body = document.createElement('div');
        body.innerHTML = '<p class="ums-u-mt-0">Bạn điền đủ thông tin năm để kế thừa?</p><div class="ums-grid ums-grid--2">' +
            ui.field('Năm nguồn', '<input class="ums-input" data-k="nguon" autocomplete="off">', { required: true }) +
            ui.field('Năm đích', '<input class="ums-input" data-k="dich" autocomplete="off">', { required: true }) + '</div>';
        ui.dialog({
            title: 'Kế thừa sang năm khác', icon: 'fa-paper-plane', size: 'sm', body: body,
            buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function (dlg) {
                var ng = body.querySelector('[data-k="nguon"]').value.trim(), di = body.querySelector('[data-k="dich"]').value.trim();
                if (!ng || !di) { ui.toast('Vui lòng nhập !', 'warn'); return false; }
                ums.api.call({ action: C + '/KeThua', strNamNguon: ng, strNamDich: di, strNguoiThucHien_Id: A.uid() })
                    .then(function () { ui.toast('Kế thừa thành công. Hãy kiểm tra lại', 'ok'); dlg.close(); })
                    .catch(function (err) { ums.api.handle(err, 'kế thừa giảm trừ gia cảnh'); });
                return false;
            } }]
        });
    }
    root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="kethua"]')) keThua(); });
})();
