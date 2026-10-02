/* =========================================================================
   Quản lý toàn bộ hồ sơ sinh viên
   Bản gốc: ApisSinhVien/Modules/hoso/html/quanlytoanbo.html + script/quanlytoanbo.js (html nạp "QuanLyToanBo.js")
            + dexuathoso.js + zoneEditModal_inject.js (biểu mẫu "Chỉnh sửa - Hồ sơ đề xuất" — ums.hsA.editor)
   ---------------------------------------------------------------------------
   Bố cục gốc MỘT cột, các vùng thay chỗ nhau (zone-bus):
       #zonebatdau  thanh lọc (Hệ · Khoá · CT · Lớp · Năm nhập học · Khoa QL · Học kỳ — CHỌN NHIỀU; Từ ngày · Đến ngày ·
                    từ khoá · Tìm kiếm; Xuất báo cáo / Import; "Chọn trạng thái sinh viên") + "Danh sách" (Thêm mới ·
                    bảng 19 cột · Xóa các dòng đánh dấu)
       #zoneEdit    biểu mẫu 3 tab (gốc: hộp nổi phủ trang) — ở đây thay chỗ danh sách (luật biểu mẫu thay chỗ)
       #zoneLuuY    "Thông tin lưu ý" của một dòng: danh sách + hộp Nội dung → ums.crud lồng (biểu mẫu thay chỗ bảng)
       Hộp: Quá trình quyết định · Quá trình chuyển lớp · Chi tiết tài chính (ums.ibd.taiChinh — CHÍNH khung của
            Cổng cán bộ inbangdiem, gốc ghi "port từ ApisCongCanBo/inbangdiem").
   Thanh lọc: ums.pat.boLocNguoiHoc (tầng chung, gốc từ Xử lý học vụ — cùng khuôn gốc: getList_* KHÔNG lọc quyền,
   KHCT_NamNhapHoc/LayDanhSach GET, QLSV.TRANGTHAI đánh dấu sẵn; hosoB dùng cùng bộ này cho quahan / timkiemsinhvien).
   Lời gọi (chép nguyên):
       SV_HoSoHocVien_MH · pkg_hosohocvien.LayDanhSachHoSoNhieuNganh GET — strTuKhoa, strKhoaQuanLy_Id, strHeDaoTao_Id,
            strKhoaDaoTao_Id, strChuongTrinh_Id, strLopQuanLy_Id, strNamNhapHoc, strTrangThaiNguoiHoc_Id, strChucNang_Id,
            strNguoiTao_Id '', strNgayBatDau, strNgayKetThuc, strNguoiThucHien_Id, pageIndex, pageSize (gốc đặt pageSize 10)
       SV_HoSo/Xoa (strIds = QLSV_NGUOIHOC_ID của từng dòng đánh dấu) · SV_HoSo/LayDanhSach GET (strTuKhoa = mã số, lấy
            GENDER_ID / DANTOC_MA… trước khi mở biểu mẫu, như gốc)
       SV_QuyetDinh_NguoiHoc/LayDanhSach · SV_HoatDong_ThayDoi/LayDanhSach GET (strQLSV_QuyetDinh_Id '', strQLSV_NguoiHoc_Id)
       SV_HSSV_ThongTin_MH · PKG_HOSOSINHVIEN_THONGTIN.LayDSQLSV_ThongTin_CapNhat / Them_ / Sua_ / Xoa_QLSV_ThongTin_CapNhat
            (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id = DAOTAO_TOCHUCCHUONGTRINH_ID, strNoiDung, strId)
       TC_ThongTinChung/LayDSKhoan* (8 lời gọi — trong ums.ibd.taiChinh)
       Báo cáo: getList_MauImport("zonebtnBaoCao_QLTB") có vùng _Import → ums.report.mount (cả Import).
   Giữ như gốc (đã ghi sổ): strKhoaQuanLy_Id và strNamNhapHoc của danh sách bị gán HAI lần trong obj_save gốc, lần sau
   là ô txtAAAA / dropAAAA không tồn tại → luôn gửi RỖNG (hai ô lọc này chỉ có tác dụng với báo cáo); ô Học kỳ có
   mà không gửi đi đâu; cột "Hộ khẩu thường trú" đổ TTLL_KHICANBAOTINCHOAI_ODAU.
   Khác gốc: Hệ → Khoá → CT → Lớp khoá tầng dưới (luật cha → con, trong boLoc). Xoá gốc gắn $("#btnYes") mỗi lần
   (bấm lần hai xoá hai lần) → một hộp hỏi mỗi lần.
   Cố ý bỏ (mã chết): TaoHangDoi (không nút), save_HS / ThanhVien / TuNhapHoSo / save_Anh / TabThongTin (vùng
   #zoneEditOld đã chú thích bỏ trong html), fallback nạp lại dexuathoso.js + tự chèn modal khi thiếu tệp.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, A = ums.hsA, e = A.e;
    var root = document.getElementById('sv-quanlytoanbo');
    if (!root) return;

    root.innerHTML = pat.page('Quản lý toàn bộ', ui.btn('add', { attr: { 'data-a': 'them' } })) +
        '<div data-q="ds"><div data-q="loc"></div>' +
        pat.panel({ title: 'Danh sách', icon: 'fa-building', count: 'n', flush: true, zone: 'bang',
            tools: ui.xoaChon('input[data-ck]', { trong: '[data-z="bang"]', attr: { 'data-a': 'xoa' } }) }) + '</div>' +
        '<div data-q="ed" hidden></div><div data-q="luuy" hidden></div>';
    function Q(k) { return root.querySelector('[data-q="' + k + '"]'); }
    var zDs = Q('ds'), zEd = Q('ed'), zLy = Q('luuy'), bang = zDs.querySelector('[data-z="bang"]'), dem = zDs.querySelector('[data-z="n"]');
    /* Đang ở biểu mẫu / lưu ý thì giấu nút đầu trang (Thêm mới) — như ums.crud / pat.master formMode */
    function veDs(ve) { var a = root.querySelector('.ums-page__actions'); if (a) a.hidden = !ve; }

    /* ---------- Thanh lọc ---------- */
    var loc = ums.pat.boLocNguoiHoc(Q('loc'), { hang: [['he', 'khoa', 'ct', 'lop'], ['nam', 'kql', 'hk'], ['q', 'nut']] });
    var oQ = loc.f('q').closest('.ums-field');
    oQ.insertAdjacentHTML('beforebegin',
        '<div class="ums-field"><input class="ums-input" data-f="tu" data-date placeholder="Từ ngày" autocomplete="off"></div>' +
        '<div class="ums-field"><input class="ums-input" data-f="den" data-date placeholder="Đến ngày" autocomplete="off"></div>');
    ui.enhance(Q('loc'));
    Q('loc').addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) tai(1); });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

    function chon() { return Array.prototype.filter.call(bang.querySelectorAll('input[data-ck]'), function (x) { return x.checked; }).map(function (x) { return x.getAttribute('data-ck'); }); }
    ums.report.mount(loc.z('bc'), {
        collect: function (add) {
            var ids = chon();
            add('strTuKhoa', loc.f('q').value.trim());
            add('strChucNang_Id', (ums.state && ums.state.chucNangId) || '');
            [0, 1, 2, 3].forEach(function (i) {
                add('strNguoiHoc_ThanhPhan_Ids_0' + (i + 1), ids.slice(i * 120, (i + 1) * 120).toString());
                add('strNguoiHoc_ThanhPhan_0' + (i + 1), '');
            });
            add('strNamNhapHoc', loc.v('nam'));
            add('strKhoaQuanLy_Id', loc.v('kql'));
            add('strHeDaoTao_Id', loc.v('he'));
            add('strKhoaDaoTao_Id', loc.v('khoa'));
            add('strChuongTrinh_Id', loc.v('ct'));
            add('strLopQuanLy_Id', loc.v('lop'));
            add('strNguoiDangNhap_Id', A.uid());
            add('strTrangThaiNguoiHoc_Id', loc.tt.val());
        }
    });

    /* ---------- Danh sách ---------- */
    var st = { index: 1, size: 10, total: 0, rows: [] }, token = 0;
    function val(k) { var el = Q('loc').querySelector('[data-f="' + k + '"]'); return el ? el.value.trim() : ''; }
    function tai(p) {
        if (p) st.index = p;
        var t = ++token;
        bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP', func: 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh', method: 'GET',
            strTuKhoa: loc.f('q').value.trim(),
            strKhoaQuanLy_Id: '',                        // gốc gán lần hai = dropAAAA (không có) → rỗng
            strHeDaoTao_Id: loc.v('he'), strKhoaDaoTao_Id: loc.v('khoa'), strChuongTrinh_Id: loc.v('ct'), strLopQuanLy_Id: loc.v('lop'),
            strNamNhapHoc: '',                           // gốc = txtAAAA (không có) → rỗng
            strTrangThaiNguoiHoc_Id: loc.tt.val(), strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strNguoiTao_Id: '',
            strNgayBatDau: val('tu'), strNgayKetThuc: val('den'), strNguoiThucHien_Id: A.uid(),
            pageIndex: st.index, pageSize: st.size === 'all' ? 1000000 : st.size
        }).then(function (x) {
            if (t !== token) return;
            st.rows = A.arr(x.data); st.total = Number(x.pager) || st.rows.length;
            ve();
        }).catch(function (err) {
            if (t !== token) return;
            bang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách hồ sơ');
        });
    }
    function xem(k, i, title) { return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-x': k, 'data-i': i, title: title } }); }
    function lk(r, i, v) { return '<button type="button" class="ums-link" data-x="sua" data-i="' + i + '" title="Sửa">' + esc(e(v)) + '</button>'; }
    function ve() {
        dem.textContent = '(' + st.total + ')';
        ui.table({ el: bang, rows: st.rows, empty: 'Không có hồ sơ',
            page: { index: st.index, size: st.size, total: st.total, sizes: ums.ui.PAGE_SIZES, onChange: function (p) { tai(p); }, onSize: function (v) { st.size = v; tai(1); } },
            columns: [
                { title: 'Mã số', cls: 'is-nowrap', render: function (r, i) { return lk(r, i, r.QLSV_NGUOIHOC_MASO); } },
                { title: 'Họ đệm', cls: 'is-nowrap', render: function (r, i) { return lk(r, i, r.QLSV_NGUOIHOC_HODEM); } },
                { title: 'Tên', cls: 'is-nowrap', render: function (r, i) { return lk(r, i, r.QLSV_NGUOIHOC_TEN); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' },
                { title: 'Tài chính', cls: 'is-center', render: function (r, i) { return xem('tc', i, 'Xem chi tiết tài chính'); } },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
                { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' },
                { title: 'Hộ khẩu thường trú', prop: 'TTLL_KHICANBAOTINCHOAI_ODAU' },
                { title: 'Số QĐ', prop: 'QLSV_QUYETDINH_SOQD', cls: 'is-center' },
                { title: 'Lý do', prop: 'QLSV_QUYETDINH_LYDO', cls: 'is-center' },
                { title: 'Quá trình', cls: 'is-center', render: function (r, i) { return xem('qt', i, 'Xem quá trình'); } },
                { title: 'Quyết định', cls: 'is-center', render: function (r, i) { return xem('qd', i, 'Xem quyết định'); } },
                { title: 'Thông tin lưu ý', cls: 'is-center', render: function (r, i) { return xem('ly', i, 'Thông tin lưu ý'); } },
                { title: 'Chi tiết', cls: 'is-actions', render: function (r, i) { return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-x="sua" data-i="' + i + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>'; } },
                { head: '<input type="checkbox" data-ck-all title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (r) { return '<input type="checkbox" data-ck="' + esc(r.ID) + '">'; } }
            ] });
    }
    bang.addEventListener('change', function (ev) {
        if (!ev.target.matches('[data-ck-all]')) return;
        Array.prototype.forEach.call(bang.querySelectorAll('input[data-ck]'), function (x) { x.checked = ev.target.checked; });
    });

    function nhan(r) { return e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN) + ' - ' + e(r.QLSV_NGUOIHOC_MASO); }
    function hopBang(title, icon, r, action, columns) {
        var dlg = ui.dialog({ title: title + ' - ' + nhan(r), icon: icon, size: 'xl', body: '<div data-x="b">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-x="b"]');
        ums.api.call({ action: action, method: 'GET', strQLSV_QuyetDinh_Id: '', strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID })
            .then(function (x) { ui.table({ el: h, rows: A.arr(x.data), empty: 'Không có dữ liệu', columns: columns }); })
            .catch(function (err) { h.innerHTML = ui.fail(err.message); });
    }

    root.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-a]');
        if (a && a.getAttribute('data-a') === 'them') { ums.app.openPath('/modules/hoso/html/hoso_taomoi.html'); return; }
        if (a && a.getAttribute('data-a') === 'xoa' && zDs.contains(a)) { xoa(); return; }
        var b = ev.target.closest('[data-x]');
        if (!b || !bang.contains(b)) return;
        var r = st.rows[Number(b.getAttribute('data-i'))];
        if (!r) return;
        var k = b.getAttribute('data-x');
        if (k === 'sua') moSua(r);
        else if (k === 'tc') ums.ibd.taiChinh(r);
        else if (k === 'qd') hopBang('Quá trình quyết định', 'fa-file-signature', r, 'SV_QuyetDinh_NguoiHoc/LayDanhSach', [
            { title: 'Số quyết định', prop: 'SOQUYETDINH', cls: 'is-center' }, { title: 'Ngày quyết định', prop: 'NGAYQUYETDINH', cls: 'is-center' },
            { title: 'Ngày hiệu lực', prop: 'NGAYHIEULUC', cls: 'is-center' }, { title: 'Nguyên nhân - lý do', prop: 'NGUYENNHAN_LYDO' },
            { title: 'Loại quyết định', prop: 'LOAIQUYETDINH_TEN' }, { title: 'Kỳ hiệu lực', prop: 'DSKETQUANHIEUKY' }]);
        else if (k === 'qt') hopBang('Quá trình chuyển lớp', 'fa-arrow-right-arrow-left', r, 'SV_HoatDong_ThayDoi/LayDanhSach', [
            { title: 'Lớp cũ', prop: 'DAOTAO_LOPCU_TEN' }, { title: 'Lớp mới', prop: 'DAOTAO_LOPMOI_TEN', cls: 'is-center' },
            { title: 'Số quyết định', prop: 'SOQUYETDINH' }, { title: 'Loại quyết định', prop: 'LOAIQUYETDINH_TEN' },
            { title: 'Ngày hiệu lực', prop: 'NGAYHIEULUC', cls: 'is-center' }]);
        else if (k === 'ly') moLuuY(r);
    });

    function xoa() {
        var ids = chon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa ' + ids.length + ' dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            var calls = ids.map(function (id) {
                var r = st.rows.filter(function (x) { return x.ID === id; })[0];
                return r ? { action: 'SV_HoSo/Xoa', strIds: r.QLSV_NGUOIHOC_ID } : function () { return Promise.reject(new Error('Không tìm được sinh viên')); };
            });
            ui.batch(calls, { title: 'Đang xoá', okText: 'Xóa thành công!' }).then(function () { tai(); });
        });
    }

    /* ---------- Biểu mẫu hồ sơ (thay chỗ danh sách) ---------- */
    var ed = A.editor(zEd, { onDong: function () { ui.swap(zEd, zDs); veDs(true); tai(); } });
    function moSua(r) {
        var ns = e(r.QLSV_NGUOIHOC_NGAYSINH).split(' ')[0].split('/'), ma = e(r.QLSV_NGUOIHOC_MASO);
        function mo(full) {
            full = full || {};
            var p = A.nguoi(Object.assign({}, r, full));
            p.id = r.QLSV_NGUOIHOC_ID;
            p.hoDem = full.HODEM || r.QLSV_NGUOIHOC_HODEM || '';
            p.ten = full.TEN || r.QLSV_NGUOIHOC_TEN || '';
            p.ngay = full.NGAYSINH_NGAY || ns[0] || ''; p.thang = full.NGAYSINH_THANG || ns[1] || '';
            p.nam = full.BIRTH_YEAR || full.NGAYSINH_NAM || ns[2] || '';
            p.gioiTinh = full.GENDER_ID || '';
            p.ma = ma;
            ui.swap(zDs, zEd); veDs(false);
            ed.mo(p);
        }
        if (!ma) { mo({}); return; }
        // API danh sách chỉ trả thông tin học vụ — lấy thêm SV_HoSo/LayDanhSach theo mã số (GENDER_ID, DANTOC_MA…) như gốc
        ums.api.call(A.callHoSo(ma, { he: '', khoa: '', ct: '', lop: '' }, 1, 10)).then(function (x) {
            var ds = A.arr(x.data);
            mo(ds.filter(function (y) { return y.MASO === ma || y.ID === r.QLSV_NGUOIHOC_ID; })[0] || ds[0]);
        }, function () { mo({}); });
    }

    /* ---------- Thông tin lưu ý (zoneLuuY) ---------- */
    var lyRow = null;
    var LY = 'SV_HSSV_ThongTin_MH/', PLY = 'PKG_HOSOSINHVIEN_THONGTIN.';
    var ly = ums.crud({
        root: zLy, embedded: true, title: 'Thông tin lưu ý', listTitle: 'Danh sách', formTitle: 'lưu ý', icon: 'fa-note-sticky',
        addText: 'Thêm', formCols: 1, autoload: false,
        back: function () { ui.swap(zLy, zDs); veDs(true); },
        list: { call: function () {
            return { action: LY + 'DSA4BRIQDRIXHhUpLi8mFSgvHgIgMQ8pIDUP', func: PLY + 'LayDSQLSV_ThongTin_CapNhat',
                strQLSV_NguoiHoc_Id: lyRow ? lyRow.QLSV_NGUOIHOC_ID : '', strDaoTao_ChuongTrinh_Id: lyRow ? lyRow.DAOTAO_TOCHUCCHUONGTRINH_ID : '' };
        } },
        columns: [
            { title: 'Nội dung', prop: 'NOIDUNG' },
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } },
            { title: 'Chương trình', render: function (r) { return esc(e(r.DAOTAO_CHUONGTRINH_TEN) + ' - ' + e(r.DAOTAO_CHUONGTRINH_MA)); } },
            { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' },
            { title: 'Ngày tạo', prop: 'NGAY_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Ngày cập nhật', prop: 'NGAYCUOI_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người cập nhật', prop: 'NGUOICUOI_TAIKHOAN' }
        ],
        fields: [{ key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung' }],
        save: function (v, row) {
            return { action: LY + (row ? 'EjQgHhANEhceFSkuLyYVKC8eAiAxDykgNQPP' : 'FSkkLB4QDRIXHhUpLi8mFSgvHgIgMQ8pIDUP'),
                func: PLY + (row ? 'Sua_QLSV_ThongTin_CapNhat' : 'Them_QLSV_ThongTin_CapNhat'), strId: row ? row.ID : '',
                strNoiDung: v.strNoiDung, strQLSV_NguoiHoc_Id: lyRow.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: lyRow.DAOTAO_TOCHUCCHUONGTRINH_ID };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: LY + 'GS4gHhANEhceFSkuLyYVKC8eAiAxDykgNQPP', func: PLY + 'Xoa_QLSV_ThongTin_CapNhat', strId: id }; }); }
    });
    function moLuuY(r) {
        lyRow = r;
        ly.showList();
        ui.swap(zDs, zLy); veDs(false);
        ly.load(1);
    }

    /* Lần đầu đợi nhóm "trạng thái sinh viên" (đánh dấu sẵn) vẽ xong để gửi đủ — gốc chạy đua hai lời gọi */
    ums.api.dm('QLSV.TRANGTHAI').then(function () { setTimeout(function () { tai(1); }, 0); }, function () { tai(1); });
})();
