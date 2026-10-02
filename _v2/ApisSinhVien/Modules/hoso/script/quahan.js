/* =========================================================================
   Quá hạn — thời hạn học tập theo phân loại (phân hệ Sinh viên)
   Bản gốc: ApisSinhVien/Modules/hoso/html/quahan.html + script/QuaHan.js
            (html nạp "QuaHan.js", tệp thật là quahan.js — IIS không phân biệt hoa thường)
   ---------------------------------------------------------------------------
   Bố cục gốc (một cột): khung Tìm kiếm (Hệ · Khoá · CT · Lớp / Năm nhập học · Khoa QL ·
   Học kỳ / từ khoá · Tìm kiếm · Xuất báo cáo · Import / "Chọn trạng thái sinh viên")
   → khung "Danh sách" (tiêu đề hai tầng: "Thông tin cá nhân" 10 cột + "Thời hạn học tập
   theo phân loại" mỗi mục danh mục TD.PHANLOAI một cột, ô đánh dấu cuối).
   Thanh lọc + khối báo cáo: ums.hsB (_hsB.js) trên ums.pat.boLocNguoiHoc.

   Lời gọi (chép nguyên):
     SV_TD_ThongTin_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP · pkg_td_thongtin.LayDanhSachHoSoNhieuNganh
        strTuKhoa, strKhoaQuanLy_Id, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id,
        strLopQuanLy_Id, strNguoiDangNhap_Id, strTrangThaiNguoiHoc_Id, strNguoiTao_Id: ""
        (gốc đọc dropAAAA), pageIndex / pageSize (mặc định 10) — phân trang máy chủ.
     SV_TD_TinhToan_MH/DSA4ChAVKCQvBS4VKSQuESkgLw0uICgP · pkg_td_tinhtoan.LayKQTienDoTheoPhanLoai
        MỖI Ô (người học × phân loại) một lời gọi như gốc: strQLSV_NguoiHoc_Id =
        QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id = DAOTAO_TOCHUCCHUONGTRINH_ID,
        strPhanLoai_Id, strNguoiThucHien_Id → KETQUA (dòng cuối thắng như gốc .html()).
        Chạy hàng đợi 6 luồng; đổi trang / tìm lại giữa chừng thì bỏ lượt cũ.
     Danh mục TD.PHANLOAI (cột động), QLSV.TRANGTHAI (trạng thái).
     Xuất báo cáo / Import: ums.report.mount (html gốc có cả vùng _Import).
        addKeyValue: strNguoiHoc_ThanhPhan_Ids_0x = ID DÒNG đã đánh dấu ở bảng (như gốc —
        khối này chép từ màn Tìm kiếm sinh viên, nơi ô đánh dấu là "trường thông tin").

   Khác bản gốc:
     · Luật cha → con của Hệ → Khoá → CT → Lớp (ums.pat.chain trong boLoc).
     · Ô "Thời hạn…" lỗi thì báo MỘT lần mỗi lượt (gốc alert từng ô).
   Cố ý bỏ (mã chết — không có nút / vùng trong html gốc): #btnDeleteQuaHan (gọi hàm
     delete_HSSV KHÔNG tồn tại), .btnClose / toggle_form / toggle_edit, #chkSelectAll_QuaHan,
     dropSearch_NguoiThu_QLTB, dropThoiGianDaoTao_QLTB, resetCombobox.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, H = ums.hsB, esc = ui.esc;
    var root = document.getElementById('sv-quahan');
    if (!root) return;

    root.innerHTML = ums.pat.page('Quá hạn', '') + '<div data-z="loc"></div>' +
        ums.pat.panel({ title: 'Danh sách', icon: 'fa-building', count: 'n', flush: true, zone: 'bang' });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = H.boLoc(z('loc'));
    var bang = z('bang');
    ums.report.mount(loc.z('bc'), {
        collect: function (add) { loc.baoCao(add, H.daChon(bang, 'data-hsbx')); }
    });

    var trang = { index: 1, size: 10 }, luot = 0;
    var phanLoai = ums.api.dm('TD.PHANLOAI').catch(function (err) { ums.api.handle(err, 'TD.PHANLOAI'); return []; });

    function tai(p) {
        if (p) trang.index = p;
        var sh = ++luot;
        z('n').textContent = '';
        bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var q = loc.thamSo();
        q.action = 'SV_TD_ThongTin_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP';
        q.func = 'pkg_td_thongtin.LayDanhSachHoSoNhieuNganh';
        q.strNguoiTao_Id = '';
        q.pageIndex = trang.index;
        q.pageSize = trang.size;
        Promise.all([ums.api.call(q), phanLoai]).then(function (kq) {
            if (sh !== luot) return;
            var r = kq[0], pl = kq[1] || [];
            ve(sh, Array.isArray(r.data) ? r.data : [], pl, Number(r.pager) || 0);
        }).catch(function (err) {
            if (sh !== luot) return;
            bang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'LayDanhSachHoSoNhieuNganh');
        });
    }

    function ve(sh, rs, pl, tong) {
        var g = ['Thông tin cá nhân'], g2 = ['Thời hạn học tập theo phân loại'];
        var cot = [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: g, cls: 'is-nowrap' },
            { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', group: g, cls: 'is-nowrap' },
            { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', group: g, cls: 'is-nowrap' },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', group: g, cls: 'is-nowrap' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: g, cls: 'is-nowrap' },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: g, cls: 'is-nowrap' },
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN', group: g, cls: 'is-nowrap' },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', group: g, cls: 'is-nowrap' },
            { title: 'QĐ nhập trường', prop: 'SOQDNHAPTRUONG', group: g, cls: 'is-nowrap' },
            { title: 'Ngày QĐ nhập trường', prop: 'NGAYQDNHAPTRUONG', group: g, cls: 'is-nowrap' }
        ];
        pl.forEach(function (p, j) {
            cot.push({ title: H.e(p.TEN), group: g2, cls: 'is-center is-nowrap',
                render: function (r, i) { return '<span data-kq="' + i + '|' + j + '"></span>'; } });
        });
        cot.push(H.cotChon('data-hsbx'));

        ui.table({ el: bang, rows: rs, columns: cot, stt: true, empty: 'Không có dữ liệu',
            page: { index: trang.index, size: trang.size, total: tong || rs.length,
                onChange: function (p) { tai(p); },
                onSize: function (s) { trang.size = s; tai(1); } } });
        z('n').textContent = '(' + (tong || rs.length) + ')';

        /* getList_KetQua gốc: một lời gọi cho mỗi ô */
        var viec = [], baoLoi = false;
        rs.forEach(function (sv, i) {
            pl.forEach(function (p, j) {
                viec.push(function () {
                    return ums.api.call({
                        action: 'SV_TD_TinhToan_MH/DSA4ChAVKCQvBS4VKSQuESkgLw0uICgP',
                        func: 'pkg_td_tinhtoan.LayKQTienDoTheoPhanLoai', silent: true,
                        strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID,
                        strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID,
                        strPhanLoai_Id: p.ID,
                        strNguoiThucHien_Id: H.uid()
                    }).then(function (r) {
                        if (sh !== luot) return;
                        var o = bang.querySelector('[data-kq="' + i + '|' + j + '"]');
                        (Array.isArray(r.data) ? r.data : []).forEach(function (x) { if (o) o.innerHTML = esc(H.e(x.KETQUA)); });
                    }).catch(function (err) {
                        if (sh !== luot || baoLoi) return;
                        baoLoi = true;
                        ums.api.handle(err, 'LayKQTienDoTheoPhanLoai');
                    });
                });
            });
        });
        var k = 0;
        function chay() {
            if (sh !== luot || k >= viec.length) return Promise.resolve();
            return viec[k++]().then(chay);
        }
        for (var n = 0; n < 6; n++) chay();
    }

    H.ganChon(bang, 'data-hsbx');
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="search"]');
        if (b && root.contains(b)) tai(1);
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

    /* Gốc nạp danh sách ngay khi mở màn — chờ ô trạng thái vẽ xong (dm có đệm, cùng lời gọi
       với boLoc) để lần đầu đã gửi đủ trạng thái đánh dấu sẵn (gốc chạy đua hai lời gọi). */
    ums.api.dm('QLSV.TRANGTHAI').then(function () { setTimeout(function () { tai(1); }, 0); }, function () { tai(1); });
})();
