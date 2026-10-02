/* =========================================================================
   Sinh viên đăng ký — TRANG MẪU
   Bản gốc: ApisDangKyHoc/Modules/sinhviendangky/html/dangky.html + script/dangky.js (nnthuong, 31/05/2018)
   ---------------------------------------------------------------------------
   Bản gốc là BẢN DỰNG THỬ chưa bao giờ nối API: không có một lời gọi makeRequest nào; kế hoạch, học phần,
   lớp học phần viết cứng trong mã, mỗi lần "lấy dữ liệu" bật alert("Get data from db …"), kết quả đăng ký chỉ
   đẩy vào một mảng trong bộ nhớ ("call to db to save (tem into cache)"). Chuyển nguyên TRANG MẪU như tiền lệ
   Dashboardv2 (đầu trang ghi rõ "Trang mẫu"), giữ bố cục một cột và luồng thao tác của gốc:
     đầu trang: Tổng số đã đăng ký (tín chỉ / giới hạn 30) · Tổng tiền phải nộp;
     lọc: Kế hoạch → Học phần (+ "Số tín chỉ · Loại lớp");
     ba tab: Danh sách đăng ký (bước chọn lớp theo từng loại lớp LT/TH/BTL + bảng lớp) · Kết quả đăng ký
     (gộp theo mã học phần, tổng tiền) · Nguyện vọng đăng ký (gốc để trống).
   Luồng bước (gen_Step / goNext_Step của gốc): học phần có N loại lớp → N bước, bước đầu đang chọn (vàng); chọn
   một lớp rồi bấm "Chọn" → bước thành xanh kèm tên lớp, chuyển sang bước sau; bấm một bước để chọn lại;
   "Lưu" khi đủ N bước → đưa vào Kết quả đăng ký.
   Khác bản gốc: bỏ mọi alert "Get data from db", bỏ bộ nhớ đệm localStorage (dkh_kehoach…); nút "Clear cache" chỉ
   còn thông báo của gốc; ô chọn lớp dùng CHUNG một nhóm (gốc đặt tên nhóm radio khác nhau cho từng dòng nên
   chọn được nhiều lớp cùng lúc); tổng tín chỉ / tiền tính lại mỗi lần vẽ (gốc CỘNG DỒN mỗi lần bấm tab Kết quả);
   "Lưu" hai lần không đẩy trùng lớp; số trên tab Kết quả = số học phần (gốc hiện số tín chỉ).
   Nút gốc không có xử lý → giữ, khoá: "Tải lại", "Hủy" / "All" ở Kết quả, "View", "Print".
   Ô cha → con: Kế hoạch → Học phần (ums.pat.chain).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('svdk-dangky');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : v; }

    /* ---------- Số liệu viết cứng của gốc --------------------------------- */
    var KEHOACH = [
        { ID: 'KH1', NAME: 'Tổ chức đăng ký học đợt 2 năm 2016_2017' },
        { ID: 'KH2', NAME: 'Tổ chức đăng ký học đợt 1 năm 2017_2018' },
        { ID: 'KH3', NAME: 'Tổ chức đăng ký học đợt 2 năm 2017_2018' }
    ];
    var HOCPHAN = [
        ['HP1', 'Chủ nghĩa xã hội và khoa học', 'KH1', '3', 'lt,th,btl'], ['HP2', 'Kinh tế thị trường 1', 'KH1', '2', 'lt,th,btl'],
        ['HP3', 'Lịch sử nhân loại và nguồn gốc loài người', 'KH1', '3', 'lt'], ['HP4', 'Hoạt động kinh doanh', 'KH2', '3', 'lt'],
        ['HP5', 'An toàn trong công tác đầu tư', 'KH2', '2', 'lt'], ['HP6', 'Tin học cơ bản', 'KH2', '3', 'lt'],
        ['HP7', 'Chính sách đầu tư', 'KH3', '1', 'lt'], ['HP8', 'Triển khai mô hình kinh doanh', 'KH3', '3', 'lt'],
        ['HP9', 'Xoay vòng vốn trong thị trường mới', 'KH3', '3', 'lt']
    ].map(function (a) { return { ID: a[0], NAME: a[1], KEHOACH_ID: a[2], TINCHI: a[3], THUOCTINHLOP_ID: a[4] }; });
    var LOP = [
        ['LHP1-1', 'HP1', 'HP-X01', 'Chủ nghĩa xã hội và khoa học lhp01', '50', '45', 'Lý thuyết', 'lt', 'Trương Giang Long', '300000', '3'],
        ['LHP1-2', 'HP1', 'HP-X01', 'Chủ nghĩa xã hội và khoa học th01', '50', '45', 'Thực hành', 'th', 'Trương Giang Long', '300000', '3'],
        ['LHP1-3', 'HP1', 'HP-X01', 'Chủ nghĩa xã hội và khoa học btl01', '50', '45', 'Bài tập lớn', 'btl', 'Trương Giang Long', '300000', '3'],
        ['LHP2-1', 'HP1', 'HP-X02', 'Chủ nghĩa xã hội và khoa học lhp02', '50', '40', 'Lý thuyết', 'lt', 'Trương Giang Long', '300000', '3'],
        ['LHP2-2', 'HP1', 'HP-X02', 'Chủ nghĩa xã hội và khoa học th02', '50', '40', 'Thực hành', 'th', 'Trương Giang Long', '300000', '3'],
        ['LHP2-3', 'HP1', 'HP-X02', 'Chủ nghĩa xã hội và khoa học btl02', '50', '40', 'Thực hành', 'btl', 'Trương Giang Long', '300000', '3'],
        ['LHP3', 'HP2', 'HP-Y01', 'Chủ nghĩa xã hội và khoa học lhp03', '30', '45', 'Lý thuyết', 'lt', 'Trương Giang Long', '200000', '2'],
        ['LHP4', 'HP2', 'HP-Y02', 'Chủ nghĩa xã hội và khoa học lhp03', '50', '45', 'Thực hành', 'th', 'Hoàng Minh Duy', '200000', '2'],
        ['LHP5', 'HP2', 'HP-K02', 'Kinh tế thị trường 1 lhp02', '50', '40', 'Lý thuyết', 'lt', 'Hoàng Minh Duy', '200000', '2'],
        ['LHP6', 'HP2', 'HP-K03', 'Kinh tế thị trường 1 lhp03', '30', '45', 'Lý thuyết', 'lt', 'Hoàng Minh Duy', '200000', '2'],
        ['LHP7', 'HP3', 'HP-F01', 'Lịch sử nhân loại và nguồn gốc loài người lhp01', '50', '45', 'Lý thuyết', 'lt', 'Tạ Anh Chung', '300000', '3'],
        ['LHP8', 'HP4', 'HP-F02', 'Lịch sử nhân loại và nguồn gốc loài người lhp02', '50', '40', 'Lý thuyết', 'lt', 'Tạ Anh Chung', '300000', '3'],
        ['LHP9', 'HP4', 'HP-F03', 'Lịch sử nhân loại và nguồn gốc loài người lhp03', '30', '45', 'Lý thuyết', 'lt', 'Tạ Anh Chung', '300000', '3']
    ].map(function (a) {
        return { ID: a[0], HOCPHAN_ID: a[1], HOCPHAN_MA: a[2], LOPHOCPHAN_TEN: a[3], SOLUONG_TONG: a[4], SOLUONG_CONLAI: a[5],
            LOPHOCPHAN_LOAI: a[6], THUOCTINHLOP_ID: a[7], THOIGIAN: '15/02/2018 - 20/06/2018', GIANGVIEN: a[8], SOTIEN: a[9], SOTINCHI: a[10] };
    });
    // Lịch tuần: gốc vẽ CỨNG một dãy 17 tuần cho mọi lớp (LichTuan())
    var LICHTUAN = '1 2 3 4 5 6 - 8 9 10 - - 13 14 15 16 17';

    var st = { kh: '', hp: '', buoc: [], dangChon: '', gio: {}, tam: null, ketQua: [], tab: 'dsdk' };

    function khoaNut(chu, icon, mod) {
        return '<button type="button" class="ums-btn ums-btn--' + (mod || 'ghost') + ' ums-btn--sm" disabled title="Bản gốc chưa có xử lý">' +
            '<i class="fa-light ' + icon + '"></i><span>' + esc(chu) + '</span></button>';
    }

    root.innerHTML =
        pat.page('Sinh viên đăng ký', '<span class="ums-badge ums-badge--warn" title="Bản gốc chưa nối API: kế hoạch, học phần, lớp viết cứng trong mã; đăng ký không ghi vào hệ thống">' +
            '<i class="fa-light fa-flask"></i> Trang mẫu — số liệu dựng thử</span>') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-row ums-row--between">' +
                '<span>Tổng số đã đăng ký: <span class="ums-badge ums-badge--ok"><b data-z="tc">0</b>/<b>30</b></span></span>' +
                '<span>Tổng tiền phải nộp: <span class="ums-badge ums-badge--ok"><b data-z="tien">0</b> vnđ</span></span>' +
            '</div>' +
            '<div class="ums-filter ums-u-mt-4">' +
                '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch tổ chức đăng ký"></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="hp" data-ph="Chọn học phần"></select></div>' +
                '<div class="ums-field"><span class="ums-u-muted ums-u-fz13">(Số tín chỉ: <b data-z="stc">0</b> Loại lớp: <b data-z="loai">-</b> )</span></div>' +
            '</div>' }) +
        '<div data-z="tabs"></div>' +
        pat.panel({ title: false, zone: 'nd', flush: true,
            tools: ui.btn('reload', { attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } }) +
                ui.btn('reload', { text: 'Clear cache', icon: 'fa-broom-wide', attr: { 'data-a': 'cache' } }) });

    function Z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    ui.enhance(root);
    pat.fill(F('kh'), KEHOACH, { name: 'NAME', head: 'Chọn kế hoạch tổ chức đăng ký' });

    /* ---------- Tab ------------------------------------------------------- */
    function veTab() {
        var soHP = {};
        st.ketQua.forEach(function (x) { soHP[x.HOCPHAN_MA] = 1; });
        Z('tabs').innerHTML = ui.tabs([
            { key: 'dsdk', text: 'Danh sách đăng ký (' + lopHienTai().length + ')', icon: 'fa-screen-users' },
            { key: 'kqdk', text: 'Kết quả đăng ký (' + Object.keys(soHP).length + ')', icon: 'fa-calendar-users' },
            { key: 'nvdk', text: 'Nguyện vọng đăng ký (0)', icon: 'fa-chalkboard-user' }
        ], st.tab, 'data-svtab');
    }
    function veNoiDung() {
        veTab();
        if (st.tab === 'dsdk') veDanhSach();
        else if (st.tab === 'kqdk') veKetQua();
        else Z('nd').innerHTML = ui.empty('Chưa có nguyện vọng đăng ký', 'fa-chalkboard-user');
    }

    /* ---------- Tab 1: bước chọn lớp + bảng lớp --------------------------- */
    function hocPhan() { return HOCPHAN.filter(function (x) { return x.ID === st.hp; })[0]; }
    function lopHienTai() {
        if (!st.hp || !st.dangChon) return [];
        return LOP.filter(function (x) { return x.HOCPHAN_ID === st.hp && x.THUOCTINHLOP_ID === st.dangChon; });
    }
    function veBuoc() {
        if (!st.buoc.length) return '';
        return '<div class="ums-row ums-u-mb-4">' + st.buoc.map(function (b, i) {
            var chon = st.gio[b], dang = b === st.dangChon;
            var tone = chon && !dang ? 'ok' : dang ? 'warn' : 'bad';
            return '<button type="button" class="ums-btn ums-btn--ghost ums-btn--sm" data-buoc="' + esc(b) + '">' +
                ui.badge(String(i + 1), tone) + '<span>Lớp ' + esc(b) + ': ' + esc(chon ? chon.ten : b) +
                (dang ? ' <i class="fa-light fa-ellipsis fa-fade"></i>' : '') + '</span></button>' +
                (dang ? ui.btn('confirm', { text: 'Chọn', cls: 'ums-btn--sm', attr: { 'data-a': 'chon' } }) : '');
        }).join('') + ui.btn('save', { cls: 'ums-btn--sm', attr: { 'data-a': 'luu' } }) + '</div>';
    }
    function veDanhSach() {
        Z('nd').innerHTML = '<div class="ums-panel__body">' + veBuoc() + '<div data-z="bang"></div></div>';
        ui.table({
            el: Z('bang'), rows: lopHienTai(), empty: st.hp ? 'Không có lớp học phần' : 'Chọn kế hoạch và học phần',
            columns: [
                { title: 'Chọn', cls: 'is-center', width: '56px', render: function (r) {
                    return '<input type="radio" name="svdk-lop" data-lop="' + esc(r.ID) + '"' + (st.tam && st.tam.id === r.ID ? ' checked' : '') + '>';
                } },
                { title: 'Mã Lớp', prop: 'HOCPHAN_MA', cls: 'is-center is-nowrap' },
                { title: 'Tình trạng', cls: 'is-center', render: function (r) { return esc(e(r.SOLUONG_TONG) + '/' + e(r.SOLUONG_CONLAI)); } },
                { title: 'Loại lớp', prop: 'LOPHOCPHAN_LOAI', cls: 'is-center' },
                { title: 'Lớp học phần', prop: 'LOPHOCPHAN_TEN' },
                { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
                { title: 'Lịch tuần', cls: 'is-nowrap', render: function () { return '<span title="Chi tiết tuần học">' + esc(LICHTUAN) + '</span>'; } },
                { title: 'Giảng viên', prop: 'GIANGVIEN' }
            ]
        });
    }

    /* ---------- Tab 2: kết quả (gộp theo mã học phần) --------------------- */
    function tongHop() {
        var nhom = {}, thuTu = [];
        st.ketQua.forEach(function (x) {
            if (!nhom[x.HOCPHAN_MA]) { nhom[x.HOCPHAN_MA] = []; thuTu.push(x.HOCPHAN_MA); }
            nhom[x.HOCPHAN_MA].push(x);
        });
        var dong = [], tc = 0, tien = 0;
        thuTu.forEach(function (ma, gi) {
            nhom[ma].forEach(function (x, i) {
                dong.push({ x: x, dau: i === 0, stt: gi + 1, ma: ma, tien: i === 0 ? Number(x.SOTIEN) || 0 : 0 });
            });
            tc += Number(nhom[ma][0].SOTINCHI) || 0;
            tien += Number(nhom[ma][0].SOTIEN) || 0;
        });
        return { dong: dong, tc: tc, tien: tien };
    }
    function veKetQua() {
        var t = tongHop();
        Z('nd').innerHTML = '<div data-z="bang"></div><div class="ums-tablefoot">' +
            '<span></span><span>' + khoaNut('View', 'fa-eye', 'out-primary') + ' ' + khoaNut('Print', 'fa-print', 'out-info') + '</span></div>';
        ui.table({
            el: Z('bang'), rows: t.dong, stt: false, empty: 'Chưa có kết quả đăng ký',
            columns: [
                { title: '#', cls: 'is-center', width: '56px', render: function (d) { return d.dau ? d.stt : ''; } },
                { title: 'Học phần', cls: 'is-nowrap', render: function (d) { return d.dau ? esc(d.ma) : ''; } },
                { title: 'Lớp học phần', render: function (d) { return esc(d.x.LOPHOCPHAN_TEN); } },
                { title: 'Loại lớp', render: function (d) { return esc(d.x.LOPHOCPHAN_LOAI); } },
                { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (d) { return esc(d.x.THOIGIAN); } },
                { title: 'Lịch tuần', render: function () { return ''; } },
                { title: 'Giảng viên', render: function (d) { return esc(d.x.GIANGVIEN_TEN); } },
                { title: 'Số tiền (vnđ)', cls: 'is-right', sum: function () { return '<b>' + ui.money(t.tien) + '</b>'; },
                  render: function (d) { return d.dau ? '<b>' + ui.money(d.tien) + '</b>' : ''; } },
                { title: 'Hủy', cls: 'is-center', sum: function () { return khoaNut('All', 'fa-trash-can', 'out-danger'); },
                  render: function (d) { return d.dau ? khoaNut('Hủy', 'fa-trash-can', 'out-danger') : ''; } }
            ]
        });
    }
    function capNhatTong() {
        var t = tongHop();
        Z('tc').textContent = t.tc;
        Z('tien').textContent = ui.money(t.tien);
    }

    /* ---------- Thao tác --------------------------------------------------- */
    function chonHocPhan() {
        var hp = hocPhan();
        st.buoc = hp ? String(hp.THUOCTINHLOP_ID).split(',').filter(Boolean) : [];
        st.dangChon = st.buoc[0] || '';
        st.gio = {}; st.tam = null;
        Z('stc').textContent = hp ? hp.TINCHI : '0';
        Z('loai').textContent = hp ? st.buoc.join(',') : '-';
        st.tab = 'dsdk';
        veNoiDung();
    }
    if (window.jQuery) {
        jQuery(F('kh')).on('select2:select select2:clear', function () {
            st.kh = F('kh').value; st.hp = '';
            pat.fill(F('hp'), st.kh ? HOCPHAN.filter(function (x) { return x.KEHOACH_ID === st.kh; }) : [], { name: 'NAME', head: 'Chọn học phần' });
            chonHocPhan();
        });
        jQuery(F('hp')).on('select2:select select2:clear', function () { st.hp = F('hp').value; chonHocPhan(); });
    }
    pat.chain([F('kh'), F('hp')], { phatLai: false });

    root.addEventListener('change', function (ev) {
        var r = ev.target.closest('[data-lop]');
        if (!r) return;
        var lop = LOP.filter(function (x) { return x.ID === r.getAttribute('data-lop'); })[0];
        st.tam = lop ? { id: lop.ID, ten: lop.LOPHOCPHAN_TEN } : null;
    });
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-svtab]');
        if (t) { st.tab = t.getAttribute('data-svtab'); veNoiDung(); return; }
        var b = ev.target.closest('[data-buoc]');
        if (b) { st.dangChon = b.getAttribute('data-buoc'); st.tam = null; veNoiDung(); return; }
        var a = ev.target.closest('[data-a]');
        if (!a) return;
        var k = a.getAttribute('data-a');
        if (k === 'cache') {
            ui.toast('Bạn đã xóa dữ liệu cache thành công!, dữ liệu cache xóa bằng tay chỉ có ý nghĩa cho người phát triển, khi chạy thật sẽ tự động xóa', 'ok');
        } else if (k === 'chon') {
            if (!st.tam) { ui.toast('Vui lòng lựa chọn lớp học phần!', 'warn'); return; }
            st.gio[st.dangChon] = st.tam;
            var i = st.buoc.indexOf(st.dangChon);
            st.dangChon = i + 1 < st.buoc.length ? st.buoc[i + 1] : '';
            st.tam = null;
            veNoiDung();
        } else if (k === 'luu') {
            var ids = st.buoc.map(function (x) { return st.gio[x] && st.gio[x].id; }).filter(Boolean);
            if (!st.buoc.length || ids.length !== st.buoc.length) { ui.toast('Vui lòng chọn đầy đủ thông tin lớp học phần!', 'warn'); return; }
            ids.forEach(function (id) {
                var d = LOP.filter(function (x) { return x.ID === id; })[0];
                if (!d || st.ketQua.some(function (x) { return x.LOPHOCPHAN_ID === id; })) return;
                st.ketQua.push({ ID: 'xyz', HOCPHAN_MA: d.HOCPHAN_MA, HOCPHAN_ID: d.HOCPHAN_ID, LOPHOCPHAN_ID: d.ID, LOPHOCPHAN_TEN: d.LOPHOCPHAN_TEN,
                    LOPHOCPHAN_LOAI: d.LOPHOCPHAN_LOAI, THOIGIAN: d.THOIGIAN, LICHTUAN: '', SOTINCHI: d.SOTINCHI, SOTIEN: d.SOTIEN,
                    GIANGVIEN_TEN: d.GIANGVIEN, GIANGIVEN_MA: '' });
            });
            ui.toast('Chọn môn học thành công: ' + ids.join(','), 'ok');
            capNhatTong();
            veTab();
        }
    });

    veNoiDung();
})();
