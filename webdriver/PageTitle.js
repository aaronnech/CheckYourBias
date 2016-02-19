var assert = require('assert');

describe('PageTitle', function() {
    it('has the correct page title', function() {
        return browser
            .url('/')
            .getTitle().then((title) => {
                assert.equal(title, 'Check Your Bias');
            });
    });
});
