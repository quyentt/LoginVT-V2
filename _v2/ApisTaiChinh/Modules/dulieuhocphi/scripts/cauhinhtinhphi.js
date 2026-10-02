/* =========================================================================
   Cấu hình tính phí (tính phí tự động theo lớp)
   Bản gốc: ApisTaiChinh/Modules/dulieuhocphi/scripts/cauhinhtinhphi.js
   ---------------------------------------------------------------------------
   Danh sách cấu hình (ums.crud):
       TC_CauHinhTinhTuDong/LayDanhSach    GET, phân trang máy chủ. Tham số
                                           'strDaTao_KhoaDaoTao_Id' viết SAI chính
                                           tả trong bản gốc — giữ nguyên, máy chủ
                                           đọc đúng tên đó.
       TC_CauHinhTinhTuDong/Xoa            POST, strIds = MỘT id mỗi lời gọi
   Thêm cấu hình (vùng "Danh sách lớp quản lý"):
       KHCT_LopQuanLy/LayDanhSach          GET, phân trang máy chủ
       KHCT_KhoaDaoTao/LayDanhSach         GET, khoá theo hệ (ô lọc của vùng này)
       KHCT_ToChucChuongTrinh/LayDanhSach  GET, chương trình theo hệ + khoá
       pkg_nhansu_hoso_v2.LayDanhSachToanBo  bộ môn (edu.system.getList_CoCauToChuc)
       danh mục KHCT.LOAILOP, KHCT.NHOMLOP
       TC_CauHinhTinhTuDong/ThemMoi        POST, một lời gọi mỗi lớp đã chọn, lấy
                                           thời gian / khoản thu / nghiệp vụ / kiểu học
                                           từ thanh lọc của danh sách chính
   Nguồn thanh lọc chính:
       pkg_kehoach_thongtin.* (ums.ref)    hệ → khoá → lớp quản lý
       CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao, TC_KhoanThu/LayDanhSach
       danh mục QLTC.NVAP, KHDT.DIEM.KIEUHOC

   Khác bản gốc, có chủ đích:
     · Nút "Thêm": bản gốc báo "Bạn cần chọn học kỳ, kiểu học, khoản thu,
       nghiệp vụ" nhưng THIẾU return nên vẫn mở vùng thêm và cho lưu cấu hình
       với các giá trị rỗng. Ở đây chặn lại.
     · Vùng thêm có nút Tìm kiếm và ô từ khoá riêng. Bản gốc trùng id
       #btnSearch nên nút ở vùng thêm không làm gì, còn Enter ở ô từ khoá lại
       nạp danh sách CHÍNH. Ở đây cả hai nạp danh sách lớp.
     · Đổi ô lọc (chọn) của danh sách chính thì nạp lại ngay (ums.crud); bản
       gốc chờ bấm Tìm kiếm.
   Bỏ: txtAAAA/dropAAAA (gửi chuỗi rỗng như bản gốc), dropKhoaQuanLy /
   dropLoaiLop / dropKhoaDaoTao (không tồn tại), fakedb.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, H = ums.hocphi, esc = ui.esc;
    var elMain = document.getElementById('cauhinhtinhphi');
    var elEdit = document.getElementById('cauhinhtinhphiLop');

    var THOIGIAN = {
        call: {
            action: 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao', method: 'GET', versionAPI: 'v1.0',
            strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
        },
        name: 'DAOTAO_THOIGIANDAOTAO'
    };
    var KHOANTHU = {
        call: {
            action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 10000,
            strNhomCacKhoanThu_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
        },
        name: 'TEN'
    };

    /* ---------- Danh sách cấu hình ----------------------------------------- */
    var main = ums.crud({
        root: elMain,
        title: 'Cấu hình tính phí',
        icon: 'fa-sliders',
        listTitle: 'Danh sách cấu hình',
        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'lop', type: 'select', label: 'Chọn lớp quản lý' },
            { key: 'thoiGian', type: 'select', label: 'Chọn học kỳ', source: THOIGIAN },
            { key: 'khoanThu', type: 'select', label: 'Chọn khoản thu', source: KHOANTHU },
            { key: 'nghiepVu', type: 'select', label: 'Chọn nghiệp vụ áp dụng', source: { dm: 'QLTC.NVAP' } },
            { key: 'kieuHoc', type: 'select', label: 'Chọn kiểu học', source: { dm: 'KHDT.DIEM.KIEUHOC' } }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'TC_CauHinhTinhTuDong/LayDanhSach',
                    method: 'GET',
                    strTuKhoa: '',
                    strDaoTao_HeDaoTao_Id: f.he,
                    strDaTao_KhoaDaoTao_Id: f.khoa,
                    strDaoTao_ChuongTrinh_Id: '',
                    strDaoTao_LopQuanLy_Id: f.lop,
                    strNghiepVuApDung_Id: f.nghiepVu,
                    strKieuHoc_Id: f.kieuHoc,
                    strDaoTao_ThoiGianDaoTao_Id: f.thoiGian,
                    strTaiChinh_CacKhoanThu_Id: f.khoanThu,
                    strNguoiThucHien_Id: ''
                };
            }
        },
        columns: [
            { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO' },
            { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-center' },
            { title: 'Nghiệp vụ áp dụng', prop: 'NGHIEPVUAPDUNG_TEN' },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' }
        ],
        toolbar: [{ text: 'Thêm cấu hình', icon: 'fa-plus', mod: 'add', onClick: function () { openThem(); } }],
        rowDelete: false,
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'TC_CauHinhTinhTuDong/Xoa', strIds: id, strNguoiThucHien_Id: '' };
            });
        }
    });

    /* Hệ → khoá → lớp của thanh lọc chính (select2:select như bản gốc) */
    function fk(key) { return elMain.querySelector('[data-scope="filter"][data-k="' + key + '"]'); }
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }
    function loadKhoa(he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
            .then(function (r) { H.fill(fk('khoa'), r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }).catch(fail('khóa đào tạo'));
    }
    function loadLop(khoa) {
        return H.lopQuanLy(khoa, '').then(function (r) { H.fill(fk('lop'), r, { name: 'TEN', head: 'Chọn lớp quản lý' }); }).catch(fail('lớp quản lý'));
    }
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) {
            H.fill(fk('he'), r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' });
            H.fill(q('#chtpHe'), r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' });
        }).catch(fail('hệ đào tạo'));
    loadKhoa('');
    jQuery(fk('he')).on('select2:select', function () { loadKhoa(fk('he').value); loadLop(''); });
    jQuery(fk('khoa')).on('select2:select', function () { loadLop(fk('khoa').value); });
    ums.pat.chain([fk('he'), fk('khoa'), fk('lop')]);     // xoá tầng trên thì xoá tầng dưới

    /* ---------- Vùng thêm cấu hình: danh sách lớp quản lý ------------------ */
    elEdit.innerHTML =
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" id="chtpHe"><option value="">Chọn hệ đào tạo</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" id="chtpKhoa"><option value="">Chọn khóa đào tạo</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" id="chtpCT"><option value="">Chọn chương trình đào tạo</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" id="chtpBoMon"><option value="">Chọn bộ môn</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" id="chtpLoaiLop"><option value="">Chọn loại lớp</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" id="chtpNhomLop"><option value="">Chọn nhóm lớp</option></select></div>' +
            '<div class="ums-field"><input class="ums-input" id="chtpTuKhoa" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
        '</div></div></div>' +
        '<div class="ums-panel">' +
            '<div class="ums-panel__head">' +
                '<div class="ums-panel__title"><i class="fa-light fa-users-rectangle"></i> Danh sách lớp quản lý <span class="ums-u-faint ums-u-fz13" data-z="n"></span></div>' +
                '<div class="ums-panel__tools">' +
                    ui.btn('close', { attr: { 'data-a': 'back' } }) +
                    '<button type="button" class="ums-btn ums-btn--primary" data-a="them" disabled><i class="fa-light fa-wrench"></i><span>Thêm cấu hình</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="ums-u-fz13 ums-u-muted" style="padding:10px 20px 0" data-z="dk"></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="tbl"></div>' +
        '</div>';

    function q(sel) { return elEdit.querySelector(sel); }
    function ev(id) { return H.val(q('#' + id)); }
    H.s2(elEdit);       // ums.ui.enhance — select2 cho mọi ô của vùng thêm

    function loadKhoa2() {
        return H.rows({
            action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDaoTao_HeDaoTao_Id: ev('chtpHe'), strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 1000000
        }).then(function (r) { H.fill(q('#chtpKhoa'), r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }).catch(fail('khóa đào tạo'));
    }
    function loadCT() {
        return H.rows({
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: ev('chtpKhoa'), strDaoTao_HeDaoTao_Id: ev('chtpHe'),
            strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '', strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 1000000
        }).then(function (r) { H.fill(q('#chtpCT'), r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình' }); }).catch(fail('chương trình'));
    }
    loadKhoa2();
    loadCT();
    H.rows({
        action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P',
        func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1,
        strLoaiCoCauToChuc_Id: '',
        strCoCauToChucCha_Id: ''
    }).then(function (r) { H.fill(q('#chtpBoMon'), r, { name: 'TEN', head: 'Chọn cơ cấu tổ chức' }); }).catch(fail('cơ cấu tổ chức'));
    ums.api.dm('KHCT.LOAILOP').then(function (r) { H.fill(q('#chtpLoaiLop'), r, { head: 'Chọn loại lớp' }); }).catch(fail('loại lớp'));
    ums.api.dm('KHCT.NHOMLOP').then(function (r) { H.fill(q('#chtpNhomLop'), r, { head: 'Chọn nhóm lớp' }); }).catch(fail('nhóm lớp'));
    jQuery(q('#chtpHe')).on('select2:select', function () { loadKhoa2(); loadLop2(1); });
    jQuery(q('#chtpKhoa')).on('select2:select', function () { loadCT(); loadLop2(1); });
    ums.pat.chain([q('#chtpHe'), q('#chtpKhoa'), q('#chtpCT')]);

    var lopPage = 1, lopSize = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, lopTotal = 0, lopRows = [], picked = {};
    function loadLop2(p) {
        if (p) lopPage = p;
        var host = q('[data-z="tbl"]');
        if (!lopRows.length) host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'KHCT_LopQuanLy/LayDanhSach',
            method: 'GET',
            strTuKhoa: ev('chtpTuKhoa'),
            strDaoTao_CoSoDaoTao_Id: '',
            strDaoTao_KhoaDaoTao_Id: ev('chtpKhoa'),
            strDaoTao_Nganh_Id: ev('chtpBoMon'),
            strDaoTao_LoaiLop_Id: ev('chtpLoaiLop'),
            strDaoTao_ToChucCT_Id: ev('chtpCT'),
            strNhomlop_Id: ev('chtpNhomLop'),
            strNguoiThucHien_Id: '',
            pageIndex: lopPage,
            pageSize: lopSize
        }).then(function (r) {
            lopRows = Array.isArray(r.data) ? r.data : [];
            lopTotal = Number(r.pager) || lopRows.length;
            drawLop();
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lớp quản lý'); });
    }
    function drawLop() {
        q('[data-z="n"]').textContent = '(' + lopTotal + ')';
        ui.table({
            el: q('[data-z="tbl"]'), rows: lopRows, empty: 'Không có lớp phù hợp',
            page: {
                index: lopPage, size: lopSize, total: lopTotal,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(lopTotal / lopSize)) loadLop2(p); },
                onSize: function (v) { lopSize = v; loadLop2(1); }
            },
            columns: [
                { title: 'Mã lớp', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên lớp', prop: 'TEN' },
                { title: 'Số lượng', cls: 'is-center', render: function (r) { return esc(H.e(r.SOLUONGTHUCTE) + '/' + H.e(r.SOLUONGKEHOACH)); } },
                { title: 'Loại lớp', prop: 'LOAILOP_TEN', cls: 'is-center' },
                { title: 'Nhóm lớp', prop: 'NHOMLOP_TEN' },
                { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
                { head: '<input type="checkbox" data-lp="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                  render: function (r, i) { return '<input type="checkbox" data-lp="' + i + '"' + (picked[r.ID] ? ' checked' : '') + '>'; } }
            ]
        });
        sync();
    }
    function sync() {
        var n = Object.keys(picked).length;
        var b = q('[data-a="them"]');
        b.disabled = !n;
        b.querySelector('span').textContent = n ? 'Thêm cấu hình cho ' + n + ' lớp' : 'Thêm cấu hình';
        Array.prototype.forEach.call(q('[data-z="tbl"]').querySelectorAll('input[data-lp]'), function (x) {
            var tr = x.closest('tr'); if (tr && x.getAttribute('data-lp') !== 'all') tr.classList.toggle('is-selected', x.checked);
        });
    }
    q('[data-z="tbl"]').addEventListener('change', function (e) {
        var t = e.target;
        if (!t.matches || !t.matches('input[data-lp]')) return;
        var k = t.getAttribute('data-lp');
        if (k === 'all') {
            lopRows.forEach(function (r, i) {
                if (t.checked) picked[r.ID] = r; else delete picked[r.ID];
                var x = q('[data-z="tbl"] input[data-lp="' + i + '"]'); if (x) x.checked = t.checked;
            });
        } else {
            var r = lopRows[Number(k)];
            if (t.checked) picked[r.ID] = r; else delete picked[r.ID];
        }
        sync();
    });

    /* ---------- Mở vùng thêm / lưu ----------------------------------------- */
    function textOf(key) { var el = fk(key); return el && el.value ? el.options[el.selectedIndex].text : ''; }

    function openThem() {
        var f = main.filterValues();
        if (!f.thoiGian || !f.khoanThu || !f.nghiepVu || !f.kieuHoc) {
            ui.toast('Bạn cần chọn học kỳ, kiểu học, khoản thu, nghiệp vụ', 'warn');
            return;
        }
        q('[data-z="dk"]').innerHTML = 'Áp dụng: <b>' + esc(textOf('thoiGian')) + '</b> · <b>' + esc(textOf('khoanThu')) +
            '</b> · <b>' + esc(textOf('nghiepVu')) + '</b> · <b>' + esc(textOf('kieuHoc')) + '</b>';
        picked = {};
        ui.swap(elMain, elEdit);
        loadLop2(1);
    }

    function themCauHinh() {
        var ids = Object.keys(picked);
        if (!ids.length) return ui.toast('Vui lòng chọn đối tượng?', 'warn');
        ui.confirm('Bạn có chắc chắn thêm dữ liệu không?', { title: 'Thêm cấu hình tính phí', ok: 'Thêm' }).then(function (yes) {
            if (!yes) return;
            var f = main.filterValues();
            H.runAll(ids.map(function (lopId) {
                return {
                    action: 'TC_CauHinhTinhTuDong/ThemMoi',
                    strId: '',
                    strNghiepVuApDung_Id: f.nghiepVu,
                    strDaoTao_ThoiGianDaoTao_Id: f.thoiGian,
                    strKieuHoc_Id: f.kieuHoc,
                    strTaiChinh_CacKhoanThu_Id: f.khoanThu,
                    strDaoTao_LopQuanLy_Id: lopId,
                    strNguoiThucHien_Id: ''
                };
            }), 'Đang thêm cấu hình tính phí', function () {
                picked = {};
                drawLop();
                main.load();
            });
        });
    }

    elEdit.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]');
        if (!b || !elEdit.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') loadLop2(1);
        else if (a === 'them') themCauHinh();
        else if (a === 'back') { ui.swap(elEdit, elMain); }
    });
    q('#chtpTuKhoa').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); loadLop2(1); } });
})();
