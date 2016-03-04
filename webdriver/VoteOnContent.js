var assert = require('assert');



describe('VoteOnContent', function() {
    it('Can vote on content', function() {
        return browser
            .url('/#wdtestuser=true')
            .refresh()
            .waitForExist('#strongly-agree')
            .click('#strongly-agree')
            .waitForExist('#vote')
            .click('#vote')
            .waitForExist('#nextissue')
            .click('#nextissue')
            .waitForExist('#vote');
    });
});