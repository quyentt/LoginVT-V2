/* =========================================================================
   Thi phách — LẬP DANH SÁCH CHẤM KIỂM TRA (khung chung của hai màn)
   ums.tpCham.man(root, cfg)
   Bản gốc: ApisThiPhach/Modules/kehoach/script/chamkiemtradst.js  (theo DANH SÁCH THI — lớp ChamKiemTra)
            ApisThiPhach/Modules/kehoach/script/champhach.js       (theo TÚI / PHÁCH   — lớp ChamPhach)
   Hai tệp gốc chép nhau từng dòng; chỗ lệch thật sự chỉ có: sáu action, tham số ba lời gọi danh sách, cột bảng,
   và bản danh sách thi có thêm ô "hoàn thành nhập điểm".
   Bước sau của quy trình: ApisCongCanBo/nhapdiem/nhapdiemchamkiemtra (nhập điểm chấm kiểm tra).
   ---------------------------------------------------------------------------
   cfg = {
     tieuDe,
     kieu: 'dst' | 'tui',
     ds: { ds, nn, kq }    action của ba nút: Lấy theo danh sách / Lấy ngẫu nhiên / Xem kết quả   (GET)
     them, xoa             action Lưu / Xóa — mỗi dòng đánh dấu MỘT lời gọi POST { strId, strNguoiThucHien_Id }
     cot                   cột bảng (ums.ui.table), chưa gồm cột ô đánh dấu
   }
   Lời gọi (kiểu cũ, KHÔNG func, KHÔNG iM — chép nguyên):
     Bộ lọc  TP_Chung/LayThoiGian → LayLoaiDiem → LayHinhThucThi → LayDotThi → LayHocPhan (GET) — dùng ums.nd.locThi của
             Cổng cán bộ (nhapdiem/script/_chung.js, nạp chéo): cùng action, cùng tên tham số với bản gốc màn này.
     kieu 'dst' — cả BA nút gửi cùng bộ tham số:
             strTuKhoa, dLocKhongHoanThanhNhapDiem (0 | 1), strThi_DotThi_Id, strDaoTao_HocPhan_Id, strNguoiThucHien_Id,
             dTyLePhanTram (ô trống → -1)
     kieu 'tui' — strDotThi_Id (KHÁC tên bản dst), strDaoTao_HocPhan_Id, strNguoiThucHien_Id;
             riêng "Lấy ngẫu nhiên" thêm dTyLePhanTram (ô trống → -1)
     Báo cáo / Import: ums.report.mount — strThoiGian_Id, strLoaiDiem_Id, strThi_DotThi_Id, strDaoTao_HocPhan_Id,
             strDanhSachThi_Id ('' — bản gốc đọc me.strTuiBai_Id không nơi nào gán), rồi strDanhSachThi_Id cho TỪNG dòng đánh dấu
   Giữ như gốc:
     · Mở màn KHÔNG tải danh sách; đổi ô lọc KHÔNG tự tải — bấm một trong ba nút.
     · Lưu / Xóa xong tải lại theo ĐÚNG nút vừa bấm gần nhất (dAction của gốc; chưa bấm nút nào = "Lấy theo danh sách").
     · Nút Lưu và Xóa luôn dùng được ở cả ba chế độ (gốc không phân biệt).
     · Không phân trang (gốc chú thích bỏ bPaginate); số đếm cạnh tiêu đề = Pager máy chủ trả, thiếu thì số dòng.
   Không chép (lỗi rõ / mã chết của bản gốc):
     · $("#btnYes").click gắn lại MỖI lần bấm Lưu / Xóa → lần bấm thứ n gửi n lượt lời gọi. Ở đây mỗi lần một lượt.
     · Mọi dòng xong đều tải lại danh sách (start_Progress gọi lại cho từng dòng) → tải lại MỘT lần sau cả lô.
     · Khối xác nhận (D_XacNhan/*, D_HanhDongXacNhan/*), getList_TuiThi (TP_Chung/LayDSTuiTheoDotPhach, ô dropSearch_DSThi),
       .btnAdd / .btnClose, arrValid (txt…_So): html gốc không có phần tử nào tương ứng → không lối vào, bỏ.
     · Bản dst: cột "Điểm" gốc vẽ Ô NHẬP (txtDiem<ID>) nhưng không lời gọi nào đọc ô này (Lưu chỉ gửi strId) → hiện chữ,
       để người dùng không tưởng sửa điểm ở đây là lưu được. Nhập điểm chấm kiểm tra làm ở màn bước sau.
     · Bản tui: html gốc có ô "Nhập từ khóa tìm kiếm" nhưng không lời gọi nào gửi strTuKhoa → bỏ ô (giữ thì gõ không có tác dụng).
   Khác gốc theo luật chung:
     · Ô con khoá tới khi chọn ô cha (Thời gian → Loại điểm → Hình thức → Đợt thi → Môn thi); gốc mở màn nạp sẵn mọi ô
       với tham số cha rỗng. Đổi / xoá ô lọc thì bảng về lời nhắc (không để danh sách của lựa chọn cũ).
     · Xóa = ums.ui.xoaChon; nút báo cáo lên đầu trang.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var T = ums.tpCham = ums.tpCham || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    var CHE = { ds: 'Lấy theo danh sách', nn: 'Lấy ngẫu nhiên', kq: 'Xem kết quả' };
    var NHAC = 'Chọn đợt thi, môn thi rồi bấm "Lấy ngẫu nhiên", "Lấy theo danh sách" hoặc "Xem kết quả"';

    /* Cột của hai bản — chép nguyên mDataProp của genTable_* */
    T.COT = {
        dst: [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
            { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
            { title: 'Điểm thành phần', prop: 'DIEM_THANHPHANDIEM_TEN', cls: 'is-nowrap' },
            { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
            { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
            { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' },
            { title: 'Điểm', prop: 'DIEMBANDAU', cls: 'is-center' },
            { title: 'Lớp đăng ký học', prop: 'DIEM_DANHSACHHOC_TEN', cls: 'is-nowrap' },
            { title: 'Danh sách thi', prop: 'THI_DANHSACHTHI_TEN', cls: 'is-nowrap' },
            { title: 'Học phần', cls: 'is-nowrap', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_MA) + ' - ' + e(x.DAOTAO_HOCPHAN_TEN)); } }
        ],
        tui: [
            { title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' },
            { title: 'Điểm', prop: 'DIEMBANDAU', cls: 'is-center' },
            { title: 'Mức vi phạm', prop: 'THONGTINXULY' }
        ]
    };

    T.man = function (root, cfg) {
        if (!root) return;
        var dst = cfg.kieu === 'dst';
        var loc = [{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'ld', type: 'select', label: 'Chọn loại điểm' },
            { key: 'ht', type: 'select', label: 'Chọn hình thức' }, { key: 'dot', type: 'select', label: 'Chọn đợt thi' },
            { key: 'mon', type: 'select', label: 'Chọn môn thi' }];
        if (dst) loc.push({ key: 'hoan', type: 'select', label: 'Chọn hoàn thành nhập điểm', required: true }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' });
        loc.push({ key: 'pt', label: 'Phần trăm bài thi cần lấy' });

        root.innerHTML = pat.page(cfg.tieuDe, '<span data-z="bc"></span>') +
            pat.filterBar(loc, { search: false, extra: '<div class="ums-field tpcham-nut">' +
                ui.btn('search', { text: CHE.nn, icon: 'fa-shuffle', attr: { 'data-a': 'nn' } }) +
                ui.btn('search', { text: CHE.ds, icon: 'fa-list-check', mod: 'out-primary', attr: { 'data-a': 'ds' } }) +
                ui.btn('search', { text: CHE.kq, mod: 'out-primary', attr: { 'data-a': 'kq' } }) + '</div>' }) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
                tools: ui.btn('save', { attr: { 'data-a': 'luu' } }) + ui.xoaChon('input[data-ck]', { attr: { 'data-a': 'xoa' } }) });
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? f(k).value.trim() : ''; }
        if (dst) f('hoan').innerHTML = '<option value="0">Chọn hoàn thành nhập điểm</option><option value="1">Hoàn thành nhập điểm</option>';
        f('pt').setAttribute('inputmode', 'decimal');
        ui.enhance(root);

        var DS = [], che = 'ds', soHieu = 0;

        function nhac() {
            soHieu++; DS = [];
            z('n').textContent = '';
            z('bang').innerHTML = ui.empty(NHAC, 'fa-hand-pointer');
        }
        function thamSo(k) {
            var pt = v('pt') ? v('pt') : -1;
            if (dst) return { strTuKhoa: v('q'), dLocKhongHoanThanhNhapDiem: v('hoan'), strThi_DotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon'),
                strNguoiThucHien_Id: uid(), dTyLePhanTram: pt };
            var o = {};
            if (k === 'nn') o.dTyLePhanTram = pt;
            o.strDotThi_Id = v('dot'); o.strDaoTao_HocPhan_Id = v('mon'); o.strNguoiThucHien_Id = uid();
            return o;
        }
        function tai(k) {
            if (k) che = k;
            var sh = ++soHieu;
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(Object.assign({ action: cfg.ds[che], method: 'GET' }, thamSo(che))).then(function (r) {
                if (sh !== soHieu) return;
                DS = arr(r.data);
                var tong = r.pager === null || r.pager === undefined || r.pager === '' ? DS.length : r.pager;
                z('n').textContent = '(' + ui.so(tong) + ') · ' + CHE[che];
                ui.table({ el: z('bang'), rows: DS, empty: 'Không có dữ liệu', columns: cfg.cot.concat([
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                        render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }]) });
            }).catch(function (err) {
                if (sh !== soHieu) return;
                z('n').textContent = '';
                z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách chấm kiểm tra');
            });
        }
        function daChon() {
            return Array.prototype.filter.call(z('bang').querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                .map(function (c) { return DS[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
        }
        function ghi(action, chon, o) {
            return ui.batch(chon.map(function (x) { return { action: action, method: 'POST', strId: x.ID, strNguoiThucHien_Id: uid() }; }),
                { title: o.title, okText: o.ok, concurrency: 5, show: true }).then(function () { return tai(); });
        }
        function luu() {
            var chon = daChon();
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn lưu dữ liệu không? (' + chon.length + ' dòng đã chọn)', { title: 'Lưu danh sách chấm kiểm tra' }).then(function (yes) {
                if (yes) ghi(cfg.them, chon, { title: 'Đang lưu', ok: 'Thực hiện thành công' });
            });
        }
        function xoa() {
            var chon = daChon();
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không? (' + chon.length + ' dòng đã chọn)', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (yes) ghi(cfg.xoa, chon, { title: 'Đang xoá', ok: 'Xóa thành công' });
            });
        }

        ums.nd.locThi({ f: f, tenMon: function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, onDoi: nhac });

        ums.report.mount(z('bc'), { collect: function (add) {
            add('strThoiGian_Id', v('tg'));
            add('strLoaiDiem_Id', v('ld'));
            add('strThi_DotThi_Id', v('dot'));
            add('strDaoTao_HocPhan_Id', v('mon'));
            add('strDanhSachThi_Id', '');
            daChon().forEach(function (x) { add('strDanhSachThi_Id', x.ID); });
        }, onImported: function () { if (DS.length) tai(); } });

        nhac();
        root.addEventListener('change', function (ev) {
            if (ev.target.getAttribute && ev.target.getAttribute('data-ck') === 'all')
                Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || b.disabled) return;
            var a = b.getAttribute('data-a');
            if (a === 'ds' || a === 'nn' || a === 'kq') tai(a);
            else if (a === 'luu') luu();
            else if (a === 'xoa') xoa();
        });
        return { tai: tai };
    };
})();
