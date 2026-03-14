// #region Constants
const BASE_URL = 'https://dummyjson.com';
// #endregion Constants

// #region Helper
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(
      'user.service :: fetchJSON :: Failed to fetch data :: ' + url
    );
  }
  return response.json();
}
// #endregion Helper

// #region APIs
export const USER_DASHBOARD_API = {
  getUsers() {
    return fetchJSON(`${BASE_URL}/users`);
  },
  /**
   * @type
   * limit: number
   * id: number
   * posts: { id: number, body: string, reactions: number, title: string, userId: string, views: , tags: string[], reactions: {likes: number, dislikes: number} }[]
   * total: number
   * skip: number
   */
  getPostsByUser(id) {
    return fetchJSON(`${BASE_URL}/posts/user/${id}`);
  },
  getAllPosts() {
    return fetchJSON(`${BASE_URL}/posts?limit=0`);
  },
  /**
   * @type
   * discountedToday: number
   * id: number
   * products: { id: number, title: string, price: number, quantity: number, total: number}[]
   * total: number
   * totalProducts: number
   * totalQuantity: number
   * userId: number
   */
  getCartsByUser(id) {
    return fetchJSON(`${BASE_URL}/carts/user/${id}`);
  },
  getAllCarts() {
    return fetchJSON(`${BASE_URL}/carts?limit=0`);
  },
  getTodosByUser(id) {
    return fetchJSON(`${BASE_URL}/todos/user/${id}`);
  },
};
// #endregion APIs
