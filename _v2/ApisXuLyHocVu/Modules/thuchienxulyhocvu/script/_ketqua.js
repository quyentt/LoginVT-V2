/* =========================================================================
   Xử lý học vụ — phần dùng chung của "Thực hiện xử lý học vụ" và "Tra cứu kết quả"
   (thuchienxulyhocvu.js / tracuuketqua.js gốc chép nhau gần từng dòng: cùng thanh
   lọc, cùng XLHV_KetQuaXuLy/LayDanhSach, cùng cột "Thông số xử lý" điền từng ô).
   Nạp từ html của từng màn: ../../thuchienxulyhocvu/script/_ketqua.js
   (pheduyetketqua, raquyetdinh gốc cũng cùng khung này — xem báo cáo chuyển đổi.)

   ums.xlhvKQ.boLoc(host, o) = ums.pat.boLocNguoiHoc (tầng chung từ 2026-09-26 — mô tả ô lọc ở patterns.js)
       Thanh lọc — mỗi màn khai thứ tự ô theo html gốc của nó:
       o.hang = [['he','khoa','ct','lop'], ['nam','kql','hk','luong'], …]
         he · khoa · ct · lop   Hệ → Khoá → CT → Lớp, CHỌN NHIỀU như gốc; gốc gọi
                                edu.system.getList_* (KHÔNG lọc quyền) — giữ đúng các lời gọi đó
         nam                    Năm nhập học — KHCT_NamNhapHoc/LayDanhSach GET (chọn nhiều)
         kql                    Khoa quản lý — edu.system.getList_KhoaQuanLy (chọn nhiều)
         hk                     Học kỳ — edu.system.getList_ThoiGianDaoTao (chọn nhiều)
         luong                  "N luồng cùng chạy" (dropSearch_SoLuong — gốc đặt
                                edu.system.iGioiHanLuong: số lời gọi chạy song song)
         kh                     Kế hoạch xử lý — XLHV_KeHoachXuLy/LayDanhSach GET
         loai · muc             Loại / Mức xử lý — danh mục XLHV.LOAIXULY / XLHV.MUCXULY
         q                      từ khoá · nut = Tìm kiếm + vùng Xuất báo cáo / Import
       o.them = HTML thêm vào cuối khung lọc (khối "Thực hiện xử lý" của màn thực hiện)
       "Chọn trạng thái sinh viên" — QLSV.TRANGTHAI, đánh dấu sẵn hết như gốc.
       thamSo() = tham số lọc của XLHV_KetQuaXuLy/LayDanhSach (tên chép nguyên gốc).
       baoCao() = các cặp chung của khối addKeyValue báo cáo (xem từng màn).

   ums.xlhvKQ.ketQua(host, o) → { tim(), dong() }
       Khung "Danh sách" (zone_quanso gốc): ẩn tới khi Tìm kiếm, nút Đóng ẩn lại.
       XLHV_KetQuaXuLy/LayDanhSach GET, phân trang máy chủ → Data {
         rsThongTinNguoiHoc: dòng, rsCotThongSoXuLy: [{ TUKHOA, TENTUKHOA }] }.
       o.cot(r) = các cột của màn (sau Stt); cột "Thông số xử lý" (mỗi TUKHOA một cột)
       do hàm này thêm, rồi điền MỖI Ô bằng một lời gọi
       XLHV_KetQuaXuLy/LayDuLieuTuKhoaKetQuaXuLy GET (→ KETQUA) — giữ N × M lời gọi như
       gốc, chạy hàng đợi o.luong() luồng; tìm lại / đổi trang giữa chừng thì bỏ lượt cũ.

   ums.xlhvKQ.mucDieuChinh(dong)   chữ ở cột "Kết quả điều chỉnh" = MUCXULY_THAYDOI_TEN, chưa điều chỉnh thì MUCXULY_TEN
   ums.xlhvKQ.hopDoiMuc(dong, { host, onSaved })   biểu mẫu "Thay đổi mức cảnh cáo" NGAY TRONG TRANG (host = gốc màn,
                                             vùng bị thay chỗ; không truyền host thì bật hộp thoại như cũ) → XLHV_KetQuaXuLy/CapNhat

   Khác bản gốc (chung hai màn):
     · Hệ → Khoá → CT → Lớp: chưa chọn tầng trên thì KHOÁ tầng dưới, đổi / xoá tầng trên
       thì xoá trắng tầng dưới (luật cha → con, ums.pat.chain). Gốc nạp sẵn mọi tầng lúc mở.
     · Cột ô đánh dấu + "chọn tất cả" cuối bảng: gốc có nhưng KHÔNG nút nào đọc ô đã
       chọn (hai màn này không có thao tác hàng loạt) → bỏ.
     · Ô "Thông số xử lý" lỗi thì báo MỘT lần mỗi lượt (gốc alert từng ô).
     · Bấm Tìm kiếm về trang 1 (gốc giữ pageIndex_default của lần trước).
   Cố ý bỏ (mã chết, không có lối vào ở giao diện gốc):
     · CM_Import_PhanQuyen/LayDanhSach (getList_MauImport riêng, đổ vào #zonebtnBaoCao_LHD
       không tồn tại), report() (SYS_Report/ThemMoi — không ai gọi, đọc me.arrTrangThai_Ten
       chưa từng gán), .btnDetail / #myModal / getList_QuanSoTheoLop (hàm không tồn tại),
       #zonetabkhoanthu / activeTabFun, #btnPrintQuanSo, dropSearch_NguoiThu_IHD.
     · resetCombobox (chỉ có tác dụng với mục "" của ô chọn nhiều kiểu cũ — ô mới không có).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var K = ums.xlhvKQ = ums.xlhvKQ || {};

    K.uid = function () { return (ums.session && ums.session.userId) || ''; };
    K.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    K.e = function (v) { return v === null || v === undefined ? '' : v; };
    K.arr = function (d) { return Array.isArray(d) ? d : []; };
    K.hoTen = function (r) { return K.e(r.QLSV_NGUOIHOC_HODEM) + ' ' + K.e(r.QLSV_NGUOIHOC_TEN); };
    /* Mức ở cột "Kết quả điều chỉnh": máy chủ trả mức đã điều chỉnh ở MUCXULY_THAYDOI_TEN, còn MUCXULY_TEN giữ nguyên mức tự động */
    K.mucDieuChinh = function (r) { return K.e(r.MUCXULY_THAYDOI_TEN) || K.e(r.MUCXULY_TEN); };

    /* Thanh lọc người học: đã đưa lên tầng chung 2026-09-26 (Sinh viên, Hồ sơ… cùng dùng) —
       ums.pat.boLocNguoiHoc (assets/js/patterns.js). Giữ tên cũ để các màn XLHV không phải sửa. */
    K.boLoc = function (host, o) { return ums.pat.boLocNguoiHoc(host, o); };

    /* ------------------------------------------------------------------------
       Khung "Danh sách" + bảng kết quả
       ------------------------------------------------------------------------ */
    K.khungDS = function () {
        return '<div data-z="kq" hidden>' +
            pat.panel({ title: 'Danh sách', icon: 'fa-rectangle-list', count: 'n', flush: true, zone: 'bang',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) +
            '</div>';
    };

    K.ketQua = function (root, o) {
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        var trang = { index: 1, size: 10 };       // edu.system.pageSize_default = 10
        var luot = 0, data = { rsThongTinNguoiHoc: [], rsCotThongSoXuLy: [] };

        function tai(p) {
            if (p) trang.index = p;
            var sh = ++luot;
            z('kq').hidden = false;
            z('n').textContent = '';
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var q = o.thamSo();
            q.action = 'XLHV_KetQuaXuLy/LayDanhSach';
            q.method = 'GET';
            q.pageIndex = trang.index;
            q.pageSize = trang.size;
            ums.api.call(q).then(function (r) {
                if (sh !== luot) return;
                data = r.data || {};
                ve(sh, K.arr(data.rsThongTinNguoiHoc), K.arr(data.rsCotThongSoXuLy), Number(r.pager) || 0);
            }).catch(function (err) {
                if (sh !== luot) return;
                z('bang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'XLHV_KetQuaXuLy/LayDanhSach');
            });
        }

        function ve(sh, rs, cotTS, tong) {
            var cot = o.cot();
            cotTS.forEach(function (c, j) {
                cot.push({ title: K.e(c.TENTUKHOA), group: ['Thông số xử lý'], cls: 'is-center',
                    render: function (r, i) { return '<span data-ts="' + i + '|' + j + '"></span>'; } });
            });
            ui.table({ el: z('bang'), rows: rs, columns: cot, empty: 'Không có dữ liệu',
                page: { index: trang.index, size: trang.size, total: tong || rs.length,
                    onChange: function (p) { tai(p); },
                    onSize: function (s) { trang.size = s; tai(1); } } });
            z('n').textContent = '(' + (tong || rs.length) + ')';
            if (o.sauVe) o.sauVe(z('bang'), rs);

            /* getData_XuLyHocVu gốc: một lời gọi cho mỗi ô (người học × từ khoá) */
            var bang = z('bang'), viec = [], baoLoi = false;
            rs.forEach(function (sv, i) {
                cotTS.forEach(function (c, j) {
                    viec.push(function () {
                        return ums.api.call({ action: 'XLHV_KetQuaXuLy/LayDuLieuTuKhoaKetQuaXuLy', method: 'GET', silent: true,
                            strTuKhoa: c.TUKHOA, strChucNang_Id: K.cn(),
                            strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: sv.DAOTAO_LOPQUANLY_ID,
                            strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID,
                            strDaoTao_ThoiGianDaoTao_Id: sv.DAOTAO_THOIGIANDAOTAO_ID,
                            strXLHV_KeHoachXuLy_Id: sv.XLHV_KEHOACHXULY_ID, strLoaiXuLy_Id: sv.LOAIXULY_ID,
                            strMucXuLy_Id: sv.MUCXULY_ID, strNguoiThucHien_Id: K.uid() })
                            .then(function (r) {
                                if (sh !== luot) return;
                                var o_ = bang.querySelector('[data-ts="' + i + '|' + j + '"]');
                                // gốc: .html(KETQUA) cho từng dòng trả về → dòng cuối thắng
                                K.arr(r.data).forEach(function (x) { if (o_) o_.innerHTML = ui.escBr(x.KETQUA); });
                            })
                            .catch(function (err) {
                                if (sh !== luot || baoLoi) return;
                                baoLoi = true;
                                ums.api.handle(err, 'thông số xử lý');
                            });
                    });
                });
            });
            var k = 0;
            function chay() {
                if (sh !== luot || k >= viec.length) return Promise.resolve();
                return viec[k++]().then(chay);
            }
            for (var n = 0, m = Math.min(o.luong ? o.luong() : 10, viec.length); n < m; n++) chay();
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a="dong"]');
            if (b && root.contains(b)) { luot++; z('kq').hidden = true; }
        });

        return {
            tim: function () { tai(1); },
            tai: function () { tai(); },
            dong: function () { luot++; z('kq').hidden = true; },
            data: function () { return data; }
        };
    };

    /* ------------------------------------------------------------------------
       "Thay đổi mức cảnh cáo" (#myModal gốc) — save_MucCanhCao
       BO-CUC luật 1: sửa một bản ghi = biểu mẫu NGAY TRONG TRANG → nơi gọi truyền o.host (gốc màn, vùng bị thay chỗ).
       Không truyền o.host thì vẫn bật hộp thoại như trước (giữ tương thích cho nơi gọi cũ — hiện không còn nơi nào).
       ------------------------------------------------------------------------ */
    K.hopDoiMuc = function (dong, o) {
        o = o || {};
        var body = document.createElement('div');
        body.className = 'ums-stack';
        body.innerHTML =
            '<p class="ums-u-center ums-u-semi ums-u-mb-0">' +
                esc(K.hoTen(dong) + ' - ' + K.e(dong.QLSV_NGUOIHOC_MASO)) + '</p>' +
            ui.field('Mức xử lý mới', '<select class="ums-select" data-f="muc" data-ph="Chọn mức xử lý"><option value=""></option></select>',
                { required: true }) +
            ui.field('Lý do', '<input class="ums-input" data-f="lydo" autocomplete="off">');
        var muc = body.querySelector('[data-f="muc"]');
        (o.mucXuLy || ums.api.dm('XLHV.MUCXULY')).then(function (d) {
            pat.fill(muc, d, { head: pat.dmTitle(d) || 'Chọn mức xử lý' });
        }).catch(function (err) { ums.api.handle(err, 'mức xử lý'); });

        (o.host ? pat.formTrang : ui.dialog)({
            host: o.host, title: 'Thay đổi mức cảnh cáo', icon: 'fa-sensor-triangle-exclamation', size: 'md', body: body,
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (dlg) {
                if (!muc.value) { ui.toast('Vui lòng chọn mức xử lý mới', 'warn'); return false; }
                ums.api.call({
                    action: 'XLHV_KetQuaXuLy/CapNhat',
                    strId: dong.ID,
                    strChucNang_Id: K.cn(),
                    strMucXuLy_Moi_Id: muc.value,
                    strMucXuLy_LyDo: (body.querySelector('[data-f="lydo"]').value || '').trim(),
                    strMucXuLy_CanBo_Id: K.uid(),
                    strNguoiThucHien_Id: K.uid()
                }).then(function () {
                    ui.toast('Cập nhật thành công!', 'ok');
                    dlg.close();
                    if (o.onSaved) o.onSaved();
                }).catch(function (err) { ums.api.handle(err, 'XLHV_KetQuaXuLy/CapNhat'); });
                return false;
            } }]
        });
        ui.enhance(body);
    };
})();
