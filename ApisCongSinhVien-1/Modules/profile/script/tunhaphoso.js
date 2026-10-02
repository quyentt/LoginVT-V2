/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TuNhapHoSo() { };
TuNhapHoSo.prototype = {
    strSinhVien_Id: '',
    strTuNhapHoSo_Id: '',
    dtTuNhapHoSo: [],
    aDataSinhVien: {},
    bcheck: false,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_KeHoach();
        me.getDetail_SinhVien();
        $(".btnSave_TuNhapHoSo").click(function () {
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", me.dtTuNhapHoSo.length);
            for (var i = 0; i < me.dtTuNhapHoSo.length; i++) {
                me.save_TuNhapHoSo(me.dtTuNhapHoSo[i]);
            }
        });
        $("#btnSearch").click(function () {
            me.getList_TuNhapHoSo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TuNhapHoSo();
            }
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_TuNhapHoSo();
            me.getList_DM_HoatDong(); 
            var temp = $("#dropSearch_KeHoach option:selected").attr("name");
            if (temp == "0" || temp == 0) {
                me.bcheck = true;
                $(".hssv").hide();
            }
        });
        //edu.extend.genDropTinhThanh("dropSearch_KeHoach1", "dropSearch_KeHoach2", "dropSearch_KeHoach3", "", "", "");
        $("#zoneTab").delegate('.tabhoatdong', 'click', function (e) {
            var strTab = this.id;
            var data = [];
            if (strTab && strTab != "undefined")
                data = me.dtTuNhapHoSo.filter(e => e.TAB_THONGTIN_ID == strTab);
            else data = me.dtTuNhapHoSo;
            console.log(data);
            me.genTable_TuNhapHoSo(data);
        });
        edu.system.uploadAvatar(['uploadPicture_SV'], "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_KeHoach_NguoiHoc/LayDSKeHoachNhapHoSo',
            'type': 'GET',
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
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

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
                name: "MOTA",
                code: "XACNHANTHONGTIN",
                selectOne: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropSearch_KeHoach").trigger({ type: 'select2:select' });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TuNhapHoSo: function (aData) {
        var me = this;
        var obj_notify = {};
        var strTruongThongTin_GiaTri = aData.TRUONGTHONGTIN_GIATRI;
        var strThongTinXacMinh = aData.THONGTINXACMINH;
        if (me.bcheck) strTruongThongTin_GiaTri = $("#m" + aData.ID).val();
        else strThongTinXacMinh = $("#m" + aData.ID).val();
        if (aData.KIEUDULIEU.toUpperCase() == "FILE") {
            edu.system.saveFiles("m" + aData.ID, aData.ID, "SV_Files");
        }

        //--Edit
        var obj_save = {
            'action': 'SV_KeHoach_DuLieu/ThemMoi',
            'type': 'POST',
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

                    edu.system.saveFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
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
                    me.getList_TuNhapHoSo();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_Anh: function () {
        var obj_save = {
            'action': 'SV_HoSo/Sua_QLSV_NguoiHoc_1',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strAnh': edu.util.getValById('uploadPicture_SV'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
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
    getList_TuNhapHoSo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_KeHoach_NguoiHoc/LayDSHoSoChoPhepSVNhap',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTuNhapHoSo = dtReRult;
                    me.genTable_TuNhapHoSo(dtReRult, data.Pager);
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
    delete_TuNhapHoSo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_TuNhapHoSo/Xoa',
            
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
                    me.getList_TuNhapHoSo();
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
    genTable_TuNhapHoSo: function (data, iPager) {
        var me = this;
        $("#lblTuNhapHoSo_Tong").html(iPager);

        var jsonForm = {
            strTable_Id: "tblTuNhapHoSo",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "THUOCNHOM"
                }      ,
                {
                    "mDataProp": "TEN"
                }            ]
        };
        if (!me.bcheck) {
            jsonForm.aoColumns.push({
                "mDataProp": "TRUONGTHONGTIN_GIATRI"
            });
        }
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                if (aData.KIEUDULIEU) {
                    var strLoai = 'input';
                    var strDuocSua = (aData.DUOCSUA === 0 ? 'readonly="readonly"' : '');
                    var strDoDai = (aData.DORONG) ? 'height: ' + aData.DORONG + 'px' : '';
                    if (aData.DORONG) strLoai = "textarea";
                    switch (aData.KIEUDULIEU.toUpperCase()) {
                        case "TEXT":
                        case "NUMBER":
                            return '<' + strLoai +' id="m' + aData.ID + '"  class="form-control" value="' + me.getGiaTri(aData) + '" style="' + strDoDai +'" ' + strDuocSua + ' />';
                        case "DATE": return '<input id="m' + aData.ID + '"  class="form-control input-datepicker" value="' + me.getGiaTri(aData) + '" ' + strDuocSua + ' />';
                        case "TINH": 
                        case "HUYEN":
                        case "XA": 
                        case "LIST": 
                            return '<select id="m' + aData.ID + '" class="select-opt"></select>';
                        case "FILE": return '<div id="m' + aData.ID + '"></div>';
                        //case "AVATAR": return '<div id="' + aData.ID + '"></div>';
                    }
                }
            }
        },
        {
            "mDataProp": "KETQUAXACNHAN_TEN"
        },
        {
            "mData": "KETQUAXACNHAN_TEN",
            "mRender": function (nRow, aData) {
                return '<div id="txtFileDinhKem' + aData.ID + '" ></div>';
            }
        });
        edu.system.loadToTable_data(jsonForm);
        var arrFile = [];
        data.forEach(aData => {
            if (aData.KIEUDULIEU) {
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "LIST": {
                        if (aData.MABANGDANHMUC) {
                            edu.system.loadToCombo_DanhMucDuLieu(aData.MABANGDANHMUC, "m" + aData.ID);
                            $("#m" + aData.ID).select2();
                        }
                    }; break;
                    case "FILE": edu.system.uploadFiles(["m" + aData.ID]); break;
                    case "TINH": {
                        var objHuyen = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "HUYEN"));
                        var objXa = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "XA"));

                        var strTinh_Id = "m" + aData.ID;
                        var strHuyen_Id = "m" + objHuyen.ID;
                        var strXa_Id = "m" + objXa.ID;
                        $("#" + strTinh_Id).select2();
                        $("#" + strHuyen_Id).select2();
                        $("#" + strXa_Id).select2();

                        var strTinh = me.getGiaTri(aData);
                        var strHuyen = me.getGiaTri(objHuyen);
                        var strXa = me.getGiaTri(objXa);

                        edu.extend.genDropTinhThanh(strTinh_Id, strHuyen_Id, strXa_Id, strTinh, strHuyen, strXa);
                    };break;
                }
            }
            arrFile.push("txtFileDinhKem" + aData.ID);
        });

        edu.system.uploadFiles(arrFile);
        setTimeout(function (){
            data.forEach(aData => {
                if (aData.KIEUDULIEU) {

                    switch (aData.KIEUDULIEU.toUpperCase()) {
                        case "LIST": {
                            $("#m" + aData.ID).val(me.getGiaTri(aData)).trigger("change");
                        }; break;
                        case "FILE": edu.system.viewFiles("m" + aData.ID, "m" + aData.ID, "SV_Files"); break;
                    }
                }
                edu.system.viewFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
            });
        }, 1000);
        edu.system.pickerdate();
        me.actionRowSpanForACol(jsonForm.strTable_Id, 1);
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
        var obj_list = {
            'action': 'SV_HoSo/LayChiTiet',
            'type': 'GET',
            'strId': me.strSinhVien_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (data.Data.length > 0) {
                        me.aDataSinhVien = data.Data[0];
                        me.viewForm_SinhVien(data.Data[0]);
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
    viewForm_SinhVien: function (aData) {
        $("#lblHoTen").html(edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN));
        $("#lblNgaySinh").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_NGAYSINH));
        $("#lblCMT").html(edu.util.returnEmpty(aData.CMTND_SO));
        $("#lblMaSinhVien").html(edu.util.returnEmpty(aData.MASO));
        $("#lblNganhHoc").html(edu.util.returnEmpty(aData.NGANH));
        $("#lblMaNganh").html(edu.util.returnEmpty(aData.MANGANH));

        var strAnh = edu.system.getRootPathImg(aData.ANH);
        edu.util.viewValById("uploadPicture_SV", data.ANH);////
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
        var obj_list = {
            'action': 'SV_KeHoach_NguoiHoc/LayDSTabThongTinNguoiHoc',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
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

    genTab_DM_HoatDong: function (data) {
        var me = this;
        var html = '';
        data.forEach((aData, nRow) => {
            html += '<li class="tabhoatdong" id="' + aData.ID + '">';
            html += '<a href="#tab_2" data-toggle="tab" aria-expanded="false">';
            html += '<span class="lang" key="">' + (nRow + 2) + ') ' + aData.TAB_THONGTIN_TEN + '</span>';
            html += '</a>';
            html += '</li>';
        });
        $("#zoneTab").append(html);
    },
}
