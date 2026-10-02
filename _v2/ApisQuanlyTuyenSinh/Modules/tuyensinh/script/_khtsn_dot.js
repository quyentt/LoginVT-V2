/* =========================================================================
   ums.khtsn.moDot(kh) — màn con "Các đợt tuyển sinh" của một kế hoạch (mở trong trang, thay chỗ T.S.root)
   Bản gốc: modal #dot-tuyen-sinh (danh sách) + #them-moi-dot (Thêm / Xem-sửa đợt)
   ---------------------------------------------------------------------------
   Lời gọi (TS_Core_KeHoach_MH / PKG_CORE_TS_KEHOACH):
     Pr_Ts_Kh_Ts_Dot_Get_Ds     strTuKhoa '', strTs_KeHoach_TuyenSinh_Id, strDot_Status_Code '', dIs_Active ''
     Pr_Ts_Kh_Ts_Dot_Get_By_Id  strId
     Pr_Ts_Kh_Ts_Dot_Ins / _Upd / _Del  (tên tham số chép nguyên — dDot_No, strNgay_BD_XacNhan_NhapHoc…)
     Danh mục TS.KEHOACH.DOT.KIEUDOT, TS.KEHOACH.DOT.TINHTRANG (giá trị = MA)
   Nút cuối hộp của gốc → nút đầu khung danh sách: Đọc từ API · Import trúng tuyển · Khai trực tiếp
   hồ sơ · Thêm mới (ba nút đầu KHÔNG mang đợt → phạm vi cả kế hoạch, như gốc).
   Nút trên dòng: Kế hoạch đầu ra (mức ĐỢT — cho thêm đầu ra), Kết quả đăng ký (theo đợt),
   Khai (danh mục hồ sơ giấy tờ của đợt). "Phương thức tuyển" / "Mẫu khai hồ sơ": gốc trỏ tới hộp
   KHÔNG tồn tại (#phuong-thuc-tuyen, #mau-khai-hs) → giữ nút, khoá.
   Thêm / Xem-sửa đợt: biểu mẫu thay chỗ danh sách đợt (gốc: hộp chồng hộp). "Đọc từ API" vẫn là hộp thoại (việc phụ).
   Tự chốt: Ins gửi dSo_Da_* = 0 (gốc đọc 5 nhãn "Số đã…" — lúc thêm mới luôn là 0); Upd không gửi (như gốc).
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, K = ums.khts, T = ums.khtsn;
    var e = T.e;

    function ck(key, label, col, mac) {
        return { key: key, label: label, on: 1, off: 0, value: mac ? 1 : undefined, get: function (d) { return d[col] == 1 ? 1 : 0; } }; // eslint-disable-line eqeqeq
    }

    T.moDot = function (kh) {
        var khId = T.id(kh);
        T.S.khId = khId;
        var dsKieu = [], dsTT = [];
        /* Màn con NGAY TRONG TRANG, thay chỗ màn kế hoạch (BO-CUC luật 1; trước 30/9 là hộp thoại lớn).
           Các màn con mở tiếp từ đây (Kế hoạch đầu ra, Kết quả đăng ký, Khai danh mục hồ sơ) là tầng hai: thay chỗ THÂN của khung này. */
        var ft = T.moTrang({
            host: T.S.root,
            title: 'Các đợt tuyển sinh' + (T.tenKH(kh) ? ' — ' + T.tenKH(kh) : ''), icon: 'fa-users', cols: 1,
            body: '<div data-khtsn="dot"></div>'
        });
        var host = ft.body.querySelector('[data-khtsn="dot"]');
        var nguonKieu = { dm: T.DM.KIEUDOT, id: 'MA', name: 'TEN' };
        var nguonTT = { dm: T.DM.TINHTRANG_DOT, id: 'MA', name: 'TEN' };

        function nutXem(k, d, khoa) {
            var ten = T.tenMa(d.TEN || d.Ten || '', d.MA || d.Ma || '');
            return T.nutXem(k, T.id(d), k === 'qdhs' ? 'Khai' : 'Xem', khoa, k === 'qdhs' ? { 'data-ten': ten } : null);
        }
        function ngay(k) { return { key: k[0], label: k[1], type: 'date', col: k[2] }; }

        var crud = ums.crud({
            root: host,
            embedded: true,
            title: 'Các đợt tuyển sinh',
            icon: 'fa-users',
            formTitle: 'đợt tuyển sinh',
            empty: 'Không có dữ liệu',
            toolbar: [
                { text: 'Đọc từ API', icon: 'fa-cloud-arrow-down', mod: 'out-warn', onClick: function () { T.moDocAPI(kh); } },
                { text: 'Import trúng tuyển', icon: 'fa-cloud-arrow-up', mod: 'out-info', onClick: function () { T.moKQDK({ kh: kh, dot: '', mode: 'import', host: ft.body }); } },
                { text: 'Khai trực tiếp hồ sơ', icon: 'fa-pen-to-square', mod: 'out-info', onClick: function () { T.moKQDK({ kh: kh, dot: '', mode: 'khai', host: ft.body }); } }
            ],
            list: {
                call: function () {
                    return T.goi(T.TS + 'ETMeFTIeCikeFTIeBS41HgYkNR4FMgPP', T.PTS + 'Pr_Ts_Kh_Ts_Dot_Get_Ds', {
                        strTuKhoa: '', strTs_KeHoach_TuyenSinh_Id: khId, strDot_Status_Code: '', dIs_Active: ''
                    });
                }
            },
            onLoad: function (rows) { T.S.dtDot = rows || []; T.S.dtDotKH = khId; },
            columns: [
                { title: 'Mã', cls: 'is-nowrap', render: function (d) { return ui.esc(d.MA || d.Ma || ''); } },
                { title: 'Tên', render: function (d) { return T.rong(d.TEN || d.Ten || ''); } },
                { title: 'Kiểu đợt', render: function (d) { return ui.esc(d.DOT_TYPE_CODE_Ten || d.KIEUDOT_TEN || T.tenTheoMa(dsKieu, d.DOT_TYPE_CODE)); } },
                { title: 'Ngày bắt đầu đăng ký', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(d.NGAY_BATDAU_DANGKY || d.Ngay_BatDau_DangKy || ''); } },
                { title: 'Ngày kết thúc đăng ký', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(d.NGAY_KETTHUC_DANGKY || d.Ngay_KetThuc_DangKy || ''); } },
                { title: 'Phương thức tuyển', cls: 'is-center', render: function (d) { return nutXem('phuongthuc', d, true); } },
                { title: 'Kế hoạch đầu ra', cls: 'is-center', render: function (d) { return nutXem('daura', d); } },
                { title: 'Mẫu khai hồ sơ', cls: 'is-center', render: function (d) { return nutXem('maukhai', d, true); } },
                { title: 'Kết quả đăng ký', cls: 'is-center', render: function (d) { return nutXem('kqdk', d); } },
                { title: 'Khai danh mục hồ sơ', cls: 'is-center', render: function (d) { return nutXem('qdhs', d); } },
                { title: 'Tình trạng kế hoạch', render: function (d) { return ui.esc(d.DOT_STATUS_CODE_Ten || d.TINHTRANG_TEN || T.tenTheoMa(dsTT, d.DOT_STATUS_CODE)); } },
                { title: 'Có public ko', cls: 'is-center', render: function (d) { return K.co(d.IS_PUBLIC, 'bad'); } },
                { title: 'Có khóa không', cls: 'is-center', render: function (d) { return K.co(d.IS_LOCKED, 'bad'); } },
                { title: 'Hiệu lực', cls: 'is-center', render: function (d) { return K.co(d.IS_ACTIVE, 'bad'); } },
                { title: 'Người tạo', cls: 'is-nowrap', render: function (d) { return ui.esc(d.NGUOITAO_TaiKhoan || d.NGUOITAO_TEN || d.NGUOI_TAO || d.NguoiTao || ''); } },
                { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(d.NgayTao_dd_mm_yyyy_hhmmss || d.NGAY_TAO || d.NgayTao || ''); } }
            ],
            detail: function (row) {
                return T.goi(T.TS + 'ETMeFTIeCikeFTIeBS41HgYkNR4DOB4IJQPP', T.PTS + 'Pr_Ts_Kh_Ts_Dot_Get_By_Id', { strId: row.ID });
            },
            fields: [
                { type: 'legend', label: 'Thông tin chung' },
                { key: 'strMa', label: 'Mã', get: function (d) { return d.Ma || d.MA || ''; } },
                { key: 'strTen', label: 'Tên', get: function (d) { return d.Ten || d.TEN || ''; } },
                { key: 'dDot_No', label: 'Số đợt thứ', col: 'DOT_NO' },
                { key: 'strDot_Type_Code', label: 'Phân loại đợt', type: 'select', placeholder: 'Chọn phân loại đợt', source: nguonKieu, col: 'DOT_TYPE_CODE' },
                { type: 'legend', label: 'Các mốc thời gian' },
                ngay(['strNgay_BatDau_DangKy', 'Ngày bắt đầu đăng ký', 'NGAY_BATDAU_DANGKY']),
                ngay(['strNgay_KetThuc_DangKy', 'Ngày kết thúc đăng ký', 'NGAY_KETTHUC_DANGKY']),
                ngay(['strNgay_BatDau_Nop_HoSo', 'Ngày bắt đầu nộp hồ sơ', 'NGAY_BATDAU_NOP_HOSO']),
                ngay(['strNgay_KetThuc_Nop_HoSo', 'Ngày kết thúc nộp hồ sơ', 'NGAY_KETTHUC_NOP_HOSO']),
                ngay(['strNgay_BatDau_XuLy', 'Ngày bắt đầu xử lý', 'NGAY_BATDAU_XULY']),
                ngay(['strNgay_KetThuc_XuLy', 'Ngày kết thúc xử lý', 'NGAY_KETTHUC_XULY']),
                ngay(['strNgay_CongBo_KetQua', 'Ngày công bố kết quả', 'NGAY_CONGBO_KETQUA']),
                { type: 'gap' },
                ngay(['strNgay_BD_XacNhan_NhapHoc', 'Ngày bắt đầu xác nhận nhập học', 'NGAY_BD_XACNHAN_NHAPHOC']),
                ngay(['strNgay_KT_XacNhan_NhapHoc', 'Ngày kết thúc xác nhận nhập học', 'NGAY_KT_XACNHAN_NHAPHOC']),
                { type: 'checks', label: 'Yêu cầu', span: true, items: [
                    ck('dRequire_Approval_In_Dot', 'Yêu cầu cán bộ duyệt', 'REQUIRE_APPROVAL_IN_DOT'),
                    ck('dRequire_Document_In_Dot', 'Yêu cầu kiểm tra hồ sơ', 'REQUIRE_DOCUMENT_IN_DOT'),
                    ck('dRequire_Payment_In_Dot', 'Yêu cầu thanh toán trước khi hoàn tất', 'REQUIRE_PAYMENT_IN_DOT'),
                    ck('dAllow_Change_OP_In_Dot', 'Có được phép thay đổi đầu ra sau khi trúng tuyển không', 'ALLOW_CHANGE_OP_IN_DOT')
                ] },
                { type: 'legend', label: 'Hồ sơ và chỉ tiêu' },
                { key: 'strForm_Layout_Id', label: 'Mẫu hồ sơ', type: 'select', placeholder: 'Chọn mẫu hồ sơ', source: { items: [] }, col: 'FORM_LAYOUT_ID' },
                { key: 'dChi_Tieu', label: 'Chỉ tiêu', type: 'number', col: 'CHI_TIEU' },
                { key: 'dChi_Tieu_Toi_Thieu', label: 'Chỉ tiêu tối thiểu', type: 'number', col: 'CHI_TIEU_TOI_THIEU' },
                { key: 'dChi_Tieu_Toi_Da', label: 'Chỉ tiêu tối đa', type: 'number', col: 'CHI_TIEU_TOI_DA' },
                { key: '_sdk', label: 'Số đã đăng ký', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_DANGKY) || 0; } },
                { key: '_snhs', label: 'Số đã nộp hồ sơ', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_NOP_HOSO) || 0; } },
                { key: '_stt', label: 'Số đã trúng tuyển', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_TRUNGTUYEN) || 0; } },
                { key: '_stn', label: 'Số đã tiếp nhận', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_TIEPNHAN) || 0; } },
                { key: '_snh', label: 'Số đã nhập học', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_NHAPHOC) || 0; } },
                { key: 'strDot_Status_Code', label: 'Tình trạng đợt', type: 'select', placeholder: 'Chọn tình trạng đợt', source: nguonTT, col: 'DOT_STATUS_CODE' },
                { type: 'legend', label: 'Trạng thái' },
                { type: 'checks', span: true, items: [
                    ck('dIs_Public', 'Có mở public không', 'IS_PUBLIC'),
                    ck('dIs_Locked', 'Có khóa không', 'IS_LOCKED'),
                    ck('dIs_Active', 'Còn hiệu lực không', 'IS_ACTIVE', true)
                ] },
                { key: 'strGhiChu', label: 'Ghi chú', type: 'textarea', span: true, col: 'GHICHU' }
            ],
            save: function (v, row) {
                if (!row && !khId) { ui.toast('Vui lòng chọn kế hoạch tuyển sinh trước khi thêm đợt', 'warn'); return null; }
                var o = {
                    strTs_KeHoach_TuyenSinh_Id: khId,
                    strTen: v.strTen, strMa: v.strMa, dDot_No: v.dDot_No, strDot_Type_Code: v.strDot_Type_Code,
                    strNgay_BatDau_DangKy: v.strNgay_BatDau_DangKy, strNgay_KetThuc_DangKy: v.strNgay_KetThuc_DangKy,
                    strNgay_BatDau_Nop_HoSo: v.strNgay_BatDau_Nop_HoSo, strNgay_KetThuc_Nop_HoSo: v.strNgay_KetThuc_Nop_HoSo,
                    strNgay_BatDau_XuLy: v.strNgay_BatDau_XuLy, strNgay_KetThuc_XuLy: v.strNgay_KetThuc_XuLy,
                    strNgay_CongBo_KetQua: v.strNgay_CongBo_KetQua,
                    strNgay_BD_XacNhan_NhapHoc: v.strNgay_BD_XacNhan_NhapHoc, strNgay_KT_XacNhan_NhapHoc: v.strNgay_KT_XacNhan_NhapHoc,
                    strNgay_BatDau_NhapHoc: '', strNgay_KetThuc_NhapHoc: '',
                    dRequire_Approval_In_Dot: v.dRequire_Approval_In_Dot, dRequire_Payment_In_Dot: v.dRequire_Payment_In_Dot,
                    dRequire_Document_In_Dot: v.dRequire_Document_In_Dot, dAllow_Change_OP_In_Dot: v.dAllow_Change_OP_In_Dot,
                    strForm_Layout_Id: v.strForm_Layout_Id, dForm_Version_No: '',
                    dChi_Tieu: v.dChi_Tieu, dChi_Tieu_Toi_Thieu: v.dChi_Tieu_Toi_Thieu, dChi_Tieu_Toi_Da: v.dChi_Tieu_Toi_Da
                };
                if (!row) { o.dSo_Da_DangKy = 0; o.dSo_Da_Nop_HoSo = 0; o.dSo_Da_TrungTuyen = 0; o.dSo_Da_TiepNhan = 0; o.dSo_Da_NhapHoc = 0; }
                o.strDot_Status_Code = v.strDot_Status_Code;
                o.dIs_Public = v.dIs_Public; o.dIs_Default = 0; o.dIs_Locked = v.dIs_Locked; o.dIs_Active = v.dIs_Active;
                o.strGhiChu = v.strGhiChu;
                if (row) {
                    o.strId = row.ID;
                    return T.goi(T.TS + 'ETMeFTIeCikeFTIeBS41HhQxJQPP', T.PTS + 'Pr_Ts_Kh_Ts_Dot_Upd', o, 'SUA');
                }
                return T.goi(T.TS + 'ETMeFTIeCikeFTIeBS41HggvMgPP', T.PTS + 'Pr_Ts_Kh_Ts_Dot_Ins', o, 'THEM');
            },
            remove: function (ids) {
                return T.goi(T.TS + 'ETMeFTIeCikeFTIeBS41HgUkLQPP', T.PTS + 'Pr_Ts_Kh_Ts_Dot_Del', { strId: ids[0] }, 'XOA');
            },
            rowDelete: false,
            multi: false,
            removeConfirm: function () { return 'Bạn có chắc chắn xóa đợt này không?'; }
        });

        Promise.all([ums.crud.loadSource(nguonKieu), ums.crud.loadSource(nguonTT)]).then(function (x) {
            dsKieu = x[0] || []; dsTT = x[1] || [];
            if (crud.rows.length) crud.draw();
        }).catch(function () { /* thiếu tên thì hiện mã */ });

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xem]');
            if (!b || !host.contains(b) || b.disabled) return;
            var id = b.getAttribute('data-id');
            var dot = crud.rows.filter(function (r) { return String(r.ID) === id; })[0] || { ID: id };
            var k = b.getAttribute('data-xem');
            if (k === 'daura') T.moDauRa(kh, dot, ft.body);
            else if (k === 'kqdk') T.moKQDK({ kh: kh, dot: id, mode: 'list', host: ft.body });
            else if (k === 'qdhs') T.moQDHS(dot, b.getAttribute('data-ten') || '', ft.body);
        });
        return { form: ft, crud: crud };
    };
})();
