'use strict';

goog.provide('Blockly.ParamConnection');

goog.require('Blockly.Connection');

Blockly.ParamConnection = function(source, type) {
    Blockly.ParamConnection.superClass_.constructor.call(this, source, type);

}
goog.inherits(Blockly.ParamConnection, Blockly.Connection);

Blockly.ParamConnection.prototype.disconnect = function(replacement) {
    // console.info("param disconnect");
    var sourceConnection = this.targetConnection;
    var sourceBlock = this.sourceBlock_;

    Blockly.ParamConnection.superClass_.disconnect.call(this);
    
    // HACK use rendered to check if disconnect is due to deletion
    // only duplicate if there's no replacement being attached
    if (sourceBlock.rendered && !replacement) {
        var param = sourceBlock.duplicateParam();
        sourceConnection.connect(param.outputConnection);
    }

    // delete current parameter if we're replacing the default
    // if (replacement && sourceBlock.isDefault) {
    //     sourceBlock.dispose();
    // }
}