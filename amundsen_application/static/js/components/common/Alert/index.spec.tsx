// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { mount } from 'enzyme';

import { ImageIconType } from 'interfaces/Enums';
import Alert, { AlertProps } from '.';

const setup = (propOverrides?: Partial<AlertProps>) => {
  const props: AlertProps = {
    message: 'Test Message',
    onAction: jest.fn(),
    ...propOverrides,
  };
  const wrapper = mount(<Alert {...props} />);

  return { props, wrapper };
};

describe('Alert', () => {
  describe('render', () => {
    it('should render an alert icon', () => {
      const { wrapper } = setup();
      const expected = 1;
      const actual = wrapper.find(`.${ImageIconType.ALERT}`).length;

      expect(actual).toEqual(expected);
    });

    it('should render the alert message text', () => {
      const { props, wrapper } = setup();
      const expected = props.message;
      const actual = wrapper.find('.alert-message').text();

      expect(actual).toEqual(expected);
    });

    describe('when passing an action text and action handler', () => {
      it('should render the action button', () => {
        const { wrapper } = setup({ actionText: 'Action Text' });
        const expected = 1;
        const actual = wrapper.find('.btn-link').length;

        expect(actual).toEqual(expected);
      });

      it('should render the action text', () => {
        const { props, wrapper } = setup({ actionText: 'Action Text' });
        const expected = props.actionText;
        const actual = wrapper.find('.btn-link').text();

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('lifetime', () => {
    describe('when clicking on the action button', () => {
      it('should call the handler', () => {
        const handlerSpy = jest.fn();
        const { wrapper } = setup({
          actionText: 'Action Text',
          onAction: handlerSpy,
        });
        const expected = 1;

        wrapper.find('button.btn-link').simulate('click');

        const actual = handlerSpy.mock.calls.length;

        expect(actual).toEqual(expected);
      });
    });
  });
});