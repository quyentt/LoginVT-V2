/* =========================================================================
   Duyệt một cửa — xử lý yêu cầu dịch vụ một cửa
   Bản gốc: ApisCongCanBo/Modules/hoatdong/script/duyet1cua.js + html/duyet1cua.html
   ---------------------------------------------------------------------------
   Lời gọi (mã hoá, chép nguyên):
       SV_DVMC_TiepNhan_XuLy_MH · pkg_dvmc_tiepnhan_xuly.LayDSLoaiYeuCau        ô Loại yêu cầu
       SV_DVMC_TiepNhan_XuLy_MH · pkg_dvmc_tiepnhan_xuly.LayDSDVMC_YeuCau_Nhan_XuLy
           strTuKhoa, strPhanLoai ('' | DaHoanThanh | TraLai | ChoXuLy — bốn nút danh sách),
           strTuNgay, strDenNgay (mặc định hôm nay), strYeuCau_Id = loại yêu cầu, strChucNang_Id
       Hộp "Xử lý yêu cầu":
         SV_DVMC_Chung_MH · pkg_dvmc_chung.LayDSCauTruc_YeuCau → rsCauTrucYeuCau: NOIDUNG là mẫu HTML
             do quản trị soạn, ô nhập viết dạng @<id>-<TEXT|LIST>-<mã danh mục>-<bắt buộc>-…-<rộng>@
         SV_DVMC_ThongTin_MH · pkg_dvmc_thongtin.LayTTDVMC_CauTruc_YC_DuLieu  giá trị từng ô (mỗi ô một lời gọi)
         SV_DVMC_Chung_MH · pkg_dvmc_chung.LayDSTinhTrangXuLy                  ô Tình trạng
         SV_DVMC_Chung_MH · pkg_dvmc_chung.LayDSNguoiDungPhanCongYC            ô Cán bộ (theo tình trạng)
         SV_DVMC_TiepNhan_XuLy_MH · pkg_dvmc_tiepnhan_xuly.Them_DVMC_YeuCau_TiepNhan_XuLy
             "Xử lý" (strNguoiDuocChuyen_Id '') / "Chuyển" (= cán bộ chọn)
       Mẫu báo cáo: ums.report.mount — strYeuCau_Id + strDVMC_YeuCau_Nhan_Id của từng dòng đánh dấu.

   Giữ như bản gốc:
     · Đổi "Loại yêu cầu" không tự tải lại — bấm một trong bốn nút danh sách.
     · strDVMC_YeuCau_Nhan_Id khi đọc giá trị ô lấy me.strXNYeuCau_Id — biến
       không nơi nào gán → gửi rỗng. KIỂM TRÊN HOST (có thể phải là id yêu cầu).
     · Mẫu NOIDUNG hiện nguyên HTML (nội dung quản trị soạn, như bản gốc).
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Ô kiểu LIST: bản gốc vẽ <select id="drop…"> nhưng đổ danh mục vào
       "dropDanhGia…" → ô luôn trống. Ở đây đổ đúng ô.
     · Bỏ save/delete/viewForm_Duyet1Cua (chép từ màn tài khoản kế toán, không nơi nào gọi).
   Theo luật chung: chưa chọn Tình trạng thì khoá ô Cán bộ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var TN = 'SV_DVMC_TiepNhan_XuLy_MH/', CH = 'SV_DVMC_Chung_MH/';
    var root = document.getElementById('hd-duyet1cua');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function homNay() { var d = new Date(); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }
    function chucNang() { return (ums.state && ums.state.chucNangId) || ''; }

    var NUT = [['', 'Danh sách toàn bộ', 'primary', 'fa-list'], ['DaHoanThanh', 'Danh sách đã hoàn thành', 'save', 'fa-clipboard-list-check'],
               ['TraLai', 'Danh sách trả lại', 'danger', 'fa-rotate-left'], ['ChoXuLy', 'Danh sách đang chờ xử lý', 'out-info', 'fa-hourglass-clock']];
    root.innerHTML =
        pat.page('Xử lý yêu cầu', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'loai', label: 'Chọn loại yêu cầu', type: 'select' },
            { key: 'tu', label: 'Từ ngày', type: 'date', value: homNay() },
            { key: 'den', label: 'Đến ngày', type: 'date', value: homNay() },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ], { search: false, extra: '<div class="ums-row ums-u-mt-2" style="flex-basis:100%">' + NUT.map(function (n) {
            return ui.btn('search', { text: n[1], mod: n[2], icon: n[3], attr: { 'data-loai': n[0] } });
        }).join('') + '</div>' }) +
        pat.panel({ title: 'Danh sách yêu cầu', icon: 'fa-inbox', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var loai = '', ds = [];
    ums.api.call({ action: TN + 'DSA4BRINLiAoGCQ0AiA0', func: 'pkg_dvmc_tiepnhan_xuly.LayDSLoaiYeuCau', strNguoiThucHien_Id: uid(), silent: true })
        .then(function (r) { pat.fill(f('loai'), arr(r.data), { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'loại yêu cầu'); });

    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: TN + 'DSA4BRIFFwwCHhgkNAIgNB4PKSAvHhk0DTgP', func: 'pkg_dvmc_tiepnhan_xuly.LayDSDVMC_YeuCau_Nhan_XuLy',
            strTuKhoa: f('q').value.trim(), strPhanLoai: loai, strTuNgay: f('tu').value.trim(), strDenNgay: f('den').value.trim(),
            strYeuCau_Id: f('loai').value, strChucNang_Id: chucNang(), strNguoiThucHien_Id: uid() }).then(function (r) {
            ds = arr(r.data);
            z('n').textContent = '(' + ds.length + ')';
            var G = ['Thông tin người đăng ký'];
            ui.table({
                el: z('bang'), rows: ds, empty: 'Không có yêu cầu',
                columns: [
                    { title: 'Loại yêu cầu', prop: 'YEUCAU_TEN' },
                    { title: 'Mã số yêu cầu', prop: 'MAYEUCAU', cls: 'is-nowrap' },
                    { title: 'Thời gian đăng ký', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Người xử lý', render: function (x) { return esc(e(x.NGUOIXULY_TENDAYDU) + '(' + e(x.NGUOIXULY_TAIKHOAN) + ')'); } },
                    { title: 'Kết quả xử lý', prop: 'TINHTRANGXULY_TEN', cls: 'is-center' },
                    { title: 'Thời gian xử lý', prop: 'NGAYXULY_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Phí', prop: 'PHI', cls: 'is-center' },
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: G, cls: 'is-center is-nowrap' },
                    { title: 'Họ tên', group: G, render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' - ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Ghi chú', prop: 'GHICHU', group: G },
                    { title: 'Đánh giá hài lòng', prop: 'DANHGIA_TEN', cls: 'is-center' },
                    { title: 'Ý kiến khác', prop: 'YKIENKHAC' },
                    { title: 'Xử lý', cls: 'is-center', width: '60px', render: function (x, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-xl="' + i + '" title="Xử lý"><i class="fa-light fa-pen-to-square"></i></button>'; } },
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
                ]
            });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải yêu cầu'); });
    }
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return ds[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    }
    ums.report.mount(z('bc'), { collect: function (add) {
        add('strYeuCau_Id', f('loai').value);
        daChon().forEach(function (r) { add('strDVMC_YeuCau_Nhan_Id', r.ID); });
    } });

    /* ---------- Hộp "Xử lý yêu cầu" ------------------------------------ */
    function xuLy(r) {
        var dlg = ui.dialog({
            title: 'Xử lý yêu cầu', icon: 'fa-file-signature', size: 'xl',
            body: '<h3 class="d1c-td">' + esc(e(r.YEUCAU_TEN)) + '</h3><div class="d1c-nd" data-z="nd">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                    '<div class="ums-filter"><div class="ums-field"><select class="ums-select" data-x="tt" data-ph="Chọn tình trạng"><option value=""></option></select></div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Xử lý', icon: 'fa-circle-check', attr: { 'data-xa': 'xuly' } }) + '</div></div>' +
                    '<div class="ums-filter"><div class="ums-field"><select class="ums-select" data-x="cb" data-ph="Chọn cán bộ"><option value=""></option></select></div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Chuyển', mod: 'primary', icon: 'fa-share', attr: { 'data-xa': 'chuyen' } }) + '</div></div>' +
                '</div>'
        });
        var B = dlg.body;
        function x(k) { return B.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(B);
        var chuoi = ums.pat.chain([x('tt'), x('cb')], { phatLai: false });
        var yc = r.ID, sv = e(r.QLSV_NGUOIHOC_ID), ct = e(r.DAOTAO_CHUONGTRINH_ID);
        function napCanBo() {
            return ums.api.call({ action: CH + 'DSA4BRIPJjQuKAU0LyYRKSAvAi4vJhgC', func: 'pkg_dvmc_chung.LayDSNguoiDungPhanCongYC',
                strTinhTrangXuLy_Id: x('tt').value, strYeuCau_Id: yc, strNguoiThucHien_Id: uid(), silent: true })
                .then(function (d) { pat.fill(x('cb'), arr(d.data), { name: 'TEN' }); chuoi.sync(); }).catch(function (err) { ums.api.handle(err, 'cán bộ'); });
        }
        ums.api.call({ action: CH + 'DSA4BRIVKC8pFTMgLyYZNA04', func: 'pkg_dvmc_chung.LayDSTinhTrangXuLy', strNguoiThucHien_Id: uid(), strYeuCau_Id: yc, silent: true })
            .then(function (d) { pat.fill(x('tt'), arr(d.data), { name: 'TEN' }); chuoi.sync(); }).catch(function (err) { ums.api.handle(err, 'tình trạng'); });
        napCanBo();
        if (window.jQuery) jQuery(x('tt')).on('select2:select', napCanBo);

        ums.api.call({ action: CH + 'DSA4BRICIDQVMzQiHhgkNAIgNAPP', func: 'pkg_dvmc_chung.LayDSCauTruc_YeuCau',
            strYeuCau_Id: yc, strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: ct, strNguoiThucHien_Id: uid() }).then(function (d) {
            veMau(B.querySelector('[data-z="nd"]'), arr((d.data || {}).rsCauTrucYeuCau), yc, sv, ct);
        }).catch(function (err) { B.querySelector('[data-z="nd"]').innerHTML = ui.fail(err.message); ums.api.handle(err, 'cấu trúc yêu cầu'); });

        function luu(chuyen) {
            if (!x('tt').value) { ui.toast('Chọn tình trạng xử lý', 'warn'); return; }
            if (chuyen && !x('cb').value) { ui.toast('Chọn cán bộ nhận chuyển', 'warn'); return; }
            ums.api.call({ action: TN + 'FSkkLB4FFwwCHhgkNAIgNB4VKCQxDykgLx4ZNA04', func: 'pkg_dvmc_tiepnhan_xuly.Them_DVMC_YeuCau_TiepNhan_XuLy',
                strDVMC_YeuCau_Nhan_Id: yc, strTinhTrangXuLy_Id: x('tt').value, strNguoiXuLy_Id: uid(),
                strNguoiDuocChuyen_Id: chuyen ? x('cb').value : '', strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Thêm mới thành công!', 'ok'); dlg.close(); tai(); })
                .catch(function (err) { ums.api.handle(err, chuyen ? 'chuyển xử lý' : 'xử lý'); });
        }
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xa]');
            if (b) luu(b.getAttribute('data-xa') === 'chuyen');
        });
    }

    /* Mẫu yêu cầu: thay mỗi @id-KIỂU-mãDM-bắtBuộc-…-rộng@ bằng ô nhập, rồi đổ giá trị */
    function veMau(host, rows, yc, sv, ct) {
        var html = '', o = [];
        rows.forEach(function (x) {
            var nd = e(x.NOIDUNG);
            html += nd.indexOf('<div') === 0 ? nd : '<div class="d1c-dong">' + nd + '</div>';
            (nd.match(/@[^@]*@/g) || []).forEach(function (m) { o.push(m); });
        });
        o.forEach(function (m) {
            var p = m.replace(/@/g, '').split('-');
            var bb = p[3] === '1' ? '<span class="d1c-bb">(*)</span>' : '';
            var st = p[6] ? ' style="width:' + esc(p[6]) + 'px"' : '';
            var ctl = p[1] === 'LIST'
                ? '&nbsp;' + bb + '<select class="ums-select d1c-o" data-o="' + esc(p[0]) + '" data-no-s2' + st + '><option value=""></option></select>'
                : '&nbsp;' + bb + '<input class="ums-input d1c-o" data-o="' + esc(p[0]) + '"' + st + '>';
            html = html.replace(m, ctl);
        });
        host.innerHTML = html || ui.empty('Yêu cầu không có nội dung', 'fa-file');
        o.forEach(function (m) {
            var p = m.replace(/@/g, '').split('-');
            ums.api.call({ action: 'SV_DVMC_ThongTin_MH/DSA4FRUFFwwCHgIgNBUzNCIeGAIeBTQNKCQ0', func: 'pkg_dvmc_thongtin.LayTTDVMC_CauTruc_YC_DuLieu', silent: true,
                strYeuCau_Id: yc, strTruongThongTin_Id: p[0], strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: ct, strDVMC_YeuCau_Nhan_Id: '', strNguoiThucHien_Id: uid() })
                .then(function (d) {
                    var el = host.querySelector('[data-o="' + p[0] + '"]');
                    arr(d.data).forEach(function (v) {
                        var gt = e(v.TRUONGTHONGTIN_GIATRI);
                        if (!el) return;
                        if (p[1] === 'LIST') {
                            ums.api.dm(p[2]).then(function (dm) { pat.fill(el, dm, { name: 'TEN' }); el.value = gt; }).catch(function () {});
                        } else el.value = gt;
                        el.setAttribute('name', gt);
                    });
                }).catch(function () {});
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-loai], [data-xl]');
        if (!b) return;
        if (b.hasAttribute('data-loai')) { loai = b.getAttribute('data-loai'); tai(); }
        else xuLy(ds[Number(b.getAttribute('data-xl'))]);
    });
    z('bang').addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
    tai();
})();
