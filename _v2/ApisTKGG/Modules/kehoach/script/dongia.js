/* =========================================================================
   Khai đơn giá tính tiền (Thống kê giờ giảng → Tổng hợp giờ)
   Bản gốc: ApisTKGG/Modules/kehoach/html/dongia.html + script/dongia.js (702 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc, hai khối xếp dọc: (1) Đơn giá áp dụng theo kế hoạch — thanh lọc Thời gian → KH tổng hợp → KH chi tiết
   (ums.tkgg.boLocKeHoach họ 'ma') + Đơn vị tính + Danh mục đơn giá + từ khoá, bảng, biểu mẫu trong trang; (2) Danh mục khai
   đơn giá — bảng + biểu mẫu trong trang (gốc: hai modal "Hệ số"). Hai khối dựng bằng hai ums.crud lồng trong trang.

   Lời gọi (POST mã hoá, có func):
       NS_KLGD_KeHoach_MH … LayDSThoiGianTongHopKL / LayDSKLGD_TongHopKhoiLuong / LayDSKLGD_KeHoachChiTiet   (bộ lọc — _tkgg.js)
       Danh mục KLGD.DONVITINH.APDONGIA (Đơn vị tính), KLGD.PHANLOAI.DANHMUCAPDONGIA (Phân loại danh mục)
       NS_KLGD_TinhTien_MH/DSA4BRIKDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP  PKG_KLGV_V2_TINHTIEN.LayDSKLGD_DanhMucApDonGia_Ad
           strTuKhoa, strPhamViApDung_Id (= KH chi tiết nếu chọn, không thì KH tổng hợp), strDaoTao_ThoiGianDaoTao_Id, strKLGD_DanhMucApDonGia_Id, strDonViTinh_Id, dHieuLuc ''
       NS_KLGD_TinhTien_MH/FSkkLB4KDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP  …Them_KLGD_DanhMucApDonGia_Ad | EjQgHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl …Sua_… khi có strId
           strId, strKLGD_DanhMucApDonGia_Id, strDaoTao_ThoiGianDaoTao_Id (= ô lọc Thời gian), strDonViTinh_Id, strPhamViApDung_Id (như trên), dDonGia, dHieuLuc 1, strMoTa
       NS_KLGD_TinhTien_MH/GS4gHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl  …Xoa_KLGD_DanhMucApDonGia_Ad  strId — mỗi dòng một lời gọi
       NS_KLGD_TinhTien_MH/DSA4BRIKDQYFHgUgLykMNCIAMQUuLwYoIAPP      …LayDSKLGD_DanhMucApDonGia     (danh mục — cũng là nguồn ô "Danh mục khai đơn giá")
       NS_KLGD_TinhTien_MH/FSkkLB4KDQYFHgUgLykMNCIAMQUuLwYoIAPP      …Them_KLGD_DanhMucApDonGia | EjQgHgoNBgUeBSAvKQw0IgAxBS4vBigg …Sua_…  strId, strPhanLoai_Id, strMa, strTen, strMoTa, dHieuLuc
       NS_KLGD_TinhTien_MH/GS4gHgoNBgUeBSAvKQw0IgAxBS4vBigg          …Xoa_KLGD_DanhMucApDonGia  strId
   Giữ như gốc: đơn giá không phân trang; sửa đọc từ dòng (không LayChiTiet); dHieuLuc đơn giá luôn 1.
   Khác gốc (lỗi rõ ràng):
     · Nhãn "Phạm vi áp dụng" trong biểu mẫu gốc đọc `option:seleted` (sai chính tả → luôn trống) → hiện tên kế hoạch đang chọn.
     · Gốc cho Thêm đơn giá khi chưa chọn kế hoạch nào (strPhamViApDung_Id rỗng) → ở đây chặn, báo chọn kế hoạch tổng hợp trước.
     · Cột Hiệu lực của bảng đơn giá gốc in số 1/0 → hiện chữ "Hết hiệu lực" khi 0 (như bảng danh mục).
     · Xoá nhiều: hỏi một lần, chạy tuần tự có tiến độ (gốc gắn chồng #btnYes). Lưu / xoá danh mục xong nạp lại ô chọn danh mục của khối trên.
   Cố ý bỏ: ô ẩn dropThoiGian (gốc đổ cùng dữ liệu nhưng không có trên màn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var root = document.getElementById('tkgg-dongia');
    if (!root) return;
    function e(v) { return T.e(v); }
    var TT = 'NS_KLGD_TinhTien_MH/';
    var DM_CALL = { action: TT + 'DSA4BRIKDQYFHgUgLykMNCIAMQUuLwYoIAPP', func: 'PKG_KLGV_V2_TINHTIEN.LayDSKLGD_DanhMucApDonGia' };

    root.innerHTML = pat.page('Khai đơn giá tính tiền', '') +
        '<div class="ums-u-mb-4" data-z="loc"></div>' +
        '<div data-z="dg"></div>' +
        '<div class="ums-u-mt-5" data-z="dm"></div>';
    var zLoc = root.querySelector('[data-z="loc"]');
    zLoc.innerHTML = pat.panel({ title: 'Tìm kiếm', icon: 'fa-magnifying-glass', body: '<div class="ums-grid ums-grid--3" data-z="kh"></div>' });
    var bl = T.boLocKeHoach(zLoc.querySelector('[data-z="kh"]'), { loai: 'ma', muc: 3, onDoi: function () { crudDG.load(); } });
    function phamVi() { return bl.v('ct') || bl.v('th'); }
    function tenPhamVi() { var k = bl.v('ct') ? 'ct' : 'th', s = bl.el(k); return s && s.value ? s.options[s.selectedIndex].text : ''; }

    var crudDG = ums.crud({
        root: root.querySelector('[data-z="dg"]'), embedded: true,
        listTitle: 'Danh sách đơn giá áp dụng', formTitle: 'đơn giá', icon: 'fa-money-bill',
        autoload: false,
        filters: [
            { key: 'dvt', type: 'select', label: 'Chọn đơn vị tính', source: { dm: 'KLGD.DONVITINH.APDONGIA' } },
            { key: 'dm', type: 'select', label: 'Chọn danh mục đơn giá', source: { call: DM_CALL, name: 'TEN' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: { call: function (f) {
            return { action: TT + 'DSA4BRIKDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP', func: 'PKG_KLGV_V2_TINHTIEN.LayDSKLGD_DanhMucApDonGia_Ad',
                strTuKhoa: e(f.q), strPhamViApDung_Id: phamVi(), strDaoTao_ThoiGianDaoTao_Id: bl.v('tg'), strKLGD_DanhMucApDonGia_Id: e(f.dm), strDonViTinh_Id: e(f.dvt), dHieuLuc: '' };
        } },
        columns: [
            { title: 'Danh mục khai đơn giá', prop: 'KLGD_DANHMUCAPDONGIA_TEN' },
            { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.DONGIA); } },
            { title: 'Đơn vị tính', prop: 'DONVITINH_TEN', cls: 'is-center' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return String(r.HIEULUC) === '0' ? ui.badge('Hết hiệu lực', 'mute') : ''; } },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' }
        ],
        fields: [
            { key: 'strKLGD_DanhMucApDonGia_Id', col: 'KLGD_DANHMUCAPDONGIA_ID', label: 'Danh mục khai đơn giá', type: 'select', required: true, source: { call: DM_CALL, name: 'TEN' } },
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', source: { dm: 'KLGD.DONVITINH.APDONGIA' } },
            { key: 'dDonGia', col: 'DONGIA', label: 'Đơn giá', type: 'number', required: true },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' },
            { key: '_pv', type: 'static', label: 'Phạm vi áp dụng' }
        ],
        onForm: function () { var st = root.querySelector('[data-z="dg"] [data-scope="form"][data-k="_pv"]'); if (st) st.textContent = tenPhamVi() || '(chưa chọn kế hoạch ở thanh tìm kiếm)'; },
        save: function (v, row) {
            if (!phamVi()) { ui.toast('Chọn kế hoạch tổng hợp (và kế hoạch chi tiết nếu có) ở thanh tìm kiếm trước khi khai đơn giá', 'warn'); return null; }
            return { action: TT + (row ? 'EjQgHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl' : 'FSkkLB4KDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP'),
                func: 'PKG_KLGV_V2_TINHTIEN.' + (row ? 'Sua_KLGD_DanhMucApDonGia_Ad' : 'Them_KLGD_DanhMucApDonGia_Ad'), method: 'POST',
                strId: row ? row.ID : '', strKLGD_DanhMucApDonGia_Id: v.strKLGD_DanhMucApDonGia_Id, strDaoTao_ThoiGianDaoTao_Id: bl.v('tg'),
                strDonViTinh_Id: v.strDonViTinh_Id, strPhamViApDung_Id: phamVi(), dDonGia: v.dDonGia, dHieuLuc: 1, strMoTa: v.strMoTa };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: TT + 'GS4gHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl', func: 'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia_Ad', method: 'POST', strId: id }; }); }
    });
    bl.sanSang.then(function () { crudDG.load(); });

    var crudDM = ums.crud({
        root: root.querySelector('[data-z="dm"]'), embedded: true,
        listTitle: 'Danh mục khai đơn giá', formTitle: 'danh mục đơn giá', icon: 'fa-list',
        list: { call: function () { return Object.assign({}, DM_CALL); } },
        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' }, { title: 'Tên', prop: 'TEN' }, { title: 'Phân loại', prop: 'PHANLOAI_TEN' }, { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return r.HIEULUC && String(r.HIEULUC) !== '0' ? '' : ui.badge('Hết hiệu lực', 'mute'); } }
        ],
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã', required: true },
            { key: 'strTen', col: 'TEN', label: 'Tên', required: true },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', source: { dm: 'KLGD.PHANLOAI.DANHMUCAPDONGIA' } },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', value: '1', source: { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', span: true }
        ],
        save: function (v, row) {
            return { action: TT + (row ? 'EjQgHgoNBgUeBSAvKQw0IgAxBS4vBigg' : 'FSkkLB4KDQYFHgUgLykMNCIAMQUuLwYoIAPP'),
                func: 'PKG_KLGV_V2_TINHTIEN.' + (row ? 'Sua_KLGD_DanhMucApDonGia' : 'Them_KLGD_DanhMucApDonGia'), method: 'POST',
                strId: row ? row.ID : '', strPhanLoai_Id: v.strPhanLoai_Id, strMa: v.strMa, strTen: v.strTen, strMoTa: v.strMoTa, dHieuLuc: v.dHieuLuc };
        },
        onSaved: function () { napDM(); },
        remove: function (ids) { return ids.map(function (id) { return { action: TT + 'GS4gHgoNBgUeBSAvKQw0IgAxBS4vBigg', func: 'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia', method: 'POST', strId: id }; }) ; }
    });
    // Danh mục đổi → nạp lại ô chọn danh mục (lọc + biểu mẫu) của khối đơn giá
    function napDM() {
        ums.api.call(DM_CALL).then(function (r) {
            var rows = T.arr(r.data);
            ['filter', 'form'].forEach(function (sc) {
                var s = root.querySelector('[data-z="dg"] select[data-scope="' + sc + '"][data-k="' + (sc === 'filter' ? 'dm' : 'strKLGD_DanhMucApDonGia_Id') + '"]');
                if (s) pat.fill(s, rows, { id: 'ID', name: 'TEN', head: s.getAttribute('data-ph') || '-- Chọn --' });
            });
        }).catch(function () { /* giữ ô cũ */ });
    }
})();
