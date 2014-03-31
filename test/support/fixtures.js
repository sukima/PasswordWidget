/*!
Fixtures - browserify compatible non Jasmine based fixtures.

Modified from jasmine-jquery* https://github.com/velesin/jasmine-jquery
  *(Copyright (c) 2010-2014 Wojciech Zawistowski, Travis Jeffery)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

+function (window, mocha, $) { "use strict";

  mocha.spiedEventsKey = function (selector, eventName) {
    return [$(selector).selector, eventName].toString()
  }

  mocha.getFixtures = function () {
    return mocha.currentFixtures_ = mocha.currentFixtures_ || new mocha.Fixtures()
  }

  mocha.getStyleFixtures = function () {
    return mocha.currentStyleFixtures_ = mocha.currentStyleFixtures_ || new mocha.StyleFixtures()
  }

  mocha.Fixtures = function () {
    this.containerId = 'mocha-fixtures'
    this.fixturesCache_ = {}
    this.fixturesPath = 'spec/javascripts/fixtures'
  }

  mocha.Fixtures.prototype.set = function (html) {
    this.cleanUp()
    return this.createContainer_(html)
  }

  mocha.Fixtures.prototype.appendSet= function (html) {
    this.addToContainer_(html)
  }

  mocha.Fixtures.prototype.preload = function () {
    this.read.apply(this, arguments)
  }

  mocha.Fixtures.prototype.load = function () {
    this.cleanUp()
    this.createContainer_(this.read.apply(this, arguments))
  }

  mocha.Fixtures.prototype.appendLoad = function () {
    this.addToContainer_(this.read.apply(this, arguments))
  }

  mocha.Fixtures.prototype.read = function () {
    var htmlChunks = []
      , fixtureUrls = arguments

    for(var urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++) {
      htmlChunks.push(this.getFixtureHtml_(fixtureUrls[urlIndex]))
    }

    return htmlChunks.join('')
  }

  mocha.Fixtures.prototype.clearCache = function () {
    this.fixturesCache_ = {}
  }

  mocha.Fixtures.prototype.cleanUp = function () {
    $('#' + this.containerId).remove()
  }

  mocha.Fixtures.prototype.sandbox = function (attributes) {
    var attributesToSet = attributes || {}
    return $('<div id="sandbox" />').attr(attributesToSet)
  }

  mocha.Fixtures.prototype.createContainer_ = function (html) {
    var container = $('<div>')
    .attr('id', this.containerId)
    .html(html)
    .css({
      position: 'fixed',
      top: '-9000px',
      left: '-9000px'
    })

    $(document.body).append(container)
    return container
  }

  mocha.Fixtures.prototype.addToContainer_ = function (html){
    var container = $(document.body).find('#'+this.containerId).append(html)

    if (!container.length) {
      this.createContainer_(html)
    }
  }

  mocha.Fixtures.prototype.getFixtureHtml_ = function (url) {
    if (typeof this.fixturesCache_[url] === 'undefined') {
      this.loadFixtureIntoCache_(url)
    }
    return this.fixturesCache_[url]
  }

  mocha.Fixtures.prototype.loadFixtureIntoCache_ = function (relativeUrl) {
    var self = this
      , url = this.makeFixtureUrl_(relativeUrl)
      , htmlText = ''
      , request = $.ajax({
        async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
        cache: false,
        url: url,
        success: function (data, status, $xhr) {
          htmlText = $xhr.responseText
        }
      }).fail(function ($xhr, status, err) {
          throw new Error('Fixture could not be loaded: ' + url + ' (status: ' + status + ', message: ' + err.message + ')')
      })

      var scripts = $($.parseHTML(htmlText, true)).find('script[src]') || [];

      scripts.each(function(){
        $.ajax({
            async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
            cache: false,
            dataType: 'script',
            url: $(this).attr('src'),
            success: function (data, status, $xhr) {
                htmlText += '<script>' + $xhr.responseText + '</script>'
            },
            error: function ($xhr, status, err) {
                throw new Error('Script could not be loaded: ' + scriptSrc + ' (status: ' + status + ', message: ' + err.message + ')')
            }
        });
      })

      self.fixturesCache_[relativeUrl] = htmlText;
  }

  mocha.Fixtures.prototype.makeFixtureUrl_ = function (relativeUrl){
    return this.fixturesPath.match('/$') ? this.fixturesPath + relativeUrl : this.fixturesPath + '/' + relativeUrl
  }

  mocha.Fixtures.prototype.proxyCallTo_ = function (methodName, passedArguments) {
    return this[methodName].apply(this, passedArguments)
  }


  mocha.StyleFixtures = function () {
    this.fixturesCache_ = {}
    this.fixturesNodes_ = []
    this.fixturesPath = 'spec/javascripts/fixtures'
  }

  mocha.StyleFixtures.prototype.set = function (css) {
    this.cleanUp()
    this.createStyle_(css)
  }

  mocha.StyleFixtures.prototype.appendSet = function (css) {
    this.createStyle_(css)
  }

  mocha.StyleFixtures.prototype.preload = function () {
    this.read_.apply(this, arguments)
  }

  mocha.StyleFixtures.prototype.load = function () {
    this.cleanUp()
    this.createStyle_(this.read_.apply(this, arguments))
  }

  mocha.StyleFixtures.prototype.appendLoad = function () {
    this.createStyle_(this.read_.apply(this, arguments))
  }

  mocha.StyleFixtures.prototype.cleanUp = function () {
    while(this.fixturesNodes_.length) {
      this.fixturesNodes_.pop().remove()
    }
  }

  mocha.StyleFixtures.prototype.createStyle_ = function (html) {
    var styleText = $('<div></div>').html(html).text()
      , style = $('<style>' + styleText + '</style>')

    this.fixturesNodes_.push(style)
    $('head').append(style)
  }

  mocha.StyleFixtures.prototype.clearCache = mocha.Fixtures.prototype.clearCache
  mocha.StyleFixtures.prototype.read_ = mocha.Fixtures.prototype.read
  mocha.StyleFixtures.prototype.getFixtureHtml_ = mocha.Fixtures.prototype.getFixtureHtml_
  mocha.StyleFixtures.prototype.loadFixtureIntoCache_ = mocha.Fixtures.prototype.loadFixtureIntoCache_
  mocha.StyleFixtures.prototype.makeFixtureUrl_ = mocha.Fixtures.prototype.makeFixtureUrl_
  mocha.StyleFixtures.prototype.proxyCallTo_ = mocha.Fixtures.prototype.proxyCallTo_

  mocha.getJSONFixtures = function () {
    return mocha.currentJSONFixtures_ = mocha.currentJSONFixtures_ || new mocha.JSONFixtures()
  }

  mocha.JSONFixtures = function () {
    this.fixturesCache_ = {}
    this.fixturesPath = 'spec/javascripts/fixtures/json'
  }

  mocha.JSONFixtures.prototype.load = function () {
    this.read.apply(this, arguments)
    return this.fixturesCache_
  }

  mocha.JSONFixtures.prototype.read = function () {
    var fixtureUrls = arguments

    for(var urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++) {
      this.getFixtureData_(fixtureUrls[urlIndex])
    }

    return this.fixturesCache_
  }

  mocha.JSONFixtures.prototype.clearCache = function () {
    this.fixturesCache_ = {}
  }

  mocha.JSONFixtures.prototype.getFixtureData_ = function (url) {
    if (!this.fixturesCache_[url]) this.loadFixtureIntoCache_(url)
    return this.fixturesCache_[url]
  }

  mocha.JSONFixtures.prototype.loadFixtureIntoCache_ = function (relativeUrl) {
    var self = this
      , url = this.fixturesPath.match('/$') ? this.fixturesPath + relativeUrl : this.fixturesPath + '/' + relativeUrl

    $.ajax({
      async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
      cache: false,
      dataType: 'json',
      url: url,
      success: function (data) {
        self.fixturesCache_[relativeUrl] = data
      },
      error: function ($xhr, status, err) {
        throw new Error('JSONFixture could not be loaded: ' + url + ' (status: ' + status + ', message: ' + err.message + ')')
      }
    })
  }

  mocha.JSONFixtures.prototype.proxyCallTo_ = function (methodName, passedArguments) {
    return this[methodName].apply(this, passedArguments)
  }

  mocha.jQuery = function () {}

  mocha.jQuery.browserTagCaseIndependentHtml = function (html) {
    return $('<div/>').append(html).html()
  }

  mocha.jQuery.elementToString = function (element) {
    return $(element).map(function () { return this.outerHTML; }).toArray().join(', ')
  }

  var data = {
      spiedEvents: {}
    , handlers:    []
  }

  mocha.jQuery.events = {
    spyOn: function (selector, eventName) {
      var handler = function (e) {
        data.spiedEvents[mocha.spiedEventsKey(selector, eventName)] = Array.prototype.slice.call(arguments, 0)
      }

      $(selector).on(eventName, handler)
      data.handlers.push(handler)

      return {
        selector: selector,
        eventName: eventName,
        handler: handler,
        reset: function (){
          delete data.spiedEvents[mocha.spiedEventsKey(selector, eventName)]
        }
      }
    },

    args: function (selector, eventName) {
      var actualArgs = data.spiedEvents[mocha.spiedEventsKey(selector, eventName)]

      if (!actualArgs) {
        throw "There is no spy for " + eventName + " on " + selector.toString() + ". Make sure to create a spy using spyOnEvent."
      }

      return actualArgs
    },

    wasTriggered: function (selector, eventName) {
      return !!(data.spiedEvents[mocha.spiedEventsKey(selector, eventName)])
    },

    wasTriggeredWith: function (selector, eventName, expectedArgs, util, customEqualityTesters) {
      var actualArgs = mocha.jQuery.events.args(selector, eventName).slice(1)

      if (Object.prototype.toString.call(expectedArgs) !== '[object Array]')
        actualArgs = actualArgs[0]

      return util.equals(expectedArgs, actualArgs, customEqualityTesters)
    },

    wasPrevented: function (selector, eventName) {
      var args = data.spiedEvents[mocha.spiedEventsKey(selector, eventName)]
        , e = args ? args[0] : undefined

      return e && e.isDefaultPrevented()
    },

    wasStopped: function (selector, eventName) {
      var args = data.spiedEvents[mocha.spiedEventsKey(selector, eventName)]
        , e = args ? args[0] : undefined
      return e && e.isPropagationStopped()
    },

    cleanUp: function () {
      data.spiedEvents = {}
      data.handlers    = []
    }
  }

  var hasProperty = function (actualValue, expectedValue) {
    if (expectedValue === undefined)
      return actualValue !== undefined

    return actualValue === expectedValue
  }

  window.readFixtures = function () {
    return mocha.getFixtures().proxyCallTo_('read', arguments)
  }

  window.preloadFixtures = function () {
    mocha.getFixtures().proxyCallTo_('preload', arguments)
  }

  window.loadFixtures = function () {
    mocha.getFixtures().proxyCallTo_('load', arguments)
  }

  window.appendLoadFixtures = function () {
    mocha.getFixtures().proxyCallTo_('appendLoad', arguments)
  }

  window.setFixtures = function (html) {
    return mocha.getFixtures().proxyCallTo_('set', arguments)
  }

  window.appendSetFixtures = function () {
    mocha.getFixtures().proxyCallTo_('appendSet', arguments)
  }

  window.sandbox = function (attributes) {
    return mocha.getFixtures().sandbox(attributes)
  }

  window.spyOnEvent = function (selector, eventName) {
    return mocha.jQuery.events.spyOn(selector, eventName)
  }

  window.preloadStyleFixtures = function () {
    mocha.getStyleFixtures().proxyCallTo_('preload', arguments)
  }

  window.loadStyleFixtures = function () {
    mocha.getStyleFixtures().proxyCallTo_('load', arguments)
  }

  window.appendLoadStyleFixtures = function () {
    mocha.getStyleFixtures().proxyCallTo_('appendLoad', arguments)
  }

  window.setStyleFixtures = function (html) {
    mocha.getStyleFixtures().proxyCallTo_('set', arguments)
  }

  window.appendSetStyleFixtures = function (html) {
    mocha.getStyleFixtures().proxyCallTo_('appendSet', arguments)
  }

  window.loadJSONFixtures = function () {
    return mocha.getJSONFixtures().proxyCallTo_('load', arguments)
  }

  window.getJSONFixture = function (url) {
    return mocha.getJSONFixtures().proxyCallTo_('read', arguments)[url]
  }
}(window, window.mocha, window.jQuery);
