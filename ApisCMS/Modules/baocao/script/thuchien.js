/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function ThucHien() { };
ThucHien.prototype = {
    strThucHien_Id: '',
    dtThucHien: [],
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
        
        me.getList_ThucHien();
        me.getList_KeHoachBaoCao();
        $("#tblThucHien").delegate(".btnCauTruc", "click", function () {
            var strId = this.id;
            me.strThucHien_Id = strId;
            me.toggle_edit();
        });
        

        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $("#dropSeacrch_KeHoach").on("select2:select", function () {
            me.getList_ThucHien();
        });

        $("#btnSearch").click(function () {
            me.getList_ThucHien();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ThucHien();
            }
        });
        $("#btnSave_ThucHien").click(function () {
            var strTable_Id = "tblCauTruc";
            var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input,select");
            var arrSave = [];
            var arrXoa = [];

            for (var i = 0; i < arrElement.length; i++) {
                var strVal = $(arrElement[i]).val();
                var strId = $(arrElement[i]).attr("name");
                var temp = $(arrElement[i]).attr("title");
                if (temp == undefined) temp = "";
                if (strVal != temp) {
                    if (strVal) {
                        arrSave.push(arrElement[i]);
                    } else {
                        if (strId) arrXoa.push(strId);
                    }
                }
            }
            if ((arrSave.length + arrXoa.length) == 0) {
                edu.system.alert("Không có dữ liệu mới cần lưu");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn lưu " + arrSave.length + " và xóa " + arrXoa.length + " không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrSave.length + arrXoa.length);
                arrSave.forEach(e => me.save_DuLieu(e));
                arrXoa.forEach(e => me.delete_DuLieu(e));
            });
        });
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
    save_ThucHien: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_HeThongBaoCao/ThemMoi',
            'type': 'POST',
            'strId': me.strThucHien_Id,
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
                    me.getList_ThucHien();
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
    getList_ThucHien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_HeThongBaoCao/LayHeThongBaoCaoTheoCanNhan',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTHBC_KeHoachBaoCao_Id': edu.util.getValById('dropSeacrch_KeHoach'),
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtThucHien = dtReRult;
                    me.genTable_ThucHien(dtReRult, data.Pager);
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
    delete_ThucHien: function (Ids) {
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
                    me.getList_ThucHien();
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
    genTable_ThucHien: function (data, iPager) {
        $("#lblThucHien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThucHien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThucHien.getList_ThucHien()",
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
    viewForm_ThucHien: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtThucHien, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        me.strThucHien_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_CauTrucChinh: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_BaoCao_CauTruc_Chinh/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTHBC_HeThongBaoCao_Id': me.strThucHien_Id,
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
                    //for (var i = 0; i < dtReRult.length; i++) {
                    //    dtReRult[i]["MABANGDM"] = null;
                    //}
                    //me.insertBodyTable("tblCauTruc", dtReRult, null);
                    me.dtCauTrucChinh = dtReRult;
                    for (var i = 0; i < dtReRult.length; i++) {
                        dtReRult[i]["THBC_BC_CAUTRUC_PHU_CHA_ID"] = dtReRult[i].THBC_BAOCAO_CAUTRUC_C_CHA_ID
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_CauTrucPhu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_BaoCao_CauTruc_Phu/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTHBC_HeThongBaoCao_Id': me.strThucHien_Id,
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        //Khởi tạo table
        $("#" + strTable_Id).html('<thead><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr></thead><tbody></tbody>');

        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THBC_BC_CAUTRUC_PHU_CHA_ID == strQuanHeCha) {
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
            var x = spliceData(objAll, objRecuse.CON_ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].CON_ID);
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
            if (objHead.LABANGCHINH === undefined) {
                if (colspan == 0) {
                    arrHeaderId.push(objHead.ID);
                    //$("#" + strTable_Id + "_Data thead tr:eq(0)").append("<th style='width: 60px'>" + objHead.HOCPHAN + "</th>");
                }
            }
            $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center '  id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.THANHPHAN_TEN +  "</th>");
            
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].THBC_BC_CAUTRUC_PHU_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThanhPhanChinh: function () {

        var me = this;
        var objThucHien = me.dtThucHien.find(e => e.ID === me.strThucHien_Id);
        var obj_list = {
            'action': 'CMS_CauTruc_DuLieu/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTHBC_HeThongBaoCao_Id': objThucHien.THBC_HETHONGBAOCAO_ID,
            'strThanhPhan_Id': edu.util.getValById('dropAAAA'),
            'strThanhPhan_Cha_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTHBC_CoSoDaoTao_Id': objThucHien.THBC_COSODAOTAO_ID,
            'strTHBC_KeHoachBaoCao_Id': objThucHien.THBC_KEHOACHBAOCAO_ID,
            'strTHBC_BaoCao_CauTruc_C_Id': edu.util.getValById('dropAAAA'),
            'strTHBC_CT_DuLieu_Cha_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.arrBody_Id = me.insertBodyTableChinh("tblCauTruc", dtReRult, null);
                    me.dtThanhPhanChinh = dtReRult;
                    me.genTable_ThanhPhanChinh();
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
    insertBodyTableChinh: function (strTable_Id, obj, strQuanHeCha) {
        var me = this;
        //Khởi tạo table
        $("#" + strTable_Id + " tbody").html('');
        var imaxlength = 0;
        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THBC_CAUTRUC_DULIEU_CHA_ID == strQuanHeCha) {
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
            var x = spliceData(objAll, objRecuse.CON_ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].CON_ID);
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
                $("#" + strTable_Id + " tbody").append('<tr id="' + objHead.ID + '"><td id="' + objHead.ID + '" colspan="' + (iThuTu + 1) + '">' + objHead.THANHPHAN_TEN + '</td></tr>');
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
                if (objData[i].THBC_CAUTRUC_DULIEU_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    genTable_ThanhPhanChinh: function (data, iPager) {
        var me = this;
        me.arrHead_Id.forEach(eHead => {
            var check = me.dtCauTrucPhu.find(e => e.THANHPHAN_ID === eHead);
            if (check && check.MABANGDM_THANHPHAN_DULIEU) {
                var arrDrop = [];
                me.arrBody_Id.forEach(eBody => {
                    arrDrop.push('drop' + eBody + "_" + eHead);
                    $("#tblCauTruc tbody tr[id=" + eBody + "]").append('<td><select id="drop_' + eBody + "_" + eHead + '" class="select-opt"></select></td>');
                });
                edu.system.loadToCombo_DanhMucDuLieu(check.MABANGDM_THANHPHAN_DULIEU, arrDrop.toString());
            } else {
                me.arrBody_Id.forEach(eBody => {
                    $("#tblCauTruc tbody tr[id=" + eBody + "]").append('<td><input id="txt_' + eBody + "_" + eHead + '" class="form-control" /></td>');
                });
            }
        });
        
        me.arrBody_Id.forEach(eBody => {
            var objChinh = me.dtThanhPhanChinh.find(e => e.ID === eBody);
            me.arrHead_Id.forEach(eHead => {
                me.getList_DuLieu(objChinh, eHead);
            });
        });
        edu.system.move_ThroughInTable("tblCauTruc");
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_KeHoachBaoCao: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_KeHoachBaoCao/LayKeHoachBaoCaoTheoCanNhan',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_KeHoachBaoCao(dtReRult);
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
    genCombo_KeHoachBaoCao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropSeacrch_KeHoach"],
            title: "Chọn kế hoạch báo cáo"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length == 1) {
            $("#dropSeacrch_KeHoach").val(data[0].ID).trigger("change").trigger({ type: 'select2:select' });
        }
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getAll_DuLieu: function () {
        var me = this;
        me.arrBody_Id.forEach(eBody => {
            var objChinh = me.dtThanhPhanChinh.find(e => e.ID === eBody);
            me.arrHead_Id.forEach(eHead => {
                me.getList_DuLieu(objChinh, eHead);
            });
        });
    },
    save_DuLieu: function (point) {
        var me = this;
        var strId = point.id;
        var arrId = strId.split("_");
        var strChinh_Id = arrId[1];
        var strPhu_Id = arrId[2];
        var objChinh = me.dtThanhPhanChinh.find(e => e.ID === strChinh_Id);
        var objPhu = me.dtCauTrucPhu.find(e => e.ID === strPhu_Id);
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_BaoCao_DuLieu/ThemMoi',
            'type': 'POST',
            'strId': $(point).attr("name"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTHBC_CauTrucCay_DuLieu_Id': strChinh_Id,
            'strTHBC_BaoCao_CauTruc_P_Id': strPhu_Id,
            'strThanhPhan_CayDuLieu_Id': objChinh.THANHPHAN_ID,
            'strThanhPhan_GiaTri': $(point).val(),
            'strThanhPhan_CauTruc_Phu_Id': objPhu.THANHPHAN_ID,
            'strTHBC_CoSoDaoTao_Id': objChinh.THBC_COSODAOTAO_ID,
            'strTHBC_KeHoachBaoCao_Id': objChinh.THBC_KEHOACHBAOCAO_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'CMS_BaoCao_DuLieu/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getAll_DuLieu();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DuLieu: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_BaoCao_DuLieu/Xoa',

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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getAll_DuLieu();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DuLieu: function (objChinh, strTHBC_BaoCao_CauTruc_P_Id) {
        var me = this;
        var obj_list = {
            'action': 'CMS_BaoCao_DuLieu/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTHBC_CauTrucCay_DuLieu_Id': objChinh.ID,
            'strTHBC_BaoCao_CauTruc_P_Id': strTHBC_BaoCao_CauTruc_P_Id,
            'strThanhPhan_CayDuLieu_Id': edu.util.getValById('dropAAAA'),
            'strThanhPhan_CauTruc_Phu_Id': "",
            'strTHBC_CoSoDaoTao_Id': objChinh.THBC_COSODAOTAO_ID,
            'strTHBC_KeHoachBaoCao_Id': objChinh.THBC_KEHOACHBAOCAO_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        var x = $('#txt_' + objChinh.ID + '_' + strTHBC_BaoCao_CauTruc_P_Id);
                        if (x.length === 0) x = $('#drop_' + objChinh.ID + '_' + strTHBC_BaoCao_CauTruc_P_Id);
                        x.attr("name", e.ID);
                        x.val(edu.util.returnEmpty(e.THANHPHAN_GIATRI));
                        x.attr("title", edu.util.returnEmpty(e.THANHPHAN_GIATRI));
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
}