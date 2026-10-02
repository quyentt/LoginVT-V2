/* =========================================================================
   Khai báo phân bổ doanh thu
   Bản gốc: ApisTaiChinh/Modules/dulieuhocphi/scripts/phanbodoanhthu.js
   ---------------------------------------------------------------------------
   Nguồn ô chọn:
       TC_KhoanThu/LayDanhSach                          GET, khoản thu
       pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao /
       LayDSKS_DaoTao_KhoaDaoTao                        (ums.ref) hệ → khoá (khoá chọn nhiều)
       KHCT_ToChucChuongTrinh/LayDanhSach               GET, chương trình (chọn nhiều) theo hệ + khoá
   Tác vụ:
       TC_PhanBo_DoanhThu/LayDSTC_BC_PhanBo_DacThu      GET, "Xem thông tin đã khai phân bổ" (cả lúc mở)
       TC_PhanBo_DoanhThu/Them_TC_BC_PhanBo_DacThu      POST, "Thực hiện phân bổ" (bản gốc không hỏi lại)
       TC_PhanBo_DoanhThu/Xoa_TC_BC_PhanBo_DacThu       POST, xoá từng dòng đã chọn
       ums.report (getList_MauImport)                   báo cáo
   Bản gốc để 'type': 'GET' / 'POST' NGAY TRONG dữ liệu gửi đi — vẫn gửi y như vậy.

   Bỏ (mã chết của bản gốc, chép từ màn tính học phí, không nút nào gọi tới
   hoặc gọi vào phần tử không tồn tại): TaoHangDoi_PhanBoDoanhThu_TuDong,
   proSeq…, genHTML_HangDoi, getList_TinChi/NienChe/DeTail, getList_TrangThaiSV,
   getList_LopQuanLy, getList_KeHoachDangKy, delete_KetQuaDaTinhPhi (nút
   #btnDeleteKetQua không có trên màn), tab "Theo niên chế" (đã ẩn trong bản
   gốc). Khung "Lịch sử" bị display:none trong bản gốc — bỏ.
   Tham số báo cáo strLopQuanLy / strThoiGianDaoTao / strNghiepVu đọc từ ô
   không tồn tại nên luôn rỗng — vẫn gửi rỗng như bản gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, H = ums.hocphi, esc = ui.esc;
    var root = document.getElementById('phanbodoanhthu');

    function inp(id, ph) { return '<input class="ums-input" id="' + id + '" placeholder="' + esc(ph) + '" autocomplete="off">'; }

    root.innerHTML =
        '<div class="ums-page__head">' +
            '<h1 class="ums-page__title ums-u-mb-0">Phân bổ doanh thu</h1>' +
            '<div class="ums-page__actions"><span data-z="report"></span></div>' +
        '</div>' +
        '<div class="ums-panel ums-u-mb-4">' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-sack-dollar"></i> Khai báo phân bổ doanh thu</div></div>' +
            '<div class="ums-panel__body ums-filter hp-cond"><div class="ums-grid ums-grid--2">' +
                '<div>' +
                    H.selField('pbKhoanThu', 'Khoản thu', { head: '-- Chọn khoản thu --' }) +
                    H.selField('pbHe', 'Hệ đào tạo', { head: '-- Chọn hệ đào tạo --' }) +
                    H.selField('pbKhoa', 'Khóa đào tạo', { multiple: true }) +
                '</div><div>' +
                    H.selField('pbCT', 'Chương trình đào tạo', { multiple: true }) +
                    ui.field('Năm học, học kỳ dữ liệu', '<div class="ums-grid ums-grid--2">' + inp('pbNamHoc', 'Năm học') + inp('pbHocKy', 'Học kỳ') + '</div>',
                        { inline: true, labelWidth: '170px' }) +
                    ui.field('Năm, tháng phân bổ', '<div class="ums-grid ums-grid--2">' + inp('pbNamPB', 'Năm') + inp('pbThangPB', 'Tháng') + '</div>',
                        { inline: true, labelWidth: '170px' }) +
                '</div>' +
            '</div></div>' +
            '<div class="ums-panel__foot ums-row--end">' +
                '<button type="button" class="ums-btn ums-btn--out-primary" data-a="xem"><i class="fa-light fa-eye"></i><span>Xem thông tin đã khai phân bổ</span></button>' +
                '<button type="button" class="ums-btn ums-btn--primary" data-a="phanbo"><i class="fa-light fa-sack-dollar"></i><span>Thực hiện phân bổ</span></button>' +
            '</div>' +
        '</div>' +
        '<div class="ums-panel">' +
            '<div class="ums-panel__head">' +
                '<div class="ums-panel__title"><i class="fa-light fa-list-check"></i> Thông tin đã khai phân bổ <span class="ums-u-faint ums-u-fz13" data-z="n"></span></div>' +
                '<div class="ums-panel__tools">' +
                    '<button type="button" class="ums-btn ums-btn--delsel ums-btn--sm" data-a="xoa" disabled><i class="fa-light fa-trash-can"></i><span>Xoá đã chọn</span></button>' +
                    '<button type="button" class="ums-iconbtn" data-a="xem" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="tbl"></div>' +
        '</div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function v(id) { return H.val(document.getElementById(id)); }
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    H.s2(root);

    /* ---------- Ô chọn ------------------------------------------------------ */
    function loadKhoa(he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
            .then(function (r) { H.fill('pbKhoa', r, { name: 'TENKHOA' }); }).catch(fail('khóa đào tạo'));
    }
    function loadCT() {
        return H.rows({
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: v('pbKhoa'), strDaoTao_HeDaoTao_Id: v('pbHe'),
            strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '', strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 1000000
        }).then(function (r) { H.fill('pbCT', r, { name: 'TENCHUONGTRINH' }); }).catch(fail('chương trình'));
    }
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) { H.fill('pbHe', r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }).catch(fail('hệ đào tạo'));
    loadKhoa('');
    H.khoanThu().then(function (r) { H.fill('pbKhoanThu', r, { name: 'TEN', head: 'Chọn khoản thu' }); }).catch(fail('khoản thu'));
    jQuery(document.getElementById('pbKhoa')).on('select2:select', loadCT);
    jQuery(document.getElementById('pbHe')).on('select2:select', function () { loadKhoa(v('pbHe')); loadCT(); });
    // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
    ums.pat.chain(['pbHe', 'pbKhoa', 'pbCT'].map(function (id) { return document.getElementById(id); }));

    ums.report.mount(z('report'), {
        collect: function (add) {
            add('strHeDaoTao', v('pbHe'));
            add('strKhoaDaoTao', v('pbKhoa'));
            add('strLopQuanLy', '');
            add('strThoiGianDaoTao', '');
            add('strKhoanThu', v('pbKhoanThu'));
            add('strNghiepVu', '');
        }
    });

    /* ---------- Danh sách đã khai ------------------------------------------- */
    var rows = [];
    function loadKetQua() {
        var host = z('tbl');
        /* Kiểm host 2026-09-30: chưa chọn Hệ đào tạo lẫn Chương trình thì thủ tục danh sách trả ORA-24338 (kể cả khi đã chọn khoản thu) —
           bản gốc gọi ngay lúc mở màn nên mở là thấy lỗi. Ở đây chưa đủ ô lọc thì KHÔNG gọi, nhắc chọn. */
        if (!v('pbHe') && !v('pbCT')) {
            rows = [];
            z('n').textContent = '';
            host.innerHTML = ui.empty('Chọn Hệ đào tạo (hoặc Chương trình) rồi bấm “Xem thông tin đã khai phân bổ”', 'fa-filter');
            return Promise.resolve();
        }
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_PhanBo_DoanhThu/LayDSTC_BC_PhanBo_DacThu',
            method: 'GET',
            type: 'GET',
            strTaiChinh_CacKhoanThu_Id: v('pbKhoanThu'),
            strDaoTao_HeDaoTao_Id: v('pbHe'),
            strDaoTao_KhoaDaoTao_Id: v('pbKhoa'),
            strDaoTao_ChuongTrinh_Id: v('pbCT'),
            strNamHocDuLieu: v('pbNamHoc'),
            strHocKyDuLieu: v('pbHocKy'),
            strNguoiThucHien_Id: ''
        }).then(function (r) {
            rows = Array.isArray(r.data) ? r.data : [];
            z('n').textContent = '(' + rows.length + ')';
            ui.table({
                el: host, rows: rows, empty: 'Chưa có thông tin phân bổ',
                columns: [
                    { title: 'Phạm vi khai phân bổ', prop: 'PHAMVIAPDUNG_TEN' },
                    { title: 'Năm học', prop: 'NAM_DULIEU', cls: 'is-center' },
                    { title: 'Học kỳ', prop: 'KY_DULIEU', cls: 'is-center' },
                    { title: 'Năm phân bổ', prop: 'NAM_PHANBO', cls: 'is-center' },
                    { title: 'Tháng phân bổ', prop: 'THANG_PHANBO', cls: 'is-center' },
                    { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                    { head: '<input type="checkbox" data-x="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (x, i) { return '<input type="checkbox" data-x="' + i + '">'; } }
                ]
            });
            sync();
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thông tin đã khai phân bổ'); });
    }
    function picked() {
        return Array.prototype.filter.call(z('tbl').querySelectorAll('input[data-x]'), function (x) { return x.checked && x.getAttribute('data-x') !== 'all'; })
            .map(function (x) { return rows[Number(x.getAttribute('data-x'))]; });
    }
    function sync() {
        var n = picked().length, b = root.querySelector('[data-a="xoa"]');
        b.disabled = !n;
        b.querySelector('span').textContent = n ? 'Xoá ' + n + ' dòng đã chọn' : 'Xoá đã chọn';
        Array.prototype.forEach.call(z('tbl').querySelectorAll('input[data-x]'), function (x) {
            var tr = x.closest('tr'); if (tr && x.getAttribute('data-x') !== 'all') tr.classList.toggle('is-selected', x.checked);
        });
    }
    z('tbl').addEventListener('change', function (e) {
        var t = e.target;
        if (!t.matches || !t.matches('input[data-x]')) return;
        if (t.getAttribute('data-x') === 'all') {
            Array.prototype.forEach.call(z('tbl').querySelectorAll('input[data-x]'), function (x) { x.checked = t.checked; });
        }
        sync();
    });

    /* ---------- Tác vụ -------------------------------------------------------- */
    function phanBo() {
        /* Kiểm trước khi gửi (kiểm host 2026-09-30): bốn ô năm / kỳ / tháng máy chủ chỉ nhận SỐ — gõ "2031_2032" là ORA-01722 hiện thô. */
        var thieu = [];
        if (!v('pbKhoanThu')) thieu.push('Khoản thu');
        if (!v('pbHe') && !v('pbCT')) thieu.push('Hệ đào tạo / Chương trình');
        if (thieu.length) { ui.toast('Chưa chọn: ' + thieu.join(', '), 'warn'); return; }
        var so = [['pbNamHoc', 'Năm học', 1900, 2100], ['pbHocKy', 'Học kỳ', 1, 9], ['pbNamPB', 'Năm phân bổ', 1900, 2100], ['pbThangPB', 'Tháng phân bổ', 1, 12]];
        for (var i = 0; i < so.length; i++) {
            var gt = String(v(so[i][0]) || '').trim();
            if (!/^\d+$/.test(gt) || Number(gt) < so[i][2] || Number(gt) > so[i][3]) {
                ui.toast('Kiểm tra lại: ' + so[i][1] + ' phải là số từ ' + so[i][2] + ' đến ' + so[i][3] + ' (vd năm học 2025, học kỳ 1)', 'warn');
                var o = document.getElementById(so[i][0]); if (o) o.focus();
                return;
            }
        }
        ums.api.call({
            action: 'TC_PhanBo_DoanhThu/Them_TC_BC_PhanBo_DacThu',
            type: 'POST',
            strTaiChinh_CacKhoanThu_Id: v('pbKhoanThu'),
            strDaoTao_HeDaoTao_Id: v('pbHe'),
            strDaoTao_KhoaDaoTao_Id: v('pbKhoa'),
            strDaoTao_ChuongTrinh_Id: v('pbCT'),
            strNamHocDuLieu: v('pbNamHoc'),
            strHocKyDuLieu: v('pbHocKy'),
            strNamPhanBo: v('pbNamPB'),
            strThangPhanBo: v('pbThangPB'),
            strNguoiThucHien_Id: ''
        }).then(function () {
            ui.toast('Thêm mới thành công!', 'ok');
            loadKetQua();
        }).catch(fail('thực hiện phân bổ'));
    }

    function xoa() {
        var list = picked();
        if (!list.length) return ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn');
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            H.runAll(list.map(function (r) {
                return { action: 'TC_PhanBo_DoanhThu/Xoa_TC_BC_PhanBo_DacThu', strId: r.ID, strNguoiThucHien_Id: '' };
            }), 'Đang xoá', loadKetQua);
        });
    }

    root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'xem') loadKetQua();
        else if (a === 'phanbo') phanBo();
        else if (a === 'xoa') xoa();
    });

    loadKetQua();
})();
