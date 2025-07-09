'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface SessionNote {
  id: string
  date: string
  clientName: string
  sessionDuration: string
  transcription: string
  aiAnalysis: {
    keyThemes: string[]
    treatmentGoals: string[]
    progressMarkers: string[]
    riskFactors: string[]
    nextSteps: string[]
    emotionalState: string
    sessionFocus: string
    clientEngagement: string
  }
  selectedTemplate: string
  templateName: string
  status: 'draft' | 'completed'
  createdAt: string
  updatedAt: string
}

interface SessionNotesState {
  sessions: SessionNote[]
  currentSession: SessionNote | null
  isLoading: boolean
  error: string | null
}

type SessionNotesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_SESSION'; payload: SessionNote }
  | { type: 'UPDATE_SESSION'; payload: SessionNote }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'SET_CURRENT_SESSION'; payload: SessionNote | null }
  | { type: 'LOAD_SESSIONS'; payload: SessionNote[] }
  | { type: 'CLEAR_SESSIONS' }

const initialState: SessionNotesState = {
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null
}

function sessionNotesReducer(state: SessionNotesState, action: SessionNotesAction): SessionNotesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [action.payload, ...state.sessions],
        currentSession: null
      }
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        ),
        currentSession: state.currentSession?.id === action.payload.id ? action.payload : state.currentSession
      }
    
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload),
        currentSession: state.currentSession?.id === action.payload ? null : state.currentSession
      }
    
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload }
    
    case 'LOAD_SESSIONS':
      return { ...state, sessions: action.payload }
    
    case 'CLEAR_SESSIONS':
      return { ...state, sessions: [], currentSession: null }
    
    default:
      return state
  }
}

interface SessionNotesContextType {
  state: SessionNotesState
  addSession: (session: Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateSession: (session: SessionNote) => void
  deleteSession: (id: string) => void
  setCurrentSession: (session: SessionNote | null) => void
  getSessionById: (id: string) => SessionNote | undefined
  getRecentSessions: (limit?: number) => SessionNote[]
  clearAllSessions: () => void
}

const SessionNotesContext = createContext<SessionNotesContextType | undefined>(undefined)

export function SessionNotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sessionNotesReducer, initialState)

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('cartha-session-notes')
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions) as SessionNote[]
        dispatch({ type: 'LOAD_SESSIONS', payload: sessions })
      }
    } catch (error) {
      console.error('Error loading sessions from localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved sessions' })
    }
  }, [])

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    try {
      localStorage.setItem('cartha-session-notes', JSON.stringify(state.sessions))
    } catch (error) {
      console.error('Error saving sessions to localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save sessions' })
    }
  }, [state.sessions])

  const generateId = (): string => {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const addSession = (sessionData: Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newSession: SessionNote = {
      ...sessionData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    }
    dispatch({ type: 'ADD_SESSION', payload: newSession })
  }

  const updateSession = (session: SessionNote) => {
    const updatedSession = {
      ...session,
      updatedAt: new Date().toISOString()
    }
    dispatch({ type: 'UPDATE_SESSION', payload: updatedSession })
  }

  const deleteSession = (id: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: id })
  }

  const setCurrentSession = (session: SessionNote | null) => {
    dispatch({ type: 'SET_CURRENT_SESSION', payload: session })
  }

  const getSessionById = (id: string): SessionNote | undefined => {
    return state.sessions.find(session => session.id === id)
  }

  const getRecentSessions = (limit: number = 10): SessionNote[] => {
    return state.sessions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  const clearAllSessions = () => {
    dispatch({ type: 'CLEAR_SESSIONS' })
  }

  const value: SessionNotesContextType = {
    state,
    addSession,
    updateSession,
    deleteSession,
    setCurrentSession,
    getSessionById,
    getRecentSessions,
    clearAllSessions
  }

  return (
    <SessionNotesContext.Provider value={value}>
      {children}
    </SessionNotesContext.Provider>
  )
}

export function useSessionNotes() {
  const context = useContext(SessionNotesContext)
  if (context === undefined) {
    throw new Error('useSessionNotes must be used within a SessionNotesProvider')
  }
  return context
} 