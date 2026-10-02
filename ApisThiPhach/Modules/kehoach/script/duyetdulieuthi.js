/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DuLieuThi() { };
DuLieuThi.prototype = {
    strDuLieuThi_Id: '',
    dtDuLieuThi: [],
    dtXacNhan: [],
    dtDanhSachThi: [],
    strLopHocPhan_Id: '',
    bcheck: '',
    arrChecked_Id: [],
    MAX_SELECTED: 500,
    BATCH_SIZE: 30,

    /*------------------------------------------
    --Discription: Sanity-check chống chọn quá lớn (10000+). Trong luồng bình thường
    --             đã có batching nên giới hạn này hiếm khi chạm.
    -------------------------------------------*/
    checkSelectionLimit: function (elementId, label) {
        var val = $("#" + elementId).val();
        var count = 0;
        if (Array.isArray(val)) {
            count = val.filter(function (x) { return x !== "" && x != null; }).length;
        } else if (typeof val === "string" && val.length > 0) {
            count = val.split(",").filter(function (x) { return x !== ""; }).length;
        }
        if (count > this.MAX_SELECTED) {
            edu.system.alert(
                "Bạn đã chọn " + count + " " + label +
                ", vượt ngưỡng tối đa " + this.MAX_SELECTED +
                ". Vui lòng bỏ bớt lựa chọn để tránh quá tải.",
                "w"
            );
            return false;
        }
        return true;
    },

    /*------------------------------------------
    --Discription: Chia 1 mảng ID dài thành các batch nhỏ rồi gọi API song song,
    --             gộp data.Data từ tất cả batch trước khi gọi onComplete.
    --             Tránh URL vượt 2048 ký tự khi user chọn rất nhiều mục.
    --Params:
    --   idArray         : mảng ID cần chia (rỗng hoặc null = 1 batch chuỗi rỗng)
    --   batchSize       : số ID tối đa mỗi batch
    --   requestBuilder  : (idStr) => config truyền cho edu.system.makeRequest
    --   onComplete      : (allData) => xử lý kết quả gộp
    --   dedupeKey       : (tùy chọn) tên field để loại trùng (vd "ID")
    -------------------------------------------*/
    loadInBatches: function (idArray, batchSize, requestBuilder, onComplete, dedupeKey) {
        var batches = [];
        if (!idArray || idArray.length === 0) {
            batches.push("");
        } else {
            for (var i = 0; i < idArray.length; i += batchSize) {
                batches.push(idArray.slice(i, i + batchSize).join(","));
            }
        }
        var aggregated = [];
        var done = 0;
        var firstError = null;
        function finish() {
            if (firstError) edu.system.alert("Lỗi tải dữ liệu: " + firstError, "w");
            if (dedupeKey) {
                var seen = {};
                aggregated = aggregated.filter(function (item) {
                    var k = item[dedupeKey];
                    if (k == null) return true;
                    if (seen[k]) return false;
                    seen[k] = true;
                    return true;
                });
            }
            onComplete(aggregated);
        }
        batches.forEach(function (idStr) {
            var cfg = requestBuilder(idStr);
            cfg.success = function (data) {
                if (data && data.Success) {
                    if (Array.isArray(data.Data)) aggregated = aggregated.concat(data.Data);
                } else if (data && !data.Success && !firstError) {
                    firstError = data.Message || "Server trả về Success=false";
                }
                done++;
                if (done === batches.length) finish();
            };
            cfg.error = function (er) {
                if (!firstError) firstError = JSON.stringify(er);
                done++;
                if (done === batches.length) finish();
            };
            edu.system.makeRequest(cfg, false, false, false, null);
        });
    },

    /*------------------------------------------
    --Discription: Chuẩn hóa giá trị select2 multi-select thành mảng ID lọc rỗng.
    -------------------------------------------*/
    getMultiVal: function (elementId) {
        var raw = $("#" + elementId).val();
        var arr = Array.isArray(raw) ? raw : (raw ? raw.toString().split(",") : []);
        return arr.filter(function (x) { return x !== "" && x != null; });
    },

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGianDaoTao();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_btnCongBo();
        me.getList_KeHoach();
        me.getList_HocPhan();
        me.getList_ThanhPhanDiem();
        me.getList_ThoiGian();
        me.getList_LoaiDiem();

        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_HocPhan();
            //me.getList_DuLieuThi();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            //me.getList_DuLieuThi();
        });
        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_SinhVien();
        });

        $("#btnSearch").click(function () {
            if (!me.checkSelectionLimit('dropSearch_ThoiGianDaoTao', 'thời gian đào tạo')) return;
            if (!me.checkSelectionLimit('dropSearch_HeDaoTao', 'hệ đào tạo')) return;
            if (!me.checkSelectionLimit('dropSearch_KhoaDaoTao', 'khóa đào tạo')) return;
            if (!me.checkSelectionLimit('dropSearch_KeHoach', 'kế hoạch')) return;
            me.getList_DuLieuThi();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                if (!me.checkSelectionLimit('dropSearch_ThoiGianDaoTao', 'thời gian đào tạo')) return;
                if (!me.checkSelectionLimit('dropSearch_HeDaoTao', 'hệ đào tạo')) return;
                if (!me.checkSelectionLimit('dropSearch_KhoaDaoTao', 'khóa đào tạo')) return;
                if (!me.checkSelectionLimit('dropSearch_KeHoach', 'kế hoạch')) return;
                me.getList_DuLieuThi();
            }
        });
        $("#btnTaoDuLieu").click(function () {
            //me.dtDuLieuThi.forEach(e => me.dtThanhPhanDiem.forEach(ele => me.save_DuLieuThi(e.ID, ele.ID)));
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblDuLieuThi tbody .checkPhanQuyen");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    arrThem.push(x[i]);
                    //if ($(x[i]).attr("name") == undefined) {
                    //    arrThem.push(x[i]);
                    //} else {
                    //    var inputcheck = $("#" + x[i].id.replace("chkSelect_", "inputSoThang_"));
                    //    if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
                    //}
                }
                //else {
                //    if ($(x[i]).attr("name") != undefined) {
                //        arrXoa.push($(x[i]).attr("name"));
                //    }
                //}
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn tạo " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="divprogessdata"></div>');
                    edu.system.genHTML_Progress("divprogessdata", (arrThem.length + arrXoa.length));
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.save_DuLieuThi(arrXoa[i]);
                    }
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_DuLieuThi(arrThem[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnHuyDuLieu").click(function () {
            //me.dtDuLieuThi.forEach(e => me.dtThanhPhanDiem.forEach(ele => me.save_DuLieuThi(e.ID, ele.ID)));
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblDuLieuThi tbody .checkPhanQuyen");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    arrThem.push(x[i]);
                    //if ($(x[i]).attr("name") == undefined) {
                    //    arrThem.push(x[i]);
                    //} else {
                    //    var inputcheck = $("#" + x[i].id.replace("chkSelect_", "inputSoThang_"));
                    //    if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
                    //}
                }
                //else {
                //    if ($(x[i]).attr("name") != undefined) {
                //        arrXoa.push($(x[i]).attr("name"));
                //    }
                //}
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn tạo " + arrXoa.length + " và hủy " + arrThem.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="divprogessdata"></div>');
                    edu.system.genHTML_Progress("divprogessdata", (arrThem.length + arrXoa.length));
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_DuLieuThi(arrXoa[i]);
                    }
                    for (var i = 0; i < arrThem.length; i++) {
                        me.delete_DuLieuThi(arrThem[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnSaveHanNopDiem").click(function () {
            //me.dtDuLieuThi.forEach(e => me.dtThanhPhanDiem.forEach(ele => me.save_DuLieuThi(e.ID, ele.ID)));
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblDuLieuThi tbody .hannopdiem");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).attr("name") != $(x[i]).val()) {
                    arrThem.push(x[i]);
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="divprogessdata"></div>');
                    edu.system.genHTML_Progress("divprogessdata", (arrThem.length + arrXoa.length));
                    
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_HanNopDiem(arrThem[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });
        $("#tblDuLieuThi").delegate(".chkSelectAll", "click", function (e) {

            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblDuLieuThi").delegate(".btnXemDanhSach", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_edit();
                me.viewForm_DuLieuThi(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#chkSelectAll_SinhVien").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
        });

        $("#btnSave_TrangThai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");
            var strData = "";
            arrChecked_Id.forEach(e => strData += "," + e + me.strLopHocPhan_Id + $("#dropSearch_LoaiDiem").val());
            if (strData != "") strData = strData.substring(1);
            me.getList_XacNhan(strData, "tblModal_XacNhan");
        });
        me.getList_TinhTrang();
        //edu.system.loadToCombo_DanhMucDuLieu("QLHLTL.TINHTRANGDANGKY", "", "", me.loadBtnXacNhan);
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            $("#modal_XacNhan").modal("hide");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanTN(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });

        $('#dropSearch_ThoiGian').on('select2:select', function (e) {
            me.getList_LoaiDiem();
            me.getList_DotThi();
        });
        $('#dropSearch_ChuongTrinh_CC').on('select2:select', function (e) {
            me.getList_DanhSachThi();
        });
        $('#dropSearch_ThoiGianDaoTao').on('select2:select', function (e) {
            me.getList_KeHoach();
        });

        $('#dropSearch_LoaiDiem_CC').on('select2:select', function (e) {
            me.getList_DotThi();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {
            me.getList_HocPhan_CC();
            me.getList_DanhSachThi();
        });
        $('#dropSearch_HocPhan_CC').on('select2:select', function (e) {
            me.getList_DanhSachThi();
        });
        $("#zoneBtnCongBo").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungCongBo");
            $("#modal_CongBo").modal('hide');
            var arrChecked_Id = me.arrChecked_Id;
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);

            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_CongBo(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
        $("#btnCongBoDotThi").click(function () {
            me.bcheck = 'TP_CongBoLichThi/Them_CongBoLichThi_DotThi';
            var arrChecked_Id = $("#dropSearch_DotThi").val();
            if (!arrChecked_Id || arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đợt thi!");
                return;
            }
            me.arrChecked_Id = arrChecked_Id;
            $("#modal_CongBo").modal("show");

            me.getList_CongBo(arrChecked_Id.toString(), "tblModal_CongBo");
        });
        $("#btnCongBoDanhSachThi").click(function () {
            me.bcheck = 'TP_CongBoLichThi/Them_QLTHI_CongBoLichThi';
            var arrChecked_Id = [];
            $("#tblDanhSachThi tbody .checkDSThi:checked").each(function () {
                arrChecked_Id.push(this.id.replace("checkDSThi_", ""));
            });
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn danh sách thi!");
                return;
            }
            me.arrChecked_Id = arrChecked_Id;
            $("#modal_CongBo").modal("show");

            me.getList_CongBo(arrChecked_Id.toString(), "tblModal_CongBo");
        });
        $("#btnSearch_DanhSachThi").click(function () {
            me.getList_DanhSachThi();
        });
        $('#dropSearch_TrangThaiCongBo').on('change', function () {
            me.renderTable_DanhSachThi();
        });
        $('#chkChuaCongBo').on('change', function () {
            me.renderTable_DanhSachThi();
        });
        $("#chkSelectAll_DanhSachThi").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDanhSachThi" });
        });
        $("#btnCongBoHocPhan").click(function () {
            me.bcheck = 'TP_CongBoLichThi/Them_CongBoLichThi_HocPhan';
            var arrChecked_Id = $("#dropSearch_HocPhan_CC").val();
            if (!arrChecked_Id || arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn học phần!");
                return;
            }
            me.arrChecked_Id = arrChecked_Id;
            $("#modal_CongBo").modal("show");
            me.getList_CongBo(arrChecked_Id.toString(), "tblModal_CongBo");

        });
        $("#btnCongBo").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneCongBo");
        });
        
        $("#tblDuLieuThi").delegate('.detail_CongThuc', 'mouseenter', function (e) {
            var point = this;
            var row = $(point).attr("name");
            console.log(row);
            $(point).popover({
                container: 'body',
                content: row,
                trigger: 'hover',
                html: true,
                placement: 'right',
            });
            $(point).popover('show');
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
           // me.getList_ChuongTrinhDaoTao();
            ////me.getList_LopQuanLy();
          //  me.getList_HocPhan();
            me.resetCombobox(this);
        });

        $("#btnGoLeft").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var element = document.getElementById("table-container");
            element.scrollLeft -= 200;
            $("#table-container").focus();
        })
        $("#btnGoRight").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var element = document.getElementById("table-container");
            element.scrollLeft += 200;
            $("#table-container").focus();
        })
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strDuLieuThi_Id = "";
        edu.util.viewValById("dropThoiGian", edu.util.getValById("dropSearch_ThoiGian"));
        edu.util.viewValById("dropHoatDong", edu.util.getValById("dropSearch_HoatDong"));
        edu.util.viewValById("dropDiaDiem", edu.util.getValById("dropSearch_DiaDiem"));
        edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtHeSo", "");
    },

    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    loadBtnXacNhan: function (data) {
        main_doc.DuLieuThi.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSDangKy_KeHoachDangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_KeHoach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HocPhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSHocPhanTheoKeHoach',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocPhan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                mRender: function (nRow, aData) {
                    return aData.MA + " - " + aData.TEN; 
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThanhPhanDiem: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSThanhPhanDiemThi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThanhPhanDiem"] = dtReRult;
                    var html = "";
                    dtReRult.forEach(e => {
                        html += '<th class="td-center">' + edu.util.returnEmpty(e.TEN) + ' <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + e.ID + '" /></th>';
                    });
                    $("#zTPToChuc").html(html);
                    document.getElementById("lblThanhPhanToChuc").colSpan = dtReRult.length;
                    me.genCombo_LoaiDiem(dtReRult)
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DuLieuThi: function (point) {
        var me = this;
        var strId = point.id.split('_')
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_ToChucThi_MH/FSk0IgkoJC8VIC4FNA0oJDQNKCIpFSko',
            'func': 'pkg_thi_tochucthi.ThucHienTaoDuLieuLichThi',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strId[1],
            'strDiem_ThanhPhanDiem_Id': strId[2],
            'dChiTaoDuLieuDuDKThi': edu.system.getValById('dropSearch_LoaiXepLich'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'NS_HeSo_DuLieuThi/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    //me.getList_DuLieuThi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("divprogessdata", function () {
                    me.getList_DuLieuThi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DuLieuThi: function (point) {
        var me = this;
        var strId = point.id.split('_')
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TP_ToChucThi/ThucHienHuyDuLieuLichThi',
            'type': 'POST',
            'strDaoTao_LopHocPhan_Id': strId[1],
            'strDiem_ThanhPhanDiem_Id': strId[2],
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'NS_HeSo_DuLieuThi/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    //me.getList_DuLieuThi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("divprogessdata", function () {
                    me.getList_DuLieuThi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_HanNopDiem: function (point) {
        var me = this;
        var strId = point.id.split('_')
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TP_ToChucThi/CapNhatHanNopDiemTheoLop',
            'type': 'POST',
            'strDaoTao_LopHocPhan_Id': strId[1],
            'strNguoiThucHien_Id': edu.system.userId,
            'strHanNopDiem': edu.util.getValById('inputHanNopDiem_' + strId[1]),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    //me.getList_DuLieuThi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("divprogessdata", function () {
                    me.getList_DuLieuThi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DuLieuThi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSLopHocPhan',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_HeDaoTao_Id  ': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDuLieuThi = dtReRult;
                    me.genTable_DuLieuThi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    //delete_DuLieuThi: function (Ids) {
    //    var me = this;
    //    //--Edit
    //    var obj_delete = {
    //        'action': 'NS_HeSo_DuLieuThi/Xoa',
            
    //        'strIds': Ids,
    //        'strChucNang_Id': edu.system.strChucNang_Id,
    //        'strNguoiThucHien_Id': edu.system.userId
    //    };
    //    //default
    //    edu.system.makeRequest({
    //        success: function (data) {
    //            if (data.Success) {
    //                obj = {
    //                    title: "",
    //                    content: "Xóa dữ liệu thành công!",
    //                    code: ""
    //                };
    //                edu.system.afterComfirm(obj);
    //            }
    //            else {
    //                obj = {
    //                    title: "",
    //                    content: obj_delete + ": " + data.Message,
    //                    code: "w"
    //                };
    //                edu.system.afterComfirm(obj);
    //            }
                
    //        },
    //        error: function (er) {
                
    //            obj = {
    //                title: "",
    //                content: obj_delete + ": " + JSON.stringify(er),
    //                code: "w"
    //            };
    //            edu.system.afterComfirm(obj);
    //        },
    //        type: "POST",
    //        action: obj_delete.action,

    //        complete: function () {
    //            edu.system.start_Progress("zoneprocessXXXX", function () {
    //                me.getList_DuLieuThi();
    //            });
    //        },
    //        contentType: true,
            
    //        data: obj_delete,
    //        fakedb: [
    //        ]
    //    }, false, false, false, null);
    //},
    getList_KetQuaDuLieuThi: function (strDaoTao_LopHocPhan_Id, strSoSinhVien) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayTTThanhPhanDiemTheoLop',
            'type': 'GET',
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    
                    dtReRult.forEach(e => {
                        $("#SL_" + strDaoTao_LopHocPhan_Id + "_" + e.DIEM_THANHPHANDIEM_ID).html("Xem " + edu.util.returnEmpty(e.SOSV));
                        if (strSoSinhVien != e.SOSV) $("#SL_" + strDaoTao_LopHocPhan_Id + "_" + e.DIEM_THANHPHANDIEM_ID).css("color", "red");
                    });
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DuLieuThi: function (data, iPager) {
        var me = this;
        $("#lblDuLieuThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDuLieuThi",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DuLieuThi.getList_DuLieuThi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    //"mDataProp": "CONGTHUC"
                    "mRender": function (nRow, aData) {
                        if ($("#btnHuyDuLieu").length == 0) return edu.util.returnEmpty(aData.NGAYBATDAU) + " ->" + edu.util.returnEmpty(aData.NGAYKETTHUC);
                        return '<span name="' + aData.CONGTHUC + '" style="max-width: 200px" class="detail_CongThuc">' + aData.CONGTHUC_TUKHOA + '<span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control hannopdiem" id="inputHanNopDiem_' + aData.ID + '" value="' + edu.util.returnEmpty(aData.HANNOPDIEM) + '" name="' + edu.util.returnEmpty(aData.HANNOPDIEM) + '" />'
                    }
                }
            ]
        };
        me.dtThanhPhanDiem.forEach(e => {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<input type="checkbox" class="check' + aData.ID + ' check' + main_doc.DuLieuThi.dtThanhPhanDiem[iThuTu].ID + ' checkPhanQuyen poiter" id="chkSelect_' + aData.ID + '_' + main_doc.DuLieuThi.dtThanhPhanDiem[iThuTu].ID + '" />'
                            + '<span class="btnXemDanhSach" style="width: calc(100% - 40px)" id="SL_' + aData.ID + '_' + main_doc.DuLieuThi.dtThanhPhanDiem[iThuTu].ID + '"></span>';
                    }
                }
            );
        });
        edu.system.loadToTable_data(jsonForm);

        data.forEach(e => me.getList_KetQuaDuLieuThi(e.ID, e.SOSV));
        me.actionTable("tblDuLieuThi")
        /*III. Callback*/
    },
    viewForm_DuLieuThi: function (strId) {
        var me = this;
        //call popup --Edit
        console.log(strId);
        var arrId = strId.split('_');
        me.strLopHocPhan_Id = arrId[1];
        console.log(arrId);
        edu.util.viewValById("dropSearch_LoaiDiem", arrId[2]);
        me.getList_SinhVien();
    },

    actionTable: function (strTable_Id) {
        setTimeout(function () {
            var me = this;
            //edu.system.move_ThroughInTable(strTable_Id);
            function moveScroll() {
                var scroll = $(window).scrollTop();
                var left = $("#" + strTable_Id).offset().left;
                var anchor_top = $("#" + strTable_Id).offset().top;
                var anchor_bottom = $("#bottom_anchor").offset().top;
                if (scroll > anchor_top && scroll < anchor_bottom) {
                    clone_table = $("#clone");
                    if (clone_table.length == 0) {
                        clone_table = $("#" + strTable_Id).clone();
                        clone_table.attr('id', 'clone');
                        clone_table.css({
                            position: 'fixed',
                            'pointer-events': 'none',
                            top: 0,
                            left: left + "px"
                        });
                        clone_table.width($("#" + strTable_Id).width());
                        $("#table-container").append(clone_table);
                        $("#clone").css({ visibility: 'hidden' });
                        $("#clone thead").css({ visibility: 'visible', color: 'gray' });
                    }
                } else {
                    $("#clone").remove();
                }
            }
            $(window).scroll(moveScroll);
            $("#table-container").scroll(function () {
                var x = $("#clone");
                if (x.length > 0) {
                    x = x[0];
                    var anchor_left = $("#" + strTable_Id).offset().left;
                    $("#clone")[0].style.left = anchor_left + "px";
                }
            });
            //$("#table-container").append('<table id="tblNhapDiemclone" class="table table-hover table-bordered"><tbody></tbody></table>');
            //var x = $("#tblNhapDiem tbody");
            //for (var i = 0; i < x.length; i++) {
            //    for (var j = 0; j < 5; j++) {
            //        $("#")
            //    }
            //}
            //$("#tblNhapDiemclone").remove();
            //clone_table = $("#tblNhapDiem").clone();
            //clone_table.attr('id', 'tblNhapDiemclone');
            //clone_table.css({
            //    position: 'absolute',
            //    'pointer-events': 'none',
            //    top: 0
            //});
            //clone_table.width($("#tblNhapDiem").width());
            //$("#table-container").append(clone_table);
            //$("#tblNhapDiemclone").css({ visibility: 'hidden' });
            //$("#tblNhapDiemclone tbody").css({ visibility: 'visible' });
            //var x = $("#tblNhapDiemclone tbody")[0].rows;
            //for (var i = 0; i < x.length; i++) {
            //    for (var j = 7; j < x[i].cells.length; j++) {
            //        $(x[i].cells[j]).css({ visibility: 'hidden' });
            //    }
            //}
            //$("#tblNhapDiemclone tbody")[0].classList.add("mauthangcon");

            //var row = $("#tblNhapDiem tbody")[0].rows;
            //var rowNguoiHoc = $("#tblNhapDiemclone tbody")[0].rows;
            //for (var i = 0; i < row.length; i++) {
            //    var ilenghtDiem = row[i].clientHeight;
            //    var ilengthNguoiHoc = rowNguoiHoc[i].clientHeight;

            //    if (ilengthNguoiHoc < ilenghtDiem)
            //        $(rowNguoiHoc[i]).attr("height", row[i].clientHeight);
            //    else
            //        $(row[i]).attr("height", rowNguoiHoc[i].clientHeight);

            //    if (i < row.length - 1) {
            //        var iLengthTopDiem = $(row[i + 1]).offset().top;
            //        var iLengthTopNguoiHoc = $(rowNguoiHoc[i + 1]).offset().top;
            //        var iChenhLech = iLengthTopDiem - iLengthTopNguoiHoc;
            //        if (iChenhLech != 0) {
            //            if (iChenhLech > 0) {
            //                $(rowNguoiHoc[i]).attr("height", (rowNguoiHoc[i].clientHeight + iChenhLech));
            //            }
            //            else {
            //                $(row[i]).attr("height", (row[i].clientHeight - iChenhLech));
            //            }
            //        }
            //    }

            //}
            //var rowHead = $("#tblNhapDiem thead")[0].rows[0];
            //var rowHeadNguoiHoc = $("#tblNhapDiemclone thead")[0].rows[0];
            //var iSoCot = 7;
            //for (var i = 0; i < iSoCot; i++) {
            //    console.log(rowHead.cells[i].scrollWidth);
            //    rowHeadNguoiHoc.cells[i].scrollWidth = rowHead.cells[i].scrollWidth;
            //    rowHeadNguoiHoc.cells[i].style.width = rowHead.cells[i].scrollWidth + 1 + "px";
            //}
        }, 500);

    },
    genCombo_LoaiDiem: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_LoaiDiem"],
            title: "Chọn loại điểm"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSNguoiHocTheoLop',
            'type': 'GET',
            'strDaoTao_LopHocPhan_Id': me.strLopHocPhan_Id,
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_SinhVien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_SinhVien: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DuLieuThi.getList_DuLieuThi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "TRANGTHAI"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },

    save_XacNhanTN: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        strSanPham_Id += me.strLopHocPhan_Id + $("#dropSearch_LoaiDiem").val();
        var obj_list = {
            'action': 'TP_XacNhanTruocThi/ThemMoi',
            'type': 'POST',
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'TP_XacNhanTruocThi/LayDanhSach',
            'strTuKhoa': "",
            'strsanpham_Id': strHoSoDuTuyen_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhan(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_XacNhan: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_TinhTrang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayTrangThaiTruocThi',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data)

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSThoiGian',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn học kỳ",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LoaiDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSThanhPhanDiemSauThi',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiDiem(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_LoaiDiem: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiDiem_CC"],
            type: "",
            title: "Chọn loại điểm",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_DotThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSDotThi',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem_CC'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_DotThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_DotThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TENDOTTHI) + " - " + edu.util.returnEmpty(aData.NGAYBD) + " - " + edu.util.returnEmpty(aData.NGAYKT)
                }
            },
            renderPlace: ["dropSearch_DotThi"],
            type: "",
            title: "Chọn đợt thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan_CC: function () {
        var me = this;
        var arrDotThi = me.getMultiVal('dropSearch_DotThi');
        if (arrDotThi.length > me.MAX_SELECTED) {
            if (!me.checkSelectionLimit('dropSearch_DotThi', 'đợt thi')) return;
        }

        me.loadInBatches(arrDotThi, me.BATCH_SIZE, function (idStr) {
            var obj_list = {
                'action': 'TP_ToChucThi/LayDSHocPhan',
                'type': 'GET',
                'strDotThi_Id': idStr,
                'strHinhThucThi_Id': edu.util.getValById('dropAAAA'),
                'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem_CC'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
                'strTHI_DotThi_Id': idStr,
                'strNguoiThucHien_Id': edu.system.userId,
            };
            return {
                type: 'GET',
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: []
            };
        }, function (allData) {
            me.cbGenCombo_HocPhan(allData);
        }, "ID");
    },
    cbGenCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN);
                }
            },
            renderPlace: ["dropSearch_HocPhan_CC"],
            type: "",
            title: "Chọn học phần",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_DanhSachThi: function () {
        var me = this;
        var arrHP = me.getMultiVal('dropSearch_HocPhan_CC');
        var arrDT = me.getMultiVal('dropSearch_DotThi');

        // Batch theo mảng lớn hơn để giảm tổng số request và tránh URL quá dài.
        var primary, fixedKey, fixedStr, primaryKey;
        if (arrHP.length >= arrDT.length) {
            primary = arrHP;
            primaryKey = 'strDaoTao_HocPhan_Id';
            fixedKey = 'strTHI_DotThi_Id';
            fixedStr = arrDT.join(',');
        } else {
            primary = arrDT;
            primaryKey = 'strTHI_DotThi_Id';
            fixedKey = 'strDaoTao_HocPhan_Id';
            fixedStr = arrHP.join(',');
        }

        me.loadInBatches(primary, me.BATCH_SIZE, function (idStr) {
            var obj_list = {
                'action': 'XLHV_TP_ToChucThi_MH/DSA4BRIVKSgP',
                'func': 'PKG_THI_TOCHUCTHI.LayDSThi',
                'iM': edu.system.iM,
                'strThi_CaThi_Id': '',
                'strNgayThi': edu.util.getValById('txtSearch_NgayThi'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
                'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem_CC'),
                'strNgayThiBatDau': edu.util.getValById('txtSearch_NgayThi_TuNgay'),
                'strNgayThiKetThuc': edu.util.getValById('txtSearch_NgayThi_DenNgay'),
                'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_CC'),
                'strNguoiThucHien_Id': edu.system.userId,
            };
            obj_list[primaryKey] = idStr;
            obj_list[fixedKey] = fixedStr;
            return {
                type: 'POST',
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: []
            };
        }, function (allData) {
            me.genTable_DanhSachThi(allData);
        }, "ID");
    },
    genTable_DanhSachThi: function (data) {
        var me = this;
        me.dtDanhSachThi = data || [];
        me.renderTable_DanhSachThi();
    },
    renderTable_DanhSachThi: function () {
        var me = this;
        var data = me.dtDanhSachThi || [];
        var status = $("#dropSearch_TrangThaiCongBo").val();
        var onlyUnpublished = $("#chkChuaCongBo").is(":checked");


        if (onlyUnpublished) {
            data = data.filter(function (x) {
                var v = x.TRANGTHAICONGBO_TEN;
                return v == null || (typeof v === "string" && v.trim() === "");
            });
        } else if (status) {
            data = data.filter(function (x) {
                return (x.TRANGTHAICONGBO_TEN || "") === status;
            });
        }
        $("#lblDanhSachThi_Tong").html(data.length);
        var jsonForm = {
            strTable_Id: "tblDanhSachThi",
            aaData: data,
            colPos: {
                center: [0]
            },
            aoColumns: [
                { "mDataProp": "MADANHSACHTHI" },
                { "mDataProp": "TKB_PHONGHOC_TEN" },
                { "mDataProp": "NGAYTHI" },
                { "mDataProp": "THI_CATHI_TEN" },
                { "mDataProp": "DAOTAO_HOCPHAN_TEN" },
                { "mDataProp": "HINHTHUCTHI_TEN" },
                {
                    "mRender": function (nRow, aData) {
                        return '<div style="max-width:240px; word-break:break-all; white-space:normal;">'
                            + edu.util.returnEmpty(aData.THONGTINLOPHOCPHAN) + '</div>';
                    }
                },
                { "mDataProp": "TRANGTHAICONGBO_TEN" },
                { "mDataProp": "THOIGIANCONGBOLICH" },
                { "mDataProp": "NGUOITHUCHIENCONGBOLICH" },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="checkDSThi" id="checkDSThi_' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.syncTopScroll_DanhSachThi();
    },
    syncTopScroll_DanhSachThi: function () {
        var $top = $("#topScroll_tblDanhSachThi");
        var $topInner = $("#topScrollInner_tblDanhSachThi");
        var $wrap = $("#wrapScroll_tblDanhSachThi");
        if (!$top.length || !$wrap.length) return;
        var resize = function () {
            $topInner.css("width", $wrap[0].scrollWidth + "px");
        };
        resize();
        setTimeout(resize, 50);
        if (!$top.data("synced")) {
            $top.data("synced", true);
            $top.on("scroll", function () { $wrap.scrollLeft($top.scrollLeft()); });
            $wrap.on("scroll", function () { $top.scrollLeft($wrap.scrollLeft()); });
            $(window).on("resize", resize);
        }
    },

    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_CongBo: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': me.bcheck,
            'strId': "",
            'strSanPham_Id': strSanPham_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': strSanPham_Id,
            'strTHI_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem_CC'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KhaoThi();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CongBo: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var arrIds = (strHoSoDuTuyen_Id || "").toString().split(",").filter(function (x) { return x; });

        me.loadInBatches(arrIds, me.BATCH_SIZE, function (idStr) {
            var obj_save = {
                'action': 'TP_CongBoLichThi/LayDSQLTHI_CongBoLichThi',
                'strTuKhoa': "",
                'strsanpham_Id': idStr,
                'strTinhTrang_Id': "",
                'strNguoiThucHien_Id': '',
                'pageIndex': 1,
                'pageSize': 100000,
            };
            return {
                type: "GET",
                action: obj_save.action,
                contentType: true,
                data: obj_save,
                fakedb: []
            };
        }, function (allData) {
            if (typeof (callback) == "function") {
                callback(allData);
            } else {
                me.genTable_CongBo(allData, strTable_Id);
            }
        });
    },

    genTable_CongBo: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_btnCongBo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayTrangThaiCongBoLich',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnCongBo(data.Data)

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    loadBtnCongBo: function (data) {
        //main_doc.KhaoThi.dtXacNhan = data;
        this.dtTrangThaiCongBo = data;
        this.cbGenCombo_TrangThaiCongBo(data);
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnCongBo").html(row);
    },

    cbGenCombo_TrangThaiCongBo: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "TEN",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_TrangThaiCongBo"],
            title: "Tình trạng công bố"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSKhoaToChuc',
            'type': 'GET',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KhoaDaoTao(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': '',
            'strDaoTao_KhoaDaoTao_Id': '',
            'strDaoTao_HeDaoTao_Id': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.cbGenCombo_ChuongTrinhDaoTao(data.Data);
                } else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        // Gộp các bản ghi trùng TENCHUONGTRINH thành 1 option, mỗi option chỉ giữ 1 ID đầu tiên.
        // Backend tự resolve các bản ghi cùng tên/cùng chương trình gốc khi nhận ID này.
        var seen = {};
        var unique = [];
        (data || []).forEach(function (item) {
            var key = (item.TENCHUONGTRINH || "").trim();
            if (!key || seen[key]) return;
            var row = { ID: item.ID, TENCHUONGTRINH: key };
            seen[key] = row;
            unique.push(row);
        });
        var obj = {
            data: unique,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh_CC"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        };
        edu.system.loadToCombo_data(obj);
        if (unique.length != 1) $("#dropSearch_ChuongTrinh_CC").val("").trigger("change");
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
}