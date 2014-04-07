Hubzilla = Object.create({
  MESSAGE_KEY: 'hubzilla_msg',

  log: function log() {
    var args = Array.prototype.slice.apply(arguments);
    args.splice(0, 0, 'hubzilla:');
    console.log.apply(console, args);
  }
});