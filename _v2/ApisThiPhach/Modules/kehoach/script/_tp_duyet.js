/* =========================================================================
   Thi phách — khung chung của HAI màn cùng nạp một tệp gốc duyetdulieuthi.js (lớp DuLieuThi):
       ums.tpDuyet.man(root, { kieu: 'duyet' })   duyetdulieuthi.html  "Cập nhật đủ điều kiện dự thi"
       ums.tpDuyet.man(root, { kieu: 'han' })     hannhapdiem.html     "Nhập hạn nhập điểm"
   Bản gốc: ApisThiPhach/Modules/kehoach/html/{duyetdulieuthi,hannhapdiem}.html + script/duyetdulieuthi.js
   ---------------------------------------------------------------------------
   HAI MÀN KHÁC NHAU Ở ĐÂU (so hai html gốc):
                                   duyet                                   han
     Ô lọc                         Thời gian, Hệ, Khoá, Kế hoạch,          Thời gian, Kế hoạch, Học phần
                                   Học phần, Loại xếp lịch
     Nút                           Tìm kiếm, Tạo dữ liệu xếp lịch thi,     Tìm kiếm, Cập nhật hạn nộp điểm
                                   Công bố lịch thi, Hủy dữ liệu xếp
                                   lịch thi, Cập nhật hạn nộp điểm, Import
     Cột bảng                      … Số SV · Công thức · Hạn nộp · TP      … Ngày bắt đầu → kết thúc · Hạn nộp · TP
     Ô đánh dấu ở cột thành phần   có (Tạo / Hủy dữ liệu dùng)             không (không nút nào dùng)
     Vùng "Công bố thi"            có (nút Công bố lịch thi mở)            html có vùng nhưng KHÔNG có nút mở → bỏ
   Bản gốc phân biệt hai màn bằng `$("#btnHuyDuLieu").length == 0` (genTable_DuLieuThi) — ở đây là cờ `kieu`.

   LỜI GỌI (chép nguyên văn; GET trừ khi ghi khác; strNguoiThucHien_Id = người đăng nhập):
     Bộ lọc
       DKH_Chung/LayThoiGianDangKyHoc                       → Thời gian (DAOTAO_THOIGIANDAOTAO), chọn nhiều
       ums.ref.heDaoTao (edu.system.getList_HeDaoTao — bản KHÔNG lọc quyền, như gốc; pageSize 1000000) → Hệ (TENHEDAOTAO)
       DKH_PhanCong_LopHP/LayDSKhoaToChuc                   strDaoTao_HeDaoTao_Id, strDaoTao_ThoiGianDaoTao_Id → Khoá (TENKHOA)
       TP_ToChucThi/LayDSDangKy_KeHoachDangKy               strTuKhoa '', strDaoTao_ThoiGianDaoTao_Id, pageIndex 1, pageSize 10000 → Kế hoạch (TENKEHOACH)
       TP_ToChucThi/LayDSHocPhanTheoKeHoach                 strDaoTao_ThoiGianDaoTao_Id, strDangKy_KeHoachDangKy_Id → Học phần (MA - TEN)
       TP_ToChucThi/LayDSThanhPhanDiemThi                   → cột "Thành phần tổ chức điểm thi" + ô Loại điểm của khung danh sách
     Danh sách
       TP_ToChucThi/LayDSLopHocPhan                         strDaoTao_ThoiGianDaoTao_Id, strDangKy_KeHoachDangKy_Id, strDaoTao_HocPhan_Id,
                                                            'strDaoTao_HeDaoTao_Id  ' (khoá có HAI DẤU CÁCH ở cuối — y như gốc, xem "Giữ như gốc"),
                                                            strDaoTao_KhoaDaoTao_Id
       TP_ToChucThi/LayTTThanhPhanDiemTheoLop               strDaoTao_LopHocPhan_Id — MỖI DÒNG một lời gọi → "Xem <SOSV>" (đỏ khi khác SOSV của lớp)
     Ghi (mỗi ô / mỗi dòng một lời gọi, chạy qua ums.ui.batch)
       XLHV_TP_ToChucThi_MH/FSk0IgkoJC8VIC4FNA0oJDQNKCIpFSko · pkg_thi_tochucthi.ThucHienTaoDuLieuLichThi (POST, mã hoá)
                                                            strDaoTao_LopHocPhan_Id, strDiem_ThanhPhanDiem_Id, dChiTaoDuLieuDuDKThi (ô Loại xếp lịch 0 | 1)
       TP_ToChucThi/ThucHienHuyDuLieuLichThi (POST)         strDaoTao_LopHocPhan_Id, strDiem_ThanhPhanDiem_Id
       TP_ToChucThi/CapNhatHanNopDiemTheoLop (POST)         strDaoTao_LopHocPhan_Id, strHanNopDiem — chỉ các ô ĐÃ ĐỔI
     Khung "Thông tin danh sách" (bấm "Xem")
       TP_ToChucThi/LayDSNguoiHocTheoLop                    strDaoTao_LopHocPhan_Id, strDiem_ThanhPhanDiem_Id
       TP_Chung/LayTrangThaiTruocThi                        strNguoiDung_Id → các nút trạng thái
       TP_XacNhanTruocThi/LayDanhSach                       strTuKhoa '', strsanpham_Id (chuỗi ghép, phẩy), strTinhTrang_Id '', strNguoiThucHien_Id '',
                                                            pageIndex 1, pageSize 100000 → lịch sử
       TP_XacNhanTruocThi/ThemMoi (POST)                    strSanPham_Id = <ID dòng> + <ID lớp HP> + <ID loại điểm> (ghép liền, như gốc),
                                                            strNguoiXacnhan_Id (chữ n thường như gốc), strNoiDung, strTinhTrang_Id
     Vùng "Công bố thi" (chỉ màn duyet)
       TP_ToChucThi/LayDSThoiGian                           → Thời gian (THOIGIAN)
       TP_ToChucThi/LayDSThanhPhanDiemSauThi                strDaoTao_ThoiGianDaoTao_Id → Loại điểm (TEN)
       TP_ToChucThi/LayDSDotThi                             strDaoTao_ThoiGianDaoTao_Id, strDiem_ThanhPhanDiem_Id → Đợt thi (TENDOTTHI - NGAYBD - NGAYKT), chọn nhiều
       TP_ToChucThi/LayDSHocPhan                            strDotThi_Id, strHinhThucThi_Id '', strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id,
                                                            strTHI_DotThi_Id — chia lô 30 đợt thi một lời gọi, gộp bỏ trùng theo ID
       DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc            ba tham số rỗng → Chương trình (gộp theo TENCHUONGTRINH, giữ ID đầu — như gốc)
       TP_Chung/LayTrangThaiCongBoLich                      strNguoiDung_Id → các nút công bố + ô lọc "Tình trạng công bố" (giá trị = TEN)
       XLHV_TP_ToChucThi_MH/DSA4BRIVKSgP · PKG_THI_TOCHUCTHI.LayDSThi (POST, mã hoá)
                                                            strThi_CaThi_Id '', strNgayThi, strDaoTao_ThoiGianDaoTao_Id, strDiem_ThanhPhanDiem_Id,
                                                            strNgayThiBatDau, strNgayThiKetThuc, strDaoTao_ChuongTrinh_Id, strDaoTao_HocPhan_Id,
                                                            strTHI_DotThi_Id — chia lô 30 theo mảng DÀI hơn (học phần / đợt thi), gộp bỏ trùng theo ID
       TP_CongBoLichThi/LayDSQLTHI_CongBoLichThi            strTuKhoa '', strsanpham_Id (lô 30), strTinhTrang_Id '', strNguoiThucHien_Id '', pageIndex 1,
                                                            pageSize 100000 → lịch sử
       TP_CongBoLichThi/Them_CongBoLichThi_DotThi | Them_QLTHI_CongBoLichThi | Them_CongBoLichThi_HocPhan (POST, mỗi mục một lời gọi)
                                                            strId '', strSanPham_Id, strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id,
                                                            strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id (= strSanPham_Id, như gốc),
                                                            strTHI_DotThi_Id (chuỗi các đợt đang chọn), strDiem_ThanhPhanDiem_Id
     Import: ums.report.importChung(…, 'IMPORTWITHPROC_VPDKTHI') — nút .btnImportWithProce của gốc.

   LỖI BẢN GỐC — KHÔNG CHÉP, làm theo ý định:
     · Công bố xong gọi me.getList_KhaoThi() — hàm KHÔNG tồn tại (TypeError trong complete) → nay nạp lại "Danh sách thi".
     · hannhapdiem: tiêu đề bảng 5 cột đầu (không có "Số SV") nhưng thân vẫn vẽ cột SOSV → mọi ô lệch một cột so với tiêu đề
       (ô Hạn nộp nằm dưới cột thành phần đầu tiên). Bản mới vẽ theo TIÊU ĐỀ: không cột Số SV.
     · hannhapdiem: ô đánh dấu ở cột thành phần không nút nào dùng (màn không có Tạo / Hủy dữ liệu) → không vẽ.
     · hannhapdiem có vùng "Công bố thi" trong html nhưng không có nút mở (và thiếu bảng danh sách thi) → không dựng.
     · Tạo / Hủy / Cập nhật hạn nộp báo "Thêm mới thành công!" cho MỖI lời gọi; câu hỏi lại ghi "tạo N và hủy 0" (Hủy thì ghi ngược
       "tạo 0 và hủy N") → hỏi lại nói đúng việc, báo gộp một lần.
     · actionTable (tiêu đề bảng nổi) đọc #bottom_anchor / #table-container không có trong html → lỗi JS mỗi lần cuộn → bỏ.
     · Nút #btnGoLeft / #btnGoRight, ô #txtSearch_TuKhoa, hàm resetPopup / popup: không có trong html → bỏ.
     · Tiêu đề khung "Thông tin danh sách - " để trống tên (#lblDanhSach không nơi nào gán) → nay ghi tên lớp học phần.
     · Khung rê chuột xem công thức (popover) → thuộc tính title của ô.
   GIỮ NHƯ GỐC (nghi ngờ — đã ghi báo cáo):
     · Khoá 'strDaoTao_HeDaoTao_Id  ' có hai dấu cách ở cuối → máy chủ nhiều khả năng KHÔNG nhận được Hệ (Khoá đã lọc theo Hệ
       nên kết quả vẫn hẹp lại khi chọn Khoá). Sửa khoá là đổi dữ liệu trả về → để nguyên.
     · Nút "Xóa" ở khung "Thông tin danh sách" không có xử lý ở gốc → giữ nút, khoá.
     · Mỗi dòng một lời gọi LayTTThanhPhanDiemTheoLop (danh sách dài = nhiều lời gọi) — chạy 6 luồng.
     · Đổi ô lọc không tự tải danh sách — bấm "Tìm kiếm".
     · Vùng báo cáo #zonebtnBaoCao_DDLT có trong html nhưng gốc không nạp mẫu báo cáo nào → không có nút báo cáo.
   KHÁC GỐC CÓ CHỦ Ý (luật chung của bản mới):
     · Thời gian → Kế hoạch → Học phần: khoá con khi chưa chọn cha, xoá con khi đổi / xoá cha (gốc nạp sẵn mọi kế hoạch / học phần).
     · Công bố: Thời gian → Loại điểm, Thời gian → Đợt thi → Học phần khoá theo tầng. Loại điểm là lọc TUỲ CHỌN của Đợt thi
       (gốc nạp Đợt thi ngay khi chọn Thời gian) → không khoá Đợt thi theo Loại điểm; đổi Loại điểm thì xoá Đợt thi + Học phần.
     · Hệ → Khoá ("Tất cả hệ / khóa đào tạo") là lọc tuỳ chọn → KHÔNG khoá; đổi / xoá Hệ hoặc Thời gian thì nạp lại Khoá.
     · Công bố lịch thi hỏi lại trước khi ghi (gốc bấm nút tình trạng là ghi ngay).
     · "Hủy dữ liệu xếp lịch thi" là nút xoá nhiều dòng chuẩn (ums.ui.xoaChon) — khoá tới khi có ô được đánh dấu.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var T = ums.tpDuyet = ums.tpDuyet || {};
    var MAX_SELECTED = 500, BATCH_SIZE = 30;

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(action, o) { return ums.api.call(Object.assign({ action: action, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    function post(action, o) { return Object.assign({ action: action, method: 'POST', strNguoiThucHien_Id: uid() }, o); }
    function nhieu(el) {
        if (!el) return [];
        var v = el.multiple ? (window.jQuery ? jQuery(el).val() || [] : []) : (el.value ? [el.value] : []);
        return v.filter(function (x) { return x !== '' && x !== null && x !== undefined; });
    }
    function nghe(el, fn, them) { if (el && window.jQuery) jQuery(el).on('select2:select select2:clear' + (them === false ? '' : ' select2:unselect'), fn); }
    function xoaGiaTri(el) {
        if (!el || !window.jQuery) return;
        if (el.multiple) jQuery(el).val([]); else el.value = '';
        jQuery(el).trigger('change.select2').trigger('ums:refresh');
    }
    /* checkSelectionLimit của gốc: chặn chọn quá 500 mục một ô */
    function quaNguong(el, nhan) {
        var n = nhieu(el).length;
        if (n <= MAX_SELECTED) return false;
        ui.toast('Bạn đã chọn ' + n + ' ' + nhan + ', vượt ngưỡng tối đa ' + MAX_SELECTED + '. Vui lòng bỏ bớt lựa chọn để tránh quá tải.', 'warn');
        return true;
    }
    /* loadInBatches của gốc: chia mảng ID thành lô, gọi song song, gộp Data, bỏ trùng theo khoá. Mảng rỗng = MỘT lời gọi chuỗi rỗng. */
    function theoLo(ids, goi, khoaTrung) {
        var lo = [];
        if (!ids || !ids.length) lo.push('');
        else for (var i = 0; i < ids.length; i += BATCH_SIZE) lo.push(ids.slice(i, i + BATCH_SIZE).join(','));
        var loi = null;
        return Promise.all(lo.map(function (s) {
            return ums.api.call(goi(s)).then(function (r) { return arr(r.data); }, function (err) { if (!loi) loi = err; return []; });
        })).then(function (kq) {
            var gop = [];
            kq.forEach(function (d) { gop = gop.concat(d); });
            if (loi) { if (loi.expired) ums.api.handle(loi); else ui.toast('Lỗi tải dữ liệu: ' + loi.message, 'warn'); }
            if (khoaTrung) {
                var thay = {};
                gop = gop.filter(function (x) {
                    var k = x[khoaTrung];
                    if (k === null || k === undefined) return true;
                    if (thay[k]) return false;
                    thay[k] = true;
                    return true;
                });
            }
            return gop;
        });
    }
    function oChon(attr, khoa, nhan, o) {
        o = o || {};
        return '<div class="ums-field' + (o.rong ? ' tpd-rong' : '') + '"><select class="ums-select" ' + attr + '="' + khoa + '"' + (o.multiple ? ' multiple' : '') +
            ' data-ph="' + esc(nhan) + '">' + (o.multiple ? '' : '<option value="">' + esc(nhan) + '</option>') + '</select></div>';
    }
    function oNgay(attr, khoa, nhan) {
        return '<div class="ums-field"><input class="ums-input" ' + attr + '="' + khoa + '" data-date placeholder="' + esc(nhan) + '" autocomplete="off"></div>';
    }
    function nut(html) { return '<div class="ums-field ums-field--fit">' + html + '</div>'; }

    /* ---------------------------------------------------------------------
       Hộp "Xác nhận" / "Công bố lịch": ô Nội dung + các nút tình trạng lớn + lịch sử
       (modal_XacNhan / modal_CongBo của gốc; nút vẽ bằng loadBtnXacNhan / loadBtnCongBo).
       o = { tieuDe, icon, soMuc, nhanNut, nhanLs, nut: Promise<dòng>, lichSu: Promise<dòng>, luu(id, noiDung, ten) }
       Kiểu nút dùng lớp .nd-xn của Cổng cán bộ (nhapdiem.css nạp chéo). */
    function hopTinhTrang(o) {
        var dlg = ui.dialog({ title: o.tieuDe, icon: o.icon, size: 'lg',
            body: (o.soMuc > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + o.soMuc + ' mục đã chọn.</p>' : '') +
                ui.field('Nội dung', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">' + esc(o.nhanNut) + '</div><div class="nd-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                '<div class="ums-legend ums-legend--cach">' + esc(o.nhanLs) + '</div><div data-x="ls">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        var DS = [];
        o.nut.then(function (d) {
            DS = d;
            if (dlg.closed) return;
            q('nut').innerHTML = d.length ? d.map(function (h, i) {
                var ic = ums.iconFA4 ? ums.iconFA4(h.THONGTIN1 || 'fa fa-paper-plane') : 'fa-light fa-paper-plane';
                return '<button type="button" class="nd-xn__nut" data-tt="' + i + '"><i class="' + esc(ic) + '"' + (h.THONGTIN2 ? ' style="' + esc(h.THONGTIN2) + '"' : '') +
                    '></i><span>' + esc(e(h.TEN)) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo tình trạng');
        }).catch(function (err) { if (!dlg.closed) q('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tình trạng'); });
        o.lichSu.then(function (d) {
            if (dlg.closed) return;
            ui.table({ el: q('ls'), rows: d, empty: 'Chưa có lịch sử', columns: [{ title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU', width: '200px' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center', width: '120px' }] });
        }).catch(function (err) { if (!dlg.closed) q('ls').innerHTML = ui.fail(err.message); });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tt]');
            if (!b) return;
            var h = DS[Number(b.getAttribute('data-tt'))];
            if (!h) return;
            var noiDung = q('nd').value.trim();
            Promise.resolve(o.hoi ? o.hoi(h) : true).then(function (yes) {
                if (!yes) return;
                dlg.close();
                o.luu(h.ID, noiDung, h.TEN);
            });
        });
        return dlg;
    }

    T.man = function (root, cfg) {
        var duyet = cfg.kieu !== 'han';
        var TP = [], DS = [], lanVe = 0;

        /* ---------- Khung ---------------------------------------------------- */
        var loc = oChon('data-f', 'tg', 'Chọn học kỳ', { multiple: true });
        if (duyet) loc += oChon('data-f', 'he', 'Tất cả hệ đào tạo', { multiple: true }) + oChon('data-f', 'khoa', 'Tất cả khóa đào tạo', { multiple: true });
        loc += oChon('data-f', 'kh', 'Chọn kế hoạch', { multiple: true }) + oChon('data-f', 'hp', 'Chọn học phần');
        if (duyet) loc += '<div class="ums-field"><select class="ums-select" data-f="lx" data-required>' +
            '<option value="0">Xếp lịch với mọi sinh viên</option><option value="1">Không xếp lịch với sinh viên không đủ điều kiện thi</option></select></div>';
        loc += nut(ui.btn('search', { text: 'Tìm kiếm', attr: { 'data-a': 'search' } }));
        if (duyet) loc += nut(ui.btn('save', { text: 'Tạo dữ liệu xếp lịch thi', icon: 'fa-calendar-clock', attr: { 'data-a': 'tao' } })) +
            nut(ui.btn('search', { text: 'Công bố lịch thi', icon: 'fa-calendar-lines-pen', mod: 'primary', attr: { 'data-a': 'mocb' } }));

        var h = '<div data-z="ds">' +
            pat.page(cfg.tieuDe, duyet ? ui.btn('importer', { text: 'Import Vi phạm điều kiện thi', attr: { 'data-a': 'import' } }) : '') +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + loc + '</div>' }) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
                tools: (duyet ? ui.xoaChon('input[data-tp]', { goc: '.ums-panel', text: 'Hủy dữ liệu xếp lịch thi', attr: { 'data-a': 'huy' } }) : '') +
                    ui.btn('save', { text: 'Cập nhật hạn nộp điểm', attr: { 'data-a': 'han' } }),
                body: ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-filter') }) +
            '</div>' +
            '<div data-z="xem" hidden>' +
            pat.panel({ title: 'Thông tin danh sách', icon: 'fa-list-check', count: 'xten', flush: true,
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('confirm', { text: 'Cập nhật trạng thái', mod: 'primary', attr: { 'data-a': 'trangthai' } }) +
                    ui.btn('del', { text: 'Xóa', mod: 'ghost', attr: { disabled: 'disabled', 'data-khong-chon': '1', title: 'Bản gốc chưa có xử lý cho nút này' } }),
                body: '<div class="ums-filter tpd-loc"><div class="ums-field"><select class="ums-select" data-x="ld" data-required data-ph="Chọn loại điểm"></select></div></div>' +
                    '<div data-z="sv"></div>' }) +
            '</div>';
        if (duyet) h += '<div data-z="cb" hidden>' +
            pat.panel({ title: 'Công bố thi', icon: 'fa-calendar-lines-pen',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('confirm', { text: 'Công bố cả đợt thi', mod: 'danger', icon: 'fa-calendar-lines-pen', attr: { 'data-a': 'cb-dot' } }) +
                    ui.btn('confirm', { text: 'Công bố theo học phần', mod: 'primary', icon: 'fa-chalkboard', attr: { 'data-a': 'cb-hp' } }),
                body: '<div class="ums-filter">' + oChon('data-g', 'tg', 'Chọn học kỳ') + oChon('data-g', 'ld', 'Chọn loại điểm') +
                    oChon('data-g', 'dot', 'Chọn đợt thi', { multiple: true, rong: true }) + oChon('data-g', 'hp', 'Chọn học phần', { multiple: true }) +
                    oChon('data-g', 'ct', 'Tất cả chương trình đào tạo', { multiple: true }) +
                    oNgay('data-g', 'ngay', 'Xem theo ngày thi') + oNgay('data-g', 'tu', 'Từ ngày') + oNgay('data-g', 'den', 'Đến ngày') +
                    oChon('data-g', 'tt', 'Tình trạng công bố') +
                    nut(ui.btn('search', { text: 'Tải danh sách thi', attr: { 'data-a': 'taidst' } })) +
                    nut('<label class="ums-check"><input type="checkbox" data-g="chua"> Lọc chưa công bố</label>') + '</div>' }) +
            pat.panel({ title: 'Danh sách thi', icon: 'fa-list-timeline', count: 'ndst', flush: true, zone: 'dst',
                tools: ui.btn('confirm', { text: 'Công bố theo học phần - danh sách thi', icon: 'fa-laptop-file', attr: { 'data-a': 'cb-dst' } }),
                body: ui.empty('Chọn điều kiện rồi bấm "Tải danh sách thi"', 'fa-filter') }) +
            '</div>';
        root.innerHTML = h;
        ui.enhance(root);

        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function g(k) { return root.querySelector('[data-g="' + k + '"]'); }
        function x(k) { return root.querySelector('[data-x="' + k + '"]'); }
        function v(el) { return pat.val(el); }

        /* ---------- Bộ lọc --------------------------------------------------- */
        var chuoi = pat.chain([f('tg'), f('kh'), f('hp')], { phatLai: false });
        function napKH() {
            if (!v(f('tg'))) { pat.fill(f('kh'), []); chuoi.sync(); return Promise.resolve(); }
            return get('TP_ToChucThi/LayDSDangKy_KeHoachDangKy', { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v(f('tg')), pageIndex: 1, pageSize: 10000 })
                .then(function (r) { pat.fill(f('kh'), arr(r.data), { name: 'TENKEHOACH' }); chuoi.sync(); })
                .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
        }
        function napHP() {
            if (!v(f('tg')) || !v(f('kh'))) { pat.fill(f('hp'), []); chuoi.sync(); return Promise.resolve(); }
            return get('TP_ToChucThi/LayDSHocPhanTheoKeHoach', { strDaoTao_ThoiGianDaoTao_Id: v(f('tg')), strDangKy_KeHoachDangKy_Id: v(f('kh')) })
                .then(function (r) { pat.fill(f('hp'), arr(r.data), { name: function (a) { return e(a.MA) + ' - ' + e(a.TEN); } }); chuoi.sync(); })
                .catch(function (err) { ums.api.handle(err, 'học phần'); });
        }
        function napKhoa() {
            if (!duyet) return Promise.resolve();
            return get('DKH_PhanCong_LopHP/LayDSKhoaToChuc', { strDaoTao_HeDaoTao_Id: v(f('he')), strDaoTao_ThoiGianDaoTao_Id: v(f('tg')) })
                .then(function (r) { pat.fill(f('khoa'), arr(r.data), { name: 'TENKHOA' }); })
                .catch(function (err) { ums.api.handle(err, 'khóa đào tạo'); });
        }
        nghe(f('tg'), function () { napKH().then(napHP); napKhoa(); });
        nghe(f('kh'), function () { napHP(); });
        if (duyet) nghe(f('he'), function () { xoaGiaTri(f('khoa')); napKhoa(); });

        get('DKH_Chung/LayThoiGianDangKyHoc', {}).then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO' }); chuoi.sync(); })
            .catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });
        if (duyet) {
            ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
            napKhoa();
        }
        var sanTP = get('TP_ToChucThi/LayDSThanhPhanDiemThi', {}).then(function (r) {
            TP = arr(r.data);
            pat.fill(x('ld'), TP, { head: 'Chọn loại điểm' });
        }).catch(function (err) { ums.api.handle(err, 'thành phần điểm thi'); });

        /* ---------- Danh sách lớp học phần ----------------------------------- */
        function thamSo() {
            var o = { strDaoTao_ThoiGianDaoTao_Id: v(f('tg')), strDangKy_KeHoachDangKy_Id: v(f('kh')), strDaoTao_HocPhan_Id: v(f('hp')) };
            o['strDaoTao_HeDaoTao_Id  '] = duyet ? v(f('he')) : '';   // khoá có hai dấu cách ở cuối — y như gốc
            o.strDaoTao_KhoaDaoTao_Id = duyet ? v(f('khoa')) : '';
            return o;
        }
        function tim() {
            if (quaNguong(f('tg'), 'thời gian đào tạo') || quaNguong(f('he'), 'hệ đào tạo') || quaNguong(f('khoa'), 'khóa đào tạo') || quaNguong(f('kh'), 'kế hoạch')) return;
            tai();
        }
        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return sanTP.then(function () { return get('TP_ToChucThi/LayDSLopHocPhan', thamSo()); }).then(function (r) {
                DS = arr(r.data);
                z('n').textContent = '(' + ui.so(r.pager || DS.length) + ')';
                ve();
            }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp học phần'); });
        }
        function ve() {
            var cot = [{ title: 'Thông tin học phần', render: function (a) { return esc(e(a.DAOTAO_HOCPHAN_TEN) + ' - ' + e(a.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Lớp học phần', prop: 'TENLOP' }];
            if (duyet) cot.push({ title: 'Số SV', prop: 'SOSV', cls: 'is-center' },
                { title: 'Công thức', render: function (a) { return '<span class="tpd-ct" title="' + esc(e(a.CONGTHUC)) + '">' + esc(e(a.CONGTHUC_TUKHOA)) + '</span>'; } });
            else cot.push({ title: 'Ngày bắt đầu → Ngày kết thúc', cls: 'is-center is-nowrap', render: function (a) { return esc(e(a.NGAYBATDAU) + ' → ' + e(a.NGAYKETTHUC)); } });
            cot.push({ title: 'Hạn nộp', width: '150px', render: function (a) {
                return '<input class="ums-input ums-input--sm tpd-han" data-han="' + esc(a.ID) + '" data-goc="' + esc(e(a.HANNOPDIEM)) + '" value="' + esc(e(a.HANNOPDIEM)) + '" autocomplete="off">';
            } });
            TP.forEach(function (t) {
                cot.push({ group: ['Thành phần tổ chức điểm thi'], cls: 'is-center is-nowrap',
                    head: esc(e(t.TEN)) + (duyet ? ' <input type="checkbox" data-tpall="' + esc(t.ID) + '" title="Chọn cả cột">' : ''),
                    render: function (a) {
                        var k = esc(a.ID + '|' + t.ID);
                        return '<span class="tpd-tp">' + (duyet ? '<input type="checkbox" data-tp="' + k + '">' : '') +
                            ui.btn('view', { text: 'Xem', mod: 'quiet', cls: 'ums-btn--sm', attr: { 'data-xem': a.ID + '|' + t.ID } }) + '</span>';
                    } });
            });
            ui.table({ el: z('bang'), rows: DS, columns: cot, empty: 'Không có lớp học phần nào' });
            var lan = ++lanVe;
            /* Mỗi lớp một lời gọi lấy số người học theo thành phần — 6 luồng */
            var i = 0;
            function chay() {
                if (lan !== lanVe || i >= DS.length) return Promise.resolve();
                var a = DS[i++];
                return get('TP_ToChucThi/LayTTThanhPhanDiemTheoLop', { strDaoTao_LopHocPhan_Id: a.ID, silent: true }).then(function (r) {
                    if (lan !== lanVe) return;
                    arr(r.data).forEach(function (d) {
                        var b = z('bang').querySelector('[data-xem="' + a.ID + '|' + d.DIEM_THANHPHANDIEM_ID + '"]');
                        if (!b) return;
                        var sp = b.querySelector('span');
                        if (sp) sp.textContent = 'Xem ' + e(d.SOSV);
                        b.classList.toggle('tpd-lech', String(e(a.SOSV)) !== String(e(d.SOSV)));
                        if (String(e(a.SOSV)) !== String(e(d.SOSV))) b.title = 'Số người học (' + e(d.SOSV) + ') khác số sinh viên của lớp (' + e(a.SOSV) + ')';
                    });
                }, function () {}).then(chay);
            }
            for (var k = 0; k < Math.min(6, DS.length); k++) chay();
        }
        function oDaChon() {
            return Array.prototype.map.call(z('bang').querySelectorAll('tbody input[data-tp]:checked'), function (c) {
                var p = c.getAttribute('data-tp').split('|');
                return { lop: p[0], tp: p[1] };
            });
        }
        function tao() {
            var ds = oDaChon();
            if (!ds.length) { ui.toast('Chưa đánh dấu ô nào ở cột "Thành phần tổ chức điểm thi"', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn tạo dữ liệu xếp lịch thi cho ' + ds.length + ' ô đã đánh dấu?', { title: 'Tạo dữ liệu xếp lịch thi' }).then(function (yes) {
                if (!yes) return;
                var lx = f('lx').value;
                ui.batch(ds.map(function (d) {
                    return { action: 'XLHV_TP_ToChucThi_MH/FSk0IgkoJC8VIC4FNA0oJDQNKCIpFSko', func: 'pkg_thi_tochucthi.ThucHienTaoDuLieuLichThi',
                        strDaoTao_LopHocPhan_Id: d.lop, strDiem_ThanhPhanDiem_Id: d.tp, dChiTaoDuLieuDuDKThi: lx, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang tạo dữ liệu xếp lịch thi', okText: 'Tạo dữ liệu xếp lịch thi', concurrency: 5, show: true }).then(tai);
            });
        }
        function huy() {
            var ds = oDaChon();
            if (!ds.length) return;
            ui.confirm('Bạn có chắc chắn hủy dữ liệu xếp lịch thi của ' + ds.length + ' ô đã đánh dấu?', { title: 'Hủy dữ liệu xếp lịch thi', tone: 'bad', ok: 'Hủy dữ liệu' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ds.map(function (d) { return post('TP_ToChucThi/ThucHienHuyDuLieuLichThi', { strDaoTao_LopHocPhan_Id: d.lop, strDiem_ThanhPhanDiem_Id: d.tp }); }),
                    { title: 'Đang hủy dữ liệu xếp lịch thi', okText: 'Hủy dữ liệu xếp lịch thi', concurrency: 5, show: true }).then(tai);
            });
        }
        function luuHan() {
            var doi = Array.prototype.filter.call(z('bang').querySelectorAll('input[data-han]'), function (i) { return i.value !== i.getAttribute('data-goc'); });
            if (!doi.length) { ui.toast('Không có thay đổi lưu', 'info'); return; }
            ui.confirm('Bạn có chắc chắn lưu hạn nộp điểm của ' + doi.length + ' lớp học phần?', { title: 'Cập nhật hạn nộp điểm' }).then(function (yes) {
                if (!yes) return;
                ui.batch(doi.map(function (i) { return post('TP_ToChucThi/CapNhatHanNopDiemTheoLop', { strDaoTao_LopHocPhan_Id: i.getAttribute('data-han'), strHanNopDiem: i.value }); }),
                    { title: 'Đang cập nhật hạn nộp điểm', okText: 'Cập nhật hạn nộp điểm', concurrency: 5, show: true }).then(tai);
            });
        }

        /* ---------- Khung "Thông tin danh sách" ------------------------------ */
        var LOP = '', SV = [];
        function moXem(lop, tp) {
            LOP = lop;
            var a = DS.filter(function (d) { return d.ID === lop; })[0];
            z('xten').textContent = a ? '- ' + e(a.TENLOP) : '';
            x('ld').value = tp;
            if (window.jQuery) jQuery(x('ld')).trigger('change.select2');
            ui.swap(z('ds'), z('xem'));
            taiSV();
        }
        function taiSV() {
            z('sv').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return get('TP_ToChucThi/LayDSNguoiHocTheoLop', { strDaoTao_LopHocPhan_Id: LOP, strDiem_ThanhPhanDiem_Id: x('ld').value }).then(function (r) {
                SV = arr(r.data);
                ui.table({ el: z('sv'), rows: SV, empty: 'Không có người học', columns: [
                    { title: 'Mã sinh viên', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'HODEM' }, { title: 'Tên', prop: 'TEN' },
                    { title: 'Học phần', render: function (s) { return esc(e(s.DAOTAO_HOCPHAN_TEN) + ' - ' + e(s.DAOTAO_HOCPHAN_MA)); } },
                    { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                    { title: 'Loại điểm', prop: 'DIEM_THANHPHANDIEM_TEN' }, { title: 'Trạng thái', prop: 'TRANGTHAI' },
                    { head: '<input type="checkbox" data-svall title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (s, i) { return '<input type="checkbox" data-sv="' + i + '">'; } }] });
            }).catch(function (err) { z('sv').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách người học'); });
        }
        nghe(x('ld'), taiSV, false);
        function trangThai() {
            var chon = Array.prototype.map.call(z('sv').querySelectorAll('tbody input[data-sv]:checked'), function (c) { return SV[Number(c.getAttribute('data-sv'))]; }).filter(Boolean);
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
            var ld = x('ld').value;
            var khoa = chon.map(function (s) { return s.ID + LOP + ld; });   // ghép liền, không dấu cách — như gốc
            hopTinhTrang({ tieuDe: 'Xác nhận', icon: 'fa-circle-check', soMuc: chon.length, nhanNut: 'Chọn trạng thái', nhanLs: 'Lịch sử trạng thái',
                nut: get('TP_Chung/LayTrangThaiTruocThi', { strNguoiDung_Id: uid() }).then(function (r) { return arr(r.data); }),
                lichSu: ums.api.call({ action: 'TP_XacNhanTruocThi/LayDanhSach', method: 'GET', strTuKhoa: '', strsanpham_Id: khoa.join(','), strTinhTrang_Id: '',
                    strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) { return arr(r.data); }),
                luu: function (tt, noiDung) {
                    ui.batch(khoa.map(function (k) {
                        return post('TP_XacNhanTruocThi/ThemMoi', { strSanPham_Id: k, strNguoiXacnhan_Id: uid(), strNoiDung: noiDung, strTinhTrang_Id: tt });
                    }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', concurrency: 5, show: true }).then(taiSV);
                } });
        }

        /* ---------- Vùng "Công bố thi" (chỉ màn duyet) ----------------------- */
        var daMoCB = false, DST = [], chuoiA = null, chuoiB = null, sanNutCB = null;
        function dongBoCB() { if (chuoiA) chuoiA.sync(); if (chuoiB) chuoiB.sync(); }
        function napLD() {
            if (!g('tg').value) { pat.fill(g('ld'), []); dongBoCB(); return Promise.resolve(); }
            return get('TP_ToChucThi/LayDSThanhPhanDiemSauThi', { strDaoTao_ThoiGianDaoTao_Id: g('tg').value })
                .then(function (r) { pat.fill(g('ld'), arr(r.data), { head: 'Chọn loại điểm' }); dongBoCB(); }).catch(function (err) { ums.api.handle(err, 'loại điểm'); });
        }
        function napDot() {
            if (!g('tg').value) { pat.fill(g('dot'), []); dongBoCB(); return Promise.resolve(); }
            return get('TP_ToChucThi/LayDSDotThi', { strDaoTao_ThoiGianDaoTao_Id: g('tg').value, strDiem_ThanhPhanDiem_Id: g('ld').value })
                .then(function (r) {
                    pat.fill(g('dot'), arr(r.data), { name: function (a) { return e(a.TENDOTTHI) + ' - ' + e(a.NGAYBD) + ' - ' + e(a.NGAYKT); } });
                    dongBoCB();
                }).catch(function (err) { ums.api.handle(err, 'đợt thi'); });
        }
        function napHPcb() {
            var dot = nhieu(g('dot'));
            if (!dot.length) { pat.fill(g('hp'), []); dongBoCB(); return Promise.resolve(); }
            if (quaNguong(g('dot'), 'đợt thi')) return Promise.resolve();
            return theoLo(dot, function (s) {
                return { action: 'TP_ToChucThi/LayDSHocPhan', method: 'GET', strDotThi_Id: s, strHinhThucThi_Id: '', strDiem_ThanhPhanDiem_Id: g('ld').value,
                    strDaoTao_ThoiGianDaoTao_Id: g('tg').value, strTHI_DotThi_Id: s, strNguoiThucHien_Id: uid() };
            }, 'ID').then(function (d) {
                pat.fill(g('hp'), d, { name: function (a) { return e(a.DAOTAO_HOCPHAN_MA) + ' - ' + e(a.DAOTAO_HOCPHAN_TEN); } });
                dongBoCB();
            });
        }
        function taiDST() {
            var hp = nhieu(g('hp')), dot = nhieu(g('dot'));
            var chinh, khoaChinh, khoaPhu, phu;
            if (hp.length >= dot.length) { chinh = hp; khoaChinh = 'strDaoTao_HocPhan_Id'; khoaPhu = 'strTHI_DotThi_Id'; phu = dot.join(','); }
            else { chinh = dot; khoaChinh = 'strTHI_DotThi_Id'; khoaPhu = 'strDaoTao_HocPhan_Id'; phu = hp.join(','); }
            z('dst').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return theoLo(chinh, function (s) {
                var o = { action: 'XLHV_TP_ToChucThi_MH/DSA4BRIVKSgP', func: 'PKG_THI_TOCHUCTHI.LayDSThi', strThi_CaThi_Id: '', strNgayThi: g('ngay').value.trim(),
                    strDaoTao_ThoiGianDaoTao_Id: g('tg').value, strDiem_ThanhPhanDiem_Id: g('ld').value, strNgayThiBatDau: g('tu').value.trim(),
                    strNgayThiKetThuc: g('den').value.trim(), strDaoTao_ChuongTrinh_Id: v(g('ct')), strNguoiThucHien_Id: uid() };
                o[khoaChinh] = s; o[khoaPhu] = phu;
                return o;
            }, 'ID').then(function (d) { DST = d; veDST(); });
        }
        function veDST() {
            var d = DST, tt = g('tt').value;
            if (g('chua').checked) d = d.filter(function (a) { var t = a.TRANGTHAICONGBO_TEN; return t === null || t === undefined || (typeof t === 'string' && t.trim() === ''); });
            else if (tt) d = d.filter(function (a) { return (a.TRANGTHAICONGBO_TEN || '') === tt; });
            z('ndst').textContent = '(' + ui.so(d.length) + ')';
            var G = ['Thông tin công bố'];
            ui.table({ el: z('dst'), rows: d, empty: 'Không có danh sách thi', columns: [
                { title: 'Danh sách thi', prop: 'MADANHSACHTHI' }, { title: 'Phòng thi', prop: 'TKB_PHONGHOC_TEN' }, { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' },
                { title: 'Ca thi', prop: 'THI_CATHI_TEN' }, { title: 'Thông tin học phần thi', prop: 'DAOTAO_HOCPHAN_TEN' }, { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN' },
                { title: 'Lớp học phần', render: function (a) { return '<div class="tpd-lhp">' + esc(e(a.THONGTINLOPHOCPHAN)) + '</div>'; } },
                { title: 'Tình trạng', group: G, prop: 'TRANGTHAICONGBO_TEN' }, { title: 'Thời gian', group: G, prop: 'THOIGIANCONGBOLICH', cls: 'is-nowrap' },
                { title: 'Người thực hiện', group: G, prop: 'NGUOITHUCHIENCONGBOLICH' },
                { head: '<input type="checkbox" data-dstall title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (a) { return '<input type="checkbox" data-dst="' + esc(a.ID) + '">'; } }] });
        }
        function moCB() {
            ui.swap(z('ds'), z('cb'));
            if (daMoCB) return;
            daMoCB = true;
            nghe(g('tg'), function () { napLD(); napDot().then(napHPcb); }, false);
            nghe(g('ld'), function () { xoaGiaTri(g('dot')); xoaGiaTri(g('hp')); napDot().then(napHPcb); }, false);
            nghe(g('dot'), function () { napHPcb(); taiDST(); });
            nghe(g('hp'), function () { taiDST(); });
            nghe(g('ct'), function () { taiDST(); });
            nghe(g('tt'), veDST, false);
            chuoiA = pat.chain([g('tg'), g('ld')], { phatLai: false });
            chuoiB = pat.chain([g('tg'), g('dot'), g('hp')], { phatLai: false });
            get('TP_ToChucThi/LayDSThoiGian', {}).then(function (r) { pat.fill(g('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn học kỳ' }); dongBoCB(); })
                .catch(function (err) { ums.api.handle(err, 'thời gian'); });
            get('DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', { strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: '', strDaoTao_HeDaoTao_Id: '' }).then(function (r) {
                var thay = {}, ds = [];
                arr(r.data).forEach(function (a) {
                    var k = String(a.TENCHUONGTRINH || '').trim();
                    if (!k || thay[k]) return;
                    thay[k] = true;
                    ds.push({ ID: a.ID, TENCHUONGTRINH: k });
                });
                pat.fill(g('ct'), ds, { name: 'TENCHUONGTRINH' });
            }).catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
            napNutCB().then(function (d) { pat.fill(g('tt'), d, { id: 'TEN', name: 'TEN', head: 'Tình trạng công bố' }); }).catch(function (err) { ums.api.handle(err, 'tình trạng công bố'); });
        }
        function napNutCB() {
            if (!sanNutCB) sanNutCB = get('TP_Chung/LayTrangThaiCongBoLich', { strNguoiDung_Id: uid() }).then(function (r) { return arr(r.data); });
            return sanNutCB;
        }
        function congBo(kieu) {
            var K = {
                dot: ['TP_CongBoLichThi/Them_CongBoLichThi_DotThi', function () { return nhieu(g('dot')); }, 'Vui lòng chọn đợt thi!', 'đợt thi'],
                dst: ['TP_CongBoLichThi/Them_QLTHI_CongBoLichThi', function () { return Array.prototype.map.call(z('dst').querySelectorAll('tbody input[data-dst]:checked'), function (c) { return c.getAttribute('data-dst'); }); },
                    'Vui lòng chọn danh sách thi!', 'danh sách thi'],
                hp: ['TP_CongBoLichThi/Them_CongBoLichThi_HocPhan', function () { return nhieu(g('hp')); }, 'Vui lòng chọn học phần!', 'học phần']
            }[kieu];
            var ids = K[1]();
            if (!ids.length) { ui.toast(K[2], 'warn'); return; }
            hopTinhTrang({ tieuDe: 'Công bố lịch', icon: 'fa-calendar-lines-pen', soMuc: ids.length, nhanNut: 'Chọn xác nhận', nhanLs: 'Lịch sử',
                nut: napNutCB(),
                lichSu: theoLo(ids, function (s) {
                    return { action: 'TP_CongBoLichThi/LayDSQLTHI_CongBoLichThi', method: 'GET', strTuKhoa: '', strsanpham_Id: s, strTinhTrang_Id: '', strNguoiThucHien_Id: '',
                        pageIndex: 1, pageSize: 100000 };
                }),
                hoi: function (tt) {
                    return ui.confirm('Công bố lịch thi cho ' + ids.length + ' ' + K[3] + ' với tình trạng "' + e(tt.TEN) + '"?', { title: 'Công bố lịch thi', tone: 'warn', ok: 'Công bố' });
                },
                luu: function (tt, noiDung) {
                    var tg = g('tg').value, dot = v(g('dot')), ld = g('ld').value;
                    ui.batch(ids.map(function (id) {
                        return post(K[0], { strId: '', strSanPham_Id: id, strNoiDung: noiDung, strTinhTrang_Id: tt, strNguoiXacnhan_Id: uid(),
                            strDaoTao_ThoiGianDaoTao_Id: tg, strDaoTao_HocPhan_Id: id, strTHI_DotThi_Id: dot, strDiem_ThanhPhanDiem_Id: ld });
                    }), { title: 'Đang công bố lịch thi', okText: 'Xác nhận thành công', concurrency: 5, show: true }).then(taiDST);
                } });
        }

        /* ---------- Sự kiện --------------------------------------------------- */
        function chonCa(vung, attr, bat) { Array.prototype.forEach.call(vung.querySelectorAll('tbody input[' + attr + ']'), function (c) { c.checked = bat; }); }
        root.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.hasAttribute('data-tpall')) {
                var tp = t.getAttribute('data-tpall');
                Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-tp]'), function (c) { if (c.getAttribute('data-tp').split('|')[1] === tp) c.checked = t.checked; });
            } else if (t.hasAttribute('data-svall')) chonCa(z('sv'), 'data-sv', t.checked);
            else if (t.hasAttribute('data-dstall')) chonCa(z('dst'), 'data-dst', t.checked);
            else if (t.getAttribute('data-g') === 'chua') veDST();
            else if (t.hasAttribute('data-han')) t.classList.toggle('is-doi', t.value !== t.getAttribute('data-goc'));
        });
        root.addEventListener('click', function (ev) {
            var xem = ev.target.closest('[data-xem]');
            if (xem) { var p = xem.getAttribute('data-xem').split('|'); moXem(p[0], p[1]); return; }
            var b = ev.target.closest('[data-a]');
            if (!b || b.disabled) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') tim();
            else if (a === 'tao') tao();
            else if (a === 'huy') huy();
            else if (a === 'han') luuHan();
            else if (a === 'mocb') moCB();
            else if (a === 'dong') ui.swap(b.closest('[data-z="xem"], [data-z="cb"]'), z('ds'));
            else if (a === 'trangthai') trangThai();
            else if (a === 'taidst') taiDST();
            else if (a === 'cb-dot') congBo('dot');
            else if (a === 'cb-dst') congBo('dst');
            else if (a === 'cb-hp') congBo('hp');
            else if (a === 'import') ums.report.importChung('Vi phạm điều kiện thi', 'IMPORTWITHPROC_VPDKTHI', { onDone: function () { if (DS.length) tai(); } });
        });
    };
})();
