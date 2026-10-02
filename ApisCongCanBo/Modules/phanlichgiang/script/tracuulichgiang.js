/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function TraCuuLichGiang() { };
TraCuuLichGiang.prototype = {
    strLichHoc_Id: '',
    dtLichHoc: [],
    strPhanGiang_Id: '',
    dtPhanGiang: [],
    dtGiangVienNgoaiTruong: [],
    dtHoatDong: [],
    dtGiangVienTrongTruong: [],
    dtPhanGiang_LichHoc: [],
    dtKhuVuc: [],
    dtToaNha: [],
    dtPhongHoc: [],
    dtHocPhan: [],
    dtHocPhanCombo: [],
    dtHocKyCombo: [],
    dtNgayBatDau: [],
    dtNgayKetThuc: [],
    dtHocPhan_ChuongTrinh: [],
    dtBaiHoc: [],
    strBaiHoc_HocPhan_Id: '',
    strHocPhan_Id: '',
    strLopHocPhan_Id: '',
    dtLichGiang: [],
    dtDiaDiem: [],
    dtLopHocPhan: [],
    strHienThi: '',
    bcheckLoaiLichGiang: false, //dùng khi chọn nhiều lịch giảng
    strLichHoc_Temp: '',

    init: function () {
        var me = this;
        me.page_load();
        var ilength = window.innerHeight - $("#tblLopHocPhan").offset().top;
        $("#tblLopHocPhan").parent().attr("style", "height: " + ilength + "px; overflow-y: scroll;");
        me.getList_LichHoc();
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "", "", me.loadToCombo_DiaDiem);
        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
            me.getList_HocPhan();
            $("#tblLopHocPhan tbody").html("");
            $("#tblLichHoc tbody").html("");
            $(".lblLichHoc_HP").html("");
        });
        $("#dropSearch_CoCauToChuc").on("select2:select", function () {
            me.getList_HocPhan();
            $("#tblLopHocPhan tbody").html("");
            $("#tblLichHoc tbody").html("");
            $(".lblLichHoc_HP").html("");
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_HocPhan();
            $("#tblLopHocPhan tbody").html("");
            $("#tblLichHoc tbody").html("");
            $(".lblLichHoc_HP").html("");
        });
        $("#dropSearch_HocPhan").on("select2:select", function () {
            me.getList_LopHocPhan();
            me.getList_BaiHoc();
            me.getList_LichHoc();
            $(".lblLichHoc_HP").html("");
        });
        $(".btnExtend_Search").click(function () {
            me.getList_LopHocPhan();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_LopHocPhan();
            }
        });
        $("#tblLopHocPhan").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strLopHocPhan_Id = strId;
                edu.util.setOne_BgRow(strId, "tblLopHocPhan");
                me.getList_LichHoc();
                var dataTemp = edu.util.objGetOneDataInData(strId, me.dtLopHocPhan, "ID");
                var strHienThi = dataTemp.TENLOPHOCPHAN;
                me.getList_BaiHoc(dataTemp.IDHOCPHAN);
                me.strHienThi = strHienThi;
                $(".lblLichHoc_HP").html(strHienThi);
                $("#zoneLichGiangChiTiet").show();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
            $(window).scrollTop(10); me.toggle_BatDau();
        });
        $("#btnAdd_BaiHoc").click(function () {
            if (edu.util.checkValue(edu.util.getValById("dropSearch_HocPhan"))) {
                me.toggle_Add_BaiHoc();
                me.getList_BaiHoc();
            } else {
                edu.system.alert("Bạn phải chọn học phần")
            }
        });
        $(".btnAddnew_BaiHoc").click(function () {
            me.toggle_New_BaiHoc();

        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnClose_BaiHoc").click(function () {
            me.toggle_LichHoc();
        });
        $(".btnClose_Input_BaiHoc").click(function () {
            me.toggle_List_BaiHoc();
            $("#zone_input_BaiHoc").slideUp();
        });
        $(".btnClose_PhanGiang").click(function () {
            me.toggle_LichGiang();
            $("#lblChiTietHocPhan").html(me.strHienThi);
        });
        $("#btnSave").click(function () {
            me.save_BaiHoc();
        });
        $(".btnReWrite").click(function () {
            me.save_BaiHoc();
            me.rewrite();
        });
        $("#btnSearch_DSLichGiang").click(function () {
            me.strLichHoc_Id = "";
            me.toggle_Edit()
            me.getList_PhanGiang_LichHoc_all();
        });
        $("#btnAdd_LichPhanGiang").click(function () {
            me.add_PhanGiang_LichHoc();
        });
        $("#tblLichHoc").delegate('.btnPhanLichGiang', 'click', function (e) {
            var strId = this.id;
            me.toggle_Edit()
            me.strLichHoc_Id = strId;
            edu.util.setOne_BgRow(strId, "tblLichHoc");
            var data = edu.util.objGetDataInData(strId, me.dtLichHoc, "ID");
            me.getList_PhanGiang_LichHoc(strId);
        });
        $("[id$=chkSelectAll_Lich]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLichHoc" });
        });
        $("#tblLichHoc").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblLichHoc", regexp: /checkX/g, });
        });
        $("#btnPhanGiangLich").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLichHoc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.bcheckLoaiLichGiang = true;
            me.strLichHoc_Id = arrChecked_Id.toString();
            me.toggle_Edit();
            me.getList_PhanGiang_LichHoc(
                arrChecked_Id.slice(0, 120).toString(),
                arrChecked_Id.slice(121, 240).toString(),
                arrChecked_Id.slice(241, 360).toString(),
                arrChecked_Id.slice(361, 480).toString(),
                arrChecked_Id.slice(481, 600).toString()
            );
        });
        $("[id$=chkSelectAll_BaiHoc]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblBaiHoc" });
        });
        $("#tblBaiHoc").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblLichHoc", regexp: /checkX/g, });
        });
        $("#tblBaiHoc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strBaiHoc_HocPhan_Id = strId;
            me.toggle_editBaiHoc();
            me.getDetail_BaiHoc_HocPhan(strId);
            return false;
        });
        $("#btnXoaBaiHoc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaiHoc", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn bài học cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa bài học không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_BaiHoc(arrChecked_Id.toString());
                }
            });
            setTimeout(function () {
                me.getList_BaiHoc();
            }, 1000);
        });
        $("#tblLichPhanGiang").delegate(".deletePhanGiang_LichHoc", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_PhanGiang_LichHoc(strId);
            });
        });
        $("#btnSave_LichPhanGiang").click(function () {
            $("#tblLichPhanGiang tbody tr").each(function () {
                var strPhanGiang_LichHoc_Id = this.id.replace(/rm_row/g, '');
                me.save_PhanGiang_LichHoc(strPhanGiang_LichHoc_Id);
            });
            setTimeout(function () {
                if (me.strLichHoc_Id == "") me.getList_PhanGiang_LichHoc_all();
                else me.getList_PhanGiang_LichHoc();//
            }, 500);
        });
        /*------------------------------------------
        --Discription:
        -------------------------------------------*/
        $("[id$=chkSelectAll_KeThua]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKeThuaLopHocPhan" });
        });
        $(".btnClose_KeThua").click(function () {
            me.toggle_BatDau();
        });
        $("#btnKeThua").click(function () {
            me.toggle_KeThua();
        });
        $("#btnSaveKeThua").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeThuaLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn kế thừa không");
            $("#btnYes").click(function (e) {
                me.save_KeThua(arrChecked_Id.toString());
            });
        });
        /*------------------------------------------
        --Discription:
        -------------------------------------------*/
        $("#btnNhanSuNgoaiTruong").click(function () {
            edu.extend.genModal_NhanSu_NgoaiTruong();
            edu.extend.getList_NhanSu_NgoaiTruong("SEARCH");
        });
        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_PLG", function (addKeyValue) {
            addKeyValue("strHeDaoTao_Id", edu.util.getValById("dropSearch_HeDaoTao"));
            addKeyValue("strHocPhan_Id", edu.util.getValById("dropSearch_HocPhan"));
            addKeyValue("strLopHocPhan_Id", main_doc.TraCuuLichGiang.strLopHocPhan_Id);
            addKeyValue("strThoiGianDaoTao_Id", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
            addKeyValue("strChucNang_Id", edu.system.strChucNang_Id);
            addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
            addKeyValue("strDonVi_Id", edu.util.getValById("dropSearch_DonViThanhVien"));
            addKeyValue("strCanBo_Id", edu.system.userId);
            addKeyValue("strDenNgay", edu.util.getValById("txtSearch_DenNgay"));
            addKeyValue("strTuNgay", edu.util.getValById("txtSearch_TuNgay"));
        });
        /*------------------------------------------
        --Discription:
        -------------------------------------------*/
        $("#btnXacNhan_PG").click(function () {
            $("#modal_XacNhan").modal("show");
            me.getList_XacNhanSanPham(me.strLopHocPhan_Id, "tblModal_XacNhan");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            me.save_XacNhanSanPham(me.strLopHocPhan_Id, strTinhTrang, strMoTa);
        });
        /*------------------------------------------
        --Discription:
        -------------------------------------------*/
        $(document).delegate('.btnXemTrungLich', 'click', function () {
            var strHocPhan_Id = this.id;
            me.getList_PhanGiang_LichHoc_XemLoi(strHocPhan_Id);
            $("#myModalAlert").modal("hide");
        });

        $("#dropSearch_DonViThanhVien").on("select2:select", function () {
            me.getList_HS();
        });

    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu("TKB_PHANGIANG.XNKK", "", "", me.loadBtnXacNhan, "Tất cả tình trạng xác nhận", "HESO1");
        me.getList_CoCauToChuc();
        me.getList_HS();
        me.getList_CCTC();
    },
    toggle_BatDau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneLichGiangChiTiet");
    },
    toggle_KeThua: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneKeThua");
        me.getList_LopHocPhan_KeThua();
    },
    toggle_notify: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_TimKiem");
    },
    toggle_LichHoc: function () {
        var me = this;
        edu.util.toggle_overide("zonecontent", "zone_TimKiem");
    },
    toggle_List_BaiHoc: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_BaiHoc");
    },
    toggle_Add_BaiHoc: function () {
        var me = this;
        edu.util.toggle_overide("zonecontent", "zone_BaiHoc");
    },
    toggle_New_BaiHoc: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_BaiHoc");
    },

    toggle_Edit: function () {
        var me = this;
        edu.util.toggle_overide("zonecontent", "zoneEdit");
        var ilength = window.innerHeight - 162;
        $("#tblLichPhanGiang").parent().attr("style", "height: " + ilength + "px; overflow-y: scroll;");
    },

    toggle_editBaiHoc: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_BaiHoc");
    },
    toggle_LichGiang: function () {
        var me = this;
        edu.util.toggle_overide("zonecontent", "zone_TimKiem");
        me.getList_LichHoc();
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_LichGiang/LayDSThoiGian',
            contentType: true,
            data: {
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.TraCuuLichGiang;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
            title: "Chọn thời gian đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            $("#dropSearch_ThoiGianDaoTao").val(data[0].ID).trigger("change").trigger({ type: 'select2:select' });
        }
    },
    getList_HocPhan: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HocPhan(dtResult);
                }
                else {
                    edu.system.alert("KHCT_LichGiang/LayDSHocPhan: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_LichGiang/LayDSHocPhan (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_LichGiang/LayDSHocPhan',
            contentType: true,
            data: {
                'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_CoCauToChuc'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
                'dToanBo': 0,
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var me = this;
        me.dtHocPhanCombo = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (row, aData) {
                    return aData.MA + " - " + aData.TEN;
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_LopHocPhan_KeThua: function () {
        var me = main_doc.TraCuuLichGiang;
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDSLopHocPhanCanKeThua',
            'strIdLopHocPhanGoc': me.strLopHocPhan_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_LopHocPhan_KeThua(data.Data);
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
    getList_LopHocPhan: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtLopHocPhan = dtResult;
                    me.genTable_LopHocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert("KHCT_LichGiang/LayDSLopHocPhan: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_LichGiang/LayDSLopHocPhan (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_LichGiang/LayDSLopHocPhan',
            contentType: true,
            data: {
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strDaoTao_HocPhan_Id': edu.util.getValById("dropSearch_HocPhan"),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_LopHocPhan: function (data, iPager) {
        $("#lblLopHocPhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            aaData: data,
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + 'Tên lớp: ' + edu.util.returnEmpty(aData.TENLOPHOCPHAN) + "</span><br />";
                        html += '<span>' + 'Mã học phần: ' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + "</span><br />";
                        html += '<span>' + 'Học phần: ' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + "</span><br />";
                        html += '<span>' + 'Tín chỉ: ' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_SOTC) + "</span><br />";
                        html += '<span>' + 'Số sinh viên: ' + edu.util.returnEmpty(aData.SOSINHVIEN) + "</span><br />";
                        if (aData.KETQUAXACNHAN_TEN != null && aData.KETQUAXACNHAN_TEN != "") {
                            html += '<span class="pull-right lbTinhTrang" style="color: green">';
                            html += aData.KETQUAXACNHAN_TEN;
                            html += '</span>';
                        }
                        if (aData.DACHINHSUA == '1') {
                            html += '<span class="pull-right lbTinhTrang" style="color: orange">';
                            html += "Đã sửa";
                            html += '</span>';
                        }
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genTable_LopHocPhan_KeThua: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblKeThuaLopHocPhan",
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOPHOCPHAN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTC"//
                },
                {
                    "mDataProp": "SOSINHVIEN"//
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    getList_LichHoc: function () {
        var me = main_doc.TraCuuLichGiang;
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDSLich',

            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropSearch_HocPhan"),
            'strIdLopHocPhan': me.strLopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.dtLichHoc = data.Data;
                    me.genTable_LichHoc(data.Data, data.Pager);
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
    genTable_LichHoc: function (data, iPager) {
        var me = this;
        if (iPager == null) iPager = data.length;
        var strTableId = "tblLichHoc";
        $("#lblHP_LichHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: strTableId,
            aaData: data,
            colPos: {
                center: [0, 1, 2, 4, 3, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "NGAYHOC"
                },
                {
                    "mDataProp": "THUHOC"//
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.PHANGIANG == "DAPHANGIANG")
                            return '<span><a class="btn btn-default btnPhanLichGiang" id="' + aData.ID + '"><i class="color-active"></i>Đã phân giảng</a> </span>';
                        return '<span><a class="btn btn-primary btnPhanLichGiang" id="' + aData.ID + '"><i class="color-active"></i>Phân giảng</a> </span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.actionRowSpan(strTableId, [1, 2])
    },
    save_PhanGiang_LichHoc: function (strId, strTKB_LichGiang_HocPhan_Id) {
        var me = this;
        var strIdHinhThucHoc = edu.util.getValById('dropPhanGiang_HinhThucHoc' + strId);
        var dSiSo = edu.util.getValById('txtPhanGiang_SiSo' + strId);
        var dSoTiet = edu.util.getValById('txtPhanGiang_SoTiet' + strId);
        var dTietBatDau = edu.util.getValById('txtPhanGiang_TietBatDau' + strId);
        var dTietKeThuc = edu.util.getValById('txtPhanGiang_TietKetThuc' + strId);
        var strDaoTao_BaiHoc_Id = edu.util.getValById('dropPhanGiang_BaiHoc' + strId);
        var strNhanSu_HoSoCanBo_TrongTruong_Id = edu.util.getValById('dropPhanGiang_GiangVien_TrongTruong' + strId);
        var strNhanSu_HoSoCanBo_MoiGiang_Id = edu.util.getValById('dropPhanGiang_GiangVien_MoiGiang' + strId);
        var strTKB_KhuVuc_Id = "";//edu.util.getValById('dropDiaDiem_KhuVuc' + strId);
        var strTKB_PhanLoaiDiaDiem_Id = edu.util.getValById('dropDiaDiem' + strId);
        var strTKB_ToaNha_Id = "";//edu.util.getValById('dropDiaDiem_ToaNha' + strId);
        var strTKB_PhongHoc_Id = "";//edu.util.getValById('dropDiaDiem_GiangDuong' + strId);
        var strMoTa = edu.util.getValById('txtPhanGiang_GhiChu' + strId);
        var json = edu.util.objGetDataInData(strId, me.dtLichGiang, "ID");
        if (json.length > 0) {
            strTKB_LichGiang_HocPhan_Id = json[0].TKB_LICHGIANG_HOCPHAN_ID;
        }
        else {
            console.log(strId);
            console.log(json);
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        var strNhanSu_HoSoCanBo_Id = "";
        if (edu.util.checkValue(strNhanSu_HoSoCanBo_TrongTruong_Id)) {
            strNhanSu_HoSoCanBo_Id = strNhanSu_HoSoCanBo_TrongTruong_Id;
        }
        else {
            strNhanSu_HoSoCanBo_Id = strNhanSu_HoSoCanBo_MoiGiang_Id;
        }
        if (strId.length == 30) strId = "";
        var obj_notify;
        var obj_save = {
            'action': 'KHCT_LichGiang/ThemMoi',

            'strId': strId,
            'strIdHinhThucHoc': strIdHinhThucHoc,
            'dSiSo': dSiSo,
            'dSoTiet': dSoTiet,
            'dTietBatDau': dTietBatDau,
            'dTietKeThuc': dTietKeThuc,
            'strDaoTao_BaiHoc_Id': strDaoTao_BaiHoc_Id,
            'strNhanSu_HoSoCanBo_Id': strNhanSu_HoSoCanBo_Id,
            'strTKB_PhanLoaiDiaDiem_Id': strTKB_PhanLoaiDiaDiem_Id,
            'strTKB_KhuVuc_Id': strTKB_KhuVuc_Id,
            'strTKB_ToaNha_Id': strTKB_ToaNha_Id,
            'strTKB_PhongHoc_Id': strTKB_PhongHoc_Id,
            'strMoTa': strMoTa,
            'strTKB_LichGiang_HocPhan_Id': strTKB_LichGiang_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'KHCT_LichGiang/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        edu.system.alert("Thêm mới thành công")
                    } else {
                        edu.system.alert("Cập nhật thành công")
                    }
                }
                else {
                    if (data.Data != null && data.Data != "") {
                        edu.system.alert("<a id='" + data.Data + "' class='btnXemTrungLich poiter' style='text-decoration: underline;'>" + data.Message + "</a>");
                    }
                    else {
                        edu.system.alert(data.Message)
                    }
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    add_PhanGiang_LichHoc: function () {
        var me = this;
        var obj_notify;
        var strTKB_LichGiang_HocPhan_Id = me.strLichHoc_Id;
        if (me.strLichHoc_Id.length !== 32) {
            strTKB_LichGiang_HocPhan_Id = me.strLichHoc_Temp;
        }
        var obj_save = {
            'action': 'KHCT_LichGiang/ThemMoi',

            'strId': '',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strTKB_LichGiang_HocPhan_Id': strTKB_LichGiang_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_PhanGiang_LichHoc();
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message)
                }
            },
            error: function (er) {
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhanGiang_LichHoc_all: function (strTKB_LichGiang_HocPhan_Id) {
        var me = main_doc.TraCuuLichGiang;
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDanhSach',

            'strIdLopHocPhan': me.strLopHocPhan_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropSearch_HocPhan"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLichGiang = data.Data.rs;
                    me.dtHoatDong = data.Data.rsHoatDong;
                    me.dtGiangVienTrongTruong = data.Data.rsGiangVienTrongTruong;
                    me.dtGiangVienNgoaiTruong = data.Data.rsGiangVienNgoaiTruong;
                    me.dtKhuVuc = data.Data.rsKhuVuc;
                    me.dtToaNha = data.Data.rsToaNha;
                    me.dtPhongHoc = data.Data.rsPhongHoc;
                    me.genHTML_PhanGiang_LichHoc(data.Data.rs);
                    if (data.Data.rs.length > 0) me.strLichHoc_Temp = data.Data.rs[data.Data.rs.length - 1].TKB_LICHGIANG_HOCPHAN_ID;
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
    getList_PhanGiang_LichHoc: function (strId, strId2, strId3, strId4, strId5) {
        var me = main_doc.TraCuuLichGiang;
        if (strId == undefined) strId = me.strLichHoc_Id;
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDSLichPhanGiangChiTietId',

            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strTKB_LichGiang_HocPhan_Id': strId,
            'strTKB_LichGiang_HocPhan_Id2': strId2,
            'strTKB_LichGiang_HocPhan_Id3': strId3,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTKB_LichGiang_HocPhan_Id4': strId4,
            'strTKB_LichGiang_HocPhan_Id5': strId5,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtGiangVienNgoaiTruong = data.Data.rsGiangVienNgoaiTruong;
                    me.dtHoatDong = data.Data.rsHoatDong;
                    me.dtGiangVienTrongTruong = data.Data.rsGiangVienTrongTruong;
                    me.dtKhuVuc = data.Data.rsKhuVuc;
                    me.dtToaNha = data.Data.rsToaNha;
                    me.dtPhongHoc = data.Data.rsPhongHoc;
                    me.dtLichGiang = data.Data.rs;
                    me.genHTML_PhanGiang_LichHoc(data.Data.rs);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhanGiang_LichHoc_XemLoi: function (strId) {
        var me = main_doc.TraCuuLichGiang;
        var obj_list = {
            'action': 'KHCT_LichGiang/LayTTLichPhanGiang_BaiHoc',
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strId': strId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtLichGiang = data.Data.rs;
                    me.dtHoatDong = data.Data.rsHoatDong;
                    me.dtGiangVienTrongTruong = data.Data.rsGiangVienTrongTruong;
                    me.dtGiangVienNgoaiTruong = data.Data.rsGiangVienNgoaiTruong;
                    me.dtKhuVuc = data.Data.rsKhuVuc;
                    me.dtToaNha = data.Data.rsToaNha;
                    me.dtPhongHoc = data.Data.rsPhongHoc;
                    me.genHTML_PhanGiang_LichHoc(data.Data.rs);
                    if (data.Data.rs.length > 0 && edu.util.checkValue(data.Data.rs[0].TENLOPHOCPHAN)) {
                        $("#lblChiTietHocPhan").html(data.Data.rs[0].TENLOPHOCPHAN);
                        me.strLichHoc_Temp = data.Data.rs[data.Data.rs.length - 1].TKB_LICHGIANG_HOCPHAN_ID;
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
    delete_PhanGiang_LichHoc: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'KHCT_LichGiang/Xoa',

            'strId': strId,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_PhanGiang_LichHoc();
                }
                else {
                    edu.system.alert(obj_delete.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.endLoading(obj_delete.action + " (er): " + er);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genHTML_PhanGiang_LichHoc: function (data) {
        var me = main_doc.TraCuuLichGiang;
        $("#tblLichPhanGiang tbody").html("");
        $("#zoneSoTietLichGiang").remove();
        for (var i = 0; i < me.dtHoatDong.length; i++) {
            me.dtHoatDong[i]["SOLUONG"] = 0;
        }
        for (var i = 0; i < data.length; i++) {
            var strPhanGiang_LichHoc_Id = data[i].ID;
            var strStyle = "";
            if (edu.util.checkValue(data[i].NHANSU_HOSOCANBO_ID)) {
                strStyle = 'style="background-color: pink"';
            }
            var row = '';
            row += '<tr id="' + strPhanGiang_LichHoc_Id + '" ' + strStyle + '>';
            row += '<td style="text-align: center"><label id="txtStt' + strPhanGiang_LichHoc_Id + '">' + (i + 1) + '</label></td>';
            row += '<td style="text-align: center">' + edu.util.returnEmpty(data[i].NGAYHOC) + '</td>';//
            row += '<td style="text-align: center" >' + edu.util.returnEmpty(data[i].LICHHOC_SOTIET) + '</td>';//Số tiết - lịch học//
            row += '<td style="text-align: center">' + edu.util.returnEmpty(data[i].LICHHOC_TIETBATDAU) + '</td>';//Tiết bắt đầu - lịch học//
            row += '<td style="text-align: center">' + edu.util.returnEmpty(data[i].LICHHOC_TIETKETTHUC) + '</td>';//Tiết kết thúc - lịch học//
            row += '<td style="text-align: center"><input type="text" style="min-width: 35px" id="txtPhanGiang_SiSo' + strPhanGiang_LichHoc_Id + '" value="' + edu.util.returnEmpty(data[i].SOSINHVIEN) + '" class="form-control"/></td>';//Phân giảng - Số tiết
            row += '<td style="text-align: center"><input type="text" style="min-width: 35px" id="txtPhanGiang_SoTiet' + strPhanGiang_LichHoc_Id + '" value="' + edu.util.returnEmpty(data[i].SOTIET) + '" class="form-control"/></td>';//Phân giảng - Số tiết
            row += '<td style="text-align: center"><input type="text" style="min-width: 35px" id="txtPhanGiang_TietBatDau' + strPhanGiang_LichHoc_Id + '" value="' + edu.util.returnEmpty(data[i].TIETBATDAU) + '" class="form-control"/></td>';//Phân giảng - Số tiết
            row += '<td style="text-align: center" ><input type="text" style="min-width: 35px" id="txtPhanGiang_TietKetThuc' + strPhanGiang_LichHoc_Id + '" value="' + edu.util.returnEmpty(data[i].TIETKETTHUC) + '" class="form-control"/></td>';//Phân giảng - Số tiết
            row += '<td><select id="dropPhanGiang_BaiHoc' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn bài học--</option ></select ></td>';
            row += '<td><select id="dropPhanGiang_HinhThucHoc' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn hình thức--</option ></select ></td>';
            row += '<td><select id="dropPhanGiang_GiangVien_TrongTruong' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn GV trong trường--</option ></select ></td>';
            row += '<td><select id="dropPhanGiang_GiangVien_MoiGiang' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn GV mời giảng--</option ></select ></td>';
            row += '<td><select id="dropDiaDiem' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn địa điểm--</option ></select ></td>';
            row += '<td><input type="text" style="width: 150px" id="txtPhanGiang_GhiChu' + strPhanGiang_LichHoc_Id + '" value="' + edu.util.returnEmpty(data[i].MOTA) + '" class="form-control"/></td>';//Phân giảng - ghi chú
            row += '<td style="text-align: center"></td>';
            row += '</tr>';
            $("#tblLichPhanGiang tbody").append(row);
            me.genCombo_BaiHoc("dropPhanGiang_BaiHoc" + strPhanGiang_LichHoc_Id, data[i].DAOTAO_BAIHOC_ID);//
            me.genCombo_PhanGiang_HinhThucHoc("dropPhanGiang_HinhThucHoc" + strPhanGiang_LichHoc_Id, data[i].IDHINHTHUCHOC);//
            me.genCombo_PhanGiang_GiangVien_TrongTruong("dropPhanGiang_GiangVien_TrongTruong" + strPhanGiang_LichHoc_Id, data[i].NHANSU_HOSOCANBO_ID);//
            me.genCombo_PhanGiang_GiangVien_MoiGiang("dropPhanGiang_GiangVien_MoiGiang" + strPhanGiang_LichHoc_Id, data[i].NHANSU_HOSOCANBO_ID);//
            me.genCombo_DiaDiem("dropDiaDiem" + strPhanGiang_LichHoc_Id, data[i].TKB_PHANLOAIDIADIEM_ID);//
            if (edu.util.checkValue(data[i].IDHINHTHUCHOC) && edu.util.checkValue(data[i].NHANSU_HOSOCANBO_ID)) {
                for (var j = 0; j < me.dtHoatDong.length; j++) {
                    if (me.dtHoatDong[j].ID == data[i].IDHINHTHUCHOC) {
                        me.dtHoatDong[j].SOLUONG = me.dtHoatDong[j].SOLUONG + parseInt(data[i].SOTIET);
                        break;
                    }
                }
            }
        }
        var html = '<div id="zoneSoTietLichGiang" class="box-tools pull-left">';
        for (var i = 0; i < me.dtHoatDong.length; i++) {
            html += me.dtHoatDong[i].TENHINHTHUCHOC + " : <b>" + me.dtHoatDong[i].SOLUONG + "</b><br/>";
        }
        html += '</div>';
        $("#tblLichPhanGiang").after(html);
        function moveScroll() {
            var scroll = $("#tblLichPhanGiang").parent().scrollTop();
            var anchor_top = $("#tblLichPhanGiang").offset().top;
            var anchor_bottom = $("#bottom_anchor").offset().top;
            if (scroll > anchor_top) {
                clone_table = $("#clone");
                if (clone_table.length == 0) {
                    clone_table = $("#tblLichPhanGiang").clone();
                    clone_table.attr('id', 'clone');
                    clone_table.css({
                        position: 'fixed',
                        'pointer-events': 'none',
                        top: 0
                    });
                    clone_table.width($("#tblLichPhanGiang").width());
                    $("#tblLichPhanGiang").append(clone_table);
                    $("#clone").css({ visibility: 'hidden' });
                    $("#clone thead").css({
                        visibility: 'visible',
                        background: '#f1f1f1'
                    });
                }
            } else {
                $("#clone").remove();
            }
        }
        $("#tblLichPhanGiang").parent().scroll(moveScroll);
        $("#table-container").scroll(function () {
            var x = $("#clone");
            if (x.length > 0) {
                x = x[0];
                var anchor_left = $("#tblLichPhanGiang").offset().left;
                console.log(anchor_left);
                x.style.left = anchor_left + "px";
            }
        });
        $("#tblLichPhanGiang").parent().scroll(function () {
            var x = $("#clone");
            if (x.length > 0) {
                x = x[0];
                var anchor_left = $("#tblLichPhanGiang").offset().left;
                x.style.left = anchor_left + "px";
            }
        });
    },
    genHTML_PhanGiang_LichHoc_New: function (strPhanGiang_LichHoc_Id) {
        var me = this;
        var iViTri = document.getElementById("tblLichPhanGiang").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strPhanGiang_LichHoc_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strPhanGiang_LichHoc_Id + '">' + iViTri + '</label></td>';
        row += '<td style="text-align: center"></td>';//
        row += '<td style="text-align: center"></td>';//Số tiết - lịch học//
        row += '<td style="text-align: center"></td>';//Tiết bắt đầu - lịch học//
        row += '<td style="text-align: center"></td>';//Tiết kết thúc - lịch học//
        row += '<td><input type="text" id="txtPhanGiang_SiSo' + strPhanGiang_LichHoc_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtPhanGiang_SoTiet' + strPhanGiang_LichHoc_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtPhanGiang_TietBatDau' + strPhanGiang_LichHoc_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtPhanGiang_TietKetThuc' + strPhanGiang_LichHoc_Id + '" class="form-control"/></td>';
        row += '<td><select id="dropPhanGiang_BaiHoc' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn bài học--</option ></select ></td>';
        row += '<td><select id="dropPhanGiang_HinhThucHoc' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn hình thức học--</option ></select ></td>';
        row += '<td><select id="dropPhanGiang_GiangVien_TrongTruong' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn GV trong trường--</option ></select ></td>';
        row += '<td><select id="dropPhanGiang_GiangVien_MoiGiang' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn GV mời giảng--</option ></select ></td>';
        row += '<td><select id="dropDiaDiem' + strPhanGiang_LichHoc_Id + '" class="select-opt"><option value=""> --- Chọn địa điẻm--</option ></select ></td>';
        row += '<td><input type="text" style="width: 150px" id="txtPhanGiang_GhiChu' + strPhanGiang_LichHoc_Id + '"  class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strPhanGiang_LichHoc_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblLichPhanGiang tbody").append(row);
        me.genCombo_BaiHoc("dropPhanGiang_BaiHoc" + strPhanGiang_LichHoc_Id, "");
        me.genCombo_PhanGiang_HinhThucHoc("dropPhanGiang_HinhThucHoc" + strPhanGiang_LichHoc_Id, "");
        me.genCombo_PhanGiang_GiangVien_TrongTruong("dropPhanGiang_GiangVien_TrongTruong" + strPhanGiang_LichHoc_Id, "");
        me.genCombo_PhanGiang_GiangVien_MoiGiang("dropPhanGiang_GiangVien_MoiGiang" + strPhanGiang_LichHoc_Id, "");
        me.genCombo_DiaDiem("dropDiaDiem" + strPhanGiang_LichHoc_Id, "");
    },
    getList_BaiHoc: function (strHocPhan_Id) {
        var me = this;
        if (!edu.util.checkValue(strHocPhan_Id)) strHocPhan_Id = edu.util.getValById("dropSearch_HocPhan");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtBaiHoc = dtResult;
                    me.genTable_BaiHoc(data.Data, data.Pager);
                }
                else {
                    console.log(8);
                    edu.system.alert("KHCT_BaiHoc/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_BaiHoc/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_BaiHoc/LayDanhSach',
            contentType: true,
            data: {
                'strTuKhoa': "",
                'strDaoTao_HocPhan_Id': strHocPhan_Id,
                'strDaoTao_ToChucCT_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_BaiHoc: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'KHCT_BaiHoc/ThemMoi',

            'strId': me.strBaiHoc_HocPhan_Id,
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropSearch_HocPhan"),
            'strDaoTao_ToChucCT_Id': "",
            'strNoiDung': edu.util.getValById("txtCT_NoiDung"),
            'strTenBai': edu.util.getValById("txtTen"),
            'strKyHieu': "",
            'dSoTiet': edu.util.getValById("txtCT_SoTiet"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'KHCT_BaiHoc/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_BaiHoc();
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
    delete_BaiHoc: function (Ids) {
        var me = this;
        var strIds = Ids;
        var obj_delete = {
            'action': 'KHCT_BaiHoc/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_BaiHoc();
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
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_BaiHoc_HocPhan: function (strId) {
        var me = main_doc.TraCuuLichGiang;
        var obj_detail = {
            'action': 'KHCT_BaiHoc/LayChiTiet',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strId': strId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewEdit_BaiHoc_HocPhan(data.Data);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,

            contentType: true,

            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_BaiHoc: function (data) {
        var jsonForm = {
            strTable_Id: "tblBaiHoc",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 2, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "TENBAI"//
                },
                {
                    "mDataProp": "SOTIET"//
                },
                {
                    "mDataProp": "NOIDUNG"//
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_BaiHoc_HocPhan: function (data) {
        var me = this;
        //view data --Edit
        var dtBaiHoc = data[0];
        edu.util.viewValById("txtTen", dtBaiHoc.TENBAI);
        edu.util.viewValById("txtKyHieu", dtBaiHoc.KYHIEUBAI);
        edu.util.viewValById("dropBaiHoc_HocPhan", dtBaiHoc.DAOTAO_HOCPHAN_ID);
        edu.util.viewValById("dropBaiHoc_ChuongTrinh", dtBaiHoc.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("txtCT_SoTiet", dtBaiHoc.SOTIET);
        edu.util.viewValById("txtCT_NoiDung", dtBaiHoc.NOIDUNG);
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strBaiHoc_HocPhan_Id = "";
        me.strBaiHoc_Id = "";
        var arrId = ["txtTen", "dropBaiHoc_ChuongTrinh", "dropBaiHoc_HocPhan", "txtKyHieu", "txtCT_SoTiet", "txtCT_NoiDung"];
        edu.util.resetValByArrId(arrId);
    },
    loadToCombo_DiaDiem: function (data) {
        main_doc.TraCuuLichGiang.dtDiaDiem = data;
    },
    genCombo_DiaDiem: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtDiaDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",//
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn địa điểm"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    genCombo_BaiHoc: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtBaiHoc,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENBAI",//
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn bài học"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    genCombo_PhanGiang_HinhThucHoc: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtHoatDong,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHINHTHUCHOC",//
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn hình thức học"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    genCombo_PhanGiang_GiangVien_TrongTruong: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtGiangVienTrongTruong,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOTEN",//
                Render: function (nrow, aData) {
                    return "<option value='" + aData.ID + "'>" + aData.HOTEN + " " + edu.util.returnEmpty(aData.MASO) + "</option>";
                },
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn GV trong viện"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    genCombo_PhanGiang_GiangVien_MoiGiang: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtGiangVienNgoaiTruong,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOTEN",//
                Render: function (nrow, aData) {
                    return "<option value='" + aData.ID + "'>" + aData.HOTEN + " " + edu.util.returnEmpty(aData.MASO) + "</option>";
                },
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn GV mời giảng"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    genCombo_PhanGiang_KhuVuc: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKhuVuc,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHUVUC",//
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn khu vực"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    genCombo_PhanGiang_ToaNha: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtToaNha,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENTOANHA",//
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    genCombo_PhanGiang_GiangDuong: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtPhongHoc,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENPHONGHOC",//
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn giảng đường"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    getList_ChuongTrinh: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinh(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach',
            contentType: true,
            data: {
                'strTuKhoa': "",
                'strDaoTao_KhoaDaoTao_Id': "",
                'strDaoTao_HeDaoTao_Id': "",
                'strDaoTao_N_CN_Id': "",
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder"
            },
            renderPlace: ["dropBaiHoc_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },
    collageInTable: function (obj) {
        var me = this;
        var strTable_Id = obj.strTable_Id
        var iBatDau = obj.iBatDau;//Cột bắt đầu thực hiện collage
        var iKetThuc = obj.iKetThuc;//Cột kết thúc thực hiện collage
        var arrStr = obj.arrStr;//Mảng các cột sẽ được cộng dồn dữ liệu khi collage
        var arrFloat = obj.arrFloat;//Mảng số thực sẽ được tính tổng khi collage
        var iInputCheck = obj.iInputCheck;//Vị trí ô check box nếu có
        var row = $("#" + strTable_Id + ' tbody')[0].rows;
        checkData(row, iBatDau);

        function checkData(rows, iSet) {
            if (iSet > iKetThuc) return;//Kết thúc đề quy khi vị trí xét = vị trí kết thúc
            var temp = rows[0];//Lấy dòng đầu tiên đem so sánh với các dòng tiếp theo nếu trùng nhau thì sẽ thực hiện collage. Khác nhau sẽ thúc khối dữ liệu này sang khối khác
            var arrResult = [];
            var bLanDau = true;//Để không thực hiện collage khi chỉ có 1 loại dữ liệu
            for (var i = 1; i < rows.length; i++) {
                var strTempHTML = temp.cells[iSet].innerHTML;
                if (rows[i].cells[iSet].innerHTML === strTempHTML) {
                    if (strTempHTML === "" || rows[i].id.length === 32) continue;
                    arrResult.push(rows[i]);
                }
                else {
                    if (arrResult.length > 0) {
                        addValue(arrResult, temp, iSet);
                        bLanDau = false;
                    }
                    temp = rows[i];
                    arrResult = [];
                }
            }
            if (arrResult.length > 0 && !bLanDau) {
                addValue(arrResult, temp, iSet);
            }
            else {//
                if (arrResult.length > 0 && bLanDau) {
                    checkData(rows, iSet + 1);
                }
            }
        }
        function addValue(arrResult, temp, iSet) {
            //temp rows đầu tiên của tất cả row đang xét
            //arrResult là mảng rows tiếp theo của tất cả row đang xét
            if (temp.id.length === 32) return;//Thoát khi nó là thằng đã đc sinh ra từ collage
            if (iSet > iKetThuc) return;
            var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var randomString = '';
            for (var i = 0; i < 32; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            var strParentClassName = $(temp).attr("class");
            if (edu.util.checkValue(strParentClassName)) {
                $(temp).before('<tr style="font-weight: bold; display: none" id="' + randomString + '" class="' + strParentClassName + '">' + temp.innerHTML + '</tr>');
            }
            else {
                $(temp).before('<tr style="font-weight: bold;" id="' + randomString + '">' + temp.innerHTML + '</tr>');
            }
            var pointHienThi = document.getElementById(randomString);
            //Hiện thị string
            for (i = 0; i < arrStr.length; i++) {
                var ivitriSelect = arrStr[i];
                var strHienThi = temp.cells[ivitriSelect].innerHTML;
                for (var j = 0; j < arrResult.length; j++) {
                    var strTempCheck = arrResult[j].cells[ivitriSelect].innerHTML;
                    if (strHienThi.includes(strTempCheck)) continue;
                    strHienThi += ', ' + strTempCheck;
                }
                pointHienThi.cells[ivitriSelect].innerHTML = strHienThi;
            }
            arrResult.unshift(temp);
            //Hiện thị số
            for (i = 0; i < arrFloat.length; i++) {
                var ivitriSelect = arrFloat[i];
                var dHienThi = 0.0;
                dHienThi = parseFloat(dHienThi);
                for (var i = 0; i < arrResult.length; i++) {
                    var xxx = (arrResult[i].cells[ivitriSelect].innerHTML).replace(/ /g, "").replace(/,/g, "");
                    dHienThi += parseFloat(xxx);
                }
                dHienThi = edu.util.formatCurrency(dHienThi);
                pointHienThi.cells[ivitriSelect].innerHTML = dHienThi;
            }
            if (edu.util.checkValue(iInputCheck)) {
                pointHienThi.cells[iInputCheck].innerHTML = '<input type="checkbox" name="input' + randomString + '" class="inputParent" />';
            }
            //Add class cho từng tr và input tại cell cuối
            for (i = 0; i < arrResult.length; i++) {
                arrResult[i].cells[iSet].innerHTML = "";
                arrResult[i].style.display = 'none';
                $(arrResult[i]).attr("class", "");
                arrResult[i].classList.add(randomString);
            }
            //Add action đóng mở 
            pointHienThi.cells[iSet].innerHTML = '<i class="fa fa-plus collapeParent" name="' + randomString + '" style="cursor: pointer;"></i> ' + pointHienThi.cells[iSet].innerHTML;
            //
            checkData(arrResult, iSet + 1);
        }
        function collageAll(point) {
            point.classList.remove('fa-minus');
            point.classList.add('fa-plus');

            var id = $(point).attr("name");
            $('#' + strTable_Id + ' tbody tr.' + id).each(function () {
                this.style.display = 'none';
                var id = this.id;
                //Xử lý những thằng con
                if (id.length === 32) {
                    var x = $('#' + strTable_Id + ' tbody')[0].getElementsByClassName("collapeParent");
                    for (var i = 0; i < x.length; i++) {
                        var pointChild = x[i];
                        if ($(pointChild).hasClass('fa-minus') && $(pointChild).attr('name') === id) {
                            collageAll(pointChild);
                        }
                    }
                }
            });
        }
        $(document).delegate(".collapeParent", "click", function (e) {
            e.stopImmediatePropagation();
            var point = $(this);
            var id = point.attr('name');
            if (point.hasClass('fa-plus')) {
                this.classList.remove('fa-plus');
                this.classList.add('fa-minus');
                $('#' + strTable_Id + ' tbody tr.' + id).each(function () {
                    this.style.display = '';
                });
            } else {
                collageAll(this);
            }
        });
        if (edu.util.checkValue(iInputCheck)) {
            $(document).delegate(".inputParent", "click", function (e) {
                var id = this.name.replace(/input/g, '');
                var checked_status = $(this).is(':checked');
                checkuncheckAll(id, checked_status);
            });
            function checkuncheckAll(id, checked_status) {
                $('#' + strTable_Id + ' tbody tr.' + id + ' input').each(function () {
                    $(this).attr('checked', checked_status);
                    $(this).prop('checked', checked_status);
                    if (checked_status) {
                        this.parentNode.parentNode.classList.add('tr-bg');
                    }
                    else {
                        this.parentNode.parentNode.classList.remove('tr-bg');
                    }
                    var id = this.name.replace(/input/g, '');
                    if (id.length == 32 && $(this).hasClass('inputParent')) {
                        checkuncheckAll(id, checked_status);
                    }
                });
            }
        }
    },
    actionRowSpan: function (strTableId, arrCol) {
        //1. Lấy toàn bộ rows tưởng tượng nó có thể chia thành nhiều khối với mỗi khối là các rows hoặc row (không xử lý row đơn)
        //2. Nếu chỉ là rowspan bình thưởng chuyển sang hàm rowspan đơn giản
        //3. row phức tạp theo hình thức đệ quy cha con được cấu trúc như trên sẽ được xử dụng theo các bước
        //3.1 truyền khối rows đó vào có truyển mảng con cẩn xử lý (function rowACol có arrChild là 1 phần mảng đầu vào. 1, [0, [4, 5, 6] Mảng con là [4, 5, 6], mảng con có thể đệ quy là 1 mảng lớn
        //3.2 duyệt từ đầu đến cuối khối xem có phần tử giống nhau thì đẩy sang 1 mảng delete (nếu xóa ngay sẽ không thao tác được tiếp vì số rows và cols trong khối rows đó đã thay đổi)
        //3.3 chuyển tiếp xử lý đến từng phẩn tử con trong mảng đầu vào nếu là mảng lớn thì có truyền arrChild trong rowACol
        //3.4 Xử lý theo tuần tự từ đầu mảng đến cuối mảng không lắt léo
        //3.5 Xóa và rowspan các phần tử đã vào danh sách đen trong quá trình xử lý
        x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
        var bcheck = true;
        //Kiểm tra xem arr có phải là row span đơn giản không
        for (var i = 0; i < arrCol.length; i++) {
            if (typeof (arrCol[i]) !== 'number') {
                bcheck = false;
                break;
            }
        }
        if (bcheck) {//Chuyển sang row span đơn giản
            rowSpanSimple(x, arrCol);
            return;
        }
        var arrCellsDelete = [];
        //Bắt đầu tiểm điểm chung giữa các cells
        rowACol(x, arrCol[0], 0, arrCol[1]);
        //Sau khi tìm xong các cells cần xóa bắt đầu xóa lần lượt
        deleteCells();
        //Check phần tử trùng nhau
        function rowACol(rows, icol, iBatDau, arrChild) {
            //Rows là 1 khối dòng 
            //icol là cột đem so sánh
            //iBatDau là số dòng bắt đầu
            //arrChild mảng con cần so sánh nếu có
            //Đây là đệ quy nhé. Nếu row thấp tự hủy luôn
            if (rows === undefined || rows === null || rows.length < 2) return;
            if (typeof (icol) !== 'number') return;
            var iKetThuc = 0;//Đây là số dòng trong mảng giống nhau
            var tempCellobj = rows[0].cells[icol].innerHTML;//Bắt đầu lấy phần tử đầu tiên đem so sánh
            for (var i = 1; i < rows.length; i++) {//Nếu khác nhau thực hiện chuyển tiếp và thực hiện 
                if (rows[i].cells[icol].innerHTML !== tempCellobj) {
                    tempCellobj = rows[i].cells[icol].innerHTML;
                    nextRowSpan(icol, iBatDau, iKetThuc, arrChild);
                    //reset
                    iBatDau = i;
                    iKetThuc = 0;
                } else {//Nếu giống nhau số dòng giống nhau tăng thêm 1. Nếu đến cuối mảng vẫn giống nhau chuyển sang bên kia
                    iKetThuc++;
                    if (i === rows.length - 1) nextRowSpan(icol, iBatDau, iKetThuc, arrChild);
                }
            }
        }
        //Thực hiện chuyển tiếp nếu có arrChild
        function nextRowSpan(icol, iBatDau, iKetThuc, arrChild) {
            if (iKetThuc === 0) return; //Thoát ra khi có lỗi không có row nào
            arrCellsDelete.push([icol, iBatDau, iKetThuc]);// Đẩy bộ 3 số để row span số cột, dòng bắt đầu, dòng kết thúc
            var arr = arrChild;//
            if (arr === undefined || arr.length < 2) return;//arrChild không tồn tại
            var rows = [x[iBatDau]];// bắt đầy đầy các dòng vào row
            for (i = 0; i < iKetThuc; i++) {
                rows.push(x[iBatDau + i + 1]);
            }
            for (i = 0; i < arr.length; i++) {
                if (typeof (arr[i]) === 'number') {
                    rowACol(rows, arr[i], iBatDau, undefined);//Rowspan với không mảng con đệ quy
                }
                else {
                    if (typeof (arr[i]) === 'object') {
                        rowACol(rows, arr[i][0], iBatDau, arr[i][1]);//Rowspan với mảng con đệ quy
                    }
                }
            }
        }
        function deleteCells() {
            //Sort cells in theo thứ tự giảm dần để tránh sự sai sót khi xóa dữ liệu
            for (var i = 0; i < arrCellsDelete.length - 1; i++) {
                for (var j = i + 1; j < arrCellsDelete.length; j++) {
                    if (arrCellsDelete[j][0] < arrCellsDelete[i][0]) {
                        var arrTempSwitch = arrCellsDelete[j];
                        arrCellsDelete[j] = arrCellsDelete[i];
                        arrCellsDelete[i] = arrTempSwitch;
                    }
                }
            }
            //Thực hiện rowspan và xóa cells thừa. Đi 
            for (var i = arrCellsDelete.length - 1; i >= 0; i--) {
                var iCot = arrCellsDelete[i][0];
                var iBatDau = arrCellsDelete[i][1];
                var iKetThuc = arrCellsDelete[i][2];
                var tempCellobj = x[iBatDau].cells[iCot];
                for (var j = 0; j < iKetThuc; j++) {
                    tempCellobj.rowSpan++;
                    x[iBatDau + j + 1].deleteCell(iCot);
                }
            }
        }
        function rowSpanSimple(rows, arrCol) {
            //Sắp xếp theo thứ tự giảm dần mảng arrCol để xóa không có lỗi
            for (var i = 0; i < arrCol.length - 1; i++) {
                for (var j = i + 1; j < arrCol.length; j++) {
                    if (arrCol[j] > arrCol[i]) {
                        var itemArrSwitch = arrCol[i];
                        arrCol[i] = arrCol[j];
                        arrCol[j] = itemArrSwitch;
                    }
                }
            }
            for (var i = 0; i < arrCol.length; i++) {
                var icol = arrCol[i];
                var tempCellobj = rows[0].cells[icol];//Lấy giữ liệu thằng đầu dòng đem so sánh.
                for (var j = 1; j < rows.length; j++) {//Nếu trùng thằng nào ++ rowspan và xóa luôn
                    if (rows[j].cells[icol].innerHTML !== tempCellobj.innerHTML) {
                        tempCellobj = rows[j].cells[icol];
                    } else {
                        tempCellobj.rowSpan++;
                        rows[j].deleteCell(icol);
                    }
                }
            }
        }
    },
    getList_HeDaoTao: function () {
        var me = main_doc.TraCuuLichGiang;
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDSHeDaoTao',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_HeDaoTao(data.Data, data.Pager);
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
    genCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_KeThua: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_LichGiang/KeThua',

            'strIdsLopHocPhan': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIdLopHocPhan': me.strLopHocPhan_Id,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropSearch_HocPhan"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa hoàn tất. Hãy kiểm tra lại!", "w");
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
    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data) {
        main_doc.TraCuuLichGiang.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_XacNhanPhanGiang/ThemMoi',
            'strId': "",
            'strSanPham_Id': strSanPham_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
        };
        $("#modal_XacNhan").modal('hide');
        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
                me.getList_LopHocPhan();
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
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_XacNhanPhanGiang/LayDanhSach',
            'strTuKhoa': "",
            'strSanPham_Id': strSanPham_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
            'strChucNang_Id': edu.system.strChucNang_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
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
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CoCauToChuc);
    },
    genComBo_CoCauToChuc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonViThanhVien"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CCTC: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_CoCauToChuc"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HS: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0,
			'strChucNang_Id': edu.system.strChucNang_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVien"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
};
