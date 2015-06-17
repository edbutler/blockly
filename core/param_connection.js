'use strict';

goog.provide('Blockly.ParamConnection');

goog.require('Blockly.Connection');

Blockly.ParamConnection = function(source, type) {
    Blockly.ParamConnection.superClass_.constructor.call(this, source, type);

}
goog.inherits(Blockly.ParamConnection, Blockly.Connection);

Blockly.ParamConnection.prototype.paramDisconnect = function(replacement) {
    
    var targetBlock = this.targetBlock();
    this.targetConnection = null;

    // HACK use rendered to check if disconnect is due to deletion
    // only duplicate if there's no replacement being attached
    if (this.sourceBlock_.rendered && !replacement) {
        var param = targetBlock.duplicateParam();
        this.connect(param.outputConnection);
    }

    // signal caller to delete source
    if (replacement && targetBlock.isDefault) {
        return true;
    }
}