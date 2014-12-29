Meteor.publish('cursor_posts', function () {
    return Posts.find();
});

Meteor.publish('cursor_comments', function(postId) {
    check(postId, String);
    return Comments.find({postId: postId});
});

Meteor.publish('cursor_notifications', function() {
    return Notifications.find({userId: this.userId, read: false});
});
