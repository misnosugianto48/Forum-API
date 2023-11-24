const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error whhen payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'some title thread',
      owner: 'user-user123',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-thread123',
      title: 123,
      owner: 'user-user123',
    };

    // action and assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-thread123',
      title: 'some title thread',
      owner: 'user-user123',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
