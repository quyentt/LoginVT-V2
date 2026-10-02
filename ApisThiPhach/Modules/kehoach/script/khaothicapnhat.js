/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KhaoThi() { };
KhaoThi.prototype = {
    dtXacNhan: [],
    strXacNhan_Id: '',
    dtDanhSachThi: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_TinhTrang();
        me.getList_btnCongBo();
        //edu.system.loadToCombo_DanhMucDuLieu("THI.TINHTRANGVANGTHI_VIPHAMQUYCHETHI", "", "", me.loadBtnXacNhan);
        me.getList_ThoiGian();
        me.getList_LoaiDiem();
        
        $("#btnSearch").click(function (e) {
            me.getList_KhaoThi();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KhaoThi();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        
        $("[id$=chkSelectAll_XacNhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblXacNhan" });
        });
        

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXacNhan", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var objTemp = me.dtDSThi.find(e => e.ID === arrChecked_Id[i]).IDDANHSACHTHI;
                me.save_XacNhan(arrChecked_Id[i] + objTemp, strTinhTrang, strMoTa);
            }
        });
        $("#zoneBtnCongBo").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungCongBo");
            $("#modal_CongBo").modal('hide');
            var arrChecked_Id = $("#dropSearch_DotThi").val();
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);

            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_CongBo(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
        $("#btnXacNhan").click(function () {
            $("#txtNoiDungXacNhan").val("");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXacNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");
            if (arrChecked_Id.length == 1) {
                var objTemp = me.dtDSThi.find(e => e.ID === arrChecked_Id[i]).IDDANHSACHTHI;
                me.getList_XacNhan(arrChecked_Id[0] + objTemp, "tblModal_XacNhan");
            }
        });

        $("#btnCongBoLich").click(function () {
            var arrChecked_Id = $("#dropSearch_DotThi").val();
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đợt thi!");
                return;
            }
            $("#modal_CongBo").modal("show");
            
        });


        $('#dropSearch_ThoiGian').on('select2:select', function (e) {
            me.getList_LoaiDiem();
            me.getList_DotThi();
        });

        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {
            me.getList_HocPhan();
            me.getList_CaThi();
            me.getList_DanhSachThi();
            $("#txtSearch_NgayThi").val("")
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            me.getList_CaThi();
            me.getList_DanhSachThi();
            $("#txtSearch_NgayThi").val("")
        });
        $('#dropSearch_CaThi').on('select2:select', function (e) {
            me.getList_DanhSachThi();
            $("#txtSearch_NgayThi").val("")
        });
        $('#dropSearch_DanhSach').on('select2:select', function (e) {
            me.getList_KhaoThi();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_KT", function (addKeyValue) {
            var obj_list = {
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
                'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
                'strThi_DanhSachThi_Id': edu.util.getValById('dropSearch_DanhSach'),
                'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
                'strTHI_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });


        $("#btnXemDieuKienThi").click(function (e) {
            $("#txtNoiDungXacNhan").val("");
            $("#myModalLabelViPham").html("Danh sách cấm thi");
            me.getList_DieuKienThi();
        }); 

        $("#btnViPhamQuyChe").click(function (e) {
            $("#txtNoiDungXacNhan").val("");
            $("#myModalLabelViPham").html("Danh sách sinh viên vi phạm quy chế");
            me.getList_ViPhamQuyChe();
        });
        $("#txtSearch_NgayThi").on("keyup", function () {
            var value = ($(this).val() || "").toLowerCase();
            var dtTemp = me.dtDanhSachThi.filter(function (e) {
                var strCombined = me.buildDanhSachThiLabel(e).toLowerCase();
                return strCombined.indexOf(value) != -1;
            });
            me.cbGenCombo_DanhSachThi(dtTemp)
        });
    },
    
    loadBtnXacNhan: function (data) {
        main_doc.KhaoThi.dtXacNhan = data;
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
    loadBtnCongBo: function (data) {
        //main_doc.KhaoThi.dtXacNhan = data;
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
        $("#zoneBtnCongBo").html(row);
    },
    
    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    getList_KhaoThi: function () {
        var me = this;
        //--Edit
        //var obj_list = {
        //    'action': 'TP_ToChucThi/LayDSThiChiTiet',
        //    'type': 'GET',
        //    'strThi_DanhSachThi_Id': edu.util.getValById('dropSearch_DanhSach'),
        //    'strNguoiThucHien_Id': edu.system.userId,
        //};
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSThiChiTietTheoDieuKien',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strThi_CaThi_Id': edu.util.getValById('dropSearch_CaThi'),
            'strNgayThi': edu.util.getValById('txtSearch_NgayThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strTHI_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strThi_DanhSachThi_Id': edu.util.getValById('dropSearch_DanhSach'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDSThi"] = data.Data;
                    me.genTable_KhaoThi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_KhaoThi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblXacNhan",
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
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                
                {
                    "mDataProp": "THI_DANHSACHTHI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " (" + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + ")";
                    }
                }
                ,
                {
                    "mDataProp": "HINHTHUCTHI_TEN"
                },
                {
                    "mDataProp": "TRANGTHAI"
                },
                {
                    "mDataProp": "SOBAODANH"
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSThoiGian',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_ThoiGian: function (data) {
        var me = this;
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
            title: "Chọn học kỳ",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LoaiDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSThanhPhanDiemSauThi',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiDiem(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_LoaiDiem: function (data) {
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
            renderPlace: ["dropSearch_LoaiDiem"],
            type: "",
            title: "Chọn loại điểm",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_DotThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSDotThi',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_DotThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_DotThi: function (data) {
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
                    return edu.util.returnEmpty(aData.TENDOTTHI) + " - " + edu.util.returnEmpty(aData.NGAYBD) + " - " + edu.util.returnEmpty(aData.NGAYKT)
                }
            },
            renderPlace: ["dropSearch_DotThi"],
            type: "",
            title: "Chọn đợt thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_ToChucThi/LayDSHocPhan',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strHinhThucThi_Id': edu.util.getValById('dropAAAA'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            
            'strTHI_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HocPhan(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
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
                    return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " (" + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + ")";
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_DanhSachThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSThi',
            'type': 'GET',
            'strThi_CaThi_Id': edu.util.getValById('dropSearch_CaThi'),
            'strNgayThi': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strTHI_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtDanhSachThi"] = json;
                    //var strNgayThi = $("#txtSearch_NgayThi").val();
                    //if (strNgayThi) json = me.dtDanhSachThi.filter(e => e.MADANHSACHTHI.indexOf(strNgayThi) != -1);
                    me.cbGenCombo_DanhSachThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    buildDanhSachThiLabel: function (aData) {
        var parts = [
            aData.MADANHSACHTHI,
            aData.NGAYTHI,
            aData.THI_CATHI_TEN,
            aData.TKB_PHONGHOC_TEN
        ];
        return parts
            .map(function (v) { return v == null ? "" : String(v).trim(); })
            .filter(function (v) { return v.length > 0; })
            .join(" - ");
    },
    cbGenCombo_DanhSachThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MADANHSACHTHI",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return me.buildDanhSachThiLabel(aData);
                }
            },
            renderPlace: ["dropSearch_DanhSach"],
            type: "",
            title: "Chọn danh sách thi",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_CaThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSCaThi',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strTHI_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_CaThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_CaThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "CATHI_TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_CaThi"],
            type: "",
            title: "Chọn ca thi",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhan: function (strHoSoDuTuyen_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'TP_XacNhanSauThi/ThemMoi',
            'strId': "",
            'strSanPham_Id': strHoSoDuTuyen_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KhaoThi();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhan: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'TP_XacNhanSauThi/LayDanhSach',
            'strTuKhoa': "",
            'strsanpham_Id': strHoSoDuTuyen_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': '',
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
                    me.genTable_XacNhan(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_XacNhan: function (data, strTable_Id) {
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
    getList_TinhTrang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayTrangThaiSauThi',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data)

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

    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_CongBo: function (strHoSoDuTuyen_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'TP_CongBoLichThi/Them_CongBoLichThi_DotThi',
            'strId': "",
            'strSanPham_Id': strHoSoDuTuyen_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KhaoThi();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CongBo: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'TP_XacNhanSauThi/LayDanhSach',
            'strTuKhoa': "",
            'strsanpham_Id': strHoSoDuTuyen_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': '',
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
                    me.genTable_CongBo(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_CongBo: function (data, strTable_Id) {
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
    getList_btnCongBo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayTrangThaiCongBoLich',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnCongBo(data.Data)

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


    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    getList_DieuKienThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_BaoCao/LayDSViPhamQuyCheTruocThi',
            'type': 'GET',
            'strThi_DanhSachThi_Id': edu.util.getArrCheckedIds("tblXacNhan", "checkX").toString(),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ViPham(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_ViPhamQuyChe: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_BaoCao/LayDSViPhamQuyCheSauThi',
            'type': 'GET',
            'strThi_DanhSachThi_Id': edu.util.getArrCheckedIds("tblXacNhan", "checkX").toString(),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ViPham(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ViPham: function (data, iPager) {
        $("#modal_ViPham").modal("show");
        var me = this;
        var jsonForm = {
            strTable_Id: "tblViPham", 
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mData": "DaoTao_HocPhan_Ten (DaoTao_HocPhan_Ma)",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " (" + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + ")";
                    }
                },
                {
                    "mDataProp": "NGAYTHI"
                },
                {
                    "mDataProp": "TRANGTHAI"
                },
                {
                    "mDataProp": "LYDO"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}