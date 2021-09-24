define("ace/ext/json", ["require", "exports", "module"], function (require, exports, module) {
    "use strict";

    exports._comp_cfg = [
        {
            name: "statement",
            value: "statement",
            caption: "statement",
            score: 100,
            meta: "API",
            extend: ": {}",
            charAt: 3
        },
        {
            name: "highlight",
            value: "highlight",
            caption: "highlight",
            score: 100,
            meta: "API",
            extend: ": {}",
            charAt: 3
        },
        {
            name: "query",
            value: "query",
            caption: "query",
            score: 100,
            meta: "API",
            extend: ": {}",
            charAt: 3
        },
        {
            name: "bool",
            value: "bool",
            caption: "bool",
            score: 100,
            meta: "API",
            extend: ": {}",
            charAt: 3
        },
        {
            name: "filter",
            value: "filter",
            caption: "filter",
            score: 100,
            meta: "API",
            extend: ": {}",
            charAt: 3
        },
        {
            name: "field",
            value: "field",
            caption: "field",
            score: 100,
            meta: "API",
            extend: ": {}",
            charAt: 3
        },
        {
            name: "fuzzy",
            value: "fuzzy",
            caption: "fuzzy",
            score: 100,
            meta: "API",
            extend: ": {}",
            charAt: 3
        },
        {
            name: "post_filter",
            value: "post_filter",
            caption: "post_filter",
            score: 100,
            meta: "API",
            extend: ": {}",
            charAt: 3
        },
        {
            name: "should",
            value: "should",
            caption: "should",
            score: 100,
            meta: "API",
            extend: ': [ \n\ #3# {} \n\ #1# ]',
            charAt: 3
        },
        {
            name: "must",
            value: "must",
            caption: "must",
            score: 100,
            meta: "API",
            extend: ': [ \n\ #5# {} \n\ #1# ]',
            charAt: 3
        },
        {
            name: "must_not",
            value: "must_not",
            caption: "must_not",
            score: 100,
            meta: "API",
            extend: ': [ \n\ #5# {} \n\ #1# ]',
            charAt: 3
        },
        {
            name: "minimum_should_match",
            value: "minimum_should_match",
            caption: "minimum_should_match",
            score: 100,
            meta: "API",
            extend: ": 1",
        },
        {
            name: "size",
            value: "size",
            caption: "size",
            score: 100,
            meta: "API",
            extend: ": 20",
        },
        {
            name: "from",
            value: "from",
            caption: "from",
            score: 100,
            meta: "API",
            extend: ": 0",
        },
        {
            name: "index",
            value: "index",
            caption: "index",
            score: 100,
            meta: "API",
            extend: ': ""',
            charAt: 3
        },
        {
            name: "startStamp",
            value: "startStamp",
            caption: "startStamp",
            extend: ': ',
            charAt: 3
        },
        {
            name: "endStamp",
            value: "endStamp",
            caption: "endStamp",
            extend: ': ',
            charAt: 3
        },
        {
            name: "_source",
            value: "_source",
            caption: "_source",
            score: 100,
            meta: "API",
            extend: ': "{field}"'
        },
        {
            name: "sort",
            value: "sort",
            caption: "sort",
            score: 100,
            meta: "API",
            extend: ': [ \n\ #3# { \n\ #6# "FIELD": { \n\ #8# "order": "desc" \n\ #6# } \n\ #3# } \n\ #1# ]',
            charAt: 3
        },
        {
            name: "term",
            value: "term",
            caption: "term",
            score: 100,
            meta: "API",
            extend: ': { \n\ #4# "FIELD": { \n\ #6# "value": "VALUE" \n\ #4# } \n\ #1# }',
        },
        {
            name: "wildcard",
            value: "wildcard",
            caption: "wildcard",
            score: 100,
            meta: "API",
            extend: ': { \n\ #4# "FIELD": { \n\ #6# "value": "VALUE" \n\ #4# } \n\ #1# }',
        },
        {
            name: "terms",
            value: "terms",
            caption: "terms",
            score: 100,
            meta: "API",
            extend: ': { \n\ #4# "FIELD": [ \n\ #6# "VALUE1",\n\ #6# "VALUE2" \n\ #4# ] \n\ #1# }',
        },
        {
            name: "range",
            value: "range",
            caption: "range",
            score: 100,
            meta: "API",
            extend: ': { \n\ #4# "FIELD": { \n\ #6# "gte": 10,\n\ #6# "lte": 20 \n\ #4# } \n\ #1# }',
        },
        {
            name: "match",
            value: "match",
            caption: "match",
            score: 100,
            meta: "API",
            extend: ': { \n\ #5# "FIELD": "TEXT" \n\ #1# }',
            charAt: 3
        },
        {
            name: "match_phrase",
            value: "match_phrase",
            caption: "match_phrase",
            score: 100,
            meta: "API",
            extend: ': { \n\ #5# "FIELD": "PHRASE" \n\ #1# }',
        },
        {
            name: "match_phrase_prefix",
            value: "match_phrase_prefix",
            caption: "match_phrase_prefix",
            score: 100,
            meta: "API",
            extend: ': { \n\ #5# "FIELD": "PREFIX" \n\ #1# }',
        },
        {
            name: "aggs",
            value: "aggs",
            caption: "aggs",
            score: 100,
            meta: "API",
            extend: ': { \n\ #6# "NAME": { \n\ #8# "AGG_TYPE": {} \n\ #6# } \n\ #1# }',
        },
        {
            name: "prefix",
            value: "prefix",
            caption: "prefix",
            score: 100,
            meta: "API",
            extend: ': { \n\ #6# "FIELD": { \n\ #8# "value": "" \n\ #6# } \n\ #1# }',
        },
        {
            name: "multi_match",
            value: "multi_match",
            caption: "multi_match",
            score: 100,
            meta: "API",
            extend: ': { \n\ #6# "query": "",\n\ #6# "fields": [] \n\ #1# }',
        },
    ]
})
;(function () {
    window.require(["ace/ext/json"], function (m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();
