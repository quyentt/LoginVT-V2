/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function CongThucDiemApDung() { };
CongThucDiemApDung.prototype = {
    strChuongTrinh_Id: '',
    strCommon_Id: '',
    dtThoiGianDaoTao: [],
    dtCongThucDiem: [],
    dtThanhPhanDiem: [],
    dtMoHinhXuLy: [],
    strHocPhan_Id: '',
    dtChuongTrinh: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        $("#tblChuongTrinh").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            $("#zoneEdit").slideDown();
            me.strChuongTrinh_Id = strId;
            edu.util.setOne_BgRow(strId, "tblChuongTrinh");
            me.getList_CongThucDiemApDung_ChuongTrinh();
            me.getList_HocPhan_ChuongTrinh();
            me.getList_NguoiHoc_ChuongTrinh();
            var data = edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID");
            me.viewEdit_ThamSoAD_ChuongTrinh(data[0]);
        });
        $("#btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ChuongTrinh();
            }
        });
        $("#btnSearch").click(function () {
            me.getList_ChuongTrinh();
        });
        $("#btn_tab1").click(function () {
            $("#tab_ngoai1").hide();
            $("#tab_ngoai2").hide();
            $("#tab-content").show();
        });
        $("#btn_tab2").click(function () {
            $("#tab_ngoai1").show();
            $("#tab-content").hide();
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
        });

        $("#dropSearch_KhoaHoc").on("select2:select", function () {
            me.getList_ChuongTrinh();
        });

        $("#btnKeThua_CongThucDiemApDungChungCTTrongKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            edu.system.confirm("Bạn có chắc chắn kế thừa");
            $("#btnYes").click(function (e) {
                me.save_KeThuaCongThucDiemAD_ChuongTrinh(id, "");
            });
            
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_CongThucDiemApDungChungCT").click(function () {
            $("#tblCongThucDiemApDungChungChoChuongTrinh tbody tr").each(function () {
                var strCongThucDiem_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_CongThucDiemApDung_ChuongTrinh(strCongThucDiem_AD_Id, me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_CongThucDiemApDungChungCT").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_CongThucDiemApDungCT(id, "");
        });
        $("#tblCongThucDiemApDungChungChoChuongTrinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblCongThucDiemApDungChungChoChuongTrinh tr[id='" + strRowId + "']").remove();
        });
        $("#tblCongThucDiemApDungChungChoChuongTrinh").delegate(".deleteCongThucDiem_ChuongTrinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_CongThucDiemApDung_ChuongTrinh(strId);
            });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_CongThucDiemApDung_HocPhan").click(function () {
            $("#tblCongThucDiemApDung_HocPhan tbody tr").each(function () {
                var strCongThucDiem_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_CongThucDiemApDung_HocPhan(strCongThucDiem_AD_Id, me.strHocPhan_Id + me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_CongThucDiemApDung_HocPhan").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_CongThucDiem_HocPhan_New(id, "");
        });
        $("#tblCongThucDiemApDung_HocPhan").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblCongThucDiemApDung_HocPhan tr[id='" + strRowId + "']").remove();
        });
        $("#tblCongThucDiemApDung_HocPhan").delegate(".deleteCongThucDiem_ChuongTrinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_CongThucDiem_HocPhan(strId);
            });
        });
        $("#txtSearch_HocPhan_TuKhoa").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_hocphanchuongtrinh li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        $("[id$=chkSelectAll_hocphanchuongtrinh]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "zone_hocphanchuongtrinh" });
        });
        $("#btnKeThua_CongThucDiemApDungHPCT").click(function () {
            var arrTable_Id = [];
            var strPrefix_id = 'checkX';
            $('#zone_hocphanchuongtrinh').find(":checkbox[id^='" + strPrefix_id + "']:checked").each(function () {
                arrTable_Id.push(this.id.replace(strPrefix_id, ""));
            });
            var arrChecked_Id = arrTable_Id;
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var arrTenKeThua = [];
            arrChecked_Id.forEach(ele => {
                arrTenKeThua.push(me.dtHocPhanChuongTrinh.find(e => e.DAOTAO_HOCPHAN_ID == ele).DAOTAO_HOCPHAN_TEN);
            })

            edu.system.confirm("Bạn có kế thừa từ " + me.dtHocPhanChuongTrinh.find(e => e.DAOTAO_HOCPHAN_ID == me.strHocPhan_Id).DAOTAO_HOCPHAN_TEN + " sang " + arrTenKeThua.toString(', ') + " không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_KeThua(arrChecked_Id[i]);
                }
            });
            
        });

        $('#dropSearch_ThoiGianDangKy').on('select2:select', function (e) {
            me.getList_HocPhan_NguoiHoc(me.strSinhVien_Id);
        });
        $("#dropSearch_HocPhan").on("select2:select", function () {
            me.getList_ThamSoDanhGia_NguoiHoc();
        });
        $("#btnSave_ThamSoDanhGiaApDung_NguoiHoc").click(function () {
            $("#tblThamSoDanhGiaApDung_NguoiHoc tbody tr").each(function () {
                var strThamSoDanhGia_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThamSoDanhGia_NguoiHoc(strThamSoDanhGia_AD_Id, me.strNguoiHoc_Id + edu.util.getValById("dropSearch_HocPhan"));
            });
        });
        $("#btnAdd_ThamSoDanhGiaApDung_NguoiHoc").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThamSoDanhGia_NguoiHoc_New(id, "");
        });
        $("#tblThamSoDanhGiaApDung_NguoiHoc").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThamSoDanhGiaApDung_NguoiHoc tr[id='" + strRowId + "']").remove();
        });
        $("#tblThamSoDanhGiaApDung_NguoiHoc").delegate(".deleteCongThucDiem_ChuongTrinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThamSoDanhGia_NguoiHoc(strId);
            });
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinh();
        me.getList_ThoiGianDaoTao();
        me.getList_CongThucDiem();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.MOHINHCONGTHUC", "", "", me.getList_MoHinhXuLy);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
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
                    me.dtChuongTrinh = dtResult;
                    me.genTable_ChuongTrinh(dtResult, iPager);
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
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaHoc"),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_N_CN_Id': "",
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': edu.system.pageIndex_default,
                'pageSize': edu.system.pageSize_default,
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChuongTrinh: function (data, iPager) {
        var me = this;
        $("#zoneEdit").slideUp();
        edu.util.viewHTMLById("lblChuongTrinh_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblChuongTrinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CongThucDiemApDung.getList_ChuongTrinh()",
                iDataRow: iPager
            },
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
                        html += '<span>' + 'Chương trình: ' + edu.util.returnEmpty(aData.TENCHUONGTRINH) + " - " + edu.util.returnEmpty(aData.MACHUONGTRINH) + "</span><br />";
                        html += '<span>' + 'Khóa đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_KHOADAOTAO_TEN) + "</span><br />";
                        return html;
                    }
                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_CongThucDiemApDung_ChuongTrinh: function (strCongThucDiemApDung_Id, strChuongTrinh_Id) {
        var me = this;
        var strId = strCongThucDiemApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropChuongTrinh_ThoiGianDaoTao' + strCongThucDiemApDung_Id);
        var strDiem_CongThucDiem_Id = edu.util.getValById('dropChuongTrinh_XauCongThuc' + strCongThucDiemApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_CT' + strCongThucDiemApDung_Id);
        var dTongHopKhiDuDiem = edu.util.getValById('dropMoHinhThongHop' + strCongThucDiemApDung_Id);
        var dSoThanhPhanToiThieu = edu.util.getValById('txtSoThanhPhanToiThieu' + strCongThucDiemApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        //if (!edu.util.checkValue(strDiem_CongThucDiem_Id) || !edu.util.checkValue(strDaoTao_ThoiGianDaoTao_Id) || !edu.util.checkValue(strNgayApDung)) {
        //    //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_CongThucDiem_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strDiem_CongThucDiem_Id': strDiem_CongThucDiem_Id,
            'strXauCongThuc': '',
            'strMa': '',
            'strTen': '',
            'iThuTu': '',
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'dSoThanhPhanToiThieu': dSoThanhPhanToiThieu,
            'dTongHopKhiDuDiem': dTongHopKhiDuDiem,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_CongThucDiem_ApDung/CapNhat';
        //}
        //default
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
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
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
    getList_CongThucDiemApDung_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_CongThucDiem_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDiem_ThanhPhanDiem_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strDiem_CongThucDiem_Id': "",
            'strPhanCapApDung_Id': "",
            'strPhamViApDung_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_CongThucDiemApDung_ChuongTrinh(data.Data);
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
    getDeTail_CongThucDiemApDung_ChuongTrinh: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_CongThucDiem_ApDung/LayChiTiet',
            
            'strId': strId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_CongThucDiemApDung_ChuongTrinh(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_detail.action + " (er): " + er);
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CongThucDiemApDung_ChuongTrinh: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_CongThucDiem_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_CongThucDiemApDung_ChuongTrinh();
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

    genHTML_CongThucDiemApDung_ChuongTrinh: function (data) {
        var me = this;
        $("#tblCongThucDiemApDungChungChoChuongTrinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strCongThucDiem_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strCongThucDiem_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strCongThucDiem_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropChuongTrinh_XauCongThuc' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn xâu công thức--</option ></select ></td>';
            row += '<td><div style="width: 160px"><select id="dropChuongTrinh_ThoiGianDaoTao' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></div></td>';
           
            //row += '<td><input type="text" style="width: 100px" id="txtNgayApDung_CT' + strCongThucDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" class="form-control input-datepicker"/></td>';
            row += '<td>' + edu.util.returnEmpty(data[i].DIEM_THANHPHANDIEM_TEN) + '</td>';
            row += '<td>' + edu.util.returnEmpty(data[i].MOHINHXULY_TEN) + '</td>';////
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            row += '<td><select id="dropMoHinhThongHop' + strCongThucDiem_AD_Id + '" class="select-opt"><option id="1" value="1">Chỉ tổng hợp khi đủ điểm thành phần quy định</option><option id="0" value="0">Tổng hợp khi có điểm bất kỳ</option></select ></td>';
            row += '<td><input type="text" id="txtSoThanhPhanToiThieu' + strCongThucDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOTHANHPHANDIEMTOITHIEU) + '" class="form-control"/></td>';
            if (data[i].LADULIEUKHOITAO == '0')
                row += '<td style="text-align: center"><a title="Xóa" class="deleteCongThucDiem_ChuongTrinh" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblCongThucDiemApDungChungChoChuongTrinh tbody").append(row); $("#dropMoHinhThongHop" + strCongThucDiem_AD_Id).select2();
            me.genCombo_CongThucDiem("dropChuongTrinh_XauCongThuc" + strCongThucDiem_AD_Id, data[i].DIEM_CONGTHUCDIEM_ID);
            me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strCongThucDiem_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            edu.util.viewValById("dropMoHinhThongHop" + strCongThucDiem_AD_Id, data[i].TONGHOPKHIDUDIEMTHANHPHAN);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_CongThucDiemApDungCT(id, "");
        //}
    },
    genHTML_CongThucDiemApDungCT: function (strCongThucDiem_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblCongThucDiemApDungChungChoChuongTrinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strCongThucDiem_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strCongThucDiem_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropChuongTrinh_XauCongThuc' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn xâu công thức--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        //row += '<td><input type="text" style="width: 100px"  id="txtNgayApDung_CT' + strCongThucDiem_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy"/></td>';
        row += '<td></td>';
        row += '<td></td>';
        row += '<td><select id="dropMoHinhThongHop' + strCongThucDiem_AD_Id + '" class="select-opt"><option id="1" value="1">Chỉ tổng hợp khi đủ điểm thành phần quy định</option><option id="0" value="0">Tổng hợp khi có điểm bất kỳ</option></select ></td>';
        row += '<td><input type="text" id="txtSoThanhPhanToiThieu' + strCongThucDiem_AD_Id + '" class="form-control"/></td>';
        row += '<td style="text-align: center; color: green !important"><a title="Xóa dòng" class="deleteRowButton" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblCongThucDiemApDungChungChoChuongTrinh tbody").append(row);
        me.genCombo_CongThucDiem("dropChuongTrinh_XauCongThuc" + strCongThucDiem_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strCongThucDiem_AD_Id, "");
        $("#dropMoHinhThongHop" + strCongThucDiem_AD_Id).select2();
        edu.system.pickerdate();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_CongThucDiemApDung_HocPhan: function (strCongThucDiemApDung_Id, strHocPhan_Id) {
        var me = this;
        var strId = strCongThucDiemApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropHP_ThoiGianDaoTao' + strCongThucDiemApDung_Id);
        var strDiem_CongThucDiem_Id = edu.util.getValById('dropHP_XauCongThuc' + strCongThucDiemApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_HP' + strCongThucDiemApDung_Id);
        var dTongHopKhiDuDiem = edu.util.getValById('dropMoHinhThongHop' + strCongThucDiemApDung_Id);
        var dSoThanhPhanToiThieu = edu.util.getValById('txtSoThanhPhanToiThieu' + strCongThucDiemApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        if (!edu.util.checkValue(strDiem_CongThucDiem_Id)) {
            //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_CongThucDiem_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strPhamViApDung_Id': strHocPhan_Id,
            'strDiem_CongThucDiem_Id': strDiem_CongThucDiem_Id,
            'strXauCongThuc': '',
            'strMa': '',
            'strTen': '',
            'dThuTu': '',
            'dSoThanhPhanToiThieu': dSoThanhPhanToiThieu,
            'dTongHopKhiDuDiem': dTongHopKhiDuDiem,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_CongThucDiem_ApDung/CapNhat';
        //}
        //default
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
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(obj_save + ": " + data.Message);
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
    getList_CongThucDiem_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_CongThucDiem_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDiem_ThanhPhanDiem_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strDiem_CongThucDiem_Id': "",
            'strPhanCapApDung_Id': "",
            'strPhamViApDung_Id': me.strHocPhan_Id + me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_CongThucDiem_HocPhan(data.Data);
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
    delete_CongThucDiem_HocPhan: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_CongThucDiem_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_CongThucDiem_HocPhan();
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

    genHTML_CongThucDiem_HocPhan: function (data) {
        var me = this;
        console.log(11111);
        $("#tblCongThucDiemApDung_HocPhan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strCongThucDiem_AD_Id = data[i].ID;
            console.log("dropMoHinhThongHop" + strCongThucDiem_AD_Id);
            var row = '';
            row += '<tr id="' + strCongThucDiem_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strCongThucDiem_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHP_XauCongThuc' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn xâu công thức--</option ></select ></td>';
            row += '<td><div  style="width: 160px"><select id="dropHP_ThoiGianDaoTao' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></div></td>';
            //row += '<td><input type="text" id="txtNgayApDung_HP' + strCongThucDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td>' + edu.util.returnEmpty(data[i].DIEM_THANHPHANDIEM_TEN) + '</td>';////
            row += '<td>' + edu.util.returnEmpty(data[i].MOHINHXULY_TEN) + '</td>';////
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';////
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';////
            row += '<td><select id="dropMoHinhThongHop' + strCongThucDiem_AD_Id + '" class="select-opt"><option id="1" value="1">Chỉ tổng hợp khi đủ điểm thành phần quy định</option><option id="0" value="0">Tổng hợp khi có điểm bất kỳ</option></select ></td>';
            row += '<td><input type="text" id="txtSoThanhPhanToiThieu' + strCongThucDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOTHANHPHANDIEMTOITHIEU) + '" class="form-control"/></td>';

            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteCongThucDiem_ChuongTrinh" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblCongThucDiemApDung_HocPhan tbody").append(row);
            me.genCombo_CongThucDiem("dropHP_XauCongThuc" + strCongThucDiem_AD_Id, data[i].DIEM_CONGTHUCDIEM_ID);
            me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strCongThucDiem_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
        }
        $(".select-opt").select2();
        for (var i = 0; i < data.length; i++) {
            var strCongThucDiem_AD_Id = data[i].ID;
            edu.util.viewValById("dropMoHinhThongHop" + strCongThucDiem_AD_Id, data[i].TONGHOPKHIDUDIEMTHANHPHAN);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_CongThucDiem_HocPhan_New(id, "");
        //}
    },
    genHTML_CongThucDiem_HocPhan_New: function (strCongThucDiem_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblCongThucDiemApDung_HocPhan").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strCongThucDiem_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strCongThucDiem_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHP_XauCongThuc' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn xâu công thức--</option ></select ></td>';
        row += '<td><select id="dropHP_ThoiGianDaoTao' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        //row += '<td><input type="text" id="txtNgayApDung_HP' + strCongThucDiem_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy"  style="width: 100px"/></td>';
        row += '<td></td>';
        row += '<td></td>';
        //row += '<td></td>';
        //row += '<td></td>'; 
        row += '<td><select id="dropMoHinhThongHop' + strCongThucDiem_AD_Id + '" class="select-opt"><option id="1" value="1">Chỉ tổng hợp khi đủ điểm thành phần quy định</option><option id="0" value="0">Tổng hợp khi có điểm bất kỳ</option></select ></td>';
        row += '<td><input type="text" id="txtSoThanhPhanToiThieu' + strCongThucDiem_AD_Id + '" class="form-control"/></td>';
        row += '<td style="text-align: center; color: green !important"><a title="Xóa dòng" class="deleteRowButton" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblCongThucDiemApDung_HocPhan tbody").append(row);
        me.genCombo_CongThucDiem("dropHP_XauCongThuc" + strCongThucDiem_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strCongThucDiem_AD_Id, "");
        $("#dropMoHinhThongHop" + strCongThucDiem_AD_Id).select2();
        edu.system.pickerdate();
    },

    save_KeThuaCongThucDiemAD_ChuongTrinh: function (strChuongTrinh_Id) {
        var me = this;
        var strId = strChuongTrinh_Id;

        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_CongThucDiem_ApDung/KeThua',
            

            
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'D_CongThucDiem_ApDung/KeThua';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Kế thừa cho tất cả chương trình trong khóa thành công")
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strChuongTrinh_Id,
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
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
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
                    me.dtThoiGianDaoTao = dtResult;
                }
                else {
                    edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_ThoiGianDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDAOTAO_NAM_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThoiGianDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Cong thuc diem
    --Author: duyentt
	-------------------------------------------*/
    getList_CongThucDiem: function () {
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
                    me.dtCongThucDiem = dtResult;
                }
                else {
                    edu.system.alert("D_CongThucDiem/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("D_CongThucDiem/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'D_CongThucDiem/LayDanhSach',
            
            contentType: true,
            data: {
                'strTuKhoa': "",
                'strDiem_ThanhPhanDiem_Id': "",
                'strMoHinhXuLy_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_CongThucDiem: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtCongThucDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "XAUCONGTHUC",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn xâu công thức"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Cong thuc diem
    --Author: duyentt
	-------------------------------------------*/
    getList_ThanhPhanDiem: function () {
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
                    me.dtThamSoHocTap = dtResult;
                }
                else {
                    edu.system.alert("D_ThanhPhanDiem/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("D_ThanhPhanDiem/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'D_ThanhPhanDiem/LayDanhSach',
            
            contentType: true,
            data: {
                'strTuKhoa': "",
                'strThangDiem_Id': "",
                'strQuyTacLamTron_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThanhPhanDiem: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThanhPhanDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DIEM_THAMSOHOCTAPCHUNG_TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn tham số"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> hoc phan theo chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_HocPhan_ChuongTrinh: function () {
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
                    me["dtHocPhanChuongTrinh"] = data.Data;
                    me.genCombo_HocPhan_ChuongTrinh(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HocPhan_ChuongTrinh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_HocPhan_ChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_HocPhan_ChuongTrinh/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_ThoiGian_KH_Id': "",
                'strDaoTao_ThoiGian_TT_Id': "",
                'strThuocTinhHocPhan_Id': "",
                'strPhanCongPhamViDamNhiem_Id': "",
                'strDaoTao_HocPhan_Id': "",
                'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                parentId: "",
                name: "DAOTAO_HOCPHAN_TEN",
                code: ""
            },
            renderPlaces: ["zone_hocphanchuongtrinh"],
            style: "fa fa-cube color-active"
        };
        edu.system.loadToTreejs_data(obj);
        for (var i = 0; i < data.length; i++) {
            $("#zone_hocphanchuongtrinh #" + data[i].DAOTAO_HOCPHAN_ID ).append('<input type="checkbox" id="checkX' + data[i].DAOTAO_HOCPHAN_ID + '" style="float: right" />');
        }
        //2. Action
        $('#zone_hocphanchuongtrinh').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.strHocPhan_Id = strNameNode;
            var aDataHocPhan = me.dtHocPhanChuongTrinh.find(e => e.DAOTAO_HOCPHAN_ID == me.strHocPhan_Id);
            me.getList_CongThucDiem_HocPhan();
            $("#tab_ngoai2").show();
            $("#lblTenHocPhan").html(edu.util.returnEmpty(aDataHocPhan.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aDataHocPhan.DAOTAO_HOCPHAN_MA))
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
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
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
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
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
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
                    me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_KhoaHoc"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> mo hinh xu ly
    --Author: duyentt
	-------------------------------------------*/
    getList_MoHinhXuLy: function (data) {
        main_doc.CongThucDiemApDung.dtMoHinhXuLy = data;
    },
    genCombo_MoHinhXuLy: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtMoHinhXuLy,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn mô hình xử lý"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    viewEdit_ThamSoAD_ChuongTrinh: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblThamSoApDungChuongTrinh", data.TENCHUONGTRINH);
    },


    save_KeThua: function (strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin/KeThua_CongThucDiem_HP_CT_AD',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strDaoTao_HocPhan_KeThua_Id': me.strHocPhan_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_TangThem();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> hoc phan theo chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_NguoiHoc_ChuongTrinh: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSoNhieuNganh/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': edu.util.getValById("txtSearchDSSV_TuKhoa"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strChuongTrinh_Id': me.strChuongTrinh_Id,
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_LopQuanLy"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me["dt_HS"] = dtResult;
                    me.genCombo_NguoiHoc_ChuongTrinh(dtResult, iPager);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_NguoiHoc_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "QLSV_NGUOIHOC_ID",
                parentId: "",
                name: "DAOTAO_HOCPHAN_TEN",
                code: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN)
                }
            },
            renderPlaces: ["zone_nguoihocchuongtrinh"],
            style: "fa fa-cube color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //for (var i = 0; i < dtResult.length; i++) {
        //    $($("#zone_hocphanchuongtrinh #" + dtResult[i].ID + " a")[0]).append(" <span style='color: blue'>(Tổng số HP: " + dtResult[i].TONGSOHP + "; \t Tổng số TC: " + dtResult[i].TONGSOTC + "; \t Số HP bắt buộc: " + dtResult[i].SOHOCPHANQUYDINH + "; \t Số TC bắt buộc: " + dtResult[i].SOTINCHIQUYDINH + ")</span>");
        //}
        //2. Action
        $('#zone_nguoihocchuongtrinh').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.strNguoiHoc_Id = strNameNode;
            me.getList_ThoiGianDangKy(); $("#tblThamSoDanhGiaApDung_NguoiHoc tbody").html("");
            $("#tab_ngoainguoihoc").show();
        });
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_ThamSoDanhGia_NguoiHoc: function (strCongThucDiemApDung_Id, strChuongTrinh_Id) {
        var me = this;
        var strId = strCongThucDiemApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropChuongTrinh_ThoiGianDaoTao' + strCongThucDiemApDung_Id);
        var strDiem_CongThucDiem_Id = edu.util.getValById('dropChuongTrinh_XauCongThuc' + strCongThucDiemApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_CT' + strCongThucDiemApDung_Id);
        var dTongHopKhiDuDiem = edu.util.getValById('dropMoHinhThongHop' + strCongThucDiemApDung_Id);
        var dSoThanhPhanToiThieu = edu.util.getValById('txtSoThanhPhanToiThieu' + strCongThucDiemApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        //if (!edu.util.checkValue(strDiem_CongThucDiem_Id) || !edu.util.checkValue(strDaoTao_ThoiGianDaoTao_Id) || !edu.util.checkValue(strNgayApDung)) {
        //    //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_CongThucDiem_ApDung/ThemMoi',


            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strDiem_CongThucDiem_Id': strDiem_CongThucDiem_Id,
            'strXauCongThuc': '',
            'strMa': '',
            'strTen': '',
            'iThuTu': '',
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'dSoThanhPhanToiThieu': dSoThanhPhanToiThieu,
            'dTongHopKhiDuDiem': dTongHopKhiDuDiem,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_QuyDoiThangDiem_ApDung/CapNhat';
        //}
        //default
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
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
                }
            },
            error: function (er) {
                obj_notify = {
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
    getList_ThamSoDanhGia_NguoiHoc: function () {
        var me = this;

        var obj_list = {
            'action': 'D_QuyDoiThangDiem_ApDung/LayDanhSach',


            'strTuKhoa': '',
            'strThangDiemGoc_Id': "",
            'strThangDiemQuyDoi_Id': "",
            'strDiemChu_DiemQuyDoi_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strPhanCapApDung_Id': "",
            'strPhamViApDung_Id': me.strNguoiHoc_Id + edu.util.getValById("dropSearch_HocPhan"),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        var obj_list = {
            'action': 'D_CongThucDiem_ApDung/LayDanhSach',


            'strTuKhoa': '',
            'strDiem_ThanhPhanDiem_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strDiem_CongThucDiem_Id': "",
            'strPhanCapApDung_Id': "",
            'strPhamViApDung_Id': me.strNguoiHoc_Id + edu.util.getValById("dropSearch_HocPhan"),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_ThamSoDanhGia_NguoiHoc(data.Data);
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
    delete_ThamSoDanhGia_NguoiHoc: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_CongThucDiem_ApDung/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThamSoDanhGia_NguoiHoc();
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

    genHTML_ThamSoDanhGia_NguoiHoc: function (data) {
        var me = this;
        $("#tblThamSoDanhGiaApDung_NguoiHoc tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strCongThucDiem_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strCongThucDiem_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strCongThucDiem_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropChuongTrinh_XauCongThuc' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn xâu công thức--</option ></select ></td>';
            row += '<td><div style="width: 160px"><select id="dropChuongTrinh_ThoiGianDaoTao' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></div></td>';

            //row += '<td><input type="text" style="width: 100px" id="txtNgayApDung_CT' + strCongThucDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" class="form-control input-datepicker"/></td>';
            row += '<td>' + edu.util.returnEmpty(data[i].DIEM_THANHPHANDIEM_TEN) + '</td>';
            row += '<td>' + edu.util.returnEmpty(data[i].MOHINHXULY_TEN) + '</td>';////
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            row += '<td><select id="dropMoHinhThongHop' + strCongThucDiem_AD_Id + '" class="select-opt"><option id="1" value="1">Chỉ tổng hợp khi đủ điểm thành phần quy định</option><option id="0" value="0">Tổng hợp khi có điểm bất kỳ</option></select ></td>';
            row += '<td><input type="text" id="txtSoThanhPhanToiThieu' + strCongThucDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOTHANHPHANDIEMTOITHIEU) + '" class="form-control"/></td>';
            if (data[i].LADULIEUKHOITAO == '0')
                row += '<td style="text-align: center"><a title="Xóa" class="deleteCongThucDiem_ChuongTrinh" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThamSoDanhGiaApDung_NguoiHoc tbody").append(row); $("#dropMoHinhThongHop" + strCongThucDiem_AD_Id).select2();
            me.genCombo_CongThucDiem("dropChuongTrinh_XauCongThuc" + strCongThucDiem_AD_Id, data[i].DIEM_CONGTHUCDIEM_ID);
            me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strCongThucDiem_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            edu.util.viewValById("dropMoHinhThongHop" + strCongThucDiem_AD_Id, data[i].TONGHOPKHIDUDIEMTHANHPHAN);
        }
        edu.system.pickerdate();
    },
    genHTML_ThamSoDanhGia_NguoiHoc_New: function (strCongThucDiem_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThamSoDanhGiaApDung_NguoiHoc").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strCongThucDiem_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strCongThucDiem_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropChuongTrinh_XauCongThuc' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn xâu công thức--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strCongThucDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        //row += '<td><input type="text" style="width: 100px"  id="txtNgayApDung_CT' + strCongThucDiem_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy"/></td>';
        row += '<td></td>';
        row += '<td></td>';
        row += '<td><select id="dropMoHinhThongHop' + strCongThucDiem_AD_Id + '" class="select-opt"><option id="1" value="1">Chỉ tổng hợp khi đủ điểm thành phần quy định</option><option id="0" value="0">Tổng hợp khi có điểm bất kỳ</option></select ></td>';
        row += '<td><input type="text" id="txtSoThanhPhanToiThieu' + strCongThucDiem_AD_Id + '" class="form-control"/></td>';
        row += '<td style="text-align: center; color: green !important"><a title="Xóa dòng" class="deleteRowButton" id="' + strCongThucDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThamSoDanhGiaApDung_NguoiHoc tbody").append(row);
        me.genCombo_CongThucDiem("dropChuongTrinh_XauCongThuc" + strCongThucDiem_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strCongThucDiem_AD_Id, "");
        $("#dropMoHinhThongHop" + strCongThucDiem_AD_Id).select2();
        edu.system.pickerdate();
    },

    getList_ThoiGianDangKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayDSThoiGianLichHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGianDangKy(json);
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
    cbGenCombo_ThoiGianDangKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: "",
                selectFirst: true,
            },
            renderPlace: ["dropSearch_ThoiGianDangKy"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
        this.getList_HocPhan_NguoiHoc();
    },

    getList_HocPhan_NguoiHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayKetQuaDangKyHocCaNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDangKy'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genCombo_HocPhan_ChuongTrinh2(dtResult.rsKetQuaDangKy);
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
    genCombo_HocPhan_ChuongTrinh2: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DANGKY_LOPHOCPHAN_ID",
                parentId: "",
                name: "DANGKY_LOPHOCPHAN_TEN",
                code: "MAHEDAOTAO",
                order: "unorder",
                selectFirst: true,
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn lớp học phần"
        };
        edu.system.loadToCombo_data(obj);
        me.getList_ThamSoDanhGia_NguoiHoc();
    },

    getList_NamKT: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eDyAsCS4i',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_NamHoc',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "NAMHOC",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropNam_KT"],
                        type: "",
                        title: "Chọn năm kế thừa",
                    })
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
    getList_ThoiGianDaoTao2: function () {
        var me = this;

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    me["dtThoiGianDaoTao2"] = data.Data;
                    me.genComThoiGian();
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "DAOTAO_THOIGIANDAOTAO"
                        },
                        renderPlace: ["dropThoiGian_KT"],
                        title: "Chọn thời gian"
                    };
                    edu.system.loadToCombo_data(obj);
                }
                else {
                    edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_ThoiGianDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDAOTAO_NAM_Id': edu.util.getValById("dropNam_KT"),
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
}