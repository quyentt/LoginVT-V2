(function($) {
    /*
     * 検索機能付き セレクトボックス
     *
     * Copyright (c) 2020 iseyoshitaka
     */
    $.fn.searchBox = function(opts) {

        // Ghi đè giá trị mặc định nếu đối số có giá trị
        var settings = $.extend({}, $.fn.searchBox.defaults, opts);

        var init = function(obj) {

            var self = $(obj),
                parent = self.closest('div,tr'),
                searchWord = ''; // Bộ lọc chuỗi

            // Bổ sung trường nhập văn bản để tìm kiếm được tinh chỉnh
            self.before('<input type="text" class="refineText form-select formTextbox" />');
            var refineText = parent.find('.refineText');
            if (settings.mode === MODE.NORMAL) {
                refineText.attr('readonly', 'readonly');
            }

            // Nếu được chọn trong màn hình ban đầu, từ ngữ đã chọn sẽ được hiển thị trong trường nhập từ ngữ được thu hẹp.
            var selectedOption = self.find('option:selected');
            if (selectedOption) {
                refineText.val(selectedOption.text());
                if (selectedOption.val() === '') {
                    if (settings.mode === MODE.TAG) {
                        refineText.val("");
                    }
                }
            }

            // Tạo một danh sách giả để hiển thị thay vì hộp chọn
            var visibleTarget = self.find('option').map(function(i, e) {
                return '<li data-selected="off" data-searchval="' + $(e).val() + '"><span>' + $(e).text() + '</span></li>';
            }).get();
            self.after($('<ul class="searchBoxElement"></ul>').hide());

            // Khớp chiều rộng hiển thị của danh sách giả với hộp chọn
            var refineTextWidth = (settings.elementWidth) ? settings.elementWidth : self.width();
            refineText.css('width', refineTextWidth);
            parent.find('.searchBoxElement').css('width', refineTextWidth);

            // Ẩn hộp chọn ban đầu
            self.hide();

            // Thu hẹp danh sách giả theo điều kiện tìm kiếm.
            var changeSearchBoxElement = function() {
                if (searchWord !== '') {
                    var matcher = new RegExp(searchWord.replace(/\\/g, '\\\\'), "i");
                    var filterTarget = $(visibleTarget.join()); // Bản sao của mảng
                    filterTarget = filterTarget.filter(function() {
                        return $(this).text().match(matcher);
                    });
                    parent.find('.searchBoxElement').empty();
                    parent.find('.searchBoxElement').html(filterTarget);
                    parent.find('.searchBoxElement').show();
                } else {
                    parent.find('.searchBoxElement').empty();
                    parent.find('.searchBoxElement').html(visibleTarget.slice(0, settings.optionMaxSize).join(''));
                    parent.find('.searchBoxElement').show();
                }

                // Thay đổi màu nền của thẻ LI đã chọn.
                var selectedOption = self.find('option:selected');
                if (selectedOption) {
                    parent.find('.searchBoxElement').find('li').removeClass('selected');
                    parent.find('.searchBoxElement').find('li[data-searchval="' + selectedOption.val() + '"]').addClass('selected');
                }

                // Khi một danh sách giả được chọn
                parent.find('.searchBoxElement').find('li').click(function(e) {
                    e.preventDefault();
                    // e.stopPropagation();
                    var li = $(this),
                        searchval = li.data('searchval');
                    self.val(searchval).change();
                    parent.find('li').attr('data-selected', 'off');
                    li.attr('data-selected', 'on');
                });

            };

            // Chức năng tại thời điểm keyup
            refineText.keyup(function(e) {
                searchWord = $(this).val();
                // Làm mới danh sách giả
                changeSearchBoxElement();
            });

            // Khi thay đổi hộp chọn
            self.change(function() {
                // Phản ánh văn bản của tùy chọn lựa chọn trong khu vực từ ngữ được tinh chỉnh mới nhất
                var selectedOption = $(this).find('option:selected');
                searchWord = selectedOption.text();
                refineText.val(selectedOption.text());

                if (settings.selectCallback) {
                    settings.selectCallback({
                        selectVal: selectedOption.attr('value'),
                        selectLabel: selectedOption.text()
                    });
                }
            });

            // Nếu bạn nhấp vào hộp văn bản, một danh sách giả sẽ được hiển thị.
            refineText.click(function(e) {
                e.preventDefault();

                // Đặt theo chế độ
                if (settings.mode === MODE.NORMAL) {
                    searchWord = '';
                } else if (settings.mode === MODE.INPUT) {
                    refineText.val('');
                    searchWord = '';
                } else if (settings.mode === MODE.TAG) {
                    var selectedOption = self.find('option:selected');
                    if (selectedOption.val() === '') {
                        refineText.val('');
                        searchWord = '';
                    }
                }

                // Làm mới danh sách giả
                parent.find('.searchBoxElement').hide();
                changeSearchBoxElement();

            });

            // Nếu bạn nhấp vào bên ngoài hộp chọn, danh sách giả sẽ bị ẩn.
            $(document).click(function(e) {
                if ($(e.target).hasClass('refineText')) {
                    return;
                }
                parent.find('.searchBoxElement').hide();
                if (settings.mode !== MODE.TAG) {
                    var selectedOption = self.find('option:selected');
                    searchWord = selectedOption.text();
                    refineText.val(selectedOption.text());
                }
            });

        }

        $(this).each(function() {
            init(this);
        });

        return this;
    }

    var MODE = {
        NORMAL: 0, // Hộp chọn bình thường
        INPUT: 1, // Hộp chọn loại đầu vào
        TAG: 2 // Hộp chọn loại bổ sung thẻ
    };

    $.fn.searchBox.defaults = {
        selectCallback: null, // Gọi lại được gọi sau khi lựa chọn
        elementWidth: null, // Chọn chiều rộng hiển thị hộp
        optionMaxSize: 100, // Số tối đa để hiển thị trong hộp chọn
        mode: MODE.INPUT //  Chế độ hiển thị
    };

})(jQuery);