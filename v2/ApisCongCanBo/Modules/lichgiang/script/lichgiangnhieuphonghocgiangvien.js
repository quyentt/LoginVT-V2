/* =========================================================================
   Lịch giảng nhiều giảng viên — giảng viên × 7 ngày × 3 buổi
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/lichgiangnhieuphonghocgiangvien.html + script/lichgiangnhieuphonghocgiangvien.js
   Khung lưới / lịch tháng / chi tiết / xuất Excel: _nhieu.js (ums.lg.nhieu).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       NS_HoSo_V2_MH · pkg_nhansu_hoso_v2.LayDanhSachToanBo      ô Khoa/đơn vị (ums.ref.coCauToChuc)
       NS_HoSo_V2_MH · pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2   hai ô giảng viên + danh sách dòng
                                                                (dLaCanBoNgoaiTruong −1, pageSize 1000000 — ums.ref.nhanSu)
       NS_ThongTinCanBo/LayDSLichGiang (GET)                     lịch tuần — MỖI GIẢNG VIÊN một lời gọi, 30 người / trang
   Buổi chỉ theo TIETBATDAU: 1-6 / 7-10 / 11-15 (buổi không có tiết không hiện —
   như gốc). Hiệu suất tính CẢ Chủ nhật (mẫu số 7 ngày) — như gốc.

   Không chép (lỗi rõ của bản gốc):
     · Buổi dạy chung nhiều giảng viên: hộp chi tiết lấy bản ghi ĐẦU TIÊN cùng ID
       nên có khi hiện nhầm tên giảng viên của dòng khác. Ở đây lấy đúng dòng đã bấm.
     · Buổi thiếu tiết vẫn in "(Tundefined-undefined)".
     · Mỗi lượt nạp tuần lại gọi lại toàn bộ danh sách nhân sự (pageSize 1000000);
       ở đây nhớ theo đơn vị.
     · getList_NhanSu lỗi thì lưới quay mãi — ở đây hiện lỗi.
   Giữ như bản gốc (chờ nghiệp vụ):
     · Buổi 7-10 / 11-15 và tính Chủ nhật — màn "Lịch giảng đường" lại chia
       7-12 / 13-15 và bỏ Chủ nhật. Hai màn đang lệch nhau.
     · Khoa/đơn vị → giảng viên KHÔNG khoá: để trống = "Tất cả khoa/đơn vị".
       Đổi đơn vị vẫn nạp lại và xoá trắng hai ô giảng viên.
     · "Xem tất cả lịch giảng" = mọi nhân sự của đơn vị (30 người một lần nạp),
       xuất "Tất cả giảng viên" gọi một lượt cho MỖI người — có thể hàng nghìn lời gọi.
     · Chọn ở ô nhiều giảng viên thì xoá ô một giảng viên (hai ô loại trừ nhau).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, lg = ums.lg;
    var root = document.getElementById('lg-lichgiangnhieuphonghocgiangvien');
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function ten(r) { return (e(r.HODEM) + ' ' + e(r.TEN)).trim() || e(r.TENGIANGVIEN); }
    function tenMa(r) { return ten(r) + ' - ' + e(r.MASO); }
    function donVi(r) { return e(r.DAOTAO_COCAUTOCHUC_TEN) || e(r.COCAUTOCHUC_TEN); }

    var CHE_DO = [
        { v: 'days', ten: 'Tính theo ngày có lịch dạy (mặc định)', nhan: 'Theo ngày' },
        { v: 'periods', ten: 'Tính theo tiết dạy', nhan: 'Theo tiết', tu: 1, den: 15 },
        { v: 'morning', ten: 'Tính theo buổi sáng (T1-6)', nhan: 'Buổi sáng', tu: 1, den: 6 },
        { v: 'afternoon', ten: 'Tính theo buổi chiều (T7-10)', nhan: 'Buổi chiều', tu: 7, den: 10 },
        { v: 'evening', ten: 'Tính theo buổi tối (T11-15)', nhan: 'Buổi tối', tu: 11, den: 15 },
        { v: 'morning-afternoon', ten: 'Tính theo sáng + chiều (T1-10)', nhan: 'Sáng + Chiều', tu: 1, den: 10 },
        { v: 'afternoon-evening', ten: 'Tính theo chiều + tối (T7-15)', nhan: 'Chiều + Tối', tu: 7, den: 15 },
        { v: 'all-sessions', ten: 'Tính theo cả 3 buổi (T1-15)', nhan: 'Cả 3 buổi', tu: 1, den: 15 }
    ];
    function tietCua(r) { return { batDau: r.TIETBATDAU, ketThuc: r.TIETKETTHUC }; }
    function caCua(r) {
        var t = +r.TIETBATDAU;
        if (t >= 1 && t <= 6) return 0; if (t >= 7 && t <= 10) return 1; if (t >= 11 && t <= 15) return 2;
        return -1;
    }
    function tietChu(r) { return r.TIETBATDAU ? 'T' + e(r.TIETBATDAU) + '-' + e(r.TIETKETTHUC) : ''; }

    /* ---------- Nguồn dữ liệu ------------------------------------------- */
    var goc = [], boNho = {};
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function layCanBo(dv) {
        var k = dv || '';
        if (boNho[k]) return Promise.resolve(boNho[k]);
        return ums.ref.nhanSu({ strCoCauToChuc_Id: k, dLaCanBoNgoaiTruong: -1, pageIndex: 1, pageSize: 1000000 }).then(function (d) { return (boNho[k] = d || []); });
    }
    function dsDong() {
        return layCanBo(f('donvi').value).then(function (ds) {
            goc = ds;
            var nhieu = pat.val(f('nhieu')), mot = f('mot').value;
            var ids = nhieu ? nhieu.split(',') : mot ? [mot] : [];
            return ids.length ? ds.filter(function (r) { return ids.indexOf(String(r.ID)) >= 0; }) : ds;
        });
    }
    function layLich(cb, bd, kt) {
        return ums.api.call({ action: 'NS_ThongTinCanBo/LayDSLichGiang', method: 'GET', silent: true, strNhanSu_HoSoCanBo_Id: cb.ID,
            strNgayBatDau: bd, strNgayKetThuc: kt, strNgayDangChon: bd }).then(function (r) {
            return arr(r.data).map(function (x) { x.IDCANBO = cb.ID; return x; });
        });
    }

    /* Ô giảng viên: danh sách hàng nghìn người — select2 phân trang 50 người
       ở máy khách, tìm trên nhãn (như bản gốc) */
    var nhanCB = [];
    function s2PhanTrang(el) {
        ui.select2(el, {
            minimumInputLength: 0,
            ajax: {
                delay: 150,
                transport: function (p, ok) {
                    var tk = String((p.data && p.data.term) || '').toLowerCase(), trang = (p.data && p.data.page) || 1;
                    var ds = tk ? nhanCB.filter(function (x) { return x.l.indexOf(tk) >= 0; }) : nhanCB;
                    ok({ results: ds.slice((trang - 1) * 50, trang * 50).map(function (x) { return { id: x.id, text: x.t }; }), pagination: { more: trang * 50 < ds.length } });
                    return { abort: function () {} };
                },
                processResults: function (d) { return d; }
            }
        });
    }
    function napOCanBo(dv) {
        return layCanBo(dv).then(function (ds) {
            nhanCB = ds.map(function (r) { var t = ums.ref.tenNhanSu(r); return { id: String(r.ID), t: t, l: t.toLowerCase() }; });
            f('mot').innerHTML = '<option value=""></option>'; f('nhieu').innerHTML = '';
            if (window.jQuery) { jQuery(f('mot')).val('').trigger('change.select2'); jQuery(f('nhieu')).val(null).trigger('change.select2').trigger('ums:refresh'); }
        });
    }
    /* Cây đơn vị: con thụt vào dưới cha (bản gốc dựng cây theo DAOTAO_COCAUTOCHUC_CHA_ID) */
    function cay(ds) {
        var con = {}, co = {}, kq = [];
        ds.forEach(function (r) { co[r.ID] = true; });
        ds.forEach(function (r) { var c = co[r.DAOTAO_COCAUTOCHUC_CHA_ID] ? r.DAOTAO_COCAUTOCHUC_CHA_ID : ''; (con[c] = con[c] || []).push(r); });
        (function di(cha, muc) { (con[cha] || []).forEach(function (r) { kq.push({ ID: r.ID, TEN: new Array(muc + 1).join('— ') + e(r.TEN) }); if (muc < 20) di(r.ID, muc + 1); }); })('', 0);
        return kq;
    }

    var N = lg.nhieu(root, {
        tieuDe: 'Lịch giảng nhiều giảng viên', phuDe: 'Tra cứu và quản lý lịch giảng theo khoa/đơn vị',
        gioiThieu: ['Chọn khoa/đơn vị để hiển thị danh sách giảng viên', 'Hiển thị lịch theo tuần (T2 - CN)', 'Xuất báo cáo Excel theo nhu cầu'],
        loc: '<div class="lgn-xep">' +
            '<select class="ums-select" data-f="donvi" data-ph="Chọn khoa/đơn vị..."><option value="">Tất cả khoa/đơn vị</option></select>' +
            '<select class="ums-select" data-f="mot" data-ph="Tìm kiếm giảng viên..."><option value=""></option></select>' +
            '<select class="ums-select" data-f="nhieu" multiple data-ph="Chọn nhiều giảng viên..."></select>' +
            '<select class="ums-select" data-f="hieusuat" data-no-s2>' + CHE_DO.map(function (c) { return '<option value="' + c.v + '">' + esc(c.ten) + '</option>'; }).join('') + '</select></div>',
        nut: ui.btn('search', { text: 'Xem lịch giảng viên', attr: { 'data-a': 'xem' }, icon: 'fa-eye' }) +
            ui.btn('search', { text: 'Xem nhiều giảng viên', icon: 'fa-layer-group', mod: 'out-primary', attr: { 'data-a': 'nhieu' } }) +
            ui.btn('search', { text: 'Xem tất cả lịch giảng', icon: 'fa-table-list', mod: 'out-primary', attr: { 'data-a': 'tatca' } }),
        tenLuoi: 'Lịch tuần theo giảng viên', cotDong: 'Giảng viên', cotHieuSuat: 'Hiệu suất<br>dạy học', donVi: 'giảng viên', rong: 'Không có dữ liệu giảng viên',
        ca: [
            { ten: 'SÁNG', xuat: 'Sáng', tiet: 'Tiết 1-6', mau: '#FFF9E6', nen: '#FFFEF5' },
            { ten: 'CHIỀU', xuat: 'Chiều', tiet: 'Tiết 7-10', mau: '#E6F3FF', nen: '#F5F9FF' },
            { ten: 'TỐI', xuat: 'Tối', tiet: 'Tiết 11-15', mau: '#F0E6FF', nen: '#F9F5FF' }
        ],
        caCua: caCua, tietCua: tietCua, cheDo: CHE_DO, boCN: false,
        dsDong: dsDong, dsGoc: function () { return goc; }, layLich: layLich, khoa: function (r) { return r.ID; },
        veDong: function (r) {
            return '<b>' + esc(ten(r)) + '</b>' + (r.MASO ? '<span class="ums-badge ums-badge--info">' + esc(r.MASO) + '</span>' : '') + '<i>' + esc(donVi(r)) + '</i>';
        },
        dong3: function (r) { return '<i class="fa-light fa-door-open"></i> ' + esc(e(r.TENPHONGHOC)); },
        chiTiet: function (r, cb) {
            return { phong: e(r.TENPHONGHOC), ngay: e(r.NGAYHOC), gio: lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU') + ' - ' + lg.gioPhut(r, 'GIOKETTHUC', 'PHUTKETTHUC'),
                tiet: r.TIETBATDAU ? 'Tiết ' + e(r.TIETBATDAU) + ' - ' + e(r.TIETKETTHUC) : '', gv: cb ? tenMa(cb) : lg.sach(r.THONGTINGIANGVIEN) };
        },
        xuat: {
            tieuDe: 'Xuất Excel - Lịch giảng nhiều giảng viên', tieuDeTep: 'LỊCH GIẢNG NHIỀU GIẢNG VIÊN', nhanLoc: 'Chọn giảng viên',
            nhanPhamVi: ['Tất cả giảng viên', 'Giảng viên đang lọc hiện tại', 'Chọn giảng viên cụ thể'], nhanChon: 'Chọn giảng viên', nhanChonTrong: 'Giảng viên', banBan: false,
            thongTin: 'File xuất gồm: Giảng viên, Thời gian, Học phần, Lớp, Phòng học — chia theo ca Sáng / Chiều / Tối.',
            tenChon: tenMa,
            tenDong: function (r) { return esc(ten(r)) + '<br><i>' + esc(e(r.MASO)) + '</i><br><small>' + esc(donVi(r)) + '</small>'; },
            csvDau: ['Giảng viên', 'Mã số', 'Đơn vị'], csvDong: function (r) { return [ten(r), e(r.MASO), donVi(r)]; },
            excelO: function (r) {
                var t = tietChu(r);
                return esc(lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU') + '-' + lg.gioPhut(r, 'GIOKETTHUC', 'PHUTKETTHUC') + (t ? ' (' + t + ')' : '')) + '<br>' + esc(e(r.TENHOCPHAN)) +
                    '<br>Lớp: ' + esc(e(r.TENLOPHOCPHAN)) + '<br>Phòng: ' + esc(e(r.TENPHONGHOC));
            },
            csvO: function (r) {
                var t = tietChu(r);
                return lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU') + '-' + lg.gioPhut(r, 'GIOKETTHUC', 'PHUTKETTHUC') + (t ? ' (' + t + ')' : '') + ' ' + e(r.TENHOCPHAN) +
                    ' - Lớp: ' + e(r.TENLOPHOCPHAN) + ' - Phòng: ' + e(r.TENPHONGHOC);
            }
        }
    });

    s2PhanTrang(f('mot')); s2PhanTrang(f('nhieu'));
    ums.ref.coCauToChuc({}).then(function (ds) { pat.fill(f('donvi'), cay(ds), { head: 'Tất cả khoa/đơn vị' }); }).catch(function (err) { ums.api.handle(err, 'khoa/đơn vị'); });
    napOCanBo('').catch(function (err) { ums.api.handle(err, 'giảng viên'); });

    if (window.jQuery) {
        jQuery(f('donvi')).on('change', function () { napOCanBo(f('donvi').value).then(function () { if (N.tuan) N.tai(); }).catch(function (err) { ums.api.handle(err, 'giảng viên'); }); });
        jQuery(f('mot')).on('select2:select select2:clear', function () { if (N.tuan) N.tai(); });
        jQuery(f('nhieu')).on('select2:select', function () { jQuery(f('mot')).val('').trigger('change.select2'); });
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'xem') {
            if (!f('donvi').value && !f('mot').value && !pat.val(f('nhieu'))) { ui.toast('Vui lòng chọn khoa/đơn vị hoặc giảng viên', 'warn'); return; }
            N.tai();
        } else if (a === 'nhieu') {
            if (!pat.val(f('nhieu'))) { ui.toast('Vui lòng chọn ít nhất 1 giảng viên để xem', 'warn'); return; }
            N.tai();
        } else if (a === 'tatca') {
            f('donvi').value = ''; if (window.jQuery) jQuery(f('donvi')).trigger('change.select2');
            napOCanBo('').then(function () { N.tai(); });
        }
    });
})();
