/* =========================================================================
   Phân quyền điểm — phân quyền NGƯỜI DÙNG nhập điểm theo danh sách lớp học phần
   Bản gốc: ApisCMS/Modules/phanquyen/html/diem.html + script/diem.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp · Năm nhập học · Khoa QL ·
   Đơn vị · Cán bộ / Chức năng phân quyền · Quyền cần thiết lập · Thành phần điểm · Học phần /
   từ khoá · Tìm kiếm / Loại danh sách · Học kỳ · "Phân quyền tự động theo TKB" / khối "Chọn
   trạng thái sinh viên") → khung "Danh sách" có nút "Tạo dữ liệu cache", "Phân quyền" và bảng
   CÂY DANH SÁCH × NGƯỜI DÙNG (ums.pq.luoi, ums.pq.daoTao — script/_pq.js). "Phân quyền" hỏi lại
   kèm hai ô chọn nhiều Quyền · Thành phần (gốc nhét vào hộp edu.system.alert).

   Lời gọi (kiểu cũ, không func; chép nguyên):
       nạp ô    ums.pq.daoTao (edu.system.getList_*, LayDSNamNhapHoc, QLSV.TRANGTHAI) · danh mục DIEM.LOAIDANHSACH
                ums.ref.coCauToChuc (iTrangThai 1) → Đơn vị · ums.ref.thoiGianDaoTao (pageSize 100000) → Học kỳ
                D_ThongTin/LayDSDiem_ThanhPhanDiem GET strTuKhoa '', strThangDiem_Id '', dLaThanhPhanDiemCuoi -1,
                    strQuyTacLamTron_Id '', pageIndex 1, pageSize 10000 → Thành phần điểm (DIEM_THAMSOHOCTAPCHUNG_TEN;
                    ô trong hộp Phân quyền hiện MA)
                CMS_PhanQuyenDuLieu/LayDSChucNangCanPhanQuyen · LayDSHanhDongTheo (strPhanQuyen_ChucNang_Id)
                CMS_PhanQuyenDuLieu/LayDSNguoiDungTheoChucNang GET strPhanQuyen_ChucNang_Id, strDaoTao_CoCauToChuc_Id
                    → Cán bộ (getList_HS: khi chọn Chức năng / Đơn vị)
                CMS_PhanQuyenDuLieu/LayDSHocPhanCauTrucDiemTheoLQL GET → Học phần (khi đổi ô đào tạo, Học kỳ,
                    Đơn vị); strTuKhoa / strPhanQuyen_ChucNang_Id / strTrangThaiNguoiHoc_Id gửi '' (ô txtAAAA / dropAAAA)
       cột      LayDSNguoiDungTheoChucNang GET  … + strNguoiDung_Id (Cán bộ) → "FULLNAME - NAME"
       cây      LayDSCauTrucDiemTheoLQL GET strTuKhoa, strDaoTao_HocPhan_Id, strLoaiDanhSach_Id, strChucNang_Id,
                strPhanQuyen_ChucNang_Id, strKhoaQuanLy_Id, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id,
                strLopQuanLy_Id, strNamNhapHoc, strDaoTao_ThoiGianDaoTao_Id (Học kỳ), strTrangThaiNguoiHoc_Id
       từng lá  LayDSQuyenDiemTheoLQL GET strChucNang_Id, strPhanQuyen_ChucNang_Id, strDiem_DanhSach_Id (= ID LÁ),
                strDiem_ThanhPhanDiem_Id, strHanhDong_Id
       Phân quyền  mỗi ô đổi × mỗi Quyền × mỗi Thành phần (chọn trong hộp):
                Them_PhanQuyen_DuLieu POST strId '', dHieuLuc 1, strLoaiQuyen_Id, strNgayBatDau/KetThuc '',
                    strHanhDong_Id = quyền, strUngDung_Id (vai trò), strToHopBoDuLieuQuyen = ID LÁ + ID thành phần,
                    strNguoiDung_Id = ID CỘT, strMoTa '' (gốc KHÔNG gửi strChucNang_Id → hệ tự điền như gốc)
                Xoa_PhanQuyen_DuLieu POST strLoaiQuyen_Id, strHanhDong_Id, strUngDung_Id, strToHopBoDuLieuQuyen,
                    strNguoiDung_Id (xoá theo tổ hợp — ô bỏ đánh dấu)
       Phân quyền tự động theo TKB  TaoTuDongDSLopHocPhanLanDau GET (bộ lọc hiện tại; strCachLayChuongTrinh =
                'CHUONGTRINHDAOTAO' — ô ẩn display:none của gốc, luôn mục đầu)
       Tạo dữ liệu cache  D_Cache/TaoCache_NhapDiemTheoDanhSach POST (type 'POST' gửi kèm như gốc,
                strChucNang_Id = CHỨC NĂNG PHÂN QUYỀN, strNguoiDung_Id = Cán bộ); chưa chọn cán bộ thì
                D_Cache/LayDanhSach GET (type 'GET') rồi tạo cho từng NGUOIDUNG_ID
   Cố ý bỏ: resetCombobox (gỡ mục "Tất cả" của ô chọn nhiều — bản mới không có mục đó); ô
   dropSearch_NguoiThu_IHD (không tồn tại); genList_TrangThaiSV gán nhầm dtNguoiDung (vô hại).
   Khác gốc (lỗi rõ):
     · Bộ lọc của lời gọi từng lá và lúc Phân quyền lấy theo lúc bấm Tìm kiếm.
     · Hộp Phân quyền chưa chọn Quyền / Thành phần: nhắc (gốc: val() null → TypeError, không làm gì).
     · Chưa chọn chức năng phân quyền thì chặn Phân quyền.
     · Tạo cache hàng loạt chạy qua ums.ui.batch (gốc: N lời gọi cùng lúc, N thông báo).
   Cha → con: Hệ → Khoá → CT → Lớp (khoá), Chức năng phân quyền → Quyền (khoá).
   Lọc tuỳ chọn nhiều cha (không khoá): Cán bộ (Chức năng + Đơn vị), Học phần (mọi ô đào tạo + Học kỳ + Đơn vị).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, pq = ums.pq;
    var root = document.getElementById('pq-diem');
    if (!root) return;

    var PQ = 'CMS_PhanQuyenDuLieu/';
    var dsTP = [], dsHD = [];

    root.innerHTML = pat.page('Phân quyền điểm', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            pq.hang(pq.daoTaoHtml() + pq.sel('donvi', 'Chọn đơn vị') + pq.sel('canbo', 'Chọn cán bộ'), true) +
            pq.hang(pq.sel('cn', 'Chọn chức năng phân quyền') + pq.sel('quyen', 'Chọn quyền cần thiết lập') +
                pq.sel('tp', 'Chọn thành phần điểm') + pq.sel('hp', 'Chọn học phần')) +
            pq.hang(pq.inp('q', 'Nhập từ khóa tìm kiếm') + pq.nutTim()) +
            pq.hang(pq.sel('loai', 'Chọn loại danh sách') + pq.sel('hk', 'Tất cả học kỳ') +
                '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Phân quyền tự động theo TKB', mod: 'out-warn',
                    icon: 'fa-user-gear', attr: { 'data-a': 'tudong' } }) + '</div>') +
            pq.trangThaiHtml() }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', flush: true, zone: 'bang',
            tools: ui.btn('add', { text: 'Tạo dữ liệu cache', icon: 'fa-layer-plus', mod: 'out-success', attr: { 'data-a': 'cache' } }) +
                ui.btn('save', { text: 'Phân quyền', attr: { 'data-a': 'phanquyen' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    var dang = null;

    /* Học phần — gốc nạp lại mỗi khi đổi ô đào tạo / Học kỳ / Đơn vị */
    function napHocPhan() {
        var l = dt.thamSo();
        ums.api.call({ action: PQ + 'LayDSHocPhanCauTrucDiemTheoLQL', method: 'GET', silent: true, strTuKhoa: '',
            strDaoTao_CoCauToChuc_Id: v('donvi'), strDaoTao_ThoiGianDaoTao_Id: v('hk'), strChucNang_Id: pq.cn(),
            strPhanQuyen_ChucNang_Id: '', strNamNhapHoc: l.strNamNhapHoc, strKhoaQuanLy_Id: l.strKhoaQuanLy_Id,
            strHeDaoTao_Id: l.strHeDaoTao_Id, strKhoaDaoTao_Id: l.strKhoaDaoTao_Id, strChuongTrinh_Id: l.strChuongTrinh_Id,
            strLopQuanLy_Id: l.strLopQuanLy_Id, strTrangThaiNguoiHoc_Id: '', strNguoiThucHien_Id: pq.uid() })
            .then(function (r) { pat.fill(f('hp'), pq.arr(r.data), { name: 'TEN', head: 'Chọn học phần' }); }).catch(loi('học phần'));
    }
    /* Cán bộ (getList_HS) — gốc nạp khi chọn Chức năng phân quyền / Đơn vị */
    function napCanBo() {
        ums.api.call({ action: PQ + 'LayDSNguoiDungTheoChucNang', method: 'GET', silent: true, strChucNang_Id: pq.cn(),
            strPhanQuyen_ChucNang_Id: v('cn'), strDaoTao_CoCauToChuc_Id: v('donvi'), strNguoiThucHien_Id: pq.uid() })
            .then(function (r) { pat.fill(f('canbo'), pq.arr(r.data), { name: pq.tenNguoi, head: 'Chọn cán bộ' }); })
            .catch(loi('cán bộ'));
    }

    var dt = pq.daoTao(root, { onDoi: napHocPhan });

    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
        .then(function (d) { pat.fill(f('donvi'), d, { name: 'TEN', head: 'Chọn đơn vị' }); }).catch(loi('đơn vị'));
    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
        .then(function (d) { pat.fill(f('hk'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Tất cả học kỳ' }); }).catch(loi('học kỳ'));
    ums.api.dm('DIEM.LOAIDANHSACH').then(function (d) { pat.fill(f('loai'), d, { head: pat.dmTitle(d) || 'Chọn loại danh sách' }); })
        .catch(loi('loại danh sách'));
    ums.api.call({ action: 'D_ThongTin/LayDSDiem_ThanhPhanDiem', method: 'GET', silent: true, strTuKhoa: '', strThangDiem_Id: '',
        dLaThanhPhanDiemCuoi: -1, strQuyTacLamTron_Id: '', strNguoiThucHien_Id: pq.uid(), pageIndex: 1, pageSize: 10000 })
        .then(function (r) { dsTP = pq.arr(r.data); pat.fill(f('tp'), dsTP, { name: 'DIEM_THAMSOHOCTAPCHUNG_TEN', head: 'Chọn thành phần điểm' }); })
        .catch(loi('thành phần điểm'));
    pq.chucNang(f('cn'), { action: PQ + 'LayDSChucNangCanPhanQuyen', strChucNang_Id: pq.cn(), strUngDung_Id: pq.vt(), strNguoiThucHien_Id: pq.uid() });

    jQuery(f('cn')).on('select2:select', function () {
        pq.hanhDong(f('quyen'), v('cn') ? { action: PQ + 'LayDSHanhDongTheo', strUngDung_Id: pq.vt(),
            strPhanQuyen_ChucNang_Id: v('cn'), strNguoiThucHien_Id: pq.uid() } : null).then(function (rows) { dsHD = rows; });
        napCanBo();
    });
    pat.chain([f('cn'), f('quyen')]);
    jQuery(f('donvi')).on('select2:select select2:clear', function () { napCanBo(); napHocPhan(); });
    jQuery(f('hk')).on('select2:select select2:clear', napHocPhan);

    var L = pq.luoi(root.querySelector('[data-z="bang"]'), {
        tieuDe: 'Thông tin lớp học phần được thiết lập quyền',
        tenCot: pq.tenNguoi,
        dong: function (id) {
            return { action: PQ + 'LayDSQuyenDiemTheoLQL', strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn,
                strNguoiThucHien_Id: pq.uid(), strDiem_DanhSach_Id: id, strDiem_ThanhPhanDiem_Id: dang.tp, strHanhDong_Id: dang.quyen };
        }
    });
    L.xoaTrang('Chọn chức năng phân quyền, quyền cần thiết lập rồi bấm Tìm kiếm');

    function tim() {
        dang = { cn: v('cn'), quyen: v('quyen'), tenQuyen: pq.chu(f('quyen')), tp: v('tp'), hp: v('hp'), loai: v('loai'),
            hk: v('hk'), donvi: v('donvi'), canbo: v('canbo'), q: (f('q').value || '').trim(), loc: dt.thamSo() };
        L.xoaTrang('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: PQ + 'LayDSNguoiDungTheoChucNang', method: 'GET', strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn,
            strDaoTao_CoCauToChuc_Id: dang.donvi, strNguoiDung_Id: dang.canbo, strNguoiThucHien_Id: pq.uid() }).then(function (rc) {
            var l = dang.loc;
            return ums.api.call({ action: PQ + 'LayDSCauTrucDiemTheoLQL', method: 'GET', strTuKhoa: dang.q, strDaoTao_HocPhan_Id: dang.hp,
                strLoaiDanhSach_Id: dang.loai, strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn,
                strKhoaQuanLy_Id: l.strKhoaQuanLy_Id, strHeDaoTao_Id: l.strHeDaoTao_Id, strKhoaDaoTao_Id: l.strKhoaDaoTao_Id,
                strChuongTrinh_Id: l.strChuongTrinh_Id, strLopQuanLy_Id: l.strLopQuanLy_Id, strNamNhapHoc: l.strNamNhapHoc,
                strDaoTao_ThoiGianDaoTao_Id: dang.hk, strTrangThaiNguoiHoc_Id: l.strTrangThaiNguoiHoc_Id, strNguoiThucHien_Id: pq.uid() })
                .then(function (r) { return L.ve(rc.data, r.data, dang.tenQuyen); });
        }).catch(function (err) { L.loi(err.message); ums.api.handle(err, 'cấu trúc phân quyền'); });
    }

    /* btnPhanQuyenDiemLQL: hỏi lại kèm Quyền · Thành phần (chọn nhiều, mặc định theo bộ lọc) */
    function phanQuyen() {
        if (!dang) return ui.toast('Bấm Tìm kiếm để nạp danh sách trước', 'warn');
        if (!dang.cn) return ui.toast('Chọn chức năng phân quyền rồi Tìm kiếm lại', 'warn');
        var d = pq.kiem(L);
        if (!d) return;
        var dlg = ui.dialog({
            title: 'Phân quyền', icon: 'fa-user-gear', size: 'md',
            body: '<p class="pq-hoi">Bạn có chắc chắn thêm x * ' + d.them.length + ' và hủy quyền x * ' + d.xoa.length + '?</p>' +
                ui.field('Quyền', '<select class="ums-select" data-f="dq" multiple data-ph="Chọn quyền cần thiết lập"></select>', { inline: true }) +
                ui.field('Thành phần', '<select class="ums-select" data-f="dtp" multiple data-ph="Chọn thành phần điểm"></select>', { inline: true }),
            buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function (h) { return luu(h, d); } }]
        });
        var sq = dlg.body.querySelector('[data-f="dq"]'), stp = dlg.body.querySelector('[data-f="dtp"]');
        pat.fill(sq, dsHD, { name: 'HANHDONG_TEN' });
        pat.fill(stp, dsTP, { name: 'MA' });
        ui.enhance(dlg.body);
        jQuery(sq).val(dang.quyen ? [dang.quyen] : []).trigger('change.select2').trigger('ums:refresh');
        jQuery(stp).val(dang.tp ? [dang.tp] : []).trigger('change.select2').trigger('ums:refresh');
    }

    function luu(dlg, d) {
        var dsQ = jQuery(dlg.body.querySelector('[data-f="dq"]')).val() || [];
        var dsT = jQuery(dlg.body.querySelector('[data-f="dtp"]')).val() || [];
        if (!dsQ.length) { ui.toast('Chọn ít nhất một quyền', 'warn'); return false; }
        if (!dsT.length) { ui.toast('Chọn ít nhất một thành phần', 'warn'); return false; }
        var calls = [];
        d.them.forEach(function (x) {
            dsQ.forEach(function (q) {
                dsT.forEach(function (t) {
                    calls.push({ action: PQ + 'Them_PhanQuyen_DuLieu', strId: '', dHieuLuc: 1, strLoaiQuyen_Id: dang.cn,
                        strNgayBatDau: '', strNgayKetThuc: '', strHanhDong_Id: q, strUngDung_Id: pq.vt(),
                        strToHopBoDuLieuQuyen: x.dong + t, strNguoiDung_Id: x.cot, strMoTa: '', strNguoiThucHien_Id: pq.uid() });
                });
            });
        });
        d.xoa.forEach(function (x) {
            dsQ.forEach(function (q) {
                dsT.forEach(function (t) {
                    calls.push({ action: PQ + 'Xoa_PhanQuyen_DuLieu', strLoaiQuyen_Id: dang.cn, strHanhDong_Id: q, strUngDung_Id: pq.vt(),
                        strToHopBoDuLieuQuyen: x.dong + t, strNguoiDung_Id: x.cot, strNguoiThucHien_Id: pq.uid() });
                });
            });
        });
        pq.chay(calls, tim);
    }

    function taoTuDong() {
        var l = dt.thamSo();
        ums.api.call({ action: PQ + 'TaoTuDongDSLopHocPhanLanDau', method: 'GET', strTuKhoa: (f('q').value || '').trim(),
            strDaoTao_ThoiGianDaoTao_Id: v('hk'), strDaoTao_HocPhan_Id: v('hp'), strCachLayChuongTrinh: 'CHUONGTRINHDAOTAO',
            strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: v('cn'), strKhoaQuanLy_Id: l.strKhoaQuanLy_Id,
            strHeDaoTao_Id: l.strHeDaoTao_Id, strKhoaDaoTao_Id: l.strKhoaDaoTao_Id, strChuongTrinh_Id: l.strChuongTrinh_Id,
            strLopQuanLy_Id: l.strLopQuanLy_Id, strNamNhapHoc: l.strNamNhapHoc, strTrangThaiNguoiHoc_Id: l.strTrangThaiNguoiHoc_Id,
            strNguoiThucHien_Id: pq.uid() })
            .then(function () { ui.toast('Tạo tự động thành công', 'ok'); }).catch(loi('phân quyền tự động theo TKB'));
    }

    function cache(nd) {
        return { action: 'D_Cache/TaoCache_NhapDiemTheoDanhSach', method: 'POST', type: 'POST',
            strChucNang_Id: v('cn'), strNguoiDung_Id: nd, strNguoiThucHien_Id: pq.uid() };
    }
    function taoCache() {
        if (v('canbo')) {
            ums.api.call(cache(v('canbo'))).then(function () { ui.toast('Tạo cache thành công', 'ok'); }).catch(loi('tạo cache'));
            return;
        }
        ums.api.call({ action: 'D_Cache/LayDanhSach', method: 'GET', type: 'GET', strChucNang_Id: v('cn'), strNguoiThucHien_Id: pq.uid() })
            .then(function (r) {
                var ds = pq.arr(r.data);
                if (!ds.length) return ui.toast('Không có người dùng cần tạo cache', 'warn');
                ui.batch(ds.map(function (x) { return cache(x.NGUOIDUNG_ID); }), { title: 'Đang tạo cache', concurrency: 4, okText: 'Tạo cache thành công' });
            }).catch(loi('danh sách tạo cache'));
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'phanquyen') phanQuyen();
        else if (a === 'tudong') taoTuDong();
        else if (a === 'cache') taoCache();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
