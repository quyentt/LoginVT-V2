/* =========================================================================
   Phân lớp (nhập học)
   Bản gốc: ApisNhapHoc/Modules/phanlop/html/phanlop.html + scripts/phanlop.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc HAI CỘT (col-sm-3 | col-sm-9):
     · trái: Kế hoạch nhập học · Điều kiện (Chưa nhập / Đã nhập / Toàn bộ) · ô từ khoá → danh sách người
       học (ảnh · họ tên · SBD · "Chọn" · nhãn đã nhập học), phân trang máy chủ, thẻ rê chuột;
     · phải, ba khung xếp dọc: "Hồ sơ" (thông tin tuyển sinh + "Lớp sinh viên" + Rút hồ sơ, nhãn "Tổng số
       đã phân lớp") · "Tìm kiếm lớp quản lý" (Kế hoạch → Chương trình, Xuất báo cáo, Tìm kiếm | các ô lớp
       "Chọn | Chi tiết") · "Danh sách sinh viên đã rút của kế hoạch";
     · nút nổi "Phân lớp" → đặt ở đầu trang.
   Luật cột trái (BO-CUC 12): Kế hoạch + Điều kiện nằm trong "Bộ lọc nâng cao" MỞ SẴN (kế hoạch phải chọn trước);
   gõ từ khoá tự tìm sau 400ms, Enter tìm ngay; mục danh sách không mang nút (bấm cả mục = "Chọn").

   Lời gọi (chép nguyên):
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP  [PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc]
                                               strNguoiThucHien_Id = người đăng nhập → TENKEHOACH, DAOTAO_KHOADAOTAO_ID
     SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP  [PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS]
                                               (edu.extend.getList_NguoiHoc_TTTS) dDaNhapHoc, strTaiChinh_KeHoach_Id
                                               ("xxx" khi chưa chọn kế hoạch — như gốc), strNguoiThucHien_Id '', strTuKhoa, trang
     edu.system.getList_ChuongTrinhDaoTao      = ums.ref.chuongTrinh { strKhoaDaoTao_Id = khoá của kế hoạch, trang 1/10000 }
     edu.system.getList_LopQuanLy (Corei)      = ums.nhPhanLop.lopQuanLy { strToChucCT_Id, trang 1/10000 }
                                               → ô lớp "Lớp: TEN(SOLUONGTHUCTE/SOLUONGKEHOACH)"
     edu.system.getList_SinhVien               = ums.ref.sinhVien { strLopQuanLy_Id, trang 1/10000 } (hộp Chi tiết)
     NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_PhanLop_ThuCong  POST strQLSV_NguoiHoc_TTTS_Id, strDAOTAO_LopQuanLy_Id
                                               (id lớp, hoặc MALOPDUKIEN khi phân theo dự kiến — như gốc),
                                               strDAOTAO_ToChucCT_Id '', strQLSV_TrangThaiNguoiHoc_Id ''
     NH_NguoiHoc_ThongTinTuyenSinh/Xoa         POST strId = id người học (hủy phân lớp), versionAPI v1.0 trong thân như gốc
     NH_NguoiHoc_ThongTinTuyenSinh/LayChiTiet  GET  strId — sau khi phân lớp, có EMAIL thì gửi thư "NH.GNH"
                                               (edu.system.reportDanhMuc → ums.nhPhanLop.guiEmailDanhMuc, KHÔNG eval)
     NH_RutHoSo/Them_NhapHoc_RutHoSo_TT        POST strNhapHoc_KeHoachNhapHoc_Id (kế hoạch cột trái), strQLSV_NguoiHoc_Id
     NH_RutHoSo/LayDSNhapHoc_RutHoSo_TT        GET  strNhapHoc_KeHoachNhapHoc_Id
     Xuất báo cáo: ums.report.mount (getList_MauImport "zoneBaoCao_PL" — không có vùng _Import) thêm
       strTS_HoSoDuTuyen_Id (người học đang chọn), strNguoiThucHien_Id, strChucNang_Id. Không có mẫu nào
       được phân quyền thì giữ mục viết cứng của html gốc "1. Phiếu phân lớp" (PHIEUPHANLOP, cùng khoá).

   Cố ý bỏ / khác gốc (tự chốt — ghi báo cáo):
     · save_PhanLopTuDong (NhapHoc_PhanLop_TuDong): không nút nào gọi → không dựng.
     · Tự chọn khi danh sách còn đúng một người (checkAuto_Select) — BỎ theo luật cột trái 12.
     · Bảng "đã rút" gốc có cột ô đánh dấu nhưng không thao tác nào đọc → bỏ cột.
     · Nút "Tìm kiếm" của khung lớp gốc không gắn xử lý → nay nạp lại các lớp của chương trình đang chọn.
     · Lưu phân lớp xong nạp lại danh sách GIỮ từ khoá đang gõ (gốc gửi từ khoá rỗng trong khi ô vẫn còn chữ).
     · Rút hồ sơ khi chưa chọn người: gốc gọi edu.system.aler (lỗi đánh máy → TypeError) → nay báo "Bạn cần chọn đối tượng".
     · Hộp Chi tiết lớp: cột gốc MASONGUOIHOC / HODEM / TEN — thủ tục LayDanhSachHoSo trả QLSV_NGUOIHOC_* nên
       đọc thêm hai tên đó khi tên gốc trống.
   Cặp cha → con: Kế hoạch → Chương trình (khung tìm lớp) — pat.chain; kế hoạch cột trái bắt buộc (data-required).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.nhPhanLop, e = P.e, esc = ui.esc;
    var root = document.getElementById('nh-phanlop');
    if (!root) return;

    var st = { kh: '', dk: '0', page: 1, size: 10, total: 0, rows: [], dsKH: [],
               nh: null,           // người học đang chọn
               lopId: '',          // strLopQuanLy_Id (id lớp đã "Chọn" hoặc MALOPDUKIEN)
               lopTen: '',         // chữ đang hiện ở dòng "Lớp sinh viên" (lblLop_Ten)
               dsLop: [] };

    var m = pat.master({
        el: root, title: 'Phân lớp',
        actions: ui.btn('save', { text: 'Phân lớp', mod: 'primary', icon: 'fa-users-rectangle', attr: { 'data-a': 'phanlop' } }),
        side: {
            title: 'Danh sách người học', icon: 'fa-user-graduate', search: 'Nhập từ khóa tìm kiếm',
            filter:
                '<div class="ums-field"><select class="ums-select" data-f="kh" data-required data-ph="Chọn kế hoạch nhập học">' +
                    '<option value="">Chọn kế hoạch nhập học</option></select></div>' +
                '<div class="ums-field"><label class="ums-field__label">Điều kiện</label><div class="ums-radios">' +
                    [['0', 'Chưa nhập'], ['1', 'Đã nhập'], ['-1', 'Toàn bộ']].map(function (x) {
                        return '<label class="ums-check"><input type="radio" name="nhplDK" data-f="dk" value="' + x[0] + '"' +
                            (x[0] === '0' ? ' checked' : '') + '> ' + x[1] + '</label>';
                    }).join('') + '</div></div>'
        },
        main: { title: false }
    });

    m.mainBody.innerHTML =
        '<div class="ums-panel" data-z="hsPanel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-id-card"></i> <span data-z="hsTen">Hồ sơ</span></div>' +
            '<div class="ums-panel__tools"><span data-z="tong"></span>' +
                ui.btn('save', { text: 'Rút hồ sơ', mod: 'primary', icon: 'fa-user-minus', attr: { 'data-a': 'rut' } }) +
            '</div></div>' +
            '<div class="ums-panel__body" data-z="hs"></div></div>' +
        pat.panel({ title: 'Tìm kiếm lớp quản lý', icon: 'fa-chalkboard-user', body:
            '<div class="nhpl-tim">' +
                '<div>' +
                    '<div class="ums-legend ums-u-mb-2">Điều kiện tìm lớp quản lý</div>' +
                    ui.field('Kế hoạch', '<select class="ums-select" data-f="khTim" data-ph="Chọn kế hoạch nhập học"><option value="">Chọn kế hoạch nhập học</option></select>') +
                    ui.field('Chương trình', '<select class="ums-select" data-f="ct" data-ph="Chọn chương trình đào tạo"><option value="">Chọn chương trình đào tạo</option></select>') +
                    '<div class="nhpl-nut">' +
                        '<span data-z="bc"></span><span data-z="bcGoc" hidden>' +
                            P.drop('Xuất báo cáo', 'fa-file-chart-column', [{ chu: '1. Phiếu phân lớp', ma: 'PHIEUPHANLOP' }]) + '</span>' +
                        ui.btn('search', { attr: { 'data-a': 'timLop' } }) +
                    '</div>' +
                '</div>' +
                '<div data-z="lop"></div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách sinh viên đã rút của kế hoạch', icon: 'fa-rectangle-history-circle-user', count: 'nRut',
            flush: true, zone: 'rutDs' });

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var F = { kh: f('kh'), khTim: f('khTim'), ct: f('ct') };
    ui.enhance(root);

    /* ---------------- Cột trái: danh sách người học ---------------- */
    function hoTen(r) { return (e(r.HODEM) + ' ' + e(r.TEN)).trim(); }
    function ngaySinh(r) { return e(r.NGAYSINH_NGAY) + '/' + e(r.NGAYSINH_THANG) + '/' + e(r.NGAYSINH_NAM); }

    function veDs() {
        if (m.sideCount) m.sideCount.textContent = '(' + st.total + ')';
        var id = st.nh && st.nh.ID;
        m.sideBody.innerHTML = !st.rows.length ? ui.empty('Không tìm thấy người học', 'fa-user-graduate') : st.rows.map(function (r) {
            return '<button type="button" class="ums-master__item ums-dsns__item' + (r.ID === id ? ' is-active' : '') +
                '" data-id="' + esc(e(r.ID)) + '">' + pat.anhNguoi(r.ANH) +
                '<span class="ums-master__item__main"><b>' + esc(hoTen(r)) + '</b>' +
                '<span class="ums-master__item__sub">' + esc(e(r.SOBAODANH)) + '</span></span>' +
                (String(r.DANHAPHOC) === '1' ? '<i class="fa-light fa-tag ums-master__tt" title="Đã nhập học"></i>' : '') + '</button>';
        }).join('');
        m.setPage({
            index: st.page, size: st.size, total: st.total, shown: st.rows.length,
            onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) taiDs(p); },
            onSize: function (v) { st.size = v; taiDs(1); }
        });
    }

    var tokDs = 0;
    function taiDs(page) {
        if (page) st.page = page;
        var t = ++tokDs;
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP',
            func: 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS',
            dDaNhapHoc: st.dk,
            strTaiChinh_KeHoach_Id: st.kh || 'xxx',
            strNguoiThucHien_Id: '',
            strTuKhoa: (m.search.value || '').trim(),
            pageIndex: st.page, pageSize: st.size,
            silent: true
        }).then(function (r) {
            if (t !== tokDs) return;
            st.rows = Array.isArray(r.data) ? r.data : [];
            st.total = Number(r.pager) || st.rows.length;
            if (st.rows.length) z('tong').innerHTML = tongHtml(st.rows[0].SODANHAPHOC);
            veDs();
        }, function (err) {
            if (t !== tokDs) return;
            st.rows = []; st.total = 0;
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách người học');
        });
    }
    function tongHtml(n) { return ui.badge('Tổng số đã phân lớp: ' + e(n), 'warn'); }

    ui.hoverCard(m.sideBody, '.ums-master__item[data-id]', function (muc) {
        var r = st.rows.filter(function (x) { return String(x.ID) === muc.getAttribute('data-id'); })[0];
        if (!r) return null;
        var coLop = !!e(r.DAOTAO_LOPQUANLY_TEN);
        var dong = [
            ['fa-user', 'Họ tên', hoTen(r)],
            ['fa-cake-candles', 'Ngày sinh', ngaySinh(r)],
            ['fa-graduation-cap', 'Ngành học', e(r.NGANHHOC_TEN)],
            ['fa-chalkboard-user', coLop ? 'Lớp học' : 'Lớp dự kiến', coLop ? e(r.DAOTAO_LOPQUANLY_TEN) : e(r.MALOPDUKIEN)],
            ['fa-location-dot', 'Địa chỉ', e(r.HOKHAU_PHUONGXAKHOIXOM) + ' - ' + e(r.HOKHAU_QUANHUYEN_TEN) + ' - ' + e(r.HOKHAU_TINHTHANH_TEN)]
        ];
        return '<div class="ums-hovercard__in"><div class="ums-hovercard__rows">' +
            '<div class="ums-hovercard__row"><b>' + esc(e(r.MASO) ? 'MSSV ' + e(r.MASO) : 'SBD ' + e(r.SOBAODANH)) + '</b></div>' +
            dong.map(function (d) {
                return '<div class="ums-hovercard__row"><i class="fa-light ' + d[0] + '"></i><span>' + esc(d[1]) + ' :</span><b>' + esc(d[2]) + '</b></div>';
            }).join('') + '</div></div>';
    });

    /* ---------------- Khung Hồ sơ ---------------- */
    function kv(nhan, gt, dam) {
        return '<div class="ums-kv' + (dam === 'thuong' ? ' ums-kv--thuong' : dam ? ' ums-kv--dam' : '') + '"><span>' + esc(nhan) + '</span><b>' + esc(gt) + '</b></div>';
    }
    function veHoSo() {
        var r = st.nh;
        z('hsTen').textContent = r ? 'Hồ sơ – ' + hoTen(r).toUpperCase() : 'Hồ sơ';
        if (!r) { z('hs').innerHTML = ui.empty('Chọn người học ở danh sách bên trái để xem hồ sơ và phân lớp', 'fa-user-graduate'); return; }
        z('hs').innerHTML =
            '<div class="nhpl-hs">' +
                '<div>' +
                    kv('Họ tên', hoTen(r).toUpperCase(), true) + kv('Mã số SV', e(r.MASO)) + kv('Ngày sinh', ngaySinh(r)) +
                    kv('Điện thoại', e(r.SODIENTHOAICANHAN)) +
                    kv('Quê quán', e(r.HOKHAU_PHUONGXAKHOIXOM) + ' - ' + e(r.HOKHAU_QUANHUYEN_TEN) + ' - ' + e(r.HOKHAU_TINHTHANH_TEN)) +
                    kv('Ngành nhập học', e(r.DAOTAO_NGANHNHAPHOC)) + kv('CMND/CCCD', e(r.CMTND_SO)) +
                '</div><div>' +
                    kv('SBD', e(r.SOBAODANH), 'thuong') + kv('Tổng điểm', Number(r.DIEMTS_TONGDIEM || 0).toFixed(2)) +
                    kv('Đối tượng', e(r.DOITUONGDUTHI_TEN)) + kv('% Miễn', e(r.PHANTRAMMIENGIAM || 0)) +
                    kv('Khu vực', e(r.KHUVUC_TEN)) + kv('Ngành trúng tuyển', e(r.NGANHHOC_TEN)) +
                '</div>' +
            '</div>' +
            '<div class="ums-kv ums-kv--thuong nhpl-lopsv"><span><i class="fa-light fa-chalkboard-user"></i> Lớp sinh viên</span><b data-z="lopSV"></b></div>';
        z('tong').innerHTML = tongHtml(r.SODANHAPHOC);
    }

    /* Dòng "Lớp sinh viên" — bốn trạng thái của bản gốc (resetText / getText / confirm_save_LopDuKien / updateHTML_PhanLop) */
    function veLop(kieu) {
        var el = z('lopSV');
        if (!el) return;
        st.kieuLop = kieu;
        if (kieu === 'chua') {
            st.lopId = ''; st.lopTen = '';
            el.innerHTML = ui.badge('Chưa phân lớp!', 'warn');
        } else if (kieu === 'chon') {
            el.innerHTML = '<span class="nhpl-lopten">' + esc(st.lopTen) + '</span> ' +
                '<button type="button" class="ums-iconbtn" data-a="boChonLop" title="Bỏ chọn lớp"><i class="fa-light fa-xmark"></i></button>';
        } else if (kieu === 'dukien') {
            el.innerHTML = '<span class="nhpl-lopten">' + esc(st.lopTen) + '</span> ' +
                '<span class="ums-u-faint">Bạn có muốn phân lớp theo dự kiến?</span> ' +
                ui.btn('confirm', { text: 'Có', cls: 'ums-btn--sm', attr: { 'data-a': 'dkCo' } }) + ' ' +
                ui.btn('close', { text: 'Không', cls: 'ums-btn--sm', attr: { 'data-a': 'dkKhong' } });
        } else if (kieu === 'da') {
            st.lopId = '';
            el.innerHTML = '<span class="nhpl-lopten">' + esc(st.lopTen) + '</span> ' +
                ui.btn('del', { text: 'Hủy', mod: 'out-danger', cls: 'ums-btn--sm',
                    attr: { 'data-a': 'huyPL', title: 'Hủy phân lớp sinh viên — chỉ được hủy phân lớp khi chưa đóng tiền!' } });
        }
    }

    function chonNguoi(r) {
        st.nh = r; st.lopId = ''; st.lopTen = '';
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item'), function (x) {
            x.classList.toggle('is-active', x.getAttribute('data-id') === String(r.ID));
        });
        veHoSo();
        veLop('chua');
        if (e(r.DAOTAO_LOPQUANLY_TEN) || e(r.DAOTAO_LOPQUANLY_MA)) { st.lopTen = e(r.DAOTAO_LOPQUANLY_TEN); veLop('da'); }
        else if (e(r.MALOPDUKIEN)) { st.lopId = e(r.MALOPDUKIEN); st.lopTen = e(r.MALOPDUKIEN); veLop('dukien'); }
        /* Có chương trình → chọn sẵn chương trình ở khung tìm lớp và nạp các lớp (gốc genDetail_NguoiHoc_TTTS) */
        if (e(r.DAOTAO_TOCHUCCHUONGTRINH_ID) && ctSan) ctSan.then(function () {
            if (!Array.prototype.some.call(F.ct.options, function (o) { return o.value === String(r.DAOTAO_TOCHUCCHUONGTRINH_ID); })) return;
            F.ct.value = r.DAOTAO_TOCHUCCHUONGTRINH_ID;
            if (window.jQuery) jQuery(F.ct).trigger('change');
            taiLop();
        });
    }
    function boChonNguoi() {
        st.nh = null; st.lopId = ''; st.lopTen = '';
        veHoSo();
    }

    /* ---------------- Khung tìm lớp quản lý ---------------- */
    var ctSan = null;
    function taiCT() {
        var kh = F.khTim.value;
        pat.fill(F.ct, []);
        nhacLop();
        if (!kh) { ctSan = null; return; }
        var k = st.dsKH.filter(function (x) { return String(x.ID) === kh; })[0];
        ctSan = ums.ref.chuongTrinh({ strKhoaDaoTao_Id: k ? e(k.DAOTAO_KHOADAOTAO_ID) : '', strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
            strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
            .then(function (rows) { pat.fill(F.ct, rows, { name: 'TENCHUONGTRINH' }); },
                function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
        return ctSan;
    }
    function nhacLop() {
        st.dsLop = [];
        z('lop').innerHTML = ui.empty('Vui lòng chọn chương trình đào tạo để tìm kiếm Lớp quản lý!', 'fa-circle-info');
    }
    var tokLop = 0;
    function taiLop() {
        var ct = F.ct.value;
        if (!ct) { nhacLop(); return; }
        var t = ++tokLop;
        z('lop').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        P.lopQuanLy({ strToChucCT_Id: ct, pageIndex: 1, pageSize: 10000 }).then(function (rows) {
            if (t !== tokLop) return;
            st.dsLop = rows;
            veLop2();
        }, function (err) {
            if (t !== tokLop) return;
            z('lop').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'lớp quản lý');
        });
    }
    function veLop2() {
        pat.cards({
            el: z('lop'), items: st.dsLop, cls: 'nhpl-lops', empty: 'Không tìm thấy dữ liệu!',
            tone: function (r) { return st.kieuLop === 'chon' && String(r.ID) === st.lopId ? 'info' : ''; },
            render: function (r) {
                return '<b><i class="fa-light fa-folder-open"></i> Lớp: ' + esc(e(r.TEN)) + '</b>' +
                    '<span class="ums-u-faint"> (' + esc(e(r.SOLUONGTHUCTE || 0)) + '/' + esc(e(r.SOLUONGKEHOACH || 0)) + ')</span>';
            },
            actions: function (r, i) {
                return ui.btn('confirm', { text: 'Chọn', cls: 'ums-btn--sm', attr: { 'data-lchon': i } }) +
                    ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-lct': i } });
            }
        });
    }

    function chiTietLop(lop) {
        var dlg = ui.dialog({ title: 'Thông tin chi tiết – ' + e(lop.TEN), icon: 'fa-user-pen', size: 'lg',
            body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var host = dlg.body.querySelector('[data-x="bang"]');
        ums.ref.sinhVien({ strLopQuanLy_Id: lop.ID, strTuKhoa: '', pageIndex: 1, pageSize: 10000 }).then(function (rows) {
            ui.table({ el: host, rows: rows, stt: true, empty: 'Không có dữ liệu', columns: [
                { title: 'Mã số', cls: 'is-nowrap', render: function (r) { return esc(e(r.MASONGUOIHOC) || e(r.QLSV_NGUOIHOC_MASO)); } },
                { title: 'Họ tên', render: function (r) {
                    return esc(((e(r.HODEM) || e(r.QLSV_NGUOIHOC_HODEM)) + ' ' + (e(r.TEN) || e(r.QLSV_NGUOIHOC_TEN))).trim()); } }
            ] });
        }, function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên của lớp'); });
    }

    /* ---------------- Sinh viên đã rút ---------------- */
    function taiRut() {
        var host = z('rutDs');
        if (!st.kh) { host.innerHTML = ui.empty('Chọn kế hoạch nhập học để xem danh sách', 'fa-circle-info'); z('nRut').textContent = ''; return; }
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        P.rows({ action: 'NH_RutHoSo/LayDSNhapHoc_RutHoSo_TT', method: 'GET',
            strNhapHoc_KeHoachNhapHoc_Id: st.kh, strNguoiThucHien_Id: ums.session.userId }).then(function (rows) {
            z('nRut').textContent = '(' + rows.length + ')';
            ui.table({ el: host, rows: rows, stt: true, empty: 'Không có dữ liệu', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc((e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim()); } },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_MA' },
                { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                { title: 'Ngày rút', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                { title: 'Người rút', prop: 'NGUOITHUCHIEN_TAIKHOAN' }
            ] });
        }, function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên đã rút'); });
    }

    /* ---------------- Ghi ---------------- */
    function phanLop() {
        var coNguoi = !!(st.nh && st.nh.ID), coLop = !!st.lopId;
        if (!coNguoi && !coLop) { ui.toast('Vui lòng chọn Người học và Lớp quản lý trước khi phân lớp', 'warn'); return; }
        if (!coNguoi) { ui.toast('Vui lòng chọn Người học trước khi phân lớp', 'warn'); return; }
        if (!coLop) { ui.toast('Vui lòng chọn Lớp quản lý trước khi phân lớp', 'warn'); return; }
        var nh = st.nh;
        ums.api.call({
            action: 'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_PhanLop_ThuCong',
            strQLSV_NguoiHoc_TTTS_Id: nh.ID,
            strDAOTAO_LopQuanLy_Id: st.lopId,
            strDAOTAO_ToChucCT_Id: '',
            strQLSV_TrangThaiNguoiHoc_Id: '',
            strNguoiThucHien_Id: ums.session.userId
        }).then(function () {
            ui.toast('Phân lớp thành công!', 'ok');
            taiDs();
            veLop('da');                              // gốc updateHTML_PhanLop("") — giữ tên lớp đang hiện
            taiLop();
            /* Gửi giấy nhập học qua thư nếu hồ sơ có EMAIL (getDetail_NguoiHoc_PhieuNhapHoc) */
            ums.api.call({ action: 'NH_NguoiHoc_ThongTinTuyenSinh/LayChiTiet', method: 'GET', strId: nh.ID, silent: true }).then(function (r) {
                var a = Array.isArray(r.data) ? r.data[0] : null;
                if (a && a.EMAIL) P.guiEmailDanhMuc(a, a.EMAIL, 'NH.GNH');
            }, function (err) { ums.api.handle(err, 'chi tiết người học'); });
        }).catch(function (err) { ums.api.handle(err, 'phân lớp'); });
    }

    function huyPhanLop() {
        var nh = st.nh;
        if (!nh) return;
        ui.confirm('Bạn có chắc chắn muốn hủy phân lớp? (Chỉ được hủy phân lớp khi chưa đóng tiền!)',
            { tone: 'bad', ok: 'Hủy phân lớp', title: 'Hủy phân lớp sinh viên' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'NH_NguoiHoc_ThongTinTuyenSinh/Xoa', versionAPI: 'v1.0',
                strId: nh.ID, strNguoiThucHien_Id: ums.session.userId }).then(function () {
                ui.toast('Hủy phân lớp thành công!', 'ok');
                veLop('chua');
                taiDs();
            });
        }).catch(function (err) { ums.api.handle(err, 'hủy phân lớp'); });
    }

    function rutHoSo() {
        if (!st.nh) { ui.toast('Bạn cần chọn đối tượng', 'warn'); return; }
        var nh = st.nh;
        ui.confirm('Bạn có chắc chắn rút hồ sơ không?', { tone: 'bad', ok: 'Rút hồ sơ', title: 'Rút hồ sơ' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'NH_RutHoSo/Them_NhapHoc_RutHoSo_TT',
                strNhapHoc_KeHoachNhapHoc_Id: F.kh.value, strQLSV_NguoiHoc_Id: nh.ID,
                strNguoiThucHien_Id: ums.session.userId }).then(function () {
                ui.toast('Rút hồ sơ thành công!', 'ok');
                taiRut();
            });
        }).catch(function (err) { ums.api.handle(err, 'rút hồ sơ'); });
    }

    /* ---------------- Báo cáo ---------------- */
    function collect(add) {
        add('strTS_HoSoDuTuyen_Id', st.nh ? st.nh.ID : '');
        add('strNguoiThucHien_Id', ums.session.userId);
        add('strChucNang_Id', ums.state.chucNangId);
    }
    ums.report.mount(z('bc'), { import: false, collect: collect, onLoad: function (rows) {
        var coBaoCao = (rows || []).some(function (t) { return !/^IMPORT/i.test(e(t.MAUIMPORT_MA)); });
        z('bcGoc').hidden = coBaoCao;
    } });

    /* ---------------- Sự kiện ---------------- */
    pat.cotTrai(m, { tai: function () { taiDs(1); }, moSan: true, tuTaiLoc: false });
    m.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); taiDs(1); } });

    function lamMoiNguoi() { boChonNguoi(); }
    root.addEventListener('change', function (ev) {
        if (ev.target.matches('[data-f="dk"]')) {
            st.dk = ev.target.value;
            lamMoiNguoi();
            taiDs(1);
        }
    });
    if (window.jQuery) {
        jQuery(F.kh).on('select2:select', function () {
            st.kh = F.kh.value;
            lamMoiNguoi();
            taiDs(1);
            taiRut();
            /* Đồng bộ kế hoạch sang khung tìm lớp rồi nạp chương trình (gốc: val().trigger("change") + getList_ChuongTrinhDaoTao) */
            F.khTim.value = st.kh;
            jQuery(F.khTim).trigger('change');
            taiCT();
        });
        jQuery(F.khTim).on('select2:select select2:clear', taiCT);
        jQuery(F.ct).on('select2:select select2:clear', taiLop);
    }
    pat.chain([F.khTim, F.ct], { phatLai: false });

    root.addEventListener('click', function (ev) {
        var t = ev.target, b;
        if ((b = t.closest('.ums-drop__toggle')) && z('bcGoc').contains(b)) { P.batDrop(b); return; }
        if ((b = t.closest('[data-nhdrop]'))) {
            P.dongDrop(b);
            ums.report.run('PHIEUPHANLOP', { collect: collect });
            return;
        }
        var it = t.closest('.ums-master__item[data-id]');
        if (it && m.sideBody.contains(it)) {
            var r = st.rows.filter(function (x) { return String(x.ID) === it.getAttribute('data-id'); })[0];
            if (r) chonNguoi(r);
            return;
        }
        if ((b = t.closest('[data-lchon]'))) {
            var lop = st.dsLop[Number(b.getAttribute('data-lchon'))];
            if (!lop) return;
            st.lopId = e(lop.ID); st.lopTen = e(lop.TEN);
            if (z('lopSV')) veLop('chon');
            veLop2();
            return;
        }
        if ((b = t.closest('[data-lct]'))) { var l2 = st.dsLop[Number(b.getAttribute('data-lct'))]; if (l2) chiTietLop(l2); return; }
        if (!(b = t.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'phanlop' || a === 'dkCo') phanLop();
        else if (a === 'dkKhong' || a === 'boChonLop') { veLop('chua'); veLop2(); }
        else if (a === 'huyPL') huyPhanLop();
        else if (a === 'rut') rutHoSo();
        else if (a === 'timLop') taiLop();
    });

    /* ---------------- Khởi động ---------------- */
    veHoSo();
    nhacLop();
    taiRut();
    P.keHoachNhapHoc().then(function (rows) {
        st.dsKH = rows;
        pat.fill(F.kh, rows, { name: 'TENKEHOACH' });
        pat.fill(F.khTim, rows, { name: 'TENKEHOACH' });
    }, function (err) { ums.api.handle(err, 'kế hoạch nhập học'); }).then(function () { taiDs(1); });
})();
