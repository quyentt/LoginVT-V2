/* =========================================================================
   Quan hệ gia đình — hồ sơ cá nhân của cán bộ đang đăng nhập
   Bản gốc: ApisCongCanBo/Modules/quanhegiadinh/script/quanhegiadinh.js
   ---------------------------------------------------------------------------
   Một tab, ba khung — controller kiểu cũ (không mã hoá):
       Về bản thân              NS_QT_QuanHeThanToc
       Về bên vợ (hoặc chồng)   NS_QT_QuanHeVoChong
       Thân nhân ở nước ngoài   NS_QT_ThanNhanNuocNgoai
   Mỗi controller: LayDanhSach (GET, strNhanSu_HoSoCanBo_Id), LayChiTiet (GET),
   ThemMoi | CapNhat, Xoa (strIds). Bản gốc KHÔNG gọi ThietLapQuaTrinhCuoiCung.
   Danh mục: NS.QHGD (quan hệ, sắp theo HESO1), CHUN.CHLU (quốc gia).

   Giữ như bản gốc:
     · Bên vợ/chồng: "Địa chỉ thường trú" gửi vào strQueQuan (bản thân gửi
       vào strNoiO) — hai khung khác cột, chép nguyên.
     · Thân nhân ở nước ngoài: iThuTu đọc ô txtTNNN_ThuTu không có trên màn → rỗng.
     · Bản gốc nạp danh mục NS.QHGD.CVHT cho ba ô dropCongViecHienTai_* không
       có trên màn (công việc là ô chữ) — bỏ lời gọi nạp.

   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/quanhegiadinh (cán bộ nhân sự
   chọn một người): ums.ccbHS.quanhegiadinh(P) trả { title, tabs } cho
   ums.pat.sections. P = { hs() → id hồ sơ cán bộ, nth() → id người thực hiện,
   ns: true ở bản Nhân sự }; mặc định (Cổng cán bộ) cả hai là người đăng nhập.
   Bản Nhân sự (P.ns) khác theo bản gốc của nó:
     · tiêu đề ba khung đánh a) b) c) như html gốc Nhân sự;
     · Về bản thân: "Địa chỉ thường trú" gửi vào strQueQuan (cột QUEQUAN),
       strNoiO đọc ô txtQHGD_ThuTu không có trên màn → rỗng; thêm xong gọi
       ThietLapQuaTrinhCuoiCung "NHANSU_QT_GD_QHGD";
     · danh mục quan hệ KHÔNG sắp theo HESO1;
     · bảng thân nhân nước ngoài thêm cột "Năm định cư" (NAMDINHCU).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }

    function hoTen(r) { return esc((r.HODEM || '') + ' ' + (r.TEN1 || '')); }

    function cauHinh(P) {
    var QUANHE = P.ns ? { dm: 'NS.QHGD' } : { dm: 'NS.QHGD', sort: 'HESO1' };
    var QUOCGIA = { dm: 'CHUN.CHLU' };
    function ds(c) { return function () { return { action: c + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; }; }
    function ct(c) { return function (row) { return { action: c + '/LayChiTiet', method: 'GET', strId: row.ID }; }; }
    function xoa(c) { return function (ids) { return ids.map(function (id) { return { action: c + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }; }

    /* Bản thân và bên vợ/chồng cùng khuôn ô; chỉ khác controller và cột địa chỉ */
    function giaDinh(o) {
        return {
            title: o.title, formTitle: o.formTitle, icon: o.icon, formCols: 3, saveAgain: 'Lưu và nhập tiếp',
            list: { call: ds(o.ctrl) },
            detail: ct(o.ctrl),
            columns: [
                { title: 'Quan hệ', prop: 'QUANHE_TEN' },
                { title: 'Họ tên', render: hoTen },
                { title: 'Năm sinh', prop: 'NAMSINH', cls: 'is-center' },
                { title: 'Công việc hiện tại', prop: 'NGHENGHIEP' }
            ],
            fields: [
                { key: 'strNhanSu_QuanHe_Id', col: 'QUANHE_ID', label: 'Quan hệ', type: 'select', source: QUANHE,
                  placeholder: 'Chọn quan hệ', required: true, span: true },
                { key: 'strHoDem', col: 'HODEM', label: 'Họ đệm', required: true },
                { key: 'strTen', col: 'TEN1', label: 'Tên', required: true },
                { key: 'strNamSinh', col: 'NAMSINH', label: 'Năm sinh' },
                { key: 'strQuocGia_Id', col: 'QUOCGIA_ID', label: 'Quốc gia đang sống', type: 'select', source: QUOCGIA,
                  placeholder: 'Chọn quốc gia đang sống', span: true },
                { key: 'strNgheNghiep', col: 'NGHENGHIEP', label: 'Công việc hiện tại', span: true },
                { key: 'strDonViCongTac', col: 'DONVICONGTAC', label: 'Đơn vị công tác', span: true },
                { key: '_diaChi', col: o.diaChiCol, label: 'Địa chỉ thường trú', span: true },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: o.moTaArea ? 'textarea' : 'text', span: true }
            ],
            save: function (v, row) {
                var x = {
                    action: o.ctrl + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strNhanSu_HoSoCanBo_Id: P.hs(),
                    strNhanSu_QuanHe_Id: v.strNhanSu_QuanHe_Id,
                    strMoTa: v.strMoTa,
                    iTrangThai: 1,
                    iThuTu: '',
                    strHoDem: v.strHoDem,
                    strTen: v.strTen,
                    strNgaySinh: '',
                    strThangSinh: '',
                    strNamSinh: v.strNamSinh,
                    strQueQuan: '',
                    strChucDanh: '',
                    strChucVu: '',
                    strDonViCongTac: v.strDonViCongTac,
                    strQuocGia_Id: v.strQuocGia_Id,
                    strNgheNghiep: v.strNgheNghiep,
                    strHocTap: '',
                    strNoiO: '',
                    strCongViecHienTai_Id: '',
                    strThanhVienCacToChucCT_XH: '',
                    strNguoiThucHien_Id: P.nth()
                };
                x[o.diaChiParam] = v._diaChi;
                return x;
            },
            onSaved: o.cuoi ? function (crud, result, isEdit) { if (!isEdit) ums.ref.quaTrinhCuoiCung(o.cuoi); } : undefined,
            remove: xoa(o.ctrl)
        };
    }

    var banThan = giaDinh({
        ctrl: 'NS_QT_QuanHeThanToc', icon: 'fa-people-roof',
        diaChiParam: P.ns ? 'strQueQuan' : 'strNoiO', diaChiCol: P.ns ? 'QUEQUAN' : 'NOIO', cuoi: P.ns ? 'NHANSU_QT_GD_QHGD' : '',
        title: (P.ns ? 'a) ' : '') + 'Về bản thân: Cha, Mẹ, Vợ (hoặc chồng), các con, anh chị em ruột',
        formTitle: 'quan hệ gia đình (về bản thân)'
    });
    var voChong = giaDinh({
        ctrl: 'NS_QT_QuanHeVoChong', icon: 'fa-people-arrows', diaChiParam: 'strQueQuan', diaChiCol: 'QUEQUAN', moTaArea: true,
        title: (P.ns ? 'b) ' : '') + 'Về bên vợ (hoặc chồng): Cha, Mẹ, anh chị em ruột',
        formTitle: 'quan hệ gia đình (về bên vợ hoặc chồng)'
    });

    var C = 'NS_QT_ThanNhanNuocNgoai';
    var nuocNgoai = {
        title: P.ns ? 'c) Thân nhân (Cha, Mẹ, Vợ, Chồng, con, anh chị em ruột) ở nước ngoài (làm gì, địa chỉ ....) ?' : 'Thân nhân ở nước ngoài',
        formTitle: 'thân nhân ở nước ngoài', icon: 'fa-earth-asia', saveAgain: 'Lưu và nhập tiếp',
        list: { call: ds(C) },
        detail: ct(C),
        columns: [
            { title: 'Quan hệ', prop: 'QUANHE_TEN' },
            { title: 'Họ tên', prop: 'HOVATEN' },
            { title: 'Năm sinh', prop: 'NAMSINH', cls: 'is-center' },
            { title: 'Công việc hiện tại', prop: 'NGHENGHIEP' },
            { title: 'Nước định cư', prop: 'NUOCDINHCU' }
        ].concat(P.ns ? [{ title: 'Năm định cư', prop: 'NAMDINHCU', cls: 'is-center' }] : []),
        fields: [
            { key: 'strQuanHe_Id', col: 'QUANHE_ID', label: 'Quan hệ', type: 'select', source: QUANHE,
              placeholder: 'Chọn quan hệ', required: true, span: true },
            { key: 'strHoVaTen', col: 'HOVATEN', label: 'Họ tên', required: true },
            { key: 'strNamSinh', col: 'NAMSINH', label: 'Năm sinh' },
            { key: 'strQuocTich', col: 'QUOCTICH', label: 'Quốc tịch', span: true },
            { key: 'strNamDinhCu', col: 'NAMDINHCU', label: 'Năm định cư' },
            { key: 'strNuocDinhCu', col: 'NUOCDINHCU', label: 'Nước định cư' },
            { key: 'strNgheNghiep', col: 'NGHENGHIEP', label: 'Công việc hiện tại', span: true },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strQuanHe_Id: v.strQuanHe_Id,
                strHoVaTen: v.strHoVaTen,
                strNamSinh: v.strNamSinh,
                strNgheNghiep: v.strNgheNghiep,
                strNuocDinhCu: v.strNuocDinhCu,
                strQuocTich: v.strQuocTich,
                strNamDinhCu: v.strNamDinhCu,
                strCongViecHienTai_Id: '',
                strMoTa: v.strMoTa,
                iThuTu: '',
                iTrangThai: 1,
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strNguoiThucHien_Id: P.nth()
            };
        },
        remove: xoa(C)
    };

    return {
        title: 'Quan hệ gia đình',
        tabs: [{ key: 'qhgd', text: 'Quan hệ gia đình', sections: [banThan, voChong, nuocNgoai] }]
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).quanhegiadinh = cauHinh;
    var root = document.getElementById('quanhegiadinh');
    if (root) ums.pat.sections(Object.assign({ el: root }, cauHinh({ hs: uid, nth: uid })));
})();
