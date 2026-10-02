/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function HocPhan() { };
HocPhan.prototype = {
    strHocPhan_Id: '',
    dtHocPhan: [],
    dtDoiTuong_View: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_CCTC();
        edu.extend.genBoLoc_HeKhoa("_CB");
        edu.system.loadToCombo_DanhMucDuLieu("KH.PHANLOAI.HOCPHAN.LOAILOP", "dropSearch_PhanLoaiLop", "", data => me["dtPhanLoaiLop"] = data);
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAIXACNHAN", "dropSearch_LoaiXacNhan", "", data => me["dtPhanLoaiXN"] = data);
        $("#dropSearch_LoaiXacNhan").on("select2:select", function () {
            me.getList_BtnXacNhan();
        });
        $("#btnSearch").click(function () {
            me.getList_HocPhan();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HocPhan();
            }
        });
        $("#btnSearch_CB").click(function () {
            me.getList_HocPhanCB();
        });
        $("#txtSearch_TuKhoa_CB").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HocPhan_CB();
            }
        });

        $("#btnLuuQuyMo").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblHocPhan tbody input.doituongcheck");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).val() != edu.util.returnEmpty($(x[i]).attr("name"))) {
                    if ($(x[i]).val()) {
                        arrThem.push(x[i]);
                    } else {
                        arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length + arrXoa.length);
                    
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_QuyMo(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_QuyMo(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnLuuSoTiet").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblHocPhan tbody input.sotietcheck");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).val() != edu.util.returnEmpty($(x[i]).attr("name"))) {
                    if ($(x[i]).val()) {
                        arrThem.push(x[i]);
                    } else {
                        arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length + arrXoa.length);

                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_SoTiet(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_SoTiet(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnXoaHocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HocPhan(arrChecked_Id[i]);
                }
            });
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXacNhan", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanTN(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
        $("#btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");

            me.getList_XacNhanTN(arrChecked_Id.toString(), "tblModal_XacNhan");
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_QuyMo: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/Them_KH_PhanLoai_HP_QuyMo',
            'type': 'POST',
            'strPhanLoaiLop_Id': arrId[2],
            'strDaoTao_HocPhan_Id': arrId[1],
            'dQuyMo': $(point).val(),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    delete_QuyMo: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/Xoa_KH_PhanLoai_HP_QuyMo',
            'type': 'POST',
            'strPhanLoaiLop_Id': arrId[2],
            'strDaoTao_HocPhan_Id': arrId[1],
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan();
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
        var obj_save = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_HocPhan',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_MonHoc_Id': edu.util.getValById('dropAAAA'),
            'strThuocBoMon_Id': edu.util.getValById('dropSearch_DonVi'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        //if (!obj_save.strThuocBoMon_Id) {
        //    edu.system.alert("Bạn cần chọn đơn vị");
        //    return;
        //}
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHocPhan = dtReRult;
                    me.genTable_HocPhan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HocPhanCB: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_HocPhan_CT',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa_CB'),
            'strDaoTao_ThoiGian_KH_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGian_TT_Id': edu.util.getValById('dropAAAA'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strPhanCongPhamViDamNhiem_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHocPhan = dtReRult;
                    me.genTable_HocPhanCB(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_SoTiet: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        //--Edit
        let dSoTiet = $(point).val();
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/FSkkLB4KCR4RKSAvDS4gKB4JER4SLhUoJDUP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Them_KH_PhanLoai_HP_SoTiet',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': arrId[2],
            'strDaoTao_HocPhan_Id': arrId[1],
            'dSoTietPhanBo': dSoTiet ? dSoTiet : undefined,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    delete_SoTiet: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/GS4gHgoJHhEpIC8NLiAoHgkRHhIuFSgkNQPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Xoa_KH_PhanLoai_HP_SoTiet',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': arrId[2],
            'strDaoTao_HocPhan_Id': arrId[1],
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan();
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
    genTable_HocPhan: function (data, iPager) {
        var me = this;
        var thead = '';
        var arrDoiTuong = me.dtPhanLoaiLop;
        var strDoiTuong_Id = edu.util.getValById("dropSearch_PhanLoaiLop");

        if (strDoiTuong_Id != "") {
            arrDoiTuong = me.dtPhanLoaiLop.filter(e => e.ID == strDoiTuong_Id);
        }
        me.dtDoiTuong_View = arrDoiTuong;

        thead += '<tr><th class="td-center" colspan="5">Thông tin học phần</th><th class="td-center" colspan="' + me.dtDoiTuong_View.length + '">Số tiết phần bổ</th><th class="td-center" colspan="' + me.dtDoiTuong_View.length + '">Quy mô</th>';
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center" colspan="' + me.dtPhanLoaiXN.length + '">' + aData.TEN + '</th>');
        thead += '<th class="td-center" rowspan="2"><input type="checkbox" class="chkSystemSelectAll" /></th></tr>';

        thead += '<tr><th class="td-fixed td-center">Stt</th><th class="td-center">Mã</th><th class="td-center">Tên</th><th class="td-center">Số tín chỉ</th><th class="td-center">Đơn vị</th>';
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center">' + aData.TEN + '</th>');
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center">' + aData.TEN + '</th>');

        let temp = '';
        me.dtPhanLoaiXN.forEach(aData => temp += '<th class="td-center">' + aData.TEN + '</th>');
        me.dtDoiTuong_View.forEach(aData => thead += temp);
        thead += '<tr/>';
        console.log(thead)
        $("#tblHocPhan thead").html(thead);

        $("#lblHocPhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HocPhan.getList_HocPhan()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "THUOCBOMON_TEN"
                }
            ]
        };
        me.dtDoiTuong_View.forEach(aData => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    if (edu.system.icolumn == main_doc.HocPhan.dtDoiTuong_View.length) edu.system.icolumn = 0;
                    return '<input id="txtSoTiet_' + aData.DAOTAO_HOCPHAN_ID + '_' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID + '" class="form-control sotietcheck" />';
                }
            })
        })
        me.dtDoiTuong_View.forEach(aData => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<input id="txtQuyMo_' + aData.DAOTAO_HOCPHAN_ID + '_' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID + '" class="form-control doituongcheck" />';
                }
            })
        })
        edu.system.icolumn = 0;
        me.dtDoiTuong_View.forEach(aData => {
            var iThuTu = edu.system.icolumn++;
            edu.system["icolumn2"] = 0;
            me.dtPhanLoaiXN.forEach(e => {
                jsonForm.aoColumns.push({
                    "mRender": function (nRow, aData) {
                        var iThuTu2 = edu.system.icolumn2++;
                        if (edu.system.icolumn2 == main_doc.HocPhan.dtPhanLoaiXN.length) edu.system.icolumn2 = 0;
                        console.log(iThuTu2);
                        return '<span id="lblHanhDong_' + aData.DAOTAO_HOCPHAN_ID + '_' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID + '_' + main_doc.HocPhan.dtPhanLoaiXN[iThuTu2].ID + '" />';
                    }
                })
            })
        })
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
            }
        })
        edu.system.loadToTable_data(jsonForm);
        data.forEach(aData => {
            me.dtDoiTuong_View.forEach(e => {
                me.getList_QuyMo(aData.DAOTAO_HOCPHAN_ID, e.ID);
                me.getList_SoTiet(aData.DAOTAO_HOCPHAN_ID, e.ID);
                me.dtPhanLoaiXN.forEach(ele => {
                    me.getList_HanhDong(aData.DAOTAO_HOCPHAN_ID, e.ID, ele.ID);
                })
            })
        })
        edu.system.move_ThroughInTable(jsonForm.strTable_Id);
        /*III. Callback*/
    },

    genTable_HocPhanCB: function (data, iPager) {
        var me = this;
        var thead = '';
        var arrDoiTuong = me.dtPhanLoaiLop;
        var strDoiTuong_Id = edu.util.getValById("dropSearch_PhanLoaiLop");

        if (strDoiTuong_Id != "") {
            arrDoiTuong = me.dtPhanLoaiLop.filter(e => e.ID == strDoiTuong_Id);
        }
        me.dtDoiTuong_View = arrDoiTuong;

        thead += '<tr><th class="td-center" colspan="5">Thông tin học phần</th><th class="td-center" colspan="' + me.dtDoiTuong_View.length + '">Số tiết phần bổ</th><th class="td-center" colspan="' + me.dtDoiTuong_View.length + '">Quy mô</th>';
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center" colspan="' + me.dtPhanLoaiXN.length + '">' + aData.TEN + '</th>');
        thead += '<th class="td-center" rowspan="2"><input type="checkbox" class="chkSystemSelectAll" /></th></tr>';

        thead += '<tr><th class="td-fixed td-center">Stt</th><th class="td-center">Mã</th><th class="td-center">Tên</th><th class="td-center">Số tín chỉ</th><th class="td-center">Đơn vị</th>';
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center">' + aData.TEN + '</th>');
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center">' + aData.TEN + '</th>');

        let temp = '';
        me.dtPhanLoaiXN.forEach(aData => temp += '<th class="td-center">' + aData.TEN + '</th>');
        me.dtDoiTuong_View.forEach(aData => thead += temp);
        thead += '<tr/>';
        console.log(thead)
        $("#tblHocPhan thead").html(thead);

        $("#lblHocPhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HocPhan.getList_HocPhanCB()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "THUOCBOMON_TEN"
                }
            ]
        };

        me.dtDoiTuong_View.forEach(aData => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    if (edu.system.icolumn == main_doc.HocPhan.dtDoiTuong_View.length) edu.system.icolumn = 0;
                    return '<input id="txtSoTiet_' + aData.DAOTAO_HOCPHAN_ID + '_' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID + '" class="form-control sotietcheck" />';
                }
            })
        })
        me.dtDoiTuong_View.forEach(aData => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<input id="txtQuyMo_' + aData.DAOTAO_HOCPHAN_ID + '_' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID + '" class="form-control doituongcheck" />';
                }
            })
        })
        edu.system.icolumn = 0;
        me.dtDoiTuong_View.forEach(aData => {
            var iThuTu = edu.system.icolumn++;
            edu.system["icolumn2"] = 0;
            me.dtPhanLoaiXN.forEach(e => {
                jsonForm.aoColumns.push({
                    "mRender": function (nRow, aData) {
                        if (edu.system.icolumn2 == main_doc.HocPhan.dtPhanLoaiXN.length) edu.system.icolumn2 = 0;
                        var iThuTu2 = edu.system.icolumn2++;
                        console.log(iThuTu2);
                        return '<span id="lblHanhDong_' + aData.DAOTAO_HOCPHAN_ID + '_' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID + '_' + main_doc.HocPhan.dtPhanLoaiXN[iThuTu2].ID + '" />';
                    }
                })
            })
        })
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
            }
        })
        edu.system.loadToTable_data(jsonForm);
        data.forEach(aData => {
            me.dtDoiTuong_View.forEach(e => {
                me.getList_QuyMo(aData.DAOTAO_HOCPHAN_ID, e.ID);
                me.getList_SoTiet(aData.DAOTAO_HOCPHAN_ID, e.ID);
                me.dtPhanLoaiXN.forEach(ele => {
                    me.getList_HanhDong(aData.DAOTAO_HOCPHAN_ID, e.ID, ele.ID);
                })
            })
        })

        edu.system.move_ThroughInTable(jsonForm.strTable_Id);
        /*III. Callback*/
    },

    getList_SoTiet: function (strDaoTao_HocPhan_Id, strPhanLoaiLop_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BiggFTMoCgkeESkgLw0uICgeCREeEi4VKCQ1',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayGiaTriKH_PhanLoai_HP_SoTiet',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(aData => {
                        $("#txtSoTiet_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id).val(edu.util.returnEmpty(aData.SOTIETPHANBO));
                        $("#txtSoTiet_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id).attr("name", edu.util.returnEmpty(aData.SOTIETPHANBO));
                    })
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    getList_QuyMo: function (strDaoTao_HocPhan_Id, strPhanLoaiLop_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/LayGiaTriKH_PhanLoai_HP_QuyMo',
            'type': 'POST',
            'strPhanLoaiLop_Id': strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'dQuyMo': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            //'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(aData => {
                        $("#txtQuyMo_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id).val(edu.util.returnEmpty(aData.QUYMO));
                        $("#txtQuyMo_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id).attr("name", edu.util.returnEmpty(aData.QUYMO));
                    })
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HanhDong: function (strDaoTao_HocPhan_Id, strLoaiXacNhan_Id, strPhanLoaiLop_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/LayTTKH_PhanLoai_HP_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': strPhanLoaiLop_Id,
            'strPhanLoaiLop_Id': strLoaiXacNhan_Id,
            'strDuLieuXacNhan': strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(aData => {
                        $("#lblHanhDong_" + strDaoTao_HocPhan_Id + "_" + strLoaiXacNhan_Id + "_" + strPhanLoaiLop_Id ).html(edu.util.returnEmpty(aData.HANHDONG_TEN));
                    })
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
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
            renderPlace: ["dropSearch_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },


    loadBtnXacNhan: function (data) {
        main_doc.HocPhan.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px; max-width: 800px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fal fa-check-circle";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-3x"></i></a>';
            row += '<a class="color-active">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
    getList_BtnXacNhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/LayHanhDongXacNhanNguoiDung',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiXacNhan_Id': edu.util.getValById('dropSearch_LoaiXacNhan'),
            'iM': edu.system.iM,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadBtnXacNhan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanTN: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': edu.util.getValById('dropSearch_LoaiXacNhan'),
            'strHanhDong_Id': strTinhTrang_Id,
            'strNguoiXacNhan_Id': edu.system.userId,
            'strThongTinXacNhan': strNoiDung,
            'strDuLieuXacNhan': strSanPham_Id,
            'strPhanLoaiLop_Id': edu.util.getValById('dropSearch_PhanLoaiLop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanTN: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/LayDSKH_PhanLoai_XacNhan',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strHoSoDuTuyen_Id,
            'strLoaiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'strPhanLoaiLop_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanTN(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_XacNhanTN: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
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
}