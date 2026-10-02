var swiper = new Swiper(".service-slider", {
  spaceBetween: 0,
  slidesPerView: "auto",
  freeMode: false,
  watchSlidesProgress: false,
  // simulateTouch: false
});
var swiper2 = new Swiper(".service-content-slider", {
  autoHeight: true,
  spaceBetween: 0,
  navigation: false,
  noSwipingClass: ["live-doc"],
  thumbs: {
    swiper: swiper,
  },
});

// ---------------
$(".news-slider").slick({
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  prevArrow: "<i class='fal fa-chevron-left swiper-prev'></i>",
  nextArrow: "<i class='fal fa-chevron-right swiper-next'></i>",
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 980,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        adaptiveHeight: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
});

$(".friend-slider").slick({
  dots: false,
  infinite: true,
  slidesToShow: 9,
  slidesToScroll: 9,
  prevArrow: "<i class='fal fa-chevron-left swiper-prev'></i>",
  nextArrow: "<i class='fal fa-chevron-right swiper-next'></i>",
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
      },
    },
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 9,
        slidesToScroll: 9,
      },
    },
    {
      breakpoint: 980,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
        adaptiveHeight: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
});

$(".brand-slider").slick({
  dots: false,
  infinite: true,
  slidesToShow: 9,
  slidesToScroll: 9,
  prevArrow: "<i class='fal fa-chevron-left swiper-prev'></i>",
  nextArrow: "<i class='fal fa-chevron-right swiper-next'></i>",
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
      },
    },
    {
      breakpoint: 980,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        adaptiveHeight: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
});
$(".teach-login-slider").slick({
  dots: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 2000,
});
// --------
var $windowWidth = $(window).width();
// if ($windowWidth < 1201 && $windowWidth > 768) {
//   $(".wrapper").addClass("small-sidebar");
// }
$(".menu-icon").click(function () {
  $(".wrapper").toggleClass("small-sidebar");
});
$(".menu-icon-mobi").click(function () {
  $(".sidebar-menu").toggleClass("show");
  $(".overlay").toggle();
});
$(".mobi-search-icon").click(function () {
  $(".search-group").addClass("show");
  $(this).hide();
  $(".logo").hide();
  $(".logo-single").hide();
});
$(document).on("click", function (event) {
  if (!$(event.target).closest(".search-group-in-mobi").length) {
    $(".search-group").removeClass("show");
    $(".mobi-search-icon").show();
    $(".logo").show();
    $(".logo-single").show();
  }
  if (!$(event.target).closest(".left-sidebar").length) {
    $(".sidebar-menu").removeClass("show");
    $(".overlay").hide();
  }
});
// -------------class modal height
$("#modal-total-class").on("shown.bs.modal", function (e) {
  $(".masonry-bq").masonry();
});

$(window).on("load", function () {
  // $("#tubangdiem").modal("show");
});

$(document).ready(function () {
  $(".masonry-class-reg-1").masonry();
  // $('#themnhom').modal('show');
});
// swipe table-----------------------------------------------------------
const swipeScroll = document.querySelectorAll(".kqht-modal .right");

let isDown = false;
let startX;
let scrollLeft;

swipeScroll.forEach((slider) => {
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });
  slider.addEventListener("mouseup", () => {
    isDown = false;
  });
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
  });
});
$(document).ready(function () {
  // myTab-------------------------------------------------------------------------------

  const myFunctionWrap = document.querySelectorAll(".card");

  myFunctionWrap.forEach((funcEle) => {
    const myTabLink = funcEle.querySelectorAll(".myTab-header-link");
    const myTabItem = funcEle.querySelectorAll(".myTab-item");

    myTabLink.forEach((el) => {
      el.addEventListener("click", showMyTab);
    });

    function showMyTab(el) {
      const btn = el.currentTarget;
      const dataTarget = btn.getAttribute("data-myTab");
      myTabItem.forEach((el) => {
        el.classList.remove("show");
      });
      myTabLink.forEach((el) => {
        el.classList.remove("active");
      });
      const myTabItemshow = document.querySelector("#" + dataTarget);
      myTabItemshow.classList.add("show");
      btn.classList.add("active");

      const featureAction = myTabItemshow.querySelector(
        ".feature-action-group "
      ).innerHTML;

      leftNav.innerHTML = featureAction;
    }
  });
});

