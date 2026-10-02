/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function ThietLapCacLopHocPhan() { };
ThietLapCacLopHocPhan.prototype = {
    bcheckPhanLoaiLop: false, //dùng khi chọn nhiều lớp
    dtChuongTrinh: [],
    dtPhanLoaiLop: [],
    dtThoiGianDaoTao: [],
    strChuongTrinh_Id: '',
    strLopHocPhan_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        var ilength = window.innerHeight - $("#tblChuongTrinh").offset().top;
        $("#tblChuongTrinh").parent().attr("style", "height: 100%; overflow-y: hidden;");

        me.getList_ThoiGianDaoTao();
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAITINHKHOILUONG", "", "", me.loadToCombo_PhanLoaiLop);
        //me.getList_HocPhan();
        //me.getList_ChuongTrinh();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/

        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
        });
        $("#btnSearch").click(function () {
            me.getList_ChuongTrinh();
        });

        $("#tblChuongTrinh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strChuongTrinh_Id = strId;
            me.toggle_Edit()
            edu.util.setOne_BgRow(strId, "tblChuongTrinh");
            var data = edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID")[0];
            me.getList_LopHocPhan_ChuongTrinh(strId);
            me.viewForm_ChuongTrinh(data);
        });

        $(".btnClose_PhanLoaiLop").click(function () {
            me.toggle_ChuongTrinh();
        });
        
        $("#btn_PhanLoaiLop1,#btn_PhanLoaiLop").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanLoaiLop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.update_LopHocPhan_ChuongTrinh(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    edu.system.alert("Cập nhật thành công")
                    me.getList_LopHocPhan_ChuongTrinh();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#btn_PhamViLop1,#btn_PhamViLop").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanLoaiLop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.update_PhamVi_LopHocPhan_ChuongTrinh(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    edu.system.alert("Cập nhật thành công")
                    me.getList_LopHocPhan_ChuongTrinh();
                }, arrChecked_Id.length * 50);
            });
        });
        $("[id$=chkSelectAll_PhanLoaiLop]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhanLoaiLop" });
        });

    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //edu.system.loadToCombo_DanhMucDuLieu("TKB_PHANGIANG.XNKK", "", "", me.loadBtnXacNhan, "Tất cả tình trạng xác nhận", "HESO1");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAITINHKHOILUONG", "dropPhanLoaiLop");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD_PHANLOAIPHAMVI", "dropPhamViLop");
        me.getList_ThoiGianDaoTao();
    },
    
    toggle_Edit: function () {
        var me = this;
        edu.util.toggle_overide("zonecontent", "zoneEdit");
        var ilength = window.innerHeight - 162;
        $("#tblPhanLoaiLop").parent().attr("style", "height: " + ilength + "px; overflow-y: scroll;");
    },
    toggle_ChuongTrinh: function () {
        var me = this;
        edu.util.toggle_overide("zonecontent", "zone_TimKiem");
        var ilength = window.innerHeight - 162;
        $("#tblPhanLoaiLop").parent().attr("style", "height: " + ilength + "px; overflow-y: scroll;");
        me.getList_ChuongTrinh();
    },


    //loadToCombo_PhanLoaiLop: function (data) {
    //    main_doc.ThietLapCacLopHocPhan.dtPhanLoaiLop = data;
    //},
    //genCombo_PhanLoaiLop: function (strDrop_Id, default_val) {
    //    var me = this;
    //    var obj = {
    //        data: me.dtPhanLoaiLop,
    //        renderInfor: {
    //            id: "ID",
    //            parentId: "",
    //            name: "PHANLOAITINHKHOILUONG_ID",//
    //            default_val: default_val
    //        },
    //        renderPlace: [strDrop_Id],
    //        title: "Chọn phân loại lớp"
    //    };
    //    edu.system.loadToCombo_data(obj);
    //    $("#" + strDrop_Id).select2();
    //},
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
        var me = main_doc.ThietLapCacLopHocPhan;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
            title: "Chọn thời gian đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = main_doc.ThietLapCacLopHocPhan;

        //--Edit
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDSChuongTrinh',


            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.dtChuongTrinh = dtResult;
                    me.genTable_ChuongTrinh(dtResult, iPager);
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
    genTable_ChuongTrinh: function (data, iPager) {
        var me = main_doc.ThietLapCacLopHocPhan;
        $("#lblChuongTrinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChuongTrinh",
            aaData: data,
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            //bPaginate: {
            //    strFuntionName: "main_doc.ThietLapCacLopHocPhan.getList_ChuongTrinh()",
            //    iDataRow: iPager
            //},
            //bHiddenHeader: true,
            colPos: {
                center: [0],
                fix: [0]
            },
            aoColumns: [
            {
                 "mDataProp": "DAOTAO_HEDAOTAO_TEN"
            },
            {
                "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
            },
            {
                "mRender": function (nRow, aData) {
                    var html = '';
                    html += '<span>' + edu.util.returnEmpty(aData.CHUONGTRINH_TEN) + "</span><br />";
                    return html;
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> Lớp học phần
    --Author: duyentt
    -------------------------------------------*/
    getList_LopHocPhan_ChuongTrinh: function (strId) {
        var me = main_doc.ThietLapCacLopHocPhan;
        if (strId == undefined) strId = me.strChuongTrinh_Id;
        //--Edit
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDSLopHocPhan',


            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_HeDaoTao_Id': "",
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhanLoaiLop= data.Data.rsPhanLoai;
                    me.genTable_LopHocPhan_ChuongTrinh(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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

    genTable_LopHocPhan_ChuongTrinh: function (data, iPager) {
        var me = this;
        if (iPager == null) iPager = data.length;
        var strTableId = "tblPhanLoaiLop";
        var jsonForm = {
            strTable_Id: strTableId,
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOPHOCPHAN_DAYDU"
                },
                {
                    "mDataProp": "PHANLOAITINHKHOILUONG_TEN"
                },
                {
                    "mDataProp": "PHANLOAIPHAMVI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
      
        //var x = document.getElementById(strTableId).getElementsByTagName('tbody')[0].rows;
        //for (var i = 0; i < x.length; i++) {
        //    x[i].id = '';
        //}
        //me.collageInTable({
        //    strTable_Id: strTableId,
        //    iBatDau: 1,
        //    iKetThuc: 1,
        //    arrStr: [2, 3, 4, 5, 6, 7]
        //});
        /*III. Callback*/
    },

    viewForm_ChuongTrinh: function (data) {
        var me = this;
        console.log(data);
        edu.util.viewHTMLById("lblPhanLoaiLop_ChuongTrinh", data.CHUONGTRINH_TEN);
        edu.util.viewHTMLById("lblPhanLoaiLop_Khoa", data.DAOTAO_KHOADAOTAO_TEN);
        edu.util.viewHTMLById("lblPhanLoaiLop_He", data.DAOTAO_HEDAOTAO_TEN);
    },

    update_LopHocPhan_ChuongTrinh: function (strLopHocPhan_Id) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'KHCT_LichGiang/Sua_ThongTinLopHocPhan',

            'strIdLopHocPhan': strLopHocPhan_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanLoaiLopTinhKL_Id': edu.util.getValById("dropPhanLoaiLop"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    //me.getList_LopHocPhan_ChuongTrinh();
                }
                else {
                    edu.system.alert(data.Message)
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_PhamVi_LopHocPhan_ChuongTrinh: function (strLopHocPhan_Id) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'KHCT_LichGiang/Sua_PhamViLopHocPhan',

            'strIdLopHocPhan': strLopHocPhan_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanLoaiPhamVi_Id': edu.util.getValById("dropPhamViLop"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    //me.getList_LopHocPhan_ChuongTrinh();
                }
                else {
                    edu.system.alert(data.Message)
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
};
