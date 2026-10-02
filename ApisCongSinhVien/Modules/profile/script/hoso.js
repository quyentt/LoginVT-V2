/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function HoSo() { };
HoSo.prototype = {
    strSinhVien_Id: '',
    strHoSo_Id: '',
    dtHoSo: [],
    dtTemp: [],
    aDataSinhVien: {},
    bcheck: false,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_ChuongTrinhHoc();
        me.getDetail_SinhVien();

        function isValidDateFormat(str) {
            // dd/mm/yyyy (01-31 / 01-12 / 4 số năm)
            const regex = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
            return regex.test(str);
        }

        //$("#btnSearch").click(function () {
        //    me.getList_HoSo();
        //});
        //$("#txtSearch_TuKhoa").keypress(function (e) {
        //    if (e.which === 13) {
        //        e.preventDefault();
        //        me.getList_HoSo();
        //    }
        //});
        //$("#dropSearch_KeHoach").on("select2:select", function () {
        //    me.getList_HoSo();
        //    var temp = $("#dropSearch_KeHoach option:selected").attr("name");
        //    if (temp == "0" || temp == 0) {
        //        me.bcheck = true;
        //        $(".hssv").hide();
        //    }
        //});
        $('#dropSearch_ChuongTrinh').on('change', function () {
            if (!edu.util.getValById('dropSearch_ChuongTrinh')) return;
            me.getList_HoSo();
            
        });
        //$('##dropSearch_KeHoach').on('change', function () {
        //    alert(this.value);
        //});
        ////edu.extend.genDropTinhThanh("dropSearch_KeHoach1", "dropSearch_KeHoach2", "dropSearch_KeHoach3", "", "", "");
        //$("#zoneTab").delegate('.tabhoatdong', 'click', function (e) {
        //    var strTab = this.id;
        //    var data = [];
        //    if (strTab && strTab != "undefined")
        //        data = me.dtHoSo.filter(e => e.TAB_THONGTIN_ID == strTab);
        //    else data = me.dtHoSo;
        //    console.log(data);
        //    me.genTable_HoSo(data);
        //});


        $("#zoneTab").delegate('.tab-item', 'click', function (e) {
            var tabId = $(this).attr("name");
            console.log(11111111);
            $(".swiper-slide-thumb-active").removeClass("swiper-slide-thumb-active");
            this.classList.add("swiper-slide-thumb-active");
            var strTab = this.id;
            var data = [];
            if (strTab && strTab != "undefined")
                data = me.dtHoSo.filter(e => e.TAB_THONGTIN_ID == strTab);
            else data = me.dtHoSo;
            me.dtTemp = data;
            me.genTable_HoSo(data);
        });


        edu.system.getList_MauImport("zonebtnBaoCao_TNHS", function (addKeyValue) {
            var obj_save = {
                'strQLSV_NguoiHoc_TTTS_Id': edu.system.userId,
                'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            };
            for (variable in obj_save) {
                addKeyValue(variable, obj_save[variable]);
            }
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_KeHoach_MH/DSA4BRIKJAkuICIpDykgMQkuEi4P',
            'func': 'pkg_hososinhvien_kehoach.LayDSKeHoachNhapHoSo',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
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
                    if (dtResult.length > 0 && dtResult[0].XACNHANTHONGTIN == 0) $("#lblXacNhanTuTruong").html(""); else $("#lblXacNhanTuTruong").html("Xác nhận từ trường");
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
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
                name: "MOTA",
                code: "XACNHANTHONGTIN",
                //selectOne: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_KeHoach", data[0].ID);
            //me.getList_KetQuaHocTap();
            //me.getList_TichLuyTheoKhoi();
        }
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_HoSo: function (aData) {
        var me = this;
        var obj_notify = {};
        var strTruongThongTin_GiaTri = aData.TRUONGTHONGTIN_GIATRI;
        var strThongTinXacMinh = aData.THONGTINXACMINH;
        if (me.bcheck) strTruongThongTin_GiaTri = $("#m" + aData.ID).val();
        else strThongTinXacMinh = $("#m" + aData.ID).val();
        if (aData.KIEUDULIEU.toUpperCase() == "FILE") {
            edu.system.saveFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files");
        }

        //--Edit
        var obj_save = {
            'action': 'SV_KeHoach_MH/FSkkLB4QDRIXHgokCS4gIikeBTQNKCQ0',
            'func': 'pkg_hososinhvien_kehoach.Them_QLSV_KeHoach_DuLieu',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTruongThongTin_Id': aData.ID,
            'strTruongThongTin_GiaTri': strTruongThongTin_GiaTri,
            'strThongTinXacMinh': strThongTinXacMinh,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");

                    //edu.system.saveFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HoSo();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_Anh: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/EjQgHhANEhceDyY0LigJLiIecAPP',
            'func': 'pkg_hosohocvien.Sua_QLSV_NguoiHoc_1',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strAnh': edu.util.getValById('uploadPicture_SV'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Cập nhật thành công!");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    getList_HoSo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_KeHoach_MH/DSA4BRIJLhIuAikuESkkMRIXDykgMQPP',
            'func': 'pkg_hososinhvien_kehoach.LayDSHoSoChoPhepSVNhap',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
        };
        var obj_save = {
            'action': 'SV_HoSoHocVien_Quyen_MH/DSA4BRIJLhIuAikuESkkMQIDDykgMQPP',
            'func': 'pkg_hosohocvien_quyen.LayDSHoSoChoPhepCBNhap',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropSearch_ChuongTrinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHoSo = dtReRult;
                    me.getList_DM_HoatDong();
                    //me.genTable_HoSo(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

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
    genTable_HoSo: function (data, iPager) {
        var me = this;
        $("#lblHoSo_Tong").html(iPager);
        var html = '';
        var strGroup = data.length > 0 ? data[0].THUOCNHOM: "";
        data.forEach((aData, nRow) => {
            var strTempG = aData.THUOCNHOM;
            if (nRow != 0 && strTempG != strGroup) {
                strGroup = strTempG;
                html += '<hr>';
            } else {
                if (nRow != 0)
                strTempG = "";
            }
            html += '<div class="row sv-info-detail-item">';
            html += '<div class="col-12 col-md-2 text-lable-groud"><b>' + edu.util.returnEmpty(strTempG) + '</b></div>';
            html += '<div class="col-12 col-md-2 text-lable">' + aData.TEN;
            html += aData.BATBUOC == 1 ? '<span style="color: red"> *</span>' : '';
            html += '</div>';
            html += '<div class="col-12 col-md-4">';
            html += '<div class="form-item d-flex mb-15 form-add-info">';
            html +='<div class="input-group">';
            //html += '<i class="fa-alarm-clock color-dask-blue"></i>';
            html += aData.TENANH ? '<i class="' + aData.TENANH + ' color-dask-blue"></i>' : '';
            html += geninput(nRow, aData);
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '<div class="col-12 col-md-3">' + edu.util.returnEmpty(aData.KETQUAXACNHAN_TEN) + '</div>';
            //html += '<div class="col-12 col-md-1 col-upload"><div id="txtFileDinhKem' + aData.ID + '" ></div></div>';
            html += '</div>';
        });
        $("#tblHoSo").html(html);



        function geninput(nRow, aData) {
            return '<input id="m' + aData.ID + '"  class="form-control" value="' + edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI) + '" readonly />';
            if (aData.KIEUDULIEU) {
                var strLoai = 'input';
                var strDuocSua = (aData.DUOCSUA === 0 ? 'readonly="readonly"' : '');
                var strDoDai = (aData.DORONG) ? 'height: ' + aData.DORONG + 'px' : '';
                if (aData.DORONG) strLoai = "textarea";
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "TEXT": return '<' + strLoai + ' id="m' + aData.ID + '"  class="form-control" value="' + me.getGiaTri(aData) + '" style="' + strDoDai + '" ' + strDuocSua + ' />';
                    case "NUMBER": return '<' + strLoai + ' id="m' + aData.ID + '"  class="form-control input-number" value="' + me.getGiaTri(aData) + '" style="' + strDoDai + '" ' + strDuocSua + ' />';
                    case "DATE": return '<input id="m' + aData.ID + '"  class="form-control input-datepicker" value="' + me.getGiaTri(aData) + '" ' + strDuocSua + ' />';
                    case "TINH":
                    case "HUYEN":
                    case "XA":
                    case "LIST":
                        return '<select id="m' + aData.ID + '" class="form-select select-opt"></select>';
                    case "FILE": return '<div id="m' + aData.ID + '"></div>';
                    //case "AVATAR": return '<div id="' + aData.ID + '"></div>';
                }
            }
        }
        
        //var arrFile = [];
        //data.forEach(aData => {
        //    if (aData.KIEUDULIEU) {
        //        switch (aData.KIEUDULIEU.toUpperCase()) {
        //            case "LIST": {
        //                if (aData.MABANGDANHMUC) {
        //                    edu.system.loadToCombo_DanhMucDuLieu(aData.MABANGDANHMUC, "m" + aData.ID);
        //                    $("#m" + aData.ID).select2();
        //                }
        //            }; break;
        //            case "FILE": edu.system.uploadFiles(["m" + aData.ID]); break;
        //            case "TINH": {
        //                var objHuyen = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "HUYEN"));
        //                var objXa = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "XA"));

        //                var strTinh_Id = "m" + aData.ID;
        //                var strHuyen_Id = objHuyen ? "m" + objHuyen.ID: "";
        //                var strXa_Id = objXa ?  "m" + objXa.ID: "";
        //                $("#" + strTinh_Id).select2();
        //                if (strHuyen_Id) $("#" + strHuyen_Id).select2();
        //                if (strXa_Id) $("#" + strXa_Id).select2();

        //                var strTinh = me.getGiaTri(aData);
        //                var strHuyen = objHuyen ? me.getGiaTri(objHuyen) : "";
        //                var strXa = strXa_Id? me.getGiaTri(objXa): "";

        //                edu.extend.genDropTinhThanh(strTinh_Id, strHuyen_Id, strXa_Id, strTinh, strHuyen, strXa);
        //            }; break;
        //        }
        //    }
        //    arrFile.push("txtFileDinhKem" + aData.ID);
        //});

        ////edu.system.uploadFiles(arrFile);
        //setTimeout(function () {
        //    data.forEach(aData => {
        //        if (aData.KIEUDULIEU) {

        //            switch (aData.KIEUDULIEU.toUpperCase()) {
        //                case "LIST": {
        //                    $("#m" + aData.ID).val(me.getGiaTri(aData)).trigger("change");
        //                }; break;
        //                case "FILE": edu.system.viewFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files"); break;
        //            }
        //        }
        //        //edu.system.viewFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
        //    });
        //}, 1000);
        //edu.system.pickerdate();
        //edu.system.pickerNumber();
        //me.actionRowSpanForACol(jsonForm.strTable_Id, 1);
        /*III. Callback*/
    },
    actionRowSpanForACol: function (strTableId, icol) {
        if (document.getElementById(strTableId) == undefined) {
            edu.system.alert("Không tồn tại: <b>" + strTableId + "</b>");
            return;
        }
        x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
        var tempCellobj = x[0].cells[icol];
        console.log(tempCellobj)
        for (var i = 1; i < x.length; i++) {
            if (!tempCellobj.innerHTML || x[i].cells[icol].innerHTML != tempCellobj.innerHTML) {
                tempCellobj = x[i].cells[icol];
            } else {
                tempCellobj.rowSpan++;
                x[i].deleteCell(icol);
            }
        }
    },

    getDetail_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'SV_Custom/DSA4FSkuLyYVKC8CKSgVKCQ1CS4SLgPP',
            'func': 'pkg_hosohocvien.LayThongTinChiTietHoSo',
            'iM': edu.system.iM,
            'strId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (data.Data.length > 0) {
                        me.viewForm_SinhVien(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
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
    viewForm_SinhVien: function (aData) {
        $("#lblHoTen").html(edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN));
        $("#lblNgaySinh").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_NGAYSINH));
        $("#lblCMT").html(edu.util.returnEmpty(aData.CMTND_SO));
        $("#lblMaSinhVien").html(edu.util.returnEmpty(aData.MASO));
        $("#lblNganhHoc").html(edu.util.returnEmpty(aData.NGANH));
        $("#lblLopQuanly").html(edu.util.returnEmpty(aData.LOP));
        $("#lblMaNganh").html(edu.util.returnEmpty(aData.MANGANH));

        var strAnh = edu.system.getRootPathImg(aData.ANHCANHANTUUP);
        edu.util.viewValById("uploadPicture_SV", aData.ANHCANHANTUUP);////
        $("#srcuploadPicture_SV").attr("src", strAnh);////
    },
    getGiaTri: function (aData) {
        var me = this;
        if (me.bcheck) return edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI);
        return edu.util.returnEmpty(aData.THONGTINXACMINH);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_DM_HoatDong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_KeHoach_MH/DSA4BRIVICMVKS4vJhUoLw8mNC4oCS4i',
            'func': 'pkg_hososinhvien_kehoach.LayDSTabThongTinNguoiHoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
        };
        var obj_save = {
            'action': 'SV_HoSoHocVien_Quyen_MH/DSA4BRIVICMVKS4vJhUoLw8mNC4oCS4i',
            'func': 'pkg_hosohocvien_quyen.LayDSTabThongTinNguoiHoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropSearch_ChuongTrinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.genComBo_DM_HoatDong(dtReRult);
                    me.genTab_DM_HoatDong(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genTab_DM_HoatDong: function (data) {
        var me = this;
        var html = '';
        data.forEach((aData, nRow) => {
            html += '<div class="tab-item swiper-slide tabtinhtrang" id="' + aData.ID + '" name="tabtinhtrang">';
            html += '<a href="#">';
            html += '<i class="' + aData.TAB_THONGTIN_TENANH + '"></i>';
            html += '<p>' + aData.TAB_THONGTIN_TEN + '</p>';
            html += '</a>';
            html += '</div>';
        });
        console.log(html)
        $("#zoneTab").html(html);
        if (data.length > 0) {
            console.log($("#zoneTab [id=" + data[0].ID + "]"));
            $("#zoneTab [id=" + data[0].ID + "]").trigger("click");
        }
    },

    getList_ChuongTrinhHoc: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,//edu.util.getValById('dropAAAA'),
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
                    me.genCombo_ChuongTrinhHoc(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinhHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_CHUONGTRINH_TEN",
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
            //me.getList_KetQuaHocTap();
            //me.getList_TichLuyTheoKhoi();
        }
    },
}
