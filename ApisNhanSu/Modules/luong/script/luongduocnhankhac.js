/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function LuongDuocNhanKhac() { };
LuongDuocNhanKhac.prototype = {
    dt_NO: [],
    strNguoiO_Id: '',
    arrNhanSu_Id: [],
    strNhanSu_Id: '',
    dtNhanSu: [],
    strLuongDuocNhanKhac_Id: '',
    dLuong: 0,
    dThue: 0,

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnSearchKhoiTao_NhanSu").click(function () {
            me.getList_DuocNhanKhac();
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });

        $(".btnAdd").click(function () {
            me.toggle_hosoedit();
        });
        $("#SaveDuocNhanKhac").click(function () {
            var x = $("#tblInput_GiangVien tbody tr");

            edu.system.genHTML_Progress("progess_DuocNhan", x.length);
            for (var i = 0; i < x.length; i++) {
                var strNhanSu_Id = x[i].id.replace(/rm_row/g, '');
                me.save_DuocNhanKhac(strNhanSu_Id);
            }
        });

        $("#Save_NS_DuocNhanKhac").click(function () {
            //var x = $("#tblInput_GiangVien tbody tr");

            //var strNhanSu_Id = x[i].id.replace(/rm_row/g, '');
            me.Update_NS_DuocNhanKhac();
            //edu.system.genHTML_Progress("progess_DuocNhan", x.length);
            //for (var i = 0; i < x.length; i++) {
            //    var strNhanSu_Id = x[i].id.replace(/rm_row/g, '');
            //    me.save_NS_DuocNhanKhac(strNhanSu_Id);
            //}
        });
        $("#dropSearch_DonViThanhVien_DuocNhanKhac").on("select2:select", function () {
            me.getList_HS();
            me.getList_DuocNhanKhac();
            
        });
        $("#dropSearch_ThanhVien_DuocNhanKhac").on("select2:select", function () {
            //me.getList_HS();
            me.getList_DuocNhanKhac();
            
        });
        $("#txtSearch_DuocNhanKhac_TuNgay").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DuocNhanKhac();
                
            }
        });
        $("#txtSearch_DuocNhanKhac_DenNgay").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DuocNhanKhac();
                
            }
        });
        $("#txtSearch_DuocNhanKhac_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
                me.getList_DuocNhanKhac();
                
            }
        });
        $(".btnSearch").click(function () {
            me.getList_DuocNhanKhac();
            
        });
        $(".btnSearch_GiangVien").click(function () {
            me.genModal_NhanSu();
            me.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
            me.show_TongTien("tblInput_GiangVien");
            edu.system.move_ThroughInTable("tblInput_GiangVien");
        });
        $("#tblInput_GiangVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
        });
        $("[id$=chkSelectAll_DuocNhanKhac]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDuocNhanKhac" });
        });
        $("#btnXoaDuocNhanKhac").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDuocNhanKhac", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DuocNhanKhac(arrChecked_Id[i]);
                }
                //setTimeout(function () {
                //    me.getList_DuocNhanKhac();
                //}, 1000);
            });
        });

        $("#btnSinhLaiSoChungTu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDuocNhanKhac", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var bcheck = false;
            arrChecked_Id.forEach(e => {if (me.dtNhanSu.find(ele => ele.ID === e).SOCHUNGTU) { bcheck = true; return; } });
            edu.system.confirm(bcheck ? "Bạn có chắc chắn muốn tạo lại số không?" : "Bạn có chắc chắn muốn tạo số mới không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                arrChecked_Id.forEach(e => me.save_SinhLaiSoChungTu(me.dtNhanSu.find(ele => ele.ID === e)));
            });
        });
        $("#btnSinhChungTu").click(function () {
            edu.system.confirm("Bạn có muốn sinh số chứng từ không?");
            $("#btnYes").click(function (e) {
                me.save_SinhChungTu()
            });
        });
        $("#zoneEdit").delegate("#txtSoTien", "keyup", function (e) {
            var x = $("#txtSoTien").val().replace(/,/g, "");
            $("#txtSoTien").val(edu.util.formatCurrency(x));
        });
        $("#tblInput_GiangVien").delegate(".inputsotien", "keyup", function (e) {
            var point = $(this);
            point.val(edu.util.formatCurrency(point.val().replace(/,/g, "")));
            me.show_TongTien("tblInput_GiangVien");
        });
        $("#tblDuocNhanKhac").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tblDuocNhanKhac");
            if (edu.util.checkValue(strId)) {
                me.strLuongDuocNhanKhac_Id = strId;
                me.getDetail_NS_DuocNhanKhac(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
        });


        edu.system.getList_MauImport("zonebtnBaoCao_LDN", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_DuocNhanKhac_TuKhoa"),
                'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_DuocNhanKhac"),
                'strNgayPhatSinh_TuNgay': edu.util.getValById("txtSearch_DuocNhanKhac_TuNgay"),
                'strNgayPhatSinh_DenNgay': edu.util.getValById("txtSearch_DuocNhanKhac_DenNgay"),
                'strSearch_NhanSu_HoSoCanBo_Id': edu.util.getValById("dropSearch_ThanhVien_DuocNhanKhac"),
                'strNam': edu.util.getValById('txtSearch_Nam'),
                'dLaCanBoNgoaiTruong': edu.util.getValById('dropSearch_LaCanBo_DuocNhanKhac'),
                'strNamXuatChungTu': edu.util.getValById('txtSearch_NamXuatChungTu'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDuocNhanKhac", "checkHS");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strNhanSu_HoSoCanBo_Id", arrChecked_Id[i]);
            }
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
        $("#txtSearch_Nam").val(edu.util.thisYear());
        me.getList_DuocNhanKhac();
        
        me.getList_CoCauToChuc();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIKHOAN", "dropLoaiKhoan, dropNS_LoaiKhoan");
    },
    toggle_batdau: function () {
        var me = main_doc.LuongDuocNhanKhac;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        me.getList_DuocNhanKhac();
    },
    toggle_hosoedit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    rewrite: function () {
        var me = this;
        edu.util.viewValById("dropLoaiKhoan", "");
        edu.util.viewValById("txtSoTien", "");
        edu.util.viewValById("txtThueThuNhap", "");
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
    getList_DuocNhanKhac: function () {
        var me = main_doc.LuongDuocNhanKhac;
        //--Edit
        var obj_list = {
            'action': 'L_DuocNhan/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_DuocNhanKhac_TuKhoa"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_DuocNhanKhac"),
            'strNgayPhatSinh_TuNgay': edu.util.getValById("txtSearch_DuocNhanKhac_TuNgay"),
            'strNgayPhatSinh_DenNgay': edu.util.getValById("txtSearch_DuocNhanKhac_DenNgay"),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById("dropSearch_ThanhVien_DuocNhanKhac"),
            'strSoChungTuThuNhap': edu.util.getValById('txtSearch_SoChungTuThuNhap'),
            'strNamXuatChungTu': edu.util.getValById('txtSearch_NamXuatChungTu'),
            'strSoChungTu': edu.util.getValById('txtSearch_SoChungTu'),
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'dLaCanBoNgoaiTruong': edu.util.getValById('dropSearch_LaCanBo_DuocNhanKhac'),
            'strNguoiTao_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
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
                    me.genTable_DuocNhanKhac(data.Data, data.Pager);

                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
                me.getList_LuongThuNhap();
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
    save_DuocNhanKhac: function (strNhanSu_Id) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'L_DuocNhan/ThemMoi',
            

            'strId': '',
            'dNam': edu.util.getValById("txtNam"),
            'dThang': edu.util.getValById("txtThang"),
            'strSoTien': edu.util.getValById("txtSoTien_" + strNhanSu_Id).replace(/,/g, ""),
            'strThueTNCN': edu.util.getValById("txtThueThuNhap_" + strNhanSu_Id).replace(/,/g, ""),
            'strChungTu': edu.util.getValById("txtChungTu"),
            'strNgayPhatSinh': edu.util.getValById("txtNgay"),
            'strMoTa': edu.util.getValById('txtNoiDung_' + strNhanSu_Id),
            'strChucNang_Id': edu.system.strChucNang_Id,

            'strLoaiKhoan_Id': edu.util.getValById("dropLoaiKhoan"),
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        //edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KHAMSK");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_DuocNhanKhac();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
                edu.system.start_Progress("progess_DuocNhan", me.toggle_batdau);
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
                edu.system.start_Progress("progess_DuocNhan", me.toggle_batdau);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    Update_NS_DuocNhanKhac: function () {
        var me = this;
        var obj_notify = {};
        
        var obj_save = {
            'action': 'L_DuocNhan/CapNhat',
            

            'strId': me.strLuongDuocNhanKhac_Id,
            'dNam': "",
            'dThang':"",
            'strSoTien': edu.util.getValById("txtNS_SoTien").replace(/,/g, ""),
            'strThueTNCN': edu.util.getValById("txtNS_ThueThuNhap").replace(/,/g, ""),
            'strChungTu': edu.util.getValById("txtNS_ChungTu"),
            'strNgayPhatSinh': edu.util.getValById("txtNS_Ngay"),
            'strMoTa': edu.util.getValById('txtNS_NoiDung'),

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiKhoan_Id': edu.util.getValById("dropNS_LoaiKhoan"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_DuocNhanKhac();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
                edu.system.start_Progress("progess_DuocNhan", me.toggle_batdau);
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
                edu.system.start_Progress("progess_DuocNhan", me.toggle_batdau);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_NS_DuocNhanKhac: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_DuocNhan/LayChiTiet',
            
            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.editForm_NhanSu_DuocNhanKhac(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DuocNhanKhac: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_DuocNhan/Xoa',
            
            'strIds': strIds,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_DuocNhanKhac();
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DuocNhanKhac();
                });
            },
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    save_SinhLaiSoChungTu: function (obj) {
        var me = this;
        var obj_list = {
            'action': 'L_SoChungTuThue/SinhLaiSoChungTuThueTNCN',
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strNamXuatChungTu': edu.util.getValById('txtSearch_NamXuatChungTu'),
            'strNhanSu_HoSoCanBo_Id': obj.NHANSU_HOSOCANBO_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(obj.SOCHUNGTU ? "Tạo lại số chứng từ thành công!" : "Tạo mới số chứng từ thành công!");
                    //me.getList_DuocNhanKhac();
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + data.Message);
                }
                
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + er);
            },
            type: "GET",
            action: obj_list.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DuocNhanKhac();
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_SinhChungTu: function (obj) {
        var me = this;
        var obj_save = {
            'action': 'L_ThueTNCN/SinhSoChungTuThueTNCN',
            'type': 'POST',
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strNamXuatChungTu': edu.util.getValById('txtSearch_NamXuatChungTu'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien_DuocNhanKhac'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien_DuocNhanKhac'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    //me.getList_DuocNhanKhac();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DuocNhanKhac();
                });
            },
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
    genTable_DuocNhanKhac: function (data, iPager) {
        var me = this;
        $("#lblHSLL_DuocNhanKhac_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDuocNhanKhac",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.LuongDuocNhanKhac.getList_DuocNhanKhac()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 2, 4, 13, 14, 15],
                right: [6,7]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mData": "NGUOICUOI_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                    }
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASOTHUE"
                },
                {
                    "mDataProp": "CHUNGTU"
                },
                {
                    "mData": "LOAIKHOAN_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mData": "THUETNCN",

                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.THUETNCN);
                    }
                },
                {
                    "mDataProp": "KYHIEU"
                },
                {
                    "mDataProp": "SOCHUNGTU"
                },
                {
                    "mDataProp": "NGAYCHUNGTU"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "LOAIKHOAN_TEN"
                },
                {
                    "mDataProp": "NGAYPHATSINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(jsonForm.strTable_Id, [6, 7]);
        me.dLuong = 0;
        me.dThue = 0;
        if (data.length > 0) {
            me.dLuong = edu.util.returnZero(data[0].TONGLUONG_THUNHAPKHAC);
            me.dThue = edu.util.returnZero(data[0].TONGTHUE_TNCN);
        }
        console.log(1111);
        if (me.dLuong > 0 || me.dThue > 0) {
            $("#zoneLuong").html('<h2>Tổng lương và thu nhập khác: <span class="color-active">' + edu.util.formatCurrency(me.dLuong) + '</span> - Tổng thuế TNCN:<span class="color-warning">' + edu.util.formatCurrency(me.dThue) + '</span> </h2>');
        } else {
            $("#zoneLuong").html('');
        }
        /*III. Callback*/
    },
    editForm_NhanSu_DuocNhanKhac: function (data) {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit_NhanSu_LuongDuocNhanKhac");
        //view data --Edit
        edu.util.viewValById("dropNS_LoaiKhoan", data.LOAIKHOAN_ID);
        edu.util.viewValById("txtNS_SoTien", data.SOTIEN);
        edu.util.viewValById("txtNS_ThueThuNhap", data.THUETNCN);
        edu.util.viewValById("txtNS_ChungTu", data.CHUNGTU);
        edu.util.viewValById("txtNS_Ngay", data.NGAYPHATSINH);
        edu.util.viewValById("txtNS_NoiDung", data.MOTA);
        me.strNhanSu_Id = data.NHANSU_HOSOCANBO_ID;
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
            renderPlace: ["dropSearch_DonViThanhVien_DuocNhanKhac"],
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_DuocNhanKhac"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': -1
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
            renderPlace: ["dropSearch_ThanhVien_DuocNhanKhac"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },

    viewForm_NhanSu: function (data) {
        var me = main_doc.LuongDuocNhanKhac;
        edu.util.viewHTMLById("lblCanBo", data.NHANSU_HOSOCANBO_HODEM + " " + data.NHANSU_HOSOCANBO_TEN);
        edu.util.viewHTMLById("lblMaCanBo", data.NHANSU_HOSOCANBO_MASO);
    },
    /*------------------------------------------
    --Discription: 
    --ULR: Modules
    -------------------------------------------*/
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
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
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td><input class='form-control inputsotien' id='txtSoTien_" + strNhanSu_Id + "' value='" + edu.util.getValById("txtSoTien") + "'/></td>";
        html += "<td><input class='form-control inputsotien' id='txtThueThuNhap_" + strNhanSu_Id + "' value='" + edu.util.getValById("txtThueThuNhap") + "'/></td>";
        html += "<td><input class='form-control inputsotien' id='txtNoiDung_" + strNhanSu_Id + "' value='" + edu.util.getValById("txtNoiDung") + "'/></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_GiangVien tbody").append(html);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_GiangVien tbody").html("");
            $("#tblInput_GiangVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    show_TongTien: function (strTableId) {
        var dTong = 0;
        var x = $("#" + strTableId + " td .inputsotien");
        for (var i = 0; i < x.length; i++) {
            dTong += parseInt($(x[i]).val().replace(/,/g, ""));
        }
        $("#txtTongTien").html(edu.util.formatCurrency(dTong));
    },

    genModal_NhanSu: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm nhân sự</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_NS" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_LoaiCCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn loại cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_CCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_CB_NS" class="select-opt" style="width:100% !important">';
        html += '<option value="0">Cán bộ trong trường</option>';
        html += '<option value="1">Cán bộ ngoài trường</option>';
        html += '<option value="-1">Tất cả nhân sự</option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalNhanSu"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';

        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonNhanSu" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_NhanSu" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-center">CMND</th>';
        html += '<th class="td-center">Mã số thuế</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_ModalNhanSu"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_nhansu").html("");
        $("#modal_nhansu").append(html);
        $("#modal_nhansu").modal("show");
        //setTimeout(function () {
        //    $("#txtSearchModal_TuKhoa_NS").focus();
        //}, 50);
        //$("#txtSearchModal_TuKhoa_NS").focus();
        $("#txtSearchModal_TuKhoa_NS").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_NhanSu("SEARCH");
            }
        });
        $("#btnSearch_ModalNhanSu").click(function () {
            me.getList_NhanSu("SEARCH");
        });
        edu.extend.getList_CoCauToChuc();
        $(".select-opt").select2();
        $("#dropSearchModal_LoaiCCTC_NS").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, edu.extend.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", edu.extend.genCombo_CCTC_Childs);
            }
            else {
                edu.extend.genCombo_CCTC_Childs(edu.extend.dtCCTC_Childs);
            }
        });
        $("#modal_nhansu").delegate("#chkSelectAll_ModalNhanSu", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_NhanSu" });
        });
        $("#modal_nhansu").delegate("#btnChonNhanSu", "click", function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_NhanSu", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_NhanSu #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
    },
    getList_NhanSu: function () {
        var me = this;
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearchModal_TuKhoa_NS"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: edu.util.getValById("dropSearchModal_CCTC_NS"),
            strTinhTrangNhanSu_Id: "",
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: edu.util.getValById("dropSearchModal_CB_NS")
        };
        edu.system.getList_NhanSu(obj, "", "", me.cbGetListModal_NhanSu);
    },
    cbGetListModal_NhanSu: function (data, iPager) {
        var me = main_doc.LuongDuocNhanKhac;
        me.dtNhanSuView = data;
        var jsonForm = {
            strTable_Id: "tblModal_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.LuongDuocNhanKhac.getList_NhanSu('SEARCH')",
                iDataRow: iPager,
            },
            colPos: {
                left: [2],
                fix: [0],
                right: [],
                center: [0, 1, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(aData.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_ChucDanh = "";
                        var strNhanSu_Ma = edu.util.returnEmpty(aData.MASO);
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HOTEN);
                        var strNhanSu_HocHam = edu.util.returnEmpty(aData.LOAICHUCDANH_MA);
                        var strNhanSu_HocVi = edu.util.returnEmpty(aData.LOAIHOCVI_MA);
                        //2. process data
                        if (!edu.util.checkValue(strNhanSu_HocHam)) {
                            strNhanSu_ChucDanh = "";
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_HocHam + ".";
                        }
                        if (!edu.util.checkValue(strNhanSu_HocVi)) {
                            //nothing
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_ChucDanh + strNhanSu_HocVi + ".";
                        }
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_ChucDanh + " " + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_ngaysinh' + aData.ID + '">' + edu.util.returnEmpty(aData.CANCUOC_SO) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_gioitinh' + aData.ID + '">' + edu.util.returnEmpty(aData.MASOTHUE) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },

    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    getList_LuongThuNhap: function () {
        var me = this;
        //--Edit
        var obj_list = {

            'action': 'L_KetQuaLuong/LayDanhSach',
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien_DuocNhanKhac'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien_DuocNhanKhac'),
            'dThang': edu.util.checkValue(edu.util.getValById('txtSearch_Thang')) ? edu.util.getValById('txtSearch_Thang') : -1,
            'dNam': edu.util.checkValue(edu.util.getValById('txtSearch_Nam')) ? edu.util.getValById('txtSearch_Nam') : -1,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    //me.dtNhanSu = data.Data;
                    me.genTable_LuongThuNhap(data.Data, data.Pager);

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
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    genTable_LuongThuNhap: function (data, iPager) {
        var me = this;
        $("#lblHSLL_LuongThuNhap_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLuongThuNhap",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 4, 6, 10, 11],
                right: [8, 9]
            },
            aoColumns: [
                {
                    "mDataProp": "NAM"
                },
                {
                    "mDataProp": "THANG"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mData": "NGUOICUOI_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                    }
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASOTHUE"
                },
                {
                    "mDataProp": "CHUNGTU"
                },
                {
                    "mData": "LOAIKHOAN_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mData": "THUETNCN",

                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.THUETNCN);
                    }
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "NGAYPHATSINH"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(jsonForm.strTable_Id, [8, 9]);
        if (data.length > 0) {
            me.dLuong += edu.util.returnZero(data[0].TONGLUONG_THUNHAPKHAC);
            me.dThue += edu.util.returnZero(data[0].TONGTHUE_TNCN);
        }
        console.log(2222);
        if (me.dLuong > 0 || me.dThue > 0) {
            $("#zoneLuong").html('<h2>Tổng lương và thu nhập khác: <span class="color-active">' + edu.util.formatCurrency(me.dLuong) + '</span> - Tổng thuế TNCN:<span class="color-warning">' + edu.util.formatCurrency(me.dThue) + '</span> </h2>');
        } else {
            $("#zoneLuong").html('');
        }
        /*III. Callback*/
    },
}