// Write your tests here
import AppClass from './AppClass'
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';


test('sanity', () => {
  expect(true).toBe(true)
})

test('renders without errors', () => {
  render(<AppClass />);
});

test( "You can't go up", () => {
  render(<AppClass />);
  const up = document.querySelector('#up')
  const message = document.querySelector('#message')
  fireEvent.click(up);
  fireEvent.click(up);
  expect(message.textContent).toBe("You can't go up")
})

test( "You can't go right", () => {
  render(<AppClass />);
  const up = document.querySelector('#right')
  const message = document.querySelector('#message')
  fireEvent.click(up);
  fireEvent.click(up);
  expect(message.textContent).toBe("You can't go right")
})

test( "reset button clears input", () => {
  render(<AppClass />);
  const button = document.querySelector('#reset')
  const input = document.querySelector('#email')
  fireEvent.click(button);
  expect(input.value).toBe("")
})

test( "submit returns a message", () => {
  render(<AppClass />);
  const button = document.querySelector('#submit')
  const message = document.querySelector('#message')
  fireEvent.click(button);
  expect(message.value).toBeTruthy
})



