/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KetQuaKhaoSat() { };
KetQuaKhaoSat.prototype = {
    dtKeHoachKhaoSat: [],
    strCanBo_Id: '',

    init: function () {
        var me = this;
        me.strCanBo_Id = edu.system.userId;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_KeHoach();
        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_Phieu();
        });
        $('#dropSearch_Phieu').on('select2:select', function (e) {
            me.getList_KetQuaKhaoSat();
        });
        $("#btnSearch").click(function (e) {
            me.getList_KetQuaKhaoSat();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KetQuaKhaoSat();
            }
        });
        edu.system.getList_MauImport("zonebtnBaoCao_KetQuaKhaoSat", function (addKeyValue) {
            addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao"));
            addKeyValue("strNganh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh"));
            addKeyValue("strNam_Id", edu.util.getValCombo("dropSearch_NamNhapHoc"));
            //addKeyValue("strDanhSachThi_Id", main_doc.NhapDiemHocPhan.strTuiBai_Id);
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            //arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });
        $('#dropSearch_CanBo').on('select2:select', function () {
            var strId = $('#dropSearch_CanBo').val();
            if (strId)
                me.strCanBo_Id = strId;
            else me.strCanBo_Id = edu.system.userId;

            me.getList_KeHoach();
        });
        if ($("#dropSearch_CanBo").length > 0) me.getList_HS();
    },

    getList_KetQuaKhaoSat: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSKetQuaKhaoSatCaNhan',
            'type': 'GET',
            'strKS_KeHoachKhaoSat_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strKS_PhieuKhaoSat_Id': edu.util.getValById('dropSearch_Phieu'),
            'strNguoiThucHien_Id': me.strCanBo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.dtKeHoachKhaoSat = dtResult;
                    if (dtResult.rsThongTinChung.length > 0) me.view_KeQuaKhaoSat(dtResult.rsThongTinChung[0]);
                    me.genTable_DapAn(dtResult.rsDanhMucDapAn)
                    me.genTable_KetQuaKhaoSat(dtResult.rsCauHoi_1DapAn)
                    me.genTable_CauHoiMo(dtResult.rsCauHoi_Mo, dtResult.rsCauHoi_Mo_KetQua)
                }
                else {
                    edu.system.alert(data.Message, "w");
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

    getList_SoPhieu: function (objCauHoi, objDapAn) {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSSoPhieuTheoCauHoi',
            'type': 'GET',
            'strKS_KeHoachKhaoSat_Id': objCauHoi.KS_KEHOACHKHAOSAT_ID,
            'strKS_PhieuKhaoSat_Id': objCauHoi.KS_PHIEUKHAOSAT_ID,
            'strKS_CauHoi_Id': objCauHoi.ID,
            'strMaDapAn': objDapAn.MADAPAN,
            'strNguoiThucHien_Id': me.strCanBo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    if (dtResult.length) {
                        $("#sophieu_" + objCauHoi.ID + "_" + objDapAn.ID).html(edu.util.returnEmpty(dtResult[0].SOLUONG))
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TongHop();
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_PhanTram: function (objCauHoi, objDapAn) {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSPhanTramTheoCauHoi',
            'type': 'GET',
            'strKS_KeHoachKhaoSat_Id': objCauHoi.KS_KEHOACHKHAOSAT_ID,
            'strKS_PhieuKhaoSat_Id': objCauHoi.KS_PHIEUKHAOSAT_ID,
            'strKS_CauHoi_Id': objCauHoi.ID,
            'strMaDapAn': objDapAn.MADAPAN,
            'strNguoiThucHien_Id': me.strCanBo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    if (dtResult.length) {
                        $("#tyle_" + objCauHoi.ID + "_" + objDapAn.ID).html(edu.util.returnEmpty(dtResult[0].PHANTRAM))
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TongHop();
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_TongHop: function (objCauHoi, objDapAn) {
        var me = this;
        me.dtKeHoachKhaoSat.rsCauHoi_1DapAn.forEach(cauhoi => {
            var iTong = 0.0;
            var iSoLuong = 0.0;
            me.dtKeHoachKhaoSat.rsDanhMucDapAn.forEach(dapan => {
                var iCount = parseInt($("#sophieu_" + cauhoi.ID + "_" + dapan.ID).html());
                iSoLuong += iCount;
                iTong += iCount * parseInt(dapan.TRONGSODIEM);
                //iTong += parseInt($("#sophieu_" + cauhoi.ID + "_" + dapan.ID).html()) * parseInt($("#tyle_" + cauhoi.ID + "_" + dapan.ID).html().replace('%', ''))
            })
            var num = iTong / iSoLuong;
            $("#sinhvien_" + cauhoi.ID).html(Math.round(num * 100) / 100);
        })
    },
    view_KeQuaKhaoSat: function (data) {
        var me = this;
        $("#lblHocPhan").html(edu.util.returnEmpty(data.KS_CSDL_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(data.KS_CSDL_HOCPHAN_MA));
        $("#lblGiangVien").html(edu.util.returnEmpty(data.KS_DOITUONGDUOCKHAOSAT_TEN));
        $("#lblKhoaDaoTao").html(edu.util.returnEmpty(data.AAA));
        $("#lblHinhThuc").html(edu.util.returnEmpty(data.AAAA));
        $("#lblThucHien").html(edu.util.returnEmpty(data.TUNGAY) + " - " + edu.util.returnEmpty(data.DENNGAY));
        $("#lblSoLuongKhaoSat").html(edu.util.returnEmpty(data.AAA));

    },
    genTable_DapAn: function (data) {
        var me = this;
        var arrMau = ["bg-warning", "bg-danger", "bg-dask-blue", "bg-primary", "bg-success"]
        var iThuTu = 0;
        var html = "";
        if (data.length > 0) {
            html = '<div class="me-4">';
            for (var i = 0; i <= (data.length / 2); i++) {
                html += '<p class="d-flex align-items-center mb-2">';
                html += '<span class="text-white me-2 w-16px h-16px rounded-8px ' + arrMau[iThuTu++ % 5] + ' d-flex align-items-center justify-content-center lh-1">' + edu.util.returnEmpty(data[i].TRONGSODIEM) + '</span>';
                html += '<span>' + edu.util.returnEmpty(data[i].TENDAPAN) + '</span>';
                html += '</p>';
            }
            html += '</div><div class="me-4">';
            for (var i = Math.round(data.length / 2); i < data.length; i++) {
                html += '<p class="d-flex align-items-center mb-2">';
                html += '<span class="text-white me-2 w-16px h-16px rounded-8px ' + arrMau[iThuTu++ % 5] + ' d-flex align-items-center justify-content-center lh-1">' + edu.util.returnEmpty(data[i].TRONGSODIEM) + '</span>';
                html += '<span>' + edu.util.returnEmpty(data[i].TENDAPAN) + '</span>';
                html += '</p>';
            }
            html += '</div>';
            $("#zoneDapAn").html(html);
            html = ''; iThuTu = 0;;
            data.forEach(e => html += '<th class="text-center fw-normal border-left w-64px lh-1 ' + arrMau[iThuTu++ % 5] + ' text-white">' + edu.util.returnEmpty(e.TRONGSODIEM) + '</th>')
            html += html;
        }
        $("#tblKetQuaKhaoSat thead tr:eq(1)").html(html);
        document.getElementById("lbltblTyLe").colSpan = data.length;
        document.getElementById("lbltblSoPhieu").colSpan = data.length;
        
    },
    genTable_KetQuaKhaoSat: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKetQuaKhaoSat",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TENCAUHOI"
                }
            ]
        };
        me.dtKeHoachKhaoSat.rsDanhMucDapAn.forEach((e, index) => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span class="w-64px" id="sophieu_' + aData.ID + '_' + me.dtKeHoachKhaoSat.rsDanhMucDapAn[iThuTu].ID + '"></span>';
                }
            })
            //jsonForm.colPos.center.push((jsonForm.aoColumns.length + 1));
        })
        me.dtKeHoachKhaoSat.rsDanhMucDapAn.forEach((e, index) => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span class="w-64px" id="tyle_' + aData.ID + '_' + me.dtKeHoachKhaoSat.rsDanhMucDapAn[iThuTu - me.dtKeHoachKhaoSat.rsDanhMucDapAn.length].ID + '"></span>';
                }
            })
            //jsonForm.colPos.center.push((jsonForm.aoColumns.length + 1));
        })
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<span class="w-64px" id="sinhvien_' + aData.ID + '"></span>';
            }
        })
        me.dtKeHoachKhaoSat.rsDanhMucDapAn.forEach((e, index) => {
            jsonForm.colPos.center.push(2 + 2 * index);
            jsonForm.colPos.center.push(2 + 2 * index + 1);
        })
        jsonForm.colPos.center.push(2 + (2 * me.dtKeHoachKhaoSat.rsDanhMucDapAn.length));
        console.log(jsonForm.colPos.center)
        edu.system.loadToTable_data(jsonForm);

        edu.system.alert('<div id="zoneprocessXXXX"></div>');
        edu.system.genHTML_Progress("zoneprocessXXXX", (data.length * 2 * me.dtKeHoachKhaoSat.rsDanhMucDapAn.length));
        data.forEach(e => me.dtKeHoachKhaoSat.rsDanhMucDapAn.forEach(ele => { me.getList_SoPhieu(e, ele); me.getList_PhanTram(e, ele); }))
    },
    genTable_CauHoiMo: function (dtCauHoi, dtDapAn) {
        var me = this;
        var html = '';
        dtCauHoi.forEach((aCauHoi, iTCauHoi) => {
            html += '<div><b>Câu ' + (iTCauHoi + 1) + ': ' + aCauHoi.TENCAUHOI + '</b>';
            var dtDALoc = dtDapAn.filter(e => e.KS_CAUHOI_ID == aCauHoi.ID);
            dtDALoc.forEach(aDapAn => {
                html += '<p>' + aDapAn.DAPAN + '</p>';
            })
            html += '</div>';
        })
        $("#zoneDapAnCauHoiMo").html(html)
    },

    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSKeHoachKhaoSatCaNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': me.strCanBo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },

    getList_Phieu: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSPhieuKhaoSatCaNhan',
            'type': 'GET',
            'strKS_KeHoachKhaoSat_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': me.strCanBo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_Phieu(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genCombo_Phieu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropSearch_Phieu"],
            title: "Chọn phiếu"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },


    getList_HS: function () {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_BoMon");
        var strTinhTrangNhanSu_Id = edu.util.getValById("dropSearch_CapNhat_TinhTrangLamViec");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_CCTC");
        }
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
        main_doc.KetQuaKhaoSat["dtCanBoTimKiem"] = data;
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