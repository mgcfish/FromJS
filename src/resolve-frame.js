var endsWith = require("ends-with")
var StackTraceGPS = require("./stacktrace-gps")
var ErrorStackParser = require("./error-stack-parser")
import _ from "underscore"

var gps = null;
var defaultSourceCache = null
var resolvedFrameCache = {}

function resFrame(frame, callback){
    gps._get(frame.fileName).then(function(src){
        var lines = src.split("\n")
        var zeroIndexedLineNumber = frame.lineNumber - 1;
        frame = {...frame}
        frame.prevLines = lines.slice(0, zeroIndexedLineNumber)
        frame.line = lines[zeroIndexedLineNumber];
        frame.nextLines = lines.slice(zeroIndexedLineNumber + 1)

        if (frame.line === undefined) {
            debugger
        }

        callback(null, frame)
    })

}

window.setDefaultSourceCache = setDefaultSourceCache
export function setDefaultSourceCache(sourceCache){
    defaultSourceCache = _.clone(sourceCache)
}

export function getDefaultSourceCache(){
    if (defaultSourceCache !== null) {
        return defaultSourceCache
    }

    var sourceCache = {};
    for (var filename in fromJSDynamicFiles){
        sourceCache[filename] = fromJSDynamicFiles[filename]
    }

    return sourceCache
}

function initGPSIfNecessary(){
    if (gps !== null) return

    gps = new StackTraceGPS({sourceCache: getDefaultSourceCache()});
    window.gps = gps
}

var frameStringsCurrentlyBeingResolved = {}

function resolveFrame(frameString, callback){
    // console.time("Resolve Frame " + frameString)
    if (resolvedFrameCache[frameString]){
        done([null, resolvedFrameCache[frameString]])
        return
    }

    var isCanceled = false

    initGPSIfNecessary()

    var frameObject = ErrorStackParser.parse({stack: frameString})[0];

    if (endsWith(frameObject.fileName, ".html")){
        // don't bother looking for source map file
        frameObject.fileName += ".dontprocess"
        resFrame(frameObject, callback)
    } else {
        // Use promises so we can re-use them, so if the same frame is requested again
        // before the first one succeeded we don't attempt to resolve again
        if (frameStringsCurrentlyBeingResolved[frameString]) {
            frameStringsCurrentlyBeingResolved[frameString].then(done)
        } else {
            frameStringsCurrentlyBeingResolved[frameString] = new Promise(function(resolve, reject){
                gps.pinpoint(frameObject).then(function(newFrame){
                    resFrame(newFrame, function(err, frame){
                        resolve([err, frame])
                    })
                }, function(){
                    resFrame(frameObject, function(err, frame){
                        resolve([err, frame])
                    })
                    console.log("error", arguments)
                });
            })

            frameStringsCurrentlyBeingResolved[frameString].then(done)
        }
    }

    function done(args){
        var [err, frame] = args
        // console.timeEnd("Resolve Frame " + frameString)
        delete frameStringsCurrentlyBeingResolved[frameString]

        resolvedFrameCache[frameString] = frame
        if (!isCanceled) {
            callback(err, frame)
        }
    }

    return function cancel(){
        isCanceled = true;
    }
}

window.resolveFrame = resolveFrame
export default resolveFrame

export function getSourceFileContent(filePath, callback){
    gps._get(filePath).then(function(src){
        callback(src)
    })
}
