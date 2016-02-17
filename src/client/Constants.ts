class Constants {
	public static SCREENS: any = {
		FACEBOOK : 0,
		RATE_VIEWPOINTS: 1,
		CROWDSOURCING: 2,
		CANDIDATE_RANKING: 3,
		POLITICAL_PROFILE: 4,
	};

	public static AUTH: any = {
		TOKEN: 'accessToken',
		UID: 'userID',
		FULL_NAME: "userFullName"
	};

	public static CONTENT_TYPES: any = [
		'Direct Quote',
		'General Content',
	];

	public static CANDIDATES: any = [
		'Bernie Sanders',
		'Hillary Clinton',
		'Ted Cruz',
		'Marco Rubio',
		'Donald Trump',
	];

	public static CATEGORIES: any = [
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

	public static STANCES: any = [
		'Strongly Disagree',
		'Disagree',
		'Neutral',
		'Agree',
		'Strongly Agree',
	];

	public static ERRORS: any = {
		REQUIRED: 'This field is required',
	}

	public static FIREBASE_URL: string = "https://check-your-bias.firebaseio.com/Prod/";
	public static FIRE_USER: string = 'Users/';
	public static FIRE_CANDIDATE: string = 'Candidates/';
	public static FIRE_CATEGORY: string = 'Categories/';
	public static FIRE_ISSUE: string = 'Issues/';
	public static firebaseUrl: string = '';

	public static FIREBASE_URL_TEST: string = "https://check-your-bias.firebaseio.com/Test/";

}

export = Constants;