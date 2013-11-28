
var bugId;
var bugUrl;

var BUGID_REGEX = /bug\s(\d+)/gi;
var BUGZILLA_BASE_URL = 'https://bugzilla.mozilla.org/show_bug.cgi?id=';

function parseBugId() {
  var titleEl = document.querySelector('.discussion-topic-header .discussion-topic-title');

  if (titleEl) {
    var matches = BUGID_REGEX.exec(titleEl.innerText);
    bugId = matches[1];
    if (bugId) {
      bugUrl = BUGZILLA_BASE_URL + bugId;
    }
  }
}

parseBugId();

if (bugUrl) {
  // link to bugzilla ticket in topic title
  var elements = document.querySelectorAll('.discussion-topic-title');
  for (var i = elements.length - 1; i >= 0; i--) {
    var el = elements[i];
    el.innerHTML = el.innerHTML.replace(BUGID_REGEX, '<a href="' + bugUrl + '">$&</a>');
  }
}
