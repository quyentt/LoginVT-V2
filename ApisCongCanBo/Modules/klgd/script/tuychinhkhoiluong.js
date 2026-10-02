function tuychinhkhoiluong() { };
tuychinhkhoiluong.prototype = {
    dtHinhThucGiang: [],
    strErr: '',
    dtKhoiLuongThoiKhoaBieu:[],
   
    init: function () {
        var me = this;
        me.page_load();
        $('#drpSchoolYear').on('select2:select', function () {          
            me.getList_drpDotHoc();
            me.getList_drpBoMon();             
            me.getList_drpGiangVien();
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
            
        });         
        $('#drpHocKy').on('select2:select', function () {
            me.getList_drpDotHoc();   
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
            
        });
        $('#drpDotHoc').on('select2:select', function () { 
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
        });

        $('#drpHeDaoTao').on('select2:select', function () {
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
            
            
        });
        $('#drpBoMon').on('select2:select', function () {
            me.getList_drpGiangVien();
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
            

            
        });
        $("#btnXoa_PhanCong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiLuong", "checkXDelete");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strKhoiLuongThoiKhoaBieuId_Xoa = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strKhoiLuongThoiKhoaBieuId_Xoa += arrChecked_Id[i] + ",";
                }
                strKhoiLuongThoiKhoaBieuId_Xoa = strKhoiLuongThoiKhoaBieuId_Xoa.substr(0, strKhoiLuongThoiKhoaBieuId_Xoa.length - 1);

                me.XoaKhoiLuong(strKhoiLuongThoiKhoaBieuId_Xoa);
            });


        });
        $('#drpLoaiTiet').on('select2:select', function () {
            
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");

        });
        $('#drpKieuLop').on('select2:select', function () {

            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");

        });
        $("#btnDanhSach").click(function () {
            me.getList_tblKhoiLuong();


        });
        $('#btnCapNhat').click(function () {  
            
            edu.system.confirm("Bạn có chắc chắn cập nhật ?");
           
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                for (var i = 0; i < me.dtKhoiLuongThoiKhoaBieu.length; i++) {
                    var strID = me.dtKhoiLuongThoiKhoaBieu[i].ID;
                    var StaffID = me.dtKhoiLuongThoiKhoaBieu[i].STAFFID;
                    var NamHoc = me.dtKhoiLuongThoiKhoaBieu[i].NAMHOC;
                    var HocKy = me.dtKhoiLuongThoiKhoaBieu[i].HOCKY;
                    var strTenMon = me.dtKhoiLuongThoiKhoaBieu[i].TENMON;
                    var strTenLop = me.dtKhoiLuongThoiKhoaBieu[i].TENLOP;
                    var strSoSinhVien = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOSV);
                    var strTongSoTiet = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOTIET);
                    var strThoiKhoaBieu = me.dtKhoiLuongThoiKhoaBieu[i].LICHHOC;
                    var strHeDaoTao = me.dtKhoiLuongThoiKhoaBieu[i].IDHEDAOTAO;
                    var KieuLop = me.dtKhoiLuongThoiKhoaBieu[i].KIEUHOC;
                    var strSoTietTheoKeHoach = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOTIET);
                    var strDVHT = me.dtKhoiLuongThoiKhoaBieu[i].DVHT;
                    var strSoNgay = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SONGAY);
                    var strHinhThucGiangDay = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].HINHTHUCGIANGDAYID);
                    var strTIETLYTHUYET_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETLYTHUYET_DC);
                    var strTIETBAITAP_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETBAITAP_DC);
                    var strTIETTHAOLUAN_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETTHAOLUAN_DC);
                    var strTIETTHINGHIEM_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETTHINGHIEM_DC);
                    var strTIETTHUCHANH_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETTHUCHANH_DC);
                    var strBTL = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].BTL);
                    var strTKMH = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TKMH);
                    var strSoTien = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOTIEN);
                    var strTrongTruong = me.dtKhoiLuongThoiKhoaBieu[i].TRONGTRUONG;
                    var strLoai = me.dtKhoiLuongThoiKhoaBieu[i].LOAITIET;
                    var strSoTietHDMotSinhVien = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOTIETHUONGDANMOTSV);
                    var strHeSoTinChi = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].HESOTINCHI);
                    var strCheckTrongTruong = $('#checkX' + me.dtKhoiLuongThoiKhoaBieu[i].ID).is(":checked") == true ? "1" : "0";
                    
                        
                    
                    if (strSoSinhVien != edu.util.getValById('txtSoSV' + me.dtKhoiLuongThoiKhoaBieu[i].ID ) ||
                        
                        strTIETLYTHUYET_DC != edu.util.getValById('txtTIETLYTHUYET_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID ) ||
                        strTIETBAITAP_DC != edu.util.getValById('txtTIETBAITAP_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strTIETTHAOLUAN_DC != edu.util.getValById('txtTIETTHAOLUAN_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strTIETTHINGHIEM_DC != edu.util.getValById('txtTIETTHINGHIEM_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strTIETTHUCHANH_DC != edu.util.getValById('txtTIETTHUCHANH_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strBTL != edu.util.getValById('txtBTL' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strTKMH != edu.util.getValById('txtTKMH' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strSoNgay != edu.util.getValById('txtSONGAY' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strSoTietHDMotSinhVien != edu.util.getValById('txtSOTIETHUONGDANMOTSV' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strHinhThucGiangDay != edu.util.getValById('drpHinhThucGiang' + me.dtKhoiLuongThoiKhoaBieu[i].ID) ||
                        strTrongTruong != strCheckTrongTruong
                    ) {


                        //console.log(strSoSinhVien + "; " + edu.util.getValById('txtSoSV' + me.dtKhoiLuongThoiKhoaBieu[i].ID));

                        //console.log("strTIETLYTHUYET_DC" + strTIETLYTHUYET_DC + "; " + edu.util.getValById('txtTIETLYTHUYET_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTIETBAITAP_DC" + strTIETBAITAP_DC + "; " + edu.util.getValById('txtTIETBAITAP_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTIETTHAOLUAN_DC" + strTIETTHAOLUAN_DC + "; " + edu.util.getValById('txtTIETTHAOLUAN_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTIETTHINGHIEM_DC" + strTIETTHINGHIEM_DC + "; " + edu.util.getValById('txtTIETTHINGHIEM_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTIETTHUCHANH_DC" + strTIETTHUCHANH_DC + "; " + edu.util.getValById('txtTIETTHUCHANH_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strBTL" + strBTL + "; " + edu.util.getValById('txtBTL' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTKMH" + strTKMH + "; " + edu.util.getValById('txtTKMH' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strSoNgay" + strSoNgay + "; " + edu.util.getValById('txtSONGAY' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strSoTietHDMotSinhVien" + strSoTietHDMotSinhVien + "; " + edu.util.getValById('txtSOTIETHUONGDANMOTSV' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strHinhThucGiangDay" + strHinhThucGiangDay + "; " + edu.util.getValById('drpHinhThucGiang' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTrongTruong" + strTrongTruong + "; " + strCheckTrongTruong);
                        //console.log("dtKhoiLuongThoiKhoaBieu[i].ID " + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        //alert("strHinhThucGiangDay" + strHinhThucGiangDay + "; " + edu.util.getValById('drpHinhThucGiang' + me.dtKhoiLuongThoiKhoaBieu[i].ID))
                        

                        strSoSinhVien = edu.util.getValById('txtSoSV' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strHeSoTinChi = edu.util.getValById('txtHESOTINCHI' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strTIETLYTHUYET_DC = edu.util.getValById('txtTIETLYTHUYET_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strTIETBAITAP_DC = edu.util.getValById('txtTIETBAITAP_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strTIETTHAOLUAN_DC = edu.util.getValById('txtTIETTHAOLUAN_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strTIETTHINGHIEM_DC = edu.util.getValById('txtTIETTHINGHIEM_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strTIETTHUCHANH_DC = edu.util.getValById('txtTIETTHUCHANH_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strBTL = edu.util.getValById('txtBTL' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strTKMH = edu.util.getValById('txtTKMH' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strSoNgay = edu.util.getValById('txtSONGAY' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strSoTietHDMotSinhVien = edu.util.getValById('txtSOTIETHUONGDANMOTSV' + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        strHinhThucGiangDay = edu.util.getValById('drpHinhThucGiang' + me.dtKhoiLuongThoiKhoaBieu[i].ID); 
                        strTrongTruong = strCheckTrongTruong;
                        me.Update_TuyChinh(strID, StaffID, NamHoc, HocKy, strTenMon, strTenLop,
                            strSoSinhVien, strTongSoTiet,
                            strThoiKhoaBieu, strHeDaoTao, KieuLop, strSoTietTheoKeHoach,
                            strDVHT, strSoNgay, strHinhThucGiangDay, strTIETLYTHUYET_DC,
                            strTIETBAITAP_DC, strTIETTHAOLUAN_DC, strTIETTHINGHIEM_DC, strTIETTHUCHANH_DC,
                            strBTL, strTKMH, strSoTien, strTrongTruong, strLoai,
                            strSoTietHDMotSinhVien, strHeSoTinChi);
                    }
                }
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);

                setTimeout(function () {
                    me.getList_tblKhoiLuong(); 
                }, 2000);

            });
           
         
        });
        $('#drpGiangVien').on('select2:select', function () {

            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
            
        });
        edu.system.getList_MauImport("zonebtnTuyChinhKLGD", function (addKeyValue) {
            var obj_list = {
                'strNamHoc': edu.util.getValById('drpSchoolYear'),                
                'strChucNang_Id': edu.system.strChucNang_Id,
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
          
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_SchoolYear();  
        me.getList_drpDotHoc();
        me.getList_drpHeDaoTao();            
        me.getList_drpBoMon();
        me.getList_drpGiangVien();
        me.getList_HinhThucGiang();
        

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
    getList_drpGiangVien: function () {
        var me = this;
        

        var obj_list = {
            'action': 'TKGG_KLGD/GetListStaff',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNhomMonHocId': edu.util.getValById('drpBoMon'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                    me.genList_drpGiangVien(data.Data);
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
    genList_drpGiangVien: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NHANVIENID",
                parentId: "",
                name: "HOTEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpGiangVien"],
            type: "",
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblKhoiLuong: function () {
        var me = this;
        //--Edit
        var strStaffId = edu.util.getValById('drpGiangVien');
        var strNhomMonHocId = edu.util.getValById('drpBoMon');
        
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');

        var obj_list = {
            'action': 'TKGG_KLGD/GetKhoiLuongTKBTuyChinh',
            'versionAPI': 'v1.0',
            'strNhomMonHocId': strNhomMonHocId,
            'StaffId': strStaffId,
            'NamHoc': edu.util.getValById('drpSchoolYear'), 
            'strHocKy': strHocKy, 
            'strDotHoc': edu.util.getValById('drpDotHoc'), 
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'), 
            'strKieuLop': edu.util.getValById('drpKieuLop'), 
            'strHTQT': edu.util.getValById('drpLoaiTiet'), 
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoiLuongThoiKhoaBieu = data.Data;
                    me.genTable_tblKhoiLuong(data.Data, data.Pager);

                    
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
    genTable_tblKhoiLuong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);

        var jsonForm = {
            strTable_Id: "tblKhoiLuong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "LOAI"
                }, 
                {
                    "mDataProp": "BOMON"
                },
                {
                    
                    "mRender": function (nRow, aData) {
                        //return '<input type ="text" id="txtDiemDuocCongNhan' + aData.ID  + '" value ="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" />';
                        var strReturn = aData.TENMON + "_" + "<span style = 'color:red'>" + aData.MAHOCPHAN +"_"+ aData.DVHT+ "</span>";
                       
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        //return '<input type ="text" id="txtDiemDuocCongNhan' + aData.ID  + '" value ="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" />';
                        var strReturn = aData.TENLOP;
                        if (aData.TACHTHEOSINHVIEN_TIET == "SV")
                            strReturn = strReturn + "<span style = 'color:red'>(Tách theo SV)</span>";
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = strReturn + "<span style = 'color:red'>(Tách theo tiết)</span>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "LOAILOPHOCPHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtSoSV' + aData.ID + '" value="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "HEDAOTAO"
                },
                {
                    "mDataProp": "HOCKY"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtHESOTINCHI' + aData.ID + '" value="' + edu.util.returnEmpty(aData.HESOTINCHI) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETLYTHUYET_DC' + aData.ID + '" value="' + edu.util.returnEmpty(aData.TIETLYTHUYET_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETBAITAP_DC' + aData.ID + '" value="' + edu.util.returnEmpty(aData.TIETBAITAP_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETTHAOLUAN_DC' + aData.ID + '" value="' + edu.util.returnEmpty(aData.TIETTHAOLUAN_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETTHINGHIEM_DC' + aData.ID + '" value="' + edu.util.returnEmpty(aData.TIETTHINGHIEM_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) { 
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETTHUCHANH_DC' + aData.ID + '" value="' + edu.util.returnEmpty(aData.TIETTHUCHANH_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) { 
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtBTL' + aData.ID + '" value="' + edu.util.returnEmpty(aData.BTL) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTKMH' + aData.ID + '" value="' + edu.util.returnEmpty(aData.TKMH) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn =  
                        '<div class="form-item d-flex form-add-info">'+
                        '    <div class="input-group no-icon">'+
                        '        <input id="txtSONGAY' + aData.ID + '" value="' + edu.util.returnEmpty(aData.SONGAY)+'" class="form-control" style="width: 50px; height: 32px">'+
                        '    </div>'+
                        '</div>'; 
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<span>' + edu.util.returnEmpty(aData.TENHINHTHUCGIANGDAY) + '</span>'
                            +'<select class="form-select select-opt" id="drpHinhThucGiang' + aData.ID + '" aria-label="Default select example">'
                            + '<option value="">Chọn hình thức giảng</option>'
                            + '</select>';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "HOTEN"
                }, 
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                        if (aData.TRONGTRUONG == 1)
                            strReturn = '<input type="checkbox" id="checkX' + aData.ID + '" checked />';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtSOTIETHUONGDANMOTSV' + aData.ID + '" value="' + edu.util.returnEmpty(aData.SOTIETHUONGDANMOTSV) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkXDelete' + aData.ID + '"/>';
                    }

                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            me.genList_HinhThucGiang(me.dtHinhThucGiang, 'drpHinhThucGiang' + data[i].ID);
            var strHinhThcGiangId = data[i].HINHTHUCGIANGDAYID
            $("#" + 'drpHinhThucGiang' + data[i].ID).val(strHinhThcGiangId).trigger("change");
        }
        /*III. Callback*/
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

    getList_HinhThucGiang: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');


        var obj_list = {
            'action': 'TKGG_KLGD/GetHinhThucGiang',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId, 
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.dtHinhThucGiang = data.Data;
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
    genList_HinhThucGiang: function (data, drpHinhThucGiang) {

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: [drpHinhThucGiang],
            type: "",
            title: "Chọn đợt"
        };
        edu.system.loadToCombo_data(obj);
    },
    Update_TuyChinh: function (strID, StaffID, NamHoc, HocKy, strTenMon, strTenLop,
        strSoSinhVien, strTongSoTiet,
        strThoiKhoaBieu, strHeDaoTao, KieuLop, strSoTietTheoKeHoach,
        strDVHT, strSoNgay, strHinhThucGiangDay, strTIETLYTHUYET_DC,
        strTIETBAITAP_DC, strTIETTHAOLUAN_DC, strTIETTHINGHIEM_DC, strTIETTHUCHANH_DC,
        strBTL, strTKMH, strSoTien, strTrongTruong, strLoai,
        strSoTietHDMotSinhVien, strHeSoTinChi) {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');


        var obj_list = {
            'action': 'TKGG_KLGD/UpdateKhoiLuongTKBNienChe',
            'strID': strID,
            'StaffID': StaffID,
            'NamHoc': NamHoc,
            'HocKy': HocKy,
            'strTenMon': strTenMon,
            'strTenLop': strTenLop,
            'strSoSinhVien': strSoSinhVien,
            'strTongSoTiet': strTongSoTiet,
            'strThoiKhoaBieu': strThoiKhoaBieu,
            'strHeDaoTao': strHeDaoTao,
            'strSoTietTheoKeHoach': strSoTietTheoKeHoach,
            'strDVHT': strDVHT,
            'strSoNgay': strSoNgay,
            'strHinhThucGiangDay': strHinhThucGiangDay,
            'strTIETLYTHUYET_DC': strTIETLYTHUYET_DC,
            'strTIETBAITAP_DC': strTIETBAITAP_DC,
            'strTIETTHAOLUAN_DC': strTIETTHAOLUAN_DC,
            'strTIETTHINGHIEM_DC': strTIETTHINGHIEM_DC,
            'strTIETTHUCHANH_DC': strTIETTHUCHANH_DC,
            'strBTL': strBTL,
            'strTKMH': strTKMH,
            'strSoTien': strSoTien,
            'strTrongTruong': strTrongTruong,
            'strLoai': strLoai,
            'strSoTietHDMotSinhVien': strSoTietHDMotSinhVien,
            'strHeSoTinChi': strHeSoTinChi,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUserId': edu.system.userId,
            
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                }
                else {
                    me.strErr += data.Message;
                    
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            async: false,
            data: obj_list,
        }, false, false, false, null);
    },
    XoaKhoiLuong: function (strKhoiLuongThoiKhoaBieuId_Xoa) {
        var me = this;

        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_KLGD/XoaKhoiLuong',
            'versionAPI': 'v1.0',

            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strKhoiLuongThoiKhoaBieuId': strKhoiLuongThoiKhoaBieuId_Xoa,
            'strNguoiDung_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblKhoiLuong();

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



