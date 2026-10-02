/* =========================================================================
   Quy định hồ sơ áp dụng (Nhập học)
   Bản gốc: ApisNhapHoc/Modules/quydinh/html/hoso_apdung.html + scripts/hoso_apdung.js
   ---------------------------------------------------------------------------
   Bố cục như gốc: MỘT cột — thanh lọc (Kế hoạch nhập học · từ khoá · Tìm kiếm), danh sách, biểu mẫu thay chỗ danh sách.
   Lời gọi (chép nguyên, GET/POST như gốc):
     Kế hoạch: PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (ums.nhQD — quydinh/scripts/_chung.js, cả hộp "Tìm kiếm kế hoạch")
     Danh mục: NHAPHOC.HOSO · NHAPHOC.TINHCHAT · NHAPHOC.PHANCAP (getList_DanhMucDulieu)
     NH_QuyDinhHoSo_ApDung/LayDanhSach (GET, versionAPI v1.0, phân trang) { strLoaiHoSo_Id "", strTinhChatHoSo_Id "",
         strNHAPHOC_KeHoach_Id, strPhamViApDung_Id "", strPhanCapApDung_Id "", strNguoiThucHien_Id "", strTuKhoa }
     NH_QuyDinhHoSo_ApDung/LayChiTiet (GET) { strId }
     NH_QuyDinhHoSo_ApDung/ThemMoi | CapNhat (POST, versionAPI v1.0) { strId, strNguoiThucHien_Id, strLoaiHoSo_Id, dSoLuong,
         strTinhChatHoSo_Id, strNHAPHOC_KeHoach_Id, strPhamViApDung_Id, strPhanCapApDung_Id }
     NH_QuyDinhHoSo_ApDung/Xoa (POST) { strIds, strNguoiThucHien_Id }
     Phạm vi theo Phân cấp (MA của dòng danh mục):
       CHUONGTRINH → getList_ChuongTrinhDaoTao { strKhoaDaoTao_Id = DAOTAO_KHOADAOTAO_ID của kế hoạch, pageSize 100000 } (TENCHUONGTRINH)
       LOPQUANLY   → getList_LopQuanLy { strKhoaDaoTao_Id = như trên, pageSize 100000 } (TEN)
   Kế hoạch ở ô lọc: có chọn → id kế hoạch; trống → id người dùng; lần tải đầu gửi rỗng (như gốc).

   LỖI GỐC đã sửa (làm theo ý định):
     · Lưu gửi strPhanCapApDung_Id = getValById("") (khai input_QDHSAD.strPhanCapApDung_Id = "") → Phân cấp CHƯA BAO GIỜ được
       lưu. Nay gửi giá trị ô Phân cấp.
     · Khi sửa, gốc đổ ô Tính chất / Phạm vi / Phân cấp từ data.strTinhChatHoSo_Id / strPhamViApDung_Id / strPhanCapApDung_Id
       (tên THAM SỐ, không phải cột trả về) → ba ô luôn trống. Nay đọc TINHCHATHOSO_ID (như màn anh em Quy định hồ sơ),
       PHANCAPAPDUNG_ID, PHAMVIAPDUNG_ID (tên cột đoán theo mẫu tên tham số — kiểm khi có dữ liệu thật).
     · Bảng: tiêu đề gốc "Kế hoạch | Nhân sự" nhưng thân chỉ vẽ THUTU + Sửa + ô chọn (lệch cột, cột Nhân sự không có nguồn).
       Nay: Thứ tự (THUTU) · Kế hoạch nhập học · Loại hồ sơ · Tính chất · Số lượng — các cột đã có ở màn anh em Quy định hồ sơ.
     · strFuntionName phân trang gốc trỏ main_doc.QuyDinhHoSoApDung (sai tên đối tượng) → sang trang lỗi. Nay phân trang chạy.
   Luật cha → con: Kế hoạch → Phân cấp → Phạm vi. Chưa có kế hoạch thì chọn Phân cấp báo "Vui lòng lựa chọn Kế hoạch trước
     khi Phân cấp!" (như gốc); Phạm vi khoá tới khi chọn Phân cấp; chọn kế hoạch khác thì xoá Phân cấp + Phạm vi (gốc chỉ xoá
     Phân cấp).
   Bỏ: "Viết lại", ảnh minh hoạ (như Quy định hồ sơ).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nh-quydinh-hoso_apdung');
    if (!root) return;
    var ums = window.ums, ui = ums.ui, pat = ums.pat, Q = ums.nhQD;
    var lanDau = true, dsPhanCap = [], F = {}, gan = false;

    var crud = ums.crud({
        root: root,
        title: 'Quy định hồ sơ áp dụng',
        formTitle: 'quy định hồ sơ',
        icon: 'fa-list',
        addText: 'Tạo mới',
        filters: [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch nhập học', source: Q.nguonKeHoach },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                var kh = lanDau ? (f.kh || '') : (f.kh || ums.session.userId);
                lanDau = false;
                return { action: 'NH_QuyDinhHoSo_ApDung/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                    strLoaiHoSo_Id: '', strTinhChatHoSo_Id: '', strNHAPHOC_KeHoach_Id: kh, strPhamViApDung_Id: '',
                    strPhanCapApDung_Id: '', strNguoiThucHien_Id: '', strTuKhoa: f.q };
            }
        },
        columns: [
            { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center is-nowrap', width: '72px' },
            { title: 'Kế hoạch nhập học', prop: 'NHAPHOC_KEHOACHNHAPHOC_TEN' },
            { title: 'Loại hồ sơ', prop: 'LOAIHOSO_TEN' },
            { title: 'Tính chất', prop: 'TINHCHATHOSO_TEN' },
            { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' }
        ],
        rowDelete: false,
        formDelete: false,
        detail: function (row) { return { action: 'NH_QuyDinhHoSo_ApDung/LayChiTiet', method: 'GET', versionAPI: 'v1.0', strId: row.ID }; },
        fields: [
            { key: 'strNHAPHOC_KeHoach_Id', type: 'hidden', col: 'NHAPHOC_KEHOACHNHAPHOC_ID' },
            { key: '_khTen', col: 'NHAPHOC_KEHOACHNHAPHOC_TEN', label: 'Kế hoạch nhập học', caDong: true },
            { key: 'strLoaiHoSo_Id', col: 'LOAIHOSO_ID', label: 'Loại hồ sơ', type: 'select', source: { dm: 'NHAPHOC.HOSO' }, placeholder: 'Chọn loại hồ sơ' },
            { key: 'strTinhChatHoSo_Id', col: 'TINHCHATHOSO_ID', label: 'Tính chất', type: 'select', source: { dm: 'NHAPHOC.TINHCHAT' }, placeholder: 'Chọn tính chất hồ sơ' },
            { key: 'dSoLuong', col: 'SOLUONG', label: 'Số lượng' },
            { key: 'strPhanCapApDung_Id', label: 'Phân cấp', type: 'select', placeholder: 'Chọn phân cấp' },
            { key: 'strPhamViApDung_Id', label: 'Phạm vi', type: 'select', placeholder: 'Chọn phạm vi' }
        ],
        onForm: function (row) { moForm(row); },
        save: function (v, row) {
            return {
                action: row ? 'NH_QuyDinhHoSo_ApDung/CapNhat' : 'NH_QuyDinhHoSo_ApDung/ThemMoi', versionAPI: 'v1.0',
                strId: row ? row.ID : '', strNguoiThucHien_Id: ums.session.userId,
                strLoaiHoSo_Id: v.strLoaiHoSo_Id, dSoLuong: v.dSoLuong, strTinhChatHoSo_Id: v.strTinhChatHoSo_Id,
                strNHAPHOC_KeHoach_Id: v.strNHAPHOC_KeHoach_Id,
                strPhamViApDung_Id: v.strPhamViApDung_Id, strPhanCapApDung_Id: v.strPhanCapApDung_Id
            };
        },
        remove: function (ids) {
            return { action: 'NH_QuyDinhHoSo_ApDung/Xoa', versionAPI: 'v1.0', strIds: ids.join(','), strNguoiThucHien_Id: ums.session.userId };
        }
    });

    function o(k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]'); }

    /* Danh mục phân cấp (genCombo_PhanCap) — đổ một lần vào ô Phân cấp */
    var napPC = ums.api.dm('NHAPHOC.PHANCAP').then(function (rows) { dsPhanCap = rows; pat.fill(o('strPhanCapApDung_Id'), rows); })
        .catch(function (err) { ums.api.handle(err, 'phân cấp'); });

    function khoaDaoTao() {
        var id = F.kh.value;
        return Q.keHoach().then(function (rows) {
            var kh = rows.filter(function (r) { return r.ID === id; })[0];
            return kh ? (kh.DAOTAO_KHOADAOTAO_ID || '') : '';
        });
    }

    /* Phạm vi theo phân cấp — nhánh switch (strPhanCap_Ma) của gốc; mã khác thì để trống */
    function napPhamVi(giu) {
        var pc = dsPhanCap.filter(function (r) { return r.ID === F.pc.value; })[0];
        var ma = pc ? pc.MA : '';
        if (!ma) { pat.fill(F.pv, []); return Promise.resolve(); }
        return khoaDaoTao().then(function (khoa) {
            var p = ma === 'CHUONGTRINH'
                ? ums.ref.chuongTrinh({ strKhoaDaoTao_Id: khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
                    strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
                : ma === 'LOPQUANLY'
                    ? ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strKhoaDaoTao_Id: khoa, strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: '',
                        strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
                    : Promise.resolve([]);
            return p.then(function (rows) {
                pat.fill(F.pv, rows, { name: ma === 'CHUONGTRINH' ? 'TENCHUONGTRINH' : 'TEN' });
                if (giu) { F.pv.value = giu; jQuery(F.pv).trigger('change.select2').trigger('ums:refresh'); }
            });
        }).catch(function (err) { ums.api.handle(err, 'phạm vi'); });
    }

    function moForm(row) {
        F.kh = o('strNHAPHOC_KeHoach_Id');
        F.pc = o('strPhanCapApDung_Id');
        F.pv = o('strPhamViApDung_Id');
        if (!gan) {
            gan = true;
            Q.ganKeHoach(crud, {
                idKey: 'strNHAPHOC_KeHoach_Id', tenKey: '_khTen',
                // gốc: chọn kế hoạch → $("#dropPhanCap").val('')
                onPick: function () {
                    F.pc.value = ''; F.pv.value = '';
                    pat.fill(F.pv, []);
                    jQuery(F.pc).trigger('change.select2').trigger('ums:refresh');
                }
            });
            jQuery(F.pc).on('select2:select', function () {
                if (!F.kh.value) {
                    ui.toast('Vui lòng lựa chọn Kế hoạch trước khi Phân cấp!', 'warn');
                    F.pc.value = '';
                    jQuery(F.pc).trigger('change.select2').trigger('ums:refresh');
                    return;
                }
                napPhamVi();
            });
            jQuery(F.pc).on('select2:clear', function () { pat.fill(F.pv, []); });
            pat.chain([F.pc, F.pv], { phatLai: false });
        }
        // Sửa: đổ Phân cấp / Phạm vi (cột đoán — xem đầu tệp) rồi nạp danh sách phạm vi theo phân cấp
        var pc = row ? (row.PHANCAPAPDUNG_ID || '') : '', pv = row ? (row.PHAMVIAPDUNG_ID || '') : '';
        napPC.then(function () {
            F.pc.value = pc;
            jQuery(F.pc).trigger('change.select2').trigger('ums:refresh');
            if (pc) napPhamVi(pv); else pat.fill(F.pv, []);
        });
    }
})();
