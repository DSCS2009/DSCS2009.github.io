// Converts an integer (unicode value) to a char
function itoa(i) {
    return String.fromCharCode(i);
}

// Converts a char into to an integer (unicode value)
function atoi(a) {
    return a.charCodeAt();
}

function StringToBinCode(s) {
    let result = ""
    for(var i = 0, len = s.length; i < len; i++) {
        let next_str = atoi(s[i]).toString(2)
        for(var j = 0; j < 8 - next_str.length; j++) {
            result += "0"
        }
        result += next_str
    }
    return result
}

function BinCodeUpgrade(bin, f) {
    bin_plus = ""
    for(var i = 0, len = bin.length; i < len; i++) {
        for(var j = 1; j <= f; j++) {
            bin_plus += bin[i]
        }
    }
    return bin_plus
}

function SendTryMorse(s, f) {
    result = ""
    for(var i = 0, len = s.length; i < len; i++) {
        if(s[i] == ' ') {
            result += ' '
            continue
        }
        const failed_str = [".", "-", "/", ""]
        if(Math.random() > f) result += s[i]
        else {
            let add_str = s[i]
            while(add_str == s[i]) {
                add_str = failed_str[parseInt(Math.floor(Math.random() * 3.0))]
            }
            result += add_str
        }
    }
    return result
}

function SendTryBin(s, f) {
    result = ""
    for(var i = 0, len = s.length; i < len; i++) {
        if(Math.random() > f) result += s[i]
        else {
            if(s[i] == '0') result += '1'
            else result += '0'
        }
    }
    return result
}

function BinCodeToString(s) {
    let result = "", sum = 0
    for(var i = 0; i < s.length; i++) {
        sum = sum * 2 + s[i].charCodeAt() - 48
        if(i % 8 == 7) {
            result += String.fromCharCode(sum)
            sum = 0
        }
    }
    return result
}

function FixedBinCode(s, f) {
    let result = "", cnt = [0, 0]
    for(var i = 0; i < s.length; i++) {
        if(s[i] == '0') cnt[0]++
        else cnt[1]++
        if(i % f == f - 1) {
            if(cnt[0] > cnt[1]) result += '0'
            else result += '1'
            cnt = [0, 0]
        }
    }
    return result
}

function SplitInLines(s, f) {
    let result = ""
    for(var i = 0; i < s.length; i++) {
        result += s[i]
        if(i % f == f - 1) result += '<br>'
    }
    return result
}

function Rebuild() {
    let time_start = Date.now()
    document.getElementById("morse_code").innerHTML = document.getElementById("morse_code").innerHTML.replace(/<br>/g, "")
    document.getElementById("bin_code").innerHTML = document.getElementById("bin_code").innerHTML.replace(/<br>/g, "")
    document.getElementById("bin_code++").innerHTML = document.getElementById("bin_code++").innerHTML.replace(/<br>/g, "")
    document.getElementById("long bin_code++").innerHTML = document.getElementById("long bin_code++").innerHTML.replace(/<br>/g, "")
    let morse_code1 = document.getElementById("morse_code").innerHTML
    let bin_code1 = document.getElementById("bin_code").innerHTML
    let bin_code_plus1 = document.getElementById("bin_code++").innerHTML
    let long_bin_code_plus1 = document.getElementById("long bin_code++").innerHTML
    let chance_input = parseFloat(document.getElementById("chance input").value)
    let morse_code = SendTryMorse(morse_code1, chance_input)
    let bin_code = SendTryBin(bin_code1, chance_input)
    let bin_code_plus = SendTryBin(bin_code_plus1, chance_input)
    let long_bin_code_plus = SendTryBin(long_bin_code_plus1, chance_input)
    document.getElementById("morse_code after send").innerHTML = SplitInLines(morse_code, 50)
    document.getElementById("bin_code after send").innerHTML = SplitInLines(bin_code, 50)
    document.getElementById("bin_code++ after send").innerHTML = SplitInLines(bin_code_plus, 50)
    document.getElementById("long bin_code++ after send").innerHTML = SplitInLines(long_bin_code_plus, 50)
    let masd = morse.decode(morse_code)
    let basd = BinCodeToString(bin_code)
    let bpasd = BinCodeToString(FixedBinCode(bin_code_plus, 3))
    let lbpasd = BinCodeToString(FixedBinCode(long_bin_code_plus, 9))
    document.getElementById("morse_code after send decode").innerHTML = SplitInLines(masd, 50)
    document.getElementById("bin_code after send decode").innerHTML = SplitInLines(basd, 50)
    document.getElementById("bin_code++ after send decode").innerHTML = SplitInLines(bpasd, 50)
    document.getElementById("long bin_code++ after send decode").innerHTML = SplitInLines(lbpasd, 50)
    document.getElementById("morse_code").innerHTML = SplitInLines(morse_code1, 50)
    document.getElementById("bin_code").innerHTML = SplitInLines(bin_code1, 50)
    document.getElementById("bin_code++").innerHTML = SplitInLines(bin_code_plus1, 50)
    document.getElementById("long bin_code++").innerHTML = SplitInLines(long_bin_code_plus1, 50)
    let default_input = document.getElementById("default string input").value
    document.getElementById("md-view2-code").innerHTML = 
    "**本次Rebuild使用了" + (Date.now() - time_start).toString(10) + "ms**\n" + 
    "| 方案 | 共需流量(bit(s)) | 传输正确率 |\n" +
    "|:--------|:---------|:--------|\n" +
    "|1.莫尔斯码|" + morse_code1.length.toString(10) + "(" + (parseFloat(morse_code1.length) / parseFloat(default_input.length * 8)).toString(10) + " x)|" + StringSimilarity(masd, default_input).toString(10) + "%|\n" +
    "|2.二进制码|" + bin_code1.length.toString(10) + "(" + (parseFloat(bin_code1.length) / parseFloat(default_input.length * 8)).toString(10) + " x)|" + StringSimilarity(basd, default_input).toString(10) + "%|\n" +
    "|3.二进制码+纠错|" + bin_code_plus1.length.toString(10) + "(" + (parseFloat(bin_code_plus1.length) / parseFloat(default_input.length * 8)).toString(10) + " x)|" + StringSimilarity(bpasd, default_input).toString(10) + "%|\n" +
    "|4.二进制码+纠错(长版)|" + long_bin_code_plus1.length.toString(10) + "(" + (parseFloat(long_bin_code_plus1.length) / parseFloat(default_input.length * 8)).toString(10) + " x)|" + StringSimilarity(lbpasd, default_input).toString(10) + "%|\n"
    window.onload()
}

