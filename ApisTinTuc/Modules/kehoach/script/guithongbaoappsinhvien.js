function guithongbaoappsinhvien() { };
guithongbaoappsinhvien.prototype = {
    strTinNhanId: '',
    strErr:'',
    dtTinNhan: [],
    strChonTinNhan:'',
   
    init: function () {
        var me = this; 
        me.page_load();
        
        me.getList_TrangThaiSV();

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        
        

        $("#btnSearch").click(function (e) {
            me.getList_SinhVien();
        });
        $("#btnSearch_TinNhanDaGui").click(function (e) {
            me.getList_TinNhanDaGui();
        });
        $("#btnSearchTinNhan").click(function (e) {
            me.getList_TinNhan();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {

                me.activeTabFun();
            }
        });
        

        $('#dropSearch_HeDaoTao_IHD').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();

            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_IHD').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_IHD').on('select2:select', function (e) {

            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_IHD').on('select2:select', function (e) {

            var x = $(this).val();
            me.resetCombobox(this);
        });        
       
        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_IHD').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $(document).delegate('.optradioTinNhan', 'click', function () {
            me.strChonTinNhan = $(this).attr('id');
        });
        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {

            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate(".ckbLKT_RT_All", "click", function (e) {

            var checked_status = this.checked;
            $(".ckbLKT_IHD").each(function () {
                this.checked = checked_status;
            });
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {   
            me.strTinNhanId = '';
            
            
            if (me.strChonTinNhan  == '') {
                edu.system.alert("Bạn chưa chọn tin nhắn để gửi");
                return;
            }
            
            me.toggle_edit();
        });
        $(".btnGuiTinNhan ").click(function () {                        

            var dt = edu.util.objGetDataInData(me.strChonTinNhan, me.dtTinNhan, "ID");
            me.THEMOI_THONGBAO_TINNHAN_DOTGUI(me.strChonTinNhan, dt[0].TIEUDE, dt[0].NOIDUNG);
            
            
        });
        $(".btnThemTinNhan").click(function () {
            me.strTinNhanId = '';  

            $("#editor_TieuDe").html("");
            $("#editor_NoiDung").html("");
             
           
            setTimeout(function () {
                me.toggle_edit_ThemTinNhan();
            }, 500);
            
        });
        $(".btnAddTinNhan ").click(function () {
            if (edu.util.getValById('editor_NoiDung') == '') {
                edu.system.alert('Bạn chưa nhập nội dung');
                return;
            } 
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.CapNhatTinNhan();
            }); 

        }); 
        $("#tblTinNhan").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strTinNhanId = strId;
            
            var dt = edu.util.objGetDataInData(strId, me.dtTinNhan, "ID");
            if (dt.length > 0) {
                $('#editor_TieuDe').html(dt[0].TIEUDE);
                $('#editor_NoiDung').html(dt[0].NOIDUNG);
            }
            me.toggle_edit_ThemTinNhan();
             

        });
        $("#tblTinNhan").delegate(".btnViewChiTietTinDotGuiTinNhan", "click", function () {
            var strId = this.id;
            me.getList_drpDotGuiTinNhan(strId);
            me.toggle_edit_TinDaGui();


        });
        
        $(".btnGuiTinNhan_ChuaGui ").click(function () {
            me.GuiTinNhanNhungTruongHopChuaNhan();
        });
        $("#btnFileMau").click(function () {
            me.report("MAUTEMPLATEIMPORT");
        });

        $("#btnCall_Import_DMIP").click(function () { 
            me.popup_import();
        });
        $("#btnImport_DMIP").click(function () {
            me.import_DMIP();
        });        
    },
    page_load: function () {
        var me = this; 
        edu.system.uploadImport(["txtFile_DMIP"]);
       



    }, 
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
   
    
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                    edu.system.alert(d.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_KhoaQuanLy/LayDanhSach',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaQuanLy(json);
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                    edu.system.alert(d.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao_IHD"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao_IHD"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_IHD").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh_IHD"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_IHD").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Lop_IHD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_IHD").val("").trigger("change");
    }, 
  
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-6 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-6 checkbox-inline user-check-print">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    }, 
     
    getList_SinhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'D_BaoCao/LayDanhSachHoSoNhieuNganh',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'), 
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': edu.util.getValById('AAAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                  
                   
                    me.genTable_SinhVien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblKetQua";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            sort: true,
            //bPaginate: {
            //    strFuntionName: "main_doc.guithongbaoappsinhvien.getList_SinhVien()",
            //    iDataRow: iPager,
            //    bInfo: false,
            //    bLeft: false
            //},
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7],
                right: [6]
            },

            "aoColumns": [
                {
                    
                     "mRender": function (nRow, aData) {
                         var strReturn = '<span>' + aData.QLSV_NGUOIHOC_MASO + '</span>';
                         strReturn += '<input type="text" style="display:none;" class="chkGuiTinNhanSinhVien" id="' + aData.QLSV_NGUOIHOC_ID + '" />';
                         return strReturn;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
                , {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);        
        
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    toggle_edit_ThemTinNhan: function () {
        edu.util.toggle_overide("zone-bus", "zoneEditTinNhan");
    },
    toggle_edit_TinDaGui: function () {
        edu.util.toggle_overide("zone-bus", "zoneTinDaGui");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
         
    },
    CapNhatTinNhan: function () {
        var me = this;
         
        //--Edit
        var obj_save = {
            'action': 'TT_ThongBao/ThemMoi_ThongBao_TinNhan',
            'versionAPI': 'v1.0',
            'type': 'POST',             
            'strTieuDe': $('#editor_TieuDe').val(),
            'strNoiDung': $('#editor_NoiDung').val(),
            'strNGUOITAOID': edu.system.userId
        };
        if (me.strTinNhanId != '') {
            obj_save.action = 'TT_ThongBao/Sua_ThongBao_TinNhan';
            obj_save.strId = me.strTinNhanId;
         }
        

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strTinNhanId = data.ID;                    
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                me.getList_TinNhan();
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    getList_TinNhan: function () {
        var me = this;
        var obj_list = {
            'action': 'TT_ThongBao/LayDS_ThongBaoTinNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TinNhan'),             
            'strNguoiTaoId': edu.system.userId,
            'iPageNumber': edu.system.pageIndex_default,
            'iItemPerPage': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtTinNhan = data.Data;                      
                    me.genTable_TinNhan(me.dtTinNhan, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_TinNhan: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblTinNhan";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.guithongbaoappsinhvien.getList_TinNhan()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            colPos: {
                center: [0, 1, 3, 4, 5,6,7],
                 
            },
            "aoColumns": [
                {
                    "mDataProp": "TIEUDE"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "NGUOITAO"
                },
                {
                    "mDataProp": "NGAYTAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTietTinDotGuiTinNhan" id="' + aData.ID + '" title="Thời gian gửi"><i class="fa fa-eye color-active"></i>Thời gian gửi</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<div class="radio">'
                            + '<input type="radio" id="' + aData.ID + '" class="optradioTinNhan" name="optradioTinNhan" />'
                            + '</div>';
                        return strReturn;
                    } 

                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);

    },
    THEMOI_THONGBAO_TINNHAN_DOTGUI: function (strTinNhanId, strTieuDe, strNoiDung) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'TT_ThongBao/THEMOI_THONGBAO_TINNHAN_DOTGUI',
            'versionAPI': 'v1.0',
            'type': 'POST',            
            'strTHONGBAO_TINNHAN_ID': strTinNhanId,
            'strNGUOITAOID': edu.system.userId, 
            'strTIEUDE': strTieuDe,
            'strNOIDUNG': strNoiDung, 
        }; 

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {                    
                    //edu.system.alert("Thực hiện thành công");
                    
                    var arrChecked_Id = me.getAllCheckBoxByClassName("chkGuiTinNhanSinhVien");                    
                    me.strErr = "";
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        strQLSV_NGUOIHOC_ID = arrChecked_Id[i];
                        me.TM_THONGBAO_TINNHAN_NGUOIHOC(strTinNhanId, data.Data, strQLSV_NGUOIHOC_ID, strTieuDe, strNoiDung);
                    }
                    if (me.strErr == '') {
                        edu.system.alert("Thực hiện gửi thành công");
                    }
                    else
                        edu.system.alert(me.strErr);
                    
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    getAllCheckBoxByClassName: function (strClassName) {
        var x = document.getElementsByClassName(strClassName);
        var arrChecked = [];
        for (var i = 0; i < x.length; i++) { 
                arrChecked.push(x[i].id); 
        }
        return arrChecked;
    },
    TM_THONGBAO_TINNHAN_NGUOIHOC: function (strTinNhanId, strTHONGBAO_TINNHAN_DOTGUI_ID, strQLSV_NGUOIHOC_ID, strTieuDe, strNoiDung) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'TT_ThongBao/TM_THONGBAO_TINNHAN_NGUOIHOC',
            'versionAPI': 'v1.0',
            'type': 'POST',
            'strTHONGBAO_TINNHAN_ID': strTinNhanId,
            'strTHONGBAO_TINNHAN_DOTGUI_ID': strTHONGBAO_TINNHAN_DOTGUI_ID,
            'strQLSV_NGUOIHOC_ID': strQLSV_NGUOIHOC_ID,            
            'strTIEUDE': strTieuDe,
            'strNOIDUNG': strNoiDung,              
            'strNGUOITAOID': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                    me.strErr += data.Message;
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
                me.strErr += er;
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
    getList_drpDotGuiTinNhan: function (strThongBao_TinNhan_Id) {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'TT_ThongBao/LayDS_TinNhan_DotGui',
            'versionAPI': 'v1.0', 
            'strThongBao_TinNhan_Id': strThongBao_TinNhan_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data.Data);
                    me.gen_drpDotGuiTinNhan(data.Data);
                   

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpDotGuiTinNhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NGAYTAO",
                code: "NGAYTAO",
                order: "unorder"
            },
            renderPlace: ["drpDotGuiTinNhan"],
            title: "Chọn thời gian gửi tin nhắn"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_TinNhanDaGui: function () {
        var me = this;
        var obj_list = {
            'action': 'TT_ThongBao/LayDS_TinNhanNguoiHoc_DotGui',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TinNhan_NguoiHoc'),
            'strTinNhan_DotGui_Id': edu.util.getValById('drpDotGuiTinNhan'),
            'strNguoiTaoId': edu.system.userId,
            'iPageNumber': edu.system.pageIndex_default,
            'iItemPerPage': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_TinNhanDaGui(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_TinNhanDaGui: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblTinNhanDaGui";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.guithongbaoappsinhvien.getList_TinNhanDaGui()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            colPos: {
                center: [0, 1, 3, 4, 5],

            },
            "aoColumns": [
                {

                    "mRender": function (nRow, aData) {
                        var strReturn = '<span>' + aData.QLSV_NGUOIHOC_MASO + '</span>';                        
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
                , {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                } 
                , {
                    "mDataProp": "TRANGTHAIGUI"
                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);

    },
    GuiTinNhanNhungTruongHopChuaNhan: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'TT_ThongBao/GuiTinNhanNhungTruongHopChuaNhan',
            'versionAPI': 'v1.0',
            'type': 'GET',
            'strTinNhan_DotGui_Id': edu.util.getValById('drpDotGuiTinNhan'),
            'strNGUOITAOID': edu.system.userId, 
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                     edu.system.alert("Thực hiện thành công"); 
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    report: function (strLoaiBaoCao) {
        var me = this;
         
        if (strLoaiBaoCao == "MAUTEMPLATEIMPORT") {
            var strUrl = "Apistintuc/Modules/Template/DanhSachSVCanGuiTinNhan.xlsx";
            
            window.open(strUrl);
            return;
        }


        var arrTuKhoa = [];
        var arrDuLieu = [];
        addKeyValue("MAUTEMPLATEIMPORT.strMau_LoaiCauHoiId", strMau_LoaiCauHoiId);
        addKeyValue("QUANLYNHCH.GroupquestiondetailId", me.strGroupQuestionDetailId);
        addKeyValue("QUANLYNHCH.strStatus", edu.util.getValById('drpStatus'));

        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);

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
                    edu.system.alert("Thông báo", "Có lỗi xảy ra vui lòng thử lại!");
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
    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },
    import_DMIP: function (a, strPath) {
        var me = this;
        var obj_list = {
            'action': 'TT_ThongBao/Import_GuiTinNhanToiSinhVien',
            'versionAPI': 'v1.0',            
            'NguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    $("#notify_import").html("Đã import dữ liệu: " + data.Message);
                    me.genTable_SinhVien(dt, 1);
                    //edu.system.viewFiles("txtFile_DMIP", "");

                    //me.toggle_import();
                    ////  console.log(dtThanhCong);
                    //if (dtErr.length > 0) {

                    //    me.genTable_Import_View(dtErr, "tblImport_ThatBai");
                    //    me.genTable_Import_View(dtThanhCong, "tblImport_ThanhCong");
                    //}
                    //else
                    //    me.genTable_Import_View(dtThanhCong, "tblImport_ThanhCong");


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
                edu.system.alert("QLTTN_QuanLyThi/ImportNganHangCauHoi_Temp(er): " + JSON.stringify(er), "w");
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
     

}