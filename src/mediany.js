/* Copyright (c) 2016 Jonathan Holst. Made available under the MIT License */

'use strict';

function bootstrapMediany (window) {
    var document = window.document,
        breakPoints = {};

    function Mediany (mediaQuery) {
        this.mediaQuery = mediaQuery;
        this.rules = [];
    }

    Mediany.prototype.handle = function (selector, event, callback) {
        this.rules.push([selector, event, callback]);

        checkBreakPoints();

        if ('addEventListener' in window) {
            window.addEventListener('resize', checkBreakPoints);
        }

        return this;
    }

    function applyRules (rules, eventListenerMethod) {
        if ('forEach' in rules &&
            'querySelectorAll' in document &&
            eventListenerMethod in window) {
            rules.forEach(function (rule) {
                var nodes = document.querySelectorAll(rule[0]),
                    event = rule[1],
                    callback = rule[2];

                for (var i = 0; i < nodes.length; i++) {
                    nodes[i][eventListenerMethod](event, callback);
                }
            });
        }
    }

    function checkBreakPoints () {
        // If we don't have access to the matchMedia API, there is really
        // nothing we can add to the user's experience.
        if ('matchMedia' in window) {
            for (var mediaQuery in breakPoints) {
                if (breakPoints.hasOwnProperty(mediaQuery)) {
                    applyRules(breakPoints[mediaQuery].rules,
                               window.matchMedia(mediaQuery).matches
                               ? 'addEventListener'
                               : 'removeEventListener');
                }
            }
        }
    }

    function mediany (mediaQuery) {
        if (!breakPoints.hasOwnProperty(mediaQuery)) {
            breakPoints[mediaQuery] = new Mediany(mediaQuery);
        }

        return breakPoints[mediaQuery];
    }

    return mediany;
}

var mediany = bootstrapMediany(this);
