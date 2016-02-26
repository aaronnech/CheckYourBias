/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('./Constants');

class InternetConnectivity {
    public static FB_CONNECTION = new Firebase(Constants.FIREBASE_CONNECTION);
    public static ON_CONNECTS: Function[] = [];
    public static ON_DISCONNECTS: Function[] = [];
    public static CONNECTION_STATE: boolean = false;

    public static subscribe(onConnect: Function, onDisconnect: Function): void {
		InternetConnectivity.ON_CONNECTS.push(onConnect);
		InternetConnectivity.ON_DISCONNECTS.push(onDisconnect);
    }

    public static getCurrentConnection(): boolean {
		return InternetConnectivity.CONNECTION_STATE;
    }

    public static startConnectivity(): void {
		InternetConnectivity.FB_CONNECTION.on("value", function(snap) {
			if (snap.val() === true) {
				InternetConnectivity.CONNECTION_STATE = true;
				for (var i = 0; i < InternetConnectivity.ON_CONNECTS.length; i++) {
					InternetConnectivity.ON_CONNECTS[i]();
				}
			} else {
				InternetConnectivity.CONNECTION_STATE = false;
				for (var i = 0; i < InternetConnectivity.ON_DISCONNECTS.length; i++) {
					InternetConnectivity.ON_DISCONNECTS[i]();
				}
			}
		});
    }
}

export = InternetConnectivity;
