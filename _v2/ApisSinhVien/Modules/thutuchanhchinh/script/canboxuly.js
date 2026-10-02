/* =========================================================================
   Cán bộ xử lý yêu cầu một cửa (bản CÁN BỘ — theo dõi và cập nhật tình trạng các yêu cầu sinh viên gửi)
   Bản gốc: ApisSinhVien/Modules/thutuchanhchinh/html/canboxuly.html + script/canboxuly.js
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (MỘT cột): thanh lọc (Hệ → Khoá → Chương trình → Lớp, Mốc kiểm tra, Cán bộ, Từ ngày, Đến
   ngày, Tình trạng, từ khoá) → "Danh sách" (phân trang máy chủ, cột ô chọn cuối, nút "Xử lý") → hộp "Xử lý",
   hộp "Lịch sử", hộp trao đổi với sinh viên.

   Lời gọi (kiểu cũ, chép nguyên tên tham số):
     SV_MotCua_XuLy/LayDSTheoDoiTinhTrangYeuCau  GET (strTuKhoa, strKhoaQuanLy_Id '' — gốc đọc ô không có,
                  strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id, strLopQuanLy_Id, strCanBoXuLy_Id, strTuNgay,
                  strDenNgay, strTinhTrangKiemTra_Id = Mốc kiểm tra, strTinhTrangXuLy_Id, strNguoiTao_Id = người đăng nhập,
                  pageIndex/pageSize)
     danh mục MOTCUA.DIEMMOCKIEMTRA                → ô Mốc kiểm tra
     SV_MotCua_Chung/LayDSNguoiDung  GET            → ô Cán bộ (TENDAYDU)
     SV_MotCua_XuLy/LayDMucTinhTrangXuLy  GET       → ô Tình trạng (lọc) + ô Tình trạng của hộp Xử lý khi chọn NHIỀU dòng
     SV_MotCua_XuLy/LayDSTinhTrangXuLyTiep GET      → ô Tình trạng của hộp Xử lý khi chọn MỘT dòng (strMotCua_NguoiHoc_YeuCau_Id)
     SV_MotCua_NguoiHoc_YeuCau_XL/ThemMoi  POST     mỗi dòng đã chọn một lời gọi (strQLSV_NguoiHoc_Id, strNguoiXuLy_Id =
                  người đăng nhập, strTinhTrangXuLy_Id, strMotCua_NguoiHoc_YeuCau_Id = ID dòng, strMotCua_DanhMuc_Id, strMoTa)
     SV_MotCua_XuLy/LayDSLichSuXuLyYeuCau  GET      → hộp "Lịch sử"
     SV_MotCua_Chung/LayDSDanhMucMoRong    GET      → cột "File": máy chủ sinh tệp, trả đường dẫn ở Id → mở tab mới
     SV_MotCua_ThongTin/LayDSMotCua_NH_YC_XL_PhanHoi · Them_… · Xoa_…   → khối trao đổi (ums.ttc.binhLuan)
     Hệ/Khoá/CT/Lớp: edu.system.getList_* (bản KHÔNG lọc quyền) → ums.ref.cascade (chưa chọn tầng trên thì khoá tầng dưới).
   Lỗi gốc đã sửa (làm theo ý định):
     · Nút "Tình trạng hiện tại" mở khung trao đổi CHƯA TỪNG hiện: gốc chèn khung vào #zoneChat không có trong html,
       rồi đọc phần tử rỗng → TypeError. Nay mở hộp trao đổi (khối chung ums.ttc.binhLuan của Cổng SV, cờ laSV: tin
       không phải của người đăng nhập là của sinh viên — gốc đặt tin của người đăng nhập bên phải).
     · Hộp "Lịch sử": cột "Ngày gửi yêu cầu" gốc đọc NGAYTAO_DD_MM_YYY (thiếu chữ Y) → đọc cả hai tên.
   Khác gốc:
     · Lưu "Xử lý" chạy tuần tự qua ums.ui.batch, xong nạp lại danh sách (gốc bắn song song).
     · Hộp Xử lý: chọn tình trạng là bắt buộc (gốc gửi rỗng được).
     · Cột "Đánh giá" vẽ sao chỉ xem (gốc cũng chỉ vẽ, không gắn xử lý).
   Bỏ: hàm chết (resetPopup đọc các ô không có, getList_NamNhapHoc / KhoaQuanLy / ThoiGianDaoTao / genList_TrangThaiSV,
   nút btnXoaCanBoXuLy không có trong html).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.ttc;
    var root = document.getElementById('ttc-canboxuly');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET' }, o)); }
    function hoTen(r) { return e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN); }

    root.innerHTML =
        pat.page('Cán bộ xử lý', '') +
        pat.filterBar([
            { key: 'he', type: 'select', label: 'Tất cả hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Tất cả khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Tất cả chương trình đào tạo' },
            { key: 'lop', type: 'select', label: 'Tất cả lớp' },
            { key: 'moc', type: 'select', label: 'Chọn mốc kiểm tra' },
            { key: 'cb', type: 'select', label: 'Chọn cán bộ' },
            { key: 'tu', type: 'date', label: 'Từ ngày dd/mm/yyyy' },
            { key: 'den', type: 'date', label: 'Đến ngày dd/mm/yyyy' },
            { key: 'tt', type: 'select', label: 'Chọn tình trạng' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Xử lý', icon: 'fa-gear', mod: 'primary', attr: { 'data-a': 'xuly' } }) });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    ums.ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
        labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' } });
    ums.api.dm('MOTCUA.DIEMMOCKIEMTRA').then(function (d) { pat.fill(f('moc'), arr(d), { head: 'Chọn mốc kiểm tra' }); })
        .catch(function (err) { ums.api.handle(err, 'mốc kiểm tra'); });
    get('SV_MotCua_Chung/LayDSNguoiDung', { strNguoiThucHien_Id: uid() }).then(function (r) {
        pat.fill(f('cb'), arr(r.data), { name: 'TENDAYDU', head: 'Chọn cán bộ' });
    }).catch(function (err) { ums.api.handle(err, 'cán bộ'); });
    var dmTinhTrang = get('SV_MotCua_XuLy/LayDMucTinhTrangXuLy', { strNguoiThucHien_Id: uid() }).then(function (r) { return arr(r.data); });
    dmTinhTrang.then(function (d) { pat.fill(f('tt'), d, { head: 'Chọn tình trạng' }); }).catch(function (err) { ums.api.handle(err, 'tình trạng xử lý'); });

    /* ---------- Danh sách (phân trang máy chủ) ---------- */
    var trang = 1, co = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, tong = 0, ds = [];
    function tai(p) {
        if (p) trang = p;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        get('SV_MotCua_XuLy/LayDSTheoDoiTinhTrangYeuCau', {
            strTuKhoa: f('q').value, strKhoaQuanLy_Id: '', strHeDaoTao_Id: f('he').value, strKhoaDaoTao_Id: f('khoa').value,
            strChuongTrinh_Id: f('ct').value, strLopQuanLy_Id: f('lop').value, strCanBoXuLy_Id: f('cb').value,
            strTuNgay: f('tu').value, strDenNgay: f('den').value, strTinhTrangKiemTra_Id: f('moc').value,
            strTinhTrangXuLy_Id: f('tt').value, strNguoiTao_Id: uid(), pageIndex: trang, pageSize: co
        }).then(function (r) {
            ds = arr(r.data);
            tong = Number(r.pager) || ds.length;
            ve();
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách yêu cầu'); });
    }
    function sao(n) {
        n = parseInt(n, 10);
        if (!n) return '';
        var h = '';
        for (var i = 1; i <= 5; i++) h += '<span class="ttc-sao__i"><i class="' + (i <= n ? 'fa-solid' : 'fa-light') + ' fa-star"></i></span>';
        return '<span class="ttc-sao" title="' + n + ' trên 5">' + h + '</span>';
    }
    function ve() {
        z('n').textContent = '(' + tong + ')';
        ui.table({
            el: z('bang'), rows: ds, empty: 'Không có yêu cầu nào',
            page: {
                index: trang, size: co, total: tong,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(tong / co)) tai(p); },
                onSize: function (v) { co = v === 'all' ? Math.max(tong, 1) : Number(v); tai(1); }
            },
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc(hoTen(r)); } },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center' },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Thông tin yêu cầu', prop: 'THONGTINYEUCAU' },
                { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' },
                { title: 'Thời gian yêu cầu', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                { title: 'Thời gian xử lý dự kiến', prop: 'NGAYTAO_DUKIEN_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                { title: 'Thời gian xử lý thực tế', prop: 'NGAYTAO_THUCTE_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                { title: 'Tình trạng hiện tại', cls: 'is-center', render: function (r, i) {
                    return ui.btn('view', { text: e(r.TINHTRANGHIENTAI_TEN) || 'Xem', cls: 'ums-btn--sm', attr: { 'data-chat': String(i), title: 'Trao đổi với sinh viên' } });
                } },
                { title: 'File', cls: 'is-center', render: function (r, i) {
                    return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-file': String(i) } });
                } },
                { title: 'Cán bộ xử lý', prop: 'CANBOXULY_TAIKHOAN', cls: 'is-center' },
                { title: 'Lịch sử', cls: 'is-center', render: function (r, i) {
                    return ui.btn('history', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-ls': String(i) } });
                } },
                { title: 'Đánh giá', cls: 'is-center is-nowrap', render: function (r) { return sao(r.DANHGIACHATLUONG_MA); } },
                { title: 'Ý kiến', prop: 'NHANXET' },
                { title: 'Cán bộ trả lời', prop: 'TRALOI', cls: 'is-center' },
                { head: '<input type="checkbox" data-ck-all title="Chọn tất cả">', cls: 'is-center', width: '44px',
                  render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
            ]
        });
    }
    function daChon() {
        return Array.prototype.map.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return ds[Number(c.getAttribute('data-ck'))]; })
            .filter(Boolean);
    }

    /* ---------- Hộp "Xử lý" ---------- */
    function xuLy() {
        var chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var dlg = ui.dialog({
            title: 'Xử lý', icon: 'fa-pen', size: 'md',
            body: '<div class="ums-stack">' +
                ui.field('Yêu cầu', '<div class="ums-u-fz13">' + esc(chon.map(function (r) { return e(r.THONGTINYEUCAU); }).join(', ')) + '</div>') +
                ui.field('Tình trạng', '<select class="ums-select" data-k="tt" data-ph="Chọn tình trạng"><option value="">Chọn tình trạng</option></select>', { required: true }) +
                ui.field('Mô tả', '<input class="ums-input" data-k="mota" autocomplete="off">') + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (h) { return luuXuLy(h, chon); } }]
        });
        ui.enhance(dlg.body);
        var el = dlg.body.querySelector('[data-k="tt"]');
        // Một dòng: tình trạng xử lý TIẾP theo của yêu cầu đó; nhiều dòng: cả danh mục tình trạng
        var p = chon.length === 1
            ? get('SV_MotCua_XuLy/LayDSTinhTrangXuLyTiep', { strMotCua_NguoiHoc_YeuCau_Id: chon[0].ID, strNguoiThucHien_Id: uid() }).then(function (r) { return arr(r.data); })
            : dmTinhTrang;
        p.then(function (d) { pat.fill(el, d, { head: 'Chọn tình trạng' }); }).catch(function (err) { ums.api.handle(err, 'tình trạng xử lý'); });
    }
    function luuXuLy(h, chon) {
        var tt = h.body.querySelector('[data-k="tt"]').value, mota = h.body.querySelector('[data-k="mota"]').value;
        if (!tt) { ui.toast('Vui lòng chọn tình trạng', 'warn'); return false; }
        ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { ok: 'Lưu', title: 'Xử lý yêu cầu' }).then(function (yes) {
            if (!yes) return;
            h.close();
            return ui.batch(chon.map(function (r) {
                return { action: 'SV_MotCua_NguoiHoc_YeuCau_XL/ThemMoi', method: 'POST', strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                    strNguoiXuLy_Id: uid(), strTinhTrangXuLy_Id: tt, strMotCua_NguoiHoc_YeuCau_Id: r.ID,
                    strMotCua_DanhMuc_Id: r.MOTCUA_DANHMUC_ID, strMoTa: mota, strNguoiThucHien_Id: uid() };
            }), { title: 'Đang lưu xử lý', okText: 'Đã lưu', show: true }).then(function () { tai(); });
        });
        return false;
    }

    /* ---------- Hộp "Lịch sử" ---------- */
    function lichSu(r) {
        var dlg = ui.dialog({ title: 'Lịch sử xử lý — ' + hoTen(r), icon: 'fa-clock-rotate-left', size: 'xl',
            body: '<div data-x="ls">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-x="ls"]');
        get('SV_MotCua_XuLy/LayDSLichSuXuLyYeuCau', { strMotCua_NguoiHoc_YeuCau_Id: r.ID }).then(function (x) {
            ui.table({ el: h, rows: arr(x.data), empty: 'Chưa có lịch sử xử lý', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (y) { return esc(e(y.QLSV_NGUOIHOC_HODEM) + ' - ' + e(y.QLSV_NGUOIHOC_TEN)); } },
                { title: 'Yêu cầu', prop: 'MOTCUA_DANHMUC_TEN' },
                { title: 'Tình trạng', prop: 'TINHTRANGXULY_TEN' },
                { title: 'Người xử lý', prop: 'NGUOIXULY_TAIKHOAN' },
                { title: 'Ngày gửi yêu cầu', cls: 'is-center is-nowrap', render: function (y) { return esc(e(y.NGAYTAO_DD_MM_YYY) || e(y.NGAYTAO_DD_MM_YYYY)); } },
                { title: 'Ngày xử lý', prop: 'NGAYXULY_DD_MM_YYYY', cls: 'is-center is-nowrap' }
            ] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử xử lý'); });
    }

    /* ---------- Cột "File": máy chủ dựng tệp hồ sơ tự nhập, trả đường dẫn ---------- */
    function xemFile(r) {
        get('SV_MotCua_Chung/LayDSDanhMucMoRong', { strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strMotCua_DanhMuc_Id: r.MOTCUA_DANHMUC_ID,
            strNguoiThucHien_Id: uid(), strDuongDanFile: e(r.DUONGDANFILE) }).then(function (x) {
            var id = x.raw && x.raw.Id;
            if (id) window.open(ums.files.url(id), '_blank');
            else ui.toast('Không có tệp để xem', 'info');
        }).catch(function (err) { ums.api.handle(err, 'xem tệp'); });
    }

    /* ---------- Trao đổi với sinh viên ---------- */
    function traoDoi(r) {
        var dlg = ui.dialog({ title: hoTen(r), icon: 'fa-comments', size: 'md', body: '<div data-x="bl"></div>' });
        var P = 'SV_MotCua_ThongTin/';
        T.binhLuan(dlg.body.querySelector('[data-x="bl"]'), {
            laSV: function (m) { return String(m.NGUOITAO_ID) !== String(uid()); },
            load: function () {
                return get(P + 'LayDSMotCua_NH_YC_XL_PhanHoi', { strMotCua_NH_YC_XuLy_Id: r.ID, strNguoiThucHien_Id: uid() }).then(function (x) { return arr(x.data); });
            },
            them: function (s) {
                return ums.api.call({ action: P + 'Them_MotCua_NH_YC_XL_PhanHoi', method: 'POST', strMotCua_NH_YC_XuLy_Id: r.ID,
                    strNguoiThucHien_Id: uid(), strNoiDung: s }).catch(function (err) { ums.api.handle(err, 'gửi trao đổi'); });
            },
            xoa: function (id) {
                return ums.api.call({ action: P + 'Xoa_MotCua_NH_YC_XL_PhanHoi', method: 'POST', strId: id, strNguoiThucHien_Id: uid() })
                    .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); }, function (err) { ums.api.handle(err, 'xoá trao đổi'); });
            }
        });
    }

    root.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute('data-ck-all')) {
            Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-chat],[data-file],[data-ls],[data-a]');
        if (!b) return;
        if (b.hasAttribute('data-chat')) traoDoi(ds[Number(b.getAttribute('data-chat'))]);
        else if (b.hasAttribute('data-file')) xemFile(ds[Number(b.getAttribute('data-file'))]);
        else if (b.hasAttribute('data-ls')) lichSu(ds[Number(b.getAttribute('data-ls'))]);
        else if (b.getAttribute('data-a') === 'search') tai(1);
        else if (b.getAttribute('data-a') === 'xuly') xuLy();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
    tai(1);
})();
