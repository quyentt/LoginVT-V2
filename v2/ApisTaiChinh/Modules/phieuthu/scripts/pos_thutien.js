/* =========================================================================
   Thu tiền qua POS
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/pos_thutien.html
            + scripts/pos_thutien.js (3.101 dòng, Pos_PhieuThu)
   Dùng chung: scripts/_chung_khac.js (ums.phieuthuKhac); xem/in: ums.phieu (assets/js/phieu.js)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     TC_ThongTinChung/LayDSCacKhoanThuQuaPos (GET)   danh sách người học có giao dịch POS
     TC_ThongTinChung/LayDanhSach (GET)              strQLSV_NguoiHoc_Id = STUDENTID,
                                                     strNguonDuLieu_Id = ID dòng POS
     TC_ThongTinChung/LayDSKhoan…/LayDSPhieu… (GET)  bảng chi tiết của các ô tổng
     TC_DaNop/ThemMoi                                "Xuất biên lai" (strXuatHoaDonTrucTiep rỗng)
                                                     và "Xuất hóa đơn" (strXuatHoaDonTrucTiep = 1),
                                                     kèm strSoPhieuThu nhập ở hộp xác nhận
     TC_SoBienLai/HuyBienLai                         huỷ chứng từ
     TC_PhieuThu/LayTTPhieuThu_Rut / TC_HoaDon/LayTTHoaDonThu_Rut (qua ums.phieu.viewer)

   PHÉP TÍNH TIỀN
     · "Tổng tiền đã chọn" = Σ số tiền các dòng đã chọn (countFloat(5, 6) —
       không nhân số lượng), làm tròn xuống 2 chữ số; kèm "Tổng tiền thu qua
       POS" = SOTIEN của dòng POS.
     · Sửa ô số tiền: khác 0 thì tự chọn dòng, về 0 thì bỏ chọn; ký tự lạ thì
       trả lại giá trị trước. Mở người học: tự chọn các dòng có số tiền ≠ 0.
     · Phiếu: bỏ dòng số tiền 0; số lượng = 1; thành tiền = đơn giá × 1.
       strTaiChinh_SoTien_s = thành tiền đã parseFloat, nối dấu phẩy.

   KHÁC BẢN GỐC — sửa lỗi rõ ràng
     1. save_HDBL (Xuất biên lai) khai trùng khoá 'strTaiChinh_SoTien_s' — khoá
        sau đè khoá trước nên bản gốc gửi CHUỖI NỘI DUNG vào ô số tiền và
        không gửi strTaiChinh_NoiDung_s. Ở đây gửi đúng như save_HD cùng tệp:
        strTaiChinh_SoTien_s = số tiền, strTaiChinh_NoiDung_s = nội dung.
     2. Bấm lại đúng người học vừa đóng thì bản gốc không mở lại (so với
        strHSSV_Id cũ). Ở đây mở lại được.
     3. Nội dung gửi dạng chữ thường (bản gốc lấy .html() — "&" thành "&amp;").
   Giữ nguyên dù đáng ngờ
     · strHinhThucThu_Id luôn rỗng: bản gốc đọc #dropHinhThucThanhToanPTCEdit
       — ô không tồn tại.
   Cố ý bỏ (không có đường vào trên màn gốc)
     · Tab nợ riêng / thừa chung / thừa riêng / nộp trước và nút rút tiền: có
       trong HTML nhưng không có tab để mở, bảng không bao giờ được đổ dữ liệu
       (tab nộp trước còn ẩn cứng và ô học kỳ so this.id thay vì giá trị).
     · Hệ/khoá/chương trình/lớp/trạng thái ở ô tìm kiếm: bản gốc có nạp
       nhưng lời gọi danh sách không dùng — chỉ gửi strTuKhoa.
     · triggerDoiTuong / triggerThuTien: mã thử nghiệm tự bấm (ghi "nhớ xoá").
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc;
    var PK = ums.phieuthuKhac, m = PK.m;
    var root = document.getElementById('pos_thutien');
    if (!root) return;

    var S = { dtHS: [], row: null, hsId: '', nguoiHocId: '', tongPOS: 0, dt: {}, tab: 'tinhhinh', phieuId: '' };

    /* Bố cục hai cột dùng chung — ums.pat.master (BO-CUC mục 4) */
    root.insertAdjacentHTML('beforeend',
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Thu tiền qua POS</h1>' +
        '<div class="ums-page__actions" data-z="actions"></div></div>' +
        '<div data-z="layout"></div>' +
        '<div data-z="phieu" hidden></div>');

    var mst = ums.pat.master({
        el: root.querySelector('[data-z="layout"]'),
        side: { title: 'Giao dịch POS', icon: 'fa-credit-card', search: 'Nhập từ khóa tìm kiếm' },
        main: { title: false }
    });
    mst.side.querySelector('.ums-panel__tools').innerHTML =
        '<button type="button" class="ums-iconbtn" data-act="tim" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>';
    mst.sideBody.setAttribute('data-z', 'list');
    mst.search.setAttribute('data-z', 'key');
    mst.mainBody.innerHTML =
        '<div data-z="trong" class="ums-panel"><div class="ums-panel__body">' +
        ui.empty('Chọn một người học ở danh sách bên trái', 'fa-hand-pointer') + '</div></div>' +
        '<div data-z="dt" hidden></div>';

    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }

    /* ---------- Danh sách (getList_HSSV) ---------------------------------- */
    function loadHS() {
        z('list').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_ThongTinChung/LayDSCacKhoanThuQuaPos', method: 'GET', versionAPI: 'v1.0',
            strNguoiThucHien_Id: '', strTuKhoa: z('key').value.trim()
        }).then(function (r) {
            S.dtHS = PK.rowsOf(r);
            // mục danh sách của ums.pat.master
            z('list').innerHTML = S.dtHS.length
                ? S.dtHS.map(function (x) {
                    return '<button type="button" class="ums-master__item" data-id="' + esc(x.ID) + '">' +
                        '<span class="pos-hs__row">' + ums.pat.anhNguoi(x.ANH || '') +
                        '<span class="ums-u-flex1 pos-hs__txt"><span class="ums-cell__title">' + esc(x.HOTEN) + '</span>' +
                        '<span class="pos-hs__tien">Tổng tiền: ' + esc(m.fmt(x.SOTIEN)) + '</span>' +
                        '<span class="ums-master__item__sub">' + esc(x.MASV) + ' · Lớp: ' + esc(x.DAOTAO_LOPQUANLY_N1_TEN) + '</span>' +
                        '</span></span></button>';
                }).join('')
                : ui.empty('Không có giao dịch', 'fa-credit-card');
            mark();
            /* KHÔNG tự chọn khi còn một kết quả — gõ là tự tìm, có thể nhiều người trùng tên (người dùng 2026-09-26) */
        }).catch(function (err) { z('list').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách POS'); });
    }
    function mark() {
        root.querySelectorAll('[data-z="list"] [data-id]').forEach(function (it) {
            it.classList.toggle('is-active', it.getAttribute('data-id') === String(S.hsId));
        });
    }
    /* Cột trái (BO-CUC luật 12, 2026-09-26): gõ là tự tìm sau 400ms, Enter tìm ngay; nút trên tiêu đề = Tải lại */
    var henTim = 0;
    z('key').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(henTim); loadHS(); } });
    z('key').addEventListener('input', function () { clearTimeout(henTim); henTim = setTimeout(loadHS, 400); });
    z('list').addEventListener('click', function (ev) {
        var it = ev.target.closest('.ums-master__item[data-id]');
        if (it) chon(it.getAttribute('data-id'));
    });

    /* ---------- Khung người học ------------------------------------------- */
    /* Đầu khung CHUNG (ums.pat.dauDoiTuong — người dùng 2026-09-26): ảnh + tên + trạng thái + tổng nợ · Đóng.
       "Tổng tiền đã chọn / thu qua POS" KHÔNG còn trên tiêu đề — nằm ngay trước nút Thu tiền của tab. */
    function dauO(row, tt) {
        return {
            anh: row.ANH || '',
            ten: String(row.HOTEN || '').toUpperCase() + (row.MASV ? ' - ' + row.MASV : ''),
            nhan: tt ? ui.badge(tt, 'info') : '',
            tools: ui.btn('close', { attr: { 'data-act': 'dongdt' } })
        };
    }
    z('dt').innerHTML = '<div class="ums-panel" data-z="dtpanel">' + ums.pat.dauDoiTuong(dauO({}, '')) +
        '<nav class="ums-tabs" data-z="tabs"><a class="ums-tabs__item is-active" href="javascript:void(0)" data-tab="tinhhinh">Tình hình học phí</a>' +
        '<a class="ums-tabs__item" href="javascript:void(0)" data-tab="nochung">Các khoản phải nộp</a></nav>' +
        '<div class="ums-panel__body"><div data-pane="tinhhinh" data-z="tinhhinh"></div>' +
        '<div data-pane="nochung" hidden>' + ums.pat.thanhThu({
            tongLbl: 'Tổng nợ chung các khoản', tong: 0, chiTiet: 'data-tile-go="NoChung"',
            truocNut: '<span class="ums-thanhthu__chon">Tổng tiền thu qua POS: <b data-z="tongpos">0</b></span>',
            nut: '<button type="button" class="ums-btn ums-btn--primary" data-act="vietphieu"><i class="fa-light fa-paper-plane"></i><span>Thu tiền</span></button>'
        }) +
        '<div data-z="bang"></div></div></div></div>';

    var tinhHinh = PK.tinhHinh(z('tinhhinh'), {
        id: function () { return S.nguoiHocId; },
        tiles: ['PhaiNop', 'DuocMien', 'DaNop', 'DaRut', 'NoRieng', 'NoChung', 'DuRieng', 'DuChung', 'PhieuThu', 'PhieuRut'],
        onPhieu: function (kind, id) { S.phieuId = id; xemPhieu(id, 'BIENLAI'); }
    });

    var bang = PK.bang(z('bang'), {
        pos: true,
        onChange: function () { hienTong(); }
    });

    /* show_TongTien */
    function hienTong() {
        var pane = z('dt').querySelector('[data-pane="nochung"]');
        pane.querySelector('[data-tt="chon"]').textContent = S.row ? m.fmt(bang.tongChon()) : '0';
        z('tongpos').textContent = S.row ? m.fmt(S.tongPOS) : '0';
    }

    function doiTab(k) {
        S.tab = k;
        z('tabs').querySelectorAll('[data-tab]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-tab') === k); });
        z('dt').querySelectorAll('[data-pane]').forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== k; });
        if (k === 'tinhhinh') tinhHinh.back();
        hienTong();
    }
    z('tabs').addEventListener('click', function (ev) { var a = ev.target.closest('[data-tab]'); if (a) doiTab(a.getAttribute('data-tab')); });

    /* active_DoiTuong → getDetail_DoiTuong → viewForm_DoiTuong */
    function chon(id) {
        var row = S.dtHS.filter(function (r) { return String(r.ID) === String(id); })[0];
        if (!row) return;
        S.row = row;
        S.hsId = row.ID;
        S.nguoiHocId = row.STUDENTID;
        S.tongPOS = row.SOTIEN;
        mark();
        bang.clear();
        tinhHinh.reset();
        var tt = row.STATUS === 1 || row.STATUS === '1' ? 'NORMAL' : (row.STATUS === null || row.STATUS === undefined ? '' : String(row.STATUS));
        ums.pat.datDau(z('dtpanel'), dauO(row, tt));
        z('trong').hidden = true;
        if (z('dt').hidden) ui.reveal(z('dt'));
        doiTab('tinhhinh');
        loadTinhTrang();
    }

    function loadTinhTrang() {
        var hs = S.hsId;
        return ums.api.call({
            action: 'TC_ThongTinChung/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strQLSV_NguoiHoc_Id: S.nguoiHocId, strNguoiThucHien_Id: '', strNguonDuLieu_Id: S.hsId
        }).then(function (r) {
            if (hs !== S.hsId) return;
            var d = r.data || {};
            var pos = d.rsKhoanThuQuaPos || [];
            bang.set(pos.map(PK.dong));
            var info = (d.rsThongTin || [])[0] || {};
            S.dt = info;
            tinhHinh.set(info);
            ums.pat.datNoCo(z('dtpanel'), PK.noCo(info));
            z('dt').querySelector('[data-pane="nochung"] [data-tt="tong"]').textContent = m.isNum(info.TONGNOCHUNG) ? m.fmt(info.TONGNOCHUNG) : '0';
            if (pos.length) {
                doiTab('nochung');
                // quickSelectAll_Phieu (POS): chỉ chọn dòng có số tiền khác 0
                bang.selectAll(function (x) { return m.cell(x.soTien) !== 0; });
            }
            hienTong();
        }).catch(function (err) { ums.api.handle(err, 'tình trạng tài chính'); });
    }

    function dongDT() {
        z('dt').hidden = true;
        z('trong').hidden = false;
        S.hsId = ''; S.row = null;
        mark();
    }

    /* ---------- Viết phiếu (genHTML_NoiDung_BienLai) ---------------------- */
    var P = { mode: '', nhap: null, viewer: null, ten: '' };

    function vietPhieu() {
        if (!bang.count()) { ui.toast('Vui lòng chọn khoản thu', 'warn'); return; }
        var chon = bang.checked();
        var ma = PK.cungHeThong(chon);
        if (ma === null) return;
        var dong = [];
        for (var i = 0; i < chon.length; i++) {
            var r = chon[i], st = m.cell(r.soTien);
            if (st === 0) continue;
            if (st === null) { ui.toast('Số tiền không hợp lệ ở khoản "' + r.khoan + '"', 'warn'); return; }
            dong.push({ id: r.id, name: r.name, khoan: r.khoan, noiDung: r.noiDung, soLuong: '1', donGia: r.soTien, thanhTien: st * 1 });
        }
        var tong = 0;
        dong.forEach(function (d) { var v = m.cell(m.fmt(d.thanhTien)); if (v !== null) tong += v; });
        if (!dong.length || !m.floor2(tong)) { ui.toast('Tổng các khoản chọn phải lớn 0!', 'warn'); return; }
        var dt = S.dt || {};
        moPhieu('nhap');
        P.ten = PK.loaiChungTu(ma, true, true);
        P.nhap = PK.nhap(z('phieu').querySelector('[data-z="pbody"]'), {
            tenPhieu: P.ten,
            info: {
                hoTen: (dt.HODEM === undefined ? '' : dt.HODEM) + ' ' + (dt.TEN === undefined ? '' : dt.TEN),
                ma: dt.MASO, ngaySinh: dt.NGAYSINH, diaChi: dt.NOIOHIENNAY, maSoThue: dt.MASOTHUECANHAN,
                lop: dt.DAOTAO_LOPQUANLY_N1_TEN, nganh: dt.NGANHHOC_N1_TEN, khoa: dt.KHOAHOC_N1_TEN
            },
            ngay: PK.homNay(),
            dong: dong
        });
        veNut();
    }

    function moPhieu(mode) {
        P.mode = mode;
        z('phieu').innerHTML = '<div class="ums-panel">' +
            '<div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-file-signature"></i> <span data-z="ptitle"></span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-pact': 'dong' } }) +
            '<span data-z="ptools"></span></div></div>' +
            '<div class="ums-panel__body pos-lien" data-z="plien" hidden></div>' +
            '<div class="ums-panel__body" data-z="pbody"></div></div>';
        ui.swap(z('layout'), z('phieu'));
    }

    function veNut() {
        var h = '';
        if (P.mode === 'nhap') {
            z('ptitle').textContent = 'Viết chứng từ — ' + P.ten;
            h = '<button type="button" class="ums-btn ums-btn--danger" data-pact="xuathd"><i class="fa-light fa-file-invoice"></i><span>Xuất hóa đơn</span></button>' +
                ui.btn('save', { text: 'Xuất biên lai', attr: { 'data-pact': 'xuatbl' } });
        } else {
            z('ptitle').textContent = 'Chứng từ';
            h = '<button type="button" class="ums-btn ums-btn--danger" data-pact="huy"><i class="fa-light fa-trash-can"></i><span>Hủy chứng từ</span></button>' +
                ui.btn('print', { mod: 'primary', attr: { 'data-pact': 'in' } });
        }
        z('ptools').innerHTML = h;
    }

    /* closePhieu (POS): đóng cả khung người học, quay về danh sách */
    function dongPhieu() {
        z('phieu').hidden = true;
        z('phieu').innerHTML = '';
        ui.reveal(z('layout'));
        P.mode = ''; P.nhap = null; P.viewer = null;
        dongDT();
    }

    function xemPhieu(id, loai) {
        if (P.mode !== 'xem') moPhieu('xem');
        P.mode = 'xem';
        veNut();
        P.viewer = ums.phieu.viewer(z('pbody'), { tools: z('plien') });
        return P.viewer.show({ id: id, loai: loai });
    }

    /* Hộp xác nhận có ô "số chứng từ" (dùng cho phôi in sẵn) */
    function hoiSoChungTu(tieuDe, fn) {
        ui.dialog({
            title: tieuDe, icon: 'fa-circle-question', size: 'sm',
            body: '<p class="ums-u-mb-4">Bạn có chắc chắn muốn lưu chứng từ không!</p>' +
                ui.field('Nhập số chứng từ (dùng cho phôi in sẵn)', '<input class="ums-input" data-z="soct" autocomplete="off">',
                    { hint: '*Chú ý: Nếu bỏ qua hệ thống tự sinh số' }),
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function (d) { fn(d.body.querySelector('[data-z="soct"]').value.trim()); } }]
        });
    }

    function luu(hoaDon, soPhieu) {
        var v = P.nhap.values();
        if (!v.dong.length) { ui.toast('Tổng các khoản chọn phải lớn 0!', 'warn'); return; }
        var call = {
            action: 'TC_DaNop/ThemMoi', versionAPI: 'v1.0',
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Ids: v.dong.map(function (d) { return d.id; }).join(','),
            strTaiChinh_SoTien_s: v.dong.map(function (d) { return m.parse(m.fmt(d.thanhTien)); }).join(','),
            strTaiChinh_NoiDung_s: v.dong.map(function (d) { return d.noiDung; }).join('#'),
            strQLSV_NguoiHoc_Id: S.nguoiHocId,
            strDaoTao_ThoiGianDaoTao_Id: v.dong.map(function (d) { return d.name; }).join(','),
            strDaoTao_ToChucCT_Id: '',
            strHinhThucThu_Id: '',
            strXuatHoaDonTrucTiep: hoaDon ? 1 : '',
            strSoPhieuThu: soPhieu,
            strNguonDuLieu_Id: S.hsId
        };
        ums.api.call(call).then(function (r) {
            var id = r.raw && r.raw.Id;
            S.phieuId = id;
            ui.toast('Thực hiện thu tiền thành công', 'ok');
            loadTinhTrang();
            loadHS();
            xemPhieu(id, hoaDon ? 'HOADON' : 'BIENLAI');
        }).catch(function (err) { ums.api.handle(err, hoaDon ? 'xuất hoá đơn' : 'xuất biên lai'); });
    }

    function huy() {
        ums.api.call({ action: 'TC_SoBienLai/HuyBienLai', versionAPI: 'v1.0', strBienLai_Id: S.phieuId, strNguoiThucHien_Id: '' })
            .then(function () { loadTinhTrang(); dongPhieu(); ui.toast('Xóa biên lai thành công!', 'ok'); })
            .catch(function (err) { ums.api.handle(err, 'huỷ chứng từ'); });
    }

    z('phieu').addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-pact]');
        if (!b) return;
        switch (b.getAttribute('data-pact')) {
            case 'dong': dongPhieu(); break;
            case 'xuatbl': hoiSoChungTu('Xuất biên lai', function (so) { luu(false, so); }); break;
            case 'xuathd': hoiSoChungTu('Xuất hóa đơn', function (so) { luu(true, so); }); break;
            case 'in': if (P.viewer) P.viewer.print('In chứng từ'); dongPhieu(); break;
            case 'huy':
                ui.confirm('Bạn có chắc chắn muốn hủy biên lai không!', { tone: 'bad', ok: 'Hủy chứng từ' }).then(function (y) { if (y) huy(); });
                break;
        }
    });

    root.addEventListener('click', function (ev) {
        var g = ev.target.closest('[data-tile-go]');
        if (g) { tinhHinh.detail(g.getAttribute('data-tile-go')); return; }   // hộp thoại, không chuyển tab (2026-09-26)
        var a = ev.target.closest('[data-act]');
        if (!a || !root.contains(a)) return;
        switch (a.getAttribute('data-act')) {
            case 'tim': loadHS(); break;
            case 'vietphieu': vietPhieu(); break;
            case 'dongdt': dongDT(); break;
        }
    });

    loadHS();
})();
