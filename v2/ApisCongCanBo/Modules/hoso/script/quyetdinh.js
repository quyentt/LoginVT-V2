/* =========================================================================
   Danh sách quyết định — các quyết định có tên cán bộ đang đăng nhập (CHỈ XEM)
   Bản gốc: ApisCongCanBo/Modules/hoso/script/quyetdinh.js
   ---------------------------------------------------------------------------
   Hai cột như bản gốc (col-lg-3 danh sách + col-lg-9 chi tiết) — ums.pat.master.
   Lời gọi (kiểu cũ, không mã hoá, GET):
       NS_ThongTinQuyetDinh/LayDanhSach  strNgayHieuLuc_Tu '', strNgayHieuLuc_Den '',
           strLoaiQuyetDinh_Id, strTuKhoa, iTrangThai 1, pageIndex 1, pageSize 1000000,
           strThanhVien_Id = userId
       NS_QuyetDinhNhanSu/LayDanhSach    strNhanSu_ThongTinQD_Id — nhân sự kèm theo
   Tệp quyết định: NS_Files theo id quyết định (chỉ xem).
   Danh mục loại quyết định: NS.QUDI.

   Khác bản gốc (lỗi rõ ràng):
     · Lọc theo loại: bản gốc nạp NS.QUDI vào ô dropSearch_QuyetDinh_Loai nhưng
       lời gọi lại đọc dropSearch_PhanLoai (không tồn tại) → không lọc được;
       strNgayHieuLuc_Den đọc dropSearch_LinhVuc (không tồn tại) → luôn rỗng.
       Ở đây ô loại quyết định lọc thật; strNgayHieuLuc_Den gửi rỗng như cũ.
     · Tìm kiếm: nút #btnSearch_QuyetDinh không có trên màn nên bản gốc chỉ nạp
       một lần lúc mở. Ở đây Enter ở ô từ khoá / đổi loại là tìm lại.
     · Ảnh nhân sự: bản gốc đọc data.ANH (cả mảng) → luôn ảnh mặc định; ở đây
       đọc ANH của từng dòng.
   Không chuyển: biểu mẫu thêm/sửa quyết định và bảng thêm thành viên (nút
   .btnAdd không có trên màn; hàm save_/update_QuyetDinh không có) — cán bộ chỉ xem.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('quyetdinh');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var mst = pat.master({
        el: root,
        title: 'Danh sách quyết định',
        side: {
            title: 'Danh sách quyết định', icon: 'fa-list-check', search: 'Nhập từ khóa tìm kiếm',
            filter: '<div class="ums-field"><select class="ums-select" data-f="loai" data-ph="Chọn loại quyết định"><option value=""></option></select></div>'
        },
        main: { title: 'Thông tin chung', icon: 'fa-circle-info' }
    });
    ui.enhance(root);
    var fLoai = root.querySelector('[data-f="loai"]');
    ums.api.dm('NS.QUDI').then(function (r) { pat.fill(fLoai, r, { head: 'Chọn loại quyết định' }); }, function () {});

    var ds = [], chon = '';
    var tieuDe = mst.main.querySelector('.ums-panel__title'), congCu = mst.main.querySelector('.ums-panel__tools');
    /* Bản gốc có hai khung đổi chỗ nhau: "Thông tin chung" (lúc chưa chọn) và
       "Chi tiết" (có nút đóng quay về khung kia) */
    function khung(chiTiet) {
        tieuDe.innerHTML = chiTiet ? '<i class="fa-light fa-file-lines"></i> Chi tiết' : '<i class="fa-light fa-circle-info"></i> Thông tin chung';
        congCu.innerHTML = chiTiet ? ui.btn('close', { attr: { 'data-a': 'dong' } }) : '';
    }
    function nhac() {
        chon = ''; khung(false);
        mst.mainBody.innerHTML = ui.empty('Chọn một quyết định ở cột trái để xem chi tiết', 'fa-file-signature');
    }
    nhac();

    function veDs() {
        mst.sideCount.textContent = '(' + ds.length + ')';
        mst.sideBody.innerHTML = ds.length ? ds.map(function (r) {
            return pat.masterItem({ id: r.ID, text: e(r.THONGTINQUYETDINH) || e(r.SOQUYETDINH), sub: [r.SOQUYETDINH, r.NGAYQUYETDINH].filter(Boolean).join(' · '), active: r.ID === chon });
        }).join('') : ui.empty('Không có quyết định', 'fa-inbox');
    }
    function tai() {
        mst.sideBody.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({
            action: 'NS_ThongTinQuyetDinh/LayDanhSach', method: 'GET',
            strNgayHieuLuc_Tu: '', strNgayHieuLuc_Den: '', strLoaiQuyetDinh_Id: fLoai.value,
            strTuKhoa: (mst.search.value || '').trim(), iTrangThai: 1, pageIndex: 1, pageSize: 1000000,
            strThanhVien_Id: uid()
        }).then(function (r) { ds = arr(r.data); veDs(); })
          .catch(function (err) { mst.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách quyết định'); });
    }

    function dong(nhan, gt, cot) { return '<div style="grid-column:span ' + (cot || 6) + '"><div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + gt + '</b></div></div>'; }
    function xem(id) {
        var d = ds.filter(function (r) { return r.ID === id; })[0];
        if (!d) return;
        chon = id; veDs(); khung(true);
        mst.mainBody.innerHTML =
            '<div class="ums-row ums-row--between ums-u-mb-3"><div class="ums-legend ums-u-mb-0">Nội dung quyết định</div>' +
            '<span class="ums-u-faint ums-u-fz13">Người nhập: ' + esc(e(d.CANBONHAP_TENDAYDU)) + '</span></div>' +
            '<div class="ums-grid ums-grid--12">' +
                dong('Tên quyết định', esc(e(d.THONGTINQUYETDINH)), 12) +
                dong('Loại quyết định', esc(e(d.LOAIQUYETDINH)), 12) +
                dong('Số quyết định', esc(e(d.SOQUYETDINH))) + dong('Ngày quyết định', esc(e(d.NGAYQUYETDINH))) +
                dong('Ngày hiệu lực', esc(e(d.NGAYHIEULUC))) + dong('Ngày kết thúc', esc(e(d.NGAYHETHIEULUC))) +
                dong('File quyết định', '<span data-z="tep"></span>', 12) +
                dong('Người ký', esc(e(d.NGUOIKYQUYETDINH))) + dong('Chữ ký', '') +
            '</div>' +
            '<div class="ums-legend ums-legend--cach">Nhân sự kèm theo quyết định</div>' +
            '<div data-z="nhansu"></div>';
        ums.files.mount(mst.mainBody.querySelector('[data-z="tep"]'), { api: 'NS_Files', readonly: true }).load(d.ID);
        var host = mst.mainBody.querySelector('[data-z="nhansu"]');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ums.api.call({ action: 'NS_QuyetDinhNhanSu/LayDanhSach', method: 'GET', strNhanSu_ThongTinQD_Id: id }).then(function (r) {
            ui.table({
                el: host, rows: arr(r.data), empty: 'Không có nhân sự kèm theo', tableCls: 'ums-table--lined ums-table--tight',
                columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '80px', render: function (x) {
                        var p = x.ANH ? (ums.session.rootPathUpload || '') + '/' + String(x.ANH).replace(/^\/+/, '') : '';
                        return p ? '<img class="qd-anh" alt="" src="' + esc(p) + '" onerror="this.replaceWith(Object.assign(document.createElement(\'i\'),{className:\'fa-light fa-user qd-anh qd-anh--none\'}))">'
                                 : '<i class="fa-light fa-user qd-anh qd-anh--none"></i>';
                    } },
                    { title: 'Họ tên', render: function (x) {
                        var cd = (x.LOAICHUCDANH_MA ? x.LOAICHUCDANH_MA + '.' : '') + (x.LOAIHOCVI_MA ? x.LOAIHOCVI_MA + '.' : '');
                        return esc((cd ? cd + ' ' : '') + e(x.HOTEN)) + '<br><span class="ums-u-faint ums-u-fz13">' + esc(e(x.MACANBO)) + '</span>';
                    } },
                    { title: 'Năm sinh', prop: 'NGAYSINHDAYDU', cls: 'is-center is-nowrap' }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nhân sự kèm theo quyết định'); });
    }

    congCu.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="dong"]')) { nhac(); veDs(); } });
    mst.sideBody.addEventListener('click', function (ev) {
        var it = ev.target.closest('[data-id]');
        if (it) xem(it.getAttribute('data-id'));
    });
    mst.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
    if (window.jQuery) jQuery(fLoai).on('select2:select select2:clear', tai);
    /* Luật cột trái (BO-CUC 12): Tải lại + Bộ lọc nâng cao, ô loại ẩn sẵn, gõ là tự tìm */
    ums.pat.cotTrai(mst, { tai: tai, tuTaiLoc: false });
    tai();
})();
