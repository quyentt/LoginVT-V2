/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DuyetChuyenDiem() { };
DuyetChuyenDiem.prototype = {
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.genBoLoc_HeKhoa("_QD");
        me.genBoLoc_HeKhoa("_BD");
        me.getList_KeHoach();
        me.getList_HocPhan();
        me.getList_LoaiCongNhan();
        me.getList_TrangThai();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.CHUNGCHI.PHANLOAI", "dropSearch_LoaiChungChi");

        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.strKeHoachXuLy_Id = $("#dropSearch_KeHoach").val();
            me.getList_HocPhan();
            me.getList_ChungChi();
            me.getList_BangDiem();
        });
        $("#dropSearch_LoaiChungChi").on("select2:select", function () {
            me.getList_ChungChi();
        });
        $("#dropSearch_ChungChi").on("select2:select", function () {
            me.getList_CapDo();
        });
        $("#dropLoaiCongNhan").on("select2:select", function () {
            me.getList_TrangThai();
        });
        $("#btnSearch_BangDiem").click(function () {
            me.getList_BangDiem();
        });
        $("#btnSearch_ChungChi").click(function () {
            me.getList_ChungChi();
        });

        $("#tblBangDiem").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me['strSinhVien_Id'] = strId;
            $("#myModalBangDiem").modal("show");
            me.getList_BangDiem_ChiTiet();
        });

        $("#tblChungChi").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me['strSinhVien_Id'] = strId;
            $("#myModalChungChi").modal("show");
            me.getList_ChungChi_ChiTiet();
        });
        $("#btnXacNhan_BangDiem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanCongNhan_BangDiem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me['arrXacNhan'] = arrChecked_Id;
            me['strLoaiXacNhan'] = "BangDiem";
            $("#modal_XacNhan").modal("show");
            var arrSanPham = [];
            arrChecked_Id.forEach(strSanPham_Id => {
                var aData = me.strLoaiXacNhan == "BangDiem" ? me.dtMCBangDiem.find(e => e.ID == strSanPham_Id) : me.dtMCChungChi.find(e => e.ID == strSanPham_Id);
                arrSanPham.push(aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_CHUONGTRINH_ID + aData.DAOTAO_HOCPHAN_ID + aData.DIEM_KEHOACHCONGNHANDIEM_ID + aData.DIEM_COSODAOTAOCONGNHANDIEM_ID + edu.util.returnEmpty(aData.DIEM_THONGTIN_CC_CAPDO_ID));
            })
            me.strSanPham_Id = arrSanPham.toString();
            me.getList_XacNhan(arrSanPham.toString(), "tblModal_XacNhan");
        });
        $("#btnXacNhan_ChungChi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanCongNhan_ChungChi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me['arrXacNhan'] = arrChecked_Id;
            me['strLoaiXacNhan'] = "ChungChi";
            $("#modal_XacNhan").modal("show");
            var arrSanPham = [];
            arrChecked_Id.forEach(strSanPham_Id => {
                var aData = me.strLoaiXacNhan == "BangDiem" ? me.dtMCBangDiem.find(e => e.ID == strSanPham_Id) : me.dtMCChungChi.find(e => e.ID == strSanPham_Id);
                arrSanPham.push(aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_CHUONGTRINH_ID + aData.DAOTAO_HOCPHAN_ID + aData.DIEM_KEHOACHCONGNHANDIEM_ID + aData.DIEM_COSODAOTAOCONGNHANDIEM_ID + edu.util.returnEmpty(aData.DIEM_THONGTIN_CC_CAPDO_ID));
            })

            me.getList_XacNhan(arrSanPham.toString(), "tblModal_XacNhan");
        });
        $("#btnDongYXacNhan").click(function () {
            var arrChecked_Id = me.arrXacNhan;
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanSanPham(arrChecked_Id[i], strTinhTrang, strMoTa, me.strLoaiXacNhan)
            }
        });
    },

    genBoLoc_HeKhoa: function (strTienTo) {
        var me = this;
        $('#dropSearch_KhoaQuanLy' + strTienTo).on('select2:select', function (e) {
            getList_KhoaDaoTao();
            getList_ChuongTrinhDaoTao();
            getList_LopQuanLy();
            //me.getList_SinhVien();
        });
        $('#dropSearch_HeDaoTao' + strTienTo).on('select2:select', function (e) {

            getList_KhoaDaoTao();
            getList_ChuongTrinhDaoTao();
            getList_LopQuanLy();
            //me.getList_SinhVien();
        });
        $('#dropSearch_KhoaDaoTao' + strTienTo).on('select2:select', function (e) {

            getList_ChuongTrinhDaoTao();
            getList_LopQuanLy();
            //me.getList_SinhVien();
        });
        $('#dropSearch_ChuongTrinh' + strTienTo).on('select2:select', function (e) {

            getList_LopQuanLy();
            //me.getList_SinhVien();
        });
        getList_KhoaQuanLy();
        getList_HeDaoTao();

        function getList_HeDaoTao() {
            if (edu.system["dtHeDaoTao"] && edu.system["dtHeDaoTao"].length > 0) {
                cbGenCombo_HeDaoTao(edu.system["dtHeDaoTao"]);
                return;
            }
            var obj_list = {
                'action': 'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen',
                'type': 'GET',
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy11111' + strTienTo),
                'strDaoTao_HinhThucDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_BacDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        edu.system["dtHeDaoTao"] = json;
                        cbGenCombo_HeDaoTao(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "GET",
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: [
                ]
            }, false, false, false, null);
        }

        function getList_KhoaDaoTao() {
            
            var obj_list = {
                'action': 'KHCT_ThongTin/LayDSKS_DaoTao_KhoaDaoTaoQuyen',
                'type': 'GET',
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy' + strTienTo),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao' + strTienTo),
                'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        cbGenCombo_KhoaDaoTao(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "GET",
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: [
                ]
            }, false, false, false, null);
        }
        function getList_ChuongTrinhDaoTao() {
            
            var obj_list = {
                'action': 'KHCT_Quyen_ThongTin/LayDSKS_DaoTao_ToChucCTQuyen',
                'type': 'GET',
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao' + strTienTo),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao' + strTienTo),
                'strDaoTao_N_CN_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy' + strTienTo),
                'strDaoTao_ToChucCT_Cha_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        cbGenCombo_ChuongTrinhDaoTao(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "GET",
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: [
                ]
            }, false, false, false, null);
        }
        function getList_LopQuanLy() {
            
            var obj_list = {
                'action': 'KHCT_Quyen_ThongTin/LayDSKS_DaoTao_LopQuanLyQuyen',
                'type': 'GET',
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao' + strTienTo),
                'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao' + strTienTo),
                'strDaoTao_Nganh_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_LoaiLop_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_ToChucCT_Id': edu.util.getValById('dropSearch_ChuongTrinh' + strTienTo),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy' + strTienTo),
                'strNhomlop_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        cbGenCombo_LopQuanLy(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "GET",
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: [
                ]
            }, false, false, false, null);
        }
        
        function getList_KhoaQuanLy() {
            if (edu.system["dtKhoaQuanLy"] && edu.system["dtKhoaQuanLy"].length > 0) {
                cbGenCombo_KhoaQuanLy(edu.system["dtKhoaQuanLy"]);
                return;
            }
            var obj_list = {
                'action': 'KHCT_Quyen_ThongTin/LayDSKhoaQuanLyPhanQuyen',
                'type': 'GET',
                'strNguoiThucHien_Id': edu.system.userId,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        edu.system["dtKhoaQuanLy"] = json;
                        cbGenCombo_KhoaQuanLy(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "GET",
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: [
                ]
            }, false, false, false, null);
        }

        function cbGenCombo_HeDaoTao(data) {
            
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TENHEDAOTAO",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropSearch_HeDaoTao" + strTienTo],
                type: "",
                title: "Chọn hệ đào tạo",
            }
            edu.system.loadToCombo_data(obj);
        }
        function cbGenCombo_KhoaDaoTao(data) {
            
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TENKHOA",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropSearch_KhoaDaoTao" + strTienTo],
                type: "",
                title: "Chọn khóa đào tạo",
            }
            edu.system.loadToCombo_data(obj);
        }
        function cbGenCombo_ChuongTrinhDaoTao(data) {
            
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TENCHUONGTRINH",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropSearch_ChuongTrinh" + strTienTo],
                type: "",
                title: "Chọn chương trình đào tạo",
            }
            edu.system.loadToCombo_data(obj);
        }
        function cbGenCombo_LopQuanLy(data) {
            
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropSearch_Lop" + strTienTo],
                type: "",
                title: "Chọn lớp",
            }
            edu.system.loadToCombo_data(obj);
        }
        function cbGenCombo_KhoaQuanLy(data) {
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
                renderPlace: ["dropSearch_KhoaQuanLy" + strTienTo],
                type: "",
                title: "Chọn khoa quản lý",
            }
            edu.system.loadToCombo_data(obj);
            //////$("#dropSearch_KhoaQuanLy_QD").select2();
            ////if (data.length != 1) $("#dropSearch_NguoiThu_QD").val("").trigger("change");
            //var html = "";
            //data.forEach(e => {
            //    html += '<option value="' + e.ID + '" name="undefined"> ' + e.TEN + '</option>'
            //})
            //$("#dropSearch_KhoaQuanLy_QD").html(html);
            //$("#dropSearch_KhoaQuanLy_QD").trigger({ type: 'select2:select' });
            //if (data.length != 1) $("#dropSearch_KhoaQuanLy_QD").val(data[0].ID).trigger("change");
        }
    },


    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSKeHoachTheoNhanSu',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KeHoach(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: "",
                selectOne: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSHocPhanTheoKhoaChuyenmon',
            'type': 'GET',
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    me.cbGenCombo_HocPhan(dtResult, iPager);
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
    cbGenCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ChungChi: function () {
        var me = this;
        var obj_list = {
            'action': 'D_CongNhanDiem/LayDSDiem_ThongTin_ChungChi',
            'type': 'GET',
            'strPhanLoaiCC_Id': edu.util.getValById('dropSearch_LoaiChungChi'),
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
                    me.genCombo_ChungChi(dtResult);
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
    genCombo_ChungChi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUNGCHI",
            },
            renderPlace: ["dropSearch_ChungChi"],
            //selectFirst: true,
            title: "Chọn chứng chỉ"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_CapDo: function () {
        var me = this;
        var obj_list = {
            'action': 'D_CongNhanDiem/LaYDSDiem_TT_CC_CapDo',
            'type': 'GET',
            'strPhanLoaiCC_Id': edu.util.getValById('dropSearch_LoaiChungChi'),
            'strDiem_ThongTin_ChungChi_Id': edu.util.getValById('dropSearch_ChungChi'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
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
                    me.genCombo_CapDo(dtResult);
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
    genCombo_CapDo: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCAPDO",
            },
            renderPlace: ["dropSearch_CapDo"],
            //selectFirst: true,
            title: "Chọn cấp độ"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },

    getList_BangDiem: function () {
        var me = this;
        //--Edit
        //

        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSDiem_NH_CN_So_DiemKhoaCM',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_BangDiem'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_QD'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_Lop_QD'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtBangDiem"] = dtReRult;
                    me.genTable_BangDiem(dtReRult, data.Pager);
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
    genTable_BangDiem: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblBangDiem",

            bPaginate: {
                strFuntionName: "main_doc.DuyetChuyenDe.getList_BangDiem()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MACONGNHAN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "HOCPHANCNTHEODIEMKHOACM"
                },
                {
                    //"mDataProp": "HOSO_DANOP",
                    "mRender": function (nRow, aData) {
                        return aData.DAXACNHAN ? "Đã xác nhận" : "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                //{
                //    //"mDataProp": "HOSO_DANOP",
                //    "mRender": function (nRow, aData) {
                //        return aData.HOSO_DANOP ? "Đã nộp" : "";
                //    }
                //},
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_BangDiem_ChiTiet: function () {
        var me = this;
        var aData = me.dtBangDiem.find(e => e.ID == me.strSinhVien_Id);
        //--Edit

        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSChiTetCNTheoDiemKhoaCM',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_BangDiem_ChiTiet(dtReRult, data.Pager);
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
    genTable_BangDiem_ChiTiet: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        me["dtMCBangDiem"] = data.rs;
        var jsonForm = {
            strTable_Id: "tblHocPhanCongNhan_BangDiem",

            aaData: data.rs,
            colPos: {
                center: [0, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DIEMCONGNHAN"
                },
                {
                    "mDataProp": "DIEM_COSODAOTAO_TEN"
                },
                {
                    "mDataProp": "THONGTINHOCPHAN"
                },
                {
                    "mDataProp": "TINHTRANG_KHOA_XACNHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var jsonForm = {
            strTable_Id: "tblMinhChung_BangDiem",

            aaData: data.rsFiles,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TENCOSODAOTAO"
                },
                {
                    //"mDataProp": "TENHIENTHI",
                    "mRender": function (nRow, aData) {
                        return '<a href="' + edu.system.rootPathUpload + "/" + aData.DUONGDAN + '" target="_blank">' + edu.util.returnEmpty(aData.TENHIENTHI) + '</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_ChungChi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSDiem_NH_CN_So_CCKhoaCM',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSeach_CC'),
            'strLoaiCC_Id': edu.util.getValById('dropSearch_LoaiChungChi'),
            'strTenChungChi_Id': edu.util.getValById('dropSearch_ChungChi'),
            'strCapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_BD'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_BD'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_BD'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_BD'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_Lop_BD'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChungChi"] = dtReRult;
                    me.genTable_ChungChi(dtReRult, data.Pager);
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
    genTable_ChungChi: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChungChi",

            bPaginate: {
                strFuntionName: "main_doc.DuyetChuyenDiem.getList_ChungChi()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MACONGNHAN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "PHANLOAICC_TEN"
                },
                {
                    "mDataProp": "HOCPHANCNTHEODIEMKHOACM"
                }, {
                    //"mDataProp": "HOSO_DANOP",
                    "mRender": function (nRow, aData) {
                        return aData.DAXACNHAN  ? "Đã xác nhận" : "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_ChungChi_ChiTiet: function () {
        var me = this;
        var aData = me.dtChungChi.find(e => e.ID == me.strSinhVien_Id);
        //--Edit
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSChiTetCNTheoCCKhoaCM',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strPhanLoaiCC_Id': aData.PHANLOAICC_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtMCChungChi"] = dtReRult.rs;
                    me.genTable_ChungChi_ChiTiet(dtReRult, data.Pager);
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
    genTable_ChungChi_ChiTiet: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanCongNhan_ChungChi",

            aaData: data.rs,
            colPos: {
                center: [0, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DIEMCONGNHAN"
                },
                {
                    "mDataProp": "DIEM_THONGTIN_CC_CAPDO_TEN"
                },
                {
                    "mDataProp": "DIEM_COSODAOTAO_TEN"
                },
                {
                    "mDataProp": "NGAYCAP"
                },
                {
                    "mDataProp": "TINHTRANG_KHOA_XACNHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        var jsonForm = {
            strTable_Id: "tblMinhChung_ChungChi",

            aaData: data.rsFiles,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "PHANLOAICC_TEN"
                },
                {
                    "mDataProp": "DIEM_THONGTIN_CHUNGCHI_TEN"
                },
                {
                    "mDataProp": "CAPDO_TEN"
                },
                {
                    //"mDataProp": "TENHIENTHI",
                    "mRender": function (nRow, aData) {
                        return '<a href="' + edu.system.rootPathUpload + "/" + aData.DUONGDAN + '" target="_blank">' + edu.util.returnEmpty(aData.TENHIENTHI) + '</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    getList_LoaiCongNhan: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSLoaiCongNhan',
            'type': 'GET',
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
                    me.genCombo_LoaiCongNhan(dtResult);
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
    genCombo_LoaiCongNhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true,
            },
            renderPlace: ["dropLoaiCongNhan"],
            //selectFirst: true,
            title: "Chọn loại công nhận"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },
    getList_TrangThai: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSHanhDongTheoXacNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiXacNhan_Id': edu.util.getValById('dropLoaiCongNhan'),
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
                    me.genCombo_TrangThai(dtResult);
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
    genCombo_TrangThai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropLoaiXacNhan"],
            type: "",
            title: "Chọn xác nhận"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },


    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var aData = me.strLoaiXacNhan == "BangDiem" ? me.dtMCBangDiem.find(e => e.ID == strSanPham_Id) : me.dtMCChungChi.find(e => e.ID == strSanPham_Id);
        strSanPham_Id = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_CHUONGTRINH_ID + aData.DAOTAO_HOCPHAN_ID + aData.DIEM_KEHOACHCONGNHANDIEM_ID + aData.DIEM_COSODAOTAOCONGNHANDIEM_ID + edu.util.returnEmpty(aData.DIEM_THONGTIN_CC_CAPDO_ID);
        var obj_save = {
            'action': 'SV_CND_ThongTin/Them_Diem_DK_CongNhan_XacNhan',
            'type': 'POST',
            'strDuLieuXacNhan': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNoiDung': strNoiDung,
            'strHanhDong_Id': strTinhTrang_Id,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {

                    me.strLoaiXacNhan == "BangDiem" ? me.getList_BangDiem_ChiTiet() : me.getList_ChungChi_ChiTiet();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'SV_CND_ThongTin_MH/DSA4BRIFKCQsHgUKHgIuLyYPKSAvHhkgIg8pIC8P',
            'func': 'pkg_congthongtin_cnd_thongtin.LayDSDiem_DK_CongNhan_XacNhan',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHanhDong_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDuLieuXacNhan': me.strSanPham_Id,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, data.Pager);
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
    genTable_XacNhanSanPham: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblModal_XacNhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DuyetChuyenDiem.getList_XacNhan()",
                iDataRow: iPager,
            },
            aoColumns: [
                {
                    "mDataProp": "HANHDONG_TEN"
                },
                {
                    "mDataProp": "THONGTINXACNHAN"
                },
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

}