/* =========================================================================
   Thống kê điểm học phần (Quản lý điểm)
   Bản gốc: ApisQuanLyDiem/Modules/thongke/html/diemhocphan.html + script/diemhocphan.js
   Khung chung: _chung.js (ums.qldTk.manBang) — bố cục hai khung "Thông tin" | "Tính chất lọc dữ liệu" + bảng kết quả.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       Khung trái: xem _chung.js (html gốc CHÚ THÍCH BỎ ô Phạm vi tổng hợp → chỉ hiện ô "Nhiều kỳ").
       Danh mục DIEM.THANGDIEM · DIEM.LOAIDANHSACH                  ô Thang điểm · Loại danh sách
       D_ThanhPhanDiem/LayDanhSach  GET (dLaThanhPhanDiemCuoi 0, pageSize 1000000)   ô Thành phần điểm
       edu.system.getList_CoCauToChuc (iTrangThai 1) → ums.ref.coCauToChuc          ô Đơn vị
       KHCT_HocPhan/LayDanhSach     GET (strThuocBoMon_Id = Đơn vị, pageSize 100000) ô Học phần ("TEN - MA")
       "Thực hiện":  D_TongHop_XuLy/ThucHien_ThongKe_DHP  POST
           strThoiGian_Id khai HAI lần trong đối tượng gốc — lần sau thắng: = ô Nhiều kỳ.
           dThuocTinhDiem, strCoTuDongTinhLaiDiem đọc ô không có trên màn → rỗng.
       "Xem bảng":   D_ThongKe/LayDSDiem_ThongKe_DiemHP  GET { strBangDuLieu }
       "Xóa bảng":   D_ThongKe/Xoa_Diem_ThongKe_DiemHP   POST { strBangDuLieu } (hỏi lại như gốc)
   Lỗi gốc đã sửa:
     · Mẫu báo cáo đọc edu.DiemHocPhan.strPhamViMa (biến không tồn tại) → TypeError, nút báo cáo không chạy.
       Nay strDaoTao_ThoiGianDaoTao_Id = ô Nhiều kỳ (ô thời gian duy nhất trên màn, cùng giá trị "Thực hiện" gửi).
     · Xoá xong gốc gọi me.getList_TangThem (không tồn tại) → nay chỉ xoá trắng bảng đang hiện.
   Bỏ (không có ô trên màn): nạp DIEM.PHAMVITONGHOPDIEM, DIEM.LOAIDIEMTRUNGBINH vào ô không tồn tại.
   Tiêu đề bảng gốc có cột "Điểm trung bình" nhưng không đổ dữ liệu (chỉ 2 cột) → không vẽ cột trống.
   Nối tầng: Đơn vị → Học phần (khoá tới khi chọn Đơn vị — gốc nạp sẵn mọi học phần).
   ========================================================================= */
(function () {
    'use strict';
    var pat = ums.pat, Q = ums.qldTk;
    var root = document.getElementById('qld-diemhocphan');
    function arr(d) { return Array.isArray(d) ? d : []; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    var TCL = '<select class="ums-select" data-f="tcl" data-required><option value="1">Cao nhất</option><option value="0">Thấp nhất</option></select>';

    Q.manBang({
        root: root, tieuDe: 'Thống kê điểm học phần', phamVi: false,
        ds: 'D_ThongKe/LayDSDiem_ThongKe_DiemHP', xoa: 'D_ThongKe/Xoa_Diem_ThongKe_DiemHP',
        phai:
            Q.truong('Thang điểm', Q.sel('td', 'Chọn thang điểm')) +
            Q.truong('Tính chất lọc', TCL) +
            Q.truong('Lọc từ giá trị', Q.inp('tu')) +
            Q.truong('Lọc đến giá trị', Q.inp('den')) +
            Q.truong('Loại danh sách', Q.sel('lds', 'Chọn loại danh sách')) +
            Q.truong('Số lượng cần lấy', Q.inp('sl')) +
            Q.truong('Thành phần điểm', Q.sel('tpd', 'Chọn thành phần điểm')) +
            Q.truong('Đơn vị', Q.sel('dv', 'Chọn đơn vị')) +
            Q.truong('Học phần', Q.sel('hp', 'Chọn học phần')),
        ganPhai: function (root, api) {
            var f = api.f;
            ums.api.dm('DIEM.THANGDIEM').then(function (d) { pat.fill(f('td'), d); }).catch(function () {});
            ums.api.dm('DIEM.LOAIDANHSACH').then(function (d) { pat.fill(f('lds'), d); }).catch(function () {});
            ums.api.call({ action: 'D_ThanhPhanDiem/LayDanhSach', method: 'GET', strTuKhoa: '', strThangDiem_Id: '', strQuyTacLamTron_Id: '',
                dLaThanhPhanDiemCuoi: 0, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000, silent: true })
                .then(function (r) { pat.fill(f('tpd'), arr(r.data)); }).catch(function (err) { ums.api.handle(err, 'D_ThanhPhanDiem/LayDanhSach'); });
            ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
                .then(function (d) { pat.fill(f('dv'), d); }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
            function napHP() {
                if (!api.v('dv')) return;
                ums.api.call({ action: 'KHCT_HocPhan/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_MonHoc_Id: '', strThuocBoMon_Id: api.v('dv'),
                    strThuocTinhHocPhan_Id: '', strNguoiThucHien_Id: (ums.session && ums.session.userId) || '', pageIndex: 1, pageSize: 100000, silent: true })
                    .then(function (r) { pat.fill(f('hp'), arr(r.data), { name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); } }); })
                    .catch(function (err) { ums.api.handle(err, 'KHCT_HocPhan/LayDanhSach'); });
            }
            if (window.jQuery) jQuery(f('dv')).on('select2:select', napHP);
            pat.chain([f('dv'), f('hp')], { phatLai: false });
        },
        luu: function (api, g) {
            return {
                action: 'D_TongHop_XuLy/ThucHien_ThongKe_DHP',
                strPhamViTongHop_Id: g('pv'), strDaoTao_HeDaoTao_Id: g('he'), strDaoTao_KhoaDaoTao_Id: g('khoa'),
                strDaoTao_ChuongTrinh_Id: g('ct'), strDaoTao_KhoaQuanLy_Id: g('kql'), strDaoTao_LopQuanLy_Id: g('lop'),
                strTrangThaiSinhVien_Id: g('tt'), strThangDiem_Id: g('td'), strTinhChatLoc: g('tcl'),
                dGiaTri_Tu: g('tu'), dGiaTri_Den: g('den'), dThuocTinhDiem: '', dSoLuongCanLay: g('sl'),
                strCoTuDongTinhLaiDiem: '', strTenBangDuLieu: g('bang'), strNguoiThucHien_Id: '',
                strThoiGian_Id: g('tg_NHIEUKY'), strLoaiDanhSach_Id: g('lds'), strDiem_ThanhPhanDiem_Id: g('tpd'), strDaoTao_HocPhan_Id: g('hp')
            };
        },
        bc: function (add, api) { Q.bc(add, api, api.v('tg_NHIEUKY')); }
    });
})();
