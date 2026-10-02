/* =========================================================================
   Ma trận "buổi học × giảng viên" — khoa duyệt buổi học thực tế
   ums.lg.maTranBuoi(host, { ts, nguoiThucHien, sua }) → { tai(), luu() }
   Bản gốc: duyetbuoihoc.js (có Lưu) và hộp "Duyệt buổi học" của khoiluongcanhan.js
   (chép lại, chỉ xem) — cùng một đoạn mã.
   ---------------------------------------------------------------------------
   ts = { strKLGD_KeHoachChitiet_Id, strDaoTao_HocPhan_Id, strDaoTao_LopHocPhan_Id } (chép nguyên tên)
   Lời gọi (kiểu cũ):
       TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP (GET)     các giảng viên → nhóm cột
       TKGG_KeHoach/LayDSDuLieuLichGiangDuyet (GET)      các buổi → dòng
       TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG (GET)       MỖI Ô (buổi × giảng viên) một lời gọi, như gốc
       TKGG_XacNhan/Them_KLGD_QuanLy_XacNhan (POST)      Lưu — strLoaiXacNhan_Id KHOA_XACNHAN_BUOIDAY,
                                                         strDuLieuXacNhan = DAOTAO_LOPHOCPHAN_ID + GV + NGAY + TIETBATDAU + TIETKETTHUC (ghép liền)
   Không chép (lỗi rõ của bản gốc):
     · Lưu gửi MỌI ô đánh dấu có trên bảng, ô chưa từng xác nhận mà để trống
       bị ghi thành "Không đồng ý". Ở đây chỉ gửi ô ĐÃ ĐỔI so với lúc nạp.
     · Không có ô nào thì thanh tiến độ không bao giờ xong → không nạp lại.
     · "Tổng số tiết" chỉ tính lúc nạp, đánh dấu thêm không cộng lại; ở hộp của
       khoiluongcanhan dòng tổng không bao giờ hiện (vùng tiến độ không tồn tại).
       Ở đây tính lại mỗi lần đổi.
     · Hộp của khoiluongcanhan có ô đánh dấu trông như sửa được nhưng không có
       nút lưu — ở đây ô bị khoá (chỉ xem).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var lg = ums.lg = ums.lg || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    lg.maTranBuoi = function (host, o) {
        var gv = [], ds = [], goc = {};
        function nth() { return o.nguoiThucHien ? o.nguoiThucHien() : uid(); }
        function goi(m, x) { return ums.api.call(Object.assign({ action: 'TKGG_KeHoach/' + m, method: 'GET' }, o.ts(), { strNguoiThucHien_Id: nth() }, x || {})); }
        function ten(g) { return e(g.NGUOIDUNG_HODEM) + ' ' + e(g.NGUOIDUNG_TEN) + ' - ' + e(g.NGUOIDUNG_MASO); }
        function khoa(r, g) { return r.ID + '|' + g.ID; }

        function tai() {
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            goc = {};
            return goi('LayDSGVLichGiangKLGDTheoHP').then(function (r) {
                gv = arr(r.data);
                return goi('LayDSDuLieuLichGiangDuyet');
            }).then(function (r) {
                ds = arr(r.data);
                ve();
                return Promise.all([].concat.apply([], ds.map(function (row) { return gv.map(function (g) { return o1(row, g); }); }))).then(tong);
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'dữ liệu duyệt buổi học'); });
        }
        function o1(row, g) {
            return ums.api.call({ action: 'TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG', method: 'GET', silent: true, strNguoiDung_Id: g.ID, strKLGD_DuLieu_LichGiang_Id: row.ID,
                strKLGD_KeHoachChitiet_Id: e(row.KLGD_KEHOACHCHITIET_ID), strNguoiThucHien_Id: nth() }).then(function (x) {
                var k = arr(x.data)[0] || {}, id = khoa(row, g);
                var c = host.querySelector('[data-o="' + id + '"]'), xn = host.querySelector('[data-xn="' + id + '"]'), tt = host.querySelector('[data-tt="' + id + '"]');
                var dong = String(e(k.XACNHANDONGY_KHONGDONGY)) === '1';
                if (c && String(e(k.COLICH)) !== '0') {
                    c.innerHTML = '<input type="checkbox" data-mt="' + esc(id) + '" data-gv="' + esc(g.ID) + '"' + (dong ? ' checked' : '') + (o.sua ? '' : ' disabled') + '>';
                    goc[id] = dong;
                }
                var v = String(e(k.XACNHANDONGY_KHONGDONGY));
                if (xn) xn.innerHTML = v === '1' ? '<i class="fa-solid fa-circle-check lg-mt__ok" title="Đồng ý"></i>' : v === '0' ? '<i class="fa-solid fa-circle-xmark lg-mt__bad" title="Không đồng ý"></i>' : '';
                var d = String(e(k.TINHTRANGDIEMDANH));
                if (tt) tt.textContent = d === '1' ? 'Có điểm danh' : d === '0' ? 'Không điểm danh' : '';
            }).catch(function () {});
        }
        function ve() {
            var cot = [
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
                { title: 'Tên lớp', prop: 'TENLOP' },
                { title: 'Ngày học', prop: 'NGAY', cls: 'is-center is-nowrap' },
                { title: 'Thứ học', prop: 'THU', cls: 'is-center' },
                { title: 'Số tiết (Bắt đầu > kết thúc)', cls: 'is-center', render: function (r) { return esc(e(r.SOTIET) + ' (' + e(r.TIETBATDAU) + ' -> ' + e(r.TIETKETTHUC) + ')'); } }
            ];
            gv.forEach(function (g) {
                var G = [ten(g)];
                cot.push(
                    { head: o.sua ? '<input type="checkbox" data-mtall="' + esc(g.ID) + '" title="Chọn tất cả">' : '', group: G, cls: 'is-center lg-mt__o', width: '44px',
                      render: function (r) { return '<div data-o="' + esc(khoa(r, g)) + '"></div>'; } },
                    { title: 'Xác nhận', group: G, cls: 'is-center lg-mt__xn', render: function (r) { return '<span data-xn="' + esc(khoa(r, g)) + '"></span>'; } },
                    { title: 'Tình trạng', group: G, cls: 'is-center lg-mt__tt', render: function (r) { return '<span data-tt="' + esc(khoa(r, g)) + '"></span>'; } });
            });
            ui.table({ el: host, rows: ds, empty: 'Không có dữ liệu', columns: cot });
            if (!ds.length || !gv.length) return;
            var tb = host.querySelector('table'), tf = document.createElement('tfoot');
            tf.innerHTML = '<tr class="ums-table__sum"><td colspan="6"></td>' + gv.map(function (g) { return '<td colspan="3" class="is-center" data-sum="' + esc(g.ID) + '"></td>'; }).join('') + '</tr>';
            tb.appendChild(tf);
        }
        function tong() {
            gv.forEach(function (g) {
                var n = 0;
                Array.prototype.forEach.call(host.querySelectorAll('input[data-gv="' + g.ID + '"]:checked'), function (c) {
                    var r = ds.filter(function (x) { return x.ID === c.getAttribute('data-mt').split('|')[0]; })[0];
                    n += parseInt(r && r.SOTIET, 10) || 0;
                });
                var td = host.querySelector('[data-sum="' + g.ID + '"]');
                if (td) td.innerHTML = '<b>Tổng số tiết: ' + n + '</b>';
            });
        }
        host.addEventListener('change', function (ev) {
            var t = ev.target, all = t.getAttribute('data-mtall');
            if (all) Array.prototype.forEach.call(host.querySelectorAll('input[data-gv="' + all + '"]'), function (c) { c.checked = t.checked; });
            if (all || t.hasAttribute('data-mt')) tong();
        });
        function luu() {
            var doi = Array.prototype.filter.call(host.querySelectorAll('input[data-mt]'), function (c) { return c.checked !== !!goc[c.getAttribute('data-mt')]; });
            if (!doi.length) { ui.toast('Bạn chưa thay đổi gì dữ liệu.', 'info'); return Promise.resolve(); }
            return ui.batch(doi.map(function (c) {
                var p = c.getAttribute('data-mt').split('|'), r = ds.filter(function (x) { return x.ID === p[0]; })[0] || {};
                return { action: 'TKGG_XacNhan/Them_KLGD_QuanLy_XacNhan', method: 'POST', strLoaiXacNhan_Id: 'KHOA_XACNHAN_BUOIDAY', strHanhDong_Id: c.checked ? 1 : 0,
                    strNguoiXacNhan_Id: uid(), strThongTinXacNhan: '', strDuLieuXacNhan: e(r.DAOTAO_LOPHOCPHAN_ID) + p[1] + e(r.NGAY) + e(r.TIETBATDAU) + e(r.TIETKETTHUC),
                    strNguoiThucHien_Id: uid() };
            }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true }).then(tai);
        }
        return { tai: tai, luu: luu };
    };
})();
