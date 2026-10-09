/* =========================================================================
   nguyenvong — Cổng sinh viên › Đăng ký nguyện vọng (vai trò thủ vai: người học = ums.session.userId).
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/nguyenvong.html + script/nguyenvong.js (vỏ index).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc, MỘT cột: khối "Thông tin thí sinh" (Mã số · Họ và tên · Ngành học · Kế hoạch * ·
   Kiểu học * · Số tín chỉ tối đa · nút "Xem học phần") → bảng "nguyện vọng chưa đăng ký" + Đăng ký →
   bảng "nguyện vọng đã đăng ký" + Hủy đăng ký. Khung hai bảng dùng chung: ums.pat.haiLuoi.

   Lời gọi (chép nguyên action / func / tên tham số):
     danh mục DANGKY.NGUYENVONG.MOHINH → ô "Hình thức học" trong từng dòng (không có mục nào thì ẩn cột).
     DKH_Chung_MH · pkg_dangkyhoc_chung.LayDSChuongTrinh (strQLSV_NguoiHoc_Id) → dòng đầu: QLSV_NGUOIHOC_HODEM/TEN/MASO,
         DAOTAO_TOCHUCCHUONGTRINH_TEN (Ngành học), DAOTAO_TOCHUCCHUONGTRINH_ID (chương trình dùng cho mọi lời gọi sau).
     DKH_NguyenVong_MH · pkg_dangky_nguyenvong.
         LayDSKeHoachDangKyNguyenVong (strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id) → ô Kế hoạch (ID/TENKEHOACH, SOTINCHITOIDA),
             chỉ có MỘT kế hoạch thì tự chọn (selectOne của gốc).
         LayDSKieuDangKyTheoKeHoach (strKeHoachNguyenVong_Id, strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id) → ô Kiểu học (ID/TEN).
         LayDSQuyMoLopDangKy (strDangKy_NguyenVong_Id = kế hoạch, strQLSV_NguoiHoc_Id) → ô "Quy mô" trong dòng (không có thì ẩn cột).
         LayDSHocPhanChuaDangKy / LayDSHocPhanDaDangKy (strKeHoachNguyenVong_Id, strKieuHoc_Id, strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id).
         DangKyNguyenVong (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id, strDangKy_KeHoachDangKy_Id, strDaoTao_HocPhan_Id,
             strDanhGia_Id, strKieuHoc_Id, strQuyMoLop_Id, strMoHinhHoc_Id, strDiem) — mỗi dòng một lời gọi.
         HuyDangKyNguyenVong (strIds = ID dòng, strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id,
             strDangKy_KeHoachDangKy_Id = DANGKY_KEHOACHLAYNGUYENVONG_ID) — mỗi dòng một lời gọi.
     TC_TinhTien_MH · pkg_taichinh_tinhtien.LayDSPhiTheoHocPhan (mỗi dòng của CẢ HAI bảng) → "Mức phí dự kiến"
         = PHIPHAIDONG − PHIDUOCMIEN. Gốc đọc kế hoạch / kiểu học bằng edu.system.getValById (ô trống → undefined →
         KHÔNG gửi khoá) — giữ y như vậy.
     strNguoiThucHien_Id = edu.system.userId ở gốc → để api.js tự điền (cùng giá trị).

   Khác bản gốc:
     · Kế hoạch → Kiểu học là cặp CHA → CON (luật 2026-09-21): chưa chọn kế hoạch thì khoá Kiểu học; đổi kế hoạch
       thì xoá trắng Kiểu học TRƯỚC khi nạp lại bảng "chưa đăng ký" (gốc gửi kiểu học CŨ vì ô chưa kịp đổ lại);
       xoá kế hoạch thì xoá Kiểu học, Số tín chỉ tối đa và đưa hai bảng về lời nhắc (gốc: không làm gì).
     · Gốc đợi 1 giây rồi mới nạp thông tin người học, và vẽ bảng có thể TRƯỚC khi danh sách quy mô / hình thức học về
       (me.dtQuyMo chưa có → lỗi JS). Ở đây đợi đủ hai danh sách đó rồi mới vẽ.
     · Đăng ký / Hủy nhiều dòng: ums.ui.batch (tuần tự, có tiến độ) rồi nạp lại hai bảng MỘT lần như start_Progress gốc.
     · Ô bắt buộc thiếu: viền đỏ ô chọn + thông báo "Vui lòng chọn: …" (field-error của gốc).
     · "Hủy đăng ký" là nút xoá nhiều dòng chuẩn (tự đếm, khoá khi chưa chọn); gốc btn-outline-secondary.
     · Mức phí dự kiến định dạng tiền (gốc in số thô).
     · Bỏ nhánh action 'DKH_NguyenVong/LayDSKeHoachDangKyNguyenVong2' (chỉ chạy khi nút Đăng ký bị ẩn — trong màn này
       nút không bao giờ ẩn) và các hàm chết popup / resetPopup / viewForm_NguyenVong (trỏ tới ô không tồn tại).

   Kéo gốc 30/9: ô chữ "Ngành học" thành Ô CHỌN (dropSearch_NganhDaoTao, bắt buộc *) đổ toàn bộ dòng của
     LayDSChuongTrinh (DAOTAO_TOCHUCCHUONGTRINH_ID / _TEN — SV học nhiều chương trình). Chọn ngành → đổi
     chương trình dùng cho mọi lời gọi, xoá Kế hoạch + Kiểu học + Số tín chỉ tối đa, nạp lại kế hoạch và hai bảng (như gốc).
     Khác gốc:
     · Ngành → Kế hoạch → Kiểu học là chuỗi CHA → CON (ums.pat.chain): chưa chọn ngành thì khoá Kế hoạch.
     · Gốc selectOne: chỉ MỘT ngành mới chọn sẵn; nhiều ngành thì ô hiện trống nhưng mã vẫn dùng ngành ĐẦU (Data[0]).
       Bản mới luôn chọn sẵn ngành đầu để ô hiện đúng ngành đang dùng.
     · Xoá ngành (nút ×) → khoá Kế hoạch / Kiểu học, hai bảng về lời nhắc (gốc chỉ nghe select2:select).
     · Thiếu ngành cũng báo "Vui lòng chọn: Ngành học" như hai ô bắt buộc kia (gốc có dấu * nhưng không kiểm).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('dkh-nguyenvong');
    var SV = (ums.session && ums.session.userId) || '';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var NV = 'DKH_NguyenVong_MH/';
    var strChuongTrinh_Id = '', dtChuongTrinh = [], dtKeHoach = [], dtMoHinh = [], dtQuyMo = [];
    var dtChuaDangKy = [], dtDaDangKy = [];

    function sel(k, ph) { return '<select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>'; }
    function fld(label, ctl, req) { return ui.field(label, ctl, { inline: true, required: req }); }

    root.innerHTML = pat.page('Đăng ký nguyện vọng', '') +
        pat.panel({ title: 'Thông tin thí sinh', icon: 'fa-id-card', cls: 'ums-u-mb-4',
            tools: ui.btn('search', { text: 'Xem học phần', icon: 'fa-magnifying-glass', attr: { 'data-a': 'xem' } }),
            body: '<div class="ums-grid ums-grid--2">' +
                fld('Mã số', '<b data-f="ma"></b>') + fld('Họ và tên', '<b data-f="hoten"></b>') +
                fld('Ngành học', sel('nganh', 'Chọn ngành học'), true) +
                fld('Kế hoạch', sel('kh', 'Chọn kế hoạch đăng ký nguyện vọng'), true) +
                fld('Kiểu học', sel('kieu', 'Chọn kiểu học'), true) +
                fld('Số tín chỉ tối đa', '<input class="ums-input" data-f="sotc" readonly>') + '</div>' }) +
        '<div data-z="luoi"></div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value : ''; }

    /* ---------- Ô bắt buộc (kiemTraBatBuoc) ------------------------------- */
    function danhDau(el, sai) {
        el.classList.toggle('is-invalid', sai);
        var s2 = el.nextElementSibling && el.nextElementSibling.classList.contains('select2') ? el.nextElementSibling : null;
        if (s2) s2.classList.toggle('is-invalid', sai);
    }
    function kiemTraBatBuoc() {
        var thieu = [];
        danhDau(f('nganh'), !v('nganh')); if (!v('nganh')) thieu.push('Ngành học');
        danhDau(f('kh'), !v('kh')); if (!v('kh')) thieu.push('Kế hoạch');
        danhDau(f('kieu'), !v('kieu')); if (!v('kieu')) thieu.push('Kiểu học');
        if (thieu.length) { ui.toast('Vui lòng chọn: ' + thieu.join(', ') + '!', 'warn'); return false; }
        return true;
    }

    /* ---------- Hai bảng ---------------------------------------------------- */
    function opts(ds, head, chon) {
        return '<option value="">' + esc(head) + '</option>' + ds.map(function (x) {
            return '<option value="' + esc(e(x.ID)) + '"' + (chon && String(chon) === String(x.ID) ? ' selected' : '') + '>' + esc(e(x.TEN)) + '</option>';
        }).join('');
    }
    function mucPhi(r) { return '<span data-mp="' + esc(e(r.ID)) + '"></span>'; }
    var DAU = [
        { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
        { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
        { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' },
        { title: 'Kết quả', prop: 'DIEM' },
        { title: 'Đánh giá', prop: 'DANHGIA_TEN' }
    ];
    var CUOI = [
        { title: 'Điều kiện rằng buộc', prop: 'THONGTINQUANHEHOCPHAN' },
        { title: 'Khối kiến thức', prop: 'THUOCKHOIKIENTHUC' },
        { title: 'Phân kỳ theo chương trình', prop: 'THOIGIAN' },
        { title: 'Mức phí dự kiến', cls: 'is-right is-nowrap', render: mucPhi }
    ];
    // Cột Quy mô / Hình thức học chỉ hiện khi có danh sách (gốc ẩn cột bằng nth-child)
    function cotChua() {
        var c = DAU.slice();
        if (dtQuyMo.length) c.push({ title: 'Quy mô', render: function (r) { return '<select class="ums-select ums-input--sm" data-qm="' + esc(e(r.ID)) + '">' + opts(dtQuyMo, 'Chọn quy mô') + '</select>'; } });
        if (dtMoHinh.length) c.push({ title: 'Hình thức học', render: function (r) { return '<select class="ums-select ums-input--sm" data-mh="' + esc(e(r.ID)) + '">' + opts(dtMoHinh, 'Chọn hình thức học') + '</select>'; } });
        return c.concat(CUOI);
    }
    function cotDa() {
        var c = DAU.concat([{ title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }, { title: 'Người đăng ký', prop: 'NGUOITAO_TAIKHOAN' }]);
        if (dtQuyMo.length) c.push({ title: 'Quy mô', prop: 'QUYMOLOP_TEN' });
        if (dtMoHinh.length) c.push({ title: 'Hình thức học', prop: 'MOHINHHOC_TEN' });
        return c.concat(CUOI);
    }

    var hl = ums.pat.haiLuoi(root.querySelector('[data-z="luoi"]'), {
        chua: { title: 'Danh sách các nguyện vọng chưa đăng ký', icon: 'fa-list-check', columns: [],
            empty: 'Không có học phần', nut: { text: 'Đăng ký', icon: 'fa-money-check-pen' },
            kiemTra: kiemTraBatBuoc, canChon: 'Vui lòng chọn đối tượng cần lưu?', onDangKy: dangKy },
        da: { title: 'Danh sách các nguyện vọng đã đăng ký', icon: 'fa-clipboard-check', columns: [],
            empty: 'Chưa đăng ký nguyện vọng nào', nut: { text: 'Hủy đăng ký' }, canChon: 'Vui lòng chọn đối tượng cần xóa?', onHuy: huy }
    });
    // Số cột phụ thuộc danh sách quy mô / hình thức học → tính lại mỗi lần vẽ
    function veBang(k, rows) {
        hl.ve(k, rows, k === 'chua' ? cotChua() : cotDa());
        napMucPhi(hl.bang(k), rows);
    }
    function nhacBang() {
        dtChuaDangKy = []; dtDaDangKy = [];
        hl.nhac('chua', 'Chọn kế hoạch và kiểu học rồi bấm "Xem học phần"');
        hl.nhac('da', 'Chọn kế hoạch và kiểu học rồi bấm "Xem học phần"');
    }

    /* Mức phí dự kiến — mỗi dòng một lời gọi, như gốc */
    function napMucPhi(host, rows) {
        var baoLoi = false;
        rows.forEach(function (r) {
            ums.api.call({ action: 'TC_TinhTien_MH/DSA4BRIRKSgVKSQuCS4iESkgLwPP', func: 'pkg_taichinh_tinhtien.LayDSPhiTheoHocPhan', silent: true,
                strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strDangKy_KeHoachDangKy_Id: v('kh') || undefined, strQLSV_NguoiHoc_Id: SV,
                strDaoTao_ThoiGianDaoTao_Id: r.DAOTAO_THOIGIANDAOTAO_ID, strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID,
                strDangKy_SV_LopHocPhan_Id: r.ID, strKieuHoc_Id: v('kieu') || undefined })
                .then(function (kq) {
                    var d = arr(kq.data)[0];
                    var o = host.querySelector('[data-mp="' + (window.CSS && CSS.escape ? CSS.escape(String(e(r.ID))) : e(r.ID)) + '"]');
                    if (d && o) o.textContent = ui.money((Number(e(d.PHIPHAIDONG)) || 0) - (Number(e(d.PHIDUOCMIEN)) || 0));
                })
                .catch(function (err) { if (!baoLoi) { baoLoi = true; ums.api.handle(err, 'mức phí dự kiến'); } });
        });
    }

    function goiDS(fn) {
        return ums.api.call({ action: NV + (fn === 'Chua' ? 'DSA4BRIJLiIRKSAvAik0IAUgLyYKOAPP' : 'DSA4BRIJLiIRKSAvBSAFIC8mCjgP'),
            func: 'pkg_dangky_nguyenvong.LayDSHocPhan' + fn + 'DangKy',
            strKeHoachNguyenVong_Id: v('kh'), strKieuHoc_Id: v('kieu'), strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strQLSV_NguoiHoc_Id: SV });
    }
    var sanSang = Promise.resolve();   // danh sách quy mô / hình thức học đã về
    function taiChua() {
        hl.dang('chua');
        return Promise.all([goiDS('Chua'), sanSang]).then(function (x) { dtChuaDangKy = arr(x[0].data); veBang('chua', dtChuaDangKy); })
            .catch(function (err) { hl.loi('chua', err.message); ums.api.handle(err, 'nguyện vọng chưa đăng ký'); });
    }
    function taiDa() {
        hl.dang('da');
        return Promise.all([goiDS('Da'), sanSang]).then(function (x) { dtDaDangKy = arr(x[0].data); veBang('da', dtDaDangKy); })
            .catch(function (err) { hl.loi('da', err.message); ums.api.handle(err, 'nguyện vọng đã đăng ký'); });
    }

    function dangKy(ds) {
        var bang = hl.bang('chua');
        function oChon(attr, id) { var s = bang.querySelector('select[' + attr + '="' + (window.CSS && CSS.escape ? CSS.escape(String(id)) : id) + '"]'); return s ? s.value : ''; }
        ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { ok: 'Đăng ký' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ds.map(function (a) {
                return { action: NV + 'BSAvJgo4DyY0OCQvFy4vJgPP', func: 'pkg_dangky_nguyenvong.DangKyNguyenVong',
                    strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strDangKy_KeHoachDangKy_Id: v('kh'),
                    strDaoTao_HocPhan_Id: a.DAOTAO_HOCPHAN_ID, strDanhGia_Id: a.DANHGIA_ID, strKieuHoc_Id: v('kieu'),
                    strQuyMoLop_Id: oChon('data-qm', a.ID), strMoHinhHoc_Id: oChon('data-mh', a.ID), strDiem: a.DIEM };
            }), { title: 'Đang đăng ký nguyện vọng', okText: 'Thêm mới thành công', show: true }).then(function () { taiChua(); taiDa(); });
        });
    }
    function huy(ds) {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy đăng ký' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ds.map(function (a) {
                return { action: NV + 'CTQ4BSAvJgo4DyY0OCQvFy4vJgPP', func: 'pkg_dangky_nguyenvong.HuyDangKyNguyenVong',
                    strIds: a.ID, strQLSV_NguoiHoc_Id: SV, strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id,
                    strDangKy_KeHoachDangKy_Id: a.DANGKY_KEHOACHLAYNGUYENVONG_ID };
            }), { title: 'Đang hủy đăng ký', okText: 'Xóa dữ liệu thành công', show: true }).then(function () { taiChua(); taiDa(); });
        });
    }

    /* ---------- Kế hoạch → Kiểu học ----------------------------------------- */
    var ch;
    function napQuyMo() {
        sanSang = Promise.all([sanSang.catch(function () {}), ums.api.call({ action: NV + 'DSA4BRIQNDgMLg0uMQUgLyYKOAPP', func: 'pkg_dangky_nguyenvong.LayDSQuyMoLopDangKy',
            strDangKy_NguyenVong_Id: v('kh'), strQLSV_NguoiHoc_Id: SV })
            .then(function (r) { dtQuyMo = arr(r.data); }, function (err) { dtQuyMo = []; ums.api.handle(err, 'quy mô lớp'); })]);
        return sanSang;
    }
    function napKieuHoc() {
        pat.fill(f('kieu'), [], { head: 'Chọn kiểu học' });
        if (ch) ch.sync();
        if (!v('kh')) return;
        ums.api.call({ action: NV + 'DSA4BRIKKCQ0BSAvJgo4FSkkLgokCS4gIikP', func: 'pkg_dangky_nguyenvong.LayDSKieuDangKyTheoKeHoach',
            strKeHoachNguyenVong_Id: v('kh'), strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strQLSV_NguoiHoc_Id: SV })
            .then(function (r) { pat.fill(f('kieu'), arr(r.data), { head: 'Chọn kiểu học' }); ch.sync(); })
            .catch(function (err) { ums.api.handle(err, 'kiểu học'); });
    }
    function chonKeHoach() {
        var a = dtKeHoach.filter(function (x) { return String(x.ID) === String(v('kh')); })[0];
        f('sotc').value = a ? e(a.SOTINCHITOIDA) : '';
        if (!v('kh')) { pat.fill(f('kieu'), [], { head: 'Chọn kiểu học' }); ch.sync(); nhacBang(); return; }
        danhDau(f('kh'), false);
        napKieuHoc();
        napQuyMo();
        taiChua();
    }
    function chonKieuHoc() {
        if (!v('kieu')) { nhacBang(); return; }
        danhDau(f('kieu'), false);
        taiChua(); taiDa();
    }
    function napKeHoach() {
        if (!strChuongTrinh_Id) return Promise.resolve();
        return ums.api.call({ action: NV + 'DSA4BRIKJAkuICIpBSAvJgo4DyY0OCQvFy4vJgPP', func: 'pkg_dangky_nguyenvong.LayDSKeHoachDangKyNguyenVong',
            strDaoTao_ChuongTrinh_Id: strChuongTrinh_Id, strQLSV_NguoiHoc_Id: SV })
            .then(function (r) {
                dtKeHoach = arr(r.data);
                pat.fill(f('kh'), dtKeHoach, { name: 'TENKEHOACH', head: 'Chọn kế hoạch đăng ký nguyện vọng' });
                ch.sync();
                // selectOne: true của gốc — chỉ MỘT kế hoạch thì chọn luôn và chạy như người dùng chọn
                if (dtKeHoach.length === 1) {
                    f('kh').value = dtKeHoach[0].ID;
                    if (window.jQuery) jQuery(f('kh')).trigger('change.select2');
                    ch.sync();
                    chonKeHoach();
                }
            })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    }
    /* Ngành học (kéo gốc 30/9): chọn ngành → xoá Kế hoạch + Kiểu học, nạp lại kế hoạch và hai bảng */
    function chonNganh() {
        strChuongTrinh_Id = v('nganh');
        dtKeHoach = [];
        pat.fill(f('kh'), [], { head: 'Chọn kế hoạch đăng ký nguyện vọng' });
        pat.fill(f('kieu'), [], { head: 'Chọn kiểu học' });
        f('sotc').value = '';
        ch.sync();
        if (!strChuongTrinh_Id) { nhacBang(); return; }
        danhDau(f('nganh'), false);
        napKeHoach();
        taiChua(); taiDa();
    }
    if (window.jQuery) {
        jQuery(f('nganh')).on('select2:select select2:clear', chonNganh);
        jQuery(f('kh')).on('select2:select select2:clear', chonKeHoach);
        jQuery(f('kieu')).on('select2:select select2:clear', chonKieuHoc);
    }
    ch = pat.chain([f('nganh'), f('kh'), f('kieu')], { phatLai: false });

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="xem"]')) {
            if (!kiemTraBatBuoc()) return;
            taiChua(); taiDa();
        }
    });

    /* ---------- Mở màn ------------------------------------------------------- */
    nhacBang();
    sanSang = Promise.all([
        ums.api.dm('DANGKY.NGUYENVONG.MOHINH').then(function (d) { dtMoHinh = arr(d); }, function () { dtMoHinh = []; }),
        napQuyMo()
    ]);
    ums.api.call({ action: 'DKH_Chung_MH/DSA4BRICKTQuLyYVMygvKQPP', func: 'pkg_dangkyhoc_chung.LayDSChuongTrinh', strQLSV_NguoiHoc_Id: SV })
        .then(function (r) {
            dtChuongTrinh = arr(r.data);
            var a = dtChuongTrinh[0];
            if (!a) return;
            f('hoten').textContent = (e(a.QLSV_NGUOIHOC_HODEM) + ' ' + e(a.QLSV_NGUOIHOC_TEN)).trim();
            f('ma').textContent = e(a.QLSV_NGUOIHOC_MASO);
            pat.fill(f('nganh'), dtChuongTrinh, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_TOCHUCCHUONGTRINH_TEN', head: 'Chọn ngành học' });
            strChuongTrinh_Id = e(a.DAOTAO_TOCHUCCHUONGTRINH_ID);
            f('nganh').value = strChuongTrinh_Id;
            if (window.jQuery) jQuery(f('nganh')).trigger('change.select2');
            ch.sync();
            // viewForm_SinhVien của gốc: nạp kế hoạch + hai bảng (kế hoạch / kiểu học còn trống)
            napKeHoach();
            taiChua(); taiDa();
        })
        .catch(function (err) { ums.api.handle(err, 'thông tin người học'); });
})();
