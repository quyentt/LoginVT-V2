/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KeHoachXuLy() { };
KeHoachXuLy.prototype = {
    dtKeHoachXuLy: [],
    strKeHoachXuLy_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    dtHeDaoTao: [],
    arrChecked_Id: [],
    dtXacNhan: [],
    dtTrangThai:[],


    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        //me.getList_ThoiGianDaoTao();
        me.getList_KeHoachXuLy();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_PhanLoai();
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.DANGKY.NGANH2.MOHINH", "dropMoHinhDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.DANGKY.NGANH.TIEP.DUYET", "", "", me.loadBtnXacNhan);
        //me.getList_LoaiDanhHieu();
        $('#dropSearch_PhanLoai').on('select2:select', function (e) {

            me.getList_KeHoachXuLy();
        });
        $("#btnSearch").click(function (e) {
            me.getList_KeHoachXuLy();
            
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoachXuLy();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnAdd_KeHoach").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachXuLy").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KeHoachXuLy();
            }
        });
        $("#btnXoaKeHoachXuLy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoachXuLy(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_KeHoachXuLy();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#tblKeHoachXuLy").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblKeHoachXuLy");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachXuLy, "ID")[0];
                me.viewEdit_KeHoachXuLy(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblKeHoachXuLy").delegate('.btnDSNganh', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneNganh");
            me.getList_Nganh();
        });
        $("#tblKeHoachXuLy").delegate('.btnKetQua', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneSinhVien");
            me.getList_SinhVien();
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                console.log(arrChecked_Id);
                if (arrChecked_Id.length) {
                    var arrNganhXet = [];
                    me.arrChecked_Id = arrChecked_Id;
                    arrChecked_Id.forEach(e => arrNganhXet.push(edu.extend.dtSinhVien.find(ele => ele.ID == e).DAOTAO_TOCHUCCHUONGTRINH_ID))
                    me.getList_NganhXet(arrChecked_Id.toString(), arrNganhXet.toString())
                }
            });
            var html = "";
            html += '<div class="box box-solid">';
            html += '<div class="box-body">';
            html += '<div class="search">';
            html += '<div class="item-modal">';
            html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Ngành đăng ký</p>';
            html += '</div>';
            html += '<div class="item-modal">';
            html += '<select id="dropNganhXet" class="select-opt" style="width:100% !important">';
            html += '</select>';
            html += '</div>';
            html += '<div class="item-modal">';
            html += '<a class="btn btn-default" href="#" id="btnAdd_SinhVienNganh"><i class="fa fa-plus fa-customer"></i> Thêm sinh viên</a>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            $("#modalContent .col-sm-3").append(html);
            $("#btnAdd_SinhVienNganh").click(function () {
                edu.system.genHTML_Progress("zoneprocessProGes", me.arrChecked_Id.length);
                me.arrChecked_Id.forEach(strSinhVien_Id => {
                    me.save_SinhVien(strSinhVien_Id);
                })
            })
            $("#zoneChonNhieuSV").hide();
            edu.extend.getList_SinhVien("SEARCH");
        });
        //$(".btnSearchDTSV_SinhVien").trigger("click");
        $(".btnDeleteDTSV_SinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });

        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
            if (me.arrKhoa.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $("#ApDungChoKhoa").html("Áp dụng cho khóa: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những khóa: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (me.arrChuongTrinh.length > 0) {
                var strApDungChoChuongTrinh = "";
                var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
                    strApDungChoChuongTrinh += ", " + $(this).text();
                });
                $("#ApDungChoChuongTrinh").html("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                edu.system.alert("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            me.arrLop = $("#dropSearchModal_Lop_SV").val();
            if (me.arrLop.length > 0) {
                var strApDungChoLop = "";
                var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
                    strApDungChoLop += ", " + $(this).text();
                });
                $("#ApDungChoLop").html("Áp dụng cho lớp: " + strApDungChoLop);
                edu.system.alert("Áp dụng cho lớp: " + strApDungChoLop);
                $("#modal_sinhvien").modal("hide");
            }
        });
        
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        $(".btnSearch_Nganh").click(function () {
            edu.extend.genModal_Lop(arrChecked_Id => {
                console.log(arrChecked_Id);
                if (arrChecked_Id.length) {
                    edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                    arrChecked_Id.forEach(strSinhVien_Id => {
                        me.save_Nganh(strSinhVien_Id);
                    })
                }
            });
            var html = "";
            html += '<div class="box box-solid">';
            html += '<div class="box-body">';
            html += '<div class="search">';
            html += '<div class="item-modal">';
            html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Xâu điều kiện</p>';
            html += '</div>';
            html += '<div class="item-modal">';
            html += '<input id="txtDieuKienModal" class="form-control" placeholder="Nhập xâu điều kiện" />';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            $("#modalContent .col-sm-3").append(html);
            edu.extend.getList_Lop("SEARCH");
        });
        $(".btnDelete_Nganh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNganh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Nganh(arrChecked_Id[i]);
                }
            });
        });
        //$(".btnSearch_HocPhan").trigger("click");
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKeHoachXuLy_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        

        edu.system.getList_MauImport("zonebtnBaoCao_KH", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strHB_QuyHocBong_Id': edu.util.getValById('dropSearch_QuyHocBong'),
                'strQLSV_TrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            arrChecked_Id.forEach(e => addKeyValue('strHocBong_Id', e));
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strQLSV_DANGKY_NGANH_TIEP_ID", arrChecked_Id[i]);
            }

        });


        $("#btnThemHeKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_KeHoachTuyenSinh_HeKhoa(id, "");
        });
        $("#zoneEdit").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_HeKhoa tr[id='" + strRowId + "']").remove();
        });
        $("#zoneEdit").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KeHoachTuyenSinh_HeKhoa(strId);
            });
        });;

        $(".btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_NHAP";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            //me.getList_XacNhan(me.strDSDiem_Id, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");

            $("#modal_XacNhan").modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var aData = me.dtSinhVien.find(e => e.ID == arrChecked_Id[i]);
                var strSanPham = aData.QLSV_DANGKY_NGANH_TIEP_ID + aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_CHUONGTRINH_ID + aData.DAOTAO_CHUONGTRINH_DANGKY_ID;
                me.save_XacNhanSanPham(strSanPham, strTinhTrang, strMoTa);
            }
        });

        $("#btnSaveDieuKien").click(function () {
            var arrThem = [];
            $("#tblNganh .dieukien").each(function () {
                var point = $(this);
                if (point.val() != point.attr("name")) {
                    arrThem.push(point.attr("id").replace("txtDieuKien", ""))
                }
            })
            if (arrThem.length == 0) {
                edu.system.alert("Không có dữ liệu cần cập nhật");
            }
            edu.system.alert('<div id="zoneprocessProGes"></div>');
            edu.system.genHTML_Progress("zoneprocessProGes", arrThem.length);
            arrThem.forEach(strSinhVien_Id => {
                me.save_Nganh("", strSinhVien_Id);
            })
        });

        edu.system.getList_MauImport("zonebtnBaoCao_NguyenVong", function (addKeyValue) {
            var obj_list = {
                'strQLSV_TrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
                'strNguoiThucHien_Id': edu.system.userId 
                 
            };
            for (variable in obj_list) {
                addKeyValue(variable, obj_list[variable]);
            }
            var xxx = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
            console.log('aasaaa');
            console.log(xxx);
            var arrTrangThai = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD');
            console.log(arrTrangThai);
            console.log('aasaaa1111');

            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            
            addKeyValue("strQLSV_TrangThaiNguoiHoc_Id", edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString());            
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strQLSV_DANGKY_NGANH_TIEP_ID", arrChecked_Id[i]);
            }
          

        });
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        $("#DSTrangThaiSV_LHD").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {

            var checked_status = this.checked;
            
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });

        $("#tblKeHoachXuLy").delegate('.btnGioiHan', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneGioiHan");
            me.getList_GioiHan();
            me.getList_GioiHan_Add();
            me.getList_Lop_GH();
        });
        $("#btnAdd_GioiHan").click(function () {
            $('#myModalGioiHan').modal('show');
            
        });
        $("#btnSave_GioiHan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGioiHan_Add", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $('#myModalGioiHan').modal('hide');
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_GioiHan(arrChecked_Id[i]);
            }
        });
        $("#btnDelete_GioiHan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGioiHan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_GioiHan(arrChecked_Id[i]);
                }
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachXuLy_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropMoHinhDaoTao","");
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        $("#tbl_HeKhoa tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_KeHoachXuLy();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSKeHoach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    me.genTable_KeHoachXuLy(dtReRult, data.Pager);
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
    save_KeHoachXuLy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2/Them_DangKy_Nganh_Tiep',
            'type': 'POST',
            'strId': me.strKeHoachXuLy_Id,
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'strTenKeHoach': edu.util.getValById('txtTen'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strMoHinhDangKy_Id': edu.util.getValById('dropMoHinhDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'DKH_Nganh2/Sua_DangKy_Nganh_Tiep';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    $("#tbl_HeKhoa tbody tr").each(function () {
                        var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                        me.save_KeHoachTuyenSinh_HeKhoa(strHeKhoa_Id, strKeHoachXuLy_Id);
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachXuLy: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_Nganh2/Xoa_DangKy_Nganh_Tiep',
            
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
                    me.getList_KeHoachXuLy();
                }
                else {
                    obj = {
                        content: "KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "HB_KeHoach/Xoa (er): " + JSON.stringify(er),
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

    save_Lop: function (strXLDH_KeHoach_Id, strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViLop',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh: function (strXLDH_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViCT',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Khoa: function (strXLDH_KeHoach_Id, strDaoTao_KhoaDaoTao_Id) {
        var me = this;
        //--Edit
        var obj_save = {

            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViKhoa',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

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
    genTable_KeHoachXuLy: function (data, iPager) {
        var me = this;
        $("#lblKeHoachXuLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachXuLy",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TENKEHOACH",
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "MOHINHDANGKY_TEN"
                },
                {
                    //"mDataProp": "TUNGAY"
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TUNGAY) + " --> " + edu.util.returnEmpty(aData.DENNGAY);
                    }
                },

                {
                    //"mDataProp": "TUNGAY"
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC? "Hiệu lực": "Hết hiệu lực";
                    }
                },
                {

                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSNganh" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnGioiHan" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
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
    viewEdit_KeHoachXuLy: function (data) {
        var me = this;
        //View - Thong tin
        //edu.util.viewValById("dropHieuLuc", data.MA);
        edu.util.viewValById("txtTen", data.TENKEHOACH);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropMoHinhDaoTao", data.MOHINHDANGKY_ID);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        me.strKeHoachXuLy_Id = data.ID;
        me.getList_KeHoachTuyenSinh_HeKhoa();
        //me.arrLop = [];
        //me.arrKhoa = [];
        //me.arrChuongTrinh = [];
        //$("#ApDungChoLop").html("");
        //$("#ApDungChoKhoa").html("");
        //$("#ApDungChoChuongTrinh").html("");
        //me.getList_SinhVien();
        //me.getList_ThanhVien();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSDK_Nganh_Tiep_KetQua',
            'type': 'GET',
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me["dtSinhVien"] = dtResult;
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_KeHoachXuLy_Id) {
        var me = this;
        var aData = edu.extend.dtSinhVien.find(e => e.ID == strNhanSu_Id);
        var aDataNganh = me.dtNganhXet.find(e => e.ID == $("#dropNganhXet").val())
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2/Them_DangKy_Nganh_Tiep_KetQua',
            'type': 'POST',
            'strQLSV_DangKy_Nganh_Tiep_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strQLSV_NguoiHoc_DK_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_KhoaDaoTao_DK_Id': aDataNganh.DAOTAO_KHOADAOTAO_ID,
            'strDaoTao_ChuongTrinh_DK_Id': aDataNganh.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_LopQuanLy_DK_Id': aDataNganh.DAOTAO_LOPQUANLY_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    $("#modal_sinhvien").modal("hide");
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'DKH_Nganh2/Xoa_DangKy_Nganh_Tiep_KetQua',

            'strId': strIds,
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
                    edu.system.alert("Xóa thành công!");
                    //me.getList_SinhVien();
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
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
        var jsonForm = {
            strTable_Id: "tblInput_DTSV_SinhVien",

            aaData: data,
            colPos: {
                center: [0, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_DANGKY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_DANGKY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_DANGKY_TEN"
                },
                {
                    //"mDataProp": "SOTIENPHAINOP",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIENPHAINOP);
                    }
                },
                {
                    //"mDataProp": "SOTIENDANOP",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIENDANOP);
                    }
                },
                {
                    "mDataProp": "TINHTRANGDUYET"
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
    
    save_Nganh: function (strData_Id, strRowID, strKeHoachXuLy_Id, strDaoTao_CoCauToChuc_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        var aData = {};
        if (!strRowID) aData = edu.extend.dtLopQuanLy.find(e => e.ID == strData_Id);
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2/Them_DK_Nganh_Tiep_PV_MoNganh',
            'type': 'POST',
            'strId': strId,
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_HeDaoTao_Id': aData.DAOTAO_HEDAOTAO_ID,
            'strDaoTao_KhoaDaoTao_Id': aData.DAOTAO_KHOADAOTAO_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_LopQuanLy_Id': aData.ID,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strXauDieuKien': edu.util.getValById('txtDieuKien' + strRowID),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'dSoTien': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'DKH_Nganh2/Sua_DK_Nganh_Tiep_PV_MoNganh';
        } else {
            obj_save.strXauDieuKien = edu.util.getValById('txtDieuKienModal')
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    $("#modal_lophoc").modal("hide");
                    me.getList_Nganh();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_Nganh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSDK_Nganh_Tiep_PV_MoNganh',
            'type': 'GET',
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_Nganh(dtResult);
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
    delete_Nganh: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_Nganh2/Xoa_DK_Nganh_Tiep_PV_MoNganh',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strId': strNhanSu_Id,
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
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_Nganh();
                });
            },
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
    genTable_Nganh: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblNganh",
            
            aaData: data,
            colPos: {
                center: [0,7],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtDieuKien' + aData.ID + '" value="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '" name="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '" class="form-control form-border-bottom dieukien" />';
                    }
                },
                {
                    "mDataProp": "MOTA"
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

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_KeHoachTuyenSinh_HeKhoa: function (strHeKhoa_Id, strQLSV_DangKy_Nganh_Tiep_Id) {
        var me = this;
        var strId = strHeKhoa_Id;
        var strDaoTao_HeDaoTao_Id = edu.util.getValById('dropHeDaoTao' + strHeKhoa_Id);
        var strDaoTao_KhoaDaoTao_Id = edu.util.getValById('dropKhoaDaoTao' + strHeKhoa_Id);
        if (!edu.util.checkValue(strDaoTao_HeDaoTao_Id) || !edu.util.checkValue(strDaoTao_KhoaDaoTao_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2/Them_DangKy_Nganh_Tiep_PhamVi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
            'strPhamViApDung_Id': strDaoTao_KhoaDaoTao_Id,
            'strQLSV_DangKy_Nganh_Tiep_Id': strQLSV_DangKy_Nganh_Tiep_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'DKH_Nganh2/Sua_DangKy_Nganh_Tiep_PhamVi';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KeHoachTuyenSinh_HeKhoa: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSDangKy_Nganh_Tiep_PhamVi',
            'type': 'GET',
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(dtResult);
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
    delete_KeHoachTuyenSinh_HeKhoa: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_Nganh2/Xoa_DangKy_Nganh_Tiep_PhamVi',

            'strId': strIds,
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
                    me.getList_KeHoachTuyenSinh_HeKhoa();
                }
                else {
                    obj = {
                        content: "TS_KeHoach_HeDaoTao/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_KeHoach_HeDaoTao/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_KeHoachTuyenSinh_HeKhoa_Data: function (data) {
        var me = this;
        $("#tbl_HeKhoa tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strHeKhoa_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strHeKhoa_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHeDaoTao' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
            row += '<td><select id="dropKhoaDaoTao' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHeKhoa" id="' + strHeKhoa_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tbl_HeKhoa tbody").append(row);
            me.genCombo_HeDaoTao("dropHeDaoTao" + strHeKhoa_Id, data[i].DAOTAO_HEDAOTAO_ID);
            //me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, data[i].DAOTAO_KHOADAOTAO_ID);
            me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, data[i].PHAMVIAPDUNG_ID);

            $("#dropHeDaoTao" + strHeKhoa_Id).on("select2:select", function () {
                var strDrop_Id = this.id.replace("dropHeDaoTao", "");
                me.getList_KhoaDaoTao_InTable($(this).val(), "dropKhoaDaoTao" + strDrop_Id);
            });
        }
        //for (var i = data.length; i < 4; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(id, "");
        //}
    },
    genHTML_KeHoachTuyenSinh_HeKhoa: function (strHeKhoa_Id) {
        var me = this;
        var iViTri = document.getElementById("tbl_HeKhoa").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strHeKhoa_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHeDaoTao' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
        row += '<td><select id="dropKhoaDaoTao' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strHeKhoa_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tbl_HeKhoa tbody").append(row);
        me.genCombo_HeDaoTao("dropHeDaoTao" + strHeKhoa_Id, "");
        me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, "");
        me.getList_KhoaDaoTao(edu.util.getValById("dropHeDaoTao"));

        $("#dropHeDaoTao" + strHeKhoa_Id).on("select2:select", function () {
            var strDrop_Id = this.id.replace("dropHeDaoTao", "");
            me.getList_KhoaDaoTao_InTable($(this).val(), "dropKhoaDaoTao" + strDrop_Id, "");
        });
    },

    getList_HeDaoTao: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtHeDaoTao = dtResult;
                    //me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 100000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtHeDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },

    getList_KhoaDaoTao_InTable: function (strDaoTao_HeDaoTao_Id, strDrop_Id, default_val) {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KhoaDaoTao_InTable(dtResult, strDrop_Id, default_val);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 10000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao_InTable: function (data, strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },

   

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKhoaDaoTao = dtResult;
                    //me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropHeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 10000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKhoaDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_PhanLoai: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSQLSV_NguoiDung_PhanLoai',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genCombo_PhanLoai(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_PhanLoai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropPhanLoai", "dropSearch_PhanLoai"],
            title: "Chọn phân loại"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_NganhXet: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = main_doc.KeHoachXuLy;
        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSNganhMoDangKy',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strQLSV_DangKy_Nganh_Tiep_Id': main_doc.KeHoachXuLy.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtNganhXet"] = dtReRult.rsNganhMo;
                    me.genCombo_Nganh(dtReRult.rsNganhMo);
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
    genCombo_Nganh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_LOPQUANLY_TEN",
                //mRender: function (index, aData) {
                //    return aData.DAOTAO_KHOADAOTAO_TEN
                //}
            },
            renderPlace: ["dropNganhXet"],
            title: "Chọn ngành"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropNganhXet").select2();
    },

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'DKH_Nganh2/Them_DK_Nganh_Tiep_Duyet',
            'type': 'POST',
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': edu.util.getValById('dropAAAA'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_BtnXacNhanSanPham: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data, strZoneXacNhan_Id);
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
    loadBtnXacNhan: function (data) {
        main_doc.KeHoachXuLy.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_XacNhan/LayDSDiem_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.KeHoachXuLy.dtTrangThai = data;
        
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_GioiHan: function (strDaoTao_CT_DangKy_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2_MH/FSkkLB4QDRIXHgUgLyYKOB4PJiAvKR4GKC4oCSAv',
            'func': 'pkg_dangkyhoc_nganh2.Them_QLSV_DangKy_Nganh_GioiHan',
            'iM': edu.system.iM,
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_LopQL_GioiHan_Id': edu.util.getValById('dropLop_GH'),
            'strDaoTao_CT_DangKy_Id': strDaoTao_CT_DangKy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'DKH_DangKyThi_MonThi_ThongTin_MH/EjQgHgUgLyYKOB4VKSgeCTEeCikeDDQiESko';
        //    obj_save.func = 'pkg_dangkythi_monthi_thongtin.Sua_DangKy_Thi_Hp_Kh_MucPhi'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    //me.getList_Phi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_GioiHan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_GioiHan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2_MH/DSA4BRIQDRIXHgUgLyYKOB4PJiAvKR4GKC4oCSAv',
            'func': 'pkg_dangkyhoc_nganh2.LayDSQLSV_DangKy_Nganh_GioiHan',
            'iM': edu.system.iM,
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtGioiHan"] = dtReRult;
                    me.genTable_GioiHan(dtReRult, data.Pager);
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
    getList_GioiHan_Add: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2_MH/DSA4BRICKTQuLyYVMygvKQUkBiguKAkgLwPP',
            'func': 'pkg_dangkyhoc_nganh2.LayDSChuongTrinhDeGioiHan',
            'iM': edu.system.iM,
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_GioiHan_Add(dtReRult, data.Pager);
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
    delete_GioiHan: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2_MH/GS4gHhANEhceBSAvJgo4Hg8mIC8pHgYoLigJIC8P',
            'func': 'pkg_dangkyhoc_nganh2.Xoa_QLSV_DangKy_Nganh_GioiHan',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_GioiHan();
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
    genTable_GioiHan: function (data, iPager) {
        $("#lblPhi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGioiHan",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.Phi.getList_Phi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "DAOTAO_LOPQUANLY_GIOIHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_DANGKY_TEN) + " - " + edu.util.returnEmpty(aData.MANGANH);
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
    genTable_GioiHan_Add: function (data, iPager) {
        $("#lblPhi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGioiHan_Add",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.Phi.getList_Phi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.MACHUONGTRINH) + " - " + edu.util.returnEmpty(aData.MANGANH);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TENCHUONGTRINH) + " - " + edu.util.returnEmpty(aData.TENNGANH);
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
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

    getList_Lop_GH: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2_MH/DSA4BRINLjEQNCAvDTgFJAYoLigJIC8P',
            'func': 'pkg_dangkyhoc_nganh2.LayDSLopQuanLyDeGioiHan',
            'iM': edu.system.iM,
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_Lop_GH(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_Lop_GH: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropLop_GH"],
            title: "Chọn lớp"
        };
        edu.system.loadToCombo_data(obj);
    },
}