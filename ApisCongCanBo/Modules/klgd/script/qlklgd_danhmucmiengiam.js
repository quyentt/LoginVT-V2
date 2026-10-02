function qlklgd_danhmucmiengiam() { };
qlklgd_danhmucmiengiam.prototype = {
    dtDanhMucMienGiam:[],     
    strErr: '', 
    strMienGiamId:'',

    init: function () {
        var me = this;
        me.page_load();

        $('#drpNamHoc').on('select2:select', function () {
          
            me.getList_tblDanhMucMienGiam(); 
        });
       
        $('#btnXoaMienGiam').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhMucMienGiam", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
             

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strMienGiamIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strMienGiamIds += arrChecked_Id[i] + ",";
                } 
                me.XoaMienGiam(strMienGiamIds);
            });


        });
        $("#btnShowThemMoi").click(function () {
            
            if (edu.util.getValById('drpNamHoc') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
            me.strMienGiamId = '';
            $('#txtMaMienGiam').val('');
            $('#txtTenMienGiam').val('');
            $('#txtMienGiamGiangDay').val('');
            $('#txtMienGiamNCKH').val('');
            
            $("#modalDanhMucMienGiam").modal('show');
        });
        $("#tblDanhMucMienGiam").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strMienGiamId = strId;
            var dt = edu.util.objGetDataInData(me.strMienGiamId, me.dtDanhMucMienGiam, "ID");
          
            $('#txtMaMienGiam').val(dt[0].CODE);
            $('#txtTenMienGiam').val(dt[0].NAME);
            $('#txtMienGiamGiangDay').val( dt[0].MIENGIAMGD);
            $('#txtMienGiamNCKH').val( dt[0].MIENGIAMNCKH);
            $("#drpKieuMienGiamGiangDay").val(dt[0].KIEUMIENGIAMGIANGDAY).trigger("change");
            $("#drpKieuMienGiamNCKH").val(dt[0].KIEUMIENGIAMNCKH).trigger("change");
            $("#modalDanhMucMienGiam").modal('show');
             
        });
        $("#btnCapNhat").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtMaMienGiam", "THONGTIN1": "EM" },
                { "MA": "txtTenMienGiam", "THONGTIN1": "EM" },
                { "MA": "txtMienGiamGiangDay", "THONGTIN1": "EM" },
                { "MA": "txtMienGiamNCKH", "THONGTIN1": "EM" },
                

            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            } 
            me.CapNhatMienGiam();
        }); 

      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_drpNamHoc();
        me.getList_tblDanhMucMienGiam();
        

    },
    getList_drpNamHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strLoaiThoiGian': 'NAMHOC',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_NamHoc(data.Data);

                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_NamHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMHOC",
                parentId: "",
                name: "NAMHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpNamHoc"],
            type: "",
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblDanhMucMienGiam: function () {
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhsachMienGiam',
            'versionAPI': 'v1.0',  
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblDanhMucMienGiam(data.Data, data.Pager);
                    me.dtDanhMucMienGiam = data.Data;
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_tblDanhMucMienGiam: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhMucMienGiam",
            aaData: data,

            sort: true,
            colPos: {
                center: [0, 1],
            },
            aoColumns: [
                {
                    "mDataProp": "CODE"
                },
                {
                    "mDataProp": "NAME"
                },
                {                     
                     "mRender": function (nRow, aData) {
                         var strReturn = '<span>' + aData.MIENGIAMGD + '</span>';
                         if (aData.KIEUMIENGIAMGIANGDAY == 'PHANTRAM')
                            strReturn = '<span>' + aData.MIENGIAMGD + ' % </span>';
                         if (aData.KIEUMIENGIAMGIANGDAY == 'TIET')
                            strReturn = '<span>' + aData.MIENGIAMGD + ' tiết </span>';
                        return strReturn;
                    }
                },
                { 
                    
                    "mRender": function (nRow, aData) {
                        var strReturn = '<span>' + aData.MIENGIAMNCKH + '</span>';
                        if (aData.KIEUMIENGIAMNCKH == 'PHANTRAM')
                            strReturn = '<span>' + aData.MIENGIAMNCKH + ' % </span>';
                        if (aData.KIEUMIENGIAMNCKH == 'TIET')
                            strReturn = '<span>' + aData.MIENGIAMNCKH + ' tiết </span>';
                            return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
                    }

                } ,
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<input type="checkbox" id="checkX' + aData.ID + '"/>';                        
                        return strReturn;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    XoaMienGiam: function (strMienGiamIds) {
        var me = this; 
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/XoaMienGiam',
            'versionAPI': 'v1.0',
            'strMienGiamIds': strMienGiamIds, 
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblDanhMucMienGiam();

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
         
    },
    CapNhatMienGiam: function () {
        var me = this;
      
        var obj_list = {
            'action': 'TKGG_QLKLGD/CapNhatMienGiam',
            'versionAPI': 'v1.0',
            'strId': me.strMienGiamId,
            'strMaMienGiam': edu.util.getValById('txtMaMienGiam'),
            'strTenMienGiam': edu.util.getValById('txtTenMienGiam'),
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strMienGiamGiangDay': edu.util.getValById('txtMienGiamGiangDay'),
            'strMienGiamNCKH': edu.util.getValById('txtMienGiamNCKH'),            
            'strKieuMienGiamGiangDay': edu.util.getValById('drpKieuMienGiamGiangDay'),            
            'strKieuMienGiamNCKH': edu.util.getValById('drpKieuMienGiamNCKH'),          

            'strNguoiThucHienId': edu.system.userId,
        };
        
        if (me.strMienGiamId == "") {
            obj_list.action = 'TKGG_QLKLGD/ThemMoiMienGiam';
            obj_list.strId = '';
            
        } 
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.strMienGiamId = data.Id;
                  
                    me.getList_tblDanhMucMienGiam();

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
     
}

