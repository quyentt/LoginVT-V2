/* =========================================================================
   Quy định đóng bảo hiểm
   Bản gốc: ApisNhanSu/Modules/luong/script/quydinhdongbaohiem.js
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc (col-lg-3 danh sách | col-lg-9 Thông tin chung / biểu mẫu).
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_QuyDinhBaoHiem/LayDanhSach  GET  strTuKhoa, strNguoiTao_Id '', strNhanSu_QuyDinhLuong_Id '',
                                          strLoaiKhoan_Id '', strDoiTuongApDung_Id '', pageIndex 1, pageSize 100000
       L_QuyDinhBaoHiem/LayChiTiet   GET  strId
       L_QuyDinhBaoHiem/ThemMoi | CapNhat  POST
           strId, strNhanSu_QuyDinhLuong_Id, strLoaiKhoan_Id, dPhanTram,
           strLoaiKhoanTinhBaoHiem_Ids, strLoaiPhuCapTinhBaoHiem_Ids (chuỗi ID các ô
           đánh dấu, cách nhau dấu phẩy — getValCheckBoxByDiv), strDoiTuongApDung_Id
       L_QuyDinhBaoHiem/Xoa          POST strIds
   Nguồn: L_BangQuyDinhLuong/LayDanhSach (tên MUCLUONGCOBAN), danh mục NHANSU.LOAIKHOAN
   (ô Loại khoản VÀ cả hai nhóm ô đánh dấu — loadLoaiKhoan gốc ghi cùng một danh
   sách vào hai vùng), LUONG.BAOHIEM.DOITUONGAPDUNG.
   Cột đọc khi sửa: NHANSU_BANGQUYDINHLUONG_ID, LOAIKHOAN_ID, PHANTRAM,
   LOAIKHOANTINHBAOHIEM_IDS, LOAIPHUCAPTINHBAOHIEM_IDS, DOITUONG_ID.
   Kiểm trước khi lưu (như gốc): mỗi nhóm ô đánh dấu phải chọn ít nhất một;
   Bảng quy định lương bắt buộc (arrValid gốc — các ô khác trong arrValid không có trên màn).

   Lỗi gốc đã xử lý:
     · init còn gọi loadToCheckBox_DMDL("DKH.TTSV") (trạng thái SINH VIÊN) vào hai
       vùng ô đánh dấu, chạy đua với NHANSU.LOAIKHOAN — bỏ, chỉ giữ NHANSU.LOAIKHOAN.
     · Ô tìm kiếm có trên màn nhưng danh sách gốc luôn gửi strTuKhoa '' → nay gửi
       từ khoá đã gõ.
   Khác bản gốc: nút Xoá nằm trong biểu mẫu sửa (mục ở cột trái là nút bấm).
   ========================================================================= */
