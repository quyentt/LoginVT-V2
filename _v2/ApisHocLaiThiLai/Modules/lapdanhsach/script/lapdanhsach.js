/* =========================================================================
   Lập danh sách học lại thi lại
   Bản gốc: ApisHocLaiThiLai/Modules/lapdanhsach/html/lapdanhsach.html + script/lapdanhsach.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Học kỳ · Khoa QL ·
   Đánh giá (chọn nhiều) / từ khoá · Tìm kiếm · Xuất báo cáo / Học phần · "Lấy học phần" /
   trạng thái sinh viên) → khung "Danh sách" (ẩn tới khi Tìm kiếm, nút × để đóng):
   bảng sinh viên, mỗi học phần một nhóm 4 cột (Đánh giá · Điểm · Lần học · Lần thi).
   Thanh lọc dùng chung: ums.hltl.boLoc (script/_hltl.js).

   Lời gọi (chép nguyên, đều GET):
       HLTL_ThongTinChung/LayDSHocPhanHocLaiThiLai   nút "Lấy học phần" → ô Học phần (TEN);
            gửi cả 'type': 'GET' làm tham số như gốc; strDaoTao_HocPhan_Id = '' (xem dưới),
            strTinhTrangXacNhan_Id = '' (gốc đọc dropAAAA).
       HLTL_ThongTinChung/LayDSNguoiHocHocLaiThiLai  Tìm kiếm → Data { rs: sinh viên, rsHocPhan: học phần }
            (pageIndex 1, pageSize 100000 — gốc không phân trang); strDaoTao_HocPhan_Id = ô Học phần.
       HLTL_ThongTinChung/LayKQNguoiHocHocLaiThiLai  MỘT lời gọi cho mỗi ô (sinh viên × học phần) →
            DANHGIA_TEN · DIEM · LANHOC · LANTHI. Trả RỖNG thì ẩn cả dòng sinh viên (như gốc).
            Giữ N × M lời gọi, chạy hàng đợi 6 luồng; tìm lại giữa chừng thì bỏ lượt cũ.
       Xuất báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_LDS") — html gốc không có
            vùng _Import nên không vẽ nút Import. Tham số báo cáo chép nguyên khối addKeyValue gốc.

   Cố ý bỏ (mã chết / không có lối vào ở giao diện gốc):
     · Khối "Thực hiện xử lý" (D_HangDoi/TaoHangDoi_LapDSHLTL_TuDong + hàng đợi LAPDSHLTL):
       html gốc đặt style="display: none" — người dùng không thấy nút. Bỏ, ghi can-quyet.
     · Ô "Học phần" ẩn (dropSearch_DMHocPhan, display:none) + lời gọi đổ nó
       KHCT_ThongTin/LayDSKS_DaoTao_HocPhan khi đổi Khoa QL: người dùng không chọn được →
       strDaoTao_HocPhan_Id của "Lấy học phần" luôn rỗng. Bỏ ô và lời gọi, gửi ''.
     · Nút lưu miễn giảm (#btnSaveChinhSach_PhanTram → TC_DoiTuong_MienGiam/ThemMoi, /Xoa) và
       SV_ChinhSach/LayDS_DoiTuong_CheDo (dropSearch_CheDo): chép từ màn Tài chính, html không
       có nút / ô nào → không bao giờ chạy. Bỏ.
     · Chung ba màn: xem đầu tệp _hltl.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, H = ums.hltl, esc = ui.esc;
    var root = document.getElementById('hltl-lapdanhsach');
    if (!root) return;

    root.innerHTML = ums.pat.page('Lập danh sách học lại thi lại', '') +
        '<div data-z="loc"></div>' + H.khungDS({ icon: 'fa-rectangle-list' });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = H.boLoc(z('loc'), {
        danhGiaNhieu: true, khoaQL: 'cctc', baoCao: true,
        hocPhan: {
            nut: 'Lấy học phần', ten: 'TEN',
            call: function (p) {
                return Object.assign({ action: H.AC + 'LayDSHocPhanHocLaiThiLai', method: 'GET', type: 'GET',
                    strNguoiThucHien_Id: H.uid() }, p, { strDaoTao_HocPhan_Id: '', strTinhTrangXacNhan_Id: '' });
            }
        }
    });

    /* Xuất báo cáo — khối addKeyValue của bản gốc (strDaoTao_HocPhan_Id / strTinhTrangXacNhan_Id
       gốc đọc dropAAAA → rỗng) */
    ums.report.mount(loc.z('bc'), {
        import: false,
        collect: function (add) {
            var p = loc.thamSo();
            Object.keys(p).forEach(function (k) { add(k, p[k]); });
            add('strDaoTao_HocPhan_Id', '');
            add('strTinhTrangXacNhan_Id', '');
            add('strNguoiThucHien_Id', H.uid());
        }
    });

    var luot = 0;

    function ve(rs, hp, dang) {
        var sh = ++luot;
        var cot = H.cotSV();
        hp.forEach(function (h, j) {
            var g = [H.e(h.TEN) + ' - ' + H.e(h.MA) + ' - ' + H.e(h.HOCTRINH)];
            [['Đánh giá', 'dg'], ['Điểm', 'd'], ['Lần học', 'lh'], ['Lần thi', 'lt']].forEach(function (c) {
                cot.push({ title: c[0], group: g, cls: 'is-center is-nowrap',
                    render: function (r, i) { return '<span data-kq="' + i + '|' + j + '|' + c[1] + '"></span>'; } });
            });
        });
        ui.table({ el: z('bang'), rows: rs, columns: cot, empty: 'Không có dữ liệu' });
        z('n').textContent = '(' + rs.length + ')';

        var bang = z('bang');
        function o(i, j, k) { return bang.querySelector('[data-kq="' + i + '|' + j + '|' + k + '"]'); }
        var viec = [];
        rs.forEach(function (sv, i) {
            hp.forEach(function (h, j) {
                viec.push(function () {
                    return ums.api.call({ action: H.AC + 'LayKQNguoiHocHocLaiThiLai', method: 'GET', silent: true,
                        strChucNang_Id: H.cn(), strQLSV_NguoiHoc_id: sv.ID, strDaoTao_HocPhan_Id: h.ID,
                        strDaoTao_ThoiGianDaoTao_Id: dang.strDaoTao_ThoiGianDaoTao_Id, strDanhGia_Id: dang.strDanhGia_Id })
                        .then(function (r) {
                            if (sh !== luot) return;
                            var d = H.arr(r.data);
                            if (!d.length) {
                                var tr = o(i, j, 'd') && o(i, j, 'd').closest('tr');
                                if (tr && !tr.hidden) {
                                    tr.hidden = true;
                                    z('n').textContent = '(' + bang.querySelectorAll('tbody tr:not([hidden])').length + ')';
                                }
                                return;
                            }
                            d.forEach(function (x) {
                                o(i, j, 'd').textContent = H.e(x.DIEM);
                                o(i, j, 'lh').textContent = H.e(x.LANHOC);
                                o(i, j, 'lt').textContent = H.e(x.LANTHI);
                                o(i, j, 'dg').textContent = H.e(x.DANHGIA_TEN);
                            });
                        })
                        .catch(function (err) { if (sh === luot) ums.api.handle(err, 'kết quả học lại thi lại'); });
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

    function tim() {
        var p = loc.thamSo();
        luot++;
        z('kq').hidden = false;
        z('n').textContent = '';
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(Object.assign({ action: H.AC + 'LayDSNguoiHocHocLaiThiLai', method: 'GET' }, p, {
            strDaoTao_HocPhan_Id: loc.hocPhan(), strTinhTrangXacNhan_Id: '', strNguoiThucHien_Id: H.uid(),
            pageIndex: 1, pageSize: 100000 }))
            .then(function (r) {
                var d = r.data || {};
                ve(H.arr(d.rs), H.arr(d.rsHocPhan), p);
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học lại thi lại'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'dong') { luot++; z('kq').hidden = true; }
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
