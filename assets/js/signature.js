import "bootstrap-sass/assets/javascripts/bootstrap";
import $ from "jquery";

$(document).ready(function(){
    $.support.transition = false

    $('body').on('click', '.bcPaint-palette-color', function(){
        $(this).parent().find('.selected').removeClass('selected');
        $(this).addClass('selected');
        $.fn.bcPaint.setColor($(this).css('background-color'));
    });

    $('body').on('click', '#bcPaint-reset', function(){
        $.fn.bcPaint.clearCanvas();
    });

    $('body').on('click', '#submit', function(){
        $.fn.bcPaint.export();
    });

    $('#canvas').bcPaint();

});


(function( $ ) {
    /**
     * Private variables
     **/
    var isDragged		= false,
        startPoint		= { x:0, y:0 },
        templates 		= {
            container 		: $('<div id="bcPaint-container"></div>'),
            header 			: $('<div id="bcPaint-header"></div>'),
            palette 		: $('<div id="bcPaint-palette"></div>'),
            color 			: $('<div class="bcPaint-palette-color"></div>'),
            canvasContainer : $('<div id="bcPaint-canvas-container"></div>'),
            canvasPane 		: $('<canvas id="bcPaintCanvas"></canvas>'),
            bottom 			: $('<div id="bcPaint-bottom"></div>'),
            buttonReset 	: $('<button id="bcPaint-reset">Reset</button>'),
            buttonSave		: $('<button id="bcPaint-export">Export</button>')
        },
        paintCanvas,
        paintContext;

    /**
     * Assembly and initialize plugin
     **/
    $.fn.bcPaint = function (options) {

        return this.each(function () {
            var rootElement 	= $(this),
                colorSet		= $.extend({}, $.fn.bcPaint.defaults, options),
                defaultColor	= (rootElement.val().length > 0) ? rootElement.val() : colorSet.defaultColor,
                container 		= templates.container.clone(),
                header 			= templates.header.clone(),
                palette 		= templates.palette.clone(),
                canvasContainer = templates.canvasContainer.clone(),
                canvasPane 		= templates.canvasPane.clone(),
                bottom 			= templates.bottom.clone(),
                buttonReset 	= templates.buttonReset.clone(),
                buttonSave 		= templates.buttonSave.clone(),
                color;

            // assembly pane
            rootElement.append(container);
            container.append(header);
            container.append(canvasContainer);
            container.append(bottom);
            header.append(palette);
            canvasContainer.append(canvasPane);
            bottom.append(buttonReset);

            // assembly color palette
            $.each(colorSet.colors, function (i) {
                color = templates.color.clone();
                color.css('background-color', $.fn.bcPaint.toHex(colorSet.colors[i]));
                palette.append(color);
            });

            // set canvas pane width and height
            var bcCanvas = rootElement.find('canvas');
            var bcCanvasContainer = rootElement.find('#bcPaint-canvas-container');
            bcCanvas.attr('width', bcCanvasContainer.width());
            bcCanvas.attr('height', bcCanvasContainer.height());

            // get canvas pane context
            paintCanvas = document.getElementById('bcPaintCanvas');
            paintContext = paintCanvas.getContext('2d');

            // set color
            $.fn.bcPaint.setColor(defaultColor);

            // bind mouse actions
            paintCanvas.onmousedown = $.fn.bcPaint.onMouseDown;
            paintCanvas.onmouseup = $.fn.bcPaint.onMouseUp;
            paintCanvas.onmousemove = $.fn.bcPaint.onMouseMove;

            // bind touch actions
            paintCanvas.addEventListener('touchstart', function(e){
                $.fn.bcPaint.dispatchMouseEvent(e, 'mousedown');
            });
            paintCanvas.addEventListener('touchend', function(e){
                $.fn.bcPaint.dispatchMouseEvent(e, 'mouseup');
            });
            paintCanvas.addEventListener('touchmove', function(e){
                $.fn.bcPaint.dispatchMouseEvent(e, 'mousemove');
            });

            // Prevent scrolling on touch event
            document.body.addEventListener("touchstart", function (e) {
                if (e.target.id == 'bcPaintCanvas') {
                    e.preventDefault();
                }
            }, { passive: false });
            document.body.addEventListener("touchend", function (e) {
                if (e.target.id == 'bcPaintCanvas') {
                    e.preventDefault();
                }
            }, { passive: false });
            document.body.addEventListener("touchmove", function (e) {
                if (e.target.id == 'bcPaintCanvas') {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }

    /**
     * Extend plugin
     **/
    $.extend(true, $.fn.bcPaint, {

        /**
         * Dispatch mouse event
         */
        dispatchMouseEvent : function(e, mouseAction){
            var touch = e.touches[0];
            if(touch == undefined){
                touch = { clientX : 0, clientY : 0 };
            }
            var mouseEvent = new MouseEvent(mouseAction, {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            paintCanvas.dispatchEvent(mouseEvent);
        },

        /**
         * Remove pane
         */
        clearCanvas : function(){
            paintCanvas.width = paintCanvas.width;
        },

        /**
         * On mouse down
         **/
        onMouseDown : function(e){
            isDragged = true;
            // get mouse x and y coordinates
            startPoint.x = e.offsetX;
            startPoint.y = e.offsetY;
            // begin context path
            paintContext.beginPath();
            paintContext.moveTo(startPoint.x, startPoint.y);
        },

        /**
         * On mouse up
         **/
        onMouseUp : function() {
            isDragged = false;
        },

        /**
         * On mouse move
         **/
        onMouseMove : function(e){
            if(isDragged){
                paintContext.lineTo(e.offsetX, e.offsetY);
                paintContext.stroke();
            }
        },

        /**
         * Set selected color
         **/
        setColor : function(color){
            paintContext.strokeStyle = $.fn.bcPaint.toHex(color);
        },

        /**
         *
         */
        export : function(){
            var imgData = paintCanvas.toDataURL('image/png');
            $('.signature').val(imgData);
        },

        /**
         * Convert color to HEX value
         **/
        toHex : function(color) {
            // check if color is standard hex value
            if (color.match(/[0-9A-F]{6}|[0-9A-F]{3}$/i)) {
                return (color.charAt(0) === "#") ? color : ("#" + color);
                // check if color is RGB value -> convert to hex
            } else if (color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/)) {
                var c = ([parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10)]),
                    pad = function (str) {
                        if (str.length < 2) {
                            for (var i = 0, len = 2 - str.length; i < len; i++) {
                                str = '0' + str;
                            }
                        }
                        return str;
                    };
                if (c.length === 3) {
                    var r = pad(c[0].toString(16)),
                        g = pad(c[1].toString(16)),
                        b = pad(c[2].toString(16));
                    return '#' + r + g + b;
                }
                // else do nothing
            } else {
                return false;
            }
        }

    });

    /**
     * Default color set
     **/
    $.fn.bcPaint.defaults = {
        // default color
        defaultColor : '000000',

        // default color set
        colors : [
            '000000', '444444', '999999', 'DDDDDD', '6B0100', 'AD0200',
            '6B5E00', 'FFE000', '007A22', '00E53F', '000884', '000FFF'
        ],

        // extend default set
        addColors : [],
    };

})(jQuery);