/* =========================================================================
   Quản lý điểm — tổng hợp điểm nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/quanlydiem/script/quanlydiem.js + html/quanlydiem.html
   Bố cục như gốc (MỘT cột): tiêu đề "Tổng hợp điểm nghiên cứu khoa học" + ghi chú, ô Nhóm sản phẩm + nút
   Tìm kiếm, nút "Tính điểm" (bên phải), bảng điểm có phân trang máy chủ.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NCKH_PhanBo/LayDanhSach   GET  strKLGD_HoatDong_Id '', strKLGD_ThoiGian_Id '', strKLGD_Donvitinh_Id '',
                                      strPhanLoaiSanPham_Id = ô Nhóm sản phẩm, strSanPham_Id '', strThanhVien_Id '',
                                      strCanBoNhap_Id '', strViTriTacGia_Id '', strKLGD_TongHopHoatDong_Id '', iTrangThai 1,
                                      strTuKhoa '', pageIndex, pageSize, strPhanLoaiTapChi_QT_Id '', strVaiTro_QT_Id '',
                                      strThuocLinhVucNao_QT_Id '', strThuocLinhVucNao_QG_Id '', strPhanLoaiTapChi_QG_Id '',
                                      strVaiTro_QG_Id '', strThuocLinhVucNao_S_Id '', strPhanloaisach_S_Id '', strVaiTro_S_Id '',
                                      strPhamViHoiNghiHoiThao_Id '', strThuocLinhVucNao_HNHT_Id '', strVaiTro_HNHT_Id '',
                                      strTinhTrangDeCuong_Id '', strCapQuanLy_Id '', strLinhVucNghienCuu_Id '',
                                      iTinhtrangDeTai '-1', iTinhTrangXacNhan -1
       NCKH_TinhDiem/TongHop     POST strThoiGian_Id '', strDonViBoPhan_GiangVien_Id '', strCanBoNhap_Id '', iCoTinhLaiHayKhong 1
   Ô Nhóm sản phẩm: 9 mục viết cứng trong html gốc (giá trị = tên bảng NCKH_SP_*), chép nguyên.
   Cột: THONGTINSANPHAM, PHANLOAISANPHAM_ID, VITRITACGIA_TEN, SOTACGIA_N, SODONGCHUBIEN_N, SONGUOIHUONGDAN_N,
        TYLEDONGGOPDECUONG_N, TYLETHAMGIA, SOTRANGTHAMGIAVIET_N, SOHOIDONGDAODUC_N, HESOIF_N, DIEM, TINHTRANGXACNHAN.
   Khác gốc / tự chốt:
     · Ghi chú gốc nhắc "Chọn loại cán bộ" và nút "Xuất excel" KHÔNG có trên màn → chỉ giữ dòng về nút Tìm kiếm / Tính điểm.
     · Cột "Phân loại sản phẩm" gốc in PHANLOAISANPHAM_ID (mã) → đổi sang tên nhóm theo 9 mục của ô chọn (mã lạ vẫn hiện nguyên).
     · "Tính điểm" = tính LẠI toàn bộ (iCoTinhLaiHayKhong 1) → hỏi lại trước khi chạy (gốc chạy ngay).
     · Nút #btnPrint (report_InHoSo) không có trên màn, hàm không tồn tại → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('nckh-quanlydiem');
    if (!root) return;
    function arr(d) { return Array.isArray(d) ? d : []; }
    var NHOM = [
        { ID: 'NCKH_SP_TapChiQuocTe', TEN: 'Tạp chí quốc tế' },
        { ID: 'NCKH_SP_TapChiQuocGia', TEN: 'Tạp chí quốc gia' },
        { ID: 'NCKH_SP_HoiNghiHoiThao', TEN: 'Hội nghị hội thảo' },
        { ID: 'NCKH_SP_Sach', TEN: 'Sách - tài liệu đã xuất bản' },
        { ID: 'NCKH_SP_DeCuongSP', TEN: 'Các hồ sơ thầu đã nộp' },
        { ID: 'NCKH_QUANLYDETAI', TEN: 'Đề tài, dự án' },
        { ID: 'NCKH_SP_HuongDanSinhVien', TEN: 'Hướng dẫn sinh viên' },
        { ID: 'NCKH_SP_GIAITHUONG', TEN: 'Giải thưởng' },
        { ID: 'NCKH_SP_HoiDongDaoDuc', TEN: 'Hội đồng đạo đức' }
    ];
    var tenNhom = {};
    NHOM.forEach(function (x) { tenNhom[x.ID.toUpperCase()] = x.TEN; });
    var st = { page: 1, size: 10, total: 0, rows: [] };

    root.innerHTML = pat.page('Tổng hợp điểm nghiên cứu khoa học',
            ui.btn('confirm', { text: 'Tính điểm', icon: 'fa-calculator', mod: 'primary', attr: { 'data-a': 'tinh' } })) +
        '<p class="ums-u-fz13 ums-u-muted ums-u-mb-4">Chọn nhóm sản phẩm rồi bấm "Tìm kiếm" để xem kết quả; bấm "Tính điểm" để tổng hợp lại điểm.</p>' +
        pat.filterBar([{ key: 'nhom', type: 'select', label: '--Chọn nhóm sản phẩm--' }]) +
        pat.panel({ title: 'Danh sách điểm', icon: 'fa-star', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    pat.fill(f('nhom'), NHOM);

    function c(title, prop) { return { title: title, prop: prop, cls: 'is-center' }; }
    var COT = [
        { title: 'Tên sản phẩm', render: function (r) { return '<div class="qld-sp">' + ui.escBr(r.THONGTINSANPHAM) + '</div>'; } },
        { title: 'Phân loại sản phẩm', render: function (r) { var v = r.PHANLOAISANPHAM_ID == null ? '' : String(r.PHANLOAISANPHAM_ID); return ui.esc(tenNhom[v.toUpperCase()] || v); } },
        { title: 'Vai trò', prop: 'VITRITACGIA_TEN', cls: 'is-nowrap' },
        c('Số tác giả', 'SOTACGIA_N'), c('Số chủ biên', 'SODONGCHUBIEN_N'), c('Số hướng dẫn', 'SONGUOIHUONGDAN_N'),
        c('Đề cương(%)', 'TYLEDONGGOPDECUONG_N'), c('Đề tài (%)', 'TYLETHAMGIA'), c('Số trang viết', 'SOTRANGTHAMGIAVIET_N'),
        c('Số HDDD', 'SOHOIDONGDAODUC_N'), c('Hệ số IF', 'HESOIF_N'), c('Điểm', 'DIEM'),
        { title: 'Tình trạng', prop: 'TINHTRANGXACNHAN', cls: 'is-center' }
    ];
    function ve() {
        z('n').textContent = '(' + st.total + ')';
        ui.table({ el: z('bang'), rows: st.rows, columns: COT, empty: 'Không có dữ liệu',
            page: { index: st.page, size: st.size, total: st.total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) tai(p); },
                onSize: function (v) { st.size = v; tai(1); } } });
    }
    function tai(page) {
        st.page = page || 1;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'NCKH_PhanBo/LayDanhSach', method: 'GET',
            strKLGD_HoatDong_Id: '', strKLGD_ThoiGian_Id: '', strKLGD_Donvitinh_Id: '', strPhanLoaiSanPham_Id: f('nhom').value,
            strSanPham_Id: '', strThanhVien_Id: '', strCanBoNhap_Id: '', strViTriTacGia_Id: '', strKLGD_TongHopHoatDong_Id: '',
            iTrangThai: 1, strTuKhoa: '', pageIndex: st.page, pageSize: st.size,
            strPhanLoaiTapChi_QT_Id: '', strVaiTro_QT_Id: '', strThuocLinhVucNao_QT_Id: '',
            strThuocLinhVucNao_QG_Id: '', strPhanLoaiTapChi_QG_Id: '', strVaiTro_QG_Id: '',
            strThuocLinhVucNao_S_Id: '', strPhanloaisach_S_Id: '', strVaiTro_S_Id: '',
            strPhamViHoiNghiHoiThao_Id: '', strThuocLinhVucNao_HNHT_Id: '', strVaiTro_HNHT_Id: '',
            strTinhTrangDeCuong_Id: '', strCapQuanLy_Id: '', strLinhVucNghienCuu_Id: '', iTinhtrangDeTai: '-1', iTinhTrangXacNhan: -1 })
            .then(function (r) { st.rows = arr(r.data); st.total = Number(r.pager) || st.rows.length; ve(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'điểm nghiên cứu khoa học'); });
    }
    function tinh() {
        ui.confirm('Tính lại điểm nghiên cứu khoa học cho toàn bộ sản phẩm?', { ok: 'Tính điểm', title: 'Tính điểm' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'NCKH_TinhDiem/TongHop', method: 'POST', strThoiGian_Id: '', strDonViBoPhan_GiangVien_Id: '', strCanBoNhap_Id: '', iCoTinhLaiHayKhong: 1 })
                .then(function () { ui.toast('Tính điểm thành công!', 'ok'); tai(1); })
                .catch(function (err) { ums.api.handle(err, 'tính điểm'); });
        });
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'search') tai(1);
        else if (b.getAttribute('data-a') === 'tinh') tinh();
    });
    tai(1);
})();
