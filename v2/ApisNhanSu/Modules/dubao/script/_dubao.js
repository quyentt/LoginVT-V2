/* =========================================================================
   Khung chung module "dubao" (Nhân sự) — ums.nsDuBao
   =========================================================================
   Ba màn dự báo nâng lương (nangluongthuongxuyen, nangluongtruocthoihan,
   nangluongvuotkhung) chép nhau từng dòng, chỉ khác action + cột bảng:
       tiêu đề "DANH SÁCH DỰ BÁO ĐẾN HẠN NÂNG LƯƠNG <loại>" · khối "Ghi chú" ·
       "Tìm kiếm": Cơ cấu tổ chức → Bộ môn · Tìm kiếm · "Xuất excel ▾" · bảng.
   Chỉ XEM, không thêm / sửa / xoá.

   Lời gọi (chép nguyên):
       <action> GET — strDonViBoPhan_GiangVien_Id = Bộ môn nếu có, không thì Cơ cấu tổ chức
           (không phân trang máy chủ; gốc chia trang ở máy khách)
       edu.system.getList_CoCauToChuc(iTrangThai 1) → ums.ref.coCauToChuc: dòng KHÔNG có
           DAOTAO_COCAUTOCHUC_CHA_ID vào ô Cơ cấu, dòng CÓ vào ô Bộ môn (lọc theo cha đã chọn).

   Khác gốc:
     · Cơ cấu → Bộ môn theo luật cha → con (ums.pat.chain): chưa chọn Cơ cấu thì Bộ môn khoá
       (gốc đổ sẵn MỌI bộ môn của mọi khoa), chọn / xoá Cơ cấu thì xoá trắng Bộ môn.
     · Chỉ tải khi bấm Tìm kiếm (như gốc); đổi ô lọc không tự tải.
     · "Xuất excel": gốc là nút thả xuống, sau khi nạp danh mục báo cáo SYS.RP.<mã> thì THAY
       HẾT mục (kể cả "Import dữ liệu"/"Export file") bằng danh sách báo cáo; bấm một báo cáo gọi
       me.report_InHoSo — hàm KHÔNG TỒN TẠI (bản trước hạn / vượt khung còn không gắn sự kiện)
       → tính năng chưa từng chạy. Bản mới làm theo ý định của dòng ghi chú "Nhấp chuột vào nút
       'Xuất excel' để xuất báo cáo ra file excel": xuất CHÍNH bảng đang xem ra .xls ở máy khách
       (ums.ui.xuatXls), không gọi danh mục báo cáo.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;

    ums.nsDuBao = {
        man: function (root, cfg) {
            if (typeof root === 'string') root = document.getElementById(root);
            if (!root) return;

            var tatCa = [], dsCon = [], trang = { index: 1, size: (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10 };

            root.innerHTML =
                pat.page(cfg.tieuDe, ui.btn('excel', { text: 'Xuất excel', attr: { 'data-a': 'excel' } })) +
                pat.panel({ title: 'Ghi chú', icon: 'fa-circle-info', cls: 'ums-u-mb-4',
                    body: '<div class="ums-u-fz13 ums-u-muted">' +
                        '<div>+ Nhấp chuột vào nút "Tìm kiếm" xem kết quả</div>' +
                        '<div>+ Nhấp chuột vào ô "Chọn cơ cấu tổ chức" để xem báo cáo theo đơn vị</div>' +
                        '<div>+ Nhấp chuột vào nút "Xuất excel" để xuất báo cáo ra file excel</div></div>' }) +
                pat.filterBar([
                    { key: 'cc', type: 'select', label: 'Chọn cơ cấu khoa/viện/phòng ban' },
                    { key: 'bm', type: 'select', label: 'Chọn bộ môn' }
                ]) +
                pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'tong', flush: true, zone: 'bang' });

            function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
            var elBang = root.querySelector('[data-z="bang"]'), elTong = root.querySelector('[data-z="tong"]');
            elBang.innerHTML = ui.empty('Bấm "Tìm kiếm" để xem danh sách dự báo (chọn đơn vị để thu hẹp)', 'fa-magnifying-glass');

            /* getList_CoCauToChuc → processData_CoCauToChuc (tách cha / con) */
            ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (rows) {
                var cha = rows.filter(function (r) { return !r.DAOTAO_COCAUTOCHUC_CHA_ID; });
                dsCon = rows.filter(function (r) { return !!r.DAOTAO_COCAUTOCHUC_CHA_ID; });
                pat.fill(F('cc'), cha, { head: 'Chọn cơ cấu khoa/viện/phòng ban' });
            }).catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });

            if (window.jQuery) {
                jQuery(F('cc')).on('select2:select', function () {
                    var cha = F('cc').value;
                    pat.fill(F('bm'), cha ? dsCon.filter(function (r) { return r.DAOTAO_COCAUTOCHUC_CHA_ID === cha; }) : [],
                        { head: 'Chọn bộ môn' });
                });
                pat.chain([F('cc'), F('bm')]);
            }

            var cot = cfg.columns;

            function ve() {
                var tu = (trang.index - 1) * trang.size;
                ui.table({
                    el: elBang, columns: cot, rows: tatCa.slice(tu, tu + trang.size),
                    empty: 'Không có cán bộ đến hạn',
                    page: {
                        index: trang.index, size: trang.size, total: tatCa.length,
                        onChange: function (p) { if (p < 1 || p > Math.ceil(tatCa.length / trang.size)) return; trang.index = p; ve(); },
                        onSize: function (v) { trang.size = v === 'all' ? Math.max(tatCa.length, 1) : v; trang.index = 1; ve(); }
                    }
                });
                elTong.textContent = '(' + tatCa.length + ')';
            }

            function tai() {
                var bm = F('bm').value, cc = F('cc').value;
                elBang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
                ums.api.call({ action: cfg.action, method: 'GET', strDonViBoPhan_GiangVien_Id: bm || cc })
                    .then(function (r) {
                        var d = r.data;
                        tatCa = Array.isArray(d) ? d : (d && d.rs) || [];
                        trang.index = 1;
                        ve();
                    }).catch(function (err) {
                        tatCa = [];
                        elBang.innerHTML = ui.fail(err.message);
                        ums.api.handle(err, cfg.action);
                    });
            }

            root.addEventListener('click', function (e) {
                var b = e.target.closest('[data-a]');
                if (!b || !root.contains(b)) return;
                var a = b.getAttribute('data-a');
                if (a === 'search') tai();
                else if (a === 'excel') {
                    if (!tatCa.length) { ui.toast('Chưa có dữ liệu — bấm "Tìm kiếm" trước', 'warn'); return; }
                    ui.xuatXls(cfg.tep, {
                        tieuDe: cfg.tieuDe,
                        cot: [{ title: 'Stt', get: function (r, i) { return i + 1; } }].concat(cot.map(function (c) {
                            return { title: c.title, get: function (r) { return r[c.prop]; } };
                        })),
                        dong: tatCa
                    });
                }
            });
        }
    };
})();
