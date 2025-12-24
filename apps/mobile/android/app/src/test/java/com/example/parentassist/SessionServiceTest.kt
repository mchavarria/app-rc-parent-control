package com.example.parentassist

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset

class SessionServiceTest {
    @Test
    fun createSessionUsesClockForExpiry() {
        val base = Instant.parse("2024-01-01T00:00:00Z")
        val clock = Clock.fixed(base, ZoneOffset.UTC)
        val service = MockSessionService(clock)

        val session = runBlockingTest { service.createSession() }

        assertEquals(base.plusSeconds(15 * 60), session.expiresAt)
        assertEquals(6, session.joinCode.length)
        assertTrue(session.viewerUrl.contains(session.joinCode))
    }
}

private fun <T> runBlockingTest(block: suspend () -> T): T {
    return kotlinx.coroutines.runBlocking { block() }
}
