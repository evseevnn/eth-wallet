import { render } from '@testing-library/react';

import HeadNav from './head-nav';

describe('HeadNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeadNav />);
    expect(baseElement).toBeTruthy();
  });
});
