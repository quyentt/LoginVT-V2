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
function ThamSoChung() { };
ThamSoChung.prototype = {
    treenode: '',
    strThamSoChung_Id: '',
    dtTab: '',
    dtThamSoChung: [],
    arrValiD_ThamSoHocTapChung: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ThoiGianDaoTao();
        me.getList_ThamSoChung();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_ThamSoChung();
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
            if (edu.util.checkValue(me.strThamSoChung_Id)) {
                me.update_ThamSoChung();
            }
            else {
                me.save_ThamSoChung();
            }
        });
        $("#btnReWrite").click(function () {
            if (edu.util.checkValue(me.strThamSoChung_Id)) {
                me.update_ThamSoChung();
            }
            else {
                me.save_ThamSoChung();
            }
            me.rewrite();
        });

        $("#dropSearch_ThangDiemChuQuyDoi").on("select2:select", function () {
            me.getList_ThamSoChung();
        });
        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_ThamSoChung();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.me.getList_ThamSoChung();
            }
        });

        $("#tblThamSoHocTapChung").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strThamSoChung_Id = strId;
                me.getDetail_ThamSoChung(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblThamSoHocTapChung");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblThamSoHocTapChung").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThamSoChung(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearch").click(function () {
            me.getList_ThamSoChung("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThamSoHocTapChung", "checkThamSoChung");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_ThamSoChung(arrChecked_Id.toString());
            });
        });
        $("#tblThamSoHocTapChung").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblThamSoHocTapChung", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll_ThamSoHocTapChung]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThamSoHocTapChung" });
        });
        
        me.arrValiD_ThamSoHocTapChung = [
            { "MA": "dSoLanHocToiDa", "THONGTIN1": "EM" },
            { "MA": "dSoLanThiLaiToiDa", "THONGTIN1": "EM" },
           // { "MA": "strDaoTao_ThoiGianDaoTao_Id", "THONGTIN1": "EM" },
            { "MA": "strNgayApDung", "THONGTIN1": "EM" },
        ];

        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.NCN", "dropCT_DaoTao_N_CN");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.NTS", "dropNganhTuyenSinh");
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
            me.getList_ThamSoChung();
        }, 150);
        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_ThamSoHocTapChung");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_ThamSoHocTapChung");
    },
    //toggle_detail: function () {
    //    edu.util.toggle_overide("zone-bus", "zone_detail_TTS");
    //},

    rewrite: function () {
        //reset id
        var me = main_doc.ThamSoChung;
        //
        me.strThamSoChung_Id = "";
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById('dropSearch_ThoiGianDaoTao'));
        edu.util.viewValById("txtSoLanHocToiDa", "");
        edu.util.viewValById("txtSoLanThiToiDa", "");
        edu.util.viewValById("txtNgayApDung", "");
    },

    save_ThamSoChung: function () {
        var me = main_doc.ThamSoChung;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoHocTapChung/ThemMoi',
            

            'strId': '',
            'dSoLanHocToiDa': edu.util.getValById("txtSoLanHocToiDa"),
            'dSoLanThiLaiToiDa': edu.util.getValById("txtSoLanThiToiDa"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropThoiGianDaoTao"),
            'strNgayApDung': edu.util.getValById("txtNgayApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        edu.system.confirm('Thêm mới thành công! Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                    }

                    setTimeout(function () {
                        me.getList_ThamSoChung();
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
    update_ThamSoChung: function () {
        var me = main_doc.ThamSoChung;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoHocTapChung/CapNhat',
            

            'strId': me.strThamSoChung_Id,
            'dSoLanHocToiDa': edu.util.getValById("txtSoLanHocToiDa"),
            'dSoLanThiLaiToiDa': edu.util.getValById("txtSoLanThiToiDa"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropThoiGianDaoTao"),
            'strNgayApDung': edu.util.getValById("txtNgayApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strThamSoChung_Id = me.strThamSoChung_Id;
                    me.getList_ThamSoChung();
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
    getList_ThamSoChung: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoHocTapChung/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
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
                    me.genTable_ThamSoChung(dtResult, iPager);
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
    getDetail_ThamSoChung: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_ThamSoHocTapChung/LayChiTiet',
            
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
                        me.viewForm_ThamSoChung(data.Data[0]);
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
    delete_ThamSoChung: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoHocTapChung/Xoa',
            
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
                
                me.getList_ThamSoChung();
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
    genTable_ThamSoChung: function (data, iPager) {
        var me = this;
        $("#lblThamSoHocTapChung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThamSoHocTapChung",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThamSoChung.getList_ThamSoChung()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            sort: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Số lần học tối đa: ' + edu.util.returnEmpty(aData.SOLANHOCTOIDA) + "</span><br />";
                //        html += '<span>' + 'Số lần thi tối đa: ' + edu.util.returnEmpty(aData.SOLANTHILAITOIDA) + "</span><br />";
                //        html += '<span>' + 'Thời gian đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_NAM) + ' - ' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_KY) + ' - ' + edu.util.returnEmpty(aData.DAOTAO_THOIGIANDAOTAO_DOT) + "</span><br />";
                //        html += '<span>' + 'Ngày áp dụng: ' + edu.util.returnEmpty(aData.NGAYAPDUNG) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }

                //}
                {
                    "mDataProp": "SOLANHOCTOIDA"
                },
                {
                    "mDataProp": "SOLANTHILAITOIDA"
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
                    "mDataProp": "NGAYAPDUNG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkThamSoChung' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_ThamSoChung: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtSoLanHocToiDa", data.SOLANHOCTOIDA);
        edu.util.viewValById("txtSoLanThiToiDa", data.SOLANTHILAITOIDA);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
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
        console.log(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                order: "unorder",
            },
            renderPlace: ["dropThoiGianDaoTao", "dropSearch_ThoiGianDaoTao"],
            title: "Chọn thời gian đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
};