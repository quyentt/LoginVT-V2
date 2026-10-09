/* =========================================================================
   Dữ liệu (Luận án) — khối lượng hoạt động luận án của từng cán bộ theo học kỳ
   Bản gốc: ApisLuanVanLuanAn/Modules/luanan/script/dulieu.js (572 dòng) + html/dulieu.html (204 dòng)
   ---------------------------------------------------------------------------
   Bố cục gốc một cột: ô từ khoá + nút Import theo mẫu (getList_MauImport "zonebtnLVLA") → bảng #tblDuLieu
   → khung #zone_input_DuLieu (ẩn/hiện) thêm / sửa. Bản mới: ums.crud, biểu mẫu thay chỗ danh sách.

   Lời gọi (action kiểu cũ, không mã hoá) — tên tham số chép nguyên văn:
       LVLA_DuLieu/LayDanhSach   GET   strTuKhoa, strPhanLoaiDoiTuong_Id, strDaoTao_ThoiGianDaoTao_Id, strHoatDong_Id,
                                       strNhanSu_HoSoCanBo_Id, strNguoiTao_Id, pageIndex, pageSize
                                       (gốc: 5 tham số lọc đọc từ ô KHÔNG có trong HTML → luôn rỗng; giữ gửi rỗng)
       LVLA_DuLieu/ThemMoi | CapNhat  POST  strId, strNhanSu_HoSoCanBo_Id, strDaoTao_ThoiGianDaoTao_Id, dSoGio, dSoGioChuan,
                                       strPhanLoaiDoiTuong_Id, strHoatDong_Id, strNgayBatDau, strNgayKetThuc, strGhiChu
       LVLA_DuLieu/Xoa           POST  strIds
       NS_HoSoV2/LayDanhSach     GET   strTuKhoa '', pageIndex 1, pageSize 100000, strDaoTao_CoCauToChuc_Id = Đơn vị, dLaCanBoNgoaiTruong 0
                                       (ô Cán bộ; chữ hiện "HOTEN - MASO" như gốc)
       Đơn vị: edu.system.getList_CoCauToChuc → cùng lời gọi ums.ref.coCauToChuc (pkg_nhansu_hoso_v2.LayDanhSachToanBo)
       Thời gian: KHCT_ThoiGianDaoTao/LayDanhSach (GET, gốc không truyền gì)
       Danh mục chung: KLGD.HOATDONG (Hoạt động), KHDT.PHANLOAIDOITUONGDAOTAO (Đối tượng) → ums.api.dm
   Sửa: gốc không có LayChiTiet — điền từ dòng đang chọn (HOATDONG_ID, DONVI_ID, NHANSU_HOSOCANBO_ID, DAOTAO_THOIGIANDAOTAO_ID,
        PHANLOAIDOITUONG_ID, SOGIO, SOGIOCHUAN, NGAYBATDAU, NGAYKETTHUC, GHICHU).

   Khác gốc:
     · Thêm kiểm bắt buộc Hoạt động / Đơn vị / Cán bộ / Thời gian / Số giờ (gốc gửi thẳng, không kiểm) — luật (A) CLAUDE.md mục 9.
       Đơn vị bắt buộc vì Cán bộ bắt buộc mà chỉ chọn được sau khi có Đơn vị (cha → con).
     · Đơn vị → Cán bộ: chưa chọn đơn vị thì khoá ô Cán bộ, đổi / xoá đơn vị thì xoá trắng (luật cha → con 2026-09-21).
     · Ô Hệ đào tạo trong biểu mẫu: gốc đã chú thích bỏ (<!-- -->) → không dựng; cột "Hệ đào tạo" của bảng vẫn hiện.
   Cố ý bỏ (mã chết của gốc): dropSearch_DoiTuong / dropSearch_ThoiGian / dropSearch_HoatDong / dropAAAA / btnYes /
     dropSearch_CapNhat_BoMon / dropSearch_KeHoach / dropSearch_KhoiTao_CCTC — không có trong HTML.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, P = 'LVLA_DuLieu/';
    var root = document.getElementById('dulieu');

    function e(v) { return v == null ? '' : String(v); }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }

    var TGDT = { call: { action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET' }, name: 'DAOTAO_THOIGIANDAOTAO' };
    /* Cùng lời gọi của ums.ref.coCauToChuc (ref.js) — crud chỉ nhận object lời gọi nên chép tham số ở đây. */
    var CCTC = { call: { action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
                         dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' }, name: 'TEN' };

    var crud = ums.crud({
        root: root,
        title: 'Dữ liệu', listTitle: 'Danh sách', formTitle: 'dữ liệu', icon: 'fa-table-list',
        multi: true,

        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],

        list: { paged: true, call: function (f) {
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strPhanLoaiDoiTuong_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: '', strHoatDong_Id: '', strNhanSu_HoSoCanBo_Id: '', strNguoiTao_Id: '' };
        } },

        columns: [
            { title: 'Hoạt động', prop: 'HOATDONG_TEN' },
            { title: 'Hệ đào tạo', prop: 'HEDAOTAO_TEN' },
            { title: 'Mã cán bộ', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc((e(r.NHANSU_HOSOCANBO_HODEM) + ' ' + e(r.NHANSU_HOSOCANBO_TEN)).trim()); } },
            { title: 'Học kỳ', cls: 'is-center is-nowrap', render: function (r) {
                return esc(e(r.DAOTAO_THOIGIANDAOTAO_NAM) + '_' + e(r.DAOTAO_THOIGIANDAOTAO_KY) + '_' + e(r.DAOTAO_THOIGIANDAOTAO_DOT)); } },
            { title: 'Số giờ', prop: 'SOGIO', cls: 'is-center' },
            { title: 'Số giờ chuẩn', prop: 'SOGIOCHUAN', cls: 'is-center' },
            { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
            { title: 'Mô tả', prop: 'GHICHU' }
        ],

        fields: [
            { key: 'strHoatDong_Id', col: 'HOATDONG_ID', label: 'Hoạt động', type: 'select', required: true, placeholder: 'Chọn hoạt động', source: { dm: 'KLGD.HOATDONG' } },
            { key: 'donVi', col: 'DONVI_ID', label: 'Đơn vị', type: 'select', required: true, placeholder: 'Chọn đơn vị', source: CCTC },   // không gửi lên; chỉ để lọc Cán bộ
            { key: 'strNhanSu_HoSoCanBo_Id', col: 'NHANSU_HOSOCANBO_ID', label: 'Cán bộ', type: 'select', required: true, placeholder: 'Chọn cán bộ', source: { items: [] } },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select', required: true, placeholder: 'Chọn thời gian', source: TGDT },
            { key: 'strPhanLoaiDoiTuong_Id', col: 'PHANLOAIDOITUONG_ID', label: 'Đối tượng', type: 'select', placeholder: 'Chọn đối tượng', source: { dm: 'KHDT.PHANLOAIDOITUONGDAOTAO' } },
            { key: 'dSoGio', col: 'SOGIO', label: 'Số giờ', type: 'number', required: true },
            { key: 'dSoGioChuan', col: 'SOGIOCHUAN', label: 'Số giờ chuẩn', type: 'number' },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày kết thúc', type: 'date' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Mô tả', type: 'textarea', span: true }
        ],

        save: function (v, row) {
            return { action: P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? e(row.ID) : '',
                strNhanSu_HoSoCanBo_Id: v.strNhanSu_HoSoCanBo_Id, strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                dSoGio: v.dSoGio, dSoGioChuan: v.dSoGioChuan, strPhanLoaiDoiTuong_Id: v.strPhanLoaiDoiTuong_Id, strHoatDong_Id: v.strHoatDong_Id,
                strNgayBatDau: v.strNgayBatDau, strNgayKetThuc: v.strNgayKetThuc, strGhiChu: v.strGhiChu };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); },

        onForm: function (row, c) { noiDonViCanBo(row, c); }
    });

    /* ---------- Đơn vị → Cán bộ (NS_HoSoV2/LayDanhSach theo đơn vị) ---------- */
    function noiDonViCanBo(row, c) {
        var form = c.z('form');
        var oDV = form.querySelector('[data-k="donVi"]'), oCB = form.querySelector('[data-k="strNhanSu_HoSoCanBo_Id"]');
        if (!oDV || !oCB) return;

        function doCanBo(dvId, chon) {
            if (!dvId) { oCB.innerHTML = '<option value="">Chọn cán bộ</option>'; lamTuoi(oCB); return Promise.resolve(); }
            return ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', silent: true, strTuKhoa: '', pageIndex: 1, pageSize: 100000,
                strDaoTao_CoCauToChuc_Id: dvId, dLaCanBoNgoaiTruong: 0 })
                .then(function (r) {
                    var rows = arr(r.data).map(function (x) { return { ID: x.ID, TEN: e(x.HOTEN) + ' - ' + e(x.MASO) }; });
                    oCB.innerHTML = ui.options(rows, { title: 'Chọn cán bộ' });
                    if (chon) oCB.value = chon;
                    lamTuoi(oCB);
                })
                .catch(function (err) { ums.api.handle(err, 'danh sách cán bộ'); });
        }
        function lamTuoi(el) { if (window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh'); }

        /* Bẫy jQuery (CLAUDE.md mục 11, 6/10): trigger('change.select2') CHỈ gọi handler có namespace select2 → phải nghe cả
           'change' trơn (người chọn) lẫn 'change.select2' (mã đặt giá trị: thu-crud, pat.chain, lamTuoi). */
        var truoc = oDV.value;
        function doiDonVi() {
            if (oDV.value === truoc) return;
            truoc = oDV.value;
            doCanBo(oDV.value, '');
        }
        if (window.jQuery) jQuery(oDV).off('.lvla').on('change.lvla change.select2.lvla select2:clear.lvla', doiDonVi);
        else oDV.addEventListener('change', doiDonVi);

        pat.chain([oDV, oCB]);
        if (row) {
            /* Sửa: crud đã đặt Đơn vị từ DONVI_ID; nạp cán bộ của đơn vị đó rồi chọn người của dòng (gốc: getList_HS(data.NHANSU_HOSOCANBO_ID)). */
            truoc = oDV.value;
            if (oDV.value) doCanBo(oDV.value, e(row.NHANSU_HOSOCANBO_ID));
        }
    }

    /* ---------- Nút Import theo mẫu ở đầu khung danh sách (gốc getList_MauImport "zonebtnLVLA") ---------- */
    (function ganImport() {
        var tools = root.querySelector('.ums-panel__tools');
        if (!tools || !ums.report || !ums.report.mount) return;
        var host = document.createElement('span');
        tools.insertBefore(host, tools.firstChild);
        ums.report.mount(host, { collect: function () { }, onImported: function () { crud.load(1); } });
    })();
})();
