Posts = new Mongo.Collection('posts');

ownsDocument = function (userId, doc) {
    return doc && doc.userId === userId;
};

validatePost = function (post) {
    var errors = {};
    if (!post.title)
        errors.title = "Please fill in a headline";
    if (!post.url)
        errors.url = "Please fill in a URL";
    return errors;
};

Posts.allow({
    update: function(userId, post) {
        return ownsDocument(userId, post);
    },
    remove: function(userId, post) {
        return ownsDocument(userId, post);
    }
});
Posts.deny({
    update: function(userId, post, fieldNames, modifier) {
        var errors = validatePost(modifier.$set);
        return errors.title || errors.url;
    }
});
Meteor.methods({
    postInsert: function(postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            title: String,
            url: String
        });

        var errors = validatePost(postAttributes);
        if (errors.title || errors.url)
            throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

        var postWithSameLink = Posts.findOne({url: postAttributes.url});
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            };
        }
        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });
        var postId = Posts.insert(post);
        return {
            _id: postId
        };
    },
    postUpdate: function(currentPostId, postProperties) {
        check(currentPostId, String);
        check(Meteor.userId(), String);
        check(postProperties, {
            title: String,
            url: String
        });

        var errors = validatePost(postProperties);
        if (errors.title || errors.url)
            throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

        var postToSet = _.extend(postProperties, {
            submitted: new Date()
        });
        Posts.update(currentPostId, {$set: postToSet}, function(error) {
            if (error) {
                // alert(error.reason);
                throw error;
            } else {
                return "success";
            }
        });

    },
    postDelete: function(currentPostId) {
        check(currentPostId, String);
        check(Meteor.userId(), String);
        Posts.remove(currentPostId, function(error) {
            if (error) {
                throw error;
            } else {
                return "success";
            }
        });
    },
    upvote: function(postId) {
        check(this.userId, String);
        check(postId, String);

        var affected = Posts.update({
            _id: postId,
            upvoters: {$ne: this.userId}
        }, {
            $addToSet: { upvoters: this.userId },
            $inc: {votes: 1}
        });
        if (!affected)
            throw new Meteor.Error('invalid', "You weren't able to upvote that post");
        // var post = Posts.findOne(postId);
        // if (!post)
        //     throw new Meteor.Error('invalid', 'Post not found');
        // if (_.include(post.upvoters, this.userId))
        //     throw new Meteor.Error('invalid', 'Already upvoted this post');
        // Posts.update(post._id, {
        //     $addToSet: {upvoters: this.userId},
        //     $inc: {votes: 1}
        // });
    }
});
