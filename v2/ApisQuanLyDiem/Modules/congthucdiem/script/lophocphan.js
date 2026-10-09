/* =========================================================================
   lophocphan — Công thức điểm theo LỚP HỌC PHẦN (xâu công thức nhập thẳng trong bảng)
   Bản gốc: ApisQuanLyDiem/Modules/congthucdiem/html/lophocphan.html + script/lophocphan.js
   (bản anh em ApisDangKyHoc/…/kehoachdangky/lophocphan.js lệch nhiều — chỉ tham khảo cách dựng)
   ---------------------------------------------------------------------------
   Bố cục như gốc (một cột): khung tìm kiếm (Thời gian, Hệ, Khoá, Khoa QL, CT, Học phần, Hình thức học —
   đều chọn nhiều; ba ô đánh dấu; Tìm kiếm; Xuất báo cáo; "Chọn trạng thái sinh viên") → khung "Danh sách"
   (đầu khung: Loại điểm · Kế thừa · Mở khóa · Lưu; bảng lớp học phần, cột "Xâu công thức" sửa trong ô).
   Lời gọi (chép nguyên):
     Thời gian:   DKH_Chung/LayThoiGianDangKyHoc (GET, 'type': 'GET')
     Hệ:          edu.system.getList_HeDaoTao → ums.ref.heDaoTao (KHÔNG lọc quyền, như gốc)
     Khoá:        DKH_PhanCong_LopHP/LayDSKhoaToChuc (GET) — strDaoTao_HeDaoTao_Id, strDaoTao_ThoiGianDaoTao_Id
     CT:          DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc (GET) — Thời gian, Khoá, Hệ, Khoa QL
     Khoa QL:     edu.system.getList_KhoaQuanLy → ums.ref.khoaQuanLy
     Học phần:    DKH_PhanCong_LopHP/LayDSHocPhan (GET) — Thời gian, Khoá, Hệ, CT, Khoa QL
     Hình thức học: DKH_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP · pkg_dangkyhoc_chung.LayDSHinhThucHoc
     Loại điểm:   D_ThanhPhanDiem/LayDSThanhPhanTKHP (GET)
     Trạng thái SV: danh mục QLSV.TRANGTHAI (chỉ gửi kèm báo cáo)
     Danh sách:   DKH_ThongTin_MH/DSA4BRINLjEJLiIRKSAv · pkg_dangkyhoc_thongtin.LayDSLopHocPhan (POST, phân trang máy chủ)
                  strTuKhoa '' (txtAAAA), strDangKy_KeHoachDangKy_Id '' (dropSearch_KeHoach không có trên màn)
     Lưu:         D_CongThucDiem_ApDung/ThemMoi — strId '', strPhanCapApDung_Id '', strPhamViApDung_Id (= ID lớp),
                  strDiem_CongThucDiem_Id '', strXauCongThuc = strMa = strTen = xâu trong ô, dThuTu 0, dSoThanhPhanToiThieu 0,
                  dTongHopKhiDuDiem 0, strDaoTao_ThoiGianDaoTao_Id = DAOTAO_THOIGIANDAOTAO_ID của lớp, strNgayApDung '',
                  strDiem_ThanhPhanDiem_Id = Loại điểm
     Kế thừa:     D_ThongTin/KeThucCongThucDiemTheoLopHP (POST) — mỗi lớp đã chọn là strDaoTao_LopHocPhan_Goc_Id; Thời gian /
                  Học phần / Hệ / Khoá / CT lấy từ hộp Kế thừa, dChiLayCacLopChuaPhanCong từ ô đánh dấu của khung tìm kiếm,
                  strTuKhoa '', strDangKy_KeHoachDangKy_Id '', strDaoTao_KhoaQuanLy_Id '' (dropAAAA)
                  Hộp: Thời gian = DKH_Chung/LayThoiGianDangKyHoc · Hệ = KHCT_HeDaoTao/LayDanhSach (GET) · Khoá / CT / Học phần
                  = ba lời gọi DKH_PhanCong_LopHP như trên (Khoa QL '' — ô dropKhoaQuanLy không có trong hộp)
     Mở khóa:     D_ThongTin2_MH/FSkkLB4FKCQsHgIVBR4MLgIpIC8SNCAP · pkg_diem_thongtin2.Them_Diem_CTD_MoChanSua
                  (strPhamViApDung_Id = ID lớp, strLyDo) · danh sách: D_ThongTin2_MH/DSA4BRIFKCQsHgIVBR4MLgIpIC8SNCAP ·
                  pkg_diem_thongtin2.LayDSDiem_CTD_MoChanSua
     Đã phân công → "Chi tiết": DKH_PhanCong_LopHP/LayDanhSach — hộp dùng lại ums.lhp.hopPhamVi của Đăng ký học
     Số SV đã đăng ký: DKH_PhanCong_LopHP/LayDSDangKyHoc (GET)
     Báo cáo:     getList_MauImport("zonebtnBaoCao_LopHocPhan", cb) → ums.report.mount({ import: false }) — khoá gửi kèm
                  đúng thứ tự gốc (mỗi lớp đã chọn một strDangKy_LopHocPhan_Id, mỗi trạng thái một strTrangThaiNguoiHoc_Id)
   Lỗi gốc đã sửa:
     · Hộp Kế thừa: đổi Thời gian TRONG hộp không nạp lại gì (gốc gắn nhầm vào ô Thời gian của khung tìm kiếm) → nay
       nạp lại Khoá / CT / Học phần theo Thời gian của hộp. Nhãn ô đầu gốc ghi "Hệ đào tạo" → "Thời gian".
     · Hộp "Mở khóa sửa": cột "Lý do" đổ nhầm SOQUYDINH (chép từ màn khác) vào một ô nhập không bao giờ được lưu → nay
       hiện LYDOMOCHANSUA (không có thì SOQUYDINH như gốc), chỉ đọc. Bỏ cột ô đánh dấu không nút nào dùng.
     · Lưu: bắt chọn Loại điểm trước (gốc gửi strDiem_ThanhPhanDiem_Id rỗng); báo "Cập nhật thành công" (gốc so strId
       với ID lớp nên luôn ra câu đó).
   Khác gốc:
     · Khoá / CT / Học phần: nhãn "Tất cả …" và nhiều cha → lọc TUỲ CHỌN, không khoá (như bản Đăng ký học); đổi HOẶC
       XOÁ ô cha thì nạp lại ô con (gốc chỉ bắt select2:select). Hộp Kế thừa: Hệ → Khoá → CT khoá theo luật cha → con.
     · Lưu / Kế thừa / Mở khóa hàng loạt: ums.ui.batch rồi nạp lại MỘT lần (gốc Kế thừa không nạp lại).
     · Ô "Xâu công thức" gốc cao 400px mỗi dòng → ô nhiều dòng thấp hơn, kéo giãn được.
   Bỏ (mã chết — không có lối vào trên html gốc): khung "Dồn lớp" #zoneEdit (.btnDonLop không được vẽ), save_SinhVien,
   delete_LopHocPhan, getList_DangKyHoc(KQ), #btnThietLapLopRieng, getList_LopQuanLy/NamNhapHoc(_V2), resetCombobox,
   genList_TrangThaiSV bản đầu (ghi vào main_doc.TinhTrangQuanSo — bị bản sau cùng tên đè).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, L = ums.lhp;
    var root = document.getElementById('qld-lophocphan');
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function iM() { return (ums.session && ums.session.iM) || ''; }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    function goi(p) { return ums.api.call(p).then(function (r) { return arr(r.data); }); }

    function sel(k, ph, nhieu) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' +
            (nhieu ? ' multiple' : '') + '>' + (nhieu ? '' : '<option value=""></option>') + '</select></div>';
    }
    function chk(k, t) { return '<label class="ums-check"><input type="checkbox" data-f="' + k + '"> ' + esc(t) + '</label>'; }

    root.innerHTML = pat.page('Công thức theo lớp học phần', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('tg', 'Chọn thời gian', true) + sel('he', 'Tất cả hệ đào tạo', true) +
                sel('khoa', 'Tất cả khóa đào tạo', true) + sel('kql', 'Tất cả khoa quản lý', true) +
                sel('ct', 'Tất cả chương trình đào tạo', true) +
            '</div>' +
            '<div class="ums-filter qldlhp-h2 ums-u-mt-3">' +
                sel('hp', 'Chọn học phần', true) + sel('htt', 'Chọn hình thức học', true) +
            '</div>' +
            '<div class="qldlhp-nut ums-u-mt-3">' +
                chk('ctdt', 'Lọc theo học phần mở theo chương trình') + chk('cpc', 'Chỉ hiện các lớp chưa phân công') +
                chk('thieu', 'Lọc lớp thiếu công thức') +
                '<span class="qldlhp-nut__gian"></span>' +
                '<span class="qldlhp-nut__nhom">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '<span data-z="bc"></span></span>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div><div data-z="tt"></div>'
        }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
            tools: '<div class="ums-field qldlhp-ld">' + '<select class="ums-select" data-f="ld" data-ph="Chọn loại điểm"><option value=""></option></select></div>' +
                ui.btn('add', { text: 'Kế thừa', icon: 'fa-copy', mod: 'out-success', attr: { 'data-a': 'kethua' } }) +
                ui.btn('confirm', { text: 'Mở khóa', icon: 'fa-lock-open', mod: 'out-warn', attr: { 'data-a': 'mokhoa' } }) +
                ui.btn('save', { attr: { 'data-a': 'luu' } }) });
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? pat.val(f(k)) : ''; }
    function co(k) { return !!(f(k) && f(k).checked); }
    z('bang').innerHTML = ui.empty('Chọn thời gian rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
    L.ganChon(z('bang'));

    /* Đổ danh sách; hệ cũ đặt lại ô về trống khi danh sách không đúng MỘT mục (cbGenCombo_*) */
    function fill(el, rows, opt) {
        pat.fill(el, rows, opt);
        if (rows.length !== 1) {
            if (el.multiple) jQuery(el).val([]); else el.value = '';
            jQuery(el).trigger('change.select2').trigger('ums:refresh');
        }
    }

    /* ---------- Bộ lọc ---------------------------------------------------- */
    var dsThoiGian = goi({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET', type: 'GET', strNguoiThucHien_Id: uid() });
    dsThoiGian.then(function (d) { pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(loi('thời gian đào tạo'));
    function napHe() {
        return ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (d) { fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(loi('hệ đào tạo'));
    }
    function napKhoa() {
        return goi({ action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', type: 'GET',
            strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
            .then(function (d) { fill(f('khoa'), d, { name: 'TENKHOA' }); }).catch(loi('khóa đào tạo'));
    }
    function napCT() {
        return goi({ action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', type: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql') })
            .then(function (d) { fill(f('ct'), d, { name: 'TENCHUONGTRINH' }); }).catch(loi('chương trình đào tạo'));
    }
    function napKQL() {
        return ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN' }); }).catch(loi('khoa quản lý'));
    }
    function tenHP(r) { return e(r.TEN) + ' - ' + e(r.MA); }
    function napHP() {
        return goi({ action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET', type: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_HeDaoTao_Id: v('he'),
            strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') })
            .then(function (d) { pat.fill(f('hp'), d, { name: tenHP }); }).catch(loi('học phần'));
    }
    napHe(); napKhoa(); napCT(); napKQL();
    goi({ action: 'D_ThanhPhanDiem/LayDSThanhPhanTKHP', method: 'GET', type: 'GET', strNguoiThucHien_Id: uid() })
        .then(function (d) { pat.fill(f('ld'), d, { head: 'Chọn loại điểm' }); }).catch(loi('loại điểm'));
    goi({ action: 'DKH_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP', func: 'pkg_dangkyhoc_chung.LayDSHinhThucHoc', strNguoiThucHien_Id: uid() })
        .then(function (d) { pat.fill(f('htt'), d, { name: function (r) { return e(r.TENHINHTHUCHOC) + ' - ' + e(r.MAHINHTHUCHOC); } }); })
        .catch(loi('hình thức học'));
    var tt = pat.checks(z('tt'), ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 });

    function nghe(k, fn) { jQuery(f(k)).on('select2:select select2:unselect select2:clear', fn); }
    nghe('tg', function () { napHe(); napKhoa(); napCT(); napHP(); trang.index = 1; tai(); });
    nghe('he', function () { napKhoa(); napCT(); napHP(); });
    nghe('khoa', function () { napCT(); napHP(); });
    nghe('ct', function () { napHP(); });
    nghe('kql', function () { napCT(); napHP(); });
    nghe('hp', function () { trang.index = 1; tai(); });

    /* ---------- Danh sách lớp học phần ------------------------------------ */
    var DS = [], tong = 0, trang = { index: 1, size: 10 }, lan = 0;
    function tai() {
        var moi = ++lan;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'DKH_ThongTin_MH/DSA4BRINLjEJLiIRKSAv', func: 'pkg_dangkyhoc_thongtin.LayDSLopHocPhan',
            strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strNguoiThucHien_Id: uid(),
            pageIndex: trang.index, pageSize: trang.size,
            dLocGanTheoCTDT: co('ctdt') ? 1 : 0, strDangKy_KeHoachDangKy_Id: '', dChiLayCacLopChuaPhanCong: co('cpc') ? 1 : 0,
            strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_HeDaoTao_Id: v('he'),
            strDaoTao_KhoaQuanLy_Id: v('kql'), strTKB_HinhThucHoc_Id: v('htt')
        }).then(function (r) {
            if (moi !== lan) return;
            DS = arr(r.data); tong = r.pager || 0;
            ve();
        }).catch(function (err) {
            if (moi !== lan) return;
            z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp học phần');
        });
    }
    function ve() {
        /* "Lọc lớp thiếu công thức" lọc TRÊN TRANG vừa nạp (như gốc) */
        var rows = co('thieu') ? DS.filter(function (x) { return !Number(x.CONGTHUCAPDUNGTHEOLOPHP); }) : DS;
        z('n').textContent = '(' + tong + ')';
        ui.table({ el: z('bang'), rows: rows, empty: 'Không có lớp học phần', columns: [
            { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
            { title: 'Tên lớp', prop: 'TENLOP', cls: 'qldlhp-rong' },
            { title: 'Chương trình mở lớp', cls: 'qldlhp-rong', render: function (x) { return esc(e(x.DAOTAO_CHUONGTRINH_TEN) + '(' + e(x.DAOTAO_CHUONGTRINH_MA) + ')'); } },
            { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
            { title: 'Thông tin lịch', cls: 'is-center qldlhp-lich', render: function (x) { return ui.escBr(e(x.THOIGIANCHITIET)); } },
            { title: 'Đã phân công', cls: 'is-center', render: function (x) {
                return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-pv': e(x.ID) } }); } },
            { title: 'Số sv đã đăng ký', cls: 'is-center', render: function (x) {
                return x.SOSVDADANGKY ? ui.btn('view', { text: String(x.SOSVDADANGKY), cls: 'ums-btn--sm', attr: { 'data-sv': e(x.ID), title: 'Số sinh viên đã đăng ký' } }) : ''; } },
            { title: 'Số sv dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' },
            { title: 'Đã khai', cls: 'is-center', render: function (x) { return x.CONGTHUCAPDUNGTHEOLOPHP ? ui.badge('Đã khai', 'ok') : ''; } },
            { title: 'Đã có điểm TKHP', cls: 'is-center', render: function (x) { return x.DACODIEMTKHP ? ui.badge('Đã có điểm', 'info') : ''; } },
            { title: 'Mở khóa sửa', cls: 'is-center', render: function (x) {
                return ui.btn('confirm', { text: 'Mở khóa', icon: 'fa-lock-open', mod: 'out-warn', cls: 'ums-btn--sm', attr: { 'data-mk': e(x.ID) } }); } },
            { title: 'Xâu công thức', render: function (x) {
                return '<textarea class="ums-textarea qldlhp-xau" rows="3" data-xau="' + esc(e(x.ID)) + '">' + esc(e(x.XAUCONGTHUCDIEM)) + '</textarea>'; } },
            L.cotChon('lhp')
        ], page: { index: trang.index, size: trang.size, total: tong,
            onChange: function (p) { trang.index = p; tai(); },
            onSize: function (n) { trang.size = n; trang.index = 1; tai(); } } });
    }
    function chon() { return L.idChon(z('bang'), 'lhp'); }
    function lop(id) { return DS.filter(function (x) { return x.ID === id; })[0] || {}; }
    function xau(id) { var t = z('bang').querySelector('textarea[data-xau="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]'); return t ? t.value : ''; }

    /* ---------- Lưu công thức (btnSave_CongThucDiem) ----------------------- */
    function luu() {
        var ids = chon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        if (!v('ld')) { ui.toast('Vui lòng chọn loại điểm', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { title: 'Lưu công thức', ok: 'Lưu' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                var x = xau(id);
                return { action: 'D_CongThucDiem_ApDung/ThemMoi', strId: '', strPhanCapApDung_Id: '', strPhamViApDung_Id: id,
                    strDiem_CongThucDiem_Id: '', strXauCongThuc: x, strMa: x, strTen: x, dThuTu: 0, dSoThanhPhanToiThieu: 0,
                    dTongHopKhiDuDiem: 0, strDaoTao_ThoiGianDaoTao_Id: e(lop(id).DAOTAO_THOIGIANDAOTAO_ID), strNgayApDung: '',
                    strNguoiThucHien_Id: uid(), strDiem_ThanhPhanDiem_Id: v('ld') };
            }), { title: 'Đang lưu công thức', okText: 'Cập nhật thành công', show: true }).then(tai);
        });
    }

    /* ---------- Hỏi lý do mở khoá (edu.system.confirm + #txtLyMoKhoa) ------- */
    function hoiLyDo() {
        return new Promise(function (xong) {
            var ok = false;
            ui.dialog({ title: 'Mở khóa', icon: 'fa-lock-open', size: 'sm',
                body: ui.field('Lý do', '<input class="ums-input" data-d="lydo" autocomplete="off">'),
                buttons: [{ text: 'Mở khóa', kind: 'confirm', icon: 'fa-lock-open', onClick: function (dlg) {
                    ok = true; xong(dlg.body.querySelector('[data-d="lydo"]').value);
                } }],
                onClose: function () { if (!ok) xong(null); } });
        });
    }
    function moKhoaCall(id, lyDo) {
        return { action: 'D_ThongTin2_MH/FSkkLB4FKCQsHgIVBR4MLgIpIC8SNCAP', func: 'pkg_diem_thongtin2.Them_Diem_CTD_MoChanSua',
            iM: iM(), strPhamViApDung_Id: id, strLyDo: lyDo, strNguoiThucHien_Id: uid() };
    }
    function moKhoaNhieu() {
        var ids = chon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        hoiLyDo().then(function (lyDo) {
            if (lyDo === null) return;
            ui.batch(ids.map(function (id) { return moKhoaCall(id, lyDo); }), { title: 'Đang mở khóa', okText: 'Thực hiện thành công', show: true }).then(tai);
        });
    }

    /* ---------- Hộp "Mở khóa sửa" của một lớp (#myModalMoKhoaSua) ---------- */
    function hopMoKhoa(id) {
        var d = ui.dialog({ title: 'Mở khóa sửa', icon: 'fa-lock-open', size: 'lg', body: '<div data-z="b"></div>',
            buttons: [{ text: 'Mở khóa', kind: 'confirm', icon: 'fa-lock-open', keepOpen: true, onClick: function () {
                hoiLyDo().then(function (lyDo) {
                    if (lyDo === null) return;
                    ums.api.call(moKhoaCall(id, lyDo)).then(function () { ui.toast('Thực hiện thành công', 'ok'); }, loi('mở khóa sửa')).then(nap);
                });
            } }] });
        var b = d.body.querySelector('[data-z="b"]');
        function nap() {
            b.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: 'D_ThongTin2_MH/DSA4BRIFKCQsHgIVBR4MLgIpIC8SNCAP', func: 'pkg_diem_thongtin2.LayDSDiem_CTD_MoChanSua',
                strPhamViApDung_Id: id, strNguoiThucHien_Id: uid() })
                .then(function (r) {
                    ui.table({ el: b, rows: arr(r.data), empty: 'Chưa có lần mở khóa nào', columns: [
                        { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
                        { title: 'Ngày tạo', prop: 'NGAY_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                        { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' },
                        { title: 'Lý do', render: function (x) { return esc(e(x.LYDOMOCHANSUA) !== '' ? e(x.LYDOMOCHANSUA) : e(x.SOQUYDINH)); } }
                    ] });
                }).catch(function (err) { b.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách mở khóa sửa'); });
        }
        nap();
    }

    /* ---------- Hộp danh sách sinh viên của lớp (#myModal) ------------------ */
    function hopSinhVien(id) {
        var d = ui.dialog({ title: 'Danh sách sinh viên', icon: 'fa-users', size: 'xl', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
        ums.api.call({ action: 'DKH_PhanCong_LopHP/LayDSDangKyHoc', method: 'GET', type: 'GET', strTuKhoa: '',
            strDaoTao_LopHocPhan_Id: id, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000 })
            .then(function (r) {
                ui.table({ el: d.body, rows: arr(r.data), empty: 'Không có sinh viên', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-center' },
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }
                ] });
            }).catch(function (err) { d.body.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
    }

    /* ---------- Hộp Kế thừa (#myModalKeThua) -------------------------------- */
    function hopKeThua() {
        var ids = chon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        function s1(k, nhan, ph) { return ui.field(nhan, '<select class="ums-select" data-k="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>'); }
        var d = ui.dialog({ title: 'Kế thừa', icon: 'fa-copy', size: 'md',
            body: s1('tg', 'Thời gian', 'Chọn thời gian') + s1('he', 'Hệ đào tạo', 'Chọn hệ đào tạo') +
                s1('khoa', 'Khóa đào tạo', 'Chọn khóa đào tạo') + s1('ct', 'Chương trình', 'Chọn chương trình đào tạo') +
                s1('hp', 'Học phần', 'Chọn học phần'),
            buttons: [{ text: 'Kế thừa', kind: 'save', icon: 'fa-copy', keepOpen: true, onClick: function (dlg) {
                ui.confirm('Bạn có muốn kế thừa không?', { title: 'Kế thừa', ok: 'Kế thừa' }).then(function (yes) {
                    if (!yes) return;
                    var p = { tg: k('tg'), hp: k('hp'), he: k('he'), khoa: k('khoa'), ct: k('ct') };
                    dlg.close();
                    ui.batch(ids.map(function (id) {
                        return { action: 'D_ThongTin/KeThucCongThucDiemTheoLopHP', method: 'POST', type: 'POST', strTuKhoa: '',
                            strDaoTao_LopHocPhan_Goc_Id: id, strDaoTao_ThoiGianDaoTao_Id: p.tg, strDaoTao_HocPhan_Id: p.hp,
                            strDangKy_KeHoachDangKy_Id: '', dChiLayCacLopChuaPhanCong: co('cpc') ? 1 : 0,
                            strDaoTao_HeDaoTao_Id: p.he, strDaoTao_KhoaDaoTao_Id: p.khoa, strDaoTao_ChuongTrinh_Id: p.ct,
                            strDaoTao_KhoaQuanLy_Id: '', strNguoiThucHien_Id: uid() };
                    }), { title: 'Đang kế thừa', okText: 'Kế thừa thành công', show: true }).then(tai);
                });
            } }] });
        ui.enhance(d.body);
        function q(x) { return d.body.querySelector('[data-k="' + x + '"]'); }
        function k(x) { return pat.val(q(x)); }
        dsThoiGian.then(function (ds) { pat.fill(q('tg'), ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); });
        goi({ action: 'KHCT_HeDaoTao/LayDanhSach', method: 'GET', strDAOTAO_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
            strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (ds) { pat.fill(q('he'), ds, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }).catch(loi('hệ đào tạo'));
        function khoa2() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', type: 'GET', strDaoTao_HeDaoTao_Id: k('he'), strDaoTao_ThoiGianDaoTao_Id: k('tg') })
                .then(function (ds) { pat.fill(q('khoa'), ds, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }).catch(loi('khóa đào tạo'));
        }
        function ct2() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', type: 'GET', strDaoTao_ThoiGianDaoTao_Id: k('tg'),
                strDaoTao_KhoaDaoTao_Id: k('khoa'), strDaoTao_HeDaoTao_Id: k('he'), strDaoTao_KhoaQuanLy_Id: '' })
                .then(function (ds) { pat.fill(q('ct'), ds, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' }); }).catch(loi('chương trình đào tạo'));
        }
        function hp2() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET', type: 'GET', strDaoTao_ThoiGianDaoTao_Id: k('tg'),
                strDaoTao_KhoaDaoTao_Id: k('khoa'), strDaoTao_HeDaoTao_Id: k('he'), strDaoTao_ChuongTrinh_Id: k('ct'), strDaoTao_KhoaQuanLy_Id: '' })
                .then(function (ds) { pat.fill(q('hp'), ds, { name: tenHP, head: 'Chọn học phần' }); }).catch(loi('học phần'));
        }
        hp2();
        /* Hệ → Khoá → CT: khoá con khi chưa chọn cha (luật chung); gắn TRƯỚC trình nạp để đọc được giá trị đã xoá trắng */
        pat.chain([q('he'), q('khoa'), q('ct')], { phatLai: false });
        function ngheK(x, fn) { jQuery(q(x)).on('select2:select select2:clear', fn); }
        ngheK('tg', function () { if (k('he')) khoa2(); if (k('khoa')) ct2(); hp2(); });
        ngheK('he', function () { if (k('he')) khoa2(); hp2(); });
        ngheK('khoa', function () { if (k('khoa')) ct2(); hp2(); });
        ngheK('ct', hp2);
    }

    /* ---------- Báo cáo ---------------------------------------------------- */
    ums.report.mount(z('bc'), { import: false, collect: function (add) {
        add('strDaoTao_ThoiGianDaoTao_Id', v('tg'));
        add('strDaoTao_KhoaDaoTao_Id', v('khoa'));
        add('strDaoTao_ChuongTrinh_Id', v('ct'));
        add('strDaoTao_HocPhan_Id', v('hp'));
        add('strDaoTao_HeDaoTao_Id', v('he'));
        add('strDaoTao_KhoaQuanLy_Id', v('kql'));
        chon().forEach(function (id) { add('strDangKy_LopHocPhan_Id', id); });
        tt.ids().forEach(function (id) { add('strTrangThaiNguoiHoc_Id', id); });
    } });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a], [data-pv], [data-sv], [data-mk]');
        if (!b || b.disabled || !root.contains(b)) return;
        if (b.hasAttribute('data-pv')) return L.hopPhamVi(b.getAttribute('data-pv'));
        if (b.hasAttribute('data-sv')) return hopSinhVien(b.getAttribute('data-sv'));
        if (b.hasAttribute('data-mk')) return hopMoKhoa(b.getAttribute('data-mk'));
        var a = b.getAttribute('data-a');
        if (a === 'search') { trang.index = 1; tai(); }
        else if (a === 'luu') luu();
        else if (a === 'kethua') hopKeThua();
        else if (a === 'mokhoa') moKhoaNhieu();
    });
})();
