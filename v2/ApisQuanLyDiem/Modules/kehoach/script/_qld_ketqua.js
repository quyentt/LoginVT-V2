/* =========================================================================
   Kế hoạch công nhận điểm — vùng "Kết quả công nhận" (#zoneQuanSo của gốc, nút "Chi tiết"
   ở cột "Kết quả đăng ký")
   Bản gốc: ApisQuanLyDiem/Modules/kehoach/script/kehoach.js
       getList_QuanSoTheoLop · genTable_QuanSoTheoLop · .btnDownloadAllFile → save_GopFile
       #tblQuanSoLop .btnEdit → hộp #lichsu_chitiet (nay biểu mẫu trong trang, ums.pat.formTrang): getDetail_CongNhanDiem · viewForm_CongNhanDiem
         · getList_LoaiChungChi · getList_PhanLoai · getList_CoSo · save_CongNhanDiem · delete_CongNhanDiem
       .btnXacNhan → hộp #modal_XacNhan: getList_LoaiCongNhan · getList_TrangThai · loadBtnXacNhan · save_XacNhan
   ---------------------------------------------------------------------------
   ums.qldKh.taoKetQua(zone, { onClose }) → { mo(dòng kế hoạch) }

   Lời gọi (chép nguyên):
     SV_CongNhanDiem_MH/DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeERUP  PKG_CONGTHONGTIN_CONGNHANDIEM.LayDSKH_NguoiHoc_HP_Cap_PT
         strDiem_KeHoachCongNhan_Id · strQLSV_QuyetDinh_Id '' (dropAAAA) · pageIndex · pageSize (phân trang máy chủ)
     SV_Files/LayDanhSach  GET  strDuLieu_Id = "CongNhan" + DIEM_KEHOACHCONGNHANDIEM_ID + QLSV_NGUOIHOC_ID (cột Files
         — edu.system.viewFiles, mỗi dòng một lời gọi như gốc)
     CMS_Files/GopFile  arrTuKhoa (đường dẫn) · arrDuLieu (tên "MASO_HỌ TÊN//n_MASO_HỌ TÊN_tên tệp") → mở
         <RootPathUpload>/<Data>
     Hộp sửa:
       SV_CongNhanDiem/LayTTDiem_NguoiHoc_HocPhan_Cap  GET  strDiem_KeHoachCongNhan_Id · strQLSV_NguoiHoc_Id · strDaoTao_HocPhan_Id
       SV_CongNhanDiem/LayDSLoaiCC_BangDiem           GET  (ô Loại chứng chỉ)
       SV_CongNhanDiem/LayDSLoaiCC_BDTheoPhanLoai     GET  strLoaiCC_BD_Id = ô Loại chứng chỉ (ô Loại công nhận)
       SV_CongNhanDiem/LayDSCoSoDaoTaoTheoLoai        GET  strLoaiCongNhan_Id = ô Loại công nhận (ô Cơ sở đào tạo)
       SV_CongNhanDiem/Them_Diem_NguoiHoc_HocPhan_Cap POST strId = ID bản ghi chi tiết · strDiem_KeHoachCongNhan_Id
           · strLoaiCongNhan_Id · strQLSV_NguoiHoc_Id · strDaoTao_HocPhan_Id · strDiem_CoSoCongNhan_Id · strGhiChu
           · strNgayHetHan · strNgayCap · strDiem · strThongTinHocPhan_ChungChi · strHeDaoTao · dSoTinChi
       D_CoSoCongNhanDiem/Xoa_Diem_NguoiHoc_HocPhan_Cap POST strIds = ID bản ghi chi tiết
       Tệp: ums.files (SV_Files) — LayDanhSach / ThemMoi / Xoa, khoá "CongNhan" + kế hoạch + người học.
     Hộp Xác nhận:
       SV_CND_ThongTin/LayDSLoaiCongNhan          GET  (ô "Hành động Xác nhận" — chữ gợi ý "Chọn loại công nhận")
       SV_CND_ThongTin/LayDSHanhDongTheoXacNhan   GET  strLoaiXacNhan_Id = ô trên → các nút (TEN, THONGTIN1 biểu
           tượng FA4 qua ums.iconFA4, THONGTIN2 kiểu CSS)
       SV_CND_ThongTin_MH/FSkkLB4FKCQsHgUKHgIuLyYPKSAvHhkgIg8pIC8P  pkg_congthongtin_cnd_thongtin.Them_Diem_DK_CongNhan_XacNhan
           strDuLieuXacNhan = DULIEUXACNHAN của dòng · strNguoiXacnhan_Id = userId · strLoaiXacNhan_Id
           · strNoiDung · strHanhDong_Id = ID nút (mỗi dòng đã đánh dấu một lời gọi)
     Import "1. Import xác nhận": IMPORTWITHPROC_DCNXM (ums.report.importChung).

   Lỗi gốc đã sửa (làm theo ý định):
     · Xác nhận gửi strLoaiXacNhan_Id = ô #dropLoaiCongNhan của HỘP SỬA (ô khác hộp, thường trống hoặc còn giá trị
       của lần mở trước) — nay gửi ô "Hành động Xác nhận" của CHÍNH hộp Xác nhận (ô gốc nạp danh sách loại công
       nhận, chữ gợi ý "Chọn loại công nhận"). strNoiDung gốc đọc #strNoiDung KHÔNG tồn tại (luôn rỗng) trong khi
       ô "Nội dung Xác nhận" đọc ra rồi bỏ — nay gửi ô đó.
     · Hộp sửa: gốc không xoá trắng biểu mẫu và giữ strCongNhanDiem_Id của lần mở trước khi LayTTDiem… không trả
       dòng nào → Lưu ghi đè bản ghi của sinh viên khác. Nay xoá trắng + strId rỗng khi không có chi tiết.
     · Loại chứng chỉ → Loại công nhận → Cơ sở: gốc chỉ nạp lúc mở hộp, đổi ô cha không nạp lại ô con. Nay nối
       tầng (luật cha → con, ums.pat.chain).
     · Tệp minh chứng: gốc bật tải lên (uploadFiles) nhưng Lưu không gọi saveFiles → tệp tải lên bị bỏ. Nay Lưu
       xong gắn tệp mới vào khoá "CongNhan…" (đường GHI mới — kiểm trên host).
   Cố ý bỏ: khối "Lịch sử Xác nhận" của hộp (getList_XacNhan bị chú thích, bảng luôn trống; hộp áp cho NHIỀU dòng
   nên không có lịch sử một dòng); hai nút Đóng / Xác nhận lặp lại ở chân khung (giữ một bộ ở đầu khung).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var Q = ums.qldKh, K = Q.K, e = Q.e;
    var CN = 'SV_CongNhanDiem/';

    Q.taoKetQua = function (zone, o) {
        o = o || {};
        var kh = null, rows = [], page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0;
        var tep = {};           // ID dòng → [{ url, ten }]
        var loaiCC = null;      // Promise danh sách loại chứng chỉ (nạp một lần như init của gốc)

        zone.innerHTML = pat.panel({
            title: 'Kết quả công nhận', icon: 'fa-list-check', count: 'n', flush: true, cls: 'qldkh-kq',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('importer', { text: 'Import xác nhận', attr: { 'data-a': 'import' } }) +
                ui.btn('excel', { text: 'Tải file', icon: 'fa-cloud-arrow-down', attr: { 'data-a': 'taifile' } }) +
                ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } }),
            body: '<div class="ums-filter qldkh-loc"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Tìm trong bảng" autocomplete="off"></div></div>' +
                '<div data-z="t"></div>'
        });
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        K.ganChon(zone);
        var loc = K.locTaiCho(zone.querySelector('[data-f="q"]'), z('t'));

        function tai(p) {
            if (p) page = p;
            var host = z('t');
            K.dang(host);
            ums.api.call({
                action: Q.CN + 'DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeERUP', func: 'PKG_CONGTHONGTIN_CONGNHANDIEM.LayDSKH_NguoiHoc_HP_Cap_PT',
                strDiem_KeHoachCongNhan_Id: kh.ID, strQLSV_QuyetDinh_Id: '', strNguoiThucHien_Id: '',
                pageIndex: page, pageSize: size
            }).then(function (r) {
                rows = K.ds(r);
                total = Number(r.pager) || rows.length;
                ve();
            }).catch(function (err) { K.loi(host, err, 'kết quả công nhận'); });
        }

        function ve() {
            z('n').textContent = '(' + total + ')';
            tep = {};
            ui.table({
                el: z('t'), rows: rows, empty: 'Chưa có sinh viên đăng ký công nhận',
                page: {
                    index: page, size: size, total: total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tai(p); },
                    onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); tai(1); }
                },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', cls: 'qldkh-ten', render: function (r) { return esc(K.hoTen(r)); } },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Loại chứng chỉ / Bảng điểm', prop: 'LOAICONGNHAN_TEN' },
                    { title: 'Học phần trong CTDT', prop: 'DAOTAO_HOCPHAN_TEN', cls: 'qldkh-ten' },
                    { title: 'Điểm xin công nhận', prop: 'DIEM', cls: 'is-center' },
                    { title: 'Tên học phần / Tên chứng chỉ nơi đã công nhận', prop: 'THONGTINHOCPHAN_CHUNGCHI', cls: 'qldkh-ten' },
                    { title: 'Số tín chỉ nơi đã công nhận', prop: 'SOTINCHI', cls: 'is-center' },
                    { title: 'Hệ đào tạo nơi đã công nhận', prop: 'HEDAOTAO' },
                    { title: 'Ngày cấp', prop: 'NGAYCAP', cls: 'is-center is-nowrap' },
                    { title: 'Ngày hết hạn', prop: 'NGAYHETHAN', cls: 'is-center is-nowrap' },
                    { title: 'Nơi cấp', prop: 'DIEM_COSODAOTAOCNDIEM_TEN' },
                    { title: 'Files', render: function (r) { return '<div class="qldkh-tep" data-tep="' + esc(r.ID) + '"></div>'; } },
                    { title: 'Khoa xác nhận', prop: 'TINHTRANG_TEN' },
                    { title: 'Đào tạo xác nhận', prop: 'TINHTRANGDAOTAO_TEN' },
                    { title: 'Sửa', cls: 'is-center is-actions', render: function (r) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                    } },
                    K.cotChon('kqq')
                ]
            });
            loc();
            rows.forEach(napTep);
        }

        /* edu.system.viewFiles("lblFile" + ID, "CongNhan" + KH + NH, "SV_Files") — chỉ xem */
        function napTep(r) {
            var id = 'CongNhan' + e(r.DIEM_KEHOACHCONGNHANDIEM_ID) + e(r.QLSV_NGUOIHOC_ID);
            ums.api.call({ action: 'SV_Files/LayDanhSach', method: 'GET', silent: true, strDuLieu_Id: id }).then(function (res) {
                var ds = K.ds(res).filter(function (x) { return x.FILEMINHCHUNG; })
                    .map(function (x) { return { url: x.FILEMINHCHUNG, ten: x.TENHIENTHI || String(x.FILEMINHCHUNG).split('/').pop() }; });
                tep[r.ID] = ds;
                var o_ = z('t').querySelector('[data-tep="' + (window.CSS && CSS.escape ? CSS.escape(r.ID) : r.ID) + '"]');
                if (o_) o_.innerHTML = ds.map(function (f) {
                    return '<a href="' + esc(ums.files.url(f.url)) + '" target="_blank" rel="noopener" title="' + esc(f.ten) + '">' +
                        '<i class="fa-light fa-paperclip"></i> ' + esc(f.ten) + '</a>';
                }).join('');
            }).catch(function () { /* như gốc: lỗi thì để trống ô */ });
        }

        /* .btnDownloadAllFile → CMS_Files/GopFile (bỏ dòng đang bị ô tìm ẩn đi, như gốc bỏ tr :hidden) */
        function taiFile() {
            var arrUrl = [], arrTen = [];
            rows.forEach(function (r) {
                var tr = z('t').querySelector('[data-tep="' + (window.CSS && CSS.escape ? CSS.escape(r.ID) : r.ID) + '"]');
                tr = tr && tr.closest('tr');
                if (tr && tr.hidden) return;
                var n = 0, goc = e(r.QLSV_NGUOIHOC_MASO) + '_' + K.hoTen(r);
                (tep[r.ID] || []).forEach(function (f) {
                    if (arrUrl.indexOf(f.url) >= 0) return;
                    arrUrl.push(f.url);
                    arrTen.push(goc + '//' + (++n) + '_' + goc + '_' + f.ten);
                });
            });
            if (!arrUrl.length) { ui.toast('Không có tệp nào để tải', 'warn'); return; }
            ums.api.call({ action: 'CMS_Files/GopFile', arrTuKhoa: arrUrl, arrDuLieu: arrTen, strNguoiThucHien_Id: '' }).then(function (r) {
                var d = r.data;
                if (d && typeof d === 'string') window.open(ums.files.url(d));
            }).catch(function (err) { ums.api.handle(err, 'gộp tệp'); });
        }

        /* ---------- Biểu mẫu "Xem thông tin đăng ký công nhận điểm" — TRONG TRANG (BO-CUC luật 1): thay chỗ khung
           "Kết quả công nhận" (zone đã là khung thay chỗ danh sách kế hoạch → tầng hai). Lưu xong Ở LẠI biểu mẫu như gốc. ---------- */
        function napLoaiCC() {
            if (!loaiCC) loaiCC = ums.api.call({ action: CN + 'LayDSLoaiCC_BangDiem', method: 'GET', type: 'GET', strNguoiThucHien_Id: '' })
                .then(K.ds, function (err) { loaiCC = null; throw err; });
            return loaiCC;
        }
        function sua(r) {
            var ctId = '';
            var fld = function (label, ctl) { return ui.field(label, ctl); };
            var dlg = pat.formTrang({
                host: zone, title: 'Xem thông tin đăng ký công nhận điểm', icon: 'fa-pen-to-square', cols: 1,
                body: '<div class="ums-kv"><span>Sinh viên:</span><b>' + esc(e(r.QLSV_NGUOIHOC_MASO) + ' - ' + K.hoTen(r)) + '</b></div>' +
                    '<div class="ums-kv"><span>Học phần đăng ký công nhận kết quả:</span><b>' + esc(e(r.DAOTAO_HOCPHAN_MA) + ' - ' + e(r.DAOTAO_HOCPHAN_TEN)) + '</b></div>' +
                    '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                        '<div style="grid-column:1 / -1">' + fld('Các file dữ liệu chứng minh (bảng điểm, kết quả...)', '<div data-x="tep"></div>') + '</div>' +
                        fld('Loại chứng chỉ', '<select class="ums-select" data-x="lcc" data-ph="Chọn loại chứng chỉ"><option value=""></option></select>') +
                        fld('Loại công nhận', '<select class="ums-select" data-x="lcn" data-ph="Chọn loại"><option value=""></option></select>') +
                        fld('Cơ sở đào tạo(nơi cấp)', '<select class="ums-select" data-x="cs" data-ph="Chọn cơ sở"><option value=""></option></select>') +
                        fld('Kết quả đã được công nhận', '<input class="ums-input" data-x="kq" autocomplete="off">') +
                        fld('Ngày được cấp', '<input class="ums-input" data-x="nc" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                        fld('Ngày hết hạn', '<input class="ums-input" data-x="nh" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                        fld('Tên học phần/Tên chứng chỉ đã công nhận', '<input class="ums-input" data-x="thp" autocomplete="off">') +
                        fld('Số tín chỉ', '<input class="ums-input" data-x="stc" inputmode="decimal" autocomplete="off">') +
                        fld('Hệ đào tạo', '<input class="ums-input" data-x="he" autocomplete="off">') +
                        '<div style="grid-column:1 / -1">' + fld('Mô tả khác', '<textarea class="ums-textarea" data-x="gc"></textarea>') + '</div>' +
                    '</div>',
                buttons: [
                    { text: 'Xóa', kind: 'del', keepOpen: true, onClick: function () { xoaCT(); return false; } },
                    { text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luuCT(); return false; } }
                ]
            });
            var B = dlg.body;
            function x(k) { return B.querySelector('[data-x="' + k + '"]'); }
            var tepCtl = ums.files.mount(x('tep'), { api: 'SV_Files' });
            var khoaTep = 'CongNhan' + e(r.DIEM_KEHOACHCONGNHANDIEM_ID) + e(r.QLSV_NGUOIHOC_ID);
            tepCtl.load(khoaTep);

            function napLCN(giu) {
                if (!x('lcc').value) { Q.chon(x('lcn'), [], 'Chọn loại'); return Promise.resolve(); }
                return ums.api.call({ action: CN + 'LayDSLoaiCC_BDTheoPhanLoai', method: 'GET', type: 'GET', strLoaiCC_BD_Id: x('lcc').value, strNguoiThucHien_Id: '' })
                    .then(function (res) { Q.chon(x('lcn'), K.ds(res), 'Chọn loại'); if (giu !== undefined) Q.datGiaTri(x('lcn'), giu); })
                    .catch(function (err) { ums.api.handle(err, 'loại công nhận'); });
            }
            function napCS(giu) {
                if (!x('lcn').value) { Q.chon(x('cs'), [], 'Chọn cơ sở'); return Promise.resolve(); }
                return ums.api.call({ action: CN + 'LayDSCoSoDaoTaoTheoLoai', method: 'GET', type: 'GET', strLoaiCongNhan_Id: x('lcn').value, strNguoiThucHien_Id: '' })
                    .then(function (res) { Q.chon(x('cs'), K.ds(res), 'Chọn cơ sở'); if (giu !== undefined) Q.datGiaTri(x('cs'), giu); })
                    .catch(function (err) { ums.api.handle(err, 'cơ sở đào tạo'); });
            }
            if (window.jQuery) {
                jQuery(x('lcc')).on('select2:select select2:clear', function () { napLCN().then(function () { napCS(); }); });
                jQuery(x('lcn')).on('select2:select select2:clear', function () { napCS(); });
            }
            var ch = pat.chain([x('lcc'), x('lcn'), x('cs')], { phatLai: false });

            function doDl(d) {
                d = d || {};
                ctId = e(d.ID);
                Q.datGiaTri(x('lcc'), d.LOAICC_BANGDIEM_ID);
                Q.datGiaTri(x('kq'), d.DIEM);
                Q.datGiaTri(x('nc'), d.NGAYCAP);
                Q.datGiaTri(x('nh'), d.NGAYHETHAN);
                Q.datGiaTri(x('gc'), d.GHICHU);
                Q.datGiaTri(x('he'), d.HEDAOTAO);
                Q.datGiaTri(x('stc'), d.SOTINCHI);
                Q.datGiaTri(x('thp'), d.THONGTINHOCPHAN_CHUNGCHI);
                return napLCN(d.LOAICONGNHAN_ID).then(function () { return napCS(d.DIEM_COSODAOTAOCONGNHANDIEM_ID); })
                    .then(function () { if (ch && ch.sync) ch.sync(); });
            }
            napLoaiCC().then(function (ds) {
                Q.chon(x('lcc'), ds, 'Chọn loại chứng chỉ');
                return ums.api.call({
                    action: CN + 'LayTTDiem_NguoiHoc_HocPhan_Cap', method: 'GET', type: 'GET',
                    strDiem_KeHoachCongNhan_Id: e(r.DIEM_KEHOACHCONGNHANDIEM_ID), strQLSV_NguoiHoc_Id: e(r.QLSV_NGUOIHOC_ID),
                    strDaoTao_HocPhan_Id: e(r.DAOTAO_HOCPHAN_ID), strNguoiThucHien_Id: ''
                });
            }).then(function (res) { return doDl(K.ds(res)[0]); })
              .catch(function (err) { ums.api.handle(err, 'thông tin công nhận điểm'); doDl(null); });

            function luuCT() {
                ums.api.call({
                    action: CN + 'Them_Diem_NguoiHoc_HocPhan_Cap', type: 'POST', method: 'POST',
                    strId: ctId,
                    strDiem_KeHoachCongNhan_Id: e(r.DIEM_KEHOACHCONGNHANDIEM_ID),
                    strLoaiCongNhan_Id: x('lcn').value,
                    strQLSV_NguoiHoc_Id: e(r.QLSV_NGUOIHOC_ID),
                    strDaoTao_HocPhan_Id: e(r.DAOTAO_HOCPHAN_ID),
                    strDiem_CoSoCongNhan_Id: x('cs').value,
                    strGhiChu: x('gc').value,
                    strNgayHetHan: x('nh').value,
                    strNgayCap: x('nc').value,
                    strNguoiThucHien_Id: '',
                    strDiem: x('kq').value,
                    strThongTinHocPhan_ChungChi: x('thp').value,
                    strHeDaoTao: x('he').value,
                    dSoTinChi: x('stc').value
                }).then(function () {
                    ui.toast(ctId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                    return tepCtl.save(khoaTep);
                }).then(function () { tai(); })
                  .catch(function (err) { ums.api.handle(err, 'lưu công nhận điểm'); });
            }
            function xoaCT() {
                if (!ctId) { ui.toast('Chưa có thông tin công nhận để xóa', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: 'D_CoSoCongNhanDiem/Xoa_Diem_NguoiHoc_HocPhan_Cap', type: 'POST', method: 'POST', strIds: ctId, strNguoiThucHien_Id: '' })
                        .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); dlg.close(); tai(); });
                }).catch(function (err) { ums.api.handle(err, 'xoá công nhận điểm'); tai(); });
            }
        }

        /* ---------- Hộp Xác nhận ---------------------------------------------- */
        function xacNhan() {
            var ids = K.daChon(z('t'), 'kqq');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            var chon = ids.map(function (id) { return K.tim(rows, id); }).filter(Boolean);
            var ds = [];
            var dlg = ui.dialog({
                title: 'Xác nhận', icon: 'fa-circle-check', size: 'lg',
                body: ui.field('Nội dung Xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                    ui.field('Hành động Xác nhận', '<select class="ums-select" data-x="loai" data-ph="Chọn loại công nhận"><option value=""></option></select>') +
                    '<div class="ums-legend ums-legend--cach">Chọn Xác nhận</div>' +
                    '<div class="ums-row tlkh-xn" data-x="nut"></div>'
            });
            var B = dlg.body;
            function x(k) { return B.querySelector('[data-x="' + k + '"]'); }
            ui.enhance(B);
            function napNut() {
                K.dang(x('nut'));
                ums.api.call({ action: 'SV_CND_ThongTin/LayDSHanhDongTheoXacNhan', method: 'GET', type: 'GET', strNguoiThucHien_Id: '', strLoaiXacNhan_Id: x('loai').value })
                    .then(function (res) {
                        ds = K.ds(res);
                        x('nut').innerHTML = ds.length ? ds.map(function (d, i) {
                            return ui.btn('confirm', { text: e(d.TEN), mod: 'out-primary', icon: ums.iconFA4(d.THONGTIN1 || 'fa fa-paper-plane'), attr: { 'data-xn': i } });
                        }).join('') : ui.empty('Chưa có hành động xác nhận');
                        ds.forEach(function (d, i) {
                            var ic = x('nut').querySelector('[data-xn="' + i + '"] i');
                            if (ic && d.THONGTIN2) ic.style.cssText = d.THONGTIN2;
                        });
                    }).catch(function (err) { K.loi(x('nut'), err, 'hành động xác nhận'); });
            }
            ums.api.call({ action: 'SV_CND_ThongTin/LayDSLoaiCongNhan', method: 'GET', type: 'GET', strNguoiThucHien_Id: '' }).then(function (res) {
                var d = K.ds(res);
                Q.chon(x('loai'), d, 'Chọn loại công nhận');
                if (d.length === 1) Q.datGiaTri(x('loai'), d[0].ID);      // selectOne của gốc
                napNut();
            }).catch(function (err) { ums.api.handle(err, 'loại công nhận'); });
            if (window.jQuery) jQuery(x('loai')).on('select2:select select2:clear', napNut);

            x('nut').addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-xn]');
                if (!b) return;
                var hd = ds[Number(b.getAttribute('data-xn'))];
                var loai = x('loai').value, nd = (x('nd').value || '').trim();
                dlg.close();
                ui.batch(chon.map(function (r) {
                    return { action: Q.CND + 'FSkkLB4FKCQsHgUKHgIuLyYPKSAvHhkgIg8pIC8P', func: 'pkg_congthongtin_cnd_thongtin.Them_Diem_DK_CongNhan_XacNhan',
                        strDuLieuXacNhan: e(r.DULIEUXACNHAN), strNguoiXacnhan_Id: ums.session.userId, strLoaiXacNhan_Id: loai,
                        strNoiDung: nd, strHanhDong_Id: hd.ID };
                }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true }).then(function () { tai(); });
            });
        }

        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            var r = b.getAttribute('data-id') ? K.tim(rows, b.getAttribute('data-id')) : null;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'import': ums.report.importChung('Import xác nhận', 'IMPORTWITHPROC_DCNXM', { onDone: function () { tai(); } }); break;
                case 'taifile': taiFile(); break;
                case 'xacnhan': xacNhan(); break;
                case 'sua': if (r) sua(r); break;
            }
        });

        return {
            mo: function (d) {
                kh = d; page = 1; rows = [];
                zone.querySelector('[data-f="q"]').value = '';
                tai(1);
            }
        };
    };
})();
