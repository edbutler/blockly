/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Object representing a warning.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Warning');

goog.require('Blockly.Bubble');
goog.require('Blockly.Icon');


/**
 * Class for a warning.
 * @param {!Blockly.Block} block The block associated with this warning.
 * @extends {Blockly.Icon}
 * @constructor
 */
Blockly.Warning = function(block) {
  Blockly.Warning.superClass_.constructor.call(this, block);
  this.createIcon();
  // The text_ object can contain multiple warnings
  this.text_ = { default_: '' };
};
goog.inherits(Blockly.Warning, Blockly.Icon);

/**
 * Icon in base64 format.
 * @private
 */
Blockly.Warning.prototype.png_ = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3IAAANyAF98iWoAAAAB3RJTUUH3wYSFhIK2mYo4QAAAbVJREFUOMudk89LG0EUx2dWlyikPRb8AyTkmIrNP9BDQfIvtLfm0JNQDxokguBNeqgFhfYs+C8IPfTaXjz0IoJQliDY/Njs7GSbmdlPD0uqSbaN6YPH8Oa9+b7vvB9C/EOAEtAASuJ/BFiJleu490c2Vq4DrMwNEvXMud3bHyIldm9/GPXM+bwsnndaWlEogJRQKNAO4gh48VCARRWaa2q1DGCktRoqND8AfybIr8Rtdb9cqNFDTk5gYwOkJPz8VSXabs1i8WSgXUSplGVvNgFgdzezV1cZaKcmi+zdN7Ry7xaPP/ji8jI/y9WV8I+P/Dg0h39j8bTfNTG+f1eHRiNjsr09Vp+wPYyBZ2NMAKlC+6m4+XpZWHuH3GplZxCMJXz0tr6sQvsRkH8urU1f3X6/UWPdkBKqVX5+u4b1dSZ9txeBsjZ9OfpGMVauQ7U6FcjaGtTrUKnk+nTsusBjkQxc05ye6amgvO5MqDk908nANUXUM0Fuppw5mdJKhahnAqH6tk25nB80S8tlVN+2pY7MG+F5B96CXEodPHS/vAUpU0ci0nRH3puTohDCn2NPjZRSCSHEbza/s/67eJF4AAAAAElFTkSuQmCC';

/**
 * Create the text for the warning's bubble.
 * @param {string} text The text to display.
 * @return {!SVGTextElement} The top-level node of the text.
 * @private
 */
Blockly.Warning.textToDom_ = function(text, image) {
  var g = Blockly.createSvgElement('g', {}, null);
  var img = Blockly.createSvgElement('image', {width:'20', height:'20', "xlink:href":image}, g);
  var paragraph = /** @type {!SVGTextElement} */ (
      Blockly.createSvgElement('text',
          {'class': 'blocklyText blocklyBubbleText',
           'y': Blockly.Bubble.BORDER_WIDTH},
          g));
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var tspanElement = Blockly.createSvgElement('tspan',
        {'dy': '1em', 'x': Blockly.Bubble.BORDER_WIDTH}, paragraph);
    var textNode = document.createTextNode(lines[i]);
    tspanElement.appendChild(textNode);
  }
  return g;
};

/**
 * Show or hide the warning bubble.
 * @param {boolean} visible True if the bubble should be visible.
 */
Blockly.Warning.prototype.setVisible = function(visible) {
  if (visible == this.isVisible()) {
    // No change.
    return;
  }
  if (visible) {
    // Create the bubble to display all warnings.
    var allWarnings = [];
    for (var id_ in this.text_) {
      allWarnings.push(this.text_[id_]);
    }
    var paragraph = Blockly.Warning.textToDom_(allWarnings.join('\n'));
    this.bubble_ = new Blockly.Bubble(
        /** @type {!Blockly.Workspace} */ (this.block_.workspace),
        paragraph, this.block_.svgPath_,
        this.iconX_, this.iconY_, null, null);
    if (this.block_.RTL) {
      // Right-align the paragraph.
      // This cannot be done until the bubble is rendered on screen.
      var maxWidth = paragraph.getBBox().width;
      for (var x = 0, textElement; textElement = paragraph.childNodes[x]; x++) {
        textElement.setAttribute('text-anchor', 'end');
        textElement.setAttribute('x', maxWidth + Blockly.Bubble.BORDER_WIDTH);
      }
    }
    this.updateColour();
    // Bump the warning into the right location.
    var size = this.bubble_.getBubbleSize();
    this.bubble_.setBubbleSize(size.width, size.height);
  } else {
    // Dispose of the bubble.
    this.bubble_.dispose();
    this.bubble_ = null;
    this.body_ = null;
  }
};

/**
 * Bring the warning to the top of the stack when clicked on.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Warning.prototype.bodyFocus_ = function(e) {
  this.bubble_.promote_();
};

/**
 * Set this warning's text.
 * @param {string} text Warning text.
 * @param {string=} opt_id An optional ID for this text entry to be able to
 *     maintain multiple warnings.
 */
Blockly.Warning.prototype.setText = function(text, opt_id) {
  if (opt_id !== undefined) {
    if (this.text_[opt_id] == text) {
      return;
    }
    this.text_[opt_id] = text;
  } else {
    if (this.text_.default_ == text) {
      return;
    }
    this.text_.default_ = text;
  }
  if (this.isVisible()) {
    this.setVisible(false);
    this.setVisible(true);
  }
};

/**
 * Removes the specified warning text.
 * @param {string} textId ID of the warning to be removed.
 */
Blockly.Warning.prototype.removeText = function(textId) {
  if (this.text_[textId] === undefined) {
    return;  // ID not found, no change.
  }
  delete this.text_[textId];
  if (Object.keys(this.text_).length === 0 ||
      (Object.keys(this.text_).length === 1 && !this.text_.default_)) {
    this.dispose();
  } else {
    if (this.isVisible()) {
      this.setVisible(false);
      this.setVisible(true);
    }
  }
};

/**
 * Dispose of this warning.
 */
Blockly.Warning.prototype.dispose = function() {
  this.block_.warning = null;
  Blockly.Icon.prototype.dispose.call(this);
};
