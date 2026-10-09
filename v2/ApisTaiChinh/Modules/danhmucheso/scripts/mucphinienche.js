/* =========================================================================
   Mức thu niên chế (sinh viên × thời gian)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/mucphinienche.js
   ---------------------------------------------------------------------------
   Bản chép của mucphilop.js, ba lời gọi nạp đổi sang procedure có mã hoá;
   dòng là sinh viên, khoá dòng = QLSV_NGUOIHOC_ID + DAOTAO_TOCHUCCHUONGTRINH_ID
   (64 ký tự — bản gốc cắt id ô bằng substring(5, 69)).
   Khung chung ums.dmhsB.mucPhi (_chung_b.js).
   Lời gọi:
       PKG_TAICHINH_THUCHI3.LayDSThoiGian_MucPhi_SV_Tien   cột thời gian
       PKG_TAICHINH_THUCHI3.LayDSTaiChinh_SV_SoTien        dòng sinh viên
       PKG_TAICHINH_THUCHI3.LayDSTC_MucPhi_SV_DuLieu       giá trị các ô
       pkg_hosohocvien.LayDanhSachHoSoNhieuNganh           ô Sinh viên trong hộp thêm (theo lớp)
       TC_MucPhi_SoTien/ThemMoi | CapNhat                  lưu (action của mucphi, đúng như bản gốc)

   Như bản gốc: ô trong lưới KHÔNG có nút sửa (bản gốc đã comment), nên hộp
   chỉ dùng để thêm; không có đường vào Xoá.
   Lỗi bản gốc: bấm Lưu trong hộp khi chưa chọn sinh viên → aDataSV
   undefined → lỗi JS. Bản mới báo "Hãy chọn sinh viên".
   Khác bản gốc / cố ý bỏ: như mucphi.js.
   ========================================================================= */
(function () {
    'use strict';

    var B = ums.dmhsB;

    function base(f) {
        return {
            strDaoTao_ThoiGianDaoTao_Id: f.tg,
            strHeDaoTao_Id: f.he,
            strKhoaDaoTao_Id: f.khoa,
            strDonViTinh_Id: f.dvt,
            strTaiChinh_CacKhoanThu_Id: f.kt,
            strNghiepVuApDung_Id: f.nv,
            strNguoiThucHien_Id: '',
            strTuKhoa: '',
            strChuongTrinh_Id: f.ct
        };
    }
    function merge(a, b) { Object.keys(b).forEach(function (k) { a[k] = b[k]; }); return a; }

    B.mucPhi({
        root: document.getElementById('mucphinienche'),
        title: 'Mức thu niên chế',
        formTitle: 'mức thu niên chế',
        icon: 'fa-user-graduate',
        rowTitle: 'Sinh viên',
        hasCT: true,
        target: 'sv',
        editable: false,
        money: true,
        valCol: 'TONGSOTIEN',
        valParam: 'dTongSoTien',
        valLabel: 'Mức phí',
        pre: 'TC_MucPhi_SoTien',
        rowKey: function (r) { return B.e(r.PHAMVIAPDUNG_ID); },
        rowLabel: function (r) {
            return B.e(r.QLSV_NGUOIHOC_MASO) + ' - ' + B.e(r.QLSV_NGUOIHOC_HODEM) + ' ' + B.e(r.QLSV_NGUOIHOC_TEN) +
                ' - ' + B.e(r.DAOTAO_LOPQUANLY_TEN) + ' - ' + B.e(r.DAOTAO_CHUONGTRINH_TEN);
        },

        cols: function (f) {
            return merge({
                action: 'TC_ThuChi3_MH/DSA4BRIVKS4oBiggLx4MNCIRKSgeEhceFSgkLwPP',
                func: 'PKG_TAICHINH_THUCHI3.LayDSThoiGian_MucPhi_SV_Tien'
            }, base(f));
        },
        rows: function (f) {
            return merge({
                action: 'TC_ThuChi3_MH/DSA4BRIVICgCKSgvKR4SFx4SLhUoJC8P',
                func: 'PKG_TAICHINH_THUCHI3.LayDSTaiChinh_SV_SoTien'
            }, base(f));
        },
        vals: function (f) {
            return {
                action: 'TC_ThuChi3_MH/DSA4BRIVAh4MNCIRKSgeEhceBTQNKCQ0',
                func: 'PKG_TAICHINH_THUCHI3.LayDSTC_MucPhi_SV_DuLieu',
                strTuKhoa: '',
                strPhamViApDung_Id: '',
                strPhanCapApDung_Id: '',
                strNgayApDung: '',
                strDonViTinh_Id: f.dvt,
                strTaiChinh_CacKhoanThu_Id: f.kt,
                strDaoTao_ThoiGianDaoTao_Id: f.tg,
                strNguoiThucHien_Id: '',
                pageIndex: 1,
                pageSize: 100000,
                strHeDaoTao_Id: f.he,
                strKhoaDaoTao_Id: f.khoa,
                strChuongTrinh_Id: f.ct,
                strNghiepVuApDung_Id: f.nv
            };
        },

        /* getList_SinhVienMD (mucphinienche.js:1005) */
        svCall: function (lop) {
            return {
                action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
                func: 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh',
                strTuKhoa: '',
                strNamNhapHoc: '',
                strKhoaQuanLy_Id: '',
                strHeDaoTao_Id: '',
                strKhoaDaoTao_Id: '',
                strChuongTrinh_Id: '',
                strLopQuanLy_Id: lop,
                strTrangThaiNguoiHoc_Id: '',
                strChucNang_Id: '',
                strNguoiTao_Id: '',
                strNguoiThucHien_Id: '',
                pageIndex: 1,
                pageSize: 10000
            };
        }
    });
})();
