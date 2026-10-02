/* =========================================================================
   Đánh giá phân loại (DGPL) — khung CHUNG của hai module Nhân sự
     · dgplnguoilaodong  (NS_PLDG_NLD_*  — viên chức & người lao động)
     · dgplluongtangthem (NS_PLDG_LTT_*  — lương tăng thêm)
   Hai module gốc chép nhau từng màn (kehoach, anhxa, phancap), chỉ lệch tên
   controller, tên tham số kế hoạch và vài ô. Ở đây mỗi màn MỘT khung, cờ `ltt`
   phân biệt; module dgplluongtangthem nạp chéo tệp này.

   ums.nsDgpl
     .keHoachSrc(ctl, size)      nguồn ô chọn "Kế hoạch" (<ctl>/LayDanhSach, TENKEHOACH)
     .keHoach(root, { ltt })     màn Kế hoạch  (kehoach.html của hai module)
     .anhXa(root, { ltt })       màn Ánh xạ    (anhxa.html)
     .phanCap(root, { ltt })     màn Phân cấp  (phancap.html)
     .anh(path)                  ảnh đại diện tròn (edu.system.getRootPathImg)
     .nam()                      danh sách năm như edu.system.dateYearToCombo("1993", …)

   Lời gọi — kiểu cũ, không func, không mã hoá, chép nguyên từ .js gốc:
     <KH>/LayDanhSach  GET   strTuKhoa, strNguoiThucHien_Id '', pageIndex, pageSize
     <KH>/ThemMoi|CapNhat    strId, strTenKeHoach, strTuNgay, strDenNgay, strNoiDung, [strNam — chỉ NLD]
     <KH>/Xoa                strIds
     <AX>/LayDanhSach  GET   strTuKhoa, <khóa KH>, strDoiTuongApDung_Id, strChucVu_Id '', …
     <AX>/ThemMoi|CapNhat    strId, <khóa KH>, strDoiTuongApDung_Id, strChucVu_Id
     <AX>/Xoa                strIds
     <PC>/LayDanhSachLanhDao  GET  <khóa KH>
     <PC>/LayDanhSachNhanVien GET  <khóa KH>, strNhansu_Hosocanbo_LD_Id
     <PC>/ThemMoi            strId '', <khóa KH lưu>, strNhanSu_HoSoCanBo_Id (id nối '#'), strNhanSu_HoSoCanBo_LD_Id
     <PC>/Xoa                strIds
   Khóa kế hoạch: NLD strNhanSu_DGPL_Nam_KH_Id · LTT strNhanSu_DGPL_LTT_KH_Id
   (riêng Phân cấp LTT lưu bằng strNhanSu_DGPL_ltt_KH_Id — chữ "ltt" thường, đúng gốc).
   Danh mục: NS.LDVN (đối tượng áp dụng), NS.DMCV (chức vụ).

   Lỗi gốc đã sửa theo ý định (chi tiết ở từng hàm):
     · anhxa (NLD): nút Lưu LUÔN gọi ThemMoi (sửa một dòng là thêm dòng mới);
       nút "Tìm kiếm" lại gắn vào Lưu/Cập nhật; Enter ở ô từ khoá gọi hàm không
       tồn tại. → Lưu: ThemMoi / CapNhat theo dòng đang sửa (như bản LTT);
       Tìm kiếm / Enter: nạp danh sách, gửi từ khoá (gốc gửi "").
     · anhxa: danh sách gốc không phân trang (chỉ hiện 10 dòng đầu) → có phân trang.
     · phancap: ảnh đọc `data.ANH` (mảng) → luôn ảnh rỗng; nút "Tìm kiếm" không có
       xử lý; nút Xoá ở cột trái gửi "view_<id>" → xem phanCap.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }

    var S = ums.nsDgpl = {};

    /* Tên controller / khóa kế hoạch của từng module */
    function cf(ltt) {
        return ltt
            ? { kh: 'NS_PLDG_LTT_KeHoach', ax: 'NS_PLDG_LTT_AnhXa', pc: 'NS_PLDG_LTT_PhanCap', khKey: 'strNhanSu_DGPL_LTT_KH_Id' }
            : { kh: 'NS_PLDG_NLD_KeHoach', ax: 'NS_PLDG_NLD_AnhXa', pc: 'NS_PLDG_NLD_PhanCap', khKey: 'strNhanSu_DGPL_Nam_KH_Id' };
    }
    S.cf = cf;

    /** Nguồn ô "Kế hoạch" — getList_KeHoach + genCombo_KeHoach (name TENKEHOACH) */
    S.keHoachSrc = function (ctl, size) {
        return {
            call: { action: ctl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: size || 10000 },
            id: 'ID', name: 'TENKEHOACH'
        };
    };

    /** edu.system.dateYearToCombo("1993", …) — năm nay + 5 lùi về 1994, chọn sẵn năm nay */
    S.nam = function () {
        var r = [], y = new Date().getFullYear();
        for (var i = y + 5; i > 1993; i--) r.push({ ID: String(i), TEN: String(i) });
        return r;
    };

    /** Ảnh đại diện tròn — trống / lỗi thì hiện hình người */
    S.anh = function (path) { return ums.pat.anhNguoi(e(path)); };

    /* =====================================================================
       KẾ HOẠCH — bản gốc hai cột: cột trái từ khoá + "Kế hoạch tổ chức"
       (NLD) / "Danh sách kế hoạch" (LTT); cột phải "Thông tin chung" đổi chỗ
       cho biểu mẫu. Khung "Chi tiết sản phẩm" (zone_detail) của gốc không có
       lối mở (toggle_detail không nơi nào gọi) → bỏ.
       LTT: không có ô Năm; khối lọc "Danh mục kế hoạch / Lĩnh vực" ẩn sẵn
       (display:none), không nạp, không gửi → bỏ.
       ===================================================================== */
    S.keHoach = function (root, o) {
        o = o || {};
        var c = cf(o.ltt);
        var fields = [
            { type: 'legend', label: 'Thông tin kế hoạch' },
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', span: true },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' }
        ];
        if (!o.ltt) {
            fields.push({ key: 'strNam', col: 'NAM', label: 'Năm', type: 'select', placeholder: '-- Chọn năm --',
                          source: { items: S.nam() }, value: String(new Date().getFullYear()) });
            fields.push({ type: 'gap' });
        }
        fields.push({ key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung', type: 'textarea', span: true });

        return ums.crud({
            root: root,
            title: o.title || 'Kế hoạch đánh giá',
            formTitle: o.ltt ? 'lập kế hoạch đánh giá và phân loại' : 'kế hoạch đánh giá và phân loại',
            icon: 'fa-calendar-lines',
            addText: o.ltt ? 'Thêm' : 'Thêm mới',
            master: {
                title: o.ltt ? 'Danh sách kế hoạch' : 'Kế hoạch tổ chức', icon: 'fa-list-ul',
                item: function (r) { return '<b>' + esc(r.TENKEHOACH) + '</b>'; }
            },
            filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
            list: {
                paged: true,
                call: function (f) {
                    return { action: c.kh + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiThucHien_Id: '' };
                }
            },
            fields: fields,
            save: function (v, row) {
                v.action = c.kh + (row ? '/CapNhat' : '/ThemMoi');
                v.strId = row ? row.ID : '';
                return v;
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: c.kh + '/Xoa', strIds: id }; });
            }
        });
    };

    /* =====================================================================
       ÁNH XẠ chức vụ ↔ đối tượng áp dụng — hai cột như gốc.
       Cột trái: từ khoá + Kế hoạch + Đối tượng, danh sách tên chức vụ.
       Cả hai module nạp ô Kế hoạch từ NS_PLDG_NLD_KeHoach (bản LTT gốc cũng
       gọi NLD — giữ nguyên, ghi sổ cần quyết). Khi sửa, ô Kế hoạch đọc cột
       NHANSU_DGPL_NAM_KEHOACH_ID (cả hai bản gốc) — thêm dự phòng cột LTT.
       Nút "Viết lại" của biểu mẫu gốc bỏ (ums.crud mở biểu mẫu thêm là trắng).
       ===================================================================== */
    S.anhXa = function (root, o) {
        o = o || {};
        var c = cf(o.ltt);
        var KH = S.keHoachSrc('NS_PLDG_NLD_KeHoach', 10000);
        var DT = { dm: 'NS.LDVN' };
        var f = [
            { type: 'legend', label: 'Kế hoạch tổ chức' },
            { key: c.khKey, label: 'Kế hoạch', type: 'select', source: KH, placeholder: 'Kế hoạch',
              get: function (r) { return e(r.NHANSU_DGPL_NAM_KEHOACH_ID) || e(r.NHANSU_DGPL_LTT_KEHOACH_ID); } },
            { type: 'legend', label: 'Ánh xạ Chức vụ tương ứng với Đối tượng' },
            { key: 'strChucVu_Id', col: 'CHUCVU_ID', label: 'Chức vụ', type: 'select', source: { dm: 'NS.DMCV' } },
            { key: 'strDoiTuongApDung_Id', col: 'DOITUONGAPDUNG_ID', label: 'Đối tượng áp dụng', type: 'select', source: DT }
        ];
        return ums.crud({
            root: root,
            title: o.title || 'Ánh xạ',
            formTitle: o.ltt ? 'ánh xạ đối tượng' : 'ánh xạ',
            icon: 'fa-arrows-left-right',
            addText: 'Thêm',
            formCols: 1,
            master: {
                title: 'Danh sách nhân sự', icon: 'fa-list-ul',
                item: function (r) { return '<b>' + esc(r.CHUCVU_TEN) + '</b>'; }
            },
            filters: [
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
                { key: 'kh', type: 'select', label: 'Kế hoạch', source: KH },
                { key: 'dt', type: 'select', label: 'Đối tượng áp dụng', source: DT }
            ],
            list: {
                paged: true,
                call: function (v) {
                    var p = { action: c.ax + '/LayDanhSach', method: 'GET', strTuKhoa: v.q,
                              strDoiTuongApDung_Id: v.dt, strChucVu_Id: '', strNguoiThucHien_Id: '' };
                    p[c.khKey] = v.kh;
                    return p;
                }
            },
            fields: f,
            save: function (v, row) {
                v.action = c.ax + (row ? '/CapNhat' : '/ThemMoi');
                v.strId = row ? row.ID : '';
                return v;
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: c.ax + '/Xoa', strIds: id }; });
            }
        });
    };

    /* =====================================================================
       PHÂN CẤP — hai cột như gốc
         Cột trái  : từ khoá + Kế hoạch + Cơ cấu → Bộ môn, danh sách "Đối tượng
                     đánh giá" (lãnh đạo: ảnh, họ tên, mã). Bấm một người →
                     cột phải "Danh sách đối tượng được đánh giá" của người đó.
         Cột phải  : danh sách được đánh giá (Stt · Hình ảnh · Họ tên · Xóa)
                     ⇄ biểu mẫu "Thêm mới - Phân cấp": Kế hoạch, chọn MỘT người
                     đánh giá + NHIỀU người được đánh giá (hộp chọn nhân sự
                     genModal_NhanSu → ums.pat.pickNhanSu).
       Giữ như gốc: từ khoá, Cơ cấu, Bộ môn KHÔNG gửi lên máy chủ (lời gọi
       LayDanhSachLanhDao chỉ nhận kế hoạch); danh sách được đánh giá lọc theo
       kế hoạch ĐANG CHỌN Ở CỘT TRÁI.
       Khác gốc:
         · nút "Tìm kiếm" (gốc không gắn gì) nạp lại cột trái như phím Enter;
         · ảnh đọc đúng cột ANH của từng dòng (gốc đọc data.ANH của cả mảng);
         · nút Xoá ở mỗi người đánh giá gốc gửi strIds = "view_<id>" (sai tiền
           tố) → không xoá được gì; không có lời gọi xoá theo người đánh giá →
           giữ nút, đặt disabled;
         · Cơ cấu → Bộ môn khoá theo luật cha → con (gốc bỏ cơ cấu thì hiện mọi bộ môn);
         · mở "Thêm" khi đang xem một người đánh giá thì điền sẵn người đó (gốc
           giữ ngầm id người đang xem làm người đánh giá mà không hiện ra);
         · Lưu thiếu người đánh giá / người được đánh giá thì báo (gốc gửi rỗng);
           lưu xong về danh sách của người đánh giá vừa lưu (gốc ở lại biểu mẫu,
           bấm Lưu lần nữa là thêm TRÙNG).
       o = { ltt, title, formTitle, eye }
       ===================================================================== */
    S.phanCap = function (root, o) {
        o = o || {};
        var c = cf(o.ltt);
        var khLuu = o.ltt ? 'strNhanSu_DGPL_ltt_KH_Id' : 'strNhanSu_DGPL_Nam_KH_Id';
        var st = { ld: [], nv: [], ldId: '', ldRow: null, chon: null, dsChon: [], cctc: [], con: [] };

        var loc =
            '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="Kế hoạch"><option value="">Kế hoạch</option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="cctc" data-ph="Cơ cấu khoa/viện/phòng ban"><option value="">Cơ cấu khoa/viện/phòng ban</option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="bm" data-ph="Bộ môn"><option value="">Bộ môn</option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: '', attr: { 'data-a': 'tim', title: 'Tìm kiếm' } }) + '</div>' +
            '</div>';

        var m = pat.master({
            el: root, title: o.title || 'Phân cấp',
            actions: ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } }),
            side: { title: 'Đối tượng đánh giá', icon: 'fa-user-tie', search: 'Nhập từ khóa tìm kiếm', filter: loc },
            main: { title: false }
        });

        m.mainBody.innerHTML =
            '<div data-z="ds">' +
                pat.panel({ title: 'Danh sách đối tượng được đánh giá', icon: 'fa-users', count: 'nvCount', flush: true, zone: 'nv',
                            tools: ui.btn('del', { text: 'Xoá theo người đánh giá', attr: { disabled: 'disabled',
                                title: 'Bản gốc gửi sai mã khi xoá (view_…) — chưa có lời gọi xoá theo người đánh giá' } }),
                            body: ui.empty('Vui lòng chọn đối tượng đánh giá cần xem!', 'fa-hand-pointer') }) +
            '</div>' +
            '<div data-z="form" hidden>' +
                pat.panel({
                    title: 'Thêm mới - ' + (o.formTitle || 'Phân cấp'), icon: 'fa-plus',
                    tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                           ui.btn('reload', { text: 'Viết lại', attr: { 'data-a': 'vietlai' } }) +
                           ui.btn('save', { attr: { 'data-a': 'luu' } }),
                    body:
                        '<div class="ums-legend">Kế hoạch tổ chức</div>' +
                        ui.field('Kế hoạch', '<select class="ums-select" data-f="fkh" data-ph="Kế hoạch"><option value="">Kế hoạch</option></select>') +
                        '<div class="ums-legend ums-legend--cach">Đối tượng đánh giá</div>' +
                        '<div class="ums-row"><span class="ums-u-muted">Vui lòng chọn</span>' +
                            ui.btn('search', { text: 'Chọn nhân sự', mod: 'out-primary', attr: { 'data-a': 'chonld' } }) + '</div>' +
                        '<div class="ums-u-mt-2" data-z="fld"></div>' +
                        '<div class="ums-legend ums-legend--cach">Đối tượng được đánh giá</div>' +
                        '<div class="ums-row"><span class="ums-u-muted">Vui lòng chọn</span>' +
                            ui.btn('search', { text: 'Chọn nhân sự', mod: 'out-primary', attr: { 'data-a': 'chonnv' } }) + '</div>' +
                        '<div class="ums-u-mt-2" data-z="fnv"></div>'
                }) +
            '</div>';

        function q(sel) { return root.querySelector(sel); }
        function F(k) { return q('[data-f="' + k + '"]'); }
        function Z(k) { return q('[data-z="' + k + '"]'); }
        ui.enhance(root);

        /* ---------- Nguồn ô chọn ---------------------------------------- */
        ums.crud.loadSource(S.keHoachSrc(c.kh, 10000)).then(function (rows) {
            pat.fill(F('kh'), rows, { name: 'TENKEHOACH' });
            pat.fill(F('fkh'), rows, { name: 'TENKEHOACH' });
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); });

        /* getList_CoCauToChuc → tách cha / con (DAOTAO_COCAUTOCHUC_CHA_ID) */
        ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }).then(function (d) {
            st.cctc = d.filter(function (r) { return !r.DAOTAO_COCAUTOCHUC_CHA_ID; });
            st.con = d.filter(function (r) { return !!r.DAOTAO_COCAUTOCHUC_CHA_ID; });
            pat.fill(F('cctc'), st.cctc, { name: 'TEN' });
        }).catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });

        jQuery(F('cctc')).on('select2:select', function () {
            var cha = F('cctc').value;
            pat.fill(F('bm'), st.con.filter(function (r) { return r.DAOTAO_COCAUTOCHUC_CHA_ID === cha; }), { name: 'TEN' });
        });
        pat.chain([F('cctc'), F('bm')], { phatLai: false });
        jQuery(F('kh')).on('select2:select select2:clear', function () { napLD(); });

        /* ---------- Cột trái: đối tượng đánh giá ------------------------- */
        function napLD() {
            m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var p = { action: c.pc + '/LayDanhSachLanhDao', method: 'GET' };
            p[c.khKey] = F('kh').value;
            return ums.api.call(p).then(function (r) {
                st.ld = arr(r.data);
                veLD();
            }).catch(function (err) {
                st.ld = []; m.sideBody.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'đối tượng đánh giá');
            });
        }
        function hoTen(r) { return (e(r.HODEM) + ' ' + e(r.TEN)).trim() || e(r.HOTEN); }
        function veLD() {
            m.sideCount.textContent = '(' + st.ld.length + ')';
            m.sideBody.innerHTML = st.ld.length ? st.ld.map(function (r, i) {
                /* Mục chỉ để CHỌN — không nút xoá / xem trên mục (người dùng 2026-09-26); nút xoá theo người đánh giá
                   (khoá — bản gốc gửi sai mã) nằm trên tiêu đề khung phải */
                return '<button type="button" class="ums-master__item ums-dsns__item dgpl-item' + (r.ID === st.ldId ? ' is-active' : '') + '" data-ld="' + i + '">' +
                    S.anh(r.ANH) +
                    '<span class="ums-master__item__main"><b>' + esc(hoTen(r)) + '</b>' +
                        '<span class="ums-master__item__sub">' + esc(r.MASO) + '</span></span></button>';
            }).join('') : ui.empty('Không có dữ liệu');
        }

        /* ---------- Cột phải: được đánh giá ------------------------------ */
        function napNV() {
            if (!st.ldId) return;
            Z('nv').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var p = { action: c.pc + '/LayDanhSachNhanVien', method: 'GET', strNhansu_Hosocanbo_LD_Id: st.ldId };
            p[c.khKey] = F('kh').value;
            return ums.api.call(p).then(function (r) {
                st.nv = arr(r.data);
                veNV();
            }).catch(function (err) {
                st.nv = []; Z('nv').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'đối tượng được đánh giá');
            });
        }
        function veNV() {
            q('[data-z="nvCount"]').textContent = '(' + st.nv.length + ')';
            ui.table({
                el: Z('nv'), rows: st.nv, empty: 'Không tìm thấy dữ liệu!',
                columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '90px', render: function (r) { return S.anh(r.ANH); } },
                    { title: 'Họ tên', render: function (r) { return ui.cell(hoTen(r), e(r.MASO)); } },
                    { title: 'Xóa', cls: 'is-actions', width: '70px', render: function (r, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoa="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                    } }
                ]
            });
        }
        function xemLD(i) {
            var r = st.ld[i];
            if (!r) return;
            st.ldId = r.ID; st.ldRow = r;
            veLD();
            dongForm();
            napNV();
        }

        /* ---------- Biểu mẫu thêm --------------------------------------- */
        function sinh(r) {
            if (r.NGAYSINH && r.THANGSINH) return [r.NGAYSINH, r.THANGSINH, r.NAMSINH].filter(function (x) { return e(x) !== ''; }).join('/');
            return e(r.NGAYSINH || r.NAMSINH);
        }
        function nguoi(r) {
            return { ID: r.ID, ANH: r.ANH, TEN: hoTen(r), MASO: e(r.MASO), SINH: sinh(r) };
        }
        function veFormLD() {
            ui.table({
                el: Z('fld'), rows: st.chon ? [st.chon] : [], stt: false, empty: 'Chưa chọn đối tượng đánh giá',
                columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '90px', render: function (r) { return S.anh(r.ANH); } },
                    { title: 'Họ tên - Mã', render: function (r) { return esc(r.TEN) + ' - ' + esc(r.MASO); } },
                    { title: 'Ngày sinh', prop: 'SINH', cls: 'is-center is-nowrap' }
                ]
            });
        }
        function veFormNV() {
            ui.table({
                el: Z('fnv'), rows: st.dsChon, stt: false, empty: 'Chưa chọn đối tượng được đánh giá',
                columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '90px', render: function (r) { return S.anh(r.ANH); } },
                    { title: 'Họ tên - Mã', render: function (r) { return esc(r.TEN) + ' - ' + esc(r.MASO); } },
                    { title: 'Ngày sinh', prop: 'SINH', cls: 'is-center is-nowrap' },
                    { title: 'Bỏ chọn', cls: 'is-actions', width: '80px', render: function (r, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-bo="' + i + '" title="Bỏ chọn"><i class="fa-light fa-xmark"></i></button>';
                    } }
                ]
            });
        }
        function vietLai() {
            st.dsChon = [];
            st.chon = st.ldRow ? nguoi(st.ldRow) : null;
            F('fkh').value = F('kh').value || '';
            jQuery(F('fkh')).trigger('change.select2');
            veFormLD(); veFormNV();
        }
        function moForm() {
            vietLai();
            m.formMode(true);
            ui.swap(Z('ds'), Z('form'));
        }
        function dongForm() {
            if (Z('form').hidden) return;
            m.formMode(false);
            ui.swap(Z('form'), Z('ds'));
        }
        function luu() {
            if (!st.chon) { ui.toast('Vui lòng chọn đối tượng đánh giá', 'warn'); return; }
            if (!st.dsChon.length) { ui.toast('Vui lòng chọn đối tượng được đánh giá', 'warn'); return; }
            var p = { action: c.pc + '/ThemMoi', strId: '',
                      strNhanSu_HoSoCanBo_Id: st.dsChon.map(function (r) { return r.ID; }).join('#'),
                      strNhanSu_HoSoCanBo_LD_Id: st.chon.ID };
            p[khLuu] = F('fkh').value;
            var b = q('[data-a="luu"]'); b.disabled = true;
            ums.api.call(p).then(function () {
                ui.toast('Thêm mới thành công!', 'ok');
                st.ldId = st.chon.ID;
                st.ldRow = null;
                return napLD().then(function () {
                    var i = st.ld.findIndex(function (r) { return r.ID === st.ldId; });
                    st.ldRow = st.ld[i] || null;
                    veLD(); dongForm(); napNV();
                });
            }).catch(function (err) { ums.api.handle(err, 'lưu phân cấp'); })
              .then(function () { b.disabled = false; });
        }

        /* ---------- Sự kiện ---------------------------------------------- */
        root.addEventListener('click', function (ev) {
            var t = ev.target;
            var a = t.closest('[data-a]');
            if (a && root.contains(a)) {
                var k = a.getAttribute('data-a');
                if (k === 'them') moForm();
                else if (k === 'dong') dongForm();
                else if (k === 'vietlai') vietLai();
                else if (k === 'luu') luu();
                else if (k === 'tim') napLD();
                else if (k === 'chonld') pat.pickNhanSu({
                    title: 'Chọn đối tượng đánh giá', okText: 'Chọn nhân sự',
                    onPick: function (rows) {
                        if (rows.length > 1) ui.toast('Chỉ chọn MỘT đối tượng đánh giá — lấy người đầu tiên', 'warn');
                        st.chon = nguoi(rows[0]); veFormLD();
                    }
                });
                else if (k === 'chonnv') pat.pickNhanSu({
                    title: 'Chọn đối tượng được đánh giá', okText: 'Chọn nhân sự',
                    onPick: function (rows) {
                        var trung = 0;
                        rows.forEach(function (r) {
                            if (st.dsChon.some(function (x) { return x.ID === r.ID; })) { trung++; return; }
                            st.dsChon.push(nguoi(r));
                        });
                        if (trung) ui.toast(trung + ' nhân sự đã có trong danh sách', 'warn');
                        veFormNV();
                    }
                });
                return;
            }
            var bo = t.closest('[data-bo]');
            if (bo) { st.dsChon.splice(Number(bo.getAttribute('data-bo')), 1); veFormNV(); return; }
            var x = t.closest('[data-xoa]');
            if (x) {
                var r = st.nv[Number(x.getAttribute('data-xoa'))];
                if (!r) return;
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: c.pc + '/Xoa', strIds: r.ID }).then(function () {
                        ui.toast('Xóa thành công!', 'ok');
                        napNV();
                    });
                }).catch(function (err) { ums.api.handle(err, 'xoá phân cấp'); });
                return;
            }
            var it = t.closest('[data-ld]');
            if (it && !t.closest('button[disabled]')) xemLD(Number(it.getAttribute('data-ld')));
        });
        m.search.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); napLD(); }
        });
        /* Luật cột trái (BO-CUC 12): Tải lại + Bộ lọc nâng cao, ô lọc ẩn sẵn, bỏ nút Tìm kiếm, gõ / đổi ô lọc là tự tải */
        pat.cotTrai(m, { tai: function () { napLD(); } });

        napLD();
        return { reload: napLD };
    };
})();
