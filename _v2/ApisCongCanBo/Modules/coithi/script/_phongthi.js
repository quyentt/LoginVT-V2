/* =========================================================================
   coithi — tầng chung của module "Coi thi, chấm thi" (cổng cán bộ): ums.coiThi.*
   Dùng cho coithi, chamthituluan, duyetdiemthitracnghiem.
   Bản gốc: ApisCongCanBo/Modules/coithi/script/coithi.js, chamthituluan.js,
   duyetdiemthitracnghiem.js — ba tệp chép nhau các khối: nạp đơn vị / đợt thi,
   bảng phòng thi, khung "Phòng thi" (thông tin phòng + đề), danh sách phần thi,
   đồng hồ đếm ngược, hộp "máy đã đăng nhập", báo cáo SYS_Report với URL cứng.
   ---------------------------------------------------------------------------
   Lời gọi (đều action kiểu cũ, không mã hoá):
     QLTTN_ThongTin/LayDS_DonViByUserId[_GST]  GET strUserId
     QLTTN_QuanLyThi/LayDS_DotThi              GET strStatus '1'
     QLTTN_QuanLyThi/LayDS_ExamRoomInfoDetail  GET strExamRoomInfoId → [0] (EXAMSTRUCTID, GENSTYLETEXT…)
     QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart GET strExamStructId… → phần thi (PARENTID null)
     QLTTN_QuanLyThi/LayDS_DiaChiIP_ThiSinh    GET strStudentExamRoom_Id (= ID dòng thí sinh), phân trang
     QLTTN_QuanLyThi/ThaoTacPhongThi_PhongThi_GST GET strExamRoomInfoIds, strThaoTacPhongThi (MO/DONGPHONGTHI)
     QLTTN_QuanLyThi/Update_PhongThi_MucPheDuyet POST strIds, strMucPheDuyet, strUngDung_Id (= vai trò), strChucNang_Id
     SYS_Report/ThemMoi POST strTuKhoa / strDuLieu (chuỗi nối phẩy) → Message = id → URL báo cáo CỨNG
   Khung màn danh sách phòng: ums.coiThi.manPhong(root, cfg) — lọc Đơn vị · Đợt thi · [Trạng thái] ·
     Từ ngày · Đến ngày · Từ khoá, tác vụ Mở/Đóng phòng, bảng phòng thi; "Chi tiết phòng" → khung
     chi tiết THAY CHỖ danh sách (bản gốc: modal 1440px — BO-CUC quy ước 1).
   Tuỳ chọn thêm cho phân hệ Quản lý thi trắc nghiệm (ApisQuanLyThiTracNghiem — các bản anh em của module này;
   mặc định giữ nguyên hành vi Cổng cán bộ):
     · cotPhong({ gioThi: false, anHien: true, chiTietKhi(x) }) — bỏ cột Giờ thi / thêm cột "Tình trạng" Ẩn-Hiện (STATUS) /
       chỉ vẽ nút "Chi tiết phòng" khi chiTietKhi(dòng) đúng (quanlyphuctraphuckhao: chỉ phòng ĐÃ ĐÓNG).
     · baoCao(code, room, part, { goc: 'heThong', khongPhanThi: true }) — URL báo cáo lấy theo hệ thống (edu.system.rootPathReport
       của bản gốc QLTTN) thay URL viết cứng của Cổng cán bộ; khongPhanThi: không gửi khoá ExamstructPartId (bản gốc
       quanlyphuctraphuckhao chỉ gửi ba khoá ExamRoomInfo_Id, strReportCode, strNguoiDangNhap_Id).
     · manPhong cfg.locStatus (ô "Tình trạng phòng(Ẩn/Hiện)" → strStatus), cfg.cot (tuỳ chọn cột), cfg.tacVu (mảng
       [giá trị, chữ, động từ] hoặc false = không có tác vụ + không cột đánh dấu), cfg.thaoTac(ids, tv) → Promise.
     · anhThiSinh(code) — ảnh thí sinh <rootPath>/Upload/Anh/<mã>.jpg (các màn QLTTN vẽ ảnh cạnh mã thí sinh; cùng lớp .ums-ava).
     · xemBaiThi(call, { title, ma }) — hộp "Kết quả bài thi": HTML máy chủ trả (TTN_ThiSinh/gen_KetQuaThi*) + nút In; công thức
       toán dàn qua ums.editor.toan nếu có (bản gốc gọi MathJax).
     · (2026-10-05, cho QLTTN quanlythi/quanlythi) manPhong cfg.locThem(loc) → danh sách ô lọc đã sửa (chèn Năm học / Học kỳ / Học phần);
       cfg.dotThi === false → không tự nạp LayDS_DotThi (màn tự nạp theo học kỳ); cfg.thamSo(v) → tham số thêm cho lời gọi danh sách;
       cfg.toolbar → HTML (ô báo cáo, nút Tải file, vùng mẫu báo cáo) đặt trên MỘT HÀNG riêng cùng ô tác vụ (.ct-toolbar);
       mục tác vụ dạng đối tượng { ma, ten, dongTu, lam(ids, api), chon: false } — có `lam` thì màn tự xử lý (mở màn con, hỏi lại
       riêng), chon: false = không bắt chọn phòng; cfg.cot.sua + cfg.sua(room, api) → cột "Sửa phòng thi"; cfg.sauDung(api) gọi sau khi
       dựng xong; trả về api { tai, st, rows(), daChon(), v(k), f(k), z(k), moChiTiet(id), dong(), phong(id) }.
       tenThiSinh(r, dam, bam) — bam: họ tên là nút (data-tenbam = ID) để màn mở biểu mẫu thí sinh.
   Khác bản gốc (ghi ở can-quyet.js):
     · Ô từ khoá bản gốc khai sai id (`id-="txtSearch_TuKhoa"`) → không bao giờ gửi; nay gửi.
     · Tệp bài làm mở tab mới (gốc mở đè trang).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var P = ums.coiThi = ums.coiThi || {};
    var QL = 'QLTTN_QuanLyThi/', V = 'v1.0';
    var URL_BC = 'https://qldtbeta.phenikaa-uni.edu.vn/ttn.Apis.Report.QuanLyThiTracNghiem/Modules/Common/Baocao.aspx';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    P.e = e;
    P.arr = arr;
    P.uid = uid;
    P.QL = QL;
    P.V = V;
    P.vaiTro = function () { return (ums.state && ums.state.roleId) || (ums.session && ums.session.appId) || ''; };
    P.chucNang = function () { return (ums.state && ums.state.chucNangId) || ''; };

    /** Gọi action kiểu cũ; o chép nguyên tham số bản gốc (có hoặc không versionAPI) */
    P.g = function (action, o, post) {
        return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {}));
    };
    var g = P.g;

    /* ---------- Danh mục ------------------------------------------------- */
    P.napDonVi = function (el, action) {
        return g(action, { strUserId: uid() }).then(function (r) {
            pat.fill(el, arr(r.data), { name: 'NAME', head: 'Chọn đơn vị' });
        }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
    };
    P.napDotThi = function (el) {
        return g(QL + 'LayDS_DotThi', { strStatus: '1' }).then(function (r) {
            pat.fill(el, arr(r.data), { name: 'NAME', head: 'Chọn đợt thi' });
        }).catch(function (err) { ums.api.handle(err, 'đợt thi'); });
    };
    P.chiTietDe = function (roomId) {
        return g(QL + 'LayDS_ExamRoomInfoDetail', { versionAPI: V, strExamRoomInfoId: roomId })
            .then(function (r) { return arr(r.data)[0] || {}; });
    };
    /** Phần thi gốc của cấu trúc đề (PARENTID === null như bản gốc) */
    P.phanThi = function (structId) {
        return g('QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart', {
            versionAPI: V, strTuKhoa: '', strExamStructId: structId, strNguoiDung_Id: uid(), PageNumber: 1, ItemPerPage: 1000000
        }).then(function (r) { return arr(r.data).filter(function (x) { return x.PARENTID === null; }); });
    };

    /* ---------- Bảng phòng thi ------------------------------------------- */
    P.cotPhong = function (o) {
        o = o || {};
        var c = [
            { title: 'Phòng thi', prop: 'ROOMNAME' },
            { title: 'Môn thi', prop: 'COURSENAME' },
            { title: 'Ngày thi', prop: 'EXAMDATE', cls: 'is-center is-nowrap' },
            { title: 'Giờ thi', prop: 'GIOTHI', cls: 'is-center is-nowrap' },
            { title: 'Đợt thi', prop: 'TENDOTTHI' }
        ];
        if (o.gioThi === false) c.splice(3, 1);
        if (o.trangThai) c.push({ title: 'Trạng thái phòng', cls: 'is-center', render: function (x) {
            return e(x.OPENSTATUS) === '0' ? ui.badge('Đóng', 'mute') : ui.badge('Mở', 'ok');
        } });
        if (o.anHien) c.push({ title: 'Tình trạng', cls: 'is-center', render: function (x) {
            return e(x.STATUS) === '0' ? ui.badge('Ẩn', 'mute') : ui.badge('Hiện', 'ok');
        } });
        c.push({ title: 'SL thí sinh', prop: 'SOLUONGTHISINH', cls: 'is-center' });
        if (o.sua) c.push({ title: 'Sửa phòng thi', cls: 'is-center', render: function (x) {
            return ui.btn('edit', { text: 'Sửa', cls: 'ums-btn--sm', mod: 'out-warn', attr: { 'data-sua': e(x.ID) } });
        } });
        c.push({ title: 'Chi tiết', cls: 'is-center', render: function (x) {
                if (o.chiTietKhi && !o.chiTietKhi(x)) return '';
                return '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-phong="' + esc(x.ID) + '">' +
                    '<i class="fa-light fa-eye"></i><span>Chi tiết phòng</span></button>';
            } });
        if (o.chon) c.push(P.cotChon());
        return c;
    };
    /** Cột ô đánh dấu (checkX + ID của bản gốc) — ô ở tiêu đề chọn tất cả */
    P.cotChon = function () {
        return { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (x) { return '<input type="checkbox" data-ck="' + esc(x.ID) + '">'; } };
    };
    P.daChon = function (host) {
        return Array.prototype.filter.call(host.querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return c.getAttribute('data-ck'); });
    };
    /** Gắn "chọn tất cả" cho mọi bảng trong host */
    P.ganChonTatCa = function (host) {
        host.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-ck') !== 'all') return;
            var bang = ev.target.closest('table');
            if (bang) Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
    };

    /* ---------- Khung thông tin phòng / đề ------------------------------- */
    function kv(nhan, gt, html) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + (html ? gt : esc(gt)) + '</b></div>'; }
    P.kv = kv;
    /** o = { matKhau: bool, de: false (không có khối đề) } */
    P.thongTin = function (room, o) {
        o = o || {};
        var phong = kv('Đơn vị', e(room.TENDONVI)) + kv('Phòng thi', e(room.ROOMNAME)) + kv('Đợt thi', e(room.TENDOTTHI)) +
            kv('Môn thi', e(room.COURSENAME)) + kv('Ngày thi', e(room.EXAMDATE)) +
            (o.matKhau ? kv('Mật khẩu phòng thi', '<span class="ct-matkhau">' + esc(e(room.MATKHAUCHOPHONGTHI)) + '</span>', true) : '');
        return '<div class="ums-grid ums-grid--2 ct-info">' +
            pat.panel({ title: 'Thông tin phòng thi', icon: 'fa-door-open', body: phong, cls: 'ums-u-mb-0' }) +
            (o.de === false ? '' : pat.panel({ title: 'Thông tin đề thi', icon: 'fa-file-lines', zone: 'de', cls: 'ums-u-mb-0',
                body: '<span class="ums-u-faint">Đang tải…</span>' })) +
            '</div>';
    };
    /** Khối "Thông tin đề thi" — deThi: có dòng "Đề thi" (coithi có, chamthituluan không) */
    P.veDe = function (de, deThi) {
        return kv('Kiểu tạo đề', e(de.GENSTYLETEXT)) + kv('Trạng thái', e(de.DATAODE)) + kv('Tổng số câu hỏi', e(de.TOLTALQUESTION)) +
            kv('Cấu trúc đề', e(de.EXAMSTRUCTNAME)) + (deThi ? kv('Đề thi', e(de.WRITETENEXAMNAME)) : '');
    };

    /* ---------- Thí sinh ------------------------------------------------- */
    /** Họ tên: đỏ khi không có trong lịch thi; "Gian lận" nhấp nháy, bấm xem máy đã đăng nhập */
    P.tenThiSinh = function (r, dam, bam) {
        var ten = '<span class="' + (dam ? 'ct-ten' : '') + (e(r.COTRONGLICHTHI) === '0' ? ' ct-ten--ngoai' : '') + '">' + esc(e(r.FULLNAME)) + '</span>';
        // bam: họ tên là nút mở biểu mẫu thí sinh (bản gốc QLTTN: btnChiTietThiSinh)
        if (bam) ten = '<button type="button" class="ct-tenlink" data-tenbam="' + esc(r.ID) + '" title="Thông tin thí sinh">' + ten + '</button>';
        return ten + (e(r.GIANLAN) === '1' ? '<br><button type="button" class="ct-gianlan" data-ip="' + esc(r.ID) + '">Gian lận</button>' : '');
    };
    /** Cột "Tình trạng" — đúng thứ tự các nhánh của bản gốc; coPhan = đã chọn phần thi hoặc đề có tổng thời gian */
    P.tinhTrang = function (r, coPhan) {
        var h = '', tm = r.TIMERCOUNTDOWN, xong = e(r.FINISHED);
        var coTm = tm !== '' && tm !== null && tm !== undefined && String(tm) !== '0';
        var chay = coTm && parseInt(tm, 10) > 0 && xong === '0';
        if (parseFloat(r.THOIGIANCONLAI) > 0) {
            if (coTm) h = chay ? '<span class="ct-dem" data-dem="' + esc(e(r.TIMERSHOW)) + '"></span>' : '--:--';
        } else if (parseInt(tm, 10) <= 0) h = '<span class="ct-tt--het">Kết thúc</span>';
        if (!e(r.TIMESTARTDOEXAM_TEXT)) h = '<span class="ct-tt--chua">Chưa thi</span>';
        if (xong === '1') h = '<span class="ct-tt--xong">Thi xong</span>';
        if (xong !== '1' && r.STATUS === 'TAMDUNGTHI') h = '<span class="ct-tt--xong">Tạm dừng thi</span>';
        return coPhan ? h : '';
    };
    /** Tệp bài làm (StudentFiles theo DULIEU_ID = STUDENTEXAMROOMPARTID) */
    P.tep = function (r, files) {
        var goc = (ums.session && ums.session.rootPathUpload) || '';
        return arr(files).filter(function (f) { return e(f.DULIEU_ID) === e(r.STUDENTEXAMROOMPARTID); }).map(function (f) {
            return '<a class="ct-tep" target="_blank" rel="noopener" href="' + esc(goc + '/' + e(f.DUONGDAN)) + '">' + esc(e(f.TENHIENTHI)) + '</a>';
        }).join('');
    };

    /** Ảnh thí sinh theo mã (bản gốc QLTTN: edu.system.rootPath + '/Upload/Anh/' + STUDENTCODE + '.jpg'); không có ảnh → hình người */
    P.anhThiSinh = function (code) {
        var goc = (ums.session && ums.session.rootPath) || '';
        return '<span class="ums-ava ct-anh"><i class="fa-light fa-user"></i>' +
            (code ? '<img alt="" src="' + esc(goc + '/Upload/Anh/' + e(code) + '.jpg') + '" onerror="this.remove()">' : '') + '</span>';
    };

    /**
     * Hộp "Kết quả bài thi" — HTML bài làm máy chủ dựng (gen_KetQuaThi / gen_KetQuaThi_KIEULAMBAI) + nút In.
     * call = tham số ums.api.call (chép nguyên của màn); o = { title, ma (mã thí sinh, đặt tên bản in) }.
     * Bản gốc: vùng zoneKetQuaThi thay chỗ + edu.util.printHTML + MathJax; ở đây là hộp xem (việc phụ) + ums.editor.toan.
     */
    P.xemBaiThi = function (call, o) {
        o = o || {};
        var vung = document.createElement('div');
        vung.className = 'ct-ketqua';
        vung.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var dlg = ui.dialog({ title: o.title || 'Kết quả bài thi', icon: 'fa-file-lines', size: 'xl', body: vung,
            buttons: [{ text: 'In bài thi', kind: 'print', keepOpen: true, onClick: function () {
                ui.print(vung, { title: 'Bài thi' + (o.ma ? ' - ' + o.ma : '') }); return false;
            } }] });
        ums.api.call(call).then(function (r) {
            vung.innerHTML = typeof r.data === 'string' && r.data ? r.data : ui.empty('Không có nội dung bài thi');
            if (ums.editor && ums.editor.toan) ums.editor.toan(vung);
        }).catch(function (err) { vung.innerHTML = ui.fail(err.message); ums.api.handle(err, o.title || 'kết quả bài thi'); });
        return dlg;
    };

    /** Đồng hồ đếm ngược cho mọi [data-dem] (mili giây) trong host. Trả hàm dừng. */
    P.demNguoc = function (host) {
        if (host._demDung) host._demDung();
        var ds = Array.prototype.map.call(host.querySelectorAll('[data-dem]'), function (el) {
            return { el: el, het: Date.now() + (Number(el.getAttribute('data-dem')) || 0) };
        });
        function ve() {
            var bay = Date.now();
            ds.forEach(function (d) {
                var con = Math.max(0, Math.round((d.het - bay) / 1000));
                var gio = Math.floor(con / 3600), phut = Math.floor(con % 3600 / 60), giay = con % 60;
                d.el.textContent = (gio > 0 ? gio + ':' : '') + (phut < 10 ? '0' : '') + phut + ':' + (giay < 10 ? '0' : '') + giay;
                // Bản gốc: ≤ 3 phút thì đỏ ở giây chẵn (nháy)
                d.el.classList.toggle('ct-dem--gap', gio === 0 && phut < 3 && giay % 2 === 0);
            });
        }
        if (!ds.length) { host._demDung = null; return function () {}; }
        ve();
        var t = setInterval(ve, 1000);
        host._demDung = function () { clearInterval(t); host._demDung = null; };
        return host._demDung;
    };

    /** Hộp "Thông tin chi tiết máy đã đăng nhập" (zoneDiaChiIP_ThiSinh) */
    P.xemIP = function (r) {
        var dlg = ui.dialog({
            title: 'Thông tin chi tiết máy đã đăng nhập', icon: 'fa-chalkboard-user', size: 'lg',
            body: pat.panel({ title: 'Thông tin thí sinh', icon: 'fa-user-graduate', body:
                kv('Mã sinh viên', e(r.STUDENTCODE)) + kv('Họ tên', (e(r.HODEM) + ' ' + e(r.TEN)).trim()) + kv('Lớp', e(r.CLASSNAMEIMPORT)) +
                kv('Số báo danh', e(r.SOBAODANHIMPORT)) + kv('Ngày sinh', e(r.BIRTHDATE_USER)) }) +
                '<div class="ums-u-mt-4" data-ip="bang"></div>'
        });
        var el = dlg.body.querySelector('[data-ip="bang"]'), size = 10;
        function tai(page) {
            el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            g(QL + 'LayDS_DiaChiIP_ThiSinh', { versionAPI: V, strStudentExamRoom_Id: r.ID, strNguoiDung_Id: uid(), PageNumber: page, ItemPerPage: size })
                .then(function (res) {
                    var ds = arr(res.data);
                    ui.table({ el: el, rows: ds, empty: 'Chưa có máy nào đăng nhập',
                        columns: [{ title: 'Địa chỉ IP', prop: 'IPADDRESS', cls: 'is-center' }, { title: 'Tên máy', prop: 'COMPUTERNAME', cls: 'is-center' },
                            { title: 'Ngày giờ', prop: 'DATELOGIN', cls: 'is-center is-nowrap' }],
                        page: { index: page, size: size, total: Number(res.pager) || ds.length, onChange: tai, onSize: function (s) { size = s; tai(1); } } });
                }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'máy đã đăng nhập'); });
        }
        tai(1);
        return dlg;
    };

    /* ---------- Ghi ------------------------------------------------------ */
    P.thaoTacPhong = function (ids, tacVu) {
        return g(QL + 'ThaoTacPhongThi_PhongThi_GST', { versionAPI: V, strExamRoomInfoIds: ids.join(','), strThaoTacPhongThi: tacVu, strNguoiThucHien_Id: uid() });
    };
    P.mucPheDuyet = function (ids, muc) {
        return g(QL + 'Update_PhongThi_MucPheDuyet', { versionAPI: V, strIds: ids.join(','), strMucPheDuyet: muc, strNguoiThucHien_Id: uid(),
            strUngDung_Id: P.vaiTro(), strChucNang_Id: P.chucNang() }, true);
    };

    /**
     * Báo cáo kiểu riêng của module (hàm report của ba tệp gốc): SYS_Report/ThemMoi gửi
     * strTuKhoa / strDuLieu là CHUỖI nối phẩy (không phải mảng JSON như ums.report.run),
     * rồi mở URL báo cáo viết cứng trong mã gốc (máy chủ Phenikaa) — giữ nguyên, xem can-quyet.
     */
    /** Gốc URL báo cáo theo hệ thống (như report.js: chức năng → vai trò → phiên) — bản QLTTN dùng edu.system.rootPathReport */
    P.gocBaoCao = function () {
        var s = ums.state || {}, ss = ums.session || {};
        var cn = (s.menu || []).filter(function (c) { return c.id === s.chucNangId; })[0];
        if (cn && cn.report) return cn.report;
        var role = (s.roles || []).filter(function (r) { return r.id === s.roleId; })[0];
        if (role && role.report) return role.report;
        return ss.rootPathReport || '';
    };
    P.baoCao = function (code, roomId, partId, o) {
        o = o || {};
        if (!code) { ui.toast('Bạn chưa chọn mẫu báo cáo', 'warn'); return Promise.resolve(null); }
        var k = ['ExamRoomInfo_Id', 'ExamstructPartId', 'strReportCode', 'strNguoiDangNhap_Id'], v = [roomId, partId, code, uid()];
        if (o.khongPhanThi) { k.splice(1, 1); v.splice(1, 1); }
        return g('SYS_Report/ThemMoi', { versionAPI: V, strTuKhoa: k.toString(), strDuLieu: v.toString(), strNguoiThucHien_Id: uid() }, true)
            .then(function (r) {
                if (!r.message) { ui.toast('Chưa lấy được dữ liệu báo cáo!', 'warn'); return null; }
                var url = (o.goc === 'heThong' ? P.gocBaoCao() : URL_BC) + '?id=' + r.message;
                if (ums.state && ums.state.mode === 'demo') ui.toast('Dựng thử — trên máy chủ thật sẽ mở: ' + url, 'info', { title: 'Mở báo cáo', timeout: 9000 });
                else ums.report.navigate(url);
                return url;
            }).catch(function (err) {
                if (err.expired) ums.api.handle(err);
                else ui.toast('Có lỗi xảy ra vui lòng thử lại! ' + (err.message || ''), 'bad');
                return null;
            });
    };

    /* =====================================================================
       Màn danh sách phòng thi + khung chi tiết (coithi, chamthituluan)
       cfg = { tieuDe, donVi (action), action (danh sách), locTrangThai, trangThai (giá trị cố định
               khi không có ô lọc), chiTiet(room, host) → hàm dọn dẹp (dừng đồng hồ, dừng hỏi định kỳ) }
       ===================================================================== */
    P.manPhong = function (root, cfg) {
        var st = { page: 1, size: 10, rows: [] }, don = null;
        var loc = [{ key: 'dv', type: 'select', label: 'Chọn đơn vị' }, { key: 'dot', type: 'select', label: 'Chọn đợt thi' }];
        if (cfg.locTrangThai) loc.push({ key: 'tt', type: 'select', label: 'Chọn trạng thái phòng(Đóng/Mở)' });
        if (cfg.locStatus) loc.push({ key: 'st', type: 'select', label: 'Tình trạng phòng(Ẩn/Hiện)' });
        loc.push({ key: 'tu', type: 'date', label: 'Từ ngày' }, { key: 'den', type: 'date', label: 'Đến ngày' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' });
        if (cfg.locThem) loc = cfg.locThem(loc) || loc;
        // Mục tác vụ: mảng [mã, chữ, động từ] (cũ) hoặc đối tượng { ma, ten, dongTu, lam(ids, api), chon }
        var TV = (cfg.tacVu === false ? [] : (cfg.tacVu || [['MOPHONGTHI', 'Mở phòng thi', 'mở'], ['DONGPHONGTHI', 'Đóng phòng thi', 'đóng']]))
            .map(function (t) { return Array.isArray(t) ? { ma: t[0], ten: t[1], dongTu: t[2] } : t; });
        var tacVu = !TV.length ? '' : '<div class="ums-field ct-tacvu"><select class="ums-select" data-f="tv" data-ph="Chọn tác vụ"><option value="">Chọn tác vụ</option>' +
            TV.map(function (t) { return '<option value="' + esc(t.ma) + '">' + esc(t.ten) + '</option>'; }).join('') + '</select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Thực hiện tác vụ', icon: 'fa-screen-users', mod: 'out-warn', attr: { 'data-a': 'tacvu' } }) + '</div>';
        var extra = cfg.toolbar ? '<div class="ct-toolbar"><div class="ct-toolbar__trai">' + cfg.toolbar + '</div><div class="ct-toolbar__phai">' + tacVu + '</div></div>' : tacVu;
        root.innerHTML =
            '<div data-z="list">' + pat.page(cfg.tieuDe) + pat.filterBar(loc, { extra: extra }) +
                pat.panel({ title: 'Danh sách phòng thi', icon: 'fa-screen-users', count: 'n', flush: true, zone: 'bang' }) + '</div>' +
            '<div data-z="view" hidden></div>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return z('list').querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? f(k).value.trim() : ''; }
        function phong(id) { return st.rows.filter(function (x) { return e(x.ID) === e(id); })[0]; }
        var api = { st: st, v: v, f: f, z: z, phong: phong, rows: function () { return st.rows; }, daChon: function () { return P.daChon(z('bang')); } };

        P.napDonVi(f('dv'), cfg.donVi);
        if (cfg.dotThi !== false) P.napDotThi(f('dot'));
        if (cfg.locTrangThai) pat.fill(f('tt'), [{ ID: '1', TEN: 'Đang mở' }, { ID: '0', TEN: 'Đang đóng' }], { head: 'Chọn trạng thái phòng(Đóng/Mở)' });
        if (cfg.locStatus) pat.fill(f('st'), [{ ID: '0', TEN: 'Ẩn' }, { ID: '1', TEN: 'Hiện' }], { head: 'Tình trạng phòng(Ẩn/Hiện)' });
        // Bản gốc mở màn KHÔNG nạp danh sách — chờ bấm Tìm kiếm
        z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-magnifying-glass');

        function tai(page) {
            if (page) st.page = page;
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return g(cfg.action, Object.assign({
                versionAPI: V, strDonVi_Id: v('dv'), strDotThi_Id: v('dot'), strTrangThaiPhongThi: cfg.locTrangThai ? v('tt') : cfg.trangThai,
                strStatus: cfg.locStatus ? v('st') : '1', strTuNgay: v('tu'), strDenNgay: v('den'), strTuKhoa: v('q'), strNguoiDung_Id: uid(),
                PageNumber: st.page, ItemPerPage: st.size
            }, cfg.thamSo ? cfg.thamSo(v) : {})).then(function (r) {
                st.rows = arr(r.data);
                var tong = Number(r.pager) || st.rows.length;
                z('n').textContent = '(' + tong + ')';
                ui.table({ el: z('bang'), rows: st.rows, columns: P.cotPhong(Object.assign({ trangThai: true, chon: TV.length > 0 }, cfg.cot || {})), empty: 'Không có phòng thi',
                    page: { index: st.page, size: st.size, total: tong, onChange: tai, onSize: function (s) { st.size = s; tai(1); } } });
            }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phòng thi'); });
        }
        api.tai = tai;

        function tacVuPhong() {
            var tv = v('tv');
            if (!tv) { ui.toast('Bạn chưa chọn tác vụ cần thực hiện', 'warn'); return; }
            var t = TV.filter(function (x) { return x.ma === tv; })[0] || { ma: tv, ten: tv, dongTu: '' }, ids = P.daChon(z('bang'));
            if (t.lam) {   // tác vụ riêng của màn (mở màn con, hỏi lại riêng)
                if (t.chon !== false && !ids.length) { ui.toast(t.nhac || ('Vui lòng chọn phòng thi cần ' + (t.dongTu || 'thực hiện') + '?'), 'warn'); return; }
                t.lam(ids, api);
                return;
            }
            if (!ids.length) { ui.toast('Vui lòng chọn phòng thi cần ' + t.dongTu + '?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn ' + t.dongTu + ' phòng thi?', { ok: t.ten })
                .then(function (yes) {
                    if (!yes) return;
                    (cfg.thaoTac ? cfg.thaoTac(ids, tv) : P.thaoTacPhong(ids, tv)).then(function () { ui.toast('Cập nhật thành công', 'ok'); tai(); })
                        .catch(function (err) { ums.api.handle(err, 'thực hiện tác vụ'); });
                });
        }

        function moChiTiet(id) {
            var room = phong(id);
            if (!room) return;
            var view = z('view');
            view.innerHTML = '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Phòng thi — ' + esc(e(room.ROOMNAME)) + '</h1>' +
                '<div class="ums-page__actions">' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + '</div></div><div data-ct="host"></div>';
            ui.swap(z('list'), view);
            don = cfg.chiTiet(room, view.querySelector('[data-ct="host"]'));
        }
        function dong() {
            if (typeof don === 'function') don();
            don = null;
            ui.swap(z('view'), z('list'));
            z('view').innerHTML = '';
        }

        api.moChiTiet = moChiTiet;
        api.dong = dong;

        P.ganChonTatCa(z('list'));
        root.addEventListener('click', function (ev) {
            var ph = ev.target.closest('[data-phong]');
            if (ph && z('list').contains(ph)) { moChiTiet(ph.getAttribute('data-phong')); return; }
            var sua = ev.target.closest('[data-sua]');
            if (sua && z('list').contains(sua)) { if (cfg.sua) cfg.sua(phong(sua.getAttribute('data-sua')), api); return; }
            var a = ev.target.closest('[data-a]');
            if (!a) return;
            var k = a.getAttribute('data-a');
            if (k === 'dong' && z('view').contains(a)) { dong(); return; }
            if (!z('list').contains(a)) return;
            if (k === 'search') tai(1);
            else if (k === 'tacvu') tacVuPhong();
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        if (cfg.sauDung) cfg.sauDung(api);
        return api;
    };
})();
