/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KeHoach() { };
KeHoach.prototype = {
    strKeHoach_Id: '',
    dtKeHoach: [],
    strDotTuyenDung_Id: '',
    dtDotTuyenDung: [],
    strDeXuat_Id: '',
    strHoiDong_Id: '',
    dtHoiDong: [],
    strTvHoiDong_Id: '',
    dtTvHoiDong: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.getList_KeHoach();
        me.getList_Nam();
        me.getList_MauHoSo();
        me.getList_CanBo();
        me.getList_DonVi();
        //me.getList_ThoiGianDaoTao();

        $("#dropSearch_Nam").on("select2:select", function () {
            me.getList_KeHoach();
        });
        edu.system.loadToCombo_DanhMucDuLieu("NS.TD.PHANLOAI", "dropPhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TD.VAITRO", "dropTVHD_VaiTro");
        $("#dropTVHD_DonVi").on("select2:select", function () {
            me.getList_CanBo();
        });
        $("#tblKeHoach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtKeHoach.find(e => e.ID == strId);
            edu.util.viewValById("txtMaKeHoach", data.MA);
            edu.util.viewValById("txtTenKeHoach", data.TEN);
            edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
            edu.util.viewValById("dropMauHoSo", data.NHANSU_MAUHOSO_ID);
            edu.util.viewValById("dropNam", data.NAM);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewHTMLById("txtMoTa", data.MOTA);
            me.strKeHoach_Id = data.ID;
            $('#themmoikehoach').modal('show');
            
        });
        $("#tblKeHoach").delegate(".btnDotTuyenDung", "click", function () {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            $('#modalDotTuyenDung').modal('show');
            me.getList_DotTuyenDung();
        });
        $("#tblKeHoach").delegate(".btnNhanSu", "click", function () {
            //var strId = this.id;
            //me.strKeHoach_Id = strId;
            //let aData = me.dtKeHoach.find(e => e.ID == strId);
            //$(".lblNhanSu").html("Tổng hợp nhân sự - " + aData.TEN);
            //me.strDotTuyenDung_Id = "";
            //me.strHoiDong_Id = "";
            //$('#modalTVHoiDong').modal('show');
            //me.getList_TVHoiDong();
        });
        $("#tblKeHoach").delegate(".btnDeXuat", "click", function () {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            let aData = me.dtKeHoach.find(e => e.ID == strId);
            $(".lblDeXuat").html("Tổng hợp đề xuất - " + aData.TEN);
            me.strDotTuyenDung_Id = "";
            $('#modalDeXuat').modal('show');
            me.getList_DeXuat();
        });

        $("#tblKeHoach").delegate(".btnKetQua", "click", function () {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            let aData = me.dtKeHoach.find(e => e.ID == strId);
            $(".lblKetQua").html("Tổng hợp kết quả - " + aData.TEN);
            me.strDotTuyenDung_Id = "";
            me.strDeXuat_Id = "";
            me.strHoiDong_Id = "";
            $('#hoidong_ketquadanhgia').modal('show');
            //me.getList_KetQua();
        });
        $("#btnAdd_KeHoach").click(function () {
            var data = {};
            edu.util.viewValById("txtMaKeHoach", data.MA);
            edu.util.viewValById("txtTenKeHoach", data.TEN);
            edu.util.viewValById("dropPhanLoai", data.PHANLOAI_TEN);
            edu.util.viewValById("dropMauHoSo", data.NHANSU_MAUHOSO_TEN);
            edu.util.viewValById("dropNam", $("#dropSearch_Nam").val());
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewHTMLById("txtMoTa", data.MOTA);
            me.strKeHoach_Id = data.ID;
            $('#themmoikehoach').modal('show');
        });
        $("#btnSave_KeHoach").click(function () {
            me.save_KeHoach();
        });
        $("#btnDelete_KeHoach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoach(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_KeHoach();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoach();
            }
        });

        $("#tblDotTuyenDung").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtDotTuyenDung.find(e => e.ID == strId);
            edu.util.viewValById("txtDTD_TuNgay", data.TUNGAY);
            edu.util.viewValById("txtDTD_DenNgay", data.DENNGAY);
            edu.util.viewValById("txtDTD_MoTa", data.MOTA);
            edu.util.viewHTMLById("txtDTD_MoTa", data.MOTA);
            me["strDotTuyenDung_Id"] = data.ID;
            $('#themmoidottuyendung').modal('show');

        });
        $("#tblDotTuyenDung").delegate(".btnDeXuatDonVi", "click", function () {
            var strId = this.id;
            me.strDotTuyenDung_Id = strId;
            let aData = me.dtDotTuyenDung.find(e => e.ID == strId);
            $(".lblDeXuat").html("Đề xuất của các đơn vị theo đợt - " + aData.TUNGAY + " - " + aData.DENNGAY);
            $('#modalDeXuat').modal('show');
            me.getList_DeXuat();

        });
        $("#tblDotTuyenDung").delegate(".btnNhanSu", "click", function () {
            var strId = this.id;
            me.strDotTuyenDung_Id = strId;
            let aData = me.dtDotTuyenDung.find(e => e.ID == strId);
            $(".lblNhanSu").html("Thông tin hội đồng theo đợt - " + aData.TUNGAY + " - " + aData.DENNGAY);
            $('#modalTVHoiDong').modal('show');
            me.getList_TVHoiDong();

        });
        $(".btnAdd_DotTuyenDung").click(function () {
            var strId = this.id;
            var data = {};
            edu.util.viewValById("txtDTD_TuNgay", data.TUNGAY);
            edu.util.viewValById("txtDTD_DenNgay", data.DENNGAY);
            edu.util.viewValById("txtDTD_MoTa", data.MOTA);
            edu.util.viewHTMLById("txtDTD_MoTa", data.MOTA);
            me["strDotTuyenDung_Id"] = data.ID;
            $('#themmoidottuyendung').modal('show');
        });
        $(".btnSave_DotTuyenDung").click(function () {
            me.save_DotTuyenDung();
        });
        $(".btnDelete_DotTuyenDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDotTuyenDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DotTuyenDung(arrChecked_Id[i]);
                }
            });
        });
        
        $("#tblDeXuat").delegate(".btnHoSoUngVien", "click", function () {
            var strId = this.id;
            me.strDeXuat_Id = strId;
            let aData = me.dtDeXuat.find(e => e.ID == strId);
            $(".lblHoSoUngVien").html("Hồ sơ ứng viên theo đề xuất - " + aData.DONVIDEXUAT_TEN);
            $('#modalHoSoUngVien').modal('show');
            me.getList_HoSoUngVien();

        });
        
        $("#tblHoiDong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtHoiDong.find(e => e.ID == strId);
            edu.util.viewValById("txtDTD_TuNgay", data.TUNGAY);
            edu.util.viewValById("txtDTD_DenNgay", data.DENNGAY);
            edu.util.viewValById("txtHD_MoTa", data.MOTA);
            edu.util.viewHTMLById("txtHD_MoTa", data.MOTA);
            me["strHoiDong_Id"] = data.ID;
            $('#themmoiHoiDong').modal('show');

        });
        $(".btnAdd_HoiDong").click(function () {
            var strId = this.id;
            var data = {};
            edu.util.viewValById("txtDTD_TuNgay", data.TUNGAY);
            edu.util.viewValById("txtDTD_DenNgay", data.DENNGAY);
            edu.util.viewValById("txtHD_MoTa", data.MOTA);
            edu.util.viewHTMLById("txtHD_MoTa", data.MOTA);
            me["strHoiDong_Id"] = data.ID;
            $('#themmoiHoiDong').modal('show');
        });
        $(".btnSave_HoiDong").click(function () {
            me.save_HoiDong();
        });
        $(".btnDelete_HoiDong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHoiDong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HoiDong(arrChecked_Id[i]);
                }
            });
        });

        $("#tblTVHoiDong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtTVHoiDong.find(e => e.ID == strId);
            me.genComBo_CanBo(me.dtCanBo);
            //edu.util.viewValById("dropTVHD_DonVi", data.TUNGAY);
            edu.util.viewValById("dropTVHD_ThanhVien", data.THANHVIEN_ID);
            edu.util.viewValById("dropTVHD_VaiTro", data.VAITRO_ID);
            edu.util.viewHTMLById("txtTVHD_MoTa", data.MOTA);
            edu.util.viewValById("txtTVHD_MoTa", data.MOTA);
            me["strTVHoiDong_Id"] = data.ID;
            $('#themmoiTVHoiDong').modal('show');

        });
        $(".btnAdd_TVHoiDong").click(function () {
            var strId = this.id;
            var data = {};
            me.genComBo_CanBo(me.dtCanBo);
            //edu.util.viewValById("dropTVHD_DonVi", data.TUNGAY);
            edu.util.viewValById("dropTVHD_ThanhVien", data.THANHVIEN_ID);
            edu.util.viewValById("dropTVHD_VaiTro", data.VAITRO_ID);
            edu.util.viewHTMLById("txtTVHD_MoTa", data.MOTA);
            edu.util.viewValById("txtTVHD_MoTa", data.MOTA);
            me["strTVHoiDong_Id"] = data.ID;
            $('#themmoiTVHoiDong').modal('show');
        });
        $(".btnSave_TVHoiDong").click(function () {
            me.save_TVHoiDong();
        });
        $(".btnDelete_TVHoiDong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTVHoiDong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_TVHoiDong(arrChecked_Id[i]);
                }
            });
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_Nam: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_TD_Chung_MH/DSA4BRIPICweDxIeFQUP',
            'func': 'pkg_ns_td_chung.LayDSNam_NS_TD',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_Nam(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_Nam: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAM",
            },
            renderPlace: ["dropSearch_Nam", "dropNam"],
            title: "Chọn Năm"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_MauHoSo: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_TD_Chung_MH/DSA4BRIPKSAvEjQeDCA0CS4SLgPP',
            'func': 'pkg_ns_td_chung.LayDSNhanSu_MauHoSo',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_MauHoSo(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_MauHoSo: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropMauHoSo"],
            title: "Chọn mẫu hồ sơ"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KeHoach: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/FSkkLB4PEh4VBR4KJAkuICIp',
            'func': 'pkg_ns_td_thongtin.Them_NS_TD_KeHoach',
            'iM': edu.system.iM,
            'strId': me.strKeHoach_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.system.getValById('txtTenKeHoach'),
            'strMa': edu.system.getValById('txtMaKeHoach'),
            'strNam': edu.system.getValById('dropNam'),
            'strMoTa': edu.system.getValById('txtMoTa'),
            'strPhanLoai_Id': edu.system.getValById('dropPhanLoai'),
            'strNhanSu_MauHoSo_Id': edu.system.getValById('dropMauHoSo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_TD_ThongTin_MH/EjQgHg8SHhUFHgokCS4gIikP';
            obj_save.func = 'pkg_ns_td_thongtin.Sua_NS_TD_KeHoach'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_KeHoach();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIp',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNam': edu.system.getValById('dropSearch_Nam'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoach = dtReRult;
                    me.genTable_KeHoach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_KeHoach: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/GS4gHg8SHhUFHgokCS4gIikP',
            'func': 'pkg_ns_td_thongtin.Xoa_NS_TD_KeHoach',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KeHoach();
                });
            },
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
    genTable_KeHoach: function (data, iPager) {
        $("#lblKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoach",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoach.getList_KeHoach()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "NHANSU_MAUHOSO_TEN"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDotTuyenDung" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnNhanSu" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDeXuat" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DotTuyenDung: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/FSkkLB4PEh4VBR4KJAkuICIpHgUuNQPP',
            'func': 'pkg_ns_td_thongtin.Them_NS_TD_KeHoach_Dot',
            'iM': edu.system.iM,
            'strId': me.strDotTuyenDung_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Id': me.strKeHoach_Id,
            'strTuNgay': edu.system.getValById('txtDTD_TuNgay'),
            'strDenNgay': edu.system.getValById('txtDTD_DenNgay'),
            'strMoTa': edu.system.getValById('txtDTD_MoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_TD_ThongTin_MH/EjQgHg8SHhUFHgokCS4gIikeBS41';
            obj_save.func = 'pkg_ns_td_thongtin.Sua_NS_TD_KeHoach_Dot'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_DotTuyenDung();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DotTuyenDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIpHgUuNQPP',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach_Dot',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDotTuyenDung = dtReRult;
                    me.genTable_DotTuyenDung(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_DotTuyenDung: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/GS4gHg8SHhUFHgokCS4gIikP',
            'func': 'pkg_ns_td_thongtin.Xoa_NS_TD_KeHoach',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DotTuyenDung();
                });
            },
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
    genTable_DotTuyenDung: function (data, iPager) {
        $("#lblDotTuyenDung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDotTuyenDung",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DotTuyenDung.getList_DotTuyenDung()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDeXuatDonVi" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnNhanSu" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mDataProp": "TRANGTHAI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQuaTuyenDung" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    getList_DeXuat: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIpHgUuNQPP',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach_Dot',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDeXuat"] = dtReRult;
                    me.genTable_DeXuat(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DeXuat: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblDeXuat",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DotTuyenDung.getList_DotTuyenDung()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DONVIDEXUAT_TEN"
                },
                {
                    "mDataProp": "NGUOIDEXUAT_TAIKHOAN"
                },
                {
                    "mDataProp": "VITRICONGVIECDEXUAT_TEN"
                },
                {
                    "mDataProp": "SOLUONGDEXUAT"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnHoSoUngVien" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "TRANGTHAI_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    getList_HoSoUngVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIpHgUkGTQgNR4JEgPP',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach_DeXuat_HS',
            'iM': edu.system.iM,
            'strNS_TD_KeHoach_Id': me.strKeHoach_Id,
            'strNS_TD_KeHoach_Dot_Id': me.strDotTuyenDung_Id,
            'strNS_TD_KeHoach_HD_Id': edu.system.getValById('dropAAAA'),
            'strNS_TD_KeHoach_DeXuat_Id': me.strDeXuat_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHoSoUngVien"] = dtReRult;
                    me.genTable_HoSoUngVien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_HoSoUngVien: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblHoSoUngVien",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DotTuyenDung.getList_DotTuyenDung()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MAHOSO"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "VITRICONGVIECDEXUAT_TEN"
                },
                {
                    "mDataProp": "NGAYSINH"
                },
                {
                    "mDataProp": "CCCD"
                },
                {
                    "mDataProp": "GIOITINH_TEN"
                },
                {
                    "mDataProp": "DANTOC_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_HoiDong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/FSkkLB4PEh4VBR4KJAkuICIpHgkF',
            'func': 'pkg_ns_td_thongtin.Them_NS_TD_KeHoach_HD',
            'iM': edu.system.iM,
            'strId': me.strHoiDong_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Id': me.strKeHoach_Id,
            'strNS_TD_KeHoach_Dot_Id': me.strDotTuyenDung_Id,
            'strLoaiHopDong_Id': edu.system.getValById('dropHD_Loai'),
            'strNgayQD': edu.system.getValById('txtAAAA'),
            'strSoQD': edu.system.getValById('txtAAAA'),
            'strTenHoiDong': edu.system.getValById('txtHD_Ten'),
            'strMoTa': edu.system.getValById('txtHD_MoTa'),
            'dThuTu': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_TD_ThongTin_MH/EjQgHg8SHhUFHgokCS4gIikeCQUP';
            obj_save.func = 'pkg_ns_td_thongtin.Sua_NS_TD_KeHoach_HD'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_HoiDong();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HoiDong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIpHgkF',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach_HD',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Dot_Id': me.strDotTuyenDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHoiDong = dtReRult;
                    me.genTable_HoiDong(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_HoiDong: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/GS4gHg8SHhUFHgokCS4gIikeCQUP',
            'func': 'pkg_ns_td_thongtin.Xoa_NS_TD_KeHoach_HD',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HoiDong();
                });
            },
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
    genTable_HoiDong: function (data, iPager) {
        $("#lblHoiDong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHoiDong",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.HoiDong.getList_HoiDong()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIHOIDONG_TEN"
                },
                {
                    "mDataProp": "TENHOIDONG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.SOQD) + " - " + edu.util.returnEmpty(aData.NGAYQD);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnTVHoiDong" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQuaTuyenDung" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TVHoiDong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/FSkkLB4PEh4VBR4KJAkuICIpHgkFHhUX',
            'func': 'pkg_ns_td_thongtin.Them_NS_TD_KeHoach_HD_TV',
            'iM': edu.system.iM,
            'strId': me.strTVHoiDong_Id,
            'strNS_TD_KeHoach_Dot_Id': me.strDotTuyenDung_Id,
            'strThanhVien_Id': edu.system.getValById('dropTVHD_ThanhVien'),
            'strVaiTro_Id': edu.system.getValById('dropTVHD_VaiTro'),
            'strNS_TD_KeHoach_HD_Id': me.strHoiDong_Id,
            'strMoTa': edu.system.getValById('txtTVHD_MoTa'),
            'dThuTu': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_TD_ThongTin_MH/EjQgHg8SHhUFHgokCS4gIikeCQUeFRcP';
            obj_save.func = 'pkg_ns_td_thongtin.Sua_NS_TD_KeHoach_HD_TV'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TVHoiDong();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TVHoiDong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIpHgkFHhUX',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach_HD_TV',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Dot_Id': me.strDotTuyenDung_Id,
            'strNS_TD_KeHoach_HD_Id': me.strHoiDong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTVHoiDong = dtReRult;
                    me.genTable_TVHoiDong(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_TVHoiDong: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/GS4gHg8SHhUFHgokCS4gIikeCQUeFRcP',
            'func': 'pkg_ns_td_thongtin.Xoa_NS_TD_KeHoach_HD_TV',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TVHoiDong();
                });
            },
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
    genTable_TVHoiDong: function (data, iPager) {
        $("#lblTVHoiDong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTVHoiDong",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.TVHoiDong.getList_TVHoiDong()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.THANHVIEN_HODEM) + " " + edu.util.returnEmpty(aData.THANHVIEN_TEN) + " - " + edu.util.returnEmpty(aData.THANHVIEN_MASO);
                    }
                },
                {
                    "mDataProp": "VAITRO_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    getList_DonVi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_CoCauToChuc/LayDanhSach',
            'type': 'GET',
            'strCoCauToChucCha_Id': '',
            'dTrangThai': -1,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genComBo_DonVi(json);
                } else {
                    edu.system.alert(data.Message);
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
    },
    genComBo_DonVi: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropTVHD_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_CanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            'type': 'GET',
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropTVHD_DonVi"),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtCanBo"] = json;
                    me.genComBo_CanBo(json);
                } else {
                    edu.system.alert(data.Message);
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
    },
    genComBo_CanBo: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                },
                default_val: me.strThanhVien_Id
            },
            renderPlace: ["dropTVHD_ThanhVien"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropTVHD_ThanhVien").select2({//Search on modal
            dropdownParent: $('#themmoiTVHoiDong .modal-content')
        });
    },
}