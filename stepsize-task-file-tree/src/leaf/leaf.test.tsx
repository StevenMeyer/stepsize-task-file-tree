import {render, screen, waitFor} from '@testing-library/react';
import Leaf from './leaf';
import {FileIconsJs, WindowWithIcons} from './file-icons-js';

// adding this type as the IDE isn't picking up both return types
let mockedFn: jest.Mock<Promise<string[] | string>, [name: string, options: {array?: boolean; color?: boolean} | undefined]>;

beforeEach(() => {
  mockedFn = jest.fn();
  (window as WindowWithIcons).icons = {
    getClass: mockedFn as FileIconsJs['getClass']
  };
  mockedFn.mockResolvedValue('icon js-icon medium-yellow');
});

it('renders the node name', async () => {
  render(<Leaf fileName="awesome-file.json" />);
  const name = await screen.findByText('awesome-file.json');
  expect(name).toBeInTheDocument();
});

it('renders the file icon', async () => {
  render(<Leaf fileName="awesome-file.json" />);
  const icon = await screen.findByRole('presentation');
  await waitFor(() => {
    // awesome-file.json should not be getting a js-icon IRL, this is just showing that the mock value was used
    expect(icon).toHaveClass('js-icon');
  });
  expect(mockedFn).toHaveBeenCalledTimes(1);
  expect(mockedFn).toHaveBeenCalledWith('awesome-file.json', expect.anything());
});

it('renders the collapsed icon', async () => {
  render(<Leaf fileName={'awesome-file.json'} expanded={false} hasChildren={true} />);
  const icon = await screen.findByRole('presentation');
  await waitFor(() => {
    expect(icon.parentElement).toHaveClass('node-leaf--collapsed');
  });
});

it('renders the expanded icon', async () => {
  render(<Leaf fileName={'awesome-file.json'} expanded={true} hasChildren={true} />);
  const icon = await screen.findByRole('presentation');
  await waitFor(() => {
    expect(icon.parentElement).toHaveClass('node-leaf--expanded');
  });
});