/* =========================================================================
   Hệ thống một cửa của sinh viên — xin xác nhận giấy tờ
   (Cổng sinh viên, vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/thutuchanhchinh/html/xinxacnhan.html + script/xinxacnhan.js (vỏ index).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc, MỘT cột:
     · trang mở đầu "Chào mừng… HỆ THỐNG MỘT CỬA CỦA SINH VIÊN" + nút "Bắt đầu";
     · ô chọn "Chọn phân loại" + dải tab: "Các Dịch vụ" · "Thông tin đã gửi" (kèm số)
       · một tab cho mỗi TÌNH TRẠNG XỬ LÝ (biểu tượng lấy từ cột TENANH, kèm số);
     · thân tab là LƯỚI THẺ (dashboad-item của gốc) — thẻ dịch vụ, thẻ yêu cầu;
     · biểu mẫu khai giấy tờ thay chỗ danh sách ngay trong trang.

   Lời gọi (chép nguyên action / func / tên tham số):
     SV_HCMC_Chung_MH · pkg_hanhchinhmotcua_chung.
        LayDSMotCua_DanhMuc_PhanLoai   (strQLSV_NguoiHoc_Id)                  → ô "Chọn phân loại"
        LayDSDanhMucMoRong             (strQLSV_NguoiHoc_Id, strMotCua_DanhMuc_Id, strDuongDanFile)
                                        → các ô tự nhập của giấy tờ; Data.Id = tệp kết quả (iframe)
     SV_MotCua_ThongTin_MH · pkg_hanhchinhmotcua_thongtin.
        LayDSMotCua_DanhMuc            (strQLSV_NguoiHoc_Id, strPhanLoai_Id)  → tab "Các Dịch vụ"
        LayDSYeuCauChuaXuLy            (strQLSV_NguoiHoc_Id, strPhanLoai_Id)  → tab "Thông tin đã gửi"
        LayDSYeuCauTheoTinhTrangXuLy   (+ strTinhTrangXuLy_Id)                → tab từng tình trạng
        Them_MotCua_NguoiHoc_YeuCau / (action khác khi có strId) → gửi yêu cầu
        Them_MotCua_DanhMuc_DuLieu     (mỗi ô tự nhập một lời gọi)
        Xoa_MotCua_NguoiHoc_YeuCau     (strIds)
     SV_HCMC_ThongTin_MH · pkg_hanhchinhmotcua_thongtin.
        DanhGia_MotCua_NguoiHoc_YeuCau (strId = MOTCUA_NGUOIHOC_YEUCAU_ID, strDanhGiaChatLuong_Id)
        LayDSMotCua_NH_YC_XL_PhanHoi / Them_… / Xoa_…   (khối trao đổi trong thẻ)
     SV_DVMC_Chung_MH · pkg_dvmc_chung.LayDSTinhTrangXuLy → danh sách tab tình trạng
     Danh mục MOTCUA_DANHGIA_CHATLUONG → số sao (cột MA) ↔ id đánh giá.
     strNguoiThucHien_Id / strChucNang_Id = edu.system.* ở gốc → api.js tự điền.

   Giữ như bản gốc (ô KHÔNG tồn tại trong HTML gốc → gửi chuỗi rỗng, đúng giá trị
   thật bản gốc đang gửi): dSoLuong (txtSoLuong…), strMoTa (txtGhiChu…),
   strDanhGiaChatLuong_Id (dropAAAA), strSoDienThoaiNguoiNhan / strDiaChiNguoiNhan /
   strEmailNguoiNhan (txtDienThoai / txtDiaChi / txtEmail), strNhanXet của DanhGia
   (txtAAAA), và strId của Them_MotCua_DanhMuc_DuLieu (txtAAAA → luôn dùng action
   "Thêm", không bao giờ vào nhánh "Sửa").

   Khác bản gốc:
     · Mở biểu mẫu bằng nút biểu tượng trên thẻ (Sửa / Xem) thay vì bấm cả dải tiêu đề
       thẻ — vì trong thẻ có ô nhập của khối trao đổi, bấm vào ô đó ở gốc cũng mở luôn
       biểu mẫu. Nút Xoá vẫn là thùng rác trên thẻ như gốc.
     · Biểu mẫu khai giấy tờ nằm TRONG TRANG (thay chỗ danh sách) chứ không phải hộp
       thoại — luật chung của bản mới cho bản ghi chính.
     · Lưu các ô tự nhập chạy tuần tự qua ums.ui.batch (gốc bắn N lời gọi song song).
     · Thẻ không còn 8 màu nền luân phiên (arrMau) — chỉ tiêu đề thẻ đậm như mọi lưới thẻ khác.
     · Khung kết quả (iframe) chỉ hiện ở chế độ XEM; gốc hiện rồi không tắt lại nữa.
     · Bỏ ảnh nền trang mở đầu (assets/images/1CuaSV/1CuaSV-0.png — tài nguyên của vỏ cũ).
     · Bỏ hàm chết của gốc: delete_GiayTo (không nút nào gọi), save_TaoFile (SV_MotCua_File/TaoFile
       — lời gọi bị chú thích), toggle_form/toggle_edit/rewrite trỏ tới vùng không tồn tại.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.ttc;
    var e = T.e, esc = T.esc, arr = T.arr, SV = T.sv();
    var root = document.getElementById('ttc-xinxacnhan');

    var TT = 'SV_MotCua_ThongTin_MH/';   // pkg_hanhchinhmotcua_thongtin
    var HC = 'SV_HCMC_Chung_MH/';        // pkg_hanhchinhmotcua_chung
    var HT = 'SV_HCMC_ThongTin_MH/';     // pkg_hanhchinhmotcua_thongtin (đánh giá / phản hồi)
    var DV = 'SV_DVMC_Chung_MH/';        // pkg_dvmc_chung

    var dtGiayTo = [], dtChoXacNhan = [], dsTinhTrang = [], dtTheoTT = {}, dmDanhGia = [];
    var tab = 'dv';
    var form = null;      // { danhMucId, ten, yeuCauId, xem }

    /* Biểu tượng của tab lấy từ cột TENANH (FA4 / FA5) → tên FA7 (ui.tabs tự thêm "fa-light") */
    function icon(t) {
        t = String(t || '').trim();
        if (!t) return 'fa-gears';                                     // gốc: 'fal fa-cogs'
        t = t.replace(/^(fal|far|fas|fab|fa-light|fa-regular|fa-solid|fa-brands|fa-thin)\s+/, 'fa ');
        var s = ums.iconFA4(t) || '';
        return s.replace(/^fa-(light|regular|solid|thin|brands)\s+/, '') || 'fa-gears';
    }
    function soChu(n) { return n === null || n === undefined ? '' : ' (' + n + ')'; }

    root.innerHTML =
        '<div data-z="vMo">' +
            pat.page('Hệ thống một cửa của sinh viên', '') +
            pat.panel({ title: false, body:
                '<div class="ttc-mo">' +
                    '<i class="fa-light fa-address-book ttc-mo__icon"></i>' +
                    '<div class="ttc-mo__h2">Chào mừng bạn đến với chức năng</div>' +
                    '<h2 class="ttc-mo__h1">HỆ THỐNG MỘT CỬA CỦA SINH VIÊN</h2>' +
                    ui.btn('search', { text: 'Bắt đầu', icon: 'fa-address-book', attr: { 'data-a': 'batdau' } }) +
                '</div>' }) +
        '</div>' +
        '<div data-z="vChinh" hidden>' +
            pat.page('Hệ thống 1 cửa sinh viên', '') +
            pat.filterBar([{ key: 'pl', type: 'select', label: 'Chọn phân loại' }], { search: false }) +
            '<div data-z="tabs"></div>' +
            '<div class="ums-u-mt-4" data-z="than"></div>' +
        '</div>' +
        '<div data-z="vForm" hidden></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function vPl() { return f('pl') ? f('pl').value : ''; }

    /* ===================================================================
       Dải tab
       =================================================================== */
    function veTabs() {
        var list = [{ key: 'dv', text: 'Các Dịch vụ', icon: 'fa-gears' },
            { key: 'dagui', text: 'Thông tin đã gửi' + soChu(dtChoXacNhan.length), icon: 'fa-alarm-clock' }]
            .concat(dsTinhTrang.map(function (t) {
                var r = dtTheoTT[t.ID];
                return { key: 'tt:' + t.ID, text: e(t.TEN) + soChu(r ? r.length : null), icon: icon(t.TENANH) };
            }));
        z('tabs').innerHTML = ui.tabs(list, tab, 'data-xtab');
    }
    function doiTab(k) {
        tab = k;
        ui.tabsActive(z('tabs'), k, 'data-xtab');
        veThan();
    }
    function veThan() {
        if (tab === 'dv') return veDichVu();
        if (tab === 'dagui') return veYeuCau(dtChoXacNhan, 'dagui');
        var id = tab.slice(3);
        if (!dtTheoTT[id]) { z('than').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); taiTheoTinhTrang(id); return; }
        veYeuCau(dtTheoTT[id], 'tt');
    }

    /* ===================================================================
       Thân tab — lưới thẻ
       =================================================================== */
    /* pat.cards gắn trình xử lý click lên CHÍNH phần tử nhận thẻ; vẽ lại nhiều lần
       trên cùng một phần tử là chồng trình xử lý → dựng khung con mới mỗi lần vẽ. */
    function khungMoi() { var h = z('than'); h.innerHTML = '<div></div>'; return h.firstChild; }

    function veDichVu() {
        pat.cards({
            el: khungMoi(), items: dtGiayTo, empty: 'Chưa có dịch vụ nào', emptyIcon: 'fa-folder-open',
            title: function (r) { return e(r.TEN); },
            render: function (r) {
                return '<div class="ttc-dv__anh">' +
                    (r.MOTCUA_DANHMUC_TENANH ? '<img src="' + esc(e(r.MOTCUA_DANHMUC_TENANH)) + '" alt="' + esc(e(r.MA)) + '">'
                        : '<i class="fa-light fa-file-lines"></i>') +
                    '</div><div class="ttc-dv__ten">' + esc(e(r.TEN)) + '</div>';
            },
            onPick: function (r) { moForm({ danhMucId: r.ID, ten: e(r.TEN), yeuCauId: '' }); }
        });
        z('than').insertAdjacentHTML('beforeend',
            '<p class="ums-u-faint ums-u-fz13 ums-u-mt-3">Các bạn chọn các dịch vụ của hệ thống 1 cửa sinh viên</p>');
    }

    function veYeuCau(rows, kieu) {
        pat.cards({
            el: khungMoi(), items: rows, cls: 'ttc-cards--yc',
            empty: kieu === 'dagui' ? 'Chưa gửi yêu cầu nào' : 'Không có yêu cầu ở tình trạng này',
            emptyIcon: 'fa-inbox',
            render: function (r) {
                return '<span class="ums-card__no">' + esc(e(r.MOTCUA_DANHMUC_TEN)) + '</span>' +
                    (r.SOTIEN ? pat.cardRow('Số tiền', ui.money(r.SOTIEN) + ' vnđ') : '') +
                    pat.cardRow('Thời gian', e(kieu === 'tt' ? r.NGAYXULY_DD_MM_YYYY_HHMMSS : r.NGAYTAO_DD_MM_YYYY)) +
                    pat.cardRow('Mô tả', e(r.NHANXET)) +
                    (kieu === 'tt' ? '<div data-rate="' + esc(e(r.ID)) + '"></div>' : '') +
                    '<div data-tn="' + esc(e(r.ID)) + '"></div>';
            },
            actions: function (r) {
                return kieu === 'tt' ? ui.iconBtn('view', r.ID) : ui.actions(r.ID, ['edit', 'del']);
            }
        });
        rows.forEach(function (r) {
            var tn = z('than').querySelector('[data-tn="' + e(r.ID) + '"]');
            if (tn) T.binhLuan(tn, {
                load: function () { return taiTinNhan(r.ID); },
                them: function (s) { return themTinNhan(r.ID, s); },
                xoa: function (id) { return xoaTinNhan(id); }
            });
            var rt = z('than').querySelector('[data-rate="' + e(r.ID) + '"]');
            if (rt) T.sao(rt, { value: r.DANHGIACHATLUONG_MA, onPick: function (n) { chamSao(r, n); } });
        });
    }

    /* ===================================================================
       Nạp dữ liệu
       =================================================================== */
    function taiPhanLoai() {
        return ums.api.call({ action: HC + 'DSA4BRIMLjUCNCAeBSAvKQw0Ih4RKSAvDS4gKAPP',
            func: 'pkg_hanhchinhmotcua_chung.LayDSMotCua_DanhMuc_PhanLoai', strQLSV_NguoiHoc_Id: SV })
            .then(function (r) { pat.fill(f('pl'), arr(r.data), { head: 'Chọn phân loại' }); })
            .catch(function (err) { ums.api.handle(err, 'phân loại dịch vụ'); });
    }
    function taiDichVu() {
        return ums.api.call({ action: TT + 'DSA4BRIMLjUCNCAeBSAvKQw0IgPP', func: 'pkg_hanhchinhmotcua_thongtin.LayDSMotCua_DanhMuc',
            strQLSV_NguoiHoc_Id: SV, strPhanLoai_Id: vPl() })
            .then(function (r) { dtGiayTo = arr(r.data); if (tab === 'dv') veThan(); })
            .catch(function (err) { dtGiayTo = []; if (tab === 'dv') z('than').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách dịch vụ'); });
    }
    function taiChoXacNhan() {
        return ums.api.call({ action: TT + 'DSA4BRIYJDQCIDQCKTQgGTQNOAPP', func: 'pkg_hanhchinhmotcua_thongtin.LayDSYeuCauChuaXuLy',
            strQLSV_NguoiHoc_Id: SV, strPhanLoai_Id: vPl() })
            .then(function (r) { dtChoXacNhan = arr(r.data); veTabs(); if (tab === 'dagui') veThan(); })
            .catch(function (err) { dtChoXacNhan = []; veTabs(); ums.api.handle(err, 'thông tin đã gửi'); });
    }
    function taiTinhTrang() {
        return ums.api.call({ action: DV + 'DSA4BRIVKC8pFTMgLyYZNA04', func: 'pkg_dvmc_chung.LayDSTinhTrangXuLy',
            strQLSV_NguoiHoc_Id: SV, strPhanLoai_Id: vPl() })
            .then(function (r) {
                dsTinhTrang = arr(r.data);
                dtTheoTT = {};
                if (tab.indexOf('tt:') === 0) tab = 'dv';
                veTabs();
                // Bản gốc nạp sẵn từng tình trạng để hiện SỐ trên tab
                dsTinhTrang.forEach(function (t) { taiTheoTinhTrang(t.ID, true); });
            })
            .catch(function (err) { dsTinhTrang = []; veTabs(); ums.api.handle(err, 'tình trạng xử lý'); });
    }
    function taiTheoTinhTrang(id, ngam) {
        return ums.api.call({ action: TT + 'DSA4BRIYJDQCIDQVKSQuFSgvKRUzIC8mGTQNOAPP', silent: !!ngam,
            func: 'pkg_hanhchinhmotcua_thongtin.LayDSYeuCauTheoTinhTrangXuLy',
            strQLSV_NguoiHoc_Id: SV, strPhanLoai_Id: vPl(), strTinhTrangXuLy_Id: id })
            .then(function (r) {
                dtTheoTT[id] = arr(r.data);
                veTabs();
                if (tab === 'tt:' + id) veThan();
            })
            .catch(function (err) { dtTheoTT[id] = []; veTabs(); if (!ngam) ums.api.handle(err, 'yêu cầu theo tình trạng'); });
    }
    function taiTatCa() { taiTinhTrang(); taiDichVu(); taiChoXacNhan(); }

    /* ---------- Khối trao đổi ------------------------------------------- */
    function taiTinNhan(id) {
        return ums.api.call({ action: HT + 'DSA4BRIMLjUCNCAeDwkeGAIeGQ0eESkgLwkuKAPP', silent: true,
            func: 'pkg_hanhchinhmotcua_thongtin.LayDSMotCua_NH_YC_XL_PhanHoi', strMotCua_NH_YC_XuLy_Id: id })
            .then(function (r) { return arr(r.data); });
    }
    function themTinNhan(id, noiDung) {
        return ums.api.call({ action: HT + 'FSkkLB4MLjUCNCAeDwkeGAIeGQ0eESkgLwkuKAPP',
            func: 'pkg_hanhchinhmotcua_thongtin.Them_MotCua_NH_YC_XL_PhanHoi',
            strMotCua_NH_YC_XuLy_Id: id, strNoiDung: noiDung })
            .catch(function (err) { ums.api.handle(err, 'gửi thông tin trao đổi'); });
    }
    function xoaTinNhan(id) {
        return ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad' }).then(function (yes) {
            if (!yes) return Promise.reject();
            return ums.api.call({ action: HT + 'GS4gHgwuNQI0IB4PCR4YAh4ZDR4RKSAvCS4o',
                func: 'pkg_hanhchinhmotcua_thongtin.Xoa_MotCua_NH_YC_XL_PhanHoi', strId: id })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'xoá thông tin trao đổi'); });
        }, function () {});
    }

    /* ---------- Chấm sao ------------------------------------------------ */
    function chamSao(row, n) {
        var obj = dmDanhGia.filter(function (d) { return String(e(d.MA)) === String(n); })[0];
        if (!obj) { ui.toast('Chưa khai mức đánh giá tương ứng ' + n + ' sao', 'warn'); return; }
        ums.api.call({ action: HT + 'BSAvKQYoIB4MLjUCNCAeDyY0LigJLiIeGCQ0AiA0',
            func: 'pkg_hanhchinhmotcua_thongtin.DanhGia_MotCua_NguoiHoc_YeuCau',
            strId: row.MOTCUA_NGUOIHOC_YEUCAU_ID, strDanhGiaChatLuong_Id: obj.ID, strNhanXet: '' })
            .then(function () { row.DANHGIACHATLUONG_MA = String(n); })
            .catch(function (err) { ums.api.handle(err, 'đánh giá chất lượng'); });
    }

    /* ===================================================================
       Biểu mẫu khai giấy tờ
       =================================================================== */
    function moForm(cfg) {
        form = cfg;
        var xem = !!cfg.xem;
        z('vForm').innerHTML =
            pat.page('Hệ thống 1 cửa sinh viên', '') +
            pat.panel({
                title: cfg.ten || 'Giấy tờ', icon: 'fa-file-lines',
                tools: ui.btn('close', { attr: { 'data-a': 'dongForm' } }) +
                (xem ? '' : ui.btn('save', { text: 'Gửi thông tin', attr: { 'data-a': 'gui' } })),
                                    body: '<div data-z="kq" hidden></div>' +
                    '<div data-z="oNhap"' + (xem ? ' hidden' : '') + '>' +
                        '<div class="ums-grid ums-grid--2" data-z="fields">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                        '<div data-z="nhanxet" hidden class="ums-u-mt-3"></div>' +
                    '</div>'
            });
        ui.swap(z('vChinh'), z('vForm'), { top: true });
        taiONhap();
    }
    function dongForm() {
        form = null;
        ui.swap(z('vForm'), z('vChinh'), { top: true });
    }

    function taiONhap() {
        var gt = dtGiayTo.filter(function (x) { return x.ID === form.danhMucId; })[0];
        return ums.api.call({ action: HC + 'DSA4BRIFIC8pDDQiDC4TLi8m', func: 'pkg_hanhchinhmotcua_chung.LayDSDanhMucMoRong',
            strQLSV_NguoiHoc_Id: SV, strMotCua_DanhMuc_Id: form.danhMucId, strDuongDanFile: gt ? e(gt.DUONGDANFILE) : '' })
            .then(function (r) {
                if (!z('fields')) return;
                var rows = arr(r.data);
                z('fields').innerHTML = rows.length ? rows.map(function (a) {
                    return ui.field(e(a.TEN), '<input class="ums-input" data-m="' + esc(e(a.ID)) + '" value="' +
                        esc(e(a.TRUONGTHONGTIN_GIATRI)) + '">');
                }).join('') : '';
                // Ô "Nội dung" chỉ hiện khi danh mục bật HIENTHICHONHAPNHANXET
                var oNx = z('nhanxet');
                if (gt && String(e(gt.HIENTHICHONHAPNHANXET)) === '1') {
                    oNx.hidden = false;
                    oNx.innerHTML = ui.field('Nội dung', '<textarea class="ums-input ums-textarea" data-f="nhanxet" rows="3"></textarea>',
                        { required: true });
                    var tx = oNx.querySelector('[data-f="nhanxet"]');
                    if (tx) tx.value = e(form.nhanXet);
                } else { oNx.hidden = true; oNx.innerHTML = ''; }
                if (!rows.length && oNx.hidden) z('fields').innerHTML = ui.empty('Dịch vụ này không cần khai thêm thông tin', 'fa-circle-info');
                // Data.Id = tệp kết quả máy chủ sinh ra (chỉ hiện ở chế độ xem)
                var tep = r.raw && r.raw.Id;
                if (form.xem && tep) {
                    z('kq').hidden = false;
                    z('kq').innerHTML = '<iframe class="ttc-kq" src="' + esc(ums.files.url(tep)) + '"></iframe>';
                } else if (form.xem) {
                    z('kq').hidden = false;
                    z('kq').innerHTML = ui.empty('Chưa có kết quả trả về', 'fa-file-circle-question');
                }
                ui.enhance(z('vForm'));
            })
            .catch(function (err) { if (z('fields')) z('fields').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thông tin cần khai'); });
    }

    function guiThongTin() {
        var sua = !!form.yeuCauId;
        var tx = z('vForm').querySelector('[data-f="nhanxet"]');
        ums.api.call({
            action: TT + (sua ? 'EjQgHgwuNQI0IB4PJjQuKAkuIh4YJDQCIDQP' : 'FSkkLB4MLjUCNCAeDyY0LigJLiIeGCQ0AiA0'),
            func: 'pkg_hanhchinhmotcua_thongtin.Them_MotCua_NguoiHoc_YeuCau',
            strId: form.yeuCauId || '', strQLSV_NguoiHoc_Id: SV,
            dSoLuong: '', strMoTa: '',                       // txtSoLuong… / txtGhiChu… không có trong HTML gốc
            strNhanXet: tx ? tx.value : '',
            strDanhGiaChatLuong_Id: '',                      // dropAAAA
            strSoDienThoaiNguoiNhan: '', strDiaChiNguoiNhan: '', strEmailNguoiNhan: '',
            strMotCua_DanhMuc_Id: form.danhMucId
        }).then(function (r) {
            var id = form.yeuCauId || (r.raw && r.raw.Id) || '';
            ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            var o = z('vForm').querySelectorAll('input[data-m]');
            var calls = Array.prototype.map.call(o, function (el) {
                return { action: TT + 'FSkkLB4MLjUCNCAeBSAvKQw0Ih4FNA0oJDQP', func: 'pkg_hanhchinhmotcua_thongtin.Them_MotCua_DanhMuc_DuLieu',
                    strId: '', strQLSV_NguoiHoc_Id: SV, strTruongThongTin_Id: el.getAttribute('data-m'),
                    strTruongThongTin_GiaTri: el.value, strMotCua_DanhMuc_Id: form.danhMucId,
                    strMotCua_NguoiHoc_YeuCau_Id: id };
            });
            return (calls.length ? ui.batch(calls, { title: 'Đang lưu thông tin khai', okText: 'Thực hiện thành công' })
                : Promise.resolve()).then(function () { dongForm(); taiChoXacNhan(); });
        }).catch(function (err) { ums.api.handle(err, 'gửi thông tin'); });
    }

    function xoaYeuCau(id) {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: TT + 'GS4gHgwuNQI0IB4PJjQuKAkuIh4YJDQCIDQP',
                func: 'pkg_hanhchinhmotcua_thongtin.Xoa_MotCua_NguoiHoc_YeuCau', strIds: id })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); taiChoXacNhan(); })
                .catch(function (err) { ums.api.handle(err, 'xoá yêu cầu'); });
        });
    }

    /* ===================================================================
       Sự kiện
       =================================================================== */
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-xtab]');
        if (t && z('tabs').contains(t)) { doiTab(t.getAttribute('data-xtab')); return; }

        var b = ev.target.closest('[data-a], [data-act]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'batdau') { ui.swap(z('vMo'), z('vChinh'), { top: true }); return; }
        if (a === 'dongForm') { dongForm(); return; }
        if (a === 'gui') { guiThongTin(); return; }

        var act = b.getAttribute('data-act'), id = b.getAttribute('data-id');
        if (!act || !id) return;
        if (act === 'del') { xoaYeuCau(id); return; }
        var row = (act === 'view' ? (dtTheoTT[tab.slice(3)] || []) : dtChoXacNhan)
            .filter(function (r) { return String(r.ID) === String(id); })[0];
        if (!row) return;
        moForm({ danhMucId: e(row.MOTCUA_DANHMUC_ID), ten: e(row.MOTCUA_DANHMUC_TEN),
            yeuCauId: e(row.ID), nhanXet: e(row.NHANXET), xem: act === 'view' });
    });

    if (window.jQuery) jQuery(f('pl')).on('select2:select select2:clear', taiTatCa);

    /* ---------- Mở màn --------------------------------------------------- */
    veTabs();
    z('than').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    ums.api.dm('MOTCUA_DANHGIA_CHATLUONG').then(function (d) { dmDanhGia = arr(d); }, function () { dmDanhGia = []; });
    taiPhanLoai();
    taiTatCa();
})();
