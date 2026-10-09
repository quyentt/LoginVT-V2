/* =========================================================================
   Quy định hồ sơ (Nhập học)
   Bản gốc: ApisNhapHoc/Modules/quydinh/html/hoso.html + scripts/hoso.js
   ---------------------------------------------------------------------------
   Bố cục như gốc: MỘT cột — thanh lọc (Kế hoạch nhập học · từ khoá · Tìm kiếm), danh sách, biểu mẫu thay chỗ danh
   sách (zone_input_QDHS); vùng "Phân quyền" (zone_phanquan) và hộp "Hồ sơ người dùng" → hộp thoại (việc phụ).
   Lời gọi (chép nguyên, GET/POST như gốc):
     Kế hoạch: PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (ums.nhQD — quydinh/scripts/_chung.js)
     Danh mục: NHAPHOC.HOSO (Loại hồ sơ) · NHAPHOC.TINHCHAT (Tính chất) · NHAPHOC.NHOM (Nhóm) · NHAPHOC.KIEUDULIEU (Kiểu dữ liệu)
     NH_QuyDinhHoSo/LayDanhSach (GET, versionAPI v1.0, phân trang) { strLoaiHoSo_Id "", strTinhChatHoSo_Id "",
         strNHAPHOC_KeHoach_Id, strNguoiThucHien_Id "", strTuKhoa }
     NH_QuyDinhHoSo/LayChiTiet (GET) { strId }
     NH_QuyDinhHoSo/ThemMoi | CapNhat (POST, versionAPI v1.0) { strId, strNguoiThucHien_Id, strLoaiHoSo_Id, dSoLuong,
         strTinhChatHoSo_Id, strNHAPHOC_KeHoach_Id, strNhomHoSo_Id, strKieuDuLieu_Id, iThuTu, strMoTa }
     NH_QuyDinhHoSo/Xoa (POST) { strIds (chuỗi id các dòng chọn), strNguoiThucHien_Id }
     Phân quyền:
       NH_ThongTin/LayDSNhapHoc_KeHoachNhanSu (GET) { type, strTuKhoa "", strNguoiDung_Id "", strTaiChinh_KeHoach_Id = ô lọc kế hoạch,
           strNguoiThucHien_Id, pageIndex 1, pageSize 1000000 }
       NH_ThamSo/Them_NhapHoc_QuyDinhHoSo_Quyen (POST) { type, strNhapHoc_KeHoach_Id = ô lọc, strNguoiDung_Id, strLoaiHoSo_Id,
           strNguoiThucHien_Id } — mỗi cặp người dùng × loại hồ sơ một lời gọi
       NH_ThamSo/LayDSNhapHoc_QuyDinhHoSo_Quyen (GET) { type, strNhapHoc_KeHoach_Id = ô lọc, strLoaiHoSo_Id, strNguoiThucHien_Id }
       NH_ThamSo/Xoa_NhapHoc_QuyDinhHoSo_Quyen (POST) { type, strId, strNguoiThucHien_Id }
   Kế hoạch ở ô lọc: có chọn → id kế hoạch; để trống → id người dùng (gốc: "khong chon ke hoach thi lay theo user");
     riêng lần tải ĐẦU khi mở màn gốc gửi chuỗi rỗng — giữ nguyên.
   Bảng như gốc (bHiddenOrder): cột đầu là THUTU, rồi Kế hoạch nhập học · Loại hồ sơ (bấm → "Hồ sơ người dùng") · Tính chất ·
     Số lượng · Nhóm · Kiểu dữ liệu · Sửa · ô chọn (xoá nhiều).
   TỰ CHỐT / KHÁC GỐC:
     · Nút "Viết lại" (xoá trắng biểu mẫu) bỏ — Đóng rồi Tạo mới cho biểu mẫu trống (như các màn đã chuyển).
     · Ảnh minh hoạ ho-so.svg bên phải biểu mẫu bỏ (trang trí).
     · Phân quyền: bắt chọn Kế hoạch ở ô lọc trước (gốc gửi strNhapHoc_KeHoach_Id rỗng nếu chưa chọn → quyền không gắn kế hoạch nào).
       Danh sách người dùng nạp lại mỗi lần mở hộp theo kế hoạch đang chọn (gốc nạp lúc mở màn và khi đổi kế hoạch).
       Bảng "Loại hồ sơ" trong hộp: gốc lấy nguyên các dòng quy định đang hiện (một loại có thể lặp) → ở đây gộp theo LOAIHOSO_ID.
     · Cột "Họ tên" của bảng người dùng: gốc ghép QLSV_NGUOIHOC_HODEM + QLSV_NGUOIHOC_TEN (cột người học) dù khai
       mDataProp NGUOIDUNG_TENDAYDU → hiện NGUOIDUNG_TENDAYDU, trống thì ghép như gốc.
     · Hộp "Hồ sơ người dùng": xoá xong nạp lại danh sách (gốc cũng vậy); nút Xoá = "Xoá đã chọn" ở chân hộp (luật chung).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nh-quydinh-hoso');
    if (!root) return;
    var ums = window.ums, ui = ums.ui, Q = ums.nhQD;
    var lanDau = true;

    function khTimKiem(f) {
        if (lanDau) { lanDau = false; return f.kh || ''; }
        return f.kh || ums.session.userId;
    }

    var crud = ums.crud({
        root: root,
        title: 'Quy định hồ sơ',
        formTitle: 'quy định hồ sơ',
        icon: 'fa-list',
        addText: 'Tạo mới',
        filters: [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch nhập học', source: Q.nguonKeHoach },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        toolbar: [{ text: 'Phân quyền', icon: 'fa-user-gear', mod: 'primary', onClick: function () { phanQuyen(); } }],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'NH_QuyDinhHoSo/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                    strLoaiHoSo_Id: '', strTinhChatHoSo_Id: '', strNHAPHOC_KeHoach_Id: khTimKiem(f), strNguoiThucHien_Id: '', strTuKhoa: f.q };
            }
        },
        columns: [
            { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center is-nowrap', width: '72px' },
            { title: 'Kế hoạch nhập học', prop: 'NHAPHOC_KEHOACHNHAPHOC_TEN' },
            { title: 'Loại hồ sơ', render: function (r) {
                return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-lhs="' + ui.esc(r.LOAIHOSO_ID) + '" title="Chi tiết">' +
                    '<i class="fa-light fa-eye"></i><span>' + ui.esc(r.LOAIHOSO_TEN || '') + '</span></button>';
            } },
            { title: 'Tính chất', prop: 'TINHCHATHOSO_TEN' },
            { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' },
            { title: 'Nhóm', prop: 'NHOMHOSO_TEN', cls: 'is-center' },
            { title: 'Kiểu dữ liệu', prop: 'KIEUDULIEU_TEN', cls: 'is-center' }
        ],
        rowDelete: false,
        formDelete: false,
        detail: function (row) { return { action: 'NH_QuyDinhHoSo/LayChiTiet', method: 'GET', versionAPI: 'v1.0', strId: row.ID }; },
        fields: [
            { key: 'strNHAPHOC_KeHoach_Id', type: 'hidden', col: 'NHAPHOC_KEHOACHNHAPHOC_ID' },
            { key: '_khTen', col: 'NHAPHOC_KEHOACHNHAPHOC_TEN', label: 'Kế hoạch nhập học', caDong: true },
            { key: 'strLoaiHoSo_Id', col: 'LOAIHOSO_ID', label: 'Loại hồ sơ', type: 'select', source: { dm: 'NHAPHOC.HOSO' }, placeholder: 'Chọn loại hồ sơ' },
            { key: 'strTinhChatHoSo_Id', col: 'TINHCHATHOSO_ID', label: 'Tính chất', type: 'select', source: { dm: 'NHAPHOC.TINHCHAT' }, placeholder: 'Chọn tính chất hồ sơ' },
            { key: 'dSoLuong', col: 'SOLUONG', label: 'Số lượng', placeholder: 'Nhập số lượng' },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự' },
            { key: 'strNhomHoSo_Id', col: 'NHOMHOSO_ID', label: 'Nhóm hồ sơ', type: 'select', source: { dm: 'NHAPHOC.NHOM' } },
            { key: 'strKieuDuLieu_Id', col: 'KIEUDULIEU_ID', label: 'Kiểu dữ liệu', type: 'select', source: { dm: 'NHAPHOC.KIEUDULIEU' } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ],
        onForm: function () { Q.ganKeHoach(crud, { idKey: 'strNHAPHOC_KeHoach_Id', tenKey: '_khTen' }); },
        // Gốc tắt kiểm tra hợp lệ (var valid = true) — gửi nguyên giá trị ô
        save: function (v, row) {
            return {
                action: row ? 'NH_QuyDinhHoSo/CapNhat' : 'NH_QuyDinhHoSo/ThemMoi', versionAPI: 'v1.0',
                strId: row ? row.ID : '', strNguoiThucHien_Id: ums.session.userId,
                strLoaiHoSo_Id: v.strLoaiHoSo_Id, dSoLuong: v.dSoLuong, strTinhChatHoSo_Id: v.strTinhChatHoSo_Id,
                strNHAPHOC_KeHoach_Id: v.strNHAPHOC_KeHoach_Id, strNhomHoSo_Id: v.strNhomHoSo_Id, strKieuDuLieu_Id: v.strKieuDuLieu_Id,
                iThuTu: v.iThuTu, strMoTa: v.strMoTa
            };
        },
        remove: function (ids) {
            return { action: 'NH_QuyDinhHoSo/Xoa', versionAPI: 'v1.0', strIds: ids.join(','), strNguoiThucHien_Id: ums.session.userId };
        }
    });

    function khLoc() { return crud.filterValues().kh; }

    /* ---------- Hộp "Hồ sơ người dùng" (myModalHoSoNguoiDung) ---------- */
    function hopNguoiDung(loaiId) {
        var dlg = ui.dialog({
            title: 'Hồ sơ người dùng', icon: 'fa-user-magnifying-glass', size: 'lg',
            body: '<div data-bang></div>',
            xoa: { chon: 'input[data-hsnd]', onClick: function () { xoa(); } }
        });
        var bang = dlg.body.querySelector('[data-bang]');
        Q.ganChonTatCa(bang);
        function tai() {
            bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            ums.api.call({ action: 'NH_ThamSo/LayDSNhapHoc_QuyDinhHoSo_Quyen', method: 'GET', type: 'GET',
                strNhapHoc_KeHoach_Id: khLoc(), strLoaiHoSo_Id: loaiId, strNguoiThucHien_Id: ums.session.userId
            }).then(function (r) {
                ui.table({
                    el: bang, rows: r.data || [], empty: 'Chưa phân quyền người dùng nào',
                    columns: [
                        { title: 'Loại hồ sơ', prop: 'LOAIHOSO_TEN' },
                        { title: 'Người dùng', render: function (x) { return ui.esc((x.NGUOIDUNG_TENDAYDU || '') + ' ' + (x.NGUOIDUNG_TAIKHOAN || '')); } },
                        { head: '<input type="checkbox" data-all="data-hsnd" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                          render: function (x) { return '<input type="checkbox" data-hsnd="' + ui.esc(x.ID) + '">'; } }
                    ]
                });
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'Hồ sơ người dùng'); });
        }
        function xoa() {
            var ids = Array.prototype.filter.call(bang.querySelectorAll('input[data-hsnd]'), function (x) { return x.checked; })
                .map(function (x) { return x.getAttribute('data-hsnd'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Xoá quyền của ' + ids.length + ' người dùng đã chọn?', { tone: 'bad', ok: 'Xoá', title: 'Xoá phân quyền' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) {
                    return { action: 'NH_ThamSo/Xoa_NhapHoc_QuyDinhHoSo_Quyen', type: 'POST', strId: id, strNguoiThucHien_Id: ums.session.userId };
                }), { title: 'Đang xoá phân quyền' }).then(function (r) {
                    if (r.ok) ui.toast('Đã xoá ' + r.ok + '/' + ids.length + ' dòng', 'ok');
                    if (r.fail) ui.toast(r.errors[0], 'bad');
                    tai();
                });
            });
        }
        tai();
    }

    /* ---------- Hộp "Phân quyền" (zone_phanquan) ---------- */
    function phanQuyen() {
        var kh = khLoc();
        if (!kh) { ui.toast('Vui lòng chọn Kế hoạch nhập học ở ô lọc trước khi phân quyền.', 'warn'); return; }
        var loai = [], thay = {};
        crud.rows.forEach(function (r) { if (r.LOAIHOSO_ID && !thay[r.LOAIHOSO_ID]) { thay[r.LOAIHOSO_ID] = 1; loai.push(r); } });

        var dlg = ui.dialog({
            title: 'Phân quyền', icon: 'fa-user-gear', size: 'xl',
            body: '<div class="nhqd-pq ums-cols">' +
                ums.pat.panel({ title: 'Danh sách người dùng', icon: 'fa-users', zone: 'nd', flush: true }) +
                ums.pat.panel({ title: 'Loại hồ sơ', icon: 'fa-folder-open', zone: 'lhs', flush: true }) + '</div>',
            buttons: [{ text: 'Phân quyền', kind: 'save', mod: 'primary', icon: 'fa-user-gear', onClick: function () { luu(); return false; } }]
        });
        var nd = dlg.body.querySelector('[data-z="nd"]'), lhs = dlg.body.querySelector('[data-z="lhs"]');
        Q.ganChonTatCa(dlg.body);

        ui.table({
            el: lhs, rows: loai, empty: 'Danh sách quy định chưa có loại hồ sơ',
            columns: [
                { title: 'Loại hồ sơ', render: function (r) {
                    return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-lhs="' + ui.esc(r.LOAIHOSO_ID) + '" title="Chi tiết">' +
                        '<i class="fa-light fa-eye"></i><span>' + ui.esc(r.LOAIHOSO_TEN || '') + '</span></button>';
                } },
                { head: '<input type="checkbox" data-all="data-pqlhs" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                  render: function (r) { return '<input type="checkbox" data-pqlhs="' + ui.esc(r.LOAIHOSO_ID) + '">'; } }
            ]
        });
        lhs.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-lhs]');
            if (b) hopNguoiDung(b.getAttribute('data-lhs'));
        });

        nd.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ums.api.call({ action: 'NH_ThongTin/LayDSNhapHoc_KeHoachNhanSu', method: 'GET', type: 'GET',
            strTuKhoa: '', strNguoiDung_Id: '', strTaiChinh_KeHoach_Id: kh, strNguoiThucHien_Id: ums.session.userId, pageIndex: 1, pageSize: 1000000
        }).then(function (r) {
            ui.table({
                el: nd, rows: r.data || [], empty: 'Kế hoạch chưa có nhân sự',
                columns: [
                    { title: 'Tài khoản', prop: 'NGUOIDUNG_TAIKHOAN' },
                    { title: 'Họ tên', render: function (x) {
                        return ui.esc(x.NGUOIDUNG_TENDAYDU || ((x.QLSV_NGUOIHOC_HODEM || '') + ' ' + (x.QLSV_NGUOIHOC_TEN || '')));
                    } },
                    { head: '<input type="checkbox" data-all="data-pqnd" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (x) { return '<input type="checkbox" data-pqnd="' + ui.esc(x.NGUOIDUNG_ID) + '">'; } }
                ]
            });
        }).catch(function (err) { nd.innerHTML = ui.fail(err.message); ums.api.handle(err, 'Danh sách người dùng'); });

        function chon(attr) {
            return Array.prototype.filter.call(dlg.body.querySelectorAll('input[' + attr + ']'), function (x) { return x.checked; })
                .map(function (x) { return x.getAttribute(attr); });
        }
        function luu() {
            var a = chon('data-pqnd'), b = chon('data-pqlhs');
            if (!(a.length * b.length)) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            var calls = [];
            a.forEach(function (n) {
                b.forEach(function (l) {
                    calls.push({ action: 'NH_ThamSo/Them_NhapHoc_QuyDinhHoSo_Quyen', type: 'POST', strNhapHoc_KeHoach_Id: kh,
                        strNguoiDung_Id: n, strLoaiHoSo_Id: l, strNguoiThucHien_Id: ums.session.userId });
                });
            });
            ui.batch(calls, { title: 'Đang phân quyền' }).then(function (r) {
                if (r.ok) ui.toast('Thêm mới thành công ' + r.ok + '/' + calls.length + ' quyền', 'ok');
                if (r.fail) ui.toast(r.errors[0], 'bad');
            });
        }
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-lhs]');
        if (b && root.contains(b)) hopNguoiDung(b.getAttribute('data-lhs'));
    });
})();
