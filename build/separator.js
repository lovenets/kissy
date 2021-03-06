/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 11 14:26
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 separator/render
 separator
*/

/**
 * separator render def
 * @author yiminghe@gmail.com
 */
KISSY.add("separator/render", function (S, Control) {

    return Control.getDefaultRender().extend({
        beforeCreateDom: function (renderData) {
            renderData.elAttrs.role = 'separator';
        }
    });

}, {
    requires: ['component/control']
});
/**
 * separator def
 * @author yiminghe@gmail.com
 */
KISSY.add("separator", function (S, Control, SeparatorRender) {

    /**
     * separator component for KISSY. xclass: 'separator'.
     * @extends KISSY.Component.Control
     * @class KISSY.Separator
     */
    return Control.extend({
    }, {
        ATTRS: {

            /**
             * Un-focusable.
             * readonly.
             * Defaults to: false.
             */
            focusable: {
                value: false
            },

            disabled: {
                value: true
            },

            handleMouseEvents: {
                value: false
            },

            xrender: {
                value: SeparatorRender
            }
        },
        xclass: 'separator'
    });

}, {
    requires: ['component/control', 'separator/render']
});

