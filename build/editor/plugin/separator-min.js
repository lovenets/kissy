/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 11 14:21
*/
KISSY.add("editor/plugin/separator",function(b){function a(){}b.augment(a,{pluginRenderUI:function(a){b.all('<span class="'+a.get("prefixCls")+'editor-toolbar-separator">&nbsp;</span>').appendTo(a.get("toolBarEl"))}});return a},{requires:["editor"]});
