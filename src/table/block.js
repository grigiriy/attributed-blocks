/**
 * BLOCK: gutenberg-pricing-table
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InspectorControls, ColorPalette, PlainText, URLInputButton } = wp.editor;
const { TextControl, SelectControl, ToggleControl, RangeControl } = wp.components;
import CustomPopover from './custom-popover.js';

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'blocks/pricing-table', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'BP Pricing Table' ), // Block title.
	icon: 'editor-table', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Pricing Table' ),
		__( 'Block Party' ),
	],
	description: __( 'Create an organized table to display pricing options. Customize the link for each option by clicking on its button.'),
	attributes: {
		pricingItems: {
			type: 'array',
			default: [
				{
					title: '',
					amount: '0',
					planItems: [],
					button: {
						hasButton: true,
						text: 'Choose',
						link: '',
						color: 'white',
					},
					color: '#444',
				}
			],
		},
		currency: {
			type: 'string',
			default: '$',
		},
		per: {
			type: 'string',
			deafult: '',
		},
		openInNewTab: {
			type: 'boolean',
			default: false
		},
		borderRadius: {
			type: 'number',
			default: 0
		},
		paddingTopBottom: {
			type: 'number',
			default: 0
		},
		paddingRightLeft: {
			type: 'number',
			default: 0
		}
	},

	edit: function({ attributes, setAttributes, isSelected, className }) {

		const Controls = (
			<InspectorControls>
				<div className="pricingItems-controls-sm" style={{display: "flex", justifyContent: "space-between" }}>
					<SelectControl
						style={{ display: "inline-block", width: "auto"}}
						value={ attributes.currency }
						options={[
							{ value: '$', label: '$' },
							{ value: '£', label: '£' },
							{ value: '€', label: '€' },
						]}
						onChange={ value => setAttributes( { currency: value } ) }
					 label={ __( "Currency:" ) }
					/>
					<TextControl
						style={{textAlign: 'center', display: "inline-block", width: "100px" }}
						label={ __("Per:") }
						value={attributes.per}
						 onChange={ value => setAttributes( { per: value } ) }
						placeholder={ __("/") }
					/>
				</div>
				<ToggleControl
					label={ __("Open Buttons in New Tab?") }
					checked={ !! attributes.openInNewTab }
					onChange={ value => {
						setAttributes( { openInNewTab: value } )
					} }
				/>
				<RangeControl
					label={ __("Button Border Radius") }
					value={ attributes.borderRadius }
					min={0}
					max={10}
					onChange={ value => {
						setAttributes( { borderRadius: value } )
					} }
				/>
				<RangeControl
					label={ __("Vertical Button Padding") }
					value={ attributes.paddingTopBottom }
					min={0}
					max={30}
					onChange={ value => {
						setAttributes( { paddingTopBottom: value } )
					} }
				/>
				<RangeControl
					label={ __("Horizontal Button Padding") }
					value={ attributes.paddingRightLeft }
					min={0}
					max={30}
					onChange={ value => {
						setAttributes( { paddingRightLeft: value } )
					} }
				/>
			</InspectorControls>
		)

		const preventEnter = (e) => {
			if (e.key == 'Enter') {
				e.preventDefault()
			}
		}

		const addPricingItem = (
			<div style={{textAlign: 'right'}}>
				{ __("Add Item:") }&nbsp;
				<button type="button" style={{display: 'inline-block'}} className="components-button components-icon-button" onClick={() => {
					const newPricingItems = [ ...attributes.pricingItems ];
					let obj = {
						title: '',
						amount: '0',
						planItems: [],
						button: {
							hasButton: true,
							text: newPricingItems.length ? newPricingItems[newPricingItems.length-1].button.text : 'Choose',
							link: '',
							color: 'white',
						},
						color: '#444',
					}
					newPricingItems.push(obj)
					setAttributes( { pricingItems: newPricingItems } );
				}}><span className="dashicons dashicons-plus"></span></button>
			</div>
		)

		const renderPricingTable = (
			<div className={'pricing-table'}>
				{ attributes.pricingItems.map( (pricingItem, i) => {

					const deletePricingItem = () => {
						let newPricingItems = [ ...attributes.pricingItems ]
						newPricingItems.splice(i, 1)
						setAttributes( { pricingItems: newPricingItems } )
					}

					const determineInputWidth = (input) => {
						let longChars = ['m', 'G', 'M', 'O', 'Q', 'W',]
						let shortChars = ['i' , 'j', 'l', 't', 'I',]
						let inputArray = []
						let base
						//set the base depending on the input received
						switch(input) {
					    case pricingItem.amount:
								base = 25
								inputArray = input.split('')
					      break;
					    case pricingItem.title:
								base = 15
								inputArray = input.split('')
						    break;
					    default:
								base = 9
								if (input.text) {
									inputArray = input.text.split('')
								}
						}
						let mod = base - base / 2
						let width = 0
						inputArray.forEach(char => {
							if (longChars.includes(char)) {
								width += (base + mod)
							}
							else if (shortChars.includes(char)) {
								width += (base - mod)
							}
							else {
								width += base
							}
						})
						return `${width + base}px`
					}

					const PricingItemControlButtons = isSelected && (
						<div className="conrol-buttons-box" style={{display: 'flex', justifyContent: 'space-between'}}>
							<CustomPopover
								button={<span style={{color: pricingItem.color}} className="dashicons dashicons-art"></span>}
								content={
									<div className='color-control-box' style={{padding: '10px'}}>
										<div>
											{__('Main Color')}
											<ColorPalette
												value={pricingItem.color}
												onChange={ (value) => {
													let newPricingItems = [ ...attributes.pricingItems ]
													newPricingItems[i].color = value
													setAttributes( { pricingItems: newPricingItems } )
												} }
											/>
										</div>
										<div>
											{__('Button Text Color')}
											<ColorPalette
												value={pricingItem.button.color}
												onChange={ (value) => {
													let newPricingItems = [ ...attributes.pricingItems ]
													newPricingItems[i].button.color = value
													setAttributes( { pricingItems: newPricingItems } )
												} }
											/>
										</div>
									</div>}
							/>
							<button type="button" style={{display: 'inline-block', padding: "none", textIndent: "none"}} className="components-button components-icon-button" onClick={() => {
								deletePricingItem()
							}}>
								<span className="dashicons dashicons-trash"></span>
							</button>
						</div>
					)

					const renderDynamicWidthPlainText = (field) => {
						return (
							<PlainText
								style={{textAlign: "center", width: determineInputWidth(pricingItem[field]), minWidth: '50px'}}
								value={pricingItem[field]}
								onChange={ (value) => {
									let newPricingItems = [ ...attributes.pricingItems ]
									newPricingItems[i][field] = value
									setAttributes( { pricingItems: newPricingItems } )
								}}
								placeholder={field === 'title' ? __( "Title" ) :  __( "0" ) }
								onKeyDown={ e => preventEnter(e)}
							/>
						)
					}

					const Price = (
						<span className="plan-price-amount" style={{color: pricingItem.color}}>
							<span className="plan-price-currency"
								style={{position: 'relative', left: '15px', top: '-25px' }}>
								{attributes.currency}
							</span>
							<span>
								{ renderDynamicWidthPlainText('amount') }
							</span>
						</span>
					)

					const Per = (
						<span className="per-box" style={{position: 'relative', left: '-15px', top: '-20px' }}>
							{ attributes.per ? (
								"/"+attributes.per
							): null }
						</span>
					)

					const PlanItems = (

						pricingItem.planItems.map( (planItem, j) => {

							const deletePlanItem = () => {
								let newPlanItems = [ ...attributes.pricingItems[i].planItems ]
								let newPricingItems = [ ...attributes.pricingItems ]
								newPlanItems.splice(j, 1)
								newPricingItems[i].planItems = newPlanItems
								setAttributes( { pricingItems: newPricingItems } )
								if ( j != 0 ) {
									moveFocus.up()
								}
							}

							const addPlanItem = () => {
								let newPlanItem = { text: '' }
								let newPricingItems = [ ...attributes.pricingItems ]
								let newPlanItems = [ ...attributes.pricingItems[i].planItems ]
								newPlanItems.splice(j+1, 0, newPlanItem)
								newPricingItems[i].planItems = newPlanItems
								setAttributes( { pricingItems: newPricingItems } )
								setTimeout( () => { moveFocus.down() }, 100)
							}

							const handleOnKeyDown = (e) => {
								if (e.key == 'Enter') {
									e.preventDefault()
									addPlanItem()
								}
								if (e.key == 'Backspace' && attributes.pricingItems[i].planItems[j].text == '') {
									e.preventDefault()
									deletePlanItem()
								}
							}

							const moveFocus = {
								up: () => {
									document.getElementById("plan-item-"+i+(j-1)).focus()
								},
								down: () => {
									document.getElementById("plan-item-"+i+(j+1)).focus()
								},
								bottom: () => {
									document.getElementById("plan-item-"+i+(attributes.pricingItems[i].planItems.length)).focus()
								}
							}

							const DynamicWidthPlainText_PlanItem = (
								<PlainText
									id={"plan-item-"+i+j}
									style={{width: determineInputWidth(planItem), minWidth: '120px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0)'}}
									value={planItem.text}
									onChange={ value => {
										let newPlanItem = { text: value }
										let newPlanItems = [ ...attributes.pricingItems[i].planItems ]
										newPlanItems[j] = newPlanItem
										let newPricingItems = [ ...attributes.pricingItems ]
										newPricingItems[i].planItems = newPlanItems
										setAttributes( { pricingItems: newPricingItems } )
									}}
									onKeyDown={ e => handleOnKeyDown(e) }
								/>
							)

							return (
								<div className={"plan-item"} key={j}>
									{ DynamicWidthPlainText_PlanItem }
								</div>
							)
						})
					)

					const AddRemovePlanItemButtons = isSelected && (
						<div style={{textAlign: 'right'}}>
							<div style={{fontSize: "0.75em"}}>{ __("Add Detail:") }&nbsp;</div>
							<button style={{display: 'inline-block'}} className="components-button components-icon-button"
								onClick={() => {
									let newPlanItem = { text: '' }
									let newPlanItems = [ ...attributes.pricingItems[i].planItems ]
									newPlanItems.push(newPlanItem)
									let newPricingItems = [ ...attributes.pricingItems ]
									newPricingItems[i].planItems = newPlanItems
									setAttributes( { pricingItems: newPricingItems } )
									setTimeout( () => {document.getElementById("plan-item-"+i+(attributes.pricingItems[i].planItems.length-1)).focus() }, 100)
								}}>
									<span className="dashicons dashicons-plus"></span>
								</ button>
						</div>
					)

					const ButtonControls = (
						<div>
							<URLInputButton
								label={ __( "Link:" ) }
								url={pricingItem.button.link}
								 onChange={ (url, post) => {
									 let newPricingItems = [ ...attributes.pricingItems ]
									 newPricingItems[i].button.link = url
									 setAttributes( { pricingItems: newPricingItems } )
								 } }
							/>
						</div>
					)

					const renderButton = () => {
						return (
							<div>
								<button className="is-fullwidth" style={{color: pricingItem.button.color, backgroundColor: pricingItem.color, padding: attributes.paddingTopBottom + "px " + attributes.paddingRightLeft + "px", borderRadius: attributes.borderRadius}}>
									{ isSelected 
										?
											<PlainText
												value={pricingItem.button.text}
												 onChange={ value => {
													 let newPricingItems = [ ...attributes.pricingItems ]
													 newPricingItems[i].button.text = value
													 setAttributes( { pricingItems: newPricingItems } )
												 } }
												style={{width: "100px", color: pricingItem.button.color, backgroundColor: pricingItem.color}}
											/>
										:
											pricingItem.button.text }
								</button>
								{isSelected && ButtonControls}
							</div>
						)
					}

					return (
						<div className={"pricing-plan "+i} key={i}>
							{ PricingItemControlButtons }
							<h2 className="plan-header">
							{ renderDynamicWidthPlainText('title') }
							</h2>
							<h3 className="plan-price">
								{ Price }
								{ Per }
							</h3>
							<div className="plan-items">
								{ PlanItems }
							</div>
							{ AddRemovePlanItemButtons }
							<div className="plan-footer">
							{ isSelected &&
								<ToggleControl
									label={ __("Button?") }
									checked={ !! pricingItem.button.hasButton }
									onChange={ value => {
										let newPricingItems = [ ...attributes.pricingItems ]
										newPricingItems[i].button.hasButton = ! pricingItem.button.hasButton
										setAttributes( { pricingItems: newPricingItems } )
									} }
								/>
							}
								{
									pricingItem.button.hasButton ? (
										renderButton()
									) : null
								}
							</div>
						</div>
					)
				})}
			</div>
		)

		return [
			Controls,
			(
				<div className='wp-block-pricing-table'>
					{renderPricingTable}
					{ isSelected ?
						<div>
							{addPricingItem}
						</div>
					: null }
			 </div>
			)
		]

	},



	save: function({ attributes, setAttributes, className }) {

		return (
			<div className="pricing-table">
				{ attributes.pricingItems.map( (pricingItem, i) => {
					return (
						<div className={"pricing-plan "+i} key={i}>
							<h2 className="plan-header">
								{pricingItem.title}
							</h2>
							<h3 className="plan-price">
								<span className="plan-price-amount" style={{color: pricingItem.color}}>
									<span className="plan-price-currency">
										{attributes.currency}
									</span>
									{pricingItem.amount}
								</span>
								{attributes.per ? (
									"/"+attributes.per
								): null }
							</h3>
							<div className="plan-items">
								{
									pricingItem.planItems.map( (planItem, j) => {
										return (
											<div className={"plan-item "+j} key={j}>
												{planItem.text ? planItem.text : <div>&nbsp;</div>}
											</div>
										)
									})
								}
							</div>
							<div className="plan-footer">
								{
									pricingItem.button.hasButton ? (
										 <a href={pricingItem.button.link} target={ attributes.openInNewTab ? "_blank" : null} rel="noopener noreferrer"><button className="button is-fullwidth" style={{backgroundColor: pricingItem.color, color: pricingItem.button.color, padding: attributes.paddingTopBottom + "px " + attributes.paddingRightLeft + "px", borderRadius: attributes.borderRadius}} onMouseEnter={"this.style.color='" + pricingItem.color + "'; this.style.backgroundColor='" + pricingItem.button.color + "';"} onMouseOut={"this.style.color='" + pricingItem.button.color + "'; this.style.backgroundColor='" + pricingItem.color + "';"}>{pricingItem.button.text}</button></a>
										
									) : null
								}
							</div>
						</div>
					)
				})}
			</div>
		);
	},
} );
