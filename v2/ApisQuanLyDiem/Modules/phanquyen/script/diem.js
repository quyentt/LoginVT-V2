/* =========================================================================
   Phân quyền điểm — bản Quản lý điểm (phân quyền thi / phách / điểm theo PHẠM VI đơn vị)
   Bản gốc: ApisQuanLyDiem/Modules/phanquyen/html/diem.html + script/diem.js
   ---------------------------------------------------------------------------
   Khác hẳn bản ApisCMS/phanquyen/diem (lưới cây cấu trúc lớp × người dùng — ums.pq.luoi): bản này mỗi DÒNG là một bộ
   (người dùng × phạm vi áp dụng × hệ đào tạo) do máy chủ trả, mỗi CỘT là một hành động của danh mục CHUNG.HANHDONG.
   Không có khung nào của _pq.js dùng lại được (chỉ trùng ý "đánh dấu → Thêm / bỏ → Xoá") → viết riêng.
   Bố cục gốc: danh sách (#zonebatdau) ↔ biểu mẫu "Thêm mới" (#zoneEdit) thay chỗ nhau; biểu mẫu: khối nhân sự hai cột 4|8,
   khối "Xác định phạm vi" | "Xác định quyền" hai cột 6|6.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       Hệ đào tạo: ums.ref.heDaoTao (edu.system.getList_HeDaoTao — bản KHÔNG lọc quyền, như gốc; nhãn "Tất cả hệ đào tạo")
       Đơn vị: ums.ref.coCauToChuc({ iTrangThai: 1 }) — đổ cả ô lọc lẫn bảng "Xác định phạm vi phân quyền" (MA, TEN)
       Cán bộ: ums.ref.nhanSu({ strCoCauToChuc_Id: đơn vị, dLaCanBoNgoaiTruong: 0 }) — nhãn "MASO - HOTEN"
       Cột: danh mục CHUNG.HANHDONG (ID, TEN) — cũng là bảng "Xác định quyền cần phân"
       Danh sách: POST CMS_PhanQuyenDuLieu_MH · pkg_chung_phanquyendulieu.LayDSThi_Phach_Quyen_Diem
         (strTuKhoa, strChucNang_Id, strNguoiDung_Id = ô cán bộ, strDaoTao_CoCauToChuc_Id = ô đơn vị, strDaoTao_HeDaoTao_Id)
         → NGUOIDUNG_TAIKHOAN, NGUOIDUNG_TENDAYDU, PHAMVIAPDUNG_TEN, HEDAOTAO_TEN, APDUNGQUYENCHOLOPHOCPHAN, NGUOIDUNG_ID, PHAMVIAPDUNG_ID, HEDAOTAO_ID
       Quyền đã có của từng dòng: POST pkg_chung_phanquyendulieu.LayDSQuyenNguoiDungPhamVi (strTuKhoa '', strNguoiDung_Id,
         strPhamViApDung_Id, strDaoTao_HeDaoTao_Id) → HANHDONG_ID, ID
       Thêm: POST pkg_chung_phanquyendulieu.Them_Thi_Phach_Quyen_Diem (strNguoiDung_Id, strPhamViApDung_Id, strHanhDong_Id,
         strDaoTao_ThoiGianDaoTao_Id '', strDaoTao_HeDaoTao_Id, dApDungQuyenChoCaLHP)
       Xoá: POST pkg_chung_phanquyendulieu.Xoa_Thi_Phach_Quyen_Diem (strNguoiDung_Id, strPhamViApDung_Id, strHanhDong_Id, strDaoTao_HeDaoTao_Id)
       Thêm cán bộ: ums.pat.pickNhanSu (edu.extend.genModal_NhanSu)
   Sửa lỗi rõ của gốc:
     · save_PhanQuyenDiemLQL chỉ khai 4 tham số mà đọc biến dApDungQuyenChoCaLHP KHÔNG tồn tại → ReferenceError, Thêm quyền (cả nút
       "Phân quyền" lẫn "Lưu" của biểu mẫu) CHƯA TỪNG gửi được. Nay gửi đúng giá trị ô "Áp dụng cho cả lớp học phần" (1/0) —
       ĐƯỜNG GHI MỚI, thử trên host.
     · Xoá xong gọi getList_NguoiDungTheoChucNang (không tồn tại trong bản này) → lỗi JS; nay nạp lại danh sách.
     · Mỗi lần bấm "Phân quyền" gắn thêm một trình xử lý #btnYes (bấm lần hai là gửi đôi); mỗi ô một thông báo → ums.ui.batch.
     · Xoá cán bộ khỏi bảng nhân sự không gỡ khỏi danh sách đã chọn (không thêm lại được) → gỡ đúng.
     · Đang nạp quyền từng dòng mà bấm "Phân quyền" thì ô chưa kịp đánh dấu bị coi là "thêm" → chặn tới khi nạp xong.
   Giữ như gốc (ghi _harness/_cq-nhapdiem.txt): nút "Tìm kiếm" của biểu mẫu (#btnSearch2) không có xử lý → disabled; tiêu đề biểu mẫu
     gốc ghi "Thêm mới - Kế hoạch" (chép từ màn khác) → "Thêm mới - Phân quyền"; Lưu biểu mẫu không hỏi lại, xong ở lại biểu mẫu.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('qld-pq-diem');
    if (!root) return;
    var PK = 'CMS_PhanQuyenDuLieu_MH/', FN = 'pkg_chung_phanquyendulieu.';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }
    function sel(k, ph) { return '<select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>'; }

    root.innerHTML =
        '<section data-v="ds">' + pat.page('Phân quyền nhập điểm', '') +
            pat.filterBar([{ key: 'he', type: 'select', label: 'Tất cả hệ đào tạo' }, { key: 'dv', type: 'select', label: 'Chọn đơn vị' },
                { key: 'cb', type: 'select', label: 'Chọn cán bộ' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }]) +
            pat.panel({ title: 'Danh sách', icon: 'fa-file-invoice', count: 'n', flush: true, zone: 'bang',
                tools: '<span class="qldpq-tien" data-z="tien"></span>' + ui.btn('save', { text: 'Phân quyền', icon: 'fa-user-gear', attr: { 'data-a': 'pq' } }) +
                    ui.btn('add', { attr: { 'data-a': 'them' } }) }) + '</section>' +
        '<section data-v="them" hidden>' + pat.page('Thêm mới - Phân quyền', ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } })) +
            pat.panel({ title: 'Nhân sự cần phân quyền', icon: 'fa-users', body: '<div class="ums-grid ums-grid--12">' +
                '<div class="qldpq-4"><div class="ums-stack">' + ui.field('Hệ đào tạo', sel('he2', 'Tất cả hệ đào tạo')) +
                    '<label class="ums-check"><input type="checkbox" data-f="ad2"> Áp dụng cho cả lớp học phần</label>' +
                    '<div>' + ui.btn('search', { attr: { 'data-a': 'tim2', disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } }) + '</div></div></div>' +
                '<div class="qldpq-8"><div data-z="ns"></div><div class="ums-row ums-row--end ums-u-mt-3">' +
                    ui.btn('add', { text: 'Thêm cán bộ', mod: 'out-success', attr: { 'data-a': 'themcb' } }) + '</div></div></div>' }) +
            '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                pat.panel({ title: 'Xác định phạm vi phân quyền', icon: 'fa-sitemap', flush: true, zone: 'pv' }) +
                pat.panel({ title: 'Xác định quyền cần phân', icon: 'fa-user-tag', flush: true, zone: 'quyen' }) + '</div></section>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }
    function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
    var dang = 'ds';
    function sang(k) { ui.swap(vung(dang), vung(k), { top: true }); dang = k; }

    /* ---------- Danh mục ------------------------------------------------- */
    var COT = [], DV = [];
    var chain = pat.chain([f('dv'), f('cb')], { phatLai: false });
    ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }).then(function (d) {
        pat.fill(f('he'), d, { name: 'TENHEDAOTAO', head: 'Tất cả hệ đào tạo' }); pat.fill(f('he2'), d, { name: 'TENHEDAOTAO', head: 'Tất cả hệ đào tạo' });
    }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
    ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) {
        DV = d || [];
        pat.fill(f('dv'), DV, { head: 'Chọn đơn vị' }); chain.sync();
        ui.table({ el: z('pv'), rows: DV, empty: 'Không có đơn vị', columns: [{ title: 'Mã số', prop: 'MA', cls: 'is-nowrap' }, { title: 'Đơn vị', prop: 'TEN' },
            { head: '<input type="checkbox" data-all="pv" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-pv="' + i + '">'; } }] });
    }).catch(function (err) { z('pv').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đơn vị'); });
    function napCB() {
        if (!v('dv')) { pat.fill(f('cb'), []); chain.sync(); return; }
        ums.ref.nhanSu({ strCoCauToChuc_Id: v('dv'), dLaCanBoNgoaiTruong: 0, pageIndex: 1, pageSize: 1000000 })
            .then(function (d) { pat.fill(f('cb'), d, { head: 'Chọn cán bộ', name: function (x) { return e(x.MASO) + ' - ' + e(x.HOTEN); } }); chain.sync(); })
            .catch(function (err) { ums.api.handle(err, 'cán bộ'); });
    }
    if (window.jQuery) jQuery(f('dv')).on('select2:select select2:clear', napCB);
    var cotSan = ums.api.dm('CHUNG.HANHDONG').then(function (d) {
        COT = d || [];
        ui.table({ el: z('quyen'), rows: COT, empty: 'Chưa khai báo danh mục CHUNG.HANHDONG', columns: [{ title: 'Quyền', prop: 'TEN' },
            { head: '<input type="checkbox" data-all="q" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-q="' + i + '">'; } }] });
    }).catch(function (err) { z('quyen').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh mục hành động'); });

    /* ---------- Danh sách + lưới quyền ----------------------------------- */
    var DS = [], CO = {}, AD = {}, dangNap = 0, soHieu = 0;   // CO[dòng][hành động] = ID quyền đã có · AD[dòng] = áp dụng cả lớp lúc nạp
    function hangDoi(ds, fn, n) {
        var i = 0;
        function chay() { if (i >= ds.length) return Promise.resolve(); var x = ds[i++]; return Promise.resolve().then(function () { return fn(x); }).catch(function () {}).then(chay); }
        var p = []; for (var k = 0; k < Math.min(n, ds.length); k++) p.push(chay());
        return Promise.all(p);
    }
    function tai() {
        var sh = ++soHieu;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return cotSan.then(function () {
            return ums.api.call({ action: PK + 'DSA4BRIVKSgeESkgIikeEDQ4JC8eBSgkLAPP', func: FN + 'LayDSThi_Phach_Quyen_Diem', strTuKhoa: v('q'), strChucNang_Id: cn(),
                strNguoiDung_Id: v('cb'), strDaoTao_CoCauToChuc_Id: v('dv'), strDaoTao_HeDaoTao_Id: v('he'), strNguoiThucHien_Id: uid() });
        }).then(function (r) {
            if (sh !== soHieu) return;
            DS = arr(r.data); CO = {}; AD = {};
            DS.forEach(function (x, i) { AD[i] = x.APDUNGQUYENCHOLOPHOCPHAN ? 1 : 0; CO[i] = {}; });
            z('n').textContent = '(' + DS.length + ')';
            ve();
            dangNap = DS.length; tien();
            return hangDoi(DS.map(function (x, i) { return i; }), function (i) {
                var x = DS[i];
                return ums.api.call({ action: PK + 'DSA4BRIQNDgkLw8mNC4oBTQvJhEpICwXKAPP', func: FN + 'LayDSQuyenNguoiDungPhamVi', silent: true, strTuKhoa: '',
                    strNguoiDung_Id: x.NGUOIDUNG_ID, strPhamViApDung_Id: x.PHAMVIAPDUNG_ID, strDaoTao_HeDaoTao_Id: x.HEDAOTAO_ID, strNguoiThucHien_Id: uid() }).then(function (r2) {
                    if (sh !== soHieu) return;
                    arr(r2.data).forEach(function (q) {
                        CO[i][q.HANHDONG_ID] = q.ID;
                        var c = z('bang').querySelector('input[data-o="' + i + '_' + q.HANHDONG_ID + '"]');
                        if (c) c.checked = true;
                    });
                }).then(function () { if (sh === soHieu) { dangNap--; tien(); } }, function () { if (sh === soHieu) { dangNap--; tien(); } });
            }, 6);
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phân quyền'); });
    }
    function tien() { z('tien').textContent = dangNap > 0 ? 'Đang nạp quyền… còn ' + dangNap + ' dòng' : ''; }
    function ve() {
        var cot = [{ title: 'Mã số', prop: 'NGUOIDUNG_TAIKHOAN', cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'NGUOIDUNG_TENDAYDU' },
            { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' }, { title: 'Hệ đào tạo', prop: 'HEDAOTAO_TEN' },
            { head: 'Áp dụng quyền cho cả lớp học phần <input type="checkbox" data-all="ad" title="Chọn cả cột">', cls: 'is-center',
                render: function (x, i) { return '<input type="checkbox" data-ad="' + i + '"' + (AD[i] ? ' checked' : '') + '>'; } }];
        COT.forEach(function (c) {
            cot.push({ head: esc(e(c.TEN)) + ' <input type="checkbox" data-all="c_' + esc(c.ID) + '" title="Chọn cả cột">', cls: 'is-center',
                render: function (x, i) { return '<input type="checkbox" data-o="' + i + '_' + esc(c.ID) + '" data-cot="' + esc(c.ID) + '" data-dong="' + i + '">'; } });
        });
        cot.push({ head: 'Tất cả <input type="checkbox" data-all="bang" title="Chọn cả bảng">', cls: 'is-center',
            render: function (x, i) { return '<input type="checkbox" data-all="d_' + i + '" title="Chọn cả dòng">'; } });
        ui.table({ el: z('bang'), rows: DS, columns: cot, empty: 'Không có dữ liệu' });
        var t = z('bang').querySelector('table');
        if (t) { t.classList.add('qldpq-bang'); gop(t); }
    }
    /* Gộp ô Mã số + Họ tên của các dòng liền nhau cùng người dùng (edu.system.actionRowSpan(…, [1, 2]) của gốc) */
    function gop(t) {
        var rows = t.tBodies[0] ? t.tBodies[0].rows : [], dau = -1;
        for (var i = 0; i <= DS.length; i++) {
            if (i < DS.length && dau >= 0 && DS[i].NGUOIDUNG_ID === DS[dau].NGUOIDUNG_ID) continue;
            if (dau >= 0 && i - dau > 1 && rows[dau]) {
                [2, 1].forEach(function (k) { rows[dau].cells[k].rowSpan = i - dau; rows[dau].cells[k].classList.add('qldpq-gop'); });
                for (var j = dau + 1; j < i; j++) if (rows[j]) { rows[j].deleteCell(2); rows[j].deleteCell(1); }
            }
            dau = i;
        }
    }
    function phanQuyen() {
        if (dangNap > 0) { ui.toast('Đang nạp quyền hiện có, vui lòng đợi', 'warn'); return; }
        var them = [], xoa = [];
        qa(z('bang'), 'input[data-o]').forEach(function (c) {
            var i = Number(c.getAttribute('data-dong')), hd = c.getAttribute('data-cot'), co = CO[i] && CO[i][hd];
            if (c.checked && !co) them.push({ i: i, hd: hd });
            else if (!c.checked && co) xoa.push({ i: i, hd: hd });
        });
        // Đổi "Áp dụng cho cả lớp" → gửi lại mọi quyền ĐÃ CÓ còn đánh dấu của dòng đó (gốc: đẩy các ô có name vào danh sách thêm)
        qa(z('bang'), 'input[data-ad]').forEach(function (c) {
            var i = Number(c.getAttribute('data-ad'));
            if ((c.checked ? 1 : 0) === AD[i]) return;
            qa(z('bang'), 'input[data-dong="' + i + '"]').forEach(function (o) {
                var hd = o.getAttribute('data-cot');
                if (o.checked && CO[i][hd]) them.push({ i: i, hd: hd });
            });
        });
        if (!them.length && !xoa.length) { ui.toast('Không có thay đổi để phân quyền', 'info'); return; }
        ui.confirm('Bạn có chắc chắn thêm ' + them.length + ' và hủy quyền ' + xoa.length + '?', { title: 'Phân quyền' }).then(function (yes) {
            if (!yes) return;
            var calls = them.map(function (t) {
                var x = DS[t.i], ad = z('bang').querySelector('input[data-ad="' + t.i + '"]');
                return luuGoi(x.NGUOIDUNG_ID, x.PHAMVIAPDUNG_ID, t.hd, x.HEDAOTAO_ID, ad && ad.checked ? 1 : 0);
            }).concat(xoa.map(function (t) {
                var x = DS[t.i];
                return { action: PK + 'GS4gHhUpKB4RKSAiKR4QNDgkLx4FKCQs', func: FN + 'Xoa_Thi_Phach_Quyen_Diem', strNguoiDung_Id: x.NGUOIDUNG_ID, strPhamViApDung_Id: x.PHAMVIAPDUNG_ID,
                    strHanhDong_Id: t.hd, strDaoTao_HeDaoTao_Id: x.HEDAOTAO_ID, strNguoiThucHien_Id: uid() };
            }));
            ui.batch(calls, { title: 'Đang phân quyền', okText: 'Phân quyền thành công', show: true }).then(tai);
        });
    }
    function luuGoi(nguoiDung, phamVi, hanhDong, he, apDung) {
        return { action: PK + 'FSkkLB4VKSgeESkgIikeEDQ4JC8eBSgkLAPP', func: FN + 'Them_Thi_Phach_Quyen_Diem', strNguoiDung_Id: nguoiDung, strPhamViApDung_Id: phamVi,
            strHanhDong_Id: hanhDong, strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_HeDaoTao_Id: he, dApDungQuyenChoCaLHP: apDung, strNguoiThucHien_Id: uid() };
    }

    /* ---------- Biểu mẫu "Thêm mới" -------------------------------------- */
    var NS = [];
    function veNS() {
        ui.table({ el: z('ns'), rows: NS, empty: 'Chưa chọn cán bộ', columns: [{ title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'HOTEN' },
            { title: 'Xóa', cls: 'is-center is-actions', width: '70px', render: function (x, i) { return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-bons="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>'; } }] });
    }
    function luuMoi() {
        var pv = qa(z('pv'), 'input[data-pv]:checked').map(function (c) { return DV[Number(c.getAttribute('data-pv'))]; }).filter(Boolean);
        var q = qa(z('quyen'), 'input[data-q]:checked').map(function (c) { return COT[Number(c.getAttribute('data-q'))]; }).filter(Boolean);
        if (!NS.length || !pv.length || !q.length) { ui.toast(!NS.length ? 'Chọn cán bộ cần phân quyền' : !pv.length ? 'Chọn phạm vi phân quyền' : 'Chọn quyền cần phân', 'warn'); return; }
        var ad = f('ad2').checked ? 1 : 0, he = v('he2'), calls = [];
        NS.forEach(function (n) { pv.forEach(function (p) { q.forEach(function (h) { calls.push(luuGoi(n.ID, p.ID, h.ID, he, ad)); }); }); });
        ui.batch(calls, { title: 'Đang lưu phân quyền', okText: 'Phân quyền thành công', show: true });
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('change', function (ev) {
        var t = ev.target, k = t.getAttribute('data-all');
        if (!k) return;
        var sel = k === 'pv' ? 'input[data-pv]' : k === 'q' ? 'input[data-q]' : k === 'ad' ? 'input[data-ad]' : k === 'bang' ? 'tbody input[type="checkbox"]'
            : k.indexOf('c_') === 0 ? 'input[data-cot="' + k.substring(2) + '"]' : 'input[data-dong="' + k.substring(2) + '"]';
        var host = k === 'pv' ? z('pv') : k === 'q' ? z('quyen') : z('bang');
        qa(host, sel).forEach(function (c) { c.checked = t.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
    root.addEventListener('click', function (ev) {
        var b;
        if ((b = ev.target.closest('[data-bons]'))) { NS.splice(Number(b.getAttribute('data-bons')), 1); veNS(); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'pq') phanQuyen();
        else if (a === 'them') { veNS(); sang('them'); }
        else if (a === 'dong') { sang('ds'); tai(); }
        else if (a === 'luu') luuMoi();
        else if (a === 'themcb') ums.pat.pickNhanSu({ onPick: function (rows) {
            var co = {}; NS.forEach(function (n) { co[n.ID] = 1; });
            var trung = 0;
            rows.forEach(function (r) { if (co[r.ID]) { trung++; return; } co[r.ID] = 1; NS.push({ ID: r.ID, MASO: e(r.MASO), HOTEN: e(r.HOTEN) || (e(r.HODEM) + ' ' + e(r.TEN)).trim() }); });
            if (trung) ui.toast(trung + ' cán bộ đã có trong danh sách', 'info');
            veNS();
        } });
    });
    z('bang').innerHTML = ui.empty('Chọn bộ lọc rồi bấm "Tìm kiếm" để xem danh sách phân quyền', 'fa-hand-pointer');   // gốc không nạp khi mở màn
})();
