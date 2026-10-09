/* =========================================================================
   Xác nhận kết quả xét tốt nghiệp
   Bản gốc: ApisTotNghiep/Modules/kehoach/html/xacnhan.html + script/xacnhan.js (vỏ indexi) — theo gốc 2/10 (commit bc5d5f67:
   thêm nút "Hạ bậc trực tiếp" + hộp #modal_HaBacTrucTiep)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (một cột): thanh lọc (Hệ · Khoá · Chương trình · Lớp / Khoa quản lý · Phân loại · Kế hoạch
   · từ khoá · Tìm kiếm) → "Danh sách kế hoạch" (thực chất là danh sách NGƯỜI HỌC được công nhận — tiêu đề giữ như
   gốc) có nút "Hạ bậc trực tiếp", "Import để chọn" và "Xác nhận" → hộp "Hạ bậc trực tiếp" (Xếp loại · Lý do) và hộp "Duyệt hồ sơ" (#modal_XacNhan: Nội dung · một nút cho mỗi
   tình trạng · Lịch sử duyệt). Tiện ích ô đánh dấu: ums.khxl (XLHV) qua ums.hbKh (Học bổng, nạp chéo).

   Lời gọi (chép nguyên):
       TN_ThongTin/LayDSTN_KetQua_CongNhan  GET  strTuKhoa · strTN_KeHoach_Id · strPhanLoai_Id · strDaoTao_HeDaoTao_Id
            · strDaoTao_KhoaDaoTao_Id · strDaoTao_ChuongTrinh_Id · strDaoTao_KhoaQuanLy_Id · strDaoTao_LopQuanLy_Id
            · strNguoiDung_Id = userId · strNguoiTao_Id '' (gốc đọc dropAAAA) · pageIndex · pageSize (phân trang máy chủ)
            Cột: QLSV_NGUOIHOC_MASO · QLSV_NGUOIHOC_HOTEN · QLSV_NGUOIHOC_NGAYSINH · DAOTAO_LOPQUANLY_TEN
            · DAOTAO_CHUONGTRINH_TEN · DAOTAO_KHOADAOTAO_TEN · KHOAQUANLY_TEN · DAOTAO_HEDAOTAO_TEN · XEPLOAI_TEN
            · XEPLOAI_THAYDOI_TEN · KETQUAXACNHAN_TEN · ô đánh dấu.
       TN_Chung/LayDSPhanLoaiTheoNguoiDung  POST  type POST · strNguoiThucHien_Id = userId · iM (gốc truyền iM tường
            minh, không có func) → ô Phân loại (TEN, "Chọn phân loại").
       TN_ThongTin/LayDSTN_KeHoach GET  ô Kế hoạch (getList_KeHoachXuLy gốc): strTuKhoa = ô từ khoá (như gốc)
            · strPhanLoai_Id · strDaoTao_ThoiGianDaoTao_Id '' (ô không có trên màn) · strNguoiDung_Id '' · strNguoiTao_Id ''
            · pageIndex 1 · pageSize 1000000. Chọn Phân loại → nạp lại Kế hoạch + nạp lại danh sách (như gốc).
       TN_XacNhan/LayDSTinhTrangXacNhan GET  strNguoiDung_Id = userId · strPhanLoai_Id (ô Phân loại) → nút tình trạng:
            TEN, biểu tượng THONGTIN1 (FA4 → ums.iconFA4, rỗng → fa-paper-plane như gốc).
       TN_XacNhan/ThemMoi  POST  mỗi người học đã đánh dấu một lời gọi: strId '' · strSanPham_Id = ID dòng · strNoiDung
            (ô Nội dung) · strTinhTrang_Id · strNguoiXacnhan_Id = userId
       TN_XacNhan/LayDanhSach GET  bảng "Lịch sử duyệt": strTuKhoa '' · strsanpham_Id · strTinhTrang_Id '' · strNguoiThucHien_Id ''
            · pageIndex 1 · pageSize 100000. Cột TINHTRANG_TEN · NOIDUNG · NGUOIXACNHAN_TENDAYDU · NGAYTAO_DD_MM_YYYY.
       Hạ bậc trực tiếp (gốc 2/10): danh mục VANBANG.XEPLOAI → ô "Xếp loại" (bắt buộc, "Chọn xếp loại hạ bậc"); ô "Lý do thực
            hiện" (bắt buộc). Đồng ý → hỏi lại "Bạn có chắc chắn thực hiện hạ bậc không?" → mỗi người học đã đánh dấu một lời gọi
            TN_TinhToan_MH/CSADICIVMzQiFSgkMQPP · pkg_totnghiep_tinhtoan.HaBacTrucTiep  strTN_KetQua_CongNhan_Id = ID dòng
            · strXepLoai_HaBac_Id · strLyDo · strNguoiThucHien_Id → xong nạp lại danh sách. Là thao tác hàng loạt đặt MỘT giá trị
            cho các dòng đã đánh dấu → giữ hộp thoại (BO-CUC luật 1); gốc gọi đồng bộ (async: false) → ui.batch tuần tự 1 luồng.
       Hệ / Khoá / CT / Lớp: edu.system.getList_* (KHÔNG phải bản …Quyen) → ums.ref.cascade; Khoa QL: ums.ref.khoaQuanLy.
       "Import để chọn" (edu.system.showBaoCao của Corei): tải tệp Excel (ums.upload) → SYS_Import/getDataFormFileImport
            GET strPath → chọn sheet + cột của tệp, chọn cột của bảng danh sách → "Thực hiện so sánh và check": bỏ đánh
            dấu mọi dòng rồi đánh dấu dòng có ô (cột đã chọn) CHỨA giá trị một ô của cột tệp (như gốc). Không ghi gì.

   Cố ý bỏ (mã chết — html không có #zoneEdit / #tblInput_* / #modal_sinhvien / #modal_nhansu / #myModal): save_XacNhan
   (TN_KeHoach/ThemMoi, CapNhat), delete_XacNhan, save_Lop / save_ChuongTrinh / save_Khoa, getList_SinhVien / save /
   delete_SinhVien, getList_ThanhVien / save / delete, genModal_* và các nút .btnSearchDTSV_*, getList_QuanSoTheoLop,
   KHCT_NamNhapHoc, ThoiGianDaoTao, arrValid. Hai nút mẫu "Đóng" (id trùng btnClose_HDBL) — loadBtnXacNhan vẽ đè.
   Style THONGTIN2 (chuỗi CSS lấy từ CSDL gắn thẳng vào thẻ) không chép.

   Khác gốc:
       · "Lịch sử duyệt": gốc có bảng nhưng KHÔNG nơi nào nạp (getList_XacNhanTN không được gọi, và nếu gọi thì vẽ nhầm
         bảng danh sách) → nay nạp khi đánh dấu ĐÚNG MỘT người học; nhiều người thì ghi chú.
       · Xác nhận qua ums.ui.batch, xong nạp lại danh sách (gốc không nạp lại → cột "Kết quả xác nhận hiện tại" đứng im).
       · Nút tình trạng nạp lúc mở hộp theo Phân loại đang chọn (gốc nạp lúc mở màn + khi đổi Phân loại — cùng kết quả).
       · Ô cha → con: Hệ → Khoá → CT → Lớp và Phân loại → Kế hoạch khoá theo luật chung (gốc nạp sẵn).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, H = ums.hbKh, K = H.K, e = H.e;
    var root = document.getElementById('tn-xacnhan');
    if (!root) return;

    root.innerHTML =
        pat.page('Xác nhận kết quả', '') +
        pat.filterBar([
            { key: 'he', type: 'select', label: 'Tất cả hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Tất cả khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Tất cả chương trình đào tạo' },
            { key: 'lop', type: 'select', label: 'Tất cả lớp' },
            { key: 'kql', type: 'select', label: 'Tất cả khoa quản lý' },
            { key: 'pl', type: 'select', label: 'Chọn phân loại' },
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({
            title: 'Danh sách kế hoạch', icon: 'fa-file-certificate', count: 'n', flush: true, zone: 't',
            tools: ui.btn('confirm', { text: 'Hạ bậc trực tiếp', mod: 'warn', icon: 'fa-turn-down', attr: { 'data-a': 'habac' } }) +
                ui.btn('importer', { text: 'Import để chọn', attr: { 'data-a': 'importchon' } }) +
                ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } })
        });

    function q(s) { return root.querySelector(s); }
    function f(k) { return q('[data-f="' + k + '"]'); }
    ui.enhance(root);
    K.ganChon(root);

    ums.ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
        labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' } });
    ums.ref.khoaQuanLy().then(function (ds) { pat.fill(f('kql'), ds, { name: 'TEN', head: 'Tất cả khoa quản lý' }); })
        .catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
    ums.api.call({ action: 'TN_Chung/LayDSPhanLoaiTheoNguoiDung', method: 'POST', type: 'POST',
        strNguoiThucHien_Id: H.uid(), iM: ums.session.iM })
        .then(function (r) { pat.fill(f('pl'), K.ds(r), { name: 'TEN', head: 'Chọn phân loại' }); })
        .catch(function (err) { ums.api.handle(err, 'phân loại'); });

    function napKeHoach() {
        if (!pat.val(f('pl'))) { pat.fill(f('kh'), [], { head: 'Chọn kế hoạch' }); return; }
        ums.api.call({ action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strPhanLoai_Id: pat.val(f('pl')), strDaoTao_ThoiGianDaoTao_Id: '',
            strNguoiDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { pat.fill(f('kh'), K.ds(r), { name: 'TEN', head: 'Chọn kế hoạch' }); })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    }
    pat.chain([f('pl'), f('kh')], { phatLai: false });
    jQuery(f('pl')).on('select2:select select2:clear', function () { napKeHoach(); load(1); });

    /* ---------- Danh sách ---------------------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];
    var COT = [
        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
        { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN', cls: 'is-nowrap' },
        { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
        { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center is-nowrap' },
        { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center' },
        { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center is-nowrap' },
        { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN', cls: 'is-center' },
        { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' },
        { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' },
        { title: 'Xếp loại điều chỉnh', prop: 'XEPLOAI_THAYDOI_TEN', cls: 'is-center' },
        { title: 'Kết quả xác nhận hiện tại', prop: 'KETQUAXACNHAN_TEN', cls: 'is-center' }
    ];

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        ums.api.call({
            action: 'TN_ThongTin/LayDSTN_KetQua_CongNhan', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strTN_KeHoach_Id: pat.val(f('kh')), strPhanLoai_Id: pat.val(f('pl')),
            strDaoTao_HeDaoTao_Id: pat.val(f('he')), strDaoTao_KhoaDaoTao_Id: pat.val(f('khoa')),
            strDaoTao_ChuongTrinh_Id: pat.val(f('ct')), strDaoTao_KhoaQuanLy_Id: pat.val(f('kql')),
            strDaoTao_LopQuanLy_Id: pat.val(f('lop')), strNguoiDung_Id: H.uid(), strNguoiTao_Id: '',
            pageIndex: page, pageSize: size
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
                columns: COT.concat([K.cotChon('xntn')])
            });
        }).catch(function (err) { K.loi(host, err, 'danh sách công nhận tốt nghiệp'); });
    }

    /* ---------- Hộp "Duyệt hồ sơ" ------------------------------------------ */
    function hopXacNhan(ids) {
        var mot = ids.length === 1 ? K.tim(rows, ids[0]) : null;
        var dlg = ui.dialog({
            title: 'Duyệt hồ sơ' + (mot ? ': ' + e(mot.QLSV_NGUOIHOC_HOTEN) : ''), icon: 'fa-address-book', size: 'lg',
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
        ums.api.call({ action: 'TN_XacNhan/LayDSTinhTrangXacNhan', method: 'GET', strNguoiDung_Id: H.uid(), strPhanLoai_Id: pat.val(f('pl')) })
            .then(function (r) {
                var ds = K.ds(r);
                x('nut').innerHTML = ds.length ? ds.map(function (t, i) {
                    var ic = ums.iconFA4 ? ums.iconFA4(e(t.THONGTIN1) || 'fa fa-paper-plane') : '';
                    return ui.btn('confirm', { text: e(t.TEN), mod: 'out-primary', icon: ic || undefined, attr: { 'data-xn': i } });
                }).join('') : ui.empty('Chưa khai tình trạng xác nhận');
                x('nut').addEventListener('click', function (ev) {
                    var b = ev.target.closest('[data-xn]');
                    if (!b) return;
                    var tt = ds[Number(b.getAttribute('data-xn'))];
                    var nd = x('nd').value || '';
                    dlg.close();
                    ui.batch(ids.map(function (id) {
                        return { action: 'TN_XacNhan/ThemMoi', method: 'POST', strId: '', strSanPham_Id: id, strNoiDung: nd,
                            strTinhTrang_Id: tt.ID, strNguoiXacnhan_Id: H.uid() };
                    }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' }).then(function () { load(); });
                });
            }).catch(function (err) { x('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tình trạng xác nhận'); });

        if (!mot) { x('ls').innerHTML = ui.empty('Chọn đúng một người học để xem lịch sử duyệt', 'fa-clock-rotate-left'); return; }
        K.dang(x('ls'));
        ums.api.call({ action: 'TN_XacNhan/LayDanhSach', method: 'GET',
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

    /* ---------- Hộp "Hạ bậc trực tiếp" (gốc 2/10) ---------------------------- */
    function hopHaBac(ids) {
        var dlg = ui.dialog({
            title: 'Hạ bậc trực tiếp', icon: 'fa-turn-down', size: 'md',
            body:
                (ids.length > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + ids.length + ' người học đã chọn.</p>' : '') +
                ui.field('Xếp loại', '<select class="ums-select" data-x="xl" data-ph="Chọn xếp loại hạ bậc"><option value=""></option></select>', { required: true }) +
                ui.field('Lý do thực hiện', '<textarea class="ums-input" data-x="ld" rows="5" placeholder="Nhập lý do thực hiện hạ bậc..."></textarea>', { required: true }),
            buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function () {
                var xl = pat.val(x('xl')), ld = (x('ld').value || '').trim();
                if (!xl) { ui.toast('Vui lòng chọn xếp loại hạ bậc!', 'warn'); return false; }
                if (!ld) { ui.toast('Vui lòng nhập lý do thực hiện!', 'warn'); return false; }
                ui.confirm('Bạn có chắc chắn thực hiện hạ bậc không?', { title: 'Hạ bậc trực tiếp', ok: 'Đồng ý' }).then(function (yes) {
                    if (!yes) return;
                    dlg.close();
                    ui.batch(ids.map(function (id) {
                        return { action: 'TN_TinhToan_MH/CSADICIVMzQiFSgkMQPP', func: 'pkg_totnghiep_tinhtoan.HaBacTrucTiep',
                            strTN_KetQua_CongNhan_Id: id, strXepLoai_HaBac_Id: xl, strLyDo: ld, strNguoiThucHien_Id: H.uid() };
                    }), { title: 'Đang hạ bậc', okText: 'Hạ bậc thành công!', concurrency: 1, show: true }).then(function () { load(); });
                });
                return false;
            } }]
        });
        function x(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        ums.api.dm('VANBANG.XEPLOAI').then(function (d) { pat.fill(x('xl'), d, { name: 'TEN', head: 'Chọn xếp loại hạ bậc' }); })
            .catch(function (err) { ums.api.handle(err, 'xếp loại hạ bậc'); });
    }

    /* ---------- Hộp "Import để chọn" (showBaoCao của Corei) ----------------- */
    function hopImportChon() {
        var sheet = {}, dsSheet = [];
        var dlg = ui.dialog({
            title: 'Import để chọn', icon: 'fa-cloud-arrow-up', size: 'xl',
            body:
                '<div class="ums-grid ums-grid--2">' +
                    ui.field('Thực hiện import', ui.file({ key: 'tep', accept: '.xls,.xlsx' })) + '<div></div>' +
                    ui.field('Bảng import (sheet)', '<select class="ums-select" data-x="sheet" data-required></select>') +
                    ui.field('Cột của tệp', '<select class="ums-select" data-x="cota" data-required></select>') +
                    ui.field('Bảng cần check theo mã', '<select class="ums-select" data-x="bang" data-required><option value="t">Danh sách kế hoạch</option></select>') +
                    ui.field('Cột của bảng', '<select class="ums-select" data-x="cotb" data-required>' +
                        COT.map(function (c, i) { return '<option value="' + i + '">' + esc(c.title) + '</option>'; }).join('') + '</select>') +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">Danh sách</div><div data-x="xem">' + ui.empty('Chọn tệp Excel để xem dữ liệu', 'fa-file-excel') + '</div>',
            buttons: [{ text: 'Thực hiện so sánh và check', kind: 'confirm', icon: 'fa-list-check', onClick: function () {
                var rs = sheet['Table' + (Number(x('sheet').value) + 1)] || [];
                var cotA = x('cota').value;
                if (!rs.length || !cotA) { ui.toast('Chưa có dữ liệu import để so sánh', 'warn'); return false; }
                var giaTri = rs.map(function (r) { return String(e(r[cotA])).trim(); }).filter(function (v) { return v; });
                var prop = COT[Number(x('cotb').value)].prop, n = 0;
                K.qa(q('[data-z="t"]'), 'tbody input[data-xntn]').forEach(function (cb) {
                    var r = K.tim(rows, cb.getAttribute('data-xntn'));
                    var o = String(e(r && r[prop])).trim();
                    cb.checked = !!o && giaTri.some(function (v) { return o.indexOf(v) !== -1; });
                    if (cb.checked) n++;
                    cb.dispatchEvent(new Event('change', { bubbles: true }));
                });
                ui.toast('Đã đánh dấu ' + n + ' dòng khớp dữ liệu import', n ? 'ok' : 'warn');
            } }]
        });
        function x(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        function veSheet() {
            var rs = sheet['Table' + (Number(x('sheet').value) + 1)] || [];
            var cot = rs.length ? Object.keys(rs[0]) : [];
            chon(x('cota'), cot.map(function (c) { return { ID: c, TEN: c }; }));
            ui.table({ el: x('xem'), rows: rs, empty: 'Sheet không có dữ liệu',
                columns: cot.map(function (c) { return { title: c, render: function (r) { return esc(e(r[c])); } }; }) });
        }
        /* Đổ danh sách rồi chọn sẵn mục đầu (gốc: <option> đầu tiên là mục đang chọn) */
        function chon(el, ds) {
            pat.fill(el, ds, { head: '' });
            if (ds.length) { el.value = ds[0].ID; jQuery(el).trigger('change.select2'); }
        }
        jQuery(x('sheet')).on('select2:select', veSheet);
        dlg.body.querySelector('[data-k="tep"]').addEventListener('change', function () {
            var t = this.files;
            if (!t || !t.length) return;
            x('xem').innerHTML = ui.empty('Đang đọc tệp…', 'fa-spinner fa-spin');
            ums.upload(t).then(function (path) {
                return ums.api.call({ action: 'SYS_Import/getDataFormFileImport', method: 'GET', versionAPI: 'v1.0', strPath: path });
            }).then(function (r) {
                var id = String((r.raw && r.raw.Id) || '');
                dsSheet = id ? id.split('$') : [];
                sheet = (r.data && !Array.isArray(r.data)) ? r.data : {};
                chon(x('sheet'), dsSheet.map(function (s, i) { return { ID: String(i), TEN: s }; }));
                veSheet();
            }).catch(function (err) {
                x('xem').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'đọc tệp import');
            });
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') load(1);
        else if (a === 'importchon') hopImportChon();
        else if (a === 'habac') {
            var dc = K.daChon(q('[data-z="t"]'), 'xntn');
            if (!dc.length) { ui.toast('Vui lòng chọn đối tượng cần hạ bậc!', 'warn'); return; }
            hopHaBac(dc);
        }
        else if (a === 'xacnhan') {
            var ids = K.daChon(q('[data-z="t"]'), 'xntn');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
            hopXacNhan(ids);
        }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    load(1);
})();
