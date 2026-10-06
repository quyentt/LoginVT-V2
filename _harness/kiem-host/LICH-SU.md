# Lịch sử kiểm host — nhật ký theo ngày (chuyển nguyên văn từ CLAUDE.md mục 9 ngày 2026-10-05)

Luật kiểm host hiện hành nằm ở CLAUDE.md mục 9 (bản rút gọn). Tệp này là nhật ký từng đợt 24/9 → 1/10 để tra cứu khi cần
(vai trò đã kiểm, màn sạch / từ chối, sự cố, bản ghi thử còn sót, bẫy bộ thử). Sổ máy: `da-kiem.json`; việc đang treo: `VIEC-PHIEN-SAU.md`.

- **Kiểm thử trực tiếp trên host** (người dùng nói "kiểm thử trực tiếp"): `_harness/kiem-host/` — Edge
  CÓ CỬA SỔ lái qua DevTools (cổng 9333), `node dangnhap.js` → `menu.js <roleId>` → `chay-vaitro.js <roleId>`.
  Tài khoản `tk.md`; kết quả/ảnh ở `%TEMP%/ums-kiem-host` (dữ liệu thật, ngoài dự án). CHỈ ĐỌC. Lần đầu
  2026-09-24: Tài chính 57 màn — `_v2` không lỗi; trống do thiếu dữ liệu, 5 mục menu trỏ tệp không tồn tại,
  2 procedure lỗi phía máy chủ (`LayDSTC_BC_PhanBo_DacThu` ORA-24338, `CM_ChuongTrinhDaoTao` PLS-00306).
