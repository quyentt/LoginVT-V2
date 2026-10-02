/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function DeTaiSinhVien() { }
DeTaiSinhVien.prototype = {
    dtDeTai: [],
    strDTSV_Id: "",
    arrGiangVien_HD_Id: [],
    arrSinhVien_Id: [],
    dtVaiTro: [],
    arrValid_DeTaiSinhVien: [],

    init: function () {
        var me = main_doc.DeTaiSinhVien;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            if (me.checkChange("zone_input_DTSV")) {
                edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
                $("#btnYes").click(function (e) {
                    me.toggle_form();
                    $("#btnSave_DTSV").trigger("click");
                });
            }
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnReWrite").click(function () {
            me.rewrite();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_DTSV();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DTSV();
            }
        });
        /*------------------------------------------
        --Discription: [1] Action DeTai
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_DTSV").click(function () {
            me.getList_DTSV();
        });
        $("#btnSave_DTSV").click(function () {
            //var valid = edu.util.validInputForm(me.arrValid_DeTaiSinhVien);
            
            if (true) {
                if (edu.util.checkValue(me.strDTSV_Id)) {
                    me.update_DTSV();
                }
                else {
                    me.save_DTSV();
                }
            }
        });
        $("#tblDeTaiSinhVien").delegate(".btnEdit", "click", function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            edu.util.setOne_BgRow(strId, "tblDeTaiSinhVien");
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.rewrite();
                me.strDTSV_Id = strId;
                edu.util.setOne_BgRow(strId, "tblDeTaiSinhVien");
                event.stopImmediatePropagation();
                me.getDetail_DTSV(strId, constant.setting.ACTION.EDIT);
                me.getList_GiangVien_HD(strId);
                me.getList_SinhVien();
                me.getList_KinhPhi();
                edu.system.viewFiles("txtDTSV_FileDinhKem", strId, "NCKH_Files");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDeTaiSinhVien").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DTSV(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
       --Discription: [3-3] Action Nguon Kinh Phi
       --Order:
       -------------------------------------------*/
        $("#btnAdd_DTSV_KinhPhi").click(function () {
            var id = edu.util.randomString(30, "");
            var strNguon_Id = edu.util.getValById("dropDTSV_KinhPhi_Nguon");
            var strNguon = $("#dropDTSV_KinhPhi_Nguon option:selected").text();
            var strSoTien = edu.util.getValById("txtDTSV_KinhPhi_SoTien");
            var strDonVi_Id = edu.util.getValById("dropDTSV_KinhPhi_DonViTienTe");
            var strDonVi = $("#dropDTSV_KinhPhi_DonViTienTe option:selected").text();

            if (edu.util.checkValue(strNguon_Id) && edu.util.checkValue(strSoTien)) {
                me.genTable_KinhPhi(id, strNguon_Id, strNguon, strSoTien, strDonVi_Id, strDonVi);

                edu.util.viewValById("dropDTSV_KinhPhi_Nguon", "");
                edu.util.viewValById("txtDTSV_KinhPhi_SoTien", "");
                edu.util.viewValById("dropDTSV_KinhPhi_DonViTienTe", "");
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_DTSV_KinhPhi").delegate(".btnDeletePoiter", "click", function (e) {
            var strId = this.id;
            if (strId.length == 30) {
                $(this.parentNode.parentNode).replaceWith("");
            } else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KinhPhi(strId);
                });
            }
        });
        $("#tblInput_DTSV_KinhPhi").delegate(".inputsotien", "keyup", function (e) {
            var strSoTien = $(this).val().replace(/,/g, '');
            if (strSoTien[0] == '0') strSoTien = strSoTien.substring(1);
            $(this).val(edu.util.formatCurrency(strSoTien));
        });
        /*------------------------------------------
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $(".btnSearchDTSV_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_DTSV_GiangVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GiangVien_HD(strNhanSu_Id);
                });
            }
        });

        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTMLoff_SinhVien(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.DeTaiSinhVien;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtDTSV_FileDinhKem"]);
        var obj = {
            strMaBangDanhMuc: "NCKH.VTSV",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        me.toggle_form();
        me.getList_DTSV();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.XLDT, "dropXepLoai,dropSearch_DTSV_Loai");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.NGKP, "dropDTSV_KinhPhi_Nguon");
        
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.DVTT, "dropDTSV_KinhPhi_DonViTienTe"); 
        me.arrValid_DeTaiSinhVien = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtDTSV_TenDetai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        me.getList_DeTai();
    },
    toggle_DTSV: function () {
        edu.util.toggle_overide("zone-bus", "zone_DTSV");
    },
    toggle_form: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_DTSV");
        $("#txtDTSV_Ten").focus();
        setTimeout(function () {
            me.setCheckChange("zone_input_DTSV");
        }, 1000);
    },
    setCheckChange: function (strZoneId) {
        var point = $("#" + strZoneId);
        var x = point.find("input, select, textarea");
        point.attr("checkchange", x.length);
        x.each(function () {
            var bVal = $(this).val();
            //if (bVal)
            $(this).attr("checkchange", bVal);
        });
    },
    checkChange: function (strZoneId) {
        var point = $("#" + strZoneId);
        var x = point.find("input, select, textarea");
        var bcheck = false;
        if (x.length != parseInt(point.attr("checkchange"))) return true;
        else {
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).val() != $(x[i]).attr("checkchange")) {
                    console.log("OK");
                    return true;
                }
            }
        }
        return false;
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_DTSV");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.DeTaiSinhVien;
        $("#myModalLabel_DeTaiSinhVien").html('.. <i class="fa fa-pencil"></i> Kê khai đề tài sinh viên');
        //
        me.strDTSV_Id = "";
        me.arrSinhVien_Id = [];
        me.arrGiangVien_HD_Id = [];
        var arrId = ["txtDTSV_TenDetai", "txtDTSV_NamThucHien", "txtDTSV_NghiemThu", "txtDTSV_DiemNghiemThu", "dropXepLoai", "dropDTSV_QuanLyDeTai_Id",
            "txtDTSV_QDPheDuyet", "txtDTSV_QDNghiemThu", "txtDTSV_BienBanNghiemThu", "txtDTSV_MoTa", "dropDTSV_KinhPhi_Nguon", "txtDTSV_KinhPhi_SoTien", "dropDTSV_KinhPhi_DonViTienTe", "txtDTSV_TenSinhVien"];
        edu.util.resetValByArrId(arrId);
        $("#tblInput_DTSV_KinhPhi tbody").html("");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInput_DTSV_GiangVien tbody").html("");
        edu.system.viewFiles("txtDTSV_FileDinhKem", "");
        edu.extend.getDetail_HS(me.genHTML_NhanSu);
        //table
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });
        $(".comment_lydo").remove();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DTSV
    -------------------------------------------*/
    save_DTSV: function () {
        var me = main_doc.DeTaiSinhVien;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_QuanLyDeTaiSinhVien/ThemMoi',
            

            'strId': "",
            'strTenDeTai': edu.util.getValById('txtDTSV_TenDetai'),
            'strNamThucHien': edu.util.getValById('txtDTSV_NamThucHien'),
            'strDiemNghiemThu': edu.util.getValById('txtDTSV_DiemNghiemThu'),
            'strXepLoai_Id': edu.util.getValById('dropXepLoai'),
            'strMoTa': edu.util.getValById('txtDTSV_MoTa'),
            'strNamNghiemThu': edu.util.getValById('txtDTSV_NghiemThu'),
            'strQuyetDinhPheDuyet': edu.util.getValById('txtDTSV_QDPheDuyet'),
            'strQuyetDinhNghiemThu': edu.util.getValById('txtDTSV_QDNghiemThu'),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById('dropDTSV_QuanLyDeTai_Id'),
            'strMoTa': edu.util.getValById('txtDTSV_TenSinhVien'),
            'dSoTacGia_n': "",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        var strDTSV_Id = data.Id;
                        $("#tblInput_DTSV_KinhPhi tbody tr").each(function () {
                            var strNewKinhPhi_Id = this.id;
                            if (strNewKinhPhi_Id.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                                me.save_KinhPhi(strNewKinhPhi_Id, strDTSV_Id);
                            }
                        });
                        $("#tblInput_DTSV_GiangVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_GiangVien_HD(strNhanSu_Id, strDTSV_Id);
                        });
                        $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_SinhVien(strNhanSu_Id, strDTSV_Id);
                        });
                        edu.system.saveFiles("txtDTSV_FileDinhKem", strDTSV_Id, "NCKH_Files");
                        
                    }
                    edu.system.alert('Tiến trình thực hiện thành công!');
                    //$("#btnYes").click(function (e) {
                    //    me.rewrite();
                    //    $('#myModalAlert').modal('hide');
                        
                    //});
                    setTimeout(function () {
                        me.getList_DTSV();
                    }, 3050);
                    me.setCheckChange("zone_input_DTSV");
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
    update_DTSV: function () {
        var me = main_doc.DeTaiSinhVien;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_QuanLyDeTaiSinhVien/CapNhat',
            

            'strId': me.strDTSV_Id,
            'strTenDeTai': edu.util.getValById('txtDTSV_TenDetai'),
            'strNamThucHien': edu.util.getValById('txtDTSV_NamThucHien'),
            'strDiemNghiemThu': edu.util.getValById('txtDTSV_DiemNghiemThu'),
            'strXepLoai_Id': edu.util.getValById('dropXepLoai'),
            'strMoTa': edu.util.getValById('txtDTSV_MoTa'),
            'strNamNghiemThu': edu.util.getValById('txtDTSV_NghiemThu'),
            'strQuyetDinhPheDuyet': edu.util.getValById('txtDTSV_QDPheDuyet'),
            'strQuyetDinhNghiemThu': edu.util.getValById('txtDTSV_QDNghiemThu'),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById('dropDTSV_QuanLyDeTai_Id'),
            'strMoTa': edu.util.getValById('txtDTSV_TenSinhVien'),
            'dSoTacGia_n': "",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDTSV_Id = me.strDTSV_Id;
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    me.getList_DTSV();
                    $("#tblInput_DTSV_KinhPhi tbody tr").each(function () {
                        var strNewKinhPhi_Id = this.id;
                        if (strNewKinhPhi_Id.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_KinhPhi(strNewKinhPhi_Id, strDTSV_Id);
                        }
                    });
                    $("#tblInput_DTSV_GiangVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_GiangVien_HD(strNhanSu_Id, strDTSV_Id);
                    });
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_SinhVien(strNhanSu_Id, strDTSV_Id);
                    });
                    edu.system.saveFiles("txtDTSV_FileDinhKem", strDTSV_Id, "NCKH_Files");
                    setTimeout(function () {
                        me.getList_DTSV();
                    }, 3050);
                    me.setCheckChange("zone_input_DTSV");
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
    getList_DTSV: function () {
        var me = main_doc.DeTaiSinhVien;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_QuanLyDeTaiSinhVien/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strXepLoai_Id': edu.util.getValById("dropSearch_DTSV_Loai"),
            'strNguoiThucHien_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strThanhVien_Id': edu.system.userId,
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
                    me.genTable_DTSV(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_DTSV: function (strId, strAction) {
        var me = main_doc.DeTaiSinhVien;
        edu.util.objGetDataInData(strId, me.dtDeTai, "ID", me.viewEdit_DTSV);
    },
    delete_DTSV: function (strId) {
        var me = main_doc.DeTaiSinhVien;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_QuanLyDeTaiSinhVien/Xoa',
            
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
                    me.getList_DTSV();
                }
                else {
                    obj = {
                        content: "NCKH_SP_QuanLyDeTaiSinhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_SP_QuanLyDeTaiSinhVien/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] AcessDB GenHTML_DTSV
    -------------------------------------------*/
    genTable_DTSV: function (data, iPager) {
        var me = main_doc.DeTaiSinhVien;
        edu.util.viewHTMLById("lblDTSV_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblDeTaiSinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DeTai.getList_DTSV()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.TENDETAI) + "</span><br />";
                        if (edu.util.checkValue(aData.KETQUAXACNHAN_TEN)) {
                            html += '<span class="pull-right lbTinhTrang" style="' + aData.KETQUAXACNHAN_THONGTIN2 + '" title="' + aData.KETQUAXACNHAN_NOIDUNG + '">';
                            html += aData.KETQUAXACNHAN_TEN;
                            html += '</span>';
                        }
                        if (aData.HOANTHANHNHAPDULIEU == 0) {
                            html += '<span class="pull-right lbTinhTrang" style="color: orange" title="' + aData.HOANTHANHNHAPDULIEU_LYDO + '">';
                            html += "Chưa hoàn thành";
                            html += '</span>';
                        } else {
                            if (aData.HOANTHANHNHAPDULIEU == 1) {
                                html += '<span class="pull-right lbTinhTrang" style="color: green">';
                                html += "Hoàn thành";
                                html += '</span>';
                            }
                        }
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
    viewEdit_DTSV: function (data) {
        var me = main_doc.DeTaiSinhVien;
        var dtDeTai = data[0];
        //View - Thong tin
        edu.util.viewValById("txtDTSV_TenDetai", dtDeTai.TENDETAI);
        edu.util.viewValById("txtDTSV_NamThucHien", dtDeTai.NAMTHUCHIEN);
        edu.util.viewValById("txtDTSV_NghiemThu", dtDeTai.NAMNGHIEMTHU);
        edu.util.viewValById("txtDTSV_DiemNghiemThu", dtDeTai.DIEMNGHIEMTHU);
        edu.util.viewValById("dropXepLoai", dtDeTai.XEPLOAI_ID);
        edu.util.viewValById("txtDTSV_QDPheDuyet", dtDeTai.QUYETDINHPHEDUYET);
        edu.util.viewValById("txtDTSV_QDNghiemThu", dtDeTai.QUYETDINHNGHIEMTHU);
        edu.util.viewValById("txtDTSV_TenSinhVien", dtDeTai.MOTA);
        edu.util.viewValById("dropDTSV_QuanLyDeTai_Id", dtDeTai.NCKH_QUANLYDETAI_ID);
        edu.util.viewValById("txtDTSV_MoTa", dtDeTai.MOTA);
        $("#myModalLabel_DeTaiSinhVien").html('<i class="fa fa-edit"></i> Chỉnh sửa đề tài sinh viên');
    },
    /*------------------------------------------
    --Discription: [3] AccessDB DonViHopTac
    --ULR:  Modules
    -------------------------------------------*/
    save_KinhPhi: function (strId, strDTSV_Id) {
        var me = this;
        var strNguon_Id = $("#tblInput_DTSV_KinhPhi #" + strId + " #lblDTSV_KinhPhi_Nguon").attr("name");
        var strSoTien = $("#tblInput_DTSV_KinhPhi #" + strId + " #lblDTSV_KinhPhi_SoTien").html();
        var strDonVi_Id = $("#tblInput_DTSV_KinhPhi #" + strId + " #lblDTSV_KinhPhi_DonViTienTe").attr("name");
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_NguonKinhPhi/ThemMoi',
            

            'strId': "",
            'strSanPham_Id': strDTSV_Id,
            'strNguonKinhPhi_Id': strNguon_Id,
            'strDonViTinh_Id': strDonVi_Id,
            'dSoTien': strSoTien.replace(/,/g, ''),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thêm mới thành công!");
                    //me.getList_MucDichLamViec();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KinhPhi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_NguonKinhPhi/LayDanhSach',
            

            'strSanPham_Id': me.strDTSV_Id,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    $("#tblInput_DTSV_KinhPhi tbody").html("");
                    for (var i = 0; i < dtReRult.length; i++) {
                        me.genTable_KinhPhi(dtReRult[i].ID, dtReRult[i].NGUONKINHPHI_ID, dtReRult[i].NGUONKINHPHI_TEN, dtReRult[i].SOTIEN, dtReRult[i].DONVITINH_ID, dtReRult[i].DONVITINH_TEN);
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_KinhPhi: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_NguonKinhPhi/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KinhPhi();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [4] GenHTML Kinh phí
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KinhPhi: function (strRowId, strNguon_Id, strNguon, strSoTien, strDonVi_Id, strDonVi) {
        var me = this;
        var row = "";
        row += '<tr id="' + strRowId + '">';
        row += '<td>';
        row += 'Tên nguồn<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDTSV_KinhPhi_Nguon" name="' + strNguon_Id + '">' + strNguon + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Số tiền<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDTSV_KinhPhi_SoTien">' + edu.util.formatCurrency(strSoTien) + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Đơn vị<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDTSV_KinhPhi_DonViTienTe" name="' + strDonVi_Id + '">' + strDonVi + '</span>';
        row += '</td>';
        row += '<td class="td-fixed td-center">';
        row += '<a id="' + strRowId + '" class="btnDeletePoiter poiter">';
        row += '<i class="fa fa-trash"></i>';
        row += '</a>';
        row += '</td>';
        row += '</tr>';
        $("#tblInput_DTSV_KinhPhi tbody").append(row);
    },

    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien_HD: function (strDTSV_Id) {
        var me = main_doc.DeTaiSinhVien;

        //--Edit
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',
            

            'strSanPham_Id': strDTSV_Id,
            'pageIndex': 1,
            'pageSize': 10000
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
                    me.genTable_ThanhVien(dtResult);
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
    save_GiangVien_HD: function (strNhanSu_Id, strDTSV_Id) {
        var me = main_doc.DeTaiSinhVien;
        //--Edit
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',
            

            'strSanPham_Id': strDTSV_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strVaiTro_Id': "",
            'dTyLeThamGia': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
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
                //    edu.system.alert("NCKH_DeTaiSinhVien/ThemMoi: " + data.Message);
                //}
                //
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            async: false,
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_GiangVien_HD: function (strIds) {
        var me = main_doc.DeTaiSinhVien;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strDTSV_Id,
            'strThanhVien_Id': strNhanSu_Id,
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
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrGiangVien_HD_Id = [];
        $("#tblInput_DTSV_GiangVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span> - <span>" + data[i].MACANBO + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_GiangVien tbody").append(html);
            me.arrGiangVien_HD_Id.push(data[i].ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.DeTaiSinhVien;
        if (bcheckadd == true && me.arrGiangVien_HD_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrGiangVien_HD_Id
        if (edu.util.arrEqualVal(me.arrGiangVien_HD_Id, strNhanSu_Id)) {
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
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_GiangVien tbody").append(html);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrGiangVien_HD_Id, strNhanSu_Id);
        if (me.arrGiangVien_HD_Id.length === 0) {
            $("#tblInput_DTSV_GiangVien_HD tbody").html("");
            $("#tblInput_DTSV_GiangVien_HD tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function () {
        var me = main_doc.DeTaiSinhVien;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_QLDTSV_SinhVien/LayDanhSach',
            
            'strNCKH_SP_SinhVien_DeTai_Id': me.strDTSV_Id
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
                    me.genTable_SinhVien(dtResult);
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
    save_SinhVien: function (strNhanSu_Id, strDTSV_Id) {
        var me = main_doc.DeTaiSinhVien;
        if (me.arrSinhVien_Id.length == 0) return;
        //--Edit
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_save = {
            'action': 'NCKH_SP_QLDTSV_SinhVien/ThemMoi',
            

            'strId': '',
            'strNCKH_SP_QuanLyDeTaiSV_Id': strDTSV_Id,
            'strDanhSachSV_Ids': strNhanSu_Id,
            'strVaiTro_Ids': strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                //if (data.Success) {
                //    edu.system.alert("Thêm mới thành công!");
                //}
                //else {
                //    edu.system.alert("NCKH_DeTaiSinhVien/ThemMoi: " + data.Message);
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
        var me = main_doc.DeTaiSinhVien;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_QLDTSV_SinhVien/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
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
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblInput_DTSV_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].SINHVIEN_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HODEM + " " + data[i].TEN + " - " + data[i].MASO; + "</span></td>";
            html += "<td>" + data[i].VAITRO_TEN + "</td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].SINHVIEN_ID);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.DeTaiSinhVien;
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
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender, "");
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.DeTaiSinhVien;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.DeTaiSinhVien;
        me.dtVaiTro = data;
        me.rewrite();
    },
    genCombo_VaiTro: function (place, default_val) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder",
                default_val: default_val
            },
            renderPlace: [place],
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + place).select2();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DeTai: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_DeTai/LayDanhSach',
            

            'iTinhTrang': -1,
            'iTrangThai': -1,
            'strCanBoNhapDeTai_Id': "",
            'strThanhVien_Id': edu.system.userId,
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
            renderPlace: ["dropDTSV_QuanLyDeTai_Id"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
};