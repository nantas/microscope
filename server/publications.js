Meteor.publish('cursor_posts', function () {
    return Posts.find();
});
