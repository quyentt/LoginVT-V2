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
   Xuất Excel (kéo gốc lần 16, 9/11 — gốc edu.exporter.attachTable + fetchAll): nút cạnh Import, xuất TOÀN BỘ học phần
       theo điều kiện đang lọc (LayDanhSach pageSize 1000000), kèm cột "Tên học phần tiếng Anh" (bảng không có) để dò
       học phần chưa có tên tiếng Anh; API danh sách không trả TENTA → nạp từng học phần bằng LayChiTiet (8 cùng lúc,
       ums.ui.batch); hộp hỏi trước khi xuất báo số chưa có tên tiếng Anh + ô "lọc thêm khi xuất" (Tên tiếng Anh, Bộ môn).
       Tầng chung: ums.ui.xuatXls thay edu.exporter (tệp .xls bảng HTML, không CDN); không có phiên bản exporter để kiểm.

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
    var N = ums.khctND, pat = ums.pat, ui = ums.ui;
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

    /* ---------- Xuất Excel (gốc 9/11: edu.exporter.attachTable + fetchAll) ----------------
       Xuất TOÀN BỘ học phần theo điều kiện đang lọc, kèm "Tên học phần tiếng Anh". API danh sách
       có thể không trả TENTA → nạp từng học phần bằng LayChiTiet; học phần nạp lỗi ghi
       "(không nạp được)" — không để trống kẻo hiểu nhầm là chưa có tên tiếng Anh. */
    var TT = { co: 'Đã có tên tiếng Anh', chua: 'Chưa có tên tiếng Anh', loi: 'Không nạp được' };
    function ttTenTA(r) {
        if (r.__tenTaLoi) return TT.loi;
        return String(r.TENTA === null || r.TENTA === undefined ? '' : r.TENTA).replace(/\s+/g, '') === '' ? TT.chua : TT.co;
    }
    function napTatCa(c) {
        var call = c.cfg.list.call(c.filterValues(), { index: 1, size: 1000000 });
        call.pageIndex = 1; call.pageSize = 1000000;
        return ums.api.call(call).then(function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; });
    }
    function boSungTenTA(rows) {
        if (!rows.length || rows.some(function (r) { return r.TENTA !== undefined; })) return Promise.resolve(rows);
        return ui.batch(rows.map(function (r) {
            return function () {
                return ums.api.call({ action: 'KHCT_HocPhan/LayChiTiet', method: 'GET', strId: r.ID, silent: true }).then(function (x) {
                    var d = Array.isArray(x.data) ? x.data[0] : null;
                    if (!d) throw new Error('Không có dữ liệu chi tiết');
                    r.TENTA = d.TENTA === null || d.TENTA === undefined ? '' : d.TENTA;
                }, function (err) { r.TENTA = ''; r.__tenTaLoi = 1; throw err; });
            };
        }), { title: 'Đang nạp tên tiếng Anh của ' + rows.length + ' học phần', concurrency: 8, toast: false, show: true })
            .then(function () { return rows; });
    }
    function chuThuan(v) { return String(v === null || v === undefined ? '' : v).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
    var COT_XUAT = [
        { title: 'Mã học phần', prop: 'MA' },
        { title: 'Tên học phần', prop: 'TEN' },
        { title: 'Tên học phần tiếng Anh', get: function (r) { return r.__tenTaLoi ? '(không nạp được)' : r.TENTA; } },
        { title: 'Bộ môn', prop: 'THUOCBOMON_TEN' },
        { title: 'Môn học', prop: 'DAOTAO_MONHOC_TEN' },
        { title: 'Thuộc tính học phần', prop: 'THUOCTINHHOCPHAN_TEN' },
        { title: 'Số tín chỉ', prop: 'HOCTRINH' },
        { title: 'Sử dụng trong CTĐT', get: function (r) { return chuThuan(r.HOCPHANSUDUNGTRONGCTDT); } }
    ];
    function mucChon(list) { return list.map(function (t) { return '<option value="' + ui.esc(t) + '">' + ui.esc(t) + '</option>'; }).join(''); }
    function hopXuat(c, rows) {
        var nChua = rows.filter(function (r) { return ttTenTA(r) === TT.chua; }).length,
            nLoi = rows.filter(function (r) { return ttTenTA(r) === TT.loi; }).length;
        var boMon = [];
        rows.forEach(function (r) { var t = r.THUOCBOMON_TEN; if (t && boMon.indexOf(t) < 0) boMon.push(t); });
        boMon.sort(function (a, b) { return String(a).localeCompare(String(b), 'vi'); });
        var luuY = [];
        if (nChua) luuY.push('Có ' + nChua + '/' + rows.length + ' học phần chưa có tên tiếng Anh. Chọn "' + TT.chua + '" ở ô "Tên tiếng Anh" bên dưới để chỉ xuất các học phần này.');
        if (nLoi) luuY.push('Không nạp được tên tiếng Anh của ' + nLoi + ' học phần (tệp ghi "(không nạp được)") — thử xuất lại.');
        var body = '<div class="ums-u-mb-2">Sẽ xuất <b>' + rows.length + '</b> học phần theo điều kiện đang lọc.</div>' +
            (luuY.length ? '<div class="ums-u-fz13 ums-u-danger ums-u-mb-2">' + luuY.map(function (t) { return '<div><i class="fa-light fa-triangle-exclamation"></i> ' + ui.esc(t) + '</div>'; }).join('') + '</div>' : '') +
            '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2">Lọc thêm khi xuất (bỏ trống = tất cả):</div>' +
            ui.field('Tên tiếng Anh', '<select class="ums-select" data-x="ta"><option value="">Tất cả</option>' + mucChon([TT.co, TT.chua].concat(nLoi ? [TT.loi] : [])) + '</select>') +
            ui.field('Bộ môn', '<select class="ums-select" data-x="bm"><option value="">Tất cả</option>' + mucChon(boMon) + '</select>');
        ui.dialog({
            title: 'Xuất Excel danh sách học phần', icon: 'fa-file-excel', size: 'sm', body: body,
            buttons: [{ text: 'Xuất Excel', kind: 'excel', onClick: function (api) {
                var ta = api.body.querySelector('[data-x="ta"]').value, bm = api.body.querySelector('[data-x="bm"]').value;
                var dong = rows.filter(function (r) { return (!ta || ttTenTA(r) === ta) && (!bm || r.THUOCBOMON_TEN === bm); });
                if (!dong.length) { ui.toast('Không có học phần nào khớp điều kiện lọc thêm.', 'warn'); return false; }
                var phu = [], dk = ums.process.dieuKien([['Bộ môn', N.fl(c, 'bomon')], ['Môn học', N.fl(c, 'monhoc')], ['Thuộc tính học phần', N.fl(c, 'tthp')]]);
                var tk = (c.filterValues().q || '').trim();
                if (dk) phu.push(dk);
                if (tk) phu.push('Từ khóa: ' + tk);
                if (ta || bm) phu.push('Lọc thêm khi xuất — ' + [ta ? 'Tên tiếng Anh: ' + ta : '', bm ? 'Bộ môn: ' + bm : ''].filter(Boolean).join(' · '));
                var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
                ui.xuatXls('DanhSachHocPhan_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()),
                    { tieuDe: 'DANH SÁCH HỌC PHẦN', phu: phu, cot: COT_XUAT, dong: dong });
            } }]
        });
    }
    function xuatExcel(c) {
        ui.toast('Đang nạp toàn bộ danh sách để xuất…', 'info');
        napTatCa(c).then(boSungTenTA).then(function (rows) {
            if (!rows.length) return ui.toast('Không có học phần nào để xuất.', 'warn');
            hopXuat(c, rows);
        }).catch(function (err) { ums.api.handle(err, 'xuất Excel học phần'); });
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
        } }, { text: 'Xuất Excel', icon: 'fa-file-excel', mod: 'out-info', onClick: function (c) { xuatExcel(c); } }],
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
