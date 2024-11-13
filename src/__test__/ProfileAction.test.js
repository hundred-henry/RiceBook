import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import ProfilePage from "../profile/ProfilePage";
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

describe("ProfilePage Actions", () => {
  let store;

  beforeEach(() => {
    // 模拟登录的用户信息
    store = mockStore({
      user: {
        userId: 1,  // 模拟登录用户ID
        users: [
          {
            id: 1,
            username: "Bret",
            address: { street: "Kulas Light", zipcode: "92998-3874" },
            name: "Leanne Graham",
            email: "Sincere@april.biz",
            phone: "1234567890",
            avatar: "https://i.pravatar.cc/150?img=1",
          },
        ],
      },
    });
  });

  test("should fetch the logged in user's profile username", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    );

    // 检查页面中是否正确显示用户名
    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bret")).toBeInTheDocument(); // 显示的 username 应为 "testuser"
  });
});
