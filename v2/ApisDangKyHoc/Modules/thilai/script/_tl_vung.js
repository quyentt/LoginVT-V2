/* =========================================================================
   Kế hoạch thi lại — ba vùng thay chỗ danh sách: Phân nhân sự · Phí ·
   Danh sách nhập điểm
   Biểu mẫu Phí (thêm / sửa) mở NGAY TRONG TRANG, thay chỗ khung Phí (pat.formTrang —
   BO-CUC luật 1, rà hộp thoại 2026-09-30; bản gốc #myModalPhi là hộp thoại).
   Bản gốc: kehoach.html #zoneDSNhanSu, #zoneDSPhi + #myModalPhi,
            #zoneDSD + #modalChuaTaoDSD; kehoach.js *_PhanCong, *_Phi,
            getList_KhoanThu, *_DSD, getList_ChuaTaoDSD
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn; func thì ums.api tự thêm iM):
     Phân nhân sự  DKH_DangKyThi_MonThi_ThongTin_MH/… pkg_dangkythi_monthi_thongtin.
         LayDSDangKy_Thi_Hp_Kh_NhanSu   strDangKy_Thi_HP_KeHoach_Id
                                        (cột NGUOIDUNG_TAIKHOAN, NGUOIDUNG_TENDAYDU, DAOTAO_COCAUTOCHUC_TEN)
         Them_DangKy_Thi_Hp_Kh_NhanSu   strNguoiDung_Id = ID dòng hộp "Tìm kiếm nhân sự"
                                        (genModal_NguoiDung — danh sách NGƯỜI DÙNG, T.pickNguoiDung)
         Xoa_DangKy_Thi_Hp_Kh_NhanSu    strId
     Phí           pkg_dangkythi_monthi_thongtin.
         LayDSDangKy_Thi_Hp_Kh_MucPhi   (cột TAICHINH_CACKHOANTHU_TEN / _MA / _ID, SOTIEN)
         Them_DangKy_Thi_Hp_Kh_MucPhi / Sua_DangKy_Thi_Hp_Kh_MucPhi   strId, strDangKy_Thi_HP_KeHoach_Id,
                                        strPhamViApDung_Id "" (gốc đọc dropAAAA),
                                        strTaiChinh_CacKhoanThu_Id, dSoTien (chữ nhập nguyên văn)
         Xoa_DangKy_Thi_Hp_Kh_MucPhi    strId
         ô Loại khoản: TC_ThuChi_MH/… pkg_taichinh_thuchi.LayDSCacKhoanThu (1/10000, lọc rỗng)
     Danh sách nhập điểm  D_DKT_MonThi_Diem_MH/… pkg_dangkythi_monthi_diem.
         LayDSHocPhanTheoKetQuaDangKy        ô Học phần
         LayDSDanhSachHoc                    ô Danh sách học (theo học phần)
         LayDSDanhSachHoc_NguoiHoc           bảng — strDiem_DanhSach_Id, strDaoTao_HocPhan_Id
         TaoDSNhapDiemTheoKetQuaDangKy       "Tạo danh sách nhập điểm" — strDaoTao_HocPhan_Id
         TinhLaiDiemThiLai                   "Tính điểm thi lại" — strDiem_DSH_NguoiHoc_Id = ID dòng chọn
         LayDSDaDuyetNhungChuaTaoDSDiem      hộp "Danh sách đã duyệt nhưng chưa tạo danh sách"

   Cặp cha → con: Học phần → Danh sách học (khoá tới khi chọn học phần; bản gốc
   nạp sẵn danh sách học của mọi học phần). Mở vùng vẫn nạp bảng với cả hai ô rỗng như gốc.
   Như gốc: "Xóa tên khỏi danh sách" không có xử lý → giữ nút, disabled.
   Cố ý bỏ: cột ô đánh dấu của hộp "đã duyệt nhưng chưa tạo" (hộp không có nút
   thao tác nào — hai nút Xóa/Thêm của gốc đã bị chú thích bỏ).
   Khác gốc: lưu phí thành công thì đóng biểu mẫu (gốc giữ hộp mở, bấm Lưu lần nữa
   là thêm trùng); biểu mẫu Phí mở bằng Thêm thì chỉ báo "Thêm mới", bằng Sửa thì "Cập nhật".
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, esc = ui.esc, T = ums.tlKh;
    var e = T.e;
    var TT = 'DKH_DangKyThi_MonThi_ThongTin_MH/', PT = 'pkg_dangkythi_monthi_thongtin.';
    var DD = 'D_DKT_MonThi_Diem_MH/', PD = 'pkg_dangkythi_monthi_diem.';

    function khung(host, kh, o) {
        host.innerHTML = (o.truoc || '') + pat.panel({
            title: o.title + ' — ' + e(kh.TENKEHOACH), icon: o.icon, count: 'n', flush: true, zone: 'bang',
            tools: (o.tools || '') + ui.btn('close', { attr: { 'data-a': 'dong' } })
        });
        T.ganChon(host);
        return host.querySelector('[data-z="bang"]');
    }

    /* =====================================================================
       Phân nhân sự
       ===================================================================== */
    T.vungNhanSu = function (host, kh, ctx) {
        var bang = khung(host, kh, {
            title: 'Phân nhân sự', icon: 'fa-list-timeline',
            tools: ui.xoaChon('input[data-ns]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) +
                ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } })
        });
        var bt = T.bangTrang(bang, { empty: 'Không có dữ liệu', columns: [
            { title: 'Mã số', prop: 'NGUOIDUNG_TAIKHOAN', cls: 'is-nowrap' },
            { title: 'Họ tên', prop: 'NGUOIDUNG_TENDAYDU' },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            T.cotChon('ns')
        ] });
        function nap() {
            T.dang(bang);
            ums.api.call({ action: TT + 'DSA4BRIFIC8mCjgeFSkoHgkxHgopHg8pIC8SNAPP', func: PT + 'LayDSDangKy_Thi_Hp_Kh_NhanSu',
                strDangKy_Thi_HP_KeHoach_Id: kh.ID, strNguoiThucHien_Id: '' })
                .then(function (r) { var rows = T.ds(r); host.querySelector('[data-z="n"]').textContent = '(' + rows.length + ')'; bt.ve(rows); })
                .catch(function (err) { T.loi(bang, err, 'phân nhân sự'); });
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !host.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'dong') return ctx.dong();
            if (a === 'them') {
                T.pickNguoiDung(function (ids) {
                    ui.batch(ids.map(function (id) {
                        return { action: TT + 'FSkkLB4FIC8mCjgeFSkoHgkxHgopHg8pIC8SNAPP', func: PT + 'Them_DangKy_Thi_Hp_Kh_NhanSu',
                            strDangKy_Thi_HP_KeHoach_Id: kh.ID, strNguoiDung_Id: id, strNguoiThucHien_Id: '' };
                    }), { title: 'Đang thêm nhân sự', okText: 'Thực hiện thành công' }).then(nap);
                });
            } else if (a === 'xoa') {
                var ids = T.daChon(bang, 'ns');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                T.xoa(ids.map(function (id) {
                    return { action: TT + 'GS4gHgUgLyYKOB4VKSgeCTEeCikeDykgLxI0', func: PT + 'Xoa_DangKy_Thi_Hp_Kh_NhanSu', strId: id, strNguoiThucHien_Id: '' };
                }), nap);
            }
        });
        nap();
    };

    /* =====================================================================
       Phí
       ===================================================================== */
    var ktP = null;
    function khoanThu() {
        if (!ktP) {
            ktP = ums.api.call({
                action: 'TC_ThuChi_MH/DSA4BRICICIKKS4gLxUpNAPP', func: 'pkg_taichinh_thuchi.LayDSCacKhoanThu', silent: true,
                strTuKhoa: '', strNhomCacKhoanThu_Id: '', strNguoiThucHien_Id: '', strcanboquanly_id: '', pageIndex: 1, pageSize: 10000
            }).then(T.ds, function (err) { ktP = null; throw err; });
        }
        return ktP;
    }

    function hopPhi(host, kh, row, xong) {
        var dlg = pat.formTrang({
            host: host,
            title: 'Phí', icon: 'fa-circle-dollar-to-slot',
            body: ui.field('Loại khoản', '<select class="ums-select" data-f="kt" data-ph="Chọn khoản thu"><option value="">Chọn khoản thu</option></select>') +
                ui.field('Phí', '<input class="ums-input" data-f="tien" inputmode="decimal" autocomplete="off">'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var sua = !!(row && row.ID);
                ums.api.call({
                    action: TT + (sua ? 'EjQgHgUgLyYKOB4VKSgeCTEeCikeDDQiESko' : 'FSkkLB4FIC8mCjgeFSkoHgkxHgopHgw0IhEpKAPP'),
                    func: PT + (sua ? 'Sua_DangKy_Thi_Hp_Kh_MucPhi' : 'Them_DangKy_Thi_Hp_Kh_MucPhi'),
                    strId: sua ? row.ID : '',
                    strDangKy_Thi_HP_KeHoach_Id: kh.ID,
                    strPhamViApDung_Id: '',
                    strTaiChinh_CacKhoanThu_Id: f('kt').value,
                    dSoTien: (f('tien').value || '').trim(),
                    strNguoiThucHien_Id: ''
                }).then(function () {
                    ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                    d.close();
                    xong();
                }).catch(function (err) { ums.api.handle(err, 'lưu phí'); });
                return false;
            } }]
        });
        function f(k) { return dlg.body.querySelector('[data-f="' + k + '"]'); }
        f('tien').value = row ? e(row.SOTIEN) : '';
        khoanThu().then(function (ds) {
            pat.fill(f('kt'), ds, { name: 'TEN' });
            if (row) { f('kt').value = e(row.TAICHINH_CACKHOANTHU_ID); if (window.jQuery) jQuery(f('kt')).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'khoản thu'); });
    }

    T.vungPhi = function (host, kh, ctx) {
        var rows = [];
        var bang = khung(host, kh, {
            title: 'Phí', icon: 'fa-list-timeline',
            tools: ui.xoaChon('input[data-phi]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) +
                ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } })
        });
        function nap() {
            T.dang(bang);
            ums.api.call({ action: TT + 'DSA4BRIFIC8mCjgeFSkoHgkxHgopHgw0IhEpKAPP', func: PT + 'LayDSDangKy_Thi_Hp_Kh_MucPhi',
                strDangKy_Thi_HP_KeHoach_Id: kh.ID, strNguoiThucHien_Id: '' })
                .then(function (r) {
                    rows = T.ds(r);
                    host.querySelector('[data-z="n"]').textContent = '(' + rows.length + ')';
                    ui.table({ el: bang, rows: rows, empty: 'Không có dữ liệu', columns: [
                        { title: 'Loại khoản', render: function (x) { return esc(e(x.TAICHINH_CACKHOANTHU_TEN) + ' - ' + e(x.TAICHINH_CACKHOANTHU_MA)); } },
                        { title: 'Phí', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.SOTIEN); } },
                        { title: 'Sửa', cls: 'is-center', width: '64px', render: function (x) { return ui.iconBtn('edit', x.ID); } },
                        T.cotChon('phi')
                    ] });
                }).catch(function (err) { rows = []; T.loi(bang, err, 'phí'); });
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a], [data-act="edit"]');
            if (!b || !host.contains(b)) return;
            var a = b.getAttribute('data-a') || 'sua';
            if (a === 'dong') return ctx.dong();
            if (a === 'them') return hopPhi(host, kh, null, nap);
            if (a === 'sua') { var r = T.tim(rows, b.getAttribute('data-id')); if (r) hopPhi(host, kh, r, nap); return; }
            if (a === 'xoa') {
                var ids = T.daChon(bang, 'phi');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                T.xoa(ids.map(function (id) {
                    return { action: TT + 'GS4gHgUgLyYKOB4VKSgeCTEeCikeDDQiESko', func: PT + 'Xoa_DangKy_Thi_Hp_Kh_MucPhi', strId: id, strNguoiThucHien_Id: '' };
                }), nap);
            }
        });
        nap();
    };

    /* =====================================================================
       Danh sách nhập điểm
       ===================================================================== */
    function hopChuaTao(kh) {
        var dlg = ui.dialog({ title: 'Danh sách đã duyệt nhưng chưa tạo danh sách', icon: 'fa-users-between-lines', size: 'xl', body: '<div data-f="tbl"></div>' });
        var tbl = dlg.body.querySelector('[data-f="tbl"]');
        T.dang(tbl);
        ums.api.call({ action: DD + 'DSA4BRIFIAU0OCQ1Dyk0LyYCKTQgFSAuBRIFKCQs', func: PD + 'LayDSDaDuyetNhungChuaTaoDSDiem',
            strDangKy_Thi_HP_KeHoach_Id: kh.ID, strNguoiThucHien_Id: '' })
            .then(function (r) {
                ui.table({ el: tbl, rows: T.ds(r), empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (x) { return esc(T.hoTen(x)); } },
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Số tín chỉ', prop: 'HOCTRINH', cls: 'is-center' },
                    { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
                    { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }
                ] });
            }).catch(function (err) { T.loi(tbl, err, 'danh sách chưa tạo'); });
    }

    T.vungDSD = function (host, kh, ctx) {
        var rows = [];
        host.innerHTML =
            pat.panel({
                title: 'Danh sách nhập điểm — ' + e(kh.TENKEHOACH), icon: 'fa-pen-field', cls: 'ums-u-mb-4',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                body: '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" data-f="hp" data-ph="Chọn học phần"><option value="">Chọn học phần</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="ds" data-ph="Chọn danh sách học"><option value="">Chọn danh sách học</option></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Tạo danh sách nhập điểm', mod: 'out-success', icon: 'fa-file-plus', attr: { 'data-a': 'tao' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Tính điểm thi lại', mod: 'out-danger', icon: 'fa-arrows-retweet', attr: { 'data-a': 'tinh' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('view', { text: 'Danh sách đã duyệt nhưng chưa tạo danh sách', icon: 'fa-eye', attr: { 'data-a': 'chuatao' } }) + '</div>' +
                '</div>'
            }) +
            pat.panel({
                title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
                tools: '<button type="button" class="ums-btn ums-btn--danger" disabled title="Bản gốc chưa có xử lý cho nút này">' +
                    '<i class="fa-light fa-trash-can"></i><span>Xóa tên khỏi danh sách</span></button>'
            });
        T.ganChon(host);
        var bang = host.querySelector('[data-z="bang"]');
        function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
        ui.enhance(host);

        function napHP() {
            ums.api.call({ action: DD + 'DSA4BRIJLiIRKSAvFSkkLgokNRA0IAUgLyYKOAPP', func: PD + 'LayDSHocPhanTheoKetQuaDangKy',
                strDangKy_Thi_HP_KeHoach_Id: kh.ID, strNguoiThucHien_Id: '', silent: true })
                .then(function (r) { pat.fill(f('hp'), T.ds(r), { name: 'TEN' }); })
                .catch(function (err) { ums.api.handle(err, 'học phần'); });
        }
        function napDS() {
            if (!f('hp').value) { pat.fill(f('ds'), []); return; }
            ums.api.call({ action: DD + 'DSA4BRIFIC8pEiAiKQkuIgPP', func: PD + 'LayDSDanhSachHoc',
                strDangKy_Thi_HP_KeHoach_Id: kh.ID, strDaoTao_HocPhan_Id: f('hp').value, strNguoiThucHien_Id: '', silent: true })
                .then(function (r) { pat.fill(f('ds'), T.ds(r), { name: 'TEN' }); })
                .catch(function (err) { ums.api.handle(err, 'danh sách học'); });
        }
        function nap() {
            T.dang(bang);
            ums.api.call({ action: DD + 'DSA4BRIFIC8pEiAiKQkuIh4PJjQuKAkuIgPP', func: PD + 'LayDSDanhSachHoc_NguoiHoc',
                strDangKy_Thi_HP_KeHoach_Id: kh.ID, strDiem_DanhSach_Id: f('ds').value, strDaoTao_HocPhan_Id: f('hp').value,
                strNguoiThucHien_Id: '' })
                .then(function (r) {
                    rows = T.ds(r);
                    host.querySelector('[data-z="n"]').textContent = '(' + rows.length + ')';
                    ui.table({ el: bang, rows: rows, empty: 'Không có dữ liệu', columns: [
                        { title: 'Danh sách điểm', prop: 'DIEM_DANHSACHHOC_TEN' },
                        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                        { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc(T.hoTen(x)); } },
                        { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
                        { title: 'Giới tính', prop: 'GIOITINH_TEN' },
                        { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
                        { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                        { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
                        { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                        { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                        { title: 'Số tín chỉ', prop: 'HOCTRINH', cls: 'is-center' },
                        { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
                        { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                        { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' },
                        { title: 'Lớp học phần gốc', prop: 'DAOTAO_LOPHOCPHAN_GOC_TEN' },
                        { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
                        { title: 'Điểm quy đổi', prop: 'DIEMQUYDOI', cls: 'is-center' },
                        { title: 'Điểm quy đổi chữ', prop: 'DIEMCHU', cls: 'is-center' },
                        { title: 'Đánh giá', prop: 'DANHGIA_TEN' },
                        T.cotChon('dsd')
                    ] });
                }).catch(function (err) { rows = []; T.loi(bang, err, 'danh sách nhập điểm'); });
        }

        if (window.jQuery) {
            jQuery(f('hp')).on('select2:select', function () { napDS(); nap(); });
            jQuery(f('ds')).on('select2:select select2:clear', function () { nap(); });
        }
        pat.chain([f('hp'), f('ds')]);

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !host.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'dong') return ctx.dong();
            if (a === 'tim') return nap();
            if (a === 'chuatao') return hopChuaTao(kh);
            if (a === 'tao') {
                ums.api.call({ action: DD + 'FSAuBRIPKSAxBSgkLBUpJC4KJDUQNCAFIC8mCjgP', func: PD + 'TaoDSNhapDiemTheoKetQuaDangKy',
                    strDangKy_Thi_HP_KeHoach_Id: kh.ID, strDaoTao_HocPhan_Id: f('hp').value, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Thực hiện thành công', 'ok'); })
                    .catch(function (err) { ums.api.handle(err, 'tạo danh sách nhập điểm'); });
            } else if (a === 'tinh') {
                var ids = T.daChon(bang, 'dsd');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                ui.batch(ids.map(function (id) {
                    return { action: DD + 'FSgvKQ0gKAUoJCwVKSgNICgP', func: PD + 'TinhLaiDiemThiLai', strDiem_DSH_NguoiHoc_Id: id, strNguoiThucHien_Id: '' };
                }), { title: 'Đang tính điểm thi lại', okText: 'Thực hiện thành công' }).then(nap);
            }
        });

        napHP();
        nap();
    };
})();
