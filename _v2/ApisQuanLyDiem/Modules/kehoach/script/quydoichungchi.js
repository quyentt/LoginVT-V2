/* =========================================================================
   Quy đổi chứng chỉ
   Bản gốc: ApisQuanLyDiem/Modules/kehoach/html/quydoichungchi.html
            + script/quydoichungchi.js (lớp QuyDoiChungChi, vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, hai vùng thay chỗ nhau (zone-bus):
       #zonebatdau  thanh lọc + danh sách quy đổi (cấp độ chứng chỉ)     → ums.crud "chính"
       #zoneChiTiet "Bảng quy đổi chi tiết" của một dòng (nút "Xem")      → ums.crud lồng (embedded)
   Biểu mẫu thêm/sửa của gốc là hộp thoại (#myModal, #myModalChiTiet) → nay thay chỗ danh sách trong
   trang (BO-CUC luật 1).

   Lời gọi — danh sách chính (chép nguyên, GET trừ khi ghi khác):
       D_CongNhanDiem/LaYDSDiem_TT_CC_CapDo       strPhanLoaiCC_Id · strDiem_ThongTin_ChungChi_Id · strDaoTao_HocPhan_Id
       D_CongNhanDiem/LayDSDiem_ThongTin_ChungChi strPhanLoaiCC_Id                         (ô Chứng chỉ — TENCHUNGCHI)
       D_CongNhanDiem/LayDSHocPhan_QuyDoi_CapDo   strPhanLoaiCC_Id · strDiem_ThongTin_ChungChi_Id (ô Học phần — "TEN - MA")
       D_CongNhanDiem/Them_Diem_TT_CC_CapDo  POST  strPhanLoaiCC_Id · strPhanLoaiCC_Ten · strDiem_ThongTin_ChungChi_Id
           · strTenChungChi · strTenCapDo · strPhuongThucQuyDoi_Id · strDiem_CongThucDiem_Id · strGhiChu · dDiemCongNhan
       D_CongNhanDiem/Sua_Diem_TT_CC_CapDo   POST  (như trên) + strId
       D_CongNhanDiem/Xoa_Diem_TT_CC_CapDo         strId (mỗi dòng đã chọn một lời gọi)
       D_CongThucDiem/LayDanhSach  GET   strTuKhoa '' · strDiem_ThanhPhanDiem_Id '' · strMoHinhXuLy_Id '' · pageIndex 1 · pageSize 1000000
       Danh mục: DIEM.CHUNGCHI.PHANLOAI (ô Phân loại, lọc + biểu mẫu) · DIEM.PHUONGTHUCQUYDOI.
   Lời gọi — bảng quy đổi chi tiết:
       D_CongNhanDiem/LayDSDiem_CC_CapDo_QuyDoi_DK  GET  strDiem_ThongTin_CC_CapDo_Id = ID dòng chính
       D_CongNhanDiem/Them_Diem_CC_CapDo_QuyDoi_DK  POST strPhamViApDung_Id (ID hệ / khoá / CT / lớp, dấu phẩy)
           · strDiem_TT_CC_CapDo_Id · strDiem_ThanhPhanDiem_Id · strDaoTao_HocPhan_Id · dCanDuoi · dCanTren · dDiemQuyDoi
           · strDiem_CongThucDiem_Id · dDiemCongNhan · strMoTa '' (txtAAAA)
       D_CongNhanDiem/Sua_Diem_CC_CapDo_QuyDoi_DK   POST (như trên) + strId
       D_CongNhanDiem/Xoa_Diem_CC_CapDo_QuyDoi_DK   strId
       KHCT_HocPhan/LayDanhSach  GET   strTuKhoa '' · strDaoTao_MonHoc_Id '' · strThuocBoMon_Id '' · strThuocTinhHocPhan_Id ''
           · pageIndex 1 · pageSize 1000000                                 (ô Học phần — "TEN - MA")
       D_CongNhanDiem/LayDSThanhPhanDiemTheoCapDo  GET  strDiem_TT_CC_CapDo_Id '' (gốc đọc ô dropAAAA không tồn tại) (ô Đầu điểm)
       Cơ cấu tổ chức (edu.system.getList_CoCauToChuc — ums.ref.coCauToChuc, trạng thái 1)   (ô Đơn vị)
       Phạm vi: hộp chọn sinh viên của Corei (edu.extend.genModal_SinhVien) — "Thêm từng hệ / khóa / chương trình /
           lớp" (nguồn PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc như XLHV kehoachxuly).

   Lỗi gốc đã sửa (làm theo ý định — ghi rõ để kiểm trên host):
     · save_* KHÔNG BAO GIỜ gửi strId (obj_save không có khoá strId) → bấm Sửa rồi Lưu là THÊM MỚI một dòng.
       Nay sửa gửi strId + action Sua_Diem_TT_CC_CapDo / Sua_Diem_CC_CapDo_QuyDoi_DK (tên có sẵn trong gốc) — đường GHI
       mới, kiểm trên host.
     · viewEdit_QuyDoiChungChi đổ ô bằng cột chép từ màn kế hoạch (MA, TENKEHOACH, MOHINHDANGKY_ID, HIEULUC) → mở Sửa
       thì ô Phân loại / Chứng chỉ trống. Nay đọc PHANLOAICC_ID, DIEM_THONGTIN_CHUNGCHI_ID (tên cột ĐOÁN theo tham số
       và theo cột PHANLOAICC_ID của màn kế hoạch — kiểm trên host); hai ô "… mới (chưa có)" để trống khi sửa.
     · Bảng chi tiết: nút Sửa không có xử lý (gốc chỉ gắn .btnEdit cho bảng chính) → nay mở biểu mẫu chi tiết. Thêm /
       xoá chi tiết xong gốc nạp lại DANH SÁCH CHÍNH (bảng chi tiết đứng im) → nay nạp lại bảng chi tiết.
     · Bảng chi tiết: cột "Mã học phần" gốc đổ DAOTAO_HOCPHAN_TEN và "Tên học phần" đổ DAOTAO_HOCPHAN_MA (lệch) → đổi lại.
     · Ô Chứng chỉ của BIỂU MẪU gốc nạp theo ô Phân loại của THANH LỌC (getList_ChungChi đọc dropSearch_PhanLoai) →
       nay theo ô Phân loại của biểu mẫu, nối tầng Phân loại → Chứng chỉ (luật cha → con).
     · Cột "Ghi chú" gốc vẽ nút "Chi tiết" (.btnDSDoiTuong — không có xử lý, chép từ màn khác) → hiện GHICHU.
     · Ô từ khoá thanh lọc gốc KHÔNG gửi đi (lời gọi không có strTuKhoa) → lọc tại chỗ trên dòng đã tải
       (Phân loại, Tên chứng chỉ, Mức độ, Công thức, Phương thức, Ghi chú).
     · "Thêm từng hệ" gốc kiểm nhầm me.arrKhoa (luôn rỗng lúc đó) nên không bao giờ nhận hệ → nay nhận.
       Phạm vi gốc CỘNG DỒN mỗi lần bấm nhưng nhãn chỉ hiện lần cuối → nay hiện đủ.
   Giữ như gốc (nghi ngờ — ghi sổ): ô Đơn vị của biểu mẫu chi tiết không được gửi đi; ô "Đầu điểm" nạp một lần với
   cấp độ rỗng; tiêu đề khung "Danh sách kế hoạch" (chép từ màn kế hoạch) đổi thành "Danh sách quy đổi chứng chỉ".
   Cố ý bỏ: nhãn trùng "Đầu điểm" (#dropDauDiem xuất hiện hai lần trong hộp gốc), các khối ô trùng id trong hộp
   #myModal, hộp #modal_nhansu / #modal_sinhvien_kehoach (không nút nào mở), arrValid (ô không tồn tại).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var host = document.getElementById('qld-quydoicc');
    if (!host) return;
    var C = 'D_CongNhanDiem/';

    function e(v) { return v === undefined || v === null ? '' : v; }
    function ds(r) { var d = r && r.data; return Array.isArray(d) ? d : []; }
    function boDau(x) { return String(e(x)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function dat(el, v) {
        if (!el) return;
        el.value = e(v);
        if (window.jQuery) jQuery(el).trigger('change.select2');
    }

    host.innerHTML = '<div data-z="main"></div><div data-z="ct" hidden></div>';
    var zMain = host.querySelector('[data-z="main"]'), zCT = host.querySelector('[data-z="ct"]');

    var CONG_THUC = { call: { action: 'D_CongThucDiem/LayDanhSach', method: 'GET', strTuKhoa: '', strDiem_ThanhPhanDiem_Id: '', strMoHinhXuLy_Id: '',
        strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }, id: 'ID', name: 'TEN' };

    /* =====================================================================
       Danh sách quy đổi (cấp độ chứng chỉ)
       ===================================================================== */
    var main = ums.crud({
        root: zMain,
        title: 'Quy đổi chứng chỉ', formTitle: 'quy đổi chứng chỉ', icon: 'fa-certificate',
        listTitle: 'Danh sách quy đổi chứng chỉ',
        filters: [
            { key: 'pl', type: 'select', label: '', source: { dm: 'DIEM.CHUNGCHI.PHANLOAI' } },
            { key: 'cc', type: 'select', label: 'Chọn chứng chỉ' },
            { key: 'hp', type: 'select', label: 'Chọn học phần' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            call: function (f) {
                return { action: C + 'LaYDSDiem_TT_CC_CapDo', method: 'GET', type: 'GET',
                    strPhanLoaiCC_Id: f.pl, strDiem_ThongTin_ChungChi_Id: f.cc, strDaoTao_HocPhan_Id: f.hp, strNguoiThucHien_Id: '' };
            },
            rows: function (d) {
                var rows = Array.isArray(d) ? d : [];
                var q = boDau(main ? main.filterValues().q : '').trim();
                if (!q) return rows;
                return rows.filter(function (r) {
                    return ['PHANLOAICC_TEN', 'TENCHUNGCHI', 'TENCAPDO', 'CONGTHUCTINHDIEM', 'PHUONGTHUCQUYDOI_TEN', 'GHICHU']
                        .some(function (k) { return boDau(r[k]).indexOf(q) >= 0; });
                });
            }
        },
        columns: [
            { title: 'Phân loại chứng chỉ', prop: 'PHANLOAICC_TEN', cls: 'is-center' },
            { title: 'Tên chứng chỉ', prop: 'TENCHUNGCHI' },
            { title: 'Mức độ', prop: 'TENCAPDO', cls: 'is-center' },
            { title: 'Công thức tính', prop: 'CONGTHUCTINHDIEM', cls: 'is-center' },
            { title: 'Phương thức quy đổi', prop: 'PHUONGTHUCQUYDOI_TEN', cls: 'is-center' },
            { title: 'Bảng quy đổi chi tiết', cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('view', { text: 'Xem', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-qdcc-ct': e(r.ID) } });
            } },
            { title: 'Ghi chú', prop: 'GHICHU' }
        ],
        rowDelete: false,
        fields: [
            { key: 'strPhanLoaiCC_Id', label: 'Phân loại chứng chỉ', type: 'select', source: { dm: 'DIEM.CHUNGCHI.PHANLOAI' }, get: function (r) { return r.PHANLOAICC_ID; } },
            { key: 'strPhanLoaiCC_Ten', label: 'Phân loại chứng chỉ mới(chưa có)', get: function () { return ''; } },
            { key: 'strDiem_ThongTin_ChungChi_Id', label: 'Chứng chỉ', type: 'select', placeholder: 'Chọn chứng chỉ', get: function (r) { return r.DIEM_THONGTIN_CHUNGCHI_ID; } },
            { key: 'strTenChungChi', label: 'Chứng chỉ mới(chưa có)', get: function () { return ''; } },
            { key: 'strTenCapDo', label: 'Mức độ', col: 'TENCAPDO' },
            { key: 'strDiem_CongThucDiem_Id', label: 'Công thức tính', type: 'select', placeholder: 'Chọn công thức', source: CONG_THUC, col: 'DIEM_CONGTHUCDIEM_ID' },
            { key: 'strPhuongThucQuyDoi_Id', label: 'Phương thức quy đổi', type: 'select', source: { dm: 'DIEM.PHUONGTHUCQUYDOI' }, col: 'PHUONGTHUCQUYDOI_ID' },
            { key: 'dDiemCongNhan', label: 'Điểm công nhận trực tiếp', type: 'number', col: 'DIEMCONGNHAN' },
            { key: 'strGhiChu', label: 'Ghi chú', col: 'GHICHU', span: true }
        ],
        save: function (v, row) {
            var c = { action: C + 'Them_Diem_TT_CC_CapDo', type: 'POST', method: 'POST',
                strPhanLoaiCC_Id: v.strPhanLoaiCC_Id, strPhanLoaiCC_Ten: v.strPhanLoaiCC_Ten,
                strDiem_ThongTin_ChungChi_Id: v.strDiem_ThongTin_ChungChi_Id, strTenChungChi: v.strTenChungChi,
                strTenCapDo: v.strTenCapDo, strPhuongThucQuyDoi_Id: v.strPhuongThucQuyDoi_Id,
                strDiem_CongThucDiem_Id: v.strDiem_CongThucDiem_Id, strGhiChu: v.strGhiChu,
                dDiemCongNhan: v.dDiemCongNhan, strNguoiThucHien_Id: '' };
            if (row) { c.action = C + 'Sua_Diem_TT_CC_CapDo'; c.strId = row.ID; }
            return c;
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: C + 'Xoa_Diem_TT_CC_CapDo', strId: id, strNguoiThucHien_Id: '' }; });
        },
        onForm: function (row) { moFormChinh(row); }
    });

    function fEl(crud, scope, key) {
        return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="' + scope + '"][data-k="' + key + '"]');
    }

    /* ---------- Thanh lọc: Phân loại → Chứng chỉ; Học phần theo cả hai (lọc tuỳ chọn) ---------------- */
    var lPL = fEl(main, 'filter', 'pl'), lCC = fEl(main, 'filter', 'cc'), lHP = fEl(main, 'filter', 'hp');
    function napCC(sel, pl) {
        return ums.api.call({ action: C + 'LayDSDiem_ThongTin_ChungChi', method: 'GET', type: 'GET', strPhanLoaiCC_Id: pl, strNguoiThucHien_Id: '' })
            .then(function (r) { pat.fill(sel, ds(r), { name: 'TENCHUNGCHI', head: 'Chọn chứng chỉ' }); })
            .catch(function (err) { ums.api.handle(err, 'chứng chỉ'); });
    }
    function napHP() {
        return ums.api.call({ action: C + 'LayDSHocPhan_QuyDoi_CapDo', method: 'GET', type: 'GET',
            strPhanLoaiCC_Id: lPL.value, strDiem_ThongTin_ChungChi_Id: lCC.value, strNguoiThucHien_Id: '' })
            .then(function (r) { pat.fill(lHP, ds(r), { head: 'Chọn học phần', name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); } }); })
            .catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    if (window.jQuery) {
        jQuery(lPL).on('select2:select select2:clear', function () {
            if (lPL.value) napCC(lCC, lPL.value); else pat.fill(lCC, [], { head: 'Chọn chứng chỉ' });
            napHP();
        });
        jQuery(lCC).on('select2:select select2:clear', napHP);
    }
    pat.chain([lPL, lCC], { phatLai: false });
    napHP();

    /* Báo cáo: vùng #zonebtnBaoCao_QuyDoiChungChi của gốc (gốc chưa nạp mẫu nào vào — gắn chung, không khai mẫu thì ẩn) */
    var locRow = zMain.querySelector('.ums-filter');
    if (locRow) {
        locRow.insertAdjacentHTML('beforeend', '<div class="ums-field ums-field--fit" data-z="bc"></div>');
        ums.report.mount(locRow.querySelector('[data-z="bc"]'), { collect: function () {} });
    }

    /* ---------- Biểu mẫu chính: Phân loại → Chứng chỉ ------------------------------------------------ */
    var bPL = fEl(main, 'form', 'strPhanLoaiCC_Id'), bCC = fEl(main, 'form', 'strDiem_ThongTin_ChungChi_Id');
    if (window.jQuery) jQuery(bPL).on('select2:select select2:clear', function () {
        if (bPL.value) napCC(bCC, bPL.value); else pat.fill(bCC, [], { head: 'Chọn chứng chỉ' });
    });
    var chainForm = pat.chain([bPL, bCC], { phatLai: false });
    function moFormChinh(row) {
        var cc = row ? row.DIEM_THONGTIN_CHUNGCHI_ID : '';
        var p = bPL.value ? napCC(bCC, bPL.value) : Promise.resolve(pat.fill(bCC, [], { head: 'Chọn chứng chỉ' }));
        p.then(function () { dat(bCC, cc); chainForm.sync(); });
    }

    /* =====================================================================
       Bảng quy đổi chi tiết
       ===================================================================== */
    var capDo = null;           // dòng chính đang xem
    var phamVi = [], phamViTen = [];

    var ct = ums.crud({
        root: zCT, embedded: true, autoload: false,
        title: 'Bảng quy đổi chi tiết', formTitle: 'quy đổi chi tiết', icon: 'fa-table-list',
        back: function () { ui.swap(zCT, zMain); main.load(); },
        list: {
            call: function () {
                if (!capDo) return null;
                return { action: C + 'LayDSDiem_CC_CapDo_QuyDoi_DK', method: 'GET', type: 'GET',
                    strDiem_ThongTin_CC_CapDo_Id: capDo.ID, strNguoiThucHien_Id: '' };
            }
        },
        columns: [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
            { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Đầu điểm', prop: 'DIEM_THANHPHANDIEM_TEN', cls: 'is-center' },
            { title: 'Cận dưới', prop: 'CANDUOI', cls: 'is-center' },
            { title: 'Cận trên', prop: 'CANTREN', cls: 'is-center' },
            { title: 'Điểm công nhận', prop: 'DIEMCONGNHAN', cls: 'is-center' },
            { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
            { title: 'Mức nhóm điều kiện', prop: 'MUCNHOMDIEUKIEN', cls: 'is-center' },
            { title: 'Loại kiểm tra', prop: 'LOAIKIEMTRA' },
            { title: 'Ghi chú', prop: 'GHICHU' }
        ],
        rowDelete: false,
        fields: [
            { key: 'donVi', label: 'Đơn vị', type: 'select', placeholder: 'Chọn đơn vị', col: 'MA' },
            { key: 'strDaoTao_HocPhan_Id', label: 'Học phần', type: 'select', placeholder: 'Chọn học phần', col: 'DAOTAO_HOCPHAN_ID',
              source: { call: { action: 'KHCT_HocPhan/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_MonHoc_Id: '', strThuocBoMon_Id: '',
                  strThuocTinhHocPhan_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 },
                  id: 'ID', name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); } } },
            { key: 'strDiem_ThanhPhanDiem_Id', label: 'Đầu điểm', type: 'select', placeholder: 'Chọn đầu điểm', col: 'DIEM_THANHPHANDIEM_ID',
              source: { call: { action: C + 'LayDSThanhPhanDiemTheoCapDo', method: 'GET', type: 'GET', strDiem_TT_CC_CapDo_Id: '', strNguoiThucHien_Id: '' }, id: 'ID', name: 'TEN' } },
            { key: 'dCanDuoi', label: 'Cận dưới', type: 'number', col: 'CANDUOI' },
            { key: 'dCanTren', label: 'Cận trên', type: 'number', col: 'CANTREN' },
            { key: 'dDiemQuyDoi', label: 'Điểm quy đổi', type: 'number', col: 'DIEMQUYDOI' },
            { key: 'dDiemCongNhan', label: 'Điểm công nhận', type: 'number', col: 'DIEMCONGNHAN' },
            { key: 'strDiem_CongThucDiem_Id', label: 'Công thức tính', type: 'select', placeholder: 'Chọn công thức', source: CONG_THUC, col: 'DIEM_CONGTHUCDIEM_ID' }
        ],
        save: function (v, row) {
            var c = { action: C + 'Them_Diem_CC_CapDo_QuyDoi_DK', type: 'POST', method: 'POST',
                strPhamViApDung_Id: phamVi.join(','), strDiem_TT_CC_CapDo_Id: capDo ? capDo.ID : '',
                strDiem_ThanhPhanDiem_Id: v.strDiem_ThanhPhanDiem_Id, strDaoTao_HocPhan_Id: v.strDaoTao_HocPhan_Id,
                dCanDuoi: v.dCanDuoi, dCanTren: v.dCanTren, dDiemQuyDoi: v.dDiemQuyDoi,
                strDiem_CongThucDiem_Id: v.strDiem_CongThucDiem_Id, dDiemCongNhan: v.dDiemCongNhan,
                strMoTa: '', strNguoiThucHien_Id: '' };
            if (row) { c.action = C + 'Sua_Diem_CC_CapDo_QuyDoi_DK'; c.strId = row.ID; }
            return c;
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: C + 'Xoa_Diem_CC_CapDo_QuyDoi_DK', strId: id, strNguoiThucHien_Id: '' }; });
        },
        onForm: function (row, crud, extra) {
            phamVi = []; phamViTen = [];
            extra.innerHTML = pat.panel({
                title: 'Phạm vi công nhận', icon: 'fa-users-viewfinder',
                tools: ui.btn('add', { text: 'Chọn', mod: 'out-success', attr: { 'data-qdcc': 'pv' } }),
                body: '<div class="ums-u-muted" data-qdcc="pvten">' + esc(row ? e(row.PHAMVIAPDUNG_TEN) : '') + '</div>'
            });
        }
    });

    /* Ô Đơn vị (edu.system.getList_CoCauToChuc — gốc nạp nhưng KHÔNG gửi khi lưu) */
    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
        .then(function (d) { pat.fill(fEl(ct, 'form', 'donVi'), d, { head: 'Chọn đơn vị', name: 'TEN' }); })
        .catch(function (err) { ums.api.handle(err, 'đơn vị'); });

    function chonPhamVi() {
        var NHAN = { he: 'hệ', khoa: 'khóa', ct: 'chương trình', lop: 'lớp' };
        function nhom(kind) {
            return function (ids, params, dlg) {
                var arr = ids ? String(ids).split(',') : [];
                if (!arr.length) return;
                var s = dlg.body.querySelector('[data-f="' + kind + '"]');
                var names = s ? Array.prototype.filter.call(s.options, function (x) { return x.selected && x.value; }).map(function (x) { return x.text; }) : [];
                phamVi = phamVi.concat(arr);
                phamViTen.push('Áp dụng cho ' + NHAN[kind] + ': ' + names.join(', '));
                ui.toast('Áp dụng cho ' + NHAN[kind] + ': ' + names.join(', '), 'ok');
                var lbl = zCT.querySelector('[data-qdcc="pvten"]');
                if (lbl) lbl.innerHTML = phamViTen.map(function (t) { return '<div>' + esc(t) + '</div>'; }).join('');
                dlg.close();
            };
        }
        var dlg = pat.pickSinhVien({
            filters: true,
            status: function (el) { return pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3, what: 'trạng thái sinh viên' }); },
            call: function (p, page, size) {
                return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                    strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: '',
                    strDaoTao_HeDaoTao_Id: p.strHeDaoTao_Id, strDaoTao_KhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                    strDaoTao_ChuongTrinh_Id: p.strChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: p.strLopQuanLy_Id,
                    strStudyStatus_Ids: p.strTrangThaiNguoiHoc_Id, dIsPrimary: '', dBoQuaPhamVi: '', pageIndex: page, pageSize: size };
            },
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc((e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim()); } },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' }
            ],
            group: { khoa: nhom('khoa'), chuongTrinh: nhom('ct'), lop: nhom('lop') },
            onPick: function () { ui.toast('Phạm vi công nhận chỉ nhận theo hệ / khóa / chương trình / lớp (như bản gốc).', 'warn'); }
        });
        /* "Thêm từng hệ" (#btnAdd_He của gốc) — hộp chung chưa có, chèn vào đầu hàng "Thêm nhiều" */
        var g = dlg.body.querySelector('[data-g]');
        if (g) {
            g.insertAdjacentHTML('beforebegin', '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-xg="he">' +
                '<i class="fa-light fa-plus"></i><span>Thêm từng hệ</span></button>');
            dlg.body.addEventListener('click', function (ev) {
                if (!ev.target.closest('[data-xg="he"]')) return;
                nhom('he')(pat.val(dlg.body.querySelector('[data-f="he"]')), null, dlg);
            });
        }
    }

    /* ---------- Sự kiện chung ------------------------------------------------ */
    host.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-qdcc-ct]');
        if (b && zMain.contains(b)) {
            var id = b.getAttribute('data-qdcc-ct');
            capDo = main.rows.filter(function (r) { return String(r.ID) === id; })[0] || null;
            if (!capDo) return;
            if (!ct.z('form').hidden) ct.showList();
            ui.swap(zMain, zCT);
            ct.rows = [];
            ct.load(1);
            return;
        }
        var p = ev.target.closest('[data-qdcc="pv"]');
        if (p && zCT.contains(p)) chonPhamVi();
    });
})();
