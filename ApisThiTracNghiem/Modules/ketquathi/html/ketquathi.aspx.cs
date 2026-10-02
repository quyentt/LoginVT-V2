using Apis.CommonV1.Base;
using Apis.HeThong.BO.Base;
using Apis.HeThong.Entity.Base;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Apis.NewLogin.ApisThiTracNghiem.Modules.ketquathi.html
{
    public partial class ketquathi : System.Web.UI.Page
    {
        public string RootPathAPI = "";

        public string strHost = "";
        public string report = "";
        public string app_id = "";
        public string avatar = "";
        public string user_id = "";
        public string language_id = "";
        public string tokenjwt = "";
        public string strExamRoomInfo_Id = "";
        public string strThiSinh_Id = "";
        public string strStudentExamroom_Id = "";
        public string username = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated)
            {
                Response.Redirect("../../../../logout.aspx");

            }
            else
            {
                username = (HttpContext.Current.User as CustomPrincipal).Fullname;
                var id = (HttpContext.Current.User as CustomPrincipal).User_Id;
                language_id = (HttpContext.Current.User as CustomPrincipal).Language_Id;
                user_id = (HttpContext.Current.User as CustomPrincipal).User_Id;
                tokenjwt = (HttpContext.Current.User as CustomPrincipal).Token;
                avatar = (HttpContext.Current.User as CustomPrincipal).Avatar;
                avatar = avatar.Replace("\\", "/");
            }

            if (Request.QueryString["strExamRoomInfo_Id"] != null || Request.QueryString["strThiSinh_Id"] != null)
            {
                strExamRoomInfo_Id = Request.QueryString["strExamRoomInfo_Id"].ToString();
                strThiSinh_Id = Request.QueryString["strThiSinh_Id"].ToString();
                strStudentExamroom_Id = Request.QueryString["strStudentExamroom_Id"].ToString();


            }
            else
            {
                var strPath = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + HttpContext.Current.Request.ApplicationPath;
                Response.Redirect(strPath + "/eIndex.aspx");
            }
          
            makeLogs("XEMDIEM", user_id, "XEMDIEM", "");

        }
        private void makeLogs(string strHoatDong, string strUserId, string strChucNang_Id, string strMoTa)
        {
            try
            {
                var obj = new LuuCacThongTinHoatDongEntity();
                obj.strNguoiDung_Id = strUserId;
                obj.strHoatDong = strHoatDong;
                obj.strDiaChiMayTramTruyCap = Apis.CommonV1.Base.Utility.GetIpAddress();
                obj.strTrinhDuyetSuDungTruyCap = WebUser.GetPost("userbrower", string.Empty);
                obj.strTenThietBi = Apis.CommonV1.Base.Utility.GetComputerName();
                obj.strTaiKhoanDangNhap = strUserId;
                obj.strMoTa = strMoTa;
                obj.strChucNang_Id = strChucNang_Id;
                obj.strUngDung_Id = "THITRACNGHIEM";
                var strId = "";
                LuuCacThongTinHoatDongBo.LuuCacThongTinHoatDong(obj, ref strId);
            }
            catch (Exception ex)
            {

            }
        }
    }
}