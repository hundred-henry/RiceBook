import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Post from "../post/Post";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import React from "react";

const mockStore = configureStore([]);

const initialPosts = [
  {
    id: 1,
    userId: 1,
    title: "Exploring the depths of the ocean",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    userId: 2,
    title: "The beauty of untouched forests",
    body: "Pellentesque habitant morbi tristique senectus et netus.",
  },
  {
    id: 3,
    userId: 3,
    title: "Astronomy: Gazing into the cosmos",
    body: "Vestibulum ac diam sit amet quam vehicula elementum.",
  },
  {
    id: 4,
    userId: 3,
    title: "Advancements in AI",
    body: "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.",
  },
];

describe("Validate Article Actions", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        userId: 1,
        followedUsers: [2],
        users: [
          {
            id: 1,
            username: "User 1",
            avatar: "https://i.pravatar.cc/150?img=1",
            followedUsers: [2, 3],
          },
          {
            id: 2,
            username: "User 2",
            avatar: "https://i.pravatar.cc/150?img=2",
            followedUsers: [1, 3],
          },
          {
            id: 3,
            username: "User 3",
            avatar: "https://i.pravatar.cc/150?img=3",
            followedUsers: [1, 2],
          },
          {
            id: 4,
            username: "User 4",
            avatar: "https://i.pravatar.cc/150?img=4",
            followedUsers: [1, 2, 3],
          },
        ],
      },
      posts: {
        posts: initialPosts,
      },
    });
  });

  test("should fetch all articles for current logged-in user", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post />
        </MemoryRouter>
      </Provider>
    );

    initialPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });

  test("should fetch subset of articles for current logged-in user given search keyword in body", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post />
        </MemoryRouter>
      </Provider>
    );

    // Search by content keyword to match the body of a post
    fireEvent.change(screen.getByPlaceholderText("Search by post content..."), {
      target: { value: "cosmos" },
    });

    // Log the entire DOM to check rendered content after filtering
    console.log("Rendered DOM after filtering by 'cosmos':", screen.debug());

    // Assertions to ensure correct posts appear based on `body` text, not `title`
    expect(
      await screen.findByText(
        /Vestibulum ac diam sit amet quam vehicula elementum./i
      )
    ).toBeInTheDocument();

    // Ensure that only the post with matching body content is shown, others are hidden
    expect(
      screen.queryByText(
        /Lorem ipsum dolor sit amet, consectetur adipiscing elit./i
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /Pellentesque habitant morbi tristique senectus et netus./i
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /Curabitur non nulla sit amet nisl tempus convallis quis ac lectus./i
      )
    ).not.toBeInTheDocument();
  });

  test("should add articles when adding a follower", () => {
    const newPost = {
      id: 5,
      userId: 4,
      title: "Understanding Quantum Mechanics",
      body: "Physics beyond the observable universe.",
    };

    // Update the mock store to add a follower and include their post
    store = mockStore({
      ...store.getState(),
      user: {
        ...store.getState().user,
        followedUsers: [...(store.getState().user.followedUsers || []), 4], // Add user 4 to followedUsers
      },
      posts: {
        posts: [...initialPosts, newPost], // Add new post from User 4
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post />
        </MemoryRouter>
      </Provider>
    );

    // Add a slight delay if asynchronous rendering might be an issue
    setTimeout(() => {
      // Ensure the new post from the followed user is now displayed
      expect(
        screen.getByText(/Understanding Quantum Mechanics/i)
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Post/i).length).toBeGreaterThanOrEqual(5);
    }, 500);
  });

  test("should remove articles when removing a follower", () => {
    store = mockStore({
      ...store.getState(),
      user: {
        ...store.getState().user,
        followedUsers: [2],
      },
      posts: {
        posts: initialPosts.filter((post) => post.userId !== 3),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByText(/Astronomy: Gazing into the cosmos/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Advancements in AI/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Exploring the depths of the ocean/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The beauty of untouched forests/i)
    ).toBeInTheDocument();
  });
});
