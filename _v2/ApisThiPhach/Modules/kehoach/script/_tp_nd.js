/* =========================================================================
   Thi phách — khung chung của hai màn nhập điểm: nhapdiem (theo phách) và nhapdiemdst (theo danh sách thi)
   ums.tpNd.man(root, c)      danh sách (lọc + bảng) ↔ khung chi tiết THAY CHỖ danh sách (gốc: toggle_overide zone-bus)
   ums.tpNd.tungDong(o)       hộp "Xác nhận từng phách / từng bản ghi" (kiểu nút)
   ums.tpNd.canBoCham(x)      hộp cán bộ đã phân công (chỉ xem)
   Bản gốc: ApisThiPhach/Modules/kehoach/script/nhapdiem.js + nhapdiemdst.js (hai tệp chép nhau phần này).
   Dùng lại của Cổng cán bộ (nạp chéo ApisCongCanBo/Modules/nhapdiem/script/_chung.js, _xacnhan.js):
       ums.nd.locThi (bộ lọc TP_Chung năm tầng, cờ `them`), ums.nd.phim / oDoi / danhDau / pool,
       ums.nd.xacNhanNut (hộp xác nhận KIỂU NÚT), ums.nd.luuXacNhan / trangThai.
   ---------------------------------------------------------------------------
   Lời gọi chung (chép nguyên):
       Bộ lọc: TP_Chung/LayThoiGian → LayLoaiDiem → LayHinhThucThi → LayDotThi → LayHocPhan (GET; gốc KHÔNG tự chọn thời gian đầu)
       Xác nhận (các dòng đánh dấu): D_HanhDongXacNhan/LayDanhSach (GET strChucNang_Id, strLoaiXacNhan_Id — không gửi
         strDiem_DanhSachHoc_Id) · D_XacNhan/LayDSDiem_XacNhan (lịch sử của dòng ĐẦU, như gốc) ·
         D_XacNhan/Them_Diem_XacNhan (POST, mỗi dòng một lời gọi; strThongTinXacNhan = ô "Nội dung")
       Ngày nhận bài: POST XLHV_TP_PhanCong_MH/AiAxDykgNR4VKS4oBiggLw8pIC8DICgP · pkg_thi_phancong.CapNhat_ThoiGianNhanBai
         (strThi_GV_ChamThi_Id = ID DÒNG của danh sách — như gốc, strNgayNhanBai)
       Cán bộ chấm thi: POST XLHV_TP_PhanCong_MH/DSA4BRIPKSAvEjQRKSAvAi4vJgIuKBUpKAPP · pkg_thi_phancong.LayDSNhanSuPhanCongCoiThi
         (strDuLieuPhanCongCoiThi_Id = ID dòng)
   Không chép (lỗi rõ của bản gốc):
     · Ngày nhận bài lưu ở MỌI lần rời ô (kể cả không đổi gì, kể cả ô trống) → chỉ lưu khi giá trị đổi; ô chọn ngày
       (như màn Phân chấm thi đã chuyển). Gốc luôn vẽ ô TRỐNG (không đổ giá trị đã lưu) → đổ cột NGAYNHANBAI nếu máy chủ
       có trả (tên cột theo màn gốc Phân chấm thi — không trả thì ô trống y như gốc).
     · Hộp "Cán bộ chấm thi": gốc đổ dữ liệu vào bảng #tblTuiBai KHÔNG có trong html → hộp luôn trống, nút Xóa luôn báo
       "Vui lòng chọn đối tượng cần xóa". Bản mới HIỆN danh sách; nút Xóa giữ nhưng KHOÁ (xem "Chờ" bên dưới).
     · Hộp xác nhận từng dòng: mở N lần thì một lần bấm dòng gọi lịch sử N lần (delegate lặp) → gắn một lần.
     · Xác nhận xong không nạp lại danh sách / tình trạng → nạp lại.
     · Lọc nối tầng chạy song song đọc giá trị con cũ; mở màn nạp mọi ô khi chưa chọn cha → nạp lần lượt, khoá con (pat.chain).
   Giữ như gốc (đã cân nhắc):
     · Báo cáo gửi strDanhSachThi_Id = dòng MỞ GẦN NHẤT (kể cả dòng vừa bấm "cán bộ chấm thi"), đóng khung chi tiết vẫn còn —
       dòng đó được tô nền để người dùng thấy; rồi thêm một strDanhSachThi_Id cho mỗi dòng đánh dấu.
     · Đóng khung chi tiết thì nạp lại danh sách (toggle_form).
   Chờ (ghi báo cáo): xoá cán bộ trong hộp gọi pkg_thi_phancong.Xoa_Thi_GiaoVien_CoiThi — thủ tục của phân COI thi, trong khi
     cột ghi "chấm thi" (màn Phân chấm thi dùng …ChamThi) và đường này chưa từng chạy → chưa bật.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, nd = ums.nd;
    var T = ums.tpNd = ums.tpNd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var PC = 'XLHV_TP_PhanCong_MH/';
    T.e = e; T.arr = arr;

    /** Các dòng đang đánh dấu của bảng trong host (ô data-ck = chỉ số dòng trong rows) */
    T.daChon = function (host, rows) {
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return rows[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    };
    /** Ô "chọn tất cả" ở tiêu đề → đánh dấu cả cột (chiều con → cha tầng chung đã lo) */
    T.chonTatCa = function (goc) {
        goc.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.getAttribute || t.getAttribute('data-ck') !== 'all') return;
            var tb = t.closest('table');
            if (tb) Array.prototype.forEach.call(tb.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = t.checked; });
        });
    };
    T.cotChon = function () {
        return { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } };
    };

    /* ---------- Hộp cán bộ đã phân công (chỉ xem) ------------------------- */
    T.canBoCham = function (x) {
        var dlg = ui.dialog({ title: 'Cán bộ chấm thi đã phân công', icon: 'fa-chalkboard-user', size: 'lg', body: '<div data-x="bang"></div>',
            buttons: [{ text: 'Xóa', kind: 'del', onClick: function () { return false; } }] });
        var h = dlg.body.querySelector('[data-x="bang"]');
        var nut = dlg.el.querySelector('[data-dlg="0"]');
        if (nut) { nut.disabled = true; nut.title = 'Chưa bật — bản gốc chưa từng xoá được ở hộp này'; }
        h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: PC + 'DSA4BRIPKSAvEjQRKSAvAi4vJgIuKBUpKAPP', func: 'pkg_thi_phancong.LayDSNhanSuPhanCongCoiThi', strDuLieuPhanCongCoiThi_Id: x.ID, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var d = arr(r.data);
                /* Gốc: mã đọc THI_TUIBAI_TEN / CANBOCHAMTHI_HOTEN / SOBAI, còn tiêu đề html ghi Họ đệm / Tên / Mã số (cột của
                   danh sách phân coi thi) — vẽ theo bộ cột máy chủ thật sự trả. */
                var kieuCham = d.length && d[0].CANBOCHAMTHI_HOTEN !== undefined;
                ui.table({ el: h, rows: d, empty: 'Chưa phân công cán bộ', columns: kieuCham
                    ? [{ title: 'Túi bài', prop: 'THI_TUIBAI_TEN' }, { title: 'Cán bộ chấm thi', prop: 'CANBOCHAMTHI_HOTEN' }, { title: 'Số bài', prop: 'SOBAI', cls: 'is-center' }]
                    : [{ title: 'Họ đệm', prop: 'HODEM' }, { title: 'Tên', prop: 'TEN' }, { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }] });
            }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'cán bộ chấm thi'); });
        return dlg;
    };

    /* ---------- Hộp xác nhận TỪNG DÒNG ------------------------------------
       o = { chuDe, icon, loai, ds (các dòng của bảng chi tiết), cot: [{ title, prop }], khoa(x) → id xác nhận, nhan(x), onDone }
       Gốc: actionCopyXacNhan (chép cột của bảng chi tiết) + getList_XacNhan từng dòng + save_XacNhanSanPham. */
    T.tungDong = function (o) {
        var ds = o.ds || [], TT = {};
        return nd.xacNhanNut({ tieuDe: 'Xác nhận', chuDe: o.chuDe, icon: o.icon, loai: o.loai, size: 'lg', lichSu: '', lichSuRong: 'Bấm một dòng để xem lịch sử',
            truoc: '<div class="ums-legend ums-legend--cach">Danh sách</div><div data-x="ds"></div>',
            luu: function (hd, noiDung, dlg) {
                var chon = T.daChon(dlg.body.querySelector('[data-x="ds"]'), ds);
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return false; }
                return nd.luuXacNhan(chon.map(o.khoa), hd, o.loai, noiDung);
            },
            onBody: function (dlg) {
                var h = dlg.body.querySelector('[data-x="ds"]');
                h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                nd.pool(ds, function (x) { return nd.trangThai(o.khoa(x), o.loai).then(function (t) { TT[x.ID] = t; }); }, 10).then(function () {
                    if (dlg.closed) return;
                    ui.table({ el: h, rows: ds, empty: 'Chưa có dòng nào', columns: o.cot.map(function (c, ci) {
                        return { title: c.title, cls: c.cls, render: function (x, i) { return ci ? esc(e(x[c.prop])) : '<a href="javascript:void(0)" data-ls="' + i + '">' + esc(e(x[c.prop])) + '</a>'; } };
                    }).concat([{ title: 'Tình trạng', cls: 'is-center', render: function (x) { return esc(TT[x.ID] || ''); } }, T.cotChon()]) });
                });
                T.chonTatCa(dlg.body);
                dlg.body.addEventListener('click', function (ev) {
                    var b = ev.target.closest('[data-ls]'); if (!b) return;
                    var x = ds[Number(b.getAttribute('data-ls'))];
                    Array.prototype.forEach.call(h.querySelectorAll('tr.tpnd-mo'), function (tr) { tr.classList.remove('tpnd-mo'); });
                    b.closest('tr').classList.add('tpnd-mo');
                    dlg.lichSu(o.khoa(x));
                });
            },
            onDone: o.onDone });
    };

    /* ---------- Khung màn ---------------------------------------------------
       c = { tieuDe, loc: [ô lọc pat.filterBar], nut: HTML nút thêm ở đầu trang, tuTai: đổi ô lọc là nạp lại danh sách,
             locThem(k, v) → tham số thêm cho tầng k của bộ lọc, sauLoc(api): gắn ô lọc riêng,
             tai(v) → Promise (danh sách), hien(ds, v) → lọc tại chỗ, phanTrang: phân trang máy khách, nhac: chữ khi chưa tìm,
             cot(lk) → cột đầu, cotSau → cột chèn trước ô đánh dấu, rong: chữ bảng trống,
             loaiXN, chuDeXN, baoCao(add, v), onNut(a, api),
             ct: { tieuDe(x), icon, tools: HTML nút giữa Đóng và Lưu, tren: HTML trên bảng, mo(x, khung, api) → { luu(), nut(a), doi() } } } */
    T.man = function (root, c) {
        root.innerHTML = '<div data-z="ds">' +
            pat.page(c.tieuDe, ui.btn('confirm', { text: 'Xác nhận', mod: 'primary', attr: { 'data-a': 'xacnhan' } }) + '<span data-z="bc"></span>' + (c.nut || '')) +
            pat.filterBar(c.loc) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang' }) + '</div>' +
            '<div data-z="ct" hidden></div>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? f(k).value.trim() : ''; }
        var ds = [], hien = [], trangRows = [], trang = 1, co = 10, moId = '', ctl = null;
        var api = { z: z, f: f, v: v, root: root };

        var L = nd.locThi({ f: f, chonDau: false, tenMon: function (x) { return e(x.TEN) + ' - ' + e(x.MA); },
            them: c.locThem ? function (k) { return c.locThem(k, v); } : null,
            onDoi: c.tuTai ? function () { tai(); } : null });
        api.napMon = function () { return L.napTu(4); };
        if (c.sauLoc) c.sauLoc(api);

        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return c.tai(v).then(function (r) { ds = arr(r.data); trang = 1; ve(); })
                .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách'); });
        }
        function lk(txt, x) { return '<a href="javascript:void(0)" class="nd-lk" data-mo="' + esc(x.ID) + '" title="Chi tiết">' + esc(e(txt)) + '</a>'; }
        function ve() {
            hien = c.hien ? c.hien(ds, v) : ds;
            z('n').textContent = '(' + hien.length + ')';
            var dau = c.phanTrang ? (trang - 1) * co : 0;
            trangRows = c.phanTrang ? hien.slice(dau, dau + co) : hien;
            var cot = c.cot(lk).concat([
                { title: 'Ngày nhận bài', cls: 'is-center', width: '150px', render: function (x, i) {
                    return '<input class="ums-input ums-input--sm tpnd-ngay" data-nnb="' + i + '" data-date data-goc="' + esc(e(x.NGAYNHANBAI)) + '" value="' + esc(e(x.NGAYNHANBAI)) + '" autocomplete="off">'; } },
                { title: 'Thông tin cán bộ chấm thi đã phân công', render: function (x, i) {
                    return '<a href="javascript:void(0)" class="tpnd-cb" data-cb="' + i + '" title="Chi tiết">' + esc(x.DSNHANSUCHAMTHI ? x.DSNHANSUCHAMTHI : 'Xem') + '</a>'; } }],
                c.cotSau || [], [T.cotChon()]);
            ui.table({ el: z('bang'), rows: trangRows, columns: cot, empty: c.rong || 'Không có dữ liệu',
                rowCls: function (x) { return moId && x.ID === moId ? 'tpnd-mo' : ''; },
                page: c.phanTrang ? { index: trang, size: co, total: hien.length, onChange: function (p) { trang = p; ve(); }, onSize: function (s) { co = s; trang = 1; ve(); } } : undefined });
            ui.enhance(z('bang'));
        }
        api.tai = tai; api.ve = ve;
        api.daChon = function () { return T.daChon(z('bang'), trangRows); };
        function toMo() {
            Array.prototype.forEach.call(z('bang').querySelectorAll('tbody tr'), function (tr) { tr.classList.toggle('tpnd-mo', !!moId && tr.getAttribute('data-id') === moId); });
        }

        ums.report.mount(z('bc'), { reportText: 'Báo cáo', collect: function (add) {
            c.baoCao(add, v);
            add('strDanhSachThi_Id', moId);
            api.daChon().forEach(function (x) { add('strDanhSachThi_Id', x.ID); });
        } });

        /* ---------- Khung chi tiết thay chỗ danh sách ---------------------- */
        function mo(x) {
            moId = x.ID;
            z('ct').innerHTML = pat.panel({ title: c.ct.tieuDe(x), icon: c.ct.icon || 'fa-file-pen', flush: true,
                tools: ui.btn('close', { attr: { 'data-c': 'dong' } }) + (c.ct.tools || '') + ui.btn('save', { text: 'Lưu', attr: { 'data-c': 'luu' } }),
                body: (c.ct.tren || '') + '<div data-c="bang"></div>' });
            ui.enhance(z('ct'));
            ui.swap(z('ds'), z('ct'));
            var h = z('ct').querySelector('[data-c="bang"]');
            nd.phim(h);
            ctl = c.ct.mo(x, { el: z('ct'), bang: h, q: function (k) { return z('ct').querySelector('[data-c="' + k + '"]'); } }, api);
        }
        function dong() {
            var doi = ctl && ctl.doi ? ctl.doi() : 0;
            (doi ? ui.confirm('Có ' + doi + ' điểm chưa lưu. Bạn có chắc chắn muốn đóng và bỏ qua thay đổi không?', { tone: 'warn', ok: 'Bỏ thay đổi' }) : Promise.resolve(true)).then(function (yes) {
                if (!yes) return;
                ctl = null; z('ct').innerHTML = '';
                ui.swap(z('ct'), z('ds'));
                tai();
            });
        }
        api.dong = dong;
        /* Khung phụ khác của màn (vd Thống kê kết quả) cũng thay chỗ danh sách */
        api.moKhung = function (html) { z('ct').innerHTML = html; ui.enhance(z('ct')); ui.swap(z('ds'), z('ct')); ctl = null; return z('ct'); };

        T.chonTatCa(root);
        root.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.hasAttribute || !t.hasAttribute('data-nnb')) return;
            var moi = t.value.trim();
            if (moi === t.getAttribute('data-goc')) return;
            var x = trangRows[Number(t.getAttribute('data-nnb'))]; if (!x) return;
            ums.api.call({ action: PC + 'AiAxDykgNR4VKS4oBiggLw8pIC8DICgP', func: 'pkg_thi_phancong.CapNhat_ThoiGianNhanBai', strThi_GV_ChamThi_Id: x.ID, strNgayNhanBai: moi, strNguoiThucHien_Id: uid() })
                .then(function () { t.setAttribute('data-goc', moi); x.NGAYNHANBAI = moi; ui.toast('Cập nhật thành công', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'ngày nhận bài'); });
        });
        root.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('[data-mo]'))) {
                var id = b.getAttribute('data-mo'), x = trangRows.filter(function (r) { return String(r.ID) === id; })[0];
                if (x) mo(x);
                return;
            }
            if ((b = ev.target.closest('[data-cb]'))) {
                var y = trangRows[Number(b.getAttribute('data-cb'))];
                if (y) { moId = y.ID; toMo(); T.canBoCham(y); }
                return;
            }
            if ((b = ev.target.closest('[data-c]')) && b.tagName === 'BUTTON') {
                var k = b.getAttribute('data-c');
                if (k === 'dong') dong();
                else if (k === 'luu') { if (ctl && ctl.luu) ctl.luu(); }
                else if (ctl && ctl.nut) ctl.nut(k);
                return;
            }
            if (!(b = ev.target.closest('[data-a]'))) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') tai();
            else if (a === 'xacnhan') {
                var chon = api.daChon();
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
                nd.xacNhanNut({ tieuDe: 'Xác nhận', chuDe: c.chuDeXN, loai: c.loaiXN, ids: chon.map(function (r) { return r.ID; }), lichSu: chon[0].ID, onDone: tai });
            } else if (c.onNut) c.onNut(a, api);
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });

        L.xong.then(function () {
            if (c.tuTai) tai();
            else z('bang').innerHTML = ui.empty(c.nhac || 'Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
        });
        return api;
    };
})();
