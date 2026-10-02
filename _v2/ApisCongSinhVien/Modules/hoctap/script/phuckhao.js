/* =========================================================================
   phuckhao — Đăng ký xin phúc khảo (Cổng sinh viên - thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/hoctap/html/phuckhao.html + script/phuckhao.js
   Màn CÁN BỘ cùng luồng đã chuyển: ApisCongCanBo/Modules/nhapdiem/script/phuckhao.js
   (chỉ xem); màn này là bên NGƯỜI HỌC — có đăng ký / hủy đăng ký.
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc: MỘT cột — thanh lọc (Thời gian + "Tìm kiếm" + "Hướng dẫn
   đăng ký") rồi khung "Theo danh sách thi" với bảng tiêu đề ba nhóm.
   Người học = ums.session.userId (vỏ thủ vai đã đặt, thay edu.system.userId của gốc).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, XLHV_TP_PhucKhao_MH · pkg_thi_phach_phuckhao):
     LayThoiGian (strQLSV_NguoiHoc_Id)                          → ô "Chọn thời gian"
     LayDSThiPhucKhaoCaNhan (strDaoTao_ThoiGianDaoTao_Id, strQLSV_NguoiHoc_Id) → bảng
     LayDSLichSuPhucKhao (strThi_DanhSachThi_TuiBai_Id)         → hộp, đọc rsKetQuaDangKy
     DangKyPhucKhao   (strThi_DanhSachThi_TuiBai_Id, strNguoiDangKy_Id, strLyDoDangKy)
     HuyDangKyPhucKhao(strThi_DanhSachThi_TuiBai_Id, strNguoiHuyDangKy_Id, strLyDoHuyDangKy)
   ---------------------------------------------------------------------------
   Giữ như gốc (chỗ lạ):
     · strLyDoDangKy / strLyDoHuyDangKy gửi RỖNG — gốc đọc ô 'txtAAAA' không có trong html.
     · Luật hiện nút trong hộp chép đúng gốc: có NGAYDANGKYPHUCKHAO thì ẩn "Đăng ký";
       "Hủy đăng ký" CHỈ hiện khi đã đăng ký VÀ đã có TINHTRANGNOPPHI (gốc:
       `if (NGAYDANGKYPHUCKHAO) !TINHTRANGNOPPHI ? hide : show; else hide`).
     · Mở màn nạp danh sách khi chưa chọn thời gian (gửi tham số rỗng) — như gốc.
     · Cột KETQUAPHUCKHAO1 ở gốc nằm dưới một ô tiêu đề TRỐNG → giữ cột, để trống tiêu đề.
   Khác gốc (có chủ ý):
     · Nút "Hủy đăng ký" hỏi lại trước khi gọi (gốc hủy ngay khi bấm).
     · Nút "Nộp phí" của gốc đã bị chú thích trong html (chỉ còn mã bật/tắt) → không dựng.
   Bỏ: ô 'txtSearch' (không có trong html gốc, keypress gọi me.getList_DSThi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('hoctap-phuckhao');
    var M = 'XLHV_TP_PhucKhao_MH/', P = 'pkg_thi_phach_phuckhao.';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function call(action, func, ts) {
        return ums.api.call(Object.assign({ action: M + action, func: P + func, strNguoiThucHien_Id: uid() }, ts || {}));
    }
    var sv = uid(), ds = [];

    root.innerHTML = pat.page('Đăng ký xin phúc khảo', '') +
        pat.filterBar([{ key: 'tg', type: 'select', label: 'Chọn thời gian' }], {
            searchText: 'Tìm kiếm',
            extra: '<div class="ums-field ums-field--fit">' +
                '<a class="ums-btn ums-btn--out-info is-disabled" data-a="huongdan" target="_blank" rel="noopener">' +
                '<i class="fa-light fa-user-pen"></i><span>Hướng dẫn đăng ký</span></a></div>'
        }) +
        pat.panel({ title: 'Theo danh sách thi', icon: 'fa-list-check', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    /* ---------- Ô "Chọn thời gian" ------------------------------------------ */
    call('DSA4FSkuKAYoIC8P', 'LayThoiGian', { strQLSV_NguoiHoc_Id: sv }).then(function (r) {
        pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' });
    }).catch(function (err) { ums.api.handle(err, 'thời gian đăng ký'); });

    /* ---------- Bảng "Theo danh sách thi" ----------------------------------- */
    var G1 = ['Kết quả Thi ban đầu'], G2 = ['Đăng ký phúc khảo'], G3 = ['Kết quả sau phúc khảo'];
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return call('DSA4BRIVKSgRKTQiCikgLgIgDykgLwPP', 'LayDSThiPhucKhaoCaNhan', {
            strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strQLSV_NguoiHoc_Id: sv
        }).then(function (r) {
            ds = arr(r.data);
            z('n').textContent = '(' + ds.length + ')';
            // Đường dẫn hướng dẫn nằm ở dòng đầu của chính danh sách (gốc: btnHuongDan.href)
            var a = root.querySelector('[data-a="huongdan"]'), hd = ds.length ? e(ds[0].HUONGDANSUDUNG) : '';
            if (hd) { a.href = hd; a.classList.remove('is-disabled'); }
            else { a.removeAttribute('href'); a.classList.add('is-disabled'); }
            ui.table({
                el: z('bang'), rows: ds, tableCls: 'ums-table--lined htpk-table', empty: 'Không có học phần thi nào', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: G1, cls: 'is-nowrap' },
                    { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', group: G1 },
                    { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', group: G1 },
                    { title: 'Số báo danh', prop: 'SOBAODANH', group: G1, cls: 'is-center' },
                    { title: 'Học phần thi', group: G1, render: function (x) { return ui.esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
                    { title: 'Loại điểm thi', prop: 'DIEM_THANHPHANDIEM_TEN', group: G1 },
                    { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN', group: G1 },
                    { title: 'Ngày thi', prop: 'NGAYTHI', group: G1, cls: 'is-center is-nowrap' },
                    { title: 'Ca thi', prop: 'CATHI_TEN', group: G1, cls: 'is-center' },
                    { title: 'Phòng thi', prop: 'PHONGTHI_TEN', group: G1, cls: 'is-center' },
                    { title: 'Kết quả', group: G1, cls: 'is-center', render: function (x) { return x.DIEM ? ui.esc(parseFloat(x.DIEM)) : ''; } },
                    { title: 'Ngày bắt đầu mở đăng ký', prop: 'NGAYXACNHANHOANTHANHDIEMTHI', group: G2, cls: 'is-center' },
                    { title: 'Ngày đăng ký Phúc khảo', prop: 'NGAYDANGKYPHUCKHAO', group: G2, cls: 'is-center' },
                    { title: 'Ngày hết hạn đăng ký', prop: 'NGAYHETHANDANGKYPHUCKHAO', group: G2, cls: 'is-center' },
                    { title: 'Ngày hết hạn nộp phí', prop: 'NGAYHETHANNOPPHIPHUCKHAO', group: G2, cls: 'is-center' },
                    { title: 'Phí phúc khảo / Tình trạng', group: G2, cls: 'is-center', render: function (x) { return ui.esc(e(x.PHIPHUCKHAO) + ' - ' + e(x.TINHTRANGNOPPHI)); } },
                    { title: 'Kết quả duyệt', prop: 'TINHTRANG_TEN', group: G2, cls: 'is-center' },
                    { title: 'Kết quả', prop: 'KETQUAPHUCKHAO', group: G3, cls: 'is-center' },
                    { title: '', prop: 'KETQUAPHUCKHAO1', group: G3, cls: 'is-center' },
                    { title: 'Đăng ký', cls: 'is-center', width: '90px', render: function (x, i) {
                        return '<button type="button" class="ums-iconbtn" data-dk="' + i + '" title="Đăng ký phúc khảo">' +
                            '<i class="fa-light fa-money-check-pen"></i></button>'; } }
                ]
            });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thi phúc khảo'); });
    }

    /* ---------- Hộp "Đăng ký phúc khảo" (lịch sử + hai nút) ------------------ */
    function hopDangKy(row) {
        var dlg = ui.dialog({
            title: 'Đăng ký phúc khảo', icon: 'fa-money-check-pen', size: 'xl',
            body: '<p class="ums-u-fz13 ums-u-muted ums-u-mb-4">' +
                ui.esc(e(row.QLSV_NGUOIHOC_MASO) + ' - ' + e(row.QLSV_NGUOIHOC_HODEM) + ' ' + e(row.QLSV_NGUOIHOC_TEN) +
                    ' · ' + e(row.DAOTAO_HOCPHAN_TEN) + ' - ' + e(row.DAOTAO_HOCPHAN_MA)) + '</p>' +
                '<div data-x="ls">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [
                { text: 'Hủy đăng ký', kind: 'del', mod: 'out-danger', onClick: function () { huy(); return false; } },
                { text: 'Đăng ký', kind: 'save', mod: 'save', onClick: function () { dangKy(); return false; } }
            ]
        });
        var nutHuy = dlg.el.querySelector('[data-dlg="0"]'), nutDK = dlg.el.querySelector('[data-dlg="1"]');
        // Luật bật/tắt nút chép nguyên bản gốc (init, $("#tblDSThi").delegate(".btnEdit"))
        nutDK.hidden = !!row.NGAYDANGKYPHUCKHAO;
        nutHuy.hidden = !(row.NGAYDANGKYPHUCKHAO && row.TINHTRANGNOPPHI);

        var h = dlg.body.querySelector('[data-x="ls"]');
        call('DSA4BRINKCIpEjQRKTQiCikgLgPP', 'LayDSLichSuPhucKhao', { strThi_DanhSachThi_TuiBai_Id: row.ID }).then(function (r) {
            ui.table({
                el: h, rows: arr(r.data && r.data.rsKetQuaDangKy), empty: 'Chưa có lịch sử đăng ký', columns: [
                    { title: 'Ngày thực hiện', prop: 'NGAYTHUCHIEN_DD_MM_YYYY', cls: 'is-nowrap' },
                    { title: 'Hành động(Đăng ký/Hủy)', prop: 'HANHDONG', cls: 'is-center' },
                    { title: 'Học phần thi', render: function (y) { return ui.esc(e(y.DAOTAO_HOCPHAN_TEN) + ' - ' + e(y.DAOTAO_HOCPHAN_MA)); } },
                    { title: 'Loại điểm thi', prop: 'DIEM_THANHPHANDIEM_TEN', cls: 'is-center' },
                    { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN', cls: 'is-center' },
                    { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-nowrap' },
                    { title: 'Ca thi', prop: 'CATHI_TEN', cls: 'is-center' },
                    { title: 'Phòng thi', prop: 'PHONGTHI_TEN', cls: 'is-center' }
                ]
            });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử phúc khảo'); });

        function dangKy() {
            call('BSAvJgo4ESk0IgopIC4P', 'DangKyPhucKhao', {
                strThi_DanhSachThi_TuiBai_Id: row.ID, strNguoiDangKy_Id: sv, strLyDoDangKy: ''
            }).then(function () {
                ui.toast('Đăng ký thành công', 'ok');
                dlg.close();
                tai();
            }).catch(function (err) { ums.api.handle(err, 'đăng ký phúc khảo'); });
        }
        function huy() {
            ui.confirm('Hủy đăng ký phúc khảo học phần này?', { tone: 'bad', ok: 'Hủy đăng ký', title: 'Xác nhận hủy' }).then(function (yes) {
                if (!yes) return;
                return call('CTQ4BSAvJgo4ESk0IgopIC4P', 'HuyDangKyPhucKhao', {
                    strThi_DanhSachThi_TuiBai_Id: row.ID, strNguoiHuyDangKy_Id: sv, strLyDoHuyDangKy: ''
                }).then(function () {
                    ui.toast('Hủy đăng ký thành công!', 'ok');
                    dlg.close();
                    tai();
                });
            }).catch(function (err) { ums.api.handle(err, 'hủy đăng ký phúc khảo'); });
        }
    }

    /* ---------- Sự kiện ----------------------------------------------------- */
    if (window.jQuery) jQuery(f('tg')).on('select2:select select2:clear', tai);
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-dk]');
        if (b) { var row = ds[Number(b.getAttribute('data-dk'))]; if (row) hopDangKy(row); return; }
        if (ev.target.closest('[data-a="search"]')) tai();
    });
    tai();
})();
