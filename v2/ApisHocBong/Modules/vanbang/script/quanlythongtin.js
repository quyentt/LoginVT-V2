/* =========================================================================
   Quản lý thông tin văn bằng
   Bản gốc: ApisHocBong/Modules/vanbang/html/quanlythongtin.html + script/quanlythongtin.js
   (chép từ phân hệ Tốt nghiệp — mọi lời gọi là TN_* / TS_*)
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Phân loại · Đối tượng · từ khoá · Tìm kiếm)
   → khung "Danh sách kế hoạch (n)" (Sinh tự động số hiệu · Sinh tự động số vào sổ · Xác nhận) với bảng Ảnh ·
   Mã số · Họ tên · Ngày sinh · Giới tính · Dân tộc · Nơi sinh · Ngành nghề · Số hiệu bằng · Số vào sổ cấp bằng ·
   Số QĐ · Ngày QĐ · Ngày ký bằng · Ngày vào sổ · Sửa · ô đánh dấu → "1) Thông tin cơ bản" THAY CHỖ danh sách
   (ảnh bên trái, các ô Việt / Anh bên phải) · hộp "Duyệt hồ sơ" (nội dung, nút tình trạng, lịch sử).

   Lời gọi (chép nguyên):
       TN_KetQua_CongNhan_VB/LayDanhSach GET, phân trang máy chủ — strTuKhoa, strPhanLoai_Id, strDaoTao_HeDaoTao_Id,
            strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id ('' — ô đã chú thích trong html
            gốc), strDaoTao_LopQuanLy_Id, strNguoiDung_Id / strNguoiTao_Id / strTinhTrangXacNhan_Id ('' — dropAAAA),
            strChucNang_Id, dDoiTuongBenNgoai (ô Đối tượng -1 | 0 | 1).
       TN_KetQua_CongNhan_VB/CapNhat POST — "Lưu" biểu mẫu: strId, strChucNang_Id, strNgayKyBang, strNgayVaoSoCapBang,
            strSoQuyetDinh, strNgayQuyetDinh, strNguoiHoc_HoDem / _Ten / _MaSo / _HoDem_TA / _Ten_TA / _NgaySinh /
            _ThangSinh / _NamSinh / _NamSinh_TA / _ThangSinh_TA / _NgaySinh_TA / _GioiTinh / _GioiTinh_TA / _XepLoai_TA /
            _XepLoai / _NoiSinh / _DanToc / _NganhNghe / _NganhNghe_TA, strDuongDanCaNhan.
            (gốc: strId rỗng thì ThemMoi — nhưng html gốc không có nút Thêm nên chỉ còn CapNhat.)
       TN_KetQua_CongNhan_VB/SinhSoHieuVanBang · SinhSoVaoSo GET — mỗi dòng đánh dấu một lời gọi:
            strNgayThucHien ('' — txtAAAA), strPhanLoai_Id = giá trị ô ĐỐI TƯỢNG (như gốc), strTN_KetQua_CongNhan_VB_Id.
       Nút tình trạng của hộp "Duyệt hồ sơ": danh mục TN.XACNHANVANBANG (sắp theo HESO1) lúc mở màn; chọn Phân loại
            thì thay bằng TN_QuanLyThongTin/LayDSTinhTrangQuanLyThongTin GET (strNguoiDung_Id, strPhanLoai_Id).
            Icon THONGTIN1 (FA4 → ums.iconFA4), màu THONGTIN2.
       TS_QuanLyThongTinQuanLyThongTin/ThemMoi POST — bấm một tình trạng: mỗi dòng đánh dấu một lời gọi
            (strId '', strSanPham_Id, strNoiDung, strTinhTrang_Id, strNguoiQuanLyThongTin_Id).
       TN_VanBang_XacNhanIn/LayDanhSach GET — "Lịch sử duyệt" (strTuKhoa '', strsanpham_Id, strTinhTrang_Id '',
            strNguoiThucHien_Id '', pageIndex 1, pageSize 100000).
       Hệ → Khoá → CT → Lớp: ums.hbTh.dt (../../kehoach/script/_th.js); Phân loại: danh mục TN.PHANLOAI.

   Lỗi bản gốc — làm theo ý định:
     · "Sửa" CHƯA TỪNG CHẠY: viewEdit_QuanLyThongTin tìm được dòng (temp) nhưng đọc biến `data` không tồn tại →
       ReferenceError, biểu mẫu không mở. Bản mới đổ từ dòng: các cột gốc định đọc (QLSV_NGUOIHOC_MASO / HODEM / TEN /
       NGAYSINH / THANGSINH / NAMSINH / GIOITINH / DANTOC / NOISINH / NGANHNGHE) + bốn cột quyết định đã có trên bảng
       (SOQUYETDINH, NGAYQUYETDINH, NGAYKYBANG, NGAYVAOSOCAPBANG). Các ô tiếng Anh và Xếp loại gốc KHÔNG đổ (không
       biết tên cột) → để trống — lưu sẽ gửi rỗng cho các ô đó (ghi can-quyet).
     · strDuongDanCaNhan: gốc đọc giá trị của một <div> (luôn '') → lưu là xoá ảnh. Bản mới gửi lại đường dẫn ảnh
       đang có (DUONGDANANHCANHAN); ô ảnh chỉ để xem (gốc không gắn trình tải ảnh nào).
     · Khung sửa gốc không có nút đóng (.btnClose không có trên html) → bản mới có "Đóng"; lưu xong về danh sách.
     · "Lịch sử duyệt" gốc không bao giờ nạp (getList_QuanLyThongTinTN không ai gọi) → bản mới nạp khi đánh dấu
       ĐÚNG MỘT dòng; nhiều dòng thì ghi lời nhắc.
     · loadBtnQuanLyThongTin gán danh sách tình trạng đè lên dữ liệu bảng (dtQuanLyThongTin) — không chép.
   Khác gốc: Hệ → Khoá → CT → Lớp theo luật cha → con (khoá tầng dưới tới khi chọn tầng trên).
   Cố ý bỏ (mã chết): TN_KeHoach/Xoa (delete_QuanLyThongTin — nút #delete_HSSV đã chú thích), .btnAdd / rewrite
     (không có nút), #btnSave (chú thích), getList_ThoiGianDaoTao / NamNhapHoc / KhoaQuanLy / PhanLoai
     (TN_KeHoach/LayDSPhanLoaiXetTheoND2) / genList_TrangThaiSV (không ai gọi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.hbTh, esc = ui.esc, e = K.e;
    var root = document.getElementById('hb-quanlythongtin');
    if (!root) return;

    function sel(k, ph, them) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (them || '') + '>' +
            '<option value=""></option></select></div>';
    }
    function o(k, nhan, ph, cot) {
        return '<div style="grid-column:span ' + (cot || 6) + '">' + ui.field(nhan, '<input class="ums-input" data-v="' + k + '" placeholder="' + esc(ph || '') + '" autocomplete="off">') + '</div>';
    }
    function ngay(k, nhan) {
        return '<div style="grid-column:span 6">' + ui.field(nhan, '<input class="ums-input" data-v="' + k + '" data-date placeholder="dd/mm/yyyy" autocomplete="off">') + '</div>';
    }

    root.innerHTML = pat.page('Quản lý thông tin', '') +
        '<div data-z="ds">' +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                '<div class="ums-filter">' +
                    sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
                '</div><div class="ums-filter ums-u-mt-3">' +
                    sel('pl', 'Chọn phân loại') +
                    '<div class="ums-field"><select class="ums-select" data-f="dt" data-required>' +
                        '<option value="-1">Tất cả đối tượng</option><option value="0">Đối tượng trong trường</option>' +
                        '<option value="1">Đối tượng ngoài trường</option></select></div>' +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '</div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-building', count: 'n', flush: true, zone: 'bang',
                tools: ui.btn('search', { text: 'Sinh tự động số hiệu', mod: 'warn', icon: 'fa-gear', attr: { 'data-a': 'sohieu' } }) +
                    ui.btn('search', { text: 'Sinh tự động số vào sổ', mod: 'warn', icon: 'fa-gears', attr: { 'data-a': 'sovaoso' } }) +
                    ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } }) }) +
        '</div>' +
        '<div data-z="form" hidden>' +
            pat.panel({ title: '1) Thông tin cơ bản', icon: 'fa-pen-to-square',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
                body: '<div class="hbth-form"><div class="hbth-form__anh" data-z="anh"></div>' +
                    '<div class="ums-grid ums-grid--12">' +
                        o('strNguoiHoc_HoDem', 'Họ đệm', 'Họ đệm', 3) + o('strNguoiHoc_Ten', 'Tên', 'Tên', 3) +
                        o('strNguoiHoc_HoDem_TA', 'First Name', 'First Name', 3) + o('strNguoiHoc_Ten_TA', 'Last Name', 'Last Name', 3) +
                        o('strNguoiHoc_NgaySinh', 'Ngày sinh', 'Ngày sinh', 2) + o('strNguoiHoc_ThangSinh', 'Tháng sinh', 'Tháng sinh', 2) +
                        o('strNguoiHoc_NamSinh', 'Năm sinh', 'Năm sinh', 2) +
                        o('strNguoiHoc_NgaySinh_TA', 'Day', 'Day', 2) + o('strNguoiHoc_ThangSinh_TA', 'Month', 'Month', 2) +
                        o('strNguoiHoc_NamSinh_TA', 'Year', 'Year', 2) +
                        o('strNguoiHoc_MaSo', 'Mã số', 'Mã số') + o('strNguoiHoc_DanToc', 'Dân tộc', 'Dân tộc') +
                        o('strNguoiHoc_GioiTinh', 'Giới tính', 'Giới tính') + o('strNguoiHoc_GioiTinh_TA', 'Giới tính (tiếng Anh)', 'Giới tính') +
                        o('strNguoiHoc_NoiSinh', 'Nơi sinh', 'Nơi sinh', 12) +
                        o('strNguoiHoc_NganhNghe', 'Ngành nghề', 'Ngành nghề') + o('strNguoiHoc_NganhNghe_TA', 'Career', 'Ngành nghề') +
                        o('strNguoiHoc_XepLoai', 'Xếp loại', 'Xếp loại') + o('strNguoiHoc_XepLoai_TA', 'Graduation grade', 'Ngành nghề') +
                        o('strSoQuyetDinh', 'Số quyết định', 'Số quyết định') + ngay('strNgayQuyetDinh', 'Ngày quyết định') +
                        ngay('strNgayKyBang', 'Ngày ký bằng') + ngay('strNgayVaoSoCapBang', 'Ngày vào sổ cấp bằng') +
                    '</div></div>' }) +
        '</div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function vv(k) { return root.querySelector('[data-v="' + k + '"]'); }

    var dt = K.dt({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop') });
    ums.api.dm('TN.PHANLOAI').then(function (d) { pat.fill(f('pl'), d, { head: pat.dmTitle(d) || 'Chọn phân loại' }); })
        .catch(function (err) { ums.api.handle(err, 'phân loại'); });

    /* Nút tình trạng của hộp "Duyệt hồ sơ" */
    var dsTT = ums.api.dm('TN.XACNHANVANBANG', 'HESO1');
    dsTT.catch(function (err) { ums.api.handle(err, 'tình trạng duyệt'); });
    jQuery(f('pl')).on('select2:select', function () {
        dsTT = ums.api.call({ action: 'TN_QuanLyThongTin/LayDSTinhTrangQuanLyThongTin', method: 'GET',
            strNguoiDung_Id: K.uid(), strPhanLoai_Id: f('pl').value }).then(function (r) { return K.arr(r.data); });
        dsTT.catch(function (err) { ums.api.handle(err, 'TN_QuanLyThongTin/LayDSTinhTrangQuanLyThongTin'); });
    });

    /* ---- Danh sách ---- */
    var ds = [], trang = { index: 1, size: 10 }, luot = 0, dangSua = null;
    function tai(p) {
        if (p) trang.index = p;
        var sh = ++luot;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'TN_KetQua_CongNhan_VB/LayDanhSach', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strPhanLoai_Id: f('pl').value,
            strDaoTao_HeDaoTao_Id: dt.gtri('he'), strDaoTao_KhoaDaoTao_Id: dt.gtri('khoa'), strDaoTao_ChuongTrinh_Id: dt.gtri('ct'),
            strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: dt.gtri('lop'), strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: trang.index, pageSize: trang.size, strChucNang_Id: K.cn(),
            dDoiTuongBenNgoai: f('dt').value, strTinhTrangXacNhan_Id: '' })
            .then(function (r) {
                if (sh !== luot) return;
                ds = K.arr(r.data);
                ve(Number(r.pager) || 0);
            })
            .catch(function (err) {
                if (sh !== luot) return;
                z('bang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'TN_KetQua_CongNhan_VB/LayDanhSach');
            });
    }
    function anh(p) {
        return p ? '<img class="hbth-anh" alt="" src="' + esc(ums.files.url(p)) + '">' : '<i class="fa-light fa-user"></i>';
    }
    function ve(tong) {
        ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu',
            page: { index: trang.index, size: trang.size, total: tong || ds.length,
                onChange: function (p) { tai(p); }, onSize: function (s) { trang.size = s; tai(1); } },
            columns: [
                { title: 'Ảnh cá nhân', cls: 'is-center', render: function (r) { return anh(r.DUONGDANANHCANHAN); } },
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(K.hoTen(r)); } },
                { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (r) {
                    return esc(e(r.QLSV_NGUOIHOC_NGAYSINH) + '/' + e(r.QLSV_NGUOIHOC_THANGSINH) + '/' + e(r.QLSV_NGUOIHOC_NAMSINH));
                } },
                { title: 'Giới tính', prop: 'QLSV_NGUOIHOC_GIOITINH', cls: 'is-center' },
                { title: 'Dân tộc', prop: 'QLSV_NGUOIHOC_DANTOC', cls: 'is-center' },
                { title: 'Nơi sinh', prop: 'QLSV_NGUOIHOC_NOISINH', cls: 'is-center' },
                { title: 'Ngành nghề', prop: 'QLSV_NGUOIHOC_NGANHNGHE', cls: 'is-center' },
                { title: 'Số hiệu bằng', prop: 'SOHIEUBANG', cls: 'is-center' },
                { title: 'Số vào sổ cấp bằng', prop: 'SOVAOSOCAPBANG' },
                { title: 'Số quyết định', prop: 'SOQUYETDINH' },
                { title: 'Ngày quyết định', prop: 'NGAYQUYETDINH', cls: 'is-nowrap' },
                { title: 'Ngày ký bằng', prop: 'NGAYKYBANG', cls: 'is-nowrap' },
                { title: 'Ngày vào sổ cấp bằng', prop: 'NGAYVAOSOCAPBANG', cls: 'is-nowrap' },
                { title: 'Sửa', cls: 'is-actions', width: '64px', render: function (r, i) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-sua="' + i + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } },
                { head: '<input type="checkbox" data-ckall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (r) { return '<input type="checkbox" data-ck="' + esc(r.ID) + '">'; } }
            ] });
        z('n').textContent = '(' + (tong || ds.length) + ')';
    }
    function tim() { tai(1); }
    function daChon() {
        return Array.prototype.map.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck'); });
    }

    /* ---- Sinh tự động số hiệu / số vào sổ ---- */
    function sinhSo(loai) {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { ok: 'Đồng ý' }).then(function (ok) {
            if (!ok) return;
            ui.batch(ids.map(function (id) {
                return { action: 'TN_KetQua_CongNhan_VB/' + loai, method: 'GET', strNgayThucHien: '', strPhanLoai_Id: f('dt').value,
                    strTN_KetQua_CongNhan_VB_Id: id, strNguoiThucHien_Id: K.uid() };
            }), { title: 'Đang thực hiện', okText: 'Thực hiện thành công' }).then(function () { tai(); });
        });
    }

    /* ---- Hộp "Duyệt hồ sơ" ---- */
    function xacNhan() {
        var ids = daChon();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var dlg = ui.dialog({ title: 'Duyệt hồ sơ', icon: 'fa-circle-check', size: 'lg', body:
            '<div class="ums-legend">Nội dung duyệt hồ sơ</div>' +
            '<input class="ums-input" data-x="nd" autocomplete="off">' +
            '<div class="ums-legend ums-legend--cach">Chọn duyệt hồ sơ</div><div class="hbth-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
            '<div class="ums-legend ums-legend--cach">Lịch sử duyệt</div><div data-x="ls"></div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        dsTT.then(function (d) {
            q('nut').innerHTML = K.arr(d).length ? K.arr(d).map(function (t) {
                var ic = ums.iconFA4(e(t.THONGTIN1)) || 'fa-light fa-paper-plane';
                return '<button type="button" class="hbth-xn__nut" data-tt="' + esc(t.ID) + '">' +
                    '<i class="' + esc(ic) + '"' + (t.THONGTIN2 ? ' style="' + esc(t.THONGTIN2) + '"' : '') + '></i>' +
                    '<span>' + esc(t.TEN) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo tình trạng duyệt');
        }).catch(function (err) { q('nut').innerHTML = ui.fail(err.message); });
        if (ids.length === 1) {
            ums.api.call({ action: 'TN_VanBang_XacNhanIn/LayDanhSach', method: 'GET', strTuKhoa: '', strsanpham_Id: ids[0],
                strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    ui.table({ el: q('ls'), rows: K.arr(r.data), empty: 'Chưa có lịch sử duyệt', columns: [
                        { title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN' },
                        { title: 'Nội dung', prop: 'NOIDUNG' },
                        { title: 'Người xác nhận', prop: 'NGUOIQuanLyThongTin_TENDAYDU' },
                        { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '100px' }] });
                })
                .catch(function (err) { q('ls').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử duyệt'); });
        } else {
            q('ls').innerHTML = ui.empty('Đang chọn ' + ids.length + ' dòng — đánh dấu một dòng để xem lịch sử duyệt');
        }
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tt]');
            if (!b) return;
            var nd = (q('nd').value || '').trim(), tt = b.getAttribute('data-tt');
            dlg.close();
            ui.batch(ids.map(function (id) {
                return { action: 'TS_QuanLyThongTinQuanLyThongTin/ThemMoi', strId: '', strSanPham_Id: id, strNoiDung: nd,
                    strTinhTrang_Id: tt, strNguoiQuanLyThongTin_Id: K.uid() };
            }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' });
        });
    }

    /* ---- Sửa ---- */
    var COT = {
        strNguoiHoc_MaSo: 'QLSV_NGUOIHOC_MASO', strNguoiHoc_HoDem: 'QLSV_NGUOIHOC_HODEM', strNguoiHoc_Ten: 'QLSV_NGUOIHOC_TEN',
        strNguoiHoc_NgaySinh: 'QLSV_NGUOIHOC_NGAYSINH', strNguoiHoc_ThangSinh: 'QLSV_NGUOIHOC_THANGSINH', strNguoiHoc_NamSinh: 'QLSV_NGUOIHOC_NAMSINH',
        strNguoiHoc_GioiTinh: 'QLSV_NGUOIHOC_GIOITINH', strNguoiHoc_DanToc: 'QLSV_NGUOIHOC_DANTOC', strNguoiHoc_NoiSinh: 'QLSV_NGUOIHOC_NOISINH',
        strNguoiHoc_NganhNghe: 'QLSV_NGUOIHOC_NGANHNGHE', strSoQuyetDinh: 'SOQUYETDINH', strNgayQuyetDinh: 'NGAYQUYETDINH',
        strNgayKyBang: 'NGAYKYBANG', strNgayVaoSoCapBang: 'NGAYVAOSOCAPBANG'
    };
    function moSua(r) {
        dangSua = r;
        Array.prototype.forEach.call(root.querySelectorAll('[data-v]'), function (i) {
            var c = COT[i.getAttribute('data-v')];
            i.value = c ? e(r[c]) : '';
            if (i._flatpickr) i._flatpickr.setDate(i.value || null, false, 'd/m/Y');
        });
        z('anh').innerHTML = r.DUONGDANANHCANHAN ? '<img alt="" src="' + esc(ums.files.url(r.DUONGDANANHCANHAN)) + '">' : '<i class="fa-light fa-user"></i>';
        ui.swap(z('ds'), z('form'), { top: true });
    }
    function dong() { dangSua = null; ui.swap(z('form'), z('ds'), { top: true }); }
    function luu(b) {
        if (!dangSua) return;
        var p = { action: 'TN_KetQua_CongNhan_VB/CapNhat', strId: dangSua.ID, strChucNang_Id: K.cn() };
        Array.prototype.forEach.call(root.querySelectorAll('[data-v]'), function (i) { p[i.getAttribute('data-v')] = (i.value || '').trim(); });
        p.strDuongDanCaNhan = e(dangSua.DUONGDANANHCANHAN);
        p.strNguoiThucHien_Id = K.uid();
        b.disabled = true;
        ums.api.call(p).then(function () {
            ui.toast('Cập nhật thành công!', 'ok');
            dong();
            tai();
        }).catch(function (err) { ums.api.handle(err, 'TN_KetQua_CongNhan_VB/CapNhat'); })
            .then(function () { b.disabled = false; });
    }

    root.addEventListener('click', function (ev) {
        var s = ev.target.closest('[data-sua]');
        if (s && root.contains(s)) { var r = ds[Number(s.getAttribute('data-sua'))]; if (r) moSua(r); return; }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'sohieu') sinhSo('SinhSoHieuVanBang');
        else if (a === 'sovaoso') sinhSo('SinhSoVaoSo');
        else if (a === 'xacnhan') xacNhan();
        else if (a === 'dong') dong();
        else if (a === 'luu') luu(b);
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-ckall')) return;
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });

    tai(1);         // gốc: init gọi getList_QuanLyThongTin
})();
