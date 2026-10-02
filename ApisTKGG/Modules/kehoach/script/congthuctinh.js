/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function CongThucTinh() { };
CongThucTinh.prototype = {
    dtCongThucTinh: [],
    strCongThucTinh_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ThoiGianDaoTao();
        me.getList_ThoiGianSe();
        me.getList_CongThucTinh();
        me.getList_ThongTinTuKhoa();
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAIXACNHAN", "dropPhamViApDung");
        $('#dropSearch_ThoiGian').on('select2:select', function () {
            me.getList_CongThucTinh();
        });
        $('#dropPhamViApDung').on('select2:select', function () {
            me.getList_LoaiApDung();
        });

        $("#btnSearch").click(function (e) {
            me.getList_CongThucTinh();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_CongThucTinh();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnAddCongThucTinh").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_CongThucTinh").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_CongThucTinh();
            }
        });
        $("#btnXoaCongThucTinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCongThucTinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CongThucTinh(arrChecked_Id[i]);
                }
            });
        });
        

        $("#tblCongThucTinh").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblCongThucTinh");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtCongThucTinh, "ID")[0];
                me.viewEdit_CongThucTinh(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtCongThucTinh_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        
        //var dHN = new Date(Date.now());
        //JOB_TUDONG.forEach(aData => {
        //    let bCall = false;
        //    switch (aData.PHANLOAI) {
        //        case "HANGNGAY": {
        //            bCall = true;
        //        }; break;
        //        case "DAUTUAN": {
        //            if (dHN.getDay() == 1) bCall = true;
        //        }; break;
        //        case "CUOITUAN": {
        //            if (dHN.getDay() == 0) bCall = true;
        //        }; break;
        //        case "HANGTHANG_DAUTHANG": {
        //            if (dHN.getDate() == 1) bCall = true;
        //        }; break;
        //        case "HANGTHANG_CUOITHANG": {
        //            if (dHN.getDate() == Date(dHN.getFullYear(), dHN.getMonth() + 1, 0).getDate()) bCall = true;
        //        }; break;
        //    }
        //    if(bCall) PKG_JOB_TUDONG.JOB_TUDONG(aData.ID, "", "");
        //})
        

        $("#tblThongTinTuKhoa").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtThongTinTuKhoa.find(e => e.ID == strId);
            edu.util.viewValById("txtTuKhoa_ThongTinTuKhoa", data.TUKHOA);
            edu.util.viewValById("txtTenTuKhoa_ThongTinTuKhoa", data.TENTUKHOA);
            edu.util.viewValById("txtMoTa_ThongTinTuKhoa", data.MOTA);
            edu.util.viewValById("txtTenGoi_ThongTinTuKhoa", data.TENPKG);
            edu.util.viewValById("txtTenPhuongThuc_ThongTinTuKhoa", data.TENFUNCTION);
            edu.util.viewValById("txtTenLienKet_ThongTinTuKhoa", data.TENDATABASELINK);
            edu.util.viewValById("txtKieuDuLieu_ThongTinTuKhoa", data.KIEUDULIEU);
            edu.util.viewValById("txtSoChuSoLamTron_ThongTinTuKhoa", data.SOCHUSOLAMTRON);
            me["strThongTinTuKhoa_Id"] = data.ID;
            $("#myModalThongTinTuKhoa").modal("show");
        });
        $("#tblThongTinTuKhoa").delegate(".btnThamSo", "click", function () {
            var strId = this.id;
            var data = me.dtThongTinTuKhoa.find(e => e.ID == strId);
            me["strThongTinTuKhoa_Id"] = strId;
            me.getList_ThamSoDieuKien();
            $("#myModalThamSoChiTiet").modal("show");
        });
        $("#btnAdd_ThongTinTuKhoa").click(function () {
            var data = {};
            edu.util.viewValById("txtTuKhoa_ThongTinTuKhoa", data.TUKHOA);
            edu.util.viewValById("txtTenTuKhoa_ThongTinTuKhoa", data.TENTUKHOA);
            edu.util.viewValById("txtMoTa_ThongTinTuKhoa", data.MOTA);
            edu.util.viewValById("txtTenGoi_ThongTinTuKhoa", data.TENPKG);
            edu.util.viewValById("txtTenPhuongThuc_ThongTinTuKhoa", data.TENFUNCTION);
            edu.util.viewValById("txtTenLienKet_ThongTinTuKhoa", data.TENDATABASELINK);
            edu.util.viewValById("txtKieuDuLieu_ThongTinTuKhoa", data.KIEUDULIEU);
            edu.util.viewValById("txtSoChuSoLamTron_ThongTinTuKhoa", data.SOCHUSOLAMTRON);
            me["strThongTinTuKhoa_Id"] = data.ID;
            $("#myModalThongTinTuKhoa").modal("show");
        });
        $("#btnSave_ThongTinTuKhoa").click(function () {
            me.save_ThongTinTuKhoa();
        });
        $("#btnDelete_ThongTinTuKhoa").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThongTinTuKhoa", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThongTinTuKhoa(arrChecked_Id[i]);
                }
            });
        });
        
        $("#tblThamSoChiTiet").delegate(".btnEditDieuKien", "click", function () {
            var strId = this.id;
            var data = me.dtThamSoDieuKien.find(e => e.ID == strId);
            edu.util.viewValById("txtTenThamSo_ChiTiet", data.TENTHAMSO);
            edu.util.viewValById("txtGiaTriMacDinh_ChiTiet", data.GIATRIMACDINH);
            edu.util.viewValById("txtPhanLoai_ChiTiet", data.PHANLOAI);
            edu.util.viewValById("txtMoTa_ChiTiet", data.MOTA);
            edu.util.viewValById("txtThuTu_ChiTiet", data.THUTU);
            me["strThamSoDieuKien_Id"] = data.ID;
            $("#myModalTSChiTiet").modal("show");
        });
        $("#btnAdd_ThamSoDieuKien").click(function () {
            var data = {};
            edu.util.viewValById("txtTenThamSo_ChiTiet", data.TENTHAMSO);
            edu.util.viewValById("txtGiaTriMacDinh_ChiTiet", data.GIATRIMACDINH);
            edu.util.viewValById("txtPhanLoai_ChiTiet", data.PHANLOAI);
            edu.util.viewValById("txtMoTa_ChiTiet", data.MOTA);
            edu.util.viewValById("txtThuTu_ChiTiet", data.THUTU);
            me["strThamSoDieuKien_Id"] = data.ID;
            $("#myModalTSChiTiet").modal("show");
        });
        $("#btnSave_ThamSoDieuKien").click(function () {
            me.save_ThamSoDieuKien();
        });
        $("#btnDelete_ThamSoDieuKien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThamSoChiTiet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThamSoDieuKien(arrChecked_Id[i]);
                }
            });
        });


        $("#btnAdd_TheoLopHocPhan").click(function () {
            var data = {};
            edu.util.viewValById("dropPhamViApDungLHP", data.PHAMVIAPDUNG_ID);
            edu.util.viewValById("dropThoiGianLHP", data.THOIGIAN_ID);
            edu.util.viewValById("txtXauCongThucLHP", data.XAUCONGTHUC);
            $("#myModalCongThucTinhLHP").modal("show");
        });
        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            me.getList_HocPhan();
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {
            me.getList_LopHocPhanAdd();
            me.getList_HocPhan();
        });
        $('#dropSearch_HocPhanAdd').on('select2:select', function (e) {
            me.getList_LopHocPhanAdd();
        });
        $("#btnSearchAdd").click(function (e) {
            me.getList_LopHocPhanAdd();
        });
        $("#btnSave_CongThucTinhLHP").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanAdd", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            arrChecked_Id.forEach(e => me.save_CongThucTinhLHP(e));
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        var data = {};
        edu.util.viewValById("dropPhamViApDung", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropThoiGian", data.THOIGIAN_ID);
        edu.util.viewValById("txtXauCongThuc", data.XAUCONGTHUC);
        edu.util.viewHTMLById("txtXauCongThuc", data.XAUCONGTHUC);
        edu.util.viewHTMLById("lblPhamViAP", data.PHAMVIAPDUNG_TEN);
        edu.util.viewHTMLById("lblLoaiApDung", data.PHAMVIAPDUNG_TEN);
        edu.util.viewHTMLById("lblThoiGianApDung", data.THOIGIAN);
        me.strCongThucTinh_Id = data.ID;
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_CongThucTinh();
    },
    toggle_edit: function () {
        //edu.util.toggle_overide("zone-bus", "zoneEdit");
        $("#myModalCongThucTinh").modal("show");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_CongThucTinh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgIuLyYVKTQiHgAxBTQvJgPP',
            'func': 'pkg_klgv_v2_thongtin.LayDSKLGD_CongThuc_ApDung',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtCongThucTinh = dtReRult;
                    me.genTable_CongThucTinh(dtReRult, data.Pager);
                    //me.cbGenCombo_CongThucTinh(dtReRult)
                }
                else {
                    edu.system.alert( data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_CongThucTinh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP',
            'func': 'pkg_klgv_v2_thongtin.Them_KLGD_CongThuc_ApDung',
            'iM': edu.system.iM,
            'strId': me.strCongThucTinh_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropThoiGian'),
            'strXauCongThuc': edu.system.getValById('txtXauCongThuc'),
            'strPhamViDung_Id': edu.system.getValById('dropLoaiApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_ThongTin_MH/EjQgHgoNBgUeAi4vJhUpNCIeADEFNC8m';
            obj_save.func = 'pkg_klgv_v2_thongtin.Sua_KLGD_CongThuc_ApDung';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strCongThucTinh_Id = "";
                    
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strCongThucTinh_Id = data.Id;
                        //setTimeout(function () {
                        //    me.strCongThucTinh_Id = strCongThucTinh_Id;
                        //    me.getList_ThanhVien();
                        //    me.getList_HocPhan();
                        //    $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
                        //    $(".btnOpenDelete").show();
                        //    $(".zoneOpenNew").hide();
                        //}, 2000);
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strCongThucTinh_Id = obj_save.strId
                    }
                    //$("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                    //    var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                    //    if ($(this).attr("name") == "new"){
                    //        me.save_SinhVien(strNhanSu_Id, strCongThucTinh_Id);
                    //    }
                    //});
                    //$("#tblInputDanhSachNhanSu tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strCongThucTinh_Id);
                    //});

                    //for (var i = 0; i < me.arrKhoa.length; i++) {
                    //    me.save_Khoa(strCongThucTinh_Id, me.arrKhoa[i]);
                    //}
                    //for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                    //    me.save_ChuongTrinh(strCongThucTinh_Id, me.arrChuongTrinh[i]);
                    //}
                    //for (var i = 0; i < me.arrLop.length; i++) {
                    //    me.save_Lop(strCongThucTinh_Id, me.arrLop[i]);
                    //}
                    //$("#tblInputHocPhan tbody tr[class=addHocPhan]").each(function () {
                    //    me.save_HocPhan(this.id, strCongThucTinh_Id);
                    //});
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_CongThucTinh();
            },
            error: function (er) {
                edu.system.alert(" " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CongThucTinh: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeAi4vJhUpNCIeADEFNC8m',
            'func': 'pkg_klgv_v2_thongtin.Xoa_KLGD_CongThuc_ApDung',
            'iM': edu.system.iM,

            'strId': strId,
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
                    me.getList_CongThucTinh();
                }
                else {
                    obj = {
                        content: " " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: JSON.stringify(er),
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

    save_CongThucTinhLHP: function (strPhamViDung_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP',
            'func': 'PKG_KLGV_V2_THONGTIN.Them_KLGD_CongThuc_ApDung',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropThoiGianLHP'),
            'strXauCongThuc': edu.system.getValById('txtXauCongThucLHP'),
            'strPhamViDung_Id': strPhamViDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strCongThucTinh_Id = "";

                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strCongThucTinh_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strCongThucTinh_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(" " + JSON.stringify(er), "w");

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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_CongThucTinh: function (data, iPager) {
        var me = this;
        $("#lblCongThucTinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCongThucTinh",

            bPaginate: {
                strFuntionName: "main_doc.CongThucTinh.getList_CongThucTinh()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "XAUCONGTHUC"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
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
    
    viewEdit_CongThucTinh: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropPhamViApDung", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropThoiGian", data.THOIGIAN_ID);
        edu.util.viewValById("txtXauCongThuc", data.XAUCONGTHUC);
        edu.util.viewHTMLById("txtXauCongThuc", data.XAUCONGTHUC);
        edu.util.viewHTMLById("lblPhamViAP", data.PHAMVIAPDUNG_TEN);
        edu.util.viewHTMLById("lblLoaiApDung", data.PHAMVIAPDUNG_TEN);
        edu.util.viewHTMLById("lblThoiGianApDung", data.THOIGIAN);
        me.strCongThucTinh_Id = data.ID;
        
    },
    
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGian", "dropSearch_ThoiGianDaoTao", "dropThoiGianLHP"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGianSe: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4BRIVKS4oBiggLwopICgCLi8mFSk0IgPP',
            'func': 'pkg_klgv_v2_thongtin.LayDSThoiGianKhaiCongThuc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ThoiGianSe(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_LoaiApDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_XacNhan_MH/DSA4BRINLiAoGSAiDykgLx4JIC8pBS4vJgPP',
            'func': 'pkg_klgv_v2_xacnhan.LayDSLoaiXacNhan_HanhDong',
            'iM': edu.system.iM,
            'strLoaiXacNhan_Id': edu.util.getValById('dropPhamViApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_LoaiApDung(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_ThoiGianSe: function (data) {
        var me = main_doc.CongThucTinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },

    cbGenCombo_LoaiApDung: function (data) {
        var me = main_doc.CongThucTinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLoaiApDung"],
            type: "",
            title: "Chọn loại",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    save_ThongTinTuKhoa: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHhU0CikuIAPP',
            'func': 'pkg_klgv_v2_thongtin.Them_KLGD_TuKhoa',
            'iM': edu.system.iM,
            'strId': me.strThongTinTuKhoa_Id,
            'strTuKhoa': edu.system.getValById('txtTuKhoa_ThongTinTuKhoa'),
            'strTenFunction': edu.system.getValById('txtTenPhuongThuc_ThongTinTuKhoa'),
            'strTenPKG': edu.system.getValById('txtTenGoi_ThongTinTuKhoa'),
            'strTenDataBaseLink': edu.system.getValById('txtTenLienKet_ThongTinTuKhoa'),
            'strTenTuKhoa': edu.system.getValById('txtTenTuKhoa_ThongTinTuKhoa'),
            'strMoTa': edu.system.getValById('txtMoTa_ThongTinTuKhoa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_ThongTin_MH/EjQgHgoNBgUeFTQKKS4g';
            obj_save.func = 'pkg_klgv_v2_thongtin.Sua_KLGD_TuKhoa'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ThongTinTuKhoa();
                }
                else {
                    $("#myModalThongTinTuKhoa #notify").html(data.Message)
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThongTinTuKhoa: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHhU0CikuIAPP',
            'func': 'pkg_klgv_v2_thongtin.LayDSKLGD_TuKhoa',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThongTinTuKhoa"] = dtReRult;
                    me.genTable_ThongTinTuKhoa(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_ThongTinTuKhoa: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeFTQKKS4g',
            'func': 'pkg_klgv_v2_thongtin.Xoa_KLGD_TuKhoa',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThongTinTuKhoa();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThongTinTuKhoa: function (data, iPager) {
        $("#lblThongTinTuKhoa_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThongTinTuKhoa",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.ThongTinTuKhoa.getList_ThongTinTuKhoa()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "TUKHOA"
                },
                {
                    "mDataProp": "TENTUKHOA"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "TENPKG"
                },
                {
                    "mDataProp": "TENFUNCTION"
                },
                {
                    "mDataProp": "TENDATABASELINK"
                },
                //{
                //    "mDataProp": "KIEUDULIEU"
                //},
                //{
                //    "mDataProp": "SOCHUSOLAMTRON"
                //},
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-outline-primary btnThamSo" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-outline-primary btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        /*III. Callback*/
    },
    


    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    
    save_ThamSoDieuKien: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHhU0CikuIB4VKSAsEi4P',
            'func': 'pkg_klgv_v2_thongtin.Them_KLGD_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strId': me.strThamSoDieuKien_Id,
            'strTenThamSo': edu.system.getValById('txtTenThamSo_ChiTiet'),
            'strGiaTriMacDinh': edu.system.getValById('txtGiaTriMacDinh_ChiTiet'),
            'strKLGD_TuKhoa_Id': me.strThongTinTuKhoa_Id,
            'strPhanLoai': edu.system.getValById('txtPhanLoai_ChiTiet'),
            'dThuTu': edu.system.getValById('txtThuTu_ChiTiet'),
            'strMoTa': edu.system.getValById('txtMoTa_ChiTiet'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_ThongTin_MH/EjQgHgoNBgUeFTQKKS4gHhUpICwSLgPP';
            obj_save.func = 'pkg_klgv_v2_thongtin.Sua_KLGD_TuKhoa_ThamSo'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ThamSoDieuKien();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThamSoDieuKien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHhU0CikuIB4VKSAsEi4P',
            'func': 'pkg_klgv_v2_thongtin.LayDSKLGD_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strKLGD_TuKhoa_Id': me.strThongTinTuKhoa_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThamSoDieuKien"] = dtReRult;
                    me.genTable_ThamSoDieuKien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_ThamSoDieuKien: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeFTQKKS4gHhUpICwSLgPP',
            'func': 'pkg_klgv_v2_thongtin.Xoa_KLGD_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThamSoDieuKien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThamSoDieuKien: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblThamSoChiTiet",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.ThamSoDieuKien.getList_ThamSoDieuKien()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "TENTHAMSO"
                },
                {
                    "mDataProp": "GIATRIMACDINH"
                },
                {
                    "mDataProp": "PHANLOAI"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "THUTU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEditDieuKien" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        /*III. Callback*/
    },
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSKhoaToChuc',
            'type': 'GET',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KhoaDaoTao(dtReRult);
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
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(dtReRult);
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
    getList_LopQuanLy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(dtReRult);
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
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
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
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TinhTrangQuanSo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSHocPhan',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
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
                    me.cbGenCombo_HocPhan(dtResult, iPager);
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
    cbGenCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhanAdd"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LopHocPhanAdd: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_ThongTin/LayDSLopHocPhan',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhanAdd'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,


            'strDangKy_KeHoachDangKy_Id': '',
            'dLocGanTheoCTDT': 0,
            'dChiLayCacLopChuaPhanCong': 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': -1,
            'dSoDaDangDenSo': -1,
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
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
                    me.dtLopHocPhanAdd = dtResult;
                    me.genTable_LopHocPhanAdd(dtResult, iPager);
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
    genTable_LopHocPhanAdd: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLopHocPhanAdd",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhanAdd()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}