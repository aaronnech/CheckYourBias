/// <reference path="../common/def/firebase.d.ts"/>
/*
    A class that represents a candidate and all the information that corresponds to it.

    invariant: issueRatings comprises all issues that the candidate has an
    associated rating on.

    Each issueId (key in issueRatings) corresponds to an Issue with this candidate and
    the same rating.
*/
var Candidate = (function () {
    function Candidate() {
    }
    /*
        Fetches the Candidate with the given candidateId.
    */
    Candidate.getCandidate = function (candidateId, callback) {
        // TODO: Implement
    };
    return Candidate;
})();
module.exports = Candidate;
