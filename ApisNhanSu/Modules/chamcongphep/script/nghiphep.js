/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function NghiPhep() { }
NghiPhep.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu: [],
    dtNghiPhep: [],
    strNghiPhep_Id: '',
    strNhanSu_Id: '',
    arrNhanSu_Id: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnSearchNghiPhep_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSaveNghiPhep").click(function () {
            if (me.strNghiPhep_Id == "") {
                me.save_NghiPhep();
            } else {
                me.update_NghiPhep();
            }
        });
        $("#btnSearch_NghiPhep_NhanSu").click(function () {
            me.getList_NhanSu();
        });
        $("#txtSearch_NghiPhep_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
            }
        });
        $("#tblNghiPhep_NhanSu").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                edu.util.setOne_BgRow(me.strNhanSu_Id, "tblNghiPhep_NhanSu");
                me.toggle_detail();
                me.getDetail_NhanSu(strId);
                me.getList_NghiPhep(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblNghiPhep").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strNghiPhep_Id = strId;
                me.toggle_input();
                $("#zoneDoiTuong").hide();
                me.viewEdit_NghiPhep(edu.util.objGetOneDataInData(strId, me.dtNghiPhep, "ID"));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
       --Discription: [2] Action CoCauToChuc
       --Order: 
       -------------------------------------------*/
        $("#dropSearch_NghiPhep_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        /*------------------------------------------
       --Discription: [3] Action QuyetDinh_ThanhVien input
       --Order: 
       -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_tblNhanSu(strNhanSu_Id);
        });
        $("#tblInput_NghiPhep_NhanSu").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeHTMLoff_tblNhanSu(strNhanSu_Id);
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        edu.util.focus("txtSearch_NghiPhep_TuKhoa");
        me.toggle_notify();
        edu.system.dateYearToCombo("1993", "dropNghiPhep_NamApDung", "Chọn năm áp dụng");
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        me.getList_NhanSu();
        me.getList_CoCauToChuc();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strNghiPhep_Id = "";
        //
        var arrId = ["txtNghiPhep_NgayBatDau", "txtNghiPhep_NgayKetThuc", "txtNghiPhep_SoNgayNghi", "txtNghiPhep_ThamNien", "dropNghiPhep_NamApDung"];
        edu.util.resetValByArrId(arrId);
        //
        $("#ckbNghiPhep_All").prop('checked', false);
        $("#tblInput_NghiPhep_NhanSu tbody").html("");
        me.arrNhanSu_Id = [];
        $("#zoneDoiTuong").show();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneNghiPhep", "zone_detail_NghiPhep");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneNghiPhep", "zone_input_NghiPhep");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneNghiPhep", "zone_notify_NghiPhep");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSoLyLich
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        

        var strCoCauToChuc = edu.util.getValById("dropSearch_NghiPhep_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_NghiPhep_CCTC");
        }

        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_NghiPhep_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_NhanSu);
    },
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML HoSoLyLich
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NhanSu: function (data, iPager) {
        var me = main_doc.NghiPhep;
        me.dtNhanSu = data;
        edu.util.viewHTMLById("lblNghiPhep_NhanSu_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblNghiPhep_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NghiPhep.getList_NhanSu()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnView"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(data.ANH);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span id="lbl' + aData.ID + '">' + edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN)+ "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.NghiPhep;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }

        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_NghiPhep_CCTC"],
            type: "",
            title: "Cơ cấu khoa/viện/phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_NghiPhep_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB NghiPhep
    -------------------------------------------*/
    getList_NghiPhep: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_NghiPhepCaNhan/LayDanhSach',
            

            'strTuKhoa': "",
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtNghiPhep = dtResult;
                    me.genTable_NghiPhep(dtResult);
                }
                else {
                    edu.system.alert("NS_NghiPhepCaNhan/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_NghiPhepCaNhan/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_NghiPhep: function () {
        var me = this;
        var strNhanSu_Ids = "";

        //check all NhanSu or list of NhanSu
        if ($("#ckbNghiPhep_All").is(':checked')) {
            strNhanSu_Ids = "ALL";
        }
        else {
            for (var i = 0; i < me.arrNhanSu_Id.length; i++) {
                //convert to string seprate by #
                if (i < me.arrNhanSu_Id.length - 1) {
                    strNhanSu_Ids += me.arrNhanSu_Id[i] + "#";
                }
                else {
                    strNhanSu_Ids += me.arrNhanSu_Id[i];
                }
            }
        }
        console.log("NhanSuId: " + strNhanSu_Ids);
        //--Edit
        var obj_save = {
            'action': 'NS_NghiPhepCaNhan/ThemMoi',
            

            'strId': "",
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Ids,
            'strNgayBatDau'         : edu.util.getValById("txtNghiPhep_NgayBatDau"),
            'strNgayKetThuc'        : edu.util.getValById("txtNghiPhep_NgayKetThuc"),
            'strNamApDung'          : edu.util.getValById("dropNghiPhep_NamApDung"),
            'dSoNgayDuocNghi'       : edu.util.getValById("txtNghiPhep_SoNgayNghi"),
            'dSoNgayNghiThamNien'   : edu.util.getValById("txtNghiPhep_ThamNien"),
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_NghiPhep();
                }
                else {
                    edu.system.alert("NS_NghiPhepCaNhan/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_NghiPhepCaNhan/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_NghiPhep: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_NghiPhepCaNhan/CapNhat',
            

            'strId': me.strNghiPhep_Id,
            'strNhanSu_HoSoCanBo_Id':  me.strNhanSu_Id,
            'strNgayBatDau': edu.util.getValById("txtNghiPhep_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtNghiPhep_NgayKetThuc"),
            'strNamApDung': edu.util.getValById("dropNghiPhep_NamApDung"),
            'dSoNgayDuocNghi': edu.util.getValById("txtNghiPhep_SoNgayNghi"),
            'dSoNgayNghiThamNien': edu.util.getValById("txtNghiPhep_ThamNien"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.toggle_detail();
                    me.getList_NghiPhep();
                }
                else {
                    edu.system.alert("NS_NghiPhepCaNhan/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_NghiPhepCaNhan/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NghiPhep: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_NghiPhepCaNhan/Xoa',
            

            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NghiPhep();
                }
                else {
                    obj = {
                        content: "NS_NghiPhepCaNhan/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_NghiPhepCaNhan/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [2] GenHTML NghiPhep
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NghiPhep: function (data) {
        var me = this;
        var strNgayBatDau = "";
        var strThoiGian = "";
        var strNgayKetThuc = "";

        var jsonForm = {
            strTable_Id: "tblNghiPhep",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {

                    "mDataProp": "NAMAPDUNG"
                }
                , {
                    "mDataProp": "SONGAYDUOCNGHI"
                }
                , {
                    "mDataProp": "SONGAYNGHITHAMNIEN"
                }
                , {
                    "mDataProp": "SONGAYNGHICONLAI"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a id="' + aData.ID +'" class="btn btn-default btnEdit"><i class="fa fa-edit"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_NhanSu: function (strId) {
        var me = this;
        var dt = [];
        $("#lblNghiPhep_NhanSu").html("");
        var $hoten = "#lbl" + strId;
        var valHoTen = $($hoten).html();
        $("#lblNghiPhep_NhanSu").html(valHoTen);
    },
    viewEdit_NghiPhep: function (data) {
        var me = main_doc.NghiPhep;
        //View - Nguoi nhap"txtNghiPhep_NgayBatDau", "txtNghiPhep_NgayKetThuc", "txtNghiPhep_SoNgayNghi", "txtNghiPhep_ThamNien", "dropNghiPhep_NamApDung"
        edu.util.viewValById("txtNghiPhep_NgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNghiPhep_NgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("txtNghiPhep_SoNgayNghi", data.SONGAYDUOCNGHI);
        edu.util.viewValById("txtNghiPhep_ThamNien", data.SONGAYNGHITHAMNIEN);
        edu.util.viewValById("dropNghiPhep_NamApDung", data.NAMAPDUNG);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML add NhanSu
    --Task: 
    -------------------------------------------*/
    addHTMLinto_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
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
        var $ngaysinh = "#sl_ngaysinh" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valNgaySinh = $($ngaysinh).text();
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valNgaySinh + "</span></td>";
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnRemove poiter'>Bỏ chọn</td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_NghiPhep_NhanSu tbody").append(html);
    },
    removeHTMLoff_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_NghiPhep_NhanSu tbody").html("");
            $("#tblInput_NghiPhep_NhanSu tbody").html('<tr><td colspan="6" class="td-center">Không tìm thấy dữ liệu!</td></tr>');
        }
    }
};