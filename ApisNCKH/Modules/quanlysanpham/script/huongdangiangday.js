/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function HuongDanGiangDay() { }
HuongDanGiangDay.prototype = {
    dtDeTai: [],
    dtVaiTro: [],
    strHDGD_Id: "",
    arrGiangVien_HD_Id: [],
    arrGiangVien_GD_Id: [],
    arrSinhVien_Id: [],
    strPhanLoai_MA: "",

    init: function () {
        var me = main_doc.HuongDanGiangDay;
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
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnSearchHDGD_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_HDGD();
            }
        });
        $("#btnSearch_HHD").click(function () {
            me.getList_HDGD();
        });
        /*------------------------------------------
        --Discription: [1] Action DeTai
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HDGD").click(function () {
            me.getList_HDGD();
        });
        $("#btnSave_HDGD").click(function () {
            if (edu.util.checkValue(me.strHDGD_Id)) {
                me.update_HDGD();
            }
            else {
                me.save_HDGD();
            }
        });
        $("#tblHDGD").delegate(".btnView", "click", function () {
            var strId = this.id;
            me.toggle_HDGD();
            me.rewrite();
            me.toggle_detail();
            me.strHDGD_Id = strId;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            me.getDetail_HDGD(strId, constant.setting.ACTION.VIEW);
            edu.util.setOne_BgRow(strId, "tblHDGD");
        });
        $("#tblHDGD").delegate(".btnEdit", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            edu.util.setOne_BgRow(strId, "tblHDGD");
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.rewrite();
                me.strHDGD_Id = strId;
                me.getDetail_HDGD(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHDGD").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HDGD(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action GiangVien Huong Dan
        --Order: 
        -------------------------------------------*/
        $('#dropPhanLoai').on('select2:select', function (e) {
            me.switchLoaiVTGV();
        });
        $(".btnSearchHDGD_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            console.log(me.strHDGD_Id);
            switch (me.strPhanLoai_MA) {
                case "HD": me.addHTMLinto_tblGiangVien_HD(strNhanSu_Id); break;
                case "GD": me.addHTMLinto_tblGiangVien_GD(strNhanSu_Id); break;
                case undefined:
                    me.addHTMLinto_tblGiangVien_HD(strNhanSu_Id);
                    me.addHTMLinto_tblGiangVien_GD(strNhanSu_Id);
                    break;
                default: edu.system.alert("Loại vai trò giảng viên không chính xác!", "w");
            }
        });
        $("#tblInput_HDGD_GiangVien_HD").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeHTMLoff_tblGiangVien_HD(strNhanSu_Id);
        });
        $("#tblInput_HDGD_GiangVien_HD").delegate('.btnDelete', 'click', function () {
            var strNhanSu_Id = this.id;
            //var strNhanSu_Id = edu.util.cutPrefixId(/delete_tcqt_SinhVien/g, id);
            if (edu.util.checkValue(strNhanSu_Id)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GiangVien_HD(strNhanSu_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action GiangVien Huong Dan
        --Order: 
        -------------------------------------------*/
        $("#tblInput_HDGD_GiangVien_GD").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeHTMLoff_tblGiangVien_GD(strNhanSu_Id);
        });
        $("#tblInput_HDGD_GiangVien_GD").delegate('.btnDelete', 'click', function () {
            var strNhanSu_Id = this.id;
            //var strNhanSu_Id = edu.util.cutPrefixId(/delete_tcqt_SinhVien/g, id);
            if (edu.util.checkValue(strNhanSu_Id)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GiangVien_GD(strNhanSu_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchHDGD_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_tblSinhVien(strNhanSu_Id);
        });
        $("#tblInput_HDGD_SinhVien").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeHTMLoff_tblSinhVien(strNhanSu_Id);
        });
        $("#tblInput_HDGD_SinhVien").delegate('.btnDelete', 'click', function () {
            var strNhanSu_Id = this.id;
            //var strNhanSu_Id = edu.util.cutPrefixId(/delete_tcqt_SinhVien/g, id);
            if (edu.util.checkValue(strNhanSu_Id)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.HuongDanGiangDay;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_HDGD();
            setTimeout(function () {
                var obj = {
                    strMaBangDanhMuc: "NCKH.VTHDGD",
                    strTenCotSapXep: "",
                    iTrangThai: 1
                };
                edu.system.getList_DanhMucDulieu(obj, "", "", me.genCombo_PhanLoai);
                setTimeout(function () {
                    var obj = {
                        strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTQT,
                        strTenCotSapXep: "",
                        iTrangThai: 1
                    };
                    edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
                }, 50);
            }, 50);
        }, 50);
    },

    toggle_HDGD: function () {
        edu.util.toggle_overide("zone-bus", "zone_HDGD");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_HDGD");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_HDGD");
        $("#txtHDGD_Ten").focus();
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HDGD");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.HuongDanGiangDay;
        //
        me.strHDGD_Id = "";
        me.arrSinhVien_Id = [];
        me.arrGiangVien_GD_Id = [];
        me.arrGiangVien_HD_Id = [];
        var arrId = ["txtHDGD_TenDetai", "txtHDGD_NamThucHien", "txtHDGD_DiemNghiemThu", "dropXepLoai", "txtHDGD_MoTa"];
        edu.util.resetValByArrId(arrId);
        //table
    },
    switchLoaiVTGV: function () {
        var me = this;
        var strMa = $("#dropPhanLoai option:selected").attr("id");
        me.strPhanLoai_MA = strMa;
        $(".zoneGV").slideUp();
        $("#zone" + strMa).slideDown();
        $("#zoneView" + strMa).slideDown();
        switch (strMa) {
            case "HD": me.getList_GiangVien_HD(); break;
            case "GD": me.getList_GiangVien_GD(); break;
            case undefined:
                $(".zoneGV").slideDown();
                me.getList_GiangVien_HD();
                setTimeout(function () {
                    me.getList_GiangVien_GD();
                }, 50);
                break; //show all
            default: edu.system.alert("Loại vai trò giảng viên không chính xác!", "w");
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_HDGD
    -------------------------------------------*/
    save_HDGD: function () {
        var me = main_doc.HuongDanGiangDay;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_HuongDan_GiangDay/ThemMoi',
            

            'strId': "",
            'strTenDeTai_GiangDay': edu.util.getValById("txtHDGD_TenDetai"),
            'strNamNghiemThu': edu.util.getValById("txtHDGD_NamNghiemThu"),
            'strPhanLoai_Id': edu.util.getValById("dropPhanLoai"),
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    if (edu.util.checkValue(data.Id)) {

                        me.strHDGD_Id = data.Id;
                        me.getList_HDGD();
                        setTimeout(function () {
                            me.save_GiangVien_HD();
                            setTimeout(function () {
                                me.save_SinhVien();
                                setTimeout(function () {
                                    me.save_GiangVien_GD();
                                }, 50);
                            }, 50);
                        }, 50);
                    }
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + "(er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_HDGD: function () {
        var me = main_doc.HuongDanGiangDay;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_HuongDan_GiangDay/CapNhat',
            

            'strId': me.strHDGD_Id,
            'strTenDeTai_GiangDay': edu.util.getValById("txtHDGD_TenDetai"),
            'strNamNghiemThu': edu.util.getValById("txtHDGD_NamNghiemThu"),
            'strPhanLoai_Id': edu.util.getValById("dropPhanLoai"),
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_HDGD();
                    setTimeout(function () {
                        me.save_GiangVien_HD();
                        setTimeout(function () {
                            me.save_SinhVien();
                            setTimeout(function () {
                                me.save_GiangVien_GD();
                            }, 50);
                        }, 50);
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + "(er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HDGD: function () {
        var me = main_doc.HuongDanGiangDay;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HuongDan_GiangDay/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strThanhVien_Id': "",
            'strPhanLoai_Id': edu.util.getValById("dropSearch_VaiTro_HDGD"),
            'strNguoiThucHien_Id': edu.system.userId,
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
                        me.dtDeTai = dtResult;
                    }
                    me.genTable_HDGD(dtResult, iPager);
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
    getDetail_HDGD: function (strId, strAction) {
        var me = main_doc.HuongDanGiangDay;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtDeTai, "ID", me.viewEdit_HDGD);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtDeTai, "ID", me.viewDetail_HDGD);
                break;
        }
    },
    delete_HDGD: function (strId) {
        var me = main_doc.HuongDanGiangDay;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HuongDan_GiangDay/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HDGD();
                }
                else {
                    obj = {
                        content: "NCKH_SP_HuongDan_GiangDay/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_SP_HuongDan_GiangDay/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] AcessDB GenHTML_HDGD
    -------------------------------------------*/
    genTable_HDGD: function (data, iPager) {
        var me = main_doc.HuongDanGiangDay;
        edu.util.viewHTMLById("lblHDGD_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblHDGD",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HuongDanGiangDay.getList_HDGD()",
                iDataRow: iPager,
                bChange: false,
                bLeft: false
            },
            colPos: {
                left: [1]
            },
            arrClassName: ["btnView"],
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENDETAI_GIANGDAY) + "</span><br />";
                        html += '<span class="pull-right">';
                        //html += '<a class="btn btn-default btn-circle btnDelete" id="' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        //html += '<a class="btn btn-default btn-circle btnEdit" id="' + aData.ID + '" href="#" title="Edit"><i class="fa fa-pencil color-active"></i></a>';
                        html += '<a class="btn btn-default btn-circle" id="' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_HDGD: function (data) {
        var me = main_doc.HuongDanGiangDay;
        var dtDeTai = data[0];
        //View - Thong tin
        edu.util.viewValById("txtHDGD_TenDetai", dtDeTai.TENDETAI_GIANGDAY);
        edu.util.viewValById("txtHDGD_NamNghiemThu", dtDeTai.NAMNGHIEMTHU);
        edu.util.viewValById("dropPhanLoai", dtDeTai.PHANLOAI_ID);
        me.strHDGD_Id = dtDeTai.ID;
        setTimeout(function () {
            me.getList_SinhVien();
            setTimeout(function () {
                me.switchLoaiVTGV();
            }, 50);
        }, 50);
    },
    viewDetail_HDGD: function (data) {
        var me = main_doc.HuongDanGiangDay;
        var dtDeTai = data[0];
        //View - Nguoi nhap
        edu.util.viewHTMLById("lblHDGD_NguoiNhap", dtDeTai.NGUOITHUCHIEN_TENDAYDU);
        edu.util.viewHTMLById("lblHDGD_Ten", dtDeTai.TENDETAI_GIANGDAY);
        edu.util.viewHTMLById("lblHDGD_NamNghiemThu", dtDeTai.NAMNGHIEMTHU);
        edu.util.viewHTMLById("lblHDGD_DiemNghiemThu", dtDeTai.DIEMNGHIEMTHU);
        edu.util.viewHTMLById("lblHDGD_PhanLoai", dtDeTai.PHANLOAI_TEN);
        edu.util.viewValById("dropPhanLoai", dtDeTai.PHANLOAI_ID);
        me.strHDGD_Id = dtDeTai.ID;
        setTimeout(function () {
            me.getList_SinhVien();
            setTimeout(function () {
                me.switchLoaiVTGV();
            }, 50);
        }, 50);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien_HD: function () {
        var me = main_doc.HuongDanGiangDay;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id
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
                    me.genTable_GiangVien_HD_Edit(dtResult, iPager);
                    me.genTable_GiangVien_HD_View(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + "(er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_GiangVien_HD: function () {
        var me = main_doc.HuongDanGiangDay;
        //if (me.arrGiangVien_HD_Id.length == 0) return;
        var arrVaiTro_Id = [];
        var arrGiangVien = [];
        for (var i = 0; i < me.arrGiangVien_HD_Id.length; i++) {
            if (document.getElementById("vaitro_" + me.arrGiangVien_HD_Id[i]) == undefined) continue;
            arrGiangVien.push(me.arrGiangVien_HD_Id[i]);
            arrVaiTro_Id.push($("#vaitro_" + me.arrGiangVien_HD_Id[i]).val());
        }
        if (arrGiangVien.length == 0) return;
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_HDGD_GiangVien_HD/ThemMoi',
            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id,
            'strGiangVien_Ids': arrGiangVien.toString().replace(/,/g, "#"),
            'strVaiTro_Ids': arrVaiTro_Id.toString().replace(/,/g, "#"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        //
        edu.system.makeRequest({
            success: function (data) {
                //if (data.Success) {
                //    edu.system.alert("Thêm mới thành công!");
                //}
                //else {
                //    edu.system.alert("NCKH_HuongDanGiangDay/ThemMoi: " + data.Message);
                //}
                //
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_GiangVien_HD: function (strIds) {
        var me = main_doc.HuongDanGiangDay;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HDGD_GiangVien_HD/Xoa_GiangVien',
            
            'strGiangVien_Ids': strIds,
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id,
            'strNguoiThucHien_Id': edu.system.userId,

        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //Xóa đi để load lại ds
                    //me.arrGiangVien_HD_Id = [];
                    me.getList_GiangVien_HD(me.strId);
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    genTable_GiangVien_HD_View: function (data, iPager) {
        var me = main_doc.HuongDanGiangDay;
        var jsonForm = {
            strTable_Id: "tblDetail_HDGD_GiangVien_HD",
            aaData: data,
            colPos: {
                center: [0, 1]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return "<img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                    }
                },
                {
                    "mDataProp": "VAITRO_TEN"
                }
            ]
        };
        var jsonView = jsonForm;
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genTable_GiangVien_HD_Edit: function (data, iPager) {
        var me = main_doc.HuongDanGiangDay;
        if (me.strHDGD_Id == "") return;
        me.arrGiangVien_HD_Id = [];
        var jsonForm = {
            strTable_Id: "tblInput_HDGD_GiangVien_HD",
            aaData: data,
            colPos: {
                center: [0, 1, 4]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return "<img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                    }
                },
                {
                    "mDataProp": "VAITRO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        main_doc.HuongDanGiangDay.arrGiangVien_HD_Id.push(aData.GIANGVIEN_ID);
                        return "<a id='" + aData.GIANGVIEN_ID + "' class='btnDelete poiter'><i class='fa fa-trash'></i></a>";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    addHTMLinto_tblGiangVien_HD: function (strNhanSu_Id) {
        var me = main_doc.HuongDanGiangDay;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrGiangVien_HD_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrGiangVien_HD_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnRemove'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_HDGD_GiangVien_HD tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    removeHTMLoff_tblGiangVien_HD: function (strNhanSu_Id) {
        var me = main_doc.HuongDanGiangDay;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrGiangVien_HD_Id, strNhanSu_Id);
        if (me.arrGiangVien_HD_Id.length === 0) {
            $("#tblInput_HDGD_GiangVien_HD tbody").html("");
            $("#tblInput_HDGD_GiangVien_HD tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien_GD: function () {
        var me = main_doc.HuongDanGiangDay;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id
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
                    me.genTable_GiangVien_GD_Edit(dtResult, iPager);
                    me.genTable_GiangVien_GD_View(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + "(er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_GiangVien_GD: function () {
        var me = main_doc.HuongDanGiangDay;
        //if (me.arrGiangVien_GD_Id.length == 0) return;
        var arrGiangVien = [];
        var arrNoiDung_Id = [];
        var arrThoiGian_Id = [];
        for (var i = 0; i < me.arrGiangVien_GD_Id.length; i++) {
            if (document.getElementById("noidung_" + me.arrGiangVien_GD_Id[i]) == undefined) continue;
            arrGiangVien.push(me.arrGiangVien_GD_Id[i]);
            arrNoiDung_Id.push($("#noidung_" + me.arrGiangVien_GD_Id[i]).val());
            arrThoiGian_Id.push($("#thoigian_" + me.arrGiangVien_GD_Id[i]).val());
        }
        if (arrGiangVien.length == 0) return;
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/ThemMoi',
            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id,
            'strGiangVien_Ids': arrGiangVien.toString().replace(/,/g, "#"),
            'strNoiDung': arrNoiDung_Id.toString().replace(/,/g, "#"),
            'strThoiGian': arrThoiGian_Id.toString().replace(/,/g, "#"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        //
        edu.system.makeRequest({
            success: function (data) {
                //me.arrGiangVien_GD_Id = [];
                //if (data.Success) {
                //    edu.system.alert("Thêm mới thành công!");
                //}
                //else {
                //    edu.system.alert("NCKH_HuongDanGiangDay/ThemMoi: " + data.Message);
                //}
                //
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_GiangVien_GD: function (strIds) {
        var me = main_doc.HuongDanGiangDay;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/Xoa_GiangVien',
            
            'strGiangVien_Ids': strIds,
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id,
            'strNguoiThucHien_Id': edu.system.userId,

        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //me.arrGiangVien_GD_Id = [];
                    me.getList_GiangVien_GD(me.strId);
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    genTable_GiangVien_GD_View: function (data, iPager) {
        var me = main_doc.HuongDanGiangDay;
        var jsonForm = {
            strTable_Id: "tblDetail_HDGD_GiangVien_GD",
            aaData: data,
            colPos: {
                center: [0, 1]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return "<img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                    }
                },
                {
                    "mDataProp": "NOIDUNGGIANGDAY"
                },
                {
                    "mDataProp": "THOIGIAN"
                }
            ]
        };
        var jsonView = jsonForm;
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genTable_GiangVien_GD_Edit: function (data, iPager) {
        var me = main_doc.HuongDanGiangDay;
        if (me.strHDGD_Id == "") return;
        me.arrGiangVien_GD_Id = [];
        var jsonForm = {
            strTable_Id: "tblInput_HDGD_GiangVien_GD",
            aaData: data,
            colPos: {
                center: [0, 1, 5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return "<img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                    }
                },
                {
                    "mDataProp": "NOIDUNGGIANGDAY"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        main_doc.HuongDanGiangDay.arrGiangVien_GD_Id.push(aData.GIANGVIEN_ID);
                        return "<a id='" + aData.GIANGVIEN_ID + "' class='btnDelete poiter'><i class='fa fa-trash'></i></a>";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    addHTMLinto_tblGiangVien_GD: function (strNhanSu_Id) {
        var me = main_doc.HuongDanGiangDay;
        //[1] add to arrNhanSu_Id
        console.log(me.arrGiangVien_GD_Id);
        if (edu.util.arrEqualVal(me.arrGiangVien_GD_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrGiangVien_GD_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td><input class='form-control' id='noidung_" + strNhanSu_Id + "'></input></td>";
        html += "<td><input class='form-control input-datepicker' placeholder='dd/mm/yyyy' id='thoigian_" + strNhanSu_Id + "'></input></td>";
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnRemove'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_HDGD_GiangVien_GD tbody").append(html);
    },
    removeHTMLoff_tblGiangVien_GD: function (strNhanSu_Id) {
        var me = main_doc.HuongDanGiangDay;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrGiangVien_GD_Id, strNhanSu_Id);
        if (me.arrGiangVien_GD_Id.length === 0) {
            $("#tblInput_HDGD_GiangVien_GD tbody").html("");
            $("#tblInput_HDGD_GiangVien_GD tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function () {
        var me = main_doc.HuongDanGiangDay;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HDGD_SinhVien/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id
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
                    me.genTable_SinhVien_Edit(dtResult, iPager);
                    me.genTable_SinhVien_View(dtResult, iPager);
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
    save_SinhVien: function () {
        var me = main_doc.HuongDanGiangDay;
        if (me.arrSinhVien_Id.length == 0) return;
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_HDGD_SinhVien/ThemMoi',
            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id,
            'strSinhVien_Ids': me.arrSinhVien_Id.toString().replace(/,/g, "#"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                //if (data.Success) {
                //    edu.system.alert("Thêm mới thành công!");
                //}
                //else {
                //    edu.system.alert("NCKH_HuongDanGiangDay/ThemMoi: " + data.Message);
                //}
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = main_doc.HuongDanGiangDay;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HDGD_SinhVien/Xoa_SinhVien',
            
            'strSinhVien_Ids': strIds,
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_SinhVien(me.strId);
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    genTable_SinhVien_View: function (data, iPager) {
        var me = main_doc.HuongDanGiangDay;
        var jsonForm = {
            strTable_Id: "tblDetail_HDGD_SinhVien",
            aaData: data,
            colPos: {
                center: [0, 1]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return "<img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                    }
                }
            ]
        };
        var jsonView = jsonForm;
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genTable_SinhVien_Edit: function (data, iPager) {
        var me = main_doc.HuongDanGiangDay;
        me.arrNhanSu_Id = [];
        var jsonForm = {
            strTable_Id: "tblInput_HDGD_SinhVien",
            aaData: data,
            colPos: {
                center: [1, 3]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return "<img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        main_doc.HuongDanGiangDay.arrSinhVien_Id.push(aData.ID);
                        return "<a id='" + aData.ID + "' class='btnDelete poiter'><i class='fa fa-trash'></i></a>";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    addHTMLinto_tblSinhVien: function (strNhanSu_Id) {
        var me = main_doc.HuongDanGiangDay;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnRemove'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_HDGD_SinhVien tbody").append(html);
    },
    removeHTMLoff_tblSinhVien: function (strNhanSu_Id) {
        var me = main_doc.HuongDanGiangDay;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_HDGD_SinhVien tbody").html("");
            $("#tblInput_HDGD_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML Combox
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_PhanLoai: function (data) {
        var me = main_doc.HuongDanGiangDay;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropSearch_VaiTro_HDGD", "dropPhanLoai"],
            title: ""
        };
        edu.system.loadToCombo_data(obj);
        //Chọn lấy loại vai trò giảng viên đầu tiên để hiển thị
        if (data.length > 0) {
            edu.util.viewValById("dropPhanLoai", data[0].ID);
            me.switchLoaiVTGV();
        }
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.HuongDanGiangDay;
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
};