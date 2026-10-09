/* =========================================================================
   Số tháng tính tiền (theo chương trình × thời gian)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/sothangtinhtien.js
   ---------------------------------------------------------------------------
   Bản gốc là bản chép của mucphi.js (diff chỉ khác tên ô, action, cột
   SOTHANG / tham số dSoThang và không định dạng tiền). Dùng chung khung
   ums.dmhsB.mucPhi (_chung_b.js).
   Lời gọi (kiểu cũ, không mã hoá):
       TC_SoThang_TinhTien/LayDSThoiGian_SoThang_TinhTien   GET  cột thời gian
       TC_SoThang_TinhTien/LayDSTaiChinh_CT_SoThang         GET  dòng chương trình
       TC_SoThang_TinhTien/LayDanhSach                      GET  giá trị các ô
       TC_SoThang_TinhTien/ThemMoi | CapNhat                POST
       TC_SoThang_TinhTien/Xoa                              POST strIds
   Khác bản gốc / cố ý bỏ: như mucphi.js (nút Xoá chỉ khi sửa; bỏ
   getList_KieuHoc vì đổ vào ô không tồn tại).
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
            strNghiepVuApDung_Id: f.nv
        };
    }
    function merge(a, b) { Object.keys(b).forEach(function (k) { a[k] = b[k]; }); return a; }

    B.mucPhi({
        root: document.getElementById('sothangtinhtien'),
        title: 'Số tháng tính tiền',
        formTitle: 'số tháng tính tiền',
        icon: 'fa-calendar-days',
        rowTitle: 'Chương trình',
        hasCT: false,
        target: 'ct',
        editable: true,
        money: false,
        valCol: 'SOTHANG',
        valParam: 'dSoThang',
        valLabel: 'Số tháng',
        pre: 'TC_SoThang_TinhTien',
        rowKey: function (r) { return B.e(r.PHAMVIAPDUNG_ID); },
        rowLabel: function (r) { return B.e(r.DAOTAO_TOCHUCCHUONGTRINH_TEN); },

        cols: function (f) {
            return merge({ action: 'TC_SoThang_TinhTien/LayDSThoiGian_SoThang_TinhTien', method: 'GET' },
                merge(base(f), { strNguoiThucHien_Id: '' }));
        },
        rows: function (f) {
            return merge({ action: 'TC_SoThang_TinhTien/LayDSTaiChinh_CT_SoThang', method: 'GET', versionAPI: 'v1.0' },
                merge(base(f), { strTuKhoa: '', strNguoiThucHien_Id: '' }));
        },
        vals: function (f) {
            return {
                action: 'TC_SoThang_TinhTien/LayDanhSach',
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
                pageSize: 100000
            };
        }
    });
})();
