/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function VanBangSangChe() { }
VanBangSangChe.prototype = {
    dtVanBangSC: [],
    strVanBangSC_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],
    arrValid_VBSC: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_form();
            edu.extend.getDetail_HS(me.genHTML_NhanSu);
        });
        $(".btnReWrite").click(function () {
            me.rewrite();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_VBSC();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_VBSC();
            }
        });
        $("#btnSearchTCQT_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_VBSC").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_VBSC);
        
            if (valid) {
                if (edu.util.checkValue(me.strVanBangSC_Id)) {
                    me.update_VBSC();
                }
                else {
                    me.save_VBSC();
                }
            }
        });
        $("#tblVBSC").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblVBSC");
                me.toggle_form();
                me.strVanBangSC_Id = strId;
                me.getList_VBSC_ThanhVien();
                me.getDetail_VBSC(strId, constant.setting.ACTION.EDIT);
                edu.system.viewFiles("txtVBSC_FileDinhKem", strId, "NCKH_Files");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblVBSC").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblVBSC");
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_VBSC(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_DonViThanhVien_VBSC").on("select2:select", function () {
            me.getList_HS();
        });
        $(".btnSearch_VBSC_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_VBSC_ThanhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_VBSC_ThanhVien(strNhanSu_Id);
                });
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtVBSC_FileDinhKem"]);
        me.toggle_notify();
        me.getList_VBSC();
        me.getList_HS();
        me.getList_DeTai();
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_VBSC = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtVBSC_TenVanBang", "THONGTIN1": "EM" },
            { "MA": "txtVBSC_NamCapVanBang", "THONGTIN1": "EM" },
            { "MA": "txtVBSC_Ma", "THONGTIN1": "EM" }
        ];
        me.getList_NamDanhGia();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_vbsc");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_vbsc");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_vbsc");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strVanBangSC_Id = "";
        var arrId = ["txtVBSC_TenVanBang", "txtVBSC_Ma", "txtVBSC_NamCapVanBang", "txtVBSC_NoiDungVanBang", "txtVBSC_NoiDungMinhChung", "txtVBSC_FileDinhKem", "tblInput_VBSC_ThanhVien", "dropVBSC_DeTai"];
        edu.system.viewFiles("txtVBSC_FileDinhKem", "");
        edu.util.resetValByArrId(arrId);
        $("#tblInput_VBSC_ThanhVien tbody").html("");
    },

    getList_Impoet: function (a, strPath) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'Sys_Import/Import',            

            'strPath': strPath,
            'strMa': "CHUN.IMDM",
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(data.Message, "s");
                }
                else {
                    edu.system.alert(data.Message, "s");
                }                
            },
            error: function (er) {                
                edu.system.alert("CMS_SVQT/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_VBSC: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_VanBangSangChe/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropSearch_DeTai_VBSC"),
            'strNCKH_DETAI_THANHVIEN_Id': edu.util.getValById("dropSearch_ThanhVien_VBSC"),
            'strCanboNhap_Id': "",
            'strVaitro_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtVanBangSC = dtResult;
                    }
                    me.genTable_VBSC(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_VanBangSangChe/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_VanBangSangChe/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_VBSC: function () {
        var me = this;

        var obj_save = {
            'action': 'NCKH_VanBangSangChe/ThemMoi',            

            'strId': "",
            'strThongTinMinhChung': edu.util.getValById("txtVBSC_NoiDungMinhChung"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropVBSC_DeTai"),
            'strNCKH_DETAI_THANHVIEN_Id': edu.system.userId,
            'strVaiTro_Id': "",
            'strTenVanBang': edu.util.getValById("txtVBSC_TenVanBang"),
            'strNoiDungVanBang': edu.util.getValById("txtVBSC_NoiDungVanBang"),
            'strNamCapVanBang': edu.util.getValById("txtVBSC_NamCapVanBang"),
            'strThangCapVanBang': edu.util.getValById("txtVBSC_ThangCapVanBang"),
            'strCANBONHAP_Id': edu.system.userId,
            'strMaSanPham': edu.util.getValById("txtVBSC_Ma"),
            'iTrangThai': 1,
            'iThuTu': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        var strVanBangSC_Id = data.Id;
                        $("#tblInput_VBSC_ThanhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_VBSC_ThanhVien(strNhanSu_Id, strVanBangSC_Id);
                        });
                        if (me.bcheckTimKiem) {
                            var x = $("#zoneFileDinhKemtxtVBSC_FileDinhKem .btnDelUploadedFile");
                            for (var i = 0; i < x.length; i++) {
                                x[i].classList.remove("btnDelUploadedFile");
                                x[i].name = "";
                                x[i].classList.add("btnDeleteFileUptxtTTS_FileDinhKem");
                            }
                        }
                        edu.system.saveFiles("txtVBSC_FileDinhKem", strVanBangSC_Id, "NCKH_Files");
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });                        
                    }
                    setTimeout(function () {
                        me.getList_VBSC();
                        edu.extend.getDetail_HS(me.genHTML_NhanSu);
                    }, 50);
                }
                else {
                    edu.system.alert("NCKH_VanBangSangChe/ThemMoi: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_VanBangSangChe/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_VBSC: function () {
        var me = this;

        var obj_save = {
            'action': 'NCKH_VanBangSangChe/CapNhat',            

            'strId': me.strVanBangSC_Id,
            'strThongTinMinhChung': edu.util.getValById("txtVBSC_NoiDungMinhChung"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropVBSC_DeTai"),
            'strNCKH_DETAI_THANHVIEN_Id': "",
            'strVaiTro_Id': "",
            'strTenVanBang': edu.util.getValById("txtVBSC_TenVanBang"),
            'strNoiDungVanBang': edu.util.getValById("txtVBSC_NoiDungVanBang"),
            'strNamCapVanBang': edu.util.getValById("txtVBSC_NamCapVanBang"),
            'strThangCapVanBang': edu.util.getValById("txtVBSC_ThangCapVanBang"),
            'strCANBONHAP_Id': edu.system.userId,
            'strMaSanPham': edu.util.getValById("txtVBSC_Ma"),
            'iTrangThai': 1,
            'iThuTu': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strVanBangSC_Id = me.strVanBangSC_Id;
                    edu.system.alert("Cập nhật thành công!");
                    $("#tblInput_VBSC_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_VBSC_ThanhVien(strNhanSu_Id, strVanBangSC_Id);
                    });
                    me.getList_VBSC();
                    setTimeout(function () {
                        edu.system.saveFiles("txtVBSC_FileDinhKem", strVanBangSC_Id, "NCKH_Files");
                    }, 50);
                }
                else {
                    edu.system.alert("NCKH_VanBangSangChe/CapNhat: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_VanBangSangChe/CapNhat (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_VBSC: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtVanBangSC, "ID", me.viewEdit_VBSC);
    },
    delete_VBSC: function (strIds) {
        var me = this;

        var obj_delete = {
            'action': 'NCKH_VanBangSangChe/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj = {};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_VBSC();
                }
                else {
                    obj = {
                        content: "NCKH_VanBangSangChe/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_VanBangSangChe/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_DeTai_ThanhVien: function (strNhanSu_Id, strVanBangSC_Id) {
        var me = this;
        var obj_notify;

        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strVanBangSC_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': '',
            'dTyLeThamGia': "",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    obj_notify = {
                        renderPlace: "slnhansu" + strNhanSu_Id,
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
                }                
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML VanBangSanghe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_VBSC: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblVBSC_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblVBSC",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.VanBangSangChe.getList_VBSC()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENVANBANG) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_VBSC: function (data) {
        var me = this;
        var dt = data[0];
        //View - Thong tin
        edu.util.viewValById("txtVBSC_TenVanBang", dt.TENVANBANG);
        edu.util.viewValById("txtVBSC_Ma", dt.MASANPHAM);
        edu.util.viewValById("txtVBSC_NamCapVanBang", dt.NAMCAPVANBANG);
        edu.util.viewValById("txtVBSC_ThangCapVanBang", dt.THANGCAPVANBANG);
        edu.util.viewValById("txtVBSC_NoiDungVanBang", dt.NOIDUNGVANBANG);
        //View - Noi dung minh chung
        edu.util.viewValById("txtVBSC_NoiDungMinhChung", dt.THONGTINMINHCHUNG);
        edu.util.viewValById("dropVBSC_DeTai", dt.NCKH_QUANLYDETAI_ID);
    },

    save_VBSC_ThanhVien: function (strNhanSu_Id, strVanBangSC_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var dTyLe = $("#tyle_" + strNhanSu_Id).val();
        var obj_notify;

        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strVanBangSC_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': "",
            'dTyLeThamGia': "",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    obj_notify = {
                        renderPlace: "slnhansu" + strNhanSu_Id,
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
                }                
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_VBSC_ThanhVien: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',            

            'strSanPham_Id': me.strVanBangSC_Id,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_VBSC_ThanhVien(dtResult);
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
    delete_VBSC_ThanhVien: function (strNhanSu_Id) {
        var me = this;

        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strVanBangSC_Id,
            'strThanhVien_Id': strNhanSu_Id
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DeTai_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_VBSC_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_VBSC_ThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span> - <span>" + data[i].MACANBO + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_VBSC_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        console.log(1111111);
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_VBSC_ThanhVien tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_TTS_ThanhVien tbody").html("");
            $("#tblInput_TTS_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = thish;
        me.dtVaiTro = data;
    },
    genCombo_VaiTro: function (place) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: [place],
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);

    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DeTai: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_DeTai/LayDanhSach',            

            'iTinhTrang': -1,
            'iTrangThai': -1,
            'strCanBoNhapDeTai_Id': "",
            'strThanhVien_Id': '',
            'strTuKhoaText': "",
            'dTuKhoaNumber': -1,
            'strNCKH_DeCuong_Id': "",
            'strCapQuanLy_Id': "",
            'strLinhVucNghienCuu_Id': "",
            'strNguonKinhPhi_Id': "",
            'strThietKeNghienCuu_Id': "",
            'strNCKH_ThanhVien_Id': "",
            'strDonVi_Id_CuaThanhVien_Id': "",
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strTinhTrang_Id': "",
            'strPhanLoaiDeTai_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_DeTai(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DeTai/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_DeTai/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_DeTai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDETAITIENGVIET",
                code: "MADETAI",
                order: "unorder"
            },
            renderPlace: ["dropVBSC_DeTai", "dropSearch_DeTai_VBSC"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.VanBangSangChe;
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
            renderPlace: ["dropSearchModal_TTS_DonVi", "dropSearch_DonViThanhVien_VBSC"],
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
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',            

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_VBSC"),
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
            renderPlace: ["dropSearch_ThanhVien_VBSC"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_NamDanhGia: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TinhDiem_KeHoach/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_NamDanhGia(dtReRult);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }                
            },
            error: function (er) {                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_NamDanhGia: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MOTA",
                code: "MA"
            },
            renderPlace: ["dropSearch_NamDanhGia_DT"],
            type: "",
            title: "Tất cả kế hoạch đánh giá"
        };
        edu.system.loadToCombo_data(obj);
    },
};