/* =========================================================================
   Quản lý hồ sơ - mở rộng (tuyển sinh)
   Bản gốc: ApisQuanlyTuyenSinh/Modules/hoso/html/quanlyhosomorong.html + script/quanlyhosomorong.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" (Năm · Kế hoạch · Đợt · Hình thức · Hệ · Khóa · từ khoá · Tìm kiếm ·
   Xuất báo cáo) → khung "Danh sách (n)" với 5 nút (Đọc dữ liệu từ nguồn API · Tải file · Thêm mới · Tổng hợp dữ liệu ·
   Xét trúng tuyển) → bảng: STT · ô đánh dấu · Chi tiết (sửa) · các cột theo CÂY "cấu hình hiển thị hồ sơ" (tiêu đề
   nhiều tầng THANHPHAN_CHA_ID → lá) → chân khung "Xóa". Vùng "Đọc dữ liệu từ nguồn API" thay chỗ danh sách
   (zone-bus). Hộp "Xét trúng tuyển" hai bảng (Ngành trúng tuyển · Hủy | Ngành đăng ký · Trúng tuyển).

   Lời gọi (chép nguyên, GET/POST như gốc) — nguồn ô lọc, xoá, Thêm mới, sửa, gộp tệp: _chung.js (ums.tsHoSo)
     TS_DuLieu/LayDSCauHienThiHoSo          GET  strTS_KeHoachTuyenSinh_Id, strDoiTuongDuTuyen_Id, strDotTuyenSinh_Id,
                                                 strNguoiThucHien_Id → THANHPHAN_ID, THANHPHAN_CHA_ID, THANHPHAN_TEN
     TS_ThongTin_Chung/LayDSTS_HoSoDuTuyen  GET  (như Quản lý hồ sơ) — chỉ gọi khi cây có ít nhất một lá
     TS_DuLieu/LayDSDuLieuHienThiHoSo       GET  strTS_HoSoDuTuyen_Id, strNguoiThucHien_Id — MỖI hồ sơ một lời gọi
                                                 → THANHPHAN_ID, KIEUDULIEU (FILE → SV_Files · ANHCANHAN → ảnh), THANHPHAN_GIATRI
     TS_TinhToan/ThucHienTongHopDuLieu      GET  strTS_KeHoachTuyenSinh_Id, strDoiTuongDuTuyen_Id, strDotTuyenSinh_Id,
                                                 strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strNam, strNguoiThucHien_Id
     TS_ThiSinh_NguyenVong/LayDanhSach      GET  (Ngành đăng ký của MỘT hồ sơ) → ID, NGANHNGHE_MA, NGANHNGHE_TEN
     TS_ThiSinh_NguyenVong/LayDSTS_ThiSinh_TrungTuyen GET strTS_KeHoachTuyenSinh_Id, strTS_HoSoDuTuyen_Id (đợt/đối tượng '')
     TS_XetTuyen/Them_TS_ThiSinh_TrungTuyen POST strTS_ThiSinh_NguyenVong_Id — mỗi ngành một lời gọi
     TS_XetTuyen/Xoa_TS_ThiSinh_TrungTuyen  POST strIds — mỗi ngành một lời gọi
     CM_UngDung/CustomAPIGet                POST strHost, strApi '', strLoaiXacThuc, strMaXacThuc, strData '' → JSON.parse(Data).data
     pkg_TuyenSinh_Import.Import_TS_HoSo_DuLieu_API (TS_Import_MH, mã hoá)  strTS_HoSoTuyenSinh_Ma, strTS_KeHoachTuyenSinh_Id,
                                                 strMaTruongThongTin, strTruongThongTin_GiaTri, dChoPhepSuaDuLieu (1 / không gửi),
                                                 strDotTuyenSinh_Id — MỖI (hồ sơ × trường của nguồn) một lời gọi
     Xuất báo cáo: ums.report.mount — các khoá lọc + strTS_HoSoDuTuyen_Id cho mỗi hồ sơ đã đánh dấu.

   Lỗi gốc đã sửa (làm theo ý định):
     · "Tổng hợp dữ liệu" gửi ĐẢO hai ô: strDoiTuongDuTuyen_Id = ô Đợt, strDotTuyenSinh_Id = ô Hình thức → gửi đúng ô.
     · getUrl_NguyenVong báo lỗi bằng biến không tồn tại (obj_list) → ReferenceError; nay hiện Message.
   Khác gốc / tự chốt:
     · Năm → Kế hoạch theo luật cha → con: chưa chọn năm thì Kế hoạch KHOÁ (gốc nạp sẵn mọi kế hoạch lúc mở màn).
     · "Tổng hợp dữ liệu" hỏi lại trước khi chạy (gốc chạy ngay).
     · Nguồn API: gốc VIẾT CỨNG tài khoản / mật khẩu / mã xác thực của ba máy chủ ngoài (CRM cmcu, tuyensinh.uhd,
       hrm.phenikaa) ngay trong JS. KHÔNG chép (như CMS config_app 25/9): giữ địa chỉ + cách chọn nguồn theo tên máy chủ,
       để trống phần bí mật ở bảng NGUON dưới — thiếu thì báo, không gửi. Cần quản trị đưa bí mật về cấu hình phía máy chủ.
     · "Duyệt" dữ liệu nguồn: bắt buộc chọn Kế hoạch (gốc gửi rỗng); gửi hàng loạt có tiến độ (gốc bật một thông báo
       "Thực hiện thành công" cho TỪNG lời gọi).
     · Hộp Xét trúng tuyển: nút "Hủy" (xoá nhiều) ở chân hộp (ui.dialog xoa); bấm khi chưa chọn thì báo.
     · Hai nút mũi tên trôi (btnGoLeft/Right cuộn bảng 200px) bỏ — bảng ums.ui.table kéo chuột / vuốt ngang được.
     · Mã chết của gốc KHÔNG chuyển: hộp "Chi tiết nguyện vọng" và "Lịch sử" (bảng mở rộng không vẽ nút mở hai hộp này),
       actionTable (đang chú thích), genHtml_TruongThongTin, .btnAdd / toggle_edit (zoneEdit không tồn tại).
   Cặp cha → con: Năm → Kế hoạch → Hệ → Khóa, Kế hoạch → Đợt, Kế hoạch → Hình thức (pat.chain).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tsHoSo, e = T.e, esc = ui.esc;
    var root = document.getElementById('ts-quanlyhosomorong');
    if (!root) return;

    /* Nguồn API ngoài — chọn theo tên máy chủ như gốc. Phần BÍ MẬT để trống (xem chú thích đầu tệp). */
    var NGUON_MAC_DINH = { ten: 'CRM', host: 'https://crm.cmcu.edu.vn/api/resource/Nhaphoc?fields=["*"]&limit_page_length=5000000',
        loai: 'Authorization', ma: '' /* "Basic " + base64(khoá:bí mật) */, cot: 'mssv', loc: true };
    var NGUON = [
        { khop: '103.159.50.116', ten: 'tuyensinh.uhd', host: 'https://tuyensinh.uhd.edu.vn/api/admission/user-registration/user-admitted',
          loai: 'Authorization', ma: '' /* "Bearer …" */, cot: 'userId' },
        { khop: 'phenikaa-uni.edu.vn', ten: 'hrm.phenikaa', host: 'https://hrm.phenikaa-uni.edu.vn/hrm/api/v1/profiles/apis?page=1&pageSize=100000',
          them: '' /* "&username=…&password=…" */, loai: '', ma: '', cot: '', ds: 'listProfile', canThem: true }
    ];
    function nguon() {
        var h = (ums.session && ums.session.host) || location.origin;
        return NGUON.filter(function (x) { return h.indexOf(x.khop) !== -1; })[0] || NGUON_MAC_DINH;
    }

    root.innerHTML =
        '<div data-v="ds">' +
            pat.page('Quản lý hồ sơ - mở rộng', '<div data-z="bc"></div>') +
            pat.filterBar(T.locFields()) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'ds',
                tools: ui.btn('add', { text: 'Đọc dữ liệu từ nguồn API', mod: 'out-primary', icon: 'fa-cloud-arrow-down', attr: { 'data-a': 'nguon' } }) +
                    ui.btn('excel', { text: 'Tải file', icon: 'fa-cloud-arrow-down', attr: { 'data-a': 'taifile' } }) +
                    ui.btn('add', { attr: { 'data-a': 'them' } }) +
                    ui.btn('search', { text: 'Tổng hợp dữ liệu', mod: 'out-primary', icon: 'fa-paper-plane', attr: { 'data-a': 'tonghop' } }) +
                    ui.btn('confirm', { text: 'Xét trúng tuyển', mod: 'primary', icon: 'fa-paper-plane', attr: { 'data-a': 'xet' } }) +
                    ui.xoaChon('input[data-hs]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-v="nguon" hidden>' +
            pat.panel({ title: 'Đọc dữ liệu từ nguồn API', icon: 'fa-cloud-arrow-down',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('confirm', { text: 'Duyệt', attr: { 'data-a': 'duyet' } }),
                body: '<div class="ums-filter">' +
                    '<div class="ums-field"><input class="ums-input" data-g="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'timnguon' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit"><label class="ums-check"><input type="checkbox" data-g="sua"> ' +
                        '<span>Cho phép cập nhật lại dữ liệu nếu học viên đã duyệt</span></label></div></div>' }) +
            pat.panel({ title: 'Dữ liệu nguồn', icon: 'fa-table-list', count: 'nn', flush: true, zone: 'ng' }) +
        '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
    function g(k) { return root.querySelector('[data-g="' + k + '"]'); }
    var ngBang = z('ng');
    ngBang.innerHTML = ui.empty('Nhập từ khoá (mã số) rồi bấm "Tìm kiếm" — để trống là đọc toàn bộ', 'fa-hand-pointer');
    ui.enhance(root);
    T.ganChon(z('ds'), 'data-hs');
    T.ganChon(ngBang, 'data-ng');

    var st = { trang: 1, co: 10, rows: [], la: [], the: 0, tep: {}, nguon: [], cot: '' };
    z('ds').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');

    var L = T.noiLoc(root, { namKH: true, onTim: function () { timKiem(); } });
    function loc() {
        return { strTuKhoa: L.v('q'), strTS_KeHoachTuyenSinh_Id: L.v('kh'), strDaoTao_HeDaoTao_Id: L.v('he'),
            strDaoTao_KhoaDaoTao_Id: L.v('khoa'), strDotTuyenSinh_Id: L.v('dot'), strDoiTuongDuTuyen_Id: L.v('ht'),
            strNam: L.v('nam'), strNguoiTao_Id: '' };
    }

    /* ---------- Cây cấu hình hiển thị → cột ---------- */
    function timKiem() {
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        T.rows({ action: 'TS_DuLieu/LayDSCauHienThiHoSo', method: 'GET', strTS_KeHoachTuyenSinh_Id: L.v('kh'),
            strDoiTuongDuTuyen_Id: L.v('ht'), strDotTuyenSinh_Id: L.v('dot'), strNguoiThucHien_Id: T.uid() }).then(function (cay) {
            st.la = laCay(cay);
            tai(1);
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'cấu hình hiển thị hồ sơ'); });
    }
    /** insertHeaderTable: duyệt sâu từ các gốc (THANHPHAN_CHA_ID rỗng) — lá thành cột, tổ tiên thành tầng tiêu đề */
    function laCay(cay) {
        var la = [];
        function con(id) { return cay.filter(function (x) { return (x.THANHPHAN_CHA_ID || null) === (id || null); }); }
        function di(n, duong) {
            var k = con(n.THANHPHAN_ID);
            if (!k.length) { la.push({ id: e(n.THANHPHAN_ID), ten: e(n.THANHPHAN_TEN), group: duong }); return; }
            k.forEach(function (x) { di(x, duong.concat([e(n.THANHPHAN_TEN)])); });
        }
        con(null).forEach(function (g) { di(g, []); });
        return la;
    }

    /* ---------- Danh sách hồ sơ ---------- */
    function tai(trang) {
        if (trang) st.trang = trang;
        if (!st.la.length) {
            z('n').textContent = '';
            z('ds').innerHTML = ui.empty('Không có dữ liệu để hiển thị');
            ui.toast('Không có dữ liệu để hiển thị', 'warn');
            return;
        }
        var the = ++st.the;
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var c = loc();
        c.action = 'TS_ThongTin_Chung/LayDSTS_HoSoDuTuyen'; c.method = 'GET';
        c.pageIndex = st.trang; c.pageSize = st.co; c.silent = true;
        ums.api.call(c).then(function (r) {
            if (the !== st.the) return;
            st.rows = Array.isArray(r.data) ? r.data : [];
            st.tep = {};
            var tong = Number(r.pager) || st.rows.length;
            z('n').textContent = '(' + tong + ')';
            var cols = [
                T.cotChon('data-hs'),
                { title: 'Chi tiết', cls: 'is-center', render: function (x) { return T.suaLink(x.ID); } }
            ].concat(st.la.map(function (l) {
                return { title: l.ten, group: l.group, render: function (x) { return '<span data-o="' + esc(e(x.ID) + '_' + l.id) + '"></span>'; } };
            }));
            ui.table({ el: z('ds'), rows: st.rows, columns: cols, empty: 'Không có hồ sơ',
                page: { index: st.trang, size: st.co, total: tong, onChange: tai, onSize: function (s) { st.co = s; tai(1); } } });
            napO(the);
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách hồ sơ'); });
    }
    /* getData_HoSo — mỗi hồ sơ một lời gọi (6 luồng); nhớ đường dẫn ảnh / tệp để "Tải file" */
    function napO(the) {
        T.hang(st.rows.map(function (r) {
            return function () {
                if (the !== st.the) return null;
                var id = e(r.ID);
                return T.rows({ action: 'TS_DuLieu/LayDSDuLieuHienThiHoSo', method: 'GET', strTS_HoSoDuTuyen_Id: id,
                    strNguoiThucHien_Id: T.uid() }).then(function (d) {
                    if (the !== st.the) return null;
                    var ghi = st.tep[id] = { anh: [], tep: [] };
                    var cho = [];
                    d.forEach(function (x) {
                        var o = z('ds').querySelector('[data-o="' + id + '_' + e(x.THANHPHAN_ID) + '"]');
                        if (!o) return;
                        if (x.KIEUDULIEU === 'FILE') {
                            cho.push(T.tep(id + e(x.THANHPHAN_ID)).then(function (ds) {
                                if (the !== st.the) return;
                                o.innerHTML = T.tepHtml(ds);
                                ghi.tep = ghi.tep.concat(ds);
                            }, function () {}));
                        } else if (x.KIEUDULIEU === 'ANHCANHAN') {
                            if (x.THANHPHAN_GIATRI) { o.innerHTML = pat.anhNguoi(x.THANHPHAN_GIATRI); ghi.anh.push(e(x.THANHPHAN_GIATRI)); }
                        } else {
                            o.textContent = e(x.THANHPHAN_GIATRI);
                        }
                    });
                    return Promise.all(cho);
                });
            };
        }), 6);
    }

    /* ---------- Tải file (btnDownloadAllFile) — ảnh "MASO_HỌ TÊN.đuôi", tệp "MASO_n_tên" ---------- */
    function taiFile() {
        var arrUrl = [], arrTen = [];
        st.rows.forEach(function (r) {
            var g = st.tep[e(r.ID)];
            if (!g) return;
            var n = 0;
            g.anh.forEach(function (u) {
                arrUrl.push(u);
                arrTen.push(e(r.MASO) + '_' + e(r.HODEM) + ' ' + e(r.TEN) + (u.lastIndexOf('.') >= 0 ? u.substring(u.lastIndexOf('.')) : ''));
            });
            g.tep.forEach(function (f) { arrUrl.push(f.path); arrTen.push(e(r.MASO) + '_' + (++n) + '_' + f.name); });
        });
        T.gopFile(arrUrl, arrTen);
    }

    /* ---------- Tổng hợp dữ liệu ---------- */
    function tongHop() {
        ui.confirm('Thực hiện tổng hợp dữ liệu theo điều kiện đang lọc?', { title: 'Tổng hợp dữ liệu', ok: 'Thực hiện' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TS_TinhToan/ThucHienTongHopDuLieu', method: 'GET', strTS_KeHoachTuyenSinh_Id: L.v('kh'),
                strDoiTuongDuTuyen_Id: L.v('ht'), strDotTuyenSinh_Id: L.v('dot'), strDaoTao_HeDaoTao_Id: L.v('he'),
                strDaoTao_KhoaDaoTao_Id: L.v('khoa'), strNam: L.v('nam'), strNguoiThucHien_Id: T.uid() })
                .then(function () { ui.toast('Thực hiện thành công', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'tổng hợp dữ liệu'); });
        });
    }

    /* ---------- Hộp "Xét trúng tuyển" (một hồ sơ) ---------- */
    function xetTrungTuyen() {
        var chon = T.chon(z('ds'), 'data-hs');
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        if (chon.length > 1) { ui.toast('Chỉ được chọn 1 đối tượng!', 'warn'); return; }
        var hs = chon[0].id;
        var cotN = [{ title: 'Mã ngành', prop: 'NGANHNGHE_MA', cls: 'is-nowrap' }, { title: 'Tên ngành', prop: 'NGANHNGHE_TEN' }];
        var dlg = ui.dialog({
            title: 'Xét trúng tuyển', icon: 'fa-paper-plane', size: 'xl',
            body: '<div class="ums-grid ums-grid--2">' +
                '<div><div class="ums-legend">Ngành trúng tuyển</div><div data-x="tt"></div></div>' +
                '<div><div class="ums-legend">Ngành đăng ký</div><div data-x="dk"></div></div></div>',
            xoa: { chon: 'input[data-tt]', text: 'Hủy', onClick: function () { huy(); } },
            buttons: [{ text: 'Trúng tuyển', mod: 'primary', icon: 'fa-plus', onClick: function () { trungTuyen(); return false; } }]
        });
        var B = dlg.body;
        function x(k) { return B.querySelector('[data-x="' + k + '"]'); }
        T.ganChon(B, 'data-tt'); T.ganChon(B, 'data-dk');
        function nap() {
            x('tt').innerHTML = x('dk').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            T.rows({ action: 'TS_ThiSinh_NguyenVong/LayDSTS_ThiSinh_TrungTuyen', method: 'GET', strTuKhoa: '', strNganhNghe_Id: '',
                strDoiTuongDuTuyen_Id: '', strDotTuyenSinh_Id: '', strTS_KeHoachTuyenSinh_Id: L.v('kh'), strTS_HoSoDuTuyen_Id: hs,
                strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) {
                ui.table({ el: x('tt'), rows: r, columns: cotN.concat([T.cotChon('data-tt')]), empty: 'Chưa có ngành trúng tuyển' });
            }, function (err) { x('tt').innerHTML = ui.fail(err.message); });
            T.rows({ action: 'TS_ThiSinh_NguyenVong/LayDanhSach', method: 'GET', strTuKhoa: '', strNganhNghe_Id: '',
                strDoiTuongDuTuyen_Id: L.v('ht'), strDotTuyenSinh_Id: L.v('dot'), strTS_KeHoachTuyenSinh_Id: L.v('kh'),
                strTS_HoSoDuTuyen_Id: hs, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) {
                ui.table({ el: x('dk'), rows: r, columns: cotN.concat([T.cotChon('data-dk')]), empty: 'Chưa có ngành đăng ký' });
            }, function (err) { x('dk').innerHTML = ui.fail(err.message); });
        }
        function trungTuyen() {
            var ids = T.chon(x('dk'), 'data-dk');
            if (!ids.length) { ui.toast('Vui lòng chọn ngành đăng ký!', 'warn'); return; }
            ui.batch(ids.map(function (i) {
                return { action: 'TS_XetTuyen/Them_TS_ThiSinh_TrungTuyen', strTS_ThiSinh_NguyenVong_Id: i.id, strNguoiThucHien_Id: T.uid() };
            }), { title: 'Đang xét trúng tuyển', okText: 'Thực hiện thành công', show: true }).then(nap);
        }
        function huy() {
            var ids = T.chon(x('tt'), 'data-tt');
            if (!ids.length) return;
            ui.confirm('Hủy trúng tuyển ' + ids.length + ' ngành đã chọn?', { tone: 'bad', ok: 'Hủy', title: 'Hủy trúng tuyển' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (i) {
                    return { action: 'TS_XetTuyen/Xoa_TS_ThiSinh_TrungTuyen', strIds: i.id, strNguoiThucHien_Id: T.uid() };
                }), { title: 'Đang hủy', okText: 'Thực hiện thành công', show: true }).then(nap);
            });
        }
        nap();
    }

    /* ---------- Vùng "Đọc dữ liệu từ nguồn API" ---------- */
    function moNguon(mo) {
        ui.swap(vung(mo ? 'ds' : 'nguon'), vung(mo ? 'nguon' : 'ds'));
        if (!mo && st.la.length) tai();          // toggle_form: về danh sách thì nạp lại
    }
    function timNguon() {
        var ng = nguon();
        if ((ng.loai && !ng.ma) || (ng.canThem && !ng.them)) {
            ui.toast('Chưa khai mã xác thực của nguồn API "' + ng.ten + '" — cần quản trị cấu hình (bản gốc viết cứng trong mã, bản mới không chép).', 'warn', { timeout: 9000 });
            return;
        }
        var ma = g('q').value.trim();
        var host = ng.host + (ng.them || '') + (ng.loc && ma ? '&filters=[["mssv","=","' + ma + '"]]' : '');
        st.cot = ng.cot;
        ngBang.innerHTML = ui.empty('Đang đọc dữ liệu…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'CM_UngDung/CustomAPIGet', strHost: host, strApi: '', strLoaiXacThuc: ng.loai, strMaXacThuc: ng.ma,
            strData: '', strNguoiThucHien_Id: T.uid() }).then(function (r) {
            var d = r.data;
            try { d = typeof d === 'string' ? JSON.parse(d).data : (d && d.data) || d; } catch (err) { d = []; }
            if (ng.ds && d) d = d[ng.ds];
            st.nguon = Array.isArray(d) ? d : [];
            veNguon();
        }).catch(function (err) { ngBang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'đọc nguồn API'); });
    }
    function chuO(v) { return v !== null && typeof v === 'object' ? JSON.stringify(v) : e(v); }
    function veNguon() {
        var ds = st.nguon;
        z('nn').textContent = '(' + ds.length + ')';
        var khoa = ds.length ? Object.keys(ds[0]) : [];
        ui.table({ el: ngBang, rows: ds, empty: 'Không có dữ liệu', columns: [
            { head: '<input type="checkbox" data-all="data-ng" title="Chọn tất cả">', cls: 'is-center', width: '44px',
              render: function (x, i) { return '<input type="checkbox" data-ng="' + i + '">'; } }
        ].concat(khoa.map(function (k) { return { title: k, render: function (x) { return esc(chuO(x[k])); } }; })) });
    }
    function duyet() {
        var dong = Array.prototype.filter.call(ngBang.querySelectorAll('tbody input[data-ng]'), function (c) { return c.checked; })
            .map(function (c) { return st.nguon[Number(c.getAttribute('data-ng'))]; }).filter(Boolean);
        if (!dong.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        if (!L.v('kh')) { ui.toast('Bạn cần chọn kế hoạch tuyển sinh (ô lọc phía trên danh sách)', 'warn'); return; }
        var sua = g('sua').checked ? 1 : undefined;
        var goi = [];
        dong.forEach(function (d) {
            Object.keys(d).forEach(function (k) {
                goi.push({ action: 'TS_Import_MH/CCwxLjM1HhUSHgkuEi4eBTQNKCQ0HgARCAPP', func: 'pkg_TuyenSinh_Import.Import_TS_HoSo_DuLieu_API',
                    strChucNang_Id: T.cn(), strTS_HoSoTuyenSinh_Ma: chuO(d[st.cot]), strTS_KeHoachTuyenSinh_Id: L.v('kh'),
                    strMaTruongThongTin: k, strTruongThongTin_GiaTri: chuO(d[k]), dChoPhepSuaDuLieu: sua,
                    strDotTuyenSinh_Id: L.v('dot'), strNguoiThucHien_Id: T.uid() });
            });
        });
        ui.batch(goi, { title: 'Đang duyệt ' + dong.length + ' hồ sơ', concurrency: 4, okText: 'Thực hiện thành công', show: true });
    }

    /* ---------- Xuất báo cáo ---------- */
    ums.report.mount(z('bc'), { collect: function (add) {
        var c = loc();
        Object.keys(c).forEach(function (k) { add(k, c[k]); });
        T.chon(z('ds'), 'data-hs').forEach(function (x) { add('strTS_HoSoDuTuyen_Id', x.id); });
    } });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'them') T.themMoi('/pages/tuyensinh.aspx');
        else if (a === 'xoa') T.xoaHoSo(T.chon(z('ds'), 'data-hs').map(function (x) { return x.id; })).then(function (ok) { if (ok) tai(); });
        else if (a === 'tonghop') tongHop();
        else if (a === 'xet') xetTrungTuyen();
        else if (a === 'taifile') taiFile();
        else if (a === 'nguon') moNguon(true);
        else if (a === 'dong') moNguon(false);
        else if (a === 'timnguon') timNguon();
        else if (a === 'duyet') duyet();
    });
    g('q').addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); timNguon(); }
    });
})();
