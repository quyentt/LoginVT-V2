/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KhongDangKy() { };
KhongDangKy.prototype = {
    strKhongDangKy_Id: '',
    dtKhongDangKy: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KhongDangKy();
        $("#tblKhongDangKy").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_KhongDangKy(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                console.log(arrChecked_Id);
                var html = "";
                arrChecked_Id.forEach(strSinhVien_Id => {
                    var aData = edu.extend.dtSinhVien.find(e => e.ID == strSinhVien_Id);
                    html += "<tr id='rm_row" + strSinhVien_Id + "' name='new' svid='" + aData.QLSV_NGUOIHOC_ID + "'>";
                    html += "<td class='td-center'></td>";
                    html += "<td class='td-left' id='lblMa" + strSinhVien_Id + "'>" + aData.QLSV_NGUOIHOC_MASO + "</td>";
                    html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.QLSV_NGUOIHOC_HOTEN  + "</td>";
                    html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.QLSV_NGUOIHOC_TEN + "</td>";
                    html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.DAOTAO_LOPQUANLY_TEN + "</td>";
                    html += '<td class="td-left"><input id="txtMoTa' + aData.ID + '" class="form-control newmota" value="' + edu.util.returnEmpty(aData.MOTA) + '" /></td>';
                    html += "<td class='td-center'><a id='remove_nhansu" + strSinhVien_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                })
                $("#tblKhongDangKy tbody").append(html);
            });
            edu.extend.getList_SinhVien();
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strSinhVien_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            var html = "";
            var aData = edu.extend.dtSinhVien.find(e => e.ID == strSinhVien_Id);
            console.log(aData);
            html += "<tr id='rm_row" + strSinhVien_Id + "' name='new' svid='" + aData.QLSV_NGUOIHOC_ID + "'>";
            html += "<td class='td-center'></td>";
            html += "<td class='td-left' id='lblMa" + strSinhVien_Id + "'>" + aData.MASO + "</td>";
            html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.HODEM + "</td>";
            html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.TEN + "</td>";
            html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.LOP + "</td>";
            html += '<td class="td-left"><input id="txtMoTa' + aData.ID + '" class="form-control newmota" value="' + edu.util.returnEmpty(aData.MOTA) + '" /></td>';
            html += "<td class='td-center'><a id='remove_nhansu" + strSinhVien_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            $("#tblKhongDangKy tbody").append(html);
        });
        $("#tblKhongDangKy").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            $("#rm_row" + strNhanSu_Id).remove();
            if (!edu.util.checkValue(strcheck)) {
                edu.util.arrExcludeVal(edu.extend.dtSinhVien, strNhanSu_Id);
                
            }
            
        });
        $("#btnSave_KhongDangKy").click(function () {
            var arrThem = [];
            var arrSua = [];
            $("#tblKhongDangKy .newmota").each(function () {
                var point = $(this);
                if (point.val() != point.attr("name")) arrThem.push(this.id.replace(/txtMoTa/g,''));
            })
            $("#tblKhongDangKy .editmota").each(function () {
                var point = $(this);
                if (point.val() != point.attr("name")) arrSua.push(this.id.replace(/txtMoTa/g, ''));
            })
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length + arrSua.length);
            
            arrThem.forEach(e => {
                console.log(e);
                var aData = edu.extend.dtSinhVien.find(ele => ele.ID == e);
                //if (!aData) aData = me.dtKhongDangKy.find(ele => ele.ID == e);
                //else aData.QLSV_NGUOIHOC_ID = aData.ID;
                //console.log(aData);
                //console.log(edu.extend.dtSinhVien);
                //console.log(me.dtKhongDangKy);
                me.save_KhongDangKy(aData)
            });
            console.log(arrThem);
            console.log(arrSua);
            arrSua.forEach(e => {
                console.log(e);
                var aData = me.dtKhongDangKy.find(ele => ele.ID == e);
                //if (!aData) aData = me.dtKhongDangKy.find(ele => ele.ID == e);
                //else aData.QLSV_NGUOIHOC_ID = aData.ID;
                console.log(aData);
                console.log(me.dtKhongDangKy);
                me.save_KhongDangKy(aData, aData.ID);
            });
        });
        $("#btnDelete_KhongDangKy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhongDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhongDangKy(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_KhongDangKy();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhongDangKy();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhongDangKy" });
        });

        edu.system.getList_MauImport("zonebtnKDD", function (addKeyValue) {
            //var strSoQuyetDinh = edu.util.getValById('dropSearch_QuyetDinh');
            //if (strSoQuyetDinh) strSoQuyetDinh = $("#dropSearch_QuyetDinh option:selected").text();
            //var obj_list = {
            //    'action': 'TN_KetQua_CongNhan_VB/LayDanhSach',
            //    'strTuKhoa': edu.util.getValById('txtSearch'),
            //    'strPhanLoai_Id': edu.util.getValCombo('dropSearch_PhanLoai'),
            //    'strDaoTao_HeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao'),
            //    'strDaoTao_KhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao'),
            //    'strDaoTao_ChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh'),
            //    'strDaoTao_KhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy'),
            //    'strDaoTao_LopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop'),
            //    'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            //    'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            //    'strSoQuyetDinh': strSoQuyetDinh,
            //    'dDoiTuongBenNgoai': edu.util.getValById('dropSearch_DoiTuong'),
            //    'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
            //};
            //for (var x in obj_list) {
            //    addKeyValue(x, obj_list[x]);
            //}
        });
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
                    me.genCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropSearch_ThoiGian", "dropThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KhongDangKy: function (aData, strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin/Them_DangKy_NguoiHoc_Chan',
            'type': 'POST',
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strMoTa': edu.util.getValById('txtMoTa' + aData.ID),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'CC_ThongTin/Them_QLSV_NH_TuGhiNhan_ViPham';
        //    obj_save.strQLSV_NguoiHoc_Id = aData.QLSV_NGUOIHOC_ID;
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    //me.getList_KhongDangKy();
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
                    me.getList_KhongDangKy();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhongDangKy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_ThongTin/LayDSDangKy_NguoiHoc_Chan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhongDangKy = dtReRult;
                    me.genTable_KhongDangKy(dtReRult, data.Pager);
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
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_KhongDangKy();
            //    });
            //},
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_KhongDangKy: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'DKH_ThongTin/Xoa_DangKy_NguoiHoc_Chan',
            
            'strId': Ids,
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
                    me.getList_KhongDangKy();
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
    genTable_KhongDangKy: function (data, iPager) {
        $("#lblKhongDangKy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhongDangKy",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhongDangKy.getList_KhongDangKy()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtMoTa' + aData.ID + '" class="form-control editmota" value="' + edu.util.returnEmpty(aData.MOTA) + '" name="' + edu.util.returnEmpty(aData.MOTA) + '"/>';
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
}