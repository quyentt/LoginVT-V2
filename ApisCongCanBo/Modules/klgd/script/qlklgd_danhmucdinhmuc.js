function qlklgd_danhmucdinhmuc() { };
qlklgd_danhmucdinhmuc.prototype = {
    dtDanhMucDinhMuc:[],     
    strErr: '', 
    strDinhMucId:'',

    init: function () {
        var me = this;
        me.page_load();

        $('#drpNamHoc').on('select2:select', function () {
          
            me.getList_tblDanhMucDinhMuc(); 
        });
       
        $('#btnXoaDinhMuc').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhMucDinhMuc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
             

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strDinhMucIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strDinhMucIds += arrChecked_Id[i] + ",";
                } 
                me.XoaDinhMuc(strDinhMucIds);
            });


        });
        $("#btnShowThemMoi").click(function () {
            
            if (edu.util.getValById('drpNamHoc') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
            me.strDinhMucId = '';
            $('#txtMaDinhMuc').val('');
            $('#txtTenDinhMuc').val('');
            $('#txtDinhMucGiangDay').val('');
            $('#txtDinhMucNCKH').val('');
            $('#txtDinhMucKhac').val('');
            $("#modalDanhMucDinhMuc").modal('show');
        });
        $("#tblDanhMucDinhMuc").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strDinhMucId = strId;
            var dt = edu.util.objGetDataInData(me.strDinhMucId, me.dtDanhMucDinhMuc, "ID");
          
            $('#txtMaDinhMuc').val(dt[0].CODE);
            $('#txtTenDinhMuc').val(dt[0].NAME);
            $('#txtDinhMucGiangDay').val( dt[0].DMGIANGDAY);
            $('#txtDinhMucNCKH').val( dt[0].DMNCKH);
            $('#txtDinhMucKhac').val(dt[0].KHAC);
            $("#modalDanhMucDinhMuc").modal('show');
             
        });
        $("#btnCapNhat").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtMaDinhMuc", "THONGTIN1": "EM" },
                { "MA": "txtTenDinhMuc", "THONGTIN1": "EM" },
                { "MA": "txtDinhMucGiangDay", "THONGTIN1": "EM" },
                { "MA": "txtDinhMucNCKH", "THONGTIN1": "EM" },
                { "MA": "txtDinhMucKhac", "THONGTIN1": "EM" }, 

            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            } 
            me.CapNhatDinhMuc();
        }); 

      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_drpNamHoc();
        me.getList_tblDanhMucDinhMuc();
        

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
    getList_tblDanhMucDinhMuc: function () {
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhsachDinhMuc',
            'versionAPI': 'v1.0',  
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblDanhMucDinhMuc(data.Data, data.Pager);
                    me.dtDanhMucDinhMuc = data.Data;
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
    genTable_tblDanhMucDinhMuc: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhMucDinhMuc",
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
                    "mDataProp": "DMGIANGDAY"
                },
                {
                    "mDataProp": "DMNCKH"
                },
                {
                    "mDataProp": "KHAC"
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
    XoaDinhMuc: function (strDinhMucIds) {
        var me = this; 
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/XoaDinhMuc',
            'versionAPI': 'v1.0',
            'strDinhMucIds': strDinhMucIds, 
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblDanhMucDinhMuc();

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
    CapNhatDinhMuc: function () {
        var me = this;
      
        var obj_list = {
            'action': 'TKGG_QLKLGD/CapNhatDinhMuc',
            'versionAPI': 'v1.0',
            'strId': me.strDinhMucId,
            'strMaDinhMuc': edu.util.getValById('txtMaDinhMuc'),
            'strTenDinhMuc': edu.util.getValById('txtTenDinhMuc'),
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strDinhMucGiangDay': edu.util.getValById('txtDinhMucGiangDay'),
            'strDinhMucNCKH': edu.util.getValById('txtDinhMucNCKH'),
            'strKhac': edu.util.getValById('txtDinhMucKhac'),
            'strNguoiThucHienId': edu.system.userId,
        };
        
        if (me.strDinhMucId == "") {
            obj_list.action = 'TKGG_QLKLGD/ThemMoiDinhMuc';
            obj_list.strId = '';
            
        } 
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.strDinhMucId = data.Data;
                  
                    me.getList_tblDanhMucDinhMuc();

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

