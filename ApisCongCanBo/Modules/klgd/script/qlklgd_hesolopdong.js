function qlklgd_hesolopdong() { };
qlklgd_hesolopdong.prototype = {
    dtHeSoLopDong:[],     
    strErr: '', 
    strHeSoLopDongID:'',

    init: function () {
        var me = this;
        me.page_load();

        $('#drpNamHoc').on('select2:select', function () {
          
            me.getList_tblHeSoLopDong(); 
        });
       
        $('#btnXoaHeSoLopDong').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblHeSoLopDong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
             

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strHeSoLopDongIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strHeSoLopDongIds += arrChecked_Id[i] + ",";
                } 
                me.XoaHeSoLopDong(strHeSoLopDongIds);
            });


        });
        $("#btnShowThemMoi").click(function () {
            
            if (edu.util.getValById('drpNamHoc') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
            me.strHeSoLopDongID = '';
            $('#txtSoTietTu').val('');
            $('#txtSoTietDen').val('');
            $('#txtHeSoLopDong').val(''); 
            $("#modalHeSoLopDong").modal('show');
        });
        $("#tblHeSoLopDong").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strHeSoLopDongID = strId; 
            
            var dt = edu.util.objGetDataInData(me.strHeSoLopDongID, me.dtHeSoLopDong, "ID");
          
            $('#txtSoTietTu').val(dt[0].TU);
            $('#txtSoTietDen').val(dt[0].DEN);
            $('#txtHeSoLopDong').val( dt[0].HESO); 
            $("#modalHeSoLopDong").modal('show');
             
        });
        $("#btnCapNhat").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtSoTietTu", "THONGTIN1": "EM" },
                { "MA": "txtSoTietDen", "THONGTIN1": "EM" }, 
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            } 
            me.CapNhatHeSoLopDong();
        }); 

      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_drpNamHoc();
        me.getList_tblHeSoLopDong();
        

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
    getList_tblHeSoLopDong: function () {
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetHeSoLopDong',
            'versionAPI': 'v1.0',  
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblHeSoLopDong(data.Data, data.Pager);
                    me.dtHeSoLopDong = data.Data;
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
    genTable_tblHeSoLopDong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHeSoLopDong",
            aaData: data,

            sort: true,
            colPos: {
                center: [0, 1],
            },
            aoColumns: [
                {
                    "mDataProp": "TU"
                },
                {
                    "mDataProp": "DEN"
                },
                {
                    "mDataProp": "HESO"
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
    XoaHeSoLopDong: function (strHeSoLopDongIds) {
        var me = this; 
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/XoaHeSoLopDong',
            'versionAPI': 'v1.0',
            'strHeSoLopDongIds': strHeSoLopDongIds, 
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblHeSoLopDong();

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
    CapNhatHeSoLopDong: function () {
        var me = this;
      
        var obj_list = {
            'action': 'TKGG_QLKLGD/CapNhatHeSoLopDong',
            'versionAPI': 'v1.0',
            'strId': me.strHeSoLopDongID,
            'strSoTietTu': edu.util.getValById('txtSoTietTu'),
            'strSoTietDen': edu.util.getValById('txtSoTietDen'),
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strHeSoLopDong': edu.util.getValById('txtHeSoLopDong'), 
            'strNguoiThucHienId': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.strHeSoLopDongID = data.Id;
                  
                  
                    me.getList_tblHeSoLopDong();

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

