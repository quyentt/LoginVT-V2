/* =========================================================================
   Nhập học — phần dùng chung của module QUY ĐỊNH HỒ SƠ (ums.nhQD)
   Dùng ở: quydinh/hoso, quydinh/hoso_apdung
   ---------------------------------------------------------------------------
   Hai màn gốc chép nhau cùng:
     · danh sách kế hoạch nhập học (PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc) đổ vào ô lọc VÀ bảng của hộp
       "Tìm kiếm kế hoạch" (#myModalKeHoach_*: Tên kế hoạch · Thời gian · Khóa · "Chọn");
     · ô "Kế hoạch nhập học" trong biểu mẫu là ô chữ CHỈ ĐỌC + nút "Tìm kiếm" mở hộp đó; chọn thì ô hiện
       "<Tên> (<bắt đầu> - <kết thúc>) <Khoá>" (select_KeHoachNhapHoc), id giữ riêng để gửi strNHAPHOC_KeHoach_Id.

   ums.nhQD.keHoach() → Promise<dòng>   (nhớ trong màn — cả ô lọc lẫn hộp chọn dùng một lần nạp)
   ums.nhQD.nguonKeHoach                 nguồn `source` cho ô chọn của ums.crud
   ums.nhQD.tenKeHoach(r)                chuỗi hiện trong ô chữ như gốc
   ums.nhQD.ganKeHoach(crud, { idKey, tenKey, onPick(r) })
       gắn nút "Tìm kiếm" cạnh ô chữ kế hoạch của biểu mẫu crud (gọi một lần, sau khi dựng crud)

   KHÁC BẢN GỐC: ô tìm trong hộp "Tìm kiếm kế hoạch" gốc KHÔNG gắn xử lý (btnSearch_KeHoach_* không có trong .js)
   → nay lọc tại chỗ theo tên / thời gian / khoá khi gõ.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui;
    var Q = ums.nhQD = ums.nhQD || {};
    var CALL = {
        action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
        func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc'
    };

    function e(v) { return v === undefined || v === null ? '' : v; }

    Q.nguonKeHoach = { call: { action: CALL.action, func: CALL.func, strNguoiThucHien_Id: '' }, id: 'ID', name: 'TENKEHOACH' };
    Q.keHoach = function () {
        // Dùng CHUNG lời hứa với nguồn của ô lọc crud — một lần nạp cho cả màn
        Q.nguonKeHoach.call.strNguoiThucHien_Id = ums.session.userId;
        return ums.crud.loadSource(Q.nguonKeHoach);
    };
    Q.tenKeHoach = function (r) {
        return e(r.TENKEHOACH) + ' (' + e(r.NGAYBATDAU) + ' - ' + e(r.NGAYKETTHUC) + ') ' + e(r.DAOTAO_KHOADAOTAO_TEN);
    };

    /** Hộp "Tìm kiếm kế hoạch" */
    Q.hopKeHoach = function (onPick) {
        var dlg = ui.dialog({
            title: 'Tìm kiếm kế hoạch', icon: 'fa-file-magnifying-glass', size: 'xl',
            body: '<div class="ums-searchbar ums-u-mb-3"><span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                '<input class="ums-searchbar__input" data-q placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div><div data-bang></div>'
        });
        var bang = dlg.body.querySelector('[data-bang]');
        var all = [];
        function ve(q) {
            var rows = ums.pat.loc(all, q, ['TENKEHOACH', 'NGAYBATDAU', 'NGAYKETTHUC', 'DAOTAO_KHOADAOTAO_TEN']);
            ui.table({
                el: bang, rows: rows, empty: 'Không có kế hoạch',
                columns: [
                    { title: 'Tên kế hoạch', prop: 'TENKEHOACH' },
                    { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(e(r.NGAYBATDAU) + ' - ' + e(r.NGAYKETTHUC)); } },
                    { title: 'Khóa', cls: 'is-center', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: '', cls: 'is-actions', width: '90px', render: function (r) {
                        return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-chon="' + ui.esc(r.ID) + '">' +
                            '<i class="fa-light fa-circle-check"></i><span>Chọn</span></button>';
                    } }
                ]
            });
        }
        bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        Q.keHoach().then(function (rows) { all = rows; ve(''); })
            .catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kế hoạch nhập học'); });
        dlg.body.querySelector('[data-q]').addEventListener('input', function () { ve(this.value); });
        bang.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-chon]');
            if (!b) return;
            var r = all.filter(function (x) { return x.ID === b.getAttribute('data-chon'); })[0];
            if (!r) return;
            onPick(r);
            ui.toast('Chọn thành công!', 'ok');
            dlg.close();
        });
        return dlg;
    };

    /** Ô chữ kế hoạch (chỉ đọc) + nút "Tìm kiếm" trong biểu mẫu của ums.crud */
    Q.ganKeHoach = function (crud, o) {
        var sel = function (k) { return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]'); };
        var ten = sel(o.tenKey), id = sel(o.idKey);
        if (!ten || ten._nhqd) return;
        ten._nhqd = true;
        ten.readOnly = true;
        ten.placeholder = 'Vui lòng tìm kiếm kế hoạch';
        var wrap = document.createElement('div');
        wrap.className = 'nhqd-kh';
        ten.parentNode.insertBefore(wrap, ten);
        wrap.appendChild(ten);
        wrap.insertAdjacentHTML('beforeend', ui.btn('search', { attr: { 'data-nhqd-kh': '1' } }));
        wrap.querySelector('[data-nhqd-kh]').addEventListener('click', function () {
            Q.hopKeHoach(function (r) {
                id.value = r.ID;
                ten.value = Q.tenKeHoach(r);
                ten.classList.remove('is-invalid');
                if (o.onPick) o.onPick(r);
            });
        });
    };

    /** Ô "chọn tất cả" ở tiêu đề bảng (data-all="<thuộc tính ô dòng>") — chkSystemSelectAll của gốc */
    Q.ganChonTatCa = function (host) {
        host.addEventListener('change', function (ev) {
            var a = ev.target.getAttribute && ev.target.getAttribute('data-all');
            if (!a) return;
            var tb = ev.target.closest('table');
            Array.prototype.forEach.call(tb.querySelectorAll('tbody input[' + a + ']'), function (x) { x.checked = ev.target.checked; });
            ui.demXoaChon();
        });
    };
})();