(function () {
    'use strict';

    var C = 'L_QuyDinhBaoHiem';
    var ui = ums.ui, esc = ui.esc;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function tach(s) { return String(e(s)).split(',').map(function (x) { return x.trim(); }).filter(Boolean); }

    var QDL = { call: { action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000000 }, id: 'ID', name: 'MUCLUONGCOBAN' };
    var loaiKhoan = null;                    // Promise danh mục NHANSU.LOAIKHOAN (dùng cho hai nhóm ô)
    var nhom = {};                           // khoá → pat.checks

    function nhomO(crud, key, nhan) {
        var hid = crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + key + '"]');
        if (!hid) return null;
        if (!nhom[key]) {
            var box = document.createElement('div');
            box.style.gridColumn = '1 / -1';
            box.innerHTML = '<label class="ums-field__label">' + esc(nhan) + '<i class="ums-field__req">*</i></label><div data-lgbck></div>';
            hid.parentNode.insertBefore(box, hid.nextSibling);
            if (!loaiKhoan) loaiKhoan = ums.api.dm('NHANSU.LOAIKHOAN');
            nhom[key] = ums.pat.checks(box.querySelector('[data-lgbck]'), loaiKhoan, { all: false, checked: false, cols: 3 });
        }
        return nhom[key];
    }

    ums.crud({
        root: document.getElementById('quydinhdongbaohiem'),
        title: 'Quy định đóng bảo hiểm',
        formTitle: 'quy định mức đóng bảo hiểm',
        icon: 'fa-shield-heart',
        saveAgain: 'Lưu và Nhập tiếp',
        multi: false,

        master: {
            title: 'Danh sách quy định đóng bảo hiểm', icon: 'fa-list-ul',
            empty: 'Bạn có quy định đóng bảo hiểm mới không? Bấm Thêm mới ở đầu trang, hoặc chọn một quy định ở danh sách bên trái để sửa.',
            item: function (r) {
                return '<b>Quy định lương: ' + esc(e(r.NHANSU_BANGQUYDINHLUONG_TEN)) + '</b>' +
                    '<span class="ums-master__item__sub">Loại khoản: ' + esc(e(r.LOAIKHOAN_TEN)) + '</span>' +
                    '<span class="ums-master__item__sub">Phần trăm: ' + esc(e(r.PHANTRAM)) + '</span>';
            }
        },

        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],

        list: {
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiTao_Id: '', strNhanSu_QuyDinhLuong_Id: '',
                    strLoaiKhoan_Id: '', strDoiTuongApDung_Id: '', pageIndex: 1, pageSize: 100000 };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        formCols: 12,
        fields: [
            { key: 'strNhanSu_QuyDinhLuong_Id', col: 'NHANSU_BANGQUYDINHLUONG_ID', label: 'Bảng quy định lương', type: 'select',
              source: QDL, placeholder: '-- Chọn quy định lương --', required: true, cols: 12 },
            { key: 'strLoaiKhoan_Id', col: 'LOAIKHOAN_ID', label: 'Loại khoản', type: 'select', source: { dm: 'NHANSU.LOAIKHOAN' },
              placeholder: '-- Chọn loại khoản--', cols: 6 },
            { key: 'dPhanTram', col: 'PHANTRAM', label: 'Phần trăm', cols: 6 },
            { key: '_lktbh', type: 'hidden' },
            { key: '_lpctbh', type: 'hidden' },
            { key: 'strDoiTuongApDung_Id', col: 'DOITUONG_ID', label: 'Đối tượng áp dụng', type: 'select',
              source: { dm: 'LUONG.BAOHIEM.DOITUONGAPDUNG' }, placeholder: '-- Chọn đối tượng áp dụng --', cols: 4 }
        ],

        onForm: function (row, crud) {
            var a = nhomO(crud, '_lktbh', 'Loại khoản tính bảo hiểm');
            var b = nhomO(crud, '_lpctbh', 'Loại phụ cấp tính bảo hiểm');
            loaiKhoan.then(function () {
                a.set(row ? tach(row.LOAIKHOANTINHBAOHIEM_IDS) : []);
                b.set(row ? tach(row.LOAIPHUCAPTINHBAOHIEM_IDS) : []);
            });
        },

        save: function (v, row) {
            var lk = nhom._lktbh ? nhom._lktbh.val() : '';
            var lpc = nhom._lpctbh ? nhom._lpctbh.val() : '';
            if (!lk) { ui.toast('Chọn 1 trong các loại khoản tính bảo hiểm', 'warn'); return null; }
            if (!lpc) { ui.toast('Chọn 1 trong các loại phụ cấp tính bảo hiểm', 'warn'); return null; }
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strNhanSu_QuyDinhLuong_Id: v.strNhanSu_QuyDinhLuong_Id,
                strLoaiKhoan_Id: v.strLoaiKhoan_Id,
                dPhanTram: v.dPhanTram,
                strLoaiKhoanTinhBaoHiem_Ids: lk,
                strLoaiPhuCapTinhBaoHiem_Ids: lpc,
                strDoiTuongApDung_Id: v.strDoiTuongApDung_Id,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id }; }); }
    });
})();
