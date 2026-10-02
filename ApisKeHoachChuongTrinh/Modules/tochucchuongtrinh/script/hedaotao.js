/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 23/04/2019
--Input: 
--Output:
--API URL: KHCT/HeDaoTao
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HeDaoTao() { };
HeDaoTao.prototype = {
    strHeDaoTao_Id: '',
    treenode: '',
    dtTab: '',
    dtHeDaoTao: '',//danh sách hệ đào tạo

    init: function () {
        var me = this;
        edu.system.page_load();
        me.getList_HeDaoTao();
        //edu.system.loadToCombo_DanhMucDuLieu("TKGG.HEDT", "dropHP_HeDaoTao");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.COSODAOTAO", "dropHP_CoSoDaoTao"); //
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnRefresh").click(function () {
            me.getList_HeDaoTao();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strHeDaoTao_Id)) {
                me.update_HeDaoTao();
            }
            else {
                me.save_HeDaoTao();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strHeDaoTao_Id)) {
                me.update_HeDaoTao();
            }
            else {
                me.save_HeDaoTao();
            }
            me.rewrite();
        });
        $("#tblHeDaoTao").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strHeDaoTao_Id = strId;
                me.getDetail_HeDaoTao(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblHeDaoTao");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHeDaoTao").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HeDaoTao(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHeDaoTao", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_HeDaoTao(arrChecked_Id.toString());
            });
        });
        $("#tblHeDaoTao").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblHeDaoTao", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHeDaoTao" });
        });

        $("#dropSearch_BacDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
        });
        $("#dropSearch_HinhThucDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HeDaoTao();
            }
        });
        $("#btnSearch").click(function () {
            me.getList_HeDaoTao();
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHeDaoTao", "check");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn hệ đào tạo cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_HeDaoTao(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_HeDaoTao]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHeDaoTao" });
        });
        me.arrValid_HeDaoTao = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropChucDanh", "THONGTIN1": "EM" }
        ];
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.HTDT", "dropHinhThucDaoTao,dropSearch_HinhThucDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.BACDAOTAO", "dropBacDaoTao,dropSearch_BacDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropLoaiDoiTuong"); 
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        

        setTimeout(function () {
            me.getList_HeDaoTao();
        }, 150);
        //end_load: getDetail_HS
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strHeDaoTao_Id = "";
        edu.util.viewValById("dropBacDaoTao", edu.util.getValById('dropSearch_BacDaoTao'));
        edu.util.viewValById("dropHinhThucDaoTao", edu.util.getValById('dropSearch_HinhThucDaoTao'));
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropLoaiDoiTuong", "");
        //var arrId = ["txtMa", "txtTen", "dropHinhThucDaoTao", "dropBacDaoTao"];
        //edu.util.resetValByArrId(arrId);
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HeDaoTao");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_HeDaoTao");
    },

    save_HeDaoTao: function () {
        var me = main_doc.HeDaoTao;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HeDaoTao/ThemMoi',
            

            'strId': '',
            'strMaHeDaoTao': edu.util.getValById("txtMa"),
            'strTenHeDaoTao': edu.util.getValById("txtTen"),
            'strDaoTao_HinhThucDaoTao_Id': edu.util.getValById("dropHinhThucDaoTao"),
            'strDaoTao_BacDaoTao_Id': edu.util.getValById("dropBacDaoTao"),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropLoaiDoiTuong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                        
                    }

                    setTimeout(function () {
                        me.getList_HeDaoTao();
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    update_HeDaoTao: function () {
        var me = main_doc.HeDaoTao;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HeDaoTao/CapNhat',
            

            'strId': me.strHeDaoTao_Id,
            'strMaHeDaoTao': edu.util.getValById("txtMa"),
            'strTenHeDaoTao': edu.util.getValById("txtTen"),
            'strDaoTao_HinhThucDaoTao_Id': edu.util.getValById("dropHinhThucDaoTao"),
            'strDaoTao_BacDaoTao_Id': edu.util.getValById("dropBacDaoTao"),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropLoaiDoiTuong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strHeDaoTao_Id = me.strHeDaoTao_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_HeDaoTao();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_HeDaoTao: function () {
        var me = main_doc.HeDaoTao;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HeDaoTao/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_HinhThucDaoTao_Id': edu.util.getValById("dropSearch_HinhThucDaoTao"),
            'strDaoTao_BacDaoTao_Id': edu.util.getValById("dropSearch_BacDaoTao"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.genTable_HeDaoTao(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getDetail_HeDaoTao: function (strId) {
        var me = main_doc.HeDaoTao;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_HeDaoTao/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HeDaoTao(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_HeDaoTao: function (Ids) {
        var me = main_doc.HeDaoTao;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HeDaoTao/Xoa',
            
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
                    me.getList_HeDaoTao();
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

    genTable_HeDaoTao: function (data, iPager) {
        var me = main_doc.HeDaoTao;
        $("#lblHeDaoTao_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHeDaoTao",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HeDaoTao.getList_HeDaoTao()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 7, 6],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên hệ đào tạo: ' + edu.util.returnEmpty(aData.TENHEDAOTAO) + "</span><br />";
                //        html += '<span>' + 'Bậc đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_BACDAOTAO_TEN) + "</span><br />";
                //        html += '<span>' + 'Hình thức đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_HINHTHUCDAOTAO_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //},
                {
                    "mDataProp": "MAHEDAOTAO"
                },
                {
                    "mDataProp": "TENHEDAOTAO"
                },
                {
                    "mDataProp": "DAOTAO_HINHTHUCDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_BACDAOTAO_TEN"
                },
                {
                    "mDataProp": "PHANLOAIDOITUONG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
    },

    viewForm_HeDaoTao: function (data) {
        var me = main_doc.HeDaoTao;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtTen", data.TENHEDAOTAO);
        edu.util.viewValById("txtMa", data.MAHEDAOTAO);
        edu.util.viewValById("dropHinhThucDaoTao", data.DAOTAO_HINHTHUCDAOTAO_ID);
        edu.util.viewValById("dropBacDaoTao", data.DAOTAO_BACDAOTAO_ID);
        edu.util.viewValById("dropLoaiDoiTuong", data.PHANLOAIDOITUONG_ID);
    },
}