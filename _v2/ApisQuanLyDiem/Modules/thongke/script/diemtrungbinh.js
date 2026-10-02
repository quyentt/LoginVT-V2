/* =========================================================================
   Thống kê điểm trung bình (Quản lý điểm)
   Bản gốc: ApisQuanLyDiem/Modules/thongke/html/diemtrungbinh.html + script/diemtrungbinh.js
   (html gốc nạp "DiemTrungBinh.js" — IIS không phân biệt hoa thường).
   Khung chung: _chung.js (ums.qldTk.manBang) — tệp gốc là bản chép của diemhocphan.js.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       Khung trái: xem _chung.js — CÓ ô Phạm vi tổng hợp (DIEM.PHAMVITONGHOPDIEM); chọn phạm vi thì hiện ô thời
       gian tương ứng (Toàn khóa: không có ô; Nhiều kỳ: chọn nhiều; Năm học; Học kỳ; Đợt học).
       Danh mục DIEM.THANGDIEM                                      ô Thang điểm
       Ô cố định: Tính chất lọc (1 Cao nhất · 0 Thấp nhất), Thuộc tính điểm ("Lần 1" · "Cao nhất" — gửi CHỮ vào
       dThuocTinhDiem, như gốc), Có tự động tính lại điểm trung bình (0 Không · 1 Có).
       "Thực hiện":  D_TongHop_XuLy/ThucHien_ThongKe_DTB  POST (strThoiGian_Id = ô thời gian của phạm vi đang chọn)
       "Xem bảng":   D_ThongKe/LayDSDiem_ThongKe_DTB     GET { strBangDuLieu }
       "Xóa bảng":   D_ThongKe/Xoa_Diem_ThongKe_DTB      POST { strBangDuLieu } (hỏi lại như gốc)
   Lỗi gốc đã sửa:
     · Mẫu báo cáo đọc edu.DiemTrungBinh.strPhamViMa (không tồn tại) → TypeError; nay đọc phạm vi đang chọn.
     · Xoá xong gốc gọi me.getList_TangThem (không tồn tại) → nay chỉ xoá trắng bảng đang hiện.
   Bỏ (không có ô trên màn): nạp DIEM.LOAIDANHSACH, DIEM.LOAIDIEMTRUNGBINH vào ô không tồn tại.
   Tiêu đề bảng gốc có cột "Điểm trung bình" nhưng không đổ dữ liệu (chỉ 2 cột) → không vẽ cột trống.
   ========================================================================= */
(function () {
    'use strict';
    var Q = ums.qldTk, pat = ums.pat;
    var root = document.getElementById('qld-diemtrungbinh');
    function chon(key, ds) {
        return '<select class="ums-select" data-f="' + key + '" data-required>' + ds.map(function (x) {
            return '<option value="' + x[0] + '">' + x[1] + '</option>';
        }).join('') + '</select>';
    }

    Q.manBang({
        root: root, tieuDe: 'Thống kê điểm trung bình', phamVi: true,
        ds: 'D_ThongKe/LayDSDiem_ThongKe_DTB', xoa: 'D_ThongKe/Xoa_Diem_ThongKe_DTB',
        phai:
            Q.truong('Thang điểm', Q.sel('td', 'Chọn thang điểm')) +
            Q.truong('Tính chất lọc', chon('tcl', [['1', 'Cao nhất'], ['0', 'Thấp nhất']])) +
            Q.truong('Lọc từ giá trị', Q.inp('tu')) +
            Q.truong('Lọc đến giá trị', Q.inp('den')) +
            Q.truong('Thuộc tính điểm', chon('ttd', [['Lần 1', 'Lần 1'], ['Cao nhất', 'Cao nhất']])) +
            Q.truong('Số lượng cần lấy', Q.inp('sl')) +
            Q.truong('Có tự động tính lại điểm trung bình', chon('tdg', [['0', 'Không'], ['1', 'Có']])),
        ganPhai: function (root, api) {
            ums.api.dm('DIEM.THANGDIEM').then(function (d) { pat.fill(api.f('td'), d); }).catch(function () {});
        },
        luu: function (api, g) {
            return {
                action: 'D_TongHop_XuLy/ThucHien_ThongKe_DTB',
                strPhamViTongHop_Id: g('pv'), strThoiGian_Id: api.thoiGian(), strDaoTao_HeDaoTao_Id: g('he'), strDaoTao_KhoaDaoTao_Id: g('khoa'),
                strDaoTao_ChuongTrinh_Id: g('ct'), strDaoTao_KhoaQuanLy_Id: g('kql'), strDaoTao_LopQuanLy_Id: g('lop'),
                strTrangThaiSinhVien_Id: g('tt'), strThangDiem_Id: g('td'), strTinhChatLoc: g('tcl'),
                dGiaTri_Tu: g('tu'), dGiaTri_Den: g('den'), dThuocTinhDiem: g('ttd'), dSoLuongCanLay: g('sl'),
                strCoTuDongTinhLaiDiem: g('tdg'), strTenBangDuLieu: g('bang'), strNguoiThucHien_Id: ''
            };
        },
        bc: function (add, api) { Q.bc(add, api, api.thoiGian()); }
    });
})();
