const GetThread = require('../GetThread');

describe('GetThread entity', () => {
  it('should throw an error when did not contain needed property', () => {
    // arr
    const payload = {
      title: 'some title thread',
      body: 'some body thread',
      date: '2023-11-28',
      username: 'misno48',
    };
    // act and assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw ann error when did not meet data type specification', () => {
    // arr
    const paylaod = {
      id: 1234,
      title: 'some title thread',
      body: 'some body thread',
      date: '2023-11-28',
      username: 'misno48',
    };

    // act and assert
    expect(() => new GetThread(paylaod)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return GetThread object correctly', () => {
    // arr
    const paylaod = {
      id: 'thread-thread123',
      title: 'some title thread',
      body: 'some body thread',
      date: '2023-11-28',
      username: 'misno48',
    };

    // act and assert
    const getThread = new GetThread(paylaod);

    expect(getThread.id).toEqual(paylaod.id);
    expect(getThread.title).toEqual(paylaod.title);
    expect(getThread.body).toEqual(paylaod.body);
    expect(getThread.date).toEqual(new Date(paylaod.date).toISOString());
    expect(getThread.username).toEqual(paylaod.username);
  });
});
