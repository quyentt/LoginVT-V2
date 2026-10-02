/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function NhapDiemHocPhan() { };
NhapDiemHocPhan.prototype = {
    dtTuiBai: [],
    dtNhapDiem: [],
    strNhapDiem_Id: '',
    strTuiBai_Id: '',
    bcheck: true,

    init: function () {
        var me = this;
        me["strThead"] = $("#tblThongKe thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_KeHoach();
        me.getList_HocPhan();
        me.getList_KhoaQuanLy();
        me.getList_DotThi();
        //me.getList_ThongKe();


        $("#btnSearch").click(function (e) {
            me.getList_TenCot();
        });
        $("#btnSearchLop").click(function (e) {
            me.getList_TenCot();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TenCot();
            }
        });

        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_HocPhan();
            me.getList_KhoaQuanLy();
            //me.getList_TenCot();
            //me.getList_DuLieuThi();
        });
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            me.getList_HocPhan();
            //me.getList_TenCot();
            //me.getList_DuLieuThi();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            //me.getList_TenCot();
        });

        edu.system.getList_MauImport("zonebtnBaoCao_ThongKe", function (addKeyValue) {
            addKeyValue("strThi_DotThi_Id", edu.util.getValCombo("dropSearch_DotThi"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_HocPhan"));
            addKeyValue("strDangKy_KeHoachDangKy_Id", edu.util.getValCombo("dropSearch_KeHoach"));
            addKeyValue("strDaoTao_KhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy"));
            addKeyValue("strHinhThucThi_Id", edu.util.getValCombo("dropSearch_HinhThuc"));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_ThoiGian"));
            addKeyValue("strDiem_ThanhPhanDiem_Id", edu.util.getValCombo("dropSearch_LoaiDiem"));
            addKeyValue("strHoanThanhNhapDiem_Id", edu.util.getValCombo("dropSearch_HoanThanhNhapDiem"));
            //addKeyValue("strDanhSachThi_Id", main_doc.NhapDiemHocPhan.strTuiBai_Id);
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            //arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThongKe: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': me.bcheck ? 'TP_ToChucThi/LayDSLopHocPhanTatCa' : 'TP_ToChucThi/LayDSHocPhanTheoKeHoach2',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
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
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
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
        var jsonForm = {
            strTable_Id: "tblThongKe",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiemHocPhan.getList_ThongKe()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: me.bcheck ? [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTIN"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    "mDataProp": "DSGIANGVIEN"
                },
                {
                    "mDataProp": "DONVIPHUTRACHHOCPHAN_TEN"
                },
                {
                    "mDataProp": "CONGTHUC"
                },
                {
                    "mDataProp": "HANNOPDIEM"
                },
                {
                    "mDataProp": "DOTTHI_TEN"
                },
                {
                    "mDataProp": "TYLEHOANTHANHTKHP"
                }
            ] :
                [
                    {
                        "mDataProp": "MA"
                    },
                    {
                        "mDataProp": "TEN"
                    },
                    {
                        "mDataProp": "HOCTRINH"
                    },
                    {
                        "mDataProp": "SOSV"
                    },
                    {
                        "mDataProp": "DONVIPHUTRACHHOCPHAN_TEN"
                    },
                    {
                        "mDataProp": "CONGTHUC"
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
                    return '<span id="lblSL_' + aData.ID + '_' + main_doc.NhapDiemHocPhan.dtTenCot[iThuTu].ID + '"></span>';
                }
            },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="lblPhanTram_' + aData.ID + '_' + main_doc.NhapDiemHocPhan.dtTenCot[iThuTu].ID + '"></span>';
                    }
                });
        });
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            me.dtTenCot.forEach(ele => me.getList_KetQua(e, ele.ID));
        });
        if (data.length < 20) {
            var point = document.getElementById("tblThongKe").parentNode
            //var h = document.getElementById("main-content-wrapper").offsetHeight;
            //var x = point.offsetTop;
            $(point).css("height", "unset");
        } else {
            var point = document.getElementById("tblThongKe").parentNode
            var h = document.getElementById("main-content-wrapper").offsetHeight;
            var x = point.offsetTop;
            $(point).css("height", (h - x) + "px");
        }
    },

    getList_KetQua: function (objHang, strTenCot_Id) {
        var me = this;
        var obj_list = {
            'action': me.bcheck ? 'TP_ToChucThi/LayTTTienDoNhapDiemTheoLopHP' : 'TP_ToChucThi/LayTTTienDoNhapDiemTheoHP',
            'type': 'GET',
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_LopHocPhan_Id': objHang.ID,
            'strDiem_ThanhPhanDiem_Id': strTenCot_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strCongThucDiem': objHang.CONGTHUC,
            'strDaoTao_HocPhan_Id': objHang.ID,
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
        me.bcheck = $("#btnSearchLop").is(':visible') ? true : false;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSLoaiDiemTheoKeHoach',
            'type': 'GET',
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
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
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
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
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSDangKy_KeHoachDangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_KeHoach(dtReRult, data.Pager);
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
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaQuanLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSKhoaQLTheoKeHoach',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_KhoaQuanLy(dtReRult, data.Pager);
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
    genCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_KHOAQUANLY_TEN",
            },
            renderPlace: ["dropSearch_KhoaQuanLy"],
            title: "Chọn khoa quản lý"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HocPhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_ToChucThi/LayDSHocPhanTheoKeHoach',
            'type': 'GET',
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                name: "DAOTAO_THOIGIANDAOTAO",
                mRender: function (nRow, aData) {
                    return aData.MA + " - " + aData.TEN;
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
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

}