import axios from 'axios'

export const HTTP = axios.create({
  baseURL: 'https://api.tcc.ericpires.com.br/'
})
