/* =========================================================================
   ums.khtsn.kqImport(Q) — màn "Import dữ liệu trúng tuyển" trong hộp Kết quả đăng ký
   Bản gốc: #kqdk_import (startImport_TrungTuyen, _runImport, _buildImportPayload, _appendLog,
            renderImportTT_ErrorsPanel, exportImportTT_ErrorsToExcel, downloadMauImport_TrungTuyen,
            _diffCompareFileVsSystem, _diffExportCategory)
   ---------------------------------------------------------------------------
   Lời gọi: SV_Core_TS_HoSo_Import_MH / PKG_CORE_TS_HOSO_IMPORT.Them_HoSo_TS — MỖI dòng file MỘT lời gọi,
     5 luồng song song, Dừng được (chờ các lời gọi đang chạy xong). Tham số = đúng 77 tên param (T.IMPORT_COLS)
     + ngữ cảnh strHoSo_KH_TS_Id / strHoSo_KH_TS_Dot_Id / strDaoTao_CoSoDaoTao / dHoSo_Import_Row_No.
     Param đầu "d" = NUMBER: rỗng gửi null (tránh PLS-00306). Ngày sinh ISO → dd/mm/yyyy + tách ngày/tháng/năm.
   Tệp mẫu: tiêu đề là NHÃN TIẾNG VIỆT, lúc đọc đổi ngược về tên param (nhận cả tệp cũ tiêu đề = tên param).
   Đối chiếu file với hệ thống: khoá = CCCD chỉ giữ chữ số (< 9 số = không hợp lệ); 6 nhóm, mỗi nhóm xuất Excel.
   Khác gốc: tệp mẫu / tệp lỗi / nhóm đối chiếu xuất .xls (ums.ui.xuatXls — đọc lại được khi nhập);
     đọc tệp cần SheetJS — nạp từ CDN khi bấm (T.napXLSX). Tự chốt: Đối chiếu mà danh sách hệ thống chưa nạp
     → tự nạp LayDS_HoSo_TS theo kế hoạch + đợt rồi so (gốc bảo "chuyển sang tab Kết quả đăng ký" — màn này
     không có tab đó, người dùng phải đóng hộp mở lại).
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, T = ums.khtsn, P = T.phu;

    /* Bảng cột file — l = nhãn trên tệp, p = tên param, vd = ví dụ, an = không đưa vào tệp mẫu */
    T.IMPORT_COLS = [
        { l: 'Họ và tên', p: 'strCorePerson_HoTen', vd: 'Nguyễn Văn A' }, { l: 'Họ', p: 'strCorePerson_Ho', vd: 'Nguyễn' },
        { l: 'Tên đệm', p: 'strCorePerson_Dem', vd: 'Văn' }, { l: 'Tên', p: 'strCorePerson_Ten', vd: 'A' },
        { l: 'Ngày sinh (dd/mm/yyyy)', p: 'strCorePerson_NgaySinh', vd: '15/03/2007' },
        { l: 'Ngày sinh - Ngày (số)', p: 'dCorePerson_NgayS', vd: '', an: true }, { l: 'Ngày sinh - Tháng (số)', p: 'dCorePerson_ThangS', vd: '', an: true },
        { l: 'Ngày sinh - Năm (số)', p: 'dCorePerson_NamS', vd: '', an: true },
        { l: 'Giới tính (Nam/Nữ)', p: 'strCorePerson_GioiTinh_Ma', vd: 'Nam' }, { l: 'Dân tộc', p: 'strPersonProfile_DanToc_Ma', vd: 'Kinh' },
        { l: 'Tôn giáo', p: 'strPersonProfile_TonGiao_Ma', vd: 'Không' }, { l: 'Quốc tịch', p: 'strPersonProfile_QuocTich_Ma', vd: 'Việt Nam' },
        { l: 'Điện thoại', p: 'strPersonContact_DienThoai', vd: '0912345678' }, { l: 'Email', p: 'strPersonContact_Email', vd: 'nguyenvana@example.com' },
        { l: 'Số CCCD', p: 'strPersonIden_SoCCCD', vd: '012345678901' }, { l: 'Ngày cấp CCCD (dd/mm/yyyy)', p: 'strPersonIden_NgayCap', vd: '01/01/2022' },
        { l: 'Nơi cấp CCCD', p: 'strPersonIden_NoiCap', vd: 'Cục Cảnh sát QLHC về TTXH' },
        { l: 'Nơi sinh - Tỉnh/Thành phố', p: 'strPersonAddr_NS_Tinh_Ma', vd: 'Hà Nội' }, { l: 'Nơi sinh - Xã/Phường', p: 'strPersonAddr_NS_Xa_Ma', vd: 'Phường Dịch Vọng' },
        { l: 'Nơi sinh - Chi tiết', p: 'strPersonAddr_NoiSinh', vd: 'Số 12, Ngõ 45' },
        { l: 'Hộ khẩu - Tỉnh/Thành phố', p: 'strPersonAddr_HK_Tinh_Ma', vd: 'Hà Nội' }, { l: 'Hộ khẩu - Xã/Phường', p: 'strPersonAddr_HK_Xa_Ma', vd: 'Phường Dịch Vọng' },
        { l: 'Hộ khẩu - Số nhà/Thôn/Xóm', p: 'strPersonAddr_HK_SoNha', vd: 'Số 12, Ngõ 45, Thôn Đông' },
        { l: 'Trường lớp 12 - Tỉnh/Thành phố', p: 'strPersonEdu_Tinh_Ma', vd: 'Hà Nội' },
        { l: 'Trường lớp 12 - Mã/Tên trường', p: 'strPersonEdu_TruongMaTen', vd: '12345 - THPT Chu Văn An' },
        { l: 'Học lực lớp 12', p: 'strPersonEdu_HocLuc', vd: 'Giỏi' }, { l: 'Hạnh kiểm lớp 12', p: 'strPersonEdu_HanhKiem', vd: 'Tốt' },
        { l: 'Bố - Họ tên', p: 'strPersonFam_Bo_HoTen', vd: 'Nguyễn Văn B' }, { l: 'Bố - Năm sinh', p: 'dPersonFam_Bo_NamSinh', vd: 1975 },
        { l: 'Bố - Nơi ở', p: 'strPersonFam_Bo_NoiO', vd: 'Hà Nội' }, { l: 'Bố - Điện thoại', p: 'strPersonFam_Bo_SDT', vd: '0912111111' },
        { l: 'Mẹ - Họ tên', p: 'strPersonFam_Me_HoTen', vd: 'Trần Thị C' }, { l: 'Mẹ - Năm sinh', p: 'dPersonFam_Me_NamSinh', vd: 1978 },
        { l: 'Mẹ - Nơi ở', p: 'strPersonFam_Me_NoiO', vd: 'Hà Nội' }, { l: 'Mẹ - Điện thoại', p: 'strPersonFam_Me_SDT', vd: '0913222222' },
        { l: 'Phương thức tuyển sinh', p: 'strHoSo_KH_Dot_PT_Ma', vd: 'Xét điểm thi THPT' }, { l: 'Đối tượng tuyển sinh', p: 'strHoSo_DoiTuong_TS_Ma', vd: 'Thí sinh phổ thông' },
        { l: 'Đối tượng ưu tiên (nhiều giá trị cách nhau dấu phẩy)', p: 'strHoSo_DoiTuong_UT_Mas', vd: '' }, { l: 'Khu vực ưu tiên', p: 'strHoSo_KhuVuc_UT_Ma', vd: 'KV1' },
        { l: 'Tổ hợp môn', p: 'strXetTuyen_TohopMon_Ma', vd: 'A00' }, { l: 'Tên tổ hợp môn', p: 'strXetTuyen_TohopMon_Ten', vd: 'Toán - Lý - Hóa' },
        { l: 'Tổ hợp môn - Code', p: 'strXetTuyen_TohopMon_Code', vd: '', an: true }, { l: 'Điểm ưu tiên', p: 'dXetTuyen_DiemUuTien', vd: 1.0 },
        { l: 'Tổng điểm môn', p: 'dXetTuyen_DiemTongMon', vd: 24.5 }, { l: 'Tổng điểm xét tuyển', p: 'dXetTuyen_DiemTongXT', vd: 25.5 },
        { l: 'Điểm từng môn (Mã~Điểm~1~STT~Tên, cách nhau dấu |)', p: 'strXT_Mon_Data', vd: 'TOAN~8.0~1~1~Toan|LY~7.5~1~2~Vat ly|HOA~9.0~1~3~Hoa hoc' },
        { l: 'Mã hồ sơ', p: 'strHoSo_MaHoSo', vd: 'TS2026001234' }, { l: 'Số báo danh', p: 'strHoSo_SoBaoDanh', vd: 'SBD001234' },
        { l: 'Mã ngành trúng tuyển', p: 'strMaNganhTrungTuyen', vd: '7480201' }, { l: 'Mã chương trình đào tạo', p: 'strMaCTDT', vd: '' },
        { l: 'Số quyết định trúng tuyển', p: 'strKetQua_QuyetDinh_Ma', vd: '' }, { l: 'Mã số sinh viên (nếu có)', p: 'strMaSo', vd: '' },
        { l: 'Lớp dự kiến', p: 'strDaoTao_LopQuanLy_DuKien', vd: '' },
        { l: 'Cơ sở đào tạo (để trống = lấy theo lựa chọn ở form)', p: 'strDaoTao_CoSoDaoTao', vd: '' },
        { l: 'Số tiền nộp trước', p: 'strSoTienNopTruoc', vd: 5000000 }, { l: 'Mã đợt nhập học', p: 'strIntake_IntakeCode', vd: '' },
        { l: 'Loại đợt nhập học', p: 'strIntake_IntakeTypeCode', vd: '' }, { l: 'Mã lô import', p: 'strHoSo_Import_Batch_Ma', vd: '', an: true },
        { l: 'Hóa đơn - Đối tượng', p: 'strPersonInvoice_TypeLoai', vd: '' }, { l: 'Hóa đơn - Người mua', p: 'strPersonInvoice_NguoiMua', vd: 'Nguyễn Văn A' },
        { l: 'Hóa đơn - Tên đơn vị', p: 'strPersonInvoice_TenDonVi', vd: '' }, { l: 'Hóa đơn - Mã số thuế', p: 'strPersonInvoice_MST', vd: '' },
        { l: 'Hóa đơn - Mã quan hệ ngân sách', p: 'strPersonInvoice_MaQHNS', vd: '' }, { l: 'Hóa đơn - Điện thoại', p: 'strPersonInvoice_SDT', vd: '' },
        { l: 'Hóa đơn - Địa chỉ', p: 'strPersonInvoice_DiaChi', vd: '' }, { l: 'Hóa đơn - Email', p: 'strPersonInvoice_Email', vd: '' },
        { l: 'Ngân hàng - Loại tài khoản', p: 'strPersonBank_HinhThucTT', vd: '' }, { l: 'Ngân hàng - Tên ngân hàng', p: 'strPersonBank_TenNganHang', vd: 'Vietcombank' },
        { l: 'Ngân hàng - Số tài khoản', p: 'strPersonBank_SoTaiKhoan', vd: '' }, { l: 'Ngân hàng - Chủ tài khoản', p: 'strPersonBank_ChuTaiKhoan', vd: '' },
        { l: 'Ngân hàng - Ghi chú', p: 'strPersonBank_GhiChu', vd: '' },
        { l: 'Dữ liệu mở rộng - Cá nhân (JSON)', p: 'strExtra_Person_Data', vd: '', an: true },
        { l: 'Dữ liệu mở rộng - Hồ sơ (JSON)', p: 'strExtra_HoSo_Data', vd: '', an: true },
        { l: 'Dữ liệu mở rộng - Nhập học (JSON)', p: 'strExtra_Intake_Data', vd: '', an: true }
    ];
    /* Param lấy từ file (thứ tự như _buildImportPayload của gốc; ngữ cảnh không cho file ghi đè) */
    var TRUONG = ['strCorePerson_HoTen', 'strCorePerson_Ho', 'strCorePerson_Dem', 'strCorePerson_Ten', 'strCorePerson_NgaySinh', 'dCorePerson_NgayS',
        'dCorePerson_ThangS', 'dCorePerson_NamS', 'strCorePerson_GioiTinh_Ma', 'strMaSo', 'strDaoTao_LopQuanLy_DuKien', 'strPersonProfile_DanToc_Ma',
        'strPersonProfile_TonGiao_Ma', 'strPersonProfile_QuocTich_Ma', 'strPersonContact_DienThoai', 'strPersonContact_Email', 'strPersonIden_SoCCCD',
        'strPersonIden_NgayCap', 'strPersonIden_NoiCap', 'strPersonAddr_NS_Tinh_Ma', 'strPersonAddr_NS_Xa_Ma', 'strPersonAddr_NoiSinh',
        'strPersonAddr_HK_Tinh_Ma', 'strPersonAddr_HK_Xa_Ma', 'strPersonAddr_HK_SoNha', 'strPersonEdu_Tinh_Ma', 'strPersonEdu_TruongMaTen',
        'strPersonEdu_HocLuc', 'strPersonEdu_HanhKiem', 'strPersonFam_Bo_HoTen', 'dPersonFam_Bo_NamSinh', 'strPersonFam_Bo_NoiO', 'strPersonFam_Bo_SDT',
        'strPersonFam_Me_HoTen', 'dPersonFam_Me_NamSinh', 'strPersonFam_Me_NoiO', 'strPersonFam_Me_SDT', 'strHoSo_KH_Dot_PT_Ma', 'strHoSo_DoiTuong_TS_Ma',
        'strHoSo_DoiTuong_UT_Mas', 'strHoSo_KhuVuc_UT_Ma', 'strHoSo_MaHoSo', 'strHoSo_SoBaoDanh', 'strHoSo_Import_Batch_Ma', 'strMaNganhTrungTuyen',
        'strMaCTDT', 'strXetTuyen_TohopMon_Ma', 'strXetTuyen_TohopMon_Code', 'strXetTuyen_TohopMon_Ten', 'dXetTuyen_DiemUuTien', 'dXetTuyen_DiemTongMon',
        'dXetTuyen_DiemTongXT', 'strXT_Mon_Data', 'strKetQua_QuyetDinh_Ma', 'strIntake_IntakeCode', 'strIntake_IntakeTypeCode', 'strPersonInvoice_TypeLoai',
        'strPersonInvoice_NguoiMua', 'strPersonInvoice_TenDonVi', 'strPersonInvoice_MST', 'strPersonInvoice_MaQHNS', 'strPersonInvoice_SDT',
        'strPersonInvoice_DiaChi', 'strPersonInvoice_Email', 'strPersonBank_HinhThucTT', 'strPersonBank_TenNganHang', 'strPersonBank_SoTaiKhoan',
        'strPersonBank_ChuTaiKhoan', 'strPersonBank_GhiChu', 'strSoTienNopTruoc', 'strExtra_Person_Data', 'strExtra_HoSo_Data', 'strExtra_Intake_Data'];

    var mapNhan = null;
    function chuan(s) { return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' '); }
    T.chuanDongImport = function (row) {
        if (!mapNhan) { mapNhan = {}; T.IMPORT_COLS.forEach(function (c) { mapNhan[chuan(c.l)] = c.p; mapNhan[chuan(c.p)] = c.p; }); }
        var out = {};
        Object.keys(row).forEach(function (k) { out[mapNhan[chuan(k)] || k] = row[k]; });
        return out;
    };
    /** _buildImportPayload(row, rowNo, ctx) — ctx = { KH, Dot, CoSo } */
    T.goiImport = function (row, rowNo, ctx) {
        ctx = ctx || {};
        var o = { action: 'SV_Core_TS_HoSo_Import_MH/FSkkLB4JLhIuHhUS', func: 'PKG_CORE_TS_HOSO_IMPORT.Them_HoSo_TS',
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: 'THEM',
            strHoSo_KH_TS_Id: ctx.KH || T.S.khId || '', strHoSo_KH_TS_Dot_Id: ctx.Dot || T.S.dotKQ || '',
            strDaoTao_CoSoDaoTao: row && row.strDaoTao_CoSoDaoTao && String(row.strDaoTao_CoSoDaoTao).trim() ? String(row.strDaoTao_CoSoDaoTao).trim() : (ctx.CoSo || ''),
            dHoSo_Import_Row_No: rowNo, silent: true };
        TRUONG.forEach(function (f) {
            var v = row[f], so = f.charAt(0) === 'd';
            if (v === undefined || v === null || v === '') o[f] = so ? null : '';
            else if (so) { var n = Number(v); o[f] = isNaN(n) ? null : n; }
            else o[f] = typeof v === 'string' ? v : String(v);
        });
        var ns = o.strCorePerson_NgaySinh;
        if (typeof ns === 'string' && ns) {
            var mI = ns.match(/^(\d{4})-(\d{2})-(\d{2})/), mV = ns.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            var m = mI ? [mI[3], mI[2], mI[1]] : (mV ? [mV[1], mV[2], mV[3]] : null);
            if (mI) o.strCorePerson_NgaySinh = mI[3] + '/' + mI[2] + '/' + mI[1];
            if (m) {
                if (o.dCorePerson_NgayS == null) o.dCorePerson_NgayS = parseInt(m[0], 10);
                if (o.dCorePerson_ThangS == null) o.dCorePerson_ThangS = parseInt(m[1], 10);
                if (o.dCorePerson_NamS == null) o.dCorePerson_NamS = parseInt(m[2], 10);
            }
        }
        return o;
    };

    T.kqImport = function (Q) {
        var host = Q.v.import;
        host.innerHTML =
            '<div class="ums-legend">Import dữ liệu trúng tuyển</div>' +
            '<div class="ums-u-fz13 khtsn-note"><b>Cách dùng:</b> bấm <b>“Tải file mẫu”</b> → mở file, <b>giữ nguyên hàng 1 (tên cột tiếng Việt)</b>, ' +
                'xoá dòng ví dụ rồi điền dữ liệu từ hàng 2 trở đi, mỗi hàng là 1 hồ sơ trúng tuyển. <b>Giới tính</b> gõ Nam / Nữ; <b>Ngày sinh</b> và ' +
                '<b>Ngày cấp CCCD</b> dạng dd/mm/yyyy; Dân tộc / Tôn giáo / Quốc tịch / Tỉnh / Xã / Phương thức / Đối tượng… gõ thẳng <b>tên hoặc mã</b> — ' +
                'hệ thống tự tra cứu. Cột nào không có dữ liệu thì để trống. <b>Kế hoạch</b> và <b>Đợt</b> lấy theo lựa chọn ở form; <b>Cơ sở đào tạo</b> ' +
                'chọn dưới đây làm mặc định chung — trong file có điền thì giá trị trong file được ưu tiên.</div>' +
            '<div class="ums-grid ums-grid--3 ums-u-mt-4">' +
                ui.field('Đợt tuyển sinh', '<select class="ums-select" data-im="dot" data-ph="-- Chọn đợt --"><option value=""></option></select>', { required: true }) +
                ui.field('Cơ sở đào tạo (mặc định cho batch)', '<select class="ums-select" data-im="coso" data-ph="-- Chọn cơ sở đào tạo --"><option value=""></option></select>') +
                ui.field('Giới hạn số bản ghi (từ file)', '<div class="ums-radios">' +
                    '<label class="ums-check"><input type="radio" name="khtsnLim" value="custom" data-im="limc" checked> Chỉ nhập</label>' +
                    '<input class="ums-input khtsn-so" type="number" min="1" value="100" data-im="lim"> <span class="ums-u-fz13">dòng đầu</span>' +
                    '<label class="ums-check"><input type="radio" name="khtsnLim" value="all" data-im="lima"> <b>Toàn bộ</b></label></div>',
                    { hint: 'Dùng số nhỏ (10-100) để thử nhanh; chọn "Toàn bộ" khi import chính thức.' }) +
            '</div>' +
            '<div class="ums-row ums-u-mt-4">' +
                ui.btn('excel', { text: 'Tải file mẫu', attr: { 'data-im': 'mau' } }) +
                ui.file({ accept: '.xlsx,.xls,.csv', attr: { 'data-im': 'tep' } }) +
                ui.btn('importer', { text: 'Bắt đầu nhập', mod: 'primary', attr: { 'data-im': 'chay', disabled: 'disabled' } }) +
                ui.btn('del', { text: 'Dừng', attr: { 'data-im': 'dung', 'data-khong-chon': '1', hidden: 'hidden' } }) +
                '<span class="ums-u-fz13" data-im="info"></span>' +
            '</div>' +
            '<div class="ums-u-mt-4" data-im="tiendo" hidden>' +
                '<div class="ums-row ums-row--between ums-u-fz13"><span><b>Tiến trình:</b> <span data-im="dem">0 / 0</span></span>' +
                    '<span>Thành công: <b class="khtsn-ok" data-im="ok">0</b> — Lỗi: <b class="khtsn-bad" data-im="err">0</b> ' +
                    '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-danger" data-im="xemloi" data-khong-chon="1" hidden><i class="fa-light fa-eye"></i><span>Xem chi tiết lỗi</span></button></span></div>' +
                '<div class="ums-meter ums-u-mt-2"><div class="ums-meter__track"><div class="ums-meter__fill" data-im="bar" style="width:0"></div></div></div>' +
                '<div class="khtsn-kq__ketqua ums-u-mt-2" data-im="banner" hidden></div>' +
            '</div>' +
            '<div data-im="loiwrap" hidden class="ums-u-mt-4">' + ums.pat.panel({ title: 'Chi tiết lỗi', icon: 'fa-triangle-exclamation', count: 'imn', flush: true, zone: 'imloi',
                tools: ui.btn('excel', { text: 'Tải Excel lỗi', attr: { 'data-im': 'xuatloi' } }) + ui.btn('close', { text: 'Ẩn', attr: { 'data-im': 'anloi' } }) }) + '</div>' +
            '<div class="ums-u-mt-4">' + ums.pat.panel({ title: 'Đối chiếu file Excel với danh sách hệ thống', icon: 'fa-magnifying-glass-chart',
                body: '<details class="ums-u-fz13"><summary>Hướng dẫn</summary><div class="ums-u-muted ums-u-mt-2"><b>1.</b> Chọn file Excel bạn đã import (có cột Số CCCD). ' +
                    '<b>2.</b> Bấm "So sánh" — hệ thống dùng CCCD để đối chiếu với danh sách "Kết quả đăng ký" hiện tại (theo kế hoạch / đợt đang chọn). ' +
                    '<b>3.</b> Xuất Excel theo nhóm — quan tâm nhất: <b>Chỉ trong file</b> (dòng chưa vào hệ thống, xuất để import lại). ' +
                    'CCCD được chuẩn hoá (chỉ giữ chữ số).</div></details>' +
                    '<div class="ums-row ums-u-mt-2">' + ui.file({ accept: '.xlsx,.xls,.csv', attr: { 'data-im': 'tepdc' } }) +
                    ui.btn('search', { text: 'So sánh', attr: { 'data-im': 'sosanh', disabled: 'disabled' } }) + '<span class="ums-u-fz13" data-im="infodc"></span></div>' +
                    '<div data-im="kqdc" class="ums-u-mt-2"></div>' }) + '</div>' +
            '<div class="ums-u-mt-4">' + ums.pat.panel({ title: 'Nhật ký nhập', icon: 'fa-list', flush: true, zone: 'imlog' }) + '</div>';
        var q = function (k) { return host.querySelector('[data-im="' + k + '"]'); };
        var dung = false, loi = [], log = [], diff = null;
        ui.enhance(host);

        T.dsDot(Q.khId).then(function (rows) {
            T.fill(q('dot'), rows, { name: T.nhanDot, giu: T.S.dotKQ });
        });
        T.dsCoSoDaoTao().then(function (rows) { ums.pat.fill(q('coso'), rows, { name: T.nhanCSDT }); });
        veLog(); veLoi();

        function veLog() {
            ui.table({ el: host.querySelector('[data-z="imlog"]'), rows: log, stt: false, empty: 'Chưa nhập dòng nào',
                columns: [
                    { title: 'Hàng', cls: 'is-center', width: '60px', prop: 'row' },
                    { title: 'Mã hồ sơ / SBD / CCCD', render: function (x) { return ui.esc(x.maHS) + (x.cccd ? '<div class="ums-u-faint ums-u-fz12">CCCD: ' + ui.esc(x.cccd) + '</div>' : ''); } },
                    { title: 'Họ tên', prop: 'hoTen' },
                    { title: 'Trạng thái', cls: 'is-center', width: '100px', render: function (x) { return x.kind === 'ok' ? ui.badge('Thành công', 'ok') : ui.badge(x.kind === 'http' ? 'HTTP' : 'Lỗi', 'bad'); } },
                    { title: 'Chi tiết', prop: 'msg' }
                ] });
        }
        function veLoi() {
            host.querySelector('[data-z="imn"]').textContent = '(' + loi.length + ')';
            ui.table({ el: host.querySelector('[data-z="imloi"]'), rows: loi, stt: false, empty: 'Chưa có lỗi nào',
                columns: [
                    { title: 'Hàng', cls: 'is-center', width: '60px', prop: 'row' },
                    { title: 'Mã HS/SBD/CCCD', render: function (x) { return ui.esc(x.maHS) + (x.cccd ? '<div class="ums-u-faint ums-u-fz12">CCCD: ' + ui.esc(x.cccd) + '</div>' : ''); } },
                    { title: 'Họ tên', prop: 'hoTen' },
                    { title: 'Loại', cls: 'is-center', width: '80px', render: function (x) { return ui.badge(x.type, x.type === 'HTTP' ? 'warn' : 'bad'); } },
                    { title: 'Chi tiết lỗi', prop: 'msg' }
                ] });
        }
        function ghiLog(rowNo, row, kind, msg) {
            var x = { row: rowNo, maHS: row.strHoSo_MaHoSo || row.strHoSo_SoBaoDanh || '', cccd: row.strPersonIden_SoCCCD || '',
                hoTen: row.strCorePerson_HoTen || '', kind: kind, msg: msg || '' };
            log.unshift(x);
            if (kind === 'err' || kind === 'http') {
                loi.push({ row: rowNo, maHS: x.maHS, cccd: x.cccd, hoTen: x.hoTen, type: kind === 'http' ? 'HTTP' : 'BE', msg: msg || '', raw: row });
                q('xemloi').hidden = false;
            }
        }

        host.addEventListener('change', function (ev) {
            var k = ev.target.getAttribute && ev.target.getAttribute('data-im');
            if (k === 'tep') {
                var f = ev.target.files && ev.target.files[0];
                q('info').textContent = f ? 'Đã chọn: ' + f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)' : '';
                q('chay').disabled = !f; log = []; veLog();
            } else if (k === 'tepdc') {
                var g = ev.target.files && ev.target.files[0];
                q('infodc').textContent = g ? 'Đã chọn: ' + g.name + ' (' + (g.size / 1024).toFixed(1) + ' KB)' : '';
                q('sosanh').disabled = !g;
            }
        });
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-im]');
            if (!b) return;
            var k = b.getAttribute('data-im');
            if (k === 'mau') taiMau();
            else if (k === 'chay') chay();
            else if (k === 'dung') dung = true;
            else if (k === 'xemloi') { veLoi(); q('loiwrap').hidden = false; }
            else if (k === 'anloi') q('loiwrap').hidden = true;
            else if (k === 'xuatloi') xuatLoi();
            else if (k === 'sosanh') soSanh();
            else if (b.hasAttribute('data-cat')) xuatNhom(b.getAttribute('data-cat'));
        });

        function taiMau() {
            var cols = T.IMPORT_COLS.filter(function (c) { return !c.an; });
            T.xuatAoa('Mau_Import_TrungTuyen_' + T.dauGio().slice(0, 8) + '.xls',
                [cols.map(function (c) { return c.l; }), cols.map(function (c) { return c.vd === undefined ? '' : c.vd; })]);
        }
        function chay() {
            if (!Q.khId) { ui.toast('Chưa xác định kế hoạch tuyển sinh (mở lại từ danh sách kế hoạch/đợt)', 'warn'); return; }
            var dotId = q('dot').value || T.S.dotKQ;
            if (!dotId) { ui.toast('Vui lòng chọn Đợt tuyển sinh trước khi import', 'warn'); return; }
            T.S.dotKQ = dotId;
            var f = q('tep').files && q('tep').files[0];
            if (!f) { ui.toast('Vui lòng chọn file', 'warn'); return; }
            T.docTep(f).then(function (rows) {
                if (!rows.length) { ui.toast('File không có dữ liệu (hàng 1 phải là header)', 'warn'); return; }
                if (q('limc').checked) { var n = parseInt(q('lim').value, 10); if (isNaN(n) || n < 1) n = 100; rows = rows.slice(0, n); }
                chayDong(rows, dotId, q('coso').value || '');
            }).catch(function (err) { ui.toast(err.message, 'bad'); });
        }
        function chayDong(rows, dotId, coSo) {
            dung = false; loi = []; log = [];
            var tong = rows.length, xong = 0, ok = 0, er = 0, i = 0, dangChay = 0;
            q('chay').disabled = true; q('dung').hidden = false; q('tep').disabled = true;
            q('tiendo').hidden = false; q('banner').hidden = true; q('loiwrap').hidden = true; q('xemloi').hidden = true;
            var ve = function () {
                var pct = tong ? Math.round(xong * 100 / tong) : 0;
                q('bar').style.width = pct + '%'; q('dem').textContent = xong + ' / ' + tong;
                q('ok').textContent = ok; q('err').textContent = er;
            };
            ve(); veLog();
            var ket = function () {
                q('chay').disabled = false; q('dung').hidden = true; q('tep').disabled = false;
                var nhan = dung ? 'Đã dừng' : (er === 0 ? 'Hoàn tất — tất cả thành công' : (ok === 0 ? 'Hoàn tất — TẤT CẢ LỖI' : 'Hoàn tất — có lỗi'));
                var b = q('banner');
                b.hidden = false;
                b.className = 'khtsn-kq__ketqua ums-u-mt-2 is-' + (dung ? 'warn' : (er === 0 ? 'ok' : (ok === 0 ? 'bad' : 'warn')));
                b.innerHTML = '<b>' + nhan + ':</b> đã xử lý <b>' + xong + '/' + tong + '</b> (OK: ' + ok + ', Lỗi: ' + er + ')';
                veLog();
                if (er) { veLoi(); q('loiwrap').hidden = false; }
                if (ok) T.kqNapLai();
            };
            (function tiep() {
                while (!dung && dangChay < 5 && i < tong) {
                    var rowNo = i + 2, row = T.chuanDongImport(rows[i++]);
                    dangChay++;
                    (function (rowNo, row) {
                        ums.api.call(T.goiImport(row, rowNo, { Dot: dotId, CoSo: coSo })).then(function () {
                            ok++; ghiLog(rowNo, row, 'ok', 'Thành công');
                        }, function (err) {
                            er++; ghiLog(rowNo, row, err.status ? 'err' : (err.mang ? 'http' : 'err'), err.message || 'Lỗi không xác định');
                        }).then(function () {
                            dangChay--; xong++; ve();
                            if (xong % 20 === 0) veLog();
                            if ((xong >= tong) || (dung && dangChay === 0)) ket(); else tiep();
                        });
                    })(rowNo, row);
                }
                if (dung && dangChay === 0) ket();
            })();
        }
        function xuatLoi() {
            if (!loi.length) { ui.toast('Chưa có lỗi nào để xuất.', 'warn'); return; }
            T.xuatBanGhi('LoiImportExcel_' + loi.length + 'loi_' + T.dauGio() + '.xls', loi.map(function (x) {
                var o = { 'Hàng Excel': x.row, 'Mã HS/SBD': x.maHS, 'Họ tên': x.hoTen, 'Loại lỗi': x.type, 'Chi tiết lỗi': x.msg };
                Object.keys(x.raw || {}).forEach(function (k) { o[k] = x.raw[k]; });
                return o;
            }));
        }

        /* ---------- Đối chiếu file với hệ thống ---------- */
        function soCCCD(v) {
            if (v == null) return { key: '', hong: false };
            var s = String(v).trim(), hong = /[eE][+\-]?\d+$/.test(s);
            s = s.replace(/[^\d]/g, '');
            return { key: s.length < 9 ? '' : s, hong: hong };
        }
        function soSanh() {
            var f = q('tepdc').files && q('tepdc').files[0];
            if (!f) { ui.toast('Vui lòng chọn file để so sánh', 'warn'); return; }
            var heThong = Q.rows && Q.rows.length ? Promise.resolve(Q.rows)
                : ums.api.call(P.dsHoSoTS({ kh: Q.khId, dot: q('dot').value || T.S.dotKQ, lopDK: true })).then(T.rows);
            Promise.all([T.docTep(f), heThong]).then(function (x) {
                var fileRows = x[0].map(T.chuanDongImport), sys = x[1] || [];
                if (!fileRows.length) { ui.toast('File không có dữ liệu (hàng 1 phải là header)', 'warn'); return; }
                if (!sys.length) { ui.toast('Danh sách hệ thống rỗng — không có gì để đối chiếu', 'warn'); return; }
                var sm = {}, fm = {}, noCCCD = [];
                sys.forEach(function (r) { var k = soCCCD(r.PERSONIDEN_SOCCCD).key; if (k) (sm[k] = sm[k] || []).push(r); });
                fileRows.forEach(function (r) {
                    var n = soCCCD(r.strPersonIden_SoCCCD);
                    if (!n.key) { if (n.hong) r.__diff_note = 'CCCD bị Excel format thành scientific notation'; noCCCD.push(r); return; }
                    (fm[n.key] = fm[n.key] || []).push(r);
                });
                var both = [], onlyFile = [], dupFile = [], onlySys = [], dupSys = [];
                Object.keys(fm).forEach(function (k) { if (fm[k].length > 1) dupFile = dupFile.concat(fm[k]); if (sm[k]) both = both.concat(fm[k]); else onlyFile = onlyFile.concat(fm[k]); });
                Object.keys(sm).forEach(function (k) { if (sm[k].length > 1) dupSys = dupSys.concat(sm[k]); if (!fm[k]) onlySys = onlySys.concat(sm[k]); });
                diff = { both: both, onlyFile: onlyFile, onlySys: onlySys, noCCCD: noCCCD, dupFile: dupFile, dupSys: dupSys };
                var NHOM = [['both', 'Có trong cả hai (import thành công)', 'ok'], ['onlyFile', 'Chỉ trong file, không có trong hệ thống ★ (thiếu import — xuất để nhập lại)', 'bad'],
                    ['onlySys', 'Chỉ trong hệ thống, không có trong file (khai tay / batch khác)', 'info'], ['noCCCD', 'Không có CCCD trong file (không đối chiếu được — gồm cả CCCD < 9 số / sai format)', 'warn'],
                    ['dupFile', 'CCCD trùng trong file (cùng 1 CCCD ở nhiều dòng)', 'warn'], ['dupSys', 'CCCD trùng trong hệ thống', 'warn']];
                q('kqdc').innerHTML = '<div class="ums-u-fz13 ums-u-mb-2"><b>File:</b> ' + fileRows.length + ' dòng · <b>Hệ thống:</b> ' + sys.length + ' dòng · Khoá: <b>CCCD</b></div><div data-im="bangdc"></div>';
                ui.table({ el: q('bangdc'), rows: NHOM, stt: false, columns: [
                    { title: 'Nhóm', render: function (n) { return ui.badge(String(diff[n[0]].length), n[2]) + ' ' + ui.esc(n[1]); } },
                    { title: 'Xuất Excel', cls: 'is-center', width: '130px', render: function (n) {
                        return ui.btn('excel', { text: 'Xuất', cls: 'ums-btn--sm', attr: diff[n[0]].length ? { 'data-cat': n[0], 'data-im': 'cat' } : { 'data-cat': n[0], 'data-im': 'cat', disabled: 'disabled' } }); } }
                ] });
            }).catch(function (err) { ui.toast(err.message || 'Lỗi đọc file', 'bad'); });
        }
        function xuatNhom(cat) {
            var rows = diff && diff[cat] || [];
            if (!rows.length) { ui.toast('Nhóm này không có bản ghi', 'warn'); return; }
            var ten = { both: 'Co_Ca_Hai', onlyFile: 'Chi_Trong_File', onlySys: 'Chi_Trong_HeThong', noCCCD: 'Khong_Co_CCCD', dupFile: 'Trung_Trong_File', dupSys: 'Trung_Trong_HeThong' }[cat];
            T.xuatBanGhi('DoiChieu_' + ten + '_' + rows.length + 'rec_' + T.dauGio().slice(0, 13) + '.xls', rows);
        }
        return { host: host };
    };
})();
