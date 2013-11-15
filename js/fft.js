FFT = function() {
    var fft_step = function(input_r, input_i, output_r, output_i, offset_in, offset_out, N, s) {
        if(N == 1) {
            output_r[offset_out] = input_r[offset_in];
            output_i[offset_out] = input_i[offset_in];
        } else {
            fft_step(input_r, input_i, output_r, output_i, offset_in, offset_out, Math.round(N/2), 2*s);
            fft_step(input_r, input_i, output_r, output_i, offset_in + s, Math.round(N/2) + offset_out, Math.round(N/2), 2*s);
            for(var k = 0; k < Math.round(N/2); k++) {
                t_r = output_r[offset_out + k];
                t_i = output_i[offset_out + k];
                output_r[offset_out + k] = t_r + Math.cos(-2*Math.PI*k/N) * output_r[k + offset_out + Math.round(N/2)] - Math.sin(-2*Math.PI*k/N) * output_i[k + offset_out + Math.round(N/2)];
                output_i[offset_out + k] = t_i + Math.sin(-2*Math.PI*k/N) * output_r[k + offset_out + Math.round(N/2)] + Math.cos(-2*Math.PI*k/N) * output_i[k + offset_out + Math.round(N/2)];
                var prev = output_r[k + offset_out + Math.round(N/2)];
                output_r[offset_out + k + Math.round(N/2)] = t_r - Math.cos(-2*Math.PI*k/N) * prev + Math.sin(-2*Math.PI*k/N) * output_i[k + offset_out + Math.round(N/2)];
                output_i[offset_out + k + Math.round(N/2)] = t_i - Math.sin(-2*Math.PI*k/N) * prev - Math.cos(-2*Math.PI*k/N) * output_i[k + offset_out + Math.round(N/2)];
            }
        }
    };

    var fft1d = function(input) {
        var input_r, input_i;

        if(input.r === undefined || input.i === undefined) {
            input_r = input;
            input_i = new Float32Array(input.length);
        } else {
            input_r = input.r;
            input_i = input.i;
        }

        var output_r = new Float32Array(input_r.length);
        var output_i = new Float32Array(input_r.length);
        fft_step(input_r, input_i, output_r, output_i, 0, 0, input_r.length, 1);

        return {r: output_r, i: output_i};
    };

    var ifft1d = function(input) {
        var input_r, input_i;

        if(input.r == undefined || input.i == undefined) {
            input_r = input;
            input_i = new Float32Array(input_r.length);
        } else {
            input_r = input.r;
            input_i = input.i;
        }

        var output_r = new Float32Array(input_r.length);
        var output_i = new Float32Array(input_r.length);
        fft_step(input_i, input_r, output_i, output_r, 0, 0, input_r.length, 1);
        
        return {r: output_r, i: output_i};
    };

    return {
        fft1d: fft1d,
        ifft1d: ifft1d
    };
}();