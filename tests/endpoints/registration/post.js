/*##############################################################################

# test POST /registration '{email}'

##############################################################################*/

const { exec } = require('node:child_process');
const { error } = require('node:console');

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const pathCURL = '/usr/local/opt/curl/bin/curl';
const url = 'http://localhost:3000/registration';
const nReqs = 10;

// run local curl `nReq` times
for (let i = 0; i < nReqs; i++) {
  const email = JSON.stringify({
    email: `${generateRandomString(10)}@example.com`,
  });

  const command = `${pathCURL} -v --json '${email}' ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('exec error: %o', error);
      return;
    }

    console.log('stdout: %o', stdout);
    console.error('stderr %o', stderr);
  })
}

