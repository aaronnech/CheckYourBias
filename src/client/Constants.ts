class Constants {
	public static SCREENS: any = {
		FACEBOOK : 0,
		RATE_VIEWPOINTS: 1
	};

	public static AUTH: any = {
		TOKEN: 'accessToken',
		UID: 'userID',
		FULL_NAME: "userFullName"
	};

	public static FIREBASE_URL: string = "";
	public static FIRE_USER: string = Constants.FIREBASE_URL + 'users/';
	public static fireAccess: string = '';
}

export = Constants;