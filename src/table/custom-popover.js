const { Popover } = wp.components;
const { Component } = wp.element;

export default class CustomPopover extends Component {
	constructor() {
		super();
		this.state = {
			isOpen: false
		};
	}

	render() {
		const { isOpen } = this.state;
		const { content, button } = this.props;
		return (
			<span>
				<button style={{display: "inline-block", padding: "none", textIndent: "none"}} className="components-button components-icon-button" onClick={ () => this.setState({isOpen: !isOpen})} aria-expanded={ isOpen }>
					{button}
				</button>
				{isOpen && (
					<Popover 
						position={'bottom'}
					>
						{content}
					</Popover>
				)}
			</span>
		)
	}
}