// style cho table chi tiết điểm theo khối kiến thức

$(document).ready(function () {
  const colors = ["#ffffff", "#faebd7"]; // Mảng màu
  let colorIndex = 0; // Chỉ số màu trong mảng

  $("#table_chitietdiem_theokhoikienthuc tbody tr").each(function () {
    const td = $(this).find("td[rowspan]");
    if (td.length > 0) {
      const rowspan = parseInt(td.attr("rowspan")) || 1; // Lấy số rowspan
      const bgColor = colors[colorIndex % colors.length]; // Chọn màu

      // Đặt màu cho chính thẻ <tr>
      $(this).css({
        "background-color": bgColor,
        "border-color": " #aaaaaa",
      });
      $(this).find("td:nth-child(2)").css({
        "background-color": bgColor,
        "border-right": "1px solid #aaaaaa",
      });

      // Đặt màu cho các hàng tiếp theo
      let nextRow = $(this).next();
      for (let i = 1; i < rowspan; i++) {
        nextRow.css({
          "background-color": bgColor,
          "border-color": " #aaaaaa",
        });
        nextRow = nextRow.next(); // Chuyển sang hàng tiếp theo
      }

      colorIndex++; // Chuyển sang màu tiếp theo trong mảng
    }
  });
});
//  customs js===============================================================================

  $(".menu-toggle").click(function () {
    $(".main-menu ul").toggleClass("show");
  });
  $(".head-search-toggle").click(function () {
    $(".head-search-form").toggleClass("show");
  });
  $(".sidebar-bars").click(function () {
    $(".main-wrap").toggleClass("sidebar-toggle");
  });
  $(".main-wrap").click(function(e) {
    if ($(e.target).closest('.left-sidebar').length) return;

    $(".main-wrap").removeClass("sidebar-toggle")
});

  $(document).on("click", function (event) {
    if (
      !$(event.target).closest(".head-search-form").length &&
      !$(event.target).closest(".main-menu").length
    ) {
      $(".head-search-form").removeClass("show");
    }
    if (
      !$(event.target).closest(".main-menu").length &&
      !$(event.target).closest(".main-menu").length
    ) {
      $(".main-menu ul").removeClass("show");
    }
  });

    // Xử lý box chức năng----------------------------------------
  const featureItem = document.querySelectorAll(".action-group .item");
  const featureItem2 = document.querySelectorAll(".feature-list .feature-item");

  const featureItemMaxHeightArr = [];
  
  featureItem2.forEach((item) => {
    const featureLink = item.querySelector(".feature-box");
    featureLink.addEventListener("click", (e) => {
      //e.preventDefault();

      var itemPosition = featureLink.getAttribute("data-position");
      if (!itemPosition) {
        itemPosition = 0;
      }
      console.log(itemPosition);
      localStorage.setItem("dataPosition", itemPosition);
    });
  });
  
  // featureItem.forEach((item) => {
  //   /* Index swiperJs when click*/
  //   const featureLink = item.querySelector(".feature-box");

  //   featureLink.addEventListener("click", (e) => {
  //     //e.preventDefault();

  //     var itemPosition = featureLink.getAttribute("data-position");
  //     if (!itemPosition) {
  //       itemPosition = 0;
  //     }
  //     console.log(itemPosition);
  //     localStorage.setItem("dataPosition", itemPosition);
  //   });

  //   /* Thiết lập chiều cao box chức năng */

  //   const featureItemHeight = item.clientHeight;
  //   featureItemMaxHeightArr.push(featureItemHeight);
  //   featureItemMaxHeight = Math.max(...featureItemMaxHeightArr);
  //   item.setAttribute("style", "height:" + featureItemMaxHeight + "px");
  // });

  var dataPosition = localStorage.getItem("dataPosition");
  console.log(dataPosition);
  
    // myTab-------------------------------------------------------------------------------
  
  const actionOuter = document.querySelector(".action-inner");

  function updateActionInnerBySlide(slideIndex) {
    const slides = document.querySelectorAll(".content-slider .swiper-slide");
    const activeSlide = slides[slideIndex];
    if (!activeSlide) return;

    const funcEle = activeSlide.querySelector(".function");
    if (!funcEle) {
      actionOuter.innerHTML = "";
      return;
    }

    const activeLink = funcEle.querySelector(".myTab-header-link.active");
    if (activeLink) {
      const defaultTabId = activeLink.getAttribute("data-myTab");
      const defaultTab = funcEle.querySelector("#" + defaultTabId);
      if (defaultTab) {
        const featureActionDefault = defaultTab.querySelector(
          ".feature-action-group"
        );
        if (featureActionDefault) {
          actionOuter.innerHTML = featureActionDefault.innerHTML;
          return;
        }
      }
    }

    actionOuter.innerHTML = "";
  }

  var swiper = new Swiper(".label-slider", {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: false,
    watchSlidesProgress: false,
  });

  var swiper2 = new Swiper(".content-slider", {
    initialSlide: dataPosition || 0,
    autoHeight: true,
    observer: true,
    observeParents: true,
    spaceBetween: 0,
    navigation: false,
    noSwipingClass: ["no-swiper"],
    thumbs: {
      swiper: swiper,
    },
    on: {
      init: function () {
        updateActionInnerBySlide(this.activeIndex);
      },
      slideChange: function () {
        updateActionInnerBySlide(this.activeIndex);
      },
    },
  });
    var swiperInwiper = new Swiper(".tab-header-nav", {
    watchSlidesProgress: true,
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: false,
    watchSlidesProgress: false,
  });
  var swiperInwiper2 = new Swiper(".swiper-tab-content", {
    initialSlide: dataPosition,
    autoHeight: true,
    spaceBetween: 0,
    navigation: false,
    noSwipingClass: ["no-swiper"],
    thumbs: {
      swiper: swiperInwiper,
    },
  });
    
  // Xử lý click tab
  const myFunctionWrap = document.querySelectorAll(".function");

  myFunctionWrap.forEach((funcEle) => {
    const myTabLink = funcEle.querySelectorAll(".myTab-header-link");
    const myTabItem = funcEle.querySelectorAll(".myTab-item");

    myTabLink.forEach((el) => {
      el.addEventListener("click", function (event) {
        event.preventDefault();
        const btn = event.currentTarget;
        const dataTarget = btn.getAttribute("data-myTab");

        myTabItem.forEach((el) => el.classList.remove("show"));
        myTabLink.forEach((el) => el.classList.remove("active"));

        const currentTab = funcEle.querySelector("#" + dataTarget);
        if (currentTab) {
          currentTab.classList.add("show");
          swiper2.updateAutoHeight(300);
        }
        btn.classList.add("active");

        const parentSlide = funcEle.closest(".swiper-slide");
        if (
          parentSlide &&
          parentSlide.classList.contains("swiper-slide-active")
        ) {
          const featureAction = currentTab
            ? currentTab.querySelector(".feature-action-group")
            : null;

          if (featureAction && actionOuter) {
            actionOuter.innerHTML = featureAction.innerHTML;
          } else if (actionOuter) {
            actionOuter.innerHTML = "";
          }
        }
      });
    });
  });
    // upload image vs video---------------------------------------------------
  const imgVideoUpload = document.querySelectorAll(".image-selector");
  let videoSrc;

  imgVideoUpload.forEach((item) => {
    const fileUpload = item.querySelector(".file-input");
    const fileView = item.querySelector(".file-prev");

    fileUpload.addEventListener("change", function (e) {
      const inputTarget = e.target;
      const file = inputTarget.files[0];

      if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function (e) {
          const readerTarget = e.target;
          const fileType = file.type.split("/")[0];

          if (fileType === "image") {
            console.log(fileType);
            const img = document.createElement("img");
            img.src = readerTarget.result;
            fileView.innerHTML = "";
            fileView.appendChild(img);
          } else if (fileType === "video") {
            const video = document.createElement("video");
            video.src = readerTarget.result;
            fileView.innerHTML = "";
            fileView.appendChild(video);
            video.classList.add("file-upload");
            video.controls = false;
            video.muted = true;
            const videoViewLink = item.querySelector(".video-view-link");
            videoViewLink.setAttribute("data-src", readerTarget.result);
            videoViewLink.classList.add("has-link");
            // get link video
            videoViewLink.addEventListener("click", () => {
              videoSrc = videoViewLink.dataset.src;
            });
          } else {
            return;
          }
        });

        reader.readAsDataURL(file);
      } else {
        fileView.innerHTML = "";
      }
    });
  });

  // play video modal---------------------------------------------------------
  $("#video_view").on("shown.bs.modal", function (e) {
    $(".video__view").attr("src", videoSrc);
  });
    //   color picker---------------------------------------------------------
  const colourPickerFields = document.querySelectorAll(".colour-picker-field");

  colourPickerFields.forEach((item) => {
    const text = item.querySelector(".colour-picker-field__item--text");
    const picker = item.querySelector(".colour-picker-field__item--picker");

    function handleSetColours(item1 = text, item2 = picker) {
      let colour = item1.value;
      item2.value = colour;
      text.style.border = `1px solid ${colour}`;
    }

    if (text.value) {
      handleSetColours();
    }
    text.addEventListener("change", (e) => {
      handleSetColours();
    });
    picker.addEventListener("input", (e) => {
      handleSetColours(picker, text);
    });
  }); 

  //Tự động thay đổi màu sắc box chức năng-------------------------------------
