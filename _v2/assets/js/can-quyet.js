/* =========================================================================
   ums.canQuyet — sổ những điểm CẦN NGHIỆP VỤ QUYẾT / CẦN KIỂM TRÊN HOST của từng màn đã chuyển.
   Vỏ (app.js) hiện một khung thu gọn "Cần quyết" ở đầu màn có mục trong sổ này.
   Tắt hẳn: site.config.js → behavior.canQuyet = false (khi giao cho người dùng thật).
   Khoá = "<Phân hệ>/Modules/<module>/<tệp html không đuôi>". Mỗi mục:
       q    câu hỏi / điểm cần quyết (bắt buộc)
       now  bản mới đang làm gì trong lúc chờ (tuỳ chọn)
       host true = không phải câu hỏi, chỉ cần KIỂM TRÊN HOST (đường ghi chưa từng chạy, tên cột đoán…)
       ben  'oracle' | 'nghiepvu' = việc giao NGƯỜI KHÁC xử lý (rút từ kiểm thử trực tiếp trên host,
            _harness/kiem-host). Khung hiện nhóm riêng; nút "Xuất việc cần xử lý" gom mọi màn, chia nhóm.
   Quyết xong một mục thì XOÁ mục đó ở đây (và sửa màn theo quyết định), ghi câu + quyết định vào
   _v2/CAN-QUYET-DA-CHOT.md. Chốt hàng loạt: node _harness/chot-can-quyet.js (đã chạy 2026-09-24).
   Hằng CCB / TC / CSV dùng khi thêm câu mới: them(TC + 'module/tep', [{ q: '…', now: '…' }]).
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums || (global.ums = {});
    var CCB = 'ApisCongCanBo/Modules/', TC = 'ApisTaiChinh/Modules/', CSV = 'ApisCongSinhVien/Modules/';
    var S = {};
    function them(k, ds) { k = k.toLowerCase(); S[k] = (S[k] || []).concat(ds); }

    /* Sổ đã CHỐT (lần gần nhất 2026-09-26) theo phương án tạm — các câu cần quyết / kiểm trên host đã chuyển sang
       _v2/CAN-QUYET-DA-CHOT.md. Người dùng 2026-09-26: sổ CHỈ giữ việc liên quan DỮ LIỆU (ben) — câu cần quyết về cách màn chạy thì tự chốt. */
    them("apiscms/modules/danhmuc/cautrucnoidungguiemail", [
        {"man":"Quản trị hệ thống → Danh mục → Cấu trúc nội dung gửi email","q":"Không thêm được cấu trúc email mới — máy chủ báo lỗi thủ tục. Ảnh hưởng: không khai được mẫu email gửi hàng loạt mới (mẫu cũ vẫn dùng được). **Anh:** kiểm lại chữ ký thủ tục thêm so với API. (CMS_TienIch/Them_CauTrucNoiDungGuiEmail → ORA-06550 wrong number or types of arguments in call to THEM_CAUTRUCNOIDUNGGUIEMAIL; tham số giao diện gửi khớp bản gốc từng khoá.)","ben":"oracle"}
    ]);
    them("apiscongcanbo/modules/coithi/coithi", [
        {"man":"Cổng cán bộ → Giám sát thi","q":"Mở màn thì **mọi ô chọn đều trống** (đơn vị, đợt thi, học kỳ, mức phê duyệt, cấu hình thi trắc nghiệm, vi phạm quy chế thi) và báo \"Mất kết nối dịch vụ QLTTN\" → chưa giám sát / duyệt điểm thi trắc nghiệm được. Trình duyệt không tới được máy chủ dịch vụ thi trắc nghiệm (không phải lỗi dữ liệu). **Anh:** kiểm dịch vụ QLTTN có đang chạy không, địa chỉ khai cho tiền tố QLTTN trong Config.js / web.config có đúng và mở được từ máy người dùng không (https, cổng, CORS). (Mọi lời gọi QLTTN_ThongTin/*, QLTTN_QuanLyThi/* báo \"Failed to fetch\".)","ben":"oracle"}
    ]);
    them("apiscongcanbo/modules/coithi/duyetdiemthitracnghiem", [
        {"man":"Cổng cán bộ → Duyệt điểm thi trắc nghiệm","q":"Mở màn thì **mọi ô chọn đều trống** (đơn vị, đợt thi, học kỳ, mức phê duyệt, cấu hình thi trắc nghiệm, vi phạm quy chế thi) và báo \"Mất kết nối dịch vụ QLTTN\" → chưa giám sát / duyệt điểm thi trắc nghiệm được. Trình duyệt không tới được máy chủ dịch vụ thi trắc nghiệm (không phải lỗi dữ liệu). **Anh:** kiểm dịch vụ QLTTN có đang chạy không, địa chỉ khai cho tiền tố QLTTN trong Config.js / web.config có đúng và mở được từ máy người dùng không (https, cổng, CORS). (Mọi lời gọi QLTTN_ThongTin/*, QLTTN_QuanLyThi/* báo \"Failed to fetch\".)","ben":"oracle"}
    ]);
    them("apiscongcanbo/modules/hoso/qtthongtin", [
        {"man":"Cổng cán bộ → Hồ sơ cá nhân → Quá trình thông tin","q":"Không thêm được hoạt động nào: ô **\"Hoạt động\"** trong biểu mẫu không có lựa chọn, máy chủ báo \"Hoạt động không được để trắng\". Ảnh hưởng: cán bộ không tự khai được quá trình / biến động (chức vụ, bằng cấp, chức danh…). **Anh:** nạp danh mục hoạt động nhân sự. (NS_HoatDong_ThongTin/LayDM_NhanSu_HoatDong trả 0 dòng.)","ben":"oracle"}
    ]);
    them("apiscongcanbo/modules/lichgiang/lichgiangnhieuphonghoc", [
        {"man":"Cổng cán bộ → Lịch giảng → Lịch giảng đường (nhiều phòng học)","ben":"oracle","q":"Màn mới có nhãn **sức chứa** từng phòng và ô lọc \"Sức chứa (chỗ)\" (bản kho gốc 29/09/2026), nhưng chưa rõ thủ tục pkg_congthongtincanbo.LayDSPhongHoc trả sức chứa ở cột nào — mã gốc cũng phải dò chín tên cột rồi lấy số \"(N)\" cuối tên phòng. Ảnh hưởng: nếu không có cột sức chứa và tên phòng không kèm \"(N)\" thì nhãn không hiện và lọc sức chứa loại **hết** phòng. **Anh:** cho biết tên cột sức chứa (hoặc bổ sung vào thủ tục); đồng thời xác nhận LayLichPhongHoc có trả IDLICHHOC để nhận đúng buổi dạy của người đang đăng nhập."}
    ]);
    them("apiscongcanbo/modules/thongtinsinhvien/thanhtoanonline", [
        {"man":"Cổng cán bộ → Thanh toán online (thông tin sinh viên)","q":"Cấu hình cổng thanh toán VietinBank (VTB) đang ghi cứng tên đơn vị \"DHLAMNGHIEP\", mã merchant \"0500465853\" — trông như cấu hình của **trường khác**. Rủi ro: tiền sinh viên nộp có thể không về tài khoản của trường. **Nghiệp vụ Tài chính:** xác nhận với ngân hàng thông tin tài khoản / merchant đúng của trường. **Anh:** thay cấu hình trước khi cho sinh viên dùng.","ben":"oracle"}
    ]);
    them("apiskehoachchuongtrinh/modules/chuongtrinhhocphan/cthp", [
        {"man":"Kế hoạch chương trình → Chương trình – học phần → Cập nhật CTDT","ben":"oracle","q":"Hai ô mới ở đầu khung \"Danh sách học phần\" (**khai tương đương / khai thay thế theo từng sinh viên**, bản kho gốc 29/09/2026) lưu bằng thủ tục PKG_KEHOACH_THONGTIN2.CapNhat_MoHinh_ChuongTrinh. Ảnh hưởng: nếu danh sách chương trình chưa trả hai cột này thì mở lại chương trình luôn hiện \"Không\" dù đã lưu \"Có\". **Anh:** (1) xác nhận KHCT_ToChucChuongTrinh/LayDanhSach trên máy chủ đã trả hai cột MOHINHTUONGDUONGTHEOPHAMVI và MOHINHTHAYTHETHEOPHAMVI; (2) cho biết cột thay thế lưu giá trị nào là \"Có\" — mã gốc đọc về nhận cả 1 và 2 nhưng khi lưu chỉ gửi 1 (tham số dMoHinhTT_PhamVi)."}
    ]);
    them("apisquanlydiem/modules/congthucdiem/lophocphan", [
        {"man":"Quản lý điểm → Khai công thức điểm áp dụng cho lớp HP","q":"Lượt kiểm thử ngày 26/9 đã lưu một công thức cho lớp **TTKT.03.K11.01.LH.C04BS.1_LT**, giống hệt công thức lớp đang thừa hưởng (điểm không đổi), nhưng hệ thống **không cho xoá** vì lớp đã có danh sách thi. Ảnh hưởng: lớp này nay giữ công thức riêng — sau này sửa công thức ở cấp chương trình sẽ **không áp xuống lớp này**. **Anh:** xoá dòng công thức thử này để lớp quay về thừa hưởng như trước. (Bảng áp dụng công thức D_CongThucDiem_ApDung, ID dòng 4084811E199B4D1EB4478890442FCE91; Xoa trả \"Danh sach thi da tao, nen khong sua cong thuc\".)","ben":"oracle"}
    ]);
    them("apisrenluyen/modules/tieuchixeploai/tieuchixeploaiapdung", [
        {"man":"Điểm rèn luyện → Tiêu chí xếp loại → Tiêu chí xếp loại áp dụng","q":"Bấm **Thêm mới** hoặc **Sửa** một mức xếp loại áp dụng rồi **Lưu**: máy chủ báo lỗi thủ tục, **không lưu được** (không tạo / không đổi gì). Nút **Kế thừa** và **Xóa toàn bộ** vẫn chạy đúng. Ảnh hưởng: với một khoá / học kỳ chỉ chép được nguyên bộ mức xếp loại chung sang, **không chỉnh được từng mức** (điểm cận trên / dưới, kỷ luật cao nhất, điểm quy đổi) và không thêm lẻ được. **Anh:** sửa hai thủ tục thêm / sửa cho khớp số tham số mà API truyền. (RL_TieuChuanXepLoai_AD/ThemMoi → PLS-00306 wrong number or types of arguments in call to THEM_DRL_TIEUCHUANXEPLOAI_AD; RL_TieuChuanXepLoai_AD/CapNhat → PLS-00306 ở SUA_DRL_TIEUCHUANXEPLOAI_AD. Kiểm host 26/09 và 30/09/2026 — bản gốc gửi y hệt.)","ben":"oracle"}
    ]);
    them("apistaichinh/modules/baocao/baocao", [
        {"man":"Tài chính → Báo cáo → Báo cáo tài chính","q":"Chưa cấu hình **kết nối phần mềm kế toán** (đối tác kế toán, bảng dữ liệu chuyển sang) → các ô liên quan kế toán trống, chưa chuyển số liệu sang kế toán được. Trong menu không có màn nào để khai. **Nghiệp vụ Tài chính:** xác nhận có dùng kết nối kế toán không. **Anh:** nếu có thì cấu hình đối tác và bảng dữ liệu chuyển sang. (TC_KeToan/LayDSAPI_DoiTac, LayDSTenBangDuLieu trả 0.)","ben":"oracle"}
    ]);
    them("apistaichinh/modules/danhmucheso/hethongbienlai", [
        {"man":"Tài chính → Khai báo chung hệ thống → Khai báo hệ thống biên lai","q":"Bấm \"Lưu\" hệ thống biên lai thì màn báo **lỗi CSDL** nhưng máy chủ **vẫn tạo** bản ghi → bấm lại là sinh thêm bản ghi rác (24/09/2026 đã sinh 3 bản ghi chỉ có Mẫu số \"01\" khi thử với các ô số để trống). **Anh:** sửa thủ tục (lỗi thì không được để lại bản ghi), cho biết ô nào bắt buộc, xoá các bản ghi rác. Bản cũ gửi đúng các tham số như bản mới. (TC_BienLai/ThemMoi → \"ORA-00001: unique constraint (QTDHDA.SYS_C0023805) violated\" — có thể ở bước sinh số theo quyển khi Số phiếu/quyển, Độ dài, Số khởi tạo = 0; chưa kiểm vì phải ghi dữ liệu.)","ben":"oracle"},
    ]);
    them("apistaichinh/modules/danhmucheso/kehoachthuchi", [
    ]);
    them("apistaichinh/modules/phieuthu/thutien", [
        {"man":"Tài chính → Thu tiền mặt cho sinh viên, học sinh → Khoản nợ chung → Tạo QR thanh toán","q":"Bấm **Tạo QR thanh toán** thì hộp mở trang thanh toán của cổng thông tin nhưng trang báo **không tìm thấy (404)** → chưa tạo được mã QR cho sinh viên nộp tiền. Mã nguồn (cả bản cũ lẫn bản mới) đã hỗ trợ khai địa chỉ cổng sinh viên riêng; host chưa khai nên đang dùng địa chỉ ứng dụng, nơi không có trang này. **Anh:** khai địa chỉ cổng sinh viên (khoá **TSV**) trong Config.js / Init_API() của host. (Đang mở https://con98.api-apis.com/congthongtin/pages/thanhtoan.aspx?strMa=… → 404. Kiểm host 05/10/2026.)","ben":"oracle"}
    ]);
    them("apistaichinh/modules/danhmucheso/hesolophocphan", [
        {"man": "Tài chính → Khai báo hệ số → Khai hệ số lớp học phần", "ben": "oracle", "q": "Mở màn: danh sách **Lớp học phần** bên trái trống; bấm **Tạo mới → Chọn học phần** cũng \"Không có dữ liệu\" → không khai được hệ số cho lớp học phần nào. Nguyên nhân: thủ tục lấy lớp học phần trả **0 dòng** với mọi khoá, thời gian, từ khoá (trong khi hệ thống có lớp học phần — màn Quản lý điểm vẫn thấy). **Anh:** kiểm thủ tục này đọc bảng nào / điều kiện gì, sửa để trả lớp học phần đang có. (pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_Lop → 0 dòng; bản gốc gọi y hệt, tham số lọc để rỗng. Kiểm host 30/09/2026.)"}
    ]);
    them("apistaichinh/modules/phieuthu/import_phantrammiengiam", [
        {"man":"Tài chính → Import dữ liệu từ file → Nhập danh sách phần trăm miễn theo file","q":"Ô \"Mẫu import\" trống → chưa nhập miễn giảm từ tệp Excel được. Nguyên nhân: chưa có mẫu import / tài khoản chưa được phân quyền mẫu cho chức năng này. **Anh:** tạo mẫu và phân quyền (Quản trị hệ thống → Danh mục → Danh mục import; → Phân quyền import). (SYS_Import_PhanQuyen/LayDanhSach trả 0.)","ben":"oracle"}
    ]);
    them("apistaichinh/modules/phieuthu/import_sotienmiengiam", [
        {"man":"Tài chính → Import dữ liệu từ file → Nhập danh sách số tiền miễn theo file","q":"Ô \"Mẫu import\" trống → chưa nhập miễn giảm từ tệp Excel được. Nguyên nhân: chưa có mẫu import / tài khoản chưa được phân quyền mẫu cho chức năng này. **Anh:** tạo mẫu và phân quyền (Quản trị hệ thống → Danh mục → Danh mục import; → Phân quyền import). (SYS_Import_PhanQuyen/LayDanhSach trả 0.)","ben":"oracle"}
    ]);
    them("apistaichinh/modules/phieuthu/pos_thutien", [
        {"man":"Tài chính → Thu tiền, xuất hóa đơn, biên lai → Danh sách thu tiền qua thiết bị POS","q":"Chưa có **khoản thu nào thu qua máy POS** → danh sách trống. Trong menu không có màn nào để khai. **Nghiệp vụ Tài chính:** xác nhận có thu qua máy POS không, khoản thu nào. **Anh:** nếu có thì cấu hình các khoản thu qua POS. (TC_ThongTinChung/LayDSCacKhoanThuQuaPos trả 0.)","ben":"oracle"}
    ]);
    them("apistaichinh/modules/phieuthu/thutienkhac", [
        {"man":"Tài chính → Thu tiền, xuất hóa đơn, biên lai → Thu tiền mặt cho đối tác đào tạo","q":"Danh sách **người học của đối tác** trống → không chọn được người nộp, chưa thu tiền cho đối tác đào tạo được. **Nghiệp vụ Tài chính:** xác nhận có thu tiền cho đối tác đào tạo không. **Anh:** nếu có thì nạp dữ liệu người học của đối tác. (PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All_DoiTac trả 0.)","ben":"oracle"}
    ]);
    them("apiscongcanbo/modules/sanphamkhoahoc/tapchiquocte", [
        {"man":"Cổng cán bộ → Sản phẩm khoa học → Tạp chí quốc tế","q":"Khi thêm bài báo, mã hệ thống trả về (dùng để gắn **tác giả** vào bài báo — bản cũ cũng làm vậy) **khác** mã của chính bài báo đó trong danh sách (thử ngày 26/9: trả 74D7A79F…, danh sách hiện AD354031…). Nếu đó là hai bản ghi khác nhau thì **tác giả bị gắn sai bài báo** ở mọi lần thêm mới — ảnh hưởng thống kê sản phẩm khoa học của cán bộ. Cùng khung với 10 màn sản phẩm khoa học khác. **Anh:** cho biết mã NCKH_TapChiQuocTe/ThemMoi trả về là mã gì (bài báo hay bản ghi phụ), để biết tác giả có đang gắn đúng không. (Máy chủ chưa có bài báo thật nào để đối chiếu.)","ben":"oracle"}
    ]);
    them("apistaichinh/modules/thongke/theodoicongno", [
        {"man":"Tài chính → Thống kê → Thống kê công, nợ","q":"Ô \"Chương trình đào tạo\" luôn trống vì **lỗi CSDL** → không lọc công nợ theo chương trình được. **Anh:** sửa cho khớp tham số giữa lớp API và thủ tục. (CM_ChuongTrinhDaoTao/LayDanhSach → \"PLS-00306: wrong number or types of arguments in call to LAYDSKS_DAOTAO_TOCHUCCT\" — lớp API gọi thủ tục chưa khớp tham số mới.)","ben":"oracle"}
    ]);

    /* Nhân sự (ApisNhanSu) — ghi lúc chuyển đổi 2026-09-26. */
    them("apisnhansu/modules/quatrinhcongtac/nhiemvuchienluoc", [
        {"man":"Nhân sự → Quá trình công tác → Nhiệm vụ chiến lược","q":"Bấm Xoá báo thành công nhưng **dòng vẫn còn** (đã gặp ở Cổng cán bộ ngày 25/9, màn này gọi cùng thủ tục). **Anh:** sửa thủ tục xoá. (NS_QT_NhiemVuChienLuoc/Xoa trả Success mà không xoá.)","ben":"oracle"}
    ]);
    them("apisnhansu/modules/quanhegiadinh/quanhegiadinh", [
        {"man":"Nhân sự → Gia đình → Quan hệ gia đình","q":"Khối \"Về bản thân\": Cổng cán bộ ghi địa chỉ vào cột NOIO, Nhân sự ghi vào QUEQUAN (cả hai như gốc) → hai màn **không thấy dữ liệu của nhau**. **Nghiệp vụ Nhân sự:** chốt ô này là nơi ở hay quê quán. **Anh:** thống nhất một cột.","ben":"nghiepvu"}
    ]);
    them("apisnhansu/modules/heso/xulybietle", [
        {"man":"Nhân sự → Hệ số → Xử lý biệt lệ","q":"Bấm **Thêm mới**: ô **\"Loại xử lý\"** không có lựa chọn nào (ô lọc cùng tên cũng trống) → không khai được xử lý biệt lệ. Nguyên nhân: hệ thống **chưa có bảng danh mục** loại xử lý biệt lệ — đã tra 607 bảng danh mục, không bảng nào mang mã chứa BIETLE hay bắt đầu bằng NHANSU.LUONG. **Nghiệp vụ Nhân sự:** cho biết các loại xử lý cần dùng. **Anh:** tạo bảng danh mục và nạp giá trị, cho biết mã bảng đúng. (Màn nạp mã \"NHANSU.LUONG,LOAIXULYBIETLE\" — có dấu phẩy, chép nguyên bản gốc, nghi gõ sai; NHANSU.LUONG.LOAIXULYBIETLE cũng 0 dòng. Kiểm host 30/09/2026.)","ben":"oracle"}
    ]);
    ['khoanchucvu', 'quydoigio', 'tangthem'].forEach(function (t) {
        them("apisnhansu/modules/heso/" + t, [
            {"man":"Nhân sự → Hệ số","q":"Ô \"Đơn vị tính\" không có danh mục nào (bản gốc cũng không nạp) → ô đang khoá, khi sửa gửi lại giá trị cũ. **Nghiệp vụ Nhân sự:** cho biết mã bảng danh mục đơn vị tính, hoặc xác nhận bỏ ô này.","ben":"nghiepvu"}
        ]);
    });
    them("apisnhansu/modules/dubao/nangluongtruocthoihan", [
        {"man":"Nhân sự → Dự báo → Nâng lương trước thời hạn","q":"Màn gọi CÙNG lời gọi với màn \"Nâng lương vượt khung\" (như gốc) → danh sách trước thời hạn có thể là danh sách vượt khung. **Anh:** cho biết máy chủ có lời gọi riêng cho nâng lương trước thời hạn không. (NS_DuBao/NangLuongVuotKhung.)","ben":"oracle"}
    ]);
    them("apisnhansu/modules/nhansu/kehoach", [
        {"man":"Nhân sự → Tuyển dụng → Kế hoạch nhân sự","q":"Xoá **đợt** và xoá **hồ sơ ứng viên** nay gọi thủ tục riêng (gốc gọi nhầm thủ tục xoá kế hoạch / xoá đề xuất). Hai thủ tục này bản gốc chưa từng gọi. **Anh:** xác nhận có trong CSDL và nhận strId. (pkg_ns_td_thongtin.Xoa_NS_TD_KeHoach_Dot, Xoa_NS_TD_KeHoach_DeXuat_HS.) Ô \"Loại hội đồng\" chưa có danh mục (gốc không nạp) — cần mã bảng danh mục.","ben":"oracle"}
    ]);

    /* Nhân sự — rút từ kiểm host 2026-09-29 (đọc sâu + thử ghi). */
    them("apisnhansu/modules/luong/dstinhluongtheothang", [
        {"man": "Nhân sự → Lương → Danh sách được tính lương theo tháng", "ben": "oracle", "q": "Mở màn báo lỗi, **hai danh sách đều trống** (nhân sự đã có trong bảng lương và nhân sự còn lại). Ảnh hưởng: không lập được danh sách tính lương tháng. Nguyên nhân: gói thủ tục trên máy chủ **thiếu hai thủ tục** mà API gọi. **Anh:** bổ sung / biên dịch lại hai thủ tục này. (L_BangLuong_NhanSu/LayDanhSach → PLS-00302 'LAYDSNNHANSU_LUONG_BANGLUONG' must be declared; L_BangLuong_NhanSu/LayDSNNhanSu_Luong_ConLai → PLS-00302 'LAYDSNNHANSU_LUONG_CONLAI'. Bản gốc gọi y hệt. Kiểm host 29/09/2026.)"}
    ]);
    them("apisnhansu/modules/luong/quydinhtinhthuethunhapcanhan", [
        {"man": "Nhân sự → Lương → Quy định tính thuế thu nhập cá nhân", "ben": "oracle", "q": "Mở màn báo lỗi, danh sách trống và **không thêm được** quy định thuế. Ảnh hưởng: chưa khai được biểu thuế thu nhập cá nhân; màn **Truy lĩnh** cũng không lưu được vì cần danh sách này. Nguyên nhân: gói thủ tục thiếu thủ tục mà API gọi. **Anh:** bổ sung / biên dịch lại. (L_QuyDinh_ThueThuNhapCaNhan/LayDanhSach → PLS-00302 'LAYDSNHANSU_LUONG_THUETNCN' must be declared; ThemMoi cũng ORA-06550. Bản gốc gọi y hệt. Kiểm host 29/09/2026.)"}
    ]);
    them("apisnhansu/modules/luong/quatrinhluong", [
        {"man": "Nhân sự → Lương → Quá trình lương", "ben": "oracle", "q": "Thêm một dòng quá trình lương thì máy chủ báo **lỗi \"no data found\"**, không tạo được. Ảnh hưởng: không nhập được diễn biến lương của cán bộ ở màn này. **Anh:** kiểm thủ tục thêm — đang tra một bảng (ngạch / bậc / hệ số) mà không có dòng khớp và không bắt lỗi. (NS_QT_Luong/ThemMoi → ORA-01403. Tham số bản mới khớp bản gốc. Kiểm host 29/09/2026 trên hồ sơ tài khoản thử.)"}
    ]);
    them("apisnhansu/modules/kehoach/dexuathoso", [
        {"man": "Nhân sự → Kế hoạch → Đề xuất hồ sơ", "ben": "oracle", "q": "Thêm hồ sơ đề xuất mới thì máy chủ báo lỗi **thiếu mã ngữ cảnh** của người, không tạo được. Ảnh hưởng: không đề xuất được hồ sơ nhân sự mới từ màn này. **Anh:** sửa thủ tục thêm để tự điền CONTEXT_CODE (API và màn gốc đều không gửi giá trị này). (PKG_CORE_HOSONHANSU_05.InsertCorePerson → ORA-01400 cannot insert NULL into PERSON_CONTEXT.CONTEXT_CODE. Kiểm host 29/09/2026.)"}
    ]);
    them("apisnhansu/modules/luong/quydinhphucap", [
        {"man": "Nhân sự → Quản lý lương → Quy định phụ cấp", "ben": "oracle", "q": "Bấm **Thêm mới**, điền đủ ô rồi **Lưu**: máy chủ báo lỗi, không tạo được quy định hưởng phụ cấp nào. Ảnh hưởng: chưa khai được quy định phụ cấp theo ngạch. Nguyên nhân: lớp API gọi thủ tục thêm với số / kiểu tham số không khớp thủ tục trong CSDL. **Anh:** đối chiếu chữ ký thủ tục với lời gọi của API rồi sửa cho khớp. (L_QuyDinhHuongPhuCap/ThemMoi → PLS-00306 wrong number or types of arguments in call to THEM_NHANSU_QUYDINHHUONGPHUCAP; tham số màn gửi khớp bản gốc từng khoá. Kiểm host 30/09/2026 với một Bảng quy định lương thử, đã xoá.)"}
    ]);
    them("apisnhansu/modules/dgplluongtangthem/ketqua", [
        {"man": "Nhân sự → Đánh giá lương tăng thêm → Kết quả phân loại", "ben": "oracle", "q": "Trên menu vai trò Nhân sự, mục **\"Kết quả phân loại\"** khai đường dẫn tệp là **\"dddd\"** (không phải đường dẫn màn) → bấm vào chỉ hiện \"chưa chuyển đổi\" / lỗi 404, ở bản cũ cũng không mở được. **Anh:** sửa đường dẫn tệp của chức năng này ở Quản trị hệ thống → Chức năng (nhiều khả năng là /modules/dgplluongtangthem/html/ketqua.html) hoặc gỡ mục khỏi menu. (Kiểm host 29/09/2026.)"}
    ]);


    them("apisnhansu/modules/quyetdinh/quyetdinh", [
        {"man": "Nhân sự → Quản lý quyết định", "ben": "oracle", "q": "Bấm vào một quyết định đã lưu để **Sửa**: máy chủ trả danh sách **thành viên rỗng** cho mọi quyết định, kể cả quyết định vừa lưu có người. Màn tạm lấy người từ chi tiết quyết định để hiện (chỉ xem), nên **không bỏ được thành viên** khỏi quyết định đã lưu; thêm thành viên mới vẫn làm được. **Anh:** sửa thủ tục lấy thành viên của quyết định. (NS_QuyetDinhNhanSu/LayDanhSach với strNhanSu_ThongTinQD_Id → Data null; NS_ThongTinQuyetDinh/LayChiTiet cùng quyết định có NHANSU_HOSOCANBO_ID. Bản gốc gọi y hệt. Kiểm host 30/09/2026, bản ghi thử đã xoá.)"}
    ]);
    ["apisnhansu", "apiscongcanbo"].forEach(function (a) {
        them(a + "/modules/khenthuongkyluat/khenthuongkyluat", [
            {"man": (a === "apisnhansu" ? "Nhân sự" : "Cổng cán bộ") + " → Khen thưởng - Kỷ luật", "ben": "oracle", "q": "Thêm một **khen thưởng** có số quyết định: máy chủ tự sinh một quyết định kèm nhưng lưu với **trạng thái 0**, nên quyết định đó **không hiện** ở Nhân sự → Quản lý quyết định (danh sách chỉ lấy trạng thái 1). Kỷ luật, danh hiệu, học hàm thì quyết định kèm mang trạng thái 1, hiện bình thường. Ảnh hưởng: tra quyết định khen thưởng theo số không thấy. **Anh:** sửa thủ tục thêm khen thưởng để quyết định kèm mang trạng thái 1. (NS_QT_KhenThuong/ThemMoi gửi iTrangThai = 1; bản ghi NS_ThongTinQuyetDinh sinh kèm có TRANGTHAI = 0. Bản gốc gọi y hệt. Kiểm host 30/09/2026 trên hồ sơ tài khoản thử, đã xoá.)"}
        ]);
    });

    /* Lỗi máy chủ gặp khi kiểm host 24–29/9 mà trước 30/9 CHƯA có trên màn (chỉ ghi trong CLAUDE.md) — người dùng 2026-09-30:
       lỗi máy chủ phải hiện ở Ghi chú chuyển đổi để người xử lý backend nhìn thấy. */
    them("apistaichinh/modules/danhmucheso/hethonghoadon", [
        {"man": "Tài chính → Khai báo chung hệ thống → Khai báo hệ thống hóa đơn", "ben": "oracle", "q": "Bấm **Thêm mới**, nhập mẫu số / ký hiệu **chưa từng có** rồi **Lưu**: màn hiện lỗi vi phạm ràng buộc duy nhất, nhưng bản ghi **vẫn được tạo** (tải lại danh sách là thấy). Ảnh hưởng: người nhập tưởng chưa lưu, nhập lại là sinh trùng hệ thống hoá đơn. Sửa và Xoá chạy bình thường. **Anh:** xem lại thủ tục thêm — sau khi chèn bản ghi chính còn một lệnh chèn nữa bị trùng khoá; sửa để thêm xong trả thành công. (TC_HoaDon/ThemMoi → ORA-00001 unique constraint QTDHDA.SYS_C0023805, gặp cả khi dữ liệu nhập không trùng gì. Bản gốc gọi y hệt. Kiểm host 26/09, 29/09 và 30/09/2026 — bản ghi thử đã xoá.)"}
    ]);
    them("apiscongcanbo/modules/phanlichgiang/tracuulichgiang", [
        {"man": "Cổng cán bộ → GV Tra cứu lịch giảng - xuất BC", "ben": "oracle", "q": "Chọn bộ lọc xong thì ô **Học phần** không có dữ liệu, máy chủ báo lỗi → không tra cứu / xuất báo cáo lịch giảng theo học phần được. Nguyên nhân: câu truy vấn con trong thủ tục trả nhiều hơn một dòng. **Anh:** sửa thủ tục lấy danh sách học phần. (KHCT_LichGiang/LayDSHocPhan → ORA-01427 single-row subquery returns more than one row.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apiscongcanbo/modules/thongke/henganh", [
        {"man": "Cổng cán bộ → Báo cáo thống kê hệ - ngành", "ben": "oracle", "q": "Ô **Năm nhập học** luôn trống vì dịch vụ Kế hoạch chương trình **không có** lời gọi lấy danh sách năm nhập học (máy chủ trả 404). Ảnh hưởng: không lọc thống kê theo năm nhập học; cùng lỗi ở các màn hồ sơ của phân hệ Sinh viên. **Anh:** bổ sung lời gọi này ở dịch vụ kehoachchuongtrinhapi (hoặc cho biết lời gọi thay thế). (KHCT_NamNhapHoc/LayDanhSach → 404 No HTTP resource was found.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apiscongcanbo/modules/nhapdiem/nhapdiemchamkiemtra", [
        {"man": "Cổng cán bộ → Nhập điểm chấm kiểm tra", "ben": "oracle", "q": "Mở màn báo lỗi, **không có danh sách** để nhập điểm chấm kiểm tra. Nguyên nhân: gói thủ tục thi phách – chấm kiểm tra trên CSDL đang **lỗi biên dịch**. **Anh:** biên dịch lại gói PKG_THI_PHACH_CHAMKT và sửa lỗi trong thân gói. (TP_ChamKiemTra/LayDSThiChamKTNhapDiem → ORA-04063 package body \"QTDHDA.PKG_THI_PHACH_CHAMKT\" has errors, ORA-06508.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apisquanlydiem/modules/nhapdiem/nhapdiemchamkiemtra", [
        {"man": "Quản lý điểm → Nhập điểm chấm kiểm tra", "ben": "oracle", "q": "Mở màn báo lỗi, **không có danh sách** để nhập điểm chấm kiểm tra. Nguyên nhân: gói thủ tục thi phách – chấm kiểm tra trên CSDL đang **lỗi biên dịch**. **Anh:** biên dịch lại gói PKG_THI_PHACH_CHAMKT và sửa lỗi trong thân gói. (TP_ChamKiemTra/LayDSThiChamKTNhapDiem → ORA-04063 package body \"QTDHDA.PKG_THI_PHACH_CHAMKT\" has errors, ORA-06508.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apiscongcanbo/modules/quatrinhcongtac/nhiemvuchienluoc", [
        {"man": "Cổng cán bộ → Hồ sơ cá nhân → Nhiệm vụ chiến lược", "ben": "oracle", "q": "Bấm Xoá báo thành công nhưng **dòng vẫn còn**. Lượt kiểm thử 25/9 vì vậy còn để lại một dòng thử (id 71F5751A5EA94D4983F8E45EB1B95456, nội dung \"ZKT1743S\") trong hồ sơ của tài khoản thử. **Anh:** sửa thủ tục xoá và xoá tay dòng trên. (NS_QT_NhiemVuChienLuoc/Xoa trả Success mà không xoá.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apiscms/modules/phanquyen/baocaoimport", [
        {"man": "Quản trị hệ thống → Phân quyền import", "ben": "oracle", "q": "Mở màn báo lỗi, **danh sách người dùng theo chức năng trống** → không xem / gán được phân quyền ở màn này. **Anh:** sửa thủ tục — con trỏ trả về chưa được mở (nhánh điều kiện nào đó không chạy câu truy vấn). (CMS_PhanQuyen_ThongTinChung/LayDSNguoiDungTheoChucNang → ORA-24338 statement handle not executed.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apiscms/modules/phanquyen/diem", [
        {"man": "Quản trị hệ thống → Phân quyền Điểm LQL, Tạo DS L1", "ben": "oracle", "q": "Mở màn báo lỗi, **danh sách người dùng theo chức năng trống** → không xem / gán được phân quyền ở màn này. **Anh:** sửa thủ tục — con trỏ trả về chưa được mở (nhánh điều kiện nào đó không chạy câu truy vấn). (CMS_PhanQuyenDuLieu/LayDSNguoiDungTheoChucNang → ORA-24338 statement handle not executed.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apiscms/modules/phanquyen/canbonhaphosocanbo", [
        {"man": "Quản trị hệ thống → Phân quyền CB nhập HSCB", "ben": "oracle", "q": "Mở màn báo lỗi, **danh sách người dùng theo chức năng trống** → không xem / gán được phân quyền ở màn này. **Anh:** sửa thủ tục — con trỏ trả về chưa được mở (nhánh điều kiện nào đó không chạy câu truy vấn). (CMS_PhanQuyenDuLieu/LayDSNguoiDungTheoChucNang → ORA-24338 statement handle not executed.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apiscms/modules/phanquyen/canhantunhaphoso", [
        {"man": "Quản trị hệ thống → Phân quyền cá nhân tự nhập HS", "ben": "oracle", "q": "Mở màn báo lỗi, **danh sách người dùng theo chức năng trống** → không xem / gán được phân quyền ở màn này. **Anh:** sửa thủ tục — con trỏ trả về chưa được mở (nhánh điều kiện nào đó không chạy câu truy vấn). (CMS_PhanQuyenDuLieu/LayDSCauTrucPhanQuyenCNNhapHS → ORA-24338 statement handle not executed.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apiscms/modules/hethong/config_app", [
        {"man": "Quản trị hệ thống → Cấu hình ứng dụng", "ben": "oracle", "q": "Mở màn thì máy chủ trả **lỗi 500** khi đọc tệp cấu hình → không xem / sửa được cấu hình ứng dụng. **Anh:** kiểm dịch vụ đọc tệp cấu hình (đường dẫn tệp, quyền đọc của tài khoản chạy dịch vụ). (SYS_Xml/GetFile → 500 An error has occurred.) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/thietlap/dieukienxet", [
        {"man": "Xét học bổng → Điều kiện xét", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/thietlap/quyhocbong", [
        {"man": "Xét học bổng → Quỹ học bổng", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/kehoach/kehoach", [
        {"man": "Xét học bổng → Kế hoạch", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/thietlap/phanbohocbong", [
        {"man": "Xét học bổng → Phân bổ học bổng", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/kehoach/thuchienxet", [
        {"man": "Xét học bổng → Thực hiện xét", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/kehoach/xacnhan", [
        {"man": "Xét học bổng → Xác nhận kết quả", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/kehoach/tonghop", [
        {"man": "Xét học bổng → Tổng hợp kết quả", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/kehoach/sotinkehoach", [
        {"man": "Xét học bổng → Số tin kế hoạch", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/thietlap/thamsochung", [
        {"man": "Xét học bổng → Tham số chung", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/thietlap/xeploaihabac", [
        {"man": "Xét học bổng → Xếp loại hạ bậc", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);
    them("apishocbong/modules/vanbang/quanlythongtin", [
        {"man": "Xét học bổng → Quản lý thông tin văn bằng", "ben": "oracle", "q": "**Cả phân hệ Xét học bổng không gọi được máy chủ**: tệp cấu hình địa chỉ dịch vụ trên host chưa khai dịch vụ Học bổng → mọi danh sách trống, không thêm / sửa được gì (giao diện cũ cũng hỏng y hệt). **Anh:** thêm địa chỉ dịch vụ Học bổng (tiền tố HB) vào Config.js / web.config của host. (Init_API() không có objApi[\"HB\"].) (Bản gốc gọi y hệt. Kiểm host 26/09 và 29/09/2026.)"}
    ]);

    /* Xử lý học vụ — rút từ kiểm host đêm 30/09 – 01/10/2026 (thử ghi trên kế hoạch thử, học kỳ 2031_2032_2, đã dọn hết). */
    them("apisxulyhocvu/modules/kehoachxuly/kehoachxuly", [
        {"man":"Xử lý học vụ → Kế hoạch xử lý","ben":"oracle","q":"Bấm **Xét** (ở \"Danh sách xét\", \"Kết quả\" hoặc nút \"Xét Xử lý học vụ\" trong biểu mẫu) thì màn báo **\"Có lỗi\"** kèm một dãy mã khó hiểu, trong khi kết quả xử lý **vẫn được tính và lưu** (mở \"Kết quả\" là thấy). Ảnh hưởng: người dùng tưởng xét hỏng, bấm lại nhiều lần; nếu xét thật sự lỗi cũng không phân biệt được. Giao diện cũ báo y hệt. **Anh:** sửa API xét để trả thành công khi đã tính xong, và trả câu lỗi thật khi hỏng. (XLHV_TinhToan/XuLyHocVuNguoiHoc trả Success = false, Message = đúng giá trị strChucNang_Id gửi lên — thử gửi \"ZZTHU\" thì Message = \"ZZTHU\" — dù dòng XLHV_KetQuaXuLy đã được tạo.)"}
    ]);
    them("apisxulyhocvu/modules/dieukienxuly/dieukienapdung", [
        {"man":"Xử lý học vụ → Điều kiện áp dụng","ben":"oracle","q":"Chọn khoá và thời gian rồi bấm **Xóa toàn bộ** → màn báo **\"Xóa dữ liệu thành công!\"** nhưng **không dòng nào bị xoá** (đã thử cả khi có và không chọn Loại xử lý; xoá từng dòng bằng nút Xóa thì được). Ảnh hưởng: muốn khai lại điều kiện của một khoá / học kỳ thì phải xoá tay từng dòng, người dùng tưởng đã xoá. **Anh:** sửa thủ tục xoá toàn bộ theo khoá × thời gian (× loại xử lý). (XLHV_DieuKienXuLy_AD/Xoa_XLHV_DieuKienXuLy_AD_Tat với strLoaiXuLy_Id, strPhamViApDung_Id = ID khoá, strDaoTao_ThoiGianDaoTao_Id — tham số giống hệt bản gốc; Success = true, danh sách không đổi.)"}
    ]);

    /* Sinh viên (ApisSinhVien) — ghi lúc chuyển đổi 2026-09-26, CHƯA kiểm trên host. */
    ['hoso_danhsach', 'hoso_capnhat', 'hoso_taomoi', 'xemhoso', 'quanlytoanbo'].forEach(function (t) {
        them("apissinhvien/modules/hoso/" + t, [
            {"man":"Sinh viên → Hồ sơ sinh viên","q":"Phần **địa chỉ** của biểu mẫu hồ sơ chỉ lưu được khi danh mục loại địa chỉ có mục \"Nơi sinh\" và \"Hộ khẩu thường trú\". **Anh:** kiểm danh mục PERSON_ADDRESS.ADDRESS_TYPE_CODE. Kèm: loại người mua hoá đơn lẫn hai kiểu (thêm đòi mã chữ, sửa nhận GUID danh mục TS.DOITUONGHOADON — danh mục này đang để chữ hiển thị = mã \"CA_NHAN\"); xoá trắng Email / Điện thoại dùng UpdatePersonContact + dIsActive 0 vì PKG_CORE_HOSONHANSU_05 không có thủ tục xoá liên hệ.","ben":"oracle"}
        ]);
    });
    ['kehoach/xacnhanketqua', 'quyetdinh/quyetdinh', 'quyetdinh/thucthiquyetdinh', 'tinhtrangquanso/tinhtrangquanso'].forEach(function (t) {
        them("apissinhvien/modules/" + t, [
            {"man":"Sinh viên","q":"Ô **\"Năm nhập học\"** sẽ trống: lời gọi danh sách năm nhập học đang trả 404 trên host (đã gặp ở Cổng cán bộ → Thống kê → Hẹn gánh). **Anh:** bật lại API. (KHCT_NamNhapHoc/LayDanhSach.)","ben":"oracle"}
        ]);
    });
    them("apissinhvien/modules/kehoach/kehoach", [
        {"man":"Sinh viên → Kế hoạch → Kế hoạch","q":"Không có lời gọi **xoá kế hoạch** người học (bản cũ gọi nhầm thủ tục xoá phạm vi với id kế hoạch nên chưa bao giờ xoá được) → nút Xoá đã bỏ. **Anh:** bổ sung thủ tục xoá kế hoạch nếu cần. **Nghiệp vụ:** có dùng \"Cán bộ phân công xét\" không (bản cũ đã tắt lưu, nút đang khoá).","ben":"oracle"}
    ]);
    them("apissinhvien/modules/vexe/xebus", [
        {"man":"Sinh viên → Vé xe → Xe bus","q":"Thêm tuyến xe không gắn được với kế hoạch (thủ tục không nhận id kế hoạch), và \"Chi tiết\" đăng ký thiếu tuyến / tháng đã đăng ký của từng người học. **Anh:** bổ sung tham số / cột. (SV_XeBus/Them_QLSV_XeBus_TuyenXe, LayDSKeHoach_XeBus_DangKy.)","ben":"oracle"}
    ]);

    /* Nhập học (ApisNhapHoc) — ghi lúc chuyển đổi 2026-09-27, CHƯA kiểm trên host. */
    them("apisnhaphoc/modules/taichinh/checkinnhaphoc", [
        {"man":"Nhập học → Tài chính nhập học → Check-in nhập học","q":"Mã QR thanh toán viết cứng ngân hàng **970418**, mẫu JIzXIaG, tên tài khoản **\"TRUONG DAI HOC CMC\"**; mã vạch lấy ảnh từ barcode.tec-it.com (như gốc). **Nghiệp vụ Tài chính:** xác nhận đúng tài khoản của trường.","ben":"nghiepvu"}
    ]);
    them("apisnhaphoc/modules/hethong/tracuuphieuthu", [
        {"man":"Nhập học → Hệ thống → Tra cứu phiếu thu","q":"Để trống ô **Nhân sự** thì chỉ thấy phiếu do **chính người đăng nhập** thu (như gốc — tầng gọi API tự điền người thực hiện). **Nghiệp vụ:** xác nhận đây là ý định.","ben":"nghiepvu"}
    ]);
    them("apisnhaphoc/modules/trungtuyen/kehoachtuyensinhnew", [
        {"man":"Nhập học → Kế hoạch nhập học (new) → Bố trí nhân sự","q":"Danh sách nhân sự của kế hoạch **thiếu họ tên / mã / đơn vị** (thủ tục nối sai bảng — chính bản gốc đã ghi nhận; màn tạm bù tên từ hồ sơ nhân sự). **Anh:** sửa PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhanSu (PERSON_HOTEN, PERSON_MA, DONVI_TEN). Kèm: xác nhận Thêm/Sửa nhân sự có nhận trạng thái phân công + hiệu lực không; khai các danh mục NH_KEHOACH_NHAPHOC.NHAPHOC_TYPE_CODE, NH_KEHOACH_NHAPHOC.STA, NH_KEHOACH_NHANSU.VAITRO_NHAPHOC_CODE, NH_KEHOACH_NHANSU.PHANCONG_STATUS_CODE (đang dùng danh sách dự phòng viết cứng).","ben":"oracle"}
    ]);
    them("apisnhaphoc/modules/phanlop/phanlop", [
        {"man":"Nhập học → Phân lớp → Phân lớp","q":"Thư / giấy nhập học lấy nội dung từ danh mục **NH.GNH** (THONGTIN3/4/5, TEN). Bản gốc chạy các ô này như mã lệnh; bản mới chỉ hiểu dạng nối **'chữ' + aData.COT** — dạng khác sẽ giữ nguyên chữ. **Anh:** kiểm nội dung danh mục NH.GNH.","ben":"oracle"}
    ]);

    /* Tuyển sinh (ApisQuanlyTuyenSinh) — ghi lúc chuyển đổi 2026-09-27, CHƯA kiểm trên host. */
    ['hoso/quanlyhosomorong', 'tuyensinh/kehoachtuyensinhnew'].forEach(function (t) {
        them("apisquanlytuyensinh/modules/" + t, [
            {"man":"Tuyển sinh → Đọc dữ liệu từ API ngoài (CRM CMC, tuyensinh.uhd, HRM Phenikaa)","q":"Bản cũ **viết thẳng tài khoản, mật khẩu và token** của các hệ ngoài trong mã JS (CRM Basic, \"Bearer HaiDuong@2025\", mật khẩu HRM Phenikaa, token CMC) — ai mở mã nguồn trang cũng đọc được. Bản mới KHÔNG chép, nên chức năng đọc từ API ngoài chưa chạy tới khi có cấu hình. **Anh:** thu hồi / đổi các token, mật khẩu đó; đưa địa chỉ + khoá xác thực về cấu hình phía máy chủ (tạm thời có thể nhập ở ô trên màn).","ben":"oracle"}
        ]);
    });
    them("apisquanlytuyensinh/modules/tuyensinh/kehoachtuyensinhnew", [
        {"man":"Tuyển sinh → Kế hoạch tuyển sinh (new) → Kết quả đăng ký","q":"Tìm hồ sơ phân biệt HOA / thường (màn đang thử nhiều kiểu viết như gốc). **Anh:** sửa thủ tục LayDS_HoSo_TS so khớp bằng UPPER().","ben":"oracle"}
    ]);

    /* Nghiên cứu khoa học (ApisNCKH) — ghi lúc chuyển đổi 2026-09-27, CHƯA kiểm trên host. */
    ['quanlysanpham/hoidongdaoduc', 'xacnhankekhai/hoidongdaoduc'].forEach(function (t) {
        them("apisnckh/modules/" + t, [
            {"man":"Nghiên cứu khoa học → Hội đồng đạo đức","q":"Biểu mẫu có ô **Số hội đồng, Trạng thái, Mô tả, Năm tham gia** nhưng thủ tục lưu của bản gốc không có tham số tương ứng → ba ô đầu **hiện mà chưa lưu được** (Năm tham gia đang gửi vào strNamBaoCao / strNamHoanThanh). **Anh:** cho biết tên tham số thật của NCKH_SP_HoiDongDaoDuc (ThemMoi / CapNhat) cho các ô này.","ben":"oracle"}
        ]);
    });
    them("apisnckh/modules/quanlyhoso/quanlyhoso", [
        {"man":"Nghiên cứu khoa học → Quản lý hồ sơ","q":"Bản gốc bấm Sửa lại gọi ThemMoi (tạo bản trùng); bản mới gọi **SV_KeHoach_HoSo/CapNhat** (strId = ID người học) và Xoá gọi **SV_KeHoach_HoSo/Xoa**. Tệp minh chứng nay khoá theo ID người học + ID trường (gốc chỉ ID trường → mọi SV dùng chung một bộ tệp; tệp đã gắn theo khoá cũ sẽ không hiện). **Anh:** xác nhận CapNhat có tồn tại, Xoa nhận ID người học hay ID dòng phạm vi, và có cần chuyển tệp cũ không.","ben":"oracle"}
    ]);
    them("apisnckh/modules/baocao/hoidongxetchucdanh", [
        {"man":"Nghiên cứu khoa học → Báo cáo → Hội đồng xét chức danh","q":"Cột **Họ tên ứng viên** đang đọc DOITUONGDEXUAT_TEN, cột **Đơn vị** và **Ghi chú** luôn trống (bản gốc cũng vậy). **Anh:** cho biết tên cột thật thủ tục trả cho ba cột này.","ben":"oracle"}
    ]);
    ['baocao/detai', 'baocao/hoinghihoithao'].forEach(function (t) {
        them("apisnckh/modules/" + t, [
            {"man":"Nghiên cứu khoa học → Báo cáo → " + (t === 'baocao/detai' ? 'Đề tài' : 'Hội nghị/hội thảo'),"q":"Ô lọc **thời gian** có trên màn nhưng bản gốc không có nguồn dữ liệu và thủ tục danh sách không nhận tham số thời gian → ô đang **khoá**. **Anh:** nếu cần lọc theo thời gian thì bổ sung tham số cho thủ tục và cho biết nguồn danh sách thời gian.","ben":"oracle"}
        ]);
    });
    them("apisnckh/modules/baocao/vanbangsangche", [
        {"man":"Nghiên cứu khoa học → Báo cáo → Văn bằng sáng chế","q":"Ô **Đơn vị** có trên màn nhưng thủ tục danh sách không nhận tham số đơn vị → ô đang **khoá**, chưa lọc theo đơn vị được. **Anh:** bổ sung tham số nếu nghiệp vụ cần.","ben":"oracle"}
    ]);

    /* Thi phách (ApisThiPhach) — ghi lúc chuyển đổi 2026-09-29, CHƯA kiểm trên host. */
    them("apisthiphach/modules/kehoach/phuckhao", [
        {"man":"Thi phách → Khảo thí duyệt đk Phúc Khảo → Khai báo thời hạn phúc khảo theo đợt thi","q":"Nút **Xóa** thời hạn phúc khảo đang **khoá**: bản cũ gọi nhầm thủ tục xoá đơn giá khối lượng giảng dạy (NS_KLGD_TinhTien_MH · PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia) nên bản mới không gọi. Ảnh hưởng: thời hạn khai sai chỉ sửa được, chưa xoá được. **Anh:** cho biết (hoặc bổ sung) thủ tục + action xoá thời hạn phúc khảo của phân hệ thi.","ben":"oracle"}
    ]);
    them("apisthiphach/modules/kehoach/xacnhan", [
        {"man":"Thi phách → Xác nhận (xacnhan — không có trên menu)","q":"Màn là bản chép dở từ Tốt nghiệp: danh sách và lưu xác nhận dùng **TP_XacNhanSauThi**, nhưng các nút tình trạng lấy từ **TN_XacNhan/LayDSTinhTrangXacNhan** (dịch vụ Tốt nghiệp, strPhanLoai_Id rỗng) và **không có lời gọi hủy xác nhận** (nút đang khoá). Ảnh hưởng: nếu nguồn Tốt nghiệp không trả tình trạng thì hộp xác nhận không có nút nào. **Anh:** xác nhận màn này còn dùng không; nếu còn, cho biết nguồn tình trạng đúng (màn anh em dùng TP_Chung/LayTrangThaiSauThi) và thủ tục hủy.","ben":"oracle"}
    ]);

    /* Tốt nghiệp (ApisTotNghiep) — ghi lúc chuyển đổi 2026-10-05, CHƯA kiểm trên host. */
    them("apistotnghiep/modules/kehoach/dieukiennhom", [
        {"man":"Tốt nghiệp → Thiết lập điều kiện → Điều kiện nhóm → Xem danh sách các lệnh điều kiện / xếp loại","q":"Nút **Xóa** lệnh đang **khoá**: bản cũ gọi nhầm thủ tục xoá của màn Khoản thu Tài chính (pkg_taichinh_kehoach.Xoa_TC_KhoanThu_QDXuatHD) với id lệnh — bấm ở bản cũ có nguy cơ xoá nhầm dữ liệu Tài chính. Ảnh hưởng: lệnh khai sai chỉ sửa được, chưa xoá được. **Anh:** bổ sung thủ tục + action xoá lệnh từ khoá cho TN_XetDuyet_TuKhoa và TN_XepLoai_TuKhoa (và nên gỡ lời gọi nhầm khỏi bản cũ).","ben":"oracle"}
    ]);

    ums.canQuyet = S;
    /* Phân hệ CHƯA kiểm trên host: mục của các phân hệ này ghi lúc chuyển đổi, chưa xác nhận trên hệ thật — bảng "Màn đang có lỗi backend"
       gắn nhãn "chưa kiểm trên host". Kiểm xong phân hệ nào thì gỡ tiền tố của nó khỏi đây. */
    ums.canQuyetChuaKiem = ['apissinhvien/', 'apisnhaphoc/', 'apisquanlytuyensinh/', 'apisnckh/', 'apisthiphach/', 'apiskehoachchuongtrinh/', 'apistotnghiep/', 'apisquanlythitracnghiem/', 'apistintuc/'];
    ums.canQuyetKhoa = function (url) { return String(url || '').replace(/\.html?(\?.*)?$/i, '').replace(/\/html\//i, '/').toLowerCase(); };
})(window);
