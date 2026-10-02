/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KhaiBao() { };
KhaiBao.prototype = {
    strKhaiBao_Id: '',
    dtKhaiBao: [],
    dtCauTrucChinh: [],
    arrHead_Id: [],
    arrBody_Id: [],
    iMaxLength: 0,
    dtCauTrucPhu: [],
    strCauTruc_Id: '',
    strCha_Id: '',


    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KhaiBao();

        edu.system.loadToCombo_DanhMucDuLieu("THBC.HETHONGBAOCAO.PHANLOAI", "dropSeacrch_PhanLoai,dropPhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("THBC.THANHPHAN.CHINH", "dropThanhPhan_Chinh");
        edu.system.loadToCombo_DanhMucDuLieu("THBC.THANHPHAN.PHU", "dropThanhPhan_Phu");
        edu.system.loadToCombo_DanhMucDuLieu("THBC.DANHMUC.TENBANG", "dropChinh");

        $("#tblKhaiBao").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_KhaiBao(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKhaiBao").delegate(".btnCauTruc", "click", function () {
            var strId = this.id;
            me.strKhaiBao_Id = strId;
            me.toggle_edit();

        });

        $("#btnKhaiBao").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_KhaiBao").click(function () {
            me.save_KhaiBao();
        });
        $("#btnDelete_KhaiBao").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KhaiBao(me.strKhaiBao_Id);
            });
        });
        
        $("#btnAddCotPhu").click(function () {
            me.popup_Phu();
            me.resetPopup_Phu();
        });
        $("#btnSave_CauTrucPhu").click(function () {
            me.save_CauTrucPhu();
        });
        $("#btnDelete_CauTrucPhu").click(function () {
            $('#myModalCauTrucPhu').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_CauTrucPhu(me.strCauTruc_Id);
            });
        });

        $("#btnAddCotChinh").click(function () {
            me.popup_Chinh();
            me.resetPopup_Chinh();
        });
        $("#btnSave_CauTrucChinh").click(function () {
            me.save_CauTrucChinh();
        });
        $("#btnDelete_CauTrucChinh").click(function () {
            $('#myModalCauTrucChinh').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_CauTrucChinh(me.strCauTruc_Id);
            });
        });
        $("#btnHienThiDuLieu").click(function () {
            me.genTable_ThanhPhanChinh();
        });

        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $("#tblCauTruc").delegate(".head_chinh", "click", function (e) {
            var strId = this.id;
            e.stopImmediatePropagation();
            $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
            $(".btnOpenDelete").show();
            me.strCauTruc_Id = strId;
            if (edu.util.checkValue(strId)) {
                var aData = me.dtCauTrucChinh.find(e => e.ID === strId);
                me.viewForm_CauTrucChinh(aData);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblCauTruc").delegate(".head_phu", "click", function () {
            var strId = this.id;
            me.strCauTruc_Id = strId;
            if (edu.util.checkValue(strId)) {
                var aData = me.dtCauTrucPhu.find(e => e.ID === strId);
                me.viewForm_CauTrucPhu(aData);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblCauTruc").delegate(".addthanhphan", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id;
            me.strCauTruc_Id = strId;
            me.popup_ThanhPhan();
            me.getList_DuLieu_Cha(strId);
        });

        $("#tblCauTruc").delegate(".deletethanhphan", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThanhPhanChinh(strId);
            });
        });

        $("#btnSearch").click(function () {
            me.getList_KhaiBao();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhaiBao();
            }
        });


        $('#dropChinh').on('select2:select', function () {
            var strVal = $('#dropChinh option:selected').attr("name");
            if (strVal) edu.system.loadToCombo_DanhMucDuLieu(strVal, "", "", data => {
                var jsonForm = {
                    strTable_Id: "tblThanhPhan",
                    aaData: data,
                    colPos: {
                        center: [0, 4],
                        //right: [5]
                    },
                    aoColumns: [
                        {
                            "mDataProp": "MA"
                        },
                        {
                            "mDataProp": "TEN"
                        },
                        {
                            "mRender": function (nRow, aData) {
                                return '<input type="text" id="txtStt' + aData.ID + '" value="' + ++nRow + '" class="form-control" />';
                            }
                        },
                        {
                            "mRender": function (nRow, aData) {
                                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                            }
                        }
                    ]
                };
                edu.system.loadToTable_data(jsonForm);
            });
        });

        $("#chkSelectAll_ThanhPhan").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThanhPhan" });
        });

        //$('#dropChinhCha').on('select2:select', function () {
        //    var strVal = $('#dropChinhCha option:selected').attr("name");
        //    if (strVal) edu.system.loadToCombo_DanhMucDuLieu(strVal, "dropThanhPhanChinhCha");
        //});
        
        $("#btnSave_ThanhPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThanhPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                console.log(11111);
                //edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                obj_notify = {
                    type: "w",
                    content: "Vui lòng chọn đối tượng cần lưu?",
                    prePos: "#myModalThanhPhan #notify"
                };
                edu.system.alertOnModal(obj_notify);
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_ThanhPhanChinh(arrChecked_Id[i]);
            }
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strKhaiBao_Id = "";
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", "");
        edu.util.viewValById("dropHieuLuc", 1);
    },
    popup_Phu: function () {
        //show
        $('#myModalCauTrucPhu').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_Phu: function () {
        var me = this;
        me.strCauTruc_Id = "";
        edu.util.viewValById("txtThuTu_Phu", "");
        edu.util.viewValById("dropThanhPhan_Phu", "");
        edu.util.viewValById("dropThanhPhanCha_Phu", me.strCha_Id);
    },
    popup_Chinh: function () {
        //show
        $('#myModalCauTrucChinh').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_Chinh: function () {
        var me = this;
        me.strCauTruc_Id = "";
        edu.util.viewValById("txtThuTu_Chinh", "");
        edu.util.viewValById("dropThanhPhan_Chinh", "");
        edu.util.viewValById("dropThanhPhanCha_Chinh", me.strCha_Id);
    },


    popup_ThanhPhan: function () {
        //show
        $('#myModalThanhPhan').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_ThanhPhan: function () {
        var me = this;
    },

    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        me.getList_CauTrucPhu();
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KhaiBao: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_HeThongBaoCao/ThemMoi',
            'type': 'POST',
            'strId': me.strKhaiBao_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strMa': edu.util.getValById('txtMa'),
            'strTen': edu.util.getValById('txtTen'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'CMS_HeThongBaoCao/CapNhat';
        }
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
                    me.getList_KhaiBao();
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
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhaiBao: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_HeThongBaoCao/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropSeacrch_PhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhaiBao = dtReRult;
                    me.genTable_KhaiBao(dtReRult, data.Pager);
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
    delete_KhaiBao: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_HeThongBaoCao/Xoa',
            
            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KhaiBao();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KhaiBao: function (data, iPager) {
        $("#lblKhaiBao_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhaiBao",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhaiBao.getList_KhaiBao()",
                iDataRow: iPager
            },
            colPos: {
                center: [0,3,4,5, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC ? "Hiệu lực" : "";
                    }
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnCauTruc" id="' + aData.ID + '" title="Sửa"><i class="fa fa-eye color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_KhaiBao: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtKhaiBao, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        me.strKhaiBao_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CauTrucChinh: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_BaoCao_CauTruc_C_G/ThemMoi',
            'type': 'POST',
            'strId': me.strCauTruc_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strThanhPhan_Id': edu.util.getValById('dropThanhPhan_Chinh'),
            'strThanhPhan_Cha_Id': "",//edu.util.getValById('dropThanhPhanCha_Chinh'),
            'strTHBC_BC_CT_C_G_Cha_Id': edu.util.getValById('dropThanhPhanCha_Chinh'),
            'strTHBC_HeThongBaoCao_Id': me.strKhaiBao_Id,
            'iThuTu': edu.util.getValById('txtThuTu_Chinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'CMS_BaoCao_CauTruc_C_G/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModalCauTrucChinh #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalCauTrucChinh #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_CauTrucChinh();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModalCauTrucChinh #notify"
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CauTrucChinh: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_BaoCao_CauTruc_C_G/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTHBC_HeThongBaoCao_Id': me.strKhaiBao_Id,
            'strThanhPhan_Id': edu.util.getValById('dropAAAA'),
            'strThanhPhan_Cha_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.insertBodyTable("tblCauTruc", dtReRult, null);
                    me.dtCauTrucChinh = dtReRult;
                    me.genCombo_ThanhPhan_Chinh_Cha(dtReRult);
                    for (var i = 0; i < dtReRult.length; i++) {
                        dtReRult[i]["THBC_BC_CAUTRUC_PHU_G_CHA_ID"] = dtReRult[i].THBC_BAOCAO_CAUTRUC_C_G_CHA_ID
                    }
                    console.log(dtReRult);
                    dtReRult = dtReRult.concat(me.dtCauTrucPhu);
                    me.arrHead_Id = me.insertHeaderTable("tblCauTruc", dtReRult, null);
                    me.getList_ThanhPhanChinh();
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
    delete_CauTrucChinh: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_BaoCao_CauTruc_C_G/Xoa',

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_CauTrucPhu();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    insertBodyTable: function (strTable_Id, obj, strQuanHeCha) {
        var me = this;
        //Khởi tạo table
        //$("#" + strTable_Id + " tbody").html('');
        var imaxlength = 0;
        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THANHPHAN_CHA_ID == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Chỉnh sửa colspan cho phần tử đầu tiên
        me.iMaxLength = imaxlength;
        document.getElementById("tbl" + strTable_Id).colSpan = imaxlength + 1;
        //Add rowspan cho các thành phần không có phần từ con
        var x = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].rowSpan;
                if (z == 1 && x[i].cells[j].colSpan != 1) {
                    x[i].cells[j].colSpan = (imaxlength + 2 - x[i].cells[j].colSpan);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.THANHPHAN_ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].THANHPHAN_ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }
        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            if (colspan == 0) {
                arrHeaderId.push(objHead.THANHPHAN_ID);
                $("#" + strTable_Id + " tbody").append('<tr><td class="body_cautruc btnEdit poiter" id="' + objHead.ID +'" colspan="' + (iThuTu + 1) + '">' + objHead.THANHPHAN_TEN + '</td></tr>');
                if (iThuTu > imaxlength) imaxlength = iThuTu;
            }
            else {
                $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td class="body_cautruc poiter" rowspan="' + colspan + '" >' + objHead.THANHPHAN_TEN + '</td>');
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].THANHPHAN_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    genCombo_ThanhPhan_Chinh_Cha: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THANHPHAN_TEN",
                code: "MA",
                order: "",
                default_val: me.strCha_Id
            },
            renderPlace: ["dropThanhPhanCha_Chinh"],
            title: "Chọn thành phần cha"
        };
        edu.system.loadToCombo_data(obj);
    },
    viewForm_CauTrucChinh: function (data) {
        var me = this;
        //call popup --Edit
        me.popup_Chinh();
        //view data --Edit
        edu.util.viewValById("txtThuTu_Chinh", data.THUTU);
        edu.util.viewValById("dropThanhPhan_Chinh", data.THANHPHAN_ID);
        edu.util.viewValById("dropThanhPhanCha_Chinh", data.THANHPHAN_CHA_ID);
        me.strCauTruc_Id = data.ID;
    },
    genTable_CauTrucChinh: function (data, iPager) {
        var me = this;
        //for (var i = 0; i < me.arrHeadChinh_Id.length; i++) {
        //    var x = $("#tblViewCauTrucQuanSo tbody tr");
        //    for (var j = 0; j < me.arrTrangThai_Id.length; j++) {
        //        $(x[i]).append('<td style="text-align: center" class="count' + me.arrTrangThai_Id[j] + ' btnDetail poiter" title="Xem chi tiết quân số trong lớp" id="lblQuanSo' + me.arrHead_Id[i] + '_' + me.arrTrangThai_Id[j] + '"></td>');
        //    }
        //    me.dtTrangThaiMoRong.forEach(e => {
        //        $(x[i]).append('<td style="text-align: center" class="count' + e.ID + ' btnDetail poiter" title="Xem chi tiết quân số trong lớp" id="lblQuanSo' + me.arrHead_Id[i] + '_' + e.ID + '"></td>');
        //    });
        //}
        //for (var i = 0; i < me.arrHead_Id.length; i++) {
        //    me.getData_CauTrucQuanSo(me.arrHead_Id[i]);
        //    me.getData_QuanSoTheoTieuChiMoRong(me.arrHead_Id[i]);
        //}
        //edu.system.genHTML_Progress("divprogessquanso", (me.arrHead_Id.length * 2));
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CauTrucPhu: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_BaoCao_CauTruc_Phu_G/ThemMoi',
            'type': 'POST',
            'strId': me.strCauTruc_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strThanhPhan_Id': edu.util.getValById('dropThanhPhan_Phu'),
            'strThanhPhan_Cha_Id': "",
            'strTHBC_BC_CT_Phu_G_Cha_Id': edu.util.getValById('dropThanhPhanCha_Phu'),
            'strTHBC_HeThongBaoCao_Id': me.strKhaiBao_Id,
            'iThuTu': edu.util.getValById('txtThuTu_Phu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'CMS_BaoCao_CauTruc_Phu_G/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModalCauTrucPhu #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalCauTrucPhu #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_CauTrucPhu();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModalCauTrucPhu #notify"
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CauTrucPhu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_BaoCao_CauTruc_Phu_G/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTHBC_HeThongBaoCao_Id': me.strKhaiBao_Id,
            'strThanhPhan_Id': edu.util.getValById('dropAAAA'),
            'strThanhPhan_Cha_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_ThanhPhan_Phu_Cha(dtReRult);
                    //me.insertHeaderTable("tblCauTruc", dtReRult, null);
                    me.dtCauTrucPhu = dtReRult;
                    me.getList_CauTrucChinh();
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
    delete_CauTrucPhu: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_BaoCao_CauTruc_Phu_G/Xoa',

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_CauTrucPhu();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_ThanhPhan_Phu_Cha: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THANHPHAN_TEN",
                code: "MA",
                order: "",
                default_val: me.strCha_Id
            },
            renderPlace: ["dropThanhPhanCha_Phu"],
            title: "Chọn thành phần cha"
        };
        edu.system.loadToCombo_data(obj);
    },
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        //Khởi tạo table
        $("#" + strTable_Id).html('<thead><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr></thead><tbody></tbody>');

        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THBC_BC_CAUTRUC_PHU_G_CHA_ID == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Add rowspan cho các thành phần không có phần từ con
        //rowspan = rowTheadOfTable - colspan
        var x = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].colSpan;
                if (z == 1) {
                    var irowspan = (x.length - i);
                    if (irowspan > 1) x[i].cells[j].rowSpan = (x.length - i);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }

        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            //var lHeader = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows;
            //if (lHeader.length <= iThuTu) {
            //    $("#" + strTable_Id + " thead").append("<tr></tr>");
            //    setTimeout(function () {
            //        $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.HOCPHAN + "</th>");
            //    }, 1);
            //} else {
            //    $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.HOCPHAN + "</th>");
            //}
            var strClass = "head_phu";
            var strAdd = "";
            if (objHead.MABANGDM_THANHPHAN_DULIEU_G !== undefined) {
                strClass = "head_chinh";
                if (colspan == 0) {
                    strClass += " addthanhphan";
                    strAdd = '<br/><a class="btn addthanhphan" id="' + objHead.ID + '" href="#"><i class="fa fa-plus"></i> Thêm dữ liệu</a>';
                }
            } else {
                if (colspan == 0) {
                    arrHeaderId.push(objHead.ID);
                }
            }
            $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center btnEdit " + strClass + " poiter'  id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.THANHPHAN_TEN + strAdd +  "</th>");
            
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].THBC_BC_CAUTRUC_PHU_G_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    viewForm_CauTrucPhu: function (data) {
        var me = this;
        //call popup --Edit
        me.popup_Phu();
        //view data --Edit
        edu.util.viewValById("txtThuTu_Phu", data.THUTU);
        edu.util.viewValById("dropThanhPhan_Phu", data.THANHPHAN_ID);
        edu.util.viewValById("dropThanhPhanCha_Phu", data.THANHPHAN_CHA_ID);
        me.strCauTruc_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhPhanChinh: function (strThanhPhan_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_CauTruc_DuLieu_G/ThemMoi',
            'type': 'POST',
            'strId': me.strThanhPhanChinh_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strThanhPhan_Id': strThanhPhan_Id,
            'strThanhPhan_Cha_Id':'',
            'strTHBC_CT_DuLieu_G_Cha_Id': edu.util.getValById('dropThanhPhanChinhCha'),
            'strTHBC_HeThongBaoCao_Id': me.strKhaiBao_Id,
            'strTHBC_BC_CauTruc_C_G_Id': me.strCauTruc_Id,
            'iThuTu': edu.util.getValById('txtStt' + strThanhPhan_Id),
            'strThanhPhan_Ten': edu.util.getValById('txtAAAA'),
            'strThanhPhan_Ma': edu.util.getValById('txtAAAA'),
            'strThanhPhan_Cha_Ten': edu.util.getValById('txtAAAA'),
            'strThanhPhan_Cha_Ma': edu.util.getValById('txtAAAA'),
            'dChieuDinhHuongHienThi': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'CMS_CauTruc_DuLieu_G/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModalThanhPhan #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalThanhPhan #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_ThanhPhanChinh();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModalThanhPhan #notify"
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThanhPhanChinh();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhPhanChinh: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_CauTruc_DuLieu_G/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTHBC_HeThongBaoCao_Id': me.strKhaiBao_Id,
            'strThanhPhan_Id': edu.util.getValById('dropAAAA'),
            'strThanhPhan_Cha_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.arrBody_Id = me.insertBodyTableChinh("tblCauTruc", dtReRult, null);
                    me.dtThanhPhanChinh = dtReRult;
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
    delete_ThanhPhanChinh: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_CauTruc_DuLieu_G/Xoa',

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ThanhPhanChinh();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    insertBodyTableChinh: function (strTable_Id, obj, strQuanHeCha) {
        var me = this;
        //Khởi tạo table
        $("#" + strTable_Id + " tbody").html('');
        var imaxlength = 0;
        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THBC_CAUTRUC_DULIEU_G_CHA_ID == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Chỉnh sửa colspan cho phần tử đầu tiên
        me.iMaxLength = imaxlength;
        //document.getElementById("tbl" + strTable_Id).colSpan = imaxlength + 1;
        //Add rowspan cho các thành phần không có phần từ con
        var x = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].rowSpan;
                if (z == 1 && x[i].cells[j].colSpan != 1) {
                    x[i].cells[j].colSpan = (imaxlength + 2 - x[i].cells[j].colSpan);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }
        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            if (colspan == 0) {
                arrHeaderId.push(objHead.ID);
                $("#" + strTable_Id + " tbody").append('<tr id="' + objHead.ID + '"><td id="' + objHead.ID + '" colspan="' + (iThuTu + 1) + '">' + objHead.THANHPHAN_TEN + '<a class="btn deletethanhphan pull-right" id="' + objHead.ID + '" href="#"><i class="fa fa-trash"></i></a>' + '</td></tr>');
                if (iThuTu > imaxlength) imaxlength = iThuTu;
            }
            else {
                $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td rowspan="' + colspan + '" >' + objHead.THANHPHAN_TEN + '</td>');
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].THBC_CAUTRUC_DULIEU_G_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    viewForm_ThanhPhanChinh: function (data) {
        var me = this;
        //call popup --Edit
        me.popup_Chinh();
        //view data --Edit
        edu.util.viewValById("txtThuTu_Chinh", data.THUTU);
        edu.util.viewValById("dropThanhPhan_Chinh", data.THANHPHAN_ID);
        edu.util.viewValById("dropThanhPhanCha_Chinh", data.THANHPHAN_CHA_ID);
        me.strCauTruc_Id = data.ID;
    },
    genTable_ThanhPhanChinh: function (data, iPager) {
        var me = this;
        //console.log(me.arrBody_Id);
        //console.log(me.arrHead_Id);
        //me.arrBody_Id.forEach(eBody => {
        //    var x = $("#tblCauTruc tbody tr[id=" + eBody + "]");
        //    console.log(x);
        //    me.arrHead_Id.forEach(eHead => {
        //        x.append('<td id="' + eBody + "_" + eHead + '"></td>');
        //    });
        //});
        me.arrHead_Id.forEach(eHead => {
            var check = me.dtCauTrucPhu.find(e => e.THANHPHAN_ID === eHead);
            if (check && check.MABANGDM_THANHPHAN_DULIEU) {
                var arrDrop = [];
                me.arrBody_Id.forEach(eBody => {
                    arrDrop.push('drop' + eBody + "_" + eHead);
                    $("#tblCauTruc tbody tr[id=" + eBody + "]").append('<td><select id="drop' + eBody + "_" + eHead + '" class="select-opt"></select></td>');
                });
                edu.system.loadToCombo_DanhMucDuLieu(check.MABANGDM_THANHPHAN_DULIEU, arrDrop.toString());
            } else {
                me.arrBody_Id.forEach(eBody => {
                    $("#tblCauTruc tbody tr[id=" + eBody + "]").append('<td><input id="txt' + eBody + "_" + eHead + '" class="form-control" /></td>');
                });
            }
        });
    },


    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_DuLieu_Cha: function (strTHBC_BC_CT_Chinh_G_Id) {
        var me = this;
        var obj_list = {
            'action': 'CMS_CauTruc_DuLieu_G/LayTHBC_CauTruc_DuLieu_G_Cha',
            'type': 'GET',
            'strTHBC_BC_CT_Chinh_G_Id': strTHBC_BC_CT_Chinh_G_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_DuLieu_Cha(dtReRult);
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

    genCombo_DuLieu_Cha: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropThanhPhanChinhCha"],
            title: "Chọn thành phần cha"
        };
        edu.system.loadToCombo_data(obj);
    },
}