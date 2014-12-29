Template.postItem.helpers({
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  submitTime: function() {
    var date = this.submitted;
    if (date) {
      return date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " " + date.getFullYear() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate();
    }
  },
  ownPost: function() {
    return this.userId === Meteor.userId();
  },
  commentsCount: function() {
      return Comments.find({postId: this._id}).count();
  }

});
