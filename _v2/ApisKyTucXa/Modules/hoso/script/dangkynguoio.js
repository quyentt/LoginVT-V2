/* =========================================================================
   Đăng ký người ở (khởi tạo hồ sơ → xếp phòng → tạo hợp đồng)
   Bản gốc: ApisKyTucXa/Modules/hoso/html/dangkynguoio.html + script/dangkynguoio.js (1.740 dòng)
   ---------------------------------------------------------------------------
   Bố cục gốc: MỘT cột, hai vùng thay chỗ nhau — #zoneEdit (biểu mẫu hồ sơ 5 nhóm, mở sẵn, một nút "Tạo hợp đồng")
   và #zoneHopDong (Tạo hợp đồng: thông tin hợp đồng · người đăng ký · bảng Chính sách ưu đãi · bảng Nội dung miễn giảm;
   "Lưu và In hợp đồng" rồi hiện hai nút in). Màn không có danh sách (tblKhoiTao_NhanSu không có trên trang).
   Luồng (giữ như gốc): Tạo hợp đồng → thiếu phòng / ngày vào thì hỏi "tiếp tục thêm hồ sơ không?" → KTX_DoiTuongOKyTucXa/ThemMoi
   → có phòng + ngày vào thì hỏi "xếp phòng không?" → KTX_DaXepPhong/ThemMoi → KTX_DaXepPhong/LayChiTiet (strId = Id vừa xếp)
   đổ sang khung hợp đồng (ngày ký = ngày vào, ngày kết thúc = ngày ra) → KTX_HopDong/ThemMoi → in HopDongSinhVien /
   HopDongLuuHocSinh (strHopDong_Id, strSoTienBangChu = đọc số tổng tiền).
   Lời gọi khác: TC_KhoanThu/LayDanhSach (NHOMCACKHOANTHU_MA "KTX" → bảng chính sách, "MienGiamKTX" → bảng miễn giảm;
   MA "KTXMG.TIENPHONG" → strTaiChinh_CacKhoanThu_Id) · danh mục KTX.DVT0 (hình thức) · KTX.TTHD (MA "1" → strTinhTrang_Id) ·
   KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi (strKTX_DoiTuongOKyTucXa_Id, strKTX_Phong_Id, dSoThang).
   Khác gốc (lỗi rõ):
     · loadHopDong gốc ghi vào main_doc.ChuaCoHopDong (không tồn tại) → strTinhTrang_Id luôn rỗng; nay = ID của KTX.TTHD có MA "1".
     · strAnhCaNhan gốc đọc ô txtNO_AnhCaNhan không có → luôn rỗng; nay gửi đường dẫn ảnh vừa tải. KIỂM TRÊN HOST.
     · Khoản thu gốc lấy trang đầu (pageSize 10) → nay pageSize 100000 để đủ khoản.
     · Nút "Tính tiền" gốc không có xử lý (handler gắn vào lớp không có, lại lỗi cú pháp; kết quả API bị bỏ) → nay gọi API,
       lấy số đầu tiên trả về; không có thì Tổng = Số tháng × Số tiền/tháng/chỗ × Số chỗ thuê. KIỂM TRÊN HOST.
     · Khung hợp đồng có nút Đóng (về biểu mẫu trống) — gốc không có đường quay lại.
   Cố ý bỏ: sửa / xoá hồ sơ, danh sách, ô lọc (dropSearch_*, getList_Phong2, viewForm_NO, CapNhat_NO, delete_NO…) — không có
   phần tử trên trang; dòng tĩnh txtMG_NoiDungMienGiam / dropMG_HinhThucMienGiam không được đọc khi lưu.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, X = ums.ktxHoSo;
    var root = document.getElementById('ktx-dangkynguoio');
    if (!root) return;

    root.innerHTML =
        '<div data-z="hs">' + pat.panel({ title: 'Đăng ký người ở', icon: 'fa-user-plus', zone: 'hsBody',
            tools: ui.btn('save', { text: 'Tạo hợp đồng', icon: 'fa-file-lines', attr: { 'data-a': 'taohd' } }) }) + '</div>' +
        '<div data-z="hd" hidden>' + pat.panel({ title: 'Tạo hợp đồng', icon: 'fa-file-signature', zone: 'hdBody',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('save', { text: 'Lưu và In hợp đồng', attr: { 'data-a': 'luuhd' } }) +
                ui.btn('print', { text: '1. In hợp đồng sinh viên', attr: { 'data-a': 'in', 'data-ma': 'HopDongSinhVien', hidden: '' } }) +
                ui.btn('print', { text: '2. In hợp đồng lưu học sinh', attr: { 'data-a': 'in', 'data-ma': 'HopDongLuuHocSinh', hidden: '' } }) }) + '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    /* ---------- Biểu mẫu hồ sơ + nhóm 5 ------------------------------------- */
    var FIELDS = X.fieldsNO();
    var zHs = z('hsBody');
    zHs.innerHTML = '<div data-z="truong"></div><div data-z="xp" class="ums-u-mt-4"></div>';
    var fm = X.veTruong(z('truong'), FIELDS);
    var xp = X.khoiXepPhong(z('xp'));

    /* ---------- Khung hợp đồng ------------------------------------------------ */
    var zHd = z('hdBody');
    function o(k, extra) { return '<input class="ums-input" data-hd="' + k + '"' + (extra || '') + ' autocomplete="off">'; }
    zHd.innerHTML =
        '<div class="ums-grid ums-grid--12">' +
        '<div class="ums-legend" style="grid-column:1 / -1">1) Thông tin hợp đồng</div>' +
        c6(ui.field('Số hợp đồng', o('so'), { required: true })) + c6('') +
        c6(ui.field('Ngày ký', o('ngayky', ' data-date placeholder="dd/mm/yyyy"'))) +
        c6(ui.field('Ngày kết thúc', o('ngaykt', ' data-date placeholder="dd/mm/yyyy"'))) +
        c6(ui.field('Số chỗ thuê', o('socho', ' type="number" value="1"'))) +
        c6(ui.field('Bao phòng', '<select class="ums-select" data-hd="bao"><option value="0">Không</option><option value="1">Có</option></select>')) +
        c6(ui.field('Số tháng', o('sothang', ' type="number" placeholder="6"'))) +
        c6(ui.field('Số tiền/tháng/chỗ', o('tienthang', ' data-money placeholder="400,000"'))) +
        c6(ui.field('Tổng tiền thuê', o('tongtien', ' data-money placeholder="2,400,000"'))) +
        '<div style="grid-column:span 6" class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Tính tiền', icon: 'fa-calculator', mod: 'out-primary', attr: { 'data-a': 'tinhtien' } }) + '</div>' +
        '<div class="ums-legend" style="grid-column:1 / -1">2) Thông tin người đăng ký</div>' +
        '<div style="grid-column:1 / -1"><div class="ums-kv"><span>Người đăng ký</span><b><span data-hd="ten"></span> <i class="ums-u-muted">(<span data-hd="maso"></span>)</i></b></div></div>' +
        c6(ui.field('Tòa nhà', '<select class="ums-select" data-hd="tn" data-ph="Chọn tòa nhà"><option value=""></option></select>')) +
        c6(ui.field('Phòng đăng ký', '<select class="ums-select" data-hd="phong" data-ph="Chọn phòng"><option value=""></option></select>')) +
        c6(ui.field('Ngày vào', o('ngayvao', ' data-date placeholder="dd/mm/yyyy"'))) +
        c6(ui.field('Ngày ra', o('ngayra', ' data-date placeholder="dd/mm/yyyy"'))) +
        '<div class="ums-legend" style="grid-column:1 / -1">3) Chính sách ưu đãi</div>' +
        '<div style="grid-column:1 / -1" data-hd="cs"></div>' +
        '<div class="ums-legend" style="grid-column:1 / -1">4) Nội dung miễn giảm</div>' +
        '<div style="grid-column:1 / -1" data-hd="mg"></div>' +
        '</div>';
    function c6(h) { return '<div style="grid-column:span 6">' + h + '</div>'; }
    function hd(k) { return zHd.querySelector('[data-hd="' + k + '"]'); }
    function v(k) { return pat.val(hd(k)); }
    ui.enhance(zHd);

    var st = { doiTuongId: '', hopDongId: '', tinhTrangId: '', khoanTienPhongId: '', dtKhoanThu: [], dtMienGiam: [], hinhThuc: [] };

    var noi = ums.ktx.noiToaNhaPhong(hd('tn'), hd('phong'));   // đổ tòa + nối Tòa nhà → Phòng (bản chung _ktx.js)
    ums.api.dm('KTX.TTHD').then(function (rs) { rs.forEach(function (r) { if (String(r.MA) === '1') st.tinhTrangId = r.ID; }); }, X.loi('tình trạng hợp đồng'));
    Promise.all([
        ums.api.dm('KTX.DVT0'),
        ums.api.call({ action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', strNhomCacKhoanThu_Id: '', strcanboquanly_id: '', pageIndex: 1, pageSize: 100000 })
    ]).then(function (r) {
        st.hinhThuc = r[0];
        X.arr(r[1].data).forEach(function (k) {
            if (k.NHOMCACKHOANTHU_MA == 'KTX') st.dtKhoanThu.push(k);
            else if (k.NHOMCACKHOANTHU_MA == 'MienGiamKTX') { st.dtMienGiam.push(k); if (k.MA == 'KTXMG.TIENPHONG') st.khoanTienPhongId = k.ID; }
        });
        veBangKhoan('cs', st.dtKhoanThu, 'Số lượng ưu đãi', 'sl');
        veBangKhoan('mg', st.dtMienGiam, 'Phần trăm miễn giảm', 'pt');
    }, X.loi('danh sách khoản thu'));

    function veBangKhoan(zone, rows, nhan, k) {
        var opt = '<option value=""></option>' + st.hinhThuc.map(function (h) { return '<option value="' + esc(h.ID) + '">' + esc(h.TEN) + '</option>'; }).join('');
        ui.table({ el: hd(zone), rows: rows, empty: 'Không có khoản thu', columns: [
            { title: 'Khoản thu', prop: 'TEN' },
            { title: nhan, width: '200px', render: function (r) { return '<input class="ums-input ums-input--sm" data-kt="' + k + '" data-id="' + esc(r.ID) + '" placeholder="' + esc(nhan) + '" autocomplete="off">'; } },
            { title: 'Hình thức', width: '300px', render: function (r) { return '<select class="ums-select" data-kt="ht' + k + '" data-id="' + esc(r.ID) + '">' + opt + '</select>'; } }
        ] });
    }
    function docBang(rows, k) {
        var ids = [], gia = [], ht = [];
        rows.forEach(function (r) {
            ids.push(r.ID);
            var i = zHd.querySelector('[data-kt="' + k + '"][data-id="' + r.ID + '"]'), s = zHd.querySelector('[data-kt="ht' + k + '"][data-id="' + r.ID + '"]');
            gia.push(i ? i.value : ''); ht.push(s ? s.value : '');
        });
        return { ids: ids, gia: gia, ht: ht };
    }
    function chuoi(a) { return a.join('#'); }   // gốc: toString().replace(/,/g, "#")

    /* Tiền trong ô nhập: dấu phẩy ngăn nghìn (inputsotien gốc) */
    zHd.addEventListener('input', function (e) {
        if (!e.target.matches('[data-money]')) return;
        var s = pat.num(e.target.value); if (s.charAt(0) === '0') s = s.substring(1);
        e.target.value = pat.money(s);
    });
    if (window.jQuery) {
        jQuery(hd('ngayky')).on('change', function () { hd('ngayvao').value = v('ngayky'); });
        jQuery(hd('ngaykt')).on('change', function () { hd('ngayra').value = v('ngaykt'); });
    }

    /* ---------- Sự kiện --------------------------------------------------------- */
    root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]'); if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'taohd') taoHopDong();
        else if (a === 'luuhd') luuHopDong();
        else if (a === 'tinhtien') tinhTien();
        else if (a === 'in') inHopDong(b.getAttribute('data-ma'));
        else if (a === 'dong') veBieuMau();
    });

    function taoHopDong() {
        var thieu = X.thieu(fm, FIELDS);
        if (thieu) { ui.toast('Vui lòng nhập ' + thieu, 'warn'); return; }
        var c = xp.val();
        if (!c.phong || !c.ngayVao) {
            ui.confirm('Không thể xếp phòng do không chọn phòng hoặc ngày vào. Bạn có muốn tiếp tục thêm hồ sơ không?').then(function (yes) { if (yes) luuHoSo(c); });
        } else luuHoSo(c);
    }
    function luuHoSo(c) {
        ums.api.call(X.saveNO(fm.values(), null)).then(function (d) {
            var id = X.e(d.raw && d.raw.Id);
            if (id && c.phong && c.ngayVao) {
                ui.confirm('Thêm hồ sơ thành công. Bạn có chắc chắn muốn xếp phòng không?').then(function (yes) {
                    if (!yes) return;
                    X.xepPhong(id, c.phong, c.ngayVao, c.ngayRa).then(function (r) {
                        if (r.message) { ui.toast(r.message, 'warn'); return; }
                        ui.toast('Đăng ký thành công!', 'ok');
                        moHopDong(X.e(r.raw && r.raw.Id));
                    }, X.loi('xếp phòng'));
                });
            } else ui.toast('Thêm mới thành công!', 'ok');
        }, X.loi('thêm hồ sơ'));
    }

    function moHopDong(xepPhongId) {
        st.hopDongId = ''; st.doiTuongId = '';
        hd('so').value = ''; hd('sothang').value = ''; hd('tienthang').value = ''; hd('tongtien').value = ''; hd('socho').value = '1';
        hd('bao').value = '0'; if (window.jQuery) jQuery(hd('bao')).trigger('change.select2');
        datNutIn(false);
        ui.swap(z('hs'), z('hd'), { top: true });
        ums.api.call({ action: 'KTX_DaXepPhong/LayChiTiet', method: 'GET', strId: xepPhongId }).then(function (d) {
            var r = X.arr(d.data)[0]; if (!r) return;
            st.doiTuongId = X.e(r.KTX_DOITUONGOKYTUCXA_ID);
            hd('ten').textContent = X.hoTen(r, 'KTX_DOITUONGOKYTUCXA_'); hd('maso').textContent = X.e(r.KTX_DOITUONGOKYTUCXA_MASO);
            hd('ngayvao').value = X.e(r.NGAYVAO); hd('ngayra').value = X.e(r.NGAYRA);
            hd('ngayky').value = X.e(r.NGAYVAO); hd('ngaykt').value = X.e(r.NGAYRA);
            noi.dat(r.KTX_TOANHA_ID, r.KTX_PHONG_ID);              // đặt bằng mã, tự đồng bộ khoá / mở
        }, X.loi('chi tiết xếp phòng'));
    }
    function veBieuMau() {
        ui.swap(z('hd'), z('hs'), { top: true });
        fm.reset(); xp.reset();
    }
    function datNutIn(daLuu) {
        var bLuu = root.querySelector('[data-a="luuhd"]'); if (bLuu) bLuu.hidden = daLuu;
        Array.prototype.forEach.call(root.querySelectorAll('[data-a="in"]'), function (b) { b.hidden = !daLuu; });
    }

    function tinhTien() {
        var thang = Number(v('sothang')) || 0, tien = Number(pat.num(v('tienthang'))) || 0, cho = Number(v('socho')) || 0;
        var tuTinh = thang * tien * cho;
        ums.api.call({ action: 'KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi', method: 'GET', strKTX_DoiTuongOKyTucXa_Id: st.doiTuongId, strKTX_Phong_Id: v('phong'), dSoThang: thang })
        .then(function (d) {
            var so = null, x = d.data;
            if (typeof x === 'number' || (typeof x === 'string' && x !== '' && !isNaN(Number(x)))) so = Number(x);
            else if (Array.isArray(x) && x[0]) Object.keys(x[0]).some(function (k) { var n = Number(x[0][k]); if (x[0][k] !== '' && !isNaN(n)) { so = n; return true; } return false; });
            hd('tongtien').value = pat.money(so !== null ? so : tuTinh);
        }, function () { hd('tongtien').value = pat.money(tuTinh); });
    }

    function luuHopDong() {
        if (!v('so')) { ui.toast('Vui lòng nhập Số hợp đồng', 'warn'); hd('so').focus(); return; }
        var cs = docBang(st.dtKhoanThu, 'sl'), mg = docBang(st.dtMienGiam, 'pt');
        ums.api.call({
            action: 'KTX_HopDong/ThemMoi', method: 'POST', strId: '',
            strSoHopDong: v('so'), strNgayKyHopDong: v('ngayky'), strNgayKetThucHopDong: v('ngaykt'), strTinhTrang_Id: st.tinhTrangId,
            strKTX_Phong_Id: v('phong'), strKTX_DoiTuongOKyTucXa_Id: st.doiTuongId, strNgayVao: v('ngayvao'), strNgayRa: v('ngayra'),
            dSoThang: v('sothang'), dTongTienThue: pat.num(v('tongtien')), dGiaThue_Thang: pat.num(v('tienthang')), dSoChoThue: v('socho'), dBaoPhong: v('bao'),
            strTaiChinh_CacKhoanThu_Id: st.khoanTienPhongId,
            strHopDong_MG_PhanTrams: chuoi(mg.gia), strHopDong_MG_KhoanThu_Ids: chuoi(mg.ids), strHopDong_MG_HinhThuc_Ids: chuoi(mg.ht),
            strHopDong_CS_SoLuongs: chuoi(cs.gia), strHopDong_CS_KhoanThu_Ids: chuoi(cs.ids), strHopDong_CS_HinhThuc_Ids: chuoi(cs.ht)
        }).then(function (d) {
            ui.toast('Đăng ký thành công!', 'ok');
            var id = X.e(d.raw && d.raw.Id);
            if (id) { st.hopDongId = id; datNutIn(true); }
        }, X.loi('tạo hợp đồng'));
    }
    function inHopDong(ma) {
        if (!st.hopDongId) return;
        var bangChu = ui.docSo(pat.num(v('tongtien')));
        ums.report.run(ma, { collect: function (add) { add('strHopDong_Id', st.hopDongId); add('strSoTienBangChu', bangChu); } });
    }
})();
