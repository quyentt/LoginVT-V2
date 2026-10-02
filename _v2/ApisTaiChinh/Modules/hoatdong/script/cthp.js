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
                pat.panel({
                    title: 'Danh sách chương trình', icon: KHCT ? 'fa-books' : 'fa-laptop-file', count: 'ctCount',
                    flush: !KHCT, zone: 'tbl', body: ''
                }) +
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
            }).catch(function (err) { z('tbl').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách chương trình'); });
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

        function sua(id) {
            var c = timCT(id);
            if (!c || !o.onSua) return;
            token = null;
            o.onSua(c, api);
        }

        function openCT(id) {
            ct = timCT(id);
            if (!ct) return;
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
            var t = ev.target.closest('[data-sua]');
            if (t && root.contains(t)) { sua(t.getAttribute('data-sua')); return; }
            var v = ev.target.closest('[data-view]');
            if (v && root.contains(v)) { openCT(v.getAttribute('data-view')); return; }
            var k = ev.target.closest('[data-kkt]');
            if (k && root.contains(k)) { xemKKT(k.getAttribute('data-kkt')); return; }
            var b = ev.target.closest('[data-a]');
            if (!b || !root.contains(b)) return;
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
