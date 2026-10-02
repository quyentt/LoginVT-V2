/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function GiangDayDaiHoc() { }
GiangDayDaiHoc.prototype = {
    dtDeTai: [],
    dtVaiTro: [],
    strGDDH_Id: "",
    arrGiangVien_GD_Id: [],
    arrSinhVien_Id: [],
    strPhanLoai_Id: "",
    arrValid_GiangDayDaiHoc: [],

    init: function () {
        var me = main_doc.GiangDayDaiHoc;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            if (edu.util.checkValue(edu.util.getValById("txtGDDH_TenDetai")) || edu.util.checkValue(edu.util.getValById("txtGDDH_TenLopDay"))) {
                edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
                $("#btnYes").click(function (e) {
                    me.toggle_form();
                    $("#btnSave_GDDH").trigger("click");
                });
            }
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
            edu.extend.getDetail_HS(me.genHTML_NhanSu);
        });
        $(".btnReWrite").click(function () {
            me.rewrite();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
            me.getList_HDGD();
        });
        $("#btnSearchGDDH_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_GDDH();
            }
        });
        $("#btnSearch_HHD").click(function () {
            me.getList_GDDH();
        });
        /*------------------------------------------
        --Discription: [1] Action DeTai
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_GDDH").click(function () {
            me.getList_GDDH();
        });
        $("#btnSave_GDDH").click(function () {
            //var valid = edu.util.validInputForm(me.arrValid_GiangDayDaiHoc);
            
            if (true) {
                if (edu.util.checkValue(me.strGDDH_Id)) {
                    me.update_GDDH();
                }
                else {
                    me.save_GDDH();
                }
            }
        });
        $("#tblGDDH").delegate(".btnEdit", "click", function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            edu.util.setOne_BgRow(strId, "tblGDDH");
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.rewrite();
                me.strGDDH_Id = strId;
                me.getDetail_GDDH(strId, constant.setting.ACTION.EDIT);
                me.getList_GiangVien_GD();
                me.getList_SinhVien();
                edu.system.viewFiles("txtGDDH_FileDinhKem", strId, "NCKH_Files");
                edu.util.setOne_BgRow(strId, "tblGDDH");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblGDDH").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GDDH(strId);
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
        $(".btnSearchGDDH_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_GDDH_GiangVien_GD").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GiangVien_GD(strNhanSu_Id);
                });
            }
        });

        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchGDDH_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_GDDH_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
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
        var me = main_doc.GiangDayDaiHoc;
        var obj = {
            strMaBangDanhMuc: "NCKH.VTHDGD",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genCombo_PhanLoai);
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtGDDH_FileDinhKem"]);
        me.toggle_form();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_GDDH();
        }, 500);
        me.arrValid_GiangDayDaiHoc = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtGDDH_TenDetai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
    },

    toggle_GDDH: function () {
        edu.util.toggle_overide("zone-bus", "zone_GDDH");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_GDDH");
        $("#txtGDDH_Ten").focus();
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_GDDH");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.GiangDayDaiHoc;
        //
        $("#myModalLabel_GDSDH").html('.. <i class="fa fa-pencil"></i> Kê khai giảng dạy sau đại học');
        me.strGDDH_Id = "";
        me.arrSinhVien_Id = [];
        me.arrGiangVien_GD_Id = [];
        var arrId = ["txtGDDH_TenDetai", "txtGDDH_TenLopDay", "txtGDDH_DenThang", "txtGDDH_TuThang", "txtGDDH_NamNghiemThu", "txtGDDH_MoTa"];
        edu.util.resetValByArrId(arrId);
        edu.system.viewFiles("txtGDDH_FileDinhKem", "");
        $("#tblInput_GDDH_GiangVien_GD tbody").html("");
        $("#tblInput_GDDH_SinhVien tbody").html("");
        edu.extend.getDetail_HS(me.genHTML_NhanSu);
        //table
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });
        $(".comment_lydo").remove();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_GDDH
    -------------------------------------------*/
    save_GDDH: function () {
        var me = main_doc.GiangDayDaiHoc;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_HuongDan_GiangDay/ThemMoi',
            

            'strId': "",
            'strTenDeTai_GiangDay': edu.util.getValById("txtGDDH_TenDetai"),
            'strNamNghiemThu': edu.util.getValById("txtGDDH_NamNghiemThu"),
            'strThoiGianBatDau': edu.util.getValById("txtGDDH_TuThang"),
            'strThoiGianKetThuc': edu.util.getValById("txtGDDH_DenThang"),
            'dSoTacGia_n': 1,
            'strMoTa': edu.util.getValById("txtGDDH_TenLopDay"),
            'strPhanLoai_Id': me.strPhanLoai_Id,
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {

                        var strGDDH_Id = data.Id;

                        $("#tblInput_GDDH_GiangVien_GD tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_GiangVien_GD(strNhanSu_Id, strGDDH_Id);
                        });
                        $("#tblInput_GDDH_SinhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_SinhVien(strNhanSu_Id, strGDDH_Id);
                        });
                        edu.system.saveFiles("txtGDDH_FileDinhKem", strGDDH_Id, "NCKH_Files");
                    }
                    edu.system.alert('Tiến trình thực hiện thành công!');
                    //$("#btnYes").click(function (e) {
                    //    me.rewrite();
                    //    $('#myModalAlert').modal('hide');
                    //});
                    setTimeout(function () {
                        me.getList_GDDH();
                    }, 3050);
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
    update_GDDH: function () {
        var me = main_doc.GiangDayDaiHoc;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_HuongDan_GiangDay/CapNhat',
            

            'strId': me.strGDDH_Id,
            'strTenDeTai_GiangDay': edu.util.getValById("txtGDDH_TenDetai"),
            'strNamNghiemThu': edu.util.getValById("txtGDDH_NamNghiemThu"),
            'strThoiGianBatDau': edu.util.getValById("txtGDDH_TuThang"),
            'strThoiGianKetThuc': edu.util.getValById("txtGDDH_DenThang"),
            'strMoTa': edu.util.getValById("txtGDDH_TenLopDay"),
            'dSoTacGia_n': 1,
            'strPhanLoai_Id': me.strPhanLoai_Id,
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    var strGDDH_Id = me.strGDDH_Id;

                    $("#tblInput_GDDH_GiangVien_GD tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_GiangVien_GD(strNhanSu_Id, strGDDH_Id);
                    });
                    $("#tblInput_GDDH_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_SinhVien(strNhanSu_Id, strGDDH_Id);
                    });
                    edu.system.saveFiles("txtGDDH_FileDinhKem", strGDDH_Id, "NCKH_Files");

                    setTimeout(function () {
                        me.getList_GDDH();
                    }, 3050);
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
    getList_GDDH: function () {
        var me = main_doc.GiangDayDaiHoc;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HuongDan_GiangDay/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strThanhVien_Id': edu.system.userId,
            'strPhanLoai_Id': me.strPhanLoai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genTable_GDDH(dtResult, iPager);
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
    getDetail_GDDH: function (strId, strAction) {
        var me = main_doc.GiangDayDaiHoc;
        edu.util.objGetDataInData(strId, me.dtDeTai, "ID", me.viewEdit_GDDH);
    },
    delete_GDDH: function (strId) {
        var me = main_doc.GiangDayDaiHoc;
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
                    me.getList_GDDH();
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
    --Discription: [1] AcessDB GenHTML_GDDH
    -------------------------------------------*/
    genTable_GDDH: function (data, iPager) {
        var me = main_doc.GiangDayDaiHoc;
        edu.util.viewHTMLById("lblGDDH_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblGDDH",
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
    viewEdit_GDDH: function (data) {
        var me = main_doc.GiangDayDaiHoc;
        var dtDeTai = data[0];
        //View - Thong tin
        edu.util.viewValById("txtGDDH_TenDetai", dtDeTai.TENDETAI_GIANGDAY);
        edu.util.viewValById("txtGDDH_DenThang", dtDeTai.THOIGIANKETTHUC);
        edu.util.viewValById("txtGDDH_TuThang", dtDeTai.THOIGIANBATDAU);
        edu.util.viewValById("dropPhanLoai", dtDeTai.PHANLOAI_ID);
        edu.util.viewValById("txtGDDH_NamNghiemThu", dtDeTai.NAMNGHIEMTHU);
        edu.util.viewValById("txtGDDH_TenLopDay", dtDeTai.MOTA);
        $("#myModalLabel_GDSDH").html('<i class="fa fa-edit"></i> Chỉnh sửa giảng dạy sau đại học');
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien_GD: function () {
        var me = main_doc.GiangDayDaiHoc;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strGDDH_Id
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
    save_GiangVien_GD: function (strNhanSu_Id, strGDDH_Id) {
        var me = main_doc.GiangDayDaiHoc;
        var strNoiDung = $("#thoigian_" + strNhanSu_Id).val();
        var strThoiGian = $("#noidung_" + strNhanSu_Id).val();
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/ThemMoi',
            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': strGDDH_Id,
            'strGiangVien_Ids': strNhanSu_Id,
            'strNoiDung': strNoiDung,
            'strThoiGian': strThoiGian,
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
                //    edu.system.alert("NCKH_GiangDayDaiHoc/ThemMoi: " + data.Message);
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
        var me = main_doc.GiangDayDaiHoc;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/Xoa',
            
            'strIds': strIds,
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
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        $("#tblInput_GDDH_GiangVien_GD tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].GIANGVIEN_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HODEM + " " + data[i].TEN + "</span> - <span>" + data[i].MASO + "</span></td>";
            html += "<td>" + data[i].NOIDUNGGIANGDAY +"</input></td>";
            html += "<td>" + data[i].THOIGIAN +"</td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_GDDH_GiangVien_GD tbody").append(html);
            me.arrGiangVien_GD_Id.push(data[i].GIANGVIEN_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.GiangDayDaiHoc;
        console.log(me.arrGiangVien_GD_Id);
        console.log(strNhanSu_Id);
        if (bcheckadd == true && me.arrGiangVien_GD_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrGiangVien_GD_Id
        if (edu.util.arrEqualVal(me.arrGiangVien_GD_Id, strNhanSu_Id)) {
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
        html += "<td><input class='form-control' id='thoigian_" + strNhanSu_Id + "' value=''></input></td>";
        html += "<td><input class='form-control' id='noidung_" + strNhanSu_Id + "' value=''></input></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_GDDH_GiangVien_GD tbody").append(html);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrGiangVien_GD_Id, strNhanSu_Id);
        if (me.arrGiangVien_GD_Id.length === 0) {
            $("#tblInput_GDDH_GiangVien_GD tbody").html("");
            $("#tblInput_GDDH_GiangVien_GD tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function () {
        var me = main_doc.GiangDayDaiHoc;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HDGD_SinhVien/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strGDDH_Id
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
    save_SinhVien: function (strNhanSu_Id, strGDDH_Id) {
        var me = main_doc.GiangDayDaiHoc;
        if (me.arrSinhVien_Id.length == 0) return;
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_HDGD_SinhVien/ThemMoi',
            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': strGDDH_Id,
            'strSinhVien_Ids': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                //if (data.Success) {
                //    edu.system.alert("Thêm mới thành công!");
                //}
                //else {
                //    edu.system.alert("NCKH_GiangDayDaiHoc/ThemMoi: " + data.Message);
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
        var me = main_doc.GiangDayDaiHoc;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HDGD_SinhVien/Xoa_SinhVien',
            
            'strSinhVien_Ids': strIds,
            'strNCKH_SP_HD_GD_Id': me.strGDDH_Id,
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
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblInput_GDDH_SinhVien tbody").html("");
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
            $("#tblInput_GDDH_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].ID);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.GiangDayDaiHoc;
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
        $("#tblInput_GDDH_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.GiangDayDaiHoc;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_GDDH_SinhVien tbody").html("");
            $("#tblInput_GDDH_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML Combox
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_PhanLoai: function (data) {
        var me = main_doc.GiangDayDaiHoc;
        me.rewrite();
        for (var i = 0; i < data.length; i++) {
            console.log(i);
            if (data[i].MA == "GIANGDAY") {
                me.strPhanLoai_Id = data[i].ID;
            }
        }
    }
};