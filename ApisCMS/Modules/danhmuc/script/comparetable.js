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
function CompareTable() { }
CompareTable.prototype = {
    dtOrigin: [],
    dtSource: [],
    arrOrigin: [],
    arrSource: [],
    arrTableSpaceSource: [],
    iThuTu: 0,
    
    init: function () {
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        var me = this;
        $("#btnSearch").click(function () {

            var x = $("#txtSearch_DataBase").val();
            if (x != "") {
                me.getList_TableOrigin();
                localStorage.setItem("connectString", x);
                localStorage.setItem("strNgaySoSanh", $("#txtSearch_Ngay").val());
            }
        });
        var strConnect = localStorage.getItem("connectString");
        var strNgaySoSanh = localStorage.getItem("strNgaySoSanh");
        if (edu.util.checkValue(strConnect)) {
            $("#txtSearch_DataBase").val(strConnect);
            $("#txtSearch_Ngay").val(strNgaySoSanh);
        }

        $("[id$=chkSelectAll_CAE]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_CAE" });
        });

        $("[id$=chkSelectAll_PKG]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_PKG" });
        });
        $("#btnExcute").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tbldata_CAE", "chkSelect_");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = "";
            for (var i = 0; i < arrChecked_Id.length; i++) {
                html += $("#cmd_" + arrChecked_Id[i]).val() + "\n\n";
            }
            $("#strDataSQL").val(html);
            $("#myModal").modal("show");
        });
        $("#btnSave_Excute").click(function () {
            $("#myModal").modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tbldata_CAE", "chkSelect_");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                //console.log($("#cmd_" + arrChecked_Id[i]).val());
                me.save_CreatAndAlterTable($("#cmd_" + arrChecked_Id[i]).val());
            }
            setTimeout(function () {
                me.getList_TableOrigin();
            }, arrChecked_Id.length * 50);
        });
        $("#btnExcutePKG").click(function () {
            //$("#myModal").modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tbldata_PKG", "checkOne");
            //console.log(arrChecked_Id);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                console.log($("#cmd_" + arrChecked_Id[i]).val());
                me.getList_SourceLine(arrChecked_Id[i], "PACKAGE");
                me.getList_SourceLine(arrChecked_Id[i], "PACKAGE BODY");
            }
            //setTimeout(function () {
            //    me.getList_TableOrigin();
            //}, arrChecked_Id.length * 50);
        });
        //me.getList_TableOrigin();
        me.getList_Package();
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/
    getList_TableOrigin: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/LayDanhSach',
            'strDataBaseName': ""
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        me.dtOrigin = data.Data;
                        me.getList_TableSource();
                    }
                    else {
                        edu.system.alert("Dữ liệu vào không đúng!", "w");
                    }
                }
                else {
                    edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + data.Message, "w");
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

    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/
    getList_TableSource: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getTableNames_Source',
            'strDataBaseName': $("#txtSearch_DataBase").val(),
            'strNgaySoSanh': $("#txtSearch_Ngay").val(),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        me.dtSource = data.Data;
                        me.compare_Table();
                    }
                    else {
                        edu.system.alert("Dữ liệu vào không đúng!", "w");
                    }
                }
                else {
                    edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + data.Message, "w");
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
    compare_Table: function () {
        var me = this;
        var arrNew = [];
        var arrTableSpaceSourceNew = [];
        var arrEdit = [];
        me.arrOrigin = [];
        me.arrSource = [];
        me.iThuTu = 0;
        me.dtOrigin.forEach(function (item) {
            me.arrOrigin.push(item.TABLE_NAME);
        });
        me.dtSource.forEach(function (item) {
            me.arrSource.push(item.OBJECT_NAME);
            me.arrTableSpaceSource.push(item.TABLESPACE_NAME);
        });
        for (var i = 0; i < me.arrSource.length; i++) {
            if (me.arrSource[i].includes("$")) continue;
            if (!me.arrOrigin.includes(me.arrSource[i])) {
                arrNew.push(me.arrSource[i]);
                arrTableSpaceSourceNew.push(me.arrTableSpaceSource[i]);
            }
            else {
                if (document.getElementById("bAddColumn").checked || document.getElementById("bModifyColumn").checked) {
                    arrEdit.push(me.arrSource[i]);
                }
            }
        }
        console.log(arrNew);
        var html = '';
        if (document.getElementById("bCreateTable").checked) {
            for (var i = 0; i < arrNew.length; i++) {
                me.iThuTu++;
                html += '<tr>';
                html += '<td style="text-align: center">' + me.iThuTu + '</td>';
                html += '<td style="text-align: center">CREATE</td>';
                html += '<td>' + arrNew[i] + '</td>';
                html += '<td></td>';
                html += '<td><input id="cmd_' + arrNew[i] + '" class="form-control" /></td>';
                html += '<td class="td-center td-fixed"><input type="checkbox" id="chkSelect_' + arrNew[i] + '" class="chkSelectOne" /></td>';
            }

            for (var i = 0; i < arrNew.length; i++) {
                me.getList_Property_Create(arrNew[i], arrTableSpaceSourceNew[i]);
            }
        }
        if (arrEdit.length > 0) {
            edu.system.genHTML_Progress("divprogess", arrEdit.length);
            for (var i = 0; i < arrEdit.length; i++) {
                me.getList_Property_Orgin(arrEdit[i]);
            }
        }
        
        $("#tbldata_CAE tbody").html(html);
    },

    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/

    getList_Property_Create: function (strTable, strTablespace) {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getTableProperty',
            'strConnect': $("#txtSearch_DataBase").val(),
            'strTable_Name': strTable
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var row = 'Create table ' + strTable + " (";
                    for (var i = 0; i < data.Data.length; i++) {
                        var obj = data.Data[i];
                        var strCheckNull = obj.NULLABLE == "Y" ? "NULL" : "NOT NULL";
                        row += obj.COLUMN_NAME + " " + obj.DATA_TYPE + "(" + obj.DATA_LENGTH + ") " + strCheckNull;
                        if (i < data.Data.length -1) row += ",";
                    }
                    row += ") "+
                        "PCTFREE     10 "+
                    "INITRANS    1 "+
                    "MAXTRANS    255 "+
                    "TABLESPACE  " + strTablespace+
                    " NOCACHE "+
                    "MONITORING "+
                    "NOPARALLEL "+
                    "LOGGING /";
                    $("#cmd_" + strTable).val(row);
                }
                else {
                    edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + data.Message, "w");
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

    getList_Property_Orgin: function (strTable) {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getTableProperty',
            'strConnect': "",
            'strTable_Name': strTable
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_Property_Source(strTable, data.Data);
                }
                else {
                    edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + data.Message, "w");
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

    getList_Property_Source: function (strTable, dtOrigin) {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getTableProperty',
            'strConnect': $("#txtSearch_DataBase").val(),
            'strTable_Name': strTable
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var objSource = data.Data[i];
                        if (objSource.COLUMN_NAME.includes("$")) continue;
                        var objCompare = {};
                        var row = '';
                        var strLoai = "";
                        var bCheckNew = true;
                        for (var j = 0; j < dtOrigin.length; j++) {
                            if (objSource.COLUMN_NAME == dtOrigin[j].COLUMN_NAME) {
                                bCheckNew = false;
                                objCompare = dtOrigin[j];
                                break;
                            }
                        }
                        if (bCheckNew && document.getElementById("bAddColumn").checked) {
                            strLoai = "ADD";
                            var strCheckNull = objSource.NULLABLE == "Y" ? "NULL" : "NOT NULL";
                            row = 'ALTER TABLE ' + strTable + ' ADD ' + objSource.COLUMN_NAME + ' ' + objSource.DATA_TYPE + '(' + objSource.DATA_LENGTH + ') ' + strCheckNull +";";
                        }
                        else {
                            if (document.getElementById("bModifyColumn").checked && (objSource.DATA_TYPE != objCompare.DATA_TYPE || objSource.DATA_LENGTH != objCompare.DATA_LENGTH || objSource.NULLABLE != objCompare.NULLABLE)) {
                                strLoai = "MODIFY";
                                var strCheckNull = objSource.NULLABLE == "Y" ? "NULL" : "NOT NULL";
                                row = 'ALTER TABLE ' + strTable + ' MODIFY ' + objSource.COLUMN_NAME + ' ' + objSource.DATA_TYPE + '(' + objSource.DATA_LENGTH + ') ' + strCheckNull + ";";
                            }
                        }
                        if (row != "") {
                            var html = '';
                            me.iThuTu++;
                            html += '<tr>';
                            html += '<td style="text-align: center">' + me.iThuTu + '</td>';
                            html += '<td style="text-align: center">' + strLoai + '</td>';
                            html += '<td>' + strTable + '</td>';
                            html += '<td>' + objSource.COLUMN_NAME +'</td>';
                            html += '<td><input id="cmd_' + strTable + '" value="' + row +'" class="form-control" /></td>';
                            html += '<td class="td-center td-fixed"><input type="checkbox" id="chkSelect_' + strTable + '" class="chkSelectOne" /></td>';
                            $("#tbldata_CAE tbody").append(html);
                        }
                    }
                }
                edu.system.start_Progress("divprogess", function () { });

            },
            error: function (er) {

                edu.system.start_Progress("divprogess", function () { });
            },
            type: "GET",
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

    save_CreatAndAlterTable: function (strSQL) {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/CreatAndAlterTable',
            'strA': strSQL,
            'strB': $("#strMaPin").val()
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
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
    getList_Package: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getListPackage',
            'strConnect': $("#txtSearch_DataBase").val(),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        me.genTable_Package(data.Data);
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
    genTable_Package: function (data) {
        var jsonForm = {
            strTable_Id: "tbldata_PKG",
            aaData: data,
            colPos: {
                center: [0, 2],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "OBJECT_NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.OBJECT_NAME + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/
    getList_SourceLine: function (strPackage, strType) {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/getSourceLine',
            'strPackage': strPackage,
            'strType': strType,
            'strConnect': $("#txtSearch_DataBase").val(),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        var strSource = "create or replace ";
                        for (var i = 0; i < data.Data.length; i++) {
                            strSource += data.Data[i].TEXT;
                        }
                        me.save_CreatAndReplacePKG(strSource, strPackage, strType);
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
    save_CreatAndReplacePKG: function (strSQL, strPackage, strType) {
        var me = this;
        var obj_list = {
            'action': 'CMS_OraDBTableName/CreatAndAlterTable',
            'strA': strSQL,
            'strB': $("#strMaPin").val()
        };
        //$("#strMaPin").val("");

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công: " + strPackage + " - " + strType); 
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