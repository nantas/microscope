Meteor.publish('cursor_posts', function () {
    return Posts.find();
});

Meteor.publish('cursor_comments', function() {
    return Comments.find();
});
