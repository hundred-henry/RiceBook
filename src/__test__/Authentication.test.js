import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { loginUser, logoutUser } from "../features/userSlice";
import LandingPage from "../landing/LandingPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

const mockStore = configureStore([]);
jest.mock("../features/userSlice", () => ({
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Authentication Tests", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        userId: null,
        users: [
          {
            id: 1,
            username: "Bret",
            address: { street: "Kulas Light" },
          },
        ],
      },
    });
    store.dispatch = jest.fn();
    jest.clearAllMocks();
  });

  test("should log in a previously registered user", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </Provider>
    );

    // Simulate filling in login details
    fireEvent.change(screen.getByLabelText("Login Username"), {
      target: { value: "Bret" },
    });
    fireEvent.change(screen.getByLabelText("Login Password"), {
      target: { value: "Kulas Light" },
    });

    // Simulate login
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check that loginUser is dispatched
    expect(store.dispatch).toHaveBeenCalledWith(loginUser({ userId: 1 }));
    expect(mockNavigate).toHaveBeenCalledWith("/main");
  });

  test("should not log in an invalid user", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </Provider>
    );

    // Simulate invalid login details
    fireEvent.change(screen.getByLabelText("Login Username"), {
      target: { value: "InvalidUser" },
    });
    fireEvent.change(screen.getByLabelText("Login Password"), {
      target: { value: "WrongPassword" },
    });

    // Simulate login attempt
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Expect error message
    expect(
      screen.getByText(/invalid username or password/i)
    ).toBeInTheDocument();
    expect(store.dispatch).not.toHaveBeenCalledWith(loginUser({ userId: 1 }));
  });
});
