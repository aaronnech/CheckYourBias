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
		'Summary of Legislation',
		'General',
	];

	public static CANDIDATES: any = [
		'Hillary Clinton',
		'Bernie Sanders',
		'Ted Cruz',
		'Donald Trump',
		'Marco Rubio',
	];

	public static ERRORS: any = {
		REQUIRED: 'This field is required',
	}

	public static FIREBASE_URL: string = "";
	public static FIRE_USER: string = Constants.FIREBASE_URL + 'users/';
	public static fireAccess: string = '';
}

export = Constants;