FFT = function() {
    var fft_step = function(input_r, input_i, output_r, output_i, offset_in, offset_out, N, s, offset, factor) {
        if(N == 1) {
            output_r[factor*offset_out + offset] = input_r[factor*offset_in + offset];
            output_i[factor*offset_out + offset] = input_i[factor*offset_in + offset];
        } else {
            fft_step(input_r, input_i, output_r, output_i, offset_in, offset_out, Math.round(N/2), 2*s, offset, factor);
            fft_step(input_r, input_i, output_r, output_i, offset_in + s, Math.round(N/2) + offset_out, Math.round(N/2), 2*s, offset, factor);
            for(var k = 0; k < Math.round(N/2); k++) {
                t_r = output_r[offset + factor*(offset_out + k)];
                t_i = output_i[offset + factor*(offset_out + k)];
                output_r[offset + factor*(offset_out + k)] = t_r + Math.cos(-2*Math.PI*k/N) * output_r[offset + factor*(k + offset_out + Math.round(N/2))] - Math.sin(-2*Math.PI*k/N) * output_i[offset + factor*(k + offset_out + Math.round(N/2))];
                output_i[offset + factor*(offset_out + k)] = t_i + Math.sin(-2*Math.PI*k/N) * output_r[offset + factor*(k + offset_out + Math.round(N/2))] + Math.cos(-2*Math.PI*k/N) * output_i[offset + factor*(k + offset_out + Math.round(N/2))];
                var prev = output_r[offset + factor*(k + offset_out + Math.round(N/2))];
                output_r[offset + factor*(offset_out + k + Math.round(N/2))] = t_r - Math.cos(-2*Math.PI*k/N) * prev + Math.sin(-2*Math.PI*k/N) * output_i[offset + factor*(k + offset_out + Math.round(N/2))];
                output_i[offset + factor*(offset_out + k + Math.round(N/2))] = t_i - Math.sin(-2*Math.PI*k/N) * prev - Math.cos(-2*Math.PI*k/N) * output_i[offset + factor*(k + offset_out + Math.round(N/2))];
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
        fft_step(input_r, input_i, output_r, output_i, 0, 0, input_r.length, 1, 0, 1);

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
        fft_step(input_i, input_r, output_i, output_r, 0, 0, input_r.length, 1, 0, 1);
        
        return {r: output_r, i: output_i};
    };

    var fft2d = function(input, n1, n2) {
        var output_r = new Float32Array(n1 * n2);
        var output_i = new Float32Array(n1 * n2);

        var input_r, input_i;
        if(input.r == undefined || input.i == undefined) {
            input_r = input;
            input_i = new Float32Array(input_r.length);
        } else {
            input_r = input.r;
            input_i = input.i;
        }

        for(var i = 0; i < n1; i++) {
            fft_step(input_r, input_i, output_r, output_i, 0, 0, n2, 1, i * n2, 1);
        }
        input_r = new Float32Array(output_r);
        input_i = new Float32Array(output_i);
        for(var i = 0; i < n2; i++) {
            fft_step(input_r, input_i, output_r, output_i, 0, 0, n1, 1, i, n1);
        }

        return {r: output_r, i: output_i};
    };

    return {
        fft1d: fft1d,
        ifft1d: ifft1d,
        fft2d: fft2d
    };
}();