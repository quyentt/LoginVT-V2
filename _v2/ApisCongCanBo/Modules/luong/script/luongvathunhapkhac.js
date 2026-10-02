/* =========================================================================
   Lương và thu nhập khác — tra cứu của cán bộ đang đăng nhập (CHỈ XEM)
   Bản gốc: ApisCongCanBo/Modules/luong/script/luongvathunhapkhac.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, GET, chép nguyên):
       L_DuocNhan/LayDanhSach     "Danh sách khoản được nhận khác" — phân trang
           strTuKhoa, strDaoTao_CoCauToChuc_Id '', strNgayPhatSinh_TuNgay/_DenNgay,
           strNhanSu_HoSoCanBo_Id = userId, strNam, dLaCanBoNgoaiTruong -1 (ô ẩn "Toàn bộ nhân sự" của gốc — gửi rỗng thì máy chủ trả 400), strNguoiTao_Id '',
           pageIndex, pageSize
       L_KetQuaLuong/LayDanhSach  "Danh sách lương và thu nhập khác" — gọi SAU bảng trên
           strDaoTao_CoCauToChuc_Id '', strNhanSu_HoSoCanBo_Id, dThang / dNam (trống → -1)
   Mở màn: Năm = năm nay, nạp ngay. Dòng tổng mỗi bảng cộng Số tiền + Thuế TNCN;
   dòng tóm tắt "Tổng lương và thu nhập khác – Tổng thuế TNCN" cộng
   TONGLUONG_THUNHAPKHAC / TONGTHUE_TNCN của dòng đầu mỗi bảng, chỉ hiện khi > 0.

   Không chuyển (bản gốc ẩn / chú thích): bốn ô lọc Đơn vị, Tình trạng làm
   việc, Thành viên, Là cán bộ (display:none — gửi rỗng); nút Import và vùng
   Xuất báo cáo (khối HTML bị chú thích); biểu mẫu thêm/sửa được nhận khác và
   hộp chọn giảng viên (không có nút nào mở trên màn).

   Khác bản gốc: dòng tóm tắt cộng hai tổng bằng `+=` trên giá trị máy chủ trả
   (chuỗi thì thành NỐI chuỗi) — ở đây cộng theo số.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('luongvathunhapkhac');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function num(v) { var n = Number(String(v || '').replace(/,/g, '')); return isNaN(n) ? 0 : n; }

    root.innerHTML =
        pat.page('Lương và thu nhập khác', '') +
        pat.filterBar([
            { key: 'nam', label: 'Năm tìm kiếm', value: String(new Date().getFullYear()) },
            { key: 'thang', label: 'Tháng tìm kiếm' },
            { key: 'tuNgay', label: 'Tìm kiếm từ ngày', type: 'date' },
            { key: 'denNgay', label: 'Tìm kiếm đến ngày', type: 'date' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        '<div class="ums-u-mb-4" data-z="tong" hidden></div>' +
        pat.panel({ title: 'Danh sách khoản được nhận khác', icon: 'fa-circle-dollar-to-slot', count: 'dem1', flush: true, zone: 'bang1' }) +
        '<div class="ums-u-mt-4"></div>' +
        pat.panel({ title: 'Danh sách lương và thu nhập khác', icon: 'fa-money-check-dollar-pen', count: 'dem2', flush: true, zone: 'bang2' });
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function v(k) { return (f(k).value || '').trim(); }

    var trang = 1, co = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10;
    var tongLuong = 0, tongThue = 0;

    function hoTen(r) { return esc((r.NHANSU_HOSOCANBO_HODEM || '') + ' ' + (r.NHANSU_HOSOCANBO_TEN || '')); }
    function tien(k) { return { title: k === 'SOTIEN' ? 'Số tiền' : 'Thuế TNCN', cls: 'is-right', render: function (r) { return ui.money(r[k]); }, sum: true, sumProp: k }; }
    function tomTat() {
        var el = z('tong');
        el.hidden = !(tongLuong > 0 || tongThue > 0);
        el.innerHTML = '<div class="ums-panel"><div class="ums-panel__body ums-u-fz16">Tổng lương và thu nhập khác: <b style="color:var(--ums-blue)">' +
            ui.money(tongLuong) + '</b> — Tổng thuế TNCN: <b style="color:var(--ums-warn)">' + ui.money(tongThue) + '</b></div></div>';
    }

    function bang2() {
        z('bang2').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({
            action: 'L_KetQuaLuong/LayDanhSach', method: 'GET',
            strDaoTao_CoCauToChuc_Id: '', strNhanSu_HoSoCanBo_Id: uid(),
            dThang: v('thang') || -1, dNam: v('nam') || -1, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var rows = arr(r.data);
            z('dem2').textContent = '(' + rows.length + ')';
            ui.table({
                el: z('bang2'), rows: rows, empty: 'Không có dữ liệu', tableCls: 'ums-table--lined ums-table--tight',
                columns: [
                    { title: 'Năm', prop: 'NAM', cls: 'is-center' },
                    { title: 'Tháng', prop: 'THANG', cls: 'is-center' },
                    { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                    { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
                    { title: 'Họ tên', render: hoTen },
                    { title: 'Mã số thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE' },
                    { title: 'Chứng từ', prop: 'CHUNGTU' },
                    tien('SOTIEN'), tien('THUETNCN'),
                    { title: 'Nội dung', prop: 'MOTA' },
                    { title: 'Ngày phát sinh', prop: 'NGAYPHATSINH', cls: 'is-center is-nowrap' }
                ]
            });
            if (rows.length) { tongLuong += num(rows[0].TONGLUONG_THUNHAPKHAC); tongThue += num(rows[0].TONGTHUE_TNCN); }
            tomTat();
        }).catch(function (err) { z('bang2').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lương và thu nhập khác'); });
    }

    function tai(p) {
        if (p) trang = p;
        z('bang1').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({
            action: 'L_DuocNhan/LayDanhSach', method: 'GET',
            strTuKhoa: v('q'), strDaoTao_CoCauToChuc_Id: '',
            strNgayPhatSinh_TuNgay: v('tuNgay'), strNgayPhatSinh_DenNgay: v('denNgay'),
            strNhanSu_HoSoCanBo_Id: uid(), strNam: v('nam'), dLaCanBoNgoaiTruong: -1, strNguoiTao_Id: '',
            pageIndex: trang, pageSize: co
        }).then(function (r) {
            var rows = arr(r.data);
            z('dem1').textContent = '(' + (r.pager || rows.length) + ')';
            ui.table({
                el: z('bang1'), rows: rows, empty: 'Không có dữ liệu', tableCls: 'ums-table--lined ums-table--tight',
                page: { index: trang, size: co, total: r.pager || rows.length, onChange: tai,
                        onSize: function (s) { co = s; tai(1); } },
                columns: [
                    { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                    { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
                    { title: 'Họ tên', render: hoTen },
                    { title: 'Mã số thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE' },
                    { title: 'Chứng từ', prop: 'CHUNGTU' },
                    tien('SOTIEN'), tien('THUETNCN'),
                    { title: 'Nội dung', prop: 'MOTA' },
                    { title: 'Khoản được nhận', prop: 'LOAIKHOAN_TEN' },
                    { title: 'Ngày phát sinh', prop: 'NGAYPHATSINH', cls: 'is-center is-nowrap' }
                ]
            });
            tongLuong = rows.length ? num(rows[0].TONGLUONG_THUNHAPKHAC) : 0;
            tongThue = rows.length ? num(rows[0].TONGTHUE_TNCN) : 0;
            tomTat();
            return bang2();
        }).catch(function (err) { z('bang1').innerHTML = ui.fail(err.message); ums.api.handle(err, 'khoản được nhận khác'); });
    }

    root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) tai(1); });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target.matches && ev.target.matches('[data-f]')) { ev.preventDefault(); tai(1); }
    });
    tai(1);
})();
