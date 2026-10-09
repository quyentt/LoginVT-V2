/* =========================================================================
   Hệ số áp dụng (trọng số điểm rèn luyện theo học kỳ / năm học)
   Bản gốc: ApisRenLuyen/Modules/khaibaoheso/html/hesoapdung.html + script/hesoapdung.js
   Khung chung "áp dụng": _apdung.js cùng thư mục (ums.rlApDung).
   ---------------------------------------------------------------------------
   Bố cục như gốc: thanh lọc chung ở trên; hai khung cạnh nhau (col-lg-6):
   "Áp dụng hệ số cho học kỳ" | "Áp dụng hệ số cho năm học", mỗi khung Thêm mới,
   Xoá các dòng đánh dấu, Sửa trên dòng. Biểu mẫu thay chỗ bảng NGAY TRONG khung
   của nó (gốc: hai hộp thoại #myModal / #myModal_NamHoc).

   Lời gọi (action kiểu cũ, không func — chép nguyên):
     RL_TrongSoDiem_AD/LayDSDRL_TrongSoDiem_AD_Ky  GET  hệ số học kỳ (thời gian = ô lọc Thời gian)
     RL_TrongSoDiem_AD/LayDanhSach                 GET  hệ số năm học (thời gian = ô lọc Năm học)
     RL_TrongSoDiem_AD/ThemMoi | CapNhat           lưu cả hai loại (CapNhat khi có strId);
                                                   học kỳ gửi ô Thời gian, năm gửi ô Năm học
     RL_TrongSoDiem_AD/Xoa                         xoá — MỖI dòng một lời gọi (strIds = một id)
   Danh mục: DRL.DOITUONGAPDUNG; năm học, thời gian, hệ, khoá qua ums.rlApDung.
   Ô đọc dropAAAA / dropSAAAA của gốc (strNguoiTao_Id, strPhanCapApDung_Id) gửi rỗng.

   Giữ như gốc:
     · Ô "Năm học" trong biểu mẫu HỌC KỲ chỉ để xem — không gửi đi (gốc cũng không).
     · Cột thời gian của khung NĂM HỌC đọc DAOTAO_THOIGIANDAOTAO_KY như gốc (tiêu đề
       gốc ghi "NamHoc") — có thể trống với dòng theo năm, kiểm trên host.
     · Không có xoá từng dòng / xoá trong biểu mẫu (nút Xoá trong hộp gốc để ẩn).
   Khác gốc (lỗi gốc đã sửa):
     · Thêm mới SAU KHI sửa một dòng: gốc đặt lại nhầm biến (strHeSoApDung_Id) nên vẫn
       giữ id dòng vừa sửa → "Thêm mới" thành CapNhat đè dòng đó. Nay thêm mới đúng.
     · Nút "Xóa" của khung năm học: html gốc đặt id btnHeSoNamHoc, js gắn
       #btnDeleteHeSoNamHoc → chưa từng xoá được. Nay xoá được.
     · Xoá nhiều dòng: đợi xoá xong mới nạp lại (gốc nạp lại sau số-dòng × 50 ms).
     · Hệ → Khoá nối tầng riêng cho ô lọc và cho từng biểu mẫu (gốc đổi hệ ở BẤT KỲ ô nào
       cũng nạp lại cả ba ô khoá). Đổi ô lọc là tải lại ngay cả hai khung.
   ========================================================================= */
