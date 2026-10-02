/* =========================================================================
   Khai báo tiêu chí điểm rèn luyện
   Bản gốc: ApisRenLuyen/Modules/tieuchidiem/script/tieuchidiem.js (lớp TieuChiDiem)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên từ bản gốc, kiểu cũ — không func, không iM):
     RL_TieuChiDanhGia/LayDanhSach  (GET)  strTuKhoa, strDRL_TieuChiDanhGia_Cha_id, strNguoiTao_Id,
                                            strNhomTieuChi_Id, strDoiTuongApDung_Id, pageIndex, pageSize
     RL_TieuChiDanhGia/ThemMoi | CapNhat   strId, strDoiTuongApDung_Id, strMa, strTen, dMucDiemQuyDinh,
                                            strNhomTieuChi_Id, strDRL_TieuChiDanhGia_Cha_Id, iThuTu,
                                            strThangDiem_Id, dNhapTrucTiep
     Danh mục: DRL.DOITUONGAPDUNG (lọc + biểu mẫu), DRL.THANGDIEM, DRL.DMTC (nhóm tiêu chí).
   strChucNang_Id / strNguoiThucHien_Id do ums.api tự chèn như bản gốc.

   Bố cục: một cột — ô chọn đối tượng + "Thêm mới", dưới là danh sách tiêu chí.
   ĐI KHÁC GỐC theo yêu cầu người dùng (2026-09-25): gốc vẽ CÂY tiêu chí lên TIÊU ĐỀ
   bảng (cha gộp cột trên các con, thân bảng trống). Nay BỎ BẢNG, vẽ SƠ ĐỒ TỔ CHỨC
   (ums.pat.soDo): cha ở trên, các con dàn ngang bên dưới, nối bằng đường kẻ; mỗi ô
   ghi tên + mã + mức điểm; bấm ô → biểu mẫu sửa. Rộng hơn khung thì cuộn ngang.
   Hai kiểu khác vẫn giữ để DÙNG LẠI nếu muốn:
     · Sơ đồ trên TIÊU ĐỀ bảng (như gốc): hàm veCayTieuDe(crud) bên dưới — đổi
       onLoad gọi veCayTieuDe thay veSoDo (ui.table cột `group`, mã cha làm khoá nhóm).
     · BẢNG CÂY (dòng thụt lề theo cấp, như tieuchidiemapdung): nạp
       ../../khaibaoheso/script/_apdung.js, đặt `list.rows: d => ums.rlApDung.cay(d)` +
       cột `ums.rlApDung.cotCay({ title: 'Tên tiêu chí' })`, Mã, Mức điểm, Thứ tự; bỏ veSoDo.
   Hộp thoại (#myModal) của gốc → biểu mẫu thay chỗ danh sách (ums.crud).

   Khác bản gốc (ghi rõ):
     · pageSize: gốc gửi edu.system.pageSize_default (thường 10, đổi theo thanh
       phân trang của màn mở trước) mà màn KHÔNG có phân trang → cây tiêu chí
       chỉ hiện 10 dòng đầu, cha/con bị cắt. Bản mới gửi pageIndex 1, pageSize
       10000 (đúng giá trị bản anh em tieuchixeploai dùng cho cùng lời gọi).
     · Tiêu chí có cha KHÔNG nằm trong danh sách (mồ côi) gốc bỏ mất; bản mới
       vẽ như tiêu chí gốc để vẫn sửa được.
     · Ô "Chọn DM tiêu chí" (tiêu chí cha) khi SỬA bỏ chính nó và các con cháu:
       gốc cho chọn → vòng cha-con, insertHeaderTable đệ quy vô hạn (treo trang).
     · Nút "Xóa" trong hộp thoại gốc để display:none và không nơi nào bật lại →
       màn gốc KHÔNG xoá được tiêu chí. Người dùng yêu cầu (2026-09-25): CÓ nút Xoá
       trong biểu mẫu sửa; xoá CHA thì xoá luôn MỌI con cháu, hỏi lại nêu rõ số và tên
       tiêu chí con. Gửi RL_TieuChiDanhGia/Xoa (strIds, như delete_TieuChiDiem gốc) từng
       id một, CON CHÁU TRƯỚC (tầng sâu nhất trước) rồi mới tới cha.
     · Ô dropAAAA/txtAAAA không tồn tại → gửi chuỗi rỗng (giá trị thật gốc gửi).
     · Gốc chỉ nạp lại khi select2:select (xoá ô lọc không nạp); bản mới nạp lại
       cả khi xoá ô lọc (ums.crud nghe change).
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('tieuchidiem');
    var ui = ums.ui, esc = ui.esc;
    var DOITUONG = { dm: 'DRL.DOITUONGAPDUNG' };

    function nhan(r) {
        return (r.TEN == null ? '' : r.TEN) + ' (' + (r.MUCDIEMQUYDINH == null ? '' : r.MUCDIEMQUYDINH) + ')';
    }
    function chaId(r) { return r.DRL_TIEUCHIDANHGIA_CHA_ID || ''; }

    /* ---------- Sơ đồ tổ chức (kiểu đang dùng) --------------------------- */
    function veSoDo(crud) {
        var rows = crud.rows || [];
        var host = crud.z('table');
        if (!rows.length) { host.innerHTML = ui.empty('Chưa có tiêu chí nào'); return; }
        var idx = {};
        rows.forEach(function (r, i) { idx[r.ID] = i; });
        ums.pat.soDo(host, rows, {
            cha: 'DRL_TIEUCHIDANHGIA_CHA_ID',
            attr: function (r) { return { 'data-c': crud.uid + ':edit', 'data-i': idx[r.ID], title: 'Sửa tiêu chí' }; },
            nhan: function (r) {
                var d = r.MUCDIEMQUYDINH;
                return '<span>' + esc(r.TEN == null ? '' : r.TEN) + '</span>' +
                    (r.MA ? '<span class="ums-sodo__ma">' + esc(r.MA) + '</span>' : '') +
                    (d == null || d === '' ? '' : '<span class="ums-sodo__diem' + (Number(d) < 0 ? ' is-am' : '') + '">' + esc(d) + '</span>');
            }
        });
        host.insertAdjacentHTML('beforeend', '<div class="ums-tablefoot ums-u-faint ums-u-fz13">' +
            '<i class="fa-light fa-circle-info"></i> Bấm một tiêu chí để sửa. Số trong ô là mức điểm quy định.</div>');
    }

    /* ---------- Cây tiêu chí thành tiêu đề bảng (KIỂU CŨ — không dùng) --------
       Giữ lại để bật lại nếu cần: xem chú thích đầu tệp. */
    // eslint-disable-next-line no-unused-vars
    function veCayTieuDe(crud) {
        var rows = crud.rows || [];
        var host = crud.z('table');
        if (!rows.length) { host.innerHTML = ui.empty('Chưa có tiêu chí nào'); return; }

        var idx = {}, con = {};
        rows.forEach(function (r, i) { idx[r.ID] = i; });
        rows.forEach(function (r) {
            var p = chaId(r);
            if (!p || idx[p] === undefined) p = '';          // gốc hoặc mồ côi → tầng trên cùng
            (con[p] = con[p] || []).push(r);
        });

        var cols = [], daQua = {};
        function nut(r) {
            return '<button type="button" class="ums-link" data-c="' + crud.uid + ':edit" data-i="' + idx[r.ID] +
                '" title="Sửa tiêu chí">' + esc(nhan(r)) + '</button>';
        }
        function duyet(r, duong) {
            if (daQua[r.ID]) return;                          // chặn vòng cha-con của dữ liệu cũ
            daQua[r.ID] = true;
            var ds = con[r.ID] || [];
            if (!ds.length) { cols.push({ group: duong, head: nut(r), cls: 'is-center' }); return; }
            ds.forEach(function (x) { duyet(x, duong.concat(r.ID)); });
        }
        (con[''] || []).forEach(function (r) { duyet(r, []); });

        ui.table({ el: host, columns: cols, rows: [], stt: false });

        // Ô nhóm mang mã tiêu chí cha (khoá duy nhất) → đổi thành nút sửa
        host.querySelectorAll('th.ums-table__grp').forEach(function (th) {
            var i = idx[th.textContent];
            if (i !== undefined) th.innerHTML = nut(rows[i]);
        });
        // Thân bảng trống như gốc — bỏ dòng "Không có dữ liệu", thay bằng câu dẫn
        var tb = host.querySelector('tbody');
        if (tb) tb.parentNode.removeChild(tb);
        host.insertAdjacentHTML('beforeend', '<div class="ums-tablefoot ums-u-faint ums-u-fz13">' +
            '<i class="fa-light fa-circle-info"></i> Bấm tên một tiêu chí để sửa. Số trong ngoặc là mức điểm quy định.</div>');
    }

    /* ---------- Ô "Chọn DM tiêu chí": nạp từ chính danh sách đang xem ---- */
    function oCha(crud) {
        return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="strDRL_TieuChiDanhGia_Cha_Id"]');
    }
    function napCha(crud, dangSua) {
        var bo = {};
        if (dangSua) {
            // bỏ chính nó và mọi con cháu
            bo[dangSua.ID] = true;
            var doi = true;
            while (doi) {
                doi = false;
                crud.rows.forEach(function (r) {
                    if (!bo[r.ID] && bo[chaId(r)]) { bo[r.ID] = true; doi = true; }
                });
            }
        }
        ums.pat.fill(oCha(crud), crud.rows.filter(function (r) { return !bo[r.ID]; }), { head: 'Chọn danh mục tiêu chí' });
    }

    /* ---------- Xoá: cha kéo theo mọi con cháu --------------------------- */
    var cr;
    // mọi con cháu của id theo THỨ TỰ CÂY (cha trước con); sauTruoc = true → tầng sâu nhất đứng trước (để xoá)
    function conChau(id, sauTruoc) {
        var ra = [], da = {};
        (function di(p, cap) {
            (cr.rows || []).forEach(function (r) {
                if (chaId(r) !== p || da[r.ID] || r.ID === id) return;
                da[r.ID] = true;
                ra.push({ r: r, cap: cap });
                di(r.ID, cap + 1);
            });
        })(id, 1);
        if (sauTruoc) ra = ra.slice().sort(function (a, b) { return b.cap - a.cap; });   // sort ổn định: cùng tầng giữ thứ tự
        return ra.map(function (x) { return x.r; });
    }

    cr = ums.crud({
        root: root,
        title: 'Khai báo tiêu chí điểm',
        formTitle: 'tiêu chí điểm',
        listTitle: 'Tiêu chí điểm',
        icon: 'fa-list-tree',

        filters: [
            { key: 'doiTuong', type: 'select', label: 'Chọn đối tượng', source: DOITUONG }
        ],

        list: {
            call: function (f) {
                return {
                    action: 'RL_TieuChiDanhGia/LayDanhSach',
                    method: 'GET',
                    strTuKhoa: '',
                    'strDRL_TieuChiDanhGia_Cha_id': '',
                    strNguoiTao_Id: '',
                    strNhomTieuChi_Id: '',
                    strDoiTuongApDung_Id: f.doiTuong,
                    pageIndex: 1,
                    pageSize: 10000
                };
            },
        },
        columns: [],
        onLoad: function (rows, crud) {
            veSoDo(crud);
            napCha(crud, null);
        },

        formCols: 2,
        fields: [
            { key: 'strDRL_TieuChiDanhGia_Cha_Id', col: 'DRL_TIEUCHIDANHGIA_CHA_ID', label: 'Chọn DM tiêu chí', type: 'select',
              placeholder: 'Chọn danh mục tiêu chí' },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' },
            { key: 'strTen', col: 'TEN', label: 'Tên tiêu chí' },
            { key: 'strMa', col: 'MA', label: 'Mã tiêu chí' },
            { key: 'dMucDiemQuyDinh', col: 'MUCDIEMQUYDINH', label: 'Mức điểm quy định', type: 'number' },
            { key: 'strDoiTuongApDung_Id', col: 'DOITUONGAPDUNG_ID', label: 'Đối tượng áp dụng', type: 'select', source: DOITUONG },
            { key: 'strThangDiem_Id', col: 'THANGDIEM_ID', label: 'Thang điểm', type: 'select', source: { dm: 'DRL.THANGDIEM' } },
            { key: 'strNhomTieuChi_Id', col: 'NHOMTIEUCHI_ID', label: 'Nhóm tiêu chí', type: 'select', source: { dm: 'DRL.DMTC' } },
            { key: 'dNhapTrucTiep', col: 'NHAPTRUCTIEP', label: 'Nhập trực tiếp', type: 'select', required: true, placeholder: false, value: '1',
              source: { items: [{ ID: '1', TEN: 'Nhập trực tiếp' }, { ID: '0', TEN: 'Không nhập trực tiếp' }] } }
        ],

        multi: false,                           // danh sách là sơ đồ, không có cột đánh dấu → chỉ xoá trong biểu mẫu
        formRemoveText: 'Xóa',
        removeConfirm: function (rows) {
            var r = rows[0], ds = conChau(r.ID);
            var ten = function (x) { return '"' + (x.TEN == null ? '' : x.TEN) + '"'; };
            if (!ds.length) return 'Xoá tiêu chí ' + ten(r) + '? Thao tác này không hoàn tác được.';
            var ds8 = ds.slice(0, 8).map(ten).join(', ') + (ds.length > 8 ? '… (và ' + (ds.length - 8) + ' tiêu chí khác)' : '');
            return 'Xoá tiêu chí ' + ten(r) + '? Tiêu chí này có ' + ds.length + ' tiêu chí con — TẤT CẢ sẽ bị xoá theo: ' +
                ds8 + '. Thao tác này không hoàn tác được.';
        },
        remove: function (ids) {
            var calls = [];
            ids.forEach(function (id) {
                conChau(id, true).concat([{ ID: id }]).forEach(function (x) {
                    calls.push({ action: 'RL_TieuChiDanhGia/Xoa', strIds: x.ID });
                });
            });
            return calls;
        },

        onForm: function (row, crud) {
            napCha(crud, row);
            if (!row) {
                // resetPopup gốc: đối tượng áp dụng lấy theo ô lọc đang chọn
                var el = crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="strDoiTuongApDung_Id"]');
                if (el) {
                    el.value = crud.filterValues().doiTuong || '';
                    if (window.jQuery) jQuery(el).trigger('change.select2');
                }
            }
        },

        save: function (v, row) {
            return {
                action: row ? 'RL_TieuChiDanhGia/CapNhat' : 'RL_TieuChiDanhGia/ThemMoi',
                strId: row ? row.ID : '',
                strDoiTuongApDung_Id: v.strDoiTuongApDung_Id,
                strMa: v.strMa,
                strTen: v.strTen,
                dMucDiemQuyDinh: v.dMucDiemQuyDinh,
                strNhomTieuChi_Id: v.strNhomTieuChi_Id,
                strDRL_TieuChiDanhGia_Cha_Id: v.strDRL_TieuChiDanhGia_Cha_Id,
                iThuTu: v.iThuTu,
                strThangDiem_Id: v.strThangDiem_Id,
                dNhapTrucTiep: v.dNhapTrucTiep
            };
        }
    });
})();
