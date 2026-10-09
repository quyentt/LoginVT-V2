/* =========================================================================
   Nhập học — phần dùng chung của nhóm THỐNG KÊ / BÁO CÁO   (ums.nhTk)
   Dùng ở: thongke/lephinhaphoc, thongke/sinhviennhaphoc,
           baocaothongke/baocao, baocaothongke/baocaosinhvien (nạp chéo tệp này).
   ---------------------------------------------------------------------------
   Bốn màn gốc chép nhau cùng một bộ lọc:
       Kế hoạch nhập học → Chương trình đào tạo → Lớp quản lý   (nối tầng)
       Loại khoản thu · Cơ sở đào tạo · Từ ngày · Đến ngày · (Từ khoá)
   và cùng một đoạn addKeyValue khi xuất báo cáo. Gom về đây.

   Lời gọi — chép nguyên bản gốc:
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP
         func PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (POST, strNguoiThucHien_Id = người đăng nhập)
     edu.system.getList_ChuongTrinhDaoTao → ums.ref.chuongTrinh { strKhoaDaoTao_Id = DAOTAO_KHOADAOTAO_ID của kế hoạch }
     edu.system.getList_LopQuanLy         → ums.ref.lopQuanLy  { strToChucCT_Id }
     TC_KhoanThu/LayDanhSach (GET, versionAPI v1.0, pageSize 10000)
     edu.system.getList_CoSoDaoTao        → pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao (pageSize 10000)

   API:
     var L = ums.nhTk.boLoc(host, {
         kieu: 'thanh' | 'form',   thanh lọc ngang có nút Tìm kiếm (thongke) · biểu mẫu dọc (baocaothongke)
         khNhieu: false,           Kế hoạch chọn NHIỀU (baocaothongke — multiple="multiple" ở gốc)
         khoanThu: true, tuKhoa: false, tatCa: false (nhãn "Tất cả" như baocaothongke)
     });
     L.v()         → { kh, ct, lop, kt, cs, tu, den, q }   (kh chọn nhiều = "a,b" như getValCombo)
     L.baoCao(add, { khoanThu })   các cặp addKeyValue của edu.system.report(...) bản gốc
     L.F           các ô (data-f)
     ums.nhTk.drop(text, icon, [{ key, text }]) + ganDrop(host, onPick(key))   nút thả xuống "Truy/xuất ▾"

   KHÁC BẢN GỐC:
     · Luật cha → con (2026-09-21): Chương trình khoá tới khi chọn Kế hoạch, Lớp khoá tới khi chọn Chương trình;
       xoá cha thì xoá trắng con (ums.pat.chain). Gốc nạp CT chỉ khi chọn kế hoạch nên chưa chọn thì danh sách
       vốn đã trống — khoá lại không đổi nghiệp vụ.
     · Kế hoạch chọn nhiều: gốc lấy chương trình theo option ĐẦU TIÊN đang chọn (find('option:selected').val())
       và chỉ khi chọn thêm; bỏ bớt kế hoạch thì chương trình không đổi. Ở đây: chọn / bỏ đều tính lại theo kế
       hoạch đầu tiên còn chọn.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat;
    var T = ums.nhTk = ums.nhTk || {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    function rs(call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) {
            var d = r.data;
            return Array.isArray(d) ? d : (d && d.rs) || [];
        });
    }

    /* ---------- Nguồn --------------------------------------------------- */
    T.keHoach = function () {
        return rs({
            action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            strNguoiThucHien_Id: ums.session.userId
        });
    };
    T.chuongTrinh = function (khoaId) {
        return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: khoaId, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
            strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
    };
    T.lop = function (ctId) {
        return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strKhoaDaoTao_Id: '', strNganh_Id: '', strLoaiLop_Id: '',
            strToChucCT_Id: ctId, strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
    };
    T.khoanThu = function () {
        return rs({ action: 'TC_KhoanThu/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strTuKhoa: '', strNhomCacKhoanThu_Id: '',
            pageIndex: 1, pageSize: 10000, strNguoiTao_Id: '', strCanBoQuanLy_Id: '' });
    };
    T.coSo = function () {
        return rs({ action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP', func: 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
            strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
    };

    /* ---------- Bộ lọc -------------------------------------------------- */
    T.boLoc = function (host, o) {
        o = o || {};
        var tc = o.tatCa;
        var defs = [
            { key: 'kh', type: 'select', multiple: !!o.khNhieu, label: tc ? 'Tất cả' : 'Chọn kế hoạch nhập học', nhan: 'Kế hoạch' },
            { key: 'ct', type: 'select', label: tc ? 'Tất cả' : 'Chọn chương trình đào tạo', nhan: 'Chương trình' },
            { key: 'lop', type: 'select', label: tc ? 'Tất cả' : 'Chọn lớp quản lý', nhan: 'Lớp quản lý' }
        ];
        if (o.khoanThu !== false) defs.push({ key: 'kt', type: 'select', label: tc ? 'Tất cả' : 'Chọn loại khoản thu', nhan: 'Khoản thu' });
        defs.push({ key: 'cs', type: 'select', label: tc ? 'Tất cả' : 'Chọn cơ sở đào tạo', nhan: 'Cơ sở đào tạo' });
        defs.push({ key: 'tu', type: 'date', label: 'Từ ngày dd/mm/yyyy', nhan: 'Từ ngày' });
        defs.push({ key: 'den', type: 'date', label: 'Đến ngày dd/mm/yyyy', nhan: 'Đến ngày' });
        if (o.tuKhoa) defs.push({ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' });

        if (o.kieu === 'form') {
            /* Biểu mẫu "Điều kiện xuất báo cáo" (bảng nhãn | ô của gốc) — hai ô một hàng, tên dài cả dòng (luật 11) */
            host.innerHTML = '<div class="ums-grid ums-grid--2">' + defs.map(function (f) {
                var ctl = f.type === 'select'
                    ? '<select class="ums-select" data-f="' + f.key + '"' + (f.multiple ? ' multiple' : '') + ' data-ph="' + ui.esc(f.label) + '">' +
                        (f.multiple ? '' : '<option value="">' + ui.esc(f.label) + '</option>') + '</select>'
                    : '<input class="ums-input" data-f="' + f.key + '" data-date placeholder="' + ui.esc(f.label) + '" autocomplete="off">';
                var dai = f.key === 'kh' || f.key === 'ct' || f.key === 'cs';
                return '<div' + (dai ? ' style="grid-column:1 / -1"' : '') + '>' + ui.field(f.nhan, ctl) + '</div>';
            }).join('') + '</div>';
        } else {
            host.innerHTML = pat.filterBar(defs);
        }

        var F = {};
        defs.forEach(function (f) { F[f.key] = host.querySelector('[data-f="' + f.key + '"]'); });
        ui.enhance(host);

        var dsKH = [];
        var khDangNap = '';
        function khDau() {
            var v = F.kh.multiple ? (jQuery(F.kh).val() || []) : [F.kh.value];
            // gốc: option ĐẦU TIÊN đang chọn theo thứ tự danh sách
            if (F.kh.multiple) {
                var chon = {};
                v.forEach(function (x) { chon[x] = 1; });
                v = Array.prototype.filter.call(F.kh.options, function (op) { return chon[op.value]; }).map(function (op) { return op.value; });
            }
            return v.filter(Boolean)[0] || '';
        }
        function napCT() {
            var id = khDau();
            if (id === khDangNap && F.ct.options.length > 1) return;
            khDangNap = id;
            if (!id) { pat.fill(F.ct, [], { name: 'TENCHUONGTRINH' }); pat.fill(F.lop, []); return; }
            var kh = dsKH.filter(function (r) { return r.ID === id; })[0] || {};
            T.chuongTrinh(e(kh.DAOTAO_KHOADAOTAO_ID)).then(function (rows) {
                if (khDangNap !== id) return;
                pat.fill(F.ct, rows, { name: 'TENCHUONGTRINH' });
            }).catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
        }
        function napLop() {
            var id = F.ct.value;
            if (!id) { pat.fill(F.lop, []); return; }
            T.lop(id).then(function (rows) {
                if (F.ct.value !== id) return;
                pat.fill(F.lop, rows);
            }).catch(function (err) { ums.api.handle(err, 'lớp quản lý'); });
        }
        jQuery(F.kh).on('select2:select select2:unselect select2:clear', function () { setTimeout(napCT, 0); });
        jQuery(F.ct).on('select2:select select2:clear', function () { setTimeout(napLop, 0); });
        pat.chain([F.kh, F.ct, F.lop], { phatLai: false });

        var viec = [
            T.keHoach().then(function (rows) { dsKH = rows; pat.fill(F.kh, rows, { name: 'TENKEHOACH' }); })
                .catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); }),
            T.coSo().then(function (rows) { pat.fill(F.cs, rows); }).catch(function (err) { ums.api.handle(err, 'cơ sở đào tạo'); })
        ];
        if (F.kt) viec.push(T.khoanThu().then(function (rows) { pat.fill(F.kt, rows); }).catch(function (err) { ums.api.handle(err, 'khoản thu'); }));

        var L = {
            F: F,
            ready: Promise.all(viec),
            keHoach: function () { return dsKH; },
            v: function () {
                return { kh: pat.val(F.kh), ct: pat.val(F.ct), lop: pat.val(F.lop), kt: pat.val(F.kt), cs: pat.val(F.cs),
                    tu: pat.val(F.tu), den: pat.val(F.den), q: pat.val(F.q) };
            },
            /* Callback addKeyValue của edu.system.report(...) — y thứ tự bản gốc. Kế hoạch trống → id người dùng
               (gốc: "neu khong chon ke hoach thi lay theo user"). */
            baoCao: function (add, opt) {
                var v = L.v();
                add('strKeHoach_Id', v.kh || ums.session.userId);
                add('strChuongTrinh_Id', v.ct);
                add('strLopHoc_Id', v.lop);
                if (!opt || opt.khoanThu !== false) add('strLoaiKhoan_Id', v.kt);
                add('strCoSoDT', v.cs);
                add('strTuKhoa', '');
                add('strTuNgay', v.tu);
                add('strDenNgay', v.den);
            }
        };
        return L;
    };

    /* ---------- Nút thả xuống "Truy/xuất ▾" (dropdown-menu của gốc) ---------
       Cùng khuôn .ums-drop của report.js (đóng khi bấm ra ngoài / Esc do report.js lo). */
    T.drop = function (text, icon, items) {
        return '<div class="ums-drop" data-nhdrop>' +
            '<button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
            '<i class="fa-light ' + ui.esc(icon) + '"></i><span>' + ui.esc(text) + '</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
            '<div class="ums-drop__menu" role="menu" hidden>' + items.map(function (it, i) {
                return '<button type="button" class="ums-drop__item" role="menuitem" data-nhmau="' + ui.esc(it.key) + '">' +
                    '<span class="ums-drop__no">' + (i + 1) + '.</span><span class="ums-drop__text">' + ui.esc(it.text) + '</span></button>';
            }).join('') + '</div></div>';
    };
    T.ganDrop = function (host, onPick) {
        function dong(d) {
            d.classList.remove('is-open');
            d.querySelector('.ums-drop__menu').hidden = true;
            d.querySelector('.ums-drop__toggle').setAttribute('aria-expanded', 'false');
        }
        host.addEventListener('click', function (ev) {
            var tog = ev.target.closest('[data-nhdrop] .ums-drop__toggle');
            if (tog) {
                var d = tog.closest('.ums-drop'), mo = !d.classList.contains('is-open');
                if (!mo) return dong(d);
                d.classList.add('is-open');
                d.querySelector('.ums-drop__menu').hidden = false;
                tog.setAttribute('aria-expanded', 'true');
                return;
            }
            var it = ev.target.closest('[data-nhmau]');
            if (!it) return;
            dong(it.closest('.ums-drop'));
            onPick(it.getAttribute('data-nhmau'));
        });
    };

    /* Ngày sinh ghép từ ba cột như gốc: NGAYSINH_NGAY/NGAYSINH_THANG/NGAYSINH_NAM */
    T.ngaySinh = function (r) {
        return e(r.NGAYSINH_NGAY) + '/' + e(r.NGAYSINH_THANG) + '/' + e(r.NGAYSINH_NAM);
    };
})();
