function khoiluongnckh() { };
khoiluongnckh.prototype = {
    dtKhoiLuongNCKH: [],
    strErr: '',
     
   
    init: function () {
        var me = this;
        me.page_load();
        
        $('#drpSchoolYear').on('select2:select', function () {   
            me.getList_drpBoMon();    
            me.getList_tblKhoiLuongNCKH(); 
            
        });         
        
        
        $('#drpBoMon').on('select2:select', function () {
            
            me.getList_tblKhoiLuongNCKH(); 
            
        });
        $('#btnCapNhat').click(function () {

           
            edu.system.confirm("Bạn có chắc chắn cập nhật?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = '';
                var strStaffId = '';
                var strSoTiet = '';
                var strSoTietDuocCongThem = '';
                me.strErr = '';
                for (var i = 0; i < me.dtKhoiLuongNCKH.length; i++) {
                    strStaffId = me.dtKhoiLuongNCKH[i].NHANVIENID;
                    strSoTiet = edu.util.getValById('txtSoTietNCKH' + me.dtKhoiLuongNCKH[i].ID);
                    strSoTietDuocCongThem = edu.util.getValById('txtSoTietDuocCongThem' + me.dtKhoiLuongNCKH[i].ID);
                    me.CapNhatKhoiLuongNCKH(strStaffId, strSoTiet, strSoTietDuocCongThem);
                }

                
                
            });

        });
        edu.system.getList_MauImport("zonebtnBaoCao_NhapDiem", function (addKeyValue) {
            addKeyValue("strNamHoc", edu.util.getValCombo("drpSchoolYear")); 
        });

      
        
          
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_SchoolYear();     
        me.getList_drpBoMon();
        
        me.getList_tblKhoiLuongNCKH();

    },
    getList_SchoolYear: function () {
        var me = this; 
        //--Edit
        var obj_list = {
            'action': 'TKGG_KLGD/GetcboSchoolYear',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId, 
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genList_SchoolYear(data.Data);
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
    genList_SchoolYear: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NIENHOC",
                parentId: "",
                name: "NIENHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpSchoolYear"],
            type: "",
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_drpHeDaoTao: function () {
        var me = this;
        
        var obj_list = {
            'action': 'TKGG_KLGD/GetTRAININGSYSTEMList',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpHeDaoTao(data.Data);
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
    genList_drpHeDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_drpBoMon: function () {
        var me = this;
       
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/LayDS_PhanQuyenNguoiDungDonVi',
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strNguoiDungId': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length >0 )
                    me.genList_drpBoMon(data.Data);
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
    genList_drpBoMon: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpBoMon"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
     
    getList_tblKhoiLuongNCKH: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_KLGD/GetDanhSachGiangVienNCKHPVSX',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strHocKy': edu.util.getValById('strHocKy'),
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strNguoiDung_Id': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoiLuongNCKH = data.Data;
                    me.genTable_tblKhoiLuongNCKH(data.Data, data.Pager);
                    
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
    genTable_tblKhoiLuongNCKH: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoiLuongNCKH",
            aaData: data,

            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                
                {
                    "mDataProp": "BOMON"
                },
                {
                    "mDataProp": "MAGIANGVIEN"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                     
                     "mRender": function (nRow, aData) { 
                         strReturn = '<input type="text"  class="form-control"  id="txtSoTietNCKH' + aData.ID + '"   value="' + edu.util.returnEmpty(aData.SOTIET) + '" >';                        return strReturn;
                    }
                },  
                {

                    "mRender": function (nRow, aData) {
                        strReturn = '<input type="text"  class="form-control"  id="txtSoTietDuocCongThem' + aData.ID + '"   value="' + edu.util.returnEmpty(aData.SOTIETDUOCCONGTHEM) + '" >'; return strReturn;
                    }
                }, 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    }, 
    CapNhatKhoiLuongNCKH: function (strStaffId, strSoTietNCKH, strSoTietDuocCongThem) {
        var me = this;
        

        var obj_list = {
            'action': 'TKGG_KLGD/CapNhatKhoiLuongNCKH',
            'versionAPI': 'v1.0',
            'strStaffId': strStaffId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strSoTietNCKH': strSoTietNCKH, 
            'strSoTietDuocCongThem': strSoTietDuocCongThem, 
            'strNguoiDungId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công"); 
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



