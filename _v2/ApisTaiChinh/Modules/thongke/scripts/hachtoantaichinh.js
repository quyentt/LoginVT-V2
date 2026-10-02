/* =========================================================================
   Hạch toán tài chính
   Bản gốc: ApisTaiChinh/Modules/thongke/scripts/hachtoantaichinh.js
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, GET, versionAPI v1.0, strKhoaHoc_Id ""):
       Tổng:    TC_ThongKe/LayTongHopNoChung · LayTongHopDuChung ·
                LayTongHopNoRieng · LayTongHopDuRieng
                → cộng cột TONGNO (dư thiếu) / TONGDU (dư thừa) trên mọi dòng
       Theo khoản: TC_ThongKe/LayTongHop{Du|No}{Chung|Rieng}TheoKhoan → TEN + TONGDU/TONGNO
       Theo đối tượng: TC_ThongKe/LayCTDuLieuDuNoChungRieng, phân trang máy chủ,
                strLoaiThongTin = taichinh_tonghop_{Du_chung|No_chung|Du_Rieng|No_Rieng}
                → MASO, HOVATEN, TAICHINH_CACKHOANTHU_TEN, SOTIEN

   Cố ý bỏ:
     · Dòng "Thời gian: 27/07/2018 - 20/08/2018" + nút tìm: chữ viết cứng,
       nút không có xử lý.
     · Cột "Chi tiết" trong bảng theo khoản: nút không gắn xử lý nào.
     · proSeqObj (cộng dồn bọc trong Promise): thay bằng phép cộng thường.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var tk = ums.thongke;
    var root = document.getElementById('hachtoantaichinh');
    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }

    /* Bốn ô: nhóm (chung/rieng) × loại (du = dư thừa / no = dư thiếu) */
    var BOX = {
        chung_du:  { zone: 'chung', label: 'Dư thừa', field: 'TONGDU', img: 'assets/img/thongke-chung-du.png',
                     tong: 'TC_ThongKe/LayTongHopDuChung', khoan: 'TC_ThongKe/LayTongHopDuChungTheoKhoan', user: 'taichinh_tonghop_Du_chung' },
        chung_no:  { zone: 'chung', label: 'Dư thiếu', field: 'TONGNO', img: 'assets/img/thongke-chung-no.png',
                     tong: 'TC_ThongKe/LayTongHopNoChung', khoan: 'TC_ThongKe/LayTongHopNoChungTheoKhoan', user: 'taichinh_tonghop_No_chung' },
        rieng_du:  { zone: 'rieng', label: 'Dư thừa', field: 'TONGDU', img: 'assets/img/thongke-rieng-du.png',
                     tong: 'TC_ThongKe/LayTongHopDuRieng', khoan: 'TC_ThongKe/LayTongHopDuRiengTheoKhoan', user: 'taichinh_tonghop_Du_Rieng' },
        rieng_no:  { zone: 'rieng', label: 'Dư thiếu', field: 'TONGNO', img: 'assets/img/thongke-rieng-no.png',
                     tong: 'TC_ThongKe/LayTongHopNoRieng', khoan: 'TC_ThongKe/LayTongHopNoRiengTheoKhoan', user: 'taichinh_tonghop_No_Rieng' }
    };
    var ORDER = ['chung_du', 'chung_no', 'rieng_du', 'rieng_no'];

    function drawBoxes() {
        ['chung', 'rieng'].forEach(function (zn) {
            z(zn).innerHTML = ORDER.filter(function (k) { return BOX[k].zone === zn; }).map(function (k) {
                var b = BOX[k];
                return '<div data-box="' + k + '">' + tk.stat({
                    value: b.sum || 0, label: b.label, img: b.img, tone: b.tone,
                    links: [
                        { act: 'khoan:' + k, text: 'Chi tiết theo khoản', icon: 'fa-memo-circle-info' },
                        { act: 'user:' + k, text: 'Chi tiết theo đối tượng', icon: 'fa-circle-user' }
                    ]
                }) + '</div>';
            }).join('');
        });
    }

    function loadTong(k) {
        var b = BOX[k];
        return ums.api.call({ action: b.tong, method: 'GET', versionAPI: 'v1.0', strKhoaHoc_Id: '' })
            .then(function (r) {
                b.sum = (Array.isArray(r.data) ? r.data : []).reduce(function (a, x) { return a + tk.num(x[b.field]); }, 0);
                drawBoxes();
            })
            .catch(function (err) { ums.api.handle(err, b.label); });
    }

    function showDetail(title) {
        z('detailTitle').textContent = title;
        z('detailTable').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ui.swap(z('list'), z('detail'), { top: false });
    }

    function title(k, kieu) {
        var b = BOX[k];
        return 'Chi tiết theo ' + kieu + ' — ' + b.label.toLowerCase() + ' các khoản ' + (b.zone === 'chung' ? 'chung' : 'riêng');
    }

    function openKhoan(k) {
        var b = BOX[k];
        showDetail(title(k, 'khoản'));
        ums.api.call({ action: b.khoan, method: 'GET', versionAPI: 'v1.0', strKhoaHoc_Id: '' })
            .then(function (r) {
                ui.table({
                    el: z('detailTable'),
                    rows: Array.isArray(r.data) ? r.data : [],
                    columns: [
                        { title: 'Khoản', prop: 'TEN' },
                        tk.moneyCol('Số tiền', b.field)
                    ]
                });
            })
            .catch(function (err) {
                z('detailTable').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'chi tiết theo khoản');
            });
    }

    function openUser(k) {
        showDetail(title(k, 'đối tượng'));
        tk.pagedTable(z('detailTable'), {
            where: 'chi tiết theo đối tượng',
            call: function () {
                return {
                    action: 'TC_ThongKe/LayCTDuLieuDuNoChungRieng',
                    method: 'GET',
                    versionAPI: 'v1.0',
                    strLoaiThongTin: BOX[k].user,
                    strKhoaHoc_Id: '',
                    strTAICHINH_CacKhoanThu_Id: '',
                    strNguoiThucHien_Id: '',
                    strTuKhoa: ''
                };
            },
            columns: [
                { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'HOVATEN' },
                { title: 'Khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                tk.moneyCol('Số tiền', 'SOTIEN')
            ]
        }).load(1);
    }

    root.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-act]');
        if (!btn) return;
        var act = btn.getAttribute('data-act');
        if (act === 'back') { ui.swap(z('detail'), z('list'), { top: false }); return; }
        if (act === 'reload') { napTong(); return; }
        var p = act.split(':');
        if (p[0] === 'khoan') openKhoan(p[1]);
        else if (p[0] === 'user') openUser(p[1]);
    });

    /* Bản gốc gọi theo thứ tự: Nợ chung, Dư chung, Nợ riêng, Dư riêng */
    function napTong() {
        tk.thoiDiem(z('tinhDen'));
        ['chung_no', 'chung_du', 'rieng_no', 'rieng_du'].forEach(loadTong);
    }

    drawBoxes();
    napTong();
})();
