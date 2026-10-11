/* =========================================================================
   Thực hiện xét (Danh hiệu)
   Bản gốc: ApisDanhHieu/Modules/kehoach/html/thuchienxet.html + script/thuchienxet.js (vỏ indexi, 2.150 dòng)
   ---------------------------------------------------------------------------
   Màn gốc chép từ "Thực hiện xét" Học bổng (93%); Luận văn chép lại màn này (98%, đã chuyển trước) → cùng khung:
   ums.hbKh (Học bổng) + ums.khxl (Xử lý học vụ) + ums.dhKh (_dh_chung.js). Khác bản Luận văn: cột nhân sự phân công gọi
   LayDSXLDH_KeHoach_NhanSu (khoá strXLDH_KeHoach_Id), công nhận / huỷ gửi strXLDH_KeHoach_Id, cột nối kết quả XLDH_KETQUA_ID.
   Bố cục giữ như gốc (một cột): thanh lọc (Loại danh hiệu · Học kỳ · từ khoá · Tìm kiếm) → khung hàng đợi
   (#tblTaskBar_ThucHienXet) → "Danh sách kế hoạch" (nút "Thực hiện xét", "Thực hiện công nhận kết quả chính thức";
   chân khung "Hủy kết quả xét"). Ba hộp: đối tượng xét (#myModal), sinh viên đạt (#myModalDat), không đạt (#myModalKhongDat,
   bảng 2/3 + học phần chưa hoàn thành 1/3).

   Lời gọi (chép nguyên):
       HB_XepLoaiDanhHieu/LayDSXLDH_NguoiDung_PhanLoai GET strNguoiThucHien_Id → ô "Chọn loại danh hiệu" (_dh_chung.js)
       HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach GET strTuKhoa · strPhanLoai_Id · strDaoTao_ThoiGianDaoTao_Id · strNguoiThucHien_Id
            · pageIndex · pageSize
       HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_NhanSu GET (cột "Nhân sự phân công xét", mỗi kế hoạch một lời gọi — _dh_chung.js)
       HB_DanhHieuHangDoi/TaoHangDoi_XLDH_TuDong GET "Thực hiện xét" (hỏi lại): strTuKhoa '' · strChucNang_Id
            · strXLDH_KeHoach_Id = các ID đã đánh dấu nối dấu phẩy · strNguoiThucHien_Id. Xong: "Khởi tạo dữ liệu thành công,
            vui lòng chạy tiến trình để thực hiện!" + nạp lại hàng đợi (XET_DH, strName ThucHienXet; html gốc chỉ có
            #tblTaskBar_… không có lịch sử).
       HB_KetQua/Them_HB_KetQua_CongNhan  strId '' · strChucNang_Id · strXLDH_KeHoach_Id · strNguoiThucHien_Id (mỗi kế hoạch một lời gọi)
       HB_KetQua/Xoa                      strChucNang_Id · strXLDH_KeHoach_Id · strNguoiThucHien_Id (mỗi kế hoạch một lời gọi) — "Hủy kết quả xét"
       HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_PhamVi GET  hộp đối tượng (_dh_chung.js — gốc có phân trang máy chủ)
       HB_XepLoaiDanhHieu/LayDSXLDH_KetQua_ChiTiet GET (strXLDH_KeHoach_Id) → cột động + LayDSXLDH_KetQua GET — hộp "đạt" (_dh_chung.js)
       HB_XepLoaiDanhHieu/LayDSXLDH_KetQua_Loi_ChiTiet GET → cột động + LayDSXLDH_KetQua_Loi GET (strTuKhoa '' · strNguoiDung_Id ''
            · strXLDH_KeHoach_Id · strNguoiTao_Id '' · pageIndex · pageSize) — hộp "không đạt"
       TN_KetQuaHocPhan/LayDanhSach GET  "Học phần chưa hoàn thành" → Chi tiết: strQLSV_NguoiHoc_Id · strDaoTao_ChuongTrinh_Id
            = DAOTAO_TOCHUCCHUONGTRINH_ID · strXLDH_KeHoach_Id = TN_KEHOACH_ID · strPhanLoai_Id = PHANLOAI_ID (tên cột như gốc).
   Cột danh sách: TEN · DAOTAO_THOIGIANDAOTAO · NGAYBATDAU · NGAYKETTHUC · PHANLOAI_TEN · Nhân sự phân công xét · Đối tượng xét
        · DIEUKIENXET · Kết quả xét · Kết quả không đạt · KETQUACHINHTHUC (1 → "Chính thức") · ô đánh dấu.

   Khác gốc:
       · "Thực hiện công nhận kết quả chính thức": gốc gom hai lời gọi vào MỘT object (khoá trùng — chỉ còn TaoHangDoi_XLDH_TuDong
         với strXLDH_KeHoach_Id đọc ô dropAAAA không có → rỗng, và không bao giờ gọi Them_HB_KetQua_CongNhan) → làm theo ý định
         (tên nút, thông báo "Thêm mới thành công"): gọi Them_HB_KetQua_CongNhan cho từng kế hoạch đã chọn.
       · Hỏi lại bằng ums.ui.confirm (gốc gắn thêm trình xử lý #btnYes mỗi lần bấm → bấm lần hai chạy hai lần); hàng loạt qua ums.ui.batch,
         xong nạp lại MỘT lần.
       · Hộp không đạt: gốc dùng biến strHB_KeHoach_Id không tồn tại (getList_KhongDat_ChiTiet) → dùng ID kế hoạch đang xem.
       · Mã số bấm được mở hộp kết quả học tập (btnView_HocTap — dùng ums.khxl.hocTap như Học bổng).
   Cố ý bỏ (mã chết — html không có #zoneEdit / #tblInput_*): rewrite, viewEdit_ThucHienXet, save_Lop / save_ChuongTrinh / save_Khoa,
   getList_SinhVien, save/delete_SinhVien, genModal_SinhVien, getList_SinhVienMD, getList_HeDaoTao… cbGenCombo_*, getList_NamNhapHoc,
   save/getList/delete_ThanhVien, genHTML_NhanSu, arrValid.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var D = ums.dhKh, H = D.H, K = D.K, e = H.e, XL = D.XL;
    var root = document.getElementById('dh-kehoach-thuchienxet');
    if (!root) return;

    root.innerHTML =
        pat.page('Thực hiện xét', '') +
        pat.filterBar([
            { key: 'loai', type: 'select', label: 'Chọn loại danh hiệu' },
            { key: 'tg', type: 'select', label: 'Tất cả học kỳ' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div data-z="hd"></div>' }) +
        pat.panel({
            title: 'Danh sách kế hoạch', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 't',
            tools: ui.xoaChon('input[data-khx]', { goc: '.ums-panel', text: 'Hủy kết quả xét', attr: { 'data-a': 'huy' } }) +
                ui.btn('search', { text: 'Thực hiện xét', mod: 'primary', icon: 'fa-user-gear', attr: { 'data-a': 'hangdoi' } }) +
                ui.btn('confirm', { text: 'Thực hiện công nhận kết quả chính thức', attr: { 'data-a': 'congnhan' } })
        });

    function q(sel) { return root.querySelector(sel); }
    var fLoai = q('[data-f="loai"]'), fTg = q('[data-f="tg"]'), fQ = q('[data-f="q"]');
    ui.enhance(root);
    K.ganChon(root);

    var hangDoi = ums.queue.mount(q('[data-z="hd"]'), { strLoaiNhiemVu: 'XET_DH', strName: 'ThucHienXet', history: false });

    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        D.dsKeHoach({
            strTuKhoa: (fQ.value || '').trim(), strPhanLoai_Id: fLoai.value, strDaoTao_ThoiGianDaoTao_Id: fTg.value,
            strNguoiThucHien_Id: H.uid(), pageIndex: page, pageSize: size
        }).then(function (r) {
            rows = K.ds(r);
            total = Number(r.pager) || rows.length;
            ve();
        }).catch(function (err) { K.loi(host, err, 'danh sách kế hoạch'); });
    }
    function nut(a, id) { return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': id } }); }
    function ve() {
        q('[data-z="n"]').textContent = '(' + total + ')';
        var host = q('[data-z="t"]');
        ui.table({
            el: host, rows: rows, stt: true, empty: 'Chưa có kế hoạch',
            page: {
                index: page, size: size, total: total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) load(p); },
                onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); load(1); }
            },
            columns: [
                { title: 'Tên', prop: 'TEN', cls: 'hbkh-ten' },
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
                { title: 'Từ ngày', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
                { title: 'Đến ngày', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
                H.cotPhanCong(),
                { title: 'Đối tượng xét', cls: 'is-center is-nowrap', render: function (r) { return nut('doituong', r.ID); } },
                { title: 'Điều kiện xét', prop: 'DIEUKIENXET', cls: 'hbkh-dk' },
                { title: 'Kết quả xét', cls: 'is-center is-nowrap', render: function (r) { return nut('dat', r.ID); } },
                { title: 'Kết quả không đạt', cls: 'is-center is-nowrap', render: function (r) { return nut('khongdat', r.ID); } },
                { title: 'Kết quả chính thức', cls: 'is-center is-nowrap', render: function (r) {
                    return String(r.KETQUACHINHTHUC) === '1' ? ui.badge('Chính thức', 'ok') : '';
                } },
                K.cotChon('khx')
            ]
        });
        D.napPhanCong(host, rows);
    }
    function daChon() { return K.daChon(q('[data-z="t"]'), 'khx'); }
    function chucNang() { return (ums.state && ums.state.chucNangId) || ''; }

    /* ---------- Thao tác trên kế hoạch đã chọn ----------------------------- */
    function taoHangDoi() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn Thực hiện xét không?', { title: 'Thực hiện xét', ok: 'Thực hiện xét' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'HB_DanhHieuHangDoi/TaoHangDoi_XLDH_TuDong', method: 'GET',
                strTuKhoa: '', strChucNang_Id: chucNang(), strXLDH_KeHoach_Id: ids.join(',') })
                .then(function () {
                    ui.toast('Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!', 'ok');
                    hangDoi.reload();
                }).catch(function (err) { ums.api.handle(err, 'HB_DanhHieuHangDoi/TaoHangDoi_XLDH_TuDong'); });
        });
    }
    function congNhan() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng xét?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xét không?', { title: 'Công nhận kết quả chính thức', ok: 'Đồng ý' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                return { action: 'HB_KetQua/Them_HB_KetQua_CongNhan', strId: '', strChucNang_Id: chucNang(), strXLDH_KeHoach_Id: id };
            }), { title: 'Đang công nhận kết quả', okText: 'Thêm mới thành công!', show: true }).then(function () { load(); });
        });
    }
    function huy() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) {
            return { action: 'HB_KetQua/Xoa', strChucNang_Id: chucNang(), strXLDH_KeHoach_Id: id };
        }), function () { load(); });
    }

    /* ---------- Hộp không đạt (đối tượng / đạt: _dh_chung.js) --------------- */
    function hopKhongDat(kh) {
        H.hopDS({
            title: 'Danh sách sinh viên không đạt', phanTrang: true, tim: false, ben: true, khoaKQ: 'XLDH_KETQUA_ID',
            chiTiet: { action: XL + 'LayDSXLDH_KetQua_Loi_ChiTiet', method: 'GET', strXLDH_KeHoach_Id: kh.ID },
            call: function (p, s) {
                return { action: XL + 'LayDSXLDH_KetQua_Loi', method: 'GET',
                    strTuKhoa: '', strNguoiDung_Id: '', strXLDH_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: p, pageSize: s };
            },
            columns: function () {
                return H.cotSV({ hocTap: true }).concat([{ title: 'Học phần chưa hoàn thành', cls: 'is-center is-nowrap', render: function (r) {
                    return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': 'hp', 'data-id': r.ID } });
                } }]);
            },
            onClick: function (b, r, api) {
                if (b.getAttribute('data-a') !== 'hp' || !r) return;
                hocPhan(r, api.ben);
            }
        });
    }
    function hocPhan(a, ben) {
        ben.innerHTML = '<div class="ums-legend">Chi tiết học phần không đạt ' + esc(H.hoTen(a)) + '</div><div data-z="hp"></div>';
        var host = ben.querySelector('[data-z="hp"]');
        K.dang(host);
        ums.api.call({ action: 'TN_KetQuaHocPhan/LayDanhSach', method: 'GET',
            strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: a.DAOTAO_TOCHUCCHUONGTRINH_ID,
            strXLDH_KeHoach_Id: a.TN_KEHOACH_ID, strPhanLoai_Id: a.PHANLOAI_ID })
            .then(function (r) {
                ui.table({ el: host, rows: K.ds(r), stt: true, empty: 'Không có học phần', columns: [
                    { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_MA) + ' - ' + e(x.DAOTAO_HOCPHAN_TEN)); } },
                    { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' },
                    { title: 'Mô tả', prop: 'MOTA' }
                ] });
            }).catch(function (err) { K.loi(host, err, 'học phần không đạt'); });
    }

    /* ---------- Sự kiện ----------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        var id = b.getAttribute('data-id'), r = id ? K.tim(rows, id) : null;
        switch (b.getAttribute('data-a')) {
            case 'search': load(1); break;
            case 'hangdoi': taoHangDoi(); break;
            case 'congnhan': congNhan(); break;
            case 'huy': huy(); break;
            case 'doituong': if (r) D.hopDoiTuong(r); break;
            case 'dat': if (r) D.hopKetQua(r, { title: 'Danh sách sinh viên đạt', chiTiet: true }); break;
            case 'khongdat': if (r) hopKhongDat(r); break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    H.napHocKy([fTg], ['Tất cả học kỳ']);
    D.napLoai([fLoai]);
    load(1);
})();
