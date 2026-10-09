/* =========================================================================
   Hồ sơ sinh viên — Cổng sinh viên › Hồ sơ cá nhân  (CHỈ XEM)
   (vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/profile/html/hoso.html
            + script/hoso.js (lớp HoSo, vỏ index / Core)
   ---------------------------------------------------------------------------
   Bố cục giữ nguyên bản gốc, MỘT cột:
     dải tab (TAB_THONGTIN) → khung "Thông tin cá nhân" (ảnh + Họ tên / Ngày sinh
     / CMND / Mã SV / Ngành / Lớp quản lý / ô chọn Chương trình + menu mẫu báo
     cáo) → bảng "Nhóm | Tên thông tin | Dữ liệu | Xác nhận".
   Khung chung: ums.csvProfile.manHoSo (script/_profile.js).

   MÀN CHỈ XEM: bản gốc không có nút Lưu (html không có .btnSave_*), không gọi
   edu.system.uploadAvatar, và geninput `return` ngay ở dòng đầu một ô chỉ đọc
   mang TRUONGTHONGTIN_GIATRI — toàn bộ switch bên dưới là mã chết. save_HoSo /
   save_Anh / actionRowSpanForACol / getList_KeHoach / genCombo_KeHoach của bản
   gốc không nơi nào gọi → bỏ.

   Lời gọi (chép nguyên action / func / tên tham số — xem _profile.js):
     pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc  ô "Chương trình"
         (chọn sẵn mục đầu; id DAOTAO_TOCHUCCHUONGTRINH_ID, tên DAOTAO_CHUONGTRINH_TEN)
     pkg_hosohocvien_quyen.LayDSHoSoChoPhepCBNhap      danh sách trường thông tin
     pkg_hosohocvien_quyen.LayDSTabThongTinNguoiHoc    dải tab
     pkg_hosohocvien.LayThongTinChiTietHoSo            khối thông tin cá nhân
   (Bản gốc khai hai obj_save trong getList_HoSo / getList_DM_HoatDong, obj thứ
   hai ĐÈ obj thứ nhất — nên các lời gọi pkg_hososinhvien_kehoach.* ở màn này
   không bao giờ chạy. Giữ đúng cặp đang chạy: …_quyen.*)

   Lỗi của bản gốc (xem báo cáo):
     · Ảnh đại diện KHÔNG BAO GIỜ hiện: viewForm_SinhVien đổ ảnh vào
       #srcuploadPicture_SV — phần tử chỉ có sau edu.system.uploadAvatar, mà màn
       này không gọi uploadAvatar. Bản mới hiện ảnh ở dạng CHỈ XEM (đúng ý định).
     · Tiêu đề cột thứ tư bị chú thích bỏ trong html nhưng ô dữ liệu
       (KETQUAXACNHAN_TEN) vẫn vẽ → cột không có tên. Bản mới đặt lại đúng chữ
       của chính phần tử bị chú thích: "Xác nhận từ trường".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('pf-hoso');
    if (!root || !ums.csvProfile) return;
    var P = ums.csvProfile;

    P.manHoSo(root, {
        tieuDe: 'Hồ sơ sinh viên',
        sua: false,
        anh: 'xem',
        lop: true,
        nguonSV: 'hoSo',
        cotDuLieu: 'Dữ liệu',

        loc: {
            nhan: 'Chương trình', id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN',
            tai: function () {
                return P.goi('chuongTrinh', { strQLSV_NguoiHoc_Id: P.sv() }).then(function (r) { return r.data; });
            }
        },

        ds: { nguon: 'dsCB', tham: function (v) {
            return { strQLSV_NguoiHoc_Id: P.sv(), strDaoTao_ChuongTrinh_Id: v };
        } },
        tab: { nguon: 'tabCB', tham: function (v) {
            return { strQLSV_NguoiHoc_Id: P.sv(), strDaoTao_ChuongTrinh_Id: v };
        } },

        /* getList_MauImport "zonebtnBaoCao_TNHS": bản gốc gửi kèm ô
           dropSearch_KeHoach — màn này KHÔNG có ô đó nên giá trị là rỗng. */
        baoCao: function (add) {
            add('strQLSV_NguoiHoc_TTTS_Id', P.sv());
            add('strQLSV_KeHoach_NguoiHoc_Id', '');
        }
    });
})();
