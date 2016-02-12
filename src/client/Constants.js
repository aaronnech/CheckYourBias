var Constants = (function () {
    function Constants() {
    }
    Constants.SCREENS = {
        FACEBOOK: 0,
        RATE_VIEWPOINTS: 1,
        CROWDSOURCING: 2,
        CANDIDATE_RANKING: 3,
        POLITICAL_PROFILE: 4,
        USER_PROFILE: 5
    };
    Constants.AUTH = {
        TOKEN: 'accessToken',
        UID: 'userID',
        FULL_NAME: "userFullName"
    };
    Constants.CONTENT_TYPES = [
        'Direct Quote',
        'General Content',
    ];
    Constants.CANDIDATES = [
        'Bernie Sanders',
        'Hillary Clinton',
        'Ted Cruz',
        'Marco Rubio',
        'Donald Trump',
    ];
    Constants.CATEGORIES = [
        'Crime and Safety',
        'Economy',
        'Education',
        'Environment',
        'Foreign Policy',
        'Gun Control',
        'Health Care',
        'Immigration',
        'National Security',
        'Social Security',
        'Taxes',
    ];
    Constants.STANCES = [
        'Strongly Disagree',
        'Disagree',
        'Neutral',
        'Agree',
        'Strongly Agree',
    ];
    Constants.ERRORS = {
        REQUIRED: 'This field is required'
    };
    Constants.FIREBASE_URL = "https://check-your-bias.firebaseio.com/Test/";
    Constants.FIRE_USER = Constants.FIREBASE_URL + 'Users/';
    Constants.FIRE_CANDIDATE = Constants.FIREBASE_URL + 'Candidates/';
    Constants.FIRE_ISSUE = Constants.FIREBASE_URL + 'Issues/';
    Constants.fireAccess = '';
    return Constants;
})();
module.exports = Constants;
