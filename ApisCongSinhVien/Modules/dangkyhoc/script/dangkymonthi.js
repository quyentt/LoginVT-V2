/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DangKyMonThi() { };
DangKyMonThi.prototype = {
    strSinhVien_Id: '',
    strChuongTrinh_Id: '',
    strNguyenVong_Id: '',
    strKeHoach_Id: '',
    dtNguyenVong: [],
    dtChuaDangKy: [],
    dtDaDangKy: [],
    dtMoHinh: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_ChuongTrinhHoc();
        $('#dropSearch_ChuongTrinh').on('change', function () {
            if (!edu.util.getValById('dropSearch_ChuongTrinh')) return;
            me.getList_KeHoach();
        });
        $("#btnSearch").click(function () {
            me.getList_KeHoach();
        });
        $("#zonekehoach").delegate('.btnDangKy', 'click', function (e) {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            me.getList_DangKy();

            //edu.util.toggle_overide("zone-bus", "zonedangky");
        });

        $("#zonekehoach").delegate('.btnKetQua', 'click', function (e) {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            me.getList_KetQua();
        });

        $("#zonedangky").delegate('.btnDangKyHocPhan', 'click', function (e) {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn không?");
            $("#btnYes").click(function (e) {
                me.save_DangKyHocPhan(strId);
            });
        });

        $("#zoneketqua").delegate('.btnHuyDangKy', 'click', function (e) {
            var strId = this.id;
            var strHPId = $(this).attr("name");
            edu.system.confirm("Bạn có chắc chắn không?");
            $("#btnYes").click(function (e) {
                me.delete_HuyDangKy(strId, strHPId);
            });
        });
        $("#onedoor").delegate('.btnQuayLai', 'click', function (e) {
            edu.util.toggle_overide("zone-bus", "zonekehoach");
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DangKyHocPhan: function (strId) {
        var me = this;
        var obj_notify = {};

        var aData = me.dtDangKy.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/FSk0IgkoJC8FIC8mCjgP',
            'func': 'pkg_dangkythi_monthi_thongtin.ThucHienDangKy',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': aData.DANGKY_THI_HP_KEHOACH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLHLTL_NguoiHoc_Id': aData.ID,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đăng ký thành công!");
                    edu.util.toggle_overide("zone-bus", "zonekehoach");
                }
                else {
                    edu.system.alert("Đăng ký thất bại: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ChuaDangKy();
                    me.getList_DaDangKy();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HuyDangKy: function (Ids, strDangKy_Thi_HP_KeHoach_Id) {
        var me = this;
        var aData = me.dtKetQua.find(e => e.ID == Ids);
        //--Edit
        var obj_delete = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/FSk0IgkoJC8JNDgFIC8mCjgP',
            'func': 'pkg_dangkythi_monthi_thongtin.ThucHienHuyDangKy',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': aData.DANGKY_THI_HP_KEHOACH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_Thi_HocPhan_KQ_Id': aData.ID,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                    edu.util.toggle_overide("zone-bus", "zonekehoach");
                }
                else {
                    edu.system.alert("Thực hiện thất bại: " + data.Message);
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
                    me.getList_ChuaDangKy();
                    me.getList_DaDangKy();
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
    
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRIKJAkuICIpFSkkLg8mNC4oCS4i',
            'func': 'pkg_dangkythi_monthi_chung.LayDSKeHoachTheoNguoiHoc',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtKeHoach"] = json;
                    me.genTable_KeHoach(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_KeHoach: function (data) {
        var me = this;
        var row = '';
        data.forEach(aData => {
            row += '<div class="box-shadow m-0 d-flex flex-column exam-reg-item">';
            row += '<div class="p-3 d-flex flex-column align-items-center">';
            row += '<div class=" color-orange text-uppercase fw-bolder">' + edu.util.returnEmpty(aData.TENKEHOACH) + '</div>';
            row += '</div>';
            row += '<div class="line-1 bg-f1"></div>';
            row += '<div class="px-3 py-4 fs-14">';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Thời gian đăng ký:</span>';
            row += '<span class="fw-bold">' + edu.util.returnEmpty(aData.TUNGAY) + ' đến ' + edu.util.returnEmpty(aData.DENNGAY) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Mức phí đăng ký:</span>';
            row += '<span class="fw-bold color-orange">' + edu.util.formatCurrency(aData.MUCPHIDANGKY) + ' đ</span>';
            row += '</div>';
            row += '<div>';
            row += '<span class="fst-italic color-66">Hạn nộp phí:</span>';
            row += '<span class="fw-bold">' + edu.util.returnEmpty(aData.NGAYHANNOPPHI) + '</span>';
            row += '</div>';

            row += '</div>';
            row += '<div class="exam-reg-box-footer">';
            row += '<div class="exrbf-cont justify-content-between">';
            row += '<a href="#" class="btn btn-success px-4 btnDangKy" id="' + aData.ID + '">';
            row += 'Đăng ký';
            row += '</a>';
            row += '<a href="#" class="btn btn-outline-dask-blue px-4 btnKetQua" id="' + aData.ID + '">';
            row += 'Kết quả';
            row += '</a>';


            row += '</div>';
            row += '</div>';
            row += '</div>';
        })
        
        $("#zonekehoach").html(row);

        if ($("#zonekehoach").is(":hidden")) edu.util.toggle_overide("zone-bus", "zonekehoach");
    },
    
    getList_DangKy: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/DSA4BRIJLiIRKSAvBSAvJgo4',
            'func': 'pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data.rsHocPhanDuDK;
                    me["dtDangKy"] = json;
                    me.genTable_DangKy(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DangKy: function (data) {
        var me = this;
        if (data.length == 0) {
            edu.system.alert("Đã đăng ký");
            return;
        }
        edu.util.toggle_overide("zone-bus", "zonedangky"); 
        var aDataKeHoach = me.dtKeHoach.find(e => e.ID == me.strKeHoach_Id);
        var row = '';
        data.forEach(aData => {
            row += '<div class="box-shadow m-0 d-flex flex-column exam-reg-item">';
            row += '<div class="p-3 d-flex flex-column align-items-center">';
            row += '<div class=" text-success text-uppercase fw-bolder">' + edu.util.returnEmpty(aDataKeHoach.TENKEHOACH) + '</div>';
            row += '<div class="fs-14 mt-1">';
            row += '<span class="fst-italic color-66">Thời gian đăng ký:</span>';
            row += '<b>' + edu.util.returnEmpty(aDataKeHoach.TUNGAY) + '  đến ' + edu.util.returnEmpty(aDataKeHoach.DENNGAY) + '</b>';
            row += '</div>';
            row += '</div>';
            row += '<div class="line-1 bg-f1"></div>';
            row += '<div class="px-3 py-4 fs-14">';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Ngôn ngữ thi:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Trình độ:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.TRINHDO) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Ngày thi dự kiến:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.THOIGIANTHIDUKIEN) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Địa điểm thi:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.DIADIEMTHI) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Lệ phí:</span>';
            row += '<span class="fw-500"><span class="color-orange">' + edu.util.returnEmpty(aData.MUCPHIDANGKY) + 'đ </span>/ lần đăng ký</span>';
            row += '</div>';
            row += '<div>';
            row += '<span class="fst-italic color-66">Hạn nộp phí:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.NGAYHANNOPPHI) + '</span>';
            row += '</div>';

            row += '</div>';
            row += '<div class="exam-reg-box-footer">';
            row += '<div class="exrbf-cont justify-content-between">';
            row += '<a href="#" class="btn btn-success px-4 btnDangKyHocPhan" id="' + aData.ID + '">';
            row += 'Đăng ký';
            row += '</a>';
            row += '<a href="#" class="btn btn-outline-secondary px-4 btnQuayLai">';
            row += 'Quay lại';
            row += '</a>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        })

        $("#zonedangky").html(row);
    },
    
    getList_KetQua: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/DSA4BRIJLiIRKSAvBSAvJgo4',
            'func': 'pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data.rsKetQua;
                    me["dtKetQua"] = json;
                    me.genTable_KetQua(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_KetQua: function (data) {
        var me = this;
        if (data.length == 0) {
            edu.system.alert("Bạn chưa đăng ký")
            return;
        }
        edu.util.toggle_overide("zone-bus", "zoneketqua");
        var aDataKeHoach = me.dtKeHoach.find(e => e.ID == me.strKeHoach_Id);
        var row = '';
        data.forEach(aData => {
            row += '<div class="box-shadow m-0 d-flex flex-column exam-reg-item">';
            row += '<div class="p-3 d-flex flex-column align-items-center">';
            row += '<div class=" color-dask-blue text-uppercase fw-bolder">' + edu.util.returnEmpty(aDataKeHoach.TENKEHOACH) + '</div>';
            row += '<div class="fs-14 mt-1">';
            row += '<span class="fst-italic color-66">Thời gian đăng ký:</span>';
            row += '<b>' + edu.util.returnEmpty(aDataKeHoach.TUNGAY) + '  đến ' + edu.util.returnEmpty(aDataKeHoach.DENNGAY) + '</b>';
            row += '</div>';
            row += '</div>';
            row += '<div class="line-1 bg-f1"></div>';
            row += '<div class="px-3 py-4 fs-14">';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Ngôn ngữ thi:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Trình độ:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.TRINHDO) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Ngày thi dự kiến:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.THOIGIANTHIDUKIEN) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Địa điểm thi:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.DIADIEMTHI) + '</span>';
            row += '</div>';
            row += '<div class="mb-2">';
            row += '<span class="fst-italic color-66">Lệ phí:</span>';
            row += '<span class="fw-500"><span class="color-orange"> ' + edu.util.returnEmpty(aData.MUCPHIDANGKY) + 'đ </span>/ lần đăng ký</span>';
            row += '</div>';
            row += '<div>';
            row += '<span class="fst-italic color-66">Hạn nộp phí:</span>';
            row += '<span class="fw-500">' + edu.util.returnEmpty(aData.NGAYHANNOPPHI) + '</span>';
            row += '</div>';

            row += '</div>';
            row += '<div class="exam-reg-box-footer">';
            row += '<div class="exrbf-cont justify-content-between">';
            row += '<a href="#" class="btn btn-outline-dask-blue px-4 btnHuyDangKy"  id="' + aData.ID + '" name="' + aData.DANGKY_THI_HOCPHAN_KEHOACH_ID + '">';
            row += 'Hủy đăng ký';
            row += '</a>';
            row += '<a href="#" class="btn btn-outline-secondary px-4 btnQuayLai">';
            row += 'Quay lại';
            row += '</a>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        })

        $("#zoneketqua").html(row);
    },
    
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinhHoc: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRICKTQuLyYVMygvKQ8mNC4oCS4i',
            'func': 'pkg_dangkythi_monthi_chung.LayDSChuongTrinhNguoiHoc',
            'iM': edu.system.iM,
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