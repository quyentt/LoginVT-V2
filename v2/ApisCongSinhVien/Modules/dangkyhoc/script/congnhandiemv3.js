/* =========================================================================
   congnhandiemv3 — Đăng ký xin công nhận điểm (bản v3, Cổng sinh viên - thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/congnhandiemv3.html + script/congnhandiemv3.js
   Phần chung với congnhandiem (bản cũ): script/_congnhandiem.js (ums.cnd).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc: MỘT cột — thanh lọc (Kế hoạch, Chương trình, "Xem học phần",
   "Xem kết quả", nút báo cáo "In đơn") + HAI tab:
     · "Công nhận từ bảng điểm": bảng học phần, mỗi dòng mở biểu mẫu "Từ bảng điểm" ngay trong trang (ums.cnd.bangDiem, host = gốc màn);
     · "Công nhận từ chứng chỉ": Loại/Tên chứng chỉ/Cấp độ + "Xem thông tin"/"Lưu thông tin";
        cột trái Nơi cấp, Ngày cấp, minh chứng — cột phải "Danh sách các đầu điểm phải nhập";
        dưới là "Danh sách các thông tin phải nhập"; cuối là hai bảng học phần
        (được xét công nhận ↔ đã chọn xét công nhận) với "Xác nhận" / "Hủy xác nhận".
   Người học = ums.session.userId (vỏ thủ vai đã đặt, như edu.system.userId của gốc).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên; SV_CongNhanDiem_MH · pkg_congthongtin_congnhandiem trừ khi ghi):
     LayDSKeHoachCongNhan · pkg_dangkyhoc_chung.LayDSChuongTrinh · LayDSChuongTrinhHoc
     pkg_diem_thongtin.LayDSDiem_CoSoCongNhanDiem (Nơi cấp / Cơ sở đào tạo đã học)
     Chứng chỉ: danh mục DIEM.CHUNGCHI.PHANLOAI → LayDSDiem_ThongTin_ChungChi → LaYDSDiem_TT_CC_CapDo
       (strDaoTao_HocPhan_Id = "" như gốc) → LayDSDauDiem_CC_CapDo_QuyDoi + LayGiaTriNguoiHoc_Diem_CC (điểm đã nhập)
       + LayTTDiem_NguoiHoc_Diem_CC (nơi cấp / ngày cấp) + LayDSHocPhanDuocQuyDoiTheoCC / LayDSHocPhanDaXacNhanTheoCC
       + SV_CND_ThongTin_MH PKG_CONGTHONGTIN_CND_THONGTIN.LayDSTTCCMoRong (thông tin phải nhập)
     Lưu chứng chỉ: Them_Diem_NguoiHoc_Diem_CC → mỗi đầu điểm Them_Diem_NH_Diem_CC_DuLieu;
       thông tin mở rộng: PKG_CONGTHONGTIN_CND_THONGTIN.Them_Diem_CC_TT_MoRong_DuLieu
     Xác nhận / hủy học phần: Them_Diem_NguoiHoc_Diem_CN / Xoa_Diem_NguoiHoc_Diem_CN (strLoai "CC")
     Xem kết quả: LayDSKetQuaCongNhanTuBangDiem (rsBangDiem, rsCC) + tệp minh chứng SV_Files
     Báo cáo "In đơn": ums.report.mount (getList_MauImport "zonebtnBaoCao_CongNhanDiem", màn gốc không có vùng Import)
   ---------------------------------------------------------------------------
   Giữ như gốc (chỗ lạ / cần nghiệp vụ xác nhận):
     · Lưu chứng chỉ gửi strDaoTao_HocPhan_Id = học phần của dòng "Từ bảng điểm" mở gần nhất
       (gốc dùng chung biến me.strHocPhan_Id; tab chứng chỉ không có chỗ chọn học phần) → thường rỗng.
     · Ghi chú của từng đầu điểm hiện ra nhưng KHÔNG được gửi đi (gốc chỉ gửi dDiem).
     · Nơi cấp / Ngày cấp / minh chứng có dấu (*) nhưng gốc chỉ kiểm minh chứng — giữ nguyên.
     · Thiếu minh chứng thì gốc báo "Bạn cần chọn file minh chứng!" rồi VẪN lưu tiếp phần
       "thông tin phải nhập" (thiếu return) — giữ nguyên.
     · Bảng "Xem kết quả": minh chứng từ bảng điểm tra theo khoá "BangDiem"+kế hoạch+người học+kế hoạch+học phần
       của gốc (lưu lại theo khoá có CƠ SỞ đào tạo) nên gần như luôn rỗng — giữ nguyên, chờ nghiệp vụ.
   Sửa (lỗi rõ của gốc):
     · Tiêu đề bảng kết quả từ bảng điểm xếp "Khoa xác nhận" trước "Phí công nhận" trong khi dữ liệu
       đổ theo thứ tự Phí → Khoa (bản chứng chỉ đúng) → xếp lại cho khớp dữ liệu.
     · Cột "Chọn" (ô đánh dấu) của hai bảng kết quả không nơi nào đọc → bỏ.
     · Chuỗi Loại → Tên chứng chỉ → Cấp độ nay khoá theo tầng (gốc mở sẵn).
     · Biểu mẫu "từ bảng điểm": xem thêm chú thích ở _congnhandiem.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.cnd, e = C.e, arr = C.arr, esc = ui.esc;
    var root = document.getElementById('cnd-congnhandiemv3');
    var sv = C.uid();
    var st = { ds: [], hp: '', dd: [], tn: [] };

    function sel(k, ph) { return C.sel(k, ph); }
    root.innerHTML = pat.page('Đăng ký xin công nhận điểm', '') +
        C.locHtml(ui.btn('search', { text: 'Xem học phần', icon: 'fa-magnifying-glass', attr: { 'data-a': 'xem' } }) +
            ui.btn('search', { text: 'Xem kết quả', mod: 'out-warn', icon: 'fa-magnifying-glass', attr: { 'data-a': 'kq' } }) +
            '<span data-z="bc"></span>') +
        ui.tabs([{ key: 'bd', text: 'Công nhận từ bảng điểm' }, { key: 'cc', text: 'Công nhận từ chứng chỉ' }], 'bd', 'data-ctab') +
        '<div data-pane="bd">' + pat.panel({ title: false, flush: true, zone: 'ds' }) + '</div>' +
        '<div data-pane="cc" hidden>' +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
                ui.field('Loại chứng chỉ', sel('loai', 'Chọn loại chứng chỉ')) +
                ui.field('Tên chứng chỉ', sel('cc', 'Chọn chứng chỉ')) +
                ui.field('Cấp độ', sel('capdo', 'Chọn cấp độ')) +
                '<div class="ums-field ums-field--fit"><div class="ums-row">' +
                    ui.btn('search', { text: 'Xem thông tin', icon: 'fa-eye', attr: { 'data-a': 'xemcc' } }) +
                    ui.btn('save', { text: 'Lưu thông tin', mod: 'warn', attr: { 'data-a': 'luucc' } }) + '</div></div></div>' }) +
            '<div class="cnd3-top">' +
                pat.panel({ title: false, body:
                    ui.field('Nơi cấp', sel('noicap', 'Chọn nơi cấp'), { required: true }) +
                    ui.field('Ngày cấp', '<input class="ums-input" data-f="ngaycap" data-date placeholder="Nhập ngày cấp" autocomplete="off">', { required: true }) +
                    '<input type="hidden" data-f="ngayhethan">' +
                    ui.field('Nhập minh chứng', '<div data-z="tepcc"></div>', { required: true }) }) +
                pat.panel({ title: 'Danh sách các đầu điểm phải nhập', icon: 'fa-list-ol', flush: true, zone: 'dd' }) +
            '</div>' +
            pat.panel({ title: 'Danh sách các thông tin phải nhập', icon: 'fa-pen-field', flush: true, zone: 'tt', cls: 'ums-u-mt-4' }) +
            '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                pat.panel({ title: 'Danh sách các học phần được xét công nhận', icon: 'fa-book-open-reader', flush: true, zone: 'chua',
                    foot: '<div class="ums-row ums-row--end ums-u-w100">' + ui.btn('search', { text: 'Xác nhận', mod: 'primary', icon: 'fa-square-check', attr: { 'data-a': 'xacnhan' } }) + '</div>' }) +
                pat.panel({ title: 'Danh sách các học phần đã chọn xét công nhận', icon: 'fa-clipboard-check', flush: true, zone: 'da',
                    foot: '<div class="ums-row ums-row--end ums-u-w100">' + ui.xoaChon('input[data-da]', { goc: '.ums-panel', text: 'Hủy xác nhận', attr: { 'data-a': 'huy' } }) + '</div>' }) +
            '</div>' +
        '</div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }
    function ngay(el, giaTri) {
        if (!el) return;
        if (el._flatpickr) el._flatpickr.setDate(giaTri || null, false, 'd/m/Y');
        else el.value = giaTri || '';
    }

    /* ---------- Tab "Công nhận từ bảng điểm" -------------------------------- */
    z('ds').innerHTML = ui.empty('Chọn kế hoạch, chương trình rồi bấm "Xem học phần"', 'fa-hand-pointer');
    function dk(r, i) {
        return ui.btn('search', { text: 'Từ bảng điểm', mod: 'out-primary', icon: 'fa-table-list', cls: 'ums-btn--sm', attr: { 'data-bd': i } });
    }
    function taiDS() {
        return C.taiDS(z('ds'), { strDaoTao_ChuongTrinh_Id: v('ct'), strDiem_KeHoachCongNhan_Id: v('kh') }, dk)
            .then(function (d) { st.ds = d; });
    }
    C.napLoc(f('kh'), f('ct'));
    if (window.jQuery) jQuery([f('kh'), f('ct')]).on('select2:select', taiDS);

    /* ---------- Tab "Công nhận từ chứng chỉ" -------------------------------- */
    var tepCC = C.tep(z('tepcc'));
    C.noiCap().then(function (d) { pat.fill(f('noicap'), d, { head: 'Chọn nơi cấp' }); });
    function khoaCC() { return 'ChungChi' + v('kh') + sv + v('capdo'); }
    function loiNhac() {
        st.dd = []; st.tn = [];
        z('dd').innerHTML = ui.empty('Chọn loại chứng chỉ, chứng chỉ và cấp độ rồi bấm "Xem thông tin"', 'fa-hand-pointer');
        z('tt').innerHTML = ui.empty('Chưa có thông tin phải nhập', 'fa-pen-field');
        z('chua').innerHTML = z('da').innerHTML = ui.empty('Chưa chọn chứng chỉ', 'fa-hand-pointer');
        f('noicap').value = ''; if (window.jQuery) jQuery(f('noicap')).trigger('change.select2');
        ngay(f('ngaycap'), ''); f('ngayhethan').value = '';
        tepCC.clear();
    }
    loiNhac();
    C.chungChi({ loai: f('loai'), cc: f('cc'), capdo: f('capdo') }, { hocPhan: function () { return ''; }, onXoa: loiNhac, onCapDo: xemCC });

    function xemCC() {
        if (!v('capdo')) { ui.toast('Vui lòng chọn cấp độ', 'warn'); return; }
        napDauDiem(); napTTCC(); napChua(); napDa(); napThongTin();
        tepCC.load(khoaCC());
    }
    function napDauDiem() {
        z('dd').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        C.call('dauDiem', { strDiem_ThongTin_CC_CapDo_Id: v('capdo') }).then(function (r) {
            st.dd = arr(r.data);
            ui.table({ el: z('dd'), rows: st.dd, tableCls: 'ums-table--lined ums-table--tight', empty: 'Không có đầu điểm', columns: [
                { title: 'Tên đầu điểm nhập', prop: 'DIEM_THANHPHANDIEM_TEN' },
                { title: 'Thang điểm', prop: 'THANGDIEM_TEN' },
                { title: 'Kết quả', width: '150px', render: function (x) { return '<input class="ums-input ums-input--sm" data-diem="' + esc(x.ID) + '" autocomplete="off">'; } },
                { title: 'Ghi chú', render: function (x) { return '<input class="ums-input ums-input--sm" data-ghichu="' + esc(x.ID) + '" autocomplete="off">'; } }
            ] });
            st.dd.forEach(function (x) {
                C.call('giaTriCC', { strQLSV_NguoiHoc_Id: sv, strDiem_KeHoachCongNhan_Id: v('kh'), strDiem_ThongTin_CC_CapDo_Id: v('capdo'),
                    strDiem_ThanhPhanDiem_Id: x.DIEM_THANHPHANDIEM_ID }).then(function (g) {
                    arr(g.data).forEach(function (a) {
                        var d = z('dd').querySelector('[data-diem="' + x.ID + '"]'), gc = z('dd').querySelector('[data-ghichu="' + x.ID + '"]');
                        if (d) d.value = e(a.DIEM);
                        if (gc) gc.value = e(a.GHICHU);
                    });
                }).catch(function () { /* điểm đã nhập chưa có thì để trống, như gốc */ });
            });
        }).catch(function (err) { z('dd').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đầu điểm'); });
    }
    function napTTCC() {
        C.call('ttCC', { strDiem_TT_CC_CapDo_Id: v('capdo'), strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: v('ct'),
            strDiem_KeHoachCongNhan_Id: v('kh') }).then(function (r) {
            var d = arr(r.data), a = d.length ? d[0] : {};
            f('noicap').value = e(a.DIEM_COSODAOTAOCONGNHANDIEM_ID);
            if (window.jQuery) jQuery(f('noicap')).trigger('change.select2');
            ngay(f('ngaycap'), e(a.NGAYCAP));
            f('ngayhethan').value = e(a.NGAYHETHAN);
        }).catch(function (err) { ums.api.handle(err, 'thông tin chứng chỉ'); });
    }
    function cotHP(dau) {
        return [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
            { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_SOTIN', cls: 'is-center' },
            { title: 'Điểm quy đổi', prop: 'DIEMCONGNHAN', cls: 'is-center' },
            { title: 'Chọn xác nhận', cls: 'is-center', width: '110px', render: function (x) {
                return '<input type="checkbox" data-' + dau + '="' + esc(e(x.DAOTAO_HOCPHAN_ID)) + '">'; } }
        ];
    }
    function napChua() {
        z('chua').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        C.call('chuaDK', { strDiem_TT_CC_CapDo_Id: v('capdo'), strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: v('ct'),
            strDiem_KeHoachCongNhan_Id: v('kh') }).then(function (r) {
            ui.table({ el: z('chua'), rows: arr(r.data), empty: 'Không có học phần được xét công nhận', columns: cotHP('chua') });
        }).catch(function (err) { z('chua').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần được xét'); });
    }
    function napDa() {
        z('da').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        C.call('daDK', { strDiem_TT_CC_CapDo_Id: v('capdo'), strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: v('ct'),
            strDiem_KeHoachCongNhan_Id: v('kh') }).then(function (r) {
            ui.table({ el: z('da'), rows: arr(r.data), empty: 'Chưa chọn học phần nào', columns: cotHP('da') });
        }).catch(function (err) { z('da').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần đã chọn'); });
    }
    function chon(dau) {
        return Array.prototype.map.call(z(dau).querySelectorAll('input[data-' + dau + ']:checked'), function (c) { return c.getAttribute('data-' + dau); });
    }
    function tsHP(id) {
        return { strLoai: 'CC', strDiem_TT_CC_CapDo_Id: v('capdo'), strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: v('ct'),
            strDiem_KeHoachCongNhan_Id: v('kh'), strDaoTao_HocPhan_Id: id, strNgayCap: v('ngaycap'), strNoiCap_Id: v('noicap'),
            strNgayHetHan: v('ngayhethan'), strNguoiThucHien_Id: sv };
    }
    function chayHP(ids, khoa, title, okText) {
        return ui.batch(ids.map(function (id) {
            return Object.assign({ action: C.A[khoa][0], func: C.A[khoa][1] }, tsHP(id));
        }), { title: title, okText: okText, show: true }).then(function () { napChua(); napDa(); });
    }

    /* ---------- Danh sách các thông tin phải nhập --------------------------- */
    var tepTN = {};       // ID trường → khung tệp (KIEUDULIEU = FILE)
    function kieu(x) { return String(e(x.KIEUDULIEU)).toUpperCase(); }
    function giaTriGoc(x) { return e(x.TRUONGTHONGTIN_GIATRI); }
    function oTN(x) {
        var id = esc(x.ID), k = kieu(x), val = esc(giaTriGoc(x));
        var khoa = x.DUOCSUA === 0 ? ' readonly' : '';
        var cao = x.DORONG ? ' style="height:' + Number(x.DORONG) + 'px"' : '';
        if (k === 'TEXT') return x.DORONG ? '<textarea class="ums-input ums-input--sm" data-tn="' + id + '"' + cao + khoa + '>' + val + '</textarea>'
            : '<input class="ums-input ums-input--sm" data-tn="' + id + '" value="' + val + '"' + khoa + ' autocomplete="off">';
        if (k === 'NUMBER') return '<input class="ums-input ums-input--sm" data-tn="' + id + '" value="' + val + '" inputmode="decimal"' + khoa + ' autocomplete="off">';
        if (k === 'DATE') return '<input class="ums-input ums-input--sm" data-tn="' + id + '" value="' + val + '" data-date placeholder="dd/mm/yyyy"' + khoa + ' autocomplete="off">';
        if (k === 'LIST') return '<select class="ums-select ums-input--sm" data-tn="' + id + '" data-dm="' + esc(e(x.MABANGDANHMUC)) + '" data-v="' + val + '"><option value=""></option></select>';
        if (k === 'TINH' || k === 'HUYEN' || k === 'XA') return '<select class="ums-select ums-input--sm" data-tn="' + id + '" data-dc="' + k + '" data-v="' + val + '" data-s2 data-ph="Chọn"><option value=""></option></select>';
        if (k === 'FILE') return '<div data-tnfile="' + id + '"></div>';
        return '';
    }
    function napThongTin() {
        z('tt').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        C.call('ttMoRong', { strDiem_KeHoachCongNhan_Id: v('kh'), strDiem_ThongTin_ChungChi_Id: v('cc'), strQLSV_NguoiHoc_Id: sv })
            .then(function (r) {
                st.tn = arr(r.data); tepTN = {};
                ui.table({ el: z('tt'), rows: st.tn, tableCls: 'ums-table--lined ums-table--tight', empty: 'Không có thông tin phải nhập', columns: [
                    { title: 'Loại thông tin', width: '35%', render: function (x) {
                        return esc(e(x.TEN)) + (Number(x.BATBUOC) === 1 ? ' <span class="ums-u-danger">*</span>' : ''); } },
                    { title: 'Giá trị', render: oTN }
                ] });
                ui.enhance(z('tt'));
                /* Ô chọn danh mục */
                Array.prototype.forEach.call(z('tt').querySelectorAll('select[data-dm]'), function (s) {
                    if (!s.getAttribute('data-dm')) return;
                    ums.api.dm(s.getAttribute('data-dm')).then(function (rows) { pat.fill(s, rows, { head: pat.dmTitle(rows) || '-- Chọn --' }); s.value = s.getAttribute('data-v'); }).catch(function () {});
                });
                /* Tỉnh → Huyện → Xã theo từng NHÓM (edu.extend.genDropTinhThanh) */
                var nhom = {};
                st.tn.forEach(function (x) {
                    var k = kieu(x);
                    if (k !== 'TINH' && k !== 'HUYEN' && k !== 'XA') return;
                    (nhom[e(x.NHOM)] || (nhom[e(x.NHOM)] = {}))[k] = x;
                });
                Object.keys(nhom).forEach(function (n) { diaChi(nhom[n]); });
                /* Trường kiểu tệp */
                st.tn.forEach(function (x) {
                    if (kieu(x) !== 'FILE') return;
                    var h = z('tt').querySelector('[data-tnfile="' + x.ID + '"]');
                    if (!h) return;
                    tepTN[x.ID] = C.tep(h);
                    tepTN[x.ID].load(sv + x.ID);
                });
            }).catch(function (err) { z('tt').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thông tin phải nhập'); });
    }
    function diaChi(g) {
        var elT = g.TINH && z('tt').querySelector('[data-tn="' + g.TINH.ID + '"]');
        var elH = g.HUYEN && z('tt').querySelector('[data-tn="' + g.HUYEN.ID + '"]');
        var elX = g.XA && z('tt').querySelector('[data-tn="' + g.XA.ID + '"]');
        if (!elT) return;
        var ch = pat.chain([elT, elH, elX].filter(Boolean), { phatLai: false });
        pat.dmTinhThanh().then(function (ds) {
            function con(cha) { return ds.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }
            function dat(el, cha) {
                if (!el) return;
                pat.fill(el, con(cha), { head: 'Chọn' });
                el.value = el.getAttribute('data-v') || '';
                if (window.jQuery) jQuery(el).trigger('change.select2');
            }
            dat(elT, null);
            if (elT.value) dat(elH, elT.value);
            if (elH && elH.value) dat(elX, elH.value);
            ch.sync();
            if (window.jQuery) {
                jQuery(elT).on('select2:select select2:clear', function () { if (elH) elH.setAttribute('data-v', ''); dat(elH, elT.value); if (elX) { elX.setAttribute('data-v', ''); dat(elX, ''); } ch.sync(); });
                if (elH) jQuery(elH).on('select2:select select2:clear', function () { if (elX) elX.setAttribute('data-v', ''); dat(elX, elH.value); ch.sync(); });
            }
        }).catch(function () {});
    }
    function giaTri(x) {
        if (kieu(x) === 'FILE') return '';      // gốc đọc ô div nên luôn gửi rỗng
        var el = z('tt').querySelector('[data-tn="' + x.ID + '"]');
        return el ? el.value : '';
    }
    function trongTN(x) {
        if (kieu(x) === 'FILE') { var h = z('tt').querySelector('[data-tnfile="' + x.ID + '"]'); return !C.soTep(h); }
        return !String(giaTri(x)).trim();
    }

    /* ---------- Lưu thông tin chứng chỉ ------------------------------------ */
    function luuCC() {
        if (!v('capdo')) { ui.toast('Vui lòng chọn cấp độ', 'warn'); return; }
        var pTep = Promise.resolve();
        if (C.soTep(z('tepcc'))) { luuChungChi(); pTep = tepCC.save(khoaCC()); }
        else ui.toast('Bạn cần chọn file minh chứng!', 'warn');

        var thieu = st.tn.filter(function (x) { return Number(x.BATBUOC) === 1 && trongTN(x); });
        if (thieu.length) {
            ui.toast('Trường thông tin bắt buộc: ' + thieu.map(function (x) { return e(x.TEN); }).join(', '), 'warn');
            return;
        }
        var doi = st.tn.filter(function (x) {
            if (kieu(x) === 'FILE') { var h = z('tt').querySelector('[data-tnfile="' + x.ID + '"]'); return !!(h && C.soTep(h)); }
            return String(giaTri(x)) !== String(giaTriGoc(x));
        });
        if (!doi.length) { ui.toast('Cập nhật thành công', 'ok'); return; }
        pTep.then(function () {
            return doi.reduce(function (p, x) {
                return p.then(function () {
                    return C.call('themMoRong', { strDiem_KeHoachCongNhan_Id: v('kh'), strDiem_ThongTin_ChungChi_Id: v('cc'),
                        strQLSV_NguoiHoc_Id: sv, strTruongThongTin_Id: x.ID, strTruongThongTin_GiaTri: giaTri(x) })
                        .then(function () { return tepTN[x.ID] ? tepTN[x.ID].save(sv + x.ID) : null; });
                });
            }, Promise.resolve());
        }).then(function () { ui.toast('Cập nhật thành công', 'ok'); napThongTin(); })
          .catch(function (err) { ums.api.handle(err, 'lưu thông tin phải nhập'); });
    }
    function luuChungChi() {
        C.call('themCC', { strLoai: 'CC', strDiem_TT_CC_CapDo_Id: v('capdo'), strQLSV_NguoiHoc_Id: sv,
            strDaoTao_ChuongTrinh_Id: v('ct'), strDiem_KeHoachCongNhan_Id: v('kh'), strDaoTao_HocPhan_Id: st.hp,
            strNgayCap: v('ngaycap'), strNoiCap_Id: v('noicap'), strNgayHetHan: v('ngayhethan') }).then(function () {
            if (!st.tn.length) ui.toast('Thêm mới chứng chỉ thành công!', 'ok');
            return st.dd.reduce(function (p, x) {
                var el = z('dd').querySelector('[data-diem="' + x.ID + '"]');
                return p.then(function () {
                    return C.call('themCCDL', { strDiem_TT_CC_CapDo_Id: v('capdo'), strQLSV_NguoiHoc_Id: sv,
                        strDaoTao_ChuongTrinh_Id: v('ct'), strDiem_KeHoachCongNhan_Id: v('kh'), strNoiCap_Id: v('noicap'),
                        strDiem_ThanhPhanDiem_Id: x.DIEM_THANHPHANDIEM_ID, dDiem: el ? el.value.trim() : '' });
                });
            }, Promise.resolve());
        }).then(function () {
            napDauDiem(); napTTCC(); napChua(); napDa();
            tepCC.load(khoaCC());
        }).catch(function (err) { ums.api.handle(err, 'lưu chứng chỉ'); });
    }

    /* ---------- Xem kết quả công nhận điểm ---------------------------------- */
    function cotKQ() {
        return [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
            { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_SOTIN', cls: 'is-center' },
            { title: 'Kết quả công nhận', prop: 'DIEMCONGNHAN', cls: 'is-center' },
            { title: 'Thông tin công nhận', prop: 'THONGTINCONGNHAN' },
            { title: 'Phí công nhận', cls: 'is-right', sum: true, sumProp: 'PHICONGNHAN', render: function (x) { return ui.money(x.PHICONGNHAN); } },
            { title: 'Khoa xác nhận', prop: 'KHOAXACNHAN', cls: 'is-center' },
            { title: 'Đào tạo xác nhận', prop: 'DAOTAOXACNHAN', cls: 'is-center' }
        ];
    }
    function veTep(host, khoa) {
        if (!khoa.length) { host.innerHTML = ui.empty('Không có minh chứng', 'fa-paperclip'); return; }
        host.innerHTML = khoa.map(function (k, i) { return '<div data-kq="' + i + '"></div>'; }).join('');
        khoa.forEach(function (k, i) { C.tep(host.querySelector('[data-kq="' + i + '"]'), { readonly: true }).load(k); });
    }
    function xemKetQua() {
        var tenKH = f('kh').selectedIndex >= 0 ? f('kh').options[f('kh').selectedIndex].text : '';
        var kh = v('kh');
        var dlg = ui.dialog({
            title: 'Xem kết quả công nhận điểm - ' + tenKH, icon: 'fa-file-magnifying-glass', size: 'xl',
            body: '<div class="ums-legend">Kết quả công nhận từ bảng điểm</div><div data-x="bd"></div>' +
                '<p class="ums-u-fz13 ums-u-mt-2 ums-u-mb-2"><b>Minh chứng kết quả nhận từ bảng điểm:</b></p><div data-x="tbd"></div>' +
                '<div class="ums-legend ums-legend--warn ums-legend--cach">Kết quả công nhận từ chứng chỉ</div><div data-x="cc"></div>' +
                '<p class="ums-u-fz13 ums-u-mt-2 ums-u-mb-2"><b>Minh chứng kết quả nhận từ chứng chỉ:</b></p><div data-x="tcc"></div>'
        });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        q('bd').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        C.call('ketQua', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: v('ct'), strDiem_KeHoachCongNhan_Id: kh })
            .then(function (r) {
                var d = r.data || {}, bd = arr(d.rsBangDiem), cc = arr(d.rsCC);
                ui.table({ el: q('bd'), rows: bd, empty: 'Chưa có kết quả công nhận từ bảng điểm', columns: cotKQ() });
                ui.table({ el: q('cc'), rows: cc, empty: 'Chưa có kết quả công nhận từ chứng chỉ', columns: cotKQ() });
                var hp = [], cd = [];
                bd.forEach(function (x) { if (x.DAOTAO_HOCPHAN_ID && hp.indexOf(x.DAOTAO_HOCPHAN_ID) < 0) hp.push(x.DAOTAO_HOCPHAN_ID); });
                cc.forEach(function (x) { if (x.DIEM_THONGTIN_CC_CAPDO_ID && cd.indexOf(x.DIEM_THONGTIN_CC_CAPDO_ID) < 0) cd.push(x.DIEM_THONGTIN_CC_CAPDO_ID); });
                veTep(q('tbd'), hp.map(function (x) { return 'BangDiem' + kh + sv + kh + x; }));
                veTep(q('tcc'), cd.map(function (x) { return 'ChungChi' + kh + sv + x; }));
            }).catch(function (err) { q('bd').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả công nhận'); });
    }

    /* ---------- Báo cáo "In đơn" -------------------------------------------- */
    ums.report.mount(z('bc'), { import: false, reportText: 'In đơn', collect: function (add) {
        add('strDiem_TT_CC_CapDo_Id', v('capdo'));
        add('strDaoTao_ChuongTrinh_Id', v('ct'));
        add('strDiem_KeHoachCongNhan_Id', v('kh'));
        add('strDaoTao_HocPhan_Id', st.hp);
        add('strQLSV_NguoiHoc_Id', sv);
    } });

    /* ---------- Sự kiện ------------------------------------------------------ */
    root.addEventListener('click', function (ev) {
        var b;
        if ((b = ev.target.closest('[data-ctab]'))) {
            var t = b.getAttribute('data-ctab');
            ui.tabsActive(root, t, 'data-ctab');
            Array.prototype.forEach.call(root.querySelectorAll('[data-pane]'), function (p) { p.hidden = p.getAttribute('data-pane') !== t; });
            return;
        }
        if ((b = ev.target.closest('[data-bd]'))) {
            var row = st.ds[Number(b.getAttribute('data-bd'))];
            if (!row) return;
            st.hp = e(row.DAOTAO_HOCPHAN_ID);
            C.bangDiem({ host: root, row: row, kh: v('kh'), ct: v('ct'), v3: true, onDone: taiDS,
                ngayCC: function () { return { cap: v('ngaycap'), het: v('ngayhethan') }; } });
            return;
        }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'xem') taiDS();
        else if (a === 'kq') xemKetQua();
        else if (a === 'xemcc') xemCC();
        else if (a === 'luucc') luuCC();
        else if (a === 'xacnhan') {
            var ids = chon('chua');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn đăng ký không?').then(function (yes) {
                if (yes) chayHP(ids, 'themCN', 'Đang đăng ký công nhận', 'Thêm mới thành công!');
            });
        } else if (a === 'huy') {
            var idsX = chon('da');
            if (!idsX.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy xác nhận' }).then(function (yes) {
                if (yes) chayHP(idsX, 'xoaCN', 'Đang hủy xác nhận', 'Thực hiện thành công!');
            });
        }
    });
})();
