const request = require('request');
const cookie = require('cookie');

class LIAPI {
	constructor(username, password) {
		this.username = username;
		this.password = password;
		this.cookieJar = request.jar();
	}

	auth(callback) {
		const requestOptions = {
			url: `https://linkedin.com/uas/authenticate`,
			form: {
				session_key: this.username,
				session_password: this.password,
			},
			jar: this.cookieJar,
			followAllRedirects: true,
		}
		request.post(requestOptions, (err, res, body) => {
			if (!err && res.statusCode === 200) {
				callback(true);
			}
		});
	}

	test() {
		const testJson = `{"requests":{"0":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/profileView","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"1":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/profileActions","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"2":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/profileContactInfo","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"3":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/recommendations?q=received&recommendationStatuses=List(VISIBLE,HIDDEN)","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"4":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/browsemapWithDistance","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"5":{"relativeUrl":"/me/settings","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"6":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/networkinfo","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"7":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/memberBadges","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"8":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/highlights","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"9":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/featuredSkills?includeHiddenEndorsers=true&count=12","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"10":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/recommendations?q=given","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"11":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/following?q=followedEntities&entityType=GROUP&count=20","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"12":{"relativeUrl":"/voyagerFeedUpdates?profileId=ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI&q=memberFeed&moduleKey=member-activity%3Aphone&count=10","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"13":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/posts?count=10","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"14":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/following?count=20","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"15":{"relativeUrl":"/voyagerGrowthIWERestriction","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"16":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/memberConnections?q=connections&count=20","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"17":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/wwuAd","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"18":{"relativeUrl":"/voyagerSuggestedEndorsements?q=singleRecipient&vieweeMemberIdentity=ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI&count=1","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}},"19":{"relativeUrl":"/identity/profiles/ACoAAArYVFAB00kFE4uuqRIWWzUGTy5YE27_LSI/profilePromotions","method":"GET","headers":{"X-RestLi-Protocol-Version":"2.0.0"},"dependentRequests":{}}}}`
		const testURL = `https://www.linkedin.com/voyager/api/mux`;

		const cookies = cookie.parse(this.cookieJar.getCookieString(testURL));

		const requestOptions = {
			url: testURL,
			jar: this.cookieJar,
			body: testJson,
			headers: {
				'Csrf-Token': cookies.JSESSIONID
			}
		}

		request.post(requestOptions, (err, res, body) => {
			if (!err) {
				console.log(JSON.parse(body).responses[0]);
			}
		});
	}

	search(name, callback) {
		const requestURL = `https://www.linkedin.com/voyager/api/typeahead/hits?q=blended&query=jason`;
		const cookies = cookie.parse(this.cookieJar.getCookieString(requestURL));

		const requestOptions = {
			url: requestURL,
			jar: this.cookieJar,
			headers: {
				'X-RestLi-Protocol-Version': '2.0.0',
				'Csrf-Token': cookies.JSESSIONID,
				'User-Agent': 'LinkedIn/9.7.3504 CFNetwork/811.4.18 Darwin/16.5.0',
				'X-Requested-With':	'XMLHttpRequest'
			}
		}

		request.get(requestOptions, (err, res, body) => {
			if (!err) {
				console.log(body);
			}
		})

	}



}

module.exports = LIAPI;