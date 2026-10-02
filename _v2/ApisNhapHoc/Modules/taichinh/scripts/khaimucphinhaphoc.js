/* =========================================================================
   Khai mức phí thu nhập học
   Bản gốc: ApisNhapHoc/Modules/taichinh/html/khaimucphinhaphoc.html
            + scripts/khaimucphinhaphoc.js (3.112 dòng, lớp KhaiMucPhi)
   Một cột như gốc: thanh lọc (Kế hoạch nhập học · Từ khóa · Xem) + bảng
   "Nhóm định mức"; thêm / sửa nhóm là biểu mẫu thay chỗ bảng (luật chung —
   gốc là modal). Ba nút "Xem" trên mỗi dòng mở ba MÀN CON cấu hình ngay
   trong trang, thay chỗ màn này (_kmp_cauhinh.js, ums.pat.formTrang — từ 30/9);
   ba nút đầu trang mở phần thí sinh (_kmp_thisinh.js, hộp thoại).
   ---------------------------------------------------------------------------
   Lời gọi của phần này (SV_Core_NhapHoc_MH, POST):
     LayDS_NH_KeHoach_NhapHoc_By    ô Kế hoạch nhập học — strTuKhoa = ô Từ khóa, dIs_Active 1
     LayDS_NhapHoc_CauHinh_TC_Nhom  danh sách nhóm theo kế hoạch (dIs_Active 1)
     LayTT_NhapHoc_CauHinh_TC_Nhom  chi tiết nhóm trước khi sửa
     Them_ / Sua_ / Xoa_NhapHoc_CauHinh_TC_Nhom
   Giữ như gốc:
     · Ô "Từ khóa" lọc DANH SÁCH KẾ HOẠCH (gõ xong 400 ms tải lại ô kế hoạch),
       không lọc bảng nhóm. Chọn kế hoạch là tải nhóm luôn; "Xem" tải lại.
     · Nút đầu trang / Thêm nhóm báo "Vui lòng chọn kế hoạch nhập học…" khi
       chưa chọn. "Tải lại" (↻ đầu bảng) tải lại cả ô kế hoạch lẫn bảng nhóm.
     · Nhóm: Mã, Tên bắt buộc; Số thứ tự mặc định 100 (dPriority_No); ô
       "Hiệu lực" gửi dIs_Default (đúng tên gốc); xoá chỉ có trong biểu mẫu sửa.
       Sửa luôn gửi ID của DÒNG đã bấm (gốc ép __forcedId — không phụ thuộc
       tên cột LayTT trả về).
     · Mở từ màn "Kế hoạch tuyển sinh (new)": sessionStorage
       KHTSN_preselect_KHNH_Id → tự chọn kế hoạch đó và tải nhóm.
   Khác gốc:
     · Nút "Tải lại" riêng ở đầu trang gộp vào nút ↻ của bảng (một việc một nút).
     · Bỏ modal "Xem chi tiết" dùng chung (showModal_Xem) — gốc không nơi nào gọi.
     · Bỏ khối vá z-index modal chồng / select2 trong modal (tầng chung lo).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var K = ums.kmp;
    var e = K.e, pick = K.pick;
    var root = document.getElementById('khaimucphinhaphoc');
    if (!root) return;

    var dangSuaId = '';         // ID dòng nhóm đang sửa (gốc: __forcedId)

    function khDangChon() { return crud ? crud.filterValues().kh : ''; }
    function canKeHoach() {
        if (khDangChon()) return true;
        ui.toast('Vui lòng chọn kế hoạch nhập học và bấm Xem trước.', 'warn');
        return false;
    }
    function nutXem(k, r) {
        return ui.btn('view', { text: 'Xem', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-kmp-xem': k, 'data-id': K.nhomId(r) } });
    }

    var crud = ums.crud({
        root: root,
        title: 'Khai mức phí thu nhập học',
        listTitle: 'Nhóm định mức',
        formTitle: 'nhóm',
        icon: 'fa-layer-group',
        addText: 'Thêm nhóm',
        empty: 'Chưa có nhóm định mức nào — bấm Thêm nhóm để tạo mới',
        autoload: false,

        filters: [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch nhập học' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kế hoạch nhập học...' }
        ],

        toolbar: [
            { text: 'Danh sách nhập học & thu tiền', icon: 'fa-list-ul', mod: 'out-primary',
              onClick: function () { if (canKeHoach()) K.dsNhapHocThuTien(khDangChon()); } },
            { text: 'Tạo mức phí nhập học cho kế hoạch', icon: 'fa-wand-magic-sparkles', mod: 'out-warn',
              onClick: function () { taoMucPhi(); } },
            { text: 'Xem mức phí đã gán cho thí sinh', icon: 'fa-eye', mod: 'out-primary',
              onClick: function () { if (canKeHoach()) K.mucPhiDaGan(khDangChon()); } }
        ],

        list: {
            call: function (f) {
                if (!f.kh) { nhac(); return null; }
                return K.goi('nhomDS', {
                    strNH_KeHoach_NhapHoc_Id: f.kh,
                    strTuKhoa: '',
                    dIs_Default: '',
                    dIs_Active: 1
                });
            },
            rows: function (d) {
                return (Array.isArray(d) ? d : []).map(function (r) {
                    if (!r.ID && r.NH_CAUHINH_TC_NHOM_ID) r.ID = r.NH_CAUHINH_TC_NHOM_ID;
                    return r;
                });
            }
        },

        columns: [
            { title: 'Mã nhóm', cls: 'is-nowrap', render: function (r) { return ui.esc(pick(r, 'MA_NHOM', 'MA')); } },
            { title: 'Tên nhóm', cls: 'kmp-rong', render: function (r) { return ui.esc(pick(r, 'TEN_NHOM', 'TEN')); } },
            { title: 'Ghi chú', cls: 'kmp-rong', render: function (r) { return ui.esc(pick(r, 'GHICHU', 'GHI_CHU')); } },
            { title: 'Cấu hình các khoản thu của nhóm', cls: 'is-center kmp-ngat', render: function (r) { return nutXem('kt', r); } },
            { title: 'Cấu hình ngành đầu ra nhận mức theo nhóm', cls: 'is-center kmp-ngat', render: function (r) { return nutXem('nganh', r); } },
            { title: 'Cấu hình các trường hợp đầu vào cho từng sinh viên hoặc cho đối tượng', cls: 'is-center kmp-ngat', render: function (r) { return nutXem('dv', r); } },
            { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(pick(r, 'NGAYTAO_DD_MM_YYYY_HHMMSS', 'NGAY_TAO')); } },
            { title: 'Người tạo', render: function (r) { return ui.esc(pick(r, 'NGUOITAO_TENDAYDU', 'NGUOI_TAO')); } }
        ],

        detail: function (row) {
            dangSuaId = K.nhomId(row);
            return K.goi('nhomTT', { strId: dangSuaId });
        },

        fields: [
            { key: 'strMa_Nhom', label: 'Mã nhóm', required: true, placeholder: 'Nhập mã nhóm', get: function (r) { return pick(r, 'MA_NHOM', 'Ma_Nhom', 'MA'); } },
            { key: 'strTen_Nhom', label: 'Tên nhóm', required: true, placeholder: 'Nhập tên nhóm', get: function (r) { return pick(r, 'TEN_NHOM', 'Ten_Nhom', 'TEN'); } },
            { key: 'dPriority_No', label: 'Số thứ tự', type: 'number', value: '100', placeholder: 'Số thứ tự',
              get: function (r) { var v = pick(r, 'PRIORITY_NO', 'Priority_No'); return v === '' ? '100' : v; } },
            { type: 'checks', label: 'Hiệu lực', span: true, items: [
                { key: 'dIs_Default', label: 'Đang hiệu lực', on: 1, off: 0, value: 1,
                  get: function (r) { var v = pick(r, 'IS_DEFAULT', 'Is_Default'); return v === '' ? 1 : Number(v); } }
            ] },
            { key: 'strGhiChu', label: 'Ghi chú', type: 'textarea', span: true, placeholder: 'Ghi chú...', get: function (r) { return pick(r, 'GHICHU', 'GhiChu', 'GHI_CHU'); } }
        ],

        save: function (v, row) {
            var o = {
                strMa_Nhom: v.strMa_Nhom,
                strTen_Nhom: v.strTen_Nhom,
                dIs_Default: v.dIs_Default,
                dPriority_No: pat.num(v.dPriority_No) || 100,
                strGhiChu: v.strGhiChu
            };
            if (row) o.strId = dangSuaId || K.nhomId(row);
            else o.strNH_KeHoach_NhapHoc_Id = khDangChon();
            return K.goi(row ? 'nhomSua' : 'nhomThem', o);
        },

        remove: function () { return K.goi('nhomXoa', { strId: dangSuaId }); },
        rowDelete: false,
        multi: false,
        removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa nhóm này?'; },
        onList: function () { dangSuaId = ''; }
    });

    /* Nút lọc của gốc là "Xem" */
    var nutTim = root.querySelector('[data-c="' + crud.uid + ':search"] span');
    if (nutTim) nutTim.textContent = 'Xem';
    var oKH = root.querySelector('[data-cf="' + crud.uid + '"][data-k="kh"]');
    var oQ = root.querySelector('[data-cf="' + crud.uid + '"][data-k="q"]');

    function nhac() {
        crud.rows = [];
        crud.total = 0;
        var t = crud.z('table');
        if (t) t.innerHTML = ui.empty('Chọn kế hoạch nhập học để xem các nhóm định mức', 'fa-hand-pointer');
        var c = crud.z('count');
        if (c) c.textContent = '';
    }
    nhac();

    /* Chặn trước khung chung: chưa chọn kế hoạch thì không "Xem" / "Thêm nhóm" */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-c="' + crud.uid + ':search"], [data-c="' + crud.uid + ':add"]');
        if (!b || !root.contains(b) || khDangChon()) return;
        ev.stopPropagation();
        ev.preventDefault();
        ui.toast(b.getAttribute('data-c').slice(-3) === 'add'
            ? 'Vui lòng chọn kế hoạch nhập học và bấm Xem trước.' : 'Vui lòng chọn kế hoạch nhập học.', 'warn');
    }, true);

    /* ---------- Ô kế hoạch nhập học (getList_KeHoachNhapHoc) -------------- */
    var lanDau = true;
    function napKeHoach() {
        return ums.api.call(K.goi('keHoach', {
            strTuKhoa: oQ ? oQ.value.trim() : '',
            strTS_KH_TuyenSinh_Id: '',
            strTS_KH_TuyenSinh_Dot_Id: '',
            strNhapHoc_Type_Code: '',
            strStatus_Code: '',
            dIs_Active: 1,
            strVaiTro_NhapHoc_Code: '',
            dChi_KhiLa_Manager: '',
            dChi_KhiLa_Approver: ''
        })).then(function (r) {
            var ds = K.rows(r).map(function (x) {
                return { ID: pick(x, 'ID', 'NH_KEHOACH_NHAPHOC_ID'), TEN: pick(x, 'TEN', 'TEN_KEHOACH', 'NH_KEHOACH_NHAPHOC_TEN') };
            });
            pat.fill(oKH, ds, { head: 'Chọn kế hoạch nhập học' });
            if (lanDau) { lanDau = false; chonTuPhien(ds); }
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); });
    }

    /* Bắt tay với "Kế hoạch tuyển sinh (new)" (module trungtuyen) — applyPreselect_FromSession */
    function chonTuPhien(ds) {
        var id = '';
        try { id = sessionStorage.getItem('KHTSN_preselect_KHNH_Id') || ''; sessionStorage.removeItem('KHTSN_preselect_KHNH_Id'); } catch (x) { id = ''; }
        if (!id || !ds.some(function (x) { return String(x.ID) === id; })) return;
        oKH.value = id;
        if (window.jQuery) jQuery(oKH).trigger('change.select2');
        crud.load(1);
    }

    var henQ = 0;
    if (oQ) oQ.addEventListener('input', function () { clearTimeout(henQ); henQ = setTimeout(napKeHoach, 400); });

    /* ↻ của bảng: tải lại cả danh sách kế hoạch (btnRefresh_HSNH của gốc) */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-c="' + crud.uid + ':reload"]');
        if (b && root.contains(b)) napKeHoach();
    });

    /* ---------- Ba nút "Xem" trên dòng nhóm ------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-kmp-xem]');
        if (!b || !root.contains(b)) return;
        var id = b.getAttribute('data-id');
        var nhom = crud.rows.filter(function (r) { return String(K.nhomId(r)) === id; })[0];
        if (!nhom) return;
        var k = b.getAttribute('data-kmp-xem');
        if (k === 'kt') K.khoanThu(nhom, root);
        else if (k === 'nganh') K.nganhDauRa(nhom, root);
        else if (k === 'dv') K.dauVao(nhom, root);
    });

    /* ---------- Tạo mức phí nhập học cho kế hoạch ------------------------- */
    function taoMucPhi() {
        if (!canKeHoach()) return;
        var kh = khDangChon();
        ui.confirm('Bạn có chắc chắn muốn tạo mức phí nhập học cho toàn bộ thí sinh của kế hoạch này?',
            { title: 'Tạo mức phí nhập học', ok: 'Tạo mức phí' }).then(function (yes) {
            if (yes) K.taoMucPhi(kh, function () { if (khDangChon()) crud.load(); });
        });
    }

    napKeHoach();
})();
