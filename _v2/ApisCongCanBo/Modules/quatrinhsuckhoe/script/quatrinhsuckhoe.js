/* =========================================================================
   Quá trình sức khỏe — các lần khám sức khỏe của cán bộ đang đăng nhập
   Bản gốc: ApisCongCanBo/Modules/quatrinhsuckhoe/script/quatrinhsuckhoe.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_KhamSucKhoe/LayDanhSach  GET   strNhanSu_HoSoCanBo_Id = userId
       NS_QT_KhamSucKhoe/LayChiTiet   GET   strId
       NS_QT_KhamSucKhoe/ThemMoi | CapNhat
       NS_QT_KhamSucKhoe/Xoa          strIds
   Sau khi THÊM: ThietLapQuaTrinhCuoiCung(…, "NHANSU_QT_KHAMSK").
   Bản gốc một cột (col-sm-2 nhãn / col-sm-10 ô) → formCols 1.

   Giữ như bản gốc:
     · Nhóm máu là ô CHỮ (gửi strNhomMau_Khac); strNhomMau_Id luôn rỗng —
       bản gốc có nạp danh mục QLCB.NHMA vào dropNhomMau nhưng ô đó không có
       trên màn, nên bỏ lời gọi nạp.
     · iThuTu gửi rỗng (ô txtThuTu không có trên màn).

   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/quatrinhsuckhoe (cán bộ nhân
   sự chọn một người): ums.ccbHS.quatrinhsuckhoe(P) trả cấu hình ums.crud.
   P = { hs() → id hồ sơ cán bộ, nth() → id người thực hiện, ns: true ở bản
   Nhân sự }; mặc định (Cổng cán bộ) cả hai là người đăng nhập.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NS_QT_KhamSucKhoe';

    function cauHinh(P) {
    return {
        title: 'Quá trình sức khỏe',
        listTitle: P.ns ? 'Quá trình sức khỏe' : 'Quá trình khám sức khỏe',
        formTitle: 'quá trình sức khỏe',
        icon: 'fa-heart-pulse',
        formCols: 1,
        saveAgain: 'Lưu và nhập tiếp',

        list: {
            call: function () {
                return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() };
            }
        },

        columns: [
            { title: 'Ngày khám', prop: 'NGAYKIEMTRA', cls: 'is-center is-nowrap' },
            { title: 'Nơi khám', prop: 'DIACHI' },
            { title: 'Tình trạng', prop: 'MOTA' }
        ],

        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        fields: [
            { key: 'strNhomMau_Khac', col: 'NHOMMAU_KHAC', label: 'Nhóm máu', required: true },
            { key: 'strChieuCao', col: 'CHIEUCAO', label: 'Chiều cao (cm)' },
            { key: 'strCanNang', col: 'CANNANG', label: 'Cân nặng (kg)' },
            { key: 'strDiaChi', col: 'DIACHI', label: 'Nơi khám', required: true },
            { key: 'strNgayKiemTra', col: 'NGAYKIEMTRA', label: 'Ngày kiểm tra', type: 'date', required: true },
            { key: 'strMoTa', col: 'MOTA', label: 'Tình trạng sức khỏe', required: true }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strNhomMau_Khac: v.strNhomMau_Khac,
                strNgayKiemTra: v.strNgayKiemTra,
                strDiaChi: v.strDiaChi,
                strChieuCao: v.strChieuCao,
                strCanNang: v.strCanNang,
                iThuTu: '',
                strNhomMau_Id: '',
                strMoTa: v.strMoTa,
                iTrangThai: 1,
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strNguoiThucHien_Id: P.nth()
            };
        },

        onSaved: function (crud, result, isEdit) {
            if (!isEdit) ums.ref.quaTrinhCuoiCung('NHANSU_QT_KHAMSK');
        },

        remove: function (ids) {
            return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; });
        }
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).quatrinhsuckhoe = cauHinh;
    var root = document.getElementById('quatrinhsuckhoe');
    if (root) ums.crud(Object.assign({ root: root }, cauHinh({ hs: uid, nth: uid })));
})();
