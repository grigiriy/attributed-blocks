/**
 * BLOCK: image-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */



const { __ } = wp.i18n; 
const { MediaUpload } = wp.editor;
const { registerBlockType } = wp.blocks;
const { Button, PanelBody } = wp.components;

registerBlockType( 'blocks/image-block', {
  title: __( 'image-block', 'image-block' ), 
  icon: 'format-image',
  category: 'common',
  supports: {
    className: false,
  },
  attributes: {
        imageUrl: {
          type: 'string',
          selector: 'img'
        },
        imageAlt: {
          type: 'string',
          selector: 'img'
        },
        itemprop: {
          type: 'string',
          selector: 'div'
        },
  },

  edit ( { className, attributes, setAttributes } ) {

    const getImageButton = (openEvent) => {
      if(attributes.imageUrl) {
        return (
          <img 
            src={ attributes.imageUrl }
            onClick={ openEvent }
            className="image"
          />
        );
      }
      else {
        return (
          <div className="button-container">
            <Button 
              onClick={ openEvent }
              className="button button-large"
            >
              Pick an image
            </Button>
          </div>
        );
      }
    };

    return (
      <MediaUpload
        onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
        type="image"
        value={ attributes.imageID }
        render={ ({ open }) => getImageButton(open) }
      />
    );
  },

  save({ attributes }) {
    if(!attributes.imageUrl) return null;
    return (
      <img 
        src={ attributes.imageUrl }
        alt={ attributes.imageAlt }
        itemprop={ attributes.itemprop }
      /> 
      );
  }

} );
