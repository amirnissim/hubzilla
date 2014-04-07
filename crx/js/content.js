if (location.href.indexOf("bugzilla") > -1) {
  Hubzilla.bugzillaHandler.init();
} else if (location.href.indexOf("github") > -1) {
  Hubzilla.githubHandler.init();
}