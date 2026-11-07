/* =========================================================================
   Thực hiện xét học bổng
   Bản gốc: ApisHocBong/Modules/kehoach/html/thuchienxet.html + script/thuchienxet.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (một cột): thanh lọc (Quỹ · Học kỳ · từ khoá · Tìm kiếm) → khung hàng đợi
   (#tblTaskBar_ThucHienXet) → "Danh sách kế hoạch" (nút "Thực hiện xét", "Thực hiện công nhận kết quả
   chính thức"; chân khung "Hủy kết quả xét"). Ba hộp: "Danh sách sinh viên xét học bổng" (#myModal, có
   "Thực hiện xét" từng người), "Danh sách sinh viên đạt học bổng" (#myModalDat), "Danh sách sinh viên
   không đạt học bổng" (#myModalKhongDat — bảng 2/3 + bảng học phần 1/3 như col-sm-9 / col-sm-3 gốc).
   Khung chung ba màn: _kh_chung.js (ums.hbKh).

   Lời gọi (chép nguyên):
       HB_ThongTin/LayDSHB_KeHoach POST  strNguoiThucHien_Id · strTuKhoa · strPhanLoai_Id '' (dropSearch_PhanLoai
            không có) · strDaoTao_ThoiGianDaoTao_Id · strNguoiDung_Id '' · strNguoiTao_Id '' (gốc đọc dropAAAA —
            KHÁC màn Kế hoạch gửi userId) · pageIndex · pageSize · strHB_QuyHocBong_Id · dHieuLuc 1
       HB_HangDoi/TaoHangDoi_HB_TuDong  GET  "Thực hiện xét" (hỏi lại): strTuKhoa '' · strChucNang_Id
            · strHB_KeHoach_Id = các ID đã đánh dấu nối dấu phẩy. Xong: "Khởi tạo dữ liệu thành công, vui lòng
            chạy tiến trình để thực hiện!" + nạp lại hàng đợi.
       Hàng đợi XET_HB (createHangDoi, strName ThucHienXet): ums.queue.mount — html gốc chỉ có #tblTaskBar_…,
            không có #tblHistory_… → không vẽ lịch sử; endHangDoi gốc rỗng → không onDone.
       HB_KetQua/Them_HB_KetQua_CongNhan  strId '' · strHB_KeHoach_Id (mỗi kế hoạch đã chọn một lời gọi)
       HB_KetQua/Xoa                      strChucNang_Id · strHB_KeHoach_Id (mỗi kế hoạch một lời gọi) — "Hủy kết quả xét"
       HB_KeHoach_PhamVi/LayDanhSach GET  hộp đối tượng: strTuKhoa = ô tìm của hộp (bFilter gốc — gửi máy chủ)
            · strNguoiDung_Id '' · strHB_KeHoach_Id · strNguoiTao_Id '' · pageIndex · pageSize
       XLHV_HB_TinhToan_MH/… pkg_hocbong_tinhtoan.XetHocBong  "Thực hiện xét" trong hộp, mỗi dòng đánh dấu một lời
            gọi, tham số đọc từ CHÍNH dòng: QLSV_NGUOIHOC_ID · DAOTAO_LOPQUANLY_ID · DAOTAO_TOCHUCCHUONGTRINH_ID
            · QLSV_TRANGTHAINGUOIHOC_ID · DAOTAO_THOIGIANDAOTAO_ID · HB_KEHOACH_ID · HB_QUYHOCBONG_ID
       HB_KetQua/LayChiTiet GET (strHB_KeHoach_Id) → cột động + HB_KetQua/LayDanhSach GET (strTuKhoa ô tìm · strNguoiDung_Id ''
            · strHB_KeHoach_Id · strNguoiTao_Id '' · pageIndex · pageSize) — hộp "đạt"
       HB_KetQua/LayDSHB_KetQua_Loi_ChiTiet GET → cột động + HB_KetQua/LayDSHB_KetQua_Loi GET (cùng tham số) — hộp "không đạt"
       TN_KetQuaHocPhan/LayDanhSach GET  "Học phần chưa hoàn thành" → Chi tiết: strQLSV_NguoiHoc_Id
            · strDaoTao_ChuongTrinh_Id = DAOTAO_TOCHUCCHUONGTRINH_ID · strHB_KeHoach_Id = TN_KEHOACH_ID · strPhanLoai_Id
            = PHANLOAI_ID của dòng (tên cột như gốc — chép từ màn Tốt nghiệp). Cột: DAOTAO_HOCPHAN_MA - _TEN · DIEM
            · DANHGIA_TEN · MOTA.
   Cột danh sách: TEN · DAOTAO_THOIGIANDAOTAO · NGAYBATDAU · NGAYKETTHUC · PHANLOAI_TEN · Nhân sự phân công xét
        · Đối tượng xét · DIEUKIENXET · Kết quả xét · Kết quả không đạt · KETQUACHINHTHUC (1 → "Chính thức") · ô đánh dấu.

   Cố ý bỏ (mã chết — html không có #zoneEdit / #tblInput_*): rewrite, viewEdit_ThucHienXet, save_Lop / save_ChuongTrinh
   / save_Khoa, getList_SinhVien, save/delete_SinhVien, genModal_SinhVien riêng, getList_HeDaoTao… cbGenCombo_*,
   KHCT_NamNhapHoc, save/getList/delete_ThanhVien, genHTML_NhanSu, arrValid.
   Khác gốc:
       · Mã số bấm được mở hộp kết quả học tập (btnView_HocTap gốc nạp vào #modalHTSinhVien KHÔNG có trong html →
         không hiện gì) — dùng ums.khxl.hocTap như Xử lý học vụ.
       · Hỏi lại bằng ums.ui.confirm (gốc gắn thêm trình xử lý #btnYes mỗi lần bấm → bấm lần hai chạy hai lần).
       · Kéo gốc lần 12–13 (7/11, gốc edu.process / edu.exporter): "Thực hiện xét" → ums.process.runJob (một yêu cầu cho mọi kế
         hoạch đã chọn; dòng phụ "Kế hoạch xét: …", điều kiện Quỹ · Thời gian; thành công → nạp lại hàng đợi); "Công nhận
         kết quả chính thức" / "Hủy kết quả xét" / "Thực hiện xét" trong hộp đối tượng → ums.process.run mỗi kế hoạch / sinh
         viên một bản ghi (cột như gốc), Bước 1 thay hộp hỏi lại. Nút "Xuất Excel": danh sách kế hoạch (đầu khung), hộp đối
         tượng xét (xuất ĐỦ mọi trang — gốc fetchAll), hộp đạt / không đạt (bảng đang xem) — ums.ui.xuatBang qua H.hopDS o.xuat.
       · Hộp không đạt: dòng tiêu đề học phần ghép Họ đệm + Tên (gốc ghép QLSV_NGUOIHOC_HOTEN + QLSV_NGUOIHOC_TEN).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, H = ums.hbKh, K = H.K, e = H.e;
    var root = document.getElementById('hb-thuchienxet');
    if (!root) return;

    root.innerHTML =
        pat.page('Thực hiện xét', '') +
        pat.filterBar([
            { key: 'quy', type: 'select', label: 'Chọn quỹ học bổng' },
            { key: 'tg', type: 'select', label: 'Tất cả học kỳ' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div data-z="hd"></div>' }) +
        pat.panel({
            title: 'Danh sách kế hoạch', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 't',
            tools: ui.xoaChon('input[data-khx]', { goc: '.ums-panel', text: 'Hủy kết quả xét', attr: { 'data-a': 'huy' } }) +
                ui.btn('excel', { attr: { 'data-a': 'xuat' } }) +
                ui.btn('search', { text: 'Thực hiện xét', mod: 'primary', icon: 'fa-user-gear', attr: { 'data-a': 'hangdoi' } }) +
                ui.btn('confirm', { text: 'Thực hiện công nhận kết quả chính thức', attr: { 'data-a': 'congnhan' } })
        });

    function q(sel) { return root.querySelector(sel); }
    var fQuy = q('[data-f="quy"]'), fTg = q('[data-f="tg"]'), fQ = q('[data-f="q"]');
    ui.enhance(root);
    K.ganChon(root);

    var hangDoi = ums.queue.mount(q('[data-z="hd"]'), { strLoaiNhiemVu: 'XET_HB', strName: 'ThucHienXet', history: false });

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        H.dsKeHoach({
            strNguoiThucHien_Id: H.uid(), strTuKhoa: (fQ.value || '').trim(), strPhanLoai_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: fTg.value, strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: page, pageSize: size, strHB_QuyHocBong_Id: fQuy.value, dHieuLuc: 1
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
        H.napPhanCong(host, rows);
    }
    function daChon() { return K.daChon(q('[data-z="t"]'), 'khx'); }
    function dongChon() { return daChon().map(function (id) { return K.tim(rows, id); }).filter(Boolean); }
    function dieuKien() { return H.dieuKien(fQuy, fTg); }
    function phuKH(kh) { return function () { return H.phu(dieuKien(), kh ? ['Kế hoạch: ' + e(kh.TEN)] : []); }; }

    /* ---------- Thao tác trên kế hoạch đã chọn ----------------------------- */
    function taoHangDoi() {
        var chon = dongChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var ids = chon.map(function (r) { return r.ID; });
        ums.process.runJob({
            title: 'Thực hiện xét học bổng', what: 'Thực hiện xét ' + chon.length + ' kế hoạch đã chọn', fileName: 'KetQuaThucHienXetHocBong',
            subTitles: ['Kế hoạch xét: ' + chon.map(function (r) { return e(r.TEN); }).join('; ')], dieuKien: dieuKien(),
            okMessage: 'Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!',
            request: function () {
                return { action: 'HB_HangDoi/TaoHangDoi_HB_TuDong', method: 'GET', strTuKhoa: '', strChucNang_Id: '', strHB_KeHoach_Id: ids.join(','), strNguoiThucHien_Id: '' };
            },
            onSuccess: function () { hangDoi.reload(); }
        });
    }
    function congNhan() {
        var chon = dongChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng xét?', 'warn'); return; }
        ums.process.run({
            title: 'Công nhận kết quả xét học bổng chính thức', unit: 'kế hoạch', fileName: 'KetQuaCongNhanKetQuaXet', dieuKien: dieuKien(),
            items: chon, columns: H.colsKeHoach(), okMessage: 'Thêm mới thành công!',
            request: function (r) { return { action: 'HB_KetQua/Them_HB_KetQua_CongNhan', strId: '', strChucNang_Id: '', strHB_KeHoach_Id: r.ID, strNguoiThucHien_Id: '' }; },
            refresh: function () { load(); }
        });
    }
    function huy() {
        var chon = dongChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ums.process.run({
            title: 'Hủy kết quả xét học bổng', unit: 'kế hoạch', fileName: 'KetQuaHuyKetQuaXet', dieuKien: dieuKien(),
            notes: ['Thao tác xóa dữ liệu kết quả xét của các kế hoạch trong danh sách.'],
            items: chon, columns: H.colsKeHoach(), okMessage: 'Xóa thành công!',
            request: function (r) { return { action: 'HB_KetQua/Xoa', strChucNang_Id: '', strHB_KeHoach_Id: r.ID, strNguoiThucHien_Id: '' }; },
            refresh: function () { load(); }
        });
    }

    /* ---------- Ba hộp ------------------------------------------------------ */
    function hopDoiTuong(kh) {
        H.hopDS({
            title: 'Danh sách sinh viên xét học bổng', phanTrang: true, tim: 'may', chon: 'xethb',
            xuat: { ten: 'DoiTuongXetHocBong', tieuDe: 'DANH SÁCH ĐỐI TƯỢNG XÉT HỌC BỔNG', phu: phuKH(kh), tatCa: true },
            call: function (p, s, tu) {
                return { action: 'HB_KeHoach_PhamVi/LayDanhSach', method: 'GET',
                    strTuKhoa: tu, strNguoiDung_Id: '', strHB_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: p, pageSize: s };
            },
            columns: function () { return H.cotSV({ hocTap: true }); },
            buttons: [{ text: 'Thực hiện xét', kind: 'save', icon: 'fa-paper-plane', onClick: function (api) {
                var ids = api.chon();
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng xét?', 'warn'); return; }
                var ds = api.rows();
                ums.process.run({
                    title: 'Xét học bổng', unit: 'sinh viên', fileName: 'KetQuaXetHocBong',
                    items: ids.map(function (id) { return K.tim(ds, id); }).filter(Boolean),
                    columns: [
                        { header: 'Mã số', render: function (r) { return e(r.QLSV_NGUOIHOC_MASO); } },
                        { header: 'Họ tên', render: function (r) { return H.hoTen(r); } },
                        { header: 'Lớp quản lý', render: function (r) { return e(r.DAOTAO_LOPQUANLY_TEN); } },
                        { header: 'Chương trình', render: function (r) { return e(r.DAOTAO_CHUONGTRINH_TEN); } }
                    ],
                    okMessage: 'Cập nhật thành công!',
                    request: function (a) {
                        return { action: 'XLHV_HB_TinhToan_MH/GSQ1CS4iAy4vJgPP', func: 'pkg_hocbong_tinhtoan.XetHocBong',
                            strChucNang_Id: '',
                            strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: a.DAOTAO_LOPQUANLY_ID,
                            strDaoTao_ChuongTrinh_Id: a.DAOTAO_TOCHUCCHUONGTRINH_ID, strQLSV_TrangThaiNguoiHoc_Id: a.QLSV_TRANGTHAINGUOIHOC_ID,
                            strDaoTao_ThoiGianDaoTao_Id: a.DAOTAO_THOIGIANDAOTAO_ID, strHB_KeHoach_Id: a.HB_KEHOACH_ID,
                            strHB_QuyHocBong_Id: a.HB_QUYHOCBONG_ID, strNguoiThucHien_Id: '' };
                    }
                });
            } }]
        });
    }
    function hopDat(kh) {
        H.hopDS({
            title: 'Danh sách sinh viên đạt học bổng', phanTrang: true, tim: 'may',
            xuat: { ten: 'KetQuaXetHocBongDat', tieuDe: 'DANH SÁCH SINH VIÊN ĐẠT HỌC BỔNG', phu: phuKH(kh) },
            chiTiet: { action: 'HB_KetQua/LayChiTiet', method: 'GET', strHB_KeHoach_Id: kh.ID },
            call: function (p, s, tu) {
                return { action: 'HB_KetQua/LayDanhSach', method: 'GET',
                    strTuKhoa: tu, strNguoiDung_Id: '', strHB_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: p, pageSize: s };
            },
            columns: function () { return H.cotSV({ hocTap: true }).concat(H.cotXepLoai()); }
        });
    }
    function hopKhongDat(kh) {
        H.hopDS({
            title: 'Danh sách sinh viên không đạt học bổng', phanTrang: true, tim: 'may', ben: true,
            xuat: { ten: 'KetQuaXetHocBongKhongDat', tieuDe: 'DANH SÁCH SINH VIÊN KHÔNG ĐẠT HỌC BỔNG', phu: phuKH(kh) },
            chiTiet: { action: 'HB_KetQua/LayDSHB_KetQua_Loi_ChiTiet', method: 'GET', strHB_KeHoach_Id: kh.ID },
            call: function (p, s, tu) {
                return { action: 'HB_KetQua/LayDSHB_KetQua_Loi', method: 'GET',
                    strTuKhoa: tu, strNguoiDung_Id: '', strHB_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: p, pageSize: s };
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
            strHB_KeHoach_Id: a.TN_KEHOACH_ID, strPhanLoai_Id: a.PHANLOAI_ID })
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
            case 'xuat': ui.xuatBang(q('[data-z="t"]'), { ten: 'DanhSachKeHoachXetHocBong', tieuDe: 'DANH SÁCH KẾ HOẠCH XÉT HỌC BỔNG', phu: H.phu(dieuKien()) }); break;
            case 'doituong': if (r) hopDoiTuong(r); break;
            case 'dat': if (r) hopDat(r); break;
            case 'khongdat': if (r) hopKhongDat(r); break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    H.napHocKy([fTg], ['Tất cả học kỳ']);
    H.napQuy([fQuy]);
    load(1);
})();
