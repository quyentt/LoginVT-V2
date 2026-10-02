/* =========================================================================
   Chương trình học — Cổng sinh viên › Học tập (vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/hoctap/html/chuontrinhhoc.html
            + ApisCongSinhVien/Modules/hoctap/script/chuongtrinhhoc.js (vỏ index / Core)
   ⚠ Tên tệp gốc viết SAI chính tả và lệch nhau (html "chuontrinhhoc" ↔ .js
     "chuongtrinhhoc"); bản mới đặt cả hai theo tên HTML: chuontrinhhoc.html + chuontrinhhoc.js.
   ---------------------------------------------------------------------------
   Bố cục giữ nguyên bản gốc, HAI cột (col-md-9 | col-md-3):
     · trái  — khung "Nội dung học phần theo chương trình" (ô chọn Chương trình ở đầu khung,
               bảng học phần, chân khung "Tổng số tín chỉ")
     · phải  — "Các khối lựa chọn bắt buộc" và "Các khối lựa chọn đơn"; bấm một khối
               mở hộp danh sách học phần của khối đó
   Hai modal của bản gốc → ums.ui.dialog: chi tiết học phần (study_program) và
   học phần theo khối (khoikienthucchuyennganh). Cả hai CHỈ XEM (bản gốc cũng vậy).

   Lời gọi (chép nguyên action / func / tên tham số / giá trị cố định):
     DKH_Chung_MH        · pkg_dangkyhoc_chung.LayDSChuongTrinh            (strQLSV_NguoiHoc_Id)
         → ô Chương trình: DAOTAO_TOCHUCCHUONGTRINH_ID / _TEN, TONGSOTINCHIQUYDINH = tổng số tín chỉ
     KHCT_ThongTin_MH    · pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_CT  → bảng học phần
     …                   · LayDSKS_DaoTao_HocPhan_CT_PB                    → số tiết theo loại phân bổ
     …                   · LayDSKS_DaoTao_KhoiBatBuoc / LayDSKS_DaoTao_KhoiTuChon_Don
     …                   · LayDSKS_DaoTao_HP_KhoiBatBuoc / LayDSKS_DaoTao_HP_KTuChon_Don
     …                   · LayDSKS_DaoTao_QuanHeHocPhan / LayDSKS_DaoTao_HocPhanTD / LayDSKS_DaoTao_BaiHoc
     Danh mục KHCT.LOAIPHANBO (loadToCombo_DanhMucDuLieu) → các cột động của bảng (theo MA).

   Khác bản gốc (cách làm, KHÔNG đổi dữ liệu gửi đi):
     · Bảng vẽ bằng ums.ui.table; cột động của từng loại phân bổ vẫn là một ô trống được
       điền sau (bản gốc dùng <div id="div_<ID>_<LOAIPHANBO_ID>">, ở đây là data-z="pb_…").
     · Bản gốc gọi LayDSKS_DaoTao_HocPhan_CT_PB cho TỪNG dòng và bắn hết cùng lúc
       (chương trình 100 học phần = 100 lời gọi song song). Giữ nguyên lời gọi từng dòng
       (đúng tham số), nhưng chạy tối đa 6 lời gọi một lúc và bỏ dở khi người dùng đổi chương trình.
     · Bản gốc ép chiều cao bảng + cuộn trong khung (window.innerHeight - offset - 117) — BỎ,
       _v2 không cuộn bên trong (BO-CUC quy ước 7), cuộn cả trang.
     · Nút cột "Chi tiết" của bản gốc vẽ biểu tượng BÚT SỬA (title "Sửa") tuy hộp chỉ để XEM →
       đổi sang biểu tượng con mắt "Xem chi tiết"; không đổi hành vi.
     · strNguoiThucHien_Id: bản gốc chỗ gửi rỗng, chỗ gửi edu.system.userId → để api.js tự điền
       (userId của phiên = id người học đang thủ vai), như các màn Cổng sinh viên đã chuyển.
     · Bản gốc để trống khối "Quan hệ học phần / tương đương / Bài học" khi không có dữ liệu →
       bản mới ghi "Không có dữ liệu".

   Kéo gốc 30/9 (git fed68f6e..HEAD, chuongtrinhhoc.js +20/−13, html +19):
     · Ô tìm "Tìm theo mã hoặc tên học phần..." (gốc #txtSearch_HocPhan, cạnh ô Chương trình ở đầu
       khung) lọc TẠI CHỖ theo DAOTAO_HOCPHAN_MA / DAOTAO_HOCPHAN_TEN, không phân biệt hoa thường (vẫn
       phân biệt dấu) như gốc (toLowerCase + indexOf), không gọi máy chủ.
     · Chân khung "Tổng số tín chỉ" nay là TỔNG HOCTRINHAPDUNGHOCTAP (ép số, bỏ ô không phải số)
       của các dòng đang hiện — như gốc: lúc đổi chương trình vẫn hiện TONGSOTINCHIQUYDINH, vẽ xong
       bảng thì thay bằng tổng; đang lọc thì là tổng của các dòng lọc.
     Khác gốc: gốc lọc xong vẽ lại bảng rồi gọi lại LayDSKS_DaoTao_HocPhan_CT_PB cho từng dòng lọc
       (gõ mỗi phím là N lời gọi) — ở đây nhớ số tiết đã tải theo dòng, vẽ lại chỉ đổ lại từ bộ nhớ.
       Đổi chương trình thì từ khoá đang gõ vẫn áp cho danh sách mới (gốc giữ chữ trong ô nhưng hiện
       đủ danh sách — lệch nhau).
   Giữ như bản gốc (cần nghiệp vụ xác nhận — xem báo cáo):
     · selectOne của loadToCombo_data đặt giá trị mặc định là mục CUỐI danh sách rồi bắn
       change → mở màn là tự chọn chương trình CUỐI và nạp dữ liệu. Giữ nguyên.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('ht-chuontrinhhoc');
    if (!root) return;

    var SV = (ums.session && ums.session.userId) || '';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var KH = 'KHCT_ThongTin_MH/', P = 'pkg_kehoach_thongtin.';
    var A = {
        chuongTrinh: ['DKH_Chung_MH/DSA4BRICKTQuLyYVMygvKQPP', 'pkg_dangkyhoc_chung.LayDSChuongTrinh'],
        hocPhan:     [KH + 'DSA4BRIKEh4FIC4VIC4eCS4iESkgLx4CFQPP', P + 'LayDSKS_DaoTao_HocPhan_CT'],
        phanBo:      [KH + 'DSA4BRIKEh4FIC4VIC4eCS4iESkgLx4CFR4RAwPP', P + 'LayDSKS_DaoTao_HocPhan_CT_PB'],
        khoiBB:      [KH + 'DSA4BRIKEh4FIC4VIC4eCikuKAMgNQM0LiIP', P + 'LayDSKS_DaoTao_KhoiBatBuoc'],
        khoiTCD:     [KH + 'DSA4BRIKEh4FIC4VIC4eCikuKBU0AikuLx4FLi8P', P + 'LayDSKS_DaoTao_KhoiTuChon_Don'],
        hpKhoiBB:    [KH + 'DSA4BRIKEh4FIC4VIC4eCREeCikuKAMgNQM0LiIP', P + 'LayDSKS_DaoTao_HP_KhoiBatBuoc'],
        hpKhoiTCD:   [KH + 'DSA4BRIKEh4FIC4VIC4eCREeChU0AikuLx4FLi8P', P + 'LayDSKS_DaoTao_HP_KTuChon_Don'],
        quanHe:      [KH + 'DSA4BRIKEh4FIC4VIC4eEDQgLwkkCS4iESkgLwPP', P + 'LayDSKS_DaoTao_QuanHeHocPhan'],
        tuongDuong:  [KH + 'DSA4BRIKEh4FIC4VIC4eCS4iESkgLxUF', P + 'LayDSKS_DaoTao_HocPhanTD'],
        baiHoc:      [KH + 'DSA4BRIKEh4FIC4VIC4eAyAoCS4i', P + 'LayDSKS_DaoTao_BaiHoc']
    };
    function goi(k, ts) {
        return ums.api.call(Object.assign({ action: k[0], func: k[1] }, ts || {}));
    }

    /* ---------- Trạng thái ---------------------------------------------------- */
    var dtChuongTrinh = [];     // danh sách chương trình của người học
    var dtPhanBo = [];          // danh mục KHCT.LOAIPHANBO (cột động của bảng)
    var dtHocPhan = [];         // học phần của chương trình đang chọn
    var soTiet = {};            // ID dòng → { LOAIPHANBO_ID: SOTIET } đã tải (vẽ lại khi lọc không gọi lại)
    var ctId = '';              // strDaoTao_ChuongTrinh_Id / strDaoTao_ToChucCT_Id
    var lanNap = 0;             // đánh dấu lượt nạp, bỏ dở lời gọi của lượt cũ

    /* ---------- Khung màn hình ------------------------------------------------ */
    root.innerHTML =
        pat.page('Chương trình học', '') +
        '<div class="ums-grid ctrh-layout">' +
            '<div>' + pat.panel({
                title: 'Nội dung học phần theo chương trình', icon: 'fa-book-open',
                tools: '<div class="ums-field ctrh-ct"><select class="ums-select" data-f="ct" data-required data-ph="Chọn chương trình"></select></div>' +
                    '<div class="ums-searchbar ums-searchbar--sm ctrh-tim"><span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                    '<input class="ums-searchbar__input" data-f="tim" type="text" autocomplete="off" placeholder="Tìm theo mã hoặc tên học phần..."></div>',
                flush: true,          // khung danh sách: bảng sát mép khung như mọi màn khác
                body: '<div data-z="bang"></div>',
                foot: '<b>Tổng số tín chỉ: <span data-z="tong"></span></b>'
            }) + '</div>' +
            '<div class="ums-stack">' +
                pat.panel({ title: 'Các khối lựa chọn bắt buộc', icon: 'fa-layer-group', flush: true, body: '<div data-z="kbb"></div>' }) +
                pat.panel({ title: 'Các khối lựa chọn đơn', icon: 'fa-layer-group', flush: true, body: '<div data-z="ktcd"></div>' }) +
            '</div>' +
        '</div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var fCT = root.querySelector('[data-f="ct"]');
    var fTim = root.querySelector('[data-f="tim"]');

    /* ---------- Bảng học phần ------------------------------------------------- */
    function cotPhanBo() {
        return dtPhanBo.map(function (pb) {
            return {
                title: e(pb.MA), cls: 'is-center', render: function (r) {
                    return '<span data-z="pb_' + esc(r.ID) + '_' + esc(pb.ID) + '"></span>';
                }
            };
        });
    }
    /* Ô tìm của gốc (#txtSearch_HocPhan): lọc tại chỗ theo mã / tên học phần */
    function dangHien() {
        var k = (fTim.value || '').toLowerCase().trim();
        if (!k) return dtHocPhan;
        return dtHocPhan.filter(function (x) {
            return String(e(x.DAOTAO_HOCPHAN_MA)).toLowerCase().indexOf(k) !== -1 ||
                String(e(x.DAOTAO_HOCPHAN_TEN)).toLowerCase().indexOf(k) !== -1;
        });
    }
    function doSoTiet(r) {
        var m = soTiet[r.ID] || {};
        Object.keys(m).forEach(function (pb) {
            var o = z('pb_' + r.ID + '_' + pb);
            if (o) o.textContent = e(m[pb]);
        });
    }
    function veBang() {
        var rows = dangHien();
        /* Tổng số tín chỉ = cộng HOCTRINHAPDUNGHOCTAP (ép số) của các dòng đang hiện — như gốc 30/9 */
        z('tong').textContent = rows.reduce(function (t, x) { var n = parseFloat(x.HOCTRINHAPDUNGHOCTAP); return isNaN(n) ? t : t + n; }, 0);
        ui.table({
            el: z('bang'), rows: rows, empty: fTim.value.trim() ? 'Không có học phần khớp từ khoá' : 'Chưa có học phần trong chương trình',
            columns: [
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Khối KT', prop: 'KHOIKIENTHUC' },
                { title: 'Số tín học phần', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' },
                { title: 'Số tín học phí', prop: 'HOCTRINHAPDUNGTINHHOCPHI', cls: 'is-center' },
                { title: 'Điều kiện ràng buộc', prop: 'THONGTINQUANHEHOCPHAN', cls: 'is-center' },
                { title: 'Học kỳ dự kiến', prop: 'DAOTAO_THOIGIAN_KEHOACH', cls: 'is-center' },
                { title: 'Học kỳ thực tế', prop: 'DAOTAO_THOIGIAN_THUCTE', cls: 'is-center' }
            ].concat(cotPhanBo()).concat([
                { title: 'Chi tiết', cls: 'is-center is-actions', render: function (r) { return ui.iconBtn('view', r.ID); } }
            ])
        });
        rows.forEach(doSoTiet);
    }

    /** Số tiết theo loại phân bổ — bản gốc gọi cho TỪNG học phần (giữ nguyên tham số),
        ở đây chạy tối đa 6 lời gọi một lúc và dừng khi đổi chương trình. */
    function taiSoTiet(rows, luot) {
        var i = 0;
        function tiep() {
            if (luot !== lanNap || i >= rows.length) return;
            var r = rows[i++];
            goi(A.phanBo, {
                strTuKhoa: '', strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID,
                strDaoTao_ToChucCT_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strLoaiPhanBo_Id: '',
                pageIndex: 1, pageSize: 10000, silent: true
            }).then(function (res) {
                if (luot !== lanNap) return;
                var m = soTiet[r.ID] = {};
                arr(res.data).forEach(function (x) { m[x.LOAIPHANBO_ID] = x.SOTIET; });
                doSoTiet(r);
            }, function () { /* một dòng lỗi không làm hỏng cả bảng, như bản gốc */ })
              .then(tiep);
        }
        for (var k = 0; k < 6; k++) tiep();
    }

    function taiHocPhan(luot) {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        goi(A.hocPhan, {
            strTuKhoa: '', strDaoTao_ThoiGian_KH_Id: '', strDaoTao_ThoiGian_TT_Id: '',
            strThuocTinhHocPhan_Id: '', strPhanCongPhamViDamNhiem_Id: '', strDaoTao_HocPhan_Id: '',
            strDaoTao_ChuongTrinh_Id: ctId, pageIndex: 1, pageSize: 100000000
        }).then(function (r) {
            if (luot !== lanNap) return;
            dtHocPhan = arr(r.data);
            soTiet = {};
            veBang();
            taiSoTiet(dtHocPhan, luot);
        }).catch(function (err) {
            if (luot !== lanNap) return;
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách học phần của chương trình');
        });
    }

    /* ---------- Hai khối ở cột phải ------------------------------------------- */
    function veKhoi(host, data, kieu) {
        if (!data.length) { host.innerHTML = ui.empty('Không có dữ liệu', 'fa-folder-open'); return; }
        host.innerHTML = '<ul class="ctrh-khoi">' + data.map(function (x) {
            var sub;
            if (kieu === 'bb') {
                sub = 'Tổng số HP: ' + e(x.TONGSOHOCPHAN) + '; Tổng số TC: ' + e(x.TONGSOTINCHI);
            } else {
                sub = 'Tổng số HP: ' + e(x.TONGSOHP) + '; \t Tổng số TC: ' + e(x.TONGSOTC) + ';';
                if (x.SOHOCPHANQUYDINH) sub += '\t Số HP bắt buộc: ' + x.SOHOCPHANQUYDINH + ';';
                if (x.SOTINCHIQUYDINH) sub += '\t Số TC bắt buộc: ' + x.SOTINCHIQUYDINH;
            }
            return '<li><button type="button" class="ctrh-khoi__item" data-khoi="' + esc(x.ID) + '" data-kieu="' + kieu +
                '" data-ten="' + esc(e(x.TEN)) + '"><i class="fa-light fa-book"></i><span>' +
                '<span class="ctrh-khoi__name">' + esc(e(x.TEN)) + '</span>' +
                '<span class="ctrh-khoi__sub">(' + esc(sub) + ')</span></span></button></li>';
        }).join('') + '</ul>';
    }

    function taiKhoi(luot) {
        z('kbb').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        z('ktcd').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        goi(A.khoiBB, {
            strTuKhoa: '', strDaoTao_KhoiBatBuoc_Cha_Id: '', strDaoTao_ToChucCT_Id: ctId,
            pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            if (luot === lanNap) veKhoi(z('kbb'), arr(r.data), 'bb');
        }).catch(function (err) {
            if (luot === lanNap) z('kbb').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'khối lựa chọn bắt buộc');
        });
        goi(A.khoiTCD, {
            strTuKhoa: '', strDaoTao_KTuChon_Don_Cha_Id: '', strDaoTao_ToChucCT_Id: ctId,
            strLoaiLuaChon_Id: '', pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            if (luot === lanNap) veKhoi(z('ktcd'), arr(r.data), 'tcd');
        }).catch(function (err) {
            if (luot === lanNap) z('ktcd').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'khối lựa chọn đơn');
        });
    }

    /** Hộp "Học phần của khối" — chung cho khối bắt buộc và khối lựa chọn đơn */
    function moKhoi(id, kieu, ten) {
        var dlg = ui.dialog({
            title: ten || 'Học phần của khối', icon: 'fa-layer-group', size: 'xl',
            body: '<div data-x="ds">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var host = dlg.body.querySelector('[data-x="ds"]');
        var ts = kieu === 'bb'
            ? { strTuKhoa: '', strDaoTao_HocPhan_Id: '', strDaoTao_ToChucCT_Id: ctId, strDaoTao_KhoiBatBuoc_Id: id, pageIndex: 1, pageSize: 100000000 }
            : { strTuKhoa: '', strDaoTao_HocPhan_Id: '', strDaoTao_ToChucCT_Id: ctId, strDaoTao_KTuChon_Don_Id: id, pageIndex: 1, pageSize: 100000000 };
        goi(kieu === 'bb' ? A.hpKhoiBB : A.hpKhoiTCD, ts).then(function (r) {
            if (dlg.closed) return;
            ui.table({
                el: host, rows: arr(r.data), empty: 'Không có học phần',
                columns: [
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' },
                    { title: 'Số tiết', prop: 'TONGSOTIETPHANBO', cls: 'is-center' }
                ]
            });
        }).catch(function (err) {
            if (!dlg.closed) host.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'học phần của khối');
        });
    }

    /* ---------- Hộp chi tiết học phần ----------------------------------------- */
    function kv(nhan, gt) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(e(gt)) + '</b></div>'; }

    function moChiTiet(row) {
        var ct = dtChuongTrinh.filter(function (x) { return String(x.DAOTAO_TOCHUCCHUONGTRINH_ID) === String(ctId); })[0];
        var dlg = ui.dialog({
            title: 'Chương trình "' + e(ct && ct.DAOTAO_TOCHUCCHUONGTRINH_TEN) + '"', icon: 'fa-book-open', size: 'xl',
            body:
                '<div class="ums-legend">Thông tin học phần</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    '<div class="ums-stack ums-stack--tight">' +
                        kv('Mã học phần', row.DAOTAO_HOCPHAN_MA) +
                        kv('Tên học phần học phần', row.DAOTAO_HOCPHAN_TEN) +
                        kv('Số tín học phần', row.HOCTRINHAPDUNGHOCTAP) +
                        kv('Số tín học phí', row.HOCTRINHAPDUNGTINHHOCPHI) +
                        kv('Là môn tính điểm', row.LAMONTINHDIEMTHEOCHUONGTRINH) +
                    '</div>' +
                    '<div class="ums-stack ums-stack--tight">' +
                        kv('Học kỳ dự kiến', row.DAOTAO_THOIGIAN_KEHOACH_TEN) +
                        kv('Học kỳ thực tế', row.DAOTAO_THOIGIAN_THUCTE_TEN) +
                        kv('Thuộc tính học phần', row.THUOCTINHHOCPHAN_TEN) +
                        kv('Phạm vi đảm nhiệm', row.PHANCONGPHAMVIDAMNHIEM_TEN) +
                        kv('Thứ tự', row.THUTU) +
                    '</div>' +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">Quan hệ học phần</div><div data-x="qh"></div>' +
                '<div class="ums-legend ums-legend--cach">Quan hệ tương đương</div><div data-x="td"></div>' +
                '<div class="ums-legend ums-legend--cach">Bài học</div><div data-x="bh"></div>' +
                '<div class="ums-legend ums-legend--cach">Phân bổ học phần</div><div data-x="pb"></div>'
        });
        function x(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        function dangTai(k) { x(k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
        function khoi(k, data, ve) {
            if (dlg.closed) return;
            /* Khối ngắn: báo gọn một dòng, không dựng khung rỗng cao như ums.ui.empty */
            if (!data.length) { x(k).innerHTML = '<div class="ums-u-faint ums-u-fz13">Không có dữ liệu</div>'; return; }
            x(k).innerHTML = data.map(ve).join('');
        }
        ['qh', 'td', 'bh', 'pb'].forEach(dangTai);

        var hpId = row.DAOTAO_HOCPHAN_ID;

        goi(A.quanHe, {
            strTuKhoa: '', strLoaiQuanHe_Id: '', strDaoTao_ToChucCT_Id: ctId,
            strDaoTao_HocPhan_QuanHe_Id: '', strDaoTao_HocPhan_Id: hpId, pageIndex: 1, pageSize: 10000
        }).then(function (r) {
            khoi('qh', arr(r.data), function (o) {
                return '<div class="ums-grid ums-grid--2 ctrh-rel">' +
                    '<div class="ums-stack ums-stack--tight">' + kv('Loại quan hệ', o.LOAIQUANHE_TEN) +
                        kv('Học phần', o.DAOTAO_HOCPHAN_QUANHE_TEN) + kv('Mức', o.MUCDIEUKIEN_TEN) + '</div>' +
                    '<div class="ums-stack ums-stack--tight">' + kv('Toán tử', o.TOANTU_TEN) +
                        kv('Giá trị', o.GIATRIDIEUKIEN) + '</div></div>';
            });
        }).catch(function (err) { if (!dlg.closed) x('qh').innerHTML = ui.fail(err.message); ums.api.handle(err, 'quan hệ học phần'); });

        goi(A.tuongDuong, {
            strTuKhoa: '', strDaoTao_HocPhan_TD_Id: '', strDaoTao_ToChucCT_TD_Id: '',
            strDaoTao_ToChucCT_Id: ctId, strDaoTao_HocPhan_Id: hpId, pageIndex: 1, pageSize: 10000
        }).then(function (r) {
            khoi('td', arr(r.data), function (o) {
                return '<div class="ums-grid ums-grid--2 ctrh-rel">' +
                    '<div class="ums-stack ums-stack--tight">' + kv('Khóa đào tạo', o.DAOTAO_KHOADAOTAO_TD_TEN) +
                        kv('Chương trình', o.DAOTAO_CHUONGTRINH_TD_TEN) + '</div>' +
                    '<div class="ums-stack ums-stack--tight">' + kv('Học phần', o.DAOTAO_HOCPHAN_TD_TEN) + '</div></div>';
            });
        }).catch(function (err) { if (!dlg.closed) x('td').innerHTML = ui.fail(err.message); ums.api.handle(err, 'quan hệ tương đương'); });

        goi(A.baiHoc, {
            strTuKhoa: '', strDaoTao_HocPhan_Id: hpId, strDaoTao_ToChucCT_Id: ctId, pageIndex: 1, pageSize: 10000
        }).then(function (r) {
            khoi('bh', arr(r.data), function (o) {
                return '<div class="ums-grid ums-grid--2 ctrh-rel">' +
                    '<div class="ums-stack ums-stack--tight">' + kv('Tên bài', o.TENBAI) + kv('Ký hiệu', o.KYHIEUBAI) + '</div>' +
                    '<div class="ums-stack ums-stack--tight">' + kv('Số tiết', o.SOTIET) + kv('Nội dung', o.NOIDUNG) + '</div></div>';
            });
        }).catch(function (err) { if (!dlg.closed) x('bh').innerHTML = ui.fail(err.message); ums.api.handle(err, 'bài học'); });

        goi(A.phanBo, {
            strTuKhoa: '', strDaoTao_HocPhan_Id: hpId, strDaoTao_ToChucCT_Id: ctId,
            strLoaiPhanBo_Id: '', pageIndex: 1, pageSize: 10000
        }).then(function (r) {
            if (dlg.closed) return;
            ui.table({
                el: x('pb'), rows: arr(r.data), empty: 'Không có dữ liệu',
                columns: [
                    { title: 'Loại phân bổ', prop: 'LOAIPHANBO_TEN' },
                    { title: 'Số tiết', prop: 'SOTIET', cls: 'is-center', width: '120px' }
                ]
            });
        }).catch(function (err) { if (!dlg.closed) x('pb').innerHTML = ui.fail(err.message); ums.api.handle(err, 'phân bổ học phần'); });
    }

    /* ---------- Chọn chương trình --------------------------------------------- */
    function chonChuongTrinh() {
        ctId = fCT.value;
        var ct = dtChuongTrinh.filter(function (x) { return String(x.DAOTAO_TOCHUCCHUONGTRINH_ID) === String(ctId); })[0];
        z('tong').textContent = e(ct && ct.TONGSOTINCHIQUYDINH);
        lanNap++;
        if (!ctId) {
            dtHocPhan = [];
            z('bang').innerHTML = ui.empty('Chọn chương trình để xem nội dung học phần', 'fa-book-open');
            z('kbb').innerHTML = ui.empty('Chọn chương trình', 'fa-folder-open');
            z('ktcd').innerHTML = ui.empty('Chọn chương trình', 'fa-folder-open');
            return;
        }
        taiHocPhan(lanNap);
        taiKhoi(lanNap);
    }

    /* ---------- Sự kiện -------------------------------------------------------- */
    /* Chỉ nghe `change` thật: ums.ui.select2 đã bắn một `change` DOM thật khi
       người dùng chọn, nghe thêm select2:select sẽ nạp hai lần. */
    fCT.addEventListener('change', chonChuongTrinh);
    fTim.addEventListener('input', function () { if (ctId) veBang(); });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-khoi]');
        if (b) { moKhoi(b.getAttribute('data-khoi'), b.getAttribute('data-kieu'), b.getAttribute('data-ten')); return; }
        b = ev.target.closest('[data-act="view"]');
        if (!b) return;
        var id = b.getAttribute('data-id');
        var row = dtHocPhan.filter(function (x) { return String(x.ID) === String(id); })[0];
        if (row) moChiTiet(row);
    });

    /* ---------- Nạp đầu tiên ---------------------------------------------------
       Bản gốc nạp danh mục KHCT.LOAIPHANBO TRƯỚC rồi mới lấy danh sách chương trình
       (cột động của bảng phải có trước khi vẽ) — giữ đúng trình tự đó. */
    z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    ums.api.dm('KHCT.LOAIPHANBO').catch(function (err) {
        ums.api.handle(err, 'danh mục loại phân bổ'); return [];
    }).then(function (d) {
        dtPhanBo = arr(d);
        return goi(A.chuongTrinh, { strQLSV_NguoiHoc_Id: SV });
    }).then(function (r) {
        dtChuongTrinh = arr(r.data);
        pat.fill(fCT, dtChuongTrinh, {
            id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_TOCHUCCHUONGTRINH_TEN', head: 'Chọn chương trình'
        });
        /* selectOne của bản gốc: giá trị mặc định là mục CUỐI danh sách, rồi bắn change */
        if (dtChuongTrinh.length) {
            fCT.value = dtChuongTrinh[dtChuongTrinh.length - 1].DAOTAO_TOCHUCCHUONGTRINH_ID;
            if (window.jQuery) jQuery(fCT).trigger('change.select2');
        }
        chonChuongTrinh();
    }).catch(function (err) {
        z('bang').innerHTML = ui.fail(err.message);
        ums.api.handle(err, 'danh sách chương trình');
    });
})();
