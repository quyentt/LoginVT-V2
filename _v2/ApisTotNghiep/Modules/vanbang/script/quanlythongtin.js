/* =========================================================================
   Quản lý thông tin văn bằng (Tốt nghiệp)
   Bản gốc: ApisTotNghiep/Modules/vanbang/html/quanlythongtin.html + script/quanlythongtin.js — theo gốc 1/10 (commit 6c2e988f:
   thêm nút "Gán số vào sổ" + hộp chọn số vào sổ chưa sử dụng)
   (bản Học bổng ApisHocBong/…/vanbang/quanlythongtin là bản chép CŨ hơn của màn này — bản này đầy đủ hơn:
   thêm Kế hoạch / Quyết định / Tiêu chí sắp xếp, Import, Tạo QĐ, Thêm mới theo người học, Bản sao, Xóa)
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp (chọn nhiều) / Phân loại · Kế hoạch · Đối tượng ·
   Quyết định / Tiêu chí sắp xếp · từ khoá · Tìm kiếm · Xuất báo cáo · Import ▾) → khung "Danh sách kế hoạch (n)"
   (Tạo QĐ / Chuyển trạng thái TN · Sinh tự động số hiệu · Sinh tự động số vào sổ · Xác nhận · Thêm mới · Xóa) với bảng
   Ảnh · Mã số · Họ tên · Ngày sinh · Giới tính · Dân tộc · Nơi sinh · Ngành nghề · Lớp · Khoa quản lý · Số hiệu bằng ·
   Số vào sổ · Số QĐ · Ngày QĐ · Ngày ký bằng · Ngày vào sổ · Nợ phí · Sửa · ô đánh dấu → khung "Thêm mới / Sửa —
   Thông tin cá nhân" THAY CHỖ danh sách (Tìm sinh viên khi thêm; Thông tin cơ bản hai cột Việt | Anh; Bản sao; ảnh bên
   phải). Hộp "Duyệt hồ sơ" (xác nhận) và "Tạo QĐ / Chuyển trạng thái TN" (thao tác hàng loạt) giữ hộp thoại.

   Lời gọi (chép nguyên):
       Danh sách: TN_VanBang_ChungChi/LayDSTN_KetQua_CongNhan_VB POST (không func, gốc truyền iM → truyền iM tường minh)
            strTuKhoa, strPhanLoai_Id, strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id,
            strDaoTao_KhoaQuanLy_Id (''), strDaoTao_LopQuanLy_Id ("a,b"), strNguoiDung_Id / strNguoiTao_Id /
            strTinhTrangXacNhan_Id / strPhoi_MauPhoiIn_Id / strPhoi_MauPhoiIn_BanSao_Id ('' — dropAAAA), strSoQuyetDinh (CHỮ của
            mục Quyết định đang chọn), pageIndex, pageSize, strChucNang_Id, dDoiTuongBenNgoai, strTN_KeHoach_Id,
            strTieuChiSapXep, strNguoiThucHien_Id
       Xuất báo cáo: ums.report.mount, các cặp khoá của TN_KetQua_CongNhan_VB/LayDanhSach (obj_list gốc).
       Import ▾: IMPORTWITHPROC_KQCNVB · IMPORTWITHPROC_DCC · IMPORTWITHPROC_UPTT → ums.report.importChung (showImportChungV2 gốc);
            có mẫu import theo quyền thì nút Import của ums.report thay chỗ ba mục cứng (như Corei: vùng zonebtnQLTT_Import).
       Quyết định: TN_KetQua_CongNhan_VB/LayDSQD_KetQua_CongNhan_VB GET (bộ lọc như danh sách) → ID / TEN — nạp lại khi đổi
            Hệ / Khoá / CT / Lớp / Đối tượng / Phân loại (như gốc).
       Phân loại (lọc + biểu mẫu): TN_Chung/LayDSPhanLoaiTheoNguoiDung POST (iM tường minh, strNguoiThucHien_Id).
       Tiêu chí sắp xếp: danh mục TN.THONGTINVANBANG.SAPXEP.  Kế hoạch: ums.tnvb.boLoc (TN_ThongTin/LayDSTN_KeHoach).
       Tạo QĐ: TN_VanBang_ChungChi_MH/EigvKRA0OCQ1BSgvKQPP · PKG_VANBANG_CHUNGCHI.SinhQuyetDinh — mỗi dòng đánh dấu một lời gọi
            (strTN_KetQua_CongNhan_VB_Id, strSoQD, strNgayQD, strNgayHieuLuc, strNoiDung, strNguoiThucHien_Id).
       Sinh số: TN_KetQua_CongNhan_VB/SinhSoHieuVanBang · SinhSoVaoSo GET, lần lượt từng dòng (strNgayThucHien '' — txtAAAA,
            strPhanLoai_Id = ô Phân loại, strTN_KetQua_CongNhan_VB_Id, strNguoiThucHien_Id).
       Xác nhận: danh mục TN.XACNHANVANBANG (sắp HESO1) → nút tình trạng (icon THONGTIN1 FA4 → ums.iconFA4, màu THONGTIN2);
            TN_VanBang_XacNhanIn/ThemMoi POST mỗi dòng (strId '', strSanPham_Id, strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id);
            lịch sử TN_VanBang_XacNhanIn/LayDanhSach GET (strTuKhoa '', strsanpham_Id, strTinhTrang_Id '', strNguoiThucHien_Id '',
            pageIndex 1, pageSize 100000).
       Xóa: TN_KetQua_CongNhan_VB/Xoa POST (strIds, strNguoiThucHien_Id) — từng dòng đánh dấu, hoặc bản đang sửa.
       Biểu mẫu: SV_HoSo/LayChiTiet GET (strId = mã SV) → DKH_Chung/LayDSChuongTrinh GET (strQLSV_NguoiHoc_Id) →
            "Xem thông tin" TN_KetQua_CongNhan_VB/LayTTTN_KetQua_CongNhan_VB GET · "Kế thừa thông tin" …/KeThuaTTTN_KetQua_CongNhan_VB GET
            (strChucNang_Id, strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id = ô Chương trình học, strPhanLoai_Id = ô Phân loại);
            Xếp loại TN_VanBang_ChungChi_Chung/LayDSXepLoaiTheoPhanLoai GET (strPhanLoai_Id, strNguoiThucHien_Id);
            Mẫu phôi / bản sao: ums.tnvb.mauPhoi (TN_PhoiIn/*);
            Lưu: TN_KetQua_CongNhan_VB/ThemMoi (strId rỗng) | CapNhat — 37 tham số chép nguyên (xem `luu`); sửa thì
            strDaoTao_ChuongTrinh_Id lấy DAOTAO_TOCHUCCHUONGTRINH_ID của bản ghi (như gốc).
            Bản sao: TN_VanBang_BanSao/LayDanhSach GET · ThemMoi | CapNhat · Xoa (ums.pat.rows), chỉ lưu dòng có Số vào sổ.

       Gán số vào sổ (gốc 1/10): đánh dấu ĐÚNG MỘT người học → hộp "Danh sách số vào sổ (Chưa sử dụng)" (lọc Quy tắc sinh số ·
            Năm thực hiện · Thông tin tìm kiếm · Xem; bấm dòng = chọn) → "Đồng ý gán số vào sổ" hỏi lại rồi
            TN_VanBang_ChungChi_MH/BiAvEi4XIC4SLhUzNCIVKCQx · PKG_VANBANG_CHUNGCHI.GanSoVaoSoTrucTiep
            (strTN_KetQua_CN_VB_Id, strSoVaoSoCapBang_Id, strNguoiThucHien_Id) → đóng hộp, nạp lại danh sách.
            Quy tắc: PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoVaoSo_Ad; danh sách số:
            PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_LayDanhSach (pageIndex 1, pageSize 100000), lọc ở máy khách bỏ dòng
            DA_SU_DUNG = 1 / true (như gốc). Hộp chọn = việc phụ nên giữ hộp thoại; cột chọn (radio) đặt CUỐI bảng (luật 17).

   Khác gốc / lỗi gốc đã sửa:
     · Hệ → Khoá → CT → Lớp và Phân loại → Kế hoạch / Xếp loại theo luật cha → con. Chương trình học khoá tới khi tìm được SV.
     · Lưu bắt buộc đã có người học (tìm SV rồi Xem / Kế thừa thông tin) và kiểm ngày / tháng / năm sinh (ums.util.ngaySinh) —
       gốc gửi thẳng, người học rỗng thì máy chủ từ chối. Lưu xong (cả các dòng bản sao, chạy SAU bản ghi chính — gốc chạy song
       song) thì đóng biểu mẫu và nạp lại danh sách (gốc ở lại biểu mẫu).
     · Hộp "Duyệt hồ sơ": gốc không bao giờ nạp lịch sử (getList_QuanLyThongTinTN không ai gọi) → nạp khi đánh dấu ĐÚNG MỘT dòng;
       loadBtnQuanLyThongTin gán danh mục tình trạng đè dữ liệu bảng (dtQuanLyThongTin) → Sửa hỏng tới lần tải sau — không chép.
     · Sinh số / Tạo QĐ / Xác nhận / Xóa nhiều dòng hỏi lại trước khi ghi; chạy có tiến độ (ui.batch), xong nạp lại.
     · Tạo QĐ: gốc gọi tuần tự async:false — bản mới tuần tự, không khoá trình duyệt.
     · "Thêm mới" đặt ở đầu trang (BO-CUC luật 5) thay cho đầu khung danh sách.
   Giữ như gốc (nghi nhưng chưa chắc): ô "Ngày vào sổ cấp bằng" hiện & đổ dữ liệu nhưng KHÔNG gửi khi Lưu; strDuongDanAnh gửi
     nguyên đường dẫn ảnh vừa tải (kể cả "unsave_…" — gốc không gọi copyfile).
   Cố ý bỏ (mã chết): getList_BtnQuanLyThongTin, getList_ThoiGianDaoTao / NamNhapHoc / KhoaQuanLy, genList_TrangThaiSV, các
     callback cbGenCombo_* (thay bằng pat.fill), ô Khoa quản lý (đã chú thích trong html gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tnvb, esc = ui.esc, e = T.e;
    var root = document.getElementById('tn-quanlythongtin');
    if (!root) return;
    function iM() { return (ums.session && ums.session.iM) || ''; }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }

    function sel(k, ph, them) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (them || '') + '>' +
            (them && them.indexOf('multiple') >= 0 ? '' : '<option value=""></option>') + '</select></div>';
    }
    var IMPORT = [
        ['IMPORTWITHPROC_KQCNVB', 'Kết quả văn bằng', '1. Import kết quả công nhận văn bằng'],
        ['IMPORTWITHPROC_DCC', 'Kết quả văn bằng', '2. Import kết quả ĐẠT chứng chỉ'],
        ['IMPORTWITHPROC_UPTT', 'Up thông tin', '3. Import Up thông tin']
    ];
    var importDrop = '<div class="ums-drop" data-drop="tnvb-import">' +
        '<button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false" data-a="impmenu">' +
        '<i class="fa-light fa-cloud-arrow-up"></i><span>Import</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
        '<div class="ums-drop__menu" role="menu" hidden>' + IMPORT.map(function (x, i) {
            return '<button type="button" class="ums-drop__item" role="menuitem" data-imp="' + i + '"><span class="ums-drop__text">' + esc(x[2]) + '</span></button>';
        }).join('') + '</div></div>';

    root.innerHTML = pat.page('Quản lý thông tin', ui.btn('add', { attr: { 'data-a': 'them' } })) +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('ct', 'Tất cả chương trình đào tạo') +
                sel('lop', 'Tất cả lớp', ' multiple') +
            '</div><div class="ums-filter ums-u-mt-3">' +
                sel('pl', 'Chọn phân loại') + sel('kh', 'Chọn kế hoạch') +
                '<div class="ums-field"><select class="ums-select" data-f="dt" data-required>' +
                    '<option value="-1">Tất cả đối tượng</option><option value="0">Đối tượng trong trường</option>' +
                    '<option value="1">Đối tượng ngoài trường</option></select></div>' +
                sel('qd', 'Chọn quyết định') +
            '</div><div class="ums-filter ums-u-mt-3">' +
                sel('tc', 'Chọn tiêu chí sắp xếp') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit"><span data-z="report"></span>' + importDrop + '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-file-certificate', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('search', { text: 'Gán số vào sổ', mod: 'out-info', icon: 'fa-bookmark', attr: { 'data-a': 'ganso' } }) +
                ui.btn('search', { text: 'Tạo QĐ / Chuyển trạng thái TN', mod: 'out-primary', icon: 'fa-user-gear', attr: { 'data-a': 'qd' } }) +
                ui.btn('search', { text: 'Sinh tự động số hiệu', mod: 'out-warn', icon: 'fa-gear', attr: { 'data-a': 'sohieu' } }) +
                ui.btn('search', { text: 'Sinh tự động số vào sổ', mod: 'out-success', icon: 'fa-book-open-reader', attr: { 'data-a': 'sovaoso' } }) +
                ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } }) +
                ui.xoaChon('input[data-ck]', { text: 'Xóa', attr: { 'data-a': 'xoanhieu' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = T.boLoc({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'), pl: f('pl'), kh: f('kh') },
        { tuKhoa: function () { return (f('q').value || '').trim(); } });

    /* ---------- Nguồn ô chọn ---------- */
    var dsPhanLoai = ums.api.call({ action: 'TN_Chung/LayDSPhanLoaiTheoNguoiDung', iM: iM(), strNguoiThucHien_Id: T.uid(), silent: true })
        .then(function (r) { return T.arr(r.data); });
    dsPhanLoai.then(function (d) { pat.fill(f('pl'), d, { head: 'Chọn phân loại' }); }, loi('TN_Chung/LayDSPhanLoaiTheoNguoiDung'));
    ums.api.dm('TN.THONGTINVANBANG.SAPXEP').then(function (d) { pat.fill(f('tc'), d, { head: 'Chọn tiêu chí sắp xếp' }); })
        .catch(loi('tiêu chí sắp xếp'));
    var dsTinhTrang = ums.api.dm('TN.XACNHANVANBANG', 'HESO1');
    dsTinhTrang.catch(loi('tình trạng duyệt'));

    function thamSoLoc() {
        var qd = f('qd'), soQD = qd.value ? (qd.options[qd.selectedIndex] || {}).text || '' : '';
        return {
            strTuKhoa: (f('q').value || '').trim(), strPhanLoai_Id: loc.gtri('pl'),
            strDaoTao_HeDaoTao_Id: loc.gtri('he'), strDaoTao_KhoaDaoTao_Id: loc.gtri('khoa'), strDaoTao_ChuongTrinh_Id: loc.gtri('ct'),
            strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: loc.gtri('lop'), strNguoiDung_Id: '', strNguoiTao_Id: '',
            strSoQuyetDinh: soQD
        };
    }
    var luotQD = 0;
    function napQuyetDinh() {
        var sh = ++luotQD, p = thamSoLoc();
        delete p.strSoQuyetDinh;
        p.action = 'TN_KetQua_CongNhan_VB/LayDSQD_KetQua_CongNhan_VB'; p.method = 'GET'; p.silent = true;
        p.pageIndex = 1; p.pageSize = 10;           // gốc: edu.system.pageIndex_default / pageSize_default
        p.strChucNang_Id = T.cn(); p.dDoiTuongBenNgoai = f('dt').value; p.strTinhTrangXacNhan_Id = '';
        ums.api.call(p).then(function (r) { if (sh === luotQD) pat.fill(f('qd'), T.arr(r.data), { head: 'Chọn quyết định' }); })
            .catch(loi('TN_KetQua_CongNhan_VB/LayDSQD_KetQua_CongNhan_VB'));
    }
    ['he', 'khoa', 'ct', 'lop', 'dt', 'pl'].forEach(function (k) {
        jQuery(f(k)).on('select2:select select2:unselect select2:clear', napQuyetDinh);
    });

    /* Xuất báo cáo — các cặp khoá của obj_list gốc (TN_KetQua_CongNhan_VB/LayDanhSach) */
    ums.report.mount(z('report'), {
        collect: function (add) {
            var p = thamSoLoc();
            add('action', 'TN_KetQua_CongNhan_VB/LayDanhSach');
            ['strTuKhoa', 'strPhanLoai_Id', 'strDaoTao_HeDaoTao_Id', 'strDaoTao_KhoaDaoTao_Id', 'strDaoTao_ChuongTrinh_Id',
                'strDaoTao_KhoaQuanLy_Id', 'strDaoTao_LopQuanLy_Id', 'strNguoiDung_Id', 'strNguoiTao_Id', 'strSoQuyetDinh'].forEach(function (k) { add(k, p[k]); });
            add('dDoiTuongBenNgoai', f('dt').value);
            add('strTinhTrangXacNhan_Id', '');
        },
        onImported: function () { tai(); },
        /* Corei getList_MauImport: có mẫu import theo quyền thì nút Import của mẫu THAY nội dung vùng zonebtnQLTT_Import
           (ba mục cứng), không có thì giữ ba mục cứng */
        onLoad: function (rows) {
            var coImport = (rows || []).some(function (t) { return /^(IMPORTALLINPUT|IMPORTWITHPROC)/i.test(e(t.MAUIMPORT_MA)); });
            var cung = root.querySelector('[data-drop="tnvb-import"]');
            if (cung) cung.hidden = coImport;
        }
    });

    /* ---------- Danh sách ---------- */
    var ds = [], trang = { index: 1, size: 10 }, luot = 0;
    function tai(p) {
        if (p) trang.index = p;
        var sh = ++luot, o = thamSoLoc();
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        o.action = 'TN_VanBang_ChungChi/LayDSTN_KetQua_CongNhan_VB';
        o.pageIndex = trang.index; o.pageSize = trang.size; o.strChucNang_Id = T.cn();
        o.dDoiTuongBenNgoai = f('dt').value; o.strTinhTrangXacNhan_Id = ''; o.strPhoi_MauPhoiIn_Id = ''; o.strPhoi_MauPhoiIn_BanSao_Id = '';
        o.strTN_KeHoach_Id = f('kh').value; o.strTieuChiSapXep = f('tc').value; o.strNguoiThucHien_Id = T.uid(); o.iM = iM();
        ums.api.call(o).then(function (r) {
            if (sh !== luot) return;
            ds = T.arr(r.data);
            ve(Number(r.pager) || 0);
        }).catch(function (err) {
            if (sh !== luot) return;
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'TN_VanBang_ChungChi/LayDSTN_KetQua_CongNhan_VB');
        });
    }
    function anh(p) {
        return p ? '<img class="hbth-anh" alt="" src="' + esc(ums.files.url(p)) + '">' : '<i class="fa-light fa-user"></i>';
    }
    function ve(tong) {
        ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu',
            page: { index: trang.index, size: trang.size, total: tong || ds.length,
                onChange: function (p) { tai(p); }, onSize: function (s) { trang.size = s; tai(1); } },
            columns: [
                { title: 'Ảnh cá nhân', cls: 'is-center', render: function (r) { return anh(r.DUONGDANANHCANHAN); } },
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(T.hoTen(r)); } },
                { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (r) {
                    return esc(e(r.QLSV_NGUOIHOC_NGAYSINH) + '/' + e(r.QLSV_NGUOIHOC_THANGSINH) + '/' + e(r.QLSV_NGUOIHOC_NAMSINH));
                } },
                { title: 'Giới tính', prop: 'QLSV_NGUOIHOC_GIOITINH', cls: 'is-center' },
                { title: 'Dân tộc', prop: 'QLSV_NGUOIHOC_DANTOC', cls: 'is-center' },
                { title: 'Nơi sinh', prop: 'QLSV_NGUOIHOC_NOISINH', cls: 'is-center' },
                { title: 'Ngành nghề', prop: 'QLSV_NGUOIHOC_NGANHNGHE', cls: 'is-center' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center' },
                { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN', cls: 'is-center' },
                { title: 'Số hiệu bằng', prop: 'SOHIEUBANG', cls: 'is-center' },
                { title: 'Số vào sổ cấp bằng', prop: 'SOVAOSOCAPBANG' },
                { title: 'Số quyết định', prop: 'SOQUYETDINH' },
                { title: 'Ngày quyết định', prop: 'NGAYQUYETDINH', cls: 'is-nowrap' },
                { title: 'Ngày ký bằng', prop: 'NGAYKYBANG', cls: 'is-nowrap' },
                { title: 'Ngày vào sổ cấp bằng', prop: 'NGAYVAOSOCAPBANG', cls: 'is-nowrap' },
                { title: 'Nợ phí', cls: 'is-right is-nowrap', render: function (r) {
                    return r.TONGNOPHI === null || r.TONGNOPHI === undefined || r.TONGNOPHI === '' ? '' : esc(ui.money(r.TONGNOPHI));
                } },
                { title: 'Sửa', cls: 'is-actions', width: '64px', render: function (r, i) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-sua="' + i + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } },
                { head: '<input type="checkbox" title="Chọn tất cả" data-ckall>', cls: 'is-center', width: '44px',
                    render: function (r) { return '<input type="checkbox" data-ck="' + esc(r.ID) + '">'; } }
            ] });
        z('n').textContent = '(' + (tong || ds.length) + ')';
    }
    function daChon() {
        return Array.prototype.map.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck'); });
    }

    /* ---------- Thao tác hàng loạt ---------- */
    function sinhSo(loai, ten) {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
        ui.confirm(ten + ' cho ' + ids.length + ' người học đã chọn? Bạn có chắc chắn lưu dữ liệu không?', { ok: 'Đồng ý', title: ten }).then(function (ok) {
            if (!ok) return;
            ui.batch(ids.map(function (id) {
                return { action: 'TN_KetQua_CongNhan_VB/' + loai, method: 'GET', strNgayThucHien: '', strPhanLoai_Id: f('pl').value,
                    strTN_KetQua_CongNhan_VB_Id: id, strNguoiThucHien_Id: T.uid() };
            }), { title: 'Đang thực hiện', okText: 'Thực hiện thành công!' }).then(function () { tai(); });
        });
    }
    function taoQuyetDinh() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần tạo QĐ?', 'warn'); return; }
        var dlg = ui.dialog({ title: 'Tạo QĐ / Chuyển trạng thái TN', icon: 'fa-file-signature', size: 'md', body:
            '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2">Áp dụng cho ' + ids.length + ' người học đã chọn.</div>' +
            '<div class="ums-grid ums-grid--2">' +
                ui.field('Số QĐ', '<input class="ums-input" data-x="strSoQD" placeholder="Nhập số quyết định" autocomplete="off">') +
                ui.field('Ngày QĐ', '<input class="ums-input" data-x="strNgayQD" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                ui.field('Ngày hiệu lực', '<input class="ums-input" data-x="strNgayHieuLuc" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                '<div style="grid-column:1 / -1">' + ui.field('Nội dung', '<textarea class="ums-input" rows="3" data-x="strNoiDung" placeholder="Nội dung quyết định"></textarea>') + '</div>' +
            '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var v = {};
                Array.prototype.forEach.call(d.body.querySelectorAll('[data-x]'), function (x) { v[x.getAttribute('data-x')] = (x.value || '').trim(); });
                ui.confirm('Tạo quyết định / chuyển trạng thái tốt nghiệp cho ' + ids.length + ' người học đã chọn?', { ok: 'Đồng ý', title: 'Tạo QĐ' }).then(function (ok) {
                    if (!ok) return;
                    d.close();
                    ui.batch(ids.map(function (id) {
                        return { action: 'TN_VanBang_ChungChi_MH/EigvKRA0OCQ1BSgvKQPP', func: 'PKG_VANBANG_CHUNGCHI.SinhQuyetDinh',
                            strTN_KetQua_CongNhan_VB_Id: id, strSoQD: v.strSoQD, strNgayQD: v.strNgayQD, strNgayHieuLuc: v.strNgayHieuLuc,
                            strNoiDung: v.strNoiDung, strNguoiThucHien_Id: T.uid() };
                    }), { title: 'Đang thực hiện', okText: 'Thực hiện thành công!' }).then(function () { tai(); });
                });
                return false;
            } }] });
        ui.enhance(dlg.body);
    }
    function xacNhan() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var dlg = ui.dialog({ title: 'Duyệt hồ sơ', icon: 'fa-circle-check', size: 'lg', body:
            '<div class="ums-legend">Nội dung duyệt hồ sơ</div>' +
            '<input class="ums-input" data-x="nd" autocomplete="off">' +
            '<div class="ums-legend ums-legend--cach">Chọn duyệt hồ sơ</div><div class="hbth-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
            '<div class="ums-legend ums-legend--cach">Lịch sử duyệt</div><div data-x="ls"></div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        dsTinhTrang.then(function (d) {
            d = T.arr(d);
            q('nut').innerHTML = d.length ? d.map(function (t) {
                var ic = ums.iconFA4(e(t.THONGTIN1)) || 'fa-light fa-paper-plane';
                return '<button type="button" class="hbth-xn__nut" data-tt="' + esc(t.ID) + '">' +
                    '<i class="' + esc(ic) + '"' + (t.THONGTIN2 ? ' style="' + esc(t.THONGTIN2) + '"' : '') + '></i>' +
                    '<span>' + esc(t.TEN) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo tình trạng duyệt');
        }).catch(function (err) { q('nut').innerHTML = ui.fail(err.message); });
        if (ids.length === 1) {
            ums.api.call({ action: 'TN_VanBang_XacNhanIn/LayDanhSach', method: 'GET', strTuKhoa: '', strsanpham_Id: ids[0],
                strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    ui.table({ el: q('ls'), rows: T.arr(r.data), empty: 'Chưa có lịch sử duyệt', columns: [
                        { title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN' },
                        { title: 'Nội dung', prop: 'NOIDUNG' },
                        { title: 'Người xác nhận', prop: 'NGUOIQuanLyThongTin_TENDAYDU' },
                        { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '100px' }] });
                })
                .catch(function (err) { q('ls').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử duyệt'); });
        } else {
            q('ls').innerHTML = ui.empty('Đang chọn ' + ids.length + ' dòng — đánh dấu một dòng để xem lịch sử duyệt');
        }
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tt]');
            if (!b) return;
            var nd = (q('nd').value || '').trim(), tt = b.getAttribute('data-tt'), ten = (b.textContent || '').trim();
            ui.confirm('Xác nhận "' + ten + '" cho ' + ids.length + ' người học đã chọn?', { ok: 'Đồng ý', title: 'Duyệt hồ sơ' }).then(function (ok) {
                if (!ok) return;
                dlg.close();
                ui.batch(ids.map(function (id) {
                    return { action: 'TN_VanBang_XacNhanIn/ThemMoi', strId: '', strSanPham_Id: id, strNoiDung: nd,
                        strTinhTrang_Id: tt, strNguoiXacnhan_Id: T.uid() };
                }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' });
            });
        });
    }
    /* Gán số vào sổ trực tiếp (gốc 1/10) — hộp chọn một số vào sổ chưa sử dụng cho MỘT người học */
    function ganSoVaoSo() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn sinh viên cần gán số vào sổ!', 'warn'); return; }
        if (ids.length > 1) { ui.toast('Vui lòng chỉ chọn 1 sinh viên để gán số vào sổ trực tiếp!', 'warn'); return; }
        var svId = ids[0], A = 'TN_VanBang_ChungChi_Chung_MH/', P = 'PKG_VANBANG_CHUNGCHI_CHUNG.', dsSo = [], luotSo = 0;
        var dlg = ui.dialog({ title: 'Danh sách số vào sổ (Chưa sử dụng)', icon: 'fa-bookmark', size: 'xl', body:
            '<div class="ums-filter ums-u-mb-4">' +
                '<div class="ums-field"><select class="ums-select" data-g="qt" data-ph="--Chọn quy tắc sinh số--"><option value=""></option></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-g="nam" placeholder="Năm thực hiện" autocomplete="off"></div>' +
                '<div class="ums-field"><input class="ums-input" data-g="q" placeholder="Thông tin tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem', attr: { 'data-g': 'xem' } }) + '</div>' +
            '</div><div data-g="bang"></div>',
            buttons: [{ text: 'Đồng ý gán số vào sổ', kind: 'confirm', onClick: function (d) { dongY(d); return false; } }] });
        function g(k) { return dlg.body.querySelector('[data-g="' + k + '"]'); }
        ui.enhance(dlg.body);
        ums.api.call({ action: A + 'DSA4BRIVDx4QNDgVICISKC8pHhIuFyAuEi4eACUP', func: P + 'LayDSTN_QuyTacSinh_SoVaoSo_Ad',
            strNguoiThucHien_Id: T.uid(), silent: true })
            .then(function (r) { pat.fill(g('qt'), T.arr(r.data), { head: '--Chọn quy tắc sinh số--' }); })
            .catch(loi('LayDSTN_QuyTacSinh_SoVaoSo_Ad'));
        function taiSo() {
            var sh = ++luotSo;
            g('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: A + 'Ei4CKTQvJhU0Hg0gOAUgLykSICIp', func: P + 'SoChungTu_LayDanhSach',
                strTN_HeThongChungTu_Ad_Id: g('qt').value, strNamThucHien: (g('nam').value || '').trim(),
                strSoChungTu: (g('q').value || '').trim(), strNguoiThucHien_Id: T.uid(), pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    if (sh !== luotSo) return;
                    dsSo = T.arr(r.data).filter(function (x) { return String(x.DA_SU_DUNG) !== '1' && String(x.DA_SU_DUNG).toLowerCase() !== 'true'; });
                    ui.table({ el: g('bang'), rows: dsSo, empty: 'Không có số vào sổ nào chưa sử dụng', columns: [
                        { title: 'Chỉ số', prop: 'CHISO', cls: 'is-center' },
                        { title: 'Số vào sổ', cls: 'is-center', render: function (x) { return '<b class="ums-u-blue">' + esc(e(x.SOCHUNGTU)) + '</b>'; } },
                        { title: 'Quy tắc', prop: 'HETHONGCHUNGTU_MA', cls: 'is-center' },
                        { title: 'Ngày thực hiện', prop: 'NGAYTHUCHIEN', cls: 'is-center is-nowrap' },
                        { title: 'Năm', prop: 'NAMTHUCHIEN', cls: 'is-center' },
                        { title: 'Tự động', cls: 'is-center', render: function (x) { return String(x.IS_NHAP_THUCONG) === '1' ? 'Thủ công' : 'Tự động'; } },
                        { title: 'Tình trạng sử dụng', cls: 'is-center', render: function () { return ui.badge('Chưa sử dụng', 'ok'); } },
                        { title: 'Chọn', cls: 'is-center', width: '64px', render: function (x) {
                            return '<input type="radio" name="tnvb-ganso" value="' + esc(e(x.ID)) + '">';
                        } }
                    ] });
                })
                .catch(function (err) { if (sh !== luotSo) return; g('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'SoChungTu_LayDanhSach'); });
        }
        function dongY(d) {
            var r = dlg.body.querySelector('input[name="tnvb-ganso"]:checked');
            if (!r) { ui.toast('Vui lòng chọn 1 số vào sổ để gán!', 'warn'); return; }
            var row = dsSo.filter(function (x) { return String(x.ID) === r.value; })[0] || {};
            ui.confirm('Bạn có chắc chắn gán số vào sổ ' + e(row.SOCHUNGTU) + ' cho người học đã chọn không?', { ok: 'Đồng ý', title: 'Gán số vào sổ' }).then(function (ok) {
                if (!ok) return;
                ums.api.call({ action: 'TN_VanBang_ChungChi_MH/BiAvEi4XIC4SLhUzNCIVKCQx', func: 'PKG_VANBANG_CHUNGCHI.GanSoVaoSoTrucTiep',
                    strTN_KetQua_CN_VB_Id: svId, strSoVaoSoCapBang_Id: r.value, strNguoiThucHien_Id: T.uid() })
                    .then(function () { ui.toast('Gán số vào sổ thành công!', 'ok'); d.close(); tai(); })
                    .catch(loi('PKG_VANBANG_CHUNGCHI.GanSoVaoSoTrucTiep'));
            });
        }
        dlg.body.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-g="xem"]')) { taiSo(); return; }
            var tr = ev.target.closest('[data-g="bang"] tbody tr');
            if (!tr || ev.target.matches('input[type="radio"]')) return;
            var rd = tr.querySelector('input[type="radio"]');
            if (rd) rd.checked = true;
        });
        dlg.body.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' && ev.target.matches('input[data-g]')) { ev.preventDefault(); taiSo(); }
        });
        taiSo();
    }
    function xoaNhieu() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Xóa ' + ids.length + ' dòng đã chọn? Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa', title: 'Xóa dữ liệu' }).then(function (ok) {
            if (!ok) return;
            ui.batch(ids.map(function (id) { return { action: 'TN_KetQua_CongNhan_VB/Xoa', strIds: id, strNguoiThucHien_Id: T.uid() }; }),
                { title: 'Đang xóa', okText: 'Xóa thành công!' }).then(function () { tai(); });
        });
    }

    /* =====================================================================
       Biểu mẫu "Thông tin cá nhân" (zoneEdit) — biểu mẫu trong trang
       ===================================================================== */
    function o(k, nhan, them) {
        return ui.field(nhan, '<input class="ums-input" data-v="' + k + '" placeholder="' + esc(nhan) + '" autocomplete="off"' + (them || '') + '>');
    }
    function ngay(k, nhan) {
        return ui.field(nhan, '<input class="ums-input" data-v="' + k + '" data-date placeholder="dd/mm/yyyy" autocomplete="off">');
    }
    function cap(nhan, a, b, ro, ph) {
        var x = ro ? ' readonly' : '';
        return ui.field(nhan, '<div class="tnvb-cap"><input class="ums-input" data-v="' + a + '" placeholder="' + esc(ph[0]) + '" autocomplete="off"' + x + '>' +
            '<input class="ums-input" data-v="' + b + '" placeholder="' + esc(ph[1]) + '" autocomplete="off"' + x + '></div>');
    }
    function ba(nhan, a, b, c, ph) {
        return ui.field(nhan, '<div class="tnvb-cap tnvb-cap--3">' + [a, b, c].map(function (k, i) {
            return '<input class="ums-input" data-v="' + k + '" placeholder="' + esc(ph[i]) + '" autocomplete="off">';
        }).join('') + '</div>');
    }
    function chon(k, nhan, ph) {
        return ui.field(nhan, '<select class="ums-select" data-v="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>');
    }
    /* Ô của biểu mẫu → cột đổ khi sửa (viewEdit_QuanLyThongTin gốc) */
    var COT = {
        MaSo: 'QLSV_NGUOIHOC_MASO', HoDem: 'QLSV_NGUOIHOC_HODEM', Ten: 'QLSV_NGUOIHOC_TEN', HoDem_TA: 'QLSV_NGUOIHOC_HODEM_TA',
        Ten_TA: 'QLSV_NGUOIHOC_TEN_TA', XepLoai_TA: 'QLSV_NGUOIHOC_XEPLOAI_TA', MauPhoi: 'PHOI_NGUOIHOC_NHAPTRUCTIEP_ID',
        MauPhoi_BanSao: 'PHOI_NGUOIHOC_NHAP_BANSAO_ID', NgaySinhDD: 'NGAYSINHDAYDU', NgaySinhDD_TA: 'NGAYSINHDAYDU_TA',
        NgaySinh: 'QLSV_NGUOIHOC_NGAYSINH', ThangSinh: 'QLSV_NGUOIHOC_THANGSINH', NamSinh: 'QLSV_NGUOIHOC_NAMSINH',
        NgaySinh_TA: 'QLSV_NGUOIHOC_NGAYSINH_TA', ThangSinh_TA: 'QLSV_NGUOIHOC_THANGSINH_TA', NamSinh_TA: 'QLSV_NGUOIHOC_NAMSINH_TA',
        GioiTinh: 'QLSV_NGUOIHOC_GIOITINH', GioiTinh_TA: 'QLSV_NGUOIHOC_GIOITINH_TA', DanToc: 'QLSV_NGUOIHOC_DANTOC',
        DanToc_TA: 'QLSV_NGUOIHOC_DANTOC_TA', NoiSinh: 'QLSV_NGUOIHOC_NOISINH', NoiSinh_TA: 'QLSV_NGUOIHOC_NOISINH_TA',
        NganhNghe: 'QLSV_NGUOIHOC_NGANHNGHE', NganhNghe_TA: 'QLSV_NGUOIHOC_NGANHNGHE_TA', OngBa: 'QLSV_NGUOIHOC_ONGBA',
        OngBa_TA: 'QLSV_NGUOIHOC_ONGBA_TA', NgayKyBang: 'NGAYKYBANG', SoQuyetDinh: 'SOQUYETDINH', NgayQuyetDinh: 'NGAYQUYETDINH',
        NgayVaoSo: 'NGAYVAOSOCAPBANG', SoHieuBang: 'SOHIEUBANG', SoVaoSo: 'SOVAOSOCAPBANG', NgayCapBanGoc: 'NGAYCAPBANGOC',
        HoiDongChungChi: 'THONGTINHOIDONGTHICHUNGCHI'
    };

    function moBieuMau(rec) {
        var laSua = !!rec;
        var st = { svId: '', ctHoc: '', id: '', rec: null };
        var body = document.createElement('div');
        body.innerHTML =
            (laSua ? '' :
                '<div class="ums-legend">Tìm sinh viên</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    ui.field('Mã sinh viên', '<div class="tnvb-tim"><input class="ums-input" data-v="_ma" placeholder="Nhập mã sinh viên" autocomplete="off">' +
                        ui.btn('search', { text: 'Tìm sinh viên', attr: { 'data-b': 'timsv' } }) + '</div><div class="tnvb-tim__sv ums-u-mt-2" data-b="sv"></div>') +
                    chon('_pl', 'Phân loại', 'Chọn phân loại') +
                    chon('_cthoc', 'Chương trình học', 'Chọn chương trình') +
                    ui.field(' ', '<div class="tnvb-nut">' +
                        ui.btn('view', { text: 'Xem thông tin', mod: 'primary', icon: 'fa-eye', attr: { 'data-b': 'xem' } }) +
                        ui.btn('add', { text: 'Kế thừa thông tin', mod: 'out-success', attr: { 'data-b': 'kethua' } }) + '</div>') +
                '</div>') +
            '<div class="ums-legend' + (laSua ? '' : ' ums-legend--cach') + '">Thông tin cơ bản</div>' +
            '<div class="tnvb-form"><div>' +
                (laSua ? '<div hidden>' + chon('_pl', 'Phân loại', 'Chọn phân loại') + '</div>' : '') +
                '<div class="ums-grid ums-grid--2">' +
                    o('MaSo', 'Mã số', ' readonly') + '<div></div>' +
                    cap('Họ và tên', 'HoDem', 'Ten', true, ['Họ đệm', 'Tên']) + cap('Họ và tên TA', 'HoDem_TA', 'Ten_TA', true, ['First Name', 'Last Name']) +
                    chon('XepLoai', 'Xếp loại', 'Chọn xếp loại') + o('XepLoai_TA', 'Xếp loại TA', ' readonly') +
                    chon('MauPhoi', 'Mẫu phôi', 'Chọn mẫu phôi') + chon('MauPhoi_BanSao', 'Mẫu phôi bản sao', 'Chọn mẫu phôi') +
                    o('NgaySinhDD', 'Ngày sinh đầy đủ', ' readonly') + o('NgaySinhDD_TA', 'Ngày sinh đầy đủ TA', ' readonly') +
                    ba('Ngày sinh', 'NgaySinh', 'ThangSinh', 'NamSinh', ['Ngày sinh', 'Tháng sinh', 'Năm sinh']) +
                    ba('Ngày sinh TA', 'NgaySinh_TA', 'ThangSinh_TA', 'NamSinh_TA', ['Day', 'Month', 'Year']) +
                    o('DanToc', 'Dân tộc') + o('DanToc_TA', 'Dân tộc TA') +
                    o('GioiTinh', 'Giới tính') + o('GioiTinh_TA', 'Giới tính TA') +
                    o('NoiSinh', 'Nơi sinh') + o('NoiSinh_TA', 'Nơi sinh TA') +
                    o('NganhNghe', 'Ngành nghề') + o('NganhNghe_TA', 'Ngành nghề TA') +
                    o('OngBa', 'Ông/Bà') + o('OngBa_TA', 'Ông/Bà TA') +
                    o('SoQuyetDinh', 'Số quyết định') + ngay('NgayQuyetDinh', 'Ngày quyết định') +
                    o('SoHieuBang', 'Số hiệu bằng') + o('SoVaoSo', 'Số vào sổ') +
                    ngay('NgayKyBang', 'Ngày ký bằng') + ngay('NgayVaoSo', 'Ngày vào sổ cấp bằng') +
                    ngay('NgayCapBanGoc', 'Ngày cấp bản gốc') + o('HoiDongChungChi', 'Hội đồng chứng chỉ') +
                '</div>' +
                '<div class="ums-u-mt-5" data-b="bansao"></div>' +
            '</div><div class="tnvb-form__anh" data-b="anh"></div></div>';
        function v(k) { return body.querySelector('[data-v="' + k + '"]'); }
        function b(k) { return body.querySelector('[data-b="' + k + '"]'); }

        var ft = pat.formTrang({ host: root, cols: 1, icon: laSua ? 'fa-pen-to-square' : 'fa-plus',
            title: (laSua ? 'Sửa' : 'Thêm mới') + ' - Thông tin cá nhân', body: body,
            buttons: [
                { text: 'Xóa', kind: 'del', onClick: function () { xoaMot(); return false; } },
                { text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }
            ] });
        var nutXoa = ft.el.querySelector('.ums-panel__tools .ums-btn--danger');
        function hienXoa() { if (nutXoa) nutXoa.hidden = !st.id; }
        hienXoa();

        var avatar = ums.files.avatar(b('anh'), { icon: 'fa-user-graduate' });
        var banSaoSo = 0;
        var banSao = pat.rows(b('bansao'), {
            title: 'Bản sao', icon: 'fa-copy', minRows: 1,
            columns: [
                { key: 'iThuTu', col: 'THUTU', title: 'Thứ tự', width: '110px' },
                { key: 'dDaIn', col: 'DAIN', title: 'Tình trạng', type: 'select', placeholder: 'Chưa In',
                    source: { items: [{ ID: '1', TEN: 'Đã In' }] } },
                { key: 'strSoVaoSoBanSao', col: 'SOVAOSOCAPBANSAO', title: 'Số vào sổ' }
            ],
            list: function () {
                return { action: 'TN_VanBang_BanSao/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: T.uid(),
                    strQLSV_NguoiHoc_Id: st.svId, strDaoTao_ChuongTrinh_Id: st.ctHoc || (v('_cthoc') ? v('_cthoc').value : ''),
                    strPhanLoai_Id: '', strPhoi_MauPhoiIn_Id: '', pageIndex: 1, pageSize: 200000 };
            },
            filled: function (x) { return !!x.strSoVaoSoBanSao; },
            save: function (x, r) {
                banSaoSo++;
                return { action: 'TN_VanBang_BanSao/' + (r ? 'CapNhat' : 'ThemMoi'), strId: r ? e(r.ID) : '',
                    strQLSV_NguoiHoc_Id: st.svId, strDaoTao_ChuongTrinh_Id: st.ctHoc, strPhanLoai_Id: v('_pl').value,
                    strPhoi_MauPhoiIn_Id: v('MauPhoi_BanSao').value, strSoVaoSoBanSao: x.strSoVaoSoBanSao,
                    dDaIn: x.dDaIn || '0', iThuTu: x.iThuTu || String(banSaoSo), strNguoiThucHien_Id: T.uid() };
            },
            remove: function (r) { return { action: 'TN_VanBang_BanSao/Xoa', strIds: r.ID, strNguoiThucHien_Id: T.uid() }; }
        });

        /* Nguồn ô chọn của biểu mẫu */
        var xepLoaiCho = '';
        function napXepLoai() {
            var pl = v('_pl').value;
            if (!pl) { pat.fill(v('XepLoai'), [], { head: 'Chọn xếp loại' }); return Promise.resolve(); }
            return ums.api.call({ action: 'TN_VanBang_ChungChi_Chung/LayDSXepLoaiTheoPhanLoai', method: 'GET', silent: true,
                strPhanLoai_Id: pl, strNguoiThucHien_Id: T.uid() })
                .then(function (r) {
                    pat.fill(v('XepLoai'), T.arr(r.data), { head: 'Chọn xếp loại' });
                    if (xepLoaiCho) { v('XepLoai').value = xepLoaiCho; jQuery(v('XepLoai')).trigger('change.select2').trigger('ums:refresh'); }
                }).catch(loi('TN_VanBang_ChungChi_Chung/LayDSXepLoaiTheoPhanLoai'));
        }
        var sanPL = dsPhanLoai.then(function (d) { pat.fill(v('_pl'), d, { head: 'Chọn phân loại' }); });
        var sanPhoi = T.mauPhoi(v('MauPhoi'), v('MauPhoi_BanSao'));
        setTimeout(function () {
            if (ft.closed) return;
            pat.chain([v('_pl'), v('XepLoai')], { phatLai: false });
            jQuery(v('_pl')).on('select2:select select2:clear', function () { xepLoaiCho = ''; napXepLoai(); });
            if (v('_cthoc')) {
                v('_cthoc').disabled = true; jQuery(v('_cthoc')).trigger('change.select2');
                jQuery(v('_cthoc')).on('select2:select', function () { xemThongTin(); });
            }
        }, 0);

        function datO(k, val) {
            var el = v(k);
            if (!el) return;
            el.value = e(val);
            if (el._flatpickr) el._flatpickr.setDate(el.value || null, false, 'd/m/Y');
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh');
        }
        /* viewEdit_QuanLyThongTin gốc: đổ bản ghi vào biểu mẫu; laKeThua = Kế thừa thông tin (strQuanLyThongTin_Id = '') */
        function doDu(r, laKeThua) {
            st.rec = r;
            st.svId = e(r.QLSV_NGUOIHOC_ID) || st.svId;
            st.ctHoc = e(r.DAOTAO_TOCHUCCHUONGTRINH_ID);
            st.id = laKeThua ? '' : e(r.ID);
            hienXoa();
            avatar.set(e(r.DUONGDANANHCANHAN));
            return Promise.all([sanPL, sanPhoi]).then(function () {
                Object.keys(COT).forEach(function (k) { datO(k, r[COT[k]]); });
                if (v('_cthoc') && st.ctHoc) datO('_cthoc', st.ctHoc);
                datO('_pl', r.PHANLOAI_ID);
                xepLoaiCho = e(r.XEPLOAI_ID);
                return napXepLoai();
            }).then(function () { return banSao.load('x'); });
        }

        /* ---- Thêm mới: tìm sinh viên → chương trình học → Xem / Kế thừa thông tin ---- */
        function timSV() {
            var ma = (v('_ma').value || '').trim();
            if (!ma) { ui.toast('Nhập mã sinh viên cần tìm.', 'warn'); return; }
            ums.api.call({ action: 'SV_HoSo/LayChiTiet', method: 'GET', strId: ma }).then(function (r) {
                var d = T.arr(r.data);
                if (d.length !== 1) {
                    st.svId = ''; b('sv').textContent = '';
                    ui.toast(d.length ? 'Tìm thấy ' + d.length + ' người học — nhập đúng mã sinh viên.' : 'Không tìm thấy sinh viên có mã này.', 'warn');
                    pat.fill(v('_cthoc'), [], { head: 'Chọn chương trình' });
                    v('_cthoc').disabled = true; jQuery(v('_cthoc')).trigger('change.select2');
                    return null;
                }
                st.svId = d[0].ID;
                b('sv').textContent = e(d[0].MASO) + ' - ' + (e(d[0].HODEM) + ' ' + e(d[0].TEN)).trim();
                return ums.api.call({ action: 'DKH_Chung/LayDSChuongTrinh', method: 'GET', strQLSV_NguoiHoc_Id: st.svId, strNguoiThucHien_Id: T.uid() })
                    .then(function (r2) {
                        var ct = T.arr(r2.data);
                        v('_cthoc').disabled = false;
                        pat.fill(v('_cthoc'), ct, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_TOCHUCCHUONGTRINH_TEN', head: 'Chọn chương trình' });
                        if (ct.length === 1) { datO('_cthoc', ct[0].DAOTAO_TOCHUCCHUONGTRINH_ID); xemThongTin(); }
                    });
            }).catch(loi('SV_HoSo/LayChiTiet'));
        }
        function canSVCT() {
            if (!st.svId) { ui.toast('Tìm sinh viên trước.', 'warn'); return false; }
            if (!v('_cthoc').value) { ui.toast('Chọn chương trình học.', 'warn'); return false; }
            return true;
        }
        function thamSoTT(action) {
            return { action: action, method: 'GET', strChucNang_Id: T.cn(), strQLSV_NguoiHoc_Id: st.svId,
                strDaoTao_ChuongTrinh_Id: v('_cthoc').value, strPhanLoai_Id: v('_pl').value };
        }
        function xemThongTin() {
            if (!canSVCT()) return;
            ums.api.call(thamSoTT('TN_KetQua_CongNhan_VB/LayTTTN_KetQua_CongNhan_VB')).then(function (r) {
                var d = T.arr(r.data);
                if (!d.length) { ui.toast('Sinh viên không có dữ liệu in!', 'warn'); return; }
                doDu(d[0], false);
            }).catch(loi('TN_KetQua_CongNhan_VB/LayTTTN_KetQua_CongNhan_VB'));
        }
        function keThua() {
            if (!canSVCT()) return;
            ums.api.call(thamSoTT('TN_KetQua_CongNhan_VB/KeThuaTTTN_KetQua_CongNhan_VB')).then(function (r) {
                var d = T.arr(r.data);
                if (!d.length) { ui.toast('Không có thông tin để kế thừa.', 'warn'); return; }
                doDu(d[0], true);
            }).catch(loi('TN_KetQua_CongNhan_VB/KeThuaTTTN_KetQua_CongNhan_VB'));
        }
        body.addEventListener('click', function (ev) {
            var x = ev.target.closest('[data-b]');
            if (!x || x.closest('.ums-formtrang') !== ft.el) return;
            var k = x.getAttribute('data-b');
            if (k === 'timsv') timSV(); else if (k === 'xem') xemThongTin(); else if (k === 'kethua') keThua();
        });
        if (v('_ma')) v('_ma').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); timSV(); } });

        /* ---- Lưu (save_QuanLyThongTin + save_ThongTin gốc) ---- */
        function g(k) { var el = v(k); return el ? (el.value || '').trim() : ''; }
        var dangLuu = false;
        function luu() {
            if (dangLuu) return;
            if (!st.svId) { ui.toast('Chưa có người học — tìm sinh viên rồi bấm "Xem thông tin" hoặc "Kế thừa thông tin".', 'warn'); return; }
            var ns = ums.util.ngaySinh(g('NgaySinh'), g('ThangSinh'), g('NamSinh'));
            if (ns.loi) { ui.toast('Kiểm tra lại: ' + ns.loi, 'warn'); return; }
            var sua = !!st.id;
            var p = {
                action: 'TN_KetQua_CongNhan_VB/' + (sua ? 'CapNhat' : 'ThemMoi'),
                strId: st.id, strQLSV_NguoiHoc_Id: st.svId,
                strDaoTao_ChuongTrinh_Id: sua ? e(st.rec && st.rec.DAOTAO_TOCHUCCHUONGTRINH_ID) : g('_cthoc'),
                strXepLoai_Id: g('XepLoai'), strPhanLoai_Id: g('_pl'), strPhoi_MauPhoiIn_Id: g('MauPhoi'),
                strPhoi_MauPhoiIn_BanSao_Id: g('MauPhoi_BanSao'),
                strQLSV_NguoiHoc_MaSo: g('MaSo'), strQLSV_NguoiHoc_HoDem: g('HoDem'), strQLSV_NguoiHoc_HoDem_TA: g('HoDem_TA'),
                strQLSV_NguoiHoc_Ten: g('Ten'), strQLSV_NguoiHoc_Ten_TA: g('Ten_TA'),
                strQLSV_NguoiHoc_NgaySinh: g('NgaySinh'), strQLSV_NguoiHoc_NgaySinh_TA: g('NgaySinh_TA'),
                strQLSV_NguoiHoc_Thang: g('ThangSinh'), strQLSV_NguoiHoc_Thang_TA: g('ThangSinh_TA'),
                strQLSV_NguoiHoc_NamSinh: g('NamSinh'), strQLSV_NguoiHoc_NamSinh_TA: g('NamSinh_TA'),
                strQLSV_NguoiHoc_GioiTinh: g('GioiTinh'), strQLSV_NguoiHoc_GioiTinh_TA: g('GioiTinh_TA'),
                strQLSV_NguoiHoc_DanToc: g('DanToc'), strQLSV_NguoiHoc_DanToc_TA: g('DanToc_TA'),
                strQLSV_NguoiHoc_NoiSinh: g('NoiSinh'), strQLSV_NguoiHoc_NoiSinh_TA: g('NoiSinh_TA'),
                strQLSV_NguoiHoc_Nganh: g('NganhNghe'), strQLSV_NguoiHoc_Nganh_TA: g('NganhNghe_TA'),
                strQLSV_NguoiHoc_OngBa: g('OngBa'), strQLSV_NguoiHoc_OngBa_TA: g('OngBa_TA'),
                strNgayKyBang: g('NgayKyBang'), strSoQuyetDinh: g('SoQuyetDinh'), strNgayQuyetDinh: g('NgayQuyetDinh'),
                strSoHieuBang: g('SoHieuBang'), strSoVaoSoCapBang: g('SoVaoSo'), strDuongDanAnh: avatar.get(),
                strNgayCapBanGoc: g('NgayCapBanGoc'), strHoiDongThiChungChi: g('HoiDongChungChi')
            };
            dangLuu = true;
            ums.api.call(p).then(function () {
                ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                banSaoSo = 0;
                return banSao.save('x');
            }).then(function () {
                ft.close();
                tai();
            }).catch(loi('TN_KetQua_CongNhan_VB/' + (sua ? 'CapNhat' : 'ThemMoi')))
                .then(function () { dangLuu = false; });
        }
        function xoaMot() {
            if (!st.id) return;
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa', title: 'Xóa dữ liệu' }).then(function (ok) {
                if (!ok) return;
                ums.api.call({ action: 'TN_KetQua_CongNhan_VB/Xoa', strIds: st.id, strNguoiThucHien_Id: T.uid() }).then(function () {
                    ui.toast('Xóa thành công!', 'ok');
                    ft.close();
                    tai();
                }).catch(loi('TN_KetQua_CongNhan_VB/Xoa'));
            });
        }

        if (laSua) { st.svId = e(rec.QLSV_NGUOIHOC_ID); doDu(rec, false); }
        else {
            /* rewrite gốc: biểu mẫu trống, Phân loại lấy theo ô lọc, Bản sao một dòng trống */
            avatar.set('');
            banSao.clear();
            sanPL.then(function () {
                if (f('pl').value) { datO('_pl', f('pl').value); napXepLoai(); }
            });
        }
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('.ums-formtrang')) return;
        var s = ev.target.closest('[data-sua]');
        if (s && root.contains(s)) { var r = ds[Number(s.getAttribute('data-sua'))]; if (r) moBieuMau(r); return; }
        var it = ev.target.closest('[data-imp]');
        if (it && root.contains(it)) {
            var x = IMPORT[Number(it.getAttribute('data-imp'))];
            var dr = it.closest('.ums-drop'); dr.classList.remove('is-open'); dr.querySelector('.ums-drop__menu').hidden = true;
            ums.report.importChung(x[1], x[0], { onDone: function () { tai(); } });
            return;
        }
        var b = ev.target.closest('button[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai(1);
        else if (a === 'impmenu') {
            var d = b.closest('.ums-drop'), mo = !d.classList.contains('is-open');
            d.classList.toggle('is-open', mo); d.querySelector('.ums-drop__menu').hidden = !mo; b.setAttribute('aria-expanded', mo ? 'true' : 'false');
        }
        else if (a === 'them') moBieuMau(null);
        else if (a === 'ganso') ganSoVaoSo();
        else if (a === 'qd') taoQuyetDinh();
        else if (a === 'sohieu') sinhSo('SinhSoHieuVanBang', 'Sinh tự động số hiệu');
        else if (a === 'sovaoso') sinhSo('SinhSoVaoSo', 'Sinh tự động số vào sổ');
        else if (a === 'xacnhan') xacNhan();
        else if (a === 'xoanhieu') xoaNhieu();
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-ckall') || ev.target.closest('.ums-formtrang')) return;
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

    napQuyetDinh();
    tai(1);         // gốc: init gọi getList_QuanLyThongTin
})();
