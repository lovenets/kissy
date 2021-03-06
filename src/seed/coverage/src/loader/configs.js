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
if (! _$jscoverage['/loader/configs.js']) {
  _$jscoverage['/loader/configs.js'] = {};
  _$jscoverage['/loader/configs.js'].lineData = [];
  _$jscoverage['/loader/configs.js'].lineData[6] = 0;
  _$jscoverage['/loader/configs.js'].lineData[7] = 0;
  _$jscoverage['/loader/configs.js'].lineData[15] = 0;
  _$jscoverage['/loader/configs.js'].lineData[16] = 0;
  _$jscoverage['/loader/configs.js'].lineData[30] = 0;
  _$jscoverage['/loader/configs.js'].lineData[31] = 0;
  _$jscoverage['/loader/configs.js'].lineData[32] = 0;
  _$jscoverage['/loader/configs.js'].lineData[33] = 0;
  _$jscoverage['/loader/configs.js'].lineData[35] = 0;
  _$jscoverage['/loader/configs.js'].lineData[38] = 0;
  _$jscoverage['/loader/configs.js'].lineData[39] = 0;
  _$jscoverage['/loader/configs.js'].lineData[40] = 0;
  _$jscoverage['/loader/configs.js'].lineData[41] = 0;
  _$jscoverage['/loader/configs.js'].lineData[43] = 0;
  _$jscoverage['/loader/configs.js'].lineData[53] = 0;
  _$jscoverage['/loader/configs.js'].lineData[54] = 0;
  _$jscoverage['/loader/configs.js'].lineData[57] = 0;
  _$jscoverage['/loader/configs.js'].lineData[58] = 0;
  _$jscoverage['/loader/configs.js'].lineData[60] = 0;
  _$jscoverage['/loader/configs.js'].lineData[63] = 0;
  _$jscoverage['/loader/configs.js'].lineData[65] = 0;
  _$jscoverage['/loader/configs.js'].lineData[66] = 0;
  _$jscoverage['/loader/configs.js'].lineData[67] = 0;
  _$jscoverage['/loader/configs.js'].lineData[68] = 0;
  _$jscoverage['/loader/configs.js'].lineData[69] = 0;
  _$jscoverage['/loader/configs.js'].lineData[70] = 0;
  _$jscoverage['/loader/configs.js'].lineData[71] = 0;
  _$jscoverage['/loader/configs.js'].lineData[73] = 0;
  _$jscoverage['/loader/configs.js'].lineData[76] = 0;
  _$jscoverage['/loader/configs.js'].lineData[77] = 0;
  _$jscoverage['/loader/configs.js'].lineData[78] = 0;
  _$jscoverage['/loader/configs.js'].lineData[80] = 0;
  _$jscoverage['/loader/configs.js'].lineData[82] = 0;
  _$jscoverage['/loader/configs.js'].lineData[113] = 0;
  _$jscoverage['/loader/configs.js'].lineData[114] = 0;
  _$jscoverage['/loader/configs.js'].lineData[116] = 0;
  _$jscoverage['/loader/configs.js'].lineData[117] = 0;
  _$jscoverage['/loader/configs.js'].lineData[118] = 0;
  _$jscoverage['/loader/configs.js'].lineData[119] = 0;
  _$jscoverage['/loader/configs.js'].lineData[127] = 0;
  _$jscoverage['/loader/configs.js'].lineData[128] = 0;
  _$jscoverage['/loader/configs.js'].lineData[131] = 0;
  _$jscoverage['/loader/configs.js'].lineData[132] = 0;
  _$jscoverage['/loader/configs.js'].lineData[134] = 0;
  _$jscoverage['/loader/configs.js'].lineData[135] = 0;
  _$jscoverage['/loader/configs.js'].lineData[136] = 0;
  _$jscoverage['/loader/configs.js'].lineData[137] = 0;
  _$jscoverage['/loader/configs.js'].lineData[141] = 0;
  _$jscoverage['/loader/configs.js'].lineData[142] = 0;
  _$jscoverage['/loader/configs.js'].lineData[143] = 0;
  _$jscoverage['/loader/configs.js'].lineData[144] = 0;
  _$jscoverage['/loader/configs.js'].lineData[145] = 0;
  _$jscoverage['/loader/configs.js'].lineData[147] = 0;
  _$jscoverage['/loader/configs.js'].lineData[148] = 0;
  _$jscoverage['/loader/configs.js'].lineData[152] = 0;
  _$jscoverage['/loader/configs.js'].lineData[153] = 0;
  _$jscoverage['/loader/configs.js'].lineData[155] = 0;
  _$jscoverage['/loader/configs.js'].lineData[157] = 0;
}
if (! _$jscoverage['/loader/configs.js'].functionData) {
  _$jscoverage['/loader/configs.js'].functionData = [];
  _$jscoverage['/loader/configs.js'].functionData[0] = 0;
  _$jscoverage['/loader/configs.js'].functionData[1] = 0;
  _$jscoverage['/loader/configs.js'].functionData[2] = 0;
  _$jscoverage['/loader/configs.js'].functionData[3] = 0;
  _$jscoverage['/loader/configs.js'].functionData[4] = 0;
  _$jscoverage['/loader/configs.js'].functionData[5] = 0;
  _$jscoverage['/loader/configs.js'].functionData[6] = 0;
  _$jscoverage['/loader/configs.js'].functionData[7] = 0;
  _$jscoverage['/loader/configs.js'].functionData[8] = 0;
}
if (! _$jscoverage['/loader/configs.js'].branchData) {
  _$jscoverage['/loader/configs.js'].branchData = {};
  _$jscoverage['/loader/configs.js'].branchData['15'] = [];
  _$jscoverage['/loader/configs.js'].branchData['15'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['15'][2] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['32'] = [];
  _$jscoverage['/loader/configs.js'].branchData['32'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['35'] = [];
  _$jscoverage['/loader/configs.js'].branchData['35'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['35'][2] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['40'] = [];
  _$jscoverage['/loader/configs.js'].branchData['40'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['43'] = [];
  _$jscoverage['/loader/configs.js'].branchData['43'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['43'][2] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['56'] = [];
  _$jscoverage['/loader/configs.js'].branchData['56'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['57'] = [];
  _$jscoverage['/loader/configs.js'].branchData['57'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['60'] = [];
  _$jscoverage['/loader/configs.js'].branchData['60'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['63'] = [];
  _$jscoverage['/loader/configs.js'].branchData['63'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['70'] = [];
  _$jscoverage['/loader/configs.js'].branchData['70'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['77'] = [];
  _$jscoverage['/loader/configs.js'].branchData['77'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['116'] = [];
  _$jscoverage['/loader/configs.js'].branchData['116'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['131'] = [];
  _$jscoverage['/loader/configs.js'].branchData['131'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['144'] = [];
  _$jscoverage['/loader/configs.js'].branchData['144'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['147'] = [];
  _$jscoverage['/loader/configs.js'].branchData['147'][1] = new BranchData();
  _$jscoverage['/loader/configs.js'].branchData['152'] = [];
  _$jscoverage['/loader/configs.js'].branchData['152'][1] = new BranchData();
}
_$jscoverage['/loader/configs.js'].branchData['152'][1].init(97, 28, '!S.startsWith(base, \'file:\')');
function visit362_152_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['152'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['147'][1].init(167, 17, 'simulatedLocation');
function visit361_147_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['147'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['144'][1].init(78, 35, 'base.charAt(base.length - 1) != \'/\'');
function visit360_144_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['144'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['131'][1].init(97, 5, '!base');
function visit359_131_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['131'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['116'][1].init(69, 7, 'modules');
function visit358_116_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['116'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['77'][1].init(787, 14, 'cfgs === false');
function visit357_77_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['77'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['70'][1].init(380, 8, 'ps[name]');
function visit356_70_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['70'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['63'][1].init(144, 20, 'cfg.base || cfg.path');
function visit355_63_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['63'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['60'][1].init(52, 15, 'cfg.name || key');
function visit354_60_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['60'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['57'][1].init(127, 4, 'cfgs');
function visit353_57_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['57'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['56'][1].init(80, 21, 'Config.packages || {}');
function visit352_56_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['56'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['43'][2].init(210, 11, 'rules || []');
function visit351_43_2(result) {
  _$jscoverage['/loader/configs.js'].branchData['43'][2].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['43'][1].init(172, 29, 'Config.mappedComboRules || []');
function visit350_43_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['43'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['40'][1].init(49, 15, 'rules === false');
function visit349_40_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['40'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['35'][2].init(195, 11, 'rules || []');
function visit348_35_2(result) {
  _$jscoverage['/loader/configs.js'].branchData['35'][2].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['35'][1].init(162, 24, 'Config.mappedRules || []');
function visit347_35_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['35'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['32'][1].init(49, 15, 'rules === false');
function visit346_32_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['32'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['15'][2].init(236, 42, 'location && (locationHref = location.href)');
function visit345_15_2(result) {
  _$jscoverage['/loader/configs.js'].branchData['15'][2].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].branchData['15'][1].init(220, 58, '!S.UA.nodejs && location && (locationHref = location.href)');
function visit344_15_1(result) {
  _$jscoverage['/loader/configs.js'].branchData['15'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/configs.js'].lineData[6]++;
(function(S, undefined) {
  _$jscoverage['/loader/configs.js'].functionData[0]++;
  _$jscoverage['/loader/configs.js'].lineData[7]++;
  var Loader = S.Loader, Utils = Loader.Utils, host = S.Env.host, location = host.location, simulatedLocation, locationHref, configFns = S.Config.fns;
  _$jscoverage['/loader/configs.js'].lineData[15]++;
  if (visit344_15_1(!S.UA.nodejs && visit345_15_2(location && (locationHref = location.href)))) {
    _$jscoverage['/loader/configs.js'].lineData[16]++;
    simulatedLocation = new S.Uri(locationHref);
  }
  _$jscoverage['/loader/configs.js'].lineData[30]++;
  configFns.map = function(rules) {
  _$jscoverage['/loader/configs.js'].functionData[1]++;
  _$jscoverage['/loader/configs.js'].lineData[31]++;
  var Config = this.Config;
  _$jscoverage['/loader/configs.js'].lineData[32]++;
  if (visit346_32_1(rules === false)) {
    _$jscoverage['/loader/configs.js'].lineData[33]++;
    return Config.mappedRules = [];
  }
  _$jscoverage['/loader/configs.js'].lineData[35]++;
  return Config.mappedRules = (visit347_35_1(Config.mappedRules || [])).concat(visit348_35_2(rules || []));
};
  _$jscoverage['/loader/configs.js'].lineData[38]++;
  configFns.mapCombo = function(rules) {
  _$jscoverage['/loader/configs.js'].functionData[2]++;
  _$jscoverage['/loader/configs.js'].lineData[39]++;
  var Config = this.Config;
  _$jscoverage['/loader/configs.js'].lineData[40]++;
  if (visit349_40_1(rules === false)) {
    _$jscoverage['/loader/configs.js'].lineData[41]++;
    return Config.mappedComboRules = [];
  }
  _$jscoverage['/loader/configs.js'].lineData[43]++;
  return Config.mappedComboRules = (visit350_43_1(Config.mappedComboRules || [])).concat(visit351_43_2(rules || []));
};
  _$jscoverage['/loader/configs.js'].lineData[53]++;
  configFns.packages = function(cfgs) {
  _$jscoverage['/loader/configs.js'].functionData[3]++;
  _$jscoverage['/loader/configs.js'].lineData[54]++;
  var name, Config = this.Config, ps = Config.packages = visit352_56_1(Config.packages || {});
  _$jscoverage['/loader/configs.js'].lineData[57]++;
  if (visit353_57_1(cfgs)) {
    _$jscoverage['/loader/configs.js'].lineData[58]++;
    S.each(cfgs, function(cfg, key) {
  _$jscoverage['/loader/configs.js'].functionData[4]++;
  _$jscoverage['/loader/configs.js'].lineData[60]++;
  name = visit354_60_1(cfg.name || key);
  _$jscoverage['/loader/configs.js'].lineData[63]++;
  var baseUri = normalizeBase(visit355_63_1(cfg.base || cfg.path));
  _$jscoverage['/loader/configs.js'].lineData[65]++;
  cfg.name = name;
  _$jscoverage['/loader/configs.js'].lineData[66]++;
  cfg.base = baseUri.toString();
  _$jscoverage['/loader/configs.js'].lineData[67]++;
  cfg.baseUri = baseUri;
  _$jscoverage['/loader/configs.js'].lineData[68]++;
  cfg.runtime = S;
  _$jscoverage['/loader/configs.js'].lineData[69]++;
  delete cfg.path;
  _$jscoverage['/loader/configs.js'].lineData[70]++;
  if (visit356_70_1(ps[name])) {
    _$jscoverage['/loader/configs.js'].lineData[71]++;
    ps[name].reset(cfg);
  } else {
    _$jscoverage['/loader/configs.js'].lineData[73]++;
    ps[name] = new Loader.Package(cfg);
  }
});
    _$jscoverage['/loader/configs.js'].lineData[76]++;
    return undefined;
  } else {
    _$jscoverage['/loader/configs.js'].lineData[77]++;
    if (visit357_77_1(cfgs === false)) {
      _$jscoverage['/loader/configs.js'].lineData[78]++;
      Config.packages = {};
      _$jscoverage['/loader/configs.js'].lineData[80]++;
      return undefined;
    } else {
      _$jscoverage['/loader/configs.js'].lineData[82]++;
      return ps;
    }
  }
};
  _$jscoverage['/loader/configs.js'].lineData[113]++;
  configFns.modules = function(modules) {
  _$jscoverage['/loader/configs.js'].functionData[5]++;
  _$jscoverage['/loader/configs.js'].lineData[114]++;
  var self = this, Env = self.Env;
  _$jscoverage['/loader/configs.js'].lineData[116]++;
  if (visit358_116_1(modules)) {
    _$jscoverage['/loader/configs.js'].lineData[117]++;
    S.each(modules, function(modCfg, modName) {
  _$jscoverage['/loader/configs.js'].functionData[6]++;
  _$jscoverage['/loader/configs.js'].lineData[118]++;
  Utils.createModuleInfo(self, modName, modCfg);
  _$jscoverage['/loader/configs.js'].lineData[119]++;
  S.mix(Env.mods[modName], modCfg);
});
  }
};
  _$jscoverage['/loader/configs.js'].lineData[127]++;
  configFns.base = function(base) {
  _$jscoverage['/loader/configs.js'].functionData[7]++;
  _$jscoverage['/loader/configs.js'].lineData[128]++;
  var self = this, Config = self.Config, baseUri;
  _$jscoverage['/loader/configs.js'].lineData[131]++;
  if (visit359_131_1(!base)) {
    _$jscoverage['/loader/configs.js'].lineData[132]++;
    return Config.base;
  }
  _$jscoverage['/loader/configs.js'].lineData[134]++;
  baseUri = normalizeBase(base);
  _$jscoverage['/loader/configs.js'].lineData[135]++;
  Config.base = baseUri.toString();
  _$jscoverage['/loader/configs.js'].lineData[136]++;
  Config.baseUri = baseUri;
  _$jscoverage['/loader/configs.js'].lineData[137]++;
  return undefined;
};
  _$jscoverage['/loader/configs.js'].lineData[141]++;
  function normalizeBase(base) {
    _$jscoverage['/loader/configs.js'].functionData[8]++;
    _$jscoverage['/loader/configs.js'].lineData[142]++;
    var baseUri;
    _$jscoverage['/loader/configs.js'].lineData[143]++;
    base = base.replace(/\\/g, '/');
    _$jscoverage['/loader/configs.js'].lineData[144]++;
    if (visit360_144_1(base.charAt(base.length - 1) != '/')) {
      _$jscoverage['/loader/configs.js'].lineData[145]++;
      base += '/';
    }
    _$jscoverage['/loader/configs.js'].lineData[147]++;
    if (visit361_147_1(simulatedLocation)) {
      _$jscoverage['/loader/configs.js'].lineData[148]++;
      baseUri = simulatedLocation.resolve(base);
    } else {
      _$jscoverage['/loader/configs.js'].lineData[152]++;
      if (visit362_152_1(!S.startsWith(base, 'file:'))) {
        _$jscoverage['/loader/configs.js'].lineData[153]++;
        base = 'file:' + base;
      }
      _$jscoverage['/loader/configs.js'].lineData[155]++;
      baseUri = new S.Uri(base);
    }
    _$jscoverage['/loader/configs.js'].lineData[157]++;
    return baseUri;
  }
})(KISSY);
