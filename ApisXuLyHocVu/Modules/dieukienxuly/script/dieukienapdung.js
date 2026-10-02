/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DieuKienApDung() { };
DieuKienApDung.prototype = {
    dtDieuKienApDung: [],
    strDieuKienApDung_Id: '',
    dtDKXLDiemApDung: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_DieuKienApDung();
        me.getList_TuKhoa();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ThoiGianDaoTao();
        me.getList_DKXL();

        edu.system.loadToCombo_DanhMucDuLieu("XLHV.LOAIXULY", "dropSearch_LoaiXuLy,dropDieuKienApDung_LoaiXuLy");
        edu.system.loadToCombo_DanhMucDuLieu("XLHV.MUCXULY", "dropDieuKienApDung_MucXuLy");

        $("#btnSearch").click(function (e) {
            me.getList_DieuKienApDung();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DieuKienApDung();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_DieuKienApDung").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_DieuKienApDung();
            }
        });
        $("[id$=chkSelectAll_DieuKienApDung]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDieuKienApDung" });
        });
        $("#btnXoaDieuKienApDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDieuKienApDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DieuKienApDung(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_DieuKienApDung();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#tblDieuKienApDung").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblDieuKienApDung");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtDieuKienApDung, "ID")[0];
                me.viewEdit_DieuKienApDung(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#dropDanhMucXuLy").on("select2:select", function () {
            var strId = this.value;
            if (edu.util.checkValue(strId)) {
                me.viewEdit_DieuKienApDung_Edit(edu.util.objGetDataInData(strId, me.dtDKXLDiemApDung, "ID")[0]);
            }
        });
        $("#dropSearch_HeDaoTao,#dropHeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao(this.value);
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/

        $("#btnKeThua").click(function () {
            if (!edu.util.checkValue(edu.util.getValById('dropSearch_KhoaDaoTao'))) {
                edu.system.alert("Bạn cần chọn khóa");
                return;
            }
            if (!edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc")) && !edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao"))) {
                edu.system.alert("Bạn cần chọn năm học hoặc thời gian đào tạo");
                return;
            }
            var html = "";
            if (edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc"))) {
                html = "năm học" + $("#dropSearch_NamHoc option:selected").text();
            }
            else {
                html = "học kỳ" + $("#dropSearch_ThoiGianDaoTao option:selected").text();
            }
            edu.system.confirm("Bạn có muốn kế thừa từ khóa: " + $("#dropSearch_KhoaDaoTao option:selected").text() + " và " + html);
            $("#btnYes").click(function (e) {
                me.keThua_DKXL();
            });
        });
        $("#btnXoaToanBo").click(function () {
            if (!edu.util.checkValue(edu.util.getValById('dropSearch_KhoaDaoTao'))) {
                edu.system.alert("Bạn cần chọn khóa");
                return;
            }
            if (!edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc")) && !edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao"))) {
                edu.system.alert("Bạn cần chọn năm học hoặc thời gian đào tạo");
                return;
            }
            var html = "";
            if (edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc"))) {
                html = "năm học" + $("#dropSearch_NamHoc option:selected").text();
            }
            else {
                html = "học kỳ" + $("#dropSearch_ThoiGianDaoTao option:selected").text();
            }
            edu.system.confirm("Bạn có muốn xóa toàn bộ tiêu chí của khóa: " + $("#dropSearch_KhoaDaoTao option:selected").text() + " và " + html);
            $("#btnYes").click(function (e) {
                me.delete_DKXL_ToanBo();
            });
        });
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtDieuKienApDung_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        edu.system.hiddenElement('{"readonlyselect2": "#dropDieuKienApDung_LoaiXuLy,#dropDieuKienApDung_MucXuLy"}');
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDieuKienApDung_Id = "";
        edu.util.viewValById("dropHeDaoTao", edu.util.getValById('dropSearch_HeDaoTao'));
        edu.util.viewValById("dropKhoaDaoTao", edu.util.getValById('dropSearch_KhoaDaoTao'));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById('dropSearch_ThoiGianDaoTao'));
        edu.util.viewValById("dropDieuKienApDung_LoaiXuLy", "");
        edu.util.viewValById("dropDieuKienApDung_MucXuLy", "");
        edu.util.viewValById("txtDieuKienApDung_ThuTu", "");
        edu.util.viewValById("txtDieuKienApDung_MoTa", "");
        edu.util.viewValById("txtDieuKienApDung_XauDieuKien", "");
        edu.util.viewValById("dropDanhMucXuLy", "");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_DieuKienApDung();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DieuKienApDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_DieuKienXuLy_AD/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strLoaiXuLy_Id': edu.util.getValById('dropSearch_LoaiXuLy'),
            'strMucXuLy_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDieuKienApDung = dtReRult;
                    me.genTable_DieuKienApDung(dtReRult, data.Pager);
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
    save_DieuKienApDung: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_DieuKienXuLy_AD/ThemMoi',
            
            'strId': me.strDieuKienApDung_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.util.getValById('txtDieuKienApDung_XauDieuKien'),
            'strMucXuLy_Id': edu.util.getValById('dropDieuKienApDung_MucXuLy'),
            'strLoaiXuLy_Id': edu.util.getValById('dropDieuKienApDung_LoaiXuLy'),
            'strMoTa': edu.util.getValById('txtDieuKienApDung_MoTa'),
            'dThuTu': edu.util.getValById('txtDieuKienApDung_ThuTu'),
            'strNguoiThucHien_Id': edu.system.userId,

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strPhamViApDung_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strXLHV_DieuKienXuLy_Id': edu.util.getValById('dropDanhMucXuLy'),
        };
        if (obj_save.strId != "") {
            obj_save.action = 'XLHV_DieuKienXuLy_AD/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDieuKienApDung_Id = "";
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strDieuKienApDung_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDieuKienApDung_Id = obj_save.strId
                    }
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        console.log($(this).attr("name"));
                        if ($(this).attr("name") == "new"){
                            me.save_SinhVien(strNhanSu_Id, strDieuKienApDung_Id);
                        }
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_DieuKienApDung();
            },
            error: function (er) {
                edu.system.alert("XLHV_DieuKienXuLy_AD/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKienApDung: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'XLHV_DieuKienXuLy_AD/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DieuKienApDung();
                }
                else {
                    obj = {
                        content: "XLHV_DieuKienXuLy_AD/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "XLHV_DieuKienXuLy_AD/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    keThua_DKXL: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_DieuKienXuLy_AD/KeThua',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanCapApDung_Id': edu.util.getValById('dropAzzzz'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công");
                    me.getList_DKXL();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DKXL_ToanBo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'XLHV_DieuKienXuLy_AD/Xoa_XLHV_DieuKienXuLy_AD_Tat',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXuLy_Id': edu.util.getValById('dropSearch_LoaiXuLy'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DKXL();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_DieuKienApDung: function (data, iPager) {
        var me = this;
        $("#lblDieuKienApDung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDieuKienApDung",

            bPaginate: {
                strFuntionName: "main_doc.DieuKienApDung.getList_DieuKienApDung()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "MUCXULY_TEN"
                },
                {
                    "mDataProp": "MOTA",
                },
                {
                    "mDataProp": "XAUDIEUKIEN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN",
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_KY"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_DieuKienApDung: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropDanhMucXuLy", data.XLHV_DIEUKIENXULY_ID);
        edu.util.viewValById("dropKhoaDaoTao", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropDieuKienApDung_LoaiXuLy", data.LOAIXULY_ID);
        edu.util.viewValById("dropDieuKienApDung_MucXuLy", data.MUCXULY_ID);
        edu.util.viewValById("txtDieuKienApDung_ThuTu", data.THUTU);
        edu.util.viewValById("txtDieuKienApDung_MoTa", data.MOTA);
        edu.util.viewValById("txtDieuKienApDung_XauDieuKien", data.XAUDIEUKIEN);
        me.strDieuKienApDung_Id = data.ID;
    },
    viewEdit_DieuKienApDung_Edit: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropDieuKienApDung_LoaiXuLy", data.LOAIXULY_ID);
        edu.util.viewValById("dropDieuKienApDung_MucXuLy", data.MUCXULY_ID);
        edu.util.viewValById("txtDieuKienApDung_ThuTu", data.THUTU);
        edu.util.viewValById("txtDieuKienApDung_MoTa", data.MOTA);
        edu.util.viewValById("txtDieuKienApDung_XauDieuKien", data.XAUDIEUKIEN);
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_TuKhoa: function () {
        var me = main_doc.DieuKienApDung;

        //--Edit
        var obj_list = {
            'action': 'XLHV_ThongTinChung/LayDSTuKhoa',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_TuKhoa(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TuKhoa: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTuKhoa",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TUKHOA"
                },
                {
                    "mDataProp": "MOTA",
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_DKXL: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_DieuKienXuLy/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXuLy_Id': edu.util.getValById('dropAAAA'),
            'strMucXuLy_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDKXLDiemApDung = dtReRult;
                    me.genCombo_LoaiTieuChi(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genCombo_LoaiTieuChi: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MUCXULY_TEN",
            },
            renderPlace: ["dropDanhMucXuLy"],
            title: "Chọn danh mục điều kiện xử lý"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);

    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValById("dropKhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strNganh_Id: edu.util.getValById("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            'strNguoiThucHien_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadToCombo_NamNhapHoc(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
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
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao", "dropHeDaoTao_Nam"],
            type: "",
            title: "Chọn hệ đào tạo",
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao", "dropKhoaDaoTao", "dropKhoaDaoTao_Nam"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenBo_TrangThai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropTinhTrangSinhVien"]
        }
        edu.system.loadToCombo_data(obj);
        //$('#dropTinhTrangSinhVien option').prop('selected', true);
    },
    loadToCombo_PhamVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropPhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMNHAPHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropSearch_NamHoc", "dropNamHoc", "dropNamHoc_Nam"],
            type: "",
            title: "Chọn năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
}