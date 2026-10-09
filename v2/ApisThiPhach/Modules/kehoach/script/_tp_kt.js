/* =========================================================================
   ums.tpKt — phần dùng chung của ba màn khảo thí (Thi phách, nhóm F):
       phuckhao        Khảo thí duyệt đăng ký phúc khảo
       khaothicapnhat  Cập nhật tình trạng vi phạm quy chế thi
       xacnhan         Xác nhận (vắng thi / vi phạm quy chế)
   ---------------------------------------------------------------------------
   ums.tpKt.get(action, o)        lời gọi kiểu cũ GET (không func, không mã hoá) — như bản gốc
   ums.tpKt.cotChon()             cột ô đánh dấu của ums.ui.table (ô tiêu đề "chọn tất cả")
   ums.tpKt.ganChon(root)         ô "chọn tất cả" → mọi ô của CHÍNH bảng đó (gốc: chkSystemSelectAll / checkedAll_BgRow)
   ums.tpKt.daChon(host, rows)    các dòng đang đánh dấu của bảng trong host
   ums.tpKt.diem(v)               "7.5" → "7,5" (một chữ số thập phân, dấu phẩy — mRender của bản gốc)
   ums.tpKt.xacNhan(o)            hộp "Xác nhận" KIỂU NÚT (#modal_XacNhan của cả ba màn gốc: ô Nội dung ·
                                  mỗi tình trạng một nút lớn, bấm là lưu ngay · bảng Lịch sử xác nhận)
       o = { tieuDe, icon, soChon, chuDe,
             nut:    () → Promise<dòng {ID, TEN, THONGTIN1, THONGTIN2}>      nguồn nút (mỗi màn một nguồn — chép nguyên)
             luu:    (tinhTrangId, noiDung) → mảng lời gọi (mỗi đối tượng một lời gọi, như gốc)
             lichSu: () → Promise<dòng> | null     null = không nạp được (chọn nhiều) → ghi chú lichSuRong
             lichSuRong, khongLichSu: true (không vẽ khối lịch sử),
             hoi:    chữ hỏi lại trước khi ghi (việc công bố / không hoàn lại được),
             onDone }
   Vì sao không dùng ums.nd.xacNhanNut (Cổng cán bộ): hàm đó viết cứng nguồn nút D_HanhDongXacNhan và lịch sử
   D_XacNhan; ba màn này lấy nút từ danh mục / TP_Chung / TN_XacNhan và lịch sử từ TP_PhucKhao / TP_XacNhanSauThi.
   Kiểu nút lớn dùng lại lớp .nd-xn của css nhapdiem Cổng cán bộ (nạp chéo trong html).
   Biểu tượng THONGTIN1 (FA4 trong CSDL) đổi qua ums.iconFA4.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var T = ums.tpKt = ums.tpKt || {};

    T.uid = function () { return (ums.session && ums.session.userId) || ''; };
    T.e = function (v) { return v === null || v === undefined ? '' : v; };
    T.arr = function (d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); };
    T.get = function (action, o) {
        return ums.api.call(Object.assign({ action: action, method: 'GET', strNguoiThucHien_Id: T.uid() }, o));
    };
    T.diem = function (v) {
        if (v === null || v === undefined || v === '') return '';
        var n = parseFloat(v);
        return isNaN(n) ? v : n.toFixed(1).replace('.', ',');
    };

    T.cotChon = function () {
        return { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } };
    };
    T.ganChon = function (root) {
        root.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.getAttribute || t.getAttribute('data-ck') !== 'all') return;
            var tb = t.closest('table'); if (!tb) return;
            Array.prototype.forEach.call(tb.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = t.checked; });
        });
    };
    T.daChon = function (host, rows) {
        if (!host) return [];
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[data-ck]:checked'), function () { return true; })
            .map(function (c) { return rows[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    };

    T.xacNhan = function (o) {
        var tieuDe = o.tieuDe || 'Xác nhận';
        var dlg = ui.dialog({ title: tieuDe + (o.chuDe ? ' — ' + o.chuDe : ''), icon: o.icon || 'fa-circle-check', size: 'lg',
            body: (o.soChon > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + ui.so(o.soChon) + ' mục đã chọn.</p>' : '') +
                ui.field('Nội dung', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div>' +
                '<div class="nd-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                (o.khongLichSu ? '' : '<div class="ums-legend ums-legend--cach">' + ui.esc(o.lichSuTen || 'Lịch sử xác nhận') + '</div><div data-x="ls"></div>') });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }

        Promise.resolve(o.nut()).then(function (d) {
            d = T.arr(d);
            q('nut').innerHTML = d.length ? d.map(function (h) {
                var ic = ums.iconFA4 ? ums.iconFA4(h.THONGTIN1 || 'fa fa-paper-plane') : 'fa-light fa-paper-plane';
                return '<button type="button" class="nd-xn__nut" data-tt="' + ui.esc(h.ID) + '"><i class="' + ui.esc(ic) + '"' +
                    (h.THONGTIN2 ? ' style="' + ui.esc(h.THONGTIN2) + '"' : '') + '></i><span>' + ui.esc(T.e(h.TEN)) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo tình trạng xác nhận');
        }).catch(function (err) { q('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tình trạng xác nhận'); });

        if (q('ls')) {
            var p = o.lichSu ? o.lichSu() : null;
            if (!p) q('ls').innerHTML = ui.empty(o.lichSuRong || 'Chọn đúng một dòng để xem lịch sử xác nhận', 'fa-clock-rotate-left');
            else {
                q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                p.then(function (d) {
                    ui.table({ el: q('ls'), rows: T.arr(d), empty: 'Chưa có lịch sử', columns: [
                        { title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                        { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                        { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '100px' }] });
                }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
            }
        }

        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tt]');
            if (!b) return;
            var tt = b.getAttribute('data-tt'), ten = b.textContent.trim(), noiDung = q('nd').value || '';
            function ghi() {
                var calls = o.luu(tt, noiDung) || [];
                dlg.close();
                ui.batch(calls, { title: 'Đang xác nhận', okText: 'Xác nhận thành công', concurrency: 5, show: true })
                    .then(function (kq) { if (o.onDone) o.onDone(kq); });
            }
            if (!o.hoi) { ghi(); return; }
            ui.confirm(o.hoi.replace('{ten}', ten), { title: tieuDe, ok: 'Đồng ý' }).then(function (yes) { if (yes) ghi(); });
        });
        return dlg;
    };
})();
