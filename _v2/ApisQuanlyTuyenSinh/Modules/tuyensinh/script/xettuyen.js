/* =========================================================================
   Xét tuyển
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/xettuyen.html + script/xettuyen.js (2.644 dòng — bản chép của
   tuyensinh/hosotuyensinh.js, lớp XetTuyen; biểu mẫu hồ sơ trùng bản Nhập học phanlop/hosotuyensinh)
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" (Năm → Kế hoạch TS → Hệ → Khóa · Tình trạng xét tuyển · Tỉnh → Huyện → Xã ·
   Trường học · Ngành nghề · từ khoá · Tìm kiếm; ô Đối tác / Tình trạng nhập học bị chú thích) → "Danh sách hồ sơ thí sinh (n)"
   + Danh sách ngành xét · Tạo dữ liệu xét · Xét tự động theo chỉ tiêu · Xét tự động theo điểm chuẩn · Thực hiện xét ·
   Xác nhận tiếp sinh · Xuất báo cáo ▾: Họ đệm · Tên · Ngày sinh · Ngành nghề · Hệ · Khóa · Điện thoại · Trúng tuyển ·
   Xác nhận tiếp sinh · Chi tiết · ô đánh dấu. Chi tiết → khung "XÉT TUYỂN" thay chỗ danh sách: biểu mẫu hồ sơ (thông tin
   cơ bản, Trường THPT đã học, điểm lớp 9 / 10 / 12, hồ sơ đính kèm, hồ sơ giấy tờ, tình trạng, ghi chú) + Đóng · Lưu · Xét tuyển.
   Hộp "Duyệt hồ sơ" (xét tuyển) / "Xác nhận tiếp sinh": Nội dung · nút tình trạng lấy từ danh mục · Lịch sử.
   Lưới "Ngành xét tuyển" (trong trang, thay chỗ màn — từ 30/9): Mã ngành · Tên ngành · Chỉ tiêu (ô nhập) · Điểm xét (ô nhập) + Lưu.

   Lời gọi (chép nguyên, GET/POST như gốc):
     TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach  GET strNguoiThucHien_Id → NAM
     TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung     GET strTuKhoa '' (gốc ô txtAAAA), strNguoiDung_Id, strNam, 1/100000 → TEN
     TS_HeDaoTao/LayDanhSach    GET strChucNang_Id, strTS_KeHoachTuyenSinh_Id, strNguoiThucHien_Id → TENHEDAOTAO
     TS_KhoaDaoTao/LayDanhSach  GET strChucNang_Id, strNguoiThucHien_Id, strDaoTao_HeDaoTao_Id, strTS_KeHoachTuyenSinh_Id → TENKHOA
     TS_DoiTacTuyenSinh/LayDanhSach GET strTuKhoa '', strNguoiTao_Id, 1/1000000000 → THONGTINHIENTHI (ô Nguồn tuyển sinh)
     danh mục TUYENSINH.XACNHANTRUNGTUYEN / XACNHANTHUTUCNHAPHOC (sắp HESO1; THONGTIN1 biểu tượng, THONGTIN2 kiểu),
       TUYENSINH.NGANHNGHE / TRUONGHOC / HOCLUC / HANHKIEM / TINHTRANGHOSO / LOAIHOSO, NS.GITI / DATO / TOGI, CHUN.DMTT
     TS_HoSoDuTuyen/LayDanhSach GET strTuKhoa, strTS_KeHoachTuyenSinh_Id, strTS_DoiTacTuyenSinh_Id '' (ô bị chú thích),
                                    strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strThuongTru_TinhThanh_Id/_QuanHuyen_Id/_PhuongXa_Id,
                                    strNganhNghe_Id, strTruongPTTH_Id, strTS_XacNhanDuyetHoSo_Id '', strTS_XacNhanDuyetTT_Id,
                                    strNguoiTao_Id, trang (máy chủ)
     TS_HoSoDuTuyen/CapNhat (ThemMoi khi chưa có id) POST 43 tham số của save_HoSo (kế hoạch / hệ / khoá lấy từ THANH LỌC như gốc)
     TS_HoSoDuTuyen_Lop9 | Lop12 | Lop10 /LayDanhSach GET (lấy dòng CUỐI như gốc) · /ThemMoi | /CapNhat POST
     TS_HoSoDuTuyen_Truong/LayDanhSach GET · /ThemMoi POST (cả khi sửa) · /Xoa POST
     TS_HoSo/LayDanhSach GET · /ThemMoi POST (dSoLuongCanNop '') · /Xoa POST · tệp TS_Files · ảnh (getImage)
     TS_XacNhanDuyetTrungTuyen/ThemMoi POST strId '', strSanPham_Id, strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id
       · /LayDanhSach GET strTuKhoa '', strsanpham_Id, strTinhTrang_Id '', strNguoiThucHien_Id, 1/100000
     TS_XacNhanThuTucNhapHoc/ThemMoi · /LayDanhSach — cùng tham số (Xác nhận tiếp sinh)
     TS_XetTuyen/TaoDuLieuXetTuyenTuDong GET strTS_KeHoachTuyenSinh_Id, strNguoiThucHien_Id
     TS_XetTuyen/LayDSNganhXetTheoKeHoach GET strTS_KeHoachTuyenSinh_Id, strNganhNghe_Id '' (gốc ô dropAAAA), strNguoiThucHien_Id
       → mỗi ngành: TS_XetTuyen/XetTuyenTuDongTheoNganh GET strTS_KeHoachTuyenSinh_Id, strNganhNghe_Id, strNguoiThucHien_Id
     TS_XetTuyen/XetTuyenTuDongTheoNganhChiTieu GET strTS_KeHoachTuyenSinh_Id, strNganhNghe_Id '' (gốc gọi không truyền ngành),
       strNguoiThucHien_Id
     TS_XetTuyen/LayDSTS_KeHoachXet_ChiTieu GET strTS_KeHoachTuyenSinh_Id, strTS_KeHoachXetTuyen '', strNguoiThucHien_Id
       → NGANHNGHE_MA, NGANHNGHE_TEN, CHITIEU, DIEMXET · TS_XetTuyen/Sua_TS_KeHoachXet_ChiTieu POST strId, dChiTieu, dDiemXet,
       strNguoiThucHien_Id (mỗi dòng một lời gọi)
     Xuất báo cáo: ums.report.mount ("zonebtnBaoCao_XT", không có vùng Import) — strChucNang_Id, strTS_HoSoDuTuyen_Id (id các
       dòng ĐÁNH DẤU, quá 100 thì dừng như gốc), strTuKhoa, kế hoạch / hệ / khoá, strTruongPTTH_Id, strTS_DoiTacTuyenSinh_Id '',
       tỉnh / huyện / xã, strNganhNghe_Id, strTS_XacNhanDuyetHoSo_Id '', strTS_XacNhanDuyetTT_Id

   Khác gốc / tự chốt (ghi báo cáo):
     · Lưu hồ sơ xong về danh sách (gốc ở lại biểu mẫu, nạp lại chi tiết sau 1 giây); bản ghi con lưu SAU bản ghi chính, chỉ
       báo lỗi (gốc bật thông báo "thành công" cho từng lời gọi con). Họ đệm / Tên / Ngành nghề (*) nay bắt buộc.
     · "Danh sách ngành xét" Lưu xong gọi me.getList_KeHoachXuLy() KHÔNG tồn tại (lỗi JS) → nay nạp lại bảng ngành xét.
     · Bốn nút xét (Danh sách ngành xét, Tạo dữ liệu xét, hai nút Xét tự động) gửi kế hoạch của thanh lọc → nay bắt chọn
       kế hoạch tuyển sinh trước (gốc gửi rỗng). "Tạo dữ liệu xét" nay hỏi lại như hai nút xét tự động (gốc chạy ngay).
     · Xét tự động theo điểm chuẩn: gốc bắn mỗi ngành một lời gọi song song, mỗi lời gọi một thông báo → ui.batch có tiến độ,
       xong nạp lại danh sách. Xét tự động theo chỉ tiêu giữ MỘT lời gọi strNganhNghe_Id rỗng như gốc.
     · Hộp xét tuyển / tiếp sinh nhiều hồ sơ: lịch sử gốc tra theo hồ sơ mở GẦN NHẤT (id đọng) và hộp tiếp sinh còn đổ lịch sử
       vào bảng của hộp xét tuyển (sai id bảng) → nay chỉ hiện lịch sử khi đánh dấu đúng một hồ sơ. Gửi hàng loạt có tiến độ
       rồi nạp lại (gốc setTimeout 1,5 giây).
     · Hộp "Xét tuyển tự động theo ngành" (#myModalNganhXet, ô đánh dấu ngành) không có lối mở (lệnh mở bị chú thích) → bỏ.
       Hàm save_ChuyenNguyenVong / delete_HS / btnAdd / btnDelete không có nút trên html → không dựng.
     · Nút "Xác nhận tiếp sinh" gốc có hai chỗ (trên và dưới bảng) → một nút đầu trang. Mục viết cứng "1. Phiếu tiếp nhận sinh
       viên" trong html gốc bị getList_MauImport ghi đè → không dựng.
   Cặp cha → con: Năm → Kế hoạch TS → Hệ → Khóa, Tỉnh → Huyện → Xã (thanh lọc) — pat.chain.
   Nợ tầng chung: biểu mẫu hồ sơ TS_HoSoDuTuyen nay có BA bản (NH phanlop/_hosots.js ums.hoSoTS, TS duyethoso chỉ xem, bản
   này) — nên gộp vào ums.hoSoTS bằng cờ khi khung đó ổn định; hộp xác nhận nút lớn (danh mục → nút + lịch sử) thêm một bản.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.nhPhanLop, e = P.e, esc = ui.esc;
    var root = document.getElementById('ts-xettuyen');
    if (!root) return;
    function uid() { return ums.session.userId; }
    function cn() { return ums.state.chucNangId; }
    function loi(noi) { return function (err) { ums.api.handle(err, noi); }; }

    var srcDoiTac = { call: { action: 'TS_DoiTacTuyenSinh/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: uid(),
        pageIndex: 1, pageSize: 1000000000 }, name: 'THONGTINHIENTHI' };
    var st = { idLuu: '', lop9: '', lop10: '', lop12: '' };

    function t(key, label, extra) { var o = { key: key, label: label, col: '' }; Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; }); return o; }
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
        t('_noiSinh', 'Nơi sinh'),
        t('_queQuan', 'Quê quán'),
        t('_thuongTru', 'Hộ khẩu thường trú'),
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
        /* bản ghi con một dòng: khoá bắt đầu "_" không gửi cùng hồ sơ */
        { type: 'legend', label: 'Điểm thi vào lớp 9' },
        t('_9_TBCN', 'Điểm TB cả năm'),
        t('_9_HocLuc', 'Học lực', { type: 'select', source: { dm: 'TUYENSINH.HOCLUC' }, placeholder: 'Chọn học lực' }),
        t('_9_HanhKiem', 'Hạnh kiểm', { type: 'select', source: { dm: 'TUYENSINH.HANHKIEM' }, placeholder: 'Chọn hạnh kiểm' }),
        t('_9_NamTN', 'Năm tốt nghiệp'),
        { type: 'legend', label: 'Điểm thi vào lớp 10' },
        t('_10_TenMon1', 'Tên môn 1'), t('_10_DiemMon1', 'Điểm môn 1'),
        t('_10_TenMon2', 'Tên môn 2'), t('_10_DiemMon2', 'Điểm môn 2'),
        t('_10_TenMon3', 'Tên môn 3'), t('_10_DiemMon3', 'Điểm môn 3'),
        t('_10_TenMon4', 'Tên môn 4'), t('_10_DiemMon4', 'Điểm môn 4'),
        t('_10_TenMon5', 'Tên môn 5'), t('_10_DiemMon5', 'Điểm môn 5'),
        t('_10_UuTien', 'Ưu tiên'), t('_10_Tong', 'Tổng'),
        { type: 'legend', label: 'Điểm thi lớp 12' },
        t('_12_TBCN', 'Điểm TB cả năm'),
        t('_12_HocLuc', 'Học lực', { type: 'select', source: { dm: 'TUYENSINH.HOCLUC' }, placeholder: 'Chọn học lực' }),
        t('_12_HanhKiem', 'Hạnh kiểm', { type: 'select', source: { dm: 'TUYENSINH.HANHKIEM' }, placeholder: 'Chọn hạnh kiểm' }),
        t('_12_NamTN', 'Năm tốt nghiệp'),
        { type: 'legend', label: 'Hồ sơ đính kèm' },
        { type: 'files', key: 'txt_ThongTinDinhKem', api: 'TS_Files', label: 'Thông tin hồ sơ đính kèm' },
        { type: 'legend', label: 'Tình trạng hồ sơ' },
        { key: 'strXacNhanTinhTrangNopHS_Id', col: 'XACNHANTINHTRANGNOPHOSO_ID', label: 'Tình trạng hồ sơ', type: 'select',
          source: { dm: 'TUYENSINH.TINHTRANGHOSO' }, placeholder: 'Chọn tình trạng hồ sơ' },
        { type: 'gap' },
        { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', type: 'textarea' }
    ];

    /* ---------- Danh sách + biểu mẫu (ums.crud) ---------- */
    var crud = ums.crud({
        root: root,
        title: 'Xét tuyển',
        formTitle: 'hồ sơ xét tuyển',
        listTitle: 'Danh sách hồ sơ thí sinh',
        icon: 'fa-user-check',
        canAdd: false,
        toolbar: [
            { text: 'Danh sách ngành xét', icon: 'fa-list-check', mod: 'out-primary', onClick: function () { nganhXet(); } },
            { text: 'Tạo dữ liệu xét', icon: 'fa-database', mod: 'out-warn', onClick: function () { taoDuLieu(); } },
            { text: 'Xét tự động theo chỉ tiêu', icon: 'fa-wand-magic-sparkles', mod: 'out-primary', onClick: function () { xetChiTieu(); } },
            { text: 'Xét tự động theo điểm chuẩn', icon: 'fa-wand-magic-sparkles', mod: 'out-primary', onClick: function () { xetDiemChuan(); } },
            { text: 'Thực hiện xét', icon: 'fa-circle-check', mod: 'primary', onClick: function () { xetNhieu(XT); } },
            { text: 'Xác nhận tiếp sinh', icon: 'fa-circle-check', mod: 'primary', onClick: function () { xetNhieu(TS); } }
        ],
        filters: [
            { key: 'nam', type: 'select', label: 'Chọn năm', source: { call: { action: 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach',
                method: 'GET', strNguoiThucHien_Id: uid() }, id: 'NAM', name: 'NAM' } },
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch tuyển sinh' },
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'tt', type: 'select', label: 'Tất cả tình trạng xét tuyển', source: { dm: 'TUYENSINH.XACNHANTRUNGTUYEN', sort: 'HESO1' } },
            { key: 'tinh', type: 'select', label: 'Chọn tỉnh' },
            { key: 'huyen', type: 'select', label: 'Chọn huyện' },
            { key: 'xa', type: 'select', label: 'Chọn xã' },
            { key: 'truong', type: 'select', label: 'Chọn trường học', source: { dm: 'TUYENSINH.TRUONGHOC' } },
            { key: 'nganh', type: 'select', label: 'Chọn ngành nghề', source: { dm: 'TUYENSINH.NGANHNGHE' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'TS_HoSoDuTuyen/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q, strTS_KeHoachTuyenSinh_Id: f.kh, strTS_DoiTacTuyenSinh_Id: '',
                    strDaoTao_HeDaoTao_Id: f.he, strDaoTao_KhoaDaoTao_Id: f.khoa,
                    strThuongTru_TinhThanh_Id: f.tinh, strThuongTru_QuanHuyen_Id: f.huyen, strThuongTru_PhuongXa_Id: f.xa,
                    strNganhNghe_Id: f.nganh, strTruongPTTH_Id: f.truong, strTS_XacNhanDuyetHoSo_Id: '',
                    strTS_XacNhanDuyetTT_Id: f.tt, strNguoiTao_Id: uid() };
            }
        },
        columns: [
            { title: 'Họ đệm', prop: 'HODEM' },
            { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
            { title: 'Ngày sinh', cls: 'is-center is-nowrap', width: '120px',
              render: function (r) { return esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH)); } },
            { title: 'Ngành nghề', prop: 'NGANHNGHE_TEN' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Điện thoại', prop: 'TTCN_DIENTHOAI', cls: 'is-center', width: '150px' },
            { title: 'Trúng tuyển', prop: 'TS_XACNHANDUYETTT_TEN', cls: 'is-center', width: '150px' },
            { title: 'Xác nhận tiếp sinh', prop: 'TS_XACNHANTTNH_TEN', cls: 'is-center' }
        ],
        fields: fields,
        save: function (v, row) {
            var f = crud.filterValues();
            var ns = dc.noiSinh.get(), qq = dc.queQuan.get(), tt = dc.thuongTru.get();
            st.idLuu = row ? e(row.ID) : '';
            return {
                action: st.idLuu ? 'TS_HoSoDuTuyen/CapNhat' : 'TS_HoSoDuTuyen/ThemMoi', method: 'POST',
                strId: st.idLuu, strChucNang_Id: cn(), strMaSo: '',
                strNganhNghe_Id: v.strNganhNghe_Id, strNganh_Nghe_Truoc: v.strNganh_Nghe_Truoc,
                strHoDem: v.strHoDem, strTen: v.strTen, strNgaySinh: v.strNgaySinh, strThangSinh: v.strThangSinh, strNamSinh: v.strNamSinh,
                strGioiTinh_Id: v.strGioiTinh_Id,
                strNoiSinh_TinhThanh_Id: ns.tinh, strNoiSinh_QuanHuyen_Id: ns.huyen, strNoiSinh_PhuongXa_Id: ns.xa, strNoiSinh_DiaChi: ns.them,
                strDanToc_Id: v.strDanToc_Id, strTonGiao_Id: v.strTonGiao_Id,
                strQueQuan_TinhThanh_Id: qq.tinh, strQueQuan_QuanHuyen_Id: qq.huyen, strQueQuan_PhuongXa_Id: qq.xa, strQueQuan_DiaChi: qq.them,
                strThuongTru_TinhThanh_Id: tt.tinh, strThuongTru_QuanHuyen_Id: tt.huyen, strThuongTru_PhuongXa_Id: tt.xa, strThuongTru_DiaChi: tt.them,
                strCMT_So: v.strCMT_So, strCMT_NgayCap: '', strCMT_NoiCap: '',
                strGiaDinh_HoTenBo: v.strGiaDinh_HoTenBo, strGiaDinh_HoTenMe: v.strGiaDinh_HoTenMe,
                strGiaDinh_NguoiBaoTin: v.strGiaDinh_NguoiBaoTin, strGiaDinh_DiaChiBaoTin: v.strGiaDinh_DiaChiBaoTin,
                strDoan_NgayVao: v.strDoan_NgayVao, strDang_NgayVao: v.strDang_NgayVao,
                strTTCN_DienThoai: v.strTTCN_DienThoai, strTTCN_Email: '', strGhiChu: v.strGhiChu,
                strTS_KeHoachTuyenSinh_Id: f.kh, strDaoTao_HeDaoTao_Id: f.he, strDaoTao_KhoaDaoTao_Id: f.khoa,
                strXacNhanTinhTrangNopHS_Id: v.strXacNhanTinhTrangNopHS_Id, strAnhCaNhan: v.strAnhCaNhan,
                strTS_DoiTacTuyenSinh_id: v.strTS_DoiTacTuyenSinh_id, strTS_DoiTacTuyenSinh_Khac: v.strTS_DoiTacTuyenSinh_Khac,
                strGiaDinh_SoDienThoaiBo: v.strGiaDinh_SoDienThoaiBo, strGiaDinh_SoDienThoaiMe: v.strGiaDinh_SoDienThoaiMe,
                strNguoiThucHien_Id: uid()
            };
        },
        onForm: function (row) {
            st.lop9 = st.lop10 = st.lop12 = '';
            o('_10_Tong').disabled = true;                              // ô Tổng chỉ đọc như gốc
            ['_9_TBCN', '_9_HocLuc', '_9_HanhKiem', '_9_NamTN', '_10_UuTien', '_10_Tong', '_12_TBCN', '_12_HocLuc', '_12_HanhKiem', '_12_NamTN']
                .concat([1, 2, 3, 4, 5].reduce(function (a, i) { return a.concat(['_10_TenMon' + i, '_10_DiemMon' + i]); }, []))
                .forEach(function (k) { dat(k, ''); });
            var id = row ? e(row.ID) : '';
            dc.noiSinh.set(row && row.NOISINH_TINHTHANH_ID, row && row.NOISINH_QUANHUYEN_ID, row && row.NOISINH_PHUONGXA_ID, row && row.NOISINH_DIACHI);
            dc.queQuan.set(row && row.QUEQUAN_TINHTHANH_ID, row && row.QUEQUAN_QUANHUYEN_ID, row && row.QUEQUAN_PHUONGXA_ID, row && row.QUEQUAN_DIACHI);
            dc.thuongTru.set(row && row.THUONGTRU_TINHTHANH_ID, row && row.THUONGTRU_QUANHUYEN_ID, row && row.THUONGTRU_PHUONGXA_ID, row && row.THUONGTRU_DIACHI);
            thpt.load(id);
            giayTo.load(id).then(khoaLoaiHoSo);
            if (!id) return;
            con('TS_HoSoDuTuyen_Lop9', id, 100000, uid()).then(function (d) {
                if (!d) return; st.lop9 = e(d.ID);
                dat('_9_TBCN', d.DIEMTBCN); dat('_9_NamTN', d.NAMTN); dat('_9_HocLuc', d.HOCLUC_ID); dat('_9_HanhKiem', d.HANHKIEM_ID);
            });
            con('TS_HoSoDuTuyen_Lop10', id, 10000, uid()).then(function (d) {
                if (!d) return; st.lop10 = e(d.ID);
                dat('_10_UuTien', d.DIEMUUTIEN); dat('_10_Tong', d.TONGDIEM);
                for (var i = 1; i <= 5; i++) { dat('_10_DiemMon' + i, d['MON' + i]); dat('_10_TenMon' + i, d['MON' + i + '_TEN']); }
            });
            con('TS_HoSoDuTuyen_Lop12', id, 10000, '').then(function (d) {       // gốc Lop12 gửi strNguoiTao_Id rỗng
                if (!d) return; st.lop12 = e(d.ID);
                dat('_12_TBCN', d.DIEMTBCN); dat('_12_NamTN', d.NAMTN); dat('_12_HocLuc', d.HOCLUC_ID); dat('_12_HanhKiem', d.HANHKIEM_ID);
            });
        },
        onSaved: function (me, result) {
            var id = st.idLuu || (result && result.raw && result.raw.Id) || '';
            if (!id) return;
            var v = me.formValues();
            var goi = [
                { action: st.lop9 ? 'TS_HoSoDuTuyen_Lop9/CapNhat' : 'TS_HoSoDuTuyen_Lop9/ThemMoi', method: 'POST', strId: st.lop9, strChucNang_Id: cn(),
                  strNamTN: v._9_NamTN, strDIEMTBCN: v._9_TBCN, strTS_HoSoDuTuyen_Id: id, strHocLuc_Id: v._9_HocLuc,
                  strHanhKiem_Id: v._9_HanhKiem, strGhiChu: '', strNguoiThucHien_Id: uid() },
                { action: st.lop12 ? 'TS_HoSoDuTuyen_Lop12/CapNhat' : 'TS_HoSoDuTuyen_Lop12/ThemMoi', method: 'POST', strId: st.lop12, strChucNang_Id: cn(),
                  strNamTN: v._12_NamTN, strDIEMTBCN: v._12_TBCN, strTS_HoSoDuTuyen_Id: id, strHocLuc_Id: v._12_HocLuc,
                  strHanhKiem_Id: v._12_HanhKiem, strGhiChu: '', strNguoiThucHien_Id: uid() },
                { action: st.lop10 ? 'TS_HoSoDuTuyen_Lop10/CapNhat' : 'TS_HoSoDuTuyen_Lop10/ThemMoi', method: 'POST', strId: st.lop10, strChucNang_Id: cn(),
                  strTS_HoSoDuTuyen_Id: id, dDiemUuTien: v._10_UuTien, dTongDiem: v._10_Tong,
                  dMon1: v._10_DiemMon1, strMon1_Ten: v._10_TenMon1, dMon2: v._10_DiemMon2, strMon2_Ten: v._10_TenMon2,
                  dMon3: v._10_DiemMon3, strMon3_Ten: v._10_TenMon3, dMon4: v._10_DiemMon4, strMon4_Ten: v._10_TenMon4,
                  dMon5: v._10_DiemMon5, strMon5_Ten: v._10_TenMon5, strNguoiThucHien_Id: uid() }
            ];
            var p1 = thpt.save(id), p2 = giayTo.save(id);
            goi.reduce(function (p, c) {
                return p.then(function () { return ums.api.call(c).catch(loi('lưu ' + c.action.split('/')[0])); });
            }, Promise.resolve()).then(function () { return Promise.all([p1, p2]); });
        },
        onLoad: function () { var all = crud.z('table').querySelector('[data-nhall="xt"]'); if (all) all.checked = false; }
    });

    function o(k) { return crud.root.querySelector('[data-scope="form"][data-k="' + k + '"]'); }
    function dat(k, v) {
        var el = o(k); if (!el) return;
        el.value = e(v);
        if (el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
    }
    function con(ctl, id, size, nguoiTao) {
        return P.rows({ action: ctl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id,
            strChucNang_Id: cn(), strNguoiTao_Id: nguoiTao, pageIndex: 1, pageSize: size })
            .then(function (r) { return r.length ? r[r.length - 1] : null; },     // gốc lấy dòng CUỐI
                function (err) { ums.api.handle(err, ctl); return null; });
    }

    /* ---------- Cột "Chi tiết" + ô đánh dấu CUỐI bảng như gốc ---------- */
    var drawGoc = crud.draw;
    crud.draw = function () { drawGoc.call(crud); chenCotChon(); };
    function chenCotChon() {
        var tbl = crud.z('table').querySelector('table');
        if (!tbl) return;
        var th = tbl.querySelector('thead tr');
        var thTT = th && th.querySelector('th.is-actions');
        if (thTT) thTT.textContent = 'Chi tiết';
        if (th && !th.querySelector('[data-nhall]')) th.insertAdjacentHTML('beforeend', '<th class="is-center" style="width:50px">' + P.cotChon('xt').head + '</th>');
        Array.prototype.forEach.call(tbl.querySelectorAll('tbody tr'), function (tr, i) {
            var r = crud.rows[i];
            if (!r || tr.querySelector('[data-nhck]')) return;
            tr.insertAdjacentHTML('beforeend', '<td class="is-center">' + P.cotChon('xt').render(r) + '</td>');
        });
    }
    chenCotChon();
    P.ganChon(crud.z('table'), 'xt');
    function daChon() { return P.chon(crud.z('table'), 'xt'); }

    /* ---------- Ô địa chỉ (setTinhThanh) ---------- */
    var dc = { noiSinh: pat.diaChi(o('_noiSinh')), queQuan: pat.diaChi(o('_queQuan')), thuongTru: pat.diaChi(o('_thuongTru')) };

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
            return { action: 'TS_HoSoDuTuyen_Truong/ThemMoi', method: 'POST', strId: rec ? rec.ID : '', strChucNang_Id: cn(),
                strTruong_Id: v.strTruong_Id, strTruong_Khac: v.strTruong_Khac, strGhiChu: v.strGhiChu,
                strTS_HoSoDuTuyen_Id: id, strTinhThanh_Id: '', strQuanHuyen_Id: '', strNguoiThucHien_Id: uid() };
        },
        remove: function (rec) {
            return { action: 'TS_HoSoDuTuyen_Truong/Xoa', method: 'POST', strIds: rec.ID, strChucNang_Id: cn(), strNguoiThucHien_Id: uid() };
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
            return { action: 'TS_HoSo/ThemMoi', method: 'POST', strId: rec ? rec.ID : '', strChucNang_Id: cn(), strTS_HoSoDuTuyen_Id: id,
                strTS_KeHoachTuyenSinh_Id: crud.filterValues().kh, strLoaiHoSo_Id: v.strLoaiHoSo_Id, dSoLuongCanNop: '',
                dSoLuong: v.dSoLuong, strMoTa: v.strMoTa, strNguoiThucHien_Id: uid() };
        },
        remove: function (rec) {
            return { action: 'TS_HoSo/Xoa', method: 'POST', strIds: rec.ID, strChucNang_Id: cn(), strNguoiThucHien_Id: uid() };
        }
    });
    /* Loại hồ sơ của dòng ĐÃ LƯU chỉ đọc (hiddenElement readonlyselect2 của gốc) */
    function khoaLoaiHoSo() {
        Array.prototype.forEach.call(hostGT.querySelectorAll('tbody tr'), function (tr) {
            var nut = tr.querySelector('[data-rows="del"] span');
            var sel = tr.querySelector('[data-rk="strLoaiHoSo_Id"]');
            if (nut && sel && nut.textContent.trim() === 'Xóa') { sel.disabled = true; jQuery(sel).trigger('change.select2'); }
        });
    }

    /* ---------- Chân biểu mẫu: Đóng · Lưu · Xét tuyển ---------- */
    var toolsForm = crud.z('form').querySelector('.ums-panel__tools');
    var nutLuu = toolsForm.querySelector('[data-c="' + crud.uid + ':save"]');
    nutLuu.insertAdjacentHTML('afterend', ui.btn('confirm', { text: 'Xét tuyển', mod: 'primary', attr: { 'data-xt': '1' } }));
    toolsForm.querySelector('[data-xt]').addEventListener('click', function () {
        if (crud.editing && crud.editing.ID) hopXacNhan(XT, [crud.editing.ID], e(crud.editing.HODEM) + ' ' + e(crud.editing.TEN));
    });
    /* Ảnh: chép ảnh tạm sang tên chính thức TRƯỚC khi lưu (edu.system.getImage) */
    nutLuu.addEventListener('click', function (ev) {
        var av = crud.avatars && crud.avatars.strAnhCaNhan;
        var id = crud.editing && crud.editing.ID;
        if (!av || !id || String(av.get()).indexOf('unsave_') < 0) return;
        ev.stopImmediatePropagation(); ev.preventDefault();
        av.finalize(id).then(function (p) { av.set(p); nutLuu.click(); });
    }, true);

    /* ---------- Thanh lọc: nối tầng (ums.crud tự tải lại khi đổi ô chọn) ---------- */
    function fl(k) { return crud.root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
    var F = {};
    ['nam', 'kh', 'he', 'khoa', 'tinh', 'huyen', 'xa'].forEach(function (k) { F[k] = fl(k); });
    function napKH() {
        if (!F.nam.value) { pat.fill(F.kh, []); return; }
        P.rows({ action: 'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung', method: 'GET', strTuKhoa: '', strNguoiDung_Id: uid(),
            strNam: F.nam.value, pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(F.kh, r, { name: 'TEN' }); }, loi('kế hoạch tuyển sinh'));
    }
    function napHe() {
        if (!F.kh.value) { pat.fill(F.he, []); return; }
        P.rows({ action: 'TS_HeDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strTS_KeHoachTuyenSinh_Id: F.kh.value,
            strNguoiThucHien_Id: uid() }).then(function (r) { pat.fill(F.he, r, { name: 'TENHEDAOTAO' }); }, loi('hệ đào tạo'));
    }
    function napKhoa() {
        if (!F.he.value) { pat.fill(F.khoa, []); return; }
        P.rows({ action: 'TS_KhoaDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
            strDaoTao_HeDaoTao_Id: F.he.value, strTS_KeHoachTuyenSinh_Id: F.kh.value })
            .then(function (r) { pat.fill(F.khoa, r, { name: 'TENKHOA' }); }, loi('khóa đào tạo'));
    }
    var dsTT = [];
    function conTT(cha) { return dsTT.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }
    pat.dmTinhThanh().then(function (r) { dsTT = r || []; pat.fill(F.tinh, conTT(null)); }, loi('tỉnh thành'));
    var S = 'select2:select select2:clear';
    jQuery(F.nam).on(S, function () { napKH(); pat.fill(F.he, []); pat.fill(F.khoa, []); });
    jQuery(F.kh).on(S, function () { napHe(); pat.fill(F.khoa, []); });
    jQuery(F.he).on(S, function () { napKhoa(); });
    jQuery(F.tinh).on(S, function () { pat.fill(F.huyen, F.tinh.value ? conTT(F.tinh.value) : []); pat.fill(F.xa, []); });
    jQuery(F.huyen).on(S, function () { pat.fill(F.xa, F.huyen.value ? conTT(F.huyen.value) : []); });
    pat.chain([F.nam, F.kh, F.he, F.khoa], { phatLai: false });
    pat.chain([F.tinh, F.huyen, F.xa], { phatLai: false });

    /* ---------- Xuất báo cáo ▾ (đầu trang, sau các nút xét) ---------- */
    var act = crud.z('actions');
    act.insertAdjacentHTML('beforeend', '<span data-x="bc"></span>');
    ums.report.mount(act.querySelector('[data-x="bc"]'), {
        import: false,
        collect: function (add) {
            var ids = daChon();
            if (ids.length > 100) { ui.toast('Số được chọn không quá 100?', 'warn'); return false; }
            var f = crud.filterValues();
            var x = {
                strChucNang_Id: cn(), strTS_HoSoDuTuyen_Id: ids.toString(), strTuKhoa: f.q,
                strTS_KeHoachTuyenSinh_Id: f.kh, strDaoTao_HeDaoTao_Id: f.he, strDaoTao_KhoaDaoTao_Id: f.khoa,
                strTruongPTTH_Id: f.truong, strTS_DoiTacTuyenSinh_Id: '',
                strThuongTru_TinhThanh_Id: f.tinh, strThuongTru_QuanHuyen_Id: f.huyen, strThuongTru_PhuongXa_Id: f.xa,
                strNganhNghe_Id: f.nganh, strTS_XacNhanDuyetHoSo_Id: '', strTS_XacNhanDuyetTT_Id: f.tt
            };
            Object.keys(x).forEach(function (k) { add(k, x[k]); });
        }
    });

    /* ---------- Hộp xét tuyển / xác nhận tiếp sinh (nút theo danh mục + lịch sử) ---------- */
    var XT = { ctl: 'TS_XacNhanDuyetTrungTuyen', dm: 'TUYENSINH.XACNHANTRUNGTUYEN', tieuDe: 'Duyệt hồ sơ', noiDung: 'Nội dung duyệt hồ sơ',
        chon: 'Chọn duyệt hồ sơ', ls: 'Lịch sử xét tuyển', cotTT: 'Tình trạng xét tuyển', ok: 'Xét tuyển thành công' };
    var TS = { ctl: 'TS_XacNhanThuTucNhapHoc', dm: 'TUYENSINH.XACNHANTHUTUCNHAPHOC', tieuDe: 'Xác nhận tiếp sinh', noiDung: 'Nội dung tiếp sinh',
        chon: 'Chọn xác nhận', ls: 'Lịch sử xác nhận', cotTT: 'Tình trạng', ok: 'Xác nhận thành công' };
    function xetNhieu(k) {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        hopXacNhan(k, ids, '');
    }
    function hopXacNhan(k, ids, ten) {
        var dlg = ui.dialog({ title: k.tieuDe + (ten ? ': ' + ten : ''), icon: 'fa-circle-check', size: 'lg',
            body: (ids.length > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + ids.length + ' hồ sơ đã chọn.</p>' : '') +
                ui.field(k.noiDung, '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">' + esc(k.chon) + '</div><div class="nd-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                '<div class="ums-legend ums-legend--cach">' + esc(k.ls) + '</div><div data-x="ls"></div>' });
        function q(x) { return dlg.body.querySelector('[data-x="' + x + '"]'); }
        ums.api.dm(k.dm, 'HESO1').then(function (d) {
            q('nut').innerHTML = (d || []).length ? d.map(function (h) {
                var ic = ums.iconFA4 ? ums.iconFA4(h.THONGTIN1 || 'fa-solid fa-circle-check') : 'fa-solid fa-circle-check';
                return '<button type="button" class="nd-xn__nut" data-hd="' + esc(h.ID) + '"><i class="' + esc(ic) + '"' +
                    (h.THONGTIN2 ? ' style="' + esc(h.THONGTIN2) + '"' : '') + '></i><span>' + esc(e(h.TEN)) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo danh mục ' + k.dm);
        }).catch(function (err) { q('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, k.tieuDe); });
        if (ids.length === 1) {
            q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            P.rows({ action: k.ctl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strsanpham_Id: ids[0], strTinhTrang_Id: '',
                strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (d) {
                ui.table({ el: q('ls'), rows: d, empty: 'Chưa có lịch sử', columns: [
                    { title: k.cotTT, prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center', width: '110px' }] });
            }, function (err) { q('ls').innerHTML = ui.fail(err.message); });
        } else q('ls').innerHTML = ui.empty('Chọn đúng một hồ sơ để xem lịch sử');
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]');
            if (!b) return;
            var hd = b.getAttribute('data-hd'), nd = (q('nd').value || '').trim();
            dlg.close();
            ui.batch(ids.map(function (id) {
                return { action: k.ctl + '/ThemMoi', method: 'POST', strId: '', strSanPham_Id: id, strNoiDung: nd, strTinhTrang_Id: hd,
                    strNguoiXacnhan_Id: uid() };
            }), { title: 'Đang ' + k.tieuDe.toLowerCase(), okText: k.ok }).then(function () { crud.load(); });
        });
    }

    /* ---------- Các nút xét theo kế hoạch ---------- */
    function keHoach() {
        var kh = crud.filterValues().kh;
        if (!kh) ui.toast('Vui lòng chọn kế hoạch tuyển sinh', 'warn');
        return kh;
    }
    function goiXet(call, ok) {
        return ums.api.call(call).then(function () { ui.toast(ok || 'Thành công', 'ok'); }, function (err) { ui.toast('Thất bại: ' + err.message, 'bad'); });
    }
    function taoDuLieu() {
        var kh = keHoach(); if (!kh) return;
        ui.confirm('Bạn có muốn tạo dữ liệu xét tuyển cho kế hoạch đang chọn?', { title: 'Tạo dữ liệu xét', ok: 'Tạo dữ liệu' }).then(function (yes) {
            if (yes) goiXet({ action: 'TS_XetTuyen/TaoDuLieuXetTuyenTuDong', method: 'GET', strTS_KeHoachTuyenSinh_Id: kh, strNguoiThucHien_Id: uid() });
        });
    }
    function xetChiTieu() {
        var kh = keHoach(); if (!kh) return;
        ui.confirm('Bạn có muốn xét tự động?', { title: 'Xét tự động theo chỉ tiêu', ok: 'Xét tự động' }).then(function (yes) {
            if (yes) goiXet({ action: 'TS_XetTuyen/XetTuyenTuDongTheoNganhChiTieu', method: 'GET', strTS_KeHoachTuyenSinh_Id: kh,
                strNganhNghe_Id: '', strNguoiThucHien_Id: uid() }).then(function () { crud.load(); });
        });
    }
    function xetDiemChuan() {
        var kh = keHoach(); if (!kh) return;
        ui.confirm('Bạn có muốn xét tự động?', { title: 'Xét tự động theo điểm chuẩn', ok: 'Xét tự động' }).then(function (yes) {
            if (!yes) return;
            P.rows({ action: 'TS_XetTuyen/LayDSNganhXetTheoKeHoach', method: 'GET', strTS_KeHoachTuyenSinh_Id: kh, strNganhNghe_Id: '',
                strNguoiThucHien_Id: uid() }).then(function (ds) {
                if (!ds.length) { ui.toast('Kế hoạch chưa có ngành xét', 'warn'); return; }
                return ui.batch(ds.map(function (n) {
                    return { action: 'TS_XetTuyen/XetTuyenTuDongTheoNganh', method: 'GET', strTS_KeHoachTuyenSinh_Id: kh,
                        strNganhNghe_Id: n.ID, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang xét tự động theo ngành', okText: 'Thành công' }).then(function () { crud.load(); });
            }, loi('ngành xét'));
        });
    }
    function nganhXet() {
        var kh = keHoach(); if (!kh) return;
        var DS = [];
        /* Lưới nhập chỉ tiêu / điểm xét — NGAY TRONG TRANG, thay chỗ màn (BO-CUC luật 1; trước 30/9 là hộp thoại). Lưu xong ở lại, nạp lại lưới như cũ. */
        var dlg = ums.pat.formTrang({ host: root, title: 'Ngành xét tuyển', icon: 'fa-list-check', cols: 1, body: '<div data-x="bang"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                if (!DS.length) return false;
                ui.batch(DS.map(function (r) {
                    return { action: 'TS_XetTuyen/Sua_TS_KeHoachXet_ChiTieu', method: 'POST', strId: r.ID,
                        dChiTieu: gt('ct', r.ID), dDiemXet: gt('dx', r.ID), strNguoiThucHien_Id: uid() };
                }), { title: 'Đang lưu ngành xét', okText: 'Cập nhật thành công!' }).then(tai);
                return false;
            } }] });
        var host = dlg.body.querySelector('[data-x="bang"]');
        function gt(ma, id) {
            var el = Array.prototype.filter.call(host.querySelectorAll('[data-' + ma + ']'), function (x) { return x.getAttribute('data-' + ma) === id; })[0];
            return el ? el.value.trim() : '';
        }
        function oNhap(ma, id, v) { return '<input class="ums-input ums-input--sm" data-' + ma + '="' + esc(id) + '" value="' + esc(e(v)) + '" autocomplete="off">'; }
        function tai() {
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            P.rows({ action: 'TS_XetTuyen/LayDSTS_KeHoachXet_ChiTieu', method: 'GET', strTS_KeHoachTuyenSinh_Id: kh, strTS_KeHoachXetTuyen: '',
                strNguoiThucHien_Id: uid() }).then(function (d) {
                DS = d;
                ui.table({ el: host, rows: d, stt: true, empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã ngành', prop: 'NGANHNGHE_MA', cls: 'is-nowrap' }, { title: 'Tên ngành', prop: 'NGANHNGHE_TEN' },
                    { title: 'Chỉ tiêu', width: '160px', render: function (r) { return oNhap('ct', r.ID, r.CHITIEU); } },
                    { title: 'Điểm xét', width: '160px', render: function (r) { return oNhap('dx', r.ID, r.DIEMXET); } }] });
            }, function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'ngành xét'); });
        }
        tai();
    }
})();
