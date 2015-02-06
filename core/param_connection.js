'use strict';

goog.provide('Blockly.ParamConnection');

goog.require('Blockly.Connection');

Blockly.ParamConnection = function(source, type) {
    Blockly.ParamConnection.superClass_.constructor.call(this, source, type);

}
goog.inherits(Blockly.ParamConnection, Blockly.Connection);

Blockly.ParamConnection.prototype.disconnect = function() {
    console.info("param disconnect");
    var sourceConnection = this.targetConnection;
    var sourceBlock = this.sourceBlock_;

    Blockly.ParamConnection.superClass_.disconnect.call(this);
    
    // HACK use rendered to check if disconnect is due to deletion
    if (sourceBlock.rendered) {
        var param = sourceBlock.duplicateParam();
        sourceConnection.connect(param.outputConnection);
    }
}