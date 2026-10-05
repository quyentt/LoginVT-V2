/* =========================================================================
   Giám sát thi — Coi thi (cổng cán bộ)
   Bản gốc: ApisCongCanBo/Modules/coithi/html/coithi.html + script/coithi.js
   ---------------------------------------------------------------------------
   Danh sách phòng: QLTTN_QuanLyThi/LayDS_PhongThiCanBo_GST — khung ums.coiThi.manPhong (_phongthi.js),
     có ô lọc Trạng thái phòng; đơn vị QLTTN_ThongTin/LayDS_DonViByUserId_GST.
   Chi tiết phòng (bản gốc: modal "Phòng thi"):
     LayDS_ChiTietPhongThi_KetQua GET strTuKhoa '', strExamRoomInfoId, strNguoiTao_Id, strCoTinhLaiDiem
       ('0' khi mở / Refresh / sau xử lý tình huống; '1' khi "Xem kết quả thi", chọn phần thi, khởi tạo lại đề),
       strExamStructPartId, trang 1 × 100000000 → { ChiTietPhongThi, StudentFiles }
     LayDS_ExamRoomInfoDetail → khối "Thông tin đề thi" + EXAMSTRUCTID → phần thi (LayDS_ExamStructPart):
       đề KHÔNG có tổng thời gian (TONGTHOIGIAN rỗng) → ô "Phần thi" đổ các phần; có → ô rỗng.
     LayDS_ThiSinhGianLan mỗi 30 giây → bật chữ "Gian lận" theo STUDENTEXAMROOMID (= ID dòng).
     LayDS_CauHinhThiTracNghiem: mã COITHI.* có GIATRI "0" → ẩn nút tương ứng ở hộp tình huống.
     Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao", không có vùng Import) —
       ExamRoomInfo_Id, ExamstructPartId, strNguoiDangNhap_Id, strChucNang_Id.
     Công nhận điểm (POST): Sua_CongNhanDiem strId = STUDENTEXAMROOMPARTID, hoặc Sua_CongNhanDiem_ALL
       strId = ID khi đề có tổng thời gian; strMark, strGhiChu.
       Ô điểm: MARK; MARK rỗng mà đã thi xong / hết giờ → DIEMTINH (để "công nhận" điểm máy tính).
   Hộp "Xử lý tình huống thi" (thí sinh đã đánh dấu; strStudentExamRoomIds = ID dòng nối phẩy), đều GET:
     LayDS_ThiSinh_TinhHuongThi · XulyTinhHuongThi (strKhoiTaoNote KETTHUCLAMBAI / KHOITAOLAITHOIGIANLAMBAI /
     TAMDUNGTHI / THISINHTIEPTUCLAMBAI / CONGTHEMTHOIGIANLAMBAI + strAddTime) · KhoiTaoLaiDeChoThiSinh ·
     Save_DoiMay · Save_ViPhamQuyCheThi — chọn vi phạm (trừ mã 3442B9AD42EC44DF85D8A2322067B2EE) thì
     tự Kết thúc bài; để trống thì tự Tiếp tục làm bài, rồi mới lưu vi phạm (như gốc).
     Phần thi gửi đi: đề không tổng thời gian → các ô đã đánh dấu; có → TẤT CẢ các phần (như gốc).
   Không chép / khác bản gốc:
     · "Chi tiết bài thi": hàm gốc `return;` ở dòng đầu → giữ nút, đặt disabled.
     · LayDS_MatKhauPhanThi: gốc gọi nhưng chỉ vẽ vào vùng đã chú thích → bỏ lời gọi.
     · Hỏi gian lận định kỳ: gốc chạy từ lúc mở màn (cả khi chưa mở phòng nào) → chỉ chạy khi đang xem một phòng.
     · Công nhận điểm: gốc KHÔNG nạp lại sau khi lưu (bấm lần hai lưu lặp) → nạp lại; dòng chỉ đổi ghi chú
       cũng được lưu (gốc bỏ qua); khi đề có tổng thời gian gốc đọc nhầm ô ghi chú (luôn rỗng) → gửi đúng ô.
     · Ô "số phút" cộng thêm: gốc ẩn theo mã COITHI.TIEPTUCLAMBAI (nhầm) → ẩn cùng nút "Cộng thêm t/g".
   ---------------------------------------------------------------------------
   KHUNG DÙNG LẠI — ums.coiThi.gst (từ 2026-10-05, cho màn anh em ApisQuanLyThiTracNghiem/quanlythi/giamsatthi):
     gst.nap({ cauHinh })          nạp cấu hình COITHI.* (cauHinh === false → bỏ qua) + danh mục vi phạm quy chế
     gst.chiTiet(room, host, o)    khung chi tiết phòng; mọi tuỳ chọn MẶC ĐỊNH = hành vi Cổng cán bộ ở trên:
       phanTrang      true → thí sinh phân trang máy chủ (PageNumber / ItemPerPage như gốc QLTTN); mặc định 1 × 100000000
       luonTinhLai    true → strCoTinhLaiDiem luôn '1' (gốc QLTTN); mặc định '0' / '1' theo thao tác
       tongThoiGian   false → bỏ luật TONGTHOIGIAN (gốc QLTTN không xét)
       anhThiSinh     true → cột Mã thí sinh kèm ảnh Upload/Anh/<mã>.jpg
       matKhau        false → không hiện Mật khẩu phòng thi
       baoCao         'chon' → ô "Chọn loại báo cáo" (BAOCAODIEM) + "Tải file" qua ums.coiThi.baoCao (URL báo cáo hệ thống);
                      mặc định ums.report.mount
       congNhan       false → nút "Công nhận điểm" giữ nhưng disabled (bản gốc không có xử lý)
       ketQuaThi      true → "Chi tiết bài thi" chạy (TTN_ThiSinh/gen_KetQuaThi → ums.coiThi.xemBaiThi); mặc định disabled
       xemKetQua      false → không có nút "Xem kết quả thi"
       gianLan        false → không hỏi gian lận định kỳ, không cột nhấp nháy
       doiMay         false → hộp tình huống không có "Cho phép TS đổi máy"
       viPhamLuonKetThuc  true → "Vắng thi/Phạm quy" luôn Kết thúc bài rồi lưu vi phạm (gốc QLTTN), bỏ luật mã 3442B9AD…
       chuXuLy        chữ nút mở hộp tình huống (mặc định "Xử lý tình huống thi")
     Thêm 2026-10-05 (QLTTN quanlythi/quanlythi — màn quản trị có nhiều nút hơn):
       baoCaoMa       [[mã, chữ]…] cho ô "Chọn loại báo cáo" (mặc định chỉ BAOCAODIEM)
       baoCaoChay(code, partId)  tự chạy báo cáo (thay ums.coiThi.baoCao — màn gửi thêm khoá tokenJWT, strExamRoomInfoIds…)
       tools          { truocPhan, sauPhan, sauCongNhan, cuoi } — HTML nút thêm vào thanh công cụ (nút mang data-ct riêng, xử lý ở onCt)
       onCt(k, api)   nhận các data-ct không phải của khung
       tenBam(r, api) họ tên là nút → gọi khi bấm (biểu mẫu thí sinh)
       tinhLaiSauGhi  true → sau công nhận / xử lý tình huống nạp lại với strCoTinhLaiDiem '1' (gốc QLTTN); mặc định '0'
       sanSang(api)   nhận api ngay khi dựng: { host, room, tai(tinhLai, page), taiDe(), rows(), files(), phanId(), phan(), de(), tong, daChon() }
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }
    var G = P.gst = P.gst || {};

    var cauHinh = {}, viPham = [];
    G.nap = function (o) {
        o = o || {};
        if (o.cauHinh !== false) g(QL + 'LayDS_CauHinhThiTracNghiem', { versionAPI: V, strNguoiDung_Id: P.uid() })
            .then(function (r) { arr(r.data).forEach(function (x) { cauHinh[x.CODE] = e(x.GIATRI); }); })
            .catch(function (err) { ums.api.handle(err, 'cấu hình thi trắc nghiệm'); });
        g('QLTTN_QuanLyTHI/LayDS_ViPhamQuyChe', { versionAPI: V })
            .then(function (r) { viPham = arr(r.data); })
            .catch(function (err) { ums.api.handle(err, 'vi phạm quy chế thi'); });
    };

    G.chiTiet = function (room, host, o) {
        o = o || {};
        var tong = o.tongThoiGian === false ? false : e(room.TONGTHOIGIAN) !== '';
        var s = { rows: [], files: [], phan: [], de: {}, page: 1, size: 10 };
        var baoCaoChon = o.baoCao === 'chon', T = o.tools || {};
        var TL = o.tinhLaiSauGhi ? '1' : '0';     // strCoTinhLaiDiem khi nạp lại sau một thao tác ghi
        var maBC = o.baoCaoMa || [['BAOCAODIEM', 'Báo cáo điểm']];
        host.innerHTML = P.thongTin(room, { matKhau: o.matKhau !== false }) +
            pat.panel({ title: 'Danh sách thí sinh', icon: 'fa-users', count: 'tsn', flush: true, zone: 'ts', cls: 'ct-ds',
                tools: '<div class="ct-tools">' +
                    (baoCaoChon ?
                        '<div class="ums-field"><select class="ums-select" data-ct="bc" data-ph="Chọn loại báo cáo"><option value="">Chọn loại báo cáo</option>' +
                        maBC.map(function (m) { return '<option value="' + esc(m[0]) + '">' + esc(m[1]) + '</option>'; }).join('') + '</select></div>' +
                        ui.btn('excel', { text: 'Tải file', icon: 'fa-download', attr: { 'data-ct': 'taifile' } }) :
                        '<span data-ct="bc"></span>') +
                    (T.truocPhan || '') +
                    '<div class="ums-field"><select class="ums-select" data-ct="phan" data-ph="Chọn phần thi"><option value="">Chọn phần thi</option></select></div>' +
                    (T.sauPhan || '') +
                    ui.btn('save', { text: o.chuXuLy || 'Xử lý tình huống thi', icon: 'fa-chalkboard-user', mod: 'out-danger', attr: { 'data-ct': 'tinhhuong' } }) +
                    ui.btn('save', { text: 'Công nhận điểm', icon: 'fa-clipboard-check', attr: o.congNhan === false ?
                        { 'data-ct': 'congnhan', disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } : { 'data-ct': 'congnhan' } }) +
                    (T.sauCongNhan || '') +
                    ui.btn('reload', { attr: { 'data-ct': 'refresh' } }) +
                    (o.xemKetQua === false ? '' : ui.btn('search', { text: 'Xem kết quả thi', icon: 'fa-desktop', mod: 'out-primary', attr: { 'data-ct': 'ketqua' } })) +
                    (T.cuoi || '') +
                    '</div>' });
        ui.enhance(host);
        function zz(k) { return host.querySelector('[data-z="' + k + '"]'); }
        var selPhan = host.querySelector('[data-ct="phan"]');
        function phanId() { return selPhan.value; }
        var api = { host: host, room: room, tong: tong, phanId: phanId, zz: zz,
            rows: function () { return s.rows; }, files: function () { return s.files; }, phan: function () { return s.phan; }, de: function () { return s.de; },
            daChon: function () { return P.daChon(zz('ts')); } };

        if (!baoCaoChon) ums.report.mount(host.querySelector('[data-ct="bc"]'), { import: false, collect: function (add) {
            add('ExamRoomInfo_Id', room.ID);
            add('ExamstructPartId', phanId());
            add('strNguoiDangNhap_Id', P.uid());
            add('strChucNang_Id', P.chucNang());
        } });

        /* ---------- Danh sách thí sinh ----------------------------------- */
        function hetGio(r) { return parseInt(r.TIMERCOUNTDOWN, 10) < 0 || e(r.FINISHED) === '1'; }
        function diemCN(r) { return e(r.MARK) !== '' ? e(r.MARK) : (hetGio(r) ? e(r.DIEMTINH) : ''); }
        function tai(tinhLai, page) {
            if (page) s.page = page;
            zz('ts').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return g(QL + 'LayDS_ChiTietPhongThi_KetQua', {
                versionAPI: V, strTuKhoa: '', strExamRoomInfoId: room.ID, strNguoiTao_Id: P.uid(), strCoTinhLaiDiem: o.luonTinhLai ? '1' : tinhLai,
                strExamStructPartId: phanId(), PageNumber: o.phanTrang ? s.page : 1, ItemPerPage: o.phanTrang ? s.size : 100000000
            }).then(function (r) {
                var d = r.data || {};
                s.rows = Array.isArray(d) ? d : arr(d.ChiTietPhongThi);   // máy chủ trả { ChiTietPhongThi, StudentFiles }; nhận cả dạng mảng
                s.files = Array.isArray(d) ? [] : arr(d.StudentFiles);
                s.tong = Number(r.pager) || s.rows.length;
                ve();
            }).catch(function (err) { zz('ts').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thí sinh'); });
        }
        api.tai = tai;
        function tenHtml(r) {
            if (o.gianLan === false && !o.tenBam) return '<span class="ct-ten">' + esc(e(r.FULLNAME)) + '</span>';
            return '<div data-ten="' + esc(r.ID) + '">' + P.tenThiSinh(r, true, !!o.tenBam) + '</div>';
        }
        function ve() {
            zz('tsn').textContent = '(' + (o.phanTrang ? s.tong : s.rows.length) + ')';
            var coPhan = tong || !!phanId();
            ui.table({ el: zz('ts'), rows: s.rows, empty: 'Không có thí sinh', columns: [
                { title: 'Mã thí sinh', cls: 'is-center is-nowrap', render: function (r) {
                    return (o.anhThiSinh ? P.anhThiSinh(r.STUDENTCODE) + '<br>' : '') + esc(e(r.STUDENTCODE));
                } },
                { title: 'Họ và tên', cls: 'ct-cot-ten', render: tenHtml },
                { title: 'Ngày sinh', prop: 'BIRTHDATE_USER', cls: 'is-center is-nowrap' },
                { title: 'Số BD', prop: 'SOBAODANHIMPORT', cls: 'is-center' },
                { title: 'Đề', prop: 'DETHITHU', cls: 'is-center is-nowrap' },
                { title: 'Điểm', cls: 'is-center', render: function (r) { return esc(hetGio(r) ? e(r.DIEMTINH) : ''); } },
                { title: 'Điểm công nhận', cls: 'is-center', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm ct-o" data-diem="' + i + '" value="' + esc(diemCN(r)) + '" autocomplete="off">';
                } },
                { title: 'Tình trạng', cls: 'is-center is-nowrap', render: function (r) { return P.tinhTrang(r, coPhan); } },
                { title: 'T/g BĐ làm bài', prop: 'TIMEHHMISSSTARTDOEXAM', cls: 'is-center is-nowrap' },
                { title: 'Máy đăng nhập', prop: 'DIACHIIPMAYDADANGNHAP', cls: 'is-center' },
                { title: 'Ghi chú', render: function (r, i) {
                    return (e(r.TENVIPHAMQUYCHETHI) ? '<span class="ct-vipham">' + esc(e(r.TENVIPHAMQUYCHETHI)) + '</span>' : '') +
                        '<input class="ums-input ums-input--sm ct-o" data-ghichu="' + i + '" value="' + esc(e(r.GHICHU)) + '" autocomplete="off">';
                } },
                { title: 'Xem', cls: 'is-nowrap', render: function (r) {
                    return P.tep(r, s.files) + (o.ketQuaThi ?
                        '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-kq="' + esc(r.ID) + '"><i class="fa-light fa-eye"></i><span>Chi tiết bài thi</span></button>' :
                        '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" disabled title="Bản gốc chưa làm chức năng này"><i class="fa-light fa-eye"></i><span>Chi tiết bài thi</span></button>');
                } },
                P.cotChon()
            ], page: o.phanTrang ? { index: s.page, size: s.size, total: s.tong, onChange: function (pg) { tai('1', pg); },
                onSize: function (n) { s.size = n; tai('1', 1); } } : undefined });
            P.demNguoc(zz('ts'));
        }

        /* ---------- Thông tin đề, phần thi ------------------------------- */
        function taiDe() {
            return P.chiTietDe(room.ID).then(function (de) {
                s.de = de;
                zz('de').innerHTML = P.veDe(de, true);
                return P.phanThi(e(de.EXAMSTRUCTID));
            }).then(function (ds) {
                s.phan = ds;
                pat.fill(selPhan, tong ? [] : ds, { name: 'TITLE', head: 'Chọn phần thi' });
            }).catch(function (err) { ums.api.handle(err, 'thông tin đề thi'); });
        }
        api.taiDe = taiDe;
        if (o.sanSang) o.sanSang(api);
        tai('0');
        taiDe();
        if (window.jQuery) jQuery(selPhan).on('select2:select select2:clear', function () { tai('1', 1); });

        /* ---------- Gian lận: hỏi lại mỗi 30 giây ------------------------ */
        var hoi = null;
        if (o.gianLan !== false) {
            var gianLan = function () {
                g(QL + 'LayDS_ThiSinhGianLan', { versionAPI: V, strExamRoomInfo_Id: room.ID, strNguoiDung_Id: P.uid(), silent: true }).then(function (r) {
                    arr(r.data).forEach(function (x) {
                        var row = s.rows.filter(function (y) { return e(y.ID) === e(x.STUDENTEXAMROOMID); })[0];
                        if (!row) return;
                        row.GIANLAN = x.GIANLAN;
                        var oTen = Array.prototype.filter.call(zz('ts').querySelectorAll('[data-ten]'), function (c) { return c.getAttribute('data-ten') === e(row.ID); })[0];
                        if (oTen) oTen.innerHTML = P.tenThiSinh(row, true);
                    });
                }).catch(function (err) { console.warn('[coithi] LayDS_ThiSinhGianLan', err); });
            };
            hoi = setInterval(gianLan, 30000);
            gianLan();
        }

        /* ---------- Công nhận điểm --------------------------------------- */
        function congNhan() {
            if (!phanId() && !tong) { ui.toast('Bạn chưa chọn phần thi', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn thực hiện không?', { title: 'Công nhận điểm', ok: 'Công nhận' }).then(function (yes) {
                if (!yes) return;
                var calls = [];
                s.rows.forEach(function (r, i) {
                    var o1 = zz('ts').querySelector('[data-diem="' + i + '"]'), o2 = zz('ts').querySelector('[data-ghichu="' + i + '"]');
                    var diem = o1 ? o1.value.trim() : '', gc = o2 ? o2.value : '';
                    if (diem === e(r.MARK) && gc === e(r.GHICHU)) return;
                    calls.push({ action: QL + (tong ? 'Sua_CongNhanDiem_ALL' : 'Sua_CongNhanDiem'), versionAPI: V,
                        strId: tong ? r.ID : r.STUDENTEXAMROOMPARTID, strMark: diem, strGhiChu: gc, strNguoiThucHien_Id: P.uid() });
                });
                if (!calls.length) { ui.toast('Không có điểm nào thay đổi', 'info'); return; }
                ui.batch(calls, { title: 'Công nhận điểm', okText: 'Cập nhật thành công' }).then(function () { tai(TL); });
            });
        }

        /* ---------- Chi tiết bài thi (tuỳ chọn ketQuaThi) ---------------- */
        function ketQua(id) {
            var r = s.rows.filter(function (x) { return e(x.ID) === id; })[0];
            if (!r) return;
            P.xemBaiThi({ action: 'TTN_ThiSinh/gen_KetQuaThi', method: 'GET', versionAPI: V, strExamRoomInfoId: room.ID,
                strStudentExamRoomId: id, strThiSinhId: e(r.USERID), strUserId: P.uid() },
                { title: 'Kết quả bài thi — ' + e(r.FULLNAME), ma: e(r.STUDENTCODE) });
        }

        /* ---------- Hộp "Xử lý tình huống thi" --------------------------- */
        var NUT = [
            ['KETTHUCLAMBAI', 'Kết thúc bài thi', 'fa-laptop-file', 'out-primary', 'COITHI.HIENTHINUTKETTHUCBAITHI'],
            ['DOIMAY', 'Cho phép TS đổi máy', 'fa-chalkboard-user', 'out-warn', 'COITHI.CHOPHEPTHISINHDOIMAY'],
            ['KHOITAOLAITHOIGIANLAMBAI', 'Làm lại từ đầu', 'fa-arrows-rotate', 'out-primary', 'COITHI.LAMLAIBAITUDAU'],
            ['KHOITAODE', 'Khởi tạo lại đề', 'fa-file-import', 'out-info', 'COITHI.KHOITAOLAIDE'],
            ['TAMDUNGTHI', 'Tạm dừng', 'fa-circle-pause', 'out-danger', 'COITHI.TAMDUNG'],
            ['THISINHTIEPTUCLAMBAI', 'Tiếp tục làm bài', 'fa-circle-play', 'out-success', 'COITHI.TIEPTUCLAMBAI']
        ];
        var VP_KHONG_KETTHUC = '3442B9AD42EC44DF85D8A2322067B2EE';
        function tinhHuong() {
            var ids = P.daChon(zz('ts'));
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            function an(ma) { return cauHinh[ma] === '0'; }
            var cong = !an('COITHI.CONGTHEMTHOIGIANLAMBAI');
            var dlg = ui.dialog({ title: 'Xử lý tình huống thi', icon: 'fa-chalkboard-user', size: 'xl', body:
                P.thongTin(room) +
                '<div class="ct-phan">' + s.phan.map(function (p) {
                    return '<label class="ums-check"><input type="checkbox" data-phanthi="' + esc(p.ID) + '"> ' + esc(e(p.TITLE)) + '</label>';
                }).join('') + '</div>' +
                '<div class="ct-hang">' + NUT.filter(function (n) { return !an(n[4]) && !(n[0] === 'DOIMAY' && o.doiMay === false); }).map(function (n) {
                    return ui.btn('save', { text: n[1], icon: n[2], mod: n[3], attr: { 'data-th': n[0] } });
                }).join('') +
                (cong ? ui.btn('save', { text: 'Cộng thêm t/g làm bài', icon: 'fa-clock', mod: 'out-success', attr: { 'data-th': 'CONGTHEMTHOIGIANLAMBAI' } }) +
                    '<input class="ums-input ct-phut" data-th="phut" placeholder="Phút" inputmode="numeric" autocomplete="off">' : '') + '</div>' +
                '<div class="ct-hang">' + ui.btn('save', { text: o.viPhamLuonKetThuc ? 'Vi phạm quy chế' : 'Vắng thi/Phạm quy', icon: 'fa-triangle-exclamation', mod: 'warn', attr: { 'data-th': 'VIPHAM' } }) +
                '<div class="ums-field"><select class="ums-select" data-th="vp" data-ph="---"><option value="">---</option>' +
                viPham.map(function (x) { return '<option value="' + esc(x.ID) + '">' + esc(e(x.NAME)) + '</option>'; }).join('') + '</select></div></div>' +
                '<div data-th="bang"></div>' });
            var b = dlg.body;
            b.querySelector('[data-z="de"]').innerHTML = P.veDe(s.de, true);
            ui.enhance(b);
            var bang = b.querySelector('[data-th="bang"]');
            function taiTS() {
                bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                g(QL + 'LayDS_ThiSinh_TinhHuongThi', { versionAPI: V, strExamRoomInfoId: room.ID, strStudentExamRoomIds: ids.join(',') }).then(function (r) {
                    ui.table({ el: bang, rows: arr(r.data), empty: 'Không có thí sinh', columns: [
                        { title: 'Mã thí sinh', prop: 'STUDENTCODE', cls: 'is-center is-nowrap' }, { title: 'Họ và tên', prop: 'FULLNAME' },
                        { title: 'Ngày sinh', prop: 'BIRTHDATE_USER', cls: 'is-center is-nowrap' }, { title: 'Số BD', prop: 'SOBAODANHIMPORT', cls: 'is-center' },
                        { title: 'Điểm công nhận', prop: 'MARK', cls: 'is-center' }, { title: 'Tình trạng', prop: 'TRANGTHAILAMBAICACPHANTHI' },
                        { title: 'T/g BĐ làm bài', prop: 'TIMEHHMISSSTARTDOEXAM', cls: 'is-center is-nowrap' },
                        { title: 'Máy đăng nhập', prop: 'TENMAYDADANGNHAP', cls: 'is-center' }] });
                }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thí sinh xử lý tình huống'); });
            }
            taiTS();
            function phanIds() {
                if (tong) return s.phan.map(function (p) { return p.ID; }).join(',');
                return Array.prototype.map.call(b.querySelectorAll('input[data-phanthi]:checked'), function (c) { return c.getAttribute('data-phanthi'); }).join(',');
            }
            function xuLy(note, phut) {
                var p = phanIds();
                if (!p) { ui.toast('Bạn chưa chọn phần thi', 'warn'); return null; }
                return g(QL + 'XulyTinhHuongThi', { versionAPI: V, strStudentExamRoomIds: ids.join(','), strKhoiTaoNote: note,
                    strAddTime: note === 'CONGTHEMTHOIGIANLAMBAI' ? phut : '', strExamstructPartIds: p, strNguoiThucHienId: P.uid() });
            }
            function xong(tinhLai) { ui.toast('Thực hiện thành công', 'ok'); taiTS(); tai(tinhLai === '1' ? '1' : TL); }
            function loi(err) { if (err) ums.api.handle(err, 'xử lý tình huống thi'); }
            function hoiLai(lam) {
                ui.confirm('Bạn có chắc chắn thực hiện?', { title: 'Xử lý tình huống thi' }).then(function (yes) { if (yes) lam(); });
            }
            b.addEventListener('click', function (ev) {
                var n = ev.target.closest('button[data-th]');
                if (!n) return;
                var k = n.getAttribute('data-th');
                if (k === 'CONGTHEMTHOIGIANLAMBAI') {
                    var phut = b.querySelector('[data-th="phut"]').value.trim();
                    if (!phut) { ui.toast('Chưa nhập số phút?', 'warn'); return; }
                    hoiLai(function () { var p = xuLy(k, phut); if (p) p.then(function () { xong('0'); }, loi); });
                } else if (k === 'KHOITAODE') {
                    hoiLai(function () {
                        g(QL + 'KhoiTaoLaiDeChoThiSinh', { versionAPI: V, strExamRoomInfoId: room.ID, strStudentExamRoomIds: ids.join(','),
                            strExamstructPartIds: phanIds(), strNguoiThucHienId: P.uid() }).then(function () { xong('1'); }, loi);
                    });
                } else if (k === 'DOIMAY') {
                    hoiLai(function () {
                        g(QL + 'Save_DoiMay', { versionAPI: V, strStudentExamRoomIds: ids.join(','), strNguoiThucHienId: P.uid() })
                            .then(function () { ui.toast('Thực hiện thành công', 'ok'); }, loi);
                    });
                } else if (k === 'VIPHAM') {
                    hoiLai(function () {
                        var vp = b.querySelector('[data-th="vp"]').value, p = phanIds();
                        if (!p) { ui.toast('Bạn chưa chọn phần thi', 'warn'); return; }
                        var truoc;
                        if (o.viPhamLuonKetThuc) truoc = xuLy('KETTHUCLAMBAI');
                        else truoc = vp && vp !== VP_KHONG_KETTHUC ? xuLy('KETTHUCLAMBAI') : (!vp ? xuLy('THISINHTIEPTUCLAMBAI') : Promise.resolve());
                        truoc.then(function () {
                            return g(QL + 'Save_ViPhamQuyCheThi', { versionAPI: V, strStudentExamRoomIds: ids.join(','), strExamstructPartIds: p,
                                strViPhamQuyCheThiId: vp, strNguoiThucHienId: P.uid() });
                        }).then(function () { xong('0'); }, loi);
                    });
                } else {
                    hoiLai(function () { var p = xuLy(k); if (p) p.then(function () { xong('0'); }, loi); });
                }
            });
        }

        /* ---------- Sự kiện ---------------------------------------------- */
        host.addEventListener('click', function (ev) {
            var ip = ev.target.closest('[data-ip]');
            if (ip) {
                var r = s.rows.filter(function (x) { return e(x.ID) === ip.getAttribute('data-ip'); })[0];
                if (r) P.xemIP(r);
                return;
            }
            var kq = ev.target.closest('[data-kq]');
            if (kq) { ketQua(kq.getAttribute('data-kq')); return; }
            var tb = ev.target.closest('[data-tenbam]');
            if (tb && o.tenBam) {
                var rt = s.rows.filter(function (x) { return e(x.ID) === tb.getAttribute('data-tenbam'); })[0];
                if (rt) o.tenBam(rt, api);
                return;
            }
            var a = ev.target.closest('[data-ct]');
            if (!a || a.tagName !== 'BUTTON' || a.disabled) return;
            // Nút của biểu mẫu con đang mở trong host (ums.pat.formTrang) không thuộc khung này
            if (a.closest('.ums-formtrang')) return;
            var k = a.getAttribute('data-ct');
            if (k === 'refresh') tai(o.luonTinhLai ? '1' : '0');
            else if (k === 'ketqua') tai('1');
            else if (k === 'congnhan') congNhan();
            else if (k === 'tinhhuong') tinhHuong();
            else if (k === 'taifile') {
                var ma = host.querySelector('select[data-ct="bc"]').value;
                if (o.baoCaoChay) { if (!ma) ui.toast('Bạn chưa chọn mẫu báo cáo', 'warn'); else o.baoCaoChay(ma, phanId()); }
                else P.baoCao(ma, room.ID, phanId(), { goc: 'heThong' });
            }
            else if (o.onCt) o.onCt(k, api);
        });
        P.ganChonTatCa(host);

        return function () {
            if (hoi) clearInterval(hoi);
            var ts = zz('ts');
            if (ts && ts._demDung) ts._demDung();
        };
    };

    /* ---------- Màn Cổng cán bộ ------------------------------------------ */
    var root = document.getElementById('coithi-coithi');
    if (!root) return;
    G.nap();
    P.manPhong(root, {
        tieuDe: 'Giám sát thi',
        donVi: 'QLTTN_ThongTin/LayDS_DonViByUserId_GST',
        action: QL + 'LayDS_PhongThiCanBo_GST',
        locTrangThai: true,
        chiTiet: function (room, host) { return G.chiTiet(room, host); }
    });
})();
