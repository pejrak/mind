import { Peer } from 'peerjs'
import { log } from '../utilities/log'
import { getPeerConnectionId } from './getPeerConnectionId'
import { dataIsTrusted } from './dataIsTrusted'
import {
  COLLECTION_RESPONSE_SIGNAL,
  COLLECTION_SIGNAL,
} from './constants'

const logger = log('PeerStore')

export const PeerStore = {
  state: {
    handler: null,
    id: null,
    connections: [],
  },
  getters: {
    connectionTo: (state) => (id) =>
      state.connections.find((c) => c.recipientId === id)?.connection,
    isConnected: ({ handler }) => handler !== null,
    myConnectionId: (_state, _getters, rootState) => {
      return getPeerConnectionId(rootState.authentication.userEmail)
    },
  },
  mutations: {
    newConnection(state, { connection, recipientId }) {
      state.connections = [
        ...state.connections,
        { connection, recipientId },
      ]
    },
    handler(state, conn) {
      state.handler = conn
    },
    id(state, id) {
      state.id = id
    },
  },
  actions: {
    connectMe({ commit, dispatch, getters, rootState }) {
      const connection = new Peer(getters.myConnectionId, {
        // debug: 3,
        host: 'localhost',
        port: 3000,
        path: '/peerjs',
      })
      commit('handler', connection)
      connection.on('open', (id) => {
        // logger.info('Connection open', id)
        commit('id', id)
      })
      connection.on('error', (err) => {
        logger.warn('Peer connection error', err)
      })
      connection.on('connection', (conn) => {
        conn.on('data', (data) => {
          logger.info(
            `From [${conn.peer}]: Received data`,
            data,
            conn,
          )
          const selectedPath =
            rootState.fragmentPaths.selectedFragmentPath
          if (
            dataIsTrusted({
              ...data,
              path: selectedPath,
              trusts: rootState.trusts.outgoing,
            })
          ) {
            logger.info('Data is trusted', data)
            dispatch('respondTo', {
              ...data,
              selectedPath,
            })
          } else {
            logger.warn(`Data isn't trusted`, data)
          }
        })
      })
    },
    async connectTo({ commit, state }, { recipientId, next }) {
      const existing = state.connections.find(
        (c) => recipientId === c.recipientId,
      )
      if (existing) {
        logger.info('Using existing connection', existing)
        return next(existing.connection)
      }
      const conn = state.handler.connect(recipientId)
      logger.info(`INIT >> ${recipientId}`)
      conn.on('open', () => {
        logger.info(`OPEN >> ${recipientId}`)
        commit('newConnection', { connection: conn, recipientId })
        next(conn)
      })
      conn.on('error', (error) => {
        logger.warn(`ERROR >> ${recipientId}`, error.message)
        return next(null)
      })
    },
    respondTo({ dispatch, rootGetters }, { sender, path, ...data }) {
      logger.info(`respondTo [S: ${data.signal}]`, sender, data)
      switch (data.signal) {
        case COLLECTION_RESPONSE_SIGNAL: {
          dispatch('fragments/addCollected', {
            fragments: data.fragments,
          }, { root: true })
          break
        }
        case COLLECTION_SIGNAL: {
          const fragments = rootGetters['fragments/onPath']({
            include: (fragment) =>
              fragment.memorized && fragment.privacyLevel > 0 && fragment.updatedAt > data.updatedAt,
            path,
          })
          if (fragments.length) {
            dispatch('sendTo', {
              recipient: sender,
              sender: data.recipient,
              signal: COLLECTION_RESPONSE_SIGNAL,
              fragments,
            })
          }
          break
        }
        default: {
          logger.info('unknown data signal', data)
        }
      }
    },
    async sendTo(
      { dispatch, rootState },
      {
        recipient,
        recipientId = getPeerConnectionId(recipient),
        ...payload
      },
    ) {
      const sender = rootState.authentication.userEmail
      logger.info('sendTo', recipient, payload)

      dispatch('connectTo', {
        recipientId,
        next: (conn) => {
          // logger.info(`Sending data [FROM: ${sender}]`, payload, conn)
          conn.send({
            ...payload,
            sender,
          })
        },
      })
    },
  },
}
