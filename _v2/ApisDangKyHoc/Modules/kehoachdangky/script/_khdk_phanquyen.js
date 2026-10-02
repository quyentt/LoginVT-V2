/* =========================================================================
   Kế hoạch đăng ký — vùng "Phân quyền cán bộ" (#zonePhanQuyen của bản gốc)
   Bản gốc: script/kehoachdangky.js — getList_ThanhVien, genTable_ThanhVien,
            genHTML_NhanSu, removeHTML_NhanSu, save_ThanhVien, delete_ThanhVien;
            nút .btnSearchTTS_NhanSu → edu.extend.genModal_NhanSu (ums.pat.pickNhanSu).
   ---------------------------------------------------------------------------
   ums.khdk.phanQuyen(host, { onClose }) → { mo(dongKeHoach) }

   Lời gọi (chép nguyên, kiểu cũ — không mã hoá):
       DKH_KeHoach_NhanSu/LayDSDangKy_KeHoach_NhanSu   GET  type 'GET' · strTuKhoa '' · strVaiTro_Id '' ·
                                                            strNguoiDung_Id '' (gốc đọc #txtAAAA / #dropAAAA — không có) ·
                                                            pageIndex 1 · pageSize 100000
       DKH_KeHoach_NhanSu/Them_DangKy_KeHoach_NhanSu   POST type 'POST' · strId '' · strNguoiDung_Id = ID nhân sự ·
       DKH_KeHoach_NhanSu/Sua_DangKy_KeHoach_NhanSu         strId = ID dòng · strVaiTro_Id '' ·
                                                            dKhongKiemTraSoTinChiToiDa / dKhongKiemTraSTCToiThieu /
                                                            dKhongKiemTraTTHocPhi / dKhongKiemTraSiSo = chữ trong 4 ô (rỗng → '')
       DKH_KeHoach_NhanSu/Xoa_DangKy_KeHoach_NhanSu    POST strIds = ID dòng
   Cột đọc: ID, NGUOIDUNG_ID, NGUOIDUNG_TAIKHOAN, KHONGKIEMTRASOTINCHITOIDA,
            KHONGKIEMTRASOTINCHITOITHIEU, KHONGKIEMTRATINHTRANGHOCPHI, KHONGKIEMTRASISOTOIDA.

   Khác gốc (sửa lỗi):
     · Lưu xong nạp lại danh sách — gốc không nạp lại nên dòng vừa thêm vẫn không có
       ID, bấm Lưu lần hai là THÊM TRÙNG. Gốc mỗi dòng một thông báo; ở đây ums.ui.batch.
     · Chống chọn trùng: gốc so ID nhân sự với mảng chứa ID DÒNG (arrNhanSu_Id nạp
       data[i].ID) nên người đã có trong kế hoạch vẫn thêm được lần nữa. Nay so theo
       NGUOIDUNG_ID.
     · Tiêu đề vùng ghi tên kế hoạch (gốc có #lblKeHoach nhưng không nơi nào đổ).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var K = ums.khdk = ums.khdk || {};
    function e(v) { return v === undefined || v === null ? '' : v; }

    var O = [
        ['tcToiDa', 'KHONGKIEMTRASOTINCHITOIDA', 'dKhongKiemTraSoTinChiToiDa', 'Không cần kiểm tra số tín chỉ tối đa'],
        ['tcToiThieu', 'KHONGKIEMTRASOTINCHITOITHIEU', 'dKhongKiemTraSTCToiThieu', 'Không cần kiểm tra số tín chỉ tối thiểu'],
        ['hocPhan', 'KHONGKIEMTRATINHTRANGHOCPHI', 'dKhongKiemTraTTHocPhi', 'Không cần kiểm tra học phần'],
        ['siSo', 'KHONGKIEMTRASISOTOIDA', 'dKhongKiemTraSiSo', 'Không cần kiểm tra sĩ số tối đa']
    ];

    K.phanQuyen = function (host, o) {
        o = o || {};
        var khId = '', rows = [];

        host.innerHTML = ums.pat.panel({
            title: 'Kế hoạch đăng ký', icon: 'fa-user-gear', flush: true,
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('add', { text: 'Thêm thành viên', mod: 'out-primary', attr: { 'data-a': 'them' } }) +
                                      ui.btn('save', { attr: { 'data-a': 'luu' } }),
            body: '<div class="ums-legend khdk-pq-legend">Phân quyền cán bộ</div><div data-z="t"></div>'
        });
        var tbl = host.querySelector('[data-z="t"]');
        var title = host.querySelector('.ums-panel__title');

        function ve() {
            ui.table({
                el: tbl, rows: rows, stt: false, empty: 'Không tìm thấy dữ liệu!',
                columns: [{ title: '#', cls: 'is-center', width: '56px', render: function (r, i) { return r.ID ? i + 1 : '--'; } },
                          { title: 'Người dùng', render: function (r) { return esc(r.ten); } }]
                    .concat(O.map(function (c) {
                        return { title: c[3], cls: 'is-center', render: function (r, i) {
                            return '<input class="ums-input ums-input--sm khdk-o" data-o="' + c[0] + '" data-i="' + i + '" value="' + esc(r[c[0]]) + '">';
                        } };
                    }))
                    .concat([{ title: 'Xóa', cls: 'is-center', width: '64px', render: function (r, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="xoa" data-i="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                    } }])
            });
        }
        tbl.addEventListener('input', function (ev) {
            var t = ev.target;
            if (!t.matches('input[data-o]')) return;
            var r = rows[Number(t.getAttribute('data-i'))];
            if (r) r[t.getAttribute('data-o')] = t.value;
        });

        function nap() {
            tbl.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({
                action: 'DKH_KeHoach_NhanSu/LayDSDangKy_KeHoach_NhanSu', method: 'GET', type: 'GET',
                strTuKhoa: '', strDangKy_KeHoachDangKy_Id: khId, strVaiTro_Id: '', strNguoiDung_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                rows = (Array.isArray(r.data) ? r.data : []).map(function (d) {
                    var x = { ID: d.ID, NGUOIDUNG_ID: d.NGUOIDUNG_ID, ten: e(d.NGUOIDUNG_TAIKHOAN) };
                    O.forEach(function (c) { x[c[0]] = e(d[c[1]]); });
                    return x;
                });
                ve();
            }).catch(function (err) { tbl.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phân quyền cán bộ'); });
        }

        function them() {
            ums.pat.pickNhanSu({
                title: 'Tìm kiếm nhân sự',
                onPick: function (list) {
                    var trung = [];
                    list.forEach(function (ns) {
                        var co = rows.some(function (r) { return String(r.NGUOIDUNG_ID) === String(ns.ID); });
                        if (co) { trung.push(ns.HOTEN || ns.MASO); return; }
                        var x = { ID: '', NGUOIDUNG_ID: ns.ID, ten: e(ns.HOTEN) + ' - ' + e(ns.MASO) };
                        O.forEach(function (c) { x[c[0]] = ''; });
                        rows.push(x);
                    });
                    if (trung.length) ui.toast('Đã tồn tại: ' + trung.join(', '), 'warn');
                    ve();
                }
            });
        }

        function xoa(i) {
            var r = rows[i];
            if (!r) return;
            if (!r.ID) { rows.splice(i, 1); ve(); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({
                    action: 'DKH_KeHoach_NhanSu/Xoa_DangKy_KeHoach_NhanSu', method: 'POST',
                    strIds: r.ID, strNguoiThucHien_Id: ''
                }).then(function () { ui.toast('Xóa thành công!', 'ok'); nap(); })
                  .catch(function (err) { ums.api.handle(err, 'xoá phân quyền cán bộ'); });
            });
        }

        function luu() {
            if (!rows.length) { ui.toast('Chưa có thành viên nào để lưu.', 'warn'); return; }
            ui.batch(rows.map(function (r) {
                var c = {
                    action: r.ID ? 'DKH_KeHoach_NhanSu/Sua_DangKy_KeHoach_NhanSu' : 'DKH_KeHoach_NhanSu/Them_DangKy_KeHoach_NhanSu',
                    method: 'POST', type: 'POST',
                    strId: r.ID || '',
                    strDangKy_KeHoachDangKy_Id: khId,
                    strNguoiDung_Id: r.NGUOIDUNG_ID,
                    strVaiTro_Id: ''
                };
                O.forEach(function (x) { c[x[2]] = (r[x[0]] === undefined || r[x[0]] === null) ? '' : String(r[x[0]]); });
                c.strNguoiThucHien_Id = '';
                return c;
            }), { title: 'Đang lưu phân quyền cán bộ', okText: 'Thực hiện thành công', show: true }).then(nap);
        }

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !host.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'them') them();
            else if (a === 'luu') luu();
            else if (a === 'xoa') xoa(Number(b.getAttribute('data-i')));
            else if (a === 'dong' && o.onClose) o.onClose();
        });

        return {
            mo: function (kh) {
                khId = kh.ID;
                title.innerHTML = '<i class="fa-light fa-user-gear"></i> Kế hoạch đăng ký ' + esc(kh.TENKEHOACH ? '— ' + kh.TENKEHOACH : '');
                rows = [];
                nap();
            }
        };
    };
})();
