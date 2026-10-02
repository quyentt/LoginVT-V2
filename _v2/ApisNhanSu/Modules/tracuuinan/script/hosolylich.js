/* =========================================================================
   Hồ sơ lý lịch — tra cứu và in lý lịch nhân sự (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/tracuuinan/html/hosolylich.html + script/hosolylich.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, col-lg-3 | col-lg-9):
     trái  — ô từ khoá + nút mở "điều kiện tìm kiếm" (Cơ cấu khoa/viện/phòng ban → Bộ môn) + Tìm kiếm;
             "Danh sách nhân sự" (số lượng, ảnh · họ tên · ngày sinh · nút xem, phân trang máy chủ);
     phải  — "Thông tin cơ bản" (ảnh + 5 dòng lý lịch) + chân khung "Vui lòng chọn kiểu file in" (các nút báo cáo
             lấy từ danh mục CCB.BCTK).
   Bản mới: ums.pat.master (cột trái: ô tìm + hai ô cơ cấu + danh sách có phân trang; cột phải: thông tin + nút in).

   Lời gọi (chép nguyên):
     edu.system.getList_NhanSu → ums.ref.nhanSuPage { strTuKhoa, strCoCauToChuc_Id = Bộ môn || Cơ cấu,
                                  dLaCanBoNgoaiTruong 0, pageIndex, pageSize (mặc định của hệ: 10) }
     edu.system.getList_CoCauToChuc → ums.ref.coCauToChuc { '', '', 1 } — tách cha (không có
                                  DAOTAO_COCAUTOCHUC_CHA_ID) cho ô Cơ cấu, con cho ô Bộ môn
     NS_HoSoV2/LayChiTiet      GET strId
     Danh mục CCB.BCTK (sắp theo HESO1) → nút báo cáo: MA = mã báo cáo, THONGTIN3 = đường dẫn, THONGTIN1 = biểu tượng
       (FA4 — qua ums.iconFA4), TEN = chữ. Bấm → edu.system.report → ums.report.run(MA, { duongDan: THONGTIN3 })
       với strOutputType (radio rdhsll_output — KHÔNG có trên màn gốc → rỗng) và strNhanSu_Id.
   Khác gốc (ghi báo cáo):
     · Ảnh trong danh sách gốc đọc data.ANH (của MẢNG — luôn ảnh mặc định) → nay đọc ANH từng dòng.
     · Danh sách nhân sự bên trái = khung chung ums.pat.dsNhanSu (2026-09-26): Cơ cấu → Bộ môn khoá theo luật cha → con,
       thêm ô Tình trạng làm việc, đổi ô lọc là tải lại, dòng phụ Mã cán bộ + Ngày sinh — như mọi màn Nhân sự.
     · Bấm nút in khi chưa chọn nhân sự: gốc gửi strNhanSu_Id rỗng → nay nhắc chọn nhân sự.
   Cố ý bỏ: hai khung "Mẫu lý lịch 2C-BNV" / "2C-TW" trong html gốc (toggle_preview_* không nơi nào gọi — chưa từng
   hiện), cbGenLink_InHoSo (bị chú thích bỏ), popover nhân sự (chú thích bỏ).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-hosolylich');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var mst = pat.master({
        el: root,
        title: 'Hồ sơ lý lịch',
        side: {
            title: 'Danh sách nhân sự', icon: 'fa-users', search: 'Nhập từ khóa tìm kiếm',
            filter: pat.dsNhanSuLoc({ cctcTen: 'Cơ cấu khoa/viện/phòng ban' })
        },
        main: { title: false }
    });
    mst.mainBody.innerHTML = pat.panel({ title: 'Thông tin cơ bản', icon: 'fa-circle-info', zone: 'ct',
        body: ui.empty('Chọn một nhân sự ở danh sách bên trái', 'fa-hand-pointer'),
        foot: '<div class="nshs-in"><span class="ums-u-muted">- Vui lòng chọn kiểu file in:</span><div class="nshs-in__nut" data-z="baocao"></div></div>' });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var S = { chon: '' };

    /* ---------- Danh sách nhân sự: khung chung ums.pat.dsNhanSu (Cơ cấu → Bộ môn, Tình trạng, phân trang) ---------- */
    pat.dsNhanSu(mst, { onPick: function (r) { xem(r.ID); } });

    /* ---------- Thông tin cơ bản (viewForm_NhanSu) ---------- */
    function kv(nhan, gt, cls) { return '<div class="ums-kv"><span>' + ui.esc(nhan) + '</span><b' + (cls ? ' class="' + cls + '"' : '') + '>' + ui.esc(gt) + '</b></div>'; }
    function xem(id) {
        S.chon = id;
        z('ct').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'NS_HoSoV2/LayChiTiet', method: 'GET', strId: id }).then(function (r) {
            if (S.chon !== id) return;
            var d = (Array.isArray(r.data) ? r.data[0] : r.data) || {};
            var ten = (e(d.HODEM) + ' ' + e(d.TEN)).trim().toUpperCase();
            var u = d.ANH && ums.files.url ? ums.files.url(d.ANH) : '';
            z('ct').innerHTML = '<div class="nshs-ct"><div class="nshs-ct__anh">' + (u ? '<img alt="" src="' + ui.esc(u) + '" onerror="this.remove()">' : '') +
                '<i class="fa-light fa-user"></i></div><div>' +
                kv('1) Họ và tên khai sinh', ten, 'ums-u-blue') + kv('2) Tên gọi khác', e(d.TENGOIKHAC)) +
                kv('3) Sinh ngày', e(d.NGAYSINH) + '/' + e(d.THANGSINH) + '/' + e(d.NAMSINH)) + kv('Giới tính', e(d.GIOITINH_TEN)) +
                kv('4) Nơi sinh', e(d.NOISINH_XA_TEN) + ', ' + e(d.NOISINH_HUYEN_TEN) + ', ' + e(d.NOISINH_TINH_TEN)) +
                kv('5) Quê quán', e(d.QUEQUAN_XA_TEN) + ', ' + e(d.QUEQUAN_HUYEN_TEN) + ', ' + e(d.QUEQUAN_TINH_TEN)) + '</div></div>';
        }).catch(function (err) { z('ct').innerHTML = ui.fail(err.message); ums.api.handle(err, 'NS_HoSoV2/LayChiTiet'); });
    }

    /* ---------- Nút in (loadBtnBaoCao) ---------- */
    var BC = [];
    ums.api.dm('CCB.BCTK', 'HESO1').then(function (rows) {
        BC = rows;
        z('baocao').innerHTML = rows.length ? rows.map(function (x, i) {
            return ui.btn('report', { text: e(x.TEN), icon: ums.iconFA4 ? ums.iconFA4(e(x.THONGTIN1)) || 'fa-file-lines' : 'fa-file-lines', attr: { 'data-bc': i } });
        }).join('') : '<span class="ums-u-faint ums-u-fz13">Chưa khai mẫu in (danh mục CCB.BCTK)</span>';
    }).catch(function (err) { ums.api.handle(err, 'CCB.BCTK'); });
    function inBaoCao(x) {
        if (!S.chon) { ui.toast('Vui lòng chọn nhân sự cần in!', 'warn'); return; }
        var id = S.chon;
        ums.report.run(e(x.MA), { duongDan: e(x.THONGTIN3), collect: function (add) { add('strOutputType', ''); add('strNhanSu_Id', id); } });
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (ev) {
        var bc = ev.target.closest('[data-bc]');
        if (bc) inBaoCao(BC[Number(bc.getAttribute('data-bc'))]);
    });
})();
