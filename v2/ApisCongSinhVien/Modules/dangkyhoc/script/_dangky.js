/* =========================================================================
   _dangky — phần dùng chung của hai màn Cổng sinh viên › Đăng ký học:
   dangky (Đăng ký học) và tracuu (Kết quả đăng ký học).  ums.dky.*
   ---------------------------------------------------------------------------
   ums.dky.xorB64(chuoi, khoa)   = edu.system.atob (Core/systemroot.js:9409): XOR từng
                                   ký tự với khoá rồi base64 — hai màn gửi lời GHI
                                   (DKH_DangKyMH/*) dạng { strVal: xorB64(JSON, "chaolong") }
                                   như bản gốc. (gọi thẳng ums.util.xorB64 ở tầng chung
                                   — api.js; giữ tên cũ cho mã trong module.)
   ums.dky.uuid()                = edu.util.uuid (Core/util.js:1676), 32 ký tự hex
   ums.dky.the(r, o)             nội dung MỘT thẻ lớp học phần (khung .ums-card của pat.cards)
   ums.dky.ketQua(host, ds, o)   kết quả đăng ký nhóm theo học phần ("Môn …"), mỗi môn một
                                   khung, mỗi lớp một thẻ — genList_KetQuaDangKy của hai màn
   ums.dky.lich(o, lop, ten)     hộp "Chi tiết - <lớp>" (getList_LichTuanTheoLopHocPhan)
   ums.dky.diemDanh(lop, ten)    hộp "Kết quả điểm danh" (getList_DiemDanh)
   ums.dky.diemQuaTrinh(lop, ten) hộp "Điểm quá trình" (getList_DiemQuaTrinh)
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums, ui = ums.ui, pat = ums.pat;
    var D = ums.dky = {};

    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    D.e = e;
    D.arr = function (d) { return Array.isArray(d) ? d : []; };
    D.uid = function () { return (ums.session && ums.session.userId) || ''; };
    /* Tiền hiển thị kiểu edu.util.formatCurrency (dấu phẩy ngăn nghìn) */
    D.tien = function (v) { return e(v) === '' ? '' : pat.money(v); };

    D.xorB64 = function (chuoi, khoa) { return ums.util.xorB64(chuoi, khoa); };
    /* Đọc ngược (chỉ dữ liệu mẫu dùng — máy chủ tự giải) */
    D.unXor = function (b64, khoa) { return ums.util.unXor(b64, khoa); };
    D.uuid = function () { return ums.util.uuid(); };

    /** Nút nhỏ trong thẻ: D.nut('primary', 'Đăng ký', { 'data-dk': 3 }, disabled) */
    D.nut = function (mod, text, attr, tat) {
        var a = '';
        Object.keys(attr || {}).forEach(function (k) { a += ' ' + k + '="' + esc(attr[k]) + '"'; });
        return '<button type="button" class="ums-btn ums-btn--sm ums-btn--' + mod + '"' + a + (tat ? ' disabled' : '') + '><span>' + esc(text) + '</span></button>';
    };

    /**
     * Nội dung một thẻ lớp học phần.
     * o = { ten: attr của tiêu đề bấm được (hoặc null), dong: ['chữ', …] (mỗi dòng một <li>), gia }
     */
    D.the = function (r, o) {
        o = o || {};
        var tieuDe = o.ten
            ? '<a href="javascript:void(0)" class="ums-card__no dky-the__ten"' + Object.keys(o.ten).map(function (k) { return ' ' + k + '="' + esc(o.ten[k]) + '"'; }).join('') + '>' + esc(r.TENLOP || r.DANGKY_LOPHOCPHAN_TEN) + '</a>'
            : '<span class="ums-card__no dky-the__ten">' + esc(r.TENLOP || r.DANGKY_LOPHOCPHAN_TEN) + '</span>';
        return tieuDe + (o.dau || '') +
            '<ul class="dky-the__dong">' + (o.dong || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
            '<div class="dky-the__gia"><b>' + esc(D.tien(o.gia)) + '</b> đ</div>';
    };

    /** Một thẻ có nút — cùng khung .ums-card--acts mà pat.cards dựng (dùng khi cần một thẻ lẻ) */
    D.theHtml = function (body, acts) {
        return '<div class="ums-card ums-card--acts"><div class="ums-card__body">' + body + '</div>' +
            (acts ? '<div class="ums-card__acts">' + acts + '</div>' : '') + '</div>';
    };

    /**
     * Kết quả đăng ký nhóm theo học phần — genList_KetQuaDangKy (dangky.js:928 / tracuu.js:211).
     * o = { tools(dòngĐầuMôn) → HTML nút ở đầu khung môn, actions(r, i) → HTML nút trong thẻ,
     *       tenAttr(r, i) → attr của tiêu đề thẻ, empty }
     * Chỉ số i là chỉ số trong `ds` (để màn tra lại dòng).
     */
    D.ketQua = function (host, ds, o) {
        o = o || {};
        if (!ds.length) { host.innerHTML = ui.empty(o.empty || 'Chưa có kết quả đăng ký'); return; }
        var nhom = [];
        ds.forEach(function (r, i) {
            var g = nhom[nhom.length - 1];
            // Bản gốc gom theo thứ tự trả về: đổi DAOTAO_HOCPHAN_ID là mở nhóm mới
            if (!g || g.hp !== r.DAOTAO_HOCPHAN_ID) nhom.push(g = { hp: r.DAOTAO_HOCPHAN_ID, dau: r, ds: [] });
            g.ds.push({ r: r, i: i });
        });
        /* Xếp kiểu masonry như bản gốc: mỗi MÔN là một khối, các khối xếp thành
           cột (gốc .subject-item width 25% + jQuery Masonry — dangky.js:266/942,
           tracuu.js:225). Ở đây dùng cột CSS: khối cao thấp khác nhau vẫn khít,
           không cần thư viện và không phải tính lại khi đổi kích thước. */
        host.innerHTML = '<div class="dky-masonry">' + nhom.map(function (g, k) {
            /* Màu khối: bản gốc tô nền theo VỊ TRÍ khối, lặp 10 màu (.subject-item:nth-child,
               assets/assettracuuvanbang/css/register-school.css:684) — không lấy từ dữ liệu
               (biến `mau` trong dangky.js:950 / tracuu.js:233 tính rồi bỏ, không dùng). */
            return pat.panel({ title: 'Môn ' + e(g.dau.DAOTAO_HOCPHAN_TEN), icon: 'fa-book', tools: o.tools ? o.tools(g.dau) : '',
                cls: 'dky-mon dky-mon--' + (k % 10 + 1), flush: true, zone: 'mon' + k });
        }).join('') + '</div>';
        nhom.forEach(function (g, k) {
            pat.cards({
                el: host.querySelector('[data-z="mon' + k + '"]'), items: g.ds,
                render: function (x) {
                    var r = x.r;
                    return D.the(r, {
                        ten: o.tenAttr ? o.tenAttr(r, x.i) : null,
                        dong: [e(r.THUOCTINHLOP_TEN), 'Tổng số: ' + e(r.SOLUONGDUKIENHOC), 'Đã đăng ký: ' + e(r.SOTHUCTEDANGKYHOC),
                               e(r.NGAYBATDAU) + ' - ' + e(r.NGAYKETTHUC), 'Thứ: ' + e(r.THUHOC)],
                        gia: r.PHISAUKHITRUMIEN
                    });
                },
                actions: function (x) { return o.actions ? o.actions(x.r, x.i) : ''; }
            });
        });
    };

    /* Hộp có một bảng, nạp sau khi mở */
    function hopBang(tieuDe, icon, size, goi, cot, sau) {
        var dlg = ui.dialog({ title: tieuDe, icon: icon, size: size, body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-x="bang"]');
        ums.api.call(goi).then(function (r) {
            var rows = D.arr(r.data);
            ui.table({ el: h, rows: rows, columns: cot, empty: 'Không có dữ liệu' });
            if (sau) sau(rows, dlg);
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, tieuDe); });
        return dlg;
    }

    /**
     * Hộp "Chi tiết - <lớp>" — lịch tuần theo lớp học phần.
     * o = { action, func, them: tham số thêm, gioPhut: true → hai cột "Giờ, phút bắt đầu/kết thúc" }
     */
    D.lich = function (o, lopId, ten) {
        var cot = [
            { title: 'Buổi học', prop: 'BUOIHOC' },
            { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
            { title: 'Thứ', prop: 'THUHOC', cls: 'is-center' },
            { title: 'Số tiết', prop: 'SOTIET', cls: 'is-center' },
            { title: 'Tiết bắt đầu', prop: 'TIETBATDAU', cls: 'is-center' },
            { title: 'Tiết kết thúc', prop: 'TIETKETTHUC', cls: 'is-center' }
        ];
        if (o.gioPhut) {
            cot.push({ title: 'Giờ, phút bắt đầu', cls: 'is-center', render: function (r) { return esc(e(r.GIOBATDAU) + ':' + e(r.PHUTBATDAU)); } },
                     { title: 'Giờ, phút kết thúc', cls: 'is-center', render: function (r) { return esc(e(r.GIOKETTHUC) + ':' + e(r.PHUTKETTHUC)); } });
        }
        cot.push({ title: 'Phòng học', prop: 'PHONGHOC_TEN' }, { title: 'Giảng viên', prop: 'GIANGVIEN' }, { title: 'Kiểu học', prop: 'THUOCTINH_TEN' });
        return hopBang('Chi tiết - ' + e(ten), 'fa-calendar-days', 'xl',
            Object.assign({ action: o.action, func: o.func, strNguoiThucHien_Id: D.uid(), strQLSV_NguoiHoc_Id: D.uid(), strDangKy_LopHocPhan_Id: lopId }, o.them || {}), cot);
    };

    /** Hộp "Kết quả điểm danh: <lớp> - <tình trạng duyệt dự thi>" */
    D.diemDanh = function (lopId, ten) {
        return hopBang('Kết quả điểm danh: ' + e(ten), 'fa-user-check', 'lg', {
            action: 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLAUgLykP', func: 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemDanh',
            strNguoiThucHien_Id: D.uid(), strQLSV_NguoiHoc_Id: D.uid(), strDaoTao_LopHocPhan_Id: lopId
        }, [
            { title: 'Ngày học', prop: 'NGAYGHINHAN', cls: 'is-center is-nowrap' },
            { title: 'Tiết bắt đầu → Tiết kết thúc', cls: 'is-center', render: function (r) { return esc(e(r.TIETBATDAU)) + ' <i class="fa-light fa-arrow-right"></i> ' + esc(e(r.TIETKETTHUC)); } },
            { title: 'Trạng thái', prop: 'KIEUCHUYENCAN_TEN', cls: 'is-center' },
            { title: 'Số tiết', prop: 'SOLUONG', cls: 'is-center' }
        ], function (rows, dlg) {
            // Tình trạng duyệt dự thi của dòng đầu, chữ cam cạnh tên lớp (như gốc)
            if (!rows.length || !rows[0].TINHTRANGDUYETDKTHI_TEN) return;
            var t = dlg.el.querySelector('.ums-dialog__title');
            if (t) t.insertAdjacentHTML('beforeend', ' - <span class="dky-tinhtrang">' + esc(rows[0].TINHTRANGDUYETDKTHI_TEN) + '</span>');
        });
    };

    /** Hộp "Điểm quá trình: <lớp>" */
    D.diemQuaTrinh = function (lopId, ten) {
        return hopBang('Điểm quá trình: ' + e(ten), 'fa-list-check', 'md', {
            action: 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLBA0IBUzKC8p', func: 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemQuaTrinh',
            strNguoiThucHien_Id: D.uid(), strQLSV_NguoiHoc_Id: D.uid(), strDaoTao_LopHocPhan_Id: lopId
        }, [
            { title: 'Loại điểm', prop: 'DIEM_THANHPHANDIEM_TEN' },
            { title: 'Kết quả', prop: 'DIEM', cls: 'is-center' }
        ]);
    };
})(window);