- **Kiểm host 2026-09-25 — ĐÃ XONG, lần sau KHÔNG kiểm lại phần này:**
  - **Đọc sâu** (`SAU=1 node chay-vaitro.js`, mở tab / trang 2 / Xem-Sửa-Thêm rồi Đóng) 318 màn, 7 vai trò: Chuyên cần
    `9FE0F1…` (thực chất gồm Cổng cán bộ, 89 màn), Cổng cán bộ(admin) `B0B172…` 87, Cổng cán bộ `9FDE9F…` 25, QTHT `31C395…` 44,
    Đăng ký học `D71078…` 15, Học lại thi lại `116022…` 1, Tài chính `8CA298…` 57. Tất cả mở được. Kết quả
    `%TEMP%/ums-kiem-host/ketqua-<6 ký tự>-sau.json`. CHƯA đọc: Cổng SV thủ vai `80CF9E…` (script chưa lo bước thủ vai).
  - **Lỗi `_v2` đã sửa (vào gói deploy 25/9) — sau khi deploy chỉ cần kiểm lại 3 màn này:** `taikhoanno` (Sửa gửi
    `Them_` → tạo dòng mới; nay `Sua_API_KeToan_Khoan_HT`), `thongke/giangduong` (`NS_HoSoV2/LayDanhSach` thiếu GET → 405),
    `luong/luongvathunhapkhac` (`dLaCanBoNgoaiTruong` rỗng → 400; nay -1 như gốc).
  - **Lỗi máy chủ (gốc gọi y hệt, không sửa `_v2`):** ORA-24338 ở 4 màn phân quyền CMS (`LayDSNguoiDungTheoChucNang`,
    `LayDSCauTrucPhanQuyenCNNhapHS`) + `phanbodoanhthu`; ORA-04063 `PKG_THI_PHACH_CHAMKT` (nhapdiemchamkiemtra); ORA-01427
    `KHCT_LichGiang/LayDSHocPhan` (tracuulichgiang); 404 `KHCT_NamNhapHoc/LayDanhSach` (henganh); 500 `SYS_Xml/GetFile`
    (config_app); dịch vụ QLTTN từ chối kết nối (coithi, duyetdiemthitracnghiem). Menu trỏ tệp không có: 5 mục TC (đã biết),
    CMS sql/test/hello (cố ý bỏ), `lapdanhsach` (Học lại chưa chuyển).
  - **Thử ghi** (`thu-ghi.js`, dấu ZKT<ggpp>) — SẠCH: TC `kyhieuchuongtrinh`, `khoanthu`; CCB `quatrinhsuckhoe`, `nghithaisan`,
    `quatrinhdaotao`, `cacmonhocdagiangday`, `hoatdongxahoi_giangday`, `quatrinhcongtac`, `dinuocngoai`, `danhsachgiamtrugiacanh`.
    Máy chủ từ chối thêm (không tạo gì): `quatrinhchucvu` đòi Ngày QĐ, `hoso/qtthongtin` đòi Hoạt động — biểu mẫu chưa đánh
    dấu bắt buộc. `nghithaisan`: Thêm không cần Ngày QĐ nhưng Sửa lại đòi.
  - **Dọn tồn (2026-09-25, `_harness/kiem-host/don-sot-0925.js`):** MST hồ sơ tài khoản thử ĐÃ khôi phục `0001` (ô "Mã số
    thuế" của Giảm trừ gia cảnh ghi thẳng vào HỒ SƠ cán bộ, như gốc; `thu-ghi.js` nay bỏ qua `strMaSoThue`).
    **⚠ CÒN 1 dòng thử KHÔNG xoá được:** `quatrinhcongtac/nhiemvuchienluoc` id `71F5751A5EA94D4983F8E45EB1B95456` (`ZKT1743S`, hồ sơ
    tài khoản thử). `NS_QT_NhiemVuChienLuoc/Xoa` (gốc gọi y hệt, strIds/strId đều thử) trả Success mà không xoá → lỗi procedure
    phía máy chủ, cần quản lý CSDL xoá tay + sửa procedure. Đừng thử ghi màn này tới khi sửa.
  - **Quyền (người dùng cấp 2026-09-25): được thử ghi TẤT CẢ màn, xong phải XOÁ (và hoàn lại giá trị bị ghi lan).**
- **Kiểm host 2026-09-26 — ĐÃ XONG (5 phân hệ mới chuyển), lần sau KHÔNG kiểm lại:**
  - **Đọc sâu** 63 màn: Học lại `116022…` 1 (menu host chỉ có lapdanhsach), Rèn luyện `4E6532…` 8, XLHV `7CA2C9…` 7,
    Học bổng `D66824…` 8, Quản lý điểm `4ADAFD…` 39. Tất cả mở được.
  - **Học bổng KHÔNG gọi được máy chủ:** `Config.js` trên host thiếu tiền tố `HB` trong `Init_API()` (bản gốc Core:605 cũng
    đọc `objApi['HB']` → hỏng y hệt). Việc của quản trị cấu hình; chưa thử ghi Học bổng.
  - **Lỗi `_v2` đã sửa (gói deploy 26/9):** `kehoach/quydoichungchi` (`D_CongThucDiem/LayDanhSach`, `KHCT_HocPhan/LayDanhSach`
    thiếu GET → 405) và cùng lỗi ở `congthucdiem/congthucdiemapdung` (ô xâu công thức trong bảng). Sau deploy kiểm lại 2 màn này.
  - **Thử ghi — SẠCH qua giao diện (thêm/sửa/xoá):** QLD `khaibaothanhphandiem`, `thamsodanhgiaketqua`, `khaibaodiemdacbiet`;
    RL `tieuchidiem`; XLHV `khaibaodieukien`. **Thêm + xoá bằng lời gọi** (danh sách không hiện bản ghi thử vì lọc theo
    năm/khoá; đối chứng `LayChiTiet` có→không): QLD `khaibaothamsochung`, `thamsoquydoithangdiem`, `khaibaothamsotinhdiem`,
    `khaibaothamsolamtron`; RL `hesoapdung`; QLD `kehoach` (tự dựng, lưu xong ở lại biểu mẫu — đã dọn `6F81C07D…`).
  - **Máy chủ từ chối thêm (kiểm dữ liệu hợp lý, không tạo gì):** RL `tieuchixeploai` (đã tồn tại), `tieuchidiemapdung`
    (để trắng), XLHV `dieukienapdung`, `kehoachxuly`, QLD `khaibaocongthucdiem` (biểu thức không cân bằng), `quydoichungchi`
    (chỉ dùng 1 trong 2: loại CC có sẵn / mới). **Nghi lỗi máy chủ:** RL `tieuchixeploaiapdung` ORA-06550 sai chữ ký
    `THEM_DRL_TIEUCHUANXEPLOAI_AD` (tham số `_v2` khớp gốc từng khoá).
  - **Cố ý chưa ghi:** nhập điểm / điểm miễn / phúc khảo / ra quyết định / phê duyệt (ghi vào điểm, quyết định của SV thật —
    "xoá" = hoàn điểm cũ, cần người dùng chỉ định lớp/SV thử). `phanquyen/diem` không có ô chữ để gắn dấu → bỏ qua.
  - **Đợt 2 cùng ngày (người dùng: "kiểm thử và tự quyết nếu thấy hợp lý"):**
    · Đọc lại 7 vai trò sau khi sửa lỗi bộ thử chọn nhầm ô của khung "Ghi chú chuyển đổi" (`.ums-canquyet` — nay mọi script
      bỏ qua; đã xoá 393 câu trả lời bị ghi nhầm trong hồ sơ Edge của bộ thử): kết quả trùng lần trước. Xác nhận trên host bản
      deploy đã có: `giangduong` (21 dòng), `luongvathunhapkhac` (hết 400), `taikhoanno` (Sửa → `Sua_…`, đúng dòng, sạch).
    · SẠCH (`thu-apdung.js`, thêm qua giao diện, xoá bằng nút Xóa của đúng dòng, số dòng về như cũ): 8/8 màn "… áp dụng" QLD +
      `cauhinhhienthichung` (`KHUNG=ch`) + XLHV `kehoachxuly` (`thu-ghi-ui.js FULL=1`, thêm/sửa/xoá đủ qua giao diện).
      `cauhinhhienthi` (theo người dùng) không thêm được dòng mới — như gốc. Ô "Giá trị mặc định", Độ rộng/Cỡ chữ là ô chữ
      nhưng máy chủ chỉ nhận số (ORA-01722) — có thể đổi sang ô số.
    · Màn ghi điểm / xử lý học vụ (nhập điểm RL, tổng hợp, thực hiện/phê duyệt/ra quyết định, miễn, phúc khảo): 0 dòng dữ liệu
      ở hệ Đại học chính quy → không có gì để thử. **Nhập điểm KHÔNG thử** (xem sự cố dưới).
    · **⚠ SỰ CỐ — CÒN 1 dòng không gỡ được:** "Công thức theo lớp HP" Lưu = THÊM dòng `D_CongThucDiem_ApDung` cho lớp (strId
      rỗng). Thử "tổng bằng 0" (lưu nguyên xâu rồi xoá) trên lớp `TTKT.03.K11.01.LH.C04BS.1_LT` (ID lớp `…45D211203BF49D293BFC0F7E688B704`):
      thêm được dòng `4084811E199B4D1EB4478890442FCE91` (xâu `#CC1#*0.1+#GK#*0.2+#THI1#*0.7` — GIỐNG HỆT công thức kế thừa đang hiện,
      điểm không đổi), nhưng `D_CongThucDiem_ApDung/Xoa` bị chặn: "Danh sach thi da tao, nen khong sua cong thuc". Ảnh hưởng: lớp
      này nay có công thức riêng → sửa công thức cấp chương trình sau này sẽ KHÔNG lan tới lớp. KHÔNG dùng "Mở khóa" (tạo bản ghi
      mở chặn không có lời gọi xoá). Cần quản lý CSDL xoá tay dòng trên. **Bài học: không thử ghi dữ liệu gắn lớp đã có danh sách
      thi / điểm — thêm được mà máy chủ chặn gỡ.**
  - **Đợt 3 cùng ngày ("tiếp tục kiểm những màn khác"; luật mới: gốc phải có Xoa cho chính loại dữ liệu, không gắn lớp đã có
    danh sách thi/điểm, không hiện ra trước SV/người khác):**
    · SẠCH (thêm/sửa/xoá qua giao diện): CMS `ungdung`, `vaitro`; CCB `quatrinhchucvu` (FULL), `quanhegiadinh`,
      `khenthuongkyluat`, `danhhieuhocham` (4 màn CCB có đối chứng `LayChiTiet` có→không).
    · Máy chủ lỗi (ghi `can-quyet.js`, nhóm oracle): CMS `cautrucnoidungguiemail` + RL `tieuchixeploaiapdung` ORA-06550 sai chữ
      ký thủ tục; CCB `hoso/qtthongtin` danh mục hoạt động nhân sự rỗng (`LayDM_NhanSu_HoatDong` 0 dòng) → không thêm được.
    · CCB `sanphamkhoahoc/tapchiquocte`: thêm được, đã dọn (host CHƯA có bài báo thật nào). Id `ThemMoi` trả (dùng gắn tác giả,
      như gốc) KHÁC cột ID trong danh sách → ghi `can-quyet.js` (host) và KHÔNG thử 10 màn sản phẩm KH còn lại (sợ tác giả mồ côi).
    · Bỏ: CMS `ungdungchucnang` (gốc không có Xoa), CMS `danhmucdulieu` (nút Thêm khoá tới khi chọn danh mục bên trái — chưa làm).
    · Chưa làm (cần người dùng cho): kế hoạch đăng ký, tin tức/văn bản/sự kiện/khảo sát, miễn giảm, gia hạn, cấu hình tính phí,
      kết nối thanh toán, Cổng SV thủ vai (ghi vào dữ liệu SV thật), 10 màn sản phẩm KH, Học bổng (host thiếu API `HB`).
  - **Đợt 4 cùng ngày ("chạy luôn đi", thủ vai SV Đặng Bác Ái):**
    · **Cổng SV thủ vai `80CF9E…` — ĐÃ ĐỌC SÂU 22 màn** (`THUVAI="Đặng Bác Ái" SAU=1 node chay-vaitro.js 80CF9E…` — bước
      thủ vai mới trong chay-vaitro; vào vai DCQT.14.420233195, CHỈ ĐỌC). Tất cả mở được, "Theo dõi kết quả học tập" đủ 18 bảng.
      Sửa `_v2` `dangkyhoc/dangky.js`: không có kế hoạch đăng ký thì không gọi `LayDSHocPhanDangToChuc` (gốc vẫn gọi → máy chủ
      "Phai chon ke hoach dang ky hoc" hiện thành lỗi trước SV) → nay báo "Chưa có kế hoạch đăng ký". Kiểm lại sau deploy.
      Mục "Kiểm tra thông tin cá nhân" trỏ `ApisSinhVien/dicvusinhvien` (phân hệ chưa chuyển) — đúng là "chưa chuyển đổi".
    · CMS `danhmucdulieu` SẠCH (`BAM=".ums-master__item"` — bấm mục trái trước; thêm/sửa/xoá qua giao diện, danh mục CHUNG.LNHV).
      Bẫy bộ thử đã vá: lời gọi thêm/sửa là action MÃ HOÁ không func → không có chữ "Them" → nay lấy lời gọi ghi đầu tiên
      không phải "Lay…". (Lần chạy đầu để sót `ZKT1218`, đã dọn ngay: 20 → 19 dòng như cũ.)
  - **Công cụ:** `thu-ghi.js` thêm `FULL=1` (điền mọi ô trống, ô `d…`/`i…` = 1, ô ngày = hôm nay) + đối chứng `LayChiTiet`
    sau thêm / sau xoá. `thu-ghi-ui.js` đã chạy lần đầu (3 màn tự dựng). Kết quả `%TEMP%/ums-kiem-host/ghi-*-0926.log`.
  - **Chưa thử ghi (việc tiếp theo):** màn tự dựng (bộ thử `thu-ghi-ui.js` đã viết, CHƯA chạy lần nào),
    CMS, Đăng ký học. Cố ý KHÔNG thử ghi: hoá đơn/phiếu thu/biên lai, kết nối thanh toán, cấu hình tính phí, miễn giảm, gia hạn,
    kế hoạch đăng ký, tin tức/văn bản/sự kiện/khảo sát, điểm, chuyên cần, thi, phân quyền/người dùng/vai trò, công cụ CSDL.
- **SỔ ĐÃ KIỂM HOST (từ 2026-09-29): `_harness/kiem-host/da-kiem.json`** — từng màn: đọc sâu (`doc`) + thử ghi (`ghi`) + ghi chú. Trước khi kiểm
  host một phân hệ PHẢI xem sổ này, màn đã có thì KHÔNG kiểm lại (trừ khi mã màn đó đổi). Ghi sổ: `TU=<ngày> node _harness/kiem-host/ghi-da-kiem.js
  <ApisXxx> <roleId…>` (mục sửa tay đặt `"tay": true`); trang `_harness/tien-do.html` có khối "Đã kiểm trên host" đọc từ sổ (chạy lại `tien-do.py`).
  **Cách làm (người dùng chốt 29/9): CUỐN CHIẾU từng phân hệ** — đọc sâu → thử ghi (thêm thì xoá) → lỗi mã thì sửa `_v2`, lỗi CSDL / backend thì ghi
  `can-quyet.js` → ghi sổ → DỪNG báo cáo rồi mới sang phân hệ kế. Tóm tắt kết quả không cần mở JSON: `node _harness/kiem-host/tom-tat.js <6 ký tự>`.
  Bộ thử nay: `chay-vaitro.js` tự bấm mục đầu cột trái; `thu-ghi.js` / `thu-ghi-ui.js` nhận `TIM="Kadara"` (hồ sơ cán bộ của tài khoản thử: mã 01,
  họ đệm "Kadara H. Azz" — chọn theo `data-id` = userId, không thấy thì BỎ màn, không ghi vào hồ sơ người khác), chặn màn không khai `remove`.
  Màn dạng cây (Cơ cấu tổ chức) bộ thử không tìm được dòng → phải xoá bằng lời gọi của màn ngay sau khi thêm.
- **⚠ VIỆC CHO PHIÊN KIỂM HOST KẾ TIẾP: đọc `_harness/kiem-host/VIEC-PHIEN-SAU.md`** (viết 30/9, người dùng tạm nghỉ sau phiên 29–30/9). Tệp đó có: thông báo
  đầu phiên, màn đã sửa mã chờ kiểm lại, việc mã còn nợ, thử ghi dang dở từng phân hệ, phân hệ chưa kiểm, bản ghi thử còn sót, công cụ. Làm xong việc nào thì sửa tệp.
  Lượt kiểm trưa 30/9 (sau khi người dùng up 6 tệp — đã so băm với host, `--da-up`): kiểm lại ĐẠT và gỡ khỏi sổ lỗi mã Khen thưởng - Kỷ luật, Danh hiệu -
  Học hàm (Nhân sự + Cổng cán bộ; máy chủ nay tự xoá quyết định kèm của kỷ luật / khen thưởng / danh hiệu, riêng HỌC HÀM màn phải dọn), Đề xuất hồ sơ (dòng định
  danh trống, ngày sinh thành viên gia đình). **Sổ lỗi mã TRỐNG.** Tài chính thử ghi XONG (6 sạch, 6 tra cứu, 38 cố ý không thử). `hethonghoadon`: Thêm báo
  ORA-00001 nhưng bản ghi VẪN tạo, kể cả dữ liệu không trùng → lỗi thủ tục, ĐỪNG đổi ORA-00001 thành câu "trùng dữ liệu". Gói bổ sung CHƯA UP: `ref.js`
  (`xoaQuyetDinhKem` tìm cả trạng thái 0 và 1), `can-quyet.js` — người dùng ĐÃ UP chiều 30/9, kiểm lại học hàm ĐẠT. Xoá thành viên gia đình ở Đề xuất hồ sơ là
  xoá MỀM (IS_ACTIVE = 0). Chiều 30/9 (việc phụ): Cổng cán bộ `_qhht_chung.js` đã kiểm ngày sinh; Nhân sự `quyetdinh` gửi thêm `iTrangThai` / `iThuTu` (đã up, kiểm host ĐẠT: thêm xong hiện ngay trong danh sách); cùng màn: `NS_QuyetDinhNhanSu/LayDanhSach` trả rỗng với mọi quyết định → màn lấy thành viên từ `LayChiTiet`, chỉ xem (đã up, kiểm host ĐẠT; phần không bỏ được thành viên đã ghi `can-quyet.js`). **Kết ngày 30/9: sổ lỗi mã TRỐNG, gói bổ sung TRỐNG, đã commit + đẩy**; sổ cần quyết gỡ 3 mục (quyết định, hai màn tra cứu in ấn — danh mục có dữ liệu), thêm 1 mục khen thưởng (quyết định kèm trạng thái 0),
  viết lại mục Xử lý biệt lệ (host không có bảng danh mục nào cho loại xử lý). 61 mục `ben` của phân hệ đã kiểm đã rà theo quy ước A / B. Người dùng chốt 30/9: xoá kỷ luật / khen thưởng / danh hiệu / học hàm thì màn
  TỰ XOÁ quyết định sinh kèm (`ums.ref.xoaQuyetDinhKem`, móc `onRemoved` mới của `ums.crud`); khung "Ghi chú chuyển đổi" CỨ ĐỂ THU GỌN.
- **⚠ KHI NGƯỜI DÙNG BẢO "KIỂM HOST" — ĐƯA THÔNG BÁO TRƯỚC, rồi mới chạy** (người dùng dặn 2026-09-29). Thông báo gồm: (1) lỗi mã đang treo
  (`node _harness/kiem-host/loi-code.js ds`) — màn nào cần sửa, màn nào đã sửa chờ kiểm lại; (2) gói bổ sung đã up chưa (`_v2_bo_xung_deploy` còn tệp = chưa up);
  (3) phân hệ nào đã kiểm / còn dang dở phần thử ghi / chưa kiểm (đếm từ `da-kiem.json`); (4) bản ghi thử còn sót đã biết; (5) lượt này định làm gì, theo thứ tự nào.
  Phân hệ MỚI chỉ kiểm khi người dùng yêu cầu đích danh.
- **⚠ HAI QUY ƯỚC KIỂM HOST (người dùng chốt 2026-09-30, áp cho MỌI phiên sau):**
  **(A) Xử lý được bằng MÃ thì KHÔNG báo lỗi CSDL** (người dùng nhắc lại 2026-10-05: lỗi frontend khắc phục được thì PHẢI khắc phục; chỉ thứ thực sự thuộc backend — API, thủ tục — mới lên Ghi chú; thiếu dữ liệu người dùng tự khai được → khung "Cần làm trước", mục 10). Khi kiểm, ưu tiên thay đổi (kéo gốc / sửa mã) ở các phân hệ ĐÃ hoàn thành trong `da-kiem.json` trước. Gặp lỗi khi kiểm, hỏi trước: "màn có thể tự tránh / tự xử lý không?" — vd gửi sai định dạng, gửi ô trống thành
  `//`, thiếu kiểm ô bắt buộc / kiểu số / khoảng giá trị, câu lỗi kỹ thuật hiện thô, thiếu method GET, gửi ô đang ẩn, lưu lần hai thành thêm trùng. Có → ghi SỔ LỖI MÃ
  (`loi-code.js them`), SỬA `_v2`, chờ up rồi kiểm lại; KHÔNG ghi mục `ben` vào `can-quyet.js`. Chỉ ghi việc CSDL / backend khi mã KHÔNG thể làm gì: thiếu thủ tục, gói
  lỗi biên dịch, thủ tục sai chữ ký, danh mục / dữ liệu nguồn rỗng, dịch vụ không chạy, thủ tục làm sai (xoá báo thành công mà không xoá, lưu sai trạng thái).
  **(B) "Ghi chú chuyển đổi" do NGƯỜI KIỂM VIẾT, không bê nguyên câu lỗi của máy chủ.** Người kiểm đã biết chính xác lỗi gì, từ hành động nào → viết thẳng mục trong
  `can-quyet.js` theo khuôn: bấm gì / ở đâu → thấy gì → ảnh hưởng → ai cần làm gì (chi tiết kỹ thuật để trong ngoặc cuối câu), để người kiểm duyệt mở màn là thấy ngay.
  Phần tự ghi câu lỗi thô (làm 30/9) KHÔNG dùng làm nội dung ghi chú.
- **Kiểm host Điểm rèn luyện (tối 2026-09-30) — XONG phần thử ghi, lần sau KHÔNG kiểm lại** (trừ màn chờ kiểm lại dưới đây). Đọc sâu lại 8/8 đạt. Sạch qua giao
  diện: `danhmucdulieu` (danh mục Nhóm tiêu chí đang trống), `tieuchixeploai` (tiêu chí "ĐRL cuoi" chưa có mức nào — 6 mức thật của tiêu chí ĐRL không đụng; danh sách
  chỉ hiện khi chọn CẢ Đối tượng và Tiêu chí, như gốc), `tieuchidiemapdung` (Thêm, Kế thừa, Xóa toàn bộ), `hesoapdung` (cả hai khung). **Phạm vi thử an toàn:** hệ Đào
  tạo khác → khoá Tập huấn × kỳ 2031_2032_2 (đã quét 520 phạm vi khoá × năm / kỳ 2022–2026: host CHƯA có dòng "áp dụng" thật nào ở cả ba bảng, nên "Xóa toàn bộ" của
  phạm vi thử không đụng gì). **Lỗi mã (đã sửa, đã up, kiểm host ĐẠT):** Sửa tiêu chí điểm áp dụng bị "Du lieu khong duoc de trang" — máy chủ chỉ trả `DAOTAO_THOIGIANDAOTAO_ID`
  (id năm HOẶC kỳ), không có `_NAM_ID` / `_KY_ID` như mã (và bản gốc) đọc → ô thời gian trống; nay `A.giaTriPV` đưa `tgId`, `phamViForm.set` tự tìm ô chứa id; ô Hệ lấy
  theo ô lọc khi cùng khoá. **Backend (đã ghi sổ):** `tieuchixeploaiapdung` Thêm VÀ Sửa đều PLS-00306 (`THEM_` / `SUA_DRL_TIEUCHUANXEPLOAI_AD`); Kế thừa + Xóa toàn bộ
  chạy đúng. `nhapdiemrenluyen` SẠCH (người dùng cho phép): lớp "Bổ sung kiến thức QTKD K6" (8 học viên — NGƯỜI HỌC THẬT, ThS tuyển sinh 2026), kỳ 2031_2032_2, một ô: nhập 1 → sửa 2
  → xoá trắng; tổng điểm / xếp loại tiêu chí cha máy chủ tự tính và tự mất khi xoá. Cần dữ liệu phụ: Kế thừa tiêu chí điểm áp dụng cho đúng khoá × kỳ (xong thì Xóa toàn bộ).
  **Lỗi mã thứ hai (đã sửa, đã up, kiểm host ĐẠT — sổ lỗi mã TRỐNG, gói bổ sung TRỐNG, đã commit + đẩy):** máy chủ lưu tiêu chí CHA của dòng áp dụng bằng id tiêu chí CHUNG (Kế thừa ghi vậy, Nhập điểm tra con theo id chung), còn ô
  "Tiêu chí cha" và bảng cây dùng id DÒNG áp dụng (như gốc) → Sửa dòng con kế thừa rồi Lưu là mất quan hệ cha – con; nay ô mang id chung, `A.cay` dò cả hai. Không thử: "Thực hiện tổng hợp", "Xếp loại kỳ / năm / toàn khoá",
  Import (ghi hàng loạt, không hoàn lại). `tonghopdiem` Tìm kiếm + thống kê thiếu điểm chạy đúng.
- **Kết ngày 2026-09-30 (tối): sổ lỗi mã TRỐNG, gói bổ sung TRỐNG, đã commit + đẩy.** Sau khi người dùng up: kiểm host ĐẠT các lỗi mã Tài chính (lưới nhập mở
  một biểu mẫu; đơn vị phí khối kiến thức — dòng thiếu cột `PHAMVIAPDUNG_ID` thì lấy `ID`; phân bổ doanh thu) và Nhân sự (khối danh mục ở ba màn thiết lập bảng
  lương: nạp bằng danh sách theo ID bảng vì danh sách theo MÃ bảng máy chủ nhớ tạm ~20 giây; Sửa dùng lời gọi sửa của màn Danh mục dữ liệu; bảng lương năm xoá bằng
  `CMS_DanhMucDuLieu/Xoa`). Nhân sự đọc sâu lại 80/80 sau đợt chuyển hộp thoại: không lỗi JS. "Bảng quy định lương" (`luong/mucluongcoban`) và "Kế hoạch xét nâng
  lương" CÓ trên menu host → tự tạo bản ghi cha thử rồi xoá để kiểm các màn con (quy ước C). Trang `tien-do.html` có cột **Tình trạng** ("Đã kiểm sâu (không phát
  hiện lỗi từ code)" = đã đọc sâu + đã thử ghi / xếp loại, không còn lỗi mã treo). Đợt chuyển hộp thoại mới kiểm host ở Nhân sự + Tài chính.
- **Kiểm host Xử lý học vụ (đêm 30/9 → 1/10) — XONG, lần sau KHÔNG kiểm lại. Đã up, kiểm lại 6 lỗi mã ĐẠT; sổ lỗi mã TRỐNG, gói bổ sung TRỐNG, đã commit + đẩy.**
  Lỗi thứ 6 (tìm ra lúc kiểm lại): Kế thừa điều kiện chuẩn khi kế hoạch CHƯA có sinh viên → máy chủ "Du lieu khong hop le" → nay chặn trước theo `SOLUONG`. Đọc sâu 7/7. Host CHƯA có kết quả xử lý
  nào và 0 điều kiện chung → tự dựng chuỗi thử (quy ước C): điều kiện chung ZKT → áp dụng cho Đào tạo khác / Tập huấn × 2031_2032_2 → kế hoạch ZKT (không dùng làm kết
  quả chính) + một học viên lớp Bổ sung kiến thức QTKD K6 → Kế thừa điều kiện chuẩn → Xét → đổi mức, tạo quyết định, thêm SV vào QĐ → dọn con trước cha; mọi bảng về
  đúng số cũ (kế hoạch 144, áp dụng 2633, điều kiện chung 0, kết quả 0, QĐ 812). Không thử: Phê duyệt (chỉ có ThemMoi), "Thực hiện xử lý" (hàng đợi không xoá được).
  **5 lỗi mã đã sửa, chạy thử trên host bằng `va-tam.js` (mới — chạy tệp trên máy trong trang host) đạt:** ô bắt buộc + câu báo trùng ở Khai báo điều kiện, Điều kiện áp
  dụng, Kế hoạch xử lý (máy chủ trả "Du lieu khong hop le" / "Du lieu da ton tai"); cột "Kết quả điều chỉnh" phải đọc `MUCXULY_THAYDOI_TEN` (`MUCXULY_TEN` luôn là mức
  tự động); Ra quyết định "Thêm SV" phải gửi `strTrack_Id` (tra theo lớp bằng `LayDSNguoiHoc`) — gốc ORA-01400. **`ums.crud` có móc mới `saveFail(err, laSua)`** đổi
  câu lỗi máy chủ khi lưu. **Backend (đã ghi `can-quyet.js`):** `XLHV_TinhToan/XuLyHocVuNguoiHoc` trả Success = false, Message = strChucNang_Id dù đã tính kết quả;
  `Xoa_XLHV_DieuKienXuLy_AD_Tat` báo thành công mà không xoá. Danh sách "Điều kiện áp dụng" không lọc hiện cả 2633 dòng gắn KẾ HOẠCH (cột Khoá trống) — như gốc.
  Quyết định tạo từ màn không gắn kế hoạch (`strNguonDuLieu_Id` rỗng như gốc) → ô "Chọn quyết định" hiện mọi QĐ; để nguyên. Bẫy: `chay-vaitro.js` bước Sửa trước đây
  chỉ tìm `[data-act=edit]` nên KHÔNG bấm nút Sửa của `ums.crud` (`.ums-iconbtn--edit`) — đã sửa. Thu-crud XLHV nay 6/8: `dieukienapdung` (phải chọn Danh mục xử lý)
  và `kehoachxuly` (ô bắt buộc) chặn Lưu khi harness không chọn — đúng thiết kế.
- **Kiểm host Tài chính lượt 2 (chiều 2026-09-30, theo quy ước C) — ĐÃ XONG, lần sau KHÔNG kiểm lại:** đọc sâu lại 57 mục menu (như cũ: 5 mục trỏ tệp
  không có, ORA-24338 phân bổ doanh thu, PLS-00306 CM_ChuongTrinhDaoTao). Thử ghi SẠCH thêm 12 màn: `mucphi`, `mucphilop`, `sothangtinhtien`, `donviphimoi`,
  `donviphimoict`, `donviphimoihp`, `hocphansotienmoi`, `hesohocphanmoi`, `apdungcongthucphi`, `sothangkhonghoc`, `kehoachthuchi`, `giahanthu/kehoach`,
  `phanbodoanhthu` (tổng 19 màn sạch). **Cách thử không đụng học phí thật:** hệ "Đào tạo khác" (khoá Tập huấn; khoá Bổ sung kiến thức là khoá duy nhất có lớp
  quản lý + học viên), khoản thu "Võ phục", kỳ 2031_2032_2; màn cần học phần / khối kiến thức thì dùng Khoá 17 cũng với khoản + kỳ đó. Lỗi mã tìm ra (đã sửa,
  CHỜ UP): `pat.matrix` / `pat.pivot` cộng dồn trình xử lý mỗi lần vẽ lại → bấm sửa ô mở nhiều hộp thoại; `donviphimoict` thêm xong lưới không hiện cột; họ đơn
  vị phí / mức phí gửi ô trống lên máy chủ; `phanbodoanhthu` gọi danh sách khi chưa chọn Hệ / CT và không kiểm ô số. Không thử: `loprieng` (chốt không hoàn
  lại), `khongbatno` (kế hoạch đăng ký thật), `danhmucnganhang` (ngân hàng VNPAY hiện trước SV), `lophocphan` (không có xoá), `hesolophocphan` (nguồn lớp học
  phần 0 dòng — việc backend). **Bẫy bộ lái tay:** hộp thoại đóng bằng `.close()` vẫn nằm trong DOM và màn có vùng "Khai nhanh" ẩn mang cùng `data-k` → phải
  gắn id theo đúng vùng (`main [data-z="main"]`, hộp đang mở), nếu không là chọn nhầm ô ẩn. Bộ mẫu lệnh lái tay: `_harness/kiem-host/mau-lenh/` (P = phần đầu chung; mp / dvp / hp / ctp = từng họ màn).
- **⚠ QUYỀN THỬ GHI (người dùng 2026-09-30 tối, thay các hạn chế trước): "cho phép thêm sửa xoá TẤT CẢ, miễn là sau xoá được; những thứ không có đường hồi lại thì
  thôi".** Tức mọi màn có đường xoá / hoàn lại đều được thử, kể cả ghi vào dữ liệu của người học thật (chọn kỳ xa như 2031_2032_2, một ô / một dòng, xoá ngay và đối
  chứng). KHÔNG bấm thao tác không hoàn lại: tổng hợp / xếp loại / tính phí hàng loạt, chốt, xuất hoá đơn - biên lai, gạch nợ, gửi thư, nhập từ tệp, thứ máy chủ chặn gỡ
  (lớp đã có danh sách thi). Trước khi ghi phải chỉ ra được lời gọi xoá của chính loại dữ liệu đó. Phân hệ nào làm thì vẫn do người dùng gọi tên.
