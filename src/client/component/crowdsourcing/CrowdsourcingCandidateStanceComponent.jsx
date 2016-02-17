var React = require('react');
var Constants = require('../../Constants');

var StanceSelector = require('../StanceSelector.jsx');

/**
 * Component that groups a candidate and a stance slider
 *
 * @author sonjakhan
 */
var CrowdsourcingCandidateStanceComponent = React.createClass({

    /**
     * Calls the given callback with the value the user updated the slider to
     */
    handleUpdateStance(event, value) {
        this.props.handleUpdateStance(this.props.candidate, value);
    },

    render : function() {
        return (
            <div>
                <p className="candidateLabel">{this.props.candidate}</p>
                <div style={{display: 'block', textAlign: 'center'}}>
                    <StanceSelector
                        candidate={this.props.candidate}
                        handleUpdateStance={this.handleUpdateStance}
                        value={this.props.value}
                    />
                </div>
            </div>
        );
    }
});

module.exports = CrowdsourcingCandidateStanceComponent;