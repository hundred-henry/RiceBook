import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, clearUserState } from "../../store/userSlice";
import api from "../../utils/api";
import {
  fetchFollowing,
  addFollowing,
  removeFollowing,
} from "../../store/followingSlice";
import {
  fetchHeadline,
  updateHeadline,
  fetchAvatar,
} from "../../store/profileSlice";

const useUserDetails = (username) => {
  const dispatch = useDispatch();
  const headline = useSelector((state) => state.profile.headline);
  const avatar = useSelector((state) => state.profile.avatar);

  useEffect(() => {
    if (username) {
      // 使用 dispatch 来调用 fetchHeadline 和 fetchAvatar
      dispatch(fetchHeadline(username));
      dispatch(fetchAvatar(username));
    }
  }, [username, dispatch]);

  return { headline, avatar };
};

const useFollowingUsers = (username) => {
  const dispatch = useDispatch();
  const followingUsers = useSelector((state) => state.following.followingUsers);
  const [followingUserAvatars, setFollowingUserAvatars] = useState({});
  const [followingUserHeadlines, setFollowingUserHeadlines] = useState({});
  const [loadingFollowingDetails, setLoadingFollowingDetails] = useState(false);

  useEffect(() => {
    if (username) {
      dispatch(fetchFollowing()).unwrap();
    }
  }, [username, dispatch]);

  useEffect(() => {
    const fetchFollowingDetails = async () => {
      if (followingUsers.length > 0) {
        setLoadingFollowingDetails(true);
        try {
          const avatars = {};
          const headlines = {};

          await Promise.all(
            followingUsers.map(async (user) => {
              try {
                const avatarResponse = await api.get(`/avatar/${user}`);
                const headlineResponse = await api.get(`/headline/${user}`);
                avatars[user] = avatarResponse.avatar;
                headlines[user] = headlineResponse.headline;
              } catch (error) {
                console.error(
                  `Error fetching details for user ${user}:`,
                  error
                );
              }
            })
          );

          setFollowingUserAvatars(avatars);
          setFollowingUserHeadlines(headlines);
        } catch (error) {
          console.error("Error fetching following users details:", error);
        } finally {
          setLoadingFollowingDetails(false);
        }
      }
    };

    if (followingUsers.length > 0) {
      fetchFollowingDetails();
    }
  }, [followingUsers]);

  return {
    followingUsers,
    followingUserAvatars,
    followingUserHeadlines,
    loadingFollowingDetails,
  };
};

const useUserActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [followerMessage, setFollowerMessage] = useState(null);
  const [newFollower, setNewFollower] = useState("");
  const [newUserHeadline, setNewUserHeadline] = useState("");

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearUserState()); // 确保 Redux 中的用户信息被清除
      navigate("/login"); // 登出成功后，导航到登陆页面
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddFollower = async () => {
    try {
      await dispatch(addFollowing(newFollower)).unwrap();
      setFollowerMessage({
        type: "success",
        text: `Successfully followed ${newFollower}`,
      });
    } catch (error) {
      setFollowerMessage({
        type: "error",
        text: `User "${newFollower}" does not exist or cannot be followed`,
      });
    } finally {
      setNewFollower("");
    }
  };

  const handleUnfollow = async (unfollowedUsername) => {
    try {
      await dispatch(removeFollowing(unfollowedUsername)).unwrap();
      setFollowerMessage({
        type: "success",
        text: `Successfully unfollowed ${unfollowedUsername}`,
      });
    } catch (error) {
      setFollowerMessage({
        type: "error",
        text: `Failed to unfollow ${unfollowedUsername}`,
      });
      console.error("Failed to unfollow user:", error);
    }
  };

  const handleUpdateUserHeadline = async () => {
    if (newUserHeadline.trim()) {
      try {
        await dispatch(
          updateHeadline({
            newHeadline: newUserHeadline,
          })
        ).unwrap();
        setNewUserHeadline("");
      } catch (error) {
        console.error("Failed to update headline:", error);
      }
    }
  };

  return {
    followerMessage,
    setFollowerMessage,
    newFollower,
    setNewFollower,
    newUserHeadline,
    setNewUserHeadline,
    handleLogout,
    handleAddFollower,
    handleUnfollow,
    handleUpdateUserHeadline,
  };
};

const LeftBarLogic = () => {
  const username = useSelector((state) => state.user.currentUser?.username); // 假设 Redux 中存有当前用户的 username

  const { headline, avatar } = useUserDetails(username);
  const {
    followingUsers,
    followingUserAvatars,
    followingUserHeadlines,
    loadingFollowingDetails,
  } = useFollowingUsers(username);

  const userActions = useUserActions();

  return {
    username,
    headline,
    avatar,
    followingUsers,
    followingUserAvatars,
    followingUserHeadlines,
    loadingFollowingDetails,
    ...userActions,
  };
};

export default LeftBarLogic;
