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

	public static CACHE: any = {
		CATEGORIES: 'categories',
		CANDIDATES: 'candidates'
	};

	public static CONTENT_TYPES: string[] = [
		'Direct Quote',
		'General Content',
	];

	public static CANDIDATES: string[] = [
		'Bernie Sanders',
		'Hillary Clinton',
		'Donald Trump',
		'Ted Cruz',
		'Ben Carson',
		'John Kasich',
		'Marco Rubio',
	];

	public static CANDIDATE_AVATARS: string[] = [
		'img/candidate_0.jpg',
		'img/candidate_1.jpg',
		'img/candidate_2.jpg',
		'img/candidate_3.jpg',
		'img/candidate_4.jpg',
		'img/candidate_5.jpg',
		'img/candidate_6.jpg'
	];

	public static GENERAL_AVATAR: string = "img/general_avatar.svg";

	public static CATEGORIES: string[] = [
		'Education',
		'Immigration',
		'Crime and Safety',
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
		REQUIRED: 'This field is required.',
		BLANK_LINE: ' ',
		STANCE_REQUIRED: 'You must select a stance before voting.',
		NO_ISSUE: 'No issues are available for voting. Hang in there.',
		NO_ISSUE_HEADER: 'No more issues.',
		NO_RANKED_CANDIDATES: 'No candidates to display.'
	};

	public static FIREBASE_URL: string = "https://check-your-bias.firebaseio.com/Prod/";
	public static FIREBASE_CONNECTION: string = "https://check-your-bias.firebaseio.com/.info/connected";
	public static FIRE_USER: string = 'Users/';
	public static FIRE_CANDIDATE: string = 'Candidates/';
	public static FIRE_CATEGORY: string = 'Categories/';
	public static FIRE_ISSUE: string = 'Issues/';
	public static firebaseUrl: string = '';

	public static FIREBASE_URL_TEST: string = "https://check-your-bias.firebaseio.com/Test/";

	public static URL_REG_EXP: any = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
}

export = Constants;