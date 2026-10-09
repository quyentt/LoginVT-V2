/* =========================================================================
   tracuu — Kết quả đăng ký học (Cổng sinh viên, vai trò thủ vai: userId = ID người học)
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/tracuu.html + script/tracuu.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   Bố cục GIỮ như gốc — MỘT cột: hàng lọc "Kế hoạch đăng ký hoc" (Học kỳ, Kế hoạch) +
   nút Xem / Xác nhận tất cả / Báo cáo; dưới là kết quả đăng ký nhóm theo môn, mỗi môn
   một khối có nút "Xác nhận kết quả đăng ký" + ô đánh dấu, mỗi lớp một thẻ
   (Điểm danh · Điểm quá trình · Chi tiết).
   Lời gọi (chép nguyên action / func / tham số / cột):
     DKH_ThongTin_MH  pkg_dangkyhoc_thongtin.LayThoiGianDangKyCaNhan   (ID, THOIGIAN)
     DKH_ThongTin_MH  pkg_dangkyhoc_thongtin.LayDSKeHoachDangKyCaNhan  (ID, TENKEHOACH)
     DKH_Chung_MH     pkg_dangkyhoc_chung.LayKetQuaDangKyLopHocPhan
     DKH_Chung_MH     pkg_dangkyhoc_chung.LayLichTuanTheoLopHocPhan     (hộp "Chi tiết")
     SV_ThongTin_MH   pkg_congthongtin_hssv_thongtin.LatKetQuaDiemDanh / LatKetQuaDiemQuaTrinh
     DKH_XacNhan_MH   PKG_DANGKY_XACNHAN.LayDSHanhDongXacNhan (trạng thái theo loại) ·
                      LayDSDangKy_XacNhan_KetQua (lịch sử) · Them_DangKy_XacNhan_KetQua (ghi)
     Danh mục "DANGKY.XACNHAN.LOAI" cho ô Loại xác nhận; báo cáo: ums.report.mount
     (gốc getList_MauImport "zonebtnBaoCao_TraCuu", không có vùng _Import → import: false).
     strSanPham_Id / strDuLieuXacNhan = nối 6 cột như gốc: DANGKY_KEHOACHDANGKY_ID +
     DAOTAO_HOCPHAN_ID + QLSV_NGUOIHOC_ID + KIEUHOC_ID + DAOTAO_THOIGIANDAOTAO_ID + DAOTAO_TOCHUCCHUONGTRINH_ID.
   Khác bản gốc (cách làm, không đổi bố cục):
     · Học kỳ → Kế hoạch nối tầng theo luật chung: chưa chọn Học kỳ thì Kế hoạch bị khoá,
       đổi / xoá Học kỳ thì xoá trắng Kế hoạch (ums.pat.chain).
     · Nút "Đồng ý" của hộp Xác nhận nằm ở CHÂN hộp (gốc đặt cạnh ô Trạng thái).
     · Bấm TÊN lớp cũng mở "Chi tiết" như nút Chi tiết — gốc truyền id của thẻ <a>
       ("lblTenLop…") nên hộp luôn trống (lỗi bản gốc).
     · Xác nhận nhiều dòng chạy tuần tự kèm tiến độ (ums.ui.batch) thay vì bắn song song.
     · Sau khi xác nhận xong thì nạp lại danh sách (gốc gọi me.getList_SinhVien — hàm KHÔNG
       tồn tại trong tệp, kèm start_Progress vào một vùng không có trên màn → luôn lỗi).
   Bỏ (mã chết của gốc): getList_BtnXacNhanSanPham / loadBtnXacNhan (ghi vào
     main_doc.KeHoachXuLy và #zoneBtnXacNhan — không có ở màn này, đã bị chú thích khi gọi);
     hai nhãn #lblSoNguoiDangKy, #lblSoTinDaDangKy và danh sách #zoneDaDangKy (thẻ của màn
     "Đăng ký học", màn này không có); ô ẩn txtNoiDungXacNhanSanPham / txtAAAA / dropAAAA →
     gửi rỗng đúng như giá trị thật bản gốc gửi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, D = ums.dky;
    var root = document.getElementById('dkh-tracuu');
    var e = D.e, arr = D.arr, uid = D.uid, esc = function (s) { return ui.esc(e(s)); };
    var sv = uid();
    var st = { kq: [], loai: '' };

    var A = {
        hk:  { action: 'DKH_ThongTin_MH/DSA4FSkuKAYoIC8FIC8mCjgCIA8pIC8P', func: 'pkg_dangkyhoc_thongtin.LayThoiGianDangKyCaNhan' },
        kh:  { action: 'DKH_ThongTin_MH/DSA4BRIKJAkuICIpBSAvJgo4AiAPKSAv', func: 'pkg_dangkyhoc_thongtin.LayDSKeHoachDangKyCaNhan' },
        kq:  { action: 'DKH_Chung_MH/DSA4CiQ1EDQgBSAvJgo4DS4xCS4iESkgLwPP', func: 'pkg_dangkyhoc_chung.LayKetQuaDangKyLopHocPhan' },
        tt:  { action: 'DKH_XacNhan_MH/DSA4BRIJIC8pBS4vJhkgIg8pIC8P', func: 'PKG_DANGKY_XACNHAN.LayDSHanhDongXacNhan' },
        ls:  { action: 'DKH_XacNhan_MH/DSA4BRIFIC8mCjgeGSAiDykgLx4KJDUQNCAP', func: 'PKG_DANGKY_XACNHAN.LayDSDangKy_XacNhan_KetQua' },
        luu: { action: 'DKH_XacNhan_MH/FSkkLB4FIC8mCjgeGSAiDykgLx4KJDUQNCAP', func: 'PKG_DANGKY_XACNHAN.Them_DangKy_XacNhan_KetQua' }
    };
    function goi(a, o) { return ums.api.call(Object.assign({}, A[a], o)); }

    root.innerHTML = pat.page('Kết quả đăng ký học', '') +
        pat.panel({ title: 'Kế hoạch đăng ký hoc', icon: 'fa-calendar-check', cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-f="hk" data-ph="Chọn học kỳ"><option value="">Chọn học kỳ</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch"><option value="">Chọn kế hoạch</option></select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem', attr: { 'data-a': 'xem' } }) + '</div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Xác nhận tất cả', icon: 'fa-check-double', attr: { 'data-a': 'xnall' } }) + '</div>' +
            '<div class="ums-field ums-field--fit"><span data-z="report"></span></div>' +
            '</div>' }) +
        '<div class="dky" data-z="kq"></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var chain = pat.chain([f('hk'), f('kh')], { phatLai: false });

    /* ---------- Học kỳ → Kế hoạch → Kết quả ------------------------------- */
    function napHK() {
        goi('hk', { strDaoTao_ThoiGianDaoTao_Id: f('hk').value, strQLSV_NguoiHoc_Id: sv }).then(function (r) {
            var rows = arr(r.data);
            pat.fill(f('hk'), rows, { name: 'THOIGIAN', head: 'Chọn học kỳ' });
            if (rows.length) f('hk').value = e(rows[0].ID);         // selectFirst của bản gốc
            if (window.jQuery) jQuery(f('hk')).trigger('change.select2');
            chain.sync();
            napKH();
        }).catch(function (err) { ums.api.handle(err, 'học kỳ'); });
    }
    function napKH() {
        if (!f('hk').value) { pat.fill(f('kh'), []); chain.sync(); veKQ([]); return; }
        goi('kh', { strDaoTao_ThoiGianDaoTao_Id: f('hk').value, strQLSV_NguoiHoc_Id: sv }).then(function (r) {
            var rows = arr(r.data);
            pat.fill(f('kh'), rows, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' });
            if (rows.length === 1) f('kh').value = e(rows[0].ID);    // selectOne của bản gốc
            if (window.jQuery) jQuery(f('kh')).trigger('change.select2');
            chain.sync();
            napKQ();
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch đăng ký'); });
    }
    function napKQ() {
        z('kq').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        goi('kq', {
            strDaoTao_ChuongTrinh_Id: '', strDangKy_KeHoachDangKy_Id: f('kh').value,
            strQLSV_NguoiHoc_Id: sv, strNguoiThucHien_Id: uid(), strDaoTao_ThoiGianDaoTao_Id: f('hk').value
        }).then(function (r) { st.kq = arr(r.data); veKQ(st.kq); })
          .catch(function (err) { z('kq').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả đăng ký'); });
    }
    function veKQ(ds) {
        D.ketQua(z('kq'), ds, {
            empty: 'Chưa có kết quả đăng ký học',
            tools: function (dau) {
                return '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-xn="' + esc(dau.ID) + '">' +
                    '<i class="fa-light fa-circle-check"></i><span>Xác nhận kết quả đăng ký</span></button>' +
                    '<label class="ums-check"><input type="checkbox" data-ck value="' + esc(dau.ID) + '" checked><span class="ums-u-sr">Chọn môn</span></label>';
            },
            tenAttr: function (r, i) { return { 'data-ct': i }; },
            actions: function (r, i) {
                return D.nut('out-primary', 'Điểm danh', { 'data-dd': i }) +
                    D.nut('out-primary', 'Điểm quá trình', { 'data-dqt': i }) +
                    D.nut('out-primary', 'Chi tiết', { 'data-ct': i });
            }
        });
    }

    /* ---------- Hộp "Xác nhận kết quả đăng ký" ----------------------------- */
    function sanPham(a) {
        return e(a.DANGKY_KEHOACHDANGKY_ID) + e(a.DAOTAO_HOCPHAN_ID) + e(a.QLSV_NGUOIHOC_ID) + e(a.KIEUHOC_ID) +
            e(a.DAOTAO_THOIGIANDAOTAO_ID) + e(a.DAOTAO_TOCHUCCHUONGTRINH_ID);
    }
    function hopXacNhan(ids) {
        var dlg = ui.dialog({
            title: 'Xác nhận kết quả đăng ký', icon: 'fa-circle-check', size: 'lg',
            body: '<div class="ums-field"><label class="ums-field__label">Loại xác nhận</label>' +
                '<select class="ums-select" data-x="loai" data-ph="Chọn loại xác nhận"><option value="">Chọn loại xác nhận</option></select></div>' +
                '<div class="ums-field"><label class="ums-field__label">Trạng thái xác nhận</label>' +
                '<select class="ums-select" data-x="tt" data-ph="Chọn trạng thái"><option value="">Chọn trạng thái</option></select></div>' +
                '<h4 class="dky-h">Lịch sử xác nhận</h4><div data-x="ls"></div>',
            buttons: [{ text: 'Đồng ý', kind: 'save', icon: 'fa-check', onClick: function () { luu(ids, dlg); } }]
        });
        var loai = dlg.body.querySelector('[data-x="loai"]'), tt = dlg.body.querySelector('[data-x="tt"]');
        ui.enhance(dlg.body);
        var ch = pat.chain([loai, tt], { phatLai: false });
        ums.api.dm('DANGKY.XACNHAN.LOAI').then(function (rows) {
            pat.fill(loai, rows, { head: 'Chọn loại xác nhận' });
            if (st.loai) loai.value = st.loai;                 // giữ lựa chọn lần trước (ô của gốc không bị dựng lại)
            if (window.jQuery) jQuery(loai).trigger('change.select2');
            ch.sync();
            if (st.loai) napTrangThai(loai, tt, ch);
        }).catch(function (err) { ums.api.handle(err, 'loại xác nhận'); });
        if (window.jQuery) jQuery(loai).on('select2:select', function () { st.loai = loai.value; napTrangThai(loai, tt, ch); });

        var hLS = dlg.body.querySelector('[data-x="ls"]');
        if (ids.length === 1) {
            var aData = st.kq.filter(function (x) { return e(x.ID) === ids[0]; })[0];
            hLS.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            goi('ls', {
                strTuKhoa: '', strDuLieuXacNhan: aData ? sanPham(aData) : '', strLoaiXacNhan_Id: loai.value,
                strNguoiXacNhan_Id: '', strHanhDong_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                ui.table({ el: hLS, rows: arr(r.data), empty: 'Chưa có lịch sử xác nhận', columns: [
                    { title: 'Trạng thái xác nhận', prop: 'HANHDONG_TEN' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }
                ] });
            }).catch(function (err) { hLS.innerHTML = ui.fail(err.message); });
        } else {
            // "Xác nhận tất cả": bản gốc xoá trắng bảng lịch sử
            ui.table({ el: hLS, rows: [], empty: 'Chọn một môn để xem lịch sử xác nhận', columns: [
                { title: 'Trạng thái xác nhận' }, { title: 'Người xác nhận' }, { title: 'Thời gian' }] });
        }
    }
    function napTrangThai(loai, tt, ch) {
        goi('tt', { strLoaiXacNhan_Id: loai.value, strNguoiThucHien_Id: uid() }).then(function (r) {
            pat.fill(tt, arr(r.data), { head: 'Chọn trạng thái' });
            var rows = arr(r.data);
            if (rows.length === 1) { tt.value = e(rows[0].ID); if (window.jQuery) jQuery(tt).trigger('change.select2'); }
            ch.sync();
        }).catch(function (err) { ums.api.handle(err, 'trạng thái xác nhận'); });
    }
    function luu(ids, dlg) {
        var tinhTrang = dlg.body.querySelector('[data-x="tt"]').value;
        var loai = dlg.body.querySelector('[data-x="loai"]').value;
        var calls = ids.map(function (id) {
            var a = st.kq.filter(function (x) { return e(x.ID) === id; })[0] || {};
            var sp = sanPham(a);
            return Object.assign({}, A.luu, {
                strSanPham_Id: sp, strNguoiXacnhan_Id: uid(), strNoiDung: '', strTinhTrang_Id: tinhTrang,
                strLoaiXacNhan_Id: loai, strHanhDong_Id: tinhTrang, strDuLieuXacNhan: sp, strNguoiThucHien_Id: uid()
            });
        });
        if (!calls.length) return;
        if (calls.length === 1) {
            ums.api.call(calls[0]).then(function () { ui.toast('Xác nhận thành công', 'ok'); napKQ(); })
                .catch(function (err) { ui.toast('Xác nhận thất bại:' + err.message, 'bad'); });
            return;
        }
        ui.batch(calls, { title: 'Đang xác nhận kết quả đăng ký' }).then(function (r) {
            if (r.ok) ui.toast('Xác nhận thành công', 'ok');
            if (r.fail) ui.toast('Xác nhận thất bại:' + (r.errors[0] && r.errors[0].message), 'bad');
            napKQ();
        });
    }

    /* ---------- Sự kiện --------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var t = ev.target, b;
        if ((b = t.closest('[data-ct]'))) { var x = st.kq[Number(b.getAttribute('data-ct'))];
            D.lich({ action: 'DKH_Chung_MH/DSA4DSgiKRU0IC8VKSQuDS4xCS4iESkgLwPP', func: 'pkg_dangkyhoc_chung.LayLichTuanTheoLopHocPhan' },
                x.DANGKY_LOPHOCPHAN_ID, x.DANGKY_LOPHOCPHAN_TEN); return; }
        if ((b = t.closest('[data-dd]'))) { var d1 = st.kq[Number(b.getAttribute('data-dd'))]; D.diemDanh(d1.DANGKY_LOPHOCPHAN_ID, d1.DANGKY_LOPHOCPHAN_TEN); return; }
        if ((b = t.closest('[data-dqt]'))) { var d2 = st.kq[Number(b.getAttribute('data-dqt'))]; D.diemQuaTrinh(d2.DANGKY_LOPHOCPHAN_ID, d2.DANGKY_LOPHOCPHAN_TEN); return; }
        if ((b = t.closest('[data-xn]'))) { hopXacNhan([b.getAttribute('data-xn')]); return; }
        if (t.closest('[data-a="xem"]')) { napKQ(); return; }
        if (t.closest('[data-a="xnall"]')) {
            var ids = Array.prototype.slice.call(z('kq').querySelectorAll('input[data-ck]:checked')).map(function (c) { return c.value; });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            hopXacNhan(ids);
        }
    });
    if (window.jQuery) {
        jQuery(f('hk')).on('select2:select select2:clear', function () { napKH(); });
        jQuery(f('kh')).on('select2:select select2:clear', function () { napKQ(); });
    }

    ums.report.mount(z('report'), { import: false, reportText: 'Báo cáo', collect: function (add) {
        add('strDangKy_KeHoachDangKy_Id', f('kh').value);
        add('strQLSV_NguoiHoc_Id', sv);
    } });

    napHK();
})();
