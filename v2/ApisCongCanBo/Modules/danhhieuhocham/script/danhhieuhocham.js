/* =========================================================================
   Danh hiệu - Học hàm — hồ sơ cá nhân của cán bộ đang đăng nhập
   Bản gốc: ApisCongCanBo/Modules/danhhieuhocham/script/danhhieuhocham.js
   ---------------------------------------------------------------------------
   Một tab, hai khung — controller kiểu cũ (không mã hoá, versionAPI v1.0 khi lưu):
       Học hàm    NS_QT_ChucDanh   (thêm xong: ThietLapQuaTrinhCuoiCung NHANSU_QT_CHUCDANH)
                  + lưới "Quyết định giao nhiệm vụ": NS_ThongTinQuyetDinh
                    (LayDanhSach theo strNguonDuLieu_Id = id học hàm, ThemMoi |
                    CapNhat, Xoa), tệp của từng dòng vào NS_Files
       Danh hiệu  NS_QT_DanhHieu   (thêm xong: NHANSU_QT_DANHHIEU), tệp vào NS_Files
   Danh mục: NS.LOCD (chức danh), NS.LODH (danh hiệu), NS.QUDI (loại QĐ trong lưới).

   Giữ như bản gốc:
     · Học hàm gửi strQuyetDinhBoNhiem, strNgayQuyetDinh, strNgayHieuLuc,
       strQuyetDinhCongNhanDatChuan đọc từ bốn ô KHÔNG có trên màn → rỗng;
       strThongTinQuyetDinh = ô "Nơi phong" (gửi cả hai chỗ).
     · Lưới chỉ lưu dòng có Số quyết định; luôn vẽ tối thiểu 4 dòng.
     · Danh hiệu: iThuTu đọc ô txtDanhHieu_ThuTu không có trên màn → rỗng.
     · Bản gốc bật phân trang cho bảng học hàm nhưng lời gọi không gửi
       pageIndex/pageSize (máy chủ trả hết) — ở đây hiện hết.
   Khác bản gốc:
     · Ô "Ngày bắt đầu / Ngày kết thúc" của dòng ĐÃ lưu trong lưới là ô chữ,
       của dòng mới là ô chọn ngày — ở đây đều là ô chọn ngày.

   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/danhhieuhocham (cán bộ nhân sự
   chọn một người): ums.ccbHS.danhhieuhocham(P) trả { title, tabs } cho
   ums.pat.sections. P = { hs() → id hồ sơ cán bộ, nth() → id người thực hiện,
   ns: true ở bản Nhân sự }; mặc định (Cổng cán bộ) cả hai là người đăng nhập.
   Bản Nhân sự (P.ns) khác theo bản gốc của nó:
     · lưu KHÔNG gửi versionAPI;
     · Học hàm: nhóm ô "Thông tin cơ bản"; chặn "Ngày phong không được lớn hơn
       ngày hiện tại" (bản gốc Cổng cán bộ cũng có, bản mới Cổng cán bộ chưa
       làm — giữ nguyên); lưới "Thông tin quyết định" thêm Ngày áp dụng
       (strNgayApDung), cột Ngày quyết định / Ngày áp dụng / Ngày hiệu lực /
       Ngày hết hiệu lực / Nhiệm vụ;
     · Danh hiệu: thêm nhóm "Thông tin quyết định" (Loại QĐ, Ngày áp dụng, Ngày
       hiệu lực, Ngày hết hiệu lực) và gửi strNgayApDung, strNhanSu_ThongTinQD_Id,
       strLoaiQuyetDinh_Id, strNgayHieuLuc, strNgayHetHieuLuc.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }

    function cauHinh(P) {
    function ds(c) { return function () { return { action: c + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; }; }
    function ct(c) { return function (row) { return { action: c + '/LayChiTiet', method: 'GET', strId: row.ID }; }; }
    function xoa(c) { return function (ids) { return ids.map(function (id) { return { action: c + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }; }
    /* bản Nhân sự không gửi versionAPI */
    function ver(x) { if (P.ns) delete x.versionAPI; return x; }

    /* ---------- Lưới "Quyết định giao nhiệm vụ" của một học hàm ----------- */
    var luoi = null;
    function veLuoi(extra, row) {
        luoi = ums.pat.rows(extra, {
            title: P.ns ? 'Thông tin quyết định' : 'Quyết định giao nhiệm vụ', icon: 'fa-file-signature', minRows: 4,
            columns: P.ns ? [
                { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', title: 'Loại quyết định', type: 'select',
                  source: { dm: 'NS.QUDI' }, placeholder: '--- Chọn loại quyết định--' },
                { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', title: 'Số quyết định' },
                { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', title: 'Ngày quyết định', type: 'date', width: '130px' },
                { key: 'strNgayApDung', col: 'NGAYAPDUNG', title: 'Ngày áp dụng', type: 'date', width: '130px' },
                { key: 'strNgayHieuLuc', col: 'NGAYHIEULUC', title: 'Ngày hiệu lực', type: 'date', width: '130px' },
                { key: 'strNgayHetHieuLuc', col: 'NGAYHETHIEULUC', title: 'Ngày hết hiệu lực', type: 'date', width: '130px' },
                { key: 'strThongTinQuyetDinh', col: 'THONGTINQUYETDINH', title: 'Nhiệm vụ' },
                { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
            ] : [
                { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', title: 'Loại quyết định', type: 'select',
                  source: { dm: 'NS.QUDI' }, placeholder: '--- Chọn loại quyết định--' },
                { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', title: 'Số quyết định' },
                { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', title: 'Ngày ký quyết định', type: 'date', width: '140px' },
                { key: 'strNgayHieuLuc', col: 'NGAYHIEULUC', title: 'Ngày bắt đầu', type: 'date', width: '140px' },
                { key: 'strNgayHetHieuLuc', col: 'NGAYHETHIEULUC', title: 'Ngày kết thúc', type: 'date', width: '140px' },
                { key: 'strThongTinQuyetDinh', col: 'THONGTINQUYETDINH', title: 'Mô tả' },
                { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
            ],
            list: function (id) {
                return { action: 'NS_ThongTinQuyetDinh/LayDanhSach', method: 'GET', strTuKhoa: '', strNguonDuLieu_Id: id, iTrangThai: 1,
                    strNgayHieuLuc_Tu: '', strNgayHieuLuc_Den: '', strLoaiQuyetDinh_Id: '', strThanhVien_Id: '', pageIndex: 1, pageSize: 10000000 };
            },
            filled: function (v) { return !!v.strSoQuyetDinh; },
            save: function (v, rec, id) {
                var x = {
                    action: rec ? 'NS_ThongTinQuyetDinh/CapNhat' : 'NS_ThongTinQuyetDinh/ThemMoi',
                    strId: rec ? rec.ID : '',
                    strNguonDuLieu_Id: id,
                    strNhanSu_HoSoCanBo_Id: P.hs(),
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strNguoiKyQuyetDinh: '',
                    strNgayHieuLuc: v.strNgayHieuLuc,
                    strThongTinQuyetDinh: v.strThongTinQuyetDinh,
                    strThongTinDinhKem: '',
                    strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                    strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                    iTrangThai: 1,
                    iThuTu: '',
                    strNguoiThucHien_Id: P.nth()
                };
                if (P.ns) x.strNgayApDung = v.strNgayApDung;
                return x;
            },
            remove: function (rec) { return { action: 'NS_ThongTinQuyetDinh/Xoa', strIds: rec.ID, strNguoiThucHien_Id: P.nth() }; }
        });
        luoi.load(row ? row.ID : '');
    }

    var HH = 'NS_QT_ChucDanh';
    var hocHam = {
        title: 'Học hàm', formTitle: 'học hàm', icon: 'fa-user-tie', formCols: 2,
        saveAgain: 'Lưu và nhập tiếp', saveAgainMod: 'save',
        list: { call: ds(HH) },
        detail: ct(HH),
        columns: [
            { title: 'Chuyên ngành', prop: 'CHUYENNGANH' },
            { title: 'Chức danh', prop: 'CHUCDANH_TEN' },
            { title: 'Ngày phong', prop: 'NAMPHONGCHUCDANH', cls: 'is-center is-nowrap' },
            { title: 'Nơi phong', prop: 'NOIPHONGCHUCDANH' }
        ],
        fields: (P.ns ? [{ key: '_ttcb', type: 'legend', label: 'Thông tin cơ bản' }] : []).concat([
            { key: 'strChuyenNganh', col: 'CHUYENNGANH', label: 'Chuyên ngành', required: true, span: true },
            { key: 'strChucDanh_Id', col: 'CHUCDANH_ID', label: 'Chức danh', type: 'select', source: { dm: 'NS.LOCD' }, required: true, span: true },
            { key: 'strNoiPhongChucDanh', col: 'NOIPHONGCHUCDANH', label: 'Nơi phong', span: true },
            { key: 'strNamPhongChucDanh', col: 'NAMPHONGCHUCDANH', label: 'Ngày phong', type: 'date', required: true },
            { key: 'strThoiHan', col: 'THOIHAN', label: 'Thời hạn' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ]),
        onForm: function (row, crud, extra) { veLuoi(extra, row); },
        save: function (v, row) {
            if (P.ns && ums.nsQT && ums.nsQT.soNgay(v.strNamPhongChucDanh) > ums.nsQT.soNgay(ums.nsQT.homNay())) {
                ums.ui.toast('Ngày phong không được lớn hơn ngày hiện tại!', 'warn');
                return null;
            }
            return ver({
                action: HH + (row ? '/CapNhat' : '/ThemMoi'),
                versionAPI: 'v1.0',
                strId: row ? row.ID : '',
                strNhanSu_ThongTinQD_Id: '',
                strSoQuyetDinh: '',
                strNgayQuyetDinh: '',
                strQuyetDinhBoNhiem: '',
                strNguoiKyQuyetDinh: '',
                strNgayHieuLuc: '',
                strQuyetDinhCongNhanDatChuan: '',
                strThongTinQuyetDinh: v.strNoiPhongChucDanh,
                strLoaiQuyetDinh_Id: '',
                strNgayHetHieuLuc: '',
                iTrangThai: 1,
                strChuyenNganh: v.strChuyenNganh,
                strThoiHan: v.strThoiHan,
                strChucDanh_Id: v.strChucDanh_Id,
                strMoTa: v.strMoTa,
                strNamPhongChucDanh: v.strNamPhongChucDanh,
                strNoiPhongChucDanh: v.strNoiPhongChucDanh,
                iThuTu: '',
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strNguoiThucHien_Id: P.nth()
            });
        },
        onSaved: function (crud, result, isEdit) {
            var id = (result.raw && result.raw.Id) || (crud.editing && crud.editing.ID) || '';
            if (luoi) luoi.save(isEdit ? (crud.editing && crud.editing.ID) || id : id);
            if (!isEdit) ums.ref.quaTrinhCuoiCung('NHANSU_QT_CHUCDANH');
        },
        remove: xoa(HH),
        onRemoved: ums.ref.xoaQuyetDinhKem   // dọn quyết định máy chủ sinh kèm dòng vừa xoá (2026-09-30)
    };

    var DH = 'NS_QT_DanhHieu';
    var danhHieu = {
        title: 'Danh hiệu được phong tặng cao nhất', formTitle: 'danh hiệu', icon: 'fa-medal', formCols: 2, saveAgain: 'Lưu và nhập tiếp',
        list: { call: ds(DH) },
        detail: ct(DH),
        columns: [
            { title: 'Danh hiệu', prop: 'DANHHIEU_TEN' },
            { title: 'Ngày phong', prop: 'NAMPHONG', cls: 'is-center is-nowrap' },
            { title: 'Nơi phong', prop: 'NOIPHONG' }
        ],
        fields: [
            { key: 'strDanhHieu_Id', col: 'DANHHIEU_ID', label: 'Danh hiệu', type: 'select', source: { dm: 'NS.LODH' }, required: true, span: true },
            { key: 'strNamPhong', col: 'NAMPHONG', label: 'Ngày phong', type: 'date', required: true, span: true },
            { key: 'strNoiPhong', col: 'NOIPHONG', label: 'Nơi phong', span: true }
        ].concat(P.ns ? [
            { key: '_ttqd', type: 'legend', label: 'Thông tin quyết định' },
            { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', type: 'hidden' },
            { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: { dm: 'NS.QUDI' }, span: true },
            { key: 'strSoQuyetDinh', col: 'NHANSU_TTQUYETDINH_SOQD', label: 'Số quyết định' },
            { key: 'strNgayQuyetDinh', col: 'NHANSU_TTQUYETDINH_NGAYQD', label: 'Ngày quyết định', type: 'date' },
            { key: 'strNgayApDung', col: 'NHANSU_TTQUYETDINH_NGAYAD', label: 'Ngày áp dụng', type: 'date' },
            { key: 'strNgayHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHL', label: 'Ngày hiệu lực', type: 'date' },
            { key: 'strNgayHetHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHHL', label: 'Ngày hết hiệu lực', type: 'date' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' }
        ] : [
            { key: 'strSoQuyetDinh', col: 'NHANSU_TTQUYETDINH_SOQD', label: 'Số quyết định' },
            { key: 'strNgayQuyetDinh', col: 'NHANSU_TTQUYETDINH_NGAYQD', label: 'Ngày ký quyết định', type: 'date' },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ]),
        save: function (v, row) {
            var x = ver({
                action: DH + (row ? '/CapNhat' : '/ThemMoi'),
                versionAPI: 'v1.0',
                strId: row ? row.ID : '',
                strNhanSu_ThongTinQD_Id: '',
                strDanhHieu_Id: v.strDanhHieu_Id,
                strSoQuyetDinh: v.strSoQuyetDinh,
                strNguoiKyQuyetDinh: '',
                strNgayHieuLuc: '',
                strThongTinQuyetDinh: '',
                strLoaiQuyetDinh_Id: '',
                strNgayHetHieuLuc: '',
                strNgayQuyetDinh: v.strNgayQuyetDinh,
                strNamPhong: v.strNamPhong,
                strNoiPhong: v.strNoiPhong,
                strMoTa: v.strMoTa,
                iTrangThai: 1,
                iThuTu: '',
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strNguoiThucHien_Id: P.nth()
            });
            if (P.ns) {
                x.strNgayApDung = v.strNgayApDung;
                x.strNhanSu_ThongTinQD_Id = row ? v.strNhanSu_ThongTinQD_Id : '';
                x.strLoaiQuyetDinh_Id = v.strLoaiQuyetDinh_Id;
                x.strNgayHieuLuc = v.strNgayHieuLuc;
                x.strNgayHetHieuLuc = v.strNgayHetHieuLuc;
            }
            return x;
        },
        onSaved: function (crud, result, isEdit) { if (!isEdit) ums.ref.quaTrinhCuoiCung('NHANSU_QT_DANHHIEU'); },
        remove: xoa(DH),
        onRemoved: ums.ref.xoaQuyetDinhKem   // dọn quyết định máy chủ sinh kèm dòng vừa xoá (2026-09-30)
    };

    return {
        title: 'Danh hiệu - Học hàm',
        tabs: [{ key: 'dhhh', text: 'Danh hiệu - Học hàm', sections: [hocHam, danhHieu] }]
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).danhhieuhocham = cauHinh;
    var root = document.getElementById('danhhieuhocham');
    if (root) ums.pat.sections(Object.assign({ el: root }, cauHinh({ hs: uid, nth: uid })));
})();
