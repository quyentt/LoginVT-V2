/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 06/07/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DanhSachTrungTuyen() { };
DanhSachTrungTuyen.prototype = {
    dtNguoiHoc: [],
    dtNguoiHoc_Edit:[],
    strNguoiHoc_Id: '',
    strLopQuanLy_Id: '',
    dtChinhSuaTT: [],
    objChinhSuaTT_Select: [],
    objHtml:{},

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local (0-chua nhap, 1- da nhap, -1 toan bo)
        -------------------------------------------*/
        edu.extend.getList_NguoiHoc_TTTS(-1, "", "", me.cbGenTable_NguoiHoc_TTTS);
        me.objParam_KH = {
            strKhoaDaoTao_Id: "",
            strMHNhapHoc_Id: "",
            strMHApDungPhieuThu_Id: "",
            strHeThongThu_Id: "",
            strMHApDungPhieuRut_Id: "",
            strHeThongRut_Id: "",
            strTuKhoa: ""
        };
        edu.extend.getList_KeHoachNhapHoc(me.objParam_KH, me.cbGenCombo_KeHoachNhapHoc);
        me.showHide_Box("zone-bus", "zone_list_trungtuyen");
        me.dtChinhSuaTT = me.structureData_NguoiHoc_TTTS();
        $('#zone_input_freeze').slimScroll({
            position: 'right',
            height: "300px",
            railVisible: true,
            alwaysVisible: false
        });
        $('#zone_input_gen').slimScroll({
            position: 'right',
            height: "300px",
            railVisible: true,
            alwaysVisible: false
        });
        me.objHtml = {
            table_id: "tblDSTrungTuyen",
            prefix_id: "delete_tt",
            regexp: /delete_tt/g,
            chkOne: "chkSelectOne_TT",
        }
        /*------------------------------------------
        --Discription: [1] Action TrungTuyen
        -------------------------------------------*/
        $(".btnClose_CSTT").click(function () {
            me.showHide_Box("zone-bus", "zone_list_trungtuyen");
        });
        $("#tblDSTrungTuyen").delegate(".btnDetail_NguoiHoc_TT", "click", function () {
            var strNguoiHoc_Id = this.id;
            me.reset_NguoiHoc_TTTS();
            if (edu.util.checkValue(strNguoiHoc_Id)) {
                me.strNguoiHoc_Id = edu.util.cutPrefixId(/detail_dstt/g, strNguoiHoc_Id);
                return new Promise(function (resolve, reject) {
                    me.getDetail_NguoiHoc_TTTS(me.strNguoiHoc_Id, me.dtNguoiHoc, resolve, reject);
                    
                }).then(function (data) {

                    me.showHide_Box("zone-bus", "zone_input_chitiet_trungtuyen");
                    me.genDetail_NguoiHoc_TTTS(data);
                });
            }
        });
        $("#tblDSTrungTuyen").delegate(".btnEdit_NguoiHoc_TT", "click", function () {
            var id = this.id;
            $("#zone_input_gen").html("");
            if (edu.util.checkValue(id)) {
                var strNguoiHoc_Id = edu.util.cutPrefixId(/edit_dstt/g, id);
                me.strNguoiHoc_Id = strNguoiHoc_Id;
                return new Promise(function (resolve, reject) {
                    me.getDetail_NguoiHoc_TTTS(me.strNguoiHoc_Id, me.dtNguoiHoc, resolve, reject);

                }).then(function (data) {
                    me.dtNguoiHoc_Edit = data;
                    me.showHide_Box("zone-bus", "zone_input_edit_trungtuyen");
                    edu.util.viewHTMLById("lblNguoiHoc_HoTen", data.HODEM + " " + data.TEN)
                    //testing....
                    me.getList_ChinhSuaThongTin(me.dtChinhSuaTT);

                    if (me.objChinhSuaTT_Select.length > 0) {
                        for (var i = 0; i < me.objChinhSuaTT_Select.length; i++) {
                            me.genForm_ChinhSuaThongTin(me.objChinhSuaTT_Select[i]);
                            
                        }
                    }
                });                
            }
        });
        $("#btnUpdate_CSTT").click(function () {
            return new Promise(function (resolve, reject) {
                me.process_Update_NguoiHoc_TTTS(me.dtNguoiHoc_Edit, resolve, reject);
            }).then(function (obj) {
                me.update_NguoiHoc_TTTS(obj);
            });            
        });
        $("#btnDelete_TT").click(function () {
            var id = this.id;
            
            var select_ids = edu.util.getCheckedIds(me.objHtml);
            if (edu.util.checkValue(select_ids)) {
                edu.system.confirm("Bạn có muốn xóa dữ liệu không?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $("#myModalAlert").delegate("#btnYes", "click", function (e) {
                me.delete_NguoiHoc_TT(select_ids);
            });
            return false;
        });
        $("#btnAddnew_TT").click(function () {
            me.strNguoiHoc_Id = "";
            me.showHide_Box("zone-bus", "zone_input_addnew_trungtuyen");
        });
        $("#btnSave_TT").click(function () {
            me.process_Save_NguoiHoc_TTTS();
        });
        $("#btnRewrite_TT").click(function () {
            me.rewrite_NguoiHoc();
        });
        $("#btnRefresh_TT").click(function () {
            var strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_DSTT");
            var strTuKhoa = edu.util.getValById("txtSearch_DSTrungTuyen");
            edu.extend.getList_NguoiHoc_TTTS(-1, strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $('#dropKeHoachNhapHoc_DSTT').on('select2:select', function () {
            var strId = $(this).find('option:selected').val();
            var strTuKhoa = edu.util.getValById("txtSearch_DSTrungTuyen");
            var strKeHoach_Id = "";
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                strKeHoach_Id = strId;
            }
            //neu khong chon ke hoach thi lay DMC theo user
            else {
                strKeHoach_Id = edu.system.userId;
            }
            edu.extend.getList_NguoiHoc_TTTS(-1, strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $("#txtSearch_DSTrungTuyen").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var strTuKhoa = edu.util.getValById("txtSearch_DSTrungTuyen");
                var strId = edu.util.getValById("dropKeHoachNhapHoc_DSTT");
                var strKeHoach_Id = "";
                //neu chon ke hoach thi lay DMC theo ke hoach
                if (edu.util.checkValue(strId)) {
                    strKeHoach_Id = strId;
                }
                //neu khong chon ke hoach thi lay DMC theo user
                else {
                    strKeHoach_Id = edu.system.userId;
                }
                edu.extend.getList_NguoiHoc_TTTS(-1, strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
            }
        });
        $("#btnSearch_DSTrungTuyen").click(function () {
            var strTuKhoa = edu.util.getValById("txtSearch_DSTrungTuyen");
            var strId = edu.util.getValById("dropKeHoachNhapHoc_DSTT");
            var strKeHoach_Id = "";
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                strKeHoach_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                strKeHoach_Id = edu.system.userId;
            }
            edu.extend.getList_NguoiHoc_TTTS(-1, strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        //effect
        $("#tblDSTrungTuyen").delegate(".chkSelectOne_TT", "click", function () {
            edu.util.checkedOne_BgRow(this, me.objHtml);
        });
        $("[id$=chkSelectAll_TT]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.objHtml);
        });
        /*------------------------------------------
        --Discription: Action ThongTinChinhSua 
        -------------------------------------------*/
        $("#zone_input_freeze").delegate(".btnSelect_chinhsuatt", "click", function () {
            var id = this.id;
            if (edu.util.checkValue(id)) {
                id = edu.util.cutPrefixId(/select_chinhsuatt/g, id);

                if (!edu.util.objEqualVal(me.objChinhSuaTT_Select, "ID", id)) {//check id existance in obj
                    data = me.getDetail_ChinhSuaThongTin(id, me.dtChinhSuaTT);
                    me.push_objChinhSuaTT_Select(data);
                    me.genForm_ChinhSuaThongTin(data);
                }
                else {
                    edu.system.alert("Đã tồn tại!", "w");
                    return false;
                }
            }
        });
        $("#zone_input_gen").delegate(".btnRemove_Edit_TT", "click", function () {
            var id = this.id;
            if (edu.util.checkValue(id)) {
                id = edu.util.cutPrefixId(/remove_chinhsuatt/g, id);
                me.removeForm_ChinhSuaThongTin(id);
                edu.util.objExcludeVal(me.objChinhSuaTT_Select, "ID", id);
            }
        });
        $("#btnRewrite_CSTT").click(function () {
            me.reset_ChinhSuaThongTin();
        });
        /*------------------------------------------
        --Discription: Quick search
        -------------------------------------------*/
        $("#txtSearch_ChinhSuaTT").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tblChinhSuaTT tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
    },
    /*------------------------------------------
    --Discription: Common function
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    reset_NguoiHoc_TTTS: function () {
        var me = this;
        me.strNguoiHoc_Id = "";
        edu.util.viewHTMLById("lblHoTen_TrungTuyen");
        edu.util.viewHTMLById("lblGioiTinh_TrungTuyen");
        edu.util.viewHTMLById("lblSoBaoDanh_TrungTuyen");
        edu.util.viewHTMLById("lblNgaySinh_TrungTuyen");
        edu.util.viewHTMLById("lblDienThoai_TrungTuyen");
        edu.util.viewHTMLById("lblCMTND_TrungTuyen");
        edu.util.viewHTMLById("lblHoKhau_TrungTuyen");
        edu.util.viewHTMLById("lblMaSinhVien_TT");
        edu.util.viewHTMLById("lblDanToc_TrungTuyen");
        edu.util.viewHTMLById("lblTonGiao_TrungTuyen");
        edu.util.viewHTMLById("lblDoiTuongDuThi_TrungTuyen");
        edu.util.viewHTMLById("lblKhuVuc_TrungTuyen");
        edu.util.viewHTMLById("lblThanhPhanXuatThan_TrungTuyen");
        edu.util.viewHTMLById("lblPhanTramMienGiam_TrungTuyen"); 
        edu.util.viewHTMLById("lblMaNganh_TrungTuyen");
        edu.util.viewHTMLById("lblNganhHoc_TrungTuyen");
        edu.util.viewHTMLById("lblDiemXetDuyet_TrungTuyen");
        edu.util.viewHTMLById("lblTongDiem_TrungTuyen");
        edu.util.viewHTMLById("lblToHopThi_TrungTuyen");
        edu.util.viewHTMLById("lblTenMon1_TrungTuyen");
        edu.util.viewHTMLById("lblTenMon2_TrungTuyen");
        edu.util.viewHTMLById("lblTenMon3_TrungTuyen");
        edu.util.viewHTMLById("lblDiem1_TrungTuyen");
        edu.util.viewHTMLById("lblDiem2_TrungTuyen");
        edu.util.viewHTMLById("lblDiem3_TrungTuyen");       
        edu.util.viewHTMLById("lblNamTotNghiep_TrungTuyen");
        edu.util.viewHTMLById("lblXepLoai10_TrungTuyen");
        edu.util.viewHTMLById("lblXepLoai11_TrungTuyen");
        edu.util.viewHTMLById("lblXepLoai12_TrungTuyen");
        edu.util.viewHTMLById("lblHocLuc10_TrungTuyen");
        edu.util.viewHTMLById("lblHocLuc11_TrungTuyen");
        edu.util.viewHTMLById("lblHocLuc12_TrungTuyen");
        edu.util.viewHTMLById("lblHanhKiem10_TrungTuyen");
        edu.util.viewHTMLById("lblHanhKiem11_TrungTuyen");
        edu.util.viewHTMLById("lblHanhKiem12_TrungTuyen");
    },
    rewrite_NguoiHoc: function () {
        var me = this;
        me.strNguoiHoc_Id = "";
        edu.util.viewValById("txtSoBaoDanh_TT", "");
        edu.util.viewValById("txtHoDem_TT", "");
        edu.util.viewValById("txtMaSinhVien_TT", "");
        edu.util.viewValById("txtTen_TT", "");
        edu.util.viewValById("txtSoCMND_TT", "");
        edu.util.viewValById("txtNgaySinh_TT", "");
        edu.util.viewValById("txtGioiTinh_TT", "")
        edu.util.viewValById("txtDoiTuong_TT", "")
        edu.util.viewValById("txtKhuVuc_TT", "")
        edu.util.viewValById("txtTinhThanh_TT", "")
        edu.util.viewValById("txtQuanHuyen_TT", "");
        edu.util.viewValById("txtNamTotNghiep_TT", "");
        edu.util.viewValById("txtDiemXetDuyet_TT", "");
        edu.util.viewValById("txtToHop_TT", "");
        edu.util.viewValById("txtTenMon1_TT", "");
        edu.util.viewValById("txtTenMon2_TT", "");
        edu.util.viewValById("txtTenMon3_TT", "");
        edu.util.viewValById("txtDiemMon1_TT", "");
        edu.util.viewValById("txtDiemMon2_TT", "");
        edu.util.viewValById("txtDiemMon3_TT", "");
        edu.util.viewValById("txtDiemXetDuyet_TT", "");
        edu.util.viewValById("txtMaNganh_TT", "");
        edu.util.viewValById("txtNganhHoc_TT", "");
        edu.util.viewValById("txtHoKhau_TT", "");
        edu.util.viewValById("txtDienThoai_TT", "");
        edu.util.viewValById("txtGhiChu_TT", "");
        edu.util.viewValById("txtHocLuc10_TT", "");
        edu.util.viewValById("txtHocLuc11_TT", "");
        edu.util.viewValById("txtHocLuc12_TT", "");
        edu.util.viewValById("txtXepLoai10_TT", "");
        edu.util.viewValById("txtXepLoai11_TT", "");
        edu.util.viewValById("txtXepLoai12_TT", "");
        edu.util.viewValById("txtHanhKiem10_TT", "");
        edu.util.viewValById("txtHanhKiem11_TT", "");
        edu.util.viewValById("txtHanhKiem12_TT", "");
        edu.util.viewValById("txtPhanTramMienGiam_TT", "");
    },
    /*------------------------------------------
    --Discription: [1]Acess DB ==> NguoiHoc_TTTS Update or Save ==> same funtion
    -------------------------------------------*/
    update_NguoiHoc_TTTS: function (obj) {
        var me = this;
        var obj_save = {
            'action': 'NH_NguoiHoc_ThongTinTuyenSinh/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': obj.strId,
            'strTAICHINH_KeHoach_Id': obj.strTAICHINH_KeHoach_Id,
            'strSoBaoDanh': obj.strSoBaoDanh,
            'strMaLopDuKien': obj.strMaLopDuKien,
            'strMaSo': obj.strMaSo,
            'strHoDem': obj.strHoDem,
            'strTen': obj.strTen,
            'strCMTND_So': obj.strCMTND_So,
            'strNgaySinh': obj.strNgaySinh,
            'strGioiTinh_Id': obj.strGioiTinh_Id,
            'strDoiTuongDuThi_Id': obj.strDoiTuongDuThi_Id,
            'strKhuVuc_Id': obj.strKhuVuc_Id,
            'strHoKhau_TinhThanh_Id': obj.strHoKhau_TinhThanh_Id,
            'strHoKhau_QuanHuyen_Id': obj.strHoKhau_QuanHuyen_Id,
            'strNamTotNghiep': obj.strNamTotNghiep,
            'dDiemTS_TongDiemXetDuyet': obj.dDiemTS_TongDiemXetDuyet,
            'strToHocThi_Id': obj.strToHocThi_Id,
            'strTenTS_Mon1': obj.strTenTS_Mon1,
            'strTenTS_Mon2': obj.strTenTS_Mon2,
            'strTenTS_Mon3': obj.strTenTS_Mon3,
            'dDiemTS_Mon1': obj.dDiemTS_Mon1,
            'dDiemTS_Mon2': obj.dDiemTS_Mon2,
            'dDiemTS_Mon3': obj.dDiemTS_Mon3,
            'dDiemTS_TongDiem': obj.dDiemTS_TongDiem,
            'strNganhHoc_Id': obj.strNganhHoc_Id,
            'strNganhHoc_Ten': obj.strNganhHoc_Ten,
            'strHoKhau_PhuongXaKhoiXom': obj.strHoKhau_PhuongXaKhoiXom,
            'strSoDienThoaiCaNhan': obj.strSoDienThoaiCaNhan,
            'strGhichu': obj.strGhichu,
            'strKQCC_10_HocLuc': obj.strKQCC_10_HocLuc,
            'strKQCC_11_HocLuc': obj.strKQCC_11_HocLuc,
            'strKQCC_12_HocLuc': obj.strKQCC_12_HocLuc,
            'strKQCC_10_XepLoai': obj.strKQCC_10_XepLoai,
            'strKQCC_11_XepLoai': obj.strKQCC_11_XepLoai,
            'strKQCC_12_XepLoai': obj.strKQCC_12_XepLoai,
            'strKQCC_10_HanhKiem': obj.strKQCC_10_HanhKiem,
            'strKQCC_11_HanhKiem': obj.strKQCC_11_HanhKiem,
            'strKQCC_12_HanhKiem': obj.strKQCC_12_HanhKiem,
            'dPhanTramMienGiam': obj.dPhanTramMienGiam,
            'strNguoiThucHien_Id': obj.strNguoiThucHien_Id,
            'strDanToc_Id': obj.strDanToc_Id,
            'strTonGiao_Id': obj.strTonGiao_Id,
            'strThanhPhanXuatThan_Id': obj.strThanhPhanXuatThan_Id,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NH_NguoiHoc_ThongTinTuyenSinh/CapNhat';
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log("obj_save.strId: " + obj_save.strId);
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.ThemMoi: " + data.Message, "w");
                }
                edu.extend.getList_NguoiHoc_TTTS(-1, "", "", me.cbGenTable_NguoiHoc_TTTS);
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.ThemMoi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    process_Update_NguoiHoc_TTTS: function (data, resolve, reject) {
        var obj = {
            strId: "",
            strTAICHINH_KeHoach_Id: "",
            strSoBaoDanh: "",
            strMaLopDuKien: "",
            strMaSo: "",
            strHoDem: "",
            strTen: "",
            strCMTND_So: "",
            strNgaySinh: "",
            strGioiTinh_Id: "",
            strDoiTuongDuThi_Id: "",
            strKhuVuc_Id:"",
            strHoKhau_TinhThanh_Id: "",
            strHoKhau_QuanHuyen_Id: "",
            strNamTotNghiep: "",
            dDiemTS_TongDiemXetDuyet: 0,
            strToHocThi_Id: "",
            strTenTS_Mon1: "",
            strTenTS_Mon2: "",
            strTenTS_Mon3: "",
            dDiemTS_Mon1: 0,
            dDiemTS_Mon2: 0,
            dDiemTS_Mon3: 0,
            dDiemTS_TongDiem: 0,
            strNganhHoc_Id: "",
            strNganhHoc_Ten: "",
            strHoKhau_PhuongXaKhoiXom: "",
            strSoDienThoaiCaNhan: "",
            strGhichu: "",
            strKQCC_10_HocLuc:"",
            strKQCC_11_HocLuc: "",
            strKQCC_12_HocLuc: "",
            strKQCC_10_XepLoai: "",
            strKQCC_11_XepLoai: "",
            strKQCC_12_XepLoai: "",
            strKQCC_10_HanhKiem: "",
            strKQCC_11_HanhKiem: "",
            strKQCC_12_HanhKiem: "",
            dPhanTramMienGiam: 0,
            strDanToc_Id: "",
            strTonGiao_Id: "",
            strThanhPhanXuatThan_Id: "",
            strNguoiThucHien_Id: "",
        };
        //////////////////////////////// --  BIND DATA FROM DB and GET new Value -- //////////////////////////
        obj.strId = data.ID;
        obj.strTAICHINH_KeHoach_Id = edu.util.returnEmpty(data.TAICHINH_KEHOACHNHAPHOC_ID);

        var strSoBaoDanh = edu.util.getValById("txtSoBaoDanh");
        obj.strSoBaoDanh = (edu.util.checkValue(strSoBaoDanh) == true) ? strSoBaoDanh : edu.util.returnEmpty(data.SOBAODANH);

        var strMaLopDuKien = edu.util.getValById("txtMaLopDuKien");
        obj.strMaLopDuKien = (edu.util.checkValue(strMaLopDuKien) == true) ? strMaLopDuKien : edu.util.returnEmpty(data.MALOPDUKIEN);

        var strMaSo = edu.util.getValById("txtMaSinhVien");
        obj.strMaSo = (edu.util.checkValue(strMaSo) == true) ? strMaSo : edu.util.returnEmpty(data.MASO);

        var strHoDem = edu.util.getValById("txtHoDem");
        obj.strHoDem = (edu.util.checkValue(strHoDem) == true) ? strHoDem : edu.util.returnEmpty(data.HODEM);

        var strTen = edu.util.getValById("txtTen");
        obj.strTen = (edu.util.checkValue(strTen) == true) ? strTen : edu.util.returnEmpty(data.TEN);

        var strCMTND_So = edu.util.getValById("txtSoCMND");
        obj.strCMTND_So = (edu.util.checkValue(strCMTND_So) == true) ? strCMTND_So : edu.util.returnEmpty(data.CMTND_SO);

        var strNgaySinh = edu.util.getValById("txtNgaySinh");
        obj.strNgaySinh = (edu.util.checkValue(strNgaySinh) == true) ? strNgaySinh : edu.util.returnEmpty(data.NGAYSINH_NGAY + "/" + data.NGAYSINH_THANG + "/" + data.NGAYSINH_NAM);

        var strGioiTinh_Id = edu.util.getValById("txtGioiTinh");
        obj.strGioiTinh_Id = (edu.util.checkValue(strGioiTinh_Id) == true) ? strGioiTinh_Id : edu.util.returnEmpty(data.QLSV_GIOITINH_TEN);

        var strDoiTuongDuThi_Id = edu.util.getValById("txtDoiTuongDuThi");
        obj.strDoiTuongDuThi_Id = (edu.util.checkValue(strDoiTuongDuThi_Id) == true) ? strDoiTuongDuThi_Id : edu.util.returnEmpty(data.DOITUONGDUTHI_TEN);

        var strKhuVuc_Id = edu.util.getValById("txtKhuVuc");
        obj.strKhuVuc_Id = (edu.util.checkValue(strKhuVuc_Id) == true) ? strKhuVuc_Id : edu.util.returnEmpty(data.KHUVUC_TEN);

        var strHoKhau_TinhThanh_Id = edu.util.getValById("txtHoKhau_Tinh");
        obj.strHoKhau_TinhThanh_Id = (edu.util.checkValue(strHoKhau_TinhThanh_Id) == true) ? strHoKhau_TinhThanh_Id : edu.util.returnEmpty(data.HOKHAU_TINHTHANH_TEN);

        var strHoKhau_QuanHuyen_Id = edu.util.getValById("txtHoKhau_Huyen");
        obj.strHoKhau_QuanHuyen_Id = (edu.util.checkValue(strHoKhau_QuanHuyen_Id) == true) ? strHoKhau_QuanHuyen_Id : edu.util.returnEmpty(data.HOKHAU_QUANHUYEN_TEN);

        var strNamTotNghiep = edu.util.getValById("txtNamTotNghiep");
        obj.strNamTotNghiep = (edu.util.checkValue(strNamTotNghiep) == true) ? strNamTotNghiep : edu.util.returnEmpty(data.NAMTOTNGHIEP);

        var dDiemTS_TongDiemXetDuyet = edu.util.getValById("txtTongDiemXetDuyet");
        obj.dDiemTS_TongDiemXetDuyet = (edu.util.checkValue(dDiemTS_TongDiemXetDuyet) == true) ? dDiemTS_TongDiemXetDuyet : edu.util.returnEmpty(data.DIEMTS_TONGDIEMXETTUYEN);

        var strToHocThi_Id = edu.util.getValById("txtToHopThi");
        obj.strToHocThi_Id = (edu.util.checkValue(strToHocThi_Id) == true) ? strToHocThi_Id : edu.util.returnEmpty(data.TOHOPTHI_TEN);

        var strTenTS_Mon1 = edu.util.getValById("txtTenMon1");
        obj.strTenTS_Mon1 = (edu.util.checkValue(strTenTS_Mon1) == true) ? strTenTS_Mon1 : edu.util.returnEmpty(data.TENTS_MON1);

        var strTenTS_Mon2 = edu.util.getValById("txtTenMon2");
        obj.strTenTS_Mon2 = (edu.util.checkValue(strTenTS_Mon2) == true) ? strTenTS_Mon2 : edu.util.returnEmpty(data.TENTS_MON2);

        var strTenTS_Mon3 = edu.util.getValById("txtTenMon3");
        obj.strTenTS_Mon3 = (edu.util.checkValue(strTenTS_Mon3) == true) ? strTenTS_Mon3 : edu.util.returnEmpty(data.TENTS_MON3);

        var dDiemTS_Mon1 = edu.util.getValById("txtDiemMon1");
        obj.dDiemTS_Mon1 = (edu.util.checkValue(dDiemTS_Mon1) == true) ? dDiemTS_Mon1 : edu.util.returnEmpty(data.DIEMTS_MON1);

        var dDiemTS_Mon2 = edu.util.getValById("txtDiemMon2");
        obj.dDiemTS_Mon2 = (edu.util.checkValue(dDiemTS_Mon2) == true) ? dDiemTS_Mon2 : edu.util.returnEmpty(data.DIEMTS_MON2);

        var dDiemTS_Mon3 = edu.util.getValById("txtDiemMon3");
        obj.dDiemTS_Mon3 = (edu.util.checkValue(dDiemTS_Mon3) == true) ? dDiemTS_Mon3 : edu.util.returnEmpty(data.DIEMTS_MON3);

        var dDiemTS_TongDiem = edu.util.getValById("txtTongDiem");
        obj.dDiemTS_TongDiem = (edu.util.checkValue(dDiemTS_TongDiem) == true) ? dDiemTS_TongDiem : edu.util.returnEmpty(data.DIEMTS_TONGDIEM);

        var strNganhHoc_Id = edu.util.getValById("txtMaNganh");
        obj.strNganhHoc_Id = (edu.util.checkValue(strNganhHoc_Id) == true) ? strNganhHoc_Id : edu.util.returnEmpty(data.NGANHHOC_TEN);

        var strNganhHoc_Ten = edu.util.getValById("txtTenNganh");
        obj.strNganhHoc_Ten = (edu.util.checkValue(strNganhHoc_Ten) == true) ? strNganhHoc_Ten : edu.util.returnEmpty(data.NGANHHOC_TEN);

        var strHoKhau_PhuongXaKhoiXom = edu.util.getValById("txtHoKhau_PhuongXaKhoiXom");
        obj.strHoKhau_PhuongXaKhoiXom = (edu.util.checkValue(strHoKhau_PhuongXaKhoiXom) == true) ? strHoKhau_PhuongXaKhoiXom : edu.util.returnEmpty(data.HOKHAU_PHUONGXAKHOIXOM);

        var strSoDienThoaiCaNhan = edu.util.getValById("txtDienThoai");
        obj.strSoDienThoaiCaNhan = (edu.util.checkValue(strSoDienThoaiCaNhan) == true) ? strSoDienThoaiCaNhan : edu.util.returnEmpty(data.SODIENTHOAICANHAN);

        var strGhichu = edu.util.getValById("txtGhiChu");
        obj.strGhichu = (edu.util.checkValue(strGhichu) == true) ? strGhichu : edu.util.returnEmpty(data.GHICHU);

        var strKQCC_10_HocLuc = edu.util.getValById("txtHocLuc10");
        obj.strKQCC_10_HocLuc = (edu.util.checkValue(strKQCC_10_HocLuc) == true) ? strKQCC_10_HocLuc : edu.util.returnEmpty(data.KQCC_10_HOCLUC);

        var strKQCC_11_HocLuc = edu.util.getValById("txtHocLuc11");
        obj.strKQCC_11_HocLuc = (edu.util.checkValue(strKQCC_11_HocLuc) == true) ? strKQCC_11_HocLuc : edu.util.returnEmpty(data.KQCC_11_HOCLUC);

        var strKQCC_12_HocLuc = edu.util.getValById("txtHocLuc12");
        obj.strKQCC_12_HocLuc = (edu.util.checkValue(strKQCC_12_HocLuc) == true) ? strKQCC_12_HocLuc : edu.util.returnEmpty(data.KQCC_12_HOCLUC);

        var strKQCC_10_XepLoai = edu.util.getValById("txtXepLoai10");
        obj.strKQCC_10_XepLoai = (edu.util.checkValue(strKQCC_10_XepLoai) == true) ? strKQCC_10_XepLoai : edu.util.returnEmpty(data.KQCC_10_XEPLOAI);

        var strKQCC_11_XepLoai = edu.util.getValById("txtXepLoai11");
        obj.strKQCC_11_XepLoai = (edu.util.checkValue(strKQCC_11_XepLoai) == true) ? strKQCC_11_XepLoai : edu.util.returnEmpty(data.KQCC_11_XEPLOAI);

        var strKQCC_12_XepLoai = edu.util.getValById("txtXepLoai12");
        obj.strKQCC_12_XepLoai = (edu.util.checkValue(strKQCC_12_XepLoai) == true) ? strKQCC_12_XepLoai : edu.util.returnEmpty(data.KQCC_12_XEPLOAI);

        var strKQCC_10_HanhKiem = edu.util.getValById("txtHanhKiem10");
        obj.strKQCC_10_HanhKiem = (edu.util.checkValue(strKQCC_10_HanhKiem) == true) ? strKQCC_10_HanhKiem : edu.util.returnEmpty(data.KQCC_10_HANHKIEM);

        var strKQCC_11_HanhKiem = edu.util.getValById("txtHanhKiem11");
        obj.strKQCC_11_HanhKiem = (edu.util.checkValue(strKQCC_11_HanhKiem) == true) ? strKQCC_11_HanhKiem : edu.util.returnEmpty(data.KQCC_11_HANHKIEM);

        var strKQCC_12_HanhKiem = edu.util.getValById("txtHanhKiem12");
        obj.strKQCC_12_HanhKiem = (edu.util.checkValue(strKQCC_12_HanhKiem) == true) ? strKQCC_12_HanhKiem : edu.util.returnEmpty(data.KQCC_12_HANHKIEM);

        var dPhanTramMienGiam = edu.util.getValById("txtPhanTramMienGiam");
        obj.dPhanTramMienGiam = (edu.util.checkValue(dPhanTramMienGiam) == true) ? dPhanTramMienGiam : edu.util.returnEmpty(data.PHANTRAMMIENGIAM);

        var strDanToc_Id = edu.util.getValById("txtDanToc");
        obj.strDanToc_Id = (edu.util.checkValue(strDanToc_Id) == true) ? strDanToc_Id : edu.util.returnEmpty(data.DANTOC_TEN);

        var strTonGiao_Id = edu.util.getValById("txtTonGiao");
        obj.strTonGiao_Id = (edu.util.checkValue(strTonGiao_Id) == true) ? strTonGiao_Id : edu.util.returnEmpty(data.TONGIAO_TEN);

        var strThanhPhanXuatThan_Id = edu.util.getValById("txtThanhPhanXuatThan");
        obj.strThanhPhanXuatThan_Id = (edu.util.checkValue(strThanhPhanXuatThan_Id) == true) ? strThanhPhanXuatThan_Id : edu.util.returnEmpty(data.THANHPHANXUATTHAN_TEN);
        
        obj.strNguoiThucHien_Id = edu.system.userId;

        resolve(obj);
    },
    delete_NguoiHoc_TT: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NH_NguoiHoc_ThongTinTuyenSinh/Xoa',

            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var objSuccess = {
                        content: "Xóa thành công!",
                        code: ""
                    }
                    edu.system.afterComfirm(objSuccess);

                    edu.extend.getList_NguoiHoc_TTTS(-1, "", "", me.cbGenTable_NguoiHoc_TTTS);
                }
                else {
                    var obj = {
                        content: "NH_NguoiHoc_ThongTinTuyenSinh.Xoa: " + data.Message,
                        code: "w"
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "NH_NguoiHoc_ThongTinTuyenSinh.Xoa: (er)" + JSON.stringify(er),
                    code: "w"
                }
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2]Acess DB ==> NguoiHoc_TTTS Addnew
    -------------------------------------------*/
    process_Save_NguoiHoc_TTTS: function () {
        var me = this;
        var obj = {
            strId: "",
            strTAICHINH_KeHoach_Id  : edu.util.getValById("dropKeHoachNhapHoc_DSTT"),
            strSoBaoDanh            : edu.util.getValById("txtSoBaoDanh_TT"),
            strMaLopDuKien          : "",
            strMaSo                 : edu.util.getValById("txtMaSinhVien_TT"),
            strHoDem                : edu.util.getValById("txtHoDem_TT"),
            strTen                  : edu.util.getValById("txtTen_TT"),
            strCMTND_So             : edu.util.getValById("txtSoCMND_TT"),
            strNgaySinh             : edu.util.getValById("txtNgaySinh_TT"),
            strGioiTinh_Id          : edu.util.getValById("txtGioiTinh_TT"),
            strDoiTuongDuThi_Id     : edu.util.getValById("txtDoiTuong_TT"),
            strKhuVuc_Id            : edu.util.getValById("txtKhuVuc_TT"),
            strHoKhau_TinhThanh_Id  : edu.util.getValById("txtTinhThanh_TT"),
            strHoKhau_QuanHuyen_Id  : edu.util.getValById("txtQuanHuyen_TT"),
            strNamTotNghiep         : edu.util.getValById("txtNamTotNghiep_TT"),
            dDiemTS_TongDiemXetDuyet: edu.util.returnEmpty(edu.util.getValById("txtDiemXetDuyet_TT")),
            strToHocThi_Id          : edu.util.getValById("txtToHop_TT"),
            strTenTS_Mon1           : edu.util.getValById("txtTenMon1_TT"),
            strTenTS_Mon2           : edu.util.getValById("txtTenMon2_TT"),
            strTenTS_Mon3           : edu.util.getValById("txtTenMon3_TT"),
            dDiemTS_Mon1            : edu.util.returnEmpty(edu.util.getValById("txtDiemMon1_TT")),
            dDiemTS_Mon2            : edu.util.returnEmpty(edu.util.getValById("txtDiemMon2_TT")),
            dDiemTS_Mon3            : edu.util.returnEmpty(edu.util.getValById("txtDiemMon3_TT")),
            dDiemTS_TongDiem        : edu.util.returnEmpty(edu.util.getValById("txtDiemXetDuyet_TT")),
            strNganhHoc_Id          : edu.util.getValById("txtMaNganh_TT"),
            strNganhHoc_Ten         : edu.util.getValById("txtNganhHoc_TT"),
            strHoKhau_PhuongXaKhoiXom: edu.util.getValById("txtHoKhau_TT"),
            strSoDienThoaiCaNhan    : edu.util.getValById("txtDienThoai_TT"),
            strGhichu               : edu.util.getValById("txtGhiChu_TT"),
            strKQCC_10_HocLuc       : edu.util.getValById("txtHocLuc10_TT"),
            strKQCC_11_HocLuc       : edu.util.getValById("txtHocLuc11_TT"),
            strKQCC_12_HocLuc       : edu.util.getValById("txtHocLuc12_TT"),
            strKQCC_10_XepLoai      : edu.util.getValById("txtXepLoai10_TT"),
            strKQCC_11_XepLoai      : edu.util.getValById("txtXepLoai11_TT"),
            strKQCC_12_XepLoai      : edu.util.getValById("txtXepLoai12_TT"),
            strKQCC_10_HanhKiem     : edu.util.getValById("txtHanhKiem10_TT"),
            strKQCC_11_HanhKiem     : edu.util.getValById("txtHanhKiem11_TT"),
            strKQCC_12_HanhKiem     : edu.util.getValById("txtHanhKiem12_TT"),
            dPhanTramMienGiam       : edu.util.returnEmpty(edu.util.getValById("txtPhanTramMienGiam_TT")),
            strNguoiThucHien_Id     : edu.system.userId,
        };
        me.update_NguoiHoc_TTTS(obj);
    },
    /*------------------------------------------
    --Discription: [2]Process ==> ChinhSuaThongTin
    -------------------------------------------*/
    structureData_NguoiHoc_TTTS: function () {
        var data = [
            { "ID": "001", "MA": "txtPhanTramMienGiam", "TEN": "Phần trăm miễn giảm", "TYPE": "TEXT" },
            { "ID": "002", "MA": "txtSoBaoDanh", "TEN": "Số báo danh", "TYPE": "TEXT" },
            { "ID": "003", "MA": "txtMaLopDuKien", "TEN": "Mã lớp dự kiến", "TYPE": "TEXT" },
            { "ID": "004", "MA": "txtMaSinhVien", "TEN": "Mã sinh viên", "TYPE": "TEXT" },
            { "ID": "005", "MA": "txtHoDem", "TEN": "Họ đệm", "TYPE": "TEXT" },
            { "ID": "006", "MA": "txtTen", "TEN": "Tên", "TYPE": "TEXT" },
            { "ID": "007", "MA": "txtSoCMND", "TEN": "Số CMND", "TYPE": "TEXT" },
            { "ID": "008", "MA": "txtNgaySinh", "TEN": "Ngày sinh", "TYPE": "TEXT" },
            { "ID": "009", "MA": "txtGioiTinh", "TEN": "Giới tính", "TYPE": "TEXT" },
            { "ID": "010", "MA": "txtDoiTuongDuThi", "TEN": "Đối tượng ưu tiên", "TYPE": "TEXT" },
            { "ID": "011", "MA": "txtKhuVuc", "TEN": "Khu vực", "TYPE": "TEXT" },
            { "ID": "012", "MA": "txtHoKhau_Tinh", "TEN": "Tỉnh/Thành", "TYPE": "TEXT" },
            { "ID": "013", "MA": "txtHoKhau_Huyen", "TEN": "Quận/Huyện", "TYPE": "TEXT" },
            { "ID": "014", "MA": "txtHoKhau_PhuongXaKhoiXom", "TEN": "Phường/xã, khối, xóm", "TYPE": "TEXT" },
            { "ID": "015", "MA": "txtNamTotNghiep", "TEN": "Năm tốt nghiệp", "TYPE": "TEXT" },
            { "ID": "016", "MA": "txtTongDiemXetDuyet", "TEN": "Tổng điểm xét duyệt", "TYPE": "TEXT" },
            { "ID": "017", "MA": "txtTongDiem", "TEN": "Tổng điểm", "TYPE": "TEXT" },
            { "ID": "018", "MA": "txtTenMon1", "TEN": "Tên môn 1", "TYPE": "TEXT" },
            { "ID": "019", "MA": "txtTenMon2", "TEN": "Tên môn 2", "TYPE": "TEXT" },
            { "ID": "020", "MA": "txtTenMon3", "TEN": "Tên môn 3", "TYPE": "TEXT" },
            { "ID": "021", "MA": "txtDiemMon1", "TEN": "Điểm môn 1", "TYPE": "TEXT" },
            { "ID": "022", "MA": "txtDiemMon2", "TEN": "Điểm môn 2", "TYPE": "TEXT" },
            { "ID": "023", "MA": "txtDiemMon3", "TEN": "Điểm môn 3", "TYPE": "TEXT" },           
            { "ID": "024", "MA": "txtMaNganh", "TEN": "Mã ngành", "TYPE": "TEXT" },
            { "ID": "025", "MA": "txtTenNganh", "TEN": "Tên ngành", "TYPE": "TEXT" },
            { "ID": "026", "MA": "txtDienThoai", "TEN": "Số điện thoại", "TYPE": "TEXT" },
            { "ID": "027", "MA": "txtHocLuc10", "TEN": "Học lực 10", "TYPE": "TEXT" },
            { "ID": "028", "MA": "txtHocLuc11", "TEN": "Học lực 11", "TYPE": "TEXT" },
            { "ID": "029", "MA": "txtHocLuc12", "TEN": "Học lực 12", "TYPE": "TEXT" },            
            { "ID": "030", "MA": "txtXepLoai10", "TEN": "Xếp loại 10", "TYPE": "TEXT" },
            { "ID": "031", "MA": "txtXepLoai11", "TEN": "Xếp loại 11", "TYPE": "TEXT" },
            { "ID": "032", "MA": "txtXepLoai12", "TEN": "Xếp loại 12", "TYPE": "TEXT" },
            { "ID": "033", "MA": "txtHanhKiem10", "TEN": "Hạnh kiểm 10", "TYPE": "TEXT" },
            { "ID": "034", "MA": "txtHanhKiem11", "TEN": "Hạnh kiểm 11", "TYPE": "TEXT" },
            { "ID": "035", "MA": "txtHanhKiem12", "TEN": "Hạnh kiểm 12", "TYPE": "TEXT" },
            { "ID": "036", "MA": "txtToHopThi", "TEN": "Tổ hợp thi", "TYPE": "TEXT" },
            { "ID": "037", "MA": "txtGhiChu", "TEN": "Ghi chú", "TYPE": "TEXT" },
            { "ID": "038", "MA": "txtDanToc", "TEN": "Dân tộc", "TYPE": "TEXT" },
            { "ID": "039", "MA": "txtTonGiao", "TEN": "Tôn giáo", "TYPE": "TEXT" },
            { "ID": "040", "MA": "txtThanhPhanXuatThan", "TEN": "Thành phần xuất thân", "TYPE": "TEXT" },       
        ];
        return data;
    },
    getList_ChinhSuaThongTin: function (data) {
        edu.system.beginLoading();
        var jsonForm = {
            strTable_Id: "tblChinhSuaTT",
            aaData: data,
            "sort": true,
            colPos: {
                left: [1],
                center: [0, 2],
                fix: [0, 2],
            },
            aoColumns: [
                 {
                    "mDataProp": "TEN"
                 }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '<a class="btn btn-default btn-circle btnSelect_chinhsuatt" id="select_chinhsuatt' + aData.ID + '"><i class="fa fa-check color-active"></i></a>';
                        return html;
                    }
                }
                
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.endLoading();
    },
    getDetail_ChinhSuaThongTin: function (id, data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            if (id == data[i].ID) {
                return data[i];
            }
        }
    },
    genForm_ChinhSuaThongTin: function (data) {
        var me = this;
        var strMa = data.MA;
        var strType = data.TYPE;
        var strTen = data.TEN;
        var strId = data.ID;
        var $renderPlace = "#zone_input_gen";
        var html = "";
        var value = "";
        switch (strType) {
            case "TEXT":
                html += '<div id="remove_zone' + strId + '">';
                html += '<div style="width: 25%; float: left">';
                html += '<span class="">+ ' + strTen + ': </span>';
                html += '</div>';
                html += '<div style="width: 70%; float: left">';
                value = loadValIntoInput_NguoiHoc(strMa);
                html += '<input type="text" id="' + strMa + '" value="' + value + '" class="form-control" placeHolder="Nhập ' + strTen.toLowerCase() + '" />';
                html += '</div>';
                html += '<div style="width: 5%; float: left">';
                html += '<a href="#" id="remove_chinhsuatt' + strId + '" class="btnRemove_Edit_TT" style="float: right; padding-top:4px; padding-right:10px"><i class="fa fa-times-circle"></i></a>';
                html += '</div>';
                html += '<div class="clear"></div>';
                html += '</div>';
                break;
            case "DROP":
                html += '<div id="remove_zone' + strId + '">';
                html += '<div style="width: 25%; float: left">';
                html += '<span class="">+ ' + strTen + ': </span>';
                html += '</div>';
                html += '<div style="width: 70%; float: left">';
                html += '<select id="' + strMa + '" class="select-opt">';
                html += '<option value="">Vui lòng chọn dữ liệu</option>';
                html += '</select>';
                html += '</div>';
                html += '<div style="width: 5%; float: left">';
                html += '<a href="#" id="remove_chinhsuatt' + strId + '" class="btnRemove_Edit_TT" style="float: right; padding-top:4px; padding-right:10px"><i class="fa fa-times-circle"></i></a>';
                html += '</div>';
                html += '<div class="clear"></div>';
                html += '</div>';
                break;
            default:
                break;
        }
        $($renderPlace).append(html);
        $(".select-opt").select2();
        function loadValIntoInput_NguoiHoc(strTruongThongTin_Ma) {
            switch (strTruongThongTin_Ma) {
                case "txtSoBaoDanh":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.SOBAODANH);
                    break;
                case "txtMaLopDuKien":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.MALOPDUKIEN);
                    break;
                case "txtMaSinhVien":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.MASO);
                    break;
                case "txtHoDem":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.HODEM);
                    break;
                case "txtTen":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.TEN);
                    break;
                case "txtSoCMND":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.CMTND_SO);
                    break;
                case "txtNgaySinh":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.NGAYSINH_NGAY) + "/"
                        + edu.util.returnEmpty(me.dtNguoiHoc_Edit.NGAYSINH_THANG) + "/"
                        + edu.util.returnEmpty(me.dtNguoiHoc_Edit.NGAYSINH_NAM);
                    break;
                case "txtGioiTinh":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.QLSV_GIOITINH_TEN);
                    break;
                case "txtDoiTuongDuThi":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.DOITUONGDUTHI_TEN);
                    break;
                case "txtKhuVuc":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KHUVUC_TEN);
                    break;
                case "txtHoKhau_Tinh":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.HOKHAU_TINHTHANH_TEN);
                    break;
                case "txtHoKhau_Huyen":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.HOKHAU_QUANHUYEN_TEN);
                    break;
                case "txtNamTotNghiep":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.NAMTOTNGHIEP);
                    break;
                case "txtTongDiemXetDuyet":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.DIEMTS_TONGDIEMXETTUYEN);
                    break;
                case "txtToHopThi":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.TOHOPTHI_TEN);
                    break;
                case "txtTenMon1":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.TENTS_MON1);
                    break;
                case "txtTenMon2":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.TENTS_MON2);
                    break;
                case "txtTenMon3":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.TENTS_MON3);
                    break;
                case "txtDiemMon1":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.DIEMTS_MON1);
                    break;
                case "txtDiemMon2":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.DIEMTS_MON2);
                    break;
                case "txtDiemMon3":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.DIEMTS_MON3);
                    break;
                case "txtTongDiem":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.DIEMTS_TONGDIEM);
                    break;
                case "txtMaNganh":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.NGANHHOC_TEN);
                    break;
                case "txtTenNganh":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.NGANHHOC_TEN);
                    break;
                case "txtHoKhau_PhuongXaKhoiXom":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.HOKHAU_PHUONGXAKHOIXOM);
                    break;
                case "txtDienThoai":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.SODIENTHOAICANHAN);
                    break;
                case "txtGhiChu":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.GHICHU);
                    break;
                case "txtHocLuc10":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_10_HOCLUC);
                    break;
                case "txtHocLuc11":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_11_HOCLUC);
                    break;
                case "txtHocLuc12":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_12_HOCLUC);
                    break;
                case "txtXepLoai10":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_10_XEPLOAI);
                    break;
                case "txtXepLoai11":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_11_XEPLOAI);
                    break;
                case "txtXepLoai12":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_12_XEPLOAI);
                    break;
                case "txtHanhKiem10":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_10_HANHKIEM);
                    break;
                case "txtHanhKiem11":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_11_HANHKIEM);
                    break;
                case "txtHanhKiem12":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.KQCC_12_HANHKIEM);
                    break;
                case "txtPhanTramMienGiam":
                    return edu.util.returnZero(me.dtNguoiHoc_Edit.PHANTRAMMIENGIAM);
                    break;
                case "txtDanToc":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.DANTOC_TEN);
                    break;
                case "txtTonGiao":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.TONGIAO_TEN);
                    break;
                case "txtThanhPhanXuatThan":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.THANHPHANXUATTHAN_TEN);
                    break;
                case "txtMaSinhVien_TT":
                    return edu.util.returnEmpty(me.dtNguoiHoc_Edit.MASO);
                    break;
                default:
                    break;
            }
        }
    },
    removeForm_ChinhSuaThongTin: function (id) {
        var removeZone = "#remove_zone" + id;
        $(removeZone).remove();
    },
    reset_ChinhSuaThongTin: function () {
        var me = this;
        var txtInput = '';
        var $txtInput = '';

        for (var i = 0; i < me.objChinhSuaTT_Select.length; i++) {
            txtInput = me.objChinhSuaTT_Select[i].MA;
            $txtInput = "#" + txtInput;
            $($txtInput).val("");
        }
    },
    push_objChinhSuaTT_Select: function (data) {
        //{}
        var me = this;
        me.objChinhSuaTT_Select.push(data);
    },
    /*------------------------------------------
    --Discription: [2] Gen HTML/Process ==> NguoiHoc_TTTS
    -------------------------------------------*/
    getDetail_NguoiHoc_TTTS: function (strNguoiHoc_Id, data, resolve, reject) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            if (strNguoiHoc_Id == data[i].ID) {
                resolve(data[i]);
            }
        }
        resolve([]);
    },
    cbGenTable_NguoiHoc_TTTS: function (data, iPager) {
        //(0-chua nhap, 1- da nhap, -1 toan bo)
        var me = main_doc.DanhSachTrungTuyen;
        me.dtNguoiHoc = data;
        var iTinhTrangNhapHoc = -1;
        var strKeHoach_Id = $("#dropKeHoachNhapHoc_DSTT").val();
        var strTuKhoa = "";
        var jsonForm = {
            strTable_Id: "tblDSTrungTuyen",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_NguoiHoc_TTTS('" + iTinhTrangNhapHoc + "', '" + strKeHoach_Id + "', '" + strTuKhoa + "',main_doc.DanhSachTrungTuyen.cbGenTable_NguoiHoc_TTTS)",
                iDataRow: iPager,
            },
            "sort": true,
            colPos: {
                left: [1,10],
                fix: [0],
                center:[0, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = "";
                        var strHoTen        = aData.HODEM + " " + aData.TEN;
                        var strSoBaoDanh    = aData.SOBAODANH;
                        html += '<span>' + strHoTen + '</span><br />';
                        html += '<span>' + strSoBaoDanh + '</span>'
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_GIOITINH_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNgay     = aData.NGAYSINH_NGAY;
                        var strThang    = aData.NGAYSINH_THANG;
                        var strNam      = aData.NGAYSINH_NAM;
                        var strNgaySinh = strNgay + "/" + strThang + "/" + strNam;

                        return strNgaySinh;
                    }
                }
                , {//DiemMon1
                    "mRender": function (nRow, aData) {
                        var dDiem = (aData.DIEMTS_MON1);
                        return dDiem;
                    }
                }
                , {//DiemMon1
                    "mRender": function (nRow, aData) {
                        var dDiem = (aData.DIEMTS_MON2);
                        return dDiem;
                    }
                }
                , {//DiemMon1
                    "mRender": function (nRow, aData) {
                        var dDiem = (aData.DIEMTS_MON3);
                        return dDiem;
                    }
                }
                , {//TongDiem
                    "mRender": function (nRow, aData) {
                        var dTongDiem = (aData.DIEMTS_TONGDIEM);
                        return dTongDiem;
                    }
                }
                , {//DiemThuong
                    "mRender": function (nRow, aData) {
                        var dDiemThuong = (aData.DIEMTS_DIEMTHUONG);
                        return dDiemThuong;
                    }
                }
                , {
                    "mDataProp": "TOHOPTHI_TEN"
                }
                , {
                    "mDataProp": "DOITUONGDUTHI_TEN"
                }
                , {
                    "mDataProp": "PHANTRAMMIENGIAM"
                }
                , {
                    "mRender": function (nRow, aData) {
                        //condition: 0- chua nhap hoc || 1 - da nhap hoc
                        var html = '<a class="btn btn-default btn-circle btnDetail_NguoiHoc_TT" id="detail_dstt' + aData.ID + '"><i class="fa fa-info-circle color-active"></i></a>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        //condition: 0- chua nhap hoc || 1 - da nhap hoc
                        var html = '<a class="btn btn-default btn-circle btnEdit_NguoiHoc_TT" id="edit_dstt' + aData.ID + '"><i class="fa fa-pencil color-active"></i></a>';
                        return html;
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="delete_tt' + aData.ID + '" class="btnDelete_TT chkSelectOne_TT"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);       
    },
    genDetail_NguoiHoc_TTTS: function (data) {
        var me = this;
        //******************************1. attach value from db****************************************
        var strHoTen = edu.util.returnEmpty(data.HODEM) + " " + edu.util.returnEmpty(data.TEN);
        var strGioiTinh = edu.util.returnEmpty(data.QLSV_GIOITINH_TEN);
        var strNgaySinh = edu.util.returnEmpty(data.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(data.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(data.NGAYSINH_NAM);
        var strSoBaoDanh = edu.util.returnEmpty(data.SOBAODANH);
        var strQueQuan = edu.util.returnEmpty(data.HOKHAU_PHUONGXAKHOIXOM) + " - " + edu.util.returnEmpty(data.HOKHAU_QUANHUYEN_TEN) + " - " + edu.util.returnEmpty(data.HOKHAU_TINHTHANH_TEN);
        var strCMTND_So = edu.util.returnEmpty(data.CMTND_SO);
        var strDienThoai = edu.util.returnEmpty(data.SODIENTHOAICANHAN);
        var strCMTND_NgayCap = edu.util.returnEmpty(data.CMTND_NGAYCAP);
        var strCMTND_NoiCap = edu.util.returnEmpty(data.CMTND_NOICAP);
        var strDanToc = edu.util.returnEmpty(data.DANTOC_TEN);
        var strTonGiao = edu.util.returnEmpty(data.TONGIAO_TEN);
        var strDoiTuongDuThi = edu.util.returnEmpty(data.DOITUONGDUTHI_TEN);
        var strKhuVuc = edu.util.returnEmpty(data.KHUVUC_TEN);
        var strThanhPhanXuatThan = edu.util.returnEmpty(data.THANHPHANXUATTHAN_TEN);
        var strPhamTramMienGiam = edu.util.returnEmpty(data.PHANTRAMMIENGIAM);
        var strGhiChu = edu.util.returnEmpty(data.GHICHU);
        var strKyHieuTruong = edu.util.returnEmpty(data.KYHIEUTRUONG);
        var strMaNganh      = edu.util.returnEmpty();
        var strNganhHoc     = edu.util.returnEmpty(data.NGANHHOC_TEN);
        var strToHopThi     = edu.util.returnEmpty(data.TOHOPTHI_TEN);
        var strMon1         = edu.util.returnEmpty(data.TENTS_MON1);
        var strMon2         = edu.util.returnEmpty(data.TENTS_MON2);
        var strMon3         = edu.util.returnEmpty(data.TENTS_MON3);
        var dDiem1          = edu.util.returnZero(data.DIEMTS_MON1);
        var dDiem2          = edu.util.returnZero(data.DIEMTS_MON2);
        var dDiem3          = edu.util.returnZero(data.DIEMTS_MON3);
        var dDiemXetDuyet   = edu.util.returnZero(data.DIEMTS_TONGDIEMXETTUYEN);
        var dDiemTong       = edu.util.returnZero(data.DIEMTS_TONGDIEM);
        var strNamTotNghiep = edu.util.returnEmpty(data.NAMTOTNGHIEP);
        var strXepLoai10 = edu.util.returnEmpty(data.KQCC_10_XEPLOAI);
        var strXepLoai11 = edu.util.returnEmpty(data.KQCC_11_XEPLOAI);
        var strXepLoai12 = edu.util.returnEmpty(data.KQCC_12_XEPLOAI);
        var strHocLuc10 = edu.util.returnEmpty(data.KQCC_10_HOCLUC);
        var strHocLuc11 = edu.util.returnEmpty(data.KQCC_11_HOCLUC);
        var strHocLuc12 = edu.util.returnEmpty(data.KQCC_12_HOCLUC);
        var strHanhKiem10 = edu.util.returnEmpty(data.KQCC_10_HANHKIEM);
        var strHanhKiem11 = edu.util.returnEmpty(data.KQCC_11_HANHKIEM);
        var strHanhKiem12 = edu.util.returnEmpty(data.KQCC_12_HANHKIEM);
        var strMaSo = edu.util.returnEmpty(data.MASO);
        //******************************2. fill data into place****************************************
        edu.util.viewHTMLById("lblHoTen_TrungTuyen", strHoTen.toUpperCase());
        edu.util.viewHTMLById("lblGioiTinh_TrungTuyen", strGioiTinh);
        edu.util.viewHTMLById("lblSoBaoDanh_TrungTuyen", strSoBaoDanh);
        edu.util.viewHTMLById("lblNgaySinh_TrungTuyen", strNgaySinh);        
        edu.util.viewHTMLById("lblCMTND_TrungTuyen", strCMTND_So);
        edu.util.viewHTMLById("lblDienThoai_TrungTuyen", strDienThoai);
        edu.util.viewHTMLById("lblHoKhau_TrungTuyen", strQueQuan);
        edu.util.viewHTMLById("lblDanToc_TrungTuyen", strDanToc);
        edu.util.viewHTMLById("lblTonGiao_TrungTuyen", strTonGiao);
        edu.util.viewHTMLById("lblDoiTuongDuThi_TrungTuyen", strDoiTuongDuThi);
        edu.util.viewHTMLById("lblKhuVuc_TrungTuyen", strKhuVuc);
        edu.util.viewHTMLById("lblThanhPhanXuatThan_TrungTuyen", strThanhPhanXuatThan); 
        edu.util.viewHTMLById("lblPhanTramMienGiam_TrungTuyen", strPhamTramMienGiam);
        edu.util.viewHTMLById("lblGhiChu_TrungTuyen", strGhiChu);
        edu.util.viewHTMLById("lblGhiChu_TrungTuyen", strGhiChu);
        edu.util.viewHTMLById("lblNganhHoc_TrungTuyen", strNganhHoc.toUpperCase());
        edu.util.viewHTMLById("lblMaNganh_TrungTuyen", strMaNganh);
        edu.util.viewHTMLById("lblDiemXetDuyet_TrungTuyen", dDiemXetDuyet.toFixed(2));
        edu.util.viewHTMLById("lblTongDiem_TrungTuyen", dDiemTong.toFixed(2));
        edu.util.viewHTMLById("lblToHopThi_TrungTuyen", strToHopThi);        
        edu.util.viewHTMLById("lblTenMon1_TrungTuyen", strMon1);
        edu.util.viewHTMLById("lblTenMon2_TrungTuyen", strMon2);
        edu.util.viewHTMLById("lblTenMon3_TrungTuyen", strMon3);
        edu.util.viewHTMLById("lblDiem1_TrungTuyen", dDiem1.toFixed(2));
        edu.util.viewHTMLById("lblDiem2_TrungTuyen", dDiem2.toFixed(2));
        edu.util.viewHTMLById("lblDiem3_TrungTuyen", dDiem3.toFixed(2));
        edu.util.viewHTMLById("lblNamTotNghiep_TrungTuyen", strNamTotNghiep);
        edu.util.viewHTMLById("lblXepLoai10_TrungTuyen", strXepLoai10);
        edu.util.viewHTMLById("lblXepLoai11_TrungTuyen", strXepLoai11);
        edu.util.viewHTMLById("lblXepLoai12_TrungTuyen", strXepLoai12);
        edu.util.viewHTMLById("lblHocLuc10_TrungTuyen", strHocLuc10);
        edu.util.viewHTMLById("lblHocLuc11_TrungTuyen", strHocLuc11);
        edu.util.viewHTMLById("lblHocLuc12_TrungTuyen", strHocLuc12);
        edu.util.viewHTMLById("lblHanhKiem10_TrungTuyen", strHanhKiem10);
        edu.util.viewHTMLById("lblHanhKiem11_TrungTuyen", strHanhKiem11);
        edu.util.viewHTMLById("lblMaSinhVien_TT", strMaSo);
    },
    /*------------------------------------------
	--Discription: [1] ACTION HTML ==> KeHoachNhapHoc
	--Author:  
	-------------------------------------------*/
    cbGenCombo_KeHoachNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhapHoc_DSTT"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
}