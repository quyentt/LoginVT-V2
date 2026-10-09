/* =========================================================================
   Thống kê hệ ngành — chỉ chọn điều kiện rồi in báo cáo
   Bản gốc: ApisCongCanBo/Modules/thongke/script/henganh.js + html/henganh.html
   ---------------------------------------------------------------------------
   Ô lọc: Hệ đào tạo (ums.ref.heDaoTao, pageSize 1000000) → Ngành
   (KHCT_ToChucChuongTrinh/LayNganhTheoHeDaoTao GET) · Năm nhập học (KHCT_NamNhapHoc/LayDanhSach, chọn nhiều).
   Mẫu báo cáo: ums.report.mount — strHeDaoTao_Id, strNganh_Id, strNam_Id (getValCombo: nhiều giá trị nối phẩy).
   Bỏ các hàm nạp ô không có trên màn (khoá / lớp / khoa quản lý / học kỳ — chép từ màn khác, không nơi nào gọi).
   Theo luật chung: chưa chọn Hệ thì khoá Ngành (bản gốc nạp Ngành với hệ rỗng lúc mở màn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tk-henganh');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    root.innerHTML = pat.page('Thống kê hệ ngành', '') +
        pat.filterBar([
            { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' },
            { key: 'nganh', label: 'Chọn ngành', type: 'select' },
            { key: 'nam', label: 'Tất cả năm nhập học', type: 'select', multiple: true }
        ], { search: false, extra: '<div class="ums-field ums-field--fit" data-z="bc"></div>' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); })
        .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
    ums.api.call({ action: 'KHCT_NamNhapHoc/LayDanhSach', strNguoiThucHien_Id: '', silent: true })
        .then(function (r) { pat.fill(f('nam'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC' }); }).catch(function (err) { ums.api.handle(err, 'năm nhập học'); });
    function napNganh() {
        return ums.api.call({ action: 'KHCT_ToChucChuongTrinh/LayNganhTheoHeDaoTao', method: 'GET', strDaoTao_HeDaoTao_Id: f('he').value, strNguoiThucHien_Id: uid(), silent: true })
            .then(function (r) { pat.fill(f('nganh'), arr(r.data), { name: 'TENCHUONGTRINH' }); }).catch(function (err) { ums.api.handle(err, 'ngành'); });
    }
    if (window.jQuery) jQuery(f('he')).on('select2:select', napNganh);
    ums.pat.chain([f('he'), f('nganh')], { phatLai: false });

    ums.report.mount(root.querySelector('[data-z="bc"]'), { collect: function (add) {
        add('strHeDaoTao_Id', f('he').value);
        add('strNganh_Id', f('nganh').value);
        add('strNam_Id', pat.val(f('nam')));
    } });
})();
