import Axios from 'axios'

const getUserOrders = async (customerEmail: string) => {
  const res = await Axios.get(`/api/orders?customerEmail=${customerEmail}`)
  return res.data
}

export { getUserOrders }
