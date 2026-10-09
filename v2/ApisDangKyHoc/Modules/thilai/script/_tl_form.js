/* =========================================================================
   Kế hoạch thi lại — các khối con trong biểu mẫu kế hoạch (ums.tlKh.formExtra)
   Bản gốc: ApisDangKyHoc/Modules/thilai/html/kehoach.html (#zoneEdit) + script/kehoach.js
   ---------------------------------------------------------------------------
   Bố cục như bản gốc: hai cột dưới khối "Thông tin kế hoạch" —
       trái : Thời gian · Chọn đợt thi · Danh sách các học phần không đăng ký
       phải : Danh sách phạm vi · Danh sách các học phần mở đăng ký
   (bản gốc dùng col-sm-6 thả trôi; học phần không đăng ký rơi xuống dưới cột trái)

   Lời gọi (chép nguyên văn):
     Thời gian (ums.pat.rows — lưu SAU kế hoạch, mỗi dòng một lời gọi)
       DKH_DangKyThi_MonThi_Chung/LayDSDangKy_Thi_HP_KH_ThoiGian   GET  strDangKy_Thi_HP_KeHoach_Id
       DKH_DangKyThi_MonThi_Chung/Them_DangKy_Thi_HP_KH_ThoiGian   dòng mới  (strId "")
       DKH_DangKyThi_MonThi_Chung/Sua_DangKy_Thi_HP_KH_ThoiGian    dòng đã có (strId = ID dòng)
       DKH_DangKyThi_MonThi_Chung/Xoa_DangKy_Thi_HP_KH_ThoiGian    strId
       ô chọn: KHCT_ThoiGianDaoTao/LayDanhSach GET (strDAOTAO_Nam_Id "", strTuKhoa "", 1/1000000)
               cột DAOTAO_THOIGIANDAOTAO; dòng bỏ trống thì không lưu (như gốc)
     Chọn đợt thi
       PKG_DANGKYTHI_MONTHI_CHUNG.LayDSDangKy_Thi_HP_KH_DotThi  (cột THI_DOTTHI_TEN)
       PKG_DANGKYTHI_MONTHI_CHUNG.LayDSDotThi                   hộp "Thêm mới - Chọn đợt thi"
                                                                (THI_DOTTHI_TEN || TENDOTTHI)
       PKG_DANGKYTHI_MONTHI_CHUNG.Them_DangKy_Thi_HP_KH_DotThi  strThi_DotThi_Id = ID dòng hộp
       PKG_DANGKYTHI_MONTHI_CHUNG.Xoa_DangKy_Thi_HP_KH_DotThi   strId
     Danh sách phạm vi (ums.pat.phamVi — lưu SAU kế hoạch)
       DKH_DangKyThi_MonThi_Chung/LayDSDangKy_Thi_HP_KH_PhamVi  GET  (cột PHAMVIAPDUNG_TEN)
       DKH_DangKyThi_MonThi_Chung/Them_DangKy_Thi_HP_KH_PhamVi  strId = strPhamViApDung_Id = id phạm vi
                         (bản gốc gửi strId = id phạm vi dù là lời gọi THÊM — nghi ngờ, giữ nguyên)
       DKH_DangKyThi_MonThi_Chung/Xoa_DangKy_Thi_HP_KH_PhamVi   strId
     Học phần mở đăng ký / không đăng ký
       PKG_DANGKYTHI_MONTHI_CHUNG.LayDSDangKy_Thi_HP_KH_HocPhan / _KHocPhan
       PKG_DANGKYTHI_MONTHI_CHUNG.Them_DangKy_Thi_HP_KH_HocPhan / _KHocPhan  strDaoTao_HocPhan_Id
       PKG_DANGKYTHI_MONTHI_CHUNG.Xoa_DangKy_Thi_HP_KH_HocPhan  / _KHocPhan  strId
       cột DAOTAO_HOCPHAN_MA, _TEN, _SOTIN, _DONVI; "Thêm" mở hộp chọn học phần (T.pickHocPhan)

   Cố ý bỏ: khối "Phạm vi đăng ký" (#tbl_HeKhoa, Hệ × Khoá, "Thêm dòng mới") —
   bản gốc để display:none vĩnh viễn và lời lưu của nó đã bị chú thích bỏ.
   Khác bản gốc (lỗi rõ):
     · Kế hoạch chưa lưu (Thêm mới): bản gốc chặn "Thêm mới" đợt thi nhưng vẫn
       cho thêm học phần với strDangKy_Thi_HP_KeHoach_Id RỖNG. Ở đây ba khối
       Đợt thi / Học phần đều chặn và nhắc lưu kế hoạch trước.
     · Xoá học phần (hai khối) bản gốc không hỏi lại — ở đây hỏi lại như mọi
       nút xoá nhiều dòng.
     · "Thêm từng hệ" của hộp chọn sinh viên (btnAdd_He) chưa có trong
       ums.pat.phamVi (mới có khoá / chương trình / lớp) — cần tầng chung bổ sung.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, T = ums.tlKh;
    var AC = T.AC, CH = 'DKH_DangKyThi_MonThi_Chung_MH/', PK = 'PKG_DANGKYTHI_MONTHI_CHUNG.';

    var tgP = null;
    function thoiGian() {
        if (!tgP) {
            tgP = ums.api.call({
                action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', silent: true,
                strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000
            }).then(T.ds, function (err) { tgP = null; throw err; });
        }
        return tgP;
    }
    T.thoiGian = thoiGian;

    var CHUA_LUU = 'Vui lòng lưu kế hoạch trước khi thêm';

    /** Khối bảng + Xoá đã chọn + Thêm, dùng cho Đợt thi và hai khối học phần */
    function khoi(host, o) {
        var rows = [];
        host.innerHTML = pat.panel({
            title: o.title, icon: o.icon, flush: true, zone: 'bang', count: 'n',
            tools: ui.xoaChon('input[data-' + o.k + ']', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) +
                ui.btn('add', { text: o.them, mod: 'out-success', attr: { 'data-a': 'them' } })
        });
        var bang = host.querySelector('[data-z="bang"]');
        T.ganChon(host);

        function nap() {
            if (!o.id) { bang.innerHTML = ui.empty(CHUA_LUU + ' ' + o.ten + '.', 'fa-circle-info'); return Promise.resolve(); }
            T.dang(bang);
            return ums.api.call(o.list()).then(function (r) {
                rows = T.ds(r);
                host.querySelector('[data-z="n"]').textContent = '(' + rows.length + ')';
                ui.table({ el: bang, rows: rows, columns: o.cot.concat([T.cotChon(o.k)]), empty: 'Không có dữ liệu' });
            }).catch(function (err) { T.loi(bang, err, o.title); });
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a], [data-act="del"]');
            if (!b || !host.contains(b)) return;
            var a = b.getAttribute('data-a') || 'del1';
            if (a === 'them') {
                if (!o.id) { ui.toast(CHUA_LUU + ' ' + o.ten, 'warn'); return; }
                o.onThem(nap);
            } else if (a === 'xoa') {
                var ids = T.daChon(bang, o.k);
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                T.xoa(ids.map(o.xoa), nap, o.hoiXoa ? o.hoiXoa(ids.length) : null);
            } else if (a === 'del1') {
                var id = b.getAttribute('data-id');
                ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call(o.xoa(id)).then(function () { ui.toast('Xóa thành công!', 'ok'); nap(); });
                }).catch(function (err) { ums.api.handle(err, 'xoá'); });
            }
        });
        nap();
        return { nap: nap };
    }

    /** Hộp "Thêm mới - Chọn đợt thi" */
    function hopDotThi(id, xong) {
        var rows = [];
        var dlg = ui.dialog({
            title: 'Thêm mới - Chọn đợt thi', icon: 'fa-plus', size: 'lg',
            body: '<div data-f="tbl"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var ids = T.daChon(d.body, 'mdt');
                if (!ids.length) { ui.toast('Vui lòng chọn đợt thi', 'warn'); return false; }
                ui.batch(ids.map(function (x) {
                    return { action: CH + 'FSkkLB4FIC8mCjgeFSkoHgkRHgoJHgUuNRUpKAPP', func: PK + 'Them_DangKy_Thi_HP_KH_DotThi',
                        strDangKy_Thi_HP_KeHoach_Id: id, strThi_DotThi_Id: x, strNguoiThucHien_Id: '' };
                }), { title: 'Đang thêm đợt thi', okText: 'Thêm thành công' }).then(function () { d.close(); xong(); });
                return false;
            } }]
        });
        var tbl = dlg.body.querySelector('[data-f="tbl"]');
        T.ganChon(dlg.body);
        T.dang(tbl);
        ums.api.call({ action: CH + 'DSA4BRIFLjUVKSgP', func: PK + 'LayDSDotThi', strDangKy_Thi_HP_KeHoach_Id: id, strNguoiThucHien_Id: '' })
            .then(function (r) {
                rows = T.ds(r);
                ui.table({ el: tbl, rows: rows, empty: 'Không có đợt thi', columns: [
                    { title: 'Đợt thi', render: function (x) { return ui.esc(T.e(x.THI_DOTTHI_TEN || x.TENDOTTHI)); } },
                    T.cotChon('mdt')
                ] });
            }).catch(function (err) { T.loi(tbl, err, 'danh sách đợt thi'); });
    }

    /* =====================================================================
       T.formExtra(host, row) → { save(idKeHoach) → Promise }
       ===================================================================== */
    T.formExtra = function (host, row) {
        var id = row ? row.ID : '';
        host.innerHTML =
            '<div class="ums-grid ums-grid--2">' +
                '<div class="ums-stack"><div data-b="tg"></div><div data-b="dot"></div><div data-b="hpk"></div></div>' +
                '<div class="ums-stack"><div data-b="pv"></div><div data-b="hp"></div></div>' +
            '</div>';
        function b(k) { return host.querySelector('[data-b="' + k + '"]'); }

        /* Thời gian */
        var g = pat.rows(b('tg'), {
            title: 'Thời gian', icon: 'fa-calendar-days',
            columns: [{ key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', title: 'Thời gian', type: 'select', s2: true,
                placeholder: 'Chọn thời gian', source: { load: thoiGian, name: 'DAOTAO_THOIGIANDAOTAO' } }],
            list: function (pid) {
                return { action: AC + 'LayDSDangKy_Thi_HP_KH_ThoiGian', method: 'GET', strDangKy_Thi_HP_KeHoach_Id: pid, strNguoiThucHien_Id: '' };
            },
            filled: function (v) { return !!v.strDaoTao_ThoiGianDaoTao_Id; },
            save: function (v, rec, pid) {
                return {
                    action: AC + (rec ? 'Sua_' : 'Them_') + 'DangKy_Thi_HP_KH_ThoiGian',
                    strId: rec ? rec.ID : '',
                    strDangKy_Thi_HP_KeHoach_Id: pid,
                    strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                    strNguoiThucHien_Id: ''
                };
            },
            remove: function (rec) { return { action: AC + 'Xoa_DangKy_Thi_HP_KH_ThoiGian', strId: rec.ID, strNguoiThucHien_Id: '' }; }
        });
        g.load(id);

        /* Chọn đợt thi */
        khoi(b('dot'), {
            id: id, k: 'dt', ten: 'đợt thi', title: 'Chọn đợt thi', icon: 'fa-calendar-check', them: 'Thêm mới',
            cot: [
                { title: 'Đợt thi', prop: 'THI_DOTTHI_TEN' },
                { title: 'Xóa', cls: 'is-center', width: '64px', render: function (r) { return ui.iconBtn('del', r.ID); } }
            ],
            list: function () {
                return { action: CH + 'DSA4BRIFIC8mCjgeFSkoHgkRHgoJHgUuNRUpKAPP', func: PK + 'LayDSDangKy_Thi_HP_KH_DotThi',
                    strDangKy_Thi_HP_KeHoach_Id: id, strNguoiThucHien_Id: '' };
            },
            xoa: function (x) {
                return { action: CH + 'GS4gHgUgLyYKOB4VKSgeCREeCgkeBS41FSko', func: PK + 'Xoa_DangKy_Thi_HP_KH_DotThi', strId: x, strNguoiThucHien_Id: '' };
            },
            hoiXoa: function (n) { return 'Bạn có chắc muốn xóa ' + n + ' đợt thi đã chọn?'; },
            onThem: function (nap) { hopDotThi(id, nap); }
        });

        /* Danh sách phạm vi */
        var pv = pat.phamVi(b('pv'), {
            title: 'Danh sách phạm vi',
            list: function (pid) {
                return { action: AC + 'LayDSDangKy_Thi_HP_KH_PhamVi', method: 'GET', strDangKy_Thi_HP_KeHoach_Id: pid, strNguoiThucHien_Id: '' };
            },
            save: function (pvId, pid) {
                return { action: AC + 'Them_DangKy_Thi_HP_KH_PhamVi', strId: pvId, strDangKy_Thi_HP_KeHoach_Id: pid,
                    strPhamViApDung_Id: pvId, strNguoiThucHien_Id: '' };
            },
            remove: function (rowId) { return { action: AC + 'Xoa_DangKy_Thi_HP_KH_PhamVi', strId: rowId, strNguoiThucHien_Id: '' }; }
        });
        pv.load(id);

        /* Học phần mở đăng ký / không đăng ký */
        var COT_HP = [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
            { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_SOTIN', cls: 'is-center' },
            { title: 'Đơn vị', prop: 'DAOTAO_HOCPHAN_DONVI' }
        ];
        function hp(host2, k, title, icon, ma) {
            khoi(host2, {
                id: id, k: k, ten: 'học phần', title: title, icon: icon, them: 'Thêm', cot: COT_HP,
                list: function () {
                    return { action: CH + ma.lay, func: PK + 'LayDSDangKy_Thi_HP_KH_' + ma.ten, strDangKy_Thi_HP_KeHoach_Id: id, strNguoiThucHien_Id: '' };
                },
                xoa: function (x) { return { action: CH + ma.xoa, func: PK + 'Xoa_DangKy_Thi_HP_KH_' + ma.ten, strId: x, strNguoiThucHien_Id: '' }; },
                onThem: function (nap) {
                    T.pickHocPhan(function (ids) {
                        ui.batch(ids.map(function (x) {
                            return { action: CH + ma.them, func: PK + 'Them_DangKy_Thi_HP_KH_' + ma.ten,
                                strDangKy_Thi_HP_KeHoach_Id: id, strDaoTao_HocPhan_Id: x, strNguoiThucHien_Id: '' };
                        }), { title: 'Đang thêm học phần', okText: 'Thực hiện thành công' }).then(nap);
                    });
                }
            });
        }
        hp(b('hp'), 'hp', 'Danh sách các học phần mở đăng ký', 'fa-book-open', {
            ten: 'HocPhan', lay: 'DSA4BRIFIC8mCjgeFSkoHgkRHgoJHgkuIhEpIC8P',
            them: 'FSkkLB4FIC8mCjgeFSkoHgkRHgoJHgkuIhEpIC8P', xoa: 'GS4gHgUgLyYKOB4VKSgeCREeCgkeCS4iESkgLwPP' });
        hp(b('hpk'), 'hpk', 'Danh sách các học phần không đăng ký', 'fa-book', {
            ten: 'KHocPhan', lay: 'DSA4BRIFIC8mCjgeFSkoHgkRHgoJHgoJLiIRKSAv',
            them: 'FSkkLB4FIC8mCjgeFSkoHgkRHgoJHgoJLiIRKSAv', xoa: 'GS4gHgUgLyYKOB4VKSgeCREeCgkeCgkuIhEpIC8P' });

        return {
            /* Bản gốc: lưu kế hoạch xong mới gửi phạm vi rồi thời gian (gắn id máy chủ trả) */
            save: function (pid) {
                if (!pid) {
                    if (pv.pending()) ui.toast('Máy chủ không trả id kế hoạch — phạm vi / thời gian chưa được lưu.', 'warn');
                    return Promise.resolve();
                }
                return pv.save(pid).then(function () { return g.save(pid); });
            }
        };
    };
})();
