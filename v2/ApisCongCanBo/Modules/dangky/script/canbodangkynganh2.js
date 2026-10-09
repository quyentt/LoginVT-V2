/* =========================================================================
   Cán bộ đăng ký ngành 2, 3… cho sinh viên
   Bản gốc: ApisCongCanBo/Modules/dangky/script/canbodangkynganh2.js + html/canbodangkynganh2.html
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       SV_HoSo/LayDanhSach                     GET  strTuKhoa = mã SV, pageSize 100000000 — đúng 1 người mới nhận
       DKH_Nganh2/LayDSChuongTrinhNguoiHoc     GET  strQLSV_NguoiHoc_Id → ô Chương trình (chọn sẵn mục đầu)
       DKH_Nganh2/LayDSKeHoachTheoNguoiHoc     GET  strDaoTao_ChuongTrinh_Id → ô Kế hoạch (chọn sẵn mục đầu)
       DKH_Nganh2/LayDSNganhMoDangKy           GET  → Data.{ rsNganhMo (được mở), rsKetQua (đã đăng ký) }
       DKH_Nganh2/Them_DangKy_Nganh_Tiep_KetQua POST chương trình đánh dấu (chọn một)
       DKH_Nganh2/Xoa_DangKy_Nganh_Tiep_KetQua  POST "Hủy đăng ký" — mỗi dòng đánh dấu
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Tra SV bản gốc gửi strChuongTrinh_Id = ô Chương trình đang chọn (chương
       trình của SV TRA TRƯỚC) → tra người thứ hai dễ không ra. Ở đây gửi rỗng như
       ba ô Hệ / Khóa / Lớp (không có trên màn).
     · Ô "Mã sinh viên" bản gốc không bao giờ đổ → đổ MASO.
     · "Đăng ký" chưa chọn chương trình: bản gốc lỗi JS (aData undefined) → báo.
     · Bản gốc nạp Chương trình, Kế hoạch, danh sách CÙNG LÚC (kế hoạch lấy theo
       chương trình còn trống) → ở đây nạp lần lượt.
     · Bỏ getList_DaDangKy (SV_Nganh2/LayDSQLSV_KeHoach_Ve_DangKy) — không nơi nào gọi.
   Theo luật chung: chưa chọn Chương trình thì khoá Kế hoạch.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var N = 'DKH_Nganh2/';
    var root = document.getElementById('dk-nganh2');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function kv(nhan, z) { return '<div><div class="ums-kv"><span>' + esc(nhan) + '</span><b data-z="' + z + '"></b></div></div>'; }
    var COT = [
        { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
        { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
        { title: 'Lớp dự kiến', prop: 'DAOTAO_LOPQUANLY_TEN' },
        { title: 'Tình trạng đủ điều kiện', prop: 'TINHTRANGDUDIEUKIEN', cls: 'is-center' },
        { title: 'Kết quả duyệt', prop: 'KETQUADUYET', cls: 'is-center' }
    ];

    root.innerHTML =
        pat.page('Đăng ký học ngành 2,3...', '') +
        pat.filterBar([
            { key: 'ct', label: 'Chọn chương trình', type: 'select' },
            { key: 'kh', label: 'Chọn kế hoạch', type: 'select' },
            { key: 'ma', label: 'Nhập từ khóa tìm kiếm' }
        ], { searchText: 'Xem' }) +
        pat.panel({ title: 'Thông tin sinh viên', icon: 'fa-user', body: '<div class="ums-grid ums-grid--2">' +
            kv('Mã sinh viên', 'maSV') + kv('Họ tên', 'hoTen') + kv('Lớp', 'lop') + kv('Ngành/chuyên ngành', 'nganh') +
            kv('Khóa', 'khoa') + kv('Hệ đào tạo', 'he') + kv('Trạng thái', 'tt') + '</div>' }) +
        '<div class="ums-u-mt-4">' + pat.panel({ title: 'Danh sách chương trình được mở đăng ký', icon: 'fa-list-check', flush: true, zone: 'mo',
            tools: ui.btn('save', { text: 'Đăng ký', icon: 'fa-money-check-pen', attr: { 'data-a': 'dangky' } }) }) + '</div>' +
        '<div class="ums-u-mt-4">' + pat.panel({ title: 'Danh sách đã đăng ký', icon: 'fa-clipboard-check', flush: true, zone: 'da',
            // Huỷ NHIỀU dòng đã đánh dấu → ui.xoaChon (mờ + khoá khi chưa chọn, đếm số dòng) — luật chung
            tools: ui.xoaChon('input[data-da]', { goc: '.ums-panel', text: 'Hủy đăng ký', attr: { 'data-a': 'huy' } }) }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function chonDau(el, ds, id) {       // selectFirst
        if (ds.length) { el.value = ds[0][id || 'ID']; if (window.jQuery) jQuery(el).trigger('change.select2'); }
    }
    var svId = '', dl = { rsNganhMo: [], rsKetQua: [] };
    var chuoi = ums.pat.chain([f('ct'), f('kh')], { phatLai: false });

    function ve() {
        ui.table({ el: z('mo'), rows: arr(dl.rsNganhMo), empty: 'Chưa có chương trình được mở', columns: COT.concat([{ title: '', cls: 'is-center', width: '56px',
            render: function (r, i) { return '<input type="radio" name="dkNganh2" data-mo="' + i + '">'; } }]) });
        ui.table({ el: z('da'), rows: arr(dl.rsKetQua), empty: 'Chưa đăng ký', columns: COT.concat([{ head: '<input type="checkbox" data-da="all" title="Chọn tất cả">', cls: 'is-center', width: '56px',
            render: function (r, i) { return '<input type="checkbox" data-da="' + i + '">'; } }]) });
    }
    function taiDS() {
        return ums.api.call({ action: N + 'LayDSNganhMoDangKy', method: 'GET', strQLSV_NguoiHoc_Id: svId, strDaoTao_ChuongTrinh_Id: f('ct').value,
            strQLSV_DangKy_Nganh_Tiep_Id: f('kh').value, strNguoiThucHien_Id: uid() })
            .then(function (r) { dl = r.data || {}; ve(); })
            .catch(function (err) { dl = {}; ve(); ums.api.handle(err, 'danh sách ngành'); });
    }
    function taiKeHoach() {
        return ums.api.call({ action: N + 'LayDSKeHoachTheoNguoiHoc', method: 'GET', strDaoTao_ChuongTrinh_Id: f('ct').value, strQLSV_NguoiHoc_Id: svId, strNguoiThucHien_Id: uid() })
            .then(function (r) { var ds = arr(r.data); pat.fill(f('kh'), ds, { name: 'TENKEHOACH' }); chonDau(f('kh'), ds); chuoi.sync(); })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    }
    function taiChuongTrinh() {
        return ums.api.call({ action: N + 'LayDSChuongTrinhNguoiHoc', method: 'GET', strQLSV_NguoiHoc_Id: svId, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var ds = arr(r.data);
                pat.fill(f('ct'), ds, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN' });
                chonDau(f('ct'), ds, 'DAOTAO_TOCHUCCHUONGTRINH_ID'); chuoi.sync();
            }).catch(function (err) { ums.api.handle(err, 'chương trình'); });
    }
    function traSV() {
        var ma = f('ma').value.trim();
        if (!ma) { ui.toast('Bạn chưa nhập mã sinh viên', 'warn'); return; }
        ums.api.call({ action: 'SV_HoSo/LayDanhSach', method: 'GET', strTuKhoa: ma, strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '',
            strLopQuanLy_Id: '', strQLSV_TrangThaiNguoiHoc_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 }).then(function (r) {
            var ds = arr(r.data), sv = ds.length === 1 ? ds[0] : {};
            svId = ds.length === 1 ? sv.ID : '';
            z('maSV').textContent = e(sv.MASO); z('hoTen').textContent = sv.ID ? e(sv.HODEM) + ' ' + e(sv.TEN) : '';
            z('lop').textContent = e(sv.LOP); z('tt').textContent = e(sv.QLSV_NGUOIHOC_TRANGTHAI); z('nganh').textContent = e(sv.NGANH);
            z('khoa').textContent = e(sv.KHOADAOTAO); z('he').textContent = e(sv.HEDAOTAO);
            if (!ds.length) ui.toast('Không tìm thấy sinh viên', 'warn');
            else if (ds.length > 1) ui.toast('Có ' + ds.length + ' sinh viên khớp — nhập đủ mã', 'warn');
            return taiChuongTrinh().then(taiKeHoach).then(taiDS);
        }).catch(function (err) { ums.api.handle(err, 'tra sinh viên'); });
    }

    if (window.jQuery) {
        jQuery(f('ct')).on('select2:select', function () { taiKeHoach().then(taiDS); });
        jQuery(f('kh')).on('select2:select', taiDS);
    }
    f('ma').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); traSV(); } });
    z('da').addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-da') === 'all') Array.prototype.forEach.call(z('da').querySelectorAll('input[data-da]'), function (c) { c.checked = ev.target.checked; });
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') traSV();
        else if (a === 'dangky') {
            var c = z('mo').querySelector('input[data-mo]:checked');
            if (!c) { ui.toast('Vui lòng chọn chương trình cần đăng ký', 'warn'); return; }
            var r = arr(dl.rsNganhMo)[Number(c.getAttribute('data-mo'))];
            ui.confirm('Bạn có chắc chắn đăng ký không?', { title: 'Đăng ký ngành' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: N + 'Them_DangKy_Nganh_Tiep_KetQua', method: 'POST', strQLSV_DangKy_Nganh_Tiep_Id: f('kh').value,
                    strDaoTao_ChuongTrinh_Id: f('ct').value, strQLSV_NguoiHoc_Id: svId, strQLSV_NguoiHoc_DK_Id: svId,
                    strDaoTao_KhoaDaoTao_DK_Id: r.DAOTAO_KHOADAOTAO_ID, strDaoTao_ChuongTrinh_DK_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID,
                    strDaoTao_LopQuanLy_DK_Id: r.DAOTAO_LOPQUANLY_ID, strNguoiThucHien_Id: uid() }).then(function () { ui.toast('Thêm mới thành công!', 'ok'); taiDS(); });
            }).catch(function (err) { ums.api.handle(err, 'đăng ký'); });
        }
        else if (a === 'huy') {
            var ids = Array.prototype.filter.call(z('da').querySelectorAll('input[data-da]:checked'), function (x) { return x.getAttribute('data-da') !== 'all'; })
                .map(function (x) { return arr(dl.rsKetQua)[Number(x.getAttribute('data-da'))].ID; });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Hủy đăng ký' }).then(function (yes) {
                if (yes) ui.batch(ids.map(function (id) { return { action: N + 'Xoa_DangKy_Nganh_Tiep_KetQua', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; }),
                    { title: 'Đang hủy đăng ký', okText: 'Xóa thành công!' }).then(taiDS);
            });
        }
    });
    ve();
})();
