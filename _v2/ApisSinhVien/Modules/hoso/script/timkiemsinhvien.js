/* =========================================================================
   Tìm kiếm sinh viên (phân hệ Sinh viên)
   Bản gốc: ApisSinhVien/Modules/hoso/html/timkiemsinhvien.html + script/timkiemsinhvien.js
   ---------------------------------------------------------------------------
   Bố cục gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Năm nhập học · Khoa QL ·
   Học kỳ / từ khoá · Tìm kiếm · Tạo hàng đợi · Xuất báo cáo / "Chọn trạng thái sinh viên" /
   thanh tiến trình hàng đợi) → khung "Danh sách" TRƯỜNG THÔNG TIN (Trường thông tin ·
   Thứ tự · ô đánh dấu). Đánh dấu một trường thì ô Thứ tự tự điền số tăng dần (iDem++),
   bỏ đánh dấu thì xoá số. Các trường đã đánh dấu + thứ tự là những cột báo cáo / hàng đợi
   sẽ xuất cho danh sách người học lọc theo khung tìm kiếm.
   Thanh lọc + khối báo cáo: ums.hsB (_hsB.js) trên ums.pat.boLocNguoiHoc.

   Lời gọi (chép nguyên):
     SV_TP_NguoiDung/LayDanhSach (GET) — strTuKhoa "" (gốc đọc txtAAAA), strNguoiDung_Id =
        người đăng nhập, strNguoiHoc_ThanhPhan_Id "", strNguoiTao_Id "" (dropAAAA),
        pageIndex 1, pageSize 10000 → NGUOIHOC_THANHPHAN_TEN, THUTU. Nút "Tìm kiếm" gọi lại
        đúng lời gọi này (gốc — KHÔNG gửi ô lọc nào; ô lọc chỉ dùng cho báo cáo / hàng đợi).
     SV_HangDoi/TaoHangDoi_TimNguoiHoc_TuDong (GET, không iM) — "Tạo hàng đợi": các cặp
        strNguoiHoc_ThanhPhan_Ids_0x (ID trường đã đánh dấu, lát 120) + strNguoiHoc_ThanhPhan_0x
        (THỨ TỰ tương ứng) + bộ lọc; xong thì nạp lại thanh tiến trình.
     Hàng đợi: ums.queue.mount (createHangDoi { strLoaiNhiemVu: "TIMKIEMSINHVIEN" }) — html
        gốc chỉ có tblTaskBar_TimKiemSinhVien, không có bảng lịch sử → history: false.
     Xuất báo cáo: ums.report.mount — html gốc chỉ có vùng zonebtnBaoCao_TKSV (không vùng
        _Import) → import: false. addKeyValue như "Tạo hàng đợi" nhưng strNguoiHoc_ThanhPhan_0x
        gửi "" (gốc).

   Khác bản gốc:
     · Luật cha → con của Hệ → Khoá → CT → Lớp (ums.pat.chain trong boLoc).
     · "Tạo hàng đợi" khi chưa đánh dấu trường nào: gốc vẫn gửi (danh sách trường rỗng) —
       bản mới hỏi lại trước khi gửi.
     · Bảng không phân trang (gốc truyền bPaginate nhưng lấy 10000 dòng một lần).
   Cố ý bỏ (mã chết): .btnClose / toggle_form, dropSearch_NguoiThu_TKSV, dropThoiGianDaoTao_TKSV,
     resetCombobox, endHangDoi (rỗng).
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, H = ums.hsB, esc = ui.esc;
    var root = document.getElementById('sv-timkiemsinhvien');
    if (!root) return;

    root.innerHTML = ums.pat.page('Tìm kiếm sinh viên', '') +
        '<div data-z="loc"></div>' +
        ums.pat.panel({ title: 'Danh sách', icon: 'fa-list', count: 'n', flush: true, zone: 'bang' });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = H.boLoc(z('loc'), { them: '<div class="ums-u-mt-4" data-z="hangdoi"></div>' });
    var bang = z('bang');

    /* Nút "Tạo hàng đợi" đứng giữa Tìm kiếm và Xuất báo cáo như gốc */
    var bc = loc.z('bc');
    bc.insertAdjacentHTML('beforebegin', '<div class="ums-field ums-field--fit">' +
        '<button type="button" class="ums-btn ums-btn--add" data-a="hangdoi"><i class="fa-light fa-rectangle-history"></i>' +
        '<span>Tạo hàng đợi</span></button></div>');

    ums.report.mount(bc, {
        import: false,
        collect: function (add) { loc.baoCao(add, H.daChon(bang, 'data-hsbt')); }
    });
    var hd = ums.queue.mount(root.querySelector('[data-z="hangdoi"]'), { strLoaiNhiemVu: 'TIMKIEMSINHVIEN', history: false });

    var iDem = 1;           // me.iDem gốc — không đặt lại khi nạp lại danh sách (như gốc)
    function danhSo(cb) {
        var o = bang.querySelector('[data-thutu="' + (window.CSS && CSS.escape ? CSS.escape(cb.getAttribute('data-hsbt')) : cb.getAttribute('data-hsbt')) + '"]');
        if (o) o.value = cb.checked ? iDem++ : '';
    }

    function tai() {
        z('n').textContent = '';
        bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'SV_TP_NguoiDung/LayDanhSach', method: 'GET',
            strTuKhoa: '',
            strNguoiDung_Id: H.uid(),
            strNguoiHoc_ThanhPhan_Id: '',
            strNguoiTao_Id: '',
            pageIndex: 1,
            pageSize: 10000
        }).then(function (r) {
            var rs = Array.isArray(r.data) ? r.data : [];
            ui.table({ el: bang, rows: rs, stt: true, empty: 'Không có dữ liệu', columns: [
                { title: 'Trường thông tin', prop: 'NGUOIHOC_THANHPHAN_TEN' },
                { title: 'Thứ tự', width: '100px', cls: 'is-center', render: function (x) {
                    return '<input class="ums-input" data-thutu="' + esc(H.e(x.ID)) + '" value="' + esc(H.e(x.THUTU)) + '" autocomplete="off">';
                } },
                H.cotChon('data-hsbt')
            ] });
            z('n').textContent = '(' + (Number(r.pager) || rs.length) + ')';
        }).catch(function (err) {
            bang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'SV_TP_NguoiDung/LayDanhSach');
        });
    }

    /* TaoHangDoi gốc */
    function taoHangDoi() {
        var ids = H.daChon(bang, 'data-hsbt');
        var thuTu = ids.map(function (id) {
            var o = bang.querySelector('[data-thutu="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
            return o ? o.value : '';
        });
        var hoi = ids.length ? Promise.resolve(true)
            : ui.confirm('Chưa đánh dấu trường thông tin nào. Vẫn tạo hàng đợi?', { ok: 'Tạo hàng đợi' });
        hoi.then(function (yes) {
            if (!yes) return;
            var c = H.chia(ids), t = H.chia(thuTu);
            var p = { action: 'SV_HangDoi/TaoHangDoi_TimNguoiHoc_TuDong', method: 'GET',
                strTuKhoa: loc.q(), strChucNang_Id: H.cn() };
            [0, 1, 2, 3].forEach(function (k) {
                p['strNguoiHoc_ThanhPhan_Ids_0' + (k + 1)] = c[k].toString();
                p['strNguoiHoc_ThanhPhan_0' + (k + 1)] = t[k].toString();
            });
            p.strNamNhapHoc = loc.v('nam');
            p.strKhoaQuanLy_Id = loc.v('kql');
            p.strHeDaoTao_Id = loc.v('he');
            p.strKhoaDaoTao_Id = loc.v('khoa');
            p.strChuongTrinh_Id = loc.v('ct');
            p.strLopQuanLy_Id = loc.v('lop');
            p.strNguoiDangNhap_Id = H.uid();
            p.strTrangThaiNguoiHoc_Id = loc.tt.val();
            return ums.api.call(p).then(function () {
                ui.toast('Khởi tạo dữ liệu thành công!', 'ok');
                hd.reload();
            });
        }).catch(function (err) { ums.api.handle(err, 'SV_HangDoi/TaoHangDoi_TimNguoiHoc_TuDong'); });
    }

    H.ganChon(bang, 'data-hsbt', danhSo);
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'hangdoi') taoHangDoi();
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });

    tai();
})();
