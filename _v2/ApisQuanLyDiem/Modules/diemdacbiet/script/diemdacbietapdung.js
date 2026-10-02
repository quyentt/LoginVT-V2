/* =========================================================================
   Điểm đặc biệt áp dụng
   Bản gốc: ApisQuanLyDiem/Modules/diemdacbiet/html/diemdacbietapdung.html
            + script/diemdacbietapdung.js (lớp DiemDacBietApDung, vỏ indexi)
   Khung chung: ../../thamsochung/script/_apdung.js (ums.qldAD).
   ---------------------------------------------------------------------------
   Lời gọi riêng (kiểu cũ, không func — chép nguyên):
     D_DiemDacBiet_ApDung/LayDanhSach GET  strTuKhoa '', strDaoTao_ThoiGianDaoTao_Id '', strLoaiDiem_Id '',
                                           strPhanCapApDung_Id '', strPhamViApDung_Id,
                                           strDiem_DiemDacBiet_Id '', pageSize 10000000
     D_DiemDacBiet_ApDung/ThemMoi     POST strId, strMa '', strTen '', strPhanCapApDung_Id '',
                                           strDiem_DiemDacBiet_Id, strPhamViApDung_Id, dGiaTriXuLy,
                                           strLoaiDiem_Id, strDaoTao_ThoiGianDaoTao_Id, strNgayApDung,
                                           iThuTu '' (cả hai tab — gốc chú thích bỏ CapNhat)
     D_DiemDacBiet_ApDung/Xoa         POST strIds
     D_DiemDacBiet_ApDung/KeThua      POST strDaoTao_ChuongTrinh_Id (gốc HỎI LẠI "Bạn có chắc chắn kế thừa")
     D_DiemDacBiet/LayDanhSach        GET  (ô "Điểm đặc biệt", TEN)
     danh mục DIEM.LOAIDIEMDACBIET    (ô "Loại điểm", TEN)
   Cột đọc: DIEM_DIEMDACBIET_ID, DAOTAO_THOIGIANDAOTAO_ID, NGAYAPDUNG, GIATRIXULY,
            LOAIDIEM_ID, LADULIEUKHOITAO.
   Tab học phần bỏ qua dòng chưa chọn Điểm đặc biệt (như gốc).
   Cố ý bỏ: loadToCombo_DanhMucDuLieu vào "dropChuongTrinh_LoaiDiem, dropHP_LoaiDiem"
   (id không tồn tại — lời gọi thừa; danh sách thật nạp qua getList_LoaiDiem).
   Lỗi gốc đã sửa: Lưu xong không nạp lại → Lưu lần hai thêm trùng (xem _apdung.js).
   Tiêu đề cột gốc viết thường "loại điểm" → "Loại điểm".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qld-diemdacbietapdung');
    if (!root) return;
    var Q = ums.qldAD;

    Q.man(root, {
        tieuDe: 'Điểm đặc biệt áp dụng',
        api: 'D_DiemDacBiet_ApDung',
        cot: [
            { key: 'strDiem_DiemDacBiet_Id', col: 'DIEM_DIEMDACBIET_ID', title: 'Điểm đặc biệt',
              type: 'select', ph: 'Chọn điểm đặc biệt', width: '220px',
              source: { call: {
                  action: 'D_DiemDacBiet/LayDanhSach', strTuKhoa: '', strLoaiDiem_Id: '',
                  strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 } } },
            Q.cot.thoiGian(),
            Q.cot.ngay(),
            { key: 'dGiaTriXuLy', col: 'GIATRIXULY', title: 'Giá trị xử lý', width: '120px' },
            { key: 'strLoaiDiem_Id', col: 'LOAIDIEM_ID', title: 'Loại điểm', type: 'select', ph: 'Chọn loại điểm',
              width: '180px', source: { dm: 'DIEM.LOAIDIEMDACBIET' } }
        ],
        loc: { strDaoTao_ThoiGianDaoTao_Id: '', strLoaiDiem_Id: '', strPhanCapApDung_Id: '', strDiem_DiemDacBiet_Id: '' },
        luu: { strMa: '', strTen: '', strPhanCapApDung_Id: '', iThuTu: '' },
        keThua: { hoi: 'Bạn có chắc chắn kế thừa' },
        caps: [
            { key: 'ct', tab: '1) Điểm đặc biệt áp dụng chung cho chương trình', keThua: true },
            { key: 'hp', tab: '2) Điểm đặc biệt áp dụng đến từng học phần của chương trình',
              con: Q.con.hocPhan(), batBuoc: 'strDiem_DiemDacBiet_Id' }
        ]
    });
})();
