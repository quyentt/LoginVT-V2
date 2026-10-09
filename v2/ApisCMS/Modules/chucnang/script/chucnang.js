/* =========================================================================
   Quản lý chức năng (ApisCMS)
   Bản gốc: ApisCMS/Modules/chucnang/html/chucnang.html + script/chucnang.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, col-sm-3 | col-sm-9):
     trái  — ô chọn ứng dụng, cây "Danh sách chức năng" (số lượng) + ô tìm tên;
     phải  — ba vùng thay chỗ nhau (toggle_overide "zone-bus-cn"):
             · Thông tin chi tiết (Tải file · Xóa · Sửa · Thêm) + "Người dùng thuộc
               chức năng" + "Quyền cho chức năng" (Thêm mới · Xóa, hộp #myModalQuyenCN — nay biểu mẫu
               trong trang, thay chỗ vùng chi tiết);
             · biểu mẫu Thêm mới / Sửa chức năng;
             · vùng xoá "Vui lòng xóa các nội dung liên quan…" (vai trò | người dùng).
   Bản mới: ums.pat.master (cột trái kiểu danh mục — cây), phần cây dùng chung với
   Sơ đồ quy trình ở script/_chung.js (ums.cmsCN).

   Lời gọi (chép nguyên):
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung
       LayDanhSachUngDung          strTuKhoa '', pageIndex 1, pageSize 1000, dTrangThai 1
       LayDanhSachChucNang         versionAPI v1.0, strChung_UngDung_Id, strCHUCNANGCHA_Id '',
                                   pageSize 1000, strNGUONTRUYCAP_Id '', dTrangThai 1
       LayDanhSachVaiTroChucNang   strTuKhoa '' (ô txtAAAA không tồn tại), pageIndex 1,
                                   pageSize 10 (= edu.system.pageSize_default của Corei)
     CMS_QuanTri01_MH · PKG_CORE_QUANTRI_01.LayDSNguoiDungCoQuyenChucNang
                                   strHanhDong_Id '' (ô dropAAAA không tồn tại)
     CMS_QuanTri02_MH · PKG_CORE_QUANTRI_02
       LayDSCore_Quyen · Them_Core_Quyen / Sua_Core_Quyen (có strId) · Xoa_Core_Quyen
     Kiểu cũ (không func, không iM — gốc cũng không truyền):
       CMS_QuanLyNguoiDung/ThemMoiChucNang | SuaChucNang (có strId)
       CMS_QuanLyNguoiDung/XoaChucNang               strIds
       CMS_QuanLyNguoiDung/XoaChucNangCuaVaiTro      strVaiTro_Id '', strChucNang_Id
       CMS_QuanLyNguoiDung/XoaChucNangTheoNguoiDung  strUngDung_Id = ID CHỨC NĂNG (tên tham số
                                                     như gốc), strNguoiDung_Id ''
   strNguoiThucHien_Id để trống — ums.api tự điền userId như gốc.

   TENANH (ô Icon) vừa là icon vừa là ROUTER chọn vỏ (CLAUDE.md mục 5): lưu nguyên
   văn như gốc; chỉ HIỂN THỊ qua ums.iconFA4, và ô nhập có dòng gợi ý cho quản trị.

   Giữ như gốc (nghi ngờ, ghi can-quyet):
     · Sửa: ô Phạm vi luôn để trống (viewEdit gốc đặt "" chứ không đọc cột) → lưu
       mà không chọn lại là gửi strNGUONTRUYCAP_Id rỗng.
     · Thêm: "Chức năng cha" mặc định = cha của chức năng đang xem, "Ứng dụng" =
       ứng dụng đang chọn ở cột trái (rewrite gốc không xoá hai ô này).
     · Không kiểm hợp lệ ô nào khi lưu (gốc không kiểm). Mã / Link vật lý / Link
       hiển thị bỏ hết dấu cách; Thứ tự trống gửi 0.
     · Vai trò thuộc chức năng chỉ lấy trang đầu 10 dòng (pageSize_default).
     · Quyền: đang sửa mà chọn thêm hành động thì mỗi hành động một lời gọi
       Sua_Core_Quyen trên CÙNG strId (như gốc).
     · Nút "Tải file" chỉ hiện với tài khoản 4038E6FD0FFA4D339FA991E740348F01, mở
       <rootPathReport>/Modules/Common/ExportDataInTable.aspx?strTableNames=<câu SQL>.
   Khác gốc (lỗi rõ / an toàn):
     · Xóa chức năng: gốc XOÁ NGAY khi bấm, không hỏi lại → nay hỏi lại trước. Sau đó
       như gốc: hiện vùng "nội dung liên quan", gọi XoaChucNang; thành công thì về
       khung nhắc, lỗi thì ở lại vùng xoá kèm thông báo để gỡ vai trò / người dùng.
     · Lưu chức năng xong quay về khung xem (sửa) hoặc khung nhắc (thêm) — gốc ở lại
       biểu mẫu với strId rỗng nên bấm Lưu lần nữa là thêm TRÙNG.
     · Mỗi lần nạp cây gốc gắn thêm một trình xử lý select_node (chọn một nút gọi API
       N lần) — không chép.
   Cố ý bỏ: khối sửa select2 trong modal (tầng chung lo), fakedb, reset() các nhãn.
   Ô cha → con: không có (ứng dụng ở cột trái nạp CÂY, không phải ô chọn; ô "Chức
   năng cha" của biểu mẫu lấy theo cây đang xem, không theo ô Ứng dụng của biểu mẫu).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.cmsCN;
    var root = document.getElementById('cms-chucnang');
    if (!root || !C) return;

    var QL = 'CMS_QuanLyNguoiDung_MH/', PQ = 'pkg_chung_quanlynguoidung.';
    var Q2 = 'CMS_QuanTri02_MH/', P2 = 'PKG_CORE_QUANTRI_02.';
    var USER_TAIFILE = '4038E6FD0FFA4D339FA991E740348F01';

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function khongCach(v) { return e(v).replace(/ /g, ''); }

    var searchbar = '<div class="ums-searchbar ums-searchbar--sm">' +
        '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
        '<input class="ums-searchbar__input" data-a="q" type="text" autocomplete="off" placeholder="Tìm tên chức năng..."></div>';

    var mst = pat.master({
        el: root,
        title: 'Quản lý chức năng',
        actions: ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } }),
        side: {
            title: 'Danh sách chức năng', kieu: 'danhmuc', search: false,
            /* Luật cột trái (BO-CUC 12): ô tìm chuẩn trên cùng (gõ là lọc cây), ô ứng dụng vào Bộ lọc nâng cao (pat.cotTrai) */
            filter: '<div class="ums-master__search">' + searchbar + '</div>' +
                '<div class="ums-field"><select class="ums-select" data-a="ungdung" data-ph="Chọn ứng dụng">' +
                '<option value="">Chọn ứng dụng</option></select></div>'
        },
        main: { title: false }
    });
    var elTree = mst.sideBody, elDem = mst.sideCount;
    var selApp = root.querySelector('[data-a="ungdung"]');
    var inpQ = root.querySelector('[data-a="q"]');

    var laTaiFile = ums.session && ums.session.userId === USER_TAIFILE;

    mst.mainBody.innerHTML =
        '<div data-z="nhac">' + pat.panel({ title: 'Thông tin chi tiết', icon: 'fa-circle-info',
            body: ui.empty('Chọn ứng dụng, rồi chọn một chức năng ở cột trái', 'fa-hand-pointer') }) + '</div>' +

        '<div data-z="ct" hidden>' +
            pat.panel({ title: 'Thông tin chi tiết', icon: 'fa-circle-info', zone: 'ctBody',
                tools: (laTaiFile ? ui.btn('excel', { text: 'Tải file', icon: 'fa-download', attr: { 'data-a': 'taifile' } }) : '') +
                    ui.btn('del', { text: 'Xóa', attr: { 'data-a': 'xoa' } }) +
                    ui.btn('edit', { text: 'Sửa', attr: { 'data-a': 'sua' } }) }) +
            pat.panel({ title: 'Người dùng thuộc chức năng', icon: 'fa-users', count: 'ndDem', flush: true, zone: 'nd' }) +
            pat.panel({ title: 'Quyền cho chức năng', icon: 'fa-key', flush: true, zone: 'quyen',
                tools: ui.btn('add', { text: 'Thêm mới', attr: { 'data-a': 'themquyen' } }) +
                    ui.xoaChon('input[data-cq]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoaquyen' } }) }) +
        '</div>' +

        '<div data-z="form" hidden>' +
            pat.panel({ title: 'Thêm mới - Chức năng', icon: 'fa-plus', zone: 'formBody',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }) }) +
        '</div>' +

        '<div data-z="xoaZone" hidden>' +
            pat.panel({ title: 'Vui lòng xóa các nội dung liên quan đến chức năng nếu có', icon: 'fa-trash-can', zone: 'xoaBody',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                body: '<div class="ums-grid cn-xoa">' +
                    '<div><div class="cn-xoa__head"><b>Vai trò thuộc chức năng (<span data-z="vtDem">0</span>)</b>' +
                        ui.btn('del', { text: 'Xóa', mod: 'out-danger', cls: 'ums-btn--sm', attr: { 'data-a': 'xoavt', title: 'Xóa chức năng khỏi tất cả vai trò' } }) + '</div>' +
                        '<div data-z="vt"></div></div>' +
                    '<div><div class="cn-xoa__head"><b>Người dùng thuộc chức năng (<span data-z="nd2Dem">0</span>)</b>' +
                        ui.btn('del', { text: 'Xóa', mod: 'out-danger', cls: 'ums-btn--sm', attr: { 'data-a': 'xoand', title: 'Xóa chức năng khỏi tất cả người dùng' } }) + '</div>' +
                        '<div data-z="nd2"></div></div>' +
                    '</div><div class="cn-xoa__bao" data-z="bao"></div>' }) +
        '</div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var vung = 'nhac';
    var fQuyen = null;      // biểu mẫu Quyền đang mở ở cột phải (pat.formTrang) — đổi vùng / đổi chức năng thì đóng
    function sang(k) {
        if (fQuyen) fQuyen.close();
        if (k === vung) return;
        ui.swap(z(vung), z(k), { top: false });
        vung = k;
        mst.formMode(k === 'form');
    }

    var S = {
        ungDung: [],       // danh sách ứng dụng
        cn: [],            // dtChucNang
        chon: null,        // chức năng đang xem
        sua: null,         // null = thêm mới
        quyen: [],
        nd: [], ndTrang: 1, ndCo: 10
    };

    /* ---------- [1] Ứng dụng ------------------------------------------ */
    function napUngDung() {
        return ums.api.call({
            action: QL + 'DSA4BSAvKRIgIikULyYFNC8m', func: PQ + 'LayDanhSachUngDung',
            strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1
        }).then(function (r) {
            S.ungDung = C.rows(r);
            C.fillUngDung(selApp, S.ungDung);
        }).catch(function (err) { ums.api.handle(err, 'CMS_UngDung/LayDanhSach'); });
    }

    ums.pat.cotTrai({ side: mst.side, search: inpQ }, { tai: function () { napCay(); }, tuTaiLoc: false, tuTim: false });   // ô tìm đã lọc cây tại chỗ
    jQuery(selApp).on('select2:select', function () {
        if (selApp.value) napCay();
        else ui.toast('Vui lòng chọn ứng dụng!', 'warn');
    });
    jQuery(selApp).on('select2:clear', function () {
        S.cn = []; S.chon = null;
        elTree.innerHTML = '';
        elDem.textContent = '';
        if (vung !== 'form') sang('nhac');
    });

    /* ---------- [2] Cây chức năng -------------------------------------- */
    function napCay(giuId) {
        elTree.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: QL + 'DSA4BSAvKRIgIikCKTQiDyAvJgPP', func: PQ + 'LayDanhSachChucNang',
            versionAPI: 'v1.0', strTuKhoa: '', strChung_UngDung_Id: selApp.value, strCHUCNANGCHA_Id: '',
            pageIndex: 1, pageSize: 1000, strNGUONTRUYCAP_Id: '', dTrangThai: 1
        }).then(function (r) {
            S.cn = C.rows(r);
            elDem.textContent = String(r.pager || S.cn.length);
            C.cay(elTree, S.cn, giuId || (S.chon && S.chon.ID));
            C.loc(elTree, inpQ.value);
            if (giuId) {
                var x = timCN(giuId);
                if (x) xem(x);
            } else if (S.chon && !timCN(S.chon.ID) && vung !== 'form') {
                S.chon = null; sang('nhac');
            }
        }).catch(function (err) {
            elTree.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'CMS_ChucNang/LayDanhSach');
        });
    }
    function timCN(id) { return S.cn.filter(function (x) { return x.ID === id; })[0] || null; }

    inpQ.addEventListener('input', function () { C.loc(elTree, inpQ.value); });
    elTree.addEventListener('click', function (ev) {
        var b = ev.target.closest('.cn-node');
        if (!b) return;
        var row = timCN(b.getAttribute('data-id'));
        if (row) xem(row);
    });

    /* ---------- [2] Thông tin chi tiết (viewForm_ChucNang) -------------- */
    function kv(nhan, gt, rong) {
        return '<div class="ums-kv' + (rong ? ' cn-span' : '') + '"><span>' + ui.esc(nhan) + '</span><b>' + gt + '</b></div>';
    }
    function xem(row) {
        S.chon = row;
        C.chon(elTree, row.ID);
        var ic = ums.iconFA4 ? ums.iconFA4(row.TENANH) : e(row.TENANH);
        z('ctBody').innerHTML = '<div class="ums-grid ums-grid--2 cn-ct">' +
            kv('Tên', '<span class="cn-ten">' + ui.esc(row.TENCHUCNANG) + '</span>') +
            kv('Mã', ui.esc(row.MACHUCNANG)) +
            kv('Icon', row.TENANH ? '<i class="' + ui.esc(ic) + ' cn-icon"></i> <code>' + ui.esc(row.TENANH) + '</code>' : '') +
            kv('Thứ tự', ui.esc(row.THUTU)) +
            kv('Link hiển thị', ui.esc(row.DUONGDANHIENTHI)) +
            kv('Chức năng cha', ui.esc(row.CHUCNANGCHA)) +
            kv('Link vật lý', ui.esc(row.DUONGDANFILE), true) +
            kv('Link hướng dẫn', ui.esc(row.DUONGDANHUONGDANSUDUNG), true) +
            kv('Ứng dụng', ui.esc(row.CHUNG_UNGDUNG)) +
            kv('Phạm vi', ui.esc(row.TENDAYDU)) +
            kv('Mô tả', ui.esc(row.MOTA), true) +
            kv('Nội dung ẩn', ui.esc(row.THONGTINKHONGHIENTHI), true) +
            '</div>';
        sang('ct');
        napNguoiDung();
        napQuyen();
    }

    /* ---------- [4] Người dùng thuộc chức năng -------------------------- */
    function napNguoiDung() {
        var id = S.chon && S.chon.ID;
        z('nd').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_QuanTri01_MH/DSA4BRIPJjQuKAU0LyYCLhA0OCQvAik0Ig8gLyYP',
            func: 'PKG_CORE_QUANTRI_01.LayDSNguoiDungCoQuyenChucNang',
            strChucNang_Id: id, strHanhDong_Id: '', strNguoiThucHien_Id: ''
        }).then(function (r) {
            if (!S.chon || S.chon.ID !== id) return;
            S.nd = C.rows(r); S.ndTrang = 1;
            var dem = String(r.pager || S.nd.length);
            z('ndDem').textContent = '(' + dem + ')';
            z('nd2Dem').textContent = dem;
            veNguoiDung(); veNguoiDung2();
        }).catch(function (err) {
            z('nd').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'Người dùng thuộc chức năng');
        });
    }
    function veNguoiDung() {
        var tu = (S.ndTrang - 1) * S.ndCo;
        ui.table({
            el: z('nd'), rows: S.nd.slice(tu, tu + S.ndCo), empty: 'Chưa có người dùng nào',
            columns: [
                { title: 'Mã', prop: 'TAIKHOAN' },
                { title: 'Tên', prop: 'TENDAYDU' },
                { title: 'Email', prop: 'EMAIL' }
            ],
            page: { index: S.ndTrang, size: S.ndCo, total: S.nd.length,
                onChange: function (p) { S.ndTrang = p; veNguoiDung(); },
                onSize: function (v) { S.ndCo = v; S.ndTrang = 1; veNguoiDung(); } }
        });
    }
    /* Bảng ở vùng xoá: ảnh + tên / email, không tiêu đề (bHiddenHeader) */
    function veNguoiDung2() {
        var el = z('nd2');
        ui.table({
            el: el, rows: S.nd, stt: false, empty: 'Không có người dùng nào', tableCls: 'ums-table--lined cn-nd2',
            columns: [
                { title: '', cls: 'cn-anhcot', render: function (r) {
                    var url = r.HINHDAIDIEN && ums.files && ums.files.url ? ums.files.url(r.HINHDAIDIEN) : '';
                    return '<span class="cn-anh">' + (url ? '<img alt="" src="' + ui.esc(url) + '">' : '') + '<i class="fa-light fa-user"></i></span>';
                } },
                { title: 'Người dùng', render: function (r) { return ui.cell(r.TENDAYDU, r.EMAIL); } }
            ]
        });
        Array.prototype.forEach.call(el.querySelectorAll('.cn-anh img'), function (img) {
            img.addEventListener('error', function () { img.remove(); });
        });
    }

    /* ---------- [3] Vai trò thuộc chức năng (vùng xoá) ------------------ */
    function napVaiTro() {
        var id = S.chon && S.chon.ID;
        z('vt').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: QL + 'DSA4BSAvKRIgIikXICgVMy4CKTQiDyAvJgPP', func: PQ + 'LayDanhSachVaiTroChucNang',
            strTuKhoa: '', strChucNang_Id: id, pageIndex: 1, pageSize: 10
        }).then(function (r) {
            if (!S.chon || S.chon.ID !== id) return;
            var ds = C.rows(r);
            z('vtDem').textContent = String(ds.length);
            z('vt').innerHTML = ds.length ? '<ul class="cn-vt">' + ds.map(function (v) {
                return '<li><i class="fa-light fa-user-shield"></i> ' + ui.esc(v.TENVAITRO) + '</li>';
            }).join('') + '</ul>' : ui.empty('Không có vai trò nào');
            napNguoiDung();   // gốc: nạp vai trò xong nạp lại người dùng
        }).catch(function (err) {
            z('vt').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'CMS_VaiTroChucNang/LayDanhSach');
        });
    }

    /* ---------- [2] Biểu mẫu thêm / sửa --------------------------------- */
    function o(label, ctl, opts) { return '<div' + (opts && opts.rong ? ' class="cn-span"' : '') + '>' + ui.field(label, ctl, opts) + '</div>'; }
    function inp(k, ph) { return '<input class="ums-input" data-k="' + k + '" autocomplete="off" placeholder="' + ui.esc(ph || '') + '">'; }
    function moForm(row) {
        S.sua = row;
        var tieuDe = z('form').querySelector('.ums-panel__title');
        tieuDe.innerHTML = '<i class="fa-light ' + (row ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' + (row ? 'Sửa' : 'Thêm mới') + ' - Chức năng';

        var chaOpts = '<option value="">Chọn chức năng cha</option>' + C.theoCay(S.cn).map(function (x) {
            return '<option value="' + ui.esc(x.row.ID) + '">' + ui.esc(new Array(x.sau + 1).join('— ') + e(x.row.TENCHUCNANG)) + '</option>';
        }).join('');
        var appOpts = '<option value="">Chọn ứng dụng</option>' + S.ungDung.map(function (a) {
            return '<option value="' + ui.esc(a.ID) + '">' + ui.esc(a.TENUNGDUNG) + '</option>';
        }).join('');

        z('formBody').innerHTML = '<div class="ums-grid ums-grid--2">' +
            o('Tên', inp('ten', 'Nhập tên chức năng')) +
            o('Mã', inp('ma', 'Nhập mã chức năng')) +
            o('Icon', inp('icon', 'Nhập icon hiển thị'), {
                hint: 'Icon kiểu Font Awesome 4 (bắt đầu bằng "fa ", vd "fa fa-list") thì chức năng mở ở vỏ indexi.aspx; kiểu khác hoặc để trống thì mở ở vỏ index.aspx. Đổi icon là đổi vỏ hiển thị.' }) +
            o('Thứ tự', inp('thutu', 'Nhập thứ tự hiển thị')) +
            o('Link vật lý', inp('file', 'Modules/...'), { rong: true }) +
            o('Link hướng dẫn', inp('hd', 'https://youtu.be/w_VWSrabSbE'), { rong: true }) +
            o('Link hiển thị', inp('hienthi', '#tenchucnang')) +
            o('Chức năng cha', '<select class="ums-select" data-k="cha" data-ph="Chọn chức năng cha">' + chaOpts + '</select>') +
            o('Ứng dụng', '<select class="ums-select" data-k="app" data-ph="Chọn ứng dụng">' + appOpts + '</select>') +
            o('Phạm vi', '<select class="ums-select" data-k="phamvi" data-ph="-- Chọn phạm vi truy cập --">' +
                '<option value="">-- Chọn phạm vi truy cập --</option><option value="Internet">Internet</option><option value="Intranet">Intranet</option></select>') +
            o('Mô tả', inp('mota', 'Nhập nội dung mô tả'), { rong: true }) +
            o('Nội dung ẩn', '<textarea class="ums-textarea cn-noidungan" data-k="an" placeholder="Nhập id hoặc class của nội dung bạn muốn ẩn, cách nhau bởi khoảng trắng. Vd: #hotennguoidung .thongtinkhach .thongtinan"></textarea>', { rong: true }) +
            '</div>';

        var src = row || {};
        dat('ten', src.TENCHUCNANG); dat('ma', src.MACHUCNANG); dat('icon', src.TENANH);
        dat('thutu', src.THUTU); dat('file', src.DUONGDANFILE); dat('hienthi', src.DUONGDANHIENTHI);
        dat('hd', src.DUONGDANHUONGDANSUDUNG); dat('mota', src.MOTA); dat('an', src.THONGTINKHONGHIENTHI);
        dat('phamvi', '');   // gốc: viewEdit đặt "" (không đọc cột)
        if (row) {
            dat('cha', row.CHUCNANGCHA_ID); dat('app', row.CHUNG_UNGDUNG_ID);
        } else {
            dat('cha', S.chon ? S.chon.CHUCNANGCHA_ID : '');
            dat('app', selApp.value);
        }
        ui.enhance(z('formBody'));
        Array.prototype.forEach.call(z('formBody').querySelectorAll('select'), function (s) { jQuery(s).trigger('change.select2'); });
        sang('form');
    }
    function f(k) { return z('formBody').querySelector('[data-k="' + k + '"]'); }
    function dat(k, v) { var el = f(k); if (el) el.value = e(v); }
    function lay(k) { var el = f(k); return el ? e(el.value) : ''; }

    function luu() {
        var sua = S.sua;
        var o2 = {
            action: sua ? 'CMS_QuanLyNguoiDung/SuaChucNang' : 'CMS_QuanLyNguoiDung/ThemMoiChucNang',
            strId: sua ? sua.ID : '',
            strMaChucNang: khongCach(lay('ma')),
            strTenChucNang: lay('ten'),
            strMoTa: lay('mota'),
            dThuTu: lay('thutu') === '' ? 0 : lay('thutu'),
            dTrangThai: 1,
            strNguoiThucHien_Id: '',
            strNoiDung: '',
            strTenAnh: lay('icon'),
            strDuongDanFile: khongCach(lay('file')),
            strDuongDanHienThi: khongCach(lay('hienthi')),
            strChucNangCha_Id: lay('cha'),
            strChung_UngDung_Id: lay('app'),
            strNGUONTRUYCAP_Id: lay('phamvi'),
            strDuongDanHuongDanSuDung: lay('hd'),
            strThongTinKhongHienThi: lay('an'),
            strLuuThongTinTheoNguoiDung: ''
        };
        ums.api.call(o2).then(function () {
            ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            if (sua) { napCay(sua.ID); }
            else { sang(S.chon ? 'ct' : 'nhac'); if (selApp.value) napCay(); }
        }).catch(function (err) { ums.api.handle(err, 'CMS_ChucNang/ThemMoi'); });
    }

    /* ---------- [2] Xoá chức năng + vùng nội dung liên quan -------------- */
    function xoaCN() {
        if (!S.chon) { ui.toast('Vui lòng chọn dữ liệu cần xóa!', 'warn'); return; }
        var row = S.chon;
        ui.confirm('Xóa chức năng "' + e(row.TENCHUCNANG) + '"?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            z('bao').textContent = '';
            sang('xoaZone');
            napVaiTro();
            ums.api.call({
                action: 'CMS_QuanLyNguoiDung/XoaChucNang', versionAPI: 'v1.0',
                strIds: row.ID, strNguoiThucHien_Id: ''
            }).then(function () {
                ui.toast('Đã xóa chức năng thành công!', 'ok');
                S.chon = null;
                sang('nhac');
                napCay();
            }).catch(function (err) {
                if (err && err.expired) return ums.api.handle(err);
                z('bao').textContent = 'CMS_ChucNang.Xoa: ' + e(err && err.message);
            });
        });
    }
    function xoaKhoiVaiTro() {
        if (!S.chon) return;
        ui.confirm('Bạn có chắc chắn muốn xóa Chức năng ra khỏi toàn bộ Vai trò?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'CMS_QuanLyNguoiDung/XoaChucNangCuaVaiTro', versionAPI: 'v1.0',
                strVaiTro_Id: '', strChucNang_Id: S.chon.ID, strNguoiThucHien_Id: ''
            }).then(function () {
                ui.toast('Đã xóa toàn bộ Chức năng khỏi Vai trò!', 'ok');
                napVaiTro();
            }).catch(function (err) { ums.api.handle(err, 'CMS_VaiTroChucNang/Xoa'); });
        });
    }
    function xoaKhoiNguoiDung() {
        if (!S.chon) return;
        ui.confirm('Bạn có chắc chắn muốn xóa Chức năng ra khỏi toàn bộ Người dùng?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'CMS_QuanLyNguoiDung/XoaChucNangTheoNguoiDung', versionAPI: 'v1.0',
                strUngDung_Id: S.chon.ID, strNguoiDung_Id: '', strNguoiThucHien_Id: ''
            }).then(function () {
                ui.toast('Đã xóa toàn bộ Chức năng khỏi Người dùng!', 'ok');
                napNguoiDung();
            }).catch(function (err) { ums.api.handle(err, 'CMS_NguoiDungChucNang/Xoa'); });
        });
    }

    /* ---------- Quyền cho chức năng ------------------------------------ */
    function napQuyen() {
        var id = S.chon && S.chon.ID;
        z('quyen').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: Q2 + 'DSA4BRICLjMkHhA0OCQv', func: P2 + 'LayDSCore_Quyen',
            strChucNang_Id: id, strNguoiThucHien_Id: ''
        }).then(function (r) {
            if (!S.chon || S.chon.ID !== id) return;
            S.quyen = C.rows(r);
            ui.table({
                el: z('quyen'), rows: S.quyen, empty: 'Chưa khai báo quyền nào',
                columns: [
                    { title: 'Quyền', prop: 'HANHDONG_TEN' },
                    { title: 'Mô tả', prop: 'MOTA' },
                    { title: 'Hiệu lực', cls: 'is-center', render: function (x) { return x.HIEULUC ? '' : ui.badge('Hết hiệu lực', 'mute'); } },
                    { title: 'Chức năng', prop: 'CHUCNANG_TEN' },
                    { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                    { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' },
                    { title: 'Sửa', cls: 'is-center is-actions', render: function (x) { return ui.iconBtn('edit', x.ID); } },
                    { head: '<input type="checkbox" data-cqall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (x) { return '<input type="checkbox" data-cq="' + ui.esc(x.ID) + '">'; } }
                ]
            });
        }).catch(function (err) {
            z('quyen').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'LayDSCore_Quyen');
        });
    }

    /* Biểu mẫu Quyền (hộp #myModalQuyenCN của gốc) — TRONG TRANG (BO-CUC luật 1): thay chỗ vùng chi tiết ở cột phải,
       cùng chỗ với biểu mẫu Thêm / Sửa chức năng. Lưu: đợi lô chạy xong mới đóng; có lời gọi lỗi thì GIỮ biểu mẫu
       (trước đây hộp đóng ngay khi bấm Lưu — lưu lỗi là mất dữ liệu đang nhập). */
    function hopQuyen(rec) {
        var cnId = S.chon && S.chon.ID;
        var dlg = fQuyen = pat.formTrang({
            host: mst.mainBody, title: 'Quyền', icon: rec ? 'fa-pen-to-square' : 'fa-plus',
            body:
                ui.field('Quyền', '<select class="ums-select" data-k="hd" multiple data-ph="Chọn quyền"></select>', { required: true }) +
                ui.field('Mô tả', '<textarea class="ums-textarea" data-k="mota"></textarea>') +
                ui.field('Hiệu lực', '<select class="ums-select" data-k="hl" data-required><option value="1">Hiệu lực</option><option value="0">Hết hiệu lực</option></select>'),
            onClose: function () { if (fQuyen === dlg) fQuyen = null; mst.formMode(vung === 'form'); },
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var hds = jQuery(d.body.querySelector('[data-k="hd"]')).val() || [];
                if (!hds.length) { ui.toast('Vui lòng chọn dữ liệu', 'warn'); return false; }
                var mota = d.body.querySelector('[data-k="mota"]').value;
                var hl = d.body.querySelector('[data-k="hl"]').value;
                var id = rec ? rec.ID : '';
                ui.batch(hds.map(function (hd) {
                    return {
                        action: id ? Q2 + 'EjQgHgIuMyQeEDQ4JC8P' : Q2 + 'FSkkLB4CLjMkHhA0OCQv',
                        func: id ? P2 + 'Sua_Core_Quyen' : P2 + 'Them_Core_Quyen',
                        strId: id, strChucNang_Id: cnId, strUngDung_Id: selApp.value,
                        strHanhDong_Id: hd, strMoTa: mota, dHieuLuc: hl, strNguoiThucHien_Id: ''
                    };
                }), { title: 'Đang lưu quyền', okText: id ? 'Cập nhật thành công' : 'Thêm mới thành công' }).then(function (r) {
                    if (!r.fail) d.close();
                    napQuyen();
                });
                return false;
            } }]
        });
        mst.formMode(true);
        var sHd = dlg.body.querySelector('[data-k="hd"]');
        dlg.body.querySelector('[data-k="mota"]').value = rec ? e(rec.MOTA) : '';
        var sHl = dlg.body.querySelector('[data-k="hl"]');
        sHl.value = rec && rec.HIEULUC !== null && rec.HIEULUC !== undefined ? String(rec.HIEULUC) : '1';
        jQuery(sHl).trigger('change.select2');
        ums.api.dm('CHUNG.HANHDONG').then(function (rows) {
            pat.fill(sHd, rows, { id: 'ID', name: 'TEN' });
            if (rec) jQuery(sHd).val([e(rec.HANHDONG_ID)]).trigger('change.select2').trigger('ums:refresh');
        }).catch(function (err) { ums.api.handle(err, 'CHUNG.HANHDONG'); });
    }

    function xoaQuyen() {
        var ids = Array.prototype.map.call(z('quyen').querySelectorAll('input[data-cq]:checked'), function (c) { return c.getAttribute('data-cq'); });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                return { action: Q2 + 'GS4gHgIuMyQeEDQ4JC8P', func: P2 + 'Xoa_Core_Quyen', strId: id, strNguoiThucHien_Id: '' };
            }), { title: 'Đang xóa', okText: 'Xóa dữ liệu thành công' }).then(napQuyen);
        });
    }

    /* ---------- Sự kiện (gắn trên gốc màn) ----------------------------- */
    root.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute('data-cqall')) {
            Array.prototype.forEach.call(z('quyen').querySelectorAll('input[data-cq]'), function (c) { c.checked = ev.target.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        var eb = ev.target.closest('[data-act="edit"]');
        if (eb && z('quyen').contains(eb)) {
            var rec = S.quyen.filter(function (x) { return x.ID === eb.getAttribute('data-id'); })[0];
            if (rec) hopQuyen(rec);
            return;
        }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        switch (b.getAttribute('data-a')) {
            case 'them': moForm(null); break;
            case 'sua': if (S.chon) moForm(S.chon); break;
            case 'luu': luu(); break;
            case 'dong': if (S.chon && timCN(S.chon.ID)) { sang('ct'); } else { sang('nhac'); } break;
            case 'xoa': xoaCN(); break;
            case 'xoavt': xoaKhoiVaiTro(); break;
            case 'xoand': xoaKhoiNguoiDung(); break;
            case 'themquyen': if (S.chon) hopQuyen(null); break;
            case 'xoaquyen': xoaQuyen(); break;
            case 'taifile': {
                var sql = "select * from chung_chucnang where chung_ungdung_id='" + selApp.value + "'";
                location.href = e(ums.session && ums.session.rootPathReport) + '/Modules/Common/ExportDataInTable.aspx?strTableNames=' + sql;
                break;
            }
        }
    });

    ui.enhance(root);
    napUngDung();
})();
