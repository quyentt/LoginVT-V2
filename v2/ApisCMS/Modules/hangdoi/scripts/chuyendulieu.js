/* =========================================================================
   Quy trình 2: Chuyển dữ liệu (hàng đợi)
   Bản gốc: ApisCMS/Modules/hangdoi/html/chuyendulieu.html + scripts/chuyendulieu.js
   ---------------------------------------------------------------------------
   Hai cột như bản gốc (col-lg-6 | col-lg-6): trái = nút "Tạo hàng đợi" + các
   tiến trình chưa xong; phải = "Lịch sử: Chuyển dữ liệu".
   Lời gọi:
       D_HangDoi/TaoHangDoi_ChuyenDuLieu_TuDong   GET  strChucNang_Id, strNguoiThucHien_Id (tự điền)
       Hàng đợi (createHangDoi, strLoaiNhiemVu "CHUYENDULIEU_IU_SANGDOITAC")
           → ums.queue.mount: CMS_HangDoiTuTao/LayDanhSach, LayDSXuLyNhiemVu_HangDoi,
             XuLyNhiemVu_HangDoi.
   Khác gốc:
     · Bảng lịch sử tự vẽ ở cột phải với đúng 4 cột của gốc (#, Người thực hiện,
       Ngày thực hiện, Tổng thực hiện, Tổng hoàn thành). Bảng lịch sử có sẵn của
       ums.queue thêm cột "Khoản thu" (riêng Tài chính) và không có lối lấy dữ
       liệu đã nạp → mount với history: false rồi nạp lại một lần để vẽ (thêm
       một lời gọi LayDanhSach lúc mở màn). Xin tầng chung: tuỳ chọn cột lịch
       sử / móc onLoad(rows).
     · endHangDoi của gốc rỗng → không truyền onDone ngoài việc vẽ lại lịch sử.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('cms-chuyendulieu');
    if (!root) return;

    var LOAI = 'CHUYENDULIEU_IU_SANGDOITAC';

    root.innerHTML =
        pat.page('Chuyển dữ liệu', '') +
        '<div class="ums-grid ums-grid--2">' +
            pat.panel({ title: 'Quy trình 2: Chuyển dữ liệu', icon: 'fa-gears', zone: 'hangdoi',
                tools: ui.btn('add', { text: 'Tạo hàng đợi', mod: 'primary', icon: 'fa-rectangle-history-circle-plus', attr: { 'data-a': 'tao' } }) }) +
            pat.panel({ title: 'Lịch sử: Chuyển dữ liệu', icon: 'fa-clock-rotate-left', zone: 'lichsu', flush: true }) +
        '</div>';

    var elLs = root.querySelector('[data-z="lichsu"]');

    function veLichSu(rows) {
        ui.table({
            el: elLs, rows: rows || [], empty: 'Không có dữ liệu tìm thấy!',
            columns: [
                { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TENDAYDU' },
                { title: 'Ngày thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                { title: 'Tổng thực hiện', prop: 'TONGDULIEUCANTHUCHIEN', cls: 'is-center' },
                { title: 'Tổng hoàn thành', prop: 'TONGDULIEUDAHOANTHANH', cls: 'is-center' }
            ]
        });
    }

    var q = ums.queue.mount(root.querySelector('[data-z="hangdoi"]'), {
        strLoaiNhiemVu: LOAI,
        history: false,
        onDone: function () { napLai(); }
    });
    function napLai() { return q.reload().then(veLichSu); }

    function taoHangDoi() {
        ui.confirm('Bạn có chắc chắn Chuyển dữ liệu không?', { title: 'Tạo hàng đợi', ok: 'Chuyển dữ liệu' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'D_HangDoi/TaoHangDoi_ChuyenDuLieu_TuDong', method: 'GET' }).then(function () {
                ui.toast('Khởi tạo dữ liệu thành công!', 'ok');
                return napLai();
            });
        }).catch(function (err) { ums.api.handle(err, 'QLTC_HangDoi.TaoHangDoi_ChuyenDuLieu_TuDong'); });
    }

    root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a="tao"]');
        if (b) taoHangDoi();
    });

    elLs.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    napLai();
})();
