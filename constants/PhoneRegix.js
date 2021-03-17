// const phoneRegExp = /^\+(?:[0-9]?){6,14}[0-9]$/;
// var ksaPhoneRegExp = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
// var ksaPhoneRegExp = new RegExp(/^(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);

var ksaPhoneRegExp = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
var pakPhoneRegExp = new RegExp(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/);

export default {
    ksaPhoneRegExp,
    pakPhoneRegExp,
}