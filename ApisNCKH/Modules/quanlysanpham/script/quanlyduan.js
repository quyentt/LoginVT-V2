/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function QuanLyDuAn() { }
QuanLyDuAn.prototype = {
    dtQuanLyDuAn: [],
    strQuanLyDuAn_Id: '',
    arrNhanSu_Id: [],
    dtVaiTro: [],

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
        });
        $(".btnReWrite").click(function () {
            me.rewrite();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_QuanLyDuAn();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QuanLyDuAn();
            }
        });
        /*------------------------------------------
       --Discription: [1] Action Sach
       --Order:
       -------------------------------------------*/
        $("#btnSave_QuanLyDuAn").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuanLyDuAn);
            if (edu.util.checkValue(me.strQuanLyDuAn_Id)) {
                me.update_QuanLyDuAn();
            }
            else {
                me.save_QuanLyDuAn();
            }
        });
        $("#tblQuanLyDuAn").delegate(".btnEdit", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strQuanLyDuAn_Id = strId;
                me.getDetail_QuanLyDuAn(strId, constant.setting.ACTION.EDIT);
                me.getList_DeTai_ThanhVien();
                edu.util.setOne_BgRow(strId, "tblQuanLyDuAn");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQuanLyDuAn").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QuanLyDuAn(strId);
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
        $(".btnSearchNhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#modal_nhansu").delegate('.btnSelect_NgoaiTruong', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu_NgoaiTruong(strNhanSu_Id);
        });
        $("#tblInput_ThanhVien, #tblInput_ThanhVien_NgoaiTruong").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DeTai_ThanhVien(strNhanSu_Id);
                });
            }
        });
        $("#dropSearch_DonViThanhVien").on("select2:select", function () {
            me.getList_HS();
        });
        me.arrValid_QuanLyDuAn = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtHNHT_TenHoiNghiHoiThao", "THONGTIN1": "EM" },
            { "MA": "txtHNHT_TenBaoCao", "THONGTIN1": "EM" },
        ];
        $(".btnSearchTTS_NhanSu_NgoaiTruong").click(function () {
            edu.extend.genModal_NhanSu_NgoaiTruong();
            edu.extend.getList_NhanSu_NgoaiTruong("SEARCH");
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.QuanLyDuAn;
        me.getList_QuanLyDuAn();
        me.getList_CoCauToChuc();
        me.getList_NamDanhGia();
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.VTDT", "", "", data => me.dtVaiTro = data);
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.QuanLyDuAn;
        //
        me.strQuanLyDuAn_Id = "";
        me.arrNhanSu_Id = [];
        $("#tblInput_ThanhVien tbody").html("");
        edu.util.viewValById("txtTenDuAn", "");
        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("dropMou", 1);
        edu.util.viewValById("txtDonViKy", "");
        edu.util.viewValById("txtThoiHan", "");
        edu.util.viewValById("txtNoiDung", "");
        edu.util.viewValById("txtKetQua", "");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB Sach
    -------------------------------------------*/
    getList_QuanLyDuAn: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_QuanLyDuAn/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strThanhVien_Id': edu.util.getValById('dropSearch_ThanhVienDangKy'),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtQuanLyDuAn = dtResult;
                    }
                    me.genTable_QuanLyDuAn(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_QuanLyDuAn/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_QuanLyDuAn/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_QuanLyDuAn: function () {
        var me = main_doc.QuanLyDuAn;

        var obj_save = {
            'action': 'NCKH_QuanLyDuAn/ThemMoi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strTenDuAn': edu.util.getValById('txtTenDuAn'),
            'strDonViChuTri_Id': edu.util.getValById('dropDonVi'),
            'strNhaTaiTro': edu.util.getValById('txtAAAA'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strMucDich_PhamVi_NoiDung': edu.util.getValById('txtNoiDung'),
            'strKetQuaDuAn': edu.util.getValById('txtKetQua'),
            'dMoU': edu.util.getValById('dropMou'),
            'strDonViKyKetMoU': edu.util.getValById('txtDonViKy'),
            'strThoiHanKyKetMoU': edu.util.getValById('txtThoiHan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        var strQuanLyDuAn_Id = data.Id;
                        $("#tblInput_ThanhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_DeTai_ThanhVien(strNhanSu_Id, strQuanLyDuAn_Id);
                        });
                        $("#tblInput_ThanhVien_NgoaiTruong tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_DeTai_ThanhVien(strNhanSu_Id, strQuanLyDuAn_Id);
                        });
                        
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm mới không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });                        
                    }
                    setTimeout(function () {
                        me.getList_QuanLyDuAn();
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    update_QuanLyDuAn: function () {
        var me = main_doc.QuanLyDuAn;

        var obj_save = {
            'action': 'NCKH_QuanLyDuAn/CapNhat',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strTenDuAn': edu.util.getValById('txtTenDuAn'),
            'strDonViChuTri_Id': edu.util.getValById('dropDonVi'),
            'strNhaTaiTro': edu.util.getValById('txtAAAA'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strMucDich_PhamVi_NoiDung': edu.util.getValById('txtNoiDung'),
            'strKetQuaDuAn': edu.util.getValById('txtKetQua'),
            'dMoU': edu.util.getValById('dropMou'),
            'strDonViKyKetMoU': edu.util.getValById('txtDonViKy'),
            'strThoiHanKyKetMoU': edu.util.getValById('txtThoiHan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strQuanLyDuAn_Id = me.strQuanLyDuAn_Id;
                    me.getList_QuanLyDuAn();
                    $("#tblInput_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_ThanhVien(strNhanSu_Id, strQuanLyDuAn_Id);
                    });
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    getDetail_QuanLyDuAn: function (strId, strAction) {
        var me = main_doc.QuanLyDuAn;
        edu.util.objGetDataInData(strId, me.dtQuanLyDuAn, "ID", me.viewEdit_QuanLyDuAn);
    },
    delete_QuanLyDuAn: function (strIds) {
        var me = main_doc.QuanLyDuAn;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_QuanLyDuAn/Xoa',
            
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
                    me.getList_QuanLyDuAn();
                }
                else {
                    obj = {
                        content: "NCKH_QuanLyDuAn/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_QuanLyDuAn/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML Sach
    --ULR:  Modules
    -------------------------------------------*/
    genTable_QuanLyDuAn: function (data, iPager) {
        var me = main_doc.QuanLyDuAn;
        edu.util.viewHTMLById("lblQuanLyDuAn_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblQuanLyDuAn",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyDuAn.getList_QuanLyDuAn()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.TENDUAN) + "</span><br />";
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
    viewEdit_QuanLyDuAn: function (data) {
        var me = main_doc.QuanLyDuAn;
        var dt = data[0];
        //View - Thong tin
        edu.util.viewValById("txtTenDuAn", dt.TENDUAN);
        edu.util.viewValById("dropDonVi", dt.DONVICHUTRI_ID);
        edu.util.viewValById("txtTuNgay", dt.TUNGAY);
        edu.util.viewValById("txtDenNgay", dt.DENNGAY);
        edu.util.viewValById("dropMou", dt.MOU);
        edu.util.viewValById("txtDonViKy", dt.DONVIKYKETMOU);
        edu.util.viewValById("txtThoiHan", dt.THOIHANKYKETMOU);
        edu.util.viewValById("txtNoiDung", dt.MUCDICH_PHAMVI_NOIDUNG);
        edu.util.viewValById("txtKetQua", dt.KETQUADUAN);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_DeTai_ThanhVien: function (strNhanSu_Id, strQuanLyDuAn_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var dTyLe = $("#tyle_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strQuanLyDuAn_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'dTyLeThamGia': dTyLe,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
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
    getList_DeTai_ThanhVien: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',            

            'strSanPham_Id': me.strQuanLyDuAn_Id,
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
                    me.genTable_DeTai_ThanhVien(dtResult);
                    me.genTable_QuanLyDuAn_ThanhVien_NgoaiTruong(dtResult);
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
    delete_DeTai_ThanhVien: function (strNhanSu_Id) {
        var me = this;

        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strQuanLyDuAn_Id,
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
    genTable_DeTai_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_ThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 1) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span> - <span>" + data[i].MACANBO + "</span></td>";
            html += "<td><select id='vaitro_" + data[i].ID + "'></select></td>";
            //html += "<td><input class='form-control' id='tyle_" + data[i].ID + "' value='" + data[i].TYLETHAMGIA + "'></input></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = main_doc.QuanLyDuAn;
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
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        //html += "<td><input class='form-control' id='tyle_" + strNhanSu_Id + "'></input></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_ThanhVien tbody").append(html);
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
            $("#tblInput_ThanhVien tbody").html("");
            $("#tblInput_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_QuanLyDuAn_ThanhVien_NgoaiTruong: function (data) {
        var me = this;
        //3. create html
        $("#tblInput_ThanhVien_NgoaiTruong tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            console.log(data[i]);
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span></td>";
            html += "<td><select id='vaitro_" + data[i].ID + "'></select></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_ThanhVien_NgoaiTruong tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu_NgoaiTruong: function (strNhanSu_Id) {
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
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + edu.util.getHTMLById("sl_hoten" + strNhanSu_Id) + "</span></td>";
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_ThanhVien_NgoaiTruong tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.QuanLyDuAn;
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
            renderPlace: ["dropSearch_DonViThanhVien", "dropDonVi"],
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
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
            renderPlace: ["dropSearch_ThanhVienDangKy"],
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
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
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
    }
};