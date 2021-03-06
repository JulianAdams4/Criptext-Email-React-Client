/* eslint-env node, jest */
const DBManager = require('../database');

jest.mock('../windows/mailbox', () => ({
  getShowPreview: () => {
    return Promise.resolve(true);
  },
  setShowPreview: () => {
    return Promise.resolve();
  }
}));

let accountId;

const account = {
  recipientId: 'user',
  deviceId: 1,
  name: 'User One',
  registrationId: 2,
  privKey: 'aaa',
  pubKey: 'bbb'
};

const email = {
  email: {
    threadId: 'threadC',
    key: '3',
    subject: 'Greetings',
    content: '<p>Hello there</p>',
    preview: 'Hello there',
    date: '2018-06-14 08:23:19.120',
    status: 0,
    unread: true,
    secure: true,
    unsentDate: '2018-06-14 08:23:20.000',
    messageId: 'messageIdC',
    fromAddress: 'User A <usera@criptext.com>'
  },
  recipients: {
    from: ['User A <usera@criptext.com>'],
    to: ['user@criptext.com', 'userb@criptext.com']
  },
  labels: [1],
  files: [
    {
      token: 'tokenC',
      name: 'Criptext_Image_2018_06_14.png',
      size: 183241,
      status: 1,
      date: '2018-06-14T23:45:57.000Z',
      mimeType: 'image/png',
      key: 'fileKeyA',
      iv: 'fileIvA'
    }
  ]
};

const insertAccount = async () => {
  return await DBManager.createAccount(account);
};

const insertEmail = async accountId => {
  await DBManager.createEmail({ ...email, accountId });
};

beforeAll(async () => {
  await DBManager.deleteDatabase();
  await DBManager.initDatabaseEncrypted({
    key: '1111',
    shouldAddSystemLabels: true
  });
  const [account] = await insertAccount();
  accountId = account.id;
  await insertEmail(accountId);
});

describe('Store data file to File Table:', () => {
  it('Should insert file', async () => {
    const files = [
      {
        token: 'tokenC1',
        name: 'Criptext_Image_2018_06_14.png',
        size: 183241,
        status: 1,
        date: '2018-06-14T23:45:57.466Z',
        mimeType: 'image/png',
        key: 'fileKeyA',
        iv: 'fileIvA',
        emailId: 1
      }
    ];
    const file = await DBManager.createFile(files);
    expect(file).toMatchSnapshot();
  });
});

describe('Load data file from File Table:', () => {
  it('Should load file by emailId', async () => {
    const files = await DBManager.getFilesByEmailId(1);
    expect(files.length).toBe(2);
    expect(files[0]).toMatchSnapshot();
  });

  it('should load file by tokens', async () => {
    const token = 'tokenC';
    const file = await DBManager.getFilesByTokens([token]);
    expect(file).toMatchSnapshot();
  });
});

describe('Update data file to File Table:', () => {
  it('Should update file: status', async () => {
    const files = await DBManager.getFilesByEmailId(1);
    expect(files.length).toBe(2);
    expect(files[0].status).toBe(1);
    expect(files[1].status).toBe(1);
    const result = await DBManager.updateFilesByEmailId({
      emailId: 1,
      status: 0
    });
    expect(result).toEqual([2]);
    const filesUpdated = await DBManager.getFilesByEmailId(1);
    expect(filesUpdated.length).toBe(2);
    expect(filesUpdated[0].status).toBe(0);
    expect(filesUpdated[1].status).toBe(0);
  });
});
