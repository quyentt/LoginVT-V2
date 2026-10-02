/* =========================================================================
   Thống kê tiến độ nhập điểm — khung chung của hai màn (ums.tkNhapDiem)
   Bản gốc: ApisCongCanBo/Modules/thongke/script/nhapdiemhocphan.js — MỘT tệp .js
   cho hai html: nhapdiemhocphan.html (theo HỌC PHẦN) và nhapdiemlophocphan.html
   (theo LỚP HỌC PHẦN — nhận ra bằng nút #btnSearchLop có trên màn).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       TP_ToChucThi/LayDSDangKy_KeHoachDangKy   GET  ô Kế hoạch (pageSize 10000)
       TP_ToChucThi/LayDSKhoaQLTheoKeHoach      GET  ô Khoa quản lý (chỉ màn lớp HP)
       TP_ToChucThi/LayDSHocPhanTheoKeHoach     GET  ô Học phần — theo kế hoạch + khoa quản lý ("MA - TEN")
       TP_Chung/LayDotThi                       GET  ô Đợt thi (chỉ màn lớp HP; ba tham số đọc ô không có → rỗng)
       "Tìm kiếm":
         TP_ToChucThi/LayDSLoaiDiemTheoKeHoach  GET  các cột loại điểm (mỗi loại hai cột SL | Tỷ lệ %)
         TP_ToChucThi/LayDSLopHocPhanTatCa      (lớp HP) | LayDSHocPhanTheoKeHoach2 (học phần)
         TP_ToChucThi/LayTTTienDoNhapDiemTheoLopHP | …TheoHP — MỖI Ô một lời gọi (như gốc); bỏ giá trị "x"
   Mẫu báo cáo: strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDangKy_KeHoachDangKy_Id, strDaoTao_KhoaQuanLy_Id,
   và strHinhThucThi_Id / strDaoTao_ThoiGianDaoTao_Id / strDiem_ThanhPhanDiem_Id / strHoanThanhNhapDiem_Id
   (bản gốc đọc ô không có trên màn → gửi rỗng).
   Theo luật chung: chưa chọn Kế hoạch thì khoá Khoa quản lý và Học phần.
   ---------------------------------------------------------------------------
   (+) 2026-09-25 — cờ cho bản anh em của phân hệ Quản lý điểm, MẶC ĐỊNH giữ nguyên
   hành vi Cổng cán bộ ở trên:
       ums.tkNhapDiem(root, lop, { qld: true })
   Bản gốc ApisQuanLyDiem/Modules/thongke/script/nhapdiemhocphan.js lệch bản Cổng cán bộ:
     · Kế hoạch và Khoa quản lý là ô chọn NHIỀU (gửi "a,b" như getValById);
     · thêm ô "Chọn lọc" (danh mục DIEM.TRANGTHAILOC, giá trị = MA) — cả hai màn;
     · danh sách gọi bản MÃ HOÁ: XLHV_TP_ToChucThi_MH/… + func pkg_thi_tochucthi.LayDSLopHocPhanTatCa
       | LayDSHocPhanTheoKeHoach2, POST;
     · Đợt thi nạp lại theo Kế hoạch (strDaoTao_ThoiGianDaoTao_Id = ô Kế hoạch — chép nguyên)
       → luật cha → con: chưa chọn Kế hoạch thì khoá Đợt thi;
     · nút của màn lớp HP ghi "Tìm kiếm LHP".
   Hàm vẽ bảng tách ra ums.tkNhapDiem.bang(...) để màn "Tiến độ nhập điểm khoá học" (QLD) dùng lại.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var T = 'TP_ToChucThi/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    /* Bảng tiến độ: cột tĩnh COT + mỗi loại điểm hai cột SL | Tỷ lệ %, rồi MỖI Ô một lời gọi.
       goiO(h, c) → tham số lời gọi của ô (dòng h, loại điểm c). */
    function veBang(host, rows, cot, COT, goiO) {
        var dong = COT.concat([].concat.apply([], cot.map(function (c) {
            return [
                { title: 'SL', group: [e(c.TEN)], cls: 'is-center', render: function (r, i) { return '<span data-sl="' + i + '|' + esc(c.ID) + '"></span>'; } },
                { title: 'Tỷ lệ %', group: [e(c.TEN)], cls: 'is-center', render: function (r, i) { return '<span data-tl="' + i + '|' + esc(c.ID) + '"></span>'; } }
            ];
        })));
        ui.table({ el: host, rows: rows, empty: 'Không có dữ liệu', columns: dong });
        rows.forEach(function (h, i) {
            cot.forEach(function (c) {
                ums.api.call(Object.assign({ method: 'GET', silent: true }, goiO(h, c))).then(function (x) {
                    arr(x.data).forEach(function (d) {
                        if (d.SOSV === 'x' || d.TYLE === 'x') return;
                        var a = host.querySelector('[data-sl="' + i + '|' + c.ID + '"]'), b = host.querySelector('[data-tl="' + i + '|' + c.ID + '"]');
                        if (a) a.textContent = e(d.SOSV); if (b) b.textContent = e(d.TYLE);
                    });
                }).catch(function () {});
            });
        });
    }

    ums.tkNhapDiem = function (root, lop, opt) {
        opt = opt || {};
        var qld = !!opt.qld;
        var loc = [{ key: 'kh', label: 'Chọn kế hoạch', type: 'select', multiple: qld }];
        if (lop) loc.push({ key: 'kql', label: 'Chọn khoa quản lý', type: 'select', multiple: qld });
        loc.push({ key: 'hp', label: 'Chọn học phần', type: 'select' });
        if (lop) loc.push({ key: 'dot', label: 'Chọn đợt thi', type: 'select' });
        if (qld) loc.push({ key: 'ht', label: 'Chọn lọc', type: 'select' });
        loc.push({ key: 'q', label: 'Nhập từ khóa tìm kiếm' });
        root.innerHTML = pat.page(lop ? 'Tiến độ nhập điểm lớp học phần' : 'Tiến độ nhập điểm học phần', '<div data-z="bc"></div>') +
            pat.filterBar(loc, { searchText: qld && lop ? 'Tìm kiếm LHP' : undefined }) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang' });
        ui.enhance(root);
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function v(k) { return pat.val(f(k)); }       // ô chọn nhiều → "a,b" như edu.util.getValById

        function napHP() {
            return ums.api.call({ action: T + 'LayDSHocPhanTheoKeHoach', method: 'GET', strDaoTao_KhoaQuanLy_Id: v('kql'), strDangKy_KeHoachDangKy_Id: v('kh'), silent: true })
                .then(function (r) { pat.fill(f('hp'), arr(r.data), { name: function (x) { return e(x.MA) + ' - ' + e(x.TEN); } }); }).catch(function (err) { ums.api.handle(err, 'học phần'); });
        }
        function napKQL() {
            return ums.api.call({ action: T + 'LayDSKhoaQLTheoKeHoach', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: '', strDangKy_KeHoachDangKy_Id: v('kh'), silent: true })
                .then(function (r) { pat.fill(f('kql'), arr(r.data), { name: 'DAOTAO_KHOAQUANLY_TEN' }); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
        }
        function napDot() {
            return ums.api.call({ action: 'TP_Chung/LayDotThi', method: 'GET', strHinhThucThi_Id: '', strDiem_ThanhPhanDiem_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: qld ? v('kh') : '', strNguoiThucHien_Id: uid(), silent: true })
                .then(function (r) { pat.fill(f('dot'), arr(r.data), { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'đợt thi'); });
        }
        ums.api.call({ action: T + 'LayDSDangKy_KeHoachDangKy', method: 'GET', strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 10000, silent: true })
            .then(function (r) { pat.fill(f('kh'), arr(r.data), { name: 'TENKEHOACH' }); }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
        if (lop && !qld) napDot();
        if (qld) ums.api.dm('DIEM.TRANGTHAILOC').then(function (d) { pat.fill(f('ht'), d, { id: 'MA', name: 'TEN', head: 'Chọn lọc' }); }).catch(function () {});
        if (window.jQuery) {
            /* Ô chọn nhiều: bỏ một mục (unselect) cũng là đổi cha → nạp lại con */
            jQuery(f('kh')).on(qld ? 'select2:select select2:unselect select2:clear' : 'select2:select', function () {
                if (qld && !v('kh')) return;            // xoá hết kế hoạch: pat.chain đã khoá + xoá trắng con
                napHP(); if (lop) napKQL(); if (lop && qld) napDot();
            });
            if (lop) jQuery(f('kql')).on('select2:select select2:clear' + (qld ? ' select2:unselect' : ''), function () { pat.fill(f('hp'), [], {}); napHP(); });
        }
        ums.pat.chain([f('kh'), f('hp')], { phatLai: false });
        if (lop) ums.pat.chain([f('kh'), f('kql')], { phatLai: false });
        if (lop && qld) ums.pat.chain([f('kh'), f('dot')], { phatLai: false });

        var COT = lop ? [
            { title: 'Mã lớp học phần', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'TENLOP' },
            { title: 'Số TC', prop: 'DAOTAO_HOCPHAN_SOTIN', cls: 'is-center' }, { title: 'Số SV', prop: 'SOSV', cls: 'is-center' },
            { title: 'Giảng viên dạy', prop: 'DSGIANGVIEN' }, { title: 'Khoa chuyên môn', prop: 'DONVIPHUTRACHHOCPHAN_TEN' },
            { title: 'Công thức điểm', prop: 'CONGTHUC' }, { title: 'Hạn nộp điểm', prop: 'HANNOPDIEM', cls: 'is-center is-nowrap' },
            { title: 'Đợt thi', prop: 'DOTTHI_TEN' }, { title: 'Tỷ lệ % TKHP', prop: 'TYLEHOANTHANHTKHP', cls: 'is-center' }
        ] : [
            { title: 'Mã học phần', prop: 'MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'TEN' },
            { title: 'Số TC', prop: 'HOCTRINH', cls: 'is-center' }, { title: 'Số SV', prop: 'SOSV', cls: 'is-center' },
            { title: 'Khoa chuyên môn', prop: 'DONVIPHUTRACHHOCPHAN_TEN' }, { title: 'Công thức điểm', prop: 'CONGTHUC' },
            { title: 'Tỷ lệ % TKHP', prop: 'TYLEHOANTHANHTKHP', cls: 'is-center' }
        ];
        function goiDs() {
            var p = { strTuKhoa: f('q').value.trim(), strDangKy_KeHoachDangKy_Id: v('kh'), strDaoTao_KhoaQuanLy_Id: v('kql'),
                strDaoTao_HocPhan_Id: v('hp'), strThi_DotThi_Id: v('dot'), strNguoiThucHien_Id: uid() };
            if (!qld) return Object.assign({ action: T + (lop ? 'LayDSLopHocPhanTatCa' : 'LayDSHocPhanTheoKeHoach2'), method: 'GET' }, p);
            /* Bản gốc QLD gửi dLocKhongHoanThanhNhapDiem = edu.system.getValById('txtAAAA') (ô không tồn tại → khoá bị bỏ)
               trong khi ô "Chọn lọc" nằm ngay trên màn mà không đi đâu ngoài báo cáo. Làm theo ý định — như bản
               "khoá học" cùng phân hệ: gửi giá trị ô lọc, để trống thì không gửi. */
            return Object.assign({
                action: lop ? 'XLHV_TP_ToChucThi_MH/DSA4BRINLjEJLiIRKSAvFSA1AiAP' : 'XLHV_TP_ToChucThi_MH/DSA4BRIJLiIRKSAvFSkkLgokCS4gIilz',
                func: lop ? 'pkg_thi_tochucthi.LayDSLopHocPhanTatCa' : 'pkg_thi_tochucthi.LayDSHocPhanTheoKeHoach2',
                method: 'POST', dLocKhongHoanThanhNhapDiem: v('ht') || undefined
            }, p);
        }
        function tim() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: T + 'LayDSLoaiDiemTheoKeHoach', method: 'GET', strDangKy_KeHoachDangKy_Id: v('kh'), strDaoTao_HocPhan_Id: v('hp'), strNguoiThucHien_Id: uid() }).then(function (r) {
                var cot = arr(r.data);
                return ums.api.call(goiDs()).then(function (x) { ve(arr(x.data), cot); });
            }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tiến độ nhập điểm'); });
        }
        function ve(rows, cot) {
            z('n').textContent = '(' + rows.length + ')';
            veBang(z('bang'), rows, cot, COT, function (h, c) {
                return { action: T + (lop ? 'LayTTTienDoNhapDiemTheoLopHP' : 'LayTTTienDoNhapDiemTheoHP'),
                    strDangKy_KeHoachDangKy_Id: v('kh'), strDaoTao_LopHocPhan_Id: h.ID, strDiem_ThanhPhanDiem_Id: c.ID, strNguoiThucHien_Id: uid(),
                    strCongThucDiem: e(h.CONGTHUC), strDaoTao_HocPhan_Id: h.ID };
            });
        }
        ums.report.mount(z('bc'), { collect: function (add) {
            add('strThi_DotThi_Id', v('dot')); add('strDaoTao_HocPhan_Id', v('hp')); add('strDangKy_KeHoachDangKy_Id', v('kh'));
            add('strDaoTao_KhoaQuanLy_Id', v('kql')); add('strHinhThucThi_Id', ''); add('strDaoTao_ThoiGianDaoTao_Id', '');
            add('strDiem_ThanhPhanDiem_Id', ''); add('strHoanThanhNhapDiem_Id', qld ? v('ht') : '');
        } });
        root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) tim(); });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
        z('bang').innerHTML = ui.empty('Chọn kế hoạch rồi bấm Tìm kiếm', 'fa-filter');
    };
    ums.tkNhapDiem.bang = veBang;
})();
