/* =========================================================================
   Nhập chuyên cần
   Bản gốc: ApisChuyenCan/Modules/nhapchuyencan/html/nhapchuyencan.html + script/nhapchuyencan.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp · Năm nhập học ·
   Khoa QL · Kiểu chuyên cần / Từ ngày · Đến ngày · từ khoá · Tìm kiếm / Ngày khởi tạo ·
   "Khởi tạo ngày chuyên cần" / trạng thái sinh viên) → khung "Danh sách" (ẩn tới khi
   Tìm kiếm, nút × để đóng) có nút Lưu và bảng SINH VIÊN × NGÀY.
   Khung dùng chung: ums.cc.boLoc / ums.cc.luoi (script/_chung.js).

   Lời gọi (XLHV_CC_ThongTin_MH · PKG_CHUYENCAN_THONGTIN, chép nguyên):
       LayDSQLSV_NguoiHoc_ChuyenCan   danh sách → Data { rs, rsNgay } (pageIndex 1, pageSize 1000000)
       LayKetQuaChuyenCanTheoNgay     MỘT lời gọi cho mỗi ô (SV × ngày), GIATRI = 1 → đánh dấu, SOLUONG → ô số
       Them_QLSV_NguoiHoc_ChuyenCan   lưu ô (strId '' — gốc luôn Thêm, kể cả khi chỉ đổi số buổi)
       Xoa_QLSV_NguoiHoc_ChuyenCan1   bỏ đánh dấu ô đã có
       KhoiTao_Ngay_ChuyenCan         nút "Khởi tạo ngày chuyên cần" (dGio/dPhut/dGiay = 0)
   Giữ như bản gốc:
     · strDiem_DanhSach(Hoc)_Id gửi '' (gốc đọc me.strDanhSachHoc_Id không có ở màn này / ô dropAAAA).
     · dGio / dPhut / dGiay khi lưu, xoá gửi '' (ô txtAAAA không tồn tại).
     · Không có nút báo cáo: gốc gọi getList_MauImport("zonebtnBaoCao_TTQS") nhưng html
       KHÔNG có vùng đó (và callback gọi genHeader_NhapChuyenCan không tồn tại).
   Khác gốc (lỗi rõ):
     · Kiểu chuyên cần của lời gọi ô / lưu / xoá lấy theo lúc bấm Tìm kiếm (gốc đọc ô đang
       chọn lúc gọi → đổi ô Kiểu mà không Tìm lại thì lưu nhầm sang kiểu mới).
     · Lỗi khi lưu gốc gọi nhầm tiến độ "đang nạp" (divprogessquanso) → treo tiến độ lưu.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cc = ums.cc;
    var root = document.getElementById('cc-nhapchuyencan');
    if (!root) return;

    var XL = 'XLHV_CC_ThongTin_MH/', PK = 'PKG_CHUYENCAN_THONGTIN.';

    root.innerHTML = pat.page('Nhập chuyên cần', '') +
        '<div data-z="loc"></div>' +
        '<div data-z="kq" hidden>' +
            pat.panel({ title: 'Danh sách', icon: 'fa-clipboard-user', count: 'n', flush: true, zone: 'bang',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { text: 'Lưu', attr: { 'data-a': 'luu' } }) }) +
        '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = cc.boLoc(z('loc'), { khoiTao: true });
    var dang = {};   // bộ lọc của lượt đang hiện

    var luoi = cc.luoi(z('bang'), {
        lead: cc.cotSV(),
        buoi: true,
        chuHoi: 'thêm',
        o: function (sv, d) {
            return { action: XL + 'DSA4CiQ1EDQgAik0OCQvAiAvFSkkLg8mIDgP', func: PK + 'LayKetQuaChuyenCanTheoNgay',
                strChucNang_Id: cc.cn(), strNgay_Gio_Phut_Giay_Id: d.ID, strKieuChuyenCan_Id: dang.strKieuChuyenCan_Id,
                strQLSV_NguoiHoc_Id: sv.ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strDiem_DanhSachHoc_Id: '', strNguoiThucHien_Id: cc.uid() };
        },
        them: function (sv, d, soLuong) {
            return { action: XL + 'FSkkLB4QDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP', func: PK + 'Them_QLSV_NguoiHoc_ChuyenCan',
                strId: '', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
                strQLSV_NguoiHoc_Id: sv.ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strQLSV_TrangThaiNguoiHoc_Id: sv.QLSV_NGUOIHOC_TRANGTHAI_ID, strDiem_DanhSach_Id: '',
                strKieuChuyenCan_Id: dang.strKieuChuyenCan_Id, strNgayGhiNhan: d.NGAYGHINHAN, dSoLuong: soLuong,
                dGio: '', dPhut: '', dGiay: '' };
        },
        xoa: function (sv, d) {
            return { action: XL + 'GS4gHhANEhceDyY0LigJLiIeAik0OCQvAiAvcAPP', func: PK + 'Xoa_QLSV_NguoiHoc_ChuyenCan1',
                strId: '', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
                strQLSV_NguoiHoc_Id: sv.ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strQLSV_TrangThaiNguoiHoc_Id: sv.QLSV_NGUOIHOC_TRANGTHAI_ID, strDiem_DanhSach_Id: '',
                strKieuChuyenCan_Id: dang.strKieuChuyenCan_Id, strNgay_Gio_Phut_Giay_Id: d.ID, strNgayGhiNhan: d.NGAYGHINHAN,
                dGio: '', dPhut: '', dGiay: '' };
        },
        sauLuu: function () { tim(); }
    });

    function tim() {
        dang = loc.thamSo();
        z('kq').hidden = false;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(Object.assign({ action: XL + 'DSA4BRIQDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP', func: PK + 'LayDSQLSV_NguoiHoc_ChuyenCan',
            strChucNang_Id: cc.cn(), strDiem_DanhSachHoc_Id: '', strNguoiThucHien_Id: cc.uid(), pageIndex: 1, pageSize: 1000000 }, dang))
            .then(function (r) {
                var d = r.data || {};
                z('n').textContent = '(' + cc.arr(d.rs).length + ')';
                luoi.ve(d);
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách chuyên cần'); });
    }

    function khoiTao() {
        var p = loc.thamSo();
        ums.api.call({ action: XL + 'CikuKBUgLh4PJiA4HgIpNDgkLwIgLwPP', func: PK + 'KhoiTao_Ngay_ChuyenCan',
            strId: '', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
            strKhoaQuanLy_Id: p.strKhoaQuanLy_Id, strHeDaoTao_Id: p.strHeDaoTao_Id, strKhoaDaoTao_Id: p.strKhoaDaoTao_Id,
            strChuongTrinh_Id: p.strChuongTrinh_Id, strLopQuanLy_Id: p.strLopQuanLy_Id, strNamNhapHoc: p.strNamNhapHoc,
            strTrangThaiNguoiHoc_Id: p.strTrangThaiNguoiHoc_Id, strNgay: (loc.f('ngayKT').value || '').trim(), strDenNgay: p.strDenNgay,
            strKieuChuyenCan_Id: p.strKieuChuyenCan_Id, strDiem_DanhSachHoc_Id: '', dGio: 0, dPhut: 0, dGiay: 0 })
            .then(function () { ui.toast('Khởi tạo thành công', 'ok'); })
            .catch(function (err) { ums.api.handle(err, 'khởi tạo ngày chuyên cần'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'khoitao') khoiTao();
        else if (a === 'luu') luoi.luu();
        else if (a === 'dong') z('kq').hidden = true;
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
