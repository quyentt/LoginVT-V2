/* =========================================================================
   Học phần
   Bản gốc: ApisKeHoachChuongTrinh/Modules/noidungdaotao/html/hocphan.html + script/hocphan.js
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc (từ khoá, Bộ môn, Môn học, Thuộc tính học phần) +
   "Danh sách học phần"; biểu mẫu "Thông tin học phần" + lưới "Phân bổ học phần"
   thay chỗ danh sách (ums.crud + ums.pat.rows).
   Lời gọi (chép nguyên):
       KHCT_HocPhan/LayDanhSach   GET  strTuKhoa, strDaoTao_MonHoc_Id, strThuocBoMon_Id, strThuocTinhHocPhan_Id,
                                       strNguoiThucHien_Id '', phân trang
       KHCT_HocPhan/LayChiTiet    GET  strId
       KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eCS4iESkgLwPP  pkg_kehoach_thongtin.Them_DaoTao_HocPhan  (thêm)
       KHCT_ThongTin_MH/EjQgHgUgLhUgLh4JLiIRKSAv      pkg_kehoach_thongtin.Sua_DaoTao_HocPhan   (sửa)
            strLoaiHocPhan_Id, strId, strTen, strMa, strDaoTao_MonHoc_Id, dHocTrinh (trống → -1), strThuocBoMon_Id,
            strThuocTinhHocPhan_Id, strKyHieu, dLaMonTinhDiem (trống → -1), strTenTA, dHocTrinhTinhPhi (trống → -1)
       KHCT_HocPhan/Xoa           strIds (nối dấu phẩy)
       KHCT_HocPhan_PhanBo/LayDanhSach  GET  strTuKhoa '', strDaoTao_HocPhan_Id, strLoaiPhanBo_Id '', pageIndex 1, pageSize 10000
       KHCT_HocPhan_PhanBo/ThemMoi|CapNhat  strId, strDaoTao_HocPhan_Id, strLoaiPhanBo_Id, dSoTiet — lưu SAU học phần
       KHCT_HocPhan_PhanBo/Xoa    strIds
       KHCT_MonHoc/LayDanhSach    GET  strThuocBoMon_Id = Bộ môn đang lọc (ô Môn học của thanh lọc)
   Danh mục: KHCT.TTHP (thuộc tính), KHCT.LOAIPHANBO (loại phân bổ), DAOTAO.LOAIHOCPHAN (loại học phần).
   Import: nút "Import" → showImportChung('Học phần', 'IMPORTWITHPROC_HP') của gốc (ums.report.importChung).

   Khác gốc (sửa lỗi / tự chốt):
   - Ô Bộ môn của biểu mẫu gốc bị nạp HAI nguồn đè nhau (getList_CoCauToChuc và danh mục KHCT.BOMON — cái
     về sau thắng) → dùng MỘT nguồn cơ cấu tổ chức như ô lọc và màn Môn học.
   - Ô Môn học của biểu mẫu gốc dùng chung danh sách với ô lọc (thu hẹp theo Bộ môn đang LỌC) → biểu mẫu
     nạp mọi môn học.
   - Lưới phân bổ: gốc lưu MỌI dòng kể cả dòng trống (tạo bản ghi rỗng) → chỉ lưu dòng đã chọn Loại phân bổ.
   - Thanh lọc Bộ môn → Môn học: khoá Môn học tới khi chọn Bộ môn (luật cha → con).
   - Mẫu import theo phân quyền (getList_MauImport "zonebtnHP") không nạp: vùng Xuất báo cáo không có trên
     màn gốc, còn mẫu import phân quyền chỉ ĐÈ mục viết cứng "1. Import Học phần".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('khct-hocphan');
    if (!root) return;
    var N = ums.khctND, pat = ums.pat;
    var BOMON = N.srcBoMon();
    var TTHP = { dm: 'KHCT.TTHP' };
    var MONHOC = { call: { action: 'KHCT_MonHoc/LayDanhSach', method: 'GET', strTuKhoa: '', strThuocBoMon_Id: '',
        strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }, id: 'ID', name: 'TEN' };
    function soHoacAm(x) { return x ? x : -1; }

    var luoi = null;
    function veLuoi(extra, row) {
        extra.innerHTML = '<div data-z="phanbo"></div>';
        luoi = pat.rows(extra.querySelector('[data-z="phanbo"]'), {
            title: 'Phân bổ học phần', icon: 'fa-layer-group', minRows: 1,
            columns: [
                { key: 'strLoaiPhanBo_Id', col: 'LOAIPHANBO_ID', title: 'Loại phân bổ', type: 'select',
                  source: { dm: 'KHCT.LOAIPHANBO' }, placeholder: 'Chọn loại phân bổ' },
                { key: 'dSoTiet', col: 'SOTIET', title: 'Số tiết', width: '200px' }
            ],
            list: function (id) {
                return { action: 'KHCT_HocPhan_PhanBo/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HocPhan_Id: id,
                         strLoaiPhanBo_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 };
            },
            filled: function (v) { return !!v.strLoaiPhanBo_Id; },
            save: function (v, rec, id) {
                return {
                    action: rec ? 'KHCT_HocPhan_PhanBo/CapNhat' : 'KHCT_HocPhan_PhanBo/ThemMoi',
                    strId: rec ? rec.ID : '',
                    strDaoTao_HocPhan_Id: id,
                    strLoaiPhanBo_Id: v.strLoaiPhanBo_Id,
                    dSoTiet: v.dSoTiet,
                    strNguoiThucHien_Id: ''
                };
            },
            remove: function (rec) { return { action: 'KHCT_HocPhan_PhanBo/Xoa', strIds: rec.ID, strNguoiThucHien_Id: '' }; }
        });
        luoi.load(row ? row.ID : '');
    }

    var crud = ums.crud({
        root: root,
        title: 'Học phần',
        formTitle: 'học phần',
        listTitle: 'Danh sách học phần',
        icon: 'fa-book-open',
        saveAgain: 'Lưu và Nhập tiếp',
        rowDelete: false,
        formDelete: false,
        toolbar: [{ text: 'Import', icon: 'fa-cloud-arrow-up', mod: 'out-info', onClick: function (c) {
            ums.report.importChung('Học phần', 'IMPORTWITHPROC_HP', { onDone: function () { c.load(); } });
        } }],
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'bomon', type: 'select', label: 'Chọn bộ môn', source: BOMON },
            { key: 'monhoc', type: 'select', label: 'Chọn môn học' },
            { key: 'tthp', type: 'select', label: 'Chọn thuộc tính học phần', source: TTHP }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'KHCT_HocPhan/LayDanhSach', method: 'GET', strTuKhoa: f.q, strDaoTao_MonHoc_Id: f.monhoc,
                         strThuocBoMon_Id: f.bomon, strThuocTinhHocPhan_Id: f.tthp, strNguoiThucHien_Id: '' };
            }
        },
        columns: [
            { title: 'Mã học phần', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên học phần', prop: 'TEN' },
            { title: 'Bộ môn', prop: 'THUOCBOMON_TEN' },
            { title: 'Sử dụng trong CTDT', prop: 'HOCPHANSUDUNGTRONGCTDT' },
            { title: 'Môn học', prop: 'DAOTAO_MONHOC_TEN' },
            { title: 'Thuộc tính học phần', prop: 'THUOCTINHHOCPHAN_TEN' },
            { title: 'Số tín chỉ', prop: 'HOCTRINH', cls: 'is-center', width: '100px' }
        ],
        detail: function (row) { return { action: 'KHCT_HocPhan/LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { type: 'legend', label: 'Thông tin học phần' },
            { key: 'strMa', col: 'MA', label: 'Mã học phần' },
            { key: 'strTen', col: 'TEN', label: 'Tên học phần' },
            { key: 'strTenTA', col: 'TENTA', label: 'Tên học phần tiếng anh' },
            { key: 'strThuocBoMon_Id', col: 'THUOCBOMON_ID', label: 'Bộ môn', type: 'select', source: BOMON, placeholder: 'Chọn bộ môn' },
            { key: 'strDaoTao_MonHoc_Id', col: 'DAOTAO_MONHOC_ID', label: 'Môn học', type: 'select', source: MONHOC, placeholder: 'Chọn môn học' },
            { key: 'strThuocTinhHocPhan_Id', col: 'THUOCTINHHOCPHAN_ID', label: 'Thuộc tính học phần', type: 'select', source: TTHP, placeholder: 'Chọn thuộc tính học phần' },
            { key: 'dHocTrinh', col: 'HOCTRINH', label: 'Số tín chỉ' },
            { key: 'dHocTrinhTinhPhi', col: 'HOCTRINHTINHPHI', label: 'Số tín chỉ tính phí' },
            { key: 'strKyHieu', col: 'KYHIEU', label: 'Ký hiệu' },
            { key: 'dLaMonTinhDiem', col: 'LAMONTINHDIEM', label: 'Tính điểm', type: 'select', required: true, value: '1',
              source: { items: [{ ID: '1', TEN: 'Có' }, { ID: '0', TEN: 'Không' }] }, placeholder: false },
            { key: 'strLoaiHocPhan_Id', col: 'LOAIHOCPHAN_ID', label: 'Loại học phần', type: 'select', source: { dm: 'DAOTAO.LOAIHOCPHAN' }, placeholder: 'Chọn loại học phần' }
        ],
        onForm: function (row, c, extra) { veLuoi(extra, row); },
        save: function (v, row) {
            return {
                action: row ? 'KHCT_ThongTin_MH/EjQgHgUgLhUgLh4JLiIRKSAv' : 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eCS4iESkgLwPP',
                func: row ? 'pkg_kehoach_thongtin.Sua_DaoTao_HocPhan' : 'pkg_kehoach_thongtin.Them_DaoTao_HocPhan',
                strLoaiHocPhan_Id: v.strLoaiHocPhan_Id,
                strId: row ? row.ID : '',
                strTen: v.strTen,
                strMa: v.strMa,
                strDaoTao_MonHoc_Id: v.strDaoTao_MonHoc_Id,
                dHocTrinh: soHoacAm(v.dHocTrinh),
                strThuocBoMon_Id: v.strThuocBoMon_Id,
                strThuocTinhHocPhan_Id: v.strThuocTinhHocPhan_Id,
                strKyHieu: v.strKyHieu,
                dLaMonTinhDiem: soHoacAm(v.dLaMonTinhDiem),
                strTenTA: v.strTenTA,
                dHocTrinhTinhPhi: soHoacAm(v.dHocTrinhTinhPhi),
                strNguoiThucHien_Id: ''
            };
        },
        onSaved: function (c, result) {
            var id = (result.raw && result.raw.Id) || (c.editing && c.editing.ID) || '';
            if (luoi) luoi.save(id);
        },
        remove: function (ids) {
            return { action: 'KHCT_HocPhan/Xoa', strIds: ids.join(','), strNguoiThucHien_Id: '' };
        }
    });

    /* Thanh lọc: Bộ môn → Môn học (getList_MonHoc theo bộ môn đang lọc) */
    var fBoMon = N.fl(crud, 'bomon'), fMonHoc = N.fl(crud, 'monhoc');
    function napMonHoc() {
        if (!fBoMon.value) { pat.fill(fMonHoc, [], { head: 'Chọn môn học' }); return Promise.resolve(); }
        return N.monHoc(fBoMon.value).then(function (r) { pat.fill(fMonHoc, r, { head: 'Chọn môn học' }); })
            .catch(function (err) { ums.api.handle(err, 'môn học'); });
    }
    jQuery(fBoMon).on('select2:select select2:clear', function () { napMonHoc().then(function () { crud.load(1); }); });
    pat.chain([fBoMon, fMonHoc], { phatLai: false });
})();
