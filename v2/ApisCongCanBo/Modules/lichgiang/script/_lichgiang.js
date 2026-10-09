/* =========================================================================
   Lịch giảng — khung chung của lichgiang (giảng viên tự xem) và
   lichgiangadmin (quản trị xem lịch của một cán bộ) — ums.lg.man(root, { admin })
   Bản gốc: ApisCongCanBo/Modules/lichgiang/script/lichgiang.js (một tệp cho hai html)
   ---------------------------------------------------------------------------
   Bố cục bản gốc: cột trái (col-9) "Lớp học phần không có lịch chi tiết" +
   "Lịch cá nhân" (lưới tuần); cột phải (col-3) lịch tháng, [Học kỳ], báo cáo,
   "Danh sách lớp đổi lịch".
   Lịch tuần / lịch tháng / hộp điểm danh: tầng chung ums.lich (assets/js/lich.js).

   Lời gọi (chép nguyên — xem spec đầu các hàm):
       NS_ThongTinCanBo_MH · PKG_CONGTHONGTINCANBO.LayTKBLopKhongCoLichChiTiet   lớp không có lịch chi tiết (theo ngày bấm)
       NS_ThongTinCanBo/LayDSLichGiang (GET)                                     lịch tuần
       SV_CamXuc_MH · pkg_dg_camxuc_nguoihoc.LayTTCamXucTongHop                   cảm xúc — MỖI buổi một lời gọi
       NS_ThongTinCanBo/LayHocKyTheoLichCaNhan (GET)                             ô Học kỳ (chỉ lichgiang; chỉ là tham số báo cáo)
       KHCT_LichGiang_DoiLich/…                                                   đổi lịch (xem _lichgiang_doilich.js)
       Quản trị: ums.ref.nhanSu (dLaCanBoNgoaiTruong -1) — ô Cán bộ;
                 NS_ThongTinCanBo/LayTTGiangVienTheoTuKhoa (GET) — ô "Mã cán bộ"
   Mẫu báo cáo: strNhanSu_HoSoCanBo_Id (cán bộ đang xem), strNgayBatDau / strNgayKetThuc (tuần), strHocKy_Id.

   Giữ như bản gốc:
     · Quản trị mở màn là xem lịch CỦA NGƯỜI ĐĂNG NHẬP cho tới khi chọn cán bộ.
     · Học kỳ lấy theo người đăng nhập, không lọc gì (chỉ gửi kèm báo cáo).
     · Hàng loạt lời gọi cảm xúc mỗi buổi (N+1) như bản gốc.
   Khác bản gốc: bản quản trị không vẽ nút "Xem các buổi điểm danh" (html quản trị
   không có hộp đó — bản gốc vẫn vẽ nút và gọi API rồi không hiện gì).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var lg = ums.lg = ums.lg || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function lay(r, ks) { for (var i = 0; i < ks.length; i++) { var v = r[ks[i]]; if (v !== null && v !== undefined && v !== '') return v; } return ''; }
    var EMO = '../assets/images/eval-emoji/';

    lg.man = function (root, o) {
        o = o || {};
        var gv = uid(), gvTen = '';
        root.innerHTML =
            pat.page(o.admin ? 'Thời khóa biểu admin' : 'Thời khóa biểu', '') +
            '<div class="lg-trang">' +
                '<div class="lg-trang__chinh">' +
                    pat.panel({ title: 'Lớp học phần (không có lịch chi tiết)', icon: 'fa-users-rectangle', zone: 'klct', flush: true }) +
                    '<div class="ums-u-mt-4">' + pat.panel({
                        title: 'Lịch cá nhân', icon: 'fa-calendar-circle-user', count: 'gvTen', zone: 'tuan',
                        tools: o.admin ? '<div class="lg-timcb"><select class="ums-select" data-f="cb" data-ph="Chọn cán bộ"><option value=""></option></select>' +
                            '<input class="ums-input" data-f="macb" placeholder="Mã cán bộ" autocomplete="off">' +
                            ui.btn('search', { text: '', attr: { 'data-a': 'timcb', title: 'Tìm theo mã cán bộ' } }) + '</div>' : ''
                    }) + '</div>' +
                '</div>' +
                '<aside class="lg-trang__phu">' +
                    '<div data-z="thang"></div>' +
                    (o.admin ? '' : '<div class="ums-u-mt-4">' + ui.field('Học kỳ', '<select class="ums-select" data-f="hk" data-ph="Chọn học kỳ"><option value=""></option></select>') + '</div>') +
                    '<div class="ums-u-mt-4" data-z="bc"></div>' +
                    '<div class="ums-u-mt-4">' + pat.panel({ title: 'Danh sách lớp đổi lịch', icon: 'fa-calendar-pen', zone: 'doilich', flush: true, cls: 'lg-doilich' }) + '</div>' +
                '</aside>' +
            '</div>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

        /* ---------- Lớp học phần không có lịch chi tiết ------------------ */
        function taiKLCT(ngay) {
            if (!ngay) { z('klct').innerHTML = ui.empty('Chọn một ngày trên lịch để xem các lớp học phần không có lịch chi tiết', 'fa-hand-pointer'); return; }
            z('klct').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4FQoDDS4xCikuLyYCLg0oIikCKSgVKCQ1', func: 'PKG_CONGTHONGTINCANBO.LayTKBLopKhongCoLichChiTiet',
                strNhanSu_HoSoCanBo_Id: gv, strNgay: ngay, strNguoiThucHien_Id: uid() }).then(function (r) {
                ui.table({ el: z('klct'), stt: false, rows: arr(r.data), empty: 'Hiện chưa có dữ liệu', columns: [
                    { title: 'Mã lớp', render: function (x) { return esc(lay(x, ['MALOP', 'MA_LOP', 'MA', 'LOP_MA', 'LOPHOC_MA', 'LOPHOCPHAN_MA'])); } },
                    { title: 'Tên lớp', render: function (x) { return esc(lay(x, ['TENLOP', 'TEN_LOP', 'TEN', 'LOP_TEN', 'LOPHOC_TEN', 'TENLOPHOCPHAN', 'LOPHOCPHAN_TEN'])); } },
                    { title: 'Hình thức học', render: function (x) { return esc(lay(x, ['HINHTHUCHOC', 'HINH_THUC_HOC', 'HINHTHUC', 'HINHTHUC_TEN', 'TENHINHTHUC', 'HINHTHUCXEP_TEN', 'TENHINHTHUCXEP'])); } },
                    { title: 'Ngày bắt đầu', cls: 'is-center is-nowrap', render: function (x) { return esc(lay(x, ['NGAYBATDAU', 'TU_NGAY', 'TUNGAY', 'NGAYBATDAU_DD_MM_YYYY', 'NGAYBATDAU_TEXT'])); } },
                    { title: 'Ngày kết thúc', cls: 'is-center is-nowrap', render: function (x) { return esc(lay(x, ['NGAYKETTHUC', 'DEN_NGAY', 'DENNGAY', 'NGAYKETTHUC_DD_MM_YYYY', 'NGAYKETTHUC_TEXT'])); } },
                    { title: 'Ghi chú', render: function (x) { return esc(lay(x, ['GHICHU', 'GHI_CHU', 'NOTE', 'MOTA', 'MO_TA'])); } }
                ] });
            }).catch(function (err) { z('klct').innerHTML = ui.fail(err.message); });
        }
        taiKLCT('');

        /* ---------- Lịch tuần -------------------------------------------- */
        function noiDung(r) {
            return '<b>' + esc(e(r.TENHOCPHAN)) + '</b><span class="ums-ltuan__tg">' + esc(ums.lich.khungGio(r)) + ' (Tiết ' + esc(e(r.TIETBATDAU)) + '-' + esc(e(r.TIETKETTHUC)) + ')</span>' +
                '<div class="ums-ltuan__act">' +
                    (o.admin ? '' : '<button type="button" class="is-ok" data-lg="cacbuoi" title="Xem các buổi điểm danh"><i class="fa-light fa-clipboard-list"></i></button>') +
                    '<button type="button" class="is-bad" data-lg="doilich" title="Yêu cầu đổi lịch"><i class="fa-light fa-calendar-pen"></i></button></div>' +
                '<div>' + esc(e(r.TENLOPHOCPHAN)) + '<br>' + esc(e(r.TENPHONGHOC)) + '</div><div class="ums-ltuan__cx" data-cx="' + esc(r.ID) + '"></div>';
        }
        var L = ums.lich.tao({
            thang: z('thang'), tuan: z('tuan'), mau: 'IDLOPHOCPHAN', noiDung: noiDung,
            onChon: function (t) { taiKLCT(t.ngay); },
            load: function (t) {
                return ums.api.call({ action: 'NS_ThongTinCanBo/LayDSLichGiang', method: 'GET', strNhanSu_HoSoCanBo_Id: gv,
                    strNgayBatDau: t.batdau, strNgayKetThuc: t.ketthuc, strNgayDangChon: t.ngay }).then(function (r) { return arr(r.data); });
            },
            danhDau: function (ds) { return ds.length ? String(e(ds[0].DSNGAYCOLICH)).split(',') : []; },
            sauKhiVe: function (ds, host) {
                ds.forEach(function (r) {
                    ums.api.call({ action: 'SV_CamXuc_MH/DSA4FRUCICwZNCIVLi8mCS4x', func: 'pkg_dg_camxuc_nguoihoc.LayTTCamXucTongHop', silent: true,
                        strDiem_DanhSachHoc_Id: e(r.IDLOPHOCPHAN), strNgayGhiNhan: e(r.NGAYHOC), dGio: e(r.GIOBATDAU), dPhut: e(r.PHUTBATDAU), dGiay: 0, strNguoiThucHien_Id: gv })
                        .then(function (x) {
                            var el = host.querySelector('[data-cx="' + r.ID + '"]');
                            if (el) el.innerHTML = arr(x.data).map(function (c) {
                                return '<span><img alt="" src="' + esc(EMO + e(c.DG_CHUCNANG_CHUDE_CHITIET_ANH)) + '">' + (c.SOLUONG ? ' ' + esc(c.SOLUONG) : '') + '</span>';
                            }).join('');
                        }).catch(function () {});
                });
            },
            onClick: function (r, t) {
                var a = t.closest('[data-lg]');
                if (a && a.getAttribute('data-lg') === 'cacbuoi') { lg.xemCacBuoi(r, L.rows, { host: root }); return; }
                if (a && a.getAttribute('data-lg') === 'doilich') { lg.doiLich.khoiTao(r, taiDoiLich, { host: root }); return; }
                if (!e(r.TENLOPHOCPHAN)) return;                     // bản gốc: buổi không có lớp thì bấm không mở
                ums.lich.diemDanh(r, o.admin ? { cot2: 'Số buổi vắng tích lũy' } : { sapXep: true, cot2: 'Vắng mặt(Số buổi/Số tiết/Tỷ lệ)' });
            }
        });

        /* ---------- Quản trị: chọn cán bộ -------------------------------- */
        function chonGV(r) {
            gv = r.ID; gvTen = e(r.MASO) + ' - ' + e(r.HODEM) + ' ' + e(r.TEN);
            z('gvTen').textContent = '— ' + gvTen;
            L.xoaDanhDau();
            if (L.tuan) { L.reload(); taiKLCT(L.tuan.ngay); }
            taiDoiLich();
        }
        var dsCB = [];
        if (o.admin) {
            ums.ref.nhanSu({ dLaCanBoNgoaiTruong: -1, pageIndex: 1, pageSize: 1000000 }).then(function (d) {
                dsCB = d; pat.fill(f('cb'), d, { name: ums.ref.tenNhanSu });
            }).catch(function (err) { ums.api.handle(err, 'cán bộ'); });
            if (window.jQuery) jQuery(f('cb')).on('select2:select', function () {
                var r = dsCB.filter(function (x) { return x.ID === f('cb').value; })[0]; if (r) chonGV(r);
            });
            var timCB = function () {
                var k = f('macb').value.trim();
                if (!k) return;
                ums.api.call({ action: 'NS_ThongTinCanBo/LayTTGiangVienTheoTuKhoa', method: 'GET', strTuKhoa: k, strNguoiThucHien_Id: uid() })
                    .then(function (r) { var d = arr(r.data)[0]; if (d) chonGV(d); else ui.toast('Không tìm thấy cán bộ', 'warn'); })
                    .catch(function (err) { ums.api.handle(err, 'tìm cán bộ'); });
            };
            root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="timcb"]')) timCB(); });
            f('macb').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); timCB(); } });
        } else {
            ums.api.call({ action: 'NS_ThongTinCanBo/LayHocKyTheoLichCaNhan', method: 'GET', strNhanSu_HoSoCanBo_Id: uid(), silent: true })
                .then(function (r) { pat.fill(f('hk'), arr(r.data), { name: 'THOIGIAN' }); }).catch(function () {});
        }

        /* ---------- Danh sách lớp đổi lịch ------------------------------- */
        function taiDoiLich() { lg.doiLich.danhSach(z('doilich'), !!o.admin); }
        taiDoiLich();

        ums.report.mount(z('bc'), { collect: function (add) {
            var t = L.tuan || {};
            add('strNhanSu_HoSoCanBo_Id', gv); add('strNgayBatDau', e(t.batdau)); add('strNgayKetThuc', e(t.ketthuc));
            add('strHocKy_Id', f('hk') ? f('hk').value : '');
        } });
    };
})();
