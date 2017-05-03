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
  const owner = dockerJSON.repository.owner
  const tag = dockerJSON.push_data.tag
  const pushed_at = dockerJSON.push_data.pushed_at.toString();
  configJson.Job.TaskGroups[0].Tasks[0].Config.image = `${owner}` + "/" + `${jobName}` + ":" + `${tag}`;
  configJson.Job.TaskGroups[0].Tasks[0].Env.DOCKER_BUILT_AT = dockerJSON.push_data.pushed_at.toString();
  configJson.Job.Meta.buildnumber = tag
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
