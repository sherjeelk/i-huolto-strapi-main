module.exports = ({ env }) => ({
  email: {
      provider: 'mailgun',
      providerOptions: {
        apiKey: 'd6ec3c6e366dee4732646dce97d3a7c6-38029a9d-746a726c',
        domain: 'mg.i-huolto.fi', //Required if you have an account with multiple domains
        host: 'api.eu.mailgun.net', //Optional. If domain region is Europe use 'api.eu.mailgun.net'
      },
      settings: {
        defaultFrom: 'no-reply@i-huolto.fi',
        defaultReplyTo: 'support@i-huolto.fi',
      },
  },
});