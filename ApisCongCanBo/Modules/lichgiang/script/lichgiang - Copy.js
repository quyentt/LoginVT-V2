/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function LichGiang() { };
LichGiang.prototype = {
    strThongTin_Id: '',
    dtThongTin: [],
    iNgayBatDau : 0,
    strGiangVien_Id: '',
    arrDay: [],
    dtLichHoc: [],
    strLichHoc_Id: '',
    dtKieuChuyenCan: [],
    dtSinhVien: [],
    strNgayBatDau: '',
    strNgayKetThuc: '',
    dtGiangVienThayDoi: [],
    strDoiLich_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system 
        -------------------------------------------*/
        me.strGiangVien_Id = edu.system.userId;
        //me.getList_ThongTin();
        var date = new Date();
        var nMonth = date.getMonth() + 1;
        var nYear = date.getFullYear();

        $("#nam").attr("title", nYear);
        $("#nam").html(nYear);

        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);
        me.genHtml_Month(0);

        $(".days").delegate(".poiter", "click", function () {
            $(".days .active").removeClass("active");
            $("#datebody").html("");
            this.classList.add("active");
            var strNgayBatDau = $(this).attr('batdau');
            var strNgayKetThuc = $(this).attr('ketthuc');
            var strNgayDangChon = $(this).attr('title');
            me.strNgayBatDau = strNgayBatDau;
            me.strNgayKetThuc = strNgayKetThuc;
            me.getList_TuanHienTai(strNgayBatDau, strNgayKetThuc, strNgayDangChon);
            var strClass = $(this).attr('name');
            strClass = $("." + strClass);
            var html = '';
            html += '<div class="date">';
            html += '<i class="fal fa-clock day color-66"></i>';
            html += '<p class="m-0 text">GMT+7</p>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[0]).attr('title') +'</div>';
            html += '<div class="text">Mon</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[1]).attr('title') +'</div>';
            html += '<div class="text">Tue</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[2]).attr('title') +'</div>';
            html += '<div class="text">Wed</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[3]).attr('title') +'</div>';
            html += '<div class="text">Thu</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[4]).attr('title') +'</div>';
            html += '<div class="text">Fri</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[5]).attr('title') +'</div>';
            html += '<div class="text">Sat</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[6]).attr('title') +'</div>';
            html += '<div class="text">Sun</div>';
            html += '</div>';
            html += '</div>';

            $("#date-header").html(html);
            me.arrDay = [];
            for (var i = 0; i < strClass.length; i++) {
                me.arrDay.push($(strClass[i]).attr('title').replace(/\//g, ''));
            }
        });
        $(".month").delegate(".prev", "click", function () {
            me.genHtml_Month(-1);
        });
        $(".month").delegate(".next", "click", function () {
            me.genHtml_Month(1);
        });

        $("#tblThongTin").delegate(".btnXacNhan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có đồng ý xác nhận thời điểm vào lớp không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(strId);
            });
        });
        $("#tblThongTin").delegate(".btnXacNhan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có đồng ý xác nhận thời điểm vào lớp không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(strId);
            });
        });

        $("#datebody").delegate(".btnLichHoc", "click", function () {
            var strId = this.id;
            me.strLichHoc_Id = strId;
            $("#my_calendar").modal("show");
            var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === strId);
            $("#lblLopHocPhan").html('<b>Lớp: ' + objLich.TENLOPHOCPHAN + '</b>');
            $("#lblHocPhan").html('<b>Học phần: ' + objLich.TENHOCPHAN + '</b> <span class="color-66">&ensp; - &ensp; Thời gian ' + me.returnTwo(objLich.GIOBATDAU) + ':' + me.returnTwo(objLich.PHUTBATDAU) + ' - ' + me.returnTwo(objLich.GIOKETTHUC) + ':' + me.returnTwo(objLich.PHUTKETTHUC) + ' (Tiết ' + edu.util.returnEmpty(objLich.TIETBATDAU) + '-' + edu.util.returnEmpty(objLich.TIETKETTHUC) + ')</span><span class="color-66 fs-14"> (Phòng học: ' + objLich.TENPHONGHOC + ')</span>');
            me.getList_SinhVien(strId);
            me.getDetail_SiSo(strId);
        });
        $("#datebody").delegate(".btnKhoiTaoDoiLich", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            me.strLichHoc_Id = strId;
            $("#modalDoiLich").modal("show");
            var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === strId);
            //$("#lblLopHocPhan").html('<b>Lớp: ' + objLich.TENLOPHOCPHAN + '</b> <span class="color-66 fs-14"> (Phòng học: ' + objLich.TENPHONGHOC + ')</span>');
            //$("#lblHocPhan").html('<b>Học phần: ' + objLich.TENHOCPHAN + '</b> <span class="color-66">&ensp; - &ensp; ' + me.returnTwo(objLich.GIOBATDAU) + ':' + me.returnTwo(objLich.PHUTBATDAU) + ' - ' + me.returnTwo(objLich.GIOKETTHUC) + ':' + me.returnTwo(objLich.PHUTKETTHUC) + ' (Tiết ' + edu.util.returnEmpty(objLich.TIETBATDAU) + '-' + edu.util.returnEmpty(objLich.TIETKETTHUC) + ')</span>');
            me.getList_KhoiTaoDoiLich(objLich);
        });

        $("#btnGuiYeuCau").click(function () {
            me.save_DoiLich();
        });

        edu.system.loadToCombo_DanhMucDuLieu("QLSV.KIEUCHUYENCAN", "", "", data => {
            me.dtKieuChuyenCan = data;
            var row = '';
            data.forEach(e => {
                row += '<th class="td-center" style="width: 94px">' + e.TEN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + e.ID + '" style="margin-left: -39px" /></th>';
            });
            
            $("#tblNhapChuyenCan thead tr:eq(0)").append(row);
        });
        $("#tblNhapChuyenCan").delegate(".chkSelectAll", "click", function (e) {

            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".checkNgay" + strClass).each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });

        $("#tblNhapChuyenCan").delegate(".checkChuyenCan", "click", function (e) {
            var point = this;
            var checked_status = this.checked;
            if (checked_status) {
                var strid = this.id;
                var arrId = strid.split("_");
                var strSV_Id = arrId[0].substring(9);
                $(".checkSV" + strSV_Id).each(function () {
                    if (point.id == this.id) return; 
                    $(this).attr('checked', false);
                    $(this).prop('checked', false);
                });
            }
        });
        $("#tblNhapChuyenCan").delegate(".inputChuyenCan", "blur", function (e) {
            var point = this;
            var strid = this.id;
            var strSV_Id = strid.substring(6);
            var ele = $("#chkSelect" + strSV_Id);
            var checked_status = false;
            if (point.val() != "") {
                checked_status = true;
            }
            $(ele).attr('checked', checked_status);
            $(ele).prop('checked', checked_status);
        });

        $("#btnSaveTuKhoa").click(function () {
            me.save_TuGhiNhan();
        });

        $("#btnDiemDanh").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblNhapChuyenCan .checkChuyenCan");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    } else {
                        var inputcheck = $("#" + x[i].id.replace("chkSelect", "input_"));
                        if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                //edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " và hủy " + arrXoa.length + "?");
                //$("#btnYes").click(function (e) {

                //});
                edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
                for (var i = 0; i < arrXoa.length; i++) {
                    me.delete_NhapChuyenCan(arrXoa[i]);
                }
                for (var i = 0; i < arrThem.length; i++) {
                    me.save_NhapChuyenCan(arrThem[i]);
                }
                
            }
            else {
                //edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnDiemDanhTuDong").click(function () {
            me.save_DiemDanhTuDong();
        });
        $("#btnDeleteDoiLich").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_DoiLich(me.strDoiLich_Id);
            });
        });
        $("#btnPheDuyet").click(function () {
            edu.system.confirm("Bạn có chắc chắn phê duyệt không?");
            $("#btnYes").click(function (e) {
                me.save_PhetDuyet(me.strDoiLich_Id);
            });
        });

        edu.system.getList_MauImport("zonebtnBaoCao_LichGiang", function (addKeyValue) {
            var obj_list = {
                'strNhanSu_HoSoCanBo_Id': main_doc.LichGiang.strGiangVien_Id,
                'strNgayBatDau': main_doc.LichGiang.strNgayBatDau,
                'strNgayKetThuc': main_doc.LichGiang.strNgayKetThuc,
            };
            for (variable in obj_list) {
                addKeyValue(variable, obj_list[variable]);
            }
        });

        me.getList_DoiLich();
        $("#tblDoiLich").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            me.strDoiLich_Id = strId;
            me.getDetail_DoiLich(strId);
        });

        $("#btnSearch_CanBo").click(function () {
            me.getList_TimCanBo();
        });
        $("#txtTuKhoa_CanBo").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TimCanBo();
            }
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_TuanHienTai: function (strNgayBatDau, strNgayKetThuc, strNgayDangChon) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSLichGiang',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': me.strGiangVien_Id,
            'strNgayBatDau': strNgayBatDau,
            'strNgayKetThuc': strNgayKetThuc,
            'strNgayDangChon': strNgayDangChon,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //if (dtReRult.length > 0) {
                    //    var aData = dtReRult[0];
                    //    $("#lblNgayHienTai").html("Thứ " + edu.util.returnEmpty(aData.THU) + ", ngày " + edu.util.returnEmpty(aData.NGAY));
                    //}
                    me.dtLichHoc = dtReRult;
                    me.genTable_ThongTin(dtReRult, data.Pager);
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
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);

        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
            'strReport_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data.rs;
                    me.dtSinhVien = dtReRult;
                    me.genTable_SinhVien(dtReRult, data.Pager);
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
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        if (data.length > 0) {
            $("#txtTuKhoaDiemDanh").val(data[0].MATLENHGIANGVIEN);
        }else
        $("#txtTuKhoaDiemDanh").val("");

       
        var jsonForm = {
            strTable_Id: "tblNhapChuyenCan",
            
            aaData: data,
            colPos: {
                center: [0, 8, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "SOBUOIVANG"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "MATLENHNGUOIHOC",
                }
            ]
        };
        for (var i = 0; i < me.dtKieuChuyenCan.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<input type="checkbox" class="checkChuyenCan checkSV' + aData.QLSV_NGUOIHOC_ID + ' checkNgay' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID + '" id="chkSelect' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID+ '"  />'
                        + '<input style="width: calc(100% - 40px); float: right" class="inputChuyenCan" id="input_' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID + '" />';
                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        }
        
        edu.system.loadToTable_data(jsonForm);
        //edu.system.genHTML_Progress("divprogessquanso", data.rs.length * data.rsNgay.length);
        me.getData_NhapChuyenCan();
    },
    getData_NhapChuyenCan: function (jsonSV, strNgay_ID, strNgay) {
        var me = this;
        var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);
        //--Edit
        var obj_list = {
            'action': 'CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan',
            'type': 'GET',
            'strKieuChuyenCan_Id': edu.util.getValById('dropAAAA'),
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': 0,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].GIATRI == 1) {
                            var check = $("#chkSelect" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].GIATRI);
                            var inputCheck = $("#input_" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                            if (dtReRult[i].SOLUONG != 0) {
                                inputCheck.val(dtReRult[i].SOLUONG);
                                inputCheck.attr("name", dtReRult[i].SOLUONG);
                            }
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                //edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                //edu.system.start_Progress("divprogessquanso", me.endGetData);
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
    genTable_ThongTin: function (data, iPager) {
        var me = this;
        var iGioMin = 24;
        var iGioMax = 0;
        data.forEach(e => {
            if (e.GIOBATDAU < iGioMin) iGioMin = e.GIOBATDAU;
            if (e.GIOKETTHUC > iGioMax) iGioMax = e.GIOKETTHUC;
        });
        var html = '<div class="date">';
        for (var i = iGioMin; i < iGioMax + 2; i++) {
            html += '<div class="hour-row">' + i +':00</div>';
        }
        html += '</div>';
        for (var j = 0; j < me.arrDay.length; j++) {
            html += '<div class="day-of-week" id="row' + me.arrDay[j] +'">';
            for (var i = iGioMin; i < iGioMax + 2; i++) {
                html += '<div class="hour-row" id="h' + me.arrDay[j] + i +'"></div>';
            }
            html += '</div>';
        }
        $("#datebody").html(html);

        var arrMau = ["#223771", "#f26522", "#ec4c00", "#5a7adb", "#3c5398"];
        data.forEach((e, nRow) => {
            var html = '';
            var iTop = e.GIOKETTHUC * 60 + e.PHUTKETTHUC - e.GIOBATDAU*60 - e.PHUTBATDAU;

            html += '<div class="task task-1 btnLichHoc" id="' + e.IDLICHHOC +'" style="top:' + e.PHUTBATDAU + 'px; height: ' + iTop + 'px; background-color: ' + arrMau[nRow%5] + '; cursor: pointer">';
            html += '<div class="task-header">';
            html += '<div class="text">';
            html += '<div class="title">' + e.TENHOCPHAN + '</div>';
            html += '<div class="task-date">' + me.returnTwo(e.GIOBATDAU) + ':' + me.returnTwo(e.PHUTBATDAU) + ' - ' + me.returnTwo(e.GIOKETTHUC) + ':' + me.returnTwo(e.PHUTKETTHUC) + ' (Tiết ' + edu.util.returnEmpty(e.TIETBATDAU) + '-' + edu.util.returnEmpty(e.TIETKETTHUC) + ')</div>';
            html += '</div>';
            html += '<a class="student-num btnKhoiTaoDoiLich" style="color: #d93625;" title="Yêu cầu đổi lịch" id="' + e.IDLICHHOC +'">';
            html += '<i class="fas fa-calendar-alt"></i>';
            html += '</a>';
            //html += '<div class="title">' + e.TENHOCPHAN + '</div>';
            //html += '<div class="task-date">' + e.TIETBATDAU + ' - ' + e.TIETKETTHUC + '</div>';
            //html += '</div>';
            html += '</div>';
            html += '<div class="task-description">';
            html += e.TENLOPHOCPHAN + "<br/>" + edu.util.returnEmpty(e.TENPHONGHOC);
            html += '</div>';
            html += '</div>';
            $("#datebody #h" + e.NGAYHOC.replace(/\//g, '') + e.GIOBATDAU).html(html);
        });

        if (data.length > 0) {
            var arrNgay = data[0].DSNGAYCOLICH.split(',');
            console.log(arrNgay);
            arrNgay.forEach(e => {
                var point = $(".days li[ngay='" + e + "']");
                if (point.length > 0) {
                    point = point[0];
                    point.classList.add("actionclde");
                }
            });
        }
    },

    save_XacNhan: function (strId) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_LopHoc_Lich_SV/XacNhan_HoTro_LopHoc_Lich_SV',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
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

    genHtml_Month: function (cal) {
        var nMonth = parseInt($("#thang").attr("title"));
        var nYear = parseInt($("#nam").attr("title"));
        nMonth += cal;
        if (nMonth == 0) {
            nMonth = 12;
            nYear--;
            $("#nam").attr("title", nYear);
            $("#nam").html(nYear);
        }
        if (nMonth == 13) {
            nMonth = 1;
            nYear++;
            $("#nam").attr("title", nYear);
            $("#nam").html(nYear);
        }
        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);

        var iDayOfMonth = getDay(nMonth);

        var strDay = edu.util.dateToday();
        var iDay = parseInt(strDay.substr(0, strDay.indexOf("/")));

        var iThu = new Date(nYear, nMonth - 1, 1, 0, 0, 0, 0);
        iThu = iThu.getDay();
        if (iThu == 0) iThu = 7;
        var html = "";
        var strNgayBatDau = '';
        var strNgayKetThuc = '';
        var uuid = edu.util.uuid();
        var iDayOfPreMonth = getDay(nMonth - 1);
        for (var i = iThu - 2; i >= 0; i--) {
            html += '<li class="day-of-other-month ' + uuid + '" title="' + getSMonth(iDayOfPreMonth - i, (nMonth - 1), nYear) +'" >' + (iDayOfPreMonth - i) +'</li>';
        }

        //var bCheck = false;
        var date = new Date();
        if (date.getMonth() + 1 != nMonth || date.getFullYear() != nYear) iDay = 1;

        if (iThu > 1) {
            strNgayBatDau = getSMonth(iDayOfPreMonth - iThu + 2, (nMonth - 1), nYear);
            strNgayKetThuc = getSMonth(8 - iThu, nMonth, nYear);
        }
        for (var i = 1; i <= iDayOfMonth; i++) {
            var strClass = "";
            if (i == iDay) strClass = 'active';
            if ((i % 7 + iThu)%7 == 2) {
                strNgayBatDau = getSMonth(i, nMonth, nYear);
                strNgayKetThuc = (i + 6 > iDayOfMonth) ? getSMonth(i + 6 - iDayOfMonth, (nMonth + 1), nYear) : getSMonth(i + 6, nMonth, nYear);
                uuid = edu.util.uuid();
            }

            html += '<li class="poiter ' + strClass + ' ' + uuid + '" ngay="'+ i +'"  title="' + getSMonth(i, nMonth, nYear) +'" name="' + uuid + '" batdau="' + strNgayBatDau + '" ketthuc="' + strNgayKetThuc +'"><span>' + i + '</span></li>';
        }
        var iMax = 35 - iDayOfMonth - iThu;
        if (iMax < 0) iMax += 7;
        for (var i = 1; i < iMax + 2; i++) {
            html += '<li class="day-of-other-month ' + uuid + '" title="' + getSMonth(i, (nMonth + 1), nYear) +'">' + i + '</li>';
        }
        $(".days").html(html);
        setTimeout(function () {
            $(".days .active").trigger("click");
        }, 1000);

        function getDay(nMonth, nYear) {
            var iDayOfMonth = 31;
            switch (nMonth) {
                case 2: iDayOfMonth = 28; break;
                case 4:
                case 6:
                case 9:
                case 11: iDayOfMonth = 30; break;
            }
            return iDayOfMonth;
        }
        function getSMonth(iDay, nMonth, Year) {
            if (nMonth == 0) {
                nMonth = 12;
                Year--;
            }
            if (nMonth == 13) {
                nMonth = 1;
                Year++;
            }
            return returnTwo(iDay) + '/' + returnTwo(nMonth) + '/' + Year;
        }

        function returnTwo(iDay) {
            iDay = "" + iDay;
            if (iDay.length == 1) return "0" + iDay;
            else return iDay;
        }
    },
    returnTwo: function(iDay) {
        iDay = "" + iDay;
        if (iDay.length == 1) return "0" + iDay;
        else return iDay;
    },

    save_NhapChuyenCan: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien, "QLSV_NGUOIHOC_ID");
        var strNgay = $(point).attr("title");
        var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);
        //--Edit
        var obj_save = {
            'action': 'CC_NguoiHoc_ChuyenCan/ThemMoi',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': "",
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDiem_DanhSach_Id': objSV.DANGKY_LOPHOCPHAN_ID,
            'strKieuChuyenCan_Id': arrId[1],
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NhapChuyenCan: function (point) {
        var me = this;
        //--Edit
        var today = new Date();
        var obj = {};
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien, "QLSV_NGUOIHOC_ID");
        var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);
        var obj_delete = {
            'action': 'CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan2',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': "",
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDiem_DanhSachHoc_Id': objSV.DANGKY_LOPHOCPHAN_ID,
            'strKieuChuyenCan_Id': arrId[1],
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                var obj = {
                    content: ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,
            async: false,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endSetData: function () {
        main_doc.LichGiang.getDetail_SiSo();
        main_doc.LichGiang.getList_SinhVien();
    },


    save_TuGhiNhan: function (strId) {
        var me = this;
        var obj_notify = {};
        var today = new Date();
        var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);
        var obj_save = {
            'action': 'CC_GiangVien_TuGhiNhan/ThemMoi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strDiem_DanhSach_Id': objLich.IDLOPHOCPHAN,
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': 0,
            'strNoiDungTuGhiNhan': edu.util.getValById('txtTuKhoaDiemDanh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
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
    save_DiemDanhTuDong: function (strId) {
        var me = this;
        var obj_notify = {};
        var today = new Date();
        var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);
        var obj_save = {
            'action': 'CC_GiangVien_TuGhiNhan/ThucHienDiemDanhTuDong',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                    me.getDetail_SiSo();
                    me.getList_SinhVien();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DoiLich: function () {
        var me = this;
        var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);
        var arrGiangVien_Id = [];
        var arrGiangVienThayDoi_Id = [];
        me.dtGiangVienThayDoi.forEach((e, nRow) => {
            arrGiangVien_Id.push(e.ID);
            arrGiangVienThayDoi_Id.push($("#dropGiangVien" + e.ID).val());
        });
        //--Edit
        var obj_save = {
            'action': 'KHCT_LichGiang_DoiLich/GuiYeuCauDoiLich',
            'type': 'POST',

            'strIdLichHoc': objLich.IDLICHHOC,
            'strIdHocPhan': objLich.IDHOCPHAN,
            'strIdPhongHoc': objLich.IDPHONGHOC,
            'strIdLopHocPhan': objLich.IDLOPHOCPHAN,
            'strNgayHoc': objLich.NGAYHOC,
            'strThu': objLich.THUHOC,
            'strTietBatDau': objLich.TIETBATDAU,
            'strTietKetThuc': objLich.TIETKETTHUC,
            'strGioBatDau': objLich.GIOBATDAU,
            'strPhutBatDau': objLich.PHUTBATDAU,
            'strGioKetThuc': objLich.GIOKETTHUC,
            'strPhutKetThuc': objLich.PHUTKETTHUC,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNoiDung': edu.util.getValById('txtNoiDungDoiLich'),
            'strIdPhongHoc_ThayDoi': edu.util.getValById('dropPhongHoc_DoiSang'),
            'strNgayHoc_ThayDoi': edu.util.getValById('txtNgayHoc_DoiSang'),
            'strThu_ThayDoi': edu.util.getValById('txtAAAA'),
            'strTietBatDau_ThayDoi': edu.util.getValById('txtTietBatDau_DoiSang'),
            'strTietKetThuc_ThayDoi': edu.util.getValById('txtTietKetThuc_DoiSang'),
            'strGioBatDau_ThayDoi': edu.util.getValById('txtAAAA'),
            'strPhutBatDau_ThayDoi': edu.util.getValById('txtAAAA'),
            'strGioKetThuc_ThayDoi': edu.util.getValById('txtAAAA'),
            'strPhutKetThuc_ThayDoi': edu.util.getValById('txtAAAA'),
            'strGiangVien_Ids': arrGiangVien_Id.toString(),
            'strGiangVien_ThayDoi_Ids': arrGiangVienThayDoi_Id.toString(),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Gửi yêu cầu thành công");
                    me.getList_DoiLich();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    getList_DoiLich: function (strDanhSach_Id) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayDSLichGiang_Doi_ThongTinCaNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DoiLich(dtReRult, data.Pager);
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
    getDetail_DoiLich: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayTTLichGiang_Doi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': strId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.viewForm_DoiLich_View(dtReRult, data.Pager);
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

    save_PhetDuyet: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_LichGiang_DoiLich/Them_TKB_XacNhanDoiLich',
            'type': 'POST',
            'strSanPham_Id': me.strDoiLich_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': edu.util.getValById('txtAAAA'),
            'strTinhTrang_Id': edu.util.getValById('dropAAAA'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phê duyệt thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    delete_DoiLich: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_LichGiang_DoiLich/Xoa_LichGiang_Doi_ThongTin',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                me.getList_DoiLich()
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
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DoiLich: function (data, iPager) {
        var me = this;
        var html = "";
        data.forEach((e, nRow) => {
            html += '<a class="class-change-calendar-item fs-14 btnEdit" id="'+ e.ID +'" style="cursor: pointer">';
            html += '<p><b>Lớp: ' + edu.util.returnEmpty(e.LOPHOCPHAN_TEN) + '</b></p>';
            html += '<p>Trạng thái: ' + edu.util.returnEmpty(e.KETQUAXULY) + '</p></a>';
        });
        $("#tblDoiLich").html(html);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_KhoiTaoDoiLich: function (objLich) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/KhoiTaoThongTinYeuCauDoiLich',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strIdLichHoc': objLich.IDLICHHOC,
            'strIdHocPhan': objLich.IDHOCPHAN,
            'strIdPhongHoc': objLich.IDPHONGHOC,
            'strIdLopHocPhan': objLich.IDLOPHOCPHAN,
            'strNgayHoc': objLich.NGAYHOC,
            'strThu': objLich.THUHOC,
            'strTietBatDau': objLich.TIETBATDAU,
            'strTietKetThuc': objLich.TIETKETTHUC,
            'strGioBatDau': objLich.GIOBATDAU,
            'strPhutBatDau': objLich.PHUTBATDAU,
            'strGioKetThuc': objLich.GIOKETTHUC,
            'strPhutKetThuc': objLich.PHUTKETTHUC,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.viewForm_DoiLich(dtReRult, data.Pager);
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
    viewForm_DoiLich: function (data, iPager) {
        var me = this;
        me.dtGiangVienThayDoi = data.rsGiangVien;
        var aData = data.rsThongTinChung[0];

        edu.util.viewValById("txtNoiDungDoiLich", aData.NOIDUNG);
        edu.util.viewValById("txtTenLopHocPhan", aData.LOPHOCPHAN_TEN);
        edu.util.viewValById("txtNgayHoc", aData.NGAYHOC);
        edu.util.viewValById("txtNgayHoc_DoiSang", aData.NGAYHOC_THAYDOI);
        edu.util.viewValById("txtTietBatDau", aData.TIETBATDAU);
        edu.util.viewValById("txtTietBatDau_DoiSang", aData.TIETBATDAU_THAYDOI);
        edu.util.viewValById("txtTietKetThuc", aData.TIETKETTHUC);
        edu.util.viewValById("txtTietKetThuc_DoiSang", aData.TIETKETTHUC_THAYDOI);
        edu.util.viewValById("txtPhongHoc", aData.PHONGHOC_TEN);
        me.genComBo_PhongHoc("dropPhongHoc_DoiSang", aData.IDPHONGHOC_THAYDOI, data.rsDanhMucPhong);
        var html = "";
        data.rsGiangVien.forEach((e, nRow) => {
            html += '<div class="form-item on-row form-add-info">';
            html += '<label for="">Giảng viên</label>';
            html += '<div class="input-group">';
            html += '<input type="text" class="form-control" value="' + e.HODEM + ' ' + e.TEN + ' - ' + e.MASO + '" disabled>';
            html += '<i class="fal fa-user-crown"></i>';
            html += '<i class="fal fa-angle-down"></i>';
            html += '</div>';
            html += '<div class="right">';
            html += '<div class="arrow">';
            html += '<span>Đổi sang</span>';
            html += '</div>';
            html += '<label for="">Giảng viên</label>';
            html += '<div class="input-group">';
            html += '<select class="form-select select-opt" id="dropGiangVien'+ e.ID +'">';
            html += '</select>';
            html += '<i class="fal fa-user-crown"></i>';
            html += '<i class="fal fa-angle-down"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        $("#tblDoiGiangVien").html(html);
        data.rsGiangVien.forEach((e, nRow) => {
            me.genComBo_GiangVien("dropGiangVien" + e.ID, e.ID, data.rsDanhMucGiangVien);
        });
    },
    viewForm_DoiLich_View: function (data, iPager) {
        var me = this;
        if (data.length > 0) {
            var aData = data[0];
            edu.util.viewValById("txtNoiDungDoiLich_View", aData.NOIDUNG);
            edu.util.viewValById("txtTenLopHocPhan_View", aData.LOPHOCPHAN_TEN);
            edu.util.viewValById("txtNgayHoc_View", aData.NGAYHOC);
            edu.util.viewValById("txtNgayHoc_DoiSang_View", aData.NGAYHOC_THAYDOI);
            edu.util.viewValById("txtTietBatDau_View", aData.TIETBATDAU);
            edu.util.viewValById("txtTietBatDau_DoiSang_View", aData.TIETBATDAU_THAYDOI);
            edu.util.viewValById("txtTietKetThuc_View", aData.TIETKETTHUC);
            edu.util.viewValById("txtTietKetThuc_DoiSang_View", aData.TIETKETTHUC_THAYDOI);
            edu.util.viewValById("txtPhongHoc_View", aData.PHONGHOC_TEN);
            edu.util.viewValById("txtPhongHoc_DoiSang_View", aData.PHONGHOC_THAYDOI_TEN);
            var html = "";
            data.forEach((e, nRow) => {
                html += '<div class="form-item on-row form-add-info">';
                html += '<label for="">Giảng viên</label>';
                html += '<div class="input-group">';
                html += '<input type="text" class="form-control" value="' + edu.util.returnEmpty(e.GIANGVIEN_HOVATEN) + '" disabled>';
                html += '<i class="fal fa-user-crown"></i>';
                html += '<i class="fal fa-angle-down"></i>';
                html += '</div>';
                html += '<div class="right">';
                html += '<div class="arrow">';
                html += '<span>Đổi sang</span>';
                html += '</div>';
                html += '<label for="">Giảng viên</label>';
                html += '<div class="input-group">';
                html += '<input type="text" class="form-control" value="' + edu.util.returnEmpty(e.GIANGVIEN_THAYDOI_HOVATEN) + '" disabled>';
                html += '</select>';
                html += '<i class="fal fa-user-crown"></i>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            });
            $("#tblDoiGiangVien_View").html(html);
            $("#modalXemLich").modal("show");
        }

    },

    genComBo_PhongHoc: function (strTinhTrang_Id, default_val, data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENPHONGHOC",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn phòng học"
        };
        edu.system.loadToCombo_data(obj);
        //$("#" + strTinhTrang_Id).select2();
    },
    genComBo_GiangVien: function (strTinhTrang_Id, default_val, data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MASO);
                },
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).searchBox({
            elementWidth: ''
        });
    },
    
    getDetail_SiSo: function (strId) {
        var me = this;
        //--Edit
        var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);

        var obj_list = {
            'action': 'CC_GiangVien_TuGhiNhan/LayChiTiet', 
            'type': 'GET',
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var aData = {};
                    var html = "";
                    if (dtReRult.length > 0) {
                        aData = dtReRult[0];
                        html += '<b class="flex-shrink-0">Sĩ số: ' + edu.util.returnEmpty(aData.TONGSOSV) + '</b>';
                    }
                    dtReRult.forEach(e => {
                        html += '<span>' + edu.util.returnEmpty(e.TEN) + ': ' + edu.util.returnEmpty(e.SOLUONG) + '</span>';
                    });
                    $("#zoneSiSoSV").html(html);
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
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/

    getList_TimCanBo: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayTTGiangVienTheoTuKhoa',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtTuKhoa_CanBo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var aData = {};
                    if (dtReRult.length > 0) {
                        aData = dtReRult[0];
                        me.strGiangVien_Id = aData.ID;
                        $("#lblCanBoTimKiem").html(edu.util.returnEmpty(aData.MASO) + " - " + edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN));
                        $(".days .active").trigger("click");
                        me.getList_DoiLich();
                    }
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
}