let last_input_str = ""

function NewKeywords() {
    document.getElementById("default string input").value = 
        document.getElementById("default string input").value.toUpperCase()
    let input_str = document.getElementById("default string input").value
    document.getElementById("morse_code").innerHTML = morse.parse(input_str)
    if(document.getElementById("morse_code").innerHTML.indexOf('?') != -1) {
        document.getElementById("default string input").value = last_input_str
        NewKeywords()
        return
    }
    document.getElementById("bin_code").innerHTML = StringToBinCode(input_str)
    document.getElementById("bin_code++").innerHTML = BinCodeUpgrade(
        document.getElementById("bin_code").innerHTML, 3
    )
    document.getElementById("long bin_code++").innerHTML = BinCodeUpgrade(
        document.getElementById("bin_code").innerHTML, 9
    )
    last_input_str = input_str
    Rebuild()
}

function UpdateChance() {
    let chance_input = 0.0
    let chance_input_str = document.getElementById("chance input").value
    let point_pos = chance_input_str.indexOf('.')
    let point_len = 0
    if(point_pos != -1) {
        point_len = 114514
        for(var i = chance_input_str.length - 1; i >= point_pos; i--) {
            if(chance_input_str[i] != '0') {
                point_len = chance_input_str.length - i - 1
                break
            }
        }
    }
    chance_input = parseFloat(chance_input_str)
    chance_input = Math.min(Math.max(chance_input, 0.0), 1.0)
    document.getElementById("chance input").value = chance_input.toString(10)
    if(document.getElementById("chance input").value == "NaN") document.getElementById("chance input").value = "0"
    if(point_pos == chance_input_str.length - point_len - 1) document.getElementById("chance input").value += '.'
    for(var i = 1; i <= point_len; i++) document.getElementById("chance input").value += '0'
    Rebuild()
}

function OpenCodesDisplayNone() {
    let show_region = document.getElementById("Codes display none")
    show_region.style.display = "inline"
    let click_button = document.getElementById("open codes display none button")
    click_button.innerHTML = "[单击关闭详细信息]"
    click_button.onclick = function() { CloseCodesDisplayNone(); }
}

function CloseCodesDisplayNone() {
    let show_region = document.getElementById("Codes display none")
    show_region.style.display = "none"
    let click_button = document.getElementById("open codes display none button")
    click_button.innerHTML = "[单击查看详细信息]"
    click_button.onclick = function() { OpenCodesDisplayNone(); }
}