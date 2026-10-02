/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/LopHoc
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function LopHoc() { };
LopHoc.prototype = {
    strLopHoc_Id: '',
    strId: '',
    treenode: '',
    dtTab: '',
    dtLopHoc: '',//danh sách lớp quản lý

    init: function () {
        var me = this;
        edu.system.page_load();
        me.getList_LopHoc();
        me.getList_CoCauToChuc();
        me.getList_KhoaDaoTao();
        me.getList_HeDaoTao();
        me.getList_ChuongTrinh();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinh_edit();
        me.getList_CoSoDaoTao();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.NHOMLOP", "dropPhanNhom,dropNhomLop,dropSearch_NhomLop");
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        //$(".btnSave").click(function () {
        //    me.save_LopHoc();
        //});
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strLopHoc_Id)) {
                me.update_LopHoc();
            }
            else {
                me.save_LopHoc();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strLopHoc_Id)) {
                me.update_LopHoc();
            }
            else {
                me.save_LopHoc();
            }
            me.rewrite();
        });

        $("#tblLopHoc").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strLopHoc_Id = strId;
                me.getDetail_LopHoc(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblLopHoc");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblLopHoc").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_LopHoc(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHoc", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_LopHoc(arrChecked_Id.toString());
            });
        });
        $("#tblLopHoc").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblLopHoc", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHoc" });
        });


        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
            me.getList_LopHoc();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
            me.getList_LopHoc();
        });

        //$("#dropSearch_HeDaoTao").on("select2:select", function () {
        //    me.getList_KhoaDaoTao();
        //});
        $("#dropKhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh_edit();
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_LopHoc();
        });
        $("#dropSearch_BoMon").on("select2:select", function () {
            //me.getList_CoCauToChuc();
            me.getList_LopHoc();
        });
        //$("#dropSearch_BoMon").on("select", function () {
        //});
        $("#btnSearch").click(function () {
            me.getList_LopHoc();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_LopHoc();
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHoc", "check");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn chương trình cần xóa!");
                return;
            }
            //edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_LopHoc(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_LopHoc]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHoc" });
        });
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAILOP", "dropLoaiLop, dropSearch_LoaiLop");

        /*------------------------------------------
        --Discription: KeThua
        --Discription:
        -------------------------------------------*/
        $("#btnPhanNhom").click(function () {
            $("#myModalPhanNhom").modal("show");
        });
        $("#btnSave_PhanNhom").click(function () {
            $('#myModalPhanNhom').modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHoc", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.confirm("Bạn có muốn phân nhóm lớp cho <span style='color: red'>" + arrChecked_Id.length + "</span> không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessPhanNhom"></div>');
                edu.system.genHTML_Progress("zoneprocessPhanNhom", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_PhanNhom(arrChecked_Id[i]);
                }
            });
        });
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_LopHoc");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_LopHoc");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strLopHoc_Id = "";
        edu.util.viewValById("dropLoaiLop", edu.util.getValById('dropSearch_LoaiLop'));
        edu.util.viewValById("dropKhoaDaoTao", edu.util.getValById('dropSearch_KhoaDaoTao'));
        me.getList_ChuongTrinh_edit(edu.util.getValById('dropSearch_ChuongTrinh'));
        edu.util.viewValById("dropToChucCT", edu.util.getValById('dropSearch_ChuongTrinh'));
        edu.util.viewValById("dropKhoaQuanLy", edu.util.getValById('dropSearch_BoMon'));
        edu.util.viewValById("dropNhomLop", edu.util.getValById('dropSearch_NhomLop'));
        edu.util.viewValById("txtMaLop", "");
        edu.util.viewValById("txtTenLop", "");
        edu.util.viewValById("txtSoLuongKeHoach", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        edu.util.viewValById("dropNganh2", 0);
        edu.util.viewValById("dropCoSoDaoTao", "");
    },

    toggle_input_lophoc: function () {
        console.log(11111);
        edu.util.toggle_overide("modal-title", "myModalLabel");
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrValid_LopHoc = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropChucDanh", "THONGTIN1": "EM" }
        ];
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: lop hoc
    ----------------------------------------------*/
    save_LopHoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eDS4xEDQgLw04',
            'func': 'pkg_kehoach_thongtin.Them_DaoTao_LopQuanLy',
            'iM': edu.system.iM,
            'strId': '',
            'strTen': edu.util.getValById("txtTenLop"),
            'strMa': edu.util.getValById("txtMaLop"),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropKhoaDaoTao"),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById("dropCoSoDaoTao"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropToChucCT"),
            'strThoiGianBatDau': edu.util.getValById("txtNgayBatDau"),
            'strNhomLop_Id': edu.util.getValById("dropNhomLop"),
            'strThoiGianKetThuc': edu.util.getValById("txtNgayKetThuc"),
            'strLoaiLop_Id': edu.util.getValById("dropLoaiLop"),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById("dropKhoaQuanLy"),
            'dSoLuongKeHoach': edu.system.getValById("txtSoLuongKeHoach"),
            'dLopMoNganh2': edu.system.getValById('dropNganh2'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropCoSoDaoTao'),
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
                        me.getList_LopHoc();
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

    save_PhanNhom: function (strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_LopQuanLy/Sua_DaoTao_LopQuanLy_Nhom',
            
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strNhomLop_Id': edu.util.getValById("dropPhanNhom"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phân nhóm thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            complete: function () {
                edu.system.start_Progress("zoneprocessPhanNhom", function () {
                    me.getList_LopHoc();
                });
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_LopHoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/EjQgHgUgLhUgLh4NLjEQNCAvDTgP',
            'func': 'pkg_kehoach_thongtin.Sua_DaoTao_LopQuanLy',
            'iM': edu.system.iM,

            'strId': me.strLopHoc_Id,
            'strTen': edu.util.getValById("txtTenLop"),
            'strMa': edu.util.getValById("txtMaLop"),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropKhoaDaoTao"),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById("dropCoSoDaoTao"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropToChucCT"),
            'strThoiGianBatDau': edu.util.getValById("txtNgayBatDau"),
            'strThoiGianKetThuc': edu.util.getValById("txtNgayKetThuc"),
            'strLoaiLop_Id': edu.util.getValById("dropLoaiLop"),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById("dropKhoaQuanLy"),
            'dSoLuongKeHoach': edu.system.getValById("txtSoLuongKeHoach"),
            'dLopMoNganh2': edu.system.getValById('dropNganh2'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropCoSoDaoTao'),
            'strNhomLop_Id': edu.util.getValById("dropNhomLop"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        console.log(obj_save)
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strLopHoc_Id = me.strLopHoc_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_LopHoc();
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

    getList_LopHoc: function () {
        var me = main_doc.LopHoc;

        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropSearch_CoSoDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strDaoTao_Nganh_Id': edu.util.getValById("dropSearch_BoMon"),
            'strDaoTao_KhoaQuanLy_Id': edu.system.getValById('dropSearch_BoMon'),
            'strDaoTao_LoaiLop_Id': edu.util.getValById("dropSearch_LoaiLop"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropSearch_ChuongTrinh"),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
            'dLopMoNganh2': edu.system.getValById('dropSearch_Nganh2'),
            'strNhomlop_Id': edu.util.getValById('dropSearch_NhomLop'),
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
                    me.genTable_LopHoc(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
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
    getDetail_LopHoc: function (strId) {
        var me = main_doc.LopHoc;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_LopQuanLy/LayChiTiet',
            
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
                        me.viewForm_LopHoc(data.Data[0]);
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
    delete_LopHoc: function (Ids) {
        var me = main_doc.LopHoc;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_LopQuanLy/Xoa',
            
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
                    me.getList_LopHoc();
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
    genTable_LopHoc: function (data, iPager) {
        var me = main_doc.LopHoc;

        $("#lblLopQuanLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLopHoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.LopHoc.getList_LopHoc()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0,3, 4, 9, 10],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên lớp: ' + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                //        html += '<span>' + 'Khóa: ' + edu.util.returnEmpty(aData.DAOTAO_KHOADAOTAO_TEN) + "</span><br />";
                //        html += '<span>' + 'Chương trình: ' + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + "</span><br />";
                //        html += '<span>' + 'Khoa quản lý: ' + edu.util.returnEmpty(aData.DAOTAO_KHOAQUANLY_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //},
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.SOLUONGTHUCTE) + "/" + edu.util.returnEmpty(aData.SOLUONGKEHOACH);
                    }
                },
                {
                    "mDataProp": "LOAILOP_TEN"
                },
                {
                    "mDataProp": "NHOMLOP_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.LOPMONGANH2 == 1 ? "Ngành 2": "";
                    }
                },
                {
                    "mDataProp": "DAOTAO_COSODAOTAO_TEN"
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
    viewForm_LopHoc: function (data) {
        var me = main_doc.LopHoc;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtTenLop", data.TEN);
        edu.util.viewValById("txtMaLop", data.MA);
        edu.util.viewValById("dropLoaiLop", data.LOAILOP_ID);
        edu.util.viewValById("dropKhoaDaoTao", data.DAOTAO_KHOADAOTAO_ID);
        //edu.util.viewValById("dropToChucCT", data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("dropCoSoDaoTao", data.DAOTAO_BACDAOTAO_ID); // chua tra ve csđt
        edu.util.viewValById("dropKhoaQuanLy", data.DAOTAO_KHOAQUANLY_ID);
        edu.util.viewValById("txtSoLuongKeHoach", data.SOLUONGKEHOACH);
        edu.util.viewValById("txtNgayBatDau", data.THOIGIANBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.THOIGIANKETTHUC);
        edu.util.viewValById("dropNhomLop", data.NHOMLOP_ID);
        edu.util.viewValById("dropNganh2", data.LOPMONGANH2);
        edu.util.viewValById("dropCoSoDaoTao", data.DAOTAO_COSODAOTAO_ID);
        me.getList_ChuongTrinh_edit(data.DAOTAO_TOCHUCCHUONGTRINH_ID);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> CCTC
    --Author: duyentt
	-------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.LopHoc;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
    },
    genCombo_CoCauToChuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropKhoaQuanLy", "dropSearch_BoMon"],
            title: "Chọn cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.LopHoc;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (data) {
        var me = main_doc.LopHoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = main_doc.LopHoc;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (data) {
        var me = main_doc.LopHoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropKhoaDaoTao", "dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = main_doc.LopHoc;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinh(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_N_CN_Id': "",
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinh: function (data) {
        var me = main_doc.LopHoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return aData.TENCHUONGTRINH + " - " + edu.util.returnEmpty(aData.MACHUONGTRINH)
                }
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh_edit: function (strDefault_Id) {
        var me = main_doc.LopHoc;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinh_edit(dtResult, strDefault_Id);
                }
                else {
                    edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropKhoaDaoTao"),
                'strDaoTao_HeDaoTao_Id': "",
                'strDaoTao_N_CN_Id': "",
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinh_edit: function (data, strDefault_Id) {
        var me = main_doc.LopHoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return aData.TENCHUONGTRINH + " - " + edu.util.returnEmpty(aData.DAOTAO_N_CN_MA)
                },
                default_val: strDefault_Id
            },
            renderPlace: ["dropToChucCT"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_CoSoDaoTao: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_CoSoDaoTao(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_CoSoDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder",
            },
            renderPlace: ["dropSearch_CoSoDaoTao", "dropCoSoDaoTao"],
            title: "Chọn cơ sở đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
}