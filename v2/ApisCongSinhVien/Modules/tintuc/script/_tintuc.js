/* =========================================================================
   Bảng tin — khung dùng chung cho hai màn tintuc và tintuc1 (Cổng sinh viên)
   Bản gốc: ApisCongSinhVien/Modules/tintuc/html/{tintuc,tintuc1}.html
            + script/tintuc.js  (MỘT tệp .js cho cả hai màn)
   ---------------------------------------------------------------------------
   tintuc1 khác tintuc ở đúng ba điểm — đã đối chiếu từng dòng:
     1. tintuc có thêm khối THÔNG BÁO viết cứng ngay trong HTML (thẻ <details>,
        "… điều chỉnh thời hạn đăng ký học lại … Kỳ 3 (hè) 2025-2026") — tintuc1
        không có. Đây là khác biệt duy nhất người dùng nhìn thấy.
     2. Biểu tượng kính lúp cạnh ô tìm: tintuc đặt lớp `btnSearchIcon` (KHÔNG có
        trình xử lý), tintuc1 đặt `btnSearch` (bấm kính lúp cũng tìm). Bản mới
        dùng thanh lọc chung nên cả hai màn đều có nút "Tìm kiếm" như nhau.
     3. tintuc1 nạp thêm `modules/tintuc/script/crypto-js.js` — tệp này KHÔNG tồn
        tại trong module (404), không ảnh hưởng gì.
   Ngoài ra hai tệp HTML giống nhau từng khối, cùng nạp tintuc.js, cùng dựng
   `new TinTuc()` → CHUNG một mã. Vì vậy hai màn mới dùng chung tệp này, chỉ
   truyền cờ `thongBao`.

   Lời gọi (chép nguyên action / func / tên tham số của bản gốc):
       pkg_tintuc.LayDSDonViCungCapNguon        strQLSV_NguoiHoc_Id → dải nút lọc theo nguồn tin
       pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung strTuKhoa '' (lọc TẠI CHỖ, xem dưới), strTuNgay, strDenNgay,
                                                strChuyenMuc_Id '', strChung_UngDung_Id = vai trò đang mở
                                                (edu.system.appId), dTinQuanTrong -1,
                                                strDaoTao_CoCauToChuc_Id = nguồn, dHieuLuc 1, pageIndex 1, pageSize 50
       pkg_tintuc.LayTinTuc_BangTin_ChiTiet     strTinTuc_BangTin_Id — bấm một tin là lấy CHI TIẾT (kho gốc 30/09/2026;
                                                trước đó lấy luôn dòng của danh sách)
       pkg_tintuc.Them_TinTuc_BangTin_LuotXem   mở một tin (đếm lượt xem)
       pkg_tintuc.Them_TinTuc_BangTin_LuuTru    "Lưu đánh dấu"
       pkg_tintuc.Xoa_TinTuc_BangTin_LuuTru     "Bỏ lưu" — THÊM MỚI, bản gốc không có
                                                (cần chuỗi action thật: ACT.xoaLuu)
       pkg_tintuc.LayDSTinTuc_BangTin_LuuTru    cột phải "Tin đã đánh dấu"
       pkg_tintuc.Them_TinTuc_BangTin_BinhLuan  "Ý kiến cá nhân" (nút Gửi hoặc Enter)
       pkg_tintuc.LayDSTinTuc_BangTin_BinhLuan  danh sách bình luận của tin đang xem
   Tệp đính kèm của tin: SV_Files (CHỈ XEM — xem "Khác bản gốc" bên dưới).
   Người học = ums.session.userId (vai trò thủ vai: vỏ đã chọn người học trước).

   Bố cục giữ nguyên bản gốc: thanh tìm (từ khoá + từ ngày + đến ngày + nút) →
   dải nguồn tin → thân HAI CỘT: cột trái (col-lg-9) tin chia BA NHÓM, khung xem
   tin THAY CHỖ các nhóm; cột phải (col-lg-3) "Tin đã đánh dấu", ẩn khi chưa
   đánh dấu tin nào.

   Kho gốc lần kéo 4 (30/09/2026) — đã chuyển:
     · Tin chia ba nhóm (classify_TinTuc): "Tin đào tạo" (cột chính, hiện 15 tin)
       · "Tin nhà trường" + "Hoạt động sinh viên" (cột phụ, hiện 6 tin); nhóm dư
       tin có nút "Xem thêm (n)" mở / "Thu gọn" ngay tại chỗ. Mỗi tin là một dòng
       (biểu tượng ghim + tiêu đề + ngày), bỏ ảnh / tên đơn vị như gốc. Hàm phân
       nhóm + vẽ nhóm xuất ra `ums.csvTinTuc.phanNhom / nhomHtml` — Trang chính
       (dashboard) dùng lại, không chép.
     · Từ khoá lọc TẠI CHỖ theo tiêu đề + tên đơn vị, không phân biệt dấu (gõ là
       lọc sau 250 ms, Enter cũng lọc); danh sách gửi strTuKhoa rỗng. Đổi Từ ngày /
       Đến ngày thì tự tải lại (400 ms). Nút "Tìm kiếm" tải lại danh sách.
     · Xem một tin: ẩn thanh tìm, dải nguồn và cột "Tin đã đánh dấu" (khung xem
       rộng hết trang); Quay lại thì hiện lại.
     · pageSize: danh sách tin 50, lưu trữ / bình luận 200 (gốc cũ 10000 / 100000).
     · html gốc nạp thêm crypto-js.js + jsaes.js trong module: tintuc.js gốc CHỈ
       dùng AES trong đoạn chú thích (thử mã hoá email) → không chép thư viện.

   Khác bản gốc:
     · "Đã lưu": gốc `checkDaLuu` so `e.ID` của dòng LƯU TRỮ với id TIN nên không
       bao giờ khớp — tin đã lưu vẫn hiện nút "Lưu đánh dấu", bấm lại là lưu
       trùng. Ở đây so theo TINTUC_BANGTIN_ID (đúng ý định); lưu rồi thì nút đổi
       thành "Đã lưu" và khoá — đúng như gốc định làm với hai thẻ <a>
       btnLuuDanhDau / btntindaluu (thẻ "Đã lưu" của gốc cũng không có xử lý).
     · Tệp đính kèm để CHỈ XEM: gốc gọi edu.system.viewFiles nên mỗi tệp có thêm
       nút xoá — người học không được xoá tệp của bản tin.
     · Bỏ hàm chết `save_TinTuc` (trùng y hệt `save_DaXem`, không nơi nào gọi) và
       khối comment thử mã hoá email ở đầu `init`.
     · Ô `txtAAAA` / `dropAAAA` không tồn tại trên màn → gửi chuỗi rỗng (đúng
       giá trị bản gốc đang gửi).
     · Chi tiết trả rỗng / lỗi thì hiện dòng tin của danh sách (gốc không hiện gì).
     · Khối TIN QUAN TRỌNG (cờ thongBao) vẫn giữ dù kho gốc đã gỡ khối thông báo viết
       cứng: khối lấy từ dữ liệu (dTinQuanTrong = 1), không phải chữ viết cứng; khi
       xem một tin thì ẩn cùng các nhóm.
   Mở thẳng một tin từ nơi khác (gốc: main_doc.DashBoard.objTinTuc) →
   `ums.state.moTin` = dòng tin, màn nạp xong thì xem ngay tin đó (lấy chi tiết).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var A = 'TS_TinTuc_MH/', P = 'pkg_tintuc.';
    /* action mã hoá của từng procedure — chép nguyên bản gốc */
    var ACT = {
        nguon:    A + 'DSA4BRIFLi8XKAI0LyYCIDEPJjQuLwPP',
        tin:      A + 'DSA4BRIVKC8VNCIeAyAvJhUoLx4PJjQuKAU0LyYP',
        chiTiet:  A + 'DSA4FSgvFTQiHgMgLyYVKC8eAikoFSgkNQPP',
        luotXem:  A + 'FSkkLB4VKC8VNCIeAyAvJhUoLx4NNC41GSQs',
        themLuu:  A + 'FSkkLB4VKC8VNCIeAyAvJhUoLx4NNDQVMzQP',
        dsLuu:    A + 'DSA4BRIVKC8VNCIeAyAvJhUoLx4NNDQVMzQP',
        themBl:   A + 'FSkkLB4VKC8VNCIeAyAvJhUoLx4DKC8pDTQgLwPP',
        dsBl:     A + 'DSA4BRIVKC8VNCIeAyAvJhUoLx4DKC8pDTQgLwPP',
        /* BỎ LƯU: bản gốc KHÔNG có (delete_DanhDau bị chú thích, không có action).
           Để trống thì màn vẫn hiện nút nhưng báo thiếu endpoint thay vì gọi hỏng;
           điền chuỗi action thật của pkg_tintuc.Xoa_TinTuc_BangTin_LuuTru là chạy.
           Chế độ dựng thử không cần action (dữ liệu mẫu tra theo func). */
        xoaLuu:   ''
    };

    /* ---- PHÂN NHÓM TIN (classify_TinTuc của kho gốc 30/09/2026) ----------
       Dùng chung cho màn Tin tức và Trang chính (dashboard). Bản dashboard gốc chỉ
       đoán theo tên đơn vị; bản tintuc ưu tiên chuyên mục (CHUYENMUC_MA + _TEN) rồi
       mới đoán theo đơn vị — dùng bản tintuc cho cả hai (tin chưa gắn chuyên mục thì
       kết quả y hệt bản dashboard). */
    function khongDau(s) {
        return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    }
    var NHOM = [
        { key: 'nhatruong', ten: 'Tin nhà trường' },
        { key: 'daotao', ten: 'Tin đào tạo' },
        { key: 'hoatdongsv', ten: 'Hoạt động sinh viên' }
    ];
    function phanNhom(x) {
        var cm = ((x.CHUYENMUC_MA || '') + ' ' + (x.CHUYENMUC_TEN || '')).trim();
        if (cm) {
            cm = khongDau(cm);
            if (/hdsv|hoat dong sinh vien|hoat dong sv/.test(cm)) return 'hoatdongsv';
            if (/tdt|tin dao tao|dao tao|khao thi/.test(cm)) return 'daotao';
            return 'nhatruong';
        }
        var dv = khongDau(x.DAOTAO_COCAUTOCHUC_TEN);
        if (/cthssv|cong tac (hoc sinh )?sinh vien|doan thanh nien|hoi sinh vien|sinh vien/.test(dv)) return 'hoatdongsv';
        if (/dao tao|khao thi/.test(dv)) return 'daotao';
        return 'nhatruong';
    }
    /** Chia danh sách tin → { nhatruong: [], daotao: [], hoatdongsv: [] } */
    function chiaNhom(ds) {
        var g = { nhatruong: [], daotao: [], hoatdongsv: [] };
        (ds || []).forEach(function (x) { g[phanNhom(x)].push(x); });
        return g;
    }
    /**
     * Một nhóm tin (khung + danh sách dòng tin, bấm dòng → [data-tin]=ID).
     * @param {string} ten    tiêu đề nhóm
     * @param {Array}  ds     tin của nhóm
     * @param {Object} o      { xem: số tin hiện sẵn, them: 'moRong' (nút "Xem thêm (n)" mở tại chỗ,
     *                          data-a="xemthem") | 'tatCa' (nút "Xem tất cả", data-a="tatca") }
     */
    function nhomHtml(ten, ds, o) {
        o = o || {};
        var xem = o.xem || 3, an = ds.length - xem, tools = '';
        if (o.them === 'moRong' && an > 0) {
            tools = '<button type="button" class="csvtt-nhom__them" data-a="xemthem" data-an="' + an + '">' +
                '<span>Xem thêm (' + an + ')</span></button>';
        } else if (o.them === 'tatCa' && ds.length) {
            tools = '<button type="button" class="csvtt-nhom__them" data-a="tatca"><span>Xem tất cả</span></button>';
        }
        var ds2 = o.them === 'moRong' ? ds : ds.slice(0, xem);
        var body = ds2.length ? ds2.map(function (x, i) {
            var ngay = String(x.NGAYBATDAU || x.NGAYTAO_DD_MM_YYYY || '').trim();
            return '<button type="button" class="csvtt-muc' + (i >= xem ? ' is-an' : '') + '" data-tin="' + ui.esc(x.ID || '') + '"' +
                (i >= xem ? ' hidden' : '') + '>' +
                '<span class="csvtt-muc__ic"><i class="fa-solid fa-thumbtack"></i></span>' +
                '<span class="csvtt-muc__noi"><b class="csvtt-muc__td">' + ui.esc(x.TIEUDE || '') + '</b>' +
                (ngay ? '<span class="csvtt-muc__meta"><i class="fa-light fa-calendar"></i> ' + ui.esc(ngay) + '</span>' : '') +
                '</span></button>';
        }).join('') : ui.empty('Chưa có tin nào', 'fa-inbox');
        return '<div class="csvtt-nhom">' + pat.panel({ title: ten, icon: 'fa-newspaper', tools: tools, body: body, cls: 'csvtt-nhom__khung' }) + '</div>';
    }
    /** Bấm "Xem thêm (n)" / "Thu gọn" của một nhóm (nút trong nhomHtml) */
    function moRong(nut) {
        var nhom = nut.closest('.csvtt-nhom');
        if (!nhom) return;
        var mo = nut.getAttribute('data-mo') === '1';
        nhom.querySelectorAll('.csvtt-muc.is-an').forEach(function (b) { b.hidden = mo; });
        nut.setAttribute('data-mo', mo ? '0' : '1');
        nut.querySelector('span').textContent = mo ? 'Xem thêm (' + nut.getAttribute('data-an') + ')' : 'Thu gọn';
    }

    /* KHỐI THÔNG BÁO (đầu lưới tin)
       Bản gốc viết CỨNG một thông báo trong html. Người dùng hỏi "có API của thông báo
       không" (23/09/2026): CÓ — chính procedure LayDSTinTuc_BangTin_NguoiDung nhận cờ
       dTinQuanTrong (gốc luôn gửi -1 = mọi tin). Ở đây gọi thêm một lần với
       dTinQuanTrong = 1 để lấy TIN QUAN TRỌNG và vẽ thành khối mở/đóng — không còn chữ
       viết cứng; không có tin quan trọng nào thì không vẽ khối. */
    function thongBaoHtml(x, noiDung) {
        return '<details class="ctt-tb">' +
            '<summary class="ctt-tb__tom">' +
                '<span class="ctt-tb__ic"><i class="fa-light fa-bullhorn"></i></span>' +
                '<span class="ctt-tb__noi">' +
                    '<span class="ctt-tb__td">' + ui.esc(x.TIEUDE || '') + '</span>' +
                    '<span class="tt-the__meta">' +
                        '<span><i class="fa-light fa-caret-right"></i> ' + ui.esc(x.DAOTAO_COCAUTOCHUC_TEN || '') + '</span>' +
                        '<span><i class="fa-light fa-calendar"></i> ' + ui.esc(ui.ngayGio(x.NGAYBATDAU, { chiNgay: true })) + '</span>' +
                    '</span>' +
                '</span>' +
                '<span class="ctt-tb__mui"><i class="fa-light fa-chevron-right"></i></span>' +
            '</summary>' +
            '<div class="ctt-tb__than">' + (noiDung || '') + '</div>' +
        '</details>';
    }

    /**
     * Dựng màn bảng tin.
     * @param {Element} root  thẻ gốc của màn
     * @param {Object}  o     { thongBao: true } — vẽ khối TIN QUAN TRỌNG ở đầu lưới tin
     */
    function man(root, o) {
        o = o || {};

        function uid() { return (ums.session && ums.session.userId) || ''; }
        function esc(s) { return ui.esc(s); }
        function e(v) { return v === null || v === undefined ? '' : v; }
        function arr(d) { return Array.isArray(d) ? d : []; }
        /* getRootPathImg: ảnh trống thì bản gốc lấy /Core/images/thongbao.jpg */
        /* Tin không có ảnh thì KHÔNG lấy ảnh mặc định Core/images/thongbao.jpg của bản
           gốc (người dùng chốt 23/09/2026: ảnh đó không đúng nội dung tin) — để trống,
           thẻ tự hiện biểu tượng tờ báo. */
        function anh(p) {
            if (!p) return '';
            var base = (ums.session && ums.session.rootPathUpload) || '';
            return base + '/' + String(p).replace(/^\/+/, '');
        }

        root.innerHTML =
            pat.page('Tin tức', '') +
            '<div data-z="loc">' +
            pat.filterBar([
                { key: 'q', label: 'Tìm kiếm thông tin' },
                { key: 'tu', label: 'Từ ngày', type: 'date' },
                { key: 'den', label: 'Đến ngày', type: 'date' }
            ]) +
            '<div class="tt-nguon ums-u-mb-4" data-z="nguon"></div>' +
            '</div>' +
            '<div class="tt-trang">' +
                '<div class="tt-trang__chinh">' +
                    (o.thongBao ? '<div data-z="tb"></div>' : '') +
                    '<div class="tt-luoi" data-z="luoi"></div>' +
                    '<div data-z="bai" hidden></div>' +
                '</div>' +
                '<aside class="tt-trang__phu" data-z="luuWrap" hidden>' +
                    pat.panel({ title: 'Tin đã đánh dấu', icon: 'fa-bookmark', zone: 'luu', flush: true }) +
                '</aside>' +
            '</div>';
        ui.enhance(root);

        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

        var nguon = '', dsNguon = [], dsTin = [], dsLuu = [], dangXem = '';

        /* ---- thẻ tin (lưới giữa và cột phải dùng chung) ---------------- */
        function the(x, id, boLuu) {
            return '<div class="tt-the__bao">' + (boLuu ? '<button type="button" class="ums-iconbtn ums-iconbtn--del tt-the__bo" data-boluu="' + esc(id) + '" title="Bỏ lưu"><i class="fa-light fa-bookmark-slash"></i></button>' : '') +
                '<button type="button" class="tt-the" data-tin="' + esc(id) + '">' +
                '<span class="tt-the__anh">' + (anh(x.DUONGDANANHHIENTHI) ? '<img alt="" src="' + esc(anh(x.DUONGDANANHHIENTHI)) + '" onerror="this.remove()">' : '') +
                '<i class="fa-light fa-newspaper"></i></span>' +
                '<span class="tt-the__noi"><b class="tt-the__td">' + esc(e(x.TIEUDE)) + '</b>' +
                '<span class="tt-the__meta">' +
                '<span><i class="fa-light fa-caret-right"></i> ' + esc(e(x.DAOTAO_COCAUTOCHUC_TEN)) + '</span>' +
                '<span><i class="fa-light fa-calendar"></i> ' + esc(e(x.NGAYBATDAU)) + '</span>' +
                '</span></span></button></div>';
        }

        /* ---- dải nguồn tin (nav-news của bản gốc) ---------------------- */
        function veNguon(ds) {
            z('nguon').innerHTML = [{ ID: '', TEN: 'Toàn bộ' }].concat(ds).map(function (x) {
                return '<button type="button" class="ums-btn ums-btn--sm ' +
                    (x.ID === nguon ? 'ums-btn--primary' : 'ums-btn--ghost') +
                    '" data-nguon="' + esc(x.ID) + '">' + esc(e(x.TEN)) + '</button>';
            }).join(' ');
        }

        function taiNguon() {
            veNguon([]);
            return ums.api.call({ action: ACT.nguon, func: P + 'LayDSDonViCungCapNguon', strQLSV_NguoiHoc_Id: uid() })
                .then(function (r) { dsNguon = arr(r.data); veNguon(dsNguon); })
                .catch(function (err) { ums.api.handle(err, 'nguồn tin'); });
        }

        /* ---- lưới tin -------------------------------------------------- */
        /* Ba nhóm (genTable_TinTuc gốc 30/09/2026): cột chính "Tin đào tạo" 15 tin,
           cột phụ "Tin nhà trường" + "Hoạt động sinh viên" mỗi nhóm 6 tin. */
        function veDs() {
            var q = khongDau((f('q').value || '').trim());
            var ds = !q ? dsTin : dsTin.filter(function (x) {
                return khongDau(x.TIEUDE).indexOf(q) >= 0 || khongDau(x.DAOTAO_COCAUTOCHUC_TEN).indexOf(q) >= 0;
            });
            if (!ds.length) { z('luoi').innerHTML = ui.empty('Hiện tại chưa có tin tức nào', 'fa-newspaper'); return; }
            var g = chiaNhom(ds);
            z('luoi').innerHTML =
                '<div class="csvtt-luoi">' +
                    '<div class="csvtt-luoi__chinh">' + nhomHtml('Tin đào tạo', g.daotao, { xem: 15, them: 'moRong' }) + '</div>' +
                    '<div class="csvtt-luoi__phu">' +
                        nhomHtml('Tin nhà trường', g.nhatruong, { xem: 6, them: 'moRong' }) +
                        nhomHtml('Hoạt động sinh viên', g.hoatdongsv, { xem: 6, them: 'moRong' }) +
                    '</div>' +
                '</div>';
        }
        function taiTin() {
            dong();
            z('luoi').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            return ums.api.call({
                action: ACT.tin, func: P + 'LayDSTinTuc_BangTin_NguoiDung',
                strTuKhoa: '',                           // gốc 30/09/2026: từ khoá lọc tại chỗ
                strTuNgay: f('tu').value, strDenNgay: f('den').value,
                strChuyenMuc_Id: '', strChung_UngDung_Id: (ums.state && ums.state.roleId) || '',
                dTinQuanTrong: -1, strDaoTao_CoCauToChuc_Id: nguon, dHieuLuc: 1,
                pageIndex: 1, pageSize: 50
            }).then(function (r) { dsTin = arr(r.data); veDs(); })
              .catch(function (err) { z('luoi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'bảng tin'); });
        }

        /* ---- khối thông báo = TIN QUAN TRỌNG (dTinQuanTrong = 1) -------- */
        function taiThongBao() {
            var host = z('tb');
            if (!host) return;
            ums.api.call({
                action: ACT.tin, func: P + 'LayDSTinTuc_BangTin_NguoiDung',
                strTuKhoa: '', strTuNgay: '', strDenNgay: '', strChuyenMuc_Id: '',
                strChung_UngDung_Id: (ums.state && ums.state.roleId) || '',
                dTinQuanTrong: 1, strDaoTao_CoCauToChuc_Id: '', dHieuLuc: 1,
                pageIndex: 1, pageSize: 5, silent: true
            }).then(function (r) {
                var ds = arr(r.data);
                host.innerHTML = ds.map(function (x) { return thongBaoHtml(x, x.NOIDUNG); }).join('');
            }).catch(function () { host.innerHTML = ''; });
        }

        /* ---- tin đã đánh dấu ------------------------------------------- */
        function taiLuu() {
            return ums.api.call({
                action: ACT.dsLuu, func: P + 'LayDSTinTuc_BangTin_LuuTru',
                strTuKhoa: '', strTinTuc_BangTin_Id: '', strNguoiDung_Id: uid(),
                pageIndex: 1, pageSize: 200
            }).then(function (r) {
                dsLuu = arr(r.data);
                z('luuWrap').hidden = !dsLuu.length || !!dangXem;
                z('luu').innerHTML = dsLuu.map(function (x) { return the(x, x.TINTUC_BANGTIN_ID, true); }).join('');
                nutLuu();
            }).catch(function (err) { ums.api.handle(err, 'tin đã đánh dấu'); });
        }
        function daLuu(id) { return dsLuu.some(function (x) { return x.TINTUC_BANGTIN_ID === id; }); }
        function nutLuu() {
            var b = root.querySelector('[data-a="luu"]');
            if (!b) return;
            var ok = daLuu(dangXem);
            /* Đã lưu thì nút đổi thành BỎ LƯU (bản gốc để nút "Đã lưu" trơ, không xử lý) */
            b.className = 'ums-btn ums-btn--' + (ok ? 'out-danger' : 'out-warn');
            b.setAttribute('data-a', ok ? 'boluu' : 'luu');
            b.innerHTML = ok
                ? '<i class="fa-light fa-bookmark-slash"></i><span>Bỏ lưu</span>'
                : '<i class="fa-light fa-bookmark"></i><span>Lưu đánh dấu</span>';
        }

        /* ---- bình luận -------------------------------------------------- */
        function veBinhLuan() {
            var host = z('bl');
            if (!host) return;
            ums.api.call({
                action: ACT.dsBl, func: P + 'LayDSTinTuc_BangTin_BinhLuan',
                strTuKhoa: '', strTinTuc_BangTin_Id: dangXem, strNguoiDung_Id: '',
                pageIndex: 1, pageSize: 200
            }).then(function (r) {
                var ds = arr(r.data);
                z('blDem').textContent = 'Bình luận (' + ds.length + ')';
                host.innerHTML = ds.map(function (x) {
                    return '<div class="tt-bl"><i class="fa-light fa-circle-user tt-bl__anh"></i><div>' +
                        '<b>' + esc(e(x.NGUOIDUNG_TENDAYDU)) + '</b> ' + esc(e(x.NOIDUNG)) +
                        '<div class="ums-u-faint ums-u-fz12"><i class="fa-light fa-calendar"></i> ' +
                        esc(ui.ngayGio(x.NGAYTAO)) + '</div></div></div>';
                }).join('');
            }).catch(function (err) { ums.api.handle(err, 'bình luận'); });
        }
        function guiBinhLuan() {
            var el = z('ykien'), nd = (el.value || '').trim();
            if (!nd) return;                               // gốc: val() == "" thì return
            ums.api.call({
                action: ACT.themBl, func: P + 'Them_TinTuc_BangTin_BinhLuan',
                strTinTuc_BangTin_Id: dangXem, strNguoiDung_Id: '', strNoiDung: nd
            }).then(function () { el.value = ''; veBinhLuan(); })
              .catch(function (err) { ums.api.handle(err, 'gửi ý kiến'); });
        }

        /* Bỏ lưu một tin đã đánh dấu. Bản gốc chưa có đường này (nút "Đã lưu" trơ,
           lời gọi delete_DanhDau bị chú thích) → đường GHI MỚI, thử trên host. */
        function boLuu(id) {
            if (!id) return;
            if (!ACT.xoaLuu && !(ums.state && ums.state.mode === 'demo')) {
                ui.toast('Chưa có endpoint bỏ lưu — cần chuỗi action của pkg_tintuc.Xoa_TinTuc_BangTin_LuuTru', 'warn', { title: 'Bỏ lưu' });
                return;
            }
            ui.confirm('Bỏ lưu tin này khỏi danh sách đã đánh dấu?', { title: 'Xác nhận' }).then(function (ok) {
                if (!ok) return;
                ums.api.call({
                    action: ACT.xoaLuu, func: P + 'Xoa_TinTuc_BangTin_LuuTru',
                    strTinTuc_BangTin_Id: id, strNguoiDung_Id: uid(), strNguoiThucHien_Id: uid()
                }).then(function () { ui.toast('Đã bỏ lưu', 'ok'); return taiLuu(); })
                  .catch(function (err) { ums.api.handle(err, 'bỏ lưu tin'); });
            });
        }

        /* ---- xem một tin (khung THAY CHỖ lưới, như bản gốc) ------------- */
        /* Bấm một tin: đếm lượt xem (save_DaXem) rồi lấy CHI TIẾT (getList_TinTuc_ChiTiet).
           `du` = dòng có sẵn (danh sách / đã đánh dấu / ums.state.moTin) — chỉ dùng khi
           chi tiết trả rỗng hoặc lỗi. */
        function xem(id, du) {
            if (!id) return;
            var x0 = du || dsTin.filter(function (r) { return r.ID === id; })[0] ||
                     dsLuu.filter(function (r) { return r.TINTUC_BANGTIN_ID === id; })[0];
            /* Đếm lượt xem — gốc gửi bốn ô txtAAAA không tồn tại nên luôn rỗng */
            ums.api.call({
                action: ACT.luotXem, func: P + 'Them_TinTuc_BangTin_LuotXem', silent: true,
                strTinTuc_BangTin_Id: id, strDiaChiMayTram: '', strTrinhDuyetSuDungTruyCap: '',
                strTenThietBi: '', strThoiGianMayTram: ''
            }).catch(function () {});
            return ums.api.call({ action: ACT.chiTiet, func: P + 'LayTinTuc_BangTin_ChiTiet', strTinTuc_BangTin_Id: id })
                .then(function (r) {
                    var d = r.data;
                    veBai(id, (Array.isArray(d) ? d[0] : d) || x0);
                })
                .catch(function (err) {
                    if (x0) veBai(id, x0);
                    ums.api.handle(err, 'chi tiết tin');
                });
        }
        function veBai(id, x) {
            if (!x) return;
            dangXem = id;
            var bai = z('bai');
            bai.innerHTML = pat.panel({
                title: 'Tin tức', icon: 'fa-newspaper',
                tools: ui.btn('close', { text: 'Quay lại', attr: { 'data-a': 'dong' } }) +
                ui.btn('save', { text: 'Lưu đánh dấu', icon: 'fa-bookmark', mod: 'out-warn', attr: { 'data-a': 'luu' } }),
                                       body: '<h2 class="tt-bai__td">' + esc(e(x.TIEUDE)) + '</h2>' +
                    '<div class="tt-the__meta ums-u-mb-4">' +
                    '<span><i class="fa-light fa-caret-right"></i> ' + esc(e(x.DAOTAO_COCAUTOCHUC_TEN)) + '</span>' +
                    '<span><i class="fa-light fa-calendar"></i> ' + esc(e(x.NGAYBATDAU)) + '</span></div>' +
                    '<div class="tt-bai__nd">' + e(x.NOIDUNG) +
                    '<div class="tt-bai__tg">' + esc(e(x.NGUOITAO_TENDAYDU)) + '</div></div>' +
                    '<div class="ums-u-mt-4" data-z="tep"></div>' +
                    '<div class="ums-legend ums-legend--cach">Ý kiến cá nhân</div>' +
                    '<div class="tt-gui"><textarea class="ums-textarea" rows="3" data-z="ykien" ' +
                        'placeholder="Bạn nghĩ gì về tin này?"></textarea>' +
                        ui.btn('search', { text: 'Gửi', icon: 'fa-paper-plane', mod: 'out-info', attr: { 'data-a': 'gui' } }) +
                    '</div>' +
                    '<div class="ums-u-mt-4"><b data-z="blDem">Bình luận (0)</b></div><div data-z="bl"></div>'
            });
            /* toggle_form_input gốc 30/09/2026: khung xem thay chỗ các nhóm tin, ẩn
               thanh tìm + dải nguồn + cột "Tin đã đánh dấu" (khung rộng hết trang). */
            hienDs(false);
            bai.hidden = false;
            /* Gốc: edu.system.viewFiles("txtFileDinhKem", data.ID, "SV_Files") */
            ums.files.mount(bai.querySelector('[data-z="tep"]'), { api: 'SV_Files', readonly: true }).load(x.ID || id);
            nutLuu();
            veBinhLuan();
        }
        /** Hiện / ẩn phần danh sách (thanh tìm, nguồn, khối tin quan trọng, các nhóm, cột đã đánh dấu) */
        function hienDs(co) {
            z('loc').hidden = !co;
            z('luoi').hidden = !co;
            if (z('tb')) z('tb').hidden = !co;
            z('luuWrap').hidden = !co || !dsLuu.length;
        }
        function dong() {
            dangXem = '';
            var bai = z('bai');
            bai.hidden = true; bai.innerHTML = '';
            hienDs(true);
        }

        /* ---- sự kiện ---------------------------------------------------- */
        root.addEventListener('click', function (ev) {
            var t = ev.target;
            if (t.closest('[data-a="search"]')) { taiTin(); return; }
            var xt = t.closest('[data-a="xemthem"]');
            if (xt) { moRong(xt); return; }
            var n = t.closest('[data-nguon]');
            if (n) { nguon = n.getAttribute('data-nguon'); veNguon(dsNguon); taiTin(); return; }
            var th = t.closest('[data-tin]');
            if (th) { xem(th.getAttribute('data-tin')); return; }
            if (t.closest('[data-a="dong"]')) { dong(); return; }
            if (t.closest('[data-a="gui"]')) { guiBinhLuan(); return; }
            var bo = t.closest('[data-boluu]');
            if (bo) { boLuu(bo.getAttribute('data-boluu')); return; }
            if (t.closest('[data-a="boluu"]')) { boLuu(dangXem); return; }
            if (t.closest('[data-a="luu"]')) {
                ums.api.call({
                    action: ACT.themLuu, func: P + 'Them_TinTuc_BangTin_LuuTru',
                    strTinTuc_BangTin_Id: dangXem, strNguoiDung_Id: uid()
                }).then(function () { ui.toast('Lưu thành công', 'ok'); return taiLuu(); })
                  .catch(function (err) { ums.api.handle(err, 'lưu đánh dấu'); });
            }
        });
        root.addEventListener('keydown', function (ev) {
            if (ev.key !== 'Enter') return;
            var t = ev.target;
            if (t.matches('[data-f="q"]')) { ev.preventDefault(); clearTimeout(hTu); veDs(); return; }
            if (t.matches('[data-z="ykien"]') && !ev.shiftKey) { ev.preventDefault(); guiBinhLuan(); }
        });

        /* Gõ từ khoá → lọc tại chỗ (250 ms); đổi Từ ngày / Đến ngày → tải lại (400 ms) */
        var hTu = null, hNgay = null;
        root.addEventListener('input', function (ev) {
            if (!ev.target.matches('[data-f="q"]')) return;
            clearTimeout(hTu);
            hTu = setTimeout(function () { if (!dangXem) veDs(); }, 250);
        });
        function doiNgay(ev) {
            if (!ev.target.matches('[data-f="tu"], [data-f="den"]')) return;
            clearTimeout(hNgay);
            hNgay = setTimeout(taiTin, 400);
        }
        root.addEventListener('input', doiNgay);
        root.addEventListener('change', doiNgay);

        /* ---- nạp lần đầu ------------------------------------------------ */
        taiNguon();
        if (o.thongBao) taiThongBao();
        taiTin().then(function () {
            var mo = ums.state && ums.state.moTin;
            if (!mo) return;
            delete ums.state.moTin;
            xem(mo.ID, mo);
        });
        taiLuu();
    }

    ums.csvTinTuc = { man: man, phanNhom: phanNhom, chiaNhom: chiaNhom, nhomHtml: nhomHtml, moRong: moRong, NHOM: NHOM };
})();
