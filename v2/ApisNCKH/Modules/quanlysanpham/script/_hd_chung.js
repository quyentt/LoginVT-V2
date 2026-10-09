/* =========================================================================
   ApisNCKH / quanlysanpham — bản QUẢN TRỊ của các màn kê khai "đề tài sinh viên", "giảng dạy sau đại học",
   "hướng dẫn sau đại học": ums.nckhHD.*  (tiền tố _hd_ — module có nhiều nhóm cùng làm)
   Dùng lại khung Cổng cán bộ ums.nckh (ApisCongCanBo/Modules/sanphamkhoahoc/script/_sanpham.js): khối
   N.kinhPhi / N.nguoi, item cột trái. KHÔNG dùng N.man vì bản quản trị lệch ở chỗ N.man viết cứng:
     · ô lọc: N.man luôn có "năm đánh giá" + từ khoá; bản quản trị không có năm, detaisinhvien có thêm "Xếp loại";
     · danh sách: bản quản trị lấy MỌI bản ghi (strThanhVien_Id = '', strNguoiThucHien_Id = ''), không tự thêm
       người đăng nhập làm thành viên, không có "Sản phẩm thuộc đề tài", không có hộp "Tìm …".
   → H.man dưới đây là bản rút gọn của N.man (cùng móc onForm / onSaved, cùng khối) với ô lọc tuỳ màn.
   Đề xuất cờ cho _sanpham.js (khi được sửa tầng CCB): N.man nhận cfg.loc (ô lọc thêm) + cfg.nam === false đã có;
   khi đó H.man chỉ còn là một lời gọi N.man.
   ---------------------------------------------------------------------------
   Bản gốc: ApisNCKH/Modules/quanlysanpham/script/{detaisinhvien,giangdaysaudaihoc,huongdansaudaihoc}.js
   Khác bản gốc (tự chốt — ghi ở báo cáo chuyển đổi):
     · Giảng viên / học viên / sinh viên: chỉ gửi dòng MỚI, mỗi người một lời gọi (gốc gửi lại mọi dòng mỗi lần lưu
       → trùng). Hai màn sau đại học gốc gọi save_SinhVien(idSinhVien, idSanPham) với hàm CHỈ nhận (idSanPham) →
       strNCKH_SP_HD_GD_Id = id SINH VIÊN, học viên CHƯA TỪNG lưu được → nay gửi đúng id sản phẩm.
     · giangdaysaudaihoc: gốc gửi "Tên lớp dạy" vào dSoTacGia_n (cột số) và đọc lại SOTACGIA_N, trong khi bản Cổng cán
       bộ và màn Xác nhận kê khai lưu / đọc MOTA → nay gửi strMoTa + dSoTacGia_n = 1 như Cổng cán bộ (cùng bảng).
     · Cột "Thời gian" / "Nội dung" của giảng viên: gốc TRÁO khi lưu (strNoiDung = ô Thời gian) nhưng lại hiện KHÔNG
       tráo → nhập "3 tháng" hiện lại ở cột Nội dung. Giữ chỗ tráo khi lưu, hiện theo đúng chỗ tráo (như Cổng cán bộ).
     · Xoá sản phẩm: nút Xoá trong biểu mẫu (gốc: thùng rác trên từng mục cột trái — luật 12 cột trái không có nút).
     · Nút "Viết lại" của gốc không chuyển (biểu mẫu mở mới đã trống); thêm mới xong về danh sách (gốc hỏi "tiếp tục
       thêm?" — giữ id cũ nên lần lưu sau vẫn là thêm mới, không trùng).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nckh, ui = ums.ui, e = N.e;
    var H = ums.nckhHD = ums.nckhHD || {};
    function uid() { return N.uid(); }
    function esc(s) { return ui.esc(s); }
    function f(key, col, label, o) { return Object.assign({ key: key, col: col, label: label, cols: 4 }, o || {}); }
    function tep(label) { return [{ key: '_tep', type: 'files', api: 'NCKH_Files', label: label || 'File đính kèm' }]; }
    function hoTen(x) { return (e(x.HODEM) + ' ' + e(x.TEN)).trim() + (e(x.MASO) ? ' - ' + e(x.MASO) : ''); }
    H.hoTen = hoTen;

    /** Phân loại NCKH_SP_HuongDan_GiangDay: ID của mục danh mục NCKH.VTHDGD có MA = ma (genCombo_PhanLoai gốc) */
    H.phanLoai = function (ma) {
        return ums.api.dm('NCKH.VTHDGD').then(function (d) {
            var x = d.filter(function (r) { return r.MA === ma; })[0];
            return x ? x.ID : '';
        }).catch(function (err) { ums.api.handle(err, 'phân loại'); return ''; });
    };

    /* =====================================================================
       H.man(root, cfg) — khung hai cột (bản rút gọn của ums.nckh.man). cfg:
         tieuDe, dsTieuDe, icon, formTitle, ctl, loiChao, loc: [ô lọc crud thêm sau ô từ khoá],
         ds(f) → tham số danh sách, paged, ten(r), fields, luu(v, row) → tham số lưu, khoi: [khối ums.nckh],
         choNap (Promise — chờ trước khi nạp danh sách), onForm(row, crud, extra)
       ===================================================================== */
    H.man = function (root, cfg) {
        var khoi = cfg.khoi || [];
        var crud = ums.crud({
            root: root, title: cfg.tieuDe, formTitle: cfg.formTitle, icon: cfg.icon,
            master: { title: cfg.dsTieuDe, icon: cfg.icon, item: function (r) { return '<div class="nk-ten">' + esc(cfg.ten(r)) + '</div>'; },
                empty: cfg.loiChao || 'Hôm nay bạn có kế hoạch mới không? Bấm Thêm mới ở đầu trang.' },
            filters: [{ key: 'q', label: 'Nhập từ khóa tìm kiếm' }].concat(cfg.loc || []),
            autoload: false,
            list: { paged: cfg.paged !== false, call: function (x) { return Object.assign({ action: cfg.ctl + '/LayDanhSach', method: 'GET' }, cfg.ds(x)); } },
            fields: cfg.fields,
            formCols: 12,
            save: function (v, row) {
                var p = cfg.luu(v, row);
                p.action = cfg.ctl + (row ? '/CapNhat' : '/ThemMoi');
                p.strId = row ? row.ID : '';
                return p;
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: cfg.ctl + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; });
            },
            onForm: function (row, c, extra) {
                if (!extra) return;
                extra.innerHTML = khoi.map(function (k) { return '<div data-nk-khoi>' + k.html + '</div>'; }).join('');
                var hosts = extra.querySelectorAll('[data-nk-khoi]');
                khoi.forEach(function (k, i) { if (k.gan) k.gan(hosts[i], c); });
                if (row) khoi.forEach(function (k) { if (k.nap) k.nap(row); });
                else khoi.forEach(function (k) { if (k.moi) k.moi(); });
                if (cfg.onForm) cfg.onForm(row, c, extra, hosts);
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
                if (!id) return;
                var x = {};
                khoi.forEach(function (k) { if (k.gt) Object.assign(x, k.gt()); });
                khoi.filter(function (k) { return !cfg.luuKhoi || cfg.luuKhoi(k); }).reduce(function (p, k) {
                    return p.then(function () { return k.luu ? k.luu(id, isEdit, x) : null; });
                }, Promise.resolve());
            }
        });
        Promise.all([crud.sourcesReady, cfg.choNap]).then(function () { crud.load(1); });
        return crud;
    };

    /* ---------- Khối người (giảng viên / học viên) — cấu hình chung --------------------------------- */
    /** Học viên tham gia — NCKH_SP_HDGD_SinhVien (dòng LATHANHVIENCUATRUONG = 0 bỏ qua như gốc) */
    H.hocVien = function (o) {
        o = o || {};
        return N.nguoi({ tieuDe: o.tieuDe || 'Học viên tham gia', nguon: 'sinhvien',
            list: function (id) { return { action: 'NCKH_SP_HDGD_SinhVien/LayDanhSach', strNCKH_SP_HD_GD_Id: id }; },
            map: function (x) { return (o.locTruong !== false && e(x.LATHANHVIENCUATRUONG) === '0') ? null : { id: e(x.ID), ten: hoTen(x) }; },
            save: function (r, id) { return { action: 'NCKH_SP_HDGD_SinhVien/ThemMoi', strId: '', strNCKH_SP_HD_GD_Id: id, strSinhVien_Ids: r.id, strNguoiThucHien_Id: uid() }; },
            xoa: function (r, id) { return { action: 'NCKH_SP_HDGD_SinhVien/Xoa_SinhVien', strSinhVien_Ids: r.id, strNCKH_SP_HD_GD_Id: id, strNguoiThucHien_Id: uid() }; } });
    };

    /* ---------- Giảng dạy / Hướng dẫn sau đại học (bản quản trị) --------------------------------- */
    function sauDaiHoc(root, loai) {
        var gd = loai === 'GIANGDAY', plId = '';
        var pl = H.phanLoai(loai).then(function (v) { plId = v; });
        var gv = gd
            ? N.nguoi({ tieuDe: 'Giảng viên', nguon: 'nhansu',
                them: [{ key: 'thoiGian', title: 'Thời gian' }, { key: 'noiDung', title: 'Nội dung' }],
                list: function (id) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach', strNCKH_SP_HD_GD_Id: id }; },
                // lưu TRÁO (strNoiDung = ô Thời gian) như gốc → hiện NOIDUNGGIANGDAY dưới "Thời gian"
                map: function (x) { return e(x.LATHANHVIENCUATRUONG) === '0' ? null : { id: e(x.GIANGVIEN_ID), rowId: e(x.ID), ten: hoTen(x),
                    thoiGian: e(x.NOIDUNGGIANGDAY), noiDung: e(x.THOIGIAN) }; },
                save: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/ThemMoi', strId: '', strNCKH_SP_HD_GD_Id: id, strGiangVien_Ids: r.id,
                    strNoiDung: e(r.thoiGian), strThoiGian: e(r.noiDung), strNguoiThucHien_Id: uid() }; },
                xoa: function (r) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/Xoa', strIds: r.rowId }; } })
            : N.nguoi({ tieuDe: 'Giảng viên hướng dẫn', nguon: 'nhansu', vaiTro: 'NCKH.VHSV',
                list: function (id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach', strNCKH_SP_HD_GD_Id: id }; },
                map: function (x) { return e(x.LATHANHVIENCUATRUONG) === '0' ? null : { id: e(x.GIANGVIEN_ID), rowId: e(x.ID), ten: hoTen(x), vaiTroTen: e(x.VAITRO_TEN) }; },
                save: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/ThemMoi', strId: '', strNCKH_SP_HD_GD_Id: id, strGiangVien_Ids: r.id,
                    strVaiTro_Ids: e(r.vaiTro), strNguoiThucHien_Id: uid() }; },
                xoa: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/Xoa', strIds: r.rowId, strNCKH_SP_HD_GD_Id: id, strNguoiThucHien_Id: uid() }; } });
        return H.man(root, {
            tieuDe: gd ? 'Giảng dạy sau đại học' : 'Hướng dẫn sau đại học', dsTieuDe: 'Danh sách', icon: gd ? 'fa-chalkboard-user' : 'fa-user-tie',
            formTitle: gd ? 'giảng dạy sau đại học' : 'hướng dẫn sau đại học', ctl: 'NCKH_SP_HuongDan_GiangDay', paged: false,
            ten: function (r) { return e(r.TENDETAI_GIANGDAY); },
            ds: function (x) { return { strThanhVien_Id: '', strTuKhoa: x.q, strPhanLoai_Id: plId, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }; },
            fields: [
                { type: 'legend', label: gd ? 'Khởi tạo giảng dạy sau đại học' : 'Khởi tạo hướng dẫn sau đại học' },
                f('strTenDeTai_GiangDay', 'TENDETAI_GIANGDAY', gd ? 'Tên học phần' : 'Tên đề tài', { required: true, cols: 12 }),
                f('strMoTa', 'MOTA', gd ? 'Tên lớp dạy' : 'Tên học viên/Tên nghiên cứu sinh', { cols: 12 }),
                { type: 'legend', label: gd ? 'Thời gian giảng dạy' : 'Thời gian hướng dẫn' },
                f('strThoiGianBatDau', 'THOIGIANBATDAU', 'Từ tháng', { hint: 'mm/yyyy' }), f('strThoiGianKetThuc', 'THOIGIANKETTHUC', 'Đến tháng', { hint: 'mm/yyyy' }),
                f('strNamNghiemThu', 'NAMNGHIEMTHU', 'Năm nghiệm thu'),
                { type: 'legend', label: 'Nội dung minh chứng' }
            ].concat(tep(gd ? 'File đính kèm (Giấy báo giảng)' : 'File đính kèm (QĐ hướng dẫn, QĐ bảo vệ)')),
            khoi: [gv, H.hocVien()],
            choNap: pl,
            luu: function (v) {
                var p = { strTenDeTai_GiangDay: v.strTenDeTai_GiangDay, strNamNghiemThu: v.strNamNghiemThu, strThoiGianBatDau: v.strThoiGianBatDau,
                    strThoiGianKetThuc: v.strThoiGianKetThuc, strPhanLoai_Id: plId, strMoTa: v.strMoTa, iTrangThai: 1, iThuTu: 0, strNguoiThucHien_Id: uid() };
                if (gd) p.dSoTacGia_n = 1;           // hướng dẫn: gốc không gửi khoá này
                return p;
            }
        });
    }
    H.giangdaysaudaihoc = function (root) { return sauDaiHoc(root, 'GIANGDAY'); };
    H.huongdansaudaihoc = function (root) { return sauDaiHoc(root, 'HUONGDAN'); };

    /* ---------- Đề tài sinh viên (bản quản trị) — NCKH_SP_QuanLyDeTaiSinhVien ------------------------ */
    H.detaisinhvien = function (root) {
        return H.man(root, {
            tieuDe: 'Đề tài sinh viên', dsTieuDe: 'Đề tài sinh viên', icon: 'fa-user-graduate', formTitle: 'đề tài sinh viên', ctl: 'NCKH_SP_QuanLyDeTaiSinhVien',
            loiChao: 'Hôm nay bạn có đề tài mới không? Bấm Thêm mới ở đầu trang.',
            loc: [{ key: 'xl', type: 'select', label: 'Chọn xếp loại đề tài', source: { dm: 'NCKH.XLDT' } }],
            ten: function (r) { return e(r.TENDETAI); },
            ds: function (x) { return { strTuKhoa: x.q, strXepLoai_Id: x.xl, strTinhTrangXacNhan_Id: '', strThanhVien_Id: '', strNguoiThucHien_Id: '' }; },
            fields: [
                { type: 'legend', label: 'Thông tin đề tài' },
                f('strTenDeTai', 'TENDETAI', 'Tên đề tài', { required: true, cols: 12 }),
                f('strNamThucHien', 'NAMTHUCHIEN', 'Năm thực hiện', { cols: 6 }), f('strNamNghiemThu', 'NAMNGHIEMTHU', 'Năm nghiệm thu', { cols: 6 }),
                f('strDiemNghiemThu', 'DIEMNGHIEMTHU', 'Điểm nghiệm thu', { cols: 6 }),
                f('strXepLoai_Id', 'XEPLOAI_ID', 'Xếp loại', { type: 'select', cols: 6, source: { dm: 'NCKH.XLDT' } }),
                f('strQuyetDinhPheDuyet', 'QUYETDINHPHEDUYET', 'QĐ phê duyệt', { cols: 6 }), f('strQuyetDinhNghiemThu', 'QUYETDINHNGHIEMTHU', 'QĐ nghiệm thu', { cols: 6 }),
                f('strMoTa', 'MOTA', 'Tên sinh viên, nhóm sinh viên thực hiện', { cols: 12 }),
                { type: 'legend', label: 'Nội dung minh chứng' }
            ].concat(tep()),
            khoi: [N.kinhPhi({ khoaThem: 'strId' }),
                // Giảng viên hướng dẫn: controller RIÊNG NCKH_SP_QLDTSV_GiangVien (bản Cổng cán bộ dùng NCKH_ThanhVien).
                // Cột id người của gốc tên là SINHVIEN_ID (chép nguyên); xoá gửi ID dòng.
                N.nguoi({ tieuDe: 'Giảng viên hướng dẫn', nguon: 'nhansu',
                    list: function (id) { return { action: 'NCKH_SP_QLDTSV_GiangVien/LayDanhSach', strNCKH_SP_SinhVien_DeTai_Id: id }; },
                    map: function (x) { return { id: e(x.SINHVIEN_ID), rowId: e(x.ID), ten: hoTen(x) }; },
                    save: function (r, id) { return { action: 'NCKH_SP_QLDTSV_GiangVien/ThemMoi', strId: '', strNCKH_SP_QuanLyDeTaiSV_Id: id, strDanhSachGV_Ids: r.id, strNguoiThucHien_Id: uid() }; },
                    xoa: function (r) { return { action: 'NCKH_SP_QLDTSV_GiangVien/Xoa', strIds: r.rowId, strNguoiThucHien_Id: uid() }; } }),
                N.nguoi({ tieuDe: 'Sinh viên thực hiện', nguon: 'sinhvien', vaiTro: 'NCKH.VTSV',
                    list: function (id) { return { action: 'NCKH_SP_QLDTSV_SinhVien/LayDanhSach', strNCKH_SP_SinhVien_DeTai_Id: id }; },
                    map: function (x) { return { id: e(x.SINHVIEN_ID), rowId: e(x.ID), ten: hoTen(x), vaiTroTen: e(x.VAITRO_TEN) }; },
                    save: function (r, id) { return { action: 'NCKH_SP_QLDTSV_SinhVien/ThemMoi', strId: '', strNCKH_SP_QuanLyDeTaiSV_Id: id, strDanhSachSV_Ids: r.id, strVaiTro_Ids: e(r.vaiTro), strNguoiThucHien_Id: uid() }; },
                    xoa: function (r) { return { action: 'NCKH_SP_QLDTSV_SinhVien/Xoa', strIds: r.rowId, strNguoiThucHien_Id: uid() }; } })],
            luu: function (v) {
                return { strTenDeTai: v.strTenDeTai, strNamThucHien: v.strNamThucHien, strDiemNghiemThu: v.strDiemNghiemThu, strXepLoai_Id: v.strXepLoai_Id,
                    strMoTa: v.strMoTa, strNamNghiemThu: v.strNamNghiemThu, strQuyetDinhPheDuyet: v.strQuyetDinhPheDuyet,
                    strQuyetDinhNghiemThu: v.strQuyetDinhNghiemThu, strNguoiThucHien_Id: uid() };
            }
        });
    };
})();
