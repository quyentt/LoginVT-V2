/* =========================================================================
   Báo cáo tổng quan nhân lực (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/baocao/html/tongquannhanluc.html + script/tongquannhanluc.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (MỘT cột): tiêu đề "BÁO CÁO TỔNG QUAN NHÂN LỰC", khối Ghi chú, hàng tìm kiếm (Cơ cấu khoa/viện/
   phòng ban → Bộ môn · Tìm kiếm · Xuất excel), bảng tiêu đề HAI tầng — mỗi dòng một đơn vị: Tổng số, Giới tính
   (Nam, Nữ), Độ tuổi (Max, Min, TB), Chức danh nghề nghiệp (V.07.01.01/02/03), Học hàm (GS, PGS), Trình độ (TS, ThS,
   ĐH, Khác), Hệ số lương (Max, Min, TB), KL giờ giảng (Max, Min, Tổng), KL giờ NCKH (Max, Min, TB), Bài báo quốc tế
   (Max, Min, Tổng).
   Lời gọi: NS_HoSo/LayDanhSach (ums.nsBaoCao.goi — pageSize 10000, strChung_DonVi_Id = Bộ môn || Cơ cấu);
            edu.system.getList_CoCauToChuc → ums.ref.coCauToChuc (tách cha / con như gốc).
   Số liệu đếm ở MÁY KHÁCH, chép nguyên luật: GIOITINH_MA 1/0; TUOI; NGACHLUONG_MA V.07.01.01/02/03; LOAICHUCDANH_MA
   GS/PGS; LOAIHOCVI_MA TS/ThS, còn lại TRINHDOCHUYENMONCAONHAT_MA CN → ĐH, khác → Khác; HESOLUONG_HIENTAI;
   giờ giảng = SOGIOHODO + SOGIOCOTH + SOGIODIPH + SOGIOHDHD + SOGIOKHAC; SOLUONGBAIBAOQUOCTE. KL giờ NCKH gốc không
   tính (luôn 0) — giữ.
   Khác gốc (lỗi rõ, ghi báo cáo):
     · Gốc lặp theo me.arrCCTC_Cha_Id / arrCCTC_TheoCha_Id nhưng KHÔNG nơi nào điền hai mảng đó → bảng LUÔN RỖNG.
       Nay làm theo ý định: chưa chọn đơn vị → mỗi dòng một đơn vị CHA (nhân sự của đơn vị cha + đơn vị con,
       tên lấy DAOTAO_COCAUTOCHUC_CHA / DAOTAO_COCAUTOCHUC như gốc); đã chọn → mỗi dòng một đơn vị trong phạm vi chọn
       (Bộ môn đã chọn; hoặc Cơ cấu cha + các bộ môn của nó).
     · TUOI / giờ giảng / số bài báo rỗng: gốc vẫn đếm (parseInt → NaN làm hỏng Max/Min/TB) → nay bỏ qua giá trị không
       phải số. Giờ giảng gốc cộng CHUỖI rồi parseFloat — nay cộng số.
     · Gốc bấm Tìm kiếm là THÊM dòng (không xoá bảng cũ) → nay vẽ lại.
     · Nút "Xuất excel" gốc không có trình xử lý → nay ums.ui.xuatXls bảng đang hiện.
   Ô cha → con: Cơ cấu → Bộ môn (ums.pat.chain — gốc nạp sẵn mọi bộ môn khi chưa chọn cơ cấu).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-tongquannhanluc');
    if (!root || !ums.nsBaoCao) return;
    var ui = ums.ui, pat = ums.pat, B = ums.nsBaoCao;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function so(v) { if (v === null || v === undefined || v === '') return null; var n = Number(v); return isNaN(n) ? null : n; }

    var COT = [
        ['ten', 'Tên đơn vị', [], 'nsbc-ten'], ['tong', 'Tổng số', []],
        ['nam', 'Nam', ['Giới tính']], ['nu', 'Nữ', ['Giới tính']],
        ['tuoiMax', 'Max', ['Độ tuổi']], ['tuoiMin', 'Min', ['Độ tuổi']], ['tuoiTB', 'Trung bình', ['Độ tuổi']],
        ['v1', 'Giảng viên cao cấp (V.07.01.01)', ['Chức danh nghề nghiệp']], ['v2', 'Giảng viên chính (V.07.01.02)', ['Chức danh nghề nghiệp']],
        ['v3', 'Giảng viên (V.07.01.03)', ['Chức danh nghề nghiệp']],
        ['gs', 'Giáo sư', ['Học hàm']], ['pgs', 'Phó giáo sư', ['Học hàm']],
        ['ts', 'Tiến sĩ', ['Trình độ']], ['ths', 'Thạc sĩ', ['Trình độ']], ['dh', 'Đại học', ['Trình độ']], ['khac', 'Khác', ['Trình độ']],
        ['hslMax', 'Max', ['Hệ số lương']], ['hslMin', 'Min', ['Hệ số lương']], ['hslTB', 'Trung bình', ['Hệ số lương']],
        ['ggMax', 'Max', ['Khối lượng giờ giảng (giờ)']], ['ggMin', 'Min', ['Khối lượng giờ giảng (giờ)']], ['ggTong', 'Tổng cộng', ['Khối lượng giờ giảng (giờ)']],
        ['nkMax', 'Max', ['Khối lượng giờ nghiên cứu khoa học (giờ)']], ['nkMin', 'Min', ['Khối lượng giờ nghiên cứu khoa học (giờ)']],
        ['nkTong', 'Trung bình', ['Khối lượng giờ nghiên cứu khoa học (giờ)']],
        ['bbMax', 'Max', ['Số lượng bài báo quốc tế (bài)']], ['bbMin', 'Min', ['Số lượng bài báo quốc tế (bài)']], ['bbTong', 'Tổng cộng', ['Số lượng bài báo quốc tế (bài)']]
    ];

    root.innerHTML = pat.page('Báo cáo tổng quan nhân lực') +
        B.ghiChu(["+ Nhấp chuột vào nút 'Tìm kiếm' xem kết quả", "+ Nhấp chuột vào combobox 'Chọn cơ cấu tổ chức' để xem báo cáo theo đơn vị",
            "+ Nhấp chuột vào nút 'Xuất excel' để xuất báo cáo ra file excel"]) +
        pat.filterBar([{ key: 'cctc', type: 'select', label: 'Chọn cơ cấu khoa/viện/phòng ban' }, { key: 'bomon', type: 'select', label: 'Chọn bộ môn' }], {
            extra: '<div class="ums-field ums-field--fit ums-u-flex1 ums-u-right">' + ui.btn('excel', { text: 'Xuất excel', attr: { 'data-a': 'excel' } }) + '</div>' }) +
        pat.panel({ title: 'Báo cáo tổng quan nhân lực', icon: 'fa-chart-simple', flush: true, zone: 'bang',
            body: ui.empty("Bấm 'Tìm kiếm' để xem kết quả", 'fa-magnifying-glass') });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var sCC = root.querySelector('[data-f="cctc"]'), sBM = root.querySelector('[data-f="bomon"]');
    var S = { cha: [], con: [], dong: [] };

    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }).then(function (rows) {
        S.cha = rows.filter(function (r) { return !r.DAOTAO_COCAUTOCHUC_CHA_ID; });
        S.con = rows.filter(function (r) { return !!r.DAOTAO_COCAUTOCHUC_CHA_ID; });
        pat.fill(sCC, S.cha, { head: 'Chọn cơ cấu khoa/viện/phòng ban' });
    }).catch(function (err) { ums.api.handle(err, 'getList_CoCauToChuc'); });
    ui.enhance(root);
    jQuery(sCC).on('select2:select select2:clear', function () {
        pat.fill(sBM, S.con.filter(function (r) { return r.DAOTAO_COCAUTOCHUC_CHA_ID === sCC.value; }), { head: 'Chọn bộ môn' });
    });
    pat.chain([sCC, sBM], { phatLai: false });

    /* Một dòng báo cáo từ các hồ sơ của một đơn vị */
    function tongHop(ten, ds) {
        var k = { ten: ten, tong: ds.length, nam: 0, nu: 0, v1: 0, v2: 0, v3: 0, gs: 0, pgs: 0, ts: 0, ths: 0, dh: 0, khac: 0, nkMax: 0, nkMin: 0, nkTong: 0 };
        var tuoi = [], hsl = [], gg = [], bb = [];
        ds.forEach(function (x) {
            if (x.GIOITINH_MA == '0') k.nu++; else if (x.GIOITINH_MA == '1') k.nam++;
            var t = parseInt(x.TUOI, 10); if (!isNaN(t)) tuoi.push(t);
            if (x.NGACHLUONG_MA == 'V.07.01.01') k.v1++; else if (x.NGACHLUONG_MA == 'V.07.01.02') k.v2++; else if (x.NGACHLUONG_MA == 'V.07.01.03') k.v3++;
            if (x.LOAICHUCDANH_MA == 'GS') k.gs++; else if (x.LOAICHUCDANH_MA == 'PGS') k.pgs++;
            if (x.LOAIHOCVI_MA == 'TS') k.ts++; else if (x.LOAIHOCVI_MA == 'ThS') k.ths++;
            else if (x.TRINHDOCHUYENMONCAONHAT_MA == 'CN') k.dh++; else k.khac++;
            var h = so(x.HESOLUONG_HIENTAI); if (h !== null) hsl.push(h);
            var gio = ['SOGIOHODO', 'SOGIOCOTH', 'SOGIODIPH', 'SOGIOHDHD', 'SOGIOKHAC'].map(function (c) { return so(x[c]); });
            if (gio.some(function (g) { return g !== null; })) gg.push(gio.reduce(function (a, g) { return a + (g || 0); }, 0));
            var b = so(x.SOLUONGBAIBAOQUOCTE); if (b !== null) bb.push(b);
        });
        function mm(a) { return a.length ? { max: Math.max.apply(null, a), min: Math.min.apply(null, a), tong: a.reduce(function (s, v) { return s + v; }, 0) } : { max: 0, min: 0, tong: 0 }; }
        var a = mm(tuoi), b2 = mm(hsl), c = mm(gg), d = mm(bb);
        k.tuoiMax = a.max; k.tuoiMin = a.min; k.tuoiTB = (tuoi.length ? a.tong / tuoi.length : 0).toFixed(2);
        k.hslMax = b2.max; k.hslMin = b2.min; k.hslTB = (hsl.length ? b2.tong / hsl.length : 0).toFixed(2);
        k.ggMax = c.max; k.ggMin = c.min; k.ggTong = c.tong.toFixed(2);
        k.bbMax = d.max; k.bbMin = d.min; k.bbTong = d.tong;
        return k;
    }
    function tim() {
        var dv = sBM.value || sCC.value;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        B.goi({ pageSize: 10000, strChung_DonVi_Id: dv }).then(function (ds) {
            var dong = [];
            if (!dv) {
                S.cha.forEach(function (p) {
                    var cua = ds.filter(function (x) { return x.DAOTAO_COCAUTOCHUC_CHA_ID == p.ID || x.DAOTAO_COCAUTOCHUC_ID == p.ID; });
                    var ten = e(p.TEN);
                    cua.forEach(function (x) { ten = x.DAOTAO_COCAUTOCHUC_CHA ? e(x.DAOTAO_COCAUTOCHUC_CHA) : e(x.DAOTAO_COCAUTOCHUC) || ten; });
                    dong.push(tongHop(ten, cua));
                });
            } else {
                var dsDv = sBM.value ? S.con.filter(function (r) { return r.ID === sBM.value; })
                    : S.cha.filter(function (r) { return r.ID === sCC.value; }).concat(S.con.filter(function (r) { return r.DAOTAO_COCAUTOCHUC_CHA_ID === sCC.value; }));
                dsDv.forEach(function (u) {
                    var cua = ds.filter(function (x) { return x.DAOTAO_COCAUTOCHUC_ID == u.ID; });
                    dong.push(tongHop(cua.length ? e(cua[cua.length - 1].DAOTAO_COCAUTOCHUC) || e(u.TEN) : e(u.TEN), cua));
                });
            }
            S.dong = dong;
            ui.table({ el: z('bang'), rows: dong, empty: 'Không có số liệu',
                columns: COT.map(function (c) { return { title: c[1], group: c[2].length ? c[2] : undefined, cls: c[3] || 'is-center', prop: c[0] }; }) });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'NS_HoSo/LayDanhSach'); });
    }
    function xuat() {
        if (!S.dong.length) { ui.toast('Bấm Tìm kiếm để có số liệu trước khi xuất', 'warn'); return; }
        ui.xuatXls('BaoCaoTongQuanNhanLuc', { tieuDe: 'BÁO CÁO TỔNG QUAN NHÂN LỰC',
            cot: [{ title: 'Stt', get: function (r, i) { return i + 1; } }].concat(COT.map(function (c) { return { title: c[2].concat([c[1]]).join(' - '), prop: c[0] }; })),
            dong: S.dong });
    }
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) tim();
        else if (ev.target.closest('[data-a="excel"]')) xuat();
    });
})();
