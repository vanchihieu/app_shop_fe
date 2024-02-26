import axios from 'axios'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

// ** Types
import { TLoginAuth, TRegisterAuth, TChangePassword } from 'src/types/auth'

export const loginAuth = async (data: TLoginAuth) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login`, data)

  return res.data
}

export const logoutAuth = async () => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.AUTH.INDEX}/logout`)

    return res.data
  } catch (error) {
    return null
  }
}

export const registerAuth = async (data: TRegisterAuth) => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/register`, data)

    return res.data
  } catch (error) {
    return error
  }
}
