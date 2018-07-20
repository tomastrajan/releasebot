import { OAuth } from 'oauth';
import { encode } from 'query-params';
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

const client = new OAuth(
  `${TWITTER_URL}/oauth/request_token`,
  `${TWITTER_URL}/oauth/access_token`,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);

export const getPlaceId = async query => {
  const places: any = await get('/geo/search', { query });
  return places.result.places[0].id;
};

export const getUser = (userId: string): Promise<TwitterUser> =>
  get('/users/show', { user_id: userId }) as Promise<TwitterUser>;

export const getTweets = userId =>
  get('/statuses/user_timeline', { user_id: userId });

export const tweet = status => post('/statuses/update', { status, place_id });

export const tweetWithMedia = (status, mediaId) =>
  post('/statuses/update', { status, place_id, media_ids: mediaId });

export const deleteTweet = id => post(`/statuses/destroy/${id}`);

export const getMessages = async () =>
  (await get('/direct_messages/events/list') as any).events.map(messageTransformer);

export const sendMessage = (recipientId, message) =>
  post('/direct_messages/events/new', buildMessage(recipientId, message), true);

export const uploadMedia = dataBuffer =>
  upload(`/media/upload`, { media_data: dataBuffer.toString('base64') });

const get = (url, params?) =>
  request(
    'get',
    `${TWITTER_URL}${TWITTER_VERSION}${url}.json?${params ? encode(params) : ''}`
  );

const post = (url, body?, isJson?) =>
  request('post', `${TWITTER_URL}${TWITTER_VERSION}${url}.json`, body, false, isJson);

const upload = (url, body) =>
  request('post', `${TWITTER_URL}${TWITTER_VERSION}${url}.json`, body, true);

const request = (type, url, body?, isUpload?, isJson?) => {
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
      args.push(body, `application/${isJson ? 'json' : 'x-www-form-urlencoded'}`);
    }
    if (isUpload) {
      args[0] = url.replace('api', 'upload');
    }
    args.push(callback);
    client[type](...args);
  });
};

function buildMessage(recipientId, message) {
  return JSON.stringify({
    event: {
      type: 'message_create',
      message_create: {
        target: {
          recipient_id: recipientId
        },
        message_data: {
          text: message
        }
      }
    }
  });
}

const messageTransformer = (data: any) => ({
  id: data.id,
  type: data.type,
  created: data.created_timestamp,
  recipientId: data[data.type].target.recipient_id,
  senderId: data[data.type].sender_id,
  text: data[data.type].message_data.text,
  entities: data[data.type].message_data.entities,
  attachment: data[data.type].message_data.attachment
});

export interface TwitterUser {
  id: number;
  name: string;
  screen_name: string;
}
