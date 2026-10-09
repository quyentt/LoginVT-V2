/* =========================================================================
   Phê duyệt kết quả xử lý học vụ
   Bản gốc: ApisXuLyHocVu/Modules/pheduyetketqua/html/pheduyetketqua.html + script/pheduyetketqua.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Năm nhập học · Khoa QL ·
   Học kỳ · Kế hoạch xử lý · Loại xử lý / Mức xử lý · từ khoá · Tìm kiếm · Xuất báo cáo · Import /
   trạng thái sinh viên) → khung "Danh sách" (ẩn tới khi Tìm kiếm, nút × đóng lại) có nút
   "Thực hiện phê duyệt" và bảng người học có cột ô đánh dấu.
   Khung chung: ums.xlhv.man (script/_xlhv.js) trên ums.xlhvKQ (thuchienxulyhocvu/script/_ketqua.js).

   Lời gọi riêng của màn (chép nguyên):
       XLHV_PheDuyetKetQua/ThemMoi POST   mỗi dòng đã đánh dấu một lời gọi: strId '', strSanPham_Id = ID dòng,
            strNoiDung (ô "Nội dung xác nhận"), strTinhTrang_Id = nút xác nhận đã bấm, strNguoiXacnhan_Id.
       Nút xác nhận = danh mục XLHV.XNKK sắp theo HESO1 (THONGTIN1 = biểu tượng FA4 → ums.iconFA4,
            THONGTIN2 = style màu, TEN).
       Xuất báo cáo / Import: getList_MauImport "zonebtnPD" — khối addKeyValue có thêm strTuKhoa ''
            (gốc đọc txtAAAA) đứng trước các cặp chung.
   Khác bản gốc:
     · Gốc nạp lại danh sách SAU MỖI dòng được xác nhận (N lần nạp, N thông báo) → ums.ui.batch, nạp một lần.
     · Hộp Xác nhận của gốc có bảng "Lịch sử xác nhận" nhưng lời gọi nạp nó đã bị chú thích (và gọi nhầm
       KHCT_XacNhanPhanGiang của Phân lịch giảng) → bảng luôn trống; nay không vẽ. Hộp xác nhận NHIỀU dòng
       một lúc nên không có một lịch sử chung để hiện.
     · Lưu đổi mức cảnh cáo: gốc gọi nhầm RL_TieuChiDanhGia/CapNhat — xem _xlhv.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, K = ums.xlhvKQ, esc = ui.esc;
    var root = document.getElementById('xlhv-pheduyetketqua');
    if (!root) return;

    var man = ums.xlhv.man(root, {
        tieuDe: 'Phê duyệt kết quả xử lý học vụ',
        tools: ui.btn('confirm', { text: 'Thực hiện phê duyệt', mod: 'primary', attr: { 'data-a': 'pheduyet' } }),
        baoCao: { strTuKhoa: '' },
        onNut: function (a) { if (a === 'pheduyet') pheDuyet(); }
    });

    /* ---------- Hộp Xác nhận (#modal_XacNhan gốc) ------------------------ */
    function pheDuyet() {
        var chon = man.chon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var dlg = ui.dialog({ title: 'Xác nhận — ' + chon.length + ' đối tượng đã chọn', icon: 'fa-circle-check', size: 'lg', body:
            ui.field('Nội dung xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
            '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="xlhv-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var B = dlg.body, nut = B.querySelector('[data-x="nut"]');
        ums.api.dm('XLHV.XNKK', 'HESO1').then(function (d) {
            nut.innerHTML = (d || []).map(function (x) {
                var ic = ums.iconFA4(K.e(x.THONGTIN1));      // tên FA4 → FA7
                return '<button type="button" class="xlhv-xn__o" data-tt="' + esc(x.ID) + '"><i class="' + esc(ic || 'fa-light fa-circle-check') +
                    ' fa-2x" style="' + esc(K.e(x.THONGTIN2)) + '"></i><span>' + esc(K.e(x.TEN)) + '</span></button>';
            }).join('') || ui.empty('Chưa khai báo tình trạng xác nhận (danh mục XLHV.XNKK)', 'fa-circle-info');
        }).catch(function (err) { nut.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tình trạng xác nhận'); });

        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tt]');
            if (!b) return;
            var tt = b.getAttribute('data-tt'), nd = B.querySelector('[data-x="nd"]').value.trim();
            dlg.close();
            ui.batch(chon.map(function (r) {
                return { action: 'XLHV_PheDuyetKetQua/ThemMoi', method: 'POST', strId: '', strSanPham_Id: r.ID,
                    strNoiDung: nd, strTinhTrang_Id: tt, strNguoiXacnhan_Id: K.uid() };
            }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' }).then(function () { man.tai(); });
        });
    }
})();
