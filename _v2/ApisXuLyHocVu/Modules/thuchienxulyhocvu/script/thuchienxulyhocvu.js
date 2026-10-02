/* =========================================================================
   Thực hiện xử lý học vụ
   Bản gốc: ApisXuLyHocVu/Modules/thuchienxulyhocvu/html/thuchienxulyhocvu.html
            + script/thuchienxulyhocvu.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Năm nhập học ·
   Khoa QL · Học kỳ · số luồng / Loại xử lý · Mức xử lý · từ khoá · Tìm kiếm · Xuất báo cáo ·
   Import / "Chọn trạng thái sinh viên" / khối "Thực hiện xử lý": Kế hoạch xử lý · nút
   "Thực hiện xử lý" · thanh tiến trình hàng đợi) → khung "Danh sách" (ẩn tới khi Tìm kiếm,
   nút × để đóng): Thông tin học viên (7 cột) · Kết quả xử lý · Điều kiện xử lý · Thông số xử lý.
   Thanh lọc + bảng dùng chung với Tra cứu kết quả: ums.xlhvKQ (script/_ketqua.js).

   Lời gọi (chép nguyên, đều GET):
       XLHV_KetQuaXuLy/LayDanhSach · XLHV_KetQuaXuLy/LayDuLieuTuKhoaKetQuaXuLy — xem _ketqua.js
       XLHV_HangDoi/TaoHangDoi_XLHV_TuDong   nút "Thực hiện xử lý" (hỏi lại trước). strTuKhoa gốc đọc
            txtAAAA → '' (KHÔNG phải ô từ khoá tìm kiếm). Xong: "Khởi tạo dữ liệu thành công, vui
            lòng chạy tiến trình để thực hiện!" + nạp lại hàng đợi.
       Hàng đợi XET_XULYHOCVU (createHangDoi, strName ThucHienXuLy): ums.queue.mount — html gốc
            chỉ có #tblTaskBar_ThucHienXuLy, không có #tblHistory_… → không vẽ lịch sử.
            endHangDoi gốc rỗng (dòng nạp lại đã bị chú thích) → không onDone.
       Ô "N luồng cùng chạy": gốc đặt edu.system.iGioiHanLuong (giới hạn lời gọi song song toàn hệ)
            → ở đây là số luồng điền cột "Thông số xử lý" VÀ số luồng khi bấm "Bắt đầu" hàng đợi.
       Xuất báo cáo / Import: ums.report.mount (getList_MauImport "zonebtnXLHV" — html có vùng
            _Import nên có nút Import). Cặp addKeyValue chép nguyên, kể cả 'action' =
            XLHV_HangDoi/TaoHangDoi_XLHV_TuDong, strTuKhoa '' (txtAAAA) và strChucNang_Id mà obj_list
            gốc gửi kèm vào báo cáo.

   Khác bản gốc:
     · Hỏi lại bằng ums.ui.confirm — gốc gắn thêm một trình xử lý #btnYes MỖI lần bấm "Thực hiện
       xử lý", bấm lần thứ hai là tạo hàng đợi hai lần.
     · Chung với Tra cứu kết quả: xem đầu tệp _ketqua.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, K = ums.xlhvKQ;
    var root = document.getElementById('xlhv-thuchienxulyhocvu');
    if (!root) return;

    root.innerHTML = ums.pat.page('Thực hiện xử lý học vụ', '') +
        '<div data-z="loc"></div>' + K.khungDS();
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = K.boLoc(z('loc'), {
        hang: [['he', 'khoa', 'ct', 'lop'], ['nam', 'kql', 'hk', 'luong'], ['loai', 'muc', 'q', 'nut']],
        them:
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-folder-gear"></i> Thực hiện xử lý</div>' +
            '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch xử lý"><option value=""></option></select></div>' +
                '<div class="ums-field ums-field--fit">' +
                    ui.btn('search', { text: 'Thực hiện xử lý', icon: 'fa-gear-complex-code', attr: { 'data-a': 'thuchien' } }) +
                '</div>' +
            '</div>' +
            '<div class="ums-u-mt-3" data-z="hd"></div>'
    });

    var qOpts = { strLoaiNhiemVu: 'XET_XULYHOCVU', strName: 'ThucHienXuLy', history: false, concurrency: loc.luong() };
    var hangDoi = ums.queue.mount(loc.z('hd'), qOpts);
    loc.f('luong').addEventListener('change', function () { qOpts.concurrency = loc.luong(); });

    ums.report.mount(loc.z('bc'), {
        collect: function (add) {
            loc.baoCao(add, {
                action: 'XLHV_HangDoi/TaoHangDoi_XLHV_TuDong',
                strTuKhoa: '',
                strChucNang_Id: K.cn()
            });
        }
    });

    var kq = K.ketQua(root, {
        thamSo: loc.thamSo,
        luong: loc.luong,
        cot: function () {
            var g = ['Thông tin học viên'];
            return [
                { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN', group: g },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', group: g, cls: 'is-nowrap' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: g },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', group: g, cls: 'is-nowrap' },
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: g, cls: 'is-nowrap' },
                { title: 'Họ tên', group: g, cls: 'is-nowrap', render: function (r) { return ui.esc(K.hoTen(r)); } },
                { title: 'Trạng thái hiện tại', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', group: g },
                { title: 'Kết quả xử lý', prop: 'MUCXULY_TEN' },
                { title: 'Điều kiện xử lý', prop: 'XLHV_KEHOACHXULY_TEN' }
            ];
        }
    });

    /* TaoHangDoi_ThucHienXuLy gốc */
    function thucHien() {
        ui.confirm('Bạn có chắc chắn thực hiện xử lý không?', { title: 'Thực hiện xử lý', ok: 'Thực hiện xử lý' })
            .then(function (yes) {
                if (!yes) return;
                var v = loc.v;
                ums.api.call({
                    action: 'XLHV_HangDoi/TaoHangDoi_XLHV_TuDong', method: 'GET',
                    strTuKhoa: '',
                    strChucNang_Id: K.cn(),
                    strKhoaQuanLy_Id: v('kql'),
                    strHeDaoTao_Id: v('he'),
                    strKhoaDaoTao_Id: v('khoa'),
                    strChuongTrinh_Id: v('ct'),
                    strLopQuanLy_Id: v('lop'),
                    strNamNhapHoc: v('nam'),
                    strNguoiThucHien_Id: K.uid(),
                    strTrangThaiNguoiHoc_Id: loc.tt.val(),
                    strDaoTao_ThoiGianDaoTao_Id: v('hk'),
                    strXLHV_KeHoachXuLy_Id: v('kh'),
                    strLoaiXuLy_Id: v('loai')
                }).then(function () {
                    ui.toast('Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!', 'ok');
                    hangDoi.reload();
                }).catch(function (err) { ums.api.handle(err, 'XLHV_HangDoi/TaoHangDoi_XLHV_TuDong'); });
            });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') kq.tim();
        else if (a === 'thuchien') thucHien();
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); kq.tim(); } });
})();
