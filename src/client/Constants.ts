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

	public static CONTENT_TYPES: string[] = [
		'Direct Quote',
		'General Content',
	];

	public static CANDIDATES: string[] = [
		'Bernie Sanders',
		'Hillary Clinton',
		'Ted Cruz',
		'Marco Rubio',
		'Donald Trump',
	];

	public static CATEGORIES: string[] = [
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

	public static STANCES: string[] = [
		'Strongly Disagree',
		'Disagree',
		'Neutral',
		'Agree',
		'Strongly Agree',
	];

	public static STANCE_COLORS: any = [
		'#ff8080',
		'#ffb3b3',
		'#d9d9d9',
		'#99b4ff',
		'#668eff',

	];

	public static ERRORS: any = {
		REQUIRED: 'This field is required',
		NO_ISSUE: 'No issues are available for voting. Hang in there.'
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