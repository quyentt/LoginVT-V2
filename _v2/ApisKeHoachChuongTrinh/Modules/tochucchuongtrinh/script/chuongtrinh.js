/* =========================================================================
   Chương trình (tổ chức chương trình đào tạo)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/tochucchuongtrinh/script/chuongtrinh.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
       KHCT_ToChucChuongTrinh/LayDanhSach   GET  strTuKhoa, strDaoTao_KhoaDaoTao_Id, strDaoTao_HeDaoTao_Id,
                                                 strDaoTao_N_CN_Id='', strDaoTao_KhoaQuanLy_Id='', strDaoTao_ToChucCT_Cha_Id='',
                                                 pageIndex/pageSize
       KHCT_ToChucChuongTrinh/LayChiTiet    GET  strId
       pkg_kehoach_thongtin.Them_DaoTao_ToChucCT  (KHCT_ThongTin_MH/FSkk…)  thêm
       pkg_kehoach_thongtin.Sua_DaoTao_ToChucCT   (KHCT_ThongTin_MH/EjQg…)  sửa
            strId, strNganhTuyenSinh_Id, strDaoTao_KhoaDaoTao_Id, strPhanLoai_N_CN, strDaoTao_N_CN_Id, strTenChuongTrinh,
            strMaChuongTrinh, strLoaiChuongTrinh_Id, dTongSoTinChiQuyDinh, dThoiGianDaoTao, strDaoTao_KhoaQuanLy_Id,
            strDaoTao_ToChucCT_Cha_Id, strMoTa, strTenChuongTrinhTA, strDaoTao_CoSoDaoTao_Id, strTrinhDo_Id
            (ô trống gửi null như `|| null` của gốc)
       KHCT_ToChucChuongTrinh/Xoa           POST strIds (MỘT lời gọi, id nối dấu phẩy)
       KHCT_ToChucChuongTrinh/KeThua        POST strChucNang_Id, strDaoTao_KhoaHoc_Nguon_Id (khoá của dòng nguồn),
                                                 strDaoTao_CT_Nguon_Id, strDaoTao_KhoaHoc_Id — mỗi dòng đánh dấu một lời gọi
       KHCT_HeDaoTao/LayDanhSach · KHCT_KhoaDaoTao/LayDanhSach (Hệ → Khoá, lọc và hộp Kế thừa)
       NS_HoSo_V2_MH/… pkg_nhansu_hoso_v2.LayDanhSachToanBo (Khoa quản lý = getList_CoCauToChuc)
       pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao (Đối tác/cơ sở đào tạo)
       Danh mục: KHCT.LOAICHUONGTRINH, TUYENSINH.NGANHNGHE ("TEN - MA"), KHCT.NCN ("TEN - MA"), DAOTAO.CHUONGTRINH.TRINHDO
   Cha → con: Hệ → Khoá ở thanh lọc và trong hộp Kế thừa (khoá con khi chưa chọn hệ — luật chung, khác gốc).
   Khác gốc (đã chốt):
     · Gốc không tải danh sách khi mở màn (init không gọi getList_ChuongTrinh) — nay tải sẵn trang đầu.
     · strPhanLoai_N_CN / strDaoTao_ToChucCT_Cha_Id: gốc đọc hai ô KHÔNG có trên màn → Sửa gửi rỗng/null, xoá mất giá trị
       đang có. Nay khi SỬA gửi lại giá trị đang có của bản ghi (PHANLOAI_N_CN, DAOTAO_TOCHUCCT_CHA_ID); thêm mới vẫn rỗng/null.
     · Khoá đào tạo trong biểu mẫu: danh sách mọi khoá (như lúc mở màn gốc), không đổi theo Hệ đang lọc.
   Bỏ: nút "Danh mục dữ liệu" (khối ẩn display:none trong html gốc), viewEdit_ChuongTrinh / getDetail_ChuongTrinh_Full (mã chết),
       arrValid_ChuongTrinh (kiểm ô dropChucDanh không có), tải chương trình cha vào ô không có trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var T = ums.khctTC;
    var $ = window.jQuery;
    var HT = 'KHCT_ThongTin_MH/';
    var root = document.getElementById('chuongtrinh');
    var main = null;

    function tenMa(r) { return (r.TEN || '') + ' - ' + (r.MA || ''); }
    function nul(x) { return x === '' || x === undefined ? null : x; }

    var KHOA_ALL = {
        call: {
            action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDaoTao_HeDaoTao_Id: '', strDaoTao_CoSoDaoTao_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
        },
        id: 'ID', name: 'TENKHOA'
    };

    main = T.crud({
        ctl: 'KHCT_ToChucChuongTrinh',
        root: root,
        title: 'Chương trình',
        formTitle: 'chương trình',
        listTitle: 'Danh sách chương trình',
        icon: 'fa-list-timeline',

        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo', source: T.srcHe() },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        toolbar: [{ text: 'Kế thừa', icon: 'fa-clone', mod: 'primary', onClick: function (crud) { keThua(crud); } }],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q,
                    strDaoTao_KhoaDaoTao_Id: f.khoa,
                    strDaoTao_HeDaoTao_Id: f.he,
                    strDaoTao_N_CN_Id: '',
                    strDaoTao_KhoaQuanLy_Id: '',
                    strDaoTao_ToChucCT_Cha_Id: '',
                    strNguoiThucHien_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mã chương trình', prop: 'MACHUONGTRINH', cls: 'is-nowrap' },
            { title: 'Tên chương trình', prop: 'TENCHUONGTRINH' },
            { title: 'Tên chương trình TA', prop: 'TENCHUONGTRINHTA' },
            { title: 'Loại chương trình', prop: 'LOAICHUONGTRINH_TEN' },
            { title: 'Ngành tuyển sinh', prop: 'NGANHTUYENSINH_TEN' },
            { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
            { title: 'Ngành/Chuyên ngành', prop: 'DAOTAO_N_CN_TEN' },
            { title: 'Số tín chỉ quy định', prop: 'TONGSOTINCHIQUYDINH', cls: 'is-center' },
            { title: 'Danh sách lớp mở', prop: 'DSLOPQUANLY' }
        ],

        fields: [
            { type: 'legend', label: 'Thông tin chương trình' },
            { key: 'strMaChuongTrinh', col: 'MACHUONGTRINH', label: 'Mã chương trình' },
            { key: 'strTenChuongTrinh', col: 'TENCHUONGTRINH', label: 'Tên chương trình' },
            { key: 'strTenChuongTrinhTA', col: 'TENCHUONGTRINHTA', label: 'Tên chương trình TA' },
            { key: 'strLoaiChuongTrinh_Id', col: 'LOAICHUONGTRINH_ID', label: 'Loại chương trình', type: 'select',
                placeholder: '--Chọn loại chương trình--', source: { dm: 'KHCT.LOAICHUONGTRINH' } },

            { type: 'legend', label: 'Thông tin đào tạo' },
            { key: 'strNganhTuyenSinh_Id', col: 'NGANHTUYENSINH_ID', label: 'Ngành tuyển sinh', type: 'select',
                placeholder: '--Chọn ngành tuyển sinh--', source: { dm: 'TUYENSINH.NGANHNGHE', name: tenMa } },
            { key: 'strDaoTao_KhoaDaoTao_Id', col: 'DAOTAO_KHOADAOTAO_ID', label: 'Khóa đào tạo', type: 'select',
                placeholder: '--Chọn khóa đào tạo--', source: KHOA_ALL },
            { key: 'strDaoTao_KhoaQuanLy_Id', col: 'DAOTAO_KHOAQUANLY_ID', label: 'Khoa quản lý', type: 'select',
                placeholder: '--Chọn khoa quản lý--',
                source: {
                    call: {
                        action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
                        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: ''
                    },
                    id: 'ID', name: 'TEN'
                } },
            { key: 'strDaoTao_N_CN_Id', col: 'DAOTAO_N_CN_ID', label: 'Ngành/Chuyên ngành', type: 'select',
                placeholder: '--Chọn ngành/chuyên ngành đào tạo--', source: { dm: 'KHCT.NCN', name: tenMa } },

            { type: 'legend', label: 'Chi tiết chương trình' },
            { key: 'dTongSoTinChiQuyDinh', col: 'TONGSOTINCHIQUYDINH', label: 'Tổng số tín chỉ quy định', type: 'number' },
            { key: 'dThoiGianDaoTao', col: 'THOIGIANDAOTAO', label: 'Thời gian đào tạo', type: 'number' },
            { key: 'strDaoTao_CoSoDaoTao_Id', col: 'COSODAOTAO_ID', label: 'Đối tác/cơ sở đào tạo', type: 'select',
                placeholder: '--Chọn Đối tác/cơ sở đào tạo--',
                source: {
                    call: {
                        action: HT + 'DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP', func: 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
                        method: 'POST', strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
                    },
                    id: 'ID', name: 'TEN'
                } },
            { key: 'strTrinhDo_Id', label: 'Loại bằng/Trình độ', type: 'select', placeholder: '--Chọn loại bằng/trình độ--',
                get: function (r) { return r.TrinhDo_Id || r.TRINHDO_ID || ''; },
                source: { dm: 'DAOTAO.CHUONGTRINH.TRINHDO' } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' },
            { key: 'strPhanLoai_N_CN', col: 'PHANLOAI_N_CN', type: 'hidden' },
            { key: 'strDaoTao_ToChucCT_Cha_Id', col: 'DAOTAO_TOCHUCCT_CHA_ID', type: 'hidden' }
        ],

        // rewrite(): thêm mới lấy sẵn Khoá đang lọc
        onForm: function (row, crud) {
            if (!row) T.datTuLoc(crud, [['khoa', 'strDaoTao_KhoaDaoTao_Id']]);
        },

        save: function (v, row) {
            return {
                action: HT + (row ? 'EjQgHgUgLhUgLh4VLgIpNCICFQPP' : 'FSkkLB4FIC4VIC4eFS4CKTQiAhUP'),
                func: 'pkg_kehoach_thongtin.' + (row ? 'Sua_DaoTao_ToChucCT' : 'Them_DaoTao_ToChucCT'),
                strId: row ? row.ID : '',
                strNganhTuyenSinh_Id: nul(v.strNganhTuyenSinh_Id),
                strDaoTao_KhoaDaoTao_Id: nul(v.strDaoTao_KhoaDaoTao_Id),
                strPhanLoai_N_CN: row ? v.strPhanLoai_N_CN : '',
                strDaoTao_N_CN_Id: nul(v.strDaoTao_N_CN_Id),
                strTenChuongTrinh: v.strTenChuongTrinh,
                strMaChuongTrinh: v.strMaChuongTrinh,
                strLoaiChuongTrinh_Id: nul(v.strLoaiChuongTrinh_Id),
                dTongSoTinChiQuyDinh: nul(v.dTongSoTinChiQuyDinh),
                dThoiGianDaoTao: nul(v.dThoiGianDaoTao),
                strDaoTao_KhoaQuanLy_Id: nul(v.strDaoTao_KhoaQuanLy_Id),
                strDaoTao_ToChucCT_Cha_Id: row ? nul(v.strDaoTao_ToChucCT_Cha_Id) : null,
                strMoTa: v.strMoTa,
                strTenChuongTrinhTA: v.strTenChuongTrinhTA,
                strDaoTao_CoSoDaoTao_Id: nul(v.strDaoTao_CoSoDaoTao_Id),
                strTrinhDo_Id: nul(v.strTrinhDo_Id),
                strNguoiThucHien_Id: ''
            };
        }
    });

    /* ---------- Hệ → Khoá ở thanh lọc ---------------------------------------
       Gốc: chọn Hệ thì nạp lại Khoá (getList_KhoaDaoTao theo dropSearch_HeDaoTao) rồi tải danh sách. */
    function noiHeKhoa(he, khoa) {
        function nap() {
            if (!he.value) { ums.pat.fill(khoa, []); return; }
            T.khoa(he.value).then(function (rows) { ums.pat.fill(khoa, rows, { name: 'TENKHOA' }); })
                .catch(function (e) { ums.api.handle(e, 'khóa đào tạo'); });
        }
        if ($) $(he).on('select2:select select2:clear', nap);
        ums.pat.chain([he, khoa], { phatLai: false });
    }
    noiHeKhoa(T.o(main, 'filter', 'he'), T.o(main, 'filter', 'khoa'));

    /* ---------- Kế thừa (myModalKeThua) -------------------------------------
       Đánh dấu các chương trình nguồn → chọn Hệ, Khoá đích → hỏi lại → KeThua từng dòng. */
    function keThua(crud) {
        var chon = crud.pickedRows();
        if (!chon.length) { ums.ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var dlg = ums.ui.dialog({
            title: 'Kế thừa', icon: 'fa-clone', size: 'sm',
            body: '<div class="ums-grid ums-grid--1">' +
                ums.ui.field('Hệ đào tạo', '<select class="ums-select" data-kt="he" data-ph="--Chọn hệ đào tạo--"><option value=""></option></select>') +
                ums.ui.field('Khóa đào tạo', '<select class="ums-select" data-kt="khoa" data-ph="--Chọn khóa đào tạo--"><option value=""></option></select>', { required: true }) +
                '</div>',
            buttons: [{
                text: 'Kế thừa', kind: 'save', icon: 'fa-clone', mod: 'primary',
                onClick: function (api) {
                    var khoa = api.body.querySelector('[data-kt="khoa"]');
                    if (!khoa.value) { ums.ui.toast('Chọn khóa đào tạo', 'warn'); return false; }
                    var tenKhoa = khoa.options[khoa.selectedIndex].text;
                    api.close();
                    ums.ui.confirm('Bạn có muốn kế thừa ' + chon.length + ' chương trình sang khóa ' + tenKhoa + ' không?',
                        { title: 'Kế thừa', ok: 'Kế thừa' }).then(function (yes) {
                        if (!yes) return;
                        ums.ui.batch(chon.map(function (r) {
                            return {
                                action: 'KHCT_ToChucChuongTrinh/KeThua',
                                strChucNang_Id: ums.state.chucNangId || '',
                                strDaoTao_KhoaHoc_Nguon_Id: r.DAOTAO_KHOADAOTAO_ID,
                                strDaoTao_CT_Nguon_Id: r.ID,
                                strDaoTao_KhoaHoc_Id: khoa.value,
                                strNguoiThucHien_Id: ''
                            };
                        }), { title: 'Đang kế thừa', okText: 'Kế thừa thành công' }).then(function () { crud.load(); });
                    });
                    return false;
                }
            }]
        });
        var he = dlg.body.querySelector('[data-kt="he"]');
        var khoa = dlg.body.querySelector('[data-kt="khoa"]');
        ums.ui.select2(he, { placeholder: '--Chọn hệ đào tạo--' });
        ums.ui.select2(khoa, { placeholder: '--Chọn khóa đào tạo--' });
        ums.crud.loadSource(T.srcHe()).then(function (rows) { ums.pat.fill(he, rows, { name: 'TENHEDAOTAO' }); })
            .catch(function (e) { ums.api.handle(e, 'hệ đào tạo'); });
        noiHeKhoa(he, khoa);
    }
})();
