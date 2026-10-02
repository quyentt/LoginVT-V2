/* =========================================================================
   Hợp đồng cán bộ — hợp đồng lao động của từng cán bộ + danh sách sắp hết hạn
   Bản gốc: ApisNhanSu/Modules/hopdong/html/hopdongcanbo.html + script/hopdongcanbo.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái "Danh sách cán bộ" (từ khoá + Khoa/Viện/Phòng ban → Bộ môn
   + Tình trạng làm việc; đổi ô lọc là nạp lại như gốc — ums.nsCham.dsNhanSu);
   phải ba khung đổi chỗ nhau:
     · "Danh sách cán bộ sắp hết hạn hợp đồng" (lúc mở màn) — nút Xem mở
     · "Danh sách dự kiến sắp hết hạn hợp đồng" (bảng + Xuất excel + Đóng)
     · bấm một cán bộ → "Hợp đồng lao động — <họ tên> - Mã cán bộ: <mã>" (ums.crud nhúng:
       bảng + Thêm mới / biểu mẫu thay chỗ). Gốc có dải tab MỘT tab "Hợp đồng cán bộ"
       và khung thu gọn "Hợp đồng lao động" → bỏ dải tab (luật chung: một tab thì không vẽ).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       danh sách cán bộ / cơ cấu tổ chức — ums.nsCham.dsNhanSu (_chung.js);
       Tình trạng làm việc: NS.TTNS (constant CATOR.NS.TTNS)
       NS_ThongTinHopDong/LayDanhSach  GET  strTuKhoa '' (gốc đọc ô txtSearch_TuKhoa không có),
            strNhanSu_HoSoCanBo_Id, strNguoiThucHien_Id '', pageIndex, pageSize
       NS_ThongTinHopDong/LayChiTiet   GET  strId
       NS_ThongTinHopDong/ThemMoi | CapNhat  (đủ 45 tham số của gốc — các tham số Điều 1–3 / Bên A /
            Bên B mà màn không có ô thì gửi rỗng, như gốc)
       NS_ThongTinHopDong/Xoa          strIds
       NS_SapHetHanHopDong/LapDSSapHetHanHD  GET  strNguoiThucHien_Id, dSoThangDuBaoTruoc 20
   Danh mục: NS.LOAIHOPDONG, NS.HINHTHUCTUYENDUNG. Đơn vị tuyển dụng: mọi cơ cấu tổ chức.
   Bắt buộc (arrValid_HopDong): Số hợp đồng, Ngày bắt đầu hiệu lực, Ngày ký, Loại hợp đồng, Đơn vị tuyển dụng.

   Khác gốc (lỗi rõ ràng, làm theo ý định):
     · "Xem" danh sách sắp hết hạn: gốc gọi me.genTable_HetHanChucVu (KHÔNG tồn tại) → TypeError,
       bảng chưa từng hiện và số "Hiện có N nhân sự" luôn là 0. Bản mới vẽ bảng (genTable_HetHanHopDong)
       và cập nhật số sau khi Xem. Không tự gọi lúc mở màn (LapDSSapHetHanHD là "Lập" danh sách).
     · Khung hợp đồng có nút Đóng về khung đầu (gốc không có lối về).
     · Phân trang máy chủ cho bảng hợp đồng (gốc gửi trang 1/10 mà không vẽ phân trang).
   Giữ như gốc: "Xuất excel" không có xử lý → disabled. Danh sách trả Message (Success) thì gốc chỉ
   báo Message — ums.crud vẫn vẽ bảng (ghi lại, chưa gặp trên host).
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, pat = ums.pat, esc = S.esc, e = S.e, C = 'NS_ThongTinHopDong';
    var root = document.getElementById('hopdongcanbo');

    var m = pat.master({
        el: root,
        title: 'Hợp đồng cán bộ',
        side: { title: 'Danh sách cán bộ', icon: 'fa-list', search: 'Nhập từ khóa tìm kiếm',
            filter: S.locHtml({ tinhTrang: true, cctcTen: 'Chọn Khoa/Viện/Phòng ban' }) },
        main: { title: false }
    });

    m.mainBody.innerHTML =
        '<div data-z="tt">' + pat.panel({
            title: 'Danh sách cán bộ sắp hết hạn hợp đồng', icon: 'fa-circle-info',
            body: '<p class="ums-u-mb-0">- Hiện có <span data-z="dem">' + ui.badge('0', 'bad') + '</span> nhân sự sắp hết hết hạn hợp đồng! ' +
                ui.btn('view', { text: 'Xem', attr: { 'data-a': 'xem' } }) + '</p>'
        }) + '</div>' +
        '<div data-z="ds" hidden>' + pat.panel({
            title: 'Danh sách dự kiến sắp hết hạn hợp đồng', icon: 'fa-file-lines', count: 'tong', flush: true, zone: 'bang',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('excel', { attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } })
        }) + '</div>' +
        '<div data-z="hd" hidden></div>';

    function Z(k) { return m.mainBody.querySelector('[data-z="' + k + '"]'); }
    function hien(k) { ['tt', 'ds', 'hd'].forEach(function (x) { if (x !== k && !Z(x).hidden) ui.swap(Z(x), Z(k), { top: false }); }); }

    var ds = S.dsNhanSu(m, {
        tinhTrang: true, tuTai: true, cctcTen: 'Chọn Khoa/Viện/Phòng ban',
        dong: function (r) {
            return 'Mã cán bộ: ' + esc(e(r.MASO)) + '<br>Ngày sinh: ' + esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH));
        },
        onPick: moHopDong
    });

    /* ---------- Sắp hết hạn ------------------------------------------------ */
    function xemHetHan() {
        hien('ds');
        var b = Z('bang');
        b.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'NS_SapHetHanHopDong/LapDSSapHetHanHD', method: 'GET', strNguoiThucHien_Id: S.uid(), dSoThangDuBaoTruoc: 20 })
            .then(function (r) {
                var rows = S.rows(r);
                Z('tong').innerHTML = ui.badge(String(rows.length), 'warn');
                Z('dem').innerHTML = ui.badge(String(rows.length), 'bad');
                ui.table({ el: b, rows: rows, columns: [
                    { title: 'Họ và tên', render: function (x) { return esc(e(x.HO) + ' ' + e(x.TEN)); } },
                    { title: 'Mã cán bộ', prop: 'MACANBO', cls: 'is-center' },
                    { title: 'Ngày bắt đầu', prop: 'NGAYHIEULUCHOPDONG', cls: 'is-center is-nowrap' },
                    { title: 'Ngày kết thúc', prop: 'NGAYHETHIEULUCHOPDONG', cls: 'is-center is-nowrap' }
                ] });
            }).catch(function (err) { b.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sắp hết hạn hợp đồng'); });
    }

    /* ---------- Hợp đồng của một cán bộ ------------------------------------ */
    function moHopDong(ns) {
        var host = Z('hd');
        host.innerHTML = '';
        hien('hd');
        ums.crud({
            root: host,
            embedded: true,
            title: 'Hợp đồng lao động — ' + e(ns.HOTEN || (e(ns.HODEM) + ' ' + e(ns.TEN))) + ' - Mã cán bộ: ' + e(ns.MASO),
            formTitle: 'hợp đồng lao động',
            icon: 'fa-file-contract',
            saveAgain: 'Lưu và nhập tiếp',
            back: function () { ds.boChon(); hien('tt'); },
            list: {
                paged: true,
                call: function () {
                    return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strNhanSu_HoSoCanBo_Id: ns.ID, strNguoiThucHien_Id: '' };
                }
            },
            detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },
            columns: [
                { title: 'Số hợp đồng', prop: 'SOHOPDONG', cls: 'is-center' },
                { title: 'Loại hợp đồng', prop: 'DIEU1_LOAIHOPDONG_TEN' },
                { title: 'Ngày hiệu lực', prop: 'NGAYHIEULUCHOPDONG', cls: 'is-center is-nowrap' },
                { title: 'Ngày hết hiệu lực', prop: 'NGAYHETHIEULUCHOPDONG', cls: 'is-center is-nowrap' }
            ],
            fields: [
                { key: 'strSoHopDong', col: 'SOHOPDONG', label: 'Số hợp đồng', required: true },
                { key: 'strNgayKyHopDong', col: 'NGAYKYHOPDONG', label: 'Ngày ký', type: 'date', required: true },
                { key: 'strDieu1_LoaiHopDong_Id', col: 'DIEU1_LOAIHOPDONG_ID', label: 'Loại hợp đồng', type: 'select', required: true,
                  source: { dm: 'NS.LOAIHOPDONG' }, placeholder: '--Chọn loại hợp đồng--' },
                { key: 'strDieu1_HinhThucTuyen_Id', col: 'DIEU1_HINHTHUCTUYENDUNG_ID', label: 'Hình thức tuyển dụng', type: 'select',
                  source: { dm: 'NS.HINHTHUCTUYENDUNG' }, placeholder: '--Chọn hình thức tuyển dụng--' },
                { key: 'strDaoTao_CoCauToChuc_Id', col: 'DAOTAO_COCAUTOCHUC_ID', label: 'Đơn vị tuyển dụng', type: 'select', required: true,
                  source: S.nguonCCTC(), placeholder: '--Chọn đơn vị tuyển dụng--' },
                { key: 'strNgayHieuLucHopDong', col: 'NGAYHIEULUCHOPDONG', label: 'Ngày bắt đầu hiệu lực', type: 'date', required: true },
                { key: 'strNgayHetHieuLucHopDong', col: 'NGAYHETHIEULUCHOPDONG', label: 'Ngày hết hiệu lực', type: 'date' },
                { key: 'strDieu1_DiaDiemLamViec', col: 'DIEU1_DIADIEMLAMVIEC', label: 'Địa điểm làm việc' },
                { key: 'strDieu1_CongViecPhaiLam', col: 'DIEU1_CONGVIECPHAILAM', label: 'Công việc đảm nhận', type: 'textarea', span: true }
            ],
            save: function (v, row) { return S.hopDongCall(v, row, { strNhanSu_HoSoCanBo_Id: ns.ID }); },
            remove: function (ids) {
                return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: S.uid() }; });
            }
        });
    }

    m.mainBody.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-a]');
        if (!a) return;
        if (a.getAttribute('data-a') === 'xem') xemHetHan();
        if (a.getAttribute('data-a') === 'dong') hien('tt');
    });
})();
