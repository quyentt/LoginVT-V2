/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function DanhSachPhep() { };
DanhSachPhep.prototype = {
    strNhanSu_Id: '',
    dtNhanSu: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });

        
        $("#dropSearch_DonViThanhVien_DanhSachPhep").on("select2:select", function () {
            me.getList_HS();
            me.getList_DanhSachPhep();
        });
        $("#dropSearch_ThanhVien_DanhSachPhep,#dropSearch_NamApDung_DanhSachPhep").on("select2:select", function () {
            me.getList_DanhSachPhep();
        });
        $("#txtSearch_DanhSachPhep_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
                me.getList_DanhSachPhep();
            }
        });
        $(".btnSearch").click(function () {
            me.getList_DanhSachPhep();
        });
        
        $("[id$=chkSelectAll_DanhSachPhep]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDanhSachPhep" });
        });
        $("#btnKeThua").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhSachPhep", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#myModal").modal("show");
        });
        $("#btnSave_KeThua").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhSachPhep", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#myModal").modal("hide");
            var strNamKeThua = edu.util.getValById('dropNamKeThua');
            edu.system.confirm('Bạn có chắc chắn muốn kế thừa không?');
            $("#btnYes").click(function (e) {
                edu.system.alert("<div id='progess_Alert'></div>");
                edu.system.genHTML_Progress("progess_Alert", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var strDoiTuong_Id = arrChecked_Id[i];
                    if (edu.util.checkValue(strDoiTuong_Id)) {
                        me.save_KeThua(strDoiTuong_Id, strNamKeThua);
                    }
                    
                }
            });
            
        });
       
    },
    page_load: function () {
        var me = this;
        me.arrValid_NO = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            //{ "MA": "txtNO_Ho", "THONGTIN1": "EM" },
            //{ "MA": "txtNO_Ten", "THONGTIN1": "EM" },
            //{ "MA": "txtNO_Email", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_CoCauToChuc", "THONGTIN1": "EM" },
            { "MA": "txtNO_MaSo", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_TinhTrangNhanSu", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_LoaiDoiTuong", "THONGTIN1": "EM" }
        ];
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_DanhSachPhep();
        me.getList_CoCauToChuc();
        me.getList_HS();
        edu.system.dateYearToCombo("1993", "dropSearch_NamApDung_DanhSachPhep,dropNamKeThua", "Chọn năm áp dụng", "");
    },
    rewrite: function () {
        var me = this;
        edu.util.viewValById("dropLoaiKhoan", "");
        edu.util.viewValById("txtSoTien", "");
        edu.util.viewValById("txtChungTu", "");
        edu.util.viewValById("txtNgay", "");
        edu.util.viewValById("txtThang", "");
        edu.util.viewValById("txtNam", "");
        edu.util.viewValById("txtNoiDung", "");
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    getList_DanhSachPhep: function () {
        var me = main_doc.DanhSachPhep;
        //--Edit
        var obj_list = {
            'action': 'NS_NghiPhepCaNhan/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_DanhSachPhep_TuKhoa'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien_DanhSachPhep'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien_DanhSachPhep'),
            'strNamApDung': edu.util.getValById('dropSearch_NamApDung_DanhSachPhep'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.dtNhanSu = data.Data;
                    me.genTable_DanhSachPhep(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KeThua: function (strNhanSu_Id, strNamKeThua) {
        var me = this;
        var obj = edu.util.objGetOneDataInData(strNhanSu_Id, me.dtNhanSu, "ID");
        var obj_save = {
            'action': 'NS_NghiPhepCaNhan/KeThua',
            

            'strDaoTao_CoCauToChuc_Id': obj.DAOTAO_COCAUTOCHUC_ID,
            'strNhanSu_HoSoNhanSu_Id': obj.NHANSU_HOSOCANBO_ID,
            'strNamKeThua': strNamKeThua,
            'strNamApDung': obj.NAMAPDUNG,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            complete: function () {
                edu.system.start_Progress("progess_Alert", function () {
                    main_doc.DanhSachPhep.getList_DanhSachPhep();
                });
            },
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    genTable_DanhSachPhep: function (data, iPager) {
        $("#lblHSLL_DanhSachPhep_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhSachPhep",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DanhSachPhep.getList_DanhSachPhep()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 2, 3,5,6, 7, 8, 9, 10],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "NAMAPDUNG"
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mData": "NGUOICUOI_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return aData.NHANSU_HOSOCANBO_HODEM + " " + aData.NHANSU_HOSOCANBO_TEN;
                    }
                },
                {
                    "mDataProp": "NGAYSINHDAYDU"
                },
                {
                    "mDataProp": "SONGAYDUOCNGHI"
                },
                {
                    "mDataProp": "SONGAYNGHITHAMNIEN"
                },
                {
                    "mDataProp": "SONGAYPHEPDASUDUNG"
                },
                {
                    "mDataProp": "SONGAYNGHICONLAI"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonViThanhVien_DanhSachPhep"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_DanhSachPhep"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVien_DanhSachPhep"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
}