- **⚠ QUY ƯỚC KIỂM HOST (C) — người dùng chốt 2026-09-30:** thử CRUD mà thiếu dữ liệu đầu vào (danh mục rỗng, chưa có bản ghi cha) và thứ đó **tạo được ngay
  trong ứng dụng** thì sang màn đó tạo (dấu ZKT), quay lại thử, xong **xoá cả bản ghi thử lẫn dữ liệu phụ** (con trước cha; không có đường xoá thì không tạo).
  "Làm đến đâu sạch đến đó": mỗi việc khép lại (kiểm lại, dọn, ghi sổ) rồi mới sang việc khác. Việc phụ cứ làm; thử ghi một PHÂN HỆ cụ thể chờ người dùng quyết.
  Bài học 30/9: lỗi tưởng của máy chủ có thể là SAI TÊN THAM SỐ từ bản gốc — màn Quyết định gửi `dTrangThai` trong khi máy chủ đọc `iTrangThai` (màn Học hàm gửi
  `iTrangThai` thì lưu đúng) → trước khi ghi việc CSDL, so tham số với một màn khác gọi cùng controller.
- **⚠ LỖI ĐÃ KIỂM THÌ GHI THẲNG LÀ LỖI, YÊU CẦU BACKEND (người dùng chốt cuối ngày 2026-09-30 — thay quy ước "tự ghi lỗi vừa gặp" buổi sáng).**
  Phần tự chép câu lỗi máy chủ lên khung ("Lỗi máy chủ vừa gặp", `ums.api.onLoi` ở app.js, `localStorage['ums.canQuyet.loiMayChu']`, nút "Xoá lỗi tự ghi")
  **ĐÃ GỠ**. Kiểm host thấy lỗi máy chủ / máy chủ làm sai → BẮT BUỘC viết mục `ben` vào `can-quyet.js` trong cùng lượt (ghi CLAUDE.md thôi là KHÔNG đủ), theo
  khuôn quy ước B. Trên màn, nhóm `oracle` nay mang tên **"Lỗi đã kiểm trên hệ thống thật — yêu cầu backend / CSDL xử lý"**, huy hiệu ĐỎ "n lỗi cần backend xử lý"
  trên dòng tóm tắt (khung vẫn thu gọn). Kiểm độ phủ: mọi màn trong `da-kiem.json` có `doc: loi-may-chu` / `ghi: tu-choi` / `con-sot` phải có mục `ben` cùng khoá.
  Từ chối do dữ liệu thử không hợp lệ ghi `ghi: hop-le`. Móc `baoLoi` trong api.js còn đó nhưng không ai gắn.
