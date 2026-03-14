// #region Imports
import { USER_DASHBOARD_API } from './user.service.js';
// #endregion Imports

// #region Exports
export const USER_CONTROLLER = {
  prepUserSummary,
  getTodosByUser,
};
// #endregion Exports

// #region Methods
/**
 * Method queries and parses user, cart and posts to get summary data
 * @returns User Summmary
 */
async function prepUserSummary() {
  // const userSummary = await USER_DASHBOARD_API.getUsers();
  const [usersData, postsData, cartsData] = await Promise.all([
    USER_DASHBOARD_API.getUsers(),
    USER_DASHBOARD_API.getAllPosts(),
    USER_DASHBOARD_API.getAllCarts(),
  ]);

  const postsByUser = new Map();
  postsData.posts.forEach((post) => {
    if (!postsByUser.has(post.userId)) {
      postsByUser.set(post.userId, []);
    }
    postsByUser.get(post.userId).push(post);
  });

  const cartsByUser = new Map();
  cartsData.carts.forEach((cart) => {
    if (!cartsByUser.has(cart.userId)) {
      cartsByUser.set(cart.userId, []);
    }
    cartsByUser.get(cart.userId).push(cart);
  });
  // JM_NOTE :: Calling Users/Posts individually doesnt make sense as
  // return Promise.all(
  //   userSummary.users.map(async (user) => {
  //     const [posts, carts] = await Promise.all([
  //       USER_DASHBOARD_API.getPostsByUser(user.id),
  //       USER_DASHBOARD_API.getCartsByUser(user.id),
  //     ]);
  //     return {
  //       userId: user.id,
  //       name: `${user.firstName} ${user.lastName}`,
  //       totalPosts: posts.total,
  //       totalPrice: carts.total,
  //     };
  //   })
  // );

  const summaries = usersData.users.map((user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    totalPosts: postsByUser.get(user.id)?.length || 0,
    cartTotal: (cartsByUser.get(user.id) || []).reduce(
      (sum, c) => sum + c.total,
      0
    ),
  }));
  return summaries;
}

/**
 * Method gets Todos By user
 * @param {*} userId 
 * @returns User Todos for the given User Id
 */
async function getTodosByUser(userId) {
  const getTodos = await USER_DASHBOARD_API.getTodosByUser(userId);
  return getTodos;
}
// #endregion Methods