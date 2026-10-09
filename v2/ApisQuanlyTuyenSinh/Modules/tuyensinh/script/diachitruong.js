/* =========================================================================
   Địa chỉ trường
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/diachitruong.html + script/DiaChiTruong.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" (từ khoá + Tìm kiếm) → "Danh sách (n)": Tên trường · Tỉnh · Huyện ·
   Xã · Địa chỉ · Sửa. Bấm Sửa → hộp "Địa chỉ trường" (Trường chỉ đọc · Tỉnh → Huyện → Xã · Địa chỉ) + Lưu.
   Html gốc KHÔNG có nút Thêm / Xoá → màn chỉ SỬA (canAdd: false).

   Lời gọi (chép nguyên, GET/POST như gốc):
     TS_Truong_DiaChi/LayDanhSach  GET  strTuKhoa, strNguoiTao_Id '' (gốc đọc ô dropAAAA không tồn tại),
                                        pageIndex 1, pageSize 100000 → TRUONG_TEN, TINHTHANH_TEN, QUANHUYEN_TEN,
                                        PHUONGXA_TEN, DIACHI (sửa: TRUONG_ID, TINHTHANH_ID, QUANHUYEN_ID, PHUONGXA_ID)
     TS_Truong_DiaChi/CapNhat (ThemMoi khi chưa có id)  POST  strId, strChucNang_Id, strTruong_Id, strTinhThanh_Id,
                                        strQuanHuyen_Id, strPhuongXa_Id, strDiaChi, strMoTa '' (gốc đọc ô txtMoTa không
                                        tồn tại), strNguoiThucHien_Id
     danh mục TUYENSINH.TRUONGHOC · CHUN.DMTT (edu.extend.genDropTinhThanh → ums.pat.dmTinhThanh)

   Khác gốc / tự chốt (ghi báo cáo):
     · Sửa dùng biểu mẫu thay chỗ danh sách (BO-CUC luật 1), không phải hộp thoại như gốc.
     · Ô từ khoá: gốc gửi strTuKhoa từ ô txtAAAA KHÔNG tồn tại (ô tìm trên màn không có tác dụng) → nay gửi đúng ô tìm.
     · Tỉnh → Huyện → Xã khoá theo luật cha → con (pat.chain); gốc chỉ xoá trắng khi CHỌN cha.
   ========================================================================= */
(function () {
    'use strict';
    var pat = ums.pat;
    var root = document.getElementById('ts-diachitruong');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var crud = ums.crud({
        root: root,
        title: 'Địa chỉ trường',
        formTitle: 'địa chỉ trường',
        listTitle: 'Danh sách',
        icon: 'fa-school-flag',
        canAdd: false,
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            call: function (f) {
                return { action: 'TS_Truong_DiaChi/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiTao_Id: '',
                    pageIndex: 1, pageSize: 100000 };
            }
        },
        columns: [
            { title: 'Tên trường', prop: 'TRUONG_TEN' },
            { title: 'Tỉnh', prop: 'TINHTHANH_TEN' },
            { title: 'Huyện', prop: 'QUANHUYEN_TEN' },
            { title: 'Xã', prop: 'PHUONGXA_TEN' },
            { title: 'Địa chỉ', prop: 'DIACHI', cls: 'is-center' }
        ],
        fields: [
            { key: 'strTruong_Id', col: 'TRUONG_ID', label: 'Trường', type: 'select', readonlyEdit: true,
              source: { dm: 'TUYENSINH.TRUONGHOC' }, placeholder: 'Chọn trường' },
            { key: 'strTinhThanh_Id', col: 'TINHTHANH_ID', label: 'Tỉnh', type: 'select', source: { items: [] }, placeholder: 'Chọn tỉnh thành' },
            { key: 'strQuanHuyen_Id', col: 'QUANHUYEN_ID', label: 'Huyện', type: 'select', source: { items: [] }, placeholder: 'Chọn quận/huyện' },
            { key: 'strPhuongXa_Id', col: 'PHUONGXA_ID', label: 'Xã', type: 'select', source: { items: [] }, placeholder: 'Chọn phường/xã' },
            { key: 'strDiaChi', col: 'DIACHI', label: 'Địa chỉ' }
        ],
        save: function (v, row) {
            var id = row ? e(row.ID) : '';
            return {
                action: id ? 'TS_Truong_DiaChi/CapNhat' : 'TS_Truong_DiaChi/ThemMoi', method: 'POST',
                strId: id, strChucNang_Id: ums.state.chucNangId,
                strTruong_Id: v.strTruong_Id, strTinhThanh_Id: v.strTinhThanh_Id, strQuanHuyen_Id: v.strQuanHuyen_Id,
                strPhuongXa_Id: v.strPhuongXa_Id, strDiaChi: v.strDiaChi, strMoTa: '', strNguoiThucHien_Id: ums.session.userId
            };
        },
        onForm: function (row) { datTT(row); }
    });

    /* ---------- Tỉnh → Huyện → Xã (CHUN.DMTT phẳng, cha qua QUANHECHA_ID) ---------- */
    function o(k) { return crud.root.querySelector('[data-scope="form"][data-k="' + k + '"]'); }
    var T = o('strTinhThanh_Id'), H = o('strQuanHuyen_Id'), X = o('strPhuongXa_Id');
    var ds = [];
    var san = pat.dmTinhThanh().then(function (r) { ds = r || []; }, function (err) { ums.api.handle(err, 'danh mục tỉnh thành'); });
    function con(cha) { return ds.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }
    function dat(el, v) { el.value = e(v); jQuery(el).trigger('change.select2').trigger('ums:refresh'); }
    function datTT(row) {
        san.then(function () {
            pat.fill(T, con(null), { head: 'Chọn tỉnh thành' });
            dat(T, row && row.TINHTHANH_ID);
            pat.fill(H, T.value ? con(T.value) : [], { head: 'Chọn quận/huyện' });
            dat(H, row && row.QUANHUYEN_ID);
            pat.fill(X, H.value ? con(H.value) : [], { head: 'Chọn phường/xã' });
            dat(X, row && row.PHUONGXA_ID);
        });
    }
    jQuery(T).on('select2:select select2:clear', function () {
        pat.fill(H, T.value ? con(T.value) : [], { head: 'Chọn quận/huyện' }); pat.fill(X, [], { head: 'Chọn phường/xã' });
    });
    jQuery(H).on('select2:select select2:clear', function () {
        pat.fill(X, H.value ? con(H.value) : [], { head: 'Chọn phường/xã' });
    });
    pat.chain([T, H, X], { phatLai: false });
})();
