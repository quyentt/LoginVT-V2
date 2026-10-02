/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function HuongDanSauDaiHoc() { }
HuongDanSauDaiHoc.prototype = {
    dtDeTai: [],
    dtVaiTro:[],
    strHDGD_Id: "",
    arrGiangVien_HD_Id: [],
    arrSinhVien_Id: [],
    strPhanLoai_Id: "",
    arrValid_HDGD: [],

    init: function () {
        var me = main_doc.HuongDanSauDaiHoc;
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
        $(".btnReWrite").click(function () {
            me.rewrite();
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
            var valid = edu.util.validInputForm(me.arrValid_HDGD);
            if (valid) {
                if (edu.util.checkValue(me.strHDGD_Id)) {
                    me.update_HDGD();
                }
                else {
                    me.save_HDGD();
                }
            }
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
                me.getList_GiangVien_HD();
                me.getList_SinhVien();
                edu.system.viewFiles("txtHDGD_FileDinhKem", strId, "NCKH_Files");
                edu.util.setOne_BgRow(strId, "tblHDGD");
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
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $(".btnSearchHDGD_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_HDGD_GiangVien_HD").delegate('.btnDeletePoiter', 'click', function () {
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
        $(".btnSearchHDGD_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_HDGD_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
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
        var me = main_doc.HuongDanSauDaiHoc;
        var obj = {
            strMaBangDanhMuc: "NCKH.VTHDGD",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genCombo_PhanLoai);
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtHDGD_FileDinhKem"]);
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        var obj = {
            strMaBangDanhMuc: "NCKH.VHSV",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        setTimeout(function () {
            me.getList_HDGD();
        }, 500);
        me.arrValid_HDGD = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtHDGD_TenDetai", "THONGTIN1": "EM" },
        ];
    },

    toggle_HDGD: function () {
        edu.util.toggle_overide("zone-bus", "zone_HDGD");
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
        var me = main_doc.HuongDanSauDaiHoc;
        //
        me.strHDGD_Id = "";
        me.arrSinhVien_Id = [];
        me.arrGiangVien_HD_Id = [];
        var arrId = ["txtHDGD_TenDetai","txtHDGD_TenHocVien", "txtHDGD_DenThang", "txtHDGD_TuThang", "txtHDGD_NamNghiemThu", "txtHDGD_MoTa", "tblInput_HDGD_GiangVien_HD", "tblInput_HDGD_SinhVien"];
        edu.util.resetValByArrId(arrId);
        //table
        edu.system.viewFiles("txtHDGD_FileDinhKem", "");
        $("#tblInput_HDGD_GiangVien_HD tbody").html("");
        $("#tblInput_HDGD_SinhVien tbody").html("");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_HDGD
    -------------------------------------------*/
    save_HDGD: function () {
        var me = main_doc.HuongDanSauDaiHoc;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_HuongDan_GiangDay/ThemMoi',            

            'strId': "",
            'strTenDeTai_GiangDay': edu.util.getValById("txtHDGD_TenDetai"),
            'strNamNghiemThu': edu.util.getValById("txtHDGD_NamNghiemThu"),
            'strThoiGianBatDau': edu.util.getValById("txtHDGD_TuThang"),
            'strThoiGianKetThuc': edu.util.getValById("txtHDGD_DenThang"),
            'strPhanLoai_Id': me.strPhanLoai_Id,
            'strMoTa': edu.util.getValById("txtHDGD_TenHocVien"),
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        var strHDGD_Id = data.Id;
                        $("#tblInput_HDGD_GiangVien_HD tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_GiangVien_HD(strNhanSu_Id, strHDGD_Id);
                        });
                        $("#tblInput_HDGD_SinhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_SinhVien(strNhanSu_Id, strHDGD_Id);
                        });
                        edu.system.saveFiles("txtHDGD_FileDinhKem", strHDGD_Id, "NCKH_Files");
                        setTimeout(function () {
                            me.getList_HDGD();
                        }, 50);
                    }
                    edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm mới không?');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                    });
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
        var me = main_doc.HuongDanSauDaiHoc;

        var obj_save = {
            'action': 'NCKH_SP_HuongDan_GiangDay/CapNhat',            

            'strId': me.strHDGD_Id,
            'strTenDeTai_GiangDay': edu.util.getValById("txtHDGD_TenDetai"),
            'strNamNghiemThu': edu.util.getValById("txtHDGD_NamNghiemThu"),
            'strThoiGianBatDau': edu.util.getValById("txtHDGD_TuThang"),
            'strThoiGianKetThuc': edu.util.getValById("txtHDGD_DenThang"),
            'strMoTa': edu.util.getValById("txtHDGD_TenHocVien"),
            'strPhanLoai_Id': me.strPhanLoai_Id,
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_HDGD();
                    var strHDGD_Id = me.strHDGD_Id;
                    $("#tblInput_HDGD_GiangVien_HD tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_GiangVien_HD(strNhanSu_Id, strHDGD_Id);
                    });
                    $("#tblInput_HDGD_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_SinhVien(strNhanSu_Id, strHDGD_Id);
                    });
                    edu.system.saveFiles("txtHDGD_FileDinhKem", strHDGD_Id, "NCKH_Files");
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
        var me = main_doc.HuongDanSauDaiHoc;
        var obj_list = {
            'action': 'NCKH_SP_HuongDan_GiangDay/LayDanhSach',            

            'strThanhVien_Id': "",
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strPhanLoai_Id': me.strPhanLoai_Id,
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 1000000
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
        var me = main_doc.HuongDanSauDaiHoc;
        edu.util.objGetDataInData(strId, me.dtDeTai, "ID", me.viewEdit_HDGD);
    },
    delete_HDGD: function (strId) {
        var me = main_doc.HuongDanSauDaiHoc;

        var obj_delete = {
            'action': 'NCKH_SP_HuongDan_GiangDay/Xoa',
            
            'strIds': strId,
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
        var me = main_doc.HuongDanSauDaiHoc;
        edu.util.viewHTMLById("lblHDGD_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblHDGD",
            aaData: data,
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
                        html += '<span>' + edu.util.returnEmpty(aData.TENDETAI_GIANGDAY) + "</span><br />";
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
    viewEdit_HDGD: function (data) {
        var me = main_doc.HuongDanSauDaiHoc;
        var dtDeTai = data[0];
        //View - Thong tin
        edu.util.viewValById("txtHDGD_TenDetai", dtDeTai.TENDETAI_GIANGDAY);
        edu.util.viewValById("strNamNghiemThu", dtDeTai.NAMNGHIEMTHU);
        edu.util.viewValById("txtHDGD_DenThang", dtDeTai.THOIGIANKETTHUC);
        edu.util.viewValById("txtHDGD_TuThang", dtDeTai.THOIGIANBATDAU);
        edu.util.viewValById("dropPhanLoai", dtDeTai.PHANLOAI_ID);
        edu.util.viewValById("txtHDGD_NamNghiemThu", dtDeTai.NAMNGHIEMTHU);
        edu.util.viewValById("txtHDGD_TenHocVien", dtDeTai.MOTA);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien_HD: function () {
        var me = main_doc.HuongDanSauDaiHoc;

        var obj_list = {
            'action': 'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id
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
    save_GiangVien_HD: function (strNhanSu_Id, strHDGD_Id) {
        var me = main_doc.HuongDanSauDaiHoc;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();

        var obj_save = {
            'action': 'NCKH_SP_HDGD_GiangVien_HD/ThemMoi',            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': strHDGD_Id,
            'strGiangVien_Ids': strNhanSu_Id,
            'strVaiTro_Ids': strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
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
        var me = main_doc.HuongDanSauDaiHoc;

        var obj_delete = {
            'action': 'NCKH_SP_HDGD_GiangVien_HD/Xoa',
            
            'strIds': strIds,
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id,
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
        $("#tblInput_HDGD_GiangVien_HD tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].GIANGVIEN_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HODEM + " " + data[i].TEN + "</span> - <span>" + data[i].MASO + "</span></td>";
            html += "<td>" + data[i].VAITRO_TEN + "</td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_HDGD_GiangVien_HD tbody").append(html);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
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
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_HDGD_GiangVien_HD tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
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
    getList_SinhVien: function () {
        var me = main_doc.HuongDanSauDaiHoc;

        var obj_list = {
            'action': 'NCKH_SP_HDGD_SinhVien/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id
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
    save_SinhVien: function (strHDGD_Id) {
        var me = main_doc.HuongDanSauDaiHoc;
        if (me.arrSinhVien_Id.length == 0) return;

        var obj_save = {
            'action': 'NCKH_SP_HDGD_SinhVien/ThemMoi',            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': strHDGD_Id,
            'strSinhVien_Ids': me.arrSinhVien_Id.toString().replace(/,/g, "#"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
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
        var me = main_doc.HuongDanSauDaiHoc;

        var obj_delete = {
            'action': 'NCKH_SP_HDGD_SinhVien/Xoa_SinhVien',
            
            'strSinhVien_Ids': strIds,
            'strNCKH_SP_HD_GD_Id': me.strHDGD_Id,
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
        me.arrGiangVien_HD_Id = [];
        $("#tblInput_HDGD_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HODEM + " " + data[i].TEN + " - " + data[i].MASO; + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_HDGD_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].ID);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.HuongDanSauDaiHoc;
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
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_HDGD_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.HuongDanSauDaiHoc;
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
        var me = main_doc.HuongDanSauDaiHoc;
        for (var i = 0; i < data.length; i++) {
            if (data[i].MA == "HUONGDAN") {
                me.strPhanLoai_Id = data[i].ID;
            }
        }
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.HuongDanSauDaiHoc;
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