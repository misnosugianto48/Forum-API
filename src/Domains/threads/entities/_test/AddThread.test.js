const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'some title thread',
      body: 'some content thread',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'some title thread',
      body: 123,
      userId: 'user-user123',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'some title threadsome title threadsome title threadsome title threadsome title threadsome title threadsome title thread',
      body: 'some body thread',
      userId: 'user-user123',
    };

    // Action adn Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create thread object correctly', () => {
    // Arrange
    const payload = {
      title: 'some title thread',
      body: 'some body thread',
      userId: 'user-user123',
    };

    // Action
    const {
      title,
      body,
      userId,
    } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(userId).toEqual(payload.userId);
  });
});
