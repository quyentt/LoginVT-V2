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
function CongThucDiem() { };
CongThucDiem.prototype = {
    treenode: '',
    strCongThucDiem_Id: '',
    dtTab: '',
    dtCongThucDiem: [],
    arrValid_CongThucDiem: [],

    init: function () {
        var me = this;
        me.getList_CongThucDiem();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ThanhPhanDiem();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_CongThucDiem();
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
            if (edu.util.checkValue(me.strCongThucDiem_Id)) {
                me.update_CongThucDiem();
            }
            else {
                me.save_CongThucDiem();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strCongThucDiem_Id)) {
                me.update_CongThucDiem();
            }
            else {
                me.save_CongThucDiem();
            }
            me.rewrite();
        });

        $("#dropSearch_ThanhPhanDiem").on("select2:select", function () {
            me.getList_CongThucDiem();
        });
        $("#dropSearch_MoHinhXuLy").on("select2:select", function () {
            me.getList_CongThucDiem();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.me.getList_CongThucDiem();
            }
        });
        $("#tblCongThucDiem").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strCongThucDiem_Id = strId;
                me.getDetail_CongThucDiem(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblCongThucDiem");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        //$("#tblCongThucDiem").delegate(".btnDelete", "click", function (e) {
        //    e.stopImmediatePropagation()
        //    var strId = this.id;
        //    strId = edu.util.cutPrefixId(/delete_/g, strId);
        //    if (edu.util.checkValue(strId)) {
        //        edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
        //        $("#btnYes").click(function (e) {
        //            me.delete_CongThucDiem(strId);
        //        });
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
        $(".btnSearch").click(function () {
            me.getList_CongThucDiem("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_ThanhPhanDiem"));
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCongThucDiem", "checkCongThucDiem");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_CongThucDiem(arrChecked_Id.toString());
            });
        });

        $("#tblCongThucDiem").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblCongThucDiem", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCongThucDiem" });
        });
        me.arrValid_CongThucDiem = [
            { "MA": "txtTen", "THONGTIN1": "EM" },
            { "MA": "txtMa", "THONGTIN1": "EM" },
            //{ "MA": "dropThanhPhanDiem", "THONGTIN1": "EM" },
            { "MA": "txtXauCongThuc", "THONGTIN1": "EM" },
            { "MA": "dropMoHinhXuLy", "THONGTIN1": "EM" },
        ];
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.MOHINHCONGTHUC", "dropMoHinhXuLy, dropSearch_MoHinhXuLy");
    },
    page_load: function () {
        var me = this;
        me.getList_ThanhPhanDiem();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        

        setTimeout(function () {
            me.getList_CongThucDiem();
        }, 150);
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_CongThucDiem");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_CongThucDiem");
    },
    //toggle_detail: function () {
    //    edu.util.toggle_overide("zone-bus", "zone_detail_TTS");
    //},

    rewrite: function () {
        //reset id
        var me = main_doc.CongThucDiem;
        //
        me.strCongThucDiem_Id = "";
        edu.util.viewValById("dropThanhPhanDiem", edu.util.getValById('dropSearch_ThanhPhanDiem'));
        edu.util.viewValById("dropMoHinhXuLy", edu.util.getValById('dropSearch_MoHinhXuLy'));
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtXauCongThuc", "");
        edu.util.viewValById("dropMoHinhThongHop", "");
        edu.util.viewValById("dropCTKhongCanBang", 0);
        edu.util.viewValById("txtSoThanhPhanToiThieu", "");
    },

    save_CongThucDiem: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin/Them_Diem_CongThucDiem',
            

            'strId': '',
            'strMa': edu.util.getValById("txtMa"),
            'strTen': edu.util.getValById("txtTen"),
            'strXauCongThuc': edu.util.getValById("txtXauCongThuc"),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById("dropThanhPhanDiem"),
            'strMoHinhXuLy_Id': edu.util.getValById("dropMoHinhXuLy"),
            'dSoThanhPhanToiThieu': edu.util.getValById('txtSoThanhPhanToiThieu'),
            'dTongHopKhiDuDiem': edu.util.getValById('dropMoHinhThongHop'),
            'dCongThucKhongCanBang': edu.util.getValById('dropCTKhongCanBang'),
            'dThuTu': "",
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
                        me.getList_CongThucDiem();
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
    update_CongThucDiem: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin/Sua_Diem_CongThucDiem',
            

            'strId': me.strCongThucDiem_Id,
            'strMa': edu.util.getValById("txtMa"), 
            'strTen': edu.util.getValById("txtTen"),
            'strXauCongThuc': edu.util.getValById("txtXauCongThuc"),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById("dropThanhPhanDiem"),
            'strMoHinhXuLy_Id': edu.util.getValById("dropMoHinhXuLy"),
            'dSoThanhPhanToiThieu': edu.util.getValById('txtSoThanhPhanToiThieu'),
            'dTongHopKhiDuDiem': edu.util.getValById('dropMoHinhThongHop'),
            'dCongThucKhongCanBang': edu.util.getValById('dropCTKhongCanBang'),
            'dThuTu': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strCongThucDiem_Id = me.strCongThucDiem_Id;
                    me.getList_CongThucDiem();
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
    getList_CongThucDiem: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_CongThucDiem/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById("dropSearch_ThanhPhanDiem"),
            'strMoHinhXuLy_Id': edu.util.getValById("dropSearch_MoHinhXuLy"),
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
                    me.genTable_CongThucDiem(dtResult, iPager);
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
    getDetail_CongThucDiem: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_CongThucDiem/LayChiTiet',
            
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
                        me.viewForm_CongThucDiem(data.Data[0]);
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
    delete_CongThucDiem: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_CongThucDiem/Xoa',
            
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
                
                me.getList_CongThucDiem();
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
    genTable_CongThucDiem: function (data, iPager) {
        var me = this;
        $("#lblCongThucDiem_Tong").html(iPager);
        //edu.util.viewHTMLById("lblCongThucDiem_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblCongThucDiem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CongThucDiem.getList_CongThucDiem()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 5, 6],
                //left: [1],
                //fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên công thức: ' + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                //        html += '<span>' + 'Điểm thành phần: ' + edu.util.returnEmpty(aData.DIEM_THANHPHANDIEM_TEN) + "</span><br />";
                //        html += '<span>' + 'Mô hình xử lý: ' + edu.util.returnEmpty(aData.MOHINHXULY_TEN) + "</span><br />";
                //        html += '<span>' + 'Xâu công thức: ' + edu.util.returnEmpty(aData.XAUCONGTHUC) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "MOHINHXULY_TEN"
                },
                {
                    "mDataProp": "XAUCONGTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkCongThucDiem' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_CongThucDiem: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("dropThanhPhanDiem", data.DIEM_THANHPHANDIEM_ID);
        edu.util.viewValById("txtXauCongThuc", data.XAUCONGTHUC);
        edu.util.viewValById("dropMoHinhXuLy", data.MOHINHXULY_ID);
        edu.util.viewValById("txtSoThanhPhanToiThieu", data.SOTHANHPHANDIEMTOITHIEU);
        edu.util.viewValById("dropMoHinhThongHop", data.TONGHOPKHIDUDIEMTHANHPHAN);
        edu.util.viewValById("dropCTKhongCanBang", data.CONGTHUCKHONGCANBANG);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThanhPhanDiem: function () {
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
                    me.genCombo_ThanhPhanDiem(dtResult);
                }
                else {
                    edu.system.alert("D_ThanhPhanDiem/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("D_ThanhPhanDiem/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'D_ThanhPhanDiem/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strThangDiem_Id': "",
                'strQuyTacLamTron_Id': "",
                'dLaThanhPhanDiemCuoi': 0,
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThanhPhanDiem: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                order: "unorder"
            },
            renderPlace: ["dropThanhPhanDiem", "dropSearch_ThanhPhanDiem"],
            title: "Chọn thành phần điểm"
        };
        edu.system.loadToCombo_data(obj);
    },
};

