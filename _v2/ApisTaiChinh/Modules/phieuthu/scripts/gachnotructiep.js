/* =========================================================================
   Gạch nợ trực tiếp
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/gachnotructiep.html + scripts/gachnotructiep.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, kể cả tham số 'type' mà bản gốc để trong data):
       TC_ThanhToan_GachNo/TimThongTinTheoDonHang     GET  strMaDonHang
       TC_ThanhToan_GachNo/TimThongTinTheoMaSinhVien  GET  strSinhVien
           → danh sách = kết quả theo SV nối tiếp kết quả theo đơn hàng;
             số tổng hiển thị là Pager của lời gọi theo SV (như bản gốc)
       TC_ThanhToan_GachNo/LayDSChiTietDonHang        GET  strThanhToan_DonHang_Id
       TC_ThanhToan_GachNo/XacNhanThanhToan           POST từng dòng chi tiết,
           dXacNhanThanhToan = 1 nếu ô được đánh dấu, 0 nếu không
       TC_Custom/ThucHienGachNo                       POST { strVal } —
           strVal = edu.system.atob(JSON đơn hàng, "chaolong") (XOR + base64,
           ums.tcTraCuu.xorB64). JSON bên trong có sẵn action/type/
           strNguoiThucHien_Id như bản gốc; tham số hệ thống do ums.api chèn
           vào lớp ngoài, đúng như makeRequest cũ.
   Báo cáo: ums.report.mount — bản gốc gom strTuKhoa, strDaoTao_ThoiGianDaoTao_Id,
   strHB_QuyHocBong_Id từ các ô KHÔNG có trên màn hình (chép từ màn học bổng)
   nên luôn rỗng; strHocBong_Id lấy từ ô đánh dấu cũng không tồn tại. Giữ
   nguyên ba khoá rỗng để mẫu báo cáo nhận đúng tham số như trước.

   Cố ý bỏ: nút Thêm / Xoá / ô chọn tất cả (bản gốc đã comment trong HTML,
   delete_GachNoTrucTiep không tồn tại); biến arrValid không dùng.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, T = ums.tcTraCuu;
    var root = document.getElementById('gachnotructiep');
    var st = { rows: [], don: null, ct: [] };

    function uid() { return (ums.session && ums.session.userId) || ''; }

    root.innerHTML =
        '<div data-z="list">' +
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Gạch nợ trực tiếp</h1>' +
        '<div class="ums-page__actions" data-z="report"></div></div>' +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
        '<div class="ums-field"><input class="ums-input" data-k="q" placeholder="Mã đơn hàng, mã sinh viên…" autocomplete="off"></div>' +
        '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
        '</div></div></div>' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-money-check-dollar"></i> Danh sách ' +
        '<span class="ums-u-faint ums-u-fz13" data-z="count"></span></div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="table">' +
        ui.empty('Nhập mã đơn hàng hoặc mã sinh viên rồi bấm Tìm kiếm', 'fa-magnifying-glass') + '</div></div>' +
        '</div>' +
        '<div data-z="form" hidden>' +
        '<div class="ums-panel"><div class="ums-panel__head">' +
        '<div class="ums-panel__title"><i class="fa-light fa-list-check"></i> Chi tiết — Gạch nợ trực tiếp</div>' +
        '<div class="ums-panel__tools">' +
        ui.btn('close', { attr: { 'data-a': 'dong' } }) +
        '<button type="button" class="ums-btn ums-btn--save" data-a="gachno"><i class="fa-light fa-circle-dollar-to-slot"></i><span>Gạch nợ</span></button>' +
        '<button type="button" class="ums-btn ums-btn--primary" data-a="xacnhan"><i class="fa-light fa-floppy-disk"></i><span>Lưu xác nhận</span></button>' +
        '</div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="ct"></div></div>' +
        '</div>';

    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }

    /* ---------- Danh sách ---------- */
    function drawList(total) {
        z('count').textContent = '(' + (total === undefined || total === null ? '' : total) + ')';
        ui.table({
            el: z('table'), rows: st.rows,
            empty: 'Không tìm thấy đơn hàng',
            columns: [
                { title: 'Mã đơn hàng', prop: 'MADONHANG_GUI_NGANHANG', cls: 'is-nowrap' },
                { title: 'Ngày tạo đơn hàng', prop: 'NGAYTAODONHANG', cls: 'is-nowrap' },
                { title: 'Họ tên sinh viên', prop: 'HOVATENSINHVIEN' },
                { title: 'Mã sinh viên', prop: 'MASINHVIEN', cls: 'is-center is-nowrap' },
                { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Lớp', prop: 'LOP', cls: 'is-center' },
                { title: 'Tổng tiền đã xác nhận', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIENDAXACNHAN || 0); } },
                { title: 'Tổng tiền đã thanh toán', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIENDATHANHTOAN || 0); } },
                { title: 'Tình trạng gạch nợ', prop: 'TINHTRANGGACHNO', cls: 'is-center' },
                { title: 'Chọn gạch nợ', cls: 'is-center', render: function (r, i) {
                    return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-a="chitiet" data-i="' + i + '">' +
                        '<i class="fa-light fa-eye"></i><span>Chi tiết</span></button>';
                } }
            ]
        });
    }

    function tim() {
        var q = (root.querySelector('[data-k="q"]').value || '').trim();
        z('table').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_ThanhToan_GachNo/TimThongTinTheoDonHang', method: 'GET',
            type: 'GET', strMaDonHang: q, strNguoiThucHien_Id: ''
        }).then(function (r1) {
            var theoDon = T.rows(r1);
            return ums.api.call({
                action: 'TC_ThanhToan_GachNo/TimThongTinTheoMaSinhVien', method: 'GET',
                type: 'GET', strSinhVien: q, strNguoiThucHien_Id: ''
            }).then(function (r2) {
                st.rows = T.rows(r2).concat(theoDon);
                drawList(r2.pager);
            });
        }).catch(function (e) {
            z('table').innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'tìm đơn hàng');
        });
    }

    /* ---------- Chi tiết đơn hàng ---------- */
    function loadCT() {
        z('ct').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_ThanhToan_GachNo/LayDSChiTietDonHang', method: 'GET',
            type: 'GET', strThanhToan_DonHang_Id: st.don.ID, strNguoiThucHien_Id: ''
        }).then(function (r) {
            st.ct = T.rows(r);
            ui.table({
                el: z('ct'), rows: st.ct, empty: 'Đơn hàng không có khoản nào',
                columns: [
                    { title: 'Mã đơn hàng', prop: 'MADONHANG_GUI_NGANHANG', cls: 'is-nowrap' },
                    { title: 'Khoản thu', prop: 'KHOANTHU' },
                    // Tổng: cộng SOTIEN của các dòng đã xác nhận (XACNHANTHANHTOAN = 1), đúng bản gốc
                    { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.SOTIEN || 0); },
                        sum: function (rows) {
                            return '<b>' + ui.money(rows.reduce(function (s, x) { return s + (x.XACNHANTHANHTOAN == 1 ? Number(x.SOTIEN) || 0 : 0); }, 0)) + '</b>';
                        } },
                    { title: 'Số tiền thanh toán', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.SOTIENDATHANHTOAN || 0); } },
                    { title: 'Ngày tạo', prop: 'NGAYTAO', cls: 'is-nowrap' },
                    { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Xác nhận thanh toán', cls: 'is-center', render: function (x, i) {
                        return '<input type="checkbox" data-xn="' + i + '"' + (x.XACNHANTHANHTOAN == 1 ? ' checked' : '') + '>';
                    } }
                ]
            });
        }).catch(function (e) {
            z('ct').innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'chi tiết đơn hàng');
        });
    }

    function openCT(row) {
        st.don = row;
        ui.swap(z('list'), z('form'));
        loadCT();
    }

    function closeCT() { st.don = null; ui.swap(z('form'), z('list')); }

    function gachNo() {
        if (!st.don) return;
        var inner = {
            action: 'TC_Custom/ThucHienGachNo',
            type: 'POST',
            strThanhToan_DonHang_Id: st.don.ID,
            strNguoiThucHien_Id: uid()
        };
        ums.api.call({ action: inner.action, strVal: T.xorB64(JSON.stringify(inner), 'chaolong') })
            .then(function () {
                ui.toast('Thực hiện thành công!', 'ok');
                loadCT();
            }, function (e) { ums.api.handle(e, 'gạch nợ'); })
            .then(function () { tim(); });          // bản gốc nạp lại danh sách dù thành công hay không
    }

    function xacNhan() {
        if (!st.ct.length) return;
        var calls = st.ct.map(function (x, i) {
            var box = root.querySelector('[data-xn="' + i + '"]');
            return {
                action: 'TC_ThanhToan_GachNo/XacNhanThanhToan',
                type: 'POST',
                strId: x.ID,
                dXacNhanThanhToan: box && box.checked ? 1 : 0,
                strNguoiThucHien_Id: ''
            };
        });
        ui.batch(calls, { title: 'Đang lưu xác nhận', okText: 'Thực hiện thành công' }).then(loadCT);
    }

    root.addEventListener('click', function (e) {
        var a = e.target.closest('[data-a]');
        if (!a || !root.contains(a)) return;
        switch (a.getAttribute('data-a')) {
            case 'tim': tim(); break;
            case 'chitiet': openCT(st.rows[Number(a.getAttribute('data-i'))]); break;
            case 'dong': closeCT(); break;
            case 'gachno': gachNo(); break;
            case 'xacnhan': xacNhan(); break;
        }
    });
    root.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.matches('[data-k="q"]')) { e.preventDefault(); tim(); }
    });

    ums.report.mount(z('report'), {
        collect: function (add) {
            add('strTuKhoa', '');
            add('strDaoTao_ThoiGianDaoTao_Id', '');
            add('strHB_QuyHocBong_Id', '');
        }
    });
})();
