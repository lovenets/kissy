/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 11 14:20
*/
KISSY.add("editor/plugin/maximize",function(c,e,d){function b(){}c.augment(b,{pluginRenderUI:function(a){d.init(a);a.addButton("maximize",{tooltip:"\u5168\u5c4f",listeners:{click:function(){this.get("checked")?(a.execCommand("maximizeWindow"),this.set("tooltip","\u53d6\u6d88\u5168\u5c4f"),this.set("contentCls","restore")):(a.execCommand("restoreWindow"),this.set("tooltip","\u5168\u5c4f"),this.set("contentCls","maximize"));a.focus()}},checkable:!0})}});return b},{requires:["editor","./maximize/cmd"]});
