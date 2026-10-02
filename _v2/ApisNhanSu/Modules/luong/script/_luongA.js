/* =========================================================================
   ums.luongA — khung dùng chung của NHÓM A module Lương (ApisNhanSu)
   ---------------------------------------------------------------------------
   Tệp mang hậu tố A vì module `luong` chia hai nhóm chuyển song song (nhóm B
   có tệp chung riêng). Chỉ các màn nhóm A nạp tệp này:
     bangTinh  — bangtinhluongnam, bangtinhluongvaphucap (hai tệp gốc chép nhau,
                 lệch action / tháng / định dạng tiền)
     cauTruc   — cautrucbangluong, cautrucbangluongnam, dieukienxetnangluong
                 (ba tệp gốc chép nhau: chọn quy định/kế hoạch → cây thành phần →
                 biểu mẫu thành phần + danh mục thành phần + từ khoá công thức)
     dsCanBo   — cột trái "Danh sách cán bộ" (getList_NhanSu) của
                 danhsachgiamtrugiacanh, khoanduocnhankhac
     thanhVien — ô "thành viên" nạp theo đơn vị (NS_HoSoV2/LayDanhSach kiểu cũ)
     cotLa     — cây THANHPHAN_ID/THANHPHAN_CHA_ID → cột lá kèm nhóm tiêu đề
                 (thay insertHeaderTable + recuseHeader của bản gốc)
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var A = ums.luongA = ums.luongA || {};

    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function jq(el) { return window.jQuery ? jQuery(el) : null; }
    A.e = e; A.arr = arr; A.uid = uid;
    A.rows = function (r) { return arr(r && r.data); };

    /* ---------- Cây thành phần → cột lá ---------------------------------
       Bản gốc: recuseHeader chèn tiêu đề nhiều tầng (rowspan/colspan), cột dữ
       liệu theo thứ tự lá. Ở đây: duyệt cây theo thứ tự máy chủ trả, mỗi lá
       một cột, tổ tiên là `group` của ums.ui.table. Gốc dùng THANHPHAN_CHA_ID
       == null làm gốc cây. */
    A.cotLa = function (tp) {
        var con = {}, co = {};
        (tp || []).forEach(function (x) { co[x.THANHPHAN_ID] = true; });
        tp.forEach(function (x) {
            var c = x.THANHPHAN_CHA_ID && co[x.THANHPHAN_CHA_ID] ? x.THANHPHAN_CHA_ID : '';
            (con[c] = con[c] || []).push(x);
        });
        var out = [];
        (function di(cha, path) {
            (con[cha] || []).forEach(function (x) {
                if (con[x.THANHPHAN_ID]) di(x.THANHPHAN_ID, path.concat([e(x.THANHPHAN_TEN)]));
                else out.push({ tp: x, group: path });
            });
        })('', []);
        return out;
    };

    /* ---------- Ô "thành viên" theo đơn vị -------------------------------
       NS_HoSoV2/LayDanhSach (GET, kiểu cũ) — chép nguyên tham số; tên hiện
       "HOTEN - MASO" như Render của genComBo_HS. */
    A.thanhVien = function (el, donViId, laNgoai, head) {
        return ums.api.call({
            action: 'NS_HoSoV2/LayDanhSach', method: 'GET',
            strTuKhoa: '', pageIndex: 1, pageSize: 100000,
            strDaoTao_CoCauToChuc_Id: donViId || '',
            strNguoiThucHien_Id: '',
            dLaCanBoNgoaiTruong: laNgoai
        }).then(function (r) {
            pat.fill(el, arr(r.data), { head: head, name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } });
            return arr(r.data);
        }).catch(function (err) { ums.api.handle(err, 'danh sách thành viên'); });
    };

    /** Cơ cấu tổ chức (edu.system.getList_CoCauToChuc, iTrangThai 1) vào một hay nhiều ô */
    A.coCau = function (els, head) {
        return ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }).then(function (rows) {
            (Array.isArray(els) ? els : [els]).forEach(function (el) { pat.fill(el, rows, { head: head }); });
            return rows;
        }).catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); return []; });
    };

    /** Danh mục đọc MỚI (không qua bộ nhớ đệm của ums.api.dm) — dùng khi màn vừa thêm/xoá dữ liệu danh mục */
    A.dmMoi = function (code) {
        return ums.api.call({
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM', method: 'GET', silent: true,
            strMaBangDanhMuc: code, strTieuChiSapXep: '', dTrangThai: 1
        }).then(function (r) { return arr(r.data); });
    };

    A.dangTai = function () { return '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>'; };

    /* Chạy nhiều lời gọi, tối đa n luồng cùng lúc (bản gốc bắn cùng lúc N×M request) */
    A.hang = function (viec, n) {
        var i = 0, chay = 0;
        return new Promise(function (xong) {
            if (!viec.length) { xong(); return; }
            function tiep() {
                while (chay < n && i < viec.length) {
                    chay++;
                    viec[i++]().catch(function () {}).then(function () { chay--; if (i >= viec.length && !chay) xong(); else tiep(); });
                }
            }
            tiep();
        });
    };

    /* =====================================================================
       BẢNG TÍNH LƯƠNG — bangtinhluongvaphucap / bangtinhluongnam
       ---------------------------------------------------------------------
       cfg = {
         root, tieuDe, khung (chữ đầu khung bảng), icon,
         thang: true            có ô Tháng (bản năm: ô tháng bị chú thích)
         cauTruc: 'L_CauTrucBangLuong/LayDanhSach' | 'L_LuongNam_CauTruc/LayDanhSach'
         duLieu(v) → lời gọi dữ liệu (rsNhanSu + rsDuLieuLuong)
         tinh(v)   → lời gọi "Tính lương"
         tien: true             ô định dạng tiền + dòng tổng (bản năm: số thô, không tổng)
       }
       v = { qd, loai, thang, nam, dv, tv }
       ===================================================================== */
    A.bangTinh = function (cfg) {
        var root = cfg.root;
        var fields = [
            { key: 'qd', label: 'Chọn quy định lương', type: 'select' },
            { key: 'loai', label: 'Chọn loại bảng lương', type: 'select' }
        ];
        if (cfg.thang) fields.push({ key: 'thang', label: 'Tháng' });
        fields.push({ key: 'nam', label: 'Năm' });
        fields.push({ key: 'dv', label: 'Tất cả đơn vị thành viên', type: 'select' });
        fields.push({ key: 'tv', label: 'Tất cả thành viên đăng ký', type: 'select' });

        root.innerHTML =
            pat.page(cfg.tieuDe, '<span data-z="report"></span>') +
            pat.filterBar(fields, {
                searchText: 'Xem',
                extra: '<div class="ums-field ums-field--fit">' +
                    ui.btn('save', { text: 'Tính lương', icon: 'fa-calculator', mod: 'out-warn', attr: { 'data-a': 'tinh' } }) + '</div>'
            }) +
            pat.panel({ title: cfg.khung, icon: cfg.icon || 'fa-file-invoice-dollar', flush: true, zone: 'bang',
                tools: '<b class="ums-u-fz13" data-z="ky"></b>',
                body: ui.empty('Chọn quy định lương, năm' + (cfg.thang ? ', tháng' : '') + ' rồi bấm Xem', 'fa-hand-pointer') });
        ui.enhance(root);

        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function v() {
            return {
                qd: f('qd').value, loai: f('loai').value, thang: cfg.thang ? f('thang').value.trim() : '',
                nam: f('nam').value.trim(), dv: f('dv').value, tv: f('tv').value
            };
        }

        ums.api.call({ action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('qd'), arr(r.data), { name: 'MUCLUONGCOBAN', head: 'Chọn quy định lương' }); })
            .catch(function (err) { ums.api.handle(err, 'quy định lương'); });
        ums.api.dm('NHANSU.LOAIBANGLUONG').then(function (r) { pat.fill(f('loai'), r, { head: 'Chọn loại bảng lương' }); })
            .catch(function (err) { ums.api.handle(err, 'loại bảng lương'); });
        A.coCau(f('dv'), 'Tất cả đơn vị thành viên');
        A.thanhVien(f('tv'), '', 0, 'Tất cả thành viên đăng ký');
        /* Đơn vị → Thành viên: nhãn "Tất cả …" = lọc TUỲ CHỌN nên không khoá ô con;
           chọn hoặc xoá đơn vị thì nạp lại và xoá trắng thành viên (gốc chỉ bắt select2:select). */
        if (window.jQuery) {
            jQuery(f('dv')).on('select2:select select2:clear', function () {
                f('tv').value = ''; jQuery(f('tv')).trigger('change.select2');
                A.thanhVien(f('tv'), f('dv').value, 0, 'Tất cả thành viên đăng ký');
            });
        }

        function veBang(cauTruc, duLieu) {
            var la = A.cotLa(cauTruc);
            var o = {};
            arr(duLieu.rsDuLieuLuong).forEach(function (d) { (o[d.NHANSU_HOSOCANBO_ID] = o[d.NHANSU_HOSOCANBO_ID] || {})[d.THANHPHAN_ID] = d.THANHPHAN_GIATRI; });
            function gt(r, id) { var x = (o[r.NHANSU_HOSOCANBO_ID] || {})[id]; return x === undefined ? '' : x; }
            var cols = [
                { title: 'Mã số', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center is-nowrap' },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(e(r.NHANSU_HOSOCANBO_HO) + ' ' + e(r.NHANSU_HOSOCANBO_TEN)); } },
                { title: 'CCTC', prop: 'DAOTAO_COCAUTOCHUC_TEN' }
            ].concat(la.map(function (l) {
                var id = l.tp.THANHPHAN_ID;
                return {
                    title: e(l.tp.THANHPHAN_TEN), group: l.group, cls: 'is-right is-nowrap',
                    render: function (r) { var x = gt(r, id); return x === '' ? '' : (cfg.tien ? ui.money(x) : esc(x)); },
                    sum: cfg.tien ? function (rows) {
                        return '<b>' + ui.money(rows.reduce(function (a, r) { return a + (Number(gt(r, id)) || 0); }, 0)) + '</b>';
                    } : undefined
                };
            }));
            ui.table({ el: z('bang'), columns: cols, rows: arr(duLieu.rsNhanSu), empty: 'Không có dữ liệu lương',
                tableCls: 'ums-table--lined ums-table--tight' });
        }

        function xem() {
            var x = v();
            if (!x.qd || !x.nam || (cfg.thang && !x.thang)) { ui.toast('Hãy nhập đủ thông tin', 'warn'); return; }
            z('ky').textContent = (cfg.thang ? 'THÁNG ' + x.thang + ' ' : '') + 'NĂM ' + x.nam;
            z('bang').innerHTML = A.dangTai();
            var cauTruc = [];
            ums.api.call({ action: cfg.cauTruc, method: 'GET', strNhanSu_QuyDinhLuong_Id: x.qd, strNguoiThucHien_Id: '', strLoaiBangLuong_Id: x.loai })
                .then(function (r) { cauTruc = arr(r.data); return ums.api.call(cfg.duLieu(x)); })
                .then(function (r) { veBang(cauTruc, r.data || {}); })
                .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, cfg.tieuDe); });
        }
        function tinh() {
            var c = cfg.tinh(v());
            ums.api.call(c).then(function () { ui.toast('Thực hiện tính lương thành công', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'tính lương'); });
        }

        root.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-a="search"]')) xem();
            else if (ev.target.closest('[data-a="tinh"]')) tinh();
        });

        ums.report.mount(z('report'), {
            import: false,                     // gốc chỉ có vùng "Xuất báo cáo" (không có vùng _Import)
            collect: function (add) {
                var x = v();
                add('strLoaiBangLuong_Id', x.loai);
                add('strNhanSu_QuyDinhLuong_Id', x.qd);
                add('strDaoTao_CoCauToChuc_Id', x.dv);
                add('strNhanSu_HoSoCanBo_Id', x.tv);
                add('dNam', x.nam);
                add('dThang', x.thang);        // bản năm: ô tháng bị chú thích → rỗng như gốc
                add('strNguoiDangNhap_Id', uid());
            }
        });
        return { xem: xem };
    };

    /* =====================================================================
       CẤU TRÚC THÀNH PHẦN — cautrucbangluong / cautrucbangluongnam /
       dieukienxetnangluong
       ---------------------------------------------------------------------
       Ba bước như gốc (toggle_overide zone-bus):
         1. Chọn quy định lương / kế hoạch xét (bảng + nút Chọn; một dòng thì tự chọn)
         2. Khung "Khởi tạo …": xem trước tiêu đề bảng theo cây thành phần + danh
            sách thành phần (ums.crud nhúng)
         3. Biểu mẫu thành phần (biểu mẫu của crud) + hai khung dưới: "Danh mục
            thành phần công thức" (NHANSU.THANHPHANLUONG; thêm/sửa là biểu mẫu con NGAY TRONG TRANG,
            thay chỗ hai khung này — ums.pat.formTrang, BO-CUC luật 1; trước 2026-09-30 là hộp thoại) và
            "Từ khóa cho công thức"
       cfg = {
         root, tieuDe, khung, khoi1, khoi2 (chữ hai khối trong bước 2), khoi3,
         chon: { title, call, columns } | null — null: không có bước 1 (bản năm)
         chonRieng: bản năm vẫn gọi danh sách quy định để lấy ID khi CHỈ có một dòng
         loai: true — có ô Loại bảng lương ở bước 2
         list(ctx), save(v, row, ctx), del(id) → lời gọi; columns, fields
         tuKhoa: action từ khoá · dmXoa: action xoá danh mục thành phần
         dmThanhPhan: mã danh mục thành phần (ô "Thành phần" = key cfg.tpKey)
       }
       ctx = { id (quy định / kế hoạch đang chọn), loai }
       ===================================================================== */
    A.cauTruc = function (cfg) {
        var root = cfg.root;
        var ctx = { id: '', loai: '' };
        var dmRows = [], dmBang = '';

        root.innerHTML =
            pat.page(cfg.tieuDe, '') +
            (cfg.chon ? '<div data-z="chon">' + pat.panel({ title: cfg.chon.title, icon: 'fa-list-check', flush: true, zone: 'chonBang', count: 'chonDem', body: A.dangTai() }) + '</div>' : '') +
            '<div data-z="ct"' + (cfg.chon ? ' hidden' : '') + '>' +
                '<div data-z="xemTruoc">' +
                pat.panel({
                    title: cfg.khung, icon: 'fa-sitemap',
                    tools: cfg.chon ? ui.btn('close', { attr: { 'data-a': 'dong' } }) : '',
                    body:
                        '<div class="ums-filter ums-u-mb-2"><div class="ums-field ums-u-flex1"><div class="ums-legend ums-u-mb-0">' + esc(cfg.khoi1) + '</div></div>' +
                        (cfg.loai ? '<div class="ums-field"><select class="ums-select" data-f="loai" data-required data-ph="Chọn loại bảng lương"><option value="">Chọn loại bảng lương</option></select></div>' : '') +
                        '</div><div data-z="tieuDe"></div>'
                }) + '</div>' +
                '<div class="ums-u-mt-4" data-z="crud"></div>' +
            '</div>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        var elLoai = root.querySelector('[data-f="loai"]');

        /* ---- Bước 2: xem trước tiêu đề ---------------------------------- */
        function veTieuDe(rows) {
            var la = A.cotLa(rows);
            ui.table({
                // Gốc chỉ vẽ phần tiêu đề (insertHeaderTable) — một dòng trống bên dưới cho thấy các cột
                el: z('tieuDe'), stt: false, rows: la.length ? [{}] : [], tableCls: 'ums-table--lined ums-table--tight',
                empty: 'Chưa có thành phần nào',
                columns: la.map(function (l) { return { title: e(l.tp.THANHPHAN_TEN), group: l.group, cls: 'is-center', render: function () { return '&nbsp;'; } }; })
            });
        }

        /* ---- Bước 2–3: thành phần = ums.crud nhúng ----------------------- */
        var crud = null;
        function taoCrud() {
            crud = ums.crud({
                root: z('crud'), embedded: true, autoload: false,
                title: cfg.khoi2, formTitle: cfg.formTitle || 'thành phần cấu trúc', icon: 'fa-list-tree',
                addText: 'Thêm thành phần', formCols: 3, multi: false,
                list: { call: function () { return cfg.list(ctx); } },
                columns: cfg.columns,
                fields: cfg.fields,
                save: function (vv, row) { return cfg.save(vv, row, ctx); },
                remove: function (ids) { return ids.map(cfg.del); },
                onLoad: function (rows) {
                    veTieuDe(rows);
                    var cha = crud.root.querySelector('[data-scope="form"][data-k="strThanhPhan_Cha_Id"]');
                    pat.fill(cha, rows, { id: 'THANHPHAN_ID', name: 'THANHPHAN_TEN', head: 'Chọn thành phần cha' });
                },
                onForm: function (row, c, extra) {
                    z('xemTruoc').hidden = true;
                    if (cfg.chon) z('chon').hidden = true;
                    veKhoi3(extra);
                },
                onList: function () { z('xemTruoc').hidden = false; }
            });
        }

        /* ---- Bước 3: danh mục thành phần công thức + từ khoá ------------- */
        var tuKhoa = null;
        function napTuKhoa() {
            if (!tuKhoa) {
                tuKhoa = ums.api.call({ action: cfg.tuKhoa, method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
                    .then(function (r) { return arr(r.data); })
                    .catch(function (err) { tuKhoa = null; ums.api.handle(err, 'từ khóa công thức'); return []; });
            }
            return tuKhoa;
        }
        /* Kiểm host 2026-09-30: danh sách theo MÃ bảng (LayDanhSachDuLieuTheoBangDM) được máy chủ nhớ tạm ~20 giây — thêm / sửa / xoá xong
           nạp lại vẫn ra danh sách CŨ, người dùng tưởng chưa lưu. Khi đã biết id bảng (dmBang) thì nạp bằng danh sách theo ID bảng
           (pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc — lời gọi của màn Danh mục dữ liệu, trả ngay bản mới và đủ cột để sửa). */
        function dmTheoBang() {
            return ums.api.call({
                action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFNA0oJDQFIC8pDDQi', func: 'pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc',
                strTuKhoa: '', strCHUNG_TENDANHMUC_Id: dmBang, strTieuChiSapXep: '', strQUANHECHA_Id: '', dTrangThai: 1,
                pageIndex: 1, pageSize: 1000000, silent: true
            }).then(function (r) { return (Array.isArray(r.data) ? r.data : []).filter(function (x) { return x.CHUNG_TENDANHMUC_ID === dmBang; }); });   // chỉ nhận dòng đúng bảng
        }
        function napDM() {
            return (dmBang ? dmTheoBang().then(function (r) { return r.length ? r : A.dmMoi(cfg.dmThanhPhan); }, function () { return A.dmMoi(cfg.dmThanhPhan); }) : A.dmMoi(cfg.dmThanhPhan).then(function (rows) {
                if (rows.length) dmBang = rows[0].CHUNG_TENDANHMUC_ID;
                return dmBang ? dmTheoBang().then(function (r) { return r.length ? r : rows; }, function () { return rows; }) : rows;   // lời gọi theo ID lỗi / rỗng thì dùng danh sách theo mã
            })).then(function (rows) {
                dmRows = rows;
                if (rows.length) dmBang = rows[0].CHUNG_TENDANHMUC_ID;
                var el = crud && crud.root.querySelector('[data-scope="form"][data-k="' + cfg.tpKey + '"]');
                if (el) {
                    // Nạp lại danh mục (lúc mở màn về chậm, hoặc sau khi thêm / sửa / xoá danh mục) KHÔNG được làm mất mục đang chọn ở biểu mẫu thành phần
                    var dangChon = el.value;
                    pat.fill(el, rows, { head: 'Chọn thành phần' });
                    if (dangChon && rows.some(function (x) { return String(x.ID) === String(dangChon); })) {
                        el.value = dangChon;
                        if (window.jQuery) jQuery(el).trigger('change.select2');
                    }
                }
                veDM();
                return rows;
            }).catch(function (err) { ums.api.handle(err, 'danh mục thành phần'); return []; });
        }
        var khoi3 = null, bmDM = null;      // bmDM: biểu mẫu con danh mục đang mở (ums.pat.formTrang)
        function veKhoi3(extra) {
            if (bmDM) bmDM.close();         // crud vừa dựng lại vùng extra — đóng biểu mẫu con cũ để trả nút Đóng của biểu mẫu thành phần
            khoi3 = extra;
            extra.innerHTML = '<div class="ums-grid ums-grid--2">' +
                pat.panel({ title: 'Danh mục thành phần công thức', icon: 'fa-list-ul', flush: true, zone: 'dm',
                    tools: ui.btn('add', { attr: { 'data-a': 'dmThem' } }), body: A.dangTai() }) +
                pat.panel({ title: 'Từ khóa cho công thức', icon: 'fa-key', flush: true, zone: 'tk', body: A.dangTai() }) +
                '</div>';
            veDM();
            napTuKhoa().then(function (rows) {
                ui.table({ el: extra.querySelector('[data-z="tk"]'), rows: rows, empty: 'Không có từ khóa', tableCls: 'ums-table--lined ums-table--tight',
                    columns: [{ title: 'Từ khóa', prop: 'TUKHOA', cls: 'is-nowrap' }, { title: 'Mô tả', prop: 'MOTA' }] });
            });
        }
        function veDM() {
            var host = khoi3 && khoi3.querySelector('[data-z="dm"]');
            if (!host) return;
            ui.table({
                el: host, rows: dmRows, empty: 'Không có dữ liệu', tableCls: 'ums-table--lined ums-table--tight',
                columns: [
                    { title: 'Tên thành phần', prop: 'TEN' },
                    { title: 'Mã thành phần', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Thao tác', cls: 'is-actions', width: '104px', render: function (r) { return ui.iconBtn('edit', r.ID) + ui.iconBtn('del', r.ID); } }
                ]
            });
        }
        /* Thêm / sửa một mục danh mục thành phần — biểu mẫu CON trong trang: vùng bị thay chỗ là khối dưới biểu mẫu thành phần
           (khoi3 = vùng `extra` của ums.crud, chứa hai khung danh mục + từ khoá), KHÔNG phải cả màn — biểu mẫu thành phần phía trên
           vẫn nguyên ô đang nhập. Đóng / lưu xong thì hai khung hiện lại. */
        function hopDM(row) {
            if (!khoi3 || !root.contains(khoi3)) return;
            var body = document.createElement('div');
            body.innerHTML = '<div class="ums-grid ums-grid--2">' +
                ui.field('Tên bảng', '<input class="ums-input" data-k="ten" autocomplete="off">') +
                ui.field('Mã bảng', '<input class="ums-input" data-k="ma" autocomplete="off">', { required: true }) + '</div>';
            body.querySelector('[data-k="ten"]').value = row ? e(row.TEN) : '';
            body.querySelector('[data-k="ma"]').value = row ? e(row.MA) : '';
            /* BO-CUC luật 18 (mỗi lúc MỘT nút Đóng): luật CSS chung chỉ ẩn nút Đóng tầng ngoài khi khung trong nằm TRONG .ums-panel của
               tầng ngoài; vùng extra của crud lại là khối ANH EM của khung biểu mẫu → tự ẩn nút Đóng của biểu mẫu thành phần ở đây. */
            var fz = crud && crud.z('form');
            var nutDongCha = fz ? fz.querySelector('.ums-panel__tools .ums-btn--dong') : null;
            bmDM = pat.formTrang({
                host: khoi3, title: row ? 'Chỉnh sửa' : 'Thêm mới danh mục dữ liệu', icon: row ? 'fa-pen-to-square' : 'fa-plus', body: body,
                onClose: function () { bmDM = null; if (nutDongCha) nutDongCha.hidden = false; },
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (dlg) {
                    var ma = body.querySelector('[data-k="ma"]').value.trim(), ten = body.querySelector('[data-k="ten"]').value.trim();
                    /* SỬA: bản gốc gọi ThemMoi kèm strId — kiểm host 2026-09-30: máy chủ báo thành công nhưng KHÔNG đổi gì. Dùng lời gọi
                       sửa của màn Danh mục dữ liệu (đã thử trên host: đổi đúng), giữ nguyên các cột khác của dòng. THÊM giữ như gốc. */
                    function c(k) { return row[k] === null || row[k] === undefined ? '' : row[k]; }
                    ums.api.call(row ? {
                        action: 'CMS_DanhMuc_MH/EjQgBTQNKCQ0BSAvKQw0IgPP', iM: ums.session.iM,
                        strMa: ma, strTen: ten, strQuanHeCha_Id: c('QUANHECHA_ID'), strChung_TenDanhMuc_Id: row.CHUNG_TENDANHMUC_ID || dmBang,
                        dHeSo1: row.HESO1 || 0, dHeSo2: row.HESO2 || 0, dHeSo3: row.HESO3 || 0,
                        strThongTin1: c('THONGTIN1'), strThongTin2: c('THONGTIN2'), strThongTin3: c('THONGTIN3'), strThongTin4: c('THONGTIN4'),
                        strThongTin5: c('THONGTIN5'), strThongTin6: c('THONGTIN6'), strThongTin7: c('THONGTIN7'), strThongTin8: c('THONGTIN8'),
                        strMoTa: c('MOTA'), strId: row.ID, dTrangThai: 1, strNguoiThucHien_Id: ''
                    } : {
                        action: 'CMS_DanhMucDuLieu/ThemMoi',
                        strMa: ma,
                        strTen: ten,
                        strId: '',
                        strCHUNG_TENDANHMUC_Id: dmBang,
                        dTrangThai: 1,
                        strNguoiThucHien_Id: uid()
                    }).then(function () {
                        ui.toast(row ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                        dlg.close();
                        napDM();
                    }).catch(function (err) { ums.api.handle(err, 'lưu danh mục thành phần'); });
                    return false;
                } }]
            });
            if (nutDongCha) nutDongCha.hidden = true;
            // formTrang cuộn trang về đầu (hợp với biểu mẫu thay cả màn); biểu mẫu con này nằm DƯỚI biểu mẫu thành phần → kéo nó vào tầm nhìn
            if (bmDM.el.scrollIntoView) bmDM.el.scrollIntoView({ block: 'nearest' });
        }
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a], [data-act]');
            if (!b || !root.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'dong') { ui.swap(z('ct'), z('chon')); return; }
            if (a === 'chon') { chon(b.getAttribute('data-id')); return; }
            if (a === 'dmThem') { hopDM(null); return; }
            if (!b.closest('[data-z="dm"]')) return;
            var id = b.getAttribute('data-id');
            var row = dmRows.filter(function (r) { return r.ID === id; })[0];
            if (b.getAttribute('data-act') === 'edit' && row) hopDM(row);
            if (b.getAttribute('data-act') === 'del' && row) {
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
                    if (!ok) return;
                    ums.api.call({ action: cfg.dmXoa, strId: id, strNguoiThucHien_Id: uid() })
                        .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); napDM(); })
                        .catch(function (err) { ums.api.handle(err, 'xoá danh mục thành phần'); });
                });
            }
        });

        /* ---- Bước 1: chọn quy định / kế hoạch ----------------------------- */
        function chon(id) {
            ctx.id = id || '';
            if (cfg.chon) ui.swap(z('chon'), z('ct'));
            if (crud.z('form') && !crud.z('form').hidden) crud.showList();
            crud.load(1);
        }
        function napChon() {
            ums.api.call(cfg.chon ? cfg.chon.call : cfg.chonRieng).then(function (r) {
                var rows = arr(r.data);
                if (cfg.chon) {
                    var dem = root.querySelector('[data-z="chonDem"]');
                    if (dem) dem.textContent = '(' + (r.pager || rows.length) + ')';
                    ui.table({
                        el: z('chonBang'), rows: rows, empty: 'Không có dữ liệu', tableCls: 'ums-table--lined',
                        columns: cfg.chon.columns.concat([{ title: 'Xem', cls: 'is-center', width: '96px', render: function (x) {
                            return ui.btn('confirm', { text: 'Chọn', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': 'chon', 'data-id': x.ID } });
                        } }])
                    });
                }
                if (rows.length === 1) chon(rows[0].ID);
                else if (!cfg.chon) chon('');
            }).catch(function (err) {
                if (cfg.chon) z('chonBang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, cfg.chon ? cfg.chon.title : 'quy định lương');
                if (!cfg.chon) chon('');
            });
        }

        napDM().then(function () {
            taoCrud();
            if (elLoai) {
                ums.api.dm('NHANSU.LOAIBANGLUONG').then(function (rows) {
                    pat.fill(elLoai, rows, { head: 'Chọn loại bảng lương' });
                    if (rows.length === 1) { elLoai.value = rows[0].ID; if (window.jQuery) jQuery(elLoai).trigger('change.select2'); }   // selectOne của gốc
                    ctx.loai = elLoai.value;
                    napChon();
                }).catch(function (err) { ums.api.handle(err, 'loại bảng lương'); napChon(); });
                if (window.jQuery) jQuery(elLoai).on('select2:select select2:clear', function () { ctx.loai = elLoai.value; crud.load(1); });
            } else napChon();
            // Ô "Thành phần" nạp từ danh mục đã tải trước khi dựng crud
            var el = crud.root.querySelector('[data-scope="form"][data-k="' + cfg.tpKey + '"]');
            if (el) pat.fill(el, dmRows, { head: 'Chọn thành phần' });
        });
        return { ctx: ctx };
    };

    /* =====================================================================
       CỘT TRÁI "DANH SÁCH CÁN BỘ" — danhsachgiamtrugiacanh, khoanduocnhankhac
       ---------------------------------------------------------------------
       Bản gốc: ô từ khoá + (kéo xuống) Khoa/Viện/Phòng ban, Bộ môn (+ ô riêng
       của màn) → edu.system.getList_NhanSu (strCoCauToChuc_Id = khoa, không có
       thì bộ môn; dLaCanBoNgoaiTruong 0; phân trang). Bấm một cán bộ → cột phải.
       Khoa / Bộ môn KHÔNG nối tầng ở gốc (bộ môn = mọi đơn vị con, không lọc
       theo khoa) — giữ nguyên.
       o = { root, tieuDe, locThem: HTML ô lọc thêm, actions: HTML nút đầu trang,
             onPick(row), nhac: câu dẫn cột phải }
       trả { m (pat.master), loc(key) → phần tử, chon, tai() }
       ===================================================================== */
    /* Cột trái "Danh sách cán bộ" — từ 2026-09-26 là lớp bọc của khung chung
       ums.pat.dsNhanSu (patterns.js). Màn tự vẽ cột phải vào m.mainBody.
       o = { root, tieuDe, actions, locThem: HTML ô lọc riêng, nhac, onPick(r) }
       → { m, loc('khoa'|'bomon'|'tt'|<data-f của locThem>), chon(), tai(trang) } */
    A.dsCanBo = function (o) {
        var m = pat.master({
            el: o.root, title: o.tieuDe, actions: o.actions || '',
            side: { title: 'Danh sách cán bộ', icon: 'fa-users', search: 'Nhập từ khóa tìm kiếm',
                    filter: pat.dsNhanSuLoc({ locThem: o.locThem }) },
            main: { title: false }
        });
        m.el.classList.add('ums-dsns');
        m.mainBody.innerHTML = pat.panel({ title: 'Thông tin chung', icon: 'fa-circle-info',
            body: ui.empty(o.nhac || 'Chọn một cán bộ ở danh sách bên trái', 'fa-hand-pointer') });
        var ds = pat.dsNhanSu(m, { onPick: function (r) { if (o.onPick) o.onPick(r); } });
        var MAP = { khoa: ds.F.cctc, bomon: ds.F.bomon, tt: ds.F.tt };
        function f(k) { return MAP[k] || o.root.querySelector('[data-f="' + k + '"]'); }
        return { m: m, loc: f, chon: ds.chon, tai: ds.load };
    };
})();
