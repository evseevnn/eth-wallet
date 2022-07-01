import { render } from '@testing-library/react';

import SendTransactionForm from './send-transaction-form';

describe('SendTransactionForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SendTransactionForm />);
    expect(baseElement).toBeTruthy();
  });
});
