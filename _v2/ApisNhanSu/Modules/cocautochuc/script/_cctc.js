/* =========================================================================
   ApisNhanSu / cocautochuc — khung chung của "Cơ cấu tổ chức" và
   "Cơ cấu tổ chức ngoài trường" (ums.nsCctc.man)
   Bản gốc: cocautochuc.{html,js} và cocautochucngoaitruong.{html,js} — hai tệp
   chép nhau từng dòng, chỉ khác controller, tên hai tham số (dThuTu/dTrangThai ↔
   iThuTu/iTrangThai), ba tham số thêm của bản ngoài trường, và nút thứ ba ở chân
   biểu mẫu ("Lưu và nhập tiếp" ↔ "Viết lại").
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, col-lg-3 | col-lg-9):
     trái  — ô "Loại" (NS.LCTC) + ô từ khoá; khung "Cơ cấu tổ chức" (số lượng) + cây jstree;
     phải  — "Chi tiết" (nút Thêm mới + Sửa/Xóa khi đã chọn nút cây, 5 dòng nhãn : giá trị)
             và biểu mẫu Thêm mới / Chỉnh sửa thay chỗ nhau (toggle_overide "zone-cctc").
   Bản mới: ums.pat.master, cột trái kiểu DANH MỤC (cây thư mục — ums.nsCoCau.cay);
   nút "Thêm mới" lên đầu trang (BO-CUC luật 5); Sửa / Xóa ở đầu khung "Chi tiết".

   ums.nsCctc.man(root, {
       tieuDe, ctl: 'NS_CoCauToChuc' | 'NS_CoCauToChucNgoai',
       dsThamSo(loai) → tham số LayDanhSach (không kèm action),
       luuThamSo(v, id) → tham số ThemMoi / CapNhat (không kèm action),
       xoa: action xoá, nut3: 'luutiep' | 'vietlai'
   })
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    ums.nsCctc = { man: man };

    function man(root, cfg) {
        var searchbar = '<div class="ums-searchbar ums-searchbar--sm">' +
            '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
            '<input class="ums-searchbar__input" data-a="q" type="text" autocomplete="off" placeholder="Nhập từ khóa tìm kiếm"></div>';

        var mst = pat.master({
            el: root,
            title: cfg.tieuDe,
            actions: ui.btn('add', { attr: { 'data-a': 'them' } }),
            side: {
                title: 'Cơ cấu tổ chức', kieu: 'danhmuc', search: false,
                /* Luật cột trái (BO-CUC 12): ô tìm chuẩn trên cùng, loại cơ cấu vào Bộ lọc nâng cao (pat.cotTrai) */
                filter: '<div class="ums-master__search">' + searchbar + '</div>' +
                    '<div class="ums-field"><select class="ums-select" data-a="loai" data-ph="Chọn loại cơ cấu">' +
                    '<option value="">Chọn loại cơ cấu</option></select></div>'
            },
            main: { title: false }
        });
        var elCay = mst.sideBody, elDem = mst.sideCount;
        var selLoai = root.querySelector('[data-a="loai"]');
        var inpQ = root.querySelector('[data-a="q"]');

        mst.mainBody.innerHTML =
            '<div data-z="nhac">' + pat.panel({ title: 'Chi tiết', icon: 'fa-circle-info',
                body: ui.empty('Chọn một đơn vị ở cây bên trái để xem chi tiết', 'fa-hand-pointer') }) + '</div>' +
            '<div data-z="ct" hidden>' + pat.panel({ title: 'Chi tiết', icon: 'fa-circle-info', zone: 'ctBody',
                tools: ui.btn('del', { text: 'Xóa', attr: { 'data-a': 'xoa' } }) + ui.btn('edit', { attr: { 'data-a': 'sua' } }) }) + '</div>' +
            '<div data-z="form" hidden>' + pat.panel({ title: 'Thêm mới', icon: 'fa-plus', zone: 'formBody',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    (cfg.nut3 === 'vietlai'
                        ? ui.btn('reload', { text: 'Viết lại', attr: { 'data-a': 'vietlai' } })
                        : ui.btn('save', { text: 'Lưu và nhập tiếp', mod: 'out-primary', icon: 'fa-floppy-disk-circle-arrow-right', attr: { 'data-a': 'luutiep' } })) +
                    ui.btn('save', { attr: { 'data-a': 'luu' } }),
                body: '<div class="ums-grid ums-grid--2">' +
                    ui.field('Tên', '<input class="ums-input" data-scope="form" data-k="ten" autocomplete="off">', { required: true }) +
                    ui.field('Mã', '<input class="ums-input" data-scope="form" data-k="ma" autocomplete="off">', { required: true }) +
                    ui.field('Loại', '<select class="ums-select" data-scope="form" data-k="loai" data-ph="Chọn loại cơ cấu"><option value="">Chọn loại cơ cấu</option></select>', { required: true }) +
                    ui.field('Thuộc cơ cấu', '<select class="ums-select" data-scope="form" data-k="cha" data-ph="Chọn cơ cấu tổ chức cha"><option value="">Chọn cơ cấu tổ chức cha</option></select>') +
                    '<div class="nscc-span">' + ui.field('Ghi chú', '<input class="ums-input" data-scope="form" data-k="ghichu" autocomplete="off">') + '</div>' +
                    '</div>' }) + '</div>';

        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return z('formBody').querySelector('[data-k="' + k + '"]'); }
        var vung = 'nhac';
        function sang(k) {
            if (k === vung) return;
            ui.swap(z(vung), z(k), { top: false });
            vung = k;
            mst.formMode(k === 'form');
        }

        var S = { ds: [], chon: null, sua: null, loai: [] };

        /* ---------- Danh mục loại (NS.LCTC — cả ô lọc lẫn ô biểu mẫu) ---------- */
        ums.api.dm('NS.LCTC').then(function (rows) {
            S.loai = rows;
            pat.fill(selLoai, rows, { head: 'Chọn loại cơ cấu' });
            pat.fill(f('loai'), rows, { head: 'Chọn loại cơ cấu' });
        }).catch(function (err) { ums.api.handle(err, 'NS.LCTC'); });

        /* ---------- Cây ---------- */
        function napCay(giuId) {
            elCay.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var tham = cfg.dsThamSo(selLoai.value);
            tham.action = cfg.ctl + '/LayDanhSach';
            tham.method = 'GET';
            return ums.api.call(tham).then(function (r) {
                S.ds = C.rows(r);
                elDem.textContent = String(S.ds.length);
                C.cay(elCay, S.ds, { chon: giuId || (S.chon && S.chon.ID) });
                C.loc(elCay, inpQ.value);
                // Ô "Thuộc cơ cấu" (genCombo_CCTC — thụt lề theo cây)
                var cha = f('cha'), giu = cha.value;
                cha.innerHTML = C.optsCay(S.ds, null, 'Chọn cơ cấu tổ chức cha');
                cha.value = giu;
                jQuery(cha).trigger('change.select2');
                if (giuId) { var x = tim(giuId); if (x) xem(x); }
                else if (S.chon && !tim(S.chon.ID) && vung !== 'form') { S.chon = null; sang('nhac'); }
            }).catch(function (err) {
                elCay.innerHTML = ui.fail(err.message);
                ums.api.handle(err, cfg.ctl + '/LayDanhSach');
            });
        }
        function tim(id) { return S.ds.filter(function (x) { return x.ID === id; })[0] || null; }

        inpQ.addEventListener('input', function () { C.loc(elCay, inpQ.value); });
        inpQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); napCay(); } });
        ums.pat.cotTrai({ side: mst.side, search: inpQ }, { tai: function () { napCay(); }, tuTaiLoc: false, tuTim: false });   // gõ = lọc cây tại chỗ
        elCay.addEventListener('click', function (ev) {
            var b = ev.target.closest('.nscc-node');
            if (!b) return;
            var row = tim(b.getAttribute('data-id'));
            if (row) xem(row);
        });
        /* Gốc: chọn Loại → nạp lại cây, xoá trắng biểu mẫu, đặt sẵn Loại của biểu mẫu = loại vừa chọn */
        jQuery(selLoai).on('select2:select select2:clear', function () {
            napCay();
            vietLai();
            f('loai').value = selLoai.value;
            jQuery(f('loai')).trigger('change.select2');
        });

        /* ---------- Chi tiết (viewDetail_CCTC) ---------- */
        function kv(nhan, gt, dam) { return '<div class="ums-kv' + (dam ? ' ums-kv--dam' : '') + '"><span>' + ui.esc(nhan) + '</span><b>' + ui.esc(gt) + '</b></div>'; }
        function xem(row) {
            S.chon = row;
            C.chon(elCay, row.ID);
            z('ctBody').innerHTML =
                kv('1) Tên', e(row.TEN), true) + kv('2) Mã', e(row.MA)) + kv('3) Loại', e(row.DAOTAO_LOAICOCAUTOCHUC)) +
                kv('4) Thuộc cơ cấu', e(row.DAOTAO_COCAUTOCHUC_CHA)) + kv('5) Ghi chú', e(row.GHICHU));
            sang('ct');
        }

        /* ---------- Biểu mẫu (rewrite / viewEdit_CCTC) ---------- */
        function dat(k, v) { var el = f(k); el.value = e(v); el.classList.remove('is-invalid'); if (el.tagName === 'SELECT') jQuery(el).trigger('change.select2'); }
        function vietLai() {
            S.sua = null;
            ['ten', 'ma', 'loai', 'cha', 'ghichu'].forEach(function (k) { dat(k, ''); });
            tieuDe(false);
        }
        function tieuDe(sua) {
            z('form').querySelector('.ums-panel__title').innerHTML =
                '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' + (sua ? 'Chỉnh sửa' : 'Thêm mới');
        }
        function moForm(row) {
            vietLai();
            if (row) {
                S.sua = row;
                dat('ten', row.TEN); dat('ma', row.MA); dat('loai', row.DAOTAO_LOAICOCAUTOCHUC_ID);
                dat('cha', row.DAOTAO_COCAUTOCHUC_CHA_ID); dat('ghichu', row.GHICHU);
                tieuDe(true);
            } else if (selLoai.value) {
                dat('loai', selLoai.value);
            }
            sang('form');
            f('ten').focus();
        }
        /* arrValid_CCTC của gốc (Tên, Mã, Loại bắt buộc) khai nhưng không gọi → nay kiểm */
        function hopLe() {
            var thieu = [];
            [['ten', 'Tên'], ['ma', 'Mã'], ['loai', 'Loại']].forEach(function (x) {
                var el = f(x[0]), sai = !e(el.value).trim();
                el.classList.toggle('is-invalid', sai);
                if (sai) thieu.push(x[1]);
            });
            if (thieu.length) ui.toast('Kiểm tra lại: ' + thieu.join(', '), 'warn');
            return !thieu.length;
        }
        function luu(tiep) {
            if (!hopLe()) return;
            var sua = S.sua;
            var v = { ten: f('ten').value.trim(), ma: f('ma').value.trim(), loai: f('loai').value, cha: f('cha').value, ghichu: f('ghichu').value.trim() };
            var tham = cfg.luuThamSo(v, sua ? sua.ID : '');
            tham.action = cfg.ctl + (sua ? '/CapNhat' : '/ThemMoi');
            ums.api.call(tham).then(function () {
                ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                if (tiep) { vietLai(); napCay(); return; }
                if (sua) { sang('ct'); napCay(sua.ID); }
                else { sang(S.chon ? 'ct' : 'nhac'); napCay(); }
            }).catch(function (err) { ums.api.handle(err, tham.action); });
        }

        /* ---------- Xoá ---------- */
        function xoa() {
            if (!S.chon) { ui.toast('Vui lòng chọn đơn vị!', 'warn'); return; }
            var row = S.chon;
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không? (' + e(row.TEN) + ')', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: cfg.xoa, strId: row.ID, strNguoiThucHien_Id: '' }).then(function () {
                    ui.toast('Xóa thành công!', 'ok');
                    S.chon = null;
                    vietLai();
                    sang('nhac');
                    napCay();
                }).catch(function (err) { ums.api.handle(err, cfg.xoa); });
            });
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !root.contains(b) || b.tagName === 'SELECT' || b.tagName === 'INPUT') return;
            switch (b.getAttribute('data-a')) {
                case 'them': moForm(null); break;
                case 'sua': if (S.chon) moForm(S.chon); break;
                case 'xoa': xoa(); break;
                case 'luu': luu(false); break;
                case 'luutiep': luu(true); break;
                case 'vietlai': vietLai(); break;
                case 'dong': sang(S.chon && tim(S.chon.ID) ? 'ct' : 'nhac'); break;
            }
        });

        ui.enhance(root);
        napCay();
    }
})();
