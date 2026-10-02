function qlklgd_thietlapthoigian() { };
qlklgd_thietlapthoigian.prototype = {
    dtPhanQuyenThoiGian:[],     
    strErr:'',   
    init: function () {
        var me = this;
        me.page_load();

        $('#drpNamHoc').on('select2:select', function () {
             
            me.getList_drpHocKy(); 
        });
        $('#drpHocKy').on('select2:select', function () {

            me.getList_drpDotHoc(); 
        });
        $('#drpDotHoc').on('select2:select', function () {
             
            var strHeDaoTao_Ids = me.getHeDaoTaoIds();
            
            me.getList_tblPhanQuyenThoiGian(strHeDaoTao_Ids);
        });
        $('#drpHeDaoTao').on('select2:select', function () { 
            var strHeDaoTao_Ids = me.getHeDaoTaoIds();
            
            me.getList_tblPhanQuyenThoiGian(strHeDaoTao_Ids);
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
            var strHeDaoTao_Ids = me.getHeDaoTaoIds();
            if (strHeDaoTao_Ids == "") {
                edu.system.alert('Bạn chưa chọn hệ đào tạo');
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
                    
                    me.UpdatePhanQuyenTheoThoiGian(strUserId, strThoiGianBatDau, strThoiGianKetThuc, strLaUserQuanTri, strHeDaoTao_Ids);
                }
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);
                    
                    
                
            });
          
        });
        
 

      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_NamHoc();
        me.getList_drpHeDaoTao();
        
        //me.getList_drpDotHoc();
        //me.getList_tblPhanQuyenThoiGian();
         

    },
    getList_NamHoc: function () {
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
    getList_drpHeDaoTao: function () {
        var me = this;

        var obj_list = {
            'action': 'TKGG_QLKLGD/ListDS_HeDaoTao',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,

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
    getList_drpHocKy: function () {
        var me = this;
        
        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strThoiGian': edu.util.getValById('drpNamHoc'),
            'strLoaiThoiGian': 'HOCKY',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpHocKy(data.Data);
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
    genList_drpHocKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "HOCKY",
                parentId: "",
                name: "HOCKY",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHocKy"],
            type: "",
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_drpDotHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strThoiGian': edu.util.getValById('drpHocKy'),
            'strLoaiThoiGian': 'DOTHOC',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
            
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
                id: "ID",
                parentId: "",
                name: "DOTHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDotHoc"],
            type: "",
            title: "Chọn đợt"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblPhanQuyenThoiGian: function (strHeDaoTao_Ids) {
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDSPQTheoThoiGian',
            'versionAPI': 'v1.0', 
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strHeDaoTao_Ids': strHeDaoTao_Ids,            
            'strNguoiThucHienId': edu.system.userId,

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
    UpdatePhanQuyenTheoThoiGian: function (strUserId, strThoiGianBatDau, strThoiGianKetThuc, strLaUserQuanTri, strHeDaoTao_Ids) {
        var me = this;
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/UpdatePhanQuyenTheoThoiGian',
            'versionAPI': 'v1.0',

            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHoc': $('#drpDotHoc').find('option:selected').text(),
            'strUserId': strUserId,
            'strThoiGianBatDau': strThoiGianBatDau,
            'strThoiGianKetThuc': strThoiGianKetThuc,
            'strLaUserQuanTri': strLaUserQuanTri,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('drpDotHoc'),
            'strHeDaoTao_Ids': strHeDaoTao_Ids,
            'strNguoiThucHienId': edu.system.userId,
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
    getHeDaoTaoIds: function() {
    const select = document.getElementById("drpHeDaoTao");
    const values = Array.from(select.selectedOptions)
        .map(o => o.value)
        .filter(v => v !== "");
    return values.join(",");
    },
}

