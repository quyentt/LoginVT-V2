/* =========================================================================
   Chương trình – học phần (KHCT) — ba vùng CHỌN HỌC PHẦN
   Bản gốc: ApisKeHoachChuongTrinh/Modules/chuongtrinhhocphan/script/cthp.js
     hp    zone_inputhocphan                "Chọn học phần cho chương trình"
     kbb   zone_inputhocphan_khoibatbuoc    "Khối bắt buộc"      (Thông tin khối + chọn học phần)
     ktcd  zone_inputhocphan_khoituchondon  "Khối tự chọn đơn"   (Thông tin khối + chọn học phần + "Bắt buộc")
   Cả ba dùng khung hai danh sách K.ghep (_chung.js).

   Lời gọi (chép nguyên):
     hp:   KHCT_HocPhan/LayDanhSach (GET, pageSize 10000)          "Tìm từ danh mục" (cột ID, MA, TEN, HOCTRINH, LAMONTINHDIEM)
           KHCT_HocPhan_ChuongTrinh/LayDanhSach (GET)             "Tìm theo chương trình" (Khoá → Chương trình ở "Nâng cao")
           edu.system.getList_ChuongTrinhDaoTao (ums.ref.chuongTrinh, chỉ strKhoaDaoTao_Id, pageSize 10000)
           KHCT_HocPhan_ChuongTrinh/ThemMoi (iThuTu) · CapNhat (dThuTu) · Xoa
     kbb:  KHCT_HocPhan_ChuongTrinh/LayDSKS_DaoTao_HocPhan_CT_N (GET + type 'GET') "Tìm trong chương trình"
           KHCT_HocPhan/LayDSKS_DaoTao_HocPhan_N (GET + type 'GET')                 "Tìm trong Danh mục"
           KHCT_ThongTin/Them_DaoTao_KhoiBatBuoc · Sua_DaoTao_KhoiBatBuoc (POST, KHÔNG iM — như gốc)
           KHCT_KhoiBatBuoc/Xoa · KHCT_HocPhan_KhoiBatBuoc/LayDanhSach · ThemMoi · CapNhat · Xoa
     ktcd: pkg_kehoach_thongtin.Them_/Sua_DaoTao_KhoiTuChon_Don · KHCT_KhoiTuChon_Don/Xoa
           KHCT_HocPhan_KhoiTuChon_Don/LayDanhSach · Xoa
           pkg_kehoach_thongtin.Them_DaoTao_HP_KTuChon_Don · Sua_DaoTao_HocPhan_KTuChon_Don
     danh mục: KHCT.PHANLOAI (DAOTAO.PHANLOAI.KHOIKIENTHUC)

   LỖI BẢN GỐC — làm theo ý định:
     · Lưu khối / lưu học phần của chương trình xong, các dòng vừa thêm KHÔNG được gắn id dòng đã
       lưu (thuộc tính name vẫn rỗng) → bấm Lưu lần hai là THÊM TRÙNG. Nay lưu xong nạp lại danh
       sách phải (có id) — lần Lưu sau là Cập nhật.
     · "Bỏ Chọn" học phần ĐÃ LƯU xoá ngay không hỏi → nay hỏi lại trước khi xoá.
     · "Tìm theo chương trình": gốc gửi rỗng khi chưa chọn chương trình (lấy học phần MỌI chương
       trình). Nay bắt chọn chương trình trước.
     · Học phần lấy "theo chương trình" rồi Lưu: gốc tra số tín / tính điểm trong danh sách "từ danh
       mục" (dtHocPhan) — không có thì gửi 0. Nay học phần từ chương trình gửi số tín học tập / học
       phí / tính điểm của CHÍNH dòng đó (HOCTRINHAPDUNGHOCTAP, HOCTRINHAPDUNGTINHHOCPHI,
       LAMONTINHDIEMTHEOCHUONGTRINH); từ danh mục vẫn gửi HOCTRINH / LAMONTINHDIEM như gốc.
     · Tham số tìm kiếm của getList_HocPhanSelect / getList_HocPhanDanhMuc: gốc tính giá trị ô tìm
       rồi bỏ đi (`strTuKhoa ? strTuKhoa : …` không gán) — lúc mở vùng gửi rỗng, bấm nút gửi ô tìm.
       Giữ đúng như vậy.
     · Khối tự chọn đơn: ô "Loại đơn vị" và "Đơn vị lựa chọn" không có trên html gốc (khối bị chú
       thích) → strLoaiLuaChon_Id / dDonViLuaChon gửi rỗng như gốc. Ô "Bắt buộc" chỉ có ở học phần
       đã lưu (học phần mới gửi dLaHocPhanBatBuoc rỗng — như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat, K = ums.khctCt;
    if (!K || !K.api) return;
    var e = K.e, esc = K.esc, rows = K.rows;
    var TT = 'KHCT_ThongTin_MH/', PK = 'pkg_kehoach_thongtin.';

    function muc(r, hpCot, luu) {
        return { hp: e(r[hpCot]), luu: luu ? e(r.ID) : '', row: r, chu: K.tenHP(r), bb: r.LAHOCPHANBATBUOC ? 1 : 0 };
    }
    function fld(nhan, html, rong) {
        return '<div class="ums-field"' + (rong ? ' style="grid-column:1 / -1"' : '') + '><label class="ums-field__label">' + esc(nhan) + '</label>' +
            '<div class="ums-field__control">' + html + '</div></div>';
    }
    function inp(k, ph) { return '<input class="ums-input" data-k="' + k + '" placeholder="' + esc(ph) + '" autocomplete="off">'; }
    function sel(k, ph, opts) { return '<select class="ums-select" data-k="' + k + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option>' + (opts || '') + '</select>'; }
    function val(host, k) { var x = host.querySelector('[data-k="' + k + '"]'); return x ? pat.val(x) : ''; }
    function dat(host, k, v) {
        var x = host.querySelector('[data-k="' + k + '"]');
        if (!x) return;
        x.value = v === undefined || v === null ? '' : v;
        if (window.jQuery) jQuery(x).trigger('change.select2').trigger('ums:refresh');
    }

    /* =====================================================================
       1. CHỌN HỌC PHẦN CHO CHƯƠNG TRÌNH (hp)
       ===================================================================== */
    var H = K.vung('hp',
        pat.panel({ title: 'Chọn học phần cho chương trình', icon: 'fa-book-open-reader', count: 'ten', cls: 'khct-vung',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body: '<div data-z="ghep"></div>',
            foot: '<div class="ums-u-flex1"></div>' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }) }));
    function hz(k) { return H.querySelector('[data-z="' + k + '"]'); }
    var nangCao =
        '<div class="khct-nangcao" data-z="nc" hidden>' +
            '<div class="ums-u-faint ums-u-fz13 ums-u-mb-2"><i>Chọn điều kiện tìm kiếm:</i></div>' +
            '<div class="ums-grid ums-grid--2">' +
                '<div class="ums-field">' + sel('khoa', '-- Chọn khóa đào tạo --') + '</div>' +
                '<div class="ums-field">' + sel('ctTim', '-- Chọn chương trình--') + '</div>' +
            '</div></div>';
    var gHP = K.ghep(hz('ghep'), {
        traiTieuDe: 'Xác định học phần cho chương trình', traiIcon: 'fa-book',
        phaiTieuDe: 'Danh sách kết quả học phần chương trình',
        traiTools:
            ui.btn('search', { text: 'Tìm từ danh mục', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': 'timDM', title: 'Tìm các học phần từ danh mục sẵn có' } }) +
            ui.btn('search', { text: 'Tìm theo chương trình', mod: 'out-success', cls: 'ums-btn--sm', attr: { 'data-a': 'timCT', title: 'Tìm học phần từ chương trình trước' } }) +
            '<button type="button" class="ums-btn ums-btn--ghost ums-btn--sm" data-a="nangCao" title="Tìm kiếm nâng cao"><i class="fa-light fa-sliders"></i><span>Nâng cao</span></button>',
        traiTren: nangCao,
        them: 'dau', napLai: true,
        onBoLuu: function (m) {
            return ums.api.call({ action: 'KHCT_HocPhan_ChuongTrinh/Xoa', strIds: m.luu, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); K.taiHP(); });
        }
    });
    ui.enhance(H);
    var dsDM = [];      // me.dtHocPhan — kết quả "Tìm từ danh mục"

    function napKhoaHP(list) {
        var s = H.querySelector('[data-k="khoa"]');
        if (s) pat.fill(s, list || K.dsKhoa, { name: 'TENKHOA', head: '-- Chọn khóa đào tạo --' });
    }
    function napCTHP() {
        var s = H.querySelector('[data-k="ctTim"]');
        if (!val(H, 'khoa')) { pat.fill(s, [], { head: '-- Chọn chương trình--' }); return; }
        ums.ref.chuongTrinh({ strKhoaDaoTao_Id: val(H, 'khoa'), pageIndex: 1, pageSize: 10000 })
            .then(function (r) { pat.fill(s, r, { name: 'TENCHUONGTRINH', head: '-- Chọn chương trình--' }); })
            .catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
    }
    if (window.jQuery) jQuery(H.querySelector('[data-k="khoa"]')).on('select2:select select2:clear', napCTHP);
    pat.chain([H.querySelector('[data-k="khoa"]'), H.querySelector('[data-k="ctTim"]')], { phatLai: false });

    K.moChonHP = function () {
        hz('ten').textContent = ': ' + e(K.ct && K.ct.TENCHUONGTRINH);
        gHP.xoaTim();
        gHP.nhac('Nhập từ khoá rồi bấm "Tìm từ danh mục" hoặc chọn chương trình ở "Nâng cao" rồi bấm "Tìm theo chương trình"');
        gHP.phai(K.dsHP.map(function (r) { return muc(r, 'DAOTAO_HOCPHAN_ID', true); }));
        napKhoaHP();
        K.api.hien('hp');
    };
    function timDM() {
        gHP.dang();
        ums.api.call({ action: 'KHCT_HocPhan/LayDanhSach', method: 'GET',
            strTuKhoa: gHP.tuKhoa(), strDaoTao_MonHoc_Id: '', strThuocBoMon_Id: '', strThuocTinhHocPhan_Id: '', strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 10000 })
            .then(function (r) {
                dsDM = rows(r);
                gHP.trai(dsDM.map(function (x) { var m = muc(x, 'ID'); m.nguon = 'dm'; return m; }));
            }).catch(function (err) { gHP.nhac('Không tải được học phần'); ums.api.handle(err, 'học phần từ danh mục'); });
    }
    function timCT() {
        var ct = val(H, 'ctTim');
        if (!ct) { ui.toast('Chọn khóa đào tạo và chương trình ở "Nâng cao" trước.', 'warn'); H.querySelector('[data-z="nc"]').hidden = false; return; }
        gHP.dang();
        ums.api.call({ action: 'KHCT_HocPhan_ChuongTrinh/LayDanhSach', method: 'GET',
            strTuKhoa: gHP.tuKhoa(), strDaoTao_ThoiGian_KH_Id: '', strDaoTao_ThoiGian_TT_Id: '', strThuocTinhHocPhan_Id: '',
            strPhanCongPhamViDamNhiem_Id: '', strDaoTao_HocPhan_Id: '', strDaoTao_ChuongTrinh_Id: ct, pageIndex: 1, pageSize: 100000000 })
            .then(function (r) {
                gHP.trai(rows(r).map(function (x) { var m = muc(x, 'DAOTAO_HOCPHAN_ID'); m.nguon = 'ct'; return m; }));
            }).catch(function (err) { gHP.nhac('Không tải được học phần'); ums.api.handle(err, 'học phần theo chương trình'); });
    }
    function luuHP() {
        var ds = gHP.dsPhai();
        if (!ds.length) { ui.toast('Chưa có học phần nào trong danh sách kết quả.', 'warn'); return; }
        ui.confirm('Bạn có muốn thực hiện cập nhật không', { title: 'Lưu học phần của chương trình', ok: 'Cập nhật' }).then(function (yes) {
            if (!yes) return;
            var calls = ds.map(function (m, i) {
                if (m.luu) {
                    /* save_HocPhan_ChuongTrinh_Old: giữ mọi cột, chỉ đổi thứ tự (dThuTu = vị trí) */
                    var o = K.timHP(m.luu) || m.row;
                    return { action: 'KHCT_HocPhan_ChuongTrinh/CapNhat', strId: o.ID,
                        dHocTrinh_HocTap: e(o.HOCTRINHAPDUNGHOCTAP), dHocTrinh_TinhTien: e(o.HOCTRINHAPDUNGTINHHOCPHI),
                        dLaMonTinhDiem: e(o.LAMONTINHDIEMTHEOCHUONGTRINH), strDaoTao_ThoiGian_KH_Id: e(o.DAOTAO_THOIGIAN_KEHOACH_ID),
                        strDaoTao_ThoiGian_TT_Id: e(o.DAOTAO_THOIGIAN_THUCTE_ID), strThuocTinhHocPhan_Id: e(o.THUOCTINHHOCPHAN_ID),
                        strPhanCongPhamViDamNhiem_Id: e(o.PHANCONGPHAMVIDAMNHIEM_ID), strDaoTao_HocPhan_Id: e(o.DAOTAO_HOCPHAN_ID),
                        strDaoTao_ChuongTrinh_Id: e(o.DAOTAO_TOCHUCCHUONGTRINH_ID), dThuTu: i, strNguoiThucHien_Id: '' };
                }
                var r = m.row, tin = 0, phi = 0, diem = 0;
                if (m.nguon === 'ct') { tin = r.HOCTRINHAPDUNGHOCTAP || 0; phi = r.HOCTRINHAPDUNGTINHHOCPHI || 0; diem = r.LAMONTINHDIEMTHEOCHUONGTRINH || 0; }
                else {
                    var d = dsDM.filter(function (x) { return x.ID === m.hp; })[0];
                    if (d) { tin = d.HOCTRINH; phi = d.HOCTRINH; diem = d.LAMONTINHDIEM; }
                }
                return { action: 'KHCT_HocPhan_ChuongTrinh/ThemMoi', strId: '',
                    dHocTrinh_HocTap: e(tin), dHocTrinh_TinhTien: e(phi), dLaMonTinhDiem: e(diem),
                    strDaoTao_ThoiGian_KH_Id: '', strDaoTao_ThoiGian_TT_Id: '', strThuocTinhHocPhan_Id: '', strPhanCongPhamViDamNhiem_Id: '',
                    strDaoTao_HocPhan_Id: m.hp, strDaoTao_ChuongTrinh_Id: K.ctId(), iThuTu: i, strNguoiThucHien_Id: '' };
            });
            ui.batch(calls, { title: 'Đang lưu học phần của chương trình', okText: 'Cập nhật thành công!' }).then(function () {
                K.taiHP().then(function () { gHP.phai(K.dsHP.map(function (r) { return muc(r, 'DAOTAO_HOCPHAN_ID', true); })); });
            });
        });
    }
    H.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !H.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'dong') K.veCT();
        else if (a === 'luu') luuHP();
        else if (a === 'timDM') timDM();
        else if (a === 'timCT') timCT();
        else if (a === 'nangCao') { var nc = H.querySelector('[data-z="nc"]'); nc.hidden = !nc.hidden; b.classList.toggle('is-on', !nc.hidden); }
    });

    /* =====================================================================
       2. KHỐI BẮT BUỘC (kbb) và 3. KHỐI TỰ CHỌN ĐƠN (ktcd) — cùng một khuôn
       ===================================================================== */
    function taoKhoi(c) {
        var cur = null;          // khối đang sửa (null = thêm mới)
        var W = K.vung(c.khu,
            pat.panel({ title: c.tieuDe, icon: 'fa-screen-users', cls: 'khct-vung',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                body:
                    '<div class="ums-legend">' + esc(c.nhomTT) + '</div>' +
                    '<div class="ums-grid ums-grid--2">' + c.form + '</div>' +
                    (c.chuY ? '<p class="ums-u-faint ums-u-fz13 ums-u-mt-3"><i>' + esc(c.chuY) + '</i></p>' : '') +
                    '<div class="ums-legend ums-legend--cach">Học phần của khối</div>' +
                    '<div data-z="ghep"></div>',
                foot: ui.btn('del', { text: 'Xóa khối', attr: { 'data-a': 'xoa' } }) + '<div class="ums-u-flex1"></div>' +
                    ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }) }));
        var titleEl = W.querySelector('.ums-panel__title');
        var g = K.ghep(W.querySelector('[data-z="ghep"]'), {
            traiTieuDe: c.traiTieuDe, phaiTieuDe: c.phaiTieuDe, them: 'cuoi', batBuoc: c.batBuoc,
            traiTools:
                ui.btn('search', { text: 'Tìm trong chương trình', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': 'timCT' } }) +
                ui.btn('search', { text: 'Tìm trong Danh mục', mod: 'out-success', cls: 'ums-btn--sm', attr: { 'data-a': 'timDM' } }),
            onBoLuu: function (m) {
                return ums.api.call({ action: c.ctlHP + 'Xoa', strIds: m.luu, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); c.taiCay(); });
            }
        });
        ui.enhance(W);
        ums.api.dm('DAOTAO.PHANLOAI.KHOIKIENTHUC').then(function (r) {
            pat.fill(W.querySelector('[data-k="phanLoai"]'), r, { head: 'Chọn phân loại khối' });
        }).catch(function () {});

        /* getList_HocPhanSelect / getList_HocPhanDanhMuc — kết quả đổ vào danh sách trái */
        function timTrong(kieu, tuKhoa) {
            g.dang();
            var call = kieu === 'ct'
                ? { action: 'KHCT_HocPhan_ChuongTrinh/LayDSKS_DaoTao_HocPhan_CT_N', method: 'GET', type: 'GET', strTuKhoa: tuKhoa,
                    strDaoTao_ThoiGian_KH_Id: '', strDaoTao_ThoiGian_TT_Id: '', strThuocTinhHocPhan_Id: '', strPhanCongPhamViDamNhiem_Id: '',
                    strDaoTao_HocPhan_Id: '', strDaoTao_ChuongTrinh_Id: K.ctId(), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 }
                : { action: 'KHCT_HocPhan/LayDSKS_DaoTao_HocPhan_N', method: 'GET', type: 'GET', strTuKhoa: tuKhoa,
                    strDaoTao_MonHoc_Id: '', strThuocBoMon_Id: '', strThuocTinhHocPhan_Id: '', strDaoTao_ChuongTrinh_Id: K.ctId(),
                    strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 };
            return ums.api.call(call).then(function (r) {
                g.trai(rows(r).map(function (x) { return muc(x, 'DAOTAO_HOCPHAN_ID'); }));
            }).catch(function (err) { g.nhac('Không tải được học phần'); ums.api.handle(err, 'tìm học phần'); });
        }
        function napPhai() {
            if (!cur) { g.phai([]); return Promise.resolve(); }
            var p = { action: c.ctlHP + 'LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HocPhan_Id: '',
                strDaoTao_ToChucCT_Id: K.ctId(), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 };
            p[c.khoiThamSo] = cur.ID;
            return ums.api.call(p).then(function (r) {
                g.phai(rows(r).map(function (x) { return muc(x, 'DAOTAO_HOCPHAN_ID', true); }));
            }).catch(function (err) { ums.api.handle(err, 'học phần của khối'); });
        }
        function napCha(list) {
            pat.fill(W.querySelector('[data-k="cha"]'), list, { name: 'TEN', head: c.chaHead });
        }

        function mo(row) {
            cur = row;
            titleEl.innerHTML = '<i class="fa-light fa-screen-users"></i> ' + esc(row ? c.tieuDe + ': ' + e(row.TEN) : 'Thêm mới ' + c.tieuDe.toLowerCase());
            napCha(c.dsCha());
            c.dien(W, row || {}, dat);
            g.xoaTim();
            /* Xóa khối chỉ hiện khi đang sửa khối KHÔNG có khối con (gốc: children.length > 0 → ẩn) */
            W.querySelector('[data-a="xoa"]').hidden = !row || K.coCon(c.dsCha(), c.chaCot, row.ID);
            timTrong('ct', '');                   // gốc: toggle_… → getList_HocPhanSelect() (từ khoá rỗng)
            napPhai();
            K.api.hien(c.khu);
        }
        function luu() {
            var o = c.thamSo(W, val);
            if (cur) {
                if (cur.ID === o[c.chaThamSo]) { ui.toast('Khối cha không thể chọn chính nó', 'warn'); return; }
                o.action = c.sua.action; if (c.sua.func) o.func = c.sua.func;
                o.strId = cur.ID;
            }
            ums.api.call(o).then(function (r) {
                var moi = !cur;
                var id = cur ? cur.ID : ((r.raw && r.raw.Id) || '');
                ui.toast(moi ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
                if (!id) { c.taiCay(); return; }
                cur = cur || { ID: id, TEN: o.strTen };
                titleEl.innerHTML = '<i class="fa-light fa-screen-users"></i> ' + esc(c.tieuDe + ': ' + e(o.strTen));
                var calls = g.dsPhai().map(function (m, i) { return c.luuHP(m, i, id); });
                return ui.batch(calls, { title: 'Đang lưu học phần của khối', okText: 'Đã lưu học phần' }).then(function () {
                    c.taiCay().then(function () {
                        var r2 = c.dsCha().filter(function (x) { return x.ID === id; })[0];
                        if (r2) cur = r2;
                        W.querySelector('[data-a="xoa"]').hidden = K.coCon(c.dsCha(), c.chaCot, id);
                    });
                    return napPhai();
                });
            }).catch(function (err) { ums.api.handle(err, 'lưu ' + c.tieuDe.toLowerCase()); });
        }
        function xoa() {
            if (!cur) return;
            ui.confirm('Bạn có chắc chắn muốn xóa khối "' + e(cur.TEN) + '"?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: c.ctlKhoi + 'Xoa', strIds: cur.ID, strNguoiThucHien_Id: '' }).then(function () {
                    ui.toast('Xóa dữ liệu thành công!', 'ok');
                    K.veCT();
                    c.taiCay();
                });
            }).catch(function (err) { ums.api.handle(err, 'xoá khối'); });
        }
        W.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !W.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'dong') K.veCT();
            else if (a === 'luu') luu();
            else if (a === 'xoa') xoa();
            else if (a === 'timCT') timTrong('ct', g.tuKhoa());
            else if (a === 'timDM') timTrong('dm', g.tuKhoa());
        });
        return mo;
    }

    K.moKBB = taoKhoi({
        khu: 'kbb', tieuDe: 'Khối bắt buộc', nhomTT: 'Thông tin khối bắt buộc',
        traiTieuDe: 'Xác định học phần cho khối bắt buộc', phaiTieuDe: 'Danh sách kết quả học phần khối bắt buộc',
        ctlKhoi: 'KHCT_KhoiBatBuoc/', ctlHP: 'KHCT_HocPhan_KhoiBatBuoc/', khoiThamSo: 'strDaoTao_KhoiBatBuoc_Id',
        chaCot: 'DAOTAO_KHOIBATBUOC_CHA_ID', chaThamSo: 'strDaoTao_KhoiBatBuoc_Cha_Id', chaHead: 'Chọn khối cha',
        dsCha: function () { return K.dsKBB; },
        taiCay: function () { return K.taiKBB(); },
        form: fld('Tên khối', inp('ten', 'Tên khối')) + fld('Khối bắt buộc cha', sel('cha', 'Chọn khối cha')) +
            fld('Ký hiệu', inp('kyHieu', 'Ký hiệu')) + fld('Phân loại', sel('phanLoai', 'Chọn phân loại khối')) +
            fld('Thứ tự', inp('thuTu', 'Thứ tự')),
        dien: function (W, r, dat) {
            dat(W, 'ten', r.TEN); dat(W, 'cha', r.DAOTAO_KHOIBATBUOC_CHA_ID); dat(W, 'kyHieu', r.KYHIEU);
            dat(W, 'phanLoai', r.PHANLOAI_ID); dat(W, 'thuTu', r.THUTU);
        },
        thamSo: function (W, v) {
            return { action: 'KHCT_ThongTin/Them_DaoTao_KhoiBatBuoc', strId: '', strTen: v(W, 'ten'), strKyHieu: v(W, 'kyHieu'),
                strPhanLoai_Id: v(W, 'phanLoai'), strDaoTao_KhoiBatBuoc_Cha_Id: v(W, 'cha'), strDaoTao_ToChucCT_Id: K.ctId(),
                dThuTu: v(W, 'thuTu'), strNguoiThucHien_Id: '' };
        },
        sua: { action: 'KHCT_ThongTin/Sua_DaoTao_KhoiBatBuoc' },
        luuHP: function (m, i, khoiId) {
            return { action: 'KHCT_HocPhan_KhoiBatBuoc/' + (m.luu ? 'CapNhat' : 'ThemMoi'), strId: m.luu || '',
                strDaoTao_HocPhan_Id: m.hp, strDaoTao_ToChucCT_Id: K.ctId(), strDaoTao_KhoiBatBuoc_Id: khoiId, iThuTu: i, strNguoiThucHien_Id: '' };
        }
    });

    K.moKTCD = taoKhoi({
        khu: 'ktcd', tieuDe: 'Khối tự chọn đơn', nhomTT: 'Thông tin khối tự chọn đơn', batBuoc: true,
        traiTieuDe: 'Xác định học phần cho khối tự chọn đơn', phaiTieuDe: 'Danh sách kết quả học phần khối tự chọn đơn',
        ctlKhoi: 'KHCT_KhoiTuChon_Don/', ctlHP: 'KHCT_HocPhan_KhoiTuChon_Don/', khoiThamSo: 'strDaoTao_KTuChon_Don_Id',
        chaCot: 'DAOTAO_KHOITUCHON_DON_CHA_ID', chaThamSo: 'strDaoTao_KTuChon_Don_Cha_Id', chaHead: 'Chọn khối cha',
        dsCha: function () { return K.dsKTCD; },
        taiCay: function () { return K.taiKTCD(); },
        chuY: 'Chú ý: Chỉ nhập 1 trong 2 mục: số học phần quy định hoặc số tín chỉ quy định',
        form: fld('Tên khối', inp('ten', 'Tên khối')) + fld('Khối tự chọn cha', sel('cha', 'Chọn khối cha')) +
            fld('Ký hiệu', inp('kyHieu', 'Ký hiệu')) + fld('Số học phần/số môn quy định', inp('soHP', 'Số học phần/số môn quy định')) +
            fld('Số tín chỉ quy định', inp('soTin', 'Số tín chỉ quy định')) + fld('Phân loại', sel('phanLoai', 'Chọn phân loại khối')) +
            fld('Tính điểm, không tính điểm', '<select class="ums-select" data-k="khongTinhDiem" data-required><option value="1">Không tính điểm</option><option value="0">Tính điểm</option></select>') +
            fld('Xác định nhóm tự chọn', inp('nhom', 'Xác định nhóm tự chọn')) + fld('Thứ tự', inp('thuTu', 'Thứ tự')),
        dien: function (W, r, dat) {
            dat(W, 'ten', r.TEN); dat(W, 'cha', r.DAOTAO_KHOITUCHON_DON_CHA_ID); dat(W, 'kyHieu', r.KYHIEU);
            dat(W, 'soHP', r.SOHOCPHANQUYDINH); dat(W, 'soTin', r.SOTINCHIQUYDINH); dat(W, 'phanLoai', r.PHANLOAI_ID);
            dat(W, 'khongTinhDiem', r.KHONGTINHDIEM === undefined || r.KHONGTINHDIEM === null || r.KHONGTINHDIEM === '' ? '1' : r.KHONGTINHDIEM);
            dat(W, 'nhom', r.NHOM); dat(W, 'thuTu', r.THUTU);
        },
        thamSo: function (W, v) {
            return { action: TT + 'FSkkLB4FIC4VIC4eCikuKBU0AikuLx4FLi8P', func: PK + 'Them_DaoTao_KhoiTuChon_Don',
                strId: '', strTen: v(W, 'ten'), strKyHieu: v(W, 'kyHieu'), strDaoTao_KTuChon_Don_Cha_Id: v(W, 'cha'),
                strDaoTao_ToChucCT_Id: K.ctId(), strLoaiLuaChon_Id: '', dDonViLuaChon: '', dThuTu: v(W, 'thuTu'),
                strNguoiThucHien_Id: '', dSoHocPhanQuyDinh: v(W, 'soHP'), dSoTinChiQuyDinh: v(W, 'soTin'),
                strPhanLoai_Id: v(W, 'phanLoai'), dKhongTinhDiem: v(W, 'khongTinhDiem'), strNhom: v(W, 'nhom') };
        },
        sua: { action: TT + 'EjQgHgUgLhUgLh4KKS4oFTQCKS4vHgUuLwPP', func: PK + 'Sua_DaoTao_KhoiTuChon_Don' },
        luuHP: function (m, i, khoiId) {
            var o = { action: TT + 'FSkkLB4FIC4VIC4eCREeChU0AikuLx4FLi8P', func: PK + 'Them_DaoTao_HP_KTuChon_Don',
                strId: '', strDaoTao_HocPhan_Id: m.hp, strDaoTao_ToChucCT_Id: K.ctId(), strDaoTao_KTuChon_Don_Id: khoiId,
                dLaHocPhanBatBuoc: '', dThuTu: i, strNguoiThucHien_Id: '' };
            if (m.luu) {
                o.action = TT + 'EjQgHgUgLhUgLh4JLiIRKSAvHgoVNAIpLi8eBS4v';
                o.func = PK + 'Sua_DaoTao_HocPhan_KTuChon_Don';
                o.strId = m.luu;
                o.dLaHocPhanBatBuoc = m.bb ? 1 : 0;
            }
            return o;
        }
    });

    /* Danh sách khoá (theo Hệ của thanh lọc) đổi → đổ lại ô Khoá của "Nâng cao" */
    var cu = K.onKhoa;
    K.onKhoa = function (list) { if (cu) cu(list); napKhoaHP(list); };
    napKhoaHP();
})();
