import oauth from 'oauth';
import qp from 'query-params';
import { getLogger } from 'log4js';

const logger = getLogger('Twitter API');

const {
  TWITTER_URL,
  TWITTER_VERSION,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_TOKEN,
  TWITTER_TOKEN_SECRET
} = process.env;

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

export const getTweets = userId =>
  get('/statuses/user_timeline', { user_id: userId });

export const tweet = status => post('/statuses/update', { status, place_id });

export const tweetWithMedia = (status, mediaId) =>
  post('/statuses/update', { status, place_id, media_ids: mediaId });

export const deleteTweet = id => post(`/statuses/destroy/${id}`);

export const uploadMedia = dataBuffer =>
  upload(`/media/upload`, { media_data: dataBuffer.toString('base64') });

const get = (url, params) =>
  request(
    'get',
    `${TWITTER_URL}${TWITTER_VERSION}${url}.json?${qp.encode(params)}`
  );

const post = (url, body) =>
  request('post', `${TWITTER_URL}${TWITTER_VERSION}${url}.json`, body);

const upload = (url, body) =>
  request('post', `${TWITTER_URL}${TWITTER_VERSION}${url}.json`, body, true);

const request = (type, url, body, isUpload) => {
  logger.debug(type.toUpperCase(), url, isUpload ? '' : body);
  return new Promise((resolve, reject) => {
    const callback = (err, res) => {
      if (err) {
        logger.error(
          err.statusCode ? err.statusCode : err,
          err.data ? err.data : ''
        );
        return reject(err);
      } else {
        logger.debug(`${type.toUpperCase()} OK - ${res.slice(0, 60)} ...`);
        return resolve(JSON.parse(res));
      }
    };
    const args = [url, TWITTER_TOKEN, TWITTER_TOKEN_SECRET];
    if (type === 'post') {
      args.push(body, 'application/x-www-form-urlencoded');
    }
    if (isUpload) {
      args[0] = url.replace('api', 'upload');
    }
    args.push(callback);
    client[type](...args);
  });
};
