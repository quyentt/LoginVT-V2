/* =========================================================================
   Xác nhận kết quả xét học bổng
   Bản gốc: ApisHocBong/Modules/kehoach/html/xacnhan.html + script/xacnhan.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (một cột): thanh lọc (Hệ · Khoá · Chương trình · Lớp / Khoa quản lý · Quỹ · từ khoá
   · Tìm kiếm) → "Danh sách kế hoạch" (thực chất là danh sách NGƯỜI HỌC được công nhận — tiêu đề giữ như gốc)
   có nút "Xác nhận" → hộp "Duyệt hồ sơ" (#modal_XacNhan: Nội dung · một nút cho mỗi tình trạng · Lịch sử duyệt).
   Khung chung ba màn: _kh_chung.js (ums.hbKh).

   Lời gọi (chép nguyên):
       HB_KetQua/LayDSHB_KetQua_CongNhan  GET  strTuKhoa (xem "Khác gốc") · strPhanLoai_Id '' (dropSearch_PhanLoai
            không có) · strDaoTao_HeDaoTao_Id · strDaoTao_KhoaDaoTao_Id · strDaoTao_ChuongTrinh_Id
            · strDaoTao_KhoaQuanLy_Id · strDaoTao_LopQuanLy_Id · strNguoiDung_Id '' · strNguoiTao_Id '' · pageIndex
            · pageSize (phân trang máy chủ) · strHB_QuyHocBong_Id
            Cột: QLSV_NGUOIHOC_MASO · QLSV_NGUOIHOC_HOTEN · QLSV_NGUOIHOC_NGAYSINH · DAOTAO_LOPQUANLY_TEN
            · DAOTAO_CHUONGTRINH_TEN · DAOTAO_KHOADAOTAO_TEN · KHOAQUANLY_TEN · DAOTAO_HEDAOTAO_TEN · XEPLOAI_TEN
            · XEPLOAI_THAYDOI (gốc đọc XEPLOAI_THAYDOI, KHÁC hai màn kia đọc XEPLOAI_THAYDOI_TEN — giữ)
            · KETQUAXACNHAN_TEN · ô đánh dấu.
       HB_XacNhanKetQua/LayDSTinhTrangXacNhan GET  strNguoiDung_Id = userId · strHB_QuyHocBong_Id '' (gốc đọc
            dropSearch_PhanLoai — không có) → nút tình trạng: TEN, biểu tượng THONGTIN1 (FA4 → ums.iconFA4).
       HB_XacNhanKetQua/ThemMoi  POST  mỗi người học đã đánh dấu một lời gọi: strId '' · strSanPham_Id = ID dòng
            · strNoiDung (ô Nội dung) · strTinhTrang_Id · strNguoiXacnhan_Id = userId
       HB_XacNhanKetQua/LayDanhSach GET  bảng "Lịch sử duyệt": strTuKhoa '' · strsanpham_Id · strTinhTrang_Id ''
            · strNguoiThucHien_Id '' · pageIndex 1 · pageSize 100000. Cột TINHTRANG_TEN · NOIDUNG · NGUOIXACNHAN_TENDAYDU
            · NGAYTAO_DD_MM_YYYY.
       Hệ / Khoá / CT / Lớp: edu.system.getList_* (KHÔNG phải bản …Quyen) → ums.ref.cascade; Khoa QL: ums.ref.khoaQuanLy.

   Cố ý bỏ (mã chết — html không có #zoneEdit / #tblInput_* / #modal_sinhvien / #modal_nhansu): save_XacNhan
   (TN_KeHoach/ThemMoi, CapNhat), delete_XacNhan (TN_KeHoach/Xoa), save_Lop / save_ChuongTrinh / save_Khoa
   (TN_KeHoach_PhamVi/*), getList_SinhVien / save_SinhVien / delete_SinhVien, getList_ThanhVien / save / delete,
   genModal_* và các nút .btnSearchDTSV_*, getList_QuanSoTheoLop (#myModal không có), KHCT_NamNhapHoc,
   ThoiGianDaoTao, arrValid. Hai nút mẫu "Đóng" (id trùng btnClose_HDBL) trong vùng nút — loadBtnXacNhan vẽ đè.
   Style THONGTIN2 (chuỗi CSS lấy từ CSDL gắn thẳng vào thẻ) không chép.

   Khác gốc:
       · Ô từ khoá: gốc gửi strTuKhoa = txtAAAA (ô KHÔNG tồn tại) nên gõ từ khoá không có tác dụng → nay gửi ô
         "Nhập từ khóa tìm kiếm" (ghi can-quyet).
       · "Lịch sử duyệt": gốc có bảng nhưng KHÔNG nơi nào nạp (getList_XacNhanTN không được gọi, và nếu gọi thì vẽ
         nhầm bảng khác) → nay nạp khi đánh dấu ĐÚNG MỘT người học; nhiều người thì ghi chú.
       · Xác nhận xong nạp lại danh sách (gốc không nạp lại → cột "Kết quả xác nhận hiện tại" đứng im).
       · Ô cha → con Hệ → Khoá → CT → Lớp khoá theo luật chung (gốc nạp sẵn mọi khoá).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, H = ums.hbKh, K = H.K, e = H.e;
    var root = document.getElementById('hb-xacnhan');
    if (!root) return;

    root.innerHTML =
        pat.page('Xác nhận kết quả', '') +
        pat.filterBar([
            { key: 'he', type: 'select', label: 'Tất cả hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Tất cả khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Tất cả chương trình đào tạo' },
            { key: 'lop', type: 'select', label: 'Tất cả lớp' },
            { key: 'kql', type: 'select', label: 'Tất cả khoa quản lý' },
            { key: 'quy', type: 'select', label: 'Chọn quỹ học bổng' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({
            title: 'Danh sách kế hoạch', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 't',
            tools: ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } })
        });

    function q(sel) { return root.querySelector(sel); }
    function f(k) { return q('[data-f="' + k + '"]'); }
    ui.enhance(root);
    K.ganChon(root);

    ums.ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
        labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' } });
    ums.ref.khoaQuanLy().then(function (ds) { pat.fill(f('kql'), ds, { name: 'TEN', head: 'Tất cả khoa quản lý' }); })
        .catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
    H.napQuy([f('quy')]);

    /* ---------- Danh sách ---------------------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        ums.api.call({
            action: 'HB_KetQua/LayDSHB_KetQua_CongNhan', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strPhanLoai_Id: '',
            strDaoTao_HeDaoTao_Id: f('he').value, strDaoTao_KhoaDaoTao_Id: f('khoa').value,
            strDaoTao_ChuongTrinh_Id: f('ct').value, strDaoTao_KhoaQuanLy_Id: f('kql').value,
            strDaoTao_LopQuanLy_Id: f('lop').value, strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: page, pageSize: size, strHB_QuyHocBong_Id: f('quy').value
        }).then(function (r) {
            rows = K.ds(r);
            total = Number(r.pager) || rows.length;
            q('[data-z="n"]').textContent = '(' + total + ')';
            ui.table({
                el: host, rows: rows, stt: true, empty: 'Không có dữ liệu',
                page: {
                    index: page, size: size, total: total,
                    onChange: function (n) { if (n >= 1 && n <= Math.ceil(total / size)) load(n); },
                    onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); load(1); }
                },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN', cls: 'is-nowrap' },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center is-nowrap' },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center is-nowrap' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN', cls: 'is-center' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' },
                    { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' },
                    { title: 'Xếp loại điều chỉnh', prop: 'XEPLOAI_THAYDOI', cls: 'is-center' },
                    { title: 'Kết quả xác nhận hiện tại', prop: 'KETQUAXACNHAN_TEN', cls: 'is-center' },
                    K.cotChon('xnhb')
                ]
            });
        }).catch(function (err) { K.loi(host, err, 'danh sách công nhận học bổng'); });
    }

    /* ---------- Hộp "Duyệt hồ sơ" ------------------------------------------ */
    function hopXacNhan(ids) {
        var mot = ids.length === 1 ? K.tim(rows, ids[0]) : null;
        var dlg = ui.dialog({
            title: 'Duyệt hồ sơ' + (mot ? ': ' + e(mot.QLSV_NGUOIHOC_HOTEN) : ''), icon: 'fa-circle-check', size: 'lg',
            body:
                (ids.length > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + ids.length + ' người học đã chọn.</p>' : '') +
                '<div class="ums-legend">Nội dung duyệt hồ sơ</div>' +
                '<input class="ums-input" data-x="nd" autocomplete="off">' +
                '<div class="ums-legend ums-legend--cach">Chọn duyệt hồ sơ</div>' +
                '<div class="ums-row" data-x="nut"></div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử duyệt</div>' +
                '<div data-x="ls"></div>'
        });
        function x(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }

        x('nut').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'HB_XacNhanKetQua/LayDSTinhTrangXacNhan', method: 'GET', strNguoiDung_Id: H.uid(), strHB_QuyHocBong_Id: '' })
            .then(function (r) {
                var ds = K.ds(r);
                x('nut').innerHTML = ds.length ? ds.map(function (t, i) {
                    var ic = ums.iconFA4 ? ums.iconFA4(e(t.THONGTIN1)) : '';
                    return ui.btn('confirm', { text: e(t.TEN), mod: 'out-primary', icon: ic || undefined, attr: { 'data-xn': i } });
                }).join('') : ui.empty('Chưa khai tình trạng xác nhận');
                x('nut').addEventListener('click', function (ev) {
                    var b = ev.target.closest('[data-xn]');
                    if (!b) return;
                    var tt = ds[Number(b.getAttribute('data-xn'))];
                    var nd = x('nd').value || '';
                    dlg.close();
                    ui.batch(ids.map(function (id) {
                        return { action: 'HB_XacNhanKetQua/ThemMoi', method: 'POST', strId: '', strSanPham_Id: id, strNoiDung: nd,
                            strTinhTrang_Id: tt.ID, strNguoiXacnhan_Id: H.uid() };
                    }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' }).then(function () { load(); });
                });
            }).catch(function (err) { x('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tình trạng xác nhận'); });

        if (!mot) { x('ls').innerHTML = ui.empty('Chọn đúng một người học để xem lịch sử duyệt', 'fa-clock-rotate-left'); return; }
        K.dang(x('ls'));
        ums.api.call({ action: 'HB_XacNhanKetQua/LayDanhSach', method: 'GET',
            strTuKhoa: '', strsanpham_Id: mot.ID, strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                ui.table({ el: x('ls'), rows: K.ds(r), stt: true, empty: 'Chưa có lịch sử', columns: [
                    { title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN' },
                    { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '100px' }
                ] });
            }).catch(function (err) { K.loi(x('ls'), err, 'lịch sử duyệt'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') load(1);
        else if (a === 'xacnhan') {
            var ids = K.daChon(q('[data-z="t"]'), 'xnhb');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
            hopXacNhan(ids);
        }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    load(1);
})();
