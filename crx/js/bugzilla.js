/**
 * runs on bugzilla pages
 */
Hubzilla.bugzillaHandler = Object.create(null);
Hubzilla.bugzillaHandler.init = function() {
  Hubzilla.log('welcome to bugzilla!');

  var msgexp = new RegExp(Hubzilla.MESSAGE_KEY + '=(\.+)', 'ig');
  var commentEl = document.getElementById('comment');

  var search = decodeURIComponent(document.location.search);
  var matches = msgexp.exec(search);
  var message = matches && matches[1];
  if (commentEl && message && message.indexOf('landed') > -1) {
    Hubzilla.log('found comment message:', '`'+message+'`');
    comment.innerText = message;
    commentEl.scrollIntoView();
    // TODO
    // change bug status to RESOLVED FIXED
  }
};