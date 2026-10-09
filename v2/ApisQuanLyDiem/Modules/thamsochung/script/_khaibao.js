/* =========================================================================
   Khung chung các màn "KHAI BÁO" của Quản lý điểm — ums.qldKB
   Dùng ở 8 màn (mỗi màn một tệp cấu hình mỏng):
     thamsochung/khaibaothamsochung          D_ThamSoHocTapChung
     thamsolamtron/khaibaothamsolamtron      D_ThamSoLamTron
     thamsotinhdiem/khaibaothamsotinhdiem    D_ThamSoTongHop
     thanhphandiem/khaibaothanhphandiem      D_ThanhPhanDiem (+ D_ThongTin/Them|Sua_Diem_ThanhPhanDiem)
     diemdacbiet/khaibaodiemdacbiet          D_DiemDacBiet
     thamsodanhgiaketqua/thamsodanhgiaketqua D_ThamSoDanhGiaKetQua
     thamsoquydoithangdiem/…                 D_QuyDoiThangDiem
     congthucdiem/khaibaocongthucdiem        D_CongThucDiem (+ D_ThongTin/Them|Sua_Diem_CongThucDiem)
   Màn ở module khác nạp chéo: <script src="../../thamsochung/script/_khaibao.js">.
   ---------------------------------------------------------------------------
   Tám tệp gốc chép cùng một khuôn (lệch nhau ~200 dòng mỗi cặp, chỉ khác tên
   controller, ô lọc, cột, ô nhập):
     · thanh "Tìm kiếm" (ô chọn + từ khoá + nút) · bảng "Danh sách …" có ô đánh
       dấu + nút "Xóa" + "Thêm mới" ở đầu khung · biểu mẫu "Thêm mới - Thông tin …"
       THAY CHỖ danh sách (toggle_overide zone-bus) → đúng ums.crud một cột.
     · Lời gọi (kiểu cũ, KHÔNG func, không iM — chép nguyên):
         <ctl>/LayDanhSach  GET  strTuKhoa + ô lọc riêng + strNguoiThucHien_Id "",
                                 pageIndex / pageSize (phân trang máy chủ, Pager)
         <ctl>/LayChiTiet   GET  strId  (mở biểu mẫu sửa đọc lại chi tiết)
         <ctl>/ThemMoi      POST strId = '' + ô nhập   (hoặc action riêng: cfg.them)
         <ctl>/CapNhat      POST strId = ID dòng + ô nhập (hoặc cfg.sua)
         <ctl>/Xoa          POST strIds = các ID đánh dấu nối dấu phẩy, MỘT lời gọi
       strNguoiThucHien_Id: gốc gửi edu.system.userId — ums.api tự điền khi để trống.
     · "Thêm mới" (rewrite): ô chọn của biểu mẫu lấy sẵn giá trị ô lọc cùng loại
       (vd dropThoiGianDaoTao ← dropSearch_ThoiGianDaoTao) → cfg.tuLoc.

   Cấu hình ums.qldKB.man(root, cfg):
     title, listTitle, formTitle, icon   chữ hiển thị (chép từ html gốc)
     ctl                                 tên controller, vd 'D_ThamSoLamTron'
     them / sua                          action thêm / sửa nếu khác <ctl>/ThemMoi|CapNhat
     loc: [ { key, label, source } ]     ô chọn của thanh lọc (ô từ khoá "q" tự thêm cuối)
     locThamSo(f) → {…}                  tham số lọc riêng gửi kèm LayDanhSach
     columns, fields, formCols           như ums.crud
     luu(v) → {…}                        tham số lưu (không kể strId)
     tuLoc: { khoáÔNhập: khoáÔLọc }     "Thêm mới" chép giá trị ô lọc sang biểu mẫu

   Tiện ích dùng chung:
     THOIGIAN   nguồn ô Thời gian đào tạo — KHCT_ThoiGianDaoTao/LayDanhSach GET
                (strTuKhoa/strDAOTAO_NAM_Id/strNguoiThucHien_Id "", pageIndex 1,
                pageSize 1000000), tên DAOTAO_THOIGIANDAOTAO — getList_ThoiGianDaoTao gốc
     cotThoiGian(title)  cột "NAM - KY - DOT" như mRender gốc
     coKhong(có, không)  hai mục 1 / 0 cho ô chọn Có / Không

   Khác gốc (chung cả 8 màn — lỗi rõ của gốc, đã sửa theo ý định):
     · Enter ở ô từ khoá: 4 màn gốc gọi me.me.getList_… (TypeError) → Enter không
       tìm được; nay tìm (ums.crud).
     · Lưu xong quay về danh sách và nạp lại; gốc ở lại biểu mẫu, hỏi "tiếp tục
       thêm không?" mà KHÔNG nhận id mới — bấm Lưu lần hai là THÊM TRÙNG.
     · "Lưu và Nhập tiếp": giữ (saveAgain) — lưu XONG mới xoá trắng biểu mẫu
       (gốc xoá trắng ngay khi vừa gửi, lỗi thì mất dữ liệu đã nhập).
     · Không kiểm ô bắt buộc — gốc khai arrValid_… nhưng KHÔNG nơi nào gọi kiểm
       (thanhphandiem còn chú thích bỏ dòng validInputForm). Giữ như gốc.
     · Không có nút xoá trên từng dòng: gốc có trình xử lý .btnDelete nhưng bảng
       không vẽ nút đó (mã chết); xoá = đánh dấu + "Xóa" như gốc.
     · Bỏ ảnh minh hoạ cột phải của biểu mẫu (Upload/images/img-*.png — trang trí,
       không phải dữ liệu); biểu mẫu chiếm cả khung.
   ========================================================================= */
