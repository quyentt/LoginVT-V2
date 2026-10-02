/* =========================================================================
   Phần chung của module dieukienxuly (Xử lý học vụ) — ums.xlhvDk
   Dùng ở: khaibaodieukien (khai báo điều kiện chung), dieukienapdung (áp
   dụng điều kiện cho khoá × thời gian).
   ---------------------------------------------------------------------------
   Hai màn gốc có cùng biểu mẫu "Thêm mới - Điều kiện xử lý" HAI CỘT: bên trái
   các ô nhập (col-sm-6), bên phải bảng "Danh sách từ khóa" (col-sm-6) để người
   khai báo tra từ khoá khi viết xâu điều kiện. Ở đây:
     · tuKhoa()          XLHV_ThongTinChung/LayDSTuKhoa (GET) — nạp MỘT lần
                         như gốc (init), các lần mở biểu mẫu sau dùng lại.
     · haiCot(crud, extra)
                         gọi trong onForm của ums.crud: xếp khung biểu mẫu và
                         vùng extra thành lưới hai cột (.ums-grid--2, màn hẹp tự
                         về một cột), vẽ bảng từ khoá vào vùng extra.
     · LOAIXULY / MUCXULY nguồn danh mục (loadToCombo_DanhMucDuLieu của gốc).
     · cauLoi(err, câuTrùng) câu báo khi lưu hỏng — thay "Du lieu da ton tai" / "Du lieu khong hop le" của máy chủ.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    if (ums.xlhvDk) return;

    var pTuKhoa = null;

    /** Danh sách từ khoá — getList_TuKhoa của gốc (strNguoiThucHien_Id do ums.api tự điền) */
    function tuKhoa() {
        if (!pTuKhoa) {
            pTuKhoa = ums.api.call({
                action: 'XLHV_ThongTinChung/LayDSTuKhoa',
                method: 'GET',
                silent: true
            }).then(function (r) {
                var d = r.data;
                return Array.isArray(d) ? d : (d && d.rs) || [];
            }).catch(function (err) {
                pTuKhoa = null;
                ums.api.handle(err, 'danh sách từ khóa');
                return [];
            });
        }
        return pTuKhoa;
    }

    /** Biểu mẫu crud (trái) + bảng từ khoá (phải), đúng hai cột col-sm-6 của gốc */
    function haiCot(crud, extra) {
        if (!extra) return;
        var form = extra.parentNode;
        if (form && !form.classList.contains('ums-grid')) {
            form.classList.add('ums-grid', 'ums-grid--2');
            extra.classList.remove('ums-u-mt-4');       // khoảng cách đã do gap của lưới lo
        }
        extra.innerHTML = pat.panel({
            title: 'Danh sách từ khóa', icon: 'fa-key', flush: true,
            body: '<div data-z="xlhvTuKhoa">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var host = extra.querySelector('[data-z="xlhvTuKhoa"]');
        tuKhoa().then(function (rows) {
            if (!host.isConnected) return;
            ui.table({
                el: host, rows: rows, stt: true,
                tableCls: 'ums-table--lined ums-table--tight',
                empty: 'Không có từ khóa',
                columns: [
                    { title: 'Từ khóa', prop: 'TUKHOA', cls: 'is-center is-nowrap' },
                    { title: 'Mô tả', prop: 'MOTA' }
                ]
            });
        });
        // Xâu điều kiện dài (gốc cao 200px / 500px) — cho ô rộng rãi hơn mặc định
        var xau = crud.root.querySelector('textarea[data-k="strXauDieuKien"]');
        if (xau) xau.rows = 10;
    }

    /** Câu báo khi lưu hỏng (saveFail của ums.crud): máy chủ chỉ trả hai câu không dấu, màn nói rõ nghĩa. */
    function cauLoi(err, cauTrung) {
        var m = String(err && err.message || '');
        if (/da ton tai/i.test(m)) return cauTrung;
        if (/khong hop le/i.test(m)) return 'Máy chủ không nhận dữ liệu — kiểm tra lại các ô đã nhập (xâu điều kiện viết bằng các từ khóa ở bảng bên phải).';
        return '';
    }

    ums.xlhvDk = {
        tuKhoa: tuKhoa,
        haiCot: haiCot,
        cauLoi: cauLoi,
        LOAIXULY: { dm: 'XLHV.LOAIXULY' },
        MUCXULY: { dm: 'XLHV.MUCXULY' }
    };
})();
