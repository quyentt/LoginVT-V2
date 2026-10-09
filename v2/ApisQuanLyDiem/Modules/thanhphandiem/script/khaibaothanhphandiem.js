/* =========================================================================
   Khai báo thành phần điểm
   Bản gốc: ApisQuanLyDiem/Modules/thanhphandiem/html/khaibaothanhphandiem.html
            + script/khaibaothanhphandiem.js
   Khung chung: ../../thamsochung/script/_khaibao.js (ums.qldKB).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     D_ThanhPhanDiem/LayDanhSach  GET: strTuKhoa, strThangDiem_Id, strQuyTacLamTron_Id (hai ô lọc),
                                  dLaThanhPhanDiemCuoi = -1, strNguoiThucHien_Id "", pageIndex/pageSize
     D_ThanhPhanDiem/LayChiTiet   GET strId
     D_ThongTin/Them_Diem_ThanhPhanDiem  POST (thêm, strId "")  ┐ strMa, strTen, dCoChoPhepThiLai,
     D_ThongTin/Sua_Diem_ThanhPhanDiem   POST (sửa, strId)      │ strThangDiem_Id, strKyHieu,
                                                                │ dLaDiemTongKet, dLaThanhPhanDiemCuoi,
                                                                │ dSoLeSauDauPhay, dCoLamTron,
                                                                │ dChoPhepLapDanhSachThi, strQuyTacLamTron_Id,
                                                                ┘ dGiaTriMacDinhChuaCoDiem, dThuTu = ''
     D_ThanhPhanDiem/Xoa          POST strIds
   Danh mục: DIEM.THANGDIEM, DIEM.QUYTACLAMTRON (lọc + biểu mẫu).
   Cột: MA, TEN, THANGDIEM_TEN, SOLESAUDAUPHAY, GIATRIMACDINHKHICHUACODIEM, QUYTACLAMTRON_TEN,
     CHOPHEPLAPDANHSACHTHI (chữ "Cho phép / Không cho phép lập danh sách thi").

   Bố cục biểu mẫu giữ như gốc: HAI ô mỗi dòng (col-sm-2|4 × 2), Tên thành phần
   chiếm cả dòng.
   Khác gốc:
     · dThuTu gửi '' — gốc đọc #txtThuTu nhưng ô đó KHÔNG có trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var K = ums.qldKB;
    var THANGDIEM = { dm: 'DIEM.THANGDIEM' };
    var LAMTRON = { dm: 'DIEM.QUYTACLAMTRON' };

    K.man(document.getElementById('qld-khaibaothanhphandiem'), {
        title: 'Khai báo thành phần điểm',
        listTitle: 'Danh sách thành phần điểm',
        formTitle: 'thông tin thành phần điểm',
        icon: 'fa-list',
        ctl: 'D_ThanhPhanDiem',
        them: 'D_ThongTin/Them_Diem_ThanhPhanDiem',
        sua: 'D_ThongTin/Sua_Diem_ThanhPhanDiem',

        loc: [
            { key: 'thang', label: 'Chọn thang điểm', source: THANGDIEM },
            { key: 'lamTron', label: 'Chọn quy tắc làm tròn', source: LAMTRON }
        ],
        locThamSo: function (f) {
            return { strThangDiem_Id: f.thang, strQuyTacLamTron_Id: f.lamTron, dLaThanhPhanDiemCuoi: -1 };
        },

        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên thành phần điểm', prop: 'TEN' },
            { title: 'Thang điểm', prop: 'THANGDIEM_TEN', cls: 'is-center' },
            { title: 'Số lẻ sau dấu phẩy', prop: 'SOLESAUDAUPHAY', cls: 'is-center' },
            { title: 'Giá trị mặc định', prop: 'GIATRIMACDINHKHICHUACODIEM', cls: 'is-center' },
            { title: 'Quy tắc làm tròn', prop: 'QUYTACLAMTRON_TEN' },
            {
                title: 'Cho phép lập ds thi', cls: 'is-center',
                render: function (r) {
                    // Gốc: aData.CHOPHEPLAPDANHSACHTHI ? … — số 0 là "không"; chuỗi "0" giữ như gốc là "có"
                    return r.CHOPHEPLAPDANHSACHTHI ? 'Cho phép lập danh sách thi' : 'Không cho phép lập danh sách thi';
                }
            }
        ],

        formCols: 2,
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên thành phần', span: true },
            { key: 'strMa', col: 'MA', label: 'Mã' },
            { key: 'strKyHieu', col: 'KYHIEU', label: 'Ký hiệu' },
            { key: 'dLaDiemTongKet', col: 'LADIEMTONGKET', label: 'Điểm tổng kết', type: 'select',
                source: K.coKhong(), placeholder: 'Có là điểm tổng kết không' },
            { key: 'dLaThanhPhanDiemCuoi', col: 'LATHANHPHANDIEMCUOI', label: 'Thành phần điểm cuối', type: 'select',
                source: K.coKhong(), placeholder: 'Có là thành phần cuối không' },
            { key: 'strThangDiem_Id', col: 'THANGDIEM_ID', label: 'Thang điểm', type: 'select',
                source: THANGDIEM, placeholder: 'Chọn thang điểm' },
            { key: 'dCoChoPhepThiLai', col: 'COCHOPHEPTHILAI', label: 'Cho phép thi lại', type: 'select',
                source: K.coKhong(), placeholder: 'Có cho phép thi lại không' },
            { key: 'dSoLeSauDauPhay', col: 'SOLESAUDAUPHAY', label: 'Số lẻ sau dấu phẩy', type: 'number' },
            { key: 'dCoLamTron', col: 'COLAMTRON', label: 'Làm tròn', type: 'select',
                source: K.coKhong(), placeholder: 'Có cho phép làm tròn không' },
            { key: 'strQuyTacLamTron_Id', col: 'QUYTACLAMTRON_ID', label: 'Quy tắc làm tròn', type: 'select',
                source: LAMTRON, placeholder: 'Chọn quy tắc làm tròn' },
            { key: 'dGiaTriMacDinhChuaCoDiem', col: 'GIATRIMACDINHKHICHUACODIEM', label: 'Giá trị mặc định', type: 'number' },
            // Gốc: ô không có dòng trống, mặc định 0 (rewrite đặt 0)
            { key: 'dChoPhepLapDanhSachThi', col: 'CHOPHEPLAPDANHSACHTHI', label: 'Cho phép lập DS thi', type: 'select',
                required: true, value: '0', placeholder: false,
                source: { items: [{ ID: '0', TEN: 'Không cho phép lập danh sách thi' }, { ID: '1', TEN: 'Cho phép lập danh sách thi' }] } }
        ],
        tuLoc: { strThangDiem_Id: 'thang', strQuyTacLamTron_Id: 'lamTron' },

        luu: function (v) {
            return {
                strMa: v.strMa,
                strTen: v.strTen,
                dCoChoPhepThiLai: v.dCoChoPhepThiLai,
                strThangDiem_Id: v.strThangDiem_Id,
                strKyHieu: v.strKyHieu,
                dLaDiemTongKet: v.dLaDiemTongKet,
                dLaThanhPhanDiemCuoi: v.dLaThanhPhanDiemCuoi,
                dSoLeSauDauPhay: v.dSoLeSauDauPhay,
                dCoLamTron: v.dCoLamTron,
                dChoPhepLapDanhSachThi: v.dChoPhepLapDanhSachThi,
                strQuyTacLamTron_Id: v.strQuyTacLamTron_Id,
                dGiaTriMacDinhChuaCoDiem: v.dGiaTriMacDinhChuaCoDiem,
                dThuTu: ''
            };
        }
    });
})();
