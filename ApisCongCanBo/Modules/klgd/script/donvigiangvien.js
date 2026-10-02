function donvigiangvien() { };
donvigiangvien.prototype = {
    dtHocHam: [],     
    dtHocVi: [],     
    strErr: '', 
    strNhomMonHocId: '',
    dtDoiTuongAPI:[],

    init: function () {
        var me = this;
        me.page_load();

        $('#drpSchoolYear').on('select2:select', function () { 
            me.get_tblDonVi(); 
        });
        $("#tblDonVi").delegate('.btnEdit', 'click', function (e) {
            me.strNhomMonHocId  = this.id;
            
            me.get_tblGiangVien();
        });
        $('#btnXoaGiangVien').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblGiangVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }


            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strIDs = "";
                
                
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strIDs += arrChecked_Id[i] + ",";
                }
                me.DeleteKLGD_DoiTuong(strIDs);
                setTimeout(function () {
                    me.get_tblGiangVien();
                }, 2000);
            });


        });
        $("#btnShowThemMoi").click(function () {

            if (edu.util.getValById('drpSchoolYear') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
            if (me.strNhomMonHocId == "") {
                edu.system.alert("Bạn chưa chọn đơn vị");
                return;
            }
          
            $("#modalThemGiangVien").modal('show');
        });
        $("#btnSearch").click(function () {

            me.get_tblGiangVien_API();
        });
        $('#btnThemDoiTuongAPI').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblGiangVien_API", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thêm?");
                return;
            }


            edu.system.confirm("Bạn có chắc chắn thêm dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                
                var strID = "";
                var strMaCanBo = "";
                var strHoDem = "";
                var strTenCanBo = "";
                var strMaDonVi = "";
                

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    //strIDs += arrChecked_Id[i] + ",";
                    strID = arrChecked_Id[i];
                    debugger;
                    var dt = edu.util.objGetDataInData(strID, me.dtDoiTuongAPI, "id");
                    console.log(dt);
                    strMaDonVi = dt[0].maDonVi;
                    strMaCanBo = dt[0].code;
                    strHoDem = dt[0].ho;
                    strTenCanBo = dt[0].ten;
                    me.Them_KLGDDoiTuongAPI(strID, strMaDonVi, strMaCanBo, strHoDem, strTenCanBo);
                }
                
                setTimeout(function () {
                    me.get_tblGiangVien();
                }, 5000);
            });


        });
       

      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_HocHamHocVi();
        me.getList_SchoolYear();
      
        

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
    get_tblDonVi: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');

        var obj_list = {
            'action': 'TKGG_KLGD/GetBoMonDuocPhanCong',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.gen_tblDonVi(data.Data);
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
    gen_tblDonVi: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);


        var jsonForm = {
            strTable_Id: "tblDonVi",
            aaData: data,
            sort: true,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataP": "NAME",
                    "mRender": function (nRow, aData) {
                        return '<span><a class=" btnEdit" style="text-decoration: underline;font-style: italic; color: green; cursor: pointer" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.NAME) + '</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    get_tblGiangVien: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');

        var obj_list = {
            'action': 'TKGG_KLGD/GetListStaff',
            'strNhomMonHocId': me.strNhomMonHocId, 
            
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId, 
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.gen_tblGiangVien(data.Data);
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
    gen_tblGiangVien: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);


        var jsonForm = {
            strTable_Id: "tblGiangVien",
            aaData: data,
            sort: true,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<span>' + edu.util.returnEmpty(aData.TENHINHTHUCGIANGDAY) + '</span>'
                            + '<select class="form-select select-opt" id="drpHocHam' + aData.ID + '" aria-label="Default select example">'
                            + '<option value="">Chọn học hàm</option>'
                            + '</select>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<span>' + edu.util.returnEmpty(aData.TENHINHTHUCGIANGDAY) + '</span>'
                            + '<select class="form-select select-opt" id="drpHocVi' + aData.ID + '" aria-label="Default select example">'
                            + '<option value="">Chọn học vị</option>'
                            + '</select>';
                        return strReturn;
                    }
                }, 
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
        for (var i = 0; i < data.length; i++) {
            me.genList_drpHocHamHocVi(me.dtHocHam, 'drpHocHam' + data[i].ID);
            me.genList_drpHocHamHocVi(me.dtHocVi, 'drpHocVi' + data[i].ID);
            
            var strHocHamId = data[i].HOCHAMID;
            $("#" + 'drpHocHam' + data[i].ID).val(strHocHamId).trigger("change");
            
            var strHocViId = data[i].HOCVIID;
            $("#" + 'drpHocVi' + data[i].ID).val(strHocViId).trigger("change");
        }
    },
    getList_HocHamHocVi: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');


        var obj_list = {
            'action': 'TKGG_KLGD/Get_HocHamHocVi',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                        me.dtHocHam = data.Data.Table;
                    
                    me.dtHocVi = data.Data.Table1;
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
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: [drpHocHamHocVi],
            type: "",
            title: "Chọn "
        };
        edu.system.loadToCombo_data(obj);
    },
    DeleteKLGD_DoiTuong: function (strIds) {
        var me = this;

        var obj_list = {
            'action': 'TKGG_KLGD/DeleteKLGD_DoiTuong',
            'versionAPI': 'v1.0',
            'strIds': strIds,
            'strNguoiDung_Id': edu.system.userId,
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
    get_tblGiangVien_API: function () {
        var me = this;
        
        var obj_list = {
            'action': 'TKGG_KLGD/Get_GiangVien_API',
            'strTuKhoa': edu.util.getValById("txtSearch"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                                          
                        me.gen_tblGiangVien_API(data.Data);
                    me.dtDoiTuongAPI = data.Data;
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
    gen_tblGiangVien_API: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);


        var jsonForm = {
            strTable_Id: "tblGiangVien_API",
            aaData: data,
            sort: true,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "maDonVi"
                },
                {
                    "mDataProp": "code"
                },
                {
                    "mDataProp": "ho"
                },
                {
                    "mDataProp": "ten"
                },
                {
                    "mDataProp": "tenTrangThai"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<input type="checkbox" id="checkX' + aData.id + '"/>';
                        return strReturn;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    Them_KLGDDoiTuongAPI: function (strID, strMaDonVi, strMaCanBo, strHoDem, strTenCanBo) {
        var me = this;

        var obj_list = {
            'action': 'TKGG_KLGD/Them_KLGDDoiTuongAPI',
            'versionAPI': 'v1.0',
            'strID': strID,
            'strMaDonVi': strMaDonVi,
            'strMaCanBo': strMaCanBo,
            'strHoDem': strHoDem,
            'strTen': strTenCanBo,
            'strAPI_Id': strID,
            'strNhomMonHocId': me.strNhomMonHocId,
            'strNguoiDung_Id': edu.system.userId,
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
            type: "POST",
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

