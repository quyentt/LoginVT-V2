/* =========================================================================
   Nhân sự ngoài trường — khởi tạo / sửa hồ sơ cán bộ NGOÀI trường (thỉnh giảng, hội đồng…)
   Bản gốc: ApisNhanSu/Modules/hoso/script/nhansungoaitruong.js + html/nhansungoaitruong.html
   ---------------------------------------------------------------------------
   Hai cột như gốc (col-lg-3 "Danh sách nhân sự ngoài trường" + col-lg-9 biểu mẫu
   "Khởi tạo") — ums.crud({ master }). Cột trái: ô từ khoá; mục = Họ tên / Email / Số điện thoại.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       Danh sách  edu.system.getList_NhanSu → pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2
                  (strTuKhoa, strDaoTao_CoCauToChuc_Id '' — gốc đọc ô Khoa/Bộ môn không có trên màn,
                   dLaCanBoNgoaiTruong 1)
       NS_HoSoV2/LayChiTiet     GET strId
       NS_HoSo_NgoaiV2/ThemMoi | CapNhat   ~70 tham số, phần lớn rỗng (thứ tự chép nguyên),
                                strLaCanBoNgoaiTruong 1
       NS_HoSoV2/Xoa            strIds (nút Xóa khi đang sửa)
   Danh mục: NS.GITI, NCKH.DMHH (Học hàm), NS.DMHV (Học vị), NS.DMCV (Chức vụ),
   QLCB.CNDT (Chuyên ngành tiến sĩ). Bắt buộc: Tên, Mã số.

   Khác gốc: biểu mẫu không mở sẵn lúc vào màn — bấm "Thêm mới" (BO-CUC luật 1);
   "Viết lại" / "Tạo mới" của gốc thay bằng Đóng → Thêm mới.
   Giữ như gốc (chờ nghiệp vụ, ghi sổ):
     · "Đơn vị công tác" đọc cột HKTT_DIACHI khi sửa nhưng lưu vào strDonViCongTac;
       "Địa chỉ" đọc DIACHI, lưu vào CẢ strNoiSinh_DiaChi lẫn strDiaChi.
     · "Học hàm" đọc CHUCDANH_ID, lưu strHocHam_Id; "Chuyên ngành tiến sĩ" đọc
       CHUYENNGANHHOCVI_ID, lưu strChuyenNganhTienSi_Id.
     · strDienThoai = strSDT_CaNhan = ô Điện thoại.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('nsnhansungoaitruong');
    root.classList.add('nscb');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }

    /* Các tham số gốc gửi rỗng cố định, đúng thứ tự trong obj_save */
    var RONG_1 = ['strNoiSinh_Xa_Id', 'strNoiSinh_Huyen_Id', 'strNoiSinh_Tinh_Id', 'strQueQuan_Xa_Id', 'strQueQuan_Huyen_Id',
        'strQueQuan_Tinh_Id', 'strHKTT_DiaChi', 'strHKTT_Xa_Id', 'strHKTT_Huyen_Id', 'strHKTT_Tinh_Id', 'strNOHN_DiaChi',
        'strNOHN_Xa_Id', 'strNOHN_Huyen_Id', 'strNOHN_Tinh_Id', 'strQuocTich_Id', 'strDanToc_Id', 'strTonGiao_Id',
        'strTDPT_TotNghiepLop', 'strTDPT_He', 'strSoTruongCongTac', 'strThuongBinhHang_Id', 'strGiaDinhChinhSach_Id',
        'strThanhPhanXuatThan_Id', 'strDang_NgayVao', 'strDang_NgayChinhThuc', 'strDang_NoiKetNap', 'strDoan_NgayVao',
        'strDoan_NoiKetNap', 'strCongDoan_NgayVao', 'strNgu_NgayNhap', 'strNgu_NgayXuat', 'strNgu_QuanHam_Id'];
    var RONG_2 = ['strCanCuoc_NgayCap', 'strCanCuoc_NoiCap', 'strNhanXet'];
    var RONG_3 = ['strSDT_CoQuan', 'strSDT_GiaDinh', 'strNgayTGCachMang', 'strNgayTGToChucChinhTriXH', 'strDaoTao_CoCauToChuc_Id',
        'strSoBaoHiem', 'strLoaiDoiTuong_Id', 'strLoaiGiangVien_Id', 'strTinhTrangNhanSu_Id', 'strTinhTrangHonNhan_Id',
        'strTuNhanXetBanThan', 'strTDPT_XepLoaiTotNghiep_Id', 'strQueQuan_DiaChi'];

    ums.crud({
        root: root,
        title: 'Nhân sự ngoài trường',
        formTitle: 'nhân sự ngoài trường',
        icon: 'fa-user-tie',
        master: {
            title: 'Danh sách nhân sự ngoài trường', icon: 'fa-users',
            item: function (r) {
                return '<span class="ums-master__item__main"><b>' + esc(e(r.HOTEN)) + '</b>' +
                    '<span class="ums-master__item__sub">Email: ' + esc(e(r.EMAIL)) + '</span>' +
                    '<span class="ums-master__item__sub">Số điện thoại: ' + esc(e(r.SDT_CANHAN)) + '</span></span>';
            },
            empty: 'Chọn một nhân sự ở danh sách bên trái để sửa, hoặc bấm Thêm mới ở đầu trang để khởi tạo.'
        },
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'NS_HoSo_V2_MH/DSA4BRIPKSAvEjQeCS4SLh43cwPP', func: 'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2',
                    strTuKhoa: f.q, strDaoTao_CoCauToChuc_Id: '', dLaCanBoNgoaiTruong: 1,
                    strTinhTrangNhanSu_Id: '', strChucVu_Id: '', strNguoiThucHien_Id: uid()
                };
            }
        },
        detail: function (row) { return { action: 'NS_HoSoV2/LayChiTiet', method: 'GET', strId: row.ID }; },
        formCols: 12,
        fields: [
            { key: 'strHoDem', col: 'HODEM', label: 'Họ', cols: 6 },
            { key: 'strTen', col: 'TEN', label: 'Tên', required: true, cols: 6 },
            { key: 'strMaSo', col: 'MASO', label: 'Mã số', required: true, cols: 6 },
            { key: 'strNgaySinh', col: 'NGAYSINH', label: 'Ngày sinh', cols: 2 },
            { key: 'strThangSinh', col: 'THANGSINH', label: 'Tháng', cols: 2 },
            { key: 'strNamSinh', col: 'NAMSINH', label: 'Năm', cols: 2 },
            { key: 'strGioiTinh_Id', col: 'GIOITINH_ID', label: 'Giới tính', type: 'select', source: { dm: 'NS.GITI' }, cols: 6 },
            { key: 'strHocHam_Id', col: 'CHUCDANH_ID', label: 'Học hàm', type: 'select', source: { dm: 'NCKH.DMHH' }, cols: 6 },
            { key: 'strHocVi_Id', col: 'HOCVI_ID', label: 'Học vị', type: 'select', source: { dm: 'NS.DMHV' }, cols: 6 },
            { key: 'strChucVu_Id', col: 'CHUCVU_ID', label: 'Chức vụ', type: 'select', source: { dm: 'NS.DMCV' }, cols: 6 },
            { key: 'strChuyenNganhTienSi_Id', col: 'CHUYENNGANHHOCVI_ID', label: 'Chuyên ngành tiến sĩ', type: 'select', source: { dm: 'QLCB.CNDT' }, cols: 6 },
            { key: 'strMaSoThue', col: 'MASOTHUE', label: 'Mã số thuế', cols: 6 },
            { key: 'strCanCuoc_So', col: 'CANCUOC_SO', label: 'CMT/CCCD', cols: 6 },
            { key: 'strEmail', col: 'EMAIL', label: 'Email', cols: 6 },
            { key: 'strDienThoai', col: 'SDT_CANHAN', label: 'Điện thoại', cols: 6 },
            { key: 'strLinhVucNghienCuu', col: 'LINHVUCNGHIENCUU', label: 'Lĩnh vực nghiên cứu', span: true },
            { key: 'strDonViCongTac', col: 'HKTT_DIACHI', label: 'Đơn vị công tác', span: true },
            { key: 'strDiaChi', col: 'DIACHI', label: 'Địa chỉ', span: true }
        ],
        save: function (v, row) {
            var x = {
                action: row ? 'NS_HoSo_NgoaiV2/CapNhat' : 'NS_HoSo_NgoaiV2/ThemMoi',
                strId: row ? row.ID : '',
                strMaSo: v.strMaSo, strHoDem: v.strHoDem, strTen: v.strTen, strTenGoiKhac: '',
                strNgaySinh: v.strNgaySinh, strThangSinh: v.strThangSinh, strNamSinh: v.strNamSinh,
                strGioiTinh_Id: v.strGioiTinh_Id
            };
            RONG_1.forEach(function (k) { x[k] = ''; });
            x.strCanCuoc_So = v.strCanCuoc_So;
            RONG_2.forEach(function (k) { x[k] = ''; });
            x.strEmail = v.strEmail;
            x.strAnh = '';
            x.strSDT_CaNhan = v.strDienThoai;
            RONG_3.forEach(function (k) { x[k] = ''; });
            x.strNoiSinh_DiaChi = v.strDiaChi;
            x.strLaCanBoNgoaiTruong = 1;
            x.strMaSoThue = v.strMaSoThue;
            x.strDienThoai = v.strDienThoai;
            x.strDiaChi = v.strDiaChi;
            x.strHocHam_Id = v.strHocHam_Id;
            x.strHocVi_Id = v.strHocVi_Id;
            x.strChucVu_Id = v.strChucVu_Id;
            x.strChuyenNganhTienSi_Id = v.strChuyenNganhTienSi_Id;
            x.strDonViCongTac = v.strDonViCongTac;
            x.strLinhVucNghienCuu = v.strLinhVucNghienCuu;
            return x;
        },
        multi: false,
        rowDelete: false,
        remove: function (ids) { return ids.map(function (id) { return { action: 'NS_HoSoV2/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
    });
})();
