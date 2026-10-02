/* =========================================================================
   Nhập học — THU TIỀN (khung dùng chung của hai màn)
   ---------------------------------------------------------------------------
   Bản gốc: ApisNhapHoc/Modules/taichinh/html/taichinhnew.html + scripts/taichinhnew.js (2.118 dòng, "Thu tiền")
            ApisNhapHoc/Modules/taichinh/html/taichinh.html    + scripts/taichinh.js    (1.840 dòng, bản cũ)
   Hai tệp gốc chép nhau từng dòng (diff ~800 dòng, phần lớn là log / chú thích / khung chống lỗi màn trắng);
   khác nhau THẬT chỉ ở năm lời gọi — bản cũ dùng controller kiểu cũ không mã hoá. Nên dựng MỘT khung:
       ums.nhThu.man(root, { cu: true|false, tieuDe })
   cu = true → bản cũ (taichinh.js): năm lời gọi ở bảng CU dưới đây, còn lại giống hệt.

   Lời gọi (chép nguyên văn; GET/POST như gốc)
     PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc      strNguoiThucHien_Id = userId                  (ô kế hoạch)
     PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS  dDaNhapHoc, strTaiChinh_KeHoach_Id, strNguoiThucHien_Id '',
                                                       strTuKhoa, pageIndex, pageSize                (danh sách trái)
                                                       — bản cũ: edu.extend (Corei) → action 'SV_CORE_…' cùng func
     LayDSCacKhoanNhapHoc      strTC_KeHoachNhapHoc_Id, strQLSV_NguoiHoc_TTTS_Id  (bảng khoản)   cũ: NH_DinhMuc_Chung/… GET
     NhapHoc_ThuTien           strQLSV_NguoiHoc_TTTS_Id, strTC_KeHoachNhapHoc_Id, strTAICHINH_CacKhoanThu_Ids,
                               strTAICHINH_SoTien_s, strHinhThucThu_Id, strNgayThuTien, strNguoiThucHien_Id,
                               strChucNang_Id — Message = "id phiếu,số phiếu"            cũ: NH_ThongTin/NhapHoc_ThuTien
     NhapHoc_SuaPhieuThu       strPhieuThu_Rut_Id, strTAICHINH_CacKhoanThu_Ids, strTAICHINH_SoTien_s,
                               strHinhThucThu_Ids, strNgayTao, strNguoiThucHien_Id   cũ: NH_NguoiHoc_ThongTinTuyenSinh/…
     LayTTQLSV_NguoiHoc_TTTS   strId (người học) — trước khi in phiếu              cũ: NH_NguoiHoc_ThongTinTuyenSinh/LayChiTiet GET
     LayDSKhoanDaThuNhapHoc    strTC_KeHoachNhapHoc_Id, strPhieuThu_Rut_Id (xem / sửa phiếu, xuất HĐ)
                                                                                     cũ: NH_DinhMuc_Chung/… GET
     TC_PhieuThu/LayDSPhieuThuNhaphoc      GET  strQlsv_Nguoihoc_Id   (chữ hoa/thường lạ như gốc)
     TC_PhieuThu/LayDSPhieuThuNhaphoc_Huy  GET  strQLSV_NguoiHoc_Id
     TC_PhieuThu/HuyPhieuNhapHoc           POST strPhieu_Id, strNguoiThucHien_Id
     TC_DaNop_HoaDon/ThemMoi               "Xuất hóa đơn" (hoá đơn giấy)
     HDDT_HoaDon/ThemMoi · HDDT_HoaDon/ThemMoi_Nhap   nút HĐĐT (danh mục TAICHINH.NUTHDDT; mã "HDDTNHAP" → bản nháp)
     TC_HoaDon/HuyHoaDon · TC_HoaDon/Them_TinhTrangInHoaDon
     Danh mục QLTC.HTTHU (hình thức thu, mặc định mã TM), TAICHINH.NUTHDDT; mẫu báo cáo (getList_MauImport)
   Phôi in: phiếu thu = phôi MAUIN_MASO của trường qua ums.phieu.viewer (tầng chung); mã bắt đầu "BAOCAO_"
            → chạy báo cáo pdf (như gốc). Hoá đơn nháp = phôi Upload/Files/PrintTemplate/Edit_DHCNTTTN_HOADON_2018.html
            (như gốc); không nạp được phôi thì vẽ bản rút gọn của tầng chung (ums.phieu.neutral).

   Bố cục (bám gốc): HAI CỘT — trái: kế hoạch + điều kiện + danh sách người học; phải: khung Hồ sơ, khung Tài
   chính (phiếu đã thu / đã huỷ + bảng khoản + Thu tiền). Xem phiếu hiện DƯỚI hai khung đó (như gốc); sửa phiếu /
   chọn khoản xuất hoá đơn thay chỗ bảng khoản; màn hoá đơn chiếm cả trang (gốc ẩn .beforeActive).

   KHÁC BẢN GỐC — sửa lỗi rõ
     1. Lưu hoá đơn giấy (TC_DaNop_HoaDon/ThemMoi) không giữ id trả về → "Hủy hóa đơn" gửi strHoaDon_Id rỗng và
        "In hóa đơn" ghi tình trạng in với id rỗng. Nay giữ id (data.Id) như nhánh HĐĐT.
     2. Huỷ hoá đơn thành công gọi me.getList_TinhTrangTaiChinh() — hàm KHÔNG tồn tại → TypeError, màn hoá đơn
        không đóng. Nay đóng màn hoá đơn và báo thành công.
     3. Huỷ phiếu thu xong không nạp lại danh sách phiếu / bảng khoản (dòng nạp lại bị chú thích) → số phiếu đã
        huỷ vẫn nằm ở "đã thu". Nay nạp lại.
     4. Gốc gắn popover (btnPopover_NguoiHoc_ThuTien) cho lớp không phần tử nào mang → chưa từng hiện. Không chép.
   Tự chốt (cách màn chạy)
     · Đổi kế hoạch / điều kiện → đóng khung người học đang mở (cha → con: danh sách người học theo kế hoạch).
     · Thu tiền xong KHÔNG xoá ô tìm (gốc xoá chữ nhưng không tải lại → ô tìm và danh sách lệch nhau).
     · "Liên hóa đơn": phôi nháp chỉ một liên → chỉ hiện chọn liên khi xem hoá đơn đã lưu (tầng chung).
   Bỏ (mã chết của gốc): getList_KeHoachNhapHoc, getDetail_NguoiHoc_TTTS, save_ThuTienTuDong, checkValid_ThuTien,
   printHTML, log gỡ lỗi (apsLog / console.log), ba lớp gắn sự kiện chống "bấm không ăn" của nút Xuất.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, P = ums.pat;

    function e(v) { return v === null || v === undefined ? '' : v; }
    /* edu.util.convertStrToNum */
    function so(v) { var n = parseFloat(P.num(v)); return isNaN(n) ? 0 : n; }
    /* edu.util.formatCurrency cho ô nhập */
    function tien(v) { return P.money(e(v) === '' ? 0 : v); }
    function hienTien(v) { return ui.money(e(v) === '' ? 0 : v) || '0'; }
    function rows(r) { return (r && Array.isArray(r.data)) ? r.data : []; }
    function homNay() {
        var d = new Date();
        return { ngay: (d.getDate() < 10 ? '0' : '') + d.getDate(), thang: (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1), nam: String(d.getFullYear()) };
    }

    /* ---------- Lời gọi của hai bản ---------------------------------------- */
    var MOI = {
        keHoach: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc' },
        ds: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS', versionAPI: 'v1.0' },
        khoan: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRICICIKKS4gLw8pIDEJLiIP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc', versionAPI: 'v1.0' },
        thu: { action: 'SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4VKTQVKCQv', func: 'PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuTien' },
        sua: { action: 'SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4SNCARKSgkNBUpNAPP', func: 'PKG_CORE_NhapHoc_ThuTien.NhapHoc_SuaPhieuThu' },
        ttNH: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4FRUQDRIXHg8mNC4oCS4iHhUVFRIP', func: 'PKG_CORE_NhapHoc_ThuTien.LayTTQLSV_NguoiHoc_TTTS', versionAPI: 'v1.0' },
        daThu: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKKS4gLwUgFSk0DykgMQkuIgPP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc', versionAPI: 'v1.0' }
    };
    var CU = {
        keHoach: MOI.keHoach,
        ds: { action: 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS', versionAPI: 'v1.0' },
        khoan: { action: 'NH_DinhMuc_Chung/LayDSCacKhoanNhapHoc', method: 'GET', versionAPI: 'v1.0' },
        thu: { action: 'NH_ThongTin/NhapHoc_ThuTien', versionAPI: 'v1.0' },
        sua: { action: 'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_SuaPhieuThu', versionAPI: 'v1.0' },
        ttNH: { action: 'NH_NguoiHoc_ThongTinTuyenSinh/LayChiTiet', method: 'GET', versionAPI: 'v1.0' },
        daThu: { action: 'NH_DinhMuc_Chung/LayDSKhoanDaThuNhapHoc', method: 'GET', versionAPI: 'v1.0' }
    };

    /* ---------- Xem phiếu từ DỮ LIỆU CÓ SẴN qua ums.phieu.viewer ---------------
       Gốc dựng phiếu bằng edu.extend.genData_PhieuThu(khoản đã thu, [người học], …) — cùng đường ống phôi in với
       getData_Phieu, chỉ khác nguồn dữ liệu (không gọi TC_PhieuThu/LayTTPhieuThu_Rut). Tầng chung chưa có lối nhận
       dữ liệu sẵn (NỢ TẦNG CHUNG: viewer.show({ rs, dt, loai })), nên chặn đúng MỘT lời gọi nội bộ của viewer —
       lời gọi đó phát ra ĐỒNG BỘ trong show(), trả lại ums.api.call ngay sau đó. */
    function xemTuDuLieu(viewer, rs, dt, after) {
        var khoa = '__nhthu_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        var goc = ums.api.call;
        ums.api.call = function (o) {
            if (o && o.action === 'TC_PhieuThu/LayTTPhieuThu_Rut' && o.strPhieuThu_Rut_Id === khoa) {
                return Promise.resolve({ data: { rs: rs, rsThongTinDoiTuong: dt }, pager: 0, message: '', raw: {} });
            }
            return goc.apply(this, arguments);
        };
        var p;
        try { p = viewer.show({ id: khoa, loai: 'PHIEUTHU', after: after }); }
        finally { ums.api.call = goc; }
        return p;
    }

    /* =====================================================================
       ums.nhThu.man(root, { cu, tieuDe })
       ===================================================================== */
    function man(root, cfg) {
        cfg = cfg || {};
        var A = cfg.cu ? CU : MOI;
        function goi(k, thamSo) {
            var o = {};
            Object.keys(A[k]).forEach(function (x) { o[x] = A[k][x]; });
            Object.keys(thamSo || {}).forEach(function (x) { o[x] = thamSo[x]; });
            return ums.api.call(o);
        }

        var S = {
            dtNguoiHoc: [], trang: 1, co: 10, tong: 0,
            nh: null,              // dtNguoiHoc_Print
            nhId: '', keHoach: '',
            dkNhap: '1',           // iTinhTrangNhapHoc [0 chưa nhập, 1 đã nhập, -1 toàn bộ]
            dtKhoan: [], dtDaThu: [], phieuId: '', phieuHuy: false, inPhieu: null,
            dtHoaDon: [], hd: null, hoaDonId: '', nutHDDT: [], viewer: null, hdViewer: null
        };

        root.innerHTML =
            '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + esc(cfg.tieuDe || 'Thu tiền') + '</h1>' +
            '<div class="ums-page__actions" data-z="bc"></div></div>' +
            '<div data-z="layout"></div>' +
            '<div data-z="hd" hidden></div>';
        function z(n) { return root.querySelector('[data-z="' + n + '"]'); }

        var mst = P.master({
            el: z('layout'),
            side: {
                title: 'Người học', icon: 'fa-user-graduate', search: 'Nhập từ khóa tìm kiếm: tên, số báo danh...',
                filter:
                    '<div class="ums-master__adv thu-loc" data-z="loc" hidden>' +
                    '<div class="ums-field"><select class="ums-select" data-z="kh" data-required data-ph="Chọn kế hoạch nhập học"></select></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Điều kiện</label><div class="ums-radios">' +
                    [['1', 'Đã nhập'], ['0', 'Chưa nhập'], ['-1', 'Toàn bộ']].map(function (x) {
                        return '<label class="ums-check"><input type="radio" name="thuDk' + (cfg.cu ? 'Cu' : '') + '" data-dk value="' + x[0] + '"' +
                            (x[0] === '1' ? ' checked' : '') + '> ' + x[1] + '</label>';
                    }).join('') + '</div></div></div>'
            },
            main: { title: false }
        });
        mst.sideBody.setAttribute('data-z', 'ds');
        mst.search.setAttribute('data-z', 'q');

        var bangKhoanId = 'thuKhoan' + (cfg.cu ? 'Cu' : '');
        mst.mainBody.innerHTML =
            '<div class="ums-panel" data-z="trong"><div class="ums-panel__body">' +
            ui.empty('Chọn một người học ở danh sách bên trái để thu tiền', 'fa-hand-pointer') + '</div></div>' +
            '<div data-z="dt" hidden>' +
            /* Hồ sơ — đầu khung chung (ảnh + tên + "Tổng số đã thu tiền" · Đóng) */
            '<div class="ums-panel" data-z="hsPanel"><div class="ums-panel__body" data-z="hs"></div></div>' +
            /* Tài chính — bảng khoản + thu tiền */
            '<div class="ums-panel" data-z="tc">' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-money-bill"></i> Tài chính <span data-z="daThu"></span></div>' +
            '<div class="ums-panel__tools"></div></div>' +
            '<div class="ums-panel__body thu-phieu">' +
            '<div class="thu-phieu__nhom"><span class="thu-phieu__lb">Số phiếu đã thu:</span><span class="thu-phieu__ds" data-z="dsPhieu"></span></div>' +
            '<div class="thu-phieu__nhom"><span class="thu-phieu__lb">Số phiếu đã hủy:</span><span class="thu-phieu__ds" data-z="dsHuy"></span></div>' +
            '</div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="bang" id="' + bangKhoanId + '"></div>' +
            '<div class="ums-panel__body" data-z="thanh">' + P.thanhThu({
                daChon: false,
                ghiChu: 'Hình thức thu và ngày thu áp dụng cho phiếu sắp lập',
                truocNut:
                    '<div class="ums-field thu-o"><select class="ums-select" data-z="htThu" data-ph="Hình thức thu"></select></div>' +
                    '<div class="ums-field thu-o"><input class="ums-input" data-z="ngayThu" data-date placeholder="Ngày thu" autocomplete="off"></div>' +
                    '<span class="ums-thanhthu__chon">Tổng tiền thu: <b data-z="tongThu">0</b></span>',
                nut: '<button type="button" class="ums-btn ums-btn--primary" data-act="thu"><i class="fa-light fa-money-from-bracket"></i><span>Thu tiền</span></button>'
            }) + '</div>' +
            '</div>' +
            /* Sửa phiếu thu — thay chỗ khung Tài chính */
            '<div class="ums-panel" data-z="sua" hidden>' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-pen-to-square"></i> Sửa số phiếu thu: <b data-z="suaSo"></b></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-act': 'dongSua' } }) + ui.btn('save', { attr: { 'data-act': 'luuSua' } }) + '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="suaBang"></div>' +
            '<div class="ums-panel__body"><div class="ums-grid ums-grid--2">' +
            ui.field('Hình thức', '<select class="ums-select" data-z="htSua" data-ph="Chọn hình thức thu"></select>') +
            ui.field('Ngày tạo', '<input class="ums-input" data-z="ngayTao" data-date autocomplete="off">') +
            '</div></div></div>' +
            /* Chọn khoản cần xuất hoá đơn — thay chỗ khung Tài chính */
            '<div class="ums-panel" data-z="xhd" hidden>' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-file-invoice"></i> Chọn khoản cần xuất hóa đơn</div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-act': 'dongXhd' } }) +
            '<span class="ums-u-fz13 ums-u-muted thu-goiy">Tích chọn khoản cần xuất rồi bấm →</span>' +
            '<button type="button" class="ums-btn ums-btn--primary" data-act="xuat"><i class="fa-light fa-paper-plane"></i><span>Xuất</span></button></div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="xhdBang"></div></div>' +
            /* Phiếu đã thu / đã huỷ — hiện DƯỚI hai khung trên như gốc */
            '<div class="ums-panel" data-z="phieu" hidden>' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-receipt"></i> <span data-z="pTitle">Phiếu thu</span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-act': 'dongPhieu' } }) +
            ui.btn('del', { text: 'Hủy', attr: { 'data-act': 'huyPhieu' } }) +
            '<button type="button" class="ums-btn ums-btn--out-primary" data-act="xuatHD"><i class="fa-light fa-paper-plane"></i><span>Xuất hóa đơn</span></button>' +
            ui.btn('print', { mod: 'primary', attr: { 'data-act': 'inPhieu' } }) + '</div></div>' +
            '<div class="ums-panel__body thu-lien" data-z="pLien" hidden></div>' +
            '<div class="ums-panel__body" data-z="pBody"></div></div>' +
            '</div>';

        /* Cột trái — luật 12 (Tải lại + Bộ lọc nâng cao, gõ là tự tìm); đổi ô lọc thì màn tự lo (còn đóng khung phải) */
        P.cotTrai(mst, { tai: function () { taiDS(1); }, moSan: true, tuTaiLoc: false });

        /* ---------- Báo cáo / Import (getList_MauImport "zonebtnTT") --------- */
        ums.report.mount(z('bc'), {
            collect: function (add) {
                add('strTaiChinh_KeHoach_Id', z('kh').value);
                if (S.nhId) add('strQLSV_NguoiHoc_Id', S.nhId);
                add('strPhieuThu_Id', S.phieuId);
            }
        });

        /* =================================================================
           1. KẾ HOẠCH + DANH SÁCH NGƯỜI HỌC
           ================================================================= */
        function keHoachId() { return z('kh').value || 'xxx'; }   // gốc: rỗng → "xxx"

        function taiDS(trang) {
            if (trang) S.trang = trang;
            var ds = z('ds');
            ds.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            S.keHoach = keHoachId();
            return goi('ds', {
                dDaNhapHoc: S.dkNhap,
                strTaiChinh_KeHoach_Id: S.keHoach,
                strNguoiThucHien_Id: '',
                strTuKhoa: z('q').value.trim(),
                pageIndex: S.trang,
                pageSize: S.co
            }).then(function (r) {
                S.dtNguoiHoc = rows(r);
                S.tong = r.pager || 0;
                veDS();
            }).catch(function (err) { ds.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách người học'); });
        }

        function veDS() {
            var ds = z('ds');
            ds.innerHTML = S.dtNguoiHoc.length ? S.dtNguoiHoc.map(function (x) {
                return '<button type="button" class="ums-master__item" data-id="' + esc(x.ID) + '">' +
                    '<span class="thu-nh">' + P.anhNguoi(x.ANH || '') +
                    '<span class="thu-nh__txt"><span class="ums-cell__title">' + esc(e(x.HODEM) + ' ' + e(x.TEN)) + '</span>' +
                    '<span class="ums-master__item__sub">' + esc(e(x.SOBAODANH)) + '</span></span>' +
                    (String(x.DANHAPHOC) === '1' ? '<i class="fa-light fa-tag ums-master__tt" title="Đã nhập học"></i>' : '') +
                    '</span></button>';
            }).join('') : ui.empty('Không có người học', 'fa-user-magnifying-glass');
            if (mst.sideCount) mst.sideCount.textContent = S.tong ? '(' + S.tong + ')' : '';
            mst.setPage({
                index: S.trang, size: S.co, total: S.tong, shown: S.dtNguoiHoc.length,
                onChange: function (p) { taiDS(p); },
                onSize: function (v) { S.co = v; taiDS(1); }
            });
            danhDau();
            /* KHÔNG tự chọn khi còn một kết quả (BO-CUC luật 12) — gốc có checkAuto_Select_NguoiHoc_TTTS */
        }
        function danhDau() {
            z('ds').querySelectorAll('.ums-master__item[data-id]').forEach(function (it) {
                it.classList.toggle('is-active', it.getAttribute('data-id') === String(S.nhId));
            });
        }

        z('ds').addEventListener('click', function (ev) {
            var it = ev.target.closest('.ums-master__item[data-id]');
            if (it) chon(it.getAttribute('data-id'));
        });
        z('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); taiDS(1); } });

        /* Đổi kế hoạch / điều kiện: tải lại danh sách, đóng khung người học đang mở */
        function doiLoc() { dongNguoiHoc(); taiDS(1); }
        if (window.jQuery) jQuery(z('kh')).on('select2:select', doiLoc);
        z('loc').addEventListener('change', function (ev) {
            if (ev.target.hasAttribute('data-dk')) { S.dkNhap = ev.target.value; doiLoc(); }
        });

        goi('keHoach', { strNguoiThucHien_Id: ums.session.userId }).then(function (r) {
            var ds = rows(r);
            z('kh').innerHTML = ui.options(ds, { id: 'ID', name: 'TENKEHOACH', title: 'Chọn kế hoạch nhập học' });
            if (ds.length) z('kh').value = ds[0].ID;          // selectOne: true
            if (window.jQuery) jQuery(z('kh')).trigger('change.select2');
            taiDS(1);
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); taiDS(1); });

        /* =================================================================
           2. HỒ SƠ NGƯỜI HỌC
           ================================================================= */
        function kv(nhan, gt) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(e(gt)) + '</b></div>'; }

        function veHoSo(d) {
            var ngaySinh = e(d.NGAYSINH_NGAY) + '/' + e(d.NGAYSINH_THANG) + '/' + e(d.NGAYSINH_NAM);
            var queQuan = e(d.HOKHAU_PHUONGXAKHOIXOM) + ' - ' + e(d.HOKHAU_QUANHUYEN_TEN) + ' - ' + e(d.HOKHAU_TINHTHANH_TEN);
            var tongDiem = Number(e(d.DIEMTS_TONGDIEM) === '' ? 0 : d.DIEMTS_TONGDIEM);
            var daThu = e(d.SODATHUTIEN);
            P.datDau(z('hsPanel'), {
                anh: d.ANH || '',
                ten: (e(d.HODEM) + ' ' + e(d.TEN)).toUpperCase(),
                nhan: ui.badge('Tổng số đã thu tiền: ' + (daThu === '' ? '' : (isFinite(Number(daThu)) ? hienTien(daThu) : daThu)), 'warn'),
                tools: ui.btn('close', { attr: { 'data-act': 'dongNH' } })
            });
            z('hs').innerHTML = '<div class="ums-grid ums-grid--2 thu-hs">' +
                '<div>' + kv('Họ tên', (e(d.HODEM) + ' ' + e(d.TEN)).toUpperCase()) + kv('Mã số SV', d.MASO) + kv('Ngày sinh', ngaySinh) +
                kv('Điện thoại', d.SODIENTHOAICANHAN) + kv('Quê quán', queQuan) + kv('Ngành nhập học', d.DAOTAO_NGANHNHAPHOC) +
                '<div class="ums-kv"><span>Lớp</span><b data-z="lop">' + esc(e(d.DAOTAO_LOPQUANLY_TEN)) + '</b></div>' + kv('CMND/CCCD', d.CMTND_SO) + '</div>' +
                '<div>' + kv('SBD', d.SOBAODANH) + kv('Tổng điểm', isNaN(tongDiem) ? '' : tongDiem.toFixed(2)) + kv('Đối tượng', d.DOITUONGDUTHI_TEN) +
                kv('% Miễn/Giảm', e(d.PHANTRAMMIENGIAM) === '' ? 0 : d.PHANTRAMMIENGIAM) + kv('Khu vực', d.KHUVUC_TEN) +
                kv('Ngành trúng tuyển', d.NGANHHOC_TEN) + '</div></div>';
        }

        /* btnSelect_NguoiHoc_ThuTien → reset + checkCondition_ThuTien */
        function chon(id) {
            var d = S.dtNguoiHoc.filter(function (x) { return String(x.ID) === String(id); })[0];
            if (!d) return;
            resetNguoiHoc();
            S.nhId = d.ID;
            S.nh = d;
            danhDau();
            veHoSo(d);
            z('trong').hidden = true;
            if (z('dt').hidden) ui.reveal(z('dt'));
            moVung('tc');
            dongPhieu(true);
            taiKhoan();
            taiPhieu();
        }
        function resetNguoiHoc() {
            S.nhId = ''; S.nh = null; S.phieuId = ''; S.dtKhoan = []; S.dtDaThu = []; S.inPhieu = null;
            z('dsPhieu').innerHTML = ''; z('dsHuy').innerHTML = ''; z('daThu').innerHTML = '';
            veKhoan([]);
        }
        function dongNguoiHoc() {
            resetNguoiHoc();
            z('dt').hidden = true;
            z('trong').hidden = false;
            danhDau();
        }

        /* =================================================================
           3. BẢNG KHOẢN + THU TIỀN
           ================================================================= */
        function taiKhoan() {
            var id = S.nhId;
            return goi('khoan', { strTC_KeHoachNhapHoc_Id: z('kh').value, strQLSV_NguoiHoc_TTTS_Id: id }).then(function (r) {
                if (id !== S.nhId) return;
                S.dtKhoan = rows(r);
                veKhoan(S.dtKhoan);
            }).catch(function (err) { ums.api.handle(err, 'các khoản nhập học'); });
        }

        function veKhoan(data) {
            ui.table({
                el: z('bang'), rows: data, tableCls: 'ums-table--lined thu-bang',
                empty: 'Chưa có khoản thu',
                columns: [
                    { title: 'Tên phí', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'thu-ten' },
                    { title: 'Số tiền Định mức', prop: 'SOTIENDINHMUC_CHUNG', cls: 'is-right is-nowrap', sum: true, render: function (r) { return hienTien(r.SOTIENDINHMUC_CHUNG); } },
                    { title: 'Số tiền Thực thu', prop: 'SOTIENDINHMUC', cls: 'is-right is-nowrap', sum: true, render: function (r) { return hienTien(r.SOTIENDINHMUC); } },
                    {
                        title: 'Số tiền Đã thu', prop: 'SOTIENDATHU', cls: 'is-right is-nowrap', sum: true, render: function (r) {
                            var v = hienTien(r.SOTIENDATHU);
                            return so(r.SOTIENDATHU) > so(r.SOTIENDINHMUC) ? '<span class="thu-vuot">' + v + '</span>' : v;
                        }
                    },
                    {
                        title: 'Số tiền Cần nộp', cls: 'is-right', width: '180px',
                        sum: function () { return '<b data-z="tongCan">0</b>'; },
                        render: function (r) {
                            var can = so(r.SOTIENDINHMUC) - so(r.SOTIENDATHU);
                            if (can < 0) can = 0;
                            return '<input class="ums-input ums-input--sm thu-num" data-khoan="' + esc(r.TAICHINH_CACKHOANTHU_ID) + '" inputmode="decimal" value="' + esc(tien(can)) + '">';
                        }
                    },
                    { title: 'Đơn vị', cls: 'is-center', render: function () { return 'vnđ'; } }
                ]
            });
            tongThu();
        }

        /* sumTienCanNop_ThuTien */
        function tongThu() {
            var t = 0;
            z('bang').querySelectorAll('input[data-khoan]').forEach(function (i) { t += so(i.value); });
            var s = hienTien(t);
            z('tongThu').textContent = s;
            var f = z('bang').querySelector('[data-z="tongCan"]');
            if (f) f.textContent = s;
        }
        z('bang').addEventListener('input', function (ev) { if (ev.target.hasAttribute('data-khoan')) tongThu(); });
        z('bang').addEventListener('focusout', function (ev) {
            var i = ev.target;
            if (i.hasAttribute && i.hasAttribute('data-khoan')) { i.value = tien(so(i.value)); tongThu(); }
        });

        /* save_ThuTien */
        function thuTien(nut) {
            if (!S.nhId) { ui.toast('Vui lòng chọn Người học cần thu tiền!', 'warn'); return; }
            var ids = [], tiens = [], khong = 0;
            S.dtKhoan.forEach(function (k) {
                var i = z('bang').querySelector('input[data-khoan="' + (window.CSS && CSS.escape ? CSS.escape(String(k.TAICHINH_CACKHOANTHU_ID)) : k.TAICHINH_CACKHOANTHU_ID) + '"]');
                var v = so(i ? i.value : '');
                ids.push(k.TAICHINH_CACKHOANTHU_ID);
                tiens.push(v);
                if (v === 0) khong++;
            });
            if (khong === tiens.length) { ui.toast('Dữ liệu không hợp lệ!', 'warn'); return; }
            nut.disabled = true;
            goi('thu', {
                strQLSV_NguoiHoc_TTTS_Id: S.nhId,
                strTC_KeHoachNhapHoc_Id: z('kh').value,
                strTAICHINH_CacKhoanThu_Ids: ids.toString(),
                strTAICHINH_SoTien_s: tiens.toString(),
                strHinhThucThu_Id: z('htThu').value,
                strNgayThuTien: z('ngayThu').value,
                strNguoiThucHien_Id: '',
                strChucNang_Id: ''
            }).then(function (r) {
                var m = String(e(r.message)).split(',');
                ui.toast('Thu tiền thành công', 'ok');
                return Promise.all([taiPhieu(), taiKhoan()]).then(function () {
                    S.phieuId = m[0];
                    moVung('tc');
                    xemPhieuMoi(m[0]);
                });
            }).catch(function (err) { ums.api.handle(err, 'thu tiền'); })
                .then(function () { nut.disabled = false; });
        }

        /* Hình thức thu (QLTC.HTTHU) — cho cả ô sửa phiếu; ô thu tiền chọn sẵn mã TM (cbGenCombo_HinhThucThu) */
        ums.api.dm('QLTC.HTTHU').then(function (ds) {
            z('htThu').innerHTML = ui.options(ds, { id: 'ID', name: 'TEN', title: 'Hình thức thu' });
            z('htSua').innerHTML = ui.options(ds, { id: 'ID', name: 'TEN', title: 'Chọn hình thức thu' });
            var tm = ds.filter(function (x) { return x.MA === 'TM'; })[0];
            if (tm) z('htThu').value = tm.ID;
            if (window.jQuery) jQuery(z('htThu')).add(z('htSua')).trigger('change.select2');
        }).catch(function (err) { ums.api.handle(err, 'hình thức thu'); });

        /* =================================================================
           4. DANH SÁCH PHIẾU ĐÃ THU / ĐÃ HUỶ
           ================================================================= */
        function taiPhieu() {
            var id = S.nhId;
            var p1 = ums.api.call({ action: 'TC_PhieuThu/LayDSPhieuThuNhaphoc', method: 'GET', versionAPI: 'v1.0', strQlsv_Nguoihoc_Id: id })
                .then(function (r) { if (id === S.nhId) vePhieu(rows(r)); })
                .catch(function (err) { ums.api.handle(err, 'phiếu đã thu'); });
            var p2 = ums.api.call({ action: 'TC_PhieuThu/LayDSPhieuThuNhaphoc_Huy', method: 'GET', versionAPI: 'v1.0', strQLSV_NguoiHoc_Id: id })
                .then(function (r) { if (id === S.nhId) veHuy(rows(r)); })
                .catch(function (err) { ums.api.handle(err, 'phiếu đã hủy'); });
            return Promise.all([p1, p2]);
        }
        /* genList_PhieuPhu — dấu "Đã thu / Chưa thu" + danh sách phiếu (xem / sửa) */
        function vePhieu(ds) {
            z('daThu').innerHTML = ds.length ? ui.badge('Đã thu', 'ok') : ui.badge('Chưa thu', 'mute');
            z('dsPhieu').innerHTML = ds.length ? ds.map(function (x) {
                return '<span class="thu-so">' +
                    '<button type="button" class="thu-so__ma" data-act="xemPhieu" data-id="' + esc(x.ID) + '" title="Chi tiết/ In phiếu">#' + esc(e(x.SOPHIEUTHU)) + '</button>' +
                    '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-act="suaPhieu" data-id="' + esc(x.ID) + '" title="Sửa phiếu thu"><i class="fa-light fa-pen-to-square"></i></button>' +
                    '</span>';
            }).join('') : '<span class="ums-u-muted">#</span>';
        }
        function veHuy(ds) {
            z('dsHuy').innerHTML = ds.length ? ds.map(function (x) {
                return '<span class="thu-so thu-so--huy"><button type="button" class="thu-so__ma" data-act="xemHuy" data-id="' + esc(x.ID) + '" title="Chi tiết/In phiếu">#' + esc(e(x.SOPHIEUTHU)) + '</button></span>';
            }).join('') : '<span class="ums-u-muted">#</span>';
        }

        /* =================================================================
           5. XEM / IN / HUỶ PHIẾU
           ================================================================= */
        function moPhieu(huy) {
            S.phieuHuy = !!huy;
            var p = z('phieu');
            p.querySelector('[data-act="huyPhieu"]').hidden = !!huy;       // gốc: phiếu đã huỷ ẩn nút Hủy
            z('pTitle').textContent = huy ? 'Phiếu thu đã hủy' : 'Phiếu thu';
            z('thanh').querySelector('[data-act="thu"]').hidden = true;    // gốc: thanh Thu tiền đổi sang thanh phiếu
            if (p.hidden) ui.reveal(p);
            S.viewer = ums.phieu.viewer(z('pBody'), { tools: z('pLien'), empty: 'Chưa có phiếu' });
            z('pBody').innerHTML = ui.empty('Đang tải phiếu…', 'fa-spinner fa-spin');
            setTimeout(function () { try { p.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (x) { /* bỏ qua */ } }, 250);
        }
        function dongPhieu(im) {
            z('phieu').hidden = true;
            z('pBody').innerHTML = '';
            z('pLien').hidden = true;
            S.viewer = null;
            var b = z('thanh').querySelector('[data-act="thu"]');
            if (b) b.hidden = false;
            if (!im) return;
        }

        /* getDetail_NguoiHoc_PhieuThu: LayTTQLSV_NguoiHoc_TTTS → khoản đã thu → phôi */
        function xemPhieuMoi(phieuId) {
            moPhieu(false);
            var id = S.nhId;
            return goi('ttNH', { strId: id }).then(function (r) {
                var d = rows(r)[0];
                if (!d || id !== S.nhId) return;
                S.nh = d;
                var lop = z('hs').querySelector('[data-z="lop"]');
                if (lop) lop.textContent = e(d.DAOTAO_LOPQUANLY_TEN);
                return taiDaThu(phieuId, 'IN');
            }).catch(function (err) { ums.api.handle(err, 'thông tin người học'); });
        }

        /* getList_KhoanDaThu_Rut(id, loại) */
        function taiDaThu(phieuId, loai) {
            return goi('daThu', { strTC_KeHoachNhapHoc_Id: z('kh').value, strPhieuThu_Rut_Id: phieuId }).then(function (r) {
                var ds = rows(r);
                S.dtDaThu = ds;
                if (loai === 'SUA') veSua(ds);
                else veDetailPhieu(ds);
                return ds;
            }).catch(function (err) { ums.api.handle(err, 'khoản đã thu'); });
        }

        /* genDetail_PhieuThu */
        function veDetailPhieu(ds) {
            if (!ds.length) { z('pBody').innerHTML = ui.empty('Phiếu không có khoản thu', 'fa-receipt'); return; }
            var d0 = ds[0];
            var nh = {};
            Object.keys(S.nh || {}).forEach(function (k) { nh[k] = S.nh[k]; });
            if (d0.MAUIN_MASO && String(d0.MAUIN_MASO).indexOf('BAOCAO_') === 0) {
                /* Mẫu in là BÁO CÁO: chạy báo cáo pdf, không vẽ phôi (như gốc) */
                ums.report.run(d0.MAUIN_MASO, {
                    collect: function (add) {
                        add('strQLSV_NguoiHoc_Id', S.nhId);
                        add('strTaiChinh_KeHoach_Id', z('kh').value);
                    }
                });
                z('pBody').innerHTML = ui.empty('Phiếu in dạng báo cáo — đã mở báo cáo ' + d0.MAUIN_MASO, 'fa-file-pdf');
                return;
            }
            ds = ds.map(function (x) { var o = {}; Object.keys(x).forEach(function (k) { o[k] = x[k]; }); return o; });
            ds[0].SOPHIEUTHU = ds[0].SOCHUNGTU;
            nh.HOKHAUTHUONGTRU = e(nh.HOKHAU_PHUONGXA_TEN) + ', ' + e(nh.HOKHAU_QUANHUYEN_TEN) + ', ' + e(nh.HOKHAU_TINHTHANH_TEN);
            nh.NGAYSINH = e(nh.NGAYSINH_NGAY) + '/' + e(nh.NGAYSINH_THANG) + '/' + e(nh.NGAYSINH_NAM);
            nh.DAOTAO_LOPQUANLY_N1_TEN = nh.DAOTAO_LOPQUANLY_TEN;
            nh.NGANHHOC_N1_TEN = nh.DAOTAO_NGANHNHAPHOC;
            nh.KHOAHOC_N1_TEN = nh.DAOTAO_KHOADAOTAO_TEN;
            nh.MAUIN_MASO = d0.MAUIN_MASO;
            S.inPhieu = nh;
            z('pTitle').textContent = (S.phieuHuy ? 'Phiếu thu đã hủy' : 'Phiếu thu') + (e(d0.SOCHUNGTU) !== '' ? ' #' + d0.SOCHUNGTU : '');
            if (!S.viewer) return;
            xemTuDuLieu(S.viewer, ds, [nh], function (box) {
                /* callback của genData_PhieuThu: địa chỉ bên B + chỉnh theo từng phôi */
                var id = e(ds[0].CHUNGTU_ID);
                function lop(c) { return Array.prototype.slice.call(box.getElementsByClassName(c + id)); }
                lop('txtDiaChi_BenB_').forEach(function (el) { el.textContent = e(nh.DIACHINGUOIMUA); });
                switch (d0.MAUIN_MASO) {
                    case 'CKVINHPHUC_BIENLAITHU':
                        lop('txtDonVi_BenB_').concat(lop('txtMaSoThue_BenB_')).forEach(function (el) {
                            var tr = el.parentNode && el.parentNode.parentNode;
                            if (tr && tr.parentNode) tr.parentNode.removeChild(tr);
                        });
                        break;
                    case 'DHNONGLAM_TN_BIENLAI':
                        lop('txtDiaChi_BenB_').forEach(function (el) { el.textContent = e(nh.DAOTAO_LOPQUANLY_TEN); });
                        break;
                }
            });
        }

        function inPhieu() {
            if (S.viewer) S.viewer.print('In phiếu thu');
            dongPhieu();
        }

        function huyPhieu() {
            ui.confirm('Bạn có chắc chắn muốn hủy phiếu thu?', { tone: 'bad', ok: 'Hủy phiếu' }).then(function (y) {
                if (!y) return;
                ums.api.call({ action: 'TC_PhieuThu/HuyPhieuNhapHoc', versionAPI: 'v1.0', strPhieu_Id: S.phieuId, strNguoiThucHien_Id: '' })
                    .then(function () {
                        S.phieuId = '';
                        ui.toast('Hủy phiếu thu thành công!', 'ok');
                        dongPhieu();
                        taiPhieu(); taiKhoan();
                    }).catch(function (err) { ums.api.handle(err, 'hủy phiếu thu'); });
            });
        }

        /* =================================================================
           6. SỬA PHIẾU THU (zoneEdit_PhieuDaThu)
           ================================================================= */
        function moVung(k) {
            ['tc', 'sua', 'xhd'].forEach(function (n) {
                var el = z(n);
                if (n === k) { if (el.hidden) ui.reveal(el); } else el.hidden = true;
            });
        }

        function veSua(ds) {
            var d0 = ds[0] || {};
            z('suaSo').textContent = e(d0.SOCHUNGTU) !== '' ? '#' + d0.SOCHUNGTU : '';
            if (ds.length) {
                z('htSua').value = e(d0.HINHTHUCTHU_ID);
                if (window.jQuery) jQuery(z('htSua')).trigger('change.select2');
                z('ngayTao').value = e(d0.NGAYTAO_DD_MM_YYYY);
                if (z('ngayTao')._flatpickr) z('ngayTao')._flatpickr.setDate(z('ngayTao').value, false, 'd/m/Y');
            }
            ui.table({
                el: z('suaBang'), rows: ds, tableCls: 'ums-table--lined thu-bang', empty: 'Phiếu không có khoản thu',
                columns: [
                    { title: 'Tên phí', prop: 'NOIDUNG', cls: 'thu-ten' },
                    { title: 'Số tiền đã thu', prop: 'SOTIENDATHU', cls: 'is-right is-nowrap', sum: true, render: function (r) { return hienTien(r.SOTIENDATHU); } },
                    {
                        title: 'Số tiền điều chỉnh', cls: 'is-right', width: '180px',
                        sum: function () { return '<b data-z="tongSua">0</b>'; },
                        render: function (r) {
                            return '<input class="ums-input ums-input--sm thu-num" data-sua="' + esc(r.TAICHINH_CACKHOANTHU_ID) + '" inputmode="decimal" value="' + esc(tien(so(r.SOTIENDATHU))) + '">';
                        }
                    },
                    { title: 'Đơn vị', cls: 'is-center', render: function () { return 'vnđ'; } }
                ]
            });
            tongSua();
        }
        function tongSua() {
            var t = 0;
            z('suaBang').querySelectorAll('input[data-sua]').forEach(function (i) { t += so(i.value); });
            var f = z('suaBang').querySelector('[data-z="tongSua"]');
            if (f) f.textContent = hienTien(t);
        }
        z('suaBang').addEventListener('input', function (ev) { if (ev.target.hasAttribute('data-sua')) tongSua(); });
        z('suaBang').addEventListener('focusout', function (ev) {
            var i = ev.target;
            if (i.hasAttribute && i.hasAttribute('data-sua')) { i.value = tien(so(i.value)); tongSua(); }
        });

        /* edit_PhieuThu */
        function luuSua(nut) {
            if (!S.phieuId) { ui.toast('Vui lòng chọn Phiếu cần chỉnh sửa!', 'warn'); return; }
            var ids = [], tiens = [];
            var o = z('suaBang').querySelectorAll('input[data-sua]');
            S.dtDaThu.forEach(function (k, i) {
                ids.push(k.TAICHINH_CACKHOANTHU_ID);
                tiens.push(so(o[i] ? o[i].value : ''));
            });
            nut.disabled = true;
            goi('sua', {
                strPhieuThu_Rut_Id: S.phieuId,
                strTAICHINH_CacKhoanThu_Ids: ids.toString(),
                strTAICHINH_SoTien_s: tiens.toString(),
                strHinhThucThu_Ids: z('htSua').value,
                strNgayTao: z('ngayTao').value,
                strNguoiThucHien_Id: ''
            }).then(function () {
                ui.toast('Cập nhật phiếu thu thành công', 'ok');
                return Promise.all([taiPhieu(), taiKhoan()]).then(function () {
                    moVung('tc');
                    moPhieu(false);
                    taiDaThu(S.phieuId, 'IN');
                });
            }).catch(function (err) { ums.api.handle(err, 'sửa phiếu thu'); })
                .then(function () { nut.disabled = false; });
        }

        /* =================================================================
           7. CHỌN KHOẢN XUẤT HOÁ ĐƠN (zoneEdit_PhieuXuatHoaDon)
           ================================================================= */
        function moXuatHD() {
            if (!S.phieuId) { ui.toast('Vui lòng chọn Phiếu thu cần xuất hóa đơn!', 'warn'); return; }
            goi('daThu', { strTC_KeHoachNhapHoc_Id: z('kh').value, strPhieuThu_Rut_Id: S.phieuId }).then(function (r) {
                S.dtHoaDon = rows(r);
                if (cfg.cu && !S.dtHoaDon.length) return;              // bản cũ: rỗng thì không mở khung
                dongPhieu();
                moVung('xhd');
                veXuatHD(S.dtHoaDon);
                if (!S.dtHoaDon.length) ui.toast('Phiếu thu này không có khoản nào để xuất hóa đơn!', 'warn');
            }).catch(function (err) { ums.api.handle(err, 'khoản xuất hóa đơn'); });
        }

        function veXuatHD(ds) {
            ui.table({
                el: z('xhdBang'), rows: ds, tableCls: 'ums-table--lined thu-bang', empty: 'Không có khoản để xuất hóa đơn',
                columns: [
                    { title: 'Tên phí', prop: 'NOIDUNG', cls: 'thu-ten' },
                    { title: 'Nội dung', render: function (r) { return '<input class="ums-input ums-input--sm" data-hd="nd" data-i="' + esc(r.ID) + '" value="' + esc(e(r.NOIDUNG)) + '">'; } },
                    { title: 'Số lượng', cls: 'is-center', width: '90px', render: function (r) { return '<input class="ums-input ums-input--sm thu-num" data-hd="sl" data-i="' + esc(r.ID) + '" inputmode="decimal" value="1">'; } },
                    { title: 'Số tiền', cls: 'is-right', width: '170px', render: function (r) { return '<input class="ums-input ums-input--sm thu-num" data-hd="st" data-i="' + esc(r.ID) + '" inputmode="decimal" value="' + esc(e(r.SOTIENDATHU)) + '">'; } },
                    {
                        head: '<input type="checkbox" data-z="chkAll" checked title="Chọn tất cả">', cls: 'is-center', width: '48px',
                        render: function (r) { return '<input type="checkbox" data-hd="ck" data-i="' + esc(r.ID) + '" checked>'; }
                    }
                ]
            });
        }
        z('xhdBang').addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.getAttribute('data-z') === 'chkAll') {
                z('xhdBang').querySelectorAll('input[data-hd="ck"]').forEach(function (c) { c.checked = t.checked; });
            }
        });
        function oXhd(loai, id) {
            var el = null;
            z('xhdBang').querySelectorAll('input[data-hd="' + loai + '"]').forEach(function (x) { if (x.getAttribute('data-i') === String(id)) el = x; });
            return el;
        }

        /* genHTML_NoiDung_HoaDon: dựng dòng hoá đơn từ các khoản đã tích */
        function xuat() {
            var chon = [];
            z('xhdBang').querySelectorAll('input[data-hd="ck"]').forEach(function (c) { if (c.checked) chon.push(c.getAttribute('data-i')); });
            if (!chon.length) { ui.toast('Vui lòng chọn khoản cần xuất hóa đơn!', 'warn'); return; }
            var dong = [], dau = null;
            chon.forEach(function (id) {
                var r = S.dtHoaDon.filter(function (x) { return String(x.ID) === String(id); })[0];
                if (!r) return;
                if (!dau) dau = r;
                var soTien = (oXhd('st', id) || {}).value;
                if (so(soTien) === 0) return;                            // gốc: dSoTien == 0 thì bỏ dòng
                var sl = (oXhd('sl', id) || {}).value;
                dong.push({
                    id: r.ID, khoanThuGoc: r.TAICHINH_CACKHOANTHU_ID, thoiGian: r.DAOTAO_THOIGIANDAOTAO_ID,
                    ten: e(r.NOIDUNG), noiDung: (oXhd('nd', id) || {}).value || '',
                    soLuong: so(sl), donGia: so(soTien), thanhTien: so(soTien) * so(sl)
                });
            });
            if (!dong.length) { ui.toast('Không lấy được nội dung khoản thu để xuất hóa đơn. Vui lòng kiểm tra lại số tiền của các khoản đã chọn!', 'warn'); return; }
            var tong = dong.reduce(function (a, d) { return a + d.thanhTien; }, 0);
            if (!tong) { ui.toast('Không tính được tổng tiền hóa đơn. Vui lòng kiểm tra lại số lượng / số tiền!', 'warn'); return; }
            S.hd = {
                dong: dong, tong: tong,
                hinhThucThuMa: e(dau.HINHTHUCTHU_MA), hinhThucThuTen: e(dau.HINHTHUCTHU_TEN),
                loaiTienTe: e(dau.LOAITIENTE_MA), donViTinh: e(dau.DONVITINH_TEN),
                diaChi: e((S.inPhieu || S.nh || {}).NOIOHIENNAY),
                ban: null
            };
            S.hoaDonId = '';
            moHoaDon();
        }

        /* =================================================================
           8. MÀN HOÁ ĐƠN (zoneThongTinHoaDon)
           ================================================================= */
        ums.api.dm('TAICHINH.NUTHDDT').then(function (ds) { S.nutHDDT = ds; }).catch(function () { S.nutHDDT = []; });

        function moHoaDon() {
            var hd = z('hd');
            hd.innerHTML = '<div class="ums-panel">' +
                '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-file-invoice"></i> Hóa đơn</div>' +
                '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-hact': 'dong' } }) +
                ui.btn('del', { text: 'Hủy hóa đơn', attr: { 'data-hact': 'huy' }, cls: 'thu-an' }) +
                S.nutHDDT.map(function (n) {
                    var ic = ums.iconFA4 ? ums.iconFA4(n.THONGTIN1) : '';
                    return '<button type="button" class="ums-btn ums-btn--out-warn" data-hact="hddt" data-ma="' + esc(e(n.MA)) + '">' +
                        '<i class="' + esc(ic || 'fa-light fa-file-invoice') + '"></i><span>' + esc(e(n.TEN)) + '</span></button>';
                }).join('') +
                '<button type="button" class="ums-btn ums-btn--save" data-hact="luu"><i class="fa-light fa-floppy-disk"></i><span>Xuất hóa đơn</span></button>' +
                ui.btn('print', { text: 'In hóa đơn', mod: 'primary', attr: { 'data-hact': 'in' }, cls: 'thu-an' }) +
                '</div></div>' +
                '<div class="ums-panel__body thu-lien" data-z="hdLien" hidden></div>' +
                '<div class="ums-panel__body" data-z="hdBody">' + ui.empty('Đang dựng hóa đơn…', 'fa-spinner fa-spin') + '</div></div>';
            hd.querySelectorAll('.thu-an').forEach(function (b) { b.hidden = true; });
            ui.swap(z('layout'), hd);
            S.hdViewer = null;
            dungBanNhap().then(function (ban) {
                if (!S.hd) return;
                S.hd.ban = ban;
                veKhung(z('hdBody'), ban);
            });
        }

        /* Phôi hoá đơn nháp Edit_DHCNTTTN_HOADON_2018 — đổ dữ liệu như loadPhieu() của gốc */
        function dungBanNhap() {
            var nh = S.inPhieu || S.nh || {};
            var hd = S.hd, h = homNay();
            var goc = ((ums.session && ums.session.rootPath) || location.origin).replace(/\/+$/, '') + '/';
            var url = goc + 'Upload/Files/PrintTemplate/Edit_DHCNTTTN_HOADON_2018.html?v=2';
            function rutGon() {
                var rs = hd.dong.map(function (d) {
                    return { NOIDUNG: d.ten + (d.noiDung && d.noiDung !== d.ten ? ' — ' + d.noiDung : ''), SOTIENDATHU: d.thanhTien,
                        TENPHIEU: 'HÓA ĐƠN BÁN HÀNG', NGAYIN_NGAY: h.ngay, NGAYIN_THANG: h.thang, NGAYIN_NAM: h.nam };
                });
                var p = ums.phieu.neutral(rs, [nh], 'HOADON');
                return { css: p.css, html: p.html };
            }
            return fetch(url, { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (txt) {
                if (!txt) return rutGon();
                var doc = new DOMParser().parseFromString(txt, 'text/html');
                var css = Array.prototype.map.call(doc.querySelectorAll('style'), function (s) { return s.textContent; }).join('\n');
                Array.prototype.forEach.call(doc.body.querySelectorAll('script,style'), function (s) { s.parentNode.removeChild(s); });
                var box = document.createElement('div');
                box.innerHTML = doc.body.innerHTML;
                var tb = box.querySelector('#tbldataPhieuThuPopup_PT_Edit');
                if (!tb) return rutGon();
                function dat(c, v) { Array.prototype.forEach.call(box.getElementsByClassName(c), function (el) { el.textContent = e(v); }); }
                dat('txtMaNCSPTC_PT_Edit', nh.MASO);
                dat('txtHoTenPTC_PT_Edit', e(nh.HODEM) + ' ' + e(nh.TEN));
                dat('iNgayPTC_PT_Edit', h.ngay); dat('iThangPTC_PT_Edit', h.thang); dat('iNamPTC_PT_Edit', h.nam);
                dat('txtNgaySinhPTC_PT_Edit', nh.NGAYSINH);
                dat('txtMaSoThue_PT_Edit', nh.MASOTHUECANHAN);
                dat('txtDiaChiPTC_PT_Edit', nh.NOIOHIENNAY);
                dat('txtLopPTC_PT_Edit', nh.DAOTAO_LOPQUANLY_N1_TEN);
                dat('txtNganhPTC_PT_Edit', nh.NGANHHOC_N1_TEN);
                dat('txtKhoaPTC_PT_Edit', nh.KHOAHOC_N1_TEN);
                var tbody = tb.querySelector('tbody');
                if (!tbody) { tbody = document.createElement('tbody'); tb.appendChild(tbody); }
                var tSL = 0, tDG = 0;
                tbody.insertAdjacentHTML('beforeend', hd.dong.map(function (d, i) {
                    tSL += d.soLuong; tDG += d.donGia;
                    return '<tr><td>' + (i + 1) + '</td><td>' + esc(d.ten) + '</td><td>' + esc(d.noiDung) + '</td><td>' + esc(String(d.soLuong)) +
                        '</td><td>' + esc(tien(d.donGia)) + '</td><td>' + esc(tien(d.thanhTien)) + '</td></tr>';
                }).join(''));
                /* insertSumAfterTable(…, [3, 4, 5]) */
                var tfoot = tb.querySelector('tfoot');
                if (!tfoot) { tfoot = document.createElement('tfoot'); tb.appendChild(tfoot); }
                tfoot.innerHTML = '<tr><td></td><td><b>Tổng</b></td><td></td><td><b>' + esc(tien(tSL)) + '</b></td><td><b>' + esc(tien(tDG)) +
                    '</b></td><td><b>' + esc(tien(hd.tong)) + '</b></td></tr>';
                dat('txtTongTien_PT_Edit', tien(hd.tong));
                dat('txtSoTienPTC_PT_Edit', ui.docSo(hd.tong));
                return { css: css, html: box.innerHTML };
            }).catch(function () { return rutGon(); });
        }

        /* Hiện bản nháp trong <iframe> (kiểu của phôi không rò ra trang — như ums.phieu.viewer) */
        function veKhung(host, ban) {
            host.innerHTML = '<iframe class="thu-khung" title="Hóa đơn"></iframe>';
            var f = host.firstChild;
            f.addEventListener('load', function () {
                try { f.style.height = Math.max(420, f.contentDocument.documentElement.scrollHeight + 8) + 'px'; } catch (x) { /* bỏ qua */ }
            });
            f.srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + ban.css + '\nbody{margin:12px;background:#fff}</style></head><body>' + ban.html + '</body></html>';
        }

        function dongHoaDon() {
            z('hd').hidden = true;
            z('hd').innerHTML = '';
            S.hd = null; S.hdViewer = null;
            ui.reveal(z('layout'));
        }

        /* informSaveSuccess */
        function daLuuHD(id) {
            var hd = z('hd');
            S.hoaDonId = id || '';
            hd.querySelectorAll('[data-hact="luu"], [data-hact="hddt"]').forEach(function (b) { b.remove(); });
            hd.querySelectorAll('[data-hact="in"], [data-hact="huy"]').forEach(function (b) { b.hidden = false; });
        }

        function thamSoHD() {
            var d = S.hd.dong;
            return {
                ids: d.map(function (x) { return x.id; }).join(','),
                khoanThu: d.map(function (x) { return x.khoanThuGoc; }).join(','),
                thoiGian: d.map(function (x) { return e(x.thoiGian); }).join(','),
                noiDung: d.map(function (x) { return x.noiDung; }).join('#'),
                soLuong: d.map(function (x) { return x.soLuong; }).join(','),
                donGia: d.map(function (x) { return x.donGia; }).join(','),
                soTien: d.map(function (x) { return x.thanhTien; }).join(','),
                dvt: d.map(function () { return S.hd.donViTinh; }).toString()
            };
        }

        /* save_HoaDon — hoá đơn giấy */
        function luuHD() {
            ui.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', { title: 'Xuất hóa đơn', ok: 'Lưu' }).then(function (y) {
                if (!y || !S.hd) return;
                var p = thamSoHD();
                ums.api.call({
                    action: 'TC_DaNop_HoaDon/ThemMoi', versionAPI: 'v1.0',
                    strNguoiThucHien_Id: '',
                    strTaiChinh_DaNop_Ids: p.ids,
                    strTAICHINH_CACKHOANTHU_Ids: p.khoanThu,
                    strTaiChinh_SoTien_s: p.soTien,
                    strTaiChinh_NoiDung_s: p.noiDung,
                    strDonGia_s: p.donGia,
                    strSoLuong_s: p.soLuong,
                    strDonViTinhTen_s: p.dvt,
                    strLoaiTienTe: S.hd.loaiTienTe,
                    strQLSV_NguoiHoc_Id: S.nhId,
                    strDaoTao_ThoiGianDaoTao_Id: p.thoiGian,
                    strDaoTao_ToChucCT_Id: '',
                    strHinhThucThu_Id: ''              // gốc đọc #dropHinhThucThuPTC_PT_Edit — phôi không có ô này
                }).then(function (r) {
                    ui.toast('Xuất hóa đơn thành công', 'ok');
                    daLuuHD(r.raw && r.raw.Id);
                }).catch(function (err) { ums.api.handle(err, 'xuất hóa đơn'); });
            });
        }

        /* saveHDDT / saveHDDT_Nhap — nút theo danh mục TAICHINH.NUTHDDT */
        function xuatHDDT(ma) {
            var p = thamSoHD();
            var call = {
                strNguoiThucHien_Id: '',
                strTaiChinh_CacKhoanThu_Ids: p.ids,
                strQLSV_NguoiHoc_Id: S.nhId,
                strDaoTao_ThoiGianDaoTao_Id: p.thoiGian,
                strHinhThucThu_MA: S.hd.hinhThucThuMa,
                strHinhThucThu_TEN: S.hd.hinhThucThuTen,
                strTaiChinh_SoTien_s: p.soTien,
                strTaiChinh_NoiDung_s: p.noiDung,
                strDonGia_s: p.donGia,
                strSoLuong_s: p.soLuong,
                strDonViTinhTen_s: p.dvt,
                strLoaiTienTe: S.hd.loaiTienTe,
                strPhuongThuc_MA: ma,
                strDiaChiNguoiMua: S.hd.diaChi
            };
            if (ma === 'HDDTNHAP') {
                call.action = 'HDDT_HoaDon/ThemMoi_Nhap';
                ums.api.call(call).then(function (r) {
                    var link = e(r.data);
                    if (link.indexOf('http') !== 0) link = ums.phieu.hddtBase() + link;
                    var w = window.open(link, '_blank');
                    if (w) w.focus(); else ui.toast('Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!', 'warn');
                }).catch(function (err) { ums.api.handle(err, 'hóa đơn điện tử nháp'); });
                return;
            }
            ui.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', { title: 'Hóa đơn điện tử', ok: 'Xuất' }).then(function (y) {
                if (!y || !S.hd) return;
                call.action = 'HDDT_HoaDon/ThemMoi';
                ums.api.call(call).then(function (r) {
                    var id = r.raw && r.raw.Id;
                    daLuuHD(id);
                    ui.toast('Sinh hóa đơn thành công', 'ok');
                    S.hdViewer = ums.phieu.viewer(z('hdBody'), { tools: z('hdLien') });
                    S.hdViewer.show({ id: id, loai: 'HOADON' });
                }).catch(function (err) { ums.api.handle(err, 'hóa đơn điện tử'); dongHoaDon(); });
            });
        }

        /* printPhieu: in rồi đóng màn hoá đơn, ghi tình trạng đã in */
        function inHD() {
            if (S.hdViewer) S.hdViewer.print('In hóa đơn');
            else if (S.hd && S.hd.ban) ui.print(S.hd.ban.html.replace(/_PHOI.jpg/g, ''), { title: 'In hóa đơn', css: S.hd.ban.css });
            var id = S.hoaDonId;
            dongHoaDon();
            ums.api.call({ action: 'TC_HoaDon/Them_TinhTrangInHoaDon', versionAPI: 'v1.0', silent: true, strId: '', strNguoiThucHien_Id: '', strSoHoaDon_Id: id })
                .catch(function () { /* gốc bỏ qua kết quả */ });
            S.hoaDonId = '';
        }

        /* delete_HD */
        function huyHD() {
            ui.confirm('Bạn có chắc chắn muốn hủy hóa đơn không!', { tone: 'bad', ok: 'Hủy hóa đơn' }).then(function (y) {
                if (!y) return;
                ums.api.call({ action: 'TC_HoaDon/HuyHoaDon', versionAPI: 'v1.0', strHoaDon_Id: S.hoaDonId, strNguoiThucHien_Id: '' })
                    .then(function () { dongHoaDon(); ui.toast('Xóa hóa đơn thành công!', 'ok'); })
                    .catch(function (err) { ums.api.handle(err, 'hủy hóa đơn'); });
            });
        }

        z('hd').addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hact]');
            if (!b) return;
            switch (b.getAttribute('data-hact')) {
                case 'dong': dongHoaDon(); break;
                case 'luu': luuHD(); break;
                case 'hddt': xuatHDDT(b.getAttribute('data-ma')); break;
                case 'in': inHD(); break;
                case 'huy': huyHD(); break;
            }
        });

        /* ---------- Sự kiện chung ---------------------------------------------- */
        z('layout').addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-act]');
            if (!b || !z('layout').contains(b)) return;
            switch (b.getAttribute('data-act')) {
                case 'dongNH': dongNguoiHoc(); break;
                case 'thu': thuTien(b); break;
                case 'xemPhieu':
                    S.phieuId = b.getAttribute('data-id');
                    moVung('tc');
                    xemPhieuMoi(S.phieuId);
                    break;
                case 'xemHuy':
                    S.phieuId = b.getAttribute('data-id');
                    moVung('tc');
                    moPhieu(true);
                    taiDaThu(S.phieuId, 'IN');
                    break;
                case 'suaPhieu':
                    S.phieuId = b.getAttribute('data-id');
                    dongPhieu();
                    moVung('sua');
                    taiDaThu(S.phieuId, 'SUA');
                    break;
                case 'dongSua': moVung('tc'); break;
                case 'luuSua': luuSua(b); break;
                case 'dongXhd': moVung('tc'); break;
                case 'xuat': xuat(); break;
                /* btnClose_HoaDon: đóng phiếu, nạp lại phiếu + khoản */
                case 'dongPhieu': dongPhieu(); taiPhieu(); taiKhoan(); break;
                case 'huyPhieu': huyPhieu(); break;
                case 'xuatHD': moXuatHD(); break;
                case 'inPhieu': inPhieu(); break;
            }
        });
    }

    ums.nhThu = { man: man, xemTuDuLieu: xemTuDuLieu };
})();
