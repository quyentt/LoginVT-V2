/* =========================================================================
   Tự nhập hồ sơ — Cổng sinh viên › Hồ sơ cá nhân
   (vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/profile/html/tunhaphoso.html
            + script/tunhaphoso.js (lớp TuNhapHoSo, vỏ index / Core)
   ---------------------------------------------------------------------------
   Bố cục giữ nguyên bản gốc, MỘT cột:
     dải tab (TAB_THONGTIN) → khung "Thông tin cá nhân" (ảnh đổi được + Họ tên /
     Ngày sinh / CMND / Mã SV / Ngành / Lớp quản lý / ô chọn Kế hoạch + menu mẫu
     báo cáo) → bảng "Nhóm | Tên thông tin | Dữ liệu cần nhập | Xác nhận từ
     trường" → nút "Lưu thông tin".
   Khung chung: ums.csvProfile.manHoSo (script/_profile.js) — dùng chung với
   màn "Hồ sơ sinh viên" (hoso).

   Lời gọi (chép nguyên action / func / tên tham số — xem _profile.js):
     pkg_hososinhvien_kehoach.LayDSKeHoachNhapHoSo    ô "Kế hoạch" (chọn sẵn mục đầu)
     pkg_hososinhvien_kehoach.LayDSHoSoChoPhepSVNhap  danh sách trường thông tin
     pkg_hososinhvien_kehoach.LayDSTabThongTinNguoiHoc dải tab
     pkg_hososinhvien_kehoach.Them_QLSV_KeHoach_DuLieu lưu TỪNG trường
     pkg_hosohocvien.Sua_QLSV_NguoiHoc_1              lưu ảnh cá nhân (save_Anh)
     pkg_hosohocvien.LayThongTinChiTietHoSo           khối thông tin cá nhân
   Tham số giữ nguyên chỗ bản gốc đọc ô KHÔNG tồn tại → gửi rỗng:
     strDaoTao_ChuongTrinh_Id, strHanhDong_Id (đều là edu.util.getValById('dropAAAA')).

   Lỗi của bản gốc (xem báo cáo):
     · me.bcheck là CHỐT MỘT CHIỀU: bật khi kế hoạch đang chọn có
       XACNHANTHONGTIN = 0, không bao giờ tắt lại → đổi sang kế hoạch khác thì ô
       nhập vẫn đọc/ghi nhầm cột. Bản mới tính lại theo kế hoạch đang chọn.
     · Kiểm ràng buộc duyệt TOÀN BỘ trường bắt buộc (mọi tab) trong khi chỉ các
       trường của TAB ĐANG MỞ mới có ô trên màn: trường bắt buộc có DODAI ở tab
       khác làm `undefined.toString()` → TypeError, bấm Lưu là đứng. Bản mới kiểm
       và lưu đúng các trường của tab đang mở (chính là tập bản gốc đem đi lưu).
     · Ô kiểu TEXT/NUMBER có DORONG dựng <textarea value="…"> — textarea không
       có thuộc tính value nên ô luôn TRỐNG, nhập lại từ đầu. Bản mới đổ giá trị
       vào thân thẻ.
     · $(".hssv").hide() — màn không có phần tử nào mang lớp đó (mã chết).

   Kéo gốc lần 4 (fed68f6e..HEAD, 30/9) — đã chuyển:
     · Ô "Kế hoạch nhập hồ sơ" đứng riêng một dải NGAY TRÊN dải tab (gốc .tnhs-plan-bar) — cờ locTren.
     · Dải tab chỉ giữ tab có ít nhất một trường; không còn tab nào → khung trống "Kế hoạch này chưa
       có nhóm thông tin nào để nhập" (cờ tabCoTruong).
     · Danh sách trường vẽ theo NHÓM (THUOCNHOM chuẩn hoá NFC + khoảng trắng + chữ hoa, nhóm rỗng →
       "THÔNG TIN CHUNG"): mỗi nhóm một tiêu đề + số trường + bảng Tên | Dữ liệu cần nhập | Xác nhận;
       tab không có trường → khung trống (cờ theoNhom).
     · Ảnh đại diện: tải lên xong TỰ LƯU và báo "Đã lưu ảnh đại diện" (cờ tuLuuAnh); strAnh gửi đường
       dẫn chính thức (= getImage: chép ảnh "unsave_" qua copyfile — ums.files.avatar.finalize); không
       có ảnh thì không gọi Sua_QLSV_NguoiHoc_1. Bấm "Lưu thông tin" vẫn lưu ảnh trước như gốc nhưng
       không báo riêng (bảng tiến độ đã báo).
     · Trường LIST có THONGTIN5 (ID trường con) / TINH có THONGTIN3 (ID trường LIST con): ô con lọc
       danh mục theo QUANHECHA_ID = giá trị ô cha — _profile.js sauKhiVe (noiTang).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('pf-tunhaphoso');
    if (!root || !ums.csvProfile) return;
    var P = ums.csvProfile, e = P.e;

    P.manHoSo(root, {
        tieuDe: 'Tự nhập hồ sơ',
        sua: true,
        anh: 'sua',
        lop: true,
        nguonSV: 'hoSo',
        cotDuLieu: 'Dữ liệu cần nhập',
        locTren: 'Kế hoạch nhập hồ sơ',
        tabCoTruong: true,
        theoNhom: true,
        tuLuuAnh: true,

        loc: {
            nhan: 'Kế hoạch', id: 'ID', name: 'MOTA', ma: 'XACNHANTHONGTIN',
            tai: function () {
                return P.goi('keHoach', { strQLSV_NguoiHoc_Id: P.sv() }).then(function (r) { return r.data; });
            }
        },
        /* Bản gốc: option mang name = XACNHANTHONGTIN; "0" thì ô nhập mang
           TRUONGTHONGTIN_GIATRI, ngược lại mang THONGTINXACMINH */
        bcheck: function (dong) { return !!dong && String(e(dong.XACNHANTHONGTIN)) === '0'; },

        ds: { nguon: 'dsSV', tham: function (v) {
            return { strQLSV_KeHoach_NguoiHoc_Id: v, strQLSV_NguoiHoc_Id: P.sv(), strHanhDong_Id: '' };
        } },
        tab: { nguon: 'tabSV', tham: function (v) {
            return { strQLSV_KeHoach_NguoiHoc_Id: v, strQLSV_NguoiHoc_Id: P.sv(), strHanhDong_Id: '' };
        } },

        /* save_TuNhapHoSo — giá trị vào TRUONGTHONGTIN_GIATRI hay THONGTINXACMINH
           tuỳ cờ bcheck, cột còn lại giữ nguyên giá trị đang có như bản gốc */
        luu: function (v, x, giaTri, bcheck) {
            return {
                action: P.G.luuTruong.action, func: P.G.luuTruong.func,
                strQLSV_NguoiHoc_Id: P.sv(),
                strDaoTao_ChuongTrinh_Id: '',
                strQLSV_KeHoach_NguoiHoc_Id: v,
                strTruongThongTin_Id: e(x.ID),
                strTruongThongTin_GiaTri: bcheck ? giaTri : e(x.TRUONGTHONGTIN_GIATRI),
                strThongTinXacMinh: bcheck ? e(x.THONGTINXACMINH) : giaTri
            };
        },

        baoCao: function (add, v) {
            add('strQLSV_NguoiHoc_TTTS_Id', P.sv());
            add('strQLSV_KeHoach_NguoiHoc_Id', v);
        }
    });
})();
