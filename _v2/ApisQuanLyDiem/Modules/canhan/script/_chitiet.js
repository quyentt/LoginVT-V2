/* =========================================================================
   canhan/inbangdiem — các hộp / khung chi tiết của MỘT dòng (người học × chương trình) — ums.qldIbd.*
   Bản gốc: ApisQuanLyDiem/Modules/canhan/script/inbangdiem.js (mỗi cột "Xem" một modal, riêng
   "Điểm toàn bộ" là khung #zoneEdit THAY CHỖ danh sách).
   Dòng = một dòng của D_BaoCao/LayDanhSachHoSoNhieuNganh: QLSV_NGUOIHOC_ID, DAOTAO_TOCHUCCHUONGTRINH_ID
   (gửi làm "chương trình"), DAOTAO_LOPQUANLY_ID.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên; kiểu cũ không ghi type là GET):
       Điểm toàn bộ   D_BaoCao/LayDSDiemKetThucCaNhan (strQLSV_NguoiHoc_Id) → "Xem" D_BaoCao/LayDSDiemThanhPhanCaNhan
                      (strDaoTao_HocPhan_Id = DAOTAO_HOCPHAN_ID, dLanHoc = LANHOC)
       Điểm TB        SV_ThongTin/KetQuaHocTapCaNhan → vẽ bằng ums.diemHoc.veBangDiem (có cột Ghi chú, không cột Chi tiết)
       Tích luỹ khối  SV_ThongTin/LayKetQuaTichLuyTheoKhoi (rsTongHop, rsChiTiet) · SV_ThongTin/LayDSHocPhanChuHoanThanh
                      · SV_ThongTin/LayDSKetQuaChungChi (PHANLOAI_TEN, XEPLOAI_TEN) — bốn bảng một hộp như gốc
       Kết quả ĐK     SV_ThongTin/LayDSThoiGianLichHoc (chọn sẵn mục đầu) → SV_ThongTin/LayKetQuaDangKyHocCaNhan
                      (rsKetQuaDangKy + rsLichSuDangKy) — cột Khóa mở lớp HP / Giảng viên như bản QLĐ (khác bản Cổng cán bộ)
       Cả lớp         ums.ibd.caLop(dòng, { buoiHoc: false }) của Cổng cán bộ (nhapdiem/script/_ibd_lop.js) — cùng lời gọi
                      NS_ThongTinCanBo/* + DKH_Chung/KiemTraNguoiHocDangKyHocPhan; bản QLĐ bấm ô không làm gì.
       Điểm kết thúc  SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LatKetQuaDiemKetThucHocPhan (POST)
                      Lưu: D_TongHop_XuLy_MH · pkg_diem_tonghop_xuly.XuLyKhongTinhDiem (strId, dKhongTinhDiem) — chỉ ô đã đổi
   Không chép (lỗi rõ của bản gốc):
     · Điểm kết thúc: cột "Tên học phần" in HỌ TÊN người học (mRender đè mDataProp) → in DAOTAO_HOCPHAN_TEN.
     · Điểm kết thúc: lưu xong gọi lại getList_DiemKetThuc() KHÔNG truyền dòng → TypeError, bảng không nạp lại → nạp lại đúng người học.
     · Điểm kết thúc: dòng có KHONGTINHDIEM rỗng thì ô chọn trống và LUÔN bị coi là "đã đổi" (lưu dKhongTinhDiem rỗng) →
       hiện "Tính điểm" (0) và chỉ gửi khi người dùng thật sự đổi.
     · Điểm TB: "Điểm trung bình hệ 10" từng học kỳ lấy nhầm dòng tổng số tín (veBangDiem đã sửa như bản Cổng cán bộ).
     · Điểm TB rỗng thì lỗi JS (đọc rsDiemThanhPhan của mảng rỗng).
     · Tích luỹ khối: console.log gỡ lỗi [ChungChi] bỏ.
   Chờ nghiệp vụ (ghi _cq): tổng tín chỉ Kết quả ĐK cộng MỘT lần mỗi mã học phần (như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var Q = ums.qldIbd = ums.qldIbd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET' }, o)); }
    function dangTai() { return ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
    function loi(el) { return function (err) { el.innerHTML = ui.fail(err.message); }; }
    Q.nhan = function (r) { return e(r.QLSV_NGUOIHOC_MASO) + ' - ' + e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN) + ' - ' + e(r.DAOTAO_LOPQUANLY_TEN); };
    function hop(title, icon, r, than, buttons) {
        var dlg = ui.dialog({ title: title + ' — ' + Q.nhan(r), icon: icon, size: 'xl', body: than || '<div data-x="bang">' + dangTai() + '</div>', buttons: buttons });
        dlg.q = function (k) { return dlg.body.querySelector('[data-x="' + k + '"]'); };
        return dlg;
    }

    /* ---------- Điểm toàn bộ: khung THAY CHỖ danh sách (#zoneEdit gốc) ---------- */
    Q.toanBo = function (host, r, dong) {
        host.innerHTML = pat.panel({ title: 'Xem toàn bộ - ' + e(r.QLSV_NGUOIHOC_MASO) + ' - ' + e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN), icon: 'fa-file-lines',
            tools: ui.btn('close', { attr: { 'data-tb': 'dong' } }), flush: true, body: '<div data-tb="bang">' + dangTai() + '</div>' });
        var h = host.querySelector('[data-tb="bang"]'), ds = [];
        get('D_BaoCao/LayDSDiemKetThucCaNhan', { strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strNguoiThucHien_Id: uid() }).then(function (x) {
            ds = arr(x.data);
            ui.table({ el: h, rows: ds, empty: 'Chưa có điểm', columns: [
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_SOTC', cls: 'is-center' }, { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
                { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' }, { title: 'Điểm hệ 4', prop: 'DIEMQUYDOI', cls: 'is-center' },
                { title: 'Điểm chữ', prop: 'DIEMQUYDOI_TEN', cls: 'is-center' }, { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' },
                { title: 'Xem', cls: 'is-center', width: '90px', render: function (y, i) {
                    return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-tp': i, title: 'Chi tiết thành phần' } }); } }] });
        }).catch(loi(h));
        host.onclick = function (ev) {
            if (ev.target.closest('[data-tb="dong"]')) { dong(); return; }
            var b = ev.target.closest('[data-tp]'); if (!b) return;
            var y = ds[Number(b.getAttribute('data-tp'))]; if (!y) return;
            var d2 = ui.dialog({ title: 'Chi tiết thành phần — ' + e(y.DAOTAO_HOCPHAN_MA) + ' ' + e(y.DAOTAO_HOCPHAN_TEN), icon: 'fa-list-check', size: 'md', body: '<div data-x="tp">' + dangTai() + '</div>' });
            var h2 = d2.body.querySelector('[data-x="tp"]');
            get('D_BaoCao/LayDSDiemThanhPhanCaNhan', { strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_HocPhan_Id: y.DAOTAO_HOCPHAN_ID, dLanHoc: y.LANHOC, strNguoiThucHien_Id: uid() })
                .then(function (x) {
                    ui.table({ el: h2, rows: arr(x.data), empty: 'Chưa có điểm thành phần', columns: [{ title: 'Thành phần', prop: 'TEN' }, { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
                        { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }] });
                }).catch(loi(h2));
        };
    };

    /* ---------- Điểm trung bình (Chi tiết điểm) ------------------------------- */
    Q.diemTB = function (r) {
        var h = hop('Chi tiết điểm', 'fa-chart-simple', r).q('bang');
        get('SV_ThongTin/KetQuaHocTapCaNhan', { strChucNang_Id: cn(), strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: uid() })
            .then(function (x) { var d = x.data || {}; ums.diemHoc.veBangDiem(h, arr(d.rsDiemKetThucHocPhan), arr(d.rsDiemTrungBinhChung), { chiTiet: false }); }).catch(loi(h));
    };

    /* ---------- Chi tiết điểm theo khối (bốn bảng) ---------------------------- */
    function so(v) { var n = parseInt(e(v), 10); return isNaN(n) ? 0 : n; }
    Q.tichLuy = function (r) {
        var dlg = hop('Chi tiết điểm theo khối', 'fa-layer-group', r,
            '<div class="ums-legend"><i class="fa-light fa-building"></i> Tổng hợp theo khối</div><div data-x="th">' + dangTai() + '</div>' +
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-building"></i> Tổng hợp chi tiết theo khối và học phần</div><div data-x="ct">' + dangTai() + '</div>' +
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-building"></i> Danh sách các học phần chưa hoàn thành</div><div data-x="no">' + dangTai() + '</div>' +
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-building"></i> Kết quả chứng chỉ</div><div data-x="cc">' + dangTai() + '</div>');
        var ts = { strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID };
        get('SV_ThongTin/LayKetQuaTichLuyTheoKhoi', ts).then(function (x) {
            var d = x.data || {}, th = arr(d.rsTongHop), rs = arr(d.rsChiTiet);
            th.forEach(function (y) { y._CHUAHT = so(y.SOBATBUOC) - so(y.SODATICHLUY); });
            ui.table({ el: dlg.q('th'), rows: th, empty: 'Chưa có dữ liệu', columns: [
                { title: 'Mã khối', prop: 'MAKHOI' }, { title: 'Tên khối', prop: 'TENKHOI' },
                { title: 'Tổng số tín của khối', prop: 'TONGSOTINCHICUAKHOI', cls: 'is-center', sum: true },
                { title: 'Tổng số tín bắt buộc', prop: 'SOBATBUOC', cls: 'is-center', sum: true },
                { title: 'Tổng số tín đã tích lũy', prop: 'SODATICHLUY', cls: 'is-center', sum: true },
                { title: 'Số tín chỉ chưa hoàn thành', prop: '_CHUAHT', cls: 'is-center', sum: true },
                { title: 'Số tín chỉ còn nợ', prop: 'SOTINCHINO', cls: 'is-center', sum: true }] });
            /* Gộp ô Mã khối / Tên khối liền nhau (actionRowSpan của gốc): ô lặp để trống */
            function lap(x, i) { return i && rs[i - 1].MAKHOI === x.MAKHOI; }
            ui.table({ el: dlg.q('ct'), rows: rs, empty: 'Chưa có dữ liệu', columns: [
                { title: 'Mã khối', render: function (x, i) { return lap(x, i) ? '' : '<b>' + esc(e(x.MAKHOI)) + '</b>'; } },
                { title: 'Tên khối', render: function (x, i) { return lap(x, i) ? '' : esc(e(x.TENKHOI)); } },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' }, { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
                { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' }, { title: 'Điểm quy đổi', prop: 'DIEMQUYDOI', cls: 'is-center' },
                { title: 'Điểm chữ', prop: 'DIEMQUYDOI_TEN', cls: 'is-center' },
                { title: 'Kết quả', cls: 'is-center', render: function (x) { return Number(x.KETQUA) === 1 ? 'Hoàn thành' : ''; } },
                { title: 'Ghi chú xử lý', render: function (x) { return Number(x.HOCPHANTHUA) === 1 ? esc('Thừa ' + e(x.HOCPHANTHUA_LOAIXULY)) : ''; } },
                { title: 'Ghi chú', prop: 'GHICHU' }] });
        }).catch(function (err) { dlg.q('th').innerHTML = ui.fail(err.message); dlg.q('ct').innerHTML = ''; });
        get('SV_ThongTin/LayDSHocPhanChuHoanThanh', Object.assign({ strNguoiThucHien_Id: uid() }, ts)).then(function (x) {
            ui.table({ el: dlg.q('no'), rows: arr(x.data), empty: 'Không có học phần chưa hoàn thành', columns: [
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' }, { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' },
                { title: 'Điểm', prop: 'DIEM', cls: 'is-center' }, { title: 'Điểm quy đổi', prop: 'DIEMQUYDOI', cls: 'is-center' },
                { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' }] });
        }).catch(loi(dlg.q('no')));
        get('SV_ThongTin/LayDSKetQuaChungChi', Object.assign({ strNguoiThucHien_Id: uid() }, ts)).then(function (x) {
            ui.table({ el: dlg.q('cc'), rows: arr(x.data), empty: 'Chưa có kết quả chứng chỉ', columns: [
                { title: 'Loại', prop: 'PHANLOAI_TEN' }, { title: 'Kết quả', prop: 'XEPLOAI_TEN' }] });
        }).catch(loi(dlg.q('cc')));
    };

    /* ---------- Kết quả đăng ký học ------------------------------------------ */
    Q.ketQuaDK = function (r) {
        var dlg = hop('Kết quả đăng ký học', 'fa-clipboard-list', r,
            '<div class="ums-filter"><div class="ums-field"><select class="ums-select" data-x="tg" data-ph="Chọn thời gian"><option value=""></option></select></div></div>' +
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-building"></i> Kết quả đăng ký học</div><div data-x="kq"></div>' +
            '<div class="ums-legend ums-legend--cach">Lịch sử đăng ký học</div><div data-x="ls"></div>');
        ui.enhance(dlg.body);
        function tai() {
            var kq = dlg.q('kq'), ls = dlg.q('ls');
            kq.innerHTML = dangTai();
            get('SV_ThongTin/LayKetQuaDangKyHocCaNhan', { strNguoiThucHien_Id: uid(), strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ThoiGianDaoTao_Id: dlg.q('tg').value }).then(function (x) {
                var d = x.data || {};
                ui.table({ el: kq, rows: arr(d.rsKetQuaDangKy), empty: 'Chưa có dữ liệu', columns: [
                    { title: 'Mã lớp học phần', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                    { title: 'Khóa mở lớp học phần', prop: 'DAOTAO_KHOAMOLOPHP_TEN' },
                    /* Tổng tín: mỗi MÃ học phần cộng một lần (như gốc) */
                    { title: 'Số tín', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center', sum: function (rows) {
                        var da = {}, t = 0;
                        rows.forEach(function (y) { if (!da[y.DAOTAO_HOCPHAN_MA]) { da[y.DAOTAO_HOCPHAN_MA] = 1; t += Number(y.DAOTAO_HOCPHAN_HOCTRINH) || 0; } });
                        return '<b>' + t + '</b>';
                    } },
                    { title: 'Giảng viên', prop: 'THONGTINGIANGVIEN' }, { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                    { title: 'Thời gian thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' }, { title: 'Người thực hiện', prop: 'NGUOITAO_TAIKHOAN' },
                    { title: 'Học kỳ, đợt', prop: 'THOIGIAN' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }] });
                ui.table({ el: ls, rows: arr(d.rsLichSuDangKy), empty: 'Chưa có dữ liệu', columns: [
                    { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TAIKHOAN' }, { title: 'Hành động', prop: 'HANHDONG' }, { title: 'Kết quả', prop: 'KETQUA' },
                    { title: 'Thời gian thực hiện', prop: 'THOIGIANTHUCHIEN', cls: 'is-nowrap' }, { title: 'Mã học phần', prop: 'MAHOCPHAN' }, { title: 'Tên học phần', prop: 'TENHOCPHAN' },
                    { title: 'Lớp học phần', prop: 'DSLOPHOCPHAN' }, { title: 'Mã chương trình', prop: 'DAOTAO_CHUONGTRINH_MA' }, { title: 'Tên chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }] });
            }).catch(loi(kq));
        }
        get('SV_ThongTin/LayDSThoiGianLichHoc', { strNguoiThucHien_Id: uid(), strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID }).then(function (x) {
            var ds = arr(x.data);
            pat.fill(dlg.q('tg'), ds, { name: 'THOIGIAN', head: 'Chọn thời gian' });
            /* selectFirst: true của gốc — chọn sẵn mục đầu */
            if (ds.length) { dlg.q('tg').value = ds[0].ID; if (window.jQuery) jQuery(dlg.q('tg')).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'thời gian đăng ký'); }).then(tai);
        if (window.jQuery) jQuery(dlg.q('tg')).on('select2:select select2:clear', tai);
    };

    /* ---------- Điểm kết thúc (Kết quả) + "Không tính điểm" ------------------- */
    Q.diemKetThuc = function (r) {
        var ds = [];
        var dlg = hop('Kết quả', 'fa-list-check', r, null, [{ text: 'Lưu', kind: 'save', icon: 'fa-paper-plane', keepOpen: true, onClick: function () { luu(); return false; } }]);
        function goc(y) { var v = e(y.KHONGTINHDIEM); return v === '' ? '0' : String(v); }
        function tai() {
            var h = dlg.q('bang');
            h.innerHTML = dangTai();
            ums.api.call({ action: 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLAokNRUpNCIJLiIRKSAv', func: 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemKetThucHocPhan',
                strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strNguoiThucHien_Id: uid() }).then(function (x) {
                ds = arr(x.data);
                ui.table({ el: h, rows: ds, empty: 'Chưa có điểm kết thúc', columns: [
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Điểm', prop: 'DIEM', cls: 'is-center' }, { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' }, { title: 'Điểm hệ 4', prop: 'DIEMQUYDOI', cls: 'is-center' },
                    { title: 'Điểm chữ', prop: 'DIEMQUYDOI_TEN', cls: 'is-center' }, { title: 'Lớp học phần/danh sách học', prop: 'DIEM_DANHSACHHOC_TEN' },
                    { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' },
                    { title: 'Không tính điểm', width: '160px', render: function (y, i) {
                        var v = goc(y);
                        return '<select class="ums-select" data-ktd="' + i + '"><option value="0"' + (v === '0' ? ' selected' : '') + '>Tính điểm</option>' +
                            '<option value="1"' + (v === '1' ? ' selected' : '') + '>Không tính điểm</option></select>';
                    } }] });
            }).catch(loi(h));
        }
        function luu() {
            var doi = Array.prototype.filter.call(dlg.body.querySelectorAll('select[data-ktd]'), function (s) { var y = ds[Number(s.getAttribute('data-ktd'))]; return y && s.value !== goc(y); });
            if (!doi.length) { ui.toast('Chưa đổi dòng nào.', 'info'); return; }
            ui.batch(doi.map(function (s) {
                var y = ds[Number(s.getAttribute('data-ktd'))];
                return { action: 'D_TongHop_XuLy_MH/GTQNOAopLi8mFSgvKQUoJCwP', func: 'pkg_diem_tonghop_xuly.XuLyKhongTinhDiem', strId: y.ID, strNguoiThucHien_Id: uid(), dKhongTinhDiem: s.value };
            }), { title: 'Đang lưu', okText: 'Thành công' }).then(tai);
        }
        tai();
    };

    /* ---------- Kết quả đăng ký cả lớp: dùng khung Cổng cán bộ ---------------- */
    Q.caLop = function (r) { ums.ibd.caLop(r, { buoiHoc: false }); };
})();
