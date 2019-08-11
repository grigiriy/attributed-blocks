/**
 * BLOCK: figureimage-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

const { RichText, MediaUpload, PlainText } = wp.editor;
const { registerBlockType } = wp.blocks;
const { Button } = wp.components;

registerBlockType('blocks/figureimage-block', {   
  title: 'figureimage',
  icon: 'format-image',
  category: 'common',
  supports: {
    className: false,
  },
  attributes: {
    body: {
      type: 'array',
      source: 'children',
      selector: '.card__body'
    },
    imageAlt: {
      attribute: 'alt',
      selector: '.card__image'
    },
    imageUrl: {
      attribute: 'src',
      selector: '.card__image'
    }
  },
  edit({ attributes, className, setAttributes }) {

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
      <div className="container">
        <MediaUpload
          onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
          type="image"
          value={ attributes.imageID }
          render={ ({ open }) => getImageButton(open) }
        />
        <RichText
          onChange={ content => setAttributes({ body: content }) }
          value={ attributes.body }
          multiline="p"
          placeholder="Your card text"
          formattingControls={ ['bold', 'italic', 'underline'] }
          isSelected={ attributes.isSelected }
        />
      </div>
    );

  },

  save({ attributes }) {

    const cardImage = (src, alt) => {
      if(!src) return null;

      if(alt) {
        return (
          <img 
            className="card__image" 
            src={ src }
            alt={ alt }
            itemprop="image"
          /> 
        );
      }
      
      // No alt set, so let's hide it from screen readers
      return (
        <img 
          className="card__image" 
          src={ src }
          alt=""
          itemprop="image"
          aria-hidden="true"
        /> 
      );
    };
    
    return (
      <figure >
        { cardImage(attributes.imageUrl, attributes.imageAlt) }
          <figcaption className="card__body" itemprop="text">
            { attributes.body }
          </figcaption>
      </figure>
    );
  }
});