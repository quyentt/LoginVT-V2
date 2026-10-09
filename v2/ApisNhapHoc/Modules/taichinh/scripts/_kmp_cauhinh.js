/* =========================================================================
   Khai mức phí thu nhập học — ba MÀN CON cấu hình của một nhóm định mức
   (ums.kmp.khoanThu / nganhDauRa / dauVao (nhom, host)). Bản gốc: ba modal toàn màn
   modalKhoanThu_HSNH, modalNganhDauRa_HSNH, modalDauVao_HSNH cùng các modal
   con (modalKhoanThuEdit_HSNH, modalThemNganhDauRa_HSNH, modalThemDoiTuong_HSNH).
   Từ 30/9 (BO-CUC luật 1): cả ba mở NGAY TRONG TRANG, thay chỗ vùng `host` (gốc màn)
   bằng ums.pat.formTrang — bên trong là một ums.crud lồng; biểu mẫu thêm/sửa khoản thu
   thay chỗ bảng; "Thêm mới đối tượng" là biểu mẫu tầng hai (thay chỗ thân màn con Đầu vào).
   Hộp CHỌN ngành đầu ra để thêm vẫn là hộp thoại (việc phụ).
   ---------------------------------------------------------------------------
   Khoản thu   LayDS_NhapHoc_CauHinh_TC (dChi_Ban_Ghi_HienTai 1) · Them_ · Sua_ · Xoa_NhapHoc_CauHinh_TC
               Sửa lấy nguyên dòng danh sách (gốc không có LayTT khoản thu).
               Nguồn: TC_KhoanThu/LayDanhSach (GET), TAICHINH.DVT (theo MA),
               NHAPHOC_CAUHINH_TC.KIEUTUDONG.PHAINOP (theo MA), cơ sở đào tạo (theo ID).
   Ngành ĐR    LayDS_NH_CauHinh_TC_Nhom_DauRa · Xoa_ (từng dòng đã chọn)
               Thêm: LayDS_NH_KeHoach_DauRa (từ khoá) → Them_NH_CauHinh_TC_Nhom_DauRa (từng dòng)
   Đầu vào     LayDS_NH_CauHinh_TC_Nhom_DT · Xoa_ (từng dòng đã chọn)
               Thêm đối tượng: danh mục QLSV.DOITUONG → Them_NH_CauHinh_TC_Nhom_DT
   Giữ như gốc:
     · Khoản thu: xoá chỉ có trong biểu mẫu sửa; Định mức bắt buộc, là số.
       Ba tham số cơ sở (strDaoTao_CoSoDaoTao_Id, strNhapHoc_CoSo_Id,
       strNhaphoc_Coso_Id) cùng một giá trị. "Tự động sinh phải thu" đánh dấu
       sẵn khi thêm; Thứ tự mặc định 0.
     · Ngành / đầu vào: chỉ xoá nhiều (không có xoá từng dòng). Ghi chú ngành gửi rỗng.
     · "Thêm mới người học": gốc chỉ báo "sẽ làm khi có API" → nút giữ, KHOÁ.
   Khác gốc:
     · Định mức gõ có dấu phẩy ngăn nghìn, gửi số trơn (gốc ô number).
     · Thêm / xoá hàng loạt chạy lần lượt qua ums.ui.batch, báo đúng số lỗi
       (gốc bắn song song rồi đếm).
     · Chọn tất cả của bảng ngành đã cấu hình chỉ chọn trang đang xem (khung
       chung ums.crud); hộp chọn ngành để THÊM vẫn chọn toàn bộ mọi trang như gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var K = ums.kmp;
    var e = K.e, pick = K.pick;

    function coBadge(on, text, tone) { return Number(on || 0) === 1 ? ui.badge(text, tone) : ''; }

    /* =====================================================================
       Cấu hình các khoản thu của nhóm
       ===================================================================== */
    var KHOANTHU = {
        call: {   // loadCombos_KhoanThu — gốc GET, pageSize 1000
            action: 'TC_KhoanThu/LayDanhSach', method: 'GET',
            strTuKhoa: '', strNhomCacKhoanThu_Id: '', pageIndex: 1, pageSize: 1000, strNguoiTao_Id: '', strCanBoQuanLy_Id: ''
        },
        id: 'ID', name: 'TEN'
    };

    K.khoanThu = function (nhom, vung) {
        var nhomId = K.nhomId(nhom), khId = e(nhom.NH_KEHOACH_NHAPHOC_ID);
        var label = K.nhomLabel(nhom);
        K.dm().then(function (dm) {
            var ft = pat.formTrang({ host: vung, title: 'Cấu hình các khoản thu của nhóm: ' + label, icon: 'fa-money-check-dollar', cols: 1, body: '<div></div>' });
            var host = ft.body.firstChild;

            function tenCoSo(r) {
                var ten = pick(r, 'NHAPHOC_COSO_TEN', 'COSODAOTAO_TEN');
                if (ten) return ui.esc(ten);
                var id = pick(r, 'NHAPHOC_COSO_ID', 'DAOTAO_COSODAOTAO_ID', 'COSODAOTAO_ID');
                if (!id) return '<i class="ums-u-faint">Tất cả cơ sở</i>';
                var hit = dm.coso.filter(function (x) { return x.ID === id; })[0];
                return ui.esc(hit ? hit.TEN || id : id);
            }

            ums.crud({
                root: host,
                embedded: true,
                title: 'Các khoản thu của nhóm',
                formTitle: 'khoản thu',
                icon: 'fa-money-check-dollar',
                addText: 'Thêm mới khoản thu',
                empty: 'Chưa có khoản thu nào trong nhóm.',
                pageSize: 1000,     // gốc không phân trang, dòng tổng cộng trên mọi khoản

                list: {
                    call: function () {
                        return K.goi('ktDS', {
                            strNH_CauHinh_TC_Nhom_Id: nhomId,
                            strNH_KeHoach_NhapHoc_Id: khId,
                            strTaiChinh_CacKhoanThu_Id: '',
                            dBat_Buoc: '',
                            dIs_Active: 1,
                            dChi_Ban_Ghi_HienTai: 1
                        });
                    },
                    rows: function (d) {
                        return (Array.isArray(d) ? d : []).map(function (r) {
                            if (!r.ID && r.NH_CAUHINH_TC_ID) r.ID = r.NH_CAUHINH_TC_ID;
                            return r;
                        });
                    }
                },

                columns: [
                    { title: 'Tên khoản thu', cls: 'kmp-rong', render: function (r) { return ui.esc(pick(r, 'TEN_HIEN_THI', 'TEN')); } },
                    { title: 'Mã khoản thu', cls: 'is-nowrap', render: function (r) { return ui.esc(pick(r, 'KHOANTHU_MA', 'MA')); } },
                    { title: 'Thuộc nhóm', render: function (r) { return ui.esc(e(r.NHOM_TEN)); } },
                    { title: 'Cơ sở đào tạo', render: tenCoSo },
                    { title: 'Định mức thu', cls: 'is-right is-nowrap', render: function (r) { return K.tien(r.SO_TIEN_DINH_MUC); },
                      sum: function (rows) { return '<b>' + ui.money(K.cong(rows, function (r) { return r.SO_TIEN_DINH_MUC; })) + '</b>'; } },
                    { title: 'Đơn vị tính', cls: 'is-center', render: function (r) { return ui.esc(K.tenTheoMa(dm.dvt, pick(r, 'DON_VI_TIEN_ID', 'DON_VI_TIEN_MA'))); } },
                    { title: 'Bắt buộc / không bắt buộc', cls: 'is-center kmp-ngat', render: function (r) { return coBadge(r.BAT_BUOC, 'Bắt buộc', 'bad'); } },
                    { title: 'Tự động sinh phải thu sau khi thu', cls: 'is-center kmp-ngat', render: function (r) { return coBadge(r.TU_DONG_SINH_PHAITHU, 'Tự động sinh phải thu', 'info'); } },
                    { title: 'Thứ tự hiển thị', cls: 'is-center kmp-ngat', render: function (r) { return ui.esc(e(r.THU_TU_HIEN_THI)); } },
                    { title: 'Kiểu tự động sinh phải thu', cls: 'kmp-ngat', render: function (r) { return ui.esc(K.tenTheoMa(dm.kieu, pick(r, 'KIEU_TU_DONG_SINH_PHAITHU_ID', 'KIEU_SINH_PHAITHU_ID'))); } },
                    { title: 'Cho phép miễn giảm', cls: 'is-center kmp-ngat', render: function (r) { return coBadge(r.CHO_PHEP_MIEN_GIAM, 'Cho phép áp dụng miễn giảm', 'ok'); } },
                    { title: 'Ghi chú', render: function (r) { return ui.esc(pick(r, 'GHICHU', 'GHI_CHU')); } }
                ],

                fields: [
                    { key: 'strTaiChinh_CacKhoanThu_Id', label: 'Chọn khoản thu cần thêm', type: 'select', required: true, source: KHOANTHU,
                      placeholder: 'Chọn khoản thu', get: function (r) { return pick(r, 'TAICHINH_CACKHOANTHU_ID', 'KHOANTHU_ID'); } },
                    { key: 'strTen_KhoanThu_HienThi', label: 'Tên hiển thị', placeholder: 'Nếu không khai thì hệ thống lấy theo tên khoản',
                      get: function (r) { return e(r.TEN_HIEN_THI); } },
                    { key: 'dSo_Tien_Dinh_Muc', label: 'Định mức thu', type: 'number', required: true, placeholder: 'Nhập số tiền định mức',
                      get: function (r) { return pat.money(e(r.SO_TIEN_DINH_MUC)); } },
                    { key: 'strDon_Vi_Tien_Id', label: 'Đơn vị tính', type: 'select', placeholder: 'Chọn đơn vị tính',
                      source: { items: dm.dvt, id: 'MA', name: 'TEN' }, get: function (r) { return pick(r, 'DON_VI_TIEN_ID', 'DON_VI_TIEN_MA'); } },
                    { key: 'strNhapHoc_CoSo_Id', label: 'Cơ sở đào tạo', type: 'select', placeholder: 'Áp dụng cho tất cả cơ sở',
                      source: { items: dm.coso, id: 'ID', name: 'TEN' }, get: function (r) { return pick(r, 'NHAPHOC_COSO_ID', 'DAOTAO_COSODAOTAO_ID', 'COSODAOTAO_ID'); } },
                    { key: 'strKieu_Sinh_PhaiThu_Id', label: 'Kiểu tự động sinh phải thu', type: 'select', placeholder: 'Chọn kiểu tự động sinh phải thu',
                      source: { items: dm.kieu, id: 'MA', name: 'TEN' }, get: function (r) { return pick(r, 'KIEU_TU_DONG_SINH_PHAITHU_ID', 'KIEU_SINH_PHAITHU_ID'); } },
                    { key: 'dThu_Tu_Hien_Thi', label: 'Thứ tự hiển thị', type: 'number', value: '0', placeholder: 'Số thứ tự',
                      get: function (r) { return r.THU_TU_HIEN_THI === null || r.THU_TU_HIEN_THI === undefined ? '0' : r.THU_TU_HIEN_THI; } },
                    { type: 'checks', label: 'Thiết lập', span: true, items: [
                        { key: 'dBat_Buoc', label: 'Bắt buộc', on: 1, off: 0, value: 0, get: function (r) { return Number(r.BAT_BUOC || 0); } },
                        { key: 'dTu_Dong_Sinh_PhaiThu', label: 'Tự động sinh phải thu sau khi thu', on: 1, off: 0, value: 1,
                          get: function (r) { return Number(r.TU_DONG_SINH_PHAITHU || 0); } },
                        { key: 'dCho_Phep_Mien_Giam', label: 'Cho phép miễn giảm', on: 1, off: 0, value: 0, get: function (r) { return Number(r.CHO_PHEP_MIEN_GIAM || 0); } }
                    ] },
                    { key: 'strGhiChu', label: 'Ghi chú', type: 'textarea', span: true, placeholder: 'Ghi chú...', get: function (r) { return pick(r, 'GHICHU', 'GHI_CHU'); } }
                ],

                save: function (v, row) {
                    var dinhMuc = pat.num(v.dSo_Tien_Dinh_Muc);
                    if (dinhMuc === '' || isNaN(Number(dinhMuc))) { ui.toast('Vui lòng nhập Định mức thu hợp lệ.', 'warn'); return null; }
                    var strId = row ? pick(row, 'ID', 'Id', 'id', 'NH_CAUHINH_TC_ID') : '';
                    var o = {
                        strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id,
                        strTen_KhoanThu_HienThi: v.strTen_KhoanThu_HienThi,
                        dSo_Tien_Dinh_Muc: Number(dinhMuc),
                        strDon_Vi_Tien_Id: v.strDon_Vi_Tien_Id,
                        dBat_Buoc: v.dBat_Buoc,
                        dCho_Phep_Mien_Giam: v.dCho_Phep_Mien_Giam,
                        dTu_Dong_Sinh_PhaiThu: v.dTu_Dong_Sinh_PhaiThu,
                        strKieu_Sinh_PhaiThu_Id: v.strKieu_Sinh_PhaiThu_Id,
                        dThu_Tu_Hien_Thi: Number(pat.num(v.dThu_Tu_Hien_Thi) || 0),
                        strDaoTao_CoSoDaoTao_Id: v.strNhapHoc_CoSo_Id,
                        strNhapHoc_CoSo_Id: v.strNhapHoc_CoSo_Id,
                        strNhaphoc_Coso_Id: v.strNhapHoc_CoSo_Id,
                        strGhiChu: v.strGhiChu
                    };
                    if (strId) o.strId = strId; else o.strNH_CauHinh_TC_Nhom_Id = nhomId;
                    return K.goi(strId ? 'ktSua' : 'ktThem', o);
                },

                remove: function (ids, rows) { return K.goi('ktXoa', { strId: pick(rows[0], 'ID', 'Id', 'id', 'NH_CAUHINH_TC_ID') }); },
                rowDelete: false,
                multi: false,
                removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa khoản thu này?'; }
            });

            // Định mức: dấu phẩy ngăn nghìn khi rời ô
            host.addEventListener('focusout', function (ev) {
                var t = ev.target;
                if (t.matches && t.matches('[data-scope="form"][data-k="dSo_Tien_Dinh_Muc"]') && t.value.trim()) t.value = pat.money(t.value);
            });
        });
    };

    /* =====================================================================
       Cấu hình ngành đầu ra nhận mức theo nhóm
       ===================================================================== */
    function cotNganh(o) {
        // o: tên cột của từng nguồn (danh sách đã cấu hình / danh sách chương trình đầu ra)
        return [
            { title: 'Hệ', render: function (r) { return ui.esc(pick.apply(null, [r].concat(o.he))); } },
            { title: 'Khóa', cls: 'is-nowrap', render: function (r) { return ui.esc(pick.apply(null, [r].concat(o.khoa))); } },
            { title: 'Ngành đào tạo', render: function (r) { return ui.esc(K.tenMa(pick.apply(null, [r].concat(o.dtTen)), pick.apply(null, [r].concat(o.dtMa)))); } },
            { title: 'Ngành tuyển sinh', render: function (r) { return ui.esc(K.tenMa(pick.apply(null, [r].concat(o.tsTen)), pick.apply(null, [r].concat(o.tsMa)))); } },
            { title: 'Khoa quản lý', render: function (r) { return ui.esc(pick.apply(null, [r].concat(o.kql))); } },
            { title: 'Chương trình', render: function (r) { return ui.esc(K.tenMa(pick.apply(null, [r].concat(o.ctTen)), pick.apply(null, [r].concat(o.ctMa)))); } },
            { title: 'Ghi chú', render: function (r) { return ui.esc(pick(r, 'GHICHU', 'GHI_CHU')); } }
        ];
    }
    // genTable_NganhDauRa
    var COT_DA = cotNganh({
        he: ['TENHEDAOTAO', 'TEN_HEDAOTAO', 'TEN_HE_DAOTAO'], khoa: ['TENKHOA', 'TEN_KHOA'],
        dtTen: ['TEN_NGANH_DT', 'TEN_NGANHDT', 'NGANH_DT_TEN'], dtMa: ['MA_NGANH_DT', 'NGANH_DT_MA', 'MANGANH_DT'],
        tsTen: ['TEN_NGANH_TS', 'TEN_NGANHTS', 'NGANH_TS_TEN'], tsMa: ['MA_NGANH_TS', 'NGANH_TS_MA', 'MANGANH_TS'],
        kql: ['TEN_KHOAQUANLY', 'TENKHOAQUANLY'], ctTen: ['TENCHUONGTRINH', 'TEN_CHUONGTRINH'], ctMa: ['MACHUONGTRINH', 'MA_CHUONGTRINH']
    });
    // genTable_KeHoachDauRa
    var COT_KH = cotNganh({
        he: ['HEDAOTAO_TEN', 'TENHEDAOTAO'], khoa: ['KHOADAOTAO_TEN', 'TENKHOA'],
        dtTen: ['NGANH_DT_TEN', 'TEN_NGANH_DT'], dtMa: ['NGANH_DT_MA', 'MA_NGANH_DT'],
        tsTen: ['NGANH_TS_TEN', 'TEN_NGANH_TS'], tsMa: ['NGANH_TS_MA', 'MA_NGANH_TS'],
        kql: ['KHOAQUANLY_TEN', 'TEN_KHOAQUANLY'], ctTen: ['CHUONGTRINH_TEN', 'TENCHUONGTRINH'], ctMa: ['CHUONGTRINH_MA', 'MACHUONGTRINH']
    });

    K.nganhDauRa = function (nhom, vung) {
        var nhomId = K.nhomId(nhom), khId = e(nhom.NH_KEHOACH_NHAPHOC_ID);
        var label = K.nhomLabel(nhom);
        var ft = pat.formTrang({ host: vung, title: 'Cấu hình ngành đầu ra nhận mức theo nhóm: ' + label, icon: 'fa-graduation-cap', cols: 1, body: '<div></div>' });

        var crud = ums.crud({
            root: ft.body.firstChild,
            embedded: true,
            title: 'Ngành đầu ra của nhóm',
            icon: 'fa-graduation-cap',
            empty: 'Chưa có ngành đầu ra nào.',
            pageSize: 20,
            list: {
                call: function () {
                    return K.goi('draDS', {
                        strNH_CauHinh_TC_Nhom_Id: nhomId,
                        strNH_KeHoach_NhapHoc_Id: khId,
                        strNH_KeHoach_DauRa_Id: '',
                        dIs_Active: 1
                    });
                },
                rows: function (d) {
                    return (Array.isArray(d) ? d : []).map(function (r) {
                        if (!r.ID && r.NH_CAUHINH_TC_NHOM_DAURA_ID) r.ID = r.NH_CAUHINH_TC_NHOM_DAURA_ID;
                        return r;
                    });
                }
            },
            columns: COT_DA,
            toolbar: [{ text: 'Thêm ngành', icon: 'fa-plus', mod: 'add', onClick: function () { themNganh(nhomId, khId, label, function () { crud.load(); }); } }],
            remove: function (ids) {
                return ids.map(function (id) { return K.goi('draXoa', { strId: id }); });
            },
            rowDelete: false,
            removeText: 'Xóa mục đã chọn',
            removeConfirm: function (rows) { return 'Bạn có chắc chắn muốn xóa ' + rows.length + ' ngành đã chọn?'; }
        });
    };

    /* Hộp "Thêm mới ngành đầu ra vào nhóm" — danh sách chương trình đầu ra của kế hoạch */
    function themNganh(nhomId, khId, label, sauLuu) {
        var dlg = ui.dialog({
            title: 'Thêm mới ngành đầu ra vào nhóm: ' + label,
            icon: 'fa-plus',
            size: 'xl',
            body:
                '<div class="ums-filter ums-u-mb-4">' +
                    '<div class="ums-field"><input class="ums-input" data-tn="q" placeholder="Nhập từ khóa lọc..." autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Lọc', attr: { 'data-tn': 'loc' } }) + '</div>' +
                '</div>' +
                '<div class="ums-legend ums-u-mb-2">Danh sách các chương trình đầu ra <span class="ums-u-faint ums-u-fz13" data-tn="dem"></span></div>' +
                '<div data-tn="bang"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); } }]
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-tn="' + k + '"]'); }

        var L = K.luoi(q('bang'), {
            columns: COT_KH, size: 20, sizes: [10, 20, 50, 100, 'all'], chon: true,
            empty: 'Không có chương trình đầu ra nào.',
            id: function (r) { return pick(r, 'ID', 'NH_KEHOACH_DAURA_ID'); },
            onChon: function (n) { q('dem').textContent = n ? '— đã chọn ' + n : ''; }
        });

        function nap() {
            L.dang();
            ums.api.call(K.goi('khDauRa', {
                strTuKhoa: q('q').value.trim(),
                strNH_KeHoach_NhapHoc_Id: khId,
                strDaoTao_HeDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: '',
                strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_Nganh_DT_Id: '',
                strDaoTao_Nganh_TS_Id: '',
                strDauRa_Status_Code: '',
                dIs_Active: 1
            })).then(function (r) { L.dat(K.rows(r)); })
                .catch(function (err) { L.loi(err.message); ums.api.handle(err, 'chương trình đầu ra'); });
        }

        var hen = 0;
        q('q').addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(nap, 400); });
        q('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(hen); nap(); } });
        q('loc').addEventListener('click', function () { clearTimeout(hen); nap(); });

        function luu() {
            var ids = L.chon();
            if (!ids.length) { ui.toast('Vui lòng chọn ít nhất một chương trình đầu ra.', 'warn'); return; }
            ui.batch(ids.map(function (id) {
                return K.goi('draThem', { strNH_CauHinh_TC_Nhom_Id: nhomId, strNH_KeHoach_DauRa_Id: id, strGhiChu: '' });
            }), { title: 'Đang thêm ngành đầu ra', okText: 'Đã thêm ngành' }).then(function () {
                dlg.close();
                sauLuu();
            });
        }

        nap();
    }

    /* =====================================================================
       Cấu hình các trường hợp đầu vào (SV / đối tượng)
       ===================================================================== */
    K.dauVao = function (nhom, vung) {
        var nhomId = K.nhomId(nhom), khId = e(nhom.NH_KEHOACH_NHAPHOC_ID);
        var label = K.nhomLabel(nhom);
        var ft = pat.formTrang({ host: vung, title: 'Cấu hình các trường hợp đầu vào (SV / đối tượng): ' + label, icon: 'fa-users', cols: 1, body: '<div></div>' });

        var crud = ums.crud({
            root: ft.body.firstChild,
            embedded: true,
            title: 'Các trường hợp đầu vào của nhóm',
            icon: 'fa-users',
            empty: 'Chưa có cấu hình đầu vào nào.',
            pageSize: 1000,     // gốc không phân trang
            list: {
                call: function () {
                    return K.goi('dvDS', {
                        strNH_CauHinh_TC_Nhom_Id: nhomId,
                        strNH_KeHoach_NhapHoc_Id: khId,
                        strCore_Person_Id: '',
                        strDoi_Tuong_ApDung_Id: '',
                        strLoai_ApDung: '',
                        dIs_Active: 1,
                        dChi_Ban_Ghi_HienTai: 1
                    });
                },
                rows: function (d) {
                    return (Array.isArray(d) ? d : []).map(function (r) {
                        if (!r.ID && r.NH_CAUHINH_TC_NHOM_DT_ID) r.ID = r.NH_CAUHINH_TC_NHOM_DT_ID;
                        return r;
                    });
                }
            },
            columns: [
                { title: 'Mã số', cls: 'is-nowrap', render: function (r) { return ui.esc(pick(r, 'SV_MASO', 'MASO')); } },
                { title: 'Họ tên', render: function (r) { return ui.esc(pick(r, 'SV_HOTEN', 'HOTEN')); } },
                { title: 'Đối tượng', render: function (r) { return ui.esc(pick(r, 'DOI_TUONG_TEN', 'DOITUONG_TEN')); } },
                { title: 'Ghi chú', render: function (r) { return ui.esc(pick(r, 'GHICHU', 'GHI_CHU', 'GhiChu')); } },
                { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return Number(r.IS_ACTIVE || 0) === 1 ? ui.badge('Hiệu lực', 'ok') : ui.badge('Ngừng', 'mute'); } },
                { title: 'Đang dùng', cls: 'is-center', render: function (r) { return coBadge(r.IS_CURRENT, 'Đang dùng', 'info'); } }
            ],
            toolbar: [
                { text: 'Thêm mới người học', icon: 'fa-user-plus', mod: 'out-success', onClick: function () {} },
                { text: 'Thêm mới đối tượng', icon: 'fa-users-gear', mod: 'out-success', onClick: function () { themDoiTuong(nhomId, ft.body, function () { crud.load(); }); } }
            ],
            remove: function (ids) {
                return ids.map(function (id) { return K.goi('dvXoa', { strId: id }); });
            },
            rowDelete: false,
            removeText: 'Xóa mục đã chọn',
            removeConfirm: function (rows) { return 'Bạn có chắc chắn muốn xóa ' + rows.length + ' dòng đã chọn?'; }
        });

        // "Thêm mới người học": bản gốc chưa có API (chỉ báo "sẽ làm khi có API") → khoá
        var nutNH = ft.body.querySelector('[data-c="' + crud.uid + ':tool0"]');
        if (nutNH) { nutNH.disabled = true; nutNH.title = 'Chức năng Thêm mới người học sẽ làm khi có API.'; }
    };

    /* Biểu mẫu "Thêm mới đối tượng" — danh mục QLSV.DOITUONG + ghi chú.
       Tầng hai: thay chỗ thân màn con "Đầu vào" (vung = thân của formTrang ngoài); lưu xong mới đóng. */
    function themDoiTuong(nhomId, vung, sauLuu) {
        var dlg = pat.formTrang({
            host: vung,
            title: 'Thêm mới đối tượng',
            icon: 'fa-users-gear',
            body:
                '<div style="grid-column:1 / -1">' + ui.field('Đối tượng', '<select class="ums-select" data-dt="dt" data-ph="Chọn đối tượng"><option value="">Chọn đối tượng</option></select>', { required: true }) + '</div>' +
                '<div style="grid-column:1 / -1">' + ui.field('Ghi chú', '<textarea class="ums-textarea" data-dt="gc" rows="4" placeholder="Ghi chú..."></textarea>') + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); } }]
        });
        var sel = dlg.body.querySelector('[data-dt="dt"]'), gc = dlg.body.querySelector('[data-dt="gc"]');
        ums.api.dm('QLSV.DOITUONG').then(function (rows) { pat.fill(sel, rows, { id: 'ID', name: 'TEN', head: 'Chọn đối tượng' }); })
            .catch(function (err) { ums.api.handle(err, 'danh mục đối tượng'); });

        function luu() {
            if (!sel.value) { ui.toast('Vui lòng chọn đối tượng.', 'warn'); return; }
            ums.api.call(K.goi('dvThem', {
                strNH_CauHinh_TC_Nhom_Id: nhomId,
                strCore_Person_Id: '',
                strDoi_Tuong_ApDung_Id: sel.value,
                strGhiChu: gc.value
            })).then(function () {
                ui.toast('Thêm đối tượng thành công!', 'ok');
                dlg.close();
                sauLuu();
            }).catch(function (err) { ums.api.handle(err, 'thêm đối tượng'); });
        }
    }
})();
