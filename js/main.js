$(document).ready(function(){
    var format_data = function(input, div) {
        var out = [];
        for(var i = 0; i<input.length; i++) {
            out[i] = [i, input[i]];
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
});