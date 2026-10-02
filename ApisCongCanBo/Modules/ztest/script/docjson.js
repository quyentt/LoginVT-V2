function DocJson() { };
DocJson.prototype = {
    init: function () {
        var me = this;
        console.log(12)
        var strJson = {
            "data": {
                "listProfile": [
                    {
                        "code": "PU1804",
                        "academic": "",
                        "degree": "",
                        "name": "Ma Quốc Anh",
                        "gender": "male",
                        "dateOfBirth": "2005-11-21T05:00:00Z",
                        "phone": "0987765134",
                        "email": "anh.maquoc@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud023",
                                "positionId": 144,
                                "positionDetailId": 163,
                                "positionCode": "CV",
                                "positionDetailCode": "CTV",
                                "positionDetailAcronym": "",
                                "isTeachingDepartment": null,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud023",
                        "specializedDepartment": "",
                        "positionId": 144,
                        "positionDetailId": 163,
                        "positionCode": "CV",
                        "positionDetailCode": "CTV",
                        "positionDetailAcronym": "",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU0745",
                        "academic": "",
                        "degree": "ths",
                        "name": "Hoàng Thị Thanh Thúy",
                        "gender": "female",
                        "dateOfBirth": "1999-06-18T00:00:00Z",
                        "phone": "0347799687",
                        "email": "thuy.hoangthithanh@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud025",
                                "positionId": 29,
                                "positionDetailId": 87,
                                "positionCode": "CV",
                                "positionDetailCode": "CBNV-NV",
                                "positionDetailAcronym": "",
                                "isTeachingDepartment": false,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud025",
                        "specializedDepartment": "",
                        "positionId": 29,
                        "positionDetailId": 87,
                        "positionCode": "CV",
                        "positionDetailCode": "CBNV-NV",
                        "positionDetailAcronym": "",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU1953",
                        "academic": "",
                        "degree": "ts",
                        "name": "Nguyễn Thị Thanh Thủy",
                        "gender": "female",
                        "dateOfBirth": "1969-01-18T04:32:50Z",
                        "phone": "0985569688",
                        "email": "",
                        "listProfileDepartment": [
                            {
                                "department": "pud063",
                                "positionId": 30,
                                "positionDetailId": 69,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-TS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": false,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud063",
                        "specializedDepartment": "",
                        "positionId": 30,
                        "positionDetailId": 69,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-TS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "pending"
                    },
                    {
                        "code": "PU1998",
                        "academic": "pgs",
                        "degree": "ts",
                        "name": "Phạm Bá Tuyến",
                        "gender": "male",
                        "dateOfBirth": "1966-02-04T05:00:00Z",
                        "phone": "0902.633.668",
                        "email": "tuyen.phamba@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud058",
                                "positionId": 20,
                                "positionDetailId": 19,
                                "positionCode": "TBM",
                                "positionDetailCode": "GV-QL2",
                                "positionDetailAcronym": "TBM",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud058",
                        "specializedDepartment": "pud058",
                        "positionId": 20,
                        "positionDetailId": 19,
                        "positionCode": "TBM",
                        "positionDetailCode": "GV-QL2",
                        "positionDetailAcronym": "TBM",
                        "specialize": "",
                        "status": "pending"
                    },
                    {
                        "code": "PU2002",
                        "academic": "",
                        "degree": "ths",
                        "name": "FUJINO KENICHI",
                        "gender": "male",
                        "dateOfBirth": "1971-04-15T05:00:00Z",
                        "phone": "09031922344",
                        "email": "fujino.kenichi@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud019",
                                "positionId": 30,
                                "positionDetailId": 70,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-THS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud019",
                        "specializedDepartment": "pud019",
                        "positionId": 30,
                        "positionDetailId": 70,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-THS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU0267",
                        "academic": "",
                        "degree": "ts",
                        "name": "Phan Đức Anh",
                        "gender": "male",
                        "dateOfBirth": "1987-05-03T00:00:00Z",
                        "phone": "0976205418",
                        "email": "anh.phanduc@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud013",
                                "positionId": 17,
                                "positionDetailId": 17,
                                "positionCode": "PTKC2",
                                "positionDetailCode": "GV-QL1",
                                "positionDetailAcronym": "PTK",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud013",
                        "specializedDepartment": "pud013",
                        "positionId": 17,
                        "positionDetailId": 17,
                        "positionCode": "PTKC2",
                        "positionDetailCode": "GV-QL1",
                        "positionDetailAcronym": "PTK",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU1022",
                        "academic": "",
                        "degree": "ths",
                        "name": "Trần Thị Nguyệt Quế",
                        "gender": "female",
                        "dateOfBirth": "1973-12-24T00:00:00Z",
                        "phone": "0936197788",
                        "email": "que.tranthinguyet@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud010",
                                "positionId": 30,
                                "positionDetailId": 70,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-THS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud010",
                        "specializedDepartment": "pud010",
                        "positionId": 30,
                        "positionDetailId": 70,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-THS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU1971",
                        "academic": "",
                        "degree": "ths",
                        "name": "Phùng Thị Thanh Hiền",
                        "gender": "female",
                        "dateOfBirth": "1988-12-15T05:24:14Z",
                        "phone": "0946 601 665",
                        "email": "hien.phungthithanh@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud010",
                                "positionId": 30,
                                "positionDetailId": 70,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-THS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud010",
                        "specializedDepartment": "pud010",
                        "positionId": 30,
                        "positionDetailId": 70,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-THS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU1997",
                        "academic": "",
                        "degree": "ts",
                        "name": "Đỗ Thanh Hương",
                        "gender": "female",
                        "dateOfBirth": "1990-08-07T05:16:34Z",
                        "phone": "0971919890",
                        "email": "huong.dothanh@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud018",
                                "positionId": 30,
                                "positionDetailId": 69,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-TS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud018",
                        "specializedDepartment": "pud018",
                        "positionId": 30,
                        "positionDetailId": 69,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-TS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU1711",
                        "academic": "",
                        "degree": "ths",
                        "name": "Nguyễn Tiến Đạo",
                        "gender": "male",
                        "dateOfBirth": "1990-12-03T05:11:49Z",
                        "phone": "0989318840",
                        "email": "dao.nguyentien@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud073",
                                "positionId": 30,
                                "positionDetailId": 70,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-THS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": false,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud073",
                        "specializedDepartment": "",
                        "positionId": 30,
                        "positionDetailId": 70,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-THS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "abroad"
                    },
                    {
                        "code": "PU1713",
                        "academic": "",
                        "degree": "dh",
                        "name": "Nguyễn Thị Thu Mai",
                        "gender": "female",
                        "dateOfBirth": "2002-08-17T05:00:00Z",
                        "phone": "0346484474",
                        "email": "mai.nguyenthithu@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud016",
                                "positionId": 142,
                                "positionDetailId": 283,
                                "positionCode": "GV-TG",
                                "positionDetailCode": "GV-ĐH",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud016",
                        "specializedDepartment": "pud016",
                        "positionId": 142,
                        "positionDetailId": 283,
                        "positionCode": "GV-TG",
                        "positionDetailCode": "GV-ĐH",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "abroad"
                    },
                    {
                        "code": "PU1816",
                        "academic": "",
                        "degree": "ths",
                        "name": "Nguyễn Thị Bích Ngọc",
                        "gender": "female",
                        "dateOfBirth": "1992-10-07T05:00:00Z",
                        "phone": "0986020868",
                        "email": "ngoc.nguyenthibich2@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud019",
                                "positionId": 30,
                                "positionDetailId": 70,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-THS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud019",
                        "specializedDepartment": "pud019",
                        "positionId": 30,
                        "positionDetailId": 70,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-THS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU1817",
                        "academic": "",
                        "degree": "ths",
                        "name": "Nguyễn Ngọc Hùng",
                        "gender": "male",
                        "dateOfBirth": "1995-05-18T05:00:00Z",
                        "phone": "0982733242",
                        "email": "hung.nguyenngoc@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud078",
                                "positionId": 30,
                                "positionDetailId": 70,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-THS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud078",
                        "specializedDepartment": "pud078",
                        "positionId": 30,
                        "positionDetailId": 70,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-THS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "abroad"
                    },
                    {
                        "code": "PU1761",
                        "academic": "",
                        "degree": "ths",
                        "name": "Nguyễn Mai Hạ",
                        "gender": "female",
                        "dateOfBirth": "1996-06-18T05:00:00Z",
                        "phone": "38 777 5070",
                        "email": "ha.nguyenmai@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud074",
                                "positionId": 30,
                                "positionDetailId": 70,
                                "positionCode": "GV",
                                "positionDetailCode": "GV-THS",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": false,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud074",
                        "specializedDepartment": "",
                        "positionId": 30,
                        "positionDetailId": 70,
                        "positionCode": "GV",
                        "positionDetailCode": "GV-THS",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU0717",
                        "academic": "",
                        "degree": "dh",
                        "name": "Đặng Thị Kiều Lan",
                        "gender": "female",
                        "dateOfBirth": "1995-10-12T00:00:00Z",
                        "phone": "0977077746",
                        "email": "lan.dangthikieu@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "hrm",
                                "positionId": 31,
                                "positionDetailId": 98,
                                "positionCode": "NV",
                                "positionDetailCode": "CBNV-NV",
                                "positionDetailAcronym": "",
                                "isTeachingDepartment": null,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "hrm",
                        "specializedDepartment": "",
                        "positionId": 28,
                        "positionDetailId": 75,
                        "positionCode": "NV",
                        "positionDetailCode": "CBNV-NV",
                        "positionDetailAcronym": "",
                        "specialize": "",
                        "status": "maternityLeave"
                    },
                    {
                        "code": "PU1152",
                        "academic": "",
                        "degree": "ths",
                        "name": "Trương Tạ Hằng Nga",
                        "gender": "female",
                        "dateOfBirth": "1991-12-12T02:26:42Z",
                        "phone": "0932029958",
                        "email": "nga.truongtahang@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud055",
                                "positionId": 31,
                                "positionDetailId": 89,
                                "positionCode": "NV",
                                "positionDetailCode": "CBNV-NV",
                                "positionDetailAcronym": "",
                                "isTeachingDepartment": false,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud055",
                        "specializedDepartment": "",
                        "positionId": 31,
                        "positionDetailId": 89,
                        "positionCode": "NV",
                        "positionDetailCode": "CBNV-NV",
                        "positionDetailAcronym": "",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU1991",
                        "academic": "",
                        "degree": "dh",
                        "name": "Nguyễn Hoàng Anh",
                        "gender": "male",
                        "dateOfBirth": "2003-08-02T05:00:00Z",
                        "phone": "0377713873",
                        "email": "anh.nguyenhoang1@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud078",
                                "positionId": 66,
                                "positionDetailId": 172,
                                "positionCode": "T",
                                "positionDetailCode": "TLNC",
                                "positionDetailAcronym": "",
                                "isTeachingDepartment": null,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud078",
                        "specializedDepartment": "",
                        "positionId": 66,
                        "positionDetailId": 172,
                        "positionCode": "T",
                        "positionDetailCode": "TLNC",
                        "positionDetailAcronym": "",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU0300",
                        "academic": "gs",
                        "degree": "ts",
                        "name": "Vũ Văn Trường",
                        "gender": "male",
                        "dateOfBirth": "1983-06-14T00:00:00Z",
                        "phone": "0915058146",
                        "email": "truong.vuvan@phenikaa-uni.edu.vn",
                        "listProfileDepartment": [
                            {
                                "department": "pud015",
                                "positionId": 11,
                                "positionDetailId": 213,
                                "positionCode": "PTP",
                                "positionDetailCode": "GV-QLPB",
                                "positionDetailAcronym": "",
                                "isTeachingDepartment": true,
                                "isMainDepartment": false
                            },
                            {
                                "department": "pud071",
                                "positionId": 67,
                                "positionDetailId": 213,
                                "positionCode": "TLTG�",
                                "positionDetailCode": "GV-QLPB",
                                "positionDetailAcronym": "",
                                "isTeachingDepartment": null,
                                "isMainDepartment": true
                            },
                            {
                                "department": "pud028",
                                "positionId": 67,
                                "positionDetailId": 303,
                                "positionCode": "TLTG�",
                                "positionDetailCode": "GV-QLPB",
                                "positionDetailAcronym": "",
                                "isTeachingDepartment": false,
                                "isMainDepartment": false
                            }
                        ],
                        "department": "pud015,pud028",
                        "mainDepartment": "pud071",
                        "specializedDepartment": "pud015",
                        "positionId": 67,
                        "positionDetailId": 213,
                        "positionCode": "TLTG�",
                        "positionDetailCode": "GV-QLPB",
                        "positionDetailAcronym": "",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU0893B",
                        "academic": "",
                        "degree": "ths",
                        "name": "Nguyễn Thị Thúy",
                        "gender": "female",
                        "dateOfBirth": "1986-11-15T00:00:00Z",
                        "phone": "0986461636",
                        "email": "",
                        "listProfileDepartment": [
                            {
                                "department": "pud019",
                                "positionId": 33,
                                "positionDetailId": 165,
                                "positionCode": "GV-GD",
                                "positionDetailCode": "GV-GD",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud019",
                        "specializedDepartment": "pud019",
                        "positionId": 33,
                        "positionDetailId": 165,
                        "positionCode": "GV-GD",
                        "positionDetailCode": "GV-GD",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "work"
                    },
                    {
                        "code": "PU1162B",
                        "academic": "pgs",
                        "degree": "ts",
                        "name": "Đường Công Minh",
                        "gender": "male",
                        "dateOfBirth": "1948-12-31T17:00:00Z",
                        "phone": "0914571689",
                        "email": "",
                        "listProfileDepartment": [
                            {
                                "department": "pud053",
                                "positionId": 33,
                                "positionDetailId": 165,
                                "positionCode": "GV-GD",
                                "positionDetailCode": "GV-GD",
                                "positionDetailAcronym": "GV",
                                "isTeachingDepartment": true,
                                "isMainDepartment": true
                            }
                        ],
                        "department": "",
                        "mainDepartment": "pud053",
                        "specializedDepartment": "pud053",
                        "positionId": 33,
                        "positionDetailId": 165,
                        "positionCode": "GV-GD",
                        "positionDetailCode": "GV-GD",
                        "positionDetailAcronym": "GV",
                        "specialize": "",
                        "status": "work"
                    }
                ],
                "listGender": {
                    "": "Không có",
                    "female": "Nữ",
                    "male": "Nam",
                    "other": "Giới tính khác"
                },
                "listDegree": {
                    "": "Không có",
                    "bsck1": "Bác sĩ chuyên khoa 1",
                    "bsck2": "Bác sĩ chuyên khoa 2",
                    "bsnt": "Bác sĩ nội trú",
                    "cd": "Cao đẳng",
                    "dh": "Đại học",
                    "dsck1": "Dược sĩ chuyên khoa 1",
                    "dsck2": "Dược sĩ chuyên khoa II",
                    "gs": "Giáo sư",
                    "gvtg": "Giảng viên trợ giảng",
                    "pgs": "Phó giáo sư",
                    "ptth": "Phổ thông trung học",
                    "tc": "Trung cấp",
                    "ths": "Thạc sĩ",
                    "ts": "Tiến sĩ",
                    "tskh": "Tiến sĩ khoa học"
                },
                "listAcademic": {
                    "": "Không có",
                    "gs": "Giáo sư",
                    "gvc": "Giảng viên chính/Chuyên viên chính",
                    "gvcc": "Giảng viên cao cấp/Chuyên viên cao cấp",
                    "pgs": "Phó giáo sư"
                },
                "listDepartment": [
                    {
                        "name": "Khoa Khoa học máy tính",
                        "code": "pud076",
                        "type": "khoachuyenmon",
                        "email": null
                    },
                    {
                        "name": "Ban dự án",
                        "code": "pud001",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Khoa Du lịch – Khách sạn",
                        "code": "pud010",
                        "type": "khoachuyenmon",
                        "email": "fth@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Tài chính – Kế toán",
                        "code": "pud075",
                        "type": "khoachuyenmon",
                        "email": "ffa@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Kinh tế và Kinh doanh quốc tế",
                        "code": "pud074",
                        "type": "khoachuyenmon",
                        "email": "feib@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Quản trị kinh doanh",
                        "code": "pud073",
                        "type": "khoachuyenmon",
                        "email": "fba@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trường Ngoại ngữ - Khoa học xã hội Phenikaa",
                        "code": "pud083",
                        "type": "khoachuyenmon",
                        "email": "pfs@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trường Y - Dược Phenikaa",
                        "code": "pud079",
                        "type": "khoachuyenmon",
                        "email": "psmp@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trường Công nghệ Thông tin Phenikaa",
                        "code": "pud081",
                        "type": "khoachuyenmon",
                        "email": " psc@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Văn phòng Trường - Trường Công nghệ thông tin Phenikaa",
                        "code": "pud086",
                        "type": "phongbanchucnang",
                        "email": "office.psc@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Văn phòng Trường - Trường Kinh tế Phenikaa",
                        "code": "pud085",
                        "type": "phongbanchucnang",
                        "email": "pseb@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Văn phòng Trường - Trường Kỹ thuật Phenikaa",
                        "code": "pud084",
                        "type": "phongbanchucnang",
                        "email": "pse@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Văn phòng Trường - Trường Y-Dược Phenikaa",
                        "code": "pud087",
                        "type": "phongbanchucnang",
                        "email": "opsmp@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm Nghiên cứu Công nghệ Tế bào và Y học tái tạo Phenikaa",
                        "code": "pud089",
                        "type": "khoachuyenmon",
                        "email": null
                    },
                    {
                        "name": "Văn phòng Trường - Trường NN-KHXH Phenikaa",
                        "code": "pud088",
                        "type": "phongbanchucnang",
                        "email": "pfsoffice@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm Ngoại ngữ, Tin học & Kỹ năng Phenikaa",
                        "code": "pud038",
                        "type": "phongbanchucnang",
                        "email": "ttnnkn@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm Nghiên cứu ứng dụng Y sinh",
                        "code": "pud062",
                        "type": "phongbanchucnang",
                        "email": "abmc@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm đào tạo và cung cấp dịch vụ theo nhu cầu xã hội",
                        "code": "pud060",
                        "type": "phongbanchucnang",
                        "email": "ppec@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Hội đồng trường",
                        "code": "pud004",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Ban Lãnh đạo",
                        "code": "pud002",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Ban điều hành",
                        "code": "pud047",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Trường Kinh tế Phenikaa",
                        "code": "pud082",
                        "type": "khoachuyenmon",
                        "email": null
                    },
                    {
                        "name": "Trường Kỹ thuật Phenikaa",
                        "code": "pud080",
                        "type": "khoachuyenmon",
                        "email": null
                    },
                    {
                        "name": "Trung tâm mô phỏng Y khoa",
                        "code": "pud065",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Khoa Y tế công cộng",
                        "code": "pud067",
                        "type": "khoachuyenmon",
                        "email": "fph@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Y học cổ truyền",
                        "code": "pud058",
                        "type": "khoachuyenmon",
                        "email": "ftme@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Y",
                        "code": "pud022",
                        "type": "khoachuyenmon",
                        "email": "fmed@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Trí tuệ nhân tạo và Khoa học dữ liệu",
                        "code": "pud078",
                        "type": "khoachuyenmon",
                        "email": null
                    },
                    {
                        "name": "Khoa Răng Hàm Mặt",
                        "code": "pud056",
                        "type": "khoachuyenmon",
                        "email": "dent@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Kỹ thuật Y học",
                        "code": "pud016",
                        "type": "khoachuyenmon",
                        "email": "mt@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Khoa học Y sinh",
                        "code": "pud051",
                        "type": "khoachuyenmon",
                        "email": "bms@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Hệ thống thông tin",
                        "code": "pud077",
                        "type": "khoachuyenmon",
                        "email": null
                    },
                    {
                        "name": "Khoa Điều dưỡng",
                        "code": "pud009",
                        "type": "khoachuyenmon",
                        "email": "fn@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Dược",
                        "code": "pud011",
                        "type": "khoachuyenmon",
                        "email": "fp@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Công nghệ Thông tin",
                        "code": "pud007",
                        "type": "khoachuyenmon",
                        "email": "cs@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Ngôn ngữ Trung Quốc",
                        "code": "pud021",
                        "type": "khoachuyenmon",
                        "email": "fcl@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Ngôn ngữ Pháp",
                        "code": "pud053",
                        "type": "khoachuyenmon",
                        "email": "ffl@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Ngôn ngữ Nhật Bản",
                        "code": "pud019",
                        "type": "khoachuyenmon",
                        "email": "fjl@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Ngôn ngữ Hàn Quốc",
                        "code": "pud018",
                        "type": "khoachuyenmon",
                        "email": "fkl@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Ngôn ngữ Anh",
                        "code": "pud017",
                        "type": "khoachuyenmon",
                        "email": "fl@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Luật",
                        "code": "pud072",
                        "type": "khoachuyenmon",
                        "email": null
                    },
                    {
                        "name": "Phòng Tài chính kế toán",
                        "code": "pud029",
                        "type": "phongbanchucnang",
                        "email": "tckt@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Quản trị thiết bị",
                        "code": "pud069",
                        "type": "phongbanchucnang",
                        "email": "qttb@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Tuyển sinh và Truyền thông",
                        "code": "pud033",
                        "type": "phongbanchucnang",
                        "email": "truyenthong@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm Tư vấn, Hỗ trợ và Đổi mới sáng tạo sinh viên",
                        "code": "pud061",
                        "type": "phongbanchucnang",
                        "email": "htsv@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Pháp chế",
                        "code": "pud054",
                        "type": "phongbanchucnang",
                        "email": "phapche@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Ban Thư ký - Trợ lý Tổng Giám đốc",
                        "code": "pud071",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Khoa Điện - Điện tử",
                        "code": "pud008",
                        "type": "khoachuyenmon",
                        "email": "eee@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Công đoàn trường",
                        "code": "pud057",
                        "type": "tochucbannganh",
                        "email": null
                    },
                    {
                        "name": "Phòng Tổ chức Nhân sự",
                        "code": "hrm",
                        "type": "phongbanchucnang",
                        "email": "tcns@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Ban Quản lý tài sản",
                        "code": "pud003",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Văn phòng Đảng Đoàn",
                        "code": "pud070",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Viện Nghiên cứu Tiên tiến Phenikaa",
                        "code": "pud043",
                        "type": "viennghiencuu",
                        "email": "office@pias.edu.vn"
                    },
                    {
                        "name": "Trung tâm Đào tạo và Khảo thí tiếng Trung Quốc",
                        "code": "pud059",
                        "type": "phongbanchucnang",
                        "email": "clct@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Hành chính tổng hợp",
                        "code": "pud068",
                        "type": "phongbanchucnang",
                        "email": "hcth@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm đào tạo thiết kế vi mạch bán dẫn",
                        "code": "pud064",
                        "type": "phongbanchucnang",
                        "email": "pstc@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Công nghệ số liên ngành ",
                        "code": "pud063",
                        "type": "khoachuyenmon",
                        "email": "fidt@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Đông Phương Học",
                        "code": "pud046",
                        "type": "khoachuyenmon",
                        "email": "fos@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm Dịch Vụ",
                        "code": "pud044",
                        "type": "phongbanchucnang",
                        "email": "ttdv@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Thanh Tra",
                        "code": "pud055",
                        "type": "phongbanchucnang",
                        "email": "thanhtra@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Đoàn Thanh Niên",
                        "code": "pud048",
                        "type": "phongbanchucnang",
                        "email": "doanthanhnien@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Kinh tế và Kinh doanh",
                        "code": "pud014",
                        "type": "khoachuyenmon",
                        "email": "fbe@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Kỹ thuật Ô tô và Năng lượng",
                        "code": "pud015",
                        "type": "khoachuyenmon",
                        "email": "vee@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm nghiên cứu nguồn gen",
                        "code": "pud036",
                        "type": "viennghiencuu",
                        "email": "brc@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm nghiên cứu Xã hội liên ngành",
                        "code": "pud037",
                        "type": "viennghiencuu",
                        "email": "isr@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Khoa học và Kỹ Thuật Vật liệu",
                        "code": "pud013",
                        "type": "khoachuyenmon",
                        "email": "mse@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Khoa học cơ bản",
                        "code": "pud012",
                        "type": "khoachuyenmon",
                        "email": "fs@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Công nghệ sinh học, Hóa học và Kỹ thuật Môi trường",
                        "code": "pud006",
                        "type": "khoachuyenmon",
                        "email": "bcee@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Viện Nghiên cứu Nano",
                        "code": "pud042",
                        "type": "viennghiencuu",
                        "email": "phena@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Tiểu ban Kiểm toán Nội bộ",
                        "code": "pud049",
                        "type": "phongbanchucnang",
                        "email": null
                    },
                    {
                        "name": "Phòng Đảm bảo chất lượng và khảo thí",
                        "code": "pud024",
                        "type": "phongbanchucnang",
                        "email": "dbcl@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Công tác sinh viên",
                        "code": "pud023",
                        "type": "phongbanchucnang",
                        "email": "ctsv@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Khoa học Công nghệ",
                        "code": "pud028",
                        "type": "phongbanchucnang",
                        "email": "khcn@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Viện Đào tạo quốc tế",
                        "code": "pud040",
                        "type": "viendaotao",
                        "email": "sie@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm thông tin thư viện",
                        "code": "pud039",
                        "type": "phongbanchucnang",
                        "email": "library@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Trung tâm Công nghệ thông tin",
                        "code": "pud035",
                        "type": "phongbanchucnang",
                        "email": "itc@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Khoa Cơ khí - Cơ điện tử",
                        "code": "pud005",
                        "type": "khoachuyenmon",
                        "email": "mem@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Hành chính - Quản trị - Thiết bị",
                        "code": "pud026",
                        "type": "phongbanchucnang",
                        "email": "hcqt@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng Hợp tác Đối ngoại",
                        "code": "pud027",
                        "type": "phongbanchucnang",
                        "email": "htdn@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Viện Đào tạo sau Đại học",
                        "code": "pud041",
                        "type": "viendaotao",
                        "email": "graduate@phenikaa-uni.edu.vn"
                    },
                    {
                        "name": "Phòng đào tạo",
                        "code": "pud025",
                        "type": "phongbanchucnang",
                        "email": "dtqlsv@phenikaa-uni.edu.vn"
                    }
                ],
                "listPosition": [
                    {
                        "name": "Trưởng Lab",
                        "code": "TL",
                        "id": 0
                    },
                    {
                        "name": "Phó Trưởng Khoa cấp 1",
                        "code": "PTKC1",
                        "id": 0
                    },
                    {
                        "name": "Phó Trưởng Khoa cấp 2",
                        "code": "PTKC2",
                        "id": 0
                    },
                    {
                        "name": "Giảng viên - Ghi Danh",
                        "code": "GV-GD",
                        "id": 0
                    },
                    {
                        "name": "Phó GĐ Trung tâm 1",
                        "code": "PGDTT",
                        "id": 0
                    },
                    {
                        "name": "Phó Giám đốc Trung tâm",
                        "code": "PG�TT",
                        "id": 0
                    },
                    {
                        "name": "Phó Chánh Văn phòng Trường",
                        "code": "PCVPT",
                        "id": 0
                    },
                    {
                        "name": "Chánh Văn phòng Trường",
                        "code": "CVPT",
                        "id": 0
                    },
                    {
                        "name": "Trợ lý Hiệu trưởng",
                        "code": "TLHT",
                        "id": 0
                    },
                    {
                        "name": "Trợ lý Hiệu trưởng",
                        "code": "TLHT",
                        "id": 0
                    },
                    {
                        "name": "Phó Hiệu trưởng Trường thuộc",
                        "code": "PHTTT",
                        "id": 0
                    },
                    {
                        "name": "Hiệu trưởng Trường thuộc",
                        "code": "HTTT",
                        "id": 0
                    },
                    {
                        "name": "Giám đốc Trung tâm",
                        "code": "GDTT",
                        "id": 0
                    },
                    {
                        "name": "Trưởng nhóm NC Tiềm năng",
                        "code": "TNNTN",
                        "id": 0
                    },
                    {
                        "name": "Trưởng nhóm NC mạnh",
                        "code": "TNNCM",
                        "id": 0
                    },
                    {
                        "name": "Chuyên gia cao cấp",
                        "code": "CGCC",
                        "id": 0
                    },
                    {
                        "name": "Phụ trách Bộ môn",
                        "code": "PTBM",
                        "id": 0
                    },
                    {
                        "name": "Phó GĐ Trung tâm nghiên cứu",
                        "code": "PGTTNC",
                        "id": 0
                    },
                    {
                        "name": "Trợ lý Tổng giám đốc",
                        "code": "TLTG�",
                        "id": 0
                    },
                    {
                        "name": "Ban chỉ đạo Khoa Luật",
                        "code": "BC�",
                        "id": 0
                    },
                    {
                        "name": "Chánh văn phòng Đảng Đoàn",
                        "code": "CVP��",
                        "id": 0
                    },
                    {
                        "name": "Phó trưởng phòng",
                        "code": "PTP",
                        "id": 0
                    },
                    {
                        "name": "Trưởng phòng",
                        "code": "TP",
                        "id": 0
                    },
                    {
                        "name": "Phó Hiệu trưởng",
                        "code": "PHT",
                        "id": 0
                    },
                    {
                        "name": "Bí thư Đoàn chuyên trách",
                        "code": "BT�CT",
                        "id": 0
                    },
                    {
                        "name": "Chuyên viên chính",
                        "code": "CVC",
                        "id": 0
                    },
                    {
                        "name": "Giảng viên",
                        "code": "GV",
                        "id": 0
                    },
                    {
                        "name": "Chủ tịch Hội đồng Trường",
                        "code": "CTHDT",
                        "id": 0
                    },
                    {
                        "name": "Nhân viên - Ghi danh",
                        "code": "NV-GD",
                        "id": 0
                    },
                    {
                        "name": "Quyền Trưởng Khoa",
                        "code": "QTK",
                        "id": 0
                    },
                    {
                        "name": "Quyền Trưởng Phòng",
                        "code": "QTP",
                        "id": 0
                    },
                    {
                        "name": "Giảng viên - Thỉnh giảng",
                        "code": "GV-TG",
                        "id": 0
                    },
                    {
                        "name": "Giám đốc TTNC",
                        "code": "GDTTNC",
                        "id": 0
                    },
                    {
                        "name": "Kế toán trưởng",
                        "code": "KTT",
                        "id": 0
                    },
                    {
                        "name": "Trưởng phòng TN Trọng điểm",
                        "code": "TNNCTN",
                        "id": 0
                    },
                    {
                        "name": "Phó Giám đốc CTĐT",
                        "code": "PGDCTDT",
                        "id": 0
                    },
                    {
                        "name": "Quyền Giám đốc Trung tâm",
                        "code": "QGDTT",
                        "id": 0
                    },
                    {
                        "name": "Giám đốc Tài chính",
                        "code": "GDTC",
                        "id": 0
                    },
                    {
                        "name": "Giảng viên - Trợ giảng",
                        "code": "GV-TG",
                        "id": 0
                    },
                    {
                        "name": "Trưởng Bộ môn",
                        "code": "TBM",
                        "id": 0
                    },
                    {
                        "name": "Phó Trưởng Bộ môn",
                        "code": "PTBM",
                        "id": 0
                    },
                    {
                        "name": "CTV/Khoán việc",
                        "code": "CV",
                        "id": 0
                    },
                    {
                        "name": "Kỹ thuật viên- Trợ giảng",
                        "code": "KTVTG",
                        "id": 0
                    },
                    {
                        "name": "Nhân viên pha chế",
                        "code": "NVPC",
                        "id": 0
                    },
                    {
                        "name": "Nhân viên cấp 4",
                        "code": "NVC4",
                        "id": 0
                    },
                    {
                        "name": "Nhân viên cấp 3",
                        "code": "NVC3",
                        "id": 0
                    },
                    {
                        "name": "Tạp vụ",
                        "code": "TV",
                        "id": 0
                    },
                    {
                        "name": "TLNC/NCS/Postdoc",
                        "code": "T",
                        "id": 0
                    },
                    {
                        "name": "Chuyên viên",
                        "code": "CV",
                        "id": 0
                    },
                    {
                        "name": "Trưởng nhóm",
                        "code": "TN",
                        "id": 0
                    },
                    {
                        "name": "Trưởng Xưởng thực hành",
                        "code": "TXTH",
                        "id": 0
                    },
                    {
                        "name": "Trưởng Lab trọng điểm",
                        "code": "TLT�",
                        "id": 0
                    },
                    {
                        "name": "Giám đốc CTĐT",
                        "code": "GDCTDT",
                        "id": 0
                    },
                    {
                        "name": "Phó Viện trưởng",
                        "code": "PVT",
                        "id": 0
                    },
                    {
                        "name": "Viện Trưởng",
                        "code": "VT",
                        "id": 0
                    },
                    {
                        "name": "Trưởng khoa cấp 2",
                        "code": "TKC2",
                        "id": 0
                    },
                    {
                        "name": "Trưởng khoa cấp 1",
                        "code": "TKC1",
                        "id": 0
                    },
                    {
                        "name": "Phó Chủ tịch HĐT",
                        "code": "PCTHDT",
                        "id": 0
                    },
                    {
                        "name": "Hiệu Trưởng",
                        "code": "HT",
                        "id": 0
                    },
                    {
                        "name": "Phó Tổng Giám đốc",
                        "code": "PTGD",
                        "id": 0
                    },
                    {
                        "name": "Tổng Giám đốc",
                        "code": "TGD",
                        "id": 0
                    },
                    {
                        "name": "Cán sự",
                        "code": "CS",
                        "id": 0
                    },
                    {
                        "name": "Nghiên cứu viên",
                        "code": "NCV",
                        "id": 0
                    },
                    {
                        "name": "Nhân viên nấu ăn",
                        "code": "NVNA",
                        "id": 0
                    },
                    {
                        "name": "Chuyên viên cao cấp",
                        "code": "CVCC",
                        "id": 0
                    },
                    {
                        "name": "Kỹ thuật viên Khoa Viện",
                        "code": "KTV",
                        "id": 0
                    },
                    {
                        "name": "Nhân viên",
                        "code": "NV",
                        "id": 0
                    },
                    {
                        "name": "Tổ trưởng tổ môn",
                        "code": "TTTM",
                        "id": 0
                    },
                    {
                        "name": "Phó GĐ TT ISR - TT cấp 3",
                        "code": "PGDTTISR",
                        "id": 0
                    },
                    {
                        "name": "Thành viên HĐT",
                        "code": "TVHDT",
                        "id": 0
                    },
                    {
                        "name": "Nghiên cứu sinh",
                        "code": "NCV",
                        "id": 0
                    }
                ],
                "listPositionDetail": [
                    {
                        "name": "Phó Giám đốc Trung tâm",
                        "code": "GV-QLPB",
                        "id": 325
                    },
                    {
                        "name": "Nhân viên đổi mới sáng tạo",
                        "code": "CBNV-NV",
                        "id": 329
                    },
                    {
                        "name": "Trưởng nhóm NC Tiềm năng",
                        "code": "GV-QL2",
                        "id": 328
                    },
                    {
                        "name": "Giám đốc trung tâm",
                        "code": "GV-QLPB",
                        "id": 327
                    },
                    {
                        "name": "Trưởng nhóm NC mạnh",
                        "code": "GV-QL2",
                        "id": 302
                    },
                    {
                        "name": "Chánh Văn phòng Trường",
                        "code": "GV-QLPB",
                        "id": 324
                    },
                    {
                        "name": "Phó Chánh Văn phòng Trường",
                        "code": "GV-QLPB",
                        "id": 323
                    },
                    {
                        "name": "Kế toán trưởng",
                        "code": "CBNV-QL",
                        "id": 6
                    },
                    {
                        "name": "Chuyên gia cao cấp",
                        "code": "CBNV-GV",
                        "id": 326
                    },
                    {
                        "name": "Chuyên viên cao cấp",
                        "code": "CBNV-NV",
                        "id": 73
                    },
                    {
                        "name": "Phó Hiệu trưởng Trường thuộc",
                        "code": "LĐ-GV",
                        "id": 322
                    },
                    {
                        "name": "Ban chỉ đạo Khoa Luật",
                        "code": "GV-QL1",
                        "id": 317
                    },
                    {
                        "name": "Nhân viên lái xe",
                        "code": "CBNV-NV",
                        "id": 151
                    },
                    {
                        "name": "Hiệu trưởng Trường thuộc",
                        "code": "LĐ-GV",
                        "id": 320
                    },
                    {
                        "name": "Trợ lý Hiệu trưởng",
                        "code": "GV-QL1",
                        "id": 321
                    },
                    {
                        "name": "Nhân viên quản trị TS-TB",
                        "code": "CBNV-NV",
                        "id": 132
                    },
                    {
                        "name": "Nhân viên HCQT",
                        "code": "CBNV-NV",
                        "id": 131
                    },
                    {
                        "name": "Nhân viên Quản lý giảng đường",
                        "code": "CBNV-NV",
                        "id": 148
                    },
                    {
                        "name": "Nhân viên Hoạch định",
                        "code": "CBNV-NV",
                        "id": 99
                    },
                    {
                        "name": "Phó GĐ Trung tâm nghiên cứu",
                        "code": "GV-QL1",
                        "id": 319
                    },
                    {
                        "name": "Nhân viên An toàn",
                        "code": "CBNV-NV",
                        "id": 318
                    },
                    {
                        "name": "Trợ lý Tổng Giám đốc",
                        "code": "GV-QLPB",
                        "id": 213
                    },
                    {
                        "name": "Kỹ sư trưởng",
                        "code": "CBNV-NV",
                        "id": 288
                    },
                    {
                        "name": "Kỹ sư phát triển phần mềm ứng dụng",
                        "code": "CBNV-NV",
                        "id": 97
                    },
                    {
                        "name": "Nhân viên lễ tân phục vụ",
                        "code": "CBNV-NV",
                        "id": 152
                    },
                    {
                        "name": "Nhân viên Văn thư lưu trữ",
                        "code": "CBNV-NV",
                        "id": 145
                    },
                    {
                        "name": "Phó TP P. Quản trị thiết bị",
                        "code": "CBNV-QL",
                        "id": 316
                    },
                    {
                        "name": "Nhân viên Quan hệ lao động",
                        "code": "CBNV-NV",
                        "id": 127
                    },
                    {
                        "name": "Program Assistant/Nhân viên hỗ trợ",
                        "code": "CBNV-NV",
                        "id": 133
                    },
                    {
                        "name": "Chánh Văn phòng Đảng Đoàn",
                        "code": "GV-QLPB",
                        "id": 315
                    },
                    {
                        "name": "Trưởng phòng P Hành chính tổng hợp ",
                        "code": "CBNV-QL",
                        "id": 313
                    },
                    {
                        "name": "Trưởng phòng P. Quản trị Thiết bị",
                        "code": "CBNV-QL",
                        "id": 314
                    },
                    {
                        "name": "Chuyên viên chính",
                        "code": "CBNV-NV",
                        "id": 74
                    },
                    {
                        "name": "Nhân viên hợp tác Doanh nghiệp",
                        "code": "CBNV-NV",
                        "id": 93
                    },
                    {
                        "name": "Phó giám đốc TT tư vấn và hỗ trợ SV",
                        "code": "CBNV-QL",
                        "id": 309
                    },
                    {
                        "name": "Nhân viên thiết kế",
                        "code": "CBNV-NV",
                        "id": 129
                    },
                    {
                        "name": "Trưởng ca kỹ thuật",
                        "code": "CBNV-NV",
                        "id": 285
                    },
                    {
                        "name": "Phó GĐ trung tâm ĐT & KT tiếng Trung Quốc",
                        "code": "GV-QL1",
                        "id": 312
                    },
                    {
                        "name": "Kế toán viên",
                        "code": "CBNV-NV",
                        "id": 290
                    },
                    {
                        "name": "Nhân viên Truyền thông",
                        "code": "CBNV-NV",
                        "id": 100
                    },
                    {
                        "name": "Nhân viên hành chính - điều phối DA truyền thông",
                        "code": "CBNV-NV",
                        "id": 297
                    },
                    {
                        "name": "Giám đốc TT đào tạo thiết kế vi mạch bán dẫn",
                        "code": "GV-QL1",
                        "id": 311
                    },
                    {
                        "name": "Nhân viên xếp hạng quốc tế",
                        "code": "CBNV-NV",
                        "id": 94
                    },
                    {
                        "name": "Nhân viên pháp chế",
                        "code": "CBNV-NV",
                        "id": 90
                    },
                    {
                        "name": "Phó Giám đốc Trung tâm ISR",
                        "code": "CBNV-QL",
                        "id": 18
                    },
                    {
                        "name": "Giảng viên cao cấp",
                        "code": "GV-GS",
                        "id": 66
                    },
                    {
                        "name": "Chuyên viên quản lý hồ sơ sinh viên",
                        "code": "CBNV-NV",
                        "id": 284
                    },
                    {
                        "name": "Phó GĐ TT CNTT",
                        "code": "GV-QLPB",
                        "id": 59
                    },
                    {
                        "name": "Nhân viên PR báo chí",
                        "code": "CBNV-NV",
                        "id": 101
                    },
                    {
                        "name": "Phó Phòng P. Đảm bảo chất lượng và khảo thí 1",
                        "code": "CBNV-QL",
                        "id": 310
                    },
                    {
                        "name": "Phó phòng P. Đảm bảo chất lượng và khảo thí",
                        "code": "GV-QLPB",
                        "id": 52
                    },
                    {
                        "name": "Thủ quỹ",
                        "code": "CBNV-NV",
                        "id": 289
                    },
                    {
                        "name": "Chuyên viên lập kế hoạch",
                        "code": "CBNV-NV",
                        "id": 83
                    },
                    {
                        "name": "Nhân viên khảo thí",
                        "code": "CBNV-NV",
                        "id": 109
                    },
                    {
                        "name": "Chuyên viên Marketing Truyền thông",
                        "code": "CBNV-NV",
                        "id": 96
                    },
                    {
                        "name": "Trưởng nhóm các phòng ban",
                        "code": "CBNV-NV",
                        "id": 75
                    },
                    {
                        "name": "Nhân viên Đào tạo Phát triển",
                        "code": "CBNV-NV",
                        "id": 128
                    },
                    {
                        "name": "Nhân viên Tiền lương, Phúc lợi",
                        "code": "CBNV-NV",
                        "id": 126
                    },
                    {
                        "name": "Kỹ thuật viên Khoa Viện",
                        "code": "CBNV-NV",
                        "id": 78
                    },
                    {
                        "name": "Kế toán quản trị",
                        "code": "CBNV-NV",
                        "id": 291
                    },
                    {
                        "name": "Nhân viên Hợp tác doanh nghiệp - P.CTSV",
                        "code": "CBNV-NV",
                        "id": 107
                    },
                    {
                        "name": "Nghiên cứu viên",
                        "code": "NCV",
                        "id": 72
                    },
                    {
                        "name": "Nhân viên y tế",
                        "code": "CBNV-NV",
                        "id": 146
                    },
                    {
                        "name": "Chuyên viên quản lý đề tài dự án ngân sách - P.KHCN",
                        "code": "CBNV-NV",
                        "id": 113
                    },
                    {
                        "name": "Nhân viên tư vấn tuyển sinh",
                        "code": "CBNV-NV",
                        "id": 88
                    },
                    {
                        "name": "Bếp trưởng",
                        "code": "CBNV-NV",
                        "id": 155
                    },
                    {
                        "name": "Nhân viên thư viện",
                        "code": "CBNV-NV",
                        "id": 134
                    },
                    {
                        "name": "Nhân viên - Ghi danh",
                        "code": "CBNV-NV",
                        "id": 308
                    },
                    {
                        "name": "Quyền Trưởng Phòng",
                        "code": "CBNV-QL",
                        "id": 307
                    },
                    {
                        "name": "Quyền Trưởng Khoa",
                        "code": "GV-QL1",
                        "id": 306
                    },
                    {
                        "name": "Nhân viên Dự án - P.HTĐN",
                        "code": "CBNV-NV",
                        "id": 121
                    },
                    {
                        "name": "Giảng viên - Thỉnh giảng",
                        "code": "GV-TG",
                        "id": 305
                    },
                    {
                        "name": "Trưởng phòng P. KN&PVCĐ",
                        "code": "CBNV-QL",
                        "id": 42
                    },
                    {
                        "name": "Nhân viên Kinh doanh dịch vụ",
                        "code": "CBNV-NV",
                        "id": 118
                    },
                    {
                        "name": "Cán bộ Đoàn chuyên trách",
                        "code": "CBNV-NV",
                        "id": 299
                    },
                    {
                        "name": "Nhân viên kiểm toán nội bộ",
                        "code": "CBNV-NV",
                        "id": 91
                    },
                    {
                        "name": "Nhân viên Quản lý lớp chuyên nghiệp",
                        "code": "CBNV-NV",
                        "id": 181
                    },
                    {
                        "name": "Nhân viên phát triển nội dung video",
                        "code": "CBNV-NV",
                        "id": 105
                    },
                    {
                        "name": "Nhân viên Khảo sát, Phân tích và Đối sánh",
                        "code": "CBNV-NV",
                        "id": 112
                    },
                    {
                        "name": "Chuyên viên Phát triển Chương trình",
                        "code": "CBNV-NV",
                        "id": 106
                    },
                    {
                        "name": "Nhân viên Tham vấn học đường",
                        "code": "CBNV-NV",
                        "id": 117
                    },
                    {
                        "name": "Nhân viên phát triển chương trình",
                        "code": "CBNV-NV",
                        "id": 114
                    },
                    {
                        "name": "Chủ tịch Hội đồng Trường",
                        "code": "LĐ-GV",
                        "id": 162
                    },
                    {
                        "name": "Nhân viên hỗ trợ dịch vụ máy tính (IT-Help desk)",
                        "code": "CBNV-NV",
                        "id": 123
                    },
                    {
                        "name": "CTV/Khoán việc",
                        "code": "CTV",
                        "id": 163
                    },
                    {
                        "name": "Chuyên viên",
                        "code": "CBNV-NV",
                        "id": 76
                    },
                    {
                        "name": "Nhân viên Hỗ trợ hành chính 1 cửa - P. CTSV",
                        "code": "CBNV-NV",
                        "id": 115
                    },
                    {
                        "name": "Nhân viên - P.TCKT",
                        "code": "CBNV-NV",
                        "id": 125
                    },
                    {
                        "name": "Nhân viên",
                        "code": "CBNV-NV",
                        "id": 77
                    },
                    {
                        "name": "Nhân viên Phát triển kỹ năng sinh viên - P.CTSV",
                        "code": "CBNV-NV",
                        "id": 116
                    },
                    {
                        "name": "Cán sự",
                        "code": "CBNV-NV",
                        "id": 79
                    },
                    {
                        "name": "Nhân viên Bar",
                        "code": "CBNV-NV",
                        "id": 167
                    },
                    {
                        "name": "Nhân viên Tự đánh giá",
                        "code": "CBNV-NV",
                        "id": 111
                    },
                    {
                        "name": "Giảng viên - Thạc sĩ",
                        "code": "GV-THS",
                        "id": 70
                    },
                    {
                        "name": "Nhân viên đảm bảo chất lượng",
                        "code": "CBNV-NV",
                        "id": 110
                    },
                    {
                        "name": "Nhân viên thanh tra",
                        "code": "CBNV-NV",
                        "id": 89
                    },
                    {
                        "name": "Phó GĐ Ban Dự án xây dựng",
                        "code": "CBNV-QL",
                        "id": 65
                    },
                    {
                        "name": "Nhân viên phân tích dữ liệu",
                        "code": "CBNV-NV",
                        "id": 95
                    },
                    {
                        "name": "Chuyên viên 1",
                        "code": "CBNV-NV",
                        "id": 86
                    },
                    {
                        "name": "Nhân viên P. Kết nối và phục vụ cộng đồng",
                        "code": "CBNV-NV",
                        "id": 135
                    },
                    {
                        "name": "Tổ trưởng tổ môn",
                        "code": "GV-QL2",
                        "id": 23
                    },
                    {
                        "name": "Nhân viên Phòng quản lý Nghiên cứu-đào tạo",
                        "code": "CBNV-NV",
                        "id": 138
                    },
                    {
                        "name": "Nhân viên Ban dự án xây dựng",
                        "code": "CBNV-NV",
                        "id": 140
                    },
                    {
                        "name": "Nhân viên Ban phát triển các dự án mới",
                        "code": "CBNV-NV",
                        "id": 136
                    },
                    {
                        "name": "Nhân viên Quản lý KTX",
                        "code": "CBNV-NV",
                        "id": 144
                    },
                    {
                        "name": "Kỹ thuật viên",
                        "code": "CBNV-NV",
                        "id": 143
                    },
                    {
                        "name": "Trưởng phòng P. KHCN",
                        "code": "GV-QLPB",
                        "id": 28
                    },
                    {
                        "name": "Giám đốc CTĐT",
                        "code": "GV-QL2",
                        "id": 20
                    },
                    {
                        "name": "Kế toán - dịch vụ",
                        "code": "CBNV-NV",
                        "id": 142
                    },
                    {
                        "name": "Tổng Giám đốc",
                        "code": "LĐ-GV",
                        "id": 1
                    },
                    {
                        "name": "Trưởng phòng P. HCQTTB",
                        "code": "CBNV-QL",
                        "id": 41
                    },
                    {
                        "name": "Trưởng phòng P. Tiêu chuẩn và đối sánh",
                        "code": "CBNV-QL",
                        "id": 26
                    },
                    {
                        "name": "Trưởng Lab",
                        "code": "GV-QL2",
                        "id": 21
                    },
                    {
                        "name": "Trưởng Bộ môn",
                        "code": "GV-QL2",
                        "id": 19
                    },
                    {
                        "name": "Nhân viên Giám sát dịch vụ",
                        "code": "CBNV-NV",
                        "id": 149
                    },
                    {
                        "name": "Nhân viên quản lý Nhà ăn",
                        "code": "CBNV-NV",
                        "id": 150
                    },
                    {
                        "name": "Giám đốc Tài chính",
                        "code": "LĐ",
                        "id": 5
                    },
                    {
                        "name": "Giám đốc TTNC",
                        "code": "GV-QL1",
                        "id": 10
                    },
                    {
                        "name": "Phó Trưởng khoa cấp 1",
                        "code": "GV-QL1",
                        "id": 11
                    },
                    {
                        "name": "Nhân viên VSCN",
                        "code": "CBNV-NV",
                        "id": 153
                    },
                    {
                        "name": "Giảng viên - GS",
                        "code": "GV-GS",
                        "id": 67
                    },
                    {
                        "name": "Phó Hiệu trưởng",
                        "code": "LĐ-GV",
                        "id": 3
                    },
                    {
                        "name": "Phó Chủ tịch HĐT",
                        "code": "LĐ-GV",
                        "id": 4
                    },
                    {
                        "name": "Giám đốc Trung tâm ISR",
                        "code": "CBNV-QL",
                        "id": 14
                    },
                    {
                        "name": "Phó GĐ Viện Pias",
                        "code": "GV-QL1",
                        "id": 15
                    },
                    {
                        "name": "Phó Trưởng Bộ môn",
                        "code": "GV-QL2",
                        "id": 22
                    },
                    {
                        "name": "Trưởng phòng P. Đào tạo",
                        "code": "GV-QLPB",
                        "id": 27
                    },
                    {
                        "name": "Phó Viện Trưởng Viện đào tạo quốc tế",
                        "code": "CBNV-QL",
                        "id": 46
                    },
                    {
                        "name": "GĐ Ban Dự án xây dựng",
                        "code": "CBNV-QL",
                        "id": 44
                    },
                    {
                        "name": "Phó Viện Trưởng Viện đào tạo sau đại học",
                        "code": "CBNV-QL",
                        "id": 45
                    },
                    {
                        "name": "Trưởng phòng P. TCKT",
                        "code": "CBNV-QL",
                        "id": 40
                    },
                    {
                        "name": "Trưởng khoa cấp 1",
                        "code": "GV-QL1",
                        "id": 7
                    },
                    {
                        "name": "Trưởng phòng P. Hợp tác đối ngoại",
                        "code": "CBNV-QL",
                        "id": 32
                    },
                    {
                        "name": "Nhân viên Trung tâm sản xuất thử nghiệm",
                        "code": "CBNV-NV",
                        "id": 139
                    },
                    {
                        "name": "Nhân viên vận hành - Viện đào tạo quốc tế",
                        "code": "CBNV-NV",
                        "id": 141
                    },
                    {
                        "name": "Nhân viên Phòng Dịch vụ KH-KT",
                        "code": "CBNV-NV",
                        "id": 137
                    },
                    {
                        "name": "Phó trưởng phòng P. Tuyển sinh và Truyền thông",
                        "code": "CBNV-QL",
                        "id": 48
                    },
                    {
                        "name": "Trưởng phòng P. Tuyển sinh và truyền thông",
                        "code": "GV-QLPB",
                        "id": 25
                    },
                    {
                        "name": "GĐ Viện Nano",
                        "code": "GV-QL1",
                        "id": 12
                    },
                    {
                        "name": "Trưởng khoa cấp 2",
                        "code": "GV-QL1",
                        "id": 8
                    },
                    {
                        "name": "Trưởng phòng P. Công tác sinh viên",
                        "code": "GV-QLPB",
                        "id": 35
                    },
                    {
                        "name": "Phó trưởng phòng P. Đào tạo",
                        "code": "GV-QLPB",
                        "id": 49
                    },
                    {
                        "name": "GĐ TT chuyển giao công nghệ",
                        "code": "CBNV-QL",
                        "id": 36
                    },
                    {
                        "name": "Trưởng phòng P. Tổ chức nhân sự",
                        "code": "GV-QLPB",
                        "id": 34
                    },
                    {
                        "name": "Trưởng phòng P. Thanh tra-PC-KT",
                        "code": "CBNV-QL",
                        "id": 33
                    },
                    {
                        "name": "GĐ Trung tâm CNTT",
                        "code": "GV-QLPB",
                        "id": 37
                    },
                    {
                        "name": "Phó GĐ TT ISR - TT cấp 3",
                        "code": "GV-QL1",
                        "id": 24
                    },
                    {
                        "name": "GĐ Viện Pias",
                        "code": "GV-QL1",
                        "id": 13
                    },
                    {
                        "name": "Phó GĐ Viện Nano",
                        "code": "GV-QL1",
                        "id": 16
                    },
                    {
                        "name": "Phó Trưởng khoa cấp 2",
                        "code": "GV-QL1",
                        "id": 17
                    },
                    {
                        "name": "Viện Trưởng Viện đào tạo quốc tế",
                        "code": "CBNV-QL",
                        "id": 31
                    },
                    {
                        "name": "Trưởng phòng P. ĐBCL và khảo thí",
                        "code": "GV-QLPB",
                        "id": 29
                    },
                    {
                        "name": "Phó Tổng Giám đốc",
                        "code": "LĐ-GV",
                        "id": 2
                    },
                    {
                        "name": "Nhân viên Kỹ thuật",
                        "code": "CBNV-NV",
                        "id": 147
                    },
                    {
                        "name": "Viện Trưởng Viện đào tạo sau đại học",
                        "code": "GV-QLPB",
                        "id": 30
                    },
                    {
                        "name": "GĐ TT đào tạo NN&KN",
                        "code": "CBNV-QL",
                        "id": 38
                    },
                    {
                        "name": "TLNC",
                        "code": "TLNC",
                        "id": 172
                    },
                    {
                        "name": "Giám đốc trung tâm",
                        "code": "CBNV-QL",
                        "id": 304
                    },
                    {
                        "name": "Nhân viên Tuyển dụng",
                        "code": "CBNV-NV",
                        "id": 98
                    },
                    {
                        "name": "Quyền Giám đốc Trung tâm dịch vụ",
                        "code": "CBNV-QL",
                        "id": 175
                    },
                    {
                        "name": "Postdoc",
                        "code": "Postdoc",
                        "id": 281
                    },
                    {
                        "name": "Trưởng Lab trọng điểm",
                        "code": "GV-QL2",
                        "id": 177
                    },
                    {
                        "name": "NCS",
                        "code": "NCS",
                        "id": 282
                    },
                    {
                        "name": "Giảng viên - BSNT",
                        "code": "GV-BSNT",
                        "id": 183
                    },
                    {
                        "name": "Giảng viên - Ghi danh",
                        "code": "GV-GD",
                        "id": 165
                    },
                    {
                        "name": "Phó Trưởng Phòng",
                        "code": "CBNV-QL",
                        "id": 171
                    },
                    {
                        "name": "Giảng viên - Trợ giảng",
                        "code": "GV-ĐH",
                        "id": 283
                    },
                    {
                        "name": "Trưởng Phòng Pháp chế",
                        "code": "CBNV-QL",
                        "id": 301
                    },
                    {
                        "name": "Trưởng phòng P. Thanh tra-PC",
                        "code": "CBNV-QL",
                        "id": 293
                    },
                    {
                        "name": "Giảng viên - PGS",
                        "code": "GV-PGS",
                        "id": 68
                    },
                    {
                        "name": "Giảng viên - Tiến sĩ",
                        "code": "GV-TS",
                        "id": 69
                    },
                    {
                        "name": "Nhân viên pha chế",
                        "code": "CBNV-NV",
                        "id": 294
                    },
                    {
                        "name": "Trưởng Phòng Thanh Tra",
                        "code": "GV-QLPB",
                        "id": 300
                    },
                    {
                        "name": "Kỹ thuật viên Kỹ thuật xét nghiệm",
                        "code": "CBNV-NV",
                        "id": 166
                    },
                    {
                        "name": "Nhân viên hợp tác Phi Doanh nghiệp ",
                        "code": "CBNV-NV",
                        "id": 287
                    },
                    {
                        "name": "Nhân viên Tuyển dụng và đào tạo",
                        "code": "CBNV-NV",
                        "id": 170
                    },
                    {
                        "name": "PGĐ TT đào tạo NN&KN",
                        "code": "GV-QL1",
                        "id": 55
                    },
                    {
                        "name": "Nhân viên TT nội bộ",
                        "code": "CBNV-NV",
                        "id": 104
                    },
                    {
                        "name": "Kỹ thuật viên- Trợ giảng",
                        "code": "CBNV-NV",
                        "id": 298
                    },
                    {
                        "name": "Chuyên viên Phát triển Chương trình ngắn hạn",
                        "code": "CBNV-NV",
                        "id": 296
                    },
                    {
                        "name": "Nhân viên giáo dục tư tưởng chính trị và kết nối phụ huynh",
                        "code": "CBNV-NV",
                        "id": 168
                    },
                    {
                        "name": "Chuyên viên quản lý khoa học nội bộ, các đề tài dự án cấp trường",
                        "code": "CBNV-NV",
                        "id": 119
                    },
                    {
                        "name": "Bếp chảo",
                        "code": "CBNV-NV",
                        "id": 157
                    },
                    {
                        "name": "Bếp thớt",
                        "code": "CBNV-NV",
                        "id": 158
                    },
                    {
                        "name": "Tạp vụ",
                        "code": "CBNV-NV",
                        "id": 160
                    },
                    {
                        "name": "Phó GĐ TTDV",
                        "code": "CBNV-QL",
                        "id": 58
                    },
                    {
                        "name": "Trưởng Xưởng thực hành",
                        "code": "CBNV-QL",
                        "id": 178
                    },
                    {
                        "name": "Chuyên viên phụ trách hợp tác và phát triển khoa học công nghệ",
                        "code": "CBNV-NV",
                        "id": 85
                    },
                    {
                        "name": "Nhân viên PR nội dung TA",
                        "code": "CBNV-NV",
                        "id": 102
                    },
                    {
                        "name": "Chuyên viên quản lý đào tạo SĐH",
                        "code": "CBNV-NV",
                        "id": 108
                    },
                    {
                        "name": "Chuyên viên PTCT và Công tác Kiểm định",
                        "code": "CBNV-NV",
                        "id": 82
                    },
                    {
                        "name": "Chuyên viên sở hữu trí tuệ",
                        "code": "CBNV-NV",
                        "id": 120
                    },
                    {
                        "name": "Chuyên viên quản trị phần mềm",
                        "code": "CBNV-NV",
                        "id": 84
                    },
                    {
                        "name": "Chuyên viên quản lý điểm",
                        "code": "CBNV-NV",
                        "id": 87
                    },
                    {
                        "name": "Hiệu trưởng",
                        "code": "LĐ-GV",
                        "id": 161
                    },
                    {
                        "name": "Kỹ thuật viên - Trợ giảng",
                        "code": "CBNV-NV",
                        "id": 211
                    },
                    {
                        "name": "Trưởng Ban dự án",
                        "code": "CBNV-QL",
                        "id": 173
                    },
                    {
                        "name": "Phó Giám đốc CTĐT",
                        "code": "CBNV-QL",
                        "id": 180
                    },
                    {
                        "name": "Nhân viên nấu ăn",
                        "code": "CBNV-NV",
                        "id": 154
                    },
                    {
                        "name": "Nhân viên quản lý hình ảnh",
                        "code": "CBNV-NV",
                        "id": 130
                    },
                    {
                        "name": "Giám đốc TT Nghiên cứu",
                        "code": "GV-QL1",
                        "id": 9
                    },
                    {
                        "name": "Bí thư Đoàn chuyên trách",
                        "code": "CBNV-QL",
                        "id": 179
                    },
                    {
                        "name": "Phó phòng P. HCQTTB",
                        "code": "CBNV-QL",
                        "id": 61
                    },
                    {
                        "name": "Nhân viên Hợp tác Đối ngoại",
                        "code": "CBNV-NV",
                        "id": 182
                    },
                    {
                        "name": "PGĐ TT chuyển giao công nghệ",
                        "code": "CBNV-QL",
                        "id": 54
                    },
                    {
                        "name": "Bếp phó",
                        "code": "CBNV-NV",
                        "id": 156
                    },
                    {
                        "name": "Phó Viện Trưởng Viện Led-Lighting",
                        "code": "GV-QL1",
                        "id": 212
                    },
                    {
                        "name": "Phụ bếp",
                        "code": "CBNV-NV",
                        "id": 159
                    },
                    {
                        "name": "Nghiên cứu sinh",
                        "code": "NCS",
                        "id": 174
                    },
                    {
                        "name": "Thành viên HĐT",
                        "code": "LĐ",
                        "id": 176
                    },
                    {
                        "name": "Phó trưởng phòng P. KHCN",
                        "code": "GV-QLPB",
                        "id": 50
                    },
                    {
                        "name": "Kỹ sư kỹ thuật hạ tầng (Mạng + Server)",
                        "code": "CBNV-NV",
                        "id": 122
                    },
                    {
                        "name": "GĐ Ban phát triển các dự án mới",
                        "code": "CBNV-QL",
                        "id": 43
                    },
                    {
                        "name": "Giảng viên - Đại học",
                        "code": "GV-ĐH",
                        "id": 71
                    },
                    {
                        "name": "Phó GĐ Ban phát triển các dự án mới",
                        "code": "CBNV-QL",
                        "id": 64
                    },
                    {
                        "name": "Phó phòng P. Hợp tác đối ngoại",
                        "code": "CBNV-QL",
                        "id": 53
                    },
                    {
                        "name": "Phó phòng P. Công tác sinh viên",
                        "code": "CBNV-QL",
                        "id": 57
                    },
                    {
                        "name": "Kỹ thuật viên P.CNTT",
                        "code": "CBNV-NV",
                        "id": 124
                    },
                    {
                        "name": "Phó GĐ TT thông tin thư viện",
                        "code": "CBNV-QL",
                        "id": 62
                    },
                    {
                        "name": "Thư ký - Giáo vụ/Trợ lý khoa",
                        "code": "CBNV-NV",
                        "id": 80
                    },
                    {
                        "name": "Phó phòng P. TCKT",
                        "code": "CBNV-QL",
                        "id": 60
                    },
                    {
                        "name": "Phó phòng P. Thanh tra-PC-KT",
                        "code": "CBNV-QL",
                        "id": 51
                    },
                    {
                        "name": "Phó phòng P.Tổ chức nhân sự",
                        "code": "CBNV-QL",
                        "id": 56
                    },
                    {
                        "name": "Nhân viên phụ trách TT online",
                        "code": "CBNV-NV",
                        "id": 103
                    },
                    {
                        "name": "Phó phòng P. kết nối và phục vụ cộng đồng,",
                        "code": "CBNV-QL",
                        "id": 63
                    },
                    {
                        "name": "GĐ Trung tâm Thư viện",
                        "code": "CBNV-QL",
                        "id": 47
                    },
                    {
                        "name": "GĐ Trung tâm dịch vụ",
                        "code": "CBNV-QL",
                        "id": 39
                    }
                ]
            },
            "message": "PROFILE Success.",
            "success": true,
            "errCode": ""
        };
        //console.log(typeof (strJson));
        //console.log(typeof (strJson.data));
        //console.log(typeof (strJson.data.listDepartment));

        //console.log(Array.isArray(strJson));
        //console.log(Array.isArray (strJson.data));
        //console.log(Array.isArray(strJson.data.listDepartment));

//        const libs = `
//<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
//<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.15/themes/default/style.min.css" />
//<script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.15/jstree.min.js"></script>
//`;
//        $("#main-content-wrapper").append(libs);

        var strTree = readObj(strJson);
        var data = strJson.data.listProfile;
        console.log(data.length);
        if (data.length) {
            var row = '';
            for (var x in data[0]) {
                row += '<th>' + x + '</td>';
            }
            $("#tblNhapTuNguon thead tr").append(row);
            row = '';
            for (var i = 0; i < data.length; i++) {
                row += '<tr>';
                row += '<td>' + (i + 1) + '</td>';
                for (var x in data[0]) {
                    var temp = data[i][x];
                    if (typeof temp == "object") temp = JSON.stringify(temp);
                    row += '<td>' + temp + '</td>';
                }
                row += '</tr>';
            }
            row += '</tbody>';
            $("#tblNhapTuNguon tbody").html(row);

            place = '#chondoituong';
            $(place).html(strTree);
            //console.log(strTree)
            //setTimeout(function () {

            //    $(place).jstree();//default user
            //    //$(place).jstree(true).refresh();
            //    //$(place).one("refresh.jstree").jstree(true).refresh();
            //},500)
        }

        function readObj(obj) {
            console.log(typeof obj)
            if (typeof obj != "object") {
                console.log(obj);
                return " :" + obj;
            }
            let row = '';
            row += '<ul>';
            for (var x in obj) {
                row += '<li class="btnEvent jstree-open">'
                row += x;
                if (typeof obj[x] == "object") {
                    if (!Array.isArray(obj[x])) row += readObj(obj[x]);
                }
                row += '</li>';
            }
            row += '</ul>';
            return row;
        }
    },


    getList_VanBan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_ThongTin/LayDSTinTuc_VanBan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiVanBan_Id': edu.util.getValById('dropAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_VanBan(dtReRult, data.Pager);
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
    genTable_VanBan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblVanBan",

            aaData: data,
            colPos: {
                center: [0, 2, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "TENVANBAN"
                },
                {
                    //"mDataProp": "SOHIEU",
                    "mRender": function (nRow, aData) {
                        return '<a class="color-dask-blue text-decoration-underline" href="" id="txtFileDinhKem' + aData.ID + '" href="#" target="_blank">' + edu.util.returnEmpty(aData.SOHIEU) + '</a>';
                    }
                },
                {
                    "mDataProp": "NGAYBANHANH"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            var strApi = "TT_Files";
            var strDuLieu_Id = e;
            getList_File(strApi, strDuLieu_Id.ID);
        })

        function getList_File(strApi, strDuLieu_Id) {

            var obj_detail = {
                'action': strApi + '/LayDanhSach',

                'strDuLieu_Id': strDuLieu_Id
            };
            //
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        if (json.length > 0) $("#txtFileDinhKem" + strDuLieu_Id).attr("href", edu.system.rootPathUpload + "/" + json[0].FILEMINHCHUNG);
                    } else {
                        console.log("Thông báo: có lỗi xảy ra!");
                    }

                },
                error: function (er) { },
                type: "GET",
                action: obj_detail.action,

                contentType: true,

                data: obj_detail,
                fakedb: []
            }, false, false, false, null);
        }
    },
    
}