/* =========================================================================
   Đăng ký cơ sở đào tạo (Cổng sinh viên)
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/dangkycosodaotao.html + script/dangkycosodaotao.js
   ---------------------------------------------------------------------------
   Người học = ums.session.userId (vai trò thủ vai: vỏ đã chọn người học trước).
   Lời gọi (PKG_CORE_DK_COSO — chép nguyên action / func / tham số):
       DS_KH_NH  SV_CORE_DK_COSO_MH/BRIeCgkeDwkP   kế hoạch đăng ký của người học (dòng kế hoạch mang DA_DANGKY,
                                                    COSODAOTAO_ID_DACHON và các id người học mà Them_KQ cần)
       DS_KHCS   SV_CORE_DK_COSO_MH/BRIeCgkCEgPP   cơ sở đào tạo của kế hoạch (strCoSoDaoTao_Id '', dHieuLuc 1, strNguoiThucHien_Id)
       Them_KQ   SV_CORE_DK_COSO_MH/FSkkLB4KEAPP   đăng ký lần đầu VÀ đổi cơ sở (cùng một hàm)
       Xoa_KQ    SV_CORE_DK_COSO_MH/GS4gHgoQ       hủy lựa chọn
       HOSO_TQ   SV_NGUOIHOC_01_MH/DSA4CS4SLg8mNC4oCS4iHhUuLyYQNCAv · PKG_CORE_NGUOIHOC_01.LayHoSoNguoiHoc_TongQuan
                 (strCorePerson_Id, strCorePersonStudy_Id '', strHanhDong_Code '') — hồ sơ người học: rsThongTinCoBan
                 + rsDanhSachQHHT (QHHT IS_PRIMARY trước). Gọi song song với kế hoạch; không có kế hoạch vẫn hiện.
   Kho gốc lần kéo 4 (2026-09-30) — đã chuyển:
     · Thông tin người học lấy từ HOSO_TQ, GỘP (không thay) với dòng kế hoạch (mergeNguoiHoc) — hai nguồn về bất đồng bộ.
     · Tên cột dò mới (FIELD chép nguyên): tách Khoa (đơn vị, NH_KHOA) với Khóa (niên khóa, NH_KHOAHOC);
       CS_ID KHÔNG còn lùi về 'ID' (id dòng kế hoạch–cơ sở — lấy nhầm là lưu sai cơ sở).
     · Cơ sở đang đăng ký đọc ở dòng KẾ HOẠCH (DA_DANGKY + COSODAOTAO_ID_DACHON); cờ theo từng cơ sở chỉ còn là dự phòng.
     · Lưu / hủy xong nạp lại KẾ HOẠCH (giữ kế hoạch đang xem), không chỉ danh sách cơ sở.
     · Họ tên tách đôi (HODEM + TEN) thì ghép; pick() lượt 2 khớp không phân biệt hoa thường.
     · Ảnh cơ sở là đường dẫn tương đối → ghép rootPathUpload (ums.files.url), bỏ qua URL tuyệt đối / data:.
     · "Xóa lựa chọn" đổi thành "Bỏ chọn" (nút viền thường, chỉ gỡ chọn trên màn); "có thay đổi" = lệch so với DB kể cả khi
       bỏ chọn về rỗng → sau "Bỏ chọn" vẫn "Hoàn tác" được.
   Tên cột: bản gốc CHƯA chốt tên cột trả về — mỗi trường khai một danh sách tên
   dò (FIELD bên dưới, chép nguyên), lấy tên đầu tiên có giá trị. Giữ nguyên cách đó.

   Bố cục giữ nguyên (bản gốc tự dựng, lưới 2fr | 1fr):
       0. Ô "Kế hoạch đăng ký" — chỉ hiện khi người học có từ 2 kế hoạch
       1. Khung kế hoạch (tên, nhãn hiệu lực / phạm vi, thời gian, đối tượng) | thông tin người học
       2. Hộp trạng thái (chưa đăng ký / đã đăng ký + "Hủy lựa chọn" / đã hủy) | lần xác nhận gần nhất
       3. "Lựa chọn cơ sở đào tạo" (thẻ chọn MỘT + nút Bỏ chọn · Hoàn tác · Đóng · Xác nhận)
          | "Thông tin lựa chọn của bạn" + "Thay đổi lựa chọn cơ sở"
   Ba modal xác nhận (đăng ký / hủy / thay đổi) → ums.ui.confirm, giữ nguyên chữ.

   Bỏ:
     · Bảng "Lịch sử thay đổi lựa chọn" — bản gốc đã chú thích bỏ trong html (chưa
       có API), pushLichSu chỉ ghi vào bảng ẩn đó.
     · FIELD KH_ID / NH_* / CS_* đọc bằng pick() — giữ; logFields (console) — bỏ.
   Kiểu riêng: css/dangkycosodaotao.css (tiền tố dkcs-).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('dkh-dkcs');
    var A = 'SV_CORE_DK_COSO_MH/', P = 'PKG_CORE_DK_COSO.';
    var API = {
        DS_KH_NH: { action: A + 'BRIeCgkeDwkP', func: P + 'DS_KH_NH' },
        DS_KHCS: { action: A + 'BRIeCgkCEgPP', func: P + 'DS_KHCS' },
        THEM_KQ: { action: A + 'FSkkLB4KEAPP', func: P + 'Them_KQ' },
        XOA_KQ: { action: A + 'GS4gHgoQ', func: P + 'Xoa_KQ' },
        HOSO_TQ: { action: 'SV_NGUOIHOC_01_MH/DSA4CS4SLg8mNC4oCS4iHhUuLyYQNCAv', func: 'PKG_CORE_NGUOIHOC_01.LayHoSoNguoiHoc_TongQuan' }
    };
    /* Tên cột dò — chép nguyên bản gốc */
    var F = {
        KH_ID: ['ID', 'KEHOACH_ID', 'CORE_DK_COSO_KEHOACH_ID'],
        KH_TEN: ['TENKEHOACH', 'TEN_KEHOACH', 'TEN', 'KEHOACH_TEN'],
        KH_TUNGAY: ['TUNGAY', 'NGAYBATDAU', 'TU_NGAY', 'NGAY_BATDAU'],
        KH_DENNGAY: ['DENNGAY', 'NGAYKETTHUC', 'DEN_NGAY', 'NGAY_KETTHUC'],
        KH_DOITUONG: ['DOITUONG', 'DOITUONG_APDUNG', 'MOTA', 'GHICHU'],
        KH_HIEULUC: ['HIEULUC', 'CONHIEULUC', 'TRANGTHAI', 'DTRANGTHAI'],
        /* Trạng thái đăng ký nằm ở dòng kế hoạch, KHÔNG nằm ở dòng cơ sở */
        KH_DADANGKY: ['DA_DANGKY', 'DADANGKY'],
        KH_COSO_DACHON: ['COSODAOTAO_ID_DACHON', 'COSO_ID_DACHON'],
        /* Người học — nguồn chính HOSO_TQ (rsThongTinCoBan); vẫn giữ tên cột của DS_KH_NH */
        NH_HOTEN: ['FULL_NAME', 'SINHVIEN_TENDAYDU', 'HOTEN', 'HO_TEN', 'TENNGUOIHOC', 'PERSON_NAME'],
        NH_MASO: ['MA_SINHVIEN', 'MA_NGUOIHOC_CHINH', 'STUDY_CODE', 'QLSV_NGUOIHOC_MASO', 'MANGUOIHOC', 'MASO', 'MASINHVIEN', 'MA'],
        NH_LOP: ['LOP_HIENTAI_TEN', 'LOP_HIENTAI_MA', 'LOPQUANLY_TEN', 'LOP_TEN', 'TENLOP', 'LOP', 'DAOTAO_LOPQUANLY_TEN'],
        /* Không dấu thì "Khoa" (đơn vị) và "Khóa" (niên khóa) viết giống nhau — KHÔNG để lẫn tên cột giữa hai nhóm */
        NH_KHOA: ['KHOA_TEN', 'KHOAQUANLY_TEN', 'DONVI_QUANLY_TEN', 'DONVI_TEN'],
        NH_CTDT: ['NGANH_TEN', 'TENCHUONGTRINH', 'TOCHUCCT_TEN', 'CHUONGTRINH_TEN', 'NGANH', 'DAOTAO_TOCHUCCT_TEN'],
        NH_KHOAHOC: ['TENKHOA', 'MAKHOA', 'KHOA_NAM', 'KHOAHOC_TEN', 'KHOADAOTAO_TEN', 'NIENKHOA', 'TENKHOAHOC', 'KHOAHOC'],
        NH_PERSONSTUDY_ID: ['STUDY_ID', 'CORE_PERSON_STUDY_ID', 'COREPERSONSTUDY_ID', 'PERSON_STUDY_ID'],
        NH_TOCHUCCT_ID: ['DAOTAO_TOCHUCCHUONGTRINH_ID', 'DAOTAO_TOCHUCCT_ID', 'TOCHUCCT_ID'],
        NH_LOPQUANLY_ID: ['LOP_HIENTAI_ID', 'LOP_ID', 'DAOTAO_LOPQUANLY_ID', 'LOPQUANLY_ID'],
        /* CS_ID phải là COSODAOTAO_ID — KHÔNG lùi về 'ID' (id dòng liên kết kế hoạch–cơ sở) */
        CS_ID: ['COSODAOTAO_ID', 'COSO_ID', 'CS_ID'],
        CS_TEN: ['COSO_TEN', 'COSODAOTAO_TEN', 'TEN', 'TENCOSO'],
        CS_MA: ['COSO_MA', 'COSODAOTAO_MA', 'MACOSO'],
        CS_DIACHI: ['DIA_CHI', 'DIACHI', 'DIACHI_COSO'],
        CS_CHITIEU: ['SO_LUONG_TOI_DA', 'CHI_TIEU', 'CHITIEU', 'SOLUONG'],
        CS_MOTA: ['GHICHU', 'MO_TA', 'MOTA', 'DIENGIAI'],
        CS_ANH: ['ANH', 'ANHDAIDIEN', 'HINHANH', 'FILEANH'],
        CS_DACHON: ['DADANGKY', 'DACHON', 'ISCHON', 'DALUACHON', 'TRANGTHAIDANGKY'],
        CS_NGAYXACNHAN: ['NGAYXACNHAN', 'THOIGIANXACNHAN', 'NGAY_XACNHAN']
    };

    var svId = (ums.session && ums.session.userId) || '';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    /* Lượt 1 khớp đúng tên; lượt 2 bỏ qua hoa / thường (máy chủ không thống nhất kiểu chữ giữa các thủ tục — như gốc) */
    function pick(o, keys, d) {
        var def = d === undefined ? '' : d, i, v;
        if (!o || !keys) return def;
        for (i = 0; i < keys.length; i++) { v = o[keys[i]]; if (v !== undefined && v !== null && v !== '') return String(v); }
        var map = {};
        Object.keys(o).forEach(function (k) { map[k.toLowerCase()] = o[k]; });
        for (i = 0; i < keys.length; i++) { v = map[String(keys[i]).toLowerCase()]; if (v !== undefined && v !== null && v !== '') return String(v); }
        return def;
    }
    function txt(v, d) { return v === undefined || v === null || v === '' ? (d === undefined ? '' : d) : String(v); }
    function isTrue(v) { var s = txt(v, '').trim().toUpperCase(); return s === '1' || s === 'Y' || s === 'TRUE' || s === 'X'; }
    /* Giữ nguyên chuỗi ngày máy chủ trả, chỉ cắt phần giờ kiểu ISO (như gốc) */
    function ngay(v, d) { var s = txt(v, ''); if (s === '') return d === undefined ? '' : d; if (s.indexOf('T') > 0) s = s.split('T')[0]; return s; }
    /* Còn hạn khi hôm nay <= ngày kết thúc (dd/MM/yyyy hoặc yyyy-MM-dd); không đọc được thì coi là còn hạn (như gốc) */
    function conHan(den) {
        var s = ngay(den, ''), d = null, m;
        if (s === '') return true;
        if ((m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/))) d = new Date(+m[3], +m[2] - 1, +m[1]);
        else if ((m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/))) d = new Date(+m[1], +m[2] - 1, +m[3]);
        if (!d || isNaN(d.getTime())) return true;
        d.setHours(23, 59, 59, 999);
        return d.getTime() >= Date.now();
    }
    function bayGio() {
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }
    function goi(api, o) { return ums.api.call(Object.assign({ action: api.action, func: api.func }, o)); }

    /* ---------- Trạng thái ---------- */
    var S = {
        dtKeHoach: [], objKeHoach: {}, objNguoiHoc: {}, dtCoSo: [],
        daDK: '',          // cơ sở đang ghi nhận trong DB
        dangChon: '',      // cơ sở đang chọn tạm trên màn (chưa ghi)
        choPhep: true,     // kế hoạch còn hạn
        daHuy: false       // vừa hủy lựa chọn
    };

    /* ---------- Dựng khung ---------- */
    function hop(z, tone, icon, tieuDe, loi, extra) {
        return '<div class="dkcs-alert dkcs-alert--' + tone + '" data-z="' + z + '"><i class="fa-light ' + icon + '"></i>' +
            '<p><b>' + tieuDe + '</b><br><span>' + loi + '</span></p>' + (extra || '') + '</div>';
    }
    root.innerHTML =
        pat.page('Đăng ký cơ sở đào tạo', '') +
        '<div class="dkcs-pick ums-u-mb-4" data-z="pick" hidden>' +
            ui.field('Kế hoạch đăng ký', '<select class="ums-select" data-f="kh" data-required data-ph="Kế hoạch đăng ký"></select>', { inline: true, labelWidth: '160px' }) +
        '</div>' +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-grid ums-grid--main-aside">' +
                '<div>' +
                    '<div class="dkcs-plan__head"><i class="fa-light fa-bullhorn"></i><b data-z="khTen">Kế hoạch đăng ký cơ sở đào tạo</b>' +
                        '<span data-z="hieuLuc"></span><span data-z="phamVi"></span></div>' +
                    '<div class="dkcs-plan__row"><i class="fa-light fa-calendar"></i><span>Thời gian đăng ký:</span><b data-z="thoiGian">--/--/---- - --/--/----</b></div>' +
                    '<div class="dkcs-plan__row"><i class="fa-light fa-circle-info"></i><span>Đối tượng áp dụng:</span><span data-z="doiTuong">-</span></div>' +
                '</div>' +
                '<div class="dkcs-learner"><i class="fa-light fa-user"></i><div>' +
                    '<div class="dkcs-learner__cap">Thông tin người học</div>' +
                    '<div class="dkcs-learner__name" data-z="hoTen">-</div>' +
                    '<div>Mã hồ sơ / MSSV: <b data-z="maSo">-</b></div>' +
                    '<div><span data-z="lop">-</span><span class="dkcs-sep">|</span><span data-z="khoa">-</span></div>' +
                '</div></div>' +
            '</div>' }) +
        '<div class="ums-grid ums-grid--main-aside ums-u-mb-4">' +
            '<div class="dkcs-fill">' +
                hop('boxChua', 'info', 'fa-circle-info', 'Bạn chưa đăng ký cơ sở đào tạo.',
                    'Vui lòng chọn một trong các cơ sở đào tạo bên dưới trước khi kết thúc thời gian đăng ký.') +
                hop('boxDa', 'warn', 'fa-circle-info', 'Bạn đã đăng ký cơ sở đào tạo.',
                    'Hiện tại bạn đang đăng ký <b data-z="csHienTai">-</b>. Bạn có thể thay đổi hoặc hủy lựa chọn khi kế hoạch còn hạn.',
                    ui.btn('del', { text: 'Hủy lựa chọn', mod: 'out-danger', cls: 'ums-btn--sm', attr: { 'data-a': 'huy' } })) +
                hop('boxHuy', 'bad', 'fa-triangle-exclamation', 'Bạn đã hủy lựa chọn cơ sở đào tạo.',
                    'Lựa chọn trước đó đã được ghi lịch sử với hành động "Hủy". Vui lòng chọn lại cơ sở trước khi hết hạn đăng ký.') +
            '</div>' +
            '<div class="dkcs-fill"><div class="dkcs-alert dkcs-alert--plain"><i class="fa-light fa-clock"></i>' +
                '<p>Lần xác nhận gần nhất:<br><b data-z="lanXN">Chưa có</b></p></div></div>' +
        '</div>' +
        '<div class="ums-grid ums-grid--main-aside dkcs-top">' +
            '<div>' + pat.panel({ title: 'Lựa chọn cơ sở đào tạo', icon: 'fa-building-columns', body:
                hop('canhBao', 'bad', 'fa-triangle-exclamation', 'Hiện tại bạn chưa chọn cơ sở đào tạo.',
                    'Nếu không chọn cơ sở nào trước khi hết hạn, hệ thống sẽ ghi nhận trạng thái chưa đăng ký cơ sở đào tạo.') +
                '<div class="dkcs-grid" data-z="coSo"></div>' +
                hop('luuY', 'warn', 'fa-circle-exclamation', 'Bạn chỉ được chọn 01 cơ sở đào tạo.',
                    'Lựa chọn có thể thay đổi nhiều lần trong thời hạn đăng ký; mỗi lần thay đổi đều được ghi lại lịch sử.'),
                foot: '<div class="ums-row ums-row--between">' +
                    /* "Bỏ chọn" chỉ gỡ chọn trên màn (không ghi) — xoá thật là "Hủy lựa chọn" ở hộp trạng thái */
                    '<div>' + ui.btn('search', { text: 'Bỏ chọn', icon: 'fa-xmark', mod: 'ghost', attr: { 'data-a': 'xoaChon' } }) + '</div>' +
                    '<div class="ums-row">' +
                        ui.btn('search', { text: 'Hoàn tác', icon: 'fa-rotate-left', mod: 'ghost', attr: { 'data-a': 'hoanTac' } }) +
                        ui.btn('close', { text: 'Đóng', attr: { 'data-a': 'dong' } }) +
                        ui.btn('search', { text: 'Xác nhận lựa chọn', icon: 'fa-check', attr: { 'data-a': 'xacNhan' } }) +
                    '</div></div>' }) + '</div>' +
            '<div class="ums-stack">' +
                pat.panel({ title: 'Thông tin lựa chọn của bạn', icon: 'fa-user', body:
                    '<div class="ums-stack ums-stack--tight">' +
                        '<div class="ums-kv"><span>Họ và tên</span><b data-z="kvHoTen">-</b></div>' +
                        '<div class="ums-kv"><span>Mã hồ sơ / MSSV</span><b data-z="kvMaSo">-</b></div>' +
                        '<div class="ums-kv"><span>Ngành / Chương trình</span><b data-z="kvCt">-</b></div>' +
                        '<div class="ums-kv"><span>Khóa học</span><b data-z="kvKhoa">-</b></div>' +
                        '<div class="ums-kv"><span>Lớp</span><b data-z="kvLop">-</b></div>' +
                    '</div>' +
                    '<div class="dkcs-current"><i class="fa-light fa-graduation-cap"></i><b>Cơ sở hiện tại</b><span data-z="pillHienTai"></span></div>' }) +
                pat.panel({ title: 'Thay đổi lựa chọn cơ sở', icon: 'fa-arrow-right-arrow-left', body:
                    '<div class="dkcs-fromto">' +
                        '<span class="dkcs-fromto__lbl">Thay đổi từ</span><span data-z="tu"></span>' +
                        '<span class="dkcs-fromto__arrow"><i class="fa-light fa-arrow-down"></i></span>' +
                        '<span class="dkcs-fromto__lbl">Sang</span><span data-z="sang"></span>' +
                    '</div>' +
                    '<div class="dkcs-last"><i class="fa-light fa-clock"></i><div><div>Thời gian xác nhận gần nhất</div><b data-z="tgXN">Chưa có</b></div></div>' }) +
            '</div>' +
        '</div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function a(k) { return root.querySelector('[data-a="' + k + '"]'); }
    function chu(k, s) { var el = z(k); if (el) el.textContent = s; }
    var fKh = root.querySelector('[data-f="kh"]');

    function tenCoSo(id) {
        if (!id) return '';
        for (var i = 0; i < S.dtCoSo.length; i++) if (pick(S.dtCoSo[i], F.CS_ID) === String(id)) return pick(S.dtCoSo[i], F.CS_TEN);
        return '';
    }

    /* ---------- Vẽ lại toàn bộ trạng thái (refreshUI của gốc) ---------- */
    function refresh() {
        /* Lệch so với DB là "có thay đổi" — kể cả khi bỏ chọn về rỗng (để "Hoàn tác" còn dùng được, như gốc) */
        var daDK = !!S.daDK, daChon = !!S.dangChon, thayDoi = S.dangChon !== S.daDK;

        Array.prototype.forEach.call(root.querySelectorAll('.dkcs-campus'), function (c) {
            var r = c.querySelector('input');
            c.classList.toggle('is-selected', daChon && r.value === S.dangChon);
            c.classList.toggle('is-disabled', !S.choPhep);
            r.checked = daChon && r.value === S.dangChon;
            r.disabled = !S.choPhep;
        });

        z('boxChua').hidden = !(!daDK && !S.daHuy);
        z('boxDa').hidden = !daDK;
        z('boxHuy').hidden = !(!daDK && S.daHuy);
        z('canhBao').hidden = !(!daDK && !daChon);

        var tenDK = tenCoSo(S.daDK);
        if (daDK) {
            chu('csHienTai', tenDK);
            z('pillHienTai').innerHTML = ui.badge(tenDK, 'ok');
            z('tu').innerHTML = ui.badge(tenDK, 'mute');
        } else {
            z('pillHienTai').innerHTML = ui.badge('Chưa đăng ký', 'bad');
            z('tu').innerHTML = ui.badge('Chưa đăng ký', 'mute');
        }
        z('sang').innerHTML = ui.badge((thayDoi && tenCoSo(S.dangChon)) || 'Chưa chọn', 'info');

        var tg = txt(S.objNguoiHoc.NGAYXACNHAN, '');
        chu('tgXN', tg !== '' ? tg : 'Chưa có');
        chu('lanXN', tg !== '' ? tg + (daDK ? ' - ' + tenDK : '') : 'Chưa có');

        var nut = a('xacNhan');
        nut.querySelector('span').textContent = daDK ? 'Xác nhận thay đổi' : 'Xác nhận lựa chọn';
        nut.disabled = !S.choPhep || !daChon || !thayDoi;
        a('xoaChon').disabled = !S.choPhep || !daChon;
        a('hoanTac').disabled = !S.choPhep || !thayDoi;
        a('huy').disabled = !S.choPhep || !daDK;
    }

    /* ---------- Đổ thông tin kế hoạch / người học ---------- */
    function veKeHoach(o) {
        S.objKeHoach = o || {};
        chu('khTen', pick(o, F.KH_TEN, 'Kế hoạch đăng ký cơ sở đào tạo'));
        chu('thoiGian', ngay(pick(o, F.KH_TUNGAY), '--/--/----') + ' - ' + ngay(pick(o, F.KH_DENNGAY), '--/--/----'));
        chu('doiTuong', pick(o, F.KH_DOITUONG, '-'));
        var con = isTrue(pick(o, F.KH_HIEULUC, '1')) && conHan(pick(o, F.KH_DENNGAY));
        z('hieuLuc').innerHTML = ui.badge(con ? 'Kế hoạch còn hiệu lực' : 'Kế hoạch đã hết hạn', con ? 'ok' : 'bad');
        /* Lấy được kế hoạch từ DS_KH_NH tức là đã thuộc phạm vi (như gốc) */
        z('phamVi').innerHTML = ui.badge('Bạn thuộc phạm vi được đăng ký', 'ok');
        S.choPhep = con;
    }
    /* GỘP thêm dữ liệu người học rồi vẽ lại (mergeNguoiHoc của gốc): HOSO_TQ cho phần hiển thị, dòng kế hoạch cho
       các id Them_KQ cần — hai nguồn về bất đồng bộ nên cộng dồn, không ghi đè cả khối. */
    function gopNguoiHoc(o) {
        if (o) S.objNguoiHoc = Object.assign({}, S.objNguoiHoc, o);
        veNguoiHoc();
    }
    function veNguoiHoc() {
        var o = S.objNguoiHoc;
        var tv = ums.thuVai && ums.thuVai.hienTai && ums.thuVai.hienTai(ums.state && ums.state.roleId);
        /* Họ tên tách đôi (HODEM + TEN) thì ghép; vẫn không có thì lấy tên người đang thủ vai */
        var hoTen = pick(o, F.NH_HOTEN) || (pick(o, ['HODEM']) + ' ' + pick(o, ['TEN'])).trim() || txt(tv && tv.info && tv.info.ten, '-');
        var maSo = pick(o, F.NH_MASO, '-'), lop = pick(o, F.NH_LOP, '-');
        chu('hoTen', hoTen); chu('maSo', maSo);
        chu('lop', 'Lớp: ' + lop); chu('khoa', 'Khoa: ' + pick(o, F.NH_KHOA, '-'));
        chu('kvHoTen', hoTen); chu('kvMaSo', maSo); chu('kvCt', pick(o, F.NH_CTDT, '-'));
        chu('kvKhoa', pick(o, F.NH_KHOAHOC, '-')); chu('kvLop', lop);
    }
    function khongCoKeHoach() {
        S.choPhep = false;
        chu('khTen', 'Chưa có kế hoạch đăng ký cơ sở đào tạo');
        z('hieuLuc').innerHTML = ui.badge('Không có kế hoạch', 'bad');
        z('phamVi').innerHTML = '';
        z('coSo').innerHTML = ui.empty('Hiện chưa có kế hoạch đăng ký cơ sở đào tạo áp dụng cho bạn.', 'fa-folder-open');
        refresh();
    }

    /* ---------- Thẻ cơ sở đào tạo ---------- */
    function veCoSo(data) {
        S.dtCoSo = data || [];
        if (!S.dtCoSo.length) {
            z('coSo').innerHTML = ui.empty('Kế hoạch chưa khai báo cơ sở đào tạo nào.', 'fa-folder-open');
            refresh();
            return;
        }
        /* Cơ sở đang đăng ký: máy chủ trả ở dòng KẾ HOẠCH (DA_DANGKY + COSODAOTAO_ID_DACHON);
           cờ theo từng cơ sở của DS_KHCS chỉ còn là dự phòng (như gốc) */
        S.daDK = '';
        if (isTrue(pick(S.objKeHoach, F.KH_DADANGKY, '0'))) S.daDK = pick(S.objKeHoach, F.KH_COSO_DACHON);
        if (!S.daDK) {
            for (var k = 0; k < S.dtCoSo.length; k++) {
                if (isTrue(pick(S.dtCoSo[k], F.CS_DACHON, '0'))) {
                    S.daDK = pick(S.dtCoSo[k], F.CS_ID);
                    S.objNguoiHoc.NGAYXACNHAN = pick(S.dtCoSo[k], F.CS_NGAYXACNHAN);
                    break;
                }
            }
        }
        S.dangChon = S.daDK;
        if (S.daDK) S.daHuy = false;   // vừa hủy thì giữ hộp "đã hủy" ở lần nạp lại

        z('coSo').innerHTML = S.dtCoSo.map(function (o) {
            var id = pick(o, F.CS_ID), ten = pick(o, F.CS_TEN, '-'), ma = pick(o, F.CS_MA), anh = pick(o, F.CS_ANH), ct = pick(o, F.CS_CHITIEU);
            /* Máy chủ lưu đường dẫn tương đối → ghép rootPathUpload; URL tuyệt đối / data: giữ nguyên (như gốc) */
            if (anh && !/^(https?:)?\/\//i.test(anh) && anh.indexOf('data:') !== 0 && ums.files && ums.files.url) anh = ums.files.url(anh);
            return '<label class="dkcs-campus">' +
                '<input type="radio" name="rdCoSo_DKCS" value="' + esc(id) + '">' +
                (anh ? '<img class="dkcs-campus__img" src="' + esc(anh) + '" alt="' + esc(ten) + '">' : '') +
                '<div class="dkcs-campus__body">' +
                    '<p class="dkcs-campus__name">' + esc(ten) + (ma ? ' (' + esc(ma) + ')' : '') + '</p>' +
                    '<p class="dkcs-campus__line"><i class="fa-light fa-location-dot"></i><span>' + esc(pick(o, F.CS_DIACHI, '-')) + '</span></p>' +
                    (ct ? '<p class="dkcs-campus__line"><i class="fa-light fa-user-group"></i><span>Chỉ tiêu dự kiến: ' + esc(ct) + '</span></p>' : '') +
                    '<p class="dkcs-campus__note">' + esc(pick(o, F.CS_MOTA)) + '</p>' +
                '</div></label>';
        }).join('');
        refresh();
    }

    /* ---------- Nạp dữ liệu ---------- */
    function taiCoSo() {
        var kh = pick(S.objKeHoach, F.KH_ID);
        if (!kh) return;
        goi(API.DS_KHCS, { strKeHoach_Id: kh, strCoSoDaoTao_Id: '', dHieuLuc: 1, strNguoiThucHien_Id: uid() })
            .then(function (r) { veCoSo(Array.isArray(r.data) ? r.data : []); })
            .catch(function (err) { ums.api.handle(err, API.DS_KHCS.func); });
    }
    function chonKeHoach(id) {
        var o = null;
        for (var i = 0; i < S.dtKeHoach.length; i++) if (pick(S.dtKeHoach[i], F.KH_ID) === String(id)) { o = S.dtKeHoach[i]; break; }
        if (!o) return false;
        veKeHoach(o);
        if (fKh.value !== String(id)) { fKh.value = String(id); if (window.jQuery) jQuery(fKh).trigger('change.select2'); }
        /* Dòng kế hoạch mang các id Them_KQ cần → gộp vào, không thay phần hiển thị lấy từ HOSO_TQ */
        gopNguoiHoc(o);
        refresh();
        taiCoSo();
        return true;
    }
    /* Hồ sơ người học (HOSO_TQ) — độc lập với kế hoạch; QHHT chính (IS_PRIMARY) trước, thông tin cơ bản đè lên khi trùng cột */
    function taiNguoiHoc() {
        goi(API.HOSO_TQ, { strCorePerson_Id: svId, strCorePersonStudy_Id: '', strNguoiThucHien_Id: uid(), strHanhDong_Code: '' }).then(function (r) {
            var d = r.data || {};
            var tt = d.rsThongTinCoBan || d.ThongTinCoBan || [], qh = d.rsDanhSachQHHT || d.DanhSachQHHT || [];
            var chinh = null;
            for (var i = 0; i < qh.length; i++) if (isTrue(qh[i].IS_PRIMARY)) { chinh = qh[i]; break; }
            if (!chinh && qh.length) chinh = qh[0];
            gopNguoiHoc(Object.assign({}, chinh || {}, tt.length ? tt[0] : {}));
        }).catch(function (err) { ums.api.handle(err, API.HOSO_TQ.func); });
    }
    /* giu: nạp lại sau khi lưu / hủy thì giữ kế hoạch đang xem; không thấy (hoặc lần đầu) thì lấy kế hoạch đầu tiên */
    function taiKeHoach(giu) {
        goi(API.DS_KH_NH, { strNguoiThucHien_Id: uid(), strCore_Person_Id: svId }).then(function (r) {
            S.dtKeHoach = Array.isArray(r.data) ? r.data : [];
            /* Ô chọn kế hoạch chỉ hiện khi có từ 2 kế hoạch */
            z('pick').hidden = S.dtKeHoach.length < 2;
            if (S.dtKeHoach.length >= 2) {
                fKh.innerHTML = S.dtKeHoach.map(function (o) {
                    return '<option value="' + esc(pick(o, F.KH_ID)) + '">' + esc(pick(o, F.KH_TEN, '-')) + '</option>';
                }).join('');
                if (window.jQuery) jQuery(fKh).trigger('change.select2');
            }
            if (!S.dtKeHoach.length) { khongCoKeHoach(); return; }
            if (!giu || chonKeHoach(giu) === false) chonKeHoach(pick(S.dtKeHoach[0], F.KH_ID));
        }).catch(function (err) { ums.api.handle(err, API.DS_KH_NH.func); });
    }

    /* ---------- Ghi ---------- */
    function luuDangKy() {
        var cs = S.dangChon;
        if (!cs) return;
        goi(API.THEM_KQ, {
            strKeHoach_Id: pick(S.objKeHoach, F.KH_ID),
            strCorePerson_Id: svId,
            strCorePersonStudy_Id: pick(S.objNguoiHoc, F.NH_PERSONSTUDY_ID),
            strMaNguoiHoc: pick(S.objNguoiHoc, F.NH_MASO),
            strCoSoDaoTao_Id: cs,
            strDaoTao_ToChucCT_Id: pick(S.objNguoiHoc, F.NH_TOCHUCCT_ID),
            strDaoTao_LopQuanLy_Id: pick(S.objNguoiHoc, F.NH_LOPQUANLY_ID),
            strNgayXacNhan: '',
            strNguoiThucHien_Id: uid(),
            strGhiChu: ''
        }).then(function () {
            S.daDK = cs; S.dangChon = cs; S.daHuy = false;
            S.objNguoiHoc.NGAYXACNHAN = bayGio();
            refresh();
            ui.toast('Đăng ký cơ sở đào tạo thành công!', 'ok');
            /* Nạp lại KẾ HOẠCH (cờ DA_DANGKY / COSODAOTAO_ID_DACHON nằm ở dòng kế hoạch), giữ kế hoạch đang xem */
            taiKeHoach(pick(S.objKeHoach, F.KH_ID));
        }).catch(function (err) { ums.api.handle(err, API.THEM_KQ.func); });
    }
    function luuHuy() {
        if (!S.daDK) return;
        goi(API.XOA_KQ, { strNguoiThucHien_Id: uid(), strCorePerson_Id: svId }).then(function () {
            S.daDK = ''; S.dangChon = ''; S.daHuy = true;
            S.objNguoiHoc.NGAYXACNHAN = bayGio();
            refresh();
            ui.toast('Đã hủy lựa chọn cơ sở đào tạo!', 'ok');
            taiKeHoach(pick(S.objKeHoach, F.KH_ID));
        }).catch(function (err) { ums.api.handle(err, API.XOA_KQ.func); });
    }

    /* ---------- Sự kiện ---------- */
    z('coSo').addEventListener('change', function (ev) {
        if (ev.target.name !== 'rdCoSo_DKCS') return;
        S.dangChon = ev.target.value;
        refresh();
    });
    fKh.addEventListener('change', function () { chonKeHoach(fKh.value); });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || b.disabled) return;
        var k = b.getAttribute('data-a');
        if (k === 'xoaChon') { S.dangChon = ''; refresh(); }
        else if (k === 'hoanTac' || k === 'dong') { S.dangChon = S.daDK; refresh(); }   // về đúng cơ sở đang lưu
        else if (k === 'xacNhan') {
            if (!S.dangChon) { ui.toast('Vui lòng chọn cơ sở đào tạo trước khi xác nhận!', 'warn'); return; }
            var ten = tenCoSo(S.dangChon);
            var hoi = S.daDK
                ? ui.confirm('Chuyển từ ' + tenCoSo(S.daDK) + ' sang ' + ten + '? Lựa chọn mới sẽ thay thế lựa chọn hiện tại và được ghi lịch sử.',
                    { title: 'Xác nhận thay đổi cơ sở', cancel: 'Hủy', ok: 'Xác nhận thay đổi' })
                : ui.confirm('Bạn có chắc chắn muốn đăng ký ' + ten + ' không?', { title: 'Xác nhận đăng ký', cancel: 'Hủy', ok: 'Xác nhận' });
            hoi.then(function (yes) { if (yes) luuDangKy(); });
        }
        else if (k === 'huy') {
            ui.confirm('Bạn có chắc chắn muốn hủy lựa chọn ' + tenCoSo(S.daDK) + '? Sau khi hủy, bạn sẽ ở trạng thái chưa đăng ký cơ sở đào tạo. Hành động này sẽ được ghi vào lịch sử đăng ký.',
                { title: 'Xác nhận hủy lựa chọn', tone: 'bad', cancel: 'Đóng', ok: 'Xác nhận hủy' })
                .then(function (yes) { if (yes) luuHuy(); });
        }
    });

    refresh();
    taiNguoiHoc();
    taiKeHoach();
})();
