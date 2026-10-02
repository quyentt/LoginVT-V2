/* =========================================================================
   Bài học
   Bản gốc: ApisKeHoachChuongTrinh/Modules/noidungdaotao/html/baihoc.html + script/baihoc.js
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc Hệ → Khoá → Chương trình, Học phần, từ khoá +
   "Danh sách bài học" (Import dữ liệu); biểu mẫu "Thông tin bài học" thay chỗ.
   Lời gọi (kiểu cũ, chép nguyên):
       KHCT_BaiHoc/LayDanhSach  GET  strTuKhoa, strDaoTao_HocPhan_Id = HP lọc, strDaoTao_ToChucCT_Id = CT lọc,
            strNguoiThucHien_Id '', phân trang
       KHCT_BaiHoc/LayChiTiet   GET  strId
       KHCT_BaiHoc/ThemMoi|CapNhat  strId, strDaoTao_HocPhan_Id, strDaoTao_ToChucCT_Id, strNoiDung, strTenBai, strKyHieu, dSoTiet
       KHCT_BaiHoc/Xoa          strIds (nối dấu phẩy)
       KHCT_BaiHoc/Import       GET  strPath — sau edu.system.uploadImport (ums.upload), tự import khi chọn tệp
       Lọc: KHCT_HeDaoTao / KHCT_KhoaDaoTao / KHCT_ToChucChuongTrinh/LayDanhSach (không lọc quyền — như gốc)
       Học phần (lọc + biểu mẫu): KHCT_HocPhan/LayDanhSach pageSize 100000000, nhãn "Mã - Tên".
   Thêm mới: Chương trình / Học phần điền sẵn giá trị đang lọc (rewrite của gốc).
   Khác gốc (tự chốt):
   - Ô Học phần gốc gửi strThuocBoMon_Id = id Chương trình của BIỂU MẪU (nhầm tham số; lúc nạp ô đó luôn trống
     → thực tế là MỌI học phần) → gửi '' (mọi học phần). Vì vậy Học phần KHÔNG phụ thuộc Chương trình.
   - Ô Chương trình của biểu mẫu gốc dùng chung danh sách với ô lọc (thu hẹp theo Hệ/Khoá đang lọc) → biểu mẫu
     nạp mọi chương trình (mở Sửa bản ghi ngoài phạm vi lọc vẫn hiện đúng).
   - Nút Xoá gốc lặp gọi Xoa N lần với CÙNG chuỗi mọi id (N = số dòng chọn) → gọi một lần.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('khct-baihoc');
    if (!root) return;
    var N = ums.khctND, ui = ums.ui;
    var CTL = 'KHCT_BaiHoc';
    var HP = N.srcHocPhan(function (r) { return N.e(r.MA) + ' - ' + N.e(r.TEN); });

    var crud = ums.crud({
        root: root,
        title: 'Bài học',
        formTitle: 'bài học',
        listTitle: 'Danh sách bài học',
        icon: 'fa-book-open-reader',
        saveAgain: 'Lưu và Nhập tiếp',
        rowDelete: false,
        formDelete: false,
        toolbar: [{ text: 'Import dữ liệu', icon: 'fa-cloud-arrow-up', mod: 'out-info', onClick: hopImport }],
        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình' },
            { key: 'hp', type: 'select', label: 'Chọn học phần', source: HP },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strDaoTao_HocPhan_Id: f.hp,
                         strDaoTao_ToChucCT_Id: f.ct, strNguoiThucHien_Id: '' };
            }
        },
        columns: [
            { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Tên bài', prop: 'TENBAI' },
            { title: 'Ký hiệu', prop: 'KYHIEUBAI', cls: 'is-nowrap' },
            { title: 'Số tiết', prop: 'SOTIET', cls: 'is-center', width: '80px' },
            { title: 'Nội dung', prop: 'NOIDUNG' }
        ],
        detail: function (row) { return { action: CTL + '/LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { type: 'legend', label: 'Thông tin bài học' },
            { key: 'strTenBai', col: 'TENBAI', label: 'Tên bài' },
            { key: 'strDaoTao_ToChucCT_Id', col: 'DAOTAO_TOCHUCCHUONGTRINH_ID', label: 'Chương trình', type: 'select',
              source: N.srcChuongTrinh(), placeholder: 'Chọn chương trình' },
            { key: 'strDaoTao_HocPhan_Id', col: 'DAOTAO_HOCPHAN_ID', label: 'Học phần', type: 'select', source: HP, placeholder: 'Chọn học phần' },
            { key: 'strKyHieu', col: 'KYHIEUBAI', label: 'Ký hiệu' },
            { key: 'dSoTiet', col: 'SOTIET', label: 'Số tiết' },
            { key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung', type: 'textarea' }
        ],
        onForm: function (row, c) {
            if (row) return;
            N.datGT(N.fe(c, 'strDaoTao_ToChucCT_Id'), N.fl(c, 'ct').value);
            N.datGT(N.fe(c, 'strDaoTao_HocPhan_Id'), N.fl(c, 'hp').value);
        },
        save: function (v, row) {
            return {
                action: CTL + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strDaoTao_HocPhan_Id: v.strDaoTao_HocPhan_Id,
                strDaoTao_ToChucCT_Id: v.strDaoTao_ToChucCT_Id,
                strNoiDung: v.strNoiDung,
                strTenBai: v.strTenBai,
                strKyHieu: v.strKyHieu,
                dSoTiet: v.dSoTiet,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) {
            return { action: CTL + '/Xoa', strIds: ids.join(','), strNguoiThucHien_Id: '' };
        }
    });
    N.locDaoTao(crud, {});

    /* Hộp "Import dữ liệu file excel" (#myModal_Upload của gốc): chọn tệp là tự tải lên rồi import */
    function hopImport() {
        var dlg = ui.dialog({
            title: 'Import dữ liệu file excel', icon: 'fa-file-excel', size: 'md',
            body: '<div class="ums-grid">' +
                ui.field('Chọn file excel', ui.file({ accept: '.xls,.xlsx' }), { hint: 'Chú ý: Tự động import sau khi chọn file' }) +
                '<div class="ums-u-fz13" data-z="kq"></div></div>'
        });
        ui.enhance(dlg.body);
        var inp = dlg.body.querySelector('input[type="file"]');
        var kq = dlg.body.querySelector('[data-z="kq"]');
        inp.addEventListener('change', function () {
            if (!inp.files || !inp.files.length) return;
            kq.textContent = 'Đang tải tệp lên…';
            ums.upload(inp.files).then(function (duong) {
                return ums.api.call({ action: CTL + '/Import', method: 'GET', strPath: duong });
            }).then(function (r) {
                kq.innerHTML = r.message ? 'Đã import<br>Dữ liệu lỗi: ' + ui.esc(r.message) : 'Đã import hết dữ liệu';
                crud.load();
            }).catch(function (err) {
                if (err && err.expired) return ums.api.handle(err, 'import');
                kq.textContent = 'Lỗi: ' + (err && err.message);
            });
        });
    }
})();
