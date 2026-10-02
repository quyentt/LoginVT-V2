/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/ChuongTrinh
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function ThamSoLamTron() { };
ThamSoLamTron.prototype = {
    treenode: '',
    strThamSoLamTron_Id: '',
    dtTab: '',
    dtThamSoLamTron: [],
    arrValid_ThamSoLamTron: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ThoiGianDaoTao();
        me.getList_ThamSoLamTron();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_ThamSoLamTron();
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
            if (edu.util.checkValue(me.strThamSoLamTron_Id)) {
                me.update_ThamSoLamTron();
            }
            else {
                me.save_ThamSoLamTron();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strThamSoLamTron_Id)) {
                me.update_ThamSoLamTron();
            }
            else {
                me.save_ThamSoLamTron();
            }
            me.rewrite();
        });
        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_ThamSoLamTron();
        });
        $("#dropSearch_LoaiDiemTrungBinh").on("select2:select", function () {
            me.getList_ThamSoLamTron();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.me.getList_ThamSoLamTron();
            }
        });

        $("#tblThamSoLamTron").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strThamSoLamTron_Id = strId;
                me.getDetail_ThamSoLamTron(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblThamSoLamTron");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        //$("#tblThamSoLamTron").delegate(".btnDelete", "click", function (e) {
        //    e.stopImmediatePropagation()
        //    var strId = this.id;
        //    strId = edu.util.cutPrefixId(/delete_/g, strId);
        //    if (edu.util.checkValue(strId)) {
        //        edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
        //        $("#btnYes").click(function (e) {
        //            me.delete_ThamSoLamTron(strId);
        //        });
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
        $(".btnSearch").click(function () {
            me.getList_ThamSoLamTron("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThamSoLamTron", "checkThamSoLamTron");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_ThamSoLamTron(arrChecked_Id.toString());
            });
        });
        $("#tblThamSoLamTron").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblThamSoLamTron", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThamSoLamTron" });
        });

        me.arrValid_ThamSoLamTron = [
            { "MA": "txtNgayApDung", "THONGTIN1": "EM" },
            { "MA": "dropLamTron", "THONGTIN1": "EM" },
            // { "MA": "strDaoTao_ThoiGianDaoTao_Id", "THONGTIN1": "EM" },
            { "MA": "txtSoLeSauDauPhay", "THONGTIN1": "EM" },
            { "MA": "txtMoTa", "THONGTIN1": "EM" },
        ];
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.NCN", "dropCT_DaoTao_N_CN");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDIEMTRUNGBINH", "dropLoaiDiemTrungBinh, dropSearch_LoaiDiemTrungBinh");////
    },
    page_load: function () {
        var me = this;
        me.getList_ThoiGianDaoTao();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        

        setTimeout(function () {
            me.getList_ThamSoLamTron();
        }, 150);
        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_ThamSoLamTron");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_ThamSoLamTron");
    },
    //toggle_detail: function () {
    //    edu.util.toggle_overide("zone-bus", "zone_detail_TTS");
    //},

    rewrite: function () {
        //reset id
        var me = main_doc.ThamSoLamTron ;
        //
        me.strThamSoLamTron_Id = "";
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById('dropSearch_ThoiGianDaoTao'));
        edu.util.viewValById("dropLoaiDiemTrungBinh", edu.util.getValById('dropSearch_LoaiDiemTrungBinh'));
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("dropLamTron", "");
        edu.util.viewValById("txtSoLeSauDauPhay", "");
        edu.util.viewValById("txtMoTa", "");
    },

    save_ThamSoLamTron: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoLamTron/ThemMoi',
            

            'strId': '',
            'strLoaiDiemTrungBinh_Id': edu.util.getValById("dropLoaiDiemTrungBinh"),
            'dCoLamTron': edu.util.getValById("dropLamTron"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropThoiGianDaoTao"),
            'dSoLeSauDauPhay': edu.util.getValById("txtSoLeSauDauPhay"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNgayApDung': edu.util.getValById("txtNgayApDung"),
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
                        me.getList_ThamSoLamTron();
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
    update_ThamSoLamTron: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoLamTron/CapNhat',
            

            'strId': me.strThamSoLamTron_Id,
            'strLoaiDiemTrungBinh_Id': edu.util.getValById("dropLoaiDiemTrungBinh"),
            'dCoLamTron': edu.util.getValById("dropLamTron"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropThoiGianDaoTao"),
            'dSoLeSauDauPhay': edu.util.getValById("txtSoLeSauDauPhay"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNgayApDung': edu.util.getValById("txtNgayApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strThamSoLamTron_Id = me.strThamSoLamTron_Id;
                    me.getList_ThamSoLamTron();
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
    getList_ThamSoLamTron: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoLamTron/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
            'strLoaiDiemTrungBinh_Id': edu.util.getValById("dropSearch_LoaiDiemTrungBinh"),
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
                    me.genTable_ThamSoLamTron(dtResult, iPager);
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
    getDetail_ThamSoLamTron: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_ThamSoLamTron/LayChiTiet',
            
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
                        me.viewForm_ThamSoLamTron(data.Data[0]);
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
    //getDetail_ChuongTrinh_Full: function (strId, strAction) {
    //    var me = this;
    //    edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID", me.viewEdit_ChuongTrinh);
    //},
    delete_ThamSoLamTron: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoLamTron/Xoa',
            
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
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
                me.getList_ThamSoLamTron();
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
    genTable_ThamSoLamTron: function (data, iPager) {
        var me = this;
        $("#lblThamSoLamTron_Tong").html(iPager);
        //edu.util.viewHTMLById("lblThamSoLamTron_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblThamSoLamTron",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThamSoLamTron.getList_ThamSoLamTron()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 2, 3, 4, 5, 6],
                //left: [1],
                //fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Loại điểm trung bình: ' + edu.util.returnEmpty(aData.LOAIDIEMTRUNGBINH_TEN) + "</span><br />";
                //        html += '<span>' + 'Thời gian đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_NAM) + ' - ' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_KY) + ' - ' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) +"</span><br />";
                //        html += '<span>' + 'Số lẻ sau dấu phẩy: ' + edu.util.returnEmpty(aData.SOLESAUDAUPHAY) + "</span><br />";
                //        html += '<span>' + 'Ngày áp dụng: ' + edu.util.returnEmpty(aData.NGAYAPDUNG) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                
                {
                    "mDataProp": "LOAIDIEMTRUNGBINH_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_NAM) + ' - ' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_KY) + ' - ' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + "</span><br />";
                        html += '</span>';
                        return html;
                    }

                },
                {
                    "mDataProp": "SOLESAUDAUPHAY"
                },
                {
                    "mDataProp": "NGAYAPDUNG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkThamSoLamTron' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_ThamSoLamTron: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("dropLoaiDiemTrungBinh", data.LOAIDIEMTRUNGBINH_ID);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("dropLamTron", data.COLAMTRON);
        edu.util.viewValById("txtSoLeSauDauPhay", data.SOLESAUDAUPHAY);
        edu.util.viewValById("txtMoTa", data.MOTA);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_ThoiGianDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDAOTAO_NAM_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropThoiGianDaoTao", "dropSearch_ThoiGianDaoTao"],
            title: "Chọn thời gian đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
};