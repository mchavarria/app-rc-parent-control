package com.example.parentassist

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class SessionViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(dispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun startSessionRequiresConsent() = runTest {
        val viewModel = SessionViewModel(StubSessionService(), StubScreenShareController())

        viewModel.startSession()

        assertEquals(SessionState.Error("Please review and accept the sharing consent."), viewModel.state.value)
    }

    @Test
    fun stopSessionReturnsToIdle() = runTest {
        val session = ShareSession("id", "ABC123", java.time.Instant.now(), "https://example.com")
        val viewModel = SessionViewModel(StubSessionService(session), StubScreenShareController())

        viewModel.updateConsent(true)
        viewModel.startSession()
        dispatcher.scheduler.advanceUntilIdle()

        viewModel.stopSession()
        dispatcher.scheduler.advanceUntilIdle()

        assertEquals(SessionState.Idle, viewModel.state.value)
    }
}

private class StubSessionService(private val session: ShareSession? = null) : SessionService {
    override suspend fun createSession(): ShareSession {
        return session ?: ShareSession("test", "AAAAAA", java.time.Instant.now(), "https://example.com/join/AAAAAA")
    }

    override suspend fun stopSession(session: ShareSession) {
        session.toString()
    }
}

private class StubScreenShareController : ScreenShareController {
    override suspend fun startSharing() {}
    override suspend fun stopSharing() {}
}
