/// <reference path="../common/def/firebase.d.ts"/>
/// <reference path="../common/def/node.d.ts"/>

import Firebase = require("firebase");
import Cache = require('./Cache');
import Constants = require('./Constants');
import User = require('../common/User');

/**
 * Static application API for Authentication
 */
class Auth {
	public static FIRE = new Firebase(Constants.FIREBASE_URL);

	private static getHashValue(key) {
		var matches = window.location.hash.match(new RegExp(key + '=([^&]*)'));
		return matches ? matches[1] : null;
	}

	private static loginTestUser(cb) {
		Cache.setCacheKV(Constants.AUTH.TOKEN, 'fake_accessToken');
		Cache.setCacheKV(Constants.AUTH.UID, 'wd_test_usr');
		Cache.setCacheKV(Constants.AUTH.FULL_NAME, 'Test Suite');

		var names = 'Test Suite'.split(' ');
		User.initializeUser('wd_test_usr', names[0], names[1], (error) => {
			cb(!error);
		});
	}

	public static isAuth(cb: Function): void {
		if (Auth.getHashValue('wdtestuser')) {
			Auth.loginTestUser(cb);
		} else {
			var uid = Cache.getCacheV(Constants.AUTH.UID);
			if (uid) {
				if (!Auth.FIRE.getAuth()) {
					cb(false);
				} else {
					this.userExists(uid, cb);
				}
			} else {
				cb(false);
			}
			cb(true);
		}
	}

	public static deAuth(): void {
		Cache.clear();
		Auth.FIRE.unauth();
	}

	private static userExists(uid : string, cb: Function) {
		var url = Constants.firebaseUrl + Constants.FIRE_USER + uid + '/';

		// Create firebase record if one does not exist (e.g. new user)
		var ref = new Firebase(url);
		ref.once("value", function(snapshot) {
			cb((snapshot.val() !== null));
		});
	}

	public static authFacebook(cb: Function): void {
		Auth.FIRE.authWithOAuthPopup("facebook", (error, authData) => {
			if (error) {
				cb(false, error);
			} else {
				Cache.setCacheKV(Constants.AUTH.TOKEN, (<any>authData).facebook.accessToken);
				Cache.setCacheKV(Constants.AUTH.UID, (<any>authData).uid);
				Cache.setCacheKV(Constants.AUTH.FULL_NAME, (<any>authData).facebook.displayName);

				// Create firebase record if one does not exist (e.g. new user)
				this.userExists((<any>authData).uid, (exists) => {
					if (!exists) {
						var names = (<any>authData).facebook.displayName.split(' ');
						User.initializeUser((<any>authData).uid, names[0], names[1], (error) => {
							cb(!error);
						});
					} else {
						cb(true);
					}
				});
			}
		});
	}
}

export = Auth;