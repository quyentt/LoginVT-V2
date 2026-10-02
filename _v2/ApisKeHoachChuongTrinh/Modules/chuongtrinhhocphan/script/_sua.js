/* =========================================================================
   Chương trình – học phần (KHCT) — "Chỉnh sửa học phần" và "Tình trạng học"
   Bản gốc: ApisKeHoachChuongTrinh/Modules/chuongtrinhhocphan/script/cthp.js
     sua  zone_edithocphan   Thông tin học phần · Quan hệ học phần (+ Kế thừa) · Quan hệ tương đương ·
                             Quan hệ thay thế · Bài học · Phân bổ học phần — Xóa học phần | Đóng · Lưu
     kq   zone_ketquahocphan Tình trạng học: ba bảng người học (chưa có điểm / chưa hoàn thành / đã hoàn thành)

   Lời gọi (chép nguyên; GET/POST theo gốc):
     KHCT_HocPhan_ChuongTrinh/CapNhat   (Lưu) — dHocTrinh_HocTap, dHocTrinh_TinhTien, dLaMonTinhDiem,
                                          strDaoTao_ThoiGian_KH_Id / _TT_Id (ô chọn nhiều → "a,b"),
                                          strPhanCongPhamViDamNhiem_Id, dThuTu, strThuocTinhHocPhan_Id
     KHCT_HocPhan_ChuongTrinh/Xoa       (Xóa học phần)
     KHCT_HocPhan_TietHoc/LayDanhSach (GET) · pkg_kehoach_thongtin.Them_ / Sua_ / Xoa_DaoTao_HocPhan_CT_PhanBo
                                          (Phân bổ — lưu SAU khi Lưu học phần; có thêm dSoTin — gốc đổi 27/09/2026)
     pkg_kehoach_thongtin2.LayDSChuaGan_ / LayDSDaGan_ / Them_ / Xoa_HocPhanTD_SinhVien | HocPhanTT_SinhVien
                                          (hộp "Phạm vi áp dụng" của từng dòng tương đương / thay thế — gốc thêm 27/09/2026)
     KHCT_QuanHeHocPhan/LayDanhSach (GET) · ThemMoi · Xoa
     KHCT_ThongTin/LayDSKS_DaoTao_HocPhanTD (GET) · Them_DaoTao_HocPhanTuongDuong · Xoa_DaoTao_HocPhanTuongDuong
     pkg_kehoach_thongtin2.LayDSKS_DaoTao_HocPhanThayThe · Them_DaoTao_HocPhanThayThe · Xoa_DaoTao_HocPhanThayThe
     KHCT_BaiHoc/LayDanhSach (GET) · ThemMoi · Xoa
     KHCT_HocPhan_ChuongTrinh/LayDanhSach (GET) — học phần của chương trình chọn ở ô tương đương / thay thế
     edu.system.getList_ChuongTrinhDaoTao (ums.ref.chuongTrinh, chỉ strKhoaDaoTao_Id) — ô chương trình
     pkg_kehoach_thongtin2.KeThua_DaoTao_QuanHeHocPhan — hộp "Kế thừa quan hệ học phần", bộ lọc
       edu.extend.genBoLoc_HeKhoa("_QHKT", true) = bản KHÔNG lọc quyền (bKoCheckQuyen) — gọi đúng
       LayDSDaoTao_HeDaoTao / LayDSKS_DaoTao_KhoaDaoTao / LayDSKS_DaoTao_ToChucCT với bộ tham số của genBoLoc
     D_KQHocTapTheoChuongTrinh/LayKQHocTapTheoChuongTrinh (GET + type 'GET') — Tình trạng học
     danh mục: KHCT.PHAMVIDAMNHIEM, KHCT.TTHP, KHCT.LQH, KHCT.QHHP.MUCDIEUKIEN, KHCT.QHHP.TOANTUDIEUKIEN, KHCT.LOAIPHANBO

   LỖI BẢN GỐC — làm theo ý định:
     · Phân bổ: gốc lưu MỌI dòng kể cả dòng trống (loại phân bổ rỗng → bản ghi rỗng). Nay chỉ lưu
       dòng đã chọn loại phân bổ.
     · "Kế thừa" quan hệ: gốc báo "Vui lòng chọn đối tượng?" nhưng vẫn mở hộp. Nay chưa đánh dấu
       quan hệ nào thì không mở hộp.
     · Quan hệ thay thế: gốc có hai bộ tham số (bộ KHCT_ThongTin cũ bị ghi đè ngay) — chép bộ đang
       chạy (pkg_kehoach_thongtin2). Ô tương đương / thay thế dùng chung danh sách khoá theo Hệ đang
       chọn ở thanh lọc (genComBo_KhoaDaoTao) — như gốc.
     · Mã / Tên học phần: gốc là ô nhập nhưng KHÔNG gửi đi khi Lưu → nay chỉ đọc (sửa mã / tên ở
       danh mục học phần).
     · Lưu học phần xong gốc không nạp lại bảng học phần — nay nạp lại.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat, K = ums.khctCt;
    if (!K || !K.api) return;
    var e = K.e, esc = K.esc, rows = K.rows;
    var TT2 = 'KHCT_ThongTin2_MH/', PK2 = 'pkg_kehoach_thongtin2.';
    var TT1 = 'KHCT_ThongTin_MH/', PK1 = 'pkg_kehoach_thongtin.';
    var cur = null;          // dòng học phần – chương trình đang sửa

    function fld(nhan, html, rong) {
        return '<div class="ums-field"' + (rong ? ' style="grid-column:1 / -1"' : '') + '><label class="ums-field__label">' + esc(nhan) + '</label>' +
            '<div class="ums-field__control">' + html + '</div></div>';
    }
    function inp(k, ph, ro) { return '<input class="ums-input" data-k="' + k + '" placeholder="' + esc(ph || '') + '" autocomplete="off"' + (ro ? ' readonly' : '') + '>'; }
    function sel(k, ph, extra) { return '<select class="ums-select" data-k="' + k + '" data-ph="' + esc(ph) + '"' + (extra || '') + '><option value="">' + esc(ph) + '</option></select>'; }
    function nhom(tieuDe, tools) {
        return '<div class="ums-row khct-nhomhang"><div class="ums-legend ums-u-flex1">' + esc(tieuDe) + '</div>' + (tools || '') + '</div>';
    }
    function themO(k, nhan, html) { return '<div class="ums-field" data-o="' + k + '"><label class="ums-field__label">' + esc(nhan) + '</label><div class="ums-field__control">' + html + '</div></div>'; }

    var S = K.vung('sua',
        pat.panel({ title: 'Chỉnh sửa học phần', icon: 'fa-pen-to-square', count: 'ten', cls: 'khct-vung', flush: true,
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body:
                '<div class="khct-pad">' +
                    '<div class="ums-legend">Thông tin học phần</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                        fld('Mã học phần', inp('ma', '', true)) + fld('Tên học phần', inp('tenHP', '', true)) +
                        fld('Phạm vi đảm nhiệm', sel('phamVi', 'Chọn phạm vi đảm nhiệm')) + fld('Thuộc tính học phần', sel('thuocTinh', 'Chọn thuộc tính học phần')) +
                        fld('Số tín học phần', inp('soTin', 'Số tín học phần')) + fld('Số tín học phí', inp('soTinPhi', 'Số tín học phí')) +
                        fld('Là môn tính điểm', '<select class="ums-select" data-k="tinhDiem" data-required><option value="1">Tính điểm</option><option value="0">Không tính điểm</option></select>') +
                        fld('Thứ tự', inp('thuTu', 'Thứ tự')) +
                        fld('Học kỳ dự kiến', sel('kyDK', 'Chọn học kỳ', ' multiple')) + fld('Học kỳ thực tế', sel('kyTT', 'Chọn học kỳ', ' multiple')) +
                    '</div>' +
                    nhom('Quan hệ học phần', ui.btn('edit', { text: 'Kế thừa', mod: 'primary', attr: { 'data-a': 'keThuaQH' } })) +
                '</div>' +
                '<div data-z="qh"></div>' +
                '<div class="khct-pad"><div class="ums-filter khct-them">' +
                    themO('loai', 'Loại quan hệ', sel('qhLoai', 'Chọn loại quan hệ')) +
                    themO('hp', 'Học phần', sel('qhHP', 'Chọn học phần')) +
                    themO('muc', 'Mức', sel('qhMuc', 'Chọn mức')) +
                    themO('toantu', 'Toán tử', sel('qhToanTu', 'Chọn toán tử')) +
                    themO('gt', 'Giá trị', inp('qhGiaTri', 'Giá trị')) +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'themQH' } }) + '</div>' +
                '</div>' + nhom('Quan hệ tương đương') + '</div>' +
                '<div data-z="td"></div>' +
                '<div class="khct-pad"><div class="ums-filter khct-them">' +
                    themO('k', 'Khóa đào tạo', sel('tdKhoa', 'Chọn khóa đào tạo')) +
                    themO('c', 'Chương trình đào tạo', sel('tdCT', 'Chọn chương trình đào tạo')) +
                    themO('h', 'Học phần tương đương', sel('tdHP', 'Chọn học phần')) +
                    themO('n', 'Nhóm', inp('tdNhom', 'Nhóm')) +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'themTD' } }) + '</div>' +
                '</div>' + nhom('Quan hệ thay thế') + '</div>' +
                '<div data-z="tt"></div>' +
                '<div class="khct-pad"><div class="ums-filter khct-them">' +
                    themO('k', 'Khóa đào tạo', sel('ttKhoa', 'Chọn khóa đào tạo')) +
                    themO('c', 'Chương trình đào tạo', sel('ttCT', 'Chọn chương trình đào tạo')) +
                    themO('h', 'Học phần tương đương', sel('ttHP', 'Chọn học phần')) +
                    themO('n', 'Nhóm', inp('ttNhom', 'Nhóm')) +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'themTT' } }) + '</div>' +
                '</div>' + nhom('Bài học') + '</div>' +
                '<div data-z="bh"></div>' +
                '<div class="khct-pad"><div class="ums-filter khct-them">' +
                    themO('t', 'Tên bài', inp('bhTen', 'Tên bài')) +
                    themO('k', 'Ký hiệu', inp('bhKyHieu', 'Ký hiệu')) +
                    themO('s', 'Số tiết', inp('bhSoTiet', 'Số tiết')) +
                    themO('n', 'Nội dung', inp('bhNoiDung', 'Nội dung')) +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'themBH' } }) + '</div>' +
                '</div></div>' +
                '<div class="khct-pad khct-pad--cach" data-z="pb"></div>',
            foot: ui.btn('del', { text: 'Xóa học phần', attr: { 'data-a': 'xoaHP' } }) + '<div class="ums-u-flex1"></div>' +
                ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }) }));
    function z(k) { return S.querySelector('[data-z="' + k + '"]'); }
    function o(k) { return S.querySelector('[data-k="' + k + '"]'); }
    function v(k) { return pat.val(o(k)); }
    function dat(k, x) {
        var el = o(k);
        if (!el) return;
        if (el.multiple && window.jQuery) jQuery(el).val(x || []);
        else el.value = x === undefined || x === null ? '' : x;
        if (window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh');
    }

    /* Danh mục của biểu mẫu */
    [['phamVi', 'KHCT.PHAMVIDAMNHIEM'], ['thuocTinh', 'KHCT.TTHP'], ['qhLoai', 'KHCT.LQH'],
     ['qhMuc', 'KHCT.QHHP.MUCDIEUKIEN'], ['qhToanTu', 'KHCT.QHHP.TOANTUDIEUKIEN']].forEach(function (x) {
        ums.api.dm(x[1]).then(function (r) { pat.fill(o(x[0]), r); }).catch(function () {});
    });
    /* Ô "Học phần" của quan hệ = học phần của chương trình (genCombo_HocPhan_ChuongTrinh) */
    function tenMaHP(x) { return e(x.DAOTAO_HOCPHAN_MA) + ' - ' + e(x.DAOTAO_HOCPHAN_TEN); }
    var cuHP = K.onHP;
    K.onHP = function (list) { if (cuHP) cuHP(list); pat.fill(o('qhHP'), list, { id: 'DAOTAO_HOCPHAN_ID', name: tenMaHP, head: 'Chọn học phần' }); };
    var cuKhoa = K.onKhoa;
    K.onKhoa = function (list) {
        if (cuKhoa) cuKhoa(list);
        pat.fill(o('tdKhoa'), list, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' });
        pat.fill(o('ttKhoa'), list, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' });
    };

    /* Khoá → Chương trình → Học phần (tương đương, thay thế) */
    function napCT(kKhoa, kCT, kHP) {
        pat.fill(o(kHP), [], { head: 'Chọn học phần' });
        if (!v(kKhoa)) { pat.fill(o(kCT), [], { head: 'Chọn chương trình đào tạo' }); return; }
        ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v(kKhoa), pageIndex: 1, pageSize: 10000 })
            .then(function (r) { pat.fill(o(kCT), r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' }); })
            .catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
    }
    function napHP(kCT, kHP) {
        if (!v(kCT)) { pat.fill(o(kHP), [], { head: 'Chọn học phần' }); return; }
        ums.api.call({ action: 'KHCT_HocPhan_ChuongTrinh/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strDaoTao_ThoiGian_KH_Id: '', strDaoTao_ThoiGian_TT_Id: '', strThuocTinhHocPhan_Id: '',
            strPhanCongPhamViDamNhiem_Id: '', strDaoTao_HocPhan_Id: '', strDaoTao_ChuongTrinh_Id: v(kCT),
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 })
            .then(function (r) { pat.fill(o(kHP), rows(r), { id: 'DAOTAO_HOCPHAN_ID', name: tenMaHP, head: 'Chọn học phần' }); })
            .catch(function (err) { ums.api.handle(err, 'học phần của chương trình'); });
    }
    if (window.jQuery) {
        jQuery(o('tdKhoa')).on('select2:select select2:clear', function () { napCT('tdKhoa', 'tdCT', 'tdHP'); });
        jQuery(o('tdCT')).on('select2:select select2:clear', function () { napHP('tdCT', 'tdHP'); });
        jQuery(o('ttKhoa')).on('select2:select select2:clear', function () { napCT('ttKhoa', 'ttCT', 'ttHP'); });
        jQuery(o('ttCT')).on('select2:select select2:clear', function () { napHP('ttCT', 'ttHP'); });
    }
    pat.chain([o('tdKhoa'), o('tdCT'), o('tdHP')], { phatLai: false });
    pat.chain([o('ttKhoa'), o('ttCT'), o('ttHP')], { phatLai: false });
    if (K.dsKhoa.length) K.onKhoa(K.dsKhoa);

    /* Phân bổ học phần — lưới dòng (genHTML_PhanBo / genTable_HocPhan_PhanBo), lưu sau khi Lưu học phần */
    var PB = pat.rows(z('pb'), {
        title: 'Phân bổ học phần', icon: 'fa-chart-pie',
        columns: [
            { key: 'strLoaiPhanBo_Id', col: 'LOAIPHANBO_ID', title: 'Loại phân bổ', type: 'select', source: { dm: 'KHCT.LOAIPHANBO' }, placeholder: '--- Chọn loại phân bổ--' },
            { key: 'dSoTiet', col: 'SOTIET', title: 'Số tiết', width: '200px' },
            { key: 'dSoTin', col: 'SOTIN', title: 'Số tín chỉ', width: '160px' }
        ],
        minRows: 1,
        list: function (hp) {
            return { action: 'KHCT_HocPhan_TietHoc/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HocPhan_Id: hp,
                strDaoTao_ToChucCT_Id: K.ctId(), strLoaiPhanBo_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 };
        },
        filled: function (x) { return !!x.strLoaiPhanBo_Id; },
        save: function (x, rec, hp) {
            return { action: TT1 + (rec ? 'EjQgHgUgLhUgLh4JLiIRKSAvHgIVHhEpIC8DLgPP' : 'FSkkLB4FIC4VIC4eCS4iESkgLx4CFR4RKSAvAy4P'),
                func: PK1 + (rec ? 'Sua_DaoTao_HocPhan_CT_PhanBo' : 'Them_DaoTao_HocPhan_CT_PhanBo'), strId: rec ? rec.ID : '',
                strDaoTao_HocPhan_Id: hp, strDaoTao_ToChucCT_Id: K.ctId(), strLoaiPhanBo_Id: x.strLoaiPhanBo_Id,
                dSoTiet: x.dSoTiet, dSoTin: x.dSoTin, strNguoiThucHien_Id: '' };
        },
        remove: function (rec) {
            return { action: TT1 + 'GS4gHgUgLhUgLh4JLiIRKSAvHgIVHhEpIC8DLgPP', func: PK1 + 'Xoa_DaoTao_HocPhan_CT_PhanBo', strIds: rec.ID, strNguoiThucHien_Id: '' };
        }
    });
    ui.enhance(S);

    /* ---------- Bốn bảng quan hệ / bài học --------------------------------- */
    function hp() { return cur ? cur.DAOTAO_HOCPHAN_ID : ''; }
    function xoaNut(bang, id) {
        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoa="' + bang + '" data-id="' + esc(id) + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
    }
    function soTin(r) { return esc(e(r.SOTIN !== undefined && r.SOTIN !== null ? r.SOTIN : (r.SOTINCHI !== undefined && r.SOTINCHI !== null ? r.SOTINCHI : r.SO_TIN_CHI))); }
    function pvNut(kieu, id, ten) {
        return ui.btn('primary', { text: 'Phạm vi áp dụng', icon: 'fa-users', mod: 'out-primary', cls: 'ums-btn--sm',
            attr: { 'data-pv': kieu, 'data-id': e(id), 'data-ten': e(ten) } });
    }

    /* ---------- Hộp "Phạm vi áp dụng" (myModal_PhamViApDung — gốc thêm 27/09/2026) -----------------------
       Mỗi dòng quan hệ tương đương (TD) / thay thế (TT) gán cho TỪNG người học: hai bảng cạnh nhau như gốc
       (col-6 | col-6) — "chưa gán" (nút Gán phạm vi) và "đã gán" (nút Huỷ phạm vi, hỏi lại như gốc).
       Tiêu đề gốc là chữ mẫu ("Tiêu đề - hiện thông tin quan hệ … - Môn gốc … - Môn tương đương (Môn chọn)")
       → làm theo ý định: ghi thật tên môn gốc (học phần đang sửa) và môn tương đương / thay thế của dòng.
       Cột trả về chưa rõ tên — dò như gốc: ID người học QLSV_NGUOIHOC_ID || ID (bảng đã gán: ID dòng trước),
       mã QLSV_NGUOIHOC_MASO || MASO || MANGUOIHOC, họ tên …_HOTEN || HOTEN || TEN, lớp LOP || TENLOP || LOPHOC. */
    function moPhamVi(kieu, id, tenChon) {
        var tt = kieu === 'TT', loai = tt ? 'thay thế' : 'tương đương';
        var thamSo = tt ? { strHocPhanTT_Id: id } : { strHocPhanTD_Id: id };
        function goi(action, func, them) {
            var x = { action: TT2 + action, func: PK2 + func, strNguoiThucHien_Id: '' };
            Object.keys(thamSo).forEach(function (k) { x[k] = thamSo[k]; });
            Object.keys(them || {}).forEach(function (k) { x[k] = them[k]; });
            return ums.api.call(x);
        }
        var ACT = tt
            ? { chua: ['DSA4BRICKTQgBiAvHgkuIhEpIC8VFQPP', 'LayDSChuaGan_HocPhanTT'], da: ['DSA4BRIFIAYgLx4JLiIRKSAvFRUP', 'LayDSDaGan_HocPhanTT'],
                gan: ['FSkkLB4JLiIRKSAvFRUeEigvKRcoJC8P', 'Them_HocPhanTT_SinhVien'], huy: ['GS4gHgkuIhEpIC8VFR4SKC8pFygkLwPP', 'Xoa_HocPhanTT_SinhVien'] }
            : { chua: ['DSA4BRICKTQgBiAvHgkuIhEpIC8VBQPP', 'LayDSChuaGan_HocPhanTD'], da: ['DSA4BRIFIAYgLx4JLiIRKSAvFQUP', 'LayDSDaGan_HocPhanTD'],
                gan: ['FSkkLB4JLiIRKSAvFQUeEigvKRcoJC8P', 'Them_HocPhanTD_SinhVien'], huy: ['GS4gHgkuIhEpIC8VBR4SKC8pFygkLwPP', 'Xoa_HocPhanTD_SinhVien'] };
        var goc = cur ? e(cur.DAOTAO_HOCPHAN_MA) + ' - ' + e(cur.DAOTAO_HOCPHAN_TEN) : '';
        var dlg = ui.dialog({ title: 'Phạm vi áp dụng', icon: 'fa-users', size: 'xl',
            body: '<p class="ums-u-fz13 ums-u-mb-4">Quan hệ ' + loai + ' — Môn gốc: <b>' + esc(goc) + '</b> · Môn ' + loai + ': <b>' + esc(e(tenChon)) + '</b></p>' +
                '<div class="ums-grid ums-grid--2">' +
                pat.panel({ title: 'Danh sách người học chưa gán phạm vi', icon: 'fa-user-plus', flush: true, body: '<div data-pv-bang="chua"></div>' }) +
                pat.panel({ title: 'Danh sách người học đã gán phạm vi', icon: 'fa-user-check', flush: true, body: '<div data-pv-bang="da"></div>' }) +
                '</div>' });
        var B = dlg.body;
        function cot(tacVu) {
            return [
                { title: 'Mã số', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_MASO || r.MASO || r.MANGUOIHOC)); } },
                { title: 'Họ tên', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HOTEN || r.HOTEN || r.TEN)); } },
                { title: 'Lớp', render: function (r) { return esc(e(r.LOP || r.TENLOP || r.LOPHOC)); } },
                { title: 'Chọn', cls: 'is-center is-actions', width: '130px', render: function (r) {
                    var idNh = tacVu === 'gan' ? e(r.QLSV_NGUOIHOC_ID || r.ID) : e(r.ID || r.QLSV_NGUOIHOC_ID);
                    return tacVu === 'gan'
                        ? ui.btn('add', { text: 'Gán phạm vi', cls: 'ums-btn--sm', attr: { 'data-pv-gan': idNh } })
                        : ui.btn('del', { text: 'Huỷ phạm vi', cls: 'ums-btn--sm', attr: { 'data-pv-huy': idNh } });
                } }
            ];
        }
        function veBang(k, tacVu, act) {
            var el = B.querySelector('[data-pv-bang="' + k + '"]');
            el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return goi(act[0], act[1]).then(function (r) {
                ui.table({ el: el, rows: rows(r), columns: cot(tacVu), empty: 'Không có người học' });
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, act[1]); });
        }
        function napLai() { veBang('chua', 'gan', ACT.chua); veBang('da', 'huy', ACT.da); }
        B.addEventListener('click', function (ev) {
            var g = ev.target.closest('[data-pv-gan]'), h = ev.target.closest('[data-pv-huy]');
            if (g) {
                var idG = g.getAttribute('data-pv-gan');
                if (!idG) return;
                goi(ACT.gan[0], ACT.gan[1], { strQLSV_NguoiHoc_Id: idG }).then(napLai)
                    .catch(function (err) { ums.api.handle(err, 'gán phạm vi'); });
            } else if (h) {
                var idH = h.getAttribute('data-pv-huy');
                if (!idH) return;
                ui.confirm('Bạn có muốn hủy phạm vi cho sinh viên này không?', { tone: 'bad', ok: 'Huỷ phạm vi' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: TT2 + ACT.huy[0], func: PK2 + ACT.huy[1], strIds: idH, strNguoiThucHien_Id: '' }).then(napLai);
                }).catch(function (err) { ums.api.handle(err, 'huỷ phạm vi'); });
            }
        });
        napLai();
    }

    var BANG = {
        qh: {
            tai: function () {
                return { action: 'KHCT_QuanHeHocPhan/LayDanhSach', method: 'GET', strTuKhoa: '', strLoaiQuanHe_Id: '',
                    strDaoTao_ToChucCT_Id: K.ctId(), strDaoTao_HocPhan_QuanHe_Id: '', strDaoTao_HocPhan_Id: hp(),
                    strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 };
            },
            cot: [
                { title: 'Loại quan hệ', prop: 'LOAIQUANHE_TEN' },
                { title: 'Học phần', render: function (r) { return esc(e(r.DAOTAO_HOCPHAN_QUANHE_TEN) + ' - ' + e(r.DAOTAO_HOCPHAN_QUANHE_MA)); } },
                { title: 'Mức đk', prop: 'MUCDIEUKIEN_TEN' },
                { title: 'Xâu điều kiện', render: function (r) { return esc(e(r.TOANTU_TEN) + ' ' + e(r.GIATRIDIEUKIEN)); } },
                { title: 'Xoá', cls: 'is-center is-actions', width: '60px', render: function (r) { return xoaNut('qh', r.ID); } },
                { head: '<input type="checkbox" data-qhall title="Chọn tất cả (kế thừa)">', cls: 'is-center is-actions', width: '44px', render: function (r) {
                    return '<input type="checkbox" data-qhck="' + esc(r.ID) + '" title="Chọn để kế thừa">';
                } }
            ],
            xoa: function (id) { return { action: 'KHCT_QuanHeHocPhan/Xoa', strIds: id, strNguoiThucHien_Id: '' }; },
            rong: 'Chưa có quan hệ học phần'
        },
        td: {
            tai: function () {
                return { action: 'KHCT_ThongTin/LayDSKS_DaoTao_HocPhanTD', method: 'GET', strTuKhoa: '', strDaoTao_HocPhan_TD_Id: '',
                    strDaoTao_ToChucCT_TD_Id: '', strDaoTao_ToChucCT_Id: K.ctId(), strDaoTao_HocPhan_Id: hp(),
                    strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 };
            },
            cot: [
                { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TD_TEN' },
                { title: 'Chương trình đào tạo', prop: 'DAOTAO_CHUONGTRINH_TD_TEN' },
                { title: 'Học phần tương đương', prop: 'DAOTAO_HOCPHAN_TD_TEN' },
                { title: 'Số tín chỉ', cls: 'is-center', render: soTin },
                { title: 'Nhóm', prop: 'NHOM', cls: 'is-center' },
                { title: 'Phạm vi áp dụng', cls: 'is-center is-actions', render: function (r) { return pvNut('TD', r.ID, r.DAOTAO_HOCPHAN_TD_TEN); } },
                { title: 'Xoá', cls: 'is-center is-actions', width: '60px', render: function (r) { return xoaNut('td', r.ID); } }
            ],
            xoa: function (id) { return { action: 'KHCT_ThongTin/Xoa_DaoTao_HocPhanTuongDuong', strIds: id, strNguoiThucHien_Id: '' }; },
            rong: 'Chưa có quan hệ tương đương'
        },
        tt: {
            tai: function () {
                return { action: TT2 + 'DSA4BRIKEh4FIC4VIC4eCS4iESkgLxUpIDgVKSQP', func: PK2 + 'LayDSKS_DaoTao_HocPhanThayThe',
                    strTuKhoa: '', strDaoTao_HocPhan_Id: hp(), strDaoTao_ToChucCT_Id: K.ctId(), strDaoTao_HocPhan_TT_Id: '',
                    strDaoTao_ToChucCT_TT_Id: '', strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: '', strNguoiThucHien_Id: '',
                    pageIndex: 1, pageSize: 10000 };
            },
            cot: [
                { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TT_TEN' },
                { title: 'Chương trình đào tạo', prop: 'DAOTAO_CHUONGTRINH_TT_TEN' },
                { title: 'Học phần thay thế', prop: 'DAOTAO_HOCPHAN_TT_TEN' },
                { title: 'Số tín chỉ', cls: 'is-center', render: soTin },
                { title: 'Nhóm', prop: 'NHOM', cls: 'is-center' },
                { title: 'Phạm vi áp dụng', cls: 'is-center is-actions', render: function (r) { return pvNut('TT', r.ID, r.DAOTAO_HOCPHAN_TT_TEN); } },
                { title: 'Xoá', cls: 'is-center is-actions', width: '60px', render: function (r) { return xoaNut('tt', r.ID); } }
            ],
            xoa: function (id) { return { action: TT2 + 'GS4gHgUgLhUgLh4JLiIRKSAvFSkgOBUpJAPP', func: PK2 + 'Xoa_DaoTao_HocPhanThayThe', strIds: id, strNguoiThucHien_Id: '' }; },
            rong: 'Chưa có quan hệ thay thế'
        },
        bh: {
            tai: function () {
                return { action: 'KHCT_BaiHoc/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HocPhan_Id: hp(),
                    strDaoTao_ToChucCT_Id: K.ctId(), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 };
            },
            cot: [
                { title: 'Tên bài', prop: 'TENBAI' },
                { title: 'Ký hiệu', prop: 'KYHIEUBAI', cls: 'is-center' },
                { title: 'Số tiết', prop: 'SOTIET', cls: 'is-center' },
                { title: 'Nội dung', prop: 'NOIDUNG' },
                { title: 'Xoá', cls: 'is-center is-actions', width: '60px', render: function (r) { return xoaNut('bh', r.ID); } }
            ],
            xoa: function (id) { return { action: 'KHCT_BaiHoc/Xoa', strIds: id, strNguoiThucHien_Id: '' }; },
            rong: 'Chưa có bài học'
        }
    };
    function tai(k) {
        var b = BANG[k];
        z(k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(b.tai()).then(function (r) {
            ui.table({ el: z(k), rows: rows(r), columns: b.cot, empty: b.rong });
        }).catch(function (err) { z(k).innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải ' + b.rong.replace('Chưa có ', '')); });
    }
    function them(k, call, dsXoa) {
        ums.api.call(call).then(function () {
            dsXoa.forEach(function (x) { dat(x, ''); });
            ui.toast('Thêm mới thành công!', 'ok');
        }).catch(function (err) { ums.api.handle(err, 'thêm'); })
            .then(function () { tai(k); });
    }

    /* ---------- Mở biểu mẫu (toggle_edithocphan + viewEdit_HocPhan_ChuongTrinh) */
    K.moSuaHP = function (row) {
        cur = row;
        z('ten').textContent = ': ' + e(row.DAOTAO_HOCPHAN_MA) + ' - ' + e(row.DAOTAO_HOCPHAN_TEN);
        ['qhLoai', 'qhHP', 'qhMuc', 'qhToanTu', 'qhGiaTri', 'tdKhoa', 'tdCT', 'tdHP', 'tdNhom', 'ttKhoa', 'ttCT', 'ttHP', 'ttNhom',
         'bhTen', 'bhKyHieu', 'bhSoTiet', 'bhNoiDung'].forEach(function (k) { dat(k, ''); });
        K.api.hien('sua');
        dat('ma', row.DAOTAO_HOCPHAN_MA); dat('tenHP', row.DAOTAO_HOCPHAN_TEN);
        dat('soTin', row.HOCTRINHAPDUNGHOCTAP); dat('soTinPhi', row.HOCTRINHAPDUNGTINHHOCPHI);
        dat('tinhDiem', row.LAMONTINHDIEMTHEOCHUONGTRINH === undefined || row.LAMONTINHDIEMTHEOCHUONGTRINH === null ? '1' : row.LAMONTINHDIEMTHEOCHUONGTRINH);
        dat('phamVi', row.PHANCONGPHAMVIDAMNHIEM_ID); dat('thuocTinh', row.THUOCTINHHOCPHAN_ID); dat('thuTu', row.THUTU);
        K.taiThoiGian().then(function (tg) {
            pat.fill(o('kyDK'), tg, { name: 'DAOTAO_THOIGIANDAOTAO' });
            pat.fill(o('kyTT'), tg, { name: 'DAOTAO_THOIGIANDAOTAO' });
            function tach(x) { return x ? String(x).split(',') : []; }
            dat('kyDK', tach(row.DAOTAO_THOIGIAN_KEHOACH_ID));
            dat('kyTT', tach(row.DAOTAO_THOIGIAN_THUCTE_ID));
        });
        ['qh', 'td', 'tt', 'bh'].forEach(tai);
        PB.load(row.DAOTAO_HOCPHAN_ID);
    };

    function luu() {
        if (!cur) return;
        var c = { action: 'KHCT_HocPhan_ChuongTrinh/CapNhat', strId: cur.ID,
            dHocTrinh_HocTap: v('soTin'), dHocTrinh_TinhTien: v('soTinPhi'), dLaMonTinhDiem: v('tinhDiem'),
            strDaoTao_ThoiGian_KH_Id: v('kyDK'), strDaoTao_ThoiGian_TT_Id: v('kyTT'),
            strPhanCongPhamViDamNhiem_Id: v('phamVi'), strDaoTao_HocPhan_Id: e(cur.DAOTAO_HOCPHAN_ID),
            strDaoTao_ChuongTrinh_Id: e(cur.DAOTAO_TOCHUCCHUONGTRINH_ID), dThuTu: v('thuTu'),
            strThuocTinhHocPhan_Id: v('thuocTinh'), strNguoiThucHien_Id: '' };
        ums.api.call(c).then(function () {
            ui.toast(e(cur.DAOTAO_HOCPHAN_TEN) + ': Cập nhật thành công!', 'ok');
            return PB.save(cur.DAOTAO_HOCPHAN_ID).then(function () { PB.load(cur.DAOTAO_HOCPHAN_ID); K.taiHP(); });
        }).catch(function (err) { ums.api.handle(err, 'cập nhật học phần'); });
    }
    function xoaHP() {
        if (!cur) return;
        ui.confirm('Bạn có chắc chắn muốn xóa học phần "' + e(cur.DAOTAO_HOCPHAN_TEN) + '" khỏi chương trình?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'KHCT_HocPhan_ChuongTrinh/Xoa', strIds: cur.ID, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); K.veCT(); });
        }).catch(function (err) { ums.api.handle(err, 'xoá học phần'); });
    }

    /* ---------- Hộp "Kế thừa quan hệ học phần" — myModalKeThuaQH ----------- */
    function keThuaQH() {
        var ids = Array.prototype.map.call(z('qh').querySelectorAll('input[data-qhck]:checked'), function (x) { return x.getAttribute('data-qhck'); });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var dlg = ui.dialog({ title: 'Kế thừa quan hệ học phần', icon: 'fa-screen-users', size: 'md',
            body: '<p class="ums-u-muted ums-u-fz13 ums-u-mb-3">Kế thừa ' + ids.length + ' quan hệ đã đánh dấu sang các chương trình chọn dưới đây.</p>' +
                ui.field('Hệ đào tạo', sel('he', 'Chọn hệ đào tạo')) +
                ui.field('Khóa đào tạo', sel('khoa', 'Chọn khóa đào tạo')) +
                ui.field('Chương trình', sel('ct', 'Chọn chương trình', ' multiple')),
            buttons: [{ text: 'Kế thừa', kind: 'save', icon: 'fa-copy', onClick: function (d) {
                var cts = pat.val(d.body.querySelector('[data-k="ct"]'));
                if (!cts) { ui.toast('Chọn chương trình cần kế thừa.', 'warn'); return false; }
                var calls = [];
                cts.split(',').forEach(function (ct) {
                    ids.forEach(function (qh) {
                        calls.push({ action: TT2 + 'CiQVKTQgHgUgLhUgLh4QNCAvCSQJLiIRKSAv', func: PK2 + 'KeThua_DaoTao_QuanHeHocPhan',
                            strDaoTao_QuanHeHocPhan_Id: qh, strDaoTao_ChuongTrinh_Id: ct, strNguoiThucHien_Id: '' });
                    });
                });
                ui.batch(calls, { title: 'Đang kế thừa quan hệ', okText: 'Thực hiện thành công' });
            } }] });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-k="' + k + '"]'); }
        ui.enhance(B);
        /* genBoLoc_HeKhoa("_QHKT", true): bKoCheckQuyen → procedure KHÔNG lọc quyền, giữ bộ tham số của genBoLoc */
        var TT = 'KHCT_ThongTin_MH/', PK = 'pkg_kehoach_thongtin.';
        function goi(action, func, extra) {
            var x = { action: TT + action, func: PK + func, strTuKhoa: '', strNguoiThucHien_Id: '', strChucNang_Id: '', pageIndex: 1, pageSize: 1000000, silent: true };
            Object.keys(extra).forEach(function (k) { x[k] = extra[k]; });
            return ums.api.call(x).then(rows);
        }
        function napKhoa() {
            pat.fill(q('ct'), [], {});
            if (!q('he').value) { pat.fill(q('khoa'), [], { head: 'Chọn khóa đào tạo' }); return Promise.resolve(); }
            return goi('DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLgPP', 'LayDSKS_DaoTao_KhoaDaoTao', { strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_HeDaoTao_Id: q('he').value, strDaoTao_CoSoDaoTao_Id: '', strNguoiTao_Id: '' })
                .then(function (r) { pat.fill(q('khoa'), r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); })
                .catch(function (err) { ums.api.handle(err, 'khoá đào tạo'); });
        }
        function napCT2() {
            if (!q('khoa').value) { pat.fill(q('ct'), [], {}); return; }
            goi('DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUP', 'LayDSKS_DaoTao_ToChucCT', { strDaoTao_HeDaoTao_Id: q('he').value,
                strDaoTao_KhoaDaoTao_Id: q('khoa').value, strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '' })
                .then(function (r) { pat.fill(q('ct'), r, { name: 'TENCHUONGTRINH' }); })
                .catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
        }
        goi('DSA4BRIFIC4VIC4eCSQFIC4VIC4P', 'LayDSDaoTao_HeDaoTao', { strDaoTao_KhoaQuanLy_Id: '', strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '' })
            .then(function (r) {
                pat.fill(q('he'), r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' });
                /* gốc: đặt sẵn Hệ = Hệ ở thanh lọc rồi phát select2:select */
                q('he').value = K.api.he();
                if (window.jQuery) jQuery(q('he')).trigger('change.select2').trigger('ums:refresh');
                if (q('he').value) napKhoa();
            }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        if (window.jQuery) {
            jQuery(q('he')).on('select2:select select2:clear', napKhoa);
            jQuery(q('khoa')).on('select2:select select2:clear', napCT2);
        }
        pat.chain([q('he'), q('khoa'), q('ct')], { phatLai: false });
    }

    /* ---------- Sự kiện ------------------------------------------------------ */
    S.addEventListener('change', function (ev) {
        var a = ev.target.closest('[data-qhall]');
        if (a) Array.prototype.forEach.call(z('qh').querySelectorAll('input[data-qhck]'), function (x) { x.checked = a.checked; });
    });
    S.addEventListener('click', function (ev) {
        var pv = ev.target.closest('[data-pv]');
        if (pv && S.contains(pv)) { moPhamVi(pv.getAttribute('data-pv'), pv.getAttribute('data-id'), pv.getAttribute('data-ten')); return; }
        var b = ev.target.closest('[data-xoa]');
        if (b && S.contains(b)) {
            var k = b.getAttribute('data-xoa'), id = b.getAttribute('data-id');
            ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call(BANG[k].xoa(id)).then(function () { ui.toast('Xóa thành công!', 'ok'); tai(k); });
            }).catch(function (err) { ums.api.handle(err, 'xoá'); });
            return;
        }
        b = ev.target.closest('[data-a]');
        if (!b || !S.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'dong') K.veCT();
        else if (a === 'luu') luu();
        else if (a === 'xoaHP') xoaHP();
        else if (a === 'keThuaQH') keThuaQH();
        else if (a === 'themQH') them('qh', { action: 'KHCT_QuanHeHocPhan/ThemMoi', strId: '', strLoaiQuanHe_Id: v('qhLoai'),
            strDaoTao_HocPhan_Id: hp(), strDaoTao_HocPhan_QuanHe_Id: v('qhHP'), strDaoTao_ToChucCT_Id: K.ctId(),
            strToanTu_Id: v('qhToanTu'), strMucDieuKien_Id: v('qhMuc'), strGiaTriDieuKien: v('qhGiaTri'), iThuTu: '', strNguoiThucHien_Id: '' },
            ['qhLoai', 'qhHP', 'qhMuc', 'qhToanTu', 'qhGiaTri']);
        else if (a === 'themTD') them('td', { action: 'KHCT_ThongTin/Them_DaoTao_HocPhanTuongDuong', strId: '',
            strDaoTao_HocPhan_Id: hp(), strDaoTao_HocPhan_TD_Id: v('tdHP'), strDaoTao_ToChucCT_TD_Id: v('tdCT'),
            strNhom: v('tdNhom'), strDaoTao_ToChucCT_Id: K.ctId(), strNguoiThucHien_Id: '' },
            ['tdKhoa', 'tdCT', 'tdHP', 'tdNhom']);
        else if (a === 'themTT') them('tt', { action: TT2 + 'FSkkLB4FIC4VIC4eCS4iESkgLxUpIDgVKSQP', func: PK2 + 'Them_DaoTao_HocPhanThayThe',
            strDaoTao_ToChucCT_Id: K.ctId(), strDaoTao_HocPhan_Id: hp(), strDaoTao_HocPhan_TT_Id: v('ttHP'),
            strDaoTao_ToChucCT_TT_Id: v('ttCT'), strNhom: v('ttNhom'), strNguoiThucHien_Id: '' },
            ['ttKhoa', 'ttCT', 'ttHP', 'ttNhom']);
        else if (a === 'themBH') them('bh', { action: 'KHCT_BaiHoc/ThemMoi', strId: '', strDaoTao_HocPhan_Id: hp(),
            strDaoTao_ToChucCT_Id: K.ctId(), strNoiDung: v('bhNoiDung'), strTenBai: v('bhTen'), strKyHieu: v('bhKyHieu'),
            dSoTiet: v('bhSoTiet'), strNguoiThucHien_Id: '' },
            ['bhTen', 'bhKyHieu', 'bhSoTiet', 'bhNoiDung']);
    });

    /* =====================================================================
       TÌNH TRẠNG HỌC (kq) — zone_ketquahocphan
       ===================================================================== */
    var Q = K.vung('kq',
        pat.panel({ title: 'Tình trạng học', icon: 'fa-chalkboard-user', count: 'ten', cls: 'khct-vung', flush: true,
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body:
                '<div class="khct-pad"><div class="ums-legend">Danh sách chưa có điểm, chưa đăng ký học lần nào</div></div><div data-z="k1"></div>' +
                '<div class="khct-pad khct-pad--cach"><div class="ums-legend ums-legend--ok">Danh sách đã học nhưng chưa hoàn thành (chưa ĐẠT)</div></div><div data-z="k2"></div>' +
                '<div class="khct-pad khct-pad--cach"><div class="ums-legend ums-legend--bad">Danh sách đã hoàn thành</div></div><div data-z="k3"></div>' }));
    function qz(k) { return Q.querySelector('[data-z="' + k + '"]'); }
    var KQ = {};
    function veKQ(k, p) {
        var ds = KQ[k] || [], size = KQ[k + 'sz'] || 10;
        ui.table({ el: qz(k), rows: ds.slice((p - 1) * size, p * size), empty: 'Không có người học',
            page: { index: p, size: size, total: ds.length,
                onChange: function (n) { if (n >= 1 && n <= Math.ceil(ds.length / size)) veKQ(k, n); },
                onSize: function (x) { KQ[k + 'sz'] = x; veKQ(k, 1); } },
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-center' }
            ] });
    }
    K.moKetQua = function (row) {
        qz('ten').textContent = ': ' + e(row.DAOTAO_HOCPHAN_MA) + ' - ' + e(row.DAOTAO_HOCPHAN_TEN);
        ['k1', 'k2', 'k3'].forEach(function (k) { qz(k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); });
        K.api.hien('kq');
        ums.api.call({ action: 'D_KQHocTapTheoChuongTrinh/LayKQHocTapTheoChuongTrinh', method: 'GET', type: 'GET',
            strDaoTao_ChuongTrinh_Id: e(row.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_HocPhan_Id: e(row.DAOTAO_HOCPHAN_ID), strNguoiThucHien_Id: '' })
            .then(function (r) {
                var d = r.data || {};
                KQ.k1 = d.rsNguoiHocChuaCoDiem || []; KQ.k2 = d.rsNguoiHocChuaHoanThanh || []; KQ.k3 = d.rsNguoiHocDaHoanThanh || [];
                ['k1', 'k2', 'k3'].forEach(function (k) { veKQ(k, 1); });
            }).catch(function (err) {
                ['k1', 'k2', 'k3'].forEach(function (k) { qz(k).innerHTML = ui.fail(err.message); });
                ums.api.handle(err, 'tình trạng học');
            });
    };
    Q.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="dong"]');
        if (b && Q.contains(b)) K.veCT();
    });
})();
