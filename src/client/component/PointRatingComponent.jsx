var React = require('react');

var radioWrapperStyle = {
	textAlign: 'center',
	marginTop: '1em',
	overflow: 'hidden'
};

var leftTextStyle = {
	float: 'left',
	top: '2em',
	color: '#CC669A'
};

var rightTextStyle = {
	float: 'right',
	top: '2em',
	color: '#52B72E'
};

/**
 * This component is a 5-point scale that allows the user to
 * indicate their level of agreement with an issue.
 *
 * @author g-liu
 */
var PointRatingComponent = React.createClass({
	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<div className="point-rating">
				<div id="radio-wrapper" style={radioWrapperStyle}>
					<input type="radio" id="c1" name="agreement-indicator" value="1" /><label htmlFor="c1"><span></span></label>
					<input type="radio" id="c2" name="agreement-indicator" value="2" /><label htmlFor="c2"><span></span></label>
					<input type="radio" id="c3" name="agreement-indicator" value="3" /><label htmlFor="c3"><span></span></label>
					<input type="radio" id="c4" name="agreement-indicator" value="4" /><label htmlFor="c4"><span></span></label>
					<input type="radio" id="c5" name="agreement-indicator" value="5" /><label htmlFor="c5"><span></span></label>

					<span id="left-text" style={leftTextStyle}>{this.props.leftText}</span>
					<span id="right-text" style={rightTextStyle}>{this.props.rightText}</span>
				</div>
			</div>
		);
	}
});

module.exports = PointRatingComponent;