/* =========================================================================
   Phân quyền báo cáo - import — phân quyền NGƯỜI DÙNG được dùng mẫu báo cáo / import
   Bản gốc: ApisCMS/Modules/phanquyen/html/baocaoimport.html + script/baocaoimport.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Ứng dụng · Chức năng phân quyền · từ khoá ·
   Tìm kiếm) → khung "Danh sách" có nút "Thêm mẫu", "Phân quyền" và bảng CÂY BÁO CÁO ×
   NGƯỜI DÙNG (ums.pq.luoi — script/_pq.js); hộp "Gán quyền báo cáo chưa phần quyền"
   (Chọn báo cáo · Cán bộ · Lưu) — nay là biểu mẫu trong trang (ums.pat.formTrang).

   Lời gọi (kiểu cũ, không func; chép nguyên):
       nạp ô    CMS_UngDung/LayDanhSach GET strTuKhoa '', dTrangThai -1, pageIndex 1, pageSize 1000000 → TENUNGDUNG
                CMS_PhanQuyen_ThongTinChung/LayDSChucNangCanPhanQuyen GET strChucNang_Id, strUngDung_Id (ô Ứng dụng)
                CMS_PhanQuyen_ThongTin/LayDSBaoCaoChuaPhanQuyen GET strChucNang_Id → ô "Chọn báo cáo" của hộp
       cột      CMS_PhanQuyen_ThongTinChung/LayDSNguoiDungTheoChucNang GET strChucNang_Id, strPhanQuyen_ChucNang_Id
                → "FULLNAME - NAME" (cũng đổ vào ô "Cán bộ" của hộp, như gốc)
       cây      CMS_PhanQuyen_ThongTin/LayDSCauTrucPhanQuyenBaoCao GET strTuKhoa, strUngDung_Id,
                strPhanQuyen_ChucNang_Id, strChucNang_Id
       từng lá  CMS_PhanQuyen_ThongTin/LayDSQuyenBaoCaoTheoNguoiDung GET strChucNang_Id, strPhanQuyen_ChucNang_Id,
                strBaoCao_Id (= ID LÁ), strHanhDong_Id '' (ô dropSearch_QuyenThietLap đã bị chú thích bỏ khỏi html gốc)
       thêm     CMS_PhanQuyen_MauImport/ThemMoi POST strId '', strUngDung_Id, strChucNang_Id = CHỨC NĂNG PHÂN
                QUYỀN (ô lọc), strMauImport_Id = ID LÁ, strNguoiDung_Id = ID CỘT
       xoá      CMS_PhanQuyen_MauImport/Xoa POST strIds = QUYEN_ID của ô
       Thêm mẫu CMS_PhanQuyen_MauImport/ThemMoi — strMauImport_Id / strNguoiDung_Id lấy từ hai ô của hộp
   Cố ý bỏ (mã chết của gốc): getList_HanhDongTheo (đổ vào ô Quyền đã bị bỏ khỏi html → không nơi
   nào đọc), getList_HocPhan / getList_HeDaoTao (không được gọi). Tiêu đề cột cây vì thế chỉ là
   "Thông tin báo cáo được thiết lập quyền" (gốc nối thêm chữ của ô không tồn tại = rỗng).
   Khác gốc (lỗi rõ):
     · Ứng dụng / chức năng / từ khoá của lời gọi từng lá và lúc Phân quyền lấy theo lúc bấm Tìm kiếm.
     · Chưa chọn ứng dụng / chức năng thì chặn Phân quyền (gốc gửi strChucNang_Id rỗng → hệ tự điền
       chức năng của CHÍNH màn này → ghi quyền nhầm chức năng).
     · Thêm mẫu: chưa chọn báo cáo / cán bộ thì nhắc (gốc gửi rỗng). Lưu xong nạp lại bảng, biểu mẫu
       vẫn mở như gốc (gốc không đóng hộp).
   Cha → con: Ứng dụng → Chức năng phân quyền (KHOÁ — gốc nạp sẵn danh sách với ứng dụng rỗng).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, pq = ums.pq;
    var root = document.getElementById('pq-baocaoimport');
    if (!root) return;

    var dsND = [], dsBC = [];

    root.innerHTML = pat.page('Phân quyền báo cáo - import', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            pq.hang(pq.sel('ud', 'Chọn ứng dụng') + pq.sel('cn', 'Chọn chức năng phân quyền') + pq.inp('q', 'Nhập từ khóa tìm kiếm') + pq.nutTim(), true) }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-users-gear', flush: true, zone: 'bang',
            tools: ui.btn('add', { text: 'Thêm mẫu', attr: { 'data-a': 'themmau' } }) +
                ui.btn('save', { text: 'Phân quyền', attr: { 'data-a': 'phanquyen' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    var dang = null;

    var L = pq.luoi(root.querySelector('[data-z="bang"]'), {
        tieuDe: 'Thông tin báo cáo được thiết lập quyền',
        tenCot: pq.tenNguoi,
        dong: function (id) {
            return { action: 'CMS_PhanQuyen_ThongTin/LayDSQuyenBaoCaoTheoNguoiDung', strChucNang_Id: pq.cn(),
                strPhanQuyen_ChucNang_Id: dang.cn, strNguoiThucHien_Id: pq.uid(), strBaoCao_Id: id, strHanhDong_Id: '' };
        }
    });
    L.xoaTrang('Chọn ứng dụng, chức năng phân quyền rồi bấm Tìm kiếm');

    ums.api.call({ action: 'CMS_UngDung/LayDanhSach', method: 'GET', silent: true, strTuKhoa: '', dTrangThai: -1, pageIndex: 1, pageSize: 1000000 })
        .then(function (r) { pat.fill(f('ud'), pq.arr(r.data), { name: 'TENUNGDUNG', head: 'Chọn ứng dụng' }); }).catch(loi('ứng dụng'));
    ums.api.call({ action: 'CMS_PhanQuyen_ThongTin/LayDSBaoCaoChuaPhanQuyen', method: 'GET', silent: true, strChucNang_Id: pq.cn(), strNguoiThucHien_Id: pq.uid() })
        .then(function (r) { dsBC = pq.arr(r.data); }).catch(loi('báo cáo chưa phân quyền'));

    jQuery(f('ud')).on('select2:select', function () {
        if (!v('ud')) { pat.fill(f('cn'), [], { head: 'Chọn chức năng phân quyền' }); return; }
        pq.chucNang(f('cn'), { action: 'CMS_PhanQuyen_ThongTinChung/LayDSChucNangCanPhanQuyen', strChucNang_Id: pq.cn(),
            strUngDung_Id: v('ud'), strNguoiThucHien_Id: pq.uid() });
    });
    pat.chain([f('ud'), f('cn')]);

    function tim() {
        dang = { ud: v('ud'), cn: v('cn'), q: (f('q').value || '').trim() };
        L.xoaTrang('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'CMS_PhanQuyen_ThongTinChung/LayDSNguoiDungTheoChucNang', method: 'GET', strChucNang_Id: pq.cn(),
            strPhanQuyen_ChucNang_Id: dang.cn, strNguoiThucHien_Id: pq.uid() }).then(function (rc) {
            dsND = pq.arr(rc.data);
            return ums.api.call({ action: 'CMS_PhanQuyen_ThongTin/LayDSCauTrucPhanQuyenBaoCao', method: 'GET', strTuKhoa: dang.q,
                strUngDung_Id: dang.ud, strPhanQuyen_ChucNang_Id: dang.cn, strChucNang_Id: pq.cn(), strNguoiThucHien_Id: pq.uid() })
                .then(function (r) { return L.ve(dsND, r.data, ''); });
        }).catch(function (err) { L.loi(err.message); ums.api.handle(err, 'cấu trúc phân quyền báo cáo'); });
    }

    function them(ud, cn, mau, nd) {
        return { action: 'CMS_PhanQuyen_MauImport/ThemMoi', method: 'POST', strId: '', strUngDung_Id: ud, strChucNang_Id: cn,
            strMauImport_Id: mau, strNguoiDung_Id: nd, strNguoiThucHien_Id: pq.uid() };
    }

    function phanQuyen() {
        if (!dang) return ui.toast('Bấm Tìm kiếm để nạp danh sách trước', 'warn');
        if (!dang.ud || !dang.cn) return ui.toast('Chọn ứng dụng và chức năng phân quyền rồi Tìm kiếm lại', 'warn');
        pq.phanQuyen(L, {
            them: function (x) { return them(dang.ud, dang.cn, x.dong, x.cot); },
            xoa: function (x) { return { action: 'CMS_PhanQuyen_MauImport/Xoa', strIds: x.quyen, strNguoiThucHien_Id: pq.uid() }; },
            sauLuu: tim
        });
    }

    /* "Gán quyền báo cáo chưa phần quyền" (#myModal của gốc) — biểu mẫu TRONG TRANG (BO-CUC luật 1), thay chỗ cả màn.
       Lưu xong Ở LẠI biểu mẫu để gán tiếp (như gốc không đóng hộp). */
    function themMau() {
        if (!v('ud') || !v('cn')) return ui.toast('Bạn cần chọn ứng dụng và chức năng trước!', 'warn');
        var dlg = pat.formTrang({
            host: root, title: 'Gán quyền báo cáo chưa phần quyền', icon: 'fa-file-circle-plus',
            body: ui.field('Chọn báo cáo', '<select class="ums-select" data-f="bc" data-ph="Chọn báo cáo"><option value=""></option></select>', { inline: true }) +
                ui.field('Cán bộ', '<select class="ums-select" data-f="nd" data-ph="Chọn cán bộ"><option value=""></option></select>', { inline: true }),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) { luuMot(d); return false; } }]
        });
        pat.fill(dlg.body.querySelector('[data-f="bc"]'), dsBC, { name: 'TEN', head: 'Chọn báo cáo' });
        pat.fill(dlg.body.querySelector('[data-f="nd"]'), dsND, { name: pq.tenNguoi, head: 'Chọn cán bộ' });
    }
    function luuMot(dlg) {
        var bc = pat.val(dlg.body.querySelector('[data-f="bc"]')), nd = pat.val(dlg.body.querySelector('[data-f="nd"]'));
        if (!bc || !nd) return ui.toast('Chọn báo cáo và cán bộ', 'warn');
        ums.api.call(them(v('ud'), v('cn'), bc, nd)).then(function () {
            ui.toast('Phân quyền thành công', 'ok');
            if (dang) tim();
        }).catch(loi('gán quyền báo cáo'));
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'phanquyen') phanQuyen();
        else if (a === 'themmau') themMau();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