(function () {
    'use strict';

    var pat = ums.pat, A = ums.rlApDung;
    var root = document.getElementById('rl-hesoapdung');
    if (!root) return;

    root.innerHTML =
        pat.page('Hệ số áp dụng') +
        pat.filterBar([
            { key: 'dt', type: 'select', label: A.NHAN.dt },
            { key: 'he', type: 'select', label: A.NHAN.he },
            { key: 'khoa', type: 'select', label: A.NHAN.khoa },
            { key: 'nam', type: 'select', label: A.NHAN.nam },
            { key: 'tg', type: 'select', label: A.NHAN.tg },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        '<div class="ums-grid ums-grid--2"><div data-z="ky"></div><div data-z="nam"></div></div>';

    var loc = A.boLoc(function (k) { return root.querySelector('[data-f="' + k + '"]'); });
    var cruds = [];
    function taiLai() { cruds.forEach(function (c) { c.load(1); }); }

    function truong(coTg) {
        var f = [
            { key: 'strDoiTuongApDung_Id', col: 'DOITUONGAPDUNG_ID', label: 'Đối tượng', type: 'select', source: { dm: 'DRL.DOITUONGAPDUNG' } },
            { key: '_he', label: 'Hệ đào tạo', type: 'select', placeholder: A.NHAN.he },
            { key: 'strPhamViApDung_Id', label: 'Khóa đào tạo', type: 'select', placeholder: A.NHAN.khoa },
            { key: '_nam', label: 'Năm học', type: 'select', placeholder: A.NHAN.nam }
        ];
        if (coTg) f.push({ key: '_tg', label: 'Thời gian đào tạo', type: 'select', placeholder: A.NHAN.tg });
        return f.concat([
            { key: 'dTrongSo', col: 'TRONGSO', label: 'Trọng số' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ]);
    }

    /* o = { el, title, formTitle, list(action), thoiGian(v) → strDaoTao_ThoiGianDaoTao_Id, coTg, cotTG } */
    function khung(o) {
        var pv = null, fe = null;
        var crud = ums.crud({
            root: root.querySelector('[data-z="' + o.el + '"]'),
            embedded: true,
            title: o.title,
            formTitle: o.formTitle,
            icon: 'fa-rectangle-list',
            formCols: 1,
            list: {
                paged: true,
                call: function () {
                    return {
                        action: o.list,
                        method: 'GET',
                        strTuKhoa: loc.v('q'),
                        strChucNang_Id: '',
                        strDoiTuongApDung_Id: loc.v('dt'),
                        strDaoTao_ThoiGianDaoTao_Id: loc.v(o.coTg ? 'tg' : 'nam'),
                        strNguoiTao_Id: '',
                        strPhamViApDung_Id: loc.v('khoa')
                    };
                }
            },
            columns: [
                { title: o.cotTG, prop: 'DAOTAO_THOIGIANDAOTAO_KY' },
                { title: 'Trọng số', prop: 'TRONGSO', cls: 'is-center' },
                { title: 'Mô tả', prop: 'MOTA' }
            ],
            rowDelete: false,
            formDelete: false,
            fields: truong(o.coTg),
            onForm: function (row) {
                if (!row) A.dat(fe('strDoiTuongApDung_Id'), loc.v('dt'));
                pv.set(A.giaTriPV(row, loc));
            },
            save: function (v, row) {
                return {
                    action: row ? 'RL_TrongSoDiem_AD/CapNhat' : 'RL_TrongSoDiem_AD/ThemMoi',
                    strId: row ? row.ID : '',
                    strChucNang_Id: '',
                    strDoiTuongApDung_Id: v.strDoiTuongApDung_Id,
                    strPhanCapApDung_Id: '',
                    strDaoTao_ThoiGianDaoTao_Id: o.coTg ? v._tg : v._nam,
                    strMoTa: v.strMoTa,
                    strPhamViApDung_Id: v.strPhamViApDung_Id,
                    dTrongSo: v.dTrongSo,
                    strNguoiThucHien_Id: ''
                };
            },
            remove: function (ids) {
                return ids.map(function (id) {
                    return { action: 'RL_TrongSoDiem_AD/Xoa', strIds: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
                });
            }
        });
        fe = A.crudEl(crud, 'form');
        pv = A.phamViForm(fe);
        cruds.push(crud);
        return crud;
    }

    khung({ el: 'ky', title: 'Áp dụng hệ số cho học kỳ', formTitle: 'hệ số áp dụng học kỳ',
        list: 'RL_TrongSoDiem_AD/LayDSDRL_TrongSoDiem_AD_Ky', coTg: true, cotTG: 'Học kỳ' });
    khung({ el: 'nam', title: 'Áp dụng hệ số cho năm học', formTitle: 'hệ số áp dụng cho năm',
        list: 'RL_TrongSoDiem_AD/LayDanhSach', coTg: false, cotTG: 'Năm học' });

    /* ---------- Tìm kiếm: nút, Enter ở ô từ khoá, đổi ô lọc ---------------- */
    root.querySelector('[data-a="search"]').addEventListener('click', taiLai);
    root.querySelector('[data-f="q"]').addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); taiLai(); }
    });
    jQuery(root).find('.ums-filter select').on('change', function () { taiLai(); });
})();
