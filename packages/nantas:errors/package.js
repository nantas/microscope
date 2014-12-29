Package.describe({
  name: 'nantas:errors',
  summary: 'A pattern to display application errors to the user',
  version: '1.0.0',
});

Package.onUse(function (api, where) {
  api.versionsFrom('1.0');
  api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
  api.addFiles(['errors.js', 'errors_list.html', 'errors_list.js'], 'client');
  if (api.export)
      api.export('Errors');
});

Package.onTest(function(api) {
    api.use('nantas:errors', 'client');
    api.use(['tinytest', 'test-helpers'], 'client');
    api.addFiles('errors_test.js', 'client');
});
