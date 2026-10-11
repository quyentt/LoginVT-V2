/* =========================================================================
   Hợp đồng ký túc xá — khung chung cho hai màn "Chưa có hợp đồng / Tạo và in hợp đồng"
   (chuacohopdong) và "Đã có hợp đồng" (dacohopdong)
   Bản gốc: ApisKyTucXa/Modules/hopdong/html/chuacohopdong.html + script/chuacohopdong.js (1.132 dòng)
            ApisKyTucXa/Modules/hopdong/html/dacohopdong.html  + script/dacohopdong.js  (1.163 dòng)
   Hai tệp gốc chép chung ~85% (cùng lưới chính sách / miễn giảm, cùng danh sách người ở, cùng in)
   → một khung: ums.ktxHopDong.mount(root, { daCo: false | true, title })
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái = bộ lọc (Tình trạng [chỉ đã có HĐ] · Tòa nhà → Phòng · Ngày kiểm tra · từ khoá)
   + "Danh sách chưa / đã có hợp đồng" (ảnh, họ tên, mã số, Phòng: tòa - phòng; phân trang máy chủ 10 dòng);
   phải = khung "Tạo hợp đồng" (ẩn tới khi chọn một người): 1) Thông tin hợp đồng · 2) Thông tin người
   đăng ký · 3) Chính sách ưu đãi (lưới dòng) · 4) Nội dung miễn giảm (lưới dòng); nút Lưu / In / Hủy.

   Lời gọi (kiểu cũ, không mã hoá, tham số chép nguyên):
       KTX_DaXepPhong/LayDanhSach   GET  strTuKhoa, strKTX_DangKy_Id '', strKTX_Phong_Id, strNgayKiemTra, strKTX_ToaNha_Id '',
                                         strKTX_DoiTuongOKyTucXa_Id '', strKTX_HopDong_Id '', dDaLapHopDong 0 | 1,
                                         strTinhTrangHopDong_Id ('' | ô Tình trạng), pageIndex, pageSize
       KTX_ToaNha/LayDanhSach · KTX_Phong/LayDanhSach (strKTX_ToaNha_Id)   ô chọn Tòa nhà → Phòng (lọc + biểu mẫu)
            = ums.ktx.noiToaNhaPhong (cosovatchat/script/_ktx.js, nạp chéo TRƯỚC tệp này; 12/10 gộp ba bản về một —
              bản riêng K.goiToaNha / K.goiPhong / K.toaNhaPhong đã bỏ; mục phòng hiện TEN như gốc: tenPhong 'TEN')
       KTX_HopDong/ThemMoi (chưa có) | CapNhat (đã có, thêm strKTX_ToaNha_Id)   POST
            strId, strSoHopDong, strNgayKyHopDong, strNgayKetThucHopDong, strTinhTrang_Id (= ID mục MA '1' của KTX.TTHD),
            strKTX_Phong_Id, strKTX_DoiTuongOKyTucXa_Id, strNgayVao, strNgayRa, dSoThang, dTongTienThue, dGiaThue_Thang,
            dSoChoThue, dBaoPhong
       KTX_HopDong/LayChiTiet  GET strId · KTX_HopDong/Xoa  POST strIds (Hủy hợp đồng — chỉ màn đã có)
       KTX_HopDong_ChinhSach  LayDanhSach / ThemMoi / CapNhat / Xoa   dSoDienNuocDuocMien (cột SODIENNUOCDUOCMIEN)
       KTX_HopDong_MienGiam   LayDanhSach / ThemMoi / CapNhat / Xoa   dPhanTramMienGiam  (cột PHANTRAMMIENGIAM)
            mỗi dòng lưới một lời gọi, lưu SAU khi có id hợp đồng (như gốc); dòng có id → CapNhat
       TC_KhoanThu/LayDanhSach  GET strNhomCacKhoanThu_Id 'KTX'  (ô Khoản thu trong lưới)
       In: ums.report.run('HopDongSinhVien' | 'HopDongLuuHocSinh', { strHopDong_Id, strSoTienBangChu })
   Danh mục: KTX.TTHD (tình trạng hợp đồng), KTX.DVT0 (đơn vị tính — constant CATOR.KTX.DVT0)
   Bắt buộc (arrValid_DapAn gốc): Số hợp đồng.

   Giữ như gốc:
     · Chưa có HĐ: lưu xong thì giấu nút Lưu, hiện hai nút In (gốc swithInHopDong); người vừa lưu rời khỏi
       danh sách "chưa có hợp đồng" sau khi tải lại, biểu mẫu vẫn mở để in.
     · Đã có HĐ: lưu = CapNhat rồi lưu lại hai lưới; Hủy hợp đồng hỏi "Bạn có chắc chắn hủy hợp đồng không?".
     · Số tiền bằng chữ cho bản in: ums.ui.docSo (n2vi của gốc; gốc chưa có HĐ không thêm dấu chấm cuối — bỏ qua).
     · Bộ lọc Tòa nhà chỉ để thu hẹp ô Phòng, KHÔNG gửi lên (gốc gửi strKTX_ToaNha_Id rỗng).
   Khác gốc (lỗi rõ ràng, làm theo ý định — ghi lại):
     · Đã có HĐ / CapNhat: gốc đọc ô dropHopDong_Phong KHÔNG có trên màn và biến strDoiTuong_ToaNhaDK_id không bao giờ
       được gán → gửi phòng / tòa nhà RỖNG. Bản mới gửi KTX_PHONG_ID / KTX_TOANHA_ID của hợp đồng (LayChiTiet). KIỂM TRÊN HOST.
     · Lưới chính sách / miễn giảm: gốc lưu cả dòng trống → bản mới bỏ dòng chưa chọn khoản thu và chưa nhập hệ số.
     · Khung bên phải có nút Đóng (gốc không có lối đóng).
   Cố ý bỏ:
     · Nút "In hợp đồng" (btnDangKy_Print) không có xử lý; nút "Tính tiền" bị chú thích trong HTML và handler
       gọi $("#…".val()) lỗi → KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi không bao giờ chạy được, không chuyển.
     · genDeTail_MienGiam, các ô txtMG_* / txtCS_* / dropCS_* / dropMG_* (mã chết của bản cũ hơn).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function hoTen(r) { return (e(r.KTX_DOITUONGOKYTUCXA_HODEM) + ' ' + e(r.KTX_DOITUONGOKYTUCXA_TEN)).trim(); }

    var K = ums.ktxHopDong = ums.ktxHopDong || {};

    /* ---------- Lời gọi dùng chung (tham số chép nguyên gốc) ---------- */
    K.goiKhoanThu = function () {
        return { action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', strNhomCacKhoanThu_Id: 'KTX', strcanboquanly_id: '',
            pageIndex: 1, pageSize: 100000, silent: true };
    };

    /* Lưới dòng chính sách / miễn giảm trong biểu mẫu hợp đồng (pat.rows) */
    function luoi(host, o) {
        var C = o.ctrl;
        return pat.rows(host, {
            title: o.title, icon: o.icon,
            columns: [
                { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', title: 'Khoản thu', type: 'select', s2: true,
                  placeholder: 'Chọn khoản thu', source: { call: K.goiKhoanThu() } },
                { key: o.heSoKey, col: o.heSoCol, title: 'Hệ số', width: '160px' },
                { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', title: 'Đơn vị', type: 'select', placeholder: 'Chọn đơn vị',
                  source: { dm: 'KTX.DVT0' }, width: '220px' }
            ],
            list: function (hopDongId) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strDonViTinh_Id: '', strTaiChinh_CacKhoanThu_Id: '',
                    strKTX_DoiTuongOKyTucXa_Id: o.doiTuongId(), strKTX_HopDong_Id: hopDongId, pageIndex: 1, pageSize: 100000 };
            },
            filled: function (v) { return !!(v.strTaiChinh_CacKhoanThu_Id || v[o.heSoKey]); },
            save: function (v, rec, hopDongId) {
                var c = { action: C + (rec ? '/CapNhat' : '/ThemMoi'), method: 'POST', strId: rec ? rec.ID : '', strKTX_HopDong_Id: hopDongId,
                    strNgayBatDauApDung: '', strNgayKetThucApDung: '', strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id,
                    strDonViTinh_Id: v.strDonViTinh_Id, strKTX_DoiTuongOKyTucXa_Id: o.doiTuongId(), strNguoiThucHien_Id: uid() };
                c[o.heSoKey] = v[o.heSoKey];
                return c;
            },
            remove: function (rec) { return { action: C + '/Xoa', method: 'POST', strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
        });
    }

    K.mount = function (root, o) {
        o = o || {};
        var daCo = !!o.daCo;
        var st = { page: 1, size: 10, total: 0, rows: [], chon: '', hopDongId: '', doiTuongId: '', phongId: '', toaNhaId: '', ttHopDongId: '' };

        function selLoc(k, ph) {
            return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select></div>';
        }
        var m = pat.master({
            el: root,
            title: o.title || (daCo ? 'Đã có hợp đồng' : 'Tạo và in hợp đồng'),
            side: {
                title: daCo ? 'Danh sách đã có hợp đồng' : 'Danh sách chưa có hợp đồng', icon: 'fa-hard-drive',
                search: 'Nhập từ khóa tìm kiếm',
                filter: (daCo ? selLoc('tt', 'Chọn tình trạng') : '') + selLoc('toanha', 'Chọn tòa nhà') + selLoc('phong', 'Chọn phòng') +
                    '<div class="ums-field"><input class="ums-input" data-f="ngay" data-date placeholder="Ngày kiểm tra" autocomplete="off"></div>'
            },
            main: { title: false }
        });
        ui.enhance(root);
        var F = {};
        ['tt', 'toanha', 'phong', 'ngay'].forEach(function (k) { F[k] = root.querySelector('[data-f="' + k + '"]'); });
        ums.ktx.noiToaNhaPhong(F.toanha, F.phong, { tenPhong: 'TEN', onToaNha: function () { tai(1); } });
        if (daCo) ums.api.dm('KTX.TTHD').then(function (rows) { pat.fill(F.tt, rows, { head: 'Chọn tình trạng' }); }, function () {});
        /* Tình trạng hợp đồng mặc định khi lưu = mục có MA "1" của KTX.TTHD (loadHopDong gốc) */
        ums.api.dm('KTX.TTHD').then(function (rows) {
            var r = rows.filter(function (x) { return String(x.MA) === '1'; })[0];
            st.ttHopDongId = r ? r.ID : '';
        }, function () {});

        /* ---------- Cột trái ---------- */
        function veDs() {
            m.sideCount.textContent = '(' + st.total + ')';
            m.sideBody.innerHTML = st.rows.length ? st.rows.map(function (r) {
                var id = daCo ? e(r.KTX_HOPDONG_ID) : e(r.KTX_DOITUONGOKYTUCXA_ID);
                return '<button type="button" class="ums-master__item' + (id && id === st.chon ? ' is-active' : '') + '" data-id="' + esc(id) + '">' +
                    pat.anhNguoi(r.ANH) +
                    '<span class="ums-master__item__main">' + esc(hoTen(r)) +
                    '<span class="ums-master__item__sub">' + esc(e(r.KTX_DOITUONGOKYTUCXA_MASO)) + '</span>' +
                    '<span class="ums-master__item__sub">Phòng: ' + esc(e(r.KTX_TOANHA_TEN) + ' - ' + e(r.KTX_PHONG_TEN)) + '</span></span></button>';
            }).join('') : ui.empty(daCo ? 'Không có hợp đồng nào' : 'Không có người ở nào chưa có hợp đồng', 'fa-inbox');
            m.setPage({ index: st.page, size: st.size, total: st.total, shown: st.rows.length,
                onChange: function (p) { tai(p); }, onSize: function (s) { st.size = s; tai(1); } });
        }
        var token = 0;
        function tai(p) {
            st.page = p || 1;
            var t = ++token;
            m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({
                action: 'KTX_DaXepPhong/LayDanhSach', method: 'GET',
                strTuKhoa: (m.search.value || '').trim(), strKTX_DangKy_Id: '', strKTX_Phong_Id: F.phong.value || '',
                strNgayKiemTra: (F.ngay.value || '').trim(), strKTX_ToaNha_Id: '', strKTX_DoiTuongOKyTucXa_Id: '', strKTX_HopDong_Id: '',
                dDaLapHopDong: daCo ? 1 : 0, strTinhTrangHopDong_Id: daCo ? (F.tt.value || '') : '',
                pageIndex: st.page, pageSize: st.size
            }).then(function (r) {
                if (t !== token) return;
                st.rows = arr(r.data); st.total = Number(r.pager) || st.rows.length; veDs();
            }).catch(function (err) {
                if (t !== token) return;
                st.rows = []; st.total = 0;
                m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, daCo ? 'danh sách đã có hợp đồng' : 'danh sách chưa có hợp đồng');
            });
        }

        /* ---------- Khung bên phải ---------- */
        var main = m.mainBody;
        function nhac() {
            st.chon = ''; st.hopDongId = ''; st.doiTuongId = '';
            main.innerHTML = pat.panel({ title: 'Tạo hợp đồng', icon: 'fa-pen-to-square',
                body: ui.empty(daCo ? 'Chọn một người ở cột trái để xem và sửa hợp đồng' : 'Chọn một người ở cột trái để tạo hợp đồng', 'fa-file-contract') });
        }
        function fld(label, ctl, x) {
            x = x || {};
            return '<div' + (x.span ? ' style="grid-column:span 2"' : '') + '>' + ui.field(label, ctl, { required: x.req }) + '</div>';
        }
        function inp(k, x) {
            x = x || {};
            return '<input class="ums-input" data-k="' + k + '" autocomplete="off"' + (x.money ? ' data-money inputmode="numeric"' : '') +
                (x.value !== undefined ? ' value="' + esc(x.value) + '"' : '') + '>';
        }
        function ngay(k) {
            return '<div class="ums-inputwrap"><input class="ums-input" data-k="' + k + '" data-date placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>';
        }
        function sel(k, ph, opts) {
            return '<select class="ums-select" data-k="' + k + '" data-ph="' + esc(ph) + '">' + (opts || '<option value="">' + esc(ph) + '</option>') + '</select>';
        }
        function kv(label, k) { return '<div class="ums-kv"><span>' + esc(label) + '</span><b data-k="' + k + '"></b></div>'; }

        var cs = null, mg = null, formTN = null;
        function dungForm() {
            var tools = ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                (daCo ? ui.btn('del', { text: 'Hủy hợp đồng', attr: { 'data-a': 'huy' } }) : '') +
                ui.btn('print', { text: '1. In hợp đồng sinh viên', attr: { 'data-a': 'in', 'data-code': 'HopDongSinhVien', 'data-z': 'in' } }) +
                ui.btn('print', { text: '2. In hợp đồng lưu học sinh', attr: { 'data-a': 'in', 'data-code': 'HopDongLuuHocSinh', 'data-z': 'in' } }) +
                ui.btn('save', { text: daCo ? 'Lưu' : 'Lưu hợp đồng', attr: { 'data-a': 'luu', 'data-z': 'luu' } });
            var body =
                '<div class="ums-legend">1) Thông tin hợp đồng</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    fld('Số hợp đồng', inp('strSoHopDong'), { req: true }) + '<div></div>' +
                    fld('Ngày ký', ngay('strNgayKyHopDong')) + fld('Ngày kết thúc', ngay('strNgayKetThucHopDong')) +
                    fld('Số chỗ thuê', inp('dSoChoThue', { value: '1' })) +
                    fld('Bao phòng', sel('dBaoPhong', 'Bao phòng', '<option value="0">Không</option><option value="1">Có</option>')) +
                    fld('Số tháng', inp('dSoThang')) + fld(daCo ? 'Số tiền/tháng' : 'Số tiền/tháng/chỗ', inp('dGiaThue_Thang', { money: true })) +
                    fld('Tổng tiền thuê', inp('dTongTienThue', { money: true })) +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">2) Thông tin người đăng ký</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    '<div style="grid-column:span 2">' + kv('Người đăng ký', 'nguoi') + '</div>' +
                    (daCo
                        ? '<div>' + kv('Tòa nhà', 'toaNhaTen') + '</div><div>' + kv('Phòng đăng ký', 'phongTen') + '</div>'
                        : fld('Tòa nhà', sel('strKTX_ToaNha_Id', 'Chọn tòa nhà')) + fld('Phòng đăng ký', sel('strKTX_Phong_Id', 'Chọn phòng'))) +
                    fld('Ngày vào', ngay('strNgayVao')) + fld('Ngày ra', ngay('strNgayRa')) +
                '</div>' +
                '<div class="ums-u-mt-4" data-z="cs"></div>' +
                '<div class="ums-u-mt-4" data-z="mg"></div>';
            main.innerHTML = pat.panel({ title: 'Tạo hợp đồng', icon: 'fa-pen-to-square', tools: tools, body: body, zone: 'hd' });
            ui.enhance(main);
            cs = luoi(main.querySelector('[data-z="cs"]'), { ctrl: 'KTX_HopDong_ChinhSach', title: '3) Chính sách ưu đãi', icon: 'fa-gift',
                heSoKey: 'dSoDienNuocDuocMien', heSoCol: 'SODIENNUOCDUOCMIEN', doiTuongId: function () { return st.doiTuongId; } });
            mg = luoi(main.querySelector('[data-z="mg"]'), { ctrl: 'KTX_HopDong_MienGiam', title: '4) Nội dung miễn giảm', icon: 'fa-percent',
                heSoKey: 'dPhanTramMienGiam', heSoCol: 'PHANTRAMMIENGIAM', doiTuongId: function () { return st.doiTuongId; } });
            if (!daCo) formTN = ums.ktx.noiToaNhaPhong(q('strKTX_ToaNha_Id'), q('strKTX_Phong_Id'), { tenPhong: 'TEN' });
        }
        function q(k) { return main.querySelector('[data-k="' + k + '"]'); }
        function val(k) { var el = q(k); return el ? (el.value || '').trim() : ''; }
        function dat(k, v) {
            var el = q(k); if (!el) return;
            if (el.tagName === 'B') { el.textContent = e(v); return; }
            el.value = el.hasAttribute('data-money') ? (e(v) === '' ? '' : ui.money(v)) : e(v);
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        }
        function cheDoIn(daLuu) {
            Array.prototype.forEach.call(main.querySelectorAll('[data-z="in"]'), function (b) { b.hidden = !daLuu; });
            var luu = main.querySelector('[data-z="luu"]'); if (luu) luu.hidden = daLuu;
        }
        function dienNguoi(d) {
            var nguoi = q('nguoi');
            if (nguoi) nguoi.innerHTML = '<span class="ums-u-blue">' + esc(hoTen(d)) + '</span> <i class="ums-u-faint">(' + esc(e(d.KTX_DOITUONGOKYTUCXA_MASO)) + ')</i>';
        }

        /* Chưa có hợp đồng: chọn người → biểu mẫu trống + thông tin đăng ký (viewDetail_DangKyPhong gốc) */
        function moMoi(r) {
            dungForm();
            st.hopDongId = ''; st.doiTuongId = e(r.KTX_DOITUONGOKYTUCXA_ID); st.phongId = e(r.KTX_PHONG_ID); st.toaNhaId = e(r.KTX_TOANHA_ID);
            dienNguoi(r);
            dat('strNgayVao', r.NGAYVAO); dat('strNgayRa', r.NGAYRA);
            formTN.dat(r.KTX_TOANHA_ID, r.KTX_PHONG_ID);
            cs.clear(); mg.clear();
            cheDoIn(false);
        }
        /* Đã có hợp đồng: chọn người → LayChiTiet → đổ biểu mẫu + hai lưới (viewDetail_HopDong gốc) */
        function moCu(hopDongId) {
            dungForm();
            cheDoIn(true);
            var luu = main.querySelector('[data-z="luu"]'); if (luu) luu.hidden = false;
            ums.api.call({ action: 'KTX_HopDong/LayChiTiet', method: 'GET', strId: hopDongId }).then(function (r) {
                var d = arr(r.data)[0];
                if (!d) { ui.toast('Không đọc được hợp đồng', 'warn'); return; }
                st.hopDongId = e(d.ID) || hopDongId; st.doiTuongId = e(d.KTX_DOITUONGOKYTUCXA_ID);
                st.phongId = e(d.KTX_PHONG_ID); st.toaNhaId = e(d.KTX_TOANHA_ID);
                dienNguoi(d);
                dat('toaNhaTen', d.KTX_TOANHA_TEN); dat('phongTen', d.KTX_PHONG_TEN);
                dat('strSoHopDong', d.SOHOPDONG); dat('strNgayKyHopDong', d.NGAYKYHOPDONG); dat('strNgayKetThucHopDong', d.NGAYKETTHUCHOPDONG);
                dat('dTongTienThue', d.TONGTIENTHUE); dat('dBaoPhong', e(d.BAOPHONG) === '' ? '0' : String(d.BAOPHONG));
                dat('dSoThang', d.SOTHANG); dat('dGiaThue_Thang', d.GIATHUE_THANG); dat('dSoChoThue', d.SOCHOTHUE);
                dat('strNgayVao', d.NGAYVAO); dat('strNgayRa', d.NGAYRA);
                cs.load(st.hopDongId); mg.load(st.hopDongId);
            }).catch(function (err) { ums.api.handle(err, 'chi tiết hợp đồng'); });
        }
        function chonMuc(id) {
            st.chon = id; veDs();
            var r = st.rows.filter(function (x) { return (daCo ? e(x.KTX_HOPDONG_ID) : e(x.KTX_DOITUONGOKYTUCXA_ID)) === id; })[0];
            if (!r) return;
            if (daCo) moCu(id); else moMoi(r);
        }

        function goiLuu() {
            var c = { action: 'KTX_HopDong/' + (daCo ? 'CapNhat' : 'ThemMoi'), method: 'POST',
                strId: daCo ? st.hopDongId : '', strSoHopDong: val('strSoHopDong'), strNgayKyHopDong: val('strNgayKyHopDong'),
                strNgayKetThucHopDong: val('strNgayKetThucHopDong'), strTinhTrang_Id: st.ttHopDongId,
                strKTX_Phong_Id: daCo ? st.phongId : val('strKTX_Phong_Id') };
            if (daCo) c.strKTX_ToaNha_Id = st.toaNhaId;
            c.strKTX_DoiTuongOKyTucXa_Id = st.doiTuongId;
            c.strNgayVao = val('strNgayVao'); c.strNgayRa = val('strNgayRa'); c.dSoThang = val('dSoThang');
            c.dTongTienThue = pat.num(val('dTongTienThue')); c.dGiaThue_Thang = pat.num(val('dGiaThue_Thang'));
            c.dSoChoThue = val('dSoChoThue'); c.dBaoPhong = val('dBaoPhong') || '0';
            c.strNguoiThucHien_Id = uid();
            return c;
        }
        function luu() {
            if (!val('strSoHopDong')) { ui.toast('Chưa nhập Số hợp đồng', 'warn'); q('strSoHopDong').focus(); return; }
            ums.api.call(goiLuu()).then(function (r) {
                var id = daCo ? st.hopDongId : e(r.raw && r.raw.Id);
                if (!daCo && !id) { ui.toast('Máy chủ không trả id hợp đồng', 'warn'); return; }
                st.hopDongId = id;
                ui.toast(daCo ? 'Cập nhật thành công!' : 'Đăng ký thành công!', 'ok');
                return cs.save(id).then(function () { return mg.save(id); }).then(function () {
                    cheDoIn(true);
                    if (daCo) { var b = main.querySelector('[data-z="luu"]'); if (b) b.hidden = false; cs.load(id); mg.load(id); }
                    return tai(st.page);
                });
            }).catch(function (err) { ums.api.handle(err, 'lưu hợp đồng'); });
        }
        function huy() {
            if (!st.hopDongId) return;
            ui.confirm('Bạn có chắc chắn hủy hợp đồng không?', { tone: 'bad', ok: 'Hủy hợp đồng' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: 'KTX_HopDong/Xoa', method: 'POST', strIds: st.hopDongId, strNguoiThucHien_Id: uid() })
                    .then(function () { ui.toast('Xóa thành công!', 'ok'); nhac(); return tai(1); });
            }).catch(function (err) { ums.api.handle(err, 'hủy hợp đồng'); });
        }
        function inHopDong(code) {
            if (!st.hopDongId) { ui.toast('Lưu hợp đồng trước khi in', 'warn'); return; }
            var id = st.hopDongId, tien = pat.num(val('dTongTienThue'));
            ums.report.run(code, { collect: function (add) { add('strHopDong_Id', id); add('strSoTienBangChu', ui.docSo(tien)); } });
        }

        /* ---------- Sự kiện ---------- */
        m.sideBody.addEventListener('click', function (ev) {
            var it = ev.target.closest('[data-id]');
            if (it && m.sideBody.contains(it)) chonMuc(it.getAttribute('data-id'));
        });
        main.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !main.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'dong') { nhac(); veDs(); }
            else if (a === 'luu') luu();
            else if (a === 'huy') huy();
            else if (a === 'in') inHopDong(b.getAttribute('data-code'));
        });
        /* Số tiền: ngăn nghìn khi gõ (inputsotien gốc); Ngày ký / Ngày kết thúc rời ô → chép sang Ngày vào / Ngày ra (blur gốc) */
        main.addEventListener('input', function (ev) {
            var el = ev.target;
            if (!el.hasAttribute || !el.hasAttribute('data-money')) return;
            var s = pat.num(el.value).replace(/[^\d]/g, '');
            el.value = s ? ui.money(s) : '';
        });
        main.addEventListener('focusout', function (ev) {
            var el = ev.target, k = el.getAttribute && el.getAttribute('data-k');
            if (k === 'strNgayKyHopDong' && !val('strNgayVao')) dat('strNgayVao', el.value);
            if (k === 'strNgayKetThucHopDong' && !val('strNgayRa')) dat('strNgayRa', el.value);
        });
        m.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        if (window.jQuery) jQuery([F.phong, F.tt].filter(Boolean)).on('select2:select select2:clear', function () { tai(1); });
        F.ngay.addEventListener('change', function () { tai(1); });

        /* Luật cột trái (BO-CUC 12): Tải lại + Bộ lọc nâng cao, gõ là tự tìm; đổi ô chọn đã tự tải ở trên */
        pat.cotTrai(m, { tai: tai, tuTaiLoc: false });
        nhac();
        tai(1);
        return { reload: tai, master: m };
    };
})();
