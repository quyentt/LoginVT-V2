/* =========================================================================
   Tra cứu thông tin nộp tiền VNPAY
   Bản gốc: ApisTaiChinh/Modules/tracuu/html/tracuuthongtinnoptienvnpay.html + scripts/tracuuthongtinnoptienvnpay.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       TC_TraCuuHocPhi/LayDS_LichSuThanhToanOnline   GET — phân trang máy chủ
           bằng PageNumber / ItemPerPage (KHÔNG phải pageIndex/pageSize),
           strUserId = người đăng nhập, strNganHangId = ''
       CTT_HocPhi/ThucHienGachNo                     GET, từng giao dịch đã chọn,
           bodyText = chuỗi JSON dựng tay y như bản gốc (kể cả các khoá thừa
           khoảng trắng trong NoiDungThanhToan_ChiTiet — máy chủ đang nhận
           đúng chuỗi này, không "sửa đẹp")
   Chi tiết giao dịch hiện từ dòng đã tải (objGetDataInData), không gọi API.

   Khác bản gốc:
     · Bản gốc không tự tải danh sách khi mở — giữ nguyên, bấm Tìm kiếm.
     · Phân trang bản gốc gọi main_doc.tracuuthongtinnoptienVNPay (sai hoa/
       thường tên đối tượng) nên chuyển trang không chạy → ở đây chạy.
     · Bản gốc hẹn giờ 2 giây nạp lại danh sách ngay khi bấm "Thực hiện gạch
       nợ" (kể cả khi người dùng bấm Huỷ ở hộp xác nhận) → ở đây nạp lại sau
       khi các lời gọi gạch nợ xong.
   Cố ý bỏ: nút "Lưu" trong khung chi tiết (btnSave_CoSoDaoTao — không có xử
   lý nào gắn vào).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, T = ums.tcTraCuu;
    var root = document.getElementById('tracuuthongtinnoptienvnpay');
    var st = { rows: [], page: 1, size: 10, total: 0 };

    root.innerHTML =
        '<div data-z="list">' +
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Tra cứu thông tin nộp tiền VNPAY</h1>' +
        '<div class="ums-page__actions"><button type="button" class="ums-btn ums-btn--primary" data-a="gachno">' +
        '<i class="fa-light fa-paper-plane"></i><span>Thực hiện gạch nợ</span></button></div></div>' +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
        '<div class="ums-field" style="flex:0 1 180px"><div class="ums-inputwrap"><input class="ums-input" data-k="tuNgay" placeholder="Từ ngày" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>' +
        '<div class="ums-field" style="flex:0 1 180px"><div class="ums-inputwrap"><input class="ums-input" data-k="denNgay" placeholder="Đến ngày" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>' +
        '<div class="ums-field"><input class="ums-input" data-k="tuKhoa" placeholder="Nhập từ khoá tìm kiếm" autocomplete="off"></div>' +
        '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
        '</div></div></div>' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-credit-card"></i> Thông tin ' +
        '<span class="ums-u-faint ums-u-fz13" data-z="count"></span></div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="table">' + ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-magnifying-glass') + '</div></div>' +
        '</div>' +
        '<div data-z="view" hidden></div>';

    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
    function k(n) { return root.querySelector('[data-k="' + n + '"]'); }
    ui.datepicker(k('tuNgay'));
    ui.datepicker(k('denNgay'));
    T.bindPick(root);

    function draw() {
        z('count').textContent = '(' + st.total + ')';
        ui.table({
            el: z('table'), rows: st.rows, empty: 'Không có giao dịch',
            page: {
                index: st.page, size: st.size, total: st.total,
                onChange: function (p) {
                    if (p >= 1 && p <= Math.ceil(st.total / st.size)) load(p);
                },
                onSize: function (v) { st.size = v; load(1); }
            },
            columns: [
                { title: 'Mã sinh viên', prop: 'MASINHVIEN', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r, i) {
                    return '<a href="javascript:void(0)" data-a="xem" data-i="' + i + '" title="' + esc(r.HOVATENSINHVIEN) + '">' + esc(r.HOVATENSINHVIEN) + '</a>';
                } },
                { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Lớp', prop: 'LOP' },
                { title: 'Ngành', prop: 'NGANHDAOTAO' },
                { title: 'Khoá', prop: 'KHOADAOTAO', cls: 'is-center' },
                { title: 'Số tiền gửi sang VNPAY', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIENPHAINOP || 0); } },
                { title: 'Ngày gửi sang VNPAY', prop: 'NGAYTAODH_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                { title: 'Trạng thái', prop: 'TRANSACTIONSTATUS', cls: 'is-center' },
                T.pickCol('gd')
            ]
        });
    }

    function load(page) {
        if (page) st.page = page;
        z('table').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_TraCuuHocPhi/LayDS_LichSuThanhToanOnline',
            method: 'GET',
            versionAPI: 'v1.0',
            strNganHangId: '',
            strTuKhoa: (k('tuKhoa').value || '').trim(),
            strTuNgay: (k('tuNgay').value || '').trim(),
            strDenNgay: (k('denNgay').value || '').trim(),
            strUserId: (ums.session && ums.session.userId) || '',
            PageNumber: st.page,
            ItemPerPage: st.size
        }).then(function (r) {
            st.rows = T.rows(r);
            st.total = st.rows.length ? (Number(r.pager) || st.rows.length) : 0;
            draw();
        }).catch(function (e) {
            z('table').innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'lịch sử thanh toán');
        });
    }

    /* ---------- Chi tiết giao dịch ---------- */
    function view(r) {
        var pairs = [
            ['Mã sinh viên', r.MASINHVIEN], ['Họ tên', r.HOVATENSINHVIEN], ['Lớp', r.LOP],
            ['Ngành', r.NGANHDAOTAO], ['Khoá', r.KHOADAOTAO],
            ['Chuyển sang VNPAY: Mã giao dịch', r.MADONHANG_GUI_NGANHANG],
            ['Chuyển sang VNPAY: Số tiền', ui.money(r.SOTIENPHAINOP || 0)],
            ['Chuyển sang VNPAY: Ngày gửi', r.NGAYTAODH_DD_MM_YYYY_HHMMSS],
            ['Nhận từ VNPAY: Mã giao dịch', r.VNP_TRANSACTIONNO],
            ['Nhận từ VNPAY: Số tiền', ui.money(r.SOTIENVNPAY || 0)],
            ['Nhận từ VNPAY: Trạng thái giao dịch', r.TRANSACTIONSTATUS],
            ['Nhận từ VNPAY: Thông tin giao dịch', r.VNP_MESSAGE]
        ];
        z('view').innerHTML =
            '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-receipt"></i> Chi tiết giao dịch</div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush"><div class="ums-tablewrap"><table class="ums-table ums-table--lined"><tbody>' +
            pairs.map(function (p) {
                return '<tr><td class="ums-u-muted" style="width:320px">' + esc(p[0]) + '</td><td class="ums-u-semi ums-u-blue">' +
                    esc(p[1] === null || p[1] === undefined ? '' : p[1]) + '</td></tr>';
            }).join('') + '</tbody></table></div></div></div>';
        ui.swap(z('list'), z('view'));
    }

    /* ---------- Gạch nợ: chuỗi JSON dựng tay y như bản gốc ---------- */
    function bodyText(d) {
        return '{ "ServiceId": "", "NoiDungThanhToan_TongHop":' +
            '{' +
            '       "MaSinhVien": "' + d.MASINHVIEN + '", ' +
            '       "MaDonHang_Gui_NganHang": "' + d.MADONHANG_GUI_NGANHANG + '",' +
            '       "KenhGiaoDich": "VNPAY_ONLINE",' +
            '       "ChungTuThanhToan_NganHang": "' + d.TXNREF + '",' +
            '       "SoTienThanhToan": "' + d.SOTIENVNPAY + '",' +
            '       "TaiKhoan": "' + d.NGANHANG + '",' +
            '       "NgayThanhToan": null ' +
            '},' +
            ' "NoiDungThanhToan_ChiTiet": [{' +
            '"                              ThuTu": null,' +
            '"                              Id": null,' +
            '"                              NoiDung": null,' +
            '"                              SoTien": null' +
            '}], "ChuKy": ""' +
            '}';
    }

    function gachNo() {
        var rows = T.picked(root, 'gd', st.rows);
        if (!rows.length) { ui.toast('Vui lòng chọn giao dịch gạch nợ', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn thực hiện gạch nợ ' + rows.length + ' giao dịch?', { ok: 'Thực hiện gạch nợ' }).then(function (yes) {
            if (!yes) return;
            var calls = rows.map(function (d) {
                return { action: 'CTT_HocPhi/ThucHienGachNo', method: 'GET', versionAPI: 'v1.0', bodyText: bodyText(d) };
            });
            return ui.batch(calls, { title: 'Đang gạch nợ', okText: 'Thực hiện thành công' }).then(function () { load(); });
        });
    }

    root.addEventListener('click', function (e) {
        var a = e.target.closest('[data-a]');
        if (!a || !root.contains(a)) return;
        switch (a.getAttribute('data-a')) {
            case 'tim': load(1); break;
            case 'xem': view(st.rows[Number(a.getAttribute('data-i'))]); break;
            case 'dong': ui.swap(z('view'), z('list')); break;
            case 'gachno': gachNo(); break;
        }
    });
    root.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target === k('tuKhoa')) { e.preventDefault(); load(1); }
    });
})();
