/* =========================================================================
   Kế hoạch nhập học (new) — mở kế hoạch nhập học từ Kế hoạch tuyển sinh + Đợt
   Bản gốc: ApisNhapHoc/Modules/trungtuyen/html/kehoachtuyensinhnew.html
            + scripts/kehoachtuyensinhnew.js (vỏ index.aspx, Bootstrap 5)
   Khung chung với màn anh em ApisQuanlyTuyenSinh/…/kehoachtuyensinhnew: _khts.js
   (ums.khts — combo KH tuyển sinh / Đợt, đơn vị, màn con phân công nhân sự).
   ---------------------------------------------------------------------------
   Lời gọi (POST, func + iM — chép nguyên; strNguoiThucHien_Id / strVaiTroDangNhap_Id
   / strChucNangHeThong_Id để trống cho ums.api tự điền như makeRequest cũ):
     SV_Core_NhapHoc_MH / PKG_CORE_NHAPHOC.
       Pr_Nh_KhNhapHoc_GetDs · Pr_Nh_KhNhapHoc_GetById · Pr_Nh_KhNhapHoc_Them ·
       Pr_Nh_KhNhapHoc_Sua · Pr_Nh_KhNhapHoc_Xoa
       LayDS_NH_KeHoach_DauRa · Chuyen_KH_DauRa_TuTuyenSinh
       LayDS_NH_KeHoach_NhanSu · Them_NH_KeHoach_NhanSu · Sua_NH_KeHoach_NhanSu · Xoa_NH_KeHoach_NhanSu
     SV_CORE_NhapHoc_MH (chữ CORE hoa như gốc) · PKG_CORE_NHAPHOC.Sua_KeHoachDauRa_XacNhanCoSo
     TS_Core_KeHoach_MH · PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_List / Pr_Ts_Kh_Ts_Dot_Get_Ds (ums.khts)
     NS_CoCauToChuc/LayDanhSach (GET) — ba ô đơn vị (ums.khts.donVi)
     NS_HoSo_V2_MH · pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2 — bù tên nhân sự cho danh sách phân công
       (bản gốc: procedure LayDS_NH_KeHoach_NhanSu JOIN sai bảng nên PERSON_HOTEN/MA/DONVI_TEN rỗng)
     Danh mục: NH_KEHOACH_NHAPHOC.NHAPHOC_TYPE_CODE, NH_KEHOACH_NHAPHOC.STA (rỗng → 7 trạng thái viết cứng),
       NH_KEHOACH_NHANSU.VAITRO_NHAPHOC_CODE, NH_KEHOACH_NHANSU.PHANCONG_STATUS_CODE (rỗng → dự phòng viết cứng)
   Tên cột đọc theo đúng các cột dự phòng bản gốc dò (d.MA || d.MA_KEHOACH …).

   Bố cục: một cột — thanh lọc + bảng kế hoạch nhập học (như gốc). Khác gốc về CÁCH dựng:
     · Thêm / Xem-sửa kế hoạch: biểu mẫu thay chỗ danh sách (gốc: hộp toàn màn hình) — BO-CUC luật 1.
     · "Kế hoạch đầu ra" (chỉ xem + chạy thao tác): hộp thoại lớn (gốc: hộp toàn màn hình).
     · "Bố trí nhân sự": màn con NGAY TRONG TRANG, thay chỗ danh sách kế hoạch (ums.pat.formTrang,
       từ 30/9 — trước là hộp thoại lớn); Thêm / Xem-sửa là biểu mẫu thay chỗ danh sách phân công.
     · Hộp chọn nhân sự: ums.pat.pickNhanSu (cùng procedure LayDSNhanSu_HoSo_v2, lọc đơn vị
       + từ khoá, dLaCanBoNgoaiTruong mặc định 0 như gốc; có phân trang máy chủ — gốc lấy 5.000
       dòng một lần và bắt chọn đơn vị hoặc từ khoá trước khi tìm).
     · Luật cha → con: Kế hoạch TS → Đợt TS KHOÁ khi chưa chọn kế hoạch (thanh lọc và biểu mẫu).
   Tự chốt (gốc không rõ / lỗi):
     · Mở màn là nạp danh sách luôn (gốc để bảng trống tới khi bấm "Danh sách").
     · Ô lọc "Hiệu lực" gốc KHÔNG được đổ lựa chọn nào (luôn gửi 1) → đổ Còn / Hết hiệu lực, mặc định 1.
     · "Viết lại" khi đang Xem-sửa: về giá trị đang lưu (gốc xoá trắng cả biểu mẫu sửa → bấm
       Lưu là ghi đè trắng kế hoạch).
     · "Kết quả nhập học": gốc chỉ báo "sẽ bổ sung sau" → giữ nút, khoá.
     · "Khai mức phí": nhảy sang màn Khai mức phí thu nhập học (ums.app.openPath), vẫn đặt
       sessionStorage KHTSN_preselect_KHNH_Id như gốc để màn đích chọn sẵn kế hoạch.
     · Ô "Hiệu lực" trong Thêm nhân sự: gốc có ô nhưng KHÔNG gửi (Them_NH_KeHoach_NhanSu không
       có dIs_Active) → bỏ ô. Xem-sửa: hiện chỉ đọc như gốc.
   Cố ý bỏ: vá z-index hộp chồng Bootstrap 5, dựng lại select2 trong modal, lời gọi
     Pr_Ts_Kh_Ns_PhanCong_Get_By_Id "legacy" (mã chết sau return), hộp #modal-ChiTiet-KHTSN
     (không nơi nào mở).
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, K = ums.khts;
    var root = document.getElementById('kehoachtuyensinhnew');
    if (!root) return;
    var e = K.e, pick = K.pick;

    /* ---------- Lời gọi PKG_CORE_NHAPHOC ------------------------------------ */
    var NH = 'SV_Core_NhapHoc_MH/', PNH = 'PKG_CORE_NHAPHOC.';
    function goi(ma, fn, hanhDong, o) {
        o = o || {};
        o.action = (ma.indexOf('/') > 0 ? '' : NH) + ma;
        o.func = PNH + fn;
        o.strNguoiThucHien_Id = '';
        o.strVaiTroDangNhap_Id = '';
        o.strChucNangHeThong_Id = '';
        o.strHanhDong_Code = hanhDong;
        return o;
    }

    /* Danh mục dự phòng — chép nguyên từ bản gốc */
    var TT_KH = [
        { MA: 'DRAFT', TEN: 'Bản nháp' }, { MA: 'CHO_DUYET', TEN: 'Chờ duyệt' }, { MA: 'DA_DUYET', TEN: 'Đã duyệt' },
        { MA: 'DANG_MO', TEN: 'Đang mở' }, { MA: 'TAM_DUNG', TEN: 'Tạm dừng' }, { MA: 'DA_DONG', TEN: 'Đã đóng' }, { MA: 'HUY', TEN: 'Hủy' }
    ];
    var VAITRO_NS = [
        { MA: 'CHU_TICH', TEN: 'Chủ tịch hội đồng' }, { MA: 'PHO_CHU_TICH', TEN: 'Phó chủ tịch hội đồng' },
        { MA: 'THU_KY', TEN: 'Thư ký' }, { MA: 'UY_VIEN', TEN: 'Ủy viên' },
        { MA: 'CAN_BO_TN', TEN: 'Cán bộ tiếp nhận' }, { MA: 'CAN_BO_HT', TEN: 'Cán bộ hỗ trợ' }
    ];
    var TT_PC = [
        { MA: 'CHUA_BAT_DAU', TEN: 'Chưa bắt đầu' }, { MA: 'DANG_LAM', TEN: 'Đang làm' }, { MA: 'HOAN_THANH', TEN: 'Hoàn thành' },
        { MA: 'TAM_DUNG', TEN: 'Tạm dừng' }, { MA: 'HUY', TEN: 'Hủy' }
    ];
    var HIEULUC = [{ ID: '1', TEN: 'Còn hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }];

    /* Cột chữ dài giữ bề rộng tối thiểu (css/trungtuyen.css) */
    function rong(t, cls) { return '<div class="' + cls + '">' + ui.esc(t) + '</div>'; }

    function nut(k, r, chu, dis) {
        return ui.btn('view', { text: chu || 'Xem', cls: 'ums-btn--sm', attr: dis ? { 'data-xem': k, 'data-id': e(r.ID), disabled: 'disabled', title: 'Chức năng sẽ bổ sung sau' } : { 'data-xem': k, 'data-id': e(r.ID) } });
    }

    /* Nguồn biểu mẫu nạp trước (có dự phòng viết cứng) rồi mới dựng màn */
    Promise.all([K.dmDuPhong('NH_KEHOACH_NHAPHOC.STA', TT_KH)]).then(function (x) { dung(x[0]); });

    function dung(dsTrangThai) {
        var loc = { kh: null, dot: null, q: null, hl: null };
        var ntLoc = null, ntForm = null;

        var main = ums.crud({
            root: root,
            title: 'Kế hoạch nhập học (new)',
            listTitle: 'Danh sách kế hoạch nhập học',
            formTitle: 'kế hoạch nhập học',
            icon: 'fa-list',
            empty: 'Chưa có dữ liệu — chọn Kế hoạch tuyển sinh, Đợt tuyển sinh rồi bấm Danh sách',

            list: {
                call: function () {
                    return goi('ETMeDykeCikPKSAxCS4iHgYkNQUy', 'Pr_Nh_KhNhapHoc_GetDs', 'XEM', {
                        strTuKhoa: loc.q ? loc.q.value.trim() : '',
                        strTS_KeHoach_TuyenSinh_Id: loc.kh ? loc.kh.value : '',
                        strTS_KeHoach_TS_Dot_Id: loc.dot ? loc.dot.value : '',
                        strNhapHoc_Type_Code: '',
                        strStatus_Code: '',
                        strOwner_Org_Id: '',
                        strManage_Org_Id: '',
                        strReceive_Org_Id: '',
                        dIs_Active: (loc.hl && loc.hl.value) || 1
                    });
                }
            },

            columns: [
                { title: 'Mã', cls: 'is-nowrap', render: function (r) { return ui.esc(pick(r, 'MA', 'MA_KEHOACH', 'Ma')); } },
                { title: 'Tên', render: function (r) { return rong(pick(r, 'TEN', 'TEN_KEHOACH', 'Ten'), 'nhtt-rong'); } },
                { title: 'Ngày bắt đầu', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(K.ngay(pick(r, 'NGAY_BATDAU', 'NGAYBATDAU', 'NGAY_BAT_DAU'))); } },
                { title: 'Ngày kết thúc', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(K.ngay(pick(r, 'NGAY_KETTHUC', 'NGAYKETTHUC', 'NGAY_KET_THUC'))); } },
                { title: 'Kế hoạch đầu ra', cls: 'is-center is-nowrap', render: function (r) { return nut('daura', r); } },
                { title: 'Bố trí nhân sự', cls: 'is-center is-nowrap', render: function (r) { return nut('nhansu', r); } },
                { title: 'Khai mức phí', cls: 'is-center is-nowrap', render: function (r) { return nut('mucphi', r); } },
                { title: 'Kết quả nhập học', cls: 'is-center is-nowrap', render: function (r) { return nut('ketqua', r, 'Xem', true); } },
                { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(K.ngayGio(pick(r, 'NGAYTAO', 'NGAY_TAO'))); } },
                { title: 'Người tạo', cls: 'is-nowrap', render: function (r) { return ui.esc(pick(r, 'NGUOITAO_TEN', 'NGUOITAO', 'NGUOI_TAO', 'NGUOITAO_TenDayDu')); } }
            ],

            detail: function (row) {
                return goi('ETMeDykeCikPKSAxCS4iHgYkNQM4CCUP', 'Pr_Nh_KhNhapHoc_GetById', 'XEM', { strId: row.ID });
            },

            fields: [
                { type: 'legend', label: 'Thông tin cơ bản' },
                { key: 'strMa_KeHoach', label: 'Mã', required: true, placeholder: 'Nhập mã kế hoạch', get: function (d) { return pick(d, 'MA', 'MA_KEHOACH'); } },
                { key: 'strTen_KeHoach', label: 'Tên', required: true, placeholder: 'Nhập tên kế hoạch', get: function (d) { return pick(d, 'TEN', 'TEN_KEHOACH'); } },
                { key: 'strNgay_BatDau', label: 'Ngày bắt đầu', type: 'date', get: function (d) { return K.ngay(pick(d, 'NGAY_BATDAU', 'NGAYBATDAU')); } },
                { key: 'strNgay_KetThuc', label: 'Ngày kết thúc', type: 'date', get: function (d) { return K.ngay(pick(d, 'NGAY_KETTHUC', 'NGAYKETTHUC')); } },
                { key: 'strNhapHoc_Type_Code', label: 'Loại KH nhập học', type: 'select', placeholder: 'Chọn loại kế hoạch nhập học',
                  source: { dm: 'NH_KEHOACH_NHAPHOC.NHAPHOC_TYPE_CODE', id: 'MA', name: 'TEN' }, get: function (d) { return e(d.NHAPHOC_TYPE_CODE); } },
                { key: 'strStatus_Code', label: 'Trạng thái kế hoạch', type: 'select', placeholder: 'Chọn trạng thái', value: 'DRAFT',
                  source: { items: dsTrangThai, id: 'MA', name: 'TEN' }, get: function (d) { return e(d.STATUS_CODE); } },

                { type: 'legend', label: 'Liên kết tuyển sinh' },
                { key: 'strTS_KeHoach_TuyenSinh_Id', label: 'Kế hoạch tuyển sinh', type: 'select', required: true, placeholder: 'Chọn kế hoạch tuyển sinh',
                  get: function (d) { return e(d.TS_KEHOACH_TUYENSINH_ID); } },
                { key: 'strTS_KeHoach_TS_Dot_Id', label: 'Đợt tuyển sinh', type: 'select', required: true, placeholder: 'Chọn đợt tuyển sinh',
                  get: function (d) { return pick(d, 'TS_KEHOACH_TUYENSINH_DOT_ID', 'TS_KEHOACH_TS_DOT_ID'); } },

                { type: 'legend', label: 'Đơn vị' },
                { key: 'strOwner_Org_Id', label: 'Đơn vị chủ trì', type: 'select', placeholder: 'Chọn đơn vị chủ trì', source: K.nguonDonVi, get: function (d) { return e(d.OWNER_ORG_ID); } },
                { key: 'strManage_Org_Id', label: 'Đơn vị quản lý', type: 'select', placeholder: 'Chọn đơn vị quản lý', source: K.nguonDonVi, get: function (d) { return e(d.MANAGE_ORG_ID); } },
                { key: 'strReceive_Org_Id', label: 'Đơn vị tiếp nhận', type: 'select', placeholder: 'Chọn đơn vị tiếp nhận', source: K.nguonDonVi, get: function (d) { return e(d.RECEIVE_ORG_ID); } },

                { type: 'checks', label: 'Yêu cầu', span: true, items: [
                    { key: 'dRequire_XacNhan', label: 'Yêu cầu thí sinh xác nhận nhập học', col: 'REQUIRE_XACNHAN', on: 1, off: 0, value: 1 },
                    { key: 'dRequire_HoSo', label: 'Yêu cầu nộp hồ sơ nhập học', col: 'REQUIRE_HOSO', on: 1, off: 0, value: 1 },
                    { key: 'dRequire_TaiChinh', label: 'Yêu cầu hoàn thành nghĩa vụ tài chính', col: 'REQUIRE_TAICHINH', on: 1, off: 0, value: 1 },
                    { key: 'dRequire_PhanLop', label: 'Yêu cầu phân lớp trước khi hoàn tất', col: 'REQUIRE_PHANLOP', on: 1, off: 0 },
                    { key: 'dRequire_TaiKhoan', label: 'Yêu cầu tạo tài khoản hệ thống', col: 'REQUIRE_TAIKHOAN', on: 1, off: 0 }
                ] },
                { type: 'checks', label: 'Tự động', span: true, items: [
                    { key: 'dIs_Auto_Study', label: 'Tự động tạo quá trình học cho SV', col: 'IS_AUTO_STUDY', on: 1, off: 0 },
                    { key: 'dIs_Auto_Class_Assign', label: 'Tự động phân lớp', col: 'IS_AUTO_CLASS_ASSIGN', on: 1, off: 0 },
                    { key: 'dIs_Auto_Account_Create', label: 'Tự động tạo tài khoản (bỏ = thủ công)', col: 'IS_AUTO_ACCOUNT_CREATE', on: 1, off: 0 },
                    { key: 'dIs_Auto_Complete', label: 'Tự động hoàn tất nhập học khi đủ điều kiện', col: 'IS_AUTO_COMPLETE', on: 1, off: 0 }
                ] },

                { type: 'legend', label: 'Khác' },
                { key: 'dIs_Active', label: 'Hiệu lực bản ghi', type: 'select', value: '1', required: true,
                  source: { items: HIEULUC }, get: function (d) { return d.IS_ACTIVE === null || d.IS_ACTIVE === undefined ? '1' : String(d.IS_ACTIVE); } },
                { key: 'strGhiChu', label: 'Ghi chú', type: 'textarea', span: true, get: function (d) { return pick(d, 'GHICHU', 'GHI_CHU'); } }
            ],

            save: function (v, row) {
                v.dIs_Active = v.dIs_Active || 1;
                var o = row
                    ? goi('ETMeDykeCikPKSAxCS4iHhI0IAPP', 'Pr_Nh_KhNhapHoc_Sua', 'SUA', v)
                    : goi('ETMeDykeCikPKSAxCS4iHhUpJCwP', 'Pr_Nh_KhNhapHoc_Them', 'THEM', v);
                if (row) o.strId = row.ID;
                return o;
            },
            remove: function (ids) { return goi('ETMeDykeCikPKSAxCS4iHhkuIAPP', 'Pr_Nh_KhNhapHoc_Xoa', 'XOA', { strId: ids[0] }); },
            rowDelete: false,
            multi: false,
            removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa kế hoạch nhập học này?'; },

            onForm: function (row, c) {
                var f = c.z('form');
                var elKH = f.querySelector('[data-k="strTS_KeHoach_TuyenSinh_Id"]');
                var elDot = f.querySelector('[data-k="strTS_KeHoach_TS_Dot_Id"]');
                if (!ntForm) {
                    ntForm = K.noiKHDot(elKH, elDot);   // dIs_Active = 1 như getList_KeHoachTS_ForAdd / DotTS_ForAdd
                    K.vietLai(c, function (cc) { cc.fillForm(cc.editing); moBieuMau(cc.editing); });
                }
                moBieuMau(row);
                function moBieuMau(d) {
                    var kh = d ? e(d.TS_KEHOACH_TUYENSINH_ID) : '';
                    var dot = d ? pick(d, 'TS_KEHOACH_TUYENSINH_DOT_ID', 'TS_KEHOACH_TS_DOT_ID') : '';
                    ntForm.napKH(kh).then(function () { return ntForm.napDot(kh, dot); });
                }
            }
        });

        /* Thanh lọc riêng của bản gốc (nút "Danh sách", đổi ô không tự tải) — đặt đầu vùng danh sách */
        var vung = main.z('list');
        vung.insertAdjacentHTML('afterbegin', pat.filterBar([
            { key: 'kh', type: 'select', label: 'Kế hoạch tuyển sinh' },
            { key: 'dot', type: 'select', label: 'Đợt tuyển sinh' },
            { key: 'q', type: 'text', label: 'Từ khóa tìm kiếm' },
            { key: 'hl', type: 'select', label: 'Hiệu lực', required: true }
        ], { searchText: 'Danh sách' }));
        var thanh = vung.firstElementChild;
        ['kh', 'dot', 'q', 'hl'].forEach(function (k) { loc[k] = thanh.querySelector('[data-f="' + k + '"]'); });
        loc.hl.innerHTML = HIEULUC.map(function (x) { return '<option value="' + x.ID + '">' + x.TEN + '</option>'; }).join('');
        loc.hl.value = '1';
        var btnDs = thanh.querySelector('[data-a="search"]');
        if (btnDs) btnDs.querySelector('i').className = 'fa-light fa-list-check';
        ui.enhance(thanh);
        ntLoc = K.noiKHDot(loc.kh, loc.dot, { hieuLuc: function () { return loc.hl.value || 1; } });
        ntLoc.napKH();
        thanh.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) main.load(1); });
        loc.q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); main.load(1); } });
        /* Đổi Hiệu lực → nạp lại combo Kế hoạch tuyển sinh (gốc); Kế hoạch về trống thì Đợt cũng trống */
        jQuery(loc.hl).on('select2:select', function () {
            ntLoc.napKH('').then(function () { ntLoc.napDot(''); });
        });

        /* ---------- Nút "Xem" trên dòng ---------------------------------------- */
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xem]');
            if (!b || !root.contains(b) || b.disabled) return;
            var id = b.getAttribute('data-id');
            var kh = main.rows.filter(function (r) { return String(r.ID) === id; })[0] || { ID: id };
            var k = b.getAttribute('data-xem');
            if (k === 'daura') moDauRa(kh);
            else if (k === 'nhansu') moNhanSu(kh);
            else if (k === 'mucphi') moMucPhi(kh);
        });
    }

    function tenKH(kh) { return pick(kh, 'TEN', 'TEN_KEHOACH', 'Ten'); }

    /* =======================================================================
       "Khai mức phí" — sang màn Khai mức phí thu nhập học, chọn sẵn kế hoạch
       ======================================================================= */
    function moMucPhi(kh) {
        try { sessionStorage.setItem('KHTSN_preselect_KHNH_Id', kh.ID); } catch (x) { /* trình duyệt chặn lưu trữ */ }
        if (!ums.app || !ums.app.openPath) return;
        if (!ums.app.openPath('/modules/taichinh/html/khaimucphinhaphoc.html')) {
            ui.toast("Bạn chưa được phân quyền menu 'Khai mức phí thu nhập học' — liên hệ admin để bổ sung quyền.", 'warn');
        }
    }

    /* =======================================================================
       Hộp "Kế hoạch đầu ra" — LayDS_NH_KeHoach_DauRa (chỉ xem) + Khởi tạo từ tuyển
       sinh + cờ "Yêu cầu xác nhận CSĐT" theo các dòng đã tick
       ======================================================================= */
    function moDauRa(kh) {
        var dlg = ui.dialog({
            title: 'Kế hoạch đầu ra — ' + (tenKH(kh) || ''), icon: 'fa-graduation-cap', size: 'xl',
            body:
                '<div class="ums-row ums-row--end ums-u-mb-2">' +
                    ui.btn('reload', { text: 'Xem lại danh sách', mod: 'out-primary', attr: { 'data-dr': 'nap' } }) +
                    ui.btn('add', { text: 'Khởi tạo từ tuyển sinh', icon: 'fa-wand-magic-sparkles', attr: { 'data-dr': 'khoitao' } }) +
                    ui.btn('confirm', { text: 'Yêu cầu xác nhận CSĐT', mod: 'primary', icon: 'fa-user-check',
                        attr: { 'data-dr': 'xncs', title: "Cập nhật cờ 'yêu cầu xác nhận cơ sở đào tạo' theo các dòng đã tick" } }) +
                '</div>' +
                '<div data-dr="bang"></div>'
        });
        var B = dlg.body, bang = B.querySelector('[data-dr="bang"]');
        var ds = [];

        function nap() {
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(goi('DSA4BRIeDwkeCiQJLiAiKR4FIDQTIAPP', 'LayDS_NH_KeHoach_DauRa', 'XEM', {
                strTuKhoa: '',
                strNH_KeHoach_NhapHoc_Id: kh.ID,
                strDaoTao_HeDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: '',
                strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_Nganh_DT_Id: '',
                strDaoTao_Nganh_TS_Id: '',
                strDauRa_Status_Code: '',
                dIs_Active: 1
            })).then(function (r) {
                ds = K.rows(r);
                ve();
                return ds;
            }).catch(function (err) {
                bang.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'kế hoạch đầu ra');
                return null;
            });
        }

        function ve() {
            ui.table({
                el: bang, rows: ds,
                empty: 'Không có dữ liệu — bấm "Khởi tạo từ tuyển sinh" để tạo từ Kế hoạch tuyển sinh',
                columns: [
                    { head: '<input type="checkbox" data-dr="tatca" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (d) { return '<input type="checkbox" data-dr="tick" data-id="' + ui.esc(d.ID) + '"' + (Number(d.REQUIRE_XACNHAN_COSO || 0) === 1 ? ' checked' : '') + '>'; } },
                    { title: 'Mã', cls: 'is-nowrap', render: function (d) { return ui.esc(pick(d, 'MA_DAU_RA', 'MA')); } },
                    { title: 'Tên', render: function (d) { return rong(pick(d, 'TEN_DAU_RA', 'TEN'), 'nhtt-rong'); } },
                    { title: 'Hệ', render: function (d) { return ui.esc(pick(d, 'HEDAOTAO_TEN', 'HE_DAOTAO_TEN')); } },
                    { title: 'Khóa', render: function (d) { return ui.esc(pick(d, 'KHOADAOTAO_TEN', 'KHOA_DAOTAO_TEN')); } },
                    { title: 'Chương trình', render: function (d) { return rong(K.tenMa(d.CHUONGTRINH_TEN, d.CHUONGTRINH_MA), 'nhtt-rong'); } },
                    { title: 'Ngành đào tạo mở', render: function (d) { return rong(K.tenMa(pick(d, 'NGANH_DT_TEN', 'NGANHDAOTAO_TEN'), d.NGANH_DT_MA), 'nhtt-rong'); } },
                    { title: 'Ngành tuyển sinh', render: function (d) { return rong(K.tenMa(pick(d, 'NGANH_TS_TEN', 'NGANHTUYENSINH_TEN'), d.NGANH_TS_MA), 'nhtt-rong'); } },
                    { title: 'Khoa quản lý', render: function (d) { return rong(pick(d, 'KHOAQUANLY_TEN', 'KHOA_QUANLY_TEN'), 'nhtt-rong--vua'); } },
                    { title: 'Chỉ tiêu', cls: 'is-center', render: function (d) { return ui.esc(pick(d, 'CHI_TIEU_NHAPHOC', 'CHITIEU', 'CHI_TIEU') || 0); } },
                    { title: 'Đã nhập', cls: 'is-center', render: function (d) { return ui.esc(d.SO_DA_GAN || 0); } },
                    { title: 'Đã XN', cls: 'is-center', render: function (d) { return ui.esc(d.SO_DA_XACNHAN || 0); } },
                    { title: 'Đã tạo QT', cls: 'is-center', render: function (d) { return ui.esc(d.SO_DA_TAO_STUDY || 0); } },
                    { title: 'Xác nhận CSĐT', cls: 'is-center is-nowrap', render: function (d) { return Number(d.REQUIRE_XACNHAN_COSO || 0) === 1 ? ui.badge('Yêu cầu xác nhận CSĐT', 'info') : ''; } },
                    { title: 'Trạng thái', render: function (d) { return ui.esc(pick(d, 'DAURA_STATUS_TEN', 'DAU_RA_STATUS_TEN', 'STATUS_TEN', 'DAU_RA_STATUS_CODE')); } },
                    { title: 'Hiệu lực', cls: 'is-center', render: function (d) { return K.co(d.IS_ACTIVE, 'bad'); } },
                    { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(K.ngayGio(pick(d, 'NGAYTAO', 'NGAY_TAO'))); } },
                    { title: 'Người tạo', render: function (d) { return ui.esc(pick(d, 'NGUOITAO_TEN', 'NGUOITAO')); } }
                ]
            });
            dongBoTatCa();
        }
        function dongBoTatCa() {
            var bx = bang.querySelectorAll('input[data-dr="tick"]');
            var n = bang.querySelectorAll('input[data-dr="tick"]:checked').length;
            var all = bang.querySelector('[data-dr="tatca"]');
            if (!all) return;
            all.checked = bx.length > 0 && n === bx.length;
            all.indeterminate = n > 0 && n < bx.length;
        }
        bang.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.matches('[data-dr="tatca"]')) {
                Array.prototype.forEach.call(bang.querySelectorAll('input[data-dr="tick"]'), function (x) { x.checked = t.checked; });
                t.indeterminate = false;
            } else if (t.matches('[data-dr="tick"]')) dongBoTatCa();
        });

        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-dr]');
            if (!b) return;
            var k = b.getAttribute('data-dr');
            if (k === 'nap') nap();
            else if (k === 'khoitao') khoiTao();
            else if (k === 'xncs') capNhatXNCS();
        });

        /* Chuyen_KH_DauRa_TuTuyenSinh — chép TS_KEHOACH_DAU_RA sang NH_KEHOACH_DAU_RA */
        function khoiTao() {
            ui.confirm('Khởi tạo Kế hoạch đầu ra từ tuyển sinh?', { ok: 'Khởi tạo', title: 'Khởi tạo kế hoạch đầu ra' }).then(function (yes) {
                if (!yes) return;
                var truoc = ds.length;
                return ums.api.call(goi('Aik0OCQvHgoJHgUgNBMgHhU0FTQ4JC8SKC8p', 'Chuyen_KH_DauRa_TuTuyenSinh', 'THEM', {
                    strNH_KH_NhapHoc_Id: kh.ID
                })).then(function () {
                    return nap().then(function (dt) {
                        if (!dt) return;
                        var sau = dt.length, them = sau - truoc;
                        if (them > 0) ui.toast('Đã tạo mới ' + them + ' kế hoạch đầu ra từ tuyển sinh', 'ok');
                        else if (sau === 0) {
                            ui.toast('API chạy thành công nhưng không có bản ghi nào được tạo. Nguyên nhân thường gặp: Kế hoạch tuyển sinh chưa khai báo Đầu ra. ' +
                                "Vui lòng vào màn 'Kế hoạch tuyển sinh' → khai đầu ra cho kế hoạch tương ứng, rồi thử lại.", 'warn');
                        } else ui.toast('Không có bản ghi mới được tạo — có thể tất cả đầu ra của tuyển sinh đã được copy sang trước đây.', 'info');
                    });
                });
            }).catch(function (err) { ums.api.handle(err, 'khởi tạo kế hoạch đầu ra'); });
        }

        /* Sua_KeHoachDauRa_XacNhanCoSo — MỌI dòng: tick → 1, không tick → 0; tuần tự như gốc */
        function capNhatXNCS() {
            var bx = Array.prototype.slice.call(bang.querySelectorAll('input[data-dr="tick"]'));
            if (!bx.length) { ui.toast('Không có dữ liệu để cập nhật', 'warn'); return; }
            var soTick = bx.filter(function (x) { return x.checked; }).length;
            ui.confirm("Sẽ cập nhật 'Yêu cầu xác nhận CSĐT' cho " + bx.length + ' đầu ra: ' +
                soTick + ' dòng đã tick → gán = 1; ' + (bx.length - soTick) + ' dòng chưa tick → gán = 0. Tiếp tục?',
                { ok: 'Cập nhật', title: 'Yêu cầu xác nhận CSĐT' }).then(function (yes) {
                if (!yes) return;
                return ui.batch(bx.map(function (x) {
                    return {
                        action: 'SV_CORE_NhapHoc_MH/EjQgHgokCS4gIikFIDQTIB4ZICIPKSAvAi4SLgPP',
                        func: PNH + 'Sua_KeHoachDauRa_XacNhanCoSo',
                        strNh_KeHoach_Dau_Ra_Id: x.getAttribute('data-id'),
                        dGiaTri: x.checked ? 1 : 0,
                        strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '',
                        strHanhDong_Code: 'SUA'
                    };
                }), { title: 'Đang cập nhật đầu ra', okText: 'Đã cập nhật đầu ra', show: true }).then(function () { nap(); });
            });
        }

        nap();
    }

    /* =======================================================================
       Màn con "Bố trí nhân sự" (trong trang) — khung chung ums.khts.phanCong, lời gọi *_NH_KeHoach_NhanSu
       ======================================================================= */
    var mapNS = null;   // _mapNS_Cache của gốc: ID nhân sự → hồ sơ (bù tên thiếu)
    function tenNS(d) { return String(pick(d, 'PERSON_HOTEN', 'PERSON_TEN', 'NHANSU_TEN', 'HOTEN', 'HO_TEN', 'NHANSU_HOTEN', 'NS_HOTEN', 'NS_TEN')).trim(); }
    function maNS(d) { return pick(d, 'PERSON_MA', 'NHANSU_MA', 'MASO', 'MA_NS'); }

    function moNhanSu(kh) {
        Promise.all([
            K.dmDuPhong('NH_KEHOACH_NHANSU.VAITRO_NHAPHOC_CODE', VAITRO_NS),
            K.dmDuPhong('NH_KEHOACH_NHANSU.PHANCONG_STATUS_CODE', TT_PC)
        ]).then(function (x) {
            var dsVaiTro = x[0], dsTT = x[1];
            K.phanCong(kh, {
                host: root,
                title: 'Bố trí nhân sự', icon: 'fa-users-gear',
                tieuDe: function () { return tenKH(kh) || 'Bố trí nhân sự'; },
                addText: 'Thêm mới nhân sự',
                formTitle: 'phân công nhân sự',
                list: function () {
                    return goi('DSA4BRIeDwkeCiQJLiAiKR4PKSAvEjQP', 'LayDS_NH_KeHoach_NhanSu', 'XEM', {
                        strTuKhoa: '',
                        strNH_KeHoach_NhapHoc_Id: kh.ID,
                        strPerson_Id: '',
                        strDonVi_Id: '',
                        strVaiTro_NhapHoc_Code: '',
                        dIs_Primary: '',
                        dIs_Manager: '',
                        dIs_Approver: ''
                    });
                },
                onLoad: buTen,
                columns: [
                    { title: 'Nhân sự', render: function (d) {
                        var s = K.tenMa(tenNS(d), maNS(d));
                        if (!s && d.CORE_PERSON_ID) return '<span class="ums-u-faint" title="Máy chủ chưa trả được thông tin nhân sự">(ID: ' + ui.esc(String(d.CORE_PERSON_ID).substring(0, 8)) + '…)</span>';
                        return rong(s, 'nhtt-rong');
                    } },
                    { title: 'Kế hoạch nhập học', render: function (d) { return rong(pick(d, 'NH_KEHOACH_NHAPHOC_TEN', 'KHNHAPHOC_TEN'), 'nhtt-rong'); } },
                    { title: 'Vai trò tham gia', render: function (d) { return rong(pick(d, 'VAITRO_TEN', 'VAITRO_NHAPHOC_TEN', 'VAITRO_NHAPHOC_CODE'), 'nhtt-rong--vua'); } },
                    { title: 'Ngày bắt đầu', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(K.ngay(pick(d, 'NGAY_BATDAU', 'NGAYBATDAU'))); } },
                    { title: 'Ngày kết thúc', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(K.ngay(pick(d, 'NGAY_KETTHUC', 'NGAYKETTHUC'))); } },
                    { title: 'NS chính', cls: 'is-center', render: function (d) { return K.co(d.IS_PRIMARY); } },
                    { title: 'QL', cls: 'is-center', render: function (d) { return K.co(d.IS_MANAGER); } },
                    { title: 'Phê duyệt', cls: 'is-center', render: function (d) { return K.co(d.IS_APPROVER); } },
                    { title: 'Trạng thái phân công', render: function (d) { return ui.esc(pick(d, 'PHANCONG_STATUS_TEN', 'PHANCONG_STATUS_CODE_TEN', 'STATUS_TEN', 'PHANCONG_STATUS_CODE')); } },
                    { title: 'Hiệu lực', cls: 'is-center', render: function (d) { return K.co(d.IS_ACTIVE, 'bad'); } },
                    { title: 'Người tạo', render: function (d) { return ui.esc(pick(d, 'NGUOITAO_TAIKHOAN', 'NGUOITAO_TEN', 'NGUOITAO')); } },
                    { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(K.ngayGio(pick(d, 'NGAYTAO', 'NGAY_TAO'))); } }
                ],
                chiSua: ['_ns', '_hl'],
                fields: [
                    { key: '_ns', label: 'Thông tin nhân sự', type: 'static', caDong: true, get: function (d) {
                        var s = K.tenMa(tenNS(d), maNS(d)) || (d.CORE_PERSON_ID ? '(không có tên — CORE_PERSON_ID ' + d.CORE_PERSON_ID + ')' : '(không có thông tin nhân sự)');
                        var dv = pick(d, 'DONVI_TEN', 'DON_VI_TEN', 'TEN_DONVI', 'DAOTAO_COCAUTOCHUC_TEN', 'COCAUTOCHUC_TEN');
                        return s + (dv ? ' · Đơn vị: ' + dv : '');
                    } },
                    { key: 'strVaiTro_NhapHoc_Code', label: 'Vai trò tham gia', type: 'select', placeholder: 'Chọn vai trò',
                      source: { items: dsVaiTro, id: 'MA', name: 'TEN' }, get: function (d) { return pick(d, 'VAITRO_NHAPHOC_CODE', 'VAITRO_CODE'); } },
                    { key: 'strNgay_BatDau', label: 'Ngày bắt đầu', type: 'date', get: function (d) { return K.ngay(pick(d, 'NGAY_BATDAU', 'NGAYBATDAU')); } },
                    { key: 'strNgay_KetThuc', label: 'Ngày kết thúc', type: 'date', get: function (d) { return K.ngay(pick(d, 'NGAY_KETTHUC', 'NGAYKETTHUC')); } },
                    { key: '_tt', label: 'Trạng thái phân công', type: 'select', placeholder: 'Chọn trạng thái',
                      source: { items: dsTT, id: 'MA', name: 'TEN' }, get: function (d) { return pick(d, 'PHANCONG_STATUS_CODE', 'STATUS_CODE'); } },
                    { type: 'checks', span: true, items: [
                        { key: 'dIs_Primary', label: 'Là nhân sự chính', col: 'IS_PRIMARY', on: 1, off: 0 },
                        { key: 'dIs_Manager', label: 'Là người quản lý', col: 'IS_MANAGER', on: 1, off: 0 },
                        { key: 'dIs_Approver', label: 'Là người phê duyệt', col: 'IS_APPROVER', on: 1, off: 0 }
                    ] },
                    { key: '_hl', label: 'Hiệu lực (chỉ xem — bỏ hiệu lực bằng nút Xoá)', type: 'static', get: function (d) {
                        return d.IS_ACTIVE === null || d.IS_ACTIVE === undefined || d.IS_ACTIVE == 1 ? 'Còn hiệu lực' : 'Hết hiệu lực';   // eslint-disable-line eqeqeq
                    } },
                    { key: 'strGhiChu', label: 'Ghi chú', type: 'textarea', span: true, placeholder: 'Ghi chú (áp dụng cho mọi nhân sự đã chọn)', get: function (d) { return pick(d, 'GHICHU', 'GHI_CHU'); } }
                ],
                /* Them_NH_KeHoach_NhanSu — mỗi nhân sự đã tick một lời gọi, "thông tin gán chung" như nhau.
                   Trạng thái phân công: gốc có ô nhưng KHÔNG gửi (commonData không có) — giữ như gốc. */
                them: function (ns, v) {
                    return goi('FSkkLB4PCR4KJAkuICIpHg8pIC8SNAPP', 'Them_NH_KeHoach_NhanSu', 'THEM', {
                        strNH_KeHoach_NhapHoc_Id: kh.ID,
                        strPerson_Id: ns.ID,
                        strDonVi_Id: ns.DONVI_ID || '',
                        strVaiTro_NhapHoc_Code: v.strVaiTro_NhapHoc_Code,
                        strNgay_BatDau: v.strNgay_BatDau,
                        strNgay_KetThuc: v.strNgay_KetThuc,
                        dIs_Primary: v.dIs_Primary,
                        dIs_Manager: v.dIs_Manager,
                        dIs_Approver: v.dIs_Approver,
                        strSource_Type_Code: 'MANUAL',
                        strSource_Ref_Id: '',
                        strDecision_Id: '',
                        strGhiChu: v.strGhiChu
                    });
                },
                /* Sua_NH_KeHoach_NhanSu — không có dIs_Active; giữ strDonVi_Id / nguồn / quyết định của bản ghi */
                sua: function (v, rec) {
                    return goi('EjQgHg8JHgokCS4gIikeDykgLxI0', 'Sua_NH_KeHoach_NhanSu', 'SUA', {
                        strId: rec.ID,
                        strDonVi_Id: pick(rec, 'DONVI_ID', 'DON_VI_ID'),
                        strVaiTro_NhapHoc_Code: v.strVaiTro_NhapHoc_Code,
                        strNgay_BatDau: v.strNgay_BatDau,
                        strNgay_KetThuc: v.strNgay_KetThuc,
                        dIs_Primary: v.dIs_Primary,
                        dIs_Manager: v.dIs_Manager,
                        dIs_Approver: v.dIs_Approver,
                        strSource_Type_Code: e(rec.SOURCE_TYPE_CODE),
                        strSource_Ref_Id: e(rec.SOURCE_REF_ID),
                        strDecision_Id: e(rec.DECISION_ID),
                        strGhiChu: v.strGhiChu
                    });
                },
                xoa: function (rec) {
                    return goi('GS4gHg8JHgokCS4gIikeDykgLxI0', 'Xoa_NH_KeHoach_NhanSu', 'XOA', { strId: rec.ID });
                },
                xoaHoi: 'Bạn có chắc chắn muốn xóa phân công nhân sự này?',
                chon: { title: 'Chọn nhân sự', okText: 'Xác nhận đã chọn', loaiCanBo: '0' }
            });
        });
    }

    /* _enrichNhanSu_FromPicker: bản ghi thiếu họ tên / mã → tra hồ sơ nhân sự (một lần mỗi màn) */
    function buTen(rows, crud) {
        var thieu = rows.some(function (d) { return d.CORE_PERSON_ID && (!tenNS(d) || !d.PERSON_MA); });
        if (!thieu) return;
        var p = mapNS ? Promise.resolve(mapNS) : ums.api.call({
            action: 'NS_HoSo_V2_MH/DSA4BRIPKSAvEjQeCS4SLh43cwPP',
            func: 'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2',
            strTuKhoa: '', strDaoTao_CoCauToChuc_Id: '', strChucVu_Id: '', strTinhTrangNhanSu_Id: '',
            dLaCanBoNgoaiTruong: 0, pageIndex: 1, pageSize: 100000,
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '',
            silent: true
        }).then(function (r) {
            var m = {};
            K.rows(r).forEach(function (x) { if (x && x.ID) m[x.ID] = x; });
            mapNS = m;
            return m;
        });
        p.then(function (m) {
            rows.forEach(function (d) {
                var ns = d.CORE_PERSON_ID && m[d.CORE_PERSON_ID];
                if (!ns) return;
                if (!tenNS(d)) d.PERSON_HOTEN = ns.HOTEN || '';
                if (!d.PERSON_MA) d.PERSON_MA = ns.MASO || '';
                if (!d.DONVI_TEN) d.DONVI_TEN = ns.DAOTAO_COCAUTOCHUC_TEN || '';
            });
            crud.draw();
        }).catch(function () { /* không bù được thì hiện như máy chủ trả */ });
    }
})();
