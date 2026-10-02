function constant() { }
constant.prototype = {
    lang:'VI',
    init: function () {
        var me = this;
        me.lang = "VI";//get from sytemroot
        try {
            AFG();
        } catch{

        }
    },
    getting: function (parentNode, node) {
        var me = this;
        return constant.setting[parentNode][me.lang][node];
    }
};
constant.setting = {//old name ==>constant.Setting.ModuleSetting
    initsystem: {
        content_placehoder: "#main-content-wrapper",
        page_index: '1',
        page_size: '10',
        page_size_max: '10000000',
        Guid32: 32
    },
    keyName: {
        codeName: 'cmdCode',
        langId: 'strNgonNguId',
        userId: 'strUserId'
    },
    method: {
        POST: "POST",
        GET: "GET",
        DELETE: "DELETE",
        PUT: "PUT",
        CONTENT_TYPE: "application/json; charset=utf-8",
        DATA_TYPE: "json"
    },
    status: {
        ACTIVE: "1",
        STOP: "2",
        DELETE: "3"
    },
    imgLoading: '/App_Themes/CMS/images/twitter_loading.gif',
    EnumImageType: {
        NEWS: '1',
        PRODUCT: '2',
        ACCOUNT: 'Avatar/',
        SUPPORT: '4',
        PROJECT: '5',
        PARTNER: '6',
        INTRODUCE: '7',
        MEMBER: '8',
        SERVICE: '9',
        DOCUMENT: 'Files/',
        STAFF: '11',
        USER: '12',
        TEMPLATE: '13',
        COMMON: '14',
        TEMP: '15',
        SETTING: '16',
        CROWD: '17',
        STAR: '18',
        VIDEO: '19',
        ADV: '20'
    },
    valid: {
        EMPTY   : "EM",
        FLOAT   : "FL",
        INT     : "IN",
        DATE    : "DA",
        EMAIL   : "EM"
    },
    lang_common: {
        TAOMOI: 'CHUNG_TAOMOI',
        TAILAI: 'CHUNG_TAILAI',
        THUNGRAC: 'CHUNG_THUNGRAC',
        XOA: 'CHUNG_XOA'
    },
    ACTION: {
        DELETE  : "DELETE",
        EDIT    : "EDIT",
        ADD     : "ADD",
        VIEW    :"VIEW"
    },
    NOTIFY: {
        VI: {
            CF_DELETE: "Bạn có chắc chắn muốn xóa dữ liệu không?",
            DELETE_S: "Xóa dữ liệu thành công!",
            UPDATE_S: "Cập nhật dữ liệu thành công!",
            CREATE_S: "Thêm mới dữ liệu thành công!",
            PROCESS_S: "Xử lý dữ liệu thành công!",
            SELECT_S: "Chọn dữ liệu thành công!",
            EXISTANCE: "Dữ liệu đã tồn tại!",
            SELECT_F: "Không lấy được dữ liệu cần xóa, vui lòng chọn lại!"
        },
        EN: {
            CF_DELETE: "Are you sure that you want to delete data?",
            DELETE_S: "Delete data successful!",
            UPDATE_S: "Update data successful!",
            CREATE_S: "Create data successful!",
            PROCESS_S: "Process data successful!",
            SELECT_S: "Select data successful!",
            EXISTANCE: "Data is existed!",
            SELECT_F: "Can not select data to delete, Please select again!"
        }
    },
    BUTTON: {
        VI: {
            YES: "Đồng ý",
            NO: "Không đồng ý",
            CLOSE: "Đóng",
            SEARCH: "Tìm kiếm",
            CREATE: "Tạo mới",
            UPDATE: "Cập nhật",
            DELETE: "Xóa",
            EXPAND:"Mở rộng"

        },
        EN: {
            YES: "Yes",
            NO: "No",
            CLOSE: "Close",
            SEARCH: "Search",
            CREATE: "Create",
            UPDATE: "Update",
            DELETE: "Delete",
            EXPAND: "Expand"

        }
    },
    LABLE: {
        VI: {
            CODE_W: "Cảnh báo",
            CODE_I: "Thông báo",
            CODE_H: "Trợ giúp",
            CODE_Q: "Xác nhận",
            OFFLINE: "Không có kết nối, vui lòng kiểm tra đường mạng!",
            ONLINE: "Tín hiệu đường truyền tốt!"
        },
        EN: {
            CODE_W: "Warning",
            CODE_I: "Information",
            CODE_H: "Help",
            CODE_Q: "Confirm",
            OFFLINE: "Disconnected network, Please check network card!",
            ONLINE: "Connected network!"
        }
    },
    CATOR: {
        NS: {
            DMCV: "NS.DMCV", //Danh muc chuc vu
            CVDA: "NS.CVDA", //Chuc vu dang
            CVDV: "NS.CVDV", //Chuc vu doan
            CVCD: "NS.CVCD", //Chuc vu cong doan

            DMHV: "NS.DMHV", //Danh muc hoc vi
            LOCD: "NS.LOCD", //Loai chuc danh
            GITI: "NS.GITI", //Gioi tinh
            DATO: "NS.DATO", //Danh muc dan toc
            TOGI: "NS.TOGI", //Danh muc ton giao
            TTHN: "NS.TTHN", //Tinh trang hon nhan
            TTNS: "NS.TTNS", //Tinh trang nhan su

            QUDI: "NS.QUDI", //Loai quyet dinh
            LTNS: "NS.LTNS", //Loai doi tuong
            LDTL: "NS.LDTL", //Loai doi tuong ap dung DGPL lương tăng thêm (old -LADG)
            LDVN: "NS.LDVN", //Loai doi tuong ap dung DGPL vien chuc va nguoi lao dong
            LHD0: "NS.LHD0", //Loai hop dong
            LNN0: "NS.LNN0", //Loai ngon ngu
            LGV0: "NS.LGV0", //Loai can bo
            LODH : "NS.LODH", //Loai danh hieu

            NHNG: "NS.NHNG", //Nhom ngach
            BALU: "NS.BALU", //Bac luong
            CDNN: "NS.CDNN", //Chuc nanh nghe nghiep
            HACD: "NS.HACD", //Hang chuc danh
            NGLU: "NS.NGLU", //Ngach luong
            LIRP: "NS.LIRP", //Khai Bao mau bao cao cho ung dung
            
            NTCD: "NS.NTCD", //Nhom tieu chi DGPL vien chuc va nguoi lao dong
            PTLT: "NS.PTLT", //Phuong thuc lay thong tin
            XLTL: "NS.XLTL", //Xep loai danh gia
            GDCS: "NS.GDCS", //Gia dinh chinh sach
            TPXT: "NS.TPXT", //Thanh pha xuat than
            TBH0: "NS.TBH0", //Thuong binh hang
            QUHA: "NS.QUHA", //Danh muc quan ham

            NNL0: "NS.NNL0", //Ngay nghi le
            TGLV: "NS.TGLV", //Nhom thoi gian lam viec
            LVTT: "NS.LVTT", //Quy dinh thu lam viec trong tuan
            LKNH: "NS.LKNH", //Lien ket ngan hang
            DTDT: "NS.DTDT", //Doi tuong dao tao
            DHPT: "NS.DHPT", //Danh hieu phong tang
            QHGD: "NS.QHGD", //Quan he gia dinh
            TTKT: "NS.TTKT", //Thanh tich khen thuong
            
            DMNN: "NS.DMNN", //Trinh do ngon ngu
            TDNN: "NS.TDNN", //Trinh do ngon ngu
            TDTH: "NS.TDTH", //Trinh do tin hoc
            TDCT: "NS.TDCT", //Trinh do chinh tri
        },
        NCKH: {
            CAQL: "NCKH.CAQL", //CapQuanLy
            DTQG: "NCKH.DTQG", //DanhMucTapChiQuocGia
            DTQT: "NCKH.DTQT", //DanhMucTapChiQuocTe
            HDCS: "NCKH.HDCS", //HoiDongCoSo
            HDNG: "NCKH.HDNG", //HoiDongNganh
            HDNN: "NCKH.HDNN", //HoiDongNhaNuoc
            LVNC: "NCKH.LVNC", //LinhVucNghienCuu or Nganh or ChuyenNganh
            NGKP: "NCKH.NGKP", //NguonKinhPhi
            PHLS: "NCKH.PHLS", //PhanLoaiSach
            PLDT: "NCKH.PLDT", //PhanLoaiDeTai
            PLGI: "NCKH.PLGT", //PhanLoaiGiaiThuong
            PVHT: "NCKH.PVHT", //PhamViHoiThao
            DTHT: "NCKH.DTHT", //DonViToChucHoiThao
            LTQG: "NCKH.LTQG", //LoaiTapChiQuocGia
            CQXB: "NCKH.CQXB", //CoQuanXuatBan
            DTQG: "NCKH.DTQG", //DanhMucTenTapChiQuocGia
            LTQT: "NCKH.LTQT", //LoaiTapChiQuocTe
            DTQT: "NCKH.DTQT", //DanhMucTenTapChiQuocTe
            TBDT: "NCKH.TBDT", //ThoiGianBaoCaoDeTai
            TTDC: "NCKH.TTDC", //TinhTrangDeCuong
            TTDT: "NCKH.TTDT", //TinhTrangDeTai
            VHSV: "NCKH.VHSV", //VaiTroHuongDanSinhVien
            VNCS: "NCKH.VNCS", //VaiTroHuongDanNghienCuuSinh
            VTDT: "NCKH.VTDT", //VaiTroDeTai
            VTHD: "NCKH.VTHD", //VaiTroHoiDong
            VTHT: "NCKH.VTHT", //VaiTroHoiNghi/HoiThao
            VTQG: "NCKH.VTQG", //VaiTroTapChiQuocGia
            VTQT: "NCKH.VTQT", //VaiTroTapChiQuocTe
            XLDT: "NCKH.XLDT", //XepLoaiDeTai
            VTVS: "NCKH.VTVS" //VaiTroThamGiaVietSach
        },
        HTQT: {
            MDDV:"HTQT.MDDV", //Muc dich den lam viec
        },
        KS: {
            LCH0: "KS.LCH0", // Loai cau hoi
            BCH0: "KS.BCH0", // Bo cau hoi 
            HTDA: "KS.HTDA", // Kieu hien thi dap an tra loi
            YCTL: "KS.YCTL", // Yeu cau tra loi
            LPKS: "KS.LPKS", //Loai phieu khao sat
        },
        KTX: {
            LTN0: "KTX.LTN0", // Loai toa nha
            VTCT: "KTX.VTCT", // Vi tri cau thang
            LP00: "KTX.LP00", // Loai phong
            TCP0: "KTX.TCP0", // Tinh chat phong
            TTP0: "KTX.TTP0", // Tinh trang phong
            ST00: "KTX.ST00", // So tang
            LTB0: "KTX.LTB0", // Loai thiet bi
            TTTB: "KTX.TTTB", // Tinh trang thiet bi
            LKH0: "KTX.LKH0", // Loai ke hoach
            DVT0: "KTX.DVT0", //Don vi tinh
        },
        TC: {
            NKT0: "TC.NKT0", //Nhom khoan thu
        },
        TS: {
            HSX0: "TS.HSX0", //Hang san xuat
        },
        CHUN: {
            CHLU: "CHUN.CHLU",
            DMTT: "CHUN.DMTT", //Tinh thanh
            DVTT: "CHUN.DVTT", //DonViTienTe
        },
        SYS: {
            RP: {
                HSLL: "SYS.RP.HSLL", //Ho so ly lich
                NLTX: "SYS.RP.NLTX", //Nang luong thuong xuyen
                NLTH: "SYS.RP.NLTH", //Nang luong truoc han
                NLVK: "SYS.RP.NLVK", //Nang luong vuot khung
                TCQG: "SYS.RP.TCQG", //Tap chi quoc gia
                TCQT: "SYS.RP.TCQT", //Tap chi quoc te
                GT00: "SYS.RP.GT00", //GiaiThuong
                HDCD: "SYS.RP.HDCD", //Hoi dong chuc danh
                VBSC: "SYS.RP.VBSC", //Van bang sach che
                HDSV: "SYS.RP.HDSV", //Huong dan sinh vien
                SACH: "SYS.RP.SACH", //Sach
                HNHT: "SYS.RP.HNHT", //Hoi nghi hoi thao
                DT00: "SYS.RP.DT00", //Hoi nghi hoi thao
            }
        }
    }
};