/* =========================================================================
   tkggPV — tầng chung hai màn "Xác định phạm vi COI THI / CHẤM THI" (ApisTKGG/Modules/kehoach): ums.tkggPV.*
   Bản gốc: ApisTKGG/Modules/kehoach/script/phamvicoithi.js (1.142 dòng) + phamvichamthi.js (1.691 dòng) — hai tệp chép nhau,
   khác ở tên thủ tục / cột của sổ theo dõi. Mỗi màn chỉ khai: lời gọi danh sách + lời gọi người coi/chấm + các nguồn "Thêm mới".
   ---------------------------------------------------------------------------
   PV.man(root, cfg) — màn một cột như gốc:
     · Khung tìm kiếm: ums.tkgg.boLocKeHoach(loai 'ma', muc 3) — Thời gian → KH tổng hợp → KH chi tiết (cha → con) + từ khoá + Tìm kiếm.
     · Khung "Danh sách kế hoạch" (fa-building) + nút Thêm mới (cfg.them[]) + bảng tiêu đề hai tầng:
         Stt | Thông tin dữ liệu (Loại dữ liệu LOAIDULIEU_TEN · Mã DULIEUXACNHAN_MA · Tên DULIEUXACNHAN_TEN · Mô tả MOTA · Thời gian THOIGIAN)
         | <cfg.nhomNguoi> (mỗi dòng của Data.<cfg.rsNguoi> hai cột: "TIEUDETENNGUOICHAM STT" và TIEUDESOLUONG) | Khóa dữ liệu KHOADULIEU | Tổng
       cfg.ds   = { action, func } LayDSKLGD_DuLieu_CoiThi | _ChamThi — strTuKhoa, strKLGD_KeHoachChiTiet_Id, strKLGD_TongHopKhoiLuong_Id,
                  pageIndex, pageSize (phân trang máy chủ, Pager = tổng); strDaoTao_HocPhan_Id, strDotHoc_Id, strLoaiXacNhan_Id,
                  strHanhDongXacNhan_Id, strDonViQuanLyHocPhan_Id, strDonViQuanLyGiangVien_Id, strGiangVien_Id, strTKB_HinhThucHoc_Id
                  (gốc đọc dropAAAA → ''). Data = { rs: [...], <rsNguoi>: [{ STT, TIEUDETENNGUOICHAM, TIEUDESOLUONG }] }.
       cfg.nguoi = { action, func } LayTTNguoiCoiThiTheo | LayTTNguoiChamThiTheo — MỖI Ô (dòng × người thứ mấy) một lời gọi như gốc:
                  strKLGD_DuLieu_Id = ID dòng, dNguoiThuMay = STT → [0].MASO HODEM TEN / SOLUONG. Chạy hàng đợi 6 luồng, đổi trang giữa
                  chừng thì bỏ lượt cũ. Tổng mỗi dòng = Σ SOLUONG; dòng tổng cuối bảng (gốc insertSumAfterTable) = Σ từng cột số lượng + Σ Tổng.
     · cfg.them = [{ text, ho: PV.HO.<họ>, nhanGV, nhanPhan, tui, luu(id, ctId) → tham số ums.api.call }]
       → nút ở đầu khung; bấm mở PV.khungThem THAY CHỖ màn (pat.formTrang — gốc: vùng zoneEdit_* toggle_overide).
   PV.khungThem(o) — khung "Thêm mới dữ liệu": dòng "Kế hoạch chi tiết: <tên đang chọn>" + chuỗi ô lọc sổ theo dõi (Thời gian → Đợt thi → Môn → [Đợt phách] → Được phân · Người thực hiện phân
     → Hình thức → Phòng → Ngày) + từ khoá + nút "Danh sách" (gốc fa-list-ul → biểu tượng chuẩn chạy truy vấn) → bảng chọn nhiều → Lưu:
     mỗi dòng đánh dấu một lời gọi o.luu(id) qua ui.batch (gốc genHTML_Progress + N lời gọi), xong nạp lại danh sách kế hoạch, khung vẫn mở như gốc.
     Cây cha → con theo đúng tham số thủ tục (pat.chain): tg → dot → mon → { ht → phong → ngay ; phanGV → (gv nạp lại) ; gv ; dotPhach }.
   PV.HO — ba họ lời gọi sổ theo dõi (XLHV_TP_PhanCong_SoTheoDoi_MH + PKG_THI_PHANCONG_SOTHEODOI.*, mã action chép nguyên):
     coiThi (…CoiThi), chamThiTui (…ChamThiTui, có Đợt phách + cột Đợt phách / Túi), chamThi (…ChamThi).
   Khác bản gốc (chung cho hai màn):
     · Khung "Thêm mới" gửi ô của CHÍNH KHUNG: gốc coi thi đọc Thời gian / từ khoá của khung tìm kiếm ngoài, Môn đọc ô không có (dropSearch_HocPhan
       → luôn rỗng, nên lọc theo môn không có tác dụng); gốc chấm thi đọc từ khoá của khung ngoài. Nay gửi đúng ô người dùng đang thấy.
     · Khung "Thêm mới" hiện tên KH chi tiết đang chọn; chưa chọn thì Lưu bị chặn (gốc gửi strKLGD_KeHoachChiTiet_Id rỗng xuống thủ tục).
     · Đổi "Được phân coi/chấm" thì nạp lại "Người thực hiện phân" (thủ tục nhận strGiangVienCoiThi_Id; gốc không nạp lại).
     · Chấm thi theo túi: ô Đợt phách được nạp (gốc có ô, có hàm getList_DotPhach_CT nhưng lời gọi bị ghi chú — ô luôn trống).
     · Lưu N dòng: tiến độ + báo gộp một lần (gốc N thông báo); lỗi lấy người coi/chấm báo MỘT lần mỗi lượt (gốc alert từng ô).
   Cố ý bỏ: ô đánh dấu + nút "Xóa" ở bảng kế hoạch (gốc đã ghi chú nút, không có lời gọi xoá); cột lblCoiThi_Tong / lblChamTui_Tong (không có trên html);
     save_PhamViCoiThi_DST ở màn coi thi (không nút nào gọi); #modal_nhansu / #modal_sinhvien (rỗng).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var PV = ums.tkggPV = ums.tkggPV || {};
    var e = T.e, arr = T.arr, esc = ui.esc;
    var STD = 'XLHV_TP_PhanCong_SoTheoDoi_MH/', PKG = 'PKG_THI_PHANCONG_SOTHEODOI.';

    function call(ma, func, o) { return ums.api.call(Object.assign({ action: STD + ma, func: PKG + func }, o || {})); }
    function tenMon(r) { return e(r.TEN) + ' - ' + e(r.MA); }
    function tenGV(r, tien) { return e(r[tien + '_HODEM']) + ' ' + e(r[tien + '_TEN']) + ' - ' + e(r[tien + '_MA']); }

    /* ---------- Ba họ lời gọi sổ theo dõi: [mã action, tên thủ tục, cột tên] ---------- */
    PV.HO = {
        coiThi: {
            tg: ['DSA4BRIVKS4oBiggLwIuKBUpKAPP', 'LayDSThoiGianCoiThi', 'THOIGIAN', true],   // gốc selectFirst
            dot: ['DSA4BRIFLjUVKSgCLigVKSgP', 'LayDSDotThiCoiThi', 'TENDOTTHI'],
            mon: ['DSA4BRIJLiIRKSAvAi4oFSko', 'LayDSHocPhanCoiThi', tenMon, 'Chọn học phần'],
            phanGV: ['DSA4BRIGKCAvJhcoJC8CLigVKSgP', 'LayDSGiangVienCoiThi', 'GIANGVIEN', 'Chọn được phân coi thi'],
            gv: ['DSA4BRIPJjQuKBUpNCIJKCQvESkgLwIuKBUpKAPP', 'LayDSNguoiThucHienPhanCoiThi', 'GIANGVIEN', 'Chọn giảng viên thực hiện phân coi thi'],
            ht: ['DSA4BRIJKC8pFSk0IhUpKAIuKBUpKAPP', 'LayDSHinhThucThiCoiThi', 'TENHINHTHUCTHI'],
            phong: ['DSA4BRIRKS4vJhUpKAIuKBUpKAPP', 'LayDSPhongThiCoiThi', 'TEN'],
            ngay: ['DSA4BRIPJiA4FSkoAi4oFSko', 'LayDSNgayThiCoiThi', 'NGAYTHI'],
            ds: ['DSA4BRISLhUpJC4FLigCLigVKSgP', 'LayDSSoTheoDoiCoiThi']
        },
        chamThiTui: {
            tg: ['DSA4BRIVKS4oBiggLwIpICwVKSgVNCgP', 'LayDSThoiGianChamThiTui', 'THOIGIAN'],
            dot: ['DSA4BRIFLjUVKSgCKSAsFSkoFTQo', 'LayDSDotThiChamThiTui', 'TENDOTTHI'],
            mon: ['DSA4BRIJLiIRKSAvAikgLBUpKBU0KAPP', 'LayDSHocPhanChamThiTui', tenMon, 'Chọn môn thi'],
            dotPhach: ['DSA4BRIFLjURKSAiKQIpICwVKSgVNCgP', 'LayDSDotPhachChamThiTui', 'TEN'],
            phanGV: ['DSA4BRIGKCAvJhcoJC8CKSAsFSkoFTQo', 'LayDSGiangVienChamThiTui', 'GIANGVIEN', 'Chọn được phân chấm thi'],
            gv: ['DSA4BRIPJjQuKBEpIC8CKSAsFSkoFTQo', 'LayDSNguoiPhanChamThiTui', 'GIANGVIEN', 'Chọn giảng viên thực hiện phân chấm thi'],
            ht: ['DSA4BRIJKC8pFSk0IhUpKAIpICwVKSgVNCgP', 'LayDSHinhThucThiChamThiTui', 'TENHINHTHUCTHI'],
            phong: ['DSA4BRIRKS4vJhUpKAIpICwVKSgVNCgP', 'LayDSPhongThiChamThiTui', 'TENPHONGHOC'],
            ngay: ['DSA4BRIPJiA4FSkoAikgLBUpKBU0KAPP', 'LayDSNgayThiChamThiTui', 'NGAYTHI'],
            ds: ['DSA4BRISLhUpJC4FLigCKSAsFSkoFTQo', 'LayDSSoTheoDoiChamThiTui']
        },
        chamThi: {
            tg: ['DSA4BRIVKS4oBiggLwIpICwVKSgP', 'LayDSThoiGianChamThi', 'THOIGIAN'],
            dot: ['DSA4BRIFLjUVKSgCKSAsFSko', 'LayDSDotThiChamThi', 'TENDOTTHI'],
            mon: ['DSA4BRIJLiIRKSAvAikgLBUpKAPP', 'LayDSHocPhanChamThi', tenMon, 'Chọn môn thi'],
            phanGV: ['DSA4BRIGKCAvJhcoJC8CKSAsFSko', 'LayDSGiangVienChamThi', 'GIANGVIEN', 'Chọn được phân chấm thi'],
            gv: ['DSA4BRIPJjQuKBUpNCIJKCQvESkgLwIpICwVKSgP', 'LayDSNguoiThucHienPhanChamThi', 'GIANGVIEN', 'Chọn giảng viên thực hiện phân chấm thi'],
            ht: ['DSA4BRIJKC8pFSk0IhUpKAIpICwVKSgP', 'LayDSHinhThucThiChamThi', 'TENHINHTHUCTHI'],
            phong: ['DSA4BRIRKS4vJhUpKAIpICwVKSgP', 'LayDSPhongThiChamThi', 'TENPHONGHOC'],
            ngay: ['DSA4BRIPJiA4FSkoAikgLBUpKAPP', 'LayDSNgayThiChamThi', 'NGAYTHI'],
            ds: ['DSA4BRISLhUpJC4FLigCKSAsFSko', 'LayDSSoTheoDoiChamThi']
        }
    };
    var NHAN = { tg: 'Chọn thời gian', dot: 'Chọn đợt thi', mon: 'Chọn học phần', dotPhach: 'Chọn đợt phách', phanGV: 'Chọn được phân coi thi',
        gv: 'Chọn giảng viên thực hiện phân coi thi', ht: 'Chọn hình thức thi', phong: 'Chọn phòng thi', ngay: 'Chọn ngày thi' };
    var THU_TU = ['tg', 'dot', 'mon', 'dotPhach', 'phanGV', 'gv', 'ht', 'phong', 'ngay'];

    /* ---------- Ô đánh dấu chọn dòng (checkX + ID của gốc) ---------- */
    function cotChon() {
        return { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (x) { return '<input type="checkbox" data-ck="' + esc(e(x.ID)) + '">'; } };
    }
    function daChon(host) {
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return c.getAttribute('data-ck'); });
    }
    function ganChonTatCa(host) {
        host.addEventListener('change', function (ev) {
            if (!ev.target.matches || ev.target.getAttribute('data-ck') !== 'all') return;
            var bang = ev.target.closest('table');
            if (bang) Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
    }

    /* =====================================================================
       Khung "Thêm mới dữ liệu" — o = { host, title, ho, nhanGV, nhanPhan, tui, luu(id), sauLuu() }
       ===================================================================== */
    PV.khungThem = function (o) {
        var ho = o.ho, keys = THU_TU.filter(function (k) { return !!ho[k]; });
        function nhan(k) { return ho[k][3] && typeof ho[k][3] === 'string' ? ho[k][3] : NHAN[k]; }
        var body = '<div class="ums-kv ums-u-mb-4"><span>Kế hoạch chi tiết</span><b>' + (o.ctTen ? esc(o.ctTen) :
            '<span class="ums-u-danger">Chưa chọn — chọn ở khung tìm kiếm trước khi Lưu</span>') + '</b></div>' +
            '<div class="ums-filter ums-u-mb-4">' + keys.map(function (k) {
            return '<div class="ums-field"><select class="ums-select" data-pv="' + k + '" data-ph="' + esc(nhan(k)) + '"><option value="">' + esc(nhan(k)) + '</option></select></div>';
        }).join('') +
            '<div class="ums-field"><input class="ums-input" data-pv="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Danh sách', attr: { 'data-pv': 'ds' } }) + '</div></div>' +
            '<div data-pv="bang">' + ui.empty('Chọn điều kiện rồi bấm "Danh sách"') + '</div>';
        var dlg = pat.formTrang({ host: o.host, title: o.title, icon: 'fa-plus', cols: 1, body: body, buttons: [
            { text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }] });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-pv="' + k + '"]'); }
        function v(k) { var el = f(k); return el ? e(el.value) : ''; }
        ui.enhance(B);
        var el = {}; keys.forEach(function (k) { el[k] = f(k); });

        /* Cha → con theo tham số thủ tục (phatLai chỉ ở chuỗi chính để không nạp hai lần) */
        pat.chain([el.tg, el.dot, el.mon, el.ht, el.phong, el.ngay]);
        pat.chain([el.mon, el.phanGV], { phatLai: false });
        pat.chain([el.mon, el.gv], { phatLai: false });
        if (el.dotPhach) pat.chain([el.mon, el.dotPhach], { phatLai: false });

        function nap(k, tham) {
            var h = ho[k]; if (!h || !el[k]) return Promise.resolve();
            pat.fill(el[k], [], { head: nhan(k) });
            return call(h[0], h[1], tham).then(function (r) {
                pat.fill(el[k], arr(r.data), { id: 'ID', name: h[2], head: nhan(k) });
            }).catch(function (err) { ums.api.handle(err, h[1]); });
        }
        var tgId = function () { return { strDaoTao_ThoiGianDaoTao_Id: v('tg') }; };
        var dotId = function () { return Object.assign({ strThi_DotThi_Id: v('dot') }, tgId()); };
        var monId = function () { return Object.assign({ strDaoTao_HocPhan_Id: v('mon') }, dotId()); };
        var htId = function () { return Object.assign({ strThi_HinhThucThi_Id: v('ht') }, monId()); };
        function napDot() { return v('tg') ? nap('dot', tgId()) : Promise.resolve(); }
        function napMon() { return v('dot') ? nap('mon', dotId()) : Promise.resolve(); }
        function napSauMon() {
            if (!v('mon')) return;
            nap('phanGV', monId()); napGV(); nap('ht', monId());
            if (el.dotPhach) nap('dotPhach', monId());
        }
        function napGV() { if (v('mon')) nap('gv', Object.assign({ strGiangVienCoiThi_Id: v('phanGV') }, monId())); }
        function napPhong() { if (v('ht')) nap('phong', htId()); }
        function napNgay() { if (v('phong')) nap('ngay', Object.assign({ strTKB_PhongThi_Id: v('phong') }, htId())); }
        el.tg.addEventListener('change', napDot);
        el.dot.addEventListener('change', napMon);
        el.mon.addEventListener('change', napSauMon);
        el.phanGV.addEventListener('change', napGV);
        el.ht.addEventListener('change', napPhong);
        el.phong.addEventListener('change', napNgay);
        call(ho.tg[0], ho.tg[1], {}).then(function (r) {
            var rows = arr(r.data);
            pat.fill(el.tg, rows, { id: 'ID', name: ho.tg[2], head: nhan('tg') });
            if (ho.tg[3] === true && rows.length) {           // gốc selectFirst
                el.tg.value = e(rows[0].ID);
                if (window.jQuery) jQuery(el.tg).trigger('change.select2').trigger({ type: 'select2:select', params: { data: { id: el.tg.value } } });
                napDot();
            }
        }).catch(function (err) { ums.api.handle(err, ho.tg[1]); });

        /* Danh sách sổ theo dõi */
        var bang = f('bang'), rows = [];
        ganChonTatCa(bang);
        function tai() {
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var th = { strTuKhoa: e(f('q').value).trim(), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strThi_DotThi_Id: v('dot') };
            if (el.dotPhach) th.strThi_DotPhach_Id = v('dotPhach');
            Object.assign(th, { strDaoTao_HocPhan_Id: v('mon'), strGVDuocPhanCoiThi_Id: v('phanGV'), strGVThucHienPhanCoiThi_Id: v('gv'),
                strThi_HinhThucThi_Id: v('ht'), strTKB_PhongThi_Id: v('phong'), strNgayThi: v('ngay') });
            call(ho.ds[0], ho.ds[1], th).then(function (r) { rows = arr(r.data); ve(); })
                .catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, ho.ds[1]); });
        }
        function ve() {
            var cot = [{ title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' }];
            if (o.tui) cot.push({ title: 'Đợt phách', prop: 'THI_DOTPHACH_TEN' }, { title: 'Túi', prop: 'THI_TUIBAI_TEN', cls: 'is-nowrap' });
            cot.push(
                { title: 'Danh sách thi', prop: 'THI_DANHSACHTHI_TEN' },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Hình thức thi', prop: 'THI_HINHTHUCTHI_TEN' },
                { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' },
                { title: 'Ca thi', prop: 'THI_CATHI_TEN', cls: 'is-nowrap' },
                { title: 'Phòng thi', prop: 'TKB_PHONGHOC_TEN', cls: 'is-nowrap' },
                { title: 'Số SV', prop: 'SOSV', cls: 'is-center' },
                { title: o.nhanGV, render: function (x) { return esc(tenGV(x, 'GIANGVIENCOITHI')); } },
                { title: o.nhanPhan, render: function (x) { return esc(tenGV(x, 'GIANGVIENPHANCOITHI')); } },
                { title: 'Đợt thi', prop: 'THI_DOTTHI_TEN' },
                cotChon());
            ui.table({ el: bang, rows: rows, columns: cot, stt: true, empty: 'Không có dữ liệu' });
        }
        f('ds').addEventListener('click', tai);
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });

        function luu() {
            if (!o.ctTen) { ui.toast('Bạn chưa chọn kế hoạch chi tiết ở khung tìm kiếm', 'warn'); return; }
            var ids = daChon(bang);
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
            ui.batch(ids.map(function (id) { return o.luu(id); }), { title: 'Đang lưu', okText: 'Thêm mới thành công!', show: true }).then(function (r) {
                if (r && r.ok) Array.prototype.forEach.call(bang.querySelectorAll('input[data-ck]:checked'), function (c) { c.checked = false; });
                if (o.sauLuu) o.sauLuu();
            });
        }
        return dlg;
    };

    /* =====================================================================
       Màn "Xác định phạm vi …" — cfg = { title, ds, nguoi, rsNguoi, nhomNguoi, them[] }
       ===================================================================== */
    PV.man = function (root, cfg) {
        root.innerHTML = pat.page(cfg.title, '') +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter" data-z="loc"></div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-building', count: 'n', flush: true, zone: 'bang',
                tools: (cfg.them || []).map(function (t, i) { return ui.btn('add', { text: t.text, attr: { 'data-them': String(i) } }); }).join('') });
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        var loc = z('loc'), bang = z('bang');
        var kh = T.boLocKeHoach(loc, { loai: 'ma', muc: 3, onDoi: function (k) { if (k !== 'tg') tai(1); } });
        loc.insertAdjacentHTML('beforeend',
            '<div class="ums-field"><input class="ums-input" data-pv="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>');
        var q = loc.querySelector('[data-pv="q"]');

        var trang = { index: 1, size: 10 }, luot = 0, duLieu = { rs: [], nguoi: [] };
        function tai(p) {
            if (p) trang.index = p;
            var sh = ++luot;
            z('n').textContent = '';
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call(Object.assign({}, cfg.ds, {
                strTuKhoa: e(q.value).trim(), strDaoTao_HocPhan_Id: '', strKLGD_KeHoachChiTiet_Id: kh.v('ct'), strKLGD_TongHopKhoiLuong_Id: kh.v('th'),
                strDotHoc_Id: '', strLoaiXacNhan_Id: '', strHanhDongXacNhan_Id: '', strDonViQuanLyHocPhan_Id: '', strDonViQuanLyGiangVien_Id: '',
                strGiangVien_Id: '', strTKB_HinhThucHoc_Id: '', pageIndex: trang.index, pageSize: trang.size
            })).then(function (r) {
                if (sh !== luot) return;
                var d = r.data || {};
                duLieu = { rs: arr(d.rs), nguoi: arr(d[cfg.rsNguoi]) };
                ve(sh, Number(r.pager) || 0);
            }).catch(function (err) {
                if (sh !== luot) return;
                bang.innerHTML = ui.fail(err.message);
                ums.api.handle(err, cfg.ds.func);
            });
        }

        function ve(sh, tong) {
            var rs = duLieu.rs, ng = duLieu.nguoi, g1 = ['Thông tin dữ liệu'], g2 = [cfg.nhomNguoi];
            var cot = [
                { title: 'Loại dữ liệu', prop: 'LOAIDULIEU_TEN', group: g1 },
                { title: 'Mã', prop: 'DULIEUXACNHAN_MA', group: g1, cls: 'is-nowrap' },
                { title: 'Tên', prop: 'DULIEUXACNHAN_TEN', group: g1 },
                { title: 'Mô tả', prop: 'MOTA', group: g1 },
                { title: 'Thời gian', prop: 'THOIGIAN', group: g1, cls: 'is-nowrap' }];
            /* Dòng tổng chuẩn của ui.table (sum) — số điền sau khi các lời gọi từng ô về (gốc insertSumAfterTable chạy ở complete) */
            ng.forEach(function (n, j) {
                cot.push({ title: e(n.TIEUDETENNGUOICHAM) + ' ' + e(n.STT), group: g2, cls: 'is-nowrap', render: function (r, i) { return '<span data-ten="' + i + '|' + j + '"></span>'; } },
                    { title: e(n.TIEUDESOLUONG), group: g2, cls: 'is-center', render: function (r, i) { return '<span data-sl="' + i + '|' + j + '"></span>'; },
                        sum: function () { return '<b data-tcot="' + j + '"></b>'; } });
            });
            cot.push({ title: 'Khóa dữ liệu', prop: 'KHOADULIEU', cls: 'is-center is-nowrap' },
                { title: 'Tổng', cls: 'is-center', render: function (r, i) { return '<b data-tong="' + i + '"></b>'; }, sum: function () { return '<b data-tcot="all"></b>'; } });
            ui.table({ el: bang, rows: rs, columns: cot, stt: true, empty: 'Không có dữ liệu',
                page: { index: trang.index, size: trang.size, total: tong || rs.length,
                    onChange: function (p) { tai(p); }, onSize: function (s) { trang.size = s; tai(1); } } });
            z('n').textContent = '(' + (tong || rs.length) + ')';
            if (!rs.length || !ng.length) return;

            /* getData_NguoiCham gốc: một lời gọi cho mỗi ô; xong hết thì tính Tổng từng dòng + dòng tổng cuối bảng */
            var viec = [], baoLoi = false, tongDong = rs.map(function () { return 0; }), tongCot = ng.map(function () { return 0; });
            rs.forEach(function (d, i) {
                ng.forEach(function (n, j) {
                    viec.push(function () {
                        return ums.api.call(Object.assign({ silent: true }, cfg.nguoi, { strKLGD_DuLieu_Id: d.ID, dNguoiThuMay: n.STT })).then(function (r) {
                            if (sh !== luot) return;
                            var x = arr(r.data)[0];
                            if (!x) return;
                            var oTen = bang.querySelector('[data-ten="' + i + '|' + j + '"]'), oSl = bang.querySelector('[data-sl="' + i + '|' + j + '"]');
                            if (oTen) oTen.textContent = (e(x.MASO) + ' ' + e(x.HODEM) + ' ' + e(x.TEN)).trim();
                            if (oSl) oSl.textContent = e(x.SOLUONG);
                            var so = parseInt(x.SOLUONG, 10);
                            if (!isNaN(so)) { tongDong[i] += so; tongCot[j] += so; }
                        }).catch(function (err) {
                            if (sh !== luot || baoLoi) return;
                            baoLoi = true;
                            ums.api.handle(err, cfg.nguoi.func);
                        });
                    });
                });
            });
            var k = 0, dangChay = 0;
            function chay() {
                if (sh !== luot) return;
                if (k >= viec.length) { if (!dangChay) xong(); return; }
                dangChay++;
                viec[k++]().then(function () { dangChay--; chay(); });
            }
            function xong() {
                function dien(chon, so) { var o = bang.querySelector(chon); if (o) o.textContent = String(so); }
                rs.forEach(function (d, i) { dien('[data-tong="' + i + '"]', tongDong[i]); });
                tongCot.forEach(function (s, j) { dien('[data-tcot="' + j + '"]', s); });
                dien('[data-tcot="all"]', tongDong.reduce(function (a, b) { return a + b; }, 0));
            }
            for (var n = 0; n < 6; n++) chay();
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a="search"], [data-them]');
            if (!b || !root.contains(b) || b.closest('.ums-formtrang')) return;
            if (b.hasAttribute('data-them')) {
                var t = cfg.them[Number(b.getAttribute('data-them'))];
                var ct = kh.v('ct'), oCt = kh.el('ct');
                // Chặn NGAY khi bấm Thêm (người dùng 6/10): chưa chọn kế hoạch chi tiết thì mở khung rồi lọc, đánh dấu xong mới bị chặn ở Lưu là muộn
                if (!ct) { ui.toast('Chọn Kế hoạch chi tiết ở khung tìm kiếm trước, rồi mới thêm dữ liệu vào kế hoạch đó', 'warn'); if (oCt && window.jQuery) jQuery(oCt).select2('open'); return; }
                var ctTen = oCt && oCt.selectedIndex > 0 ? oCt.options[oCt.selectedIndex].text : ct;
                PV.khungThem({ host: root, title: t.text, ho: t.ho, nhanGV: t.nhanGV, nhanPhan: t.nhanPhan, tui: t.tui, ctTen: ctTen,
                    luu: function (id) { return t.luu(id, ct); }, sauLuu: function () { tai(trang.index); } });
                return;
            }
            tai(1);
        });
        q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

        tai(1);                                            // gốc nạp danh sách ngay khi mở màn
        return { tai: tai, v: kh.v };
    };
})();
