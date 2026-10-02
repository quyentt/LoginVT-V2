/* =========================================================================
   Tra cứu số phiếu thu
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/tracuusophieuthu.html + scripts/tracuusophieuthu.js
   ---------------------------------------------------------------------------
   Khung dùng chung: _chung_tracuu.js → ums.tcTraCuu.soPhieuScreen.
   Lời gọi (chép nguyên):
       TC_HeThongPhieuThu/LayDanhSach   GET  ô mẫu phiếu thu + thanh tình trạng
                                              (MAUSO, SODADUNG, SODAHUY)
       TC_SoPhieuThu/LayDanhSach        GET  phân trang máy chủ, mặc định 24/trang
       TC_PhieuThu/LayTTPhieuThu_Rut    GET  xem phiếu (trong _chung_tracuu.js)
       TC_PhieuThu/HuyPhieuNhapHoc      POST huỷ phiếu
   Thẻ phiếu: SOPHIEUTHU, HETHONGPHIEUTHU_NAM, NGUOITAO_TAIKHOAN,
   NGAYTAO_DD_MM_YYYY_HHMMSS; chú thích khi rê chuột (popover gốc): TONGTIEN,
   NGUOICUOI_TENDAYDU, NGAYCUOI_DD_MM_YYYY_HHMMSS. TINHTRANG 1 / 2 / -1 =
   phiếu thu / đã sửa / đã huỷ (phiếu huỷ không có nút Huỷ).

   Khác bản gốc:
     · Xem phiếu dùng bản in trung tính TẠM — bộ mẫu in theo trường
       (edu.extend.getData_Phieu, Upload/Files/PrintTemplate) chưa có ở tầng
       chung. Vì vậy chưa có "Liên hoá đơn" và "Đổi mẫu in".
     · Chọn "Tất cả" ở ô mẫu cũng nạp lại danh sách (bản gốc chỉ nạp khi
       chọn một mẫu cụ thể, chọn lại "Tất cả" thì danh sách không đổi).
   Lỗi bản gốc: sự kiện đổi "Loại phiếu" có "me.getList_SBL();s" — dư chữ s
   gây ReferenceError sau khi đã gọi nạp (danh sách vẫn nạp được).
   ========================================================================= */
(function () {
    'use strict';

    ums.tcTraCuu.soPhieuScreen(document.getElementById('tracuusophieuthu'), {
        kind: 'PHIEUTHU',
        title: 'Tra cứu số phiếu thu',
        mauLabel: 'Mẫu phiếu thu',
        listTitle: 'Danh sách số phiếu thu',
        huyText: 'Huỷ phiếu',
        so: function (r) { return r.SOPHIEUTHU; },
        card: function (r) {
            return [['Năm', r.HETHONGPHIEUTHU_NAM], ['Người thu', r.NGUOITAO_TAIKHOAN], ['Ngày thu', r.NGAYTAO_DD_MM_YYYY_HHMMSS]];
        },
        tip: function (r) {
            return [['Số', r.SOPHIEUTHU], ['Năm', r.HETHONGPHIEUTHU_NAM], ['Tổng tiền', ums.ui.money(r.TONGTIEN || 0)],
                ['Người cập nhật', r.NGUOICUOI_TENDAYDU], ['Ngày cập nhật', r.NGAYCUOI_DD_MM_YYYY_HHMMSS]];
        },
        calls: {
            mau: function () {
                return {
                    action: 'TC_HeThongPhieuThu/LayDanhSach',
                    versionAPI: 'v1.0',
                    pageIndex: 1,
                    pageSize: 100000,
                    strTuKhoa: '',
                    iTuKhoa_Number: -1,
                    strNguoiThucHien_Id: '',
                    iTinhTrang: -1
                };
            },
            list: function (v) {
                return {
                    action: 'TC_SoPhieuThu/LayDanhSach',
                    versionAPI: 'v1.0',
                    pageIndex: v.page,
                    pageSize: v.size,
                    strTuKhoa: v.tuKhoa,
                    strtaichinh_hethongPT_id: v.mau,
                    dTuKhoa_Number: -1,
                    iTinhTrang: v.loai,
                    strNguoiThucHien_Id: -1
                };
            },
            huy: function (id) {
                return { action: 'TC_PhieuThu/HuyPhieuNhapHoc', versionAPI: 'v1.0', strPhieu_Id: id, strNguoiThucHien_Id: '' };
            }
        }
    });
})();
