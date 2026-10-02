/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function AutoPK() { };
AutoPK.prototype = {
    dt_HS: [],
    bRunKetQua: false,
    bRunTaiChinh: false,
    bRunThuHoc: false,
    bRunGiangVien: false,
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            edu.system.iGioiHanLuong = edu.util.getValById("txtRequest");
            if ($('#dKetQua').is(":checked")) me.bRunKetQua = true;
            if ($('#dTaiChinh').is(":checked")) me.bRunTaiChinh = true;
            if ($('#dThuHoc').is(":checked")) me.bRunThuHoc = true;
            if ($('#dGiangVien').is(":checked")) me.bRunGiangVien = true;


            var strSinhVien = edu.util.getValById("txtSearchDSSV_TuKhoa").replace(/ /g, '');
            if (strSinhVien == "") {
                me.getList_HSSV();
            } else {
                var arrSinhVien = [strSinhVien];
                if (strSinhVien.indexOf(',') != -1) arrSinhVien = strSinhVien.split(',');
                arrSinhVien.forEach(e => {
                    var objSend = {
                        strQLSV_NguoiHoc_Id: e,
                        strQLSV_NguoiHoc_Ma: ""
                    };
                    me.getList_ChuongTrinh(objSend);
                });
            }
        });
    },

    getList_HSSV: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': edu.util.getValById("txtSearchDSSV_TuKhoa"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinhDaoTao"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_LopQuanLy"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.util.getValById("txtTuSo"),
            'pageSize': parseInt(edu.util.getValById("txtDenSo")) - parseInt(edu.util.getValById("txtTuSo"))
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
                    me.dt_HS = dtResult;
                    me.genTable_HSSV(dtResult, iPager);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HSSV: function (data, iPager) {
        var me = this;
        data.forEach(e => {
            var objSend = {
                strQLSV_NguoiHoc_Id: e.ID,
                strQLSV_NguoiHoc_Ma: e.MASO
            };
            me.getList_ChuongTrinh(objSend);
        });
        return;
        //edu.util.viewHTMLById("lblDSSV_NhanSu_Tong", iPager);
        //var jsonForm = {
        //    strTable_Id: "tblDSSV_NhanSu",
        //    aaData: data,
        //    bPaginate: {
        //        strFuntionName: "main_doc.HoSoDanhSach.getList_HSSV()",
        //        iDataRow: iPager,
        //        bInfo: false,
        //        bChange: false,
        //        bLeft: false
        //    },
        //    colPos: {
        //        left: [1],
        //        fix: [0]
        //    },
        //    arrClassName: ["btnEdit"],
        //    bHiddenOrder: true,
        //    aoColumns: [
        //        {
        //            "mRender": function (nRow, aData) {
        //                var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(aData.ANH), constant.setting.EnumImageType.ACCOUNT);
        //                var html = '<img src="' + strAnh + '" class= "table-img" />';
        //                return html;
        //            }
        //        }
        //        , {
        //            "mRender": function (nRow, aData) {
        //                html = '';
        //                strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
        //                html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
        //                html += '<span>' + edu.util.returnEmpty(aData.MASO) + "</span><br />";
        //                html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(aData.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(aData.NGAYSINH_NAM) + "</span><br />";
        //                return html;
        //            }
        //        }
        //    ]
        //};
        //edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        //me.reportDanhMuc(data[0], 'vanhieptn95@gmail.com', "NH.GNH");
    },
    getList_ChuongTrinh: function (objSend) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSChuongTrinh',
            'strQLSV_NguoiHoc_Id': objSend.strQLSV_NguoiHoc_Id,
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
                    me.genList_ChuongTrinh(dtResult, objSend);
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
    genList_ChuongTrinh: function (data, objSend) {
        var me = this;
        //var row = '';
        //var check = " btn-primary";
        //for (var i = 0; i < data.length; i++) {
        //    row += '<a id="' + data[i].DAOTAO_TOCHUCCHUONGTRINH_ID + '" class="btn ' + check + ' btnSelectInList">' + edu.util.returnEmpty(data[i].DAOTAO_TOCHUCCHUONGTRINH_TEN) + '</a>';
        //    check = "";
        //}
        //$("#zoneChuongTrinh").html(row);
        //$("#lblTenSinhVien").html(edu.util.returnEmpty(data[0].QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data[0].QLSV_NGUOIHOC_TEN));
        //$("#lblMaSo").html(edu.util.returnEmpty(data[0].QLSV_NGUOIHOC_MASO));
        //$("#lblSoTaiKhoan").html(edu.util.returnEmpty(data[0].TAIKHOAN));
        //$("#txtAnhCaNhan").attr("src", edu.system.getRootPathImg(data[0].QLSV_NGUOIHOC_ANH));
        data.forEach(e => {
            objSend["strDaoTao_ChuongTrinh_Id"] = e.DAOTAO_TOCHUCCHUONGTRINH_ID;
            me.getList_KeHoach(objSend);
        });
        
    },

    getList_KeHoach: function (objSend) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSKeHoachDangKyHoc',
            'strDaoTao_ChuongTrinh_Id': objSend.strDaoTao_ChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': objSend.strQLSV_NguoiHoc_Id,
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
                    me.genList_KeHoach(dtResult, objSend);
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
    genList_KeHoach: function (data, objSend) {
        var me = this;
        //var row = '';
        //if (data.length > 0) {
        //    row += '<a id="' + data[0].ID + '" class="btn btn-primary btnSelectInList">' + data[0].MAKEHOACH + ' - ' + data[0].TENKEHOACH + '</a>';
        //    me.showThoiGianDangKy(data[0]);

        //    for (var i = 1; i < data.length; i++) {
        //        row += '<a id="' + data[i].ID + '" class="btn btnSelectInList">' + data[i].MAKEHOACH + ' - ' + data[i].TENKEHOACH + '</a>';
        //    }
        //}
        //$("#zoneKeHoach").html(row);
        data.forEach(e => {
            objSend["strDangKy_KeHoachDangKy_Id"] = e.ID;
            me.getList_HocPhan(objSend);
        });
        
        //me.getList_KetQuaDangKy();
        //me.getList_TinhTrangTaiChinh();
    },

    getList_HocPhan: function (objSend) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSHocPhanDangToChuc',
            'strDangKy_KeHoachDangKy_Id': objSend.strDangKy_KeHoachDangKy_Id,
            'strDaoTao_ChuongTrinh_Id': objSend.strDaoTao_ChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': objSend.strQLSV_NguoiHoc_Id,
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
                    me.genList_HocPhan(dtResult, objSend);
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
    genList_HocPhan: function (data, objSend) {
        var me = this;
        //var row = '';
        //me.arrHPDaDangKy = [];
        //var check = data.find(e => e.DADANGKY === 0);
        //if (check != undefined) check = check.DAOTAO_HOCPHAN_ID;
        //if (me.strHocPhan_Id != "") check = me.strHocPhan_Id;
        //for (var i = 0; i < data.length; i++) {
        //    var btnClass = 'btn-white';
        //    var lblIcon = '';
        //    if (data[i].DADANGKY > 0) {
        //        me.arrHPDaDangKy.push(data[i].DAOTAO_HOCPHAN_ID);
        //        lblIcon = ' <i class="fa fa-check-circle"></i>';
        //    }
        //    if (data[i].DAOTAO_HOCPHAN_ID === check) btnClass = 'btn-primary';
        //    row += '<a id="' + data[i].DAOTAO_HOCPHAN_ID + '" class="btn ' + btnClass + ' btnSelectInList">' + data[i].DAOTAO_HOCPHAN_MA + ' - ' + data[i].DAOTAO_HOCPHAN_TEN + lblIcon + '</a>';
        //}
        //$("#zoneDSHocPhan").html(row);
        //$("#DSThuHoc").html("");
        //$("#DSGiangVien").html("");

        data.forEach(e => {
            objSend["strDaoTao_HocPhan_Id"] = e.DAOTAO_HOCPHAN_ID;
            me.getList_LopHocPhan(objSend);
        });
        //me.getList_ThuHoc();
        //me.getList_GiangVien();
    },

    getList_LopHocPhan: function (objSend) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSLopHocPhanDangToChuc',
            'type': 'GET',
            'strThuHoc': "",
            'strNhanSu_HoSoNhanSu_v2_Id': "",
            'dChiLayCacLopKhongTrung': 1,
            'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
            'strMaNhomLop': edu.util.getValById('txtAAAA'),
            'dLaLopHocPhanChinh': 1,
            'strDangKy_KeHoachDangKy_Id': objSend.strDangKy_KeHoachDangKy_Id,
            'strDaoTao_ChuongTrinh_Id': objSend.strDaoTao_ChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': objSend.strQLSV_NguoiHoc_Id,
            'strDaoTao_HocPhan_Id': objSend.strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.dtLopHocPhan = data.Data;
                    me.genList_LopHocPhan(data.Data, objSend);//11
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_LopHocPhan: function (data, objSend) {
        var me = this;
        data.rs.forEach(e => {
            objSend["strDangKy_LopHocPhan_Ids"] = e.ID;
            if (e.SOLOPTHUOCCUNGNHOM == 1) me.save_KeHoachDangKy(objSend);
        });
        //var row = '';
        //for (var i = 0; i < data.length; i++) {
        //    var aData = data[i];
        //    var classDangKy = '';
        //    var lblDangKy = 'Đăng ký';
        //    var lblChonThem = 'Chọn thêm ';
        //    var checkDangKy = me.arrHPDaDangKy.find(e => e === aData.DAOTAO_HOCPHAN_ID);
        //    if (checkDangKy) {
        //        classDangKy = '1';
        //        lblDangKy = "Đã đăng ký HP";
        //        lblChonThem = 'Đủ ';
        //    }
        //    //if (i !== 0 && i % 4 === 0) {
        //    //    row += '<div class="clear"></div>';
        //    //}
        //    row += '<div class=" col-lg-3">';
        //    row += '<div class="box-hocphan" id="zoneChon' + aData.ID + '">';
        //    row += '<table class="table" style="text-align: center;">';
        //    row += '<tbody>';
        //    row += '<tr>';
        //    row += '<td colspan="2" style="font-weight: bold; text-align: center" id="lblTenLop' + aData.ID + '">' + edu.util.returnEmpty(aData.TENLOP) + '</td>';
        //    row += '<td style="width: 80px;">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</td>';
        //    row += '</tr>';
        //    row += '<tr>';
        //    row += '<td height="10" style="text-align: left">' + edu.util.returnEmpty(aData.NGAYBATDAU) + '</td>';
        //    row += '<td height="10" style="text-align: right">' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</td>';
        //    row += '<td height="10" rowspan="3" name="' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENLOP) + '" class="btnChiTietLopHocPhan poiter">Xem chi tiết</td>';
        //    row += '</tr>';
        //    row += '<tr>';
        //    row += '<td colspan="2" style="">Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</td>';
        //    row += '</tr>';
        //    row += '<tr>';
        //    row += '<td colspan="2" style="">' + edu.util.returnEmpty(aData.GIANGVIEN) + '</td>';
        //    row += '</tr>';
        //    row += '<tr>';
        //    row += '<td style=" text-align: left">Tổng số:</td>';
        //    row += '<td style="">' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</td>';
        //    aData.SOLOPTHUOCCUNGNHOM == 1 ? row += '<td rowspan="2" id="' + aData.ID + '" class="btnDangKyHocPhan' + classDangKy + ' poiter" style="background-color: #4e8d42' + classDangKy + '">' + lblDangKy + '</td>'
        //        : row += '<td rowspan="2" style="background-color: yellow' + classDangKy + '" id="' + aData.ID + '" class="btnChonHocPhan' + classDangKy + ' poiter">' + lblChonThem + edu.util.returnEmpty(aData.SOLOPTHUOCCUNGNHOM) + '</td>';
        //    row += '</tr>';
        //    row += '<tr>';
        //    row += '<td style="text-align: left">Đã đăng ký:</td>';
        //    row += '<td style="">' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</td>';
        //    row += '</tr>';
        //    row += '<tr>';
        //    row += '<td colspan="3" style="">' + edu.util.returnEmpty(aData.PHISAUKHITRUMIEN) + ' VND</td>';
        //    row += '</tr>';
        //    row += '</tbody>';
        //    row += '</table>';
        //    row += '</div>';
        //    row += '</div>';

        //    //if (aData.SOLOPTHUOCCUNGNHOM > 1) {
        //    //    me.getNhom_LopHocPhan(aData.MANHOMLOP, aData.DAOTAO_HOCPHAN_ID);
        //    //}
        //}
        //$("#zoneLopHocPhan").html(row);
        //$("#zoneLopHocPhan").focus();
    },

    save_KeHoachDangKy: function (objSend) {
        var me = this;
        //me.strHocPhan_Id = me.getIdByZone("zoneDSHocPhan");
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKy/DangKyHocTrucTiep',


            'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
            'strMaNhomLop': edu.util.getValById('txtAAAA'),
            'dLaLopHocPhanChinh': 1,
            'strDangKy_KeHoachDangKy_Id': objSend.strDangKy_KeHoachDangKy_Id,
            'strDaoTao_ChuongTrinh_Id': objSend.strDaoTao_ChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': objSend.strQLSV_NguoiHoc_Id,
            'strDaoTao_HocPhan_Id': objSend.strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_LopHocPhan_Ids': objSend.strDangKy_LopHocPhan_Ids,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        //edu.system.alert("Đăng ký thành công!");
                        if(bRunKetQua) me.getList_KetQuaDangKy();
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

                var html = '<tr>';
                html += '<td>#</td>';
                html += '<td>' + objSend.strQLSV_NguoiHoc_Id + '</td>';
                html += '<td>' + objSend.strQLSV_NguoiHoc_Ma + '</td>';
                html += '<td>' + objSend.strDaoTao_ChuongTrinh_Id + '</td>';
                html += '<td>' + objSend.strDangKy_KeHoachDangKy_Id + '</td>';
                html += '<td>' + objSend.strDaoTao_HocPhan_Id + '</td>';
                html += '<td>' + objSend.strDangKy_LopHocPhan_Ids + '</td>';
                html += '<td>' + data.Message + '</td>';
                html + '</tr>';
                $("#tblKeHoachXuLy tbody").append(html);
            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alert(obj_save.action + " (er): " + er);
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