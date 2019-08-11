/**
 * Block external appendices.
 */


/**
 * Block internal appendices.
 */

// import icons from "./../../helper/icons";
// import Edit from "./edit";
import classnames from "classnames";
const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { InnerBlocks } = wp.editor;

export default registerBlockType("gutenstrap/columns", {
	title: __("Grid"),
	description: __("Powerful mobile-first flexbox grid."),
	category: "gutenstrap",
	icon: 'format-image',
	keywords: [__("columns"), __("grid"), __("row")],
	attributes: {
		align: {
			type: "string",
			default: ""
		},
		columns: {
			type: "number",
			default: 2
		}
	},
	supports: {
		align: ["wide", "full"],
		anchor: true,
		html: false
	},

	edit: 

/**
 * Block external appendices.
 */
import classnames from "classnames";
import memoize from "memize";
import times from "lodash/times";


/**
 * Block internal appendices.
 */

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { RangeControl } = wp.components;
const { InspectorControls, InnerBlocks } = wp.editor;

const ALLOWED_BLOCKS = ["gutenstrap/column"];
const getColumnsTemplate = memoize(columns => {
	return times(columns, n => ["gutenstrap/column", { id: n + 1 }]);
});


	const {
		setAttributes,
		attributes: { align, columns }
	} = this.props;
	const mainClasses = classnames(
		"gutenstrap-block",
		"gutenstrap-columns",
		"row",
		`${align}`
	);
	// Inline styles.
	const inlineBlockStyle = {};

	return (
		<Fragment>
			<InspectorControls>
				<RangeControl
					value={columns}
					onChange={columns => {
						setAttributes({ columns });
					}}
					min={2}
					max={12}
				/>
			</InspectorControls>
			<div className={mainClasses} style={inlineBlockStyle}>
				<InnerBlocks
					template={getColumnsTemplate(columns)}
					templateLock="all"
					allowedBlocks={ALLOWED_BLOCKS}
				/>
			</div>
		</Fragment>
	);



	save: props => {
		const {
			attributes: { align }
		} = props;

		//Main classes.
		const mainClasses = classnames(
			"gutenstrap-block",
			"gutenstrap-columns",
			"row",
			`${align}`
		);
		// Inline styles.
		const inlineBlockStyle = {};
		return (
			<div className={mainClasses} style={inlineBlockStyle}>
				<InnerBlocks.Content />
			</div>
		);
	}
});
