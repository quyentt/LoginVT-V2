/* =========================================================================
   Báo cáo chất lượng nhân lực (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/baocao/html/chatluongnhanluc.html + script/chatluongnhanluc.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (MỘT cột): tiêu đề "BÁO CÁO CHẤT LƯỢNG NHÂN LỰC", khối Ghi chú, hàng tìm kiếm (Loại cán bộ ·
   Tìm kiếm · Xuất excel), bảng tiêu đề BỐN tầng 28 cột + dòng đánh số cột (1)…(28); Tìm kiếm / đổi Loại cán bộ
   thì thêm MỘT dòng số liệu (xoá dòng cũ).
   Lời gọi: NS_HoSo/LayDanhSach (ums.nsBaoCao.goi — 32 tham số chép nguyên; pageSize 1000, strLoaiCanBo_Id = ô
   Loại cán bộ — danh mục NS.LHD0). Số liệu đếm ở MÁY KHÁCH, chép nguyên luật của gốc:
     Phụ nữ GIOITINH_MA "0" · Đảng viên NGAYCHINHTHUCVAODANGCSVN có giá trị · Dân tộc thiểu số DANTOC_MA ≠ "1" ·
     Tôn giáo TONGIAO_MA ≠ "KTG" · Chuyên môn LOAIHOCVI_MA TS / ThS, còn lại theo TRINHDOCHUYENMONCAONHAT_MA
     CN / CD / THPT / SC · Chính trị TRINHDOLYLUANCHINHTRI_MA 4 / 3 / 2 / 1 · Tin học TRINHDOTINHOC_MA 9 (trung cấp),
     4 / 6 (chứng chỉ) · Ngoại ngữ: TRINHDONGOAINGU_MA != "" → Anh văn chứng chỉ (ba ô ngoại ngữ còn lại luôn 0) ·
     Tuổi (TUOI): ≤30, 31–40, 41–50, 51–60, >60; nữ 51–55, nam 56–60.
   Giữ như gốc (nghi ngờ, ghi báo cáo): so TRINHDONGOAINGU_MA != "" nên dòng có giá trị null cũng được đếm là
     "Anh văn — chứng chỉ" (null != "" là đúng trong JS).
   Khác gốc: nút "Xuất excel" gốc KHÔNG có trình xử lý → nay xuất bảng đang hiện bằng ums.ui.xuatXls (tiêu đề
     ghép các tầng). Ô Loại cán bộ đặt ngay hàng tìm kiếm như gốc.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-chatluongnhanluc');
    if (!root || !ums.nsBaoCao) return;
    var ui = ums.ui, pat = ums.pat, B = ums.nsBaoCao;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var TD = 'Chia theo trình độ đào tạo', DT = 'Chia theo độ tuổi';
    var COT = [
        ['tong', 'Tổng số nhân lực hiện có', []],
        ['nu', 'Phụ nữ', ['Trong đó']], ['dang', 'Đảng viên', ['Trong đó']], ['dantoc', 'Dân tộc thiểu số', ['Trong đó']], ['tongiao', 'Tôn giáo', ['Trong đó']],
        ['cmTS', 'Tiến sỹ /CKII', [TD, 'Chuyên môn']], ['cmThS', 'Thạc sỹ /CKI', [TD, 'Chuyên môn']], ['cmDH', 'Đại học', [TD, 'Chuyên môn']],
        ['cmCD', 'Cao đẳng', [TD, 'Chuyên môn']], ['cmTH', 'Trung học', [TD, 'Chuyên môn']], ['cmSC', 'Sơ cấp', [TD, 'Chuyên môn']],
        ['ctCN', 'Cử nhân', [TD, 'Chính trị']], ['ctCC', 'Cao cấp', [TD, 'Chính trị']], ['ctTC', 'Trung cấp', [TD, 'Chính trị']], ['ctSC', 'Sơ cấp', [TD, 'Chính trị']],
        ['thTC', 'Trung cấp trở lên', [TD, 'Tin học']], ['thCC', 'Chứng chỉ', [TD, 'Tin học']],
        ['avDH', 'Đại học trở lên', [TD, 'Ngoại ngữ', 'Anh văn']], ['avCC', 'Chứng chỉ', [TD, 'Ngoại ngữ', 'Anh văn']],
        ['nkDH', ' ', [TD, 'Ngoại ngữ', 'Ngoại ngữ khác']], ['nkCC', 'Chứng chỉ', [TD, 'Ngoại ngữ', 'Ngoại ngữ khác']],
        ['t30', 'Từ 30 trở xuống', [DT]], ['t40', 'Từ 31 đến 40', [DT]], ['t50', 'Từ 41 đến 50', [DT]],
        ['t60', 'Tổng số', [DT, 'Từ 51 đến 60']], ['nu55', 'Nữ từ 51 đến 55', [DT, 'Từ 51 đến 60', 'Trong đó']], ['nam60', 'Nam từ 56 đến 60', [DT, 'Từ 51 đến 60', 'Trong đó']],
        ['huu', 'Trên tuổi nghỉ hưu', [DT]]
    ];
    var SO = { __so: true };
    COT.forEach(function (c, i) { SO[c[0]] = '(' + (i + 1) + ')'; });

    root.innerHTML = pat.page('Báo cáo chất lượng nhân lực') +
        B.ghiChu(["+ Nhấp chuột vào nút 'Tìm kiếm' xem kết quả", "+ Nhấp chuột vào dropdown 'Chọn loại cán bộ' để xem báo cáo theo loại",
            "+ Sử dụng button 'Xuất excel' để xuất báo cáo ra file excel"]) +
        pat.filterBar([{ key: 'loai', type: 'select', label: 'Chọn loại cán bộ' }], {
            extra: '<div class="ums-field ums-field--fit ums-u-flex1 ums-u-right">' + ui.btn('excel', { text: 'Xuất excel', attr: { 'data-a': 'excel' } }) + '</div>' }) +
        pat.panel({ title: 'Báo cáo chất lượng nhân lực', icon: 'fa-chart-simple', flush: true, zone: 'bang' });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var sLoai = root.querySelector('[data-f="loai"]');
    var dong = [SO];

    function ve() {
        ui.table({
            el: z('bang'), rows: dong, stt: false, rowCls: function (r) { return r.__so ? 'nsbc-so' : ''; },
            columns: COT.map(function (c) { return { title: c[1], group: c[2].length ? c[2] : undefined, cls: 'is-center', prop: c[0] }; })
        });
    }
    ve();

    ums.api.dm('NS.LHD0').then(function (r) { pat.fill(sLoai, r, { head: 'Chọn loại cán bộ' }); }).catch(function (err) { ums.api.handle(err, 'NS.LHD0'); });

    function dem(ds) {
        var k = {}; COT.forEach(function (c) { k[c[0]] = 0; });
        ds.forEach(function (x) {
            k.tong++;
            if (x.GIOITINH_MA == '0') k.nu++;
            if (!(x.NGAYCHINHTHUCVAODANGCSVN === '' || x.NGAYCHINHTHUCVAODANGCSVN === null || x.NGAYCHINHTHUCVAODANGCSVN === undefined)) k.dang++;
            if (x.DANTOC_MA != '1') k.dantoc++;
            if (x.TONGIAO_MA != 'KTG') k.tongiao++;
            if (x.LOAIHOCVI_MA == 'TS') k.cmTS++;
            else if (x.LOAIHOCVI_MA == 'ThS') k.cmThS++;
            else if (x.TRINHDOCHUYENMONCAONHAT_MA == 'CN') k.cmDH++;
            else if (x.TRINHDOCHUYENMONCAONHAT_MA == 'CD') k.cmCD++;
            else if (x.TRINHDOCHUYENMONCAONHAT_MA == 'THPT') k.cmTH++;
            else if (x.TRINHDOCHUYENMONCAONHAT_MA == 'SC') k.cmSC++;
            var ct = x.TRINHDOLYLUANCHINHTRI_MA;
            if (ct == '4') k.ctCN++; else if (ct == '3') k.ctCC++; else if (ct == '2') k.ctTC++; else if (ct == '1') k.ctSC++;
            if (x.TRINHDOTINHOC_MA == '9') k.thTC++; else if (x.TRINHDOTINHOC_MA == '4' || x.TRINHDOTINHOC_MA == '6') k.thCC++;
            if (x.TRINHDONGOAINGU_MA != '') k.avCC++;      // như gốc: null cũng tính (xem đầu tệp)
            var t = parseInt(x.TUOI, 10);
            if (t <= 30) k.t30++; else if (t >= 31 && t <= 40) k.t40++; else if (t >= 41 && t <= 50) k.t50++;
            else if (t >= 51 && t <= 60) k.t60++; else if (t > 60) k.huu++;
            if (x.GIOITINH_MA == '0') { if (t >= 51 && t <= 55) k.nu55++; }
            else if (x.GIOITINH_MA == '1') { if (t >= 56 && t <= 60) k.nam60++; }
        });
        return k;
    }
    function tim() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        B.goi({ pageSize: 1000, strLoaiCanBo_Id: sLoai.value }).then(function (ds) {
            dong = [SO, dem(ds)];
            ve();
        }).catch(function (err) { dong = [SO]; ve(); ums.api.handle(err, 'NS_HoSo/LayDanhSach'); });
    }
    function xuat() {
        var du = dong.filter(function (r) { return !r.__so; });
        if (!du.length) { ui.toast('Bấm Tìm kiếm để có số liệu trước khi xuất', 'warn'); return; }
        ui.xuatXls('BaoCaoChatLuongNhanLuc', { tieuDe: 'BÁO CÁO CHẤT LƯỢNG NHÂN LỰC',
            cot: COT.map(function (c) { return { title: c[2].concat([c[1].trim()]).filter(Boolean).join(' - '), prop: c[0] }; }), dong: du });
    }

    ui.enhance(root);
    jQuery(sLoai).on('select2:select select2:clear', tim);
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) tim();
        else if (ev.target.closest('[data-a="excel"]')) xuat();
    });
})();
