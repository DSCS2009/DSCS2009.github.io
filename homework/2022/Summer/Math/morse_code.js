/*
* @author  liaoyu
* @created 2015-03-14
*/

var utils = utils || {};

utils.isArray = function(value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
}

utils.trim = function(value) {
    return value.trim ? value.trim() : value.replace(/^\s+|\s+$|/g,'');
}

// 解决IE不兼容console问题
var console = console || {};
console.log = console.log || function(){};
console.error = console.error || function(){};

// 使用字典存储摩斯码对照关系
function Dictionary() {
    this.datasource = {};
    this.rdatasource = {};
}

Dictionary.prototype.add = function(keys, values) {
    if(typeof keys === 'undefined' || typeof values === 'undefined') {
        console.error('Illegal arguments');
        return ;
    }
    if(utils.isArray(keys) && utils.isArray(values)) {
        if(keys.length != values.length) {
            console.error('keys length not equals values length');
            return ;
        }
        for(var i = 0; i < keys.length; i++) {
            this.datasource[keys[i]] = values[i];
        }
        return ;
    }
    this.datasource[keys] = values;
}

Dictionary.prototype.reversal = function(){
    var tempData = this.datasource;
    for(var i in tempData) {
        if(tempData.hasOwnProperty(i)) {
            this.rdatasource[tempData[i]] = i;
        }
    }
}

Dictionary.prototype.showAll = function(values) {
    var count = 0;
    console.log('-----------morse code mapping-----------');
    for(var i in values) {
        if(values.hasOwnProperty(i)) {
            count++;
            console.log(i + '\t > ' + values[i]);
        }
    }
    console.log('total count: ' + count);
}

// morse code library
var morse = (function(global){
    var mcode = {},
        r_special = /\<\w+\>/g,
        r_find = /^\<(\w+)\>$/;

    // store datas mapping
    mcode.mdatas = (function(){
        var dictionaryDS = new Dictionary();
        // initial mappping
        dictionaryDS.add(
            [
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '1','2','3','4','5','6','7','8','9','0',
                'AA','AR','AS','BK','BT','CT','SK','SOS',
                '.',':',',',';','?','=',"'",'/','!','-','_','"','(',')','$','&','@','+'
            ],
            [
                // letter
                '.-','-...','-.-.','-..','.','..-.','--.','....','..','.---','-.-','.-..','--','-.','---','.--.','--.-','.-.','...','-','..-','...-','.--','-..-','-.--','--..',
                // number 
                '.----','..---','...--','....-','.....','-....','--...','---..','----.','-----',
                // special charactor
                '.-.-','.-.-.','.-...','-...-.-','-...-','-.-.-','...-.-','...---...',
                // punctuation
                '.-.-.-','---...','--..--','-.-.-.','..--..','-...-','.----.','-..-.','-.-.--','-....-','..--.-','.-..-.','-.--.','-.--.-','...-..-','.-...','.--.-.','.-.-.'
            ]
        );
        return dictionaryDS;
    }());
    
    // error flag
    mcode.error_flag = false;

    // 将字符串转换为摩斯码
    mcode.parse = function(values) {
        // console.log('input: ' + values);
        this.error_flag = false;

        var _datasource = this.mdatas.datasource,
            item = '',
            a_special = [],
            a_temp = [],
            a_value = [],
            count = 0,
            result = '';
        values = values.toUpperCase();
        a_special = values.match(r_special);
        a_temp = values.split(r_special);

        // 将用户输入的字符串转换成数组
        for(var i=0; i<a_temp.length; i++) {
            item = a_temp[i];
            if(item !== '') {
                // IE无法通过下标来索引字符串
                if(!item[0]){
                    item = item.split('');
                }
                for(var j=0; j<item.length; j++) {
                    a_value[count++] = item[j];
                }
            }

            // 当前字符串为<AS>形式，提取AS字符
            if(i !== a_temp.length - 1){
                a_value[count++] = a_special[i].match(r_find)[1];
            }
        }

        // 将解析数组形式的用户输入值
        for(var i=0; i<a_value.length; i++) {
            item = a_value[i];

            if(item === ' ') {
                result += '/ ';
            } else if(typeof _datasource[item] === 'undefined') {
                this.error_flag = true;
                // console.error('Invalid characters in input.')
                result += '? ';
            }else {
                result += _datasource[item] + ' ';
            }
        }
        return utils.trim(result);
    }

    //将摩斯码转换成字符串
    mcode.decode = function(values) {
        // console.log('input: ' + values);
        this.error_flag = false;

        this.mdatas.reversal();
        var _rdatasource = this.mdatas.rdatasource,
            a_input = values.split(' '),
            result = '',
            item = '',
            c_result = '';

        for(var i=0; i<a_input.length; i++) {
            item = a_input[i];
            if(item === '/') {
                result += ' ';
            }else {
                c_result = _rdatasource[item];
                if(typeof c_result === 'undefined') {
                    this.error_flag = true;
                    // console.error('Invalid characters in input.')
                    result += '?';
                } else {
                    if(c_result.length > 1){
                        result += '<' + c_result + '>';
                    } else {
                        result += c_result;
                    }
                }
            }
        }
        return result;
    }

    return mcode;
}(this));