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
function ExportTable() { };
ExportTable.prototype = {
    
    init: function () {
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        var me = this;
        $("#btnSearch").click(function () {
            me.getList_Table();
        });
        $("#btnDownloadFile").click(function () {
            me.report_Table();
        });
        $("#txtSearch_DataBase").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_Table();
            }
        });

        $("#btnCall_Import_Table").click(function () {
            me.popup_import();
        });
        /*------------------------------------------
        --Discription: [2] Tính năng dành riêng cho GM Azz
        -------------------------------------------*/
        //if (edu.system.userId == "4038E6FD0FFA4D339FA991E740348F01") {
        //    edu.system.uploadImport(["txtFile_Table"], me.import_Table);
        //}
        edu.system.uploadImport(["txtFile_Table"], me.import_Table);
    },
    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/
    getList_Table: function () {
        var me = this;

        //--Edit
        var strDataBaseName = edu.util.getValById("txtSearch_DataBase");
        if (!edu.util.checkValue(strDataBaseName)) {
            edu.system.alert("Vui lòng nhập id database", "w");
            return;
        }
        var obj_list = {
            'action': 'CMS_OraDBTableName/LayDanhSach',
            'strDataBaseName': strDataBaseName
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        me.cbGenCombo_Table(data.Data);
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
	--Discription: [4] Gen HTML ==> UngDung
	--Author: nnthuong
	-------------------------------------------*/
    cbGenCombo_Table: function (data) {
        var me = this;
        me.dtUngDung = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "TABLE_NAME",
                parentId: "",
                name: "TABLE_NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DataTable"],
            type: "",
            title: "Chọn bảng dữ liệu"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4] Gen HTML ==> UngDung
	--Author: nnthuong
	-------------------------------------------*/
    report_Table: function () {
        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        //
        var strTableNames = $("#dropSearch_DataTable").val();
        if (strTableNames.length == 0) {
            strTableNames = $("#txtQuery").val();
        } else {
            strTableNames = strTableNames.toString();
        }
        var url_report = edu.system.rootPathReport + "/Modules/Common/ExportDataInTable.aspx?strTableNames=" + strTableNames;
        location.href = url_report;
        return;
    },
    import_Table: function (a, strPath) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_Import/ImportDataTable',
            

            'strPath': strPath
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.viewFiles("txtFile_Table", "");
                    $("#notify_import").html("Đã import dữ liệu: " + data.Message);
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_SVQT/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    }
};