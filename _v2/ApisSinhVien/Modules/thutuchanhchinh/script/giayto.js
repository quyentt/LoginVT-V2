/* =========================================================================
   Giấy tờ (danh mục thủ tục một cửa) — bản CÁN BỘ
   Bản gốc: ApisSinhVien/Modules/thutuchanhchinh/html/giayto.html + script/giayto.js
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (MỘT cột): "Danh sách" danh mục chung (phân trang máy chủ, ô chọn + Xoá đã chọn, Sửa) —
   mỗi dòng ba nút "Xem": Phí · Phân công · Ngày làm việc, bấm vào thì khung tương ứng THAY CHỖ danh sách (gốc
   edu.util.toggle_overide) với nút Đóng quay lại. Mọi biểu mẫu (danh mục chung, phí, phân công, ngày làm việc)
   thay chỗ danh sách của khung đó (gốc là bốn hộp modal — luật chung BO-CUC 1).

   Lời gọi (kiểu cũ, chép nguyên tên tham số):
     SV_MotCua_DanhMuc/LayDanhSach (GET, strTuKhoa '', strNguoiTao_Id '', pageIndex/pageSize) · ThemMoi / CapNhat / Xoa (strIds)
         (strMa, strTen, strMoTa, dSoLuongToiDa, strDonViPhuTrach_Id, dSoNgay_XuLy, dSoGio_XuLy, dSoPhut_XuLy, iThuTu '', dHieuLuc)
         + tệp mẫu SV_Files (saveFiles gốc) + "Danh sách các trường cần khai":
     danh mục MOTCUA.TRUONGTHONGTIN · SV_MotCua_DanhMuc_MoRong/LayDanhSach (GET) · ThemMoi (strTruongThongTin_Id) · Xoa (strIds)
     SV_MotCua_DanhMuc_Phi/LayDanhSach (GET) · ThemMoi / CapNhat (dSoTien, strTaiChinh_CacKhoanThu_Id, strNgayApDung, strMoTa,
         strHinhThucThanhToan_Id, strMotCua_DanhMuc_Id) · Xoa (strIds) — TC_KhoanThu/LayDanhSach, danh mục MOTCUA.HINHTHUCTHANHTOAN
     SV_MotCua_DanhMuc_PhanCong/LayDanhSach (GET) · ThemMoi / CapNhat (strPhamViApDung_Id = tầng sâu nhất đã chọn Lớp > CT >
         Khoá > Hệ, strVaiTro_Id '', strNguoiDung_Id = ô Cán bộ, strMoTa '') · Xoa (strIds)
         Hệ/Khoá/CT/Lớp: edu.system.getList_* → ums.ref.cascade · Đơn vị: getList_CoCauToChuc (NS_HoSo_V2_MH LayDanhSachToanBo,
         dTrangThai 1) → Cán bộ: NS_HoSoV2/LayDanhSach (GET, strDaoTao_CoCauToChuc_Id, dLaCanBoNgoaiTruong -1) "HOTEN - MASO"
     SV_MotCua_TT_NguoiDung/LayDanhSach (GET) · ThemMoi / CapNhat (strTinhTrangXuLy_Id, strNguoiDung_Id) · Xoa (strIds)
         — lưới "Người dùng × Trạng thái" dưới bảng phân công (cấu hình CHUNG, không gắn danh mục nào — như gốc);
         người dùng: SV_MotCua_Chung/LayDSNguoiDung ("TENDAYDU - TAIKHOAN"), trạng thái: danh mục MOTCUA.TINHTRANGXULY
     SV_MotCua_DanhMuc_NgayLV/LayDanhSach (GET) · ThemMoi (dThuTrongTuan = các thứ đã đánh dấu, nối dấu phẩy) · Xoa (strIds)
   Lỗi gốc đã sửa (làm theo ý định):
     · Trường cần khai: gốc gửi strTruongThongTin_Id = id.replace("checkX") → chuỗi "undefined<ID>" (replace thiếu đối số
       thứ hai) nên KHÔNG thêm được trường nào đúng. Nay gửi đúng ID trường.
     · Mô tả danh mục: form gốc KHÔNG có ô Mô tả — save đọc nhầm ô txtMoTa của hộp PHÍ (cùng id) → gửi giá trị rác/rỗng,
       trong khi bảng có cột Mô tả. Nay có ô "Mô tả" riêng trong biểu mẫu danh mục.
     · Lưới người dùng: CapNhat gốc KHÔNG gửi strId (máy chủ không biết sửa dòng nào) → nay gửi strId của dòng.
     · Checkbox "chọn tất cả" danh mục trỏ nhầm bảng tblGiayTo → dùng ô chọn tất cả của bảng.
   Khác gốc / điểm treo (ghi sổ):
     · Ngày làm việc: nút "Sửa" gốc HỎNG (đọc dòng từ mảng danh mục chung, đánh dấu ô theo id bản ghi) và KHÔNG có thủ tục
       sửa (lưu luôn ThemMoi → thêm trùng) → bỏ Sửa; muốn đổi thì xoá rồi thêm. Ô "Danh mục" trong hộp gốc không nạp gì,
       không gửi đi → bỏ.
     · Phân công — Cán bộ là ô chọn NHIỀU: gốc gửi thẳng giá trị ô (mảng); ở đây nối dấu phẩy — kiểm trên host.
     · Phân công — Sửa: gốc chỉ đổ id phạm vi vào ô Lớp (các ô trên trống, ô Lớp chưa nạp → không hiện gì). Ở đây hiện
       "Phạm vi hiện tại" và nếu không chọn lại Hệ/Khoá/CT/Lớp thì GIỮ phạm vi cũ khi lưu.
     · Đơn vị → Cán bộ KHÔNG khoá (đơn vị trống = mọi cán bộ, như gốc nạp sẵn lúc mở màn — lọc tuỳ chọn).
     · Cột Hiệu lực: 0 → Không, còn lại → Có (gốc in số thô).
   Bỏ: ô tìm kiếm / btnSearch (không có trong html gốc), khối "thành viên" genModal_NhanSu (không có vùng nào trên màn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var host = document.getElementById('ttc-giayto');
    if (!host) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function hieuLuc(r) { return String(r.HIEULUC) === '0' ? 'Không' : 'Có'; }
    var CO_KHONG = { items: [{ ID: '1', TEN: 'Có' }, { ID: '0', TEN: 'Không' }] };
    var CCTC = { call: { action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' }, name: 'TEN' };

    host.innerHTML = '<div data-z="main"></div><div data-z="sub" hidden></div>';
    var zMain = host.querySelector('[data-z="main"]'), zSub = host.querySelector('[data-z="sub"]');

    /* =====================================================================
       Danh mục chung
       ===================================================================== */
    var dmTruong = ums.api.dm('MOTCUA.TRUONGTHONGTIN').then(arr, function () { return []; });
    var khai = { daCo: {} };        // trường cần khai đang sửa: daCo[truongId] = id bản ghi MoRong

    function nutXem(k, r) { return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-xem': k, 'data-id': r.ID } }); }
    var G = ['Thời gian xử lý'];
    var crud = ums.crud({
        root: zMain,
        title: 'Giấy tờ',
        formTitle: 'danh mục chung',
        icon: 'fa-list-timeline',
        formCols: 12,
        formDelete: false, rowDelete: false,
        list: {
            paged: true,
            call: function () { return { action: 'SV_MotCua_DanhMuc/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '' }; }
        },
        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'TEN' },
            { title: 'Đơn vị phụ trách', prop: 'DONVIPHUTRACH_TEN' },
            { title: 'Số lượng tối đa', prop: 'SOLUONGTOIDA', cls: 'is-center' },
            { title: 'Ngày', prop: 'SONGAY_XULY', cls: 'is-center', group: G },
            { title: 'Giờ', prop: 'SOGIO_XULY', cls: 'is-center', group: G },
            { title: 'Phút', prop: 'SOPHUT_XULY', cls: 'is-center', group: G },
            { title: 'Hiệu lực', cls: 'is-center', render: hieuLuc },
            { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Phí', cls: 'is-center', render: function (r) { return nutXem('phi', r); } },
            { title: 'Phân công', cls: 'is-center', render: function (r) { return nutXem('pc', r); } },
            { title: 'Ngày làm việc', cls: 'is-center', render: function (r) { return nutXem('nlv', r); } }
        ],
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã', cols: 12 },
            { key: 'strTen', col: 'TEN', label: 'Tên', cols: 12 },
            { key: 'strDonViPhuTrach_Id', col: 'DONVIPHUTRACH_ID', label: 'Đơn vị', type: 'select', source: CCTC, placeholder: 'Chọn đơn vị', cols: 12 },
            { key: 'dSoNgay_XuLy', col: 'SONGAY_XULY', label: 'Thời gian xử lý — Ngày', cols: 4 },
            { key: 'dSoGio_XuLy', col: 'SOGIO_XULY', label: 'Giờ', cols: 4 },
            { key: 'dSoPhut_XuLy', col: 'SOPHUT_XULY', label: 'Phút', cols: 4 },
            { key: 'dSoLuongToiDa', col: 'SOLUONGTOIDA', label: 'Số lượng', cols: 6 },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', source: CO_KHONG, value: '1', required: true, cols: 6 },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', cols: 12 },
            { key: '_tep', label: 'File mẫu', type: 'files', api: 'SV_Files' }
        ],
        onForm: function (row, c, extra) {
            khai.daCo = {};
            extra.innerHTML = pat.panel({ title: 'Danh sách các trường cần khai', icon: 'fa-list-check', flush: true, zone: 'khai', cls: 'ums-u-mt-4' });
            var z = extra.querySelector('[data-z="khai"]');
            z.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var daLuu = row ? ums.api.call({ action: 'SV_MotCua_DanhMuc_MoRong/LayDanhSach', method: 'GET', strTuKhoa: '', strMotCua_DanhMuc_Id: row.ID,
                strTruongThongTin_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) { return arr(r.data); }) : Promise.resolve([]);
            Promise.all([dmTruong, daLuu]).then(function (x) {
                x[1].forEach(function (m) { khai.daCo[m.TRUONGTHONGTIN_ID] = m.ID; });
                ui.table({ el: z, rows: x[0], empty: 'Chưa khai danh mục MOTCUA.TRUONGTHONGTIN', columns: [
                    { title: 'Trường thông tin', prop: 'TEN' },
                    { title: 'Hành động', prop: 'MA' },
                    { head: '<input type="checkbox" data-kk-all title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (t) {
                        return '<input type="checkbox" data-kk="' + esc(t.ID) + '"' + (khai.daCo[t.ID] ? ' checked' : '') + '>';
                    } }
                ] });
            }).catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'trường cần khai'); });
        },
        save: function (v, row) {
            return { action: 'SV_MotCua_DanhMuc/' + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                strMa: v.strMa, strTen: v.strTen, strMoTa: v.strMoTa, dSoLuongToiDa: v.dSoLuongToiDa, strDonViPhuTrach_Id: v.strDonViPhuTrach_Id,
                dSoNgay_XuLy: v.dSoNgay_XuLy, dSoGio_XuLy: v.dSoGio_XuLy, dSoPhut_XuLy: v.dSoPhut_XuLy, iThuTu: '', dHieuLuc: v.dHieuLuc,
                strNguoiThucHien_Id: uid() };
        },
        onSaved: function (c, result, isEdit) {
            var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
            if (!id) return;
            var calls = [];
            Array.prototype.forEach.call(c.root.querySelectorAll('input[data-kk]'), function (ck) {
                var t = ck.getAttribute('data-kk');
                if (ck.checked && !khai.daCo[t]) calls.push({ action: 'SV_MotCua_DanhMuc_MoRong/ThemMoi', method: 'POST', strId: '',
                    strMotCua_DanhMuc_Id: id, strTruongThongTin_Id: t, strMoTa: '', strNguoiThucHien_Id: uid() });
                else if (!ck.checked && khai.daCo[t]) calls.push({ action: 'SV_MotCua_DanhMuc_MoRong/Xoa', strIds: khai.daCo[t], strNguoiThucHien_Id: uid() });
            });
            if (calls.length) ui.batch(calls, { title: 'Đang lưu trường cần khai', okText: 'Đã lưu trường cần khai' });
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: 'SV_MotCua_DanhMuc/Xoa', method: 'POST', strIds: id, strNguoiThucHien_Id: uid() }; });
        }
    });
    zMain.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute('data-kk-all')) {
            Array.prototype.forEach.call(zMain.querySelectorAll('input[data-kk]'), function (c) { c.checked = ev.target.checked; });
        }
    });

    /* =====================================================================
       Khung con: Phí · Phân công · Ngày làm việc (thay chỗ danh sách chính)
       ===================================================================== */
    function dong() { ui.swap(zSub, zMain); zSub.innerHTML = ''; crud.load(); }
    function moKhung(k, dm) {
        zSub.innerHTML = '';
        var el = document.createElement('div');
        zSub.appendChild(el);
        if (k === 'phi') khungPhi(el, dm);
        else if (k === 'pc') khungPhanCong(el, dm);
        else khungNgay(el, dm);
        ui.swap(zMain, zSub);
    }
    zMain.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-xem]');
        if (!b) return;
        var dm = crud.rows.filter(function (r) { return String(r.ID) === b.getAttribute('data-id'); })[0];
        if (dm) moKhung(b.getAttribute('data-xem'), dm);
    });

    /* ---------- Danh mục phí ---------- */
    function khungPhi(el, dm) {
        ums.crud({
            root: el, embedded: true, back: dong,
            title: 'Danh mục Phí của - ' + e(dm.TEN), icon: 'fa-sack-dollar',
            formTitle: 'danh mục phí', formCols: 1,
            rowDelete: false, formDelete: false,
            list: { call: function () {
                return { action: 'SV_MotCua_DanhMuc_Phi/LayDanhSach', method: 'GET', strTuKhoa: '', strTaiChinh_CacKhoanThu_Id: '',
                    strMotCua_DanhMuc_Id: dm.ID, strHinhThucThanhToan_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
            } },
            columns: [
                { title: 'Khoản phí', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN); } },
                { title: 'Hình thức thanh toán', prop: 'HINHTHUCTHANHTOAN_TEN' },
                { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' },
                { title: 'Mô tả', prop: 'MOTA' }
            ],
            fields: [
                { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', label: 'Khoản phí', type: 'select', placeholder: 'Chọn khoản phí',
                  source: { call: { action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 10000,
                      strNhomCacKhoanThu_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: '' }, name: 'TEN' } },
                { key: 'strHinhThucThanhToan_Id', col: 'HINHTHUCTHANHTOAN_ID', label: 'Hình thức thanh toán', type: 'select',
                  source: { dm: 'MOTCUA.HINHTHUCTHANHTOAN' }, placeholder: 'Chọn hình thức thanh toán' },
                { key: 'dSoTien', col: 'SOTIEN', label: 'Số tiền', type: 'number' },
                { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }
            ],
            save: function (v, row) {
                return { action: 'SV_MotCua_DanhMuc_Phi/' + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                    dSoTien: v.dSoTien, strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id, strNgayApDung: v.strNgayApDung,
                    strMoTa: v.strMoTa, strHinhThucThanhToan_Id: v.strHinhThucThanhToan_Id, strMotCua_DanhMuc_Id: dm.ID, strNguoiThucHien_Id: uid() };
            },
            remove: function (ids) { return ids.map(function (id) { return { action: 'SV_MotCua_DanhMuc_Phi/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
        });
    }

    /* ---------- Phân công + lưới người dùng × trạng thái ---------- */
    function khungPhanCong(el, dm) {
        el.innerHTML = '<div data-z="pc"></div><div class="ums-u-mt-4" data-z="nd"></div>';
        var zPC = el.querySelector('[data-z="pc"]'), zND = el.querySelector('[data-z="nd"]');
        var F = {}, dang = null;
        function ndLoad() {
            return ums.api.call({ action: 'SV_MotCua_Chung/LayDSNguoiDung', method: 'GET', strNguoiThucHien_Id: uid(), silent: true })
                .then(function (r) { return arr(r.data); });
        }
        function napCanBo() {
            return ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 100000,
                strDaoTao_CoCauToChuc_Id: F.dv.value, strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: -1, silent: true })
                .then(function (r) { pat.fill(F.cb, arr(r.data), { name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } }); })
                .catch(function (err) { ums.api.handle(err, 'cán bộ'); });
        }
        ums.crud({
            root: zPC, embedded: true, back: dong,
            title: 'Phân công của - ' + e(dm.TEN), icon: 'fa-network-wired',
            formTitle: 'phân công',
            rowDelete: false, formDelete: false,
            list: { call: function () {
                return { action: 'SV_MotCua_DanhMuc_PhanCong/LayDanhSach', method: 'GET', strTuKhoa: '', strMotCua_DanhMuc_Id: dm.ID,
                    strNguoiDung_Id: '', strPhamViApDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
            } },
            columns: [
                { title: 'Danh mục', prop: 'MOTCUA_DANHMUC_TEN' },
                { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
                { title: 'Người dùng', prop: 'NGUOIDUNG_TAIKHOAN' },
                { title: 'Vai trò', prop: 'VAITRO_TEN' },
                { title: 'Mô tả', prop: 'MOTA' }
            ],
            fields: [],
            onForm: function (row, c, extra) {
                dang = row;
                zND.hidden = true;
                extra.innerHTML = '<div class="ums-grid ums-grid--2">' +
                    (row ? '<div style="grid-column:1 / -1">' + ui.field('Phạm vi hiện tại', '<div class="ums-u-fz13"><b>' + esc(e(row.PHAMVIAPDUNG_TEN) || '—') + '</b> — chọn lại bên dưới để đổi</div>') + '</div>' : '') +
                    ui.field('Hệ đào tạo', '<select class="ums-select" data-p="he"></select>') +
                    ui.field('Khóa đào tạo', '<select class="ums-select" data-p="khoa"></select>') +
                    ui.field('Chương trình', '<select class="ums-select" data-p="ct"></select>') +
                    ui.field('Lớp', '<select class="ums-select" data-p="lop"></select>') +
                    ui.field('Đơn vị', '<select class="ums-select" data-p="dv" data-ph="Chọn đơn vị"><option value="">Chọn đơn vị</option></select>') +
                    ui.field('Cán bộ', '<select class="ums-select" data-p="cb" multiple data-ph="Chọn thành viên"></select>') + '</div>';
                ['he', 'khoa', 'ct', 'lop', 'dv', 'cb'].forEach(function (k) { F[k] = extra.querySelector('[data-p="' + k + '"]'); });
                ui.enhance(extra);
                ums.ref.cascade({ he: F.he, khoa: F.khoa, ct: F.ct, lop: F.lop,
                    labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo', lop: 'Chọn lớp' } });
                ums.api.call(Object.assign({ silent: true }, CCTC.call)).then(function (r) { pat.fill(F.dv, arr(r.data), { head: 'Chọn đơn vị' }); })
                    .catch(function (err) { ums.api.handle(err, 'đơn vị'); });
                napCanBo().then(function () {
                    if (row && row.NGUOIDUNG_ID && window.jQuery) jQuery(F.cb).val(String(row.NGUOIDUNG_ID).split(',')).trigger('change.select2').trigger('ums:refresh');
                });
                if (window.jQuery) jQuery(F.dv).on('select2:select select2:clear', napCanBo);
            },
            save: function (v, row) {
                var pv = F.lop.value || F.ct.value || F.khoa.value || F.he.value || (row ? e(row.PHAMVIAPDUNG_ID) : '');
                var cb = window.jQuery ? (jQuery(F.cb).val() || []) : [];
                return { action: 'SV_MotCua_DanhMuc_PhanCong/' + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                    strPhamViApDung_Id: pv, strVaiTro_Id: '', strNguoiDung_Id: cb.join(','), strMoTa: '', strMotCua_DanhMuc_Id: dm.ID,
                    strNguoiThucHien_Id: uid() };
            },
            onList: function () { zND.hidden = false; },
            remove: function (ids) { return ids.map(function (id) { return { action: 'SV_MotCua_DanhMuc_PhanCong/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
        });

        var nd = pat.rows(zND, {
            title: 'Người dùng xử lý theo trạng thái', icon: 'fa-user-gear', minRows: 2,
            tools: ui.btn('save', { attr: { 'data-nd': 'luu' } }),
            columns: [
                { key: 'strNguoiDung_Id', col: 'NGUOIDUNG_ID', title: 'Người dùng', type: 'select', s2: true, placeholder: 'Chọn người dùng',
                  source: { load: ndLoad, name: function (x) { return e(x.TENDAYDU) + ' - ' + e(x.TAIKHOAN); } } },
                { key: 'strTinhTrangXuLy_Id', col: 'TINHTRANGXULY_ID', title: 'Trạng thái', type: 'select', placeholder: 'Chọn trạng thái',
                  source: { dm: 'MOTCUA.TINHTRANGXULY' } }
            ],
            // Cấu hình chung (gốc gửi strQLSV_KeHoach_NguoiHoc_Id = biến không tồn tại → rỗng) — "cha" giả để pat.rows nạp / lưu
            list: function () {
                return { action: 'SV_MotCua_TT_NguoiDung/LayDanhSach', method: 'GET', strTuKhoa: '', strQLSV_KeHoach_NguoiHoc_Id: '',
                    strTruongThongTin_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 200000 };
            },
            filled: function (v) { return !!v.strNguoiDung_Id && !!v.strTinhTrangXuLy_Id; },
            save: function (v, rec) {
                return { action: 'SV_MotCua_TT_NguoiDung/' + (rec ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: rec ? rec.ID : '',
                    strTinhTrangXuLy_Id: v.strTinhTrangXuLy_Id, strNguoiDung_Id: v.strNguoiDung_Id, strNguoiThucHien_Id: uid() };
            },
            remove: function (rec) { return { action: 'SV_MotCua_TT_NguoiDung/Xoa', strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
        });
        nd.load('chung');
        zND.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-nd="luu"]')) return;
            nd.save('chung').then(function () { ui.toast('Thực hiện thành công', 'ok'); nd.load('chung'); });
        });
    }

    /* ---------- Ngày làm việc ---------- */
    var THU = [2, 3, 4, 5, 6, 7, 8];
    function tenThu(t) { return Number(t) === 8 ? 'Chủ nhật' : 'Thứ ' + t; }
    function khungNgay(el, dm) {
        ums.crud({
            root: el, embedded: true, back: dong,
            title: 'Ngày làm việc để tính giới hạn trả lời - ' + e(dm.TEN), icon: 'fa-calendar-lines-pen',
            formTitle: 'ngày làm việc', canEdit: false,
            rowDelete: false, formDelete: false,
            list: { call: function () {
                return { action: 'SV_MotCua_DanhMuc_NgayLV/LayDanhSach', method: 'GET', strTuKhoa: '', strMotCua_DanhMuc_Id: dm.ID,
                    strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000 };
            } },
            columns: [
                { title: 'Danh mục', prop: 'MOTCUA_DANHMUC_TEN' },
                { title: 'Thứ', cls: 'is-center', render: function (r) {
                    return esc(String(e(r.THUTRONGTUAN)).split(',').filter(Boolean).map(function (t) { return tenThu(t.trim()); }).join(', '));
                } }
            ],
            fields: [],
            onForm: function (row, c, extra) {
                // resetPopup_NgayLamViec gốc: đánh dấu sẵn cả 7 ngày
                extra.innerHTML = ui.field('Ngày làm việc', '<div class="ums-checkgrid">' + THU.map(function (t) {
                    return '<label class="ums-check"><input type="checkbox" data-thu="' + t + '" checked> ' + tenThu(t) + '</label>';
                }).join('') + '</div>');
            },
            save: function (v, row, c) {
                var thu = Array.prototype.filter.call(c.root.querySelectorAll('input[data-thu]'), function (x) { return x.checked; })
                    .map(function (x) { return x.getAttribute('data-thu'); });
                if (!thu.length) { ui.toast('Vui lòng chọn ít nhất một ngày', 'warn'); return null; }
                return { action: 'SV_MotCua_DanhMuc_NgayLV/ThemMoi', method: 'POST', dThuTrongTuan: thu.join(','),
                    strMotCua_DanhMuc_Id: dm.ID, strNguoiThucHien_Id: uid() };
            },
            remove: function (ids) { return ids.map(function (id) { return { action: 'SV_MotCua_DanhMuc_NgayLV/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
        });
    }
})();
