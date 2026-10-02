/* =========================================================================
   Khoa phân công giảng viên
   Bản gốc: ApisCongCanBo/Modules/hoatdong/html/phangiangvien.html + script/phangiangvien.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, đều mã hoá trừ khi ghi):
       Năm / Kế hoạch năm / Kế hoạch chi tiết: _kehoach.js (ums.hd.keHoach)
       ums.ref.cascadeQuyen (genBoLoc_HeKhoa "_CB")                                      ô Hệ đào tạo (theo QUYỀN)
       KHCT_HoatDong_Chung_MH · …LayDSHocPhanTheoKhoaChuyenMon                           ô Học phần
       KHCT_HoatDong_ThongTin_MH · PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DuKien_PC   danh sách (phân trang máy chủ)
       Danh mục KH.PHANLOAI.HOCPHAN.LOAILOP → mỗi phân loại lớp một nhóm 4 cột
       Mỗi ô (dòng × phân loại) BA lời gọi như gốc: LayGiaTriKH_PL_MoLop_TH_SL (Quy mô, Số lượng),
         LayGiaTriKH_PhanLoai_HP_SoTiet (chữ nút "Chi tiết - n"),
         KHCT_HoatDong_XacNhan_MH · …LayTTKH_PhanLoai_MoLop_XacNhan (Phân loại)
       "Phân giảng viên" (khung TRONG TRANG thay chỗ danh sách — BO-CUC luật 1): LayDSKH_PhanCong_GiangVien_TH · Them_… / Xoa_KH_PhanCong_GiangVien_TH;
         "Thêm mới" = ums.pat.pickNhanSu + ô "Thông tin phân giảng" ở chân hộp (như gốc).
   Mẫu báo cáo (chép nguyên): Hệ, Khoá/CT/Khoa QL (ô không có → rỗng), KH chi tiết, KH năm,
   strDaoTao_ThoiGianDaoTao_Id = ID NĂM (gốc gửi nhầm như vậy), strTuKhoa.

   Không chép (lỗi rõ của bản gốc):
     · Cột "Phân loại" luôn trống (hàm đổ dùng biến không tồn tại → lỗi JS) — ở đây đổ HANHDONG_TEN.
     · Enter ở ô "Thông tin" không tìm (gốc gắn vào ô không tồn tại).
     · Chọn "Kế hoạch năm" nạp Học phần cùng lúc với Kế hoạch chi tiết (dùng giá trị cũ).
     · Không kiểm đã chọn ai trong hộp nhân sự → tiến độ 0/0 không bao giờ xong.
   Giữ như bản gốc (chờ nghiệp vụ):
     · Lưu / Xoá phân công gửi strGiangVien_Id = ID DÒNG phân công (không phải cột giảng viên),
       strThanhPhan_Id rỗng — đúng chỉ khi máy chủ trả ID dòng = ID giảng viên. Kiểm trên host.
     · Xoá trắng ô "Thông tin phân giảng" rồi Lưu là LƯU giá trị rỗng, không xoá.
     · Cột Khoa quản lý: gốc đọc DAOTAP_KHOAQUANLY_TEN (gõ nhầm) — ở đây đọc cả hai tên.
   Bỏ (không có đường vào ở html gốc): Xác nhận, "Tính lớp mở theo quy mô", "Lấy quy mô",
   getList_CauTruc, getList_KetQuaPhanCong, ô Thời gian (bị chú thích ở html).
   Nối tầng: Năm → Kế hoạch năm → Kế hoạch chi tiết; Kế hoạch năm → Học phần (ums.pat.chain).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('hd-phangiangvien');
    var CH = 'KHCT_HoatDong_Chung_MH/', TT = 'KHCT_HoatDong_ThongTin_MH/', XN = 'KHCT_HoatDong_XacNhan_MH/';
    var P_CH = 'PKG_KEHOACH_HOATDONG_CHUNG.', P_TT = 'PKG_KEHOACH_HOATDONG_THONGTIN.', P_XN = 'PKG_KEHOACH_HOATDONG_XACNHAN.';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function call(a, f, o) { return ums.api.call(Object.assign({ action: a, func: f, strNguoiThucHien_Id: uid() }, o)); }

    root.innerHTML =
        pat.page('Khoa phân công giảng viên', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'nam', label: 'Chọn năm', type: 'select' },
            { key: 'khn', label: 'Chọn kế hoạch', type: 'select' },
            { key: 'khct', label: 'Chọn kế hoạch chi tiết', type: 'select' },
            { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' },
            { key: 'hp', label: 'Chọn học phần', type: 'select' },
            { key: 'q', label: 'Thông tin' }
        ], { searchText: 'Xem danh sách' }) +
        pat.panel({ title: 'Khoa phân công giảng viên', icon: 'fa-chalkboard-user', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k).value.trim(); }
    function chon1(el, d) { if (d.length === 1) { el.value = d[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); return true; } return false; }
    z('bang').innerHTML = ui.empty('Chọn bộ lọc rồi bấm "Xem danh sách"', 'fa-hand-pointer');

    /* ---------- Bộ lọc ---------------------------------------------------- */
    var c2 = pat.chain([f('khn'), f('hp')], { phatLai: false });
    ums.ref.cascadeQuyen({ he: f('he') });
    var dtPL = [];
    ums.api.dm('KH.PHANLOAI.HOCPHAN.LOAILOP').then(function (d) { dtPL = d || []; }).catch(function () {});
    function napHP() {
        if (!v('khn')) { pat.fill(f('hp'), []); c2.sync(); return Promise.resolve(); }
        return call(CH + 'DSA4BRIJLiIRKSAvFSkkLgopLiACKTQ4JC8MLi8P', P_CH + 'LayDSHocPhanTheoKhoaChuyenMon', {
            strKH_Nam_TongHop_Id: v('khn'), strKH_Nam_ChiTiet_Id: v('khct'), strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he') }).then(function (r) {
            var d = arr(r.data); pat.fill(f('hp'), d, { name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, head: 'Chọn học phần' }); chon1(f('hp'), d); c2.sync();
        }).catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    /* Năm → Kế hoạch năm → Kế hoạch chi tiết: _kehoach.js; đổi KH năm / KH chi tiết → nạp lại Học phần */
    ums.hd.keHoach({ nam: f('nam'), khn: f('khn'), khct: f('khct'), doi: napHP });
    if (window.jQuery) jQuery(f('he')).on('select2:select select2:clear', napHP);

    /* ---------- Danh sách --------------------------------------------------- */
    var trang = { index: 1, size: 10 }, ds = [];
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        call(TT + 'DSA4BRIKCR4JLiIRKSAvHgU0CigkLx4RAgPP', P_TT + 'LayDSKH_HocPhan_DuKien_PC', {
            strTuKhoa: v('q'), strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_HocPhan_Id: v('hp'),
            strKH_Nam_ChiTiet_Id: v('khct'), strKH_Nam_TongHop_Id: v('khn'), pageIndex: trang.index, pageSize: trang.size }).then(function (r) {
            ds = arr(r.data);
            var tong = Number(r.pager) || ds.length;
            z('n').textContent = '(' + tong + ')';
            var G = ['Thông tin học phần'], Q = 'Quy mô- số lớp mở-phân loại';
            ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu',
                page: { index: trang.index, size: trang.size, total: tong, onChange: function (p) { trang.index = p; tai(); }, onSize: function (s) { trang.size = s; trang.index = 1; tai(); } },
                columns: [
                    { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', group: G, cls: 'is-nowrap' }, { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN', group: G },
                    { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', group: G, cls: 'is-center' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: G },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: G }, { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', group: G },
                    { title: 'Khoa quản lý', group: G, render: function (x) { return esc(e(x.DAOTAO_KHOAQUANLY_TEN) || e(x.DAOTAP_KHOAQUANLY_TEN)); } },
                    { title: 'Tổng nhu cầu học', prop: 'TONGSODUKIEN', cls: 'is-center' }
                ].concat([].concat.apply([], dtPL.map(function (pl) {
                    var g = [Q, e(pl.TEN)];
                    function k(x) { return esc(x.ID + '|' + pl.ID); }
                    return [
                        { title: 'Quy mô', group: g, cls: 'is-center', render: function (x) { return '<span data-qm="' + k(x) + '"></span>'; } },
                        { title: 'Số lượng', group: g, cls: 'is-center', render: function (x) { return '<span data-sl="' + k(x) + '"></span>'; } },
                        { title: 'Phân loại', group: g, cls: 'is-center', render: function (x) { return '<span data-pl="' + k(x) + '"></span>'; } },
                        { title: 'Phân giảng', group: g, cls: 'is-center', render: function (x) {
                            return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-pg="' + k(x) + '"><i class="fa-light fa-eye"></i><span>Chi tiết</span></button>'; } }
                    ];
                })))
            });
            ds.forEach(function (x) { dtPL.forEach(function (pl) { o3(x, pl.ID); }); });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học phần'); });
    }
    function o3(x, pl) {
        var key = x.ID + '|' + pl, ts = { strPhanLoaiLop_Id: pl, strDaoTao_HocPhan_Id: e(x.DAOTAO_HOCPHAN_ID), strKh_Kehoach_HP_Dk_Th_Id: x.ID,
            strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID), strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID), silent: true };
        function q(a) { return z('bang').querySelector('[' + a + '="' + key + '"]'); }
        call(TT + 'DSA4BiggFTMoCgkeDDQgCSAvJh4SNCAP', P_TT + 'LayGiaTriKH_PL_MoLop_TH_SL', ts).then(function (r) {
            var d = arr(r.data), t = d[d.length - 1];                       // như gốc: dòng cuối thắng
            if (t) { if (q('data-qm')) q('data-qm').textContent = e(t.QUYMO); if (q('data-sl')) q('data-sl').textContent = e(t.SOLUONG); }
        }).catch(function () {});
        call(TT + 'DSA4BiggFTMoCgkeESkgLw0uICgeCREeEi4VKCQ1', P_TT + 'LayGiaTriKH_PhanLoai_HP_SoTiet', ts).then(function (r) {
            var d = arr(r.data), t = d[d.length - 1], b = q('data-pg');
            if (t && b) b.querySelector('span').textContent = 'Chi tiết - ' + e(t.SOTIETPHANBO);
        }).catch(function () {});
        call(XN + 'DSA4FRUKCR4RKSAvDS4gKB4MLg0uMR4ZICIPKSAv', P_XN + 'LayTTKH_PhanLoai_MoLop_XacNhan', { silent: true, strLoaiXacNhan_Id: 'PHANLOAIHOCPHAN', strPhanLoaiLop_Id: pl,
            strDuLieuXacNhan: e(x.DAOTAO_HOCPHAN_ID), strPhamViApDung_Id: e(x.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID),
            strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID) }).then(function (r) {
            var t = arr(r.data)[0]; if (t && q('data-pl')) q('data-pl').textContent = e(t.HANHDONG_TEN);
        }).catch(function () {});
    }

    /* ---------- "Phân giảng viên" — khung trong trang ---------------------------- */
    function phanGiang(x, pl) {
        var goc = {}, dsPC = [];
        var dlg = pat.formTrang({ host: root, title: 'Phân giảng viên', icon: 'fa-user-plus', cols: 1, body: '<div data-x="bang"></div>', buttons: [
            { text: 'Xóa', kind: 'del', onClick: function () { xoa(); return false; } },
            { text: 'Thêm mới', kind: 'add', onClick: function () { them(); return false; } },
            { text: 'Lưu', kind: 'save', mod: 'primary', onClick: function () { luu(); return false; } }
        ] });
        var host = dlg.body.querySelector('[data-x="bang"]');
        var chung = { strPhanLoaiLop_Id: pl, strDaoTao_HocPhan_Id: e(x.DAOTAO_HOCPHAN_ID), strKh_Kehoach_HP_Dk_Th_Id: x.ID, strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID) };
        function napPC() {
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            call(TT + 'DSA4BRIKCR4RKSAvAi4vJh4GKCAvJhcoJC8eFQkP', P_TT + 'LayDSKH_PhanCong_GiangVien_TH', Object.assign({ strGiangVien_Id: '' }, chung)).then(function (r) {
                dsPC = arr(r.data); goc = {};
                dsPC.forEach(function (p) { goc[p.ID] = e(p.CAUTRUCTHONGTINPHANGIANG); });
                ui.table({ el: host, rows: dsPC, empty: 'Chưa phân giảng viên', columns: [
                    { title: 'Mã', prop: 'GIANGVIEN_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'GIANGVIEN_HODEM' }, { title: 'Tên', prop: 'GIANGVIEN_TEN' },
                    { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                    { title: 'Thông tin phân giảng', render: function (p) { return '<input class="ums-input ums-input--sm" data-gt="' + esc(p.ID) + '" value="' + esc(goc[p.ID]) + '" autocomplete="off">'; } },
                    { head: '<input type="checkbox" data-pc="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (p) { return '<input type="checkbox" data-pc="' + esc(p.ID) + '">'; } }
                ] });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phân công giảng viên'); });
        }
        host.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-pc') === 'all') Array.prototype.forEach.call(host.querySelectorAll('input[data-pc]'), function (c) { c.checked = ev.target.checked; });
        });
        function luu() {
            var doi = Array.prototype.filter.call(host.querySelectorAll('input[data-gt]'), function (i) { return i.value.trim() !== goc[i.getAttribute('data-gt')]; });
            if (!doi.length) { ui.toast('Không có thay đổi lưu', 'info'); return; }
            ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' thay đổi?', { title: 'Lưu phân công' }).then(function (yes) {
                if (!yes) return;
                ui.batch(doi.map(function (i) {
                    return { action: TT + 'FSkkLB4KCR4RKSAvAi4vJh4GKCAvJhcoJC8eFQkP', func: P_TT + 'Them_KH_PhanCong_GiangVien_TH', strNguoiThucHien_Id: uid(),
                        strPhanLoaiLop_Id: pl, strDaoTao_HocPhan_Id: chung.strDaoTao_HocPhan_Id, strPhamViApDung_Id: x.ID, strKh_Kehoach_HP_Dk_Th_Id: x.ID,
                        strDaoTao_ThoiGianDaoTao_Id: chung.strDaoTao_ThoiGianDaoTao_Id, strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID),
                        strGiangVien_Id: i.getAttribute('data-gt'), strThanhPhan_Id: '', strThanhPhan_GiaTri: i.value.trim(), strCauTrucThongTinPhanGiang: i.value.trim() };
                }), { title: 'Đang lưu', okText: 'Thực hiện thành công', show: true }).then(napPC);
            });
        }
        function xoa() {
            var ids = Array.prototype.filter.call(host.querySelectorAll('input[data-pc]:checked'), function (c) { return c.getAttribute('data-pc') !== 'all'; }).map(function (c) { return c.getAttribute('data-pc'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) {
                    return { action: TT + 'GS4gHgoJHhEpIC8CLi8mHgYoIC8mFygkLx4VCQPP', func: P_TT + 'Xoa_KH_PhanCong_GiangVien_TH', strNguoiThucHien_Id: uid(),
                        strPhanLoaiLop_Id: pl, strDaoTao_HocPhan_Id: chung.strDaoTao_HocPhan_Id, strPhamViApDung_Id: x.ID, strDaoTao_ThoiGianDaoTao_Id: chung.strDaoTao_ThoiGianDaoTao_Id,
                        strKh_Kehoach_HP_Dk_Th_Id: x.ID, strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID), strGiangVien_Id: id };
                }), { title: 'Đang xoá', okText: 'Xóa thành công', show: true }).then(napPC);
            });
        }
        function them() {
            pat.pickNhanSu({ title: 'Tìm kiếm giảng viên', footExtra: '<input class="ums-input" data-x="ct" placeholder="Thông tin phân giảng" autocomplete="off">',
                onPick: function (list, hop) {
                    var ct = hop.querySelector('[data-x="ct"]').value.trim();
                    ui.batch(list.map(function (ns) {
                        return { action: TT + 'FSkkLB4KCR4RKSAvAi4vJh4GKCAvJhcoJC8eFQkP', func: P_TT + 'Them_KH_PhanCong_GiangVien_TH', strNguoiThucHien_Id: uid(),
                            strPhanLoaiLop_Id: pl, strDaoTao_HocPhan_Id: chung.strDaoTao_HocPhan_Id, strPhamViApDung_Id: x.ID, strKh_Kehoach_HP_Dk_Th_Id: x.ID,
                            strDaoTao_ThoiGianDaoTao_Id: chung.strDaoTao_ThoiGianDaoTao_Id, strGiangVien_Id: ns.ID, strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID),
                            strCauTrucThongTinPhanGiang: ct };
                    }), { title: 'Đang thêm giảng viên', okText: 'Thực hiện thành công', show: true }).then(napPC);
                } });
        }
        napPC();
    }

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strDaoTao_HeDaoTao_Id', v('he')); add('strDaoTao_KhoaDaoTao_Id', ''); add('strDaoTao_ChuongTrinh_Id', ''); add('strDaoTao_KhoaQuanLy_Id', '');
        add('strKH_Nam_ChiTiet_Id', v('khct')); add('strKH_Nam_TongHop_Id', v('khn')); add('strDaoTao_ThoiGianDaoTao_Id', v('nam')); add('strTuKhoa', v('q'));
    } });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-pg]');
        if (b) { var p = b.getAttribute('data-pg').split('|'); phanGiang(ds.filter(function (x) { return String(x.ID) === p[0]; })[0], p[1]); return; }
        if (ev.target.closest('[data-a="search"]')) { trang.index = 1; tai(); }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang.index = 1; tai(); } });
})();
