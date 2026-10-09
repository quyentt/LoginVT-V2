/* =========================================================================
   thilai — Cổng sinh viên › Đăng ký thi lại (vai trò thủ vai: người học = ums.session.userId).
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/thilai.html + script/thilai.js (vỏ index).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc, MỘT cột: thanh lọc (Chương trình · Kế hoạch · Xem) + dòng thông tin kế hoạch
   (Thời hạn đăng ký từ/đến · Loại đăng ký, chỉ đọc) → bảng "học phần đủ điều kiện" + Đăng ký →
   bảng "đã đăng ký" + Hủy đăng ký; hộp "Chi tiết điểm". Khung hai bảng dùng chung: ums.pat.haiLuoi.

   Lời gọi (chép nguyên action / func / tên tham số):
     DKH_DangKyThi_MonThi_Chung_MH · pkg_dangkythi_monthi_chung.LayDSChuongTrinhNguoiHoc (strQLSV_NguoiHoc_Id)
         → ô Chương trình (DAOTAO_TOCHUCCHUONGTRINH_ID / DAOTAO_CHUONGTRINH_TEN), chọn sẵn mục đầu (selectFirst).
     … pkg_dangkythi_monthi_chung.LayDSKeHoachTheoNguoiHoc (strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id)
         → ô Kế hoạch (ID / TENKEHOACH), chọn sẵn mục đầu; TUNGAY / DENNGAY / MOHINHDANGKY_TEN.
     DKH_DangKyThi_MonThi_ThongTin_MH · pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy
         (strChucNang_Id, strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id, strDangKy_Thi_HP_KeHoach_Id)
         → Data.rsHocPhanDuDK (bảng trên) · Data.rsKetQua (bảng dưới).
     … ThucHienDangKy (strDangKy_Thi_HP_KeHoach_Id = DANGKY_THI_HP_KEHOACH_ID, strQLHLTL_NguoiHoc_Id = ID dòng)
     … ThucHienHuyDangKy (strId = ID dòng, strDangKy_Thi_HP_KeHoach_Id, strDangKy_Thi_HocPhan_KQ_Id = ID dòng)
     SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LatKetQuaDiemCaNhanTheoLop
         (strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID, strDaoTao_LopHocPhan_Id = DIEM_DANHSACHHOC_ID) → rsTP + rsTKHP.
     strNguoiThucHien_Id = edu.system.userId ở gốc → để api.js tự điền (cùng giá trị: người học đang thủ vai).

   Khác bản gốc (cách làm, không đổi dữ liệu gửi đi):
     · Chương trình → Kế hoạch là cặp CHA → CON (luật 2026-09-21): chưa chọn chương trình thì khoá Kế hoạch,
       xoá chương trình thì xoá Kế hoạch + thông tin kế hoạch + hai bảng về lời nhắc.
     · Gốc gọi LayDSKeHoachTheoNguoiHoc ngay lúc mở màn SONG SONG với nạp chương trình (ô chương trình còn
       trống → gửi strDaoTao_ChuongTrinh_Id rỗng, kết quả về sau có thể đè kết quả đúng). Ở đây nạp tuần tự:
       chương trình → (chọn mục đầu) → kế hoạch → (chọn mục đầu) → hai bảng — đúng chuỗi selectFirst của gốc.
     · Chọn sẵn kế hoạch đầu thì điền luôn Thời hạn / Loại đăng ký (gốc selectFirst bắn select2:select nên cũng điền).
     · Đăng ký / Hủy nhiều dòng: gốc bắn N lời gọi cùng lúc, mỗi lời gọi xong nạp lại bảng một lần;
       ở đây chạy lần lượt qua ums.ui.batch rồi nạp lại MỘT lần. Hộp hỏi lại gốc gắn thêm trình xử lý
       mỗi lần mở (bấm lần 2 là gửi 2 lần) — ums.ui.confirm không còn lỗi đó.
     · "Hủy đăng ký" là nút xoá nhiều dòng chuẩn (tự đếm, khoá khi chưa chọn); màu gốc btn-secondary.
     · Đánh dấu một dòng thì đánh dấu mọi dòng cùng học phần (DAOTAO_HOCPHAN_ID) — giữ như gốc.
     · Mức phí phải nộp định dạng tiền (gốc formatCurrency).
   Kéo gốc 30/9: bảng "đã đăng ký" thêm cột "Đã nộp" (SOTIENDANOP, định dạng tiền như cột Mức phí phải nộp,
     cùng màu như gốc — gốc color-orange cho cả hai cột). Gốc bỏ e.preventDefault() ở nút chi tiết điểm: không ảnh hưởng bản mới.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('dkh-thilai');
    var SV = (ums.session && ums.session.userId) || '';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var CHUNG = 'DKH_DangKyThi_MonThi_Chung_MH/', TT = 'DKH_DangKyThi_MonThi_ThongTin_MH/';
    var dsKeHoach = [], dtThiLai = { rsHocPhanDuDK: [], rsKetQua: [] };

    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>'; }
    function ro(k, ph) { return '<input class="ums-input" data-f="' + k + '" placeholder="' + esc(ph || '') + '" readonly>'; }

    root.innerHTML = pat.page('Đăng ký thi lại', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' + sel('ct', 'Chọn chương trình') + sel('kh', 'Chọn kế hoạch') +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem', icon: 'fa-magnifying-glass', attr: { 'data-a': 'xem' } }) + '</div></div>' +
            '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                ui.field('Thời hạn đăng ký', '<div class="ums-grid ums-grid--2">' + ro('tungay', 'Từ ngày') + ro('denngay', 'Đến ngày') + '</div>') +
                ui.field('Loại đăng ký', ro('loai')) + '</div>' }) +
        '<div data-z="luoi"></div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value : ''; }

    /* ---------- Hai bảng ---------------------------------------------- */
    function colDiem(r) {
        return '<b>' + esc(e(r.DIEM)) + '</b> <a href="javascript:void(0)" data-ctd="' + esc(e(r.ID)) + '" title="Chi tiết điểm">Xem chi tiết</a>';
    }
    var COT = [
        { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-center is-nowrap' },
        { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
        { title: 'Loại điểm', prop: 'DIEM_THANHPHANDIEM_TEN' },
        { title: 'Số tín chỉ', prop: 'HOCTRINH', cls: 'is-center' },
        { title: 'Điểm', cls: 'is-center is-nowrap', render: colDiem },
        { title: 'Đánh giá', prop: 'DANHGIA_TEN' },
        { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' }
    ];
    var hl = ums.pat.haiLuoi(root.querySelector('[data-z="luoi"]'), {
        nhom: 'DAOTAO_HOCPHAN_ID',
        chua: { title: 'Danh sách các học phần đủ điều kiện đăng ký', icon: 'fa-list-check', columns: COT,
            empty: 'Không có học phần đủ điều kiện đăng ký', nut: { text: 'Đăng ký', icon: 'fa-money-check-pen' },
            canChon: 'Vui lòng chọn đối tượng?', onDangKy: dangKy },
        da: { title: 'Danh sách học phần đã đăng ký', icon: 'fa-clipboard-check',
            columns: COT.concat([{ title: 'Mức phí phải nộp', cls: 'is-center is-nowrap',
                render: function (r) { return '<b class="ums-u-danger">' + esc(ui.money(r.SOTIEN)) + '</b>'; } },
                { title: 'Đã nộp', cls: 'is-center is-nowrap',
                  render: function (r) { return '<b class="ums-u-danger">' + esc(ui.money(r.SOTIENDANOP)) + '</b>'; } }]),
            empty: 'Chưa đăng ký học phần nào', nut: { text: 'Hủy đăng ký' }, canChon: 'Vui lòng chọn đối tượng?', onHuy: huy }
    });
    function nhacBang() {
        dtThiLai = { rsHocPhanDuDK: [], rsKetQua: [] };
        hl.nhac('chua', 'Chọn chương trình và kế hoạch rồi bấm "Xem"');
        hl.nhac('da', 'Chọn chương trình và kế hoạch rồi bấm "Xem"');
    }

    function taiDS() {
        hl.dang('chua'); hl.dang('da');
        return ums.api.call({ action: TT + 'DSA4BRIJLiIRKSAvBSAvJgo4', func: 'pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy',
            strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strQLSV_NguoiHoc_Id: SV,
            strDaoTao_ChuongTrinh_Id: v('ct'), strDangKy_Thi_HP_KeHoach_Id: v('kh') })
            .then(function (r) {
                var d = r.data || {};
                dtThiLai = { rsHocPhanDuDK: arr(d.rsHocPhanDuDK), rsKetQua: arr(d.rsKetQua) };
                hl.ve('chua', dtThiLai.rsHocPhanDuDK);
                hl.ve('da', dtThiLai.rsKetQua);
            })
            .catch(function (err) { hl.loi('chua', err.message); hl.loi('da', err.message); ums.api.handle(err, 'danh sách học phần'); });
    }

    function dangKy(ds) {
        ui.confirm('Bạn có chắc chắn đăng ký không?', { ok: 'Đăng ký' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ds.map(function (a) {
                return { action: TT + 'FSk0IgkoJC8FIC8mCjgP', func: 'pkg_dangkythi_monthi_thongtin.ThucHienDangKy',
                    strDangKy_Thi_HP_KeHoach_Id: e(a.DANGKY_THI_HP_KEHOACH_ID), strQLHLTL_NguoiHoc_Id: e(a.ID) };
            }), { title: 'Đang đăng ký', okText: 'Thêm mới thành công' }).then(taiDS);
        });
    }
    function huy(ds) {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy đăng ký' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ds.map(function (a) {
                return { action: TT + 'FSk0IgkoJC8JNDgFIC8mCjgP', func: 'pkg_dangkythi_monthi_thongtin.ThucHienHuyDangKy',
                    strId: e(a.ID), strDangKy_Thi_HP_KeHoach_Id: e(a.DANGKY_THI_HP_KEHOACH_ID), strDangKy_Thi_HocPhan_KQ_Id: e(a.ID) };
            }), { title: 'Đang hủy đăng ký', okText: 'Xóa thành công' }).then(taiDS);
        });
    }

    /* ---------- Chi tiết điểm (modalChiTietDiem) ------------------------ */
    function chiTietDiem(a) {
        var dlg = ui.dialog({ title: 'Chi tiết điểm', icon: 'fa-square-poll-vertical', size: 'xl', body: '<div data-x="ds"></div>' });
        var host = dlg.body.querySelector('[data-x="ds"]');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLAIgDykgLxUpJC4NLjEP', func: 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemCaNhanTheoLop',
            strQLSV_NguoiHoc_Id: e(a.QLSV_NGUOIHOC_ID), strDaoTao_LopHocPhan_Id: e(a.DIEM_DANHSACHHOC_ID) })
            .then(function (r) {
                var d = r.data || {};
                ui.table({ el: host, rows: arr(d.rsTP).concat(arr(d.rsTKHP)), empty: 'Không có dữ liệu điểm', columns: [
                    { title: 'Đầu điểm', prop: 'DIEM_THANHPHANDIEM_TEN' },
                    { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
                    { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                    { title: 'Kết quả', prop: 'DIEM', cls: 'is-center' },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' },
                    { title: 'Điểm quy đổi', prop: 'DIEMQUYDOI_SO', cls: 'is-center' },
                    { title: 'Điểm quy đổi chữ', prop: 'DIEMQUYDOI_CHU', cls: 'is-center' },
                    { title: 'Ghi chú', prop: 'GHICHU' }] });
            })
            .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'chi tiết điểm'); });
    }

    /* ---------- Chương trình → Kế hoạch --------------------------------- */
    function ghiKeHoach() {
        var a = dsKeHoach.filter(function (x) { return String(x.ID) === String(v('kh')); })[0] || {};
        f('tungay').value = e(a.TUNGAY); f('denngay').value = e(a.DENNGAY); f('loai').value = e(a.MOHINHDANGKY_TEN);
    }
    function chonKeHoach() {
        ghiKeHoach();
        if (!v('kh')) { nhacBang(); return; }
        taiDS();
    }
    var ch;
    function napKeHoach() {
        dsKeHoach = []; pat.fill(f('kh'), [], { head: 'Chọn kế hoạch' }); ghiKeHoach(); nhacBang();
        if (ch) ch.sync();
        if (!v('ct')) return;
        ums.api.call({ action: CHUNG + 'DSA4BRIKJAkuICIpFSkkLg8mNC4oCS4i', func: 'pkg_dangkythi_monthi_chung.LayDSKeHoachTheoNguoiHoc',
            strDaoTao_ChuongTrinh_Id: v('ct'), strQLSV_NguoiHoc_Id: SV })
            .then(function (r) {
                dsKeHoach = arr(r.data);
                pat.fill(f('kh'), dsKeHoach, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' });
                // selectFirst: true của gốc — chọn mục đầu và chạy như người dùng chọn
                if (dsKeHoach.length) { f('kh').value = dsKeHoach[0].ID; if (window.jQuery) jQuery(f('kh')).trigger('change.select2'); }
                ch.sync();
                chonKeHoach();
            })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    }
    if (window.jQuery) {
        jQuery(f('ct')).on('select2:select select2:clear', napKeHoach);
        jQuery(f('kh')).on('select2:select select2:clear', chonKeHoach);
    }
    ch = pat.chain([f('ct'), f('kh')], { phatLai: false });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="xem"]');
        if (b) { taiDS(); return; }
        var l = ev.target.closest('[data-ctd]');
        if (l) {
            var id = l.getAttribute('data-ctd');
            var a = dtThiLai.rsHocPhanDuDK.concat(dtThiLai.rsKetQua).filter(function (x) { return String(x.ID) === id; })[0];
            if (a) chiTietDiem(a);
        }
    });

    nhacBang();
    ums.api.call({ action: CHUNG + 'DSA4BRICKTQuLyYVMygvKQ8mNC4oCS4i', func: 'pkg_dangkythi_monthi_chung.LayDSChuongTrinhNguoiHoc', strQLSV_NguoiHoc_Id: SV })
        .then(function (r) {
            var d = arr(r.data);
            pat.fill(f('ct'), d, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN', head: 'Chọn chương trình' });
            if (d.length) { f('ct').value = d[0].DAOTAO_TOCHUCCHUONGTRINH_ID; if (window.jQuery) jQuery(f('ct')).trigger('change.select2'); }
            ch.sync();
            napKeHoach();
        })
        .catch(function (err) { ums.api.handle(err, 'chương trình'); });
})();
