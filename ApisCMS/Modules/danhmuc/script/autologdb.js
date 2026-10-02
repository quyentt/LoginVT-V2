/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--API URL:
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function AutoLog() { };
AutoLog.prototype = {
    strSQLUpdate: '',
    strSQLHienTai: '',
    
    init: function () {
        var me = this;
        me.getList_Package();
        me.getList_Log();

        var ilength = window.innerHeight - $("#txtCodeHienTai").offset().top;
        $("#txtCodeHienTai").attr("style", "height: " + ilength + "px; overflow-y: scroll;width: 100%;background-color: #f1f1f1");
        $("#txtCodeUpdate").attr("style", "height: " + ilength + "px; overflow-y: scroll;width: 100%;background-color: #f1f1f1");

        $("#dropPackage").on("select2:select", function () {
            me.getList_SourceLine();
            me.toggle_edit();
        });
        $("#btnUpCodeUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn update");
            $("#btnYes").click(function (e) {
                me.save_CreatAndAlterTable(me.strSQLUpdate);
            });
        });
        $("#btnUpCodeHienTai").click(function () {
            me.strSQLUpdate = cutbugdata(me.strSQLHienTai);
            $("#txtCodeUpdate").val(me.strSQLUpdate);
        });


        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#btnViewLog").click(function () {
            me.toggle_edit();
        });
        $("#btnRefresh").click(function () {
            me.getList_Log();
        });
        $("#btnClearLog").click(function () {
            me.delete_Log();
        });
    },
    toggle_batdau: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/
    getList_Package: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getListPackage',
            'strConnect': "",
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        me.genComBo_Package(data.Data);
                    }
                    else {
                        edu.system.alert("Dữ liệu vào không đúng!", "w");
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_Package: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "OBJECT_NAME",
                parentId: "",
                name: "OBJECT_NAME",
                code: "MA",
            },
            renderPlace: ["dropPackage"],
            type: "",
            title: "Chọn package"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/
    getList_SourceLine: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getSourceLine',
            'strPackage': edu.util.getValById("dropPackage"),
            'strType': 'PACKAGE BODY',
            'strConnect': ''
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        var strSource = "create or replace ";
                        for (var i = 0; i < data.Data.length; i++) {
                            strSource += data.Data[i].TEXT;
                        }
                        me.strSQLHienTai = strSource;
                        me.strSQLUpdate = SeaGate_CommentSQL(strSource);
                        $("#txtCodeHienTai").val(strSource);
                        $("#txtCodeUpdate").val(me.strSQLUpdate);
                    }
                    else {
                        edu.system.alert("Dữ liệu vào không đúng!", "w");
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_CreatAndAlterTable: function (strSQL) {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/CreatAndAlterTable',
            'strA': strSQL,
            'strB': $("#strMaPin").val()
        };
        $("#strMaPin").val("");

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.toggle_batdau();
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {

            },
            type: "POST",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/
    getList_Log: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getListBot',
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_Project(data.Data);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_Project: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblLog",
            aaData: data,
            colPos: {
                center: [0, 3]
            },
            aoColumns: [
                {
                    "mDataProp": "A"
                }
                , {
                    "mDataProp": "B"
                }
                , {
                    "mDataProp": "C"
                }
                , {
                    "mDataProp": "D"
                }
                , {
                    "mDataProp": "E"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.collageInTable({
            strTable_Id: "tblLog",
            iBatDau: 2,
            iKetThuc: 3,
            arrStr: [],
            arrFloat: []
        });
    },
    delete_Log: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/deleteBot',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_Log();
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {

            },
            type: "POST",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
};