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
function CloudUpdate() { };
CloudUpdate.prototype = {
    
    init: function () {
        var me = this;

        edu.system.loadToCombo_DanhMucDuLieu("CMS.UCSV", "", "", me.genComBo_Server);
        edu.system.loadToCombo_DanhMucDuLieu("CMS.DUSER", "", "", me.genComBo_User);
        edu.system.loadToCombo_DanhMucDuLieu("CMS.UCPR", "dropProject", "", me.genTable_Project);

        $("#dropServer").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            localStorage.setItem("strStoreServer", strCha_Id);
        });
        $("#dropUser").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            localStorage.setItem("strStoreUser", strCha_Id);
        });

        $("#tblProject").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblProject", regexp: /checkX/g });
        });

        $("#btnUpCode").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblProject", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn update");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.CloudUpDate(arrChecked_Id.toString());
                }
            });
        });
        console.log(edu.util.checkEmpty(0));
    },

    genComBo_Server: function (data) {
        var default_val = localStorage.getItem("strStoreServer");
        var obj = {
            data: data,
            renderInfor: {
                id: "MA",
                parentId: "",
                name: "TEN",
                code: "MA",
                selectOne: true,
                default_val: default_val
            },
            renderPlace: ["dropServer"],
            type: "",
            title: "Chọn server"
        };
        edu.system.loadToCombo_data(obj);
    },
    genComBo_User: function (data) {
        var default_val = localStorage.getItem("strStoreUser");
        var obj = {
            data: data,
            renderInfor: {
                id: "MA",
                parentId: "",
                name: "TEN",
                code: "MA",
                selectOne: true,
                default_val: default_val
            },
            renderPlace: ["dropUser"],
            type: "",
            title: "Chọn tài khoản dropbox"
        };
        edu.system.loadToCombo_data(obj);
    },

    genTable_Project: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblProject",
            aaData: data,
            colPos: {
                center: [0, 2]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.TEN + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

    },

    CloudUpDate: function (strProject) {
        var me = this;
        var strServer = edu.util.getValById("dropServer");
        //--Edit
        var obj_list = {
            'action': 'CMS_UpCode/CloudUpdate',
            'strFileName': strProject,
            'strUser': edu.util.getValById("dropUser")
        };
        //
        if (strServer == "HIENTAI") {
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        edu.system.alert("Update thành công");
                    }
                    else {
                        edu.system.alert(data.Message);
                    }

                },
                error: function (er) {
                    edu.system.alert("Update thành công");
                },
                type: 'GET',
                action: obj_list.action,

                contentType: true,

                data: obj_list,
                fakedb: [

                ]
            }, false, false, false, null);
        } else {
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: strServer + "/CMSAPI/api/CMS_UpCode/CloudUpdate",
                success: function (data) {
                    if (data.Success) {
                        edu.system.alert("Update thành công");
                    }
                    else {
                        edu.system.alert(data.Message);
                    }

                },
                error: function (er) {
                    edu.system.alert("Update thành công");
                },
                data: obj_list,
                cache: false
            });
        }
        
    }
};