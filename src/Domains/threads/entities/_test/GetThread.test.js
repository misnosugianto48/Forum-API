const GetThread = require('../GetThread');

describe('a GetThread entities', () => {
  it('should throw error when did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'some title thread',
      body: 'some body thread',
      date: '2023-11-21',
      username: 'misno48',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when did not meet data type sepecification', () => {
    // Arrange
    const payload = {
      id: 12345,
      title: 'some title thread',
      body: 'some body thread',
      date: '2023-11-21',
      username: 'misno48',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should getThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-thread123',
      title: 'some title thread',
      body: 'some body thread',
      date: '2023-11-21',
      username: 'misno48',
    };

    // Action
    const getThread = new GetThread(payload);

    // assert
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(new Date(payload.date).toISOString());
    expect(getThread.username).toEqual(payload.username);
  });
});
