/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 29/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ChuongTrinh() { };
ChuongTrinh.prototype = {
    dtChuongTrinh: [],
    strChuongTrinh_Id: '',
    dtHocPhan_ChuongTrinh: [],
    dtPhanBo: [],

    init: function () {
        var me = this;
        //$("#tblHocPhan .remove").remove();

        //me.strHead = $("#tblHocPhan thead").html();
        //me.strSinhVien_Id = edu.system.userId;
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAIPHANBO", "", "", data => {
            me.dtPhanBo = data;
            me.getList_ChuongTrinh();
        });
        $('#dropSearch_ChuongTrinh').on('change', function () {
            var strChuongTrinh_Id = $('#dropSearch_ChuongTrinh').val();
            me.strChuongTrinh_Id = strChuongTrinh_Id;
            var strChuongTrinh = $("#dropSearch_ChuongTrinh option:selected").text();
            var strSoTin = $("#dropSearch_ChuongTrinh option:selected").attr("name");
            $("#lblEditHocPhan").html(strChuongTrinh);
            $("#iTongSoTinChi").html(strSoTin);
            me.getList_HocPhan_ChuongTrinh();
            me.getList_KhoiBatBuoc();
            me.getList_KhoiTuChonDon();
        });
        $("#khoibatbuoc").delegate('.justify-content-start', 'click', function (e) {
            var strKhoi_Id = this.id;
            var strHocPhan_Ten = this.title;
            $("#khoikienthuc").html(strHocPhan_Ten);
            me.getList_HocPhan_ChuongTrinh_KBB(strKhoi_Id);
            $("#khoikienthucchuyennganh").modal("show");
        });
        $("#khoiluachondon").delegate('.justify-content-start', 'click', function (e) {
            var strKhoi_Id = this.id;
            var strHocPhan_Ten = this.title;
            $("#khoikienthuc").html(strHocPhan_Ten);
            me.getList_HocPhan_ChuongTrinh_KTCD(strKhoi_Id);
            $("#khoikienthucchuyennganh").modal("show");
        });

        $("#tblHocPhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            $("#study_program").modal("show");
            me.strHocPhan_ChuongTrinh_Id = strId;
            me.viewEdit_HocPhan_ChuongTrinh(me.dtHocPhan_ChuongTrinh.find(e => e.ID === strId));
            return false;
        });
        //var ilength = window.innerHeight - $("#tblHocPhan").offset().top - 117;
        //$("#tblHocPhan").parent().attr("style", "height: " + ilength + "px; overflow-y: scroll;");
    },

    getList_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSChuongTrinh',
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
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
                    me.genComBo_ChuongTrinh(dtResult, iPager);
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
    genComBo_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_TOCHUCCHUONGTRINH_TEN",
                code: "TONGSOTINCHIQUYDINH",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Chọn chương trình",
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_HocPhan_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_ChuongTrinh/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_ThoiGian_KH_Id': "",
            'strDaoTao_ThoiGian_TT_Id': "",
            'strThuocTinhHocPhan_Id': "",
            'strPhanCongPhamViDamNhiem_Id': "",
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 100000000
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
                    me.dtHocPhan_ChuongTrinh = dtResult;
                    me.genTable_HocPhan_ChuongTrinh(dtResult, iPager);
                    //me.getList_ThoiGianDaoTao();
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
    genTable_HocPhan_ChuongTrinh: function (data, iPager) {
        var me = this;
        $("#tblHocPhan thead").html(me.strHead);
        var arrDoiTuong = me.dtPhanBo;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#tblHocPhan thead tr:eq(0)").append('<th class="td-center remove">' + arrDoiTuong[j].MA + '</th>');
        }
        $("#tblHocPhan thead tr:eq(0)").append('<th class="text-center" scope="col">Chi tiết</th>');
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4],
            },
            aoColumns: [{
                "mDataProp": "DAOTAO_HOCPHAN_MA"
            },
            {
                "mDataProp": "DAOTAO_HOCPHAN_TEN"
            },
            {
                "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGTINHHOCPHI"
                },
                {
                    "mDataProp": "THONGTINQUANHEHOCPHAN"
                },
            {
                "mDataProp": "DAOTAO_THOIGIAN_KEHOACH"
            },
            {
                "mDataProp": "DAOTAO_THOIGIAN_THUCTE"
            }
            ]
        };
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<div id="div_' + aData.ID + '_' + main_doc.ChuongTrinh.dtPhanBo[iThuTu].ID + '"></div>';
                    }
                }
            );
            jsonForm.colPos.center.push(j + 7);
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                }
            }
        );
        jsonForm.colPos.center.push(j + 7);
        edu.system.loadToTable_data(jsonForm);
        ////Hiển thị tổng số học phần:
        //$("#iTongSoHocPhan").html(data.length);
        //var iTongSoTinChi = 0;
        //var iTongSoTinChiHocPhi = 0;
        //for (var i = 0; i < data.length; i++) {
        //    iTongSoTinChi += data[i].HOCTRINHAPDUNGHOCTAP;
        //    iTongSoTinChiHocPhi += data[i].HOCTRINHAPDUNGTINHHOCPHI;
        //}
        //$("#iTongSoTinChi").html(iTongSoTinChi);
        //$("#iTongSoTinChiHocPhi").html(iTongSoTinChiHocPhi);
        //if (data.length > 0) {
        //    $("#iTongSoTinChiKhoi").html(data[0].TONGSOTINCHITHEOKHOIKT);
        //}
        for (var i = 0; i < data.length; i++) {
            me.getList_HocPhan_SoTiet(data[i].DAOTAO_TOCHUCCHUONGTRINH_ID, data[i].DAOTAO_HOCPHAN_ID, data[i].ID);
        }

        /*III. Callback*/
    },
    getList_HocPhan_SoTiet: function (strDaoTao_ToChucCT_Id, strDaoTao_HocPhan_Id, strId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_TietHoc/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strDaoTao_ToChucCT_Id': strDaoTao_ToChucCT_Id,
            'strLoaiPhanBo_Id': '',
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        $("#div_" + strId + "_" + e.LOAIPHANBO_ID).html(edu.util.returnEmpty(e.SOTIET));
                    });
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


    getList_KhoiBatBuoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_KhoiBatBuoc/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_KhoiBatBuoc_Cha_Id': "",
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.genTable_KhoiBatBuoc(dtResult);
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
    genTable_KhoiBatBuoc: function (data, iPager) {
        var me = this;
        /*III. Callback*/
        var html = '';
        data.forEach(e => {
            html += '<li class="justify-content-start" id="' + e.ID + '" title="' + edu.util.returnEmpty(e.TEN) + '">';
            html += '<i class="fal fa-book"></i>';
            html += '<div class="meta ms-2">';
            html += '<p class="m-0">' + edu.util.returnEmpty(e.TEN) + '</p>';
            html += '<p class="text-primary fs-13 mb-0">(Tổng số HP: ' + edu.util.returnEmpty(e.TONGSOHOCPHAN) + '; Tổng số TC: ' + edu.util.returnEmpty(e.TONGSOTINCHI) + ')</p>';
            html += '</div>';
            html += '</li>';
        });
        $("#khoibatbuoc").html(html);
    },


    getList_KhoiTuChonDon: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_KhoiTuChon_Don/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_KTuChon_Don_Cha_Id': "",
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strLoaiLuaChon_Id': '',
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.genTable_KhoiLuaChonDon(dtResult)
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

    genTable_KhoiLuaChonDon: function (data, iPager) {
        var me = this;
        /*III. Callback*/
        var html = '';
        data.forEach(e => {
            var htmlShow = "Tổng số HP: " + e.TONGSOHP + "; \t Tổng số TC: " + e.TONGSOTC + ";";
            if (e.SOHOCPHANQUYDINH) htmlShow += "\t Số HP bắt buộc: " + e.SOHOCPHANQUYDINH + ";";
            if (e.SOTINCHIQUYDINH) htmlShow += "\t Số TC bắt buộc: " + e.SOTINCHIQUYDINH;

            html += '<li class="justify-content-start" id="' + e.ID + '" title="' + edu.util.returnEmpty(e.TEN) + '">';
            html += '<i class="fal fa-book"></i>';
            html += '<div class="meta ms-2">';
            html += '<p class="m-0">' + edu.util.returnEmpty(e.TEN) + '</p>';
            html += '<p class="text-primary fs-13 mb-0">(' + htmlShow +')</p>';
            html += '</div>';
            html += '</li>';
        });
        $("#khoiluachondon").html(html);
    },

    getList_HocPhan_ChuongTrinh_KBB: function (strKhoiBatBuoc_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_KhoiBatBuoc/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_KhoiBatBuoc_Id': strKhoiBatBuoc_Id,
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 100000000
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
                    //me.dtHocPhan_ChuongTrinh = dtResult;
                    me.genTable_HocPhan_ChuongTrinh_KBB_Select(dtResult, iPager);
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

    genTable_HocPhan_ChuongTrinh_KBB_Select: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblkhoikienthuc",
            aaData: data,
            colPos: {
                center: [0, 3, 4],
            },
            aoColumns: [{
                "mDataProp": "DAOTAO_HOCPHAN_MA"
            },
            {
                "mDataProp": "DAOTAO_HOCPHAN_TEN"
            },
            {
                "mDataProp": "HOCTRINHAPDUNGHOCTAP"
            },
            {
                "mDataProp": "TONGSOTIETPHANBO"
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_HocPhan_ChuongTrinh_KTCD: function (strKhoiTuChonDon_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_KhoiTuChon_Don/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_KTuChon_Don_Id': strKhoiTuChonDon_Id,
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 100000000
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
                    me.genTable_HocPhan_ChuongTrinh_KBB_Select(dtResult, iPager);
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


    viewEdit_HocPhan_ChuongTrinh: function (data) {
        var me = this;

        me.strHocPhan_Id = data.DAOTAO_HOCPHAN_ID;
        edu.util.viewHTMLById("lblHocPhan_MaHocPhan", data.DAOTAO_HOCPHAN_MA);
        edu.util.viewHTMLById("lblHocPhan_TenHocPhan", data.DAOTAO_HOCPHAN_TEN);
        edu.util.viewHTMLById("lblHocPhan_SoTinHocPhan", data.HOCTRINHAPDUNGHOCTAP);
        edu.util.viewHTMLById("lblHocPhan_SoTinHocPhi", data.HOCTRINHAPDUNGTINHHOCPHI);
        edu.util.viewHTMLById("lblLaMonTinhDiem", data.LAMONTINHDIEMTHEOCHUONGTRINH);
        edu.util.viewHTMLById("lblHocKyDuKien", data.DAOTAO_THOIGIAN_KEHOACH_TEN);
        edu.util.viewHTMLById("lblHocKyThucTe", data.DAOTAO_THOIGIAN_THUCTE_TEN);
        edu.util.viewHTMLById("lblPhamViDamNhiem", data.PHANCONGPHAMVIDAMNHIEM_TEN);
        edu.util.viewHTMLById("lblThuocTinh", data.THUOCTINHHOCPHAN_TEN);
        edu.util.viewHTMLById("lblThuTu", data.THUTU);
        me.getList_QuanHeHocPhan();
        me.getList_QuanHeTuongDuong();
        me.getList_HocPhan_BaiHoc();
        me.getList_HocPhan_PhanBo();
    },

    getList_QuanHeHocPhan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_QuanHeHocPhan/LayDanhSach',

            'strTuKhoa': '',
            'strLoaiQuanHe_Id': '',
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_HocPhan_QuanHe_Id': '',
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanHeHocPhan(dtReRult);
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
    genTable_QuanHeHocPhan: function (data) {
        var me = this;
        var html = '';
        data.forEach(e => {
            html += '<div class="col-12 col-md-6">';
            html += '<p><span>Loại quan hệ:</span> <b id="lblLoaiQuanHe">' + edu.util.returnEmpty(e.LOAIQUANHE_TEN) + '</b></p>';
            html += '<p><span>Học phần:</span> <b id="lblHocPhan">' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_QUANHE_TEN) + '</b></p>';
            html += '<p><span>Mức:</span> <b id="lblMuc">' + edu.util.returnEmpty(e.MUCDIEUKIEN_TEN) + '</b></p>';
            html += '</div>';
            html += '<div class="col-12 col-md-6">';
            html += '<p><span>Toán tử:</span> <b id="lblToanTu">' + edu.util.returnEmpty(e.TOANTU_TEN) + '</b></p>';
            html += '<p><span>Giá trị:</span> <b id="lblGiaTriDieuKien">' + edu.util.returnEmpty(e.GIATRIDIEUKIEN) + '</b></p>';
            html += '</div>';
        });
        $("#tblInput_HocPhan_QuanHe").html(html);
    },
    getList_QuanHeTuongDuong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_TuongDuong/LayDanhSach',

            'strTuKhoa': '',
            'strDaoTao_HocPhan_TD_Id': '',
            'strDaoTao_ToChucCT_TD_Id': '',
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanHeTuongDuong(dtReRult);
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
    genTable_QuanHeTuongDuong: function (data) {
        var me = this;
        var html = '';
        data.forEach(e => {
            html += '<div class="col-12 col-md-6">';
            html += '<p><span>Khóa đào tạo:</span> <b id="lblLoaiQuanHe">' + edu.util.returnEmpty(e.DAOTAO_KHOADAOTAO_TD_TEN) + '</b></p>';
            html += '<p><span>Chương trình:</span> <b id="lblHocPhan">' + edu.util.returnEmpty(e.DAOTAO_CHUONGTRINH_TD_TEN) + '</b></p>';
            html += '</div>';
            html += '<div class="col-12 col-md-6">';
            html += '<p><span>Học phần:</span> <b id="lblToanTu">' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_TD_TEN) + '</b></p>';
            html += '</div>';
        });
        $("#tblInput_HocPhan_QuanHeTT").html(html);
    },
    getList_HocPhan_BaiHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_BaiHoc/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_HocPhan_BaiHoc(dtReRult);
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
    genTable_HocPhan_BaiHoc: function (data) {
        var me = this;
        var html = '';
        data.forEach(e => {
            html += '<div class="col-12 col-md-6">';
            html += '<p><span>Tên bài:</span> <b id="lblLoaiQuanHe">' + edu.util.returnEmpty(e.TENBAI) + '</b></p>';
            html += '<p><span>Ký hiệu:</span> <b id="lblHocPhan">' + edu.util.returnEmpty(e.KYHIEUBAI) + '</b></p>';
            html += '</div>';
            html += '<div class="col-12 col-md-6">';
            html += '<p><span>Số tiết:</span> <b id="lblToanTu">' + edu.util.returnEmpty(e.SOTIET) + '</b></p>';
            html += '<p><span>Nội dung:</span> <b id="lblToanTu">' + edu.util.returnEmpty(e.NOIDUNG) + '</b></p>';
            html += '</div>';
        });
        $("#tblInput_HocPhan_BaiHoc").html(html);
        
    },
    getList_HocPhan_PhanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_TietHoc/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strLoaiPhanBo_Id': '',
            'strNguoiThucHien_Id': me.strSinhVien_Id,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_HocPhan_PhanBo(dtReRult);
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
    genTable_HocPhan_PhanBo: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhan_PhanBo",
            aaData: data,
            colPos: {
                //center: [],
            },
            aoColumns: [{
                "mDataProp": "LOAIPHANBO_TEN"
            },
            {
                "mDataProp": "SOTIET"
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}