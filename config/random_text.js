exports.random = function(nilai) {
    var result = '';
    var karakter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var karakterPanjang = karakter.length;
    for (let i = 0; i < nilai; i++) {
        result += karakter.charAt(Math.floor(Math.random() * karakterPanjang));
    }
    return result;
} 