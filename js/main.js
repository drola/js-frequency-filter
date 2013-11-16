$(document).ready(function(){
    var format_data = function(input, div) {
        var out = [];
        for(var i = 0; i<input.length; i++) {
            out[i] = [i, input[i]];
        }
        return out;
    };

    var format_image = function(input) {
        var max = -Number.POSITIVE_INFINITY;
        var min = Number.POSITIVE_INFINITY;
        for(var i = 0; i<input.length; i++) {
            if(input[i]>max) {
                max = input[i];
            }
            if(input[i]<min) {
                min = input[i];
            }
        }
        var scale = max-min;
        var d = -min;
        var out = new Uint8ClampedArray(input.length * 4);
        for(var i = 0; i<input.length; i++) {
            var val = Math.round(Math.abs((input[i]+d)*255/scale));
            out[4*i + 0] = val;
            out[4*i + 1] = val;
            out[4*i + 2] = val;
            out[4*i + 3] = 255;
        }
        return out;
    };

    var data = new Float32Array(64);
    for(var i = 0; i<64; i++) {
        data[i] = Math.sin(Math.PI*i/16);
    }
    var fft = FFT.fft1d(data);
    var ifft = FFT.ifft1d(fft);

    $.plot("#placeholder", [{
            data: format_data(ifft.r, 1),
            points: { show: false }
        }, {
            data: format_data(fft.r, data.length),
            points: { show: false }
        }, {
            data: format_data(fft.i, data.length),
            points: { show: false }
        }]);


    var canvas = document.getElementById('canvas_');
    var ctx = canvas.getContext('2d');

    var canvas_in = new Float32Array(512*512);
    for(var i = 0; i<512; i++) {
        for(var j = 0; j<512; j++) {
            canvas_in[i*512 + j] = Math.sin(Math.PI*(2*j*i)/5) + Math.sin(Math.PI*(j+2*i)/15);
        }
    }
    var fft2 = FFT.fft2d(canvas_in, 512, 512);
    var ifft2 = FFT.ifft2d(fft2, 512, 512);
    var idata = ctx.createImageData(512, 512);
    //idata.data.set(format_image(ifft2.r));
    idata.data.set(format_image(canvas_in));
    ctx.putImageData(idata, 0, 0);
});