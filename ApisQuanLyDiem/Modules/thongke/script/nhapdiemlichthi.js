/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function NhapDiemLichThi() { };
NhapDiemLichThi.prototype = {
    dtTuiBai: [],
    dtNhapDiem: [],
    strNhapDiem_Id: '',
    strTuiBai_Id: '',

    init: function () {
        var me = this;
        me["strThead"] = $("#tblThongKe thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGian();
        me.getList_DotThi();
        me.getList_MonThi();
        me.getList_HinhThucThi();
        me.getList_LoaiDiem();
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        //me.getList_ThongKe();


        $("#btnSearch").click(function (e) {
            me.getList_TenCot();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TenCot();
            }
        });
        
        $('#dropSearch_DSThi').on('select2:select', function (e) {
            me.getList_NhapDiem();
            //me.getList_ThongKe();
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            //me.getList_ThongKe();
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_LoaiDiem();
            //me.getList_ThongKe();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {

            //me.getList_TenCot();
            me.getList_MonThi();
        });
        $('#dropSearch_MonThi').on('select2:select', function (e) {

            //me.getList_TenCot();
        });

        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            //me.getList_ThongKe();
        });

        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            //me.getList_ThongKe();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_ThongKe", function (addKeyValue) {
            addKeyValue("strThi_DotThi_Id", edu.util.getValCombo("dropSearch_DotThi"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_HocPhan"));
            addKeyValue("strDangKy_KeHoachDangKy_Id", edu.util.getValCombo("dropSearch_KeHoach"));
            addKeyValue("strHinhThucThi_Id", edu.util.getValCombo("dropSearch_HinhThuc"));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_ThoiGian"));
            addKeyValue("strDiem_ThanhPhanDiem_Id", edu.util.getValCombo("dropSearch_LoaiDiem"));
            addKeyValue("strHoanThanhNhapDiem_Id", edu.util.getValCombo("dropSearch_HoanThanhNhapDiem"));
            //addKeyValue("strDanhSachThi_Id", main_doc.NhapDiemLichThi.strTuiBai_Id);
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            //arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });

        edu.system.loadToCombo_DanhMucDuLieu("DIEM.TRANGTHAILOC", "", "", data => {
            var obj = {
                data: data,
                renderInfor: {
                    id: "MA",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropSearch_HoanThanhNhapDiem"],
                type: "",
                title: "Chọn lọc",
            };
            edu.system.loadToCombo_data(obj);
        });


        $("#tblThongKe").delegate('.btnChiTiet', 'click', function (e) {
            var strId = this.id;
            $("#myModal").modal("show");
            me.getList_ThanhPhan(strId); 

        });

        $("#btnThongKe").click(function () {
            me.getList_ThongKeDiem();
        });
    },
    
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_ThongKe();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThongKe: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSThiTheoDotThi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'dLocKhongHoanThanhNhapDiem': $("#dropSearch_HoanThanhNhapDiem").val() == "" ? 0 : $("#dropSearch_HoanThanhNhapDiem").val(),
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ThongKe(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ThongKe: function (data, iPager) {
        var me = this;
        $("#tblThongKe thead").html(me.strThead);
        me.dtTenCot.forEach(e => {
            $("#tblThongKe thead tr").eq(0).append('<th class="td-center" colspan="2">' + e.TEN + '</th>');
            $("#tblThongKe thead tr").eq(1).append('<th class="td-center" >SL</th><th class="td-center">Tỷ lệ %</th>');
        });
        $("#tblThongKe thead tr").eq(0).append('<th class="td-center td-fixed" rowspan="2"><input type="checkbox" class="chkSystemSelectAll"></th>');
        var jsonForm = {
            strTable_Id: "tblThongKe",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiemLichThi.getList_ThongKe()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            arrClassName: ["btnChiTiet"],
            aoColumns: [
                {
                    "mDataProp": "NGAYTHI"
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.THI_CATHI_TEN) + '(' + edu.util.returnEmpty(aData.GIOBATDAU) + "h" + edu.util.returnEmpty(aData.PHUTBATDAU) + '--> ' + edu.util.returnEmpty(aData.GIOKETTHUC) + "h" + edu.util.returnEmpty(aData.PHUTKETTHUC) + ")";
                    }
                },

                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTIN"
                },
                {
                    "mDataProp": "HINHTHUCTHI_TEN"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    "mDataProp": "DOTTHI_TEN"
                },
                {
                    "mDataProp": "DSCONGTHUCDIEM"
                },
                {
                    "mDataProp": "DONVIPHUTRACHHOCPHAN_TEN"
                },
                {
                    "mDataProp": "TYLEHOANTHANHTKHP"
                }
            ]
        };
        me.dtTenCot.forEach(e => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn;
                    return '<span id="lblSL_' + aData.ID + '_' + main_doc.NhapDiemLichThi.dtTenCot[iThuTu].ID + '"></span>';
                }
            },
            {
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span id="lblPhanTram_' + aData.ID + '_' + main_doc.NhapDiemLichThi.dtTenCot[iThuTu].ID + '"></span>';
                }
            });
        });
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
            }
        });
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            me.dtTenCot.forEach(ele => me.getList_KetQua(e, ele.ID, ele.TEN));
        });
    },

    getList_KetQua: function (objHang, strTenCot_Id, strTenCot) {
        var me = this;
        var obj_list = {
            'action': 'TP_Chung/LayTTTienDoNhapDiemTheoDST',
            'type': 'GET',
            'strNgayThi': objHang.NGAYTHI,
            'strCaThi_Id': objHang.IDCATHI,
            'strThi_DotThi_Id': objHang.IDDOTTHI,
            'strDaoTao_HocPhan_Id': objHang.IDMONTHI,
            'strCongThucDiem': objHang.CONGTHUC,
            'strDiem_ThanhPhanDiem_Id': strTenCot_Id,

            'strThi_DanhSachThi_Id': objHang.ID,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    if (dtResult.length > 0) {
                        for (var i = 0; i < dtResult.length; i++) {
                            if (dtResult[i].SOSV == "x" || dtResult[i].TYLE == "x") continue;
                            edu.util.viewHTMLById("lblSL_" + objHang.ID + '_' + strTenCot_Id, dtResult[i].SOSV);
                            edu.util.viewHTMLById("lblPhanTram_" + objHang.ID + '_' + strTenCot_Id, dtResult[i].TYLE);
                        }
                    }
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
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TenCot: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSLoaiDiemMonThiTheoDotThi',
            'type': 'GET',
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtTenCot"] = dtReRult;
                    me.getList_ThongKe();
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayThoiGian',
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
            title: "Chọn thời gian",
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
            'action': 'TP_Chung/LayDotThi',
            'type': 'GET',
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
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
                avatar: ""
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
    getList_MonThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHocPhan',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_MonThi(json);
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
    cbGenCombo_MonThi: function (data) {
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
            renderPlace: ["dropSearch_MonThi"],
            type: "",
            title: "Chọn môn thi",
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
            'action': 'TP_Chung/LayLoaiDiem',
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
    getList_HinhThucThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHinhThucThi',
            'type': 'GET',
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HinhThucThi(json);
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
    cbGenCombo_HinhThucThi: function (data) {
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
            renderPlace: ["dropSearch_HinhThuc"],
            type: "",
            title: "Chọn hình thức thi",
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_ThanhPhan: function (strThi_DanhSachThi_Id) {
        var me = this;
        var obj_list = {
            'action': 'TP_Chung/LayDSLopHocPhanTheoDST',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strThi_DanhSachThi_Id': strThi_DanhSachThi_Id,
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
                    me.genTable_ThanhPhan(dtResult);
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
    genTable_ThanhPhan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThanhPhan",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN",
                },
                {
                    "mDataProp": "TINHTRANGXACNHANNHAPDIEM",
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },


    getList_ThongKeDiem: function () {
        var me = this;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblThongKe", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Vui lòng chọn đối tượng?");
            return;
        }
        console.log(arrChecked_Id)
        edu.util.toggle_overide("zone-bus", "zoneEdit");

        //--Edit
        var obj_save = {
            'action': 'D_ThongKe_MH/FSkuLyYJLiIVIDEVKSQuBRIV',
            'func': 'pkg_diem_thongke.ThongHocTapTheoDST',
            'iM': edu.system.iM,
            'strThi_DanhSachThi_1_Id': arrChecked_Id.slice(0, 100).toString(),
            'strThi_DanhSachThi_2_Id': arrChecked_Id.slice(101, 200).toString(),
            'strThi_DanhSachThi_3_Id': arrChecked_Id.slice(201, 300).toString(),
            'strThi_DanhSachThi_4_Id': arrChecked_Id.slice(301, 400).toString(),
            'strThi_DanhSachThi_5_Id': arrChecked_Id.slice(401, 500).toString(),
            'strThi_DanhSachThi_6_Id': arrChecked_Id.slice(501, 600).toString(),
            'strThi_DanhSachThi_7_Id': arrChecked_Id.slice(601, 700).toString(),
            'strThi_DanhSachThi_8_Id': arrChecked_Id.slice(701, 800).toString(),
            'strThi_DanhSachThi_9_Id': arrChecked_Id.slice(801, 900).toString(),
            'strThi_DanhSachThi_10_Id': arrChecked_Id.slice(901, 1000).toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        console.log(obj_save);
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThongKe"] = dtReRult;
                    me.genTable_ThongKeDiemChu(dtReRult);
                    me.genTable_ThongKeDanhGia(dtReRult);
                    me.genTable_ThongKeDiem10(dtReRult);
                    me.genTable_ThongKeDiem4(dtReRult);
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
    genTable_ThongKeDiemChu: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblTKDiemChu";
        $("#" + strTable_Id + " thead").html('<th class="td-center td-fix">Stt</th><th class="td-left">Khoa quản lý</th><th class="td-left">Học phần</th>');
        var arrDoiTuong = data.rsDanhMucDiemChu;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead").append('<th class="td-center">' + arrDoiTuong[j].TEN + '</th>');
        }
        $("#" + strTable_Id + " thead").append('<th class="td-center">Sum</th>');

        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data.rsThongTinHocPhan,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                }
            ]
        };

        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        let iThuTu = edu.system.icolumn++;
                        let strDiemQuyDoi_Id = main_doc.NhapDiemLichThi.dtDoiTuong_View[iThuTu].ID;
                        return '<span class="' + strDiemQuyDoi_Id + '" id="lblDiem_' + aData.ID + '_' + strDiemQuyDoi_Id + '"></span>';
                    }
                }
            );
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<span id="lblDiemSum_' + aData.ID + '"></span>';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        data.rsThongTinHocPhan.forEach(aData => {
            let iTong = 0;
            arrDoiTuong.forEach(aDt => {
                let dtDiem = data.rsDuLieuDiemChu.filter(e => e.DAOTAO_HOCPHAN_ID == aData.DAOTAO_HOCPHAN_ID  && e.DIEMQUYDOI_ID == aDt.ID);
                $("#" + strTable_Id + " #lblDiem_" + aData.DAOTAO_HOCPHAN_ID + '_' + aDt.ID).html(dtDiem.length)
                iTong += dtDiem.length;
            })
            $("#" + strTable_Id + " #lblDiemSum_" + aData.DAOTAO_HOCPHAN_ID).html(iTong)
        })
        edu.system.actionRowSpan(strTable_Id, [1]);
        let arrSum = [];
        arrDoiTuong.forEach((e, index) => arrSum.push(3 + index))
        edu.system.insertSumAfterTable(strTable_Id, arrSum)
    },
    genTable_ThongKeDanhGia: function (data, iPager) {
        var me = this;
        var me = this;
        var strTable_Id = "tblTKDanhGia";
        $("#" + strTable_Id + " thead").html('<th class="td-center td-fix">Stt</th><th class="td-left">Khoa quản lý</th><th class="td-left">Học phần</th>');
        var arrDoiTuong = data.rsDanhMucDanhGia;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead").append('<th class="td-center">' + arrDoiTuong[j].TEN + '</th>');
        }
        $("#" + strTable_Id + " thead").append('<th class="td-center">Sum</th>');

        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data.rsThongTinHocPhan,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                }
            ]
        };

        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        let iThuTu = edu.system.icolumn++;
                        let strDiemQuyDoi_Id = main_doc.NhapDiemLichThi.dtDoiTuong_View[iThuTu].ID;
                        return '<span class="' + strDiemQuyDoi_Id + '" id="lblDiem_' + aData.ID + '_' + strDiemQuyDoi_Id + '"></span>';
                    }
                }
            );
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<span id="lblDiemSum_' + aData.ID + '"></span>';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        data.rsThongTinHocPhan.forEach(aData => {
            let iTong = 0;
            arrDoiTuong.forEach(aDt => {
                let dtDiem = data.rsDuLieuDanhGia.filter(e => e.DAOTAO_HOCPHAN_ID == aData.DAOTAO_HOCPHAN_ID && e.DAOTAO_KHOAQUANLY_ID == aData.DAOTAO_KHOAQUANLY_ID && e.DANHGIA_ID == aDt.ID);
                $("#" + strTable_Id + " #lblDiem_" + aData.DAOTAO_HOCPHAN_ID + '_' + aDt.ID).html(dtDiem.length)
                iTong += dtDiem.length;
            })
            $("#" + strTable_Id + " #lblDiemSum_" + aData.DAOTAO_HOCPHAN_ID).html(iTong)
        })
        edu.system.actionRowSpan(strTable_Id, [1]);
        let arrSum = [];
        arrDoiTuong.forEach((e, index) => arrSum.push(3 + index))
        edu.system.insertSumAfterTable(strTable_Id, arrSum)
    },
    genTable_ThongKeDiem10: function (data, iPager) {
        var me = this;
        var me = this;
        var strTable_Id = "tblTKDiem10";
        $("#" + strTable_Id + " thead").html('<th class="td-center td-fix">Stt</th><th class="td-left">Khoa quản lý</th><th class="td-left">Học phần</th>');
        var arrDoiTuong = data.rsDanhMucDiemHe10;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead").append('<th class="td-center">' + arrDoiTuong[j].TEN + '</th>');
        }
        $("#" + strTable_Id + " thead").append('<th class="td-center">Sum</th>');

        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data.rsThongTinHocPhan,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                }
            ]
        };

        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        let iThuTu = edu.system.icolumn++;
                        let strDiemQuyDoi_Id = main_doc.NhapDiemLichThi.dtDoiTuong_View[iThuTu].ID.toString().replace('.', '');
                        return '<span class="' + strDiemQuyDoi_Id + '" id="lblDiem_' + aData.ID + '_' + strDiemQuyDoi_Id + '"></span>';
                    }
                }
            );
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<span id="lblDiemSum_' + aData.ID + '"></span>';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        data.rsThongTinHocPhan.forEach(aData => {
            let iTong = 0;
            arrDoiTuong.forEach(aDt => {
                let dtDiem = data.rsDuLieuDiemHe10.filter(e => e.DAOTAO_HOCPHAN_ID == aData.DAOTAO_HOCPHAN_ID && e.DAOTAO_KHOAQUANLY_ID == aData.DAOTAO_KHOAQUANLY_ID && e.DIEM == aDt.ID);
                $("#" + strTable_Id + " #lblDiem_" + aData.DAOTAO_HOCPHAN_ID + '_' + aDt.ID.toString().replace('.', '')).html(dtDiem.length)
                iTong += dtDiem.length;
            })
            $("#" + strTable_Id + " #lblDiemSum_" + aData.DAOTAO_HOCPHAN_ID).html(iTong)
        })
        edu.system.actionRowSpan(strTable_Id, [1]);
        let arrSum = [];
        arrDoiTuong.forEach((e, index) => arrSum.push(3 + index))
        edu.system.insertSumAfterTable(strTable_Id, arrSum)
    },
    genTable_ThongKeDiem4: function (data, iPager) {
        var me = this;
        var me = this;
        var strTable_Id = "tblTKDiem4";
        $("#" + strTable_Id + " thead").html('<th class="td-center td-fix">Stt</th><th class="td-left">Khoa quản lý</th><th class="td-left">Học phần</th>');
        var arrDoiTuong = data.rsDanhMucDiemHe4;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead").append('<th class="td-center">' + arrDoiTuong[j].TEN + '</th>');
        }
        $("#" + strTable_Id + " thead").append('<th class="td-center">Sum</th>');

        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data.rsThongTinHocPhan,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                }
            ]
        };

        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        let iThuTu = edu.system.icolumn++;
                        let strDiemQuyDoi_Id = main_doc.NhapDiemLichThi.dtDoiTuong_View[iThuTu].ID.toString().replace('.', '');;
                        return '<span class="' + strDiemQuyDoi_Id + '" id="lblDiem_' + aData.ID + '_' + strDiemQuyDoi_Id + '"></span>';
                    }
                }
            );
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<span id="lblDiemSum_' + aData.ID + '"></span>';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        data.rsThongTinHocPhan.forEach(aData => {
            let iTong = 0;
            arrDoiTuong.forEach(aDt => {
                let dtDiem = data.rsDuLieuDiemHe4.filter(e => e.DAOTAO_HOCPHAN_ID == aData.DAOTAO_HOCPHAN_ID && e.DAOTAO_KHOAQUANLY_ID == aData.DAOTAO_KHOAQUANLY_ID && e.DIEMQUYDOI == aDt.ID);
                $("#" + strTable_Id + " #lblDiem_" + aData.DAOTAO_HOCPHAN_ID + '_' + aDt.ID.toString().replace('.', '')).html(dtDiem.length)
                iTong += dtDiem.length;
            })
            $("#" + strTable_Id + " #lblDiemSum_" + aData.DAOTAO_HOCPHAN_ID).html(iTong)
        })
        edu.system.actionRowSpan(strTable_Id, [1]);
        let arrSum = [];
        arrDoiTuong.forEach((e, index) => arrSum.push(3 + index))
        edu.system.insertSumAfterTable(strTable_Id, arrSum)
    },
}