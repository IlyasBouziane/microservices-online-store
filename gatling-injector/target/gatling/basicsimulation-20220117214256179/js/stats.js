var stats = {
    type: "GROUP",
name: "Global Information",
path: "",
pathFormatted: "group_missing-name-b06d1",
stats: {
    "name": "Global Information",
    "numberOfRequests": {
        "total": "48",
        "ok": "48",
        "ko": "0"
    },
    "minResponseTime": {
        "total": "101",
        "ok": "101",
        "ko": "-"
    },
    "maxResponseTime": {
        "total": "4587",
        "ok": "4587",
        "ko": "-"
    },
    "meanResponseTime": {
        "total": "302",
        "ok": "302",
        "ko": "-"
    },
    "standardDeviation": {
        "total": "648",
        "ok": "648",
        "ko": "-"
    },
    "percentiles1": {
        "total": "205",
        "ok": "205",
        "ko": "-"
    },
    "percentiles2": {
        "total": "221",
        "ok": "221",
        "ko": "-"
    },
    "percentiles3": {
        "total": "683",
        "ok": "683",
        "ko": "-"
    },
    "percentiles4": {
        "total": "2897",
        "ok": "2897",
        "ko": "-"
    },
    "group1": {
        "name": "t < 800 ms",
        "count": 46,
        "percentage": 96
    },
    "group2": {
        "name": "800 ms < t < 1200 ms",
        "count": 1,
        "percentage": 2
    },
    "group3": {
        "name": "t > 1200 ms",
        "count": 1,
        "percentage": 2
    },
    "group4": {
        "name": "failed",
        "count": 0,
        "percentage": 0
    },
    "meanNumberOfRequestsPerSecond": {
        "total": "0.397",
        "ok": "0.397",
        "ko": "-"
    }
},
contents: {
"req_request-1-46da4": {
        type: "REQUEST",
        name: "request_1",
path: "request_1",
pathFormatted: "req_request-1-46da4",
stats: {
    "name": "request_1",
    "numberOfRequests": {
        "total": "24",
        "ok": "24",
        "ko": "0"
    },
    "minResponseTime": {
        "total": "197",
        "ok": "197",
        "ko": "-"
    },
    "maxResponseTime": {
        "total": "4587",
        "ok": "4587",
        "ko": "-"
    },
    "meanResponseTime": {
        "total": "455",
        "ok": "455",
        "ko": "-"
    },
    "standardDeviation": {
        "total": "880",
        "ok": "880",
        "ko": "-"
    },
    "percentiles1": {
        "total": "217",
        "ok": "217",
        "ko": "-"
    },
    "percentiles2": {
        "total": "231",
        "ok": "231",
        "ko": "-"
    },
    "percentiles3": {
        "total": "952",
        "ok": "952",
        "ko": "-"
    },
    "percentiles4": {
        "total": "3760",
        "ok": "3760",
        "ko": "-"
    },
    "group1": {
        "name": "t < 800 ms",
        "count": 22,
        "percentage": 92
    },
    "group2": {
        "name": "800 ms < t < 1200 ms",
        "count": 1,
        "percentage": 4
    },
    "group3": {
        "name": "t > 1200 ms",
        "count": 1,
        "percentage": 4
    },
    "group4": {
        "name": "failed",
        "count": 0,
        "percentage": 0
    },
    "meanNumberOfRequestsPerSecond": {
        "total": "0.198",
        "ok": "0.198",
        "ko": "-"
    }
}
    },"req_request-1-redir-7e85b": {
        type: "REQUEST",
        name: "request_1 Redirect 1",
path: "request_1 Redirect 1",
pathFormatted: "req_request-1-redir-7e85b",
stats: {
    "name": "request_1 Redirect 1",
    "numberOfRequests": {
        "total": "24",
        "ok": "24",
        "ko": "0"
    },
    "minResponseTime": {
        "total": "101",
        "ok": "101",
        "ko": "-"
    },
    "maxResponseTime": {
        "total": "609",
        "ok": "609",
        "ko": "-"
    },
    "meanResponseTime": {
        "total": "149",
        "ok": "149",
        "ko": "-"
    },
    "standardDeviation": {
        "total": "134",
        "ok": "134",
        "ko": "-"
    },
    "percentiles1": {
        "total": "108",
        "ok": "108",
        "ko": "-"
    },
    "percentiles2": {
        "total": "111",
        "ok": "111",
        "ko": "-"
    },
    "percentiles3": {
        "total": "511",
        "ok": "511",
        "ko": "-"
    },
    "percentiles4": {
        "total": "601",
        "ok": "601",
        "ko": "-"
    },
    "group1": {
        "name": "t < 800 ms",
        "count": 24,
        "percentage": 100
    },
    "group2": {
        "name": "800 ms < t < 1200 ms",
        "count": 0,
        "percentage": 0
    },
    "group3": {
        "name": "t > 1200 ms",
        "count": 0,
        "percentage": 0
    },
    "group4": {
        "name": "failed",
        "count": 0,
        "percentage": 0
    },
    "meanNumberOfRequestsPerSecond": {
        "total": "0.198",
        "ok": "0.198",
        "ko": "-"
    }
}
    }
}

}

function fillStats(stat){
    $("#numberOfRequests").append(stat.numberOfRequests.total);
    $("#numberOfRequestsOK").append(stat.numberOfRequests.ok);
    $("#numberOfRequestsKO").append(stat.numberOfRequests.ko);

    $("#minResponseTime").append(stat.minResponseTime.total);
    $("#minResponseTimeOK").append(stat.minResponseTime.ok);
    $("#minResponseTimeKO").append(stat.minResponseTime.ko);

    $("#maxResponseTime").append(stat.maxResponseTime.total);
    $("#maxResponseTimeOK").append(stat.maxResponseTime.ok);
    $("#maxResponseTimeKO").append(stat.maxResponseTime.ko);

    $("#meanResponseTime").append(stat.meanResponseTime.total);
    $("#meanResponseTimeOK").append(stat.meanResponseTime.ok);
    $("#meanResponseTimeKO").append(stat.meanResponseTime.ko);

    $("#standardDeviation").append(stat.standardDeviation.total);
    $("#standardDeviationOK").append(stat.standardDeviation.ok);
    $("#standardDeviationKO").append(stat.standardDeviation.ko);

    $("#percentiles1").append(stat.percentiles1.total);
    $("#percentiles1OK").append(stat.percentiles1.ok);
    $("#percentiles1KO").append(stat.percentiles1.ko);

    $("#percentiles2").append(stat.percentiles2.total);
    $("#percentiles2OK").append(stat.percentiles2.ok);
    $("#percentiles2KO").append(stat.percentiles2.ko);

    $("#percentiles3").append(stat.percentiles3.total);
    $("#percentiles3OK").append(stat.percentiles3.ok);
    $("#percentiles3KO").append(stat.percentiles3.ko);

    $("#percentiles4").append(stat.percentiles4.total);
    $("#percentiles4OK").append(stat.percentiles4.ok);
    $("#percentiles4KO").append(stat.percentiles4.ko);

    $("#meanNumberOfRequestsPerSecond").append(stat.meanNumberOfRequestsPerSecond.total);
    $("#meanNumberOfRequestsPerSecondOK").append(stat.meanNumberOfRequestsPerSecond.ok);
    $("#meanNumberOfRequestsPerSecondKO").append(stat.meanNumberOfRequestsPerSecond.ko);
}
