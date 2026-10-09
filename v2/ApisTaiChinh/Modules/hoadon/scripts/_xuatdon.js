/* =========================================================================
   ums.hoadon.xuat — khung chung của ba màn xuất hoá đơn lẻ
   ---------------------------------------------------------------------------
   Bản gốc:
     ApisTaiChinh/Modules/hoadon/scripts/xuathoadon.js       (xuathoadon.html VÀ xuatchungtu.html)
     ApisTaiChinh/Modules/hoadon/scripts/xuathoadonkhac.js   (xuathoadonkhac.html)
   Hai tệp gốc giống nhau ~90%; khác biệt gom vào cfg.mode:
     'sv'   — người học  (PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All)
     'khac' — đối tượng khác (TC_DoiTuongKhac/LayDanhSach)
   cfg.phatHanh = false cho xuatchungtu: HTML gốc của màn này KHÔNG có vùng
   #zoneActionXuatHoaDon nên không bao giờ hiện nút phát hành — giữ nguyên.

   LUỒNG (giữ đúng thứ tự bản gốc)
     1. Tìm đối tượng → chọn (Pager = 1 thì tự chọn)
     2. TC_ThongTinChung/LayDanhSach (GET v1.0, strQLSV_NguoiHoc_Id, strNguonDuLieu_Id '')
          rsKhoanDaNopChuaXuatHoaDon → bảng "Các khoản đã nộp" (sửa nội dung, số tiền, tách khoản)
          rsKhoanDaNopDaXuatHoaDon   → bảng "Các khoản đã xuất hoá đơn"
          rsThongTin[0]              → thẻ số liệu + thông tin người mua trên bản nháp
     3. Chọn khoản → "Xuất hoá đơn" → bản nháp (genHTML_NoiDung_HoaDon)
     4. Nút phương thức (danh mục TAICHINH.NUTHDDT):
          MA bắt đầu "HDDTNHAP" → HDDT_HoaDon/ThemMoi_Nhap (không hỏi lại) → mở tab bản nháp
          còn lại → hỏi xác nhận → HDDT_HoaDon/ThemMoi → xem hoá đơn vừa sinh
          THONGTIN4 có giá trị → ums.session.api.HDDT = THONGTIN4 (bản gốc gán
          edu.system.objApi["HDDT"], giữ tới hết phiên — y như vậy)
     5. Xem hoá đơn: In (→ TC_HoaDon/Them_TinhTrangInHoaDon) · Huỷ (TC_HoaDon/HuyHoaDon)

   TÍNH TIỀN — chép nguyên cách bản gốc, KHÔNG đổi:
     Ô số tiền giữ chuỗi dấu phẩy (formatCurrency). Mỗi dòng nháp:
       số lượng = 1, đơn giá = chuỗi ô tiền, thành tiền = fmt(num(đơn giá) * 1)
     Payload: strSoLuong_s = num('1'), strDonGia_s = num(đơn giá),
              strTaiChinh_SoTien_s = num(thành tiền), nối bằng ","; nội dung nối "#".
     Tổng = countFloat(thành tiền) (làm tròn xuống 2 số lẻ). Tổng = 0 thì không mở nháp.
     Dòng có ô tiền == 0 (kể cả rỗng) bị bỏ qua, đúng `if (dSoTien == 0) continue`.
     Tách khoản: dòng gốc nhận phần còn lại (trước − tổng các khoản tách);
       mỗi khoản tách chèn NGAY SAU dòng gốc (nên thứ tự ngược, như .after() của bản gốc);
       chỉ nhận khoản thu có ID dài 32 ký tự và số tiền khác 0.
       'sv': còn lại < 0 chỉ cảnh báo rồi vẫn tách (bản gốc comment `return`);
       'khac': còn lại < 0 thì chặn.
     'khac': gõ ô tiền chạy checkSoTienInput(bQuaSoTien = true) — không vượt số gốc.

   PAYLOAD phát hành — tên tham số chép nguyên văn:
     'sv' (obj_save của saveHoaDon, action đổi thành HDDT_HoaDon/ThemMoi[_Nhap]):
        strTaiChinh_DaNop_Ids = strTAICHINH_CACKHOANTHU_Ids = strTaiChinh_CacKhoanThu_Ids = các ID dòng
        (bản gốc chỉ thay strTAICHINH_CACKHOANTHU_Ids bằng id khoản thu ở nhánh
         TC_DaNop_HoaDon/ThemMoi — nhánh đó không bao giờ chạy, xem "Cố ý bỏ")
        strHinhThucThu_MA = MA của hình thức đang chọn (thuộc tính id của <option>)
        strHinhThucThu_TEN = THONGTIN1 nếu có (thuộc tính name), không thì " " + TEN
          (bản gốc lấy .text() của <option> — loadToCombo_data chèn một dấu cách đầu)
        strDonViTinh_Ids / strDonViTinhTen_s / strLoaiTienTe_Ids: lặp theo từng dòng
        strLoaiTienTe = ''  (me.strLoaiTienTe_Ma không bao giờ được gán ở bản gốc)
        strDaoTao_ToChucCT_Id = DAOTAO_TOCHUCCHUONGTRINH_ID của dòng người học đã chọn
     'khac': strLoaiDoiTuong 'DOITUONGKHAC', strTenNguoiThu (ô nhập), bTenNguoiThu true,
        bSoLuong (ô "Không hiển thị số lượng và đơn giá"), hình thức/ĐVT/loại tiền lấy
        từ khoản đầu tiên (HINHTHUCTHU_MA/TEN, DONVITINH_TEN, LOAITIENTE_MA).

   CỐ Ý BỎ
     · save_HoaDon (TC_DaNop_HoaDon/ThemMoi): chỉ chạy khi linkHDDT rỗng, mà bản gốc
       luôn gán "1111" ('sv') hoặc host+HDDT ('khac') → nhánh chết.
     · Tab "qua ngân hàng" (#tbldata_HoaDon_QuaBank): không lời gọi nào đổ dữ liệu vào.
     · .detail_KhoanThu (xem biên lai), zoneTongNoRieng: không phần tử nào mở được.
     · Popover hover thông tin người học, ảnh đại diện, gộp ô (collageInTable) — trang trí.
     · Phôi in riêng từng trường (getData_Phieu) — thay bằng bản xem chung (_chung.js).
     · Liên hoá đơn / đổi mẫu in — chỉ có nghĩa với phôi in riêng.
   SỬA LỖI BẢN GỐC (ghi rõ, không chép lỗi)
     · 'khac': ô nội dung hiện chữ "null" khi NOIDUNG rỗng (không qua returnEmpty) và
       chữ đó đi thẳng vào hoá đơn → ở đây để trống như bản 'sv'.
     · Nội dung dòng gửi lên lấy từ innerHTML của ô bảng (ký tự & < > bị gửi thành
       &amp; &lt; &gt; trên hoá đơn) → ở đây gửi đúng chữ người dùng nhập.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var H = ums.hoadon;

    H.xuat = function (root, cfg) {
        var mode = cfg.mode || 'sv';
        var SV = mode === 'sv';
        var st = {
            page: 1, size: 10, total: 0,
            hs: [], cur: null, hssvId: '', ctId: '',
            ttc: {}, rows: [], daXuat: [], dmlkt: [], nut: [],
            tab: 'chua', draft: null, hoaDonId: '', phieuMode: ''
        };

        /* =============================================================
           Khung
           ============================================================= */
        /* Bố cục hai cột dùng chung — ums.pat.master (BO-CUC mục 4) */
        root.classList.add('hd-xuat');
        var mst = ums.pat.master({
            el: root,
            title: cfg.title,
            side: {
                title: SV ? 'Người học' : 'Đối tượng khác', icon: 'fa-users', search: 'Nhập từ khoá tìm kiếm',
                filter: !SV ? '' :
                    /* Khung lọc nâng cao ẩn/hiện bằng biểu tượng thanh trượt ở đầu
                       cột trái — giống màn "Thu tiền" và "Thu tiền khác". Trước đây
                       dùng <details><summary> riêng một kiểu. */
                    '<div class="hd-xuat__adv" data-x="adv" hidden><div class="ums-stack">' +
                    '<select class="ums-select" data-x="he"><option value="">Tất cả hệ đào tạo</option></select>' +
                    '<select class="ums-select" data-x="khoa"><option value="">Tất cả khóa đào tạo</option></select>' +
                    '<select class="ums-select" data-x="ct"><option value="">Tất cả chương trình đào tạo</option></select>' +
                    '<select class="ums-select" data-x="lop"><option value="">Tất cả lớp</option></select>' +
                    '<div class="ums-field__label ums-u-mt-2">Trạng thái sinh viên</div><div data-x="tt"></div>' +
                    '</div></div>'
            },
            main: { title: false }
        });
        mst.side.querySelector('.ums-panel__tools').innerHTML =
            '<button type="button" class="ums-iconbtn" data-a="search" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' +
            (SV ? '<button type="button" class="ums-iconbtn" data-a="loc" title="Lọc nâng cao"><i class="fa-light fa-sliders"></i></button>' : '');
        mst.sideBody.setAttribute('data-x', 'hs');
        mst.sideBody.insertAdjacentHTML('afterend', '<div class="hd-xuat__pager" data-x="hsPager"></div>');
        mst.search.setAttribute('data-x', 'q');
        mst.sideCount.setAttribute('data-x', 'count');
        mst.mainBody.innerHTML =
            '<div class="ums-panel" data-x="none"><div class="ums-panel__body">' +
              ui.empty('Chọn một ' + (SV ? 'người học' : 'đối tượng') + ' ở cột trái để xem các khoản đã nộp', 'fa-hand-pointer') +
            '</div></div>' +
            '<div data-x="dt" hidden></div>' +
            '<div data-x="phieu" hidden></div>';

        function x(n) { return root.querySelector('[data-x="' + n + '"]'); }

        /* =============================================================
           Danh mục lọc (chỉ 'sv' — màn 'khac' không gửi các ô lọc này)
           ============================================================= */
        if (SV) {
            ['he', 'khoa', 'ct', 'lop'].forEach(function (k) { ui.select2(x(k)); });
            var P = { pageIndex: 1, pageSize: 1000000 };
            var loadHe = function () {
                return ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                    .then(function (r) { H.fillSelect(x('he'), r, 'ID', 'TENHEDAOTAO', 'Tất cả hệ đào tạo'); });
            };
            var loadKhoa = function () {
                return ums.ref.khoaDaoTao({ strHeDaoTao_Id: x('he').value, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                    .then(function (r) { H.fillSelect(x('khoa'), r, 'ID', 'TENKHOA', 'Tất cả khóa đào tạo'); });
            };
            var loadCT = function () {
                return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: x('khoa').value, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                    strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                    .then(function (r) { H.fillSelect(x('ct'), r, 'ID', 'TENCHUONGTRINH', 'Tất cả chương trình đào tạo'); });
            };
            var loadLop = function () {
                // Bản gốc đọc hệ từ #dropSearch_HeDaoTao_IHD — ô không tồn tại → luôn rỗng
                return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: '', strKhoaDaoTao_Id: x('khoa').value,
                    strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: x('ct').value, strNguoiThucHien_Id: '',
                    strTuKhoa: '', pageIndex: P.pageIndex, pageSize: P.pageSize })
                    .then(function (r) { H.fillSelect(x('lop'), r, 'ID', 'TEN', 'Tất cả lớp'); });
            };
            var fail = function (e) { ums.api.handle(e, 'nạp danh mục đào tạo'); };
            loadHe().catch(fail);
            loadKhoa().catch(fail);
            jQuery(x('he')).on('change', function () { loadKhoa().catch(fail); loadCT().catch(fail); loadLop().catch(fail); });
            jQuery(x('khoa')).on('change', function () { if (x('khoa').value) { loadCT().catch(fail); loadLop().catch(fail); } });
            jQuery(x('ct')).on('change', function () { if (x('ct').value) loadLop().catch(fail); });
            // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
            ums.pat.chain([x('he'), x('khoa'), x('ct'), x('lop')], { phatLai: false });

            st.ckTT = H.checks(x('tt'), H.trangThaiSV(), { checked: true });
        }

        H.khoanThu().then(function (r) { st.dmlkt = r; }).catch(function (e) { ums.api.handle(e, 'nạp danh mục khoản thu'); });
        if (cfg.phatHanh !== false) {
            H.nutHDDT().then(function (r) { st.nut = r; }).catch(function (e) { ums.api.handle(e, 'nạp nút hoá đơn điện tử'); });
        }

        /* =============================================================
           [1] Danh sách đối tượng
           ============================================================= */
        function loadHS(page) {
            if (page) st.page = page;
            var call = SV ? {
                action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P',
                func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All',
                strTuKhoa: x('q').value.trim(),
                strNguoiThucHien_Id: '',
                strVaiTroDangNhap_Id: '',
                strChucNangHeThong_Id: '',
                strHanhDong_Code: '',
                strDaoTao_HeDaoTao_Id: x('he').value,
                strDaoTao_KhoaDaoTao_Id: x('khoa').value,
                strDaoTao_ChuongTrinh_Id: x('ct').value,
                strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_LopQuanLy_Id: x('lop').value,
                strStudyStatus_Ids: st.ckTT ? st.ckTT.val() : '',
                dIsPrimary: '',
                dBoQuaPhamVi: 0,
                pageIndex: st.page,
                pageSize: st.size
            } : {
                action: 'TC_DoiTuongKhac/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                pageIndex: st.page, pageSize: st.size,
                strTuKhoa: x('q').value.trim()
            };
            x('hs').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(call).then(function (r) {
                st.hs = H.rows(r);
                st.total = Number(r.pager) || 0;
                drawHS();
                /* KHÔNG tự chọn khi còn một kết quả — gõ là tự tìm, có thể nhiều người trùng tên (người dùng 2026-09-26) */
            }).catch(function (e) {
                x('hs').innerHTML = ui.fail(e.message);
                ums.api.handle(e, 'tìm đối tượng');
            });
        }

        /* mục danh sách của ums.pat.master */
        function drawHS() {
            x('count').textContent = st.total ? '(' + st.total + ')' : '';
            if (!st.hs.length) {
                x('hs').innerHTML = ui.empty('Không tìm thấy đối tượng', 'fa-user-magnifying-glass');
                x('hsPager').innerHTML = '';
                return;
            }
            x('hs').innerHTML = st.hs.map(function (r) {
                var ten = SV ? ((r.HODEM || '') + ' ' + (r.TEN || '')) : r.TENDOITUONG;
                var ma = SV ? r.MASO : r.MASODOITUONG;
                /* Người học: ảnh người (có ảnh thì ảnh, không thì biểu tượng) — người dùng 2026-09-26 */
                return '<button type="button" class="ums-master__item' + (SV ? ' ums-dsns__item' : '') + '" data-id="' + esc(r.ID) + '">' +
                    (SV ? ums.pat.anhNguoi(r.ANH) + '<span class="ums-master__item__main">' : '') +
                    '<b>' + esc(ten) + '</b><span class="ums-master__item__sub">' + esc(ma === null || ma === undefined ? '' : ma) + '</span>' +
                    (SV ? '</span>' : '') + '</button>';
            }).join('');
            x('hsPager').innerHTML = ui.pager({ index: st.page, size: st.size, total: st.total }, st.hs.length);
            Array.prototype.forEach.call(x('hsPager').querySelectorAll('.ums-pager__btn[data-go]'), function (b) {
                b.addEventListener('click', function () { loadHS(Number(b.getAttribute('data-go'))); });
            });
            markHS();
        }

        function markHS() {
            Array.prototype.forEach.call(x('hs').querySelectorAll('[data-id]'), function (it) {
                it.classList.toggle('is-active', !!st.cur && it.getAttribute('data-id') === String(st.cur.ID));
            });
        }

        /* =============================================================
           [2] Chọn đối tượng → tình trạng tài chính
           ============================================================= */
        function chon(id) {
            var r = st.hs.find(function (h) { return String(h.ID) === String(id); });
            if (!r) return;
            st.cur = r;
            st.hssvId = SV ? r.QLSV_NGUOIHOC_ID : r.ID;
            st.ctId = SV ? r.DAOTAO_TOCHUCCHUONGTRINH_ID : '';
            st.rows = []; st.daXuat = []; st.ttc = {};
            markHS();
            x('none').hidden = true;
            x('phieu').hidden = true;
            drawDT();
            ui.reveal(x('dt'));
            loadTTC();
        }

        var TT = {
            CHUYENTRUONGDI: ['bad', 'fa-right-from-bracket'], NORMAL: ['info', 'fa-users'], CHUYENTRUONG: ['info', 'fa-right-to-bracket'],
            KHONGXACDINH: ['warn', 'fa-triangle-exclamation'], GRADUATE: ['ok', 'fa-graduation-cap'], FORCEDROPOUT: ['info', 'fa-triangle-exclamation'],
            CANHBAO: ['warn', 'fa-triangle-exclamation'], RESERVE: ['info', 'fa-user-secret'], DROPOUT: ['warn', 'fa-triangle-exclamation'],
            XOATEN: ['bad', 'fa-user-xmark'], REPEATE: ['warn', 'fa-triangle-exclamation'], DUNGHOC: ['warn', 'fa-ban']
        };

        function drawDT() {
            var r = st.cur;
            var ten = ((r.HODEM || '') + ' ' + (r.TEN || '')).trim();
            var hien = ten;
            if (r.MASO) hien += ' - ' + r.MASO;
            if (r.TTLL_DIENTHOAICANHAN) hien += ' - ' + r.TTLL_DIENTHOAICANHAN;
            if (!SV && !ten) hien = (r.TENDOITUONG || '') + (r.MASODOITUONG ? ' - ' + r.MASODOITUONG : '');
            var tt = TT[r.QLSV_TRANGTHAINGUOIHOC_MA] || ['ok', 'fa-graduation-cap'];
            var tabs = [['chua', 'fa-money-check-dollar-pen', 'Các khoản đã nộp'], ['da', 'fa-file-invoice-dollar', 'Các khoản đã xuất hóa đơn']];

            x('dt').innerHTML =
                /* Đầu khung CHUNG (ums.pat.dauDoiTuong, người dùng 2026-09-26): ảnh + tên + trạng thái + tổng nợ / dư
                   ngay sau tên · Đóng. "Tổng tiền đã chọn" ở thanh thao tác của tab, ngay trước nút Xuất. */
                '<div class="ums-panel ums-u-mb-4" data-x="dtPanel">' + ums.pat.dauDoiTuong({
                    anh: r.ANH || '', ten: hien,
                    nhan: r.QLSV_TRANGTHAINGUOIHOC_TEN ? ui.badge(r.QLSV_TRANGTHAINGUOIHOC_TEN, tt[0]) : '',
                    tools: ui.btn('close', { attr: { 'data-a': 'dong' } })
                }) +
                '<div class="ums-panel__body">' +
                  '<div class="hd-xuat__stats">' +
                    stat('mien', 'green', 'fa-badge-dollar', 'Khoản được miễn') +
                    stat('danop', 'green', 'fa-circle-dollar', 'Khoản đã nộp') +
                    stat('phieu', 'amber', 'fa-file-invoice-dollar', 'Danh sách các phiếu đã thu') +
                    stat('nochung', 'red', 'fa-hands-holding-dollar', 'Tổng hợp nợ chung các khoản') +
                  '</div></div></div>' +
                '<div class="ums-panel">' +
                  '<div class="ums-tabs">' + tabs.map(function (t) {
                      return '<button type="button" class="ums-tabs__item' + (st.tab === t[0] ? ' is-active' : '') + '" data-tab="' + t[0] + '">' +
                          '<i class="fa-light ' + t[1] + '"></i> ' + t[2] + '</button>';
                  }).join('') + '</div>' +
                  /* Thanh thao tác CHUNG (ums.pat.thanhThu): gợi ý · "Tổng tiền đã chọn" + Xuất hóa đơn */
                  '<div class="ums-panel__body hd-xuat__thanh" data-x="headChua"' + (st.tab === 'chua' ? '' : ' hidden') + '>' +
                    ums.pat.thanhThu({
                        ghiChu: 'Chọn các khoản cần xuất, có thể sửa nội dung và số tiền',
                        nut: '<button type="button" class="ums-btn ums-btn--primary" data-a="xuat"><i class="fa-light fa-file-invoice"></i><span>Xuất hóa đơn</span></button>'
                    }) + '</div>' +
                  '<div class="ums-panel__body ums-panel__body--flush" data-x="tblChua"' + (st.tab === 'chua' ? '' : ' hidden') + '></div>' +
                  '<div class="ums-panel__body ums-panel__body--flush" data-x="tblDa"' + (st.tab === 'da' ? '' : ' hidden') + '></div>' +
                '</div>';
            drawChua();
            drawDa();
            drawTTC();
        }

        function stat(key, tone, icon, label) {
            return '<button type="button" class="ums-stat ums-stat--' + tone + ' hd-xuat__stat" data-stat="' + key + '">' +
                '<span class="ums-stat__icon"><i class="fa-light ' + icon + '"></i></span>' +
                '<span><span class="ums-stat__value" data-v="' + key + '">0</span>' +
                '<span class="ums-stat__label">' + esc(label) + ' <i class="fa-light fa-arrow-right"></i></span></span></button>';
        }

        function loadTTC() {
            x('tblChua').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({
                action: 'TC_ThongTinChung/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                strQLSV_NguoiHoc_Id: st.hssvId, strNguoiThucHien_Id: '', strNguonDuLieu_Id: ''
            }).then(function (r) {
                var d = r.data || {};
                st.goc = d.rsKhoanDaNopChuaXuatHoaDon || [];
                st.rows = st.goc.map(function (k) {
                    return {
                        id: String(k.ID), gocId: String(k.ID), khoanThuId: k.TAICHINH_CACKHOANTHU_ID,
                        thoiGianId: k.DAOTAO_THOIGIANDAOTAO_ID, htct: k.HETHONGCHUNGTU_MA,
                        hocKy: k.DAOTAO_THOIGIANDAOTAO, dot: k.DAOTAO_THOIGIANDAOTAO_DOT,
                        khoanThuTen: k.TAICHINH_CACKHOANTHU_TEN, ngayTao: k.NGAYTAO_DD_MM_YYYY,
                        noiDung: k.NOIDUNG === null || k.NOIDUNG === undefined ? '' : String(k.NOIDUNG),
                        soTien: H.fmt(k.SOTIEN), goc: H.fmt(k.SOTIEN), checked: false, tach: false
                    };
                });
                st.daXuat = d.rsKhoanDaNopDaXuatHoaDon || [];
                st.ttc = (d.rsThongTin || [])[0] || {};
                drawChua(); drawDa(); drawTTC(); tongDaChon();
            }).catch(function (e) {
                x('tblChua').innerHTML = ui.fail(e.message);
                ums.api.handle(e, 'tình trạng tài chính');
            });
        }

        function drawTTC() {
            var d = st.ttc || {};
            var v = function (n) { return H.floatValid(n) ? ui.money(n) : '0'; };
            var set = function (k, val) { var el = x('dt').querySelector('[data-v="' + k + '"]'); if (el) el.textContent = val; };
            set('mien', v(d.TONGKHOANDUOCMIEN));
            set('danop', v(d.TONGKHOANDANOP));
            set('phieu', v(d.TONGTIENPHIEUTHU));
            set('nochung', v(d.TONGNOCHUNG));
            /* viên chung "Tổng nợ / Tổng dư / Đã hoàn thành" trên tiêu đề (ums.pat.noCo) */
            ums.pat.datNoCo(x('dtPanel'), H.floatValid(d.NOCO) ? Number(d.NOCO) : '', 'Chưa xác định');
        }

        /* ---------- Bảng các khoản đã nộp chưa xuất ------------------------ */
        function drawChua() {
            var el = x('tblChua');
            if (!el) return;
            var allOn = st.rows.length && st.rows.every(function (r) { return r.checked; });
            ui.table({
                el: el, rows: st.rows, empty: 'Không có khoản đã nộp chưa xuất hoá đơn',
                columns: [
                    { title: 'Học kỳ', prop: 'hocKy', cls: 'is-nowrap' },
                    { title: 'Đợt', prop: 'dot', cls: 'is-center' },
                    { title: 'Khoản thu', prop: 'khoanThuTen' },
                    { title: 'Nội dung', cls: 'hd-xuat__nd', render: function (r, i) {
                        return '<input class="ums-input ums-input--sm" data-f="noiDung" data-i="' + i + '" value="' + esc(r.noiDung) + '">';
                    } },
                    { title: 'Số tiền', cls: 'is-right', render: function (r, i) {
                        return '<input class="ums-input ums-input--sm hd-tien" data-f="soTien" data-i="' + i + '" value="' + esc(r.soTien) + '">';
                    }, sum: function (rows) { return '<b>' + esc(H.fmtSum(H.sum(rows.map(function (r) { return r.soTien; })))) + '</b>'; } },
                    { title: 'Ngày tạo', prop: 'ngayTao', cls: 'is-center is-nowrap' },
                    { title: 'Tách', cls: 'is-center', render: function (r, i) {
                        return r.tach ? '<span class="ums-u-faint ums-u-fz12">khoản tách</span>'
                            : '<button type="button" class="ums-iconbtn" data-a="tach" data-i="' + i + '" title="Tách khoản">' +
                              '<i class="fa-light fa-scissors"></i></button>';
                    } },
                    { head: '<input type="checkbox" data-a="chonHet"' + (allOn ? ' checked' : '') + ' title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-f="checked" data-i="' + i + '"' + (r.checked ? ' checked' : '') + '>'; } }
                ]
            });
            Array.prototype.forEach.call(el.querySelectorAll('tbody tr'), function (tr, i) {
                if (st.rows[i]) tr.classList.toggle('is-picked', !!st.rows[i].checked);
            });
        }

        function drawDa() {
            var el = x('tblDa');
            if (!el) return;
            ui.table({
                el: el, rows: st.daXuat, empty: 'Chưa có khoản nào đã xuất hoá đơn',
                columns: [
                    { title: 'Số hóa đơn', prop: 'CHUNGTU_SO', cls: 'is-nowrap' },
                    { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
                    { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                    { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                    { title: 'Nội dung', render: function (r) {
                        return '<span title="' + esc(r.NOIDUNG) + '">' + esc(H.catNoiDung(r.NOIDUNG, r.SOTIEN)) + '</span>';
                    } },
                    { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN); }, sum: true, sumProp: 'SOTIEN' },
                    { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' },
                    { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                    { title: 'Chi tiết', cls: 'is-center', render: function (r) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--view" data-a="xemHD" data-id="' + esc(r.CHUNGTU_ID) + '" title="Xem hoá đơn">' +
                            '<i class="fa-light fa-eye"></i></button>';
                    } }
                ]
            });
        }

        /** show_TongTien: cộng ô tiền của các dòng đã chọn */
        function tongDaChon() {
            var el = x('headChua');
            if (!el) return;
            var s = H.sum(st.rows.filter(function (r) { return r.checked; }).map(function (r) { return r.soTien; }));
            var b = el.querySelector('[data-tt="chon"]');
            if (b) b.textContent = H.fmtSum(s);
        }

        /* ---------- Chi tiết thẻ số liệu ------------------------------------ */
        var CHITIET = {
            mien: ['TC_ThongTinChung/LayDSKhoanMien', 'Danh sách khoản được miễn', 'Số tiền được miễn', false],
            danop: ['TC_ThongTinChung/LayDSKhoanDaNop', 'Danh sách khoản đã nộp', 'Số tiền', false],
            nochung: ['TC_ThongTinChung/LayDSKhoanNoChung', 'Danh sách nợ chung theo các khoản', 'Số tiền', true],
            phieu: ['TC_ThongTinChung/LayDSPhieuDaThu', 'Danh sách các phiếu đã thu', 'Tổng tiền', true]
        };

        function chiTiet(key) {
            var c = CHITIET[key];
            var dlg = ui.dialog({ title: c[1], icon: 'fa-list-ul', size: 'xl', body: ui.empty('Đang tải…', 'fa-spinner fa-spin'),
                buttons: [{ text: 'Tải lại', kind: 'search', mod: 'ghost', keepOpen: true, onClick: function () { run(); return false; } }] });
            function run() {
                var call = { action: c[0], method: 'GET', versionAPI: 'v1.0', strQLSV_NguoiHoc_Id: st.hssvId, strNguoiThucHien_Id: '' };
                if (c[3]) { call.pageIndex = 1; call.pageSize = 1000000000; }
                dlg.body.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                ums.api.call(call).then(function (r) {
                    var rows = H.rows(r);
                    var cols = key === 'phieu' ? [
                        { title: 'Số phiếu', prop: 'SOPHIEUTHU' },
                        { title: c[2], cls: 'is-right', render: function (x) { return ui.money(x.TONGTIEN); }, sum: true, sumProp: 'TONGTIEN' },
                        { title: 'Ngày thu', prop: 'NGAYTHU_DD_MM_YYYY_HHMMSS', cls: 'is-center' },
                        { title: 'Người thu', prop: 'TENDAYDU_NGUOITHU' }
                    ] : [
                        { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
                        { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                        { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                        { title: 'Nội dung', render: function (x) { return '<span title="' + esc(x.NOIDUNG) + '">' + esc(H.catNoiDung(x.NOIDUNG, x.SOTIEN)) + '</span>'; } },
                        { title: c[2], cls: 'is-right', render: function (x) { return ui.money(x.SOTIEN); }, sum: true, sumProp: 'SOTIEN' },
                        { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' },
                        { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' }
                    ];
                    ui.table({ el: dlg.body, rows: rows, columns: cols });
                }).catch(function (e) { dlg.body.innerHTML = ui.fail(e.message); });
            }
            run();
        }

        /* =============================================================
           Tách khoản (tachKhoan_HoaDon → addKhoanThuCanTach)
           ============================================================= */
        function tach(i) {
            var r = st.rows[i];
            if (!r) return;
            var truoc = r.soTien;     // chuỗi ô tiền hiện tại
            var added = [];           // { id (khoản thu), ten, noiDung, soTien }

            var dlg = ui.dialog({
                title: 'Tách khoản', icon: 'fa-scissors', size: 'xl',
                body: '<div data-t="tbl"></div>' +
                      '<div class="ums-legend ums-legend--cach">Chọn khoản cần tách</div><div data-t="kt"></div>',
                buttons: [{ text: 'Tách khoản', kind: 'save', onClick: function () { return thucHien(); } }]
            });
            var b = dlg.body;
            H.checks(b.querySelector('[data-t="kt"]'), st.dmlkt, {
                all: false, checked: false, empty: 'Không có danh mục khoản thu',
                onChange: function (t, row) {
                    if (t.checked) added.push({ id: t.value, ten: row && row.TEN, noiDung: '', soTien: '0' });
                    else added = added.filter(function (a) { return a.id !== t.value; });
                    draw();
                }
            });

            function conLai() {
                var t = H.num(truoc);
                added.forEach(function (a) { t -= H.num(a.soTien); });
                return t;
            }

            function draw() {
                var list = [{ goc: true }].concat(added);
                ui.table({
                    el: b.querySelector('[data-t="tbl"]'), rows: list,
                    columns: [
                        { title: 'Học kỳ', render: function () { return esc(r.hocKy); } },
                        { title: 'Đợt', render: function () { return esc(r.dot); } },
                        { title: 'Khoản thu', render: function (a) { return esc(a.goc ? r.khoanThuTen : a.ten); } },
                        { title: 'Nội dung', render: function (a, k) {
                            return a.goc ? esc(r.noiDung) : '<input class="ums-input ums-input--sm" data-t="nd" data-k="' + k + '" value="' + esc(a.noiDung) + '">';
                        } },
                        { title: 'Số tiền trước', cls: 'is-right', render: function (a, k) {
                            return a.goc ? esc(truoc) : '0';
                        } },
                        { title: 'Số tiền sau', cls: 'is-right', width: '160px', render: function (a, k) {
                            return a.goc ? '<b data-t="conlai">' + esc(H.fmt(conLai())) + '</b>'
                                : '<input class="ums-input ums-input--sm hd-tien" data-t="st" data-k="' + k + '" value="' + esc(a.soTien) + '">';
                        } },
                        { title: '', cls: 'is-center', render: function (a, k) {
                            return a.goc ? '<span class="ums-u-faint">Gốc</span>'
                                : '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-t="xoa" data-k="' + k + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                        } }
                    ]
                });
            }
            draw();

            b.addEventListener('input', function (e) {
                var t = e.target, k = Number(t.getAttribute('data-k')) - 1;
                if (!added[k]) return;
                if (t.getAttribute('data-t') === 'nd') added[k].noiDung = t.value;
                if (t.getAttribute('data-t') === 'st') {
                    checkSoTien(t, false, '');           // checkSoTienInput(this, false)
                    added[k].soTien = t.value;
                    var cl = b.querySelector('[data-t="conlai"]');
                    if (cl) cl.textContent = H.fmt(conLai());
                }
            });
            b.addEventListener('click', function (e) {
                var t = e.target.closest('[data-t="xoa"]');
                if (!t) return;
                var a = added[Number(t.getAttribute('data-k')) - 1];
                if (!a) return;
                var cb = b.querySelector('input[type=checkbox][value="' + a.id + '"]');
                if (cb) cb.checked = false;
                added = added.filter(function (z) { return z !== a; });
                draw();
            });

            function thucHien() {
                var cl = conLai();
                if (cl < 0) {
                    ui.toast('Khoản thu vượt quá định mức', 'warn');
                    if (!SV) return false;               // 'khac' chặn; 'sv' vẫn tách như bản gốc
                }
                r.soTien = H.fmt(cl);                     // dòng gốc nhận phần còn lại
                var at = st.rows.indexOf(r);
                var seen = [];
                added.forEach(function (a) {
                    if (String(a.id).length !== 32 || seen.indexOf(a.id) >= 0) return;
                    seen.push(a.id);
                    if (a.soTien == 0) return;            // eslint-disable-line eqeqeq — đúng `== 0` của bản gốc
                    st.rows.splice(at + 1, 0, {           // chèn ngay sau dòng gốc (như .after())
                        id: r.gocId + '_' + a.id, gocId: r.gocId, khoanThuId: a.id,
                        thoiGianId: r.thoiGianId, htct: r.htct, hocKy: r.hocKy, dot: r.dot,
                        khoanThuTen: a.ten, ngayTao: '', noiDung: a.noiDung, soTien: a.soTien, goc: a.soTien,
                        checked: true, tach: true
                    });
                });
                drawChua();
                tongDaChon();
                return true;
            }
        }

        /** edu.system.checkSoTienInput(point, bQuaSoTien) — Core/systemroot.js:8296 */
        function checkSoTien(el, quaSoTien, goc) {
            var f = H.fmt(goc);
            var v = el.value;
            if (v[v.length - 1] === '.' || v[v.length - 1] === ',') return false;
            v = v.replace(/,/g, '');
            if (v !== '' && !H.floatValid(v)) { el.value = f; return false; }
            if (quaSoTien && parseFloat(v) > parseFloat(f.replace(/,/g, ''))) { el.value = f; return false; }
            el.value = H.fmt(el.value.replace(/,/g, ''));
            return true;
        }

        /* =============================================================
           [3] Bản nháp (genHTML_NoiDung_HoaDon)
           ============================================================= */
        function moNhap() {
            var chon = st.rows.filter(function (r) { return r.checked; });
            if (!chon.length) return ui.toast('Vui lòng chọn khoản thu', 'warn');
            var htct = chon[0].htct;
            var khac = chon.find(function (r) { return r.htct !== htct; });
            if (khac) return ui.toast('Mã hệ thống chứng từ khác nhau. Vui lòng kiểm tra lại! ("' + htct + '" : "' + khac.htct + '")', 'warn');

            var jsonHT = null, lines = [];
            chon.forEach(function (r) {
                // 'sv': jsonHT lấy lại ở MỖI dòng (bản gốc không bao giờ gán strHinhThucThu_Ma) → dòng cuối quyết định
                // 'khac': chỉ lấy ở dòng đầu, theo id dòng (dòng tách không tìm thấy → bản gốc lỗi)
                if (SV || !jsonHT) {
                    var tim = SV ? r.gocId : r.id;
                    jsonHT = st.goc.find(function (g) { return String(g.ID) === tim; }) || jsonHT;
                }
                if (r.soTien == 0) return;                // eslint-disable-line eqeqeq
                lines.push({
                    id: r.gocId, name: r.thoiGianId, khoanThuGoc: r.khoanThuId,
                    khoanThu: r.khoanThuTen, noiDung: r.noiDung,
                    soLuong: '1', donGia: r.soTien,
                    thanhTien: H.fmt(H.num(r.soTien) * H.num('1'))
                });
            });
            jsonHT = jsonHT || {};
            var tong = H.sum(lines.map(function (l) { return l.thanhTien; }));
            if (!tong) return ui.toast('Tổng tiền bằng 0 — không có gì để xuất', 'warn');

            st.draft = {
                lines: lines, jsonHT: jsonHT, tong: tong,
                tongSL: H.sum(lines.map(function (l) { return l.soLuong; })),
                tongDG: H.sum(lines.map(function (l) { return l.donGia; })),
                bangChu: H.docSo(String(H.fmtSum(tong)).replace(/,/g, ''))
            };
            st.phieuMode = 'nhap';
            st.hoaDonId = '';
            drawNhap();
            ui.swap(x('dt'), x('phieu'));

            if (jsonHT.LOAITIENTE_MA === 'USD') {
                ums.api.call({ action: 'TC_ThongTinChung/DocSoThanhChu', method: 'GET', versionAPI: 'v1.0',
                    dSoTien: st.draft.bangChu, strLoaiTien: jsonHT.LOAITIENTE_MA, silent: true })
                    .then(function (r) { var el = x('phieu').querySelector('[data-p="chu"]'); if (el && r.data) el.textContent = r.data; })
                    .catch(function () {});
            }
        }

        function info(label, val) {
            return '<div class="hd-nhap__i"><span>' + esc(label) + '</span><b>' + val + '</b></div>';
        }

        function drawNhap() {
            var d = st.ttc || {};
            var dr = st.draft;
            var now = new Date();
            var p2 = function (n) { return n < 10 ? '0' + n : '' + n; };
            var nut = (cfg.phatHanh !== false) ? st.nut.map(function (n) {
                return '<button type="button" class="ums-btn ums-btn--navy" data-a="phatHanh" data-id="' + esc(n.ID) + '" title="' + esc(n.MA) + '">' +
                    '<i class="fa-light ' + (String(n.MA || '').indexOf('HDDTNHAP') === 0 ? 'fa-file-magnifying-glass' : 'fa-file-signature') + '"></i>' +
                    '<span>' + esc(n.TEN) + '</span></button>';
            }).join('') : '';

            x('phieu').innerHTML =
                '<div class="ums-panel"><div class="ums-panel__head">' +
                  '<div class="ums-panel__title"><i class="fa-light fa-file-pen"></i> Hoá đơn nháp</div>' +
                  '<div class="ums-panel__tools">' + nut + ui.btn('close', { attr: { 'data-a': 'dongPhieu' } }) + '</div></div>' +
                '<div class="ums-panel__body">' +
                  (cfg.phatHanh === false ? '<div class="hd-note"><i class="fa-light fa-circle-info"></i> Màn hình này không có nút phát hành hoá đơn (đúng như bản gốc) — chỉ xem bản nháp.</div>' : '') +
                  '<div class="hd-nhap">' +
                    '<div class="hd-nhap__info">' +
                      info('Mã', esc(d.MASO)) +
                      info('Họ tên', SV ? esc((d.HODEM || '') + ' ' + (d.TEN || ''))
                          : '<input class="ums-input ums-input--sm" data-p="tenNguoiThu" value="' + esc((d.HODEM == null ? '' : d.HODEM) + ' ' + (d.TEN == null ? '' : d.TEN)) + '">') +
                      info('Ngày', p2(now.getDate()) + '/' + p2(now.getMonth() + 1) + '/' + now.getFullYear()) +
                      info('Ngày sinh', esc(d.NGAYSINH)) +
                      info('Mã số thuế', esc(d.MASOTHUECANHAN)) +
                      info('Địa chỉ', esc(d.NOIOHIENNAY)) +
                      info('Lớp', esc(d.DAOTAO_LOPQUANLY_N1_TEN)) +
                      info('Ngành', esc(d.NGANHHOC_N1_TEN)) +
                      info('Khoá', esc(d.KHOAHOC_N1_TEN)) +
                    '</div>' +
                    (SV ? '<div class="ums-grid ums-grid--3 ums-u-mb-4">' +
                        ui.field('Hình thức thu', '<select class="ums-select" data-p="htt"></select>') +
                        ui.field('Đơn vị tính', '<select class="ums-select" data-p="dvt"></select>') +
                        ui.field('Loại tiền tệ', '<select class="ums-select" data-p="ltt"></select>') + '</div>'
                      : '<label class="ums-check ums-u-mb-4"><input type="checkbox" data-p="soLuong"> Không hiển thị số lượng và đơn giá</label>') +
                    '<div data-p="tbl"></div>' +
                    '<div class="hd-nhap__tong">Tổng tiền: <b>' + esc(H.fmtSum(dr.tong)) + '</b></div>' +
                    '<div class="hd-nhap__chu">Số tiền viết bằng chữ: <i data-p="chu">' + esc(dr.bangChu) + '</i></div>' +
                  '</div></div></div>';

            ui.table({
                el: x('phieu').querySelector('[data-p="tbl"]'), rows: dr.lines,
                columns: [
                    { title: 'Khoản thu', prop: 'khoanThu' },
                    { title: 'Nội dung', prop: 'noiDung' },
                    { title: 'Số lượng', prop: 'soLuong', cls: 'is-center', sum: function () { return '<b>' + esc(H.fmtSum(dr.tongSL)) + '</b>'; } },
                    { title: 'Đơn giá', prop: 'donGia', cls: 'is-right', sum: function () { return '<b>' + esc(H.fmtSum(dr.tongDG)) + '</b>'; } },
                    { title: 'Thành tiền', prop: 'thanhTien', cls: 'is-right', sum: function () { return '<b>' + esc(H.fmtSum(dr.tong)) + '</b>'; } }
                ]
            });

            if (SV) napDanhMucNhap(dr.jsonHT);
        }

        /* Hình thức thu / đơn vị tính / loại tiền — cbGenCombo_* của bản gốc */
        function napDanhMucNhap(jsonHT) {
            var p = x('phieu');
            var put = function (sel, list, def, pick) {
                var el = p.querySelector('[data-p="' + sel + '"]');
                if (!el) return;
                el._rows = list;
                var head = list.length && list[0].CHUNG_TENDANHMUC_TEN ? 'Chọn ' + String(list[0].CHUNG_TENDANHMUC_TEN).toLowerCase() : null;
                H.fillSelect(el, list, 'ID', 'TEN', head);
                var chon = list.find(function (r) { return r.THONGTIN8 === 'CHON'; });
                if (chon) def = chon.ID;
                // loadToCombo_data: có default_val thì .val(default_val) — không khớp thì
                // không mục nào được chọn; không có thì để mục đầu tiên như trình duyệt chọn
                if (def) { el.value = def; if (el.value !== String(def)) el.selectedIndex = -1; }
                if (pick) pick(el, list);
                ui.select2(el);
            };
            Promise.all([H.dmAll('QLTC.HTTHU'), H.dmAll('TAICHINH.DVT'), H.dmAll('QLTC.LTT')]).then(function (res) {
                put('htt', res[0], jsonHT.HINHTHUCTHU_ID, function (el, list) {
                    // chưa chọn được thì lấy "TM" (tiền mặt)
                    if (!el.value) { var tm = list.find(function (r) { return r.MA === 'TM'; }); if (tm) el.value = tm.ID; }
                });
                put('dvt', res[1], jsonHT.DONVITINH_ID);
                put('ltt', res[2], jsonHT.LOAITIENTE_ID, function (el, list) {
                    // bản gốc luôn đặt về VND sau khi nạp (không có VND thì rỗng)
                    var vnd = list.find(function (r) { return r.MA === 'VND'; });
                    if (vnd) el.value = vnd.ID; else el.selectedIndex = -1;
                });
            }).catch(function (e) { ums.api.handle(e, 'nạp danh mục hoá đơn'); });
        }

        function selRow(sel) {
            var el = x('phieu').querySelector('[data-p="' + sel + '"]');
            if (!el || !el.value) return { id: el ? el.value : '', row: null };
            return { id: el.value, row: (el._rows || []).find(function (r) { return String(r.ID) === el.value; }) || null };
        }

        /* =============================================================
           [4] Phát hành (saveHoaDon → saveHDDT / saveHDDT_Nhap)
           ============================================================= */
        function phatHanh(nutId) {
            var n = st.nut.find(function (z) { return String(z.ID) === String(nutId); });
            if (!n) return;
            if (n.THONGTIN4) ums.session.api.HDDT = n.THONGTIN4;
            var ma = String(n.MA || '');
            var nhap = ma.indexOf('HDDTNHAP') === 0;
            if (nhap) return guiHDDT(ma, true);
            ui.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', { ok: 'Xuất hoá đơn', title: 'Xuất hoá đơn điện tử' })
                .then(function (yes) { if (yes) guiHDDT(ma, false); });
        }

        /** Dựng payload — tách riêng để trang dò kiểm từng tham số */
        function payload(ma, nhap) {
            var L = st.draft.lines;
            var ids = L.map(function (l) { return l.id; }).join(',');
            var ktIds = L.map(function (l) { return l.khoanThuGoc; }).join(',');
            var tgIds = L.map(function (l) { return l.name; }).join(',');
            var noiDung = L.map(function (l) { return l.noiDung; }).join('#');
            var sl = L.map(function (l) { return H.num(l.soLuong); }).join(',');
            var dg = L.map(function (l) { return H.num(l.donGia); }).join(',');
            var tien = L.map(function (l) { return H.num(l.thanhTien); }).join(',');
            var action = nhap ? 'HDDT_HoaDon/ThemMoi_Nhap' : 'HDDT_HoaDon/ThemMoi';

            if (SV) {
                var ltt = selRow('ltt'), dvt = selRow('dvt'), htt = selRow('htt');
                var dvtTen = dvt.row ? String(' ' + dvt.row.TEN).trim() : '';
                var httTen = htt.row ? ((htt.row.THONGTIN1 !== null && htt.row.THONGTIN1 !== undefined) ? String(htt.row.THONGTIN1) : ' ' + htt.row.TEN) : '';
                return {
                    action: action,
                    versionAPI: 'v1.0',
                    strNguoiThucHien_Id: '',
                    strTaiChinh_DaNop_Ids: ids,
                    strTAICHINH_CACKHOANTHU_Ids: ids,
                    strTaiChinh_SoTien_s: tien,
                    strTaiChinh_NoiDung_s: noiDung,
                    strDonGia_s: dg,
                    strSoLuong_s: sl,
                    strDonViTinhTen_s: L.map(function () { return dvtTen; }).join(','),
                    strLoaiTienTe: '',
                    strQLSV_NguoiHoc_Id: st.hssvId,
                    strDaoTao_ThoiGianDaoTao_Id: tgIds,
                    strDaoTao_ToChucCT_Id: st.ctId,
                    strHinhThucThu_Id: htt.id,
                    strTaiChinh_CacKhoanThu_Ids: ids,
                    strHinhThucThu_MA: htt.row ? htt.row.MA : undefined,
                    strHinhThucThu_TEN: httTen,
                    strPhuongThuc_MA: ma,
                    strDonViTinh_Ids: L.map(function () { return dvt.id; }).join(','),
                    strLoaiTienTe_Ids: L.map(function () { return ltt.id; }).join(','),
                    strXuatHoaDonTrucTiep: '',
                    strNguonDuLieu_Id: '',
                    dKhongSinhChungTu: 0,
                    strPhieuThuTheoPhoiSan_Id: ''
                };
            }
            var j = st.draft.jsonHT;
            var ten = x('phieu').querySelector('[data-p="tenNguoiThu"]');
            var cbSL = x('phieu').querySelector('[data-p="soLuong"]');
            return {
                action: action,
                strLoaiDoiTuong: 'DOITUONGKHAC',
                strNguoiThucHien_Id: '',
                strTaiChinh_CacKhoanThu_Ids: ids,
                strQLSV_NguoiHoc_Id: st.hssvId,
                strDaoTao_ThoiGianDaoTao_Id: tgIds,
                strHinhThucThu_MA: j.HINHTHUCTHU_MA,
                strHinhThucThu_TEN: j.HINHTHUCTHU_TEN,
                strTaiChinh_SoTien_s: tien,
                strTaiChinh_NoiDung_s: noiDung,
                strDonGia_s: dg,
                strSoLuong_s: sl,
                strDonViTinhTen_s: L.map(function () { return j.DONVITINH_TEN === null || j.DONVITINH_TEN === undefined ? '' : j.DONVITINH_TEN; }).join(','),
                strLoaiTienTe: j.LOAITIENTE_MA,
                strTenNguoiThu: ten ? ten.value : '',
                bTenNguoiThu: true,
                bSoLuong: !!(cbSL && cbSL.checked),
                strPhuongThuc_MA: ma
            };
        }

        function guiHDDT(ma, nhap) {
            var body = payload(ma, nhap);
            ums.api.call(body).then(function (r) {
                if (nhap) { H.openTab(H.hddtNhapLink(r.data)); return; }
                var id = r.raw && r.raw.Id;
                st.hoaDonId = id;
                ui.toast('Sinh hóa đơn thành công', 'ok');
                loadTTC();                                   // informSaveSuccess
                moXem(id);
            }).catch(function (e) {
                ums.api.handle(e, nhap ? 'xem nháp hoá đơn điện tử' : 'xuất hoá đơn điện tử');
                if (!nhap && !e.expired) dongPhieu();        // bản gốc: closePhieu() khi lỗi
            });
        }

        /* =============================================================
           [5] Xem / in / huỷ hoá đơn
           ============================================================= */
        function moXem(id) {
            st.hoaDonId = id;
            st.phieuMode = 'xem';
            x('phieu').innerHTML =
                '<div class="ums-panel"><div class="ums-panel__head">' +
                  '<div class="ums-panel__title"><i class="fa-light fa-file-invoice"></i> Hoá đơn</div>' +
                  '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-a': 'dongPhieu' } }) +
                    '<button type="button" class="ums-btn ums-btn--danger" data-a="huy"><i class="fa-light fa-trash-can"></i><span>Hủy hóa đơn</span></button>' +
                    ui.btn('print', { text: 'In hóa đơn', attr: { 'data-a': 'in' } }) +
                                      '</div></div><div class="ums-panel__body"><div data-p="xem"></div></div></div>';
            if (x('phieu').hidden) ui.swap(x('dt'), x('phieu'));
            H.xem(x('phieu').querySelector('[data-p="xem"]'), id, 'HOADON').catch(function () {});
        }

        function inPhieu() {
            H.print(x('phieu').querySelector('[data-p="xem"]'), 'In hoá đơn');
            dongPhieu();
            if (st.hoaDonId) H.daIn(st.hoaDonId);           // save_TinhTrangHoaDon
            st.hoaDonId = '';
        }

        function huy() {
            ui.confirm('Bạn có chắc chắn muốn hủy hóa đơn không!', { tone: 'bad', ok: 'Hủy hóa đơn' }).then(function (yes) {
                if (!yes) return;
                H.huy(st.hoaDonId).then(function () {
                    loadTTC();
                    dongPhieu();
                    ui.toast('Xóa hóa đơn thành công!', 'ok');
                }).catch(function (e) { ums.api.handle(e, 'huỷ hoá đơn'); });
            });
        }

        function dongPhieu() {
            st.phieuMode = '';
            if (!x('phieu').hidden) ui.swap(x('phieu'), x('dt'));
        }

        function dongDT() {
            st.cur = null; st.hssvId = ''; st.rows = []; st.daXuat = [];
            markHS();
            x('dt').hidden = true;
            x('phieu').hidden = true;
            ui.reveal(x('none'));
        }

        /* =============================================================
           Sự kiện — gắn lên phần tử gốc của màn
           ============================================================= */
        root.addEventListener('click', function (e) {
            var a = e.target.closest('[data-a]');
            var it = e.target.closest('.ums-master__item[data-id]');
            if (it && x('hs').contains(it)) return chon(it.getAttribute('data-id'));
            var tab = e.target.closest('[data-tab]');
            if (tab) {
                st.tab = tab.getAttribute('data-tab');
                Array.prototype.forEach.call(root.querySelectorAll('[data-tab]'), function (t) { t.classList.toggle('is-active', t === tab); });
                x('headChua').hidden = st.tab !== 'chua';
                x('tblChua').hidden = st.tab !== 'chua';
                x('tblDa').hidden = st.tab !== 'da';
                return;
            }
            var s = e.target.closest('[data-stat]');
            if (s) return chiTiet(s.getAttribute('data-stat'));
            if (!a) return;
            switch (a.getAttribute('data-a')) {
                case 'search':
                    e.preventDefault();
                    var adv = root.querySelector('.hd-xuat__adv');
                    if (adv && a.closest('.hd-xuat__adv')) adv.hidden = true;
                    loadHS(1); break;
                case 'loc':
                    var kloc = root.querySelector('.hd-xuat__adv');
                    if (kloc) kloc.hidden = !kloc.hidden;
                    break;
                case 'dong': dongDT(); break;
                case 'xuat': moNhap(); break;
                case 'tach': tach(Number(a.getAttribute('data-i'))); break;
                case 'xemHD': moXem(a.getAttribute('data-id')); break;
                case 'phatHanh': phatHanh(a.getAttribute('data-id')); break;
                case 'dongPhieu': dongPhieu(); break;
                case 'in': inPhieu(); break;
                case 'huy': huy(); break;
            }
        });

        root.addEventListener('change', function (e) {
            var t = e.target;
            if (t.getAttribute('data-a') === 'chonHet') {
                st.rows.forEach(function (r) { r.checked = t.checked; });
                drawChua(); tongDaChon(); return;
            }
            var f = t.getAttribute('data-f'), i = Number(t.getAttribute('data-i'));
            if (f === 'checked' && st.rows[i]) {
                st.rows[i].checked = t.checked;
                t.closest('tr').classList.toggle('is-picked', t.checked);
                tongDaChon();
            }
        });

        root.addEventListener('input', function (e) {
            var t = e.target, f = t.getAttribute('data-f'), i = Number(t.getAttribute('data-i'));
            if (!f || !st.rows[i]) return;
            if (f === 'noiDung') st.rows[i].noiDung = t.value;
            if (f === 'soTien') {
                if (!SV && !checkSoTien(t, true, st.rows[i].goc)) { st.rows[i].soTien = t.value; return; }
                st.rows[i].soTien = t.value;
                tongDaChon();
            }
        });

        /* Cùng khuôn cột trái (BO-CUC luật 12, người dùng 2026-09-26): gõ là tự tìm sau 400ms (Enter tìm ngay),
       đổi ô chọn / trạng thái là tự tải — không còn nút Tìm kiếm; nút trên tiêu đề là Tải lại. */
        var henTim = 0;
        function timSau(ms) { clearTimeout(henTim); henTim = setTimeout(function () { loadHS(1); }, ms); }
        root.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && e.target === x('q')) { e.preventDefault(); clearTimeout(henTim); loadHS(1); }
        });
        x('q').addEventListener('input', function () { timSau(400); });
        if (x('adv')) x('adv').addEventListener('change', function () { timSau(300); });

        /* Để trang dò kiểm payload — không dùng trong mã màn hình */
        root._hd = { st: st, payload: payload, chon: chon, moNhap: moNhap, loadHS: loadHS };

        loadHS(1);
        setTimeout(function () { try { x('q').focus(); } catch (e) {} }, 50);
        return root._hd;
    };
})();
