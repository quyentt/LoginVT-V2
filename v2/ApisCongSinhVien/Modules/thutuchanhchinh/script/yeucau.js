/* =========================================================================
   Hệ thống một cửa — yêu cầu hỗ trợ (Cổng sinh viên, vai trò thủ vai:
   người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/thutuchanhchinh/html/yeucau.html + script/yeucau.js (vỏ index).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc, HAI cột ở trang đầu:
     · cột TRÁI  — "Chào mừng bạn đến với / HỆ THỐNG MỘT CỬA", ô chọn Chương trình
       (ẩn khi có ≤ 2 chương trình, như gốc), ô chọn Yêu cầu, nút "Tạo mới";
     · cột PHẢI  — giới thiệu dịch vụ đang chọn: tiêu đề + "Tải file" mẫu đơn,
       ảnh minh hoạ, mô tả, tệp đính kèm;
     · dưới hai cột — 4 thẻ tổng hợp (đã gửi / đã xử lý / đang xử lý / cần bổ sung),
       bấm vào mở hộp "Danh sách …";
     · biểu mẫu khai yêu cầu thay chỗ trang đầu (zoneEdit của gốc).

   Lời gọi (chép nguyên action / func / tên tham số):
     SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc → ô Chương trình
         (DAOTAO_TOCHUCCHUONGTRINH_ID / DAOTAO_CHUONGTRINH_TEN)
     SV_DVMC_Chung_MH · pkg_dvmc_chung.
         LayDSYeuCauTheoPhamVi   (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) → ô Yêu cầu
         LayDSCauTruc_YeuCau     (strYeuCau_Id, …) → Data.rsCauTrucYeuCau = cấu trúc biểu mẫu
         LayDSDanhGiaTheoPhamVi  (strDVMC_YeuCau_Nhan_Id, …) → Data.rsDanhMucDanhGia / rsKetQuaDanhGia
     SV_DVMC_ThongTin_MH · pkg_dvmc_thongtin.
         LayTTDVMC_YeuCu_MoTa    (strYeuCau_Id) → tiêu đề / mô tả / ảnh / mẫu đơn / địa chỉ trả
         LayTTDVMC_CauTruc_YC_DuLieu / Them_DVMC_CauTruc_YC_DuLieu   (từng ô của biểu mẫu)
         Them_DVMC_DanhGia_YC_DuLieu                                  (mức độ hài lòng)
     SV_DVMC_YeuCau_MH · pkg_dvmc_yeucau.
         LayTTTongHopDVMC_YeuCau_Nhan → 4 thẻ tổng hợp
         LayDSDVMC_YeuCau_Nhan   (strPhanLoaiYeuCau = TongSoYeuCauDaGui | …) → hộp "Danh sách …"
         Them_DVMC_YeuCau_Nhan   (dHanhDong = 0 khi mở biểu mẫu, = 1 khi "Gửi yêu cầu")
         Xoa_DVMC_YeuCau_Nhan    (nút "Hủy")
         Sua_YKien_DVMC_YeuCau_Nhan (ô "Ý kiến khác")
     strNguoiThucHien_Id / strChucNang_Id = edu.system.* ở gốc → api.js tự điền.

   LỖI BẢN GỐC — đã làm theo đúng ý định, ghi lại để kiểm trên host:
     · Ô "Địa chỉ nhận mong muốn" trong HTML gốc KHÔNG có id, còn save/delete lại đọc
       edu.util.getValById('txtDiaChi') → luôn gửi rỗng. Ở đây nối ô đó vào
       strDiaChiNhanMongMuon (đúng ý định của tên tham số).
     · Ô LIST của biểu mẫu động: gốc vẽ <select id="drop<Id>"> nhưng lại đổ danh mục vào
       "dropDanhGia<Id>" → ô LIST không bao giờ có lựa chọn. Ở đây đổ đúng ô đó.
     · Cũng ô LIST: gốc chỉ nạp danh mục khi ĐÃ CÓ dữ liệu đã lưu (lặp trên kết quả trả về)
       → ô mới tinh luôn rỗng. Ở đây luôn nạp danh mục rồi mới chọn giá trị đã lưu.
     · Nút "Hủy" của gốc mang cả lớp btnClose + btnDelete_YeuCau nên XOÁ yêu cầu rồi mới quay
       lại — kể cả khi đang SỬA một yêu cầu cũ (lớp btnDelete_YeuCau2 có kiểm tra bAdd nhưng
       không nằm trên nút nào). Giữ nguyên hành vi xoá, nhưng HỎI LẠI trước khi xoá.
     · "Danh sách …": tiêu đề hộp (#lblLoaiYeuCau) không nơi nào đổ chữ → ở đây ghi tên thẻ vừa bấm.

   Giữ như bản gốc:
     · Cột "Xem" gọi ĐÚNG việc của cột "Sửa" (mở biểu mẫu khai) — gốc vẽ hai nút giống hệt nhau.
     · "Thời gian nhận dự kiến" không lời gọi nào đổ dữ liệu → ô chỉ đọc, để trống.
     · Mở biểu mẫu là TẠO NGAY một bản ghi yêu cầu (dHanhDong = 0) rồi "Gửi yêu cầu"
       mới cập nhật (dHanhDong = 1) — đúng thứ tự gốc.
     · Ô chọn Chương trình chỉ hiện khi có > 2 chương trình (gốc: data.length > 2).
   Khác bản gốc:
     · Chương trình → Yêu cầu là cặp CHA → CON: chưa chọn chương trình thì khoá ô Yêu cầu
       (luật chung 2026-09-21).
     · "Phí phải nộp" định dạng tiền (gốc in số thô).
     · Bỏ hàm chết của gốc: popup/resetPopup (trỏ #myModal, dropKhoanThu… không có trong màn),
       genTable_YeuCau / viewForm_YeuCau (bảng tblYeuCau không tồn tại), btnXoaYeuCau, btnSearch.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.ttc;
    var e = T.e, esc = T.esc, arr = T.arr, SV = T.sv();
    var root = document.getElementById('ttc-yeucau');

    var CH = 'SV_DVMC_Chung_MH/';       // pkg_dvmc_chung
    var TI = 'SV_DVMC_ThongTin_MH/';    // pkg_dvmc_thongtin
    var YC = 'SV_DVMC_YeuCau_MH/';      // pkg_dvmc_yeucau

    var dtYeuCau = [], dtTinhTrang = [], dtChuongTrinh = [];
    var strChuongTrinh_Id = '', strYeuCau_Id = '', strXNYeuCau_Id = '';

    var THE = [
        { key: 'TongSoYeuCauDaGui', ten: 'Tổng số yêu cầu đã gửi', cot: 'TONGSOYEUCAUDAGUI', tone: 'info' },
        { key: 'TongSoYeuCauDaDuocXuLy', ten: 'Tổng số yêu cầu đã được xử lý', cot: 'TONGSOYEUCAUDADUOCXULY', tone: 'ok' },
        { key: 'TongSoYeuCauDangXuLy', ten: 'Tổng số yêu cầu đang xử lý', cot: 'TONGSOYEUCAUDANGXULY', tone: 'warn' },
        { key: 'TongSoYeuCauCanHoanThien', ten: 'Tổng số yêu cầu cần bổ sung hoàn thiện thêm', cot: 'TONGSOYEUCAUCANHOANTHIEN', tone: 'bad' }
    ];
    var tongHop = {};

    function sel(k, ph) { return '<select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select>'; }

    root.innerHTML =
        '<div data-z="vChinh">' +
            pat.page('Hệ thống một cửa', '') +
            '<div class="ums-grid ums-grid--2 ttc-yc-cols">' +
                pat.panel({ title: false, tools: ui.btn('add', { text: 'Tạo mới', attr: { 'data-a': 'taomoi' } }),
                    body: '<div class="ttc-mo__h2">Chào mừng bạn đến với</div>' +
                        '<h2 class="ttc-mo__h1">HỆ THỐNG MỘT CỬA</h2>' +
                        '<div data-z="oCT" hidden>' + ui.field('Chương trình đào tạo', sel('ct', 'Chọn chương trình')) + '</div>' +
                        ui.field('Dịch vụ', sel('yc', 'Chọn yêu cầu')) }) +
                pat.panel({ title: false, zone: 'gioiThieu', body: ui.empty('Chọn một dịch vụ để xem hướng dẫn', 'fa-hand-pointer') }) +
            '</div>' +
            '<div class="ums-u-mt-4" data-z="the"></div>' +
        '</div>' +
        '<div data-z="vForm" hidden></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    /* ===================================================================
       Trang đầu
       =================================================================== */
    /* pat.cards gắn trình xử lý click lên CHÍNH phần tử nhận thẻ; vẽ lại nhiều lần
       trên cùng một phần tử là chồng trình xử lý → dựng khung con mới mỗi lần vẽ. */
    function veThe() {
        z('the').innerHTML = '<div></div>';
        pat.cards({
            el: z('the').firstChild, items: THE,
            render: function (t) {
                return '<div class="ums-u-mb-2">' + esc(t.ten) + '</div>' +
                    '<div class="ttc-kpi">' + ui.badge(e(tongHop[t.cot]) === '' ? '—' : String(e(tongHop[t.cot])), t.tone) + '</div>';
            },
            onPick: function (t) { moDanhSach(t); }
        });
    }
    function taiTongHop() {
        return ums.api.call({ action: YC + 'DSA4FRUVLi8mCS4xBRcMAh4YJDQCIDQeDykgLwPP', func: 'pkg_dvmc_yeucau.LayTTTongHopDVMC_YeuCau_Nhan',
            strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id })
            .then(function (r) { tongHop = arr(r.data)[0] || {}; veThe(); })
            .catch(function (err) { tongHop = {}; veThe(); ums.api.handle(err, 'tổng hợp yêu cầu'); });
    }
    function taiDichVu() {
        return ums.api.call({ action: CH + 'DSA4BRIYJDQCIDQVKSQuESkgLBco', func: 'pkg_dvmc_chung.LayDSYeuCauTheoPhamVi',
            strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id })
            .then(function (r) { dtYeuCau = arr(r.data); pat.fill(f('yc'), dtYeuCau, { head: 'Chọn yêu cầu' }); ch.sync(); })
            .catch(function (err) { ums.api.handle(err, 'danh sách dịch vụ'); });
    }
    function veGioiThieu(a) {
        a = a || {};
        var tep = e(a.DUONGDANMAUDON);
        if (tep) tep = String(tep).split(',')[0];
        var yc = f('yc').value;
        z('gioiThieu').innerHTML =
            '<div class="ttc-gt__dau"><span class="ttc-gt__ten">' + esc(e(a.TIEUDE)) + '</span>' +
                (tep ? '<a class="ums-btn ums-btn--out-info ums-btn--sm" href="' + esc(ums.files.url(tep)) +
                    '" target="_blank"><i class="fa-light fa-cloud-arrow-down"></i><span>Tải file</span></a>' : '') + '</div>' +
            (a.HINHANHMINHHOA ? '<div class="ttc-dv__anh ums-u-mb-3"><img src="' + esc(ums.files.url(a.HINHANHMINHHOA)) + '" alt=""></div>' : '') +
            '<div data-z="moTa">' + ui.escBr(e(a.MOTA)) + '</div>' +
            '<div class="ums-u-mt-3" data-z="tepYC"></div>';
        if (yc) ums.files.mount(z('tepYC'), { api: 'SV_Files', readonly: true }).load(yc);
    }
    function taiGioiThieu() {
        if (!f('yc').value) { veGioiThieu({ MOTA: '' }); return Promise.resolve(); }
        return ums.api.call({ action: TI + 'DSA4FRUFFwwCHhgkNAI0HgwuFSAP', func: 'pkg_dvmc_thongtin.LayTTDVMC_YeuCu_MoTa',
            strYeuCau_Id: f('yc').value })
            .then(function (r) { veGioiThieu(arr(r.data)[0] || { MOTA: '' }); })
            .catch(function (err) { ums.api.handle(err, 'mô tả dịch vụ'); });
    }

    /* ===================================================================
       Hộp "Danh sách …"
       =================================================================== */
    function moDanhSach(t) {
        var dlg = ui.dialog({ title: 'Danh sách ' + t.ten, icon: 'fa-list-check', size: 'xl',
            body: '<div data-z="ds">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var host = dlg.body.querySelector('[data-z="ds"]');
        ums.api.call({ action: YC + 'DSA4BRIFFwwCHhgkNAIgNB4PKSAv', func: 'pkg_dvmc_yeucau.LayDSDVMC_YeuCau_Nhan',
            strPhanLoaiYeuCau: t.key, strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id })
            .then(function (r) {
                dtTinhTrang = arr(r.data);
                ui.table({
                    el: host, rows: dtTinhTrang, empty: 'Không có yêu cầu nào',
                    columns: [
                        { title: 'Mã yêu cầu', prop: 'MAYEUCAU', cls: 'is-nowrap' },
                        { title: 'Loại yêu cầu', prop: 'YEUCAU_TEN' },
                        { title: 'Thời gian gửi', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                        { title: 'Tình trạng xử lý - thời gian xử lý', prop: 'TINHTRANGXULY_THOIGIAN', cls: 'is-center' },
                        { title: 'Thời gian hoàn thành dự kiến', prop: 'THOIGIANHOANTHANHDUKIEN', cls: 'is-center' },
                        { title: 'Phí phải nộp', cls: 'is-right is-nowrap', render: function (r2) { return r2.SOTIEN ? ui.money(r2.SOTIEN) : ''; } },
                        { title: 'Sửa', cls: 'is-center', render: function (r2) { return ui.iconBtn('edit', r2.ID); } },
                        { title: 'Xem', cls: 'is-center', render: function (r2) { return ui.iconBtn('view', r2.ID); } },
                        { title: 'Đánh giá mức độ hài lòng', cls: 'is-center', render: function (r2) {
                            return '<select class="ums-select ums-input--sm" data-dg="' + esc(e(r2.ID)) + '"></select>'; } },
                        { title: 'Ý kiến khác', render: function (r2) {
                            return '<input class="ums-input ums-input--sm" data-yk="' + esc(e(r2.ID)) + '" value="' +
                                esc(e(r2.YKIENKHAC)) + '" data-cu="' + esc(e(r2.YKIENKHAC)) + '">'; } }
                    ]
                });
                dtTinhTrang.forEach(function (r2) { taiDanhGia(host, r2); });
            })
            .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách yêu cầu'); });

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-act]');
            if (!b) return;
            var row = dtTinhTrang.filter(function (x) { return String(x.ID) === String(b.getAttribute('data-id')); })[0];
            if (!row) return;
            dlg.close();
            strXNYeuCau_Id = e(row.ID);
            strYeuCau_Id = e(row.YEUCAU_ID);
            moForm(e(row.YEUCAU_TEN));
        });
        host.addEventListener('change', function (ev) {
            var s = ev.target.closest('[data-dg]');
            if (!s) return;
            if (s.value === s.getAttribute('data-cu')) return;      // gốc: chỉ lưu khi đổi
            s.setAttribute('data-cu', s.value);
            luuDanhGia(s.getAttribute('data-dg'), s.value);
        });
        host.addEventListener('focusout', function (ev) {
            var o = ev.target.closest('[data-yk]');
            if (!o || o.value === o.getAttribute('data-cu')) return;
            o.setAttribute('data-cu', o.value);
            luuYKien(o.getAttribute('data-yk'), o.value);
        });
    }
    function taiDanhGia(host, row) {
        ums.api.call({ action: CH + 'DSA4BRIFIC8pBiggFSkkLhEpICwXKAPP', func: 'pkg_dvmc_chung.LayDSDanhGiaTheoPhamVi', silent: true,
            strDVMC_YeuCau_Nhan_Id: row.ID, strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id })
            .then(function (r) {
                var d = r.data || {}, kq = arr(d.rsKetQuaDanhGia), el = host.querySelector('[data-dg="' + e(row.ID) + '"]');
                if (!el) return;
                var chon = kq.length ? e(kq[0].DANHGIA_ID) : '';
                el.innerHTML = ui.options(arr(d.rsDanhMucDanhGia), { id: 'ID', name: 'TEN', title: 'Chọn đánh giá' });
                el.value = chon;
                el.setAttribute('data-cu', chon);
            })
            .catch(function () {});
    }
    function luuDanhGia(id, danhGiaId) {
        var row = dtTinhTrang.filter(function (x) { return String(x.ID) === String(id); })[0] || {};
        ums.api.call({ action: TI + 'FSkkLB4FFwwCHgUgLykGKCAeGAIeBTQNKCQ0', func: 'pkg_dvmc_thongtin.Them_DVMC_DanhGia_YC_DuLieu',
            strYeuCau_Id: e(row.YEUCAU_ID), strDanhGia_Id: danhGiaId, strQLSV_NguoiHoc_Id: SV,
            strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strDVMC_YeuCau_Nhan_Id: id })
            .catch(function (err) { ums.api.handle(err, 'đánh giá mức độ hài lòng'); });
    }
    function luuYKien(id, yKien) {
        var row = dtTinhTrang.filter(function (x) { return String(x.ID) === String(id); })[0] || {};
        ums.api.call({ action: YC + 'EjQgHhgKKCQvHgUXDAIeGCQ0AiA0Hg8pIC8P', func: 'pkg_dvmc_yeucau.Sua_YKien_DVMC_YeuCau_Nhan',
            strId: id, strYKienKhac: yKien, strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id,
            strYeuCau_Id: e(row.YEUCAU_ID) })
            .catch(function (err) { ums.api.handle(err, 'lưu ý kiến khác'); });
    }

    /* ===================================================================
       Biểu mẫu khai yêu cầu
       =================================================================== */
    function moForm(ten) {
        z('vForm').innerHTML =
            pat.page('Hệ thống một cửa', '') +
            pat.panel({
                title: ten || 'Yêu cầu', icon: 'fa-file-signature',
                tools: ui.btn('close', { text: 'Quay lại', attr: { 'data-a': 'quaylai' } }) +
                ui.btn('save', { text: 'Gửi yêu cầu', icon: 'fa-paper-plane', attr: { 'data-a': 'gui' } }) +
                    ui.btn('del', { text: 'Hủy', attr: { 'data-a': 'huy' } }),
                                    body:
                    '<div class="ttc-canhbao"><i class="fa-light fa-triangle-exclamation"></i>' +
                        '<span>Giữ liệu nhập cần đúng thông tin, viết đúng chính tả, không viết tắt. ' +
                        'Thông tin không đúng yêu cầu đều không hợp lệ</span></div>' +
                    '<div class="ttc-ct" data-z="ct">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                    '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                        ui.field('Địa chỉ trả thông tin', '<input class="ums-input" data-f="phongBan" readonly>') +
                        ui.field('Địa chỉ nhận mong muốn', '<input class="ums-input" data-f="diaChi" placeholder="Nhập địa chỉ">') +
                        ui.field('Thời gian nhận dự kiến', '<input class="ums-input" data-f="thoiGianNhan" readonly>') +
                    '</div>'
            });
        ui.swap(z('vChinh'), z('vForm'), { top: true });
        // "Địa chỉ trả thông tin" lấy từ mô tả dịch vụ đang chọn (DIACHITRAYEUCAU)
        ums.api.call({ action: TI + 'DSA4FRUFFwwCHhgkNAI0HgwuFSAP', func: 'pkg_dvmc_thongtin.LayTTDVMC_YeuCu_MoTa', silent: true,
            strYeuCau_Id: strYeuCau_Id })
            .then(function (r) {
                var a = arr(r.data)[0] || {}, o = z('vForm').querySelector('[data-f="phongBan"]');
                if (o) o.value = e(a.DIACHITRAYEUCAU);
            }).catch(function () {});
        taiCauTruc();
    }
    function dongForm() { ui.swap(z('vForm'), z('vChinh'), { top: true }); }

    function taiCauTruc() {
        return ums.api.call({ action: CH + 'DSA4BRICIDQVMzQiHhgkNAIgNAPP', func: 'pkg_dvmc_chung.LayDSCauTruc_YeuCau',
            strYeuCau_Id: strYeuCau_Id, strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id })
            .then(function (r) { veCauTruc(arr((r.data || {}).rsCauTrucYeuCau)); })
            .catch(function (err) { if (z('ct')) z('ct').innerHTML = ui.fail(err.message); ums.api.handle(err, 'cấu trúc yêu cầu'); });
    }

    /* Mỗi dòng cấu trúc là một đoạn HTML do quản trị khai; ô nhập được nhúng bằng
       cặp @…@: @<id>-<TEXT|LIST>-<mã danh mục>-<bắt buộc>-…-…-<độ rộng px>@ */
    function veCauTruc(rows) {
        var html = '', o = [];
        rows.forEach(function (a) {
            var nd = e(a.NOIDUNG);
            html += (nd.indexOf('<div') === 0) ? nd : '<div style="width:100%"><div class="ttc-ct__dong">' + nd + '</div></div>';
            var vt = [], i;
            for (i = 0; i < nd.length; i++) if (nd[i] === '@') vt.push(i);
            for (i = 0; i + 1 < vt.length; i += 2) o.push(nd.substring(vt[i], vt[i + 1] + 1));
        });
        o.forEach(function (tok) {
            var p = tok.replace(/@/g, '').split('-');
            var bb = p[3] === '1' ? '<span class="ttc-bb">(*)</span>' : '';
            var st = p[6] ? ' style="width:' + esc(p[6]) + 'px"' : '';
            var thay = '';
            if (p[1] === 'TEXT') thay = '&nbsp;' + bb + '<input class="ums-input" data-tt="' + esc(p[0]) + '"' + st + '>';
            // select2 luôn rộng 100% → bọc ô chọn trong một thẻ mang đúng độ rộng khai ở cấu trúc
            else if (p[1] === 'LIST') thay = '&nbsp;' + bb + '<span class="ttc-ct__o"' + st + '><select class="ums-select" data-tt="' + esc(p[0]) + '"></select></span>';
            html = html.replace(tok, thay);
        });
        if (!z('ct')) return;
        z('ct').innerHTML = html || ui.empty('Dịch vụ này không có biểu mẫu khai', 'fa-circle-info');
        ui.enhance(z('ct'));
        o.forEach(function (tok) {
            var p = tok.replace(/@/g, '').split('-');
            var el = z('ct').querySelector('[data-tt="' + p[0] + '"]');
            if (!el) return;
            // Ô LIST: LUÔN nạp danh mục (gốc chỉ nạp khi đã có dữ liệu lưu), rồi mới chọn giá trị
            var nap = p[1] === 'LIST' && p[2]
                ? ums.api.dm(p[2]).then(function (d) { pat.fill(el, arr(d), { head: 'Chọn' }); }, function () {})
                : Promise.resolve();
            nap.then(function () { return taiGiaTri(p[0]); }).then(function (gt) {
                if (gt === null) return;
                el.value = gt;
                el.setAttribute('data-cu', gt);
                if (window.jQuery && el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
            });
        });
    }
    function taiGiaTri(truongId) {
        return ums.api.call({ action: TI + 'DSA4FRUFFwwCHgIgNBUzNCIeGAIeBTQNKCQ0', func: 'pkg_dvmc_thongtin.LayTTDVMC_CauTruc_YC_DuLieu',
            silent: true, strYeuCau_Id: strYeuCau_Id, strTruongThongTin_Id: truongId, strQLSV_NguoiHoc_Id: SV,
            strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strDVMC_YeuCau_Nhan_Id: strXNYeuCau_Id })
            .then(function (r) { var d = arr(r.data)[0]; return d ? e(d.TRUONGTHONGTIN_GIATRI) : null; }, function () { return null; });
    }
    function luuGiaTri(truongId, giaTri) {
        ums.api.call({ action: TI + 'FSkkLB4FFwwCHgIgNBUzNCIeGAIeBTQNKCQ0', func: 'pkg_dvmc_thongtin.Them_DVMC_CauTruc_YC_DuLieu',
            strYeuCau_Id: strYeuCau_Id, strTruongThongTin_Id: truongId, strTruongThongTin_GiaTri: giaTri,
            strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strDVMC_YeuCau_Nhan_Id: strXNYeuCau_Id })
            .catch(function (err) { ums.api.handle(err, 'lưu thông tin khai'); });
    }

    /* ---------- Gửi / huỷ yêu cầu ---------------------------------------- */
    function luuYeuCau(dHanhDong) {
        var o = z('vForm') ? z('vForm').querySelector('[data-f="diaChi"]') : null;
        return ums.api.call({ action: YC + 'FSkkLB4FFwwCHhgkNAIgNB4PKSAv', func: 'pkg_dvmc_yeucau.Them_DVMC_YeuCau_Nhan',
            strId: strXNYeuCau_Id, dHanhDong: dHanhDong, strDiaChiNhanMongMuon: o ? o.value : '',
            strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strYeuCau_Id: strYeuCau_Id })
            .then(function (r) {
                // Gốc: chỉ báo + quay lại khi bản ghi ĐÃ CÓ id (tức lần gửi, không phải lần mở biểu mẫu)
                if (strXNYeuCau_Id) {
                    var a = dtYeuCau.filter(function (x) { return String(x.ID) === String(strYeuCau_Id); })[0];
                    ui.toast((a && a.THONGBAOKHIDANGKYTHANHCONG) || 'Gửi yêu cầu thành công', 'ok');
                    dongForm();
                    taiTongHop();
                }
                strXNYeuCau_Id = (r.raw && r.raw.Id) || strXNYeuCau_Id;
            })
            .catch(function (err) { ums.api.handle(err, 'gửi yêu cầu'); });
    }
    function huyYeuCau() {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy yêu cầu' }).then(function (yes) {
            if (!yes) return;
            var o = z('vForm') ? z('vForm').querySelector('[data-f="diaChi"]') : null;
            ums.api.call({ action: YC + 'GS4gHgUXDAIeGCQ0AiA0Hg8pIC8P', func: 'pkg_dvmc_yeucau.Xoa_DVMC_YeuCau_Nhan',
                strId: strXNYeuCau_Id, strDiaChiNhanMongMuon: o ? o.value : '', strQLSV_NguoiHoc_Id: SV,
                strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strYeuCau_Id: strYeuCau_Id })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'huỷ yêu cầu'); })
                .then(function () { strXNYeuCau_Id = ''; dongForm(); taiTongHop(); });
        });
    }

    /* ===================================================================
       Sự kiện
       =================================================================== */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'taomoi') {
            strYeuCau_Id = f('yc').value;
            if (!strYeuCau_Id) { ui.toast('Vui lòng chọn dịch vụ!', 'warn'); return; }
            strXNYeuCau_Id = '';
            var op = f('yc').options[f('yc').selectedIndex];
            moForm(op ? op.text : '');
            luuYeuCau(0);           // gốc: mở biểu mẫu là tạo ngay bản ghi (dHanhDong = 0)
        } else if (a === 'gui') {
            luuYeuCau(1);
        } else if (a === 'huy') {
            huyYeuCau();
        } else if (a === 'quaylai') {
            dongForm();
        }
    });
    root.addEventListener('change', function (ev) {
        var s = ev.target.closest('.ttc-ct [data-tt]');
        if (!s || s.tagName !== 'SELECT') return;
        luuGiaTri(s.getAttribute('data-tt'), s.value);
    });
    root.addEventListener('focusout', function (ev) {
        var o = ev.target.closest('.ttc-ct [data-tt]');
        if (!o || o.tagName !== 'INPUT') return;
        if (o.value === o.getAttribute('data-cu')) return;
        o.setAttribute('data-cu', o.value);
        luuGiaTri(o.getAttribute('data-tt'), o.value);
    });

    var ch;
    if (window.jQuery) {
        jQuery(f('ct')).on('select2:select select2:clear', function () {
            strChuongTrinh_Id = f('ct').value;
            veGioiThieu({ MOTA: '' });
            if (!strChuongTrinh_Id) { pat.fill(f('yc'), [], { head: 'Chọn yêu cầu' }); ch.sync(); tongHop = {}; veThe(); return; }
            taiDichVu();
            taiTongHop();
        });
        jQuery(f('yc')).on('select2:select select2:clear', taiGioiThieu);
    }
    ch = pat.chain([f('ct'), f('yc')], { phatLai: false });

    /* ---------- Mở màn --------------------------------------------------- */
    veThe();
    ums.api.call({ action: 'SV_ThongTin_MH/DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP',
        func: 'pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc', strQLSV_NguoiHoc_Id: SV })
        .then(function (r) {
            dtChuongTrinh = arr(r.data);
            pat.fill(f('ct'), dtChuongTrinh, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN', head: 'Chọn chương trình' });
            // Gốc: chọn sẵn chương trình đầu; chỉ HIỆN ô chọn khi có nhiều hơn 2 chương trình
            if (dtChuongTrinh.length) {
                f('ct').value = e(dtChuongTrinh[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
                if (window.jQuery) jQuery(f('ct')).trigger('change.select2');
                strChuongTrinh_Id = f('ct').value;
            }
            z('oCT').hidden = dtChuongTrinh.length <= 2;
            ch.sync();
            taiDichVu();
            taiTongHop();
        })
        .catch(function (err) { ums.api.handle(err, 'chương trình học'); });
})();
