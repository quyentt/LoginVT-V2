/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function DuLieuChamThi() { };
DuLieuChamThi.prototype = {
    strLopHocPhan_Id: '',
    dtLopHocPhan: [],
    dtNhanSu: [],
    strThead: '',
    iThuTuChamThi: 0,

    init: function () {
        var me = this;
        me.strThead = $("#tblLopHocPhan thead").html();
        me.getList_HS();
        me.getList_ThoiGianDaoTao();
        me.getList_CoCauToChuc();
        edu.system.getList_MauImport("zonebtnCT");
        
        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
            me.getList_HocPhan();
        });
        $("#dropSearch_CoCauToChuc").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#dropSearch_HocPhan").on("select2:select", function () {
            me.getList_LopHocPhan();
        });
        $("#btnSaveChamThi").click(function () {
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                //var arrThem = [];
                //var arrSua = [];
                //var arrXoa = [];
                var x = $("#tblLopHocPhan .chamthi");
                for (var i = 0; i < x.length; i++) {
                    me.save_ChamThi(x[i]);
                }
            });
        });
        $("#btnSearch").click(function () {
            me.getList_LopHocPhan();
        });
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
        var me = main_doc.DuLieuChamThi;
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
                    edu.system.alert(data.Message, "w");
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
                'dToanBo': 1,
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
                    me.genTable_LopHocPhan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
                'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_CoCauToChuc"),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_LopHocPhan: function (data, iPager) {
        var me = this;
        $("#lblLopHocPhan_Tong").html(iPager);
        $("#tblLopHocPhan thead").html(me.strThead);
        var iSoGiangVien = parseInt(edu.util.getValById("txtSearch_SoLuong"));
        for (var i = 0; i < iSoGiangVien; i++) {
            $("#tblLopHocPhan thead tr").eq(0).append('<th class="td-center" colspan="2">Thông tin giảng viên ' + (i + 1) + '</th>');
            $("#tblLopHocPhan thead tr").eq(1).append('<th class="td-center" >Giảng viên</th><th class="td-center">Số bài</th>');
        }

        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.TangThem.getList_TangThem()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOPHOCPHAN"
                },
                {
                    "mData": "PHAMVIAPDUNG_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "SOSINHVIEN"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtNgayCham'+ aData.ID +'" class="form-control input-datepicker" />';
                    }
                }
            ]
        };
        for (var i = 0; i < iSoGiangVien; i++) {
            me.iThuTuChamThi = 0;
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn;
                    return '<div style="width: 200px"><select id="dropGiangVien' + iThuTu + aData.ID + '" class="select-opt"></select></div>';
                }
            },
            {
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<input style="width: 100px" id="txtSoBai' + iThuTu + aData.ID + '" title="' + iThuTu + aData.ID +'"  class="form-control chamthi" />';
                }
            });
        }
        edu.system.loadToTable_data(jsonForm);
        var arr = [];
        for (var i = 0; i < iSoGiangVien; i++) {
            for (var j = 0; j < data.length; j++) {
                arr.push("dropGiangVien" + i + data[j].ID);
            }
        }
        console.log(arr);
        me.genCombo_NhanSu(arr);
        edu.system.pickerdate();
        data.forEach(e => {
            me.getList_KetQua(e.ID);
        });
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
    getList_HeDaoTao: function () {
        var me = main_doc.DuLieuChamThi;
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDSHeDaoTao',
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
            renderPlace: ["dropSearch_CoCauToChuc"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_ThanhVien: function (strNhanSu_Id, strRowID) {
        var me = this;
        var obj_notify;
        //--Edit
        var strId = strRowID;
        if (strRowID.length == 30) strId = "";
        var dataTemp = edu.util.objGetOneDataInData(me.strLopHocPhan_Id, me.dtLopHocPhan, "ID");
        //console.log(dataTemp);
        var obj_save = {
            'action': 'KHCT_DuLieuChamThi_V2/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDangKy_LopHocPhan_Id': me.strLopHocPhan_Id,
            'strDaoTao_HocPhan_Id': dataTemp.IDHOCPHAN,
            'dSoBaiCham': edu.util.getValById('txtSoLuong' + strRowID),
            'strGhiChu': edu.util.getValById('txtGhiChu' + strRowID),
            'strNgayChamThi': edu.util.getValById('txtNgay' + strRowID),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'KHCT_DuLieuChamThi_V2/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_DuLieuChamThi_V2/LayDanhSach',

            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_LopHocPhan_Id': me.strLopHocPhan_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 1000000000,            
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult);
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
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'KHCT_DuLieuChamThi_V2/Xoa',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "' name='" + data[i].NHANSU_HOSOCANBO_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_COCAUTOCHUC_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NHANSU_HOSOCANBO_MASO) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(data[i].NHANSU_HOSOCANBO_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN) + "</span></td>";
            html += '<td><input value="' + edu.util.returnEmpty(data[i].SOLUONG) + '" type="text" id="txtSoLuong' + data[i].ID + '" class="form-control" /></td>';
            html += '<td><input value="' + edu.util.returnEmpty(data[i].NGAYCHAMTHI) + '" type="text" id="txtNgay' + data[i].ID + '" class="form-control input-datepicker" /></td>';
            html += '<td><input value="' + edu.util.returnEmpty(data[i].GHICHU) + '" type="text" id="txtGhiChu' + data[i].ID + '" class="form-control" /></td>';
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
        edu.system.pickerdate();
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        var objNhanSu = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtNhanSu, "ID")
        //3. create html
        var html = "";
        var strRowID = edu.util.uuid().substr(2);
        html += "<tr id='" + strRowID + "' name='" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + edu.util.returnEmpty(objNhanSu.DAOTAO_COCAUTOCHUC_TEN) + "</span></td>";
        html += "<td class='td-left'><span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-left'><span>" + $(".lblLichHoc_HP").html() + "</span></td>";
        html += '<td><input type="text" id="txtSoLuong' + strRowID + '" class="form-control" /></td>';
        html += '<td><input type="text" id="txtNgay' + strRowID + '" class="form-control input-datepicker" /></td>';
        html += '<td><input type="text" id="txtGhiChu' + strRowID + '" class="form-control" /></td>';
        html += "<td class='td-center'><a id='remove_nhansu" + strRowID + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html);
        edu.system.pickerdate();
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },


    getList_HS: function () {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_BoMon");
        var strTinhTrangNhanSu_Id = edu.util.getValById("dropSearch_CapNhat_TinhTrangLamViec");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_CCTC");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_CapNhat_TuKhoa"),
            pageIndex: 1,
            pageSize: 1000000,
            strCoCauToChuc_Id: strCoCauToChuc,
            strTinhTrangNhanSu_Id: strTinhTrangNhanSu_Id,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': 0
        };
        edu.system.getList_NhanSu(obj, "", "", function (data) {
            main_doc.DuLieuChamThi.dtNhanSu = data;
        });
    },

    genCombo_NhanSu: function (arr) {
        var me = main_doc.DuLieuChamThi;
        var obj = {
            data: me.dtNhanSu,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (row, aData) {
                    return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                }
            },
            renderPlace: arr,
            title: "Chọn giảng viên"
        };
        //arr.forEach(e => console.log($("#" + e)));
        edu.system.loadToCombo_data(obj);
        $(".select-opt").select2();
    },


    getList_KetQua: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        var obj_list = {
            'action': 'KHCT_DuLieuChamThi_V2/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    if (dtResult.length > 0) {
                        edu.util.viewValById("txtNgayCham" + strDaoTao_LopHocPhan_Id, dtResult[0].NGAYCHAMTHI);
                        for (var i = 0; i < dtResult.length; i++) {
                            edu.util.viewValById("dropGiangVien" + i + strDaoTao_LopHocPhan_Id, dtResult[i].NHANSU_HOSOCANBO_ID);
                            edu.util.viewValById("txtSoBai" + i + strDaoTao_LopHocPhan_Id, dtResult[i].SOBAICHAM);
                            $("#txtSoBai" + i + strDaoTao_LopHocPhan_Id).attr("name", dtResult[i].ID);
                        }
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

    save_ChamThi: function (point) {
        var me = this;

        var strTemp = $(point).attr("title");
        var strLopHocPhan_Id = strTemp.substring(strTemp.length - 32);
        var obj = me.dtLopHocPhan.find(e => e.ID === strLopHocPhan_Id);

        var obj_save = {
            'action': 'KHCT_DuLieuChamThi_V2/ThemMoi',
            'type': 'POST',
            'strId': $(point).attr("name"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropGiangVien' + strTemp),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': obj.DAOTAO_HOCPHAN_ID,
            'dSoBaiCham': edu.util.getValById('txtSoBai' + strTemp),
            'strDangKy_LopHocPhan_Id': strLopHocPhan_Id,
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNgayChamThi': edu.util.getValById('txtNgayCham' + strLopHocPhan_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            
            if (!obj_save.strNhanSu_HoSoCanBo_Id) me.delete_ChamThi(obj_save.strId); else obj_save.action = 'KHCT_DuLieuChamThi_V2/CapNhat';
        }
        if (!obj_save.strId && !obj_save.strNhanSu_HoSoCanBo_Id) return;

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_ChamThi: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'KHCT_DuLieuChamThi_V2/Xoa',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
};
