/* =========================================================================
   Mức phí (theo chương trình × thời gian)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/mucphi.js
   ---------------------------------------------------------------------------
   Lưới nhập: dòng = chương trình, cột = thời gian; sửa trong ô rồi "Cập
   nhật" để lưu hàng loạt. Khung chung ở ums.dmhsB.mucPhi (_chung_b.js).
   Lời gọi (kiểu cũ, không mã hoá):
       TC_MucPhi_SoTien/LayDSThoiGian_MucPhi_SoTien   GET  cột thời gian
       TC_MucPhi_SoTien/LayDSTaiChinh_CT_SoTien       GET  dòng chương trình
       TC_MucPhi_SoTien/LayDanhSach                   GET  giá trị các ô
       TC_MucPhi_SoTien/ThemMoi | CapNhat             POST (CapNhat khi có strId)
       TC_MucPhi_SoTien/Xoa                           POST strIds
   Nguồn lọc: edu.system.getList_HeDaoTao / getList_KhoaDaoTao (nạp một lần,
   lọc tại máy theo hệ) / getList_ChuongTrinhDaoTao, danh mục QLTC.DVT
   (option mang MA — TC_ThoiGianTheoDonViTinh nhận MA chứ không phải ID),
   TC_KhoanThu/LayDanhSach, ô ẩn nghiệp vụ QLTC.NVAP.

   Khác bản gốc (có chủ đích):
     · "Cập nhật" chỉ gửi ô THỰC SỰ đổi. Bản gốc so giá trị đã định dạng
       ("1,500,000") với title thô ("1500000") nên mọi ô có sẵn giá trị đều
       bị coi là đã đổi và bị lưu lại.
     · Nút Xoá trong hộp chỉ hiện khi sửa (bản gốc luôn hiện, bấm khi thêm
       mới là gọi Xoa với strIds rỗng).
   Cố ý bỏ: getList_KieuHoc (CM_DanhMucDuLieu/LayDanhSach) — chỉ đổ vào
   #dropKieuHoc_MP / #dropNew_KieuHoc, hai ô không có trong HTML;
   #btnCapNhatAll không có trong HTML.
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
        root: document.getElementById('mucphi'),
        title: 'Mức phí',
        formTitle: 'mức phí',
        icon: 'fa-circle-dollar-to-slot',
        rowTitle: 'Chương trình',
        hasCT: false,
        target: 'ct',
        editable: true,
        money: true,
        valCol: 'TONGSOTIEN',
        valParam: 'dTongSoTien',
        valLabel: 'Mức phí',
        pre: 'TC_MucPhi_SoTien',
        rowKey: function (r) { return B.e(r.PHAMVIAPDUNG_ID); },
        rowLabel: function (r) { return B.e(r.DAOTAO_TOCHUCCHUONGTRINH_TEN); },

        cols: function (f) {
            return merge({ action: 'TC_MucPhi_SoTien/LayDSThoiGian_MucPhi_SoTien', method: 'GET' },
                merge(base(f), { strNguoiThucHien_Id: '' }));
        },
        rows: function (f) {
            return merge({ action: 'TC_MucPhi_SoTien/LayDSTaiChinh_CT_SoTien', method: 'GET', versionAPI: 'v1.0' },
                merge(base(f), { strTuKhoa: '', strNguoiThucHien_Id: '' }));
        },
        vals: function (f) {
            return {
                action: 'TC_MucPhi_SoTien/LayDanhSach',
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
