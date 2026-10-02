/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KhoiLuongCaNhan() { };
KhoiLuongCaNhan.prototype = {
    strKhoiLuongCaNhan_Id: '',
    dtKhoiLuongCaNhan: [],
    strNguoiDung_Id: '',
    init: function () {
        var me = this;
        me['strHead'] = $("#tblDuyetBuoiHoc thead").html();
        me.strNguoiDung_Id = edu.system.userId;
        me.getList_CCTC();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_BangTinh();
        me.getList_CCTC();
        //me.getList_HS();
        $("#tblKhoiLuongCaNhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                var objData = me.dtKhoiLuongCaNhan.find(e => e.ID === strId);
                me.getList_DuLieuChiTiet(objData);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKhoiLuongCaNhan").delegate(".btnDuyet", "click", function () {
            var strId = this.id;
            me['strLopHocPhan_Id'] = strId;
            $("#modal_duyetbuoihoc").modal('show');
            me.getList_GiangVien();
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_KhoiLuongCaNhan").click(function () {
            me.save_KhoiLuongCaNhan();
        });
        $("#btnXoaKhoiLuongCaNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiLuongCaNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhoiLuongCaNhan(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_KhoiLuongCaNhan();
        });

        $("#btnSearchToanBo").click(function () {
            me.getList_KhoiLuongCaNhanToanBo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhoiLuongCaNhan();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhoiLuongCaNhan" });
        });
        $('#dropSearch_BangTinh').on('select2:select', function (e) {

            me.getList_KhoiLuongCaNhan();
        });
        $('#dropSearch_DonViThanhVien').on('select2:select', function (e) {

            me.getList_HS();
        });
        $('#dropSearch_CanBo').on('select2:select', function (e) {
            me.strNguoiDung_Id = $("#dropSearch_CanBo").val();
            me.getList_BangTinh();
        });

        edu.system.getList_MauImport("zonebtnBaoCao_KLCN", function (addKeyValue) {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiHoc", "checkX");
            var obj_list = {
                'strKLGD_KeHoachChitiet_Id': edu.util.getValById('dropSearch_BangTinh'),
                'strNguoiDung_Id': main_doc.KhoiLuongCaNhan.strNguoiDung_Id,
            };
            //arrChecked_Id.forEach(e => {
            //    addKeyValue('strDaoTao_LopHocPhan_Id', e);
            //});

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strKhoiLuongCaNhan_Id = "";
        edu.util.viewValById("dropThoiGian", edu.util.getValById("dropSearch_ThoiGian"));
        edu.util.viewValById("dropHoatDong", edu.util.getValById("dropSearch_HoatDong"));
        edu.util.viewValById("dropDiaDiem", edu.util.getValById("dropSearch_DiaDiem"));
        edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtHeSo", "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_BangTinh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSKeHoachKLGDChiTietCaNhan',
            'type': 'GET',
            'strNguoiDung_Id': me.strNguoiDung_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtKhoiLuongCaNhan = dtReRult;
                    me.genCombo_BangTinh(dtReRult.rs, data.Pager);
                    if (dtReRult.rsThongTin) {
                        var aData = dtReRult.rsThongTin[0];
                        $("#lblHoTen").html(edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN))
                        $("#lblMaSo").html(edu.util.returnEmpty(aData.MASO))
                        $("#lblDonVi").html(edu.util.returnEmpty(aData.DAOTAO_COCAUTOCHUC_TEN))
                    }
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
    genCombo_BangTinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropSearch_BangTinh"],
            title: "Chọn bảng tính"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KhoiLuongCaNhan: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HeSo_KhoiLuongCaNhan/ThemMoi',

            'strId': me.strKhoiLuongCaNhan_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'strHoatDong_Id': edu.util.getValById('dropHoatDong'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strPhamViApDung_Id': edu.util.getValById('dropPhamVi'),
            'strPhanLoaiDiaDiem_Id': edu.util.getValById('dropPhanLoai'),
            'dHeSoQuyDoiKhoiLuongCaNhan': edu.util.getValById('txtHeSo'),
            'strMoHinhHoc_Id': edu.util.getValById('dropMoHinhHoc'),
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HeSo_KhoiLuongCaNhan/CapNhat';
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
                    me.getList_KhoiLuongCaNhan();
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
    getList_KhoiLuongCaNhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSDuLieuKLCaNhan',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': edu.util.getValById('dropSearch_BangTinh'),
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhoiLuongCaNhan = dtReRult;
                    me['dtLopHocPhan'] = dtReRult;
                    me.genTable_KhoiLuongCaNhan(dtReRult, data.Pager);
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
    getList_KhoiLuongCaNhanToanBo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIFNA0oJDQKDQIgDykgLxUuLyYJLjEP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSDuLieuKLCaNhanTongHop',
            'iM': edu.system.iM,
            'strKLGD_KeHoachChitiet_Id': edu.system.getValById('dropSearch_BangTinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhoiLuongCaNhan = dtReRult;
                    me['dtLopHocPhan'] = dtReRult;
                    me.genTable_KhoiLuongCaNhan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    delete_KhoiLuongCaNhan: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_KhoiLuongCaNhan/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
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
                    me.getList_KhoiLuongCaNhan();
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
    genTable_KhoiLuongCaNhan: function (data, iPager) {
        $("#lblKhoiLuongCaNhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoiLuongCaNhan",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KhoiLuongCaNhan.getList_KhoiLuongCaNhan()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 1, 3, 5, 6, 7, 8,9 ,10 ,11, 12],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDuyet" id="' + aData.ID + '" title="Duyệt">Duyệt buổi học</a></span>';
                    }
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "DONVI_PHUTRACH_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "TONGPHANBO"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mDataProp": "VAITRO_TEN"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "SOGIOCHUAN"
                },
                {
                    "mDataProp": "TINHTRANGXACNHAN_TEN"
                },
                {
                    "mDataProp": "GHICHU"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(jsonForm.strTable_Id, [11, 9, 10,12])
        $("#tblKhoiLuongCaNhan tfoot").css({'text-align': 'center'})
        /*III. Callback*/
    },
    viewForm_KhoiLuongCaNhan: function (objData, data, dataCot) {
        var me = this;
        //call popup --Edit
        $("#modal_lichgiang").modal('show');
        $("#lblModalLable").html(objData.GHICHU);
        $("#tblModalLichGiang thead").html("");
        $("#tblModalLichGiang tbody").html("");
        var strHead = "";
        var arrHead = [];
        var arrNoiDung = [];
        switch (objData.LOAI) {
            case "KLGD_DULIEU_LICHGIANG": {
                arrHead = ["Ngày học", "Tiết bắt đầu", "Tiết kết thúc", "Số tiết", "Số sinh viên", "Học phần", "Lớp học phần", "Giờ chuẩn"];
                arrNoiDung = [{
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "TIETBATDAU"
                },
                {
                    "mDataProp": "TIETKETTHUC"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "GIOCHUAN"
                }]
            }; break;
            case "KLGD_DULIEU_LAMSAN": {
                arrHead = ["Ngày đi", "Số ngày", "Số sinh viên", "Số tín chỉ", "Học phần", "Lớp học phần", "Giờ chuẩn"];
                arrNoiDung = [{
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mDataProp": "SOTINCHIHOCPHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "GIOCHUAN"
                }]
            }; break;
            case "KLGD_DULIEU_DOANKHOALUAN": {
                arrHead = ["Số sinh viên", "Số tín chỉ", "Học phần", "Lớp học phần", "Giờ chuẩn"];
                arrNoiDung = [
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mDataProp": "SOTINCHIHOCPHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "GIOCHUAN"
                }]
            }; break;
            case "KLGD_DULIEU_DOANKHOALUAN": {
                arrHead = ["Vai trò", "Giờ chuẩn"];
                arrNoiDung = [
                    {
                        "mDataProp": "VAITRO_TEN"
                    },
                    {
                        "mDataProp": "GIOCHUAN"
                    }]
            }; break;
            case "KLGD_DULIEU_HOIDONG": {
                arrHead = ["Giờ chuẩn"];
                arrNoiDung = [
                    {
                        "mDataProp": "GIOCHUAN"
                    }]
            }; break;
        }
        strHead += '<tr><th  rowspan="2" class="text-center w-50px" scope="col">STT</th>';
        arrHead.forEach(e => strHead += '<th rowspan="2" class="text-center" scope="col">' + e + '</th>');
        if (dataCot.length) {
            strHead += '<th colspan="' + dataCot.length + '" class="text-center" scope="col">' + dataCot[0].XAUCONGTHUC + '</th>'
        }
        strHead += '</tr>';
        if (dataCot.length) {
            strHead += '<tr>';
            dataCot.forEach(e => strHead += '<th class="text-center" scope="col">' + e.TENTUKHOA + '</th>');
            strHead += '</tr>';
        }
        $("#tblModalLichGiang thead").html(strHead);
        var arrSum = [8];
        var jsonForm = {
            strTable_Id: "tblModalLichGiang",
            aaData: data,
            colPos: {
                center: [0],
            },
            "aoColumns": arrNoiDung
        };
        var iLength = arrHead.length;
        dataCot.forEach((e, index) => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span id="ketqua_' + aData.ID + '_' + main_doc.KhoiLuongCaNhan.dtDoiTuong_View[iThuTu].ID + '"></span>';
                }
            })
            arrSum.push((index + iLength + 1));
        })
        jsonForm.colPos.center = jsonForm.colPos.center.concat(arrSum);
        edu.system.loadToTable_data(jsonForm);
        console.log(jsonForm.colPos.center);
        data.forEach(e => dataCot.forEach(ele => me.getList_KetQua(e.ID, ele.TUKHOA, ele.ID)))

        //edu.system.insertSumAfterTable(jsonForm.strTable_Id, arrSum)
        //$("#tblModalLichGiang tfoot").css({ 'text-align': 'center' })
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_DuLieuChiTiet: function (objData) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_ThongTin/LayDSDuLieu_ChiTiet',
            'type': 'GET',
            'strKLGD_KeHoachChiTiet_Id': objData.KLGD_KEHOACHCHITIET_ID,
            'strLoai': objData.LOAI,
            'strId': objData.ID,
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDoiTuong_View"] = dtReRult.rsThanhPhanCongThuc;
                    me.viewForm_KhoiLuongCaNhan(objData, dtReRult.rs, dtReRult.rsThanhPhanCongThuc);
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
    getList_KetQua: function (strKLGD_DuLieu_Loai_Id, strTuKhoa, strTuKhoa_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_ThongTin/LayGiaTriTuKhoa',
            'type': 'GET',
            'strTuKhoa': strTuKhoa,
            'strKLGD_DuLieu_Loai_Id': strKLGD_DuLieu_Loai_Id,
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult) $("#ketqua_" + strKLGD_DuLieu_Loai_Id + "_" + strTuKhoa_Id).html(dtReRult[0].GIATRITUKHOA)
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien: function () {
        var me = this;
        var aData = me.dtLopHocPhan.find(e => e.ID == me.strLopHocPhan_Id);
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': aData.KLGD_KEHOACHCHITIET_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDaoTao_LopHocPhan_Id': aData.DULIEUXACNHAN,
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtGiangVien = dtResult;
                    me.getList_DuyetBuoiHoc();
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
    getList_DuyetBuoiHoc: function () {
        var me = this;

        var aData = me.dtLopHocPhan.find(e => e.ID == me.strLopHocPhan_Id);
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSDuLieuLichGiangDuyet',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': aData.KLGD_KEHOACHCHITIET_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDaoTao_LopHocPhan_Id': aData.DULIEUXACNHAN,
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtDuyetBuoiHoc = dtResult;
                    me.genTable_DuyetBuoiHoc(dtResult, iPager);
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
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DuyetBuoiHoc: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblDuyetBuoiHoc";
        $("#tblDuyetBuoiHoc thead").html(me.strHead);
        var arrDoiTuong = me.dtGiangVien;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th style="text-align: center" class="border-left"><input type="checkbox" class="chkSelectAll pointer" id="chkSelectAll_' + arrDoiTuong[j].ID + '"></td>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="text-center border-left main_doc.KhoiLuongCaNhan" scope="col" >Xác nhận</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="text-center border-left main_doc.KhoiLuongCaNhan" scope="col" >Tình trạng</th>');
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th colspan="3" class="td-center  border-left">' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_HODEM) + ' ' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_TEN) + ' - ' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_MASO) + '</th>');
        }

        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "THU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return (aData.SOTIET) + " (" + aData.TIETBATDAU + " -> " + aData.TIETKETTHUC + ")";
                    }
                }
            ]
        };
        var htmlfoot = "";
        arrDoiTuong.forEach(e => {
            htmlfoot += '<td colspan="3" id="sum' + e.ID + '"></td>';
        })
        $("#" + strTable_Id + " tfoot tr:eq(0)").html('<td colspan="' + (jsonForm.aoColumns.length + 1) + '"></td>' + htmlfoot)
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<div id="divcheck_' + aData.ID + '_' + main_doc.KhoiLuongCaNhan.dtDoiTuong_View[iThuTu].ID + '"></div>';
                        //return '<input type="checkbox" id="lblDiem_' + aData.ID + '_' + main_doc.KhoiLuongCaNhan.dtDoiTuong_View[iThuTu].ID + '" class="check' + main_doc.KhoiLuongCaNhan.dtDoiTuong_View[iThuTu].ID +'" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="xacnhan_' + aData.ID + '_' + main_doc.KhoiLuongCaNhan.dtDoiTuong_View[iThuTu].ID + '"></span>';
                        //return '<input type="checkbox" id="lblDiem_' + aData.ID + '_' + main_doc.KhoiLuongCaNhan.dtDoiTuong_View[iThuTu].ID + '" class="check' + main_doc.KhoiLuongCaNhan.dtDoiTuong_View[iThuTu].ID +'" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="tinhtrang_' + aData.ID + '_' + main_doc.KhoiLuongCaNhan.dtDoiTuong_View[iThuTu].ID + '"></span>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        //if (data.rsNhanSu.length > 0) {
        //    edu.system.genHTML_Progress("divprogessdata", data.rsNhanSu.length * data.rsLoaiSanPham.length);
        //}
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < arrDoiTuong.length; j++) {
                me.getList_KetQua2(data[i], arrDoiTuong[j].ID);
            }
        }
        edu.system.genHTML_Progress("zoneprocessDuyetBuoiHoc", (data.length * arrDoiTuong.length));
        /*III. Callback*/
    },
    getList_KetQua2: function (objLichGiang, strNguoiDung_Id) {
        var me = this;
        $("#divcheck_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left').addClass('td-center');
        $("#xacnhan_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left');
        $("#tinhtrang_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left');
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG',
            'type': 'GET',
            'strNguoiDung_Id': strNguoiDung_Id,
            'strKLGD_DuLieu_LichGiang_Id': objLichGiang.ID,
            'strKLGD_KeHoachChitiet_Id': objLichGiang.KLGD_KEHOACHCHITIET_ID,
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    if (dtResult.length) {
                        dtResult = dtResult[0];
                        dtResult.COLICH != '0' ? $("#divcheck_" + objLichGiang.ID + "_" + strNguoiDung_Id).html('<input type="checkbox" id="checkX' + objLichGiang.ID + '_' + strNguoiDung_Id + '" class="check' + strNguoiDung_Id + ' checkdata" />') : null;
                        var lblXacNhan = "";
                        switch (dtResult.XACNHANDONGY_KHONGDONGY) {
                            case "1": { lblXacNhan = '<span><i class="fas fa-check-circle text-success"></i></span>'; $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).prop('checked', true); $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).attr('checked', 'checked'); $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).attr('name', (objLichGiang.SOTIET)); }; break;
                            case "0": lblXacNhan = '<span><i class="fas fa-times-circle text-danger"></i></span>'; break;
                            default: lblXacNhan = "";
                        }
                        $("#xacnhan_" + objLichGiang.ID + "_" + strNguoiDung_Id).html(lblXacNhan)
                        var lblDiemDanh = "";
                        switch (dtResult.TINHTRANGDIEMDANH) {
                            case "1": lblDiemDanh = 'Có điểm danh'; break;
                            case "0": lblDiemDanh = 'Không điểm danh'; break;
                            default: lblDiemDanh = "";
                        }
                        $("#tinhtrang_" + objLichGiang.ID + "_" + strNguoiDung_Id).html(lblDiemDanh)
                    }
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
            complete: function () {
                edu.system.start_Progress("zoneprocessDuyetBuoiHoc", function () {
                    me.dtGiangVien.forEach(e => {
                        var iTongSo = 0;
                        var x = $(".check" + e.ID).each(function () {
                            if ($(this).is(':checked')) {
                                iTongSo += parseInt($(this).attr("name"))
                            }
                        })
                        $("#sum" + e.ID).html("Tổng số tiết: " + iTongSo);
                    });
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },


    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CCTC: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSKhoaQuanLyPhanQuyen',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    me.genComBo_CCTC(dtResult);
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
            complete: function () {

            },
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
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
            renderPlace: ["dropSearch_DonViThanhVien"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HS: function () {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearch_DonViThanhVien");
        var strTinhTrangNhanSu_Id = edu.util.getValById("dropSearch_CapNhat_TinhTrangLamViec");
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_CapNhat_TuKhoa"),
            pageIndex: 1,
            pageSize: 1000000,
            strCoCauToChuc_Id: strCoCauToChuc,
            strTinhTrangNhanSu_Id: strTinhTrangNhanSu_Id,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': -1
        };
        edu.system.getList_NhanSu(obj, "", "", me.genCombo_CanBo);
    },
    genCombo_CanBo: function (data) {
        //main_doc.LichGiang["dtCanBoTimKiem"] = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MASO) + " - " + edu.util.returnEmpty(aData.DAOTAO_COCAUTOCHUC_TEN)
                }
            },
            renderPlace: ["dropSearch_CanBo"],
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },
}