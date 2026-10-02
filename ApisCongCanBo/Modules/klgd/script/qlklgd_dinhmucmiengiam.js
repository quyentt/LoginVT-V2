function qlklgd_dinhmucmiengiam() { };
qlklgd_dinhmucmiengiam.prototype = {
    
    strErr: '',
    strGiangVienId: '',
    dtDinhMucGiangVien: [],
    dtMienGiamGiangVien: [],
    dtThongTinGiangVien: [],
    dtDonGiaGiangVien: [],
    
    init: function () {
        var me = this;
        me.page_load();
        $('#drpNamHoc').on('select2:select', function () {             
            me.getList_drpBoMon();
            me.getList_drpDinhMuc('drpDinhMuc', "");
            me.getList_drpMienGiam('drpMienGiam','');
            me.getList_DonGia('drpDonGia');
        });
         
        $('#drpBoMon').on('select2:select', function () {
            me.getList_tblThongTin();
            
        });
            
        $("#tblThongTin").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            $("#modalThongTinChiTiet").modal('show');
            var dt = edu.util.objGetDataInData(strId, me.dtThongTinGiangVien, "STAFFID");
            $('#lblGiangVien').text(dt[0].HOCHAMHOCVI + ' ' + dt[0].HOTEN);
            $('#lblBoMon').text(dt[0].TENBM);
            me.strGiangVienId = strId;
            $('#txtNhapDinhMucGiangDay').val('');
            $('#txtNhapDinhMucNCKH').val('');
            if (edu.util.returnEmpty(dt[0].DINHMUCGIANGDAY_NHAP) == "1") {
                $('#txtNhapDinhMucGiangDay').val(dt[0].DINHMUCGIANGDAY);
                $('#txtNhapDinhMucNCKH').val(dt[0].DINHMUCNGHIENCUUKHOAHOC);
            }
            me.getList_tblDinhMuc(strId);
            me.getList_tblMienGiam(strId);
            me.getList_tblDonGia(strId);
        });
        $("#btnThemDinhMuc").click(function () {

            if (edu.util.getValById('drpDinhMuc') == "") {
                edu.system.alert("Bạn chưa chọn định mức");
                return;
            }
            if (edu.util.getValById('txtDinhMuc_TuNgay') == "") {
                edu.system.alert("Bạn chưa nhập từ ngày");
                return;
            }
            if (edu.util.getValById('txtDinhMuc_DenNgay') == "") {
                edu.system.alert("Bạn chưa nhập đến ngày");
                return;
            }
            if (me.strGiangVienId == "") {
                edu.system.alert("Bạn chưa chọn giảng viên");
                return;
            }
            var strId = "";
                 
            var strDinhmucID = edu.util.getValById('drpDinhMuc');
            var strStartDate = edu.util.getValById('txtDinhMuc_TuNgay');
            var strEndDate = edu.util.getValById('txtDinhMuc_DenNgay');
            me.strErr = "";
            me.UpdateDinhMuc(strId, strDinhmucID, strStartDate, strEndDate);
            if (me.strErr == "")
                edu.system.alert("Cập nhật thành công");
            else
                edu.system.alert(me.strErr);

            setTimeout(function () {
                me.getList_tblThongTin();
                me.getList_tblDinhMuc(me.strGiangVienId);
            }, 2000);

        });
        $("#btnXoaDinhMuc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDinhMuc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strDinhMucIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {                    
                    strDinhMucIds += arrChecked_Id[i] + ",";
                }
                me.DeleteDinhMucNhanvien(strDinhMucIds);
            });
             

        });
        $("[id$=chkSelectAll_DinhMuc]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDinhMuc" });
        });
        $("[id$=chkSelectAll_MienGiam]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblMienGiam" });
        });
        $("#btnThemMienGiam").click(function () {

            if (edu.util.getValById('drpMienGiam') == "") {
                edu.system.alert("Bạn chưa chọn miễn giảm");
                return;
            }
            if (edu.util.getValById('txtMienGiam_TuNgay') == "") {
                edu.system.alert("Bạn chưa nhập từ ngày");
                return;
            }
            if (edu.util.getValById('txtMienGiam_DenNgay') == "") {
                edu.system.alert("Bạn chưa nhập đến ngày");
                return;
            }
            if (me.strGiangVienId == "") {
                edu.system.alert("Bạn chưa chọn giảng viên");
                return;
            }
            var strId = "";
            var strMienGiamID = edu.util.getValById('drpMienGiam');
            var strStartDate = edu.util.getValById('txtMienGiam_TuNgay');
            var strEndDate = edu.util.getValById('txtMienGiam_DenNgay');
            me.strErr = "";
           
            me.UpdateMienGiam(strId, strMienGiamID, strStartDate, strEndDate);
            if (me.strErr == "")
                edu.system.alert("Cập nhật thành công");
            else
                edu.system.alert(me.strErr);

            setTimeout(function () {
                me.getList_tblThongTin();
                me.getList_tblMienGiam(me.strGiangVienId);
            }, 2000);

        });
        $("#btnXoaMienGiam").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblMienGiam", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strMienGiamIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strMienGiamIds += arrChecked_Id[i] + ",";
                }
                me.DeleteMienGiamNhanvien(strMienGiamIds);
            });



        });
        $("#btnDonGia").click(function () {

            if (edu.util.getValById('drpDonGia') == "") {
                edu.system.alert("Bạn chưa chọn miễn giảm");
                return;
            }
            if (edu.util.getValById('txtDonGia_TuNgay') == "") {
                edu.system.alert("Bạn chưa nhập từ ngày");
                return;
            }
            if (edu.util.getValById('txtDonGia_DenNgay') == "") {
                edu.system.alert("Bạn chưa nhập đến ngày");
                return;
            }
            if (me.strGiangVienId == "") {
                edu.system.alert("Bạn chưa chọn giảng viên");
                return;
            }

            
            var strId = ""; 
            var strDonGiaId = edu.util.getValById('drpDonGia');
            var strStartDate = edu.util.getValById('txtDonGia_TuNgay');
            var strEndDate = edu.util.getValById('txtDonGia_DenNgay');
             me.strErr = "";
            me.UpdateDonGiaGiangVien(strId, strDonGiaId, strStartDate, strEndDate);
            setTimeout(function () {
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);
                me.getList_tblThongTin();
                me.getList_tblDonGia(me.strGiangVienId);
            }, 2000);

        });
        $("#btnXoaDonGia").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDonGia", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strDonGiaIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strDonGiaIds += arrChecked_Id[i] + ",";
                }
                me.DeleteDonGiaGiangVien(strDonGiaIds);
            });



        });
        $("#btnCall_Import_DMIP").click(function () {
            if (edu.util.getValById('drpNamHoc') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }

            me.popup_import();
        });
        $('#btnTongHop').click(function () {
            me.TongHopDinhMuc();
        });
        $("#btnImport_DINHMUC").click(function () {
            me.import_DINHMUC();
        });  
        $("#btnImport_MIENGGIAM").click(function () {
            me.import_MIENGIAM();
        });  
        $("#btnImport_DONGIA").click(function () {
            me.import_DONGIA();
        });  
        $("#btnFileMau").click(function (e) {
            e.preventDefault();
            me.report("TEMPLATE_IMPORTDM_MG_DONGIA");
        });  
        $("#btnSaveDonGia").click(function () {

            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";

                me.strErr = ""; 
                for (var i = 0; i < me.dtDonGiaGiangVien.length; i++) {
                    var strId = me.dtDonGiaGiangVien[i].ID;
                    
                    var strDonGiaId = me.dtDonGiaGiangVien[i].TBL_KLGD_DONGIAGIANGDAYID;// edu.util.getValById('drpDonGia' + me.dtDonGiaGiangVien[i].ID);
                    var strStartDate = me.dtDonGiaGiangVien[i].NGAYTHANGBATDAU;//edu.util.getValById('txtDonGia_TuNgay' + me.dtDonGiaGiangVien[i].ID);
                    var strEndDate = me.dtDonGiaGiangVien[i].NGAYTHANGKETTHUC;//edu.util.getValById('txtDonGia_DenNgay' + me.dtDonGiaGiangVien[i].ID);
 
                    if (strDonGiaId != edu.util.getValById('drpDonGia' + me.dtDonGiaGiangVien[i].ID) ||
                        strStartDate != edu.util.getValById('txtDonGia_TuNgay' + me.dtDonGiaGiangVien[i].ID) ||
                        strEndDate != edu.util.getValById('txtDonGia_DenNgay' + me.dtDonGiaGiangVien[i].ID)
                    ) { 
                         
                        me.UpdateDonGiaGiangVien(strId,  
                            edu.util.getValById('drpDonGia' + me.dtDonGiaGiangVien[i].ID),
                            edu.util.getValById('txtDonGia_TuNgay' + me.dtDonGiaGiangVien[i].ID) ,
                            edu.util.getValById('txtDonGia_DenNgay' + me.dtDonGiaGiangVien[i].ID));
                       
                    }
                }
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);

                setTimeout(function () {
                    me.getList_tblThongTin();
                    me.getList_tblDonGia(me.strGiangVienId);
                }, 2000);
            });
           

        });
        $("#btnSaveMienGiam").click(function () {

            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";

                
                for (var i = 0; i < me.dtMienGiamGiangVien.length; i++) {
                    var strId = me.dtMienGiamGiangVien[i].ID;

                    var strMienGiamId = me.dtMienGiamGiangVien[i].MIENGIAMID;// edu.util.getValById('drpDonGia' + me.dtMienGiamGiangVien[i].ID);
                    var strStartDate = me.dtMienGiamGiangVien[i].NGAYTHANGBATDAU;//edu.util.getValById('txtDonGia_TuNgay' + me.dtMienGiamGiangVien[i].ID);
                    var strEndDate = me.dtMienGiamGiangVien[i].NGAYTHANGKETTHUC;//edu.util.getValById('txtDonGia_DenNgay' + me.dtMienGiamGiangVien[i].ID);

                    if (strMienGiamId != edu.util.getValById('drpMienGiam' + me.dtMienGiamGiangVien[i].ID) ||
                        strStartDate != edu.util.getValById('txtMienGiam_TuNgay' + me.dtMienGiamGiangVien[i].ID) ||
                        strEndDate != edu.util.getValById('txtMienGiam_DenNgay' + me.dtMienGiamGiangVien[i].ID)
                    ) {

                        me.UpdateMienGiam(strId,
                            edu.util.getValById('drpMienGiam' + me.dtMienGiamGiangVien[i].ID),
                            edu.util.getValById('txtMienGiam_TuNgay' + me.dtMienGiamGiangVien[i].ID),
                            edu.util.getValById('txtMienGiam_DenNgay' + me.dtMienGiamGiangVien[i].ID));

                    }
                }
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);

                setTimeout(function () {
                    me.getList_tblThongTin();
                    me.getList_tblMienGiam(me.strGiangVienId);
                }, 2000);
            });


        });
        $("#btnSaveDinhMuc").click(function () {

            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";

                me.strErr = "";
                for (var i = 0; i < me.dtDinhMucGiangVien.length; i++) {
                    var strId = me.dtDinhMucGiangVien[i].ID;

                    var strDinhmucID = me.dtDinhMucGiangVien[i].DINHMUCID;// edu.util.getValById('drpDonGia' + me.dtDinhMucGiangVien[i].ID);
                    var strStartDate = me.dtDinhMucGiangVien[i].NGAYTHANGBATDAU;//edu.util.getValById('txtDonGia_TuNgay' + me.dtDinhMucGiangVien[i].ID);
                    var strEndDate = me.dtDinhMucGiangVien[i].NGAYTHANGKETTHUC;//edu.util.getValById('txtDonGia_DenNgay' + me.dtDinhMucGiangVien[i].ID);
                    
                    if (strDinhmucID != edu.util.getValById('drpDinhMuc' + me.dtDinhMucGiangVien[i].ID) ||
                        strStartDate != edu.util.getValById('txtDinhMuc_TuNgay' + me.dtDinhMucGiangVien[i].ID) ||
                        strEndDate != edu.util.getValById('txtDinhMuc_DenNgay' + me.dtDinhMucGiangVien[i].ID)
                    ) {

                        me.UpdateDinhMuc(strId,
                            edu.util.getValById('drpDinhMuc' + me.dtDinhMucGiangVien[i].ID),
                            edu.util.getValById('txtDinhMuc_TuNgay' + me.dtDinhMucGiangVien[i].ID),
                            edu.util.getValById('txtDinhMuc_DenNgay' + me.dtDinhMucGiangVien[i].ID));

                    }
                }
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);

                setTimeout(function () {
                    me.getList_tblThongTin();
                    me.getList_tblDinhMuc(me.strGiangVienId);
                }, 2000);
            });


        });
        $("#btnSave_NhapDinhMuc").click(function () {

            edu.system.confirm("Bạn có chắc chắn cập nhật dữ liệu?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                 
               

                        me.Update_NhapDinhMuc(me.strGiangVienId ,
                            edu.util.getValById('txtNhapDinhMucGiangDay'), edu.util.getValById('txtNhapDinhMucNCKH'));
                  

                setTimeout(function () {
                    me.getList_tblThongTin();
                    me.getList_tblDinhMuc(me.strGiangVienId);
                }, 2000);
            });


        });
        edu.system.getList_MauImport("zonebtnKLGD", function (addKeyValue) {
            var obj_list = {
                'strNamHoc': edu.util.getValById('drpNamHoc'),
                'strNhomMonHocId': edu.util.getValById('drpBoMon'), 
                'Id': edu.util.getValById('drpBoMon'),
                'strNguoiThucHienId': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
        edu.system.uploadImport(["txtFile_DMIP"]);
        
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_drpNamHoc();        
        me.getList_tblThongTin(); 
        me.getList_drpDinhMuc('drpDinhMuc',"");
        me.getList_drpMienGiam('drpMienGiam', '');
        me.getList_DonGia('drpDonGia');
        

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
    getList_drpBoMon: function () {
        var me = this;
          
        var obj_list = {
            'action': 'TKGG_QLKLGD/LayDS_PhanQuyenNguoiDungDonVi',
            'strNguoiDungId': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
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
    getList_tblThongTin: function () {
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinDinhMucMienGiam',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'NhomMonHocID': edu.util.getValById('drpBoMon'),
            'strNguoiThucHienId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblThongTin(data.Data, data.Pager);
                    me.dtThongTinGiangVien = data.Data;

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
    genTable_tblThongTin: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        
        var jsonForm = {
            strTable_Id: "tblThongTin",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1,],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "HOCHAMHOCVI"
                },
                {
                    "mDataProp": "DINHMUCGIANGDAY"
                },
                {
                    "mDataProp": "DINHMUCNGHIENCUUKHOAHOC"
                } ,
                {
                    "mDataProp": "DINHMUC"
                },
                {
                    "mDataProp": "MIENGIAM"
                } ,
                {
                    "mDataProp": "DONGIA_THUCTE"
                },  
                {
                    "mDataProp": "DONGIA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.STAFFID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
                    }

                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    
    getList_DonGia: function (drpDonGia, strDonGiaId) {
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
                    if (data.Data.length > 0)
                        me.genList_drpDonGia(data.Data, drpDonGia, strDonGiaId);

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
    genList_drpDonGia: function (data, drpDonGia, strDonGiaId) {
       

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DONGIAGIANGVIEN",
                code: "",
                avatar: ""
            },
            renderPlace: [drpDonGia],
            type: "",
            title: "Chọn đơn giá"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + drpDonGia).val(strDonGiaId).trigger("change");
        $("#" + drpDonGia).select2({//Search on modal
            dropdownParent: $('#modalThongTinChiTiet .modal-content')
        });
    },
    getList_tblDinhMuc: function (strStaffId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDinhMucGV',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strStaffId': strStaffId,
            'strNguoiThucHienId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_tblDinhMuc(data.Data, data.Pager);
                    me.dtDinhMucGiangVien = data.Data;

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
    genTable_tblDinhMuc: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        
        var jsonForm = {
            strTable_Id: "tblDinhMuc",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1,],
            },
            aoColumns: [
                {
                    "mDataProp": "MADM"
                },
                {
                    //"mDataProp": "TENDM"
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<select class="form-select select-opt" id="drpDinhMuc' + aData.ID + '" aria-label="Default select example">'
                            + '<option value="">Chọn định mức</option>'
                            + '</select>';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "DMGD"
                },
                {
                    "mDataProp": "DMNCKH"
                },
                {
                    //"mDataProp": "NGAYTHANGBATDAU"
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<input type="text" class="form-control" id="txtDinhMuc_TuNgay' + aData.ID + '" style="width:150px;" placeholder="Từ ngày" value="' + edu.util.returnEmpty(aData.NGAYTHANGBATDAU) + '">';
                        return strReturn;
                    }
                },
                {
                   // "mDataProp": "NGAYTHANGKETTHUC"
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<input type="text" class="form-control" id="txtDinhMuc_DenNgay' + aData.ID + '" style="width:150px;" placeholder="Đến ngày" value="' + edu.util.returnEmpty(aData.NGAYTHANGKETTHUC) + '">';
                        return strReturn;
                    }
                } ,
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }

                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        for (var i = 0; i < data.length; i++) {
            var strDinhMucId = data[i].DINHMUCID;
            me.getList_drpDinhMuc('drpDinhMuc' + data[i].ID, strDinhMucId);
        }
    },
    getList_tblMienGiam: function (strStaffId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_QLKLGD/GetMienGiamGV',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strStaffId': strStaffId,
            'strNguoiThucHienId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtMienGiamGiangVien = data.Data;
                    me.genTable_tblMienGiam(data.Data, data.Pager);

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
    genTable_tblMienGiam: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        
        
        var jsonForm = {
            strTable_Id: "tblMienGiam",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1,],
            },
            aoColumns: [
                {
                    "mDataProp": "MAMG"
                },
                {
                    //"mDataProp": "TENMG"
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<select class="form-select select-opt" id="drpMienGiam' + aData.ID + '" aria-label="Default select example">'
                            + '<option value="">Chọn miễn giảm</option>'
                            + '</select>';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "MGGD"
                },
                {
                    "mDataProp": "MGNCKH"
                },
                {
                    //"mDataProp": "NGAYTHANGBATDAU"
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<input type="text" class="form-control" id="txtMienGiam_TuNgay' + aData.ID + '" style="width:150px;" placeholder="Từ ngày" value="' + edu.util.returnEmpty(aData.NGAYTHANGBATDAU) + '">';
                        return strReturn;
                    }
                },
                {
                    //"mDataProp": "NGAYTHANGKETTHUC"
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<input type="text" class="form-control" id="txtMienGiam_DenNgay' + aData.ID + '" style="width:150px;" placeholder="Đến ngày" value="' + edu.util.returnEmpty(aData.NGAYTHANGKETTHUC) + '">';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }

                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        for (var i = 0; i < data.length; i++) {
            var strMienGiamId = data[i].MIENGIAMID;
            me.getList_drpMienGiam('drpMienGiam' + data[i].ID, strMienGiamId);  
        }
    },
    getList_drpDinhMuc: function (drpDinhMuc, strDinhMucId) {
        var me = this;
      
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetListDinhMuc',   
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpDinhMuc(data.Data, drpDinhMuc, strDinhMucId);
                    
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
    genList_drpDinhMuc: function (data, drpDinhMuc, strDinhMucId) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: [drpDinhMuc],
            type: "",
            title: "Chọn định mức"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + drpDinhMuc).val(strDinhMucId).trigger("change");
        $("#" + drpDinhMuc).select2({//Search on modal
            dropdownParent: $('#modalThongTinChiTiet .modal-content')
        });
    },
    UpdateDinhMuc: function (strId, strDinhmucID, strStartDate, strEndDate) {
        var me = this;
        var strCachNhapDMMG = "2";
 
        var obj_list = {
            'action': 'TKGG_QLKLGD/UpdateDinhMuc',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strStaffID': me.strGiangVienId,            
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strDinhmucID': strDinhmucID,
            'strStartDate': strStartDate,
            'strEndDate': strEndDate,
            'strCachNhapDMMG': strCachNhapDMMG, 
            'strNguoiThucHienId': edu.system.userId,
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
    Update_NhapDinhMuc: function (strGiangVienId, strDinhMucGDNhap, strDinhMucNCKHNhap) {
        var me = this;
        

        var obj_list = {
            'action': 'TKGG_QLKLGD/Update_NhapDinhMuc',
            'versionAPI': 'v1.0',
            'strStaffID': strGiangVienId,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strDinhMucGDNhap': strDinhMucGDNhap, 
            'strDinhMucNCKHNhap': strDinhMucNCKHNhap, 
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
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
    DeleteDinhMucNhanvien: function (strDinhMucIds) {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_QLKLGD/DeleteDinhMucNhanvien',
            'versionAPI': 'v1.0',
            'strDinhMucIds': strDinhMucIds,
            'strNguoiThucHienId': edu.system.userId,
            
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblThongTin();
                    me.getList_tblDinhMuc(me.strGiangVienId);
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
    getList_drpMienGiam: function (drpMienGiam, strMienGiamId) {
        var me = this;

        var obj_list = {
            'action': 'TKGG_QLKLGD/GetListMienGiam',           
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpMienGiam(data.Data, drpMienGiam, strMienGiamId);

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
    genList_drpMienGiam: function (data, drpMienGiam, strMienGiamId) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: [drpMienGiam],
            type: "",
            title: "Chọn miễn giảm"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + drpMienGiam).val(strMienGiamId).trigger("change");
        $("#" + drpMienGiam).select2({//Search on modal
            dropdownParent: $('#modalThongTinChiTiet .modal-content')
        });
    },
    UpdateMienGiam: function (strId, strMienGiamID, strStartDate, strEndDate) {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_QLKLGD/UpdateMienGiam',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strStaffID': me.strGiangVienId,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strMienGiamID': strMienGiamID,
            'strStartDate': strStartDate,
            'strEndDate': strEndDate,
            'strCachNhapDMMG': strCachNhapDMMG,
            'strNguoiThucHienId': edu.system.userId,
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
    DeleteMienGiamNhanvien: function (strMienGiamIds) {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_QLKLGD/DeleteMienGiamNhanvien',
            'versionAPI': 'v1.0',
            'strMienGiamIds': strMienGiamIds,
            'strNguoiDungId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblThongTin();
                    me.getList_tblMienGiam(me.strGiangVienId);
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
    
    getList_tblDonGia: function (strStaffId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_QLKLGD/GetQuaTrinhDonGia',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strStaffId': strStaffId,
            'strNguoiThucHienId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDonGiaGiangVien = data.Data;
                    me.genTable_tblDonGia(data.Data, data.Pager);

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
                center: [0,5 ],
            },
            aoColumns: [
                {
                    //"mDataProp": "LOAIGIANGVIEN"
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<select class="form-select select-opt" id="drpDonGia' + aData.ID + '" aria-label="Default select example">'
                            + '<option value="">Chọn đơn giá</option>'
                            + '</select>';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "DONGIA"
                },
                {
                    //"mDataProp": "NGAYTHANGBATDAU"
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<input type="text" class="form-control" id="txtDonGia_TuNgay' + aData.ID + '" style="width:150px;" placeholder="Từ ngày" value="' + edu.util.returnEmpty( aData.NGAYTHANGBATDAU)+'">';
                        return strReturn;
                    }
                        
                },
                {
                    //"mDataProp": "NGAYTHANGKETTHUC"
                     "mRender": function (nRow, aData) {
                         var strReturn =
                             '<input type="text" class="form-control" id="txtDonGia_DenNgay' + aData.ID + '" style="width:150px;" placeholder="Đến ngày" value="' + edu.util.returnEmpty(aData.NGAYTHANGKETTHUC) + '">';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }

                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        for (var i = 0; i < data.length; i++) {
            var strDonGiaId = data[i].TBL_KLGD_DONGIAGIANGDAYID;
            me.getList_DonGia('drpDonGia' + data[i].ID, strDonGiaId);
            
           
        }
    },
    UpdateDonGiaGiangVien: function (strId, strDonGiaId, strStartDate, strEndDate) {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_QLKLGD/UpdateDonGiaGiangVien',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strStaffID': me.strGiangVienId,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strDonGiaId': strDonGiaId,
            'strStartDate': strStartDate,
            'strEndDate': strEndDate,
            'strCachNhapDMMG': strCachNhapDMMG,
            'strNguoiThucHienId': edu.system.userId,
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
    DeleteDonGiaGiangVien: function (strDonGiaIds) {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_QLKLGD/DeleteDonGiaGiangVien',
            'versionAPI': 'v1.0',
            'strDonGiaIds': strDonGiaIds,
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblThongTin();
                    me.getList_tblDonGia(me.strGiangVienId);
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
    TongHopDinhMuc: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_QLKLGD/TongHopDinhMuc',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNhomMonHocID': edu.util.getValById('drpBoMon'),
            'strNguoiThucHienId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblThongTin();

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

    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },
    import_MIENGIAM: function (a, strPath) {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/Import_MienGiam',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {


                    edu.system.viewFiles("txtFile_DMIP", "");

                    //  console.log(dtThanhCong);
                    if (data.Message == "")
                        $("#notify_import").html("Import thành công");
                    else
                        $("#notify_import").html("Import lỗi " + data.Message);

                    //if (me.dtErr.length > 0)
                    //  me.report("DANHSACHCAUHOIIMPORTLOI");
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                edu.system.endLoading();

            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(+ JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    import_DINHMUC: function (a, strPath) {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/Import_DinhMuc',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {


                    edu.system.viewFiles("txtFile_DMIP", "");

                    //  console.log(dtThanhCong);
                    if (data.Message == "")
                        $("#notify_import").html("Import thành công");
                    else
                        $("#notify_import").html("Import lỗi " + data.Message);

                    //if (me.dtErr.length > 0)
                    //  me.report("DANHSACHCAUHOIIMPORTLOI");
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                edu.system.endLoading();

            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(+ JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    import_DONGIA: function (a, strPath) {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/Import_DonGiaGiangVien',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {


                    edu.system.viewFiles("txtFile_DMIP", "");

                    //  console.log(dtThanhCong);
                    if (data.Message == "")
                        $("#notify_import").html("Import thành công");
                    else
                        $("#notify_import").html("Import lỗi " + data.Message);

                    //if (me.dtErr.length > 0)
                    //  me.report("DANHSACHCAUHOIIMPORTLOI");
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                edu.system.endLoading();

            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(+ JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    report: function (strLoaiBaoCao) {

        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        if (strLoaiBaoCao == "") {
            edu.system.alert("Bạn chưa chọn mẫu báo cáo");
            return;
        }
        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
        addKeyValue("tokenJWT", edu.system.tokenJWT);

        var strExamRoomInfoIds = "";
        var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
        for (var i = 0; i < arrChecked_Id.length; i++) {
            strExamRoomInfoIds += arrChecked_Id[i] + ";";
        }
        strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);

        addKeyValue("strExamRoomInfoIds", strExamRoomInfoIds);



        var obj_save = {
            'strTuKhoa': arrTuKhoa.toString(),
            'strDuLieu': arrDuLieu.toString(),
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                        location.href = url_report;
                    }
                }
                else {
                    edu.system.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },
}

