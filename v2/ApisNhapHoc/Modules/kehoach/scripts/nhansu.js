/* =========================================================================
   Kế hoạch nhân sự (phân bổ nhân sự cho kế hoạch nhập học)
   Bản gốc: ApisNhapHoc/Modules/kehoach/html/nhansu.html + scripts/nhansu.js
   ---------------------------------------------------------------------------
   Bố cục gốc: thanh tìm (Kế hoạch + từ khoá + nút) · bảng "Danh sách" (Tải lại, Xóa,
   Tạo mới) · biểu mẫu "Kế hoạch phân bổ nhân sự" thay chỗ danh sách:
     thêm mới — "#1 Chọn kế hoạch nhập học" (bảng kế hoạch, ô đánh dấu) +
                "#2 Chọn nhân sự tham gia" (nút Tìm kiếm mở hộp người dùng, bảng đã chọn + Hủy);
     sửa     — chỉ hiện "Kế hoạch nhập học …" / "Họ tên cán bộ …";
   cả hai có hai ô đánh dấu "Luôn hiển thị kế hoạch …". → ums.crud một cột.

   Lời gọi (chép nguyên):
     Danh sách  NH_KeHoachNhanSu/LayDanhSach  GET  strNguoiDung_Id "", strTAICHINH_KeHoach_Id,
                strNguoiThucHien_Id "", strTuKhoa, pageIndex/pageSize (phân trang máy chủ)
     Lưu        NH_KeHoachNhanSu/ThemMoi | CapNhat  POST  strId, strTAICHINH_KeHoach_Id,
                dLuonHienThDuChuaDenHan (1/0), dLuonHienThiDuHetHan (1/0), strNguoiDung_Id
                — thêm mới: MỖI kế hoạch đánh dấu × MỖI nhân sự đã chọn một lời gọi (hàng loạt có tiến độ);
                — sửa: kế hoạch / người dùng lấy của dòng đang sửa (TAICHINH_KEHOACHNHAPHOC_ID, NGUOIDUNG_ID)
     Xoá        NH_KeHoachNhanSu/Xoa  POST  strIds (nối dấu phẩy)
     Kế hoạch   edu.extend.getList_KeHoachNhapHoc → ums.nhKH.dsKeHoach()
     Người dùng edu.system.getList_NguoiDung: CMS_NguoiDung/LayDanhSach  GET  dTrangThai 1,
                strNguoiThucHien_Id "", strTuKhoa, pageIndex, pageSize, strPhanLoaiDoiTuong "",
                strChung_DonVi_Id, strVaiTro_Id "", strCapXuLy_Id "", strTinhThanh_Id ""
                — cột TENDAYDU, TAIKHOAN. Hộp chọn: khung ums.tlKh.hopChon của Đăng ký học
                (nạp chéo thilai/script/_chung.js): lọc Khoa/Viện → Bộ môn gửi vào
                strChung_DonVi_Id (tham số gốc vẫn có, gốc luôn để trống), chọn nhiều, giữ qua trang.

   Khác gốc:
     · Sửa đọc thẳng dòng danh sách (gốc cũng vậy — nút .btnEdit, không gọi LayChiTiet;
       nhánh btnEditRole_KHNS + LayChiTiet là mã chết).
     · Hộp người dùng: gốc để trống tới khi bấm tìm (dòng nạp sẵn bị chú thích bỏ);
       bản mới nạp trang 1 ngay khi mở; chọn nhiều một lần thay vì bấm "Chọn" từng dòng.
     · Hộp "Tìm kiếm kế hoạch" (#myModalKeHoach_KHNS) không có lối mở (nút bị chú thích) → bỏ.
     · Lưu xong quay về danh sách và nạp lại (gốc: nạp lại sau khi chạy hết hàng loạt, ở lại biểu mẫu).
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('nhansu');
    if (!root) return;
    var ums = window.ums, ui = ums.ui, N = ums.nhKH, T = ums.tlKh, e = N.e, esc = ui.esc;

    var KH = N.dsKeHoach();
    var dsKH = [];                    // danh sách kế hoạch (bảng #1)
    var chon = [];                    // nhân sự đã chọn [{ ID, TENDAYDU, TAIKHOAN }]
    var khung = null;                 // vùng #1/#2 hoặc dòng thông tin khi sửa

    var crud = ums.crud({
        root: root,
        title: 'Kế hoạch nhân sự',
        formTitle: 'kế hoạch phân bổ nhân sự',
        icon: 'fa-users-gear',
        addText: 'Tạo mới',
        filters: [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch nhập học', source: KH },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'NH_KeHoachNhanSu/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                    strNguoiDung_Id: '',
                    strTAICHINH_KeHoach_Id: f.kh,
                    strNguoiThucHien_Id: '',
                    strTuKhoa: f.q
                };
            }
        },
        columns: [
            { title: 'Kế hoạch', prop: 'TAICHINH_KEHOACHNHAPHOC_TEN' },
            { title: 'Nhân sự', prop: 'NGUOIDUNG_TENDAYDU' },
            { title: 'Tài khoản', prop: 'NGUOIDUNG_TAIKHOAN' }
        ],
        fields: [
            { key: '_hienThi', type: 'checks', label: 'Tùy chọn hiển thị', items: [
                { key: 'dLuonHienThDuChuaDenHan', col: 'LUONHIENTHDUCHUADENHAN', label: 'Luôn hiển thị kế hoạch dù chưa đến hạn', on: 1, off: 0 },
                { key: 'dLuonHienThiDuHetHan', col: 'LUONHIENTHIDUHETHAN', label: 'Luôn hiển thị kế hoạch dù đã hết hạn', on: 1, off: 0 }
            ] }
        ],
        save: function (v, row, c) {
            var co = {
                dLuonHienThDuChuaDenHan: v.dLuonHienThDuChuaDenHan === 1 ? 1 : 0,
                dLuonHienThiDuHetHan: v.dLuonHienThiDuHetHan === 1 ? 1 : 0
            };
            if (row) {
                return {
                    action: 'NH_KeHoachNhanSu/CapNhat', versionAPI: 'v1.0',
                    strId: row.ID,
                    strTAICHINH_KeHoach_Id: row.TAICHINH_KEHOACHNHAPHOC_ID,
                    dLuonHienThDuChuaDenHan: co.dLuonHienThDuChuaDenHan,
                    dLuonHienThiDuHetHan: co.dLuonHienThiDuHetHan,
                    strNguoiDung_Id: row.NGUOIDUNG_ID
                };
            }
            var khIds = T.daChon(khung, 'khck');
            var calls = [];
            khIds.forEach(function (kh) {
                chon.forEach(function (ns) {
                    calls.push({
                        action: 'NH_KeHoachNhanSu/ThemMoi', versionAPI: 'v1.0',
                        strId: '',
                        strTAICHINH_KeHoach_Id: kh,
                        dLuonHienThDuChuaDenHan: co.dLuonHienThDuChuaDenHan,
                        dLuonHienThiDuHetHan: co.dLuonHienThiDuHetHan,
                        strNguoiDung_Id: ns.ID
                    });
                });
            });
            if (!calls.length) { ui.toast('Vui lòng chọn kế hoạch nhập học và nhân sự tham gia', 'warn'); return null; }
            ui.batch(calls, { title: 'Đang lưu phân bổ nhân sự', okText: 'Thêm mới thành công!' }).then(function () {
                c.showList();
                c.load();
            });
            return null;
        },
        rowDelete: false,
        formDelete: false,
        remove: function (ids) {
            return { action: 'NH_KeHoachNhanSu/Xoa', versionAPI: 'v1.0', strIds: ids.join(',') };
        },
        removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa dữ liệu hệ thống?'; },

        onForm: function (row, c) {
            /* Vùng #1 / #2 đứng TRƯỚC hai ô đánh dấu như gốc — chèn đầu thân biểu mẫu */
            var body = c.z('form').querySelector('.ums-panel__body');
            khung = body.querySelector('[data-khns="khung"]');
            if (!khung) {
                khung = document.createElement('div');
                khung.setAttribute('data-khns', 'khung');
                khung.className = 'ums-u-mb-4 khns-khung';
                body.insertBefore(khung, body.firstChild);
                T.ganChon(khung);
            }
            if (row) { veSua(row); return; }
            chon = [];
            khung.innerHTML =
                '<div class="ums-legend">#1 Chọn kế hoạch nhập học</div>' +
                '<div data-khns="kh"></div>' +
                '<div class="ums-row ums-row--between khns-khung__nhom2">' +
                    '<div class="ums-legend ums-u-mb-0">#2 Chọn nhân sự tham gia</div>' +
                    ui.btn('search', { text: 'Tìm kiếm', mod: 'out-primary', attr: { 'data-khns': 'tim' } }) +
                '</div>' +
                '<div class="ums-u-mt-2" data-khns="ns"></div>';
            veKeHoach(c.filterValues().kh);
            veNhanSu();
        }
    });

    /* ---------- Sửa: chỉ hiện kế hoạch + cán bộ (lblKeHoach / lblNguoiDung gốc) ---------- */
    function veSua(r) {
        khung.innerHTML =
            '<div class="ums-kv"><span>Kế hoạch nhập học</span><b>' + esc(e(r.TAICHINH_KEHOACHNHAPHOC_TEN)) + '</b></div>' +
            '<div class="ums-kv"><span>Họ tên cán bộ</span><b>' +
                esc(e(r.NGUOIDUNG_TENDAYDU) + ' (' + e(r.NGUOIDUNG_TAIKHOAN) + ')') + '</b></div>';
    }

    /* ---------- #1 bảng kế hoạch: đánh dấu sẵn kế hoạch đang lọc (rewrite gốc) ---------- */
    function veKeHoach(khLoc) {
        var host = khung.querySelector('[data-khns="kh"]');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.crud.loadSource(KH).then(function (rs) {
            dsKH = rs;
            ui.table({
                el: host, rows: dsKH, empty: 'Chưa có kế hoạch nhập học',
                columns: [
                    { title: 'Kế hoạch', prop: 'TENKEHOACH' },
                    { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
                    { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                    T.cotChon('khck')
                ]
            });
            if (khLoc) {
                var x = host.querySelector('input[data-khck="' + String(khLoc).replace(/"/g, '') + '"]');
                if (x) x.checked = true;
            }
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kế hoạch nhập học'); });
    }

    /* ---------- #2 nhân sự đã chọn ---------- */
    function veNhanSu() {
        var host = khung.querySelector('[data-khns="ns"]');
        if (!host) return;
        ui.table({
            el: host, rows: chon, empty: 'Vui lòng chọn dữ liệu!',
            columns: [
                { title: 'Họ tên', prop: 'TENDAYDU' },
                { title: 'Tài khoản', prop: 'TAIKHOAN' },
                { title: '#', cls: 'is-actions', width: '72px', render: function (r, i) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-khns-huy="' + i + '" title="Hủy">' +
                        '<i class="fa-light fa-trash-can"></i></button>';
                } }
            ]
        });
    }

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-khns="tim"]')) { moHopNhanSu(); return; }
        var h = ev.target.closest('[data-khns-huy]');
        if (h) { chon.splice(Number(h.getAttribute('data-khns-huy')), 1); veNhanSu(); }
    });

    /* Hộp "Tìm kiếm nhân sự" — edu.system.getList_NguoiDung */
    function moHopNhanSu() {
        T.hopChon({
            title: 'Tìm kiếm nhân sự',
            cot: [
                { title: 'Họ tên', prop: 'TENDAYDU' },
                { title: 'Tài khoản', prop: 'TAIKHOAN' }
            ],
            call: function (q, dv, page, size) {
                return {
                    action: 'CMS_NguoiDung/LayDanhSach', method: 'GET',
                    dTrangThai: 1,
                    strNguoiThucHien_Id: '',
                    strTuKhoa: q,
                    pageIndex: page,
                    pageSize: size,
                    strPhanLoaiDoiTuong: '',
                    strChung_DonVi_Id: dv,
                    strVaiTro_Id: '',
                    strCapXuLy_Id: '',
                    strTinhThanh_Id: ''
                };
            },
            onPick: function (ids, rows) {
                var trung = 0;
                rows.forEach(function (r) {
                    if (chon.some(function (x) { return String(x.ID) === String(r.ID); })) { trung++; return; }
                    chon.push({ ID: r.ID, TENDAYDU: r.TENDAYDU, TAIKHOAN: r.TAIKHOAN });
                });
                if (trung) ui.toast(trung + ' nhân sự đã có trong danh sách', 'warn');
                veNhanSu();
            }
        });
    }
})();
