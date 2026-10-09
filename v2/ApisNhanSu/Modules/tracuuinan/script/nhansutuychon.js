/* =========================================================================
   Nhân sự tuỳ chọn — tra cứu và xuất danh sách nhân sự theo cột tự chọn (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/tracuuinan/html/nhansutuychon.html + script/nhansutuychon.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, col-lg-3 | col-lg-9):
     trái  — "Điều kiện tìm kiếm": cơ cấu tổ chức (Cơ cấu khoa/viện/phòng ban → Bộ môn), chức vụ, chức danh, học vị,
             loại cán bộ, loại đối tượng, ngạch công chức, quê quán → nơi sinh, giới tính, tình trạng hôn nhân, dân tộc,
             tôn giáo, tuổi bắt đầu / kết thúc;
     phải  — "Chọn thông tin cần in" (ô đánh dấu từ danh mục BACO.HTQT.NHSU — MA = tên cột, TEN = nhãn; Chọn tất cả /
             Bỏ chọn tất cả; nút Tìm kiếm) và "Danh sách nhân sự" (bảng các cột đã chọn; Xuất excel · Đóng) thay chỗ nhau.
   Bản mới: ums.pat.master (cột trái các ô lọc, cột phải hai khung thay chỗ nhau).

   Lời gọi (chép nguyên):
     edu.system.getList_CoCauToChuc → ums.ref.coCauToChuc (tách cha / con)
     edu.system.getList_DanhMucDulieu BACO.HTQT.NHSU (sắp HESO1) → ums.api.dm('BACO.HTQT.NHSU', 'HESO1')
     Danh mục NS.DMCV, NS.LOCD, NS.DMHV, NS.LTNS, NS.NGLU, NS.GITI, NS.TTHN, NS.DATO, NS.TOGI;
       tỉnh thành CHUN.DMTT (genCombo_DMDL_Cap1 / genCombo_DMDL_TheoCha → ums.pat.dmTinhThanh)
     NS_HoSoV2/LayDanhSach   GET  strTuKhoa '', pageIndex 1, pageSize 10000, strDaoTao_CoCauToChuc_Id,
                                  strNguoiThucHien_Id, dLaCanBoNgoaiTruong 0   (bảng xem trước)
     edu.system.report("NhanSuTuyChon", "") → ums.report.run('NhanSuTuyChon') với NS_CoCauToChuc, NS_ChucVu, NS_ChucDanh,
       NS_HocVi, NS_LoaiCanBo, NS_LoaiDoiTuong, ns_NgachCongChuc, NS_QueQuan, NS_NoiSinh, NS_GioiTinh,
       NS_TinhTrangHonNhan, NS_DanToc, NS_TonGiao, NS_TuoiBatDau, NS_TuoiKetThuc, NS_DangVien '', NS_FIELDs (MA các cột
       đã chọn, nối "#") — chép nguyên tên khoá (kể cả "ns_NgachCongChuc" viết thường).
   Giữ như gốc:
     · Bảng xem trước CHỈ lọc theo cơ cấu (procedure không nhận các ô khác); các ô còn lại chỉ vào báo cáo Excel.
     · Ô "Loại cán bộ" gốc không nạp danh mục nào → ô trống.
     · Ô "Nơi sinh" = đơn vị CON của tỉnh chọn ở "Quê quán" (genCombo_DMDL_TheoCha) — ghi báo cáo, chờ nghiệp vụ.
   Khác gốc (ghi báo cáo):
     · Bảng xem trước gốc gửi strDaoTao_CoCauToChuc_Id = getValById("") (luôn rỗng — biến đặt nhầm) → nay gửi
       Bộ môn || Cơ cấu đã chọn (đúng ý định; tệp Excel vẫn lọc đủ các ô như gốc).
     · Danh sách cột đã chọn (CotDuLieuIn) gốc không xoá giữa các lần Tìm kiếm → cột bị lặp trong NS_FIELDs; nay tính lại.
     · Gốc gọi LayDanhSach đồng bộ (async: false — treo trang) → nay bất đồng bộ.
   Ô cha → con: Cơ cấu → Bộ môn; Quê quán → Nơi sinh (ums.pat.chain).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-nhansutuychon');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var O = [
        ['cctc', 'Cơ cấu khoa/viện/phòng ban', '- Tìm theo cơ cấu tổ chức'], ['bomon', 'Bộ môn'],
        ['chucvu', 'Chức vụ', '- Tìm theo chức vụ, loại cán bộ'], ['chucdanh', 'Chức danh'], ['hocvi', 'Học vị'],
        ['loaicanbo', 'Loại cán bộ'], ['loaidoituong', 'Loại đối tượng'], ['ngach', 'Ngạch công chức'],
        ['quequan', 'Quê quán', '- Tìm theo địa chỉ, tuổi, tín ngưỡng'], ['noisinh', 'Nơi sinh'], ['gioitinh', 'Giới tính'],
        ['honnhan', 'Tình trạng hôn nhân'], ['dantoc', 'Dân tộc'], ['tongiao', 'Tôn giáo']
    ];
    var loc = '<div class="ums-filter">' + O.map(function (x) {
        return (x[2] ? '<div class="ums-field nstc-nhom">' + ui.esc(x[2]) + '</div>' : '') +
            '<div class="ums-field"><select class="ums-select" data-o="' + x[0] + '" data-ph="-- ' + ui.esc(x[1]) + ' --"><option value="">-- ' + ui.esc(x[1]) + ' --</option></select></div>';
    }).join('') +
        '<div class="ums-field"><input class="ums-input" data-o="tuoibd" inputmode="numeric" autocomplete="off" placeholder="Nhập tuổi bắt đầu"></div>' +
        '<div class="ums-field"><input class="ums-input" data-o="tuoikt" inputmode="numeric" autocomplete="off" placeholder="Nhập tuổi kết thúc"></div></div>';

    var mst = pat.master({
        el: root,
        title: 'Nhân sự tuỳ chọn',
        side: { title: 'Điều kiện tìm kiếm', icon: 'fa-filter', search: false, filter: loc },
        main: { title: false }
    });
    mst.sideBody.hidden = true;
    mst.sideFoot.hidden = true;
    function o(k) { return root.querySelector('[data-o="' + k + '"]'); }

    mst.mainBody.innerHTML =
        '<div data-z="chon">' + pat.panel({ title: 'Chọn thông tin cần in', icon: 'fa-list-check',
            tools: ui.btn('confirm', { text: 'Chọn tất cả', mod: 'out-primary', icon: 'fa-square-check', attr: { 'data-a': 'chontatca' } }) +
                ui.btn('reload', { text: 'Bỏ chọn tất cả', icon: 'fa-square', attr: { 'data-a': 'bochon' } }),
            body: '<div class="ums-checkgrid" data-z="cot">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            foot: '<div class="ums-row ums-row--end">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' }) + '</div>' +
        '<div data-z="xem" hidden>' + pat.panel({ title: 'Danh sách nhân sự', icon: 'fa-users', count: 'dem', flush: true, zone: 'bang',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('excel', { text: 'Xuất excel', attr: { 'data-a': 'excel' } }) }) + '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var S = { cot: [], con: [], tinh: [], chon: [] };
    var dangXem = false;
    function sang(xem) {
        if (xem === dangXem) return;
        ui.swap(xem ? z('chon') : z('xem'), xem ? z('xem') : z('chon'), { top: false });
        dangXem = xem;
    }

    /* ---------- Nạp ô lọc ---------- */
    function dm(k, ma) { ums.api.dm(ma).then(function (r) { pat.fill(o(k), r); }).catch(function (err) { ums.api.handle(err, ma); }); }
    dm('chucvu', 'NS.DMCV'); dm('chucdanh', 'NS.LOCD'); dm('hocvi', 'NS.DMHV'); dm('loaidoituong', 'NS.LTNS'); dm('ngach', 'NS.NGLU');
    dm('gioitinh', 'NS.GITI'); dm('honnhan', 'NS.TTHN'); dm('dantoc', 'NS.DATO'); dm('tongiao', 'NS.TOGI');
    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }).then(function (rows) {
        S.con = rows.filter(function (r) { return !!r.DAOTAO_COCAUTOCHUC_CHA_ID; });
        pat.fill(o('cctc'), rows.filter(function (r) { return !r.DAOTAO_COCAUTOCHUC_CHA_ID; }));
    }).catch(function (err) { ums.api.handle(err, 'getList_CoCauToChuc'); });
    pat.dmTinhThanh().then(function (rows) {
        S.tinh = rows;
        pat.fill(o('quequan'), rows.filter(function (r) { return !r.QUANHECHA_ID; }));
    }).catch(function (err) { ums.api.handle(err, 'CHUN.DMTT'); });
    ui.enhance(root);
    jQuery(o('cctc')).on('select2:select select2:clear', function () {
        pat.fill(o('bomon'), S.con.filter(function (r) { return r.DAOTAO_COCAUTOCHUC_CHA_ID === o('cctc').value; }));
    });
    jQuery(o('quequan')).on('select2:select select2:clear', function () {
        var cha = o('quequan').value;
        pat.fill(o('noisinh'), cha ? S.tinh.filter(function (r) { return r.QUANHECHA_ID === cha; }) : []);
    });
    pat.chain([o('cctc'), o('bomon')], { phatLai: false });
    pat.chain([o('quequan'), o('noisinh')], { phatLai: false });

    /* ---------- Ô chọn cột in (genCombo_InTuyChon) ---------- */
    ums.api.dm('BACO.HTQT.NHSU', 'HESO1').then(function (rows) {
        S.cot = rows;
        z('cot').innerHTML = rows.length ? rows.map(function (x, i) {
            return '<label class="ums-check" title="' + ui.esc(e(x.TEN)) + '"><input type="checkbox" data-in="' + i + '"> ' + ui.esc(e(x.TEN)) + '</label>';
        }).join('') : ui.empty('Chưa khai danh mục cột in (BACO.HTQT.NHSU)');
    }).catch(function (err) { z('cot').innerHTML = ui.fail(err.message); ums.api.handle(err, 'BACO.HTQT.NHSU'); });

    function coCau() { return o('bomon').value || o('cctc').value; }

    /* ---------- Xem trước (getList_HeaderPrint_NhanSu + getList_Print_NhanSu) ---------- */
    function tim() {
        var chon = Array.prototype.filter.call(z('cot').querySelectorAll('input[data-in]'), function (c) { return c.checked; })
            .map(function (c) { return S.cot[Number(c.getAttribute('data-in'))]; });
        S.chon = chon;
        sang(true);
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 10000,
            strDaoTao_CoCauToChuc_Id: coCau(), strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0 }).then(function (r) {
            var d = Array.isArray(r.data) ? r.data : (r.data && r.data.rs) || [];
            z('dem').textContent = '(' + d.length + ')';
            if (!S.cot.length) { z('bang').innerHTML = ui.empty('Không có dữ liệu tìm kiếm'); return; }
            if (!chon.length) { z('bang').innerHTML = ui.empty('Chưa chọn thông tin cần in — bấm Đóng để chọn cột'); return; }
            ui.table({
                el: z('bang'), rows: d, empty: 'Không có dữ liệu tìm kiếm',
                columns: chon.map(function (c) { return { title: e(c.TEN), render: function (x) { return ui.escBr(e(x[e(c.MA)])); } }; })
            });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'NS_HoSoV2/LayDanhSach'); });
    }

    /* ---------- Xuất excel (btnAdVancedPrint) ---------- */
    function xuat() {
        var truong = S.chon.map(function (c) { return e(c.MA); }).join('#');
        ums.report.run('NhanSuTuyChon', { duongDan: '', collect: function (add) {
            add('NS_CoCauToChuc', coCau());
            add('NS_ChucVu', o('chucvu').value); add('NS_ChucDanh', o('chucdanh').value); add('NS_HocVi', o('hocvi').value);
            add('NS_LoaiCanBo', o('loaicanbo').value); add('NS_LoaiDoiTuong', o('loaidoituong').value);
            add('ns_NgachCongChuc', o('ngach').value); add('NS_QueQuan', o('quequan').value); add('NS_NoiSinh', o('noisinh').value);
            add('NS_GioiTinh', o('gioitinh').value); add('NS_TinhTrangHonNhan', o('honnhan').value); add('NS_DanToc', o('dantoc').value);
            add('NS_TonGiao', o('tongiao').value); add('NS_TuoiBatDau', o('tuoibd').value.trim()); add('NS_TuoiKetThuc', o('tuoikt').value.trim());
            add('NS_DangVien', ''); add('NS_FIELDs', truong);
        } });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('button[data-a]');
        if (!b || !root.contains(b)) return;
        switch (b.getAttribute('data-a')) {
            case 'chontatca': Array.prototype.forEach.call(z('cot').querySelectorAll('input[data-in]'), function (c) { c.checked = true; }); break;
            case 'bochon': Array.prototype.forEach.call(z('cot').querySelectorAll('input[data-in]'), function (c) { c.checked = false; }); break;
            case 'tim': tim(); break;
            case 'dong': sang(false); break;
            case 'excel': xuat(); break;
        }
    });
})();
