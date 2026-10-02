/* =========================================================================
   Nghỉ hưu — danh sách nhân sự, dự kiến nghỉ hưu
   Bản gốc: ApisNhanSu/Modules/nghihuu/html/nghihuu.html + script/nghihuu.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái "Danh sách đã nghỉ hưu" (thực chất là danh sách nhân sự —
   getList_NhanSu, từ khoá + Cơ cấu → Bộ môn; ums.nsCham.dsNhanSu); phải ba khung
   đổi chỗ nhau: "Thông tin chung" (Hiện có N nhân sự sắp đến hạn nghỉ hưu! Xem) ·
   "Danh sách dự kiến nghỉ hưu (Nam tuổi 60; Nữ tuổi 55)" · "Chi tiết quyết định nghỉ
   hưu <họ tên>" (bấm một người).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       danh sách nhân sự / cơ cấu tổ chức — ums.nsCham.dsNhanSu (_chung.js)
       NS_DuBao/NghiHuu  GET  strDonViBoPhan_GiangVien_Id (Bộ môn, không có thì Cơ cấu),
            dNamDuBao = năm nay, dDoTuoiDuBao_Nam 55, dDoTuoiDuBao_Nu 50

   Giữ như gốc (ghi lại):
     · Tuổi dự báo gửi Nam 55 / Nữ 50 trong khi tiêu đề ghi "Nam tuổi 60; Nữ tuổi 55" — chép nguyên.
     · Khung "Chi tiết quyết định nghỉ hưu": gốc chỉ đổi tên, thân khung TRỐNG (getList_NghiHuu —
       NS_NghiHuuCaNhan/LayDanhSach — không nơi nào gọi, bảng #tblNghiHuu không có trên màn) → bản mới
       cũng chỉ hiện khung với lời nhắc, không gọi thêm gì.
     · "Xuất excel" không có xử lý → disabled.
   Khác gốc: số "Hiện có N nhân sự sắp đến hạn nghỉ hưu" gốc chỉ cập nhật trong getList_NghiHuu
   (không bao giờ chạy) → luôn 0; bản mới cập nhật theo số dòng dự kiến sau khi bấm Xem.
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, pat = ums.pat, esc = S.esc, e = S.e;
    var root = document.getElementById('nghihuu');

    var m = pat.master({
        el: root,
        title: 'Nghỉ hưu',
        side: { title: 'Danh sách đã nghỉ hưu', icon: 'fa-list', search: 'Nhập từ khóa tìm kiếm', filter: S.locHtml() },
        main: { title: false }
    });

    m.mainBody.innerHTML =
        '<div data-z="tt">' + pat.panel({
            title: 'Thông tin chung', icon: 'fa-circle-info',
            body: '<p class="ums-u-mb-0">- Hiện có <span data-z="dem">' + ui.badge('0', 'bad') + '</span> nhân sự sắp đến hạn nghỉ hưu! ' +
                ui.btn('view', { text: 'Xem', attr: { 'data-a': 'xem' } }) + '</p>'
        }) + '</div>' +
        '<div data-z="ds" hidden>' + pat.panel({
            title: 'Danh sách dự kiến nghỉ hưu (Nam tuổi 60; Nữ tuổi 55)', icon: 'fa-file-lines', count: 'tong', flush: true, zone: 'bang',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('excel', { attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } })
        }) + '</div>' +
        '<div data-z="ct" hidden>' + pat.panel({
            title: 'Chi tiết quyết định nghỉ hưu', icon: 'fa-file-lines', count: 'ten',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body: ui.empty('Chưa có thông tin quyết định nghỉ hưu', 'fa-file-circle-question')
        }) + '</div>';

    function Z(k) { return m.mainBody.querySelector('[data-z="' + k + '"]'); }
    function hien(k) { ['tt', 'ds', 'ct'].forEach(function (x) { if (x !== k && !Z(x).hidden) ui.swap(Z(x), Z(k), { top: false }); }); }

    var ds = S.dsNhanSu(m, {
        dong: function (r) {
            return 'Mã cán bộ: ' + esc(e(r.MASO)) + '<br>Ngày sinh: ' + esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH));
        },
        onPick: function (r) {
            Z('ten').innerHTML = '<i>' + esc(e(r.HODEM) + ' ' + e(r.TEN)) + '</i>';
            hien('ct');
        }
    });

    function xem() {
        hien('ds');
        var b = Z('bang');
        b.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'NS_DuBao/NghiHuu', method: 'GET',
            strDonViBoPhan_GiangVien_Id: ds.F.bomon.value || ds.F.cctc.value,
            dNamDuBao: new Date().getFullYear(), dDoTuoiDuBao_Nam: 55, dDoTuoiDuBao_Nu: 50
        }).then(function (r) {
            var rows = S.rows(r);
            Z('tong').innerHTML = ui.badge(String(rows.length), 'warn');
            Z('dem').innerHTML = ui.badge(String(rows.length), 'bad');
            ui.table({ el: b, rows: rows, columns: [
                { title: 'Họ và tên', prop: 'HOTEN' },
                { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
                { title: 'Ngày sinh', prop: 'NGAYSINHDAYDU', cls: 'is-center is-nowrap' },
                { title: 'Chức vụ, chức danh', prop: 'LOAICHUCDANH' },
                { title: 'Đơn vị công tác', prop: 'DAOTAO_COCAUTOCHUC' },
                { title: 'CDNN - Mã ngạch', prop: 'NGACHLUONG_MA', cls: 'is-center' },
                { title: 'Ngày dự kiến', prop: 'NGAYDUKIENNGHIHUU', cls: 'is-center is-nowrap' }
            ] });
        }).catch(function (err) { b.innerHTML = ui.fail(err.message); ums.api.handle(err, 'dự kiến nghỉ hưu'); });
    }

    m.mainBody.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-a]');
        if (!a) return;
        if (a.getAttribute('data-a') === 'xem') xem();
        if (a.getAttribute('data-a') === 'dong') { ds.boChon(); hien('tt'); }
    });
})();
