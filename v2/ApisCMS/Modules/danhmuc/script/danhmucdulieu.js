/* =========================================================================
   Danh mục dữ liệu — bản của phân hệ QUẢN TRỊ (ApisCMS)
   Bản gốc: ApisCMS/Modules/danhmuc/html/danhmucdulieu.html + script/danhmucdulieu.js
   (CLAUDE.md mục 8 bẫy 10: 21 bản danhmucdulieu.js. Bản CMS lệch bản Tài chính quá
   nhiều để dùng lại _v2/ApisTaiChinh/Modules/danhmuc/script/danhmucdulieu.js bằng
   thuộc tính thẻ: action mã hoá + func cho danh sách bảng / thuộc tính / chi tiết /
   lưu, ô lọc ỨNG DỤNG, từ khoá tìm trên MÁY CHỦ, cây phân trang, nút Export, nguồn
   "dữ liệu cha" lấy từ chính danh sách dữ liệu. → Chuyển riêng, cùng khuôn với bản TC.)
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái = cây bảng danh mục (ums.cmsDm.cay, script/_dm.js),
   phải = dữ liệu của bảng đang chọn — cột và ô nhập dựng theo thuộc tính khai báo.
   Lời gọi (chép nguyên văn):
     Cây bảng:   CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi  pkg_chung_danhmuc.LayDanhSachDanhMuc  dTrangThai 1
                 (chưa chọn ứng dụng: phân trang 10 dòng; đã chọn: pageSize 100000)
     Thuộc tính: CMS_DanhMuc_MH/DSA4BSAvKRIgIikVKTQuIhUoLykFIC8pDDQi  pkg_chung_danhmuc.LayDanhSachThuocTinhDanhMuc
                 pageSize 100, dTrangThai 1
     Dữ liệu:    CMS_DanhMucDuLieu/LayDanhSach  GET  strCha_Id = ô "dữ liệu cha", strTuKhoa, pageSize 1000000,
                 dTrangThai = ô trạng thái (1/0), strQUANHECHA_Id "" (gốc đọc #dropAAAA)
     Chi tiết:   CMS_DanhMuc_MH/DSA4FSkuLyYVKC8FNA0oJDQFDBUpJC4IJQPP  pkg_chung_danhmuc.LayThongTinDuLieuDMTheoId
     Thêm/Sửa:   CMS_DanhMuc_MH/FSkkLAU0DSgkNAUgLykMNCIP | CMS_DanhMuc_MH/EjQgBTQNKCQ0BSAvKQw0IgPP
                 KHÔNG func nhưng gốc gửi iM → truyền iM tường minh (CHUYEN-DOI mục 4). dTrangThai 1.
     Xoá:        CMS_DanhMucDuLieu/Xoa  strId "id1,id2," (một lời gọi), dTrangThai 1
     Export:     rootPathReport + /Modules/Common/ExportDataInDanhMuc.aspx?strMaDanhMucs=<MADANHMUC bảng đang chọn>

   Giữ nguyên hành vi gốc:
     · Chỉ trường có trong thuộc tính của bảng mới đọc từ ô nhập; trường khác gửi "" (ThongTinX)
       hoặc 0 (HeSoX); HeSo trống gửi 0. Mã + Tên bắt buộc khi bảng có hai trường đó.
     · Không tự mở bảng đầu tiên (bản CMS đã bỏ đoạn tự bấm).
   Khác gốc / lỗi gốc:
     · Nguồn "dữ liệu cha" (ô lọc + ô trong biểu mẫu): gốc dựng lại từ KẾT QUẢ LỌC sau mỗi lần nạp
       rồi đặt ô lọc về trống — lọc theo cha xong thì danh sách cha chỉ còn các con và ô lọc tự xoá.
       Bản mới chỉ dựng lại khi nạp KHÔNG lọc (cha rỗng, từ khoá rỗng) — đúng dòng chú thích sẵn trong
       bản TC gốc `if (strCha_Id == "" && strTuKhoa == "") me.genCombo_DMDL()`. Không thêm lời gọi.
     · Tiêu đề bảng gốc có ThongTin7/8 nhưng thân bảng không vẽ hai cột đó (lệch cột) → như bản TC:
       ThongTin7/8 chỉ có trong biểu mẫu.
     · Bỏ: updateStatus_DMDL (mã chết, gọi hàm không tồn tại), hộp "Import dữ liệu file excel"
       (#myModal_Upload — popup_import không nơi nào gọi).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('danhmucdulieu');
    if (!root) return;
    var D = ums.cmsDm, e = D.e;

    var KNOWN = {
        Ten:       { key: 'strTen', col: 'TEN', required: true },
        Ma:        { key: 'strMa', col: 'MA', required: true },
        HeSo1:     { key: 'dHeSo1', col: 'HESO1', num: true, cls: 'is-center' },
        HeSo2:     { key: 'dHeSo2', col: 'HESO2', num: true, cls: 'is-center' },
        HeSo3:     { key: 'dHeSo3', col: 'HESO3', num: true, cls: 'is-center' },
        ThongTin1: { key: 'strThongTin1', col: 'THONGTIN1' },
        ThongTin2: { key: 'strThongTin2', col: 'THONGTIN2' },
        ThongTin3: { key: 'strThongTin3', col: 'THONGTIN3' },
        ThongTin4: { key: 'strThongTin4', col: 'THONGTIN4' },
        ThongTin5: { key: 'strThongTin5', col: 'THONGTIN5' },
        ThongTin6: { key: 'strThongTin6', col: 'THONGTIN6' },
        ThongTin7: { key: 'strThongTin7', col: 'THONGTIN7', formOnly: true },
        ThongTin8: { key: 'strThongTin8', col: 'THONGTIN8', formOnly: true }
    };

    var m = ums.pat.master({
        el: root,
        title: 'Danh mục dữ liệu',
        side: { title: 'Danh sách danh mục', kieu: 'danhmuc', search: false, filter: D.locHtml() },
        main: { title: false }
    });

    function khung(html) {
        m.mainBody.innerHTML = '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
            '<i class="fa-light fa-folder-tree"></i> Dữ liệu danh mục</div></div>' +
            '<div class="ums-panel__body">' + html + '</div></div>';
    }
    khung(ui.empty('Vui lòng chọn tên bảng để bắt đầu nhập dữ liệu!', 'fa-hand-pointer'));

    var cay = D.cay(m, { onPick: pick });

    function pick(bang) {
        var token = pick.token = {};
        khung(ui.empty('Đang tải…', 'fa-spinner fa-spin'));
        ums.api.call({
            action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikVKTQuIhUoLykFIC8pDDQi',
            func: 'pkg_chung_danhmuc.LayDanhSachThuocTinhDanhMuc',
            strTuKhoa: '',
            strCHUNG_TENDANHMUC_Id: bang.ID,
            pageIndex: 1,
            pageSize: 100,
            dTrangThai: 1,
            strTieuChiSapXep: ''
        }).then(function (r) {
            if (pick.token !== token) return;
            var attrs = D.rows(r);
            if (!attrs.length) {
                khung(ui.empty('Bảng chưa được khai báo tham số thuộc tính!', 'fa-circle-info'));
                return;
            }
            build(bang, attrs);
        }).catch(function (err) {
            if (pick.token !== token) return;
            khung(ui.fail(err.message));
            ums.api.handle(err, 'thuộc tính danh mục');
        });
    }

    function build(bang, attrs) {
        var bangId = bang.ID;
        var defs = [];
        attrs.forEach(function (a) {
            var k = KNOWN[a.TENTRUONGDULIEU];
            if (!k) return;
            defs.push({ label: e(a.MOTA) || e(a.TENTRUONGDULIEU), k: k });
        });

        var columns = defs.filter(function (d) { return !d.k.formOnly; }).map(function (d) {
            return {
                title: d.label,
                cls: d.k.cls || '',
                render: d.k.num
                    ? function (r) { var v = r[d.k.col]; return ui.esc(v === null || v === undefined || v === '' ? 0 : v); }
                    : function (r) { return ui.esc(e(r[d.k.col])); }
            };
        });

        var fields = defs.map(function (d) {
            return { key: d.k.key, col: d.k.col, label: d.label, required: !!d.k.required, type: d.k.num ? 'number' : 'text' };
        });
        fields.push({ key: 'strMoTa', col: 'MOTA', label: 'Mô tả', span: true });
        fields.push({ key: 'strQuanHeCha_Id', col: 'QUANHECHA_ID', label: 'Dữ liệu cha', type: 'select',
            placeholder: '-- Chọn dữ liệu cha--', span: true });

        m.mainBody.innerHTML = '';
        var crud = ums.crud({
            root: m.mainBody,
            embedded: true,
            title: 'Dữ liệu danh mục — ' + e(bang.TENDANHMUC),
            formTitle: 'danh mục dữ liệu',
            icon: 'fa-folder-tree',
            addText: 'Tạo mới',
            empty: 'Không tìm thấy dữ liệu!',
            toolbar: [{
                text: 'Export', icon: ui.ICON.excel, mod: 'out-info',
                onClick: function () {
                    var b = cay.cur();
                    if (b) D.moBaoCao('/Modules/Common/ExportDataInDanhMuc.aspx?strMaDanhMucs=' + e(b.MADANHMUC));
                }
            }],
            filters: [
                { key: 'cha', type: 'select', label: '-- Chọn dữ liệu cha--', source: { items: [] } },
                { key: 'tt', type: 'select', label: 'Đang hoạt động', value: '1',
                  source: { items: [{ ID: '1', TEN: 'Đang hoạt động' }, { ID: '0', TEN: 'Dừng hoạt động' }] } },
                { key: 'q', type: 'text', label: 'Nhập từ khóa' }
            ],
            list: {
                call: function (f) {
                    return {
                        action: 'CMS_DanhMucDuLieu/LayDanhSach',
                        method: 'GET',
                        strCha_Id: f.cha,
                        strTuKhoa: f.q,
                        strCHUNG_TENDANHMUC_Id: bangId,
                        strTieuChiSapXep: '',
                        pageIndex: 1,
                        pageSize: 1000000,
                        // Gốc: ô chỉ có 1/0, mặc định 1 — ô ở đây xoá trắng được, trống = 1
                        dTrangThai: f.tt === '' ? 1 : f.tt,
                        strQUANHECHA_Id: ''
                    };
                }
            },
            // genCombo_DMDL: nguồn "dữ liệu cha" = chính danh sách dữ liệu (chỉ lấy lần nạp không lọc)
            onLoad: function (rows, c) {
                var f = c.filterValues();
                if (f.cha || f.q) return;
                c.root.querySelectorAll('[data-k="cha"][data-scope="filter"], [data-k="strQuanHeCha_Id"][data-scope="form"]')
                    .forEach(function (el) { ums.pat.fill(el, rows, { name: 'TEN' }); });
            },
            columns: columns,
            detail: function (row) {
                return {
                    action: 'CMS_DanhMuc_MH/DSA4FSkuLyYVKC8FNA0oJDQFDBUpJC4IJQPP',
                    func: 'pkg_chung_danhmuc.LayThongTinDuLieuDMTheoId',
                    strId: row.ID,
                    strTieuChiSapXep: ''
                };
            },
            fields: fields,
            save: function (v, row) {
                var o = {
                    action: row ? 'CMS_DanhMuc_MH/EjQgBTQNKCQ0BSAvKQw0IgPP' : 'CMS_DanhMuc_MH/FSkkLAU0DSgkNAUgLykMNCIP',
                    iM: ums.session.iM,
                    strMa: '', strTen: '',
                    strQuanHeCha_Id: v.strQuanHeCha_Id,
                    strChung_TenDanhMuc_Id: bangId,
                    dHeSo1: 0, dHeSo2: 0, dHeSo3: 0,
                    strThongTin1: '', strThongTin2: '', strThongTin3: '', strThongTin4: '',
                    strThongTin5: '', strThongTin6: '', strThongTin7: '', strThongTin8: '',
                    strMoTa: v.strMoTa,
                    strId: row ? row.ID : '',
                    dTrangThai: 1,
                    strNguoiThucHien_Id: ''
                };
                defs.forEach(function (d) {
                    var val = v[d.k.key];
                    o[d.k.key] = d.k.num ? (val === '' || val === undefined ? 0 : val) : val;
                });
                return o;
            },
            remove: function (ids) {
                return {
                    action: 'CMS_DanhMucDuLieu/Xoa',
                    strId: ids.join(',') + ',',
                    strNguoiThucHien_Id: '',
                    dTrangThai: 1
                };
            }
        });
        return crud;
    }
})();
