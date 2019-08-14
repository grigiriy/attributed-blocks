const { __ } = wp.i18n
const { createHigherOrderComponent } = wp.compose
const { Fragment } = wp.element
const { InspectorControls, PlainText, InnerBlocks } = wp.editor
const { PanelBody } = wp.components
const el = wp.element.createElement

const _attributes = {
    itemprop: {
        type: 'string'
    },
    itemtype: {
        type: 'string'
    }
}

const _blocks = [
    'core/heading',
    'core/image',
    'core/paragraph',
    'core/table',
    'blocks/wrapper-block',
    'blocks/image-block',
    'blocks/ols-block',
    'wp-bootstrap-blocks/row'
]

function createSchemaAttributes ( settings, name ) {
    if ( ! _blocks.includes( name ) ) {
        return settings
    }
    settings.attributes = lodash.assign( settings.attributes, _attributes );
    return settings
}

const addSchemaFields = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        if ( ! _blocks.includes( props.name ) ) {
            return (
                <BlockEdit { ...props } />
            );
        }

        const { itemprop, itemtype } = props.attributes;

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody
                        title={ __( 'Options' ) }
                        initialOpen={ true }
                    >
                        <p>
                            <p className="_label">itemprop</p>
                            <PlainText
                                className="_att"
                                value={ itemprop }
                                onChange={ content => {
                                    props.setAttributes( {
                                        itemprop: content
                                    } );
                                } }
                            />
                        </p>
                        <p>
                            <p className="_label">itemtype</p>
                            <PlainText
                                className="_att"
                                value={ itemtype }
                                onChange={ content => {
                                    props.setAttributes( {
                                        itemtype: content
                                    } );
                                } }
                            />
                        </p>
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'addSchemaFields' );

const getExtendedElements = ( props, blockType, attributes ) => {
const { itemprop, itemtype } = attributes;
    if ( ! _blocks.includes( blockType.name ) ) {
        return props;
    }
    props.itemprop = itemprop;
    props.itemtype = itemtype;
    return props;
};


 function addAttributes( element, blockType, attributes ) {
    return element;
}



wp.hooks.addFilter( 'blocks.registerBlockType', 'blocks/create-schema-attributes', createSchemaAttributes );
wp.hooks.addFilter( 'editor.BlockEdit', 'blocks/add-schema-fields', addSchemaFields );
wp.hooks.addFilter( 'blocks.getSaveContent.extraProps', 'blocks/get-extended-elements', getExtendedElements );
wp.hooks.addFilter( 'blocks.getSaveElement', 'blocks/attributes-create', addAttributes );

