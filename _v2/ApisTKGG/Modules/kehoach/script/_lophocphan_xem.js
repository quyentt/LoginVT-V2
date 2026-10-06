/* =========================================================================
   tkggLHP (tiếp) — hai khung THAY CHỖ màn + hai hộp thoại xem / sửa một ô của màn "Xác định phạm vi dữ liệu lớp HP".
   ---------------------------------------------------------------------------
   L.duyetBuoiHoc({ host, row }) — khung "Duyệt buổi học" (gốc zoneDuyetBuoiHoc toggle_overide):
     Giảng viên có lịch:   TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP (GET) — strKLGD_KeHoachChitiet_Id = KLGD_KEHOACHCHITIET_ID,
                           strDaoTao_HocPhan_Id = DAOTAO_HOCPHAN_ID, strDaoTao_LopHocPhan_Id = DULIEUXACNHAN (của dòng lớp HP)
                           → ID, NGUOIDUNG_HODEM, NGUOIDUNG_TEN, NGUOIDUNG_MASO (mỗi GV một nhóm 3 cột: ô đánh dấu · Xác nhận · Tình trạng)
     Buổi học:             TKGG_KeHoach/LayDSDuLieuLichGiangDuyet (GET) — cùng tham số → ID, MALOP, TENLOP, NGAY, THU, SOTIET,
                           TIETBATDAU, TIETKETTHUC, DAOTAO_LOPHOCPHAN_ID, KLGD_KEHOACHCHITIET_ID
     Từng ô (buổi × GV):   TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG (GET) — strNguoiDung_Id, strKLGD_DuLieu_LichGiang_Id = ID buổi,
                           strKLGD_KeHoachChitiet_Id → [0].COLICH ('0' = không vẽ ô đánh dấu), XACNHANDONGY_KHONGDONGY ('1' ✓ / '0' ✗),
                           TINHTRANGDIEMDANH ('1' Có điểm danh / '0' Không điểm danh). Hàng đợi 6 luồng.
     Lưu: MỌI ô đánh dấu đang vẽ (gốc .checkdata) một lời gọi TKGG_XacNhan/Them_KLGD_QuanLy_XacNhan (POST) — strLoaiXacNhan_Id
          'KHOA_XACNHAN_BUOIDAY', strHanhDong_Id 1 / 0 theo ô, strNguoiXacNhan_Id = người dùng, strThongTinXacNhan '',
          strDuLieuXacNhan = DAOTAO_LOPHOCPHAN_ID + GV_ID + NGAY + TIETBATDAU + TIETKETTHUC (nối chuỗi như gốc) → nạp lại khung.
     Chân bảng: tổng SOTIET + mỗi GV "Tổng số tiết: Σ SOTIET của ô đang đánh dấu" (gốc tính sau khi mọi ô về; nay tính lại ngay
     khi bấm ô — Khác gốc nhỏ). Ô "chọn tất cả" ở đầu mỗi nhóm GV như gốc (chkSelectAll_<GV>).
   L.khoiLuongCaNhan({ host, row, gvId, gvTen, ten }) — khung "Khối lượng cá nhân" (gốc zoneKhoiLuongCaNhan):
     TKGG_KeHoach/LayDSDuLieuKLCaNhan (GET) — strKLGD_KeHoachChitiet_Id, strNguoiThucHien_Id = ID GIẢNG VIÊN (gửi tường minh,
       không để hệ chèn người đăng nhập) → bảng 15 cột như gốc; dòng tổng Số SV · Số lượng · Giờ chuẩn.
     Nút báo cáo zonebtnBaoCao_LopHocPhan2 → ums.report.mount (các cặp addKeyValue như gốc, o.collect do màn chính cấp).
     Chi tiết một dòng → L.chiTiet(row, gvId): TKGG_ThongTin/LayDSDuLieu_ChiTiet (GET) — strKLGD_KeHoachChiTiet_Id, strLoai = LOAI,
       strId = ID, strNguoiThucHien_Id = ID giảng viên → { rs, rsThanhPhanCongThuc[{ ID, TUKHOA, TENTUKHOA, XAUCONGTHUC }] };
       cột theo LOAI (KLGD_DULIEU_LICHGIANG / LAMSAN / DOANKHOALUAN / HOIDONG) + nhóm cột công thức, từng ô
       TKGG_ThongTin/LayGiaTriTuKhoa (GET) — strTuKhoa, strKLGD_DuLieu_Loai_Id = ID dòng → [0].GIATRITUKHOA. Hộp thoại (việc xem).
   L.apDat(id, onXong) — hộp "Cập nhật số lượng áp đặt" (một ô): NS_KLGD_KeHoach_MH/DSA4FRUKDQYFHgU0DSgkNAPP ·
       PKG_KLGV_V2_KEHOACH.LayTTKLGD_DuLieu — strId → DULIEUXACNHAN_MA, DULIEUXACNHAN_TEN, QUYMO, SOLUONGAPDAT;
       Lưu: NS_KLGD_KeHoach_MH/EjQgHgoNBgUeBTQNKCQ0HhIuDTQuLyYP · PKG_KLGV_V2_KEHOACH.Sua_KLGD_DuLieu_SoLuong — strId, dSoLuongApDat.
   Khác gốc: Số lượng áp đặt phải là số (gốc gửi nguyên chuỗi); lưu xong nạp lại danh sách để cột Số lượng cập nhật (gốc không).
     Khối lượng cá nhân: dòng tổng không cộng cột "Vai trò" (gốc insertSumAfterTable cột 10 là chữ); nút "Duyệt buổi học" trong bảng
     giữ nguyên + disabled (gốc không gắn xử lý cho bảng này).
   Cố ý bỏ: hai dòng "Mã nhân sự" / "Thuộc đơn vị" (lblMaSo, lblDonVi — gốc không bao giờ điền); case LOAI
     "KLGD_DULIEU_DOANKHOALUAN" thứ hai trong viewForm (trùng khoá, không bao giờ chạy); lblModalLable (không có trên html);
     getData_SoTiet / lblSoTiet (gốc đã ghi chú, cột Tổng tiết xác nhận lấy thẳng TONGSOTIETGIANGXACNHAN).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var L = ums.tkggLHP = ums.tkggLHP || {};
    var e = T.e, arr = T.arr, esc = ui.esc, uid = T.uid;

    /* Hàng đợi N luồng cho các lời gọi từng ô; bỏ lượt khi khung đã nạp lại */
    function hangDoi(viec, n, xong, conHieuLuc) {
        var k = 0, dang = 0;
        function chay() {
            if (!conHieuLuc()) return;
            if (k >= viec.length) { if (!dang) xong(); return; }
            dang++;
            viec[k++]().then(function () { dang--; chay(); }, function () { dang--; chay(); });
        }
        for (var i = 0; i < n; i++) chay();
    }

    /* =====================================================================
       Duyệt buổi học
       ===================================================================== */
    L.duyetBuoiHoc = function (o) {
        var row = o.row;
        var dlg = pat.formTrang({ host: o.host, title: 'Duyệt buổi học', icon: 'fa-circle-check', cols: 1, flush: true,
            body: '<div class="ums-kv ums-kv--dam ums-u-mb-4" style="padding:0 var(--ums-sp-4)"><span>Lớp học phần</span><b>' + esc(e(row.DAOTAO_LOPHOCPHAN_TEN)) + ' — ' + esc(e(row.DAOTAO_HOCPHAN_TEN)) + '</b></div>' +
                '<div data-db="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }] });
        var B = dlg.body, bang = B.querySelector('[data-db="bang"]'), luot = 0, gvs = [], ds = [];
        var tham = { strKLGD_KeHoachChitiet_Id: e(row.KLGD_KEHOACHCHITIET_ID), strDaoTao_HocPhan_Id: e(row.DAOTAO_HOCPHAN_ID), strDaoTao_LopHocPhan_Id: e(row.DULIEUXACNHAN) };

        function tinhTong() {
            gvs.forEach(function (g) {
                var s = 0;
                Array.prototype.forEach.call(bang.querySelectorAll('input[data-ck$="|' + g.ID + '"]:checked'), function (c) { s += Number(c.getAttribute('data-sotiet')) || 0; });
                var oSum = bang.querySelector('[data-sum="' + g.ID + '"]');
                if (oSum) oSum.textContent = 'Tổng số tiết: ' + s;
            });
        }
        bang.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[type="checkbox"]')) return;
            if (t.hasAttribute('data-ckall')) {
                var g = t.getAttribute('data-ckall');
                Array.prototype.forEach.call(bang.querySelectorAll('input[data-ck$="|' + g + '"]'), function (c) { c.checked = t.checked; });
            }
            tinhTong();
        });

        function tai() {
            var sh = ++luot;
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call(Object.assign({ action: 'TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP', method: 'GET' }, tham)).then(function (r1) {
                gvs = arr(r1.data);
                return ums.api.call(Object.assign({ action: 'TKGG_KeHoach/LayDSDuLieuLichGiangDuyet', method: 'GET' }, tham));
            }).then(function (r2) {
                if (sh !== luot) return;
                ds = arr(r2.data);
                ve(sh);
            }).catch(function (err) { if (sh !== luot) return; bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'duyệt buổi học'); });
        }
        function ve(sh) {
            var cot = [
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' },
                { title: 'Ngày học', prop: 'NGAY', cls: 'is-center is-nowrap' }, { title: 'Thứ học', prop: 'THU', cls: 'is-center' },
                { title: 'Số tiết (Bắt đầu > kết thúc)', cls: 'is-center is-nowrap', sumProp: 'SOTIET', sum: true,
                    render: function (x) { return esc(e(x.SOTIET)) + ' (' + esc(e(x.TIETBATDAU)) + ' -> ' + esc(e(x.TIETKETTHUC)) + ')'; } }];
            gvs.forEach(function (g) {
                var nhom = [(e(g.NGUOIDUNG_HODEM) + ' ' + e(g.NGUOIDUNG_TEN)).trim() + ' - ' + e(g.NGUOIDUNG_MASO)];
                cot.push(
                    { head: '<input type="checkbox" data-ckall="' + esc(e(g.ID)) + '" title="Chọn tất cả">', title: '', group: nhom, cls: 'is-center', giuCho: true,
                        render: function (x) { return '<span data-dc="' + esc(e(x.ID)) + '|' + esc(e(g.ID)) + '"></span>'; },
                        sum: function () { return '<b data-sum="' + esc(e(g.ID)) + '"></b>'; } },
                    { title: 'Xác nhận', group: nhom, cls: 'is-center', render: function (x) { return '<span data-xn="' + esc(e(x.ID)) + '|' + esc(e(g.ID)) + '"></span>'; } },
                    { title: 'Tình trạng', group: nhom, cls: 'is-center is-nowrap', render: function (x) { return '<span data-tt="' + esc(e(x.ID)) + '|' + esc(e(g.ID)) + '"></span>'; } });
            });
            ui.table({ el: bang, rows: ds, columns: cot, stt: true, empty: 'Không có buổi học nào' });
            if (!ds.length || !gvs.length) return;
            var viec = [], baoLoi = false;
            ds.forEach(function (b) {
                gvs.forEach(function (g) {
                    viec.push(function () {
                        return ums.api.call({ action: 'TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG', method: 'GET', silent: true, strNguoiDung_Id: e(g.ID),
                            strKLGD_DuLieu_LichGiang_Id: e(b.ID), strKLGD_KeHoachChitiet_Id: e(b.KLGD_KEHOACHCHITIET_ID) }).then(function (r) {
                            if (sh !== luot) return;
                            var x = arr(r.data)[0]; if (!x) return;
                            var k = e(b.ID) + '|' + e(g.ID);
                            var oDc = bang.querySelector('[data-dc="' + k + '"]'), oXn = bang.querySelector('[data-xn="' + k + '"]'), oTt = bang.querySelector('[data-tt="' + k + '"]');
                            if (oDc && e(x.COLICH) !== '0') oDc.innerHTML = '<input type="checkbox" data-ck="' + esc(k) + '" data-sotiet="' + esc(e(b.SOTIET)) + '"' + (e(x.XACNHANDONGY_KHONGDONGY) === '1' ? ' checked' : '') + '>';
                            if (oXn) oXn.innerHTML = e(x.XACNHANDONGY_KHONGDONGY) === '1' ? '<i class="fa-light fa-circle-check ums-u-blue"></i>' : e(x.XACNHANDONGY_KHONGDONGY) === '0' ? '<i class="fa-light fa-circle-xmark ums-u-danger"></i>' : '';
                            if (oTt) oTt.textContent = e(x.TINHTRANGDIEMDANH) === '1' ? 'Có điểm danh' : e(x.TINHTRANGDIEMDANH) === '0' ? 'Không điểm danh' : '';
                        }).catch(function (err) { if (sh !== luot || baoLoi) return; baoLoi = true; ums.api.handle(err, 'kết quả xác nhận buổi học'); });
                    });
                });
            });
            hangDoi(viec, 6, tinhTong, function () { return sh === luot; });
        }
        function luu() {
            var o = Array.prototype.map.call(bang.querySelectorAll('input[data-ck]'), function (c) {
                var p = c.getAttribute('data-ck').split('|'), b = ds.find(function (x) { return e(x.ID) === p[0]; });
                if (!b) return null;
                return { action: 'TKGG_XacNhan/Them_KLGD_QuanLy_XacNhan', method: 'POST', strLoaiXacNhan_Id: 'KHOA_XACNHAN_BUOIDAY', strHanhDong_Id: c.checked ? 1 : 0,
                    strNguoiXacNhan_Id: uid(), strThongTinXacNhan: '', strDuLieuXacNhan: e(b.DAOTAO_LOPHOCPHAN_ID) + p[1] + e(b.NGAY) + e(b.TIETBATDAU) + e(b.TIETKETTHUC) };
            }).filter(Boolean);
            if (!o.length) { ui.toast('Không có buổi học nào để duyệt', 'warn'); return; }
            ui.batch(o, { title: 'Đang duyệt ' + o.length + ' buổi học', okText: 'Xác nhận thành công', show: true }).then(function () { tai(); });
        }
        tai();
        return dlg;
    };

    /* =====================================================================
       Khối lượng cá nhân
       ===================================================================== */
    L.khoiLuongCaNhan = function (o) {
        var row = o.row;
        var dlg = pat.formTrang({ host: o.host, title: 'Khối lượng cá nhân', icon: 'fa-user-clock', cols: 1, flush: true,
            body: '<div class="ums-row ums-row--between ums-u-mb-4" style="padding:0 var(--ums-sp-4)"><div class="ums-kv ums-kv--dam"><span>Họ và tên</span><b>' + esc(e(o.gvTen)) + '</b></div><div data-kl="bc"></div></div>' +
                '<div data-kl="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var B = dlg.body, bang = B.querySelector('[data-kl="bang"]'), ds = [];
        if (o.collect) ums.report.mount(B.querySelector('[data-kl="bc"]'), { collect: o.collect, import: false });
        ums.api.call({ action: 'TKGG_KeHoach/LayDSDuLieuKLCaNhan', method: 'GET', strKLGD_KeHoachChitiet_Id: e(row.KLGD_KEHOACHCHITIET_ID), strNguoiThucHien_Id: e(o.gvId) }).then(function (r) {
            ds = arr(r.data);
            ui.table({ el: bang, rows: ds, stt: true, empty: 'Không có dữ liệu', columns: [
                { title: 'Chi tiết', cls: 'is-center', render: function (x) { return ui.iconBtn('view', e(x.ID)); } },
                { title: 'Duyệt buổi học', cls: 'is-center is-nowrap', render: function () { return ui.btn('confirm', { text: 'Duyệt buổi học', cls: 'ums-btn--sm', attr: { disabled: 'disabled', title: 'Bản gốc không gắn xử lý cho nút này' } }); } },
                { title: 'Thông tin bậc hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
                { title: 'Học kỳ', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
                { title: 'Đơn vị', prop: 'DONVI_PHUTRACH_HOCPHAN_TEN', cls: 'is-center' },
                { title: 'Thông tin dữ liệu tính khối lượng', prop: 'TENLOP' },
                { title: 'Tổng TC/LT/TH', prop: 'TONGPHANBO', cls: 'is-center is-nowrap' },
                { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
                { title: 'Số SV', prop: 'QUYMO', cls: 'is-center', sum: true },
                { title: 'Vai trò', prop: 'VAITRO_TEN' },
                { title: 'Số lượng (Số tiết|Số ngày)', prop: 'SOLUONG', cls: 'is-center', sum: true },
                { title: 'Giờ chuẩn quy đổi', prop: 'SOGIOCHUAN', cls: 'is-center', sum: true },
                { title: 'Tình trạng xác nhận', prop: 'TINHTRANGXACNHAN_TEN', cls: 'is-center' },
                { title: 'Ghi chú', prop: 'GHICHU' }] });
        }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối lượng cá nhân'); });
        bang.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-act="view"]'); if (!b) return;
            var x = ds.find(function (d) { return e(d.ID) === b.getAttribute('data-id'); });
            if (x) L.chiTiet(x, o.gvId);
        });
        return dlg;
    };

    /* ---------- Hộp xem dữ liệu chi tiết một dòng khối lượng ---------- */
    var COT_LOAI = {
        KLGD_DULIEU_LICHGIANG: [['Ngày học', 'NGAY', 'is-center is-nowrap'], ['Tiết bắt đầu', 'TIETBATDAU', 'is-center'], ['Tiết kết thúc', 'TIETKETTHUC', 'is-center'], ['Số tiết', 'SOLUONG', 'is-center'],
            ['Số sinh viên', 'QUYMO', 'is-center'], ['Học phần', 'HP'], ['Lớp học phần', 'DAOTAO_LOPHOCPHAN_TEN'], ['Giờ chuẩn', 'GIOCHUAN', 'is-center']],
        KLGD_DULIEU_LAMSAN: [['Ngày đi', 'NGAY', 'is-center is-nowrap'], ['Số ngày', 'SOLUONG', 'is-center'], ['Số sinh viên', 'QUYMO', 'is-center'], ['Số tín chỉ', 'SOTINCHIHOCPHAN', 'is-center'],
            ['Học phần', 'HP'], ['Lớp học phần', 'DAOTAO_LOPHOCPHAN_TEN'], ['Giờ chuẩn', 'GIOCHUAN', 'is-center']],
        KLGD_DULIEU_DOANKHOALUAN: [['Số sinh viên', 'QUYMO', 'is-center'], ['Số tín chỉ', 'SOTINCHIHOCPHAN', 'is-center'], ['Học phần', 'HP'], ['Lớp học phần', 'DAOTAO_LOPHOCPHAN_TEN'], ['Giờ chuẩn', 'GIOCHUAN', 'is-center']],
        KLGD_DULIEU_HOIDONG: [['Giờ chuẩn', 'GIOCHUAN', 'is-center']]
    };
    L.chiTiet = function (row, gvId) {
        var dlg = ui.dialog({ title: 'Dữ liệu' + (e(row.GHICHU) ? ': ' + e(row.GHICHU) : ''), icon: 'fa-server', size: 'xl', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
        ums.api.call({ action: 'TKGG_ThongTin/LayDSDuLieu_ChiTiet', method: 'GET', strKLGD_KeHoachChiTiet_Id: e(row.KLGD_KEHOACHCHITIET_ID), strLoai: e(row.LOAI), strId: e(row.ID), strNguoiThucHien_Id: e(gvId) }).then(function (r) {
            if (dlg.closed) return;
            var d = r.data || {}, rs = arr(d.rs), tp = arr(d.rsThanhPhanCongThuc);
            var cot = (COT_LOAI[e(row.LOAI)] || []).map(function (c) {
                if (c[1] === 'HP') return { title: c[0], render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } };
                return { title: c[0], prop: c[1], cls: c[2] || '' };
            });
            var nhom = tp.length ? [e(tp[0].XAUCONGTHUC)] : null;
            tp.forEach(function (t) {
                cot.push({ title: e(t.TENTUKHOA), group: nhom, cls: 'is-center', render: function (x) { return '<span data-kq="' + esc(e(x.ID)) + '|' + esc(e(t.ID)) + '"></span>'; } });
            });
            ui.table({ el: dlg.body, rows: rs, columns: cot, stt: true, empty: 'Không có dữ liệu' });
            var viec = [], baoLoi = false;
            rs.forEach(function (x) {
                tp.forEach(function (t) {
                    viec.push(function () {
                        return ums.api.call({ action: 'TKGG_ThongTin/LayGiaTriTuKhoa', method: 'GET', silent: true, strTuKhoa: e(t.TUKHOA), strKLGD_DuLieu_Loai_Id: e(x.ID) }).then(function (r2) {
                            var v = arr(r2.data)[0], oKq = dlg.body.querySelector('[data-kq="' + e(x.ID) + '|' + e(t.ID) + '"]');
                            if (v && oKq) oKq.textContent = e(v.GIATRITUKHOA);
                        }).catch(function (err) { if (baoLoi) return; baoLoi = true; ums.api.handle(err, 'giá trị từ khoá'); });
                    });
                });
            });
            hangDoi(viec, 6, function () {}, function () { return !dlg.closed; });
        }).catch(function (err) { dlg.body.innerHTML = ui.fail(err.message); ums.api.handle(err, 'dữ liệu chi tiết'); });
        return dlg;
    };

    /* ---------- Hộp "Cập nhật số lượng áp đặt" (một ô) ---------- */
    L.apDat = function (id, onXong) {
        var dlg = ui.dialog({ title: 'Cập nhật số lượng áp đặt', icon: 'fa-pen-to-square', size: 'sm',
            body: '<div class="ums-stack ums-stack--tight">' +
                '<div class="ums-kv"><span>Mã</span><b data-ad="ma"></b></div><div class="ums-kv"><span>Tên</span><b data-ad="ten"></b></div>' +
                '<div class="ums-kv"><span>Quy mô</span><b data-ad="qm"></b></div></div>' +
                ui.field('Số lượng', '<input class="ums-input" type="number" step="any" data-ad="sl" autocomplete="off">', { required: true }),
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); return false; } }] });
        var q = function (k) { return dlg.body.querySelector('[data-ad="' + k + '"]'); };
        ums.api.call({ action: 'NS_KLGD_KeHoach_MH/DSA4FRUKDQYFHgU0DSgkNAPP', func: 'PKG_KLGV_V2_KEHOACH.LayTTKLGD_DuLieu', strId: e(id) }).then(function (r) {
            var x = arr(r.data)[0] || {};
            q('ma').textContent = e(x.DULIEUXACNHAN_MA); q('ten').textContent = e(x.DULIEUXACNHAN_TEN); q('qm').textContent = e(x.QUYMO); q('sl').value = e(x.SOLUONGAPDAT);
        }).catch(function (err) { ums.api.handle(err, 'thông tin dữ liệu'); });
        function luu() {
            var sl = q('sl').value.trim();
            if (sl === '' || isNaN(Number(sl))) { ui.toast('Số lượng áp đặt phải là số', 'warn'); q('sl').focus(); return; }
            ums.api.call({ action: 'NS_KLGD_KeHoach_MH/EjQgHgoNBgUeBTQNKCQ0HhIuDTQuLyYP', func: 'PKG_KLGV_V2_KEHOACH.Sua_KLGD_DuLieu_SoLuong', strId: e(id), dSoLuongApDat: sl }).then(function () {
                ui.toast('Cập nhật thành công!', 'ok'); dlg.close(); if (onXong) onXong();
            }).catch(function (err) { ums.api.handle(err, 'cập nhật số lượng áp đặt'); });
        }
        return dlg;
    };
})();
