function qlklgd_dongia() { };
qlklgd_dongia.prototype = {
    dtDonGia:[],     
    strErr: '', 
    strDonGiaID: '',
    dtHocHam: [],
    dtHocVi:[],

    init: function () {
        var me = this;
        me.page_load();

        $('#drpNamHoc').on('select2:select', function () {
          
            me.getList_tblDonGia(); 
        });
       
        $('#btnXoaDonGia').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblDonGia", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
             

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strDonGiaIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strDonGiaIds += arrChecked_Id[i] + ",";
                } 
                me.XoaDonGia(strDonGiaIds);
            });


        });
        $("#btnShowThemMoi").click(function () {
            
            if (edu.util.getValById('drpNamHoc') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
            me.strDonGiaID = '';
            $('#txtTen').val('');
            $('#txtDonGia').val('');
            $('#drpHinhThucGiang').val('').trigger("change");
            $('#drpHocHam').val('').trigger('change');
            $('#drpHocVi').val('').trigger('change');
            $("#modalDonGia").modal('show'); 
        });
        $("#tblDonGia").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strDonGiaID = strId; 
            
            var dt = edu.util.objGetDataInData(me.strDonGiaID, me.dtDonGia, "ID");
          
            $('#txtTen').val(dt[0].LOAIGIANGVIEN);
            $('#txtDonGia').val(dt[0].DONGIA);
            $('#drpHinhThucGiang').val(dt[0].HINHTHUCGIANGDAYID).trigger("change");
            $('#drpHocHam').val(dt[0].HOCHAMID).trigger('change');
            $('#drpHocVi').val(dt[0].HOCVIID).trigger('change');
            $("#modalDonGia").modal('show');
             
        });
        $("#btnCapNhat").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtTen", "THONGTIN1": "EM" },
                { "MA": "txtDonGia", "THONGTIN1": "EM" }, 
                { "MA": "drpNamHoc", "THONGTIN1": "EM" }, 
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            } 
            me.CapNhatDonGia();
        }); 

      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_drpNamHoc(); 
        me.getList_HocHam();
        me.getList_HocVi();
        me.getList_HinhThucGiang();
        setTimeout(function () {
            me.genList_drpHocHamHocVi(me.dtHocHam, 'drpHocHam');
            me.genList_drpHocHamHocVi(me.dtHocVi, 'drpHocVi');
        }, 2000); 

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
    getList_tblDonGia: function () {
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDonGia',
            'versionAPI': 'v1.0',  
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblDonGia(data.Data, data.Pager);
                    me.dtDonGia = data.Data;
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
    genTable_tblDonGia: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDonGia",
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
                    "mDataProp": "LOAIGIANGVIEN"
                },
                {
                    "mDataProp": "DONGIA"
                },
                {
                    "mDataProp": "TENHINHTHUCGIANGDAY"
                },
                {
                    "mDataProp": "HOCHAM"
                },
                {
                    "mDataProp": "HOCVI"
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
    XoaDonGia: function (strDonGiaIds) {
        var me = this; 
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/XoaDonGia',
            'versionAPI': 'v1.0',
            'strDonGiaIds': strDonGiaIds, 
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblDonGia();

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
    CapNhatDonGia: function () {
        var me = this;
      
        var obj_list = {
            'action': 'TKGG_QLKLGD/CapNhatDonGia',
            'versionAPI': 'v1.0',
            'strId': me.strDonGiaID,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strTen': edu.util.getValById('txtTen'),
            'strDonGia': edu.util.getValById('txtDonGia'),
            'strHinhThucGiangId': edu.util.getValById('drpHinhThucGiang'),
            'strHocHamId': edu.util.getValById('drpHocHam'), 
            'strHocViId': edu.util.getValById('drpHocVi'), 
            'strNguoiThucHienId': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.strDonGiaID = data.Id;
                   
                    me.getList_tblDonGia();

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
    getList_HocHam: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            'strMaBangDanhMuc': 'NS.LOCD',
            'dTrangThai': 1
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.dtHocHam = data.Data;

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
    getList_HocVi: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            'strMaBangDanhMuc': 'NS.DMHV',
            'dTrangThai': 1
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {


                    me.dtHocVi = data.Data;
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
    genList_drpHocHamHocVi: function (data, drpHocHamHocVi) {

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: [drpHocHamHocVi],
            type: "",
            title: "Chọn "
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HinhThucGiang: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetHinhThucGiang', 
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpHinhThucGiang(data.Data);

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
    genList_drpHinhThucGiang: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NAME",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHinhThucGiang"],
            type: "",
            title: "Chọn hình thức giảng"
        };
        edu.system.loadToCombo_data(obj);
    },
}

