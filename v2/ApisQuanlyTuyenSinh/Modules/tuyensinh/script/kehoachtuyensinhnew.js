/* =========================================================================
   Kế hoạch tuyển sinh (new) — danh sách + biểu mẫu KẾ HOẠCH TUYỂN SINH
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/kehoachtuyensinhnew.html
            + script/kehoachtuyensinhnew.js (13.832 dòng, vỏ indexi)
   Các màn con nằm ở _khtsn_*.js (xem chú thích đầu _khtsn_chung.js). Từ 30/9 (BO-CUC luật 1) các màn con có thêm / sửa
   bản ghi — Các đợt tuyển sinh, Phân công nhân sự, Kế hoạch đầu ra, Kết quả đăng ký, Khai danh mục hồ sơ — mở NGAY TRONG
   TRANG (ums.pat.formTrang): tầng một thay chỗ màn này (T.S.root), tầng hai (mở từ "Các đợt") thay chỗ thân màn con đợt.
   Việc phụ vẫn là hộp thoại: Tra cứu người học, Đọc từ API, Đổi nguyện vọng đầu vào.
   ---------------------------------------------------------------------------
   Lời gọi (TS_Core_KeHoach_MH / PKG_CORE_TS_KEHOACH, func + iM — chép nguyên):
     Pr_Ts_KH_TuyenSinh_Get_List   danh sách (strTuKhoa, strLoai_TuyenSinh_Id, strTs_PhuongAn_TuyenSinh_Id,
                                   strNam_TuyenSinh, strNam_Hoc, strHoc_Ky, strPlan_Status_Code, dIs_Active)
     Pr_Ts_KH_TuyenSinh_Get_By_Id  chi tiết (strId)
     Pr_Ts_KeHoach_TuyenSinh_Create / _Update / _Delete
     Pr_Ts_Loai_TuyenSinh_Get_Ds, Pr_Ts_PA_TuyenSinh_Get_Ds (strTuKhoa '', dIs_Active 1)
     Danh mục TS.KEHOACH.TINHTRANG (giá trị = MA vì danh sách nhận strPlan_Status_Code)
     NS_CoCauToChuc/LayDanhSach (GET) — ba ô đơn vị (ums.khts.nguonDonVi)
     Mẫu báo cáo / import (getList_MauImport "zonebtnBaoCao_KHTS2") → ums.report.mount, kèm
     strSinhVienID / strHoSoID của các dòng đang tick ở bảng Kết quả đăng ký.
   Bố cục như gốc: MỘT cột — thanh lọc + bảng kế hoạch; cột "Xem" mở các màn con (trong trang).
   Khác gốc về cách dựng: Thêm / Xem-sửa kế hoạch là biểu mẫu thay chỗ danh sách
   (gốc: hộp #chi-tiet) — BO-CUC luật 1; nút "Chi tiết" cuối dòng → nút Sửa chuẩn của bảng.
   Tự chốt (gốc không rõ / lỗi):
     · Ô "Còn hiệu lực không" trong biểu mẫu: gốc có ô nhưng Create/Update KHÔNG gửi dIs_Active
       → hiện dạng chỉ xem (không cho tick một ô không có tác dụng).
     · Mã + Tên bắt buộc (gốc không kiểm, gửi rỗng lên máy chủ). Mã khoá khi Sửa (_khoaMaKeHoach).
     · "Quy định phí", "Mẫu khai hồ sơ": gốc trỏ tới hộp #quy-dinh-phi / #mau-khai-hs KHÔNG tồn tại
       → giữ nút, khoá. Ô "Mẫu hồ sơ" gốc không nạp danh sách nào → giữ ô trống như gốc.
     · Đổi ô chọn lọc là tự tìm (khung chung ums.crud); Enter trong ô chữ = Tìm kiếm như gốc.
   Pull 29/9 (gốc v1.0.13.1): thay đổi nằm cả ở hộp "Kết quả đăng ký" — xem đầu _khtsn_kqdk.js (17 cột bổ sung ở chế độ
     Đầy đủ + tệp xuất, xuất đúng danh sách đang lọc, sửa phễu lọc khi gõ tìm, ghim thanh công cụ). Tệp này không đổi mã.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, K = ums.khts, T = ums.khtsn;
    var root = document.getElementById('kehoachtuyensinhnew');
    if (!root || !T) return;
    var e = T.e;
    T.S.root = root;       // vùng gốc để các màn con (_khtsn_*.js) mở NGAY TRONG TRANG bằng ums.pat.formTrang

    var HIEULUC = [{ ID: '1', TEN: 'Còn hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }];
    var nguonLoai = { call: { action: T.TS + 'ETMeFTIeDS4gKB4VNDgkLxIoLykeBiQ1HgUy', func: T.PTS + 'Pr_Ts_Loai_TuyenSinh_Get_Ds', strTuKhoa: '', dIs_Active: 1 }, id: 'ID', name: 'TEN' };
    var nguonPA = { call: { action: T.TS + 'ETMeFTIeEQAeFTQ4JC8SKC8pHgYkNR4FMgPP', func: T.PTS + 'Pr_Ts_PA_TuyenSinh_Get_Ds', strTuKhoa: '', dIs_Active: 1 }, id: 'ID', name: 'TEN' };
    var nguonTT = { dm: T.DM.TINHTRANG_KH, id: 'MA', name: 'TEN' };
    var ds = { loai: [], pa: [], tt: [] };

    function tenId(arr, id) { return T.tenTheoId(arr, id); }
    function ck(key, label, col) { return { key: key, label: label, on: 1, off: 0, get: function (d) { return d[col] == 1 ? 1 : 0; } }; } // eslint-disable-line eqeqeq

    var main = ums.crud({
        root: root,
        title: 'Kế hoạch tuyển sinh (new)',
        listTitle: 'Danh sách kế hoạch tuyển sinh',
        formTitle: 'kế hoạch tuyển sinh',
        icon: 'fa-list-timeline',
        empty: 'Không có dữ liệu',
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'loai', type: 'select', label: 'Loại nguồn tuyển sinh', source: nguonLoai },
            { key: 'pa', type: 'select', label: 'Phương án tuyển sinh', source: nguonPA },
            { key: 'nam', type: 'text', label: 'Năm tuyển sinh' },
            { key: 'namHoc', type: 'text', label: 'Năm học' },
            { key: 'hocKy', type: 'text', label: 'Học kỳ' },
            { key: 'tt', type: 'select', label: 'Tình trạng kế hoạch', source: nguonTT },
            { key: 'hl', type: 'select', label: 'Còn hiệu lực không', source: { items: HIEULUC } }
        ],
        toolbar: [
            { text: 'Tra cứu người học', icon: 'fa-magnifying-glass', mod: 'out-warn', onClick: function () { T.moTraCuu(); } }
        ],
        list: {
            call: function (f) {
                return T.goi(T.TS + 'ETMeFTIeCgkeFTQ4JC8SKC8pHgYkNR4NKDI1', T.PTS + 'Pr_Ts_KH_TuyenSinh_Get_List', {
                    strTuKhoa: f.q, strLoai_TuyenSinh_Id: f.loai, strTs_PhuongAn_TuyenSinh_Id: f.pa,
                    strNam_TuyenSinh: f.nam, strNam_Hoc: f.namHoc, strHoc_Ky: f.hocKy,
                    strPlan_Status_Code: f.tt, dIs_Active: f.hl
                }, 'XEM');
            }
        },
        onLoad: function (rows) { T.S.dtKH = rows || []; },
        columns: [
            { title: 'Mã', cls: 'is-nowrap', render: function (d) { return ui.esc(T.pick(d, ['MA', 'Ma', 'KEHOACH_MA'])); } },
            { title: 'Tên', render: function (d) { return T.rong(T.pick(d, ['TEN', 'Ten', 'KEHOACH_TEN'])); } },
            { title: 'Loại nguồn tuyển sinh', render: function (d) {
                return ui.esc(T.pick(d, ['LOAITUYENSINH_TEN', 'LOAI_TUYENSINH_TEN', 'LOAI_TUYENSINH_Ten']) || tenId(ds.loai, d.LOAI_TUYENSINH_ID)); } },
            { title: 'Phương án tuyển sinh', render: function (d) {
                return ui.esc(T.pick(d, ['PHUONGANTUYENSINH_TEN', 'TS_PHUONGAN_TUYENSINH_TEN', 'TS_PHUONGAN_TUYENSINH_Ten']) || tenId(ds.pa, d.TS_PHUONGAN_TUYENSINH_ID)); } },
            { title: 'Năm tuyển sinh', cls: 'is-center', prop: 'NAM_TUYENSINH' },
            { title: 'Năm học', cls: 'is-center', prop: 'NAM_HOC' },
            { title: 'Học kỳ', cls: 'is-center', prop: 'HOC_KY' },
            { title: 'Các đợt tuyển sinh', cls: 'is-center', render: function (d) { return T.nutXem('dot', T.id(d)); } },
            { title: 'Phân công nhân sự', cls: 'is-center', render: function (d) { return T.nutXem('nhansu', T.id(d)); } },
            { title: 'Kế hoạch đầu ra', cls: 'is-center', render: function (d) { return T.nutXem('daura', T.id(d)); } },
            { title: 'Quy định phí', cls: 'is-center', render: function (d) { return T.nutXem('phi', T.id(d), 'Xem', true); } },
            { title: 'Mẫu khai hồ sơ', cls: 'is-center', render: function (d) { return T.nutXem('maukhai', T.id(d), 'Xem', true); } },
            { title: 'Kết quả đăng ký', cls: 'is-center', render: function (d) { return T.nutXem('kqdk', T.id(d)); } },
            { title: 'Tình trạng kế hoạch', render: function (d) {
                return ui.esc(T.pick(d, ['TINHTRANG_TEN', 'PLAN_STATUS_Name', 'PLAN_STATUS_TEN']) || T.tenTheoMa(ds.tt, d.PLAN_STATUS_CODE)); } },
            { title: 'Có public ko', cls: 'is-center', render: function (d) { return K.co(d.IS_PUBLIC, 'bad'); } },
            { title: 'Có khóa không', cls: 'is-center', render: function (d) { return K.co(d.IS_LOCKED, 'bad'); } },
            { title: 'Hiệu lực', cls: 'is-center', render: function (d) { return K.co(d.IS_ACTIVE, 'bad'); } },
            { title: 'Người tạo', cls: 'is-nowrap', prop: 'NGUOITAO_TEN' },
            { title: 'Ngày tạo', cls: 'is-center is-nowrap', prop: 'NGAYTAO' }
        ],

        detail: function (row) {
            return T.goi(T.TS + 'ETMeFTIeCgkeFTQ4JC8SKC8pHgYkNR4DOB4IJQPP', T.PTS + 'Pr_Ts_KH_TuyenSinh_Get_By_Id', { strId: row.ID }, 'XEM');
        },
        fields: [
            { type: 'legend', label: 'Thông tin chung' },
            { key: 'strMa', label: 'Mã', required: true, readonlyEdit: true, get: function (d) { return T.pick(d, ['MA', 'Ma', 'KEHOACH_MA']); } },
            { key: 'strTen', label: 'Tên', required: true, get: function (d) { return T.pick(d, ['TEN', 'Ten', 'KEHOACH_TEN']); } },
            { key: 'strLoai_TuyenSinh_Id', label: 'Loại nguồn tuyển sinh', type: 'select', placeholder: 'Chọn loại nguồn tuyển sinh', source: nguonLoai, col: 'LOAI_TUYENSINH_ID' },
            { key: 'strTs_PhuongAn_TuyenSinh_Id', label: 'Phương án tuyển sinh', type: 'select', placeholder: 'Chọn phương án tuyển sinh', source: nguonPA, col: 'TS_PHUONGAN_TUYENSINH_ID' },
            { key: 'strNam_TuyenSinh', label: 'Năm tuyển sinh', col: 'NAM_TUYENSINH' },
            { key: 'strNam_Hoc', label: 'Năm học', col: 'NAM_HOC' },
            { key: 'strHoc_Ky', label: 'Học kỳ', col: 'HOC_KY' },
            { type: 'checks', label: 'Cấu hình', span: true, items: [
                ck('dRequire_Account', 'Tạo tài khoản để đăng ký', 'REQUIRE_ACCOUNT'),
                ck('dAllow_Online_Register', 'Cho thí sinh tự đăng ký trực tuyến', 'ALLOW_ONLINE_REGISTER'),
                ck('dAllow_Direct_Input', 'Cho phép cán bộ nhập hồ sơ', 'ALLOW_DIRECT_INPUT'),
                ck('dAllow_Import', 'Cho phép Import nguồn từ ngoài', 'ALLOW_IMPORT'),
                ck('dAllow_Api', 'Cho phép đọc từ API', 'ALLOW_API'),
                ck('dRequire_Approval', 'Yêu cầu cán bộ duyệt', 'REQUIRE_APPROVAL'),
                ck('dRequire_Document_Check', 'Yêu cầu kiểm tra hồ sơ', 'REQUIRE_DOCUMENT_CHECK'),
                ck('dRequire_Pay_Before_Intake', 'Yêu cầu thanh toán trước khi hoàn tất', 'REQUIRE_PAY_BEFORE_INTAKE'),
                ck('dAllow_Change_Output', 'Có được phép thay đổi đầu ra sau khi trúng tuyển không', 'ALLOW_CHANGE_OUTPUT'),
                // Kiểm soát trùng hồ sơ: gửi '1' / '' vào strHoso_Unique_Scope_Code, đọc lên = có giá trị hay không
                { key: 'strHoso_Unique_Scope_Code', label: 'Kiểm soát trùng hồ sơ', on: '1', off: '',
                  get: function (d) { return e(d.HOSO_UNIQUE_SCOPE_CODE) !== '' ? 1 : 0; } }
            ] },
            { type: 'legend', label: 'Hồ sơ và chỉ tiêu' },
            { key: 'dMax_Hoso_Per_Person', label: 'Số hồ sơ tối đa được khai', col: 'MAX_HOSO_PER_PERSON' },
            { key: 'strForm_Layout_Id', label: 'Mẫu hồ sơ', type: 'select', placeholder: 'Chọn mẫu hồ sơ', source: { items: [] }, col: 'FORM_LAYOUT_ID' },
            { key: 'strOwner_Org_Id', label: 'Đơn vị quản lý kế hoạch', type: 'select', placeholder: 'Chọn đơn vị quản lý kế hoạch', source: K.nguonDonVi, col: 'OWNER_ORG_ID' },
            { key: 'strManage_Org_Id', label: 'Đơn vị quản lý hồ sơ', type: 'select', placeholder: 'Chọn đơn vị quản lý hồ sơ', source: K.nguonDonVi, col: 'MANAGE_ORG_ID' },
            { key: 'strReceive_Org_Id', label: 'Đơn vị tiếp nhận hồ sơ', type: 'select', placeholder: 'Chọn đơn vị tiếp nhận hồ sơ', source: K.nguonDonVi, col: 'RECEIVE_ORG_ID' },
            { key: 'dChi_Tieu', label: 'Chỉ tiêu', col: 'CHI_TIEU' },
            { key: '_sdk', label: 'Số đã đăng ký', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_DANGKY) || 0; } },
            { key: '_snhs', label: 'Số đã nộp hồ sơ', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_NOP_HOSO) || 0; } },
            { key: '_stt', label: 'Số đã trúng tuyển', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_TRUNGTUYEN) || 0; } },
            { key: '_stn', label: 'Số đã tiếp nhận', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_TIEPNHAN) || 0; } },
            { key: '_snh', label: 'Số đã nhập học', type: 'static', value: '0', get: function (d) { return e(d.SO_DA_NHAPHOC) || 0; } },
            { key: 'strPlan_Status_Code', label: 'Tình trạng kế hoạch', type: 'select', placeholder: 'Chọn tình trạng kế hoạch', source: nguonTT, col: 'PLAN_STATUS_CODE' },
            { type: 'legend', label: 'Trạng thái' },
            { type: 'checks', span: true, items: [
                ck('dIs_Public', 'Có mở public không', 'IS_PUBLIC'),
                ck('dIs_Locked', 'Có khóa không', 'IS_LOCKED')
            ] },
            { key: '_hl', label: 'Còn hiệu lực không (chỉ xem — gốc không gửi ô này khi lưu)', type: 'static', value: 'Còn hiệu lực',
              get: function (d) { return d.IS_ACTIVE == 1 ? 'Còn hiệu lực' : 'Hết hiệu lực'; } }, // eslint-disable-line eqeqeq
            { key: 'strGhiChu', label: 'Ghi chú', type: 'textarea', span: true, col: 'GHICHU' }
        ],
        save: function (v, row) {
            var o = {
                strMa: v.strMa, strTen: v.strTen,
                strLoai_TuyenSinh_Id: v.strLoai_TuyenSinh_Id, strTs_PhuongAn_TuyenSinh_Id: v.strTs_PhuongAn_TuyenSinh_Id,
                strNam_TuyenSinh: v.strNam_TuyenSinh, strNam_Hoc: v.strNam_Hoc, strHoc_Ky: v.strHoc_Ky,
                dRequire_Account: v.dRequire_Account, dAllow_Online_Register: v.dAllow_Online_Register,
                dAllow_Direct_Input: v.dAllow_Direct_Input, dAllow_Import: v.dAllow_Import, dAllow_Api: v.dAllow_Api,
                dRequire_Approval: v.dRequire_Approval, dRequire_Document_Check: v.dRequire_Document_Check,
                dRequire_Pay_Before_Intake: v.dRequire_Pay_Before_Intake, dAllow_Change_Output: v.dAllow_Change_Output,
                strHoso_Unique_Scope_Code: v.strHoso_Unique_Scope_Code,
                dMax_Hoso_Per_Person: v.dMax_Hoso_Per_Person,
                strForm_Layout_Id: v.strForm_Layout_Id, strForm_Version_No: '',
                strOwner_Org_Id: v.strOwner_Org_Id, strManage_Org_Id: v.strManage_Org_Id, strReceive_Org_Id: v.strReceive_Org_Id,
                dChi_Tieu: v.dChi_Tieu, strPlan_Status_Code: v.strPlan_Status_Code,
                dIs_Public: v.dIs_Public, dIs_Locked: v.dIs_Locked, strGhiChu: v.strGhiChu
            };
            if (row) {
                o.strId = row.ID;
                return T.goi(T.TS + 'ETMeFTIeCiQJLiAiKR4VNDgkLxIoLykeFDElIDUk', T.PTS + 'Pr_Ts_KeHoach_TuyenSinh_Update', o, 'SUA');
            }
            return T.goi(T.TS + 'ETMeFTIeCiQJLiAiKR4VNDgkLxIoLykeAjMkIDUk', T.PTS + 'Pr_Ts_KeHoach_TuyenSinh_Create', o, 'THEM');
        },
        remove: function (ids) {
            return T.goi(T.TS + 'ETMeFTIeCiQJLiAiKR4VNDgkLxIoLykeBSQtJDUk', T.PTS + 'Pr_Ts_KeHoach_TuyenSinh_Delete', { strId: ids[0] }, 'XOA');
        },
        rowDelete: false,
        multi: false,
        removeConfirm: function () { return 'Bạn có chắc chắn xóa kế hoạch này không?'; }
    });

    /* Tên loại / phương án / tình trạng cho bảng (API không join sẵn *_TEN) */
    Promise.all([ums.crud.loadSource(nguonLoai), ums.crud.loadSource(nguonPA), ums.crud.loadSource(nguonTT)]).then(function (x) {
        ds.loai = x[0] || []; ds.pa = x[1] || []; ds.tt = x[2] || [];
        if (main.rows.length) main.draw();
    }).catch(function () { /* thiếu tên thì để trống như gốc */ });

    /* Mẫu báo cáo / Import (zonebtnBaoCao_KHTS2) — đặt trước nút "Thêm mới" ở đầu trang */
    var nutTrang = main.z('actions');
    if (nutTrang) {
        var bc = document.createElement('div');
        bc.className = 'ums-row';
        nutTrang.insertBefore(bc, nutTrang.firstChild);
        ums.report.mount(bc, { collect: function (add) { T.themThamSoBaoCao(add, main.filterValues()); } });
    }
    T.locChinh = function () { return main.filterValues(); };
    T.themThamSoBaoCao = function (add, f) {
        f = f || main.filterValues();
        add('strTuKhoa', f.q); add('strLoai_TuyenSinh_Id', f.loai); add('strTs_PhuongAn_TuyenSinh_Id', f.pa);
        add('strNam_TuyenSinh', f.nam); add('strNam_Hoc', f.namHoc); add('strHoc_Ky', f.hocKy);
        add('strPlan_Status_Code', f.tt); add('dIs_Active', f.hl);
        var chon = T.kqDaTick ? T.kqDaTick() : { person: [], hoso: [] };
        add('strSinhVienID', chon.person.join(','));
        add('strHoSoID', chon.hoso.join(','));
    };

    /* ---------- Nút "Xem" trên dòng → các màn con (thay chỗ màn này) ---------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-xem]');
        if (!b || !root.contains(b) || b.disabled) return;
        if (b.closest('.ums-formtrang')) return;      // nút "Xem" của bảng ĐỢT trong màn con — _khtsn_dot.js tự xử lý
        var id = b.getAttribute('data-id');
        var kh = main.rows.filter(function (r) { return String(r.ID) === id; })[0] || { ID: id };
        T.S.khId = id;
        var k = b.getAttribute('data-xem');
        if (k === 'dot') T.moDot(kh);
        else if (k === 'nhansu') T.moPhanCong(kh);
        else if (k === 'daura') T.moDauRa(kh, null);
        else if (k === 'kqdk') T.moKQDK({ kh: kh, dot: '', mode: 'list' });
    });
})();
