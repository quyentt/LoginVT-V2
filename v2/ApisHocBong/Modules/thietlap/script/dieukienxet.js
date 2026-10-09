/* =========================================================================
   Điều kiện xét học bổng
   Bản gốc: ApisHocBong/Modules/thietlap/html/dieukienxet.html + script/dieukienxet.js
   Khung chung: script/_dk.js (ums.hbDk) — hai tab chung / riêng, biểu mẫu hai
   cột, ô phạm vi theo phân cấp, bảng từ khoá.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     HB_XetDuyet_DieuKien/LayDanhSach     GET: strTuKhoa, strHB_QuyHocBong_Id,
                                          strXepLoai_Id = '', strNguoiTao_Id = '' (gốc #dropAAAA)
     HB_XetDuyet_DieuKien/ThemMoi|CapNhat POST: strId, strXauDieuKien, strHB_QuyHocBong_Id,
                                          iThuTu = '', strMoTa, strXepLoai_Id, dThuTu = ''
     HB_XetDuyet_DieuKien/Xoa             POST strIds
     HB_XetDuyet_DieuKien_Ad/LayDanhSach  GET: như trên + strPhamViApDung_Id = '',
                                          strPhanCapApDung_Id, strDaoTao_ThoiGianDaoTao_Id = '',
                                          strXauDieuKien = '', dThuTu = '', strMoTa = '' (gốc #txtAAAA)
     HB_XetDuyet_DieuKien_Ad/ThemMoi|CapNhat  + strPhamViApDung_Id, strDaoTao_ThoiGianDaoTao_Id = ''
     HB_XetDuyet_DieuKien_Ad/Xoa          POST strIds
     HB_QuyHocBong/LayDanhSach            GET (strTuKhoa, strNguoiTao_Id = '', pageSize 1000000) — ô Quỹ
     HB_PhanCapApDung/LayDanhSach         GET strPhanLoai_Id = QUỸ ở ô lọc tab 2 (như gốc)
     HB_KeHoach/LayDanhSach               GET — ô Kế hoạch (gốc gọi lúc init: strTuKhoa /
                                          strHB_QuyHocBong_Id lấy ô lọc tab 1 lúc đó = rỗng)
     HB_XepLoai_TuKhoa/LayDanhSach | CapNhat   bảng "Danh sách từ khóa"
   Danh mục: HOCBONG.XEPLOAI (Xếp loại), KHCT.LOAILOP (Mô hình).

   Khác gốc riêng màn này (phần chung: đầu tệp _dk.js):
     · Sửa điều kiện riêng: gốc gửi strPhamViApDung_Id = PHANCAPAPDUNG_ID của dòng
       (nhầm cột) → nay gửi PHAMVIAPDUNG_ID (hoặc phạm vi mới chọn).
     · Tab 2 mở màn: gốc nạp phân cấp KHÔNG theo quỹ rồi chọn sẵn mục đầu; nay
       phải chọn Quỹ trước (luật cha → con).
     · Ô "Phân loại" của biểu mẫu thực chất là Quỹ học bổng (dropQuyHocBong) —
       giữ nhãn "Phân loại" như gốc.
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('hb-dieukienxet');
    if (!root) return;

    ums.hbDk.man(root, {
        tieuDe: 'Điều kiện xét',
        phanLoai: {
            key: 'strHB_QuyHocBong_Id', col: 'HB_QUYHOCBONG_ID', nhan: 'Phân loại', loc: 'Chọn quỹ học bổng',
            nguon: {
                call: {
                    action: 'HB_QuyHocBong/LayDanhSach', method: 'GET',
                    strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000
                },
                id: 'ID', name: 'TEN'
            }
        },
        cotChung: [
            { title: 'Xâu điều kiện', prop: 'XAUDIEUKIEN' },
            { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-nowrap' },
            { title: 'Mô tả', prop: 'MOTA' }
        ],
        trai: [
            { key: 'strXepLoai_Id', col: 'XEPLOAI_ID', label: 'Xếp loại', type: 'select',
              source: { dm: 'HOCBONG.XEPLOAI' }, placeholder: 'Chọn xếp loại' }
        ],
        phai: [
            { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', label: 'Xâu điều kiện', type: 'textarea' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ],
        dongTextarea: 10,       // gốc min-height 260px
        chung: {
            ctl: 'HB_XetDuyet_DieuKien',
            ds: { strXepLoai_Id: '', strNguoiTao_Id: '' },
            luu: function (v) {
                return { strXauDieuKien: v.strXauDieuKien, iThuTu: '', strMoTa: v.strMoTa, strXepLoai_Id: v.strXepLoai_Id, dThuTu: '' };
            }
        },
        rieng: {
            ctl: 'HB_XetDuyet_DieuKien_Ad',
            ds: { strNguoiTao_Id: '', strXauDieuKien: '', strXepLoai_Id: '', dThuTu: '', strMoTa: '' },
            luu: function (v) {
                return { strXauDieuKien: v.strXauDieuKien, iThuTu: '', strMoTa: v.strMoTa, strXepLoai_Id: v.strXepLoai_Id, dThuTu: '' };
            }
        },
        phanCap: 'HB_PhanCapApDung/LayDanhSach',
        keHoach: {
            call: {
                action: 'HB_KeHoach/LayDanhSach', method: 'GET',
                strTuKhoa: '', strHB_QuyHocBong_Id: '', strDaoTao_ThoiGianDaoTao_Id: '',
                strNguoiDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000
            }
        },
        tuKhoa: 'HB_XepLoai_TuKhoa'
    });
})();
