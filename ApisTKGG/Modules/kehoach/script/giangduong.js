/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function GiangDuong() { };
GiangDuong.prototype = {
    dtGiangDuong: [],
    strGiangDuong_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.pageSize_default = 10;
        me.getList_CoCauToChuc();
        me.getList_HS();
        me.getList_ThoiGian();
        me.getList_HeDaoTao();
        //me.getList_GiangDuong();
        $("#dropSearch_DonViThanhVien").on("select2:select", function () {
            me.getList_HS();
        });
        $("#chkSelectAll_GiangDuong").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $("#btnSearch").click(function () {
            me.getList_GiangDuong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_GiangDuong();
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("NS.LGV0", "dropSearch_LoaiGiangVien");

        edu.system.getList_MauImport("zonebtnBaoCao_GiangDuong", function (addKeyValue) {
            addKeyValue("strLoaiGiangVien_Id", edu.util.getValById("dropSearch_LoaiGiangVien"));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValById("dropSearch_ThoiGian"));
            addKeyValue("strDaoTao_CoCauToChuc_Id", edu.util.getValById("dropSearch_DonViThanhVien"));
            addKeyValue("strGiangVien_Id", edu.util.getValById("dropSearch_ThanhVien"));
            addKeyValue("strTuNgay", edu.util.getValById("txtSearch_TuNgay"));
            addKeyValue("strDenNgay", edu.util.getValById("txtSearch_DenNgay"));
            addKeyValue("strDaoTao_HeDaoTao_Id", edu.util.getValById("dropSearch_HeDaoTao"));
        });
        $("#tblGiangDuong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                $('#myModalQuaTrinh').modal('show');
                var obj = me.dtGiangDuong.rsTongHop.find(e => e.GIANGVIEN_ID === strId);
                $(".SinhVienDaChon").html(obj.GIANGVIEN_HOTEN + " - " + obj.GIANGVIEN_MASO);
                me.genTable_QuaTrinh(me.dtGiangDuong.rs.filter(e => e.GIANGVIEN_ID == obj.GIANGVIEN_ID))
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
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
            renderPlace: ["dropSearch_DonViThanhVien"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',


            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
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
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/

    getList_GiangDuong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_GiangDuongTrucTuyen/LayDSLichGiangTheoGiaiDoan',
            'type': 'GET',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strLoaiGiangVien_Id': edu.util.getValById('dropSearch_LoaiGiangVien'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strGiangVien_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGiangDuong = dtReRult;
                    me.genTable_GiangDuong(dtReRult.rsTongHop, data.Pager);
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

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_GiangDuong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGiangDuong",
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "GIANGVIEN_MASO"
                },
                {
                    "mDataProp": "GIANGVIEN_HOTEN"
                },
                {
                    "mDataProp": "TONGSOTIET"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.GIANGVIEN_ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.GIANGVIEN_ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    genTable_QuaTrinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuaTrinh",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "NGAYHOC"
                },
                {
                    "mDataProp": "TIETBATDAU"
                },
                {
                    "mDataProp": "TIETKETTHUC"
                },
                {
                    "mDataProp": "SOTIET"
                },
                {
                    "mDataProp": "GIANGDUONG_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.genCombo_ThoiGian);
    },
    genCombo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_ThoiGian", "dropThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },

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
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
}