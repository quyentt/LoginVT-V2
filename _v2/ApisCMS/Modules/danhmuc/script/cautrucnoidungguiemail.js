/* =========================================================================
   Cấu trúc nội dung gửi email — CauTrucNoiDungGuiEmail
   Bản gốc: ApisCMS/Modules/danhmuc/html/cautrucnoidungguiemail.html + script/cautrucnoidungguiemail.js
   ---------------------------------------------------------------------------
   Khai báo mẫu thư (mã, tên hiển thị người gửi, tiêu đề, nội dung HTML, danh sách
   email nhận, ghi chú). Màn chỉ LƯU mẫu, không gửi thư — việc gửi hàng loạt nằm ở
   tầng chung ums.pat.guiEmail của các màn nghiệp vụ.

   Bố cục bản gốc (một cột): ô từ khoá · Tìm kiếm → khung danh sách (Tạo mới · Xóa;
   bảng Mã · Tên Email hiển thị · Tiêu đề · Nội dung · Ghi chú · Sửa · ô đánh dấu,
   phân trang máy chủ). Biểu mẫu thay chỗ danh sách, HAI CỘT 7 | 5 (trái: các ô;
   phải: ảnh trang trí).

   Lời gọi (CMS_TienIch/*, versionAPI v1.0, chép nguyên):
       LayDS_CauTrucNoiDungGuiEmail   GET  strTuKhoa, strNguoiTao_Id '', pageIndex, pageSize
       Them_CauTrucNoiDungGuiEmail    POST strId '', strMa, strTenEmailHienThi, strTieuDe,
                                           strNoiDung, strDanhSachNhanEmail, strGhiChu
       Sua_CauTrucNoiDungGuiEmail     POST như trên, strId = ID
       Xoa_CauTrucNoiDungGuiEmail     POST strId — mỗi dòng đánh dấu một lời gọi
   Cột: ID, MA, TENEMAILHIENTHI, TIEUDE, NOIDUNG, DANHSACHNHANEMAIL, GHICHU.
   Bắt buộc: Mã nội dung, Tiêu đề (validInputForm "EM" của gốc).

   Khác gốc:
     · Nội dung: gốc dùng CKEditor (soạn thảo trực quan). Bộ mới chưa có trình soạn
       thảo → ô nhập MÃ HTML, cột phải (chỗ ảnh trang trí img-thamsohoctap.png của gốc)
       thành khung XEM TRƯỚC nội dung — iframe sandbox, không chạy script. Giá trị gửi
       đi vẫn là chuỗi HTML như CKEditor getData().
     · Cột "Nội dung" ở danh sách hiện CHỮ đã bỏ thẻ, cắt 160 ký tự (gốc đổ thẳng HTML
       của máy chủ vào ô bảng).
     · Chữ "Danh sách kỳ thi" / "Kỳ thi" của gốc là chép nhầm từ màn kỳ thi → đổi
       thành "Danh sách" / "cấu trúc nội dung gửi email".
     · Không có nút xoá trên từng dòng / trong biểu mẫu (gốc chỉ có Xóa nhiều dòng).
       Xoá xong nạp lại khi mọi lời gọi xong (gốc: đợi cứng 2 giây).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var root = document.getElementById('cms-cautrucnoidungguiemail');
    if (!root) return;
    var T = 'CMS_TienIch/';

    /* Bỏ thẻ HTML lấy chữ — DOMParser không chạy script, không nạp ảnh */
    function chu(html) {
        if (!html) return '';
        try { return (new DOMParser().parseFromString(String(html), 'text/html').body.textContent || '').replace(/\s+/g, ' ').trim(); }
        catch (x) { return String(html); }
    }
    function cat(s, n) { return s.length > n ? s.slice(0, n) + '…' : s; }

    ums.crud({
        root: root,
        title: 'Cấu trúc nội dung gửi email',
        formTitle: 'cấu trúc nội dung gửi email',
        icon: 'fa-envelope-open-text',
        addText: 'Tạo mới',
        removeText: 'Xóa',

        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],

        list: {
            paged: true,
            call: function (fv) {
                return {
                    action: T + 'LayDS_CauTrucNoiDungGuiEmail', method: 'GET', versionAPI: 'v1.0',
                    strTuKhoa: fv.q, strNguoiTao_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-center is-nowrap' },
            { title: 'Tên Email hiển thị', prop: 'TENEMAILHIENTHI', cls: 'is-center' },
            { title: 'Tiêu đề', prop: 'TIEUDE', cls: 'is-center' },
            { title: 'Nội dung', render: function (r) { return ui.esc(cat(chu(r.NOIDUNG), 160)); } },
            { title: 'Ghi chú', prop: 'GHICHU' }
        ],
        rowDelete: false,
        formDelete: false,

        formCols: 1,
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã nội dung', required: true },
            { key: 'strTenEmailHienThi', col: 'TENEMAILHIENTHI', label: 'Tên Email hiển thị' },
            { key: 'strTieuDe', col: 'TIEUDE', label: 'Tiêu đề', required: true },
            { key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung', type: 'textarea',
              hint: 'Mã HTML của thư — xem trước ở khung bên phải.' },
            { key: 'strDanhSachNhanEmail', col: 'DANHSACHNHANEMAIL', label: 'Danh sách Email cần gửi', type: 'textarea' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú' }
        ],

        onForm: function (row, crud, extra) {
            if (!extra) return;
            extra.classList.remove('ums-u-mt-4');      // cột phải của lưới 7 | 5 — thẳng hàng với khung biểu mẫu
            extra.innerHTML = '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
                '<i class="fa-light fa-eye"></i> Xem trước nội dung</div></div>' +
                '<div class="ums-panel__body"><iframe class="cu-preview" sandbox="" title="Xem trước nội dung email"></iframe></div></div>';
            var fr = extra.querySelector('iframe');
            var ta = root.querySelector('[data-k="strNoiDung"][data-scope="form"]');
            if (!ta) return;
            ta.classList.add('cu-code', 'cu-code--query');
            ta.rows = 14;
            // iframe sandbox="" → không chạy script, không gửi form của nội dung
            ta._cuVe = function () { fr.srcdoc = '<meta charset="utf-8"><body style="font-family:Arial,sans-serif;font-size:14px">' + ta.value + '</body>'; };
            ta._cuVe();
            if (!ta._cuXem) { ta._cuXem = true; ta.addEventListener('input', function () { ta._cuVe(); }); }
        },

        save: function (v, row) {
            v.action = row ? T + 'Sua_CauTrucNoiDungGuiEmail' : T + 'Them_CauTrucNoiDungGuiEmail';
            v.versionAPI = 'v1.0';
            v.strId = row ? row.ID : '';
            return v;
        },

        remove: function (ids) {
            return ids.map(function (id) {
                return { action: T + 'Xoa_CauTrucNoiDungGuiEmail', versionAPI: 'v1.0', strId: id };
            });
        },
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; }
    });
})();
