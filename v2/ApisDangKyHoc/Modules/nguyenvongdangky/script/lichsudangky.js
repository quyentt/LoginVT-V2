/* =========================================================================
   Lịch sử đăng ký học — tra theo mã số người học
   Bản gốc: ApisDangKyHoc/Modules/nguyenvongdangky/html/lichsudangky.html + script/lichsudangky.js
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc (Từ khoá · Tìm kiếm · Xuất báo cáo | Kế hoạch — chọn nhiều)
   + khung "Danh sách" có dòng "MÃ SỐ - Họ tên" của người học tìm được + bảng lịch sử.
   Lời gọi — chép nguyên văn (kiểu cũ, không mã hoá):
       DKH_XuLy/LayDSKeHoachTheoLichSuDangKy   GET  strTuKhoa, strNguoiThucHien_Id
           → Data = { rsKeHoach: [ID, TENKEHOACH], rsThongTinNguoiHoc: [ID, MASO, HODEM, TEN] }
       DKH_XuLy/LayLichSuDangKyHocCaNhan       GET  strTuKhoa "" (gốc đọc txtAAAA), strDangKy_KeHoachDangKy_Id
           (ô chọn nhiều → "a,b" như edu.util.getValById), strTuNgay "", strDenNgay "" (txtAAAA),
           strQLSV_NguoiHoc_Id, strNguoiThucHien_Id, pageIndex 1, pageSize 100000
       Cột: NGUOITHUCHIEN_TAIKHOAN, HANHDONG, KETQUA, THOIGIANTHUCHIEN, MAHOCPHAN, TENHOCPHAN,
            DSLOPHOCPHAN, DAOTAO_CHUONGTRINH_MA, DAOTAO_CHUONGTRINH_TEN
   Luồng như gốc: mở màn / Tìm kiếm / Enter → nạp kế hoạch theo từ khoá, xoá bảng + dòng tên;
   đúng MỘT người học khớp → hiện "MÃ - Họ tên" và nạp lịch sử (chưa chọn kế hoạch = tất cả).
   Chọn thêm một kế hoạch → nạp lại lịch sử.
   Khác bản gốc (lỗi rõ, ghi lại):
     · Nút báo cáo: gốc gắn getList_MauImport vào "zonebtnBaoCao_DeTai" — vùng KHÔNG có trên màn
       (html đặt "zonebtnBaoCao_LichSuDangKy") nên nút báo cáo chưa từng hiện. Bản mới gắn vào đúng chỗ
       (ums.report.mount, không vùng _Import → import: false), tham số collect giữ nguyên.
     · Bỏ chọn một kế hoạch (select2:unselect) cũng nạp lại — gốc chỉ nghe select2:select nên bỏ kế hoạch
       mà bảng vẫn giữ dữ liệu cũ.
   Ô cha → con: không có (Kế hoạch phụ thuộc Ô TỪ KHOÁ + nút Tìm kiếm, không phải ô chọn).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('nvdk-lichsu');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }

    var st = { nguoiHoc: '', token: 0 };

    root.innerHTML =
        pat.page('Lịch sử đăng ký nguyện vọng', '') +
        pat.filterBar([
            { key: 'q', label: 'Nhập mã số cần tìm kiếm' },
            { key: 'kh', type: 'select', label: 'Kế hoạch', multiple: true }
        ], { extra: '<div class="ums-field ums-field--fit" data-z="bc"></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', flush: true,
            tools: '<b class="ums-u-navy" data-z="ten"></b>', zone: 'bang' });

    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var elBang = root.querySelector('[data-z="bang"]');
    var elTen = root.querySelector('[data-z="ten"]');
    ui.enhance(root);
    nhac('Nhập mã số người học rồi bấm Tìm kiếm');

    function nhac(chu) { elBang.innerHTML = ui.empty(chu, 'fa-magnifying-glass'); }

    /* getList_KeHoachDangKy — nạp kế hoạch theo từ khoá; xoá bảng + tên như gốc */
    function napKeHoach() {
        var t = ++st.token;
        st.nguoiHoc = '';
        elTen.textContent = '';
        pat.fill(F('kh'), [], { head: 'Kế hoạch' });
        nhac('Nhập mã số người học rồi bấm Tìm kiếm');
        return ums.api.call({
            action: 'DKH_XuLy/LayDSKeHoachTheoLichSuDangKy', method: 'GET',
            strTuKhoa: F('q').value.trim(),
            strNguoiThucHien_Id: uid()
        }).then(function (r) {
            if (t !== st.token) return;
            var d = r.data || {};
            pat.fill(F('kh'), d.rsKeHoach || [], { name: 'TENKEHOACH' });
            var nh = d.rsThongTinNguoiHoc || [];
            if (nh.length === 1) {
                elTen.textContent = e(nh[0].MASO) + ' - ' + e(nh[0].HODEM) + ' ' + e(nh[0].TEN);
                st.nguoiHoc = nh[0].ID;
                napLichSu();
            } else if (nh.length > 1) {
                nhac('Có ' + nh.length + ' người học khớp từ khoá — nhập đúng mã số để xem lịch sử');
            }
        }).catch(function (err) { ums.api.handle(err, 'DKH_XuLy/LayDSKeHoachTheoLichSuDangKy'); });
    }

    /* getList_TongHop */
    function napLichSu() {
        var t = ++st.token;
        elBang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'DKH_XuLy/LayLichSuDangKyHocCaNhan', method: 'GET',
            strTuKhoa: '',
            strDangKy_KeHoachDangKy_Id: pat.val(F('kh')),
            strTuNgay: '',
            strDenNgay: '',
            strQLSV_NguoiHoc_Id: st.nguoiHoc,
            strNguoiThucHien_Id: uid(),
            pageIndex: 1,
            pageSize: 100000
        }).then(function (r) {
            if (t !== st.token) return;
            ui.table({
                el: elBang, rows: Array.isArray(r.data) ? r.data : [],
                empty: 'Không có lịch sử đăng ký',
                columns: [
                    { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TAIKHOAN' },
                    { title: 'Hành động', prop: 'HANHDONG' },
                    { title: 'Kết quả', prop: 'KETQUA' },
                    { title: 'Thời gian thực hiện', prop: 'THOIGIANTHUCHIEN', cls: 'is-nowrap' },
                    { title: 'Mã học phần', prop: 'MAHOCPHAN', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'TENHOCPHAN' },
                    { title: 'Lớp học phần', prop: 'DSLOPHOCPHAN' },
                    { title: 'Mã chương trình', prop: 'DAOTAO_CHUONGTRINH_MA', cls: 'is-nowrap' },
                    { title: 'Tên chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }
                ]
            });
        }).catch(function (err) {
            if (t !== st.token) return;
            elBang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'DKH_XuLy/LayLichSuDangKyHocCaNhan');
        });
    }

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) napKeHoach();
    });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target === F('q')) { ev.preventDefault(); napKeHoach(); }
    });
    if (window.jQuery) {
        // Như gốc: chưa tìm ra người học vẫn nạp (strQLSV_NguoiHoc_Id rỗng)
        jQuery(F('kh')).on('select2:select select2:unselect', function () { napLichSu(); });
    }

    /* getList_MauImport — collect giữ nguyên hai khoá của gốc */
    ums.report.mount(root.querySelector('[data-z="bc"]'), {
        import: false,
        collect: function (add) {
            add('strDangKy_KeHoachDangKy_Id', pat.val(F('kh')));
            add('strQLSV_NguoiHoc_Id', st.nguoiHoc);
        }
    });

    napKeHoach();
})();
