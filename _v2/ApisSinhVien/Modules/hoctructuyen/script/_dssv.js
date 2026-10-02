/* =========================================================================
   _dssv.js — phần dùng chung của module "Học trực tuyến" (phân hệ Sinh viên)
   Dùng ở: thongtindayhoc, giangviendayhoc.
   ---------------------------------------------------------------------------
   Hai màn gốc chép y hệt nhau khối "Danh sách sinh viên" (#zoneEdit, thay chỗ danh sách chính bằng
   edu.util.toggle_overide): bấm "Chi tiết" một lớp học phần → bảng SINH VIÊN × NGÀY HỌC, mỗi ô là giờ
   người học vào lớp trực tuyến của buổi đó.
     SV_LopHoc_Chung/LayDSNgayHocTheoLop   (GET, strDangKy_LopHocPhan_Id) → các buổi (ID, THU, NGAY, GIO, PHUT) = cột
     SV_LopHoc_Chung/LayDSSVTheoLop        (GET, strDangKy_LopHocPhan_Id) → người học (QLSV_NGUOIHOC_ID/MASO/HODEM/TEN)
     SV_LopHoc_Chung/LayKQVaoHocCuaNguoiHoc (GET, strQLSV_NguoiHoc_Id '' — gốc đọc ô dropAAAA không có,
                                            strHoTroHoc_LopHoc_Lich_Id = từng buổi) → NGAYVAO GIOVAO:PHUTVAO:GIAYVAO
   Gốc gọi LayKQ… cho MỌI buổi cùng lúc rồi tự gắn vào ô theo id <div>; ở đây cũng gọi cùng lúc nhưng gom đủ
   kết quả rồi mới vẽ bảng một lần.
   ---------------------------------------------------------------------------
     ums.svHttt.buoi(r)        chữ "Thứ …, ngày …, Gh:M" của một buổi / dòng lịch (gốc viết lặp 4 chỗ)
     ums.svHttt.dsSV(host, lopId, onDong)   vẽ khung "Danh sách sinh viên" vào host (nút Đóng ở đầu khung)
     ums.svHttt.homNay()       ngày hôm nay dd/mm/yyyy (edu.util.dateToday)
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var H = ums.svHttt = {};
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: 'SV_LopHoc_Chung/' + a, method: 'GET' }, o)).then(function (r) { return arr(r.data); }); }

    H.buoi = function (r) {
        return 'Thứ ' + e(r.THU) + ', ngày ' + e(r.NGAY) + ', ' + e(r.GIO) + 'h:' + e(r.PHUT);
    };
    H.homNay = function () {
        var d = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
    };

    H.dsSV = function (host, lopId, onDong) {
        host.innerHTML = pat.panel({ title: 'Danh sách sinh viên', icon: 'fa-users', flush: true, zone: 'dssv',
            tools: ui.btn('close', { attr: { 'data-dssv': 'dong' } }) });
        var z = host.querySelector('[data-z="dssv"]');
        z.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        host.onclick = function (ev) { if (ev.target.closest('[data-dssv="dong"]') && onDong) onDong(); };

        var ngay = [];
        get('LayDSNgayHocTheoLop', { strDangKy_LopHocPhan_Id: lopId }).then(function (d) {
            ngay = d;
            return get('LayDSSVTheoLop', { strDangKy_LopHocPhan_Id: lopId });
        }).then(function (sv) {
            var kq = {};                                   // kq[svId + '|' + buoiId] = chữ giờ vào
            return Promise.all(ngay.map(function (b) {
                return get('LayKQVaoHocCuaNguoiHoc', { strQLSV_NguoiHoc_Id: '', strHoTroHoc_LopHoc_Lich_Id: b.ID, silent: true }).then(function (rs) {
                    rs.forEach(function (j) {
                        if (j.NGAYVAO) kq[j.QLSV_NGUOIHOC_ID + '|' + b.ID] = 'Ngày ' + e(j.NGAYVAO) + ' ' + e(j.GIOVAO) + ':' + e(j.PHUTVAO) + ':' + e(j.GIAYVAO);
                    });
                }, function () { /* gốc: lỗi một buổi chỉ ghi console, các buổi khác vẫn hiện */ });
            })).then(function () {
                ui.table({
                    el: z, rows: sv, empty: 'Lớp chưa có sinh viên',
                    columns: [
                        { title: 'Mã sinh viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                        { title: 'Họ và tên', render: function (s) { return ui.esc(e(s.QLSV_NGUOIHOC_HODEM) + ' ' + e(s.QLSV_NGUOIHOC_TEN)); } }
                    ].concat(ngay.map(function (b) {
                        return { title: H.buoi(b), cls: 'is-center', render: function (s) { return ui.esc(kq[s.QLSV_NGUOIHOC_ID + '|' + b.ID] || ''); } };
                    }))
                });
            });
        }).catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
    };
})();
