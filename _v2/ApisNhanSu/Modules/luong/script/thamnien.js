/* =========================================================================
   Thâm niên
   Bản gốc: ApisNhanSu/Modules/luong/script/thamnien.js (html gốc nạp "ThamNien.js")
   ---------------------------------------------------------------------------
   MỘT CỘT như bản gốc: thanh lọc (+ Xuất báo cáo / Import) → "Danh sách"
   (Thêm mới, Xoá nhiều, Sửa từng dòng). Biểu mẫu THÊM = "Danh sách nhân sự kèm
   theo" (chọn nhân sự, mỗi người Từ ngày / Đến ngày); biểu mẫu SỬA một dòng
   (Đơn vị, Mã số, Họ tên chỉ đọc + Từ ngày, Đến ngày).
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên — kể cả khoá 'type' gốc đặt trong dữ liệu):
       NS_QT_ThamNien/LayDanhSach  GET  type 'GET', strTuKhoa, strPhanLoaiApDung_Id '' (ô dropAAAA),
                                        strDaoTao_CoCauToChuc_Id, strNhansu_HoSoCanBo_Id (chữ "s" thường
                                        như gốc — ô Thành viên), strNguoiTao_Id '', pageIndex, pageSize
       NS_QT_ThamNien/ThemMoi      POST MỖI nhân sự: type 'POST', strId '', strNhanSu_HoSoCanBo_Id,
                                        strPhanLoaiApDung_Id '' (ô Phân loại đã bị chú thích),
                                        strDaoTao_CoCauToChuc_Id '', strTuNgay, strDenNgay, strNoiDung ''
       NS_QT_ThamNien/CapNhat      POST type 'POST', strId, strNhanSu_HoSoCanBo_Id / strDaoTao_CoCauToChuc_Id
                                        (của dòng), strPhanLoaiApDung_Id '', strTuNgay, strDenNgay
       NS_QT_ThamNien/Xoa          POST strIds, strNguoiThucHien_Id
   Ô lọc: Đơn vị → Thành viên (NS_HoSoV2/LayDanhSach GET, dLaCanBoNgoaiTruong -1).
   Xuất báo cáo (getList_MauImport "zonebtnBaoCao_CSAP"): bộ khoá addKeyValue gốc;
   các ô gốc đọc mà KHÔNG có trên màn (txtSearch_ThamNien_TuKhoa, …TuNgay/DenNgay,
   txtSearch_Nam, dropSearch_LaCanBo_ThamNien, txtSearch_NamXuatChungTu) gửi rỗng.

   Lỗi gốc đã sửa theo ý định:
     · Ô đánh dấu dòng mang id "checkX…" nhưng nút Xoá / báo cáo đọc "checkHS…" →
       Xoá luôn báo "Vui lòng chọn đối tượng cần xóa" (chưa từng xoá được). Nay xoá
       đúng các dòng đã chọn; báo cáo gửi strNhanSu_HoSoCanBo_Id = ID DÒNG như màn
       Lương được nhận khác.
   Khác bản gốc (luật chung): Thành viên KHOÁ tới khi chọn Đơn vị.
   ========================================================================= */
(function () {
    'use strict';

    var L = ums.luongB, ui = ums.ui;
    var C = 'NS_QT_ThamNien';
    var uid = L.uid;
    var luoi = null;

    var crud = ums.crud({
        root: document.getElementById('thamnien'),
        title: 'Thâm niên',
        listTitle: 'Danh sách',
        formTitle: 'thâm niên',
        icon: 'fa-hourglass-half',

        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị' },
            { key: 'tv', type: 'select', label: 'Chọn thành viên' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', type: 'GET', strTuKhoa: f.q, strPhanLoaiApDung_Id: '',
                    strDaoTao_CoCauToChuc_Id: f.dv, strNhansu_HoSoCanBo_Id: f.tv, strNguoiTao_Id: '' };
            }
        },

        columns: [
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', cls: 'is-center' },
            { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO' },
            { title: 'Họ tên', render: function (r) { return ui.esc(L.hoTen(r)); } },
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' }
        ],

        fields: [
            { key: '_canBo', label: 'Cán bộ', type: 'static', span: true, get: function (r) { return L.hoTen(r) + ' - Mã cán bộ: ' + L.e(r.NHANSU_HOSOCANBO_MASO); } },
            { key: '_donVi', col: 'DAOTAO_COCAUTOCHUC_TEN', label: 'Đơn vị', type: 'static' },
            { key: '_maSo', col: 'NHANSU_HOSOCANBO_MASO', label: 'Mã số', type: 'static' },
            { key: '_hoTen', label: 'Họ tên', type: 'static', get: function (r) { return L.hoTen(r); } },
            { key: '_g', type: 'gap' },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' }
        ],

        onForm: function (row, c) {
            luoi = L.formNhanSu(c, row, {
                anForm: true,
                title: 'Danh sách nhân sự kèm theo', chon: 'Chọn nhân sự',
                cot: [
                    { key: 'tuNgay', title: 'Từ ngày', kieu: 'ngay', width: '170px' },
                    { key: 'denNgay', title: 'Đến ngày', kieu: 'ngay', width: '170px' }
                ]
            });
        },

        save: function (v, row, c) {
            if (row) {
                return {
                    action: C + '/CapNhat', type: 'POST', strId: row.ID,
                    strNhanSu_HoSoCanBo_Id: row.NHANSU_HOSOCANBO_ID, strPhanLoaiApDung_Id: '',
                    strDaoTao_CoCauToChuc_Id: row.DAOTAO_COCAUTOCHUC_ID,
                    strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay, strNguoiThucHien_Id: uid()
                };
            }
            var ds = luoi ? luoi.ds() : [];
            if (!ds.length) { ui.toast('Chọn nhân sự trước khi lưu', 'warn'); return null; }
            ui.batch(ds.map(function (x) {
                return {
                    action: C + '/ThemMoi', type: 'POST', strId: '', strNhanSu_HoSoCanBo_Id: x.ns.ID,
                    strPhanLoaiApDung_Id: '', strDaoTao_CoCauToChuc_Id: '',
                    strTuNgay: x.v.tuNgay, strDenNgay: x.v.denNgay, strNoiDung: '', strNguoiThucHien_Id: uid()
                };
            }), { title: 'Thêm thâm niên' }).then(function (r) {
                if (r.ok) { c.showList(); c.load(); }
            });
            return null;
        },

        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
    });

    L.donViThanhVien(L.oLoc(crud, 'dv'), L.oLoc(crud, 'tv'), { la: -1 });

    var bc = document.createElement('span');
    crud.z('actions').insertBefore(bc, crud.z('actions').firstChild);
    L.baoCao(bc, {
        collect: function (add) {
            var f = crud.filterValues();
            add('strTuKhoa', '');
            add('strDaoTao_CoCauToChuc_Id', f.dv);
            add('strNgayPhatSinh_TuNgay', '');
            add('strNgayPhatSinh_DenNgay', '');
            add('strSearch_NhanSu_HoSoCanBo_Id', f.tv);
            add('strNam', '');
            add('dLaCanBoNgoaiTruong', '');
            add('strNamXuatChungTu', '');
            crud.pickedRows().forEach(function (r) { add('strNhanSu_HoSoCanBo_Id', r.ID); });
        },
        onImported: function () { crud.load(); }
    });
})();
