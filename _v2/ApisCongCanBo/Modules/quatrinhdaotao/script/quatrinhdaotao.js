/* =========================================================================
   Quá trình đào tạo — hồ sơ cá nhân của cán bộ đang đăng nhập
   Bản gốc: ApisCongCanBo/Modules/quatrinhdaotao/script/quatrinhdaotao.js (2.493 dòng)
   ---------------------------------------------------------------------------
   Năm tab, sáu khung — mỗi khung một controller kiểu cũ (không mã hoá):
       Quá trình đào tạo   NS_QT_DaoTao          (+ lưới NS_QT_DaoTao_GiaHan, NS_QT_DaoTao_TienDo)
       Quá trình bồi dưỡng NS_QT_BoiDuong
       Học vị              NS_QT_HocVi
       Trình độ chính trị  NS_QT_TrinhDoLyLuan
       Trình độ tin học    NS_QT_TrinhDoTinHoc
       Trình độ ngoại ngữ  NS_QT_TrinhDoNgoaiNgu
   Mỗi controller: LayDanhSach (GET, strNhanSu_HoSoCanBo_Id = userId),
   LayChiTiet (GET — trừ NS_QT_DaoTao: bản gốc lấy dòng từ danh sách),
   ThemMoi | CapNhat, Xoa (strIds). Thêm mới xong gọi ThietLapQuaTrinhCuoiCung
   với mã NHANSU_QT_DATO / _BODU / _HOCVI / _TDLL / _TDTH / _TDNN.
   Cột "Học vị hiện tại" / "Trình độ hiện tại": LAQUATRINHHIENTAI = CUOICUNG
   thì hiện bật; dòng khác bấm để ThietLapQuaTrinhCuoiCung (bản gốc chỉ gửi
   MÃ BẢNG, không gửi id dòng — giữ nguyên).

   Khác bản gốc (lỗi rõ ràng, không chép):
     · Đào tạo + Bồi dưỡng: bản gốc đọc/ghi ô txtNgayKy / txtBB_NgayKy KHÔNG
       có trên màn, nên "Ngày quyết định" luôn gửi rỗng, không bao giờ hiện
       lại, và phép kiểm "không lớn hơn ngày hiện tại" không chạy. Ở đây nối
       đúng ô "Ngày quyết định" với strNgayQuyetDinh / NGAYQUYETDINH.
     · Lưới Gia hạn / Tiến độ: nút "Xóa" của dòng ĐÃ LƯU mang lớp deleteTienDo
       mà trình xử lý nghe .deleteKetQua → không xoá được; nút "Xóa dòng" của
       Gia hạn gắn vào #tblThanhVien (không tồn tại) → không bỏ được dòng.
       Ở đây cả hai chạy: dòng đã lưu hỏi rồi gọi …/Xoa, dòng mới bỏ ngay.
     · Tệp của dòng MỚI trong lưới: bản gốc saveFiles(…, strId) với strId
       rỗng → tệp không bao giờ được gắn. Ở đây gắn vào id máy chủ trả về.
   Giữ như bản gốc (chờ nghiệp vụ):
     · Đào tạo: bốn ô "Hình thức đào tạo khác", "Ngày áp dụng", "Ngày hiệu
       lực", "Ngày hết hiệu lực" hiện trên màn nhưng KHÔNG được gửi đi.
       strNhanSu_ThongTinQD_Id nhận giá trị ô "Loại quyết định".
     · Ô bắt buộc theo đúng danh sách kiểm của bản gốc (vd "Trình độ khác"
       của tin học có dấu * trên nhãn cũ nhưng bản gốc không bắt).
     · Chỉ lưu dòng Gia hạn có đủ loại QĐ + số QĐ + ngày ký; dòng Tiến độ có
       tình trạng. Luôn vẽ tối thiểu 4 dòng.

   DÙNG LẠI ở bản quản trị Nhân sự (ApisNhanSu/Modules/quatrinhdaotao — chọn một
   cán bộ rồi xem/sửa): ums.ccbQtDaoTao.mount(root, { nhanSuId, tieuDe, quanTri }).
     nhanSuId()  id hồ sơ đang xem (strNhanSu_HoSoCanBo_Id); mặc định người đăng nhập.
     tieuDe      false = không vẽ tiêu đề trang (khung lồng).
     quanTri     true = khác biệt của bản NS: nhãn tab đánh số như gốc NS
                 ("1) Đào tạo - Bồi dưỡng"…) và khung Bồi dưỡng bản mới của NS —
                 gửi thêm strLoaiQuyetDinh_Id / strNgayApDung / strNgayHieuLuc /
                 strNgayHetHieuLuc, id quyết định ẩn (NHANSU_THONGTINQUYETDINH_ID),
                 đọc cột NHANSU_TTQUYETDINH_NGAYQD/AD/HL/HHL, kiểm "Ngày hiệu lực
                 không được lớn hơn ngày hết hiệu lực", iThuTu 0.
   Mặc định giữ nguyên hành vi Cổng cán bộ: tự dựng vào #quatrinhdaotao nếu có.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }

    /* dd/mm/yyyy hoặc yyyy → số so sánh được */
    function ngay(s) {
        s = String(s || '').trim();
        var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
        if (m) return Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]);
        return /^\d{4}$/.test(s) ? Number(s) * 10000 + 1231 : null;
    }
    function homNay() { var d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
    function sau(a, b) { var x = ngay(a), y = ngay(b); return x !== null && y !== null && x > y; }

    function mount(root, o) {
        o = o || {};
        function ns() { return o.nhanSuId ? o.nhanSuId() : uid(); }

        function ds(ctrl) {
            return function () { return { action: ctrl + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: ns() }; };
        }
        function ct(ctrl) { return function (row) { return { action: ctrl + '/LayChiTiet', method: 'GET', strId: row.ID }; }; }
        function xoa(ctrl) {
            return function (ids) { return ids.map(function (id) { return { action: ctrl + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); };
        }
        function cuoi(ma) {
            return function (crud, result, isEdit) { if (!isEdit) ums.ref.quaTrinhCuoiCung(ma); };
        }

        /* Cột "… hiện tại" — bật (đang là quá trình cuối) / nút chuyển thành cuối */
        function hienTai(title, ma) {
            return {
                title: title, cls: 'is-center', width: '120px', render: function (r) {
                    if (r.LAQUATRINHHIENTAI === 'CUOICUNG') {
                        return '<span style="color:var(--ums-blue)" title="Đây là trạng thái cuối của quá trình"><i class="fa-solid fa-toggle-on" style="font-size:22px"></i></span>';
                    }
                    return '<button type="button" class="ums-iconbtn" data-cuoi="' + esc(ma) + '" title="Thiết lập trạng thái cuối cùng">' +
                        '<i class="fa-light fa-toggle-off" style="font-size:22px"></i></button>';
                }
            };
        }

        var LUU_Y = '* Lưu ý: Thời gian bắt đầu, thời gian kết thúc cán bộ chỉ nhập năm. VD: 2010';
        var QUDI = { dm: 'NS.QUDI' };
        var HTDT = { dm: 'QLCB.HTDT' };

        /* ---------- Lưới Gia hạn + Tiến độ học tập của một quá trình đào tạo ---- */
        var luoi = null;
        function veLuoi(extra, row) {
            extra.innerHTML = '<div data-z="giahan"></div><div class="ums-u-mt-4" data-z="tiendo"></div>';
            var gh = ums.pat.rows(extra.querySelector('[data-z="giahan"]'), {
                title: 'Gia hạn', icon: 'fa-calendar-plus', minRows: 4,
                columns: [
                    { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', title: 'Loại quyết định gia hạn', type: 'select',
                      source: { dm: 'NS.GIAHAN' }, placeholder: '--- Chọn quyết định gia hạn --' },
                    { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', title: 'Số QĐ' },
                    { key: 'strNgayKy', col: 'NGAYKY', title: 'Ngày ký QĐ', type: 'date', width: '150px' },
                    { key: 'strGiaHanDenNgay', col: 'GIAHANDENNGAY', title: 'Gia hạn đến ngày', type: 'date', width: '150px' },
                    { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
                ],
                list: function (id) {
                    return { action: 'NS_QT_DaoTao_GiaHan/LayDanhSach', method: 'GET', strNhanSu_QT_DATO_Id: id, strNhanSu_HoSoCanBo_Id: ns() };
                },
                filled: function (v) { return v.strSoQuyetDinh && v.strLoaiQuyetDinh_Id && v.strNgayKy; },
                save: function (v, rec, id) {
                    return {
                        action: rec ? 'NS_QT_DaoTao_GiaHan/CapNhat' : 'NS_QT_DaoTao_GiaHan/ThemMoi',
                        strId: rec ? rec.ID : '',
                        strNhanSu_HoSoCanBo_Id: ns(),
                        strNgayKy: v.strNgayKy,
                        strGiaHanDenNgay: v.strGiaHanDenNgay,
                        strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                        strSoQuyetDinh: v.strSoQuyetDinh,
                        strNhanSu_QT_DATO_Id: id,
                        strMoTa: '',
                        strNguoiThucHien_Id: uid()
                    };
                },
                remove: function (rec) { return { action: 'NS_QT_DaoTao_GiaHan/Xoa', strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
            });
            var td = ums.pat.rows(extra.querySelector('[data-z="tiendo"]'), {
                title: 'Tiến độ học tập', icon: 'fa-list-check', minRows: 4,
                columns: [
                    { key: 'strNgayBaoCao', col: 'NGAYBAOCAO', title: 'Ngày', type: 'date', width: '150px' },
                    { key: 'strTienDo_Id', col: 'TIENDO_ID', title: 'Tình trạng', type: 'select',
                      source: { dm: 'NS.TIENDOHOCTAP' }, placeholder: '--- Chọn tình trạng--' },
                    { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' },
                    { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
                ],
                list: function (id) {
                    return { action: 'NS_QT_DaoTao_TienDo/LayDanhSach', method: 'GET', strNhanSu_QT_DATO_Id: id, strNhanSu_HoSoCanBo_Id: ns() };
                },
                filled: function (v) { return !!v.strTienDo_Id; },
                save: function (v, rec, id) {
                    return {
                        action: rec ? 'NS_QT_DaoTao_TienDo/CapNhat' : 'NS_QT_DaoTao_TienDo/ThemMoi',
                        strId: rec ? rec.ID : '',
                        strNhanSu_HoSoCanBo_Id: ns(),
                        strNgayBaoCao: v.strNgayBaoCao,
                        strTienDo_Id: v.strTienDo_Id,
                        strNhanSu_QT_DATO_Id: id,
                        strMoTa: v.strMoTa,
                        strNguoiThucHien_Id: uid()
                    };
                },
                remove: function (rec) { return { action: 'NS_QT_DaoTao_TienDo/Xoa', strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
            });
            gh.load(row ? row.ID : '');
            td.load(row ? row.ID : '');
            luoi = { gh: gh, td: td };
        }

        /* ---------- Quá trình đào tạo ---------------------------------------- */
        var daoTao = {
            title: 'Quá trình đào tạo', formTitle: 'quá trình đào tạo', icon: 'fa-graduation-cap', saveAgain: 'Lưu và nhập tiếp',
            list: { call: ds('NS_QT_DaoTao') },
            columns: [
                { title: 'Tên cơ sở đào tạo', prop: 'NOIDAOTAO' },
                { title: 'Chuyên ngành đào tạo', prop: 'NGANHDAOTAO' },
                { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (r) { return esc((r.NGAYBATDAU || '') + '-' + (r.NGAYKETTHUC || '')); } },
                { title: 'Văn bằng', prop: 'BANGCAPCHUNGCHI_TEN' }
            ],
            fields: [
                { key: 'strNoiDaoTao', col: 'NOIDAOTAO', label: 'Tên cơ sở đào tạo', required: true },
                { key: 'strNganhDaoTao', col: 'NGANHDAOTAO', label: 'Chuyên ngành đào tạo', required: true },
                { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Thời gian bắt đầu' },
                { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Thời gian kết thúc' },
                { key: 'strHinhThucDaoTao_Id', col: 'HINHTHUCDAOTAO_ID', label: 'Hình thức đào tạo', type: 'select', source: HTDT },
                { key: '_htKhac', label: 'Hình thức đào tạo khác' },
                { key: 'strBangCapChungChi_Id', col: 'BANGCAPCHUNGCHI_ID', label: 'Văn bằng / Chứng chỉ', type: 'select',
                  source: { dm: 'NS.DMHV' }, placeholder: 'Văn bằng/chứng chỉ', span: true },
                { key: 'strNgayBaoVeCoSo', col: 'NGAYBAOVECOSO', label: 'Mốc bảo vệ cơ sở' },
                { key: 'strNgayBaoVeChinhThuc', col: 'NGAYBAOVECHINHTHUC', label: 'Mốc bảo vệ chính thức' },
                { key: '_luuY', type: 'note', label: LUU_Y },
                { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: QUDI },
                { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', label: 'Số quyết định' },
                { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', label: 'Ngày quyết định', type: 'date' },
                { key: '_ngayApDung', label: 'Ngày áp dụng', type: 'date' },
                { key: '_ngayHieuLuc', label: 'Ngày hiệu lực', type: 'date' },
                { key: '_ngayHetHieuLuc', label: 'Ngày hết hiệu lực', type: 'date' },
                { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' }
            ],
            onForm: function (row, crud, extra) { veLuoi(extra, row); },
            save: function (v, row) {
                if (sau(v.strNgayQuyetDinh, String(homNay()).replace(/^(\d{4})(\d{2})(\d{2})$/, '$3/$2/$1'))) {
                    ui.toast('Ngày ký quyết định không được lớn hơn ngày hiện tại!', 'warn'); return null;
                }
                if (sau(v.strNgayBatDau, v.strNgayKetThuc)) { ui.toast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'warn'); return null; }
                return {
                    action: row ? 'NS_QT_DaoTao/CapNhat' : 'NS_QT_DaoTao/ThemMoi',
                    strId: row ? row.ID : '',
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayBatDau: v.strNgayBatDau,
                    strNgayKetThuc: v.strNgayKetThuc,
                    strNoiDaoTao: v.strNoiDaoTao,
                    strNganhDaoTao: v.strNganhDaoTao,
                    strHinhThucDaoTao_Id: v.strHinhThucDaoTao_Id,
                    strBangCapChungChi_Id: v.strBangCapChungChi_Id,
                    strThongTinDinhKem: '',
                    strNgayBaoVeCoSo: v.strNgayBaoVeCoSo,
                    strNgayBaoVeChinhThuc: v.strNgayBaoVeChinhThuc,
                    iTrangThai: 1,
                    iThuTu: '',
                    strNhanSu_ThongTinQD_Id: v.strNhanSu_ThongTinQD_Id,
                    strNguoiThucHien_Id: uid()
                };
            },
            onSaved: function (crud, result, isEdit) {
                var id = (result.raw && result.raw.Id) || (crud.editing && crud.editing.ID) || '';
                var l = luoi;
                if (l) { l.gh.save(id); l.td.save(id); }
                if (!isEdit) ums.ref.quaTrinhCuoiCung('NHANSU_QT_DATO');
            },
            remove: xoa('NS_QT_DaoTao')
        };

        /* ---------- Quá trình bồi dưỡng -------------------------------------- */
        var boiDuong = {
            title: 'Quá trình bồi dưỡng', formTitle: 'quá trình bồi dưỡng', icon: 'fa-chalkboard-user', saveAgain: 'Lưu và nhập tiếp',
            list: { call: ds('NS_QT_BoiDuong') },
            detail: ct('NS_QT_BoiDuong'),
            columns: [
                { title: 'Tên cơ sở bồi dưỡng', prop: 'DIADIEMBOIDUONG' },
                { title: 'Chuyên ngành bồi dưỡng', prop: 'NOIDUNGBOIDUONG' },
                { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (r) { return esc((r.NGAYBATDAU || '') + '-' + (r.NGAYKETTHUC || '')); } },
                { title: 'Chứng chỉ', prop: 'KETQUADATDUOC' }
            ],
            fields: [
                { key: 'strDiaDiemBoiDuong', col: 'DIADIEMBOIDUONG', label: 'Tên cơ sở bồi dưỡng', required: true, span: true },
                { key: 'strNoiDungBoiDuong', col: 'NOIDUNGBOIDUONG', label: 'Chuyên ngành bồi dưỡng', required: true, span: true },
                { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Thời gian bắt đầu' },
                { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Thời gian kết thúc' },
                { key: 'strHinhThucDaoTao_Id', col: 'HINHTHUCDAOTAO_ID', label: 'Hình thức bồi dưỡng', type: 'select', source: HTDT },
                { key: 'strHinhThucDaoTao_Khac', col: 'HINHTHUCDAOTAO_KHAC', label: 'Hình thức bồi dưỡng khác' },
                { key: 'strKetQuaDatDuoc', col: 'KETQUADATDUOC', label: 'Chứng chỉ/Chứng nhận', span: true },
                { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: QUDI },
                { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', label: 'Số quyết định' },
                { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', label: 'Ngày quyết định', type: 'date' },
                { key: '_ngayApDung', label: 'Ngày áp dụng', type: 'date' },
                { key: '_ngayHieuLuc', label: 'Ngày hiệu lực', type: 'date' },
                { key: '_ngayHetHieuLuc', label: 'Ngày hết hiệu lực', type: 'date' },
                { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' }
            ],
            save: function (v, row) {
                if (sau(v.strNgayQuyetDinh, String(homNay()).replace(/^(\d{4})(\d{2})(\d{2})$/, '$3/$2/$1'))) {
                    ui.toast('Ngày ký quyết định không được lớn hơn ngày hiện tại!', 'warn'); return null;
                }
                if (sau(v.strNgayBatDau, v.strNgayKetThuc)) { ui.toast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'warn'); return null; }
                return {
                    action: row ? 'NS_QT_BoiDuong/CapNhat' : 'NS_QT_BoiDuong/ThemMoi',
                    strId: row ? row.ID : '',
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayBatDau: v.strNgayBatDau,
                    strNgayKetThuc: v.strNgayKetThuc,
                    strDiaDiemBoiDuong: v.strDiaDiemBoiDuong,
                    strHinhThucDaoTao_Khac: v.strHinhThucDaoTao_Khac,
                    strKetQuaDatDuoc: v.strKetQuaDatDuoc,
                    strNoiDungBoiDuong: v.strNoiDungBoiDuong,
                    strThongTinDinhKem: '',
                    strNhanSu_ThongTinQD_Id: v.strNhanSu_ThongTinQD_Id,
                    strHinhThucDaoTao_Id: v.strHinhThucDaoTao_Id,
                    strBangCapChungChi_Id: '',
                    iTrangThai: 1,
                    iThuTu: '',
                    strNguoiThucHien_Id: uid()
                };
            },
            onSaved: cuoi('NHANSU_QT_BODU'),
            remove: xoa('NS_QT_BoiDuong')
        };

        /* ---------- Học vị ---------------------------------------------------- */
        var hocVi = {
            title: 'Học vị', formTitle: 'học vị', icon: 'fa-user-graduate', saveAgain: 'Lưu và nhập tiếp',
            list: { call: ds('NS_QT_HocVi') },
            detail: ct('NS_QT_HocVi'),
            columns: [
                { title: 'Học vị', prop: 'HOCVI_TEN' },
                { title: 'Chuyên ngành', prop: 'CHUYENNGANH_TEN' },
                { title: 'Năm nhận', prop: 'NAMNHANHOCVI', cls: 'is-center' },
                { title: 'Nơi nhận', prop: 'NOINHANHOCVI' },
                hienTai('Học vị hiện tại', 'NHANSU_QT_HOCVI')
            ],
            fields: [
                { key: 'strHocVi_Id', col: 'HOCVI_ID', label: 'Học vị', type: 'select', source: { dm: 'NS.DMHV' }, required: true, span: true },
                { key: 'strChuyenNganh_Id', col: 'CHUYENNGANH_ID', label: 'Chuyên ngành', type: 'select', source: { dm: 'QLCB.CNDT' }, required: true, span: true },
                { key: 'strNamNhanHocVi', col: 'NAMNHANHOCVI', label: 'Năm nhận' },
                { key: 'strNoiNhanHocVi', col: 'NOINHANHOCVI', label: 'Nơi nhận' }
            ],
            save: function (v, row) {
                return {
                    action: row ? 'NS_QT_HocVi/CapNhat' : 'NS_QT_HocVi/ThemMoi',
                    strId: row ? row.ID : '',
                    strHocVi_Id: v.strHocVi_Id,
                    strChuyenNganh_Id: v.strChuyenNganh_Id,
                    strNamNhanHocVi: v.strNamNhanHocVi,
                    strNoiNhanHocVi: v.strNoiNhanHocVi,
                    iTrangThai: 1,
                    iThuTu: '',
                    strMoTa: '',                         // ô txtMoTa không có trên biểu mẫu học vị
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strNguoiThucHien_Id: uid()
                };
            },
            onSaved: cuoi('NHANSU_QT_HOCVI'),
            remove: xoa('NS_QT_HocVi')
        };

        /* ---------- Trình độ chính trị ----------------------------------------- */
        var chinhTri = {
            title: 'Trình độ chính trị', formTitle: 'trình độ chính trị', icon: 'fa-flag', formCols: 1, saveAgain: 'Lưu và nhập tiếp',
            list: { call: ds('NS_QT_TrinhDoLyLuan') },
            detail: ct('NS_QT_TrinhDoLyLuan'),
            columns: [
                { title: 'Trình độ', prop: 'TRINHDOLYLUAN_TEN' },
                { title: 'Năm công nhận', prop: 'NAMCONGNHAN', cls: 'is-center' },
                { title: 'Mô tả', prop: 'MOTA' },
                hienTai('Trình độ hiện tại', 'NHANSU_QT_TDLL')
            ],
            fields: [
                { key: 'strTrinhDoLyLuan_Id', col: 'TRINHDOLYLUAN_ID', label: 'Trình độ', type: 'select', source: { dm: 'NS.TDCT' }, required: true },
                { key: 'strNamCongNhan', col: 'NAMCONGNHAN', label: 'Năm công nhận', required: true },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
            ],
            save: function (v, row) {
                if (sau(v.strNamCongNhan, String(homNay()).replace(/^(\d{4})(\d{2})(\d{2})$/, '$3/$2/$1'))) {
                    ui.toast('Ngày công nhận không được lớn hơn ngày hiện tại!', 'warn'); return null;
                }
                return {
                    action: row ? 'NS_QT_TrinhDoLyLuan/CapNhat' : 'NS_QT_TrinhDoLyLuan/ThemMoi',
                    strId: row ? row.ID : '',
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strTrinhDoLyLuan_Id: v.strTrinhDoLyLuan_Id,
                    strMoTa: v.strMoTa,
                    strNamCongNhan: v.strNamCongNhan,
                    iTrangThai: 1,
                    iThuTu: 1,
                    strNguoiThucHien_Id: uid()
                };
            },
            onSaved: cuoi('NHANSU_QT_TDLL'),
            remove: xoa('NS_QT_TrinhDoLyLuan')
        };

        /* ---------- Trình độ tin học ------------------------------------------ */
        var tinHoc = {
            title: 'Trình độ tin học', formTitle: 'trình độ tin học', icon: 'fa-laptop-code', saveAgain: 'Lưu và nhập tiếp',
            list: { call: ds('NS_QT_TrinhDoTinHoc') },
            detail: ct('NS_QT_TrinhDoTinHoc'),
            columns: [
                { title: 'Trình độ', prop: 'TRINHDOTINHOC_TEN' },
                { title: 'Thời hạn', prop: 'MOTA' }
            ],
            fields: [
                { key: 'strTrinhDoTinHoc_Id', col: 'TRINHDOTINHOC_ID', label: 'Trình độ', type: 'select', source: { dm: 'NS.TDTH' },
                  placeholder: '--Chọn trình độ--', required: true },
                { key: 'strTrinhDoTinHoc_Khac', col: 'TRINHDOTINHOC_KHAC', label: 'Trình độ khác' },
                { key: 'strMoTa', col: 'MOTA', label: 'Thời hạn', required: true, span: true }
            ],
            save: function (v, row) {
                return {
                    action: row ? 'NS_QT_TrinhDoTinHoc/CapNhat' : 'NS_QT_TrinhDoTinHoc/ThemMoi',
                    strId: row ? row.ID : '',
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strTrinhDoTinHoc_Id: v.strTrinhDoTinHoc_Id,
                    strTrinhDoTinHoc_Khac: v.strTrinhDoTinHoc_Khac,
                    strMoTa: v.strMoTa,
                    iTrangThai: 1,
                    iThuTu: '',                            // ô txtTH_ThuTu không có trên màn
                    strNguoiThucHien_Id: uid()
                };
            },
            onSaved: cuoi('NHANSU_QT_TDTH'),
            remove: xoa('NS_QT_TrinhDoTinHoc')
        };

        /* ---------- Trình độ ngoại ngữ ---------------------------------------- */
        var ngoaiNgu = {
            title: 'Trình độ ngoại ngữ', formTitle: 'trình độ ngoại ngữ', icon: 'fa-language', formCols: 1, saveAgain: 'Lưu và nhập tiếp',
            list: { call: ds('NS_QT_TrinhDoNgoaiNgu') },
            detail: ct('NS_QT_TrinhDoNgoaiNgu'),
            columns: [
                { title: 'Ngôn ngữ', prop: 'NGONNGU_TEN' },
                { title: 'Trình độ', prop: 'TRINHDONGOAINGU_TEN' },
                { title: 'Điểm số', prop: 'DIEMSO', cls: 'is-center' }
            ],
            fields: [
                { key: 'strNgonNgu_Id', col: 'NGONNGU_ID', label: 'Ngôn ngữ', type: 'select', source: { dm: 'NS.DMNN' }, required: true },
                { key: 'strTrinhDoNgoaiNgu_Id', col: 'TRINHDONGOAINGU_ID', label: 'Trình độ', type: 'select', source: { dm: 'NS.TDNN' }, required: true },
                { key: 'strDiemSo', col: 'DIEMSO', label: 'Tổng điểm/ Điểm trung bình', required: true },
                { key: 'strDiem_KyNangNghe', col: 'DIEM_KYNANGNGHE', label: 'Điểm nghe' },
                { key: 'strDiem_KyNangNoi', col: 'DIEM_KYNANGNOI', label: 'Điểm nói' },
                { key: 'strDiem_KyNangDoc', col: 'DIEM_KYNANGDOC', label: 'Điểm đọc' },
                { key: 'strDiem_KyNangViet', col: 'DIEM_KYNANGVIET', label: 'Điểm viết' },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
            ],
            save: function (v, row) {
                return {
                    action: row ? 'NS_QT_TrinhDoNgoaiNgu/CapNhat' : 'NS_QT_TrinhDoNgoaiNgu/ThemMoi',
                    strId: row ? row.ID : '',
                    strTrinhDoNgoaiNgu_Id: v.strTrinhDoNgoaiNgu_Id,
                    strNgonNgu_Id: v.strNgonNgu_Id,
                    strDiemSo: v.strDiemSo,
                    strDiem_KyNangNghe: v.strDiem_KyNangNghe,
                    strDiem_KyNangNoi: v.strDiem_KyNangNoi,
                    strDiem_KyNangDoc: v.strDiem_KyNangDoc,
                    strDiem_KyNangViet: v.strDiem_KyNangViet,
                    iTrangThai: 1,
                    iThuTu: '',                            // ô txtTDNN_ThuTu không có trên màn
                    strMoTa: v.strMoTa,
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strNguoiThucHien_Id: uid()
                };
            },
            onSaved: cuoi('NHANSU_QT_TDNN'),
            remove: xoa('NS_QT_TrinhDoNgoaiNgu')
        };

        /* ---------- Quá trình bồi dưỡng — bản Nhân sự (o.quanTri) ------------- */
        if (o.quanTri) {
            boiDuong.fields = [
                { key: 'strDiaDiemBoiDuong', col: 'DIADIEMBOIDUONG', label: 'Tên cơ sở bồi dưỡng', required: true, span: true },
                { key: 'strNoiDungBoiDuong', col: 'NOIDUNGBOIDUONG', label: 'Chuyên ngành bồi dưỡng', required: true, span: true },
                { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Thời gian bắt đầu' },
                { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Thời gian kết thúc' },
                { key: 'strHinhThucDaoTao_Id', col: 'HINHTHUCDAOTAO_ID', label: 'Hình thức bồi dưỡng', type: 'select', source: HTDT },
                { key: 'strHinhThucDaoTao_Khac', col: 'HINHTHUCDAOTAO_KHAC', label: 'Hình thức bồi dưỡng khác' },
                { key: 'strKetQuaDatDuoc', col: 'KETQUADATDUOC', label: 'Chứng chỉ/Chứng nhận', span: true },
                // txtBD_QuyetDinh_ID: ô ẩn giữ id thông tin quyết định khi sửa
                { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', type: 'hidden' },
                { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: QUDI },
                { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', label: 'Số quyết định' },
                { key: 'strNgayQuyetDinh', col: 'NHANSU_TTQUYETDINH_NGAYQD', label: 'Ngày quyết định', type: 'date' },
                { key: 'strNgayApDung', col: 'NHANSU_TTQUYETDINH_NGAYAD', label: 'Ngày áp dụng', type: 'date' },
                { key: 'strNgayHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHL', label: 'Ngày hiệu lực', type: 'date' },
                { key: 'strNgayHetHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHHL', label: 'Ngày hết hiệu lực', type: 'date' },
                { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' }
            ];
            boiDuong.save = function (v, row) {
                if (sau(v.strNgayQuyetDinh, String(homNay()).replace(/^(\d{4})(\d{2})(\d{2})$/, '$3/$2/$1'))) {
                    ui.toast('Ngày ký quyết định không được lớn hơn ngày hiện tại!', 'warn'); return null;
                }
                if (sau(v.strNgayHieuLuc, v.strNgayHetHieuLuc)) { ui.toast('Ngày hiệu lực không được lớn hơn ngày hết hiệu lực!', 'warn'); return null; }
                return {
                    action: row ? 'NS_QT_BoiDuong/CapNhat' : 'NS_QT_BoiDuong/ThemMoi',
                    strId: row ? row.ID : '',
                    strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                    strNgayApDung: v.strNgayApDung,
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strNgayHieuLuc: v.strNgayHieuLuc,
                    strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayBatDau: v.strNgayBatDau,
                    strNgayKetThuc: v.strNgayKetThuc,
                    strDiaDiemBoiDuong: v.strDiaDiemBoiDuong,
                    strNoiDungBoiDuong: v.strNoiDungBoiDuong,
                    strKetQuaDatDuoc: v.strKetQuaDatDuoc,
                    strThongTinDinhKem: '',
                    strNhanSu_ThongTinQD_Id: v.strNhanSu_ThongTinQD_Id,
                    strHinhThucDaoTao_Id: v.strHinhThucDaoTao_Id,
                    strHinhThucDaoTao_Khac: v.strHinhThucDaoTao_Khac,
                    strBangCapChungChi_Id: '',
                    iTrangThai: 1,
                    iThuTu: 0,
                    strNguoiThucHien_Id: uid()
                };
            };
        }

        var so = o.quanTri;       // bản NS đánh số tab như gốc
        var pg = ums.pat.sections({
            el: root,
            title: o.tieuDe === false ? '' : (o.tieuDe || 'Quá trình đào tạo'),
            tabs: [
                { key: 'daotao', text: so ? '1) Đào tạo - Bồi dưỡng' : 'Quá trình đào tạo', icon: 'fa-graduation-cap', sections: [daoTao, boiDuong] },
                { key: 'hocvi', text: so ? '2) Học vị' : 'Học vị', icon: 'fa-user-graduate', sections: [hocVi] },
                { key: 'chinhtri', text: so ? '3) Trình độ chính trị' : 'Trình độ chính trị', icon: 'fa-flag', sections: [chinhTri] },
                { key: 'tinhoc', text: so ? '4) Trình độ tin học' : 'Trình độ tin học', icon: 'fa-laptop-code', sections: [tinHoc] },
                { key: 'ngoaingu', text: so ? '5) Trình độ ngoại ngữ' : 'Trình độ ngoại ngữ', icon: 'fa-language', sections: [ngoaiNgu] }
            ]
        });

        /* Bấm công tắc "… hiện tại" của một dòng → chuyển thành trạng thái cuối */
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-cuoi]');
            if (!b || !root.contains(b)) return;
            var ma = b.getAttribute('data-cuoi');
            ui.confirm('Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?', { title: 'Trạng thái cuối' }).then(function (yes) {
                if (!yes) return;
                return ums.ref.quaTrinhCuoiCung(ma).then(function () {
                    var c = ma === 'NHANSU_QT_HOCVI' ? pg.crud('hocvi') : pg.crud('chinhtri');
                    if (c) c.load();
                });
            });
        });
        return pg;
    }

    ums.ccbQtDaoTao = { mount: mount };
    var goc = document.getElementById('quatrinhdaotao');
    if (goc) mount(goc);
})();
