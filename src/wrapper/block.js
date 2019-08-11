/**
 * BLOCK: wrapper-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */



const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 
const { Component } = wp.element;
const { InnerBlocks } = wp.editor;
const { PanelBody } = wp.components;

registerBlockType( 'blocks/wrapper-block', {
  title: __( 'wrapper-block', 'wrapper-block' ), 
  icon: 'editor-table',
  category: 'layout',
  supports: {
    className: false,
  },
  attributes: {
        itemprop: {
          type: 'string',
          selector: 'div'
        },
        itemtype: {
          type: 'string',
          selector: 'div'
        }
  },

  edit ( { className, attributes, setAttributes } ) {

    return (
    <div className="_wrap">
      <InnerBlocks />
    </div>
    );
  },

  save ( { attributes } ) {
    const { itemprop, itemtype } = attributes;
    if (itemprop) {
        if (itemtype) {
            return (
            <div itemprop={itemprop} itemtype={itemtype} itemscope >
                <InnerBlocks.Content />
            </div>
            ) 
        }
        return (
            <div itemprop={itemprop}>
                <InnerBlocks.Content />
            </div>
        )
    } else if (!itemprop && itemtype) {
        return (
            <div itemtype={itemtype} itemscope >
                <InnerBlocks.Content />
            </div>
        )
    }
  }

})