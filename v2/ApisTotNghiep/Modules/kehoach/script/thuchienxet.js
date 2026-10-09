/* =========================================================================
   Thực hiện xét tốt nghiệp
   Bản gốc: ApisTotNghiep/Modules/kehoach/html/thuchienxet.html + script/thuchienxet.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (một cột): khung tìm kiếm (Phân loại · Học kỳ · từ khoá · Tìm kiếm / Khoá học (chọn
   nhiều) · Lớp quản lý (chọn nhiều) · Xuất báo cáo / Import) → khung hàng đợi (#tblTaskBar_ThucHienXet)
   → "Danh sách kế hoạch" (nút "Thực hiện xét", "Thực hiện công nhận kết quả chính thức"; chân khung
   "Hủy kết quả xét"). Năm hộp: "Danh sách đối tượng xét" (#myModal — có "Thực hiện xét" từng người và
   "Danh sách chưa xét"), "Danh sách đạt" (#myModalDat), "Danh sách không đạt" (#myModalKhongDat — bảng 2/3
   + bảng học phần 1/3), "Danh sách đã công nhận" (#myModalDaCongNhan), "Danh sách sinh viên" đăng ký hoãn
   - xét sớm (#myModalHoanXet). Khung chung: ums.hbKh (Học bổng — _kh_chung.js, nạp chéo), ums.khxl (XLHV).

   Lời gọi (chép nguyên):
       TN_ThongTin/LayDSTN_KeHoach GET  strTuKhoa · strPhanLoai_Id · strDaoTao_ThoiGianDaoTao_Id · strNguoiDung_Id ''
            · strNguoiTao_Id '' (gốc đọc dropAAAA) · pageIndex · pageSize (phân trang máy chủ)
       TN_KeHoach/LayDSPhanLoaiXetTheoND1 GET  strNguoiDung_Id = userId → ô Phân loại (TEN, "Chọn phân loại")
       edu.system.getList_ThoiGianDaoTao (strNam_Id '' · pageSize 100000) → ô Học kỳ (DAOTAO_THOIGIANDAOTAO)
       TN_KeHoach_NhanSu/LayDanhSach GET  cột "Nhân sự phân công xét" — mỗi kế hoạch một lời gọi (ums.hbKh.napPhanCong
            với strTN_KeHoach_Id). Gốc ghi vào #DSPhanCong KHÔNG kèm ID → cột luôn là nút trống; ở đây hiện tên.
       TN_ThongTin/LayDSKhoaHocTheoKeHoach GET  type GET · strTN_KeHoach_Id = các kế hoạch đã đánh dấu (nối dấu phẩy)
            · strNguoiThucHien_Id = userId → ô Khoá học (TEN). Nạp lại mỗi lần đánh dấu / bỏ đánh dấu kế hoạch.
       TN_ThongTin_MH/… pkg_totnghiep_thongtin.LayDSLopQuanLyTheoKeHoach  strTN_KeHoach_Id · strDaoTao_KhoaDaoTao_Id
            (ô Khoá học, nối dấu phẩy) · strNguoiThucHien_Id → ô Lớp quản lý (TEN).
       TN_HangDoi/TaoHangDoi_TN_TuDong GET  "Thực hiện xét" (hỏi lại): strTuKhoa '' · strChucNang_Id · strTN_KeHoach_Id
            = ID đã đánh dấu nối dấu phẩy. Xong: "Khởi tạo dữ liệu thành công, …" + nạp lại hàng đợi.
       Hàng đợi XET_TN (createHangDoi, strName ThucHienXet): ums.queue.mount — html gốc chỉ có #tblTaskBar_…
            → không vẽ lịch sử; endHangDoi gốc rỗng → không onDone.
       TN_KetQua_CongNhan/ThemMoi  strId '' · strChucNang_Id · strTN_KeHoach_Id (mỗi kế hoạch đã chọn một lời gọi)
       TN_KetQua_CongNhan/Xoa      strChucNang_Id · strTN_KeHoach_Id (mỗi kế hoạch một lời gọi) — nút "Hủy kết quả xét"
            (gốc đặt chữ "Hủy kết quả xét" nhưng xoá CÔNG NHẬN — giữ cả chữ lẫn lời gọi như gốc).
       TN_KeHoach_PhamVi/LayDanhSach GET  hộp đối tượng: strTuKhoa (ô tìm của hộp) · strNguoiDung_Id '' · strTN_KeHoach_Id
            · strNguoiTao_Id '' · pageIndex · pageSize. Ô đánh dấu đánh sẵn khi THUCHIENXET có giá trị.
       TN_ThongTin/LayDSTN_KeHoach_PhamVi_ChuaXet GET  "Danh sách chưa xét": strTuKhoa '' · strNguoiDung_Id ''
            · strTN_KeHoach_Id · strNguoiTao_Id '' · pageIndex 1 · pageSize 100000 (không phân trang, như gốc).
       TN_KeHoach_PhamVi/ThietLap_Xet_TN_KeHoach_PhamVi POST  "Thực hiện xét" trong hộp: type POST
            · strTN_KeHoach_PhamVi_Id = ID dòng · dThucHienXet 1 — CHỈ dòng vừa đánh dấu mà trước đó chưa xét (như gốc);
            xong nạp lại danh sách đối tượng.
       TN_KetQua/LayChiTiet GET (strTN_KeHoach_Id) → cột động (rsCot) + giá trị (rsDuLieu, nối theo TN_KETQUA_ID)
            + TN_KetQua/LayDanhSach GET (strTuKhoa ô tìm · strNguoiDung_Id '' · strTN_KeHoach_Id · strNguoiTao_Id ''
            · pageIndex · pageSize) — hộp "Danh sách đạt" (có cột ô đánh dấu như gốc — dùng cho Import).
       TN_KetQua_Loi/LayChiTiet GET → cột động + TN_KetQua_Loi/LayDanhSach GET (cùng tham số) — hộp "không đạt".
       TN_KetQuaHocPhan/LayDanhSach GET  "Học phần chưa hoàn thành" → Chi tiết: strQLSV_NguoiHoc_Id
            · strDaoTao_ChuongTrinh_Id = DAOTAO_TOCHUCCHUONGTRINH_ID · strTN_KeHoach_Id = TN_KEHOACH_ID · strPhanLoai_Id
            = PHANLOAI_ID của dòng. Bỏ dòng DANHGIA_TEN = "DAT" / "ĐẠT" (như gốc). Cột: DAOTAO_HOCPHAN_MA - _TEN · DIEM
            · DANHGIA_TEN · MOTA.
       TN_ThongTin_MH/… pkg_totnghiep_thongtin.LayDSTN_KetQua_CongNhan  hộp "đã công nhận": strTuKhoa · strTN_KeHoach_Id
            · strPhanLoai_Id / strDaoTao_HeDaoTao_Id / _KhoaDaoTao_Id / _ChuongTrinh_Id / _KhoaQuanLy_Id / _LopQuanLy_Id
            / strNguoiDung_Id / strNguoiTao_Id '' (gốc đọc dropAAAA) · pageIndex 1 · pageSize 100000.
       TN_DangKy/LayDSTN_KeHoach_DangKy GET  hộp hoãn - xét sớm: type GET · strNguoiThucHien_Id = userId · strTN_KeHoach_Id.
            Cột QLSV_NGUOIHOC_MASO · Họ tên · DAOTAO_LOPQUANLY_TEN · TINHTRANG_TEN.
       Báo cáo / Import: ums.report.mount (getList_MauImport "zonebtnTHX" + vùng _Import) — cặp addKeyValue chép nguyên:
            strPhanLoai_Id · strDaoTao_ThoiGianDaoTao_Id · strKhoaHoc_Id · strTN_KeHoach_Id (kế hoạch đã đánh dấu)
            · strQLSV_NguoiHoc_Id (dòng đã đánh dấu ở hộp "Danh sách đạt" lần mở gần nhất — gốc đọc #tblDat đang ẩn).
   Cột danh sách: TEN · DAOTAO_THOIGIANDAOTAO · NGAYBATDAU · NGAYKETTHUC · PHANLOAI_TEN · Nhân sự phân công xét
        · "Chi tiết - TONGSOXET" · DIEUKIENXET · "Chi tiết - TONGSODAT" · "Chi tiết - TONGSOKHONGDAT"
        · "Chi tiết - TONGSODACONGNHANCHINHTHUC" · "Chi tiết" (hoãn - xét sớm) · KETQUACHINHTHUC (1 → "Chính thức")
        · NGAYTAO_DD_MM_YYYY_HHMMSS · NGUOICUOI_TAIKHOAN · ô đánh dấu.

   Cố ý bỏ (mã chết — html không có #zoneEdit / #tblInput_* / #modal_sinhvien / #modal_nhansu): rewrite, toggle_*,
   viewEdit_ThucHienXet, save_Lop / save_ChuongTrinh / save_Khoa, getList_DoiTuong (biến không khai báo),
   getList_SinhVien / save / delete_SinhVien, getList_HeDaoTao… cbGenCombo_* không dùng, KHCT_NamNhapHoc,
   save/getList/delete_ThanhVien, genHTML_NhanSu, arrValid, bản getList_LopQuanLy thứ nhất (bị bản sau ghi đè).
   Khác gốc:
       · Mã số bấm được mở hộp kết quả học tập bằng ums.khxl.hocTap (ums.diemHoc — bản viết lại diemhoc của Cổng SV
         mà gốc nhúng vào #modalHTSinhVien). Nút chép mã số (btnCopyMSSV, sửa gốc 26/08) giữ, báo bằng thông báo nổi.
       · Hỏi lại bằng ums.ui.confirm (gốc gắn thêm trình xử lý #btnYes mỗi lần bấm → bấm lần hai chạy hai lần).
       · Hàng loạt qua ums.ui.batch, xong nạp lại MỘT lần.
       · Hộp "đã công nhận": ô tìm + nút Tìm kiếm của gốc KHÔNG gắn xử lý (strTuKhoa đọc txtAAAA) → nay gửi ô tìm.
       · Khoá học nạp lại cả khi bấm "chọn tất cả" kế hoạch (gốc chỉ khi bấm từng ô); Khoá học → Lớp: luật cha → con.
       · Ô Lớp quản lý: gốc nạp nhưng KHÔNG gửi đi ở lời gọi nào — giữ ô như gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, H = ums.hbKh, K = H.K, e = H.e;
    var root = document.getElementById('tn-thuchienxet');
    if (!root) return;

    function sel(k, ph, nhieu) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' +
            (nhieu ? ' multiple' : '') + '>' + (nhieu ? '' : '<option value=""></option>') + '</select></div>';
    }
    root.innerHTML =
        pat.page('Thực hiện xét', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('pl', 'Chọn phân loại') + sel('tg', 'Tất cả học kỳ') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div><div class="ums-filter ums-u-mt-3">' +
                sel('khoa', 'Chọn khóa học', true) + sel('lop', 'Chọn lớp quản lý', true) +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' }) +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div data-z="hd"></div>' }) +
        pat.panel({
            title: 'Danh sách kế hoạch', icon: 'fa-file-certificate', count: 'n', flush: true, zone: 't',
            tools: ui.btn('search', { text: 'Thực hiện xét', mod: 'primary', icon: 'fa-file-check', attr: { 'data-a': 'hangdoi' } }) +
                ui.btn('confirm', { text: 'Thực hiện công nhận kết quả chính thức', attr: { 'data-a': 'congnhan' } }),
            foot: '<div class="hbkh-foot">' +
                ui.xoaChon('input[data-tnx]', { goc: '.ums-panel', text: 'Hủy kết quả xét', attr: { 'data-a': 'huy' } }) + '</div>'
        });

    function q(s) { return root.querySelector(s); }
    function f(k) { return q('[data-f="' + k + '"]'); }
    ui.enhance(root);
    K.ganChon(root);

    var hangDoi = ums.queue.mount(q('[data-z="hd"]'), { strLoaiNhiemVu: 'XET_TN', strName: 'ThucHienXet', history: false });

    /* ---------- Danh mục ---------------------------------------------------- */
    ums.api.call({ action: 'TN_KeHoach/LayDSPhanLoaiXetTheoND1', method: 'GET', strNguoiDung_Id: H.uid() })
        .then(function (r) { pat.fill(f('pl'), K.ds(r), { name: 'TEN', head: 'Chọn phân loại' }); })
        .catch(function (err) { ums.api.handle(err, 'phân loại'); });
    H.napHocKy([f('tg')], ['Tất cả học kỳ']);

    function daChon() { return K.daChon(q('[data-z="t"]'), 'tnx'); }

    /* Khoá học theo kế hoạch đã đánh dấu (chkKeHoach gốc) → Lớp quản lý theo khoá */
    var luotKhoa = 0;
    function napKhoa() {
        var ids = daChon().join(','), sh = ++luotKhoa;
        if (!ids) { pat.fill(f('khoa'), []); pat.fill(f('lop'), []); return; }
        ums.api.call({ action: 'TN_ThongTin/LayDSKhoaHocTheoKeHoach', method: 'GET', type: 'GET',
            strTN_KeHoach_Id: ids, strNguoiThucHien_Id: H.uid() })
            .then(function (r) { if (sh === luotKhoa) pat.fill(f('khoa'), K.ds(r), { name: 'TEN' }); })
            .catch(function (err) { ums.api.handle(err, 'khóa học theo kế hoạch'); });
    }
    function napLop() {
        var khoa = pat.val(f('khoa'));
        if (!khoa) { pat.fill(f('lop'), []); return; }
        ums.api.call({ action: 'TN_ThongTin_MH/DSA4BRINLjEQNCAvDTgVKSQuCiQJLiAiKQPP', func: 'pkg_totnghiep_thongtin.LayDSLopQuanLyTheoKeHoach',
            strTN_KeHoach_Id: daChon().join(','), strDaoTao_KhoaDaoTao_Id: khoa, strNguoiThucHien_Id: H.uid() })
            .then(function (r) { pat.fill(f('lop'), K.ds(r), { name: 'TEN' }); })
            .catch(function (err) { ums.api.handle(err, 'lớp quản lý theo kế hoạch'); });
    }
    pat.chain([f('khoa'), f('lop')], { phatLai: false });
    jQuery(f('khoa')).on('select2:select select2:unselect select2:clear', napLop);
    var hen = 0;
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (!t.matches || !(t.matches('input[data-tnx]') || t.matches('input[data-all="tnx"]'))) return;
        clearTimeout(hen);
        hen = setTimeout(napKhoa, 300);
    });

    /* ---------- Báo cáo / Import -------------------------------------------- */
    var datApi = null;
    ums.report.mount(q('[data-z="bc"]'), { collect: function (add) {
        add('strPhanLoai_Id', pat.val(f('pl')));
        add('strDaoTao_ThoiGianDaoTao_Id', pat.val(f('tg')));
        add('strKhoaHoc_Id', pat.val(f('khoa')));
        add('strTN_KeHoach_Id', daChon().join(','));
        add('strQLSV_NguoiHoc_Id', datApi ? datApi.chon().join(',') : '');
    } });

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        ums.api.call({ action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strPhanLoai_Id: pat.val(f('pl')),
            strDaoTao_ThoiGianDaoTao_Id: pat.val(f('tg')), strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: page, pageSize: size
        }).then(function (r) {
            rows = K.ds(r);
            total = Number(r.pager) || rows.length;
            ve();
            napKhoa();
        }).catch(function (err) { K.loi(host, err, 'danh sách kế hoạch'); });
    }
    function nut(a, r, soCot) {
        var so = soCot ? e(r[soCot]) : '';
        return ui.btn('view', { text: 'Chi tiết' + (soCot ? ' - ' + so : ''), icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': r.ID } });
    }
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
                { title: 'Danh sách đối tượng xét', cls: 'is-center is-nowrap', render: function (r) { return nut('doituong', r, 'TONGSOXET'); } },
                { title: 'Điều kiện xét', prop: 'DIEUKIENXET', cls: 'hbkh-dk' },
                { title: 'Danh sách đạt', cls: 'is-center is-nowrap', render: function (r) { return nut('dat', r, 'TONGSODAT'); } },
                { title: 'Danh sách không đạt', cls: 'is-center is-nowrap', render: function (r) { return nut('khongdat', r, 'TONGSOKHONGDAT'); } },
                { title: 'Số công nhận', cls: 'is-center is-nowrap', render: function (r) { return nut('congnhanroi', r, 'TONGSODACONGNHANCHINHTHUC'); } },
                { title: 'Danh sách đăng ký hoãn - xét sớm', cls: 'is-center is-nowrap', render: function (r) { return nut('hoanxet', r); } },
                { title: 'Kết quả chính thức', cls: 'is-center is-nowrap', render: function (r) {
                    return String(r.KETQUACHINHTHUC) === '1' ? ui.badge('Chính thức', 'ok') : '';
                } },
                { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                { title: 'Người tạo', prop: 'NGUOICUOI_TAIKHOAN', cls: 'is-nowrap' },
                K.cotChon('tnx')
            ]
        });
        H.napPhanCong(host, rows, { action: 'TN_KeHoach_NhanSu/LayDanhSach', khoa: 'strTN_KeHoach_Id' });
    }

    /* ---------- Thao tác trên kế hoạch đã chọn ----------------------------- */
    function taoHangDoi() {
        ui.confirm('Bạn có chắc chắn Thực hiện xét không?', { title: 'Thực hiện xét', ok: 'Thực hiện xét' }).then(function (yes) {
            if (!yes) return;
            var ids = daChon();
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ums.api.call({ action: 'TN_HangDoi/TaoHangDoi_TN_TuDong', method: 'GET',
                strTuKhoa: '', strChucNang_Id: '', strTN_KeHoach_Id: ids.join(','), strNguoiThucHien_Id: '' })
                .then(function () {
                    ui.toast('Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!', 'ok');
                    hangDoi.reload();
                }).catch(function (err) { ums.api.handle(err, 'TN_HangDoi/TaoHangDoi_TN_TuDong'); });
        });
    }
    function congNhan() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng xét?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xét không?', { title: 'Công nhận kết quả chính thức', ok: 'Đồng ý' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                return { action: 'TN_KetQua_CongNhan/ThemMoi', strId: '', strChucNang_Id: '', strTN_KeHoach_Id: id, strNguoiThucHien_Id: '' };
            }), { title: 'Đang công nhận kết quả', okText: 'Thêm mới thành công!', show: true }).then(function () { load(); });
        });
    }
    function huy() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) {
            return { action: 'TN_KetQua_CongNhan/Xoa', strChucNang_Id: '', strTN_KeHoach_Id: id, strNguoiThucHien_Id: '' };
        }), function () { load(); });
    }

    /* ---------- Hộp danh sách người học ------------------------------------- */
    /* Mã số: bấm → hộp học tập; nút nhỏ bên cạnh chép mã số (btnCopyMSSV của gốc) */
    function cotSV(extra) {
        var c = H.cotSV({ hocTap: true });
        c[0] = { title: 'Mã số', cls: 'is-nowrap', render: function (r) {
            var ma = e(r.QLSV_NGUOIHOC_MASO);
            return K.maSo(r) + (ma ? ' <button type="button" class="ums-iconbtn" data-chep="' + esc(ma) + '" title="Chép mã số">' +
                '<i class="fa-light fa-copy"></i></button>' : '');
        } };
        return c.concat(extra || []);
    }
    function hop(o) {
        var api = H.hopDS(o);
        api.dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-chep]');
            if (!b) return;
            var ma = b.getAttribute('data-chep');
            var xong = function () { ui.toast('Đã chép mã số ' + ma, 'ok'); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ma).then(xong, function () { ui.toast('Không chép được mã số', 'warn'); });
            else ui.toast('Trình duyệt không cho chép tự động', 'warn');
        });
        return api;
    }
    function thamSoDS(kh, p, s, tu) {
        return { strTuKhoa: tu, strNguoiDung_Id: '', strTN_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: p, pageSize: s };
    }
    function gop(a, b) { Object.keys(b).forEach(function (k) { a[k] = b[k]; }); return a; }

    function hopDoiTuong(kh) {
        var chuaXet = false;
        hop({
            title: 'Danh sách đối tượng xét', icon: 'fa-user-gear', tim: 'may', chon: false,
            phanTrang: function () { return !chuaXet; },
            onTim: function () { chuaXet = false; },
            call: function (p, s, tu) {
                if (chuaXet) {
                    return { action: 'TN_ThongTin/LayDSTN_KeHoach_PhamVi_ChuaXet', method: 'GET',
                        strTuKhoa: '', strNguoiDung_Id: '', strTN_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
                }
                return gop({ action: 'TN_KeHoach_PhamVi/LayDanhSach', method: 'GET' }, thamSoDS(kh, p, s, tu));
            },
            columns: function () {
                return cotSV([{ head: 'Thực hiện xét <input type="checkbox" data-all="xettn" title="Chọn tất cả">', cls: 'is-center is-nowrap', giuCho: true,
                    render: function (r) {
                        var da = e(r.THUCHIENXET) !== '' && String(r.THUCHIENXET) !== '0';
                        return '<input type="checkbox" data-xettn="' + esc(r.ID) + '"' + (da ? ' checked data-da="1"' : '') + '>';
                    } }]);
            },
            buttons: [
                { text: 'Danh sách chưa xét', kind: 'view', icon: 'fa-users-line', onClick: function (api) { chuaXet = true; api.tai(1); } },
                { text: 'Thực hiện xét', kind: 'save', icon: 'fa-user-check', onClick: function (api) {
                    var them = K.qa(api.dlg.body, 'tbody input[data-xettn]').filter(function (x) { return x.checked && !x.hasAttribute('data-da'); })
                        .map(function (x) { return x.getAttribute('data-xettn'); });
                    if (!them.length) { ui.toast('Chưa đánh dấu thêm đối tượng nào để xét', 'warn'); return; }
                    ui.confirm('Bạn có chắc chắn thêm ' + them.length + ' không?', { title: 'Thực hiện xét', ok: 'Thực hiện xét' }).then(function (yes) {
                        if (!yes) return;
                        ui.batch(them.map(function (id) {
                            return { action: 'TN_KeHoach_PhamVi/ThietLap_Xet_TN_KeHoach_PhamVi', method: 'POST', type: 'POST',
                                strTN_KeHoach_PhamVi_Id: id, dThucHienXet: 1, strNguoiThucHien_Id: '' };
                        }), { title: 'Đang thực hiện xét', okText: 'Cập nhật thành công!', show: true }).then(function () {
                            chuaXet = false;
                            api.tai();
                        });
                    });
                } }
            ]
        });
    }
    function hopDat(kh) {
        datApi = hop({
            title: 'Danh sách đạt', icon: 'fa-users-gear', phanTrang: true, tim: 'may', chon: 'dattn', khoaKQ: 'TN_KETQUA_ID',
            chiTiet: { action: 'TN_KetQua/LayChiTiet', method: 'GET', strTN_KeHoach_Id: kh.ID },
            call: function (p, s, tu) { return gop({ action: 'TN_KetQua/LayDanhSach', method: 'GET' }, thamSoDS(kh, p, s, tu)); },
            columns: function () { return cotSV(H.cotXepLoai()); }
        });
    }
    function hopKhongDat(kh) {
        hop({
            title: 'Danh sách không đạt', icon: 'fa-users', phanTrang: true, tim: 'may', ben: true, khoaKQ: 'TN_KETQUA_ID',
            chiTiet: { action: 'TN_KetQua_Loi/LayChiTiet', method: 'GET', strTN_KeHoach_Id: kh.ID },
            call: function (p, s, tu) { return gop({ action: 'TN_KetQua_Loi/LayDanhSach', method: 'GET' }, thamSoDS(kh, p, s, tu)); },
            columns: function () {
                return cotSV([{ title: 'Học phần chưa hoàn thành', cls: 'is-center is-nowrap', render: function (r) {
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
            strTN_KeHoach_Id: a.TN_KEHOACH_ID, strPhanLoai_Id: a.PHANLOAI_ID })
            .then(function (r) {
                var ds = K.ds(r).filter(function (x) { return x.DANHGIA_TEN !== 'DAT' && x.DANHGIA_TEN !== 'ĐẠT'; });
                ui.table({ el: host, rows: ds, stt: true, empty: 'Không có học phần', columns: [
                    { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_MA) + ' - ' + e(x.DAOTAO_HOCPHAN_TEN)); } },
                    { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' },
                    { title: 'Mô tả', prop: 'MOTA' }
                ] });
            }).catch(function (err) { K.loi(host, err, 'học phần không đạt'); });
    }
    function hopDaCongNhan(kh) {
        hop({
            title: 'Danh sách đã công nhận', icon: 'fa-file-certificate', tim: 'may',
            call: function (p, s, tu) {
                return { action: 'TN_ThongTin_MH/DSA4BRIVDx4KJDUQNCAeAi4vJg8pIC8P', func: 'pkg_totnghiep_thongtin.LayDSTN_KetQua_CongNhan',
                    strTuKhoa: tu, strTN_KeHoach_Id: kh.ID, strPhanLoai_Id: '', strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: '',
                    strDaoTao_ChuongTrinh_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: '', strNguoiDung_Id: '',
                    strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
            },
            columns: function () { return cotSV(H.cotXepLoai()); }
        });
    }
    function hopHoanXet(kh) {
        hop({
            title: 'Danh sách sinh viên', icon: 'fa-users', tim: false,
            call: function () {
                return { action: 'TN_DangKy/LayDSTN_KeHoach_DangKy', method: 'GET', type: 'GET',
                    strNguoiThucHien_Id: H.uid(), strTN_KeHoach_Id: kh.ID };
            },
            columns: function () {
                var c = cotSV();
                return [c[0], c[1],
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center is-nowrap' },
                    { title: 'Tình trạng', prop: 'TINHTRANG_TEN', cls: 'is-center' }];
            }
        });
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
            case 'doituong': if (r) hopDoiTuong(r); break;
            case 'dat': if (r) hopDat(r); break;
            case 'khongdat': if (r) hopKhongDat(r); break;
            case 'congnhanroi': if (r) hopDaCongNhan(r); break;
            case 'hoanxet': if (r) hopHoanXet(r); break;
        }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    load(1);
})();
