/*----------------------------------------------
--Màn hình : Hiệu lực quyền — CHỈ XEM (phanquyen_phamvi_hieuluc)
--Hàm gọi  : PKG_CORE_QUANTRI_04.pq_phamvi_hieuluc_LayDS / _LayTT
--            + danh mục (qua pqcommon.js): chức năng (+ ứng dụng), loại đối tượng
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, PQ.nguoiDungHtml, PQ.chucNangHtml, ...) — nạp trước file này.
--Ghi chú  : - LayDS nhận (strtukhoa, strnguon_loai, strloai_hieuluc) — CẢ BA đều lọc phía máy chủ; KHÔNG phân trang.
--             Bảng này gộp kết quả của mọi kênh nên có thể rất lớn → màn hình KHÔNG tự tải khi mở: phải nhập từ khóa
--             (>= 2 ký tự) hoặc chọn Nguồn gốc / Hiệu lực rồi bấm Tìm kiếm. Bảng chỉ vẽ tối đa MAX_HIEN_THI dòng.
--           - Chỉ xem: không Thêm/Sửa/Xóa. Nút "Tính lại" (buộc tính lại cho 1 người dùng) trong thiết kế CHƯA có hàm BE
--             nên chưa làm; thay bằng nút "Xem" mở chi tiết bằng pq_phamvi_hieuluc_LayTT (khóa 7 trường, giá trị gốc của dòng).
--           - Chi tiết hiện cả bảng tổng hợp lẫn toàn bộ cột gốc hàm trả về (phục vụ audit / gỡ lỗi) — không giả định trước
--             hình dạng response của LayTT (mảng hay đối tượng đều được).
--           - Tên cột response (NGUOIDUNG_ID, CHUCNANG_ID, LOAIDOITUONG_MA, DOITUONG_ID, LOAI_HIEULUC, LAN_QUYEN_XUONG_CON,
--             NGUON_LOAI, NGUON_ID) suy ra từ tên tham số — nếu BE trả tên khác, console sẽ cảnh báo. Cột "Điều kiện bổ sung"
--             chưa rõ tên: thử CO_DIEUKIEN_BOSUNG / CO_DIEUKIEN / DIEUKIEN_BOSUNG / SO_DIEUKIEN_BOSUNG.
----------------------------------------------*/
function HieuLucQuyen() { };
HieuLucQuyen.prototype = {
    MAX_HIEN_THI: 1000,
    dtAll: [],          // kết quả LayDS gần nhất
    dtShow: [],         // đúng các dòng đang vẽ (nút Xem tra theo chỉ số trong mảng này)
    mapChucNang: {},    // ID chức năng → {TEN, MA, UD, LABEL}
    mapLoai: {},        // mã loại đối tượng → tên
    daTim: false,       // đã bấm tìm ít nhất 1 lần (sau đó đổi ô lọc sẽ tự tìm lại)
    bDaCanhBaoDK: false,

    API: {
        LAYDS: { action: 'CMS_QuanTri04_MH/MTAeMSkgLDcoHikoJDQtNCIeDSA4BRIP', func: 'PKG_CORE_QUANTRI_04.pq_phamvi_hieuluc_LayDS' },
        LAYTT: { action: 'CMS_QuanTri04_MH/MTAeMSkgLDcoHikoJDQtNCIeDSA4FRUP', func: 'PKG_CORE_QUANTRI_04.pq_phamvi_hieuluc_LayTT' },
        // Đồng bộ lại TOÀN BỘ dữ liệu quyền. Nhận strNguoiThucHien_Id; có 2 tham số ra (dSoDongThanhCong, dSoDongLoi) nhưng
        // controller KHÔNG đưa vào response (chỉ Success + Message) nên màn hình không hiện được số dòng — cần BE bổ sung.
        DONGBO: { action: 'CMS_QuanTri04_MH/BS4vJgMuDSAoFS4gLwMu', func: 'PKG_CORE_QUANTRI_04.DongBoLaiToanBo' }
    },

    init: function () {
        var me = this;
        // Xuất Excel bằng chuẩn chung (edu.exporter): xuất ĐỦ kết quả tìm (bảng chỉ vẽ tối đa MAX_HIEN_THI dòng)
        PQ.attachExport({
            table: 'tblHieuLuc', title: 'HIỆU LỰC QUYỀN', fileName: 'HieuLucQuyen',
            rows: function () { return me.dtAll; },
            subTitles: function () { return me.strTuKhoa ? ['Từ khóa: ' + me.strTuKhoa] : []; },
            filters: [[{ label: 'Nguồn gốc', id: 'dropSearch_HL_Nguon' }, { label: 'Hiệu lực', id: 'dropSearch_HL_HieuLuc' }]]
        });
        // Nạp danh mục để hiện tên thay cho ID. KHÔNG tải dữ liệu hiệu lực ở đây.
        PQ.whenAll([PQ.loadChucNang, PQ.loadLoaiDoiTuong], function (kq) {
            me.mapLoai = PQ.mapOf(kq[1], 'MA', 'TEN');
            me.mapChucNang = {};
            $.each(kq[0], function (i, r) { me.mapChucNang[r.ID] = r; });
        });

        $("#btnSearch_HieuLuc").click(function () {
            me.getList_HieuLuc();
        });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $("#txtSearch_HieuLuc").on("keyup", function (e) {
            if (e.which === 13) me.getList_HieuLuc();
        });
        // Nguồn gốc / Hiệu lực là tham số của LayDS → sau lần tìm đầu, đổi là tìm lại
        $("#dropSearch_HL_Nguon, #dropSearch_HL_HieuLuc").on("change", function () {
            if (me.daTim) me.getList_HieuLuc();
        });
        $("#tblHieuLuc").delegate(".btnXem", "click", function () {
            me.popup_Xem($(this).attr("data-i"));
        });
        $("#btnDongBo_HieuLuc").click(function () {
            me.confirm_DongBo();
        });
    },

    /*------------------------------------------
    --Đồng bộ dữ liệu quyền — chạy hàm DongBoLaiToanBo bằng form tiến trình chuẩn edu.process (qua PQ.chayJob)
    -------------------------------------------*/
    confirm_DongBo: function () {
        var me = this;
        PQ.chayJob({
            title: "Đồng bộ dữ liệu quyền",
            what: "Đồng bộ lại toàn bộ dữ liệu quyền — toàn hệ thống",
            api: me.API.DONGBO,
            params: { 'strNguoiThucHien_Id': edu.system.userId },
            okMessage: "Đã đồng bộ dữ liệu quyền",
            notes: ["Đồng bộ chạy trên toàn hệ thống và có thể chạy lâu do dữ liệu lớn — vui lòng không đóng trang trong lúc chạy."],
            fileName: "DongBoDuLieuQuyen",
            // Đang xem kết quả của 1 lần tìm → tải lại để thấy dữ liệu mới
            refresh: function () { if (me.daTim) me.getList_HieuLuc(); }
        });
    },

    /*------------------------------------------
    --Tiện ích riêng của màn hình
    -------------------------------------------*/
    _so: function (n) {
        return Number(n).toLocaleString('vi-VN');
    },
    _tenLoai: function (strMa) {
        return (PQ.has(this.mapLoai, strMa) && this.mapLoai[strMa]) ? this.mapLoai[strMa] : strMa;
    },
    _tenChucNang: function (strId) {
        return PQ.has(this.mapChucNang, strId) ? this.mapChucNang[strId].TEN : strId;
    },
    _hieuLuc: function (row) {
        return String(PQ.g(row, 'LOAI_HIEULUC')).toUpperCase();
    },
    _pillHieuLuc: function (row) {
        var h = this._hieuLuc(row);
        if (h === 'ALLOW') return '<span class="pq-pill pq-pill-allow">ALLOW</span>';
        if (h === 'DENY') return '<span class="pq-pill pq-pill-deny">DENY</span>';
        return '<span class="pq-pill pq-pill-grey">' + PQ.esc(h) + '</span>';
    },
    _pillNguon: function (row) {
        return '<span class="pq-pill pq-pill-blue" title="' + PQ.esc(PQ.g(row, 'NGUON_ID')) + '">' + PQ.esc(PQ.g(row, 'NGUON_LOAI')) + '</span>';
    },
    _phamViHtml: function (row) {
        return '<span>' + PQ.esc(this._tenLoai(PQ.g(row, 'LOAIDOITUONG_MA'))) + '</span> <span class="pq-sub">/</span> <span class="pq-mono">' + PQ.esc(PQ.g(row, 'DOITUONG_ID')) + '</span>';
    },
    _lanXuongCon: function (row) {
        return PQ.isTrue(PQ.g(row, 'LAN_QUYEN_XUONG_CON')) ? 'Có' : 'Không';
    },
    // Có điều kiện bổ sung? Cờ 0/1 → "Có — xem ở Quản lý thủ công"; giá trị khác (chữ / số > 1) → hiện nguyên giá trị; không có → "—"
    _dieuKienBoSung: function (row) {
        var me = this;
        var keys = ['CO_DIEUKIEN_BOSUNG', 'CO_DIEUKIEN', 'DIEUKIEN_BOSUNG', 'SO_DIEUKIEN_BOSUNG'];
        for (var i = 0; i < keys.length; i++) {
            var v = PQ.g(row, keys[i]);
            if (v === '') continue;
            if (PQ.isTrue(v)) return 'Có — xem ở Quản lý thủ công';
            if (v === 0 || v === '0' || v === false || String(v).toLowerCase() === 'false') return '—';
            return String(v);
        }
        if (!me.bDaCanhBaoDK && window.console) {
            me.bDaCanhBaoDK = true;
            console.warn('[hieuluquyen] Response không có cột điều kiện bổ sung (thử: ' + keys.join(', ') + ') — cột này đang hiện "—". Các cột nhận được:', Object.keys(row));
        }
        return '—';
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS) — lọc phía máy chủ
    -------------------------------------------*/
    getList_HieuLuc: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_HieuLuc'));
        var strNguon = edu.util.getValById('dropSearch_HL_Nguon');
        var strHl = edu.util.getValById('dropSearch_HL_HieuLuc');
        if (strTuKhoa.length < 2 && !strNguon && !strHl) {
            edu.system.alert("Bảng hiệu lực rất lớn nên không tải toàn bộ. Hãy nhập từ khóa (ít nhất 2 ký tự) hoặc chọn Nguồn gốc / Hiệu lực rồi bấm Tìm kiếm.", "w");
            return;
        }
        PQ.call(me.API.LAYDS, { 'strtukhoa': strTuKhoa, 'strnguon_loai': strNguon, 'strloai_hieuluc': strHl }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.daTim = true;
            me.dtAll = data.Data || [];
            me.strTuKhoa = strTuKhoa;   // để nút Xuất Excel ghi điều kiện tìm kiếm
            if (me.dtAll.length > 0 && PQ.g(me.dtAll[0], 'NGUOIDUNG_ID') === '' && PQ.g(me.dtAll[0], 'CHUCNANG_ID') === '' && window.console) {
                console.warn('[hieuluquyen] Response LayDS không có cột NGUOIDUNG_ID/CHUCNANG_ID — các cột nhận được:', Object.keys(me.dtAll[0]));
            }
            var dt = me.dtAll;
            var strDem = me._so(dt.length) + ' dòng';
            if (dt.length > me.MAX_HIEN_THI) {
                strDem += ' — chỉ hiển thị ' + me._so(me.MAX_HIEN_THI) + ' dòng đầu, hãy thu hẹp từ khóa hoặc ô lọc';
                dt = dt.slice(0, me.MAX_HIEN_THI);
            }
            me.dtShow = dt;
            $("#lblCount_HieuLuc").text(strDem);
            me.genTable_HieuLuc(dt);
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    genTable_HieuLuc: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHieuLuc",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Người dùng | 2 Chức năng | 3 Phạm vi | 4 Hiệu lực | 5 Lan xuống con | 6 Nguồn gốc | 7 Điều kiện bổ sung | 8 Xem
            colPos: {
                center: [0, 4, 5, 6, 8]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return PQ.nguoiDungHtml(aData, 'NGUOIDUNG_ID', 'hieuluquyen');
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.chucNangHtml(me.mapChucNang, PQ.g(aData, 'CHUCNANG_ID'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._phamViHtml(aData);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._pillHieuLuc(aData);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._lanXuongCon(aData);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._pillNguon(aData);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.esc(me._dieuKienBoSung(aData));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnXem" data-i="' + nRow + '" title="Xem chi tiết"><i class="fa fa-eye color-active"></i></a>';
                    }
                }
            ]
        };
        PQ.veBang(jsonForm);
    },

    /*------------------------------------------
    --[2] Chi tiết (LayTT, khóa 7 trường)
    -------------------------------------------*/
    popup_Xem: function (strIdx) {
        var me = this;
        var row = me.dtShow[parseInt(strIdx, 10)];
        if (!row) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        // Gửi nguyên giá trị gốc của dòng để khớp đúng khóa
        var params = {
            'strnguoidung_id': PQ.g(row, 'NGUOIDUNG_ID'),
            'strchucnang_id': PQ.g(row, 'CHUCNANG_ID'),
            'strloaidoituong_ma': PQ.g(row, 'LOAIDOITUONG_MA'),
            'strdoituong_id': PQ.g(row, 'DOITUONG_ID'),
            'strloai_hieuluc': PQ.g(row, 'LOAI_HIEULUC'),
            'strnguon_loai': PQ.g(row, 'NGUON_LOAI'),
            'strnguon_id': PQ.g(row, 'NGUON_ID')
        };
        PQ.call(me.API.LAYTT, params, function (data) {
            var d = data.Data;
            if ($.isArray(d)) d = d[0];
            if (data.Success && d && !$.isEmptyObject(d)) {
                me.showChiTiet(d, row, false);
            } else {
                if (window.console) console.warn('[hieuluquyen] LayTT không trả dữ liệu — dùng dòng trong danh sách.', data);
                me.showChiTiet(row, row, true);
            }
        }, function (er) {
            if (window.console) console.warn('[hieuluquyen] LayTT lỗi — dùng dòng trong danh sách.', er);
            me.showChiTiet(row, row, true);
        });
    },
    // d: dữ liệu chi tiết; rowList: dòng trong danh sách (dự phòng tên người dùng); bFallback: d chính là dòng danh sách
    showChiTiet: function (d, rowList, bFallback) {
        var me = this;
        var o = PQ.nguoiDungCuaDong(d, 'NGUOIDUNG_ID');
        if (!o.CO) o = PQ.nguoiDungCuaDong(rowList, 'NGUOIDUNG_ID');
        var strNhanNd = PQ.nhanNguoiDung(o.TEN, o.TK, o.ID);
        var kv = function (strKey, strHtml) { return '<tr><td>' + PQ.esc(strKey) + '</td><td>' + strHtml + '</td></tr>'; };
        var strNguonId = PQ.g(d, 'NGUON_ID');

        var tong = '';
        tong += kv('Người dùng', PQ.esc(strNhanNd) + (strNhanNd !== o.ID ? ' <span class="pq-mono pq-sub">[' + PQ.esc(o.ID) + ']</span>' : ''));
        tong += kv('Chức năng', PQ.chucNangHtml(me.mapChucNang, PQ.g(d, 'CHUCNANG_ID')));
        tong += kv('Phạm vi', me._phamViHtml(d));
        tong += kv('Hiệu lực', me._pillHieuLuc(d));
        tong += kv('Lan xuống con', me._lanXuongCon(d));
        tong += kv('Nguồn gốc', me._pillNguon(d) + (strNguonId !== '' ? ' <span class="pq-mono">' + PQ.esc(strNguonId) + '</span>' : ''));
        tong += kv('Điều kiện bổ sung', PQ.esc(me._dieuKienBoSung(d)));
        $("#tblHL_TongHop tbody").html(tong);

        var goc = '';
        $.each(d, function (k, v) {
            var s = (v === null || v === undefined) ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v));
            goc += '<tr><td>' + PQ.esc(k) + '</td><td>' + PQ.esc(s) + '</td></tr>';
        });
        $("#tblHL_Goc tbody").html(goc);

        $("#noteHL_Fallback").css("display", bFallback ? "" : "none");
        $("#titleHieuLuc").text(strNhanNd + " × " + me._tenChucNang(PQ.g(d, 'CHUCNANG_ID')));
        $("#myModalHieuLuc").modal("show");
    }
};
