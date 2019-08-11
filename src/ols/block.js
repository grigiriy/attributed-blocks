/**
 * BLOCK: ols-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */



const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 
const { Component, Fragment } = wp.element;
const { InnerBlocks, InspectorControls } = wp.editor;
const { PanelBody, ToggleControl } = wp.components;

registerBlockType( 'blocks/ols-block', {
  title: __( 'ols-block', 'ols-block' ), 
  icon: 'heart',
  category: 'layout',
    attributes: {
      wrapper: {
         type: 'boolean',
         default: false
      }
    },

  edit ( { attributes, className, setAttributes } ) {
    const { wrapper } = attributes;


    return (
    <div
      className="_wrap _red"
      tagName={ wrapper ? 'ol' : 'li' }
    >
      <InspectorControls>
        <PanelBody title={ __( 'Options' ) } initialOpen={ true }>
          <ToggleControl
              label={ __( 'is Wrapper' ) }
              checked={ wrapper == true }
              onChange={ () => setAttributes( { wrapper: ! wrapper } ) }
            />
        </PanelBody>
      </InspectorControls>
      <InnerBlocks />
    </div>
    );
  },

  save ( { attributes } ) {
    const tagName = attributes.ordered ? '<ul>' : '<li>';
    const _tagName = attributes.ordered ? '</ol>' : '</li>';
    return (
    < Fragment >
    { tagName }
      <InnerBlocks.Content />
    { _tagName }
    </Fragment>
    );
  }

} );
