/* =========================================================================
   Tổng hợp công tháng — lưới chấm công cán bộ × ngày trong tháng, xác nhận
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/tonghopcongthang.html + script/tonghopcongthang.js
   ---------------------------------------------------------------------------
   Một cột như gốc: tiêu đề "TỔNG HỢP CHẤM CÔNG THÁNG mm/yyyy" + ghi chú, khung
   tìm kiếm (Tháng, Năm, Bộ môn · Xuất báo cáo · ba nút ghi), lưới chấm công,
   khung "Ký hiệu chấm công", khung "Hướng dẫn chấm công".

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên; GET trừ khi ghi POST):
     NS_CongPhep_Chung/LayDSXacNhanTheoNguoiDung  strNguoiThucHien_Id → các nút xác nhận
          (ID, TEN, THONGTIN1 = lớp biểu tượng FA4 → qua ums.iconFA4, THONGTIN2 = style biểu tượng)
     NS_CongPhep_Chung/LayDSDonViTheoNguoiDung    strNguoiThucHien_Id → ô "Chọn bộ môn"
     CMS_DanhMucThuocTinh/…  NHANSU.CONGPHEP.DANHGIA → ô đánh giá trong từng ô ngày
     NS_ChamCong_CaNhan/LayDSNhanSu_ChamCong  strChucNang_Id, strDaoTao_CoCauToChuc_Id (Bộ môn, không có
          thì ô Cơ cấu — ô này gốc ẩn nên luôn rỗng), strNhanSu_HoSoCanBo_Id '', strNam, strThang (CHỮ của ô
          tháng: "01".."12"), strNguoiThucHien_Id → rsThongTinNgay / rsThongTinNhanSu / rsThongTinMoRong
     NS_ChamCong_CaNhan/LayKetQuaChamCongDonVi  strDaoTao_CoCauToChuc_Id, strNam, strThang, strNgayChamCong ''
          → rs (DANHGIA_ID, PHANTRAMHUONG theo NHANSU_HOSOCANBO_ID × CHAMCONG_NGAYDAYDU), rsMoRong
     NS_ChamCong_CaNhan/LayDSHoatDongChamCong  (như LayDSNhanSu_ChamCong) → rsHoatDong (ký hiệu),
          rsQuyDinhTongHopCong (hướng dẫn)
     NS_ChamCong_CaNhan/ThemMoi  POST  strId '' (gốc đọc ô txtAAAA không có → luôn ThemMoi),
          strNhanSu_HoSoCanBo_Id, strDanhGia_Id, strNam, strThang, strTuan '', strQuyDinh_Id '',
          strNgayChamCong (CHAMCONG_NGAYDAYDU), dPhanTramHuong (trống = 100, bỏ dấu %), strGhiChu ''
          — chỉ gửi các ô ĐÃ ĐỔI so với lúc nạp (như gốc so name/title của ô)
     NS_NghiPhepCaNhan/TuDong_CapNhat_QuaTrinh_CaNhan  POST  strDaoTao_CoCauToChuc_Id,
          strNhanSu_HoSoNhanSu_Id, strNamApDung, strThangApDung — mỗi cán bộ một lời gọi
     NS_ChamCong_XacNhan/XacNhanTatCa_NhanSu_ChamCong  POST  strId '', strDaoTao_CoCauToChuc_Id,
          strNhanSu_HoSoCanBo_Id, strNam, strThang, strTinhTrang_Id, strNoiDung, strNguoiXacnhan_Id
     NS_ChamCong_XacNhan/LayDanhSach  strTuKhoa '', strNguoiThucHien_Id, strsanpham_Id = ID cán bộ +
          strThang + strNam (ghép chuỗi như gốc), strTinhTrang_Id '', pageIndex 1, pageSize 100000
     Xuất báo cáo: getList_MauImport(zonebtnBaoCao_THCC) = ums.report.mount — thêm strDaoTao_CoCauToChuc_Id,
          strNam, dThang (GIÁ TRỊ ô tháng: 1..12). Không có mẫu báo cáo nào thì giữ ba mục viết cứng của gốc:
          "1. Chấm công" (REPORTALLTABLE bảng tbldataTHCT), "2. File Chấm công" (REPORTALLINPUT), "3. Import".
          Gốc không có vùng _Import → mẫu import theo quyền không hiện (import: false).

   Giữ như gốc: bảng mang id tbldataTHCT, ô đánh giá / ô phần trăm mang id selectNhanSu_ / txtNhanSu_
   + ID + "_" + CHAMCONG_NGAY + tháng + năm (tệp báo cáo / import theo ô dựa vào id này).
   Khác gốc (ghi lại):
     · Đổ kết quả vào ô theo NHANSU_HOSOCANBO_ID + CHAMCONG_NGAYDAYDU. Gốc ghép id ô bằng
       parseInt(ngày đầy đủ bỏ "/") — lệch với id ô khi CHAMCONG_NGAY có số 0 đầu ("01" ≠ "1…")
       nên các ngày 1–9 có thể không bao giờ đổ được.
     · Tiêu đề ba tầng: TUẦN ở trên, NGÀY ở giữa, THỨ ở dưới (gốc: ngày / tuần / thứ — tuần gộp
       nhiều ngày không nằm dưới một ô ngày được).
     · Lưu / Tự động cập nhật / Xác nhận chạy hàng loạt có tiến độ (ums.ui.batch) rồi nạp lại.
     · Lưới không cuộn trong khung riêng (gốc đặt chiều cao = cửa sổ − 150px, cuộn dọc).
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, pat = ums.pat, esc = S.esc, e = S.e;
    var root = document.getElementById('tonghopcongthang');
    var d0 = new Date();
    function hai(n) { n = Number(n); return (n < 10 ? '0' : '') + n; }
    var THANG = []; for (var i = 1; i <= 12; i++) THANG.push({ ID: String(i), TEN: hai(i) });

    root.innerHTML = pat.page('Tổng hợp công tháng', '') +
        pat.panel({
            title: 'TỔNG HỢP CHẤM CÔNG THÁNG', icon: 'fa-calendar-days', count: 'tg', cls: 'ums-u-mb-4',
            body: '<p class="ums-u-mb-2"><b><u>Ghi chú:</u></b></p>' +
                '<p class="ums-u-mb-0 nscham-ghichu"><i>+ Nhấp chuột vào nút \'Tìm kiếm\' xem kết quả</i><br>' +
                '<i>+ Nhấp chuột vào combobox \'Chọn cơ cấu tổ chức\' để xem báo cáo theo đơn vị</i><br>' +
                '<i>+ Nhấp chuột vào nút \'Xuất excel\' để xuất báo cáo ra file excel</i></p>'
        }) +
        pat.panel({
            title: 'Tìm kiếm', icon: 'fa-magnifying-glass', cls: 'ums-u-mb-4',
            tools: '<span data-z="baocao"></span>' +
                ui.btn('save', { text: 'Tự động cập nhật từ các quá trình', mod: 'warn', attr: { 'data-a': 'quatrinh' } }) +
                ui.btn('save', { attr: { 'data-a': 'luu' } }) +
                ui.btn('confirm', { text: 'Xác nhận toàn bộ', attr: { 'data-a': 'xacnhan' } }),
            body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="thang" data-ph="Chọn tháng" data-required><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="nam" data-ph="Chọn năm" data-required><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="bomon" data-ph="Chọn bộ môn"><option value=""></option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                '</div>'
        }) +
        pat.panel({ title: 'Bảng chấm công', icon: 'fa-table-cells', count: 'dem', flush: true, zone: 'bang', cls: 'ums-u-mb-4',
            body: ui.empty('Chọn tháng, năm rồi bấm Tìm kiếm để xem kết quả', 'fa-hand-pointer') }) +
        pat.panel({ title: 'Ký hiệu chấm công', icon: 'fa-list', zone: 'kyhieu', cls: 'ums-u-mb-4', body: '<span class="ums-u-faint">—</span>' }) +
        pat.panel({ title: 'Hướng dẫn chấm công', icon: 'fa-circle-info', zone: 'huongdan', body: '<span class="ums-u-faint">—</span>' });

    function Z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    ui.enhance(root);
    pat.fill(F('thang'), THANG, { head: 'Chọn tháng' });
    pat.fill(F('nam'), S.nam(1993, true), { head: 'Chọn năm' });
    F('thang').value = String(d0.getMonth() + 1);
    F('nam').value = String(d0.getFullYear());
    if (window.jQuery) jQuery(F('thang')).add(F('nam')).trigger('change.select2');

    var st = { xn: [], dg: [], ngay: [], ns: [], moRong: [], goc: {}, thang: '', nam: '', dv: '' };
    function veThoiGian() { Z('tg').textContent = hai(F('thang').value || 0) + '/' + F('nam').value; }
    veThoiGian();
    if (window.jQuery) jQuery(F('thang')).add(F('nam')).on('select2:select', veThoiGian);

    /* ---------- Nguồn ------------------------------------------------------ */
    ums.api.call({ action: 'NS_CongPhep_Chung/LayDSXacNhanTheoNguoiDung', method: 'GET', strNguoiThucHien_Id: S.uid(), silent: true })
        .then(function (r) { st.xn = S.rows(r); }, function (err) { ums.api.handle(err, 'danh sách xác nhận'); });
    ums.api.call({ action: 'NS_CongPhep_Chung/LayDSDonViTheoNguoiDung', method: 'GET', strNguoiThucHien_Id: S.uid(), silent: true })
        .then(function (r) { pat.fill(F('bomon'), S.rows(r), { head: 'Chọn bộ môn' }); }, function (err) { ums.api.handle(err, 'đơn vị'); });
    var nguonDG = ums.api.dm('NHANSU.CONGPHEP.DANHGIA').then(function (r) { st.dg = r; }, function () { st.dg = []; });

    /* ---------- Xuất báo cáo ----------------------------------------------- */
    var TINH = [
        { MAUIMPORT_MA: 'reportalltable_tbldataTHCT', MAUIMPORT_TENFILEMAU: 'Chấm công' },
        { MAUIMPORT_MA: 'reportallinput_tbldataTHCT', MAUIMPORT_TENFILEMAU: 'File Chấm công' },
        { MAUIMPORT_MA: 'importallTable_tbldataTHCT', MAUIMPORT_TENFILEMAU: 'Import' }
    ];
    var hostBC = Z('baocao');
    ums.report.mount(hostBC, {
        import: false,
        tables: function () { var t = document.getElementById('tbldataTHCT'); return t ? [t] : []; },
        collect: function (add) {
            add('strDaoTao_CoCauToChuc_Id', F('bomon').value);
            add('strNam', F('nam').value);
            add('dThang', F('thang').value);
        },
        onLoad: function (rows) {
            var coBC = rows.some(function (t) { var k = String(t.MAUIMPORT_MA || '').substring(0, 14).toUpperCase(); return k !== 'IMPORTALLINPUT' && k !== 'IMPORTWITHPROC'; });
            if (coBC) return;
            // Gốc: không có mẫu báo cáo thì vùng nút giữ ba mục viết cứng trong html
            var base = rows.length;
            TINH.forEach(function (t) { rows.push(t); });
            hostBC.innerHTML = '<div class="ums-drop" data-drop="report">' +
                '<button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
                '<i class="fa-light fa-file-chart-column"></i><span>Xuất báo cáo</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
                '<div class="ums-drop__menu" role="menu" hidden>' + TINH.map(function (t, i) {
                    return '<button type="button" class="ums-drop__item" role="menuitem" data-rp="' + (base + i) + '">' +
                        '<span class="ums-drop__no">' + (i + 1) + '.</span><span class="ums-drop__text">' + esc(t.MAUIMPORT_TENFILEMAU) + '</span>' +
                        '<i class="fa-light ' + (i < 2 ? 'fa-eye' : 'fa-cloud-arrow-up') + ' ums-drop__mark"></i></button>';
                }).join('') + '</div></div>';
        }
    });

    /* ---------- Lưới ------------------------------------------------------- */
    function idO(nsId, ngay) { return nsId + '_' + e(ngay.CHAMCONG_NGAY) + st.thang + st.nam; }
    function khoa(nsId, ngayDD) { return nsId + '|' + ngayDD; }

    function nutXN(r) {
        var h = '<div class="nscham-xn">';
        var ten = '';
        st.xn.forEach(function (x) {
            var on = x.ID === r.KETQUAXACNHAN_ID;
            if (on) ten = x.TEN;
            h += '<button type="button" class="ums-iconbtn nscham-xn__b' + (on ? ' is-on' : '') + '" data-xn="' + esc(x.ID) + '" data-ns="' + esc(r.ID) +
                '" title="' + esc(x.TEN) + '"><i class="' + esc(ums.iconFA4(x.THONGTIN1)) + '"' + (x.THONGTIN2 ? ' style="' + esc(x.THONGTIN2) + '"' : '') + '></i></button>';
        });
        return h + '</div><div class="nscham-xn__ten" data-xnten="' + esc(r.ID) + '">' + esc(ten) + '</div>' +
            '<button type="button" class="ums-btn ums-btn--sm ums-btn--quiet" data-ls="' + esc(r.ID) + '"><i class="fa-light fa-clock-rotate-left"></i><span>Lịch sử</span></button>';
    }

    function veBang() {
        var opt = '<option value="">Chọn</option>' + st.dg.map(function (x) { return '<option value="' + esc(x.ID) + '">' + esc(x.TEN) + '</option>'; }).join('');
        var cols = [
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', cls: 'nscham-cotrong' },
            { title: 'Họ tên', cls: 'nscham-cotrong', render: function (r) { return esc(e(r.HOTEN)) + '<br><i class="ums-u-faint">' + esc(e(r.MASO)) + '</i>'; } },
            { title: 'Xác nhận', cls: 'is-center', render: nutXN }
        ];
        st.ngay.forEach(function (n) {
            cols.push({
                title: S.tenThu(n.THUTRONGTUAN), cls: 'is-center', group: ['T' + e(n.TUAN), String(e(n.CHAMCONG_NGAY))],
                render: function (r) {
                    var x = idO(r.ID, n);
                    return '<div class="nscham-o"><select class="ums-select" id="selectNhanSu_' + esc(x) + '" data-o="' + esc(khoa(r.ID, n.CHAMCONG_NGAYDAYDU)) + '">' + opt + '</select>' +
                        '<input class="ums-input" id="txtNhanSu_' + esc(x) + '" data-o="' + esc(khoa(r.ID, n.CHAMCONG_NGAYDAYDU)) + '" autocomplete="off"></div>';
                }
            });
        });
        st.moRong.forEach(function (mr) {
            cols.push({ title: e(mr.THANHPHAN_TEN), cls: 'is-center', render: function (r) {
                return '<span data-mr="' + esc(r.ID + '_' + mr.THANHPHAN_ID) + '"></span>';
            } });
        });
        ui.table({ el: Z('bang'), rows: st.ns, columns: cols, empty: 'Không có cán bộ nào' });
        var t = Z('bang').querySelector('table');
        if (t) t.id = 'tbldataTHCT';
        Z('dem').textContent = '(' + st.ns.length + ')';
    }

    function dien() {
        return ums.api.call({
            action: 'NS_ChamCong_CaNhan/LayKetQuaChamCongDonVi', method: 'GET',
            strDaoTao_CoCauToChuc_Id: st.dv, strNam: st.nam, strThang: st.thang, strNgayChamCong: ''
        }).then(function (r) {
            var d = r.data || {};
            st.goc = {};
            (d.rs || []).forEach(function (x) {
                var k = khoa(x.NHANSU_HOSOCANBO_ID, x.CHAMCONG_NGAYDAYDU);
                var pt = e(x.PHANTRAMHUONG) + '%';
                if (pt === '100%') pt = '';
                st.goc[k] = { dg: e(x.DANHGIA_ID), pt: pt };
                [].forEach.call(Z('bang').querySelectorAll('[data-o="' + CSS.escape(k) + '"]'), function (el) {
                    el.value = el.tagName === 'SELECT' ? e(x.DANHGIA_ID) : pt;
                });
            });
            (d.rsMoRong || []).forEach(function (x) {
                var el = Z('bang').querySelector('[data-mr="' + CSS.escape(x.NHANSU_HOSOCANBO_ID + '_' + x.THANHPHAN_ID) + '"]');
                if (el) el.textContent = e(x.THANHPHAN_GIATRI);
            });
        }).catch(function (err) { ums.api.handle(err, 'kết quả chấm công'); });
    }

    function thamSo() {
        return {
            strChucNang_Id: (ums.state && ums.state.chucNangId) || '',
            strDaoTao_CoCauToChuc_Id: st.dv, strNhanSu_HoSoCanBo_Id: '',
            strNam: st.nam, strThang: st.thang, strNguoiThucHien_Id: S.uid()
        };
    }

    function tim() {
        if (!F('thang').value || !F('nam').value) { ui.toast('Vui lòng chọn tháng và năm', 'warn'); return Promise.resolve(); }
        st.thang = hai(F('thang').value); st.nam = F('nam').value; st.dv = F('bomon').value;
        Z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var p = Object.assign({ action: 'NS_ChamCong_CaNhan/LayDSNhanSu_ChamCong', method: 'GET' }, thamSo());
        return Promise.all([ums.api.call(p), nguonDG]).then(function (x) {
            var d = x[0].data || {};
            st.ngay = d.rsThongTinNgay || []; st.ns = d.rsThongTinNhanSu || []; st.moRong = d.rsThongTinMoRong || [];
            veBang();
            return dien();
        }).catch(function (err) { Z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách chấm công'); });
    }

    function ghiChu() {
        var p = Object.assign({ action: 'NS_ChamCong_CaNhan/LayDSHoatDongChamCong', method: 'GET' }, thamSo());
        ums.api.call(p).then(function (r) {
            var d = r.data || {};
            Z('kyhieu').innerHTML = '<div class="nscham-kyhieu">' + (d.rsHoatDong || []).map(function (x) {
                return '<div><b>' + esc(e(x.MA)) + '</b>: ' + esc(e(x.TEN)) + '</div>';
            }).join('') + '</div>';
            Z('huongdan').innerHTML = (d.rsQuyDinhTongHopCong || []).map(function (x) {
                return '<div><b>' + esc(e(x.TEN)) + '</b>: ' + esc(e(x.MOTA)) + '</div>';
            }).join('') || '<span class="ums-u-faint">—</span>';
        }).catch(function (err) { ums.api.handle(err, 'ký hiệu chấm công'); });
    }

    /* ---------- Ghi -------------------------------------------------------- */
    function luu() {
        if (!st.ns.length) { ui.toast('Không có dữ liệu cần lưu', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn muốn lưu không?', { title: 'Lưu chấm công', ok: 'Lưu' }).then(function (yes) {
            if (!yes) return;
            var calls = [];
            st.ns.forEach(function (r) {
                st.ngay.forEach(function (n) {
                    var k = khoa(r.ID, n.CHAMCONG_NGAYDAYDU), x = idO(r.ID, n);
                    var sel = document.getElementById('selectNhanSu_' + x), inp = document.getElementById('txtNhanSu_' + x);
                    if (!sel || !inp) return;
                    var g = st.goc[k] || { dg: '', pt: '' };
                    if (e(inp.value) === g.pt && e(sel.value) === g.dg) return;
                    var pt = inp.value === '' ? '100' : inp.value.replace(/%/g, '');
                    calls.push({
                        action: 'NS_ChamCong_CaNhan/ThemMoi', strId: '', strNhanSu_HoSoCanBo_Id: r.ID, strDanhGia_Id: sel.value,
                        strNam: st.nam, strThang: st.thang, strTuan: '', strQuyDinh_Id: '', strNgayChamCong: n.CHAMCONG_NGAYDAYDU,
                        dPhanTramHuong: pt, strGhiChu: '', strNguoiThucHien_Id: S.uid()
                    });
                });
            });
            if (!calls.length) { ui.toast('Không có dữ liệu cần lưu', 'warn'); return; }
            ui.batch(calls, { title: 'Lưu chấm công', okText: 'Thêm mới thành công!' }).then(tim);
        });
    }

    function quaTrinh() {
        if (!st.ns.length) { ui.toast('Vui lòng bấm Tìm kiếm trước', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn muốn tự động cập nhật quá trình không?', { title: 'Tự động cập nhật từ các quá trình', ok: 'Cập nhật' }).then(function (yes) {
            if (!yes) return;
            ui.batch(st.ns.map(function (r) {
                return { action: 'NS_NghiPhepCaNhan/TuDong_CapNhat_QuaTrinh_CaNhan', strDaoTao_CoCauToChuc_Id: st.dv,
                    strNhanSu_HoSoNhanSu_Id: r.ID, strNamApDung: st.nam, strThangApDung: st.thang, strNguoiThucHien_Id: S.uid() };
            }), { title: 'Tự động cập nhật từ các quá trình' }).then(tim);
        });
    }

    function xacNhanCall(nsId, tt, noiDung) {
        return { action: 'NS_ChamCong_XacNhan/XacNhanTatCa_NhanSu_ChamCong', strId: '', strDaoTao_CoCauToChuc_Id: st.dv,
            strNhanSu_HoSoCanBo_Id: nsId, strNam: st.nam, strThang: st.thang, strTinhTrang_Id: tt, strNoiDung: noiDung,
            strNguoiXacnhan_Id: S.uid() };
    }

    function xacNhanTatCa() {
        if (!st.ns.length) { ui.toast('Vui lòng bấm Tìm kiếm trước', 'warn'); return; }
        var dlg = ui.dialog({
            title: 'Xác nhận', icon: 'fa-circle-check', size: 'md',
            body: '<div class="ums-legend">Nội dung xác nhận</div>' +
                '<input class="ums-input ums-u-mb-4" data-xnnd autocomplete="off">' +
                '<div class="ums-legend">Chọn xác nhận</div>' +
                '<div class="nscham-xnlon">' + (st.xn.length ? st.xn.map(function (x) {
                    return '<button type="button" class="nscham-xnlon__b" data-xnall="' + esc(x.ID) + '">' +
                        '<i class="' + esc(ums.iconFA4(x.THONGTIN1)) + '"' + (x.THONGTIN2 ? ' style="' + esc(x.THONGTIN2) + '"' : '') + '></i>' +
                        '<b>' + esc(x.TEN) + '</b></button>';
                }).join('') : ui.empty('Chưa có loại xác nhận nào cho người dùng này')) + '</div>'
        });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xnall]');
            if (!b) return;
            var nd = dlg.body.querySelector('[data-xnnd]').value;
            dlg.close();
            ui.batch(st.ns.map(function (r) { return xacNhanCall(r.ID, b.getAttribute('data-xnall'), nd); }),
                { title: 'Xác nhận toàn bộ', okText: 'Xác nhận thành công' }).then(tim);
        });
    }

    function xacNhanMot(btn) {
        var nsId = btn.getAttribute('data-ns'), tt = btn.getAttribute('data-xn');
        var r = st.ns.filter(function (x) { return String(x.ID) === nsId; })[0] || {};
        var dlg = ui.dialog({
            title: 'Xác nhận', icon: 'fa-circle-check', size: 'sm',
            body: '<p>Xác nhận <b class="ums-u-danger">' + esc(btn.title) + '</b> cho cán bộ <b class="ums-u-danger">' + esc(e(r.HOTEN)) + '</b>!</p>' +
                '<input class="ums-input" data-mota placeholder="Mô tả xác nhận" autocomplete="off">',
            buttons: [{ text: 'Xác nhận', kind: 'confirm', onClick: function (h) {
                var mt = h.body.querySelector('[data-mota]').value;
                ums.api.call(xacNhanCall(nsId, tt, mt)).then(function () {
                    ui.toast('Xác nhận thành công', 'ok');
                    [].forEach.call(Z('bang').querySelectorAll('[data-ns="' + CSS.escape(nsId) + '"]'), function (b) {
                        b.classList.toggle('is-on', b.getAttribute('data-xn') === tt);
                    });
                    var ten = Z('bang').querySelector('[data-xnten="' + CSS.escape(nsId) + '"]');
                    if (ten) ten.textContent = btn.title;
                    r.KETQUAXACNHAN_ID = tt;
                    h.close();
                }).catch(function (err) { ums.api.handle(err, 'Duyệt hồ sơ thất bại'); });
                return false;
            } }]
        });
        return dlg;
    }

    function lichSu(nsId) {
        var dlg = ui.dialog({ title: 'Lịch sử xác nhận', icon: 'fa-clock-rotate-left', size: 'lg', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
        ums.api.call({
            action: 'NS_ChamCong_XacNhan/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: S.uid(),
            strsanpham_Id: nsId + st.thang + st.nam, strTinhTrang_Id: '', pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            ui.table({ el: dlg.body, rows: S.rows(r), columns: [
                { title: 'Kết quả', prop: 'TINHTRANG_TEN' },
                { title: 'Nội dung', prop: 'NOIDUNG' },
                { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TAIKHOAN' },
                { title: 'Thời gian xác nhận', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }
            ] });
        }).catch(function (err) { dlg.body.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử xác nhận'); });
    }

    root.addEventListener('click', function (ev) {
        var xn = ev.target.closest('[data-xn]');
        if (xn) { xacNhanMot(xn); return; }
        var ls = ev.target.closest('[data-ls]');
        if (ls) { lichSu(ls.getAttribute('data-ls')); return; }
        var a = ev.target.closest('[data-a]');
        if (!a) return;
        switch (a.getAttribute('data-a')) {
            case 'tim': tim(); ghiChu(); break;
            case 'luu': luu(); break;
            case 'quatrinh': quaTrinh(); break;
            case 'xacnhan': xacNhanTatCa(); break;
        }
    });
})();
