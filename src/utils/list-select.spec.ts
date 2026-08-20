import {
  MEETING_STAFF_SELECT,
  POST_LIST_SELECT,
  STAFF_LIST_SELECT,
} from './list-select';

describe('list selects', () => {
  it('omits post content', () => {
    expect(POST_LIST_SELECT.join(',')).not.toMatch(/content/i);
  });

  it('omits staff hash and refreshToken', () => {
    const cols = STAFF_LIST_SELECT.join(',');
    expect(cols).not.toMatch(/hash/i);
    expect(cols).not.toMatch(/refreshToken/i);
  });

  it('omits meeting staff hash', () => {
    expect(MEETING_STAFF_SELECT.join(',')).not.toMatch(/hash/i);
  });
});
