/* =========================================================================
   Kế hoạch chỉ tiêu
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/chitieutuyensinh.html + script/chitieutuyensinh.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" (Kế hoạch chỉ tiêu · từ khoá · Tìm kiếm) → "Danh sách hồ sơ thí sinh (n)"
   + "Xuất báo cáo ▾" + "Lưu": Tên ngành, nghề · Mã nghề · Trình độ · Khoa quản lý · Quy mô TS/năm (ô nhập) · Phần trăm
   vượt (ô nhập) · Quy mô + 10% được vượt · Số trúng tuyển · Số nhập học · Chỉ tiêu còn so với trúng tuyển / nhập học ·
   Vượt chỉ tiêu so với trúng tuyển / nhập học · ô đánh dấu; dòng tổng các cột số.
   Lưu = cập nhật Quy mô + Phần trăm vượt của các dòng ĐÁNH DẤU.

   Lời gọi (chép nguyên, GET/POST như gốc):
     TS_KeHoachChiTieu/LayDanhSach   GET  strTuKhoa '', strNguoiTao_Id '' (gốc đọc ô txtAAAA / dropAAAA không tồn tại),
                                          pageIndex 1, pageSize 10000 → TEN (selectOne: một kế hoạch thì tự chọn)
     TS_ChiTieuTuyenSinh/LayDanhSach GET  strTuKhoa, strTS_KeHoachChiTieu_Id, strNguoiTao_Id '', trang (máy chủ)
                                          → NGANH_TEN, NGANH_MA, TRINHDO_TEN, KHOAQUANLY_TEN, QUYMOTUYENSINH, PHANTRAMVUOT,
                                            QUYMOTUYENSINH_VUOT, SOTRUNGTUYEN, SONHAPHOC, CHOTIEUCONSOVOITRUNGTUYEN (tên cột
                                            gõ sai "CHO…" của gốc — giữ nguyên), CHITIEUCONSOVOINHAPHOC,
                                            VUOTCHITIEUSOVOITRUNGTUYEN, VUOTCHITIEUSOVOINHAPHOC
     TS_ChiTieuTuyenSinh/CapNhat     POST mỗi dòng đánh dấu một lời gọi: strId, strChucNang_Id, strNguoiThucHien_Id,
                                          dQuyMoTuyenSinh, dPhanTramVuot
     Xuất báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_CTTS") — strChucNang_Id, strTuKhoa,
       strTS_KeHoachChiTieu_Id

   Khác gốc / tự chốt (ghi báo cáo):
     · Lưu: gửi hàng loạt có tiến độ (ui.batch) rồi nạp lại một lần (gốc setTimeout 500 + 80ms/dòng, mỗi lời gọi bật
       một thông báo riêng).
     · Dòng tổng: gốc chép dòng tổng (tfoot) lên THÊM một hàng dưới tiêu đề (#zoneSumHead) → chỉ giữ dòng tổng cuối bảng.
       Hai cột ô nhập cộng theo giá trị đã lưu (QUYMOTUYENSINH / PHANTRAMVUOT).
     · Tiêu đề khung giữ đúng chữ gốc "Danh sách hồ sơ thí sinh".
   Không có cặp ô cha → con.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, P = ums.nhPhanLop, e = P.e, esc = ui.esc;
    var root = document.getElementById('ts-chitieutuyensinh');
    if (!root) return;
    function uid() { return ums.session.userId; }
    function cn() { return ums.state.chucNangId; }

    function so(prop) { return { title: '', prop: prop, cls: 'is-right', sum: true }; }
    function cot(title, prop) { var c = so(prop); c.title = title; return c; }
    function o(ma, id, v) {
        return '<input class="ums-input ums-input--sm" data-' + ma + '="' + esc(id) + '" value="' + esc(e(v)) + '" autocomplete="off" style="min-width:90px">';
    }

    var crud = ums.crud({
        root: root,
        title: 'Kế hoạch chỉ tiêu',
        listTitle: 'Danh sách hồ sơ thí sinh',
        icon: 'fa-bullseye',
        toolbar: [{ text: 'Lưu', icon: 'fa-floppy-disk', mod: 'save', onClick: function () { luu(); } }],
        filters: [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch chỉ tiêu', source: { call: { action: 'TS_KeHoachChiTieu/LayDanhSach',
                method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000 }, name: 'TEN' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'TS_ChiTieuTuyenSinh/LayDanhSach', method: 'GET', strTuKhoa: f.q,
                    strTS_KeHoachChiTieu_Id: f.kh, strNguoiTao_Id: '' };
            }
        },
        columns: [
            { title: 'Tên ngành, nghề', prop: 'NGANH_TEN' },
            { title: 'Mã nghề', prop: 'NGANH_MA', cls: 'is-nowrap' },
            { title: 'Trình độ', prop: 'TRINHDO_TEN' },
            { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' },
            { title: 'Quy mô TS/năm', cls: 'is-right', sum: true, sumProp: 'QUYMOTUYENSINH',
              render: function (r) { return o('qm', r.ID, r.QUYMOTUYENSINH); } },
            { title: 'Phần trăm vượt', cls: 'is-right', sum: true, sumProp: 'PHANTRAMVUOT',
              render: function (r) { return o('pt', r.ID, r.PHANTRAMVUOT); } },
            cot('Quy mô + 10% được vượt', 'QUYMOTUYENSINH_VUOT'),
            cot('Số trúng tuyển (trùng với số đăng ký)', 'SOTRUNGTUYEN'),
            cot('Số nhập học', 'SONHAPHOC'),
            cot('Chỉ tiêu còn so với trúng tuyển', 'CHOTIEUCONSOVOITRUNGTUYEN'),
            cot('Chỉ tiêu còn so với số nhập học', 'CHITIEUCONSOVOINHAPHOC'),
            cot('Vượt chỉ tiêu so với trúng tuyển', 'VUOTCHITIEUSOVOITRUNGTUYEN'),
            cot('Vượt chỉ tiêu so với nhập học', 'VUOTCHITIEUSOVOINHAPHOC'),
            P.cotChon('ct')
        ],
        onLoad: function () { var all = crud.z('table').querySelector('[data-nhall="ct"]'); if (all) all.checked = false; }
    });
    P.ganChon(crud.z('table'), 'ct');

    /* selectOne của gốc: chỉ một kế hoạch chỉ tiêu thì tự chọn (không tự tải — gốc chỉ tải khi bấm Tìm kiếm) */
    var fKH = crud.root.querySelector('[data-scope="filter"][data-k="kh"]');
    crud.sourcesReady.then(function () {
        var opts = Array.prototype.filter.call(fKH.options, function (x) { return x.value; });
        if (opts.length === 1 && !fKH.value) { fKH.value = opts[0].value; jQuery(fKH).trigger('change.select2'); }
    });

    /* Xuất báo cáo ▾ — đặt trước nút Lưu ở đầu trang */
    var act = crud.z('actions');
    act.insertAdjacentHTML('afterbegin', '<span data-x="bc"></span>');
    ums.report.mount(act.querySelector('[data-x="bc"]'), {
        import: false,
        collect: function (add) {
            var f = crud.filterValues();
            add('strChucNang_Id', cn()); add('strTuKhoa', f.q); add('strTS_KeHoachChiTieu_Id', f.kh);
        }
    });

    function gt(ma, id) {
        var el = crud.z('table').querySelector('[data-' + ma + '="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
        return el ? el.value.trim() : '';
    }
    function luu() {
        var ids = P.chon(crud.z('table'), 'ct');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        ui.confirm('Bạn có muốn cập nhật cho ' + ids.length + ' dòng đã chọn không?', { title: 'Cập nhật chỉ tiêu', ok: 'Cập nhật' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                return { action: 'TS_ChiTieuTuyenSinh/CapNhat', method: 'POST', strId: id, strChucNang_Id: cn(),
                    strNguoiThucHien_Id: uid(), dQuyMoTuyenSinh: gt('qm', id), dPhanTramVuot: gt('pt', id) };
            }), { title: 'Đang cập nhật chỉ tiêu', okText: 'Cập nhật thành công' }).then(function () { crud.load(); });
        });
    }
})();
