/* =========================================================================
   Kế hoạch thi lại — vùng "Danh sách đã đăng ký" (nút "Kết quả đăng ký")
   Bản gốc: kehoach.html #zoneSinhVien, #modal_XacNhan, #modalChiTietDiem
            + kehoach.js getList_SinhVien, delete_SinhVien, tinhPhiThiTuDong,
              getList_BtnXacNhanSanPham, getList_XacNhan, save_XacNhanSanPham,
              getList_QuanSoTheoLop
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     DKH_DangKyThi_MonThi_Chung/LayDSDK_Nganh_Thi_HP_KetQua_PT  GET, phân trang máy chủ
         strTuKhoa, dTinhTrangNopTien (-1 / 1 / 0), strDangKy_Thi_HP_KeHoach_Id,
         strQLSV_NguoiHoc_Id "", strDaoTao_ChuongTrinh_Id "" (gốc đọc dropAAAA), pageIndex, pageSize
     DKH_DangKyThi_MonThi_ThongTin/ThucHienHuyDangKy            Xoá — strId = ID dòng,
         strDangKy_Thi_HP_KeHoach_Id = DANGKY_THI_HOCPHAN_KEHOACH_ID của dòng,
         strDangKy_Thi_HocPhan_KQ_Id = ID dòng
     TC_TinhPhi_MH/… pkg_taichinh_tinhphi.TinhPhiThiTuDong       Tính phí — strQLSV_NguoiHoc_Id,
         strNguonDuLieu_Id = ID dòng
     DKH_DangKyThi_MonThi_Chung/LayDSTinhTrangTheoNguoiDung     GET  nút trạng thái của hộp Duyệt
         (ID, TEN, THONGTIN1 = biểu tượng, THONGTIN2 = kiểu CSS của biểu tượng)
     DKH_DangKyThi_MonThi_ThongTin/LayDSDangKy_Thi_XacNhan      GET  lịch sử — strsanpham_Id,
         strLoaiXacNhan_Id "XACNHAN_HOANTHANH_NHAP", strTuKhoa/strNguoiXacNhan_Id/strHanhDong_Id "",
         1/100000; cột TEN, NGUOIXACNHAN_TENDAYDU, NGAYTAO_DD_MM_YYYY
     DKH_DangKyThi_MonThi_ThongTin/Them_DangKy_Thi_XacNhan      mỗi dòng đã chọn — strSanPham_Id,
         strNguoiXacnhan_Id (id người dùng), strNoiDung, strTinhTrang_Id
     SV_ThongTin/LatKetQuaDiemCaNhanTheoLop                     GET  "Xem chi tiết" điểm —
         strQLSV_NguoiHoc_Id, strDaoTao_LopHocPhan_Id = DIEM_DANHSACHHOC_ID; rsTP nối rsTKHP

   Mã "sản phẩm" xác nhận = ID + QLSV_NGUOIHOC_ID + DAOTAO_HOCPHAN_ID +
   DAOTAO_THOIGIANDAOTAO_ID nối bằng phép + của JS (cột rỗng thành "null"/
   "undefined" y như gốc — đổi cách nối là lệch khoá với dữ liệu đã lưu).
   Lịch sử trong hộp Duyệt là của dòng ĐẦU TIÊN được chọn (như gốc).

   Như gốc: ô tìm vừa lọc tại chỗ các dòng đang hiện khi gõ, vừa gửi máy chủ khi
   Enter / Tìm kiếm; đổi ô tình trạng nộp là nạp lại.
   Khác gốc: xoá / tính phí / duyệt xong nạp lại MỘT lần (gốc đếm complete của
   từng lời gọi); Tính phí báo lỗi từng dòng (gốc chỉ ghi console).
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, esc = ui.esc, T = ums.tlKh;
    var e = T.e;
    var LOAI_XN = 'XACNHAN_HOANTHANH_NHAP';

    var ttP = null;
    function tinhTrang() {
        if (!ttP) {
            ttP = ums.api.call({ action: T.AC + 'LayDSTinhTrangTheoNguoiDung', method: 'GET', silent: true, strNguoiThucHien_Id: '' })
                .then(T.ds, function (err) { ttP = null; throw err; });
        }
        return ttP;
    }
    /* Ghép y hệt bản gốc (xem chú thích đầu tệp) */
    function sanPham(r) { return r.ID + r.QLSV_NGUOIHOC_ID + r.DAOTAO_HOCPHAN_ID + r.DAOTAO_THOIGIANDAOTAO_ID; }

    /* ---------- Hộp "Xác nhận" (#modal_XacNhan) ------------------------------ */
    function hopDuyet(rows, xong) {
        var dlg = ui.dialog({
            title: 'Xác nhận', icon: 'fa-circle-check', size: 'lg',
            body:
                '<div class="ums-legend">Nội dung Xác nhận</div>' +
                '<input class="ums-input" data-f="nd" autocomplete="off">' +
                '<div class="ums-legend ums-legend--cach">Chọn Xác nhận</div>' +
                '<div class="ums-row tlkh-xn" data-f="nut"></div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử Xác nhận</div>' +
                '<div data-f="ls"></div>'
        });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }

        T.dang(f('nut'));
        tinhTrang().then(function (ds) {
            f('nut').innerHTML = ds.length ? ds.map(function (x, i) {
                return ui.btn('confirm', { text: e(x.TEN), mod: 'out-primary', icon: ums.iconFA4(x.THONGTIN1 || 'fa-solid fa-circle-check'),
                    attr: { 'data-xn': i } });
            }).join('') : ui.empty('Chưa có trạng thái xác nhận');
            // THONGTIN2 là kiểu CSS của biểu tượng lấy từ danh mục — gán bằng DOM, không ghép vào HTML
            ds.forEach(function (x, i) {
                var ic = f('nut').querySelector('[data-xn="' + i + '"] i');
                if (ic && x.THONGTIN2) ic.style.cssText = x.THONGTIN2;
            });
            f('nut').addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-xn]');
                if (!b) return;
                var st = ds[Number(b.getAttribute('data-xn'))];
                var nd = (f('nd').value || '').trim();
                dlg.close();
                ui.batch(rows.map(function (r) {
                    return { action: T.TT + 'Them_DangKy_Thi_XacNhan', strSanPham_Id: sanPham(r), strNguoiXacnhan_Id: T.uid(),
                        strNoiDung: nd, strTinhTrang_Id: st.ID };
                }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' }).then(xong);
            });
        }).catch(function (err) { T.loi(f('nut'), err, 'trạng thái xác nhận'); });

        T.dang(f('ls'));
        ums.api.call({
            action: T.TT + 'LayDSDangKy_Thi_XacNhan', method: 'GET',
            strTuKhoa: '', strsanpham_Id: sanPham(rows[0]), strLoaiXacNhan_Id: LOAI_XN,
            strNguoiXacNhan_Id: '', strHanhDong_Id: '', pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            ui.table({ el: f('ls'), rows: T.ds(r), empty: 'Chưa có lịch sử xác nhận', columns: [
                { title: 'Xác nhận', prop: 'TEN' },
                { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '110px' }
            ] });
        }).catch(function (err) { T.loi(f('ls'), err, 'lịch sử xác nhận'); });
    }

    /* ---------- Hộp "Danh sách sinh viên" (#modalChiTietDiem) ---------------- */
    function hopDiem(r) {
        var dlg = ui.dialog({ title: 'Danh sách sinh viên', icon: 'fa-user-graduate', size: 'xl', body: '<div data-f="tbl"></div>' });
        var tbl = dlg.body.querySelector('[data-f="tbl"]');
        T.dang(tbl);
        ums.api.call({ action: 'SV_ThongTin/LatKetQuaDiemCaNhanTheoLop', method: 'GET',
            strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_LopHocPhan_Id: r.DIEM_DANHSACHHOC_ID })
            .then(function (x) {
                var d = x.data || {};
                var rows = (d.rsTP || []).concat(d.rsTKHP || []);
                ui.table({ el: tbl, rows: rows, empty: 'Không có dữ liệu', columns: [
                    { title: 'Đầu điểm', prop: 'DIEM_THANHPHANDIEM_TEN', cls: 'is-center' },
                    { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
                    { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                    { title: 'Kết quả', prop: 'DIEM', cls: 'is-center' },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' },
                    { title: 'Điểm quy đổi', prop: 'DIEMQUYDOI_SO', cls: 'is-center' },
                    { title: 'Điểm quy đổi chữ', prop: 'DIEMQUYDOI_CHU', cls: 'is-center' },
                    { title: 'Ghi chú', prop: 'GHICHU' }
                ] });
            }).catch(function (err) { T.loi(tbl, err, 'chi tiết điểm'); });
    }

    /* =====================================================================
       T.vungKetQua(host, keHoach, ctx)
       ===================================================================== */
    T.vungKetQua = function (host, kh, ctx) {
        var page = 1, size = 10, total = 0, rows = [];
        host.innerHTML =
            pat.panel({
                title: 'Danh sách đã đăng ký — ' + e(kh.TENKEHOACH), icon: 'fa-user-pen', cls: 'ums-u-mb-4',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                body: '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" data-f="tt" data-required>' +
                        '<option value="-1">Toàn bộ</option><option value="1">Đã nộp</option><option value="0">Chưa nộp</option></select></div>' +
                    '<div class="ums-field tlkh-q"><input class="ums-input" data-f="q" autocomplete="off" ' +
                        'placeholder="Tìm theo SV (mã, họ tên, lớp) hoặc học phần (tên, mã)"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('confirm', { text: 'Duyệt', attr: { 'data-a': 'duyet' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Tính phí', mod: 'warn', icon: 'fa-calculator', attr: { 'data-a': 'phi' } }) + '</div>' +
                '</div>'
            }) +
            pat.panel({
                title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
                tools: ui.xoaChon('input[data-kq]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } })
            });
        function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
        var bang = host.querySelector('[data-z="bang"]');
        ui.enhance(host);
        T.ganChon(host);

        function nap(p) {
            if (p) page = p;
            T.dang(bang);
            ums.api.call({
                action: T.AC + 'LayDSDK_Nganh_Thi_HP_KetQua_PT', method: 'GET',
                strTuKhoa: (f('q').value || '').trim(),
                dTinhTrangNopTien: f('tt').value,
                strDangKy_Thi_HP_KeHoach_Id: kh.ID,
                strQLSV_NguoiHoc_Id: '',
                strDaoTao_ChuongTrinh_Id: '',
                strNguoiThucHien_Id: '',
                pageIndex: page,
                pageSize: size
            }).then(function (r) {
                rows = T.ds(r);
                total = Number(r.pager) || rows.length;
                host.querySelector('[data-z="n"]').textContent = '(' + total + ')';
                ve();
            }).catch(function (err) { rows = []; T.loi(bang, err, 'danh sách đã đăng ký'); });
        }
        function ve() {
            ui.table({
                el: bang, rows: rows, empty: 'Không có dữ liệu',
                page: { index: page, size: size, total: total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) nap(p); },
                    onSize: function (v) { size = v === 'all' ? Math.max(total, 1) : Number(v); nap(1); } },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(T.hoTen(r)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
                    { title: 'Giới tính', prop: 'GIOITINH_TEN' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-nowrap' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
                    { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN', cls: 'is-nowrap' },
                    { title: 'Trường', prop: 'DAOTAO_TRUONG_TEN', cls: 'is-nowrap' },
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN', cls: 'is-nowrap' },
                    { title: 'Đợt thi', prop: 'THI_DOTTHI_TEN', cls: 'is-nowrap' },
                    { title: 'Số tín chỉ', prop: 'HOCTRINH', cls: 'is-center' },
                    { title: 'Loại điểm', prop: 'DIEM_THANHPHANDIEM_MA', cls: 'is-center' },
                    { title: 'Điểm', cls: 'is-nowrap', render: function (r) {
                        return esc(e(r.DIEM)) + ' ' + ui.btn('view', { text: 'Xem chi tiết', icon: 'fa-eye', mod: 'quiet', cls: 'ums-btn--sm',
                            attr: { 'data-a': 'diem', 'data-id': r.ID } });
                    } },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN' },
                    { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' },
                    { title: 'Ngày đăng ký', prop: 'NGAYDK_DD_MM_YYYY_HHMMS', cls: 'is-nowrap' },
                    { title: 'Mức phí phải nộp', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN); } },
                    { title: 'Số tiền nộp', prop: 'SOTIENDANOP', cls: 'is-right is-nowrap' },
                    { title: 'Số tiền rút', prop: 'SOTIENRUT', cls: 'is-right is-nowrap' },
                    { title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN', cls: 'is-nowrap' },
                    T.cotChon('kq')
                ]
            });
            locTaiCho();
        }
        /* $("#txtSearch_SV").on('input') của gốc — lọc các dòng đang hiện */
        function locTaiCho() {
            var kw = (f('q').value || '').toLowerCase().trim();
            T.qa(bang, 'tbody tr').forEach(function (tr) {
                if (!tr.hasAttribute('data-id')) return;
                tr.hidden = !!kw && tr.textContent.toLowerCase().indexOf(kw) < 0;
            });
        }
        function chon() {
            return T.daChon(bang, 'kq').map(function (id) { return T.tim(rows, id); }).filter(Boolean);
        }

        f('q').addEventListener('input', locTaiCho);
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); nap(1); } });
        f('tt').addEventListener('change', function () { nap(1); });

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !host.contains(b)) return;
            var a = b.getAttribute('data-a'), sel;
            if (a === 'dong') return ctx.dong();
            if (a === 'tim') return nap(1);
            if (a === 'diem') { var r = T.tim(rows, b.getAttribute('data-id')); if (r) hopDiem(r); return; }
            sel = chon();
            if (a === 'duyet') {
                if (!sel.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                hopDuyet(sel, function () { nap(); });
            } else if (a === 'phi') {
                if (!sel.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                ui.batch(sel.map(function (r) {
                    return { action: 'TC_TinhPhi_MH/FSgvKREpKBUpKBU0BS4vJgPP', func: 'pkg_taichinh_tinhphi.TinhPhiThiTuDong',
                        strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strNguonDuLieu_Id: r.ID, strNguoiThucHien_Id: '' };
                }), { title: 'Đang tính phí', okText: 'Tính phí xong' }).then(function () { nap(); });
            } else if (a === 'xoa') {
                if (!sel.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                T.xoa(sel.map(function (r) {
                    return { action: T.TT + 'ThucHienHuyDangKy', strId: r.ID, strDangKy_Thi_HP_KeHoach_Id: r.DANGKY_THI_HOCPHAN_KEHOACH_ID,
                        strNguoiThucHien_Id: '', strDangKy_Thi_HocPhan_KQ_Id: r.ID };
                }), function () { nap(); });
            }
        });

        nap(1);
    };
})();
