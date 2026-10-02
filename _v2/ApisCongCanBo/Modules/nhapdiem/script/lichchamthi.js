/* =========================================================================
   lichchamthi — Xem lịch chấm thi: túi bài (thi viết) + danh sách thi VĐ/TH,
   đặt tình trạng chấm cho các dòng đánh dấu.
   Bản gốc: nhapdiem/script/lichchamthi.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên):
       NS_ThongTinCanBo/LayDSKetQuaChamThi (GET, chỉ strNguoiThucHien_Id) → rsTheoTui / rsTheoDST
       TP_XuLy/XacNhanTinhTrangChamThi (POST) — mỗi dòng một lời gọi: strId, dTinhTrangCham (1 Đã chấm / 0 Chưa chấm)
   Không chép (lỗi rõ của bản gốc):
     · Nút trùng id với bảng; sắp túi bài bằng phép TRỪ chuỗi (thứ tự bất định) → sắp theo tên kiểu tự nhiên.
     · Báo "Thêm mới thành công!" cho việc cập nhật tình trạng; nhánh lỗi mạng hiện thông báo rỗng.
     · Bảng "Lịch sử" trong hộp xác nhận không nơi nào nạp (không có API) → bỏ.
   Giữ như bản gốc (chờ nghiệp vụ):
     · NGAYBATDAUCHAM mang nhãn "Ngày giao bài" (túi bài) và "Ngày hỏi thi" (thi VĐ/TH).
     · Tiêu đề hộp "Xác nhận hoàn thành" khác chữ nút "Thiết đặt tình trạng chấm".
     · Danh sách chỉ gửi strNguoiThucHien_Id — hiểu là lịch của chính người đăng nhập.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('nd-lichchamthi');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function nut(k, mod) { return ui.btn('save', { text: 'Thiết đặt tình trạng chấm', icon: 'fa-money-check-pen', mod: mod, attr: { 'data-xn': k } }); }
    root.innerHTML = pat.page('Xem lịch chấm thi và nhập điểm', ui.btn('search', { text: 'Xem', attr: { 'data-a': 'xem' } })) +
        '<div class="ums-u-mb-4">' + pat.panel({ title: 'Danh sách túi bài (thi viết)', icon: 'fa-list-timeline', count: 'nTui', flush: true, zone: 'tui', tools: nut('tui', 'out-primary') }) + '</div>' +
        pat.panel({ title: 'Danh sách thi VĐ/ TH', icon: 'fa-clipboard-list', count: 'nThi', flush: true, zone: 'thi', tools: nut('thi', 'out-danger') });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var DS = { tui: [], thi: [] };
    function tinhTrang(x) { return x.TINHTRANGCHAM && String(x.TINHTRANGCHAM) !== '0' ? ui.badge('Đã chấm', 'ok') : ui.badge('Chưa chấm', 'mute'); }
    function ck(k) {
        return { head: '<input type="checkbox" data-ck="' + k + '|all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (x, i) { return '<input type="checkbox" data-ck="' + k + '|' + i + '">'; } };
    }
    function chung(ngay, them) {
        return [{ title: 'Cán bộ chấm thi', prop: 'CANBOCHAMTHI_HOTEN' }, { title: 'Số bài chấm', prop: 'SOBAI', cls: 'is-center' },
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: ngay, prop: 'NGAYBATDAUCHAM', cls: 'is-center is-nowrap' }].concat(them, [
            { title: 'Thời gian hoàn thiện điểm', prop: 'NGAYHOANTHANHCHAM', cls: 'is-center' }, { title: 'Thời gian nhận bài từ VPK', prop: 'NGAYNHANBAI', cls: 'is-center' },
            { title: 'Tình trạng chấm', cls: 'is-center is-nowrap', render: tinhTrang }, { title: 'Ghi chú', prop: 'GHICHU' }, { title: 'Đợt thi', prop: 'TENDOTTHI' }]);
    }
    var COT = {
        tui: [{ title: 'Túi bài', prop: 'THI_TUIBAI_TEN' }].concat(chung('Ngày giao bài', []), [ck('tui')]),
        thi: [{ title: 'Danh sách thi', prop: 'DANHSACHTHI_TEN' }].concat(chung('Ngày hỏi thi',
            [{ title: 'Ca thi', prop: 'CATHI_TEN', cls: 'is-center' }, { title: 'Phòng thi', prop: 'PHONGTHI_TEN', cls: 'is-center' }]), [ck('thi')])
    };
    function ve(k) {
        z(k === 'tui' ? 'nTui' : 'nThi').textContent = '(' + DS[k].length + ')';
        ui.table({ el: z(k), rows: DS[k], columns: COT[k], empty: 'Không có dữ liệu' });
    }
    function tai() {
        z('tui').innerHTML = z('thi').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'NS_ThongTinCanBo/LayDSKetQuaChamThi', method: 'GET', strNguoiThucHien_Id: uid() }).then(function (r) {
            var d = r.data || {};
            DS.tui = (d.rsTheoTui || []).slice().sort(function (a, b) { return String(e(a.THI_TUIBAI_TEN)).localeCompare(String(e(b.THI_TUIBAI_TEN)), 'vi', { numeric: true }); });
            DS.thi = d.rsTheoDST || [];
            ve('tui'); ve('thi');
        }).catch(function (err) { z('tui').innerHTML = z('thi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch chấm thi'); });
    }
    function chon(k) {
        return Array.prototype.filter.call(z(k).querySelectorAll('input[data-ck]:checked'), function (c) { return !/\|all$/.test(c.getAttribute('data-ck')); })
            .map(function (c) { return DS[k][Number(c.getAttribute('data-ck').split('|')[1])]; }).filter(Boolean);
    }
    function xacNhan(k) {
        var ds = chon(k);
        if (!ds.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        ui.dialog({ title: 'Xác nhận hoàn thành', icon: 'fa-circle-check', size: 'sm',
            body: '<p class="ums-u-muted ums-u-fz13">Đã chọn ' + ds.length + ' dòng.</p>' +
                ui.field('Trạng thái', '<select class="ums-select" data-x="tt" data-no-s2><option value="1">Đã chấm</option><option value="0">Chưa chấm</option></select>'),
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function (dlg) {
                var tt = dlg.body.querySelector('[data-x="tt"]').value;
                ui.batch(ds.map(function (x) { return { action: 'TP_XuLy/XacNhanTinhTrangChamThi', method: 'POST', strId: x.ID, dTinhTrangCham: tt, strNguoiThucHien_Id: uid() }; }),
                    { title: 'Đang cập nhật', okText: 'Cập nhật tình trạng chấm thành công', show: true }).then(tai);
            } }] });
    }
    root.addEventListener('change', function (ev) {
        var k = ev.target.getAttribute && ev.target.getAttribute('data-ck');
        if (k && /\|all$/.test(k)) Array.prototype.forEach.call(z(k.split('|')[0]).querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-xn]');
        if (b) { xacNhan(b.getAttribute('data-xn')); return; }
        if (ev.target.closest('[data-a="xem"]')) tai();
    });
    tai();
})();
