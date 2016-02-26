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
				for (var onConnect in InternetConnectivity.ON_CONNECTS) {
					onConnect();
				}
			} else {
				InternetConnectivity.CONNECTION_STATE = false;
				for (var onDisconnect in InternetConnectivity.ON_DISCONNECTS) {
					onDisconnect();
				}
			}
		});
    }
}

export = InternetConnectivity;
