/**
 *  +----------------------------------------------------------------
 *  Kina浏览器插件
 *  +----------------------------------------------------------------
 * @author caozelin@gsdata.cn
 *  +----------------------------------------------------------------
 */
(function () {
    var markId = 0
        , rangeCurrent = {}
        , rangeText = ''
        , theme = require("ace/theme/textmate")
        , Split = require("ace/split").Split
        , container = document.getElementById("kina_editor_container")
        , toolDom = document.getElementById('tool')
        , extendDom = $('.extend')

    if (!container) {
        return false;
    }

    var split = new Split(container, theme, 2)
        , editor = split.getEditor(0)
        , output = split.getEditor(1)

    editor.on('changeSelection', function () {
        setRangeHighlight();
    })

    editor.session.on('changeScrollTop', function () {
        if (document.getElementsByClassName('acc').length > 0) {
            toolDom.style.top = document.getElementsByClassName('acc')[0].style.top
            toolDom.style.display = 'block'
        } else {
            toolDom.style.display = 'none'
            toolDom.style.top = '0px'
        }
    })

    // 监听窗口变化
    window.onresize = function () {
        split.resize()
    }

    if (window.localStorage.session) {
        editor.session.setValue(window.localStorage.session)
    } else {
        let endStamp = Date.parse(new Date())
            , startStamp = endStamp - 30 * 24 * 3600 * 1000
        editor.session.setValue(JSON.stringify({
            "index": "wx",
            "statement": {
                "from": 0,
                "size": 20
            },
            "startStamp": startStamp,
            "endStamp": endStamp,
        }, null, '\t'));
    }

    if (window.localStorage.url) {
        $('textarea[name=url]').val(window.localStorage.url)
    }

    if (window.localStorage.Authorization) {
        $('.detail textarea:eq(0)').val(window.localStorage.Authorization)
    }

    toolDom.style.right = (container.clientWidth / 2 + 24) + 'px'

    editor.session.setMode("ace/mode/json");
    output.session.setMode("ace/mode/json");

    // 设置字号
    split.setFontSize(14);

    // 编辑框灰色线
    editor.setShowPrintMargin(true);

    // 代码高亮
    editor.setHighlightActiveLine(true);

    editor.setOptions({
        autoScrollEditorIntoView: true, // 自动滚动编辑器视图
        enableBasicAutocompletion: false,// 启用基本完成 不推荐使用
        enableSnippets: false,// 启用代码段
        enableLiveAutocompletion: true // 智能补全
    });

    var beautify = ace.require("ace/ext/beautify");
    beautify.beautify(editor.session);

    // 自定义代码提示
    ace.config.loadModule("ace/ext/language_tools", function (module) {
        let _comp_cfg = require("ace/ext/json")._comp_cfg;
        module.addCompleter({
            getCompletions: function (editor, session, pos, prefix, callback) {
                if (prefix.length === 0) {
                    callback(null, []);
                    return
                }
                callback(null, _comp_cfg.map(function (c) {
                    return {
                        value: c.name,
                        meta: c.meta,
                        completer: {
                            insertMatch: function (editor, data) {
                                if (editor.completer.completions.filterText) {
                                    var ranges = editor.selection.getAllRanges();
                                    for (var i = 0, range; range = ranges[i]; i++) {
                                        range.start.column -= editor.completer.completions.filterText.length;
                                        editor.session.remove(range);
                                    }
                                }

                                var _convert = function (num) {
                                    var split = '', i = 0;
                                    while (i < num) {
                                        split += ' ';
                                        i++;
                                    }
                                    return split;
                                }

                                var lastCursor = editor.getCursorPosition()
                                    , lineRange = {
                                        start: {
                                            row: lastCursor.row,
                                            column: 0
                                        },
                                        end: {
                                            row: lastCursor.row,
                                            column: editor.session.getDocumentLastRowColumn(lastCursor.row, lastCursor.column), // 行尾列号
                                        }
                                    }, singleTextOrigin = editor.session.getTextRange(lineRange)
                                    , singleText = singleTextOrigin.replace(/\s*/g, ''),
                                    toPlus = false

                                if (!singleText) {
                                    data.value = '"' + data.value + '"'
                                    toPlus = true
                                } else if (singleText === '"') {
                                    // 判断光标在引号左右侧
                                    let cursorRange = lineRange
                                    cursorRange.end.column = lastCursor.column
                                    let cursorText = editor.session.getTextRange(cursorRange)
                                        , _index = cursorText.indexOf('"')
                                        , _indexOrigin = singleTextOrigin.indexOf('"')

                                    if (_index !== -1) {
                                        let tmpStr = cursorText.slice(_index + 1)
                                        editor.session.replace({
                                            start: {row: lastCursor.row, column: lastCursor.column - tmpStr.length},
                                            end: {row: lastCursor.row, column: lastCursor.column}
                                        }, '')

                                        data.value += '"'
                                    } else {
                                        let tmpStr = singleTextOrigin.slice(0, _indexOrigin)
                                        tmpStr = tmpStr.slice(cursorText.length)
                                        editor.session.replace({
                                            start: {row: lastCursor.row, column: lastCursor.column},
                                            end: {row: lastCursor.row, column: lastCursor.column + tmpStr.length}
                                        }, '')

                                        data.value = '"' + data.value
                                    }
                                    toPlus = true
                                } else if (singleText === '""') {
                                    toPlus = true
                                } else {
                                    try {
                                        // 查找"xxxx"内容并替换
                                        let _t = /"([a-zA-Z0-9_\-\s]+)"/.exec(singleTextOrigin)[1]
                                        if (_t) {
                                            let cursorRange = lineRange
                                            cursorRange.end.column = lastCursor.column
                                            let cursorText = editor.session.getTextRange(cursorRange)
                                            // 替换原内容
                                            let _f = /([\s]*)$/.exec(cursorText)[1]
                                            editor.session.replace({
                                                start: {row: lastCursor.row, column: lastCursor.column},
                                                end: {row: lastCursor.row, column: lastCursor.column + _t.length - _f.length}
                                            }, '')
                                        }
                                    } catch (e) {
                                    }
                                }
                                // console.log(singleTextOrigin, singleText)
                                editor.execCommand("insertstring", data.value);

                                var cursor = editor.getCursorPosition();
                                cursor.column = cursor.column + 1
                                if (c.extend !== undefined && toPlus) {
                                    // 填充缩进
                                    var extendStr = c.extend
                                    extendStr = extendStr.replace(/#\d+#/g, function (word) {
                                        return _convert(word.replace(/#/g, '')) + _convert(cursor.column - c.value.length - 5)
                                    });
                                    // console.log(cursor.column, c.value.length)
                                    editor.session.insert(cursor, extendStr)
                                    // 移动光标位置
                                    if (!c.charAt) {
                                        c.charAt = extendStr.length
                                    }
                                    cursor.column = cursor.column + c.charAt
                                    editor.moveCursorToPosition(cursor)
                                }
                            }
                        }
                    };
                }));
            }
        });
    })

    // 高亮指定区域块，加背景色
    function setRangeHighlight() {
        var foldWidgetsList = editor.session.foldWidgets
            , cursor = editor.getCursorPosition()
            , currentRow = cursor.row
            , lastMarkId = markId
        try {
            foldWidgetsList.forEach(function (v, k) {
                if (v == 'start') {
                    // 计算折叠区域
                    var range = editor.session.getFoldWidgetRange(k)
                    if (range.start.row <= currentRow && range.end.row >= currentRow) {
                        if (markId > 0) {
                            editor.session.removeMarker(markId)
                        }
                        var targetRange = editor.session.highlightLines(range.start.row, range.end.row, 'acc', true)
                        markId = targetRange.id
                        rangeCurrent = targetRange
                        rangeText = editor.session.getTextRange(targetRange)
                        // 计算工具栏位置
                        setTimeout(function () {
                            if (document.getElementsByClassName('acc').length > 0) {
                                toolDom.style.top = document.getElementsByClassName('acc')[0].style.top
                                toolDom.style.display = 'block'
                            }
                        }, 300)
                        throw new Error('End Loop') // 终止循环
                    }
                }
            })

            // 验证单行内容
            if (markId === lastMarkId) {
                var rangeConvert = {
                    start: {
                        row: cursor.row,
                        column: 0
                    },
                    end: {
                        row: cursor.row,
                        column: editor.session.getDocumentLastRowColumn(cursor.row, cursor.column), // 行尾列号
                    }
                }, singleText = editor.session.getTextRange(rangeConvert)
                if (singleText && singleText[0] === '{' && singleText[singleText.length - 1] === '}') {
                    if (markId > 0) {
                        editor.session.removeMarker(markId)
                    }
                    var targetRange = editor.session.highlightLines(rangeConvert.start.row, rangeConvert.end.row, 'acc', true)
                    markId = targetRange.id
                    rangeCurrent = targetRange
                    rangeText = singleText
                    // 计算工具栏位置
                    setTimeout(function () {
                        if (document.getElementsByClassName('acc').length > 0) {
                            toolDom.style.top = document.getElementsByClassName('acc')[0].style.top
                            toolDom.style.display = 'block'
                        }
                    }, 300)
                }
            }

            if (markId === lastMarkId) {
                editor.session.removeMarker(markId)
                toolDom.style.display = 'none'
                toolDom.style.top = '0px'
            }
        } catch (e) {
            // console.log(e)
        }
    }

    $('.run').click(function () {
        var headers = {}
            , url = $('textarea[name=url]').val()
        // 验证JSON格式
        try {
            var content = JSON.parse(rangeText)
            content.statement = JSON.stringify(content.statement)
        } catch (e) {
            layer.msg('请检查JSON格式', {icon: 2});
            return false;
        }
        if (url == '') {
            layer.msg('请检查网关地址', {icon: 2});
            return false;
        }
        $('.headerInfo .detail').each(function () {
            var key = $(this).find('input').val()
                , value = $(this).find('textarea').val()
            if (key) {
                headers[key] = value;
            }
        })
        if ($.isEmptyObject(headers) || headers.Authorization === undefined || headers.Authorization === '') {
            layer.msg('请检查头部信息', {icon: 2});
            return false;
        }

        var index = layer.load(2, {
            shade: [0.1, '#fff'],
            time: 1000
        });
        setTimeout(function () {
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                headers: headers,
                async: false,
                data: JSON.stringify(content),
                dataType: 'JSON',
                success: function (res) {
                    if (typeof res == 'object') {
                        res = JSON.stringify(res, null, '\t')
                    }
                    // console.log(res)
                    output.session.setValue(res)
                },
                error: function (XMLHttpRequest, textStatus) {
                    try {
                        var response = JSON.parse(XMLHttpRequest.responseText)
                    } catch (e) {
                        var response = {
                            'code': 500,
                            'msg': '请求失败'
                        }
                    }
                    output.session.setValue(JSON.stringify(response, null, '\t'))
                },
                complete: function () {
                    layer.close(index);
                }
            })
        }, 800)
    })

    $('.format').click(function () {
        try {
            var obj = JSON.parse(rangeText)
            var strJson = JSON.stringify(obj, null, '\t')
        } catch (e) {
            layer.msg('请检查JSON格式', {icon: 2});
            return false;
        }
        editor.session.replace(rangeCurrent, strJson);
        editor.scrollToRow(rangeCurrent.start.row)
        extendDom.hide();
    })

    $('.copy').click(function () {
        try {
            var obj = JSON.parse(rangeText)
            var strJson = JSON.stringify(obj, null, '\t')
        } catch (e) {
            layer.msg('请检查JSON格式', {icon: 2});
            return false;
        }
        var copyTextarea = document.querySelector('#clipboard');
        copyTextarea.value = strJson;
        copyTextarea.select();
        document.execCommand('copy');
        copyTextarea.value = '';
        extendDom.hide();
        layer.msg('复制成功', {icon: 1});
    })

    $('.more i').click(function () {
        extendDom.is(':hidden') ? extendDom.show() : extendDom.hide()
    })

    $("body").click(function (e) {
        if (!$(e.target).closest('.more').length) {
            extendDom.hide();
        }
    });

    $(window).bind('beforeunload unload', function (e) {
        window.localStorage.session = editor.session.getValue()
        window.localStorage.url = $('textarea[name=url]').val()
        window.localStorage.Authorization = $('.detail textarea:eq(0)').val()
    })

}).call(this)