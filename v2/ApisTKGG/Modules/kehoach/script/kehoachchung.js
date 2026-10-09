/* =========================================================================
   Lập kế hoạch (Thống kê giờ giảng → Tổng hợp giờ)
   Bản gốc: ApisTKGG/Modules/kehoach/html/kehoachchung.html + script/kehoachchung.js (2.093 dòng, lớp KeHoachChung)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột: thanh lọc (Thời gian · từ khoá) + "Danh sách kế hoạch" (phân trang máy chủ) → biểu mẫu thêm / sửa
   kế hoạch THAY CHỖ danh sách (ums.crud) kèm bảng "Kế hoạch chi tiết" khi sửa; hai khung thay chỗ của gốc (zonePhanLoaiTinh,
   zoneCongThucTinh) và hộp Đợt tách (gốc modal có thêm / sửa / xoá → nay khung thay chỗ) dựng bằng pat.formTrang; biểu mẫu con
   của ba khung đó là pat.formTrang LỒNG. Hộp thoại chỉ còn cho việc xem danh sách (cán bộ, nhân sự, kết quả) và kế thừa.

   Lời gọi (chép nguyên — kiểu cũ GET/POST không mã hoá; có func thì api.js tự mã hoá):
     Danh sách    TKGG_KeHoach/LayDSKLGD_TongHopKhoiLuong GET  strTuKhoa · strDaoTao_ThoiGianDaoTao_Id (ô Thời gian) · dHieuLuc -1 · pageIndex · pageSize
     Ô Thời gian  TKGG_KeHoach/LayDSThoiGianTongHopKL GET (ums.tkgg.thoiGian 'plain') → ID / THOIGIAN
     Lưu          TKGG_KeHoach/Them_KLGD_TongHopKhoiLuong | Sua_… (khi có strId) POST  strId · strTen · strMoTa · strDaoTao_ThoiGianDaoTao_Id · dHieuLuc
     Xoá          TKGG_KeHoach/Xoa_KLGD_TongHopKhoiLuong POST  strIds
     Ô Thời gian của biểu mẫu  KHCT_ThoiGianDaoTao/LayDanhSach GET  strDAOTAO_Nam_Id '' · strTuKhoa '' · pageIndex 1 · pageSize 1000000 → ID / DAOTAO_THOIGIANDAOTAO
     Bảng KH chi tiết (trong biểu mẫu sửa)  ums.tkggKH.goiKHCT { strKLGD_TongHopKhoiLuong_Id, pageSize 1000000 }
     Hộp Cán bộ giảng viên  TKGG_KeHoach/LayDSGiangVienTongHopKL GET strKLGD_TongHopKhoiLuong_Id · Nhân sự tham gia  …/LayDSNhanSuTongHopKL GET
     Hộp Nhân sự của KH chi tiết  ums.tkggKH.goiNhanSuKHCT
     Hộp Kết quả chi tiết  NS_KLGD_BaoCao_MH/DSA4BRIKJDUQNCACKSgVKCQ1FSkkLgoJ  pkg_klgv_v2_baocao.LayDSKetQuaChiTietTheoKH   strTuKhoa · strKLGD_TongHopKhoiLuong_Id
     Hộp TH theo giảng viên  NS_KLGD_BaoCao_MH/DSA4BRIVCRUpJC4GKCAvJhcoJC8VKSQuCgkP  …LayDSTHTheoGiangVienTheoKH  (cùng tham số)
     Hộp TH theo lớp HP      NS_KLGD_BaoCao_MH/DSA4BRIVCRUpJC4NLjEXIAYXFSkkLgoJ  …LayDSTHTheoLopVaGVTheoKH   (cùng tham số)
     Khung Hình thức học - phân loại tính (strPhamViApDung_Id = ID kế hoạch):
        NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgkoLykVKTQiHhEpIC8NLiAo  PKG_KLGV_V2_THONGTIN.LayDSKLGD_HinhThuc_PhanLoai  strPhamViApDung_Id
        NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgkoLykVKTQiHhEpIC8NLiAo  …Them_KLGD_HinhThuc_PhanLoai  strTKB_HinhThucHoc_Id · strLoaiXacNhan_Id · strHanhDong_Id · strPhamViApDung_Id · strGhiChu '' (gốc txtAAAA)
        NS_KLGD_ThongTin_MH/GS4gHgoNBgUeCSgvKRUpNCIeESkgLw0uICgP  …Xoa_KLGD_HinhThuc_PhanLoai   strId (mỗi dòng đánh dấu một lời gọi)
        NS_KLGD_ThongTin_MH/CiQVKTQgHgoNBgUeCSgvKRUpNCIeESkgLw0uICgP  …KeThua_KLGD_HinhThuc_PhanLoai  strPhamViApDung_Nguon_Id (kế hoạch gốc) · strPhamViApDung_Dich_Id (kế hoạch đang mở)
        Ô Hình thức học  NS_KLGD_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP  PKG_KLGV_V2_CHUNG.LayDSHinhThucHoc → ID / TENHINHTHUCHOC - MAHINHTHUCHOC
        Ô Nhóm loại tính  danh mục KLGD.PHANLOAIXACNHAN · Ô Phân loại  NS_KLGD_XacNhan_MH/DSA4CSAvKQUuLyYZICIPKSAvDyY0LigFNC8m  PKG_KLGV_V2_XACNHAN.LayHanhDongXacNhanNguoiDung  strLoaiXacNhan_Id
     Khung Công thức áp dụng cho riêng kế hoạch:
        NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgIuLyYVKTQiHgAxBTQvJgPP  PKG_KLGV_V2_THONGTIN.LayDSKLGD_CongThuc_ApDung  strTuKhoa '' · strKLGD_TongHopKhoiLuong_Id · strDaoTao_ThoiGianDaoTao_Id '' (gốc txtAAAA / dropAAAA)
        NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP  …Them_KLGD_CongThuc_ApDung | EjQgHgoNBgUeAi4vJhUpNCIeADEFNC8m …Sua_… (khi có strId)
            strId · strKLGD_TongHopKhoiLuong_Id · strDaoTao_ThoiGianDaoTao_Id · strXauCongThuc · strPhamViDung_Id (ô "Loại")
        NS_KLGD_ThongTin_MH/GS4gHgoNBgUeAi4vJhUpNCIeADEFNC8m  …Xoa_KLGD_CongThuc_ApDung  strId
        Ô Phạm vi áp dụng  danh mục KLGD.PHANLOAIXACNHAN · Ô Loại  ums.tkgg.loaiApDung · Ô Thời gian  ums.tkgg.thoiGianDaoTao (edu.system.getList_ThoiGianDaoTao)
     Khung Đợt tách dữ liệu theo ngày:
        NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHhUuLyYJLjEKDR4FLjUP  PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKL_Dot  strTuKhoa '' · strKLGD_TongHopKhoiLuong_Id · pageIndex · pageSize (phân trang máy chủ)
        NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHhUuLyYJLjEKKS4oDTQuLyYeBS41  …Them_KLGD_TongHopKhoiLuong_Dot | EjQgHgoNBgUeFS4vJgkuMQopLigNNC4vJh4FLjUP …Sua_… (khi có strId)
            strId · strKLGD_TongHopKhoiLuong_Id · strTuNgay · strDenNgay · strTen · strMoTa · dHieuLuc
        NS_KLGD_KeHoach_MH/GS4gHgoNBgUeFS4vJgkuMQopLigNNC4vJh4FLjUP  …Xoa_KLGD_TongHopKhoiLuong_Dot  strId
        NS_KLGD_KeHoach_MH/FSAuBTQNKCQ0HgoNBgUeFS4vJgkuMQoNHgUuNQPP  …TaoDuLieu_KLGD_TongHopKL_Dot  strId (đợt đang sửa)
        Hộp Kết quả  NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNB4NBh4VBgPP  …LayDSKLGD_DuLieu_LG_TG  strTuKhoa '' · strKLGD_TongHoKL_Dot_Id · pageIndex · pageSize

   Giữ như gốc:
     · Cột "Các kế hoạch chi tiết" mở biểu mẫu sửa (gốc cũng gắn .btnEdit) — bảng KH chi tiết nằm trong biểu mẫu, chỉ xem.
     · Ô "Thời gian" của biểu mẫu lấy KHCT_ThoiGianDaoTao/LayDanhSach (khác ô Thời gian của thanh lọc — gốc vậy).
     · strGhiChu, strTuKhoa, strDaoTao_ThoiGianDaoTao_Id của các khung con gửi rỗng (gốc đọc ô txtAAAA / dropAAAA không có).
     · "Tạo dữ liệu" của đợt tách gửi strId = đợt đang sửa; không hỏi lại (gốc không hỏi).
   Khác gốc (lỗi rõ ràng / luật bố cục):
     · Ô từ khoá: gốc đọc txtAAAA nên không bao giờ gửi → gửi ô "Nhập từ khóa tìm kiếm" (strTuKhoa).
     · Ô Thời gian thanh lọc gốc bị đổ HAI lần (LayDSThoiGianTongHopKL rồi getList_ThoiGianDaoTao, cái nào về sau thắng) → chỉ LayDSThoiGianTongHopKL.
     · Cột Tên bảng KH chi tiết gốc đọc "Ten" (sai hoa thường → luôn trống) → TEN. Cột Hiệu lực: gốc `HIEULUC ? '' : 'Hết hiệu lực'`
       (chuỗi "0" vẫn là true) → so số.
     · Nút Xoá kế hoạch gốc nằm trong chân biểu mẫu bị display:none → hiện nút Xoá trong biểu mẫu sửa (ý định).
     · Tên kế hoạch bắt buộc (gốc không kiểm).
     · Sửa công thức: gốc đổ THOIGIAN_ID vào ô dropThoiGian của biểu mẫu kế hoạch (nhầm ô) → đổ vào ô Thời gian của công thức;
       gốc đổ PHAMVIAPDUNG_ID vào ô Nhóm (ô Loại để trống) → tìm nhóm chứa loại đó rồi chọn sẵn cả hai.
     · Kế thừa: ô kế hoạch gốc lấy TOÀN BỘ kế hoạch (gốc chỉ trang đang hiện của bảng).
     · Hộp Kết quả chi tiết / TH giảng viên / TH học phần: gốc mở hộp trống, bấm Tìm kiếm mới nạp → nạp ngay khi mở, gõ tự tìm.
     · "Tạo dữ liệu" chỉ hiện khi sửa đợt (gốc thêm mới cũng hiện, gửi strId undefined); xoá nhiều / hỏi lại một lần (gốc gắn chồng #btnYes).
   Cố ý bỏ (mã chết): chkSelectAll_KeHoachChung (bảng tblThongTin không có); btnDelete_CongThucApDung (không xử lý); btnKeThua_CongThucTinh (đã chú thích);
     ô đánh dấu không dùng ở các hộp chỉ xem; ảnh minh hoạ img-plan.svg cạnh biểu mẫu; nhãn lblPhamViAP / lblLoaiApDung / lblThoiGianApDung (vùng btnOpenDelete ẩn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg, H = ums.tkggKH;
    var root = document.getElementById('tkgg-kehoachchung');
    if (!root) return;
    var e = H.e, esc = H.esc, arr = H.arr;
    var TT = 'NS_KLGD_ThongTin_MH/', BC = 'NS_KLGD_BaoCao_MH/', P = H.P, KH = H.KH;
    var DM_PLXN = 'KLGD.PHANLOAIXACNHAN';

    function nut(a, r, text, kind) {
        return ui.btn(kind || 'view', { text: text || 'Chi tiết', icon: kind ? undefined : 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': e(r.ID) } });
    }
    function tim(id) { return crud.rows.filter(function (r) { return e(r.ID) === id; })[0]; }

    var crud = ums.crud({
        root: root,
        title: 'Lập kế hoạch', listTitle: 'Danh sách kế hoạch', formTitle: 'kế hoạch', icon: 'fa-books',
        rowDelete: false, multi: false,
        filters: [
            { key: 'tg', type: 'select', label: 'Chọn thời gian', source: T.thoiGian('plain') },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: { paged: true, call: function (f) {
            return { action: P + 'LayDSKLGD_TongHopKhoiLuong', method: 'GET', strTuKhoa: f.q || '', strDaoTao_ThoiGianDaoTao_Id: f.tg || '', dHieuLuc: -1 };
        } },
        columns: [
            { title: 'Tên', prop: 'TEN' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
            { title: 'Đợt tách dữ liệu theo ngày', cls: 'is-center is-nowrap', render: function (r) { return nut('dottach', r); } },
            { title: 'Cán bộ giảng viên', cls: 'is-center is-nowrap', render: function (r) { return nut('canbo', r); } },
            { title: 'Nhân sự tham gia', cls: 'is-center is-nowrap', render: function (r) { return nut('nhansu', r); } },
            { title: 'Các kế hoạch chi tiết', cls: 'is-center is-nowrap', render: function (r) { return nut('khct', r); } },
            { title: 'Kết quả chi tiết', cls: 'is-center is-nowrap', render: function (r) { return nut('ketqua', r); } },
            { title: 'Kết quả tổng hợp theo giảng viên', cls: 'is-center is-nowrap', render: function (r) { return nut('thgv', r); } },
            { title: 'Kế hoạch tổng hợp theo lớp học phần', cls: 'is-center is-nowrap', render: function (r) { return nut('thhp', r); } },
            { title: 'Hình thức học - phân loại tính', cls: 'is-center is-nowrap', render: function (r) { return nut('plt', r); } },
            { title: 'Công thức áp dụng cho riêng kế hoạch', cls: 'is-center is-nowrap', render: function (r) { return nut('ctt', r); } },
            { title: 'Hiệu lực', cls: 'is-center is-nowrap', render: function (r) { return Number(r.HIEULUC) ? '' : ui.badge('Hết hiệu lực', 'mute'); } }
        ],
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên kế hoạch', required: true },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select', placeholder: 'Chọn thời gian',
              source: { call: { action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', strDAOTAO_Nam_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }, name: 'DAOTAO_THOIGIANDAOTAO' } },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', placeholder: 'Có hiệu lực', source: { items: H.HIEULUC } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        save: function (v, row) {
            return { action: P + (row ? 'Sua_' : 'Them_') + 'KLGD_TongHopKhoiLuong', method: 'POST', strId: row ? e(row.ID) : '',
                strTen: v.strTen, strMoTa: v.strMoTa, strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id, dHieuLuc: v.dHieuLuc === '' ? 1 : v.dHieuLuc };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa_KLGD_TongHopKhoiLuong', method: 'POST', strIds: id }; }); },
        onForm: function (row, c, extra) { if (row) veKHCT(extra, row); }
    });

    /* ---------- Bảng "Kế hoạch chi tiết" trong biểu mẫu sửa (gốc zoneKeHoachChiTiet) ---------- */
    function veKHCT(extra, row) {
        extra.innerHTML = '<div class="ums-u-mt-4">' + pat.panel({ title: 'Kế hoạch chi tiết', icon: 'fa-clipboard-list-check', flush: true, zone: 'khct', count: 'khct-n' }) + '</div>';
        var host = extra.querySelector('[data-z="khct"]');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ums.api.call(H.goiKHCT({ strKLGD_TongHopKhoiLuong_Id: row.ID, pageSize: 1000000 })).then(function (r) {
            var rows = arr(r.data);
            extra.querySelector('[data-z="khct-n"]').textContent = '(' + rows.length + ')';
            ui.table({ el: host, rows: rows, stt: true, empty: 'Kế hoạch chưa có kế hoạch chi tiết nào', columns: [
                { title: 'Tên', prop: 'TEN' }, { title: 'Mô tả', prop: 'MOTA' }, { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
                { title: 'Chế độ áp dụng riêng', prop: 'CHEDOAPDUNG_TEN' }, { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' },
                { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' }, { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
                { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-nowrap' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                { title: 'Nhân sự tham gia', cls: 'is-center is-nowrap', render: function (x) { return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': 'ns-khct', 'data-id': e(x.ID), 'data-ten': e(x.TEN) } }); } }
            ] });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kế hoạch chi tiết'); });
    }

    /* ---------- Hộp xem (cán bộ, nhân sự, kết quả, tổng hợp) ---------- */
    function hoTenGach(r) { return esc(e(r.HODEM) + ' - ' + e(r.TEN)); }
    var COT_TH = [{ title: 'Đơn vị', prop: 'DONVI' }, { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Họ tên', render: hoTenGach }, { title: 'Số giờ chuẩn', prop: 'TONGGIOCHUAN', cls: 'is-center' }];
    function hopBaoCao(r, ma, func, title, cot) {
        H.hopDanhSach({ title: title + ': ' + e(r.TEN), icon: 'fa-table-list', size: 'xl', columns: cot, empty: 'Không có dữ liệu',
            call: function (q) { return { action: BC + ma, func: 'pkg_klgv_v2_baocao.' + func, strTuKhoa: q, strKLGD_TongHopKhoiLuong_Id: e(r.ID) }; } });
    }

    /* ---------- Khung Hình thức học - phân loại tính (gốc zonePhanLoaiTinh) ---------- */
    function moPhanLoaiTinh(r) {
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-tablewrap" data-k="t"></div>';
        var ft = pat.formTrang({
            host: root, title: 'Hình thức học - phân loại tính: ' + e(r.TEN), icon: 'fa-list-check', flush: true, cols: 1, body: body,
            buttons: [
                { text: 'Kế thừa', kind: 'confirm', icon: 'fa-clone', mod: 'out-primary', keepOpen: true, onClick: function () { keThua(r, tai); return false; } },
                { text: 'Thêm mới', kind: 'add', keepOpen: true, onClick: function (api) { themPLT(api.body, r, tai); return false; } }
            ],
            xoa: { chon: 'input[data-chon="plt"]', text: 'Xóa', onClick: function () {
                var ids = H.daChon(body, 'plt');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                    if (!yes) return;
                    T.xoaNhieu(ids, function (id) { return { action: TT + 'GS4gHgoNBgUeCSgvKRUpNCIeESkgLw0uICgP', func: 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_HinhThuc_PhanLoai', strId: id }; }).then(tai);
                });
            } }
        });
        H.ganChon(body);
        var host = body.querySelector('[data-k="t"]');
        function tai() {
            host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            return ums.api.call({ action: TT + 'DSA4BRIKDQYFHgkoLykVKTQiHhEpIC8NLiAo', func: 'PKG_KLGV_V2_THONGTIN.LayDSKLGD_HinhThuc_PhanLoai', strPhamViApDung_Id: e(r.ID) })
                .then(function (x) {
                    ui.table({ el: host, rows: arr(x.data), stt: true, empty: 'Chưa khai hình thức học - phân loại tính nào', columns: [
                        { title: 'Hình thức học từ TKB', prop: 'TKB_HINHTHUCHOC_MA' }, { title: 'Phân loại tính KLGD', prop: 'HANHDONG_MA' },
                        { title: 'Thuộc nhóm loại', prop: 'LOAIXACNHAN_TEN' }, { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' }, H.cotChon('plt')] });
                }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phân loại tính'); });
        }
        tai();
        return ft;
    }
    function themPLT(host, r, xong) {
        var ft = pat.formTrang({
            host: host, title: 'Thêm hình thức học - phân loại tính', icon: 'fa-plus',
            body: H.o('Hình thức học', H.sel('ht', 'Chọn hình thức học'), { required: true }) +
                H.o('Nhóm loại tính KLGD', H.sel('nhom', '-- Chọn --'), { required: true }) +
                H.o('Phân loại', H.sel('pl', 'Chọn phân loại'), { required: true }),
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function (api) {
                if (!v('ht') || !v('nhom') || !v('pl')) { ui.toast('Chọn đủ Hình thức học, Nhóm loại tính và Phân loại', 'warn'); return false; }
                ums.api.call({ action: TT + 'FSkkLB4KDQYFHgkoLykVKTQiHhEpIC8NLiAo', func: 'PKG_KLGV_V2_THONGTIN.Them_KLGD_HinhThuc_PhanLoai',
                    strTKB_HinhThucHoc_Id: v('ht'), strLoaiXacNhan_Id: v('nhom'), strHanhDong_Id: v('pl'), strPhamViApDung_Id: e(r.ID), strGhiChu: '' })
                    .then(function () { ui.toast('Thêm mới thành công!', 'ok'); api.close(); xong(); })
                    .catch(function (err) { ums.api.handle(err, 'lưu phân loại tính'); });
                return false;
            } }]
        });
        var q = function (k) { return ft.body.querySelector('[data-k="' + k + '"]'); }, v = function (k) { return e(q(k).value); };
        ums.api.call({ action: 'NS_KLGD_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP', func: 'PKG_KLGV_V2_CHUNG.LayDSHinhThucHoc' }).then(function (x) {
            pat.fill(q('ht'), arr(x.data), { name: function (d) { return e(d.TENHINHTHUCHOC) + ' - ' + e(d.MAHINHTHUCHOC); } });
        }).catch(function (err) { ums.api.handle(err, 'hình thức học'); });
        ums.api.dm(DM_PLXN).then(function (rows) { pat.fill(q('nhom'), rows); });
        q('nhom').addEventListener('change', function () {
            pat.fill(q('pl'), []);
            if (!v('nhom')) return;
            ums.api.call({ action: 'NS_KLGD_XacNhan_MH/DSA4CSAvKQUuLyYZICIPKSAvDyY0LigFNC8m', func: 'PKG_KLGV_V2_XACNHAN.LayHanhDongXacNhanNguoiDung', strLoaiXacNhan_Id: v('nhom') })
                .then(function (x) { pat.fill(q('pl'), arr(x.data)); }).catch(function (err) { ums.api.handle(err, 'phân loại'); });
        });
        pat.chain([q('nhom'), q('pl')]);
    }
    function keThua(r, xong) {
        var dlg = ui.dialog({
            title: 'Kế thừa tham số', icon: 'fa-clone', size: 'md',
            body: '<div class="ums-grid ums-grid--2"><div style="grid-column:1 / -1">' + ui.field('Chọn kế hoạch gốc dùng kế thừa', H.sel('kh', 'Chọn kế hoạch'), { required: true }) + '</div></div>',
            buttons: [{ text: 'Lưu Kế thừa', kind: 'save', onClick: function (api) {
                var kh = api.body.querySelector('[data-k="kh"]').value;
                if (!kh) { ui.toast('Chọn kế hoạch gốc dùng kế thừa', 'warn'); return false; }
                ums.api.call({ action: TT + 'CiQVKTQgHgoNBgUeCSgvKRUpNCIeESkgLw0uICgP', func: 'PKG_KLGV_V2_THONGTIN.KeThua_KLGD_HinhThuc_PhanLoai',
                    strPhamViApDung_Nguon_Id: kh, strPhamViApDung_Dich_Id: e(r.ID) })
                    .then(function () { ui.toast('Kế thừa thành công!', 'ok'); api.close(); xong(); })
                    .catch(function (err) { ums.api.handle(err, 'kế thừa'); });
                return false;
            } }]
        });
        var kh = dlg.body.querySelector('[data-k="kh"]');
        ums.api.call(T.keHoachTongHop('plain', '')).then(function (x) {
            pat.fill(kh, arr(x.data).filter(function (d) { return e(d.ID) !== e(r.ID); }));
            ui.select2(kh, { placeholder: 'Chọn kế hoạch', allowClear: true });
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    }

    /* ---------- Khung Công thức áp dụng cho riêng kế hoạch (gốc zoneCongThucTinh) ---------- */
    function moCongThuc(r) {
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-tablewrap" data-k="t"></div>';
        var ds = [];
        var ft = pat.formTrang({
            host: root, title: 'Công thức áp dụng cho riêng kế hoạch: ' + e(r.TEN), icon: 'fa-function', flush: true, cols: 1, body: body,
            buttons: [{ text: 'Thêm mới', kind: 'add', keepOpen: true, onClick: function (api) { formCT(api.body, r, null, tai); return false; } }],
            xoa: { chon: 'input[data-chon="ctt"]', text: 'Xóa', onClick: function () {
                var ids = H.daChon(body, 'ctt');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                    if (!yes) return;
                    T.xoaNhieu(ids, function (id) { return { action: TT + 'GS4gHgoNBgUeAi4vJhUpNCIeADEFNC8m', func: 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_CongThuc_ApDung', strId: id }; }).then(tai);
                });
            } }
        });
        H.ganChon(body);
        var host = body.querySelector('[data-k="t"]');
        function tai() {
            host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            return ums.api.call({ action: TT + 'DSA4BRIKDQYFHgIuLyYVKTQiHgAxBTQvJgPP', func: 'PKG_KLGV_V2_THONGTIN.LayDSKLGD_CongThuc_ApDung',
                strTuKhoa: '', strKLGD_TongHopKhoiLuong_Id: e(r.ID), strDaoTao_ThoiGianDaoTao_Id: '' })
                .then(function (x) {
                    ds = arr(x.data);
                    ui.table({ el: host, rows: ds, stt: true, empty: 'Chưa có công thức riêng nào', columns: [
                        { title: 'Công thức tính', render: function (d) { return '<code class="ums-u-fz13">' + esc(d.XAUCONGTHUC) + '</code>'; } },
                        { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' }, { title: 'Thời gian áp dụng', prop: 'THOIGIAN', cls: 'is-nowrap' },
                        { title: 'Sửa', cls: 'is-center is-actions', render: function (d) {
                            return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="ct-sua" data-id="' + esc(d.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                        } },
                        H.cotChon('ctt')] });
                }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'công thức tính'); });
        }
        body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a="ct-sua"]'); if (!b) return;
            var d = ds.filter(function (x) { return e(x.ID) === b.getAttribute('data-id'); })[0];
            if (d) formCT(ft.body, r, d, tai);
        });
        tai();
        return ft;
    }
    function formCT(host, r, d, xong) {
        var ft = pat.formTrang({
            host: host, title: (d ? 'Sửa' : 'Thêm') + ' công thức tính', icon: d ? 'fa-pen-to-square' : 'fa-plus',
            body: H.o('Phạm vi áp dụng', H.sel('pv', '-- Chọn --'), { required: true }) +
                H.o('Loại', H.sel('loai', 'Chọn loại'), { required: true }) +
                H.o('Thời gian', H.sel('tg', 'Chọn thời gian'), { required: true }) +
                H.o('Xâu Công thức', H.ta('xau', 8), { full: true, required: true }),
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function (api) {
                if (!v('loai') || !v('tg') || !v('xau').trim()) { ui.toast('Chọn Loại, Thời gian và nhập Xâu công thức', 'warn'); return false; }
                var c = d ? { action: TT + 'EjQgHgoNBgUeAi4vJhUpNCIeADEFNC8m', func: 'PKG_KLGV_V2_THONGTIN.Sua_KLGD_CongThuc_ApDung' }
                          : { action: TT + 'FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP', func: 'PKG_KLGV_V2_THONGTIN.Them_KLGD_CongThuc_ApDung' };
                c.strId = d ? e(d.ID) : ''; c.strKLGD_TongHopKhoiLuong_Id = e(r.ID); c.strDaoTao_ThoiGianDaoTao_Id = v('tg'); c.strXauCongThuc = v('xau'); c.strPhamViDung_Id = v('loai');
                ums.api.call(c).then(function () { ui.toast(d ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok'); api.close(); xong(); })
                    .catch(function (err) { ums.api.handle(err, 'lưu công thức'); });
                return false;
            } }]
        });
        var q = function (k) { return ft.body.querySelector('[data-k="' + k + '"]'); }, v = function (k) { return e(q(k).value); };
        function napLoai(pv) { return T.loaiApDung(pv).then(function (rows) { pat.fill(q('loai'), rows); return rows; }).catch(function (err) { ums.api.handle(err, 'loại'); return []; }); }
        q('pv').addEventListener('change', function () { pat.fill(q('loai'), []); if (v('pv')) napLoai(v('pv')); });
        pat.chain([q('pv'), q('loai')]);
        T.thoiGianDaoTao().rows().then(function (rows) { pat.fill(q('tg'), rows, { name: 'DAOTAO_THOIGIANDAOTAO' }); if (d) H.dat(q('tg'), d.THOIGIAN_ID); })
            .catch(function (err) { ums.api.handle(err, 'thời gian'); });
        ums.api.dm(DM_PLXN).then(function (nhoms) {
            pat.fill(q('pv'), nhoms);
            if (!d) return;
            q('xau').value = e(d.XAUCONGTHUC);
            // Khác gốc: tìm nhóm chứa loại đã lưu (PHAMVIAPDUNG_ID) để chọn sẵn cả Phạm vi lẫn Loại
            var loaiId = e(d.PHAMVIAPDUNG_ID);
            (function thu(i) {
                if (i >= nhoms.length) return;
                T.loaiApDung(e(nhoms[i].ID)).then(function (rows) {
                    if (rows.some(function (x) { return e(x.ID) === loaiId; })) {
                        H.dat(q('pv'), nhoms[i].ID); pat.fill(q('loai'), rows); q('loai').disabled = false; H.dat(q('loai'), loaiId);
                    } else thu(i + 1);
                }).catch(function () { thu(i + 1); });
            })(0);
        });
    }

    /* ---------- Khung Đợt tách dữ liệu theo ngày (gốc myModalDotTach + myModalAddDotTach) ---------- */
    function moDotTach(r) {
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-tablewrap" data-k="t"></div>';
        var ds = [], page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0;
        var ft = pat.formTrang({
            host: root, title: 'Đợt tách dữ liệu theo ngày: ' + e(r.TEN), icon: 'fa-calendar-range', flush: true, cols: 1, body: body,
            buttons: [{ text: 'Thêm mới', kind: 'add', keepOpen: true, onClick: function (api) { formDT(api.body, r, null, function () { tai(); }); return false; } }],
            xoa: { chon: 'input[data-chon="dt"]', text: 'Xóa', onClick: function () {
                var ids = H.daChon(body, 'dt');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                    if (!yes) return;
                    T.xoaNhieu(ids, function (id) { return { action: KH + 'GS4gHgoNBgUeFS4vJgkuMQopLigNNC4vJh4FLjUP', func: 'PKG_KLGV_V2_KEHOACH.Xoa_KLGD_TongHopKhoiLuong_Dot', strId: id }; }).then(function () { tai(1); });
                });
            } }
        });
        H.ganChon(body);
        var host = body.querySelector('[data-k="t"]');
        function tai(p) {
            if (p) page = p;
            host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            return ums.api.call({ action: KH + 'DSA4BRIKDQYFHhUuLyYJLjEKDR4FLjUP', func: 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKL_Dot',
                strTuKhoa: '', strKLGD_TongHopKhoiLuong_Id: e(r.ID), pageIndex: page, pageSize: size })
                .then(function (x) {
                    ds = arr(x.data); total = Number(x.pager) || ds.length;
                    ui.table({ el: host, rows: ds, stt: true, empty: 'Chưa có đợt tách nào',
                        page: { index: page, size: size, total: total,
                            onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tai(p); },
                            onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); tai(1); } },
                        columns: [
                            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' }, { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
                            { title: 'Tên', prop: 'TEN' },
                            { title: 'Kết quả', cls: 'is-center is-nowrap', render: function (d) { return ui.btn('search', { text: 'Xem', cls: 'ums-btn--sm', mod: 'out-primary', attr: { 'data-a': 'dt-kq', 'data-id': e(d.ID) } }); } },
                            { title: 'Sửa', cls: 'is-center is-actions', render: function (d) {
                                return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="dt-sua" data-id="' + esc(d.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                            } },
                            H.cotChon('dt')] });
                }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'đợt tách'); });
        }
        body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]'); if (!b) return;
            var d = ds.filter(function (x) { return e(x.ID) === b.getAttribute('data-id'); })[0];
            if (!d) return;
            if (b.getAttribute('data-a') === 'dt-sua') formDT(ft.body, r, d, function () { tai(); });
            else if (b.getAttribute('data-a') === 'dt-kq') hopKetQuaDT(d);
        });
        tai(1);
        return ft;
    }
    function formDT(host, r, d, xong) {
        var buttons = [];
        if (d) buttons.push({ text: 'Tạo dữ liệu', kind: 'confirm', icon: 'fa-play', mod: 'out-primary', keepOpen: true, onClick: function () {
            ums.api.call({ action: KH + 'FSAuBTQNKCQ0HgoNBgUeFS4vJgkuMQoNHgUuNQPP', func: 'PKG_KLGV_V2_KEHOACH.TaoDuLieu_KLGD_TongHopKL_Dot', strId: e(d.ID) })
                .then(function () { ui.toast('Thực hiện thành công!', 'ok'); }).catch(function (err) { ums.api.handle(err, 'tạo dữ liệu đợt'); });
            return false;
        } });
        buttons.push({ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function (api) {
            if (!v('tu') || !v('den') || !v('ten').trim()) { ui.toast('Nhập Từ ngày, Đến ngày và Tên đợt', 'warn'); return false; }
            var c = d ? { action: KH + 'EjQgHgoNBgUeFS4vJgkuMQopLigNNC4vJh4FLjUP', func: 'PKG_KLGV_V2_KEHOACH.Sua_KLGD_TongHopKhoiLuong_Dot' }
                      : { action: KH + 'FSkkLB4KDQYFHhUuLyYJLjEKKS4oDTQuLyYeBS41', func: 'PKG_KLGV_V2_KEHOACH.Them_KLGD_TongHopKhoiLuong_Dot' };
            c.strId = d ? e(d.ID) : ''; c.strKLGD_TongHopKhoiLuong_Id = e(r.ID); c.strTuNgay = v('tu'); c.strDenNgay = v('den'); c.strTen = v('ten'); c.strMoTa = v('mota'); c.dHieuLuc = v('hl') || 1;
            ums.api.call(c).then(function () { ui.toast(d ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok'); api.close(); xong(); })
                .catch(function (err) { ums.api.handle(err, 'lưu đợt tách'); });
            return false;
        } });
        var ft = pat.formTrang({
            host: host, title: (d ? 'Sửa' : 'Thêm') + ' đợt tách', icon: d ? 'fa-pen-to-square' : 'fa-plus',
            body: H.o('Từ ngày', H.ngay('tu'), { required: true }) + H.o('Đến ngày', H.ngay('den'), { required: true }) +
                H.o('Tên', H.inp('ten'), { required: true }) + H.o('Hiệu lực', H.sel('hl', 'Có hiệu lực')) +
                H.o('Mô tả', H.ta('mota', 5), { full: true }),
            buttons: buttons
        });
        var q = function (k) { return ft.body.querySelector('[data-k="' + k + '"]'); }, v = function (k) { return e(q(k).value); };
        pat.fill(q('hl'), H.HIEULUC, { head: 'Có hiệu lực' });
        if (d) { q('tu').value = e(d.TUNGAY); q('den').value = e(d.DENNGAY); q('ten').value = e(d.TEN); q('mota').value = e(d.MOTA); H.dat(q('hl'), d.HIEULUC); }
    }
    function hopKetQuaDT(d) {
        H.hopDanhSach({ title: 'Kết quả: ' + e(d.TEN), icon: 'fa-table-list', size: 'xl', paged: true, empty: 'Đợt chưa có dữ liệu',
            call: function (q, page, size) { return { action: KH + 'DSA4BRIKDQYFHgU0DSgkNB4NBh4VBgPP', func: 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_LG_TG', strTuKhoa: '', strKLGD_TongHoKL_Dot_Id: e(d.ID), pageIndex: page, pageSize: size }; },
            columns: [
                { title: 'Mã số', prop: 'NGUOIDUNG_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'NGUOIDUNG_HODEM' }, { title: 'Tên', prop: 'NGUOIDUNG_TEN' },
                { title: 'Thông tin lớp', prop: 'DULIEUXACNHAN_TEN' }, { title: 'Quy mô', prop: 'SOSV', cls: 'is-center' }, { title: 'Ngày học', prop: 'NGAY', cls: 'is-center is-nowrap' },
                { title: 'Số tiết theo phân công', prop: 'SOTIETTHEOTKB', cls: 'is-center' }, { title: 'Số tiết có điểm danh', prop: 'SOTIETCODIEMDANH', cls: 'is-center' },
                { title: 'Giờ chuẩn', prop: 'GIOCHUAN', cls: 'is-center' }, { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' }, { title: 'Mô tả', prop: 'MOTA' }] });
        // ô tìm trong hộp: thủ tục nhận strTuKhoa nhưng gốc gửi txtAAAA (rỗng) → giữ rỗng, không dựng ô tìm
    }

    /* ---------- Nút trên dòng ---------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a][data-id]'); if (!b || b.closest('.ums-formtrang')) return;
        var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
        if (a === 'ns-khct') { H.hopNhanSuKHCT(id, b.getAttribute('data-ten')); return; }
        var r = tim(id); if (!r) return;
        if (a === 'dottach') moDotTach(r);
        else if (a === 'canbo') H.hopCanBo('Cán bộ giảng viên: ' + e(r.TEN), { action: P + 'LayDSGiangVienTongHopKL', method: 'GET', strKLGD_TongHopKhoiLuong_Id: id });
        else if (a === 'nhansu') H.hopCanBo('Nhân sự tham gia: ' + e(r.TEN), { action: P + 'LayDSNhanSuTongHopKL', method: 'GET', strKLGD_TongHopKhoiLuong_Id: id });
        else if (a === 'khct') crud.showForm(r);
        else if (a === 'ketqua') hopBaoCao(r, 'DSA4BRIKJDUQNCACKSgVKCQ1FSkkLgoJ', 'LayDSKetQuaChiTietTheoKH', 'Kết quả chi tiết', [
            { title: 'Đơn vị', prop: 'DONVI' }, { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Họ tên', render: hoTenGach },
            { title: 'Số giờ chuẩn', prop: 'GIOCHUAN', cls: 'is-center' }, { title: 'Số tiết', prop: 'SOLUONG', cls: 'is-center' }, { title: 'Số GV cùng dạy', prop: 'SOGVCUNGDAY', cls: 'is-center' },
            { title: 'Quy mô', prop: 'QUYMO', cls: 'is-center' }, { title: 'Tên lớp', prop: 'TENLOP' }, { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
            { title: 'Ngày', prop: 'NGAY', cls: 'is-center is-nowrap' }, { title: 'Tiết bắt đầu', prop: 'TIETBATDAU', cls: 'is-center' }, { title: 'Tiết kết thúc', prop: 'TIETKETTHUC', cls: 'is-center' }]);
        else if (a === 'thgv') hopBaoCao(r, 'DSA4BRIVCRUpJC4GKCAvJhcoJC8VKSQuCgkP', 'LayDSTHTheoGiangVienTheoKH', 'Kết quả tổng hợp theo giảng viên', COT_TH);
        else if (a === 'thhp') hopBaoCao(r, 'DSA4BRIVCRUpJC4NLjEXIAYXFSkkLgoJ', 'LayDSTHTheoLopVaGVTheoKH', 'Kế hoạch tổng hợp theo lớp học phần',
            COT_TH.concat([{ title: 'Tên lớp', prop: 'TENLOP' }, { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }]));
        else if (a === 'plt') moPhanLoaiTinh(r);
        else if (a === 'ctt') moCongThuc(r);
    });
})();
