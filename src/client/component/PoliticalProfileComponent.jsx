var React = require('react');

/**
 * This component displays to the user their previously answered questions
 * and the candidates' ranking based on their answers.
 *
 * @author ravnon
 */
var PoliticalProfileComponent = React.createClass({
	/**
	 * Callback that fires when user selects this component
	 * @param page
	 */
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<div className="political-profile">
				<div className="rate-scale">
					<p className="indentSides">403 Issues Voted on!</p>
					<h3>Your Candidates:</h3>
					<ol>
						<li>Bernie Sanders</li>
						<li>Carly Fiorina</li>
						<li>Jim Webb</li>
					</ol>
				</div>
			</div>
		);
	}
});

module.exports = PoliticalProfileComponent;