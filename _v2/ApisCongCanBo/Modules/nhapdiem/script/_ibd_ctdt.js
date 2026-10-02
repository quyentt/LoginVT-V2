/* =========================================================================
   inbangdiem — hộp "Khung chương trình" — ums.ibd.khungCT(dòng)
   Bản gốc: nhapdiem/script/chuongtrinhhoc.js (lớp ChuongTrinh, chép từ cổng sinh viên).
   Bố cục như gốc: trái (col-9) chọn chương trình + bảng học phần có cột phân bổ tiết; phải (col-3) hai thẻ
   "Các khối lựa chọn bắt buộc" / "Các khối lựa chọn đơn".
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ GET, chép nguyên):
       danh mục KHCT.LOAIPHANBO → cột phân bổ · DKH_Chung/LayDSChuongTrinh (strQLSV_NguoiHoc_Id; tự chọn khi chỉ có 1)
       KHCT_HocPhan_ChuongTrinh/LayDanhSach → mỗi học phần: KHCT_HocPhan_TietHoc/LayDanhSach (SOTIET theo LOAIPHANBO_ID)
       KHCT_KhoiBatBuoc/LayDanhSach · KHCT_KhoiTuChon_Don/LayDanhSach → bấm khối: KHCT_HocPhan_KhoiBatBuoc / KHCT_HocPhan_KhoiTuChon_Don
       Bấm học phần: KHCT_QuanHeHocPhan · KHCT_HocPhan_TuongDuong · KHCT_BaiHoc · KHCT_HocPhan_TietHoc (LayDanhSach)
   Không chép (lỗi rõ của bản gốc): mỗi lần mở gắn thêm trình xử lý (mở N lần → một lần đổi chương trình gọi N lượt).
   Chờ nghiệp vụ: các lời gọi KHCT_* gửi strNguoiThucHien_Id = id NGƯỜI HỌC (chép từ cổng sinh viên) — giữ như gốc.
   Không chọn sẵn chương trình của dòng đang xem (gốc chỉ tự chọn khi có đúng một) — giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var ibd = ums.ibd = ums.ibd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    ibd.khungCT = function (r) {
        var sv = r.QLSV_NGUOIHOC_ID;
        function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: sv }, o)); }
        var dlg = ui.dialog({ title: 'Khung chương trình — ' + e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN) + ' - ' + e(r.QLSV_NGUOIHOC_MASO), icon: 'fa-sitemap', size: 'xl',
            body: '<div class="ibd-ct"><div>' +
                    '<div class="ums-row ums-u-mb-2"><span class="ums-u-fz13">Nội dung học phần theo chương trình:</span><div class="ums-field" style="flex:1;margin:0"><select class="ums-select" data-x="ct" data-ph="Chọn chương trình"><option value=""></option></select></div></div>' +
                    '<div data-x="hp">' + ui.empty('Chọn chương trình', 'fa-hand-pointer') + '</div><div class="ums-u-mt-2 ums-u-fz13">Tổng số tín chỉ: <b data-x="tc"></b></div></div>' +
                '<aside><div class="ums-legend">Các khối lựa chọn bắt buộc</div><ul class="ibd-ct__khoi" data-x="bb"></ul>' +
                    '<div class="ums-legend ums-legend--cach">Các khối lựa chọn đơn</div><ul class="ibd-ct__khoi" data-x="don"></ul></aside></div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        var PB = [], DSCT = [], HP = [], ctId = '';
        ums.api.dm('KHCT.LOAIPHANBO').then(function (d) { PB = d || []; }).catch(function () {}).then(function () {
            return ums.api.call({ action: 'DKH_Chung/LayDSChuongTrinh', method: 'GET', strQLSV_NguoiHoc_Id: sv, strNguoiThucHien_Id: uid() });
        }).then(function (x) {
            DSCT = arr(x.data);
            pat.fill(q('ct'), DSCT, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_TOCHUCCHUONGTRINH_TEN', head: 'Chọn chương trình' });
            if (DSCT.length === 1) { q('ct').value = DSCT[0].DAOTAO_TOCHUCCHUONGTRINH_ID; if (window.jQuery) jQuery(q('ct')).trigger('change.select2'); chonCT(); }
        }).catch(function (err) { ums.api.handle(err, 'chương trình'); });
        if (window.jQuery) jQuery(q('ct')).on('select2:select select2:clear', chonCT);

        function chonCT() {
            ctId = q('ct').value;
            var c = DSCT.filter(function (x) { return String(x.DAOTAO_TOCHUCCHUONGTRINH_ID) === ctId; })[0] || {};
            q('tc').textContent = e(c.TONGSOTINCHIQUYDINH);
            if (!ctId) { q('hp').innerHTML = ui.empty('Chọn chương trình', 'fa-hand-pointer'); q('bb').innerHTML = q('don').innerHTML = ''; return; }
            q('hp').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            get('KHCT_HocPhan_ChuongTrinh/LayDanhSach', { strTuKhoa: '', strDaoTao_ThoiGian_KH_Id: '', strDaoTao_ThoiGian_TT_Id: '', strThuocTinhHocPhan_Id: '', strPhanCongPhamViDamNhiem_Id: '',
                strDaoTao_HocPhan_Id: '', strDaoTao_ChuongTrinh_Id: ctId, pageIndex: 1, pageSize: 100000000 }).then(function (x) {
                HP = arr(x.data);
                var TIET = {};
                function veHP() {
                    ui.table({ el: q('hp'), rows: HP, empty: 'Chương trình chưa có học phần', columns: [
                        { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                        { title: 'Số tín học phần', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' }, { title: 'Số tín học phí', prop: 'HOCTRINHAPDUNGTINHHOCPHI', cls: 'is-center' },
                        { title: 'Điều kiện ràng buộc', prop: 'THONGTINQUANHEHOCPHAN' }, { title: 'Học kỳ dự kiến', prop: 'DAOTAO_THOIGIAN_KEHOACH', cls: 'is-center' },
                        { title: 'Học kỳ thực tế', prop: 'DAOTAO_THOIGIAN_THUCTE', cls: 'is-center' }
                    ].concat(PB.map(function (p) { return { title: e(p.MA), cls: 'is-center', render: function (h) { return esc(e((TIET[h.ID] || {})[p.ID])); } }; }), [
                        { title: 'Chi tiết', cls: 'is-center', width: '60px', render: function (h, i) { return '<button type="button" class="ums-iconbtn" data-hp="' + i + '" title="Chi tiết học phần"><i class="fa-light fa-eye"></i></button>'; } }]) });
                }
                veHP();
                ums.nd.pool(HP, function (h) {
                    return get('KHCT_HocPhan_TietHoc/LayDanhSach', { silent: true, strTuKhoa: '', strDaoTao_HocPhan_Id: h.DAOTAO_HOCPHAN_ID, strDaoTao_ToChucCT_Id: h.DAOTAO_TOCHUCCHUONGTRINH_ID,
                        strLoaiPhanBo_Id: '', pageIndex: 1, pageSize: 10000 }).then(function (y) { var m = TIET[h.ID] = {}; arr(y.data).forEach(function (t) { m[t.LOAIPHANBO_ID] = t.SOTIET; }); });
                }, 10).then(veHP);
            }).catch(function (err) { q('hp').innerHTML = ui.fail(err.message); });
            get('KHCT_KhoiBatBuoc/LayDanhSach', { strTuKhoa: '', strDaoTao_KhoiBatBuoc_Cha_Id: '', strDaoTao_ToChucCT_Id: ctId, pageIndex: 1, pageSize: 100000 }).then(function (x) {
                q('bb').innerHTML = arr(x.data).map(function (k) { return '<li><a href="javascript:void(0)" data-khoi="bb" data-id="' + esc(k.ID) + '" title="' + esc(e(k.TEN)) + '">' + esc(e(k.TEN)) +
                    ' <span class="ums-u-faint">(Tổng số HP: ' + esc(e(k.TONGSOHOCPHAN)) + '; Tổng số TC: ' + esc(e(k.TONGSOTINCHI)) + ')</span></a></li>'; }).join('') || '<li class="ums-u-faint">Không có</li>';
            }).catch(function () { q('bb').innerHTML = ''; });
            get('KHCT_KhoiTuChon_Don/LayDanhSach', { strTuKhoa: '', strDaoTao_KTuChon_Don_Cha_Id: '', strDaoTao_ToChucCT_Id: ctId, strLoaiLuaChon_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (x) {
                q('don').innerHTML = arr(x.data).map(function (k) {
                    var them = (e(k.SOHOCPHANQUYDINH) !== '' ? '; Số HP bắt buộc: ' + e(k.SOHOCPHANQUYDINH) : '') + (e(k.SOTINCHIQUYDINH) !== '' ? '; Số TC bắt buộc: ' + e(k.SOTINCHIQUYDINH) : '');
                    return '<li><a href="javascript:void(0)" data-khoi="don" data-id="' + esc(k.ID) + '" title="' + esc(e(k.TEN)) + '">' + esc(e(k.TEN)) +
                        ' <span class="ums-u-faint">(Tổng số HP: ' + esc(e(k.TONGSOHP)) + '; Tổng số TC: ' + esc(e(k.TONGSOTC)) + esc(them) + ')</span></a></li>'; }).join('') || '<li class="ums-u-faint">Không có</li>';
            }).catch(function () { q('don').innerHTML = ''; });
        }
        function moKhoi(kieu, id, ten) {
            var d2 = ui.dialog({ title: 'Khối kiến thức — ' + ten, icon: 'fa-layer-group', size: 'lg', body: '<div data-x="k">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var el = d2.body.querySelector('[data-x="k"]');
            var o = { strTuKhoa: '', strDaoTao_HocPhan_Id: '', strDaoTao_ToChucCT_Id: ctId, pageIndex: 1, pageSize: 100000000 };
            if (kieu === 'bb') o.strDaoTao_KhoiBatBuoc_Id = id; else o.strDaoTao_KTuChon_Don_Id = id;
            get(kieu === 'bb' ? 'KHCT_HocPhan_KhoiBatBuoc/LayDanhSach' : 'KHCT_HocPhan_KhoiTuChon_Don/LayDanhSach', o).then(function (x) {
                ui.table({ el: el, rows: arr(x.data), empty: 'Khối chưa có học phần', columns: [{ title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' }, { title: 'Số tiết', prop: 'TONGSOTIETPHANBO', cls: 'is-center' }] });
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); });
        }
        function moHP(h) {
            var TT = [['Mã học phần', h.DAOTAO_HOCPHAN_MA], ['Tên học phần', h.DAOTAO_HOCPHAN_TEN], ['Số tín học phần', h.HOCTRINHAPDUNGHOCTAP], ['Số tín học phí', h.HOCTRINHAPDUNGTINHHOCPHI],
                ['Là môn tính điểm', h.LAMONTINHDIEMTHEOCHUONGTRINH], ['Học kỳ dự kiến', h.DAOTAO_THOIGIAN_KEHOACH_TEN], ['Học kỳ thực tế', h.DAOTAO_THOIGIAN_THUCTE_TEN],
                ['Thuộc tính', h.THUOCTINHHOCPHAN_TEN], ['Phạm vi đảm nhiệm', h.PHANCONGPHAMVIDAMNHIEM_TEN], ['Thứ tự', h.THUTU]];
            var d2 = ui.dialog({ title: 'Chương trình "' + (q('ct').selectedOptions[0] || {}).text + '" — ' + e(h.DAOTAO_HOCPHAN_TEN), icon: 'fa-book', size: 'xl',
                body: '<div class="ums-grid ums-grid--4 ums-u-mb-4">' + TT.map(function (x) { return '<div class="ums-kv"><span>' + esc(x[0]) + '</span><b>' + esc(e(x[1])) + '</b></div>'; }).join('') + '</div>' +
                    ['qh|Quan hệ học phần', 'td|Quan hệ tương đương', 'bh|Bài học', 'pb|Phân bổ học phần'].map(function (s) { var p = s.split('|');
                        return '<div class="ums-legend">' + p[1] + '</div><div data-x="' + p[0] + '" class="ums-u-mb-4">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'; }).join('') });
            function el(k) { return d2.body.querySelector('[data-x="' + k + '"]'); }
            var chung = { strTuKhoa: '', strDaoTao_ToChucCT_Id: ctId, strDaoTao_HocPhan_Id: h.DAOTAO_HOCPHAN_ID, pageIndex: 1, pageSize: 10000 };
            [['qh', 'KHCT_QuanHeHocPhan/LayDanhSach', { strLoaiQuanHe_Id: '', strDaoTao_HocPhan_QuanHe_Id: '' }, [{ title: 'Loại quan hệ', prop: 'LOAIQUANHE_TEN' }, { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_QUANHE_TEN' },
                    { title: 'Mức', prop: 'MUCDIEUKIEN_TEN' }, { title: 'Toán tử', prop: 'TOANTU_TEN', cls: 'is-center' }, { title: 'Giá trị', prop: 'GIATRIDIEUKIEN', cls: 'is-center' }]],
             ['td', 'KHCT_HocPhan_TuongDuong/LayDanhSach', { strDaoTao_HocPhan_TD_Id: '', strDaoTao_ToChucCT_TD_Id: '' }, [{ title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TD_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TD_TEN' }, { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TD_TEN' }]],
             ['bh', 'KHCT_BaiHoc/LayDanhSach', {}, [{ title: 'Tên bài', prop: 'TENBAI' }, { title: 'Ký hiệu', prop: 'KYHIEUBAI', cls: 'is-center' }, { title: 'Số tiết', prop: 'SOTIET', cls: 'is-center' },
                    { title: 'Nội dung', prop: 'NOIDUNG' }]],
             ['pb', 'KHCT_HocPhan_TietHoc/LayDanhSach', { strLoaiPhanBo_Id: '' }, [{ title: 'Loại phân bổ', prop: 'LOAIPHANBO_TEN' }, { title: 'Số tiết', prop: 'SOTIET', cls: 'is-center' }]]
            ].forEach(function (t) {
                get(t[1], Object.assign({}, chung, t[2])).then(function (x) { ui.table({ el: el(t[0]), rows: arr(x.data), empty: 'Không có dữ liệu', columns: t[3] }); })
                    .catch(function (err) { el(t[0]).innerHTML = ui.fail(err.message); });
            });
        }
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-khoi]'); if (b) { moKhoi(b.getAttribute('data-khoi'), b.getAttribute('data-id'), b.getAttribute('title')); return; }
            if ((b = ev.target.closest('[data-hp]'))) moHP(HP[Number(b.getAttribute('data-hp'))]);
        });
    };
})();
