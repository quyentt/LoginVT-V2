/* =========================================================================
   nhapdiem — Nhập điểm theo phách (Thi phách): danh sách đợt phách → khung "Đánh túi bài thi của đợt phách đang chọn"
   (chọn túi, nhập điểm từng số phách), ba luồng xác nhận: theo đợt / theo túi / từng phách.
   Bản gốc: ApisThiPhach/Modules/kehoach/html/nhapdiem.html + script/nhapdiem.js (nạp dưới tên NhapDiem.js).
   Khung chung: _tp_nd.js (ums.tpNd) — ghi chú lời gọi chung (bộ lọc, xác nhận, ngày nhận bài, cán bộ chấm thi) ở đó.
   Bản anh em: ApisCongCanBo/Modules/nhapdiem/script/tuibai.js (gốc lệch 380 dòng: hộp thoại thay vì khung thay chỗ, ô chọn
   trạng thái thay vì nút, không có hai cột Ngày nhận bài / Cán bộ chấm thi, tự chọn thời gian đầu, có Tải bảng điểm).
   ---------------------------------------------------------------------------
   Lời gọi riêng của màn (kiểu cũ, chép nguyên; GET trừ khi ghi):
       TP_Chung/LayDotTaoPhach (strDotThi_Id, strDaoTao_HocPhan_Id) — nạp ngay khi mở màn và mỗi lần đổi ô lọc (như gốc)
       TP_Chung/LayDSTuiTheoDotPhach (strThi_DotPhach_Id) — tự chọn túi đầu
       TP_XuLy/LayDSPhachTheoTui (strThi_TuiBai_Id)
       Lưu: POST TP_XuLy/CapNhat_DiemPhachTheoTuiBai mỗi dòng đã sửa (strChucNang_Id, strUngDung_Id = vai trò đăng nhập,
         strThi_TuiBai_NguoiHoc_Id = ID dòng, strSoPhach = SOPHACH của dòng, strDiem)
       Xác nhận: theo ĐỢT   XACNHAN_HOANTHANH_DIEMTUIBAI — mỗi đợt đánh dấu một lời gọi, lịch sử của đợt ĐẦU
                 theo TÚI   XACNHAN_HOANTHANH_DIEM_TUIBAI — id túi đang chọn
                 từng PHÁCH XACNHAN_HOANTHANH_DIEM_TUIBAI_NGUOIHOC — id = id túi + QLSV_NGUOIHOC_ID (ghép như gốc)
       Báo cáo (có cả Import — html gốc có vùng zonebtnBaoCao_Nhap_Import): strDaoTao_ThoiGianDaoTao_Id, strThi_DotThi_Id,
         strDaoTao_HocPhan_Id, strDanhSachThi_Id (đợt mở gần nhất) + một strDanhSachThi_Id mỗi đợt đánh dấu.
   Không chép (lỗi rõ của bản gốc):
     · Bảng danh sách: html chỉ có ba tiêu đề (Stt, Đợt phách, ô chọn) mà mã vẽ thêm hai cột Ngày nhận bài / Cán bộ chấm thi
       → lệch cột; bản mới đủ tiêu đề. Bảng phách tương tự (cột ô đánh dấu không tiêu đề, không nơi nào đọc) → bỏ cột đó.
     · Ô từ khoá không được gửi ở lời gọi nào → lọc ngay trên danh sách (tên đợt phách).
     · Khai phân trang nhưng không gửi pageIndex / pageSize (máy chủ trả hết) → không phân trang.
     · Đổi túi làm nạp lại danh sách đợt phách phía sau (đang ẩn) → bỏ, đóng khung mới nạp lại.
     · "Xác nhận theo túi" khi chưa có túi gửi id rỗng → báo "Chọn túi".
   Giữ như gốc: dòng CAMTHI_DUYETDKTHI / CAMTHI_VIPHAMQUYCHE = 1 để trống ô điểm; hai mã XACNHAN_HOANTHANH_DIEMTUIBAI /
     XACNHAN_HOANTHANH_DIEM_TUIBAI chỉ khác dấu gạch.
   Cha → con: Thời gian → Loại điểm → Hình thức thi → Đợt thi → Môn thi (khoá, pat.chain trong ums.nd.locThi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, nd = ums.nd, T = ums.tpNd, e = T.e, arr = T.arr;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function esc(s) { return ui.esc(s); }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }

    T.man(document.getElementById('tp-nhapdiem'), {
        tieuDe: 'Nhập điểm theo phách', tuTai: true, rong: 'Không có đợt phách',
        loc: [{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'ld', type: 'select', label: 'Chọn loại điểm' },
            { key: 'ht', type: 'select', label: 'Chọn hình thức thi' }, { key: 'dot', type: 'select', label: 'Chọn đợt thi' },
            { key: 'mon', type: 'select', label: 'Chọn môn thi' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }],
        tai: function (v) { return get('TP_Chung/LayDotTaoPhach', { strDotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon') }); },
        hien: function (ds, v) { var q = v('q').toLowerCase(); return q ? ds.filter(function (x) { return String(e(x.TEN)).toLowerCase().indexOf(q) >= 0; }) : ds; },
        cot: function (lk) { return [{ title: 'Đợt phách', render: function (x) { return lk(x.TEN, x); } }]; },
        loaiXN: 'XACNHAN_HOANTHANH_DIEMTUIBAI', chuDeXN: 'Đợt phách',
        baoCao: function (add, v) { add('strDaoTao_ThoiGianDaoTao_Id', v('tg')); add('strThi_DotThi_Id', v('dot')); add('strDaoTao_HocPhan_Id', v('mon')); },
        ct: {
            icon: 'fa-album-collection',
            tieuDe: function (x) {
                return 'Đánh túi bài thi của đợt phách đang chọn ' + e(x.TEN) + ' - ' + [x.QUYTACTAOTUI_TEN, x.QUYTACTAOPHACH_TEN, x.BUOCNHAY, x.SOBATDAU].map(e).join(' - ');
            },
            tools: ui.btn('confirm', { text: 'Xác nhận theo túi', mod: 'out-primary', attr: { 'data-c': 'xntui' } }) +
                ui.btn('confirm', { text: 'Xác nhận từng phách', mod: 'out-success', attr: { 'data-c': 'xnphach' } }),
            tren: '<div class="nd-thanh"><div class="nd-thanh__trai"><div class="ums-field"><select class="ums-select" data-c="tui" data-ph="Chọn danh sách thi"><option value=""></option></select></div></div></div>',
            mo: function (dot, k) {
                var h = k.bang, oTui = k.q('tui'), NH = [];
                function tui() { return oTui.value; }
                function tai2() {
                    if (!tui()) { NH = []; h.innerHTML = ui.empty('Đợt phách chưa có túi', 'fa-box-open'); return Promise.resolve(); }
                    h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                    return get('TP_XuLy/LayDSPhachTheoTui', { strThi_TuiBai_Id: tui() }).then(function (r) {
                        NH = arr(r.data);
                        ui.table({ el: h, rows: NH, empty: 'Túi chưa có phách', columns: [
                            { title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' },
                            { title: 'Điểm', cls: 'is-center', render: function (x, i) {
                                if (String(x.CAMTHI_DUYETDKTHI) === '1' || String(x.CAMTHI_VIPHAMQUYCHE) === '1') return '';
                                var g = esc(e(x.DIEMBANDAU));
                                return '<input class="ums-input ums-input--sm nd-o" id="txtDiem' + esc(x.ID) + '" data-r="' + i + '" data-c="0" data-goc="' + g + '" value="' + g + '" autocomplete="off">';
                            } },
                            { title: 'Mức vi phạm', prop: 'THONGTINXULY' },
                            { title: 'Người cập nhật', prop: 'NGUOISUA_TAIKHOAN' },
                            { title: 'Ngày cập nhật', prop: 'NGAYSUA_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
                        var t = h.querySelector('table');
                        if (t) t.classList.add('nd-luoi');
                    }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phách'); });
                }
                h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                get('TP_Chung/LayDSTuiTheoDotPhach', { strThi_DotPhach_Id: dot.ID }).then(function (r) {
                    var d = arr(r.data);
                    pat.fill(oTui, d, { head: 'Chọn danh sách thi' });
                    if (d.length) { oTui.value = d[0].ID; if (window.jQuery) jQuery(oTui).trigger('change.select2'); }
                    return tai2();
                }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'túi'); });
                if (window.jQuery) jQuery(oTui).on('select2:select select2:clear', tai2);

                function luu() {
                    var doi = nd.oDoi(h);
                    if (!doi.length) { ui.toast('Chưa có điểm mới nào cần lưu', 'info'); return; }
                    ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { title: 'Lưu điểm' }).then(function (yes) {
                        if (!yes) return;
                        ui.batch(doi.map(function (i) {
                            var x = NH.filter(function (n) { return 'txtDiem' + n.ID === i.id; })[0] || {};
                            return { action: 'TP_XuLy/CapNhat_DiemPhachTheoTuiBai', method: 'POST', strChucNang_Id: cn(), strUngDung_Id: vt(), strNguoiThucHien_Id: uid(),
                                strThi_TuiBai_NguoiHoc_Id: x.ID, strSoPhach: e(x.SOPHACH), strDiem: i.value.trim() };
                        }), { title: 'Đang lưu điểm', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(tai2);
                    });
                }
                return {
                    luu: luu,
                    doi: function () { return nd.oDoi(h).length; },
                    nut: function (a) {
                        if (!tui()) { ui.toast('Chọn túi', 'warn'); return; }
                        if (a === 'xntui') nd.xacNhanNut({ tieuDe: 'Xác nhận', chuDe: 'Theo túi', icon: 'fa-check-to-slot', loai: 'XACNHAN_HOANTHANH_DIEM_TUIBAI', ids: [tui()], lichSu: tui() });
                        else if (a === 'xnphach') {
                            var idTui = tui();
                            T.tungDong({ chuDe: 'Từng phách', icon: 'fa-clipboard-check', loai: 'XACNHAN_HOANTHANH_DIEM_TUIBAI_NGUOIHOC', ds: NH,
                                cot: [{ title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' }], khoa: function (x) { return idTui + e(x.QLSV_NGUOIHOC_ID); } });
                        }
                    }
                };
            }
        }
    });
})();
