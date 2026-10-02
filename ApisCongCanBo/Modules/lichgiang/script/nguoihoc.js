/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function NguoiHoc() { };
NguoiHoc.prototype = {
    strNguoiHoc_Id: '',
    dtNguoiHoc: [],
    strLoaiXacNhan: '',
    strLopHocPhan_Id: '',
    strLichHoc_Id: '',
    dtSinhVien: [],
    dtKieuChuyenCan: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strNguoiHoc_Id = edu.system.userId;
        me.getList_NguoiHoc();
        me.getList_ThoiGianDaoTao();
        me.getList_HocPhan();
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAICHUONGTRINH", "dropSearch_MoHinhHoc,dropMoHinhHoc");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        $("#tblNguoiHoc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                //me.viewForm_NguoiHoc(strId);
                $("#myModal_hocvien").modal("show");
                var objNguoiHoc = me.dtNguoiHoc.find(e => e.ID == strId);
                $("#lblTenHoc").html('<b>' + objNguoiHoc.TENLOP + '</b> <span class="color-66">&ensp; - &ensp; Số lượng: ' + edu.util.returnEmpty(objNguoiHoc.SOLUONG) + '</span>');
                me.getList_LopHoc(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNguoiHoc").delegate(".btnChuyenCan", "click", function () {
            var strId = this.id;
            me.strLopHocPhan_Id = strId;
            if (edu.util.checkValue(strId)) {
                //me.viewForm_NguoiHoc(strId);
                $("#mymodal_NhapChuyenCan").modal("show");
                $("#tblNhapChuyenCan tbody").html("");
                var objNguoiHoc = me.dtNguoiHoc.find(e => e.ID == strId);
                $(".lblTenHoc").html('<b>' + objNguoiHoc.TENLOP + '</b> <span class="color-66">&ensp; - &ensp; Số lượng: ' + edu.util.returnEmpty(objNguoiHoc.SOLUONG) + '</span>');
                me.getList_LichGiang(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblLichGiang").delegate(".btnLichHoc", "click", function () {
            var strId = this.id;
            me.strLichHoc_Id = strId;
            //this.classList.add("active");
            $("#tblLichGiang .active").removeClass("active");

            var objLich = me.dtLichHoc.find(e => e.ID === strId);
            $("#lblThoiGianHoc").html(objLich.NGAYHOC + ' <span>' + edu.util.returnEmpty(objLich.GIOBATDAU) + 'h' + edu.util.returnEmpty(objLich.PHUTBATDAU) + '</span> <i class="fal fa-long-arrow-right"></i><span>' + edu.util.returnEmpty(objLich.GIOKETTHUC) + 'h' + edu.util.returnEmpty(objLich.PHUTKETTHUC) + '</span>')
            me.getList_SinhVien(strId);
            $("#tblLichGiang tbody tr[id='" + strId + "']").addClass("active");
        });

        $("#tblNhapChuyenCan").delegate(".chkSelectAll", "click", function (e) {

            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".checkNgay" + strClass).each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });

        $("#tblNhapChuyenCan").delegate(".checkChuyenCan", "click", function (e) {
            var point = this;
            var checked_status = this.checked;
            if (checked_status) {
                var strid = this.id;
                var arrId = strid.split("_");
                var strSV_Id = arrId[0].substring(9);
                $(".checkSV" + strSV_Id).each(function () {
                    if (point.id == this.id) return;
                    $(this).attr('checked', false);
                    $(this).prop('checked', false);
                });
            }
        });
        $("#tblNhapChuyenCan").delegate(".inputChuyenCan", "blur", function (e) {
            var point = this;
            var strid = this.id;
            var strSV_Id = strid.substring(6);
            var ele = $("#chkSelect" + strSV_Id);
            var checked_status = false;
            if ($(point).val() != "") {
                checked_status = true;
            }
            $(ele).attr('checked', checked_status);
            $(ele).prop('checked', checked_status);
        });

        $("#btnDiemDanh").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblNhapChuyenCan .checkChuyenCan");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    } else {
                        var inputcheck = $("#" + x[i].id.replace("chkSelect", "input_"));
                        if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                //edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " và hủy " + arrXoa.length + "?");
                //$("#btnYes").click(function (e) {

                //});
                console.log((arrThem.length + arrXoa.length));
                edu.system.alert('<div id="divprogessdata"></div>');
                edu.system.genHTML_Progress("divprogessdata", (arrThem.length + arrXoa.length));
                for (var i = 0; i < arrXoa.length; i++) {
                    me.delete_NhapChuyenCan(arrXoa[i]);
                }
                setTimeout(function () {
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_NhapChuyenCan(arrThem[i]);
                    }
                }, 400);


            }
            else {
                edu.system.alert("Bạn chưa thay đổi gì dữ liệu.", "i");
            }
        });

        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_NguoiHoc").click(function () {
            me.save_NguoiHoc();
        });

        $("#btnKhoiPhucDiemDanh").click(function () {
            me.save_KhoiPhucDiemDanh();
        });
        $("#btnXoaNguoiHoc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiHoc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NguoiHoc(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_NguoiHoc();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiHoc();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNguoiHoc" });
        });
        $('#dropSearch_ThoiGian').on('select2:select', function () {
            me.getList_NguoiHoc();
            me.getList_HocPhan();
        });
        $('#dropSearch_HocPhan').on('select2:select', function () {
            me.getList_NguoiHoc();
        });

        edu.system.getList_MauImport("zonebtnBaoCao_NguoiHoc", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiHoc", "checkX");
            var obj_list = {
                'strNhanSu_HoSoCanBo_Id': me.strNguoiHoc_Id,
                'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            };
            arrChecked_Id.forEach(e => {
                addKeyValue('strDaoTao_LopHocPhan_Id', e);
            });

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });

        $("#btnCongBo").click(function () {
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEMDANH";
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiHoc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }

            $("#modal_XacNhan").modal("show");

            me.getList_XacNhanSanPham(arrChecked_Id[0], "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
            me.getList_XacNhan(arrChecked_Id[0], "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
        });

        $("#btnDongYXacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiHoc", "checkX");
            arrChecked_Id.forEach(e => me.save_XacNhanSanPham(e, strTinhTrang, strMoTa, me.strLoaiXacNhan))
        });

        edu.system.loadToCombo_DanhMucDuLieu("QLSV.KIEUCHUYENCAN", "", "", data => {
            me.dtKieuChuyenCan = data;
            var row = '';
            var rowTen = "";
            data.forEach(e => {
                rowTen += '<th class="td-center" colspan="2" style="width: 60px">' + e.TEN + '</th>';
                row += '<th class="td-center" style="width: 94px">' + e.TEN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + e.ID + '" style="margin-left: -39px" /></th>';
            });

            $("#tblNhapChuyenCan thead tr:eq(1)").append(rowTen + row);
            $("#lblTongHopChuyenCan").attr("colspan", (data.length * 2));
            $("#lblThoiGianHoc").attr("colspan", (data.length));
            //document.getElementById("lblTongHopChuyenCan").colspan = (data.length * 2);
        });

        $('#dropSearch_LoaiSapXep').on('select2:select', function () {
            me.getList_SinhVien();
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strNguoiHoc_Id = "";
        edu.util.viewValById("dropThoiGian", edu.util.getValById("dropSearch_ThoiGian"));
        edu.util.viewValById("dropHoatDong", edu.util.getValById("dropSearch_HoatDong"));
        edu.util.viewValById("dropDiaDiem", edu.util.getValById("dropSearch_DiaDiem"));
        edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtHeSo", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_NguoiHoc: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HeSo_NguoiHoc/ThemMoi',

            'strId': me.strNguoiHoc_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'strHoatDong_Id': edu.util.getValById('dropHoatDong'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strPhamViApDung_Id': edu.util.getValById('dropPhamVi'),
            'strPhanLoaiDiaDiem_Id': edu.util.getValById('dropPhanLoai'),
            'dHeSoQuyDoiNguoiHoc': edu.util.getValById('txtHeSo'),
            'strMoHinhHoc_Id': edu.util.getValById('dropMoHinhHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HeSo_NguoiHoc/CapNhat';
        }
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
                    me.getList_NguoiHoc();
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

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NguoiHoc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSLopHocPhanTheoLichCaNhan',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': me.strNguoiHoc_Id,
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNguoiHoc = dtReRult;
                    me.genTable_NguoiHoc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_NguoiHoc: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_NguoiHoc/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_NguoiHoc();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NguoiHoc: function (data, iPager) {
        $("#lblNguoiHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiHoc",
            aaData: data,
            
            colPos: {
                center: [0, 4, 5, 3, 6, 7, 8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChuyenCan" id="' + aData.ID + '" title="Sửa">Tổng hợp điểm danh</a></span>';
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
        /*III. Callback*/
    },
    viewForm_NguoiHoc: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtNguoiHoc, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropHoatDong", data.HOATDONG_ID);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAIDIADIEM_ID);
        edu.util.viewValById("dropPhamVi", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("txtHeSo", data.HESOQUYDOINguoiHoc);
        edu.util.viewValById("dropMoHinhHoc", data.MOHINHHOC_ID);
        me.strNguoiHoc_Id = data.ID;
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;


        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSThoiGianTheoLichCaNhan',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': me.strNguoiHoc_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_ThoiGianDaoTao(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_ThoiGian").select2();
    },
    getList_HocPhan: function () {
        var me = this;


        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSHocPhanTheoLichCaNhan',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': me.strNguoiHoc_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocPhan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (nRow, aData) {
                    return aData.MA + " - " + aData.TEN;
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_LopHoc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_BaoCao/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strReport_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopHocPhan_Id': strDanhSach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data.rs;
                    //me.dtNguoiHoc = dtReRult;
                    me.genTable_LopHoc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LopHoc: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblLopHoc",
            aaData: data,

            colPos: {
                center: [0, 4, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_LichGiang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSLichGiang',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strDaoTao_LopHocPhan_Id': strDanhSach_Id, 
            'strNgayBatDau': '',
            'strNgayKetThuc': '',
            'strNgayDangChon': edu.util.getValById('txtAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data.filter(e => e.IDLOPHOCPHAN === strDanhSach_Id);
                    //dtReRult.forEach(e => {
                    //    e[]
                    //})
                    for (var i = 0; i < dtReRult.length; i++) {
                        dtReRult[i]["ID"] = edu.util.uuid();
                    }
                    me.dtLichHoc = dtReRult;
                    me.genTable_LichGiang(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LichGiang: function (data, iPager) {
        //var jsonForm = {
        //    strTable_Id: "tblLichGiang",
        //    aaData: data,

        //    colPos: {
        //        center: [0]
        //        //right: [5]
        //    },
        //    //addClass: ["btnLichHoc"],
        //    orowid: {
        //        id: "IDLICHHOC"
        //    },
        //    aoColumns: [
        //        {
        //            "mDataProp": "NGAYHOC"
        //        },
        //        {
        //            "mRender": function (nRow, aData) {
        //                return '<span>' + edu.util.returnEmpty(aData.GIOBATDAU) + 'h' + edu.util.returnEmpty(aData.PHUTBATDAU) + '</span> <i class="fal fa-long-arrow-right"></i><span>' + edu.util.returnEmpty(aData.GIOKETTHUC) + 'h' + edu.util.returnEmpty(aData.PHUTKETTHUC) + '</span>';
        //            }
        //        }
        //    ]
        //};
        //edu.system.loadToTable_data(jsonForm);
        console.log(data);
        var html = "";
        data.forEach((e, index) => {
            html += '<tr id="' + e.ID + '" class="btnLichHoc pointer"><td style="text-align: center;">' + (index + 1) + '</td><td>' + e.NGAYHOC + '</td><td><span>' + edu.util.returnEmpty(e.GIOBATDAU) + 'h' + edu.util.returnEmpty(e.PHUTBATDAU) + '</span> <i class="fal fa-long-arrow-right"></i><span>' + edu.util.returnEmpty(e.GIOKETTHUC) + 'h' + edu.util.returnEmpty(e.PHUTKETTHUC) + '</span></td></tr>'; 
            
        })
        $("#tblLichGiang tbody").html(html);
        //data.forEach(e => $("#tblLichGiang tbody tr[id='" + e.IDLICHHOC + "']").addClass("btnLichHoc"));
        if (data.length > 0) $("#tblLichGiang tbody tr[id='" + data[0].ID + "']").trigger("click");
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropLoaiXacNhan"],
            type: "",
            title: "Chọn xác nhận"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/FSkkLB4FKCQsHhkgIg8pIC8P',
            'func': 'pkg_diem_chung.Them_Diem_XacNhan',
            'iM': edu.system.iM,

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
            'strHanhDong_Id': strTinhTrang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strThongTinXacNhan': strNoiDung,

            'strNguoiXacNhan_Id': edu.system.userId,
            'strDuLieuXacNhan': strSanPham_Id,
        };
        $("#modal_XacNhan").modal('hide');
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

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/DSA4BRIJIC8pBS4vJhkgIg8pIC8P',
            'func': 'pkg_diem_chung.LayDSHanhDongXacNhan',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.loadBtnXacNhan(data.Data, strTable_Id);
                }
            },

            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/DSA4BRIFKCQsHhkgIg8pIC8P',
            'func': 'pkg_diem_chung.LayDSDiem_XacNhan',
            'iM': edu.system.iM,
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
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function (strDanhSach_Id, callback) {
        var me = this;
        //--Edit
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);

        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
            'strReport_Id': edu.util.getValById('dropAAAA'),
            'strTieuChiSapXep': edu.util.getValById('dropSearch_LoaiSapXep'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data.rs;
                    me.dtSinhVien = dtReRult;
                    me.genTable_SinhVien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
                if (typeof callback === "function") callback();
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
                if (typeof callback === "function") callback();
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_SinhVien: function (data, iPager) {
        var me = this;
       

        var jsonForm = {
            strTable_Id: "tblNhapChuyenCan",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN",
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "TONGSOTIETHOC",
                },
                {
                    "mDataProp": "TONGSOTIETCOMAT",
                },
                {
                    "mDataProp": "PHANTRAMHOANTHANH",
                },
                {
                    "mDataProp": "PHANTRAMTHUCHIEN",
                }
            ]
        };
        for (var i = 0; i < me.dtKieuChuyenCan.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn;
                    return '<span id="lblSoBuoi_' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.NguoiHoc.dtKieuChuyenCan[iThuTu].ID + '" ></span>';
                       
                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span id="lblSoTiet_' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.NguoiHoc.dtKieuChuyenCan[iThuTu].ID + '" ></span>';

                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        }
        //edu.system.icolumn = 0;
        for (var i = 0; i < me.dtKieuChuyenCan.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn - main_doc.NguoiHoc.dtKieuChuyenCan.length; edu.system.icolumn++;
                    return '<input type="checkbox" class="checkChuyenCan checkSV' + aData.QLSV_NGUOIHOC_ID + ' checkNgay' + main_doc.NguoiHoc.dtKieuChuyenCan[iThuTu].ID + '" id="chkSelect' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.NguoiHoc.dtKieuChuyenCan[iThuTu].ID + '"  />'
                        + '<input style="width: calc(100% - 40px); float: right" class="inputChuyenCan" id="input_' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.NguoiHoc.dtKieuChuyenCan[iThuTu].ID + '" />';
                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        }

        edu.system.loadToTable_data(jsonForm);
        //edu.system.genHTML_Progress("divprogessquanso", data.rs.length * data.rsNgay.length);
        me.getData_NhapChuyenCan();
        me.dtKieuChuyenCan.forEach(e => me.getData_TongHopChuyenCan(e.ID))
    },
    getData_NhapChuyenCan: function (jsonSV, strNgay_ID, strNgay) {
        var me = this;
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        //--Edit
        var obj_list = {
            'action': 'CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan',
            'type': 'GET',
            'strKieuChuyenCan_Id': edu.util.getValById('dropAAAA'),
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': 0,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].GIATRI == 1) {
                            var check = $("#chkSelect" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].GIATRI);
                            var inputCheck = $("#input_" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                            if (dtReRult[i].SOLUONG != 0) {
                                inputCheck.val(dtReRult[i].SOLUONG);
                                inputCheck.attr("name", dtReRult[i].SOLUONG);
                            }
                        }
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                //edu.system.alert(JSON.stringify(er), "w");
                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getData_TongHopChuyenCan: function (strKieuChuyenCan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CC_ThoiGian_ChuyenCan/LayKQTongHopTheoKieuChuyenCan',
            'type': 'GET',
            'strKieuChuyenCan_Id': strKieuChuyenCan_Id,
            'strDaoTao_LopHocPhan_Id': me.strLopHocPhan_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        $("#lblSoBuoi_" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + strKieuChuyenCan_Id).html(edu.util.returnEmpty(dtReRult[i].TONGSOBUOI))
                        $("#lblSoTiet_" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + strKieuChuyenCan_Id).html(edu.util.returnEmpty(dtReRult[i].TONGSOTIET))
                        //if (dtReRult[i].GIATRI == 1) {
                        //    //var check = $("#chkSelect" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                        //    //check.attr('checked', true);
                        //    //check.prop('checked', true);
                        //    //check.attr('name', dtReRult[i].GIATRI);
                        //    //var inputCheck = $("#input_" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                        //    //if (dtReRult[i].SOLUONG != 0) {
                        //    //    inputCheck.val(dtReRult[i].SOLUONG);
                        //    //    inputCheck.attr("name", dtReRult[i].SOLUONG);
                        //    //}
                        //}
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                //edu.system.alert(JSON.stringify(er), "w");
                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    save_NhapChuyenCan: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien, "QLSV_NGUOIHOC_ID");
        var strNgay = $(point).attr("title");
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        //--Edit
        var obj_save = {
            'action': 'CC_NguoiHoc_ChuyenCan/ThemMoi',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': "",
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDiem_DanhSach_Id': objSV.DANGKY_LOPHOCPHAN_ID,
            'strKieuChuyenCan_Id': arrId[1],
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("divprogessdata", function () {
                    me.endSetData();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NhapChuyenCan: function (point) {
        var me = this;
        //--Edit
        var today = new Date();
        var obj = {};
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien, "QLSV_NGUOIHOC_ID");
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        var obj_delete = {
            'action': 'CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan2',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': "",
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDiem_DanhSachHoc_Id': objSV.DANGKY_LOPHOCPHAN_ID,
            'strKieuChuyenCan_Id': arrId[1],
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                //edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                var obj = {
                    content: ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                //edu.system.start_Progress("divprogessdata", me.endGetData);
            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("divprogessdata", function () {
                    me.endSetData();
                });
            },
            contentType: true,
            //async: false,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endSetData: function () {
        main_doc.NguoiHoc.getList_SinhVien();
    },


    save_KhoiPhucDiemDanh: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CC_GiangVien_TuGhiNhan/XuLyDiemDanhKhongTonTaiTKB',
            'type': 'POST',
            'strDaoTao_LopHocPhan_Id': me.strLopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                var showAfterReload = function (notifyType, notifyContent) {
                    me.getList_SinhVien(null, function () {
                        edu.system.alertOnModal({ type: notifyType, content: notifyContent });
                    });
                };
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        showAfterReload("s", "Thực hiện thành công!");
                    }
                    else {
                        showAfterReload("i", "Cập nhật thành công!");
                    }
                }
                else {
                    var msg = edu.util.returnEmpty(data.Message);
                    if (!msg || /^[A-F0-9-]{16,}$/i.test(msg.trim())) {
                        showAfterReload("s", "Đã thực hiện xong");
                    } else {
                        edu.system.alertOnModal({ type: "w", content: msg });
                    }
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}