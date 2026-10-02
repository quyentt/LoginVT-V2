/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 06/07/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ThemMoi() { };
ThemMoi.prototype = {
    count_: 0,

    init: function () {
        var me = this;
        var await = await;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local (0-chua nhap, 1- da nhap, -1 toan bo)
        -------------------------------------------*/
        $("#loop").click(function () {
            me.process_main();
        });
        $("#exclude").click(function () {
            setTimeout(me.explode, 2000);
        });
        me.promise_LDSDaDangKy();
    },
    /*------------------------------------------
    --Discription: cau truc ChinhSuaThongTin
    -------------------------------------------*/
    getList_KeHoach: function(){
        // Chuyển sang PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (hàm mới BE mới cấp),
        // chỉ lấy kế hoạch đã phân quyền cho user đăng nhập.
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = edu.util.checkValue(data.Data) ? data.Data : [];
                    var obj = {
                        data: data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENKEHOACH",
                            code: "",
                        },
                        renderPlace: ["dropKeHoach"],
                        type: "",
                        title: "Chọn kế hoạch",
                    }
                    edu.system.loadToCombo_data(obj);
                }
                else {
                    resolve("Loi_ " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    promise_KeHoach: function (strKhoaDaoTao, strMoHinhNhapHoc) {
        return new Promise(function (resolve, reject) {
            //
            var obj_save = {
                'action': 'NH_KeHoachNhapHoc/ThemMoi',
                'versionAPI': 'v1.0',
                //
                "strTenKeHoach":"An isolated area bg",
                "strMoTa":"The place that far from all other side, it is neutral",
                "strNgayBatDau":"10/10/2018",
                "strNgayKetThuc":"03/12/2018",
                "strDAOTAO_KhoaDaoTao_Id" :strKhoaDaoTao,
                "strMoHinhNhapHoc_Id": strMoHinhNhapHoc,
                "strMoHinhApDungPhieuThu_Id":"2",
                "strTAICHINH_HeThongPhieu_Id":"3",
                "strMoHinhApDungPhieuRut_Id":"3",
                "strTAICHINH_HeThongRut_Id":"4",
                "strNguoiThucHien_Id":"fe437ad5f43e452996bc82f0fe2bf252",
                "strId":""
            }

            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        resolve(data.Message);
                    }
                    else {
                        resolve("Loi_ " + data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) { edu.system.endLoading(); },
                type: "POST",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
            //
        });
    },
    promise_TrungTuyen: function (strTen, strSoBaoDanh, strKeHoach) {
        return new Promise(function (resolve, reject) {
            //
            var obj_save = {
                'action': 'NH_NguoiHoc_ThongTinTuyenSinh/ThemMoi',
                'versionAPI': 'v1.0',
                //
                "strTAICHINH_KeHoach_Id": strKeHoach,
                "dPhanTramMienGiam": "10",
                "strHoDem": "Trần Diệu",
                "strTen": strTen,
                "strGioiTinh_Id": "2",
                "strNgaySinh_Nam": "1995",
                "strNgaySinh_Thang": "7",
                "strNgaySinh_Ngay": "10",
                "strHoKhau_TinhThanh_Id": "2",
                "strHoKhau_QuanHuyen_Id": "2",
                "strHoKhau_PhuongXaKhoiXom": "2",
                "strDanToc_Id": "2",
                "strTonGiao_Id": "2",
                "strKhuVuc_Id": "2",
                "strThanhPhanXuatThan_Id": "2",
                "strDoiTuongDuThi_Id": "2",
                "strNganhHoc_Id": "2",
                "strKyHieuTruong": "2sswd2",
                "strSoBaoDanh": strSoBaoDanh,
                "dDiemTS_TongDiem": "24",
                "dDiemTS_Mon1": "6",
                "dDiemTS_Mon2": "9",
                "dDiemTS_Mon3": "8",
                "dDiemTS_DiemThuong": "1",
                "strDiemTS_LyDoNhanDiemThuong": "1",
                "strNamTotNghiep": "2018",
                "strKetQuaCuoiCap_XLHT": "1",
                "strKetQuaCuoiCap_XLHK": "1",
                "strKetQuaCuoiCap_XLTN": "1",
                "strDangDoan_NgayVaoDang": "1",
                "strDangDoan_NgayVaoDoan": "1",
                "strCMTND_So": "1",
                "strCMTND_NoiCap": "1",
                "strCMTND_NgayCap": "1",
                "strSoTheHocSinh": "1",
                "strKhenThuong": "1",
                "strKyLuat": "1",
                "strToHocThi_Id": "1",
                "strNguoiThucHien_Id": "fe437ad5f43e452996bc82f0fe2bf252",
                "strId": ""
            }
            if (edu.util.checkValue(obj_save.strId)) {
                obj_save.action = 'NH_NguoiHoc_ThongTinTuyenSinh/CapNhat';
            }

            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        resolve(data.Message);
                    }
                    else {
                        resolve("Loi_ " + data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) { edu.system.endLoading(); },
                type: "POST",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
            //
        });
    },
    /*------------------------------------------
    --Discription: phuong an 1 --> good, but not better
    -------------------------------------------*/
    promise_LDSDoiTuong: function(){
        return new Promise(function (resolve, reject) {
            //
            var obj_save = {
                'action': 'SMS_DoiTuong/LayDanhSach',
                'versionAPI': 'v1.0',
                //
                "strTinhTrang_Id": "0",
                "strNguoiThucHien_Id": "",
                "strTuKhoa": "",
                "pageIndex": "1",
                "pageSize": "10"
            }

            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        resolve(data);
                    }
                    else {
                        resolve("Loi_ " + data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) { edu.system.endLoading(); },
                type: "GET",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
            //
        });
    },
    promise_LDSDaDangKy: function () {
        return new Promise(function (resolve, reject) {
            //
            var obj_save = {
                'action': 'SMS_DangKyDichVu/LayDanhSach',
                'versionAPI': 'v1.0',
                //
                "strTinhTrang_Id": "1",
                "strSMS_DoiTuong_Id": "",
                "strNguoiThucHien_Id":"",
                "strTuKhoa": "",
                "pageIndex": "1",
                "pageSize": "10000"
            }

            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        resolve(data.Pager);
                        $("#soluong_dangky").html("");
                        $("#soluong_dangky").html(data.Pager);
                    }
                    else {
                        resolve("Loi_ " + data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) { edu.system.endLoading(); },
                type: "GET",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
            //
        });
    },
    promise_DangKy: function (strDoiTuong_Id) {
        console.log("ngon");
        return new Promise(function (resolve, reject) {
            //
            var obj_save = {
                'action': 'SMS_DangKyDichVu/ThemMoi',
                'versionAPI': 'v1.0',
                //
                "strTinhTrang_Id": "1",
                "strSMS_DoiTuong_Id": strDoiTuong_Id,
                "strNguoiThucHien_Id": "fe437ad5f43e452996bc82f0fe2bf252",
                "strId": ""
            }

            //default
            edu.system.beginLoading();
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        resolve({ "strDoiTuong_Id": strDoiTuong_Id, "id": data.Message, "Success": data.Success });
                    }
                    else {
                        resolve("Loi_ " + data.Message);
                    }
                    edu.system.endLoading();
                },
                error: function (er) { edu.system.endLoading(); },
                type: "POST",
                action: obj_save.action,
                versionAPI: obj_save.versionAPI,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
            //
        });
    },
    promise_Control: function (data) {
        var me = this;
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < data.length; i++) {
                var strDoiTuong_Id = data[i].ID;
                resolve({ "data": data, "id": strDoiTuong_Id });
            }
            
        });
        
        
    },
    promise_cutArr: function (data_root, strDoiTuong_Id) {
        var me = this;
        console.log("data_root: " + data_root);
        return new Promise(function (resolve, reject) {
            var arr = edu.util.objExcludeVal(data_root, "ID", strDoiTuong_Id);
            resolve(arr);
            
        });
    },
    process_TrungTuyen: function () {
        var me = this;
        me.count--;
        //
        var html = "";
        var strDoiTuong_Id = "";
        var strDoiTuongDaDangKy_Id = "";
        $("#zone_show").html('');
        var data_root = [];
        //
        me.promise_LDSDoiTuong().
            then(function (data) {
                $("#soluong_doituong").html(data.Pager);
                //1. html
                for (var i = 0; i < data.Data.length; i++) {
                    html = "";
                    html += "<li>" + data.Data[i].HODEM + " " + data.Data[i].TEN + " <a>" + data.Data[i].ID + "</a>" + "</li>";
                    html += "<span> -->" + data.Data[i].DADANGKY + "</span>";
                    $("#zone_show").append(html);
                }
                data_root = [];
                //2. dangky console.log(data.Data[i].ID);
                data_root = data.Data;
                for (let j = 0, p = Promise.resolve() ; j < data.Data.length; j++) {
                    p = p.then(new Promise(function (resolve) {
                        setTimeout(function () {
                            console.log("data.Data: " + JSON.stringify(data.Data[j].ID));
                            strDoiTuong_Id = data.Data[j].ID;
                            me.promise_DangKy(strDoiTuong_Id).then(function (obj) {
                                var Success = obj.Success;
                                var strDoiTuong_Id = "";
                                var id = "";
                                if (Success == true) {
                                    strDoiTuong_Id = obj.strDoiTuong_Id;
                                    id = obj.id;
                                    me.promise_cutArr(data_root, strDoiTuong_Id).then(function (arr) {
                                        if (arr.length == 0) {
                                            if (me.count > 0) {
                                                me.process_TrungTuyen();
                                            }
                                        }
                                        return me.promise_LDSDaDangKy();
                                    }).then(function (pager) {
                                        console.log("pager: " + pager);

                                    })
                                }
                                else {
                                    strDoiTuong_Id = obj.strDoiTuong_Id;
                                    id = obj.id;
                                    console.log("LOI_____________: " + id);
                                }
                            });
                            resolve();
                        }, 100);
                    }));
                }
                
            });
        
    },
    /*------------------------------------------
    --Discription: phuong an 2 --> better than others
    -------------------------------------------*/
    processArray: function (obj, fn) {
        var index = 0;
        return new Promise(function (resolve, reject) {
            function next() {
                if (index < obj.length) {
                    fn(obj[index++].ID).then(next, reject);
                } else {
                    resolve();
                }
                console.log("[ index ----------------------> " + index + " ]");
            }
            next();
        })
    },
    processItem: function (strDoiTuong_Id) {
        //khai bao toan cuc
        var me = main_doc.ThemMoi;
        //process
        //dk-1
        return new Promise(function (resolve, reject) {
            me.save_dangky(strDoiTuong_Id, resolve, reject);
        }).then(function (data) {
            me.count_++;
            console.log("id_new: " + data.id);
            //dk-2
            return new Promise(function (resolve, reject) {
                me.getList_dangky(resolve, reject);
            }).then(function (data) {
                console.log("pager: " + data);
                if (me.count_ == 10) {
                    me.count_ = 0;
                    me.process_main();
                }
            });
            //end--> dk-2
        });
        //end --> dk1
    },
    process_main: function () {
        var me = this;
        return new Promise(function (resolve, reject) {
            me.getList_khoitao(resolve, reject);
        }).then(function (data) {
            var data_ = data.Data;
            if (data_.length > 0) {
                me.processArray(data_, me.processItem).then(function () {
                    // all done here
                }, function (reason) {
                    // rejection happened
                });
            }
            else {
                return false;
            }
        });
    },

    save_dangky: function (strDoiTuong_Id, resolve, reject) {
        //
        var obj_save = {
            'action': 'SMS_DangKyDichVu/ThemMoi',
            'versionAPI': 'v1.0',
            //
            "strTinhTrang_Id": "1",
            "strSMS_DoiTuong_Id": strDoiTuong_Id,
            "strNguoiThucHien_Id": "fe437ad5f43e452996bc82f0fe2bf252",
            "strId": ""
        }

        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    resolve({ "strDoiTuong_Id": strDoiTuong_Id, "id": data.Message, "Success": data.Success });
                }
                else {
                    resolve("Loi_ " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
        //
    },
    getList_dangky: function (resolve, reject) {
        //
        var obj_save = {
            'action': 'SMS_DangKyDichVu/LayDanhSach',
            'versionAPI': 'v1.0',
            //
            "strTinhTrang_Id": "1",
            "strSMS_DoiTuong_Id": "",
            "strNguoiThucHien_Id": "",
            "strTuKhoa": "",
            "pageIndex": "1",
            "pageSize": "10000"
        }

        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    resolve(data.Pager);
                    $("#soluong_dangky").html("");
                    $("#soluong_dangky").html(data.Pager);
                }
                else {
                    resolve("Loi_ " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
        //
    },
    getList_khoitao: function (resolve, reject) {
        //
        var obj_save = {
            'action': 'SMS_DoiTuong/LayDanhSach',
            'versionAPI': 'v1.0',
            //
            "strTinhTrang_Id": "0",
            "strNguoiThucHien_Id": "",
            "strTuKhoa": "",
            "pageIndex": "1",
            "pageSize": "10"
        }

        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    resolve(data);
                    $("#soluong_doituong").html(data.Pager);
                }
                else {
                    resolve("Loi_ " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
        //
    },

}