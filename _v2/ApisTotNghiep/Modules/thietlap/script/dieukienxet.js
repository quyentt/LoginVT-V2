/* =========================================================================
   Điều kiện xét (Xét tốt nghiệp)
   Bản gốc: ApisTotNghiep/Modules/thietlap/html/dieukienxet.html + script/dieukienxet.js
   Khung chung (nạp chéo): ApisHocBong/Modules/thietlap/script/_dk.js (ums.hbDk) — hai tab
   chung / riêng, biểu mẫu hai cột, ô phạm vi theo phân cấp, bảng từ khoá. Bản gốc TN là
   khuôn của bản HB (HB thay Phân loại bằng Quỹ học bổng, thêm Xếp loại).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     TN_XepLoai_DieuKien/LayDanhSach        GET: strTuKhoa, strPhanLoai_Id, strXepLoai_Id = '',
                                            strNguoiTao_Id = '' (gốc #dropAAAA), phân trang máy chủ
     TN_XepLoai_DieuKien/ThemMoi|CapNhat    POST: strId, strXauDieuKien, strPhanLoai_Id, iThuTu = '', strMoTa
     TN_XepLoai_DieuKien/Xoa                POST strIds
     TN_XetDuyet_DieuKien_Ad/LayDanhSach    GET: strTuKhoa, strPhanLoai_Id, strPhamViApDung_Id = '',
                                            strPhanCapApDung_Id, strDaoTao_ThoiGianDaoTao_Id = '', strNguoiTao_Id = ''
     TN_XetDuyet_DieuKien_Ad/ThemMoi|CapNhat  POST: strId, strXauDieuKien, strPhanLoai_Id, iThuTu = '',
                                            strMoTa, strPhamViApDung_Id, strDaoTao_ThoiGianDaoTao_Id = ''
     TN_XetDuyet_DieuKien_Ad/Xoa            POST strIds
     TN_PhanCapApDung/LayDanhSach           GET strPhanLoai_Id (ô lọc tab 2)
     TN_ThongTin/LayDSTN_KeHoach            GET — ô Kế hoạch (tham số lọc lúc init = rỗng, pageSize 10000)
     TN_XetDuyet_TuKhoa/LayDanhSach         GET strTuKhoa/strPhanLoai_Id/strNguoiTao_Id = '', pageIndex 1,
                                            pageSize 1000000 — KHÔNG phân trang (gốc chú thích bPaginate)
     TN_XetDuyet_TuKhoa/ThemMoi | CapNhat   POST strId, strTenTuKhoa, strMoTa (dòng nào cũng có ID → CapNhat)
   Danh mục: TN.PHANLOAI (ô lọc hai tab + biểu mẫu), KHCT.LOAILOP (Mô hình).

   Giữ như gốc (đã tự chốt):
     · Tab 1 dùng controller TN_XepLoai_DieuKien — TRÙNG controller tab 1 của "Xếp loại hạ bậc"
       (hai màn hiện cùng một danh sách điều kiện chung), còn tab 2 dùng TN_XetDuyet_DieuKien_Ad.
       Không có controller TN_XetDuyet_DieuKien nào trong mã gốc → không đoán, chép nguyên.
   Khác gốc riêng màn này (phần chung: đầu tệp _dk.js):
     · Gốc nạp danh sách điều kiện riêng ngay lúc mở màn (getList_DieuKienRieng khi chưa chọn
       phân loại / phân cấp) — nay nạp khi chọn Phân loại (tự chọn phân cấp đầu như gốc).
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('tn-dieukienxet');
    if (!root) return;

    function luu(v) { return { strXauDieuKien: v.strXauDieuKien, iThuTu: '', strMoTa: v.strMoTa }; }

    ums.hbDk.man(root, {
        tieuDe: 'Điều kiện xét',
        phanLoai: { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', nhan: 'Phân loại', loc: 'Chọn phân loại', nguon: { dm: 'TN.PHANLOAI' } },
        cotChung: [
            { title: 'Xâu điều kiện', prop: 'XAUDIEUKIEN' },
            { title: 'Mô tả', prop: 'MOTA' }
        ],
        phai: [
            { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', label: 'Xâu điều kiện', type: 'textarea' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ],
        chung: { ctl: 'TN_XepLoai_DieuKien', ds: { strXepLoai_Id: '', strNguoiTao_Id: '' }, luu: luu },
        rieng: { ctl: 'TN_XetDuyet_DieuKien_Ad', ds: { strNguoiTao_Id: '' }, luu: luu },
        phanCap: 'TN_PhanCapApDung/LayDanhSach',
        keHoach: {
            call: {
                action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET',
                strTuKhoa: '', strPhanLoai_Id: '', strDaoTao_ThoiGianDaoTao_Id: '',
                strNguoiDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000
            }
        },
        tuKhoa: { ds: 'TN_XetDuyet_TuKhoa/LayDanhSach', them: 'TN_XetDuyet_TuKhoa/ThemMoi', sua: 'TN_XetDuyet_TuKhoa/CapNhat',
                  size: 1000000, trang: false }
    });
})();
