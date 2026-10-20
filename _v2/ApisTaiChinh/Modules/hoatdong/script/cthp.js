/* =========================================================================
   Xem chương trình đào tạo (chương trình học phần)
   Bản gốc: ApisTaiChinh/Modules/hoatdong/script/cthp.js (5.109 dòng)
   Cổng cán bộ dùng CHÍNH tệp này (ApisCongCanBo/Modules/hoatdong/cthp — bản gốc
   chép y hệt, chỉ khác câu báo lỗi; html của CCB không có ô Chương trình / nút Lưu,
   đúng như bản chuyển ở đây).
   Kế hoạch chương trình (ApisKeHoachChuongTrinh/Modules/chuongtrinhhocphan/cthp —
   bản gốc là màn SOẠN chương trình mà tệp Tài chính chép lại) cũng dùng tệp này:
   thẻ gốc mang `data-khct` thì tệp KHÔNG tự chạy, màn KHCT gọi
       ums.cthp.man(root, { khct: true, onSua: function (ct, api) { … } })
   Cờ `khct` chỉ bật những chỗ bản KHCT khác bản Tài chính (xem "Chế độ KHCT"
   dưới đây); không truyền cờ thì hành vi y như trước.
   ---------------------------------------------------------------------------
   Bản gốc là tệp chép từ màn soạn chương trình của phân hệ Kế hoạch; HTML
   của Tài chính chỉ có HAI vùng: danh sách chương trình và khung xem. Chỉ
   những hàm hai vùng đó gọi tới được chuyển; ~90% còn lại (thêm/sửa/xoá học
   phần, khối, quan hệ, định hướng, kế thừa, kéo thả…) thao tác trên phần tử
   KHÔNG tồn tại trong cthp.html → mã chết, không chuyển.

   Lời gọi:
       ums.ref.heDaoTao / khoaDaoTao (= edu.system.getList_HeDaoTao / KhoaDaoTao, pageSize 100000)
       KHCT_ToChucChuongTrinh/LayDanhSach                     GET, pageSize 240000
       KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong                 POST
       KHCT_ThongTin/LayDSKS_DaoTao_KhoiBatBuoc               POST → từng khối:
       KHCT_ThongTin/LayDSKS_DaoTao_HP_KhoiBatBuoc            POST
       KHCT_ThongTin/LayDSKS_DaoTao_KhoiTuChon_Don            POST → từng khối:
       KHCT_ThongTin/LayDSKS_DaoTao_HP_KTuChon_Don            POST
   Các lời gọi KHCT_ThongTin/* của bản gốc truyền iM mà KHÔNG có func (và
   gửi kèm tham số `type: 'POST'`), nên makeRequest cũ vẫn mã hoá thân. Ở đây
   truyền iM = ums.session.iM tường minh để giữ đúng hành vi đó (ums.api chỉ
   tự thêm iM khi có func).

   LỖI BẢN GỐC — đã sửa:
     · dtVKhoiBatBuocHP / dtVKhoiTuChonHP được nối thêm mỗi lần mở mà không
       xoá → mở lại cùng chương trình thì học phần nhân đôi. Ở đây làm mới mỗi lần.
   Cố ý bỏ (bản Tài chính):
     · getList_KyDuKien (LayDSPhanKyKeHoach), getList_KhoaDaoTao_Edit,
       getList_MauImport("zonebtnHPCT"): đổ vào ô/vùng không có trong HTML.
     · Nút "Xem" cột Khối kiến thức ở bảng định hướng, nút Lưu
       (btnSave_KeHoachXuLy), ô đánh dấu cột cuối bảng chương trình: không có
       xử lý nào.
   Nghi ngờ, giữ nguyên: dòng "Tổng số SV" bản gốc viết `+ + x` (ép số) —
   ở đây hiện giá trị như chữ.

   Chế độ KHCT (o.khct = true) — khác bản Tài chính đúng như html/js gốc KHCT:
     · Danh sách chương trình là LƯỚI HỘP (genBox_ChuongTrinh: col-sm-3 small-box)
       chứ không phải bảng → ums.pat.cards, mỗi hộp hai nút "Cập nhật CTDT" /
       "Xem CTDT". Bấm hộp hoặc "Cập nhật CTDT" → o.onSua(ct, api) (màn KHCT dựng
       vùng soạn). LỖI GỐC: nút "Xem CTDT" thiếu lớp btnViewCT nên bấm cũng rơi
       vào btnView của hộp (mở vùng soạn) — vùng xem chưa từng mở được. Ở đây
       "Xem CTDT" mở vùng xem (làm theo ý định).
     · Bảng định hướng của vùng xem có cột "Khối kiến thức" — nút "Xem" mở hộp
       "Khối kiến thức" (KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong_KKT, POST, iM).
       Nút "Lưu" của hộp đó trùng id với nút Lưu hộp thứ tự nên jQuery không gắn
       gì → giữ nút, KHOÁ.
     · Các vùng khác (soạn, biểu mẫu…) do màn KHCT thêm vào `root` với thuộc
       tính data-khu; api.hien(tên) đổi vùng như edu.util.toggle_overide.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums;
    ums.cthp = ums.cthp || {};

    ums.cthp.man = function (root, o) {
        o = o || {};
        var ui = ums.ui, pat = ums.pat;
        var KHCT = !!o.khct;
        function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
        function e(v) { return v === undefined || v === null ? '' : v; }
        function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }

        var dsCT = [], page = 1, SIZE = KHCT ? 24 : 10, ct = null, token = null;

        /* ---------- Khung: DANH SÁCH rồi KHUNG XEM thay chỗ nó ------------------
           Đúng như bản gốc (cthp.html): một thanh lọc ngang (hệ · khoá · từ khoá ·
           Tìm kiếm), dưới là bảng "Danh sách chương trình" chiếm hết bề ngang;
           bấm "Xem" thì vùng #zoneViewHocPhan thay chỗ danh sách. Bản chuyển đầu
           tiên dựng thành hai cột (ums.pat.master) — sai kiểu màn: cột trái 320px
           nhét không đủ 6 cột của bảng, và bản gốc không có danh sách thường trực
           bên cạnh. Nay theo BO-CUC quy ước 1: khung xem thay chỗ danh sách. */
        root.innerHTML =
            pat.page('Chương trình học phần') +
            '<div data-z="list" data-khu="list">' +
                pat.filterBar([
                    { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
                    { key: 'khoa', type: 'select', label: 'Chọn khoá đào tạo' },
                    { key: 'tuKhoa', label: 'Nhập từ khoá tìm kiếm' }
                ]) +
                /* KHCT (gốc 20/10): dải tab "Dạng thẻ | Dạng cây" trên khung danh sách; cây Khoa quản lý → Ngành → Chuyên ngành → Chương trình */
                (KHCT ? '<div class="cthp-kieu" data-z="kieu">' + ui.tabs([{ key: 'the', text: 'Dạng thẻ', icon: 'fa-table-cells-large' },
                    { key: 'cay', text: 'Dạng cây (Khoa – Ngành – Chuyên ngành)', icon: 'fa-sitemap' }], 'the', 'data-kieu') + '</div>' : '') +
                pat.panel({
                    title: 'Danh sách chương trình', icon: KHCT ? 'fa-books' : 'fa-laptop-file', count: 'ctCount',
                    flush: !KHCT, zone: 'tbl', body: ''
                }) +
                (KHCT ? pat.panel({
                    title: 'Cây chương trình', icon: 'fa-sitemap', count: 'cayTong', cls: 'cthp-cay', zone: 'cay', body: '',
                    tools: ui.btn('view', { text: 'Mở rộng tất cả', icon: 'fa-angles-down', mod: 'ghost', cls: 'ums-btn--sm', attr: { 'data-cay': 'mo' } }) +
                        ui.btn('view', { text: 'Thu gọn tất cả', icon: 'fa-angles-up', mod: 'ghost', cls: 'ums-btn--sm', attr: { 'data-cay': 'thu' } })
                }) : '') +
            '</div>' +
            '<div data-z="view" data-khu="view" hidden>' +
                '<div class="ums-page__head">' +
                '  <h2 class="ums-page__title ums-u-mb-0" data-z="vtitle">Chương trình học phần</h2>' +
                '  <div class="ums-page__actions">' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + '</div>' +
                '</div>' +
                '<div class="cthp-info ums-u-mb-4">' +
                '  <div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-chalkboard-user"></i> Thông tin chung về chương trình</div></div>' +
                '    <div class="ums-panel__body cthp-kv" data-z="info"></div></div>' +
                '  <div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-signs-post"></i> Thông tin chia định hướng</div></div>' +
                '    <div class="ums-panel__body ums-panel__body--flush" data-z="dinhHuong"></div></div>' +
                '</div>' +
                '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-layer-group"></i> Khối bắt buộc</div></div>' +
                '  <div class="ums-panel__body ums-panel__body--flush" data-z="batBuoc"></div></div>' +
                '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-check"></i> Khối tự chọn</div></div>' +
                '  <div class="ums-panel__body ums-panel__body--flush" data-z="tuChon"></div></div>' +
            '</div>';

        z('tbl').innerHTML = ui.empty('Chọn hệ, khoá hoặc nhập từ khoá rồi bấm Tìm kiếm', 'fa-magnifying-glass');

        function f(n) { return root.querySelector('[data-f="' + n + '"]'); }
        ui.enhance(root);

        function fill(el, rows, name, head) {
            el.innerHTML = ui.options(rows, { name: name, title: head });
            if (window.jQuery) jQuery(el).trigger('change.select2');
        }
        ums.ref.heDaoTao({ pageIndex: 1, pageSize: 100000 }).then(function (r) { fill(f('he'), r, 'TENHEDAOTAO', 'Chọn hệ đào tạo'); })
            .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        function loadKhoa() {
            return ums.ref.khoaDaoTao({ strHeDaoTao_Id: f('he').value, pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    fill(f('khoa'), r, 'TENKHOA', 'Chọn khoá đào tạo');
                    if (o.onKhoa) o.onKhoa(r);          // KHCT: danh sách khoá dùng chung cho các ô khoá của vùng soạn
                })
                .catch(function (err) { ums.api.handle(err, 'khoá đào tạo'); });
        }
        loadKhoa();
        if (window.jQuery) {
            jQuery(f('he')).on('select2:select select2:clear', loadKhoa);
            jQuery(f('khoa')).on('select2:select select2:clear', function () { search(); });
        }
        /* Luật cha → con (người dùng yêu cầu 2026-09-21): chưa chọn Hệ thì khoá Khoá,
           đổi / xoá Hệ thì xoá trắng Khoá. Đã nghe select2:clear sẵn → không phát lại. */
        pat.chain([f('he'), f('khoa')], { phatLai: false });

        function search() {
            z('tbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({
                action: 'KHCT_ToChucChuongTrinh/LayDanhSach',
                method: 'GET',
                strTuKhoa: (f('tuKhoa').value || '').trim(),
                strDaoTao_KhoaDaoTao_Id: f('khoa').value,
                strDaoTao_N_CN_Id: '',
                strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_HeDaoTao_Id: f('he').value,
                strDaoTao_ToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: '',
                pageIndex: 1,
                pageSize: 240000
            }).then(function (r) {
                dsCT = rowsOf(r);
                z('ctCount').textContent = '(' + dsCT.length + ')';
                draw(1);
                if (KHCT) { cay.loc = { he: f('he').value, khoa: f('khoa').value, q: (f('tuKhoa').value || '').trim() }; cay.cu = true; if (cay.kieu === 'cay') taiCay(); }
            }).catch(function (err) { z('tbl').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách chương trình'); });
        }

        /* ---------- KHCT: Dạng cây (gốc 20/10 toggle_viewChuongTrinh / getList_ChuongTrinhCay / genTree_ChuongTrinh) ----------
           Nguồn: pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT (ums.ref.chuongTrinh) với cùng bộ lọc của lần tìm gần nhất.
           Ngành cha của DAOTAO_N_CN do máy chủ trả thêm (QUANHECHA_ID / _MA / _TEN): có cha → cha là Ngành, N_CN là Chuyên ngành;
           không cha → N_CN là Ngành. Mở / xem vẫn dùng dsCT (API cũ) để giữ các cờ mô hình; chương trình không có trong dsCT → báo. */
        var cay = { kieu: 'the', cu: true, loc: null, tk: 0, maKhoa: null };
        var CHA = { ID: ['QUANHECHA_ID', 'DAOTAO_N_CN_QUANHECHA_ID', 'DAOTAO_N_CN_CHA_ID'], MA: ['QUANHECHA_MA', 'DAOTAO_N_CN_QUANHECHA_MA', 'DAOTAO_N_CN_CHA_MA'],
            TEN: ['QUANHECHA_TEN', 'DAOTAO_N_CN_QUANHECHA_TEN', 'DAOTAO_N_CN_CHA_TEN'] };
        function cayPanel() { return z('cay') ? z('cay').closest('.ums-panel') : null; }
        if (KHCT) { cayPanel().hidden = true; z('cay').innerHTML = ui.empty('Chọn hệ đào tạo, khóa đào tạo rồi bấm Tìm kiếm để xem cây Khoa – Ngành – Chuyên ngành', 'fa-sitemap'); }
        function doiKieu(k) {
            cay.kieu = k;
            ui.tabsActive(z('kieu'), k, 'data-kieu');
            z('tbl').closest('.ums-panel').hidden = k === 'cay';
            cayPanel().hidden = k !== 'cay';
            if (k === 'cay' && cay.cu) taiCay();
        }
        function taiCay() {
            if (!cay.loc) return;
            var tk = ++cay.tk;
            z('cay').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.ref.chuongTrinh({ strDaoTao_HeDaoTao_Id: cay.loc.he, strKhoaDaoTao_Id: cay.loc.khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: '', strTuKhoa: cay.loc.q, pageIndex: 1, pageSize: 240000 })
                .then(function (data) { if (tk !== cay.tk) return; cay.cu = false; veCay(Array.isArray(data) ? data : rowsOf({ data: data })); })
                .catch(function (err) { if (tk !== cay.tk) return; z('cay').innerHTML = ui.fail(err.message); ums.api.handle(err, 'cây chương trình'); });
        }
        function layCot(m, names) { for (var i = 0; i < names.length; i++) { var v = m[names[i]]; if (v !== undefined && v !== null && v !== '') return String(v); } return ''; }
        function veCay(data) {
            var host = z('cay');
            z('cayTong').textContent = '';
            if (!data.length) { host.innerHTML = ui.empty('Không có chương trình nào theo bộ lọc hiện tại', 'fa-sitemap'); return; }
            var dem = [0, 0, 0, 0], goc = { con: {} }, coCotCha = false;
            function nut(cha, lv, key, ten, ma, id) {
                var k = lv + ':' + key, n = cha.con[k];
                if (!n) { n = cha.con[k] = { ten: ten, ma: ma, id: id, con: {}, ct: [], so: 0 }; dem[lv - 1]++; }
                else if (!n.ma && ma) n.ma = ma;
                n.so++;
                return n;
            }
            data.forEach(function (r) {
                var m = {}; Object.keys(r).forEach(function (k) { m[k.toUpperCase()] = r[k]; });
                var khoaId = layCot(m, ['DAOTAO_KHOAQUANLY_ID']), khoaTen = layCot(m, ['DAOTAO_KHOAQUANLY_TEN']), khoaMa = layCot(m, ['DAOTAO_KHOAQUANLY_MA']);
                var cnId = layCot(m, ['DAOTAO_N_CN_ID']), cnTen = layCot(m, ['DAOTAO_N_CN_TEN']), cnMa = layCot(m, ['DAOTAO_N_CN_MA']);
                var chaId = layCot(m, CHA.ID), chaTen = layCot(m, CHA.TEN), chaMa = layCot(m, CHA.MA);
                if (CHA.ID.some(function (k) { return k in m; })) coCotCha = true;
                var coCha = !!chaId && chaId !== cnId;
                var nKhoa = nut(goc, 1, khoaId || khoaTen, khoaTen || '(Chưa gán khoa)', khoaMa, khoaId);
                var nNganh = nut(nKhoa, 2, (coCha ? chaId : cnId) || (coCha ? chaTen : cnTen), (coCha ? chaTen : cnTen) || '(Chưa gán ngành)', coCha ? chaMa : cnMa, coCha ? chaId : cnId);
                var chua = coCha ? nut(nNganh, 3, cnId || cnTen, cnTen || '(Chưa gán chuyên ngành)', cnMa, cnId) : nNganh;
                chua.ct.push(r); dem[3]++;
            });
            if (!coCotCha) console.warn('LayDSKS_DaoTao_ToChucCT chưa trả QUANHECHA_ID/MA/TEN: cây chỉ có Khoa → Ngành (N_CN) → Chương trình.');
            function sapNut(con) { return Object.keys(con).map(function (k) { return con[k]; }).sort(function (a, b) { return a.ten.localeCompare(b.ten, 'vi', { numeric: true }); }); }
            var ICO = ['', 'fa-building-columns', 'fa-diagram-project', 'fa-code-branch'];
            function la(c) {
                return '<li class="cthp-cay__nut cthp-cay__la"><div class="cthp-cay__dong"><i class="fa-light fa-graduation-cap cthp-cay__ico"></i>' +
                    '<span class="cthp-cay__ten">' + ui.esc(e(c.TENCHUONGTRINH)) + (e(c.DAOTAO_KHOADAOTAO_TEN) ? ' <span class="cthp-cay__phu">· Khóa: ' + ui.esc(c.DAOTAO_KHOADAOTAO_TEN) + '</span>' : '') + '</span>' +
                    '<span class="cthp-cay__nutct">' + ui.btn('edit', { text: 'Cập nhật CTDT', cls: 'ums-btn--sm', attr: { 'data-sua': e(c.ID) } }) +
                    ui.btn('view', { text: 'Xem CTDT', cls: 'ums-btn--sm', attr: { 'data-view': e(c.ID) } }) + '</span></div></li>';
            }
            function nhanh(n, lv) {
                return '<li class="cthp-cay__nut cthp-cay__lv' + lv + (lv <= 2 ? ' is-open' : '') + '"><div class="cthp-cay__dong cthp-cay__dong--mo">' +
                    '<i class="fa-light fa-chevron-right cthp-cay__caret"></i><i class="fa-light ' + ICO[lv] + ' cthp-cay__ico"></i>' +
                    '<span class="cthp-cay__ten">' + ui.esc(n.ten) + (n.ma ? ' <span class="cthp-cay__ma">(' + ui.esc(n.ma) + ')</span>' :
                        (lv === 1 && n.id ? ' <span class="cthp-cay__ma" data-khoa-id="' + ui.esc(n.id) + '"></span>' : '')) + '</span>' +
                    ui.badge(n.so + ' CT', 'info') + '</div><ul>' +
                    sapNut(n.con).map(function (c) { return nhanh(c, lv + 1); }).join('') +
                    n.ct.slice().sort(function (a, b) { return e(a.TENCHUONGTRINH).localeCompare(e(b.TENCHUONGTRINH), 'vi', { numeric: true }); }).map(la).join('') + '</ul></li>';
            }
            var dsKhoa = sapNut(goc.con);
            host.innerHTML = '<ul class="cthp-cay__goc">' + dsKhoa.map(function (k) { return nhanh(k, 1); }).join('') + '</ul>';
            z('cayTong').textContent = '— ' + dem[0] + ' khoa · ' + dem[1] + ' ngành · ' + (dem[2] ? dem[2] + ' chuyên ngành · ' : '') + dem[3] + ' chương trình';
            // Khoa quản lý chưa có mã trong dữ liệu → tra từ danh mục cơ cấu tổ chức
            if (dsKhoa.some(function (k) { return k.id && !k.ma; })) dienMaKhoa();
        }
        function dienMaKhoa() {
            function dien() {
                Array.prototype.forEach.call(z('cay').querySelectorAll('.cthp-cay__ma[data-khoa-id]'), function (s) {
                    var ma = cay.maKhoa[String(s.getAttribute('data-khoa-id')).toUpperCase()];
                    if (ma) s.textContent = '(' + ma + ')';
                });
            }
            if (cay.maKhoa) { dien(); return; }
            ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }).then(function (ds) {
                cay.maKhoa = {};
                (ds || []).forEach(function (x) { cay.maKhoa[String(x.ID).toUpperCase()] = x.MA; });
                dien();
            }).catch(function () {});
        }

        /* Bảng danh sách — đúng các cột bản gốc khai trong genBox_ChuongTrinh:
           Tên · Mã · Khóa · Ngành · Khoa quản lý · Xem. Bản gốc lấy về TẤT CẢ
           (pageSize 240000) rồi cắt trang ở máy trạm, giữ nguyên cách đó. */
        function draw(p) {
            page = p;
            var rows = dsCT.slice((p - 1) * SIZE, p * SIZE);
            var pg = {
                index: p, size: SIZE, total: dsCT.length,
                onChange: function (n) {
                    if (n >= 1 && n <= Math.ceil(dsCT.length / SIZE)) draw(n);
                },
                onSize: function (v) { SIZE = v; draw(1); }
            };
            if (KHCT) {
                /* genBox_ChuongTrinh của KHCT: hộp Tên (đậm) · Mã · Khóa · Ngành · Khoa quản lý
                   + hai nút "Cập nhật CTDT" / "Xem CTDT". Bấm thân hộp = mở vùng soạn (btnView). */
                pg.sizes = [24, 48, 96, 'all'];
                pat.cards({
                    el: z('tbl'), items: rows, empty: 'Không tìm thấy chương trình', page: pg, cls: 'cthp-the',
                    render: function (x) {
                        return '<b class="ums-card__no">' + ui.esc(e(x.TENCHUONGTRINH)) + '</b>' +
                            pat.cardRow('Mã', x.MACHUONGTRINH) + pat.cardRow('Khóa', x.DAOTAO_KHOADAOTAO_TEN) +
                            pat.cardRow('Ngành', x.DAOTAO_N_CN_TEN) + pat.cardRow('Khoa quản lý', x.DAOTAO_KHOAQUANLY_TEN);
                    },
                    actions: function (x) {
                        return ui.btn('edit', { text: 'Cập nhật CTDT', cls: 'ums-btn--sm', attr: { 'data-sua': e(x.ID) } }) +
                            ui.btn('view', { text: 'Xem CTDT', cls: 'ums-btn--sm', attr: { 'data-view': e(x.ID) } });
                    },
                    onPick: function (x) { sua(x.ID); }
                });
                return;
            }
            ui.table({
                el: z('tbl'), rows: rows,        // Stt do ums.ui.table tự đánh theo trang
                empty: 'Không tìm thấy chương trình',
                page: pg,
                columns: [
                    { title: 'Tên', prop: 'TENCHUONGTRINH' },
                    { title: 'Mã', prop: 'MACHUONGTRINH', cls: 'is-nowrap' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
                    { title: 'Ngành', prop: 'DAOTAO_N_CN_TEN' },
                    { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
                    { title: 'Xem', cls: 'is-center', width: '64px', render: function (x) {
                        return '<button type="button" class="ums-iconbtn" data-view="' + ui.esc(x.ID) +
                            '" title="Xem chương trình"><i class="fa-light fa-eye"></i></button>';
                    } }
                ]
            });
        }

        /* ---------- Đổi vùng (edu.util.toggle_overide "zone-content") -------- */
        function khu(k) { return root.querySelector('[data-khu="' + k + '"]'); }
        function hien(k) {
            var den = khu(k);
            if (!den) return;
            var cur = Array.prototype.filter.call(root.querySelectorAll(':scope > [data-khu]'), function (x) { return !x.hidden; })[0];
            if (cur === den) return;
            if (cur) ui.swap(cur, den); else den.hidden = false;
        }

        /* ---------- Khung xem chương trình --------------------------------- */
        function khct(action, extra) {
            var x = { action: action, type: 'POST', strTuKhoa: '' };
            Object.keys(extra).forEach(function (k) { x[k] = extra[k]; });
            x.strNguoiThucHien_Id = '';
            x.pageIndex = 1;
            x.pageSize = 100000;
            x.iM = ums.session.iM;            // bản gốc truyền iM (không func) — xem đầu tệp
            return ums.api.call(x).then(rowsOf);
        }

        function timCT(id) { return dsCT.filter(function (x) { return x.ID === id; })[0]; }

        function khongThay() { ui.toast('Không tìm thấy chương trình trong danh sách đã tải. Vui lòng bấm Tìm kiếm để tải lại.', 'warn'); }
        function sua(id) {
            var c = timCT(id);
            if (!c) { khongThay(); return; }
            if (!o.onSua) return;
            token = null;
            o.onSua(c, api);
        }

        function openCT(id) {
            ct = timCT(id);
            if (!ct) { khongThay(); return; }
            var tk = token = {};
            z('info').innerHTML = '<h3>' + ui.esc(ct.TENCHUONGTRINH) + '</h3>' +
                '<div>Mã: <b>' + ui.esc(ct.MACHUONGTRINH) + '</b></div>' +
                '<div>Số tín chỉ quy định theo chương trình: <b>' + ui.esc(ct.TONGSOTINCHIQUYDINH) + '</b></div>' +
                '<div>Số tín chỉ theo khối khai báo: <b>' + ui.esc(ct.TONGSOTINCHITHEOKHOIKT) + '</b></div>' +
                '<div>Tổng số SV còn đang học / Tổng số: <b>' + ui.esc(e(ct.SODANGHOC)) + ' / ' + ui.esc(e(ct.TONGSOSV)) + '</b></div>';
            ['dinhHuong', 'batBuoc', 'tuChon'].forEach(function (k) { z(k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); });
            z('vtitle').textContent = 'Chương trình học phần — ' + e(ct.TENCHUONGTRINH);
            hien('view');

            khct('KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong', { strDaoTao_ChuongTrinh_Id: id }).then(function (rows) {
                if (token !== tk) return;
                var cols = [
                    { title: 'Mã định hướng', prop: 'MA', cls: 'is-center' },
                    { title: 'Tên định hướng', prop: 'TEN' },
                    { title: 'Người học', prop: 'SOSV', cls: 'is-center' }
                ];
                if (KHCT) cols.push({ title: 'Khối kiến thức', cls: 'is-center', width: '120px', render: function (x) {
                    return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-kkt': e(x.ID) } });
                } });
                ui.table({ el: z('dinhHuong'), rows: rows, columns: cols });
            }).catch(function (err) { z('dinhHuong').innerHTML = ui.fail(err.message); ums.api.handle(err, 'định hướng'); });

            loadKhoi(tk, 'batBuoc',
                khct('KHCT_ThongTin/LayDSKS_DaoTao_KhoiBatBuoc', { strDaoTao_KhoiBatBuoc_Cha_Id: '', strDaoTao_ToChucCT_Id: id }),
                function (k) {
                    return khct('KHCT_ThongTin/LayDSKS_DaoTao_HP_KhoiBatBuoc', { strDaoTao_HocPhan_Id: '', strDaoTao_ToChucCT_Id: id, strDaoTao_KhoiBatBuoc_Id: k.ID });
                },
                'DAOTAO_KHOIBATBUOC_ID', 'TONGSOTINCHI', 'TONGSOTINCHITINHPHI');

            loadKhoi(tk, 'tuChon',
                khct('KHCT_ThongTin/LayDSKS_DaoTao_KhoiTuChon_Don', { strLoaiLuaChon_Id: '', strDaoTao_KTuChon_Don_Cha_Id: '', strDaoTao_ToChucCT_Id: id }),
                function (k) {
                    return khct('KHCT_ThongTin/LayDSKS_DaoTao_HP_KTuChon_Don', { strDaoTao_HocPhan_Id: '', strDaoTao_ToChucCT_Id: id, strDaoTao_KTuChon_Don_Id: k.ID });
                },
                'DAOTAO_KHOITUCHON_DON_ID', 'SOTINCHIQUYDINH', 'SOTINCHIPHIQUYDINH');
        }

        /* KHCT: hộp "Khối kiến thức" của một định hướng (getList_VKhoiKienThuc) */
        function xemKKT(dhId) {
            var dlg = ui.dialog({
                title: 'Khối kiến thức', icon: 'fa-book-open-reader', size: 'lg',
                body: '<div data-kkt-bang>' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { return false; } }]
            });
            var nut = dlg.el.querySelector('[data-dlg="0"]');
            if (nut) { nut.disabled = true; nut.title = 'Bản gốc không có xử lý cho nút này'; }
            var host = dlg.body.querySelector('[data-kkt-bang]');
            khct('KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong_KKT', { strDaoTao_ChuongTrinh_Id: ct ? ct.ID : '', strDaoTao_CT_DinhHuong_Id: dhId })
                .then(function (rows) {
                    ui.table({ el: host, rows: rows, empty: 'Không có khối kiến thức', columns: [
                        { title: 'Mã khối', prop: 'DAOTAO_KHOIKIENTHUC_MA', cls: 'is-nowrap' },
                        { title: 'Tên khối', prop: 'DAOTAO_KHOIKIENTHUC_TEN' },
                        { title: 'Loại khối', prop: 'LOAIKHOIKIENTHUC' }
                    ] });
                }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối kiến thức của định hướng'); });
        }

        /* Nạp khối rồi học phần từng khối (bản gốc: genHTML_Progress + start_Progress) */
        function loadKhoi(tk, zone, pKhoi, hpCall, fk, colTin, colTinPhi) {
            pKhoi.then(function (khoi) {
                return Promise.all(khoi.map(function (k) {
                    return hpCall(k).catch(function (err) { ums.api.handle(err, 'học phần của khối'); return []; });
                })).then(function (hps) {
                    if (token !== tk) return;
                    var all = [].concat.apply([], hps);
                    drawKhoi(z(zone), khoi, all, fk, colTin, colTinPhi);
                });
            }).catch(function (err) { z(zone).innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối kiến thức'); });
        }

        /* Bảng khối × học phần — bố cục chung ums.pat.groupTable (thay
           edu.system.actionRowSpan): 5 cột của KHỐI gộp ô theo số học phần,
           các cột còn lại là của từng học phần. Dòng tổng ở ums-tablefoot. */
        function drawKhoi(el, khoi, hp, fk, colTin, colTinPhi) {
            var tong = 0, tongPhi = 0, sumHT = 0, sumHP = 0;
            var groups = khoi.map(function (k) {
                tong += Number(k[colTin]) || 0;
                tongPhi += Number(k[colTinPhi]) || 0;
                var rows = hp.filter(function (h) { return h[fk] === k.ID; });
                rows.forEach(function (h) {
                    sumHT += Number(String(e(h.HOCTRINHAPDUNGHOCTAP)).replace(/,/g, '')) || 0;
                    sumHP += Number(String(e(h.HOCTRINHAPDUNGTINHHOCPHI)).replace(/,/g, '')) || 0;
                });
                return { row: k, rows: rows };
            });

            pat.groupTable({
                el: el, stt: true, empty: 'Không có học phần',
                head: [[{ title: 'Thông tin khối kiến thức', colspan: 5 }, { title: 'Thông tin khối học phần', colspan: 9 }]],
                groupCols: [
                    { title: 'Mã khối', prop: 'KYHIEU', cls: 'is-center' },
                    { title: 'Tên khối', prop: 'TEN' },
                    { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
                    { title: 'Tổng số tín học tập', prop: colTin, cls: 'is-center' },
                    { title: 'Tổng số tín học phí', prop: colTinPhi, cls: 'is-center' }
                ],
                cols: [
                    { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Tên tiếng Anh', prop: 'DAOTAO_HOCPHAN_TEN_TA' },
                    { title: 'Số tín học tập', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' },
                    { title: 'Số tín học phí', prop: 'HOCTRINHAPDUNGTINHHOCPHI', cls: 'is-center' },
                    { title: 'Môn tính điểm', prop: 'LAMONTINHDIEMTHEOCHUONGTRINH', cls: 'is-center' },
                    { title: 'Thuộc tính', prop: 'THUOCTINHHOCPHAN_TEN', cls: 'is-center' },
                    { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' }
                ],
                groups: groups,
                foot: '<span>Tổng</span><span class="ums-tablefoot__sum">' +
                    pat.footSum('Tín học tập (khối)', tong) + pat.footSum('Tín học phí (khối)', tongPhi) +
                    pat.footSum('Tín học tập (học phần)', sumHT) + pat.footSum('Tín học phí (học phần)', sumHP) + '</span>'
            });
        }

        root.addEventListener('click', function (ev) {
            if (KHCT) {
                var kt = ev.target.closest('[data-kieu]');
                if (kt && root.contains(kt)) { doiKieu(kt.getAttribute('data-kieu')); return; }
                var ca = ev.target.closest('[data-cay]');
                if (ca && root.contains(ca)) {
                    Array.prototype.forEach.call(z('cay').querySelectorAll('.cthp-cay__nut:not(.cthp-cay__la)'), function (li) { li.classList.toggle('is-open', ca.getAttribute('data-cay') === 'mo'); });
                    return;
                }
                var dong = ev.target.closest('.cthp-cay__dong--mo');
                if (dong && root.contains(dong) && !ev.target.closest('button')) { dong.parentNode.classList.toggle('is-open'); return; }
            }
            var t = ev.target.closest('[data-sua]');
            if (t && root.contains(t)) { sua(t.getAttribute('data-sua')); return; }
            var v = ev.target.closest('[data-view]');
            if (v && root.contains(v)) { openCT(v.getAttribute('data-view')); return; }
            var k = ev.target.closest('[data-kkt]');
            if (k && root.contains(k)) { xemKKT(k.getAttribute('data-kkt')); return; }
            var b = ev.target.closest('[data-a]');
            if (!b || !root.contains(b)) return;
            /* Bẫy màn con trong trang (BO-CUC luật 1): các vùng KHCT (sua, kq, hp, kbb, ktcd, dh — K.vung) là con của root và cũng
               dùng data-a="dong"; không chặn thì Đóng ở tầng trong nổi bọt tới đây → hien('list') nhảy thẳng ra danh sách (người dùng 20/10). */
            var kz = b.closest('[data-khu]');
            if (kz && kz.getAttribute('data-khu') !== 'list' && kz.getAttribute('data-khu') !== 'view') return;
            var a = b.getAttribute('data-a');
            if (a === 'search') search();
            else if (a === 'dong') { token = null; ct = null; hien('list'); }
        });
        f('tuKhoa').addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); search(); }
        });

        var api = {
            root: root,
            hien: hien,
            khu: khu,
            /** Hệ đang chọn ở thanh lọc (bản gốc KHCT đọc dropSearch_HeDaoTao ở nhiều chỗ) */
            he: function () { return f('he').value; },
            /** Tải lại danh sách chương trình (sau khi kế thừa…) */
            search: search,
            timCT: timCT
        };
        return api;
    };

    /* Màn Tài chính / Cổng cán bộ: tự chạy. Màn KHCT (data-khct) tự gọi ums.cthp.man. */
    var r = document.getElementById('cthp');
    if (r && !r.hasAttribute('data-khct')) ums.cthp.man(r, {});
})();
