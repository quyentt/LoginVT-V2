/* =========================================================================
   Chương trình – học phần (soạn chương trình đào tạo)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/chuongtrinhhocphan/html/cthp.html (2.828 dòng)
            + script/cthp.js (6.235 dòng, lớp ChuongTrinhHocPhan, vỏ indexi)
   ---------------------------------------------------------------------------
   DÙNG LẠI bản đã chuyển của Tài chính (ApisTaiChinh/Modules/hoatdong/script/cthp.js
   — tệp gốc Tài chính là bản chép của chính màn này): thanh lọc Hệ · Khoá · từ khoá,
   danh sách chương trình và vùng "Xem CTDT" do ums.cthp.man(root, { khct: true })
   dựng. Tệp này dựng phần KHCT có thêm — vùng SOẠN chương trình và các vùng con.

   Bố cục gốc (các khối .zone-content thay chỗ nhau — edu.util.toggle_overide):
     list  "Tìm chương trình" + lưới hộp chương trình (Cập nhật CTDT / Xem CTDT) — tệp Tài chính
     view  "Chương trình học phần" (xem) — tệp Tài chính
     ct    "Nội dung học phần theo chương trình: <tên - khoá>" (Đóng) — HAI CỘT 9|3:
           trái  "Danh sách học phần" — đầu khung HAI HÀNG (gốc đổi 29/9):
                 hàng 1  tiêu đề + hai ô đánh dấu "mô hình" (khai tương đương / thay thế theo từng sinh viên)
                 hàng 2  Xóa học phần (dạt trái) | Học kỳ dự kiến · Cập nhật kỳ dự kiến ┃ Import ▾ ·
                         Kế thừa học phần · Chỉnh sửa thứ tự · Thêm học phần · Tải lại ↻
                 rồi lọc nhanh trong bảng; bảng + cột động theo loại phân bổ; phân trang máy khách; dòng tổng
           phải  cây "Các khối lựa chọn bắt buộc" · cây "Các khối lựa chọn đơn" · "Các định
                 hướng" (mỗi khung một nút Thêm) — thu gọn / mở lại được
     hp    "Chọn học phần cho chương trình"         → _khoi.js
     kbb   "Khối bắt buộc"                          → _khoi.js
     ktcd  "Khối tự chọn đơn"                       → _khoi.js
     sua   "Chỉnh sửa học phần" (+ quan hệ, tương đương, thay thế, bài học, phân bổ) → _sua.js
     kq    "Tình trạng học"                         → _sua.js
     dh    "Thêm mới / Chỉnh sửa - định hướng"      → _dinhhuong.js
   Hộp thoại (tệp này): Kế thừa (học phần từ chương trình khác), Sửa thời gian -1 (các học phần
   đã đánh dấu — thao tác hàng loạt).
   Biểu mẫu NGAY TRONG TRANG, thay chỗ vùng "ct" (pat.formTrang — BO-CUC luật 1, 2026-09-30; gốc là
   hộp thoại): Sửa thời gian (một học phần), Thứ tự học phần.

   Lời gọi (chép nguyên; GET/POST theo `type` của makeRequest gốc):
     KHCT_HocPhan_ChuongTrinh/LayDanhSach            GET  strDaoTao_ThoiGian_KH_Id = kỳ dự kiến lọc, pageSize 100000000
     KHCT_HocPhan_TietHoc/LayDanhSach                GET  số tiết từng loại phân bổ (cột động)
     KHCT_HocPhan_ChuongTrinh/Xoa                    POST strIds
     KHCT_HocPhan_ChuongTrinh/Sua_DaoTao_HocPhan_CT_ThuTu  POST (+ tham số type 'POST') iThuTu
     KHCT_KhoiBatBuoc/LayDanhSach · KHCT_KhoiTuChon_Don/LayDanhSach        GET (cây)
     KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong          GET  (+ type 'GET') — danh sách định hướng
     pkg_kehoach_thongtin2.LayDSPhanKyKeHoach        kỳ dự kiến (theo chương trình / theo học phần)
     pkg_kehoach_thongtin2.Sua_DaoTao_ThoiGian_KH_CT sửa thời gian (một / nhiều học phần)
     pkg_kehoach_thongtin2.CapNhatThuTuHocPhanTuDong "Cập nhật thứ tự theo kỳ dự kiến"
     PKG_KEHOACH_THONGTIN2.CapNhat_MoHinh_ChuongTrinh  POST  hai ô "mô hình" của chương trình (Pull 29/9)
         strDaoTao_ChuongTrinh_Id · dMoHinhTD_PhamVi · dMoHinhTT_PhamVi (1 / 0) · strNguoiThucHien_Id
         Đọc về: cột MOHINHTUONGDUONGTHEOPHAMVI / MOHINHTHAYTHETHEOPHAMVI của dòng chương trình
         (KHCT_ToChucChuongTrinh/LayDanhSach) — dò tên cột KHÔNG phân biệt hoa thường như gốc.
     pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_CT  học phần của chương trình nguồn (Kế thừa)
     pkg_kehoach_thongtin2.LayDSKhoiKienThuc · LayDSKyTheoChuongTrinh (Kế thừa)
     pkg_chung.LayIdHocKyTheoThuTu                   "Ánh xạ theo thứ tự kỳ"
     pkg_kehoach_thongtin.KeThua_DaoTao_HocPhan_CT   Kế thừa từng học phần đã đánh dấu
     ums.ref.heDaoTao / khoaDaoTao / chuongTrinh     (= edu.system.getList_*) ô lọc hộp Kế thừa
     Import: 4 mục cứng IMPORTWITHPROC_HPCT / _KCT / _KKTDH / _HPTD → ums.report.importChung
             (= showImportChungV2) + mẫu theo phân quyền (getList_MauImport "zonebtnHPCT")

   LỖI BẢN GỐC — làm theo ý định:
     · "Xem CTDT" không mở được vùng xem (thiếu lớp btnViewCT) — xem ghi chú ở tệp Tài chính.
     · Ô "Học kỳ dự kiến" không có trình xử lý — đổi ô không lọc gì tới khi bấm Tải lại.
       Nay đổi ô là tải lại danh sách học phần.
     · Hộp Kế thừa: hỏi lại TRƯỚC rồi mới kiểm có dòng đánh dấu (gốc ẩn hộp, hỏi, rồi mới báo
       "Vui lòng chọn đối tượng" — mất cả hộp). Nay kiểm trước, hỏi sau, không đóng hộp khi chưa chọn.
     · Xóa nhiều học phần: gốc bắn mỗi dòng một lời gọi, mỗi lời gọi tự báo + tải lại. Nay chạy
       tuần tự (ums.ui.batch), tải lại một lần.
     · Kỳ lọc "Kỳ" của hộp Kế thừa + cột "Học kỳ kế thừa" lấy theo CHƯƠNG TRÌNH ĐÍCH
       (LayDSKyTheoChuongTrinh với chương trình đang soạn — như gốc).
   PULL 29/9 (merge 5018e138) — gốc thêm hai ô đánh dấu "Có áp dụng khai tương đương / thay thế theo
   từng sinh viên" ở đầu khung Danh sách học phần và xếp lại nhóm nút thành hai hàng:
     · Đổi ô là LƯU NGAY (không nút Lưu, không hỏi lại — như gốc); đang lưu thì khoá cả hai ô; máy chủ
       từ chối / lỗi mạng thì trả ô về trạng thái cũ. Mỗi lần lưu gửi CẢ HAI giá trị.
     · Thay thế: gốc ghi chú "đặc tả = 2 thì Có nhưng lúc lưu gửi 1" → đọc về nhận cả 1 và 2, gửi đi 1.
     · Gốc chỉ cập nhật dòng chương trình đang nhớ khi dòng ĐÃ có cột; ở đây thiếu cột thì thêm cột
       (tên viết HOA) để đóng rồi mở lại chương trình vẫn đúng mà không phải Tìm kiếm lại.
     · Thứ tự nút theo gốc mới, trừ "Tải lại" vẫn là nút ↻ cuối nhóm (quy ước _v2); gốc đặt
       trước "Thêm học phần". Kiểu nút viên thuốc / bóng đổ của gốc là CSS hệ cũ — không chép.
   Khác gốc về cách dựng (không đổi nghiệp vụ):
     · Kéo thả, thanh cuộn ngang giả trên đầu bảng, lọc nhanh / phân trang bằng jQuery ẩn-hiện
       dòng → ums.ui.table + pat.loc + phân trang máy khách của ums.ui.pager.
     · "Xóa học phần" (nhiều dòng) = ums.ui.xoaChon; "Tải lại" = nút ↻ chuẩn, cuối nhóm.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat, K = ums.khctCt;
    var root = document.getElementById('cthp');
    if (!root || !K) return;
    var e = K.e, esc = K.esc, rows = K.rows;
    var TT2 = 'KHCT_ThongTin2_MH/', PK2 = 'pkg_kehoach_thongtin2.';

    /* Tệp Tài chính dựng danh sách + vùng xem; "Cập nhật CTDT" → moCT */
    K.api = ums.cthp.man(root, {
        khct: true,
        onSua: function (ct) { moCT(ct); },
        onKhoa: function (list) { K.dsKhoa = list; if (K.onKhoa) K.onKhoa(list); }
    });

    var IMP = [
        { chu: '1. Import Học phần', ma: 'IMPORTWITHPROC_HPCT', ten: 'Học phần' },
        { chu: '2. Import Khung chương trình', ma: 'IMPORTWITHPROC_KCT', ten: 'Khung' },
        { chu: '3. Import khối kiến thức và định hướng', ma: 'IMPORTWITHPROC_KKTDH', ten: 'khối' },
        { chu: '4. Import Học phần tương đương', ma: 'IMPORTWITHPROC_HPTD', ten: 'HP' }
    ];

    /* ---------- Vùng soạn chương trình ------------------------------------ */
    var V = K.vung('ct',
        pat.panel({ title: 'Nội dung học phần theo chương trình', icon: 'fa-book-open-reader', count: 'tenCT', cls: 'ums-u-mb-4 khct-dau',
            tools: ui.btn('close', { attr: { 'data-a': 'dongCT' } }) }) +
        '<div class="khct-cols ums-cols" data-z="cols">' +
            '<div class="khct-cols__trai">' +
                pat.panel({ title: 'Danh sách học phần', icon: 'fa-book-open-reader', count: 'tongHP', flush: true, cls: 'khct-hp',
                    /* Thứ tự theo gốc (pull 29/9): Xóa học phần dạt TRÁI | kỳ dự kiến + Cập nhật kỳ dự kiến ┃ các nút còn lại */
                    tools:
                        '<span class="khct-trai">' + ui.xoaChon('input[data-ck]', { goc: '.ums-panel', text: 'Xóa học phần', attr: { 'data-a': 'xoaHP' } }) + '</span>' +
                        '<div class="khct-ky"><select class="ums-select" data-f="kyDK" data-ph="Chọn kỳ dự kiến"><option value="">Chọn kỳ dự kiến</option></select></div>' +
                        ui.btn('edit', { text: 'Cập nhật kỳ dự kiến', mod: 'primary', attr: { 'data-a': 'kyAll' } }) +
                        '<span class="khct-sep" aria-hidden="true"></span>' +
                        '<span class="khct-bc" data-z="bc"></span>' +
                        '<span data-z="impCo">' + K.drop('Import', 'fa-cloud-arrow-up', IMP) + '</span>' +
                        ui.btn('add', { text: 'Kế thừa học phần', mod: 'out-primary', icon: 'fa-copy', attr: { 'data-a': 'keThua' } }) +
                        ui.btn('edit', { text: 'Chỉnh sửa thứ tự', mod: 'out-primary', attr: { 'data-a': 'thuTu' } }) +
                        ui.btn('add', { text: 'Thêm học phần', attr: { 'data-a': 'themHP' } }) +
                        ui.btn('reload', { attr: { 'data-a': 'taiLai' } }) +
                        '<button type="button" class="ums-iconbtn khct-thu" data-a="thuGon" title="Thu gọn / mở các khối lựa chọn"><i class="fa-light fa-angles-right"></i></button>',
                    body:
                        '<div class="khct-loc"><i class="fa-light fa-magnifying-glass"></i>' +
                            '<input class="ums-input" data-f="locNhanh" autocomplete="off" placeholder="Lọc nhanh trong bảng — gõ mã hoặc tên học phần (VD: FIDIC, IE6.008, Đồ án...)">' +
                            '<button type="button" class="ums-iconbtn" data-a="xoaLoc" title="Xóa bộ lọc"><i class="fa-light fa-xmark"></i></button>' +
                            '<span class="ums-u-faint ums-u-fz13" data-z="demLoc"></span></div>' +
                        '<div data-z="bangHP"></div><div data-z="tongHPfoot"></div>' }) +
            '</div>' +
            '<div class="khct-cols__phai">' +
                pat.panel({ title: 'Các khối lựa chọn bắt buộc', icon: 'fa-books', count: 'nKBB', zone: 'cayKBB', flush: true,
                    tools: ui.btn('add', { text: 'Thêm khối', mod: 'out-primary', attr: { 'data-a': 'themKBB' } }) }) +
                pat.panel({ title: 'Các khối lựa chọn đơn', icon: 'fa-books-medical', count: 'nKTCD', zone: 'cayKTCD', flush: true,
                    tools: ui.btn('add', { text: 'Thêm khối', mod: 'out-success', attr: { 'data-a': 'themKTCD' } }) }) +
                pat.panel({ title: 'Các định hướng', icon: 'fa-book', count: 'nDH', zone: 'cayDH', flush: true,
                    tools: ui.btn('add', { text: 'Thêm mới', mod: 'out-danger', attr: { 'data-a': 'themDH' } }) }) +
            '</div>' +
        '</div>');
    function z(k) { return V.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return V.querySelector('[data-f="' + k + '"]'); }

    /* ---------- Mô hình chương trình (pull 29/9) — hai ô đánh dấu cạnh tiêu đề khung ----------
       Gốc: .cthp-mohinh-bar nằm cùng hàng với tiêu đề "Danh sách học phần" (chkMoHinhTD_PhamVi /
       chkMoHinhTT_PhamVi + chữ Có / Không). pat.panel không có chỗ cho khối này nên chèn vào đầu
       khung, trước nhóm nút. */
    var MH = [
        { k: 'TD', cot: 'mohinhtuongduongtheophamvi', chu: 'Có áp dụng khai tương đương theo từng sinh viên' },
        { k: 'TT', cot: 'mohinhthaythetheophamvi', chu: 'Có áp dụng khai thay thế theo từng sinh viên' }
    ];
    (function () {
        var dau = V.querySelector('.khct-hp > .ums-panel__head'), nut = dau && dau.querySelector('.ums-panel__tools');
        if (!dau) return;
        var d = document.createElement('div');
        d.className = 'khct-mohinh';
        d.innerHTML = MH.map(function (m) {
            return '<label class="ums-check khct-mohinh__o"><input type="checkbox" data-f="mh' + m.k + '">' +
                '<span>' + esc(m.chu) + ': <b data-z="mh' + m.k + 'chu">Không</b></span></label>';
        }).join('');
        dau.insertBefore(d, nut || null);
    })();
    /* getFieldNoCase: máy chủ có thể trả tên cột hoa / thường */
    function cotKhongPhanBiet(o, ten) {
        if (!o) return undefined;
        var k = Object.keys(o).filter(function (x) { return x.toLowerCase() === ten; })[0];
        return k ? o[k] : undefined;
    }
    function datMoHinh(k, co) {                                  // setMoHinhCheck
        f('mh' + k).checked = !!co;
        z('mh' + k + 'chu').textContent = co ? 'Có' : 'Không';
    }
    function khoaMoHinh(khoa) { MH.forEach(function (m) { f('mh' + m.k).disabled = !!khoa; }); }
    function xemMoHinh(ct) {                                      // viewMoHinhChuongTrinh
        var td = parseInt(cotKhongPhanBiet(ct, MH[0].cot), 10), tt = parseInt(cotKhongPhanBiet(ct, MH[1].cot), 10);
        datMoHinh('TD', td === 1);
        datMoHinh('TT', tt === 1 || tt === 2);                    // gốc: đặc tả ghi 2, lúc lưu gửi 1 → nhận cả hai
        khoaMoHinh(false);
    }
    function luuMoHinh(k) {                                       // save_MoHinhChuongTrinh
        var co = f('mh' + k).checked;
        if (!K.ct || !K.ctId()) { datMoHinh(k, !co); return; }
        var ct = K.ct, td = f('mhTD').checked ? 1 : 0, tt = f('mhTT').checked ? 1 : 0;
        khoaMoHinh(true);
        ums.api.call({ action: TT2 + 'AiAxDykgNR4MLgkoLykeAik0Li8mFTMoLykP', func: 'PKG_KEHOACH_THONGTIN2.CapNhat_MoHinh_ChuongTrinh',
            method: 'POST', strDaoTao_ChuongTrinh_Id: K.ctId(), dMoHinhTD_PhamVi: td, dMoHinhTT_PhamVi: tt, strNguoiThucHien_Id: '' })
            .then(function () {
                /* nhớ vào dòng chương trình (cùng đối tượng với danh sách) để mở lại vẫn đúng */
                [[MH[0].cot, td], [MH[1].cot, tt]].forEach(function (x) {
                    var key = Object.keys(ct).filter(function (n) { return n.toLowerCase() === x[0]; })[0] || x[0].toUpperCase();
                    ct[key] = x[1];
                });
                if (K.ct !== ct) return;                          // đã sang chương trình khác trong lúc chờ
                khoaMoHinh(false);
                datMoHinh(k, co);
                ui.toast('Cập nhật thành công', 'ok');
            })
            .catch(function (err) {
                if (K.ct === ct) { khoaMoHinh(false); datMoHinh(k, !co); }
                ums.api.handle(err, 'cập nhật mô hình chương trình');
            });
    }

    /* Mẫu theo phân quyền (getList_MauImport "zonebtnHPCT"): gốc ghi đè cả vùng Import cứng khi
       vai trò có mẫu import → ở đây: có mẫu import thì ẩn nút Import cứng. */
    ums.report.mount(z('bc'), {
        onImported: function () { K.taiHP(); },
        onLoad: function (tpls) {
            var coImp = (tpls || []).some(function (t) { return /^(IMPORTWITHPROC|IMPORTALLINPUT)/i.test(String(e(t.MAUIMPORT_MA)).substring(0, 14)); });
            z('impCo').hidden = coImp;
        }
    });

    /* ---------- Mở một chương trình ---------------------------------------- */
    function moCT(ct) {
        K.ct = ct;
        z('tenCT').textContent = ': ' + e(ct.TENCHUONGTRINH) + ' - ' + e(ct.DAOTAO_KHOADAOTAO_TEN);
        K.dsHP = [];
        locQ = ''; f('locNhanh').value = ''; trang = 1;
        f('kyDK').value = ''; if (window.jQuery) jQuery(f('kyDK')).trigger('change.select2');
        xemMoHinh(ct);
        K.api.hien('ct');
        K.taiHP();
        K.taiKBB();
        K.taiKTCD();
        K.taiDH();
        taiKyDuKien();
        taiThoiGian();
    }

    /* Kỳ dự kiến của chương trình — getList_KyDuKien → dropSearch_HocKyDuKien + dropEditHocKyAll */
    K.dsKy = [];
    function taiKyDuKien() {
        return ums.api.call({ action: TT2 + 'DSA4BRIRKSAvCjgKJAkuICIp', func: PK2 + 'LayDSPhanKyKeHoach',
            strDaotao_Hocphan_CT_Id: K.ctId(), strNguoiThucHien_Id: '', silent: true })
            .then(function (r) { K.dsKy = rows(r); pat.fill(f('kyDK'), K.dsKy, { name: 'THOIGIAN', head: 'Chọn kỳ dự kiến' }); })
            .catch(function (err) { ums.api.handle(err, 'kỳ dự kiến'); });
    }
    /* Thời gian đào tạo (getList_ThoiGianDaoTao → Học kỳ dự kiến / thực tế của biểu mẫu sửa học phần) */
    K.dsTG = null;
    function taiThoiGian() {
        if (K.dsTG) return Promise.resolve(K.dsTG);
        return ums.ref.thoiGianDaoTao({ pageIndex: 1, pageSize: 100000 }).then(function (r) { K.dsTG = r; return r; })
            .catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); return []; });
    }
    K.taiThoiGian = taiThoiGian;

    /* ---------- Danh sách học phần của chương trình ------------------------ */
    var locQ = '', trang = 1, SIZE = 50, soTiet = {}, dsPB = [];
    K.taiHP = function () {
        if (!K.ct) return Promise.resolve();
        z('bangHP').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return Promise.all([
            ums.api.call({ action: 'KHCT_HocPhan_ChuongTrinh/LayDanhSach', method: 'GET',
                strTuKhoa: '', strDaoTao_ThoiGian_KH_Id: f('kyDK').value, strDaoTao_ThoiGian_TT_Id: '', strThuocTinhHocPhan_Id: '',
                strPhanCongPhamViDamNhiem_Id: '', strDaoTao_HocPhan_Id: '', strDaoTao_ChuongTrinh_Id: K.ctId(),
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 }),
            K.phanBo()
        ]).then(function (kq) {
            K.dsHP = rows(kq[0]);
            dsPB = kq[1] || [];
            soTiet = {};
            veHP();
            if (K.onHP) K.onHP(K.dsHP);            // ô "Học phần" của quan hệ học phần (genCombo_HocPhan_ChuongTrinh)
            if (K.dsHP.length) {
                /* getList_HocPhan_SoTiet(data[0].DAOTAO_TOCHUCCHUONGTRINH_ID) — số tiết mọi học phần × loại phân bổ */
                ums.api.call({ action: 'KHCT_HocPhan_TietHoc/LayDanhSach', method: 'GET', silent: true,
                    strTuKhoa: '', strDaoTao_HocPhan_Id: '', strDaoTao_ToChucCT_Id: e(K.dsHP[0].DAOTAO_TOCHUCCHUONGTRINH_ID) || K.ctId(),
                    strLoaiPhanBo_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 })
                    .then(function (r) {
                        rows(r).forEach(function (x) { soTiet[x.DAOTAO_HOCPHAN_ID + '_' + x.LOAIPHANBO_ID] = x.SOTIET; });
                        veHP();
                    }).catch(function (err) { ums.api.handle(err, 'số tiết phân bổ'); });
            }
        }).catch(function (err) { z('bangHP').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học phần'); });
    };

    function veHP() {
        var all = K.dsHP;
        var ds = pat.loc(all, locQ, ['DAOTAO_HOCPHAN_MA', 'DAOTAO_HOCPHAN_TEN', 'KHOIKIENTHUC', 'DAOTAO_THOIGIAN_KEHOACH', 'DAOTAO_THOIGIAN_THUCTE']);
        var n = ds.length, pages = Math.max(1, Math.ceil(n / SIZE));
        if (trang > pages) trang = 1;
        var cols = [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-center is-nowrap', width: '120px' },
            { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Khối KT', prop: 'KHOIKIENTHUC', cls: 'is-center' },
            { title: 'Số tín HP', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center', width: '100px' },
            { title: 'Số tín tính phí', prop: 'HOCTRINHAPDUNGTINHHOCPHI', cls: 'is-center', width: '110px' },
            { title: 'Học kỳ dự kiến', cls: 'is-center', width: '160px', render: function (r) {
                return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-ky="' + esc(r.ID) + '" title="Sửa thời gian">' +
                    '<i class="fa-light fa-pen-to-square"></i><span>' + esc(e(r.DAOTAO_THOIGIAN_KEHOACH) || 'Sửa') + '</span></button>';
            } },
            { title: 'Học kỳ thực tế', prop: 'DAOTAO_THOIGIAN_THUCTE', cls: 'is-center' }
        ];
        dsPB.forEach(function (pb) {
            cols.push({ title: e(pb.MA), cls: 'is-center', render: function (r) { return esc(e(soTiet[r.DAOTAO_HOCPHAN_ID + '_' + pb.ID])); } });
        });
        cols.push(
            { title: 'Chi tiết', cls: 'is-center is-actions', width: '72px', render: function (r) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-suahp="' + esc(r.ID) + '" title="Chỉnh sửa học phần"><i class="fa-light fa-pen-to-square"></i></button>';
            } },
            { title: 'Học tập', cls: 'is-center is-actions', width: '72px', render: function (r) {
                return '<button type="button" class="ums-iconbtn" data-kq="' + esc(r.ID) + '" title="Tình trạng học"><i class="fa-light fa-eye"></i></button>';
            } },
            { head: '<input type="checkbox" data-hpall title="Chọn tất cả">', cls: 'is-center is-actions', width: '44px', render: function (r) {
                return '<input type="checkbox" data-ck="' + esc(r.ID) + '">';
            } }
        );
        ui.table({
            el: z('bangHP'), rows: ds.slice((trang - 1) * SIZE, trang * SIZE), columns: cols,
            empty: locQ ? 'Không có học phần khớp bộ lọc' : 'Chương trình chưa có học phần',
            page: { index: trang, size: SIZE, total: n, sizes: [20, 50, 100, 'all'],
                onChange: function (p) { if (p >= 1 && p <= pages) { trang = p; veHP(); } },
                onSize: function (v) { SIZE = v; trang = 1; veHP(); } }
        });
        z('tongHP').textContent = all.length ? '(Tổng: ' + all.length + ' HP)' : '';
        z('demLoc').textContent = locQ ? n + '/' + all.length + ' HP' : '';
        var tin = all.reduce(function (a, r) { return a + (Number(r.HOCTRINHAPDUNGHOCTAP) || 0); }, 0);
        z('tongHPfoot').innerHTML = '<div class="ums-tablefoot"><span class="ums-tablefoot__sum">' +
            pat.footSum('Tổng số học phần', all.length) + pat.footSum('Tổng số tín chỉ', tin) +
            pat.footSum('Tổng số tín chỉ theo khối', all.length ? e(all[0].TONGSOTINCHITHEOKHOIKT) : '') + '</span></div>';
    }
    function daChon() {
        return Array.prototype.map.call(z('bangHP').querySelectorAll('tbody input[data-ck]:checked'), function (x) { return x.getAttribute('data-ck'); });
    }
    function timHP(id) { return K.dsHP.filter(function (x) { return x.ID === id; })[0]; }
    K.timHP = timHP;

    /* ---------- Cây khối / định hướng (cột phải) --------------------------- */
    K.taiKBB = function () {
        z('cayKBB').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'KHCT_KhoiBatBuoc/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDaoTao_KhoiBatBuoc_Cha_Id: '', strDaoTao_ToChucCT_Id: K.ctId(), strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                K.dsKBB = rows(r);
                z('nKBB').textContent = K.dsKBB.length ? '(' + K.dsKBB.length + ')' : '';
                z('cayKBB').innerHTML = K.cay(K.dsKBB, { cha: 'DAOTAO_KHOIBATBUOC_CHA_ID', attr: 'data-kbb', empty: 'Chưa có khối bắt buộc',
                    nhan: function (x) {
                        return esc(e(x.THUTU) + '. ' + e(x.TEN)) + ' <span class="khct-cay__so">(Tổng số HP: ' + esc(e(x.TONGSOHOCPHAN)) +
                            '; Tổng số TC: ' + esc(e(x.TONGSOTINCHI)) + ')</span>';
                    } });
                if (K.onKBB) K.onKBB(K.dsKBB);
            }).catch(function (err) { z('cayKBB').innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối bắt buộc'); });
    };
    K.taiKTCD = function () {
        z('cayKTCD').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'KHCT_KhoiTuChon_Don/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDaoTao_KTuChon_Don_Cha_Id: '', strDaoTao_ToChucCT_Id: K.ctId(), strLoaiLuaChon_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                K.dsKTCD = rows(r);
                z('nKTCD').textContent = K.dsKTCD.length ? '(' + K.dsKTCD.length + ')' : '';
                z('cayKTCD').innerHTML = K.cay(K.dsKTCD, { cha: 'DAOTAO_KHOITUCHON_DON_CHA_ID', attr: 'data-ktcd', empty: 'Chưa có khối tự chọn đơn',
                    /* gốc: khối có NHOM tô nền cam */
                    cls: function (x) { return x.NHOM ? 'khct-cay__nhom' : ''; },
                    nhan: function (x) {
                        var t = 'Tổng số HP: ' + e(x.TONGSOHP) + '; Tổng số TC: ' + e(x.TONGSOTC) + ';';
                        if (x.SOHOCPHANQUYDINH) t += ' Số HP bắt buộc: ' + e(x.SOHOCPHANQUYDINH) + ';';
                        if (x.SOTINCHIQUYDINH) t += ' Số TC bắt buộc: ' + e(x.SOTINCHIQUYDINH);
                        return esc(e(x.THUTU) + '. ' + e(x.TEN)) + ' <span class="khct-cay__so">(' + esc(t) + ')</span>';
                    } });
                if (K.onKTCD) K.onKTCD(K.dsKTCD);
            }).catch(function (err) { z('cayKTCD').innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối tự chọn đơn'); });
    };
    K.taiDH = function () {
        z('cayDH').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong', method: 'GET', type: 'GET',
            strTuKhoa: '', strDaoTao_ChuongTrinh_Id: K.ctId(), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                K.dsDH = rows(r);
                z('nDH').textContent = K.dsDH.length ? '(' + K.dsDH.length + ')' : '';
                /* gốc: loadToTreejs_data với parentId DAOTAO_KHOITUCHON_DON_CHA_ID (cột không có) → danh sách phẳng */
                z('cayDH').innerHTML = K.cay(K.dsDH, { attr: 'data-dh', empty: 'Chưa có định hướng',
                    nhan: function (x) { return esc(e(x.MA) + ' - ' + e(x.TEN)); } });
            }).catch(function (err) { z('cayDH').innerHTML = ui.fail(err.message); ums.api.handle(err, 'định hướng'); });
    };

    /* ---------- Biểu mẫu: Sửa thời gian (một học phần) — myModalEditHocKy -------
       Mở NGAY TRONG TRANG, thay chỗ vùng soạn chương trình (pat.formTrang — BO-CUC luật 1, rà hộp thoại
       2026-09-30; gốc là hộp thoại). Lưu xong mới đóng — trước đây hộp đóng ngay khi bấm, lưu lỗi là mất
       lựa chọn đang nhập. */
    function suaKy(hpct) {
        var dlg = pat.formTrang({ host: V, title: 'Sửa thời gian', icon: 'fa-pen-to-square',
            body: ui.field('Thời gian', '<select class="ums-select" multiple data-k="ky" data-ph="Chọn thời gian"></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var v = pat.val(d.body.querySelector('[data-k="ky"]'));
                ums.api.call({ action: TT2 + 'EjQgHgUgLhUgLh4VKS4oBiggLx4KCR4CFQPP', func: PK2 + 'Sua_DaoTao_ThoiGian_KH_CT',
                    strDaotao_Hocphan_CT_Id: hpct.ID, strDaoTao_ThoiGian_KH_Id: v, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Thực hiện thành công!', 'ok'); d.close(); K.taiHP(); })
                    .catch(function (err) { ums.api.handle(err, 'sửa thời gian'); });
                return false;
            } }] });
        var sel = dlg.body.querySelector('[data-k="ky"]');
        ums.api.call({ action: TT2 + 'DSA4BRIRKSAvCjgKJAkuICIp', func: PK2 + 'LayDSPhanKyKeHoach',
            strDaotao_Hocphan_CT_Id: hpct.ID, strNguoiThucHien_Id: '' })
            .then(function (r) {
                var ds = rows(r);
                pat.fill(sel, ds, { name: 'THOIGIAN' });
                /* genCombo_EditHocKy: chọn sẵn các kỳ TONTAI > 0 */
                if (window.jQuery) jQuery(sel).val(ds.filter(function (x) { return x.TONTAI > 0; }).map(function (x) { return x.ID; }))
                    .trigger('change.select2').trigger('ums:refresh');
            }).catch(function (err) { ums.api.handle(err, 'kỳ kế hoạch'); });
    }

    /* ---------- Hộp: Sửa thời gian -1 (nhiều học phần) — myModalEditHocKyAll */
    function suaKyAll() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var dlg = ui.dialog({ title: 'Sửa thời gian', icon: 'fa-pen-to-square', size: 'md',
            body: '<p class="ums-u-muted ums-u-fz13 ums-u-mb-3">Áp dụng cho ' + ids.length + ' học phần đã đánh dấu.</p>' +
                ui.field('Thời gian', '<select class="ums-select" multiple data-k="ky" data-ph="Chọn kỳ dự kiến"></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var v = pat.val(d.body.querySelector('[data-k="ky"]'));
                ui.batch(ids.map(function (id) {
                    return { action: TT2 + 'EjQgHgUgLhUgLh4VKS4oBiggLx4KCR4CFQPP', func: PK2 + 'Sua_DaoTao_ThoiGian_KH_CT',
                        strDaotao_Hocphan_CT_Id: id, strDaoTao_ThoiGian_KH_Id: v, strNguoiThucHien_Id: '' };
                }), { title: 'Đang cập nhật kỳ dự kiến', okText: 'Thực hiện thành công!' }).then(function () { K.taiHP(); });
            } }] });
        var sel = dlg.body.querySelector('[data-k="ky"]');
        pat.fill(sel, K.dsKy, { name: 'THOIGIAN' });
        ui.enhance(dlg.body);
    }

    /* ---------- Lưới nhập: Thứ tự học phần — myModalThuTu -------------------
       Mở NGAY TRONG TRANG, thay chỗ vùng soạn chương trình (pat.formTrang — BO-CUC luật 1, rà hộp thoại
       2026-09-30; gốc là hộp thoại). Lưu hết thành công mới đóng; còn ô lỗi thì ở lại, ô đã lưu được
       ghi nhận (data-cu) để bấm Lưu lần nữa chỉ gửi lại ô lỗi. */
    function thuTu() {
        var dlg = pat.formTrang({ host: V, title: 'Thêm mới - Thứ tự học phần', icon: 'fa-arrow-down-1-9', cols: 1,
            body: '<div class="ums-row ums-u-mb-3"><div class="ums-u-flex1"></div>' +
                ui.btn('edit', { text: 'Cập nhật thứ tự theo kỳ dự kiến', mod: 'out-primary', icon: 'fa-calendar-lines-pen', attr: { 'data-tt': 'tuDong' } }) + '</div>' +
                '<div data-tt="bang"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var doi = Array.prototype.filter.call(d.body.querySelectorAll('input[data-tt-id]'), function (x) {
                    return x.value !== x.getAttribute('data-cu');
                });
                if (!doi.length) { ui.toast('Chưa đổi thứ tự học phần nào.', 'warn'); return false; }
                ui.batch(doi.map(function (x) {
                    return function () {
                        var gui = x.value;
                        return ums.api.call({ action: 'KHCT_HocPhan_ChuongTrinh/Sua_DaoTao_HocPhan_CT_ThuTu', type: 'POST',
                            strId: x.getAttribute('data-tt-id'), strNguoiThucHien_Id: '', iThuTu: parseInt(gui, 10) })
                            .then(function (r) { x.setAttribute('data-cu', gui); return r; });
                    };
                }), { title: 'Đang lưu thứ tự', okText: 'Cập nhật thành công!' }).then(function (kq) {
                    if (!kq.fail) d.close();
                    K.taiHP();
                });
                return false;
            } }] });
        function ve() {
            ui.table({ el: dlg.body.querySelector('[data-tt="bang"]'), rows: K.dsHP, empty: 'Chương trình chưa có học phần',
                columns: [
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-center is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' },
                    { title: 'Thuộc tính', prop: 'THUOCTINHHOCPHAN_TEN', cls: 'is-center' },
                    { title: 'Tính điểm', prop: 'LAMONTINHDIEMTHEOCHUONGTRINH', cls: 'is-center' },
                    { title: 'Kỳ dự kiến kế hoạch', prop: 'THOIGIANDUKIEN', cls: 'is-center' },
                    { title: 'Thứ tự', cls: 'is-center', width: '110px', render: function (r) {
                        return '<input class="ums-input ums-input--sm khct-so" data-tt-id="' + esc(r.ID) + '" data-cu="' + esc(e(r.THUTU)) + '" value="' + esc(e(r.THUTU)) + '">';
                    } }
                ] });
        }
        ve();
        /* move_ThroughInTable: Enter / ↑ ↓ nhảy ô thứ tự */
        dlg.body.addEventListener('keydown', function (ev) {
            var t = ev.target.closest('input[data-tt-id]');
            if (!t || ['Enter', 'ArrowDown', 'ArrowUp'].indexOf(ev.key) < 0) return;
            var ds = Array.prototype.slice.call(dlg.body.querySelectorAll('input[data-tt-id]'));
            var i = ds.indexOf(t) + (ev.key === 'ArrowUp' ? -1 : 1);
            if (ds[i]) { ev.preventDefault(); ds[i].focus(); ds[i].select(); }
        });
        dlg.body.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-tt="tuDong"]')) return;
            ums.api.call({ action: TT2 + 'AiAxDykgNRUpNBU0CS4iESkgLxU0BS4vJgPP', func: 'PKG_KEHOACH_THONGTIN2.CapNhatThuTuHocPhanTuDong',
                strKieuCapNhat: '', strDaoTao_ChuongTrinh_Id: K.ctId(), strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Thực hiện thành công', 'ok'); return K.taiHP(); })
                .then(function () { if (!dlg.closed) ve(); })
                .catch(function (err) { ums.api.handle(err, 'cập nhật thứ tự theo kỳ dự kiến'); });
        });
    }

    /* ---------- Hộp: Kế thừa học phần — myModalKeThua ---------------------- */
    function keThua() {
        var dsKT = [], dsKy = [];
        function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-kt="' + k + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select></div>'; }
        var dlg = ui.dialog({ title: 'Kế thừa', icon: 'fa-copy', size: 'xl',
            body: '<div class="ums-filter khct-kt-loc">' +
                    sel('he', 'Chọn hệ đào tạo') + sel('khoa', 'Chọn khóa đào tạo') + sel('ct', 'Chọn chương trình') +
                    sel('khoi', 'Khối kiến thức') + sel('ky', 'Kỳ') +
                    '<div class="ums-field"><input class="ums-input" data-kt="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-kt': 'tim' } }) + '</div>' +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">Học phần</div>' +
                '<div class="ums-row ums-u-mb-3"><div class="khct-kt-fill">' + sel('fill', 'Kỳ kế thừa') + '</div><div class="ums-u-flex1"></div>' +
                    ui.btn('reload', { text: 'Ánh xạ theo thứ tự kỳ', mod: 'out-primary', icon: 'fa-arrows-rotate', attr: { 'data-kt': 'anhXa' } }) + '</div>' +
                '<div data-kt="bang"></div>',
            buttons: [{ text: 'Kế thừa', kind: 'save', icon: 'fa-copy', onClick: function (d) { return luuKeThua(d); } }] });
        var B = dlg.body;
        function k(n) { return B.querySelector('[data-kt="' + n + '"]'); }
        ui.enhance(B);
        k('bang').innerHTML = ui.empty('Chọn chương trình nguồn để xem học phần', 'fa-magnifying-glass');

        ums.ref.heDaoTao({ pageIndex: 1, pageSize: 100000 }).then(function (r) { pat.fill(k('he'), r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); })
            .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        /* getList_Ky_KT: kỳ theo CHƯƠNG TRÌNH ĐÍCH (như gốc) — ô "Kỳ", "Kỳ kế thừa" và cột chọn kỳ từng dòng */
        ums.api.call({ action: TT2 + 'DSA4BRIKOBUpJC4CKTQuLyYVMygvKQPP', func: PK2 + 'LayDSKyTheoChuongTrinh',
            strDaoTao_ChuongTrinh_Id: K.ctId(), strNguoiThucHien_Id: '', silent: true })
            .then(function (r) {
                dsKy = rows(r);
                pat.fill(k('ky'), dsKy, { name: 'THOIGIAN', head: 'Kỳ' });
                pat.fill(k('fill'), dsKy, { name: 'THOIGIAN', head: 'Kỳ kế thừa' });
            }).catch(function (err) { ums.api.handle(err, 'kỳ theo chương trình'); });

        function napKhoa() {
            if (!k('he').value) { pat.fill(k('khoa'), [], { head: 'Chọn khóa đào tạo' }); return; }
            ums.ref.khoaDaoTao({ strHeDaoTao_Id: k('he').value, pageIndex: 1, pageSize: 100000 })
                .then(function (r) { pat.fill(k('khoa'), r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); })
                .catch(function (err) { ums.api.handle(err, 'khoá đào tạo'); });
        }
        function napCT() {
            if (!k('khoa').value) { pat.fill(k('ct'), [], { head: 'Chọn chương trình' }); return; }
            ums.ref.chuongTrinh({ strDaoTao_HeDaoTao_Id: k('he').value, strKhoaDaoTao_Id: k('khoa').value, pageIndex: 1, pageSize: 10000 })
                .then(function (r) {
                    pat.fill(k('ct'), r, { name: function (x) { return e(x.TENCHUONGTRINH) + ' - ' + e(x.DAOTAO_N_CN_MA); }, head: 'Chọn chương trình' });
                }).catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
        }
        function napKhoi() {
            if (!k('ct').value) { pat.fill(k('khoi'), [], { head: 'Khối kiến thức' }); return; }
            ums.api.call({ action: TT2 + 'DSA4BRIKKS4oCigkLxUpNCIP', func: PK2 + 'LayDSKhoiKienThuc',
                strDaoTao_ChuongTrinh_Id: k('ct').value, strNguoiThucHien_Id: '', silent: true })
                .then(function (r) { pat.fill(k('khoi'), rows(r), { name: 'TEN', head: 'Khối kiến thức' }); })
                .catch(function (err) { ums.api.handle(err, 'khối kiến thức'); });
        }
        function napHP() {
            if (!k('ct').value) { dsKT = []; k('bang').innerHTML = ui.empty('Chọn chương trình nguồn để xem học phần', 'fa-magnifying-glass'); return; }
            k('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLx4CFQPP', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_CT',
                strTuKhoa: k('q').value.trim(), strDaoTao_ThoiGian_KH_Id: k('ky').value, strDaoTao_ThoiGian_TT_Id: '',
                strThuocTinhHocPhan_Id: '', strPhanCongPhamViDamNhiem_Id: '', strDaoTao_HocPhan_Id: '',
                strDaoTao_ChuongTrinh_Id: k('ct').value, strDaoTao_KhoiKienThuc_Id: k('khoi').value,
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (r) { dsKT = rows(r); veKT(); })
                .catch(function (err) { k('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần kế thừa'); });
        }
        function veKT() {
            ui.table({ el: k('bang'), rows: dsKT, empty: 'Không có học phần',
                columns: [
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' },
                    { title: 'Khối', prop: 'KHOIKIENTHUC', cls: 'is-center' },
                    { title: 'Học kỳ', prop: 'DAOTAO_THOIGIAN_KEHOACH', cls: 'is-center' },
                    { title: 'Học kỳ kế thừa', width: '200px', render: function (r) {
                        return '<select class="ums-select ums-input--sm" data-kyrow="' + esc(r.ID) + '"><option value="">Chọn kỳ kế thừa</option>' +
                            dsKy.map(function (x) {
                                return '<option value="' + esc(x.ID) + '"' + (x.ID === r.DAOTAO_THOIGIAN_KEHOACH_ID ? ' selected' : '') + '>' + esc(e(x.THOIGIAN)) + '</option>';
                            }).join('') + '</select>';
                    } },
                    { head: '<input type="checkbox" data-ktall title="Chọn tất cả">', cls: 'is-center is-actions', width: '44px', render: function (r) {
                        return '<input type="checkbox" data-ktck="' + esc(r.ID) + '">';
                    } }
                ] });
        }
        function luuKeThua() {
            var ids = Array.prototype.map.call(B.querySelectorAll('input[data-ktck]:checked'), function (x) { return x.getAttribute('data-ktck'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
            var ctNguon = k('ct'), tenNguon = ctNguon.options[ctNguon.selectedIndex] ? ctNguon.options[ctNguon.selectedIndex].text : '';
            ui.confirm('Bạn có muốn kế thừa chương trình "' + e(K.ct.TENCHUONGTRINH) + ' - ' + e(K.ct.DAOTAO_KHOADAOTAO_TEN) +
                '" từ chương trình "' + tenNguon + '" không?', { title: 'Kế thừa', ok: 'Kế thừa' }).then(function (yes) {
                if (!yes) return;
                var calls = ids.map(function (id) {
                    var s = B.querySelector('[data-kyrow="' + id + '"]');
                    return { action: 'KHCT_ThongTin_MH/CiQVKTQgHgUgLhUgLh4JLiIRKSAvHgIV', func: 'pkg_kehoach_thongtin.KeThua_DaoTao_HocPhan_CT',
                        strId: '', strChuongTrinhNguon_Id: ctNguon.value, strDaoTao_ThoiGian_KH_Id: s ? s.value : '',
                        strChuongTrinhDich_Id: K.ctId(), strNguoiThucHien_Id: '', strDaoTao_HocPhanNguon_Id: id };
                });
                dlg.close();
                ui.batch(calls, { title: 'Đang kế thừa học phần', okText: 'Kế thừa thành công' }).then(function () {
                    K.taiHP(); K.taiKBB(); K.taiKTCD();
                });
            });
            return false;
        }

        if (window.jQuery) {
            jQuery(k('he')).on('select2:select select2:clear', napKhoa);
            jQuery(k('khoa')).on('select2:select select2:clear', napCT);
            jQuery(k('ct')).on('select2:select select2:clear', function () { napHP(); napKhoi(); });
            jQuery(k('khoi')).on('select2:select select2:clear', napHP);
            jQuery(k('ky')).on('select2:select select2:clear', napHP);
            /* dropKy_KT_Fill: đặt cùng một kỳ kế thừa cho mọi dòng */
            jQuery(k('fill')).on('select2:select', function () {
                var v = k('fill').value;
                Array.prototype.forEach.call(B.querySelectorAll('select[data-kyrow]'), function (s) { s.value = v; });
            });
        }
        pat.chain([k('he'), k('khoa'), k('ct'), k('khoi')], { phatLai: false });
        pat.chain([k('ct'), k('ky')], { phatLai: false });
        k('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); napHP(); } });
        B.addEventListener('change', function (ev) {
            var a = ev.target.closest('[data-ktall]');
            if (a) Array.prototype.forEach.call(B.querySelectorAll('input[data-ktck]'), function (x) { x.checked = a.checked; });
        });
        B.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-kt="tim"]')) { napHP(); return; }
            if (!ev.target.closest('[data-kt="anhXa"]')) return;
            /* getList_KetQuaKy: mỗi dòng một lời gọi, đặt kỳ kế thừa = IDHOCKY trả về */
            if (!dsKT.length) return;
            ui.batch(dsKT.map(function (r) {
                return function () {
                    return ums.api.call({ action: 'CMS_Chung_MH/DSA4CCUJLiIKOBUpJC4VKTQVNAPP', func: 'pkg_chung.LayIdHocKyTheoThuTu',
                        dThuTu: r.DAOTAO_THOIGIAN_KEHOACH_THUTU ? r.DAOTAO_THOIGIAN_KEHOACH_THUTU : undefined,
                        strDaoTao_ChuonTrinhDich_Id: K.ctId(), strNguoiThucHien_Id: '', silent: true })
                        .then(function (res) {
                            var d = rows(res);
                            var s = B.querySelector('[data-kyrow="' + r.ID + '"]');
                            if (d.length && s) s.value = d[0].IDHOCKY;
                        });
                };
            }), { title: 'Đang ánh xạ kỳ', concurrency: 4, okText: 'Đã ánh xạ' });
        });
    }

    /* ---------- Sự kiện ------------------------------------------------------ */
    if (window.jQuery) jQuery(f('kyDK')).on('select2:select select2:clear', function () { trang = 1; K.taiHP(); });
    var henLoc = 0;
    f('locNhanh').addEventListener('input', function () {
        clearTimeout(henLoc);
        henLoc = setTimeout(function () { locQ = f('locNhanh').value; trang = 1; veHP(); }, 200);
    });
    V.addEventListener('change', function (ev) {
        var a = ev.target.closest('[data-hpall]');
        if (a) Array.prototype.forEach.call(z('bangHP').querySelectorAll('tbody input[data-ck]'), function (x) { x.checked = a.checked; });
        var m = ev.target.closest('input[data-f="mhTD"], input[data-f="mhTT"]');
        if (m) luuMoHinh(m.getAttribute('data-f').slice(2));
    });
    V.addEventListener('click', function (ev) {
        var t = ev.target;
        var b = t.closest('.ums-drop__toggle');
        if (b && z('impCo').contains(b)) { K.batDrop(b); return; }
        b = t.closest('[data-imp]');
        if (b && V.contains(b)) {
            K.dongDrop(b);
            var m = IMP[Number(b.getAttribute('data-imp'))];
            if (m) ums.report.importChung(m.ten, m.ma, { onDone: function () { K.taiHP(); } });
            return;
        }
        if ((b = t.closest('[data-ky]'))) { var r1 = timHP(b.getAttribute('data-ky')); if (r1) suaKy(r1); return; }
        if ((b = t.closest('[data-suahp]'))) { var r2 = timHP(b.getAttribute('data-suahp')); if (r2 && K.moSuaHP) K.moSuaHP(r2); return; }
        if ((b = t.closest('[data-kq]'))) { var r3 = timHP(b.getAttribute('data-kq')); if (r3 && K.moKetQua) K.moKetQua(r3); return; }
        if ((b = t.closest('[data-kbb]'))) { var r4 = K.dsKBB.filter(function (x) { return x.ID === b.getAttribute('data-kbb'); })[0]; if (r4 && K.moKBB) K.moKBB(r4); return; }
        if ((b = t.closest('[data-ktcd]'))) { var r5 = K.dsKTCD.filter(function (x) { return x.ID === b.getAttribute('data-ktcd'); })[0]; if (r5 && K.moKTCD) K.moKTCD(r5); return; }
        if ((b = t.closest('[data-dh]'))) { var r6 = K.dsDH.filter(function (x) { return x.ID === b.getAttribute('data-dh'); })[0]; if (r6 && K.moDH) K.moDH(r6); return; }
        b = t.closest('[data-a]');
        if (!b || !V.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'dongCT') { K.api.hien('list'); }
        else if (a === 'taiLai') K.taiHP();
        else if (a === 'themHP') { if (K.moChonHP) K.moChonHP(); }
        else if (a === 'keThua') keThua();
        else if (a === 'thuTu') thuTu();
        else if (a === 'kyAll') suaKyAll();
        else if (a === 'xoaLoc') { f('locNhanh').value = ''; locQ = ''; trang = 1; veHP(); f('locNhanh').focus(); }
        else if (a === 'themKBB') { if (K.moKBB) K.moKBB(null); }
        else if (a === 'themKTCD') { if (K.moKTCD) K.moKTCD(null); }
        else if (a === 'themDH') { if (K.moDH) K.moDH(null); }
        else if (a === 'thuGon') {
            var thu = z('cols').classList.toggle('is-thu');
            b.querySelector('i').className = 'fa-light ' + (thu ? 'fa-angles-left' : 'fa-angles-right');
        }
        else if (a === 'xoaHP') {
            var ids = daChon();
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa ' + ids.length + ' học phần khỏi chương trình?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) { return { action: 'KHCT_HocPhan_ChuongTrinh/Xoa', strIds: id, strNguoiThucHien_Id: '' }; }),
                    { title: 'Đang xoá học phần', okText: 'Xóa dữ liệu thành công!' }).then(function () { K.taiHP(); });
            });
        }
    });
})();
