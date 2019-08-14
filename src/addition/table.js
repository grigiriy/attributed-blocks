const { __ } = wp.i18n
const { createHigherOrderComponent } = wp.compose
const { Fragment } = wp.element
const { InspectorControls, PlainText, InnerBlocks } = wp.editor
const { PanelBody, ToggleControl } = wp.components
const el = wp.element.createElement

const attributes = {
    thead: {
    	default: false,
        type: 'boolean'
    }
}

const _block = 'core/table';

function createHeaderField ( settings, name ) {
    if ( _block != name ) {
        return settings
    }
    settings.attributes = lodash.assign( settings.attributes, attributes );
    return settings
}


const addHeaderField = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        if ( _block != props.name ) {
            return (
                <BlockEdit { ...props } />
            );
        }

        const { thead } = props.attributes;

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody
                        title={ __( 'Table options' ) }
                        initialOpen={ true }
                    >
                    <ToggleControl>
	                    label="Has thead"
				        checked={ thead == true }
				        onChange={ () => {
                            setAttributes( {
                                thead: !thead
                            } );
                        }
                    };
                    </ToggleControl>
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'addHeaderField' );


const getExtendedTable = ( props, blockType, attributes ) => {
const { thead } = attributes;
    if ( _block != props.name ) {
        return props;
    }
    props.thead = thead;
    return props;
};


 function addThead( element, blockType, attributes ) {
    return element;
}



wp.hooks.addFilter( 'blocks.registerBlockType', 'blocks/create-thead-attributes', createHeaderField );
wp.hooks.addFilter( 'editor.BlockEdit', 'blocks/add-thead-field', addHeaderField );
wp.hooks.addFilter( 'blocks.getSaveContent.extraProps', 'blocks/get-extended-table', getExtendedTable );
wp.hooks.addFilter( 'blocks.getSaveElement', 'blocks/thead-create', addThead );