import axios from 'axios'

export const HTTP = axios.create({
  baseURL: 'https://tcc.ericpires.com.br/'
})
