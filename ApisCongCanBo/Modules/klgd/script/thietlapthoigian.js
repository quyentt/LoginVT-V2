function thietlapthoigian() { };
thietlapthoigian.prototype = {
    dtPhanQuyenThoiGian:[],     
    strErr:'',   
    init: function () {
        var me = this;
        me.page_load();

        $('#drpSchoolYear').on('select2:select', function () {
          
            me.getList_drpDotHoc();
            me.getList_tblPhanQuyenThoiGian();
        });
        $('#drpHocKy').on('select2:select', function () {

            me.getList_drpDotHoc();
            me.getList_tblPhanQuyenThoiGian();
        });
        $('#drpDotHoc').on('select2:select', function () {

            
            me.getList_tblPhanQuyenThoiGian();
        });
        $('#btnFillThoiGian').click(function () { 
          
            for (var i = 0; i < me.dtPhanQuyenThoiGian.length; i++) {
                
                $('#txtThoiGianBatDau' + me.dtPhanQuyenThoiGian[i].USERID).val(edu.util.getValById('txtDienThoiGianBatDau'));
                $('#txtThoiGianKetThuc' + me.dtPhanQuyenThoiGian[i].USERID).val(edu.util.getValById('txtDienThoiGianKetThuc'));
            }
        });
        $('#btnLuu').click(function () {
            if (edu.util.getValById('drpDotHoc') == "") {
                edu.system.alert('Bạn chưa chọn đợt');
                return;
            }
            if (edu.util.getValById('drpHocKy') == "") {
                edu.system.alert('Bạn chưa chọn học kỳ');
                return;
            }
            edu.system.confirm("Bạn có chắc chắn cập nhật ?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strUserId = "";
                var strThoiGianBatDau = "";
                var strThoiGianKetThuc = "";
                var strLaUserQuanTri = "";
                for (var i = 0; i < me.dtPhanQuyenThoiGian.length; i++) {

                    strUserId = me.dtPhanQuyenThoiGian[i].USERID;
                    strThoiGianBatDau = edu.util.getValById('txtThoiGianBatDau' + me.dtPhanQuyenThoiGian[i].USERID);
                    strThoiGianKetThuc = edu.util.getValById('txtThoiGianKetThuc' + me.dtPhanQuyenThoiGian[i].USERID);
                    
                    strLaUserQuanTri = "0"; 
                    if ($('#checkX' + me.dtPhanQuyenThoiGian[i].USERID).is(":checked"))
                        strLaUserQuanTri = "1";
                    console.log("strLaUserQuanTri " + strLaUserQuanTri);
                    me.UpdatePhanQuyenTheoThoiGian(strUserId, strThoiGianBatDau, strThoiGianKetThuc, strLaUserQuanTri);
                }
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);
                    
                    
                
            });
          
        });

        $('#drpHeDaoTao').on('select2:select', function () {
            me.getList_drpAcademicyear();
           
        });
 

      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_SchoolYear();
        me.getList_drpDotHoc();
        me.getList_drpHeDaoTao();
        me.getList_drpAcademicyear();   
        me.getList_tblPhanQuyenThoiGian();
         

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
    getList_drpDotHoc: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');


        var obj_list = {
            'action': 'TKGG_KLGD/GetDotHoc',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHocKy': strHocKy,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpDotHoc(data.Data);
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
    genList_drpDotHoc: function (data) {

        var obj = {
            data: data,
            renderInfor: {
                id: "DOT",
                parentId: "",
                name: "DOT",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDotHoc"],
            type: "",
            title: "Chọn đợt"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpHeDaoTao: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');

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
    getList_drpAcademicyear: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');

        var obj_list = {
            'action': 'TKGG_KLGD/GetAcademicYearByFormOfEdu',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'EducationSystemId': edu.util.getValById('drpHeDaoTao'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpAcademicyear(data.Data);
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
    genList_drpAcademicyear: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpAcademicyear"],
            type: "",
            title: "Chọn khóa"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblPhanQuyenThoiGian: function () {
        var me = this;
        //--Edit
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/GetDSPQTheoThoiGian',
            'versionAPI': 'v1.0', 
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strNguoiDung_Id': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblPhanQuyenThoiGian(data.Data, data.Pager);
                    me.dtPhanQuyenThoiGian = data.Data;
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
    genTable_tblPhanQuyenThoiGian: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhanQuyenThoiGian",
            aaData: data,

            sort: true,
            colPos: {
                center: [0, 1],
            },
            aoColumns: [
                {
                    "mDataProp": "MATAIKHOAN"
                },
                {
                    "mDataProp": "TENTAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                   
                        return '<input type="text"   id="txtThoiGianBatDau' + aData.USERID + '"  value="' + edu.util.returnEmpty(aData.THOIGIANBATDAU) + '" >';
                        
                    }
                },
                {
                    "mRender": function (nRow, aData) {

                        return '<input type="text"  id="txtThoiGianKetThuc' + aData.USERID + '"    value="' + edu.util.returnEmpty(aData.THOIGIANKETTHUC) + '" >';

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<input type="checkbox" id="checkX' + aData.USERID + '"/>';
                        if (aData.LAUSERQUANTRI =="1")
                            strReturn = '<input type="checkbox" id="checkX' + aData.USERID + '" checked />';
                        return strReturn;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    UpdatePhanQuyenTheoThoiGian: function (strUserId, strThoiGianBatDau, strThoiGianKetThuc, strLaUserQuanTri) {
        var me = this;             
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/UpdatePhanQuyenTheoThoiGian',
            'versionAPI': 'v1.0',

            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strUserId': strUserId,
            'strThoiGianBatDau': strThoiGianBatDau,
            'strThoiGianKetThuc': strThoiGianKetThuc,
            'strLaUserQuanTri': strLaUserQuanTri,
            'strNguoiDung_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                }
                else {
                    
                    me.strErr += JSON.stringify(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                me.strErr += JSON.stringify(er);
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

