/* =========================================================================
   Thành phần điểm áp dụng
   Bản gốc: ApisQuanLyDiem/Modules/thanhphandiem/html/khaibaothanhphandiemapdung.html
            + script/khaibaothanhphandiemapdung.js (lớp ThanhPhanDiemApDung, vỏ indexi)
   Khung chung: ../../thamsochung/script/_apdung.js (ums.qldAD).
   ---------------------------------------------------------------------------
   Lời gọi riêng (kiểu cũ, không func — chép nguyên):
     D_ThanhPhanDiem_ApDung/LayDanhSach GET  strTuKhoa '', strThangDiem_Id '', strQuyTacLamTron_Id '',
                                             strDiem_ThanhPhanDiem_Id '', strDaoTao_ThoiGianDaoTao_Id '',
                                             strPhanCapApDung_Id '', strPhamViApDung_Id, pageSize 10000000
     D_ThanhPhanDiem_ApDung/ThemMoi     POST strId, strPhanCapApDung_Id '', strMa '', strTen '',
                                             dCoChoPhepThiLai '', strThangDiem_Id '', strKyHieu '',
                                             dLaDiemTongKet '', dLaThanhPhanDiemCuoi '', dSoLeSauDauPhay,
                                             strGiaTriMacDinhChuaCoDiem, dCoLamTron, strQuyTacLamTron_Id,
                                             strDiem_ThanhPhanDiem_Id, iThuTu '', strPhamViApDung_Id,
                                             strDaoTao_ThoiGianDaoTao_Id, strNgayApDung (cả hai tab)
     D_ThanhPhanDiem_ApDung/Xoa         POST strIds
     D_ThanhPhanDiem_ApDung/KeThua      POST strDaoTao_ChuongTrinh_Id
     D_ThanhPhanDiem/LayDanhSach        GET  (ô "Thành phần điểm", TEN)
     danh mục DIEM.QUYTACLAMTRON        (ô "Quy tắc làm tròn", TEN)
   Cột đọc: DIEM_THANHPHANDIEM_ID, DAOTAO_THOIGIANDAOTAO_ID, NGAYAPDUNG, SOLESAUDAUPHAY,
            COLAMTRON, QUYTACLAMTRON_ID, GIATRIMACDINHKHICHUACODIEM, LADULIEUKHOITAO.
   Khung trái gốc ghi "Khóa đào tạo:" (các màn anh em ghi "Khóa:") — giữ.
   Tab học phần bỏ qua dòng chưa chọn Thành phần điểm (như gốc).
   Lỗi gốc đã sửa:
     · Lưu xong không nạp lại → Lưu lần hai thêm trùng (xem _apdung.js).
     · "Thêm dòng" ở tab chương trình chèn thêm hai ô trống thừa → dòng mới lệch
       cột so với tiêu đề (nút Xóa rơi ra ngoài bảng). Nay đúng cột.
     · Ô chọn "Thành phần điểm" / "Quy tắc làm tròn" gốc viết thẻ <option > không
       đóng → mỗi ô có thêm một dòng trống thừa. Nay một dòng "-- Chọn --".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qld-khaibaothanhphandiemapdung');
    if (!root) return;
    var Q = ums.qldAD;

    Q.man(root, {
        tieuDe: 'Thành phần điểm áp dụng',
        api: 'D_ThanhPhanDiem_ApDung',
        trai: Q.trai.chuongTrinh({ sub: 'Khóa đào tạo' }),
        cot: [
            { key: 'strDiem_ThanhPhanDiem_Id', col: 'DIEM_THANHPHANDIEM_ID', title: 'Thành phần điểm',
              type: 'select', ph: 'Chọn thành phần điểm', width: '200px',
              source: { call: {
                  action: 'D_ThanhPhanDiem/LayDanhSach', strTuKhoa: '', strThangDiem_Id: '', strQuyTacLamTron_Id: '',
                  strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 } } },
            Q.cot.thoiGian(),
            Q.cot.ngay(),
            { key: 'dSoLeSauDauPhay', col: 'SOLESAUDAUPHAY', title: 'Số lẻ', width: '90px' },
            Q.cot.coKhong('dCoLamTron', 'COLAMTRON', 'Có làm tròn'),
            { key: 'strQuyTacLamTron_Id', col: 'QUYTACLAMTRON_ID', title: 'Quy tắc làm tròn', type: 'select',
              ph: 'Chọn quy tắc làm tròn', width: '180px', source: { dm: 'DIEM.QUYTACLAMTRON' } },
            { key: 'strGiaTriMacDinhChuaCoDiem', col: 'GIATRIMACDINHKHICHUACODIEM', title: 'Giá trị mặc định', width: '120px' }
        ],
        loc: { strThangDiem_Id: '', strQuyTacLamTron_Id: '', strDiem_ThanhPhanDiem_Id: '',
               strDaoTao_ThoiGianDaoTao_Id: '', strPhanCapApDung_Id: '' },
        luu: { strPhanCapApDung_Id: '', strMa: '', strTen: '', dCoChoPhepThiLai: '', strThangDiem_Id: '',
               strKyHieu: '', dLaDiemTongKet: '', dLaThanhPhanDiemCuoi: '', iThuTu: '' },
        caps: [
            { key: 'ct', tab: '1) Thành phần điểm áp dụng chung cho chương trình', keThua: true },
            { key: 'hp', tab: '2) Thành phần điểm áp dụng đến từng học phần của chương trình',
              con: Q.con.hocPhan(), batBuoc: 'strDiem_ThanhPhanDiem_Id' }
        ]
    });
})();
