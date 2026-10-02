/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function GiaiThuong() { }
GiaiThuong.prototype = {
    dtGiaiTuong: [],
    strGiaiThuong_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],
    arrValid_GiaiThuong: [],

    init: function () {
        var me = main_doc.GiaiThuong;
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
            me.getList_GT();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_GT();
            }
        });
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_GT").click(function () {            
            var valid = edu.util.validInputForm(me.arrValid_GiaiThuong);
            if (valid) {
                if (edu.util.checkValue(me.strGiaiThuong_Id)) {
                    me.update_GT();
                }
                else {
                    me.save_GT();
                }
            }
        });
        $("#tblGT").delegate(".btnEdit", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strGiaiThuong_Id = strId;
                me.getList_GiaiThuong_ThanhVien();
                me.getDetail_GT(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblGT");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblGT").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GT(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_GT();
            }
        });
        $("#btnSearch_GT").click(function () {
            me.getList_GT();
        });
        $("#dropSearch_DonViThanhVien_GiaiThuong").on("select2:select", function () {
            me.getList_HS();
        });
        $(".btnSearch_GiaiThuong_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_GiaiThuong_ThanhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GiaiThuong_ThanhVien(strNhanSu_Id);
                });
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.GiaiThuong;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtGT_FileDinhKem"]);
        me.toggle_notify();
        me.getList_HS();
        me.getList_GT();
        me.getList_DeTai();
        me.getList_CoCauToChuc();
        me.getList_NamDanhGia();
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong, dropSearch_CapQuanLy_GiaiThuong");
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_GiaiThuong = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtGT_NoiDung", "THONGTIN1": "EM" },
            { "MA": "txtGT_SoQuyetDinh", "THONGTIN1": "EM" },
        ];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_GT");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_GT");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_GT");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.GiaiThuong;
        //
        me.strGiaiThuong_Id = "";
        var arrId = ["txtGT_HinhThuc", "txtGT_NoiDung", "txtGT_Nam", "txtGT_Thang", "txtGT_SoNguoi", "txtGT_NoiDungMinhChung", "dropGT_DeTai", "txtGT_SoQuyetDinh", "dropSearch_GT_CapKhenThuong"];
        edu.system.viewFiles("txtGT_FileDinhKem", "");
        $("#tblInput_GiaiThuong_ThanhVien tbody").html("");
        me.arrNhanSu_Id = [];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_GT: function () {
        var me = main_doc.GiaiThuong;

        var obj_list = {
            'action': 'NCKH_GiaiThuong/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropSearch_DeTai_GiaiThuong"),
            'strnckh_detai_thanhvien_id': edu.util.getValById("dropSearch_ThanhVien_GiaiThuong"),
            'strVaiTro_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearch_DonViThanhVien_GiaiThuong"),
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strCapKhenThuong_Id': edu.util.getValById("dropSearch_CapQuanLy_GiaiThuong"),
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            'pageIndex': 1,
            'pageSize': 100000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtGiaiTuong = dtResult;
                    }
                    me.genTable_GT(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_GiaiThuong/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_GiaiThuong/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_GT: function () {
        var me = main_doc.GiaiThuong;

        var obj_save = {
            'action': 'NCKH_GiaiThuong/ThemMoi',            

            'strId': "",
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropGT_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strVaiTro_Id': "",
            'strHinhThuc': edu.util.getValById("txtGT_HinhThuc"),
            'strNoiDungGiaiThuong': edu.util.getValById("txtGT_NoiDung"),
            'strNamTangThuong': edu.util.getValById("txtGT_Nam"),
            'strThangTangThuong': edu.util.getValById("txtGT_Thang"),
            'dSoGioQuyDoiDuocTinh_n': "",
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtGT_NoiDungMinhChung"),
            'strMaSanPham': "",
            'dSoNguoiThamGia_n': edu.util.getValById("txtGT_SoNguoi"),
            'strCapKhenThuong_Id': edu.util.getValById("dropSearch_GT_CapKhenThuong"),
            'strSoQuyetDinh': edu.util.getValById("txtGT_SoQuyetDinh"),
            'strLoaiDoiTuong_Id': "",
            'dTrangThai': 1,
            'dThuTu': 0,
            'strCanBoNhap_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        var strGiaiThuong_Id = data.Id;
                        $("#tblInput_GiaiThuong_ThanhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_GiaiThuong_ThanhVien(strNhanSu_Id, strGiaiThuong_Id);
                        });
                        if (me.bcheckTimKiem) {
                            var x = $("#zoneFileDinhKemtxtGT_FileDinhKem .btnDelUploadedFile");
                            for (var i = 0; i < x.length; i++) {
                                x[i].classList.remove("btnDelUploadedFile");
                                x[i].name = "";
                                x[i].classList.add("btnDeleteFileUptxtGT_FileDinhKem");
                            }
                        }
                        edu.system.saveFiles("txtGT_FileDinhKem", strGiaiThuong_Id, "NCKH_Files");
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
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_GiaiThuong/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_GT: function () {
        var me = main_doc.GiaiThuong;

        var obj_save = {
            'action': 'NCKH_GiaiThuong/CapNhat',            

            'strId': me.strGiaiThuong_Id,
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropGT_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strVaiTro_Id': "",
            'strHinhThuc': edu.util.getValById("txtGT_HinhThuc"),
            'strNoiDungGiaiThuong': edu.util.getValById("txtGT_NoiDung"),
            'strNamTangThuong': edu.util.getValById("txtGT_Nam"),
            'strThangTangThuong': edu.util.getValById("txtGT_Thang"),
            'dSoGioQuyDoiDuocTinh_n': "",
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtGT_NoiDungMinhChung"),
            'strMaSanPham': "",
            'dSoNguoiThamGia_n': edu.util.getValById("txtGT_SoNguoi"),
            'strCapKhenThuong_Id': edu.util.getValById("dropSearch_GT_CapKhenThuong"),
            'strSoQuyetDinh': edu.util.getValById("txtGT_SoQuyetDinh"),
            'strLoaiDoiTuong_Id': "",
            'dTrangThai': 1,
            'dThuTu': 0,
            'strCanBoNhap_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    $("#tblInput_GiaiThuong_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_GiaiThuong_ThanhVien(strNhanSu_Id, me.strGiaiThuong_Id);
                    });
                    me.getList_GT();
                    setTimeout(function () {
                        edu.system.saveFiles("txtGT_FileDinhKem", me.strGiaiThuong_Id, "NCKH_Files");
                    }, 50);
                }
                else {
                    edu.system.alert("NCKH_GiaiThuong/CapNhat: " + data.Message);
                }                
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
    getDetail_GT: function (strId, strAction) {
        var me = main_doc.GiaiThuong;
        edu.util.objGetDataInData(strId, me.dtGiaiTuong, "ID", me.viewEdit_GT);
    },
    delete_GT: function (strIds) {
        var me = main_doc.GiaiThuong;

        var obj_delete = {
            'action': 'NCKH_GiaiThuong/Xoa',
            
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
                    me.getList_GT();
                }
                else {
                    obj = {
                        content: "NCKH_GiaiThuong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_GiaiThuong/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML VanBangSanghe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_GT: function (data, iPager) {
        var me = main_doc.GiaiThuong;
        edu.util.viewHTMLById("lblGT_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblGT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GiaiThuong.getList_GT()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.NOIDUNGGIAITHUONG) + "</span><br />";
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
    viewEdit_GT: function (data) {
        var me = main_doc.GiaiThuong;
        //View - Thong tin
        var dt = data[0];
        edu.util.viewHTMLById("lblGT_NguoiNhap", dt.CANBONHAP_TENDAYDU);
        edu.util.viewValById("txtGT_HinhThuc", dt.HINHTHUC);
        edu.util.viewValById("txtGT_NoiDung", dt.NOIDUNGGIAITHUONG);
        edu.util.viewValById("txtGT_Nam", dt.NAMTANGTHUONG);
        edu.util.viewValById("txtGT_Thang", dt.THANGTANGTHUONG);
        edu.util.viewValById("txtGT_DoiTuongKhen", "");
        edu.util.viewValById("txtGT_SoNguoi", dt.SONGUOITHAMGIAVAOCONGTRINH_N);
        edu.util.viewValById("txtGT_NoiDungMinhChung", dt.THONGTINMINHCHUNG);
        edu.util.viewValById("dropSearch_GT_CapKhenThuong", dt.CAPKHENTHUONG_ID);
        edu.system.viewFiles("txtGT_FileDinhKem", dt.ID, "NCKH_Files");
        edu.util.viewValById("txtGT_SoQuyetDinh", dt.SOQUYETDINH);//chưa có số quyết định trả về
        edu.util.viewValById("dropGT_DeTai", dt.NCKH_QUANLYDETAI_ID);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_GiaiThuong_ThanhVien: function (strNhanSu_Id, strGiaiThuong_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var dTyLe = $("#tyle_" + strNhanSu_Id).val();
        var obj_notify;

        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strGiaiThuong_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'dTyLeThamGia': dTyLe,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
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
    getList_GiaiThuong_ThanhVien: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',            

            'strSanPham_Id': me.strGiaiThuong_Id,
            'pageIndex': 1,
            'pageSize': 100
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_GiaiThuong_ThanhVien(dtResult);
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
    delete_GiaiThuong_ThanhVien: function (strNhanSu_Id) {
        var me = this;

        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strGiaiThuong_Id,
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
                    me.getList_GiaiThuong_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_GiaiThuong_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_GiaiThuong_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    genTable_GiaiThuong_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_GiaiThuong_ThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span> - <span>" + data[i].MACANBO + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_GiaiThuong_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = main_doc.GiaiThuong;
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
        $("#tblInput_GiaiThuong_ThanhVien tbody").append(html);
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
            $("#tblInput_GiaiThuong_ThanhVien tbody").html("");
            $("#tblInput_GiaiThuong_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    getList_DeTai: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_DeTai/LayDanhSach',            

            'iTinhTrang': -1,
            'iTrangThai': -1,
            'strCanBoNhapDeTai_Id': "",
            'strThanhVien_Id': "",
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
            renderPlace: ["dropGT_DeTai", "dropSearch_DeTai_GiaiThuong"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
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
            renderPlace: ["dropSearchModal_TTS_DonVi", "dropSearch_DonViThanhVien_GiaiThuong"],
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_GiaiThuong"),
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
            renderPlace: ["dropSearch_ThanhVien_GiaiThuong"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
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

        if (data.length > 0) {
            edu.util.viewValById("dropSearch_NamDanhGia_DT", data[0].ID);
        }
    },
};