- **Ngày sinh ba ô Ngày / Tháng / Năm: KIỂM TRƯỚC KHI GỬI bằng `ums.util.ngaySinh(ngay, thang, nam, maMuc)`** (api.js, người dùng 2026-09-30 — "tưởng cái này xử lý
  qua code trước khi gửi"). Bản gốc ghép thẳng `ngày/tháng/năm`; host có 983 hồ sơ CORE_PERSON đều CHƯA có ngày sinh → bấm Sửa rồi Lưu gửi `"//"` → `UpdateCorePerson`
  trả ORA-20001 (còn `InsertCorePerson` không kiểm ngày: nhận cả 31/02, tháng 13). Hàm trả `{ loi, chuoi, ngay, thang, nam }`: sai thì màn báo, KHÔNG gửi; đủ ngày-tháng-năm
  mới gửi `dd/mm/yyyy` (đã thêm số 0), còn lại gửi rỗng; ô không thuộc mức độ đang chọn không gửi giá trị cũ. Đã áp: Nhân sự `kehoach/dexuathoso` + biểu mẫu thành viên gia
  đình, Sinh viên `hoso/_hsA.js`. CHƯA áp: Cổng cán bộ `hoatdong/_qhht_chung.js` (một ô dd/mm/yyyy). Màn mới có bộ ba ô này PHẢI gọi hàm.
  **Câu kiểm dữ liệu của thủ tục (ORA-20000 … 20999)** nay hiện gọn đúng câu, bỏ `ORA-20001:` và đuôi `ORA-06512: at …` (`cauKiem` trong api.js; câu gốc ở `err.goc`) — và
  (phần tự ghi "lỗi máy chủ" đã gỡ cuối ngày 30/9).
- **SỔ LỖI MÃ (người dùng chốt 29/9):** màn nào lỗi do MÃ `_v2` thì ghi `node _harness/kiem-host/loi-code.js them <ApisXxx> <module/tep> "<lỗi>"`
  (tình trạng "cần sửa"); sửa xong `… da-sua … "<đã sửa gì>"` (chờ up + kiểm lại); kiểm lại trên host ĐẠT thì `… xong …` → mục tự mất khỏi cột
  "Lỗi mã" của `tien-do.html`. **Mỗi lần kiểm host: chạy `loi-code.js ds` TRƯỚC, kiểm lại các màn "chờ kiểm lại" rồi mới làm phân hệ mới**
  (chạy riêng vài màn: `CHI="<id1>,<id2>" SAU=1 node chay-vaitro.js <roleId>`). Khoá trong sổ = đường dẫn màn TRÊN MENU HOST (vd Kế hoạch tuyển dụng là
  `kehoach/kehoach`, dù nạp tệp `nhansu/script/kehoach.js`). 29/9 đã kiểm lại đạt và gỡ: QLD `quydoichungchi`, `congthucdiemapdung` (hết 405), Cổng SV
  `dangkyhoc/dangky` (không còn gọi khi chưa có kế hoạch). Nhân sự `kehoach/kehoach` kiểm lại đạt sau khi up. **Sổ lỗi mã hiện TRỐNG (29/9).**
- **Kiểm host 2026-09-29 — NHÂN SỰ XONG** (vai trò `6D5B87…` 80 màn + Nhân sự 2026 `3B4315…` 6 màn; 42 màn `_v2` còn lại không có trên menu host):
  tất cả mở được; thử ghi 41 màn sạch (kể cả đợt 2), KHÔNG còn bản ghi thử nào. Sửa `_v2`: `nhansu/kehoach` đánh dấu bắt buộc Mã / Tên / Phân loại. 9 việc máy chủ /
  dữ liệu đã ghi `can-quyet.js` (thiếu thủ tục lương tháng + thuế TNCN, `NS_QT_Luong/ThemMoi` ORA-01403, `InsertCorePerson` thiếu CONTEXT_CODE, danh mục
  `NS.TD.PHANLOAI` rỗng, chưa có Bảng quy định lương, mục menu "Kết quả phân loại" đường dẫn "dddd"). Chi tiết từng màn: sổ đã kiểm.
  **Chưa kiểm (theo thứ tự):** Sinh viên `2BD6D7…`, KHCT `3EEBEF…`, Nhập học `D3FA56…`, Tuyển sinh `FB5151…`, NCKH `41FCFE…`, Thi phách `6F038B…`.
- **Kiểm host 2026-09-29, đợt 2 (sau khi người dùng up gói; người dùng: "kiểm chỉn chu mục đã kiểm trước, phân hệ mới CHỈ khi tôi yêu cầu"):**
  · Nhân sự làm nốt bằng LÁI TAY `node chay.js <role> <cnId|-> '<thân hàm>'` (có `nut()`, `os()`, `s2()`, `go()`, `bang()`, `bao()`; truyền thân hàm trong
    nháy ĐƠN — nháy kép thì bash nuốt `$$`; mỗi lệnh có cnId là ĐỔI màn, muốn ở nguyên màn dùng `-`): `quyetdinh`, `vitricongviec`, `cocautochucv2` sạch → Nhân sự 41 màn sạch.
  · **Ghi LAN đã gặp:** thêm kỷ luật / danh hiệu có số quyết định → máy chủ tự sinh một QUYẾT ĐỊNH (`NS_ThongTinQuyetDinh`, `NGUONDULIEU_ID` = id dòng), xoá dòng thì
    quyết định Ở LẠI (3 bản ZKT của 26/9 + 29/9 đã xoá tay). `NS_ThongTinQuyetDinh/ThemMoi` lưu TRANGTHAI = 0 dù gửi 1 → không hiện trong danh sách (tìm bằng `iTrangThai: 0`).
    Cả hai đã ghi `can-quyet.js`. **Sau mỗi lượt thử ghi phải QUÉT dấu:** `chay-vaitro.js` nay ghi `zkt` (dấu `ZKT\d{4}` còn trên màn) và in "!! CÒN DẤU THỬ".
  · Quét lại 13 vai trò đã kiểm (đọc sâu): không còn dấu thử; lỗi máy chủ vẫn là các lỗi đã biết. Lỗi mã mới: Tài chính `TT.mount` / `T.importScreen` ném TypeError khi
    người dùng sang màn khác trước lúc tệp màn nạp xong → đã thêm chặn; người dùng up 29/9, kiểm lại ĐẠT (chuyển màn trễ 0 / 60 / 200 ms không còn lỗi JS), đã gỡ khỏi sổ.
  · **Bẫy bộ thử:** thẻ Edge bị che / có DevTools mở cạnh thì trình duyệt BÓP đồng hồ (setTimeout cả phút mới chạy) → màn "đứng im", mỗi màn 30–90 giây, 0 lời gọi.
    `cdp.js` nay tự `Page.bringToFront` + `Emulation.setFocusEmulationEnabled` và mở Edge với cờ tắt bóp nền. Thấy màn > 25 giây mà 0 lời gọi thì chạy lại bằng `CHI=`.
  · Sổ đã kiểm của 11 phân hệ cũ (TC, CCB, CSV, CC, CMS, DKH, HLTL, RL, XLHV, HB, QLD): phần ĐỌC đã cập nhật theo lượt quét 29/9; phần THỬ GHI còn nhiều màn "chưa thử ghi"
    trong sổ — việc kế tiếp là làm cuốn chiếu từng phân hệ cũ (bắt đầu Tài chính) khi người dùng bảo.
- **Kiểm host 2026-10-06 (01:00–01:40), Cổng cán bộ ("kiểm kỹ"):** đọc sâu lại 2 vai trò host (25 + 87 màn) → 0 lỗi mới, 6 lỗi backend cũ đã có sổ (+ `capnhathoso` ảnh tạm 404
  ghi `ben`). Thử ghi: `sukien/kehoach` sạch; `luanvan/giaodetai` (biểu mẫu hai tầng) thêm → xoá sạch, Esc đóng từng tầng ĐẠT trên host; `khaosat/phieu` nhóm câu hỏi thêm được,
  xoá bị từ chối (liên kết phiếu–nhóm) → còn sót `ZKT0119`, ghi `ben`; `khaosat/kehoach` + `khaosat/phieu` thiếu `required` → sửa, chờ up. Lái tay: `nut("Xoá đã chọn")` không khớp
  chữ "Xoá 1 dòng đã chọn" → tìm nút bằng regex; gọi `chay.js` với `-` sau một lượt có thể mất trạng thái màn → gộp cả chuỗi thao tác vào MỘT lệnh có cnId.
  · Up 01:40 → `khaosat/phieu` thu-ghi sạch (xong); `khaosat/kehoach` máy chủ đòi thêm Từ ngày / Đến ngày → required, `va-tam.js` chạy mã mới trên host: biểu mẫu trống bị chặn
    4 ô, thêm ZKT0143 → xoá bằng "Xóa kế hoạch" trong biểu mẫu sạch (nút "Xóa (N)" đầu danh sách là ResetKetQuaTaoPhieu — như gốc). Chờ up lần 2 rồi thu-ghi + xong.
  · Up 01:48 → `khaosat/kehoach` thu-ghi thêm / sửa OK, xoá qua biểu mẫu sạch; **sổ lỗi mã trống**, gói bổ sung đã up. Cổng cán bộ kết lượt 6/10.
  · Người dùng: "phải ghi rõ màn không có trong menu" → so 152 màn `_v2` với hai vai trò host: 87 có, **65 không có** → ghi sổ `khong-tren-menu`, trạng thái mới trên tien-do.

## 6/10 (chiều, 14:10–14:30) — Cổng sinh viên: ĐÃ HOÀN THIỆN (22/22 màn trên menu host)

- Người dùng: "đã up đã push; chuyển sang kiểm Cổng SV, chỉ kiểm màn có trên menu host; màn không kiểm phải ghi rõ lý do; dropdown màn chưa kiểm
  trên tiến độ — làm tiến độ trước". `--da-up` đặt mốc; kéo gốc lần 8 (mốc `3c3b2d70`, 4 tệp / 2 màn CCB + TS, "chưa xem").
- **Tiến độ:** `tien-do.py` thêm cột "Chưa kiểm (lý do)" = dropdown từng màn + lý do; nhãn phân hệ "Đã hoàn thiện — N màn chưa kiểm (…)"; màn đã chuyển
  mà sổ không có → "CHƯA XẾP LOẠI" (đỏ). Script mới `xep-loai-chua-kiem.py` (đối chiếu bản xuất mapping host 619 chức năng + ketqua các vai trò):
  ghi sổ 93 màn ở 10 phân hệ (84 host chưa khai chức năng, 8 có chức năng chưa gán vai trò thử, 1 trên menu chưa ghi sổ). Không còn màn chưa xếp loại.
- **Cổng SV** (`THUVAI="Đặng Bác Ái" SAU=1 chay-vaitro.js 80CF9E…`): 22/22 mở tốt, 0 lỗi JS. Một lần `LayThongTinChiTietHoSo` ORA-24338 ở Tài chính cá nhân,
  gọi lại (cả hai tiền tố action) đều OK, đọc lại màn 0 lỗi → nhất thời, không ghi `ben`.
  Thử ghi lái tay `dongphuc`: xác nhận KHÔNG tham gia (lý do ZKT1430) → Kết quả đã đăng ký → đánh dấu → "Hủy đăng ký (1)" → sạch ("Chưa có đăng ký nào").
  Bẫy: nhãn nút `ui.xoaChon` đổi thành "Hủy đăng ký (1)" khi có dòng chọn → `nut()` phải tìm bằng regex.
  21 màn còn lại xếp loại `khong-crud` (8 chỉ xem) / `khong-thu` (13, lý do từng màn trong sổ: dịch vụ một cửa trống, không có kế hoạch nguyện vọng / thi lại /
  đợt xét TN, phúc khảo chỉ huỷ sau nộp phí, đăng ký lớp thật, sửa hồ sơ thật, xác nhận một lần). 15 màn ngoài menu: host chưa khai chức năng.
- **Lỗi mã bắt được khi lái tay:** đổi màn qua hash khi hộp thoại còn mở → hộp của màn cũ đè lên màn mới (hộp Kết quả của Đồng phục còn trên màn Công nhận điểm).
  Sửa `app.js route()`: đóng mọi `dialog.ums-dialog[open]` trước khi vào màn mới. Chưa kiểm trên host (gói bổ sung).
- **Chiều 6/10 (người dùng: Cổng cán bộ "rõ ràng đã báo kiểm xong rồi mà"):** 67 màn CCB trên menu host chỉ mới đọc sâu, sổ để trống cột thử ghi → xếp loại
  tay vào sổ: 27 màn chỉ xem / thống kê; 6 màn lỗi backend khi mở (đã có ben); 34 màn không thử có lý do (nhập điểm thật, duyệt / xác nhận một chiều,
  đổi lịch, phân công thi / giảng viên, mượn phòng, mời giảng tạo hồ sơ nhân sự, lý lịch khoa học thật). Trang tiến độ: "Đã hoàn thiện 87/103 màn trên host".
  Bài học: xong một phân hệ thì MỌI màn trên menu phải có kết luận ở cột thử ghi (sạch / chỉ xem / không thử + lý do) — không để trống rồi báo xong.
- **Chiều 6/10 — 24 màn "có chức năng, chưa gán vai trò thử"** (người dùng: "có chức năng thì màn vẫn mở được, tại sao không kiểm"): tra menu cả 48 vai trò
  của tài khoản thử → **13 màn nằm ở vai trò khác**: 9 dashboardv2 (vai trò Dashboard), duyethoidong (Chuyên cần), daqhht (Sinh viên), thi/phanphuckhao
  (Thi phách), DKH kehoachmua (Tài chính) → đọc sâu ngay bằng `CHI=` trên vai trò đó: 13/13 mở tốt, 0 lỗi; ghi sổ (dashboard = chỉ xem; ba màn còn lại
  không thử ghi có lý do). **11 màn không nằm ở vai trò nào của tài khoản thử** (7 miengiam Tài chính, 4 sổ coi / chấm thi CCB) → chưa mở được;
  việc cấp chức năng cho vai trò thử là của quản trị / người dùng. Tiến độ CCB: Kiểm xong 99/103 màn trên host.

## 6/10 (chiều, 15:40–16:10) — Chuyên cần: kiểm host 3/3 màn trên menu (vai trò `9FE0F1…`)

- Người dùng: "kiểm chuyên cần". Fetch gốc: không có tệp mới ngoài lần kéo 8 (không tệp Chuyên cần). Sổ lỗi mã / gói bổ sung trống lúc bắt đầu.
- Đọc sâu lại `SAU=1 CHI=` 3 màn: 0 lỗi JS, 0 lỗi gọi. Thử ghi lái tay (`chay.js`, không màn nào là crud):
  - `nhapchuyencan/khongdiemdanh`: Thêm SV (20233195) → Lưu bị từ chối "Nguoi hoc khong ton tai" → **lỗi mã**: dòng mới gửi `ID` của hộp chọn SV
    (LayDSNguoiHoc trả `ID` = bản ghi đào tạo ≠ `QLSV_NGUOIHOC_ID`); gốc gửi y vậy nên thêm mới ở gốc chưa từng lưu được. Sửa `tuHop` → `NH_ID`,
    `va-tam.js` trên host: thêm OK. Sửa lý do → "Du lieu da ton tai" (thủ tục Thêm kèm strId vẫn kiểm trùng; danh sách không trả LOP_ID) → `ben` oracle.
    Xoá qua ô đánh dấu + "Xóa (1)" sạch. Ô từ khoá không tìm theo Lý do → tìm dấu ZKT bằng danh sách không lọc.
  - `nhapchuyencan/nhaptheolop`: danh sách N23 (1 SV), kiểu Vắng mặt, ngày 13/10/2026: thêm (SL 2) → sửa (SL 1, `Sua_` strId) → bỏ dấu, đối chứng
    `LayKetQuaChuyenCanTheoNgay` từng bước, sạch. Không thử Khởi tạo ngày (không có thủ tục xoá `CC_ThoiGian`), Xác nhận (một chiều). Bẫy: tìm ra đúng 1
    danh sách thì màn tự chọn và `ui.swap` sang khung 2 → bảng danh sách ẩn.
  - `tonghop/tonghoptheongay`: không thử được — `LayKQQLSV_NguoiHoc_ChuyenCan` trả `rsNgay` rỗng với mọi bộ lọc (kể cả lớp DCDH13.10 đã có ngày ở
    danh sách học, 2020–2032) → bảng chỉ có cột Tổng; tìm một SV ra 65 dòng trùng (khác ID). `ben` oracle.
- Sổ: 3 màn có kết luận thử ghi (sach / tu-choi + ben / khong-thu + ben); lỗi mã `khongdiemdanh` "đã sửa — chờ up"; gói bổ sung dựng lại. Không còn dấu ZKT.
- "Kadara" là hồ sơ CÁN BỘ của tài khoản thử; màn cần SINH VIÊN thì dùng 20233195 Đặng Bác Ái (SV thủ vai ở Cổng SV), một dòng, xoá ngay.
- **16:27 — người dùng đã up gói bổ sung** → `--da-up`; kiểm lại `khongdiemdanh` bằng tệp thật trên host (tải lại trang, tệp host có mã mới): thêm SV 20233195 lý do ZKT1627 → Lưu thành công → Xóa (1) sạch, 0 dòng ZKT, 0 hộp thoại. Sổ lỗi mã TRỐNG. Chuyên cần: Đã hoàn thiện 3/3 màn trên menu.
- **16:50 — bàn khoảng Từ / Đến ngày.** Người dùng nêu màn Lịch giảng nhiều phòng học (theo dõi bận / rỗi) tự đặt Đến = Từ khi Đến < Từ — màn `_v2` đã làm (dòng 616). Nhân tới lượt màn này, mở diff kéo gốc lần 8: `strKieuPhong` gửi rỗng khi tìm phòng trống (gốc: gửi LT/TH thì thủ tục trả 0 phòng) → đã chuyển vào `goiTrong` (lọc + hộp đổi lịch), gói bổ sung 1 tệp, CHƯA kiểm lại trên host. Luật chung khoảng ngày (khoá lịch hai chiều + toast khi gõ tay) chưa làm, chờ chốt.
- **20:30–20:50 — người dùng báo "vừa up" → `--da-up`; kiểm lại `lichgiang/lichgiangnhieuphonghoc` trên host (vai trò Cổng cán bộ, lái tay):** bản script trên host đã là bản mới; lọc Từ 08/10 → Đến 06/10 tự kéo Đến = 08/10, không toast (đúng hướng đã bàn); khoảng 08–09/10 → `LAYPHONGHOCTRONG` 2 lời gọi, `strKieuPhong` rỗng, trả 242 / 250 phòng; lọc loại LT 235 ô, TH 217 ô (máy khách); bấm ô Trống → hộp "Đổi lịch vào phòng trống" gọi `LayDSLichGiang` n=0 → "Bạn không có buổi dạy nào trong tuần này", Đóng sạch (0 dialog, 0 ô đang chọn). Hộp Yêu cầu đổi lịch (bước 2) vẫn chưa thử được vì tài khoản không có buổi dạy. Phát hiện khoá nhớ kết quả còn kèm loại phòng → đổi loại gọi lại máy chủ dù kết quả giống nhau → sửa `goiTrong` (khoá = ngày|tiết), gói bổ sung 1 tệp chờ up. Luật chung khoảng Từ / Đến ngày vẫn CHƯA làm (chờ người dùng bảo).
- **21:00 — người dùng báo "up rồi" → `--da-up` (gói trống). Kiểm lại khoá nhớ phòng trống trên host ĐẠT:** đổi loại all → LT → TH → all → LT chỉ 1 lời gọi `LAYPHONGHOCTRONG` cho 08/10 (trước sửa: mỗi loại gọi lại); một ngày trong tuần đang xem → tô lưới tuần (128 phòng trống, 50 ô/trang), thêm Đến 09/10 → bảng phòng × ngày 232 ô. Giờ gửi lên 06:45 rồi 07:00 là chủ ý gốc (`gioTiet` ưu tiên giờ lịch thật đã tải). Màn này xong; gói bổ sung trống.
