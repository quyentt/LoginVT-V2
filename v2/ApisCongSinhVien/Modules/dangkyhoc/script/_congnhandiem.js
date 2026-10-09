/* =========================================================================
   _congnhandiem — phần dùng chung của hai bản "Đăng ký xin công nhận điểm"
   (congnhandiem = bản cũ, congnhandiemv3 = bản mới). Hai tệp gốc chép nhau
   gần nguyên văn; chỗ GIỐNG nhau đặt ở đây, chỗ khác nhau để ở từng màn.
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/script/congnhandiem.js,
            congnhandiemv3.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   ums.cnd.A[k]            cặp [action, func] chép nguyên của bản gốc
   ums.cnd.call(k, ts)     gọi một cặp trên (api.js tự thêm iM + mã hoá)
   ums.cnd.locHtml(nút)    thanh lọc Kế hoạch / Chương trình + nút "Xem học phần" + nút riêng
   ums.cnd.napLoc(fKH, fCT)   nạp hai ô (selectFirst như gốc — chọn sẵn mục đầu)
   ums.cnd.taiDS(el, ts, dk)  LayDSChuongTrinhHoc → bảng học phần; dk(row, i) = HTML cột "Đăng ký công nhận"
   ums.cnd.noiCap()        danh sách cơ sở công nhận điểm (Nơi cấp / Cơ sở đào tạo đã học), nạp một lần
   ums.cnd.chungChi(els, o)   chuỗi Loại chứng chỉ → Chứng chỉ → Cấp độ (khoá con khi chưa chọn cha)
   ums.cnd.tep(host, o)    khung tệp minh chứng (SV_Files) · ums.cnd.soTep(host) = số tệp đang có
   ums.cnd.bangDiem(o)     biểu mẫu "Đăng ký công nhận từ bảng điểm" (bản cũ và bản v3) — mở NGAY TRONG TRANG, thay chỗ o.host
                           (ums.pat.formTrang, BO-CUC luật 1; trước 2026-09-30 là hộp thoại)
   ---------------------------------------------------------------------------
   Biểu mẫu "từ bảng điểm" — khác bản gốc:
     · Bảng học phần tự nhập vẽ bằng ums.ui.table (gốc nối chuỗi <tr> tay). Mở biểu mẫu là nạp các dòng
       đã lưu (LayDSDiem_NguoiHoc_Diem_CN_HP) cho CẢ hai bản — bản cũ không nạp (hàm vẽ gọi tên
       genTable_BangDiem không tồn tại), bảng giữ dòng của lần mở trước.
     · Nút "Xóa" dòng đã lưu gọi Xoa_Diem_NguoiHoc_Diem_CN_HP ở CẢ hai bản — bản cũ gọi nhầm
       pkg_hososinhvien_sukien.Xoa_SuKien_HoatDong_ThoiGian (chép từ màn sự kiện).
     · Chữ "cho học phần <b>…</b>" nay có tên học phần (gốc không bao giờ điền).
     · Hỏi lại trước khi "Xác nhận hủy kết quả đăng ký" (gốc xoá ngay, không hỏi).
     · Lưu / huỷ xong nạp lại danh sách học phần và các dòng (bản cũ không nạp lại gì).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var M = 'SV_CongNhanDiem_MH/', P = 'pkg_congthongtin_congnhandiem.';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function esc(s) { return ui.esc(s); }
    function jq(el, ev, fn) { if (window.jQuery && el) jQuery(el).on(ev, fn); }

    /* Cặp action (chuỗi mã hoá) + func — chép nguyên từ hai tệp gốc */
    var A = {
        keHoach:     [M + 'DSA4BRIKJAkuICIpAi4vJg8pIC8P', P + 'LayDSKeHoachCongNhan'],
        chuongTrinh: ['DKH_Chung_MH/DSA4BRICKTQuLyYVMygvKQPP', 'pkg_dangkyhoc_chung.LayDSChuongTrinh'],
        ds:          [M + 'DSA4BRICKTQuLyYVMygvKQkuIgPP', P + 'LayDSChuongTrinhHoc'],
        noiCap:      ['D_ThongTin_MH/DSA4BRIFKCQsHgIuEi4CLi8mDykgLwUoJCwP', 'pkg_diem_thongtin.LayDSDiem_CoSoCongNhanDiem'],
        chungChi:    [M + 'DSA4BRIFKCQsHhUpLi8mFSgvHgIpNC8mAiko', P + 'LayDSDiem_ThongTin_ChungChi'],
        capDo:       [M + 'DSAYBRIFKCQsHhUVHgICHgIgMQUu', P + 'LaYDSDiem_TT_CC_CapDo'],
        themCN:      [M + 'FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAg8P', P + 'Them_Diem_NguoiHoc_Diem_CN'],
        xoaCN:       [M + 'GS4gHgUoJCweDyY0LigJLiIeBSgkLB4CDwPP', P + 'Xoa_Diem_NguoiHoc_Diem_CN'],
        themHP:      [M + 'FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAg8eCREP', P + 'Them_Diem_NguoiHoc_Diem_CN_HP'],
        xoaHP:       [M + 'GS4gHgUoJCweDyY0LigJLiIeBSgkLB4CDx4JEQPP', P + 'Xoa_Diem_NguoiHoc_Diem_CN_HP'],
        dsHP:        [M + 'DSA4BRIFKCQsHg8mNC4oCS4iHgUoJCweAg8eCREP', P + 'LayDSDiem_NguoiHoc_Diem_CN_HP'],
        ttCongNhan:  [M + 'DSA4FRUCLi8mDykgLxU0AyAvJgUoJCwP', P + 'LayTTCongNhanTuBangDiem'],
        // chỉ bản cũ
        ddQuyDoiDK:  [M + 'DSA4BRIFKCQsHgICHgIgMQUuHhA0OAUuKB4FCgPP', P + 'LayDSDiem_CC_CapDo_QuyDoi_DK'],
        themCNCC:    [M + 'FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAg8eAgIP', P + 'Them_Diem_NguoiHoc_Diem_CN_CC'],
        // chỉ bản v3
        themCC:      [M + 'FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAgIP', P + 'Them_Diem_NguoiHoc_Diem_CC'],
        themCCDL:    [M + 'FSkkLB4FKCQsHg8JHgUoJCweAgIeBTQNKCQ0', P + 'Them_Diem_NH_Diem_CC_DuLieu'],
        ttCC:        [M + 'DSA4FRUFKCQsHg8mNC4oCS4iHgUoJCweAgIP', P + 'LayTTDiem_NguoiHoc_Diem_CC'],
        dauDiem:     [M + 'DSA4BRIFIDQFKCQsHgICHgIgMQUuHhA0OAUuKAPP', P + 'LayDSDauDiem_CC_CapDo_QuyDoi'],
        giaTriCC:    [M + 'DSA4BiggFTMoDyY0LigJLiIeBSgkLB4CAgPP', P + 'LayGiaTriNguoiHoc_Diem_CC'],
        chuaDK:      [M + 'DSA4BRIJLiIRKSAvBTQuIhA0OAUuKBUpJC4CAgPP', P + 'LayDSHocPhanDuocQuyDoiTheoCC'],
        daDK:        [M + 'DSA4BRIJLiIRKSAvBSAZICIPKSAvFSkkLgIC', P + 'LayDSHocPhanDaXacNhanTheoCC'],
        ketQua:      [M + 'DSA4BRIKJDUQNCACLi8mDykgLxU0AyAvJgUoJCwP', P + 'LayDSKetQuaCongNhanTuBangDiem'],
        ttMoRong:    ['SV_CND_ThongTin_MH/DSA4BRIVFQICDC4TLi8m', 'PKG_CONGTHONGTIN_CND_THONGTIN.LayDSTTCCMoRong'],
        themMoRong:  ['SV_CND_ThongTin_MH/FSkkLB4FKCQsHgICHhUVHgwuEy4vJh4FNA0oJDQP', 'PKG_CONGTHONGTIN_CND_THONGTIN.Them_Diem_CC_TT_MoRong_DuLieu']
    };
    function call(k, ts) {
        return ums.api.call(Object.assign({ action: A[k][0], func: A[k][1], strNguoiThucHien_Id: uid() }, ts || {}));
    }

    /* ---------- Thanh lọc Kế hoạch / Chương trình ---------------------------- */
    function sel(k, ph, extra) {
        return '<select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (extra || '') + '><option value=""></option></select>';
    }
    function locHtml(nut) {
        return pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
            '<div class="ums-field">' + sel('kh', 'Chọn kế hoạch', ' data-required') + '</div>' +
            '<div class="ums-field">' + sel('ct', 'Chọn chương trình', ' data-required') + '</div>' +
            '<div class="ums-field ums-field--fit"><div class="ums-row">' + nut + '</div></div></div>' });
    }
    /** selectFirst: true của bản gốc — chọn sẵn mục đầu, KHÔNG tự tải danh sách (gốc cũng vậy) */
    function chonDau(el, d) {
        if (!d.length || el.value) return;
        el.value = el.options[1] ? el.options[1].value : '';
        if (window.jQuery) jQuery(el).trigger('change.select2');
    }
    function napLoc(fKH, fCT) {
        var sv = uid();
        var p1 = call('keHoach', { strNguoiThucHien_Id: sv }).then(function (r) {
            var d = arr(r.data); pat.fill(fKH, d, { head: 'Chọn kế hoạch' }); chonDau(fKH, d);
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch công nhận'); });
        var p2 = call('chuongTrinh', { strQLSV_NguoiHoc_Id: sv }).then(function (r) {
            var d = arr(r.data);
            pat.fill(fCT, d, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_TOCHUCCHUONGTRINH_TEN', head: 'Chọn chương trình' });
            chonDau(fCT, d);
        }).catch(function (err) { ums.api.handle(err, 'chương trình'); });
        return Promise.all([p1, p2]);
    }

    /* ---------- Danh sách học phần (LayDSChuongTrinhHoc) --------------------- */
    function taiDS(el, ts, dk) {
        el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return call('ds', ts).then(function (r) {
            var d = arr(r.data);
            ui.table({ el: el, rows: d, empty: 'Không có học phần', columns: [
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center' },
                { title: 'Kết quả đã tích lũy tại trường', prop: 'KETQUA' },
                { title: 'Kết quả được công nhận mới', prop: 'KETQUAMOI' },
                { title: 'Thông tin xác nhận', prop: 'TINHTRANGCONGNHAN_TEN', cls: 'is-center' },
                { title: 'Đăng ký công nhận', cls: 'is-center is-nowrap', render: dk }
            ] });
            return d;
        }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học phần'); return []; });
    }

    /* ---------- Nơi cấp / Cơ sở đào tạo đã học ------------------------------- */
    var noiCapP = null;
    function noiCap() {
        if (!noiCapP) {
            noiCapP = call('noiCap', { strTuKhoa: '', strPhanLoai_Id: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { return arr(r.data); }, function (err) { noiCapP = null; ums.api.handle(err, 'nơi cấp'); return []; });
        }
        return noiCapP;
    }

    /* ---------- Loại chứng chỉ → Chứng chỉ → Cấp độ ---------------------------
       els = { loai, cc, capdo }; o.hocPhan() → strDaoTao_HocPhan_Id của LaYDSDiem_TT_CC_CapDo
       (bản cũ: học phần của dòng đang mở; v3: ""); o.onCapDo() khi chọn cấp độ;
       o.onXoa() khi cấp độ bị xoá trắng (chọn lại / xoá tầng trên) → màn đưa khung về lời nhắc. */
    function chungChi(els, o) {
        o = o || {};
        var ch = pat.chain([els.loai, els.cc, els.capdo], { phatLai: false });
        ums.api.dm('DIEM.CHUNGCHI.PHANLOAI').then(function (d) {
            pat.fill(els.loai, d, { head: pat.dmTitle(d) || 'Chọn loại chứng chỉ' }); ch.sync();
        }).catch(function (err) { ums.api.handle(err, 'loại chứng chỉ'); });
        function napCC() {
            if (o.onXoa) o.onXoa();
            if (!els.loai.value) { pat.fill(els.cc, [], { head: 'Chọn chứng chỉ' }); pat.fill(els.capdo, [], { head: 'Chọn cấp độ' }); ch.sync(); return; }
            call('chungChi', { strPhanLoaiCC_Id: els.loai.value }).then(function (r) {
                pat.fill(els.cc, arr(r.data), { name: 'TENCHUNGCHI', head: 'Chọn chứng chỉ' }); ch.sync();
            }).catch(function (err) { ums.api.handle(err, 'chứng chỉ'); });
        }
        function napCapDo() {
            if (o.onXoa) o.onXoa();
            if (!els.cc.value) { pat.fill(els.capdo, [], { head: 'Chọn cấp độ' }); ch.sync(); return; }
            call('capDo', { strPhanLoaiCC_Id: els.loai.value, strDiem_ThongTin_ChungChi_Id: els.cc.value,
                strDaoTao_HocPhan_Id: o.hocPhan ? o.hocPhan() : '' }).then(function (r) {
                pat.fill(els.capdo, arr(r.data), { name: 'TENCAPDO', head: 'Chọn cấp độ' }); ch.sync();
            }).catch(function (err) { ums.api.handle(err, 'cấp độ'); });
        }
        jq(els.loai, 'select2:select select2:clear', napCC);
        jq(els.cc, 'select2:select select2:clear', napCapDo);
        jq(els.capdo, 'select2:select', function () { if (o.onCapDo) o.onCapDo(); });
        jq(els.capdo, 'select2:clear', function () { if (o.onXoa) o.onXoa(); });
        return ch;
    }

    /* ---------- Tệp minh chứng (edu.system.uploadFiles / viewFiles / saveFiles, API SV_Files) --- */
    function tep(host, o) { return ums.files.mount(host, Object.assign({ api: 'SV_Files' }, o || {})); }
    function soTep(host) { return host ? host.querySelectorAll('.ums-files__item').length : 0; }

    /* ---------- Biểu mẫu "Đăng ký công nhận từ bảng điểm" (trong trang) ---------
       o = { host (vùng gốc của màn — biểu mẫu thay chỗ mọi khối đang hiện trong đó), row (dòng danh sách), kh, ct, v3,
             ngayCC() → { cap, het } (v3: ô của tab chứng chỉ), onDone() (nạp lại danh sách) }
       Trả đối tượng của ums.pat.formTrang ({ body, el, close(), closed }).                     */
    function bangDiem(o) {
        var row = o.row, sv = uid(), v3 = !!o.v3;
        var ds = [];      // [{ rec: dòng đã lưu | null, ten, tc, diem }]
        var dlg = pat.formTrang({
            host: o.host, title: 'Đăng ký công nhận từ bảng điểm', icon: 'fa-table-list', cols: 1,
            body: '<p class="ums-u-fz13 ums-u-mb-2">Chọn danh sách các học phần sử dụng để công nhận điểm cho học phần <b>' +
                    esc(e(row.DAOTAO_HOCPHAN_TEN)) + '</b></p>' +
                '<div data-x="hp"></div>' +
                '<div class="ums-row ums-row--end ums-u-mt-2">' + ui.btn('add', { text: 'Thêm mới dòng', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-x': 'them' } }) + '</div>' +
                '<div class="ums-row ums-row--between ums-u-mt-4"><b>Điểm quy đổi' + (v3 ? ': <span data-x="qd"></span>' : '') + '</b>' +
                    (v3 ? '' : ui.btn('search', { text: 'Xem kết quả', mod: 'out-primary', icon: 'fa-magnifying-glass', attr: { disabled: 'disabled', title: 'Bản gốc chưa gắn xử lý cho nút này' } })) + '</div>' +
                '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                    ui.field('Cơ sở đào tạo đã học', '<select class="ums-select" data-x="coso" data-ph="Chọn nơi cấp"><option value=""></option></select>') +
                    ui.field('Nhập minh chứng', '<div data-x="tep"></div>') + '</div>',
            buttons: [
                { text: 'Xác nhận hủy kết quả đăng ký', kind: 'del', mod: 'out-warn', onClick: function () { huy(); return false; } },
                { text: 'Xác nhận đồng ý quy đổi điểm', kind: 'save', mod: 'primary', onClick: function () { luu(); return false; } }
            ]
        });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        // "Xác nhận hủy kết quả đăng ký" chỉ hiện khi học phần đã có tình trạng công nhận (btnOpenDelete)
        var nutHuy = dlg.el.querySelector('.ums-panel__tools [data-ft="0"]');     // formTrang: nút mang data-ft = chỉ số trong buttons
        if (nutHuy) nutHuy.hidden = !row.TINHTRANGCONGNHAN;
        ui.enhance(dlg.body);
        var files = tep(q('tep'));
        function khoaTep() { return v3 ? 'BangDiem' + o.kh + sv + q('coso').value : 'BangDiem' + sv + row.ID; }

        noiCap().then(function (d) { pat.fill(q('coso'), d, { head: 'Chọn nơi cấp' }); });
        if (v3) {
            // getList_TTCongNhan: đặt sẵn cơ sở đã khai, rồi hiện tệp theo khoá có cơ sở
            Promise.all([noiCap(), call('ttCongNhan', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: o.ct,
                strDiem_KeHoachCongNhan_Id: o.kh, strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID })])
                .then(function (x) {
                    var d = arr(x[1].data);
                    q('coso').value = d.length ? e(d[0].DIEM_COSODAOTAOCONGNHANDIEM_ID) : '';
                    if (window.jQuery) jQuery(q('coso')).trigger('change.select2');
                    files.load(khoaTep());
                }).catch(function (err) { ums.api.handle(err, 'thông tin công nhận'); });
            jq(q('coso'), 'select2:select select2:clear', function () { files.load(khoaTep()); });
        } else {
            files.load(khoaTep());
        }

        /* ----- Bảng học phần tự nhập ----- */
        function doc() {
            Array.prototype.forEach.call(q('hp').querySelectorAll('input[data-i]'), function (el) {
                var r = ds[Number(el.getAttribute('data-i'))];
                if (r) r[el.getAttribute('data-k')] = el.value;
            });
        }
        function o_(i, k, v) { return '<input class="ums-input ums-input--sm" data-i="' + i + '" data-k="' + k + '" value="' + esc(v) + '" autocomplete="off">'; }
        function ve() {
            ui.table({ el: q('hp'), rows: ds, tableCls: 'ums-table--lined ums-table--tight', empty: 'Chưa có học phần — bấm "Thêm mới dòng"', columns: [
                { title: 'Tên học phần', render: function (r, i) { return o_(i, 'ten', r.ten); } },
                { title: 'Số tín chỉ/Số đơn vị học trình', cls: 'is-center', width: '190px', render: function (r, i) { return o_(i, 'tc', r.tc); } },
                { title: 'Điểm', cls: 'is-center', width: '110px', render: function (r, i) { return o_(i, 'diem', r.diem); } },
                { title: 'Chọn', cls: 'is-center', width: '100px', render: function (r, i) {
                    return '<button type="button" class="ums-btn ums-btn--out-danger ums-btn--sm" data-xoa="' + i + '"><i class="fa-light fa-trash-can"></i><span>' +
                        (r.rec ? 'Xóa' : 'Xóa dòng') + '</span></button>';
                } }
            ] });
        }
        function napHP() {
            q('hp').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return call('dsHP', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: o.ct, strDiem_KeHoachCongNhan_Id: o.kh,
                strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID }).then(function (r) {
                var d = arr(r.data);
                if (v3 && q('qd')) q('qd').textContent = d.length ? e(d[0].DIEMCONGNHAN) : '';
                ds = d.map(function (x) { return { rec: x, ten: e(x.TENHOCPHAN), tc: e(x.SOTINCHI), diem: e(x.DIEM) }; });
                ve();
            }).catch(function (err) { q('hp').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần đã nhập'); });
        }
        dlg.body.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('[data-x="them"]'))) { doc(); ds.push({ rec: null, ten: '', tc: '', diem: '' }); ve(); return; }
            if ((b = ev.target.closest('[data-xoa]'))) {
                doc();
                var r = ds[Number(b.getAttribute('data-xoa'))];
                if (!r) return;
                if (!r.rec) { ds.splice(ds.indexOf(r), 1); ve(); return; }
                ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá', title: 'Xoá học phần' }).then(function (yes) {
                    if (!yes) return;
                    return call('xoaHP', { strId: r.rec.ID }).then(function () { ui.toast('Xóa thành công!', 'ok'); return napHP(); });
                }).catch(function (err) { ums.api.handle(err, 'xoá học phần'); });
            }
        });
        napHP();

        /* ----- Lưu: Them_Diem_NguoiHoc_Diem_CN → mỗi dòng có tên Them_…_CN_HP → tệp ----- */
        function luu() {
            doc();
            if (v3 && !soTep(q('tep'))) { ui.toast('Bạn cần chọn file minh chứng!', 'warn'); return; }
            var coso = q('coso').value;
            call('themCN', { strLoai: v3 ? 'DIEM' : '', strDiem_TT_CC_CapDo_Id: '', strQLSV_NguoiHoc_Id: sv,
                strDaoTao_ChuongTrinh_Id: o.ct, strDiem_KeHoachCongNhan_Id: o.kh, strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID,
                strNgayCap: '', strNoiCap_Id: coso, strNgayHetHan: '' }).then(function (r) {
                var id = (r.raw && r.raw.Id) || '';
                var dong = ds.filter(function (x) { return String(x.ten).trim(); });
                return dong.reduce(function (p, x) {
                    return p.then(function () {
                        // strThangDiem_Id = id vừa tạo — tham số thứ hai của save_BangDiemDauDiem(this.id, strId) ở gốc
                        return call('themHP', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: o.ct, strDiem_KeHoachCongNhan_Id: o.kh,
                            strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID, strThangDiem_Id: id, strTenHocPhan: x.ten, dSoTinChi: x.tc, dDiem: x.diem })
                            .catch(function (err) { ums.api.handle(err, 'lưu học phần ' + x.ten); });
                    });
                }, Promise.resolve()).then(function () { return files.save(khoaTep()); }).then(function () {
                    ui.toast('Thêm mới thành công!', 'ok');
                    row.TINHTRANGCONGNHAN = row.TINHTRANGCONGNHAN || 1;
                    if (nutHuy) nutHuy.hidden = false;
                    if (o.onDone) o.onDone();
                    napHP();
                    files.load(khoaTep());
                });
            }).catch(function (err) { ums.api.handle(err, 'đăng ký công nhận'); });
        }

        /* ----- Huỷ: Xoa_Diem_NguoiHoc_Diem_CN ----- */
        function huy() {
            ui.confirm('Hủy kết quả đăng ký công nhận điểm của học phần này?', { tone: 'bad', ok: 'Hủy đăng ký', title: 'Xác nhận hủy' }).then(function (yes) {
                if (!yes) return;
                var n = o.ngayCC ? o.ngayCC() : { cap: '', het: '' };
                return call('xoaCN', { strLoai: v3 ? 'DIEM' : '', strDiem_TT_CC_CapDo_Id: row.ID, strQLSV_NguoiHoc_Id: sv,
                    strDaoTao_ChuongTrinh_Id: o.ct, strDiem_KeHoachCongNhan_Id: o.kh, strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID,
                    strNgayCap: n.cap, strNoiCap_Id: v3 ? q('coso').value : '', strNgayHetHan: n.het }).then(function () {
                    ui.toast('Thực hiện thành công!', 'ok');
                    if (o.onDone) o.onDone();
                    dlg.close();
                });
            }).catch(function (err) { ums.api.handle(err, 'hủy kết quả đăng ký'); });
        }
        return dlg;
    }

    ums.cnd = { A: A, call: call, uid: uid, e: e, arr: arr, sel: sel, locHtml: locHtml, napLoc: napLoc, taiDS: taiDS,
        noiCap: noiCap, chungChi: chungChi, tep: tep, soTep: soTep, bangDiem: bangDiem };
})();
