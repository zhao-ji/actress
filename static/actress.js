jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options);
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

function render(imageData, dataType){
    var tpl,
        template;

    tpl = $('#waterfall-tpl').html();
    template = Handlebars.compile(tpl);

    $.each(imageData["result"],
        function(index, item){
            var imageName = item["image"];
            var prefixUrl = "http://elfin.qiniudn.com/";
            item["image"] = prefixUrl + imageName + "-waterFallSize";
            $.get(prefixUrl + imageName + "?imageInfo",
                function(data, status){
                    if(status=="success"){
                        item["width"] = 200;
                        item["height"] = 200*data["height"]/data["width"];
                    }else{
                        console.error(imageUrl);
                    }
                });
        });
    return template(imageData);
}

function refresh() {
    $.get('/actress/v1/refresh', function(data, status){
        if(status=="success" && data){
            console.error("refresh!");
            $("#container").waterfall(
                "prepend",
                $(render(data, "json")),
                null
            );
        }
    });
}

$(document).ready(function(){
    $.cookie("start", null);
    $.cookie("stop", null);

    $('#container').waterfall({
        itemCls: 'item',
        fitWidth: true,
        colWidth: 230,
        gutterWidth: 10,
        gutterHeight: 10,
        alian: 'center',
        minCol: 1,
        containerStyle: {position: 'relative'},
        //resizable: true,
        isFadeIn: false,
        checkImagesLoaded: false,
        //isAnimated: true,
        //animationOptions: {
        //},
        dataType: 'json',
        debug: false,
        path: function(page) {
            console.info("page: " + page);
            if(page==1){
                return '/actress/v1/refresh';
            }else{
                return '/actress/v1/record';
            }
        },
        callbacks: {renderData: render}
    });

    //setInterval(refresh, 6000);

    $("#container").on("click", "img", function() {
        $(this).popImage();
    });
});
