/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function NguyenVong() { };
NguyenVong.prototype = {
    strSinhVien_Id: '',
    strChuongTrinh_Id: '',
    strNguyenVong_Id: '',
    dtNguyenVong: [],
    dtChuaDangKy: [],
    dtDaDangKy: [],
    dtMoHinh: [],
    dtChuongTrinh: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.NGUYENVONG.MOHINH", "", "", data => me.dtMoHinh = data);
        me.getList_QuyMo();
        //$(".select-opt").select2();
        //me.getList_NguyenVong();
        //me.getList_ThoiGianDaoTao();
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        //$("#tblNguyenVong").delegate(".btnEdit", "click", function () {
        //    var strId = this.id;
        //    if (edu.util.checkValue(strId)) {
        //        me.viewForm_NguyenVong(strId);
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
        //$(".btnAdd").click(function () {
        //    me.popup();
        //    me.resetPopup();
        //});
        //$("#btnSave_NguyenVong").click(function () {
        //    me.save_NguyenVong();
        //});
        $("#btnDangKy").click(function () {
            if (!me.kiemTraBatBuoc()) return;
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanChuaDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_NguyenVong(arrChecked_Id[i]);
                }
            });
        });
        $("#btnHuyDangKy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanDaDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NguyenVong(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            if (!me.kiemTraBatBuoc()) return;
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
        });
        //$("#txtSearch_TuKhoa").keypress(function (e) {
        //    if (e.which === 13) {
        //        e.preventDefault();
        //        me.getList_NguyenVong();
        //    }
        //});
        //$("#chkSelectAll").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "tblNguyenVong" });
        //});
        $("#chkSelectAll_ChuaDangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhanChuaDangKy" });
        });
        $("#chkSelectAll_DaDangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhanDaDangKy" });
        });

        $('#dropSearch_KeHoachDangKy').on('select2:select', function (e) {
            $('#wrapKeHoach').removeClass('field-error');
            me.getList_KieuHoc();
            me.getList_ChuaDangKy();
            me.getList_QuyMo();
            var strId = $('#dropSearch_KeHoachDangKy').val();
            if (strId) {
                strId = me.dtKeHoachDangKy.find(e => e.ID == strId).SOTINCHITOIDA;
            }
            $("#txtSoTinToiDa").val(strId)
        });
        $('#dropSearch_KieuHoc').on('select2:select', function (e) {
            $('#wrapKieuHoc').removeClass('field-error');
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
        });
        $('#dropSearch_KeHoachDangKy, #dropSearch_KieuHoc').on('change', function () {
            if ($(this).val()) {
                $(this).closest('.aps-form-item').removeClass('field-error');
            }
        });
        $('#dropSearch_NganhDaoTao').on('select2:select', function (e) {
            var strId = $('#dropSearch_NganhDaoTao').val();
            var aData = me.dtChuongTrinh.find(x => x.DAOTAO_TOCHUCCHUONGTRINH_ID == strId);
            if (!aData) return;
            me.aDataSinhVien = aData;
            me.strChuongTrinh_Id = aData.DAOTAO_TOCHUCCHUONGTRINH_ID;
            $('#dropSearch_KeHoachDangKy').empty().trigger('change');
            $('#dropSearch_KieuHoc').empty().trigger('change');
            $('#txtSoTinToiDa').val('');
            me.getList_KeHoach();
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
        });
        setTimeout(function () {
            me.getDetail_SinhVien();
        }, 1000)
    },
    kiemTraBatBuoc: function () {
        $('#wrapKeHoach, #wrapKieuHoc').removeClass('field-error');
        var arrThieu = [];
        if (!edu.util.checkValue(edu.util.getValById('dropSearch_KeHoachDangKy'))) {
            $('#wrapKeHoach').addClass('field-error');
            arrThieu.push("Kế hoạch");
        }
        if (!edu.util.checkValue(edu.util.getValById('dropSearch_KieuHoc'))) {
            $('#wrapKieuHoc').addClass('field-error');
            arrThieu.push("Kiểu học");
        }
        if (arrThieu.length > 0) {
            edu.system.alert("Vui lòng chọn: " + arrThieu.join(", ") + "!", "w");
            return false;
        }
        return true;
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strNguyenVong_Id = "";
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
    save_NguyenVong: function (strId) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtChuaDangKy.find(e => e.ID === strId);
        //--Edit
        var obj_save = {
            'action': 'DKH_NguyenVong_MH/BSAvJgo4DyY0OCQvFy4vJgPP',
            'func': 'pkg_dangky_nguyenvong.DangKyNguyenVong',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoachDangKy'),
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDanhGia_Id': aData.DANHGIA_ID,
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strQuyMoLop_Id': edu.util.getValById('dropQuyMo_' + strId),
            'strMoHinhHoc_Id': edu.util.getValById('dropMoHinh_' + strId),
            'strDiem': aData.DIEM,
        };
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
                    //me.getList_NguyenVong();
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
                    me.getList_ChuaDangKy();
                    me.getList_DaDangKy();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ChuaDangKy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_NguyenVong_MH/DSA4BRIJLiIRKSAvAik0IAUgLyYKOAPP',
            'func': 'pkg_dangky_nguyenvong.LayDSHocPhanChuaDangKy',
            'iM': edu.system.iM,
            'strKeHoachNguyenVong_Id': edu.util.getValById('dropSearch_KeHoachDangKy'),
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChuaDangKy = dtReRult;
                    me.genTable_ChuaDangKy(dtReRult, data.Pager);
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
    getList_DaDangKy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_NguyenVong_MH/DSA4BRIJLiIRKSAvBSAFIC8mCjgP',
            'func': 'pkg_dangky_nguyenvong.LayDSHocPhanDaDangKy',
            'iM': edu.system.iM,
            'strKeHoachNguyenVong_Id': edu.util.getValById('dropSearch_KeHoachDangKy'),
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDaDangKy = dtReRult;
                    me.genTable_DaDangKy(dtReRult, data.Pager);
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
    delete_NguyenVong: function (Ids) {
        var me = this;
        var aData = me.dtDaDangKy.find(e => e.ID === Ids);
        //--Edit
        var obj_delete = {
            'action': 'DKH_NguyenVong_MH/CTQ4BSAvJgo4DyY0OCQvFy4vJgPP',
            'func': 'pkg_dangky_nguyenvong.HuyDangKyNguyenVong',
            'iM': edu.system.iM,
            'strIds': Ids,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_KeHoachDangKy_Id': aData.DANGKY_KEHOACHLAYNGUYENVONG_ID,
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
                    me.getList_ChuaDangKy();
                    me.getList_DaDangKy();
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
    genTable_ChuaDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanChuaDangKy",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.NguyenVong.getList_NguyenVong()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mData": "HOATDONG_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Mã học phần:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + '</span>';
                    }
                },
                {
                    "mData": "PHAMVIAPDUNG_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Tên học phần:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</span>';
                    }
                },
                {
                    "mData": "HESOQUYDOINguyenVong",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số tín chỉ:</em><span>' + edu.util.returnEmpty(aData.HOCTRINHAPDUNGHOCTAP) + '</span>';
                    }
                },
                {
                    "mData": "MOHINHHOC_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Kết quả:</em><span>' + edu.util.returnEmpty(aData.DIEM) + '</span>';
                    }
                },
                {
                    "mData": "PHANLOAIDIADIEM_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đánh giá:</em><span>' + edu.util.returnEmpty(aData.DANHGIA_TEN) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<div class="form-item d-flex  form-add-info"><div class="input-group"><i class="fal fa-book-reader"></i><select class="form-select" id="dropQuyMo_' + aData.ID + '"></select ></div></div>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<div class="form-item d-flex  form-add-info"><div class="input-group"><i class="fal fa-book-reader"></i><select class="form-select" id="dropMoHinh_' + aData.ID + '"></select ></div></div>';
                    }
                },
                {
                    "mDataProp": "THONGTINQUANHEHOCPHAN",
                },
                {
                    "mDataProp": "THUOCKHOIKIENTHUC",
                },
                {
                    "mDataProp": "THOIGIAN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblMucPhi' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (me.dtQuyMo.length) {
            data.forEach(e => me.cbGenCombo_QuyMo(e))
        } else {
            $('#tblHocPhanChuaDangKy td:nth-child(7)').hide();
            $('#tblHocPhanChuaDangKy th:nth-child(7)').hide();
        }
        if (me.dtMoHinh.length) {
            data.forEach(e => me.cbGenCombo_MoHinh(e))
        } else {

            $('#tblHocPhanChuaDangKy td:nth-child(8)').hide();
            $('#tblHocPhanChuaDangKy th:nth-child(8)').hide();
        }
        data.forEach(e => me.getDetail_MucPhiDuKien(e));
        /*III. Callback*/
    },
    genTable_DaDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanDaDangKy",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.NguyenVong.getList_NguyenVong()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mData": "HOATDONG_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Mã học phần:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + '</span>';
                    }
                },
                {
                    "mData": "PHAMVIAPDUNG_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Tên học phần:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</span>';
                    }
                },
                {
                    "mData": "HESOQUYDOINguyenVong",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số tín chỉ:</em><span>' + edu.util.returnEmpty(aData.HOCTRINHAPDUNGHOCTAP) + '</span>';
                    }
                },
                {
                    "mData": "MOHINHHOC_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Kết quả:</em><span>' + edu.util.returnEmpty(aData.DIEM) + '</span>';
                    }
                },
                {
                    "mData": "PHANLOAIDIADIEM_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đánh giá:</em><span>' + edu.util.returnEmpty(aData.DANHGIA_TEN) + '</span>';
                    }
                },
                {
                    "mData": "MOHINHHOC_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Thời gian:</em><span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
                    }
                },
                {
                    "mData": "PHANLOAIDIADIEM_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Người đăng ký:</em><span>' + edu.util.returnEmpty(aData.NGUOITAO_TAIKHOAN) + '</span>';
                    }
                },
                {
                    "mData": "PHANLOAIDIADIEM_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Quy mô:</em><span>' + edu.util.returnEmpty(aData.QUYMOLOP_TEN) + '</span>';
                    }
                },
                {
                    "mData": "PHANLOAIDIADIEM_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Mô hình:</em><span>' + edu.util.returnEmpty(aData.MOHINHHOC_TEN) + '</span>';
                    }
                },
                {
                    "mDataProp": "THONGTINQUANHEHOCPHAN",
                },
                {
                    "mDataProp": "THUOCKHOIKIENTHUC",
                },
                {
                    "mDataProp": "THOIGIAN",
                }, {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblMucPhi' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (me.dtQuyMo.length) {
            //data.forEach(e => me.cbGenCombo_QuyMo(e))
        } else {
            console.log(222222);
            $('#tblHocPhanDaDangKy td:nth-child(9)').hide();
            $('#tblHocPhanDaDangKy th:nth-child(9)').hide();
        }
        if (me.dtMoHinh.length) {
            //data.forEach(e => me.cbGenCombo_MoHinh(e))
        } else {
            console.log(222222444);
            $('#tblHocPhanDaDangKy td:nth-child(10)').hide();
            $('#tblHocPhanDaDangKy th:nth-child(10)').hide();
        }
        data.forEach(e => me.getDetail_MucPhiDuKien(e));
        /*III. Callback*/
    },
    viewForm_NguyenVong: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtNguyenVong, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropHoatDong", data.HOATDONG_ID);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAIDIADIEM_ID);
        edu.util.viewValById("dropPhamVi", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("txtHeSo", data.HESOQUYDOINguyenVong);
        edu.util.viewValById("dropMoHinhHoc", data.MOHINHHOC_ID);
        me.strNguyenVong_Id = data.ID;
    },

    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_NguyenVong_MH/DSA4BRIKJAkuICIpBSAvJgo4DyY0OCQvFy4vJgPP',
            'func': 'pkg_dangky_nguyenvong.LayDSKeHoachDangKyNguyenVong',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if ($("#btnDangKy").is(":hidden")) obj_save.action = 'DKH_NguyenVong/LayDSKeHoachDangKyNguyenVong2';
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtKeHoachDangKy"] = json;
                    me.cbGenCombo_KeHoach(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_KeHoachDangKy"],
            type: "",
            title: "Chọn kế hoạch đăng ký nguyện vọng",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_KieuHoc: function () {
        var me = this;
        if (!edu.util.getValById('dropSearch_KeHoachDangKy')) return;
        var obj_save = {
            'action': 'DKH_NguyenVong_MH/DSA4BRIKKCQ0BSAvJgo4FSkkLgokCS4gIikP',
            'func': 'pkg_dangky_nguyenvong.LayDSKieuDangKyTheoKeHoach',
            'iM': edu.system.iM,
            'strKeHoachNguyenVong_Id': edu.util.getValById('dropSearch_KeHoachDangKy'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KieuHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_KieuHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN"
            },
            renderPlace: ["dropSearch_KieuHoc"],
            type: "",
            title: "Chọn kiểu học"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_QuyMo: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_NguyenVong_MH/DSA4BRIQNDgMLg0uMQUgLyYKOAPP',
            'func': 'pkg_dangky_nguyenvong.LayDSQuyMoLopDangKy',
            'iM': edu.system.iM,
            'strDangKy_NguyenVong_Id': edu.util.getValById('dropSearch_KeHoachDangKy'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            //'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtQuyMo"] = json;
                    //me.cbGenCombo_QuyMo(json, aData);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_QuyMo: function (aData) {
        var me = this;
        var obj = {
            data: me.dtQuyMo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropQuyMo_" + aData.ID],
            type: "",
            title: "Chọn quy mô",
        };
        edu.system.loadToCombo_data(obj);
    },

    cbGenCombo_MoHinh: function (aData) {
        var me = this;
        var obj = {
            data: me.dtMoHinh,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropMoHinh_" + aData.ID],
            type: "",
            title: "Chọn hình thức học",
        };
        edu.system.loadToCombo_data(obj);
    },

    getDetail_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4BRICKTQuLyYVMygvKQPP',
            'func': 'pkg_dangkyhoc_chung.LayDSChuongTrinh',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        me.dtChuongTrinh = data.Data;
                        me.cbGenCombo_NganhDaoTao(data.Data);
                        me.aDataSinhVien = data.Data[0];
                        me.viewForm_SinhVien(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_NganhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_TOCHUCCHUONGTRINH_TEN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_NganhDaoTao"],
            type: "",
            title: "Chọn ngành học",
        };
        edu.system.loadToCombo_data(obj);
    },
    viewForm_SinhVien: function (aData) {
        var me = this;
        $("#lblHoTen").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN));
        $("#lblMaSinhVien").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO));
        me.strChuongTrinh_Id = aData.DAOTAO_TOCHUCCHUONGTRINH_ID;

        me.getList_KeHoach();
        me.getList_ChuaDangKy();
        me.getList_DaDangKy();
    },

    getDetail_MucPhiDuKien: function (aDataHocPhan) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'TC_TinhTien_MH/DSA4BRIRKSgVKSQuCS4iESkgLwPP',
            'func': 'pkg_taichinh_tinhtien.LayDSPhiTheoHocPhan',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDangKy_KeHoachDangKy_Id': edu.system.getValById('dropSearch_KeHoachDangKy'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ThoiGianDaoTao_Id': aDataHocPhan.DAOTAO_THOIGIANDAOTAO_ID,
            'strDaoTao_HocPhan_Id': aDataHocPhan.DAOTAO_HOCPHAN_ID,
            'strDangKy_SV_LopHocPhan_Id': aDataHocPhan.ID,
            'strKieuHoc_Id': edu.system.getValById('dropSearch_KieuHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (data.Data.length > 0) {
                        var aDataMP = data.Data[0];
                        $("#lblMucPhi" + aDataHocPhan.ID).html(edu.util.returnEmpty(aDataMP.PHIPHAIDONG) - edu.util.returnEmpty(aDataMP.PHIDUOCMIEN))
                    }
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

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