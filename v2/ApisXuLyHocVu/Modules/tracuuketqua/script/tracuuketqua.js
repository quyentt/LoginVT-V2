/* =========================================================================
   Tra cứu kết quả xử lý học vụ
   Bản gốc: ApisXuLyHocVu/Modules/tracuuketqua/html/tracuuketqua.html + script/tracuuketqua.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Năm nhập học · Khoa QL ·
   Học kỳ · Kế hoạch xử lý · Loại xử lý / Mức xử lý · từ khoá · Tìm kiếm · Xuất báo cáo · Import /
   "Chọn trạng thái sinh viên") → khung "Danh sách" (ẩn tới khi Tìm kiếm, nút × để đóng) →
   hộp "Thay đổi mức cảnh cáo" khi bấm vào ô "Kết quả điều chỉnh".
   Thanh lọc + bảng dùng chung với Thực hiện xử lý: ums.xlhvKQ
   (../../thuchienxulyhocvu/script/_ketqua.js).

   Lời gọi (chép nguyên):
       XLHV_KetQuaXuLy/LayDanhSach · LayDuLieuTuKhoaKetQuaXuLy (GET) — xem _ketqua.js
       XLHV_KetQuaXuLy/CapNhat (POST) — hộp "Thay đổi mức cảnh cáo": strId (ID dòng), strChucNang_Id,
            strMucXuLy_Moi_Id, strMucXuLy_LyDo, strMucXuLy_CanBo_Id, strNguoiThucHien_Id; lưu xong nạp lại.
       Xuất báo cáo / Import: ums.report.mount (getList_MauImport "zonebtnTC" — html có vùng _Import).
            Cặp addKeyValue chép nguyên (obj_list của màn này KHÔNG có action / strTuKhoa / strChucNang_Id).

   Lỗi bản gốc — "Thay đổi mức cảnh cáo" CHƯA TỪNG CHẠY, làm theo ý định (đường GHI mới):
     · Bấm ô: objGetOneDataInData(this.id, me.strTraCuuKetQua…) tra trong một CHUỖI rỗng, rồi đọc
       biến aData không tồn tại → ReferenceError, hộp không hiện tên người học.
     · Nút Lưu của hộp là #btnSave_CanhCao nhưng mã gắn #btnSave_TieuChi → bấm Lưu không làm gì.
     · save_MucCanhCao: có strId thì đổi action sang RL_TieuChiDanhGia/CapNhat (chép nhầm từ
       màn Rèn luyện) — mà sửa thì luôn có strId. Bản mới gửi XLHV_KetQuaXuLy/CapNhat như dòng
       khai báo đầu hàm (màn anh em pheduyetketqua gắn đúng nút và cũng khai action này).
     · Bắt buộc chọn "Mức xử lý mới" (gốc không kiểm — gửi rỗng là xoá mức).
   Lỗi bản gốc — bảng lệch cột (sửa theo màn anh em pheduyetketqua, cùng tên cột):
     · Tiêu đề có 5 cột sau "Thông tin học viên" nhưng dữ liệu chỉ 4 (thiếu "Điều kiện xử lý"
       XLHV_KEHOACHXULY_TEN) và ô chọn tất cả bị thêm HAI lần → mọi cột Thông số lệch một ô.
     · Cột "Ngày điều chỉnh" gốc đổ MUCXULY_THAYDOI_LYDO (lý do) — không có cột ngày nào trong
       dữ liệu. Bản mới đặt tên đúng nội dung: "Lý do điều chỉnh" (ghi can-quyet).
     · Cột "Kết quả điều chỉnh" gốc hiện MUCXULY_TEN — máy chủ giữ cột đó là mức TỰ ĐỘNG, mức đã điều chỉnh nằm ở
       MUCXULY_THAYDOI_TEN (kiểm host 30/9) → đổi mức xong cột không đổi. Bản mới hiện mức đã điều chỉnh (ums.xlhvKQ.mucDieuChinh).
     · Gốc không truyền Pager vào bảng (genTable_TraCuuKetQua(dtReRult)) → không có phân trang
       dù gửi pageIndex/pageSize = 10 → chỉ xem được 10 dòng đầu. Bản mới có phân trang.
   Cố ý bỏ (mã chết): TaoHangDoi_ThucHienXuLy (không có nút; gửi kế hoạch dropAAAA) + endHangDoi,
     trình xử lý #dropSearch_SoLuong (html không có ô này — dùng 10 luồng như mặc định gốc).
     Chung với Thực hiện xử lý: xem đầu tệp _ketqua.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, K = ums.xlhvKQ, esc = ui.esc;
    var root = document.getElementById('xlhv-tracuuketqua');
    if (!root) return;

    root.innerHTML = ums.pat.page('Tra cứu kết quả xử lý học vụ', '') +
        '<div data-z="loc"></div>' + K.khungDS();
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = K.boLoc(z('loc'), {
        hang: [['he', 'khoa', 'ct', 'lop'], ['nam', 'kql', 'hk', 'kh'], ['loai', 'muc', 'q', 'nut']]
    });

    ums.report.mount(loc.z('bc'), { collect: function (add) { loc.baoCao(add); } });

    var dong = [];
    var kq = K.ketQua(root, {
        thamSo: loc.thamSo,
        luong: function () { return 10; },
        sauVe: function (el, rs) { dong = rs; },
        cot: function () {
            var g = ['Thông tin học viên'];
            return [
                { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN', group: g },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', group: g, cls: 'is-nowrap' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: g },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', group: g, cls: 'is-nowrap' },
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: g, cls: 'is-nowrap' },
                { title: 'Họ tên', group: g, cls: 'is-nowrap is-center', render: function (r) { return esc(K.hoTen(r)); } },
                { title: 'Kết quả xử lý tự động', prop: 'MUCXULY_TEN', cls: 'is-center' },
                { title: 'Kết quả điều chỉnh', render: function (r, i) {
                    return '<button type="button" class="ums-link" data-doimuc="' + i + '" title="Thay đổi mức cảnh cáo">' +
                        esc(K.mucDieuChinh(r)) + '</button>';
                } },
                { title: 'Lý do điều chỉnh', prop: 'MUCXULY_THAYDOI_LYDO' },
                { title: 'Người điều chỉnh', prop: 'MUCXULY_THAYDOI_CANBO' },
                { title: 'Điều kiện xử lý', prop: 'XLHV_KEHOACHXULY_TEN' }
            ];
        }
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a], [data-doimuc]');
        if (!b || !root.contains(b)) return;
        if (b.hasAttribute('data-doimuc')) {
            var r = dong[Number(b.getAttribute('data-doimuc'))];
            if (r) K.hopDoiMuc(r, { host: root, mucXuLy: loc.mucXuLy, onSaved: kq.tai });     // biểu mẫu trong trang (BO-CUC luật 1)
            return;
        }
        if (b.getAttribute('data-a') === 'search') kq.tim();
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); kq.tim(); } });
})();
