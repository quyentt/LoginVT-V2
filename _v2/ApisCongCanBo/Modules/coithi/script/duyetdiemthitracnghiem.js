/* =========================================================================
   Phê duyệt điểm — Duyệt điểm thi trắc nghiệm (cổng cán bộ)
   Bản gốc: ApisCongCanBo/Modules/coithi/html/duyetdiemthitracnghiem.html + script/duyetdiemthitracnghiem.js
   ---------------------------------------------------------------------------
   Năm tab = năm mức phê duyệt của phòng thi. Mỗi tab một thanh lọc riêng (như gốc):
     Đơn vị (QLTTN_ThongTin/LayDS_DonViByUserId — KHÔNG phải bản _GST) · Học kỳ (QLTTN_QuanLyThi/LayDS_HocKy,
     giá trị = tên = SEMESTER) → Đợt thi (LayDS_DoThiByHocKy strStatus '1', strHocKy) · Từ ngày · Đến ngày · Từ khoá
     Danh sách: QLTTN_QuanLyThi/LayDS_PhongThi_MucPheDuyet GET strMucPheDuyet theo tab, strStatus '', phân trang.
       tab 1 GVCOITHICONGNHAN "Phòng thi đã xong"          Phê duyệt → KHAOTHICONGNHAN
       tab 2 KHAOTHICONGNHAN  "Phòng thi khảo thí duyệt"   Không → GVCOITHICONGNHAN · Phê duyệt → GIAOVUCONGNHAN
                                                            (→ DIEMDADUOCCONGNHAN khi chỉ có 3 mức, xem dưới)
       tab 3 GIAOVUCONGNHAN   "Giáo vụ duyệt"              Không → KHAOTHICONGNHAN · Phê duyệt → DAOTAOCONGNHAN
       tab 4 DAOTAOCONGNHAN   "Phòng thi đào tạo duyệt"    Không → GIAOVUCONGNHAN  · Phê duyệt → DIEMDADUOCCONGNHAN
       tab 5 DIEMDADUOCCONGNHAN "Phòng thi đã chốt điểm"   (chỉ xem, không cột đánh dấu)
     Chuyển mức: Update_PhongThi_MucPheDuyet POST (ums.coiThi.mucPheDuyet).
     LayDS_MucPheDuyet: có đúng 3 dòng LOAIPHEDUYET = PHEDUYETDIEM → ẩn tab 3, 4.
   Chi tiết phòng (bản gốc modal "Phòng thi"): chỉ khối "Thông tin phòng thi"; phần thi (LayDS_ExamStructPart
     theo EXAMSTRUCTID của LayDS_ExamRoomInfoDetail); thí sinh LayDS_ChiTietPhongThi_KetQua strCoTinhLaiDiem '1',
     PHÂN TRANG máy chủ (gốc bật bPaginate ở màn này); báo cáo BAOCAODIEM → ums.coiThi.baoCao.
   Khác bản gốc (ghi ở can-quyet.js):
     · Ô Điểm công nhận / Ghi chú ở bảng thí sinh: gốc là ô nhập nhưng KHÔNG có nút lưu (save_PheDuyetDiem,
       nút Chuyển điểm không có trong html) → hiện dạng chữ.
     · Gốc dùng CHUNG một biến danh sách phòng cho cả năm tab: nạp tab này rồi bấm "Chi tiết" ở tab khác là
       lỗi JS → mỗi tab giữ danh sách riêng. Phân trang tab 3 gốc gọi hàm của tab 2 → sửa.
     · Học kỳ → Đợt thi: khoá theo luật cha → con (gốc nạp sẵn mọi đợt thi khi chưa chọn học kỳ).
     · Nút "Chuyển" gốc hẹn giờ 2 giây nạp lại kể cả khi bấm Huỷ → nạp lại sau khi chuyển xong.
   Bản Quản lý thi trắc nghiệm (thẻ gốc data-kieu="qlttn" — ApisQuanLyThiTracNghiem/modules/pheduyetdiem, bản CŨ hơn của màn này):
     · KHÔNG gọi LayDS_MucPheDuyet: luôn đủ 5 tab, tab 2 "Phê duyệt" luôn → GIAOVUCONGNHAN.
     · Nút tab 1 mang chữ "Chuyển" (như html gốc). Báo cáo mở theo URL báo cáo của hệ thống (edu.system.rootPathReport).
     · Gốc gửi strUngDung_Id = edu.system.strUngDung_Id — biến KHÔNG tồn tại trong Corei (luôn rỗng) → gửi vai trò như bản này.
     · Gốc không đổ Đơn vị / Học kỳ cho tab 3 (renderPlace bỏ sót) → nay đổ đủ. Tab 5 gốc có cột đánh dấu mà không nút nào dùng → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }
    var root = document.getElementById('coithi-duyetdiemthitracnghiem');
    if (!root) return;
    var QLTTN = root.getAttribute('data-kieu') === 'qlttn';

    var baMuc = false;   // chỉ 3 mức phê duyệt: tab 2 duyệt thẳng sang "đã chốt điểm"
    var TAB = [
        { key: 't1', text: 'Phòng thi đã xong', muc: 'GVCOITHICONGNHAN', duyet: 'KHAOTHICONGNHAN' },
        { key: 't2', text: 'Phòng thi khảo thí duyệt', muc: 'KHAOTHICONGNHAN', khong: 'GVCOITHICONGNHAN', duyet: function () { return baMuc ? 'DIEMDADUOCCONGNHAN' : 'GIAOVUCONGNHAN'; } },
        { key: 't3', text: 'Giáo vụ duyệt', muc: 'GIAOVUCONGNHAN', khong: 'KHAOTHICONGNHAN', duyet: 'DAOTAOCONGNHAN' },
        { key: 't4', text: 'Phòng thi đào tạo duyệt', muc: 'DAOTAOCONGNHAN', khong: 'GIAOVUCONGNHAN', duyet: 'DIEMDADUOCCONGNHAN' },
        { key: 't5', text: 'Phòng thi đã chốt điểm', muc: 'DIEMDADUOCCONGNHAN' }
    ];
    var LOC = [
        { key: 'dv', type: 'select', label: 'Chọn đơn vị' }, { key: 'hk', type: 'select', label: 'Chọn học kỳ' },
        { key: 'dot', type: 'select', label: 'Chọn đợt thi' }, { key: 'tu', type: 'date', label: 'Từ ngày' },
        { key: 'den', type: 'date', label: 'Đến ngày' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
    ];
    function nutTab(t) {
        if (!t.duyet) return '';
        return '<div class="ums-field ums-field--fit">' +
            (t.khong ? ui.btn('del', { text: 'Không phê duyệt', icon: 'fa-xmark', mod: 'out-danger', attr: { 'data-a': 'khong' } }) + ' ' : '') +
            ui.btn('save', { text: QLTTN && t.key === 't1' ? 'Chuyển' : 'Phê duyệt', icon: 'fa-check', attr: { 'data-a': 'duyet' } }) + '</div>';
    }
    root.innerHTML =
        '<div data-z="list">' + pat.page('Phê duyệt điểm') +
            ui.tabs(TAB.map(function (t) { return { key: t.key, text: t.text }; }), 't1', 'data-xtab') +
            TAB.map(function (t) {
                return '<div data-pane="' + t.key + '"' + (t.key === 't1' ? '' : ' hidden') + '>' +
                    pat.filterBar(LOC, { extra: nutTab(t) }) +
                    pat.panel({ title: 'Danh sách phòng thi', icon: 'fa-screen-users', count: 'n', flush: true, zone: 'bang' }) + '</div>';
            }).join('') +
        '</div>' +
        '<div data-z="view" hidden></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function pane(k) { return root.querySelector('[data-pane="' + k + '"]'); }

    /* ---------- Mỗi tab: bộ lọc, danh sách riêng ------------------------- */
    var S = {};
    TAB.forEach(function (t) {
        var p = pane(t.key);
        var s = S[t.key] = { t: t, p: p, page: 1, size: 10, rows: [] };
        s.f = function (k) { return p.querySelector('[data-f="' + k + '"]'); };
        s.v = function (k) { return s.f(k) ? s.f(k).value.trim() : ''; };
        s.bang = p.querySelector('[data-z="bang"]');
        s.n = p.querySelector('[data-z="n"]');
        s.bang.innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-magnifying-glass');
        if (window.jQuery) {
            jQuery(s.f('hk')).on('select2:select', function () { napDotThi(s); })
                .on('select2:clear', function () { pat.fill(s.f('dot'), [], { head: 'Chọn đợt thi' }); });
            pat.chain([s.f('hk'), s.f('dot')], { phatLai: false });
        }
        s.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(s, 1); } });
        P.ganChonTatCa(p);
    });

    g('QLTTN_ThongTin/LayDS_DonViByUserId', { strUserId: P.uid() }).then(function (r) {
        TAB.forEach(function (t) { pat.fill(S[t.key].f('dv'), arr(r.data), { name: 'NAME', head: 'Chọn đơn vị' }); });
    }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
    g(QL + 'LayDS_HocKy', { strStatus: '1' }).then(function (r) {
        TAB.forEach(function (t) { pat.fill(S[t.key].f('hk'), arr(r.data), { id: 'SEMESTER', name: 'SEMESTER', head: 'Chọn học kỳ' }); });
    }).catch(function (err) { ums.api.handle(err, 'học kỳ'); });
    if (!QLTTN) g(QL + 'LayDS_MucPheDuyet', { versionAPI: V, strNguoiDung_Id: P.uid() }).then(function (r) {
        baMuc = arr(r.data).filter(function (x) { return x.LOAIPHEDUYET === 'PHEDUYETDIEM'; }).length === 3;
        ['t3', 't4'].forEach(function (k) { var a = root.querySelector('[data-xtab="' + k + '"]'); if (a) a.hidden = baMuc; });
    }).catch(function (err) { ums.api.handle(err, 'mức phê duyệt'); });

    function napDotThi(s) {
        return g(QL + 'LayDS_DoThiByHocKy', { strStatus: '1', strHocKy: s.v('hk') }).then(function (r) {
            pat.fill(s.f('dot'), arr(r.data), { name: 'NAME', head: 'Chọn đợt thi' });
        }).catch(function (err) { ums.api.handle(err, 'đợt thi'); });
    }

    function tai(s, page) {
        if (page) s.page = page;
        s.bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return g(QL + 'LayDS_PhongThi_MucPheDuyet', {
            versionAPI: V, strDonVi_Id: s.v('dv'), strHocKy: s.v('hk'), strDotThi_Id: s.v('dot'), strMucPheDuyet: s.t.muc,
            strStatus: '', strTuNgay: s.v('tu'), strDenNgay: s.v('den'), strTuKhoa: s.v('q'), strNguoiDung_Id: P.uid(),
            PageNumber: s.page, ItemPerPage: s.size
        }).then(function (r) {
            s.rows = arr(r.data);
            var tong = Number(r.pager) || s.rows.length;
            s.n.textContent = '(' + tong + ')';
            ui.table({ el: s.bang, rows: s.rows, columns: P.cotPhong({ chon: !!s.t.duyet }), empty: 'Không có phòng thi',
                page: { index: s.page, size: s.size, total: tong, onChange: function (pg) { tai(s, pg); }, onSize: function (n) { s.size = n; tai(s, 1); } } });
        }).catch(function (err) { s.bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phòng thi'); });
    }

    function chuyen(s, muc) {
        var ids = P.daChon(s.bang);
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần chuyển?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn chuyển dữ liệu không?', { title: 'Phê duyệt điểm', ok: 'Chuyển' }).then(function (yes) {
            if (!yes) return;
            P.mucPheDuyet(ids, typeof muc === 'function' ? muc() : muc).then(function () {
                ui.toast('Thực hiện chuyển thành công', 'ok');
                tai(s);
            }).catch(function (err) { ums.api.handle(err, 'chuyển mức phê duyệt'); });
        });
    }

    /* ---------- Chi tiết phòng: thay chỗ danh sách ----------------------- */
    function moChiTiet(s, id) {
        var room = s.rows.filter(function (x) { return e(x.ID) === id; })[0];
        if (!room) return;
        var view = z('view'), st = { page: 1, size: 10, rows: [] };
        view.innerHTML =
            '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Phòng thi — ' + esc(e(room.ROOMNAME)) + '</h1>' +
            '<div class="ums-page__actions">' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + '</div></div>' +
            P.thongTin(room, { de: false }) +
            pat.panel({ title: 'Danh sách thí sinh', icon: 'fa-users', count: 'tsn', flush: true, zone: 'ts', cls: 'ct-ds',
                tools: '<div class="ct-tools">' +
                    '<div class="ums-field"><select class="ums-select" data-ct="bc" data-ph="Chọn loại báo cáo"><option value="">Chọn loại báo cáo</option>' +
                    '<option value="BAOCAODIEM">Báo cáo điểm</option></select></div>' +
                    ui.btn('excel', { text: 'Tải file', icon: 'fa-download', attr: { 'data-ct': 'taifile' } }) +
                    '<div class="ums-field"><select class="ums-select" data-ct="phan" data-ph="Chọn phần thi"><option value="">Chọn phần thi</option></select></div>' +
                    ui.btn('reload', { attr: { 'data-ct': 'refresh' } }) +
                    '</div>' });
        ui.swap(z('list'), view);
        ui.enhance(view);
        var selPhan = view.querySelector('[data-ct="phan"]'), ts = view.querySelector('[data-z="ts"]');

        function taiTS(page) {
            if (page) st.page = page;
            ts.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            g(QL + 'LayDS_ChiTietPhongThi_KetQua', {
                versionAPI: V, strTuKhoa: '', strExamRoomInfoId: room.ID, strNguoiTao_Id: P.uid(), strCoTinhLaiDiem: '1',
                strExamStructPartId: selPhan.value, PageNumber: st.page, ItemPerPage: st.size
            }).then(function (r) {
                st.rows = arr((r.data || {}).ChiTietPhongThi);
                var tong = Number(r.pager) || st.rows.length;
                view.querySelector('[data-z="tsn"]').textContent = '(' + tong + ')';
                ui.table({ el: ts, rows: st.rows, empty: 'Không có thí sinh', columns: [
                    { title: 'Mã thí sinh', prop: 'STUDENTCODE', cls: 'is-center is-nowrap' },
                    { title: 'Họ và tên', prop: 'FULLNAME', cls: 'ct-cot-ten' },
                    { title: 'Ngày sinh', prop: 'BIRTHDATE_USER', cls: 'is-center is-nowrap' },
                    { title: 'Số BD', prop: 'SOBAODANHIMPORT', cls: 'is-center' },
                    { title: 'Đề', prop: 'DETHITHU', cls: 'is-center is-nowrap' },
                    { title: 'Điểm', prop: 'DIEMTINH', cls: 'is-center' },
                    { title: 'Điểm công nhận', prop: 'MARK', cls: 'is-center' },
                    { title: 'Ghi chú', render: function (x) {
                        return (e(x.TENVIPHAMQUYCHETHI) ? '<span class="ct-vipham">' + esc(e(x.TENVIPHAMQUYCHETHI)) + '</span>' : '') + esc(e(x.GHICHU));
                    } }
                ], page: { index: st.page, size: st.size, total: tong, onChange: taiTS, onSize: function (n) { st.size = n; taiTS(1); } } });
            }).catch(function (err) { ts.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thí sinh'); });
        }
        taiTS(1);
        P.chiTietDe(room.ID).then(function (de) { return P.phanThi(e(de.EXAMSTRUCTID)); })
            .then(function (ds) { pat.fill(selPhan, ds, { name: 'TITLE', head: 'Chọn phần thi' }); })
            .catch(function (err) { ums.api.handle(err, 'phần thi'); });
        if (window.jQuery) jQuery(selPhan).on('select2:select select2:clear', function () { taiTS(1); });

        view.onclick = function (ev) {
            var a = ev.target.closest('button[data-ct], button[data-a]');
            if (!a) return;
            var k = a.getAttribute('data-ct') || a.getAttribute('data-a');
            if (k === 'dong') { ui.swap(view, z('list')); view.innerHTML = ''; view.onclick = null; }
            else if (k === 'refresh') taiTS();
            else if (k === 'taifile') P.baoCao(view.querySelector('select[data-ct="bc"]').value, room.ID, selPhan.value, { goc: QLTTN ? 'heThong' : '' });
        };
    }

    /* ---------- Sự kiện danh sách ---------------------------------------- */
    z('list').addEventListener('click', function (ev) {
        var tab = ev.target.closest('[data-xtab]');
        if (tab) {
            var k = tab.getAttribute('data-xtab');
            ui.tabsActive(root, k, 'data-xtab');
            TAB.forEach(function (t) { pane(t.key).hidden = t.key !== k; });
            return;
        }
        var p = ev.target.closest('[data-pane]');
        if (!p) return;
        var s = S[p.getAttribute('data-pane')];
        var ph = ev.target.closest('[data-phong]');
        if (ph) { moChiTiet(s, ph.getAttribute('data-phong')); return; }
        var a = ev.target.closest('[data-a]');
        if (!a) return;
        var act = a.getAttribute('data-a');
        if (act === 'search') tai(s, 1);
        else if (act === 'duyet') chuyen(s, s.t.duyet);
        else if (act === 'khong') chuyen(s, s.t.khong);
    });
})();