setTimeout(() => {
  const featureEle = document.querySelectorAll(".feature-box");
  // alert(featureEle);

  for (let i = 0; i < featureEle.length; i++) {
    let number = (i % 10) + 1;
    featureEle[i].setAttribute("data-bg", number);
  }
}, 500);

  // show quantity modul on page responsive!------------------------------------
  const modulList = document.querySelector(".modul-v2 .modul-list");
  const modulItem = document.querySelectorAll(".modul-v2 .modul-item");
  if (modulList) {
    /*Lấy chiều rộng list modul*/
    const modulListW = modulList.offsetWidth;
    /*Số lượng modul có thể hiển thị trên 1 dòng*/
    const modulItemPerRow = Math.floor((modulListW - 41) / 220);

    /*Lấy số lượng modul*/
    const modulItemQuantity = modulItem.length;
    /*Hiển thị modul trên 1 dòng, ẩn phần còn lại*/
    for (let i = 0; i < modulItemPerRow; i++) {
      modulItem[i].classList.add("modul-show");
    }
    const modulViewMore = document.querySelector(".modul-view-more");
    if (modulItemQuantity > modulItemPerRow) {
      modulViewMore.classList.add("show");
    }
    modulViewMore.addEventListener("click", () => {
      modulViewMore.classList.remove("show");
      for (let i = 0; i <= modulItemQuantity; i++) {
        modulItem[i].classList.add("modul-show");
      }
    });
  }
  
  const myTabHeader = document.querySelectorAll(".myTab-header");
  myTabHeader.forEach((el) => {
    const myTabHeaderHeight = el.offsetHeight;
    if (myTabHeaderHeight > 60) {
      el.classList.add("myTab-header-res");
    }
  });

  // swipe table-----------------------------------------------------------
  const swipeScroll1 = document.querySelectorAll(".table-responsive111");

  let isDown1 = false;
  let startX1;
  let scrollLeft1;

  swipeScroll.forEach((slider) => {
    slider.addEventListener("mousedown", (e) => {
      isDown1 = true;
      startX1 = e.pageX - slider.offsetLeft;
      scrollLeft1 = slider.scrollLeft1;
    });
    slider.addEventListener("mouseleave", () => {
      isDown1 = false;
    });
    slider.addEventListener("mouseup", () => {
      isDown1 = false;
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown1) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX1) * 3; //scroll-fast
      slider.scrollLeft1 = scrollLeft1 - walk;
    });
  });
  const chattingContent = document.querySelector(".user-chat-body");
  if (chattingContent) {
    chattingContent.scrollTop = chattingContent.scrollHeight;
  }
