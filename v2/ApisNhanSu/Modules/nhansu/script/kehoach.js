/* =========================================================================
   Kế hoạch tuyển dụng (Nhân sự)
   Bản gốc: ApisNhanSu/Modules/nhansu/html/kehoach.html + script/kehoach.js (vỏ index, Bootstrap 5).
   ApisNhanSu/Modules/kehoach/html/kehoach.html GIỐNG HỆT (cùng md5) và cũng nạp modules/nhansu/script/kehoach.js
   → hai chức năng dùng CHUNG tệp này. (ApisNhanSu/Modules/kehoach/script/kehoach.js là một màn khác, cũ,
   KHÔNG được html nào nạp — không chuyển.)
   ---------------------------------------------------------------------------
   Bố cục gốc: MỘT cột — thanh lọc Năm + bảng kế hoạch; mọi việc khác mở modal chồng modal. Ở đây các
   modal danh sách thành VÙNG THAY CHỖ trong trang (ums.nsTd.tang), biểu mẫu thay chỗ danh sách (ums.crud):
       Kế hoạch ─┬─ Các đợt tuyển dụng ─┬─ Đề xuất của các đơn vị theo đợt ── Hồ sơ ứng viên theo đề xuất
                 │                      └─ Hội đồng ── Thành viên hội đồng
                 └─ Tổng hợp đề xuất ── Hồ sơ ứng viên theo đề xuất
   Lời gọi (chép nguyên, NS_TD_ThongTin_MH / NS_TD_Chung_MH, mã hoá):
       pkg_ns_td_chung.LayDSNam_NS_TD · LayDSNhanSu_MauHoSo
       pkg_ns_td_thongtin.LayDSNS_TD_KeHoach (strTuKhoa '' · strNam) · Them_/Sua_/Xoa_NS_TD_KeHoach
       LayDSNS_TD_KeHoach_Dot · Them_/Sua_NS_TD_KeHoach_Dot · Xoa_NS_TD_KeHoach_Dot (xem "Khác gốc")
       LayDSNS_TD_KeHoach_DeXuat (xem "Khác gốc") · LayDSNS_TD_KeHoach_DeXuat_HS
       LayDSNS_TD_KeHoach_HD · Them_/Sua_/Xoa_NS_TD_KeHoach_HD
       LayDSNS_TD_KeHoach_HD_TV · Them_/Sua_/Xoa_NS_TD_KeHoach_HD_TV
       NS_CoCauToChuc/LayDanhSach GET · NS_HoSoV2/LayDanhSach GET (strDaoTao_CoCauToChuc_Id, 1, 100000)
       Danh mục: NS.TD.PHANLOAI, NS.TD.VAITRO
   Khác gốc (lỗi rõ, làm theo ý định — ghi báo cáo):
     · Xoá ĐỢT: gốc gọi Xoa_NS_TD_KeHoach (xoá nhầm KẾ HOẠCH theo id đợt) → Xoa_NS_TD_KeHoach_Dot.
     · Đề xuất (Tổng hợp đề xuất / Đề xuất theo đợt): gốc gọi LayDSNS_TD_KeHoach_Dot (trả ĐỢT) mà đọc cột
       đề xuất → luôn trống; nay gọi LayDSNS_TD_KeHoach_DeXuat như màn dexuattuyendung.
     · Nút "Hội đồng" của đợt: gốc mở thẳng khung Thành viên (bảng trùng id tblHoiDong nên không hiện gì);
       khung "Thông tin hội đồng" (Thêm/Sửa/Xoá hội đồng) không có lối vào, hộp Thêm/Sửa hội đồng sai id
       (themmoiHoiDong ≠ themmoihoidong) nên chưa từng mở. Nay: Đợt → Hội đồng → Thành viên.
     · Sửa hội đồng: gốc đổ nhầm TUNGAY/DENNGAY vào ô của đợt, không đổ tên → đổ TENHOIDONG, MOTA.
   Giữ như gốc: "Loại hội đồng" (strLoaiHopDong_Id) — gốc KHÔNG nạp danh mục cho ô này → ô trống, gửi rỗng.
     Các ô strNgayQD / strSoQD / dThuTu gửi rỗng (txtAAAA). Nút "Nhân sự" (xử lý bị chú thích), "Kết quả
     tuyển dụng", "Kết quả đánh giá của hội đồng" (không có xử lý), "Duyệt" (không có xử lý) → giữ nút, khoá.
     "Tổng hợp kết quả": gốc mở hộp khung mẫu (tiêu đề cột viết cứng "Nguyễn Văn X", thân trống, nút Lưu không
     xử lý) → khoá nút.
   Ô Đơn vị → Thành viên: Đơn vị chỉ để LỌC danh sách thành viên (không gửi) → lọc tuỳ chọn, KHÔNG khoá;
     đổi/xoá Đơn vị thì nạp lại danh sách và xoá trắng Thành viên.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, T = ums.nsTd;
    var root = document.getElementById('ns-kehoach');
    if (!root) return;
    var AC = T.AC, P = T.P;

    root.innerHTML = '<div data-z="kh"></div>';
    var zKh = root.querySelector('[data-z="kh"]');
    var tang = T.tang(zKh);

    /* ---------- Kế hoạch ---------------------------------------------------- */
    var kh = ums.crud({
        root: zKh, title: 'Kế hoạch tuyển dụng', listTitle: 'Kế hoạch tuyển dụng', formTitle: 'kế hoạch',
        icon: 'fa-calendar-lines', formCols: 1, rowDelete: false, formDelete: false,   // gốc: chỉ ô đánh dấu + Xóa
        filters: [{ key: 'nam', type: 'select', label: 'Chọn Năm', source: T.srcNam() }],
        list: {
            call: function (f) { return { action: AC + 'DSA4BRIPEh4VBR4KJAkuICIp', func: P + 'LayDSNS_TD_KeHoach', strTuKhoa: '', strNam: f.nam }; }
        },
        columns: [
            { title: 'Mã kế hoạch', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên kế hoạch', prop: 'TEN' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Mẫu hồ sơ kê khai', prop: 'NHANSU_MAUHOSO_TEN', cls: 'is-center' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
            { title: 'Các đợt tuyển dụng', cls: 'is-center is-nowrap', render: function (r) { return T.nut('dot', r.ID); } },
            { title: 'Nhân sự', cls: 'is-center is-nowrap', render: function (r) { return T.nut('ns', r.ID, 'Bản gốc chưa có xử lý cho nút này'); } },
            { title: 'Tổng hợp đề xuất', cls: 'is-center is-nowrap', render: function (r) { return T.nut('dx', r.ID); } },
            { title: 'Tổng hợp kết quả', cls: 'is-center is-nowrap', render: function (r) { return T.nut('kq', r.ID, 'Bản gốc chỉ là khung mẫu, chưa có dữ liệu'); } }
        ],
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã kế hoạch', required: true },
            { key: 'strTen', col: 'TEN', label: 'Tên kế hoạch', required: true },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', required: true, source: { dm: 'NS.TD.PHANLOAI' } },
            { key: 'strNhanSu_MauHoSo_Id', col: 'NHANSU_MAUHOSO_ID', label: 'Mẫu hồ sơ kê khai', type: 'select', placeholder: 'Chọn mẫu hồ sơ',
                source: { call: { action: T.CH + 'DSA4BRIPKSAvEjQeDCA0CS4SLgPP', func: T.PC + 'LayDSNhanSu_MauHoSo' }, id: 'ID', name: 'TEN' } },
            { key: 'strNam', col: 'NAM', label: 'Năm', type: 'select', placeholder: 'Chọn Năm', source: T.srcNam() },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ],
        onForm: function (row, c) {
            // Thêm mới: năm lấy theo ô lọc (btnAdd_KeHoach của gốc)
            if (!row) {
                var el = T.fo(c, 'strNam');
                if (el) { el.value = c.filterValues().nam || ''; if (window.jQuery) jQuery(el).trigger('change.select2'); }
            }
        },
        save: function (v, row) {
            return {
                action: AC + (row ? 'EjQgHg8SHhUFHgokCS4gIikP' : 'FSkkLB4PEh4VBR4KJAkuICIp'),
                func: P + (row ? 'Sua_NS_TD_KeHoach' : 'Them_NS_TD_KeHoach'),
                strId: row ? row.ID : '', strTen: v.strTen, strMa: v.strMa, strNam: v.strNam, strMoTa: v.strMoTa,
                strPhanLoai_Id: v.strPhanLoai_Id, strNhanSu_MauHoSo_Id: v.strNhanSu_MauHoSo_Id
            };
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: AC + 'GS4gHg8SHhUFHgokCS4gIikP', func: P + 'Xoa_NS_TD_KeHoach', strId: id }; });
        }
    });

    function tim(crud, id) { return (crud.rows || []).filter(function (r) { return r.ID === id; })[0]; }
    function ganNut(host, crud, xuLy) {
        host.addEventListener('click', function (e) {
            var b = e.target.closest('[data-x]');
            if (!b || b.disabled || !host.contains(b)) return;
            var r = tim(crud, b.getAttribute('data-id'));
            if (r && xuLy[b.getAttribute('data-x')]) xuLy[b.getAttribute('data-x')](r);
        });
    }
    ganNut(zKh, kh, {
        dot: moDot,
        dx: function (k) { moDeXuat(k, null); }
    });

    /* ---------- Các đợt tuyển dụng ------------------------------------------ */
    function moDot(k) {
        var el = tang.push();
        var c = ums.crud({
            root: el, embedded: true, back: tang.pop, formCols: 1, icon: 'fa-calendar-range', rowDelete: false, formDelete: false,
            title: 'Các đợt tuyển dụng — ' + (k.TEN || ''), formTitle: 'đợt tuyển dụng',
            list: {
                call: function () { return { action: AC + 'DSA4BRIPEh4VBR4KJAkuICIpHgUuNQPP', func: P + 'LayDSNS_TD_KeHoach_Dot', strTuKhoa: '', strNS_TD_KeHoach_Id: k.ID }; }
            },
            columns: [
                { title: 'Mô tả', prop: 'MOTA' },
                { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center' },
                { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center' },
                { title: 'Đề xuất của các đơn vị', cls: 'is-center is-nowrap', render: function (r) { return T.nut('dx', r.ID); } },
                { title: 'Hội đồng', cls: 'is-center is-nowrap', render: function (r) { return T.nut('hd', r.ID); } },
                { title: 'Trạng thái duyệt', prop: 'TRANGTHAI_TEN', cls: 'is-center' },
                { title: 'Kết quả tuyển dụng', cls: 'is-center is-nowrap', render: function (r) { return T.nut('kq', r.ID, 'Bản gốc chưa có xử lý cho nút này'); } }
            ],
            fields: [
                { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
                { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
            ],
            save: function (v, row) {
                return {
                    action: AC + (row ? 'EjQgHg8SHhUFHgokCS4gIikeBS41' : 'FSkkLB4PEh4VBR4KJAkuICIpHgUuNQPP'),
                    func: P + (row ? 'Sua_NS_TD_KeHoach_Dot' : 'Them_NS_TD_KeHoach_Dot'),
                    strId: row ? row.ID : '', strNS_TD_KeHoach_Id: k.ID,
                    strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay, strMoTa: v.strMoTa
                };
            },
            remove: function (ids) {
                // Gốc gọi Xoa_NS_TD_KeHoach (xoá nhầm kế hoạch) — nay xoá đúng ĐỢT
                return ids.map(function (id) { return { action: AC + 'GS4gHg8SHhUFHgokCS4gIikeBS41', func: P + 'Xoa_NS_TD_KeHoach_Dot', strId: id }; });
            }
        });
        ganNut(el, c, {
            dx: function (d) { moDeXuat(k, d); },
            hd: function (d) { moHoiDong(k, d); }
        });
    }

    /* ---------- Đề xuất (theo kế hoạch hoặc theo đợt) · Hồ sơ ứng viên -------- */
    function moDeXuat(k, d) {
        var el = tang.push();
        var c = ums.crud({
            root: el, embedded: true, back: tang.pop, icon: 'fa-file-circle-plus',
            title: d ? 'Đề xuất của các đơn vị theo đợt — ' + (d.TUNGAY || '') + ' - ' + (d.DENNGAY || '') : 'Tổng hợp đề xuất — ' + (k.TEN || ''),
            toolbar: [{ text: 'Duyệt', icon: 'fa-circle-check', mod: 'save', onClick: function () {} }],
            list: { call: function () { return T.deXuat(k.ID, d ? d.ID : ''); } },
            columns: [
                { title: 'Đơn vị đề xuất', prop: 'DONVIDEXUAT_TEN' },
                { title: 'Cán bộ đưa thông tin', prop: 'NGUOIDEXUAT_TAIKHOAN' },
                { title: 'Vị trí công việc đề xuất', prop: 'VITRICONGVIECDEXUAT_TEN' },
                { title: 'Số lượng đề xuất', prop: 'SOLUONGDEXUAT', cls: 'is-center' },
                { title: 'Hồ sơ ứng viên theo đề xuất', cls: 'is-center is-nowrap', render: function (r) { return T.nut('hs', r.ID); } },
                { title: 'Mô tả', prop: 'MOTA' },
                { title: 'Trạng thái duyệt', prop: 'TRANGTHAI_TEN', cls: 'is-center' }
            ]
        });
        // "Duyệt" của gốc không có xử lý → giữ nút, khoá
        var duyet = el.querySelector('[data-c="' + c.uid + ':tool0"]');
        if (duyet) { duyet.disabled = true; duyet.title = 'Bản gốc chưa có xử lý cho nút này'; }
        ganNut(el, c, {
            hs: function (x) {
                var e2 = tang.push();
                ums.crud({
                    root: e2, embedded: true, back: tang.pop, icon: 'fa-id-card',
                    title: 'Hồ sơ ứng viên theo đề xuất — ' + (x.DONVIDEXUAT_TEN || ''),
                    list: { call: function () { return T.hoSo(k.ID, d ? d.ID : '', x.ID); } },
                    columns: T.cotHoSo()
                });
            }
        });
    }

    /* ---------- Hội đồng · Thành viên hội đồng -------------------------------- */
    function moHoiDong(k, d) {
        var el = tang.push();
        var c = ums.crud({
            root: el, embedded: true, back: tang.pop, formCols: 1, icon: 'fa-people-group', rowDelete: false, formDelete: false,
            title: 'Thông tin hội đồng theo đợt — ' + (d.TUNGAY || '') + ' - ' + (d.DENNGAY || ''), formTitle: 'hội đồng',
            list: {
                call: function () { return { action: AC + 'DSA4BRIPEh4VBR4KJAkuICIpHgkF', func: P + 'LayDSNS_TD_KeHoach_HD', strNS_TD_KeHoach_Dot_Id: d.ID }; }
            },
            columns: [
                { title: 'Loại hội đồng', prop: 'LOAIHOIDONG_TEN' },
                { title: 'Tên hội đồng', prop: 'TENHOIDONG' },
                { title: 'Quyết định', render: function (r) { return esc((r.SOQD || '') + ' - ' + (r.NGAYQD || '')); } },
                { title: 'Thành viên hội đồng', cls: 'is-center is-nowrap', render: function (r) { return T.nut('tv', r.ID); } },
                { title: 'Kết quả đánh giá của hội đồng', cls: 'is-center is-nowrap', render: function (r) { return T.nut('kq', r.ID, 'Bản gốc chưa có xử lý cho nút này'); } }
            ],
            fields: [
                { key: 'strLoaiHopDong_Id', get: function () { return ''; }, label: 'Loại hội đồng', type: 'select', placeholder: 'Chọn loại hội đồng',
                    hint: 'Bản gốc chưa nạp danh mục cho ô này', source: { items: [] } },
                { key: 'strTenHoiDong', col: 'TENHOIDONG', label: 'Tên hội đồng' },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
            ],
            save: function (v, row) {
                return {
                    action: AC + (row ? 'EjQgHg8SHhUFHgokCS4gIikeCQUP' : 'FSkkLB4PEh4VBR4KJAkuICIpHgkF'),
                    func: P + (row ? 'Sua_NS_TD_KeHoach_HD' : 'Them_NS_TD_KeHoach_HD'),
                    strId: row ? row.ID : '', strNS_TD_KeHoach_Id: k.ID, strNS_TD_KeHoach_Dot_Id: d.ID,
                    strLoaiHopDong_Id: v.strLoaiHopDong_Id, strNgayQD: '', strSoQD: '',
                    strTenHoiDong: v.strTenHoiDong, strMoTa: v.strMoTa, dThuTu: ''
                };
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: AC + 'GS4gHg8SHhUFHgokCS4gIikeCQUP', func: P + 'Xoa_NS_TD_KeHoach_HD', strId: id }; });
            }
        });
        ganNut(el, c, { tv: function (h) { moThanhVien(d, h); } });
    }

    function napCanBo(donVi) {
        return ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', silent: true,
            strDaoTao_CoCauToChuc_Id: donVi || '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { return T.arr(r.data); });
    }
    function tenCanBo(r) { return (r.HODEM || '') + ' ' + (r.TEN || ''); }

    function moThanhVien(d, h) {
        var el = tang.push();
        var locDonVi = '';
        var c = ums.crud({
            root: el, embedded: true, back: tang.pop, formCols: 1, icon: 'fa-users', rowDelete: false, formDelete: false,
            title: 'Thành viên hội đồng — ' + (h.TENHOIDONG || ''), formTitle: 'thành viên hội đồng',
            list: {
                call: function () {
                    return { action: AC + 'DSA4BRIPEh4VBR4KJAkuICIpHgkFHhUX', func: P + 'LayDSNS_TD_KeHoach_HD_TV',
                        strNS_TD_KeHoach_Dot_Id: d.ID, strNS_TD_KeHoach_HD_Id: h.ID };
                }
            },
            columns: [
                { title: 'Thành viên', render: function (r) { return esc((r.THANHVIEN_HODEM || '') + ' ' + (r.THANHVIEN_TEN || '') + ' - ' + (r.THANHVIEN_MASO || '')); } },
                { title: 'Vai trò', prop: 'VAITRO_TEN' },
                { title: 'Mô tả', prop: 'MOTA' }
            ],
            fields: [
                { key: '_donVi', label: 'Đơn vị', type: 'select', placeholder: 'Chọn đơn vị', source: T.srcDonVi(), get: function () { return ''; } },
                { key: 'strThanhVien_Id', col: 'THANHVIEN_ID', label: 'Thành viên', type: 'select', placeholder: 'Chọn thành viên',
                    source: { call: { action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strDaoTao_CoCauToChuc_Id: '', pageIndex: 1, pageSize: 100000 }, id: 'ID', name: tenCanBo } },
                { key: 'strVaiTro_Id', col: 'VAITRO_ID', label: 'Vai trò', type: 'select', source: { dm: 'NS.TD.VAITRO' } },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }
            ],
            onForm: function (row, cr) {
                // Danh sách thành viên đang lọc theo đơn vị cũ → nạp lại toàn bộ để thấy người đang sửa
                if (locDonVi) {
                    locDonVi = '';
                    var tv = T.fo(cr, 'strThanhVien_Id'), giu = tv.value;
                    napCanBo('').then(function (ds) { pat.fill(tv, ds, { name: tenCanBo }); tv.value = giu; jQuery(tv).trigger('change.select2'); });
                }
            },
            save: function (v, row) {
                return {
                    action: AC + (row ? 'EjQgHg8SHhUFHgokCS4gIikeCQUeFRcP' : 'FSkkLB4PEh4VBR4KJAkuICIpHgkFHhUX'),
                    func: P + (row ? 'Sua_NS_TD_KeHoach_HD_TV' : 'Them_NS_TD_KeHoach_HD_TV'),
                    strId: row ? row.ID : '', strNS_TD_KeHoach_Dot_Id: d.ID, strThanhVien_Id: v.strThanhVien_Id,
                    strVaiTro_Id: v.strVaiTro_Id, strNS_TD_KeHoach_HD_Id: h.ID, strMoTa: v.strMoTa, dThuTu: ''
                };
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: AC + 'GS4gHg8SHhUFHgokCS4gIikeCQUeFRcP', func: P + 'Xoa_NS_TD_KeHoach_HD_TV', strId: id }; });
            }
        });
        // Đơn vị → Thành viên: lọc TUỲ CHỌN (không khoá); đổi/xoá đơn vị thì nạp lại và xoá trắng thành viên
        var dv = T.fo(c, '_donVi'), tv = T.fo(c, 'strThanhVien_Id');
        if (window.jQuery && dv && tv) {
            jQuery(dv).on('select2:select select2:clear', function () {
                locDonVi = dv.value;
                tv.value = '';
                jQuery(tv).trigger('change.select2');
                napCanBo(dv.value).then(function (ds) { pat.fill(tv, ds, { name: tenCanBo }); })
                    .catch(function (err) { ums.api.handle(err, 'danh sách cán bộ'); });
            });
        }
    }
})();
