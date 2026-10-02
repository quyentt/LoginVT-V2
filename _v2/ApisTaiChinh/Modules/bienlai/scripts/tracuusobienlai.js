/* =========================================================================
   Tra cứu số biên lai
   Bản gốc: ApisTaiChinh/Modules/bienlai/html/tracuusobienlai.html + scripts/tracuusobienlai.js
   ---------------------------------------------------------------------------
   Khung dùng chung: phieuthu/scripts/_chung_tracuu.js → ums.tcTraCuu.soPhieuScreen.
   Lời gọi (chép nguyên):
       TC_BienLai/LayDanhSach           GET  ô mẫu biên lai + thanh tình trạng
                                              (MAUSO, SODADUNG, SODAHUY)
       TC_SoBienLai/LayDanhSach         GET  phân trang máy chủ, mặc định 24/trang
       TC_PhieuThu/LayTTPhieuThu_Rut    GET  xem biên lai (getData_Phieu "BIENLAI")
       TC_SoBienLai/HuyBienLai          POST huỷ biên lai (strBienLai_Id)
   Thẻ biên lai: SOBIENLAI, TONGTIEN, NGUOITAO_TAIKHOAN,
   NGAYTAO_DD_MM_YYYY_HHMMSS; chú thích rê chuột: HETHONGBIENLAI_NAM,
   NGUOICUOI_TENDAYDU, NGAYCUOI_DD_MM_YYYY_HHMMSS.

   Khác bản gốc: xem biên lai dùng bản in trung tính TẠM (chưa có tầng mẫu
   in theo trường), nên chưa có "Liên hoá đơn" / "Đổi mẫu in"; chọn "Tất cả"
   ở ô mẫu cũng nạp lại danh sách.
   Lỗi bản gốc: nhánh lỗi của 3 lời gọi gọi edu.system.alert(d.Message) với
   biến d không tồn tại → ReferenceError sau thông báo lỗi.
   ========================================================================= */
(function () {
    'use strict';

    ums.tcTraCuu.soPhieuScreen(document.getElementById('tracuusobienlai'), {
        kind: 'BIENLAI',
        title: 'Tra cứu số biên lai',
        mauLabel: 'Mẫu biên lai',
        listTitle: 'Danh sách số biên lai',
        huyText: 'Huỷ biên lai',
        so: function (r) { return r.SOBIENLAI; },
        card: function (r) {
            return [['Tổng tiền', ums.ui.money(r.TONGTIEN || 0)], ['Người thu', r.NGUOITAO_TAIKHOAN], ['Ngày thu', r.NGAYTAO_DD_MM_YYYY_HHMMSS]];
        },
        tip: function (r) {
            return [['Số', r.SOBIENLAI], ['Năm', r.HETHONGBIENLAI_NAM], ['Tổng tiền', ums.ui.money(r.TONGTIEN || 0)],
                ['Người cập nhật', r.NGUOICUOI_TENDAYDU], ['Ngày cập nhật', r.NGAYCUOI_DD_MM_YYYY_HHMMSS]];
        },
        calls: {
            mau: function () {
                return {
                    action: 'TC_BienLai/LayDanhSach',
                    versionAPI: 'v1.0',
                    pageIndex: 1,
                    pageSize: 10000,
                    strTuKhoa: '',
                    strNguoiThucHien_Id: ''
                };
            },
            list: function (v) {
                return {
                    action: 'TC_SoBienLai/LayDanhSach',
                    versionAPI: 'v1.0',
                    pageIndex: v.page,
                    pageSize: v.size,
                    strTuKhoa: v.tuKhoa,
                    strtaichinh_hethongBL_id: v.mau,
                    dTuKhoa_Number: -1,
                    iTinhTrang: v.loai,
                    strNguoiTao_Id: '',
                    strNguoiThucHien_Id: ''
                };
            },
            huy: function (id) {
                return { action: 'TC_SoBienLai/HuyBienLai', versionAPI: 'v1.0', strBienLai_Id: id, strNguoiThucHien_Id: '' };
            }
        }
    });
})();
