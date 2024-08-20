const Pusher = require('pusher');

export const pusher = new Pusher({
  appId: '1852344',
  key: 'eeac291f5408aa1cf514',
  secret: '6832b230f40ad06b09e8',
  cluster: 'ap1',
  useTLS: true,
});
