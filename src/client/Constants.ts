class Constants {
	public static SCREENS: any = {
		FACEBOOK : 0,
		RATE_VIEWPOINTS: 1,
		CROWDSOURCING: 2,
		CANDIDATE_RANKING: 3
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

	public static FIREBASE_URL: string = "https://check-your-bias.firebaseio.com/Test/";
	public static FIRE_USER: string = Constants.FIREBASE_URL + 'Users/';
	public static fireAccess: string = '';
}

export = Constants;