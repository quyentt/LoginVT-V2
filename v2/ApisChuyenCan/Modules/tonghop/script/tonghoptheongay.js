/* =========================================================================
   Tổng hợp chuyên cần theo ngày
   Bản gốc: ApisChuyenCan/Modules/tonghop/html/tonghoptheongay.html + script/tonghoptheongay.js
   ---------------------------------------------------------------------------
   Bản gốc là bản chép của nhapchuyencan (cùng khung tìm kiếm, cùng bảng SV × ngày
   có ô đánh dấu + ô số, cùng nút Lưu) — khác: danh sách PHÂN TRANG máy chủ, id người
   học lấy cột QLSV_NGUOIHOC_ID, ô Tổng chỉ đếm số ô (không có "(số buổi)"), có vùng
   "Xuất báo cáo", KHÔNG có hàng "Khởi tạo ngày chuyên cần" (nút không có trong html).
   Khung dùng chung: ums.cc.boLoc / ums.cc.luoi (nhapchuyencan/script/_chung.js).

   Lời gọi (XLHV_CC_ThongTin_MH · PKG_CHUYENCAN_THONGTIN, chép nguyên):
       LayKQQLSV_NguoiHoc_ChuyenCan   danh sách → Data { rs, rsNgay } + Pager (pageIndex/pageSize theo trang)
       LayKetQuaChuyenCanTheoNgay     mỗi ô một lời gọi (strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID)
       Them_QLSV_NguoiHoc_ChuyenCan   lưu ô (strId '', strDiem_DanhSach_Id '', dGio/dPhut/dGiay '')
       Xoa_QLSV_NguoiHoc_ChuyenCan1   bỏ đánh dấu ô đã có
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_TongHopTheoNgay", không có vùng _Import)
   Khác gốc (lỗi rõ):
     · Xoá: đối tượng tham số gốc khai TRÙNG khoá — nhóm khoá sau (đọc ô txtAAAA / dropAAAA không
       tồn tại) đè nhóm đầu, nên thực tế gửi strQLSV_NguoiHoc_Id, strKieuChuyenCan_Id,
       strDaoTao_LopQuanLy_Id, strDaoTao_ChuongTrinh_Id, strNgayGhiNhan RỖNG → bỏ đánh dấu không xoá
       được đúng ô. Ở đây gửi giá trị của nhóm đầu (đúng ý định, giống nhapchuyencan).
     · Báo cáo: callback gốc gọi genHeader_TongHopTheoNgay KHÔNG tồn tại → bấm mẫu báo cáo là lỗi JS,
       chưa từng chạy. Ở đây bỏ lời gọi đó, gửi đúng các cặp addKeyValue còn lại.
     · Kiểu chuyên cần của ô / lưu / xoá lấy theo lúc bấm Tìm kiếm (gốc đọc ô đang chọn lúc gọi).
   Giữ như bản gốc:
     · Báo cáo gửi strDiem_DanhSachHoc_Id = giá trị ô "Từ ngày" (gốc đọc txtSearch_TuNgay_IHD).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cc = ums.cc;
    var root = document.getElementById('cc-tonghoptheongay');
    if (!root) return;

    var XL = 'XLHV_CC_ThongTin_MH/', PK = 'PKG_CHUYENCAN_THONGTIN.';

    root.innerHTML = pat.page('Tổng hợp chuyên cần theo ngày', '') +
        '<div data-z="loc"></div>' +
        '<div data-z="kq" hidden>' +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { text: 'Lưu', attr: { 'data-a': 'luu' } }) }) +
        '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = cc.boLoc(z('loc'), { baoCao: true });
    var dang = {}, trang = 1, co = 10;

    var luoi = cc.luoi(z('bang'), {
        lead: cc.cotSV(),
        buoi: false,
        chuHoi: 'thêm',
        o: function (sv, d) {
            return { action: XL + 'DSA4CiQ1EDQgAik0OCQvAiAvFSkkLg8mIDgP', func: PK + 'LayKetQuaChuyenCanTheoNgay',
                strChucNang_Id: cc.cn(), strNgay_Gio_Phut_Giay_Id: d.ID, strKieuChuyenCan_Id: dang.strKieuChuyenCan_Id,
                strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strDiem_DanhSachHoc_Id: '', strNguoiThucHien_Id: cc.uid() };
        },
        them: function (sv, d, soLuong) {
            // Gốc KHÔNG gửi dSoLuong ở màn này — giữ nguyên (ô số chỉ để xem).
            return { action: XL + 'FSkkLB4QDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP', func: PK + 'Them_QLSV_NguoiHoc_ChuyenCan',
                strId: '', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
                strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strQLSV_TrangThaiNguoiHoc_Id: sv.QLSV_NGUOIHOC_TRANGTHAI_ID, strDiem_DanhSach_Id: '',
                strKieuChuyenCan_Id: dang.strKieuChuyenCan_Id, strNgayGhiNhan: d.NGAYGHINHAN,
                dGio: '', dPhut: '', dGiay: '' };
        },
        xoa: function (sv, d) {
            return { action: XL + 'GS4gHhANEhceDyY0LigJLiIeAik0OCQvAiAvcAPP', func: PK + 'Xoa_QLSV_NguoiHoc_ChuyenCan1',
                strId: '', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
                strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strQLSV_TrangThaiNguoiHoc_Id: sv.QLSV_NGUOIHOC_TRANGTHAI_ID, strDiem_DanhSach_Id: '',
                strKieuChuyenCan_Id: dang.strKieuChuyenCan_Id, strNgay_Gio_Phut_Giay_Id: d.ID, strNgayGhiNhan: d.NGAYGHINHAN,
                dGio: '', dPhut: '', dGiay: '', strDiem_DanhSachHoc_Id: '' };
        },
        sauLuu: function () { tai(); }
    });

    function tim() { dang = loc.thamSo(); trang = 1; tai(); }
    function tai() {
        z('kq').hidden = false;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(Object.assign({ action: XL + 'DSA4ChAQDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP', func: PK + 'LayKQQLSV_NguoiHoc_ChuyenCan',
            strChucNang_Id: cc.cn(), strDiem_DanhSachHoc_Id: '', strNguoiThucHien_Id: cc.uid(), pageIndex: trang, pageSize: co }, dang))
            .then(function (r) {
                var d = r.data || {}, tong = Number(r.pager) || cc.arr(d.rs).length;
                z('n').textContent = '(' + tong + ')';
                luoi.ve(d, { index: trang, size: co, total: tong,
                    onChange: function (p) { trang = p; tai(); },
                    onSize: function (s) { co = s; trang = 1; tai(); } });
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tổng hợp chuyên cần'); });
    }

    ums.report.mount(loc.z('bc'), { import: false, collect: function (add) {
        var p = loc.thamSo();
        add('strTuKhoa', p.strTuKhoa);
        add('strKhoaQuanLy_Id', p.strKhoaQuanLy_Id);
        add('strHeDaoTao_Id', p.strHeDaoTao_Id);
        add('strKhoaDaoTao_Id', p.strKhoaDaoTao_Id);
        add('strChuongTrinh_Id', p.strChuongTrinh_Id);
        add('strLopQuanLy_Id', p.strLopQuanLy_Id);
        add('strNamNhapHoc', p.strNamNhapHoc);
        add('strTrangThaiNguoiHoc_Id', p.strTrangThaiNguoiHoc_Id);
        add('strTuNgay', p.strTuNgay);
        add('strDenNgay', p.strDenNgay);
        add('strKieuChuyenCan_Id', p.strKieuChuyenCan_Id);
        add('strDiem_DanhSachHoc_Id', p.strTuNgay);
    } });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'luu') luoi.luu();
        else if (a === 'dong') z('kq').hidden = true;
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
