/* =========================================================================
   Kế hoạch xét học bổng — khung dùng chung của ba màn (ums.hbKh)
       kehoach.html (Kế hoạch xét học bổng) · thuchienxet.html (Thực hiện xét)
       · xacnhan.html (Xác nhận kết quả)
   Bản gốc: ApisHocBong/Modules/kehoach/script/{kehoach,thuchienxet,xacnhan}.js — ba tệp chép nhau
   66–72% (cùng getList_QuyHocBong, getList_PhanCong, getList_QuanSoTheoLop / getList_DoiTuong,
   getList_NhanHocBong / getList_Dat, genTable_* cột người học y hệt).
   ---------------------------------------------------------------------------
   Tiện ích nhỏ (ô đánh dấu, lọc tại chỗ, hộp học tập, hỏi-lại-rồi-chạy-hàng-loạt) dùng CHÍNH
   ums.khxl của Xử lý học vụ (ApisXuLyHocVu/Modules/kehoachxuly/script/_khxl_chung.js — html nạp chéo):
       K.cotChon(k) / K.ganChon(host) / K.daChon(host, k) · K.locTaiCho · K.maSo + K.hocTap · K.xoa · K.ds · K.tim.

   H.quy()                     HB_QuyHocBong/LayDanhSach GET  strTuKhoa '' · strNguoiTao_Id '' (gốc đọc txtAAAA/dropAAAA)
                               · pageIndex 1 · pageSize 1000000 → Promise<dòng>
   H.napQuy(els)               đổ quỹ vào các ô (cbGenCombo_QuyHocBong: "Chọn quỹ học bổng", cột TEN)
   H.napHocKy(els, heads)      edu.system.getList_ThoiGianDaoTao (strNam_Id '' · pageSize 100000), cột DAOTAO_THOIGIANDAOTAO
   H.dsKeHoach(thamSo)         HB_ThongTin/LayDSHB_KeHoach POST (kèm tham số type=POST như gốc) — màn truyền
                               đúng bộ tham số của mình (hai màn gốc gửi khác nhau, xem từng màn)
   H.cotPhanCong() + H.napPhanCong(host, dòng)
                               cột "Nhân sự phân công xét": mỗi kế hoạch một lời gọi HB_KeHoach_NhanSu/LayDanhSach
                               GET (strTuKhoa '' · strNguoiDung_Id '' · strHB_KeHoach_Id · strNguoiTao_Id '' ·
                               pageIndex 1 · pageSize 100000), tên = NGUOICUOI_TENDAYDU bỏ trùng (getList_PhanCong
                               của thuchienxet). Bản kehoach ghi vào #DSPhanCong KHÔNG kèm ID → cột luôn là một
                               nút trống; ở đây hiện tên như thuchienxet (ý định chung của hai màn).
   H.cotSV({ hocTap, hoTen })  cột người học chung: Mã số · Họ tên · Ngày sinh · Tình trạng · Lớp học · Chương trình
                               học · Khóa học · Khoa quản lý · Hệ đào tạo (chép genTable_QuanSoTheoLop).
                               hocTap: Mã số bấm được → hộp kết quả học tập (btnView_HocTap của thuchienxet).
   H.hopDS(o)                  hộp danh sách người học (#myModal / #myModalKetQua / #myModalDat / #myModalKhongDat):
       o = { title, icon, call(trang, cỡ, từKhoá) → tham số ums.api.call, phanTrang (máy chủ), tim: 'may' | 'cho' | false,
             chiTiet: tham số lời gọi cột động (HB_KetQua/LayChiTiet — Data.rsCot [ID, TEN] + Data.rsDuLieu
             [HB_KETQUA_ID, ID, GIATRI]; ô = GIATRI của (ID dòng, ID cột)),
             columns(), chon: 'khoá thuộc tính ô đánh dấu', ben: true (khung phụ bên phải, lưới 2:1),
             buttons: [{ text, kind, icon, onClick(api) }] (hộp KHÔNG tự đóng), onClick(nút, dòng, api) }
       → api = { dlg, rows(), chon(), tai(trang), ben }
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var K = ums.khxl;
    var H = ums.hbKh = ums.hbKh || {};
    var e = K.e;
    H.e = e;
    H.K = K;

    H.uid = function () { return (ums.session && ums.session.userId) || ''; };
    H.hoTen = K.hoTen;

    /* ---------- Danh mục ---------------------------------------------------- */
    H.quy = function () {
        return ums.api.call({ action: 'HB_QuyHocBong/LayDanhSach', method: 'GET',
            strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 }).then(K.ds);
    };
    H.napQuy = function (els) {
        return H.quy().then(function (ds) {
            els.forEach(function (el) { pat.fill(el, ds, { name: 'TEN', head: 'Chọn quỹ học bổng' }); });
            return ds;
        }).catch(function (err) { ums.api.handle(err, 'quỹ học bổng'); });
    };
    H.napHocKy = function (els, heads) {
        return ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (ds) {
                els.forEach(function (el, i) { pat.fill(el, ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: (heads || [])[i] || 'Tất cả học kỳ' }); });
                return ds;
            }).catch(function (err) { ums.api.handle(err, 'học kỳ'); });
    };

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    H.dsKeHoach = function (p) {
        var c = { action: 'HB_ThongTin/LayDSHB_KeHoach', method: 'POST', type: 'POST' };
        Object.keys(p || {}).forEach(function (k) { c[k] = p[k]; });
        return ums.api.call(c);
    };

    H.cotPhanCong = function () {
        return { title: 'Nhân sự phân công xét', cls: 'hbkh-pc', render: function (r) {
            return '<span class="ums-u-muted" data-pc="' + esc(r.ID) + '">…</span>';
        } };
    };
    H.napPhanCong = function (host, rows) {
        (rows || []).forEach(function (r) {
            ums.api.call({ action: 'HB_KeHoach_NhanSu/LayDanhSach', method: 'GET', silent: true,
                strTuKhoa: '', strNguoiDung_Id: '', strHB_KeHoach_Id: r.ID, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (kq) {
                    var ten = [];
                    K.ds(kq).forEach(function (x) { var t = e(x.NGUOICUOI_TENDAYDU); if (t && ten.indexOf(t) < 0) ten.push(t); });
                    var el = host.querySelector('[data-pc="' + (window.CSS && CSS.escape ? CSS.escape(r.ID) : r.ID) + '"]');
                    if (el) { el.textContent = ten.join(', '); el.classList.remove('ums-u-muted'); }
                }, function () {
                    var el = host.querySelector('[data-pc="' + (window.CSS && CSS.escape ? CSS.escape(r.ID) : r.ID) + '"]');
                    if (el) el.textContent = '';
                });
        });
    };

    /* ---------- Cột người học ----------------------------------------------- */
    H.cotSV = function (o) {
        o = o || {};
        return [
            o.hocTap ? { title: 'Mã số', cls: 'is-nowrap', render: K.maSo } : { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(o.hoTen ? e(r[o.hoTen]) : H.hoTen(r)); } },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
            { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-center' },
            { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center is-nowrap' },
            { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center' },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center is-nowrap' },
            { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN', cls: 'is-center' },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' }
        ];
    };
    H.cotXepLoai = function () {
        return [
            { title: 'Xếp loại tên', prop: 'XEPLOAI_TEN' },
            { title: 'Xếp loại - hạ bậc', prop: 'XEPLOAI_THAYDOI_TEN' }
        ];
    };

    /* ---------- Hộp danh sách người học ------------------------------------ */
    H.hopDS = function (o) {
        var page = 1, size = 10, total = 0, rows = [], cotDong = [], giaTri = {};
        var bang = '<div data-z="t"></div>';
        var dlg = ui.dialog({
            title: o.title, icon: o.icon || 'fa-user-graduate', size: 'xl',
            body: (o.tim ? '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    (o.tim === 'may' ? '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' : '') + '</div>' : '') +
                '<div class="ums-row ums-row--between ums-u-mt-3"><b class="ums-u-navy">Danh sách <span class="ums-u-faint ums-u-fz13" data-z="n"></span></b></div>' +
                (o.ben ? '<div class="ums-grid ums-grid--main-aside ums-u-mt-2">' + bang + '<div data-z="ben"></div></div>' : '<div class="ums-u-mt-2">' + bang + '</div>'),
            buttons: (o.buttons || []).map(function (b) {
                return { text: b.text, kind: b.kind, icon: b.icon, mod: b.mod, onClick: function () { b.onClick(api); return false; } };
            })
        });
        var B = dlg.body;
        var host = B.querySelector('[data-z="t"]');
        var q = B.querySelector('[data-f="q"]');
        var locCho = o.tim === 'cho' && q ? K.locTaiCho(q, host) : null;
        K.ganChon(B);

        var api = {
            dlg: dlg, ben: B.querySelector('[data-z="ben"]'),
            rows: function () { return rows; },
            chon: function () { return o.chon ? K.daChon(host, o.chon) : []; },
            tai: tai
        };

        function ve() {
            var n = B.querySelector('[data-z="n"]');
            if (n) n.textContent = '(' + total + ')';
            var cols = (o.columns ? o.columns() : []).concat(cotDong.map(function (c) {
                return { title: e(c.TEN), cls: 'is-center', render: function (r) { return esc(e(giaTri[r.ID + '_' + c.ID])); } };
            }));
            if (o.chon) cols.push(K.cotChon(o.chon));
            ui.table({
                el: host, rows: rows, empty: o.empty || 'Không có dữ liệu',
                page: o.phanTrang ? {
                    index: page, size: size, total: total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tai(p); },
                    onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); tai(1); }
                } : null,
                columns: cols
            });
            if (locCho) locCho();
        }
        function tai(p) {
            if (p) page = p;
            K.dang(host);
            var tuKhoa = o.tim === 'may' && q ? (q.value || '').trim() : '';
            return ums.api.call(o.call(page, size, tuKhoa)).then(function (r) {
                rows = K.ds(r);
                total = o.phanTrang ? (Number(r.pager) || rows.length) : rows.length;
                ve();
            }).catch(function (err) { K.loi(host, err, o.title); });
        }

        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !B.contains(b) || b.disabled) return;
            var a = b.getAttribute('data-a');
            if (a === 'tim') return tai(1);
            if (a === 'hoctap') return K.hocTap(b.getAttribute('data-nh'), b.getAttribute('data-ten'));
            if (o.onClick) o.onClick(b, K.tim(rows, b.getAttribute('data-id')), api);
        });
        if (q && o.tim === 'may') q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

        if (o.chiTiet) {
            K.dang(host);
            ums.api.call(o.chiTiet).then(function (r) {
                var d = r.data || {};
                cotDong = Array.isArray(d.rsCot) ? d.rsCot : [];
                (Array.isArray(d.rsDuLieu) ? d.rsDuLieu : []).forEach(function (x) { giaTri[x.HB_KETQUA_ID + '_' + x.ID] = x.GIATRI; });
                tai(1);
            }).catch(function (err) { K.loi(host, err, o.title); });
        } else tai(1);
        return api;
    };
})();
