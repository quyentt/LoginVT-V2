/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 23/08/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ChotTinhPhi() { };
ChotTinhPhi.prototype = {
    arrHangDoi_Id: [],
    countQueue: 0,
    iThread_Queue: 10,
    objHangDoi: {},

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiKhoan();
        me.getList_TrangThaiSV();
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.NVAP", "dropNghiepVu_CTP", "Chọn nghiệp vụ áp dụng");
        $('#dropHeDaoTao_CTP').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_CTP");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
        });
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
        //var obj_Queue = {
        //    strLoaiNhiemVu: "CHOTTINHPHITUDONG" + $("#dropNghiepVu_CTP").val()
        //}
        //edu.system.getList_HangDoi(obj_Queue, "", "", me.genHTML_HangDoi);
        me.objHangDoi = {
            strLoaiNhiemVu: "CHOTTINHPHITUDONG" + $("#dropNghiepVu_CTP").val(),
            strName: "ChotTinhPhi",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        /*------------------------------------------
        --Author: nnthuong
        --Discription: main action  
        -------------------------------------------*/
        $("#btnChotTinhPhi").click(function () {
            edu.system.confirm("Bạn có chắc chắn <span class='italic color-warning'>Tính học phí</span> không?");
            $("#btnYes").click(function (e) {
                me.TaoHangDoi_ChotTinhPhi_TuDong();
            });

        });
        //$("#tblTaskBar_ChotTinhPhi").delegate('.btnStart', 'click', function () {
        //    var strId = this.id;
        //    var strHangDoi_Id = strId.replace(/start_hangdoi/g, "");
        //    if (edu.util.checkValue(strHangDoi_Id)) {
        //        me.arrHangDoi_Id.push(strHangDoi_Id);
        //        me.proSeqMain_HangDoi(strHangDoi_Id);
        //        //me.enableButton_Stop(strHangDoi_Id);
        //    }
        //});
        //$("#tblTaskBar_ChotTinhPhi").delegate('.btnCancle', 'click', function () {
        //    var strId = this.id;
        //    strHangDoi_Id = strId.replace(/cancle_hangdoi/g, "");
        //    if (edu.util.checkValue(strHangDoi_Id)) {
        //        //huy
        //        console.log("Huy");
        //    }
        //    //me.enableButton_Start(strHangDoi_Id);
        //});

        $("#tblTaskBar_ChotTinhPhi").delegate("#btnXemDanhSach", "click", function () {
            me.getList_NienChe();
            me.getList_TinChi();
        });
        /*------------------------------------------
        --Author: nnthuong
        --Discription: main action  
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_TinChi();
        });
        $("#btnRefreshNienChe").click(function () {
            me.getList_NienChe();
        });
        $("#tblTinChi_ChotTinhPhi").delegate(".btnChiTiet", "click", function () {
            var selected_id = this.id;
            edu.util.toggle_overide("zone-bus", "zone_input");
            me.getDetail_TinChi(selected_id);
        });
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });

        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_CTP", function (addKeyValue) {
            addKeyValue("strHeDaoTao", edu.util.getValById("dropHeDaoTao_CTP"));
            addKeyValue("strKhoaDaoTao", edu.util.getValById("dropKhoaDaoTao_CTP"));
            addKeyValue("strThoiGianDaoTao", edu.util.getValById("dropThoiGianDaoTao_CTP"));
            addKeyValue("strKhoanThu", edu.util.getValById("dropKhoanThu_CTP"));
            addKeyValue("strNghiepVu", edu.util.getValById("dropNghiepVu_CTP"));
        });
        $(document).delegate(".ckbDSTrangThaiSV_CTP_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_CTP").each(function () {
                this.checked = checked_status;
            });
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    loadProgressBar: function (obj) {

        //1. nap du lieu
        var objProBar = {
            title: 'Tổng dữ liệu',
            items: obj.items,
            renderPlace: obj.renderPlace,
        }
        edu.system.getProgressBar(objProBar);
        //2. update progressbar
        var objProBar = {
            items: obj.items,
            completed: obj.completed,
            renderPlace: obj.renderPlace,
        };
        edu.system.updateProgressBar(objProBar);
        //3. remove effect
        var $percent = "#percent_" + obj.renderPlace;
        edu.system.removeEffectProgressBar($percent);
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    TaoHangDoi_ChotTinhPhi_TuDong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_HangDoi/TaoHangDoi_ChuyenKeToan_TuDong',
            'versionAPI': 'v1.0',

            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_CTP'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_CTP'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CTP'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CTP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_CTP'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_CTP').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    //var obj_Queue = {
                    //    strLoaiNhiemVu: "CHOTTINHPHITUDONG" + $("#dropNghiepVu_CTP").val()
                    //}
                    //edu.system.getList_HangDoi(obj_Queue, "", "", me.genHTML_HangDoi);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: "QLTC_HangDoi.TaoHangDoi_ChotTinhPhi_TuDong: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "QLTC_HangDoi.TaoHangDoi_ChotTinhPhi_TuDong (er): " + JSON.stringify(er),
                    code: "w",
                }
                edu.system.afterComfirm(obj);
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endHangDoi: function () {
        var me = main_doc.ChotTinhPhi;
        me.getList_TinChi();
        me.getList_NienChe();
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 24/08/2018 console.log("[ index ----------------------> " + index + " ]");
    --Discription: processing HangDoi sequence (1 HangDoi <==> n Task ==> process each task util finish all task)
    ----------------------------------------------*/
    proSeqMain_HangDoi: function (strHangDoi_Id) {
        var me = main_doc.ChotTinhPhi;

        return new Promise(function (resolve, reject) {
            var obj_Task = {
                strHangDoi_Id: strHangDoi_Id,
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: me.iThread_Queue,
            }
            edu.system.getList_XuLyNhiemVu(obj_Task, resolve, reject, "");

        }).then(function (objData) {
            if (objData.length > 0) {
                me.proSeqLoop_HangDoi(objData, me.proSeqItem_HangDoi, strHangDoi_Id).then(function () {
                    // all done here
                }, function (reason) {
                    // rejection happened
                    alert("Rejection in proSeqMain_HangDoi(): " + reason);
                });
            }
            else {
                return false;
            }
        });
    },
    proSeqLoop_HangDoi: function (obj, fun, strHangDoi_Id) {
        var index = 0;
        return new Promise(function (resolve, reject) {
            function next() {
                if (index < obj.length) {
                    fun(obj[index++], strHangDoi_Id).then(next, reject);
                } else {
                    resolve();
                }
            }
            next();
        });
    },
    proSeqItem_HangDoi: function (obj, strHangDoi_Id) {
        var me = main_doc.ChotTinhPhi;
        me.countQueue++;
        var renderPlace_Progress = "probar_ChotTinhPhi" + strHangDoi_Id
        return new Promise(function (resolve, reject) {
            var obj_Task = {
                strHangDoi_Id: strHangDoi_Id,
                strNhiemVu_Id: obj.ID//(n id)
            }
            edu.system.save_XuLyNhiemVu(obj_Task, resolve, reject, "");

        }).then(function (obj) {
            return new Promise(function (resolve, reject) {
                var obj_Task = {
                    strHangDoi_Id: strHangDoi_Id,
                }
                edu.system.getDetail_HangDoi(obj_Task, resolve, reject, "");

            }).then(function (obj) {
                //1. get info
                var iTongDuLieu = obj.iTongDuLieuCanThucHien;
                var iTongDuLieu_HoanThanh = obj.iTongDuLieuDaHoanThanh;
                //2. update progressbar
                var objProBar = {
                    items: iTongDuLieu,
                    completed: iTongDuLieu_HoanThanh,
                    renderPlace: renderPlace_Progress,
                };
                edu.system.updateProgressBar(objProBar);
                //3.loop
                if (me.countQueue == me.iThread_Queue) {
                    me.proSeqMain_HangDoi(strHangDoi_Id);
                    me.countQueue = 0;
                }
                //4. 
                if (iTongDuLieu == iTongDuLieu_HoanThanh) {
                    //4.1 --> update table
                    var obj_Queue = {
                        strLoaiNhiemVu: "CHOTTINHPHITUDONG" + $("#dropNghiepVu_CTP").val()
                    }
                    edu.system.getList_HangDoi(obj_Queue, "", "", me.genHTML_HangDoi);
                    //4.2 --> show notify and hide action
                    $("#" + renderPlace_Progress).html("<span class='color-active italic'>Tiến trình thực hiện thành công!</span>");
                    $("#action_ChotTinhPhi").hide();
                    me.getList_TinChi();
                    me.getList_NienChe();
                }
            });

        });
        //
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 24/08/2018
    --Discription: genHTML HangDoi
    ----------------------------------------------*/
    genHTML_HangDoi: function (data, iPager) {
        var me = main_doc.ChotTinhPhi;

        me.genHistory_HangDoi(data, iPager);
        var obj = {};
        var html = "";
        var place = "#tblTaskBar_ChotTinhPhi tbody";
        var strHangDoi_Id = "";
        var iTongDuLieu = 0;
        var iTongDuLieu_HoanThanh = 0;
        var count_HangDoi = 0;
        $(place).html("");

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                strHangDoi_Id = data[i].ID;
                iTongDuLieu = edu.util.returnZero(data[i].TONGDULIEUCANTHUCHIEN);
                iTongDuLieu_HoanThanh = edu.util.returnZero(data[i].TONGDULIEUDAHOANTHANH);

                if (iTongDuLieu != iTongDuLieu_HoanThanh) {
                    //1. gen form contain taskbar
                    html = "";
                    html += '<tr>';
                    html += '<td class="">- Thanh tiến trình ' + (i + 1) + '</td>';
                    html += '<td class="td-right">';
                    html += '<div id="probar_ChotTinhPhi' + strHangDoi_Id + '">';
                    html += '</div>';
                    html += '<div id="action_ChotTinhPhi" class="pull-right">';
                    html += '<a class="btn btn-primary btnStart" id="start_hangdoi' + strHangDoi_Id + '"><i class="fa fa-play"></i> Bắt đầu</a>'
                    html += '</div>';
                    html += '</td>';
                    html += '</tr>';
                    $(place).append(html);
                    //2. gen taskbar
                    obj = {};
                    obj.items = iTongDuLieu;
                    obj.completed = iTongDuLieu_HoanThanh;
                    obj.renderPlace = "probar_ChotTinhPhi" + strHangDoi_Id;
                    me.loadProgressBar(obj);
                }
                else {
                    count_HangDoi++;
                }
            }
            //.check exitance HangDoi
            if (count_HangDoi == data.length) {
                $(place).append("<tr><td colspan='2' class='color-warning italic'>Không có tiến trình nào cần xử lý!</td></tr>");
            }
        }

    },
    genHistory_HangDoi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHistory_ChotTinhPhi",
            aaData: data,
            sort: true,
            colPos: {
                left: [1, 2],
                center: [0, 3, 4],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOITHUCHIEN_TENDAYDU"
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                }
                , {
                    "mDataProp": "TONGDULIEUCANTHUCHIEN"
                }
                , {
                    "mDataProp": "TONGDULIEUDAHOANTHANH"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//call only one time
            edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
        }
        else {
            edu.util.objGetDataInData(strHeDaoTao_Id, me.dtKhoaDaoTao, "DAOTAO_HEDAOTAO_ID", me.cbGenCombo_KhoaDaoTao);
        }
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var strDAOTAO_Nam_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;


        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
            'versionAPI': 'v1.0',

            'strDAOTAO_Nam_Id': strDAOTAO_Nam_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.loadToCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_LoaiKhoan: function () {
        var me = this;

        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.dtLoaiKhoan = dtResult;
                    me.cbGenCombo_KhoanThu(dtResult);
                }
                else {
                    edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeDaoTao_CTP"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao_CTP"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianDaoTao_CTP"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoanThu: function (data) {
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
            renderPlace: ["dropKhoanThu_CTP"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    getList_TinChi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KetQuaDaTinhPhi_ChuaKiemTra/LayDanhSach',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_CTP'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CTP'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CTP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_CTP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_CTP'),
            'strNguoiThucHien_Id': edu.system.userId,

        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_TinChi(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_TinChi: function (strQLSV_NguoiHoc_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KetQuaDaTinhPhi_NC/LayDanhSach',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_CTP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_CTP'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_CTP'),

            'strChuongTrinh_Id': "",
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDeTail_TinChi(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TinChi: function (data, iPager) {
        var me = this;
        $("#tblTinChi_ChotTinhPhi_Tong").html(iPager);
        var strTable_Id = "tblTinChi_ChotTinhPhi";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                left: [1, 2, 5, 6, 7],
                center: [3, 4, 8, 9, 10, 11, 12, 13, 14, 15],
                fix: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btnChiTiet" id="' + aData.QLSV_NGUOIHOC_ID + '" href="#">' + aData.QLSV_NGUOIHOC_MASO + '</a>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TINHTRANG"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_LOP"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_CHUONGTRINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_KHOAHOC"
                },
                {
                    "mDataProp": "SOHOCPHAN"
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "SOTIEN_HOCDI"
                },
                {
                    "mDataProp": "SOTIEN_HOCLAI"
                },
                {
                    "mDataProp": "SOTIEN_HOCNANGDIEM"
                },
                {
                    "mDataProp": "PHANTRAMMIEN"
                },
                {
                    "mDataProp": "SOTIENMIEN"
                },
                {
                    "mDataProp": "SOTIENPHAINOP"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(strTable_Id, [8, 9, 10, 11, 12, 14, 15]);
        /*III. Callback*/
    },
    genDeTail_TinChi: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblChiTiet";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                left: [1, 2],
                center: [3, 4, 5, 6, 7, 8],
                fix: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TINCHI"
                },
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "PHANTRAMMIEN"
                },
                {
                    "mData": "SOTIENMIEN",
                    "mRender": function (nRow, aData) {
                        return parseInt(aData.SOTIEN) - parseInt(aData.SOTIENMIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(strTable_Id, [4, 5, 7, 8]);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    getList_NienChe: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KetQuaDaTinhPhi_NC_ChuaKiemTra/LayDanhSach',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_CTP'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CTP'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CTP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_CTP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_CTP'),
            'strNguoiThucHien_Id': edu.system.userId,

        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_NienChe(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_NienChe: function (data, iPager) {
        var me = this;
        $("#tblNienChe_ChotTinhPhi_Tong").html(iPager);
        var strTable_Id = "tblNienChe_ChotTinhPhi";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                left: [1, 2, 5, 6, 7],
                center: [3, 4, 8, 9, 10, 11],
                fix: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TINHTRANG"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_LOP"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_CHUONGTRINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_KHOAHOC"
                },
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "PHANTRAMMIEN"
                },
                {
                    "mDataProp": "SOTIENMIEN"
                },
                {
                    "mDataProp": "SOTIENPHAINOP"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(strTable_Id, [8, 10, 11]);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MauImport: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SYS_Import_PhanQuyen/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_MauImport(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MauImport: function (data) {
        var me = this;
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<li><a class="btnBaoCao_CTP" name="' + data[i].MAUIMPORT_MA + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + '</a></li>';
        }
        $("#zonebtnBaoCao_CTP").html(row);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_CTP_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_CTP" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_CTP").html(row);
    },
}