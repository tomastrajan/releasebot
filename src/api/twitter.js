import oauth from 'oauth';
import qp from 'query-params';

const {
  TWITTER_URL,
  TWITTER_VERSION,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_TOKEN,
  TWITTER_TOKEN_SECRET
} = process.env;

const user_id = '975234629299986432';
const place_id = '5a110d312052166f';

const client = new oauth.OAuth(
  `${TWITTER_URL}/oauth/request_token`,
  `${TWITTER_URL}/oauth/access_token`,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);

export const getPlaceId = async query => {
  const places = await get('/geo/search', { query });
  return places.result.places[0].id;
};

export const tweet = status => post('/statuses/update', { status, place_id });

export const deleteAllTweets = async () => {
  const tweets = await getTimeline();
  const destroyPromises = [];
  tweets.forEach(tweet =>
    destroyPromises.push(post(`/statuses/destroy/${tweet.id_str}`))
  );
  return Promise.all(destroyPromises);
};

export const getTimeline = () => get('/statuses/user_timeline', { user_id });

const get = (url, params) =>
  request(
    'get',
    `${TWITTER_URL}${TWITTER_VERSION}${url}.json?${qp.encode(params)}`
  );

const post = (url, body) =>
  request('post', `${TWITTER_URL}${TWITTER_VERSION}${url}.json`, body);

const request = (type, url, body) => {
  console.log('Twitter API -', type.toUpperCase(), url, body || '');
  return new Promise((resolve, reject) => {
    const callback = (err, res) => {
      console.log(
        'Twitter API -',
        err ? `ERROR ${err.statusCode} - ${err.data}` : `OK ${res.slice(0, 80)}...`
      );
      err ? reject(err) : resolve(JSON.parse(res));
    };
    const args = [url, TWITTER_TOKEN, TWITTER_TOKEN_SECRET];
    if (type === 'post') {
      args.push(body, 'application/x-www-form-urlencoded');
    }
    args.push(callback);
    client[type](...args);
  });
};
