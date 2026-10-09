/* =========================================================================
   Phân công lớp
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/phanconglop.html
            + script/phanconglop.js (lớp PhanCongLop, vỏ indexi)
   Khối "Thông tin phạm vi" và danh sách theo phân cấp: ums.dkhPC (_phancong.js).
   ---------------------------------------------------------------------------
   Bố cục gốc (một cột, hai vùng thay nhau):
     · Thanh lọc Kế hoạch + Tìm kiếm · khung "Danh sách phân công" (Xóa · Thêm
       mới) — mỗi phân cấp một bảng: ô đánh dấu · tên phạm vi · "Chi tiết".
     · Biểu mẫu "Thêm mới - Phân công" hai cột 4 | 8: Thông tin phạm vi |
       Thông tin bắt buộc (Cơ sở · Học kỳ · Hệ · Khóa · Khóa tổ chức · Ngành tổ
       chức · Học phần · 2 ô đánh dấu · Tìm kiếm) + bảng lớp học phần.
   Lời gọi (chép nguyên):
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM  DANGKY.PHANCAP
       DKH_KeHoachDangKy/LayDanhSach             GET  (TENKEHOACH, DAOTAO_THOIGIANDAOTAO_ID)
       DKH_PhanCong_LopHP/LayDSDangKy_PhamVi_LopHP GET strDangKy_KeHoachDangKy_Id, strPhanCapApDung_Id ''
       DKH_PhanCong_LopHP/ThemMoi                POST mỗi (lớp HP × phạm vi) một lời gọi, strId ''
       DKH_PhanCong_LopHP/Xoa_DangKy_PhanCong_LopHP POST xoá phạm vi (danh sách) / xoá phạm vi của một lớp HP
       DKH_PhanCong_LopHP/LayDanhSach            GET  "Chi tiết" phạm vi → các lớp HP; "Chi tiết" lớp HP → các phạm vi
       DKH_PhanCong_LopHP/Xoa                    POST strIds (xoá lớp HP khỏi phạm vi)
       KHCT_CoSoDaoTao/LayDanhSach               GET  (kèm tham số 'type': 'GET' như gốc)
       pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao  ô Học kỳ
       DKH_PhanCong_LopHP/LayDSKhoaToChuc · LayDSChuongTrinhToChuc · LayDSHocPhan  GET
       DKH_ThongTin/LayDSLopHocPhan              POST phân trang máy chủ
       Hệ / Khóa của "Thông tin bắt buộc": edu.extend.genBoLoc_HeKhoa("_MK") →
       ums.ref.cascadeQuyen (procedure …Quyen — lọc theo quyền như gốc).

   Giữ như gốc:
     · LayDSLopHocPhan khai strDaoTao_KhoaDaoTao_Id HAI lần trong object; khoá
       sau thắng → gửi Khóa (_MK) của bộ lọc quyền, KHÔNG phải Khóa tổ chức.
     · Chọn kế hoạch → đặt ô Học kỳ = DAOTAO_THOIGIANDAOTAO_ID của kế hoạch rồi
       nạp Khóa tổ chức, Học phần, Lớp học phần.
     · Lưu xong chỉ xoá "Phạm vi đã chọn", biểu mẫu vẫn mở (gốc).
   Lỗi bản gốc — đã làm theo ý định:
     · Kiểm tra trước khi lưu gốc viết `lớp == 0 && phạm vi > 0` → không chọn
       phạm vi thì vẫn hỏi "lưu 0 dữ liệu". Nay bắt chọn cả lớp HP lẫn phạm vi.
     · Hộp "Danh sách phạm vi" xoá xong gốc nạp lại KHÔNG truyền id lớp HP
       (hiện phạm vi của mọi lớp) — nay nạp lại đúng lớp HP đang xem.
     · Hai hộp "Chi tiết" gốc gửi phân trang mặc định (10 dòng) mà không vẽ thanh
       phân trang (hộp phạm vi) — nay có thanh phân trang máy chủ.
   Cặp cha → con: Học kỳ → Khóa tổ chức → Ngành tổ chức (khoá); Hệ → Khóa
   (cascadeQuyen). Học phần lọc theo nhiều ô (Học kỳ / Khóa tổ chức / Ngành) —
   lọc tuỳ chọn, không khoá.
   Bỏ: mã chết của gốc (getList_NamNhapHoc, genList_TrangThaiSV, #DSTrangThaiSV,
   .btnEdit của tblPhanCongLop — không có trên màn).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dkh-phanconglop');
    if (!root) return;

    var ui = ums.ui, pat = ums.pat, PC = ums.dkhPC, e = PC.e, arr = PC.arr;
    function esc(s) { return ui.esc(s); }
    function jq(el) { return window.jQuery ? jQuery(el) : null; }
    var L = 'DKH_PhanCong_LopHP/';

    var phanCap = [], dsPC = [], keHoach = [];
    var trangLHP = { index: 1, size: 10 };

    function sel(k, ph) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select></div>';
    }

    root.innerHTML =
        pat.page('Phân công lớp', ui.btn('add', { attr: { 'data-a': 'add' } })) +
        '<div data-z="list">' +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                '<div class="ums-filter">' +
                    '<div class="ums-field dkhpc-kh"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch"><option value="">Chọn kế hoạch</option></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '</div>' }) +
            pat.panel({ title: 'Danh sách phân công', icon: 'fa-clipboard-list-check', zone: 'luoi',
                tools: ui.xoaChon('input[data-pc]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-z="form" hidden>' +
            pat.panel({ title: 'Thêm mới - Phân công', icon: 'fa-plus', tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                body: '<div class="dkhpc-cols dkhpc-cols--4-8">' +
                    '<div data-z="pv"></div>' +
                    '<div>' +
                        '<div class="ums-legend">Thông tin bắt buộc</div>' +
                        '<div class="ums-filter">' +
                            sel('coso', 'Chọn cơ sở đào tạo') + sel('tg', 'Chọn học kỳ') +
                            sel('he', 'Chọn hệ đào tạo') + sel('khoa', 'Chọn khóa đào tạo') +
                            sel('ktc', 'Chọn khóa tổ chức') + sel('nganh', 'Chọn Ngành tổ chức') +
                        '</div>' +
                        '<div class="ums-filter ums-u-mt-3">' +
                            sel('hp', 'Chọn học phần') +
                            '<div class="ums-field ums-field--fit dkhpc-ck"><label class="ums-check"><input type="checkbox" data-f="chuaPC"> Chỉ hiện các lớp chưa phân công</label></div>' +
                            '<div class="ums-field ums-field--fit dkhpc-ck"><label class="ums-check"><input type="checkbox" data-f="locCT"> Lọc theo học phần mở theo chương trình</label></div>' +
                            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'timLHP' } }) + '</div>' +
                        '</div>' +
                        '<div class="ums-u-mt-4" data-z="lhp"></div>' +
                    '</div></div>',
                foot: '<div class="ums-u-flex1"></div>' + ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('save', { text: 'Phân công cho phạm vi', icon: 'fa-users-viewfinder', attr: { 'data-a': 'luu' } }) }) +
        '</div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { var x = f(k); return x ? x.value : ''; }
    function on(k, fn) { if (jq(f(k))) jq(f(k)).on('select2:select select2:clear', fn); }
    var btnAdd = root.querySelector('[data-a="add"]');
    var pv = PC.boPhamVi(z('pv'), { dinhHuong: true, kqlKhoa: true, nhanTren: true });
    ums.ref.cascadeQuyen({ he: f('he'), khoa: f('khoa') });

    function vung(k) {
        var hien = z('list').hidden ? 'form' : 'list';
        if (hien === k) return;
        btnAdd.hidden = k !== 'list';
        ui.swap(z(hien), z(k));
    }

    /* ---------- Danh sách phân công ---------- */
    function taiDS() {
        z('luoi').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: L + 'LayDSDangKy_PhamVi_LopHP', method: 'GET',
            strDangKy_KeHoachDangKy_Id: v('kh'), strPhanCapApDung_Id: '', strNguoiThucHien_Id: '' })
            .then(function (r) {
                dsPC = arr(r.data);
                PC.luoi(z('luoi'), {
                    phanCap: phanCap, rows: dsPC, empty: v('kh') ? 'Kế hoạch chưa có phân công' : 'Chọn kế hoạch để xem phân công',
                    chon: function (row) { return row.PHAMVIAPDUNG_ID; },
                    ten: function (row) { return esc(e(row.PHAMVIAPDUNG_TEN)); },
                    cot3: { title: 'Phân công', render: function (row, pc) {
                        return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', mod: 'out-primary', cls: 'ums-btn--sm',
                            attr: { 'data-ct': e(row.PHAMVIAPDUNG_ID), 'data-pcid': e(pc.ID), title: 'Chi tiết' } });
                    } }
                });
            })
            .catch(function (err) { z('luoi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách phân công'); });
    }

    function xoa() {
        var ids = PC.chon(z('luoi')).filter(function (x, i, a) { return a.indexOf(x) === i; });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa ' + ids.length + ' dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                var t = dsPC.filter(function (x) { return x.PHAMVIAPDUNG_ID === id; })[0] || {};
                return { action: L + 'Xoa_DangKy_PhanCong_LopHP', strDangKy_KeHoachDangKy_Id: e(t.DANGKY_KEHOACHDANGKY_ID),
                    strPhamViApDung_Id: e(t.PHAMVIAPDUNG_ID), strDangKy_LopHocPhan_Id: '', strNguoiThucHien_Id: '' };
            }), { title: 'Đang xoá', okText: 'Xóa thành công!' }).then(taiDS);
        });
    }

    /* Hộp "Danh sách học phần" — các lớp HP đã phân công cho một phạm vi */
    function hopLopHP(pvId, pcId) {
        var trang = { index: 1, size: 10 };
        var dlg = ui.dialog({
            title: 'Danh sách học phần', icon: 'fa-book-open-reader', size: 'lg',
            body: '<div data-z="qs">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            xoa: { chon: 'input[data-qs]', onClick: function () {
                var ids = Array.prototype.map.call(dlg.body.querySelectorAll('tbody input[data-qs]:checked'), function (c) { return c.getAttribute('data-qs'); });
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa ' + ids.length + ' dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(ids.map(function (id) { return { action: L + 'Xoa', strIds: id, strNguoiThucHien_Id: '' }; }),
                        { title: 'Đang xoá', okText: 'Xóa thành công!' }).then(function () { tai(1); taiDS(); });
                });
            } }
        });
        var host = dlg.body.querySelector('[data-z="qs"]');
        host.addEventListener('change', function (ev) {
            if (ev.target.hasAttribute('data-qsall')) Array.prototype.forEach.call(host.querySelectorAll('tbody input[data-qs]'), function (c) { c.checked = ev.target.checked; });
        });
        function tai(p) {
            if (p) trang.index = p;
            ums.api.call({ action: L + 'LayDanhSach', method: 'GET', strTuKhoa: '', strDangKy_KeHoachDangKy_Id: v('kh'),
                strDangKy_LopHocPhan_Id: '', strPhanCapApDung_Id: pcId, strPhamViApDung_Id: pvId, strNguoiThucHien_Id: '',
                pageIndex: trang.index, pageSize: trang.size })
                .then(function (r) {
                    var rows = arr(r.data);
                    ui.table({ el: host, rows: rows, empty: 'Chưa phân công lớp học phần nào',
                        columns: [
                            { title: 'Mã lớp học phần', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' },
                            { title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                            { head: '<input type="checkbox" data-qsall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                              render: function (x) { return '<input type="checkbox" data-qs="' + esc(x.ID) + '">'; } }
                        ],
                        page: { index: trang.index, size: trang.size, total: Number(r.pager) || rows.length,
                            onChange: tai, onSize: function (n) { trang.size = n; tai(1); } } });
                })
                .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách lớp học phần'); });
        }
        tai(1);
    }

    /* Hộp "Danh sách phạm vi" — các phạm vi đã phân công cho một lớp HP */
    function hopPhamVi(lhpId) {
        var trang = { index: 1, size: 10 }, rows = [];
        var dlg = ui.dialog({
            title: 'Danh sách phạm vi', icon: 'fa-users-viewfinder', size: 'lg',
            body: '<div data-z="pvx">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            xoa: { chon: 'input[data-pvx]', onClick: function () {
                var ids = Array.prototype.map.call(dlg.body.querySelectorAll('tbody input[data-pvx]:checked'), function (c) { return c.getAttribute('data-pvx'); });
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa ' + ids.length + ' dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(ids.map(function (id) {
                        var t = rows.filter(function (x) { return x.ID === id; })[0] || {};
                        return { action: L + 'Xoa_DangKy_PhanCong_LopHP', strDangKy_KeHoachDangKy_Id: '',
                            strPhamViApDung_Id: e(t.PHAMVIAPDUNG_ID), strDangKy_LopHocPhan_Id: e(t.DANGKY_LOPHOCPHAN_ID), strNguoiThucHien_Id: '' };
                    }), { title: 'Đang xoá', okText: 'Xóa thành công!' }).then(function () { tai(1); });
                });
            } }
        });
        var host = dlg.body.querySelector('[data-z="pvx"]');
        host.addEventListener('change', function (ev) {
            if (ev.target.hasAttribute('data-pvxall')) Array.prototype.forEach.call(host.querySelectorAll('tbody input[data-pvx]'), function (c) { c.checked = ev.target.checked; });
        });
        function tai(p) {
            if (p) trang.index = p;
            ums.api.call({ action: L + 'LayDanhSach', method: 'GET', strTuKhoa: '', strDangKy_KeHoachDangKy_Id: '',
                strDangKy_LopHocPhan_Id: lhpId, strPhanCapApDung_Id: '', strPhamViApDung_Id: '', strNguoiThucHien_Id: '',
                pageIndex: trang.index, pageSize: trang.size })
                .then(function (r) {
                    rows = arr(r.data);
                    ui.table({ el: host, rows: rows, empty: 'Lớp học phần chưa được phân công cho phạm vi nào',
                        columns: [
                            { title: 'Phạm vi', prop: 'PHAMVIAPDUNG_TEN' },
                            { title: 'Phân cấp', prop: 'PHANCAPAPDUNG_TEN' },
                            { head: '<input type="checkbox" data-pvxall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                              render: function (x) { return '<input type="checkbox" data-pvx="' + esc(x.ID) + '">'; } }
                        ],
                        page: { index: trang.index, size: trang.size, total: Number(r.pager) || rows.length,
                            onChange: tai, onSize: function (n) { trang.size = n; tai(1); } } });
                })
                .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách phạm vi'); });
        }
        tai(1);
    }

    /* ---------- Thông tin bắt buộc + bảng lớp học phần ---------- */
    function napO(k, p, name, head) {
        return p.then(function (r) { pat.fill(f(k), arr(r.data || r), { name: name, head: head }); })
            .catch(function (err) { pat.fill(f(k), [], { head: head }); ums.api.handle(err, 'nạp ' + head.toLowerCase()); });
    }
    function napKTC() {
        if (!v('tg')) { pat.fill(f('ktc'), [], { head: 'Chọn khóa tổ chức' }); return Promise.resolve(); }
        return napO('ktc', ums.api.call({ action: L + 'LayDSKhoaToChuc', method: 'GET', silent: true,
            type: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg') }), 'TENKHOA', 'Chọn khóa tổ chức');
    }
    function napNganh() {
        if (!v('ktc')) { pat.fill(f('nganh'), [], { head: 'Chọn Ngành tổ chức' }); return Promise.resolve(); }
        return napO('nganh', ums.api.call({ action: L + 'LayDSChuongTrinhToChuc', method: 'GET', silent: true,
            type: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('ktc') }), 'TENCHUONGTRINH', 'Chọn Ngành tổ chức');
    }
    function napHP() {
        return napO('hp', ums.api.call({ action: L + 'LayDSHocPhan', method: 'GET', silent: true,
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('ktc'), strDaoTao_ChuongTrinh_Id: v('nganh') }),
            function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, 'Chọn học phần');
    }
    function taiLHP(p) {
        if (p) trangLHP.index = p;
        var host = z('lhp');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'DKH_ThongTin/LayDSLopHocPhan',
            strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strNguoiThucHien_Id: '',
            pageIndex: trangLHP.index, pageSize: trangLHP.size,
            strDangKy_KeHoachDangKy_Id: '',
            dLocGanTheoCTDT: f('locCT').checked ? 1 : 0,
            dChiLayCacLopChuaPhanCong: f('chuaPC').checked ? 1 : 0,
            // Gốc khai khoá này hai lần (Khóa tổ chức rồi Khóa _MK) — khoá sau thắng
            strDaoTao_KhoaDaoTao_Id: v('khoa'),
            strDaoTao_ChuongTrinh_Id: v('nganh'),
            strDaoTao_CoSoDaoTao_Id: v('coso'),
            strDaoTao_HeDaoTao_Id: v('he') })
            .then(function (r) {
                var rows = arr(r.data);
                ui.table({ el: host, rows: rows, empty: 'Không có lớp học phần',
                    columns: [
                        { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
                        { title: 'Tên lớp', prop: 'TENLOP', width: '220px' },
                        { title: 'Chương trình mở lớp HP', render: function (x) { return esc(e(x.DAOTAO_CHUONGTRINH_TEN) + ' (' + e(x.DAOTAO_CHUONGTRINH_MA) + ')'); } },
                        { title: 'Khóa mở lớp HP', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                        { title: 'Đã phân công', cls: 'is-center', width: '120px', render: function (x) {
                            return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', mod: 'out-primary', cls: 'ums-btn--sm',
                                attr: { 'data-lhpct': e(x.ID), title: 'Chi tiết' } });
                        } },
                        { head: '<input type="checkbox" data-lhpall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                          render: function (x) { return '<input type="checkbox" data-lhp="' + esc(x.ID) + '">'; } }
                    ],
                    page: { index: trangLHP.index, size: trangLHP.size, total: Number(r.pager) || rows.length,
                        onChange: taiLHP, onSize: function (n) { trangLHP.size = n; taiLHP(1); } } });
            })
            .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách lớp học phần'); });
    }

    on('tg', function () { pat.fill(f('nganh'), [], { head: 'Chọn Ngành tổ chức' }); napKTC(); napHP(); taiLHP(1); });
    on('ktc', function () { napNganh(); napHP(); taiLHP(1); });
    on('nganh', function () { napHP(); taiLHP(1); });
    on('hp', function () { taiLHP(1); });
    var chainTG = pat.chain([f('tg'), f('ktc'), f('nganh')], { phatLai: false });

    /* Chọn kế hoạch: nạp danh sách + đặt Học kỳ theo kế hoạch (gốc trigger select2:select) */
    on('kh', function () {
        taiDS();
        var k = keHoach.filter(function (x) { return x.ID === v('kh'); })[0];
        var tg = f('tg');
        tg.value = k ? e(k.DAOTAO_THOIGIANDAOTAO_ID) : '';
        f('ktc').value = ''; f('nganh').value = '';
        if (jq(tg)) { jq(tg).trigger('change.select2'); jq(f('ktc')).trigger('change.select2'); jq(f('nganh')).trigger('change.select2'); }
        chainTG.sync();
        pat.fill(f('nganh'), [], { head: 'Chọn Ngành tổ chức' });
        napKTC(); napHP(); taiLHP(1);
    });

    /* ---------- Lưu ---------- */
    function luu() {
        var lhp = Array.prototype.map.call(z('lhp').querySelectorAll('tbody input[data-lhp]:checked'), function (c) { return c.getAttribute('data-lhp'); });
        var ds = pv.ds();
        if (!lhp.length || !ds.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu ' + (lhp.length * ds.length) + ' dữ liệu không?', { title: 'Phân công cho phạm vi', ok: 'Lưu' }).then(function (yes) {
            if (!yes) return;
            var calls = [];
            lhp.forEach(function (lop) {
                ds.forEach(function (x) {
                    calls.push({ action: L + 'ThemMoi', strId: '', strDangKy_KeHoachDangKy_Id: v('kh'),
                        strPhamViApDung_Id: x.id, strDangKy_LopHocPhan_Id: lop, strNguoiThucHien_Id: '' });
                });
            });
            ui.batch(calls, { title: 'Đang phân công', okText: 'Thêm mới thành công!' }).then(function (r) {
                if (r.ok) pv.xoaDs();
                taiDS();
            });
        });
    }

    root.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute('data-lhpall')) Array.prototype.forEach.call(z('lhp').querySelectorAll('tbody input[data-lhp]'), function (c) { c.checked = ev.target.checked; });
    });
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-ct]');
        if (t && root.contains(t)) { hopLopHP(t.getAttribute('data-ct'), t.getAttribute('data-pcid')); return; }
        t = ev.target.closest('[data-lhpct]');
        if (t && root.contains(t)) { hopPhamVi(t.getAttribute('data-lhpct')); return; }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') taiDS();
        else if (a === 'add') {
            if (!v('kh')) { ui.toast('Bạn cần chọn kế hoạch trước!', 'warn'); return; }
            pv.reset();
            vung('form');
        }
        else if (a === 'dong') vung('list');
        else if (a === 'xoa') xoa();
        else if (a === 'timLHP') taiLHP(1);
        else if (a === 'luu') luu();
    });

    /* ---------- Khởi tạo ---------- */
    PC.keHoach('DKH_KeHoachDangKy/LayDanhSach').then(function (rows) {
        keHoach = rows;
        pat.fill(f('kh'), rows, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' });
    }).catch(function (err) { ums.api.handle(err, 'nạp kế hoạch'); });
    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) { pat.fill(f('tg'), r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' }); })
        .catch(function (err) { ums.api.handle(err, 'nạp học kỳ'); });
    napO('coso', ums.api.call({ action: 'KHCT_CoSoDaoTao/LayDanhSach', method: 'GET', silent: true,
        type: 'GET', pageIndex: 1, pageSize: 10000 }), 'TEN', 'Chọn cơ sở đào tạo');
    z('lhp').innerHTML = ui.empty('Chọn học kỳ / học phần rồi bấm Tìm kiếm để xem lớp học phần', 'fa-magnifying-glass');
    PC.phanCap().then(function (rows) { phanCap = rows; taiDS(); })
        .catch(function (err) { ums.api.handle(err, 'nạp danh mục phân cấp'); });
})();
