var MESSAGE_KEY = 'hubzilla_msg';
var MESSAGE_REGEX = new RegExp(MESSAGE_KEY + '=(\.+)', 'ig');

function onBugzillaPage() {
  return window.location.href.indexOf("bugzilla") > -1;
}
function onGithubPage() {
  return window.location.href.indexOf("github") > -1;
}

if (onBugzillaPage()) {
  bugzillaHandler();
} else if (onGithubPage()) {
  githubHandler();
}

/**
 * executes on bugzilla pages
 */
function bugzillaHandler() {
  var commentEl = document.getElementById('comment');
  console.log("hubzilla: welcome to bugzilla!");
  debugger;
  var search = decodeURIComponent(document.location.search);
  var matches = MESSAGE_REGEX.exec(search);
  var message = matches && matches[1];
  if (commentEl && message && message.indexOf('landed') > -1) {
    comment.innerText = message;
    commentEl.scrollIntoView();
    // TODO
    // change bug status to RESOLVED FIXED
  }
}


/**
 * executes on github pages
 */
function githubHandler() {
  console.log("hubzilla: welcome to github!");

  var bugId;
  var bugUrl;

  var BUGID_REGEX = /bug\s(\d+)/gi;
  var BUGZILLA_BASE_URL = 'https://bugzilla.mozilla.org/show_bug.cgi?id=';

  var SELECTOR_HASH_EL = '.action-bubble-merged code';
  var SELECTOR_ACTION_EL = '.merge-branch-action';

  // parse bug id
  var titleEl = document.querySelector('.discussion-topic-header .discussion-topic-title');

  if (titleEl) {
    var matches = BUGID_REGEX.exec(titleEl.innerText);
    bugId = matches[1];
    if (bugId) {
      bugUrl = BUGZILLA_BASE_URL + bugId;
    }
  }

  if (bugUrl) {
    // link to bugzilla ticket in topic title
    // TODO traverse all text nodes:
    // http://stackoverflow.com/questions/2579666/getelementsbytagname-equivalent-for-textnodes
    var elements = document.querySelectorAll('.discussion-topic-title, .commit-title');
    for (var i = elements.length - 1; i >= 0; i--) {
      var el = elements[i];
      el.innerHTML = el.innerHTML.replace(BUGID_REGEX, '<a href="' + bugUrl + '">$&</a>');
    }

    var actionEl = document.querySelector(SELECTOR_ACTION_EL);
    var hashEl = document.querySelector(SELECTOR_HASH_EL);

    var isMergePage = actionEl.querySelector('.octicon-git-merge');
    var isDeletePage = actionEl.querySelector('.octicon-git-branch-delete');


    // navigate to bugzilla to add a 'landed' comment
    if (isMergePage) {
      console.log('hubzilla: merge PR page');
      actionEl.addEventListener('click', function waitForCommit(e) {
        actionEl.removeEventListener('click', waitForCommit);
        waitForHashElement();
      });
    } else if (isDeletePage && hashEl) {
      console.log('hubzilla: delete branch page');
      highlightHashEl();
      hashEl.addEventListener('click', function() {
        var hash = hashEl.innerText;
        addLandedComment(hash);
      });
    }

    function waitForHashElement() {
      hashEl = document.querySelector(SELECTOR_HASH_EL);
      if (hashEl) {
        console.log('hash found: ');
        var hash = hashEl.innerText;
        highlightHashEl();
        hashEl.addEventListener('click', function() {
          addLandedComment(hash);
        });
      } else {
        console.log('waiting for commit...');
        setTimeout(waitForHashElement, 1000);
      }
    }

    function highlightHashEl() {
      hashEl.style.cursor = 'pointer';
      hashEl.style.background = 'yellow';
    }

    function addLandedComment(hash) {
      // TODO get the project commits url from current page
      var url = 'https://github.com/mozilla-b2g/gaia/commit/' + hash;
      var query = MESSAGE_KEY + '=landed: ' + url;
      navigateToBugzilla(query);
    }

    function navigateToBugzilla(queryString) {
      var url = bugUrl;
      if (queryString) {
        // url already contains '?'
        url += '&' + encodeURIComponent(queryString);
      }
      window.location.href = url;
    }
  }
  else {
    console.info('hubzilla: no bug id found in commit message');
  }
}