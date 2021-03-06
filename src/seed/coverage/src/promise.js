function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/promise.js']) {
  _$jscoverage['/promise.js'] = {};
  _$jscoverage['/promise.js'].lineData = [];
  _$jscoverage['/promise.js'].lineData[6] = 0;
  _$jscoverage['/promise.js'].lineData[8] = 0;
  _$jscoverage['/promise.js'].lineData[17] = 0;
  _$jscoverage['/promise.js'].lineData[19] = 0;
  _$jscoverage['/promise.js'].lineData[21] = 0;
  _$jscoverage['/promise.js'].lineData[22] = 0;
  _$jscoverage['/promise.js'].lineData[24] = 0;
  _$jscoverage['/promise.js'].lineData[27] = 0;
  _$jscoverage['/promise.js'].lineData[32] = 0;
  _$jscoverage['/promise.js'].lineData[33] = 0;
  _$jscoverage['/promise.js'].lineData[36] = 0;
  _$jscoverage['/promise.js'].lineData[37] = 0;
  _$jscoverage['/promise.js'].lineData[43] = 0;
  _$jscoverage['/promise.js'].lineData[45] = 0;
  _$jscoverage['/promise.js'].lineData[52] = 0;
  _$jscoverage['/promise.js'].lineData[53] = 0;
  _$jscoverage['/promise.js'].lineData[54] = 0;
  _$jscoverage['/promise.js'].lineData[55] = 0;
  _$jscoverage['/promise.js'].lineData[63] = 0;
  _$jscoverage['/promise.js'].lineData[66] = 0;
  _$jscoverage['/promise.js'].lineData[75] = 0;
  _$jscoverage['/promise.js'].lineData[77] = 0;
  _$jscoverage['/promise.js'].lineData[78] = 0;
  _$jscoverage['/promise.js'].lineData[82] = 0;
  _$jscoverage['/promise.js'].lineData[83] = 0;
  _$jscoverage['/promise.js'].lineData[84] = 0;
  _$jscoverage['/promise.js'].lineData[85] = 0;
  _$jscoverage['/promise.js'].lineData[86] = 0;
  _$jscoverage['/promise.js'].lineData[88] = 0;
  _$jscoverage['/promise.js'].lineData[96] = 0;
  _$jscoverage['/promise.js'].lineData[100] = 0;
  _$jscoverage['/promise.js'].lineData[101] = 0;
  _$jscoverage['/promise.js'].lineData[111] = 0;
  _$jscoverage['/promise.js'].lineData[112] = 0;
  _$jscoverage['/promise.js'].lineData[114] = 0;
  _$jscoverage['/promise.js'].lineData[115] = 0;
  _$jscoverage['/promise.js'].lineData[117] = 0;
  _$jscoverage['/promise.js'].lineData[121] = 0;
  _$jscoverage['/promise.js'].lineData[132] = 0;
  _$jscoverage['/promise.js'].lineData[140] = 0;
  _$jscoverage['/promise.js'].lineData[149] = 0;
  _$jscoverage['/promise.js'].lineData[150] = 0;
  _$jscoverage['/promise.js'].lineData[152] = 0;
  _$jscoverage['/promise.js'].lineData[168] = 0;
  _$jscoverage['/promise.js'].lineData[170] = 0;
  _$jscoverage['/promise.js'].lineData[171] = 0;
  _$jscoverage['/promise.js'].lineData[177] = 0;
  _$jscoverage['/promise.js'].lineData[187] = 0;
  _$jscoverage['/promise.js'].lineData[193] = 0;
  _$jscoverage['/promise.js'].lineData[197] = 0;
  _$jscoverage['/promise.js'].lineData[198] = 0;
  _$jscoverage['/promise.js'].lineData[199] = 0;
  _$jscoverage['/promise.js'].lineData[201] = 0;
  _$jscoverage['/promise.js'].lineData[202] = 0;
  _$jscoverage['/promise.js'].lineData[203] = 0;
  _$jscoverage['/promise.js'].lineData[204] = 0;
  _$jscoverage['/promise.js'].lineData[206] = 0;
  _$jscoverage['/promise.js'].lineData[209] = 0;
  _$jscoverage['/promise.js'].lineData[218] = 0;
  _$jscoverage['/promise.js'].lineData[219] = 0;
  _$jscoverage['/promise.js'].lineData[223] = 0;
  _$jscoverage['/promise.js'].lineData[224] = 0;
  _$jscoverage['/promise.js'].lineData[225] = 0;
  _$jscoverage['/promise.js'].lineData[230] = 0;
  _$jscoverage['/promise.js'].lineData[231] = 0;
  _$jscoverage['/promise.js'].lineData[235] = 0;
  _$jscoverage['/promise.js'].lineData[236] = 0;
  _$jscoverage['/promise.js'].lineData[237] = 0;
  _$jscoverage['/promise.js'].lineData[244] = 0;
  _$jscoverage['/promise.js'].lineData[245] = 0;
  _$jscoverage['/promise.js'].lineData[249] = 0;
  _$jscoverage['/promise.js'].lineData[250] = 0;
  _$jscoverage['/promise.js'].lineData[251] = 0;
  _$jscoverage['/promise.js'].lineData[252] = 0;
  _$jscoverage['/promise.js'].lineData[254] = 0;
  _$jscoverage['/promise.js'].lineData[255] = 0;
  _$jscoverage['/promise.js'].lineData[257] = 0;
  _$jscoverage['/promise.js'].lineData[258] = 0;
  _$jscoverage['/promise.js'].lineData[261] = 0;
  _$jscoverage['/promise.js'].lineData[262] = 0;
  _$jscoverage['/promise.js'].lineData[263] = 0;
  _$jscoverage['/promise.js'].lineData[264] = 0;
  _$jscoverage['/promise.js'].lineData[265] = 0;
  _$jscoverage['/promise.js'].lineData[267] = 0;
  _$jscoverage['/promise.js'].lineData[269] = 0;
  _$jscoverage['/promise.js'].lineData[272] = 0;
  _$jscoverage['/promise.js'].lineData[277] = 0;
  _$jscoverage['/promise.js'].lineData[280] = 0;
  _$jscoverage['/promise.js'].lineData[282] = 0;
  _$jscoverage['/promise.js'].lineData[296] = 0;
  _$jscoverage['/promise.js'].lineData[297] = 0;
  _$jscoverage['/promise.js'].lineData[302] = 0;
  _$jscoverage['/promise.js'].lineData[303] = 0;
  _$jscoverage['/promise.js'].lineData[304] = 0;
  _$jscoverage['/promise.js'].lineData[306] = 0;
  _$jscoverage['/promise.js'].lineData[374] = 0;
  _$jscoverage['/promise.js'].lineData[375] = 0;
  _$jscoverage['/promise.js'].lineData[376] = 0;
  _$jscoverage['/promise.js'].lineData[378] = 0;
  _$jscoverage['/promise.js'].lineData[379] = 0;
  _$jscoverage['/promise.js'].lineData[380] = 0;
  _$jscoverage['/promise.js'].lineData[381] = 0;
  _$jscoverage['/promise.js'].lineData[382] = 0;
  _$jscoverage['/promise.js'].lineData[383] = 0;
  _$jscoverage['/promise.js'].lineData[386] = 0;
  _$jscoverage['/promise.js'].lineData[391] = 0;
  _$jscoverage['/promise.js'].lineData[395] = 0;
}
if (! _$jscoverage['/promise.js'].functionData) {
  _$jscoverage['/promise.js'].functionData = [];
  _$jscoverage['/promise.js'].functionData[0] = 0;
  _$jscoverage['/promise.js'].functionData[1] = 0;
  _$jscoverage['/promise.js'].functionData[2] = 0;
  _$jscoverage['/promise.js'].functionData[3] = 0;
  _$jscoverage['/promise.js'].functionData[4] = 0;
  _$jscoverage['/promise.js'].functionData[5] = 0;
  _$jscoverage['/promise.js'].functionData[6] = 0;
  _$jscoverage['/promise.js'].functionData[7] = 0;
  _$jscoverage['/promise.js'].functionData[8] = 0;
  _$jscoverage['/promise.js'].functionData[9] = 0;
  _$jscoverage['/promise.js'].functionData[10] = 0;
  _$jscoverage['/promise.js'].functionData[11] = 0;
  _$jscoverage['/promise.js'].functionData[12] = 0;
  _$jscoverage['/promise.js'].functionData[13] = 0;
  _$jscoverage['/promise.js'].functionData[14] = 0;
  _$jscoverage['/promise.js'].functionData[15] = 0;
  _$jscoverage['/promise.js'].functionData[16] = 0;
  _$jscoverage['/promise.js'].functionData[17] = 0;
  _$jscoverage['/promise.js'].functionData[18] = 0;
  _$jscoverage['/promise.js'].functionData[19] = 0;
  _$jscoverage['/promise.js'].functionData[20] = 0;
  _$jscoverage['/promise.js'].functionData[21] = 0;
  _$jscoverage['/promise.js'].functionData[22] = 0;
  _$jscoverage['/promise.js'].functionData[23] = 0;
  _$jscoverage['/promise.js'].functionData[24] = 0;
  _$jscoverage['/promise.js'].functionData[25] = 0;
  _$jscoverage['/promise.js'].functionData[26] = 0;
  _$jscoverage['/promise.js'].functionData[27] = 0;
  _$jscoverage['/promise.js'].functionData[28] = 0;
  _$jscoverage['/promise.js'].functionData[29] = 0;
}
if (! _$jscoverage['/promise.js'].branchData) {
  _$jscoverage['/promise.js'].branchData = {};
  _$jscoverage['/promise.js'].branchData['19'] = [];
  _$jscoverage['/promise.js'].branchData['19'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['21'] = [];
  _$jscoverage['/promise.js'].branchData['21'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['32'] = [];
  _$jscoverage['/promise.js'].branchData['32'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['36'] = [];
  _$jscoverage['/promise.js'].branchData['36'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['43'] = [];
  _$jscoverage['/promise.js'].branchData['43'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['54'] = [];
  _$jscoverage['/promise.js'].branchData['54'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['63'] = [];
  _$jscoverage['/promise.js'].branchData['63'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['77'] = [];
  _$jscoverage['/promise.js'].branchData['77'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['101'] = [];
  _$jscoverage['/promise.js'].branchData['101'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['115'] = [];
  _$jscoverage['/promise.js'].branchData['115'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['174'] = [];
  _$jscoverage['/promise.js'].branchData['174'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['198'] = [];
  _$jscoverage['/promise.js'].branchData['198'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['203'] = [];
  _$jscoverage['/promise.js'].branchData['203'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['230'] = [];
  _$jscoverage['/promise.js'].branchData['230'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['244'] = [];
  _$jscoverage['/promise.js'].branchData['244'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['250'] = [];
  _$jscoverage['/promise.js'].branchData['250'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['254'] = [];
  _$jscoverage['/promise.js'].branchData['254'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['261'] = [];
  _$jscoverage['/promise.js'].branchData['261'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['263'] = [];
  _$jscoverage['/promise.js'].branchData['263'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['282'] = [];
  _$jscoverage['/promise.js'].branchData['282'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['283'] = [];
  _$jscoverage['/promise.js'].branchData['283'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['285'] = [];
  _$jscoverage['/promise.js'].branchData['285'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['285'][2] = new BranchData();
  _$jscoverage['/promise.js'].branchData['289'] = [];
  _$jscoverage['/promise.js'].branchData['289'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['297'] = [];
  _$jscoverage['/promise.js'].branchData['297'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['298'] = [];
  _$jscoverage['/promise.js'].branchData['298'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['298'][2] = new BranchData();
  _$jscoverage['/promise.js'].branchData['375'] = [];
  _$jscoverage['/promise.js'].branchData['375'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['379'] = [];
  _$jscoverage['/promise.js'].branchData['379'][1] = new BranchData();
  _$jscoverage['/promise.js'].branchData['383'] = [];
  _$jscoverage['/promise.js'].branchData['383'][1] = new BranchData();
}
_$jscoverage['/promise.js'].branchData['383'][1].init(84, 13, '--count === 0');
function visit556_383_1(result) {
  _$jscoverage['/promise.js'].branchData['383'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['379'][1].init(202, 19, 'i < promises.length');
function visit555_379_1(result) {
  _$jscoverage['/promise.js'].branchData['379'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['375'][1].init(68, 6, '!count');
function visit554_375_1(result) {
  _$jscoverage['/promise.js'].branchData['375'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['298'][2].init(51, 35, 'obj[PROMISE_PENDINGS] === undefined');
function visit553_298_2(result) {
  _$jscoverage['/promise.js'].branchData['298'][2].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['298'][1].init(31, 91, '(obj[PROMISE_PENDINGS] === undefined) && (obj[PROMISE_VALUE] instanceof Reject)');
function visit552_298_1(result) {
  _$jscoverage['/promise.js'].branchData['298'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['297'][1].init(17, 123, 'isPromise(obj) && (obj[PROMISE_PENDINGS] === undefined) && (obj[PROMISE_VALUE] instanceof Reject)');
function visit551_297_1(result) {
  _$jscoverage['/promise.js'].branchData['297'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['289'][1].init(-1, 206, '!isPromise(obj[PROMISE_VALUE]) || isResolved(obj[PROMISE_VALUE])');
function visit550_289_1(result) {
  _$jscoverage['/promise.js'].branchData['289'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['285'][2].init(154, 35, 'obj[PROMISE_PENDINGS] === undefined');
function visit549_285_2(result) {
  _$jscoverage['/promise.js'].branchData['285'][2].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['285'][1].init(64, 405, '(obj[PROMISE_PENDINGS] === undefined) && (!isPromise(obj[PROMISE_VALUE]) || isResolved(obj[PROMISE_VALUE]))');
function visit548_285_1(result) {
  _$jscoverage['/promise.js'].branchData['285'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['283'][1].init(32, 470, 'isPromise(obj) && (obj[PROMISE_PENDINGS] === undefined) && (!isPromise(obj[PROMISE_VALUE]) || isResolved(obj[PROMISE_VALUE]))');
function visit547_283_1(result) {
  _$jscoverage['/promise.js'].branchData['283'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['282'][1].init(53, 503, '!isRejected(obj) && isPromise(obj) && (obj[PROMISE_PENDINGS] === undefined) && (!isPromise(obj[PROMISE_VALUE]) || isResolved(obj[PROMISE_VALUE]))');
function visit546_282_1(result) {
  _$jscoverage['/promise.js'].branchData['282'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['263'][1].init(22, 4, 'done');
function visit545_263_1(result) {
  _$jscoverage['/promise.js'].branchData['263'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['261'][1].init(1311, 25, 'value instanceof Promise');
function visit544_261_1(result) {
  _$jscoverage['/promise.js'].branchData['261'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['254'][1].init(138, 24, 'value instanceof Promise');
function visit543_254_1(result) {
  _$jscoverage['/promise.js'].branchData['254'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['250'][1].init(18, 4, 'done');
function visit542_250_1(result) {
  _$jscoverage['/promise.js'].branchData['250'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['244'][1].init(87, 12, 'e.stack || e');
function visit541_244_1(result) {
  _$jscoverage['/promise.js'].branchData['244'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['230'][1].init(87, 12, 'e.stack || e');
function visit540_230_1(result) {
  _$jscoverage['/promise.js'].branchData['230'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['203'][1].init(161, 38, 'self[PROMISE_VALUE] instanceof Promise');
function visit539_203_1(result) {
  _$jscoverage['/promise.js'].branchData['203'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['198'][1].init(14, 24, 'reason instanceof Reject');
function visit538_198_1(result) {
  _$jscoverage['/promise.js'].branchData['198'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['174'][1].init(238, 21, 'fulfilled || rejected');
function visit537_174_1(result) {
  _$jscoverage['/promise.js'].branchData['174'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['115'][1].init(125, 15, 'v === undefined');
function visit536_115_1(result) {
  _$jscoverage['/promise.js'].branchData['115'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['101'][1].init(18, 29, 'obj && obj instanceof Promise');
function visit535_101_1(result) {
  _$jscoverage['/promise.js'].branchData['101'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['77'][1].init(86, 39, '!(pendings = promise[PROMISE_PENDINGS])');
function visit534_77_1(result) {
  _$jscoverage['/promise.js'].branchData['77'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['63'][1].init(344, 24, 'promise || new Promise()');
function visit533_63_1(result) {
  _$jscoverage['/promise.js'].branchData['63'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['54'][1].init(40, 24, '!(self instanceof Defer)');
function visit532_54_1(result) {
  _$jscoverage['/promise.js'].branchData['54'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['43'][1].init(191, 25, 'fulfilled && fulfilled(v)');
function visit531_43_1(result) {
  _$jscoverage['/promise.js'].branchData['43'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['36'][1].init(607, 12, 'isPromise(v)');
function visit530_36_1(result) {
  _$jscoverage['/promise.js'].branchData['36'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['32'][1].init(475, 8, 'pendings');
function visit529_32_1(result) {
  _$jscoverage['/promise.js'].branchData['32'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['21'][1].init(89, 9, '!rejected');
function visit528_21_1(result) {
  _$jscoverage['/promise.js'].branchData['21'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].branchData['19'][1].init(47, 25, 'promise instanceof Reject');
function visit527_19_1(result) {
  _$jscoverage['/promise.js'].branchData['19'][1].ranCondition(result);
  return result;
}_$jscoverage['/promise.js'].lineData[6]++;
(function(S, undefined) {
  _$jscoverage['/promise.js'].functionData[0]++;
  _$jscoverage['/promise.js'].lineData[8]++;
  var PROMISE_VALUE = '__promise_value', logger = S.getLogger('s/promise'), PROMISE_PENDINGS = '__promise_pendings';
  _$jscoverage['/promise.js'].lineData[17]++;
  function promiseWhen(promise, fulfilled, rejected) {
    _$jscoverage['/promise.js'].functionData[1]++;
    _$jscoverage['/promise.js'].lineData[19]++;
    if (visit527_19_1(promise instanceof Reject)) {
      _$jscoverage['/promise.js'].lineData[21]++;
      if (visit528_21_1(!rejected)) {
        _$jscoverage['/promise.js'].lineData[22]++;
        S.error('no rejected callback!');
      }
      _$jscoverage['/promise.js'].lineData[24]++;
      return rejected(promise[PROMISE_VALUE]);
    }
    _$jscoverage['/promise.js'].lineData[27]++;
    var v = promise[PROMISE_VALUE], pendings = promise[PROMISE_PENDINGS];
    _$jscoverage['/promise.js'].lineData[32]++;
    if (visit529_32_1(pendings)) {
      _$jscoverage['/promise.js'].lineData[33]++;
      pendings.push([fulfilled, rejected]);
    } else {
      _$jscoverage['/promise.js'].lineData[36]++;
      if (visit530_36_1(isPromise(v))) {
        _$jscoverage['/promise.js'].lineData[37]++;
        promiseWhen(v, fulfilled, rejected);
      } else {
        _$jscoverage['/promise.js'].lineData[43]++;
        return visit531_43_1(fulfilled && fulfilled(v));
      }
    }
    _$jscoverage['/promise.js'].lineData[45]++;
    return undefined;
  }
  _$jscoverage['/promise.js'].lineData[52]++;
  function Defer(promise) {
    _$jscoverage['/promise.js'].functionData[2]++;
    _$jscoverage['/promise.js'].lineData[53]++;
    var self = this;
    _$jscoverage['/promise.js'].lineData[54]++;
    if (visit532_54_1(!(self instanceof Defer))) {
      _$jscoverage['/promise.js'].lineData[55]++;
      return new Defer(promise);
    }
    _$jscoverage['/promise.js'].lineData[63]++;
    self.promise = visit533_63_1(promise || new Promise());
  }
  _$jscoverage['/promise.js'].lineData[66]++;
  Defer.prototype = {
  constructor: Defer, 
  resolve: function(value) {
  _$jscoverage['/promise.js'].functionData[3]++;
  _$jscoverage['/promise.js'].lineData[75]++;
  var promise = this.promise, pendings;
  _$jscoverage['/promise.js'].lineData[77]++;
  if (visit534_77_1(!(pendings = promise[PROMISE_PENDINGS]))) {
    _$jscoverage['/promise.js'].lineData[78]++;
    return null;
  }
  _$jscoverage['/promise.js'].lineData[82]++;
  promise[PROMISE_VALUE] = value;
  _$jscoverage['/promise.js'].lineData[83]++;
  pendings = [].concat(pendings);
  _$jscoverage['/promise.js'].lineData[84]++;
  promise[PROMISE_PENDINGS] = undefined;
  _$jscoverage['/promise.js'].lineData[85]++;
  S.each(pendings, function(p) {
  _$jscoverage['/promise.js'].functionData[4]++;
  _$jscoverage['/promise.js'].lineData[86]++;
  promiseWhen(promise, p[0], p[1]);
});
  _$jscoverage['/promise.js'].lineData[88]++;
  return value;
}, 
  reject: function(reason) {
  _$jscoverage['/promise.js'].functionData[5]++;
  _$jscoverage['/promise.js'].lineData[96]++;
  return this.resolve(new Reject(reason));
}};
  _$jscoverage['/promise.js'].lineData[100]++;
  function isPromise(obj) {
    _$jscoverage['/promise.js'].functionData[6]++;
    _$jscoverage['/promise.js'].lineData[101]++;
    return visit535_101_1(obj && obj instanceof Promise);
  }
  _$jscoverage['/promise.js'].lineData[111]++;
  function Promise(v) {
    _$jscoverage['/promise.js'].functionData[7]++;
    _$jscoverage['/promise.js'].lineData[112]++;
    var self = this;
    _$jscoverage['/promise.js'].lineData[114]++;
    self[PROMISE_VALUE] = v;
    _$jscoverage['/promise.js'].lineData[115]++;
    if (visit536_115_1(v === undefined)) {
      _$jscoverage['/promise.js'].lineData[117]++;
      self[PROMISE_PENDINGS] = [];
    }
  }
  _$jscoverage['/promise.js'].lineData[121]++;
  Promise.prototype = {
  constructor: Promise, 
  then: function(fulfilled, rejected) {
  _$jscoverage['/promise.js'].functionData[8]++;
  _$jscoverage['/promise.js'].lineData[132]++;
  return when(this, fulfilled, rejected);
}, 
  fail: function(rejected) {
  _$jscoverage['/promise.js'].functionData[9]++;
  _$jscoverage['/promise.js'].lineData[140]++;
  return when(this, 0, rejected);
}, 
  fin: function(callback) {
  _$jscoverage['/promise.js'].functionData[10]++;
  _$jscoverage['/promise.js'].lineData[149]++;
  return when(this, function(value) {
  _$jscoverage['/promise.js'].functionData[11]++;
  _$jscoverage['/promise.js'].lineData[150]++;
  return callback(value, true);
}, function(reason) {
  _$jscoverage['/promise.js'].functionData[12]++;
  _$jscoverage['/promise.js'].lineData[152]++;
  return callback(reason, false);
});
}, 
  done: function(fulfilled, rejected) {
  _$jscoverage['/promise.js'].functionData[13]++;
  _$jscoverage['/promise.js'].lineData[168]++;
  var self = this, onUnhandledError = function(error) {
  _$jscoverage['/promise.js'].functionData[14]++;
  _$jscoverage['/promise.js'].lineData[170]++;
  setTimeout(function() {
  _$jscoverage['/promise.js'].functionData[15]++;
  _$jscoverage['/promise.js'].lineData[171]++;
  throw error;
}, 0);
}, promiseToHandle = visit537_174_1(fulfilled || rejected) ? self.then(fulfilled, rejected) : self;
  _$jscoverage['/promise.js'].lineData[177]++;
  promiseToHandle.fail(onUnhandledError);
}, 
  isResolved: function() {
  _$jscoverage['/promise.js'].functionData[16]++;
  _$jscoverage['/promise.js'].lineData[187]++;
  return isResolved(this);
}, 
  isRejected: function() {
  _$jscoverage['/promise.js'].functionData[17]++;
  _$jscoverage['/promise.js'].lineData[193]++;
  return isRejected(this);
}};
  _$jscoverage['/promise.js'].lineData[197]++;
  function Reject(reason) {
    _$jscoverage['/promise.js'].functionData[18]++;
    _$jscoverage['/promise.js'].lineData[198]++;
    if (visit538_198_1(reason instanceof Reject)) {
      _$jscoverage['/promise.js'].lineData[199]++;
      return reason;
    }
    _$jscoverage['/promise.js'].lineData[201]++;
    var self = this;
    _$jscoverage['/promise.js'].lineData[202]++;
    Promise.apply(self, arguments);
    _$jscoverage['/promise.js'].lineData[203]++;
    if (visit539_203_1(self[PROMISE_VALUE] instanceof Promise)) {
      _$jscoverage['/promise.js'].lineData[204]++;
      S.error('assert.not(this.__promise_value instanceof promise) in Reject constructor');
    }
    _$jscoverage['/promise.js'].lineData[206]++;
    return self;
  }
  _$jscoverage['/promise.js'].lineData[209]++;
  S.extend(Reject, Promise);
  _$jscoverage['/promise.js'].lineData[218]++;
  function when(value, fulfilled, rejected) {
    _$jscoverage['/promise.js'].functionData[19]++;
    _$jscoverage['/promise.js'].lineData[219]++;
    var defer = new Defer(), done = 0;
    _$jscoverage['/promise.js'].lineData[223]++;
    function _fulfilled(value) {
      _$jscoverage['/promise.js'].functionData[20]++;
      _$jscoverage['/promise.js'].lineData[224]++;
      try {
        _$jscoverage['/promise.js'].lineData[225]++;
        return fulfilled ? fulfilled(value) : value;
      }      catch (e) {
  _$jscoverage['/promise.js'].lineData[230]++;
  logger.error(visit540_230_1(e.stack || e));
  _$jscoverage['/promise.js'].lineData[231]++;
  return new Reject(e);
}
    }
    _$jscoverage['/promise.js'].lineData[235]++;
    function _rejected(reason) {
      _$jscoverage['/promise.js'].functionData[21]++;
      _$jscoverage['/promise.js'].lineData[236]++;
      try {
        _$jscoverage['/promise.js'].lineData[237]++;
        return rejected ? rejected(reason) : new Reject(reason);
      }      catch (e) {
  _$jscoverage['/promise.js'].lineData[244]++;
  logger.error(visit541_244_1(e.stack || e));
  _$jscoverage['/promise.js'].lineData[245]++;
  return new Reject(e);
}
    }
    _$jscoverage['/promise.js'].lineData[249]++;
    function finalFulfill(value) {
      _$jscoverage['/promise.js'].functionData[22]++;
      _$jscoverage['/promise.js'].lineData[250]++;
      if (visit542_250_1(done)) {
        _$jscoverage['/promise.js'].lineData[251]++;
        S.error('already done at fulfilled');
        _$jscoverage['/promise.js'].lineData[252]++;
        return;
      }
      _$jscoverage['/promise.js'].lineData[254]++;
      if (visit543_254_1(value instanceof Promise)) {
        _$jscoverage['/promise.js'].lineData[255]++;
        S.error('assert.not(value instanceof Promise) in when');
      }
      _$jscoverage['/promise.js'].lineData[257]++;
      done = 1;
      _$jscoverage['/promise.js'].lineData[258]++;
      defer.resolve(_fulfilled(value));
    }
    _$jscoverage['/promise.js'].lineData[261]++;
    if (visit544_261_1(value instanceof Promise)) {
      _$jscoverage['/promise.js'].lineData[262]++;
      promiseWhen(value, finalFulfill, function(reason) {
  _$jscoverage['/promise.js'].functionData[23]++;
  _$jscoverage['/promise.js'].lineData[263]++;
  if (visit545_263_1(done)) {
    _$jscoverage['/promise.js'].lineData[264]++;
    S.error('already done at rejected');
    _$jscoverage['/promise.js'].lineData[265]++;
    return;
  }
  _$jscoverage['/promise.js'].lineData[267]++;
  done = 1;
  _$jscoverage['/promise.js'].lineData[269]++;
  defer.resolve(_rejected(reason));
});
    } else {
      _$jscoverage['/promise.js'].lineData[272]++;
      finalFulfill(value);
    }
    _$jscoverage['/promise.js'].lineData[277]++;
    return defer.promise;
  }
  _$jscoverage['/promise.js'].lineData[280]++;
  function isResolved(obj) {
    _$jscoverage['/promise.js'].functionData[24]++;
    _$jscoverage['/promise.js'].lineData[282]++;
    return visit546_282_1(!isRejected(obj) && visit547_283_1(isPromise(obj) && visit548_285_1((visit549_285_2(obj[PROMISE_PENDINGS] === undefined)) && (visit550_289_1(!isPromise(obj[PROMISE_VALUE]) || isResolved(obj[PROMISE_VALUE]))))));
  }
  _$jscoverage['/promise.js'].lineData[296]++;
  function isRejected(obj) {
    _$jscoverage['/promise.js'].functionData[25]++;
    _$jscoverage['/promise.js'].lineData[297]++;
    return visit551_297_1(isPromise(obj) && visit552_298_1((visit553_298_2(obj[PROMISE_PENDINGS] === undefined)) && (obj[PROMISE_VALUE] instanceof Reject)));
  }
  _$jscoverage['/promise.js'].lineData[302]++;
  KISSY.Defer = Defer;
  _$jscoverage['/promise.js'].lineData[303]++;
  KISSY.Promise = Promise;
  _$jscoverage['/promise.js'].lineData[304]++;
  Promise.Defer = Defer;
  _$jscoverage['/promise.js'].lineData[306]++;
  S.mix(Promise, {
  when: when, 
  isPromise: isPromise, 
  isResolved: isResolved, 
  isRejected: isRejected, 
  all: function(promises) {
  _$jscoverage['/promise.js'].functionData[26]++;
  _$jscoverage['/promise.js'].lineData[374]++;
  var count = promises.length;
  _$jscoverage['/promise.js'].lineData[375]++;
  if (visit554_375_1(!count)) {
    _$jscoverage['/promise.js'].lineData[376]++;
    return null;
  }
  _$jscoverage['/promise.js'].lineData[378]++;
  var defer = Defer();
  _$jscoverage['/promise.js'].lineData[379]++;
  for (var i = 0; visit555_379_1(i < promises.length); i++) {
    _$jscoverage['/promise.js'].lineData[380]++;
    (function(promise, i) {
  _$jscoverage['/promise.js'].functionData[27]++;
  _$jscoverage['/promise.js'].lineData[381]++;
  when(promise, function(value) {
  _$jscoverage['/promise.js'].functionData[28]++;
  _$jscoverage['/promise.js'].lineData[382]++;
  promises[i] = value;
  _$jscoverage['/promise.js'].lineData[383]++;
  if (visit556_383_1(--count === 0)) {
    _$jscoverage['/promise.js'].lineData[386]++;
    defer.resolve(promises);
  }
}, function(r) {
  _$jscoverage['/promise.js'].functionData[29]++;
  _$jscoverage['/promise.js'].lineData[391]++;
  defer.reject(r);
});
})(promises[i], i);
  }
  _$jscoverage['/promise.js'].lineData[395]++;
  return defer.promise;
}});
})(KISSY);
