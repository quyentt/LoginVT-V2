/* =========================================================================
   quyettoan — Bảng quyết toán học phí (Cổng sinh viên, vai trò thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/tinhhinhhocphi/html/quyettoan.html
            + script/quyettoan.js (lớp QuyetToan, vỏ index / Core)
   ---------------------------------------------------------------------------
   Bố cục GIỮ như gốc — HAI cột (gốc: col-md-3 / col-md-9):
     · cột trái: ô "Chọn đợt quyết toán" + khối thông tin sinh viên (Họ tên ·
       Mã số · Lớp · Ngành trước khi chuyển · Ngành đang học);
     · cột phải: bảng "Bảng chi tiết quyết toán học phí" (Nội dung · Giá trị ·
       Đơn vị) + dòng lưu ý bên dưới.
   Bản gốc có DUY NHẤT một tab ở cột phải → bản mới KHÔNG vẽ dải tab (luật chung).

   Lời gọi (chép nguyên action / func / tham số / tên cột) — SV_ThongTin_MH ·
   pkg_congthongtin_hssv_thongtin.*:
       LayDSDotQuyetToan             ô "Chọn đợt quyết toán" (ID, TEN, MOTA)
       LayKetQuaQuyetToanCaNhan      dòng quyết toán (THANHPHAN_TEN,
                                     THANHPHAN_GIATRI, DONVITINH_TEN,
                                     DONVITINH_LATIEN = 1 thì hiện dạng tiền)
                                     + thông tin SV ở dòng đầu (QLSV_NGUOIHOC_HOTEN,
                                     QLSV_NGUOIHOC_MASO, DAOTAO_LOPQUANLY_TEN,
                                     GHICHU, DAOTAO_TOCHUCCHUONGTRINH_TEN)

   Khác bản gốc (cách làm, KHÔNG đổi bố cục):
     · Hai cột dựng bằng ums.pat.master (cột trái là khối thông tin, không có ô
       tìm kiếm), bảng bằng ums.ui.table.
     · Chọn sẵn đợt đầu tiên rồi nạp luôn — đúng như gốc (val + trigger).
   Giữ như gốc:
     · Dòng lưu ý dưới bảng lấy từ MOTA của đợt đang chọn; đợt không có MOTA thì
       để TRỐNG (gốc: returnEmpty). Câu lưu ý viết cứng trong HTML gốc chỉ hiện
       trước khi chọn đợt đầu tiên — giữ nguyên câu đó.
     · Gốc còn đổ "Ngày sinh" (#lblQT_NgaySinh) nhưng ô đó đã bị chú thích khỏi
       HTML → bản mới cũng không hiện.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('csv-quyettoan');
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    var A = 'SV_ThongTin_MH/', F = 'pkg_congthongtin_hssv_thongtin.';
    var G = {
        dot: { action: A + 'DSA4BRIFLjUQNDgkNRUuIC8P', func: F + 'LayDSDotQuyetToan' },
        kq:  { action: A + 'DSA4CiQ1EDQgEDQ4JDUVLiAvAiAPKSAv', func: F + 'LayKetQuaQuyetToanCaNhan' }
    };
    function goi(k, o) { return ums.api.call(Object.assign({ silent: true }, G[k], o || {})); }

    /* Câu lưu ý viết cứng trong HTML bản gốc (hiện khi đợt chưa có mô tả riêng) */
    var CHU_Y_GOC = 'Học phí tạm quyết toán đến hết học ký 2 năm học 2022-2023. trường hợp có sự thay đổi ' +
        'về số tín chỉ đào tạo, học phí, nhà trường thực hiện điều chỉnh quyết toàn vào cuối khóa';

    var dtDot = [];

    var m = pat.master({
        el: root,
        title: 'Bảng quyết toán học phí',
        side: {
            title: 'Thông tin sinh viên', icon: 'fa-user-graduate', search: false,
            filter: '<div class="ums-field"><select class="ums-select" data-f="dot" data-ph="Chọn đợt quyết toán">' +
                    '<option value="">Chọn đợt quyết toán</option></select></div>'
        },
        main: { title: 'Bảng chi tiết quyết toán học phí', icon: 'fa-file-invoice-dollar' }
    });
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    m.mainBody.innerHTML = '<div data-z="bang"></div>' +
        '<p class="ums-u-muted ums-u-fz13 ums-u-mt-4" data-z="chuy">' + esc(CHU_Y_GOC) + '</p>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    /* ---------- Đợt quyết toán -------------------------------------------- */
    goi('dot', {}).then(function (r) {
        dtDot = arr(r.data);
        pat.fill(f('dot'), dtDot, { head: 'Chọn đợt quyết toán' });
        if (dtDot.length) {
            f('dot').value = e(dtDot[0].ID);
            if (window.jQuery) jQuery(f('dot')).trigger('change.select2');
            chuY();
        }
        nap();
    }).catch(function (err) { ums.api.handle(err, 'danh sách đợt quyết toán'); });

    if (window.jQuery) jQuery(f('dot')).on('select2:select', function () { chuY(); nap(); });

    /* Dòng lưu ý = MOTA của đợt đang chọn (gốc đọc thuộc tính name của option) */
    function chuY() {
        var id = f('dot').value, mo = '';
        for (var i = 0; i < dtDot.length; i++) if (String(dtDot[i].ID) === String(id)) mo = e(dtDot[i].MOTA);
        z('chuy').textContent = mo;
    }

    /* ---------- Kết quả quyết toán ---------------------------------------- */
    function nap() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return goi('kq', { strTaiChinh_DotQuyetToan_Id: f('dot').value }).then(function (r) {
            var rows = arr(r.data);
            thongTin(rows[0]);
            ui.table({
                el: z('bang'), rows: rows, empty: 'Chưa có dữ liệu quyết toán',
                columns: [
                    { title: 'Nội dung', prop: 'THANHPHAN_TEN' },
                    { title: 'Giá trị', cls: 'is-right is-nowrap', render: function (x) {
                        return String(e(x.DONVITINH_LATIEN)) !== '1' ? esc(x.THANHPHAN_GIATRI) : ui.money(x.THANHPHAN_GIATRI);
                    } },
                    { title: 'Đơn vị', prop: 'DONVITINH_TEN', cls: 'is-center' }
                ]
            });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); });
    }

    function thongTin(a) {
        if (!a) { m.sideBody.innerHTML = ui.empty('Chưa có thông tin', 'fa-user-slash'); return; }
        m.sideBody.innerHTML =
            '<div class="ums-u-p-0 qt-tt">' +
            kv('Họ tên', a.QLSV_NGUOIHOC_HOTEN) +
            kv('Mã số', a.QLSV_NGUOIHOC_MASO) +
            kv('Lớp', a.DAOTAO_LOPQUANLY_TEN) +
            kv('Ngành trước khi chuyển', a.GHICHU) +
            kv('Ngành đang học', a.DAOTAO_TOCHUCCHUONGTRINH_TEN) +
            '</div>';
    }
    function kv(nhan, gt) {
        return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(gt) + '</b></div>';
    }
})();
