/* =========================================================================
   Kết quả nguyện vọng đăng ký
   Bản gốc: ApisDangKyHoc/Modules/nguyenvongdangky/html/ketqua.html + script/ketqua.js
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc 7 ô (Kế hoạch · Học phần · Kiểu học · Hệ · Khoá · Chương trình ·
   Từ khoá) + hàng nút (Tìm kiếm · Thống kê theo học phần · Xuất báo cáo · Import), rồi khung
   "Danh sách" — bảng người học, mỗi HỌC PHẦN của kế hoạch thêm một nhóm 5 cột (tiêu đề hai tầng
   "TEN - MA - HOCTRINH": Kiểu học · Đánh giá · Điểm số · Điểm quy đổi hệ chữ · Ngày đăng ký).
   Lời gọi — chép nguyên văn:
       DKH_KeHoachDangKyNV/LayDanhSach                GET  strTuKhoa (ô từ khoá lúc mở màn), strNguoiThucHien_Id "",
                                                            pageIndex 1, pageSize 100000         (ID, TENKEHOACH)
       DKH_KeHoachDangKyNV/LayDSHocPhanTheoKeHoach    GET  strKeHoachNguyenVong_Id, strNguoiThucHien_Id (ID, TEN, MA, HOCTRINH)
       DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach    GET  strKeHoachNguyenVong_Id, strNguoiThucHien_Id (ID, TEN)
       DKH_NguyenVong/LayDSKetQuaDangKy_NguyenVong    GET  strTuKhoa, strDangKy_KeHoachDangKy_Id, strDaoTao_HeDaoTao_Id,
           strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id, strDaoTao_HocPhan_Id, strKieuHoc_Id, strNguoiThucHien_Id
           (ID, QLSV_NGUOIHOC_MASO/_HODEM/_TEN, DAOTAO_LOPQUANLY_TEN, DAOTAO_CHUONGTRINH_TEN, DAOTAO_KHOADAOTAO_TEN,
            DAOTAO_HEDAOTAO_TEN, DAOTAO_TOCHUCCHUONGTRINH_ID)
       DKH_NguyenVong/LayDSHocPhanDaDangKy            GET  strKeHoachNguyenVong_Id, strKieuHoc_Id, strQLSV_NguoiHoc_Id (= ID dòng),
           strDaoTao_ChuongTrinh_Id (= DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_HocPhan_Id, strNguoiThucHien_Id
           — MỘT lời gọi cho mỗi (người học × học phần), đổ KIEUHOC_TEN, DANHGIA_TEN, DIEM, DIEMQUYDOI_TEN,
           NGAYTAO_DD_MM_YYYY (nhiều dòng trả về thì dòng cuối thắng, như gốc)
       DKH_NguyenVong_MH/DSA4BRIJLiIRKSAvFSkkLgokCS4gIikP  PKG_DANGKY_NGUYENVONG.LayDSHocPhanTheoKeHoach  (hộp Thống kê)
           strKeHoachNguyenVong_Id, strNguoiThucHien_Id → TEN, MA, HOCTRINH, SOSV; "Tổng số SV" = Σ SOSV
       Hệ / Khoá / Chương trình: edu.system.getList_* (KHÔNG lọc quyền) → ums.ref.cascade.
       Báo cáo: getList_MauImport("zonebtnBaoCao_NguyenVong") — gốc có vùng _Import nên giữ nút Import.
   Cặp cha → con (ums.pat.chain): Kế hoạch → Học phần, Kế hoạch → Kiểu học; Hệ → Khoá → Chương trình
     (ums.ref.cascade tự khoá). Chưa chọn cha thì khoá con; xoá cha thì xoá trắng con.
   Khác bản gốc (cách làm):
     · Gốc không gửi pageIndex/pageSize (máy chủ trả hết) rồi bắn lời gọi LayDSHocPhanDaDangKy cho
       MỌI người học × MỌI học phần cùng lúc. Bản mới phân trang ở máy khách và chỉ gọi cho các dòng
       ĐANG HIỆN (6 luồng) — cùng lời gọi, cùng tham số, bớt hàng nghìn lời gọi thừa.
     · Hệ → Khoá → CT dùng ums.ref.cascade: CT gửi thêm Hệ (gốc chỉ gửi Khoá).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('nvdk-ketqua');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function rs(r) { return Array.isArray(r.data) ? r.data : []; }

    var st = { hocPhan: [], rows: [], hpXem: [], trang: 1, size: (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, token: 0 };

    root.innerHTML =
        pat.page('Kết quả nguyện vọng', '') +
        pat.filterBar([
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch' },
            { key: 'hp', type: 'select', label: 'Chọn học phần' },
            { key: 'kieu', type: 'select', label: 'Chọn kiểu học' },
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ], { extra: '<div class="ums-field ums-field--fit">' +
            ui.btn('view', { text: 'Thống kê theo học phần', mod: 'primary', icon: 'fa-chart-bar', attr: { 'data-a': 'thongke' } }) +
            '</div><div class="ums-field ums-field--fit" data-z="bc"></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'tong', flush: true, zone: 'bang' });

    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var elBang = root.querySelector('[data-z="bang"]');
    var elTong = root.querySelector('[data-z="tong"]');
    ui.enhance(root);
    elBang.innerHTML = ui.empty('Chọn điều kiện lọc rồi bấm Tìm kiếm', 'fa-magnifying-glass');

    /* ---------- Ô chọn ---------------------------------------------------- */
    ums.api.call({ action: 'DKH_KeHoachDangKyNV/LayDanhSach', method: 'GET',
        strTuKhoa: F('q').value.trim(), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) { pat.fill(F('kh'), rs(r), { name: 'TENKEHOACH', head: 'Chọn kế hoạch' }); })
        .catch(function (err) { ums.api.handle(err, 'DKH_KeHoachDangKyNV/LayDanhSach'); });

    function napTheoKeHoach() {
        var kh = F('kh').value;
        st.hocPhan = [];
        pat.fill(F('hp'), [], { head: 'Chọn học phần' });
        pat.fill(F('kieu'), [], { head: 'Chọn kiểu học' });
        if (!kh) return;
        ums.api.call({ action: 'DKH_KeHoachDangKyNV/LayDSHocPhanTheoKeHoach', method: 'GET',
            strKeHoachNguyenVong_Id: kh, strNguoiThucHien_Id: uid() })
            .then(function (r) { st.hocPhan = rs(r); pat.fill(F('hp'), st.hocPhan, { name: 'TEN', head: 'Chọn học phần' }); })
            .catch(function (err) { ums.api.handle(err, 'DKH_KeHoachDangKyNV/LayDSHocPhanTheoKeHoach'); });
        ums.api.call({ action: 'DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach', method: 'GET',
            strKeHoachNguyenVong_Id: kh, strNguoiThucHien_Id: uid() })
            .then(function (r) { pat.fill(F('kieu'), rs(r), { name: 'TEN', head: 'Chọn kiểu học' }); })
            .catch(function (err) { ums.api.handle(err, 'DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach'); });
    }
    if (window.jQuery) jQuery(F('kh')).on('select2:select select2:clear', napTheoKeHoach);
    pat.chain([F('kh'), F('hp')], { phatLai: false });
    pat.chain([F('kh'), F('kieu')], { phatLai: false });

    ums.ref.cascade({ he: F('he'), khoa: F('khoa'), ct: F('ct'),
        labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo' } });

    /* ---------- Danh sách ------------------------------------------------- */
    function thamSo() {
        return {
            strTuKhoa: F('q').value.trim(),
            strDangKy_KeHoachDangKy_Id: F('kh').value,
            strDaoTao_HeDaoTao_Id: F('he').value,
            strDaoTao_KhoaDaoTao_Id: F('khoa').value,
            strDaoTao_ChuongTrinh_Id: F('ct').value,
            strDaoTao_HocPhan_Id: F('hp').value,
            strKieuHoc_Id: F('kieu').value
        };
    }

    function nap() {
        var t = ++st.token;
        elBang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var p = thamSo();
        p.action = 'DKH_NguyenVong/LayDSKetQuaDangKy_NguyenVong';
        p.method = 'GET';
        p.strNguoiThucHien_Id = uid();
        ums.api.call(p).then(function (r) {
            if (t !== st.token) return;
            st.rows = rs(r);
            // Học phần hiện thành nhóm cột: mọi học phần của kế hoạch, hoặc đúng học phần đang lọc
            var hp = F('hp').value;
            st.hpXem = hp ? st.hocPhan.filter(function (x) { return x.ID === hp; }) : st.hocPhan.slice();
            elTong.textContent = '(' + (Number(r.pager) || st.rows.length) + ')';
            st.trang = 1;
            ve();
        }).catch(function (err) {
            if (t !== st.token) return;
            elBang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'DKH_NguyenVong/LayDSKetQuaDangKy_NguyenVong');
        });
    }

    var NHOM = [
        { k: 'KIEUHOC_TEN', t: 'Kiểu học' },
        { k: 'DANHGIA_TEN', t: 'Đánh giá' },
        { k: 'DIEM', t: 'Điểm số' },
        { k: 'DIEMQUYDOI_TEN', t: 'Điểm quy đổi hệ chữ' },
        { k: 'NGAYTAO_DD_MM_YYYY', t: 'Ngày đăng ký' }
    ];

    function ve() {
        var tu = (st.trang - 1) * st.size;
        var hien = st.rows.slice(tu, tu + st.size);
        var cols = [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', cls: 'is-center is-nowrap', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center is-nowrap' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center is-nowrap' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center is-nowrap' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center is-nowrap' }
        ];
        st.hpXem.forEach(function (h, j) {
            var nhan = e(h.TEN) + ' - ' + e(h.MA) + ' - ' + e(h.HOCTRINH);
            NHOM.forEach(function (c) {
                cols.push({ title: c.t, group: [nhan], cls: 'is-center is-nowrap',
                    render: function (r, i) { return '<span data-o="' + (tu + i) + '_' + j + '_' + c.k + '"></span>'; } });
            });
        });
        ui.table({
            el: elBang, rows: hien, columns: cols, empty: 'Không có dữ liệu',
            page: {
                index: st.trang, size: st.size, total: st.rows.length,
                onChange: function (p) { if (p < 1 || p > Math.ceil(st.rows.length / st.size)) return; st.trang = p; ve(); },
                onSize: function (v) { st.size = v; st.trang = 1; ve(); }
            }
        });
        napO(hien, tu);
    }

    /* getList_KetQua — một lời gọi cho mỗi (người học × học phần) đang hiện */
    function napO(hien, tu) {
        var t = st.token, viec = [];
        hien.forEach(function (r, i) {
            st.hpXem.forEach(function (h, j) { viec.push({ r: r, i: tu + i, h: h, j: j }); });
        });
        var kh = F('kh').value, kieu = F('kieu').value;
        var idx = 0;
        function chay() {
            if (t !== st.token || idx >= viec.length) return Promise.resolve();
            var v = viec[idx++];
            return ums.api.call({
                action: 'DKH_NguyenVong/LayDSHocPhanDaDangKy', method: 'GET', silent: true,
                strKeHoachNguyenVong_Id: kh,
                strKieuHoc_Id: kieu,
                strQLSV_NguoiHoc_Id: v.r.ID,
                strDaoTao_ChuongTrinh_Id: e(v.r.DAOTAO_TOCHUCCHUONGTRINH_ID),
                strDaoTao_HocPhan_Id: v.h.ID,
                strNguoiThucHien_Id: uid()
            }).then(function (res) {
                if (t !== st.token) return;
                rs(res).forEach(function (json) {
                    NHOM.forEach(function (c) {
                        var o = elBang.querySelector('[data-o="' + v.i + '_' + v.j + '_' + c.k + '"]');
                        if (o) o.textContent = e(json[c.k]);
                    });
                });
            }, function () { /* gốc: lỗi thì im lặng (console.log) */ }).then(chay);
        }
        for (var k = 0; k < 6; k++) chay();
    }

    /* ---------- Thống kê theo học phần ------------------------------------ */
    function thongKe() {
        var kh = F('kh').value;
        if (!kh) { ui.toast('Vui lòng chọn kế hoạch đăng ký!', 'warn'); return; }
        var dlg = ui.dialog({
            title: 'Thống kê theo học phần', icon: 'fa-chart-bar', size: 'lg',
            body: pat.panel({ title: 'Danh sách học phần', icon: 'fa-list', flush: true, zone: 'tk',
                tools: '<span class="ums-badge ums-badge--info">Tổng số SV: <b data-z="tongsv">0</b></span>',
                body: ui.empty('Đang tải…', 'fa-spinner fa-spin') })
        });
        var host = dlg.body.querySelector('[data-z="tk"]');
        ums.api.call({
            action: 'DKH_NguyenVong_MH/DSA4BRIJLiIRKSAvFSkkLgokCS4gIikP',
            func: 'PKG_DANGKY_NGUYENVONG.LayDSHocPhanTheoKeHoach',
            strKeHoachNguyenVong_Id: kh,
            strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var d = rs(r), tong = 0;
            d.forEach(function (x) { tong += parseInt(x.SOSV || 0, 10) || 0; });
            dlg.body.querySelector('[data-z="tongsv"]').textContent = tong;
            ui.table({
                el: host, rows: d, empty: 'Không có học phần',
                columns: [
                    { title: 'Tên học phần', prop: 'TEN' },
                    { title: 'Mã học phần', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Tín chỉ', prop: 'HOCTRINH', cls: 'is-center' },
                    { title: 'Số SV', cls: 'is-center', render: function (x) { return ui.badge(e(x.SOSV), 'info'); } }
                ]
            });
        }).catch(function (err) {
            host.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'LayDSHocPhanTheoKeHoach');
        });
    }

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) nap();
        else if (ev.target.closest('[data-a="thongke"]')) thongKe();
    });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target === F('q')) { ev.preventDefault(); nap(); }
    });

    /* getList_MauImport("zonebtnBaoCao_NguyenVong") — collect giữ nguyên 7 khoá */
    ums.report.mount(root.querySelector('[data-z="bc"]'), {
        collect: function (add) {
            var p = thamSo();
            Object.keys(p).forEach(function (k) { add(k, p[k]); });
        }
    });
})();
