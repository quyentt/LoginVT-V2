/* =========================================================================
   Sinh phiếu đánh giá theo kế hoạch (đánh giá phân loại viên chức & NLĐ)
   Bản gốc: ApisNhanSu/Modules/dgplnguoilaodong/script/sinhphieu.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: cột trái từ khoá + "Sinh phiếu đánh giá theo kế hoạch"
   (mỗi kế hoạch một nút Sinh phiếu); cột phải "Thông tin chung — Vui lòng chọn
   phiếu đánh giá cần sinh!". Hai khung "Chi tiết sản phẩm" / "Lập kế hoạch…"
   của html gốc không có lối mở (không có nút Thêm, không gọi toggle) → bỏ.
   Lời gọi (kiểu cũ, chép nguyên):
       NS_PLDG_NLD_KeHoach/LayDanhSach      GET  strTuKhoa, strNguoiThucHien_Id '', pageIndex, pageSize
       NS_PLDG_NLD_TieuChi_CaNhan/KhoiTao   POST strLoaiDoiTuong_Id '' (gốc đọc ô rỗng), strNhanSu_DGPL_Nam_KH_Id, strNguoiThucHien_Id
   Lỗi gốc đã sửa theo ý định:
     · nút "Tìm kiếm" (btnSearchHSLL_NhanSu) không có xử lý, handler gắn vào id
       không tồn tại (btnSearch_SinhPhieu); Enter ở ô từ khoá không làm gì → nay
       nút và Enter đều nạp lại danh sách, gửi từ khoá như getList_KeHoach.
     · phân trang gốc gọi main_doc.KeHoach (không tồn tại trên màn này) → bấm
       trang là lỗi JS; nay phân trang chạy.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dgpl-sinhphieu');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var st = { rows: [], page: 1, size: 10, total: 0 };

    var m = pat.master({
        el: root, title: 'Sinh phiếu',
        side: { title: 'Sinh phiếu đánh giá theo kế hoạch', icon: 'fa-list-ul', search: 'Nhập từ khóa tìm kiếm',
                tools: '<button type="button" class="ums-iconbtn" data-a="tim" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' },
        main: { title: 'Thông tin chung', icon: 'fa-circle-info' }
    });
    m.mainBody.innerHTML = '<div class="ums-u-muted">- Vui lòng chọn phiếu đánh giá cần sinh!</div>';

    function nap(p) {
        if (p) st.page = p;
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'NS_PLDG_NLD_KeHoach/LayDanhSach', method: 'GET',
            strTuKhoa: (m.search.value || '').trim(), strNguoiThucHien_Id: '',
            pageIndex: st.page, pageSize: st.size
        }).then(function (r) {
            st.rows = Array.isArray(r.data) ? r.data : [];
            st.total = Number(r.pager) || st.rows.length;
            ve();
        }).catch(function (err) {
            st.rows = []; m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'kế hoạch');
        });
    }
    function ve() {
        m.sideCount.textContent = '(' + st.total + ')';
        m.sideBody.innerHTML = st.rows.length ? st.rows.map(function (r, i) {
            return '<div class="ums-master__item"><span class="ums-master__item__main"><b>' + esc(r.TENKEHOACH) + '</b></span>' +
                '<span class="ums-master__item__act"><button type="button" class="ums-iconbtn" data-sinh="' + i + '" title="Sinh phiếu">' +
                '<i class="fa-light fa-ticket"></i></button></span></div>';
        }).join('') : ui.empty('Không có dữ liệu');
        m.setPage({
            index: st.page, size: st.size, total: st.total, shown: st.rows.length,
            onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) nap(p); },
            onSize: function (v) { st.size = v; nap(1); }
        });
    }
    function sinh(r) {
        ui.confirm('Bạn có chắc chắn muốn sinh phiếu tự động không?', { ok: 'Sinh phiếu', title: 'Sinh phiếu — ' + (r.TENKEHOACH || '') })
            .then(function (yes) {
                if (!yes) return;
                return ums.api.call({
                    action: 'NS_PLDG_NLD_TieuChi_CaNhan/KhoiTao',
                    strLoaiDoiTuong_Id: '', strNhanSu_DGPL_Nam_KH_Id: r.ID
                }).then(function () {
                    ui.toast('Sinh phiếu thành công!', 'ok');
                    nap();
                });
            }).catch(function (err) { ums.api.handle(err, 'sinh phiếu'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-sinh]');
        if (b) { var r = st.rows[Number(b.getAttribute('data-sinh'))]; if (r) sinh(r); return; }
        if (ev.target.closest('[data-a="tim"]')) nap(1);
    });
    /* Cột trái (BO-CUC luật 12, 2026-09-26): gõ là tự tìm sau 400ms, Enter tìm ngay; nút trên tiêu đề = Tải lại */
    var henTim = 0;
    m.search.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(henTim); nap(1); }
    });
    m.search.addEventListener('input', function () { clearTimeout(henTim); henTim = setTimeout(function () { nap(1); }, 400); });
    nap(1);
})();
