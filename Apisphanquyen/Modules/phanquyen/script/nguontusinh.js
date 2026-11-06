/*----------------------------------------------
--Màn hình : Nguồn tự sinh — Kênh 4 (dm_nguon_phamvi_nghiepvu)
--Hàm gọi  : PKG_CORE_QUANTRI_04.dm_nguon_phamvi_NV_LayDS / _LayTT / _Them / _Sua / _Xoa
--            + danh mục cho các ô chọn (qua pqcommon.js): chức năng (+ ứng dụng), loại đối tượng
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, ...) — nạp trước file này.
--Ghi chú  : - Khóa bản ghi là strid = "Mã nguồn" do người dùng NHẬP khi Thêm (khác Kênh 2/3: không tự sinh)
--             → khi Sửa khóa ô Mã nguồn.
--           - LayDS chỉ nhận strtukhoa (không phân trang) → bảng vẽ toàn bộ kết quả (nguồn khai báo rất ít).
--           - dlam_tuoi_phut là cột số của Oracle: luôn gửi số nguyên >= 1, không gửi rỗng.
--           - Tên cột response (ID, CHUCNANG_ID, LOAIDOITUONG_MA, NGUON_TRUYVAN, LAM_TUOI_PHUT) suy ra từ tên tham số
--             strid/strchucnang_id/strloaidoituong_ma/strnguon_truyvan/dlam_tuoi_phut — nếu BE trả tên khác, console sẽ cảnh báo.
----------------------------------------------*/
function NguonTuSinh() { };
NguonTuSinh.prototype = {
    dtAll: [],          // kết quả LayDS gần nhất
    mapChucNang: {},    // ID chức năng → {TEN, MA, UD, LABEL}
    mapLoai: {},        // mã loại đối tượng → tên
    strId_Sua: '',      // '' = đang Thêm mới; có giá trị = đang Sửa nguồn có mã này
    strTuKhoa: '',      // từ khóa của lần LayDS gần nhất
    iTong: undefined,   // tổng số bản ghi khi không lọc (để hiện "x / tổng")

    API: {
        LAYDS: { action: 'CMS_QuanTri04_MH/JSweLyY0Li8eMSkgLDcoHg8XHg0gOAUS', func: 'PKG_CORE_QUANTRI_04.dm_nguon_phamvi_NV_LayDS' },
        LAYTT: { action: 'CMS_QuanTri04_MH/JSweLyY0Li8eMSkgLDcoHg8XHg0gOBUV', func: 'PKG_CORE_QUANTRI_04.dm_nguon_phamvi_NV_LayTT' },
        THEM: { action: 'CMS_QuanTri04_MH/JSweLyY0Li8eMSkgLDcoHg8XHhUpJCwP', func: 'PKG_CORE_QUANTRI_04.dm_nguon_phamvi_NV_Them' },
        SUA: { action: 'CMS_QuanTri04_MH/JSweLyY0Li8eMSkgLDcoHg8XHhI0IAPP', func: 'PKG_CORE_QUANTRI_04.dm_nguon_phamvi_NV_Sua' },
        XOA: { action: 'CMS_QuanTri04_MH/JSweLyY0Li8eMSkgLDcoHg8XHhkuIAPP', func: 'PKG_CORE_QUANTRI_04.dm_nguon_phamvi_NV_Xoa' }
    },

    init: function () {
        var me = this;
        // Xuất Excel bằng chuẩn chung (edu.exporter)
        PQ.attachExport({
            table: 'tblNguonTuSinh', title: 'DANH SÁCH NGUỒN TỰ SINH', fileName: 'NguonTuSinh',
            subTitles: function () { return me.strTuKhoa ? ['Từ khóa: ' + me.strTuKhoa] : []; }
        });
        // Nạp song song 2 danh mục (đổ ô chọn + tra tên hiển thị trong bảng), xong mới tải danh sách.
        // Danh mục nào lỗi thì bảng hiện mã thay cho tên, màn hình vẫn dùng được.
        PQ.whenAll([PQ.loadChucNang, PQ.loadLoaiDoiTuong], function (kq) {
            var dtCn = kq[0], dtLoai = kq[1];
            me.mapLoai = PQ.mapOf(dtLoai, 'MA', 'TEN');
            me.mapChucNang = {};
            $.each(dtCn, function (i, r) { me.mapChucNang[r.ID] = r; });
            PQ.loadCombo(["dropNG_ChucNang"],
                $.map(dtCn, function (r) { return { ID: r.ID, TEN: r.LABEL }; }),
                "-- Chọn chức năng --");
            PQ.loadCombo_MaTen(["dropNG_LoaiDoiTuong"], dtLoai, "-- Chọn loại đối tượng --");
            me.getList_Nguon();
        });

        $("#btnSearch_Nguon").click(function () {
            me.getList_Nguon();
        });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $("#txtSearch_Nguon").on("keyup", function (e) {
            if (e.which === 13) me.getList_Nguon();
        });
        $("#btnAdd_Nguon").click(function () {
            me.popup_Them();
        });
        $("#btnSave_Nguon").click(function () {
            me.save_Nguon();
        });
        $("#tblNguonTuSinh").delegate(".btnEdit", "click", function () {
            me.popup_Sua($(this).attr("data-id"));
        });
        $("#tblNguonTuSinh").delegate(".btnDelete", "click", function () {
            me.confirm_Xoa($(this).attr("data-id"));
        });
    },

    /*------------------------------------------
    --Tiện ích riêng của màn hình
    -------------------------------------------*/
    _findRow: function (strId) {
        var me = this;
        for (var i = 0; i < me.dtAll.length; i++) {
            if (PQ.g(me.dtAll[i], 'ID') == strId) return me.dtAll[i];
        }
        return null;
    },
    _tenLoai: function (strMa) {
        return (PQ.has(this.mapLoai, strMa) && this.mapLoai[strMa]) ? this.mapLoai[strMa] : strMa;
    },
    _tenChucNang: function (strId) {
        return PQ.has(this.mapChucNang, strId) ? this.mapChucNang[strId].TEN : strId;
    },
    _loaiHtml: function (strMa) {
        var me = this;
        var strTen = me._tenLoai(strMa);
        return strTen !== strMa
            ? PQ.esc(strTen) + ' <span class="pq-mono pq-sub">(' + PQ.esc(strMa) + ')</span>'
            : '<span class="pq-mono">' + PQ.esc(strMa) + '</span>';
    },
    // "10 phút"; giá trị không phải số thì hiện nguyên
    _lamTuoiText: function (v) {
        return (v !== '' && /^\d+(\.\d+)?$/.test(String(v))) ? v + ' phút' : String(v);
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS)
    -------------------------------------------*/
    getList_Nguon: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_Nguon'));
        PQ.call(me.API.LAYDS, { 'strtukhoa': strTuKhoa }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.dtAll = data.Data || [];
            me.strTuKhoa = strTuKhoa;
            if (me.dtAll.length > 0 && PQ.g(me.dtAll[0], 'ID') === '' && window.console) {
                console.warn('[nguontusinh] Response LayDS không có cột ID — các cột nhận được:', Object.keys(me.dtAll[0]));
            }
            if (!strTuKhoa) me.iTong = me.dtAll.length;
            $("#lblCount_Nguon").text((strTuKhoa && me.iTong !== undefined)
                ? me.dtAll.length + ' / ' + me.iTong + ' bản ghi'
                : me.dtAll.length + ' bản ghi');
            me.genTable_Nguon(me.dtAll);
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    genTable_Nguon: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNguonTuSinh",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Sửa | 2 Mã nguồn | 3 Chức năng | 4 Loại đối tượng | 5 Làm tươi | 6 Xóa
            colPos: {
                center: [0, 1, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnEdit" data-id="' + PQ.esc(PQ.g(aData, 'ID')) + '" title="Sửa"><i class="fa fa-edit color-active"></i></a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(PQ.g(aData, 'ID')) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.chucNangHtml(me.mapChucNang, PQ.g(aData, 'CHUCNANG_ID'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._loaiHtml(PQ.g(aData, 'LOAIDOITUONG_MA'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.esc(me._lamTuoiText(PQ.g(aData, 'LAM_TUOI_PHUT')));
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

    /*------------------------------------------
    --[2] Popup Thêm / Sửa
    -------------------------------------------*/
    resetForm: function () {
        var me = this;
        me.strId_Sua = '';
        $("#btnNotifyModal").remove();
        edu.util.viewValById("txtNG_Ma", "");
        PQ.setDrop("dropNG_ChucNang", "");
        PQ.setDrop("dropNG_LoaiDoiTuong", "");
        edu.util.viewValById("txtNG_TruyVan", "");
        edu.util.viewValById("txtNG_LamTuoiPhut", "");
        $("#txtNG_Ma").prop("disabled", false);
        $("#titleNguon").text("");
    },
    popup_Them: function () {
        var me = this;
        me.resetForm();
        $("#titleAction_Nguon").text("Thêm");
        $("#myModalNguon").modal("show");
    },
    // Lấy chi tiết bằng LayTT; lỗi hoặc rỗng thì dùng dòng đã có trong danh sách
    popup_Sua: function (strId) {
        var me = this;
        if (!edu.util.checkValue(strId)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        var rowCache = me._findRow(strId);
        PQ.call(me.API.LAYTT, { 'strid': strId }, function (data) {
            var d = data.Data;
            if ($.isArray(d)) d = d[0];
            if (data.Success && d && PQ.g(d, 'ID') !== '') {
                me.openForm_Sua(d);
            } else {
                if (window.console) console.warn('[nguontusinh] LayTT không trả dữ liệu cho mã "' + strId + '" — dùng dòng trong danh sách.', data);
                me.openForm_Sua(rowCache);
            }
        }, function (er) {
            if (window.console) console.warn('[nguontusinh] LayTT lỗi — dùng dòng trong danh sách.', er);
            me.openForm_Sua(rowCache);
        });
    },
    openForm_Sua: function (row) {
        var me = this;
        if (!row) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        me.resetForm();
        var strId = PQ.g(row, 'ID');
        me.strId_Sua = strId;
        edu.util.viewValById("txtNG_Ma", strId);
        PQ.setDrop("dropNG_ChucNang", PQ.g(row, 'CHUCNANG_ID'));
        PQ.setDrop("dropNG_LoaiDoiTuong", PQ.g(row, 'LOAIDOITUONG_MA'));
        edu.util.viewValById("txtNG_TruyVan", PQ.g(row, 'NGUON_TRUYVAN'));
        edu.util.viewValById("txtNG_LamTuoiPhut", PQ.g(row, 'LAM_TUOI_PHUT'));
        $("#txtNG_Ma").prop("disabled", true);
        $("#titleAction_Nguon").text("Sửa");
        $("#titleNguon").text(strId + " — " + me._tenChucNang(PQ.g(row, 'CHUCNANG_ID')));
        $("#myModalNguon").modal("show");
    },

    /*------------------------------------------
    --[3] Lưu (Them / Sua)
    -------------------------------------------*/
    save_Nguon: function () {
        var me = this;
        var bSua = !!me.strId_Sua;
        var strId = bSua ? me.strId_Sua : $.trim(edu.util.getValById("txtNG_Ma"));
        var strCn = edu.util.getValById("dropNG_ChucNang");
        var strLoai = edu.util.getValById("dropNG_LoaiDoiTuong");
        var strSql = $.trim(edu.util.getValById("txtNG_TruyVan"));
        var strPhut = $.trim(edu.util.getValById("txtNG_LamTuoiPhut"));

        var strThieu = [];
        if (!strId) strThieu.push("Mã nguồn");
        if (!strCn) strThieu.push("Chức năng");
        if (!strLoai) strThieu.push("Loại đối tượng");
        if (!strSql) strThieu.push("Câu truy vấn đồng bộ");
        if (!strPhut) strThieu.push("Chu kỳ làm tươi (phút)");
        if (strThieu.length > 0) {
            edu.system.alertOnModal({ type: "w", content: "Vui lòng nhập/chọn: " + strThieu.join(", ") + "." });
            return;
        }
        if (!/^\d+$/.test(strPhut) || parseInt(strPhut, 10) < 1) {
            edu.system.alertOnModal({ type: "w", content: "Chu kỳ làm tươi phải là số nguyên từ 1 phút trở lên." });
            return;
        }

        var params = {
            'strid': strId,
            'strchucnang_id': strCn,
            'strloaidoituong_ma': strLoai,
            'strnguon_truyvan': strSql,
            // Cột số của Oracle: luôn gửi số nguyên, không gửi rỗng/chuỗi
            'dlam_tuoi_phut': parseInt(strPhut, 10)
        };
        PQ.call(bSua ? me.API.SUA : me.API.THEM, params, function (data) {
            if (PQ.ghiOk(data, params)) {   // BE có thể trả Success=false + Message = mã vừa ghi dù đã ghi thành công
                PQ.alertSauKhiDongModal("myModalNguon", bSua ? "Cập nhật thành công!" : "Thêm mới thành công!");
                me.getList_Nguon();
            } else {
                edu.system.alertOnModal({ type: "w", content: data.Message });
            }
        }, function (er) {
            edu.system.alertOnModal({ type: "w", content: PQ.msgLoi(er) });
        });
    },

    /*------------------------------------------
    --[4] Xóa
    -------------------------------------------*/
    confirm_Xoa: function (strId) {
        var me = this;
        if (!edu.util.checkValue(strId)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        var row = me._findRow(strId);
        var strMoTa = row ? " (chức năng " + me._tenChucNang(PQ.g(row, 'CHUCNANG_ID')) + ")" : "";
        edu.system.confirm("Bạn có chắc chắn muốn xóa nguồn tự sinh <b>" + PQ.esc(strId) + "</b>" + PQ.esc(strMoTa) + " không?");
        $("#btnYes").off("click.pqxoa").on("click.pqxoa", function () {
            me.delete_Nguon(strId);
        });
    },
    delete_Nguon: function (strId) {
        var me = this;
        PQ.call(me.API.XOA, { 'strid': strId }, function (data) {
            if (PQ.ghiOk(data, [strId])) {
                edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                me.getList_Nguon();
            } else {
                edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
            }
        }, function (er) {
            edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
        });
    }
};
