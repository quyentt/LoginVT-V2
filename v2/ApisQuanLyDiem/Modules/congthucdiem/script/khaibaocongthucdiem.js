/* =========================================================================
   Khai báo công thức điểm
   Bản gốc: ApisQuanLyDiem/Modules/congthucdiem/html/khaibaocongthucdiem.html
            + script/khaibaocongthucdiem.js
   Khung chung: ../../thamsochung/script/_khaibao.js (ums.qldKB).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     D_CongThucDiem/LayDanhSach  GET: strTuKhoa, strDiem_ThanhPhanDiem_Id, strMoHinhXuLy_Id (hai ô lọc),
                                 strNguoiThucHien_Id "", pageIndex/pageSize
     D_CongThucDiem/LayChiTiet   GET strId
     D_ThongTin/Them_Diem_CongThucDiem  POST (thêm, strId "")  ┐ strMa, strTen, strXauCongThuc,
     D_ThongTin/Sua_Diem_CongThucDiem   POST (sửa, strId)      │ strDiem_ThanhPhanDiem_Id, strMoHinhXuLy_Id,
                                                               │ dSoThanhPhanToiThieu, dTongHopKhiDuDiem,
                                                               ┘ dCongThucKhongCanBang, dThuTu = ''
     D_CongThucDiem/Xoa          POST strIds
     D_ThanhPhanDiem/LayDanhSach GET — ô Thành phần điểm (lọc + biểu mẫu): strTuKhoa/strThangDiem_Id/
                                 strQuyTacLamTron_Id/strNguoiThucHien_Id "", dLaThanhPhanDiemCuoi = 0,
                                 pageIndex 1, pageSize 1000000; tên TEN
   Danh mục: DIEM.MOHINHCONGTHUC (Mô hình xử lý — lọc + biểu mẫu).
   Cột: TEN, DIEM_THANHPHANDIEM_TEN, MOHINHXULY_TEN, XAUCONGTHUC.
   Biểu mẫu đọc: TEN, MA, DIEM_THANHPHANDIEM_ID, XAUCONGTHUC, MOHINHXULY_ID,
     SOTHANHPHANDIEMTOITHIEU, TONGHOPKHIDUDIEMTHANHPHAN, CONGTHUCKHONGCANBANG.

   Ghi chú: Thành phần điểm và Mô hình xử lý là hai ô lọc ĐỘC LẬP (không phải
   cha → con).
   ========================================================================= */
(function () {
    'use strict';

    var K = ums.qldKB;
    var MOHINH = { dm: 'DIEM.MOHINHCONGTHUC' };
    var THANHPHAN = {
        call: {
            action: 'D_ThanhPhanDiem/LayDanhSach', method: 'GET',
            strTuKhoa: '', strThangDiem_Id: '', strQuyTacLamTron_Id: '', dLaThanhPhanDiemCuoi: 0,
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
        },
        id: 'ID', name: 'TEN'
    };

    K.man(document.getElementById('qld-khaibaocongthucdiem'), {
        title: 'Khai báo công thức điểm',
        listTitle: 'Danh sách công thức điểm',
        formTitle: 'thông tin công thức điểm',
        ctl: 'D_CongThucDiem',
        them: 'D_ThongTin/Them_Diem_CongThucDiem',
        sua: 'D_ThongTin/Sua_Diem_CongThucDiem',

        loc: [
            { key: 'tp', label: 'Chọn thành phần điểm', source: THANHPHAN },
            { key: 'moHinh', label: 'Chọn mô hình xử lý', source: MOHINH }
        ],
        locThamSo: function (f) {
            return { strDiem_ThanhPhanDiem_Id: f.tp, strMoHinhXuLy_Id: f.moHinh };
        },

        columns: [
            { title: 'Tên công thức', prop: 'TEN' },
            { title: 'Điểm thành phần', prop: 'DIEM_THANHPHANDIEM_TEN', cls: 'is-center' },
            { title: 'Mô hình xử lý', prop: 'MOHINHXULY_TEN', cls: 'is-center' },
            { title: 'Xâu công thức', prop: 'XAUCONGTHUC' }
        ],

        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên công thức' },
            { key: 'strMa', col: 'MA', label: 'Mã công thức' },
            { key: 'strXauCongThuc', col: 'XAUCONGTHUC', label: 'Xâu công thức', span: true },
            { key: 'strDiem_ThanhPhanDiem_Id', col: 'DIEM_THANHPHANDIEM_ID', label: 'Thành phần điểm', type: 'select',
                source: THANHPHAN, placeholder: 'Chọn thành phần điểm' },
            { key: 'strMoHinhXuLy_Id', col: 'MOHINHXULY_ID', label: 'Mô hình xử lý', type: 'select',
                source: MOHINH, placeholder: 'Chọn mô hình xử lý' },
            { key: 'dSoThanhPhanToiThieu', col: 'SOTHANHPHANDIEMTOITHIEU', label: 'Số thành phần tối thiểu', type: 'number' },
            { key: 'dTongHopKhiDuDiem', col: 'TONGHOPKHIDUDIEMTHANHPHAN', label: 'Mô hình tổng hợp', type: 'select',
                placeholder: 'Chọn mô hình tổng hợp',
                source: { items: [{ ID: '1', TEN: 'Chỉ tổng hợp khi đủ điểm thành phần quy định' }, { ID: '0', TEN: 'Tổng hợp khi có điểm bất kỳ' }] } },
            // Gốc: ô không có dòng trống, mặc định 0 (rewrite đặt 0)
            { key: 'dCongThucKhongCanBang', col: 'CONGTHUCKHONGCANBANG', label: 'Công thức không cân bằng', type: 'select',
                required: true, value: '0', placeholder: false,
                source: { items: [{ ID: '0', TEN: 'Không' }, { ID: '1', TEN: 'Có' }] } }
        ],
        tuLoc: { strDiem_ThanhPhanDiem_Id: 'tp', strMoHinhXuLy_Id: 'moHinh' },

        luu: function (v) {
            return {
                strMa: v.strMa,
                strTen: v.strTen,
                strXauCongThuc: v.strXauCongThuc,
                strDiem_ThanhPhanDiem_Id: v.strDiem_ThanhPhanDiem_Id,
                strMoHinhXuLy_Id: v.strMoHinhXuLy_Id,
                dSoThanhPhanToiThieu: v.dSoThanhPhanToiThieu,
                dTongHopKhiDuDiem: v.dTongHopKhiDuDiem,
                dCongThucKhongCanBang: v.dCongThucKhongCanBang,
                dThuTu: ''
            };
        }
    });
})();
