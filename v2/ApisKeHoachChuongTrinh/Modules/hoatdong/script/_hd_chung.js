/* =========================================================================
   Kế hoạch chương trình › hoatdong — mảnh dùng chung cho hocphan, molop, dukienhocphan
   ums.khctHd = {
       uid(), arr(d), e(v), goi(action, func, o) → Promise<rows>   (func có thì tự mã hoá; kiểu cũ truyền iM tay)
       cotCk()                   cột ô đánh dấu (data-ck = chỉ số dòng; ô "chọn tất cả" ở tiêu đề)
       danhDauHet(host)          gắn "chọn tất cả" cho mọi bảng trong host
       chon(host) → [chỉ số]     các dòng đang đánh dấu
       hangDoi(viec[], n)        chạy các hàm trả Promise, tối đa n cùng lúc (gốc bắn một lượt N×M lời gọi)
       xacNhan(o)                hộp "Xác nhận" KIỂU NÚT của hocphan / molop (#modal_XacNhan gốc)
   }
   ---------------------------------------------------------------------------
   Hộp xác nhận — bản gốc hocphan.js / molop.js (loadBtnXacNhan, getList_BtnXacNhan, getList_XacNhanTN,
   save_XacNhanTN; html #modal_XacNhan): ô "Nội dung", ô "Chọn loại xác nhận" (danh mục KLGD.PHANLOAIXACNHAN),
   các nút hành động (KHCT_HoatDong_XacNhan/LayHanhDongXacNhanNguoiDung — kiểu cũ + iM, strLoaiXacNhan_Id;
   biểu tượng THONGTIN1 qua ums.iconFA4, kiểu THONGTIN2), bảng "Lịch sử" TINHTRANG_TEN / NOIDUNG /
   NGUOIXACNHAN_TENDAYDU / NGAYTAO_DD_MM_YYYY.
       o = { ids: [khoá dữ liệu], lichSu: action lịch sử (kiểu cũ, strDuLieuXacNhan = ids nối phẩy),
             luu(loaiXN, hanhDong, noiDung) → [lời gọi]   (mỗi mục một lời gọi, chạy bằng ui.batch),
             onDone() }
   Khác gốc (gốc chưa từng lưu được): bấm nút đọc ô "Nội dung" THẬT (gốc đọc #txtNoiDungXacNhan không tồn tại →
   luôn rỗng); hocphan gốc lấy dòng chọn từ bảng #tblXacNhan không tồn tại → không lưu gì. Phải chọn loại xác nhận
   trước (nút chỉ hiện sau khi chọn, như gốc); tự chọn khi danh mục có đúng một mục.
   Lịch sử: pageIndex 1 / pageSize 100000 (gốc dùng trang mặc định 1/10 — cắt còn 10 dòng).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var H = ums.khctHd = ums.khctHd || {};

    H.uid = function () { return (ums.session && ums.session.userId) || ''; };
    H.arr = function (d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); };
    H.e = function (v) { return v === null || v === undefined ? '' : v; };
    H.goi = function (action, func, o) {
        var c = Object.assign({ action: action, strNguoiThucHien_Id: H.uid() }, o || {});
        if (func) c.func = func;
        return ums.api.call(c).then(function (r) { return H.arr(r.data); });
    };
    H.cotCk = function () {
        return { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } };
    };
    H.danhDauHet = function (host) {
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.getAttribute || t.getAttribute('data-ck') !== 'all') return;
            var bang = t.closest('table') || host;
            Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = t.checked; });
        });
    };
    H.chon = function (host) {
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return Number(c.getAttribute('data-ck')); });
    };
    H.hangDoi = function (viec, n) {
        var i = 0;
        function chay() {
            if (i >= viec.length) return Promise.resolve();
            var f = viec[i++];
            return Promise.resolve().then(f).catch(function () {}).then(chay);
        }
        var luong = [];
        for (var k = 0; k < Math.min(n || 6, viec.length); k++) luong.push(chay());
        return Promise.all(luong);
    };

    H.xacNhan = function (o) {
        var dlg = ui.dialog({ title: 'Xác nhận', icon: 'fa-check-to-slot', size: 'lg',
            body: (o.ids.length > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + o.ids.length + ' học phần đã chọn.</p>' : '') +
                ui.field('Nội dung', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                ui.field('Chọn loại xác nhận', '<select class="ums-select" data-x="loai" data-ph="Chọn loại xác nhận"><option value=""></option></select>', { required: true }) +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="khcthd-xn" data-x="nut">' + ui.empty('Chọn loại xác nhận', 'fa-hand-pointer') + '</div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử</div><div data-x="ls">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        function napNut() {
            var loai = q('loai').value;
            if (!loai) { q('nut').innerHTML = ui.empty('Chọn loại xác nhận', 'fa-hand-pointer'); return; }
            q('nut').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            H.goi('KHCT_HoatDong_XacNhan/LayHanhDongXacNhanNguoiDung', null, { method: 'POST', strLoaiXacNhan_Id: loai, iM: ums.session.iM }).then(function (d) {
                q('nut').innerHTML = d.length ? d.map(function (h) {
                    var ic = ums.iconFA4 ? ums.iconFA4(h.THONGTIN1 || 'fa fa-check-circle') : 'fa-light fa-circle-check';
                    return '<button type="button" class="khcthd-xn__nut" data-hd="' + ui.esc(h.ID) + '"><i class="' + ui.esc(ic) + '"' +
                        (h.THONGTIN2 ? ' style="' + ui.esc(h.THONGTIN2) + '"' : '') + '></i><span>' + ui.esc(H.e(h.TEN)) + '</span></button>';
                }).join('') : ui.empty('Chưa khai báo hành động cho loại xác nhận này');
            }).catch(function (err) { q('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'hành động xác nhận'); });
        }
        ums.api.dm('KLGD.PHANLOAIXACNHAN').then(function (d) {
            pat.fill(q('loai'), d, { name: 'TEN', head: 'Chọn loại xác nhận' });
            if (d.length === 1) { q('loai').value = d[0].ID; if (window.jQuery) jQuery(q('loai')).trigger('change.select2'); napNut(); }
        }).catch(function (err) { ums.api.handle(err, 'loại xác nhận'); });
        if (window.jQuery) jQuery(q('loai')).on('select2:select select2:clear', napNut);
        else q('loai').addEventListener('change', napNut);
        H.goi(o.lichSu, null, { method: 'POST', strTuKhoa: '', strDuLieuXacNhan: o.ids.join(','), strLoaiXacNhan_Id: '', strNguoiXacNhan_Id: '',
            strHanhDong_Id: '', strPhanLoaiLop_Id: '', pageIndex: 1, pageSize: 100000, iM: ums.session.iM }).then(function (d) {
            ui.table({ el: q('ls'), rows: d, empty: 'Chưa có lịch sử xác nhận', columns: [
                { title: 'Tình trạng', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '110px' }] });
        }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]');
            if (!b) return;
            var calls = o.luu(q('loai').value, b.getAttribute('data-hd'), (q('nd').value || '').trim());
            dlg.close();
            ui.batch(calls, { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true }).then(function () { if (o.onDone) o.onDone(); });
        });
        return dlg;
    };
})();
