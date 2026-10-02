/* =========================================================================
   Theo dõi công nợ
   Bản gốc: ApisTaiChinh/Modules/thongke/scripts/theodoicongno.js
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, GET, versionAPI v1.0):
       TC_ThongKe/LayDSCongNo_NoChung | _NoRieng | _DuChung | _DuRieng
           → Data = { rsThoiGian, rsThongTinTongHop, rsThongTinSinhVien }, Pager
       TC_ThongKe/LayDSCongNoChiTiet_NoChung   strQLSV_NguoiHoc_Id
       TC_ThongKe/LayDSCongNoChiTiet_DuChung   strQLSV_NguoiHoc_Id
       CM_HeDaoTao/LayDanhSach · CM_KhoaDaoTao/LayDanhSach ·
       CM_ChuongTrinhDaoTao/LayDanhSach        ô lọc (nạp một lần, như bản gốc)

   Tab nạp một lần khi bấm lần đầu; bấm lại chỉ vẽ lại cột phải từ dữ liệu
   đã có. Nút Tìm kiếm nạp lại tab đang mở. Nợ dùng cột TONGNO, dư dùng
   TONGDU cho khối tổng bên phải (đúng như bản gốc).

   LỖI BẢN GỐC — đã sửa, không chép:
     · Ô lọc Hệ/Khoá/Chương trình/Từ khoá được nạp nhưng KHÔNG gửi đi — bốn
       lời gọi danh sách luôn gửi chuỗi rỗng. Ở đây gửi giá trị ô lọc vào
       đúng các tham số đã có sẵn (strHeDaoTao_Id, strKhoaDaoTao_Id,
       strChuongTrinh_Id, strTuKhoa). Cần kiểm trên host rằng procedure lọc
       đúng; nếu không, trả bốn tham số về chuỗi rỗng.
     · Nút chi tiết ở tab Nợ chung gọi LayDSCongNoChiTiet_DuChung (hàm
       getDetail_CongNo_NoChung có sẵn nhưng không ai gọi). Ở đây Nợ chung
       gọi _NoChung, Dư chung gọi _DuChung.
     · Kết quả chi tiết bị vẽ vào bảng tab Dư riêng (đang ẩn) còn khung chi
       tiết hiện 3 dòng mẫu cứng. Ở đây vẽ vào khung chi tiết.

   Cố ý bỏ:
     · Bảng chi tiết chỉ có Họ tên/Lớp vì bản gốc chỉ đọc HOVATEN, NGAYSINH, LOP.
       (Hai cột Tình trạng / Mã số của bảng chính đã dựng lại — xem hàm columns.)
     · Nút "Tải excle" (id btnDelete): bản gốc không gắn xử lý nào — giữ nút
       nhưng để mờ (disabled), không xoá khỏi giao diện. Nút "Tính" nằm ở
       khung "Tính công nợ" bên phải, đã có.
     · rewrite()/toggleInput_MucDonViPhi: chép từ màn khác, gọi hàm không có.
   Nghi ngờ, giữ nguyên: tab Dư chung hiển thị cột TONGNO (tiêu đề "Tổng nợ").
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var tk = ums.thongke;
    var root = document.getElementById('theodoicongno');
    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
    function f(n) { return root.querySelector('[data-f="' + n + '"]'); }
    function e(v) { return v === undefined || v === null ? '' : v; }

    var SIZE = 10;   // edu.system.pageSize_default

    var TABS = [
        { key: 'nc', text: 'Nợ chung', icon: 'fa-sack-dollar', action: 'TC_ThongKe/LayDSCongNo_NoChung', field: 'TONGNO', chung: true,
          detail: 'TC_ThongKe/LayDSCongNoChiTiet_NoChung' },
        { key: 'nr', text: 'Nợ riêng', icon: 'fa-file-invoice-dollar', action: 'TC_ThongKe/LayDSCongNo_NoRieng', field: 'TONGNO' },
        { key: 'dc', text: 'Dư chung', icon: 'fa-hands-holding-dollar', action: 'TC_ThongKe/LayDSCongNo_DuChung', field: 'TONGDU', chung: true,
          detail: 'TC_ThongKe/LayDSCongNoChiTiet_DuChung' },
        { key: 'dr', text: 'Dư riêng', icon: 'fa-hand-holding-dollar', action: 'TC_ThongKe/LayDSCongNo_DuRieng', field: 'TONGDU' }
    ];
    var active = TABS[0];

    /* ---------- Ô lọc ---------------------------------------------------- */
    z('searchBtn').innerHTML = ui.btn('search', { attr: { 'data-act': 'search' } });

    function combo(el, call, name, title) {
        call.method = 'GET';
        call.silent = true;
        ums.api.call(call).then(function (r) {
            el.innerHTML = ui.options(Array.isArray(r.data) ? r.data : [], { name: name, title: title });
            ui.select2(el, { placeholder: title, allowClear: true });
        }).catch(function (err) { ums.api.handle(err, title); });
    }
    combo(f('he'), {
        action: 'CM_HeDaoTao/LayDanhSach', versionAPI: 'v1.0',
        strDAOTAO_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '',
        pageIndex: 1, pageSize: 10000
    }, 'MAHEDAOTAO', 'Chọn hệ đào tạo');
    combo(f('khoa'), {
        action: 'CM_KhoaDaoTao/LayDanhSach', versionAPI: 'v1.0',
        strDAOTAO_HeDaoTao_Id: '', strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '',
        pageIndex: 1, pageSize: 10000
    }, 'MAKHOA', 'Chọn khoá đào tạo');
    combo(f('ct'), {
        action: 'CM_ChuongTrinhDaoTao/LayDanhSach', versionAPI: 'v1.0',
        strDAOTAO_KhoaDaoTao_Id: '', strDaoTao_N_CN_LOP_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '',
        strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
    }, 'TENCHUONGTRINH', 'Chọn chương trình đào tạo');

    /* ---------- Tab ------------------------------------------------------ */
    function drawTabs() {
        z('tabs').innerHTML = TABS.map(function (t) {
            return '<a class="ums-tabs__item' + (t === active ? ' is-active' : '') + '" href="javascript:void(0)" data-tab="' + t.key + '">' +
                '<i class="fa-light ' + t.icon + '"></i> ' + ui.esc(t.text) +
                ' (' + (t.data ? ui.esc(t.pager) : '<i class="fa-light fa-rotate-right"></i>') + ')</a>';
        }).join('');
    }

    function columns(t) {
        /* Hai cột đầu giữ đúng bản gốc (theodoicongno.html:88-89). Bản gốc để
           trống vì mRender trả "" (scripts/theodoicongno.js:509-518) — ở đây đọc
           tên cột hay dùng của hệ: có dữ liệu thì hiện, không thì để trống đúng
           như cũ. Kiểm trên host rồi chốt lại một tên. */
        var cols = [
            { title: 'Tình trạng', cls: 'is-center is-nowrap', render: function (r) {
                return ui.esc(r.TINHTRANG_TEN || r.TRANGTHAI_TEN || r.TINHTRANG || r.TRANGTHAI || '');
            } },
            { title: 'Mã số', cls: 'is-center is-nowrap', render: function (r) {
                return ui.esc(r.MASO || r.MASONGUOIHOC || r.MASOSINHVIEN || '');
            } },
            { title: 'Họ tên', render: function (r) { return ui.cell(r.HOVATEN, r.NGAYSINH); } },
            { title: 'Lớp quản lý', prop: 'LOP' }
        ];
        if (t.chung) {
            // Bản gốc dùng TONGNO cho cả Nợ chung lẫn Dư chung
            cols.push({ title: 'Tổng nợ', cls: 'is-right is-nowrap', render: function (r) { return ui.money(tk.num(r.TONGNO)); } });
            cols.push({ title: 'Chi tiết', cls: 'is-actions', width: '80px', render: function (r, i) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--view" data-act="detail" data-i="' + i + '" title="Chi tiết theo khoản">' +
                    '<i class="fa-light fa-circle-info"></i></button>';
            } });
        }
        return cols;
    }

    function load(t, page) {
        t.page = page || 1;
        if (t === active) z('table').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: t.action,
            method: 'GET',
            versionAPI: 'v1.0',
            strHeDaoTao_Id: f('he').value,
            strKhoaDaoTao_Id: f('khoa').value,
            strChuongTrinh_Id: f('ct').value,
            strLopQuanLy_Id: '',
            strNguoiThucHien_Id: '',
            strTuKhoa: (f('tuKhoa').value || '').trim(),
            pageIndex: t.page,
            pageSize: SIZE
        }).then(function (r) {
            var d = r.data || {};
            t.data = d.rsThongTinSinhVien || [];
            t.tg = d.rsThoiGian || [];
            t.lk = d.rsThongTinTongHop || [];
            t.pager = Number(r.pager) || 0;
            drawTabs();
            if (t === active) { drawTable(t); drawAside(t); }
        }).catch(function (err) {
            if (t === active) z('table').innerHTML = ui.fail(err.message);
            ums.api.handle(err, t.text);
        });
    }

    function drawTable(t) {
        ui.table({
            el: z('table'),
            rows: t.data || [],
            columns: columns(t),
            page: {
                index: t.page, size: SIZE, total: t.pager,
                onChange: function (p) {
                    if (p >= 1 && p <= Math.ceil(t.pager / SIZE)) load(t, p);
                },
                onSize: function (v) { SIZE = v; load(t, 1); }
            }
        });
    }

    function drawAside(t) {
        var tg = (t.tg || [])[0] || {};
        z('ngayChot').textContent = e(tg.NGAYTONGHOPCUOICUNG) || '__/__/____';
        z('ngayThayDoi').textContent = e(tg.NGAYTHAYDOIDULIEUCUOICUNG) || '__/__/____';
        var sum = 0;
        z('loaiKhoan').innerHTML = (t.lk || []).map(function (r) {
            var v = tk.num(r[t.field]);
            sum += v;
            return '<div class="tdcn-lk"><span title="' + ui.esc(r.TEN) + '">' + ui.esc(r.TEN) + '</span><span>' + ui.money(v) + '</span></div>';
        }).join('');
        z('tong').textContent = ui.money(sum);
    }

    function showList() { ui.swap(z('detail'), z('list'), { top: false }); }

    function openDetail(t, row) {
        z('detailTitle').textContent = 'Chi tiết theo khoản — ' + e(row.HOVATEN);
        z('detailTable').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ui.swap(z('list'), z('detail'), { top: false });
        ums.api.call({
            action: t.detail,
            method: 'GET',
            versionAPI: 'v1.0',
            strQLSV_NguoiHoc_Id: row.ID
        }).then(function (r) {
            ui.table({
                el: z('detailTable'),
                rows: Array.isArray(r.data) ? r.data : [],
                columns: [
                    { title: 'Họ tên', render: function (x) { return ui.cell(x.HOVATEN, x.NGAYSINH); } },
                    { title: 'Lớp quản lý', prop: 'LOP' }
                ]
            });
        }).catch(function (err) {
            z('detailTable').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'chi tiết công nợ');
        });
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var tab = ev.target.closest('[data-tab]');
        if (tab) {
            var t = TABS.filter(function (x) { return x.key === tab.getAttribute('data-tab'); })[0];
            if (!t || t === active) return;
            active = t;
            if (!z('detail').hidden) showList();
            drawTabs();
            if (!t.data) load(t, 1);
            else { drawTable(t); drawAside(t); }
            return;
        }
        var b = ev.target.closest('[data-act]');
        if (!b) return;
        var act = b.getAttribute('data-act');
        if (act === 'search') { if (!z('detail').hidden) showList(); load(active, 1); }
        else if (act === 'back') showList();
        else if (act === 'detail') openDetail(active, active.data[Number(b.getAttribute('data-i'))]);
    });
    f('tuKhoa').addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); load(active, 1); }
    });

    drawTabs();
    load(active, 1);
})();
