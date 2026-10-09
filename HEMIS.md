# HEMIS — Đồng bộ dữ liệu lên Bộ GD&ĐT

Ghi chú từ tài liệu `APIKetNoiHemis_V2.0-f.pdf` (Cục KHCN&TT, Bộ GD&ĐT, "Tài liệu đặc tả
kỹ thuật tích hợp dữ liệu qua API từ cơ sở đào tạo", phiên bản 1.0, năm 2026).
Người dùng đưa tài liệu ngày 2026-10-07. **Chưa làm gì**; chưa có tài khoản, chưa có
`DON_VI_ID`, chưa chọn phương án ký số.

---

## 1. Đây là gì

HEMIS là hệ thống thông tin giáo dục đại học của Bộ. Tài liệu đặc tả cách **trường đẩy
dữ liệu gốc từng bản ghi** lên HEMIS. Không liên quan giao diện, không liên quan việc
chuyển màn sang `_v2`. Đây là tích hợp **máy chủ với máy chủ**.

Kho mã hiện tại không có gì cho HEMIS (3 tệp khớp chữ "hemis" đều là trùng tên ngẫu
nhiên: 2 tệp QLTTN và `assets/js/canvasjs.min.js`).

Máy chủ thử của Bộ: `https://hemistest.moet.gov.vn/gwdev/...`

## 2. Bộ muốn gì — đọc từ các trường bắt buộc

- **Định danh theo CCCD, không theo mã nội bộ.** Mọi bản ghi cán bộ và người học bắt
  buộc có CCCD / hộ chiếu (`CCCD`, `CMTND`). Mã cán bộ, mã sinh viên của trường là
  trường phụ. Cùng một người ở hai trường sẽ ghép thành một.
- **Nối với dữ liệu dân cư.** Cờ `KY_SO_C12` ở học viên và chương trình đào tạo (C12 =
  Cục Cảnh sát QLHC, giữ CSDL quốc gia về dân cư). Cơ sở giáo dục có `MA_DINH_DANH_ND69`
  (bắt buộc) và `MA_DINH_DANH_DIEN_TU` (QĐ 20).
- **Trường chịu trách nhiệm pháp lý.** Dữ liệu phải ký số bằng chứng thư của trường
  (XML-DSig) trước khi gửi; mỗi lần gửi JSON phải kèm mã phiên ký `t_k`. Không ký thì
  không gửi được.
- **Những thứ Bộ kiểm soát:** giảng viên cơ hữu đứng tên ngành (`NGANH_DUNG_TEN`,
  `TRONG_SO`, `HE_SO_THAM_GIA`, `TONG_HE_SO_THAM_GIA`, cờ đáp ứng TT 03/2022) → điều
  kiện mở ngành, chỉ tiêu; một người dạy nhiều trường (`DON_VI_CHINH`, thỉnh giảng,
  `TY_LE_THOI_GIAN`); người học từ trúng tuyển tới tốt nghiệp (số QĐ nhập học, số QĐ
  tốt nghiệp bắt buộc theo trạng thái, `IS_LOCK`); chỉ tiêu và thực tuyển theo ngành
  từng năm; đất đai, phòng học, thư viện.

Hệ quả cho trường: dữ liệu nhân sự và sinh viên trong UMS phải sạch ở mức **từng người**
(CCCD, mã danh mục khớp HEMIS) trước khi nghĩ đến dịch vụ đồng bộ.

## 3. Quy trình bắt buộc — bốn bước, đúng thứ tự

1. **Token**: `POST /connect/token`, OAuth2 password grant, body form-urlencoded
   `grant_type=password, scope=password, client_id=password, client_secret, username,
   password`. Trả `access_token` Bearer, `expires_in` giây. `client_secret` do Bộ cấp →
   **phải ở phía máy chủ**, không được lộ ra trình duyệt.
2. **Danh mục dùng chung**: `POST .../danhmuc/v5/DM_BAC_LUONG/getDanhMucHEMIS`, body `{}`
   → một object `DANH_MUC_API` chứa **175 mảng danh mục**. Mỗi phần tử: `Id`, `Code`,
   `MA_<TÊN>`, `TEN_<TÊN>`, `ISPUBLIC`, `IsDeleted`, `Created/Modified(By)`. Mọi mã gửi
   đi phải là mã HEMIS. Lưu ý có `DM_TINH_NEW`, `DM_XA_NEW` (địa giới theo QĐ
   19/2025/QĐ-TTg) song song với `DM_TINH`, `DM_HUYEN`, `DM_XA` cũ.
3. **Ký số XML** rồi tải lên: `POST .../co_so_giao_duc_input/db16/{DON_VI_ID}/{IKS}/{PH}`,
   multipart file (có thể gzip). `IKS` = GUID 36 ký tự do trường sinh, duy nhất; trùng
   thì bị từ chối. `PH` ∈ COSOGIAODUC, CANBO, HOIDONG, NGANHDT, DAOTAO, TUYENSINH,
   HOCVIEN, NCKH, COSOVATCHAT, TAISAN, HTQT, HTDN. Cấu trúc XML:
   - `<Data>` → `<DuLieuKySo Id="data">`: con đầu `<k1>` = 18 ký tự đầu IKS, con cuối
     `<k2>` = 18 ký tự cuối IKS, giữa là `<MaDonVi>`, `<TenDonVi>`, các
     `<DanhSachXXX>` (PascalCase, mỗi bản ghi một khối, field PascalCase).
   - `<KySo>` ngang hàng với `DuLieuKySo`, chứa `<Signature>` chuẩn XML-DSig:
     exc-c14n, rsa-sha256, sha256, Reference `#data` enveloped + Reference
     `#signobject-{guid}`; `KeyInfo/X509Data` **X509SubjectName trước, X509Certificate
     sau**; `SigningTime` dạng `yyyy-MM-ddTHH:mm:ss` giờ VN.
   - Ký bằng VGCA / USB token / VNPT SmartCA / MISA eSign. **Hệ cũ đã có `misa_kyso.js`**
     (ApisTaiChinh/phieuthu, ApisCMS/chucnang/testchucnang) → trường đang dùng MISA,
     có thể dùng lại chứng thư.
4. **Gửi JSON** từng nhóm: `POST .../co_so_giao_duc_input/db{n}/{DON_VI_ID}/{IdKey}`,
   `Content-Type: application/json`, Bearer. Body chung: `t_k` = IKS ở bước 3 (bắt buộc,
   trừ db3 hiện **không** kiểm), `DomainConnect` (ghi log), rồi các mảng `_XXX`.
   `IdKey` = GUID do trường sinh để tra nhật ký. `DON_VI_ID` phải thuộc tài khoản (401)
   và đã đăng ký đồng bộ (403 `ERR_ACCESS_DENIED`). Phản hồi `{success, message, data}`
   với `data` rỗng khi thành công. Dữ liệu vào **bảng trung gian** của Bộ, không ghi
   thẳng.

| db | Nhóm | Các mảng chính |
|---|---|---|
| db1 | Cơ sở giáo dục | `_CO_SO_GIAO_DUC` (object), `_CSGD_KHEN_THUONG`, `_CSGD_LIEN_KET_DAO_TAO_GDQPAN`, `_CSGD_KHOA_HOC`, `_CSGD_LICH_SU_DTEN`, `_CSGD_DS_DAU_MOI_LH`, `_CSGD_THONG_TIN_KIEM_DINH`, `_VAN_BAN_TRIEN_KHAI_THUC_HIEN_QUYEN_TU_CHU`; `_CO_CAU_TO_CHUC` đang bị vô hiệu |
| db2 | Hội đồng trường / BGH | `_CSGD_BAN_GIAM_HIEU`, `_CSGD_BAN_KIEM_SOAT`, `_CSGD_HOI_DONG_KHOA_HOC`, `_CSGD_HOI_DONG_TRUONG`, `_CSGD_CO_DONG_GOP_VON` |
| db3 | Đội ngũ | `_CANBO_HOSO` (71 trường) + 21 mảng con: đơn vị, thỉnh giảng, GV QPAN, GV nước ngoài, tiếng DT, bồi dưỡng, đánh giá 56/90, diễn biến lương, ĐT chính sách, hướng dẫn NCS, học hàm, hợp đồng, HĐ thỉnh giảng, khen thưởng, kỷ luật, lĩnh vực NC, ngành đứng tên, ngành giảng dạy, phụ cấp, QT công tác, QT đào tạo; `_CO_CAU_TO_CHUC` |
| db4 | Ngành đào tạo | `_NDT_NGANH_DAO_TAO`, `_NDT_LOAI_HINH_MO`, `_NDT_KHOI_NGANH`, `_NDT_LINH_VUC`, `_NDT_NHOM_NGANH`, `_NDT_HINH_THUC_DAO_TAO` |
| db5 | Chương trình đào tạo | `_CHUONG_TRINH_DAO_TAO`, `_DT_GIA_HAN`, `_DT_NGOAI_NGU`, `_DT_NAM_AP_DUNG`, `_DT_TT_KIEM_DINH_CT`, `_DT_QUYET_DINH_CAP_PHEP_CT` |
| db6 | Tuyển sinh | `_TS_NGANH` (chỉ tiêu theo ngành/năm), `_TS_TRUNG_TUYEN` |
| db7 | Người học | `_THONG_TIN_HOC_VIEN`, `_HV_HOC_TAP_NGHIEN_CUU` (43 trường, kể cả luận văn), `_HV_GIAO_DUC_THE_CHAT`, `_HV_HOC_BONG`, `_HV_KHEN_THUONG`, `_HV_KY_LUAT`, `_HV_THONG_TIN_VIEC_LAM`, `_HV_VAY_TIN_DUNG`, `_HV_VI_PHAM_QUY_CHE` |
| db9 | Cơ sở vật chất | đất đai, toà nhà, công trình, phòng học, KTX, phòng/xưởng TH, thư viện, phòng TN, thiết bị |
| db10 | NCKH | nhiệm vụ KHCN, giải pháp/sáng chế, BVMT, chuyển giao, DN KHCN, tạp chí, sách, bài báo, giải thưởng, nhóm NC mạnh, cán bộ tham gia |
| db11 | Tài chính, tài sản | loại thu chi, chi tiết thu chi, trích lập quỹ, nộp ngân sách, tài sản, chi tiết TS, hoạt động TC, chi NSNN |
| db12 | Hợp tác quốc tế | tổ chức QT, thông tin HT, đoàn công tác, thành phần đoàn, GV đi đào tạo, GV đi giảng dạy, lưu học sinh, đề án, thoả thuận, hội thảo |
| db13 | Hợp tác doanh nghiệp | `_HTDN_TO_CHUC_HOP_TAC` |

(Không có db8, db14, db15 trong tài liệu.)

## 4. Trường có dữ liệu đến đâu

| Nhóm HEMIS | Phân hệ UMS | Mức độ |
|---|---|---|
| CANBO (db3) | ApisNhanSu | **Đủ nhất**: hồ sơ, hợp đồng, lương, khen thưởng, kỷ luật, QT công tác / đào tạo, cơ cấu tổ chức |
| NGANHDT, DAOTAO (db4, db5) | ApisKeHoachChuongTrinh | Có |
| TUYENSINH (db6) | ApisQuanlyTuyenSinh, ApisNhapHoc | Có |
| HOCVIEN (db7) | ApisSinhVien, ApisTotNghiep, ApisHocBong, ApisRenLuyen, ApisXuLyHocVu | Có, rải nhiều phân hệ |
| NCKH (db10) | ApisNCKH | Có |
| COSOGIAODUC, HOIDONG (db1, db2) | không có | Nhập tay một lần |
| COSOVATCHAT (db9) | chỉ KTX (ApisKyTucXa) và phòng học trong lịch giảng | Thiếu phần lớn |
| TAISAN (db11) | ApisTaiChinh chỉ là thu học phí | Thiếu |
| HTQT, HTDN (db12, db13) | không có | Thiếu hẳn |

## 5. Lệch kỹ thuật gặp ở mọi nhóm

- **Khoá chính:** HEMIS đòi GUID 36 ký tự có gạch; UMS dùng 32 hex không gạch
  (`B2042224DB1D4AA6BC11B65EED062359`) → phải chèn gạch khi gửi (và bỏ gạch khi đối chiếu).
- **Ngày:** HEMIS `yyyy-MM-dd`; UMS `dd/MM/yyyy`.
- **Địa giới mới:** `TINH_THANH_NEW`, `XA_PHUONG_NEW` bắt buộc ở cơ sở giáo dục;
  `HK_TINH_NEW`, `HK_XA_NEW` bắt buộc ở cán bộ → danh mục tỉnh / xã trong UMS phải có mã
  HEMIS theo địa giới sau sáp nhập.
- **CCCD bắt buộc** ở mọi bản ghi cán bộ và người học (20 tệp JS ở Nhân sự / Sinh viên có
  tham chiếu CCCD/CMND → trường có ô, nhưng chưa biết dữ liệu đầy đủ đến đâu).
- **Mã danh mục:** mọi `*_ID` kiểu string 36 là mã HEMIS, không phải GUID nội bộ. Cần
  bảng ánh xạ danh mục UMS → mã HEMIS cho từng danh mục dùng (dân tộc, giới tính, quốc
  tịch, tôn giáo, chức vụ, chức danh, ngạch, học hàm, trình độ, loại hợp đồng, trạng thái
  cán bộ / học viên, loại hình đào tạo, ngành…).
- Một số trường HEMIS là mã quy ước ghi thẳng trong spec, không có danh mục:
  `LOAI_KHEN_THUONG_ID` 1/2/3, `TRANG_THAI_ID` BGH 01/02, `TINH_TRANG_ID` văn bản
  01/02/03, `DOI_TUONG` hướng dẫn 0/1, `LOAI_LIEN_KET` 1/2/3, `DAO_TAO_GDQPAN` 1/2,
  `TINH_TRANG_SU_DUNG` CSVC (1 = đang dùng), `TRANG_THAI_ID` học tập 04 = tốt nghiệp,
  `LOAI_HOC_VIEN` 0 = sinh viên, quốc tịch VN = 704.

## 6. Việc cần làm, theo thứ tự

**Ngoài kho này (backend, chiếm phần lớn):**

1. Xin từ Bộ: tài khoản, `client_secret`, `DON_VI_ID`, đăng ký đồng bộ. Chưa có thì không
   thử được gì.
2. Chọn phương án ký số (ưu tiên dùng lại MISA eSign đang có).
3. Viết procedure PL/SQL xuất dữ liệu đúng cấu trúc từng bảng, kèm bảng ánh xạ mã.
4. Viết dịch vụ đồng bộ: token → dựng XML → ký → db16 → db{n}; ghi nhật ký theo `IdKey`.

**Trong `_v2` (sau khi backend có procedure):**

5. Phân hệ mới "Đồng bộ HEMIS", ba màn: ánh xạ danh mục nội bộ ↔ mã HEMIS; chọn nhóm
   (PH) và bấm đồng bộ, xem trước dữ liệu; nhật ký lỗi Bộ trả về.
6. Bổ sung ô còn thiếu ở màn hồ sơ cán bộ / sinh viên nếu procedure báo thiếu (CCCD, địa
   giới mới, ngành đứng tên, hệ số tham gia…).

**Gợi ý bước đầu:** lập bảng ánh xạ chi tiết từng trường HEMIS ↔ cột UMS cho nhóm CANBO
(db3) trước, vì đó là nhóm trường có dữ liệu đầy đủ nhất.
