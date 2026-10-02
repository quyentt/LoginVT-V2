/* =========================================================================
   Mức phí theo lớp (lớp quản lý × thời gian)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/mucphilop.js
   ---------------------------------------------------------------------------
   Bản chép của mucphi.js, thêm ô lọc Chương trình và dòng là lớp quản lý.
   Khung chung ums.dmhsB.mucPhi (_chung_b.js).
   Lời gọi (kiểu cũ, không mã hoá):
       TC_MucPhi_Lop/LayDSThoiGian_MucPhi_Lop_Tien   GET  cột thời gian
       TC_MucPhi_Lop/LayDSTaiChinh_LopQL_SoTien      GET  dòng lớp
       TC_MucPhi_Lop/LayDanhSach                     GET  giá trị các ô
       TC_MucPhi_SoTien/ThemMoi | CapNhat | Xoa      ← lưu/xoá dùng action của
                                                       mucphi, đúng như bản gốc
   Thứ tự như bản gốc: chọn Hệ → lọc Khoá + nạp Chương trình; chọn Khoá →
   nạp Chương trình; chọn Chương trình → nạp danh sách + nạp Lớp (ô Lớp
   trong hộp thêm/sửa); chọn Đơn vị tính → nạp Thời gian + danh sách.
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
        root: document.getElementById('mucphilop'),
        title: 'Mức phí theo lớp',
        formTitle: 'mức phí theo lớp',
        icon: 'fa-people-roof',
        rowTitle: 'Lớp',
        hasCT: true,
        target: 'lop',
        editable: true,
        money: true,
        valCol: 'TONGSOTIEN',
        valParam: 'dTongSoTien',
        valLabel: 'Mức phí',
        pre: 'TC_MucPhi_SoTien',
        rowKey: function (r) { return B.e(r.PHAMVIAPDUNG_ID); },
        rowLabel: function (r) { return B.e(r.DAOTAO_LOPQUANLY_TEN); },

        cols: function (f) {
            return merge({ action: 'TC_MucPhi_Lop/LayDSThoiGian_MucPhi_Lop_Tien', method: 'GET' }, base(f));
        },
        rows: function (f) {
            return merge({ action: 'TC_MucPhi_Lop/LayDSTaiChinh_LopQL_SoTien', method: 'GET', versionAPI: 'v1.0' }, base(f));
        },
        vals: function (f) {
            return {
                action: 'TC_MucPhi_Lop/LayDanhSach',
                method: 'GET',
                versionAPI: 'v1.0',
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
        }
    });
})();