(function () {
    'use strict';

    if (ums.qldKB) return;
    var ui = ums.ui;

    function e(v) { return v === undefined || v === null ? '' : String(v); }

    /* Nguồn Thời gian đào tạo — getList_ThoiGianDaoTao của gốc (dùng chung
       cho ô lọc và ô nhập nên chỉ gọi một lần, như gốc nạp một lần vào hai ô). */
    function thoiGian() {
        return {
            call: {
                action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET',
                strTuKhoa: '', strDAOTAO_NAM_Id: '', strNguoiThucHien_Id: '',
                pageIndex: 1, pageSize: 1000000
            },
            id: 'ID', name: 'DAOTAO_THOIGIANDAOTAO'
        };
    }

    /** Cột thời gian đào tạo: "<NAM> - <KY> - <DOT>" (mRender gốc) */
    function cotThoiGian(title) {
        return {
            title: title || 'Thời gian đào tạo', cls: 'is-center is-nowrap',
            render: function (r) {
                return ui.esc(e(r.DAOTAO_THOIGIANDAOTAO_NAM) + ' - ' + e(r.DAOTAO_THOIGIANDAOTAO_KY) + ' - ' +
                    e(r.DAOTAO_THOIGIANDAOTAO_DOT));
            }
        };
    }

    /** Ô chọn Có / Không (option value 1 / 0 của html gốc) */
    function coKhong(co, khong) {
        return { items: [{ ID: '1', TEN: co || 'Có' }, { ID: '0', TEN: khong || 'Không' }] };
    }

    function man(root, cfg) {
        if (!root) return null;
        var ctl = cfg.ctl;

        var filters = (cfg.loc || []).map(function (l) {
            return { key: l.key, type: 'select', label: l.label, source: l.source };
        });
        filters.push({ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' });

        var crud = ums.crud({
            root: root,
            title: cfg.title,
            listTitle: cfg.listTitle,
            formTitle: cfg.formTitle,
            icon: cfg.icon || 'fa-list-timeline',
            filters: filters,

            list: {
                paged: true,
                call: function (f) {
                    var o = {
                        action: ctl + '/LayDanhSach',
                        method: 'GET',
                        strTuKhoa: f.q
                    };
                    var rieng = cfg.locThamSo ? cfg.locThamSo(f) : {};
                    Object.keys(rieng).forEach(function (k) { o[k] = rieng[k]; });
                    o.strNguoiThucHien_Id = '';
                    return o;
                }
            },

            columns: cfg.columns,
            formCols: cfg.formCols || 2,
            fields: cfg.fields,
            saveAgain: 'Lưu và Nhập tiếp',

            detail: function (row) {
                return { action: ctl + '/LayChiTiet', method: 'GET', strId: row.ID };
            },

            save: function (v, row) {
                var o = {
                    action: row ? (cfg.sua || ctl + '/CapNhat') : (cfg.them || ctl + '/ThemMoi'),
                    strId: row ? row.ID : ''
                };
                var p = cfg.luu(v, row);
                Object.keys(p).forEach(function (k) { o[k] = p[k]; });
                return o;
            },

            rowDelete: false,
            formDelete: false,
            remove: function (ids) {
                return { action: ctl + '/Xoa', strIds: ids.join(',') };
            },
            removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa dữ liệu?'; },

            onForm: function (row, c) {
                if (row || !cfg.tuLoc) return;
                // rewrite() gốc: biểu mẫu thêm mới lấy sẵn giá trị ô lọc cùng loại
                var f = c.filterValues();
                Object.keys(cfg.tuLoc).forEach(function (k) {
                    var el = c.root.querySelector('[data-cf="' + c.uid + '"][data-scope="form"][data-k="' + k + '"]');
                    if (!el) return;
                    el.value = f[cfg.tuLoc[k]] || '';
                    if (window.jQuery) jQuery(el).trigger('change.select2');
                });
            }
        });
        return crud;
    }

    ums.qldKB = {
        man: man,
        thoiGian: thoiGian,
        cotThoiGian: cotThoiGian,
        coKhong: coKhong
    };
})();
