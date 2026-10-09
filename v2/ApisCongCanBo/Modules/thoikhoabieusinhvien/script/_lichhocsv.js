/* =========================================================================
   Lịch học của MỘT sinh viên — khung dùng chung ums.tkbSV.mount(host, o)
     o.sv          { ID, MASO, HODEM, TEN } — có sẵn sinh viên (nhapdiem/inbangdiem mở hộp "Lịch học")
     o.timKiem     true = có ô "Mã sinh viên" để tra (màn thoikhoabieusinhvien/lichhoc, nhapdiem/lichhoc)
     o.nguoiDsLop  'sv' | 'canbo' — strNguoiThucHien_Id của LayDSDangKyHoc_2: bản thoikhoabieusinhvien gửi id
                   SINH VIÊN, bản nhapdiem gửi id CÁN BỘ (hai bản gốc chép nhau, lệch đúng chỗ này — chờ nghiệp vụ)
     o.reportText  chữ nút báo cáo ("Báo cáo" ở vỏ index)
   Dùng ở: thoikhoabieusinhvien/lichhoc (timKiem, 'sv'), nhapdiem/lichhoc (timKiem, 'canbo'),
   nhapdiem/inbangdiem hộp "Lịch học" (sv, 'canbo').
   Bản gốc: ApisCongCanBo/Modules/thoikhoabieusinhvien/html/lichhoc.html
            + script/lichgiang.js (một bản chép của lichgiang/script/lichgiang.js)
   Lịch tuần / lịch tháng: tầng chung ums.lich.
   ---------------------------------------------------------------------------
   Lời gọi (mã hoá trừ khi ghi GET):
       NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayTTNguoiHocTheoMaSo            ô "Mã sinh viên"
       SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LayDSLichCaNhan             lịch tuần (lịch học + lịch thi)
       SV_ThongTin_MH · PKG_CONGTHONGTIN_HSSV_THONGTIN.LayTKBLopKhongCoLichChiTiet  lớp không có lịch chi tiết
       SV_CamXuc_MH · pkg_dg_camxuc_nguoihoc.LayDSCamXuc / LayTTMacDinh / Tang_CamXuc / Giam_CamXuc / ThayDoi_CamXuc
       Bấm buổi học: NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayDSDangKyHoc_2 (strNguoiThucHien_Id theo o.nguoiDsLop)
                     "Lưu" → CC_ThongTin/Them_QLSV_NguoiHoc_TuGhiNhan (tự điểm danh, kèm IP)
       Bấm buổi thi: SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LayTTLichThi (strNgayDangChon = ngày thi)
   Mẫu báo cáo: strNhanSu_HoSoCanBo_Id (= id SINH VIÊN, như gốc), strNgayBatDau, strNgayKetThuc.

   Giữ như bản gốc (KIỂM TRÊN HOST): cảm xúc và tự điểm danh ghi với
   strNguoiThucHien_Id / IP của CÁN BỘ đang đăng nhập.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Chưa tra sinh viên: bản gốc lấy id CÁN BỘ làm id sinh viên để tải lịch →
       ở đây chờ tra xong mới tải.
     · Hộp buổi học: bản gốc lỗi JS khi sinh viên không có trong danh sách lớp
       (…find(…).SOBUOIVANG) — ở đây bỏ qua dòng vắng mặt.
     · Danh sách cảm xúc nạp chưa kịp thì bản gốc in chữ "undefined" vào ô.
     · (Sửa 2026-09-22) ảnh trong danh sách cảm xúc đọc cột DG_CHUCNANG_CHUDE_CHITIET_ANH (bản trước đọc nhầm ANH).
   Kéo gốc 30/9 (Cổng SV thoikhoabieu/lichgiang.js): bảng "Lớp học phần (không có lịch chi tiết)" đọc
     đúng tên cột máy chủ trả MALOP, TENLOP, TENHINHTHUCHOC, NGAYBATDAU, NGAYKETTHUC, GHICHU — gốc Cổng SV
     bỏ dãy tên dò. Ở đây tên thật đứng ĐẦU, dãy dò cũ giữ làm dự phòng (bản gốc Cổng cán bộ vẫn dò);
     trước đây dãy dò THIẾU TENHINHTHUCHOC nên cột "Hình thức học" luôn trống với dữ liệu thật.
     o.ngayNgan → ums.lich: đầu cột ngày chỉ hiện số ngày (Cổng SV bật; CCB không đổi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    ums.tkbSV = ums.tkbSV || {};
    ums.tkbSV.mount = function (root, o) {
    o = o || {};
    root.classList.add('tkb-sv');   // CSS thoikhoabieusinhvien/css/lichhoc.css bó theo lớp này
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function lay(r, ks) { for (var i = 0; i < ks.length; i++) { var v = r[ks[i]]; if (v !== null && v !== undefined && v !== '') return v; } return ''; }
    function gp(r) { return e(r.GIOBATDAU) + 'h' + e(r.PHUTBATDAU) + ' - ' + e(r.GIOKETTHUC) + 'h' + e(r.PHUTKETTHUC); }
    var EMO = '../assets/images/eval-emoji/', CX = 'SV_CamXuc_MH/';

    /* o.tieuDe   : chữ tiêu đề trang (mặc định: chỉ vẽ khi CHƯA biết sinh viên — hộp
                    thoại của In bảng điểm không cần tiêu đề; Cổng sinh viên thì cần)
       o.tenSV    : false → không hiện tên người học cạnh tiêu đề khung (chính chủ đang xem)
       o.klctTruoc: false → "Lịch cá nhân" đứng TRƯỚC "Lớp học phần (không có lịch chi tiết)"
                    như bản gốc Cổng sinh viên (mặc định true: thứ tự của Cổng cán bộ)
       o.import   : false → không dựng nút Import của mẫu báo cáo (màn không có vùng _Import)
       o.ngayNgan : true → đầu cột lịch tuần chỉ hiện số ngày, ngày đủ ở title (ums.lich) */
    var tuan = '<div' + (o.klctTruoc === false ? '' : ' class="ums-u-mt-4"') + '>' +
        pat.panel({ title: 'Lịch cá nhân', icon: 'fa-calendar-circle-user', count: 'svTen', zone: 'tuan',
            tools: o.timKiem ? '<input class="ums-input" data-f="masv" placeholder="Mã sinh viên" autocomplete="off" style="width:180px">' + ui.btn('search', { text: 'Tìm', attr: { 'data-a': 'timsv' } }) : '' }) + '</div>';
    var klct = '<div' + (o.klctTruoc === false ? ' class="ums-u-mt-4"' : '') + '>' +
        pat.panel({ title: 'Lớp học phần (không có lịch chi tiết)', icon: 'fa-users-rectangle', zone: 'klct', flush: true }) + '</div>';
    root.innerHTML =
        (o.tieuDe ? pat.page(o.tieuDe, '') : (o.sv ? '' : pat.page('Lịch cá nhân', ''))) +
        '<div class="tkb-trang"><div class="tkb-trang__chinh">' +
            (o.klctTruoc === false ? tuan + klct : klct + tuan) +
        '</div><aside class="tkb-trang__phu"><div data-z="thang"></div><div class="ums-u-mt-4" data-z="bc"></div></aside></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var sv = o.sv || null, dsCX = [];
    ums.api.call({ action: CX + 'DSA4BRICICwZNCIP', func: 'pkg_dg_camxuc_nguoihoc.LayDSCamXuc', strNgayGhiNhan: '', dGio: 0, dPhut: 0, dGiay: 0, strNguoiThucHien_Id: uid(), silent: true })
        .then(function (r) { dsCX = arr(r.data); }).catch(function () {});

    function taiKLCT(ngay) {
        if (!sv) { z('klct').innerHTML = ui.empty('Nhập mã sinh viên và chọn một ngày để xem các lớp học phần không có lịch chi tiết', 'fa-user-magnifying-glass'); return; }
        z('klct').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'SV_ThongTin_MH/DSA4FQoDDS4xCikuLyYCLg0oIikCKSgVKCQ1', func: 'PKG_CONGTHONGTIN_HSSV_THONGTIN.LayTKBLopKhongCoLichChiTiet',
            strQLSV_NguoiHoc_Id: sv.ID, strNgay: ngay, strNguoiThucHien_Id: uid() }).then(function (r) {
            ui.table({ el: z('klct'), stt: false, rows: arr(r.data), empty: 'Hiện tại chưa có lớp học phần (không có lịch chi tiết) nào', columns: [
                { title: 'Mã lớp', render: function (x) { return esc(lay(x, ['MALOP', 'MA_LOP', 'MA', 'MA_LOPHOCPHAN', 'LOP_MA'])); } },
                { title: 'Tên lớp', render: function (x) { return esc(lay(x, ['TENLOP', 'TEN_LOP', 'TEN', 'TENLOPHOCPHAN', 'LOP_TEN'])); } },
                { title: 'Hình thức học', render: function (x) { return esc(lay(x, ['TENHINHTHUCHOC', 'HINHTHUC_HOC', 'HINHTHUC', 'HINHTHUCHOC', 'HINH_THUC_HOC'])); } },
                { title: 'Ngày bắt đầu', cls: 'is-center is-nowrap', render: function (x) { return esc(lay(x, ['NGAYBATDAU', 'TU_NGAY', 'TUNGAY', 'NGAY_BAT_DAU'])); } },
                { title: 'Ngày kết thúc', cls: 'is-center is-nowrap', render: function (x) { return esc(lay(x, ['NGAYKETTHUC', 'DEN_NGAY', 'DENNGAY', 'NGAY_KET_THUC'])); } },
                { title: 'Ghi chú', render: function (x) { return esc(lay(x, ['GHICHU', 'GHI_CHU', 'NOTE', 'GHICHU_TEN'])); } }
            ] });
        }).catch(function (err) { z('klct').innerHTML = ui.fail(err.message); });
    }

    function cxThan(r) {
        return '<div class="tkb-cx" data-cxr="' + esc(r.ID) + '"><button type="button" data-cxa="giam" title="Giảm"><i class="fa-light fa-minus"></i></button>' +
            '<span class="tkb-cx__chinh"><img alt="" data-cxm src="' + EMO + '1.png"><b data-cxn></b></span>' +
            '<button type="button" data-cxa="tang" title="Tăng"><i class="fa-light fa-plus"></i></button>' +
            '<span class="tkb-cx__ds">' + dsCX.map(function (c) { return '<button type="button" data-cxa="doi" data-cxid="' + esc(c.ID) + '"><img alt="" src="' + esc(EMO + e(c.DG_CHUCNANG_CHUDE_CHITIET_ANH || c.ANH)) + '"></button>'; }).join('') + '</span></div>';
    }
    function noiDung(r) {
        var thi = r.PHANLOAI === 'LICHTHI';
        return '<b>' + (thi ? 'Lịch thi: ' : '') + esc(e(r.TENHOCPHAN)) + '</b><span class="ums-ltuan__tg">' + esc(ums.lich.khungGio(r)) + ' (' +
            esc(thi ? e(r.CATHI) : 'Tiết ' + e(r.TIETBATDAU) + '-' + e(r.TIETKETTHUC)) + ')</span><div>' +
            [r.TENLOPHOCPHAN, r.TENPHONGHOC, r.GIANGVIEN].filter(function (x) { return e(x) !== ''; }).map(esc).join('<br>') + '</div>' + cxThan(r);
    }
    function cxChung(r) {
        return { strDiem_DanhSachHoc_Id: e(r.IDLOPHOCPHAN), strNgayGhiNhan: e(r.NGAYHOC), dGio: e(r.GIOBATDAU), dPhut: e(r.PHUTBATDAU), dGiay: 0, strNguoiThucHien_Id: uid() };
    }
    function cxMacDinh(r, host) {
        ums.api.call(Object.assign({ action: CX + 'DSA4FRUMICIFKC8p', func: 'pkg_dg_camxuc_nguoihoc.LayTTMacDinh', silent: true }, cxChung(r))).then(function (x) {
            var d = arr(x.data)[0] || {}, box = host.querySelector('[data-cxr="' + r.ID + '"]');
            if (!box) return;
            box.setAttribute('data-cxmd', e(d.ID));
            if (d.DG_CHUCNANG_CHUDE_CHITIET_ANH) box.querySelector('[data-cxm]').src = EMO + d.DG_CHUCNANG_CHUDE_CHITIET_ANH;
            box.querySelector('[data-cxn]').textContent = e(d.SOLUONG);
        }).catch(function () {});
    }
    var L = ums.lich.tao({
        thang: z('thang'), tuan: z('tuan'), mau: 'IDLOPHOCPHAN', noiDung: noiDung, ngayNgan: o.ngayNgan,
        onChon: function (t) { taiKLCT(t.ngay); },
        load: function (t) {
            if (!sv) return Promise.resolve([]);
            return ums.api.call({ action: 'SV_ThongTin_MH/DSA4BRINKCIpAiAPKSAv', func: 'pkg_congthongtin_hssv_thongtin.LayDSLichCaNhan',
                strQLSV_NguoiHoc_Id: sv.ID, strNgayBatDau: t.batdau, strNgayKetThuc: t.ketthuc }).then(function (r) { return arr(r.data); });
        },
        empty: 'Nhập mã sinh viên để xem lịch',
        sauKhiVe: function (ds, host) { ds.forEach(function (r) { cxMacDinh(r, host); }); },
        onClick: function (r, t) {
            var cx = t.closest('[data-cxa]');
            if (cx) {
                var box = cx.closest('[data-cxr]'), a = cx.getAttribute('data-cxa');
                var id = a === 'doi' ? cx.getAttribute('data-cxid') : box.getAttribute('data-cxmd');
                var FN = { tang: ['FSAvJh4CICwZNCIP', 'Tang_CamXuc'], giam: ['BiggLB4CICwZNCIP', 'Giam_CamXuc'], doi: ['FSkgOAUuKB4CICwZNCIP', 'ThayDoi_CamXuc'] }[a];
                ums.api.call(Object.assign({ action: CX + FN[0], func: 'pkg_dg_camxuc_nguoihoc.' + FN[1], strDG_ChucNang_ChuDe_CT_Id: e(id), strDaoTao_ChuongTrinh_Id: '' }, cxChung(r)))
                    .then(function () { cxMacDinh(r, z('tuan')); }).catch(function (err) { ums.api.handle(err, 'cảm xúc'); });
                return;
            }
            if (r.PHANLOAI === 'LICHTHI') lichThi(r); else buoiHoc(r);
        }
    });

    function buoiHoc(r) {
        var tieuDe = 'Học phần: ' + e(r.TENHOCPHAN) + ' - ' + ums.lich.khungGio(r) + ' (Tiết ' + e(r.TIETBATDAU) + '-' + e(r.TIETKETTHUC) + ') ' + e(r.THONGTINCHUYENCAN);
        var dlg = ui.dialog({ title: tieuDe, icon: 'fa-clipboard-user', size: 'lg',
            body: '<div class="ums-row ums-row--between ums-u-mb-2"><span><b>Lớp: ' + esc(e(r.TENLOPHOCPHAN)) + '</b> (Phòng học: ' + esc(e(r.TENPHONGHOC)) + ')</span>' +
                '<span class="ums-row"><span class="ums-u-fz13 ums-u-muted">Từ khóa điểm danh</span><input class="ums-input ums-input--sm" data-lh="tk" style="width:160px" autocomplete="off">' +
                ui.btn('save', { cls: 'ums-btn--sm', attr: { 'data-lh': 'luu' } }) + '</span></div><div class="ums-u-fz13 ums-u-mb-2" data-lh="vang"></div><div data-lh="bang"></div>' });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-lh="' + k + '"]'); }
        ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4BRIFIC8mCjgJLiIecwPP', func: 'pkg_congthongtincanbo.LayDSDangKyHoc_2', strTuKhoa: '', strNgayGhiNhan: e(r.NGAYHOC),
            dGio: e(r.GIOBATDAU), dPhut: e(r.PHUTBATDAU), dGiay: 0, strReport_Id: '', strDaoTao_LopHocPhan_Id: e(r.IDLOPHOCPHAN), strNguoiThucHien_Id: o.nguoiDsLop === 'canbo' ? uid() : sv.ID }).then(function (x) {
            var ds = arr(x.data);
            ui.table({ el: q('bang'), rows: ds, empty: 'Lớp chưa có sinh viên', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' }] });
            var me = ds.filter(function (s) { return s.QLSV_NGUOIHOC_ID === sv.ID; })[0];
            q('tk').value = me ? e(me.MATLENHNGUOIHOC) : '';
            if (me && me.SOBUOIVANG) q('vang').innerHTML = 'Vắng mặt(Số buổi/Số tiết/Tỷ lệ): <b>' + esc(me.SOBUOIVANG) + '</b>';
        }).catch(function (err) { q('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp'); });
        B.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-lh="luu"]')) return;
            ums.api.call({ action: 'CC_ThongTin/Them_QLSV_NguoiHoc_TuGhiNhan', method: 'POST', strDaoTao_LopQuanLy_Id: '', strDiem_DanhSach_Id: e(r.IDLOPHOCPHAN),
                strNgayGhiNhan: e(r.NGAYHOC), strGio: e(r.GIOBATDAU), strPhut: e(r.PHUTBATDAU), strGiay: 0, strIp: (ums.session && ums.session.clientIP) || '',
                strNoiDungTuGhiNhan: q('tk').value.trim(), strNguoiThucHien_Id: uid(), strQLSV_NguoiHoc_Id: sv.ID, strDaoTao_ChuongTrinh_Id: '', strQLSV_TrangThaiNguoiHoc_Id: '' })
                .then(function () { ui.toast('Thực hiện thành công!', 'ok'); }).catch(function (err) { ums.api.handle(err, 'tự điểm danh'); });
        });
    }
    function lichThi(r) {
        var dlg = ui.dialog({ title: 'Chi tiết lịch thi', icon: 'fa-calendar-check', size: 'lg',
            body: '<div class="ums-u-mb-2">Học phần thi: <b>' + esc(e(r.TENHOCPHAN)) + '</b></div>' +
                '<div class="ums-grid ums-grid--4 ums-u-mb-4">' +
                    [['Hình thức thi', r.DANGKY_LOPHOCPHAN_TEN], ['Phòng thi', r.PHONGHOC_TEN], ['Ngày thi', r.NGAYHOC], ['Giờ thi', gp(r)]].map(function (x) {
                        return '<div class="ums-kv"><span>' + esc(x[0]) + '</span><b>' + esc(e(x[1])) + '</b></div>'; }).join('') + '</div>' +
                '<div class="ums-legend">Lịch thi trong tháng</div><div data-lt="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        ums.api.call({ action: 'SV_ThongTin_MH/DSA4FRUNKCIpFSko', func: 'pkg_congthongtin_hssv_thongtin.LayTTLichThi', strQLSV_NguoiHoc_Id: sv.ID, strNgayDangChon: e(r.NGAYHOC) })
            .then(function (x) {
                ui.table({ el: dlg.body.querySelector('[data-lt="bang"]'), rows: arr(x.data), empty: 'Không có lịch thi', columns: [
                    { title: 'Hình thức thi', prop: 'DANGKY_LOPHOCPHAN_TEN' }, { title: 'Ngày thi', prop: 'NGAYHOC', cls: 'is-center is-nowrap' },
                    { title: 'Giờ thi', cls: 'is-center is-nowrap', render: function (t) { return esc(gp(t)); } }, { title: 'Phòng thi', prop: 'PHONGHOC_TEN' },
                    { title: 'Học phần thi', prop: 'TENHOCPHAN' }] });
            }).catch(function (err) { dlg.body.querySelector('[data-lt="bang"]').innerHTML = ui.fail(err.message); });
    }

    function timSV() {
        var k = f('masv').value.trim();
        if (!k) { ui.toast('Nhập mã sinh viên', 'warn'); return; }
        ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4FRUPJjQuKAkuIhUpJC4MIBIu', func: 'pkg_congthongtincanbo.LayTTNguoiHocTheoMaSo', strTuKhoa: k, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var d = arr(r.data)[0];
                if (!d) { ui.toast('Không tìm thấy sinh viên', 'warn'); return; }
                sv = d;
                z('svTen').textContent = '— ' + e(d.MASO) + ' - ' + e(d.HODEM) + ' ' + e(d.TEN);
                L.xoaDanhDau();
                L.reload();
                if (L.tuan) taiKLCT(L.tuan.ngay);
            }).catch(function (err) { ums.api.handle(err, 'tìm sinh viên'); });
    }
    if (o.timKiem) {
        root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="timsv"]')) timSV(); });
        f('masv').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); timSV(); } });
    }
    if (sv && o.tenSV !== false) z('svTen').textContent = '— ' + e(sv.MASO) + ' - ' + e(sv.HODEM) + ' ' + e(sv.TEN);
    /* Đã biết sinh viên thì khung lớp chờ người dùng chọn NGÀY (bản gốc cũng vậy);
       chưa biết thì vẽ lời nhắc "Nhập mã sinh viên…" */
    if (!sv) taiKLCT('');
    else z('klct').innerHTML = ui.empty('Chọn một ngày trên lịch để xem các lớp học phần không có lịch chi tiết', 'fa-calendar-day');
    ums.report.mount(z('bc'), { reportText: o.reportText, import: o.import, collect: function (add) {
        var t = L.tuan || {};
        add('strNhanSu_HoSoCanBo_Id', sv ? sv.ID : ''); add('strNgayBatDau', e(t.batdau)); add('strNgayKetThuc', e(t.ketthuc));
    } });
    };
})();
