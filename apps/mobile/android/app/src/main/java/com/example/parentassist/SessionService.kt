package com.example.parentassist

import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.UUID

interface SessionService {
    suspend fun createSession(): ShareSession
    suspend fun stopSession(session: ShareSession)
}

class MockSessionService(
    private val clock: Clock = Clock.systemUTC()
) : SessionService {
    override suspend fun createSession(): ShareSession {
        val sessionId = UUID.randomUUID().toString()
        val joinCode = sessionId.take(6).uppercase()
        val expiresAt = Instant.now(clock).plus(Duration.ofMinutes(15))
        val viewerUrl = "https://example.com/join/$joinCode"
        return ShareSession(sessionId, joinCode, expiresAt, viewerUrl)
    }

    override suspend fun stopSession(session: ShareSession) {
        session.toString()
    }
}
