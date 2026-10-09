/* =========================================================================
   Xem điểm sinh viên (Xét tốt nghiệp)
   Bản gốc: ApisTotNghiep/Modules/hoctap/html/xemdiem_sv.html + script/xemdiem_sv.js
   Trang gọn xem bảng điểm MỘT sinh viên, gốc nhúng trong khung của màn Thực hiện xét
   (kehoach/thuchienxet.js đặt window._embeddedSinhVien_Id rồi loadPage). Không có trên menu host.
   ---------------------------------------------------------------------------
   Bố cục gốc (một cột): thẻ thông tin (Họ tên, Mã số, Ngày sinh, Giới tính, Lớp, Trạng thái)
   → thẻ tổng (6 số) → mỗi năm học - học kỳ một khối bảng điểm (mới nhất lên trên).
   Ở đây: khung "Thông tin sinh viên" (.ums-kv ba cột) + khối "Tổng điểm" = ums.diemHoc.veTongKet
   (đúng sáu mục, cùng cột của gốc); khung bảng điểm = ums.diemHoc.veBangDiem (cùng 10 cột,
   không cột Chi tiết — gốc không có hộp điểm thành phần).

   Lời gọi (chép nguyên, mã hoá):
     SV_ThongTin_MH/CiQ1EDQgCS4iFSAxAiAPKSAv · pkg_congthongtin_hssv_thongtin.KetQuaHocTapCaNhan
       POST: strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id = '', strNguoiThucHien_Id = id người học,
             strChucNangHeThong_Id = strVaiTroDangNhap_Id = ID vai trò "Cổng sinh viên" (vai trò
             CHOPHEPTHUVAI = 1 trong danh sách vai trò; không có thì ID viết cứng của gốc
             80CF9E16C2D74F46A1ECE73B7C119A8F) — gói chỉ nhận vai trò Cổng SV (ORA-24338 nếu để
             vai trò Tốt nghiệp), theo ghi chú của gốc.
       Đọc: rsThongTinNguoiHoc[0], rsDiemTrungBinhChung, rsDiemKetThucHocPhan.

   Dùng lại (màn Thực hiện xét):  ums.tnXemDiem.mount(host, { nguoiHocId }) → { destroy }
   Mở thẳng màn: id người học lấy ums.state.tnXemDiemSV, rồi window._embeddedSinhVien_Id (như gốc);
   không có thì báo "Không xác định được sinh viên." như gốc.

   Khác gốc:
     · strChucNang_Id: gốc gửi rỗng; api.js tự điền id chức năng đang mở khi tham số rỗng.
     · Mỗi khối học kỳ có thêm dòng tổng kết học kỳ (khối chung của ums.diemHoc, đọc chính
       rsDiemTrungBinhChung đã trả về — không thêm lời gọi).
     · Cột "Đánh giá" không tô xanh / đỏ (bảng điểm chung không tô); số thiếu hiện "..." thay "--".
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums;
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var APP_SV = '80CF9E16C2D74F46A1ECE73B7C119A8F';     // ID viết cứng của gốc (lấy từ nhật ký máy chủ)

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function vaiTroSV() {
        var r = ((ums.state && ums.state.roles) || []).filter(function (x) { return x.thuVai; })[0];
        return (r && r.id) || APP_SV;
    }

    function mount(host, o) {
        o = o || {};
        var nh = o.nguoiHocId || '';
        if (!nh) {
            host.innerHTML = pat.panel({ title: 'Thông tin sinh viên', icon: 'fa-user-graduate',
                body: ui.empty('Không xác định được sinh viên. Trang này mở từ màn Thực hiện xét tốt nghiệp.', 'fa-circle-info') });
            return { destroy: function () { host.innerHTML = ''; } };
        }
        host.innerHTML =
            pat.panel({ title: 'Thông tin sinh viên', icon: 'fa-user-graduate',
                body: '<div class="ums-grid ums-grid--3" data-x="tt"></div>' +
                      '<div class="ums-legend ums-u-mt-4">Tổng điểm</div><div class="ums-dh__tk ums-dh__tk--ky" data-x="tong"></div>' }) +
            '<div class="ums-u-mt-4">' + pat.panel({ title: 'Bảng điểm theo học kỳ', icon: 'fa-book',
                body: '<div data-x="bd">' + ui.empty('Đang tải bảng điểm…', 'fa-spinner fa-spin') + '</div>' }) + '</div>';
        function q(k) { return host.querySelector('[data-x="' + k + '"]'); }
        var bd = q('bd');

        function veThongTin(sv) {
            var muc = [['Họ tên', e(sv.QLSV_NGUOIHOC_HODEM) + ' ' + e(sv.QLSV_NGUOIHOC_TEN)], ['Mã số', sv.QLSV_NGUOIHOC_MASO],
                ['Ngày sinh', sv.QLSV_NGUOIHOC_NGAYSINH], ['Giới tính', sv.QLSV_NGUOIHOC_GIOITINH],
                ['Lớp', sv.DAOTAO_LOPQUANLY_TEN], ['Trạng thái', sv.QLSV_TRANGTHAINGUOIHOC_TEN]];
            // Ba cột, mỗi cột hai dòng; chỉ Họ tên in đậm (dòng đầu cột 1)
            q('tt').innerHTML = [0, 1, 2].map(function (c) {
                return '<div>' + [muc[c * 2], muc[c * 2 + 1]].map(function (m, i) {
                    return '<div class="ums-kv' + (c || i ? ' ums-kv--thuong' : '') + '"><span>' + esc(m[0]) + '</span><b>' +
                        esc(e(m[1]).trim()) + '</b></div>';
                }).join('') + '</div>';
            }).join('');
        }
        function veTong(tb) {
            // findVal của gốc: dòng toàn khoá (không thời gian), lần tính 0
            ums.diemHoc.veTongKet(q('tong'), function (loai, thang, truong) {
                var x = tb.filter(function (y) {
                    return !y.DAOTAO_THOIGIANDAOTAO_ID && y.LOAIDIEMTRUNGBINH_MA === loai &&
                        Number(y.THUOCTINHLANTINH) === 0 && String(y.THANGDIEM_MA) === String(thang);
                })[0];
                return x && x[truong] !== null && x[truong] !== undefined ? x[truong] : '...';
            });
        }
        function veBang(rows, tb) {
            if (!rows.length) { bd.innerHTML = ui.empty('Chưa có điểm học phần.', 'fa-file-circle-xmark'); return; }
            // Năm giảm dần, kỳ giảm dần (mới nhất lên trên) như gốc — veBangDiem nhóm theo thứ tự gặp
            rows = rows.slice().sort(function (a, b) {
                if (e(a.NAMHOC) !== e(b.NAMHOC)) return e(b.NAMHOC).localeCompare(e(a.NAMHOC));
                return (parseInt(b.HOCKY, 10) || 0) - (parseInt(a.HOCKY, 10) || 0);
            });
            ums.diemHoc.veBangDiem(bd, rows, tb, { chiTiet: false });
        }

        var vt = vaiTroSV();
        ums.api.call({
            action: 'SV_ThongTin_MH/CiQ1EDQgCS4iFSAxAiAPKSAv',
            func: 'pkg_congthongtin_hssv_thongtin.KetQuaHocTapCaNhan',
            silent: true,
            strChucNangHeThong_Id: vt, strVaiTroDangNhap_Id: vt,
            strQLSV_NguoiHoc_Id: nh, strDaoTao_ChuongTrinh_Id: '', strNguoiThucHien_Id: nh
        }).then(function (r) {
            var d = r.data && !Array.isArray(r.data) ? r.data : {};
            var tb = Array.isArray(d.rsDiemTrungBinhChung) ? d.rsDiemTrungBinhChung : [];
            var sv = (d.rsThongTinNguoiHoc || [])[0];
            if (sv) veThongTin(sv);
            veTong(tb);
            veBang(Array.isArray(d.rsDiemKetThucHocPhan) ? d.rsDiemKetThucHocPhan : [], tb);
        }).catch(function (err) {
            bd.innerHTML = ui.fail('Lỗi: ' + (err.message || 'Không tải được bảng điểm.'));
            ums.api.handle(err, 'bảng điểm');
        });
        return { destroy: function () { host.innerHTML = ''; } };
    }

    ums.tnXemDiem = { mount: mount };

    var root = document.getElementById('tn-xemdiem-sv');
    if (!root) return;
    root.innerHTML = pat.page('Xem điểm sinh viên') + '<div data-x="than"></div>';
    mount(root.querySelector('[data-x="than"]'), { nguoiHocId: (ums.state && ums.state.tnXemDiemSV) || window._embeddedSinhVien_Id || '' });
})();
