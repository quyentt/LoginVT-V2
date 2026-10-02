function dinhmucmiengiam() { };
dinhmucmiengiam.prototype = {
    
    strErr: '',
    strGiangVienId: '',
    dtDinhMucGiangVien: [],
    dtThongTinGiangVien: [],
    dtDonGia: [],
    init: function () {
        var me = this;
        me.page_load();
        $('#drpSchoolYear').on('select2:select', function () {             
            me.getList_drpBoMon();
            me.getList_drpDinhMuc();
            me.getList_drpMienGiam();
            me.getList_DonGia();
        });
         
        $('#drpBoMon').on('select2:select', function () {
            me.getList_tblThongTin();
            
        });
            
        $("#tblThongTin").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            $("#modalThongTinChiTiet").modal('show');
            var dt = edu.util.objGetDataInData(strId, me.dtThongTinGiangVien, "ID");
            $('#lblGiangVien').text(dt[0].HOCHAMHOCVI + ' ' + dt[0].HOTEN);
            $('#lblBoMon').text(dt[0].TENBM);
            me.strGiangVienId = strId;
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

            me.UpdateDinhMuc();

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

            me.UpdateMienGiam();

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

            me.UpdateDonGiaGiangVien();

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

        $('#btnTongHop').click(function () {
            me.TongHopDinhMuc();
        });
        
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_SchoolYear();        
        me.getList_tblThongTin(); 
        me.getList_drpDinhMuc();
        me.getList_drpMienGiam();
        me.getList_DonGia();
        

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
    getList_drpBoMon: function () {
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
            'action': 'TKGG_KLGD/GetThongTinDinhMucMienGiam',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'NhomMonHocID': edu.util.getValById('drpBoMon'),
            'strNguoiDung_Id': edu.system.userId,
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
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "HOCHAMHOCVI"
                },
                {
                    "mDataProp": "DMGD_THUCTE"
                },
                {
                    "mDataProp": "DMNCKH_THUCTE"
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
    
    getList_DonGia: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_KLGD/GetDonGia',
            'versionAPI': 'v1.0',
            'Nienhoc': edu.util.getValById('drpSchoolYear'),
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpDonGia(data.Data);

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
    genList_drpDonGia: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DONGIAGIANGVIEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDonGia"],
            type: "",
            title: "Chọn đơn giá"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblDinhMuc: function (strStaffId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_KLGD/GetDinhMucGV',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strStaffId': strStaffId,
            'strNguoiDung_Id': edu.system.userId,
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
                    "mDataProp": "TENDM"
                },
                {
                    "mDataProp": "DMGD"
                },
                {
                    "mDataProp": "DMNCKH"
                },
                {
                    "mDataProp": "NGAYTHANGBATDAU"
                },
                {
                    "mDataProp": "NGAYTHANGKETTHUC"
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
    },
    getList_tblMienGiam: function (strStaffId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_KLGD/GetMienGiamGV',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strStaffId': strStaffId,
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

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
                    "mDataProp": "TENMG"
                },
                {
                    "mDataProp": "MGGD"
                },
                {
                    "mDataProp": "MGNCKH"
                },
                {
                    "mDataProp": "NGAYTHANGBATDAU"
                },
                {
                    "mDataProp": "NGAYTHANGKETTHUC"
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
    },
    getList_drpDinhMuc: function () {
        var me = this;
      
        var obj_list = {
            'action': 'TKGG_KLGD/GetListDinhMuc',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpDinhMuc(data.Data);
                    
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
    genList_drpDinhMuc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDinhMuc"],
            type: "",
            title: "Chọn định mức"
        };
        edu.system.loadToCombo_data(obj);
    },
    UpdateDinhMuc: function ( ) {
        var me = this;
        var strCachNhapDMMG = "2";
 
        var obj_list = {
            'action': 'TKGG_KLGD/UpdateDinhMuc',
            'versionAPI': 'v1.0',
            'strId': "",
            'strStaffID': me.strGiangVienId,            
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strDinhmucID': edu.util.getValById('drpDinhMuc'),
            'strStartDate': edu.util.getValById('txtDinhMuc_TuNgay'),
            'strEndDate': edu.util.getValById('txtDinhMuc_DenNgay'),
            'strCachNhapDMMG': strCachNhapDMMG, 
            'strNguoiDungId': edu.system.userId,
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
    DeleteDinhMucNhanvien: function (strDinhMucIds) {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_KLGD/DeleteDinhMucNhanvien',
            'versionAPI': 'v1.0',
            'strDinhMucIds': strDinhMucIds,
            'strNguoiDungId': edu.system.userId,
            
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
    getList_drpMienGiam: function () {
        var me = this;

        var obj_list = {
            'action': 'TKGG_KLGD/GetListMienGiam',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpMienGiam(data.Data);

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
    genList_drpMienGiam: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpMienGiam"],
            type: "",
            title: "Chọn miễn giảm"
        };
        edu.system.loadToCombo_data(obj);
    },
    UpdateMienGiam: function () {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_KLGD/UpdateMienGiam',
            'versionAPI': 'v1.0',
            'strId': "",
            'strStaffID': me.strGiangVienId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strMienGiamID': edu.util.getValById('drpMienGiam'),
            'strStartDate': edu.util.getValById('txtMienGiam_TuNgay'),
            'strEndDate': edu.util.getValById('txtMienGiam_DenNgay'),
            'strCachNhapDMMG': strCachNhapDMMG,
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
    DeleteMienGiamNhanvien: function (strMienGiamIds) {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_KLGD/DeleteMienGiamNhanvien',
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
            'action': 'TKGG_KLGD/GetQuaTrinhDonGia',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strStaffId': strStaffId,
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

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
                    "mDataProp": "LOAIGIANGVIEN"
                },
                {
                    "mDataProp": "DONGIA"
                },
                {
                    "mDataProp": "NGAYTHANGBATDAU"
                },
                {
                    "mDataProp": "NGAYTHANGKETTHUC"
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
    },
    UpdateDonGiaGiangVien: function () {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_KLGD/UpdateDonGiaGiangVien',
            'versionAPI': 'v1.0',
            'strId': "",
            'strStaffID': me.strGiangVienId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strDonGiaId': edu.util.getValById('drpDonGia'),
            'strStartDate': edu.util.getValById('txtDonGia_TuNgay'),
            'strEndDate': edu.util.getValById('txtDonGia_DenNgay'),
            'strCachNhapDMMG': strCachNhapDMMG,
            'strNguoiDungId': edu.system.userId,
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
    DeleteDonGiaGiangVien: function (strDonGiaIds) {
        var me = this;
        var strCachNhapDMMG = "2";

        var obj_list = {
            'action': 'TKGG_KLGD/DeleteDonGiaGiangVien',
            'versionAPI': 'v1.0',
            'strDonGiaIds': strDonGiaIds,
            'strNguoiDungId': edu.system.userId,

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
            'action': 'TKGG_KLGD/TongHopDinhMuc',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strNhomMonHocID': edu.util.getValById('drpBoMon'),
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
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
}

