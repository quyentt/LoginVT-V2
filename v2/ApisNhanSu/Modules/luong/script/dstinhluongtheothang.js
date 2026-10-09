/* =========================================================================
   Tính lương theo tháng — danh sách nhân sự TÍNH LƯƠNG trong tháng và nhân sự CHƯA GÁN
   Bản gốc: ApisNhanSu/Modules/luong/script/dstinhluongtheothang.js
   Bố cục như gốc: thanh lọc + hai khung đặt cạnh nhau (trái "Danh sách nhân sự tính lương
   theo tháng", phải "Danh sách nhân sự chưa gán"), mỗi khung một ô từ khoá.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_BangQuyDinhLuong/LayDanhSach            GET  ô quy định (tên MUCLUONGCOBAN)
       NS_HoSoV2/LayDanhSach                     GET  ô thành viên theo đơn vị (dLaCanBoNgoaiTruong 0)
       L_BangLuong_NhanSu/LayDanhSach            GET  strTuKhoa '', strNhanSu_QuyDinhLuong_Id, strLoaiBangLuong_Id,
                                                      strNam, strThang, strDaoTao_CoCauToChuc_Id,
                                                      strNhanSu_HoSoCanBo_Id, strNguoiTao_Id '', 1/100000
       L_BangLuong_NhanSu/LayDSNNhanSu_Luong_ConLai GET  cùng tham số
   Danh mục: NHANSU.LOAIBANGLUONG.
   BẢN GỐC LÀM DỞ — làm theo Ý ĐỊNH, ghi lại:
     · Hai lời gọi danh sách đổ kết quả vào Ô CHỌN THÀNH VIÊN (genComBo_HS) chứ không vẽ vào hai
       khung — trên hệ cũ hai khung luôn trống. Bản mới vẽ vào đúng khung (dòng hiện "HOTEN - MASO"
       như Render của gốc; tên cột trả về chưa xác nhận).
     · Gán / bỏ gán (kéo thả, nút "Chọn") gốc KHÔNG có: hàm lưu/xoá gọi
       KHCT_HocPhan_KhoiTuChon_Don/ThemMoi | Xoa (chép từ màn chương trình – học phần, không nơi nào
       gọi), hàm thả drop_ChuaGan_handler không tồn tại → chỉ XEM, không chuyển.
     · Ô từ khoá hai khung gốc không có xử lý → lọc tại chỗ trên danh sách đã nạp.
     · Mở màn gốc gọi ngay danh sách tính lương (đổ vào ô thành viên) → bỏ; chỉ nạp khi bấm "Danh sách".
   Khác gốc: Đơn vị → Thành viên khoá con khi chưa chọn cha (luật chung).
   Bỏ mã chết: "Xem" / "Tính lương" / báo cáo (nút không có trên màn), bảng tblKhoiTao_NhanSu.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, A = ums.luongA;
    var root = document.getElementById('dstinhluongtheothang');
    if (!root) return;
    var e = A.e, arr = A.arr;
    function esc(s) { return ui.esc(s); }
    var ds = { tinh: [], chua: [] };

    function khung(k, title, icon) {
        return pat.panel({ title: title, icon: icon, flush: true, count: 'dem_' + k,
            body: '<div class="ums-master__search"><div class="ums-searchbar ums-searchbar--sm">' +
                '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                '<input class="ums-searchbar__input" data-q="' + k + '" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
                '<div data-z="bang_' + k + '">' + ui.empty('Chọn điều kiện rồi bấm Danh sách', 'fa-hand-pointer') + '</div>' });
    }
    root.innerHTML =
        pat.page('Tính lương theo tháng', '') +
        pat.filterBar([
            { key: 'qd', label: 'Chọn quy định lương', type: 'select' },
            { key: 'loai', label: 'Chọn loại bảng lương', type: 'select' },
            { key: 'dv', label: 'Chọn đơn vị', type: 'select' },
            { key: 'tv', label: 'Chọn thành viên', type: 'select' },
            { key: 'nam', label: 'Nhập năm tìm kiếm' },
            { key: 'thang', label: 'Nhập tháng tìm kiếm' }
        ], { searchText: 'Danh sách' }) +
        '<div class="ums-grid ums-grid--2">' +
            khung('tinh', 'Danh sách nhân sự tính lương theo tháng', 'fa-file-lines') +
            khung('chua', 'Danh sách nhân sự chưa gán', 'fa-book') +
        '</div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    ums.api.call({ action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) { pat.fill(f('qd'), arr(r.data), { name: 'MUCLUONGCOBAN', head: 'Chọn quy định lương' }); })
        .catch(function (err) { ums.api.handle(err, 'quy định lương'); });
    ums.api.dm('NHANSU.LOAIBANGLUONG').then(function (r) { pat.fill(f('loai'), r, { head: 'Chọn loại bảng lương' }); }).catch(function () {});
    A.coCau(f('dv'), 'Chọn đơn vị');
    if (window.jQuery) {
        jQuery(f('dv')).on('select2:select select2:clear', function () {
            if (f('dv').value) A.thanhVien(f('tv'), f('dv').value, 0, 'Chọn thành viên'); else pat.fill(f('tv'), [], { head: 'Chọn thành viên' });
        });
        pat.chain([f('dv'), f('tv')], { phatLai: false });
    }

    function ve(k) {
        var q = (root.querySelector('[data-q="' + k + '"]').value || '').trim().toLowerCase();
        var rows = ds[k].filter(function (r) { return !q || (e(r.HOTEN) + ' ' + e(r.MASO)).toLowerCase().indexOf(q) >= 0; });
        root.querySelector('[data-z="dem_' + k + '"]').textContent = '(' + ds[k].length + ')';
        ui.table({ el: z('bang_' + k), rows: rows, empty: 'Không có dữ liệu', tableCls: 'ums-table--lined ums-table--tight',
            columns: [{ title: 'Nhân sự', render: function (r) { return esc(e(r.HOTEN) + ' - ' + e(r.MASO)); } }] });
    }
    function nap() {
        var ts = {
            method: 'GET', strTuKhoa: '', strNhanSu_QuyDinhLuong_Id: f('qd').value, strLoaiBangLuong_Id: f('loai').value,
            strNam: f('nam').value.trim(), strThang: f('thang').value.trim(), strDaoTao_CoCauToChuc_Id: f('dv').value,
            strNhanSu_HoSoCanBo_Id: f('tv').value, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000
        };
        [['tinh', 'L_BangLuong_NhanSu/LayDanhSach'], ['chua', 'L_BangLuong_NhanSu/LayDSNNhanSu_Luong_ConLai']].forEach(function (x) {
            var c = {}; Object.keys(ts).forEach(function (kk) { c[kk] = ts[kk]; }); c.action = x[1];
            z('bang_' + x[0]).innerHTML = A.dangTai();
            ums.api.call(c).then(function (r) { ds[x[0]] = arr(r.data); ve(x[0]); })
                .catch(function (err) { z('bang_' + x[0]).innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách nhân sự'); });
        });
    }
    root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) nap(); });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target.matches && ev.target.matches('[data-f="nam"], [data-f="thang"]')) { ev.preventDefault(); nap(); }
    });
    root.addEventListener('input', function (ev) { var k = ev.target.getAttribute && ev.target.getAttribute('data-q'); if (k) ve(k); });
})();
