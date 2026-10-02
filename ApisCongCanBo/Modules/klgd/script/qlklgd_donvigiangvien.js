function qlklgd_donvigiangvien() { };
qlklgd_donvigiangvien.prototype = {
    dtHocHam: [],     
    dtHocVi: [],     
    strErr: '', 
    strNhomMonHocId: '',
    dtDoiTuong:[],
    dtDoiTuongAPI:[],

    init: function () {
        var me = this;
        me.page_load();

        $('#drpNamHoc').on('select2:select', function () { 
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
        $('#btnChotDuLieu').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblGiangVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thao tác?");
                return;
            }


            edu.system.confirm("Bạn có chắc chắn thao tác dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strIDs = "";

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strIDs += arrChecked_Id[i] + ",";
                }
                me.ChotMoChotDuLieu(strIDs,1);
                setTimeout(function () {
                    me.get_tblGiangVien();
                }, 2000);
            });


        });
        $('#btnBoChotDuLieu').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblGiangVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thao tác?");
                return;
            }


            edu.system.confirm("Bạn có chắc chắn thao tác dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strIDs = "";

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strIDs += arrChecked_Id[i] + ",";
                }
                me.ChotMoChotDuLieu(strIDs, 0);
                setTimeout(function () {
                    me.get_tblGiangVien();
                }, 2000);
            });


        });
        $("#btnShowThemMoi").click(function () {

            if (edu.util.getValById('drpNamHoc') == "") {
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
       
        $('#btnCapNhat').click(function () {

           

            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                
                me.strErr = "";
                for (var i = 0; i < me.dtDoiTuong.length; i++) {
                    var strID = me.dtDoiTuong[i].DOITUONGID;
                    var strHocHamId = me.dtDoiTuong[i].HOCHAMID;
                    var strHocViId = me.dtDoiTuong[i].HOCVIID;
                    
                    if (strHocHamId != edu.util.getValById('drpHocHam' + me.dtDoiTuong[i].DOITUONGID)||
                        strHocViId != edu.util.getValById('drpHocVi' + me.dtDoiTuong[i].DOITUONGID)
                    )
                    {
                        me.CapNhatHocHamHocVi(strID, edu.util.getValById('drpHocHam' + me.dtDoiTuong[i].DOITUONGID), edu.util.getValById('drpHocVi' + me.dtDoiTuong[i].DOITUONGID));
                    }
                }
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);

                setTimeout(function () {
                    me.get_tblGiangVien();
                }, 2000);
            });


        });
      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_HocHam();
        me.getList_HocVi();
        me.getList_drpNamHoc();
      
        

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
    get_tblDonVi: function () {
        var me = this; 
        var obj_list = {
            'action': 'TKGG_QLKLGD/LayDS_PhanQuyenNguoiDungDonVi',
            'strNguoiDungId': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
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
        //$("#tblDonVi").html('');


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

        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachCanBoNienHoc',
            'strNhomMonHocId': me.strNhomMonHocId,             
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId, 
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.dtDoiTuong = data.Data;
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
                    "mDataProp": "SOHIEUCT"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn =  
                            '<select class="form-select select-opt" id="drpHocHam' + aData.DOITUONGID + '" aria-label="Default select example">'
                            + '<option value="">Chọn học hàm</option>'
                            + '</select>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = 
                            '<select class="form-select select-opt" id="drpHocVi' + aData.DOITUONGID + '" aria-label="Default select example">'
                            + '<option value="">Chọn học vị</option>'
                            + '</select>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {

                        var strReturn = "";
                        if (aData.CHOTDULIEU == "1")
                            strReturn = "Đã chốt";
                        return strReturn;
                    }
                }, 
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<input type="checkbox" id="checkX' + aData.DOITUONGID + '"/>';
                        return strReturn;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        for (var i = 0; i < data.length; i++) {
            me.genList_drpHocHamHocVi(me.dtHocHam, 'drpHocHam' + data[i].DOITUONGID);
            me.genList_drpHocHamHocVi(me.dtHocVi, 'drpHocVi' + data[i].DOITUONGID);
            
            var strHocHamId = data[i].HOCHAMID;
            $("#" + 'drpHocHam' + data[i].DOITUONGID).val(strHocHamId).trigger("change");
            
            var strHocViId = data[i].HOCVIID;
            $("#" + 'drpHocVi' + data[i].DOITUONGID).val(strHocViId).trigger("change");
        }
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
    DeleteKLGD_DoiTuong: function (strIds) {
        var me = this;

        var obj_list = {
            'action': 'TKGG_QLKLGD/DeleteKLGD_DoiTuong',
            'versionAPI': 'v1.0',
            'strIds': strIds,
            'strNguoiThucHienId': edu.system.userId,
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
            'action': 'TKGG_QLKLGD/Get_GiangVien_API',
            'strTuKhoa': edu.util.getValById("txtSearch"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
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
            'action': 'TKGG_QLKLGD/Them_KLGDDoiTuongAPI',
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
    ChotMoChotDuLieu: function (strIds, strTrangThai) {
        var me = this;

        var obj_list = {
            'action': 'TKGG_QLKLGD/ChotMoChotDuLieu',
            'versionAPI': 'v1.0',
            'strIds': strIds,
            'strTrangThai': strTrangThai,            
            'strNguoiThucHienId': edu.system.userId,
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
    CapNhatHocHamHocVi: function (strID, strHocHamId, strHocViId) {
    var me = this;

    var obj_list = {
        'action': 'TKGG_QLKLGD/CapNhatHocHamHocVi',
        'versionAPI': 'v1.0',
        'strID': strID,
        'strHocHamId': strHocHamId,
        'strHocViId': strHocViId, 
        'strNguoiDung_Id': edu.system.userId,
    };


    edu.system.makeRequest({
        success: function (data) {
            if (data.Success) {

                me.strErr += data.Message;

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

