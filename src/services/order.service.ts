import Axios from './caller.service'

const fetchOrders = async () => {
  try {
    const response = await Axios.get('/orders', {
      params: {
        limit: 100, // adjust the limit as needed
      },
    })
    return response?.data?.docs
  } catch (error) {
    throw error
  }
}

const getOrderById = async (orderId: string) => {
  const res = await Axios.get(`/orders/${orderId}`, {
    params: {
      depth: 2, // adjust depth as needed
    },
  })
  return res.data ?? null
}

const cancelOrder = async (orderId: string | number) => {
  const res = await Axios.post(`/orders/${orderId}/cancel`)
  return res.data
}

export { cancelOrder, fetchOrders, getOrderById }
