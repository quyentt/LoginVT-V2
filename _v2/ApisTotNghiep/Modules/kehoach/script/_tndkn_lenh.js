/* =========================================================================
   Điều kiện nhóm (Xét tốt nghiệp) — khung "LỆNH ĐIỀU KIỆN / LỆNH XẾP LOẠI"
   Bản gốc: ApisTotNghiep/Modules/kehoach/script/dieukiennhom.js
       getList_LenhDieuKien · genTable_LenhDieuKien · save_LenhDieuKien · delete_LenhDieuKien
       getList_LenhXepLoai  · genTable_LenhXepLoai  · save_LenhXepLoai  · delete_LenhXepLoai
       getList_ThamSo*  · genTable_ThamSo*  · save_ThamSo*  · delete_ThamSo*  · save_KeThuaThamSo*
       + hộp #myModalDieuKienXepLoai (thêm / sửa lệnh — DÙNG CHUNG cho hai loại, ẩn hiện lớp .lenhdieukien / .lenhxeploai),
         #myModalThamSoChiTiet (danh sách tham số của một lệnh), #myModalTSChiTiet (thêm / sửa tham số),
         #myModalKeThuaChiTiet (kế thừa tham số từ từ khoá nguồn sang từ khoá đích)
   ---------------------------------------------------------------------------
   ums.tndkn.lenh(host, { loai: 'dk' | 'xl', tuKhoa() → strTuKhoa, phanLoai() → strPhanLoai_Id, man: gốc màn }) → crud
       Khung "Xem danh sách các lệnh ĐIỀU KIỆN | XẾP LOẠI" (ums.crud lồng). Cột "Tham số chi tiết" → nút "Xem" mở MÀN CON
       tham số ngay trong trang (ums.pat.formTrang thay chỗ cả màn — BO-CUC luật 1: màn con quản lý bảng con vào trong trang).
   ums.tndkn.thamSo(man, loai, dòngLệnh)       màn con tham số chi tiết (ums.crud lồng trong formTrang)
   ums.tndkn.e(x)                               x == null → ''

   Lời gọi (chép nguyên bản gốc):
     Lệnh ĐIỀU KIỆN (TN_ThongTin_MH, pkg_totnghiep_thongtin):
       LayDSTN_XetDuyet_TuKhoa   strTuKhoa = ô từ khoá CHUNG của thanh lọc đầu trang (#txtSearch) · strNguoiTao_Id '' (#dropAAAA)
                                 · pageIndex 1 · pageSize 10000000 → bảng KHÔNG phân trang máy chủ
       Them_TN_XetDuyet_TuKhoa | Sua_TN_XetDuyet_TuKhoa (có strId)
     Lệnh XẾP LOẠI: LayDSTN_XepLoai_TuKhoa · Them_TN_XepLoai_TuKhoa | Sua_TN_XepLoai_TuKhoa — cùng bộ tham số.
       Tham số lưu lệnh: strId · strTenTuKhoa · strKieuDuLieu · strSoChuSoLamTron · strMoTa · strTuKhoa · strTenFunction
         · strTenDataBaseLink · strTenPKG · strPhanLoai_Id = ô PHÂN LOẠI của thanh lọc đầu trang (#dropSearch_PhanLoai, như gốc)
         · dSoChuSoLamTron (= cùng ô "Số chữ số làm tròn", gốc gửi hai lần hai tên).
       Cột: TUKHOA · TENTUKHOA · MOTA · TENPKG · TENFUNCTION · TENDATABASELINK · KIEUDULIEU · SOCHUSOLAMTRON.
     Tham số chi tiết (TN_ThamSo_MH, PKG_TOTNGHIEP_THAMSO):
       LayDS_XetDuyet_TuKhoa_ThamSo  strTN_XetDuyet_TuKhoa_Id     | LayDS_XepLoai_TuKhoa_ThamSo  strTN_XepLoai_TuKhoa_Id
       Them_ / Sua_…_TuKhoa_ThamSo   strId · strTenThamSo · strGiaTriMacDinh · <khoá lệnh> · strPhanLoai · strThuTu · strMoTa
       Xoa_…_TuKhoa_ThamSo           strId — mỗi dòng đã chọn một lời gọi
       KeThua_XetDuyet_TuKhoa_ThamSo strTuKhoa_XetDuyet_Nguon · strTuKhoa_XetDuyet_Dich
       KeThua_XepLoai_TuKhoa_ThamSo  strTuKhoa_XepLoai_Nguon  · strTuKhoa_XepLoai_Dich
       Cột: TENTHAMSO · GIATRIMACDINH · PHANLOAI · MOTA · THUTU.

   Khác gốc:
     · XOÁ LỆNH: gốc gọi NHẦM thủ tục của Tài chính `pkg_taichinh_kehoach.Xoa_TC_KhoanThu_QDXuatHD` (TC_KeHoach_MH — chép từ
       màn Khoản thu) với id lệnh → không xoá được lệnh, mà có thể xoá nhầm bản ghi "khoản thu – quyết định xuất hoá đơn"
       trùng id. Không có thủ tục xoá lệnh nào trong hệ (đã rà mọi tệp gốc) → GIỮ nút "Xóa", đặt disabled kèm lời giải thích;
       bỏ cột ô đánh dấu của hai bảng lệnh (chỉ phục vụ nút xoá này). Cần backend thêm thủ tục xoá lệnh.
     · Thêm / sửa lệnh, thêm / sửa tham số: hộp thoại → biểu mẫu trong trang (ums.crud). Lưu xong quay về danh sách
       (gốc để hộp mở, không nhận id mới → bấm Lưu lần hai là THÊM TRÙNG lệnh / tham số).
     · Ô "Từ khóa" (lệnh) và "Tên tham số" bắt buộc; "Số chữ số làm tròn", "Thứ tự" kiểm kiểu số (gốc không kiểm gì,
       gửi rỗng / chữ lên máy chủ). Nút lưu lệnh giữ chữ gốc "Lưu lệnh điều kiện" / "Lưu lệnh xếp loại".
     · Kế thừa tham số: ô "Từ khóa đích" điền sẵn từ khoá của lệnh đang xem (gốc để trống; sau kế thừa gốc nạp lại danh sách
       tham số của CHÍNH lệnh đang xem nên đích thường là lệnh này) — vẫn sửa được. Hai ô bắt buộc (gốc gửi rỗng).
       Gốc đóng hộp rồi mới báo kết quả; ở đây thành công mới đóng.
     · Hộp #myModalThamSoChiTiet có ô "Nhập từ khóa tìm kiếm" đã chú thích bỏ trong html gốc → không dựng.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var N = ums.tndkn = ums.tndkn || {};
    function e(x) { return x === undefined || x === null ? '' : String(x); }
    N.e = e;

    var TT = 'TN_ThongTin_MH/', PT = 'pkg_totnghiep_thongtin.';
    var TS = 'TN_ThamSo_MH/', PS = 'PKG_TOTNGHIEP_THAMSO.';

    N.LOAI = {
        dk: {
            ten: 'ĐIỀU KIỆN', nho: 'điều kiện', icon: 'fa-filter',
            ds: { action: TT + 'DSA4BRIVDx4ZJDUFNDgkNR4VNAopLiAP', func: PT + 'LayDSTN_XetDuyet_TuKhoa' },
            them: { action: TT + 'FSkkLB4VDx4ZJDUFNDgkNR4VNAopLiAP', func: PT + 'Them_TN_XetDuyet_TuKhoa' },
            sua: { action: TT + 'EjQgHhUPHhkkNQU0OCQ1HhU0CikuIAPP', func: PT + 'Sua_TN_XetDuyet_TuKhoa' },
            ts: {
                khoa: 'strTN_XetDuyet_TuKhoa_Id',
                ds: { action: TS + 'DSA4BRIeGSQ1BTQ4JDUeFTQKKS4gHhUpICwSLgPP', func: PS + 'LayDS_XetDuyet_TuKhoa_ThamSo' },
                them: { action: TS + 'FSkkLB4ZJDUFNDgkNR4VNAopLiAeFSkgLBIu', func: PS + 'Them_XetDuyet_TuKhoa_ThamSo' },
                sua: { action: TS + 'EjQgHhkkNQU0OCQ1HhU0CikuIB4VKSAsEi4P', func: PS + 'Sua_XetDuyet_TuKhoa_ThamSo' },
                xoa: { action: TS + 'GS4gHhkkNQU0OCQ1HhU0CikuIB4VKSAsEi4P', func: PS + 'Xoa_XetDuyet_TuKhoa_ThamSo' },
                keThua: { action: TS + 'CiQVKTQgHhkkNQU0OCQ1HhU0CikuIB4VKSAsEi4P', func: PS + 'KeThua_XetDuyet_TuKhoa_ThamSo' },
                nguon: 'strTuKhoa_XetDuyet_Nguon', dich: 'strTuKhoa_XetDuyet_Dich'
            }
        },
        xl: {
            ten: 'XẾP LOẠI', nho: 'xếp loại', icon: 'fa-ranking-star',
            ds: { action: TT + 'DSA4BRIVDx4ZJDENLiAoHhU0CikuIAPP', func: PT + 'LayDSTN_XepLoai_TuKhoa' },
            them: { action: TT + 'FSkkLB4VDx4ZJDENLiAoHhU0CikuIAPP', func: PT + 'Them_TN_XepLoai_TuKhoa' },
            sua: { action: TT + 'EjQgHhUPHhkkMQ0uICgeFTQKKS4g', func: PT + 'Sua_TN_XepLoai_TuKhoa' },
            ts: {
                khoa: 'strTN_XepLoai_TuKhoa_Id',
                ds: { action: TS + 'DSA4BRIeGSQxDS4gKB4VNAopLiAeFSkgLBIu', func: PS + 'LayDS_XepLoai_TuKhoa_ThamSo' },
                them: { action: TS + 'FSkkLB4ZJDENLiAoHhU0CikuIB4VKSAsEi4P', func: PS + 'Them_XepLoai_TuKhoa_ThamSo' },
                sua: { action: TS + 'EjQgHhkkMQ0uICgeFTQKKS4gHhUpICwSLgPP', func: PS + 'Sua_XepLoai_TuKhoa_ThamSo' },
                xoa: { action: TS + 'GS4gHhkkMQ0uICgeFTQKKS4gHhUpICwSLgPP', func: PS + 'Xoa_XepLoai_TuKhoa_ThamSo' },
                keThua: { action: TS + 'CiQVKTQgHhkkMQ0uICgeFTQKKS4gHhUpICwSLgPP', func: PS + 'KeThua_XepLoai_TuKhoa_ThamSo' },
                nguon: 'strTuKhoa_XepLoai_Nguon', dich: 'strTuKhoa_XepLoai_Dich'
            }
        }
    };

    function goi(x, them) {
        var o = { action: x.action, func: x.func };
        Object.keys(them).forEach(function (k) { o[k] = them[k]; });
        return o;
    }

    var KHONG_XOA = 'Chưa có thủ tục xoá lệnh: bản gốc gọi nhầm thủ tục xoá của Tài chính (Xoa_TC_KhoanThu_QDXuatHD) nên nút này tạm khoá';

    /* ---------- Khung lệnh ĐIỀU KIỆN / XẾP LOẠI ---------------------------- */
    N.lenh = function (host, o) {
        var L = N.LOAI[o.loai];
        var crud = ums.crud({
            root: host, embedded: true,
            title: 'Xem danh sách các lệnh ' + L.ten, icon: L.icon,
            formTitle: 'lệnh ' + L.nho,
            empty: 'Chưa có lệnh ' + L.nho,
            list: {
                call: function () {
                    return goi(L.ds, { strTuKhoa: o.tuKhoa(), strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000000 });
                }
            },
            columns: [
                { title: 'Từ khóa', prop: 'TUKHOA', cls: 'is-nowrap' },
                { title: 'Tên từ khóa hiển thị', prop: 'TENTUKHOA', cls: 'tndkn-dai' },
                { title: 'Mô tả', prop: 'MOTA', cls: 'tndkn-dai' },
                { title: 'Tên gói', prop: 'TENPKG' },
                { title: 'Tên phương thức', prop: 'TENFUNCTION' },
                { title: 'Tên liên kết', prop: 'TENDATABASELINK' },
                { title: 'Kiểu dữ liệu', prop: 'KIEUDULIEU', cls: 'is-center' },
                { title: 'Số chữ số làm tròn', prop: 'SOCHUSOLAMTRON', cls: 'is-center' },
                { title: 'Tham số chi tiết', cls: 'is-center is-nowrap', render: function (r) {
                    return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-tndkn-ts': e(r.ID), title: 'Xem tham số chi tiết' } });
                } }
            ],
            fields: [
                { key: 'strTuKhoa', col: 'TUKHOA', label: 'Từ khóa', required: true },
                { key: 'strTenTuKhoa', col: 'TENTUKHOA', label: 'Tên từ khóa' },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' },
                { key: 'strTenPKG', col: 'TENPKG', label: 'Tên gói' },
                { key: 'strTenFunction', col: 'TENFUNCTION', label: 'Tên phương thức' },
                { key: 'strTenDataBaseLink', col: 'TENDATABASELINK', label: 'Tên liên kết' },
                { key: 'strKieuDuLieu', col: 'KIEUDULIEU', label: 'Kiểu dữ liệu' },
                { key: 'strSoChuSoLamTron', col: 'SOCHUSOLAMTRON', label: 'Số chữ số làm tròn', type: 'number' }
            ],
            save: function (v, row) {
                return goi(row ? L.sua : L.them, {
                    strId: row ? row.ID : undefined,          // gốc: id undefined khi thêm (khoá bị bỏ khi gửi)
                    strTenTuKhoa: v.strTenTuKhoa,
                    strKieuDuLieu: v.strKieuDuLieu,
                    strSoChuSoLamTron: v.strSoChuSoLamTron,
                    strMoTa: v.strMoTa,
                    strNguoiThucHien_Id: '',
                    strTuKhoa: v.strTuKhoa,
                    strTenFunction: v.strTenFunction,
                    strTenDataBaseLink: v.strTenDataBaseLink,
                    strTenPKG: v.strTenPKG,
                    strPhanLoai_Id: o.phanLoai(),
                    dSoChuSoLamTron: v.strSoChuSoLamTron
                });
            },
            toolbar: [{ text: 'Xóa', icon: 'fa-trash-can', mod: 'danger', onClick: function () { ui.toast(KHONG_XOA, 'warn'); } }]
        });

        // Nút Xóa lệnh: giữ như gốc nhưng khoá (xem chú thích đầu tệp); nút lưu giữ chữ gốc
        var nutXoa = host.querySelector('[data-c="' + crud.uid + ':tool0"]');
        if (nutXoa) { nutXoa.disabled = true; nutXoa.title = KHONG_XOA; nutXoa.classList.add('ums-btn--sm'); }
        var nutLuu = host.querySelector('[data-c="' + crud.uid + ':save"] span');
        if (nutLuu) nutLuu.textContent = 'Lưu lệnh ' + L.nho;

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tndkn-ts]');
            if (!b || !host.contains(b)) return;
            var id = b.getAttribute('data-tndkn-ts');
            var r = crud.rows.filter(function (x) { return e(x.ID) === id; })[0];
            if (r) N.thamSo(o.man, o.loai, r);
        });
        return crud;
    };

    /* ---------- Màn con: tham số chi tiết của một lệnh --------------------- */
    N.thamSo = function (man, loai, lenh) {
        var L = N.LOAI[loai], T = L.ts;
        var box = document.createElement('div');
        pat.formTrang({
            host: man, icon: 'fa-list-check', flush: true, body: box,
            title: 'Chi tiết tham số lệnh ' + L.ten + ' - ' + e(lenh.TUKHOA)
        });

        var crud = ums.crud({
            root: box, embedded: true,
            title: 'Danh sách tham số', icon: 'fa-list-ul',
            formTitle: 'tham số chi tiết ' + L.nho,
            empty: 'Lệnh này chưa có tham số',
            list: {
                call: function () {
                    var c = goi(T.ds, { strNguoiThucHien_Id: '' });
                    c[T.khoa] = lenh.ID;            // strTN_XetDuyet_TuKhoa_Id | strTN_XepLoai_TuKhoa_Id
                    return c;
                }
            },
            columns: [
                { title: 'Tên tham số', prop: 'TENTHAMSO' },
                { title: 'Giá trị mặc định', prop: 'GIATRIMACDINH' },
                { title: 'Phân loại', prop: 'PHANLOAI' },
                { title: 'Mô tả', prop: 'MOTA', cls: 'tndkn-dai' },
                { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center' }
            ],
            fields: [
                { key: 'strTenThamSo', col: 'TENTHAMSO', label: 'Tên tham số', required: true },
                { key: 'strGiaTriMacDinh', col: 'GIATRIMACDINH', label: 'Giá trị mặc định' },
                { key: 'strPhanLoai', col: 'PHANLOAI', label: 'Phân loại' },
                { key: 'strThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }
            ],
            save: function (v, row) {
                var x = goi(row ? T.sua : T.them, {
                    strId: row ? row.ID : undefined,
                    strTenThamSo: v.strTenThamSo,
                    strGiaTriMacDinh: v.strGiaTriMacDinh,
                    strPhanLoai: v.strPhanLoai,
                    strThuTu: v.strThuTu,
                    strMoTa: v.strMoTa,
                    strNguoiThucHien_Id: ''
                });
                x[T.khoa] = lenh.ID;
                return x;
            },
            remove: function (ids) {
                return ids.map(function (id) { return goi(T.xoa, { strId: id, strNguoiThucHien_Id: '' }); });
            },
            toolbar: [{ text: 'Kế thừa', icon: 'fa-link-slash', onClick: function () { keThua(); } }]
        });

        function keThua() {
            var dlg = ui.dialog({
                title: 'Kế thừa tham số ' + L.ten, icon: 'fa-link-slash', size: 'md',
                body: '<div class="ums-grid ums-grid--2">' +
                    ui.field('Từ khóa nguồn', '<input class="ums-input" data-k="nguon" autocomplete="off">', { required: true }) +
                    ui.field('Từ khóa đích', '<input class="ums-input" data-k="dich" autocomplete="off">', { required: true }) +
                    '</div>',
                buttons: [{ text: 'Lưu Kế thừa Tham số ' + L.nho, kind: 'save', onClick: function () {
                    var ng = dlg.body.querySelector('[data-k="nguon"]'), di = dlg.body.querySelector('[data-k="dich"]');
                    var vNg = ng.value.trim(), vDi = di.value.trim();
                    ng.classList.toggle('is-invalid', !vNg);
                    di.classList.toggle('is-invalid', !vDi);
                    if (!vNg || !vDi) { ui.toast('Kiểm tra lại: ' + [!vNg ? 'Từ khóa nguồn' : '', !vDi ? 'Từ khóa đích' : ''].filter(Boolean).join(', '), 'warn'); return false; }
                    var c = goi(T.keThua, { strNguoiThucHien_Id: '' });
                    c[T.nguon] = vNg;
                    c[T.dich] = vDi;
                    ums.api.call(c).then(function () {
                        ui.toast('Kế thừa thành công!', 'ok');
                        dlg.close();
                        crud.load();
                    }).catch(function (err) { ums.api.handle(err, 'kế thừa tham số'); });
                    return false;
                } }]
            });
            dlg.body.querySelector('[data-k="dich"]').value = e(lenh.TUKHOA);
        }
        return crud;
    };
})();
