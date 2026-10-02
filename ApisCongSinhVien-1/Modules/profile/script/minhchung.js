
function MinhChung() { };
MinhChung.prototype = {
    dtHoSo: [],

    init: function () {
        var me = this;
        me.getDetail_SinhVien();
        me.getList_HoSoGiayTo();
        $("#btnLuuHoSo").click(function () {
            me.dtHoSo.forEach(e => { me.save_HoSoGiayTo(e); });
        });
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> tổ hợp môn
    --Author: duyentt
    -------------------------------------------*/
    getList_HoSoGiayTo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NH_QuyDinhHoSo_ApDung/LayDSCacHoSoNhapHoc',
            'strQLSV_NguoiHoc_TTTS_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;

                    dtResult = data.Data;
                    me.dtHoSo = dtResult;
                    me.genTable_HoSo(dtResult);
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

    genTable_HoSo: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_HoSoGiayTo",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIHOSO_TEN"
                },
                {
                    "mDataProp": "MOTA"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<div id="file' + aData.ID + '" ></div>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var arrUpload = [];
        data.forEach(e => { arrUpload.push("file" + e.ID); });
        edu.system.uploadFiles(arrUpload);
        setTimeout(function(){
            data.forEach(e => { edu.system.viewFiles("file" + e.ID, e.ID, "SV_Files") });
        }, 1000);
        /*III. Callback*/
    },

    save_HoSoGiayTo: function (element) {
        var strId = element.ID;
        var temp = $("#zoneFileDinhKemfile" + strId + " ul li");
        if (temp.length > 0) {

            var obj_save = {
                'action': 'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_ThuHoSo',
                'type': 'POST',
                'strQLSV_NguoiHoc_TTTS_Id': edu.system.userId,
                'strLoaiHoSo_Ids': element.LOAIHOSO_ID,
                'strLoaiHoSo_SoLuong_s': temp.length,
                'strNguoiThucHien_Id': edu.system.userId,
            };

            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        if (!edu.util.checkValue(obj_save.strId)) {
                            edu.system.alert("Thêm mới thành công!");
                        }
                        else {
                            edu.system.alert("Cập nhật thành công!");
                        }
                        edu.system.saveFiles("file" + strId, strId, "SV_Files");
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
        }
    },


    getDetail_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_HoSo/LayChiTiet',
            'type': 'GET',
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
    }
};