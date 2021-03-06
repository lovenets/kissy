/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 11 14:19
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 editor/plugin/indent/cmd
*/

/**
 * @ignore
 * Add indent and outdent command identifier for KISSY Editor.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/indent/cmd", function (S, Editor, dentUtils) {
    var addCommand = dentUtils.addCommand;
    return {
        init:function (editor) {
            addCommand(editor, "indent");
        }
    };

}, {
    requires:['editor', '../dent-cmd']
});

