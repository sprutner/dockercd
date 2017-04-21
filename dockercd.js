const request = require('request-promise-native');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const S3_BUCKET =  process.env.S3_BUCKET;
const URL_BASE = process.env.URL_BASE;

function getConfigFromS3({ key }, callback) {
  s3.getObject({
      Bucket: S3_BUCKET,
      Key: key,
      ResponseContentType : 'application/json',
    }, (err, response) => {
      if (err) {
        callback(err);
      } else {
        const configJson = JSON.parse(response.Body.toString());
        callback(null, configJson);
      }
    })
}

function registerJob({ configJson, jobName }, { dockerJSON }, callback) {
  console.log(configJson);
  configJson.Job.Meta.baz = dockerJSON.push_data.pushed_at;
  console.log(configJson);
  request({
    uri: `${URL_BASE}${jobName}`,
    method: 'POST',
    json: true,
    body: configJson,
  })
  .then((response) => {
      callback(null, response);
  })
  .catch((err) => {
      callback(err);
  });
}

exports.handler = (event, context, callback) => {
  const dockerJSON = event;
  const jobName = dockerJSON.repository.name
  const key = `${jobName}.json`;
  getConfigFromS3({ key }, (err, configJson) => {
    if (err) return callback(err);
    registerJob({ jobName, configJson }, { dockerJSON }, (err, response) => {
      if (err) return callback(err);
      callback(null, response);
    });
  }); 
};