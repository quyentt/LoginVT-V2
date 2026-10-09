/* =========================================================================
   Thu tiền — phiếu nháp, lưu chứng từ, xem/in chứng từ
   (dùng chung cho thutien và viewthutien, nạp sau _chung_thutien.js)
   ---------------------------------------------------------------------------
   Bản gốc (thutien.js / viewthutien.js):
     genHTML_NoiDung_BienLai · genHTML_NoiDung_BienLai_DongTruoc   → ve()
     cbGenCombo_HinhThucThu · cbGenCombo_LoaiTienTe · cbGenCombo_DonViTinh
     tinhHeSoGiaTien · insertSumAfterTable(popup, [4,5,6])
     save_HDBL   → luuBienLai()   TC_DaNop/ThemMoi | TC_TaiChinh_Rut/ThemMoi
     save_HD     → luuHoaDon()    TC_DaNop/ThemMoi (strXuatHoaDonTrucTiep = 1)
     save_ThuTien→ thuTien()      TC_DaNop/ThemMoi [+ HDDT_HoaDon/ThemMoi | HDDT_HoaDon/ThemMoi_Nhap
                                   → TC_HoaDonNhap/ThemMoi → TC_HoaDonNhap_ChuaThu/ThemMoi]
     delete_BL   → huyBienLai()   TC_SoBienLai/HuyBienLai
     showPreviewHoaDon            → xemTruocHD()
     edu.extend.getData_Phieu + printPhieu + closePhieu → xem() / dong()
       (xem/in dùng ums.phieu.viewer — tầng chung, assets/js/phieu.js)

   Phiếu nháp của bản gốc là tệp mẫu Edit_DHCNTTTN_BIENLAITHU_2018.html /
   Edit_DHCNTTTN_BIENLAIRUT_2018.html nạp từ máy chủ rồi đọc ngược ô bảng.
   Ở đây dựng lại bằng ums.ui, giữ đúng các ô mà mẫu có: mẫu THU có Hình thức
   thu + Loại tiền tệ, mẫu RÚT không có (→ strHinhThucThu_Id rỗng, như bản
   gốc đọc #dropHinhThucThuPTC_PT_Edit không tồn tại). Ô "Đơn vị tính" chung
   của mẫu (#dropDonViTinhPTC_PT_Edit) đã bị comment trong mẫu đang chạy,
   nên "Xuất biên lai"/"Xuất hoá đơn" gửi strDonViTinh_Ids toàn chuỗi rỗng —
   giữ nguyên (chỉ "Thu tiền" gửi đơn vị từng dòng).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var TT = ums.phieuthu.thuTien;
    var M = TT.money;
    var P = TT.phieu = {};

    function userId() { return (ums.session && ums.session.userId) || ''; }

    /* Id bản ghi mới: máy chủ trả ở data.Id (ngoài Data). Dữ liệu dựng thử
       không đặt được khoá ngoài Data nên đọc thêm Data.Id. */
    function newId(r) {
        if (r && r.raw && r.raw.Id !== undefined && r.raw.Id !== null) return r.raw.Id;
        return r && r.data && r.data.Id !== undefined ? r.data.Id : '';
    }

    /* =====================================================================
       Phiếu nháp
       ===================================================================== */
    P.ve = function (c) {
        var cfg = c.cfg, p = c.phieu, el = c.el;
        var dt = c.doiTuong || {};
        var coTHU = p.bThu;                                  // mẫu phiếu thu có HTTT + loại tiền
        var dvtDong = cfg.dvtTungDong;

        function o(lbl, v) { return '<div><span>' + esc(lbl) + ':</span> <b>' + esc(M.e(v)) + '</b></div>'; }

        var fields = '';
        if (coTHU) {
            fields += ui.field('Hình thức thu', '<select class="ums-select" data-p="httt"><option value="">Đang tải…</option></select>');
            fields += ui.field('Loại tiền tệ', '<select class="ums-select" data-p="ltt"><option value="">Đang tải…</option></select>');
        }
        if (cfg.ngayChungTu) {
            fields += ui.field('Ngày lập phiếu', '<input class="ums-input" data-p="ngay" placeholder="dd/mm/yyyy" value="' + esc(p.ngayLap) + '">',
                { hint: 'Đổi ngày ở đây trước khi bấm "Xuất biên lai".' });
        }

        var nut = [];
        nut.push(ui.btn('save', { text: 'Xuất biên lai', mod: 'primary', attr: { 'data-pa': 'bienLai' } }));
        if (cfg.nutThuTien && p.bThu) nut.push(ui.btn('save', { text: 'Thu tiền', mod: 'save', attr: { 'data-pa': 'thuTien' } }));
        var coXuatHD = cfg.xuatHD === 'truoc' ? (p.dongTruoc && p.bThu)
            : (p.dongTruoc || p.bThu);                        // viewthutien
        if (cfg.hddt && p.bThu) nut.push(ui.btn('search', { text: 'Xem trước HĐ', mod: 'ghost', attr: { 'data-pa': 'xemHD' }, icon: 'fa-eye' }));
        if (coXuatHD) nut.push(ui.btn('save', { text: 'Xuất hóa đơn', mod: 'ghost', attr: { 'data-pa': 'hoaDon' } }));
        if (cfg.hddt && p.bThu) {
            (c.nutHDDT || []).forEach(function (n) {
                nut.push('<button type="button" class="ums-btn ums-btn--ghost" data-hddt="' + esc(n.ID) + '" title="' + esc(n.TEN) + '">' +
                    '<i class="fa-light fa-file-invoice"></i><span>' + esc(n.TEN) + '</span></button>');
            });
        }

        el.phieu.innerHTML =
            '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Viết <span class="thutien-loai">' + esc(p.loai) + '</span></h1>' +
            '<div class="ums-page__actions">' + ui.btn('close', { attr: { 'data-pa': 'dong' } }) + '</div></div>' +
            '<div class="ums-panel">' +
            '<div class="ums-panel__body">' +
            '  <div class="thutien-phieu__info">' +
                 o('Họ và tên', M.e(dt.HODEM) + ' ' + M.e(dt.TEN)) + o('Mã', dt.MASO) + o('Ngày sinh', dt.NGAYSINH) +
                 o('Mã số thuế', dt.MASOTHUECANHAN) + o('Địa chỉ', dt.NOIOHIENNAY) + o('Lớp', dt.DAOTAO_LOPQUANLY_N1_TEN) +
                 o('Ngành', dt.NGANHHOC_N1_TEN) + o('Khóa', dt.KHOAHOC_N1_TEN) +
            '  </div>' +
            (fields ? '<div class="thutien-phieu__fields">' + fields + '</div>' : '') +
            '  <div data-p="bang"></div>' +
            '  <div class="thutien-phieu__tong"><div>Tổng tiền: <b data-p="tong">' + esc(p.tongTT) + '</b></div>' +
            '  <div>Số tiền bằng chữ: <i data-p="chu">' + esc(p.bangChu) + '</i></div></div>' +
            '</div>' +
            '<div class="ums-panel__foot thutien-actions">' + nut.join('') + '</div>' +
            '</div>';

        var q = function (s) { return el.phieu.querySelector('[data-p="' + s + '"]'); };

        /* bảng dòng phiếu: Stt · Khoản · Nội dung · [Đơn vị] · Số lượng · Đơn giá · Thành tiền */
        var cols = [
            { title: p.bThu ? 'Khoản thu' : 'Khoản rút', prop: 'ten' },
            { title: 'Nội dung', prop: 'noiDung' }
        ];
        if (dvtDong) cols.push({ title: 'Đơn vị', width: '170px', render: function (d, i) {
            return '<select class="ums-select" data-dvt="' + i + '"><option value="">Đang tải…</option></select>';
        } });
        cols.push(
            { title: 'Số lượng', prop: 'soLuongText', cls: 'is-center', width: '90px', sum: function () { return '<b>' + esc(p.tongSL) + '</b>'; } },
            { title: 'Đơn giá', prop: 'donGiaText', cls: 'is-right', width: '150px', sum: function () { return '<b>' + esc(p.tongDG) + '</b>'; } },
            { title: 'Thành tiền', prop: 'thanhTienText', cls: 'is-right', width: '160px', sum: function () { return '<b class="thutien-sum">' + esc(p.tongTT) + '</b>'; } }
        );
        ui.table({ el: q('bang'), columns: cols, rows: p.dong, tableCls: 'ums-table--lined thutien-t' });

        if (q('ngay')) ui.datepicker(q('ngay'));

        /* danh mục: QLTC.HTTHU, QLTC.LTT, TAICHINH.DVT (edu.system.getList_DanhMucDulieu) */
        if (coTHU) {
            c.dmRows('QLTC.HTTHU').then(function (rows) {
                p.htttRows = rows;
                var cb = M.combo(rows, {});
                var sel = q('httt');
                if (!sel) return;
                sel.innerHTML = cb.html;
                var v = cb.def;
                // cbGenCombo_HinhThucThu: chưa có giá trị thì chọn dòng MA = "TM"
                if (!v) { var tm = rows.find(function (r) { return r.MA === 'TM'; }); v = tm ? tm.ID : ''; }
                M.setSelect(sel, v);
            }).catch(function (err) { ums.api.handle(err, 'hình thức thu'); });
            c.dmRows('QLTC.LTT').then(function (rows) {
                p.lttRows = rows;
                var cb = M.combo(rows, {});
                var sel = q('ltt');
                if (!sel) return;
                sel.innerHTML = cb.html;
                // cbGenCombo_LoaiTienTe: luôn chọn dòng MA = "VND" (không có thì bỏ chọn)
                var vnd = rows.find(function (r) { return r.MA === 'VND'; });
                M.setSelect(sel, vnd ? vnd.ID : '');
                docSo();
            }).catch(function (err) { ums.api.handle(err, 'loại tiền tệ'); });
        }
        if (dvtDong) {
            c.dmRows('TAICHINH.DVT').then(function (rows) {
                p.dvtRows = rows;
                var cb = M.combo(rows, {});
                el.phieu.querySelectorAll('[data-dvt]').forEach(function (sel) {
                    sel.innerHTML = cb.html;
                    M.setSelect(sel, cb.def);
                });
            }).catch(function (err) { ums.api.handle(err, 'đơn vị tính'); });
        }

        /* Đổi loại tiền → đọc số thành chữ ở máy chủ (thutien). Bản gốc gửi
           ô tfoot:eq(5) = tổng ĐƠN GIÁ (lệch cột); ở đây gửi tổng thành tiền. */
        function docSo() {
            if (!cfg.docSoMayChu) return;
            var sel = q('ltt');
            if (!sel || sel.selectedIndex < 0) return;
            var loai = sel.options[sel.selectedIndex].text.trim();
            if (loai === '' || !sel.value) return;
            if (loai === 'VND') loai = 'đồng';
            c.call({
                action: 'TC_ThongTinChung/DocSoThanhChu', method: 'GET', silent: true, versionAPI: 'v1.0',
                dSoTien: String(p.tongTT).replace(/,/g, ''), strLoaiTien: loai
            }).then(function (r) {
                if (r.data !== null && r.data !== undefined && q('chu')) q('chu').textContent = r.data;
            }).catch(function (err) { console.warn('[thutien] DocSoThanhChu', err); });
        }
        if (q('ltt')) q('ltt').addEventListener('change', docSo);

        /* nút */
        el.phieu.onclick = function (ev) {
            var b = ev.target.closest('[data-pa],[data-hddt]');
            if (!b) return;
            if (b.hasAttribute('data-hddt')) { hddt(c, b.getAttribute('data-hddt')); return; }
            var a = b.getAttribute('data-pa');
            if (a === 'dong') P.dong(c);
            else if (a === 'bienLai') ui.confirm('Bạn có chắc chắn muốn lưu chứng từ không!').then(function (y) { if (y) luuBienLai(c); });
            else if (a === 'thuTien') ui.confirm('Bạn có chắc chắn muốn thu tiền không!').then(function (y) { if (y) thuTien(c); });
            else if (a === 'hoaDon') ui.confirm('Bạn có chắc chắn muốn xuất hóa đơn không!').then(function (y) { if (y) luuHoaDon(c); });
            else if (a === 'xemHD') xemTruocHD(c);
        };

        ui.swap(el.main, el.phieu);
    };

    /* ---------- đọc các ô của phiếu nháp ------------------------------- */
    function doc(c) {
        var p = c.phieu, el = c.el;
        var q = function (s) { return el.phieu.querySelector('[data-p="' + s + '"]'); };
        var r = { httt: '', httRow: null, httPlaceholder: '', ltt: undefined, lttTen: '', dvt: [], dvtTen: [], ngay: '' };

        var s1 = q('httt');
        if (s1) {
            r.httt = s1.value;
            r.httRow = (p.htttRows || []).find(function (x) { return String(x.ID) === s1.value && s1.value !== ''; }) || null;
            if (!r.httRow && s1.selectedIndex >= 0) r.httPlaceholder = s1.options[s1.selectedIndex].text;
        }
        var s2 = q('ltt');
        if (s2) {
            r.ltt = s2.selectedIndex < 0 ? null : s2.value;
            // strLoaiTienTeTen = (val != "") ? text đã chọn .trim() : ""
            r.lttTen = r.ltt !== '' && s2.selectedIndex >= 0 ? s2.options[s2.selectedIndex].text.trim() : '';
        }
        el.phieu.querySelectorAll('[data-dvt]').forEach(function (sel) {
            var v = sel.selectedIndex < 0 ? '' : sel.value;
            r.dvt[Number(sel.getAttribute('data-dvt'))] = v;
            r.dvtTen[Number(sel.getAttribute('data-dvt'))] = v !== '' ? sel.options[sel.selectedIndex].text.trim() : '';
        });
        // _getNgayLapPhieuOverride: có "/" và đủ 3 phần khác rỗng thì dùng, không thì ""
        var ng = q('ngay');
        if (ng) {
            var v = ng.value;
            var a = v ? v.split('/') : [];
            r.ngay = v && v.indexOf('/') !== -1 && a.length >= 3 && a[0] && a[1] && a[2] ? v : '';
        }
        return r;
    }

    /* ---------- vòng lặp đọc dòng của save_* ---------------------------- */
    function mang(c, o) {
        var p = c.phieu;
        var a = { ids: [], tg: [], nd: [], sl: [], dg: [], st: [], ltt: [], dvtRong: [], dvt: [], dvtTen: [], canDoi: [] };
        p.dong.forEach(function (d, i) {
            if (!M.checkValue(d.khoanId)) return;                 // "Có vấn đề" → bỏ qua dòng
            a.ids.push(d.khoanId);
            a.tg.push(String(d.tgId));
            a.nd.push(d.noiDung);
            a.sl.push(M.soTien(d.soLuongText));
            a.dg.push(M.soTien(d.donGiaText));
            a.st.push(M.soTien(d.thanhTienText));
            a.ltt.push(o.ltt == null ? '' : o.ltt);
            a.dvtRong.push('');
            a.dvt.push(o.dvt[i] == null ? '' : o.dvt[i]);
            a.dvtTen.push(o.dvtTen[i] == null ? '' : o.dvtTen[i]);
            if (p.dongTruoc) a.canDoi.push(d.canDoi);             // chỉ dòng thu trước có ô cân đối
        });
        return {
            n: a.ids.length,
            ids: a.ids.join(','), tg: a.tg.join(','), nd: a.nd.join('#'),
            sl: a.sl.join(','), dg: a.dg.join(','), st: a.st.join(','),
            ltt: a.ltt.join(','), dvtRong: a.dvtRong.join(','),
            dvt: a.dvt.join(','), dvtTen: a.dvtTen.join(','),
            canDoi: a.canDoi.join(',')
        };
    }

    function rongTien(m, c) {
        // if (strSoTien == 0) — chỉ đúng khi không còn dòng nào
        if (m.st == 0) {   // eslint-disable-line eqeqeq
            ui.toast('Tổng các khoản chọn phải lớn 0!', 'warn');
            P.dong(c);
            return true;
        }
        return false;
    }

    /* ---------- save_HDBL ------------------------------------------------ */
    function luuBienLai(c) {
        var cfg = c.cfg, p = c.phieu;
        var o = doc(c);
        var m = mang(c, o);
        if (rongTien(m, c)) return;
        var laThutien = c.key === 'thutien';
        var call;
        if (p.bThu) {
            call = {
                action: 'TC_DaNop/ThemMoi', versionAPI: 'v1.0',
                strNguoiThucHien_Id: '',
                strTaiChinh_CacKhoanThu_Ids: m.ids,
                strTaiChinh_SoTien_s: m.st,
                strTaiChinh_NoiDung_s: m.nd,
                strDonGia_s: m.dg,
                strSoLuong_s: m.sl,
                strDonViTinh_Ids: m.dvtRong,
                strLoaiTienTe_Ids: m.ltt,
                strQLSV_NguoiHoc_Id: c.hsId,
                strDaoTao_ThoiGianDaoTao_Id: m.tg,
                strDaoTao_ToChucCT_Id: '',
                strHinhThucThu_Id: o.httt,
                strXuatHoaDonTrucTiep: '',
                strNguonDuLieu_Id: ''
            };
            if (laThutien) {
                call.strCanDoiKhoanPhaiNop = m.canDoi;
                call.strNgayXuatChungTu = o.ngay || c.ngayXuat;
            }
        } else {
            call = {
                action: 'TC_TaiChinh_Rut/ThemMoi', versionAPI: 'v1.0',
                strNguoiThucHien_Id: '',
                strTaiChinh_CacKhoanThu_Ids: m.ids,
                strTaiChinh_SoTien_s: m.st,
                strTaiChinh_NoiDung_s: m.nd,
                strQLSV_NguoiHoc_Id: c.hsId,
                strDaoTao_ThoiGianDaoTao_Id: m.tg,
                strHinhThucThu_Id: o.httt,          // mẫu rút không có ô này → ""
                strXuatHoaDonTrucTiep: '',
                strNguonDuLieu_Id: '',
                strCANBOTHUCHIENRUT_Id: userId()
            };
            if (laThutien) {
                call.strNgayChungTuRut = o.ngay || c.ngayInput('truoc');   // || txtNgayChungTu
                call.strCanDoiKhoanPhaiNop = m.canDoi;
            }
        }
        return guiVaXem(c, call, p.bThu ? 'BIENLAI' : 'BIENLAIRUT', p.bThu ? 'Thực hiện thu tiền thành công' : 'Thực hiện rút tiền thành công');
    }

    /* ---------- save_HD --------------------------------------------------- */
    function luuHoaDon(c) {
        var o = doc(c);
        var m = mang(c, o);
        if (rongTien(m, c)) return;
        var call = {
            action: 'TC_DaNop/ThemMoi', versionAPI: 'v1.0',
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Ids: m.ids,
            strTaiChinh_SoTien_s: m.st,
            strTaiChinh_NoiDung_s: m.nd,
            strDonGia_s: m.dg,
            strSoLuong_s: m.sl,
            strDonViTinh_Ids: m.dvtRong,
            strLoaiTienTe_Ids: m.ltt,
            strQLSV_NguoiHoc_Id: c.hsId,
            strDaoTao_ThoiGianDaoTao_Id: m.tg,
            strDaoTao_ToChucCT_Id: '',
            strHinhThucThu_Id: o.httt,
            strXuatHoaDonTrucTiep: 1,
            strNguonDuLieu_Id: ''
        };
        if (c.key === 'thutien') call.strCanDoiKhoanPhaiNop = m.canDoi;
        return guiVaXem(c, call, 'HOADON', 'Thực hiện thu tiền thành công', true);
    }

    /* informSaveSuccess của save_HDBL/save_HD: nạp lại tình trạng, rồi mở chứng từ vừa lưu */
    function guiVaXem(c, call, loai, okText, laHoaDon) {
        return c.call(call).then(function (r) {
            var id = newId(r);
            c.loadTT();
            if (laHoaDon) xoaThuTruoc(c);                        // save_HD: "Reset nợ"
            ui.toast(okText, 'ok');
            P.xem(c, id, loai);
        }).catch(function (err) { ums.api.handle(err, 'lưu chứng từ'); });
    }

    /* ---------- save_ThuTien ----------------------------------------------- */
    function payloadThuTien(c, phuongThuc) {
        var o = doc(c);
        var m = mang(c, o);
        if (rongTien(m, c)) return null;
        var hRow = o.httRow;
        var ma, ten;
        if (hRow) {
            ma = String(hRow.MA);                            // <option id="MA">
            var tc = String(hRow.THONGTIN1);                 // <option name="THONGTIN1">
            ten = (tc !== 'undefined' && tc !== 'null') ? tc : ' ' + hRow.TEN;   // text() của option có dấu cách đầu
        } else {
            ma = undefined;
            ten = o.httPlaceholder;
        }
        return {
            action: 'TC_DaNop/ThemMoi', versionAPI: 'v1.0',
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Ids: m.ids,
            strTaiChinh_SoTien_s: m.st,
            strTaiChinh_NoiDung_s: m.nd,
            strDonGia_s: m.dg,
            strSoLuong_s: m.sl,
            strDonViTinh_Ids: m.dvt,
            strDonViTinhTen_s: m.dvtTen,
            strLoaiTienTe_Ids: m.ltt,
            strCanDoiKhoanPhaiNop: m.canDoi,
            strLoaiTienTe: o.lttTen,
            strQLSV_NguoiHoc_Id: c.hsId,
            strDaoTao_ThoiGianDaoTao_Id: m.tg,
            strHinhThucThu_Id: o.httt,
            strHinhThucThu_MA: ma,
            strHinhThucThu_TEN: ten,
            strXuatHoaDonTrucTiep: '',
            strNguonDuLieu_Id: '',
            dKhongSinhChungTu: 0,
            strPhieuThuTheoPhoiSan_Id: '',
            strPhuongThuc_MA: phuongThuc,
            strNgayXuatChungTu: o.ngay || c.ngayXuat,
            strDaoTao_ToChucCT_Id: c.ctId                    // khoá trùng trong bản gốc: giá trị sau thắng
        };
    }

    function thuTien(c) {
        var call = payloadThuTien(c, undefined);
        if (!call) return;
        return c.call(call).then(function () {
            c.loadTT();
            ui.toast('Thực hiện thu tiền thành công', 'ok');
            P.dong(c);
        }).catch(function (err) { ums.api.handle(err, 'thu tiền'); });
    }

    /* ---------- nút hoá đơn điện tử (.btnXuat_HDDT) ------------------------ */
    function hddt(c, nutId) {
        var n = (c.nutHDDT || []).find(function (x) { return String(x.ID) === String(nutId); });
        if (!n) return;
        var maPT = String(n.MA);                     // title
        var nhap = String(n.THONGTIN2);              // name
        var S = ums.session || { api: {} };
        var goc = S.api ? S.api.HDDT : undefined;

        function datApi() { if (n.THONGTIN4 && S.api) S.api.HDDT = n.THONGTIN4; }
        function traApi() { if (S.api) S.api.HDDT = goc; }

        if (maPT.indexOf('HDDTNHAP') === 0) {
            var obj = payloadThuTien(c, maPT);
            if (!obj) return;
            datApi();
            return hddtNhap(c, obj, nhap).then(traApi, traApi);
        }
        return ui.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!').then(function (yes) {
            if (!yes) return;
            var obj = payloadThuTien(c, maPT);
            if (!obj) return;
            datApi();
            return c.call(obj).then(function (r) {
                // TC_DaNop/ThemMoi xong: Message = danh sách id khoản → gửi sang HĐĐT
                var o2 = Object.assign({}, obj, { action: 'HDDT_HoaDon/ThemMoi', strTaiChinh_CacKhoanThu_Ids: r.message });
                return c.call(o2).then(function (d) {
                    c.loadTT();
                    ui.toast('Thực hiện thu tiền thành công', 'ok');
                    P.xem(c, newId(d), 'HOADON');
                }, function (err) {
                    // Bản gốc báo lỗi RỒI báo "thành công" — ở đây nói rõ: tiền đã thu, HĐĐT lỗi
                    c.loadTT();
                    ui.toast('Đã thu tiền nhưng xuất hóa đơn điện tử lỗi: ' + err.message, 'bad', { timeout: 0 });
                    P.dong(c);
                });
            }).catch(function (err) { ums.api.handle(err, 'thu tiền'); })
                .then(traApi, traApi);
        });
    }

    function hddtNhap(c, obj, moTa) {
        var o1 = Object.assign({}, obj, { action: 'HDDT_HoaDon/ThemMoi_Nhap' });
        return c.call(o1).then(function (d) {
            var duongDan = d.data;
            // link file nháp
            var link = String(duongDan == null ? '' : duongDan);
            if (link.indexOf('http') === -1) {
                var base = (ums.session && ums.session.api && ums.session.api.HDDT) || '';
                link = base.substring(0, base.length - 3) + duongDan;
                if (link.indexOf('http') === -1) link = ((ums.session && ums.session.host) || '') + link;
            }
            var w = window.open(link, '_blank');
            if (w) w.focus(); else ui.toast('Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!', 'warn');

            // saveNhap → saveNhap_ChuaThu
            return c.call({
                action: 'TC_HoaDonNhap/ThemMoi', versionAPI: 'v1.0',
                strId: '', strQLSV_NguoiHoc_Id: obj.strQLSV_NguoiHoc_Id,
                strDuongDanFileHoaDon: duongDan, strMoTa: moTa,
                dDaXuatChinhThuc: 0, strNguoiThucHien_Id: userId()
            }).then(function (r2) {
                var o3 = Object.assign({}, o1, { action: 'TC_HoaDonNhap_ChuaThu/ThemMoi', strTaiChinh_HoaDonNhap_Id: newId(r2) });
                ui.toast('Thêm bản nháp thành công', 'ok');
                return c.call(o3).catch(function (err) { ums.api.handle(err, 'hóa đơn nháp chưa thu'); });
            });
        }).catch(function (err) { ums.api.handle(err, 'hóa đơn điện tử nháp'); });
    }

    /* ---------- showPreviewHoaDon --------------------------------------- */
    function xemTruocHD(c) {
        var p = c.phieu;
        var o = doc(c);
        var box = c.el.phieu.querySelector('.ums-panel__body').cloneNode(true);
        box.querySelectorAll('select').forEach(function (s) {
            var src = c.el.phieu.querySelector(s.hasAttribute('data-dvt') ? '[data-dvt="' + s.getAttribute('data-dvt') + '"]' : '[data-p="' + s.getAttribute('data-p') + '"]');
            var t = src && src.selectedIndex >= 0 && src.value ? src.options[src.selectedIndex].text : '—';
            var sp = document.createElement('b');
            sp.textContent = t;
            s.parentNode.replaceChild(sp, s);
        });
        box.querySelectorAll('input').forEach(function (i) {
            var sp = document.createElement('b');
            sp.textContent = o.ngay || i.value;
            i.parentNode.replaceChild(sp, i);
        });
        var coXuatHD = !!c.el.phieu.querySelector('[data-pa="hoaDon"]');
        var coHDDT = c.el.phieu.querySelector('[data-hddt]');
        ui.dialog({
            title: 'Xem trước hóa đơn (chưa phát hành) — ' + p.loai, icon: 'fa-eye', size: 'xl',
            body: '<div style="position:relative"><div style="position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;' +
                'font-size:72px;font-weight:800;color:rgba(220,38,38,.10);transform:rotate(-18deg)">XEM TRƯỚC</div>' +
                '<div data-x="noiDung"></div></div>',
            buttons: (coXuatHD || coHDDT) ? [{
                text: 'Xuất HĐ điện tử ngay', kind: 'save', onClick: function () {
                    // ưu tiên #btnXuat_HD, không có thì nút HĐĐT đầu tiên (như bản gốc)
                    setTimeout(function () {
                        var b = c.el.phieu.querySelector('[data-pa="hoaDon"]') || c.el.phieu.querySelector('[data-hddt]');
                        if (b) b.click();
                        else ui.toast('Không tìm thấy nút Xuất HĐ điện tử!', 'warn');
                    }, 50);
                }
            }] : []
        }).body.querySelector('[data-x="noiDung"]').appendChild(box);
    }

    /* =====================================================================
       Đóng phiếu (closePhieu) — xoá bảng thu trước như bản gốc
       ===================================================================== */
    function xoaThuTruoc(c) {
        c.bang.truoc = [];
        c.el.pane_truoc.querySelectorAll('[data-lkt]').forEach(function (x) { x.checked = false; });
        c.drawBang('truoc');
    }

    P.dong = function (c) {
        c.el.phieu.onclick = null;
        if (c.viewer) c.viewer = null;
        xoaThuTruoc(c);
        ui.swap(c.el.phieu, c.el.main);
        c.el.phieu.innerHTML = '';
        if (c.tab) c.setTab(c.tab);
    };

    /* =====================================================================
       Xem / in chứng từ đã lưu (getData_Phieu + printPhieu + delete_BL)
       ===================================================================== */
    P.xem = function (c, id, loai) {
        var el = c.el, cfg = c.cfg;
        c.phieuId = id;
        var coHuy = cfg.huyBienLai;
        el.phieu.innerHTML =
            '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + (loai === 'HOADON' ? 'Hóa đơn' : 'Chứng từ') + '</h1>' +
            '<div class="ums-page__actions">' +
                ui.btn('close', { attr: { 'data-pa': 'dong' } }) +
                ui.btn('print', { mod: 'primary', attr: { 'data-pa': 'in' } }) +
                (coHuy ? ui.btn('close', { text: 'Hủy biên lai', mod: 'danger', attr: { 'data-pa': 'huy' } }) : '') +
            '</div></div>' +
            '<div class="ums-panel"><div class="ums-panel__body">' +
            '  <div class="thutien-bar"><div class="thutien-bar__l" data-p="lien" hidden></div>' +
            '  <div class="thutien-bar__r" data-p="mau" hidden></div></div>' +
            '  <div data-p="khung"></div></div></div>';

        var q = function (s) { return el.phieu.querySelector('[data-p="' + s + '"]'); };
        {
            c.viewer = ums.phieu.viewer(q('khung'), {
                tools: q('lien'),
                onMau: function (list, mau) {
                    var h = q('mau');
                    if (!list || list.length < 2) { h.hidden = true; h.innerHTML = ''; return; }
                    h.hidden = false;
                    h.innerHTML = '<span class="ums-u-fz13 ums-u-muted">Mẫu in:</span> ' + ui.chips(list.map(function (m) { return { key: m, label: m }; }), mau);
                }
            });
            c.viewer.show({ id: id, loai: loai });
        }

        el.phieu.onclick = function (ev) {
            var ch = ev.target.closest('[data-chip]');
            if (ch && c.viewer && q('mau').contains(ch)) { c.viewer.doiMau(ch.getAttribute('data-chip')); return; }
            var b = ev.target.closest('[data-pa]');
            if (!b) return;
            var a = b.getAttribute('data-pa');
            if (a === 'dong') P.dong(c);
            else if (a === 'in') {
                // printPhieu: remove_PhoiIn → in → về tab 1 → đóng
                if (c.viewer && c.viewer.print('Phiếu thu tiền') !== false) { c.tab = 'tt'; P.dong(c); }
            } else if (a === 'huy') {
                ui.confirm('Bạn có chắc chắn muốn hủy biên lai không!', { tone: 'bad', ok: 'Hủy biên lai' }).then(function (y) {
                    if (!y) return;
                    c.call({ action: 'TC_SoBienLai/HuyBienLai', versionAPI: 'v1.0', strBienLai_Id: c.phieuId, strNguoiThucHien_Id: '' })
                        .then(function () {
                            c.loadTT();
                            P.dong(c);
                            ui.toast('Xóa biên lai thành công!', 'ok');
                        }).catch(function (err) { ums.api.handle(err, 'hủy biên lai'); });
                });
            }
        };

        if (el.phieu.hidden) ui.swap(el.main, el.phieu);
        else { window.scrollTo(0, 0); ui.reveal(el.phieu); }
    };
})();
