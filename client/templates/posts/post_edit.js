Template.postEdit.events ({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        if (this.userId !== Meteor.userId()) {
            Errors.throw("You don't have permission to edit this post!");
            return;
        }

        var errors = validatePost(postProperties);
        if (errors.title || errors.url) {
            return Session.set('postEditErrors', errors);
        }

        Meteor.call("postUpdate", currentPostId, postProperties, function(error, result) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go("postPage", { _id: currentPostId });
            }
        });

        // Posts.update(currentPostId, {$set: postProperties}, function(error) {
        //     if (error) {
        //         alert(error.reason);
        //     } else {
        //         Router.go('postPage', { _id: currentPostId });
        //     }
        // });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (this.userId !== Meteor.userId()) {
            alert("You don't have permission to delete this post!");
            return;
        }

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Meteor.call("postDelete", currentPostId, function(error, result) {
                if (error) {
                    alert(error.reason);
                } else {
                    Router.go('postsList');
                }
            });
        }
    }
});

Template.postEdit.created = function () {
    Session.set('postEditErrors', {});
};

Template.postEdit.helpers({
    errorMessage: function(field) {
        return Session.get('postEditErrors')[field];
    },
    errorClass: function(field) {
        return Session.get('postEditErrors')[field] ? 'has-error' : '';
    }
});
