/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DanhMucTuKhoa() { };
DanhMucTuKhoa.prototype = {
    strDanhMucTuKhoa_Id: '',
    dtDanhMucTuKhoa: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_DanhMucTuKhoa();
        me.getList_UngDung();
        
        $("#btnSave_DanhMucTuKhoa").click(function () {
            var x = $("#tblDanhMucTuKhoa tbody tr");
            var arrSave = [];
            for (var i = 0; i < x.length; i++) {
                var strId = x[i].id.replace(/rm_row/g, '');
                if (!edu.util.checkValue(edu.util.getValById("txtDinhDanh" + strId)) || !edu.util.checkValue(edu.util.getValById("txtDuLieu" + strId))) continue;
                if ($("#txtDinhDanh" + strId).val() == $("#txtDinhDanh" + strId).attr("title") && $("#txtDuLieu" + strId).val() == $("#txtDuLieu" + strId).attr("title") && $("#txtMoTa" + strId).val() == $("#txtMoTa" + strId).attr("title")) continue;
                arrSave.push(strId);
            }
            edu.system.confirm("Bạn có chắc chắn lưu " + arrSave.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessDanhMucTuKhoa"></div>');
                edu.system.genHTML_Progress("zoneprocessDanhMucTuKhoa", arrSave.length);
                for (var i = 0; i < arrSave.length; i++) {
                    me.save_DanhMucTuKhoa(arrSave[i]);
                }
            });
        });
        $("#btnDelete_DanhMucTuKhoa").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_DanhMucTuKhoa(me.strDanhMucTuKhoa_Id);
            });
        });
        $("#btnXoaDanhMucTuKhoa").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhMucTuKhoa", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessDanhMucTuKhoa"></div>');
                edu.system.genHTML_Progress("zoneprocessDanhMucTuKhoa", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DanhMucTuKhoa(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_DanhMucTuKhoa();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DanhMucTuKhoa();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDanhMucTuKhoa" });
        });
        
        $("#btnThemDong").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_DanhMucTuKhoa(id, "");
        });

        $("#tblDanhMucTuKhoa").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblDanhMucTuKhoa tr[id='" + strRowId + "']").remove();
        });

        /*------------------------------------------
        --Discription: [1] Action UngDung
        --Order: 
        -------------------------------------------*/
        $("#dropSeacrch_UngDung").on("select2:select", function () {
            me.getList_ChucNang();
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DanhMucTuKhoa: function (strId) {
        var me = this;
        var strTuKhoa_Id = strId;
        var strChucNang_Id = "";
        var strUngDung_Id = "";
        if (strId.length == 30) {
            strId = "";
            strChucNang_Id = edu.util.getValById('dropSeacrch_ChucNang');
            strUngDung_Id = edu.util.getValById('dropSeacrch_UngDung');
        } else {
            var data = edu.util.objGetDataInData(strId, me.dtDanhMucTuKhoa, "ID")[0];
            strChucNang_Id = data.CHUCNANG_ID;
            strUngDung_Id = data.UNGDUNG_ID;
        }
        //--Edit
        var obj_save = {
            'action': 'CMS_CauHinh/ThemMoi',

            'strId': strId,
            'strChucNang_Id': strChucNang_Id,
            'strDinhDanh': edu.util.getValById('txtDinhDanh' + strTuKhoa_Id),
            'strDuLieu': edu.util.getValById('txtDuLieu' + strTuKhoa_Id),
            'strMoTa': edu.util.getValById('txtMoTa' + strTuKhoa_Id),
            'strUngDung_Id': strUngDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'CMS_CauHinh/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.Id)) {
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
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessDanhMucTuKhoa", function () {
                    me.getList_DanhMucTuKhoa();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DanhMucTuKhoa: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_CauHinh/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDanhMucTuKhoa = dtReRult;
                    me.genTable_DanhMucTuKhoa(dtReRult, data.Pager);
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
    delete_DanhMucTuKhoa: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_CauHinh/Xoa',
            
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
                    me.getList_DanhMucTuKhoa();
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
                edu.system.start_Progress("zoneprocessDanhMucTuKhoa", function () {
                    me.getList_DanhMucTuKhoa();
                });
            },
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
    genTable_DanhMucTuKhoa: function (data, iPager) {
        var me = this;
        $("#lblDanhMucTuKhoa_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhMucTuKhoa",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DanhMucTuKhoa.getList_DanhMucTuKhoa()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtDinhDanh' + aData.ID + '" title="' + edu.util.returnEmpty(aData.DINHDANH) + '" value="' + edu.util.returnEmpty(aData.DINHDANH) + '" class="form-control"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtDuLieu' + aData.ID + '" title="' + edu.util.returnEmpty(aData.DULIEU) +'" value="' + edu.util.returnEmpty(aData.DULIEU) + '" class="form-control"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtMoTa' + aData.ID + '" title="' + edu.util.returnEmpty(aData.MOTA) + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data.length == 0) {
            $("#tblDanhMucTuKhoa tbody").html("");
            for (var i = 0; i < 4; i++) {
                var id = edu.util.randomString(30, "");
                me.genHTML_DanhMucTuKhoa(id, "");
            }
        } else {
            for (var i = 0; i < 1; i++) {
                var id = edu.util.randomString(30, "");
                me.genHTML_DanhMucTuKhoa(id, "");
            }
        }
        /*III. Callback*/
    },

    genHTML_DanhMucTuKhoa: function (strId) {
        var me = this;
        var iViTri = document.getElementById("tblDanhMucTuKhoa").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strId + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strId + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtDinhDanh' + strId + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtDuLieu' + strId + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtMoTa' + strId + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strId + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblDanhMucTuKhoa tbody").append(row);
    },


    getList_UngDung: function () {
        var me = this;
        var obj = {
            iTrangThai: 1,
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.extend.getList_UngDung(obj, "", "", me.cbGenCombo_UngDung);

    },

    cbGenCombo_UngDung: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSeacrch_UngDung"],
            type: "",
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_ChucNang: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CMS_ChucNang/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strChung_UngDung_Id': edu.util.getValById("dropSeacrch_UngDung"),
            'strCha_Id': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'strPhamViTruyCap_Id': "",
            'dTrangThai': 1
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChucNang(dtResult);
                }
                else {
                    edu.system.alert("CMS_ChucNang/LayDanhSach: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("CMS_ChucNang/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genCombo_ChucNang: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENCHUCNANG",
                code: ""
            },
            renderPlace: ["dropSeacrch_ChucNang"],
            title: "Chọn chức năng"
        };
        edu.system.loadToCombo_data(obj);
    },
}