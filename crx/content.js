// Pull request pages

// link to bugzilla ticket
var regex = /bug\s(\d+)/gi;

function bugzillaLinker(match, p1) {
  return '<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=' + p1 + '">' + match + '</a>';
}

var elements = document.querySelectorAll('.discussion-topic-title');
for (var i = elements.length - 1; i >= 0; i--) {
  var el = elements[i];
  el.innerHTML = el.innerHTML.replace(regex, bugzillaLinker);
}
