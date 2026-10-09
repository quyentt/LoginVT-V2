/* =========================================================================
   Tự động phân khối — đăng ký lớp học phần hàng loạt thay sinh viên
   Bản gốc: ApisDangKyHoc/Modules/sinhviendangky/html/autopk.html + script/autopk.js
   ---------------------------------------------------------------------------
   Một cột như gốc: khung nhập (danh sách ID sinh viên · Số lượng request · Sinh viên từ số / đến số ·
   Tìm kiếm · bốn ô "Chạy …") + khung "Danh sách kế hoạch" ghi từng lượt đăng ký và kết quả.
   Luồng (chép nguyên lời gọi, kiểu cũ, không mã hoá):
     1. Ô ID trống → SV_HoSo/LayDanhSach GET (versionAPI v1.0; strTuKhoa / strHeDaoTao_Id / strKhoaDaoTao_Id /
        strChuongTrinh_Id / strLopQuanLy_Id = "" — gốc đọc các ô KHÔNG có trên màn; strNguoiThucHien_Id "";
        pageIndex = "Sinh viên từ số", pageSize = đến số − từ số) → mỗi dòng (ID, MASO).
        Có ID → tách theo dấu phẩy (bỏ khoảng trắng), mã số để trống.
     2. DKH_Chung/LayDSChuongTrinh GET (strQLSV_NguoiHoc_Id) → DAOTAO_TOCHUCCHUONGTRINH_ID
     3. DKH_Chung/LayDSKeHoachDangKyHoc GET (strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id) → ID
     4. DKH_Chung/LayDSHocPhanDangToChuc GET (strDangKy_KeHoachDangKy_Id, …) → DAOTAO_HOCPHAN_ID
     5. DKH_Chung/LayDSLopHocPhanDangToChuc GET (strThuHoc "", strNhanSu_HoSoNhanSu_v2_Id "", dChiLayCacLopKhongTrung 1,
        strThuocTinhLop_Id "", strMaNhomLop "" (dropAAAA/txtAAAA), dLaLopHocPhanChinh 1, …, strDaoTao_HocPhan_Id)
        → Data.rs; lớp có SOLOPTHUOCCUNGNHOM == 1 thì
     6. DKH_DangKy/DangKyHocTrucTiep POST (strThuocTinhLop_Id "", strMaNhomLop "", dLaLopHocPhanChinh 1, kế hoạch,
        chương trình, người học, học phần, strDangKy_LopHocPhan_Ids = ID lớp) → mỗi lượt một dòng kết quả (Message).
   "Số lượng request" = số lời gọi chạy đồng thời (edu.system.iGioiHanLuong của gốc).
   Khác bản gốc (lỗi rõ, ghi lại):
     · Ô ID sinh viên: gốc đọc "txtSearchDSSV_TuKhoa" (KHÔNG có trên màn; ô thật là txtSinhVien) nên luôn chạy theo
       SV_HoSo/LayDanhSach dù đã nhập ID → bản mới đọc đúng ô.
     · Gốc dùng CHUNG một objSend cho mọi nhánh (forEach lồng nhau, lời gọi bất đồng bộ) → chương trình / kế hoạch /
       học phần của nhánh này đè lên nhánh kia khi ghi kết quả và đăng ký. Bản mới chép riêng tham số cho từng nhánh.
     · Đăng ký thành công có Id: gốc gọi bRunKetQua (biến KHÔNG khai báo → ReferenceError) nên dòng kết quả của lượt
       thành công KHÔNG BAO GIỜ được ghi. Bản mới ghi mọi lượt.
     · Bốn ô "Chạy kết quả / tài chính / thứ học / giảng viên": gốc chỉ đặt cờ, không nơi nào dùng → giữ, khoá.
     · Bấm "Tìm kiếm" là GHI ĐĂNG KÝ THẬT cho hàng loạt sinh viên, gốc không hỏi lại → bản mới hỏi lại (tone đỏ).
     · Cột "ID Lọc phần" của gốc là gõ nhầm → "ID Học phần".
   Ô cha → con: không có.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('svdk-autopk');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    function chep(o, them) { var x = {}; Object.keys(o).forEach(function (k) { x[k] = o[k]; }); Object.keys(them || {}).forEach(function (k) { x[k] = them[k]; }); return x; }

    function oDanhDau(id, chu) {
        return '<label class="ums-check" title="Bản gốc chưa có xử lý"><input type="checkbox" data-f="' + id + '" disabled> ' + esc(chu) + '</label>';
    }

    root.innerHTML =
        pat.page('Tự động phân khối', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            ui.field('Danh sách ID sinh viên', '<textarea class="ums-textarea" data-f="sv" rows="3" placeholder="Nhập ID sinh viên cách nhau bởi dấu ,. Nếu không nhập sinh viên tự động lấy số sinh viên theo hàm sinh viên"></textarea>') +
            '<div class="ums-filter ums-u-mt-4">' +
                ui.field('Số lượng request', '<input class="ums-input" data-f="req" value="200" title="Số request đồng thời" autocomplete="off">', { inline: true }) +
                ui.field('Sinh viên từ số', '<input class="ums-input" data-f="tu" value="0" title="Sinh viên từ số" autocomplete="off">', { inline: true }) +
                ui.field('Sinh viên đến số', '<input class="ums-input" data-f="den" value="200" title="Sinh viên đến số" autocomplete="off">', { inline: true }) +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'chay' } }) + '</div>' +
            '</div>' +
            '<div class="ums-checkgrid ums-u-mt-4">' +
                oDanhDau('kq', 'Chạy kết quả') + oDanhDau('tc', 'Chạy tài chính') + oDanhDau('th', 'Chạy thứ học') + oDanhDau('gv', 'Chạy giảng viên') +
            '</div>' }) +
        pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-rectangle-history', count: 'tong', flush: true, zone: 'bang' });

    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var elBang = root.querySelector('[data-z="bang"]');
    var elTong = root.querySelector('[data-z="tong"]');

    var COT = [
        { title: 'ID Sinh viên', prop: 'sv', cls: 'is-center' },
        { title: 'Mã Sinh viên', prop: 'ma', cls: 'is-center' },
        { title: 'ID Chương trình', prop: 'ct', cls: 'is-center' },
        { title: 'ID Kế hoạch', prop: 'kh', cls: 'is-center' },
        { title: 'ID Học phần', prop: 'hp', cls: 'is-center' },
        { title: 'ID Lớp học phần', prop: 'lop', cls: 'is-center' },
        { title: 'Kết quả', prop: 'kq', cls: 'is-center' }
    ];
    var KQ = [], hen = 0, lan = 0;
    function ve() {
        hen = 0;
        ui.table({ el: elBang, rows: KQ, columns: COT, empty: 'Chưa có lượt đăng ký nào' });
        elTong.textContent = KQ.length ? '(' + KQ.length + ')' : '';
    }
    function veSau() { if (!hen) hen = setTimeout(ve, 250); }
    ve();

    /* Hàng đợi: tối đa N lời gọi cùng lúc (edu.system.iGioiHanLuong) */
    var Q = { max: 200, chay: 0, cho: [] };
    function goi(call) {
        return new Promise(function (ok, loi) {
            Q.cho.push(function () {
                Q.chay++;
                ums.api.call(call).then(ok, loi).then(function () { Q.chay--; keo(); });
            });
            keo();
        });
    }
    function keo() { while (Q.chay < Q.max && Q.cho.length) Q.cho.shift()(); }
    function baoLoi(err, noi) { if (err && err.expired) ums.api.handle(err); else ui.toast(noi + ' : ' + (err && err.message), 'warn'); }

    /* 2 → 6 */
    function chuongTrinh(o, t) {
        goi({ action: 'DKH_Chung/LayDSChuongTrinh', method: 'GET', silent: true, strQLSV_NguoiHoc_Id: o.strQLSV_NguoiHoc_Id, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                if (t !== lan) return;
                arr(r.data).forEach(function (x) { keHoach(chep(o, { strDaoTao_ChuongTrinh_Id: x.DAOTAO_TOCHUCCHUONGTRINH_ID }), t); });
            }, function (err) { baoLoi(err, 'DKH_Chung/LayDSChuongTrinh'); });
    }
    function keHoach(o, t) {
        goi({ action: 'DKH_Chung/LayDSKeHoachDangKyHoc', method: 'GET', silent: true, strDaoTao_ChuongTrinh_Id: o.strDaoTao_ChuongTrinh_Id,
            strQLSV_NguoiHoc_Id: o.strQLSV_NguoiHoc_Id, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                if (t !== lan) return;
                arr(r.data).forEach(function (x) { hocPhan(chep(o, { strDangKy_KeHoachDangKy_Id: x.ID }), t); });
            }, function (err) { baoLoi(err, 'DKH_Chung/LayDSKeHoachDangKyHoc'); });
    }
    function hocPhan(o, t) {
        goi({ action: 'DKH_Chung/LayDSHocPhanDangToChuc', method: 'GET', silent: true, strDangKy_KeHoachDangKy_Id: o.strDangKy_KeHoachDangKy_Id,
            strDaoTao_ChuongTrinh_Id: o.strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id: o.strQLSV_NguoiHoc_Id, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                if (t !== lan) return;
                arr(r.data).forEach(function (x) { lopHocPhan(chep(o, { strDaoTao_HocPhan_Id: x.DAOTAO_HOCPHAN_ID }), t); });
            }, function (err) { baoLoi(err, 'DKH_Chung/LayDSHocPhanDangToChuc'); });
    }
    function lopHocPhan(o, t) {
        goi({ action: 'DKH_Chung/LayDSLopHocPhanDangToChuc', method: 'GET', silent: true,
            strThuHoc: '', strNhanSu_HoSoNhanSu_v2_Id: '', dChiLayCacLopKhongTrung: 1, strThuocTinhLop_Id: '', strMaNhomLop: '',
            dLaLopHocPhanChinh: 1, strDangKy_KeHoachDangKy_Id: o.strDangKy_KeHoachDangKy_Id, strDaoTao_ChuongTrinh_Id: o.strDaoTao_ChuongTrinh_Id,
            strQLSV_NguoiHoc_Id: o.strQLSV_NguoiHoc_Id, strDaoTao_HocPhan_Id: o.strDaoTao_HocPhan_Id, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                if (t !== lan) return;
                ((r.data && r.data.rs) || []).forEach(function (x) {
                    if (x.SOLOPTHUOCCUNGNHOM == 1) dangKy(chep(o, { strDangKy_LopHocPhan_Ids: x.ID }), t);
                });
            }, function (err) { baoLoi(err, 'DKH_Chung/LayDSLopHocPhanDangToChuc'); });
    }
    function dangKy(o, t) {
        function ghi(msg) {
            if (t !== lan) return;
            KQ.push({ sv: o.strQLSV_NguoiHoc_Id, ma: o.strQLSV_NguoiHoc_Ma, ct: o.strDaoTao_ChuongTrinh_Id, kh: o.strDangKy_KeHoachDangKy_Id,
                hp: o.strDaoTao_HocPhan_Id, lop: o.strDangKy_LopHocPhan_Ids, kq: msg });
            veSau();
        }
        goi({ action: 'DKH_DangKy/DangKyHocTrucTiep', method: 'POST', silent: true,
            strThuocTinhLop_Id: '', strMaNhomLop: '', dLaLopHocPhanChinh: 1,
            strDangKy_KeHoachDangKy_Id: o.strDangKy_KeHoachDangKy_Id, strDaoTao_ChuongTrinh_Id: o.strDaoTao_ChuongTrinh_Id,
            strQLSV_NguoiHoc_Id: o.strQLSV_NguoiHoc_Id, strDaoTao_HocPhan_Id: o.strDaoTao_HocPhan_Id,
            strNguoiThucHien_Id: uid(), strDangKy_LopHocPhan_Ids: o.strDangKy_LopHocPhan_Ids })
            .then(function (r) { ghi(e(r.message)); }, function (err) { if (err && err.expired) ums.api.handle(err); ghi(e(err && err.message)); });
    }

    /* 1 */
    function chay() {
        var n = parseInt(F('req').value, 10);
        Q.max = n > 0 ? n : 200;
        var t = ++lan;
        KQ = []; ve();
        var ds = F('sv').value.replace(/ /g, '');
        if (ds) {
            ds.split(',').filter(Boolean).forEach(function (id) { chuongTrinh({ strQLSV_NguoiHoc_Id: id, strQLSV_NguoiHoc_Ma: '' }, t); });
            return;
        }
        var tu = F('tu').value, den = F('den').value;
        goi({ action: 'SV_HoSo/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: '', strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: '',
            strNguoiThucHien_Id: '', pageIndex: tu, pageSize: parseInt(den, 10) - parseInt(tu, 10) })
            .then(function (r) {
                if (t !== lan) return;
                arr(r.data).forEach(function (x) { chuongTrinh({ strQLSV_NguoiHoc_Id: x.ID, strQLSV_NguoiHoc_Ma: x.MASO }, t); });
            }, function (err) { ums.api.handle(err, 'SV_HoSo/LayDanhSach'); });
    }

    root.addEventListener('click', function (ev) {
        if (!ev.target.closest('[data-a="chay"]')) return;
        ui.confirm('Thao tác này GHI ĐĂNG KÝ lớp học phần thật cho ' +
            (F('sv').value.trim() ? 'các sinh viên đã nhập' : 'sinh viên từ số ' + F('tu').value + ' đến số ' + F('den').value) +
            ' (mọi lớp mở một mình trong nhóm). Tiếp tục?', { tone: 'bad', ok: 'Chạy', title: 'Tự động đăng ký' })
            .then(function (yes) { if (yes) chay(); });
    });
})();
