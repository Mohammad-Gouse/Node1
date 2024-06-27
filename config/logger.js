const { transports, createLogger, format } = require('winston');

const { combine, timestamp, label, printf, align } = format;
const { SPLAT } = require('triple-beam');
const { isObject, trimEnd } = require('lodash');

const env = process.env.DEV_ENV || 'development';
// DEV/QA/PREPROD/UAT/PROD
const s3EnvTags = {
  development: 'DEV',
  production: 'PROD',
  staging: 'PREPROD',
  preprod: 'PREPROD',
  test: 'PREPROD',
};

function formatObject(param) {
  if (isObject(param)) {
    return JSON.stringify(param);
  }
  return param;
}

const formatter = format((info) => {
  const splat = info[SPLAT] || [];
  const isSplatTypeMessage = (typeof info.message === 'string' &&
    (info.message.includes('%s') || info.message.includes('%d') || info.message.includes('%j')));
  if (isSplatTypeMessage) {
    return info;
  }
  const message = formatObject(info.message);
  const rest = splat.map(formatObject).join(' ');
  info.message = trimEnd(`${message} ${rest}`);
  return info;
});

const getTransportConsoleOptions = () => {
  return {
    debugStdout: env === 'development',
  };
};

const currentTransports = [
  new transports.Console(getTransportConsoleOptions()),
];

// if (env !== 'development' && env !== 'test') {
//   const s3LoggerStream = new S3StreamLogger({
//     bucket: process.env.S3_LOG_BUCKET,
//     access_key_id: process.env.ACCESS_KEY_ID,
//     storage_class: 'INTELLIGENT_TIERING',
//     folder: `${process.env.SERVICE_NAME}/app_logs/${env}`,
//     name_format: `%Y-%m-%d/${os.hostname()}/%Y-%m-%d-%H-%M-%S-%L-${process.env.SERVICE_NAME}-${s3EnvTags[env]}.log`,
//     tags: { type: 'log', project: 'numbers', ENV: s3EnvTags[env] || 'PREPROD' },
//     secret_access_key: process.env.SECRET_ACCESS_KEY,
//     max_file_size: process.env.S3_LOG_MAX_FILE_SIZE || '10Mb',
//     rotate_every: process.env.S3_LOG_ROTATE_TIME || 24 * 60 * 60 * 1000,
//     upload_every: 15 * 1000,
//   });

//   currentTransports.push(new transports.Stream({
//     stream: s3LoggerStream,
//   }));

//   // error handling for s3 stream logging
//   s3LoggerStream.on('error', err => {
//     console.error(`Error in s3 stream logging. Error: ${err.message || err}`);
//   });

  // // ELK logging
  // const elasticClient = new Client({
  //   node: process.env.ELK_ELASTIC_SERVER,
  //   auth: {
  //     username: process.env.ELK_ELASTIC_USER,
  //     password: process.env.ELK_ELASTIC_PASSWORD,
  //   },
  // });
  // const esTransportOpts = {
  //   level: process.env.ELK_LOGGER_LEVEL || 'info',
  //   index: `${process.env.ELK_ELASTIC_INDEX}-${s3EnvTags[env].toLowerCase()}`,
  //   client: elasticClient,
  // };
  // const elkLogger = new ElasticsearchTransport(esTransportOpts);
  // currentTransports.push(elkLogger);
  // // error handling for ELK logging
  // elkLogger.on('error', err => {
  //   console.error(`Error in ELK logging. Error: ${err.message || err}`);
  // });
// }
var debug = 'info';
if(process.env.DEV_ENV == "development"){
  debug = 'debug';
}
const logger = createLogger({
  level: debug,
  transports: currentTransports,
  format: combine(
    label({ label: process.env.SERVICE_NAME || 'estate_planning' }),
    formatter(),
    timestamp(),
    align(),
    printf(logData => `${logData.timestamp} [${logData.label}] ${logData.level}: ${logData.message}`),
  ),
  exitOnError: false,
});

module.exports = logger;

module.exports.stream = {
  write: (message) => {
    logger.info(message);
  },
};