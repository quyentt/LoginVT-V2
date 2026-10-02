/* =========================================================================
   Thống kê điểm chuyên cần
   Bản gốc: ApisCongCanBo/Modules/thongke/html/chuyencan.html + script/chuyencan.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): thanh trên (Từ ngày · Đến ngày · Loại thống kê ·
   "Chỉ xem tổng hợp / Xem chi tiết ngày") → BẢY nhóm lọc xếp dọc, mỗi nhóm một
   nút xem riêng → bảng "Danh sách". Loại thống kê KHÔNG đổi nhóm nào hiện —
   chỉ gửi kèm (như gốc).
   Lời gọi (kiểu cũ, GET):
       Nạp ô: ums.ref.heDaoTao / khoaDaoTao / chuongTrinh / lopQuanLy / khoaQuanLy (bản KHÔNG lọc quyền, như gốc),
              CC_ThongTin/LayDSThoiGian · LayDSHocPhan · LayDSLopHocPhan
       Bảy nút: CC_ThongKe/LayDanhSachHoSoNhieuNganh · LayDanhSachLopHocPhan · LayDanhSachHocPhan ·
                LayDanhSachLopQuanLy · LayDanhSachLopChuongTrinh · LayDanhSachKhoaQuanLy · LayDanhSachKhoaDaoTao
                (chung: dPhanLoaiKieuXem 1|0, strLoaiThongKe_Id, strTuNgay, strDenNgay) → Data { rs, rsNgayDiemDanh }
       Ô: CC_ThongKe/LayKQTongHopChuyenCanTheoNgay (dòng × kiểu) · LayKQCaNhanChuyenCanTheoNgay (dòng × kiểu × ngày)
       Kiểu chuyên cần: danh mục QLSV.KIEUCHUYENCAN · Loại thống kê: QLSV.CHUYENCAN.LOAITHONGKE
   Không chép (lỗi rõ của bản gốc):
     · Ô Hệ / Khoá các nhóm dùng CHUNG một biến "đuôi" → chọn Khoá ở nhóm này nạp
       nhầm ô của nhóm khác. Ở đây mỗi nhóm nạp đúng ô của nó.
     · Đổi ô cha không xoá ô con; chọn Thời gian nạp Lớp học phần với Học phần cũ.
     · Kiểu chuyên cần chưa nạp xong mà bấm xem thì bảng không có cột.
     · Ô đánh dấu trong bảng trông như sửa được nhưng màn không lưu → khoá (chỉ xem).
     · Nạp ô theo trang: tối đa 6 lời gọi cùng lúc (gốc: hàng đợi 10 của makeRequest).
   Giữ như bản gốc (chờ nghiệp vụ):
     · Nhóm Khoa quản lý gửi ID khoa quản lý dưới tên strKhoaDaoTao_Id.
     · Mọi nhóm (Lớp, Ngành, Khoa…) gửi ID DÒNG làm strQLSV_NguoiHoc_Id khi lấy ô.
     · Không có nút báo cáo (vùng báo cáo gốc không có trong html).
     · Ô lọc là lọc tuỳ chọn ("Tất cả …") → KHÔNG khoá cha → con.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, ref = ums.ref;
    var root = document.getElementById('tk-chuyencan');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    function ms(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" multiple data-ph="' + esc(ph) + '"></select></div>'; }
    function nhom(tieuDe, o, nut) {
        return '<div class="cc-nhom"><div class="cc-nhom__ten">' + esc(tieuDe) + '</div><div class="ums-filter">' + o +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: nut[0], mod: nut[2] || 'primary', attr: { 'data-xem': nut[1] } }) + '</div></div></div>';
    }

    root.innerHTML =
        pat.page('Thống kê điểm chuyên cần', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                '<div class="ums-field"><input class="ums-input" data-f="tu" data-date placeholder="Từ ngày" autocomplete="off"></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="den" data-date placeholder="Đến ngày" autocomplete="off"></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="loai" data-ph="Chọn loại thống kê"><option value=""></option></select></div>' +
                '<div class="ums-field ums-field--fit cc-kieuxem"><label class="ums-check"><input type="radio" name="ccKieuXem" value="1" checked><span>Chỉ xem tổng hợp</span></label>' +
                    '<label class="ums-check"><input type="radio" name="ccKieuXem" value="0"><span>Xem chi tiết ngày</span></label></div>' +
            '</div>' +
            nhom('Thông tin người học', '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập tên người học" autocomplete="off"></div>' +
                ms('he_NH', 'Tất cả hệ đào tạo') + ms('khoa_NH', 'Tất cả khóa đào tạo') + ms('lop_NH', 'Tất cả lớp'), ['Xem theo người học', 'NH']) +
            nhom('Thông tin lớp học phần', ms('tg_HP', 'Tất cả học kỳ') + ms('hp_HP', 'Tất cả học phần') + ms('lhp_HP', 'Tất cả lớp học phần'), ['Xem theo lớp học phần', 'HP']) +
            nhom('Thông tin học phần', ms('tg_HP2', 'Tất cả học kỳ') + ms('hp_HP2', 'Tất cả học phần'), ['Xem theo học phần', 'HP2']) +
            nhom('Thông tin lớp', ms('he_Lop', 'Tất cả hệ đào tạo') + ms('khoa_Lop', 'Tất cả khóa đào tạo') + ms('ct_Lop', 'Tất cả chương trình đào tạo'), ['Xem theo lớp', 'Lop', 'save']) +
            nhom('Thông ngành học', ms('he_Nganh', 'Tất cả hệ đào tạo') + ms('khoa_Nganh', 'Tất cả khóa đào tạo'), ['Xem ngành học', 'Nganh', 'out-warn']) +
            nhom('Thông tin khoa quản lý', ms('he_KQL', 'Tất cả hệ đào tạo') + ms('kql_KQL', 'Tất cả khoa quản lý'), ['Xem theo khoa quản ký', 'KQL', 'out-info']) +
            nhom('Thông tin khóa học', ms('he_Khoa', 'Tất cả hệ đào tạo'), ['Xem theo khóa học', 'Khoa', 'out-primary'])
        }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-clipboard-user', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? pat.val(f(k)) : ''; }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm một nút "Xem theo …"', 'fa-hand-pointer');
    function doDay(k, d, ten) { if (window.jQuery) jQuery(f(k)).val(null); pat.fill(f(k), d, { name: ten }); }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }

    /* ---------- Nạp các ô ------------------------------------------------ */
    var kieu = null, dsKieu = [];
    kieu = ums.api.dm('QLSV.KIEUCHUYENCAN').then(function (d) { dsKieu = d || []; }).catch(function () { dsKieu = []; });
    ums.api.dm('QLSV.CHUYENCAN.LOAITHONGKE').then(function (d) {
        pat.fill(f('loai'), d, { name: 'TEN', head: 'Chọn loại thống kê' });
        if (d && d.length) { f('loai').value = d[0].ID; if (window.jQuery) jQuery(f('loai')).trigger('change.select2'); }   // gốc: không có dòng trống → mục đầu
    }).catch(function () {});
    ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }).then(function (d) { ['he_NH', 'he_Lop', 'he_Nganh', 'he_KQL', 'he_Khoa'].forEach(function (k) { pat.fill(f(k), d, { name: 'TENHEDAOTAO' }); }); })
        .catch(loi('hệ đào tạo'));
    ref.khoaQuanLy().then(function (d) { pat.fill(f('kql_KQL'), d, { name: 'TEN' }); }).catch(loi('khoa quản lý'));
    get('CC_ThongTin/LayDSThoiGian', {}).then(function (r) { var d = arr(r.data); pat.fill(f('tg_HP'), d, { name: 'THOIGIAN' }); pat.fill(f('tg_HP2'), d, { name: 'THOIGIAN' }); })
        .catch(loi('thời gian'));

    function napKhoa(g) { return ref.khoaDaoTao({ strHeDaoTao_Id: v('he_' + g), pageIndex: 1, pageSize: 1000000 }).then(function (d) { doDay('khoa_' + g, d, 'TENKHOA'); }).catch(loi('khóa đào tạo')); }
    function napLopQL() {
        return ref.lopQuanLy({ strDaoTao_HeDaoTao_Id: v('he_NH'), strKhoaDaoTao_Id: v('khoa_NH'), strToChucCT_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (d) { doDay('lop_NH', d, 'TEN'); }).catch(loi('lớp'));
    }
    function napCT() { return ref.chuongTrinh({ strKhoaDaoTao_Id: v('khoa_Lop'), pageIndex: 1, pageSize: 1000000 }).then(function (d) { doDay('ct_Lop', d, 'TENCHUONGTRINH'); }).catch(loi('chương trình')); }
    function napHP(g) {
        return get('CC_ThongTin/LayDSHocPhan', { strDaoTao_ThoiGianDaoTao_Id: v('tg_' + g) }).then(function (r) { doDay('hp_' + g, arr(r.data), 'TEN'); }).catch(loi('học phần'));
    }
    function napLHP() {
        return get('CC_ThongTin/LayDSLopHocPhan', { strDaoTao_HocPhan_Id: v('hp_HP'), strDaoTao_ThoiGianDaoTao_Id: v('tg_HP') }).then(function (r) { doDay('lhp_HP', arr(r.data), 'TEN'); }).catch(loi('lớp học phần'));
    }
    var DOI = {
        he_NH: function () { return napKhoa('NH').then(napLopQL); }, khoa_NH: napLopQL,
        he_Lop: function () { return napKhoa('Lop').then(napCT); }, khoa_Lop: napCT,
        he_Nganh: function () { return napKhoa('Nganh'); },
        tg_HP: function () { return napHP('HP').then(napLHP); }, hp_HP: napLHP,
        tg_HP2: function () { return napHP('HP2'); }
    };
    if (window.jQuery) Object.keys(DOI).forEach(function (k) { jQuery(f(k)).on('select2:select select2:unselect select2:clear', DOI[k]); });

    /* ---------- Bảy nút xem --------------------------------------------------- */
    var NUT = {
        NH: ['CC_ThongKe/LayDanhSachHoSoNhieuNganh', function () { return { strTuKhoa: f('q').value.trim(), strNamNhapHoc: '', strKhoaQuanLy_Id: '', strHeDaoTao_Id: v('he_NH'),
            strKhoaDaoTao_Id: v('khoa_NH'), strChuongTrinh_Id: '', strLopQuanLy_Id: v('lop_NH'), strTrangThaiNguoiHoc_Id: '' }; }],
        HP: ['CC_ThongKe/LayDanhSachLopHocPhan', function () { return { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg_HP'), strDaoTao_HocPhan_Id: v('hp_HP'), strDaoTao_LopHocPhan_Id: v('lhp_HP') }; }],
        HP2: ['CC_ThongKe/LayDanhSachHocPhan', function () { return { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg_HP2'), strDaoTao_HocPhan_Id: v('hp_HP2') }; }],
        Lop: ['CC_ThongKe/LayDanhSachLopQuanLy', function () { return { strTuKhoa: '', strHeDaoTao_Id: v('he_Lop'), strKhoaDaoTao_Id: v('khoa_Lop'), strChuongTrinh_Id: v('ct_Lop') }; }],
        Nganh: ['CC_ThongKe/LayDanhSachLopChuongTrinh', function () { return { strTuKhoa: '', strHeDaoTao_Id: v('he_Nganh'), strKhoaDaoTao_Id: v('khoa_Nganh') }; }],
        KQL: ['CC_ThongKe/LayDanhSachKhoaQuanLy', function () { return { strTuKhoa: '', strHeDaoTao_Id: v('he_KQL'), strKhoaDaoTao_Id: v('kql_KQL') }; }],
        Khoa: ['CC_ThongKe/LayDanhSachKhoaDaoTao', function () { return { strTuKhoa: '', strHeDaoTao_Id: v('he_Khoa') }; }]
    };
    var soHieu = 0;
    function xem(g) {
        var sh = ++soHieu, n = NUT[g], kx = root.querySelector('input[name="ccKieuXem"]:checked');
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        Promise.all([kieu, get(n[0], Object.assign({ dPhanLoaiKieuXem: kx ? kx.value : '1', strLoaiThongKe_Id: f('loai').value, strTuNgay: f('tu').value.trim(),
            strDenNgay: f('den').value.trim() }, n[1]()))]).then(function (x) {
            if (sh !== soHieu) return;
            var d = x[1].data || {};
            ve(arr(d), Array.isArray(d.rsNgayDiemDanh) ? d.rsNgayDiemDanh : [], sh);
        }).catch(function (err) { if (sh === soHieu) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thống kê chuyên cần'); } });
    }
    function hai(n) { return e(n); }
    function ve(ds, ngay, sh) {
        z('n').textContent = '(' + ds.length + ')';
        var G = ['Đối tượng quản lý'], T = ['Tổng hợp'];
        var cot = [{ title: 'Mã số', prop: 'MA', group: G, cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'TEN', group: G }]
            .concat(dsKieu.map(function (k) { return { title: e(k.TEN), group: T, cls: 'is-center', render: function (r) { return '<span data-th="' + esc(r.ID + '|' + k.ID) + '"></span>'; } }; }));
        ngay.forEach(function (n) {
            var g = [e(n.NGAYGHINHAN) + ' ' + hai(n.GIO) + 'h' + hai(n.PHUT) + '→' + hai(n.GIOKETTHUC) + 'h' + hai(n.PHUTKETTHUC)];
            dsKieu.forEach(function (k) {
                cot.push({ title: e(k.TEN), group: g, cls: 'is-center', render: function (r) {
                    var id = esc(r.ID + '|' + k.ID + '|' + n.ID);
                    return '<span class="cc-o"><input type="checkbox" disabled data-ck="' + id + '"><span data-sl="' + id + '"></span></span>'; } });
            });
        });
        ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu', columns: cot });
        var viec = [];
        ds.forEach(function (r) {
            dsKieu.forEach(function (k) {
                viec.push(function () {
                    return get('CC_ThongKe/LayKQTongHopChuyenCanTheoNgay', { silent: true, strTuNgay: f('tu').value.trim(), strDenNgay: f('den').value.trim(), strKieuChuyenCan_Id: k.ID, strQLSV_NguoiHoc_Id: r.ID })
                        .then(function (x) { var t = arr(x.data), el = z('bang').querySelector('[data-th="' + r.ID + '|' + k.ID + '"]'); if (el && t.length) el.textContent = e(t[t.length - 1].SOLUONG); });
                });
                ngay.forEach(function (n) {
                    viec.push(function () {
                        return get('CC_ThongKe/LayKQCaNhanChuyenCanTheoNgay', { silent: true, strNgay_Gio_Phut_Giay_Id: n.ID, strKieuChuyenCan_Id: k.ID, strQLSV_NguoiHoc_Id: r.ID })
                            .then(function (x) {
                                var id = r.ID + '|' + k.ID + '|' + n.ID;
                                arr(x.data).forEach(function (t) {
                                    if (Number(t.GIATRI) !== 1) return;
                                    var c = z('bang').querySelector('[data-ck="' + id + '"]'), s = z('bang').querySelector('[data-sl="' + id + '"]');
                                    if (c) c.checked = true;
                                    if (s && Number(t.SOLUONG)) s.textContent = e(t.SOLUONG);
                                });
                            });
                    });
                });
            });
        });
        /* Hàng đợi 6 luồng; lượt xem mới thì bỏ việc của lượt cũ */
        var i = 0;
        function chay() { if (sh !== soHieu || i >= viec.length) return Promise.resolve(); var fn = viec[i++]; return fn().catch(function () {}).then(chay); }
        for (var k = 0; k < 6; k++) chay();
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-xem]');
        if (b) xem(b.getAttribute('data-xem'));
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); xem('NH'); } });
})();
