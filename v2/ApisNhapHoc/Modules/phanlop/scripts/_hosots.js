/* =========================================================================
   Khung "Hồ sơ tuyển sinh" dùng chung hai phân hệ — ums.hoSoTS.man(root, o)
   ---------------------------------------------------------------------------
   Bản GỐC là ApisQuanlyTuyenSinh/Modules/tuyensinh/script/hosotuyensinh.js ("Nhập hồ sơ tuyển sinh");
   ApisNhapHoc/Modules/phanlop/scripts/hosotuyensinh.js ("Chuyển lớp - sẽ chuyển cả kế hoạch tuyển sinh") là bản
   chép của nó, bỏ lớp 11 / kế thừa / báo cáo và đổi "Chuyển nguyện vọng" thành "Chuyển lớp". Hai bản cùng thực
   thể TS_HoSoDuTuyen, cùng biểu mẫu — nên dựng MỘT khung, khác nhau bằng cờ:

       ums.hoSoTS.man(root, {})             Nhập học (mặc định — giữ nguyên hành vi đã chuyển 27/9)
       ums.hoSoTS.man(root, { ts: true })   Tuyển sinh: thêm những phần bản gốc có mà bản Nhập học bỏ

   Bố cục bản gốc MỘT CỘT: thanh lọc (Năm* → Kế hoạch → Hệ → Khóa → Lớp · Đối tác · Tỉnh → Huyện → Xã · Ngành nghề ·
   Trường học · từ khoá · Tìm kiếm · Xuất báo cáo* / Import*) → "Danh sách hồ sơ thí sinh (n)". Sửa → biểu mẫu "Hồ sơ
   tuyển sinh" thay chỗ danh sách (zone_input): thông tin cơ bản (ảnh…), Trường THPT đã học (lưới dòng), Điểm thi vào
   lớp 9 / lớp 10 / lớp 11* / lớp 12, Điểm thi THPT*, Điểm thi cuối kỳ*, Hồ sơ đính kèm, Hồ sơ giấy tờ (lưới dòng),
   Tình trạng hồ sơ, Ghi chú, Diện cộng điểm ưu tiên*.            (* = chỉ bản Tuyển sinh)

   ---------------------------------------------------------------------------
   Lời gọi CHUNG (chép nguyên, GET/POST như gốc):
     TS_DoiTacTuyenSinh/LayDanhSach      GET  strTuKhoa '', strNguoiTao_Id, trang 1/1000000000 → THONGTINHIENTHI
     TS_HeDaoTao/LayDanhSach             GET  strChucNang_Id, strTS_KeHoachTuyenSinh_Id, strNguoiThucHien_Id → TENHEDAOTAO
     TS_KhoaDaoTao/LayDanhSach           GET  strChucNang_Id, strNguoiThucHien_Id, strDaoTao_HeDaoTao_Id, strTS_KeHoachTuyenSinh_Id → TENKHOA
     danh mục TUYENSINH.NGANHNGHE / TRUONGHOC / HOCLUC / HANHKIEM / TINHTRANGHOSO / LOAIHOSO, NS.GITI / NS.DATO / NS.TOGI,
       CHUN.DMTT (edu.extend.genDropTinhThanh → ums.pat.dmTinhThanh; ô Nơi sinh / Quê quán / Hộ khẩu → ums.pat.diaChi)
     TS_HoSoDuTuyen/LayDanhSach          GET  strTuKhoa, strTS_KeHoachTuyenSinh_Id, strTS_DoiTacTuyenSinh_Id, strDaoTao_HeDaoTao_Id,
                                              strDaoTao_KhoaDaoTao_Id, strThuongTru_TinhThanh_Id/_QuanHuyen_Id/_PhuongXa_Id,
                                              strNganhNghe_Id, strTruongPTTH_Id, strDaoTao_LopQuanLy_Id, (TS: strNam),
                                              strTS_XacNhanDuyetHoSo_Id '', strTS_XacNhanDuyetTT_Id '', strNguoiTao_Id, trang (máy chủ)
     TS_HoSoDuTuyen/CapNhat (ThemMoi khi chưa có id)  POST  đủ 43 tham số của save_HoSo (strMaSo '', strCMT_NgayCap '',
                                              strCMT_NoiCap '', strTTCN_Email ''; kế hoạch / hệ / khoá lấy từ THANH LỌC như gốc)
     TS_HoSoDuTuyen_Lop9 | Lop12 /LayDanhSach GET · /ThemMoi | /CapNhat POST (strNamTN, strDIEMTBCN, strHocLuc_Id,
                                              strHanhKiem_Id, strGhiChu '' — gốc đọc ô txtAAAA không tồn tại)
     TS_HoSoDuTuyen_Lop10/LayDanhSach GET · /ThemMoi | /CapNhat POST (dDiemUuTien, dTongDiem, dMon1..5, strMon1..5_Ten)
     TS_HoSoDuTuyen_Truong/LayDanhSach GET (trang 1/10) · /ThemMoi POST (cả khi sửa — CapNhat bị chú thích ở gốc) · /Xoa POST
     TS_HoSo/LayDanhSach GET (strTS_KeHoachTuyenSinh_Id = kế hoạch thanh lọc) · /ThemMoi POST (dSoLuongCanNop '') · /Xoa POST
     tệp đính kèm: ums.files (TS_Files) · ảnh: ums.files.avatar (getImage — chép ảnh tạm sang tên chính thức TRƯỚC khi lưu)

   Chỉ bản NHẬP HỌC:
     TS_KeHoach_NguoiDung/LayDanhSach    GET  strTuKhoa '', strNguoiDung_Id, trang 1/1000000000 → TEN
     KHCT_LopQuanLy/LayDanhSach          GET  strDaoTao_KhoaDaoTao_Id (còn lại ''), trang 1/100000 → TEN (hộp: "TEN(SOLUONGTHUCTE)")
     TS_HoSoDuTuyen/ChuyenLop            POST mỗi hồ sơ đánh dấu một lời gọi: strChucNang_Id, strNguoiThucHien_Id,
                                              strTS_KeHoachTuyenSinh_Id, strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id,
                                              strDaoTao_LopQuanLy_Id, strLyDoChuyen, strTS_HoSoDuTuyen_Id
     TS_HoSoDuTuyen/LayDSLichSuChuyenLop GET  strTS_HoSoDuTuyen_Id
     Nút "Thêm mới" / "Xóa" đầu danh sách bị chú thích trong html gốc → màn chỉ SỬA (canAdd: false).

   Chỉ bản TUYỂN SINH (o.ts):
     TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach  GET strNguoiThucHien_Id → NAM
     TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung     GET strTuKhoa '', strNguoiDung_Id, strNam, trang 1/100000 → TEN
     edu.system.getList_LopQuanLy (Corei) = ums.nhPhanLop.lopQuanLy — Hệ + Khóa của thanh lọc → TEN ("Tất cả lớp")
     TS_HoSoDuTuyen/Xoa                  POST strIds (các id đánh dấu nối dấu phẩy), strChucNang_Id, strNguoiThucHien_Id
     TS_HoSoDuTuyen/ChuyenNguyenVong     POST mỗi hồ sơ một lời gọi: strChucNang_Id, strNguoiThucHien_Id,
                                              strTS_KeHoachTuyenSinh_Id, strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strTS_HoSoDuTuyen_Id
     TS_HoSoDuTuyen/Them_TS_HoSoDuTuyen_KeThua  POST (async:false ở gốc) mỗi người học một lời gọi: strChucNang_Id,
                                              strTS_HoSoDuTuyen_Id = QLSV_NGUOIHOC_ID, strNganhNghe_Id / strTS_KeHoachTuyenSinh_Id /
                                              strDaoTao_HeDaoTao_Id / strDaoTao_KhoaDaoTao_Id / strTS_DoiTacTuyenSinh_Id từ THANH LỌC,
                                              strNguoiThucHien_Id — hộp chọn = ums.pat.pickSinhVienNganh (genModal_SinhVien)
     TS_HoSoDuTuyen_Lop9  thêm strXepLoaiTN_Id (TS.XEPLOAITN), strTinhThanh_Id, strQuanHuyen_Id (ô Xã hiện mà không gửi — như gốc)
     TS_HoSoDuTuyen_Lop10 thêm strHoiDongThi, dDiemTNCN, strSBD
     TS_HoSoDuTuyen_Lop11/LayDanhSach GET · /ThemMoi | /CapNhat POST (như lớp 9, có xếp loại + tỉnh/huyện)
     TS_HoSoDuTuyen_Lop12 thêm dMon1..5/strMon1..5_Ten (Điểm thi THPT), dTongDiem, strMaToHop, dDiemXetTuyen,
                                              dDiemTrungTuyenNganh, strXepLoaiTN_Id '' (gốc đọc dropAAAA), dDiemUuTienKhuVuc,
                                              dDiemUuTienDoiTuong, dMon1..3HocTap, strMon1..3HocTap_Ten (Điểm thi cuối kỳ)
     TS_DTUuTien_NguoiHoc/LayDanhSach GET · /ThemMoi POST · /Xoa POST (strIds) — lưới TS.DOITUONGUUTIEN, đánh dấu = có diện
     Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_TuyenSinh" + vùng _Import) — tham số = tham số danh sách

   Khác gốc / tự chốt (ghi báo cáo):
     · Lưu xong về danh sách (gốc ở lại biểu mẫu rồi nạp lại chi tiết sau 1 giây); các bản ghi con lưu SAU bản ghi chính
       như gốc, chỉ báo lỗi (gốc bật một thông báo "thành công" cho TỪNG lời gọi con).
     · Họ đệm / Tên / Ngành nghề mang dấu (*) ở gốc nhưng gốc không kiểm → nay bắt buộc.
     · NH — Hộp Chuyển lớp: kiểm đã đánh dấu NGAY khi mở hộp; bắt buộc chọn lớp; gửi hàng loạt có tiến độ rồi nạp lại.
       NH — Nút "Xóa" chân biểu mẫu: gốc không gắn xử lý → giữ nút, khoá. Lưới giấy tờ: "Thêm dòng mới" bị chú thích → ẩn.
     · TS — Diện ưu tiên: gốc thêm/xoá bằng me.strHoSoDuTuyen_Id — lúc THÊM MỚI hồ sơ biến này rỗng nên diện ưu tiên của
       hồ sơ mới chưa bao giờ lưu được → nay dùng id máy chủ trả.
     · TS — Lớp 10 đọc "Điểm TB cả năm" từ cột DiemTNCN (gốc viết lẫn hoa thường, Oracle trả HOA) → đọc DIEMTNCN, lùi về DiemTNCN.
     · TS — "Điểm thi cuối kỳ": gốc đổ TÊN môn từ MON1_TEN (tên môn của Điểm thi THPT) rồi lưu ngược vào strMon1HocTap_Ten →
       mở lại là tên môn cuối kỳ bị ghi đè. Nay đọc MON1HOCTAP_TEN (cột đoán theo tên tham số), không có mới lùi về MON1_TEN.
     · TS — Lớp 9/10/11/12 lấy dòng ĐẦU (gốc TS dtResult[0]); NH giữ dòng CUỐI như gốc NH.
     · TS — Năm → Kế hoạch → Hệ → Khóa nối tầng theo luật cha → con (gốc nạp sẵn mọi kế hoạch khi chưa chọn năm); Lớp khoá tới
       khi chọn Hệ (gốc nạp lớp khi chọn Hệ / Khóa). Đổi Năm là nạp lại danh sách (gốc chỉ nạp lại ô Kế hoạch dù strNam là
       tham số lọc).
     · TS — "Thêm mới từ Đào Tạo": gốc lưu NGAY mỗi lần bấm "Chọn" một dòng → nay chọn nhiều rồi lưu một lượt (luật "chọn nhiều
       = ô đánh dấu"); bắt buộc chọn Kế hoạch trước (hồ sơ kế thừa lấy kế hoạch / hệ / khoá từ thanh lọc); lưu xong nạp lại.
     · TS — Hộp Chuyển nguyện vọng: kiểm đánh dấu NGAY khi mở hộp, bắt buộc Kế hoạch; gửi có tiến độ rồi nạp lại.
   Cặp cha → con: Kế hoạch → Hệ → Khóa (→ Lớp), Tỉnh → Huyện → Xã (thanh lọc, biểu mẫu lớp 9 / 11) — pat.chain.
   Nợ tầng chung: cột ô đánh dấu + "chọn tất cả" của ui.table (dùng P.cotChon của module); ums.crud chưa có móc "trước khi
   Thêm" và chỗ gắn nút báo cáo trong thanh lọc (chèn tay vào .ums-filter).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;

    function man(root, o) {
        o = o || {};
        var ts = !!o.ts;
        var P = ums.nhPhanLop, e = P.e;
        function uid() { return ums.session.userId; }
        function cn() { return ums.state.chucNangId; }

        var srcKH = { call: { action: 'TS_KeHoach_NguoiDung/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiDung_Id: uid(),
            pageIndex: 1, pageSize: 1000000000 }, name: 'TEN' };
        var srcDoiTac = { call: { action: 'TS_DoiTacTuyenSinh/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: uid(),
            pageIndex: 1, pageSize: 1000000000 }, name: 'THONGTINHIENTHI' };
        var srcNam = { call: { action: 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach', method: 'GET', strNguoiThucHien_Id: uid() },
            id: 'NAM', name: 'NAM' };
        /* Kế hoạch theo năm (bản TS) */
        function keHoachTS(nam) {
            return P.rows({ action: 'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung', method: 'GET', strTuKhoa: '',
                strNguoiDung_Id: uid(), strNam: nam || '', pageIndex: 1, pageSize: 100000 });
        }

        var st = { idLuu: '', lop9: '', lop10: '', lop11: '', lop12: '' };

        function t(key, label, extra) { var x = { key: key, label: label, col: '' }; Object.keys(extra || {}).forEach(function (k) { x[k] = extra[k]; }); return x; }
        function s(key, label, dm, ph) { return t(key, label, { type: 'select', source: dm ? { dm: dm } : undefined, placeholder: ph }); }

        var fields = [
            { type: 'legend', label: 'Thông tin cơ bản' },
            { type: 'avatar', key: 'strAnhCaNhan', col: 'ANHCANHAN', label: 'Ảnh' },
            { type: 'static', key: '_maSo', col: 'MASO', label: 'Mã số dự tuyển' },
            { key: 'strHoDem', col: 'HODEM', label: 'Họ đệm', required: true },
            { key: 'strTen', col: 'TEN', label: 'Tên', required: true },
            { key: 'strNgaySinh', col: 'NGAYSINH', label: 'Ngày sinh', placeholder: 'Ngày' },
            { key: 'strThangSinh', col: 'THANGSINH', label: 'Tháng sinh', placeholder: 'Tháng' },
            { key: 'strNamSinh', col: 'NAMSINH', label: 'Năm sinh', placeholder: 'Năm' },
            { key: 'strGioiTinh_Id', col: 'GIOITINH_ID', label: 'Giới tính', type: 'select', source: { dm: 'NS.GITI' }, placeholder: 'Chọn giới tính' },
            { key: 'strDanToc_Id', col: 'DANTOC_ID', label: 'Dân tộc', type: 'select', source: { dm: 'NS.DATO' }, placeholder: 'Chọn dân tộc' },
            { key: 'strTonGiao_Id', col: 'TONGIAO_ID', label: 'Tôn giáo', type: 'select', source: { dm: 'NS.TOGI' }, placeholder: 'Chọn tôn giáo' },
            { key: 'strTTCN_DienThoai', col: 'TTCN_DIENTHOAI', label: 'Số điện thoại' },
            { key: 'strCMT_So', col: 'CMT_SO', label: 'Số CMND/CCCD' },
            { key: 'strDoan_NgayVao', col: 'DOAN_NGAYVAO', label: 'Ngày vào Đoàn', type: 'date' },
            { key: 'strDang_NgayVao', col: 'DANG_NGAYVAO', label: 'Ngày vào Đảng', type: 'date' },
            t('_noiSinh', 'Nơi sinh', { dai: true }),
            t('_queQuan', 'Quê quán', { dai: true }),
            t('_thuongTru', 'Hộ khẩu thường trú', { dai: true }),
            { key: 'strNganhNghe_Id', col: 'NGANHNGHE_ID', label: 'Ngành nghề', type: 'select', required: true,
              source: { dm: 'TUYENSINH.NGANHNGHE' }, placeholder: 'Chọn ngành nghề' },
            { key: 'strNganh_Nghe_Truoc', col: 'NGANH_NGHE_TRUOC', label: 'Ngành nghề đã học' },
            { key: 'strTS_DoiTacTuyenSinh_id', col: 'TS_DOITACTUYENSINH_ID', label: 'Nguồn tuyển sinh', type: 'select',
              source: srcDoiTac, placeholder: 'Chọn nguồn tuyển sinh' },
            { key: 'strTS_DoiTacTuyenSinh_Khac', col: 'TS_DOITACTUYENSINH_KHAC', label: 'Nguồn tuyển sinh khác' },
            { key: 'strGiaDinh_HoTenBo', col: 'GIADINH_HOTENBO', label: 'Họ tên bố' },
            { key: 'strGiaDinh_SoDienThoaiBo', col: 'GIADINH_SODIENTHOAIBO', label: 'SĐT bố' },
            { key: 'strGiaDinh_HoTenMe', col: 'GIADINH_HOTENME', label: 'Họ tên mẹ' },
            { key: 'strGiaDinh_SoDienThoaiMe', col: 'GIADINH_SODIENTHOAIME', label: 'SĐT mẹ' },
            { key: 'strGiaDinh_NguoiBaoTin', col: 'GIADINH_NGUOIBAOTIN', label: 'Người báo tin' },
            { key: 'strGiaDinh_DiaChiBaoTin', col: 'GIADINH_DIACHIBAOTIN', label: 'Địa chỉ báo tin' },
            /* ---- bản ghi con một dòng: khoá bắt đầu "_" không gửi cùng hồ sơ ---- */
            { type: 'legend', label: 'Điểm thi vào lớp 9' },
            t('_9_TBCN', 'Điểm TB cả năm'),
            s('_9_HocLuc', 'Học lực', 'TUYENSINH.HOCLUC', 'Chọn học lực'),
            s('_9_HanhKiem', 'Hạnh kiểm', 'TUYENSINH.HANHKIEM', 'Chọn hạnh kiểm'),
            t('_9_NamTN', 'Năm tốt nghiệp')
        ];
        if (ts) fields.push(
            s('_9_XepLoai', 'Xếp loại', 'TS.XEPLOAITN', 'Chọn xếp loại'),
            s('_9_Tinh', 'Tỉnh', null, 'Chọn tỉnh'), s('_9_Huyen', 'Huyện', null, 'Chọn huyện'), s('_9_Xa', 'Xã', null, 'Chọn xã'));
        fields.push({ type: 'legend', label: 'Điểm thi vào lớp 10' });
        for (var i = 1; i <= 5; i++) fields.push(t('_10_TenMon' + i, 'Tên môn ' + i), t('_10_DiemMon' + i, 'Điểm môn ' + i));
        fields.push(t('_10_UuTien', 'Ưu tiên'), t('_10_Tong', 'Tổng'));
        if (ts) {
            fields.push(t('_10_SBD', 'Số báo danh'), t('_10_HoiDong', 'Hội đồng'), t('_10_TBCN', 'Điểm TB cả năm'));
            fields.push({ type: 'legend', label: 'Điểm thi vào lớp 11' },
                t('_11_TBCN', 'Điểm TB cả năm'),
                s('_11_HocLuc', 'Học lực', 'TUYENSINH.HOCLUC', 'Chọn học lực'),
                s('_11_HanhKiem', 'Hạnh kiểm', 'TUYENSINH.HANHKIEM', 'Chọn hạnh kiểm'),
                t('_11_NamTN', 'Năm tốt nghiệp'),
                s('_11_XepLoai', 'Xếp loại', 'TS.XEPLOAITN', 'Chọn xếp loại'),
                s('_11_Tinh', 'Tỉnh', null, 'Chọn tỉnh'), s('_11_Huyen', 'Huyện', null, 'Chọn huyện'), s('_11_Xa', 'Xã', null, 'Chọn xã'));
        }
        fields.push({ type: 'legend', label: 'Điểm thi lớp 12' },
            t('_12_TBCN', 'Điểm TB cả năm'),
            s('_12_HocLuc', 'Học lực', 'TUYENSINH.HOCLUC', 'Chọn học lực'),
            s('_12_HanhKiem', 'Hạnh kiểm', 'TUYENSINH.HANHKIEM', 'Chọn hạnh kiểm'),
            t('_12_NamTN', 'Năm tốt nghiệp'));
        if (ts) {
            fields.push({ type: 'legend', label: 'Điểm thi THPT' });
            for (i = 1; i <= 5; i++) fields.push(t('_pt_TenMon' + i, 'Tên môn ' + i), t('_pt_DiemMon' + i, 'Điểm môn ' + i));
            fields.push(t('_pt_UuTienKV', 'Điểm ưu tiên KT'), t('_pt_UuTienDT', 'Điểm ưu tiên ĐT'),
                t('_pt_Tong', 'Tổng điểm'), t('_pt_DiemXet', 'Điểm xét tuyển'),
                t('_pt_DiemTrungTuyen', 'Điểm trúng tuyển'), t('_pt_MaToHop', 'Mã tổng hợp'));
            fields.push({ type: 'legend', label: 'Điểm thi cuối kỳ' });
            for (i = 1; i <= 3; i++) fields.push(t('_ct_TenMon' + i, 'Tên môn ' + i), t('_ct_DiemMon' + i, 'Điểm môn ' + i));
        }
        fields.push(
            { type: 'legend', label: 'Hồ sơ đính kèm' },
            { type: 'files', key: 'txt_ThongTinDinhKem', api: 'TS_Files', label: 'Thông tin hồ sơ đính kèm' },
            { type: 'legend', label: 'Tình trạng hồ sơ' },
            { key: 'strXacNhanTinhTrangNopHS_Id', col: 'XACNHANTINHTRANGNOPHOSO_ID', label: 'Tình trạng hồ sơ', type: 'select',
              source: { dm: 'TUYENSINH.TINHTRANGHOSO' }, placeholder: 'Chọn tình trạng hồ sơ' },
            { type: 'gap' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', type: 'textarea' });
        if (ts) fields.push({ type: 'legend', label: 'Diện cộng điểm ưu tiên' });

        /* ---------- Thanh lọc ---------- */
        var filters = ts ? [
            { key: 'nam', type: 'select', label: 'Chọn năm', source: srcNam },
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch tuyển sinh' },
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'lop', type: 'select', label: 'Tất cả lớp' },
            { key: 'doitac', type: 'select', label: 'Chọn nguồn tuyển sinh', source: srcDoiTac },
            { key: 'tinh', type: 'select', label: 'Chọn tỉnh' },
            { key: 'huyen', type: 'select', label: 'Chọn huyện' },
            { key: 'xa', type: 'select', label: 'Chọn xã' },
            { key: 'nganh', type: 'select', label: 'Chọn ngành nghề', source: { dm: 'TUYENSINH.NGANHNGHE' } },
            { key: 'truong', type: 'select', label: 'Chọn trường học', source: { dm: 'TUYENSINH.TRUONGHOC' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ] : [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch tuyển sinh', source: srcKH },
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'lop', type: 'select', label: 'Chọn lớp quản lý' },
            { key: 'nganh', type: 'select', label: 'Chọn ngành nghề', source: { dm: 'TUYENSINH.NGANHNGHE' } },
            { key: 'tinh', type: 'select', label: 'Chọn tỉnh' },
            { key: 'huyen', type: 'select', label: 'Chọn huyện' },
            { key: 'xa', type: 'select', label: 'Chọn xã' },
            { key: 'doitac', type: 'select', label: 'Chọn đối tác', source: srcDoiTac },
            { key: 'truong', type: 'select', label: 'Chọn trường học', source: { dm: 'TUYENSINH.TRUONGHOC' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ];
        function thamSoDS(f) {
            var p = { strTuKhoa: f.q, strTS_KeHoachTuyenSinh_Id: f.kh, strTS_DoiTacTuyenSinh_Id: f.doitac,
                strDaoTao_HeDaoTao_Id: f.he, strDaoTao_KhoaDaoTao_Id: f.khoa,
                strThuongTru_TinhThanh_Id: f.tinh, strThuongTru_QuanHuyen_Id: f.huyen, strThuongTru_PhuongXa_Id: f.xa,
                strNganhNghe_Id: f.nganh, strTruongPTTH_Id: f.truong, strDaoTao_LopQuanLy_Id: f.lop };
            if (ts) p.strNam = f.nam;
            p.strTS_XacNhanDuyetHoSo_Id = ''; p.strTS_XacNhanDuyetTT_Id = ''; p.strNguoiTao_Id = uid();
            return p;
        }

        var columns = ts ? [
            { title: 'Họ đệm', prop: 'HODEM' },
            { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
            { title: 'Ngày sinh', cls: 'is-center is-nowrap', width: '120px',
              render: function (r) { return esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH)); } },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
            { title: 'Ngành nghề', prop: 'NGANHNGHE_TEN' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Điện thoại', prop: 'TTCN_DIENTHOAI', cls: 'is-center', width: '150px' }
        ] : [
            { title: 'Họ đệm', prop: 'HODEM' },
            { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
            { title: 'Ngày sinh', cls: 'is-center is-nowrap', width: '120px',
              render: function (r) { return esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH)); } },
            { title: 'Ngành nghề', prop: 'NGANHNGHE_TEN' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Điện thoại', prop: 'TTCN_DIENTHOAI', cls: 'is-center', width: '150px' },
            { title: 'Lớp', render: function (r) {
                return e(r.DAOTAO_LOPQUANLY_MA) ? ui.btn('history', { text: e(r.DAOTAO_LOPQUANLY_MA) + ' - Xem lịch sử',
                    cls: 'ums-btn--sm', attr: { 'data-lsid': e(r.ID), title: 'Chuyển lớp' } }) : '';
            } },
            P.cotChon('hs')
        ];

        var cfg = {
            root: root,
            title: o.title || (ts ? 'Nhập hồ sơ tuyển sinh' : 'Chuyển lớp - sẽ chuyển cả kế hoạch tuyển sinh'),
            formTitle: 'hồ sơ tuyển sinh',
            listTitle: 'Danh sách hồ sơ thí sinh',
            icon: 'fa-rectangle-history-circle-user',
            toolbar: ts ? [
                { text: 'Thêm mới từ Đào Tạo', icon: 'fa-link-slash', onClick: function () { keThua(); } },
                { text: 'Chuyển nguyện vọng', icon: 'fa-arrow-right-arrow-left', onClick: function () { chuyenNV(); } }
            ] : [{ text: 'Chuyển lớp', icon: 'fa-arrow-down-up-across-line', mod: 'primary', onClick: function () { chuyenLop(); } }],
            filters: filters,
            list: {
                paged: true,
                call: function (f) {
                    var p = thamSoDS(f);
                    p.action = 'TS_HoSoDuTuyen/LayDanhSach'; p.method = 'GET';
                    return p;
                }
            },
            columns: columns,
            fields: fields,
            save: function (v, row) {
                var f = crud.filterValues();
                var ns = dc.noiSinh.get(), qq = dc.queQuan.get(), tt = dc.thuongTru.get();
                st.idLuu = row ? row.ID : '';
                return {
                    action: row ? 'TS_HoSoDuTuyen/CapNhat' : 'TS_HoSoDuTuyen/ThemMoi',
                    strId: st.idLuu,
                    strChucNang_Id: cn(),
                    strMaSo: '',
                    strNganhNghe_Id: v.strNganhNghe_Id,
                    strNganh_Nghe_Truoc: v.strNganh_Nghe_Truoc,
                    strHoDem: v.strHoDem,
                    strTen: v.strTen,
                    strNgaySinh: v.strNgaySinh,
                    strThangSinh: v.strThangSinh,
                    strNamSinh: v.strNamSinh,
                    strGioiTinh_Id: v.strGioiTinh_Id,
                    strNoiSinh_TinhThanh_Id: ns.tinh, strNoiSinh_QuanHuyen_Id: ns.huyen, strNoiSinh_PhuongXa_Id: ns.xa, strNoiSinh_DiaChi: ns.them,
                    strDanToc_Id: v.strDanToc_Id,
                    strTonGiao_Id: v.strTonGiao_Id,
                    strQueQuan_TinhThanh_Id: qq.tinh, strQueQuan_QuanHuyen_Id: qq.huyen, strQueQuan_PhuongXa_Id: qq.xa, strQueQuan_DiaChi: qq.them,
                    strThuongTru_TinhThanh_Id: tt.tinh, strThuongTru_QuanHuyen_Id: tt.huyen, strThuongTru_PhuongXa_Id: tt.xa, strThuongTru_DiaChi: tt.them,
                    strCMT_So: v.strCMT_So,
                    strCMT_NgayCap: '',
                    strCMT_NoiCap: '',
                    strGiaDinh_HoTenBo: v.strGiaDinh_HoTenBo,
                    strGiaDinh_HoTenMe: v.strGiaDinh_HoTenMe,
                    strGiaDinh_NguoiBaoTin: v.strGiaDinh_NguoiBaoTin,
                    strGiaDinh_DiaChiBaoTin: v.strGiaDinh_DiaChiBaoTin,
                    strDoan_NgayVao: v.strDoan_NgayVao,
                    strDang_NgayVao: v.strDang_NgayVao,
                    strTTCN_DienThoai: v.strTTCN_DienThoai,
                    strTTCN_Email: '',
                    strGhiChu: v.strGhiChu,
                    strTS_KeHoachTuyenSinh_Id: f.kh,
                    strDaoTao_HeDaoTao_Id: f.he,
                    strDaoTao_KhoaDaoTao_Id: f.khoa,
                    strXacNhanTinhTrangNopHS_Id: v.strXacNhanTinhTrangNopHS_Id,
                    strAnhCaNhan: v.strAnhCaNhan,
                    strTS_DoiTacTuyenSinh_id: v.strTS_DoiTacTuyenSinh_id,
                    strTS_DoiTacTuyenSinh_Khac: v.strTS_DoiTacTuyenSinh_Khac,
                    strGiaDinh_SoDienThoaiBo: v.strGiaDinh_SoDienThoaiBo,
                    strGiaDinh_SoDienThoaiMe: v.strGiaDinh_SoDienThoaiMe,
                    strNguoiThucHien_Id: uid()
                };
            },
            onForm: function (row) {
                st.lop9 = st.lop10 = st.lop11 = st.lop12 = '';
                o_('_10_Tong').disabled = true;                  // ô Tổng chỉ đọc như gốc
                var id = row ? row.ID : '';
                dc.noiSinh.set(row && row.NOISINH_TINHTHANH_ID, row && row.NOISINH_QUANHUYEN_ID, row && row.NOISINH_PHUONGXA_ID, row && row.NOISINH_DIACHI);
                dc.queQuan.set(row && row.QUEQUAN_TINHTHANH_ID, row && row.QUEQUAN_QUANHUYEN_ID, row && row.QUEQUAN_PHUONGXA_ID, row && row.QUEQUAN_DIACHI);
                dc.thuongTru.set(row && row.THUONGTRU_TINHTHANH_ID, row && row.THUONGTRU_QUANHUYEN_ID, row && row.THUONGTRU_PHUONGXA_ID, row && row.THUONGTRU_DIACHI);
                thpt.load(id);
                giayTo.load(id).then(khoaLoaiHoSo);
                if (ts) { db9.set(); db11.set(); ut.load(id); }
                if (!id) return;
                con('TS_HoSoDuTuyen_Lop9', id, 100000).then(function (d) {
                    if (!d) return; st.lop9 = e(d.ID);
                    dat('_9_TBCN', d.DIEMTBCN); dat('_9_NamTN', d.NAMTN); dat('_9_HocLuc', d.HOCLUC_ID); dat('_9_HanhKiem', d.HANHKIEM_ID);
                    if (ts) { dat('_9_XepLoai', d.XEPLOAITN_ID); db9.set(d.TINHTHANH_ID, d.QUANHUYEN_ID, d.PHUONGXA_ID); }
                });
                con('TS_HoSoDuTuyen_Lop10', id, 10000).then(function (d) {
                    if (!d) return; st.lop10 = e(d.ID);
                    dat('_10_UuTien', d.DIEMUUTIEN); dat('_10_Tong', d.TONGDIEM);
                    for (var k = 1; k <= 5; k++) { dat('_10_DiemMon' + k, d['MON' + k]); dat('_10_TenMon' + k, d['MON' + k + '_TEN']); }
                    if (ts) { dat('_10_SBD', d.SBD); dat('_10_HoiDong', d.HOIDONGTHI); dat('_10_TBCN', d.DIEMTNCN !== undefined ? d.DIEMTNCN : d.DiemTNCN); }
                });
                if (ts) con('TS_HoSoDuTuyen_Lop11', id, 100000).then(function (d) {
                    if (!d) return; st.lop11 = e(d.ID);
                    dat('_11_TBCN', d.DIEMTBCN); dat('_11_NamTN', d.NAMTN); dat('_11_HocLuc', d.HOCLUC_ID); dat('_11_HanhKiem', d.HANHKIEM_ID);
                    dat('_11_XepLoai', d.XEPLOAITN_ID); db11.set(d.TINHTHANH_ID, d.QUANHUYEN_ID, d.PHUONGXA_ID);
                });
                con('TS_HoSoDuTuyen_Lop12', id, 10000).then(function (d) {
                    if (!d) return; st.lop12 = e(d.ID);
                    dat('_12_TBCN', d.DIEMTBCN); dat('_12_NamTN', d.NAMTN); dat('_12_HocLuc', d.HOCLUC_ID); dat('_12_HanhKiem', d.HANHKIEM_ID);
                    if (!ts) return;
                    for (var k = 1; k <= 5; k++) { dat('_pt_DiemMon' + k, d['MON' + k]); dat('_pt_TenMon' + k, d['MON' + k + '_TEN']); }
                    dat('_pt_Tong', d.TONGDIEM); dat('_pt_MaToHop', d.MATOHOP); dat('_pt_DiemXet', d.DIEMXETTUYEN);
                    dat('_pt_DiemTrungTuyen', d.DIEMTRUNGTUYENNGANH); dat('_pt_UuTienKV', d.DIEMUUTIEN); dat('_pt_UuTienDT', d.DIEMUUTIENDT);
                    for (k = 1; k <= 3; k++) {
                        dat('_ct_DiemMon' + k, d['MON' + k + 'HOCTAP']);
                        var ten = d['MON' + k + 'HOCTAP_TEN'];
                        dat('_ct_TenMon' + k, ten !== undefined && ten !== null ? ten : d['MON' + k + '_TEN']);
                    }
                });
            },
            onSaved: function (me, result) {
                var id = st.idLuu || (result && result.raw && result.raw.Id) || '';
                if (!id) return;
                /* đọc giá trị NGAY (biểu mẫu sắp được giấu), rồi lưu các bản ghi con tuần tự */
                var v = me.formValues();
                var l9 = { action: st.lop9 ? 'TS_HoSoDuTuyen_Lop9/CapNhat' : 'TS_HoSoDuTuyen_Lop9/ThemMoi', strId: st.lop9, strChucNang_Id: cn(),
                    strNamTN: v._9_NamTN, strDIEMTBCN: v._9_TBCN, strTS_HoSoDuTuyen_Id: id, strHocLuc_Id: v._9_HocLuc,
                    strHanhKiem_Id: v._9_HanhKiem };
                if (ts) { l9.strXepLoaiTN_Id = v._9_XepLoai; l9.strTinhThanh_Id = v._9_Tinh; l9.strQuanHuyen_Id = v._9_Huyen; }
                l9.strGhiChu = ''; l9.strNguoiThucHien_Id = uid();

                var l12 = { action: st.lop12 ? 'TS_HoSoDuTuyen_Lop12/CapNhat' : 'TS_HoSoDuTuyen_Lop12/ThemMoi', strId: st.lop12, strChucNang_Id: cn(),
                    strNamTN: v._12_NamTN, strDIEMTBCN: v._12_TBCN, strTS_HoSoDuTuyen_Id: id, strHocLuc_Id: v._12_HocLuc,
                    strHanhKiem_Id: v._12_HanhKiem, strGhiChu: '', strNguoiThucHien_Id: uid() };
                if (ts) {
                    for (var k = 1; k <= 5; k++) { l12['dMon' + k] = v['_pt_DiemMon' + k]; l12['strMon' + k + '_Ten'] = v['_pt_TenMon' + k]; }
                    l12.dTongDiem = v._pt_Tong; l12.strMaToHop = v._pt_MaToHop; l12.dDiemXetTuyen = v._pt_DiemXet;
                    l12.dDiemTrungTuyenNganh = v._pt_DiemTrungTuyen; l12.strXepLoaiTN_Id = '';
                    l12.dDiemUuTienKhuVuc = v._pt_UuTienKV; l12.dDiemUuTienDoiTuong = v._pt_UuTienDT;
                    for (k = 1; k <= 3; k++) l12['dMon' + k + 'HocTap'] = v['_ct_DiemMon' + k];
                    for (k = 1; k <= 3; k++) l12['strMon' + k + 'HocTap_Ten'] = v['_ct_TenMon' + k];
                }

                var l10 = { action: st.lop10 ? 'TS_HoSoDuTuyen_Lop10/CapNhat' : 'TS_HoSoDuTuyen_Lop10/ThemMoi', strId: st.lop10, strChucNang_Id: cn(),
                    strTS_HoSoDuTuyen_Id: id, dDiemUuTien: v._10_UuTien, dTongDiem: v._10_Tong,
                    dMon1: v._10_DiemMon1, strMon1_Ten: v._10_TenMon1, dMon2: v._10_DiemMon2, strMon2_Ten: v._10_TenMon2,
                    dMon3: v._10_DiemMon3, strMon3_Ten: v._10_TenMon3, dMon4: v._10_DiemMon4, strMon4_Ten: v._10_TenMon4,
                    dMon5: v._10_DiemMon5, strMon5_Ten: v._10_TenMon5 };
                if (ts) { l10.strHoiDongThi = v._10_HoiDong; l10.dDiemTNCN = v._10_TBCN; l10.strSBD = v._10_SBD; }
                l10.strNguoiThucHien_Id = uid();

                var goi = [l9, l12, l10];
                if (ts) goi.push({ action: st.lop11 ? 'TS_HoSoDuTuyen_Lop11/CapNhat' : 'TS_HoSoDuTuyen_Lop11/ThemMoi', strId: st.lop11,
                    strChucNang_Id: cn(), strNamTN: v._11_NamTN, strDIEMTBCN: v._11_TBCN, strTS_HoSoDuTuyen_Id: id,
                    strHocLuc_Id: v._11_HocLuc, strHanhKiem_Id: v._11_HanhKiem, strXepLoaiTN_Id: v._11_XepLoai,
                    strTinhThanh_Id: v._11_Tinh, strQuanHuyen_Id: v._11_Huyen, strGhiChu: '', strNguoiThucHien_Id: uid() });
                if (ts) goi = goi.concat(ut.calls(id));
                var p1 = thpt.save(id), p2 = giayTo.save(id);
                goi.reduce(function (p, c) {
                    return p.then(function () { return ums.api.call(c).catch(function (err) { ums.api.handle(err, 'lưu ' + c.action.split('/')[0]); }); });
                }, Promise.resolve()).then(function () { return Promise.all([p1, p2]); });
            }
        };
        if (ts) {
            cfg.remove = function (ids) {
                return { action: 'TS_HoSoDuTuyen/Xoa', strIds: ids.join(','), strChucNang_Id: cn(), strNguoiThucHien_Id: uid() };
            };
            cfg.rowDelete = false;       // gốc: danh sách chỉ có nút Sửa + ô đánh dấu, Xóa ở đầu danh sách
            cfg.formDelete = false;      // nút Xóa chân biểu mẫu bị chú thích trong html gốc
        } else {
            cfg.canAdd = false;
        }
        var crud = ums.crud(cfg);

        function o_(k) { return crud.root.querySelector('[data-scope="form"][data-k="' + k + '"]'); }
        function dat(k, v) {
            var el = o_(k); if (!el) return;
            el.value = e(v);
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        }
        function con(ctl, id, size) {
            return P.rows({ action: ctl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id,
                strChucNang_Id: cn(), strNguoiTao_Id: uid(), pageIndex: 1, pageSize: size })
                .then(function (r) { return r.length ? (ts ? r[0] : r[r.length - 1]) : null; },   // TS lấy dòng ĐẦU, NH dòng CUỐI (như từng gốc)
                    function (err) { ums.api.handle(err, ctl); return null; });
        }
        function loi(noi) { return function (err) { ums.api.handle(err, noi); }; }

        /* ---------- Ô địa chỉ (setTinhThanh) ---------- */
        var dc = { noiSinh: pat.diaChi(o_('_noiSinh')), queQuan: pat.diaChi(o_('_queQuan')), thuongTru: pat.diaChi(o_('_thuongTru')) };

        /* ---------- Danh mục tỉnh thành (cây QUANHECHA_ID) ---------- */
        var dsTT = [];
        var ttP = pat.dmTinhThanh().then(function (r) { dsTT = r; return r; }, function (err) { loi('tỉnh thành')(err); return []; });
        function conTT(cha) { return dsTT.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }

        /* Tỉnh → Huyện → Xã trong biểu mẫu (lớp 9 / lớp 11 bản TS — genDropTinhThanh) */
        function diaBan(pre) {
            var T = o_(pre + 'Tinh'), H = o_(pre + 'Huyen'), X = o_(pre + 'Xa');
            if (!T) return { set: function () {} };
            jQuery(T).on('select2:select select2:clear', function () { pat.fill(H, T.value ? conTT(T.value) : []); pat.fill(X, []); });
            jQuery(H).on('select2:select select2:clear', function () { pat.fill(X, H.value ? conTT(H.value) : []); });
            var ch = pat.chain([T, H, X], { phatLai: false });
            return {
                set: function (tinh, huyen, xa) {
                    ttP.then(function () {
                        pat.fill(T, conTT(null)); T.value = e(tinh);
                        pat.fill(H, T.value ? conTT(T.value) : []); H.value = e(huyen);
                        pat.fill(X, H.value ? conTT(H.value) : []); X.value = e(xa);
                        [T, H, X].forEach(function (el) { jQuery(el).trigger('change.select2'); });
                        ch.sync();
                    });
                }
            };
        }
        var db9 = ts ? diaBan('_9_') : null, db11 = ts ? diaBan('_11_') : null;

        /* ---------- Hai lưới dòng, đặt đúng chỗ của bản gốc trong biểu mẫu ---------- */
        function chen(truocLegend) {
            var host = document.createElement('div');
            host.style.gridColumn = '1 / -1';
            var lg = Array.prototype.filter.call(crud.z('form').querySelectorAll('.ums-legend'), function (x) {
                return x.textContent.trim() === truocLegend;
            })[0];
            lg.parentNode.insertBefore(host, lg);
            return host;
        }
        var thpt = pat.rows(chen('Điểm thi vào lớp 9'), {
            title: 'Trường THPT đã học', icon: 'fa-school', minRows: 1,
            columns: [
                { key: 'strTruong_Id', col: 'TRUONG_ID', title: 'Tên trường THPT', type: 'select', s2: true,
                  source: { dm: 'TUYENSINH.TRUONGHOC' }, placeholder: 'Chọn trường THPT' },
                { key: 'strTruong_Khac', col: 'TRUONG_KHAC', title: 'Trường THPT khác' },
                { key: 'strGhiChu', col: 'GHICHU', title: 'Địa chỉ' }
            ],
            list: function (id) {
                return { action: 'TS_HoSoDuTuyen_Truong/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id,
                    strChucNang_Id: cn(), strNguoiTao_Id: uid(), pageIndex: 1, pageSize: 10 };
            },
            filled: function (v) { return !!(v.strTruong_Id || v.strTruong_Khac); },
            save: function (v, rec, id) {
                return { action: 'TS_HoSoDuTuyen_Truong/ThemMoi', strId: rec ? rec.ID : '', strChucNang_Id: cn(),
                    strTruong_Id: v.strTruong_Id, strTruong_Khac: v.strTruong_Khac, strGhiChu: v.strGhiChu,
                    strTS_HoSoDuTuyen_Id: id, strTinhThanh_Id: '', strQuanHuyen_Id: '', strNguoiThucHien_Id: uid() };
            },
            remove: function (rec) {
                return { action: 'TS_HoSoDuTuyen_Truong/Xoa', strIds: rec.ID, strChucNang_Id: cn(), strNguoiThucHien_Id: uid() };
            }
        });
        var hostGT = chen('Tình trạng hồ sơ');
        var giayTo = pat.rows(hostGT, {
            title: 'Hồ sơ giấy tờ', icon: 'fa-folder-open', minRows: 1,
            columns: [
                { key: 'strLoaiHoSo_Id', col: 'LOAIHOSO_ID', title: 'Loại hồ sơ', type: 'select', s2: true,
                  source: { dm: 'TUYENSINH.LOAIHOSO' }, placeholder: 'Chọn loại hồ sơ' },
                { key: '_canNop', col: 'SOLUONGCANNOP', title: 'Số lượng cần nộp', type: 'static', width: '160px' },
                { key: 'dSoLuong', col: 'SOLUONG', title: 'Số lượng đã nộp', width: '160px' },
                { key: 'strMoTa', col: 'MOTA', title: 'Ghi chú' }
            ],
            list: function (id) {
                return { action: 'TS_HoSo/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id, strChucNang_Id: cn(),
                    strLoaiHoSo_Id: '', strTS_KeHoachTuyenSinh_Id: crud.filterValues().kh, strNguoiTao_Id: uid(),
                    pageIndex: 1, pageSize: 100000000 };
            },
            filled: function (v) { return !!v.strLoaiHoSo_Id; },
            save: function (v, rec, id) {
                return { action: 'TS_HoSo/ThemMoi', strId: rec ? rec.ID : '', strChucNang_Id: cn(), strTS_HoSoDuTuyen_Id: id,
                    strTS_KeHoachTuyenSinh_Id: crud.filterValues().kh, strLoaiHoSo_Id: v.strLoaiHoSo_Id, dSoLuongCanNop: '',
                    dSoLuong: v.dSoLuong, strMoTa: v.strMoTa, strNguoiThucHien_Id: uid() };
            },
            remove: function (rec) {
                return { action: 'TS_HoSo/Xoa', strIds: rec.ID, strChucNang_Id: cn(), strNguoiThucHien_Id: uid() };
            }
        });
        /* "Thêm dòng mới" của giấy tờ bị chú thích trong html gốc NH (bản TS có nút) */
        var nutThemGT = hostGT.querySelector('[data-rows="add"]');
        if (nutThemGT && !ts) nutThemGT.hidden = true;
        /* Loại hồ sơ của dòng ĐÃ LƯU chỉ đọc (hiddenElement readonlyselect2 của gốc) */
        function khoaLoaiHoSo() {
            Array.prototype.forEach.call(hostGT.querySelectorAll('tbody tr'), function (tr) {
                var nut = tr.querySelector('[data-rows="del"] span');
                var sel = tr.querySelector('[data-rk="strLoaiHoSo_Id"]');
                if (nut && sel && nut.textContent.trim() === 'Xóa') {
                    sel.disabled = true;
                    if (window.jQuery) jQuery(sel).trigger('change.select2');
                }
            });
        }

        /* ---------- Diện cộng điểm ưu tiên (bản TS): danh mục TS.DOITUONGUUTIEN, đánh dấu = hồ sơ có diện ---------- */
        var ut = ts ? (function () {
            var host = document.createElement('div');
            host.style.gridColumn = '1 / -1';
            crud.z('form').querySelector('.ums-grid').appendChild(host);
            var ds = [], da = {};                  // da: DOITUONGUUTIEN_ID → ID dòng TS_DTUuTien_NguoiHoc
            function danhDau() {
                Array.prototype.forEach.call(host.querySelectorAll('[data-nhck="ut"]'), function (x) {
                    x.checked = !!da[x.value];
                    var tr = x.closest('tr'); if (tr) tr.classList.toggle('is-selected', x.checked);
                });
                var all = host.querySelector('[data-nhall="ut"]');
                if (all) all.checked = ds.length > 0 && ds.every(function (r) { return !!da[r.ID]; });
            }
            function ve() {
                ui.table({ el: host, rows: ds, empty: 'Chưa khai danh mục diện ưu tiên (TS.DOITUONGUUTIEN)', columns: [
                    { title: 'Diện cộng điểm ưu tiên', prop: 'TEN' },
                    P.cotChon('ut')
                ] });
                danhDau();
            }
            P.ganChon(host, 'ut');
            ums.api.dm('TS.DOITUONGUUTIEN').then(function (r) { ds = r || []; ve(); }, function (err) { ds = []; ve(); loi('diện ưu tiên')(err); });
            var token = 0;
            return {
                load: function (id) {
                    da = {}; danhDau();
                    var my = ++token;
                    if (!id) return;
                    P.rows({ action: 'TS_DTUuTien_NguoiHoc/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id,
                        strDoiTuongUuTien_Id: '', strChucNang_Id: cn(), strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000 })
                        .then(function (rows) {
                            if (my !== token) return;
                            rows.forEach(function (r) { da[e(r.DOITUONGUUTIEN_ID)] = e(r.ID); });
                            danhDau();
                        }, loi('diện ưu tiên của hồ sơ'));
                },
                /* Lời gọi thêm / xoá theo chênh lệch (gốc: đánh dấu mà chưa có "name" → ThemMoi; bỏ dấu mà có → Xoa) */
                calls: function (id) {
                    var chon = {};
                    P.chon(host, 'ut').forEach(function (x) { chon[x] = true; });
                    var c = [];
                    ds.forEach(function (r) {
                        var k = e(r.ID);
                        if (chon[k] && !da[k]) c.push({ action: 'TS_DTUuTien_NguoiHoc/ThemMoi', strChucNang_Id: cn(), strTS_HoSoDuTuyen_Id: id,
                            strDoiTuongUuTien_Id: k, strNguoiThucHien_Id: uid() });
                        else if (!chon[k] && da[k]) c.push({ action: 'TS_DTUuTien_NguoiHoc/Xoa', strIds: da[k], strChucNang_Id: cn(),
                            strNguoiThucHien_Id: uid() });
                    });
                    return c;
                }
            };
        })() : null;

        /* ---------- Nút Xóa chân biểu mẫu NH (gốc không gắn xử lý) ---------- */
        var toolsForm = crud.z('form').querySelector('.ums-panel__tools');
        var nutLuu = toolsForm.querySelector('[data-c="' + crud.uid + ':save"]');
        if (!ts) nutLuu.insertAdjacentHTML('beforebegin', ui.btn('del', { attr: { disabled: '', title: 'Bản gốc chưa gắn xử lý cho nút này' } }));

        /* ---------- Ảnh: chép ảnh tạm sang tên chính thức TRƯỚC khi lưu (edu.system.getImage) ---------- */
        nutLuu.addEventListener('click', function (ev) {
            var av = crud.avatars && crud.avatars.strAnhCaNhan;
            var id = crud.editing && crud.editing.ID;
            if (!av || !id || String(av.get()).indexOf('unsave_') < 0) return;
            ev.stopImmediatePropagation(); ev.preventDefault();
            av.finalize(id).then(function (p) { av.set(p); nutLuu.click(); });
        }, true);

        /* ---------- Thanh lọc: nối tầng ---------- */
        function fl(k) { return crud.root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
        var F = { nam: fl('nam'), kh: fl('kh'), he: fl('he'), khoa: fl('khoa'), lop: fl('lop'), tinh: fl('tinh'), huyen: fl('huyen'), xa: fl('xa') };
        function heDT(kh) {
            return P.rows({ action: 'TS_HeDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strTS_KeHoachTuyenSinh_Id: kh,
                strNguoiThucHien_Id: uid() });
        }
        function khoaDT(kh, he) {
            return P.rows({ action: 'TS_KhoaDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
                strDaoTao_HeDaoTao_Id: he, strTS_KeHoachTuyenSinh_Id: kh });
        }
        function lopQL(khoa) {
            return P.rows({ action: 'KHCT_LopQuanLy/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: khoa, strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 });
        }
        function napHe() {
            if (!F.kh.value) { pat.fill(F.he, []); return; }
            heDT(F.kh.value).then(function (r) { pat.fill(F.he, r, { name: 'TENHEDAOTAO' }); }, loi('hệ đào tạo'));
        }
        function napKhoa() {
            if (!F.he.value) { pat.fill(F.khoa, []); return; }
            khoaDT(F.kh.value, F.he.value).then(function (r) { pat.fill(F.khoa, r, { name: 'TENKHOA' }); }, loi('khóa đào tạo'));
        }
        function napLop() {
            if (ts) {
                /* getList_LopQuanLy (Corei) theo Hệ + Khóa — gốc nạp khi chọn Hệ hoặc Khóa */
                if (!F.he.value) { pat.fill(F.lop, []); return; }
                P.lopQuanLy({ strDaoTao_HeDaoTao_Id: F.he.value, strKhoaDaoTao_Id: F.khoa.value })
                    .then(function (r) { pat.fill(F.lop, r, { name: 'TEN' }); }, loi('lớp quản lý'));
                return;
            }
            if (!F.khoa.value) { pat.fill(F.lop, []); return; }
            lopQL(F.khoa.value).then(function (r) { pat.fill(F.lop, r, { name: 'TEN' }); }, loi('lớp quản lý'));
        }
        function napKH() {
            if (!F.nam.value) { pat.fill(F.kh, []); return; }
            keHoachTS(F.nam.value).then(function (r) { pat.fill(F.kh, r, { name: 'TEN' }); }, loi('kế hoạch tuyển sinh'));
        }
        ttP.then(function () { pat.fill(F.tinh, conTT(null)); });

        if (ts) {
            jQuery(F.nam).on('select2:select select2:clear', function () { napKH(); pat.fill(F.he, []); pat.fill(F.khoa, []); pat.fill(F.lop, []); crud.load(1); });
            jQuery(F.kh).on('select2:select select2:clear', function () { napHe(); pat.fill(F.khoa, []); pat.fill(F.lop, []); crud.load(1); });
            jQuery(F.he).on('select2:select select2:clear', function () { napKhoa(); napLop(); crud.load(1); });
            jQuery(F.khoa).on('select2:select select2:clear', function () { napLop(); crud.load(1); });
            pat.chain([F.nam, F.kh, F.he, F.khoa], { phatLai: false });
            pat.chain([F.he, F.lop], { phatLai: false });
        } else {
            jQuery(F.kh).on('select2:select select2:clear', function () { napHe(); crud.load(1); });
            jQuery(F.he).on('select2:select select2:clear', function () { napKhoa(); pat.fill(F.lop, []); crud.load(1); });
            jQuery(F.khoa).on('select2:select select2:clear', function () { napLop(); crud.load(1); });
            pat.chain([F.kh, F.he, F.khoa, F.lop], { phatLai: false });
        }
        jQuery(F.lop).on('select2:select select2:clear', function () { crud.load(1); });
        jQuery(F.tinh).on('select2:select select2:clear', function () { pat.fill(F.huyen, F.tinh.value ? conTT(F.tinh.value) : []); pat.fill(F.xa, []); });
        jQuery(F.huyen).on('select2:select select2:clear', function () { pat.fill(F.xa, F.huyen.value ? conTT(F.huyen.value) : []); });
        pat.chain([F.tinh, F.huyen, F.xa], { phatLai: false });

        /* ---------- Báo cáo / Import trong thanh lọc (bản TS — zonebtnBaoCao_TuyenSinh) ---------- */
        if (ts) {
            var loc = crud.z('list').querySelector('.ums-filter');
            if (loc) {
                loc.insertAdjacentHTML('beforeend', '<div class="ums-field ums-field--fit" data-hsts="bc"></div>');
                ums.report.mount(loc.querySelector('[data-hsts="bc"]'), { collect: function (add) {
                    var p = thamSoDS(crud.filterValues());
                    delete p.strDaoTao_LopQuanLy_Id; delete p.strNam;        // gốc: callback báo cáo không gửi lớp / năm
                    Object.keys(p).forEach(function (k) { add(k, p[k]); });
                } });
            }
        }

        /* ---------- Ô đánh dấu, lịch sử chuyển lớp (bản NH) ---------- */
        if (!ts) {
            P.ganChon(crud.z('table'), 'hs');
            crud.z('table').addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-lsid]');
                if (b) lichSu(b.getAttribute('data-lsid'));
            });
        }

        function lichSu(id) {
            var dlg = ui.dialog({ title: 'Chi tiết chuyển lớp', icon: 'fa-clock-rotate-left', size: 'xl',
                body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var host = dlg.body.querySelector('[data-x="bang"]');
            P.rows({ action: 'TS_HoSoDuTuyen/LayDSLichSuChuyenLop', method: 'GET', strTS_HoSoDuTuyen_Id: id }).then(function (rows) {
                ui.table({ el: host, rows: rows, stt: true, empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (r) { return esc((e(r.HODEM) + ' ' + e(r.TEN)).trim()); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
                    { title: 'Lớp trước chuyển', prop: 'TRUOC_DAOTAO_LOPQUANLY_MA' },
                    { title: 'Lớp sau chuyển', prop: 'SAU_DAOTAO_LOPQUANLY_MA' },
                    { title: 'Lý do', prop: 'GHICHU_LS' },
                    { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TAIKHOAN' },
                    { title: 'Ngày thực hiện', prop: 'NGAYTHUCHIEN_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' }
                ] });
            }, function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử chuyển lớp'); });
        }

        /* ---------- Hộp Kế hoạch → Hệ → Khóa (→ Lớp) dùng chung hai hộp chuyển ---------- */
        function hopChuyen(cf) {
            function sl(k, ph) { return '<select class="ums-select" data-cl="' + k + '" data-ph="' + ph + '"><option value="">' + ph + '</option></select>'; }
            var dlg = ui.dialog({
                title: cf.title, icon: 'fa-arrow-down-up-across-line', size: 'md',
                body: '<div class="ums-grid ums-grid--2">' +
                    '<div style="grid-column:1 / -1">' + ui.field('Kế hoạch', sl('kh', 'Chọn kế hoạch'), { required: cf.canKH }) + '</div>' +
                    ui.field('Hệ đào tạo', sl('he', 'Chọn hệ đào tạo')) +
                    ui.field('Khóa đào tạo', sl('khoa', 'Chọn khóa đào tạo')) +
                    (cf.lop ? '<div style="grid-column:1 / -1">' + ui.field('Lớp quản lý', sl('lop', 'Chọn lớp quản lý'), { required: true }) + '</div>' +
                        '<div style="grid-column:1 / -1">' + ui.field('Lý do', '<input class="ums-input" data-cl="lydo" autocomplete="off">') + '</div>' : '') +
                    '</div>',
                buttons: [{ text: cf.nut, mod: 'primary', icon: 'fa-arrow-down-up-across-line', onClick: function (d) {
                    var chon = cf.chon();
                    if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return false; }
                    if (cf.canKH && !D('kh').value) { ui.toast('Vui lòng chọn kế hoạch', 'warn'); return false; }
                    if (cf.lop && !D('lop').value) { ui.toast('Vui lòng chọn lớp quản lý', 'warn'); return false; }
                    var gt = { kh: D('kh').value, he: D('he').value, khoa: D('khoa').value,
                        lop: cf.lop ? D('lop').value : '', lydo: cf.lop ? D('lydo').value : '' };
                    ui.confirm(cf.hoi(chon.length), { ok: cf.nut, title: cf.nut }).then(function (yes) {
                        if (!yes) return;
                        d.close();
                        ui.batch(chon.map(function (id) { return cf.call(gt, id); }),
                            { title: cf.dang, okText: cf.xong }).then(function () { crud.load(); });
                    });
                    return false;
                } }]
            });
            function D(k) { return dlg.body.querySelector('[data-cl="' + k + '"]'); }
            ui.enhance(dlg.body);
            cf.keHoach().then(function (r) { pat.fill(D('kh'), r, { name: 'TEN' }); }, loi('kế hoạch tuyển sinh'));
            jQuery(D('kh')).on('select2:select select2:clear', function () {
                if (!D('kh').value) { pat.fill(D('he'), []); return; }
                heDT(D('kh').value).then(function (r) { pat.fill(D('he'), r, { name: 'TENHEDAOTAO' }); }, loi('hệ đào tạo'));
            });
            jQuery(D('he')).on('select2:select select2:clear', function () {
                if (!D('he').value) { pat.fill(D('khoa'), []); return; }
                khoaDT(D('kh').value, D('he').value).then(function (r) { pat.fill(D('khoa'), r, { name: 'TENKHOA' }); }, loi('khóa đào tạo'));
            });
            if (cf.lop) {
                jQuery(D('khoa')).on('select2:select select2:clear', function () {
                    if (!D('khoa').value) { pat.fill(D('lop'), []); return; }
                    lopQL(D('khoa').value).then(function (r) {
                        pat.fill(D('lop'), r, { name: function (x) { return e(x.TEN) + '(' + e(x.SOLUONGTHUCTE) + ')'; } });
                    }, loi('lớp quản lý'));
                });
            }
            pat.chain(cf.lop ? [D('kh'), D('he'), D('khoa'), D('lop')] : [D('kh'), D('he'), D('khoa')], { phatLai: false });
        }

        /* NH — "Chuyển lớp" (hộp gốc tên "Chuyển nguyện vọng") */
        function chuyenLop() {
            var chonHS = function () { return P.chon(crud.z('table'), 'hs'); };
            if (!chonHS().length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
            hopChuyen({
                title: 'Chuyển nguyện vọng', nut: 'Chuyển lớp', lop: true, chon: chonHS,
                keHoach: function () { return P.rows(Object.assign({}, srcKH.call)); },
                hoi: function (n) { return 'Bạn có muốn chuyển lớp cho ' + n + ' hồ sơ không?'; },
                dang: 'Đang chuyển lớp', xong: 'Chuyển nguyện vọng thành công',
                call: function (gt, id) {
                    return { action: 'TS_HoSoDuTuyen/ChuyenLop', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
                        strTS_KeHoachTuyenSinh_Id: gt.kh, strDaoTao_HeDaoTao_Id: gt.he, strDaoTao_KhoaDaoTao_Id: gt.khoa,
                        strDaoTao_LopQuanLy_Id: gt.lop, strLyDoChuyen: gt.lydo, strTS_HoSoDuTuyen_Id: id };
                }
            });
        }

        /* TS — "Chuyển nguyện vọng" (đánh dấu = ô chọn của ums.crud) */
        function chonTS() { return crud.pickedRows().map(function (r) { return r.ID; }); }
        function chuyenNV() {
            if (!chonTS().length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
            hopChuyen({
                title: 'Chuyển nguyện vọng', nut: 'Chuyển nguyện vọng', canKH: true, chon: chonTS,
                keHoach: function () { return keHoachTS(crud.filterValues().nam); },
                hoi: function (n) { return 'Bạn có muốn chuyển nguyện vọng cho ' + n + ' hồ sơ không?'; },
                dang: 'Đang chuyển nguyện vọng', xong: 'Chuyển nguyện vọng thành công',
                call: function (gt, id) {
                    return { action: 'TS_HoSoDuTuyen/ChuyenNguyenVong', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
                        strTS_KeHoachTuyenSinh_Id: gt.kh, strDaoTao_HeDaoTao_Id: gt.he, strDaoTao_KhoaDaoTao_Id: gt.khoa,
                        strTS_HoSoDuTuyen_Id: id };
                }
            });
        }

        /* TS — "Thêm mới từ Đào Tạo": chọn người học (genModal_SinhVien) → Them_TS_HoSoDuTuyen_KeThua */
        function keThua() {
            var f = crud.filterValues();
            if (!f.kh) { ui.toast('Vui lòng chọn kế hoạch tuyển sinh ở thanh lọc trước', 'warn'); return; }
            pat.pickSinhVienNganh({
                title: 'Thêm mới từ Đào Tạo',
                onPick: function (rows) {
                    var f2 = crud.filterValues();
                    var da = {}, ids = [];
                    rows.forEach(function (r) { var k = e(r.QLSV_NGUOIHOC_ID); if (k && !da[k]) { da[k] = 1; ids.push(k); } });
                    ui.batch(ids.map(function (id) {
                        return { action: 'TS_HoSoDuTuyen/Them_TS_HoSoDuTuyen_KeThua', strChucNang_Id: cn(), strTS_HoSoDuTuyen_Id: id,
                            strNganhNghe_Id: f2.nganh, strTS_KeHoachTuyenSinh_Id: f2.kh, strDaoTao_HeDaoTao_Id: f2.he,
                            strDaoTao_KhoaDaoTao_Id: f2.khoa, strTS_DoiTacTuyenSinh_Id: f2.doitac, strNguoiThucHien_Id: uid() };
                    }), { title: 'Đang thêm hồ sơ', okText: 'Thêm mới thành công' }).then(function () { crud.load(); });
                }
            });
        }

        return crud;
    }

    ums.hoSoTS = { man: man };
})();
