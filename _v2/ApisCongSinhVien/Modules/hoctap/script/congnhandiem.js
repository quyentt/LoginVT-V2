/* =========================================================================
   congnhandiem (hoctap) — Kế hoạch học tập: đăng ký công nhận điểm theo
   CHƯƠNG TRÌNH HỌC. KHÁC màn dangkyhoc/congnhandiem (công nhận từ chứng chỉ /
   bảng điểm): ở đây chọn NHIỀU học phần rồi khai một bảng, hoặc mở hộp chi tiết
   của MỘT học phần (Them_Diem_NguoiHoc_HocPhan_Cap — họ hàm "_HocPhan_Cap").
   Bản gốc: ApisCongSinhVien/Modules/hoctap/html/congnhandiem.html + script/congnhandiem.js
   ---------------------------------------------------------------------------
   ⚠ BẢN GỐC CHƯA BAO GIỜ CHẠY: script/congnhandiem.js có LỖI CÚ PHÁP ở
   genTable_HocPhan (dòng 598: `"mDataProp": "TINHTRANG_TEN"` thiếu dấu phẩy
   trước `mRender`) → cả tệp không phân tích được, `CongNhanDiem is not defined`,
   màn trắng. Bản mới làm theo ý định đọc được trong mã (xem "Sửa" bên dưới).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc: MỘT cột — thanh lọc (Kế hoạch, Chương trình, "Xem") +
   bảng học phần có nút "Đăng ký"; bấm "Đăng ký" thì khung khai hàng loạt THAY CHỖ
   danh sách (gốc: toggle zonebatdau ↔ zoneEdit); mỗi dòng còn lối mở biểu mẫu chi tiết của MỘT
   học phần — biểu mẫu NGAY TRONG TRANG, thay chỗ cả màn (ums.pat.formTrang, BO-CUC luật 1;
   gốc là modal, trước 2026-09-30 bản mới cũng bật hộp thoại).
   Người học = ums.session.userId (vỏ thủ vai đã đặt, thay edu.system.userId của gốc).
   ---------------------------------------------------------------------------
   Dùng lại tầng chung ums.cnd (dangkyhoc/script/_congnhandiem.js) cho những phần
   GIỐNG HỆT hai màn công nhận điểm bên Đăng ký học — cùng action, cùng tham số:
     locHtml/napLoc  LayDSKeHoachCongNhan + pkg_dangkyhoc_chung.LayDSChuongTrinh
                     (cả hai `selectOne: true` → chọn sẵn mục đầu, không tự tải danh sách)
     call('ds')      LayDSChuongTrinhHoc   · noiCap()  LayDSDiem_CoSoCongNhanDiem
     tep()/soTep()   khung tệp SV_Files (uploadFiles/viewFiles/saveFiles của gốc)
   Lời gọi riêng của màn (SV_CongNhanDiem_MH · pkg_congthongtin_congnhandiem):
     LayDSDangKyCongNhan (strDaoTao_HocPhan_Id = chuỗi id các học phần đã đánh dấu)
     LayTTDiem_NguoiHoc_HocPhan_Cap · Them_Diem_NguoiHoc_HocPhan_Cap · Xoa_…_HocPhan_Cap
     LayDSCoSoDaoTaoTheoLoai (strLoaiCongNhan_Id) · LayDSLoaiCC_BangDiem
     LayDSLoaiCC_BDTheoPhanLoai (strLoaiCC_BD_Id) · danh mục DIEM.CONGNHAN.LOAI
   ---------------------------------------------------------------------------
   Giữ như gốc (chỗ lạ):
     · LayDSChuongTrinhHoc CHỈ gửi strDaoTao_ChuongTrinh_Id (không gửi kế hoạch),
       khác màn dangkyhoc cùng tên hàm.
     · Lưu hàng loạt KHÔNG gửi strId (gốc chú thích dòng đó) → mỗi lần bấm là THÊM MỚI.
     · Hộp chi tiết lưu strDaoTao_HocPhan_Id = DAOTAO_HOCPHAN_ID của dòng; bảng khai
       hàng loạt lưu strDaoTao_HocPhan_Id = cột ID của LayDSDangKyCongNhan (như gốc).
     · Khoá tệp minh chứng của CẢ hai chỗ là "CongNhan" + kế hoạch + người học
       (không theo học phần) — như gốc.
     · Ô "Loại chứng chỉ" ở khung khai hàng loạt là lọc TUỲ CHỌN (chưa chọn vẫn có
       danh mục DIEM.CONGNHAN.LOAI) → KHÔNG khoá theo luật cha → con.
   Sửa (lỗi rõ của gốc):
     · Lỗi cú pháp nói trên → cột "Tình trạng" hiện TINHTRANG_TEN, riêng "Hết hiệu lực"
       để trống; ô "Đăng ký công nhận" bỏ đoạn mã chết bị ghi đè (gốc dựng html hai lần).
     · `$("#lblHocPhan")` trùng id ở hai chỗ (khung khai hàng loạt + hộp thoại) nên tên
       học phần luôn rơi vào khung sau lưng hộp → nay hiện trong chính hộp.
     · `edu.util.getValById("txtFileDinhKem"/"txtFileDinhKemDS")` đọc .val() của một
       <div> → luôn rỗng → hai đường LƯU của gốc không bao giờ chạy tới lời gọi.
       Nay kiểm "đã có ít nhất một tệp minh chứng" (đúng ý định, như congnhandiemv3).
     · Nút Xóa của hộp gắn thêm một trình xử lý #btnYes mỗi lần bấm (xoá N lần) → ums.ui.confirm.
     · Xoá khi chưa có bản ghi công nhận sẽ gửi strIds rỗng → nút Xóa khoá khi chưa có.
   Khác gốc (có chủ ý):
     · Lưu hàng loạt xong thì quay lại danh sách và nạp lại (gốc ở nguyên khung khai).
     · Hai nút "Đăng ký" giống hệt nhau trong khung khai (trên + dưới bảng) gộp còn MỘT,
       đặt ở đầu khung nên luôn thấy khi cuộn.
   Kéo gốc 30/9 (git fed68f6e..HEAD, congnhandiem.js −6): gốc chỉ XOÁ đoạn dựng html thừa ở cột
     "Đăng ký công nhận" và dòng `"mDataProp": "TINHTRANG_TEN"` thiếu dấu phẩy — tức sửa đúng lỗi cú
     pháp nói trên. Kết quả gốc nay khớp bản mới: "Hết hiệu lực" coi như chưa đăng ký (có ô đánh dấu
     + "Đăng ký"), cột Tình trạng để trống khi "Hết hiệu lực". Không phải đổi gì. (Mô tả "bỏ cột ô
     đánh dấu / cột TINHTRANG_TEN" trong ghi chú kéo gốc là đọc nhầm diff — hai cột vẫn còn.)
   Bỏ (mã chết của gốc): `#zoneBtnXacNhan` + save_XacNhan (không có phần tử, không có hàm),
     `#txtSearch` → getList_TuiBai (không có ô, không có hàm).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.cnd, e = C.e, arr = C.arr, esc = ui.esc;
    var root = document.getElementById('hoctap-congnhandiem');
    var sv = C.uid();
    var M = 'SV_CongNhanDiem_MH/', P = 'pkg_congthongtin_congnhandiem.';

    /* Cặp action (chuỗi mã hoá) + func — chép nguyên từ tệp gốc */
    var A = {
        dsDangKy: [M + 'DSA4BRIFIC8mCjgCLi8mDykgLwPP', P + 'LayDSDangKyCongNhan'],
        ttCap:    [M + 'DSA4FRUFKCQsHg8mNC4oCS4iHgkuIhEpIC8eAiAx', P + 'LayTTDiem_NguoiHoc_HocPhan_Cap'],
        themCap:  [M + 'FSkkLB4FKCQsHg8mNC4oCS4iHgkuIhEpIC8eAiAx', P + 'Them_Diem_NguoiHoc_HocPhan_Cap'],
        xoaCap:   [M + 'GS4gHgUoJCweDyY0LigJLiIeCS4iESkgLx4CIDEP', P + 'Xoa_Diem_NguoiHoc_HocPhan_Cap'],
        coSoLoai: [M + 'DSA4BRICLhIuBSAuFSAuFSkkLg0uICgP', P + 'LayDSCoSoDaoTaoTheoLoai'],
        loaiCC:   [M + 'DSA4BRINLiAoAgIeAyAvJgUoJCwP', P + 'LayDSLoaiCC_BangDiem'],
        phanLoai: [M + 'DSA4BRINLiAoAgIeAwUVKSQuESkgLw0uICgP', P + 'LayDSLoaiCC_BDTheoPhanLoai']
    };
    function call(k, ts) {
        return ums.api.call(Object.assign({ action: A[k][0], func: A[k][1], strNguoiThucHien_Id: sv }, ts || {}));
    }

    var dsHocPhan = [];     // LayDSChuongTrinhHoc
    var dsKhai = [];        // LayDSDangKyCongNhan (các học phần đã đánh dấu)
    var dsLoaiCongNhan = [];// danh mục DIEM.CONGNHAN.LOAI, hoặc LayDSLoaiCC_BDTheoPhanLoai khi chọn loại chứng chỉ
    var dsLoaiCC = [];      // LayDSLoaiCC_BangDiem

    /* ---------- Khung màn hình --------------------------------------------- */
    root.innerHTML = pat.page('Kế hoạch học tập', '<span data-z="report"></span>') +
        C.locHtml(ui.btn('search', { text: 'Xem', icon: 'fa-magnifying-glass', attr: { 'data-a': 'xem' } })) +
        '<div data-z="vungDS">' + pat.panel({
            title: 'Danh sách học phần', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'ds',
            tools: ui.btn('save', { text: 'Đăng ký', icon: 'fa-money-check-pen', attr: { 'data-a': 'themkhai' } })
        }) + '</div>' +
        '<div data-z="vungKhai" hidden>' + pat.panel({
            title: 'Đăng ký công nhận điểm', icon: 'fa-money-check-pen',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('save', { text: 'Đăng ký', icon: 'fa-money-check-pen', attr: { 'data-a': 'luukhai' } }),
                            body: '<div class="ums-filter ums-u-mb-4"><div class="ums-field">' +
                    C.sel('cc', 'Chọn loại chứng chỉ') + '</div></div>' +
                '<div data-z="bang"></div>' +
                '<div class="ums-u-mt-4">' +
                    ui.field('Các file dữ liệu chứng minh(bảng điểm, chứng chỉ...)', '<div data-x="tepds"></div>', { inline: true, labelWidth: '320px' }) + '</div>'
        }) + '</div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var zDS = z('ds'), zKhai = z('bang');
    var tepDS = C.tep(root.querySelector('[data-x="tepds"]'));
    function khoaTep() { return 'CongNhan' + f('kh').value + sv; }

    zDS.innerHTML = ui.empty('Chọn kế hoạch, chương trình rồi bấm "Xem"', 'fa-hand-pointer');

    /* ---------- Danh mục nạp một lần ---------------------------------------- */
    C.napLoc(f('kh'), f('ct'));
    ums.api.dm('DIEM.CONGNHAN.LOAI').then(function (d) { dsLoaiCongNhan = arr(d); })
        .catch(function (err) { ums.api.handle(err, 'loại công nhận'); });
    call('loaiCC').then(function (r) {
        dsLoaiCC = arr(r.data);
        pat.fill(f('cc'), dsLoaiCC, { head: 'Chọn loại chứng chỉ' });
    }).catch(function (err) { ums.api.handle(err, 'loại chứng chỉ'); });

    /* Nút "Xuất báo cáo" / "Import" theo quyền chức năng (gốc: getList_MauImport) */
    ums.report.mount(z('report'), {
        collect: function (add) {
            add('strDiem_KeHoachCongNhan_Id', f('kh').value);
            add('strDaoTao_ChuongTrinh_Id', f('ct').value);
            add('strDaoTao_HocPhan_Id', idDaChon().join(','));
        }
    });

    /* ---------- Bảng học phần ----------------------------------------------- */
    function idDaChon() {
        return Array.prototype.slice.call(zDS.querySelectorAll('input[data-ck]:checked'))
            .map(function (el) { return el.getAttribute('data-ck'); });
    }
    function taiHocPhan() {
        zDS.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return C.call('ds', { strDaoTao_ChuongTrinh_Id: f('ct').value }).then(function (r) {
            dsHocPhan = arr(r.data);
            z('n').textContent = '(' + dsHocPhan.length + ')';
            ui.table({
                el: zDS, rows: dsHocPhan, empty: 'Không có học phần', columns: [
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' },
                    { title: 'Kết quả đã tích lũy', prop: 'KETQUA', cls: 'is-center' },
                    { title: 'Kết quả đã được công nhận mới', prop: 'KETQUAMOI', cls: 'is-center' },
                    { title: 'Đăng ký công nhận', cls: 'is-center', width: '190px', render: veDangKy },
                    { title: 'Tình trạng', cls: 'is-center', render: function (x) {
                        var t = e(x.TINHTRANG_TEN);
                        return t === 'Hết hiệu lực' ? '' : esc(t);
                    } }
                ]
            });
        }).catch(function (err) { zDS.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học phần'); });
    }
    /* Ô "Đăng ký công nhận": đã đăng ký (và chưa hết hiệu lực) thì bỏ ô đánh dấu,
       chữ "Đã đăng ký" màu xanh lá — đúng ý định của mRender bản gốc. */
    function veDangKy(x, i) {
        var het = e(x.TINHTRANG_TEN) === 'Hết hiệu lực';
        var daDK = !!x.DADANGKYCONGNHAN && !het;
        return '<div class="ums-row htcn-dk">' +
            (daDK ? '' : '<input type="checkbox" data-ck="' + esc(x.DAOTAO_HOCPHAN_ID) + '" title="Chọn học phần">') +
            '<button type="button" class="ums-link' + (daDK ? ' htcn-dk__da' : '') + '" data-xem="' + i + '">' +
            (daDK ? 'Đã đăng ký' : 'Đăng ký') + '</button></div>';
    }

    /* ---------- Khung khai hàng loạt (zoneEdit của gốc) ---------------------- */
    function moKhai() {
        if (!f('kh').value) { ui.toast('Bạn cần chọn kế hoạch', 'warn'); return; }
        var ids = idDaChon();
        if (!ids.length) { ui.toast('Vui lòng chọn học phần?', 'warn'); return; }
        ui.swap(z('vungDS'), z('vungKhai'));
        taiKhai(ids.join(','));
        tepDS.load(khoaTep());
    }
    function taiKhai(strIds) {
        zKhai.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        zKhai.setAttribute('data-ids', strIds);
        return call('dsDangKy', { strDaoTao_HocPhan_Id: strIds }).then(function (r) {
            dsKhai = arr(r.data);
            veKhai();
        }).catch(function (err) { zKhai.innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần đăng ký công nhận'); });
    }
    function o_(i, k, extra) {
        return '<input class="ums-input ums-input--sm" data-r="' + i + '" data-k="' + k + '"' + (extra || '') + ' autocomplete="off">';
    }
    function veKhai() {
        ui.table({
            el: zKhai, rows: dsKhai, tableCls: 'ums-table--lined ums-table--tight htcn-table', empty: 'Chưa chọn học phần nào', columns: [
                { title: 'Mã học phần', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'TEN' },
                { title: 'Loại công nhận', width: '270px', render: function (x, i) {
                    return '<select class="ums-select" data-r="' + i + '" data-k="loai">' +
                        ui.options(dsLoaiCongNhan, { title: 'Chọn loại' }) + '</select>';
                } },
                { title: 'Cơ sở đào tạo', width: '370px', render: function (x, i) {
                    return '<select class="ums-select" data-r="' + i + '" data-k="coso" disabled>' +
                        '<option value="">Chọn cơ sở</option></select>';
                } },
                { title: 'Ngày được cấp', width: '150px', render: function (x, i) { return o_(i, 'ngaycap', ' data-date placeholder="dd/mm/yyyy"'); } },
                { title: 'Ngày hết hạn', width: '150px', render: function (x, i) { return o_(i, 'ngayhethan', ' data-date placeholder="dd/mm/yyyy"'); } },
                { title: 'Kết quả được công nhận ở ngoài', width: '150px', render: function (x, i) { return o_(i, 'diem'); } },
                { title: 'Tên học phần/Tên chứng chỉ đã công nhận', width: '220px', render: function (x, i) { return o_(i, 'tenhp'); } },
                { title: 'Số tín chỉ', width: '110px', render: function (x, i) { return o_(i, 'sotc'); } },
                { title: 'Hệ đào tạo', width: '160px', render: function (x, i) { return o_(i, 'hedt'); } },
                { title: 'Ghi chú', width: '180px', render: function (x, i) { return o_(i, 'ghichu'); } }
            ]
        });
        ui.enhance(zKhai);
    }
    function oKhai(i, k) { return zKhai.querySelector('[data-r="' + i + '"][data-k="' + k + '"]'); }
    function giaTri(i, k) { var el = oKhai(i, k); return el ? String(el.value).trim() : ''; }

    /* Loại công nhận (dòng) → Cơ sở đào tạo (dòng): chưa chọn cha thì khoá con,
       đổi cha thì xoá trắng con (ô trong bảng không qua select2 nên nghe 'change' thật). */
    function napCoSoDong(i) {
        var el = oKhai(i, 'coso'), loai = giaTri(i, 'loai');
        if (!el) return;
        el.value = '';
        if (!loai) { el.innerHTML = '<option value="">Chọn cơ sở</option>'; el.disabled = true; return; }
        el.disabled = false;
        call('coSoLoai', { strLoaiCongNhan_Id: loai }).then(function (r) {
            el.innerHTML = ui.options(arr(r.data), { title: 'Chọn cơ sở' });
        }).catch(function (err) { ums.api.handle(err, 'cơ sở đào tạo'); });
    }
    zKhai.addEventListener('change', function (ev) {
        var el = ev.target;
        if (el.tagName === 'SELECT' && el.getAttribute('data-k') === 'loai') napCoSoDong(Number(el.getAttribute('data-r')));
    });

    function luuKhai() {
        if (!C.soTep(root.querySelector('[data-x="tepds"]'))) { ui.toast('Bạn cần tải file minh chứng lên', 'warn'); return; }
        var kh = f('kh').value;
        var calls = dsKhai.map(function (x, i) {
            return {
                action: A.themCap[0], func: A.themCap[1],
                strDiem_KeHoachCongNhan_Id: kh,
                strLoaiCongNhan_Id: giaTri(i, 'loai'),
                strQLSV_NguoiHoc_Id: sv,
                strDaoTao_HocPhan_Id: x.ID,
                strDiem_CoSoCongNhan_Id: giaTri(i, 'coso'),
                strGhiChu: giaTri(i, 'ghichu'),
                strNgayHetHan: giaTri(i, 'ngayhethan'),
                strNgayCap: giaTri(i, 'ngaycap'),
                strNguoiThucHien_Id: sv,
                strDiem: giaTri(i, 'diem'),
                strThongTinHocPhan_ChungChi: giaTri(i, 'tenhp'),
                strHeDaoTao: giaTri(i, 'hedt'),
                dSoTinChi: giaTri(i, 'sotc')
            };
        });
        if (!calls.length) { ui.toast('Vui lòng chọn học phần?', 'warn'); return; }
        ui.batch(calls, { title: 'Đang đăng ký công nhận', toast: false }).then(function (b) {
            if (b.fail) ui.toast('Thất bại: ' + b.errors[0], 'bad');
            return tepDS.save(khoaTep());
        }).then(function () {
            ui.toast('Thêm mới thành công!', 'ok');
            ui.swap(z('vungKhai'), z('vungDS'));
            taiHocPhan();
        }).catch(function (err) { ums.api.handle(err, 'đăng ký công nhận'); });
    }

    /* ---------- Biểu mẫu "Xem thông tin đăng ký công nhận điểm" (trong trang) -- */
    function hopChiTiet(row) {
        var congNhanId = '';
        /* Thân là chuỗi → formTrang tự bọc lưới 2 cột (ô ngắn hai ô một hàng); dòng dẫn, khung tệp và ô mô tả chiếm cả hàng */
        function ca(h) { return '<div style="grid-column:1 / -1">' + h + '</div>'; }
        var dlg = pat.formTrang({
            host: root, title: 'Xem thông tin đăng ký công nhận điểm', icon: 'fa-money-check-pen',
            body: ca('<p class="ums-u-fz13"><span class="ums-u-muted">Học phần đăng ký công nhận kết quả:</span> <b>' +
                    esc(e(row.DAOTAO_HOCPHAN_MA) + ' - ' + e(row.DAOTAO_HOCPHAN_TEN)) + '</b></p>') +
                ca(ui.field('Các file dữ liệu chứng minh (bảng điểm, kết quả...)', '<div data-x="tep"></div>')) +
                ui.field('Loại chứng chỉ', C.sel('dlcc', 'Chọn loại chứng chỉ')) +
                ui.field('Loại công nhận', C.sel('dlcn', 'Chọn loại')) +
                ui.field('Cơ sở đào tạo(nơi cấp)', C.sel('dcs', 'Chọn cơ sở')) +
                ui.field('Kết quả đã được công nhận', '<input class="ums-input" data-x="diem" autocomplete="off">') +
                ui.field('Ngày được cấp', '<input class="ums-input" data-x="ngaycap" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                ui.field('Ngày hết hạn', '<input class="ums-input" data-x="ngayhethan" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                ui.field('Tên học phần/Tên chứng chỉ đã công nhận', '<input class="ums-input" data-x="tenhp" autocomplete="off">') +
                ui.field('Số tín chỉ', '<input class="ums-input" data-x="sotc" autocomplete="off">') +
                ui.field('Hệ đào tạo', '<input class="ums-input" data-x="hedt" autocomplete="off">') +
                ca(ui.field('Mô tả khác(nếu có)', '<textarea class="ums-textarea" data-x="ghichu" rows="3"></textarea>')),
            buttons: [
                { text: 'Xóa', kind: 'del', mod: 'out-danger', onClick: function () { xoa(); return false; } },
                { text: 'Lưu', kind: 'save', mod: 'primary', onClick: function () { luu(); return false; } }
            ]
        });
        function q(k) { return dlg.body.querySelector('[data-f="' + k + '"], [data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        var nutXoa = dlg.el.querySelector('.ums-panel__tools [data-ft="0"]');     // formTrang: nút mang data-ft = chỉ số trong buttons
        nutXoa.disabled = true;

        var files = C.tep(q('tep'));
        files.load(khoaTep());

        /* Loại chứng chỉ → Loại công nhận → Cơ sở đào tạo (khoá con khi chưa chọn cha) */
        pat.fill(q('dlcc'), dsLoaiCC, { head: 'Chọn loại chứng chỉ' });
        var chain = pat.chain([q('dlcc'), q('dlcn'), q('dcs')], { phatLai: false });
        chain.sync();
        function napLoaiCongNhan(macDinh) {
            if (!q('dlcc').value) { pat.fill(q('dlcn'), [], { head: 'Chọn loại' }); pat.fill(q('dcs'), [], { head: 'Chọn cơ sở' }); chain.sync(); return Promise.resolve(); }
            return call('phanLoai', { strLoaiCC_BD_Id: q('dlcc').value }).then(function (r) {
                pat.fill(q('dlcn'), arr(r.data), { head: 'Chọn loại' });
                if (macDinh) datGiaTri(q('dlcn'), macDinh);
                chain.sync();
            }).catch(function (err) { ums.api.handle(err, 'loại công nhận'); });
        }
        function napCoSo(macDinh) {
            if (!q('dlcn').value) { pat.fill(q('dcs'), [], { head: 'Chọn cơ sở' }); chain.sync(); return Promise.resolve(); }
            return call('coSoLoai', { strLoaiCongNhan_Id: q('dlcn').value }).then(function (r) {
                pat.fill(q('dcs'), arr(r.data), { head: 'Chọn cơ sở' });
                if (macDinh) datGiaTri(q('dcs'), macDinh);
                chain.sync();
            }).catch(function (err) { ums.api.handle(err, 'cơ sở đào tạo'); });
        }
        function datGiaTri(el, v) {
            el.value = e(v);
            if (window.jQuery) jQuery(el).trigger('change.select2');
        }
        if (window.jQuery) {
            jQuery(q('dlcc')).on('select2:select select2:clear', function () { napLoaiCongNhan(); });
            jQuery(q('dlcn')).on('select2:select select2:clear', function () { napCoSo(); });
        }

        /* Đổ thông tin đã khai (viewForm_CongNhanDiem của gốc) */
        call('ttCap', {
            strDiem_KeHoachCongNhan_Id: f('kh').value, strQLSV_NguoiHoc_Id: sv,
            strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID
        }).then(function (r) {
            var d = arr(r.data)[0];
            if (!d) return;
            congNhanId = e(d.ID);
            nutXoa.disabled = !congNhanId;
            q('diem').value = e(d.DIEM);
            q('ngaycap').value = e(d.NGAYCAP);
            q('ngayhethan').value = e(d.NGAYHETHAN);
            q('ghichu').value = e(d.GHICHU);
            q('hedt').value = e(d.HEDAOTAO);
            q('sotc').value = e(d.SOTINCHI);
            q('tenhp').value = e(d.THONGTINHOCPHAN_CHUNGCHI);
            datGiaTri(q('dlcc'), d.LOAICC_BANGDIEM_ID);
            chain.sync();
            napLoaiCongNhan(d.LOAICONGNHAN_ID).then(function () { return napCoSo(d.DIEM_COSODAOTAOCONGNHANDIEM_ID); });
        }).catch(function (err) { ums.api.handle(err, 'thông tin công nhận điểm'); });

        function luu() {
            if (!C.soTep(q('tep'))) { ui.toast('Bạn cần tải file minh chứng lên', 'warn'); return; }
            call('themCap', {
                strId: congNhanId,
                strDiem_KeHoachCongNhan_Id: f('kh').value,
                strLoaiCongNhan_Id: q('dlcn').value,
                strQLSV_NguoiHoc_Id: sv,
                strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID,
                strDiem_CoSoCongNhan_Id: q('dcs').value,
                strGhiChu: q('ghichu').value.trim(),
                strNgayHetHan: q('ngayhethan').value.trim(),
                strNgayCap: q('ngaycap').value.trim(),
                strDiem: q('diem').value.trim(),
                strThongTinHocPhan_ChungChi: q('tenhp').value.trim(),
                strHeDaoTao: q('hedt').value.trim(),
                dSoTinChi: q('sotc').value.trim()
            }).then(function () {
                return files.save(khoaTep());
            }).then(function () {
                ui.toast(congNhanId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                dlg.close();
                taiHocPhan();
            }).catch(function (err) { ums.api.handle(err, 'lưu công nhận điểm'); });
        }
        function xoa() {
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá đăng ký công nhận' }).then(function (yes) {
                if (!yes) return;
                return call('xoaCap', { strIds: congNhanId }).then(function () {
                    ui.toast('Xóa dữ liệu thành công!', 'ok');
                    dlg.close();
                    taiHocPhan();
                });
            }).catch(function (err) { ums.api.handle(err, 'xoá công nhận điểm'); });
        }
    }

    /* ---------- Sự kiện ------------------------------------------------------ */
    if (window.jQuery) {
        jQuery(f('ct')).on('select2:select', taiHocPhan);
        // Đổi "Loại chứng chỉ" → đổi nguồn ô "Loại công nhận" rồi vẽ lại bảng khai (gốc: getList_PhanLoai)
        jQuery(f('cc')).on('select2:select select2:clear', function () {
            if (!f('cc').value) {
                ums.api.dm('DIEM.CONGNHAN.LOAI').then(function (d) { dsLoaiCongNhan = arr(d); veKhai(); });
                return;
            }
            call('phanLoai', { strLoaiCC_BD_Id: f('cc').value }).then(function (r) {
                dsLoaiCongNhan = arr(r.data);
                taiKhai(zKhai.getAttribute('data-ids') || '');
            }).catch(function (err) { ums.api.handle(err, 'loại công nhận'); });
        });
    }
    root.addEventListener('click', function (ev) {
        var b;
        if (ev.target.closest('[data-a="xem"]')) { taiHocPhan(); return; }
        if (ev.target.closest('[data-a="themkhai"]')) { moKhai(); return; }
        if (ev.target.closest('[data-a="luukhai"]')) { luuKhai(); return; }
        if (ev.target.closest('[data-a="dong"]')) { ui.swap(z('vungKhai'), z('vungDS')); return; }
        if ((b = ev.target.closest('[data-xem]'))) {
            var row = dsHocPhan[Number(b.getAttribute('data-xem'))];
            if (!row) return;
            if (!f('kh').value) { ui.toast('Bạn cần chọn kế hoạch', 'warn'); return; }
            hopChiTiet(row);
        }
    });
})();
