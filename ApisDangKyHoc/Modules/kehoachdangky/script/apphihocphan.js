/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function ApPhiHocPhan() { };
ApPhiHocPhan.prototype = {
    strApPhiHocPhan_Id: '',
    dtApPhiHocPhan: [],
    dtHocPhan: [],


    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_DotDangKy();
        me.getList_HeDaoTao();
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAICHUONGTRINH", "dropSearch_MoHinhHoc,dropMoHinhHoc");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        $("#tblApPhiHocPhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_ApPhiHocPhan(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = '';
            arrChecked_Id.forEach((e, index) => {
                var aData = me.dtHocPhan.find(ele => ele.DAOTAO_HOCPHAN_ID == e);
                html += '<tr id="' + aData.DAOTAO_HOCPHAN_ID + '">';
                html += '<td style="text-align: center">' + (index + 1) + '</td>';
                html += '<td style="text-align: center">' + aData.DAOTAO_HOCPHAN_TEN + " - " + aData.DAOTAO_HOCPHAN_MA + '</td>';
                html += '<td style="text-align: center"><input id="txtTinhPhi' + aData.DAOTAO_HOCPHAN_ID + '" class="form-control" ></td>';
                html += '<td style="text-align: center"><input id="txtMoTa' + aData.DAOTAO_HOCPHAN_ID + '" class="form-control" ></td>';
                html += '</tr>';
            })
            $("#tblXacNhan tbody").html(html);
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_XacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => me.save_HocPhan(e));
        });
        $("#btnSave_ApPhiHocPhan").click(function () {
            var arrThem = [];
            $("#tblApPhiHocPhan .tinhphamtram").each(function () {
                var strValue = $(this).attr("name");
                var x = $(this).val();
                console.log(x)
                console.log(strValue)
                if (x != strValue) arrThem.push(this.id.replace(/txtPhanTram/g, ''));
            })
            if (arrThem.length == 0) {
                edu.system.alert("Không có thay đổi để lưu");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length);
            arrThem.forEach(e => me.save_ApPhiHocPhan(e));
        });
        $("#btnDelete_ApPhiHocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblApPhiHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ApPhiHocPhan(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_ApPhiHocPhan();
            me.getList_HocPhan();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ApPhiHocPhan();
                me.getList_HocPhan();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblApPhiHocPhan" });
        });
        $("#chkSelectAll_HocPhan").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhan" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strApPhiHocPhan_Id = "";
        //edu.util.viewValById("dropThoiGian", edu.util.getValById("dropSearch_ThoiGian"));
        //edu.util.viewValById("dropHoatDong", edu.util.getValById("dropSearch_HoatDong"));
        //edu.util.viewValById("dropDiaDiem", edu.util.getValById("dropSearch_DiaDiem"));
        //edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        //edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        //edu.util.viewValById("txtHeSo", "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_DotDangKy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_ApPhiHocPhan/LayDSThoiGianApPhi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtApPhiHocPhan = dtReRult;
                    me.genTable_DotDangKy(dtReRult, data.Pager);
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
    genTable_DotDangKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_DotDangKy"],
            title: "Chọn đợt đăng ký"
        };
        edu.system.loadToCombo_data(obj);
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
            title: " Chọn đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ApPhiHocPhan: function (strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtApPhiHocPhan.find(e => e.DAOTAO_HOCPHAN_ID == strDaoTao_HocPhan_Id)
        //--Edit
        var obj_save = {
            'action': 'DKH_ApPhiHocPhan/CapNhatPhanTramTinhPhi',
            'type': 'POST',
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'dPhanTramTinhPhi': edu.util.getValById('txtPhanTram' + strDaoTao_HocPhan_Id),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    //me.getList_ApPhiHocPhan();
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
                    me.getList_ApPhiHocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ApPhiHocPhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_ApPhiHocPhan/LayDSApPhi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_DotDangKy'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtApPhiHocPhan = dtReRult;
                    me.genTable_ApPhiHocPhan(dtReRult, data.Pager);
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
    delete_ApPhiHocPhan: function (strDaoTao_HocPhan_Id) {
        var me = this;
        var aData = me.dtApPhiHocPhan.find(e => e.DAOTAO_HOCPHAN_ID == strDaoTao_HocPhan_Id)
        //--Edit
        var obj_delete = {
            'action': 'DKH_ApPhiHocPhan/HuyApPhi',
            'type': 'POST',
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
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
                    me.getList_ApPhiHocPhan();
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
    genTable_ApPhiHocPhan: function (data, iPager) {
        $("#lblApPhiHocPhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblApPhiHocPhan",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.ApPhiHocPhan.getList_ApPhiHocPhan()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 3,7,8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mData": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma",
                    "mRender": function (nRow, aData) {
                        return aData.DAOTAO_HOCPHAN_TEN + " - " + aData.DAOTAO_HOCPHAN_MA;
                    }
                },
                {
                    "mDataProp": "DSLOPHOCPHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtPhanTram' + aData.DAOTAO_HOCPHAN_ID + '" class="form-control tinhphamtram" value="' + edu.util.returnEmpty(aData.PHANTRAMPHITINH) + '" name="' + edu.util.returnEmpty(aData.PHANTRAMPHITINH) + '" />';
                    }
                },
                {
                    "mDataProp": "SOTIENPHAINOP"
                },
                {
                    "mDataProp": "NGAYRUT_DD_MM_YYYY"
                },
                {
                    "mDataProp": "NGUOIRUT_TAIKHOAN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.DAOTAO_HOCPHAN_ID + '"/>';
                    }
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
    save_HocPhan: function (strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtHocPhan.find(ele => ele.DAOTAO_HOCPHAN_ID == strDaoTao_HocPhan_Id)
        //--Edit
        var obj_save = {
            'action': 'DKH_ApPhiHocPhan/ThucHienApPhi',
            'type': 'POST',
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'dPhanTramTinhPhi': edu.util.getValById('txtTinhPhi' + strDaoTao_HocPhan_Id),
            'strMoTa': edu.util.getValById('txtMoTa' + strDaoTao_HocPhan_Id),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    //me.getList_ApPhiHocPhan();
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
                    me.getList_ApPhiHocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_ApPhiHocPhan/LayDSDangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_DotDangKy'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHocPhan = dtReRult;
                    me.genTable_HocPhan(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HocPhan: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.ApPhiHocPhan.getList_ApPhiHocPhan()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 3, 7, 8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mData": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma",
                    "mRender": function (nRow, aData) {
                        return aData.DAOTAO_HOCPHAN_TEN + " - " + aData.DAOTAO_HOCPHAN_MA;
                    }
                },
                {
                    "mDataProp": "DSLOPHOCPHAN"
                },
                {
                    "mDataProp": "DANHAPDIEM"
                },
                {
                    "mDataProp": "DADIEMDANH"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.DAOTAO_HOCPHAN_ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}