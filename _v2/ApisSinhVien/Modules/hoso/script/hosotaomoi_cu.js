/* =========================================================================
   Tạo mới hồ sơ (bản cũ) — sinh viên chưa hoàn thành hồ sơ
   Bản gốc: ApisSinhVien/Modules/hoso/html/hoso_taomoi_cu.html + script/hosotaomoi_cu.js
   ---------------------------------------------------------------------------
   Bố cục gốc HAI CỘT (col-sm-3 | col-sm-9) → ums.pat.master:
     · Trái: ô từ khoá + "Tìm nâng cao" (Hệ · Khoá · CT · Lớp) + "Thao tác:" (Gán CT · Gán lớp ·
       Trạng thái — lọc người CHƯA gán) + Tìm kiếm, rồi danh sách "Sinh viên chưa hoàn thành
       hồ sơ" (ảnh · họ tên · mã; mỗi dòng MỘT nút bước còn thiếu: 1. Gán CT / 2. Gán lớp /
       3. Trạng thái), phân trang máy chủ.
     · Phải: bấm DÒNG → khung thông tin sinh viên (zoneMainContent); bấm NÚT BƯỚC → khung gán
       ba bước (zoneGanThongTin): Gán chương trình → Gán lớp → Cập nhật trạng thái → Hoàn tất,
       mỗi bước chọn một thẻ rồi "Lưu" (lưu xong sang bước sau) hoặc "Để sau" (sang bước sau
       không lưu). Bước cuối "Đóng" nạp lại danh sách.

   Lời gọi (chép nguyên):
     SV_HoSoChuaHoanThanh/LayDanhSach (GET) — strTuKhoa, strHeDaoTao_Id, strKhoaDaoTao_Id,
        strChuongTrinh_Id, strLopQuanLy_Id, dChuaGanLop / dChuaGanChuongTrinh / dChuaGanTrangThai
        (ô đánh dấu → 1/0), strNguoiThucHien_Id "", pageIndex, pageSize (mặc định 10).
        Cột: ID, ANH, HODEM, TEN, MASO, DAOTAO_CHUONGTRINH_ID, LOP_ID, QLSV_NGUOIHOC_TRANGTHAI_ID,
        DAOTAO_HEDAOTAO_ID, DAOTAO_KHOADAOTAO_ID, NGAYSINH_NGAY/THANG/NAM, BIDANH, QUOCTICH_ID,
        GIOITINH_ID, DANTOC_ID, TONGIAO_ID, TTLL_*, CMTND_SO, HO (ô "Số hộ chiếu" — gốc đọc cột
        này, giữ nguyên), NOISINH_/QUEQUAN_/HOKHAU_ *_TEN, NOIOHIENNAY, TTLL_KHICANBAOTINCHOAI_ODAU.
     SV_HoSoChuaHoanThanh/GanChuongTrinhHoc (POST) — strId "", strQLSV_NguoiHoc_Id,
        strDaoTao_ChuongTrinh_Id (thẻ đã chọn), strNguoiThucHien_Id.
     SV_HoSoChuaHoanThanh/GanLopQuanLy (POST) — strId "", strQLSV_NguoiHoc_Id,
        strQLSV_TrangThaiNguoiHoc_Id (trạng thái HIỆN CÓ của sinh viên), strDaoTao_LopQuanLy_Id.
     SV_HoSoChuaHoanThanh/GanTrangThaiNguoiHoc (POST) — strId "", strQLSV_NguoiHoc_Id,
        strDaoTao_ChuongTrinh_Id / strDaoTao_LopQuanLy_Id (hiện có — cập nhật sau mỗi bước lưu),
        strQLSV_TrangThaiNguoiHoc_Id (thẻ đã chọn).
     Danh mục đào tạo: edu.system.getList_HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao / LopQuanLy
        (KHÔNG lọc quyền) → ums.ref.* với đúng tham số gốc; trạng thái QLSV.TRANGTHAI;
        tên quốc tịch / giới tính / dân tộc / tôn giáo: CHUN.CHLU, NS.GITI, NS.DATO, NS.TOGI.

   Khác bản gốc (luật chung + sửa lỗi theo ý định):
     · Luật cha → con: Hệ → Khoá → CT → Lớp ở cả ba chỗ (lọc trái, bước Gán CT, bước Gán lớp).
       Gốc: ô Lớp bên trái nạp MỘT lần lúc mở (mọi lớp) và không theo CT; ba chỗ dùng chung
       một trình xử lý nên đổi Hệ ở một chỗ là nạp lại Khoá ở cả ba.
     · Thẻ chương trình chỉ hiện khi đã chọn Khoá, thẻ lớp chỉ hiện khi đã chọn CT (gốc lúc mở
       nạp MỌI chương trình / MỌI lớp thành thẻ). Mở bước thì điền sẵn Hệ/Khoá/CT theo sinh
       viên nếu đã có (ý định của viewForm_HS gốc — điều kiện gốc viết ngược nên không chạy).
     · "Lưu" khi chưa chọn thẻ nào: gốc gửi thẻ chọn của sinh viên TRƯỚC (biến không đặt lại)
       hoặc rỗng → nay báo "Vui lòng chọn …"; đổi sinh viên thì xoá lựa chọn cũ.
     · Ô tìm trong bước Gán CT: gốc lọc cả khung (ẩn hết) → nay lọc từng thẻ; ô tìm ở bước Gán
       lớp / Trạng thái gốc không gắn gì → nay cũng lọc thẻ như vậy.
     · Khung thông tin sinh viên CHỈ XEM: html gốc KHÔNG có nút lưu (btnSave, .ThemMoiSinhVien
       không tồn tại) nên save_HS (SV_HoSo/ThemMoi | CapNhat) không có lối vào → bỏ.
   Cố ý bỏ (mã chết): popover_HS, ganLop (hộp hỏi tự dựng), ganChuongTrinh / ganTranngThai (rỗng),
     getList_ThoiGianDaoTao / NamNhapHoc / KhoaQuanLy + các ô dropPhanViTongHop_* / dropKhoaQuanLy
     / dropTinhTrangSinhVien (không có trong html), setTinhThanh / uploadAvatar của biểu mẫu
     không lưu được.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('sv-hosotaomoicu');
    if (!root) return;

    function e(v) { return v === null || v === undefined ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function hoTen(r) { return (e(r.HODEM) + ' ' + e(r.TEN)).trim(); }
    function ngaySinh(r) { return e(r.NGAYSINH_NGAY) + '/' + e(r.NGAYSINH_THANG) + '/' + e(r.NGAYSINH_NAM); }
    function sel(k, ph) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>';
    }
    function chk(k, t, on) {
        return '<label class="ums-check"><input type="checkbox" data-f="' + k + '"' + (on ? ' checked' : '') + '> ' + esc(t) + '</label>';
    }

    /* ------------------------------------------------------------------ khung */
    var m = pat.master({
        el: root,
        title: 'Tạo mới hồ sơ (bản cũ)',
        side: {
            title: 'Sinh viên chưa hoàn thành hồ sơ', icon: 'fa-address-card', search: 'Nhập từ khóa tìm kiếm',
            filter:
                '<div class="ums-master__adv" data-z="adv" hidden>' +
                '<div class="ums-master__advtitle">Chọn điều kiện tìm kiếm</div>' +
                sel('he', 'Chọn hệ đào tạo') + sel('khoa', 'Chọn khóa đào tạo') +
                sel('ct', 'Chọn chương trình') + sel('lop', 'Chọn lớp') +
                '</div>' +
                '<div class="ums-master__advtitle">Thao tác</div>' +
                '<div class="ums-master__tt">' + chk('bGanChuongTrinh', 'Gán CT') + chk('bGanLop', 'Gán lớp') +
                chk('bGanTrangThai', 'Trạng thái', true) + '</div>' +
                '<div class="ums-u-mt-2">' + ui.btn('search', { cls: 'ums-btn--block', attr: { 'data-a': 'search' } }) + '</div>'
        },
        main: { title: false }
    });
    m.side.querySelector('.ums-panel__tools').innerHTML =
        '<button type="button" class="ums-iconbtn" data-a="adv" title="Tìm nâng cao"><i class="fa-light fa-sliders"></i></button>';

    m.mainBody.innerHTML =
        '<div data-z="trong">' + pat.panel({ title: false,
            body: ui.empty('Danh sách sinh viên đã sẵn sàng. Hãy thao tác với danh sách bên trái!', 'fa-user-graduate') }) + '</div>' +
        '<div data-z="xem" hidden></div>' +
        '<div data-z="gan" hidden></div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function F(k) { return m.side.querySelector('[data-f="' + k + '"]'); }
    ui.enhance(m.side);

    /* ---------------------------------------------------- danh mục đào tạo */
    var P = { strTuKhoa: '', pageIndex: 1 };
    function gop(a, b) { var r = {}; [a, b].forEach(function (x) { Object.keys(x).forEach(function (k) { r[k] = x[k]; }); }); return r; }
    var dsHe = ums.ref.heDaoTao(gop(P, { strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', pageSize: 1000 }));
    function dsKhoa(he) { return ums.ref.khoaDaoTao(gop(P, { strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', pageSize: 10000 })); }
    function dsCT(khoa) {
        return ums.ref.chuongTrinh(gop(P, { strKhoaDaoTao_Id: khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
            strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', pageSize: 10000 }));
    }
    function dsLop(ct) {
        return ums.ref.lopQuanLy(gop(P, { strCoSoDaoTao_Id: '', strKhoaDaoTao_Id: '', strNganh_Id: '', strLoaiLop_Id: '',
            strToChucCT_Id: ct, strNguoiThucHien_Id: '', pageSize: 100000 }));
    }
    function loi(t) { return function (err) { ums.api.handle(err, t); return []; }; }

    /* Một bộ Hệ → Khoá → (CT) → (Lớp) — ô nào không truyền thì bỏ. onCon(tầng, giá trị) báo khi
       Khoá / CT đổi để màn nạp thẻ. Trả { dat(he, khoa, ct) } — điền sẵn bằng mã. */
    function boNoi(o) {
        function napKhoa() { return dsKhoa(pat.val(o.he)).then(function (d) { pat.fill(o.khoa, d, { name: 'TENKHOA' }); }, loi('khóa đào tạo')); }
        function napCT() { return o.ct ? dsCT(pat.val(o.khoa)).then(function (d) { pat.fill(o.ct, d, { name: 'TENCHUONGTRINH' }); }, loi('chương trình đào tạo')) : Promise.resolve(); }
        function napLop() { return o.lop ? dsLop(pat.val(o.ct)).then(function (d) { pat.fill(o.lop, d, { name: 'TEN' }); }, loi('lớp quản lý')) : Promise.resolve(); }
        dsHe.then(function (d) { pat.fill(o.he, d, { name: 'TENHEDAOTAO' }); }, loi('hệ đào tạo'));
        jQuery(o.he).on('select2:select', function () { napKhoa(); if (o.onCon) o.onCon('khoa', ''); });
        jQuery(o.khoa).on('select2:select', function () { napCT(); if (o.onCon) o.onCon('khoa', pat.val(o.khoa)); });
        if (o.ct) jQuery(o.ct).on('select2:select', function () { napLop(); if (o.onCon) o.onCon('ct', pat.val(o.ct)); });
        pat.chain([o.he, o.khoa, o.ct, o.lop]);
        function dat1(el, v) { if (el) { jQuery(el).val(v || '').trigger('change.select2').trigger('ums:refresh'); } }
        return {
            dat: function (he, khoa, ct) {
                if (o.onCon) o.onCon('khoa', '');               // thẻ về lời nhắc tới khi điền xong
                return dsHe.then(function () {
                    dat1(o.he, he);
                    if (!he) {                                  // sinh viên chưa có hệ → xoá trắng bộ lọc
                        [o.khoa, o.ct, o.lop].forEach(function (x) { dat1(x, ''); });
                        return;
                    }
                    return napKhoa().then(function () {
                        dat1(o.khoa, khoa);
                        if (!khoa) return;
                        return napCT().then(function () {
                            dat1(o.ct, ct);
                            if (o.onCon) o.onCon(ct && o.ct ? 'ct' : 'khoa', ct && o.ct ? ct : khoa);
                            if (ct && o.lop) return napLop();
                        });
                    });
                });
            }
        };
    }
    boNoi({ he: F('he'), khoa: F('khoa'), ct: F('ct'), lop: F('lop') });

    /* Tên danh mục cho khung xem (gốc đổ id vào ô chọn danh mục) */
    var DM = {};
    [['CHUN.CHLU', 'qt'], ['NS.GITI', 'gt'], ['NS.DATO', 'dt'], ['NS.TOGI', 'tg']].forEach(function (x) {
        DM[x[1]] = ums.api.dm(x[0]).then(function (d) {
            var mp = {}; d.forEach(function (r) { mp[r.ID] = r.TEN; }); return mp;
        }, function () { return {}; });
    });
    var dsTT = ums.api.dm('QLSV.TRANGTHAI').catch(loi('trạng thái người học'));

    /* ------------------------------------------------------------- danh sách */
    var st = { page: 1, size: 10, total: 0, rows: [], chon: '' };
    var luot = 0;
    function tai(p) {
        if (p) st.page = p;
        var sh = ++luot;
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'SV_HoSoChuaHoanThanh/LayDanhSach', method: 'GET',
            strTuKhoa: (m.search.value || '').trim(),
            strHeDaoTao_Id: pat.val(F('he')),
            strKhoaDaoTao_Id: pat.val(F('khoa')),
            strChuongTrinh_Id: pat.val(F('ct')),
            strLopQuanLy_Id: pat.val(F('lop')),
            dChuaGanLop: F('bGanLop').checked ? 1 : 0,
            dChuaGanChuongTrinh: F('bGanChuongTrinh').checked ? 1 : 0,
            dChuaGanTrangThai: F('bGanTrangThai').checked ? 1 : 0,
            strNguoiThucHien_Id: '',
            pageIndex: st.page,
            pageSize: st.size
        }).then(function (r) {
            if (sh !== luot) return;
            st.rows = Array.isArray(r.data) ? r.data : [];
            st.total = Number(r.pager) || st.rows.length;
            veDS();
        }).catch(function (err) {
            if (sh !== luot) return;
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'SV_HoSoChuaHoanThanh/LayDanhSach');
        });
    }
    /* Nút bước còn thiếu của một dòng (mRender cột "Sua" gốc) */
    function nutBuoc(r) {
        var b = !e(r.DAOTAO_CHUONGTRINH_ID) ? ['zoneChuongTrinh', 'warn', '1. Gán CT']
            : !e(r.LOP_ID) ? ['zoneGanLop', 'danger', '2. Gán lớp']
            : !e(r.QLSV_NGUOIHOC_TRANGTHAI_ID) ? ['zoneLuuTrangThai', 'out-info', '3. Trạng thái'] : null;
        if (!b) return '';
        return '<button type="button" class="ums-btn ums-btn--sm ums-btn--' + b[1] + '" data-buoc="' + b[0] + '" data-id="' + esc(r.ID) + '">' +
            '<i class="fa-light fa-right-to-bracket"></i><span>' + esc(b[2]) + '</span></button>';
    }
    function veDS() {
        m.sideCount.textContent = '(' + st.total + ')';
        if (!st.rows.length) m.sideBody.innerHTML = ui.empty('Không có sinh viên nào');
        else {
            m.sideBody.innerHTML = st.rows.map(function (r) {
                var n = nutBuoc(r);
                return '<div class="ums-master__item ums-dsns__item hstm-item' + (r.ID === st.chon ? ' is-active' : '') + '" data-id="' + esc(r.ID) + '">' +
                    pat.anhNguoi(r.ANH) +
                    '<span class="ums-master__item__main"><b>' + esc(hoTen(r)) + '</b>' +
                    '<span class="ums-master__item__sub">' + esc(e(r.MASO)) + '</span></span>' +
                    (n ? '<span class="ums-master__item__act">' + n + '</span>' : '') + '</div>';
            }).join('');
        }
        m.setPage({ index: st.page, size: st.size, total: st.total, shown: st.rows.length,
            onChange: function (p) { tai(p); }, onSize: function (v) { st.size = v; tai(1); } });
    }
    function dong(id) { return st.rows.filter(function (r) { return String(r.ID) === String(id); })[0]; }
    function danhDau(id) {
        st.chon = id || '';
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.hstm-item'), function (x) {
            x.classList.toggle('is-active', x.getAttribute('data-id') === st.chon);
        });
    }
    function hien(k) {
        ['trong', 'xem', 'gan'].forEach(function (x) { z(x).hidden = x !== k; });
        if (k !== 'trong') ui.reveal(z(k));
    }

    /* ------------------------------------------------ khung thông tin (chỉ xem) */
    function xem(r) {
        Promise.all([DM.qt, DM.gt, DM.dt, DM.tg]).then(function (mp) {
            function kv(t, v) { return '<div class="ums-kv"><span>' + esc(t) + '</span><b>' + esc(e(v)) + '</b></div>'; }
            function dc(a, b, c) { return [e(a), e(b), e(c)].join(', '); }
            z('xem').innerHTML = pat.panel({
                title: 'Họ tên: ' + hoTen(r) + ' - ' + e(r.MASO) + ' · Ngày sinh: ' + ngaySinh(r), icon: 'fa-id-card',
                tools: ui.btn('close', { attr: { 'data-a': 'dongXem' } }),
                body: '<div class="hstm-xem">' + pat.anhNguoi(r.ANH) + '<div class="ums-grid ums-grid--2 hstm-kv">' +
                    kv('Họ', r.HODEM) + kv('Tên', r.TEN) +
                    kv('Bí danh', r.BIDANH) + kv('Quốc tịch', mp[0][r.QUOCTICH_ID]) +
                    kv('Ngày sinh', ngaySinh(r)) + kv('Giới tính', mp[1][r.GIOITINH_ID]) +
                    kv('Dân tộc', mp[2][r.DANTOC_ID]) + kv('Tôn giáo', mp[3][r.TONGIAO_ID]) +
                    kv('Email', r.TTLL_EMAILCANHAN) + kv('Số điện thoại', r.TTLL_DIENTHOAICANHAN) +
                    kv('SĐT gia đình', r.TTLL_DIENTHOAIGIADINH) + kv('SĐT cơ quan', r.TTLL_DIENTHOAICOQUAN) +
                    kv('Số CMTND', r.CMTND_SO) + kv('Số hộ chiếu', r.HO) +
                    '</div></div>' +
                    '<div class="hstm-kv ums-u-mt-3">' +
                    kv('Nơi sinh', dc(r.NOISINH_TINHTHANH_TEN, r.NOISINH_QUANHUYEN_TEN, r.NOISINH_PHUONGXAKHOIXOM)) +
                    kv('Quê quán', dc(r.QUEQUAN_TINHTHANH_TEN, r.QUEQUAN_QUANHUYEN_TEN, r.QUEQUAN_PHUONGXAKHOIXOM)) +
                    kv('Hộ khẩu thường trú', dc(r.HOKHAU_TINHTHANH_TEN, r.HOKHAU_QUANHUYEN_TEN, r.HOKHAU_PHUONGXAKHOIXOM)) +
                    kv('Nơi ở hiện nay', r.NOIOHIENNAY) +
                    kv('Khi cần báo tin cho ai, ở đâu', r.TTLL_KHICANBAOTINCHOAI_ODAU) +
                    '</div>'
            });
            hien('xem');
        });
    }

    /* --------------------------------------------------- khung gán ba bước */
    var BUOC = [
        { k: 'zoneChuongTrinh', t: 'Gán chương trình', tone: 'ct' },
        { k: 'zoneGanLop', t: 'Gán lớp', tone: 'lop' },
        { k: 'zoneLuuTrangThai', t: 'Cập nhật trạng thái', tone: 'tt' }
    ];
    var G = { sv: null, buoc: '', chon: {}, ct: '', lop: '', tt: '' };   // ct/lop/tt = giá trị HIỆN CÓ của sinh viên
    z('gan').innerHTML = pat.panel({
        title: ' ', icon: 'fa-user-graduate',
        tools: '<span data-z="nutDong"></span>' + ui.btn('save', { attr: { 'data-a': 'luu' } }),
        body:
            '<ol class="hstm-steps" data-z="steps">' + BUOC.map(function (b) {
                return '<li data-st="' + b.k + '"><span>' + esc(b.t) + '</span></li>';
            }).join('') + '</ol>' +
            /* Bước 1 — chương trình */
            '<div data-buocz="zoneChuongTrinh" hidden><div class="ums-filter">' +
                sel('ctHe', 'Chọn hệ đào tạo') + sel('ctKhoa', 'Chọn khóa đào tạo') +
                '<div class="ums-field"><input class="ums-input" data-loc="zoneChuongTrinh" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '</div><div data-the="zoneChuongTrinh"></div><div class="hstm-chon" data-cz="zoneChuongTrinh"></div></div>' +
            /* Bước 2 — lớp */
            '<div data-buocz="zoneGanLop" hidden><div class="ums-filter">' +
                sel('lopHe', 'Chọn hệ đào tạo') + sel('lopKhoa', 'Chọn khóa đào tạo') + sel('lopCT', 'Chọn chương trình') +
                '<div class="ums-field"><input class="ums-input" data-loc="zoneGanLop" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '</div><div data-the="zoneGanLop"></div><div class="hstm-chon" data-cz="zoneGanLop"></div></div>' +
            /* Bước 3 — trạng thái */
            '<div data-buocz="zoneLuuTrangThai" hidden><div class="ums-filter">' +
                '<div class="ums-field"><input class="ums-input" data-loc="zoneLuuTrangThai" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '</div><div data-the="zoneLuuTrangThai"></div><div class="hstm-chon" data-cz="zoneLuuTrangThai"></div></div>' +
            /* Hoàn tất */
            '<div data-buocz="zoneHoanThanh" hidden>' +
                ui.empty('Đã hoàn tất thủ tục nhập học. Hãy chọn sinh viên tiếp theo', 'fa-circle-check') + '</div>'
    });
    var gan = z('gan');
    function GF(k) { return gan.querySelector('[data-f="' + k + '"]'); }
    ui.enhance(gan);

    /* Thẻ lựa chọn (info-box gốc) — ums.pat.cards, lọc tại chỗ theo ô từ khoá */
    var THE = { zoneChuongTrinh: [], zoneGanLop: [], zoneLuuTrangThai: [] };
    var NHAC = { zoneChuongTrinh: 'Chọn hệ và khóa đào tạo để xem danh sách chương trình',
        zoneGanLop: 'Chọn hệ, khóa và chương trình để xem danh sách lớp' };
    var TEN = { zoneChuongTrinh: function (r) { return e(r.TENCHUONGTRINH); }, zoneGanLop: function (r) { return e(r.TEN); },
        zoneLuuTrangThai: function (r) { return e(r.TEN); } };
    var LOAI = { zoneChuongTrinh: 'chương trình', zoneGanLop: 'lớp', zoneLuuTrangThai: 'trạng thái' };
    function veThe(k) {
        var host = gan.querySelector('[data-the="' + k + '"]');
        var rows = THE[k];
        if (rows === null) { host.innerHTML = ui.empty(NHAC[k], 'fa-hand-pointer'); return; }
        var q = gan.querySelector('[data-loc="' + k + '"]').value;
        var ds = pat.loc(rows, q, k === 'zoneLuuTrangThai' ? ['TEN', 'MA'] : k === 'zoneChuongTrinh' ? ['TENCHUONGTRINH'] : ['TEN']);
        pat.cards({
            el: host, items: ds, cls: 'hstm-the hstm-the--' + k, empty: 'Không có ' + LOAI[k] + ' nào',
            attrs: function (r) { return { 'data-id': e(r.ID) }; },
            render: function (r) {
                var ic = k === 'zoneLuuTrangThai' ? '<span class="hstm-the__ic hstm-the__ic--ma">' + esc(e(r.MA)) + '</span>'
                    : '<span class="hstm-the__ic"><i class="fa-light ' + (k === 'zoneChuongTrinh' ? 'fa-folder-open' : 'fa-folder') + '"></i></span>';
                return ic + '<b class="hstm-the__ten">' + esc(TEN[k](r)) + '</b>';
            },
            onPick: function (r) { chonThe(k, r); }
        });
        danhDauThe(k);
    }
    function danhDauThe(k) {
        var id = G.chon[k] ? String(G.chon[k].ID) : '';
        Array.prototype.forEach.call(gan.querySelectorAll('[data-the="' + k + '"] .ums-card'), function (c) {
            c.classList.toggle('is-active', c.getAttribute('data-id') === id);
        });
        var cz = gan.querySelector('[data-cz="' + k + '"]');
        cz.innerHTML = G.chon[k] ? 'Bạn đã chọn ' + esc(LOAI[k]) + ': <b>' + esc(TEN[k](G.chon[k])) + '</b>. Hãy nhấn nút "Lưu" để hoàn tất.' : '';
    }
    function chonThe(k, r) { G.chon[k] = r; danhDauThe(k); }
    Object.keys(THE).forEach(function (k) {
        gan.querySelector('[data-loc="' + k + '"]').addEventListener('input', function () { veThe(k); });
    });

    var luotThe = {};
    function napThe(k, p) {
        var sh = luotThe[k] = (luotThe[k] || 0) + 1;
        if (p === null) { THE[k] = null; veThe(k); return; }
        gan.querySelector('[data-the="' + k + '"]').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        p.then(function (d) { if (luotThe[k] === sh) { THE[k] = d || []; veThe(k); } });
    }
    var noiCT = boNoi({ he: GF('ctHe'), khoa: GF('ctKhoa'),
        onCon: function (t, v) { napThe('zoneChuongTrinh', v ? dsCT(v).catch(loi('chương trình đào tạo')) : null); } });
    var noiLop = boNoi({ he: GF('lopHe'), khoa: GF('lopKhoa'), ct: GF('lopCT'),
        onCon: function (t, v) { if (t === 'ct' || !v) napThe('zoneGanLop', t === 'ct' && v ? dsLop(v).catch(loi('lớp quản lý')) : null); } });
    /* ô Khoá / CT bị xoá trắng theo cha (pat.chain) → thẻ về lời nhắc */
    jQuery(GF('ctKhoa')).on('select2:clear', function () { napThe('zoneChuongTrinh', null); });
    jQuery(GF('lopCT')).on('select2:clear', function () { napThe('zoneGanLop', null); });
    THE.zoneChuongTrinh = null; THE.zoneGanLop = null;
    veThe('zoneChuongTrinh'); veThe('zoneGanLop');
    napThe('zoneLuuTrangThai', dsTT);

    /* switchSinhVien gốc */
    function moBuoc(k) {
        G.buoc = k;
        var idx = -1;
        BUOC.forEach(function (b, i) { if (b.k === k) idx = i; });
        Array.prototype.forEach.call(gan.querySelectorAll('[data-st]'), function (li, i) {
            li.classList.toggle('is-active', i === idx);
            li.classList.toggle('is-done', idx < 0 ? true : i < idx);
        });
        gan.querySelector('[data-z="steps"]').className = 'hstm-steps' + (idx >= 0 ? ' hstm-steps--' + BUOC[idx].tone : ' hstm-steps--xong');
        Array.prototype.forEach.call(gan.querySelectorAll('[data-buocz]'), function (x) { x.hidden = x.getAttribute('data-buocz') !== k; });
        var xong = k === 'zoneHoanThanh';
        gan.querySelector('[data-a="luu"]').hidden = xong;
        gan.querySelector('[data-z="nutDong"]').innerHTML = ui.btn('close', { text: xong ? 'Đóng' : 'Để sau', attr: { 'data-a': 'deSau' } });
        if (xong) tai();                                                // gốc nạp lại danh sách ở bước Hoàn tất
        hien('gan');
    }
    var SAU = { zoneChuongTrinh: 'zoneGanLop', zoneGanLop: 'zoneLuuTrangThai', zoneLuuTrangThai: 'zoneHoanThanh' };

    function moGan(r, k) {
        if (!G.sv || G.sv.ID !== r.ID) {
            G = { sv: r, buoc: '', chon: {}, ct: e(r.DAOTAO_CHUONGTRINH_ID), lop: e(r.LOP_ID), tt: e(r.QLSV_NGUOIHOC_TRANGTHAI_ID) };
            Object.keys(THE).forEach(function (x) { danhDauThe(x); });
            gan.querySelector('.ums-panel__title').innerHTML = '<i class="fa-light fa-user-graduate"></i> ' +
                esc('Họ tên: ' + hoTen(r) + ' - ' + e(r.MASO) + ' · Ngày sinh: ' + ngaySinh(r));
            /* viewForm_HS gốc: điền sẵn bộ lọc theo hệ / khoá / chương trình của sinh viên */
            var coKhoa = !!e(r.DAOTAO_KHOADAOTAO_ID);
            noiCT.dat(coKhoa ? e(r.DAOTAO_HEDAOTAO_ID) : '', coKhoa ? e(r.DAOTAO_KHOADAOTAO_ID) : '');
            noiLop.dat(G.ct ? e(r.DAOTAO_HEDAOTAO_ID) : '', G.ct ? e(r.DAOTAO_KHOADAOTAO_ID) : '', G.ct);
        }
        moBuoc(k);
    }

    function goi(action, p, xong) {
        p.action = 'SV_HoSoChuaHoanThanh/' + action;
        p.strId = '';
        p.strQLSV_NguoiHoc_Id = G.sv.ID;
        p.strNguoiThucHien_Id = uid();
        return ums.api.call(p).then(function () { ui.toast(xong, 'ok'); }, function (err) { ums.api.handle(err, action); throw err; });
    }
    function luu() {
        var k = G.buoc, c = G.chon[k];
        if (!c) { ui.toast('Vui lòng chọn ' + LOAI[k], 'warn'); return; }
        var p;
        if (k === 'zoneChuongTrinh') {
            p = goi('GanChuongTrinhHoc', { strDaoTao_ChuongTrinh_Id: c.ID }, 'Gán chương trình thành công').then(function () {
                G.ct = c.ID;
                /* gốc: đưa chương trình vừa gán sang ô CT của bước Gán lớp */
                if (pat.val(GF('lopCT')) !== c.ID) noiLop.dat(pat.val(GF('ctHe')), pat.val(GF('ctKhoa')), c.ID);
            });
        } else if (k === 'zoneGanLop') {
            p = goi('GanLopQuanLy', { strQLSV_TrangThaiNguoiHoc_Id: G.tt, strDaoTao_LopQuanLy_Id: c.ID }, 'Gán lớp thành công')
                .then(function () { G.lop = c.ID; });
        } else {
            p = goi('GanTrangThaiNguoiHoc', { strDaoTao_ChuongTrinh_Id: G.ct, strDaoTao_LopQuanLy_Id: G.lop,
                strQLSV_TrangThaiNguoiHoc_Id: c.ID }, 'Gán trạng thái thành công').then(function () { G.tt = c.ID; });
        }
        p.then(function () { moBuoc(SAU[k]); }, function () {});
    }

    /* ----------------------------------------------------------------- sự kiện */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a], [data-buoc], .hstm-item');
        if (!b || !root.contains(b)) return;
        if (b.hasAttribute('data-buoc')) {
            ev.stopPropagation();
            var r = dong(b.getAttribute('data-id'));
            if (r) { danhDau(r.ID); moGan(r, b.getAttribute('data-buoc')); }
            return;
        }
        if (b.classList.contains('hstm-item')) {
            var id = b.getAttribute('data-id');
            if (id === st.chon && !z('xem').hidden) { danhDau(''); hien('trong'); return; }   // bấm lại dòng đang xem → đóng
            var r2 = dong(id);
            if (r2) { danhDau(id); xem(r2); }
            return;
        }
        var a = b.getAttribute('data-a');
        if (a === 'adv') z('adv').hidden = !z('adv').hidden;
        else if (a === 'search') tai(1);
        else if (a === 'dongXem') { danhDau(''); hien('trong'); }
        else if (a === 'luu') luu();
        else if (a === 'deSau') {
            if (G.buoc === 'zoneHoanThanh') { danhDau(''); hien('trong'); }
            else moBuoc(SAU[G.buoc]);
        }
    });
    m.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
    /* Luật cột trái (BO-CUC 12): thêm Tải lại, nhóm "Thao tác" vào Bộ lọc nâng cao, bỏ nút Tìm kiếm, gõ là tự tìm */
    ums.pat.cotTrai(m, { tai: tai });

    tai(1);
})();
