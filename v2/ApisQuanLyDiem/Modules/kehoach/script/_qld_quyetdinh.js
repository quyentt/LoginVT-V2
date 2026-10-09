/* =========================================================================
   Kế hoạch công nhận điểm — vùng "Thông tin quyết định" (#zoneQuyetDinh của gốc, nút "Xem" ở cột
   "Quyết định")
   Bản gốc: ApisQuanLyDiem/Modules/kehoach/script/kehoach.js
       getList_QuyetDinh · getList_LoaiQuyetDinh · save_QuyetDinh (hộp #myModalAddQuyetDinh)
       getList_QDNguoiHoc · genTable_QDNguoiHoc · getList_SVChuaQD · save_QDNguoiHoc (hộp #myModalSVChuaQD)
       save_TaoDSDiem · save_ChuyenDiem · save_TinhPhi · delete_TinhPhi
   ---------------------------------------------------------------------------
   ums.qldKh.taoQuyetDinh(zone, { onClose }) → { mo(dòng kế hoạch) }

   Lời gọi (chép nguyên):
     SV_QuyetDinh_MH/DSA4BRIQDRIXHhA0OCQ1BSgvKQPP  pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh
         strTuKhoa '' · strNamNhapHoc '' · strKhoaQuanLy_Id '' · strHeDaoTao_Id '' · strKhoaDaoTao_Id '' · strChuongTrinh_Id ''
         · strLopQuanLy_Id '' · strTrangThaiNguoiHoc_Id '' · strQLSV_NguoiHoc_Id '' · strLoaiQuyetDinh_Id '' · strCapQuyetDinh_Id ''
         · strDaoTao_ThoiGianDaoTao_Id '' · strNguoiTao_Id '' · strNguonDuLieu_Id = ID kế hoạch · pageIndex 1 · pageSize 1000000
         (ô Quyết định — hiện SOQUYETDINH)
     SV_QuyetDinh_MH/DSA4BRINLiAoEDQ4JDUFKC8p  pkg_hosohocvien_quyetdinh.LayDSLoaiQuyetDinh   strNguoiDung_Id = userId
     SV_QuyetDinh_MH/FSkkLB4QDRIXHhA0OCQ1BSgvKQPP  pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh
         strHinhThucQuyetDinh_Id '' · strLoaiQuyetDinh_Id · strSoQuyetDinh · strNgayQuyetDinh · strCapQuyetDinh_Id
         · strNgayHieuLuc · strNguyenNhan_LyDo · strDaoTao_ThoiGianDaoTao_Id · strNguonDuLieu_Id = ID kế hoạch
     SV_CongNhanDiem_MH/DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeEAUP  pkg_congthongtin_congnhandiem.LayDSKH_NguoiHoc_HP_Cap_QD
         strDiem_KeHoachCongNhan_Id · strQLSV_QuyetDinh_Id (ô Quyết định)
     SV_CongNhanDiem_MH/DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeAik0IBAF  …LayDSKH_NguoiHoc_HP_Cap_ChuaQD  strDiem_KeHoachCongNhan_Id
     SV_CND_ThongTin_MH/FSkkLB4QBR4FKCQsHg8JHgUoJCweAg8P  pkg_congthongtin_cnd_thongtin.Them_QD_Diem_NH_Diem_CN
         strId = ID dòng SV chưa QĐ · strQLSV_QuyetDinh_Id (mỗi dòng một lời gọi)
     D_PhanQuyen_MH/ESkgLxA0OCQvHhUgLgUSFSkkLhA0OCQ1BSgvKTdz  pkg_diem_phanquyen.PhanQuyen_TaoDSTheoQuyetDinhv2  strQLSV_QuyetDinh_Id
     D_PhanQuyen_MH/Aik0OCQvBSgkLAIuLyYPKSAvHhUpJC4QBQPP      pkg_diem_phanquyen.ChuyenDiemCongNhan_TheoQD      strQLSV_QuyetDinh_Id
     TC_TinhPhi_MH/FSgvKREpKA8mNC4oCS4i  pkg_taichinh_tinhphi.TinhPhiNguoiHoc   (mỗi dòng đã đánh dấu)
     TC_TinhPhi_MH/GS4gCiQ1EDQgBSAVKC8pESko  pkg_taichinh_tinhphi.XoaKetQuaDaTinhPhi (mỗi dòng đã đánh dấu; thêm
         strHeDaoTao_Id / strKhoaDaoTao_Id / strLopQuanLy_Id rỗng như gốc)
         strDangKy_KeHoachDangKy_Id '' · strNghiepVuApDung_Id · strQLSV_NguoiHoc_Id · strDaoTao_ThoiGianDaoTao_Id
         · strDaoTao_ChuongTrinh_Id · strKieuHoc_Id · strTaiChinh_CacKhoanThu_Id · strDaoTao_HocPhan_Id
         · strNguonDuLieu_Id = ID dòng · strPhantrammiengiamduyet '' · strQLSV_DoiTuong_Id '' · strDangKy_TrucTiep_LichSu_Id ''
   Danh mục: QLSV.CQD (Cấp quyết định); Học kỳ = pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao.

   Khác gốc:
     · "Thêm SV vào quyết định", "Thực hiện tạo danh sách điểm", "Chuyển điểm" bắt chọn Quyết định trước (gốc gửi
       strQLSV_QuyetDinh_Id rỗng — lời gọi vô nghĩa với procedure theo quyết định).
     · Bốn thao tác ghi hàng loạt (tạo danh sách điểm, chuyển điểm, tính phí, hủy tính phí) HỎI LẠI trước khi chạy
       (gốc chạy ngay). Tính phí / hủy tính phí xong nạp lại danh sách (gốc không nạp — cột "Phí phải nộp" đứng im).
     · "Nhập mới quyết định" (hộp #myModalAddQuyetDinh của gốc) nay là biểu mẫu TRONG TRANG (ums.pat.formTrang, thay chỗ khung
       quyết định — BO-CUC luật 1): lưu lỗi thì giữ biểu mẫu (gốc đóng hộp cả khi lỗi); ô ngày có lịch chọn.
     · "Hủy tính phí" là nút xoá theo dòng chọn (ums.ui.xoaChon — tự đếm, khoá khi chưa chọn).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var Q = ums.qldKh, K = Q.K, e = Q.e;

    Q.taoQuyetDinh = function (zone, o) {
        o = o || {};
        var kh = null, rows = [], loaiQD = null, thoiGian = null;

        zone.innerHTML = pat.panel({
            title: 'Thông tin quyết định', icon: 'fa-file-signature', count: 'n', cls: 'qldkh-qd',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body: '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" data-f="qd" data-ph="Chọn quyết định"><option value="">Chọn quyết định</option></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Tạo mới quyết định', mod: 'out-success', attr: { 'data-a': 'tao' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Thêm SV vào quyết định', mod: 'out-primary', icon: 'fa-paper-plane', attr: { 'data-a': 'themsv' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                '</div>' +
                '<div class="ums-row ums-u-mt-4 qldkh-qd__nut">' +
                    ui.btn('save', { text: 'Thực hiện tạo danh sách điểm', mod: 'out-warn', icon: 'fa-paper-plane', attr: { 'data-a': 'taods' } }) +
                    ui.btn('save', { text: 'Chuyển điểm', mod: 'out-warn', icon: 'fa-paper-plane', attr: { 'data-a': 'chuyen' } }) +
                    ui.btn('save', { text: 'Tính phí', mod: 'out-primary', icon: 'fa-calculator', attr: { 'data-a': 'tinhphi' } }) +
                    ui.xoaChon('input[data-qdq]', { sm: true, goc: '.qldkh-qd', text: 'Hủy tính phí', attr: { 'data-a': 'huyphi' } }) +
                '</div>' +
                '<div class="ums-u-mt-4" data-z="t"></div>'
        });
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        var fQD = zone.querySelector('[data-f="qd"]');
        ui.enhance(zone);
        K.ganChon(zone);
        var bang = Q.bang(z('t'), {
            empty: 'Không có dữ liệu',
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', cls: 'qldkh-ten', render: function (r) { return esc(K.hoTen(r)); } },
                { title: 'Chương trình', render: function (r) { return esc(e(r.DAOTAO_TOCHUCCHUONGTRINH_TEN) + '(' + e(r.DAOTAO_TOCHUCCHUONGTRINH_MA) + ')'); } },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Học phần', cls: 'qldkh-ten', render: function (r) { return esc(e(r.DAOTAO_HOCPHAN_TEN) + ' ' + e(r.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Khoa quản lý học phần', prop: 'DAOTAO_KHOAQUANLY_HP_TEN' },
                { title: 'Trường', prop: 'DAOTAO_KHOAQUANLY_HP_CHA_TEN' },
                { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' },
                { title: 'Số tín tính phí', prop: 'SOTINCHITINHPHI', cls: 'is-center' },
                { title: 'Điểm công nhận', prop: 'DIEM', cls: 'is-center' },
                { title: 'Điểm đã chuyển', prop: 'DIEMDACHUYEN', cls: 'is-center' },
                { title: 'Phí phải nộp', cls: 'is-right is-nowrap', render: function (r) { return r.PHIPHAINOP === null || r.PHIPHAINOP === undefined || r.PHIPHAINOP === '' ? '' : ui.money(r.PHIPHAINOP); } },
                K.cotChon('qdq')
            ]
        });

        function napQD(giu) {
            return ums.api.call({
                action: 'SV_QuyetDinh_MH/DSA4BRIQDRIXHhA0OCQ1BSgvKQPP', func: 'pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh',
                strTuKhoa: '', strChucNang_Id: '', strNamNhapHoc: '', strKhoaQuanLy_Id: '', strHeDaoTao_Id: '', strKhoaDaoTao_Id: '',
                strChuongTrinh_Id: '', strLopQuanLy_Id: '', strTrangThaiNguoiHoc_Id: '', strQLSV_NguoiHoc_Id: '',
                strLoaiQuyetDinh_Id: '', strCapQuyetDinh_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '',
                strNguonDuLieu_Id: kh.ID, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
            }).then(function (r) {
                Q.chon(fQD, K.ds(r), 'Chọn quyết định', 'SOQUYETDINH');
                if (giu !== undefined) Q.datGiaTri(fQD, giu);
            }).catch(function (err) { ums.api.handle(err, 'quyết định'); });
        }
        function tai() {
            K.dang(z('t'));
            ums.api.call({
                action: Q.CN + 'DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeEAUP', func: 'pkg_congthongtin_congnhandiem.LayDSKH_NguoiHoc_HP_Cap_QD',
                strDiem_KeHoachCongNhan_Id: kh.ID, strQLSV_QuyetDinh_Id: fQD.value, strNguoiThucHien_Id: ''
            }).then(function (r) {
                rows = K.ds(r);
                z('n').textContent = '(' + rows.length + ')';
                bang.ve(rows);
            }).catch(function (err) { K.loi(z('t'), err, 'người học theo quyết định'); });
        }
        function canQD() {
            if (fQD.value) return true;
            ui.toast('Vui lòng chọn quyết định!', 'warn');
            return false;
        }
        function hoi(msg) { return ui.confirm(msg, { title: 'Xác nhận thực hiện', ok: 'Thực hiện' }); }

        /* ---------- Biểu mẫu "Nhập mới quyết định" — TRONG TRANG (BO-CUC luật 1): thay chỗ khung "Thông tin quyết định"
           (zone đã là khung thay chỗ danh sách kế hoạch → biểu mẫu là tầng hai, nút Đóng của khung ngoài ẩn theo) ---------- */
        function taoQD() {
            var dlg = pat.formTrang({
                host: zone, title: 'Nhập mới quyết định', icon: 'fa-plus',
                body:
                    ui.field('Loại quyết định', '<select class="ums-select" data-x="loai" data-ph="Chọn loại quyết định"><option value=""></option></select>') +
                    ui.field('Cấp quyết định', '<select class="ums-select" data-x="cap" data-ph="Chọn cấp quyết định"><option value=""></option></select>') +
                    ui.field('Học kỳ', '<select class="ums-select" data-x="tg" data-ph="Chọn học kỳ"><option value=""></option></select>') +
                    ui.field('Số quyết định', '<input class="ums-input" data-x="so" autocomplete="off">') +
                    ui.field('Ngày quyết định', '<input class="ums-input" data-x="ngay" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                    ui.field('Ngày hiệu lực', '<input class="ums-input" data-x="hl" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                    ui.field('Nội dung', '<input class="ums-input" data-x="mota" autocomplete="off">'),
                buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () {
                    ums.api.call({
                        action: 'SV_QuyetDinh_MH/FSkkLB4QDRIXHhA0OCQ1BSgvKQPP', func: 'pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh',
                        strHinhThucQuyetDinh_Id: '', strLoaiQuyetDinh_Id: x('loai').value, strSoQuyetDinh: x('so').value,
                        strNgayQuyetDinh: x('ngay').value, strCapQuyetDinh_Id: x('cap').value, strNgayHieuLuc: x('hl').value,
                        strNguyenNhan_LyDo: x('mota').value, strDaoTao_ThoiGianDaoTao_Id: x('tg').value,
                        strNguonDuLieu_Id: kh.ID, strNguoiThucHien_Id: ''
                    }).then(function () {
                        ui.toast('Thực hiện thành công', 'ok');
                        dlg.close();
                        napQD();
                    }).catch(function (err) { ums.api.handle(err, 'lưu quyết định'); });
                    return false;
                } }]
            });
            var B = dlg.body;
            function x(k) { return B.querySelector('[data-x="' + k + '"]'); }
            if (!loaiQD) loaiQD = ums.api.call({ action: 'SV_QuyetDinh_MH/DSA4BRINLiAoEDQ4JDUFKC8p', func: 'pkg_hosohocvien_quyetdinh.LayDSLoaiQuyetDinh',
                strNguoiDung_Id: ums.session.userId }).then(K.ds, function (err) { loaiQD = null; throw err; });
            loaiQD.then(function (d) { Q.chon(x('loai'), d, 'Chọn loại quyết định'); }).catch(function (err) { ums.api.handle(err, 'loại quyết định'); });
            ums.api.dm('QLSV.CQD').then(function (d) { Q.chon(x('cap'), d, 'Chọn cấp quyết định'); }).catch(function (err) { ums.api.handle(err, 'cấp quyết định'); });
            if (!thoiGian) thoiGian = ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
                .then(null, function (err) { thoiGian = null; throw err; });
            thoiGian.then(function (d) { Q.chon(x('tg'), d, 'Chọn học kỳ', 'DAOTAO_THOIGIANDAOTAO'); }).catch(function (err) { ums.api.handle(err, 'học kỳ'); });
        }

        /* ---------- Hộp "Thêm sinh viên vào quyết định" ----------------------- */
        function themSV() {
            if (!canQD()) return;
            var ds = [];
            var dlg = ui.dialog({
                title: 'Thêm sinh viên vào quyết định', icon: 'fa-paper-plane', size: 'xl',
                body: '<div data-x="t"></div>',
                buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () {
                    var ids = K.daChon(dlg.body, 'sqd');
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                    var qd = fQD.value;
                    dlg.close();
                    ui.batch(ids.map(function (id) {
                        return { action: Q.CND + 'FSkkLB4QBR4FKCQsHg8JHgUoJCweAg8P', func: 'pkg_congthongtin_cnd_thongtin.Them_QD_Diem_NH_Diem_CN',
                            strId: id, strQLSV_QuyetDinh_Id: qd, strNguoiThucHien_Id: '' };
                    }), { title: 'Đang thêm sinh viên vào quyết định', okText: 'Thực hiện thành công', show: true }).then(tai);
                    return false;
                } }]
            });
            var host = dlg.body.querySelector('[data-x="t"]');
            K.ganChon(dlg.body);
            K.dang(host);
            ums.api.call({
                action: Q.CN + 'DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeAik0IBAF', func: 'pkg_congthongtin_congnhandiem.LayDSKH_NguoiHoc_HP_Cap_ChuaQD',
                strDiem_KeHoachCongNhan_Id: kh.ID, strNguoiThucHien_Id: ''
            }).then(function (r) {
                ds = K.ds(r);
                ui.table({
                    el: host, rows: ds, stt: true, empty: 'Không có sinh viên chưa có quyết định',
                    columns: [
                        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                        { title: 'Họ tên', render: function (x) { return esc(K.hoTen(x)); } },
                        { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                        { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                        { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' ' + e(x.DAOTAO_HOCPHAN_MA)); } },
                        K.cotChon('sqd')
                    ]
                });
            }).catch(function (err) { K.loi(host, err, 'sinh viên chưa có quyết định'); });
        }

        /* ---------- Tính phí / Hủy tính phí ----------------------------------- */
        function thamPhi(a) {
            return {
                strDangKy_KeHoachDangKy_Id: '', strNghiepVuApDung_Id: e(a.NGHIEPVUAPDUNG_ID), strQLSV_NguoiHoc_Id: e(a.QLSV_NGUOIHOC_ID),
                strDaoTao_ThoiGianDaoTao_Id: e(a.DAOTAO_THOIGIANDAOTAO_ID), strDaoTao_ChuongTrinh_Id: e(a.DAOTAO_CHUONGTRINH_ID),
                strKieuHoc_Id: e(a.KIEUHOC_ID), strTaiChinh_CacKhoanThu_Id: e(a.TAICHINH_CACKHOANTHU_ID), strNguoiThucHien_Id: '',
                strDaoTao_HocPhan_Id: e(a.DAOTAO_HOCPHAN_ID), strNguonDuLieu_Id: e(a.ID), strPhantrammiengiamduyet: '',
                strQLSV_DoiTuong_Id: '', strDangKy_TrucTiep_LichSu_Id: ''
            };
        }
        function phi(huy) {
            var ids = K.daChon(z('t'), 'qdq');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            var chon = ids.map(function (id) { return K.tim(rows, id); }).filter(Boolean);
            var p = huy ? ui.confirm('Hủy kết quả tính phí của ' + chon.length + ' dòng đã chọn?', { tone: 'bad', ok: 'Hủy tính phí', title: 'Hủy tính phí' })
                : hoi('Tính phí cho ' + chon.length + ' dòng đã chọn?');
            p.then(function (yes) {
                if (!yes) return;
                ui.batch(chon.map(function (a) {
                    var c = thamPhi(a);
                    if (huy) {
                        c.action = 'TC_TinhPhi_MH/GS4gCiQ1EDQgBSAVKC8pESko'; c.func = 'pkg_taichinh_tinhphi.XoaKetQuaDaTinhPhi';
                        c.strHeDaoTao_Id = ''; c.strKhoaDaoTao_Id = ''; c.strLopQuanLy_Id = '';
                    } else {
                        c.action = 'TC_TinhPhi_MH/FSgvKREpKA8mNC4oCS4i'; c.func = 'pkg_taichinh_tinhphi.TinhPhiNguoiHoc';
                    }
                    return c;
                }), { title: huy ? 'Đang hủy tính phí' : 'Đang tính phí', okText: 'Thực hiện thành công', show: true }).then(tai);
            });
        }
        function chayTheoQD(action, func, msg) {
            if (!canQD()) return;
            hoi(msg).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: action, func: func, strQLSV_QuyetDinh_Id: fQD.value, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Thực hiện thành công', 'ok'); })
                    .catch(function (err) { ums.api.handle(err, msg); });
            });
        }

        if (window.jQuery) jQuery(fQD).on('select2:select select2:clear', tai);
        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'tao': taoQD(); break;
                case 'themsv': themSV(); break;
                case 'tim': tai(); break;
                case 'taods': chayTheoQD('D_PhanQuyen_MH/ESkgLxA0OCQvHhUgLgUSFSkkLhA0OCQ1BSgvKTdz', 'pkg_diem_phanquyen.PhanQuyen_TaoDSTheoQuyetDinhv2', 'Thực hiện tạo danh sách điểm theo quyết định đang chọn?'); break;
                case 'chuyen': chayTheoQD('D_PhanQuyen_MH/Aik0OCQvBSgkLAIuLyYPKSAvHhUpJC4QBQPP', 'pkg_diem_phanquyen.ChuyenDiemCongNhan_TheoQD', 'Chuyển điểm công nhận theo quyết định đang chọn?'); break;
                case 'tinhphi': phi(false); break;
                case 'huyphi': phi(true); break;
            }
        });

        return {
            mo: function (d) {
                kh = d; rows = [];
                Q.chon(fQD, [], 'Chọn quyết định');
                napQD().then(tai);
            }
        };
    };
})();
