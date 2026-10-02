/* =========================================================================
   Khung chung "Định hướng của chương trình đào tạo" — ums.khctDH
   Dùng ở:  tochucchuongtrinh/dinhhuong  (khai báo: có "Thêm mới", không có cột người học)
            hoatdong/dinhhuong           (như gốc: sửa / xoá + Danh sách theo định hướng + Chia nhóm)
   Bản gốc chạy được: ApisKeHoachChuongTrinh/Modules/hoatdong/{html,script}/dinhhuong.*
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
     Danh sách   KHCT_ThongTin_MH · pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong (phân trang máy chủ)
                 strTuKhoa, strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id
     Lưu         KHCT_ThongTin/Them_DaoTao_CT_DinhHuong (strId rỗng) · KHCT_ThongTin/Sua_DaoTao_CT_DinhHuong
                 (kiểu cũ, KHÔNG func / iM — như gốc; thân có cả 'type': 'POST' như gốc)
     Xoá         KHCT_ThongTin/Xoa_DaoTao_CT_DinhHuong (strIds)
     Người học theo định hướng:
                 pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong_NH (đã thêm, phân trang máy chủ)
                 pkg_kehoach_thongtin2.LayDSNguoiHocChuaPhanDinhHuong (chưa thêm)
                 pkg_kehoach_thongtin.Them_DaoTao_CT_DinhHuong_NH · Xoa_DaoTao_CT_DinhHuong_NH (strIds)
     Nhóm:       pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom (phân trang) · Them_/Sua_/Xoa_DaoTao_CT_DH_Nhom (strId)
     Người học theo nhóm:
                 pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_ChuaNhom_NH · LayDSDaoTao_CT_DH_Nhom_NH
                 Them_DaoTao_CT_DH_Nhom_NH · Xoa_DaoTao_CT_DH_Nhom_NH (strId)
     Danh mục    DAOTAO.CTDT.DINHHUONG.CHEDO (Chế độ đăng ký định hướng)
     Hệ → Khoá → Chương trình: ums.ref.cascadeQuyen (= edu.extend.genBoLoc_HeKhoa("_DH") — procedure …Quyen).

   Không chép (lỗi rõ của bản gốc):
     · Ô "Nhập từ khóa tìm kiếm" có trên màn nhưng lời gọi đọc 'txtAAAA' (không bao giờ gửi) → nay gửi strTuKhoa.
     · Lưu định hướng xong KHÔNG nạp lại danh sách, ở lại biểu mẫu → nay về danh sách và nạp lại (khuôn crud).
       Xoá xong ở lại biểu mẫu của bản ghi đã xoá → nay về danh sách.
     · Biểu mẫu "Nhóm" (gốc là hộp thoại; nay mở ngay trong trang, thay chỗ bảng nhóm): gốc lưu xong hộp vẫn mở
       với id rỗng, bấm Lưu lần hai là thêm TRÙNG → nay lưu xong đóng biểu mẫu.
     · Đóng khung "Sinh viên thuộc nhóm" về thẳng danh sách định hướng → nay về khung "Chia nhóm định hướng"
       (nạp lại để cột "Số SV" đúng).
   Bỏ (mã chết, không có đường vào ở html gốc): getList_KhoanThu, getList_DoiTac (Tài chính), nút
     "Thêm thành viên" qua hộp chọn SV (btnSearchDTSV_SinhVien — bị chú thích ở html) cùng 5 trình xử lý
     #modal_sinhvien (btnAdd_He/Khoa/…) và lời gọi XLHV_ThongTin/Them_XLHV_DSKhongXuLy_PhamVi (bị ghi đè ngay).

   Cách dùng:  ums.khctDH.man(root, { tieuDe, them: true|false, nguoiHoc: true|false })
     them      có nút "Thêm mới" (biểu mẫu thêm có Hệ → Khoá → Chương trình, theo QUYỀN)
     nguoiHoc  có cột "Danh sách theo định hướng" / "Chia nhóm định hướng"
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var TT = 'KHCT_ThongTin_MH/', TT2 = 'KHCT_ThongTin2_MH/';
    var P1 = 'pkg_kehoach_thongtin.', P2 = 'pkg_kehoach_thongtin2.';

    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function call(o) { return ums.api.call(Object.assign({ strNguoiThucHien_Id: '' }, o)); }
    function ctTen(r) { return e(r.DAOTAO_TOCHUCCHUONGTRINH_TEN) + ' - ' + e(r.DAOTAO_TOCHUCCHUONGTRINH_MA); }

    /* Cột người học — chép tên cột của genTable_SinhVien / SVChuaThem / DaThem / ChuaThem */
    function cotSV(dinhHuong) {
        return [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
            { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
            { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' },
            { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
        ].concat(dinhHuong ? [{ title: 'Định hướng', prop: 'DAOTAO_CT_DINHHUONG_TENDAYDU' }] : []);
    }

    /* Hai bảng "đã thêm / chưa thêm" = ums.pat.haiLuoi, nhưng giữ THỨ TỰ của bản gốc: "Danh sách đã thêm"
       (nút Xóa) đứng TRƯỚC "Danh sách chưa thêm" (nút Thêm). ngang: hai cột cạnh nhau (col-sm-6 của gốc). */
    function hai(host, o, ngang, dongAttr) {
        var hl = pat.haiLuoi(host, o);
        var pChua = host.children[0], wrap = host.children[1], pDa = wrap.firstElementChild;
        host.insertBefore(pDa, pChua);
        wrap.appendChild(pChua);
        if (ngang) { host.classList.add('ums-grid', 'ums-grid--2', 'ums-cols'); wrap.classList.remove('ums-u-mt-4'); }
        // Nút Đóng ngoài cùng bên trái nhóm nút của khung đầu tiên
        pDa.querySelector('.ums-panel__tools').insertAdjacentHTML('afterbegin', ui.btn('close', { attr: dongAttr }));
        return hl;
    }

    function man(root, o) {
        o = o || {};
        var them = !!o.them, nguoiHoc = !!o.nguoiHoc;
        var crud, cas = null, casForm = null;

        /* ---------- Danh sách định hướng (khuôn A: một cột, biểu mẫu thay chỗ danh sách) ---------- */
        var columns = [
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Chương trình', cls: 'is-center', render: function (r) { return esc(ctTen(r)); } },
            { title: 'Tên định hướng', prop: 'TEN' },
            { title: 'Mã định hướng', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Chế độ đăng ký', prop: 'CHEDODANGKYDINHHUONG_TEN' },
            { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' }
        ];
        if (nguoiHoc) {
            columns.push(
                { title: 'Danh sách theo định hướng', cls: 'is-center', render: function (r) {
                    return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-dh': 'sv', 'data-id': r.ID } }); } },
                { title: 'Chia nhóm định hướng', cls: 'is-center', render: function (r) {
                    return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-dh': 'nhom', 'data-id': r.ID } }); } });
        }

        var fields = [];
        if (them) {
            fields.push(
                { key: '_he', label: 'Hệ đào tạo', type: 'select', placeholder: 'Chọn hệ đào tạo' },
                { key: '_khoa', label: 'Khóa đào tạo', type: 'select', placeholder: 'Chọn khóa đào tạo' },
                { key: 'strDaoTao_ChuongTrinh_Id', label: 'Chương trình', type: 'select', required: true, placeholder: 'Chọn chương trình đào tạo' },
                { key: '_g0', type: 'gap' });
        }
        fields.push(
            { key: 'strTen', col: 'TEN', label: 'Tên định hướng', required: true },
            { key: 'strMa', col: 'MA', label: 'Mã định hướng', required: true },
            { key: 'strCheDoDangKyDinhHuong_Id', col: 'CHEDODANGKYDINHHUONG_ID', label: 'Chế độ đăng ký định hướng', type: 'select',
                source: { dm: 'DAOTAO.CTDT.DINHHUONG.CHEDO' } },
            { key: '_g1', type: 'gap' },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày kết thúc', type: 'date' });

        crud = ums.crud({
            root: root,
            title: o.tieuDe || 'Định hướng',
            formTitle: 'định hướng',
            icon: 'fa-signs-post',
            canAdd: them,
            multi: false,
            rowDelete: false,
            filters: [
                { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
                { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
                { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ],
            list: {
                paged: true,
                call: function (f) {
                    return {
                        action: TT + 'DSA4BRIFIC4VIC4eAhUeBSgvKQk0Li8m',
                        func: P1 + 'LayDSDaoTao_CT_DinhHuong',
                        strTuKhoa: f.q,
                        strDaoTao_HeDaoTao_Id: f.he,
                        strDaoTao_KhoaDaoTao_Id: f.khoa,
                        strDaoTao_ChuongTrinh_Id: f.ct,
                        strNguoiThucHien_Id: ''
                    };
                }
            },
            columns: columns,
            fields: fields,
            onForm: function (row, c) {
                var t = c.z('ftitle');
                if (t) t.textContent = (row ? 'Sửa' : 'Thêm') + ' định hướng cho chương trình' + (row ? ': ' + ctTen(row) : '');
                if (!them) return;
                // Thêm: chọn Hệ → Khoá → Chương trình (đi theo ô lọc); Sửa: chương trình lấy từ dòng, ẩn ba ô
                ['_he', '_khoa', 'strDaoTao_ChuongTrinh_Id', '_g0'].forEach(function (k) { var w = wrap(k); if (w) w.hidden = !!row; });
                c.fieldDef('strDaoTao_ChuongTrinh_Id').required = !row;
                if (!row && casForm && cas) casForm.set(cas.values());
            },
            save: function (v, row) {
                var ct = row ? e(row.DAOTAO_TOCHUCCHUONGTRINH_ID) : v.strDaoTao_ChuongTrinh_Id;
                if (!ct) { ui.toast('Vui lòng chọn chương trình đào tạo', 'warn'); return null; }
                var x = {
                    action: 'KHCT_ThongTin/Them_DaoTao_CT_DinhHuong',
                    type: 'POST',
                    strId: row ? row.ID : '',
                    strDaoTao_ChuongTrinh_Id: ct,
                    strTen: v.strTen,
                    strMa: v.strMa,
                    strCheDoDangKyDinhHuong_Id: v.strCheDoDangKyDinhHuong_Id,
                    strNgayBatDau: v.strNgayBatDau,
                    strNgayKetThuc: v.strNgayKetThuc,
                    strNguoiThucHien_Id: ''
                };
                if (x.strId) x.action = 'KHCT_ThongTin/Sua_DaoTao_CT_DinhHuong';
                return x;
            },
            remove: function (ids) {
                return ids.map(function (id) {
                    return { action: 'KHCT_ThongTin/Xoa_DaoTao_CT_DinhHuong', strIds: id, strNguoiThucHien_Id: '' };
                });
            }
        });

        function fel(scope, k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="' + scope + '"][data-k="' + k + '"]'); }
        function wrap(k) {
            var x = fel('form', k);
            if (x) { var f = x.closest('.ums-field'); return f ? f.parentNode : null; }
            // ô 'gap' không mang data-k: tìm theo vị trí sau ô chương trình
            if (k === '_g0') { var ct = wrap('strDaoTao_ChuongTrinh_Id'); return ct ? ct.nextElementSibling : null; }
            return null;
        }

        cas = ums.ref.cascadeQuyen({ he: fel('filter', 'he'), khoa: fel('filter', 'khoa'), ct: fel('filter', 'ct') });
        if (them) casForm = ums.ref.cascadeQuyen({ he: fel('form', '_he'), khoa: fel('form', '_khoa'), ct: fel('form', 'strDaoTao_ChuongTrinh_Id') });

        if (!nguoiHoc) return crud;

        /* ---------- Các khung thay chỗ danh sách (zone-bus của gốc) ---------- */
        var box = document.createElement('div');
        box.innerHTML = '<div data-dz="sv" hidden></div><div data-dz="nhom" hidden></div><div data-dz="svnhom" hidden></div>';
        root.appendChild(box);
        function dz(k) { return box.querySelector('[data-dz="' + k + '"]'); }
        var tieuDeGoc = (root.querySelector('.ums-page__title') || {}).textContent || '';
        var dangMo = null, dh = null, nhom = null;

        function tieuDe(s) { var h = root.querySelector('.ums-page__title'); if (h) h.textContent = s; }
        function mo(k, ten) {
            var tu = dangMo ? dz(dangMo) : crud.z('list');
            var act = crud.z('actions'); if (act) act.hidden = true;
            tieuDe(ten);
            dangMo = k;
            ui.swap(tu, dz(k), { top: true });
        }
        function veDanhSach() {
            if (!dangMo) return;
            var tu = dz(dangMo);
            dangMo = null;
            var act = crud.z('actions'); if (act) act.hidden = false;
            tieuDe(tieuDeGoc);
            ui.swap(tu, crud.z('list'), { top: true });
        }
        function tim(id) { return crud.rows.filter(function (r) { return r.ID === id; })[0]; }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-dh]');
            if (!b || !root.contains(b) || b.disabled) return;
            var k = b.getAttribute('data-dh');
            if (k === 'sv' || k === 'nhom') {
                var r = tim(b.getAttribute('data-id'));
                if (!r) return;
                dh = r;
                if (k === 'sv') moSV(); else moNhom();
            } else if (k === 'dong') veDanhSach();
            else if (k === 'dongnhom') moNhom();
            else if (k === 'themnhom') hopNhom(null);
            else if (k === 'suanhom') hopNhom(dsNhom.filter(function (x) { return x.ID === b.getAttribute('data-id'); })[0]);
            else if (k === 'svnhom') moSVNhom(dsNhom.filter(function (x) { return x.ID === b.getAttribute('data-id'); })[0]);
            else if (k === 'xoanhom') xoaNhom();
        });

        /* ---------- Danh sách theo định hướng (zoneSinhVien) ---------- */
        var hlSV = hai(dz('sv'), {
            da: { title: 'Danh sách đã thêm', icon: 'fa-user-check', columns: cotSV(true), nut: { text: 'Xóa' }, canChon: 'Vui lòng chọn đối tượng cần xóa?',
                onHuy: function (rows) {
                    ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                        if (!yes) return;
                        chay(rows.map(function (r) {
                            return { action: TT + 'GS4gHgUgLhUgLh4CFR4FKC8pCTQuLyYeDwkP', func: P1 + 'Xoa_DaoTao_CT_DinhHuong_NH',
                                strIds: r.ID, strNguoiThucHien_Id: '' };
                        }), 'Xóa người học khỏi định hướng', napSV);
                    });
                } },
            chua: { title: 'Danh sách chưa thêm', icon: 'fa-user-plus', columns: cotSV(false), nut: { text: 'Thêm thành viên', icon: 'fa-plus' },
                canChon: 'Vui lòng chọn đối tượng?',
                onDangKy: function (rows) {
                    chay(rows.map(function (a) {
                        return { action: TT + 'FSkkLB4FIC4VIC4eAhUeBSgvKQk0Li8mHg8J', func: P1 + 'Them_DaoTao_CT_DinhHuong_NH',
                            strDaoTao_ChuongTrinh_Id: e(dh.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_CT_DinhHuong_Id: dh.ID,
                            strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strSoQuyetDinh: '', strNgayQuyetDinh: '', strMoTa: '',
                            strNguoiThucHien_Id: '' };
                    }), 'Thêm người học vào định hướng', napSV);
                } }
        }, false, { 'data-dh': 'dong' });

        function chay(calls, title, sau) {
            if (!calls.length) return;
            ui.batch(calls, { title: title }).then(function () { sau(); }).catch(function (err) { ums.api.handle(err, title); sau(); });
        }

        var svTrang = { index: 1, size: 10 };
        function moSV() {
            svTrang.index = 1;
            mo('sv', 'Danh sách theo định hướng: ' + e(dh.TEN) + (dh.MA ? ' - ' + dh.MA : ''));
            napSV();
        }
        function napSV() { napDaThem(); napChuaThem(); }
        function napDaThem() {
            hlSV.dang('da');
            call({ action: TT + 'DSA4BRIFIC4VIC4eAhUeBSgvKQk0Li8mHg8J', func: P1 + 'LayDSDaoTao_CT_DinhHuong_NH',
                strTuKhoa: '', strDaoTao_ChuongTrinh_Id: e(dh.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_CT_DinhHuong_Id: dh.ID,
                pageIndex: svTrang.index, pageSize: svTrang.size }).then(function (r) {
                var d = arr(r.data), tong = Number(r.pager) || d.length;
                hlSV.ve('da', d);
                var zd = hlSV.bang('da');
                var pg = { index: svTrang.index, size: svTrang.size, total: tong,
                    onChange: function (p) { if (p < 1 || p > Math.ceil(tong / svTrang.size)) return; svTrang.index = p; napDaThem(); },
                    onSize: function (s) { svTrang.size = s; svTrang.index = 1; napDaThem(); } };
                if (tong > d.length || svTrang.index > 1) { zd.insertAdjacentHTML('beforeend', ui.pager(pg, d.length)); ui.pagerBind(zd, pg); }
                var n = dz('sv').querySelector('[data-z="n_da"]'); if (n) n.textContent = '(' + tong + ')';
            }).catch(function (err) { hlSV.loi('da', err.message); ums.api.handle(err, 'danh sách đã thêm'); });
        }
        function napChuaThem() {
            hlSV.dang('chua');
            call({ action: TT2 + 'DSA4BRIPJjQuKAkuIgIpNCARKSAvBSgvKQk0Li8m', func: P2 + 'LayDSNguoiHocChuaPhanDinhHuong',
                strDaoTao_ChuongTrinh_Id: e(dh.DAOTAO_TOCHUCCHUONGTRINH_ID) }).then(function (r) {
                hlSV.ve('chua', arr(r.data));
            }).catch(function (err) { hlSV.loi('chua', err.message); ums.api.handle(err, 'danh sách chưa thêm'); });
        }

        /* ---------- Chia nhóm định hướng (zoneChiaNhom) ---------- */
        dz('nhom').innerHTML = pat.panel({ title: 'Chia nhóm định hướng', icon: 'fa-people-group', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('close', { attr: { 'data-dh': 'dong' } }) +
                ui.btn('add', { text: 'Thêm', attr: { 'data-dh': 'themnhom' } }) +
                ui.xoaChon('input[data-nk]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-dh': 'xoanhom' } }) });
        var dsNhom = [], nhomTrang = { index: 1, size: 10 };
        function zn(k) { return dz('nhom').querySelector('[data-z="' + k + '"]'); }
        function moNhom() {
            nhomTrang.index = 1;
            mo('nhom', 'Chia nhóm định hướng: ' + e(dh.TEN) + (dh.MA ? ' - ' + dh.MA : ''));
            napNhom();
        }
        function napNhom() {
            zn('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            call({ action: TT2 + 'DSA4BRIFIC4VIC4eAhUeBQkeDykuLAPP', func: P2 + 'LayDSDaoTao_CT_DH_Nhom',
                strTuKhoa: '', strDaoTao_ChuongTrinh_Id: e(dh.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_CT_DinhHuong_Id: dh.ID,
                pageIndex: nhomTrang.index, pageSize: nhomTrang.size }).then(function (r) {
                dsNhom = arr(r.data);
                var tong = Number(r.pager) || dsNhom.length;
                zn('n').textContent = '(' + tong + ')';
                ui.table({ el: zn('bang'), rows: dsNhom, empty: 'Chưa có nhóm',
                    page: { index: nhomTrang.index, size: nhomTrang.size, total: tong,
                        onChange: function (p) { if (p < 1 || p > Math.ceil(tong / nhomTrang.size)) return; nhomTrang.index = p; napNhom(); },
                        onSize: function (s) { nhomTrang.size = s; nhomTrang.index = 1; napNhom(); } },
                    columns: [
                        { title: 'Mã nhóm', prop: 'MA', cls: 'is-nowrap' },
                        { title: 'Tên nhóm', prop: 'TEN' },
                        { title: 'Định hướng', prop: 'DAOTAO_CT_DINHHUONG_TEN' },
                        { title: 'Số SV', cls: 'is-center', render: function (x) {
                            var n = x.SOSVTHUOCNHOM;
                            return ui.btn('view', { text: n ? String(n) : 'Xem', cls: 'ums-btn--sm', attr: { 'data-dh': 'svnhom', 'data-id': x.ID } }); } },
                        { title: 'Sửa', cls: 'is-actions', width: '64px', render: function (x) {
                            return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-dh="suanhom" data-id="' + esc(x.ID) + '" title="Sửa">' +
                                '<i class="fa-light fa-pen-to-square"></i></button>'; } },
                        { head: '<input type="checkbox" data-nk="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                            render: function (x) { return '<input type="checkbox" data-nk="' + esc(x.ID) + '">'; } }
                    ] });
            }).catch(function (err) { zn('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách nhóm'); });
        }
        dz('nhom').addEventListener('change', function (ev) {
            var c = ev.target;
            if (!c.matches || !c.matches('input[data-nk="all"]')) return;
            Array.prototype.forEach.call(zn('bang').querySelectorAll('tbody input[data-nk]'), function (x) { x.checked = c.checked; });
        });
        function xoaNhom() {
            var ids = Array.prototype.map.call(zn('bang').querySelectorAll('tbody input[data-nk]:checked'), function (x) { return x.getAttribute('data-nk'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                chay(ids.map(function (id) {
                    return { action: TT2 + 'GS4gHgUgLhUgLh4CFR4FCR4PKS4s', func: P2 + 'Xoa_DaoTao_CT_DH_Nhom', strId: id, strNguoiThucHien_Id: '' };
                }), 'Xóa nhóm', napNhom);
            });
        }
        /* Biểu mẫu nhóm (thêm / sửa) mở NGAY TRONG TRANG, thay chỗ bảng nhóm (pat.formTrang — BO-CUC luật 1,
           rà hộp thoại 2026-09-30; gốc là hộp thoại). Thân đã tự bọc lưới hai cột → cols: 1. */
        function hopNhom(x) {
            var dlg = pat.formTrang({ host: dz('nhom'), title: 'Nhóm', icon: 'fa-people-group', cols: 1,
                body: '<div class="ums-grid ums-grid--2">' +
                    '<div>' + ui.field('Mã nhóm', '<input class="ums-input" data-n="ma" autocomplete="off">') + '</div>' +
                    '<div>' + ui.field('Tên nhóm', '<input class="ums-input" data-n="ten" autocomplete="off">') + '</div></div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) { luu(api); return false; } }] });
            function n(k) { return dlg.body.querySelector('[data-n="' + k + '"]'); }
            n('ma').value = x ? e(x.MA) : '';
            n('ten').value = x ? e(x.TEN) : '';
            function luu(api) {
                var q = {
                    action: TT2 + 'FSkkLB4FIC4VIC4eAhUeBQkeDykuLAPP', func: P2 + 'Them_DaoTao_CT_DH_Nhom',
                    strId: x ? x.ID : '', strTen: n('ten').value.trim(), strMa: n('ma').value.trim(),
                    strDaoTao_ChuongTrinh_Id: e(dh.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_CT_DinhHuong_Id: dh.ID,
                    strNguoiThucHien_Id: ''
                };
                if (q.strId) { q.action = TT2 + 'EjQgHgUgLhUgLh4CFR4FCR4PKS4s'; q.func = P2 + 'Sua_DaoTao_CT_DH_Nhom'; }
                call(q).then(function () {
                    ui.toast(q.strId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                    api.close();
                    napNhom();
                }).catch(function (err) { ums.api.handle(err, 'lưu nhóm'); });
            }
        }

        /* ---------- Danh sách sinh viên thuộc nhóm (zoneSVNhom — hai cột như gốc) ---------- */
        var hlNhom = hai(dz('svnhom'), {
            da: { title: 'Danh sách đã thêm', icon: 'fa-user-check', columns: cotSV(false), nut: { text: 'Xóa' }, canChon: 'Vui lòng chọn đối tượng cần xóa?',
                onHuy: function (rows) {
                    ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                        if (!yes) return;
                        chay(rows.map(function (r) {
                            return { action: TT2 + 'GS4gHgUgLhUgLh4CFR4FCR4PKS4sHg8J', func: P2 + 'Xoa_DaoTao_CT_DH_Nhom_NH',
                                strId: r.ID, strNguoiThucHien_Id: '' };
                        }), 'Xóa người học khỏi nhóm', napSVNhom);
                    });
                } },
            chua: { title: 'Danh sách chưa thêm', icon: 'fa-user-plus', columns: cotSV(false), nut: { text: 'Thêm', icon: 'fa-plus' },
                canChon: 'Vui lòng chọn đối tượng?',
                onDangKy: function (rows) {
                    chay(rows.map(function (a) {
                        return { action: TT2 + 'FSkkLB4FIC4VIC4eAhUeBQkeDykuLB4PCQPP', func: P2 + 'Them_DaoTao_CT_DH_Nhom_NH',
                            strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: a.DAOTAO_TOCHUCCHUONGTRINH_ID,
                            strDaoTao_CT_DH_Nhom_Id: nhom.ID, strDaoTao_CT_DinhHuong_Id: a.DAOTAO_CT_DINHHUONG_ID,
                            strNguoiThucHien_Id: '' };
                    }), 'Thêm người học vào nhóm', napSVNhom);
                } }
        }, true, { 'data-dh': 'dongnhom' });

        function moSVNhom(x) {
            if (!x) return;
            nhom = x;
            mo('svnhom', 'Danh sách sinh viên thuộc nhóm - ' + e(x.TEN) + ' - ' + e(x.MA));
            napSVNhom();
        }
        function napSVNhom() {
            hlNhom.dang('da'); hlNhom.dang('chua');
            call({ action: TT2 + 'DSA4BRIFIC4VIC4eAhUeBQkeDykuLB4PCQPP', func: P2 + 'LayDSDaoTao_CT_DH_Nhom_NH',
                strDaoTao_CT_DH_Nhom_Id: nhom.ID }).then(function (r) { hlNhom.ve('da', arr(r.data)); })
                .catch(function (err) { hlNhom.loi('da', err.message); ums.api.handle(err, 'danh sách đã thêm'); });
            call({ action: TT2 + 'DSA4BRIFIC4VIC4eAhUeBQkeAik0IA8pLiweDwkP', func: P2 + 'LayDSDaoTao_CT_DH_ChuaNhom_NH',
                strDaoTao_ChuongTrinh_Id: e(dh.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_CT_DinhHuong_Id: dh.ID }).then(function (r) { hlNhom.ve('chua', arr(r.data)); })
                .catch(function (err) { hlNhom.loi('chua', err.message); ums.api.handle(err, 'danh sách chưa thêm'); });
        }

        return crud;
    }

    ums.khctDH = { man: man, cotSV: cotSV };
})();
