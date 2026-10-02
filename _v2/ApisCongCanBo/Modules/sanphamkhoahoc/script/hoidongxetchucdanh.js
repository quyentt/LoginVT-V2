/* =========================================================================
   Hội đồng xét chức danh — hồ sơ xét chức danh của cán bộ đang đăng nhập (CHỈ XEM)
   Bản gốc: ApisCongCanBo/Modules/sanphamkhoahoc/script/hoidongxetchucdanh.js
   ---------------------------------------------------------------------------
   Hai cột như bản gốc (col-lg-3 danh sách · col-lg-9 "Thông tin chung") — ums.pat.master.
   Lời gọi (kiểu cũ, GET): NCKH_HoiDongXetChucDanh/LayDanhSach  strChucDanhDeXuat_Id '',
       strDoiTuongDeXuat_Id = userId, strKetQuaHoiDongCoSo_Id '', strKetQuaHoiDongNghanh_Id '',
       strKetQuaHoiDongNhaNuoc_Id '', strNguoiThucHien_Id '', strTuKhoa, pageIndex, pageSize.
   Mục ở cột trái: DOITUONGDEXUAT_TEN - CHUCDANHDEXUAT_TEN + tình trạng xác nhận / hoàn thành.
   Khác bản gốc (ghi ở can-quyet.js):
     · Biểu mẫu thêm/sửa (ThemMoi/CapNhat/Xoa) KHÔNG mở được ở gốc: không có nút .btnAdd trên màn,
       nút xem gọi khung zone_detail_hdxcd không tồn tại (bấm "xem" là trắng khung phải) → bản mới
       CHỈ XEM, bấm một mục thì hiện chi tiết theo đúng các nhãn viewDetail_HDXCD của gốc.
     · Ô từ khoá: gốc không gửi (strTuKhoa luôn rỗng) → nay gửi, Enter là tìm lại.
     · Phân trang 10 dòng/trang của gốc → nạp một lần toàn bộ (danh sách của MỘT cán bộ).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nckh, e = N.e;
    var root = document.getElementById('sanphamkhoahoc-hoidongxetchucdanh');
    if (!root) return;
    function esc(s) { return ui.esc(s); }

    var mst = pat.master({
        el: root, title: 'Hội đồng xét chức danh',
        side: { title: 'Hội đồng xét chức danh', icon: 'fa-user-tie', search: 'Nhập từ khóa tìm kiếm' },
        main: { title: 'Thông tin chung', icon: 'fa-circle-info' }
    });
    var ds = [], chon = '';
    var tieuDe = mst.main.querySelector('.ums-panel__title'), congCu = mst.main.querySelector('.ums-panel__tools');
    function khung(chiTiet) {
        tieuDe.innerHTML = chiTiet ? '<i class="fa-light fa-file-lines"></i> Chi tiết hội đồng xét chức danh' : '<i class="fa-light fa-circle-info"></i> Thông tin chung';
        congCu.innerHTML = chiTiet ? ui.btn('close', { attr: { 'data-a': 'dong' } }) : '';
    }
    function nhac() {
        chon = ''; khung(false);
        mst.mainBody.innerHTML = '<div class="ums-row ums-u-muted">- Bạn đã được thêm vào danh sách hội đồng xét chức danh. Chọn một mục ở cột trái để xem.</div>';
    }
    nhac();

    function ten(r) { return e(r.DOITUONGDEXUAT_TEN) + ' - ' + e(r.CHUCDANHDEXUAT_TEN); }
    function veDs() {
        mst.sideCount.textContent = '(' + ds.length + ')';
        mst.sideBody.innerHTML = ds.length ? ds.map(function (r) {
            return '<button type="button" class="ums-master__item' + (r.ID === chon ? ' is-active' : '') + '" data-id="' + esc(r.ID) + '">' + N.item(ten(r), r) + '</button>';
        }).join('') : ui.empty('Không có dữ liệu', 'fa-inbox');
    }
    function tai() {
        mst.sideBody.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return N.g('NCKH_HoiDongXetChucDanh/LayDanhSach', {
            strChucDanhDeXuat_Id: '', strDoiTuongDeXuat_Id: N.uid(), strKetQuaHoiDongCoSo_Id: '', strKetQuaHoiDongNghanh_Id: '',
            strKetQuaHoiDongNhaNuoc_Id: '', strNguoiThucHien_Id: '', strTuKhoa: (mst.search.value || '').trim(), pageIndex: 1, pageSize: 1000000
        }).then(function (r) { ds = N.arr(r.data); veDs(); if (chon) xem(chon); })
          .catch(function (err) { mst.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'hội đồng xét chức danh'); });
    }
    function dong(nhan, gt) { return '<div style="grid-column:span 12"><div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(e(gt)) + '</b></div></div>'; }
    function xem(id) {
        var d = ds.filter(function (r) { return r.ID === id; })[0];
        if (!d) { nhac(); return; }
        chon = id; veDs(); khung(true);
        mst.mainBody.innerHTML =
            '<div class="ums-row ums-row--between ums-u-mb-3"><div class="ums-legend ums-u-mb-0">Thông tin</div>' +
            '<span class="ums-u-faint ums-u-fz13">Người nhập: ' + esc(e(d.NGUOITHUCHIEN_TENDAYDU)) + '</span></div>' +
            '<div class="ums-grid ums-grid--12">' +
                dong('Đề nghị xét', d.CHUCDANHDEXUAT_TEN) + dong('Đối tượng', d.DOITUONGDEXUAT_TEN) + dong('Chuyên ngành', d.CHUYENNGANH_TEN) +
                dong('Thông qua HĐ cơ sở', d.KETQUAHOIDONGCOSO_TEN) + dong('Thông qua HĐ ngành', d.KETQUAHOIDONGNGANH_TEN) +
                dong('Thông qua HĐ nhà nước', d.KETQUAHOIDONGNHANUOC_TEN) +
            '</div>';
    }
    congCu.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="dong"]')) { nhac(); veDs(); } });
    mst.sideBody.addEventListener('click', function (ev) { var it = ev.target.closest('[data-id]'); if (it) xem(it.getAttribute('data-id')); });
    mst.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
    ums.pat.cotTrai(mst, { tai: tai });   // luật cột trái (BO-CUC 12): Tải lại, gõ là tự tìm
    tai();
})();
