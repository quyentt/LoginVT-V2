/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 19/04/2019
--Input: 
--Output:
--API URL: KeHoachToChuc/MonHoc
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function BaiHoc() { };
BaiHoc.prototype = {
    strBaiHoc_Id: '',
    strId: '',
    treenode: '',
    dtTab: '',
    dtBaiHoc: '',//danh sach bai hoc

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HeDaoTao();
        me.getList_ChuongTrinh();
        me.getList_KhoaDaoTao();
        me.getList_BaiHoc();
        me.getList_HocPhan();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_BaiHoc();
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
            if (edu.util.checkValue(me.strBaiHoc_Id)) {
                me.update_BaiHoc();
            }
            else {
                me.save_BaiHoc();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strBaiHoc_Id)) {
                me.update_BaiHoc();
            }
            else {
                me.save_BaiHoc();
            }
            me.rewrite();
        });
        $("[id$=chkSelectAll_BaiHoc]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblBaiHoc" });
        });
        $("#tblBaiHoc").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblBaiHoc", regexp: /checkX/g, });
        });
        $("#tblBaiHoc").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strBaiHoc_Id = strId;
                me.getDetail_BaiHoc(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblBaiHoc");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnXoaBaiHoc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaiHoc", "checkBH");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn bài học cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa bài học không?");
            $("#btnYes").click(function (e) {
               // $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    //me.delete_BaiHoc(arrChecked_Id[i]);
                    me.delete_BaiHoc(arrChecked_Id.toString());
                }
            });
            setTimeout(function () {
                me.getList_BaiHoc();
            }, 1000);
        });
        //$("#tblBaiHoc").delegate(".btnDelete", "click", function (e) {
        //    e.stopImmediatePropagation()
        //    var strId = this.id;
        //    strId = edu.util.cutPrefixId(/delete_/g, strId);
        //    if (edu.util.checkValue(strId)) {
        //        edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
        //        $("#btnYes").click(function (e) {
        //            me.delete_BaiHoc(strId);
        //        });
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});

        $("#btnSearch").click(function () {
            me.getList_BaiHoc("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_BaiHoc("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
            
            }
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
            me.getList_BaiHoc("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
            me.getList_BaiHoc("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_HocPhan();
            me.getList_BaiHoc("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        $("#dropSearch_HocPhan_ChuongTrinh").on("select2:select", function () {
            me.getList_BaiHoc("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaiHoc", "check");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn bài học cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_BaiHoc(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_BaiHoc]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChuongtblBaiHocTrinh" });
        });
        edu.util.viewValById("dropBaiHoc_ChuongTrinh", edu.util.getValById("dropSearch_ChuongTrinh"));
        edu.util.viewValById("dropBaiHoc_HocPhan", edu.util.getValById("dropSearch_HocPhan_ChuongTrinh"));
        //
        //me.arrValid_BaiHoc = [
        //    //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        //    { "MA": "dropChucDanh", "THONGTIN1": "EM" }
        //];
        //toggle_input_monhoc: function () {
        //    console.log(11111);
        //    edu.util.toggle_overide("zone-bus", "zone_input_monhoc");
        //},
        //toggle_list_monhoc: function () {
        //    edu.util.toggle_overide("zone-bus", "zone_list_monhoc");
        //},

        edu.system.uploadImport(["txtFile_Table"], me.import_Table);
        $("#btnCall_Import_Table").click(function () {
            $("#btnNotifyModal").remove();
            $('#myModal_Upload').modal('show');
            $("#notify_import").html('');
        });
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_BaiHoc");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_BaiHoc");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strBaiHoc_Id = "";
        edu.util.viewValById("dropBaiHoc_ChuongTrinh", edu.util.getValById('dropSearch_ChuongTrinh'));
        edu.util.viewValById("dropBaiHoc_HocPhan", edu.util.getValById('dropSearch_HocPhan_ChuongTrinh'));
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtKyHieu", "");
        edu.util.viewValById("txtCT_SoTiet", "");
        edu.util.viewValById("txtCT_NoiDung", "");
    },
    /*----------------------------------------------
    --Date of created: 19/04/2019
    --Discription: middleware
    ----------------------------------------------*/
    

    save_BaiHoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_BaiHoc/ThemMoi',
            

            'strId': '',
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropBaiHoc_HocPhan"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropBaiHoc_ChuongTrinh"),
            'strNoiDung': edu.util.getValById("txtCT_NoiDung"),
            'strTenBai': edu.util.getValById("txtTen"),
            'strKyHieu': edu.util.getValById("txtKyHieu"),
            'dSoTiet': edu.util.getValById("txtCT_SoTiet"),
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
                        me.getList_BaiHoc();
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

    update_BaiHoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_BaiHoc/CapNhat',
            

            'strId': me.strBaiHoc_Id,
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropBaiHoc_HocPhan"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropBaiHoc_ChuongTrinh"),
            'strNoiDung': edu.util.getValById("txtCT_NoiDung"),
            'strTenBai': edu.util.getValById("txtTen"),
            'strKyHieu': edu.util.getValById("txtKyHieu"),
            'dSoTiet': edu.util.getValById("txtCT_SoTiet"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaiHoc_Id = me.strBaiHoc_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_BaiHoc();
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
    getList_BaiHoc: function () {
        var me = main_doc.BaiHoc;

        //--Edit
        var obj_list = {
            'action': 'KHCT_BaiHoc/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropSearch_HocPhan_ChuongTrinh"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropSearch_ChuongTrinh"),
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
                    me.genTable_BaiHoc(dtResult, iPager);
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
    getDetail_BaiHoc: function (strId) {
        var me = main_doc.BaiHoc;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_BaiHoc/LayChiTiet',
            
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
                        me.viewForm_BaiHoc(data.Data[0]);
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
    delete_BaiHoc: function (Ids) {
        var me = main_doc.BaiHoc;
        var strIds = Ids;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_BaiHoc/Xoa',
            
            'strIds': strIds,
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
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_BaiHoc();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {

                //edu.system.alert("KHCT_BaiHoc/Xoa (er): " + JSON.stringify(er), "w");
                //content: "KHCT_BaiHoc/Xoa (er): " + JSON.stringify(er),
                //content: obj_delete + ": " + JSON.stringify(er),
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
    genTable_BaiHoc: function (data, iPager) {
        var me = main_doc.BaiHoc;
        $("#lblBaiHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblBaiHoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.BaiHoc.getList_BaiHoc()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 4, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "TENBAI"
                },
                {
                    "mDataProp": "KYHIEUBAI"
                },
                {
                    "mDataProp": "SOTIET"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkBH' + aData.ID + '"/>';
                    }
                }
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnDelete" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                //    }
                //}
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_BaiHoc: function (data) {
        var me = main_doc.BaiHoc;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtTen", data.TENBAI);
        edu.util.viewValById("txtKyHieu", data.KYHIEUBAI);
        edu.util.viewValById("dropBaiHoc_HocPhan", data.DAOTAO_HOCPHAN_ID);
        edu.util.viewValById("dropBaiHoc_ChuongTrinh", data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("txtCT_SoTiet", data.SOTIET);
        edu.util.viewValById("txtCT_NoiDung", data.NOIDUNG);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.BaiHoc;

        
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
        var me = main_doc.BaiHoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropHeDaoTao", "dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = main_doc.BaiHoc;

        
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
        var me = main_doc.BaiHoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropCT_KhoaDaoTao", "dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = main_doc.BaiHoc;

        
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
        var me = main_doc.BaiHoc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder"
            },
            renderPlace: ["dropBaiHoc_ChuongTrinh", "dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> hoc phan - chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_HocPhan: function () {
        var me = main_doc.BaiHoc;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_MonHoc_Id': "",
            'strThuocBoMon_Id': edu.util.getValById("dropBaiHoc_ChuongTrinh"),
            'strThuocTinhHocPhan_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtHocPhan_ChuongTrinh = dtResult;
                    }
                    me.genCombo_HocPhan(dtResult);
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
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                order: "unorder",
                mRender: function (row, aData) {
                    return aData.MA + " - " + aData.TEN;
                }
            },
            renderPlace: ["dropBaiHoc_HocPhan", "dropSearch_HocPhan_ChuongTrinh"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    import_Table: function (a, strPath) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_BaiHoc/Import',


            'strPath': strPath
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Message == "") {
                        $("#notify_import").html("Đã import hết dữ liệu");
                    } else {
                        $("#notify_import").html("Đã import<br/>Dữ liệu lỗi: " + data.Message);
                    }
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
}