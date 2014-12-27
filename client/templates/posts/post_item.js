Template.postItem.helpers({
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    submitTime: function() {
        var date = this.submitted;
        return date.getHours() + ":" + date.getMinutes() + " " + date.getFullYear() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate();
    }
});
