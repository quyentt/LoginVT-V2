/*----------------------------------------------
--Màn hình : Quản lý thủ công — 2 tab
--  TAB 1 "Gán quyền thẳng" (phanquyen_phamvi_nguon, nguon_loai = THUCONG): PKG_CORE_QUANTRI_04.pq_phamvi_nguon_LayDS / _Them / _Xoa
--  TAB 2 "Điều kiện bổ sung" (phanquyen_dieukien_bosung): PKG_CORE_QUANTRI_04.pq_dieukien_bosung_LayDS / _Them / _Xoa
--            + danh mục (qua pqcommon.js): chức năng (+ ứng dụng), loại đối tượng; tìm người dùng theo từ khóa
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, PQ.pickerNguoiDung, PQ.nguoiDungHtml, ...) — nạp trước file này.
--Ghi chú  : - Danh mục (chức năng, loại đối tượng) nạp 1 lần ở init() dùng chung cho cả 2 tab.
--           - TAB 2: chỉ Thêm/Xóa (không có Sửa); pq_dieukien_bosung_LayTT chưa dùng. "Gắn vào lần gán quyền" = cặp
--             (strnguon_loai, strnguon_id) nhập tay; LayDS nhận (strtukhoa, strnguon_loai) nên ô "Loại nguồn" lọc phía máy chủ.
--             Thêm KHÔNG gửi strid (BE tự sinh); Xóa chỉ gửi strid. Modal tab 2 dùng vùng thông báo #notifyDK.
--             Tên cột response tab 2 (ID, NGUON_LOAI, NGUON_ID, LOAIDOITUONG_MA, DOITUONG_ID, GHICHU) suy ra từ tên tham số.
--           - Chỉ Thêm/Xóa, KHÔNG có Sửa (đúng giới hạn của hàm). pq_phamvi_nguon_LayTT chưa dùng (không có form Sửa).
--           - Khóa của 1 dòng gồm 7 trường (nguon_loai, nguon_id, nguoidung_id, chucnang_id, loaidoituong_ma, doituong_id,
--             loai_hieuluc): Xoa nhận đủ 7, và ta gửi NGUYÊN GIÁ TRỊ GỐC của dòng (không chuẩn hóa chữ hoa/thường).
--           - LayDS nhận (strtukhoa, strnguon_loai): tab này luôn gửi strnguon_loai = THUCONG.
--           - Thêm: strnguon_id do người dùng nhập (không có strid tự sinh), strnguon_loai cố định THUCONG,
--             dlan_quyen_xuong_con luôn gửi 0/1, ngày gửi dạng dd/mm/yyyy ('' nếu để trống).
--           - Không phân trang → bảng vẽ toàn bộ kết quả (bản ghi thủ công rất ít).
--           - Tên cột response (NGUON_LOAI, NGUON_ID, NGUOIDUNG_ID, CHUCNANG_ID, LOAIDOITUONG_MA, DOITUONG_ID, LOAI_HIEULUC,
--             LAN_QUYEN_XUONG_CON, TUNGAY, DENNGAY) suy ra từ tên tham số — nếu BE trả tên khác, console sẽ cảnh báo.
----------------------------------------------*/
function QuanLyThuTay() { };
QuanLyThuTay.prototype = {
    NGUON_LOAI: 'THUCONG',
    dtAll: [],          // kết quả LayDS gần nhất; nút Xóa tra theo chỉ số trong mảng này
    mapChucNang: {},    // ID chức năng → {TEN, MA, UD, LABEL}
    mapLoai: {},        // mã loại đối tượng → tên
    strTuKhoa: '',      // từ khóa của lần LayDS gần nhất
    iTong: undefined,   // tổng số bản ghi khi không lọc (để hiện "x / tổng")
    pickerGT: null,     // ô chọn người dùng trong modal (PQ.pickerNguoiDung)
    dtDK: [],           // TAB 2: kết quả pq_dieukien_bosung_LayDS gần nhất (nút Xóa tra theo ID)
    strTuKhoaDK: '',
    strNguonLoaiDK: '',
    iTongDK: undefined,

    API: {
        GT_LAYDS: { action: 'CMS_QuanTri04_MH/MTAeMSkgLDcoHi8mNC4vHg0gOAUS', func: 'PKG_CORE_QUANTRI_04.pq_phamvi_nguon_LayDS' },
        GT_THEM: { action: 'CMS_QuanTri04_MH/MTAeMSkgLDcoHi8mNC4vHhUpJCwP', func: 'PKG_CORE_QUANTRI_04.pq_phamvi_nguon_Them' },
        GT_XOA: { action: 'CMS_QuanTri04_MH/MTAeMSkgLDcoHi8mNC4vHhkuIAPP', func: 'PKG_CORE_QUANTRI_04.pq_phamvi_nguon_Xoa' },
        DK_LAYDS: { action: 'CMS_QuanTri04_MH/MTAeJSgkNCooJC8eIy4yNC8mHg0gOAUS', func: 'PKG_CORE_QUANTRI_04.pq_dieukien_bosung_LayDS' },
        DK_THEM: { action: 'CMS_QuanTri04_MH/MTAeJSgkNCooJC8eIy4yNC8mHhUpJCwP', func: 'PKG_CORE_QUANTRI_04.pq_dieukien_bosung_Them' },
        DK_XOA: { action: 'CMS_QuanTri04_MH/MTAeJSgkNCooJC8eIy4yNC8mHhkuIAPP', func: 'PKG_CORE_QUANTRI_04.pq_dieukien_bosung_Xoa' }
    },

    init: function () {
        var me = this;
        // Chọn loại đối tượng → hiện bảng danh sách đối tượng để chọn (cả form Gán thẳng lẫn Điều kiện bổ sung)
        me.pickGTDT = PQ.pickerDoiTuong({ drop: 'dropGT_LoaiDoiTuong', txt: 'txtGT_DoiTuong' });
        me.pickDKDT = PQ.pickerDoiTuong({ drop: 'dropDK_LoaiDoiTuong', txt: 'txtDK_DoiTuong' });
        // Xuất Excel bằng chuẩn chung (edu.exporter) cho cả 2 bảng
        PQ.attachExport({
            table: 'tblGanThang', title: 'DANH SÁCH GÁN QUYỀN THẲNG (THỦ CÔNG)', fileName: 'GanQuyenThang',
            subTitles: function () { return me.strTuKhoa ? ['Từ khóa: ' + me.strTuKhoa] : []; }
        });
        PQ.attachExport({
            table: 'tblDieuKienBoSung', title: 'DANH SÁCH ĐIỀU KIỆN BỔ SUNG', fileName: 'DieuKienBoSung',
            subTitles: function () { return me.strTuKhoaDK ? ['Từ khóa: ' + me.strTuKhoaDK] : []; },
            filters: [[{ label: 'Loại nguồn', id: 'dropSearch_DK_NguonLoai' }]]
        });
        // Nạp song song 2 danh mục (đổ ô chọn + tra tên hiển thị trong bảng), xong mới tải danh sách của cả 2 tab.
        PQ.whenAll([PQ.loadChucNang, PQ.loadLoaiDoiTuong], function (kq) {
            var dtCn = kq[0], dtLoai = kq[1];
            me.mapLoai = PQ.mapOf(dtLoai, 'MA', 'TEN');
            me.mapChucNang = {};
            $.each(dtCn, function (i, r) { me.mapChucNang[r.ID] = r; });
            PQ.loadCombo(["dropGT_ChucNang"],
                $.map(dtCn, function (r) { return { ID: r.ID, TEN: r.LABEL }; }),
                "-- Chọn chức năng --");
            PQ.loadCombo_MaTen(["dropGT_LoaiDoiTuong", "dropDK_LoaiDoiTuong"], dtLoai, "-- Chọn loại đối tượng --");
            me.getList_GanThang();
            me.getList_DieuKien();
        });
        me.bind_GanThang();
        me.bind_DieuKien();
    },

    /*------------------------------------------
    --TAB 1: GÁN QUYỀN THẲNG
    -------------------------------------------*/
    bind_GanThang: function () {
        var me = this;
        me.pickerGT = PQ.pickerNguoiDung({
            txt: "txtGT_TimNguoiDung", btn: "btnGT_TimNguoiDung", drop: "dropGT_NguoiDung", hint: "hintGT_NguoiDung"
        });

        $("#btnSearch_GanThang").click(function () {
            me.getList_GanThang();
        });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $("#txtSearch_GanThang").on("keyup", function (e) {
            if (e.which === 13) me.getList_GanThang();
        });
        $("#btnAdd_GanThang").click(function () {
            me.popup_ThemGanThang();
        });
        $("#btnSave_GanThang").click(function () {
            me.save_GanThang();
        });
        $("#tblGanThang").delegate(".btnDelete", "click", function () {
            me.confirm_XoaGanThang($(this).attr("data-i"));
        });
    },

    _tenLoai: function (strMa) {
        return (PQ.has(this.mapLoai, strMa) && this.mapLoai[strMa]) ? this.mapLoai[strMa] : strMa;
    },
    _tenChucNang: function (strId) {
        return PQ.has(this.mapChucNang, strId) ? this.mapChucNang[strId].TEN : strId;
    },
    _nhanNguoiDung: function (row) {
        var o = PQ.nguoiDungCuaDong(row, 'NGUOIDUNG_ID');
        return PQ.nhanNguoiDung(o.TEN, o.TK, o.ID);
    },
    _hieuLuc: function (row) {
        return String(PQ.g(row, 'LOAI_HIEULUC')).toUpperCase();
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS, nguon_loai = THUCONG)
    -------------------------------------------*/
    getList_GanThang: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_GanThang'));
        PQ.call(me.API.GT_LAYDS, { 'strtukhoa': strTuKhoa, 'strnguon_loai': me.NGUON_LOAI }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.dtAll = data.Data || [];
            me.strTuKhoa = strTuKhoa;
            if (me.dtAll.length > 0 && PQ.g(me.dtAll[0], 'NGUON_ID') === '' && PQ.g(me.dtAll[0], 'NGUOIDUNG_ID') === '' && window.console) {
                console.warn('[quanlythutay] Response LayDS không có cột NGUON_ID/NGUOIDUNG_ID — các cột nhận được:', Object.keys(me.dtAll[0]));
            }
            if (!strTuKhoa) me.iTong = me.dtAll.length;
            $("#lblCount_GanThang").text((strTuKhoa && me.iTong !== undefined)
                ? me.dtAll.length + ' / ' + me.iTong + ' bản ghi'
                : me.dtAll.length + ' bản ghi');
            me.genTable_GanThang(me.dtAll);
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    genTable_GanThang: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGanThang",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Nguồn ID | 2 Người dùng | 3 Chức năng | 4 Phạm vi | 5 Hiệu lực | 6 Khoảng ngày | 7 Lan quyền xuống con | 8 Xóa
            colPos: {
                center: [0, 5, 7, 8]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(PQ.g(aData, 'NGUON_ID')) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.nguoiDungHtml(aData, 'NGUOIDUNG_ID', 'quanlythutay');
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.chucNangHtml(me.mapChucNang, PQ.g(aData, 'CHUCNANG_ID'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + PQ.esc(me._tenLoai(PQ.g(aData, 'LOAIDOITUONG_MA'))) + '</span> <span class="pq-sub">/</span> <span class="pq-mono">' + PQ.esc(PQ.g(aData, 'DOITUONG_ID')) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var h = me._hieuLuc(aData);
                        if (h === 'ALLOW') return '<span class="pq-pill pq-pill-allow">ALLOW</span>';
                        if (h === 'DENY') return '<span class="pq-pill pq-pill-deny">DENY</span>';
                        return '<span class="pq-pill pq-pill-grey">' + PQ.esc(h) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.khoangNgayHtml(PQ.g(aData, 'TUNGAY'), PQ.g(aData, 'DENNGAY'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.isTrue(PQ.g(aData, 'LAN_QUYEN_XUONG_CON')) ? 'Có (lan xuống con)' : 'Không';
                    }
                },
                {
                    // Khóa có 7 trường → nút Xóa tra theo chỉ số dòng trong dtAll
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnDelete" data-i="' + nRow + '" title="Thu hồi (xóa)"><i class="fa fa-trash color-active"></i></a>';
                    }
                }
            ]
        };
        PQ.veBang(jsonForm);
    },

    /*------------------------------------------
    --[2] Popup Gán quyền thẳng (chỉ Thêm — không có Sửa)
    -------------------------------------------*/
    resetForm_GanThang: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        edu.util.viewValById("txtGT_NguonId", "");
        me.pickerGT.reset();
        PQ.setDrop("dropGT_ChucNang", "");
        PQ.setDrop("dropGT_LoaiDoiTuong", "");
        edu.util.viewValById("txtGT_DoiTuong", "");
        me.pickGTDT.dong();
        PQ.setDrop("dropGT_HieuLuc", "");
        $("#chkGT_LanXuongCon").prop("checked", false);
        edu.util.viewValById("txtGT_TuNgay", "");
        edu.util.viewValById("txtGT_DenNgay", "");
        $("#titleGanThang").text("");
    },
    popup_ThemGanThang: function () {
        var me = this;
        me.resetForm_GanThang();
        $("#myModalGanThang").modal("show");
    },

    /*------------------------------------------
    --[3] Lưu (Them)
    -------------------------------------------*/
    save_GanThang: function () {
        var me = this;
        var strNguonId = $.trim(edu.util.getValById("txtGT_NguonId"));
        var strNd = me.pickerGT.layId();
        var strCn = edu.util.getValById("dropGT_ChucNang");
        var strLoai = edu.util.getValById("dropGT_LoaiDoiTuong");
        var strDoiTuong = $.trim(edu.util.getValById("txtGT_DoiTuong"));
        var strHl = edu.util.getValById("dropGT_HieuLuc");
        var strTu = $.trim(edu.util.getValById("txtGT_TuNgay"));
        var strDen = $.trim(edu.util.getValById("txtGT_DenNgay"));

        var strThieu = [];
        if (!strNguonId) strThieu.push("Mã lần gán");
        if (!strNd) strThieu.push("Người dùng");
        if (!strCn) strThieu.push("Chức năng");
        if (!strLoai) strThieu.push("Loại đối tượng");
        if (!strDoiTuong) strThieu.push("Mã đối tượng");
        if (!strHl) strThieu.push("Hiệu lực");
        if (strThieu.length > 0) {
            edu.system.alertOnModal({ type: "w", content: "Vui lòng nhập/chọn: " + strThieu.join(", ") + "." });
            return;
        }
        if (strTu && !edu.util.dateValid(strTu)) {
            edu.system.alertOnModal({ type: "w", content: "Ngày bắt đầu hiệu lực không hợp lệ (định dạng dd/mm/yyyy)." });
            return;
        }
        if (strDen && !edu.util.dateValid(strDen)) {
            edu.system.alertOnModal({ type: "w", content: "Ngày kết thúc hiệu lực không hợp lệ (định dạng dd/mm/yyyy)." });
            return;
        }
        if (strTu && strDen && PQ.parseNgay(strTu).getTime() > PQ.parseNgay(strDen).getTime()) {
            edu.system.alertOnModal({ type: "w", content: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc." });
            return;
        }

        var params = {
            'strnguon_loai': me.NGUON_LOAI,
            'strnguon_id': strNguonId,
            'strnguoidung_id': strNd,
            'strchucnang_id': strCn,
            'strloaidoituong_ma': strLoai,
            'strdoituong_id': strDoiTuong,
            'strloai_hieuluc': strHl,
            // Cột số của Oracle: luôn gửi 0/1, không gửi rỗng
            'dlan_quyen_xuong_con': $("#chkGT_LanXuongCon").is(":checked") ? 1 : 0,
            'strtungay': strTu,
            'strdenngay': strDen
        };
        PQ.call(me.API.GT_THEM, params, function (data) {
            if (PQ.ghiOk(data, params)) {   // BE có thể trả Success=false + Message = khóa/ID vừa ghi dù đã ghi thành công
                PQ.alertSauKhiDongModal("myModalGanThang", "Thêm mới thành công!");
                me.getList_GanThang();
            } else {
                edu.system.alertOnModal({ type: "w", content: data.Message });
            }
        }, function (er) {
            edu.system.alertOnModal({ type: "w", content: PQ.msgLoi(er) });
        });
    },

    /*------------------------------------------
    --[4] Xóa (thu hồi)
    -------------------------------------------*/
    confirm_XoaGanThang: function (strIdx) {
        var me = this;
        var row = me.dtAll[parseInt(strIdx, 10)];
        if (!row) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        edu.system.confirm("Bạn có chắc chắn muốn thu hồi (xóa) quyền thẳng của người dùng <b>" + PQ.esc(me._nhanNguoiDung(row))
            + "</b> trên chức năng <b>" + PQ.esc(me._tenChucNang(PQ.g(row, 'CHUCNANG_ID')))
            + "</b> (lần gán <b>" + PQ.esc(PQ.g(row, 'NGUON_ID')) + "</b>) không?");
        $("#btnYes").off("click.pqxoa").on("click.pqxoa", function () {
            me.delete_GanThang(row);
        });
    },
    delete_GanThang: function (row) {
        var me = this;
        // Gửi nguyên giá trị gốc của dòng để khớp đúng khóa 7 trường; response không kèm NGUON_LOAI thì dùng THUCONG của tab này
        var params = {
            'strnguon_loai': PQ.g(row, 'NGUON_LOAI') || me.NGUON_LOAI,
            'strnguon_id': PQ.g(row, 'NGUON_ID'),
            'strnguoidung_id': PQ.g(row, 'NGUOIDUNG_ID'),
            'strchucnang_id': PQ.g(row, 'CHUCNANG_ID'),
            'strloaidoituong_ma': PQ.g(row, 'LOAIDOITUONG_MA'),
            'strdoituong_id': PQ.g(row, 'DOITUONG_ID'),
            'strloai_hieuluc': PQ.g(row, 'LOAI_HIEULUC')
        };
        PQ.call(me.API.GT_XOA, params, function (data) {
            if (PQ.ghiOk(data, params)) {
                edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                me.getList_GanThang();
            } else {
                edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
            }
        }, function (er) {
            edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
        });
    },

    /*------------------------------------------
    --TAB 2: ĐIỀU KIỆN BỔ SUNG (pq_dieukien_bosung_*)
    -------------------------------------------*/
    bind_DieuKien: function () {
        var me = this;
        $("#btnSearch_DieuKien").click(function () {
            me.getList_DieuKien();
        });
        $("#txtSearch_DieuKien").on("keyup", function (e) {
            if (e.which === 13) me.getList_DieuKien();
        });
        // "Loại nguồn" là tham số của LayDS → đổi là tải lại từ BE
        $("#dropSearch_DK_NguonLoai").on("change", function () {
            me.getList_DieuKien();
        });
        $("#btnAdd_DieuKien").click(function () {
            me.popup_ThemDieuKien();
        });
        $("#btnSave_DieuKien").click(function () {
            me.save_DieuKien();
        });
        $("#tblDieuKienBoSung").delegate(".btnDelete", "click", function () {
            me.confirm_XoaDieuKien($(this).attr("data-id"));
        });
    },
    // Cảnh báo trong modal tab 2 (vùng thông báo riêng #notifyDK, khác #notify của modal Gán quyền thẳng)
    _canhBaoDK: function (strNoiDung) {
        edu.system.alertOnModal({ type: "w", content: strNoiDung, prePos: "#notifyDK" });
    },
    _findDK: function (strId) {
        var me = this;
        for (var i = 0; i < me.dtDK.length; i++) {
            if (PQ.g(me.dtDK[i], 'ID') == strId) return me.dtDK[i];
        }
        return null;
    },
    // "Hệ đào tạo (hedaotao) = SAU_DAI_HOC"
    _dieuKienText: function (row) {
        var me = this;
        var strMa = PQ.g(row, 'LOAIDOITUONG_MA');
        var strTen = me._tenLoai(strMa);
        return (strTen !== strMa ? strTen + " (" + strMa + ")" : strMa) + " = " + PQ.g(row, 'DOITUONG_ID');
    },
    _dieuKienHtml: function (row) {
        var me = this;
        var strMa = PQ.g(row, 'LOAIDOITUONG_MA');
        var strTen = me._tenLoai(strMa);
        return (strTen !== strMa
                ? '<span>' + PQ.esc(strTen) + '</span> <span class="pq-mono pq-sub">(' + PQ.esc(strMa) + ')</span>'
                : '<span class="pq-mono">' + PQ.esc(strMa) + '</span>')
            + ' <span class="pq-sub">=</span> <span class="pq-mono">' + PQ.esc(PQ.g(row, 'DOITUONG_ID')) + '</span>';
    },
    _lanGanText: function (row) {
        return PQ.g(row, 'NGUON_LOAI') + " / " + PQ.g(row, 'NGUON_ID');
    },

    getList_DieuKien: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_DieuKien'));
        var strNguonLoai = edu.util.getValById('dropSearch_DK_NguonLoai');
        PQ.call(me.API.DK_LAYDS, { 'strtukhoa': strTuKhoa, 'strnguon_loai': strNguonLoai }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.dtDK = data.Data || [];
            me.strTuKhoaDK = strTuKhoa;
            me.strNguonLoaiDK = strNguonLoai;
            if (me.dtDK.length > 0 && PQ.g(me.dtDK[0], 'ID') === '' && window.console) {
                console.warn('[quanlythutay] Response pq_dieukien_bosung_LayDS không có cột ID — các cột nhận được:', Object.keys(me.dtDK[0]));
            }
            if (!strTuKhoa && !strNguonLoai) me.iTongDK = me.dtDK.length;
            $("#lblCount_DieuKien").text(((strTuKhoa || strNguonLoai) && me.iTongDK !== undefined)
                ? me.dtDK.length + ' / ' + me.iTongDK + ' bản ghi'
                : me.dtDK.length + ' bản ghi');
            me.genTable_DieuKien(me.dtDK);
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    genTable_DieuKien: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDieuKienBoSung",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Gắn vào lần gán quyền | 2 Điều kiện | 3 Ghi chú | 4 Xóa
            colPos: {
                center: [0, 4]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(me._lanGanText(aData)) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._dieuKienHtml(aData);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.esc(PQ.g(aData, 'GHICHU'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnDelete" data-id="' + PQ.esc(PQ.g(aData, 'ID')) + '" title="Xóa"><i class="fa fa-trash color-active"></i></a>';
                    }
                }
            ]
        };
        PQ.veBang(jsonForm);
    },

    resetForm_DieuKien: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        PQ.setDrop("dropDK_NguonLoai", "");
        edu.util.viewValById("txtDK_NguonId", "");
        PQ.setDrop("dropDK_LoaiDoiTuong", "");
        edu.util.viewValById("txtDK_DoiTuong", "");
        me.pickDKDT.dong();
        edu.util.viewValById("txtDK_GhiChu", "");
        $("#titleDieuKien").text("");
    },
    popup_ThemDieuKien: function () {
        var me = this;
        me.resetForm_DieuKien();
        $("#myModalDieuKien").modal("show");
    },
    save_DieuKien: function () {
        var me = this;
        var strNguonLoai = edu.util.getValById("dropDK_NguonLoai");
        var strNguonId = $.trim(edu.util.getValById("txtDK_NguonId"));
        var strLoai = edu.util.getValById("dropDK_LoaiDoiTuong");
        var strDoiTuong = $.trim(edu.util.getValById("txtDK_DoiTuong"));
        var strGhiChu = $.trim(edu.util.getValById("txtDK_GhiChu"));

        var strThieu = [];
        if (!strNguonLoai) strThieu.push("Loại nguồn");
        if (!strNguonId) strThieu.push("Mã nguồn");
        if (!strLoai) strThieu.push("Loại đối tượng");
        if (!strDoiTuong) strThieu.push("Mã đối tượng");
        if (strThieu.length > 0) {
            me._canhBaoDK("Vui lòng nhập/chọn: " + strThieu.join(", ") + ".");
            return;
        }
        var params = {
            'strnguon_loai': strNguonLoai,
            'strnguon_id': strNguonId,
            'strloaidoituong_ma': strLoai,
            'strdoituong_id': strDoiTuong,
            'strghichu': strGhiChu      // Thêm: BE tự sinh strid nên không gửi
        };
        PQ.call(me.API.DK_THEM, params, function (data) {
            if (PQ.ghiOk(data, params)) {   // BE có thể trả Success=false + Message = khóa/ID vừa ghi dù đã ghi thành công
                PQ.alertSauKhiDongModal("myModalDieuKien", "Thêm mới thành công!");
                me.getList_DieuKien();
            } else {
                me._canhBaoDK(data.Message);
            }
        }, function (er) {
            me._canhBaoDK(PQ.msgLoi(er));
        });
    },
    confirm_XoaDieuKien: function (strId) {
        var me = this;
        if (!edu.util.checkValue(strId)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        var row = me._findDK(strId);
        var strMoTa = row
            ? "điều kiện <b>" + PQ.esc(me._dieuKienText(row)) + "</b> của lần gán <b>" + PQ.esc(me._lanGanText(row)) + "</b>"
            : "điều kiện <b>" + PQ.esc(strId) + "</b>";
        edu.system.confirm("Bạn có chắc chắn muốn xóa " + strMoTa + " không?");
        $("#btnYes").off("click.pqxoa").on("click.pqxoa", function () {
            me.delete_DieuKien(strId);
        });
    },
    delete_DieuKien: function (strId) {
        var me = this;
        PQ.call(me.API.DK_XOA, { 'strid': strId }, function (data) {
            if (PQ.ghiOk(data, [strId])) {
                edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                me.getList_DieuKien();
            } else {
                edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
            }
        }, function (er) {
            edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
        });
    }
};
