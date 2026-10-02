/* =========================================================================
   Chấm công vào ra — xem dữ liệu chấm công vào/ra của từng nhân sự
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/chamcongvaora.html + script/chamcongvaora.js
   ---------------------------------------------------------------------------
   Hai cột như gốc (col-lg-3 | col-lg-9): trái "Danh sách nhân sự" (từ khoá +
   Cơ cấu khoa/viện/phòng ban → Bộ môn, ums.nsCham.dsNhanSu); phải khung
   "Thông tin chung" đổi chỗ với "Chi tiết chấm công vào/ra" khi bấm một người.

   Lời gọi:
       danh sách nhân sự / cơ cấu tổ chức — xem ums.nsCham.dsNhanSu (_chung.js)
       NS_VaoRaCaNhan/LayDanhSach  GET  strTuKhoa '', strNhanSu_HoSoCanBo_Id, strNguoiThucHien_Id '',
                                   pageIndex, pageSize (phân trang máy chủ như gốc)

   Giữ như gốc (ghi lại):
     · Hai cột của bảng chi tiết cùng đọc cột DIADIEMCCVaoRa (chép nguyên mDataProp
       của gốc — tên cột này không khớp tiêu đề "Ngày chấm công" / "Thời gian chấm
       công", nhiều khả năng là chép nhầm; chưa biết tên cột thật nên KHÔNG đoán).
     · "Import" (khung Thông tin chung) và "Export" (khung chi tiết): gốc là liên
       kết không gắn xử lý → giữ nút, đặt disabled.
   Không chuyển: save_/update_/delete_CCVaoRa — gốc không có nút nào gọi tới
   (#btnSaveCCVaoRa, .btnAdd không có trên màn).
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, pat = ums.pat, esc = S.esc, e = S.e;
    var root = document.getElementById('chamcongvaora');
    var d = new Date(), thang = (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '/' + d.getFullYear();

    var m = pat.master({
        el: root,
        title: 'Chấm công vào ra',
        side: { title: 'Danh sách nhân sự', icon: 'fa-list', search: 'Nhập từ khóa tìm kiếm', filter: S.locHtml() },
        main: { title: false }
    });

    m.mainBody.innerHTML =
        '<div data-z="tt">' + pat.panel({
            title: 'Thông tin chung', icon: 'fa-circle-info',
            body: '<p class="ums-u-mb-2">- Bạn có muốn import dữ liệu từ máy chấm công vào phần mềm cho tháng ' +
                ui.badge(thang, 'bad') + ' không? ' +
                ui.btn('importer', { text: 'Import', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } }) + '</p>' +
                '<p class="ums-u-mb-0">- Lịch sử import dữ liệu từ máy chấm công</p>'
        }) + '</div>' +
        '<div data-z="ct" hidden>' + pat.panel({
            title: 'Chi tiết chấm công vào/ra', icon: 'fa-file-lines', count: 'ten', flush: true, zone: 'bang',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('excel', { text: 'Export', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } })
        }) + '</div>';

    var zTT = m.mainBody.querySelector('[data-z="tt"]'), zCT = m.mainBody.querySelector('[data-z="ct"]');
    var bang = zCT.querySelector('[data-z="bang"]'), ten = zCT.querySelector('[data-z="ten"]');
    var st = { id: '', page: 1, size: 10, total: 0 };

    function taiCT(page) {
        st.page = page || 1;
        bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'NS_VaoRaCaNhan/LayDanhSach', method: 'GET',
            strTuKhoa: '', strNhanSu_HoSoCanBo_Id: st.id, strNguoiThucHien_Id: '',
            pageIndex: st.page, pageSize: st.size
        }).then(function (r) {
            var rows = S.rows(r);
            st.total = Number(r.pager) || rows.length;
            ui.table({
                el: bang, rows: rows,
                columns: [
                    { title: 'Ngày chấm công', prop: 'DIADIEMCCVaoRa', cls: 'is-center' },
                    { title: 'Thời gian chấm công', prop: 'DIADIEMCCVaoRa', cls: 'is-center' }
                ],
                page: { index: st.page, size: st.size, total: st.total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) taiCT(p); },
                    onSize: function (v) { st.size = v; taiCT(1); } }
            });
        }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'chấm công vào ra'); });
    }

    var ds = S.dsNhanSu(m, {
        onPick: function (r) {
            st.id = r.ID;
            ten.innerHTML = ui.badge(thang, 'bad') + ' <i>' + esc(e(r.HODEM) + ' ' + e(r.TEN)) + '</i>';
            if (zCT.hidden) ui.swap(zTT, zCT, { top: false });
            taiCT(1);
        }
    });

    zCT.addEventListener('click', function (ev) {
        if (!ev.target.closest('[data-a="dong"]')) return;
        st.id = '';
        ds.boChon();
        ui.swap(zCT, zTT, { top: false });
    });
})();
