/* =========================================================================
   Xác nhận kê khai — Đề tài sinh viên (ApisNCKH). Khung ums.nckhHDxn.man (_hd_xacnhan.js).
   Bản gốc: ApisNCKH/Modules/xacnhankekhai/script/detaisinhvien.js
   Lời gọi (chép nguyên):
     NCKH_SP_QuanLyDeTaiSinhVien/LayDanhSach GET strTuKhoa, strDaoTao_CoCauToChuc_Id = strDonViCuaThanhVien_Id = đơn vị,
       strThanhVien_Id, strXepLoai_Id (ô xếp loại không có trên màn gốc → ''), strNguoiThucHien_Id '',
       strTinhTrangXacNhan_Id, phân trang máy chủ
     NCKH_SP_NguonKinhPhi/LayDanhSach · NCKH_SP_QLDTSV_GiangVien/LayDanhSach · NCKH_SP_QLDTSV_SinhVien/LayDanhSach
       (strNCKH_SP_SinhVien_DeTai_Id) — khung chi tiết
   Nút xác nhận: NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung.
   Lỗi gốc đã sửa: hai cột "Giảng viên hướng dẫn" / "Sinh viên thực hiện" của bảng gốc đổ NHẦM NAMNGHIEMTHU → nay nạp
   tên theo từng dòng đang hiện (hai lời gọi danh sách GV / SV của khung chi tiết, tối đa 4 lời gọi cùng lúc).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nckh-xnkk-detaisinhvien');
    if (!root) return;
    var X = ums.nckhHDxn, ui = ums.ui, e = X.e, esc = ui.esc;
    function gv(id) { return X.g('NCKH_SP_QLDTSV_GiangVien/LayDanhSach', { strNCKH_SP_SinhVien_DeTai_Id: id }); }
    function sv(id) { return X.g('NCKH_SP_QLDTSV_SinhVien/LayDanhSach', { strNCKH_SP_SinhVien_DeTai_Id: id }); }
    var luot = 0;

    X.man(root, {
        tieuDe: 'Đề tài sinh viên', dsTieuDe: 'Đề tài sinh viên', ctl: 'NCKH_SP_QuanLyDeTaiSinhVien', paged: true, nut: 'nguoiDung',
        tenCot: 'Tên đề tài', ten: function (r) { return e(r.TENDETAI); },
        ds: function (f) {
            return { strTuKhoa: f.q, strDaoTao_CoCauToChuc_Id: f.dv, strDonViCuaThanhVien_Id: f.dv, strThanhVien_Id: f.tv, strXepLoai_Id: '',
                strNguoiThucHien_Id: '', strTinhTrangXacNhan_Id: f.tt };
        },
        cot: [
            { title: 'Năm nghiệm thu', prop: 'NAMNGHIEMTHU', cls: 'is-center' },
            { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' },
            { title: 'Giảng viên hướng dẫn', render: function (r) { return '<span data-hdxn-gv="' + esc(r.ID) + '"></span>'; } },
            { title: 'Sinh viên thực hiện', render: function (r) { return '<span data-hdxn-sv="' + esc(r.ID) + '"></span>'; } }
        ],
        sauVe: function (rows, host) {
            var lan = ++luot, viec = [];
            rows.forEach(function (r) {
                viec.push(function () { return gv(r.ID).then(function (d) { dat(host, 'gv', r.ID, d.map(X.hoTen)); }); });
                viec.push(function () { return sv(r.ID).then(function (d) { dat(host, 'sv', r.ID, d.map(X.hoTen)); }); });
            });
            function chay() { var v = viec.shift(); if (!v || lan !== luot) return null; return v().catch(function () {}).then(chay); }
            for (var i = 0; i < 4; i++) chay();
        },
        baoCao: function (add, f) {
            add('strTuKhoa', f.q); add('strDonViCuaThanhVien_Id', f.dv); add('strThanhVien_Id', f.tv); add('strXepLoai_Id', '');
            add('strNguoiThucHien_Id', ''); add('strTinhTrangXacNhan_Id', f.tt); add('strDaoTao_CoCauToChuc_Id', f.dv);
        },
        tieuDeCT: 'Kê khai đề tài sinh viên',
        chiTiet: function (r, b) {
            b.innerHTML = X.kv('Thông tin đề tài', [['Tên đề tài', r.TENDETAI], ['Năm thực hiện', r.NAMTHUCHIEN], ['Năm nghiệm thu', r.NAMNGHIEMTHU],
                    ['Điểm nghiệm thu', r.DIEMNGHIEMTHU], ['Xếp loại', r.XEPLOAI_TEN], ['QĐ phê duyệt', r.QUYETDINHPHEDUYET], ['QĐ nghiệm thu', r.QUYETDINHNGHIEMTHU],
                    ['Tên sinh viên, nhóm sinh viên thực hiện', r.MOTA]]) +
                X.khoi('Nguồn kinh phí', 'kp') +
                '<div class="ums-legend">Nội dung minh chứng</div><div data-hdxn="tep"></div>' +
                X.khoi('Giảng viên hướng dẫn', 'gv') + X.khoi('Sinh viên thực hiện', 'sv');
            X.kinhPhi(b, r.ID);
            X.tep(b, r.ID);
            var ten = { title: 'Họ tên', render: function (x) { return esc(X.hoTen(x)); } };
            X.bang(b, 'gv', gv(r.ID), [ten]);
            X.bang(b, 'sv', sv(r.ID), [ten, { title: 'Vai trò', prop: 'VAITRO_TEN' }]);
        }
    });
    function dat(host, k, id, ten) {
        var el = host.querySelector('[data-hdxn-' + k + '="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
        if (el) el.innerHTML = ten.map(function (t) { return esc(t); }).join('<br>');
    }
})();
