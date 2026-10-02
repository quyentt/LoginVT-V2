/* =========================================================================
   hoatdong/DaQHHT — "Hồ sơ sinh viên" (#modal_HoSoSinhVien) — ums.qhht.moHoSo(dòng, host)
   host = gốc màn → MÀN CON mở TRONG TRANG, thay chỗ danh sách (ums.pat.formTrang, BO-CUC luật 1);
   không truyền host thì bật hộp thoại như trước (giữ tương thích).
   ---------------------------------------------------------------------------
   Bố cục bản gốc (từ trên xuống): 1. Thông tin sinh viên + Tổng quan QHHT ·
   2. Danh sách QHHT | Chi tiết QHHT · 3. Bảng điểm & học tập chi tiết ·
   4. Chỉnh sửa thông tin hồ sơ (cơ bản · hồ sơ - chính sách · các quá trình).
   Lời gọi (chép nguyên, mã hoá):
       SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayHoSoNguoiHoc_TongQuan   strCorePerson_Id, strCorePersonStudy_Id ''
           → ParamTongQHHT/…, rsThongTinCoBan, rsDanhSachQHHT, rsChiTietQHHT
       SV_HoSoHocVien_MH · pkg_hosohocvien.LayDanhSachHoSoNhieuNganh      tìm QLSV_NGUOIHOC_ID theo mã (bảng điểm)
       Bảng điểm: ums.diemHoc (assets/js/diemhoc.js)
       Sửa: _qhht_chung.js (cơ bản — UpdateCorePerson; hồ sơ - chính sách), _qhht_quatrinh.js
   Khác bản gốc (lỗi rõ):
     · Người học không có person id: tổng quan / QHHT / bảng điểm vẫn của người
       mở trước; cảnh báo bảng điểm dồn mỗi lần mở → mỗi lần mở dựng khung mới.
     · Tab "Thông tin hồ sơ - chính sách" ở mục 4c vẽ LẠI cùng các id với mục 4b →
       lưu đọc nhầm ô → ở đây hai biểu mẫu độc lập.
     · Dòng danh sách bị ghi đè bởi rsThongTinCoBan → ở đây làm việc trên bản sao.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var qhht = ums.qhht = ums.qhht || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function esc(s) { return ui.esc(s); }
    var e = qhht.e, lay = qhht.lay, arr = qhht.arr;
    function badgeChinh(r) { return Number(r.IS_PRIMARY) === 1 ? '<span class="ums-badge ums-badge--ok">Chính</span>' : '<span class="ums-badge ums-badge--info">Phụ</span>'; }

    qhht.moHoSo = function (row, host) {
        var sv = Object.assign({}, row);
        var dlg = (host ? pat.formTrang : ui.dialog)({ host: host, cols: 1, title: 'Hồ sơ sinh viên', icon: 'fa-id-card', size: 'xl', body:
            '<section class="qhht-khoi"><div class="qhht-khoi__tieude">Thông tin sinh viên</div><div class="qhht-sv">' +
                '<div class="qhht-sv__anh" data-h="anh"></div><div class="qhht-sv__tt" data-h="tt"></div>' +
                '<div class="qhht-sv__tq"><div><b data-h="tong">0</b><span>Tổng QHHT</span></div><div><b data-h="dang">0</b><span>Đang học</span></div>' +
                    '<div><b data-h="xong">0</b><span>Hoàn thành</span></div></div></div></section>' +
            '<section class="qhht-khoi qhht-hai"><div><div class="qhht-khoi__tieude">Danh sách QHHT / Chương trình đang theo học</div><div data-h="dsqh"></div></div>' +
                '<div><div class="qhht-khoi__tieude">Thông tin chi tiết QHHT: <span data-h="maqh"></span></div><div data-h="ctqh"></div></div></section>' +
            '<section class="qhht-khoi"><div class="qhht-khoi__tieude">Bảng điểm &amp; học tập chi tiết</div><div data-h="diem"></div></section>' +
            '<section class="qhht-khoi"><div class="qhht-khoi__tieude">Chỉnh sửa thông tin hồ sơ</div>' +
                '<div class="ums-legend">Thông tin cơ bản</div><div data-h="coban"></div>' +
                '<div class="ums-legend ums-legend--cach">Thông tin hồ sơ - chính sách</div><div data-h="hscs"></div>' +
                '<div class="ums-legend ums-legend--cach">Khai thông tin các quá trình</div><div data-h="qt"></div></section>' });
        var B = dlg.body;
        function h(k) { return B.querySelector('[data-h="' + k + '"]'); }

        function veDau() {
            var anh = lay(sv, ['ANHTHE', 'AVATAR_URL', 'PORTRAIT_URL']);
            h('anh').innerHTML = String(anh).length > 5 ? '<img alt="" src="' + esc(ums.files && ums.files.url ? ums.files.url(anh) : anh) + '">' : '<i class="fa-light fa-user-graduate"></i>';
            h('tt').innerHTML = [['Họ tên', lay(sv, ['FULL_NAME', 'SINHVIEN_TENDAYDU', 'HO_TEN'])], ['Lớp', lay(sv, ['LOPQUANLY_TEN', 'LOPQUANLY_MA'])],
                ['Ngày sinh', lay(sv, ['NGAYSINH_DD_MM_YYYY', 'DATE_OF_BIRTH', 'NGAY_SINH'])], ['Khoa', e(sv.KHOAQUANLY_TEN)],
                ['CCCD', lay(sv, ['DINHDANH_CHINH_SO', 'CCCD', 'IDENTIFIER_NO'])], ['Email', e(sv.EMAIL)]]
                .map(function (x) { return '<div><span>' + esc(x[0]) + ':</span> <b>' + (x[1] ? esc(x[1]) : '—') + '</b></div>'; }).join('');
        }
        veDau();
        var person = qhht.personId(sv);

        /* ---------- Tổng quan + QHHT ---------------------------------------- */
        var dsQH = [], ctQH = [];
        function veQH(chon) {
            if (!dsQH.length) { h('dsqh').innerHTML = ui.empty('Chưa có QHHT', 'fa-folder-open'); h('ctqh').innerHTML = ''; return; }
            h('dsqh').innerHTML = '<div class="qhht-the">' + dsQH.map(function (q) {
                var id = lay(q, ['STUDY_ID', 'ID']);
                return '<label class="qhht-the__o' + (String(id) === String(chon) ? ' is-on' : '') + '"><input type="radio" name="rdQHHT" value="' + esc(id) + '"' + (String(id) === String(chon) ? ' checked' : '') + '>' +
                    '<div><b>' + esc(lay(q, ['QHHT_MA', 'MA', 'MA_QHHT', 'STUDY_CODE'])) + (Number(q.IS_PRIMARY) === 1 ? ' <i class="fa-solid fa-star" style="color:#f0ad4e"></i>' : '') + '</b>' +
                    '<span class="ums-badge ums-badge--plain">' + esc(lay(q, ['DONVI_QUANLY_TEN', 'KHOAQUANLY_TEN'])) + '</span></div>' +
                    '<small>Ngành: ' + esc(lay(q, ['NGANH_TEN', 'TENCHUONGTRINH'])) + ' · Hệ: ' + esc(lay(q, ['HEDAOTAO_TEN', 'TENHEDAOTAO'])) + ' · Khóa: ' + esc(lay(q, ['KHOA', 'TENKHOA', 'NAMNHAPHOC'])) +
                    ' · Lớp: ' + esc(lay(q, ['LOP_TEN', 'LOPQUANLY_TEN'])) + '</small>' +
                    '<span class="ums-badge ums-badge--info">' + esc(lay(q, ['TRANGTHAI_TEN', 'STUDY_STATUS_TEN'])) + '</span></label>';
            }).join('') + '</div>';
            chiTiet(chon);
        }
        function chiTiet(id) {
            var c = ctQH.filter(function (x) { return String(lay(x, ['STUDY_ID', 'ID'])) === String(id); })[0];
            if (!c) { h('maqh').textContent = ''; h('ctqh').innerHTML = ui.empty('Không tìm thấy chi tiết QHHT cho study_id = ' + id, 'fa-circle-info'); return; }
            h('maqh').textContent = lay(c, ['QHHT_MA', 'STUDY_CODE', 'MA_QHHT', 'MA']);
            var tt = lay(c, ['TRANGTHAI_TEN', 'STUDY_STATUS_TEN']);
            h('ctqh').innerHTML = '<dl class="qhht-ct">' + [
                ['Loại QHHT', lay(c, ['LOAIQHHT_TEN', 'STUDY_RELATION_TYPE_TEN', 'STUDY_KIND_TEN'])], ['Ngày bắt đầu', lay(c, ['NGAYBATDAU_DD_MM_YYYY', 'NGAY_BAT_DAU', 'START_DATE'])],
                ['Ngành / Chương trình', lay(c, ['NGANH_TEN', 'TENCHUONGTRINH', 'TENNGANH'])], ['Dự kiến tốt nghiệp', lay(c, ['NGAYDUKIEN_TN', 'EXPECTED_GRADUATION_DATE', 'NGAYKETTHUC'])],
                ['Khóa', lay(c, ['KHOA', 'TENKHOA', 'KHOA_DAOTAO'])], ['GPA hiện tại', lay(c, ['GPA', 'GPA_HIENTAI', 'CURRENT_GPA'])],
                ['Hệ đào tạo', lay(c, ['HEDAOTAO_TEN', 'TENHEDAOTAO'])], ['Số tín chỉ tích lũy', lay(c, ['SOTINCHI_TICHLUY', 'TIN_CHI_TICHLUY', 'TOTAL_CREDIT'])],
                ['Lớp hiện tại', lay(c, ['LOP_TEN', 'LOPQUANLY_TEN', 'CLASS_NAME'])]
            ].map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + (x[1] !== '' ? esc(x[1]) : '—') + '</dd>'; }).join('') +
                '<dt>Trạng thái</dt><dd>' + (tt ? '<span class="ums-badge ums-badge--info">' + esc(tt) + '</span>' : '—') + '</dd>' +
                '<dt>Cố vấn học tập</dt><dd>' + esc(lay(c, ['COVAN_TENDAYDU', 'COVAN_TEN', 'ADVISOR_NAME']) || '—') + '</dd>' +
                '<dt>Ngành chính/phụ</dt><dd>' + badgeChinh(c) + '</dd></dl>';
        }
        B.addEventListener('change', function (ev) {
            if (ev.target.name === 'rdQHHT') {
                Array.prototype.forEach.call(B.querySelectorAll('.qhht-the__o'), function (l) { l.classList.toggle('is-on', l.contains(ev.target)); });
                chiTiet(ev.target.value);
            }
        });
        if (person) {
            h('dsqh').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call(Object.assign({ action: 'SV_NGUOIHOC_01_MH/DSA4CS4SLg8mNC4oCS4iHhUuLyYQNCAv', func: 'PKG_CORE_NGUOIHOC_01.LayHoSoNguoiHoc_TongQuan',
                strCorePerson_Id: person, strCorePersonStudy_Id: '' }, qhht.chung())).then(function (r) {
                var d = r.data || {};
                h('tong').textContent = lay(d, ['ParamTongQHHT', 'TongQHHT', 'TONGQHHT']) || 0;
                h('dang').textContent = lay(d, ['ParamSoDangHoc', 'SoDangHoc', 'SODANGHOC']) || 0;
                h('xong').textContent = lay(d, ['ParamSoHoanThanh', 'SoHoanThanh', 'SOHOANTHANH']) || 0;
                var cb = arr(d.rsThongTinCoBan)[0];
                if (cb) { Object.assign(sv, cb); veDau(); suaCoBan(); }
                dsQH = arr(d.rsDanhSachQHHT); ctQH = arr(d.rsChiTietQHHT);
                veQH(dsQH.length ? lay(dsQH[0], ['STUDY_ID', 'ID']) : '');
            }).catch(function (err) { h('dsqh').innerHTML = ui.fail(err.message); });
        } else veQH('');

        /* ---------- Bảng điểm ------------------------------------------------ */
        var maNH = lay(sv, ['MA_NGUOIHOC_CHINH', 'MA_NGUOIHOC_PHU']);
        if (!ums.diemHoc) h('diem').innerHTML = ui.fail('Chưa tải được khung bảng điểm (ums.diemHoc).');
        else if (!maNH) h('diem').innerHTML = ui.empty('Không có Mã NH để tìm người học (QLSV_NGUOIHOC_ID)', 'fa-circle-info');
        else {
            h('diem').innerHTML = ui.empty('Đang tìm hồ sơ học tập…', 'fa-spinner fa-spin');
            ums.api.call({ action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP', func: 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh', silent: true,
                strTuKhoa: maNH, strNamNhapHoc: '', strKhoaQuanLy_Id: '', strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: '',
                strTrangThaiNguoiHoc_Id: '', strChucNang_Id: cn(), strNguoiTao_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 5 }).then(function (r) {
                var ds = arr(r.data), x = ds.filter(function (y) { return String(e(y.QLSV_NGUOIHOC_MASO)).trim() === maNH; })[0] || ds[0];
                var id = x ? lay(x, ['QLSV_NGUOIHOC_ID', 'ID']) : '';
                if (!id) { h('diem').innerHTML = ui.empty('Không tìm thấy QLSV_NGUOIHOC_ID cho mã ' + maNH + ' — sinh viên này có thể chưa có dữ liệu trong schema cũ', 'fa-circle-info'); return; }
                // diemQuaTrinh: false — bản gốc của màn này (DaQHHT) không có hộp "Điểm quá trình",
                // chỉ Cổng sinh viên mới có; giữ nút khoá đúng như gốc.
                ums.diemHoc.mount(h('diem'), { nguoiHocId: id, diemQuaTrinh: false });
            }).catch(function (err) { h('diem').innerHTML = ui.fail(err.message); });
        }

        /* ---------- Chỉnh sửa ------------------------------------------------ */
        var dm = null;
        function suaCoBan() { if (dm) qhht.coBan(h('coban'), sv, { dm: dm, them: false, xacNhan: true }); }
        qhht.dm().then(function (d) {
            dm = d;
            suaCoBan();
            qhht.hscs(h('hscs'), sv, { dm: dm, xacNhan: true });
            qhht.napHSCS(sv, '').then(function () { qhht.hscs(h('hscs'), sv, { dm: dm, xacNhan: true }); });
            qhht.quaTrinh(h('qt'), { personId: person, sv: { ten: lay(sv, ['FULL_NAME', 'HO_TEN', 'SINHVIEN_TENDAYDU']), ma: lay(sv, ['MA_NGUOIHOC_CHINH', 'MA_NGUOI_HOC']) },
                tabCuoi: { key: 'hscs', text: 'Thông tin hồ sơ - chính sách', ve: function (p) { qhht.hscs(p, sv, { dm: dm, xacNhan: true, sauLuu: function () { qhht.hscs(h('hscs'), sv, { dm: dm, xacNhan: true }); } }); } } });
        });
        return dlg;
    };
})();
