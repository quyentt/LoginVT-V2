/* =========================================================================
   tracuudiem/tracuudiem — Tra cứu điểm (phân hệ Quản lý điểm)
   Bản gốc: ApisQuanLyDiem/Modules/tracuudiem/html/tracuudiem.html + script/tracuudiem.js (vỏ indexi / Corei).
   Một cột như gốc: thanh lọc + "Danh sách bảng điểm" (học phần của lớp); ba khung THAY CHỖ (zone-bus gốc):
   Bảng điểm (tiêu đề nhiều tầng dựng từ cấu hình cột), Thống kê theo ngành, Thống kê theo CTĐT; hộp danh sách SV theo xếp loại.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên; kiểu cũ không ghi type là GET):
       Bộ lọc (tất cả CHỌN NHIỀU trừ Phạm vi): Hệ ums.ref.heDaoTao (1000) · Khoá ums.ref.khoaDaoTao(strHeDaoTao_Id, 10000)
         · Khoa QL ums.ref.khoaQuanLy · CT ums.ref.chuongTrinh(strKhoaDaoTao_Id, strKhoaQuanLy_Id, 10000; tên "TÊN - MÃ")
         · Lớp KHCT_LopQuanLy/LayDanhSach (GET; strDaoTao_Nganh_Id = CT như gốc) · Tình trạng QLSV.TRANGTHAI · Thang điểm DIEM.THANGDIEM
         · Phạm vi DIEM.PHAMVITONGHOPDIEM → thời gian D_ThoiGianDaoTao/LayDanhSach (GET) · năm pkg_kehoach_thongtin.LayDSNamNhapHoc
       Xem học phần của lớp  D_HocPhan_TraCuuDiem/LayDanhSach (GET)
       Xem bảng điểm  D_HocPhan_TraCuuDiem/LayChiTiet_Post (POST, không func): rsDSCotThongTinDiemHocPhan (cây MACOT/MACOT_CHA),
                      rsDSCotThongTinNguoiHoc, rsDSCotThongTinDTB → D_LopQuanLy_NguoiHoc/LayDanhSach (GET) → MỖI cột lá
                      D_LopQuanLy_Diem/LayGiaTriDiemTheoLopQuanLy (GET, '#' → xuống dòng) + D_LopQuanLy_DiemTrungBinh/LayGiaTriDiemTBTheoLopQuanLy (GET)
       Thống kê       SV_XepLoaiHocTap_Chung_MH · PKG_XEPLOAIHOCTAP_CHUNG.LayDMXepLoaiHocTap →
                      ngành: KHCT_ThongTin_MH · PKG_KEHOACH_THONGTIN.LayDSKS_Nganh_KhoaDaoTao → MỖI (ngành × khoá × xếp loại)
                             SV_XepLoaiHocTap_BaoCao_MH · PKG_XEPLOAIHOCTAP_BAOCAO.LayDS_ThongKe_XLHT_KetQua (đếm dòng)
                      CTĐT:  PKG_KEHOACH_THONGTIN.LayDSKS_CTDT_KhoaDaoTao → LayDS_ThongKe_XLHT_CTDT_KetQua
       Export         edu.system.reportAllTable_User(bảng) → ums.report.taiBangNhap
       Báo cáo (getList_MauImport "zonebtnBaoCao_TCD"): từng lớp một strDaoTao_LopQuanLy_Id, rồi action, strNguoiThucHien_Id, strHeDaoTao_Id…
                      strDaoTao_HocPhan_Ids (quá 100 học phần thì chặn như gốc).
   Khác bản gốc:
     · Hệ → Khoá → CT → Lớp KHOÁ theo luật cha → con (gốc nạp sẵn mọi khoá); Khoa QL là cha TUỲ CHỌN của CT + Lớp.
     · Số học phần của "Danh sách bảng điểm" gốc ghi vào #lblTraCuuDiem_Tong (không tồn tại) → nay hiện.
     · "Số - Xem" của thống kê: hộp danh sách dùng lại KẾT QUẢ của lời gọi đếm (gốc gọi lại y hệt lần nữa).
     · Thống kê: ô lỗi hiện "-" như gốc; lời gọi chạy tối đa 10 cùng lúc (makeRequest gốc giới hạn 10 luồng).
     · Bảng điểm: cột thông tin người học dính trái khi cuộn ngang như gốc (sticky-col); thanh cuộn ngang phía trên
       + bản sao tiêu đề khi cuộn (actionTable_NguoiHoc) KHÔNG chép — .ums-tablewrap kéo chuột để vuốt.
     · Kiểu ô từ cấu hình (DORONG, KICHTHUOCFONTCHU, CANLE, MAMAUHIENTHI, CHUDAM): tiêu đề chỉ lấy độ rộng; ô điểm lấy đủ như getstyledata.
   Giữ như gốc (ghi _cq): ô "Thông tin tìm kiếm" và "Thang điểm" KHÔNG gửi vào lời gọi nào; "Nhiều kỳ" chọn MỘT, "Năm học" / "Học kỳ" chọn nhiều.
   Bỏ: reportAllTable (hàm chết), getList_NguoiHoc_Diem (không nơi nào gọi), plugin bootstrap-colorselector (không dùng), MutationObserver tính sticky.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('qld-tracuudiem');
    var $ = window.jQuery;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function hong(t) { return function (err) { ums.api.handle(err, t); }; }
    function sel(k, ph, o) {
        o = o || {};
        return '<div class="ums-field' + (o.cls ? ' ' + o.cls : '') + '"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (o.one ? '' : ' multiple') + '>' +
            (o.opts || (o.one ? '<option value=""></option>' : '')) + '</select></div>';
    }
    /** Chạy fn cho từng phần tử, tối đa n cùng lúc (makeRequest gốc giới hạn 10 luồng) */
    function pool(ds, fn, n) {
        var i = 0;
        function chay() { if (i >= ds.length) return Promise.resolve(); var x = ds[i++]; return Promise.resolve().then(function () { return fn(x); }).catch(function () {}).then(chay); }
        var p = []; for (var k = 0; k < Math.min(n || 10, ds.length); k++) p.push(chay());
        return Promise.all(p);
    }
    function khung(z, title, icon, bang) {
        return '<div data-z="' + z + '" hidden>' + pat.panel({ title: title, icon: icon, flush: true,
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('excel', { text: 'Export', attr: { 'data-xuat': bang } }),
            body: '<div class="ums-u-fz13 ums-u-muted tcd-tien" data-z="' + z + '_tien"></div><div data-z="' + z + '_bang"></div>' }) + '</div>';
    }

    root.innerHTML = pat.page('Tra cứu điểm', '<span data-z="bc"></span>') +
        '<div data-z="main">' +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' + sel('he', 'Chọn hệ đào tạo') + sel('khoa', 'Chọn khóa đào tạo') + sel('kql', 'Chọn khoa quản lý') + sel('ct', 'Chọn chương trình đào tạo') + '</div>' +
            '<div class="ums-filter ums-u-mt-2">' + sel('lop', 'Chọn lớp quản lý') + sel('tt', 'Chọn tình trạng sinh viên') + sel('thang', 'Chọn thang điểm') +
                sel('loc', 'Chọn lọc theo', { opts: '<option value="HOCPHAN_CHUONGTRINH">Học phần - chương trình</option><option value="HOCPHAN_LOP">Học phần - lớp</option><option value="DULIEUDIEM">Kết quả điểm</option>' }) + '</div>' +
            '<div class="ums-filter ums-u-mt-2">' + sel('pv', 'Chọn phạm vi tổng hợp', { one: true }) +
                '<span class="ums-u-fz13 ums-u-semi tcd-pv" data-pv="TOANKHOA" hidden>Toàn khóa</span>' +
                '<span class="tcd-pv" data-pv="NHIEUKY" hidden>' + sel('pv_NHIEUKY', 'Chọn kỳ', { one: true }) + '</span>' +
                '<span class="tcd-pv" data-pv="NAMHOC" hidden>' + sel('pv_NAMHOC', 'Chọn năm học') + '</span>' +
                '<span class="tcd-pv" data-pv="HOCKY" hidden>' + sel('pv_HOCKY', 'Chọn học kỳ') + '</span>' +
                '<span class="tcd-pv" data-pv="DOTHOC" hidden>' + sel('pv_DOTHOC', 'Chọn đợt học', { one: true }) + '</span>' +
                '<div class="ums-field tcd-q"><input class="ums-input" data-f="q" placeholder="Nhập mã số hoặc tên" autocomplete="off"></div></div>' +
            '<div class="ums-row ums-u-mt-3 tcd-nut">' +
                ui.btn('search', { text: 'Xem học phần của lớp', attr: { 'data-a': 'hoc' } }) +
                ui.btn('view', { text: 'Xem bảng điểm', mod: 'danger', attr: { 'data-a': 'bangdiem' } }) +
                '<span class="tcd-vach"></span>' +
                ui.btn('search', { text: 'Thống kê theo ngành', icon: 'fa-chart-column', mod: 'warn', attr: { 'data-a': 'tkn' } }) +
                ui.btn('search', { text: 'Thống kê theo CTĐT', icon: 'fa-chart-column', mod: 'warn', attr: { 'data-a': 'tkc' } }) + '</div>' }) +
        pat.panel({ title: 'Danh sách bảng điểm', icon: 'fa-list-timeline', count: 'n', flush: true,
            body: '<div data-z="ds">' + ui.empty('Chọn lớp rồi bấm "Xem học phần của lớp".', 'fa-book-open-cover') + '</div>' }) +
        '</div>' +
        khung('bd', 'Bảng điểm', 'fa-book-open-reader', 'tblTraCuuDiem') +
        khung('tkn', 'Thống kê học tập theo ngành', 'fa-chart-column', 'tblThongKeHocTap') +
        khung('tkc', 'Thống kê học tập theo CTĐT', 'fa-chart-column', 'tblThongKeHocTapCTDT');
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    var dangMo = 'main';
    function moKhung(k) {
        if (k === dangMo) return;
        ui.swap(z(dangMo), z(k));
        dangMo = k;
    }

    /* ---------- Bộ lọc ------------------------------------------------------ */
    var NAP = {
        khoa: function () {
            return ums.ref.khoaDaoTao({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA' }); }).catch(hong('khóa đào tạo'));
        },
        ct: function () {
            return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: v('kql'), strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('ct'), d, { name: function (x) { return e(x.TENCHUONGTRINH) + (e(x.MACHUONGTRINH) ? ' - ' + x.MACHUONGTRINH : ''); } }); }).catch(hong('chương trình đào tạo'));
        },
        lop: function () {
            return ums.api.call({ action: 'KHCT_LopQuanLy/LayDanhSach', method: 'GET', silent: true, strTuKhoa: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_Nganh_Id: v('ct'), strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql'),
                strNhomlop_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 })
                .then(function (r) { pat.fill(f('lop'), arr(r.data), { name: 'TEN' }); }).catch(hong('lớp quản lý'));
        }
    };
    function chuoi(ks) { return ks.reduce(function (p, k) { return p.then(NAP[k]); }, Promise.resolve()); }
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(hong('hệ đào tạo'));
    ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d); }).catch(hong('khoa quản lý'));
    NAP.khoa();
    var DOI = { he: ['khoa', 'lop'], khoa: ['ct', 'lop'], ct: ['lop'], kql: ['ct', 'lop'] };
    if ($) Object.keys(DOI).forEach(function (k) {
        $(f(k)).on('select2:select select2:unselect select2:clear', function () {
            if (k === 'kql') ['ct', 'lop'].forEach(function (c) { $(f(c)).val([]).trigger('change.select2').trigger('ums:refresh'); });
            setTimeout(function () { chuoi(DOI[k]); }, 0);   // sau khi pat.chain xoá trắng ô con
        });
    });
    var cHe = pat.chain([f('he'), f('khoa'), f('ct'), f('lop')], { phatLai: false });
    if ($) $(f('kql')).on('select2:select select2:unselect select2:clear', function () { setTimeout(cHe.sync, 0); });
    ums.api.dm('QLSV.TRANGTHAI').then(function (d) { pat.fill(f('tt'), d); }).catch(hong('tình trạng sinh viên'));
    ums.api.dm('DIEM.THANGDIEM').then(function (d) { pat.fill(f('thang'), d); }).catch(hong('thang điểm'));
    var PV = [], pvMa = '';
    ums.api.dm('DIEM.PHAMVITONGHOPDIEM').then(function (d) { PV = d || []; pat.fill(f('pv'), PV, { head: 'Chọn phạm vi' }); }).catch(hong('phạm vi tổng hợp'));
    ums.api.call({ action: 'D_ThoiGianDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_Nam_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 10000 })
        .then(function (r) { ['pv_HOCKY', 'pv_NHIEUKY', 'pv_DOTHOC'].forEach(function (k) { pat.fill(f(k), arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); }); })
        .catch(hong('thời gian đào tạo'));
    ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIPICwPKSAxCS4i', func: 'pkg_kehoach_thongtin.LayDSNamNhapHoc', strNguoiThucHien_Id: uid() })
        .then(function (r) { pat.fill(f('pv_NAMHOC'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC' }); }).catch(hong('năm nhập học'));
    function tgPV() { return pvMa && f('pv_' + pvMa) ? v('pv_' + pvMa) : ''; }
    if ($) $(f('pv')).on('select2:select select2:clear', function () {
        var p = PV.filter(function (x) { return String(x.ID) === v('pv'); })[0];
        pvMa = p ? e(p.MA) : '';
        Array.prototype.forEach.call(root.querySelectorAll('[data-pv]'), function (s) { s.hidden = s.getAttribute('data-pv') !== pvMa; });
    });

    /* ---------- Danh sách bảng điểm (học phần của lớp) --------------------- */
    var HOC = [];
    function hocChon() {
        return Array.prototype.filter.call(z('ds').querySelectorAll('input[data-hp]:checked'), function (c) { return !c.closest('thead'); })
            .map(function (c) { return HOC[Number(c.getAttribute('data-hp'))]; }).filter(Boolean).map(function (x) { return x.ID; });
    }
    function taiHoc() {
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'D_HocPhan_TraCuuDiem/LayDanhSach', method: 'GET', strNguoiThucHien_Id: uid(), strDaoTao_LopQuanLy_Id: v('lop'), strPhamViTongHopDiem_Id: v('pv'),
            strDaoTao_ThoiGianDaoTao_Id: tgPV(), strKieuLocDuLieu: v('loc'), strDaoTao_HocPhan_Ids: '' }).then(function (r) {
            HOC = arr(r.data);
            z('n').textContent = '(' + (Number(r.pager) || HOC.length) + ')';
            ui.table({ el: z('ds'), rows: HOC, empty: 'Không có học phần', columns: [
                { title: 'Mã', prop: 'MA', cls: 'is-nowrap', width: '160px' }, { title: 'Tên', prop: 'TEN' },
                { head: '<input type="checkbox" data-hp="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-hp="' + i + '">'; } }] });
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'D_HocPhan_TraCuuDiem/LayDanhSach'); });
    }
    ums.report.mount(z('bc'), { import: false, collect: function (add) {
        var ids = hocChon();
        if (ids.length > 100) { ui.toast('Số học phần được chọn không quá 100? Để xem cả lớp vui lòng không chọn học phần!', 'warn'); return false; }
        (($ && $(f('lop')).val()) || []).forEach(function (x) { if (x !== '' && x !== 'SELECTALL') add('strDaoTao_LopQuanLy_Id', x); });
        add('action', 'D_HocPhan_TraCuuDiem/LayDanhSach');
        add('strNguoiThucHien_Id', uid());
        add('strHeDaoTao_Id', v('he')); add('strKhoaDaoTao_Id', v('khoa')); add('strKhoaQuanLy_Id', v('kql')); add('strToChucCT_Id', v('ct'));
        add('strTinhTrangSinhVien_Id', v('tt')); add('strPhamViTongHopDiem_Id', v('pv')); add('strDaoTao_ThoiGianDaoTao_Id', tgPV());
        add('strKieuLocDuLieu', v('loc')); add('strChucNang_Id', cn()); add('strDaoTao_HocPhan_Ids', ids.join(','));
    } });

    /* ---------- Bảng điểm: tiêu đề nhiều tầng + điền từng cột -------------- */
    function kieu(r, oDiem) {
        var s = '';
        if (Number(r.DORONG)) s += 'width:' + Number(r.DORONG) + 'px;';
        if (Number(r.KICHTHUOCFONTCHU)) s += 'font-size:' + Number(r.KICHTHUOCFONTCHU) + 'px;';
        if (e(r.CANLE)) s += r.CANLE + ';';
        if (e(r.MAMAUHIENTHI)) s += 'color:#' + r.MAMAUHIENTHI + ';';
        if (e(r.CHUDAM)) s += r.CHUDAM + ';';
        if (oDiem) s += 'text-align:center;';
        return s;
    }
    function bangDiem() {
        var ids = hocChon();
        moKhung('bd');
        z('bd_tien').textContent = '';
        z('bd_bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'D_HocPhan_TraCuuDiem/LayChiTiet_Post', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(), strDaoTao_LopQuanLy_Id: v('lop'),
            strPhamViTongHopDiem_Id: v('pv'), strDaoTao_ThoiGianDaoTao_Id: tgPV(), strKieuLocDuLieu: v('loc'), strDaoTao_HocPhan_Ids: ids.join(',') }).then(function (r) {
            var d = r.data || {}, cot = arr(d.rsDSCotThongTinDiemHocPhan);
            if (!cot.length) {
                moKhung('main');
                ui.toast('Không có cột điểm để hiển thị. Vui lòng chọn "Lọc theo" và tick ít nhất 1 học phần trong Danh sách bảng điểm, sau đó thử lại.', 'warn');
                return;
            }
            veBangDiem(cot, arr(d.rsDSCotThongTinNguoiHoc), arr(d.rsDSCotThongTinDTB), ids);
        }).catch(function (err) { z('bd_bang').innerHTML = ui.fail(err.message); });
    }
    function veBangDiem(cot, cotNH, cotTB, ids) {
        /* Cây cột: gốc là MACOT_CHA rỗng; lá (không con) theo thứ tự duyệt sâu như recuseHeader */
        function con(ma) { return cot.filter(function (c) { return (c.MACOT_CHA || null) === ma; }); }
        var la = [];
        (function duyet(ma, tren) {
            con(ma).forEach(function (c) {
                if (con(c.MACOT).length) duyet(c.MACOT, tren.concat([e(c.TENCOT)]));
                else la.push({ c: c, group: tren });
            });
        })(null, []);
        var columns = cotNH.map(function (c, k) {
            return { title: e(c.TENCOT), cls: 'tcd-dinh tcd-dinh-' + k, width: Number(c.DORONG) ? Number(c.DORONG) + 'px' : undefined, render: function (x) { return esc(e(x[c.MACOT])); } };
        }).concat(la.map(function (l) {
            return { title: e(l.c.TENCOT), group: l.group, cls: 'is-center', render: function (x) {
                return '<div class="tcd-o" data-o="' + esc(e(x.QLSV_NGUOIHOC_ID) + '_' + e(l.c.MACOT)) + '" style="' + esc(kieu(l.c, true)) + '"></div>'; } };
        }), cotTB.map(function (c) {
            return { title: e(c.MACOT), cls: 'is-center', render: function (x) {
                return '<div class="tcd-o" data-o="' + esc(e(x.QLSV_NGUOIHOC_ID) + '_' + e(c.MACOT)) + '" style="' + esc(kieu(c, true)) + '"></div>'; } };
        }));
        ums.api.call({ action: 'D_LopQuanLy_NguoiHoc/LayDanhSach', method: 'GET', strNguoiThucHien_Id: uid(), strDaoTao_LopQuanLy_Id: v('lop') }).then(function (r) {
            var nh = arr(r.data);
            ui.table({ el: z('bd_bang'), rows: nh, stt: false, empty: 'Lớp chưa có người học', tableCls: 'ums-table--lined tcd-bang', columns: columns });
            var tbl = z('bd_bang').querySelector('table');
            if (tbl) tbl.id = 'tblTraCuuDiem';
            dinhCot(tbl, cotNH.length);
            var O = {};
            Array.prototype.forEach.call(z('bd_bang').querySelectorAll('[data-o]'), function (o) { O[o.getAttribute('data-o')] = o; });
            var xong = 0, tong = la.length + 1;
            function dem() { xong++; z('bd_tien').textContent = xong < tong ? 'Đang nạp điểm: ' + xong + '/' + tong + ' cột' : ''; }
            z('bd_tien').textContent = 'Đang nạp điểm: 0/' + tong + ' cột';
            pool(la, function (l) {
                return ums.api.call({ action: 'D_LopQuanLy_Diem/LayGiaTriDiemTheoLopQuanLy', method: 'GET', silent: true, strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
                    strDaoTao_HocPhan_Id: ids.join(','), strDaoTao_LopQuanLy_Id: v('lop'), strKyHieuCotDuLieu: l.c.MACOT }).then(function (y) {
                    arr(y.data).forEach(function (g) { var o = O[e(g.QLSV_NGUOIHOC_ID) + '_' + l.c.MACOT]; if (o) o.innerHTML = esc(e(g.GIATRICOTDULIEU)).replace(/#/g, '<br>'); });
                }).then(dem, dem);
            }, 10).then(function () {
                return ums.api.call({ action: 'D_LopQuanLy_DiemTrungBinh/LayGiaTriDiemTBTheoLopQuanLy', method: 'GET', silent: true, strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
                    strDaoTao_LopQuanLy_Id: v('lop'), strPhamViTongHopDiem_Id: v('pv'), strDaoTao_ThoiGianDaoTao_Id: tgPV() }).then(function (y) {
                    arr(y.data).forEach(function (g) { Object.keys(g).forEach(function (k) { var o = O[e(g.QLSV_NGUOIHOC_ID) + '_' + k]; if (o) o.textContent = e(g[k]); }); });
                }).then(dem, dem);
            }).then(function () { dinhCot(tbl, cotNH.length); });
        }).catch(function (err) { z('bd_bang').innerHTML = ui.fail(err.message); });
    }
    /* Cột thông tin người học dính trái khi cuộn ngang (sticky-col của gốc): left = tổng bề rộng các cột trước */
    function dinhCot(tbl, n) {
        if (!tbl || !n) return;
        var trai = 0;
        for (var k = 0; k < n; k++) {
            var o = tbl.querySelectorAll('.tcd-dinh-' + k);
            if (!o.length) break;
            var w = o[0].offsetWidth;
            Array.prototype.forEach.call(o, function (x) { x.style.left = trai + 'px'; x.classList.toggle('tcd-dinh--cuoi', k === n - 1); });
            trai += w;
        }
    }

    /* ---------- Thống kê theo ngành / theo CTĐT ---------------------------- */
    var TK = {
        tkn: { ds: ['KHCT_ThongTin_MH/DSA4BRIKEh4PJiAvKR4KKS4gBSAuFSAu', 'PKG_KEHOACH_THONGTIN.LayDSKS_Nganh_KhoaDaoTao'],
            dem: ['SV_XepLoaiHocTap_BaoCao_MH/DSA4BRIeFSkuLyYKJB4ZDQkVHgokNRA0IAPP', 'PKG_XEPLOAIHOCTAP_BAOCAO.LayDS_ThongKe_XLHT_KetQua'],
            nhan: 'Ngành học', khoaCot: 'strDaoTao_N_CN_Id',
            id: function (x) { return x.DAOTAO_N_CN_ID || x.DaoTao_N_CN_Id || ''; },
            ten: function (x) { return x.DAOTAO_N_CN_TEN || x.DaoTao_N_CN_Ten || ''; } },
        tkc: { ds: ['KHCT_ThongTin_MH/DSA4BRIKEh4CFQUVHgopLiAFIC4VIC4P', 'PKG_KEHOACH_THONGTIN.LayDSKS_CTDT_KhoaDaoTao'],
            dem: ['SV_XepLoaiHocTap_BaoCao_MH/DSA4BRIeFSkuLyYKJB4ZDQkVHgIVBRUeCiQ1EDQg', 'PKG_XEPLOAIHOCTAP_BAOCAO.LayDS_ThongKe_XLHT_CTDT_KetQua'],
            nhan: 'CTĐT', khoaCot: 'strDaoTao_ChuongTrinh_Id',
            id: function (x) { return x.DAOTAO_CHUONGTRINH_ID || x.DaoTao_ChuongTrinh_Id || x.ID || x.Id || ''; },
            ten: function (x) {
                var ma = x.MACHUONGTRINH || x.DAOTAO_CHUONGTRINH_MA || x.DaoTao_ChuongTrinh_Ma || '';
                return e(x.TENCHUONGTRINH || x.DAOTAO_CHUONGTRINH_TEN || x.DaoTao_ChuongTrinh_Ten || '') + (ma ? '(' + ma + ')' : '');
            } }
    };
    function kdId(x) { return x.DAOTAO_KHOADAOTAO_ID || x.DaoTao_KhoaDaoTao_Id || ''; }
    function kdTen(x) { return x.DAOTAO_KHOADAOTAO_TEN || x.DaoTao_KhoaDaoTao_Ten || ''; }
    function xlId(x) { return x.ID || x.Id || ''; }
    function xlTen(x) { return x.TEN || x.Ten || x.TENXEPLOAI || ''; }
    function tongSV(x) { return Number(x.TONGSOSV || x.TongSoSV || 0) || 0; }
    var KQ = {};   // khoá ô → danh sách SV (dùng lại cho hộp "Xem")
    function thongKe(k) {
        var c = TK[k];
        moKhung(k);
        z(k + '_tien').textContent = '';
        z(k + '_bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var XL = [];
        ums.api.call({ action: 'SV_XepLoaiHocTap_Chung_MH/DSA4BQwZJDENLiAoCS4iFSAx', func: 'PKG_XEPLOAIHOCTAP_CHUNG.LayDMXepLoaiHocTap',
            strNguoiThucHien_Id: uid(), strChucNangHeThong_Id: cn(), strHanhDong_Code: '' }).then(function (r) {
            XL = arr(r.data);
            return ums.api.call({ action: c.ds[0], func: c.ds[1], strTuKhoa: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_N_CN_Id: v('ct'),
                strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_ToChucCT_Cha_Id: '', strTrangThaiNguoiHoc_Id: v('tt'), strNguoiThucHien_Id: uid(), strChucNang_Id: cn(), pageIndex: 1, pageSize: 10000 });
        }).then(function (r) {
            var ds = arr(r.data).slice().sort(function (a, b) { var x = c.id(a), y = c.id(b); return x < y ? -1 : x > y ? 1 : 0; });
            var nhom = [], theo = {};
            ds.forEach(function (x) { var id = c.id(x); if (!theo[id]) { theo[id] = { row: x, rows: [] }; nhom.push(theo[id]); } theo[id].rows.push(x); });
            nhom.forEach(function (g, i) { g.stt = i + 1; });
            function o(x, xl) { return k + '|' + c.id(x) + '|' + kdId(x) + '|' + xlId(xl); }
            pat.groupTable({ el: z(k + '_bang'), groups: nhom, empty: 'Không có dữ liệu',
                head: [[{ title: '', colspan: 4 }].concat(XL.map(function (xl) { return { title: xlTen(xl), colspan: 2 }; }))],
                groupCols: [{ title: 'STT', cls: 'is-center', render: function (row, g) { return g.stt; } }, { title: c.nhan, render: function (row) { return esc(c.ten(row)); } }],
                cols: [{ title: 'Khóa học', render: function (x) { return esc(kdTen(x)); } }, { title: 'Số lượng SV', cls: 'is-center', render: function (x) { return tongSV(x); } }]
                    .concat([].concat.apply([], XL.map(function (xl) {
                        return [{ title: 'Sinh viên', cls: 'is-center', render: function (x) { return '<span data-tk="' + esc(o(x, xl)) + '_SL"></span>'; } },
                            { title: 'Tỷ lệ (%)', cls: 'is-center', render: function (x) { return '<span data-tk="' + esc(o(x, xl)) + '_TL"></span>'; } }];
                    }))) });
            var tbl = z(k + '_bang').querySelector('table');
            if (tbl) tbl.id = k === 'tkn' ? 'tblThongKeHocTap' : 'tblThongKeHocTapCTDT';
            var O = {};
            Array.prototype.forEach.call(z(k + '_bang').querySelectorAll('[data-tk]'), function (s) { O[s.getAttribute('data-tk')] = s; });
            var viec = [];
            ds.forEach(function (x) { XL.forEach(function (xl) { viec.push([x, xl]); }); });
            if (!viec.length) return;
            var xong = 0;
            return pool(viec, function (p) {
                var x = p[0], xl = p[1], khoa = o(x, xl), n = tongSV(x);
                var goi = { action: c.dem[0], func: c.dem[1], strNguoiThucHien_Id: uid(), strChucNangHeThong_Id: cn(), strHanhDong_Code: '',
                    strDaoTao_ThoiGianDaoTao_Id: tgPV(), strXepLoai_Id: xlId(xl), strTrangThaiNguoiHoc_Id: v('tt'), silent: true };
                goi[c.khoaCot] = c.id(x);
                goi.strDaoTao_KhoaDaoTao_Id = kdId(x);
                return ums.api.call(goi).then(function (y) {
                    var sv = arr(y.data), dem = sv.length;
                    KQ[khoa] = { ds: sv, tieuDe: xlTen(xl) + ' - ' + c.ten(x) + ' - ' + kdTen(x) };
                    if (O[khoa + '_SL']) O[khoa + '_SL'].innerHTML = '<a href="javascript:void(0)" data-xem="' + esc(khoa) + '">' + dem + ' - Xem</a>';
                    if (O[khoa + '_TL']) O[khoa + '_TL'].textContent = n > 0 ? Math.round(10000 * dem / n) / 100 : 0;
                }, function () {
                    if (O[khoa + '_SL']) O[khoa + '_SL'].textContent = '-';
                    if (O[khoa + '_TL']) O[khoa + '_TL'].textContent = '-';
                }).then(function () { xong++; z(k + '_tien').textContent = xong < viec.length ? 'Đang thống kê: ' + xong + '/' + viec.length : ''; });
            }, 10);
        }).catch(function (err) { z(k + '_bang').innerHTML = ui.fail(err.message); });
    }
    function xemDS(khoa) {
        var t = KQ[khoa]; if (!t) return;
        function pick(d, ks) { for (var i = 0; i < ks.length; i++) if (d[ks[i]] !== undefined && d[ks[i]] !== null) return d[ks[i]]; return ''; }
        var dlg = ui.dialog({ title: 'Danh sách sinh viên — ' + t.tieuDe + ' (' + t.ds.length + ')', icon: 'fa-users', size: 'xl', body: '<div data-x="b"></div>' });
        ui.table({ el: dlg.body.querySelector('[data-x="b"]'), rows: t.ds, empty: 'Không có sinh viên', columns: [
            { title: 'Mã SV', cls: 'is-center is-nowrap', render: function (d) { return esc(pick(d, ['QLSV_NGUOIHOC_MASO', 'QLSV_NguoiHoc_MaSo'])); } },
            { title: 'Họ đệm', render: function (d) { return esc(pick(d, ['QLSV_NGUOIHOC_HODEM', 'QLSV_NguoiHoc_HoDem'])); } },
            { title: 'Tên', render: function (d) { return esc(pick(d, ['QLSV_NGUOIHOC_TEN', 'QLSV_NguoiHoc_Ten'])); } },
            { title: 'Giới tính', cls: 'is-center', render: function (d) { return esc(pick(d, ['GIOITINH_TEN', 'GioiTinh_Ten'])); } },
            { title: 'Xếp loại', render: function (d) { return esc(pick(d, ['XEPLOAI_TEN', 'XepLoai_Ten'])); } },
            { title: 'Học kỳ', render: function (d) { return esc(pick(d, ['THOIGIANDAOTAO_TEN', 'ThoiGianDaoTao_Ten'])); } },
            { title: 'Trạng thái', render: function (d) { return esc(pick(d, ['TRANGTHAINGUOIHOC_TEN', 'TrangThaiNguoiHoc_Ten'])); } },
            { title: 'Lớp quản lý', render: function (d) { return esc(pick(d, ['DAOTAO_LOPQUANLY_TEN', 'DaoTao_LopQuanLy_Ten'])); } },
            { title: 'Chương trình đào tạo', render: function (d) { var ma = pick(d, ['DAOTAO_CHUONGTRINH_MA', 'DaoTao_ChuongTrinh_Ma']);
                return esc(e(pick(d, ['DAOTAO_CHUONGTRINH_TEN', 'DaoTao_ChuongTrinh_Ten'])) + (ma ? ' (' + ma + ')' : '')); } },
            { title: 'Khóa đào tạo', render: function (d) { return esc(pick(d, ['DAOTAO_KHOADAOTAO_TEN', 'DaoTao_KhoaDaoTao_Ten'])); } }] });
    }

    /* ---------- Sự kiện ------------------------------------------------------ */
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.getAttribute && t.getAttribute('data-hp') === 'all') {
            Array.prototype.forEach.call(z('ds').querySelectorAll('tbody input[data-hp]'), function (c) { c.checked = t.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        var x = ev.target.closest('[data-xem]');
        if (x) { ev.preventDefault(); xemDS(x.getAttribute('data-xem')); return; }
        var xb = ev.target.closest('[data-xuat]');
        if (xb) { var tb = document.getElementById(xb.getAttribute('data-xuat')); if (tb) ums.report.taiBangNhap(tb); else ui.toast('Chưa có bảng để xuất.', 'warn'); return; }
        var b = ev.target.closest('[data-a]'); if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'hoc') taiHoc();
        else if (a === 'bangdiem') bangDiem();
        else if (a === 'tkn' || a === 'tkc') thongKe(a);
        else if (a === 'dong') moKhung('main');
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); taiHoc(); } });
})();
