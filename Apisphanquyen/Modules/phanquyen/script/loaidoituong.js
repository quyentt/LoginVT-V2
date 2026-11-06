/*----------------------------------------------
--Màn hình : Loại đối tượng (dm_loaidoituong)
--Hàm gọi  : PKG_CORE_QUANTRI_04.dm_loaidoituong_LayDS / _LayTT / _Them / _Sua / _Xoa
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, ...) — nạp trước file này.
--Ghi chú  : Khóa bản ghi là strma (mã) nên khi Sửa không cho đổi mã.
--           Tên cột trong response (MA, TEN, BANG_NGUON, COT_ID) là suy ra từ tên tham số
--           strma/strten/strbang_nguon/strcot_id — nếu BE trả tên khác, console sẽ cảnh báo.
----------------------------------------------*/
function LoaiDoiTuong() { };
LoaiDoiTuong.prototype = {
    dtLoaiDoiTuong: [],
    strMa_Sua: '',      // '' = đang Thêm mới; có giá trị = đang Sửa bản ghi có mã này
    iTong: undefined,   // tổng số bản ghi khi không lọc (để hiện "x / tổng")

    API: {
        LAYDS: { action: 'CMS_QuanTri04_MH/JSweLS4gKCUuKDU0Li8mHg0gOAUS', func: 'PKG_CORE_QUANTRI_04.dm_loaidoituong_LayDS' },
        LAYTT: { action: 'CMS_QuanTri04_MH/JSweLS4gKCUuKDU0Li8mHg0gOBUV', func: 'PKG_CORE_QUANTRI_04.dm_loaidoituong_LayTT' },
        THEM: { action: 'CMS_QuanTri04_MH/JSweLS4gKCUuKDU0Li8mHhUpJCwP', func: 'PKG_CORE_QUANTRI_04.dm_loaidoituong_Them' },
        SUA: { action: 'CMS_QuanTri04_MH/JSweLS4gKCUuKDU0Li8mHhI0IAPP', func: 'PKG_CORE_QUANTRI_04.dm_loaidoituong_Sua' },
        XOA: { action: 'CMS_QuanTri04_MH/JSweLS4gKCUuKDU0Li8mHhkuIAPP', func: 'PKG_CORE_QUANTRI_04.dm_loaidoituong_Xoa' }
    },

    init: function () {
        var me = this;
        // Xuất Excel bằng chuẩn chung (edu.exporter): đúng cột + dòng bảng đang hiển thị
        PQ.attachExport({
            table: 'tblLoaiDoiTuong', title: 'DANH SÁCH LOẠI ĐỐI TƯỢNG', fileName: 'LoaiDoiTuong',
            subTitles: function () { return me.strTuKhoa ? ['Từ khóa: ' + me.strTuKhoa] : []; }
        });
        me.getList_LoaiDoiTuong();

        $("#btnSearch_LoaiDoiTuong").click(function () {
            me.getList_LoaiDoiTuong();
        });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $("#txtSearch_LoaiDoiTuong").on("keyup", function (e) {
            if (e.which === 13) me.getList_LoaiDoiTuong();
        });
        $("#btnAdd_LoaiDoiTuong").click(function () {
            me.popup_Them();
        });
        $("#btnSave_LoaiDoiTuong").click(function () {
            me.save_LoaiDoiTuong();
        });
        $("#tblLoaiDoiTuong").delegate(".btnEdit", "click", function () {
            me.popup_Sua($(this).attr("data-ma"));
        });
        $("#tblLoaiDoiTuong").delegate(".btnDelete", "click", function () {
            me.confirm_Xoa($(this).attr("data-ma"));
        });
    },

    /*------------------------------------------
    --Tiện ích dùng chung trong màn hình
    -------------------------------------------*/
    _findRow: function (strMa) {
        var me = this;
        for (var i = 0; i < me.dtLoaiDoiTuong.length; i++) {
            if (PQ.g(me.dtLoaiDoiTuong[i], 'MA') == strMa) return me.dtLoaiDoiTuong[i];
        }
        return null;
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS)
    -------------------------------------------*/
    getList_LoaiDoiTuong: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_LoaiDoiTuong'));
        PQ.call(me.API.LAYDS, { 'strtukhoa': strTuKhoa }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            var dt = data.Data || [];
            me.dtLoaiDoiTuong = dt;
            me.strTuKhoa = strTuKhoa;   // để nút Xuất Excel ghi điều kiện tìm kiếm
            if (dt.length > 0 && PQ.g(dt[0], 'MA') === '' && window.console) {
                console.warn('[loaidoituong] Response LayDS không có cột MA — các cột nhận được:', Object.keys(dt[0]));
            }
            if (!strTuKhoa) me.iTong = dt.length;
            $("#lblCount_LoaiDoiTuong").text((strTuKhoa && me.iTong !== undefined)
                ? dt.length + ' / ' + me.iTong + ' bản ghi'
                : dt.length + ' bản ghi');
            me.genTable_LoaiDoiTuong(dt);
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    genTable_LoaiDoiTuong: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLoaiDoiTuong",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Sửa | 2 Mã | 3 Tên | 4 Bảng nguồn | 5 Cột khóa chính | 6 Xóa
            // Căn giữa cả 7 cột để dữ liệu thẳng hàng với tiêu đề (tiêu đề của shell căn giữa)
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnEdit" data-ma="' + PQ.esc(PQ.g(aData, 'MA')) + '" title="Sửa"><i class="fa fa-edit color-active"></i></a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(PQ.g(aData, 'MA')) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.esc(PQ.g(aData, 'TEN'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(PQ.g(aData, 'BANG_NGUON')) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(PQ.g(aData, 'COT_ID')) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnDelete" data-ma="' + PQ.esc(PQ.g(aData, 'MA')) + '" title="Xóa"><i class="fa fa-trash color-active"></i></a>';
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
        me.strMa_Sua = '';
        $("#btnNotifyModal").remove();
        edu.util.viewValById("txtLDT_Ma", "");
        edu.util.viewValById("txtLDT_Ten", "");
        edu.util.viewValById("txtLDT_BangNguon", "");
        edu.util.viewValById("txtLDT_CotKhoaChinh", "");
        $("#txtLDT_Ma").prop("disabled", false);
        $("#titleLoaiDoiTuong").text("");
    },
    popup_Them: function () {
        var me = this;
        me.resetForm();
        $("#titleAction_LoaiDoiTuong").text("Thêm");
        $("#myModalLoaiDoiTuong").modal("show");
    },
    // Lấy chi tiết bằng LayTT; lỗi hoặc rỗng thì dùng dòng đã có trong danh sách
    popup_Sua: function (strMa) {
        var me = this;
        var rowCache = me._findRow(strMa);
        if (!edu.util.checkValue(strMa)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        PQ.call(me.API.LAYTT, { 'strma': strMa }, function (data) {
            var d = data.Data;
            if ($.isArray(d)) d = d[0];
            if (data.Success && d && PQ.g(d, 'MA') !== '') {
                me.openForm_Sua(d);
            } else {
                if (window.console) console.warn('[loaidoituong] LayTT không trả dữ liệu cho mã "' + strMa + '" — dùng dòng trong danh sách.', data);
                me.openForm_Sua(rowCache);
            }
        }, function (er) {
            if (window.console) console.warn('[loaidoituong] LayTT lỗi — dùng dòng trong danh sách.', er);
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
        var strMa = PQ.g(row, 'MA');
        var strTen = PQ.g(row, 'TEN');
        me.strMa_Sua = strMa;
        edu.util.viewValById("txtLDT_Ma", strMa);
        edu.util.viewValById("txtLDT_Ten", strTen);
        edu.util.viewValById("txtLDT_BangNguon", PQ.g(row, 'BANG_NGUON'));
        edu.util.viewValById("txtLDT_CotKhoaChinh", PQ.g(row, 'COT_ID'));
        $("#txtLDT_Ma").prop("disabled", true);
        $("#titleAction_LoaiDoiTuong").text("Sửa");
        $("#titleLoaiDoiTuong").text(strTen + " (" + strMa + ")");
        $("#myModalLoaiDoiTuong").modal("show");
    },

    /*------------------------------------------
    --[3] Lưu (Them / Sua)
    -------------------------------------------*/
    save_LoaiDoiTuong: function () {
        var me = this;
        var bSua = !!me.strMa_Sua;
        var strMa = bSua ? me.strMa_Sua : $.trim(edu.util.getValById("txtLDT_Ma"));
        var strTen = $.trim(edu.util.getValById("txtLDT_Ten"));
        var strBangNguon = $.trim(edu.util.getValById("txtLDT_BangNguon"));
        var strCotId = $.trim(edu.util.getValById("txtLDT_CotKhoaChinh"));

        var strThieu = [];
        if (!strMa) strThieu.push("Mã loại đối tượng");
        if (!strTen) strThieu.push("Tên hiển thị");
        if (!strBangNguon) strThieu.push("Bảng nguồn");
        if (!strCotId) strThieu.push("Cột khóa chính");
        if (strThieu.length > 0) {
            edu.system.alertOnModal({ type: "w", content: "Vui lòng nhập: " + strThieu.join(", ") + "." });
            return;
        }

        var params = { 'strma': strMa, 'strten': strTen, 'strbang_nguon': strBangNguon, 'strcot_id': strCotId };
        PQ.call(bSua ? me.API.SUA : me.API.THEM, params, function (data) {
            if (PQ.ghiOk(data, [strMa])) {   // BE có thể trả Success=false + Message = mã vừa ghi dù đã ghi thành công
                PQ.alertSauKhiDongModal("myModalLoaiDoiTuong", bSua ? "Cập nhật thành công!" : "Thêm mới thành công!");
                me.getList_LoaiDoiTuong();
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
    confirm_Xoa: function (strMa) {
        var me = this;
        if (!edu.util.checkValue(strMa)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        var row = me._findRow(strMa);
        var strTen = row ? PQ.g(row, 'TEN') : '';
        var strNhan = strTen ? strTen + " (" + strMa + ")" : strMa;
        edu.system.confirm("Bạn có chắc chắn muốn xóa loại đối tượng <b>" + PQ.esc(strNhan) + "</b> không?");
        $("#btnYes").off("click.pqxoa").on("click.pqxoa", function () {
            me.delete_LoaiDoiTuong(strMa);
        });
    },
    delete_LoaiDoiTuong: function (strMa) {
        var me = this;
        PQ.call(me.API.XOA, { 'strma': strMa }, function (data) {
            if (PQ.ghiOk(data, [strMa])) {
                edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                me.getList_LoaiDoiTuong();
            } else {
                edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
            }
        }, function (er) {
            edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
        });
    }
};
